#!/usr/bin/env python3
"""A voice lineup: the same line in several scratch voices, so the user can pick one by ear.

  tools/py tools/voice/voice_samples.py --slug <slug> [--open]          # the project's first sentence
  tools/py tools/voice/voice_samples.py --text "Any line you like." [--voices am_michael,bf_emma] [--open]

Writes out/voice-samples/<voice>.wav and out/voice-samples/index.html (one player per voice, and how to use it).
The voices are Kokoro-82M's (Apache-2.0), the same model as tools/voice/scratch_vo.py. To use one:
`scratch_vo.py video-projects/<slug>/script.md --voice <name>` (and put `"voice": "<name>"` in project.json, which
build_example.py reads).
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODELS = ROOT / "tools" / "voice" / "models"
OUT = ROOT / "out" / "voice-samples"
# the English voices the README recommends, with what they are
VOICES = {
    "am_michael": "American, male: the default narrator",
    "am_adam": "American, male",
    "am_eric": "American, male",
    "af_heart": "American, female",
    "af_nicole": "American, female, softer",
    "bm_george": "British, male",
    "bf_emma": "British, female",
}


def first_sentence(slug: str) -> str:
    p = ROOT / "video-projects" / slug / "script.md"
    if not p.exists():
        raise SystemExit(f"no script: {p.relative_to(ROOT)}")
    text = []
    for line in p.read_text(encoding="utf-8").splitlines():
        t = line.strip()
        if t and not t.startswith(("#", "//", "[")):
            text.append(t.replace("*", ""))
        if text and re.search(r"[.!?]$", text[-1]):
            break
    return " ".join(text) or "This is how the narration of your video could sound."


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--slug")
    ap.add_argument("--text")
    ap.add_argument("--voices", default=",".join(VOICES))
    ap.add_argument("--speed", type=float, default=1.15, help="Kokoro speed (scratch_vo.py fits its own to the script)")
    ap.add_argument("--open", action="store_true")
    a = ap.parse_args()
    text = a.text or (first_sentence(a.slug) if a.slug else "This is how the narration of your video could sound.")
    names = [v.strip() for v in a.voices.split(",") if v.strip()]
    try:
        import numpy as np
        import soundfile as sf
        from kokoro_onnx import Kokoro
    except ImportError as e:
        raise SystemExit(f"voice packages missing ({e.name}): bash tools/setup.sh")
    if not (MODELS / "kokoro-v1.0.onnx").exists():
        raise SystemExit("no voice model: bash tools/setup.sh (it downloads Kokoro-82M, 354 MB)")
    k = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
    known = set(k.get_voices())
    OUT.mkdir(parents=True, exist_ok=True)
    made = []
    for v in names:
        if v not in known:
            print(f"  skip {v}: not a Kokoro voice")
            continue
        y, sr = k.create(text, voice=v, speed=a.speed, lang="en-gb" if v.startswith("b") else "en-us")
        y = np.asarray(y, dtype=np.float32)
        peak = float(np.abs(y).max()) or 1.0
        sf.write(str(OUT / f"{v}.wav"), y * (0.89 / peak), sr, subtype="PCM_16")
        made.append(v)
        print(f"  {v:<11} {len(y) / sr:4.1f} s  {VOICES.get(v, '')}")
    rows = "".join(
        f'<li><div><b>{html.escape(v)}</b> <span>{html.escape(VOICES.get(v, ""))}</span></div>'
        f'<audio controls preload="none" src="{v}.wav"></audio>'
        f'<code>--voice {html.escape(v)}</code></li>' for v in made)
    page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voice lineup</title><style>
:root{{--bg:#f4f3ef;--card:#fff;--ink:#1b1b1f;--muted:#5d5d66;--line:#dcdad3}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0e0e10;--card:#18181c;--ink:#e8e8ea;--muted:#a3a3ad;--line:#2c2c33}}}}
body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,sans-serif}}
main{{max-width:760px;margin:0 auto;padding:28px 16px}}h1{{font-size:24px;margin:0 0 6px}}
blockquote{{margin:0 0 20px;color:var(--muted);font-style:italic}}ul{{list-style:none;padding:0;margin:0}}
li{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:0 0 10px;display:grid;gap:8px}}
li span{{color:var(--muted)}}audio{{width:100%}}code{{font:13px ui-monospace,Menlo,monospace;color:var(--muted)}}
</style></head><body><main><h1>Pick a voice for the draft</h1>
<blockquote>“{html.escape(text)}”</blockquote><ul>{rows}</ul>
<p><small>Scratch voices are for the draft: record your own narration later with RECORDING_GUIDE.md.
Kokoro-82M voices, Apache-2.0.</small></p></main></body></html>"""
    (OUT / "index.html").write_text(page, encoding="utf-8")
    (OUT / "lineup.json").write_text(json.dumps({"text": text, "voices": made}, indent=1) + "\n")
    print(f"lineup: {OUT / 'index.html'}  ({len(made)} voices)")
    if a.open:
        try:
            webbrowser.open((OUT / "index.html").resolve().as_uri())
        except Exception:  # noqa: BLE001
            pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
