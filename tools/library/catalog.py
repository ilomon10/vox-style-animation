#!/usr/bin/env python3
"""Check the asset catalog and write the pages generated from it.

  tools/py tools/library/catalog.py check            # schema, licences, ids, paths, recipes (no network, no files)
  tools/py tools/library/catalog.py check --files    # + verify every file that is present locally
  tools/py tools/library/catalog.py check --online   # + ask every download URL whether it still answers (slow, polite)
  tools/py tools/library/catalog.py build            # CATALOG.md and CREDITS.md from catalog.json
  tools/py tools/library/catalog.py sheets [--kind photos]   # contact sheets of the local images -> out/library-sheets/

Exit code 1 when `check` finds an error.
"""
from __future__ import annotations

import argparse
import collections
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lib as L  # noqa: E402

REQUIRED = ("id", "kind", "path", "title", "tags", "license", "license_name", "build")
PATH_RE = re.compile(r"^(assets|audio|textures)/[A-Za-z0-9._/-]+\.[a-z0-9]{2,7}$")
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,79}$")


def check(cat: dict, files: bool, online: bool) -> int:
    errors, warns = [], []
    ids, paths = collections.Counter(), collections.Counter()
    known = {a.get("id") for a in cat.get("assets", [])}
    for a in cat.get("assets", []):
        aid = a.get("id", "?")
        e = lambda m: errors.append(f"{aid}: {m}")  # noqa: E731
        for k in REQUIRED:
            if not a.get(k):
                e(f"missing {k}")
        if not ID_RE.match(aid):
            e("id must be lowercase letters, digits and dashes")
        ids[aid] += 1
        for p in [a.get("path", ""), *a.get("files", [])]:
            paths[p] += 1
            if not PATH_RE.match(p) or ".." in p.split("/"):
                e(f"bad path {p!r}")
        if a.get("kind") not in L.KINDS:
            e(f"unknown kind {a.get('kind')!r}")
        lic = a.get("license")
        if lic not in L.ALLOWED:
            e(f"licence {lic!r} is not allowed in the shared library (only {', '.join(sorted(L.ALLOWED))})")
        elif lic == "by" and a.get("kind") not in L.BY_KINDS:
            e("CC BY is only accepted for music and SFX; images must be public domain or CC0")
        if lic not in L.NO_ATTRIBUTION and not a.get("attribution"):
            e("needs an attribution line")
        b = a.get("build") or {}
        kind = b.get("from", "download")
        src = a.get("source") or {}
        if kind not in L.BUILD_FROM:
            e(f"unknown build.from {kind!r}")
        if kind in ("download", "release") and not src.get("page"):
            e("needs source.page (where a person can check the licence)")
        if kind == "download" and not src.get("url"):
            e("needs source.url")
        if kind in ("generate", "script") and not b.get("cmd"):
            e("needs build.cmd")
        if kind == "release" and not b.get("asset"):
            e("needs build.asset")
        for n in b.get("needs", []) + (b.get("rebuild") or {}).get("needs", []):
            if n not in known:
                e(f"needs unknown id {n!r}")
        for s in b.get("steps", []):
            if s.partition(":")[0] not in ("zip", "pdfpage", "crop", "resize", "gray", "jpeg", "png", "wav48k", "mono",
                                           "trim", "mp4", "mute"):
                e(f"unknown step {s!r}")
        if kind in ("download", "release") and not (a.get("file") or {}).get("sha256"):
            e("needs file facts (bytes, sha256): build it once with add.py")
        if not isinstance(a.get("tags"), list):
            e("tags must be a list")
        if files and L.local(a).exists():
            ok, how = L.verify(L.local(a), a.get("file"))
            if not ok:
                errors.append(f"{aid}: local file {a['path']}: {how}")
        if online and kind == "download" and src.get("url"):
            ok, how = L.head_ok(src["url"])
            if not ok:
                (warns if src.get("alt") else errors).append(f"{aid}: {src['url']} answers {how}  [page: {src.get('page')}]")
    for k, n in ids.items():
        if n > 1:
            errors.append(f"duplicate id {k}")
    for k, n in paths.items():
        if n > 1:
            errors.append(f"duplicate path {k}")
    # files in the library folder that no entry claims
    claimed = {L.PUBLIC / p for p in paths}
    if L.LIB.exists():
        for f in L.LIB.rglob("*"):
            if f.is_file() and f.suffix not in (".md", ".json", ".part") and not f.name.startswith(".") and f not in claimed:
                warns.append(f"not in the catalog: {f.relative_to(L.PUBLIC)}")
    for w in warns:
        print(f"  warn  {w}")
    for x in errors:
        print(f"  ERROR {x}")
    n = len(cat.get("assets", []))
    print(f"catalog: {n} entries, {len(errors)} errors, {len(warns)} warnings")
    return 1 if errors else 0


def build(cat: dict) -> None:
    A = cat["assets"]
    by_kind = collections.defaultdict(lambda: collections.defaultdict(list))
    for a in A:
        by_kind[a["kind"]][L.theme_of(a)].append(a)
    lic = collections.Counter(a["license"] for a in A)
    lines = [
        "# Asset library: catalog", "",
        "Generated from `catalog.json` by `tools/library/catalog.py build`. Do not edit by hand.", "",
        f"{len(A)} entries: " + ", ".join(f"{k} {sum(len(v) for v in by_kind[k].values())}" for k in L.KINDS if k in by_kind)
        + ". Licences: " + ", ".join(f"{L.LICENSE_NAMES.get(k, k)} {n}" for k, n in lic.most_common()) + ".", "",
        "- **Find:** `tools/py tools/library/search.py <words>` (`--kind`, `--era`, `--fetch`).",
        "- **Get:** `tools/py tools/library/fetch.py --ids <id>[,<id>…]` downloads it from its source into `public/<path>`.",
        "- **Use:** in a storyboard `\"kit:<path>\"`; in code `staticFile(\"<path>\")`. Credit lines: [CREDITS.md](CREDITS.md).", "",
    ]
    for k in L.KINDS:
        if k not in by_kind:
            continue
        lines += [f"## {k} ({sum(len(v) for v in by_kind[k].values())})", ""]
        for theme in sorted(by_kind[k]):
            items = sorted(by_kind[k][theme], key=lambda a: a["id"])
            lines += [f"### {theme}", "", "| id | what | era | licence | size | tags | path |", "|---|---|---|---|---|---|---|"]
            for a in items:
                f = a.get("file") or {}
                size = f"{f['w']}×{f['h']}" if f.get("w") else (f"{f['duration_s']:.1f} s" if f.get("duration_s") else "")
                title = a["title"].replace("|", "/")
                if len(title) > 90:
                    title = title[:87] + "…"
                lines.append(f"| `{a['id']}` | {title} | {a.get('era', '')} | {a['license_name']} | {size} | "
                             f"{', '.join(a.get('tags', [])[:6])} | `{a['path']}` |")
            lines.append("")
    (L.LIB / "CATALOG.md").write_text("\n".join(lines), encoding="utf-8")

    req = [a for a in A if a["license"] not in L.NO_ATTRIBUTION]
    free = [a for a in A if a["license"] in L.NO_ATTRIBUTION and a.get("build", {}).get("from") in ("download", "release")]
    gen = [a for a in A if a.get("build", {}).get("from") in ("generate", "script") and a["license"] in L.NO_ATTRIBUTION]
    c = ["# Asset library: credits", "",
         "Generated from `catalog.json` by `tools/library/catalog.py build`. Do not edit by hand.", ""]
    c += ["## Attribution required", "",
          "Put the line in the video description (or the end credits) when the video uses the file.", ""]
    c += [f"- `{a['path']}`: {L.attribution_line(a)}" for a in sorted(req, key=lambda a: a["path"])] or ["(none)"]
    c += ["", "## Public domain and CC0 (no attribution required; a credit is still good practice)", ""]
    c += [f"- `{a['path']}`: {L.attribution_line(a)}" + (f" Public-domain basis: {a['pd_basis']}" if a.get("pd_basis") else "")
          for a in sorted(free, key=lambda a: a["path"])] or ["(none)"]
    c += ["", "## Generated by this repository (CC0)", ""]
    c += [f"- `{a['path']}`: {a['title']} (`{a['build']['cmd'] if isinstance(a['build']['cmd'], str) else ' '.join(a['build']['cmd'])}`)"
          for a in sorted(gen, key=lambda a: a["path"])] or ["(none)"]
    (L.LIB / "CREDITS.md").write_text("\n".join(c) + "\n", encoding="utf-8")
    print(f"wrote {L.LIB / 'CATALOG.md'} and {L.LIB / 'CREDITS.md'} ({len(A)} entries)")


def sheets(cat: dict, kind: str | None) -> None:
    from PIL import Image, ImageDraw
    out = L.ROOT / "out" / "library-sheets"
    out.mkdir(parents=True, exist_ok=True)
    groups = collections.defaultdict(list)
    for a in cat["assets"]:
        if (kind and a["kind"] != kind) or L.local(a).suffix.lower() not in L.IMAGE_EXT or not L.local(a).exists():
            continue
        groups[f"{a['kind']}-{L.theme_of(a)}"].append(a)
    cw, ch, cols = 300, 260, 6
    for g, items in sorted(groups.items()):
        for s in range(0, len(items), cols * 5):
            chunk = items[s:s + cols * 5]
            rows = (len(chunk) + cols - 1) // cols
            sheet = Image.new("RGB", (cols * cw, rows * ch), (58, 58, 58))
            d = ImageDraw.Draw(sheet)
            for i, a in enumerate(chunk):
                im = L._open_image(L.local(a))
                if im.format == "JPEG":
                    im.draft("RGB", (cw * 2, ch * 2))
                im = im.convert("RGBA")
                im.thumbnail((cw - 10, ch - 40))
                x, y = (i % cols) * cw, (i // cols) * ch
                checker = Image.new("RGBA", im.size, (150, 150, 150, 255))
                checker.alpha_composite(im)
                sheet.paste(checker.convert("RGB"), (x + (cw - im.width) // 2, y + 5))
                d.text((x + 6, y + ch - 30), a["id"][:44], fill=(255, 255, 255))
                d.text((x + 6, y + ch - 16), f"{a['license']} {a.get('era', '')}"[:44], fill=(200, 200, 120))
            p = out / f"{g}-{s // (cols * 5) + 1:02d}.jpg"
            sheet.save(p, quality=85)
            print(f"  {p.relative_to(L.ROOT)} ({len(chunk)})")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["check", "build", "sheets"])
    ap.add_argument("--files", action="store_true")
    ap.add_argument("--online", action="store_true")
    ap.add_argument("--kind", choices=L.KINDS)
    a = ap.parse_args()
    cat = L.load()
    if a.cmd == "check":
        return check(cat, a.files, a.online)
    if a.cmd == "build":
        build(cat)
        return 0
    sheets(cat, a.kind)
    return 0


if __name__ == "__main__":
    sys.exit(main())
