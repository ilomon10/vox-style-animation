#!/usr/bin/env python3
"""Shot segmentation + per-shot timing/motion statistics from analysis/metrics/<id>.csv.

Writes:
  analysis/metrics/<id>_shots.json   machine-readable shots + transition events
  analysis/metrics/<id>_shots.md     human-readable table (for the analysts)

Definitions
  hard cut      frame where hist_l1 >= CUT_HIST and mad >= CUT_MAD and is the local max (+-2 f)
  soft trans.   >= 3 consecutive frames with hist_l1 >= SOFT_HIST (dissolves, wipes, fast pushes)
  held frame    mad_lo < HOLD (artwork did not change vs previous frame)
  cadence       median length of interior hold runs while the shot is animating:
                0 -> animated on ones, 1 -> on twos, 2 -> on threes ...
Usage: python3 -I tools/analysis/shots.py [id ...]
"""
import csv
import json
import os
import sys

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)
SOURCES = load_sources()
CUT_HIST, CUT_MAD, SOFT_HIST, HOLD = 0.35, 8.0, 0.12, 0.1


def load(vid):
    rows = list(csv.DictReader(open(os.path.join(ROOT, "analysis", "metrics", f"{vid}.csv"))))
    cols = {k: np.array([float(r[k]) for r in rows]) for k in rows[0]}
    return cols


def runs(mask):
    """(start, length) of runs of True."""
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            out.append((i, j - i))
            i = j
        else:
            i += 1
    return out


def analyse(vid):
    m = load(vid)
    fps = SOURCES[vid]["fps"]
    n = len(m["frame"])
    hist, mad, lo = m["hist_l1"], m["mad"], m["mad_lo"]
    cuts = []
    for i in range(1, n):
        if hist[i] >= CUT_HIST and mad[i] >= CUT_MAD:
            a, b = max(1, i - 2), min(n, i + 3)
            if hist[i] == hist[a:b].max():
                cuts.append(i)
    soft = []
    for s, L in runs(hist >= SOFT_HIST):
        if L >= 3:
            soft.append({"start": s, "end": s + L - 1, "frames": L,
                         "t0": round(s / fps, 2), "t1": round((s + L - 1) / fps, 2)})
    bounds = [0] + cuts + [n]
    shots = []
    for k in range(len(bounds) - 1):
        a, b = bounds[k], bounds[k + 1]
        if b - a < 1:
            continue
        seg = slice(a + 1, b)  # exclude the cut frame itself from motion stats
        held = lo[seg] < HOLD
        moving_frac = float(1 - held.mean()) if b - a > 1 else 0.0
        # cadence: interior hold runs bounded by motion on both sides
        hold_runs = [L for s, L in runs(held) if s > 0 and s + L < len(held)]
        short = [L for L in hold_runs if L <= 4]
        cadence = int(np.median(short)) if len(short) >= 3 else (0 if moving_frac > 0.9 else None)
        conf = m["pc_conf"][seg]
        good = conf > 0.08
        tx = float(m["tx"][seg][good].sum()) if good.any() else 0.0
        ty = float(m["ty"][seg][good].sum()) if good.any() else 0.0
        zoom = float(np.prod(m["zoom"][seg][good])) if good.any() else 1.0
        rot = float(m["rot_deg"][seg][good].sum()) if good.any() else 0.0
        shots.append({
            "shot": len(shots) + 1, "start": a, "end": b - 1, "frames": b - a,
            "t0": round(a / fps, 2), "t1": round((b - 1) / fps, 2), "dur_s": round((b - a) / fps, 2),
            "moving_frac": round(moving_frac, 2), "cadence_hold": cadence,
            "longest_hold_f": max([L for _, L in runs(held)], default=0),
            "cam_tx_px1920": round(tx, 1), "cam_ty_px1920": round(ty, 1),
            "cam_zoom_total": round(zoom, 3), "cam_rot_deg": round(rot, 2),
            "luma": round(float(m["luma"][a:b].mean()), 1), "sat": round(float(m["sat"][a:b].mean()), 3),
            "warmth": round(float(m["warmth"][a:b].mean()), 1),
            "motion_energy": round(float(mad[seg].mean()) if b - a > 1 else 0.0, 2),
        })
    durs = np.array([s["dur_s"] for s in shots])
    summary = {
        "id": vid, "fps": fps, "frames": n, "duration_s": round(n / fps, 2),
        "shots": len(shots), "hard_cuts": len(cuts), "soft_transitions": len(soft),
        "shot_dur_s": {"median": round(float(np.median(durs)), 2), "mean": round(float(durs.mean()), 2),
                       "p10": round(float(np.percentile(durs, 10)), 2),
                       "p90": round(float(np.percentile(durs, 90)), 2)},
        "held_frame_frac": round(float((lo[1:] < HOLD).mean()), 3),
    }
    out = {"summary": summary, "cuts": cuts, "soft_transitions": soft, "shots": shots}
    base = os.path.join(ROOT, "analysis", "metrics", f"{vid}_shots")
    json.dump(out, open(base + ".json", "w"), indent=1)
    with open(base + ".md", "w") as fh:
        fh.write(f"# {vid} — automatic shot table\n\n```\n{json.dumps(summary, indent=1)}\n```\n\n")
        fh.write("cadence_hold: 0 = animated on ones, 1 = on twos, 2 = on threes; None = mostly static.\n")
        fh.write("cam_*: summed global motion over the shot (px at 1920 width; zoom >1 = push-in).\n\n")
        fh.write("| # | t0–t1 (s) | frames | moving | cadence | cam tx/ty px | zoom | rot° | luma | sat | warm |\n")
        fh.write("|---|---|---|---|---|---|---|---|---|---|---|\n")
        for s in shots:
            fh.write(f"| {s['shot']} | {s['t0']}–{s['t1']} | {s['frames']} | {s['moving_frac']} | "
                     f"{s['cadence_hold']} | {s['cam_tx_px1920']}/{s['cam_ty_px1920']} | {s['cam_zoom_total']} | "
                     f"{s['cam_rot_deg']} | {s['luma']} | {s['sat']} | {s['warmth']} |\n")
        if soft:
            fh.write("\n## Soft transitions (>=3 frames of large color change)\n\n")
            for e in soft:
                fh.write(f"- f{e['start']}–f{e['end']} ({e['t0']}–{e['t1']} s, {e['frames']} f)\n")
    return summary


if __name__ == "__main__":
    for vid in sys.argv[1:] or list(SOURCES):
        print(json.dumps(analyse(vid)))
