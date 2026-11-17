#!/usr/bin/env python3
"""Download or build library assets listed in public/assets/library/catalog.json.

  tools/py tools/library/fetch.py                       # = --pack core (what setup.sh runs)
  tools/py tools/library/fetch.py --pack core           # kit test images + cut-outs, textures, SFX kit, demo audio
  tools/py tools/library/fetch.py --ids photo-x,map-y   # these entries
  tools/py tools/library/fetch.py --kind maps --tags world
  tools/py tools/library/fetch.py --for-project <slug>  # every catalogued kit: file the project's storyboard uses
  tools/py tools/library/fetch.py --all                 # everything (music and footage are large)

Options:
  --verify    re-check files that are already present (sha256, or size + fingerprint for images), not just their size
  --force     build again even when the file is present and good
  --rebuild   make `release` items locally (AI cut-outs: needs the rembg models, about 1 GB) instead of downloading them
  --dry-run   only say what would happen

Downloads are untrusted data: each goes into a fresh empty folder under out/tmp/, is checked to be the media its
extension says (images are decoded, audio/video probed by ffprobe), processed by the recorded `steps`, and only then
moved to public/<path>. Exit code 1 when anything failed; the report names the source page so the entry can be fixed.
"""
from __future__ import annotations

import argparse
import json
import re
import shlex
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lib as L  # noqa: E402


def select(cat: dict, a) -> list[dict]:
    ids = L.by_id(cat)
    picked: dict[str, dict] = {}
    if a.all:
        picked = dict(ids)
    if a.pack:
        picked.update({x["id"]: x for x in cat["assets"] if a.pack in x.get("packs", [])})
    if a.ids:
        for i in a.ids.split(","):
            i = i.strip()
            if i not in ids:
                raise SystemExit(f"unknown id {i!r} (search: tools/py tools/library/search.py <words>)")
            picked[i] = ids[i]
    if a.kind or a.tags:
        want = {t.strip().lower() for t in (a.tags or "").split(",") if t.strip()}
        for x in cat["assets"]:
            if a.kind and x["kind"] != a.kind:
                continue
            if want and not want <= {t.lower() for t in x.get("tags", [])}:
                continue
            picked[x["id"]] = x
    if a.for_project:
        sb = L.ROOT / "video-projects" / a.for_project / "storyboard.json"
        if not sb.exists():
            raise SystemExit(f"no storyboard: {sb}")
        used = set(re.findall(r'"kit:((?:assets|audio)/[^"]+)"', sb.read_text(encoding="utf-8")))
        by_path = {}
        for x in cat["assets"]:
            for p in [x["path"], *x.get("files", [])]:
                by_path[p] = x
        missing = sorted(p for p in used if p not in by_path and not (L.PUBLIC / p).exists())
        for p in used:
            if p in by_path:
                picked[by_path[p]["id"]] = by_path[p]
        for p in missing:
            print(f"  ! {p}: used by the storyboard, not in the catalog and not on disk")
    # dependencies first (script / rebuild inputs)
    order: list[dict] = []
    seen: set[str] = set()

    def visit(x: dict) -> None:
        if x["id"] in seen:
            return
        seen.add(x["id"])
        b = x.get("build", {})
        for n in b.get("needs", []) + (b.get("rebuild") or {}).get("needs", []):
            if n in ids:
                visit(ids[n])
        order.append(x)

    for x in picked.values():
        visit(x)
    return order


def state(x: dict, deep: bool) -> tuple[bool, str]:
    ok, how = L.verify(L.local(x), x.get("file"), quick=not deep)
    if ok:
        for p in L.all_files(x)[1:]:
            if not p.exists():
                return False, f"missing {p.relative_to(L.PUBLIC)}"
    return ok, how


def run_cmd(cmd, label: str) -> None:
    argv = shlex.split(cmd) if isinstance(cmd, str) else list(cmd)
    if argv and argv[0].endswith(".py"):
        argv = L.PY + argv
    print(f"  run {label}: {' '.join(argv)}")
    subprocess.run(argv, cwd=L.ROOT, check=True)


def build_download(x: dict) -> str:
    src = x.get("source") or {}
    urls = [u for u in [src.get("url"), *src.get("alt", [])] if u]
    if not urls:
        raise RuntimeError("no download URL")
    seen = {u.split("?", 1)[0] for u in urls}
    for u in L.wikimedia_fallbacks(urls[0]):  # Commons thumbnails: the other host, then the original
        if u not in seen:
            urls.append(u)
            seen.add(u)
    errors = []
    for url in urls:
        work = L.new_workdir()
        try:
            got = L.download_cached(url, work)
            L.check_media(got)
            built = L.run_steps(got, x.get("build", {}).get("steps", []), work)
            L.check_media(built)
            ok, how = L.verify(built, x.get("file"))
            if not ok:
                errors.append(f"{url}: {how}")
                continue
            L.place(built, L.local(x))
            if x["kind"] == "sfx" and x["path"].endswith(".wav"):
                L.sfx_sidecar(L.local(x), x["path"], x.get("title", ""))
            return how
        except Exception as e:  # noqa: BLE001
            errors.append(f"{url}: {str(e)[:160]}")
        finally:
            shutil.rmtree(work, ignore_errors=True)
    raise RuntimeError("; ".join(errors))


def build_release(x: dict, cat: dict, rebuild: bool) -> str:
    b = x["build"]
    if not rebuild:
        base = cat.get("release", "").rstrip("/")
        if base:
            work = L.new_workdir()
            try:
                got = L.download(f"{base}/{b['asset']}", work)
                L.check_media(got)
                ok, how = L.verify(got, x.get("file"))
                if not ok:
                    raise RuntimeError(f"release file differs from the catalog: {how}")
                L.place(got, L.local(x))
                return f"release asset ({how})"
            except Exception as e:  # noqa: BLE001
                err = str(e)[:160]
            finally:
                shutil.rmtree(work, ignore_errors=True)
        else:
            err = "the catalog has no release URL"
        if not b.get("rebuild"):
            raise RuntimeError(err)
        need = (b.get("rebuild") or {}).get("requires", "")
        print(f"  {x['id']}: release download failed ({err}); building it locally instead"
              + (f" ({need}: the first use downloads the model, about 1 GB for birefnet, 180 MB for isnet)" if need else ""))
    rb = b.get("rebuild")
    if not rb:
        raise RuntimeError("no local rebuild recipe")
    run_cmd(rb["cmd"], x["id"])
    ok, how = L.verify(L.local(x), x.get("file"))
    return f"rebuilt locally ({how})" if ok else f"rebuilt locally (differs from the catalog: {how}; fine for use)"


def main() -> int:
    sys.stdout.reconfigure(line_buffering=True)  # progress shows up in logs as it happens
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--pack")
    ap.add_argument("--ids")
    ap.add_argument("--kind", choices=L.KINDS)
    ap.add_argument("--tags")
    ap.add_argument("--for-project")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--verify", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--rebuild", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if not any([a.pack, a.ids, a.kind, a.tags, a.for_project, a.all]):
        a.pack = "core"
    cat = L.load()
    todo = select(cat, a)
    if not todo:
        print("nothing selected")
        return 0
    done_cmds: set[str] = set()
    failed_cmds: set[str] = set()
    failed, counts = [], {"ok": 0, "built": 0}
    for x in todo:
        good, how = state(x, a.verify)
        if good and not a.force:
            counts["ok"] += 1
            if a.verify:
                print(f"  ok      {x['path']}  ({how})")
            continue
        b = x.get("build", {})
        kind = b.get("from", "download")
        if a.dry_run:
            print(f"  would {kind:9s} {x['path']}  ({how})")
            continue
        try:
            if kind == "download":
                how = build_download(x)
            elif kind in ("generate", "script"):
                lost = [n for n in b.get("needs", []) if n in failed]
                if lost:
                    raise RuntimeError(f"needs {', '.join(lost)}, which failed above")
                key = json.dumps(b["cmd"])
                if key in failed_cmds:
                    raise RuntimeError("its build script failed above")
                if key not in done_cmds:  # one script often builds several entries: run it once per fetch
                    done_cmds.add(key)
                    try:
                        run_cmd(b["cmd"], x["id"])
                    except Exception:
                        failed_cmds.add(key)
                        raise
                ok, how = state(x, True)
                if not ok:
                    raise RuntimeError(f"the script ran but {x['path']}: {how}")
            elif kind == "release":
                how = build_release(x, cat, a.rebuild)
            else:
                raise RuntimeError(f"unknown build.from {kind!r}")
            counts["built"] += 1
            print(f"  got     {x['path']}  ({how})")
        except Exception as e:  # noqa: BLE001
            page = (x.get("source") or {}).get("page", "")
            failed.append(x["id"])
            print(f"  FAILED  {x['path']}: {e}{'  [source: ' + page + ']' if page else ''}")
    L.clear_cache()
    print(f"{len(todo)} selected: {counts['ok']} already present, {counts['built']} fetched or built, {len(failed)} failed")
    if failed:
        print("failed ids: " + ",".join(failed))
        print("a busy or rate-limiting host (HTTP 429) usually works again later: "
              f"tools/py tools/library/fetch.py --ids {','.join(failed)}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
