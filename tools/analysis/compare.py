#!/usr/bin/env python3
"""Compare a rendered frame against a reference frame (style match, not pixel match).

  python3 -I tools/analysis/compare.py <reference.png|video_id@seconds> <render.png> [--out name]

Outputs analysis/compare/<name>.png (side by side + both palettes) and prints JSON metrics:
  palette_dE      weighted mean CIEDE76 distance between the two 8-colour palettes (<10 good, <6 very close)
  luma_p05/p95    black / white points of each image (0..255)
  sat_mean        mean HSV saturation
  warmth          mean(R) - mean(B)
  grain_std       std of a 3x3 high-pass in the flattest 20% of 16px blocks, ignoring perfectly
                  uniform blocks such as pillarbox bars (texture/grain amount)
  edge_density    share of pixels with strong gradients (visual busyness)
"""
import argparse
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from palette import palette, srgb_to_lab  # noqa: E402

SOURCES = load_sources()


def load(spec):
    if "@" in spec and spec.split("@")[0] in SOURCES:
        vid, sec = spec.split("@")
        tmp = os.path.join(ROOT, "analysis", "compare", f"_ref_{vid}_{sec}.png")
        os.makedirs(os.path.dirname(tmp), exist_ok=True)
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-ss", sec, "-i",
                               os.path.join(ROOT, SOURCES[vid]["path"]), "-frames:v", "1", tmp])
        spec = tmp
    return Image.open(spec).convert("RGB")


def metrics(im):
    small = im.resize((960, int(960 * im.height / im.width)), Image.LANCZOS)
    a = np.asarray(small, np.float32)
    g = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    mx, mn = a.max(2), a.min(2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    hp = g[1:-1, 1:-1] * 9 - sum(np.roll(np.roll(g, dy, 0), dx, 1)[1:-1, 1:-1]
                                 for dy in (-1, 0, 1) for dx in (-1, 0, 1))
    hp /= 8
    b = 16
    H, W = (hp.shape[0] // b) * b, (hp.shape[1] // b) * b
    blocks = hp[:H, :W].reshape(H // b, b, W // b, b)
    gb = g[1:-1, 1:-1][:H, :W].reshape(H // b, b, W // b, b)
    var = gb.std(axis=(1, 3))
    # ignore perfectly uniform blocks (pillarbox bars, pure black/white fills): they carry no grain
    live = var > 0.05
    if not live.any():
        live = np.ones_like(var, bool)
    flat = live & (var <= np.percentile(var[live], 20))
    grain = float(blocks.std(axis=(1, 3))[flat].mean())
    gy, gx = np.gradient(g)
    edges = float((np.hypot(gx, gy) > 24).mean())
    px = np.asarray(small).reshape(-1, 3)
    px = px[np.random.default_rng(3).choice(len(px), 30000, replace=False)]
    return {
        "luma_p05": round(float(np.percentile(g, 5)), 1), "luma_p95": round(float(np.percentile(g, 95)), 1),
        "sat_mean": round(float(sat.mean()), 3), "warmth": round(float(a[..., 0].mean() - a[..., 2].mean()), 1),
        "grain_std": round(grain, 2), "edge_density": round(edges, 3),
    }, palette(px, 8)


def palette_de(p1, p2):
    l1 = srgb_to_lab(np.array([[int(e["hex"][i:i + 2], 16) for i in (1, 3, 5)] for e in p1], np.float64))
    l2 = srgb_to_lab(np.array([[int(e["hex"][i:i + 2], 16) for i in (1, 3, 5)] for e in p2], np.float64))
    w1 = np.array([e["pct"] for e in p1])
    w2 = np.array([e["pct"] for e in p2])
    d = np.sqrt(((l1[:, None] - l2[None]) ** 2).sum(-1))
    # symmetric: each colour's distance to the nearest colour of the other palette, weighted by share
    return float((w1 * d.min(1)).sum() / w1.sum() / 2 + (w2 * d.min(0)).sum() / w2.sum() / 2)


def strip(pal, w):
    im = Image.new("RGB", (w, 60), (0, 0, 0))
    d = ImageDraw.Draw(im)
    x = 0
    for e in pal:
        ww = int(round(e["pct"] * w))
        d.rectangle([x, 0, x + ww, 60], fill=tuple(int(e["hex"][i:i + 2], 16) for i in (1, 3, 5)))
        x += ww
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ref")
    ap.add_argument("render")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    r, t = load(a.ref), load(a.render)
    mr, pr = metrics(r)
    mt, pt = metrics(t)
    de = palette_de(pr, pt)
    W = 960
    h = int(W * 9 / 16)
    sheet = Image.new("RGB", (W * 2 + 12, h + 60 + 28), (20, 20, 20))
    sheet.paste(r.resize((W, h), Image.LANCZOS), (0, 28))
    sheet.paste(t.resize((W, h), Image.LANCZOS), (W + 12, 28))
    sheet.paste(strip(pr, W), (0, 28 + h))
    sheet.paste(strip(pt, W), (W + 12, 28 + h))
    f = ImageFont.load_default(size=16)
    dr = ImageDraw.Draw(sheet)
    dr.text((6, 5), f"REFERENCE  {a.ref}", fill=(230, 230, 230), font=f)
    dr.text((W + 18, 5), f"RENDER  {os.path.basename(a.render)}   palette ΔE={de:.1f}", fill=(230, 230, 230), font=f)
    name = a.out or os.path.splitext(os.path.basename(a.render))[0]
    out = os.path.join(ROOT, "analysis", "compare", f"{name}.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sheet.save(out)
    print(json.dumps({"out": os.path.relpath(out, ROOT), "palette_dE": round(de, 2),
                      "reference": mr, "render": mt}, indent=1))


if __name__ == "__main__":
    main()
