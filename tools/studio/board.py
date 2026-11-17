#!/usr/bin/env python3
"""The director's board: one self-contained HTML page per video project.

  tools/py tools/studio/board.py <slug> [--open]          # -> out/studio/<slug>-board.html
  python3 board.py --project-dir DIR [--blocks DIR] [--out FILE] [--open]   # outside the repository (the chat skill)

One card per section: its picture, its block and recipe, its timing, its narration, its assets with their state, and
anything missing with a recommendation. The page ends with the research and the credit lines.

Where each picture comes from, in order:
1. a frame of the draft render (`out/studio/<slug>.mp4`), when there is one (needs ffmpeg);
2. a still (`out/studio/<slug>-<scene>.png`, from `build_example.py --stills` or the skill's still loop);
3. the block's text wireframe (`examples/blocks/<block>.md` § Wireframe);
4. a placeholder with the recipe's name.

The page loads nothing from the network (images are data URIs), so it opens from disk, in the Claude Code desktop
Browser pane, or as a published artifact. Standard library only; Pillow, when present, shrinks the pictures.
"""
from __future__ import annotations

import argparse
import base64
import html
import io
import json
import re
import shutil
import subprocess
import sys
import webbrowser
from pathlib import Path

HERE = Path(__file__).resolve()
ROOT = HERE.parents[2] if (HERE.parents[2] / "src" / "studio").exists() else None
RECIPE_BLOCK = {"ColdOpenYear": "cold-open-year", "KeywordCut": "keyword-cut", "GiantWordCard": "giant-word-card",
                "MapRoute": "map-route", "EndCard": "end-card", "PhotoCollageUnfold": "photo-collage",
                "SeriesIdent": "series-ident", "MontageCrane": "montage-crane", "NameCardInterview": "name-card",
                "DocumentHighlight": "document-highlight", "QuoteCard": "quote-card", "FootageClip": "footage-clip"}
SLOT_LABEL = {"hook": "Hook", "context": "Context", "question": "The question", "turn": "The turn", "payoff": "Payoff",
              "evidence": "Evidence", "expert": "A person", "ending": "Ending", "thesis": "Thesis"}


def esc(s) -> str:
    return html.escape(str(s or ""), quote=True)


def block_of(scene: dict) -> str:
    m = re.search(r"\bblock ([a-z0-9-]+)", scene.get("note", ""))
    if m:
        return m.group(1)
    if scene.get("recipe") == "DataChart":
        return "data-bars" if (scene.get("props") or {}).get("mode") == "bars" else "data-counter"
    return RECIPE_BLOCK.get(scene.get("recipe", ""), "")


def wireframe(blocks_dir: Path | None, block: str) -> str | None:
    if not blocks_dir or not block:
        return None
    p = blocks_dir / f"{block}.md"
    if not p.exists():
        return None
    m = re.search(r"## Wireframe.*?```text\n(.*?)\n```", p.read_text(encoding="utf-8"), re.S)
    return m.group(1) if m else None


def data_uri_jpeg(raw: bytes) -> str:
    try:
        from PIL import Image
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        im.thumbnail((560, 560))
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=80)
        return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    except Exception:  # noqa: BLE001  (no Pillow: embed as it is)
        kind = "png" if raw[:4] == b"\x89PNG" else "jpeg"
        return f"data:image/{kind};base64," + base64.b64encode(raw).decode()


def video_frame(video: Path, sec: float) -> bytes | None:
    if not shutil.which("ffmpeg"):
        return None
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(0.0, sec):.2f}", "-i", str(video), "-frames:v", "1",
                        "-vf", "scale=560:-2", "-f", "image2pipe", "-vcodec", "mjpeg", "-"], capture_output=True)
    return r.stdout or None


def script_sections(path: Path) -> list[dict]:
    beat = re.compile(r'^\[BEAT\s+recipe=(\w+)(?:\s+anchor="([^"]*)")?[^\]]*\]')
    out, cur = [], None
    for raw in path.read_text(encoding="utf-8").splitlines() if path.exists() else []:
        t = raw.strip()
        if not t or t.startswith(("#", "//")):
            continue
        m = beat.match(t)
        if m:
            cur = {"recipe": m.group(1), "text": ""}
            out.append(cur)
            continue
        if t.startswith("["):
            continue
        if cur is None:
            cur = {"recipe": "", "text": ""}
            out.append(cur)
        cur["text"] = (cur["text"] + " " + t.replace("*", "")).strip()
    return [s for s in out if s["text"]]


def research_rows(path: Path) -> list[str]:
    if not path.exists():
        return []
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\|\s*(\d+)\s*\|\s*(.*?)\s*\|", line)
        if m:
            rows.append(f"{m.group(1)}. {m.group(2)}")
    return rows


def attribution_lines(path: Path) -> list[str]:
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    m = re.search(r"## Attribution required.*?\n(.*?)(\n## |\Z)", text, re.S)
    return [ln[2:].strip() for ln in (m.group(1) if m else "").splitlines() if ln.startswith("- ")]


def collect(pdir: Path, slug: str, blocks_dir: Path | None) -> dict:
    """the sections, from director.py inside the repository, else from the files alone"""
    sb = json.loads((pdir / "storyboard.json").read_text()) if (pdir / "storyboard.json").exists() else {}
    proj = json.loads((pdir / "project.json").read_text()) if (pdir / "project.json").exists() else {}
    st = None
    if ROOT and (ROOT / "video-projects" / slug).resolve() == pdir.resolve():
        sys.path.insert(0, str(ROOT / "tools" / "studio"))
        try:
            import director  # noqa: PLC0415
            st = director.status(slug)
        except SystemExit:
            st = None
    scenes = sb.get("scenes", [])
    if st:
        sections = st["sections"]
    else:
        spoken = script_sections(pdir / proj.get("script", "script.md"))
        if scenes:
            # no timing here: pair the script's sections with the scenes in order. A section goes to the scene of its
            # recipe; a scene that speaks no line of its own (the series ident sits in a pause) gets none.
            said, j = [], 0
            for sc in scenes:
                if j < len(spoken) and (spoken[j]["recipe"] == sc.get("recipe") or sc.get("recipe") != "SeriesIdent"):
                    said.append(spoken[j]["text"])
                    j += 1
                else:
                    said.append("")
            sections = [{"n": i + 1, "id": sc["id"], "recipe": sc.get("recipe", ""), "block": block_of(sc),
                         "start_s": None, "end_s": None, "narration": said[i],
                         "assets": [], "gaps": [], "recommendations": []} for i, sc in enumerate(scenes)]
        else:
            sections = [{"n": i + 1, "id": None, "recipe": s["recipe"], "block": RECIPE_BLOCK.get(s["recipe"], ""),
                         "start_s": None, "end_s": None, "narration": s["text"], "assets": [], "gaps": [],
                         "recommendations": []} for i, s in enumerate(spoken)]
    notes = {sc["id"]: sc.get("note", "") for sc in scenes}
    for s in sections:
        m = re.search(r"slot=(\w+)", notes.get(s.get("id"), "") or "")
        s["label"] = SLOT_LABEL.get(m.group(1), m.group(1).title()) if m else ""
    return {"sb": sb, "proj": proj, "status": st, "sections": sections,
            "title": (sb.get("title") or proj.get("idea") or slug).split(" (framework example")[0]}


def picture(sec: dict, slug: str, pdir: Path, blocks_dir: Path | None, video: Path | None) -> tuple[str, str]:
    """('img', data-uri) or ('pre', wireframe text) or ('none', recipe)"""
    if video and video.exists() and sec.get("start_s") is not None and sec.get("end_s") is not None:
        raw = video_frame(video, sec["start_s"] + 0.6 * (sec["end_s"] - sec["start_s"]))
        if raw:
            return "img", data_uri_jpeg(raw)
    if ROOT and sec.get("id"):
        still = ROOT / "out" / "studio" / f"{slug}-{sec['id']}.png"
        if still.exists():
            return "img", data_uri_jpeg(still.read_bytes())
    wf = wireframe(blocks_dir, sec.get("block", ""))
    if wf:
        return "pre", wf
    return "none", sec.get("recipe") or "scene"


CSS = """
:root{--bg:#f4f3ef;--card:#ffffff;--ink:#1b1b1f;--muted:#5d5d66;--line:#dcdad3;--accent:#4b54c9;--accent-soft:#e7e8fb;
--warn:#a33a1f;--warn-soft:#fbe9e3;--ok:#2f6b3f;--pre:#f0efe9}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e0e10;--card:#18181c;--ink:#e8e8ea;--muted:#a3a3ad;
--line:#2c2c33;--accent:#8c93ec;--accent-soft:#25264a;--warn:#ff9d80;--warn-soft:#3a201a;--ok:#8fd19e;--pre:#111114}}
:root[data-theme="dark"]{--bg:#0e0e10;--card:#18181c;--ink:#e8e8ea;--muted:#a3a3ad;--line:#2c2c33;--accent:#8c93ec;
--accent-soft:#25264a;--warn:#ff9d80;--warn-soft:#3a201a;--ok:#8fd19e;--pre:#111114}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1180px;margin:0 auto;padding:28px 16px 48px}
h1{font-size:26px;line-height:1.2;margin:0 0 4px}h2{font-size:17px;margin:32px 0 10px}
.sub{color:var(--muted);margin:0 0 18px}
.strip{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}.pill{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:3px 11px;font-size:13px}
.next{background:var(--accent-soft);border-radius:10px;padding:10px 14px;margin:6px 0 22px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:16px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column}
.card.gap{border-color:var(--warn)}
.pic{aspect-ratio:16/9;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden}
.pic img{width:100%;height:100%;object-fit:cover;display:block}
.pic pre{margin:0;color:#d8d8de;background:#101014;font:10.5px/1.25 ui-monospace,Menlo,Consolas,monospace;padding:10px;width:100%;height:100%;overflow:hidden;white-space:pre}
.pic .none{color:#9a9aa5;font-size:14px}
.body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px}
.head{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.num{font-weight:700;color:var(--accent)}
.block{background:var(--accent-soft);color:var(--ink);border-radius:6px;padding:1px 7px;font:12px ui-monospace,Menlo,Consolas,monospace}
.time{color:var(--muted);font-size:13px;margin-left:auto}
.say{margin:0;font-style:italic}.say:empty{display:none}
ul{margin:0;padding-left:18px}li{margin:2px 0}.assets li{font-size:13px;color:var(--muted);overflow-wrap:anywhere}
.st-ok{color:var(--ok)}.st-fetch{color:var(--accent)}.st-missing{color:var(--warn);font-weight:600}
.gaps{background:var(--warn-soft);border-radius:8px;padding:8px 10px;font-size:13px}.gaps b{color:var(--warn)}
.recs li{font-size:13px;overflow-wrap:anywhere}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
.box{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px}.box li{font-size:13.5px}
code{font:12.5px ui-monospace,Menlo,Consolas,monospace;overflow-wrap:anywhere}
footer{color:var(--muted);font-size:13px;margin-top:28px}
"""


def render(slug: str, pdir: Path, blocks_dir: Path | None, video: Path | None) -> str:
    d = collect(pdir, slug, blocks_dir)
    st, sb, proj = d["status"], d["sb"], d["proj"]
    secs = d["sections"]
    dur = max((s["end_s"] for s in secs if s.get("end_s") is not None), default=None)
    pills = [f"{len(secs)} sections"]
    if dur:
        pills.append(f"{dur:.0f} s")
    pills.append(f"look: {sb.get('look', 'voxEarworm')}")
    pills.append(f"mode: {(st or {}).get('mode') or proj.get('mode', 'guided')}")
    if st:
        v = st["voice"]
        pills.append(f"voice: {v['source']} ({v['name']})" if v["source"] else "voice: none yet")
        pills.append("music: " + (", ".join(Path(m["src"]).stem.replace("music-", "") for m in st["music"]) or "none yet"))
        pills.append(f"research: {st['research_facts']} facts")
    cards = []
    for s in secs:
        kind, val = picture(s, slug, pdir, blocks_dir, video)
        pic = (f'<img src="{val}" alt="Section {s["n"]}">' if kind == "img" else
               f"<pre>{esc(val)}</pre>" if kind == "pre" else f'<span class="none">{esc(val)}</span>')
        t = f"{s['start_s']:.1f}–{s['end_s']:.1f} s" if s.get("start_s") is not None else ""
        assets = "".join(f'<li><span class="st-{esc(a["state"])}">{esc(a["state"])}</span> · '
                         f'<code>{esc(Path(a["path"].removeprefix("kit:")).name)}</code></li>' for a in s.get("assets", []))
        gaps = "".join(f"<li>{esc(g)}</li>" for g in s.get("gaps", []))
        recs = "".join(f"<li>{esc(r)}</li>" for r in s.get("recommendations", []))
        label = f'<span>{esc(s["label"])}</span>' if s.get("label") else ""
        cards.append(
            f'<article class="card{" gap" if gaps else ""}"><div class="pic">{pic}</div><div class="body">'
            f'<div class="head"><span class="num">{s["n"]}</span>{label}'
            f'<span class="block">{esc(s.get("block") or s.get("recipe") or "?")}</span><span class="time">{esc(t)}</span></div>'
            f'<p class="say">{esc(s.get("narration"))}</p>'
            + (f'<ul class="assets">{assets}</ul>' if assets else "")
            + (f'<div class="gaps"><b>Missing</b><ul>{gaps}</ul></div>' if gaps else "")
            + (f'<ul class="recs">{recs}</ul>' if recs else "")
            + "</div></article>")
    research = research_rows(pdir / "RESEARCH.md")
    attrib = attribution_lines(pdir / "CREDITS.md")
    nxt = f'<div class="next"><b>Next:</b> {esc(st["next"]["do"])}</div>' if st else ""
    side = []
    if research:
        side.append('<section class="box"><h2>Research</h2><ul>' + "".join(f"<li>{esc(r)}</li>" for r in research) + "</ul></section>")
    if attrib:
        side.append('<section class="box"><h2>Credit lines to paste</h2><ul>' + "".join(f"<li>{esc(a)}</li>" for a in attrib) + "</ul></section>")
    src = "a frame of the draft render" if video and video.exists() else "stills where rendered, else the block wireframes"
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(slug)} board</title><style>{CSS}</style></head>
<body><main>
<h1>{esc(d["title"])}</h1>
<p class="sub">Director's board · <code>video-projects/{esc(slug)}</code></p>
<div class="strip">{"".join(f'<span class="pill">{esc(p)}</span>' for p in pills)}</div>
{nxt}
<div class="grid">{"".join(cards)}</div>
{('<div class="cols">' + "".join(side) + "</div>") if side else ""}
<footer>Pictures: {esc(src)}. Rebuild after changes: <code>tools/py tools/studio/board.py {esc(slug)}</code>.
Live preview with sound: <code>npm run studio</code> → StoryboardVideo, props <code>{{"project": "{esc(slug)}"}}</code>.</footer>
</main></body></html>
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", nargs="?")
    ap.add_argument("--project-dir", help="a project folder outside the repository (script.md, storyboard.json, …)")
    ap.add_argument("--blocks", help="folder of block pages (default: examples/blocks)")
    ap.add_argument("--video", help="draft render to take the pictures from (default: out/studio/<slug>.mp4)")
    ap.add_argument("--out")
    ap.add_argument("--open", action="store_true")
    a = ap.parse_args()
    if a.project_dir:
        pdir = Path(a.project_dir)
        slug = a.slug or pdir.name
    elif a.slug and ROOT:
        pdir, slug = ROOT / "video-projects" / a.slug, a.slug
    else:
        ap.error("give a project slug (inside the repository) or --project-dir")
    if not pdir.exists():
        raise SystemExit(f"no project folder {pdir}")
    blocks = Path(a.blocks) if a.blocks else (ROOT / "examples" / "blocks" if ROOT else None)
    video = Path(a.video) if a.video else (ROOT / "out" / "studio" / f"{slug}.mp4" if ROOT else None)
    out = Path(a.out) if a.out else ((ROOT / "out" / "studio" / f"{slug}-board.html") if ROOT else pdir / f"{slug}-board.html")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(slug, pdir, blocks, video), encoding="utf-8")
    print(f"board: {out}  ({out.stat().st_size / 1e6:.2f} MB)")
    if a.open:
        try:
            webbrowser.open(out.resolve().as_uri())
        except Exception:  # noqa: BLE001
            pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
