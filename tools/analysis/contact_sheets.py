#!/usr/bin/env python3
"""Contact sheets for frame-by-frame visual review.

  Labels also show the word being spoken (“word”, · = none) and |B / |D when a musical beat /
  downbeat falls on that frame, if tools/audio has analysed the video.

  sheets [id ...]          Adaptive keyframe sheets -> analysis/sheets/<id>/sheet_NNN.png (+ index.md)
                           A frame is kept when it differs from the last kept frame by more than
                           T (mean abs diff on an 80x45 gray thumbnail), when 1 s passed, or when it
                           starts a new shot. So every visually distinct state is on a sheet; frames
                           omitted between two cells are near-duplicates (holds/slow drift).
                           Cell label: f<frame> <time>s S<shot> +<frames since previous cell>
                           Red bar on top = first frame of a new shot (hard cut).
  sheets --sparse <id> ... Sparse sheets for long videos (6-15 min): 5x4 = 20 cells per sheet; keyframes = each
                           shot's first, middle and last frame plus one every 2 s inside shots that move
                           (mean mad_lo of the shot from analysis/metrics/<id>.csv > MOVE_MAD). Thinned
                           automatically to <= MAX_SHEETS_PER_10MIN sheets per 10 min of video (longer
                           interval inside moving shots first, then middle frames of short shots).
  strip <id> <a> <b>       Full-frame-rate strip of frames a..b (inclusive, max 48, 6 per row)
                           -> analysis/strips/<id>_<a>-<b>.png  (every single frame, for timing/easing)

Usage: python3 -I tools/analysis/contact_sheets.py sheets
       python3 -I tools/analysis/contact_sheets.py sheets --sparse vox_creatine
       python3 -I tools/analysis/contact_sheets.py strip porsche 330 360
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)
import frames as _frames  # noqa: E402
SOURCES = load_sources()
THRESH = {"earworm": 4, "porsche": 8, "dracula": 4, "epigenetics": 4, "highlight": 0.8, "dracula_gif1": 0, "dracula_gif2": 0}
FONT = ImageFont.load_default(size=15)
MOVE_MAD = 0.5               # --sparse: a shot "moves" when its mean mad_lo (grain-insensitive change) exceeds this
MAX_SHEETS_PER_10MIN = 60    # --sparse budget


def thresh(vid):
    """adaptive-sampling threshold: measured per video, else by style (Vox-like art 4, anything else 6)"""
    if vid in THRESH:
        return THRESH[vid]
    return 4 if "vox" in str(SOURCES.get(vid, {}).get("style", "")) else 6


_AUDIO = {}


def audio_label(vid, i):
    """' “word”' spoken at frame i and ' |B' if a beat falls on it (needs analysis/audio/<id>_words.json
    and _rhythm.json from tools/audio). Empty string when no audio analysis exists."""
    if vid not in _AUDIO:
        a = os.path.join(ROOT, "analysis", "audio")
        words = json.load(open(os.path.join(a, f"{vid}_words.json"))) if os.path.exists(os.path.join(a, f"{vid}_words.json")) else None
        rh = json.load(open(os.path.join(a, f"{vid}_rhythm.json"))) if os.path.exists(os.path.join(a, f"{vid}_rhythm.json")) else None
        _AUDIO[vid] = (words, {b["frame"] for b in rh["beats"]} if rh else set(),
                       {b["frame"] for b in rh["downbeats"]} if rh else set())
    words, beats, downs = _AUDIO[vid]
    if words is None:
        return ""
    fps = SOURCES[vid]["fps"]
    t = i / fps
    w = next((x["word"] for x in words if x["start"] - 0.02 <= t <= x["end"] + 0.02), "")
    mark = " |D" if i in downs else (" |B" if i in beats else "")
    return (f" “{w[:14]}”" if w else " ·") + mark


def frame_path(vid, i):
    """analysis/frames/<id>/NNNNNN.jpg; pulled from the video on demand when extract_frames.sh did not dump it"""
    return _frames.frame_path(ROOT, SOURCES, vid, i)


def n_frames(vid):
    return _frames.n_frames(ROOT, SOURCES, vid)


def shot_starts(vid):
    p = os.path.join(ROOT, "analysis", "metrics", f"{vid}_shots.json")
    shots = json.load(open(p))["shots"]
    return {s["start"]: s["shot"] for s in shots}, shots


def shot_of(shots, i):
    for s in shots:
        if s["start"] <= i <= s["end"]:
            return s["shot"]
    return 0


def thumb(vid, i):
    im = Image.open(frame_path(vid, i))
    im.draft("L", (160, 90))
    return np.asarray(im.convert("L").resize((80, 45), Image.BOX), np.float32)


def grid(cells, cols, cw, labels, marks, out):
    ch = int(round(cw * cells[0].height / cells[0].width))
    lh = 20
    rows = -(-len(cells) // cols)
    sheet = Image.new("RGB", (cols * cw + (cols - 1) * 4, rows * (ch + lh) + (rows - 1) * 4), (24, 24, 24))
    d = ImageDraw.Draw(sheet)
    for k, (im, lab, mk) in enumerate(zip(cells, labels, marks)):
        x = (k % cols) * (cw + 4)
        y = (k // cols) * (ch + lh + 4)
        sheet.paste(im.resize((cw, ch), Image.LANCZOS), (x, y + lh))
        d.rectangle([x, y, x + cw - 1, y + lh - 1], fill=(200, 30, 30) if mk else (45, 45, 45))
        d.text((x + 4, y + 2), lab, fill=(255, 255, 255), font=FONT)
    sheet.save(out, optimize=True)


def make_sheets(vid):
    fps = SOURCES[vid]["fps"]
    n = n_frames(vid)
    starts, shots = shot_starts(vid)
    T = thresh(vid)
    keep, last = [0], thumb(vid, 0)
    for i in range(1, n):
        th = thumb(vid, i)
        if T == 0 or i in starts or np.abs(th - last).mean() > T or i - keep[-1] >= int(round(fps)):
            keep.append(i)
            last = th
    write_sheets(vid, keep, starts, shots, 16, 4, 400,
                 [f"# {vid} keyframe sheets\n",
                  f"Adaptive sampling (T={T}): {len(keep)} keyframes of {n} frames @ {fps} fps. "
                  "Cell label = f<frame> <seconds>s S<shot> +<frames since previous cell>. "
                  "Red label = first frame of a new shot. Omitted frames are near-duplicates of the cell "
                  "before them; pull every frame of any range with `contact_sheets.py strip`.\n"])


def write_sheets(vid, keep, starts, shots, per, cols, cw, header):
    fps = SOURCES[vid]["fps"]
    od = os.path.join(ROOT, "analysis", "sheets", vid)
    os.makedirs(od, exist_ok=True)
    for f in os.listdir(od):
        os.remove(os.path.join(od, f))
    index = header + ["| sheet | frames | time (s) | shots |", "|---|---|---|---|"]
    for s in range(0, len(keep), per):
        chunk = keep[s:s + per]
        cells, labels, marks = [], [], []
        for j, i in enumerate(chunk):
            prev = keep[s + j - 1] if s + j > 0 else 0
            cells.append(Image.open(frame_path(vid, i)).convert("RGB"))
            labels.append(f"f{i} {i / fps:.2f}s S{shot_of(shots, i)} +{i - prev}{audio_label(vid, i)}")
            marks.append(i in starts and i != 0)
        name = f"sheet_{s // per + 1:03d}.png"
        grid(cells, cols, cw, labels, marks, os.path.join(od, name))
        sh = sorted({shot_of(shots, i) for i in chunk})
        index.append(f"| {name} | {chunk[0]}–{chunk[-1]} | {chunk[0] / fps:.2f}–{chunk[-1] / fps:.2f} | "
                     f"{sh[0]}–{sh[-1]} |")
    open(os.path.join(od, "index.md"), "w").write("\n".join(index) + "\n")
    print(f"{vid}: {len(keep)} keyframes -> {-(-len(keep) // per)} sheets")


def sparse_keyframes(vid, shots, fps, n, per):
    """first / middle / last frame of every shot + a frame every `step` s inside moving shots; thinned to the budget"""
    import csv
    rows = list(csv.DictReader(open(os.path.join(ROOT, "analysis", "metrics", f"{vid}.csv"))))
    lo = np.array([float(r["mad_lo"]) for r in rows])
    moving = [s["end"] > s["start"] and lo[s["start"] + 1:s["end"] + 1].mean() > MOVE_MAD for s in shots]
    budget = int(MAX_SHEETS_PER_10MIN * (n / fps / 600.0)) * per
    for step in (2, 3, 4, 6, 8, 12, None):
        for drop_mid in (False, True):
            keep = set()
            for s, mv in zip(shots, moving):
                a, b = s["start"], s["end"]
                keep.update((a, b))
                if not (drop_mid and b - a < 2 * fps):
                    keep.add((a + b) // 2)
                if mv and step:
                    keep.update(range(a + int(step * fps), b, int(step * fps)))
            if len(keep) <= budget:
                return sorted(keep), step, drop_mid, sum(moving)
    return sorted(keep)[:budget], None, True, sum(moving)


def make_sparse(vid):
    fps = SOURCES[vid]["fps"]
    n = n_frames(vid)
    starts, shots = shot_starts(vid)
    keep, step, drop_mid, nmov = sparse_keyframes(vid, shots, fps, n, 20)
    write_sheets(vid, keep, starts, shots, 20, 5, 384,
                 [f"# {vid} sparse keyframe sheets\n",
                  f"{len(keep)} cells for {len(shots)} shots ({n} frames @ {fps:g} fps, {n / fps:.0f} s): each shot's first, "
                  f"middle and last frame{' (middle skipped for shots < 2 s)' if drop_mid else ''}, plus one every "
                  f"{step} s inside the {nmov} shots that move (mean mad_lo > {MOVE_MAD}). "
                  "Cell label = f<frame> <seconds>s S<shot> +<frames since previous cell>. "
                  "Red label = first frame of a new shot. Pull every frame of any range with `contact_sheets.py strip`.\n"])


def make_strip(vid, a, b):
    fps = SOURCES[vid]["fps"]
    b = min(b, n_frames(vid) - 1, a + 47)
    starts, shots = shot_starts(vid)
    frames = list(range(a, b + 1))
    cells = [Image.open(frame_path(vid, i)).convert("RGB") for i in frames]
    labels = [f"f{i} {i / fps:.3f}s S{shot_of(shots, i)}{audio_label(vid, i)}" for i in frames]
    marks = [i in starts for i in frames]
    od = os.path.join(ROOT, "analysis", "strips")
    os.makedirs(od, exist_ok=True)
    out = os.path.join(od, f"{vid}_{a:05d}-{b:05d}.png")
    grid(cells, 6, 320, labels, marks, out)
    print(os.path.relpath(out, ROOT))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "sheets"
    if cmd == "sheets":
        args = sys.argv[2:]
        sparse = "--sparse" in args
        ids = [x for x in args if x != "--sparse"] or list(SOURCES)
        for v in ids:
            (make_sparse if sparse else make_sheets)(v)
    elif cmd == "strip":
        make_strip(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))
    else:
        sys.exit(__doc__)
