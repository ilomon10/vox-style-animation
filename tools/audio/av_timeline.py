#!/usr/bin/env python3
"""Audio-visual timeline images: picture, motion, sound, beats and words on ONE frame-accurate axis.

  python3 -I tools/audio/av_timeline.py <id> [--window 8] [--from 0] [--to end]

Writes analysis/av/<id>_<t0>-<t1>.png (2400 px wide; one column = one video frame scaled):
  thumbnails every 0.5 s · visual change per frame (mad_lo, grey bars) with CUTS (red lines) and
  visual EVENT onsets (blue triangles) · audio level lanes (total / bass <200 Hz / mid / high, dB) ·
  spectrogram (72 log bands, 40 Hz–11 kHz; speech = harmonic stacks 100–4000 Hz, whooshes = broadband
  rising/falling noise, kicks = low bursts) ·
  onset strength (bars) with detected onsets (ticks) · beats (thin) and downbeats (thick) ·
  words (text at the word start, bar = duration) · frame ruler (tick every 5 f, label at each whole second).
Visual events = first frame of a burst of change after ≥4 quiet frames (see av_sync.py).
"""
import argparse
import csv
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)
SOURCES = load_sources()
W = 2400
FONT = ImageFont.load_default(size=13)
FONT_B = ImageFont.load_default(size=15)


def load_csv(p):
    rows = list(csv.DictReader(open(p)))
    return {k: np.array([float(r[k]) for r in rows]) for k in rows[0]}


def spectrogram(path, t0, t1, fps, n_bands=72, sr=22050):
    """log-power in log-spaced bands (40 Hz–11 kHz) per video frame -> array [frames, bands]"""
    import subprocess
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-ss", str(t0), "-to", str(t1), "-i", path,
                                   "-vn", "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"])
    y = np.frombuffer(raw, np.float32).astype(np.float64)
    hop = sr / fps
    n = int(len(y) / hop)
    nfft = 2048
    win = np.hanning(nfft)
    freqs = np.fft.rfftfreq(nfft, 1 / sr)
    edges = np.geomspace(40, 11000, n_bands + 1)
    idx = np.digitize(freqs, edges) - 1
    out = np.zeros((n, n_bands))
    ypad = np.pad(y, (nfft // 2, nfft // 2))
    for i in range(n):
        c = int(i * hop + hop / 2)
        seg = ypad[c:c + nfft]
        if len(seg) < nfft:
            break
        pw = np.abs(np.fft.rfft(seg * win)) ** 2
        for b in range(n_bands):
            sel = idx == b
            out[i, b] = pw[sel].mean() if sel.any() else 0
    return 10 * np.log10(out + 1e-10)


def visual_events(mad_lo, thr=0.5, quiet=4, max_gap=3):
    """first frames of change bursts preceded by ≥`quiet` still frames (gaps ≤ max_gap stay in a burst)"""
    act = mad_lo > thr
    ev, last_active = [], -10 ** 9
    for i, a in enumerate(act):
        if a:
            if i - last_active > quiet:
                ev.append(i)
            last_active = i if True else last_active
    # merge: stepping on twos creates gaps of 1–2 frames — handled by `quiet` > max_gap
    return np.array(ev, int)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--window", type=float, default=8.0)
    ap.add_argument("--from", dest="t_from", type=float, default=0.0)
    ap.add_argument("--to", dest="t_to", type=float, default=None)
    a = ap.parse_args()
    vid = a.id
    fps = SOURCES[vid]["fps"]
    m = load_csv(os.path.join(ROOT, "analysis", "metrics", f"{vid}.csv"))
    au = load_csv(os.path.join(ROOT, "analysis", "audio", f"{vid}_features.csv"))
    rh = json.load(open(os.path.join(ROOT, "analysis", "audio", f"{vid}_rhythm.json")))
    words = json.load(open(os.path.join(ROOT, "analysis", "audio", f"{vid}_words.json")))
    cuts = set(json.load(open(os.path.join(ROOT, "analysis", "metrics", f"{vid}_shots.json")))["cuts"])
    n = len(m["frame"])
    ev = set(visual_events(m["mad_lo"]).tolist())
    beats = {b["frame"] for b in rh["beats"]}
    downs = {b["frame"] for b in rh["downbeats"]}
    onsets = {o["frame"]: o["strength"] for o in rh["onsets"]}
    t_to = a.t_to or n / fps
    od = os.path.join(ROOT, "analysis", "av")
    os.makedirs(od, exist_ok=True)
    t0 = a.t_from
    while t0 < t_to - 1e-6:
        t1 = min(t0 + a.window, t_to)
        f0, f1 = int(round(t0 * fps)), min(n, int(round(t1 * fps)))
        nf = f1 - f0
        pxf = W / (a.window * fps)  # px per frame (constant across windows)
        x = lambda f: int((f - f0) * pxf)  # noqa: E731
        thumb_w = int(W / (a.window * 2))
        thumb_h = int(thumb_w * 9 / 16)
        lanes = [("visual change (mad_lo) · cuts red · events ▲", 90), ("audio level dB  total/bass/mid/high", 110),
                 ("spectrogram 40 Hz (bottom) – 11 kHz (top), log bands", 120),
                 ("onset strength · detected onsets", 70), ("beats (thin) / downbeats (thick)", 34), ("words", 92)]
        H = 30 + thumb_h + 10 + sum(h + 18 for _, h in lanes) + 30
        im = Image.new("RGB", (W, H), (250, 250, 248))
        d = ImageDraw.Draw(im)
        d.text((6, 6), f"{vid}  {t0:.2f}-{t1:.2f} s  (f{f0}-f{f1 - 1})  {fps:g} fps  · tempo {rh['tempo_bpm']} BPM", fill=(0, 0, 0), font=FONT_B)
        y = 30
        for k in range(int(a.window * 2)):
            fr = f0 + int(round(k * fps / 2))
            if fr >= f1:
                break
            p = os.path.join(ROOT, "analysis", "frames", vid, f"{fr:06d}.jpg")
            th = Image.open(p).convert("RGB").resize((thumb_w - 2, thumb_h))
            im.paste(th, (x(fr) + 1, y))
            d.text((x(fr) + 3, y + 2), f"f{fr}", fill=(255, 255, 0), font=FONT)
        y += thumb_h + 10
        # lane 1: visual change
        name, h = lanes[0]
        d.text((4, y), name, fill=(60, 60, 60), font=FONT)
        y += 16
        mx = max(1.0, float(np.percentile(m["mad_lo"][f0:f1], 98)) if nf else 1.0)
        for f in range(f0, f1):
            v = min(1.0, m["mad_lo"][f] / mx)
            d.rectangle([x(f), y + h - int(v * h), x(f) + max(1, int(pxf) - 1), y + h], fill=(120, 120, 120))
            if f in cuts:
                d.line([x(f), y - 4, x(f), H - 30], fill=(220, 30, 30), width=2)
            if f in ev:
                d.polygon([(x(f), y + h), (x(f) - 6, y + h + 10), (x(f) + 6, y + h + 10)], fill=(30, 90, 220))
        y += h + 2
        # lane 2: audio levels
        name, h = lanes[1]
        d.text((4, y), name, fill=(60, 60, 60), font=FONT)
        y += 16
        cols = {"rms_db": (0, 0, 0), "low_db": (40, 90, 220), "mid_db": (30, 150, 60), "high_db": (230, 120, 20)}
        for key, col in cols.items():
            pts = []
            for f in range(f0, min(f1, len(au[key]))):
                v = (np.clip(au[key][f], -60, 0) + 60) / 60
                pts.append((x(f) + pxf / 2, y + h - v * h))
            if len(pts) > 1:
                d.line(pts, fill=col, width=2 if key == "rms_db" else 1)
        y += h + 2
        # lane 2b: spectrogram
        name, h = lanes[2]
        d.text((4, y), name, fill=(60, 60, 60), font=FONT)
        y += 16
        spec = spectrogram(os.path.join(ROOT, SOURCES[vid]["path"]), t0, t1, fps)
        if len(spec):
            lo, hi = np.percentile(spec, 5), np.percentile(spec, 99.5)
            norm = np.clip((spec - lo) / (hi - lo + 1e-9), 0, 1)
            nb = norm.shape[1]
            img = np.zeros((h, len(norm), 3), np.uint8)
            for fi in range(len(norm)):
                col = np.interp(np.linspace(0, nb - 1, h)[::-1], np.arange(nb), norm[fi])
                img[:, fi, 0] = (255 * np.clip(col * 1.6, 0, 1)).astype(np.uint8)
                img[:, fi, 1] = (255 * np.clip(col * 1.6 - 0.6, 0, 1)).astype(np.uint8)
                img[:, fi, 2] = (255 * np.clip(0.35 + col - col * col * 1.2, 0, 1) * (1 - col * 0.5)).astype(np.uint8)
            sp = Image.fromarray(img).resize((max(1, int(len(norm) * pxf)), h), Image.NEAREST)
            im.paste(sp, (0, y))
        y += h + 2
        # lane 3: onset strength
        name, h = lanes[3]
        d.text((4, y), name, fill=(60, 60, 60), font=FONT)
        y += 16
        for f in range(f0, min(f1, len(au["onset"]))):
            v = au["onset"][f]
            d.rectangle([x(f), y + h - int(v * h), x(f) + max(1, int(pxf) - 1), y + h], fill=(170, 150, 210))
            if f in onsets:
                d.line([x(f), y, x(f), y + h], fill=(110, 40, 160), width=2)
        y += h + 2
        # lane 4: beats
        name, h = lanes[4]
        d.text((4, y), name, fill=(60, 60, 60), font=FONT)
        y += 16
        for f in range(f0, f1):
            if f in downs:
                d.rectangle([x(f), y, x(f) + 4, y + h], fill=(0, 0, 0))
            elif f in beats:
                d.line([x(f), y + h // 3, x(f), y + h], fill=(80, 80, 80), width=2)
        y += h + 2
        # lane 5: words
        name, h = lanes[5]
        d.text((4, y), name, fill=(60, 60, 60), font=FONT)
        y += 16
        row = 0
        for w in words:
            if w["frame_end"] < f0 or w["frame_start"] >= f1:
                continue
            xs, xe = x(max(f0, w["frame_start"])), x(min(f1, w["frame_end"]))
            yy = y + (row % 4) * 22
            d.rectangle([xs, yy + 16, max(xs + 2, xe), yy + 19], fill=(200, 120, 40) if w["prob"] > 0.6 else (190, 190, 190))
            d.line([xs, yy, xs, yy + 19], fill=(200, 120, 40), width=1)
            d.text((xs + 2, yy), w["word"], fill=(0, 0, 0) if w["prob"] > 0.6 else (130, 130, 130), font=FONT)
            row += 1
        y += h + 4
        # ruler: tick every 5 f, a longer tick + label at each whole second (frame round(s * fps), exact at 23.976/29.97)
        for f in range(f0, f1):
            if f % 5 == 0:
                d.line([x(f), y, x(f), y + 5], fill=(0, 0, 0))
        for sec in range(int(np.ceil(f0 / fps - 1e-9)), int(np.floor((f1 - 1) / fps + 1e-9)) + 1):
            f = int(round(sec * fps))
            if f0 <= f < f1:
                d.line([x(f), y, x(f), y + 10], fill=(0, 0, 0))
                d.text((x(f) + 2, y + 10), f"{sec}s f{f}", fill=(0, 0, 0), font=FONT)
        out = os.path.join(od, f"{vid}_{t0:06.2f}-{t1:06.2f}.png")
        im.save(out, optimize=True)
        print(os.path.relpath(out, ROOT))
        t0 = t1


if __name__ == "__main__":
    main()
