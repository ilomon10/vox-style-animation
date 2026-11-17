#!/usr/bin/env python3
"""Build the claude.ai skill `vox-director` (plan a video in Claude chat) as an uploadable zip.

  tools/py tools/dev/make_chat_skill.py            # -> out/release/vox-director.zip (+ the folder next to it)
  tools/py tools/dev/make_chat_skill.py --check    # only check chat-skill/vox-director/SKILL.md (the release audit runs this)

The zip holds the folder `vox-director/`:
- `SKILL.md` (from chat-skill/vox-director/);
- `reference/`: the block pages and starters (examples/), the director playbook, docs 13 and 14 of the style guide,
  the storyboard schema, and `catalog-index.tsv` (one line per catalog asset);
- `scripts/board.py` (tools/studio/board.py: the storyboard board, standard library only).

Relative links in the copied pages are rewritten to the repository on GitHub. Upload: claude.ai → Customize → Skills →
"+" → Upload a skill (code execution must be on). Publishing the zip as a release asset is a separate, deliberate
step: the command is printed.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "chat-skill" / "vox-director"
OUT = ROOT / "out" / "release"
REPO = "https://github.com/ilomon10/vox-style-animation"


def check() -> list[str]:
    errs = []
    p = SRC / "SKILL.md"
    if not p.exists():
        return [f"missing {p.relative_to(ROOT)}"]
    m = re.match(r"^---\n(.*?)\n---\n", p.read_text(encoding="utf-8"), re.S)
    fm = dict(re.findall(r"^(\w[\w-]*):\s*(.*)$", m.group(1), re.M)) if m else {}
    if fm.get("name") != SRC.name:
        errs.append(f"SKILL.md name {fm.get('name')!r} must equal the folder name {SRC.name!r}")
    if not re.fullmatch(r"[a-z0-9-]{1,64}", fm.get("name", "")):
        errs.append("name: lowercase letters, digits and hyphens, 64 characters at most")
    d = fm.get("description", "")
    if not d or len(d) > 1024:
        errs.append(f"description must be 1-1024 characters (it has {len(d)})")
    return errs


def absolutise(text: str, page: str) -> str:
    """rewrite relative links of a page copied from `page` (repo-relative) to GitHub URLs"""
    base = Path(page).parent

    def fix(m):
        label, target = m.group(1), m.group(2)
        if re.match(r"^[a-z]+:|^#", target):
            return m.group(0)
        path, _, frag = target.partition("#")
        resolved = (base / path).as_posix()
        parts = []
        for seg in resolved.split("/"):
            if seg == "..":
                parts and parts.pop()
            elif seg not in (".", ""):
                parts.append(seg)
        full = "/".join(parts)
        kind = "raw/main" if full.endswith((".gif", ".png", ".jpg")) else ("tree/main" if not Path(full).suffix else "blob/main")
        return f"[{label}]({REPO}/{kind}/{full}{'#' + frag if frag else ''})"
    return re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", fix, text)


def catalog_index() -> str:
    cat = json.loads((ROOT / "public" / "assets" / "library" / "catalog.json").read_text())
    rows = ["id\tkind\ttheme\tera\tlicence\tkit\ttitle\ttags"]
    for a in sorted(cat["assets"], key=lambda a: (a["kind"], a["id"])):
        theme = a["path"].split("/")[3] if a["path"].startswith("assets/library/") and len(a["path"].split("/")) > 4 else ""
        cells = [a["id"], a["kind"], theme, str(a.get("era", "")), a["license"], f"kit:{a['path']}", a["title"],
                 ", ".join(a.get("tags", []))]
        rows.append("\t".join(c.replace("\t", " ").replace("\n", " ") for c in cells))
    return "\n".join(rows) + "\n"


def build() -> Path:
    stage = OUT / "vox-director"
    shutil.rmtree(stage, ignore_errors=True)
    (stage / "reference" / "blocks").mkdir(parents=True)
    (stage / "reference" / "starters").mkdir(parents=True)
    (stage / "scripts").mkdir(parents=True)
    shutil.copyfile(SRC / "SKILL.md", stage / "SKILL.md")
    copies = [(f"examples/blocks/{p.name}", f"reference/blocks/{p.name}") for p in sorted((ROOT / "examples" / "blocks").glob("*.md"))]
    copies += [(f"examples/starters/{p.name}", f"reference/starters/{p.name}") for p in sorted((ROOT / "examples" / "starters").glob("*.md"))]
    copies += [(".claude/skills/vox-video/DIRECTOR.md", "reference/director.md"),
               ("docs/style-guide/13-story-to-screen.md", "reference/13-story-to-screen.md"),
               ("docs/style-guide/14-production-pipeline.md", "reference/14-production-pipeline.md")]
    for src, dst in copies:
        (stage / dst).write_text(absolutise((ROOT / src).read_text(encoding="utf-8"), src), encoding="utf-8")
    shutil.copyfile(ROOT / "src" / "studio" / "storyboard.schema.json", stage / "reference" / "storyboard.schema.json")
    (stage / "reference" / "catalog-index.tsv").write_text(catalog_index(), encoding="utf-8")
    shutil.copyfile(ROOT / "tools" / "studio" / "board.py", stage / "scripts" / "board.py")
    (stage / "LICENSE.txt").write_text(
        f"vox-director, from {REPO}\nText: CC BY 4.0 (LICENSE-docs.md in the repository). scripts/board.py: MIT (LICENSE).\n"
        "Catalogued assets keep their own terms (catalog.json in the repository). Not affiliated with Vox Media.\n", encoding="utf-8")
    z = OUT / "vox-director.zip"
    z.unlink(missing_ok=True)
    with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(stage.rglob("*")):
            if f.is_file():
                zf.write(f, f.relative_to(OUT).as_posix())
    return z


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    errs = check()
    for e in errs:
        print(f"  !! {e}")
    if errs or a.check:
        print(f"chat skill: {'OK' if not errs else f'{len(errs)} problems'}")
        return 1 if errs else 0
    z = build()
    with zipfile.ZipFile(z) as zf:
        names = zf.namelist()
    print(f"chat skill: {z.relative_to(ROOT)}  {z.stat().st_size / 1e3:.0f} KB, {len(names)} files")
    print("upload: claude.ai → Customize → Skills → + → Upload a skill (Settings → Capabilities: code execution on)")
    print(f"publish (only when you mean it): gh release upload <tag> {z.relative_to(ROOT)} --repo ilomon10/vox-style-animation")
    return 0


if __name__ == "__main__":
    sys.exit(main())
