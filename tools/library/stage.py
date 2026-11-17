#!/usr/bin/env python3
"""Stage candidate images for the library: several searches into one folder, one numbered contact sheet to review.

  tools/py tools/library/stage.py industry "factory workers 1910s" "steel mill" --kind photo --n 6
  tools/py tools/library/stage.py industry --sheet          # only rebuild the sheet + index of what is staged

Runs tools/source/source_images.py for each query with --project out/library-staging/<theme> (public domain and
CC0 only, Commons by default because its licence metadata is explicit), then writes
out/library-staging/<theme>/sheet.jpg (numbered cells) and prints the index: number, sidecar, licence, size, title.
LOOK at the sheet, then add the good ones with tools/library/add.py image <sidecar> --kind ... --theme ... --tags ...
Reject: watermarks, news-agency or stock credits, prominent modern logos, sensitive images of private people,
blurry or tiny scans, duplicates of what the catalog already has (tools/library/search.py).
"""
from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lib as L  # noqa: E402

STAGE = L.ROOT / "out" / "library-staging"


def sheet(theme: str) -> None:
    from PIL import Image, ImageDraw
    d = STAGE / theme / "assets" / "sourced"
    sides = sorted(d.glob("*.json")) if d.exists() else []
    items = []
    for s in sides:
        try:
            m = json.loads(s.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        f = d / m.get("file", "")
        if f.exists() and f.suffix.lower() in L.IMAGE_EXT:
            items.append((s, m, f))
    if not items:
        print("nothing staged")
        return
    cols, cw, ch = 5, 360, 320
    rows = math.ceil(len(items) / cols)
    out = Image.new("RGB", (cols * cw, rows * ch), (50, 50, 50))
    dr = ImageDraw.Draw(out)
    for i, (s, m, f) in enumerate(items):
        im = L._open_image(f)
        if im.format == "JPEG":
            im.draft("RGB", (cw * 2, ch * 2))
        im = im.convert("RGB")
        im.thumbnail((cw - 10, ch - 46))
        x, y = (i % cols) * cw, (i // cols) * ch
        out.paste(im, (x + (cw - im.width) // 2, y + 4))
        dr.rectangle((x, y, x + 34, y + 24), fill=(220, 40, 40))
        dr.text((x + 6, y + 6), str(i + 1), fill=(255, 255, 255))
        dr.text((x + 6, y + ch - 40), m.get("title", "")[:52], fill=(255, 255, 255))
        dr.text((x + 6, y + ch - 24), f"{m.get('license')} {m.get('width')}x{m.get('height')} {m.get('source')}", fill=(230, 210, 120))
    p = STAGE / theme / "sheet.jpg"
    out.save(p, quality=86)
    print(f"sheet: {p}")
    for i, (s, m, f) in enumerate(items):
        print(f"{i + 1:3d}  {s.relative_to(L.ROOT)}  {m.get('license')}  {m.get('width')}x{m.get('height')}  {m.get('title', '')[:90]}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("theme")
    ap.add_argument("queries", nargs="*")
    ap.add_argument("--kind", default="photo", choices=["photo", "portrait", "map", "document", "engraving"])
    ap.add_argument("--n", type=int, default=6)
    ap.add_argument("--min-width", type=int, default=1600)
    ap.add_argument("--source", default="commons", choices=["auto", "commons", "openverse", "nasa", "smithsonian", "loc"])
    ap.add_argument("--licenses", default="pd,cc0")
    ap.add_argument("--commons-width", type=int, default=1920, help="Commons rendition width (standard widths are cached; originals get rate-limited)")
    ap.add_argument("--sheet", action="store_true", help="only rebuild the sheet and the index")
    a = ap.parse_args()
    proj = STAGE / a.theme
    proj.mkdir(parents=True, exist_ok=True)
    if not a.sheet:
        for q in a.queries:
            print(f"== {q}")
            subprocess.run([*L.PY, str(L.ROOT / "tools" / "source" / "source_images.py"), q, "--project", str(proj), "--n", str(a.n),
                            "--min-width", str(a.min_width), "--licenses", a.licenses, "--kind", a.kind, "--source", a.source,
                            "--commons-width", str(a.commons_width)],
                           cwd=L.ROOT, check=False)
    sheet(a.theme)
    return 0


if __name__ == "__main__":
    sys.exit(main())
