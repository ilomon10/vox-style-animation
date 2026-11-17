#!/usr/bin/env python3
"""Where a video project stands, what each section still needs, and what to do next: the data behind the
vox-video skill's director mode (.claude/skills/vox-video/DIRECTOR.md).

  tools/py tools/studio/director.py <slug>                 # sections, gaps with recommendations, the next checkpoint
  tools/py tools/studio/director.py <slug> --json          # the same, for the agent
  tools/py tools/studio/director.py <slug> --mode auto     # guided | key | auto, saved in project.json ("mode")
  tools/py tools/studio/director.py --suggest "<a line of narration>" [--look voxScrapbook]   # the blocks that fit it

It only reads the project (and writes `mode` with --mode). Asset states: `ok` (on disk), `fetch` (in the catalog;
publish_project.py downloads it), `missing` (neither: a gap).
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "library"))
PY = [str(ROOT / "tools" / "py")]
MODES = ("guided", "key", "auto")
MEDIA_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".tif", ".mp4", ".webm", ".mov", ".wav", ".mp3")
# recipe -> block page in examples/blocks (DataChart depends on its mode)
RECIPE_BLOCK = {"ColdOpenYear": "cold-open-year", "KeywordCut": "keyword-cut", "GiantWordCard": "giant-word-card",
                "MapRoute": "map-route", "EndCard": "end-card", "PhotoCollageUnfold": "photo-collage",
                "SeriesIdent": "series-ident", "MontageCrane": "montage-crane", "NameCardInterview": "name-card",
                "DocumentHighlight": "document-highlight", "QuoteCard": "quote-card", "FootageClip": "footage-clip",
                # the scrapbook collection (look voxScrapbook)
                "ChapterCard": "torn-paper-chapter-card", "PaperStat": "torn-paper-stat", "StampedStat": "stamped-stat",
                "SpecimenPlate": "specimen-plate", "SpecimenCompare": "specimen-comparison",
                "SpecimenInterview": "specimen-interview"}
# recipes that need a picture (the prop that holds it)
NEEDS_PICTURE = {"ColdOpenYear": "pieces", "KeywordCut": "src", "PhotoCollageUnfold": "items", "MontageCrane": "items",
                 "NameCardInterview": "src", "DocumentHighlight": "src", "FootageClip": "src", "MapRoute": "map",
                 "SpecimenPlate": "subject", "SpecimenInterview": "src"}
NO_PICTURE_BLOCKS = {"voxEarworm": "giant-word-card, data-counter or quote-card",
                     "voxScrapbook": "stamped-stat or torn-paper-stat (without an image)"}
# look voxScrapbook: an Earworm block -> the scrapbook block that does its job (the others keep their own look)
SCRAPBOOK_OF = {"cold-open-year": "torn-paper-chapter-card", "photo-collage": "torn-paper-chapter-card",
                "keyword-cut": "torn-paper-chapter-card", "giant-word-card": "stamped-stat", "data-counter": "torn-paper-stat",
                "data-bars": "specimen-comparison", "name-card": "specimen-interview"}
SCRAPBOOK_BLOCKS = {"torn-paper-chapter-card", "torn-paper-stat", "stamped-stat", "specimen-plate", "specimen-comparison",
                    "specimen-interview", "paper-sheet-slide"}


def block_of(scene: dict) -> str:
    m = re.search(r"\bblock ([a-z0-9-]+)", scene.get("note", ""))
    if m:
        return m.group(1)
    if scene.get("recipe") == "DataChart":
        return "data-bars" if (scene.get("props") or {}).get("mode") == "bars" else "data-counter"
    return RECIPE_BLOCK.get(scene.get("recipe", ""), "")


# ------------------------------------------------------------------------------------------------ suggestions

SPELLED = r"(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion)"
RULES = [  # (block, regex, why)
    ("cold-open-year", r"\b(1[0-9]{3}|20[0-9]{2})\b|\b(eighteen|nineteen|twenty)[ -](hundred|oh|ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)",
     "names a year: open on it"),
    ("data-bars", rf"\b({SPELLED}|\d+)\b[^.]*\b(to|versus|vs\.?|against|compared|than)\b[^.]*\b({SPELLED}|\d+)\b",
     "compares numbers"),
    ("data-counter", rf"\b\d+(\.\d+)?\s*(%|percent|million|billion|times)?\b|\b{SPELLED}(-{SPELLED})?\b",
     "carries a number"),
    ("quote-card", r"[\"“”]|\b(said|wrote|declared|resolved|stated|called it|in (his|her|their) words)\b",
     "quotes someone's words"),
    ("document-highlight", r"\b(law|act|bill|treaty|patent|letter|report|newspaper|headline|map|memo|constitution|document|page|record|census|ledger)s?\b",
     "points at a document"),
    ("map-route", r"\b(across|route|border|coast|continent|country|countries|cities|from \w+ to \w+|north|south|east|west|map|spread)\b",
     "is about places or movement"),
    ("name-card", r"\b(engineer|president|scientist|founder|inventor|historian|economist|senator|minister|professor|doctor|ceo|author)\b|\b[A-Z][a-z]+ [A-Z][a-z]+\b",
     "introduces a person"),
    ("montage-crane", r"\b\w+, \w+(,)? and \w+\b|\b\w+ and \w+ and\b",
     "lists several things"),
    ("footage-clip", r"\b(today|now|these days|nowadays|currently|still)\b", "turns to the present"),
    ("giant-word-card", r"\b(only|never|every|all|no one|nobody|biggest|first|last)\b", "makes a strong claim"),
    ("photo-collage", r"\b(towns?|streets?|people|crowds?|life|everyday|cities|villages?)\b", "sets a scene"),
]


SCRAPBOOK_RULES = [  # look voxScrapbook: checked before RULES
    ("specimen-plate", r"\b(part|region|organ|brain|heart|lung|cell|structure|inside|section|diagram|anatomy|mechanism|engine|layer)s?\b",
     "points at a part of something"),
    ("stamped-stat", rf"\b({SPELLED}|\d+)\b[^.]*\b(people|men|women|drivers|patients|volunteers|participants|subjects|votes|members|workers|children)\b",
     "counts people: stamp it on the record"),
]


def suggest(line: str, look: str = "voxEarworm") -> list[dict]:
    scrap = look == "voxScrapbook"
    out = []
    for block, rx, why in (SCRAPBOOK_RULES if scrap else []) + RULES:
        if re.search(rx, line, flags=re.I if block != "name-card" else 0):
            out.append({"block": block, "why": why})
    # name-card's capitalised-pair rule fires on any sentence start + name: keep it only with a role word or mid-sentence
    if not out or all(o["block"] in ("name-card",) for o in out):
        out.append({"block": "keyword-cut", "why": "one word carries the line"} if not scrap else
                   {"block": "torn-paper-chapter-card", "why": "a title card (a kicker and a few words) carries the line"})
    if scrap:  # the scrapbook block that does the same job; an Earworm block without one keeps its own look
        out = [o if o["block"] in SCRAPBOOK_BLOCKS else
               {"block": SCRAPBOOK_OF[o["block"]], "why": o["why"]} if o["block"] in SCRAPBOOK_OF else
               {"block": o["block"], "why": o["why"] + " (an Earworm block: it keeps its own look)"} for o in out]
    seen, ranked = set(), []
    for o in out:
        if o["block"] not in seen:
            seen.add(o["block"])
            ranked.append(o)
    return ranked[:5]


# ------------------------------------------------------------------------------------------------ project state

def script_sections(path: Path) -> list[dict]:
    beat = re.compile(r'^\[BEAT\s+recipe=(\w+)(?:\s+anchor="([^"]*)")?[^\]]*\]')
    out, cur = [], None
    for raw in path.read_text(encoding="utf-8").splitlines() if path.exists() else []:
        t = raw.strip()
        if not t or t.startswith(("#", "//")):
            continue
        m = beat.match(t)
        if m:
            cur = {"recipe": m.group(1), "anchor": m.group(2) or "", "text": ""}
            out.append(cur)
            continue
        if t.startswith("["):
            continue
        if cur is None:
            cur = {"recipe": "", "anchor": "", "text": ""}
            out.append(cur)
        cur["text"] = (cur["text"] + " " + t.replace("*", "")).strip()
    return out


def scene_table(slug: str, sb: dict) -> tuple[dict[str, tuple[int, int]], list[str]]:
    r = subprocess.run(PY + ["tools/studio/validate_storyboard.py", slug], cwd=ROOT, capture_output=True, text=True)
    ids = {s["id"] for s in sb.get("scenes", [])}
    table = {}
    for line in r.stdout.splitlines():
        p = line.split()
        if len(p) >= 4 and p[0] in ids and re.fullmatch(r"-?\d+", p[2]) and re.fullmatch(r"-?\d+", p[3]):
            table[p[0]] = (int(p[2]), int(p[3]))
    problems = [ln.strip() for ln in (r.stdout + r.stderr).splitlines() if ln.startswith(("ERROR", "WARN"))]
    return table, problems


def media_strings(x) -> list[str]:
    if isinstance(x, str):
        return [x] if (x.startswith(("kit:", "assets/", "audio/")) or x.lower().endswith(MEDIA_EXT)) else []
    if isinstance(x, dict):
        return [s for v in x.values() for s in media_strings(v)]
    if isinstance(x, list):
        return [s for v in x for s in media_strings(v)]
    return []


def asset_state(path: str, slug: str, catalog_paths: set[str]) -> str:
    if path.startswith("kit:"):
        rel = path[4:]
        if (ROOT / "public" / rel).exists():
            return "ok"
        return "fetch" if rel in catalog_paths else "missing"
    if re.fullmatch(r"[a-z0-9_]+", path):  # kit sound by short name (sub_boom)
        return "ok" if (ROOT / "public" / "audio" / "sfx" / f"{path}.wav").exists() else "missing"
    return "ok" if (ROOT / "video-projects" / slug / path).exists() else "missing"


def catalog_hits(words: str, kinds: tuple[str, ...], n: int = 3) -> list[dict]:
    try:
        import lib as L
        import search as S
    except Exception:  # noqa: BLE001
        return []
    toks = [w for w in re.findall(r"[a-z0-9]+", words.lower()) if len(w) > 3 and w not in STOP]
    if not toks:
        return []
    scored = []
    for a in L.load()["assets"]:
        if a["kind"] in kinds:
            s = S.score(a, toks)
            if s > 0:
                scored.append((s, a))
    scored.sort(key=lambda t: -t[0])
    return [{"id": a["id"], "kit": f"kit:{a['path']}", "title": a["title"], "license": a["license"]} for _, a in scored[:n]]


STOP = set("that this with from they their there were when what which have will would could about into than then them these those also only just over under after before because while where across whole".split())
PICTURE_KINDS = ("photos", "engravings", "portraits", "documents", "maps", "cutouts", "footage")


def status(slug: str) -> dict:
    pdir = ROOT / "video-projects" / slug
    if not pdir.exists():
        raise SystemExit(f"no project video-projects/{slug} (create it: tools/py tools/studio/new_project.py {slug} \"<idea>\")")
    proj = json.loads((pdir / "project.json").read_text()) if (pdir / "project.json").exists() else {}
    sb = json.loads((pdir / "storyboard.json").read_text()) if (pdir / "storyboard.json").exists() else {}
    scenes = sb.get("scenes", [])
    fps = int(sb.get("fps", proj.get("fps", 25)))
    cues_path = ROOT / proj.get("cues", f"video-projects/{slug}/audio/vo.cues.json")
    cues = json.loads(cues_path.read_text()) if cues_path.exists() else None
    research = pdir / "RESEARCH.md"
    facts = len(re.findall(r"^\|\s*\d+\s*\|", research.read_text(encoding="utf-8"), flags=re.M)) if research.exists() else 0
    credits = (pdir / "CREDITS.md").read_text(encoding="utf-8") if (pdir / "CREDITS.md").exists() else ""
    sections = script_sections(pdir / proj.get("script", "script.md"))
    try:
        import lib as L
        catalog = {a["path"] for a in L.load()["assets"]}
    except Exception:  # noqa: BLE001
        catalog = set()
    table, problems = scene_table(slug, sb) if scenes and cues else ({}, [])
    words = (cues or {}).get("words", [])
    k = fps / (cues or {}).get("fps", fps)
    lead = round(sb.get("vo", {}).get("leadSec", 0) * fps)
    look = sb.get("look", "voxEarworm")

    def word_frame(w: dict) -> int:  # as validate_storyboard.py resolves a word anchor (its onset, at the storyboard fps)
        return round(w.get("onset_frame", w.get("frame_start", round(w["start"] * fps))) * k) + lead

    out_sections, gaps = [], []
    spoken = [s for s in sections if s["text"]]
    # narration per scene: the script's sections (whole sentences), each given to the scene in which most of its words
    # are spoken; a scene in a pause (an ident) gets none. When the script's words and the cues don't line up: the
    # words spoken during the scene instead.
    by_beat = None
    counts = [len(x["text"].split()) for x in spoken]
    if words and table and sum(counts) == len(words):
        # each section's words, in order, vote for the scene they are spoken in; the section goes to the majority
        by_beat, i = {}, 0
        for sec, n in zip(spoken, counts):
            votes = {}
            for w in words[i:i + n]:
                f = word_frame(w)
                sid_hit = next((sid for sid, (a, b) in table.items() if a <= f < b), None)
                if sid_hit:
                    votes[sid_hit] = votes.get(sid_hit, 0) + 1
            i += n
            if votes:
                best = max(votes, key=votes.get)
                by_beat[best] = (by_beat.get(best, "") + " " + sec["text"]).strip()
    for i, sc in enumerate(scenes):
        sid = sc["id"]
        start, end = table.get(sid, (None, None))
        if by_beat is not None:
            text = by_beat.get(sid, "")
        elif start is not None and words:
            text = " ".join(w["text"] for w in words if start <= word_frame(w) < end)
        else:
            text = spoken[i]["text"] if i < len(spoken) else ""
        assets = [{"path": p, "state": asset_state(p, slug, catalog)} for p in dict.fromkeys(media_strings(sc.get("props", {})))]
        sgaps, recs = [], []
        missing = [a["path"] for a in assets if a["state"] == "missing"]
        if missing:
            sgaps.append(f"missing file(s): {', '.join(missing)}")
        need = NEEDS_PICTURE.get(sc.get("recipe", ""))
        if need and not (sc.get("props") or {}).get(need):
            sgaps.append(f"no picture yet (`{need}`)")
        uncredited = [a["path"] for a in assets if a["path"] not in credits and a["path"].removeprefix("kit:") not in credits]
        if uncredited and credits:
            sgaps.append(f"no CREDITS.md line for: {', '.join(uncredited)}")
        if any(g.startswith(("missing file", "no picture")) for g in sgaps):
            kinds = ("footage",) if sc.get("recipe") == "FootageClip" else tuple(k for k in PICTURE_KINDS if k != "footage")
            hits = catalog_hits(" ".join([text, sc.get("note", ""), json.dumps(sc.get("props", {}))]), kinds)
            recs = [f"catalog: {h['kit']} ({h['title']})" for h in hits]
            recs.append(f"or a block that needs no picture: {NO_PICTURE_BLOCKS.get(look, NO_PICTURE_BLOCKS["voxEarworm"])} (DIRECTOR.md, 'When something is missing')")
        out_sections.append({
            "n": i + 1, "id": sid, "recipe": sc.get("recipe", ""), "block": block_of(sc),
            "start_s": round(start / fps, 2) if start is not None else None, "end_s": round(end / fps, 2) if end is not None else None,
            "narration": text, "assets": assets, "gaps": sgaps, "recommendations": recs,
        })
        gaps += [f"section {i + 1} ({sid}): {g}" for g in sgaps]
    if not scenes:  # before the storyboard: the script's sections, with block suggestions
        for i, s in enumerate(spoken):
            sug = suggest(s["text"], look)
            out_sections.append({"n": i + 1, "id": None, "recipe": s["recipe"], "block": RECIPE_BLOCK.get(s["recipe"], ""),
                                 "narration": s["text"], "assets": [], "gaps": [], "recommendations": [f"block {x['block']}: {x['why']}" for x in sug]})

    music = []
    for m in sb.get("music", []):
        src = m.get("src", "")
        music.append({"src": src, "state": asset_state(src, slug, catalog)})
    music_recs = []
    if scenes and not music:
        hits = catalog_hits("calm curious documentary investigations thinking serious", ("music",), 3)
        music_recs = [f"{h['kit']} ({h['title']}; CC BY: attribution line)" if h["license"] == "by" else f"{h['kit']} ({h['title']})" for h in hits]
        gaps.append("no music bed yet (C7)")
    for p in problems:
        if p.startswith("ERROR"):
            gaps.append(f"storyboard: {p}")

    draft = ROOT / "out" / "studio" / f"{slug}.mp4"
    board = ROOT / "out" / "studio" / f"{slug}-board.html"
    voice = {"source": proj.get("voSource", "scratch" if cues else None) if cues else None, "name": proj.get("voice"),
             "words": len(words), "duration_s": round(cues.get("duration_s", 0), 1) if cues else None}
    if not facts:
        nxt = ("research", "Research the topic into RESEARCH.md (a source per fact), then C2 · Angle.")
    elif not spoken:
        nxt = ("C3", "C3 · Section plan: pick a block per section, then write the script (C4).")
    elif not cues:
        nxt = ("C5", "C4 · Script approval if not done, then C5 · Voice (scratch voice or the user's recording).")
    elif not scenes:
        nxt = ("storyboard", "Write storyboard.json: one scene per section, from the block pages.")
    elif any(g.startswith("section") or g.startswith("storyboard") for g in gaps):
        nxt = ("C6", "C6 · Gaps: one question per gap, options from DIRECTOR.md 'When something is missing'.")
    elif not music:
        nxt = ("C7", "C7 · Music: offer the catalog beds below.")
    elif not draft.exists():
        nxt = ("C8", "Render stills or the draft, rebuild the board, then C8 · Look check.")
    else:
        nxt = ("C8", "C8 · Look check with the board (board.py --open), then C9 · Delivery.")
    return {
        "slug": slug, "title": sb.get("title") or proj.get("idea", slug), "mode": proj.get("mode", "guided"),
        "voice": voice, "music": music, "music_recommendations": music_recs, "research_facts": facts,
        "draft": str(draft.relative_to(ROOT)) if draft.exists() else None,
        "board": str(board.relative_to(ROOT)) if board.exists() else None,
        "sections": out_sections, "gaps": gaps, "next": {"checkpoint": nxt[0], "do": nxt[1]},
    }


def show(st: dict) -> None:
    v = st["voice"]
    vtxt = f"{v['source']} ({v['name']}), {v['words']} words, {v['duration_s']} s" if v["source"] else "none yet"
    mtxt = ", ".join(Path(m["src"]).stem + ("" if m["state"] == "ok" else f" [{m['state']}]") for m in st["music"]) or "none yet"
    print(f"{st['slug']} · {st['title']} · mode: {st['mode']}")
    print(f"  voice: {vtxt} | music: {mtxt} | research: {st['research_facts']} facts | draft: {st['draft'] or 'not rendered'}")
    print(f"\n  {'#':>2}  {'scene':<12} {'block':<24} {'time':<13} narration")
    for s in st["sections"]:
        t = f"{s['start_s']:.1f}-{s['end_s']:.1f} s" if s.get("start_s") is not None else ""
        nar = s["narration"] if len(s["narration"]) <= 60 else s["narration"][:57] + "..."
        flag = "  !" if s["gaps"] else ""
        print(f"  {s['n']:>2}  {str(s['id'] or '-'):<12} {s['block'] or s['recipe'] or '-':<24} {t:<13} {nar}{flag}")
        for g in s["gaps"]:
            print(f"        gap: {g}")
        for r in s["recommendations"]:
            print(f"        -> {r}")
    for r in st["music_recommendations"]:
        print(f"  music -> {r}")
    other = [g for g in st["gaps"] if not g.startswith("section")]
    for g in other:
        print(f"  gap: {g}")
    print(f"\n  next: {st['next']['do']}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", nargs="?")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--mode", choices=MODES)
    ap.add_argument("--suggest", metavar="LINE")
    ap.add_argument("--look", default="voxEarworm", help="with --suggest: the look the video uses (voxScrapbook suggests its own blocks)")
    a = ap.parse_args()
    if a.suggest:
        res = suggest(a.suggest, a.look)
        if a.json:
            print(json.dumps(res, indent=1))
        else:
            for r in res:
                print(f"  {r['block']:<20} {r['why']}   (examples/blocks/{r['block']}.md)")
        return 0
    if not a.slug:
        ap.error("give a project slug, or --suggest \"<line>\"")
    if a.mode:
        pj = ROOT / "video-projects" / a.slug / "project.json"
        d = json.loads(pj.read_text()) if pj.exists() else {"slug": a.slug}
        d["mode"] = a.mode
        pj.write_text(json.dumps(d, indent=2) + "\n")
        print(f"mode: {a.mode} (saved in {pj.relative_to(ROOT)})")
        if not a.json:
            return 0
    st = status(a.slug)
    if a.json:
        print(json.dumps(st, indent=1, ensure_ascii=False))
    else:
        show(st)
    return 0


if __name__ == "__main__":
    sys.exit(main())
