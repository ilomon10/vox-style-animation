#!/usr/bin/env python3
"""Collect the catalog's `release` files (AI cut-outs, files contributed by their owners) for the GitHub release.

  tools/py tools/dev/make_release_pack.py            # -> out/release/<tag>/ + SHA256SUMS, and the gh command to run
  tools/py tools/dev/make_release_pack.py --check    # only say which release files are missing or differ

The tag is the last part of the catalog's "release" URL (…/releases/download/library-v1 -> library-v1). Every file is
checked against its catalog facts first, so what users download is exactly what the catalog promises. Publishing is
a separate, deliberate step: run the printed `gh release create/upload` command yourself.
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "library"))
import lib as L  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    cat = L.load()
    tag = cat.get("release", "").rstrip("/").rsplit("/", 1)[-1] or "library-v1"
    items = [x for x in cat["assets"] if x.get("build", {}).get("from") == "release"]
    out = ROOT / "out" / "release" / tag
    problems, sums = [], []
    if not a.check:
        shutil.rmtree(out, ignore_errors=True)
        out.mkdir(parents=True)
    for x in items:
        src = L.local(x)
        ok, how = L.verify(src, x.get("file"))
        if not ok:
            problems.append(f"{x['id']}: {src.relative_to(ROOT)}: {how}")
            continue
        if x["file"].get("sha256") != L.sha256(src):
            problems.append(f"{x['id']}: local file is not byte-identical to the catalog (re-run add.py, or fix the entry)")
            continue
        if not a.check:
            shutil.copyfile(src, out / x["build"]["asset"])
            sums.append(f"{x['file']['sha256']}  {x['build']['asset']}")
    for p in problems:
        print("  !!", p)
    print(f"{len(items)} release files, {len(problems)} problems")
    if a.check or problems:
        return 1 if problems else 0
    (out / "SHA256SUMS").write_text("\n".join(sums) + "\n")
    repo = "ilomon10/vox-style-animation"
    print(f"pack: {out.relative_to(ROOT)} ({len(sums)} files)\n"
          f"publish (only when you mean it):\n"
          f"  gh release create {tag} --repo {repo} --title \"Asset library {tag}\" "
          f"--notes \"Release-only catalog files (AI cut-outs, owner contributions). Licences: public/assets/library/CREDITS.md.\" "
          f"{out.relative_to(ROOT)}/*")
    return 0


if __name__ == "__main__":
    sys.exit(main())
