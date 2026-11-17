#!/usr/bin/env python3
"""Build an example project from its text alone, then render it (the first-run demo of the framework).

  tools/py tools/examples/build_example.py [slug]              # default slug: example-time-zones; full 1080p MP4
  tools/py tools/examples/build_example.py [slug] --stills     # one still per scene instead (quick look)
  tools/py tools/examples/build_example.py [slug] --scale 2    # 4K
  tools/py tools/examples/build_example.py [slug] --prepare    # steps 1-5 only (make_gallery.py renders its own previews)

Steps:
1. Fetch the catalog files the storyboard uses (`fetch.py --for-project`).
2. Render the project maps its storyboard needs (`make_maps.py region|country`, from `build.json` when present).
3. Make the scratch voice-over and its word cues (`scratch_vo.py`; skipped when they are newer than script.md).
4. `validate_storyboard.py`.
5. `publish_project.py`.
6. Render through the lock (`tools/remotion-locked.sh`) to out/studio/<slug>.mp4, or stills to out/studio/<slug>-<scene>.png.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PY = [str(ROOT / "tools" / "py")]


def run(argv: list[str], what: str) -> None:
    print(f"\n== {what}\n   $ {' '.join(argv)}", flush=True)
    r = subprocess.run(argv, cwd=ROOT)
    if r.returncode != 0:
        raise SystemExit(f"{what} failed (exit {r.returncode})")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", nargs="?", default="example-time-zones")
    ap.add_argument("--stills", action="store_true")
    ap.add_argument("--scale", type=float, default=1)
    ap.add_argument("--prepare", action="store_true", help="fetch, maps, voice-over, validate, publish; no render")
    a = ap.parse_args()
    pdir = ROOT / "video-projects" / a.slug
    if not (pdir / "storyboard.json").exists():
        raise SystemExit(f"no storyboard in {pdir}")
    proj = json.loads((pdir / "project.json").read_text())

    run(PY + ["tools/library/fetch.py", "--for-project", a.slug], "catalog files")

    build = json.loads((pdir / "build.json").read_text()) if (pdir / "build.json").exists() else {}
    for m in build.get("maps", []):
        out = pdir / "assets" / "maps" / m["file"]
        if not out.exists():
            run(PY + ["tools/library/make_maps.py", *m["args"], "--project", a.slug], f"map {m['file']}")

    vo = ROOT / proj.get("vo", f"video-projects/{a.slug}/audio/vo_scratch.wav")
    cues = ROOT / proj.get("cues", f"video-projects/{a.slug}/audio/vo.cues.json")
    script = pdir / proj.get("script", "script.md")
    if proj.get("voSource", "scratch") == "scratch" and (not vo.exists() or not cues.exists() or vo.stat().st_mtime < script.stat().st_mtime):
        run(PY + ["tools/voice/scratch_vo.py", str(script.relative_to(ROOT)), "--voice", proj.get("voice", "am_michael")],
            "scratch voice-over")

    run(PY + ["tools/studio/validate_storyboard.py", a.slug], "validate")
    run(PY + ["tools/studio/publish_project.py", a.slug], "publish")
    if a.prepare:
        return 0

    lock = str(ROOT / "tools" / "remotion-locked.sh")
    props = json.dumps({"project": a.slug})
    out = ROOT / "out" / "studio"
    out.mkdir(parents=True, exist_ok=True)
    if a.stills:
        sb = json.loads((ROOT / "public" / "projects" / a.slug / "storyboard.json").read_text())
        # one still 1.2 s into every scene: resolve the starts with the validator's table
        table = subprocess.run(PY + ["tools/studio/validate_storyboard.py", a.slug], cwd=ROOT, capture_output=True, text=True).stdout
        starts = {}
        for line in table.splitlines():
            parts = line.split()
            if len(parts) >= 4 and parts[0] in {s["id"] for s in sb["scenes"]} and parts[2].isdigit():
                starts[parts[0]] = int(parts[2])
        for sid, f in starts.items():
            frame = f + int(1.2 * sb.get("fps", 25))
            run([lock, "still", "src/index.ts", "StoryboardVideo", str(out / f"{a.slug}-{sid}.png"), f"--frame={frame}",
                 f"--props={props}", f"--scale={a.scale:g}"], f"still {sid} (frame {frame})")
        print(f"\nstills: {out}/{a.slug}-*.png")
    else:
        run([lock, "render", "src/index.ts", "StoryboardVideo", str(out / f"{a.slug}.mp4"), f"--props={props}", f"--scale={a.scale:g}"],
            "render")
        print(f"\nvideo: {out / (a.slug + '.mp4')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
