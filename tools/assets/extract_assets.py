#!/usr/bin/env python3
"""Cut a reusable asset library out of a reference video or a still image (a user's own reference, a style frame).

Driven by a manifest (one asset per entry); `tools/reference/manifest.template.json` is a commented example:

    {"source": {"video": "video-projects/<slug>/reference/<id>/source.mp4",   # or "image": ".../frame.png"
                "title": "...", "publisher": "...", "rights": "own|third-party|unknown", "fps": 25, "width": 1920, "height": 1080},
     "out": "video-projects/<slug>/assets/ref/<id>",          # library folder (git-ignored)
     "scratch": "out/reference/<slug>/<id>/extract",         # frame cache, rembg cache, previews
     "credits": "video-projects/<slug>/CREDITS.md",           # optional: list every file there (the storyboard validator needs it)
     "watermark": [x, y, w, h],                               # optional: a channel logo / bug to patch out of plates and cut-outs
     "assets": [
       {"id": "vinyl-record",           # file stem, unique
        "kind": "props",                # output folder: grounds|props|photos|marks|type|fx|frames
        "t": 17.6,                      # ONE native frame, in seconds (frame = round(t*fps)) ...
        "frames": [404, 451],           # ... or a frame range (global frame numbers)
        "bbox": [x, y, w, h],           # crop in source pixels
        "method": "plate|rembg|lumakey|chroma|raw|sequence",
        "params": {...},                # per-method options, below
        "tags": [...], "use": "VinylRecord", "notes": "...", "third_party": "..."}]}

fps, width and height are read with ffprobe (or from the image) when the manifest leaves them out. A still image has
one frame: use "t": 0 and the single-frame methods (raw, lumakey, chroma, rembg).
All rects/points in params are GLOBAL source pixels, like ``bbox``.

Methods
-------
plate     Per-pixel median of up to 60 frames of ``frames`` (``step``, ``frame_list``) to recover a CLEAN
          ground under moving foreground. ``register`` {"roi": rect} aligns every frame to the middle one by
          integer phase correlation. ``exclude`` drops foreground from the median per frame:
          {"type": "blue"|"bright"|"dark", "thr", "grow"} or {"type": "rects", "rects": [[f0, f1, x, y, w, h]]}.
          ``fill_uncovered`` {"min_valid", "shift": [dx, dy]} fills pixels that never had a clean sample with ground
          copied from ``shift`` away. ``crop_out`` rect stores only part of the plate; ``tile`` rect (+ ``overlap``,
          default 96) writes ``<id>-tile``, cross-faded so it wraps. The watermark is patched with neighbouring
          ground (``bug_fill``, default on). Default format jpg.
rembg     AI matte of a native-frame crop, batched per model, one rembg process at a time. ``model``:
          isnet-general-use | birefnet-portrait | birefnet-general (never bria-rmbg), or "none" (alpha 1,
          then ``circle`` [cx, cy, r]) or "empty" (alpha 0, built only from ``union`` keys). Post, in order:
          ``alpha_levels`` [lo, hi]; ``exclude`` rects; ``luma_union`` thr (+ ``luma_union_near`` px) adds
          bright paper the model dropped; ``union`` / ``subtract`` lists of lumakey/chroma keys (each may have
          a ``rect``); ``keep`` N largest pieces (``min_area``); ``fill_holes`` (``max_hole``, ``hole_luma``:
          only holes brighter than the ground, ``open_sides``, ``outside_seeds``); ``circle``; ``include``;
          ``luma_cut``; ``erode``; ``bg_unmix`` hex. Trimmed to alpha.
lumakey   Alpha from luminance (marks, type, scribbles, paper on black). ``mode``: "linear" alpha =
          levels(Y, lo, hi); "invert" (dark ink on white); "matte" (Y > thr, or < thr with ``dark``;
          ``exclude_blue`` Cb thr; ``open``/``close`` px; ``keep``/``min_area``; ``fill_holes`` with
          ``open_sides`` ["left", ...] for objects that bleed off the frame and ``outside_seeds`` [[x, y]]
          for known ground; ``feather``): solid pieces such as torn photos, label strips, torn paper;
          "iris" (alpha = dark paper around the largest bright region, closed by ``close`` px and filled).
chroma    Alpha from colour: each pixel's chroma (Cb, Cr) projected onto the ``target`` colour's chroma, so
          neutral grounds and B&W photos key out. ``lo``/``hi`` in units of the target's chroma, ``hue_tol``
          degrees, ``luma_min``/``luma_max``, ``matte`` (+ ``close``, ``keep``, ``fill_holes``, ``solid``).
          Shared by lumakey and chroma: ``ellipse_band`` [cx, cy, rx, ry, rot, tol], ``keep``, ``exclude``,
          ``mask_rects``, ``color``: hex, "raw" or "source" (un-mixed against ``bg``, default black).
raw       Crop as is (style reference panels, giant-word cards, full frames). Default png (jpg in frames/).
sequence  A frame sequence of ``frames`` (``step``, or ``dedupe``: keep only new drawings and record their
          holds). ``key`` = {"method": "raw"|"lumakey"|"chroma"|"circle", ...key params}; "circle" takes
          ``fit`` px (per-frame refit), ``arc`` [a0, a1] rad, ``inset``. All frames share one canvas (the
          union alpha bbox) so they play back registered. Writes ``<id>/<id>_NNN.png`` + ``sequence.json``.

Common params: ``src`` {"median": [a, b], "step"} uses the median of a static frame range instead of one
frame (less compression noise); ``pad`` px around the bbox; ``bug`` true keeps the watermark (otherwise it is
patched from ``bug_shift`` [dx, dy] away, default one watermark-width to the left; frames/ always keep it);
``format`` png|jpg; ``quality``; ``margin``; ``no_trim``.

Usage
-----
  tools/py tools/assets/extract_assets.py --manifest M                 # build missing assets, catalog, provenance, sheets
  tools/py tools/assets/extract_assets.py all --manifest M --force     # rebuild everything
  tools/py tools/assets/extract_assets.py build --manifest M --force --only vinyl-record,desk-phone
  tools/py tools/assets/extract_assets.py build --manifest M --kind props
  tools/py tools/assets/extract_assets.py catalog --manifest M         # catalog.json, CATALOG.md, PROVENANCE.md (+ credits)
  tools/py tools/assets/extract_assets.py sheets --manifest M          # catalog + contact_sheet_<kind>.png
  tools/py tools/assets/extract_assets.py preview 455 1250 --manifest M   # grid-annotated native frames, for picking bboxes
  tools/py tools/assets/extract_assets.py clean --manifest M           # delete library files the manifest no longer lists

Needs ffmpeg, numpy and PIL, and tools/.venv/bin/rembg for the rembg method. Everything cut from a reference keeps
the reference's rights: PROVENANCE.md says so, and nothing here is published unless the user owns the reference.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
REMBG = ROOT / "tools" / ".venv" / "bin" / "rembg"
KINDS = ["grounds", "props", "photos", "marks", "type", "fx", "frames"]
ALLOWED_MODELS = {"isnet-general-use", "birefnet-portrait", "birefnet-general", "none", "empty"}

# ----------------------------------------------------------------------------------------------------------
# context
# ----------------------------------------------------------------------------------------------------------


class Ctx:
    def __init__(self, man: dict):
        s = man["source"]
        self.man = man
        here = lambda p: Path(p) if Path(p).is_absolute() else ROOT / p  # noqa: E731
        self.image = here(s["image"]) if s.get("image") else None
        self.video = here(s["video"]) if s.get("video") else None
        if not (self.image or self.video):
            sys.exit("manifest source needs \"video\" or \"image\"")
        self._img = None
        if self.image:
            w, h = Image.open(self.image).size
            self.fps, self.W, self.H = float(s.get("fps") or 25), int(s.get("width") or w), int(s.get("height") or h)
        else:
            pr = probe(self.video) if not all(s.get(k) for k in ("fps", "width", "height")) else {}
            self.fps = float(s.get("fps") or pr["fps"])
            self.W, self.H = int(s.get("width") or pr["width"]), int(s.get("height") or pr["height"])
        self.out = here(man["out"])
        self.scratch = here(man["scratch"])
        self.cache = self.scratch / "cache"
        wm = man.get("watermark", man.get("bug"))
        self.bug = list(wm) if wm else None  # x,y,w,h of a channel logo / bug to patch out (None: nothing to patch)
        self.vf = "scale=in_color_matrix=bt709:in_range=tv:out_range=pc"
        for p in (self.out, self.scratch, self.cache):
            p.mkdir(parents=True, exist_ok=True)


def probe(video: Path) -> dict:
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate",
                          "-of", "json", str(video)], capture_output=True, text=True, check=True).stdout
    st = json.loads(out)["streams"][0]
    num, den = (int(v) for v in st["r_frame_rate"].split("/"))
    return {"fps": num / den, "width": st["width"], "height": st["height"]}


def frame_of(a: dict, fps: float) -> int:
    if "t" in a:
        return int(round(float(a["t"]) * fps))
    if "frame" in a:
        return int(a["frame"])
    return int(a["frames"][0])


def log(*a):
    print(*a, flush=True)


# ----------------------------------------------------------------------------------------------------------
# frame I/O (exact seek: frame f has pts f/fps; seek a quarter frame early so f is the first frame >= t)
# ----------------------------------------------------------------------------------------------------------


def grab(ctx: Ctx, f: int) -> np.ndarray:
    if ctx.image:
        if ctx._img is None:
            ctx._img = np.asarray(Image.open(ctx.image).convert("RGB"))
        return ctx._img
    p = ctx.cache / f"f{f:05d}.png"
    if not p.exists():
        t = max(0.0, (f - 0.25) / ctx.fps)
        cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.4f}", "-i", str(ctx.video), "-frames:v", "1",
               "-vf", ctx.vf + ",format=rgb24", str(p)]
        subprocess.run(cmd, check=True)
    return np.asarray(Image.open(p).convert("RGB"))


def grab_many(ctx: Ctx, frames: list[int], crop=None) -> dict[int, np.ndarray]:
    """Decode a contiguous span once through a raw pipe and keep only the requested frames (cropped)."""
    want = sorted(set(frames))
    if not want:
        return {}
    if ctx.image:
        x, y, w, h = crop if crop else (0, 0, ctx.W, ctx.H)
        return {f: grab(ctx, f)[y:y + h, x:x + w].copy() for f in want}
    f0, f1 = want[0], want[-1]
    x, y, w, h = crop if crop else (0, 0, ctx.W, ctx.H)
    vf = ctx.vf + (f",crop={w}:{h}:{x}:{y}" if crop else "")
    t = max(0.0, (f0 - 0.25) / ctx.fps)
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{t:.4f}", "-i", str(ctx.video), "-frames:v", str(f1 - f0 + 1),
           "-vf", vf, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    size = w * h * 3
    out, ws = {}, set(want)
    for f in range(f0, f1 + 1):
        buf = proc.stdout.read(size)
        if len(buf) < size:
            break
        if f in ws:
            out[f] = np.frombuffer(buf, np.uint8).reshape(h, w, 3).copy()
    proc.stdout.close()
    proc.wait()
    missing = ws - set(out)
    if missing:
        raise RuntimeError(f"could not decode frames {sorted(missing)[:5]}")
    return out


def source_image(ctx: Ctx, a: dict) -> np.ndarray:
    """Full native frame for single-frame methods (optionally the median of a static frame range)."""
    p = a.get("params", {})
    if "src" in p and "median" in p["src"]:
        m0, m1 = p["src"]["median"]
        fr = list(range(m0, m1 + 1, p["src"].get("step", 1)))[:15]
        st = np.stack(list(grab_many(ctx, fr).values()))
        return np.median(st, axis=0).round().astype(np.uint8)
    return grab(ctx, frame_of(a, ctx.fps))


def crop_box(ctx: Ctx, bbox, pad=0):
    x, y, w, h = bbox
    x0, y0 = max(0, x - pad), max(0, y - pad)
    x1, y1 = min(ctx.W, x + w + pad), min(ctx.H, y + h + pad)
    return x0, y0, x1 - x0, y1 - y0


# ----------------------------------------------------------------------------------------------------------
# small image toolkit (numpy + PIL only)
# ----------------------------------------------------------------------------------------------------------


def luma(rgb: np.ndarray) -> np.ndarray:
    r = rgb.astype(np.float32)
    return 0.2126 * r[..., 0] + 0.7152 * r[..., 1] + 0.0722 * r[..., 2]


def hex_rgb(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)


def _shift_max(a: np.ndarray, r: int, axis: int, fn) -> np.ndarray:
    out = a.copy()
    n = a.shape[axis]
    for s in range(1, r + 1):
        if s >= n:
            break
        sl_a = [slice(None)] * a.ndim
        sl_b = [slice(None)] * a.ndim
        sl_a[axis], sl_b[axis] = slice(s, None), slice(None, -s)
        out[tuple(sl_a)] = fn(out[tuple(sl_a)], a[tuple(sl_b)])
        out[tuple(sl_b)] = fn(out[tuple(sl_b)], a[tuple(sl_a)])
    return out


def dilate(m: np.ndarray, r: int) -> np.ndarray:
    if r <= 0:
        return m
    return _shift_max(_shift_max(m, r, 0, np.maximum), r, 1, np.maximum)


def erode(m: np.ndarray, r: int) -> np.ndarray:
    if r <= 0:
        return m
    return _shift_max(_shift_max(m, r, 0, np.minimum), r, 1, np.minimum)


def blur(a: np.ndarray, sigma: float) -> np.ndarray:
    """Gaussian blur of a [0,1] float array (via PIL on 8 bit; enough for mattes)."""
    if sigma <= 0:
        return a
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(sigma))).astype(np.float32) / 255


def label_runs(mask: np.ndarray):
    """8-connected components by run-length union-find. Returns (label image int32, areas, touches_border)."""
    H, W = mask.shape
    m = np.zeros((H, W + 2), np.int8)
    m[:, 1:-1] = mask
    d = np.diff(m, axis=1)
    rs, cs = np.nonzero(d == 1)
    _, ce = np.nonzero(d == -1)
    n = len(rs)
    if n == 0:
        return np.zeros((H, W), np.int32), np.zeros(0), np.zeros(0, bool)
    parent = np.arange(n)

    def find(i):
        root = i
        while parent[root] != root:
            root = parent[root]
        while parent[i] != root:
            parent[i], i = root, parent[i]
        return root

    rowptr = np.searchsorted(rs, np.arange(H + 1))
    csl, cel = cs.tolist(), ce.tolist()
    for yy in range(1, H):
        i, i1 = int(rowptr[yy - 1]), int(rowptr[yy])
        j, j1 = int(rowptr[yy]), int(rowptr[yy + 1])
        while i < i1 and j < j1:
            if csl[j] <= cel[i] and csl[i] <= cel[j]:
                a_, b_ = find(i), find(j)
                if a_ != b_:
                    parent[max(a_, b_)] = min(a_, b_)
            if cel[i] < cel[j]:
                i += 1
            else:
                j += 1
    roots = np.array([find(i) for i in range(n)])
    uniq, comp = np.unique(roots, return_inverse=True)
    lengths = ce - cs
    areas = np.bincount(comp, weights=lengths)
    edge = (rs == 0) | (rs == H - 1) | (cs == 0) | (ce == W)
    touches = np.bincount(comp, weights=edge.astype(float)) > 0
    lab = np.zeros(H * W, np.int32)
    starts = rs * W + cs
    for k in range(n):
        lab[starts[k]:starts[k] + lengths[k]] = comp[k] + 1
    return lab.reshape(H, W), areas, touches


def keep_largest(mask: np.ndarray, n: int = 1, min_area: int = 0) -> np.ndarray:
    lab, areas, _ = label_runs(mask)
    if len(areas) == 0:
        return mask
    order = np.argsort(-areas)
    keep = [i + 1 for i in order[:n] if areas[i] >= min_area] if n else [i + 1 for i in order if areas[i] >= min_area]
    return np.isin(lab, keep)


def _pad_sides(mask: np.ndarray, open_sides) -> np.ndarray:
    """Pad by 1 px: closed sides are foreground (they block), open sides are background (the outside)."""
    m = np.pad(mask, 1, constant_values=True)
    for side in open_sides:
        if side == "left":
            m[:, 0] = False
        elif side == "right":
            m[:, -1] = False
        elif side == "top":
            m[0, :] = False
        elif side == "bottom":
            m[-1, :] = False
    return m


def _outside(mask: np.ndarray, open_sides=None, seeds=None):
    """Label the background of ``mask``; return (labels, areas, set of outside labels, pad). Outside = touches an
    open side (default: all four crop edges) or contains one of ``seeds`` (local x, y)."""
    pad = 1 if open_sides is not None else 0
    m = _pad_sides(mask, open_sides) if pad else mask
    lab, areas, touches = label_runs(~m)
    out = {i + 1 for i in range(len(areas)) if touches[i]}
    for sx, sy in seeds or []:
        sx, sy = int(sx) + pad, int(sy) + pad
        if 0 <= sy < lab.shape[0] and 0 <= sx < lab.shape[1] and lab[sy, sx]:
            out.add(int(lab[sy, sx]))
    if pad:
        lab = lab[1:-1, 1:-1]
    return lab, areas, out


def fill_holes(mask: np.ndarray, max_hole: int | None = None, open_sides=None, seeds=None) -> np.ndarray:
    """Fill background components that do not reach the outside. ``open_sides`` (default: all four) says
    which crop edges count as outside (use it for objects that bleed off the frame); ``seeds`` are local
    points that are known ground."""
    lab, areas, out = _outside(mask, open_sides, seeds)
    holes = [i + 1 for i in range(len(areas)) if (i + 1) not in out and (max_hole is None or areas[i] <= max_hole)]
    return mask | np.isin(lab, holes)


def fill_holes_alpha(alpha: np.ndarray, rgb: np.ndarray, max_hole=None, hole_luma=None, open_sides=None,
                     seeds=None) -> np.ndarray:
    """Fill enclosed holes of a matte. ``hole_luma``: only holes whose mean luma is above it (a grey speaker
    cone the model dropped), so holes that show the black ground (the gap under a handle) stay open."""
    m = alpha > 0.5
    lab, areas, out = _outside(m, open_sides, seeds)
    if len(areas) == 0:
        return alpha
    sums = np.bincount(lab.ravel(), weights=luma(rgb).ravel(), minlength=len(areas) + 1)
    cnt = np.bincount(lab.ravel(), minlength=len(areas) + 1)
    fill = [i + 1 for i in range(len(areas)) if (i + 1) not in out
            and (max_hole is None or areas[i] <= max_hole)
            and (hole_luma is None or sums[i + 1] / max(1, cnt[i + 1]) >= hole_luma)]
    return np.where(np.isin(lab, fill), 1.0, alpha).astype(np.float32)


def alpha_bbox(alpha: np.ndarray, thr: float = 2 / 255, margin: int = 2):
    ys, xs = np.nonzero(alpha > thr)
    if len(ys) == 0:
        return 0, 0, alpha.shape[1], alpha.shape[0]
    x0, x1 = max(0, xs.min() - margin), min(alpha.shape[1], xs.max() + 1 + margin)
    y0, y1 = max(0, ys.min() - margin), min(alpha.shape[0], ys.max() + 1 + margin)
    return int(x0), int(y0), int(x1 - x0), int(y1 - y0)


def rect_mask(shape, rects, origin):
    """Boolean mask of global rects [x,y,w,h] inside an image whose (0,0) sits at global ``origin``."""
    m = np.zeros(shape[:2], bool)
    ox, oy = origin
    for x, y, w, h in rects:
        x0, y0 = max(0, x - ox), max(0, y - oy)
        x1, y1 = min(shape[1], x - ox + w), min(shape[0], y - oy + h)
        if x1 > x0 and y1 > y0:
            m[y0:y1, x0:x1] = True
    return m


def circle_alpha(shape, cx, cy, r, origin, aa=1.5):
    ox, oy = origin
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]].astype(np.float32)
    d = np.hypot(xx + ox - cx, yy + oy - cy)
    return np.clip((r - d) / aa + 0.5, 0, 1)


def unmix(rgb: np.ndarray, alpha: np.ndarray, bg) -> np.ndarray:
    """Recover foreground colour from a pixel composited over a known flat background."""
    bg = np.asarray(bg, np.float32)
    a = np.clip(alpha, 1 / 255, 1)[..., None]
    fg = (rgb.astype(np.float32) - (1 - a) * bg) / a
    return np.clip(fg, 0, 255)


def levels(a: np.ndarray, lo: float, hi: float) -> np.ndarray:
    return np.clip((a - lo) / max(1e-6, hi - lo), 0, 1)


def to_rgba(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    a = (np.clip(alpha, 0, 1) * 255).round().astype(np.uint8)
    return np.dstack([np.clip(rgb, 0, 255).round().astype(np.uint8), a])


def patch_bug(ctx: Ctx, img: np.ndarray, origin=(0, 0), shift=None, feather: int = 10):
    """Replace the watermark area with image content copied from ``shift`` = [dx, dy] away
    (default: the same rows, one watermark-width to the left)."""
    if not ctx.bug:
        return img
    bx, by, bw, bh = ctx.bug
    ox, oy = origin
    x0, y0, x1, y1 = bx - ox, by - oy, bx - ox + bw, by - oy + bh
    H, W = img.shape[:2]
    x0c, y0c, x1c, y1c = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
    if x1c <= x0c or y1c <= y0c:
        return img
    dx, dy = shift if shift else ((-(bw + 16) if x0c - (bw + 16) >= 0 else (bw + 16)), 0)
    out = img.astype(np.float32).copy()
    m = np.zeros((H, W), np.float32)
    m[y0c:y1c, x0c:x1c] = 1
    m = blur(dilate(m > 0, feather // 2).astype(np.float32), feather / 2)
    src = np.roll(img, (-dy, -dx), axis=(0, 1)).astype(np.float32)
    out = out * (1 - m[..., None]) + src * m[..., None]
    return out.round().astype(np.uint8)


def intersects_bug(ctx: Ctx, box) -> bool:
    if not ctx.bug:
        return False
    bx, by, bw, bh = ctx.bug
    x, y, w, h = box
    return not (x + w <= bx or bx + bw <= x or y + h <= by or by + bh <= y)


def save(img: np.ndarray, path: Path, fmt: str = "png", quality: int = 95):
    path.parent.mkdir(parents=True, exist_ok=True)
    im = Image.fromarray(img)
    if fmt == "jpg":
        im.convert("RGB").save(path, quality=quality, subsampling=0, optimize=True)
    else:
        im.save(path, optimize=False, compress_level=7)


# ----------------------------------------------------------------------------------------------------------
# keys (shared by single-frame methods and sequences); every key returns RGBA float colour + alpha in [0,1]
# ----------------------------------------------------------------------------------------------------------


def ellipse_band(shape, origin, cx, cy, rx, ry, rot_deg=0.0, tol=0.2):
    """Soft mask of the band |q-1| < tol around an ellipse (global px), q = normalised elliptical radius."""
    ox, oy = origin
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]].astype(np.float32)
    x, y = xx + ox - cx, yy + oy - cy
    c, s_ = math.cos(math.radians(rot_deg)), math.sin(math.radians(rot_deg))
    u, v = x * c + y * s_, -x * s_ + y * c
    q = np.sqrt((u / rx) ** 2 + (v / ry) ** 2)
    return levels(-np.abs(q - 1), -tol, -tol * 0.8)


def post_alpha(alpha: np.ndarray, p: dict, origin) -> np.ndarray:
    """Options shared by the lumakey and chroma keys: ``ellipse_band`` and ``keep`` (largest pieces only)."""
    if p.get("ellipse_band"):
        alpha = alpha * ellipse_band(alpha.shape, origin, *p["ellipse_band"])
    if p.get("keep") and not p.get("matte") and p.get("mode", "linear") != "matte":
        m = keep_largest(alpha > 0.5, p["keep"], p.get("min_area", 0))
        alpha = np.where(dilate(m, 2), alpha, 0).astype(np.float32)
    return alpha


def key_lumakey(rgb: np.ndarray, p: dict, origin=(0, 0)):
    Y = luma(rgb)
    mode = p.get("mode", "linear")
    if mode == "linear":
        alpha = levels(Y, p.get("lo", 30), p.get("hi", 180))
    elif mode == "invert":
        alpha = levels(-Y, -p.get("hi", 200), -p.get("lo", 60))
    elif mode == "matte":
        thr = p.get("thr", 30)
        m = Y > thr if not p.get("dark") else Y < thr
        if p.get("exclude_blue") is not None:  # glow dots/bars behind a photo are brighter than the ground
            m &= ~dilate(_cbcr(rgb)[0] > p["exclude_blue"], 2)
        if p.get("open"):
            m = dilate(erode(m, p["open"]), p["open"])
        if p.get("close"):
            m = erode(dilate(m, p["close"]), p["close"])
        if p.get("keep"):
            m = keep_largest(m, p["keep"], p.get("min_area", 0))
        if p.get("fill_holes"):
            seeds = [(sx - origin[0], sy - origin[1]) for sx, sy in p.get("outside_seeds", [])]
            if p.get("hole_luma") is not None:
                m = fill_holes_alpha(m.astype(np.float32), rgb, p.get("max_hole"), p["hole_luma"], p.get("open_sides"), seeds) > 0.5
            else:
                m = fill_holes(m, p.get("max_hole"), p.get("open_sides"), seeds)
        if p.get("shrink"):
            m = erode(m, p["shrink"])
        alpha = blur(m.astype(np.float32), p.get("feather", 0.8))
        alpha = np.where(m, np.maximum(alpha, 0.5), alpha) if p.get("feather", 0.8) > 0 else alpha
    elif mode == "iris":
        # a dark paper frame around a bright hole: hole = largest bright region, closed and filled
        m = Y > p.get("thr", 40)
        r = p.get("close", 20)
        m = erode(dilate(m, r), r)
        m = fill_holes(keep_largest(m, 1))
        alpha = 1 - blur(m.astype(np.float32), p.get("feather", 1.0))
    else:
        raise ValueError(f"lumakey mode {mode}")
    alpha = post_alpha(alpha, p, origin)
    if p.get("exclude"):
        alpha[rect_mask(alpha.shape, p["exclude"], origin)] = 0
    if p.get("mask_rects"):  # keep alpha only inside these rects
        alpha[~rect_mask(alpha.shape, p["mask_rects"], origin)] = 0
    col = p.get("color", "source")
    if col == "source":
        bg = hex_rgb(p.get("bg", "#000000"))
        color = unmix(rgb, alpha, bg) if mode != "matte" else rgb.astype(np.float32)
    elif col == "raw":
        color = rgb.astype(np.float32)
    else:
        color = np.broadcast_to(hex_rgb(col), rgb.shape).astype(np.float32)
    return color, alpha


def _cbcr(rgb: np.ndarray):
    r, g, b = (rgb[..., i].astype(np.float32) for i in range(3))
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return (b - y) / 1.8556, (r - y) / 1.5748


def key_chroma(rgb: np.ndarray, p: dict, origin=(0, 0)):
    tgt = hex_rgb(p.get("target", "#6D76DD"))
    tb, tr = _cbcr(tgt[None, None, :])
    tb, tr = float(tb[0, 0]), float(tr[0, 0])
    tn = math.hypot(tb, tr)
    cb, cr = _cbcr(rgb)
    proj = (cb * tb + cr * tr) / tn / tn          # 1.0 == the target's full chroma
    alpha = levels(proj, p.get("lo", 0.12), p.get("hi", 0.85))
    if p.get("hue_tol"):
        ang = np.degrees(np.abs(np.arctan2(cb * tr - cr * tb, cb * tb + cr * tr)))
        alpha = alpha * levels(-ang, -p["hue_tol"] * 1.5, -p["hue_tol"])
    if p.get("luma_min") is not None:
        alpha = alpha * levels(luma(rgb), p["luma_min"] - 8, p["luma_min"] + 8)
    if p.get("luma_max") is not None:
        alpha = alpha * levels(-luma(rgb), -p["luma_max"] - 8, -p["luma_max"] + 8)
    if p.get("matte"):
        m = alpha > 0.5
        if p.get("close"):
            m = erode(dilate(m, p["close"]), p["close"])
        if p.get("keep"):
            m = keep_largest(m, p["keep"], p.get("min_area", 0))
        if p.get("fill_holes"):
            m = fill_holes(m, p.get("max_hole"))
        alpha = np.where(dilate(m, 1), alpha, 0)
        if p.get("solid"):
            alpha = np.maximum(alpha, m.astype(np.float32))
    alpha = post_alpha(alpha, p, origin)
    if p.get("exclude"):
        alpha[rect_mask(alpha.shape, p["exclude"], origin)] = 0
    if p.get("mask_rects"):
        alpha[~rect_mask(alpha.shape, p["mask_rects"], origin)] = 0
    col = p.get("color", "source")
    if col == "source":
        color = unmix(rgb, alpha, hex_rgb(p.get("bg", "#000000")))
    elif col == "raw":
        color = rgb.astype(np.float32)
    else:
        color = np.broadcast_to(hex_rgb(col), rgb.shape).astype(np.float32)
    return color, alpha


def fit_circle(rgb: np.ndarray, cx, cy, r, origin, search: int = 3, arc=None):
    """Refine a circle (global px) to the strongest radial luma edge within +-search px."""
    Y = luma(rgb)
    gy, gx = np.gradient(Y)
    th = np.linspace(arc[0], arc[1], 900) if arc else np.linspace(0, 2 * np.pi, 1440, endpoint=False)
    c, s_ = np.cos(th), np.sin(th)
    ox, oy = origin
    best, bc = -1.0, (cx, cy, r)
    for ddx in range(-search, search + 1):
        for ddy in range(-search, search + 1):
            for dr in range(-search, search + 1):
                X = cx + ddx + (r + dr) * c - ox
                Yy = cy + ddy + (r + dr) * s_ - oy
                ok = (X >= 1) & (X < rgb.shape[1] - 1) & (Yy >= 1) & (Yy < rgb.shape[0] - 1)
                if ok.sum() < 50:
                    continue
                xi, yi = X[ok].round().astype(int), Yy[ok].round().astype(int)
                sc = float(np.abs(gx[yi, xi] * c[ok] + gy[yi, xi] * s_[ok]).mean())
                if sc > best:
                    best, bc = sc, (cx + ddx, cy + ddy, r + dr)
    return bc


def key_circle(rgb: np.ndarray, p: dict, origin=(0, 0)):
    cx, cy, r = p["circle"]
    if p.get("fit"):
        cx, cy, r = fit_circle(rgb, cx, cy, r, origin, p.get("fit", 3), p.get("arc"))
    r -= p.get("inset", 0)
    return rgb.astype(np.float32), circle_alpha(rgb.shape, cx, cy, r, origin)


KEYS = {"lumakey": key_lumakey, "chroma": key_chroma, "circle": key_circle}


# ----------------------------------------------------------------------------------------------------------
# methods
# ----------------------------------------------------------------------------------------------------------


def out_path(ctx: Ctx, a: dict, suffix: str = "", ext: str | None = None) -> Path:
    p = a.get("params", {})
    ext = ext or p.get("format", "png")
    return ctx.out / a["kind"] / f"{a['id']}{suffix}.{ext}"


def m_raw(ctx: Ctx, a: dict):
    p = a.get("params", {})
    img = source_image(ctx, a)
    x, y, w, h = crop_box(ctx, a["bbox"], p.get("pad", 0))
    if a["kind"] != "frames" and not p.get("bug") and intersects_bug(ctx, (x, y, w, h)):
        img = patch_bug(ctx, img, shift=p.get("bug_shift"))
    crop = img[y:y + h, x:x + w]
    fmt = p.get("format", "jpg" if a["kind"] == "frames" else "png")
    path = out_path(ctx, a, ext=fmt)
    save(crop, path, fmt, p.get("quality", 95))
    return [path]


def _write_keyed(ctx, a, color, alpha, origin):
    p = a.get("params", {})
    if p.get("no_trim"):
        bx, by, bw, bh = 0, 0, alpha.shape[1], alpha.shape[0]
    else:
        bx, by, bw, bh = alpha_bbox(alpha, margin=p.get("margin", 2))
    rgba = to_rgba(color[by:by + bh, bx:bx + bw], alpha[by:by + bh, bx:bx + bw])
    path = out_path(ctx, a, ext="png")
    save(rgba, path, "png")
    a["_placed"] = [origin[0] + bx, origin[1] + by, bw, bh]
    return [path]


def m_key(ctx: Ctx, a: dict):
    p = a.get("params", {})
    img = source_image(ctx, a)
    x, y, w, h = crop_box(ctx, a["bbox"], p.get("pad", 0))
    if not p.get("bug") and intersects_bug(ctx, (x, y, w, h)):
        img = patch_bug(ctx, img, shift=p.get("bug_shift"))
    crop = img[y:y + h, x:x + w]
    color, alpha = KEYS[a["method"]](crop, p, (x, y))
    return _write_keyed(ctx, a, color, alpha, (x, y))


def _phase_shift(ref: np.ndarray, img: np.ndarray, maxs: int = 12):
    A = np.fft.rfft2(ref - ref.mean())
    B = np.fft.rfft2(img - img.mean())
    R = A * np.conj(B)
    R /= np.abs(R) + 1e-6
    c = np.fft.irfft2(R, s=ref.shape)
    h, w = c.shape
    best, bs = -1e9, (0, 0)
    for dy in range(-maxs, maxs + 1):
        for dx in range(-maxs, maxs + 1):
            v = c[dy % h, dx % w]
            if v > best:
                best, bs = v, (dy, dx)
    return bs, float(best)


def m_plate(ctx: Ctx, a: dict):
    p = a.get("params", {})
    x, y, w, h = crop_box(ctx, a["bbox"])
    if "frame_list" in p:
        fl = list(p["frame_list"])
    else:
        f0, f1 = a["frames"]
        fl = list(range(f0, f1 + 1, p.get("step", 1)))
    mx = min(60, p.get("max_frames", 60))
    if len(fl) > mx:
        idx = np.linspace(0, len(fl) - 1, mx).round().astype(int)
        fl = [fl[i] for i in idx]
    fr = grab_many(ctx, fl, crop=(x, y, w, h))
    keys = sorted(fr)
    stack = np.stack([fr[k] for k in keys])          # N,h,w,3 uint8 (<= 60 frames)
    del fr
    N = len(keys)
    valid = np.ones((N, h, w), bool)
    reg = p.get("register")
    shifts = [(0, 0)] * N
    if reg:
        rx, ry, rw, rh = reg["roi"]
        rx, ry = rx - x, ry - y
        ref = luma(stack[N // 2, ry:ry + rh, rx:rx + rw])
        for i in range(N):
            (dy, dx), _ = _phase_shift(ref, luma(stack[i, ry:ry + rh, rx:rx + rw]), reg.get("max", 12))
            shifts[i] = (dy, dx)
            if dy or dx:
                stack[i] = np.roll(stack[i], (dy, dx), axis=(0, 1))
                v = np.ones((h, w), bool)
                if dy > 0:
                    v[:dy] = False
                elif dy < 0:
                    v[dy:] = False
                if dx > 0:
                    v[:, :dx] = False
                elif dx < 0:
                    v[:, dx:] = False
                valid[i] &= v
        a["_shifts"] = {int(k): list(s) for k, s in zip(keys, shifts)}
    for ex in p.get("exclude", []):
        kind = ex["type"]
        for i, f in enumerate(keys):
            if kind == "rects":
                for f0, f1, rx, ry, rw, rh in ex["rects"]:
                    if f0 <= f <= f1:
                        valid[i] &= ~rect_mask((h, w), [[rx, ry, rw, rh]], (x, y))
                continue
            fr_i = stack[i]
            if kind == "blue":
                cb, cr = _cbcr(fr_i)
                m = cb > ex.get("thr", 12)
            elif kind == "bright":
                m = luma(fr_i) > ex.get("thr", 60)
            elif kind == "dark":
                m = luma(fr_i) < ex.get("thr", 30)
            else:
                raise ValueError(kind)
            valid[i] &= ~dilate(m, ex.get("grow", 6))
    out = np.empty((h, w, 3), np.uint8)
    cover = valid.sum(0)
    for y0 in range(0, h, 48):
        y1 = min(h, y0 + 48)
        S = stack[:, y0:y1].astype(np.float32)
        V = valid[:, y0:y1]
        S[~np.broadcast_to(V[..., None], S.shape)] = np.nan
        with np.errstate(all="ignore"):
            import warnings
            with warnings.catch_warnings():
                warnings.simplefilter("ignore", RuntimeWarning)
                med = np.nanmedian(S, axis=0)
        fallback = np.median(stack[:, y0:y1].astype(np.float32), axis=0)
        med = np.where(np.isnan(med), fallback, med)
        out[y0:y1] = np.clip(med.round(), 0, 255).astype(np.uint8)
    a["_coverage"] = {"min_valid_frames": int(cover.min()), "frames_used": N,
                      "pct_px_with_<5_valid": round(float((cover < 5).mean() * 100), 2)}
    if p.get("fill_uncovered"):  # pixels that never had a clean sample: copy ground from ``shift`` away
        fu = p["fill_uncovered"]
        bad = dilate(cover < fu.get("min_valid", 3), fu.get("grow", 8)).astype(np.float32)
        bad = blur(bad, fu.get("feather", 6))
        dx, dy = fu.get("shift", [0, 300])
        src = np.roll(out, (-dy, -dx), axis=(0, 1)).astype(np.float32)
        out = (out * (1 - bad[..., None]) + src * bad[..., None]).round().astype(np.uint8)
        a["_coverage_filled_pct"] = round(float((bad > 0.5).mean() * 100), 2)
    if p.get("bug_fill", True) and intersects_bug(ctx, (x, y, w, h)):
        out = patch_bug(ctx, out, origin=(x, y), shift=p.get("bug_shift"))
    files = []
    fmt = p.get("format", "jpg")
    if p.get("crop_out"):
        cx, cy, cw, ch = p["crop_out"]
        plate = out[cy - y:cy - y + ch, cx - x:cx - x + cw]
    else:
        plate = out
    if p.get("plate", True):
        path = out_path(ctx, a, ext=fmt)
        save(plate, path, fmt, p.get("quality", 95))
        files.append(path)
    if p.get("tile"):
        tx, ty, tw, th = p["tile"]
        o = p.get("overlap", 96)
        if tx < x or ty < y or tx + tw + o > x + w or ty + th + o > y + h:
            raise ValueError(f"{a['id']}: tile {p['tile']} + overlap {o} leaves the plate {[x, y, w, h]}")
        ext = out[ty - y:ty - y + th + o, tx - x:tx - x + tw + o].astype(np.float32)
        tile = make_tileable(ext, tw, th, o)
        path = out_path(ctx, a, suffix="-tile", ext=fmt)
        save(tile, path, fmt, p.get("quality", 95))
        files.append(path)
    a["_frames_used"] = keys
    return files


def make_tileable(ext: np.ndarray, tw: int, th: int, o: int) -> np.ndarray:
    """Cross-fade the extra ``o`` px of an (th+o)x(tw+o) crop into its start so it wraps without a seam."""
    ramp = np.linspace(0, 1, o, dtype=np.float32)
    ramp = ramp * ramp * (3 - 2 * ramp)
    a = ext[:, :tw].copy()
    a[:, :o] = ext[:, tw:tw + o] * (1 - ramp)[None, :, None] + ext[:, :o] * ramp[None, :, None]
    b = a[:th].copy()
    b[:o] = a[th:th + o] * (1 - ramp)[:, None, None] + a[:o] * ramp[:, None, None]
    return np.clip(b.round(), 0, 255).astype(np.uint8)


def m_sequence(ctx: Ctx, a: dict):
    p = a.get("params", {})
    x, y, w, h = crop_box(ctx, a["bbox"], p.get("pad", 0))
    if "frame_list" in p:
        fl = list(p["frame_list"])
    else:
        f0, f1 = a["frames"]
        fl = list(range(f0, f1 + 1, p.get("step", 1)))
    fl = fl[: p.get("max_frames", 120)]
    fr = grab_many(ctx, fl, crop=(x, y, w, h))
    keys = sorted(fr)
    holds = []
    if p.get("dedupe"):
        kept, prev = [], None
        thr = p.get("dedupe_thr", 1.2)
        for f in keys:
            if prev is None or np.abs(fr[f].astype(np.int16) - fr[prev].astype(np.int16)).mean() > thr:
                kept.append(f)
                holds.append(1)
                prev = f
            else:
                holds[-1] += 1
        keys = kept
    else:
        holds = [p.get("step", 1)] * len(keys)
    key = p.get("key", {"method": "raw"})
    km = key.get("method", "raw")
    bug_hit = not p.get("bug") and intersects_bug(ctx, (x, y, w, h))
    cols, alps = [], []
    for f in keys:
        img = fr[f]
        if bug_hit:
            full = np.zeros((ctx.H, ctx.W, 3), np.uint8)
            full[y:y + h, x:x + w] = img
            img = patch_bug(ctx, full, shift=p.get("bug_shift"))[y:y + h, x:x + w]
        if km == "raw":
            cols.append(img)
            alps.append(None)
        else:
            c, al = KEYS[km](img, key, (x, y))
            cols.append(c)
            alps.append(al)
    seqdir = ctx.out / a["kind"] / a["id"]
    if seqdir.exists():
        shutil.rmtree(seqdir)
    seqdir.mkdir(parents=True)
    fmt = p.get("format", "png")
    if km != "raw" and not p.get("no_trim"):
        union = np.maximum.reduce(alps)
        bx, by, bw, bh = alpha_bbox(union, margin=p.get("margin", 2))
    else:
        bx, by, bw, bh = 0, 0, w, h
    files = []
    for i, f in enumerate(keys):
        if alps[i] is None:
            img = cols[i][by:by + bh, bx:bx + bw]
        else:
            img = to_rgba(cols[i][by:by + bh, bx:bx + bw], alps[i][by:by + bh, bx:bx + bw])
        path = seqdir / f"{a['id']}_{i:03d}.{fmt}"
        save(img, path, fmt, p.get("quality", 92))
        files.append(path)
    meta = {"id": a["id"], "fps": ctx.fps, "frames": len(keys), "source_frames": keys, "holds": holds,
            "loop": bool(p.get("loop", False)), "size": [bw, bh], "origin": [x + bx, y + by],
            "note": "play frame i for holds[i] frames at fps to reproduce the source cadence"}
    (seqdir / "sequence.json").write_text(json.dumps(meta, indent=1))
    a["_placed"] = [x + bx, y + by, bw, bh]
    a["_seq"] = meta
    return files


# ---- rembg (batched per model; cached by input hash) ----


def rembg_inputs(ctx: Ctx, a: dict):
    p = a.get("params", {})
    model = p.get("model", "isnet-general-use")
    if model not in ALLOWED_MODELS:
        raise ValueError(f"{a['id']}: model {model} not allowed (never bria-rmbg)")
    img = source_image(ctx, a)
    x, y, w, h = crop_box(ctx, a["bbox"], p.get("pad", 0))
    if not p.get("bug") and intersects_bug(ctx, (x, y, w, h)):
        img = patch_bug(ctx, img, shift=p.get("bug_shift"))
    crop = np.ascontiguousarray(img[y:y + h, x:x + w])
    if p.get("pre_exclude"):  # paint known non-subject areas with the ground colour before matting
        m = rect_mask(crop.shape, p["pre_exclude"], (x, y))
        crop[m] = hex_rgb(p.get("ground", "#0A0A0A")).astype(np.uint8)
    hsh = hashlib.sha1(crop.tobytes() + model.encode()).hexdigest()[:10]
    return model, crop, (x, y), f"{a['id']}__{hsh}.png"


def run_rembg_batch(ctx: Ctx, jobs: list):
    """jobs: (model, crop, name). Runs one `rembg p` per model for the uncached inputs, sequentially."""
    by_model = {}
    for model, crop, name in jobs:
        if model in ("none", "empty"):
            continue
        outp = ctx.scratch / "rembg" / model / "out" / name
        if outp.exists():
            continue
        by_model.setdefault(model, []).append((crop, name))
    for model, items in by_model.items():
        pend = ctx.scratch / "rembg" / model / "pending"
        outd = ctx.scratch / "rembg" / model / "out"
        if pend.exists():
            shutil.rmtree(pend)
        pend.mkdir(parents=True)
        outd.mkdir(parents=True, exist_ok=True)
        for crop, name in items:
            Image.fromarray(crop).save(pend / name)
        log(f"  rembg {model}: {len(items)} crop(s)")
        tmp_out = ctx.scratch / "rembg" / model / "pending_out"
        if tmp_out.exists():
            shutil.rmtree(tmp_out)
        tmp_out.mkdir()
        subprocess.run([str(REMBG), "p", "-m", model, "-om", str(pend), str(tmp_out)], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for f in tmp_out.iterdir():
            shutil.move(str(f), outd / f.name)
        shutil.rmtree(pend)
        shutil.rmtree(tmp_out)


def m_rembg_post(ctx: Ctx, a: dict, model: str, crop: np.ndarray, origin, name: str):
    p = a.get("params", {})
    x, y = origin
    if model == "none":
        alpha = np.ones(crop.shape[:2], np.float32)
    elif model == "empty":  # start from nothing and build the matte from ``union`` keys only
        alpha = np.zeros(crop.shape[:2], np.float32)
    else:
        mk = np.asarray(Image.open(ctx.scratch / "rembg" / model / "out" / name).convert("L")).astype(np.float32) / 255
        alpha = mk
    if p.get("alpha_levels"):
        lo, hi = p["alpha_levels"]
        alpha = levels(alpha * 255, lo, hi)
    ex = rect_mask(alpha.shape, p.get("exclude", []), origin)  # applied before keep, and again at the end
    alpha[ex] = 0
    if p.get("luma_union") is not None:
        lm = luma(crop) > p["luma_union"]
        if p.get("luma_union_near"):
            lm &= dilate(alpha > 0.5, p["luma_union_near"])
        alpha = np.maximum(alpha, lm.astype(np.float32))
    for u in p.get("union", []):  # e.g. a periwinkle cord: {"method": "chroma", "target": "#7480F1", "rect": [...]}
        _, ua = KEYS[u["method"]](crop, u, origin)
        if u.get("rect"):
            ua = ua * rect_mask(ua.shape, [u["rect"]], origin)
        alpha = np.maximum(alpha, ua)
    alpha[ex] = 0
    for u in p.get("subtract", []):  # e.g. a cable that runs behind the object
        _, ua = KEYS[u["method"]](crop, u, origin)
        if u.get("rect"):
            ua = ua * rect_mask(ua.shape, [u["rect"]], origin)
        alpha = alpha * (1 - ua)
    if p.get("keep"):
        m = keep_largest(alpha > 0.5, p["keep"], p.get("min_area", 0))
        alpha = alpha * dilate(m, 2)
    if p.get("fill_holes"):
        seeds = [(sx - origin[0], sy - origin[1]) for sx, sy in p.get("outside_seeds", [])]
        alpha = fill_holes_alpha(alpha, crop, p.get("max_hole"), p.get("hole_luma"), p.get("open_sides"), seeds)
    if p.get("circle"):
        cx, cy, r = p["circle"]
        ca = circle_alpha(alpha.shape, cx, cy, r, origin)
        alpha = ca if model == "none" or p.get("circle_replace") else alpha * ca
    if p.get("include"):
        alpha[rect_mask(alpha.shape, p["include"], origin)] = 1
    if p.get("exclude"):
        alpha[rect_mask(alpha.shape, p["exclude"], origin)] = 0
    if p.get("luma_cut") is not None:  # drop near-black ground the matte kept (e.g. inside handles)
        alpha = alpha * levels(luma(crop), p["luma_cut"] - 4, p["luma_cut"] + 4)
    if p.get("erode"):
        alpha = np.minimum(alpha, erode(alpha > 0.5, p["erode"]).astype(np.float32) + (alpha * 0))
        alpha = blur(alpha, 0.7)
    color = crop.astype(np.float32)
    if p.get("bg_unmix"):
        color = unmix(crop, np.maximum(alpha, 0.35), hex_rgb(p["bg_unmix"]))
    return _write_keyed(ctx, a, color, alpha, origin)


# ----------------------------------------------------------------------------------------------------------
# build
# ----------------------------------------------------------------------------------------------------------


def built_files(ctx: Ctx, a: dict) -> list[Path]:
    k = ctx.out / a["kind"]
    if a["method"] == "sequence":
        d = k / a["id"]
        return sorted(d.glob(f"{a['id']}_*.*")) if d.exists() else []
    return sorted(f for f in k.glob(f"{a['id']}.*")) + sorted(k.glob(f"{a['id']}-tile.*"))


def build(ctx: Ctx, assets: list[dict], force: bool):
    meta_path = ctx.scratch / "build_meta.json"
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
    todo = [a for a in assets if force or not built_files(ctx, a)]
    log(f"build: {len(todo)} of {len(assets)} asset(s)")
    # rembg first, batched per model
    rj = []
    for a in todo:
        if a["method"] == "rembg":
            model, crop, origin, name = rembg_inputs(ctx, a)
            a["_rj"] = (model, crop, origin, name)
            rj.append((model, crop, name))
    run_rembg_batch(ctx, rj)
    for a in todo:
        t0 = time.time()
        for f in built_files(ctx, a):
            f.unlink()
        m = a["method"]
        if m == "raw":
            files = m_raw(ctx, a)
        elif m in ("lumakey", "chroma"):
            files = m_key(ctx, a)
        elif m == "plate":
            files = m_plate(ctx, a)
        elif m == "sequence":
            files = m_sequence(ctx, a)
        elif m == "rembg":
            model, crop, origin, name = a.pop("_rj")
            files = m_rembg_post(ctx, a, model, crop, origin, name)
        else:
            raise ValueError(f"{a['id']}: unknown method {m}")
        meta[a["id"]] = {k: a[k] for k in ("_placed", "_coverage", "_frames_used", "_shifts", "_seq") if k in a}
        log(f"  {a['kind']}/{a['id']}: {len(files)} file(s) {time.time() - t0:.1f}s")
    meta_path.write_text(json.dumps(meta, indent=1))


# ----------------------------------------------------------------------------------------------------------
# catalog, provenance, contact sheets
# ----------------------------------------------------------------------------------------------------------


def fmt_t(f: int, fps: float) -> str:
    return f"{f / fps:.2f}s"


def catalog(ctx: Ctx, assets: list[dict]):
    meta_path = ctx.scratch / "build_meta.json"
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
    src = ctx.man["source"]
    rows = []
    for a in assets:
        files = built_files(ctx, a)
        if not files:
            log(f"  (missing) {a['id']}")
            continue
        main = files[0]
        im = Image.open(main)
        alpha = im.mode in ("RGBA", "LA")
        if a.get("frames"):
            fr = [int(a["frames"][0]), int(a["frames"][1])]
        else:
            f = frame_of(a, ctx.fps)
            fr = [f, f]
        if a.get("params", {}).get("src", {}).get("median"):
            fr = list(a["params"]["src"]["median"])
        rel = lambda q: str(q.relative_to(ctx.out))
        placed = meta.get(a["id"], {}).get("_placed")
        if placed is None:  # plates and raw crops store a fixed region: derive it from the manifest
            pa = a.get("params", {})
            placed = list(pa["crop_out"]) if pa.get("crop_out") else list(crop_box(ctx, a["bbox"], pa.get("pad", 0)))
        rec = {
            "id": a["id"], "kind": a["kind"],
            "path": rel(main.parent) + "/" if a["method"] == "sequence" else rel(main),
            "files": [rel(q) for q in files] if a["method"] != "sequence" else None,
            "width": im.width, "height": im.height, "alpha": alpha,
            "bytes": int(sum(q.stat().st_size for q in files)),
            "method": a["method"],
            "source": {"file": src.get("video") or src.get("image"), "frames": fr,
                       "time_s": [round(fr[0] / ctx.fps, 2), round(fr[1] / ctx.fps, 2)], "bbox": a["bbox"], "placed": placed},
            "tags": a.get("tags", []), "use": a.get("use", ""), "notes": a.get("notes", ""),
        }
        if a["method"] == "sequence":
            sq = json.loads((main.parent / "sequence.json").read_text())
            rec["sequence"] = {"frames": sq["frames"], "fps": sq["fps"], "holds": sq["holds"], "loop": sq["loop"]}
            rec["files"] = None
        if a["method"] == "plate" and a["id"] in meta and "_coverage" in meta[a["id"]]:
            rec["plate"] = meta[a["id"]]["_coverage"]
        if rec["files"] is None:
            rec.pop("files")
        rows.append(rec)
    rights = src.get("rights", "unknown")
    cat = {"source": src, "generated_by": "tools/assets/extract_assets.py", "manifest": ctx.man.get("_path", ""),
           "license": ctx.man.get("license") or ("Cut from the user's own reference: the user's rights apply" if rights == "own" else
                      "NOT CLEARED: cut from a reference the user does not own; use in this project's drafts only, see PROVENANCE.md"),
           "counts": {k: sum(1 for r in rows if r["kind"] == k) for k in KINDS}, "assets": rows}
    (ctx.out / "catalog.json").write_text(json.dumps(cat, indent=1))
    write_catalog_md(ctx, cat)
    write_provenance(ctx, cat)
    write_credits(ctx, cat)
    log(f"catalog: {len(rows)} assets {cat['counts']}")
    return cat


KIND_BLURB = {
    "grounds": "Clean plates and tiles of the reference's grounds (median of frames; a watermark is patched out).",
    "props": "Objects cut from native frames (AI matte or geometric/luma matte), trimmed to alpha.",
    "photos": "Photos as they appear in the reference (torn borders and frames kept).",
    "marks": "Hand marks: X marks, arrows, underlines, scribbles, squiggles.",
    "type": "Type samples for look reference: captions, title cards, kinetic words, labels.",
    "fx": "Glows, light effects, glitches, transitions (mostly sequences).",
    "frames": "One full-frame style reference per shot (raw, JPEG q95).",
}


def _rel(p: Path) -> str:
    try:
        return str(p.resolve().relative_to(ROOT))
    except ValueError:
        return str(p)


def write_catalog_md(ctx: Ctx, cat: dict):
    s = cat["source"]
    title = ctx.man.get("title") or f"Reference asset library: {s.get('title', 'reference')}"
    L = [f"# {title}", "",
         f"Cut from `{s.get('video') or s.get('image')}` ({s.get('title', '')}, {ctx.W}×{ctx.H}, {ctx.fps:g} fps) by "
         f"`tools/assets/extract_assets.py` from `{cat.get('manifest', '')}`. **Rights: {cat['license']}** "
         "([PROVENANCE.md](PROVENANCE.md)).", "",
         f"Frames are global frame numbers at {ctx.fps:g} fps (t = f / fps). In `catalog.json`, `bbox` is the source search "
         "box and `placed` is where the stored (trimmed) file sat in the source frame (source px): use it to rebuild the "
         "original layout. Sequences are folders of PNGs with a `sequence.json` (`holds` = frames each drawing is held). "
         "Plates also have a `-tile` file that wraps seamlessly.", "",
         "| Folder | Assets | What |", "|---|---|---|"]
    for k in KINDS:
        if cat["counts"].get(k, 0):
            L.append(f"| `{k}/` | {cat['counts'][k]} | {KIND_BLURB[k]} |")
    L.append("")
    for k in KINDS:
        rows = [r for r in cat["assets"] if r["kind"] == k]
        if not rows:
            continue
        L += [f"## {k}/", "", KIND_BLURB[k], "",
              "| id | file | px | α | source f (t) | method | use | tags | notes |", "|---|---|---|---|---|---|---|---|---|"]
        for r in rows:
            f0, f1 = r["source"]["frames"]
            ft = f"f{f0}" + (f"–{f1}" if f1 != f0 else "") + f" ({r['source']['time_s'][0]:.2f}s)"
            extra = ""
            if r.get("files") and len(r["files"]) > 1:
                extra = " + " + ", ".join(f"`{Path(q).name}`" for q in r["files"][1:])
            if r.get("sequence"):
                extra = f" ({r['sequence']['frames']} frames{', loop' if r['sequence']['loop'] else ''})"
            notes = r["notes"].replace("|", "\\|")
            L.append(f"| `{r['id']}` | `{r['path']}`{extra} | {r['width']}×{r['height']} | {'yes' if r['alpha'] else 'no'} | "
                     f"{ft} | {r['method']} | {r['use']} | {', '.join(r['tags'])} | {notes} |")
        L.append("")
    (ctx.out / "CATALOG.md").write_text("\n".join(L))


def write_provenance(ctx: Ctx, cat: dict):
    s = cat["source"]
    pv = ctx.man.get("provenance", {})
    L = [f"# Provenance and rights: `{_rel(ctx.out)}/`", ""]
    L += pv.get("header") or [
        f"- **Source:** `{s.get('video') or s.get('image')}`: {s.get('title', '(untitled)')}"
        + (f", {s['publisher']}" if s.get("publisher") else "") + (f" ({s['url']})" if s.get("url") else "") + ".",
        f"- **Rights:** {s.get('rights', 'unknown')}. {cat['license']}.",
        "- **Extraction:** `tools/assets/extract_assets.py` (ffmpeg exact-frame decode; median plates; rembg mattes with "
        "isnet-general-use / birefnet, never bria-rmbg; luma and chroma keys). Re-running it reproduces every file.",
        "- Cutting a piece out of a picture gives no new rights: each file keeps the rights of the reference (and of any "
        "third-party material inside it, listed per file below)."]
    L += ["", "## Per-file provenance", "",
          f"Columns: source frame(s) at {ctx.fps:g} fps, time, the region of the source frame the file covers (x, y, w, h, "
          "source px), extraction method. The same data is machine-readable in `catalog.json`.", "",
          "| file | frames | time (s) | region | method | third-party content inside (as identified) |",
          "|---|---|---|---|---|---|"]
    for r in cat["assets"]:
        f0, f1 = r["source"]["frames"]
        t0, t1 = r["source"]["time_s"]
        tp = next((a.get("third_party", "") for a in ctx.man["assets"] if a["id"] == r["id"]), "")
        files = f"`{r['path']}`" + "".join(f" + `{Path(q).name}`" for q in (r.get("files") or [])[1:])
        region = r["source"].get("placed") or r["source"]["bbox"]
        L.append(f"| {files} | {f0}{'–' + str(f1) if f1 != f0 else ''} | {t0:.2f}{'–' + format(t1, '.2f') if f1 != f0 else ''} | "
                 f"{', '.join(str(v) for v in region)} | {r['method']} | {tp} |")
    L += [""] + pv.get("footer", [])
    others = sorted(d.name + "/" for d in ctx.out.iterdir() if d.is_dir() and d.name not in KINDS)
    if others:
        L += ["", f"Other folders here ({', '.join(f'`{o}`' for o in others)}) are written by other tools (for example "
              "`tools/audio/extract_sfx.py`) and are not covered by the table above; see their own manifests."]
    block = BEGIN + "\n" + "\n".join(L) + "\n" + END
    path = ctx.out / "PROVENANCE.md"
    old_txt = path.read_text() if path.exists() else ""
    if BEGIN in old_txt and END in old_txt:  # replace only our block, keep what other tools added
        pre, rest = old_txt.split(BEGIN, 1)
        post = rest.split(END, 1)[1]
        txt = pre + block + post
    elif old_txt.strip():
        txt = block + "\n\n" + old_txt  # a file another tool wrote first: keep it below ours
    else:
        txt = block + "\n"
    path.write_text(txt)


def write_credits(ctx: Ctx, cat: dict):
    """List every extracted file in the project's CREDITS.md (manifest "credits"), inside a block per library folder."""
    target = ctx.man.get("credits")
    if not target:
        return
    cp = Path(target) if Path(target).is_absolute() else ROOT / target
    s = cat["source"]
    tag = _rel(ctx.out)
    b0, b1 = f"<!-- BEGIN reference assets {tag} (tools/assets/extract_assets.py) -->", f"<!-- END reference assets {tag} -->"
    lines = [b0, f"## Cut from a reference: `{s.get('video') or s.get('image')}`", "",
             f"{s.get('title', '')}{', ' + s['publisher'] if s.get('publisher') else ''}. Rights: **{s.get('rights', 'unknown')}**. "
             f"{cat['license']}. Details: `{tag}/PROVENANCE.md`.", ""]
    for r in cat["assets"]:
        lines.append(f"- `{r['path']}` (f{r['source']['frames'][0]}, {r['method']})")
    lines.append(b1)
    block = "\n".join(lines)
    txt = cp.read_text(encoding="utf-8") if cp.exists() else "# Credits\n"
    if b0 in txt and b1 in txt:
        pre, rest = txt.split(b0, 1)
        txt = pre + block + rest.split(b1, 1)[1]
    else:
        txt = txt.rstrip("\n") + "\n\n" + block + "\n"
    cp.write_text(txt, encoding="utf-8")


BEGIN = "<!-- BEGIN visual assets: generated by tools/assets/extract_assets.py, do not edit by hand -->"
END = "<!-- END visual assets -->"


def _font(size: int):
    for p in ("/usr/share/fonts/TTF/DejaVuSans.ttf", "/usr/share/fonts/dejavu/DejaVuSans.ttf",
              "/usr/share/fonts/noto/NotoSans-Regular.ttf", "/usr/share/fonts/TTF/LiberationSans-Regular.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def checker(w: int, h: int, s: int = 12) -> Image.Image:
    yy, xx = np.mgrid[0:h, 0:w]
    c = (((yy // s) + (xx // s)) % 2).astype(np.uint8)
    a = np.where(c[..., None] == 1, np.array([118, 118, 118], np.uint8), np.array([168, 168, 168], np.uint8))
    return Image.fromarray(a.astype(np.uint8))


def thumb_of(path: Path, tw: int, th: int) -> Image.Image:
    im = Image.open(path)
    im = im.convert("RGBA")
    im.thumbnail((tw, th), Image.LANCZOS)
    return im


def sheets(ctx: Ctx, cat: dict):
    for k in KINDS:  # only our own sheets: other tools (e.g. the sfx/ audio library) share this folder
        (ctx.out / f"contact_sheet_{k}.png").unlink(missing_ok=True)
    font, small = _font(15), _font(12)
    for k in KINDS:
        rows = [r for r in cat["assets"] if r["kind"] == k]
        if not rows:
            continue
        cw, ch, lh = (384, 216, 34) if k in ("frames", "grounds") else (300, 240, 34)
        cols = 5 if k in ("frames", "grounds") else 6
        nrow = (len(rows) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * (cw + 8) + 8, nrow * (ch + lh + 8) + 8 + 40), (32, 32, 32))
        d = ImageDraw.Draw(sheet)
        d.text((10, 10), f"{ctx.out.name} / {k}/  ({len(rows)} assets)  checkerboard = transparent", fill=(255, 255, 255), font=font)
        for i, r in enumerate(rows):
            cx = 8 + (i % cols) * (cw + 8)
            cy = 48 + (i // cols) * (ch + lh + 8)
            bgc = checker(cw, ch)
            sheet.paste(bgc, (cx, cy))
            base = ctx.out / r["path"]
            if r.get("sequence"):
                fs = sorted(base.glob(f"{r['id']}_*.*"))
                pick = [fs[0], fs[len(fs) // 2], fs[-1]] if len(fs) >= 3 else fs
                sw = (cw - 4 * (len(pick) - 1)) // len(pick)
                for j, q in enumerate(pick):
                    t = thumb_of(q, sw, ch)
                    sheet.paste(t, (cx + j * (sw + 4) + (sw - t.width) // 2, cy + (ch - t.height) // 2), t)
            else:
                t = thumb_of(base, cw, ch)
                sheet.paste(t, (cx + (cw - t.width) // 2, cy + (ch - t.height) // 2), t)
                if r.get("files") and len(r["files"]) > 1:  # plate + tile: show the tile small in the corner
                    t2 = thumb_of(ctx.out / r["files"][1], cw // 3, ch // 3)
                    sheet.paste(t2, (cx + cw - t2.width - 2, cy + ch - t2.height - 2), t2)
                    d.rectangle([cx + cw - t2.width - 3, cy + ch - t2.height - 3, cx + cw - 2, cy + ch - 2], outline=(255, 200, 0))
            d.text((cx + 2, cy + ch + 2), r["id"], fill=(255, 255, 255), font=font)
            info = f"{r['width']}×{r['height']}{' α' if r['alpha'] else ''}  f{r['source']['frames'][0]}"
            if r.get("sequence"):
                info += f"  seq×{r['sequence']['frames']}"
            d.text((cx + 2, cy + ch + 18), info, fill=(170, 170, 170), font=small)
        sheet.save(ctx.out / f"contact_sheet_{k}.png", optimize=True)
        log(f"sheet: contact_sheet_{k}.png ({len(rows)})")


def preview(ctx: Ctx, frames: list[int], width: int = 960):
    d = ctx.scratch / "preview"
    d.mkdir(parents=True, exist_ok=True)
    font = _font(14)
    for f in frames:
        img = Image.fromarray(grab(ctx, f))
        s = width / ctx.W
        im = img.resize((width, int(ctx.H * s)), Image.LANCZOS)
        dr = ImageDraw.Draw(im)
        for gx in range(0, ctx.W + 1, 100):
            c = (255, 60, 60) if gx % 500 == 0 else (255, 255, 0)
            dr.line([(gx * s, 0), (gx * s, im.height)], fill=c + (0,), width=1)
            if gx % 200 == 0:
                dr.text((gx * s + 2, 2), str(gx), fill=c, font=font)
        for gy in range(0, ctx.H + 1, 100):
            c = (255, 60, 60) if gy % 500 == 0 else (255, 255, 0)
            dr.line([(0, gy * s), (im.width, gy * s)], fill=c, width=1)
            if gy % 200 == 0:
                dr.text((2, gy * s + 2), str(gy), fill=c, font=font)
        dr.rectangle([im.width - 90, im.height - 20, im.width, im.height], fill=(0, 0, 0))
        dr.text((im.width - 86, im.height - 18), f"f{f}", fill=(0, 255, 0), font=font)
        im.save(d / f"p{f:05d}.png")
    log(f"preview: {len(frames)} frame(s) -> {d}")


def clean(ctx: Ctx, assets: list[dict]):
    keep = set()
    for a in assets:
        keep.update(str(q) for q in built_files(ctx, a))
        if a["method"] == "sequence":
            keep.add(str(ctx.out / a["kind"] / a["id"] / "sequence.json"))
    n = 0
    for k in KINDS:
        for q in (ctx.out / k).rglob("*") if (ctx.out / k).exists() else []:
            if q.is_file() and str(q) not in keep:
                q.unlink()
                n += 1
        for q in sorted((ctx.out / k).rglob("*"), reverse=True) if (ctx.out / k).exists() else []:
            if q.is_dir() and not any(q.iterdir()):
                q.rmdir()
    log(f"clean: removed {n} stale file(s)")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", nargs="?", default="all", choices=["all", "build", "catalog", "sheets", "preview", "clean"])
    ap.add_argument("frames", nargs="*", type=int, help="preview: global frame numbers")
    ap.add_argument("--manifest", required=True, help="the cut list (see tools/reference/manifest.template.json)")
    ap.add_argument("--only", help="comma-separated asset ids")
    ap.add_argument("--kind", help="only this folder (grounds, props, photos, marks, type, fx, frames)")
    ap.add_argument("--force", action="store_true", help="rebuild even if the files exist")
    ap.add_argument("--width", type=int, default=960, help="preview width")
    args = ap.parse_args()
    man = json.loads(Path(args.manifest).read_text())
    man["_path"] = _rel(Path(args.manifest))
    ctx = Ctx(man)
    assets = man["assets"]
    ids = [a["id"] for a in assets]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        sys.exit(f"duplicate ids: {sorted(dup)}")
    for a in assets:
        if a["kind"] not in KINDS:
            sys.exit(f"{a['id']}: unknown kind {a['kind']}")
    sel = assets
    if args.only:
        want = set(args.only.split(","))
        sel = [a for a in assets if a["id"] in want]
        missing = want - {a["id"] for a in sel}
        if missing:
            sys.exit(f"unknown ids: {sorted(missing)}")
    if args.kind:
        sel = [a for a in sel if a["kind"] == args.kind]
    if args.cmd == "preview":
        preview(ctx, args.frames, args.width)
        return
    if args.cmd == "clean":
        clean(ctx, assets)
        return
    if args.cmd in ("all", "build"):
        build(ctx, sel, args.force)
    if args.cmd in ("all", "catalog", "sheets"):
        cat = catalog(ctx, assets)
        if args.cmd in ("all", "sheets"):
            sheets(ctx, cat)


if __name__ == "__main__":
    main()
