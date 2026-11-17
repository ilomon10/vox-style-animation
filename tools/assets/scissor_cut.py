"""Hand-scissored paper cut-out: alpha/mask -> dilated margin -> contour -> straight 'snips' polygon.

Needs numpy, Pillow and contourpy (all in tools/requirements.txt).  Tested 2026-11-13.
Run with:  tools/py tools/assets/scissor_cut.py <cut.png with alpha | mask.png> <out_prefix> [margin_px] [snip_px] [seed]
Writes <out_prefix>_scissor.png (RGBA: paper-coloured polygon under the cut-out) and
<out_prefix>_scissor.json (polygon in pixel coords + SVG path, for drawing the paper at render time).
"""
import json
import sys

import contourpy
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

PAPER = (251, 248, 241, 255)


def rdp(points: np.ndarray, eps: float) -> np.ndarray:
    """Ramer-Douglas-Peucker simplification of an open polyline (N,2)."""
    keep = np.zeros(len(points), dtype=bool)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        if b <= a + 1:
            continue
        seg = points[b] - points[a]
        rel = points[a + 1 : b] - points[a]
        norm = np.hypot(*seg) or 1.0
        d = np.abs(seg[0] * rel[:, 1] - seg[1] * rel[:, 0]) / norm
        i = int(np.argmax(d))
        if d[i] > eps:
            m = a + 1 + i
            keep[m] = True
            stack += [(a, m), (m, b)]
    return points[keep]


def main() -> None:
    src, prefix = sys.argv[1], sys.argv[2]
    margin = int(sys.argv[3]) if len(sys.argv) > 3 else 18   # paper left around the object (px)
    snip = float(sys.argv[4]) if len(sys.argv) > 4 else 10.0  # bigger = fewer, longer scissor cuts
    seed = int(sys.argv[5]) if len(sys.argv) > 5 else 1
    im = Image.open(src)
    alpha = im.getchannel("A") if im.mode in ("RGBA", "LA") else im.convert("L")
    pad = margin * 2 + 8
    a = Image.new("L", (alpha.width + 2 * pad, alpha.height + 2 * pad), 0)
    a.paste(alpha, (pad, pad))
    # Rounded dilation: blur then low threshold, and close tiny holes.
    grown = a.filter(ImageFilter.GaussianBlur(margin / 2)).point(lambda v: 255 if v > 12 else 0)
    z = np.asarray(grown, dtype=np.float32) / 255.0
    lines = contourpy.contour_generator(z=z).lines(0.5)
    rng = np.random.default_rng(seed)
    longest = max(len(l) for l in lines)
    polys = []
    for outline in sorted(lines, key=len, reverse=True):
        if len(outline) < max(40, 0.05 * longest):  # skip specks; holes get filled = paper stays inside
            continue
        if np.allclose(outline[0], outline[-1]):
            outline = outline[:-1]
        # Closed ring: split at the point farthest from the start, simplify both halves.
        far = int(np.argmax(np.hypot(*(outline - outline[0]).T)))
        poly = np.vstack([rdp(outline[: far + 1], snip)[:-1], rdp(np.vstack([outline[far:], outline[:1]]), snip)[:-1]])
        polys.append(poly + rng.normal(0, snip * 0.12, poly.shape))  # slightly uneven cuts
    # Anti-aliased fill via 3x supersampling.
    ss = 3
    big = Image.new("L", (a.width * ss, a.height * ss), 0)
    for poly in polys:
        ImageDraw.Draw(big).polygon([(float(x) * ss, float(y) * ss) for x, y in poly], fill=255)
    paper_mask = big.resize(a.size, Image.LANCZOS)
    out = Image.new("RGBA", a.size, (0, 0, 0, 0))
    out.paste(Image.new("RGBA", a.size, PAPER), (0, 0), paper_mask)
    if "A" in im.getbands():  # RGBA or LA cut-out: put the artwork back on top of the paper
        fg = Image.new("RGBA", a.size, (0, 0, 0, 0))
        fg.paste(im.convert("RGBA"), (pad, pad))
        out = Image.alpha_composite(out, fg)
    out.save(prefix + "_scissor.png")
    path = " ".join("M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in p) + " Z" for p in polys)
    with open(prefix + "_scissor.json", "w") as f:
        json.dump({"width": a.width, "height": a.height, "offset": pad,
                   "polygons": [[[round(float(x), 1), round(float(y), 1)] for x, y in p] for p in polys],
                   "svgPath": path}, f)
    print(f"{len(polys)} pieces, {sum(len(p) for p in polys)} snips; wrote {prefix}_scissor.png/.json")


if __name__ == "__main__":
    main()
