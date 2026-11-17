#!/usr/bin/env python3
"""Split a long video into ~target-sec segments at hard cuts, and cut the analysis audio to match.

  python3 -I tools/analysis/segment_long.py <id> [--target-sec 150] [--min-sec 60]

Needs analysis/metrics/<id>_shots.json (tools/analysis/shots.py). For every multiple of target-sec the
nearest hard cut becomes a segment boundary (cuts closer than min-sec to the previous boundary or to the end
are dropped). Writes the same formats the earworm analysis used (frame numbers are GLOBAL, f1 inclusive):
  analysis/segments/<id>_segments.json          {source, fps, note, segments:[{id:A.., t0, t1, f0, f1}]}
  analysis/audio/<id>_full_stereo48k.wav        16-bit stereo 48 kHz (read by av_sync.py)
  analysis/audio/<id>_<S>.wav                   per segment, mono 22.05 kHz float32 (read by transcribe.py)
No video segment files are written (nothing reads them). Run heavy jobs under `flock out/.analysis.lock`.
"""
import argparse
import json
import os
import sys
import string
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)


def boundaries(cuts, n, fps, target, min_sec):
    """global first-frames of segments 2.. (nearest hard cut to each multiple of target)"""
    out, k = [], 1
    while k * target < n / fps - min_sec:
        ideal = k * target * fps
        pool = [c for c in cuts if 0 < c < n]
        b = min(pool, key=lambda c: abs(c - ideal)) if pool else int(round(ideal))
        prev = out[-1] if out else 0
        if (b - prev) / fps >= min_sec and (n - b) / fps >= min_sec and b not in out:
            out.append(b)
        k += 1
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--target-sec", type=float, default=150)
    ap.add_argument("--min-sec", type=float, default=60)
    a = ap.parse_args()
    src = load_sources()[a.id]
    shots = json.load(open(os.path.join(ROOT, "analysis", "metrics", f"{a.id}_shots.json")))
    fps, n = src["fps"], shots["summary"]["frames"]
    bs = boundaries(shots["cuts"], n, fps, a.target_sec, a.min_sec)
    starts, ends = [0] + bs, [b - 1 for b in bs] + [n - 1]
    if len(starts) > len(string.ascii_uppercase):
        raise SystemExit("too many segments for single-letter ids; raise --target-sec")
    segs = []
    for i, (f0, f1) in enumerate(zip(starts, ends)):
        segs.append({"id": string.ascii_uppercase[i], "t0": round(f0 / fps, 3),
                     "t1": round((f1 + 1) / fps, 3), "f0": f0, "f1": f1})
    os.makedirs(os.path.join(ROOT, "analysis", "segments"), exist_ok=True)
    adir = os.path.join(ROOT, "analysis", "audio")
    os.makedirs(adir, exist_ok=True)
    out = {"source": src["path"], "fps": fps,
           "note": f"split at hard cuts near each multiple of {a.target_sec:g} s; frame numbers are GLOBAL "
                   f"(same as analysis/frames/{a.id})", "segments": segs}
    with open(os.path.join(ROOT, "analysis", "segments", f"{a.id}_segments.json"), "w") as fh:
        json.dump(out, fh, indent=1)
    full = os.path.join(adir, f"{a.id}_full_stereo48k.wav")
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(ROOT, src["path"]), "-vn", "-ac", "2",
                           "-ar", "48000", "-c:a", "pcm_s16le", full])
    for s in segs:
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-ss", str(s["t0"]), "-to", str(s["t1"]), "-i", full,
                               "-ac", "1", "-ar", "22050", "-c:a", "pcm_f32le",
                               os.path.join(adir, f"{a.id}_{s['id']}.wav")])
        print(f"{s['id']}: {s['t0']:.2f}-{s['t1']:.2f} s  f{s['f0']}-{s['f1']}")


if __name__ == "__main__":
    main()
