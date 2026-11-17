#!/usr/bin/env python3
"""Add entries to the asset catalog (the only way assets get into the shared library).

Every subcommand builds the finished file exactly as fetch.py will (download -> steps), writes it to public/<path>,
records its facts (bytes, sha256, size, fingerprint) and inserts the entry into catalog.json. Licences: images,
maps and footage must be public domain or CC0; music and SFX may also be CC BY (with an attribution line).

  # an image found by tools/source/source_images.py (staged with --project out/library-staging/<theme>)
  add.py image out/library-staging/industry/assets/sourced/commons_x_1a2b3.json --kind photos --theme industry \
      --tags "factory,workers,1910s" [--title ...] [--era 1913] [--region US] [--steps resize:2400,jpeg:86] [--pd-basis ...]

  # a music/SFX candidate found by tools/source/source_music.py (its candidates.json + the candidate id)
  add.py audio out/library-staging/music/audio/music/candidates.json <cid> --kind music --theme calm --tags "piano,slow"

  # anything else with a direct download URL (Natural Earth, ambientCG, Kenney, NASA, archive.org, ...)
  add.py url <download url> --page <licence page> --license cc0 --author "..." --title "..." --kind textures \
      --theme paper --tags "paper,beige" [--steps zip:Paper001_2K_Color.jpg,resize:2048,jpeg:88] [--era ...]

  # an AI cut-out of an entry already in the catalog (published later as a release asset; rebuildable with rembg)
  add.py cutout <source-id> --theme people --title "..." --tags "..." [--crop x,y,w,h] [--model birefnet-portrait]

  # a file the USER OWNS (e.g. cut from their own reference), dedicated CC0 by them; published as a release asset
  add.py promote <file> --owner-confirmed --author "<owner>" --title "..." --kind cutouts --theme ... --tags ...

  add.py remove <id> [--keep-file]
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lib as L  # noqa: E402

PREFIX = {"photos": "photo", "engravings": "engr", "portraits": "portrait", "documents": "doc", "maps": "map",
          "cutouts": "cut", "textures": "tex", "marks": "mark", "sfx": "sfx", "music": "music", "footage": "film",
          "data": "data"}
SITES = {"commons": "Wikimedia Commons", "openverse": "Openverse", "nasa": "NASA Image and Video Library",
         "smithsonian": "Smithsonian Open Access", "loc": "Library of Congress", "archive.org": "Internet Archive",
         "archive": "Internet Archive"}


def fail(msg: str) -> None:
    raise SystemExit(f"add.py: {msg}")


def new_id(cat: dict, kind: str, title: str, want: str | None) -> str:
    ids = {a["id"] for a in cat["assets"]}
    if want:
        if want in ids:
            fail(f"id {want!r} exists")
        return want
    base = f"{PREFIX[kind]}-{L.slug(title, 52)}"
    i, out = 1, base
    while out in ids:
        i += 1
        out = f"{base}-{i}"
    return out


def check_license(lic: str, kind: str) -> None:
    if lic not in L.ALLOWED:
        fail(f"licence {lic!r} is not accepted in the shared library (public domain, CC0; CC BY for sound only)")
    if lic == "by" and kind not in L.BY_KINDS:
        fail("CC BY is accepted only for music and SFX; images, maps and footage must be public domain or CC0")


def final_ext(src_ext: str, steps: list[str]) -> str:
    ext = src_ext.lower()
    for s in steps:
        op = s.partition(":")[0]
        if op == "jpeg":
            ext = ".jpg"
        elif op == "png":
            ext = ".png"
        elif op in ("wav48k", "mono"):
            ext = ".wav"
        elif op == "mp4":
            ext = ".mp4"
        elif op == "pdfpage":
            ext = ".png"
        elif op == "zip":
            ext = Path(s.partition(":")[2]).suffix.lower()
    return ".jpg" if ext == ".jpeg" else ext


def default_steps(kind: str, ext: str) -> list[str]:
    if ext in L.IMAGE_EXT:
        # alpha matters for cut-outs and marks; everything else is a flat picture
        return ["resize:2400", "png"] if kind in ("cutouts", "marks") else ["resize:2400", "jpeg:88"]
    if ext in L.AUDIO_EXT or ext in (".oga", ".ogg", ".opus"):
        return ["wav48k"]
    if ext in L.VIDEO_EXT or ext in (".mpg", ".mpeg", ".avi", ".ogv", ".mkv"):
        return ["mp4:1080"]
    return []


def era_of(date: str) -> str:
    m = re.search(r"\b(1[5-9]\d\d|20[0-4]\d)\b", date or "")
    return m.group(1) if m else ""


# kinds whose works are almost always old: a recent "date" on their Commons page is the upload or scan date
OLD_KINDS = {"engravings", "maps", "documents", "portraits", "textures"}


def era_for(kind: str, title: str, date: str) -> str:
    """the work's year: one in the title wins; a date from 2000 on is dropped for old kinds (pass --era instead)"""
    y = era_of(title)
    if y:
        return y
    y = era_of(date)
    if y and int(y) >= 2000 and kind in OLD_KINDS:
        print(f"  note: {date!r} looks like an upload or scan date, not the work's: no era recorded (pass --era)")
        return ""
    return y


def build_and_place(staged: Path | None, url: str | None, steps: list[str], dst: Path) -> dict:
    work = L.new_workdir()
    try:
        if staged is None:
            staged = L.download_cached(url, work)
        else:
            shutil.copyfile(staged, work / staged.name)
            staged = work / staged.name
        L.check_media(staged)
        built = L.run_steps(staged, steps, work)
        L.check_media(built)
        L.place(built, dst)
    finally:
        shutil.rmtree(work, ignore_errors=True)
    return L.file_facts(dst)


def commit(cat: dict, entry: dict) -> None:
    """append under the catalog lock, to the catalog as it is NOW (the `cat` read at start may be minutes old)"""
    with L.catalog_txn() as fresh:
        if any(x["id"] == entry["id"] for x in fresh["assets"]):
            fail(f"id {entry['id']!r} was added meanwhile; run again with another --id")
        fresh["assets"].append(entry)
    f = entry["file"]
    size = f"{f['w']}x{f['h']}" if f.get("w") else (f"{f.get('duration_s', 0):.1f}s" if f.get("duration_s") else "")
    print(f"added {entry['id']}  {entry['kind']}/{L.theme_of(entry)}  {entry['license']}  {size}  {f['bytes'] / 1e6:.1f} MB")
    print(f"  kit:{entry['path']}")


def base_entry(a, kind: str, title: str) -> dict:
    tags = [t.strip().lower() for t in (a.tags or "").split(",") if t.strip()]
    if not tags:
        fail("give --tags (comma list): they are how people find the asset")
    e = {"id": "", "kind": kind, "path": "", "title": title, "tags": tags}
    for k in ("era", "region", "description", "notes", "pd_basis"):
        v = getattr(a, k.replace("-", "_"), None)
        if v:
            e[k] = v
    if getattr(a, "pack", None):
        e["packs"] = [a.pack]
    return e


def cmd_image(a, cat: dict) -> None:
    side = json.loads(Path(a.sidecar).read_text(encoding="utf-8"))
    staged = Path(a.sidecar).with_name(side["file"])
    lic = side.get("license")
    check_license(lic, a.kind)
    steps = a.steps.split(",") if a.steps else default_steps(a.kind, staged.suffix.lower())
    title = a.title or side.get("title") or staged.stem
    e = base_entry(a, a.kind, title)
    e["id"] = new_id(cat, a.kind, title, a.id)
    e["path"] = f"assets/library/{a.kind}/{L.slug(a.theme, 30)}/{e['id']}{final_ext(staged.suffix, steps)}"
    e.setdefault("era", era_for(a.kind, title, side.get("date", "")))
    e.update(license=lic, license_name=side.get("license_name") or L.LICENSE_NAMES[lic],
             license_url=side.get("license_url") or L.LICENSE_URLS.get(lic, ""), author=side.get("creator", ""))
    e["attribution"] = side.get("attribution", "")
    src = side.get("source", "")
    e["source"] = {"site": SITES.get(src, src), "page": side.get("source_page", ""), "url": side.get("file_url", ""),
                   "retrieved": side.get("retrieved") or time.strftime("%Y-%m-%d")}
    if side.get("note"):
        e["notes"] = (e.get("notes", "") + " " + side["note"]).strip()
    e["build"] = {"from": "download", "steps": steps}
    e["file"] = build_and_place(staged, None, steps, L.PUBLIC / e["path"])
    commit(cat, {k: v for k, v in e.items() if v not in ("", None, [])})


def cmd_audio(a, cat: dict) -> None:
    cands = json.loads(Path(a.candidates).read_text(encoding="utf-8"))
    c = next((x for x in cands if x.get("id") == a.cid), None)
    if not c:
        fail(f"no candidate {a.cid!r} in {a.candidates}")
    lic = c.get("lic")
    check_license(lic, a.kind)
    steps = a.steps.split(",") if a.steps else ["wav48k"]
    if a.trim:
        steps.append(f"trim:{a.trim}")
    title = a.title or c.get("title") or a.cid
    e = base_entry(a, a.kind, title)
    e["id"] = new_id(cat, a.kind, title, a.id)
    e["path"] = f"assets/library/{a.kind}/{L.slug(a.theme, 30)}/{e['id']}.wav"
    e.update(license=lic, license_name=c.get("lic_name") or L.LICENSE_NAMES[lic],
             license_url=c.get("lic_url") or L.LICENSE_URLS.get(lic, ""), author=c.get("creator", ""),
             attribution=c.get("attribution", ""))
    src = c.get("source", "")
    e["source"] = {"site": SITES.get(src, src), "page": c.get("page_url", ""), "url": c.get("file_url", ""),
                   "retrieved": time.strftime("%Y-%m-%d")}
    info = c.get("info") or {}
    e["audio"] = {k: info[k] for k in ("bpm", "lufs", "lra", "tempo_spread") if k in info}
    e["build"] = {"from": "download", "steps": steps}
    e["file"] = build_and_place(None, c["file_url"], steps, L.PUBLIC / e["path"])
    commit(cat, {k: v for k, v in e.items() if v not in ("", None, [], {})})


def cmd_url(a, cat: dict) -> None:
    check_license(a.license, a.kind)
    if a.license not in L.NO_ATTRIBUTION and not a.attribution:
        fail("CC BY needs --attribution (the line people paste into their description)")
    ext = Path(a.url.split("?")[0]).suffix.lower()
    steps = a.steps.split(",") if a.steps else default_steps(a.kind, ext)
    e = base_entry(a, a.kind, a.title)
    e["id"] = new_id(cat, a.kind, a.title, a.id)
    e["path"] = f"assets/library/{a.kind}/{L.slug(a.theme, 30)}/{e['id']}{final_ext(ext, steps)}"
    e.update(license=a.license, license_name=a.license_name or L.LICENSE_NAMES[a.license],
             license_url=a.license_url or L.LICENSE_URLS.get(a.license, ""), author=a.author or "")
    if a.attribution:
        e["attribution"] = a.attribution
    e["source"] = {"site": a.site or "", "page": a.page, "url": a.url, "retrieved": time.strftime("%Y-%m-%d")}
    if a.alt:
        e["source"]["alt"] = a.alt.split(",")
    e["build"] = {"from": "download", "steps": steps}
    e["file"] = build_and_place(None, a.url, steps, L.PUBLIC / e["path"])
    if a.kind == "sfx" and e["path"].endswith(".wav"):  # peak sidecar for SfxAtPeak
        side = L.sfx_sidecar(L.PUBLIC / e["path"], e["path"], a.title)
        e["files"] = [str(side.relative_to(L.PUBLIC))]
    if a.kind == "music":
        e["audio"] = music_facts(L.PUBLIC / e["path"])
    commit(cat, {k: v for k, v in e.items() if v not in ("", None, [])})


def music_facts(path: Path) -> dict:
    """tempo, loudness and stability of a music bed (tools/source/source_music.py analysis: first 3 minutes)"""
    sys.path.insert(0, str(L.ROOT / "tools" / "source"))
    import source_music as sm  # noqa: PLC0415
    info = sm.analyse(str(path), sm.probe_duration(str(path)))
    return {k: info[k] for k in ("duration", "bpm", "tempo_spread", "lufs", "lra", "mid_share_db") if k in info}


def cmd_cutout(a, cat: dict) -> None:
    ids = L.by_id(cat)
    if a.source not in ids:
        fail(f"unknown source id {a.source!r}")
    src = ids[a.source]
    if not L.local(src).exists():
        fail(f"fetch the source first: tools/py tools/library/fetch.py --ids {a.source}")
    title = a.title or f"{src['title']} (cut-out)"
    e = base_entry(a, "cutouts", title)
    e["id"] = new_id(cat, "cutouts", title, a.id)
    e["path"] = f"assets/library/cutouts/{L.slug(a.theme, 30)}/{e['id']}.png"
    for k in ("license", "license_name", "license_url", "author", "attribution", "era", "region", "pd_basis"):
        if src.get(k) and k not in e:
            e[k] = src[k]
    e["source"] = dict(src.get("source") or {})
    e["derived_from"] = src["id"]
    cmd = f"tools/assets/ai_cutout.py public/{src['path']} public/{e['path']} --model {a.model}" + (f" --crop {a.crop}" if a.crop else "")
    import subprocess
    (L.PUBLIC / e["path"]).parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([*L.PY, *cmd.split()], cwd=L.ROOT, check=True)
    e["build"] = {"from": "release", "asset": f"{e['id']}.png",
                  "rebuild": {"cmd": cmd, "needs": [src["id"]], "requires": f"rembg model {a.model}"}}
    e["file"] = L.file_facts(L.PUBLIC / e["path"])
    commit(cat, e)


def cmd_promote(a, cat: dict) -> None:
    if not a.owner_confirmed:
        fail("--owner-confirmed is required: only a file the user owns (and dedicates CC0) can enter the shared library")
    f = Path(a.file)
    if not f.exists():
        fail(f"no file {f}")
    e = base_entry(a, a.kind, a.title)
    e["id"] = new_id(cat, a.kind, a.title, a.id)
    e["path"] = f"assets/library/{a.kind}/{L.slug(a.theme, 30)}/{e['id']}{f.suffix.lower()}"
    e.update(license="cc0", license_name="CC0 1.0", license_url=L.LICENSE_URLS["cc0"], author=a.author)
    e["source"] = {"site": "contributed to this repository", "page": a.page or "https://creativecommons.org/publicdomain/zero/1.0/",
                   "retrieved": time.strftime("%Y-%m-%d")}
    e["pd_basis"] = f"dedicated to the public domain (CC0) by its owner, {a.author}"
    e["build"] = {"from": "release", "asset": f"{e['id']}{f.suffix.lower()}"}
    dst = L.PUBLIC / e["path"]
    dst.parent.mkdir(parents=True, exist_ok=True)
    L.check_media(f)
    shutil.copyfile(f, dst)
    e["file"] = L.file_facts(dst)
    commit(cat, e)


def cmd_remove(a, cat: dict) -> None:
    ids = L.by_id(cat)
    if a.rid not in ids:
        fail(f"unknown id {a.rid!r}")
    x = ids[a.rid]
    users = [y["id"] for y in cat["assets"] if a.rid in (y.get("build", {}).get("needs", []) + (y.get("build", {}).get("rebuild") or {}).get("needs", []))]
    if users:
        fail(f"{a.rid} is needed by {', '.join(users)}")
    with L.catalog_txn() as fresh:
        fresh["assets"] = [y for y in fresh["assets"] if y["id"] != a.rid]
    if not a.keep_file:
        for p in L.all_files(x):
            if p.exists() and L.LIB in p.parents:
                p.unlink()
    print(f"removed {a.rid}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    def common(p, kind=True):
        if kind:
            p.add_argument("--kind", required=True, choices=L.KINDS)
        p.add_argument("--theme", required=True, help="folder under the kind: industry, people, paper, calm, ...")
        p.add_argument("--tags", required=True)
        p.add_argument("--title")
        p.add_argument("--id")
        p.add_argument("--era")
        p.add_argument("--region")
        p.add_argument("--description")
        p.add_argument("--notes")
        p.add_argument("--pd-basis", dest="pd_basis")
        p.add_argument("--pack")

    p = sub.add_parser("image"); p.add_argument("sidecar"); common(p); p.add_argument("--steps")
    p = sub.add_parser("audio"); p.add_argument("candidates"); p.add_argument("cid"); common(p); p.add_argument("--steps"); p.add_argument("--trim")
    p = sub.add_parser("url"); p.add_argument("url"); common(p); p.add_argument("--steps")
    p.add_argument("--page", required=True); p.add_argument("--license", required=True, choices=sorted(L.ALLOWED))
    p.add_argument("--license-name"); p.add_argument("--license-url"); p.add_argument("--author"); p.add_argument("--attribution")
    p.add_argument("--site"); p.add_argument("--alt", help="comma list of mirror URLs")
    p = sub.add_parser("cutout"); p.add_argument("source"); common(p, kind=False)
    p.add_argument("--crop"); p.add_argument("--model", default="isnet-general-use", choices=["isnet-general-use", "birefnet-portrait", "birefnet-general"])
    p = sub.add_parser("promote"); p.add_argument("file"); common(p); p.add_argument("--author", required=True)
    p.add_argument("--owner-confirmed", action="store_true"); p.add_argument("--page")
    p = sub.add_parser("remove"); p.add_argument("rid"); p.add_argument("--keep-file", action="store_true")
    a = ap.parse_args()
    if a.cmd != "remove" and getattr(a, "title", None) is None and a.cmd in ("url", "promote"):
        fail("--title is required")
    cat = L.load()
    {"image": cmd_image, "audio": cmd_audio, "url": cmd_url, "cutout": cmd_cutout, "promote": cmd_promote,
     "remove": cmd_remove}[a.cmd](a, cat)


if __name__ == "__main__":
    main()
