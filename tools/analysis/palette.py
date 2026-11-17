#!/usr/bin/env python3
"""Dominant-color palettes (k-means in CIELAB) per video, per shot, and per still image.

Writes analysis/palettes/<id>.json  {"overall": [...], "shots": {"<n>": [...]}}
       analysis/palettes/<id>.png   swatch strip of the overall palette (hex + share)
       analysis/palettes/stills.json  palettes of every still in reference/
Each palette entry: {"hex": "#rrggbb", "pct": share of sampled pixels, "L": lightness 0..100}

Usage: python3 -I tools/analysis/palette.py            (all registered videos + stills in reference/)
       python3 -I tools/analysis/palette.py vox_creatine   (only these ids; no stills scan; ids missing
                                                            frames/shots are skipped with a warning)
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
RNG = np.random.default_rng(7)


def srgb_to_lab(rgb):
    c = rgb / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[:, 1] - 16, 500 * (f[:, 0] - f[:, 1]), 200 * (f[:, 1] - f[:, 2])], 1)


def kmeans(x, k=8, iters=15):
    cent = [x[RNG.integers(len(x))]]
    for _ in range(1, k):
        d = np.min(((x[:, None] - np.array(cent)[None]) ** 2).sum(-1), 1)
        tot = d.sum()
        cent.append(x[RNG.choice(len(x), p=d / tot)] if tot > 1e-9 else x[RNG.integers(len(x))])
    cent = np.array(cent)
    for _ in range(iters):
        lab = np.argmin(((x[:, None] - cent[None]) ** 2).sum(-1), 1)
        cent = np.array([x[lab == j].mean(0) if (lab == j).any() else cent[j] for j in range(k)])
    return lab, cent


def palette(pixels_rgb, k=8):
    lab_px = srgb_to_lab(pixels_rgb.astype(np.float64))
    lab, _ = kmeans(lab_px, k)
    out = []
    for j in range(k):
        sel = lab == j
        if not sel.any():
            continue
        rgb = np.median(pixels_rgb[sel], 0).astype(int)  # median RGB of the cluster = a real-looking color
        out.append({"hex": "#%02x%02x%02x" % tuple(rgb), "pct": round(float(sel.mean()), 3),
                    "L": round(float(lab_px[sel, 0].mean()), 1)})
    return sorted(out, key=lambda e: -e["pct"])


def sample(img, n=4000):
    a = np.asarray(img.convert("RGB")).reshape(-1, 3)
    return a[RNG.choice(len(a), size=min(n, len(a)), replace=False)]


def swatch(pal, out, title):
    font = ImageFont.load_default(size=14)
    w = 1200
    im = Image.new("RGB", (w, 110), (20, 20, 20))
    d = ImageDraw.Draw(im)
    d.text((6, 4), title, fill=(230, 230, 230), font=font)
    x = 0
    for e in pal:
        ww = max(60, int(e["pct"] * w)) if e is not pal[-1] else w - x
        rgb = tuple(int(e["hex"][i:i + 2], 16) for i in (1, 3, 5))
        d.rectangle([x, 24, x + ww, 110], fill=rgb)
        d.text((x + 4, 88), f"{e['hex']} {e['pct'] * 100:.0f}%", fill=(0, 0, 0) if e["L"] > 55 else (255, 255, 255), font=font)
        x += ww
        if x >= w:
            break
    im.save(out)


def main(ids):
    od = os.path.join(ROOT, "analysis", "palettes")
    os.makedirs(od, exist_ok=True)
    for vid in ids or SOURCES:
        shots_p = os.path.join(ROOT, "analysis", "metrics", f"{vid}_shots.json")
        if vid not in SOURCES or not os.path.exists(shots_p):
            print(f"WARNING: {vid}: not registered or missing frames/shots, skipped", file=sys.stderr)
            continue
        shots = json.load(open(shots_p))["shots"]
        allpx, per_shot = [], {}
        for s in shots:
            idx = np.unique(np.linspace(s["start"], s["end"], num=min(5, s["frames"])).astype(int))
            px = np.concatenate([sample(Image.open(_frames.frame_path(ROOT, SOURCES, vid, int(i))), 2000) for i in idx])
            allpx.append(px)
            if s["frames"] >= 6:
                per_shot[str(s["shot"])] = palette(px, 6)
        allpx = np.concatenate(allpx)
        allpx = allpx[RNG.choice(len(allpx), size=min(60000, len(allpx)), replace=False)]
        overall = palette(allpx, 12)
        json.dump({"overall": overall, "shots": per_shot}, open(os.path.join(od, f"{vid}.json"), "w"), indent=1)
        swatch(overall, os.path.join(od, f"{vid}.png"), f"{vid} — overall palette (k=12, CIELAB k-means)")
        print(vid, " ".join(e["hex"] for e in overall))
    if ids:
        return
    stills = {}
    for dp, _, files in os.walk(os.path.join(ROOT, "reference")):
        for f in sorted(files):
            if f.lower().endswith((".jpg", ".png", ".webp")):
                p = os.path.join(dp, f)
                stills[os.path.relpath(p, ROOT)] = palette(sample(Image.open(p), 20000), 8)
    json.dump(stills, open(os.path.join(od, "stills.json"), "w"), indent=1)
    print("stills:", len(stills))


if __name__ == "__main__":
    main(sys.argv[1:])
