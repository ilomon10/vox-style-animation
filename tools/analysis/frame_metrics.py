#!/usr/bin/env python3
"""Per-frame metrics for every frame of every reference video.

Decodes each source through ffmpeg at 320px wide (rgb24) and writes
analysis/metrics/<id>.csv with one row per decoded frame:

  frame, t            frame index (0-based) and time in seconds
  mad                 mean |gray(f) - gray(f-1)|, 0..255  (motion energy, includes grain)
  mad_lo              same on a 4x4 box-averaged frame (80px wide) -> grain-insensitive;
                      ~0 means the underlying artwork did not move (held frame / stepping)
  hist_l1             L1 distance of 8x8x8 RGB histograms vs previous frame, 0..2 (cut detector)
  luma, luma_std      Rec.709 luma mean / std (0..255)
  sat                 mean HSV saturation (0..1)
  warmth              mean(R) - mean(B) (0..255 scale; >0 = warm cast)
  tx, ty              global translation vs previous frame (px @ 1920-wide equivalent),
                      positive tx = content moved right, ty = content moved down
  zoom                per-frame scale factor estimate (1.0 = none, >1 = push-in)
  rot_deg             per-frame roll estimate in degrees
  pc_conf             phase-correlation peak confidence (0..1, low = unreliable motion)

Global motion uses phase correlation on 4 quadrants -> affine (translation, divergence, curl).

Usage: python3 -I tools/analysis/frame_metrics.py [id ...]
"""
import csv
import json
import os
import subprocess
import sys

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)
SOURCES = load_sources()
W = 320


def probe_size(path):
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=width,height", "-of", "csv=p=0", path], text=True).strip().split("\n")[0]
    w, h = map(int, out.split(",")[:2])
    return w, h


def frames(path, w, h):
    proc = subprocess.Popen([
        "ffmpeg", "-v", "error", "-i", path, "-fps_mode", "passthrough",
        "-vf", f"scale={w}:{h}:flags=area", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE)
    n = w * h * 3
    while True:
        buf = proc.stdout.read(n)
        if len(buf) < n:
            break
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    proc.wait()


def hann2d(h, w):
    return np.outer(np.hanning(h), np.hanning(w)).astype(np.float32)


def phase_corr(a, b, win):
    """Shift (dx, dy) that maps a -> b, with sub-pixel parabolic refinement, plus peak confidence."""
    fa = np.fft.rfft2((a - a.mean()) * win)
    fb = np.fft.rfft2((b - b.mean()) * win)
    r = fb * np.conj(fa)
    r /= np.abs(r) + 1e-9
    c = np.fft.irfft2(r, s=a.shape)
    iy, ix = np.unravel_index(np.argmax(c), c.shape)
    peak = c[iy, ix]
    h, w = c.shape

    def sub(cm, c0, cp):
        d = cm - 2 * c0 + cp
        return 0.0 if abs(d) < 1e-12 else 0.5 * (cm - cp) / d

    dx = ix + sub(c[iy, (ix - 1) % w], peak, c[iy, (ix + 1) % w])
    dy = iy + sub(c[(iy - 1) % h, ix], peak, c[(iy + 1) % h, ix])
    if dx > w / 2:
        dx -= w
    if dy > h / 2:
        dy -= h
    return dx, dy, float(peak)


def main(ids):
    os.makedirs(os.path.join(ROOT, "analysis", "metrics"), exist_ok=True)
    for vid in ids:
        src = SOURCES[vid]
        path = os.path.join(ROOT, src["path"])
        sw, sh = probe_size(path)
        h = int(round(W * sh / sw / 2) * 2)
        qh, qw = h // 2, W // 2
        win = hann2d(qh, qw)
        to1920 = 1920.0 / W
        fps = src["fps"]
        rows = []
        prev_g = prev_hist = prev_lo = None
        for i, f in enumerate(frames(path, W, h)):
            ff = f.astype(np.float32)
            g = ff[..., 0] * 0.2126 + ff[..., 1] * 0.7152 + ff[..., 2] * 0.0722
            mx, mn = ff.max(axis=2), ff.min(axis=2)
            sat = float(np.mean(np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)))
            lo = g[: h // 4 * 4, : W // 4 * 4].reshape(h // 4, 4, W // 4, 4).mean(axis=(1, 3))
            q = (f // 32).astype(np.int32)
            hist = np.bincount((q[..., 0] * 64 + q[..., 1] * 8 + q[..., 2]).ravel(), minlength=512)
            hist = hist / hist.sum()
            row = {
                "frame": i, "t": round(i / fps, 4),
                "luma": round(float(g.mean()), 2), "luma_std": round(float(g.std()), 2),
                "sat": round(sat, 4),
                "warmth": round(float(ff[..., 0].mean() - ff[..., 2].mean()), 2),
            }
            if prev_g is None:
                row.update(mad=0, mad_lo=0, hist_l1=0, tx=0, ty=0, zoom=1, rot_deg=0, pc_conf=0)
            else:
                row["mad"] = round(float(np.abs(g - prev_g).mean()), 3)
                row["mad_lo"] = round(float(np.abs(lo - prev_lo).mean()), 3)
                row["hist_l1"] = round(float(np.abs(hist - prev_hist).sum()), 4)
                shifts = {}
                confs = []
                for name, (y0, x0) in {"tl": (0, 0), "tr": (0, qw), "bl": (qh, 0), "br": (qh, qw)}.items():
                    dx, dy, pk = phase_corr(prev_g[y0:y0 + qh, x0:x0 + qw], g[y0:y0 + qh, x0:x0 + qw], win)
                    shifts[name] = (dx, dy)
                    confs.append(pk)
                dx_l = (shifts["tl"][0] + shifts["bl"][0]) / 2
                dx_r = (shifts["tr"][0] + shifts["br"][0]) / 2
                dy_t = (shifts["tl"][1] + shifts["tr"][1]) / 2
                dy_b = (shifts["bl"][1] + shifts["br"][1]) / 2
                dy_l = (shifts["tl"][1] + shifts["bl"][1]) / 2
                dy_r = (shifts["tr"][1] + shifts["br"][1]) / 2
                dx_t = (shifts["tl"][0] + shifts["tr"][0]) / 2
                dx_b = (shifts["bl"][0] + shifts["br"][0]) / 2
                tx = (dx_l + dx_r) / 2
                ty = (dy_t + dy_b) / 2
                div = ((dx_r - dx_l) / qw + (dy_b - dy_t) / qh) / 2
                curl = ((dy_r - dy_l) / qw - (dx_b - dx_t) / qh) / 2
                row.update(
                    tx=round(tx * to1920, 2), ty=round(ty * to1920, 2),
                    zoom=round(1 + div, 5), rot_deg=round(float(np.degrees(curl)), 3),
                    pc_conf=round(float(np.median(confs)), 3))
            rows.append(row)
            prev_g, prev_hist, prev_lo = g, hist, lo
        out = os.path.join(ROOT, "analysis", "metrics", f"{vid}.csv")
        cols = ["frame", "t", "mad", "mad_lo", "hist_l1", "luma", "luma_std", "sat", "warmth",
                "tx", "ty", "zoom", "rot_deg", "pc_conf"]
        with open(out, "w", newline="") as fh:
            wr = csv.DictWriter(fh, fieldnames=cols)
            wr.writeheader()
            wr.writerows(rows)
        print(f"{vid}: {len(rows)} frames -> {os.path.relpath(out, ROOT)}", flush=True)


if __name__ == "__main__":
    main(sys.argv[1:] or list(SOURCES))
