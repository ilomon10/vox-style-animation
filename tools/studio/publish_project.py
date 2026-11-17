#!/usr/bin/env python3
"""Publish a video project for Remotion: copy what the render needs from video-projects/<slug>/ to public/projects/<slug>/.

  python3 tools/studio/publish_project.py <slug> [--vo scratch|user] [--clean]

Copies (incrementally: size + mtime): storyboard.json, the ACTIVE voice-over + cues from project.json (-> vo.wav, vo.cues.json;
--vo overrides for this publish only: scratch = audio/vo_scratch.wav + audio/vo_scratch.cues.json, user = audio/vo_user.wav +
audio/vo.cues.json), and every project asset / audio file / cue file the storyboard references (`assets/...`, `audio/...`).
`kit:` paths live in public/ (catalogued library files are fetched first when missing). Writes manifest.json. --clean removes published files that are no longer used.
public/projects/ is git-ignored.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from storyboard_common import ROOT, load_json, project_dir, referenced_assets  # noqa: E402


def sync(src, dst):
    """copy if missing / different size / older; returns 'copied' | 'same'"""
    if os.path.exists(dst):
        a, b = os.stat(src), os.stat(dst)
        if a.st_size == b.st_size and int(a.st_mtime) <= int(b.st_mtime):
            return "same"
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    return "copied"


def write_if_changed(path, text):
    """write only when the content differs: an unchanged file keeps its mtime, so renders keyed on it stay current"""
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            if f.read() == text:
                return
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--vo", choices=["scratch", "user"])
    ap.add_argument("--clean", action="store_true")
    a = ap.parse_args()
    pdir = project_dir(a.slug)
    out = os.path.join(ROOT, "public", "projects", a.slug)
    if not os.path.isdir(pdir):
        sys.exit(f"no such project: {pdir}")
    proj = load_json(os.path.join(pdir, "project.json")) if os.path.exists(os.path.join(pdir, "project.json")) else {}
    sb_path = os.path.join(pdir, "storyboard.json")
    if not os.path.exists(sb_path):
        sys.exit(f"{sb_path} missing")
    sb = load_json(sb_path)

    if a.vo == "scratch":
        vo, cues, src = os.path.join(pdir, "audio", "vo_scratch.wav"), os.path.join(pdir, "audio", "vo_scratch.cues.json"), "scratch"
    elif a.vo == "user":
        vo, cues, src = os.path.join(pdir, "audio", "vo_user.wav"), os.path.join(pdir, "audio", "vo.cues.json"), "user"
    else:
        vo = os.path.join(ROOT, proj.get("vo", f"video-projects/{a.slug}/audio/vo_scratch.wav"))
        cues = os.path.join(ROOT, proj.get("cues", f"video-projects/{a.slug}/audio/vo.cues.json"))
        src = proj.get("voSource", "scratch")
    # kit: files of the shared asset catalog are downloaded (or generated) on demand
    kit_missing = [r for r in referenced_assets(sb) if r.startswith("kit:") and not os.path.exists(os.path.join(ROOT, "public", r[4:]))]
    if kit_missing:
        print(f"{len(kit_missing)} kit file(s) not on disk: tools/library/fetch.py --for-project {a.slug}")
        subprocess.run([os.path.join(ROOT, "tools", "py"), os.path.join(ROOT, "tools", "library", "fetch.py"), "--for-project", a.slug],
                       cwd=ROOT, check=False)
    # SFX given as file paths: when a sidecar `<file>.json` with `peak_s` sits next to the clip (make_sfx.py,
    # extract_sfx.py), publish its peak offset as `peakSec` so the storyboard places the PEAK on the anchor.
    for x in sb.get("sfx", []) or []:
        srcp = x.get("src", "")
        if "peakSec" in x or not any(c in srcp for c in "/.") or x.get("peak") is False:
            continue
        base = os.path.join(ROOT, "public", srcp[4:]) if srcp.startswith("kit:") else os.path.join(pdir, srcp)
        side = os.path.splitext(base)[0] + ".json"
        if os.path.exists(side):
            pk = load_json(side).get("peak_s")
            if pk is not None:
                x["peakSec"] = pk
    jobs = [(vo, os.path.join(out, "vo.wav")), (cues, os.path.join(out, "vo.cues.json"))]
    missing = [s for s, _ in jobs if not os.path.exists(s)]
    if missing:
        sys.exit("missing source files: " + ", ".join(os.path.relpath(m, ROOT) for m in missing))
    warn = []
    for rel in referenced_assets(sb):
        if rel.startswith("kit:"):
            if not os.path.exists(os.path.join(ROOT, "public", rel[4:])):
                warn.append(f"kit asset not found: public/{rel[4:]}")
            continue
        s = os.path.join(pdir, rel)
        if os.path.exists(s):
            jobs.append((s, os.path.join(out, rel)))  # video footage (mp4 / webm / mov) is copied like any other asset
        else:
            warn.append(f"asset not found (renders as a placeholder): {rel}")
    n = 0
    keep = set()
    os.makedirs(out, exist_ok=True)
    sb_out = os.path.join(out, "storyboard.json")
    write_if_changed(sb_out, json.dumps(sb, indent=1))  # written (not copied): carries the SFX peak offsets added above
    keep.add(os.path.abspath(sb_out))
    for s, d in jobs:
        keep.add(os.path.abspath(d))
        n += sync(s, d) == "copied"
    manifest = {"slug": a.slug, "voSource": src, "vo": os.path.relpath(vo, ROOT), "cues": os.path.relpath(cues, ROOT),
                "files": sorted(os.path.relpath(d, out) for _, d in jobs)}
    mp = os.path.join(out, "manifest.json")
    keep.add(os.path.abspath(mp))
    write_if_changed(mp, json.dumps(manifest, indent=1))
    removed = 0
    if a.clean:
        for dp, _, fs in os.walk(out):
            for fn in fs:
                p = os.path.abspath(os.path.join(dp, fn))
                if p not in keep:
                    os.remove(p)
                    removed += 1
    print(f"published {a.slug} -> {os.path.relpath(out, ROOT)}: {len(jobs)} files ({n} copied, {len(jobs) - n} unchanged{f', {removed} removed' if removed else ''}); VO = {src}")
    for w in warn:
        print("  warning:", w)


if __name__ == "__main__":
    main()
