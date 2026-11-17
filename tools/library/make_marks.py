#!/usr/bin/env python3
"""Procedural hand-drawn marks and paper pieces (CC0): arrows, rings, X marks, checks, underlines, brackets,
scribbles, highlighter swipes, bursts, torn paper strips, tape pieces and paper scraps.

  tools/py tools/library/make_marks.py                 # write every mark into public/assets/library/marks/
  tools/py tools/library/make_marks.py --only arrow    # names containing "arrow"
  tools/py tools/library/make_marks.py --catalog       # also (re)write their catalog entries

Every mark is drawn from a fixed seed, at 2x design size (so it stays sharp in 4K), as an RGBA PNG trimmed to its
alpha. Strokes are hand-like: the path wobbles, the pen pressure tapers the ends, marker and dry-brush strokes get
gaps along the stroke. Colours are the kit's look tokens (src/tokens/colors.ts).
Highlighter swipes are pigment colours: put them UNDER the type with mix-blend-mode: multiply.
"""
from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lib as L  # noqa: E402

OUT = L.LIB / "marks"
SS = 4  # supersampling
COLORS = {  # name -> (hex, words for search)
    "periwinkle": ("#6B74DE", "periwinkle blue earworm accent"),
    "white": ("#F4F4F4", "white on dark"),
    "ink": ("#1E1C1E", "black ink"),
    "red": ("#C03D40", "red"),
    "orange": ("#E6875A", "orange vox light ring"),
    "yellow": ("#F8F005", "yellow marker"),
    "lemon": ("#FBFF0B", "lemon highlighter"),
    "mustard": ("#BB923A", "mustard dry brush editorial"),
    "green": ("#4AB541", "green"),
}


def rgb(h: str) -> tuple[int, int, int]:
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


# ------------------------------------------------------------------------------------------------------------------
# drawing primitives
# ------------------------------------------------------------------------------------------------------------------

class Canvas:
    """union of strokes on a supersampled alpha canvas; sizes in output px"""

    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.img = Image.new("L", (w * SS, h * SS), 0)
        self.d = ImageDraw.Draw(self.img)

    def dab(self, x: float, y: float, r: float) -> None:
        X, Y, R = x * SS, y * SS, max(0.6, r * SS)
        self.d.ellipse((X - R, Y - R, X + R, Y + R), fill=255)

    def stroke(self, pts: np.ndarray, width: float, rng, taper: float = 0.18, pressure: float = 0.12, step: float = 0.3) -> None:
        pts = resample(pts, step)
        n = len(pts)
        t = np.linspace(0, 1, n)
        prof = np.minimum(1, np.minimum(t / taper, (1 - t) / taper)) ** 0.6 if taper > 0 else np.ones(n)
        w = width * (0.35 + 0.65 * prof) * (1 + pressure * smooth_noise(n, rng, 3))
        for (x, y), wi in zip(pts, w):
            self.dab(x, y, wi / 2)

    def polygon(self, pts: np.ndarray) -> None:
        self.d.polygon([(float(x) * SS, float(y) * SS) for x, y in pts], fill=255)

    def alpha(self) -> np.ndarray:
        return np.asarray(self.img.resize((self.w, self.h), Image.LANCZOS), np.float64) / 255.0


def resample(pts: np.ndarray, step: float) -> np.ndarray:
    seg = np.hypot(*np.diff(pts, axis=0).T)
    s = np.concatenate([[0], np.cumsum(seg)])
    if s[-1] <= 0:
        return pts[:1]
    q = np.arange(0, s[-1], step)
    return np.stack([np.interp(q, s, pts[:, 0]), np.interp(q, s, pts[:, 1])], 1)


def smooth_noise(n: int, rng, k: int = 4) -> np.ndarray:
    t = np.linspace(0, 1, n)
    out = np.zeros(n)
    for i in range(1, k + 1):
        out += rng.uniform(-1, 1) / i * np.sin(2 * np.pi * (i * rng.uniform(0.6, 1.4)) * t + rng.uniform(0, 6.28))
    return out / max(1e-9, np.abs(out).max())


def wobble(pts: np.ndarray, amp: float, rng, k: int = 4) -> np.ndarray:
    d = np.gradient(pts, axis=0)
    nrm = np.stack([-d[:, 1], d[:, 0]], 1)
    nrm /= np.maximum(1e-9, np.hypot(*nrm.T))[:, None]
    return pts + nrm * (amp * smooth_noise(len(pts), rng, k))[:, None]


def line(p0, p1, n: int = 200) -> np.ndarray:
    t = np.linspace(0, 1, n)[:, None]
    return np.array(p0) * (1 - t) + np.array(p1) * t


def bezier(p0, c, p1, n: int = 300) -> np.ndarray:
    t = np.linspace(0, 1, n)[:, None]
    p0, c, p1 = map(np.array, (p0, c, p1))
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * c + t ** 2 * p1


def arrowhead(cv: Canvas, tip, direction, size: float, width: float, rng) -> None:
    ang = math.atan2(direction[1], direction[0])
    for side in (-1, 1):
        a = ang + math.pi + side * math.radians(rng.uniform(24, 34))
        end = (tip[0] + size * math.cos(a), tip[1] + size * math.sin(a))
        mid = ((tip[0] + end[0]) / 2 + rng.uniform(-2, 2), (tip[1] + end[1]) / 2 + rng.uniform(-2, 2))
        cv.stroke(bezier(end, mid, tip, 80), width * rng.uniform(0.85, 1.0), rng, taper=0.3)


def dry(alpha: np.ndarray, rng, amount: float = 0.35, along: str = "x") -> np.ndarray:
    """marker / dry-brush gaps: streaky noise along the stroke direction"""
    h, w = alpha.shape
    nz = rng.random((h, w))
    img = Image.fromarray((nz * 255).astype(np.uint8))
    k = (int(max(3, w / 12)), 2) if along == "x" else (2, int(max(3, h / 12)))
    img = img.filter(ImageFilter.BoxBlur(1)).resize((max(1, w // k[0]), max(1, h // k[1])), Image.BILINEAR).resize((w, h), Image.BICUBIC)
    s = np.asarray(img, np.float64) / 255
    s = (s - s.min()) / max(1e-9, s.max() - s.min())
    return alpha * np.clip(1 - amount + amount * 1.6 * s, 0, 1)


def to_rgba(alpha: np.ndarray, color: str, rng=None, grain: float = 0.0) -> Image.Image:
    h, w = alpha.shape
    c = np.array(rgb(color), np.float64)
    rgbimg = np.broadcast_to(c, (h, w, 3)).copy()
    if grain and rng is not None:
        rgbimg += (rng.standard_normal((h, w, 1)) * grain)
    out = np.dstack([np.clip(rgbimg, 0, 255), np.clip(alpha * 255, 0, 255)]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def torn_outline(rng, w: float, h: float, rough: float, n_side: int = 60, x0: float = 0, y0: float = 0,
                 ends: str = "torn") -> np.ndarray:
    """rectangle whose edges are torn (fractal jitter). ends='zigzag' gives tape-like teeth on the short sides"""
    def edge(p, q, n, amp):
        pts = line(p, q, n)
        d = np.array(q) - np.array(p)
        nrm = np.array([-d[1], d[0]]) / max(1e-9, np.hypot(*d))
        jit = smooth_noise(n, rng, 6) * amp * 0.6 + rng.uniform(-1, 1, n) * amp * 0.35
        return pts + nrm[None, :] * jit[:, None]

    def zig(p, q, n_teeth, depth):
        out = []
        for i in range(n_teeth * 2 + 1):
            t = i / (n_teeth * 2)
            x = p[0] + (q[0] - p[0]) * t
            y = p[1] + (q[1] - p[1]) * t
            d = depth * (rng.uniform(0.5, 1.0) if i % 2 else 0) * (1 if p[0] > w / 2 else -1)
            out.append((x + d, y))
        return np.array(out)

    tl, tr, br, bl = (x0, y0), (x0 + w, y0), (x0 + w, y0 + h), (x0, y0 + h)
    top = edge(tl, tr, n_side, rough)
    bot = edge(br, bl, n_side, rough)
    if ends == "zigzag":
        right = zig(tr, br, max(3, int(h / 18)), rough * 1.6)
        left = zig(bl, tl, max(3, int(h / 18)), rough * 1.6)
    else:
        right = edge(tr, br, max(8, int(n_side * h / w)), rough * 1.4)
        left = edge(bl, tl, max(8, int(n_side * h / w)), rough * 1.4)
    return np.concatenate([top, right, bot, left])


def paper_piece(rng, w: int, h: int, color: str, fringe: str | None, rough: float, ends: str = "torn",
                fiber: float = 5.0, alpha_level: float = 1.0) -> Image.Image:
    pad = int(rough * 3) + 4
    cv = Canvas(w + 2 * pad, h + 2 * pad)
    cv.polygon(torn_outline(rng, w, h, rough, max(40, w // 10), pad, pad, ends))
    a = cv.alpha()
    base = np.array(rgb(color), np.float64)
    H, W = a.shape
    nz = Image.fromarray((rng.random((H, W)) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    fib = (np.asarray(nz, np.float64) / 255 - 0.5) * 2 * fiber
    img = np.clip(base[None, None, :] + fib[:, :, None], 0, 255)
    if fringe:
        inner = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)), np.float64) / 255
        band = np.clip(a - inner, 0, 1)[:, :, None]
        img = img * (1 - band) + np.array(rgb(fringe), np.float64)[None, None, :] * band
    return Image.fromarray(np.dstack([img, a * 255 * alpha_level]).astype(np.uint8), "RGBA")


def trim(im: Image.Image, margin: int = 3) -> Image.Image:
    box = im.getchannel("A").point(lambda v: 255 if v > 3 else 0).getbbox()
    if not box:
        return im
    return im.crop((max(0, box[0] - margin), max(0, box[1] - margin), min(im.width, box[2] + margin), min(im.height, box[3] + margin)))


# ------------------------------------------------------------------------------------------------------------------
# the marks (2x design size)
# ------------------------------------------------------------------------------------------------------------------

def m_arrow(kind: str, color: str, seed: int, dry_amt: float = 0.0):
    rng = np.random.default_rng(seed)
    W, H = (760, 260) if kind != "hook" else (520, 420)
    cv = Canvas(W, H)
    wd = 13
    if kind == "straight":
        p0, p1 = (40, 170), (700, 95)
        path = wobble(line(p0, p1, 300), 4, rng)
        d = (p1[0] - p0[0], p1[1] - p0[1])
    elif kind == "curved":
        p0, c, p1 = (40, 210), (360, -40), (700, 170)
        path = wobble(bezier(p0, c, p1), 3, rng)
        d = (p1[0] - c[0], p1[1] - c[1])
    else:  # hook: down then curling right
        p0, c, p1 = (90, 40), (40, 400), (460, 300)
        path = wobble(bezier(p0, c, p1), 3, rng)
        d = (p1[0] - c[0], p1[1] - c[1])
    cv.stroke(path, wd, rng, taper=0.08)
    arrowhead(cv, tuple(path[-1]), d, 70, wd, rng)
    a = cv.alpha()
    if dry_amt:
        a = dry(a, rng, dry_amt)
    return trim(to_rgba(a, color))


def m_ring(color: str, seed: int, w: int = 620, h: int = 300, wd: float = 9, dry_amt: float = 0.0):
    rng = np.random.default_rng(seed)
    cv = Canvas(w + 60, h + 60)
    t0 = rng.uniform(0, 6.28)
    t = np.linspace(t0, t0 + 2 * np.pi + rng.uniform(0.45, 0.8), 900)
    grow = 1 + 0.06 * (t - t0) / (2 * np.pi)
    pts = np.stack([(w + 60) / 2 + (w / 2) * grow * np.cos(t), (h + 60) / 2 + (h / 2) * grow * np.sin(t) * 0.97], 1)
    cv.stroke(wobble(pts, 5, rng), wd, rng, taper=0.1)
    a = cv.alpha()
    if dry_amt:
        a = dry(a, rng, dry_amt)
    return trim(to_rgba(a, color))


def m_x(color: str, seed: int, size: int = 260, wd: float = 15):
    rng = np.random.default_rng(seed)
    cv = Canvas(size + 40, size + 40)
    s = size
    cv.stroke(wobble(bezier((30, 30), (s / 2 + 30 + rng.uniform(-20, 20), s / 2 + 10), (s + 10, s + 10), 200), 3, rng), wd, rng, taper=0.15)
    cv.stroke(wobble(bezier((s + 5, 25), (s / 2 + 15, s / 2 + 30 + rng.uniform(-20, 20)), (25, s + 15), 200), 3, rng), wd, rng, taper=0.15)
    return trim(to_rgba(cv.alpha(), color))


def m_check(color: str, seed: int, wd: float = 16):
    rng = np.random.default_rng(seed)
    cv = Canvas(340, 300)
    pts = np.concatenate([bezier((30, 150), (70, 190), (110, 260), 80), bezier((110, 260), (170, 120), (320, 30), 200)])
    cv.stroke(wobble(pts, 3, rng), wd, rng, taper=0.12)
    return trim(to_rgba(cv.alpha(), color))


def m_underline(style: str, color: str, seed: int):
    rng = np.random.default_rng(seed)
    W = 900
    cv = Canvas(W, 140)
    if style == "marker":
        path = wobble(bezier((20, 80), (W / 2, 62), (W - 20, 66)), 3, rng)
        cv.stroke(path, 30, rng, taper=0.04, pressure=0.18)
        return trim(to_rgba(dry(cv.alpha(), rng, 0.45), color))
    if style == "pencil":
        path = wobble(bezier((20, 70), (W / 2, 76), (W - 30, 64)), 2, rng)
        cv.stroke(path, 5, rng, taper=0.06, pressure=0.25)
        return trim(to_rgba(dry(cv.alpha(), rng, 0.3), color))
    if style == "double":
        cv.stroke(wobble(bezier((20, 50), (W / 2, 44), (W - 20, 48)), 2, rng), 8, rng, taper=0.05)
        cv.stroke(wobble(bezier((60, 86), (W / 2, 84), (W - 60, 80)), 2, rng), 8, rng, taper=0.05)
        return trim(to_rgba(cv.alpha(), color))
    x = np.linspace(20, W - 20, 900)  # squiggle
    y = 70 + 22 * np.sin((x - 20) / 38) * (0.7 + 0.3 * smooth_noise(len(x), rng, 2))
    cv.stroke(np.stack([x, y], 1), 8, rng, taper=0.05)
    return trim(to_rgba(cv.alpha(), color))


def m_bracket(color: str, seed: int, wd: float = 9):
    rng = np.random.default_rng(seed)
    H = 700
    cv = Canvas(160, H + 40)
    x, r = 100, 40
    pts = np.concatenate([
        bezier((x + 30, 20), (x - 10, 25), (x - 5, 20 + r * 2)), line((x - 5, 20 + r * 2), (x - 5, H / 2 - r), 100),
        bezier((x - 5, H / 2 - r), (x - 10, H / 2 + 10), (x - 60, H / 2 + 20)),
        bezier((x - 60, H / 2 + 20), (x - 10, H / 2 + 30), (x - 5, H / 2 + r + 40)), line((x - 5, H / 2 + r + 40), (x - 5, H - r * 2), 100),
        bezier((x - 5, H - r * 2), (x - 10, H + 15), (x + 30, H + 20))])
    cv.stroke(wobble(pts, 2, rng), wd, rng, taper=0.05)
    return trim(to_rgba(cv.alpha(), color))


def m_scribble(style: str, color: str, seed: int):
    rng = np.random.default_rng(seed)
    if style == "loops":
        cv = Canvas(700, 260)
        t = np.linspace(0, 1, 2400)
        x = 50 + 600 * t + 55 * np.cos(2 * np.pi * 7 * t + 1.2)
        y = 130 + 80 * np.sin(2 * np.pi * 7 * t + 1.2) * (0.8 + 0.2 * smooth_noise(len(t), rng, 3))
        cv.stroke(wobble(np.stack([x, y], 1), 4, rng), 7, rng, taper=0.05)
        return trim(to_rgba(cv.alpha(), color))
    cv = Canvas(560, 300)  # cross-out hatching
    pts = []
    for i in range(9):
        y0, y1 = 40 + rng.uniform(-8, 8), 260 + rng.uniform(-8, 8)
        x0 = 40 + i * 58
        pts += [(x0, y1), (x0 + 50, y0)]
    path = np.concatenate([bezier(pts[i], ((pts[i][0] + pts[i + 1][0]) / 2 + rng.uniform(-10, 10), (pts[i][1] + pts[i + 1][1]) / 2), pts[i + 1], 60)
                           for i in range(len(pts) - 1)])
    cv.stroke(wobble(path, 2, rng), 10, rng, taper=0.03)
    return trim(to_rgba(dry(cv.alpha(), rng, 0.25), color))


def m_highlight(color: str, seed: int, length: int = 900, height: int = 74):
    rng = np.random.default_rng(seed)
    cv = Canvas(length + 60, height + 60)
    sl = rng.uniform(10, 18)
    poly = np.array([(30 + sl, 30), (30 + length, 30 + rng.uniform(-3, 3)), (30 + length - sl, 30 + height),
                     (30, 30 + height + rng.uniform(-3, 3))])
    cv.polygon(poly)
    a = cv.alpha()
    a = dry(a, rng, 0.18) * 0.92
    return trim(to_rgba(a, color))


def m_burst(color: str, seed: int, n: int = 8, size: int = 300):
    rng = np.random.default_rng(seed)
    cv = Canvas(size + 40, size + 40)
    c = (size / 2 + 20, size / 2 + 20)
    for i in range(n):
        a = 2 * np.pi * i / n + rng.uniform(-0.15, 0.15)
        r0, r1 = size * rng.uniform(0.12, 0.2), size * rng.uniform(0.38, 0.5)
        cv.stroke(wobble(line((c[0] + r0 * math.cos(a), c[1] + r0 * math.sin(a)), (c[0] + r1 * math.cos(a), c[1] + r1 * math.sin(a)), 80), 1.5, rng),
                  10, rng, taper=0.3)
    return trim(to_rgba(cv.alpha(), color))


def m_strip(color: str, fringe: str | None, seed: int, w: int = 900, h: int = 92):
    return trim(paper_piece(np.random.default_rng(seed), w, h, color, fringe, rough=5))


def m_tape(kind: str, seed: int):
    rng = np.random.default_rng(seed)
    if kind == "masking":
        im = paper_piece(rng, 560, 112, "#E6D9B8", None, rough=1.6, ends="zigzag", fiber=4, alpha_level=0.93)
        a = np.asarray(im, np.float64)
        y = np.arange(a.shape[0])[:, None]
        crepe = 3 * np.sin(y / 2.2 + smooth_noise(a.shape[1], rng, 5)[None, :] * 2)
        a[:, :, :3] = np.clip(a[:, :, :3] + crepe[:, :, None], 0, 255)
        return trim(Image.fromarray(a.astype(np.uint8), "RGBA"))
    if kind == "black":
        im = paper_piece(rng, 560, 100, "#0E0D0E", None, rough=1.4, ends="zigzag", fiber=3)
        a = np.asarray(im, np.float64)
        x = np.linspace(0, 1, a.shape[1])[None, :]
        a[:, :, :3] = np.clip(a[:, :, :3] + (10 * np.exp(-((x - 0.35) / 0.12) ** 2))[:, :, None], 0, 255)
        return trim(Image.fromarray(a.astype(np.uint8), "RGBA"))
    im = paper_piece(rng, 560, 110, "#FFFFFF", None, rough=1.2, ends="zigzag", fiber=2, alpha_level=1.0)  # clear tape
    a = np.asarray(im, np.float64)
    A = a[:, :, 3] / 255
    H, W = A.shape
    yy, xx = np.mgrid[0:H, 0:W]
    glare = 0.16 * np.exp(-(((xx - yy * 0.6) - W * 0.4) / (W * 0.08)) ** 2)
    edge = np.clip(A - np.asarray(Image.fromarray((A * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)), np.float64) / 255, 0, 1)
    a[:, :, 3] = np.clip(A * (0.2 + glare) + edge * 0.35, 0, 1) * 255
    return trim(Image.fromarray(a.astype(np.uint8), "RGBA"))


def m_scrap(color: str, fringe: str | None, seed: int):
    rng = np.random.default_rng(seed)
    w, h = int(rng.uniform(420, 560)), int(rng.uniform(300, 420))
    return trim(paper_piece(rng, w, h, color, fringe, rough=9).rotate(rng.uniform(-6, 6), Image.BICUBIC, expand=True))


MARKS = []  # (theme, name, title, tags, fn)


def reg(theme, name, title, tags, fn):
    MARKS.append((theme, name, title, tags, fn))


for i, (kind, col) in enumerate([("straight", "periwinkle"), ("straight", "white"), ("straight", "ink"), ("curved", "periwinkle"),
                                 ("curved", "white"), ("curved", "ink"), ("curved", "red"), ("hook", "periwinkle"), ("hook", "white"),
                                 ("hook", "ink")]):
    reg("arrows", f"arrow-{kind}-{col}", f"Hand-drawn {kind} arrow, {col}", ["arrow", kind, "pointer", "annotation"] + COLORS[col][1].split(),
        lambda kind=kind, col=col, i=i: m_arrow(kind, COLORS[col][0], 100 + i))
reg("arrows", "arrow-curved-yellow-drybrush", "Dry-brush curved arrow, yellow", ["arrow", "curved", "dry brush", "marker", "yellow"],
    lambda: m_arrow("curved", COLORS["yellow"][0], 120, dry_amt=0.4))
for i, col in enumerate(["white", "orange", "periwinkle", "red", "ink"]):
    reg("rings", f"ring-{col}", f"Hand-drawn ring (overlapping ends), {col}", ["ring", "circle", "ellipse", "highlight", "annotation"] + COLORS[col][1].split(),
        lambda col=col, i=i: m_ring(COLORS[col][0], 200 + i))
reg("rings", "ring-wide-white", "Wide hand-drawn ring around a word, white", ["ring", "circle", "wide", "word", "annotation", "white"],
    lambda: m_ring(COLORS["white"][0], 210, 900, 230, 8))
reg("rings", "ring-yellow-drybrush", "Dry-brush ring, yellow marker", ["ring", "circle", "dry brush", "marker", "yellow"],
    lambda: m_ring(COLORS["yellow"][0], 211, 600, 290, 16, dry_amt=0.45))
for i, col in enumerate(["periwinkle", "white", "red", "ink"]):
    reg("x-marks", f"x-{col}", f"Hand-drawn X mark, {col}", ["x", "cross", "mark", "wrong", "map marker", "bullet"] + COLORS[col][1].split(),
        lambda col=col, i=i: m_x(COLORS[col][0], 300 + i))
for i, col in enumerate(["ink", "green", "white"]):
    reg("checks", f"check-{col}", f"Hand-drawn check mark, {col}", ["check", "tick", "correct", "yes", "mark"] + COLORS[col][1].split(),
        lambda col=col, i=i: m_check(COLORS[col][0], 400 + i))
for i, (style, col) in enumerate([("marker", "yellow"), ("marker", "periwinkle"), ("marker", "red"), ("pencil", "ink"), ("pencil", "white"),
                                  ("double", "ink"), ("double", "white"), ("squiggle", "periwinkle"), ("squiggle", "red")]):
    reg("underlines", f"underline-{style}-{col}", f"Hand-drawn {style} underline, {col}", ["underline", style, "emphasis", "annotation"] + COLORS[col][1].split(),
        lambda style=style, col=col, i=i: m_underline(style, COLORS[col][0], 500 + i))
for i, col in enumerate(["white", "ink"]):
    reg("brackets", f"brace-{col}", f"Hand-drawn curly brace, {col}", ["brace", "bracket", "group", "annotation"] + COLORS[col][1].split(),
        lambda col=col, i=i: m_bracket(COLORS[col][0], 600 + i))
for i, (style, col) in enumerate([("loops", "periwinkle"), ("loops", "ink"), ("crossout", "red"), ("crossout", "ink")]):
    reg("scribbles", f"scribble-{style}-{col}", f"Hand-drawn {'loop scribble' if style == 'loops' else 'cross-out hatching'}, {col}",
        ["scribble", style, "doodle", "annotation"] + COLORS[col][1].split(), lambda style=style, col=col, i=i: m_scribble(style, COLORS[col][0], 700 + i))
for i, col in enumerate(["lemon", "yellow", "mustard", "orange"]):
    reg("highlighter", f"highlight-{col}", f"Highlighter swipe, {col} (multiply it under the type)", ["highlighter", "highlight", "swipe", "marker", "multiply"] + COLORS[col][1].split(),
        lambda col=col, i=i: m_highlight(COLORS[col][0], 800 + i))
reg("highlighter", "highlight-lemon-short", "Short highlighter swipe, lemon (multiply)", ["highlighter", "highlight", "short", "word", "multiply", "lemon"],
    lambda: m_highlight(COLORS["lemon"][0], 810, 420, 70))
for i, col in enumerate(["white", "yellow", "periwinkle"]):
    reg("bursts", f"burst-{col}", f"Hand-drawn burst / sparkle lines, {col}", ["burst", "sparkle", "spark", "emphasis", "flash"] + COLORS[col][1].split(),
        lambda col=col, i=i: m_burst(COLORS[col][0], 900 + i))
for i, (col, fr, title) in enumerate([("#F1EEE7", "#FFFFFF", "white"), ("#E9E4D8", "#FFFFFF", "cream"), ("#151515", "#3A3A3A", "black"),
                                      ("#D9D3C4", "#F4F0E6", "newsprint")]):
    reg("strips", f"strip-{title}", f"Torn paper strip, {title} (for labels and tags)", ["torn paper", "strip", "label", "tag", "collage", title],
        lambda col=col, fr=fr, i=i: m_strip(col, fr, 1000 + i))
reg("strips", "strip-white-short", "Short torn paper strip, white", ["torn paper", "strip", "label", "short", "white"],
    lambda: m_strip("#F1EEE7", "#FFFFFF", 1010, 420, 76))
for i, kind in enumerate(["masking", "black", "clear"]):
    reg("tape", f"tape-{kind}", f"Piece of {kind} tape with torn ends", ["tape", kind, "sticky", "collage", "scrapbook"], lambda kind=kind, i=i: m_tape(kind, 1100 + i))
reg("tape", "tape-masking-2", "Piece of masking tape with torn ends (variant)", ["tape", "masking", "sticky", "collage", "scrapbook"], lambda: m_tape("masking", 1110))
for i, (col, fr, title) in enumerate([("#E9E2D2", "#FFFFFF", "cream"), ("#F4F2EE", "#FFFFFF", "white"), ("#141414", "#2E2E2E", "black"),
                                      ("#D2C29A", "#EDE3C8", "kraft")]):
    reg("scraps", f"scrap-{title}", f"Torn paper scrap, {title}", ["paper", "scrap", "torn", "collage", "background piece", title],
        lambda col=col, fr=fr, i=i: m_scrap(col, fr, 1200 + i))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", default="")
    ap.add_argument("--catalog", action="store_true", help="write the catalog entries of these marks")
    a = ap.parse_args()
    todo = [m for m in MARKS if a.only in m[1]]
    entries = []
    for theme, name, title, tags, fn in todo:
        dst = OUT / theme / f"{name}.png"
        dst.parent.mkdir(parents=True, exist_ok=True)
        im = fn()
        im.save(dst, "PNG", optimize=True)
        print(f"  {dst.relative_to(L.PUBLIC)}  {im.width}x{im.height}")
        entries.append({"id": f"mark-{name}", "kind": "marks", "path": str(dst.relative_to(L.PUBLIC)), "title": title,
                        "tags": sorted(set(tags)), "license": "cc0", "license_name": "CC0 1.0", "license_url": L.LICENSE_URLS["cc0"],
                        "source": {"site": "this repository (procedural, seeded)"},
                        "build": {"from": "generate", "cmd": "tools/library/make_marks.py"},
                        "file": L.file_facts(dst)})
    if a.catalog:
        new = {e["id"]: e for e in entries}
        with L.catalog_txn() as cat:
            cat["assets"] = [x for x in cat["assets"] if x["id"] not in new] + list(new.values())
        print(f"catalog: {len(new)} mark entries written")
    print(f"{len(todo)} marks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
