#!/usr/bin/env python3
"""Validate video-projects/<slug>/storyboard.json against the voice-over cues, the assets and the Earworm sync rules.

  tools/.venv/bin/python tools/studio/validate_storyboard.py <slug> [--vo scratch|user] [--write-anchors] [-q]

Checks (exit 1 on any ERROR):
  schema        storyboard.schema.json (needs `jsonschema`; skipped with a note otherwise)
  anchors       every anchor word exists in the cues (nth occurrence); prints the resolved frame; scene refs exist, starts increase
  assets        every `assets/..` / `audio/..` / `kit:..` file exists and has a credits entry (CREDITS.md, a `<id>.json` sourcing
                sidecar, or a kit CREDITS.md / SOURCES.md); video footage (mp4 / webm / mov) needs a CREDITS.md line naming the file
  cuts          no two cuts (scene starts, `cut` / `phrase` events) closer than 6 f (profile standard: 3 f into a scene marked `burst`)
  text          text-type events (text, title, name, caption, lyric, pop) stay >= 0.6 s on screen
  beats         `snap` is only allowed in music-only passages: ERROR on a cut under narration; WARN when a cut under narration
                lands within +-2 f of a beat of a music track that has `cues` (cuts are never placed on beats, doc 11 rule 3)
  profile       `standard` (any look but voxEarworm, or `"profile": "standard"`): phrase cuts should sit on a phrase's first word (WARN),
                SFX budget <= 1.5 per minute (+1), music boundaries <= 2 per minute and on a cut (WARN), chapter holes 5-29 f
                and the next cue 0-6 f after the cut. `earworm`: the checks above unchanged
  extras        SFX budget (~1 per 13 s; per profile), overlapping transition windows, scene shorter than 1 s, unknown recipe events
--write-anchors rewrites storyboard.json `anchors` (id + word#nth of every word anchor) so tools/studio/recue.py reports them.
"""
import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from storyboard_common import ASSET, ROOT, ANCHOR_KEY_NAME, is_anchor, load_json, project_dir, referenced_assets, rnd  # noqa: E402

KIND = {  # frames @25 (SYNC in src/audio/defaults.ts), default edge
    "cut": (0, "start"), "object": (1, "start"), "text": (-7, "start"), "pop": (1, "stress"), "title": (10, "start"),
    "caption": (-4, "start"), "lyric": (1, "start"), "name": (4, "start"), "exit": (0, "start"),
    "phrase": (-3, "start"), "highlight": (1, "start"), "lowerThird": (2, "start"),  # new, both profiles (src/audio/profiles.ts)
}
# per-profile limits (src/audio/profiles.ts): default scene-start kind, cut gaps, SFX budget / min, music boundaries / min, cue after the cut
PROFILES = {
    "earworm": {"cut_kind": "cut", "gap": 6, "burst_gap": 6, "sfx_per_min": 60 / 13, "bound_per_min": 12, "cue_after": -3.5, "transition_sfx": True},
    "standard": {"cut_kind": "phrase", "gap": 6, "burst_gap": 3, "sfx_per_min": 1.5, "bound_per_min": 2, "cue_after": 3, "transition_sfx": False},
    # voxScrapbook (analysis/vox-sample/vox_braintravel.md §7): phrase cuts lead by 6 f, transitions keep their sounds, ~3 SFX/min
    "scrapbook": {"cut_kind": "phrase", "gap": 6, "burst_gap": 3, "sfx_per_min": 3, "bound_per_min": 2, "cue_after": 0, "transition_sfx": True, "phrase_off": -6},
}
VIDEO_EXT = {".mp4", ".webm", ".mov"}  # footage (FootageClip): its CREDITS.md line must name the file (a sourcing sidecar or a stem match is not enough)
HOLE_RANGE = (5, 29)
CUE_AFTER_RANGE = (0, 6)
TEXT_KINDS = {"text", "title", "name", "caption", "lyric", "pop"}
SPANS = {"blurThrough": (4, 14), "spinSwap": (16, 20), "dip": (35, 36), "drop": (40, 17), "glitchCut": (10, 19), "paperSlide": (0, 12)}
DIP_CHAPTER = (14, 8)
SFX_OF = {"blurThrough": 1, "spinSwap": 1, "dip": 1, "drop": 0, "glitchCut": 3, "paperSlide": 1}
norm = lambda s: re.sub(r"[\W_]+", "", s.lower())  # noqa: E731


class Ctx:
    def __init__(self, sb, cues):
        self.sb, self.cues = sb, cues
        self.fps = sb["fps"]
        self.k = self.fps / cues["fps"]
        self.lead = rnd(sb.get("vo", {}).get("leadSec", 0) * self.fps)
        self.words = [(norm(w["text"]), w) for w in cues["words"]]
        self.profile = sb.get("profile") or ("earworm" if sb.get("look") in (None, "voxEarworm") else "scrapbook" if sb.get("look") == "voxScrapbook" else "standard")
        self.P = PROFILES[self.profile]
        self.errors, self.warnings, self.report = [], [], []
        self.start_cache = {}
        self.where = "storyboard"

    def err(self, m):
        self.errors.append(f"{self.where}: {m}")

    def warn(self, m):
        self.warnings.append(f"{self.where}: {m}")

    def F(self, f):
        return rnd(f * self.k)

    def word_frame(self, a, edge):
        n, hit = a.get("nth", 1), 0
        for t, w in self.words:
            if t == norm(a["word"]):
                hit += 1
                if hit == n:
                    if edge == "end":
                        return self.F(w["frame_end"])
                    if edge == "stress":
                        return self.F(w.get("stress_frame", w.get("onset_frame", w["frame_start"])))
                    return self.F(w.get("onset_frame", w["frame_start"]))
        return None

    def silence_before(self, a):
        """seconds between the end of the previous word and the onset of the anchored word (None: first word / not found)"""
        n, hit = a.get("nth", 1), 0
        for i, (t, w) in enumerate(self.words):
            if t == norm(a["word"]):
                hit += 1
                if hit == n:
                    return w["start"] - self.words[i - 1][1]["end"] if i else None
        return None

    def anchor(self, a, def_kind, is_until=False, label=""):
        kind = a.get("kind") or def_kind
        off0, edge0 = KIND[kind] if kind else (0, "start")
        if kind == "phrase":
            off0 = self.P.get("phrase_off", off0)
        if "word" in a:
            off = a["offset"] if "offset" in a else (0 if is_until else rnd(off0 * self.fps / 25))
            base = self.word_frame(a, a.get("edge", edge0))
            if base is None:
                self.err(f'word "{a["word"]}"{"#" + str(a["nth"]) if a.get("nth") else ""} not found in the voice-over cues')
                return 0
            f = base + off + self.lead
            self.report.append((self.where, label or "word", f'{a["word"]}{"#" + str(a["nth"]) if a.get("nth") else ""}/{a.get("edge", edge0)}{off:+d}', f))
        elif "sec" in a:
            f = rnd(a["sec"] * self.fps) + a.get("offset", 0)
        elif "after" in a:
            f = self.scene_end(self.idx(a["after"])) + a.get("offset", 0)
        else:
            f = self.video_end() + a.get("offset", 0)
        return f

    def idx(self, sid):
        for i, s in enumerate(self.sb["scenes"]):
            if s["id"] == sid:
                return i
        self.err(f'unknown scene "{sid}"')
        return 0

    def scene_start(self, i):
        s = self.sb["scenes"][i]
        if s["id"] in self.start_cache:
            return self.start_cache[s["id"]]
        self.start_cache[s["id"]] = 0  # cycle guard
        prev, self.where = self.where, f'scene "{s["id"]}" start'
        f = self.anchor(s["start"], self.P["cut_kind"], label="start")
        self.where = prev
        self.start_cache[s["id"]] = f
        return f

    def scene_end(self, i):
        s = self.sb["scenes"][i]
        if "end" in s:
            prev, self.where = self.where, f'scene "{s["id"]}" end'
            f = self.anchor(s["end"], None, True, "end")
            self.where = prev
            return f
        return self.scene_start(i + 1) if i + 1 < len(self.sb["scenes"]) else self.video_end()

    def video_end(self):
        e = self.sb.get("end", {})
        i = self.idx(e["scene"]) if e.get("scene") else len(self.sb["scenes"]) - 1
        return self.scene_start(i) + rnd(e.get("tailSec", 4) * self.fps)

    def speaking(self, f):
        sp = self.cues.get("speech", [])
        j = rnd((f - self.lead) / self.k)
        return 0 <= j < len(sp) and sp[j] > 0


def prop_anchors(v, key=None):
    """(key, anchor) for every anchor-valued prop"""
    if isinstance(v, list):
        for x in v:
            yield from prop_anchors(x)
    elif isinstance(v, dict):
        if key and ANCHOR_KEY_NAME.search(key) and is_anchor(v):
            yield key, v
        else:
            for k, x in v.items():
                yield from prop_anchors(x, k)


def catalog_paths():
    """public/-relative paths the shared asset catalog knows (public/assets/library/catalog.json)"""
    p = os.path.join(ROOT, "public", "assets", "library", "catalog.json")
    if not os.path.exists(p):
        return set()
    out = set()
    for x in load_json(p).get("assets", []):
        out.add(x["path"])
        out.update(x.get("files", []))
    return out


def credit_ok(rel, slug):
    base = os.path.basename(rel)
    stem = re.sub(r"(_bw|_cut)$", "", os.path.splitext(base)[0])
    if rel.startswith("kit:"):
        r = rel[4:]
        if r.startswith("audio/sfx/"):
            return True  # procedural (tools/audio/make_sfx.py)
        texts = []
        for dp, _, fs in os.walk(os.path.join(ROOT, "public", "assets")):
            for fn in fs:
                if fn in ("CREDITS.md", "SOURCES.md", "catalog.json", "manifest.json", "README.md"):
                    texts.append(open(os.path.join(dp, fn), errors="ignore").read())
        return any(base in t or stem in t for t in texts)
    pdir = project_dir(slug)
    cp = os.path.join(pdir, "CREDITS.md")
    txt = open(cp, errors="ignore").read() if os.path.exists(cp) else ""
    if os.path.splitext(base)[1].lower() in VIDEO_EXT:
        return base in txt
    side = os.path.join(pdir, os.path.dirname(rel), stem + ".json")
    return base in txt or stem in txt or os.path.exists(side)


def _events_in(path):
    if not os.path.exists(path):
        return {}
    t = open(path).read()
    return {m.group(1): set(re.findall(r'"([^"]+)"', m.group(2))) for m in re.finditer(r"\"?(\w+)\"?: \{ component: \w+, events: \[([^\]]*)\]", t)}


def known_events():
    """recipe -> events it reads: src/recipes/index.ts plus the portrait registry src/recipes/short/index.ts"""
    return {**_events_in(os.path.join(ROOT, "src", "recipes", "index.ts")), **_events_in(os.path.join(ROOT, "src", "recipes", "short", "index.ts"))}


def portrait_recipes():
    """portrait-only recipes (`format: "short"`): the registry of src/recipes/short/index.ts plus the reserved `Short*` names of the schema"""
    return set(_events_in(os.path.join(ROOT, "src", "recipes", "short", "index.ts"))) | {"ShortHook", "ShortPhoto", "ShortDocument", "ShortTimeline", "ShortSteps", "ShortQuote", "ShortEnd"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--vo", choices=["scratch", "user"])
    ap.add_argument("--write-anchors", action="store_true")
    ap.add_argument("-q", action="store_true", help="only the problems")
    a = ap.parse_args()
    pdir = project_dir(a.slug)
    sbp = os.path.join(pdir, "storyboard.json")
    sb = load_json(sbp)
    proj = load_json(os.path.join(pdir, "project.json")) if os.path.exists(os.path.join(pdir, "project.json")) else {}
    cp = {"scratch": os.path.join(pdir, "audio", "vo_scratch.cues.json"), "user": os.path.join(pdir, "audio", "vo.cues.json")}.get(a.vo) \
        or os.path.join(ROOT, proj.get("cues", f"video-projects/{a.slug}/audio/vo.cues.json"))
    cues = load_json(cp)
    errors, warnings = [], []

    try:
        import jsonschema
        schema = load_json(os.path.join(ROOT, "src", "studio", "storyboard.schema.json"))
        for e in sorted(jsonschema.Draft202012Validator(schema).iter_errors(sb), key=lambda e: list(e.path)):
            errors.append(f"schema: /{'/'.join(map(str, e.path))}: {e.message[:160]}")
    except ImportError:
        warnings.append("schema: jsonschema not installed, schema check skipped")
    if errors:
        for e in errors:
            print("ERROR", e)
        sys.exit(1)

    c = Ctx(sb, cues)
    scenes = sb["scenes"]
    ids = [s["id"] for s in scenes]
    if len(set(ids)) != len(ids):
        c.err("duplicate scene ids")
    starts = [c.scene_start(i) for i in range(len(scenes))]
    ends = [c.scene_end(i) for i in range(len(scenes))]
    end = c.video_end()
    evmap = known_events()
    cuts = []  # (frame, label, under_narration_ok)
    textev = []
    winmap = {}
    holes = {}  # cut frame -> hole frames
    burst = {}  # cut frame -> its scene is a declared burst
    phrase_cuts = []

    short = sb.get("format") == "short"
    portrait = portrait_recipes()
    c.where = "storyboard"
    if sb.get("captions") and not short:
        c.err('`captions` needs `"format": "short"` (burned-in captions are laid out on the 1080x1920 frame)')
    cap = sb.get("captions")
    if isinstance(cap, dict):
        if cap.get("pos") == "split":
            c.warn('`captions.pos: "split"` is the old name of `"seam"`')
        for k, v in (cap.get("replace") or {}).items():
            if not k.strip() or not isinstance(v, str) or not v.strip():
                c.err(f"`captions.replace` entry {k!r}: needs a spoken phrase and a non-empty display text")
    if sb.get("shortBand") and not short:
        c.warn('`shortBand` only applies to `"format": "short"`')
    sc = (sb.get("shortBand") or {}).get("scale")
    if sc is not None and not (isinstance(sc, (int, float)) and 0.3 <= sc <= 1.2):
        c.err("`shortBand.scale` must be a number between 0.3 and 1.2 (default 0.63)")
    if (sb.get("debug") or {}).get("safeArea") and not short:
        c.warn('`debug.safeArea` only draws in `"format": "short"`')

    for i, s in enumerate(scenes):
        c.where = f'scene "{s["id"]}"'
        if s["recipe"] in portrait and not short:
            c.err(f'{s["recipe"]} is a portrait-only recipe: it needs `"format": "short"` (landscape storyboards render 1920x1080)')
        elif short and s["recipe"] not in portrait:
            c.warn(f'{s["recipe"]} is a landscape recipe: in a short it renders as a centred 16:9 band (x0.63) on the look\'s ground (use a Short* recipe for full-frame portrait)')
        if s.get("captionPos") == "split":
            c.warn('`captionPos: "split"` is the old name of `"seam"`')
        if s.get("captionPos") and not (short and sb.get("captions")):
            c.warn("`captionPos` has no effect without `\"format\": \"short\"` and `captions`")
        if i and starts[i] <= starts[i - 1]:
            c.err(f"starts at f{starts[i]}, not after the previous scene (f{starts[i - 1]})")
        if ends[i] - starts[i] < c.fps:
            c.warn(f"only {(ends[i] - starts[i]) / c.fps:.2f} s long")
        cuts.append((starts[i], f'scene "{s["id"]}" start', s["start"]))
        burst[starts[i]] = bool(s.get("burst"))
        if "word" in s["start"] and (s["start"].get("kind") or c.P["cut_kind"]) == "phrase":
            phrase_cuts.append((starts[i], f'scene "{s["id"]}" start', s["start"]))
        for e in s.get("events", []):
            c.where = f'scene "{s["id"]}" event "{e["id"]}"'
            if e["id"] not in evmap.get(s["recipe"], set()) and evmap.get(s["recipe"]):
                c.warn(f'{s["recipe"]} does not read an event "{e["id"]}" (reads: {", ".join(sorted(evmap[s["recipe"]]))})')
            kind = e.get("kind") or e["at"].get("kind") or "object"
            f = c.anchor(e["at"], kind, label="event")
            until = c.anchor(e["until"], None, True, "until") if "until" in e else ends[i]
            if kind in ("cut", "phrase"):
                cuts.append((f, c.where, e["at"]))
            if kind == "phrase" and "word" in e["at"]:
                phrase_cuts.append((f, c.where, e["at"]))
            if kind in TEXT_KINDS:
                textev.append((c.where, f, until))
            if f < starts[i] - c.fps:
                c.warn(f"fires {(starts[i] - f) / c.fps:.1f} s before its scene starts")
        c.where = f'scene "{s["id"]}" props'
        for key, an in prop_anchors(s.get("props", {})):
            c.anchor(an, "object", key.lower().endswith("until"), key)
        t = s.get("transitionIn") or (scenes[i - 1].get("transitionOut") if i else None)
        if t and t.get("hole") is not None:
            if t["kind"] != "cut":
                c.err("`hole` is only valid on a `cut` transition")
            elif not HOLE_RANGE[0] <= t["hole"] <= HOLE_RANGE[1]:
                c.warn(f'hole {t["hole"]} f is outside the measured range {HOLE_RANGE[0]}-{HOLE_RANGE[1]} f')
            holes[starts[i]] = t["hole"]
        if t and t["kind"] != "cut":
            pre, post = DIP_CHAPTER if (t["kind"] == "dip" and t.get("variant") == "chapter") else SPANS[t["kind"]]
            winmap[s["id"]] = (starts[i] - pre, starts[i] + post)
    c.where = "storyboard"

    # cuts >= 6 f apart (starts, cut events, transition cut frames)
    srt = sorted(cuts, key=lambda x: x[0])
    for (f1, l1, _), (f2, l2, _) in zip(srt, srt[1:]):
        gap = c.P["burst_gap"] if burst.get(f2) else c.P["gap"]
        if f2 - f1 < gap:
            c.err(f"cuts closer than {gap} f: {l1} f{f1} and {l2} f{f2} ({f2 - f1} f)")
    # standard / scrapbook: a phrase cut belongs on the first word of a phrase (>= pauseMs of silence before the word's onset)
    if c.profile in ("standard", "scrapbook"):
        for f, label, an in phrase_cuts:
            c.where = label
            gap = c.silence_before(an)
            if gap is not None and gap < c.cues.get("pause_ms", 250) / 1000:
                c.warn(f'phrase cut on "{an["word"]}" is mid-phrase (only {gap * 1000:.0f} ms of silence before the word): use the first word of a phrase, or kind "cut"')
    # transition windows overlap
    wins = [(s["id"], *winmap[s["id"]]) for s in scenes if s["id"] in winmap]
    for (n1, a1, b1), (n2, a2, b2) in zip(wins, wins[1:]):
        if a2 < b1:
            c.warn(f'transition windows into "{n1}" and "{n2}" overlap by {b1 - a2} f: the later one wins')
    # text on screen >= 0.6 s
    for w, f, u in textev:
        if u - f < rnd(0.6 * c.fps):
            c.where = w
            c.err(f"text event f{f} is on screen {max(0, u - f) / c.fps:.2f} s (< 0.6 s)")
    # beat rules
    music_cues = None
    music_ranges = []  # (id, in, out) of the beds
    cue_tracks = []  # (in frame, out frame, startFromSec, cues): where each cue-carrying track really sits on the timeline
    for m in sb.get("music", []):
        c.where = f'music "{m["id"]}"'
        fi, fo = c.anchor(m["in"], None), c.anchor(m["out"], None, True)
        if fo <= fi:
            c.err("out is not after in")
        if m.get("kind") != "song":
            music_ranges.append((m["id"], fi, fo))
        if m.get("cues"):
            mp = os.path.join(pdir, m["cues"])
            if os.path.exists(mp):
                music_cues = load_json(mp)
                cue_tracks.append((fi, fo, m.get("startFromSec") or 0, music_cues))
            else:
                c.warn(f'cue file {m["cues"]} not found')
    # chapter holes move the music exactly as resolve.ts does: the running bed ends `hole` before the cut, the next cue starts after it
    for cut, hole in sorted(holes.items()):
        c.where = f"hole at f{cut}"
        nxt = [r for r in music_ranges if abs(r[1] - cut) <= 24]
        run = [r for r in music_ranges if r not in nxt and r[1] < cut and r[2] > cut - hole]
        if not nxt and not run:
            c.warn("hole with no music around the cut (nothing to reset)")
        if nxt:
            after = rnd(c.P["cue_after"] * c.fps / 25)
            if c.profile in ("standard", "scrapbook") and not CUE_AFTER_RANGE[0] <= after <= CUE_AFTER_RANGE[1]:
                c.warn(f"next cue lands {after} f after the cut (sample 0-6 f)")
        music_ranges = [(r[0], cut + rnd(c.P["cue_after"] * c.fps / 25) if r in nxt else r[1], cut - hole if r in run else r[2]) for r in music_ranges]
    if c.profile in ("standard", "scrapbook"):
        # music boundaries: few (one cue per chapter) and each one at a cut / hole
        cue_starts = len(music_ranges) - 1
        per_min = cue_starts / max(end / c.fps / 60, 1e-9)
        if per_min > c.P["bound_per_min"]:
            c.where = "music"
            c.warn(f"{cue_starts} music cue changes in {end / c.fps:.0f} s = {per_min:.1f} per minute: standard profile is one cue per chapter (sample 0.7-1.6/min)")
        bounds = [(r[0], "in", r[1]) for r in music_ranges[1:]] + [(r[0], "out", r[2]) for r in music_ranges if r[2] < end - c.fps]
        cutfs = sorted({f for f, _, _ in cuts})
        for mid, edge, f in bounds:
            if not any(-round(1.5 * c.fps) <= f - cf <= round(1.5 * c.fps) for cf in cutfs):
                c.where = f'music "{mid}"'
                c.warn(f"{edge} at f{f} is not within 1.5 s of a cut: standard-profile music changes at chapter cuts")
    for f, label, an in cuts:
        c.where = label
        if an.get("snap") and c.speaking(f):
            c.err("`snap` on a cut under narration (doc 11 rule 3: quantise to the grid only when music plays alone)")
        elif music_cues and f > 0 and c.speaking(f):
            # beats of the track that plays at f (shifted by its in-point and startFromSec); else the plain grid
            tr = next((t for t in cue_tracks if t[0] <= f < t[1]), None)
            bs = [rnd(tr[0] + (b["t"] - tr[2]) * c.fps) for b in tr[3].get("beats", [])] if tr else [rnd(b["t"] * c.fps) for b in music_cues.get("beats", [])]
            d = min((abs(b - f) for b in bs), default=99)
            if d <= 2:
                c.warn(f"cut f{f} is {d} f from a beat of the music bed under narration (cuts are never placed on beats)")
    for sf in sb.get("sfx", []):
        c.where = f'sfx "{sf["src"]}"'
        c.anchor(sf["at"], None)
    tsfx = lambda t: t.get("sfx", c.P["transition_sfx"]) is not False  # noqa: E731  standard: transitions silent unless `sfx: true`
    nsfx = len(sb.get("sfx", [])) + sum(SFX_OF[(s.get("transitionIn") or {}).get("kind")] for s in scenes if (s.get("transitionIn") or {}).get("kind") in SFX_OF and tsfx(s["transitionIn"]))
    if c.profile == "earworm":
        if nsfx > end / c.fps / 13 + 2:
            c.warn(f"{nsfx} SFX in {end / c.fps:.0f} s: budget is ~1 per 13 s (doc 11 §6)")
    elif nsfx > end / c.fps / 60 * c.P["sfx_per_min"] + 1:
        c.warn(f"{nsfx} SFX in {end / c.fps:.0f} s: {c.profile}-profile budget is <= {c.P['sfx_per_min']} per minute (+1)"
               + (", transitions silent" if not c.P["transition_sfx"] else ""))
    # assets + credits
    c.where = "assets"
    catalogued = catalog_paths()
    ref_used = {}
    for rel in referenced_assets(sb):
        path = os.path.join(ROOT, "public", rel[4:]) if rel.startswith("kit:") else os.path.join(pdir, rel)
        m = re.match(r"assets/ref/([^/]+)/", rel)
        if m:
            ref_used.setdefault(m.group(1), []).append(rel)
        if rel.startswith("kit:assets/") and rel[4:] not in catalogued and os.path.exists(path):
            c.warn(f"{rel} is not in the shared catalog (a private library?): fine for drafts; clear its rights or replace it before publishing")
        if not os.path.exists(path):
            hint = f": fetch it with tools/py tools/library/fetch.py --for-project {a.slug}" if rel.startswith("kit:") and rel[4:] in catalogued else ""
            c.err(f"{rel} does not exist ({os.path.relpath(path, ROOT)}){hint}")
        elif not credit_ok(rel, a.slug):
            c.err(f"{rel} has no credits entry ({'a CREDITS.md line naming the file: title, source URL, licence' if os.path.splitext(rel)[1].lower() in VIDEO_EXT else 'CREDITS.md / sidecar json / kit CREDITS.md'})")
        elif os.path.splitext(rel)[1].lower() in VIDEO_EXT and os.path.getsize(path) > 100 * 1024 * 1024:
            c.warn(f"{rel} is {os.path.getsize(path) // 2**20} MB: trim it with ffmpeg (published to public/projects/ and decoded per frame)")
    for rid, rels in sorted(ref_used.items()):
        rj = os.path.join(pdir, "reference", rid, "reference.json")
        rights = load_json(rj).get("rights", "unknown") if os.path.exists(rj) else "unknown"
        if rights != "own":
            c.warn(f"{len(rels)} asset(s) cut from reference {rid} (rights: {rights}): drafts only, list a replacement for each in HANDOFF.md before publishing")
    if sb.get("fps") != cues["fps"]:
        c.warn(f"storyboard fps {sb['fps']} != cue fps {cues['fps']}: frames are scaled")

    if a.write_anchors:
        anchors, seen = [], set()
        def collect(an, id_):
            if "word" in an:
                key = an["word"] + (f"#{an['nth']}" if an.get("nth", 1) > 1 else "")
                anchors.append({"id": id_, "anchor": key})
        for s in scenes:
            collect(s["start"], f'{s["id"]}:start')
            for e in s.get("events", []):
                collect(e["at"], f'{s["id"]}:{e["id"]}')
            for k, an in prop_anchors(s.get("props", {})):
                collect(an, f'{s["id"]}:{k}')
        sb["anchors"] = anchors
        with open(sbp, "w") as f:
            json.dump(sb, f, indent=2, ensure_ascii=False)
            f.write("\n")
        print(f"wrote {len(anchors)} anchors to storyboard.json (for recue.py)")

    if not a.q:
        print(f"{a.slug}{' [short 9:16]' if short else ''}: {len(scenes)} scenes, {end} f = {end / c.fps:.1f} s @ {c.fps} fps, cues {os.path.relpath(cp, ROOT)} ({cues['duration_s']:.1f} s)")
        print(f"{'scene':16} {'recipe':20} {'start':>6} {'end':>6}  anchor")
        for i, s in enumerate(scenes):
            print(f'{s["id"]:16} {s["recipe"]:20} {starts[i]:6d} {ends[i]:6d}  {s["start"].get("word", "")}{"#" + str(s["start"]["nth"]) if s["start"].get("nth") else ""}{" after " + s["start"]["after"] if "after" in s["start"] else ""}')
        print("\nresolved word anchors (frame at the storyboard fps):")
        for w, kind, label, f in c.report:
            print(f"  f{f:5d}  {w:42} {kind:6} {label}")
    for w in c.warnings + warnings:
        print("WARN ", w)
    for e in c.errors:
        print("ERROR", e)
    print(f"\n{len(c.errors)} errors, {len(c.warnings) + len(warnings)} warnings")
    sys.exit(1 if c.errors else 0)


if __name__ == "__main__":
    main()
