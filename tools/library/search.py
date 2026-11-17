#!/usr/bin/env python3
"""Search the asset catalog; print ready-to-use storyboard paths.

  tools/py tools/library/search.py "factory workers"
  tools/py tools/library/search.py telephone --kind cutouts
  tools/py tools/library/search.py map --era 1880 --fetch          # also download the hits
  tools/py tools/library/search.py whoosh --kind sfx --json

Ranking: a word in the tags counts most, then the title, the id and the era, then the description and notes.
`✓` = the file is already on disk, `↓` = fetch it first (`--fetch`, or tools/library/fetch.py --ids <id>).
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lib as L  # noqa: E402


def norm(w: str) -> str:
    w = w.lower()
    return w[:-1] if len(w) > 3 and w.endswith("s") and not w.endswith("ss") else w


def words(s: str) -> list[str]:
    return [norm(w) for w in re.findall(r"[a-z0-9]+", (s or "").lower())]


def score(a: dict, q: list[str]) -> float:
    fields = [
        (3.0, [w for t in a.get("tags", []) for w in words(t)]),
        (2.0, words(a.get("title", ""))),
        (2.0, words(a["id"])),
        (2.0, words(str(a.get("era", "")))),
        (1.0, words(a.get("region", "")) + words(a.get("kind", "")) + words(L.theme_of(a))),
        (0.7, words(a.get("description", "")) + words(a.get("notes", ""))),
    ]
    total, hit = 0.0, 0
    for w in q:
        best = 0.0
        for wt, ws in fields:
            if w in ws:
                best = max(best, wt)
            elif len(w) >= 4 and any(x.startswith(w) for x in ws):
                best = max(best, wt * 0.5)
        total += best
        hit += best > 0
    if q and hit == len(q):
        total *= 1.5
    return total if hit else 0.0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("query", nargs="*")
    ap.add_argument("--kind", choices=L.KINDS)
    ap.add_argument("--era", help="year or decade prefix, e.g. 1913 or 191")
    ap.add_argument("--license", help="comma list: pd,cc0,by")
    ap.add_argument("--local", action="store_true", help="only files already on disk")
    ap.add_argument("--n", type=int, default=15)
    ap.add_argument("--fetch", action="store_true", help="download the hits that are not on disk")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    cat = L.load()
    q = words(" ".join(a.query))
    lics = {x.strip() for x in a.license.split(",")} if a.license else None
    hits = []
    for x in cat["assets"]:
        if a.kind and x["kind"] != a.kind:
            continue
        if lics and x["license"] not in lics:
            continue
        if a.era and not str(x.get("era", "")).startswith(a.era):
            continue
        if a.local and not L.local(x).exists():
            continue
        s = score(x, q) if q else 1.0
        if s > 0:
            hits.append((s, x))
    hits.sort(key=lambda t: (-t[0], t[1]["id"]))
    hits = hits[: a.n]
    if a.json:
        print(json.dumps([{"score": round(s, 2), "id": x["id"], "kind": x["kind"], "kit": f"kit:{x['path']}",
                           "title": x["title"], "license": x["license"], "attribution_required": x["license"] not in L.NO_ATTRIBUTION,
                           "era": x.get("era"), "tags": x.get("tags", []), "local": L.local(x).exists(),
                           "size": {k: v for k, v in (x.get("file") or {}).items() if k in ("w", "h", "duration_s")}}
                          for s, x in hits], indent=1, ensure_ascii=False))
    else:
        if not hits:
            print("no match (try fewer or broader words, or --kind)")
        for s, x in hits:
            f = x.get("file") or {}
            size = f"{f['w']}x{f['h']}" if f.get("w") else (f"{f['duration_s']:.1f}s" if f.get("duration_s") else "")
            mark = "✓" if L.local(x).exists() else "↓"
            att = " ATTRIBUTION" if x["license"] not in L.NO_ATTRIBUTION else ""
            print(f"{s:5.1f} {mark} {x['kind']:<10} {x['license']:<4} {str(x.get('era', '')):<10} {size:<10} {x['id']}{att}")
            print(f"        kit:{x['path']}")
            print(f"        {x['title'][:110]}")
    if a.fetch:
        need = [x["id"] for _, x in hits if not L.local(x).exists()]
        if need:
            return subprocess.call([*L.PY, str(Path(__file__).with_name("fetch.py")), "--ids", ",".join(need)], cwd=L.ROOT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
