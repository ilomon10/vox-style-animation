#!/usr/bin/env python3
"""Procedural, tileable textures for src/earworm (numpy + PIL, fully synthetic).

  earworm_ground_black.jpg   3072 px tile  near-black construction-paper scraps with torn edges + ghost newsprint
                                           (luma 4-17, ghost <= 30; analysis/earworm-A.md §6, earworm-B.md §6)
  earworm_ground_white.jpg   3072 px tile  #F6F6F6 paper, fibre sigma ~3.5, soft darker patches to ~#ECECEC (earworm-C.md §6)
  earworm_distress.png       1024 px tile  white specks/scratches as alpha holes for letter distress (mask-image)

Everything is periodic by construction (FFT-filtered noise, shapes drawn at 3x3 wrapped offsets), so the
tile repeats seamlessly. Run: python3 tools/textures/earworm_textures.py
"""
import os
import numpy as np
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "public", "textures")
N = 3072


def fnoise(n, rng, f0, f1, power=1.0):
    """periodic band-limited noise in [-1,1]; frequencies in cycles per tile"""
    w = rng.standard_normal((n, n))
    F = np.fft.fft2(w)
    fy = np.fft.fftfreq(n)[:, None] * n
    fx = np.fft.fftfreq(n)[None, :] * n
    r = np.hypot(fx, fy)
    mask = ((r >= f0) & (r <= f1)).astype(float) / np.maximum(r, 1) ** power
    m = np.real(np.fft.ifft2(F * mask))
    return m / (np.abs(m).max() + 1e-9)


def torn_poly(rng, cx, cy, rx, ry, k=64, rough=18):
    """irregular scrap polygon with torn (fractal-jittered) edge"""
    pts = []
    base = rng.uniform(0, 6.28)
    ph = rng.uniform(0, 6.28, 4)
    for i in range(k):
        a = base + 2 * np.pi * i / k
        # superellipse-ish blob + low-freq wobble + high-freq tear
        wob = 1 + 0.08 * np.sin(3 * a + ph[0]) + 0.05 * np.sin(5 * a + ph[1])
        c, s = np.cos(a), np.sin(a)
        sq = 1 / (abs(c) ** 4 + abs(s) ** 4) ** 0.25  # squarish
        tear = rng.uniform(-rough, rough) + rng.uniform(-rough, rough) * 0.5
        pts.append((cx + (rx * wob * sq * c) + tear * c, cy + (ry * wob * sq * s) + tear * s))
    return pts


def draw_wrapped(draw, pts, fill):
    for ox in (-N, 0, N):
        for oy in (-N, 0, N):
            draw.polygon([(x + ox, y + oy) for x, y in pts], fill=fill)


def ground_black():
    rng = np.random.default_rng(1976)
    img = Image.new("L", (N, N), 10)  # #0A0A0A
    d = ImageDraw.Draw(img)
    # 7 overlapping scraps, each a slightly different black (luma 6-15); lighter fibre rim drawn first
    for i in range(7):
        cx, cy = rng.uniform(0, N), rng.uniform(0, N)
        rx, ry = rng.uniform(550, 1000), rng.uniform(450, 800)
        pts = torn_poly(rng, cx, cy, rx, ry)
        rim = [(cx + (x - cx) * 1.004, cy + (y - cy) * 1.004) for x, y in pts]
        draw_wrapped(d, rim, int(rng.integers(15, 19)))   # worn torn rim, luma 15-18
        draw_wrapped(d, pts, int(rng.integers(5, 15)))
    a = np.asarray(img, dtype=np.float32)
    # ghost newsprint: columns of word-blocks, luma +4..+12 (<= 30)
    ghost = Image.new("L", (N, N), 0)
    g = ImageDraw.Draw(ghost)
    col_w, gap = 520, 70
    for c in range(N // (col_w + gap)):
        x0 = c * (col_w + gap) + 40
        y = 0
        while y < N:
            # headline every so often, then body lines of word blocks
            h = 26 if rng.random() > 0.07 else 70
            x = x0
            while x < x0 + col_w:
                wlen = int(rng.integers(30, 150)) * (h / 26)
                if x + wlen > x0 + col_w:
                    wlen = x0 + col_w - x
                if wlen > 8:
                    for ox in (-N, 0):
                        for oy in (-N, 0, N):
                            g.rectangle([x + ox, y + oy, x + wlen + ox, y + h * 0.62 + oy], fill=int(rng.integers(150, 255)))
                x += wlen + 16
            y += h * 1.5 if h == 26 else h * 1.7
    gh = np.asarray(ghost.resize((N, N), Image.BILINEAR), dtype=np.float32) / 255
    gh = np.asarray(Image.fromarray((gh * 255).astype(np.uint8)).filter(__import__("PIL.ImageFilter", fromlist=["x"]).GaussianBlur(2.2)), dtype=np.float32) / 255
    # fade the newsprint across blotchy regions so it reads as ghosts, not a clean page
    blot = fnoise(N, rng, 1, 6) * 0.5 + 0.5
    a += gh * (2 + 5 * blot)
    a += fnoise(N, rng, 20, 600, 0.6) * 1.6 + fnoise(N, rng, 600, 1500, 0) * 0.9   # fibres + grain (sigma ~1.3)
    a = np.clip(a, 3, 28)
    Image.fromarray(a.round().astype(np.uint8)).convert("RGB").save(os.path.join(OUT, "earworm_ground_black.jpg"), quality=95)


def ground_white():
    rng = np.random.default_rng(963)
    base = np.full((N, N), 248.0)  # #F6F6F6
    base += fnoise(N, rng, 2, 7) * 4.5 - 2.2             # soft darker patches (to ~#ECECEC)
    # a few large torn sheets laid over the paper: -7..+2 levels (the white ground is a collage of paper scraps too)
    sheets = Image.new("F", (N, N), 0)
    sd = ImageDraw.Draw(sheets)
    for _ in range(6):
        pts = torn_poly(rng, rng.uniform(0, N), rng.uniform(0, N), rng.uniform(500, 900), rng.uniform(400, 750), rough=14)
        for ox in (-N, 0, N):
            for oy in (-N, 0, N):
                sd.polygon([(x + ox, y + oy) for x, y in pts], fill=float(rng.uniform(-3, 1)))
    base += np.asarray(sheets, dtype=np.float32)
    fib = Image.new("F", (N, N), 0)
    fd = ImageDraw.Draw(fib)
    for _ in range(26000):                                # short curved fibres, wrapped
        x, y = rng.uniform(0, N), rng.uniform(0, N)
        a = rng.uniform(0, 6.28)
        l = rng.uniform(8, 30)
        v = float(rng.uniform(-10, 6))
        for ox in (-N, 0, N):
            for oy in (-N, 0, N):
                if -40 < x + ox < N + 40 and -40 < y + oy < N + 40:
                    fd.line([(x + ox, y + oy), (x + ox + np.cos(a) * l, y + oy + np.sin(a) * l)], fill=v, width=1)
    base += np.asarray(fib, dtype=np.float32) * 0.9
    base += fnoise(N, rng, 300, 1500, 0) * 15           # fine tooth, sigma ~3-4 overall
    base = np.clip(base, 228, 255)
    Image.fromarray(base.round().astype(np.uint8)).convert("RGB").save(os.path.join(OUT, "earworm_ground_white.jpg"), quality=95)


def distress():
    n = 1024
    rng = np.random.default_rng(2020)
    alpha = np.full((n, n), 255.0)
    img = Image.fromarray(alpha.astype(np.uint8), "L")
    d = ImageDraw.Draw(img)
    for _ in range(2200):                                  # specks 1-4 px
        x, y, r = rng.uniform(0, n), rng.uniform(0, n), rng.uniform(0.4, 1.3)
        for ox in (-n, 0, n):
            for oy in (-n, 0, n):
                d.ellipse([x + ox - r, y + oy - r, x + ox + r, y + oy + r], fill=0)
    for _ in range(45):                                    # scratches
        x, y = rng.uniform(0, n), rng.uniform(0, n)
        a, l = rng.uniform(-0.5, 0.5) + (np.pi / 2 if rng.random() < .3 else 0), rng.uniform(12, 45)
        for ox in (-n, 0, n):
            for oy in (-n, 0, n):
                d.line([(x + ox, y + oy), (x + ox + np.cos(a) * l, y + oy + np.sin(a) * l)], fill=0, width=1)
    a = np.asarray(img, dtype=np.float32)
    blot = fnoise(n, rng, 2, 12) * 0.5 + 0.5                # density varies: voids cluster
    keep = np.where((blot > 0.55) | (rng.random((n, n)) < 0.0), a, np.maximum(a, 200))
    out = np.zeros((n, n, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = keep.astype(np.uint8)
    Image.fromarray(out, "RGBA").save(os.path.join(OUT, "earworm_distress.png"))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    ground_black(); ground_white(); distress()
    print("ok")
