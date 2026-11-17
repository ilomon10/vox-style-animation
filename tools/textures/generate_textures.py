#!/usr/bin/env python3
"""Procedural, seamless (tileable) textures for the Vox-style kit -> public/textures/.

Everything is generated from seeded noise, so the kit ships no third-party texture files.
Spectral synthesis (FFT-filtered white noise) is periodic, so every tile wraps seamlessly;
specks, fibres and scratches are drawn with wrap-around for the same reason.

  paper_warm.jpg      warm off-white desk/scrapbook paper (paper-desk style)
  paper_aged.jpg      yellowed newsprint / document paper
  paper_cool.jpg      neutral light-grey card (Vox explainer backgrounds)
  paper_watercolour.jpg  cold-press watercolour paper, tinted per section (scrapbook look)
  paper_black.jpg     scratched, chalky black paper (dark-collage style)
  paper_desk.jpg      cream desk surface with sparse warm-grey and pink/red flecks (paper desk flyover)
  paper_crumpled.jpg  warm grey crumpled sheet with a crease network (Vox editorial)
  grain_<n>.png       8 monochrome grain tiles 1024 px (mid-grey 128 = neutral; std 40 levels; used with hard-light)
  dust_<n>.png        8 transparent dark/light film dust overlays 1920x1080
  dustbright_<n>.png  12-drawing loop of bright specks + 1-4 thin vertical scratches drifting 3.7 px/f
                      (dark collage), 3840x2160 RGBA, screen blend; frame i = drawing i

Tile scale: paper tiles are 3072 px and are shown at 1536 design px (2 tile px per design px), so they stay
sharp at 4K. All feature sizes below are written in design px (1080p) and converted with S = n / 1536.

Usage: python3 -I tools/textures/generate_textures.py [--size 3072] [--only paper_warm,...]
Tune the PRESETS dict; values are documented in docs/style-guide/05-textures-materials.md.
"""
import argparse
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT = os.path.join(ROOT, "public", "textures")


TILE_DESIGN_PX = 1536  # a paper tile spans this many design px (3072 px tile -> 2 px per design px)


def hex_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)


def spectral_noise(n, beta, rng, low_cut=0.0):
    """Periodic noise with power spectrum 1/f^beta, normalised to zero mean / unit std (float32)."""
    white = rng.standard_normal((n, n), dtype=np.float32)
    fy = np.fft.fftfreq(n).astype(np.float32)[:, None]
    fx = np.fft.rfftfreq(n).astype(np.float32)[None, :]
    r = np.sqrt(fx ** 2 + fy ** 2)
    r[0, 0] = 1.0
    amp = 1.0 / r ** (beta / 2)
    if low_cut:
        amp *= 1 - np.exp(-(r / low_cut) ** 2)
    amp[0, 0] = 0
    out = np.fft.irfft2(np.fft.rfft2(white) * amp, s=(n, n)).astype(np.float32)
    return (out - out.mean()) / (out.std() + 1e-9)


def wrap_draw(draw_fn, n):
    """Call draw_fn(dx, dy) for the 9 wrapped offsets so marks crossing an edge tile seamlessly."""
    for dx in (-n, 0, n):
        for dy in (-n, 0, n):
            draw_fn(dx, dy)


def n_for(density_per_100sq, n):
    """number of marks for a density given per 100x100 design px, over an n px tile"""
    return int(density_per_100sq * (TILE_DESIGN_PX / 100.0) ** 2)


def paper(n, rng, p):
    S = n / TILE_DESIGN_PX
    base = hex_rgb(p["base"])
    # large soft mottling + mid cloudiness + fine tooth
    mott = spectral_noise(n, 3.2, rng) * p["mottle"]
    cloud = spectral_noise(n, 2.2, rng) * p["cloud"]
    tooth = spectral_noise(n, 0.6, rng) * p["tooth"]
    lum = mott + cloud + tooth
    del mott, cloud, tooth
    tint = np.array(p.get("lum_tint", [1.0, 1.0, 1.0]), np.float32)
    img = base[None, None, :] + lum[..., None] * tint[None, None, :]
    del lum
    if p.get("hue_drift"):  # slight hue drift (warmer in some areas)
        hd = spectral_noise(n, 3.0, rng) * p["hue_drift"]
        img[..., 0] += hd
        img[..., 2] -= hd
    # fibres: short faint curved strokes
    layer = Image.new("L", (n, n), 0)
    d = ImageDraw.Draw(layer)
    for _ in range(n_for(p["fibres"], n)):
        x, y = rng.uniform(0, n, 2)
        ang = rng.uniform(0, np.pi)
        ln = rng.uniform(3, 14) * S
        pts = []
        for k in range(5):
            t = k / 4
            pts.append((x + np.cos(ang) * ln * t + rng.normal(0, 0.6 * S), y + np.sin(ang) * ln * t + rng.normal(0, 0.6 * S)))
        val = int(rng.uniform(20, 60))

        def draw(dx, dy, pts=pts, val=val):
            d.line([(a + dx, b + dy) for a, b in pts], fill=val, width=1)

        wrap_draw(draw, n)
    layer = layer.filter(ImageFilter.GaussianBlur(0.6))
    img += (np.asarray(layer, np.float32) / 255.0)[..., None] * p["fibre_strength"]  # fibres lighter (+) or darker (-)
    del layer
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
    del img
    # specks: (colour, density per 100x100 design px, alpha range). 1-3 px mostly, rare bigger ones
    for colour, dens, (a_lo, a_hi) in p["specks"]:
        c = tuple(int(v) for v in hex_rgb(colour))
        ov = Image.new("RGBA", (n, n), (0, 0, 0, 0))
        dd = ImageDraw.Draw(ov)
        for _ in range(n_for(dens, n)):
            x, y = rng.uniform(0, n, 2)
            r = rng.choice([0.45, 0.7, 1.0, 1.5, 2.4], p=[0.3, 0.3, 0.22, 0.13, 0.05]) * S
            a = int(rng.uniform(a_lo, a_hi) * 255)

            def draw(dx, dy, x=x, y=y, r=r, a=a):
                dd.ellipse([x + dx - r, y + dy - r * 0.8, x + dx + r, y + dy + r * 1.1], fill=c + (a,))

            wrap_draw(draw, n)
        im = Image.alpha_composite(im, ov)
    im = im.convert("RGB").filter(ImageFilter.GaussianBlur(p.get("soften", 0.35) * S / 0.67 * 0.67))
    return im


def black_paper(n, rng, p):
    S = n / 2048
    im = paper(n, rng, p)
    arr = np.asarray(im, np.float32)
    # chalky smudges: low-frequency light haze
    haze = np.clip(spectral_noise(n, 2.8, rng), 0, None) * p["haze"]
    arr = arr + haze[..., None]
    # scratches: long thin slightly curved light arcs (1-2 px) + short scuffs
    layer = Image.new("L", (n, n), 0)
    d = ImageDraw.Draw(layer)
    for _ in range(int(p["scratches"] * S ** 2)):
        x, y = rng.uniform(0, n, 2)
        ang = rng.uniform(0, np.pi)
        ln = rng.uniform(80, 700) * S
        bend = rng.normal(0, 0.15)
        pts = []
        for k in range(12):
            t = k / 11
            a = ang + bend * t
            pts.append((x + np.cos(a) * ln * t, y + np.sin(a) * ln * t))
        val = int(rng.uniform(40, 140))
        w = int(rng.choice([1, 1, 1, 2]))

        def draw(dx, dy, pts=pts, val=val, w=w):
            d.line([(a + dx, b + dy) for a, b in pts], fill=val, width=w)

        wrap_draw(draw, n)
    for _ in range(int(p["scuffs"] * S ** 2)):
        x, y = rng.uniform(0, n, 2)
        ang = rng.uniform(0, np.pi)
        ln = rng.uniform(4, 30) * S
        val = int(rng.uniform(30, 90))

        def draw(dx, dy, x=x, y=y, ang=ang, ln=ln, val=val):
            d.line([(x + dx, y + dy), (x + dx + np.cos(ang) * ln, y + dy + np.sin(ang) * ln)], fill=val, width=1)

        wrap_draw(draw, n)
    layer = layer.filter(ImageFilter.GaussianBlur(0.7))
    sc = np.asarray(layer, np.float32)[..., None] * p["scratch_strength"]
    arr = arr + sc * (1 - arr / 255.0)  # screen-like: brightens dark paper
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def periodic_voronoi(m, k, rng, warp):
    """F1 and F2 distances (in cells of an m x m periodic grid) and id of nearest of k random seed points,
    with a smooth domain warp so creases are not straight."""
    pts = rng.uniform(0, m, (k, 2)).astype(np.float32)
    yy, xx = np.mgrid[0:m, 0:m].astype(np.float32)
    if warp is not None:
        xx = (xx + warp[0]) % m
        yy = (yy + warp[1]) % m
    f1 = np.full((m, m), 1e9, np.float32)
    f2 = np.full((m, m), 1e9, np.float32)
    idx = np.zeros((m, m), np.int32)
    for i, (px, py) in enumerate(pts):
        dx = np.abs(xx - px)
        dx = np.minimum(dx, m - dx)
        dy = np.abs(yy - py)
        dy = np.minimum(dy, m - dy)
        d = np.sqrt(dx * dx + dy * dy)
        closer = d < f1
        f2 = np.where(closer, f1, np.minimum(f2, d))
        idx = np.where(closer, i, idx)
        f1 = np.where(closer, d, f1)
    return f1, f2, idx


def crumpled(n, rng, p):
    """Crumpled sheet: facets of random brightness (Voronoi at two scales, warped) + dark/light crease
    lines along facet borders + a few stains + fine static tooth. Monochrome-ish, warm grey."""
    S = n / TILE_DESIGN_PX
    m = 1024
    up = lambda a: np.asarray(Image.fromarray(a.astype(np.float32), "F").resize((n, n), Image.BICUBIC), np.float32)
    lum = np.zeros((n, n), np.float32)
    crease = np.zeros((m, m), np.float32)
    for k, fac, cw in ((70, p["facet_big"], 1.6), (260, p["facet_small"], 1.0), (900, p["facet_tiny"], 0.6)):
        wm = spectral_noise(m, 3.0, rng)
        warp = (wm * 18, spectral_noise(m, 3.0, rng) * 18)
        f1, f2, idx = periodic_voronoi(m, k, rng, warp)
        bright = rng.standard_normal(k).astype(np.float32) * fac
        # facets get a gentle gradient across them (tilted plane) -> soft shading, not flat tiles
        lum += up(bright[idx])
        edge = np.clip(1 - (f2 - f1) / (cw * 2.2), 0, 1)  # 1 on the border line
        crease += edge * rng.uniform(0.6, 1.0)
    crease = up(crease)
    lum -= crease * p["crease_vor"]
    # hairline cracks: persistent random walks, dark line + light shoulder (reference hl_f021: thin, sparse)
    dark = Image.new("L", (n, n), 0)
    light = Image.new("L", (n, n), 0)
    dd, dl = ImageDraw.Draw(dark), ImageDraw.Draw(light)
    for _ in range(p["cracks"]):
        x, y = rng.uniform(0, n, 2)
        ang = rng.uniform(0, 2 * np.pi)
        pts = [(x, y)]
        for _ in range(int(rng.integers(20, 70))):
            ang += rng.normal(0, 0.28)
            st = rng.uniform(4, 11) * S
            pts.append((pts[-1][0] + np.cos(ang) * st, pts[-1][1] + np.sin(ang) * st))
        v = int(rng.uniform(90, 255))

        def draw(dx, dy, pts=pts, v=v):
            dd.line([(a_ + dx, b_ + dy) for a_, b_ in pts], fill=v, width=max(1, round(S)))
            dl.line([(a_ + dx + 1.5 * S, b_ + dy + 1.5 * S) for a_, b_ in pts], fill=v, width=max(1, round(S)))

        wrap_draw(draw, n)
    dark = dark.filter(ImageFilter.GaussianBlur(0.9 * S))
    light = light.filter(ImageFilter.GaussianBlur(1.2 * S))
    lum -= np.asarray(dark, np.float32) / 255.0 * p["crease_dark"]
    lum += np.asarray(light, np.float32) / 255.0 * p["crease_light"]
    lum += spectral_noise(n, 3.0, rng) * p["stain"]
    lum += spectral_noise(n, 2.0, rng) * p["cloud"]
    tooth = spectral_noise(n, 0.6, rng)
    # paper fibres: slightly smeared horizontally
    tooth = (tooth + np.roll(tooth, 1, 1) + np.roll(tooth, 2, 1)) / 1.9
    lum += tooth * p["tooth"]
    base = hex_rgb(p["base"])
    tint = np.array(p["lum_tint"], np.float32)
    img = base[None, None, :] + lum[..., None] * tint[None, None, :]
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
    ov = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    for _ in range(n_for(p["flecks"], n)):  # sparse dark flecks (reference: a handful per frame)
        x, y = rng.uniform(0, n, 2)
        r = rng.uniform(0.6, 1.8) * S
        a = int(rng.uniform(0.25, 0.6) * 255)
        od.ellipse([x - r, y - r, x + r, y + r], fill=(70, 62, 52, a))
    return Image.alpha_composite(im, ov).convert("RGB").filter(ImageFilter.GaussianBlur(0.5 * S))


def grain_tile(n, rng, sigma_px, std=40.0):
    """Mid-grey 128 tile with gaussian-blurred white noise (sigma_px in tile px), std in 8-bit levels."""
    g = rng.standard_normal((n, n), dtype=np.float32)
    if sigma_px > 0:
        fy = np.fft.fftfreq(n).astype(np.float32)[:, None]
        fx = np.fft.rfftfreq(n).astype(np.float32)[None, :]
        g = np.fft.irfft2(np.fft.rfft2(g) * np.exp(-2 * (np.pi * sigma_px) ** 2 * (fx ** 2 + fy ** 2)), s=(n, n))
    g = (g - g.mean()) / (g.std() + 1e-9)
    return Image.fromarray(np.clip(np.rint(128 + g * std), 0, 255).astype(np.uint8), "L")


def dust_overlay(w, h, rng, density, k=1.0):
    """Transparent RGBA: mostly dark specks and hairs, a few light ones (film dust & scratches)."""
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for _ in range(int(rng.poisson(density))):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        light = rng.random() < 0.35
        col = (245, 240, 230) if light else (20, 18, 16)
        a = int(rng.uniform(60, 190))
        kind = rng.random()
        if kind < 0.65:  # speck
            r = rng.uniform(0.8, 3.2) * k
            d.ellipse([x - r, y - r, x + r, y + r * rng.uniform(0.6, 1.4)], fill=col + (a,))
        elif kind < 0.9:  # hair
            pts = [(x, y)]
            ang = rng.uniform(0, 2 * np.pi)
            for _ in range(rng.integers(4, 9)):
                ang += rng.normal(0, 0.5)
                step = rng.uniform(4, 14) * k
                pts.append((pts[-1][0] + np.cos(ang) * step, pts[-1][1] + np.sin(ang) * step))
            d.line(pts, fill=col + (int(a * 0.8),), width=max(1, round(k)))
        else:  # vertical scratch
            ln = rng.uniform(60, h * 0.8)
            d.line([(x, y), (x + rng.normal(0, 3), y + ln)], fill=col + (int(a * 0.5),), width=max(1, round(k)))
    return im.filter(ImageFilter.GaussianBlur(0.5 * k))


def bright_dust_loop(frames, rng, k=2.0, w=1920, h=1080):
    """Dark-collage dust (analysis/dracula.md 6/7.1): bright-only specks (0.03-0.45 % of pixels per
    drawing) + 1-4 thin vertical scratches (1-3 px) that drift left ~3.7 px/frame = 7.4 px/drawing.
    Loops every `frames` drawings. Returns a list of RGBA images at (w*k, h*k)."""
    W, H = int(w * k), int(h * k)
    col = (246, 241, 232)
    tracks = []
    for _ in range(4):
        tracks.append(dict(x=rng.uniform(0, w), y=rng.uniform(0, h * 0.4), ln=rng.uniform(h * 0.25, h * 0.9),
                           wd=rng.choice([1, 1, 2, 3]), a=rng.uniform(0.35, 0.8), start=int(rng.integers(0, frames)),
                           life=int(rng.integers(3, 9)), wob=rng.normal(0, 4)))
    out = []
    for i in range(frames):
        im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        target = rng.uniform(0.0003, 0.0045) * w * h  # bright px per drawing at 1080p
        px = 0.0
        while px < target:
            x, y = rng.uniform(0, w), rng.uniform(0, h)
            kind = rng.random()
            a = int(rng.uniform(0.45, 0.95) * 255)
            if kind < 0.8:
                r = rng.choice([0.5, 0.8, 1.2, 1.8, 3.0], p=[0.3, 0.3, 0.2, 0.15, 0.05])
                d.ellipse([(x - r) * k, (y - r) * k, (x + r) * k, (y + r * rng.uniform(0.7, 1.3)) * k], fill=col + (a,))
                px += np.pi * r * r
            else:  # short bright hair
                pts = [(x, y)]
                ang = rng.uniform(0, 2 * np.pi)
                for _ in range(int(rng.integers(3, 7))):
                    ang += rng.normal(0, 0.6)
                    st = rng.uniform(3, 10)
                    pts.append((pts[-1][0] + np.cos(ang) * st, pts[-1][1] + np.sin(ang) * st))
                d.line([(a_ * k, b_ * k) for a_, b_ in pts], fill=col + (int(a * 0.8),), width=max(1, round(k)))
                px += 30
        for t in tracks:
            age = (i - t["start"]) % frames
            if age >= t["life"]:
                continue
            x = (t["x"] - 7.4 * age) % w
            ys = t["y"]
            d.line([(x * k, ys * k), ((x + t["wob"]) * k, (ys + t["ln"]) * k)], fill=col + (int(t["a"] * 255),),
                   width=max(1, round(t["wd"] * k)))
        out.append(im.filter(ImageFilter.GaussianBlur(0.4 * k)))
    return out


# colours/amounts are tuned against analysis/stills/{C,D,E,F} crops (see CONTENT NOTES in the handoff)
PRESETS = {
    # tooth tuned down after the paper-desk proof: reference grain_std 0.35–0.96 vs ours 1.2–1.6
    "paper_warm": dict(base="#e4ddd2", mottle=3.2, cloud=2.4, tooth=1.4, hue_drift=1.6, lum_tint=[1.0, 0.98, 0.94],
                       fibres=6, fibre_strength=7, soften=0.35,
                       specks=[("#a2685e", 1.2, (0.25, 0.6)), ("#6f5f55", 1.5, (0.2, 0.55)),
                               ("#c7a79a", 2.0, (0.2, 0.5)), ("#fbf7f0", 2.0, (0.3, 0.7))]),
    # desk: cream #EFE3DA, ~12 flecks / 100x100 design px, 1-3 px, warm grey + pink/red, dL -8..-20
    "paper_desk": dict(base="#efe3da", mottle=2.4, cloud=1.8, tooth=3.5, hue_drift=1.2, lum_tint=[1.0, 0.97, 0.93],
                       fibres=7, fibre_strength=-4, soften=0.4,
                       specks=[("#7a6a60", 3.5, (0.25, 0.6)), ("#a89a90", 5.0, (0.2, 0.45)),
                               ("#b06a62", 1.6, (0.25, 0.55)), ("#d9a79d", 2.2, (0.25, 0.5)),
                               ("#fffaf4", 2.0, (0.4, 0.8))]),
    "paper_aged": dict(base="#ddd1b4", mottle=6.0, cloud=4.0, tooth=2.4, hue_drift=3.0, lum_tint=[1.0, 0.96, 0.86],
                       fibres=7, fibre_strength=-6, soften=0.35,
                       specks=[("#7a6146", 1.6, (0.3, 0.7)), ("#4b3d30", 0.7, (0.3, 0.7)), ("#efe6cf", 1.4, (0.3, 0.7))]),
    "paper_cool": dict(base="#d9d7d6", mottle=2.6, cloud=2.0, tooth=2.6, hue_drift=0.0,
                       fibres=5, fibre_strength=6, soften=0.35,
                       specks=[("#8d8a88", 0.9, (0.25, 0.6)), ("#f4f3f2", 1.2, (0.3, 0.7))]),
    "paper_black": dict(base="#171616", mottle=3.0, cloud=2.5, tooth=4.0, hue_drift=0.0,
                        fibres=3, fibre_strength=8, soften=0.4,
                        specks=[("#5a5654", 1.2, (0.3, 0.7)), ("#2b2928", 1.6, (0.3, 0.7))],
                        haze=6.0, scratches=90, scuffs=1100, scratch_strength=0.55),
    # base is the pre-vignette sheet: highlight@0.5/1.2 centre-bottom reads #BCB5A9 after the 0.94 vignette; the
    # reference crumple reads σ≈5 levels (facets/creases ×2 vs the first pass), only a handful of flecks
    "paper_crumpled": dict(base="#c9c0b5", lum_tint=[1.0, 0.97, 0.88], facet_big=1.2, facet_small=1.5, facet_tiny=1.1,
                           crease_vor=5.0, cracks=90, crease_dark=34, crease_light=14, stain=0.6, cloud=0.4, tooth=2.4,
                           flecks=0.08, crumple=True),
    # cold-press watercolour paper (scrapbook look, vox_braintravel §4.4): neutral near-white so Paper's `color` tints it
    # per section; strong soft tooth, gentle pigment-pooling mottle, few fibres. Keep LAST: presets are seeded by position.
    "paper_watercolour": dict(base="#ecebea", mottle=3.4, cloud=2.8, tooth=4.6, hue_drift=0.0,
                              fibres=3, fibre_strength=4, soften=0.6,
                              specks=[("#9a9896", 0.4, (0.15, 0.4)), ("#fbfbfa", 1.0, (0.3, 0.6))]),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", type=int, default=3072)
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    only = set(filter(None, a.only.split(",")))
    os.makedirs(OUT, exist_ok=True)
    for i, (name, p) in enumerate(PRESETS.items()):
        if only and name not in only:
            continue
        rng = np.random.default_rng(1000 + i)
        if "crumple" in p:
            im = crumpled(a.size, rng, p)
        elif "scratches" in p:
            im = black_paper(a.size, rng, p)
        else:
            im = paper(a.size, rng, p)
        im.save(os.path.join(OUT, f"{name}.jpg"), quality=92, subsampling=0)
        print(name, flush=True)
    if not only or "grain" in only:
        # baked particle sigma 0.5 tile px; Grain.tsx rescales tiles to the requested sizePx
        for k in range(8):
            grain_tile(1024, np.random.default_rng(50 + k), 0.5).save(os.path.join(OUT, f"grain_{k}.png"))
        print("grain x8")
    if not only or "dust" in only:
        for k in range(8):
            dust_overlay(1920, 1080, np.random.default_rng(80 + k), 14).save(os.path.join(OUT, f"dust_{k}.png"))
        print("dust x8")
    if not only or "dustbright" in only:
        for k, im in enumerate(bright_dust_loop(12, np.random.default_rng(300))):
            im.save(os.path.join(OUT, f"dustbright_{k}.png"), optimize=True)
        print("dustbright x12")


if __name__ == "__main__":
    main()
