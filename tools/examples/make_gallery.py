#!/usr/bin/env python3
"""Render the example gallery and keep its pages in step with the example storyboards.

  tools/py tools/examples/make_gallery.py                   # everything: prepare + preview-render the example projects,
                                                            # cut every GIF, refresh the pages
  tools/py tools/examples/make_gallery.py --only map-route  # one block or starter (by name)
  tools/py tools/examples/make_gallery.py --docs-only       # only refresh the scene JSON and the gallery tables

What it reads:
- `examples/blocks/<block>.md`: a block page. Front matter (`key: value` lines between `---`):
  `block`, `title`, `section`, `recipe`, `summary`, `example: <slug>#<scene id>`,
  and optionally `preview_from` (seconds after the scene start, default 0) and `preview_sec` (default: the scene, max 3.5).
- `examples/starters/<name>.md`: a starter page. Front matter: `name`, `title`, `summary`, `example: <slug>`,
  `reel: <scene>:<from s>:<seconds>, …` (the preview reel, cut in that order).

What it writes:
- `examples/blocks/<block>.gif` (480 px, ≤ 2 MB) and `examples/starters/<name>.gif` (560 px, ≤ 4 MB), 12 fps: the kit
  animates at 12 drawings/s. Colours, width and then frame rate step down until a GIF fits.
  They are cut from `out/gallery/<slug>-preview.mp4`, a render with `"preview": true`. That render drops the finish
  layers that change on every drawing (grain, weave, dust, pulse), which keeps the GIFs small; the picture, the camera
  and the timing are the delivery render's.
- In each block page, the scene's storyboard JSON between `<!-- scene-json -->` and `<!-- /scene-json -->`.
- In `examples/README.md`, the tables between `<!-- starters-gallery -->`/`<!-- blocks-gallery -->` and their closing
  markers.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PY = [str(ROOT / "tools" / "py")]
EX = ROOT / "examples"
OUT = ROOT / "out" / "gallery"
# (max bytes, [(colours, width, fps), ...]): tried in order until the GIF fits; the release audit enforces the caps
LADDER = {
    "block": (2_000_000, [(96, 480, 12), (64, 480, 12), (48, 480, 12), (64, 420, 12), (48, 420, 10)]),
    "starter": (4_000_000, [(96, 560, 12), (64, 560, 12), (64, 480, 12), (48, 480, 10)]),
}


def front_matter(path: Path) -> dict:
    m = re.match(r"^---\n(.*?)\n---\n", path.read_text(encoding="utf-8"), re.S)
    if not m:
        raise SystemExit(f"{path.relative_to(ROOT)}: no front matter")
    out = {}
    for line in m.group(1).splitlines():
        k, sep, v = line.partition(":")
        if sep and k.strip() and not k.startswith(" "):
            out[k.strip()] = v.strip()
    return out


def pages() -> tuple[list[tuple[Path, dict]], list[tuple[Path, dict]]]:
    blocks = [(p, front_matter(p)) for p in sorted((EX / "blocks").glob("*.md"))]
    starters = [(p, front_matter(p)) for p in sorted((EX / "starters").glob("*.md"))]
    return blocks, starters


def run(argv: list[str], what: str) -> None:
    print(f"== {what}", flush=True)
    r = subprocess.run(argv, cwd=ROOT)
    if r.returncode != 0:
        raise SystemExit(f"{what} failed (exit {r.returncode})")


def scene_table(slug: str) -> tuple[dict[str, tuple[int, int]], int]:
    """scene id -> (start, end) frames from the validator's table, and the storyboard fps"""
    out = subprocess.run(PY + ["tools/studio/validate_storyboard.py", slug], cwd=ROOT, capture_output=True, text=True).stdout
    sb = json.loads((ROOT / "video-projects" / slug / "storyboard.json").read_text())
    ids = {s["id"] for s in sb["scenes"]}
    table = {}
    for line in out.splitlines():
        p = line.split()
        if len(p) >= 4 and p[0] in ids and p[2].isdigit() and p[3].isdigit():
            table[p[0]] = (int(p[2]), int(p[3]))
    return table, int(sb.get("fps", 25))


def preview_render(slug: str, force: bool) -> Path:
    """build the project (no delivery render) and render its preview MP4 once"""
    run(PY + ["tools/examples/build_example.py", slug, "--prepare"], f"prepare {slug}")
    mp4 = OUT / f"{slug}-preview.mp4"
    pub = ROOT / "public" / "projects" / slug
    newest = max((f.stat().st_mtime for f in pub.glob("*") if f.is_file()), default=0)
    if force or not mp4.exists() or mp4.stat().st_mtime < newest:
        OUT.mkdir(parents=True, exist_ok=True)
        run([str(ROOT / "tools" / "remotion-locked.sh"), "render", "src/index.ts", "StoryboardVideo", str(mp4),
             "--props=" + json.dumps({"project": slug, "preview": True})], f"preview render {slug}")
    return mp4


def encode_gif(src: Path, segments: list[tuple[float, float]], dst: Path, kind: str) -> int:
    """cut [(start s, seconds)] from src, join them, and write an optimised GIF; step down the ladder until it fits"""
    limit, ladder = LADDER[kind]
    for colors, width, fps in ladder:
        parts = "".join(f"[0:v]trim=start={a:.3f}:duration={d:.3f},setpts=PTS-STARTPTS[v{i}];" for i, (a, d) in enumerate(segments))
        joined = "".join(f"[v{i}]" for i in range(len(segments))) + f"concat=n={len(segments)}:v=1:a=0"
        graph = (f"{parts}{joined},fps={fps},scale={width}:-1:flags=lanczos,split[a][b];"
                 f"[a]palettegen=max_colors={colors}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-filter_complex", graph, "-loop", "0", str(dst)], check=True)
        size = dst.stat().st_size
        if size <= limit:
            return size
    raise SystemExit(f"{dst.relative_to(ROOT)}: {size / 1e6:.2f} MB at the smallest setting: shorten preview_sec / the reel")


def put_between(text: str, tag: str, body: str) -> str:
    start, end = f"<!-- {tag} -->", f"<!-- /{tag} -->"
    if start not in text or end not in text:
        raise SystemExit(f"missing the markers {start} … {end}")
    a, b = text.index(start) + len(start), text.index(end)
    return text[:a] + "\n" + body.rstrip() + "\n" + text[b:]


def refresh_docs(blocks: list[tuple[Path, dict]], starters: list[tuple[Path, dict]]) -> None:
    for path, fm in blocks:
        slug, _, sid = fm["example"].partition("#")
        sb = json.loads((ROOT / "video-projects" / slug / "storyboard.json").read_text())
        scene = next((s for s in sb["scenes"] if s["id"] == sid), None)
        if scene is None:
            raise SystemExit(f"{path.relative_to(ROOT)}: no scene {sid!r} in video-projects/{slug}/storyboard.json")
        body = "```json\n" + json.dumps(scene, indent=1, ensure_ascii=False) + "\n```"
        path.write_text(put_between(path.read_text(encoding="utf-8"), "scene-json", body), encoding="utf-8")

    def cell(href: str, gif: str, title: str, line2: str, line3: str) -> str:
        return (f'<a href="{href}"><img src="{gif}" width="400" alt="{title}"></a><br>'
                f"<b>{title}</b><br>{line2}<br>{line3}")

    rows = []
    items = [cell(f"starters/{p.name}", f"starters/{p.stem}.gif", fm["title"], fm.get("summary", ""),
                  f"<code>video-projects/{fm['example']}</code>") for p, fm in starters]
    for i in range(0, len(items), 2):
        pair = items[i:i + 2] + [""] * (2 - len(items[i:i + 2]))
        rows.append(f"| {pair[0]} | {pair[1]} |")
    starters_md = "| | |\n|---|---|\n" + "\n".join(rows)
    rows = []
    items = [cell(f"blocks/{p.name}", f"blocks/{p.stem}.gif", fm["title"], f"{fm['section']} · <code>{fm['recipe']}</code>",
                  f"<code>[block: {fm['block']}]</code>") for p, fm in blocks]
    for i in range(0, len(items), 2):
        pair = items[i:i + 2] + [""] * (2 - len(items[i:i + 2]))
        rows.append(f"| {pair[0]} | {pair[1]} |")
    blocks_md = "| | |\n|---|---|\n" + "\n".join(rows)
    readme = EX / "README.md"
    text = put_between(readme.read_text(encoding="utf-8"), "starters-gallery", starters_md)
    readme.write_text(put_between(text, "blocks-gallery", blocks_md), encoding="utf-8")
    print(f"pages refreshed: {len(blocks)} blocks, {len(starters)} starters, examples/README.md")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", help="one block or starter name")
    ap.add_argument("--docs-only", action="store_true")
    ap.add_argument("--force", action="store_true", help="re-render the preview MP4s even when they are current")
    a = ap.parse_args()
    blocks, starters = pages()
    for path, fm in blocks:
        for k in ("block", "title", "section", "recipe", "example"):
            if not fm.get(k):
                raise SystemExit(f"{path.relative_to(ROOT)}: front matter needs {k}")
        if fm["block"] != path.stem:
            raise SystemExit(f"{path.relative_to(ROOT)}: block name {fm['block']!r} must match the file name")
    refresh_docs(blocks, starters)
    if a.docs_only:
        return 0

    jobs = []  # (dst gif, slug, [(scene, from, seconds)])
    for path, fm in blocks:
        if a.only and a.only != fm["block"]:
            continue
        slug, _, sid = fm["example"].partition("#")
        frm = float(fm.get("preview_from", 0))
        jobs.append((path.with_suffix(".gif"), slug, [(sid, frm, float(fm["preview_sec"]) if fm.get("preview_sec") else None)], "block"))
    for path, fm in starters:
        if a.only and a.only != fm.get("name", path.stem):
            continue
        reel = []
        for seg in fm.get("reel", "").split(","):
            sid, frm, sec = (seg.strip().split(":") + ["0", "2"])[:3]
            if sid:
                reel.append((sid, float(frm), float(sec)))
        jobs.append((path.with_suffix(".gif"), fm["example"], reel, "starter"))
    if not jobs:
        raise SystemExit(f"nothing matches --only {a.only}")

    renders, tables = {}, {}
    for _, slug, _, _ in jobs:
        if slug not in renders:
            renders[slug] = preview_render(slug, a.force)
            tables[slug] = scene_table(slug)
    total = 0
    for dst, slug, segs, kind in jobs:
        table, fps = tables[slug]
        cut = []
        for sid, frm, sec in segs:
            if sid not in table:
                raise SystemExit(f"{dst.relative_to(ROOT)}: scene {sid!r} not in {slug}")
            s, e = table[sid]
            length = (e - s) / fps - frm
            cut.append((s / fps + frm, min(sec or 3.5, length)))
        size = encode_gif(renders[slug], cut, dst, kind)
        total += size
        print(f"  {dst.relative_to(ROOT)}  {sum(d for _, d in cut):.1f} s  {size / 1e6:.2f} MB")
    print(f"{len(jobs)} GIFs, {total / 1e6:.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
