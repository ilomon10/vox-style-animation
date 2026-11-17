#!/usr/bin/env python3
"""AI cut-out of a photo or print with rembg: a trimmed RGBA PNG.

  tools/py tools/assets/ai_cutout.py <in> <out.png> [--model isnet-general-use] [--crop x,y,w,h] [--long 2200]

Models (all free for commercial use; weights download on first use into ~/.u2net):
  isnet-general-use   objects, machines, buildings (Apache-2.0, ~180 MB)       default
  birefnet-portrait   people (MIT, ~1 GB)
  birefnet-general    hard general cases (MIT, ~1 GB)
Never rembg's default `bria-rmbg` (RMBG licence: non-commercial).
The output is cropped to the alpha bounding box (+4 px) and shrunk so its long side is at most --long.
"""
from __future__ import annotations

import argparse
import sys

ALLOWED = ("isnet-general-use", "birefnet-portrait", "birefnet-general")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--model", default="isnet-general-use", choices=ALLOWED)
    ap.add_argument("--crop", help="x,y,w,h in source pixels, applied before matting")
    ap.add_argument("--long", type=int, default=2200)
    a = ap.parse_args()
    from PIL import Image
    from rembg import new_session, remove
    Image.MAX_IMAGE_PIXELS = 250_000_000
    im = Image.open(a.src).convert("RGB")
    if a.crop:
        x, y, w, h = (int(v) for v in a.crop.split(","))
        im = im.crop((x, y, x + w, y + h))
    out = remove(im, session=new_session(a.model)).convert("RGBA")
    box = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if not box:
        print("matting found nothing", file=sys.stderr)
        return 1
    m = 4
    box = (max(0, box[0] - m), max(0, box[1] - m), min(out.width, box[2] + m), min(out.height, box[3] + m))
    out = out.crop(box)
    if max(out.size) > a.long:
        s = a.long / max(out.size)
        out = out.resize((round(out.width * s), round(out.height * s)), Image.LANCZOS)
    from pathlib import Path
    Path(a.dst).parent.mkdir(parents=True, exist_ok=True)
    out.save(a.dst, "PNG", optimize=True)
    print(f"{a.dst}: {out.width}x{out.height} ({a.model})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
