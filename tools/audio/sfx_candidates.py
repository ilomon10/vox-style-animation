#!/usr/bin/env python3
"""Find sound-effect candidates in a soundtrack: sharp onsets away from speech, with a suggested cut window.

  tools/py tools/audio/sfx_candidates.py <audio48k.wav> [--words words.json] [--top 30] [--csv out.csv]

Reads the 48 kHz stereo WAV in 10 ms hops (mid = (L+R)/2, side = (L-R)/2), finds onsets where the level jumps
>= --jump dB above the previous 150 ms, drops those within 0.15 s of a transcribed word, and ranks the rest by
how loud and how sudden they are. Columns: t0-t1 (a window around the onset: 50 ms before, until the level falls
back), peak dBFS, jump dB, side share (how much of the energy is NOT centre: high = effects/music, low = voice-like),
spectral centroid (low = thumps/booms, high = ticks/swishes). Copy good windows into the reference's sfx.manifest.json
(template: tools/reference/sfx.manifest.template.json) and LISTEN before trusting a label.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
import wave

import numpy as np



def levels(path: str):
    w = wave.open(path, "rb")
    if w.getsampwidth() != 2:
        sys.exit("expects 16-bit PCM (tools/reference/ingest.py writes audio48k.wav)")
    sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
    x = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float32) / 32768
    x = x.reshape(-1, ch) if ch > 1 else np.repeat(x[:, None], 2, 1)
    hop = int(sr * 0.01)
    m = (x[:, 0] + x[:, 1]) / 2
    s = (x[:, 0] - x[:, 1]) / 2
    nf = len(m) // hop
    M = m[: nf * hop].reshape(nf, hop)
    S = s[: nf * hop].reshape(nf, hop)
    rms_m = np.sqrt((M ** 2).mean(1) + 1e-12)
    rms_s = np.sqrt((S ** 2).mean(1) + 1e-12)
    peak = np.abs(np.concatenate([M, S], 1)).max(1)
    # spectral centroid per 40 ms block of mid
    cent = np.zeros(nf)
    for i in range(0, nf, 4):
        seg = m[i * hop:(i + 4) * hop]
        if len(seg) < 64:
            continue
        sp = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))
        f = np.fft.rfftfreq(len(seg), 1 / sr)
        cent[i:i + 4] = (sp * f).sum() / (sp.sum() + 1e-12)
    return sr, rms_m, rms_s, peak, cent


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("wav")
    ap.add_argument("--words")
    ap.add_argument("--top", type=int, default=30)
    ap.add_argument("--jump", type=float, default=9.0)
    ap.add_argument("--floor", type=float, default=-45.0, help="ignore onsets quieter than this peak dBFS")
    ap.add_argument("--csv")
    a = ap.parse_args()
    sr, rm, rs, pk, cent = levels(a.wav)
    db = 20 * np.log10(np.sqrt(rm ** 2 + rs ** 2) + 1e-9)
    busy = np.zeros(len(db), bool)
    if a.words:
        for w in json.load(open(a.words)):
            i0, i1 = int((w["start"] - 0.15) * 100), int((w["end"] + 0.15) * 100)
            busy[max(0, i0):max(0, i1)] = True
    cands = []
    i = 15
    while i < len(db) - 1:
        prev = db[i - 15:i].mean()
        if db[i] - prev >= a.jump and not busy[i] and 20 * np.log10(pk[i] + 1e-9) >= a.floor:
            j = i
            top = db[i]
            while j < len(db) - 1 and j - i < 300 and db[j] > max(prev + 3, top - 24):
                top = max(top, db[j])
                j += 1
            seg = slice(i, max(i + 1, j))
            side = float((rs[seg] ** 2).sum() / ((rm[seg] ** 2).sum() + (rs[seg] ** 2).sum() + 1e-12))
            cands.append({"t0": round(max(0, i - 5) / 100, 2), "t1": round(j / 100 + 0.05, 2),
                          "peak_dbfs": round(float(20 * np.log10(pk[seg].max() + 1e-9)), 1), "jump_db": round(float(db[i] - prev), 1),
                          "side_share": round(side, 2), "centroid_hz": int(np.median(cent[seg])),
                          "score": float(db[i] - prev) + 0.3 * float(20 * np.log10(pk[seg].max() + 1e-9) + 60)})
            i = j + 5
        else:
            i += 1
    cands.sort(key=lambda c: -c["score"])
    cands = cands[: a.top]
    print(f"{len(cands)} candidates (sorted by strength); side share: 0 = all centre (voice-like), 0.5 = wide")
    print("   t0      t1   peak dBFS  jump dB  side  centroid Hz")
    for c in sorted(cands, key=lambda c: c["t0"]):
        print(f"{c['t0']:7.2f} {c['t1']:7.2f}   {c['peak_dbfs']:6.1f}    {c['jump_db']:5.1f}   {c['side_share']:.2f}  {c['centroid_hz']:6d}")
    if a.csv:
        with open(a.csv, "w", newline="") as fh:
            wr = csv.DictWriter(fh, fieldnames=["t0", "t1", "peak_dbfs", "jump_db", "side_share", "centroid_hz", "score"])
            wr.writeheader()
            wr.writerows(cands)
    return 0


if __name__ == "__main__":
    sys.exit(main())
