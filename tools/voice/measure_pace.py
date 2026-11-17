#!/usr/bin/env python3
"""Measure pace of a VO wav independently of ASR: speech/pause segmentation by energy.
  tools/.venv/bin/python tools/voice/measure_pace.py video-projects/<slug>/audio/vo_scratch.wav <n_words>
Prints articulation words/s (speech time only), pause median/p25/p90, phrase length median (pauses >= 250 ms split)."""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vo_common as vc  # noqa: E402


def main():
    y = vc.read_wav_mono(sys.argv[1])
    nw = int(sys.argv[2])
    h = int(0.01 * vc.OUT_SR)
    m = len(y) // h
    e = 20 * np.log10(np.abs(y[:m * h]).reshape(m, h).max(1) + 1e-9)
    on = e > e.max() - 38
    # close gaps < 80 ms (stop consonants)
    i = 0
    while i < m:
        if not on[i]:
            j = i
            while j < m and not on[j]:
                j += 1
            if j - i < 8 and i > 0 and j < m:
                on[i:j] = True
            i = j
        else:
            i += 1
    segs, i = [], 0
    while i < m:
        if on[i]:
            j = i
            while j < m and on[j]:
                j += 1
            segs.append((i / 100, j / 100))
            i = j
        else:
            i += 1
    gaps = [b[0] - a[1] for a, b in zip(segs[:-1], segs[1:]) if b[0] - a[1] >= 0.25]
    ph, s0 = [], segs[0][0]
    for a, b in zip(segs[:-1], segs[1:]):
        if b[0] - a[1] >= 0.25:
            ph.append(a[1] - s0)
            s0 = b[0]
    ph.append(segs[-1][1] - s0)
    sp = sum(b - a for a, b in segs)
    # pause-inclusive speech time for articulation: total voiced span minus long gaps
    art = (segs[-1][1] - segs[0][0]) - sum(gaps)
    print(f"words {nw}  articulation {nw / art:.2f} words/s (target 3.5)")
    print(f"pauses>=250ms n={len(gaps)} median {np.median(gaps):.2f}s p25 {np.percentile(gaps, 25):.2f} p90 {np.percentile(gaps, 90):.2f} (target 0.48/0.34/1.14)")
    print(f"phrases n={len(ph)} median {np.median(ph):.2f}s (target 1.6)  coverage {sp / (len(y) / vc.OUT_SR) * 100:.0f}%")


main()
