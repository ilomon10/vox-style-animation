#!/usr/bin/env python3
"""Check that this checkout can make videos, and say what to fix.

  tools/py tools/doctor.py            # full check (hashes the kit asset pack)
  tools/py tools/doctor.py --quick    # fast (what the skills run first)
  tools/py tools/doctor.py --render   # also render one still frame through the render lock (about a minute)
  tools/py tools/doctor.py --json

Exit code 1 when something REQUIRED is missing; the fix is printed next to it (usually: bash tools/setup.sh).
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "library"))
results: list[dict] = []


def add(name: str, status: str, detail: str = "", fix: str = "") -> None:
    results.append({"check": name, "status": status, "detail": detail, "fix": fix})


def run(argv: list[str]) -> str:
    try:
        return subprocess.run(argv, capture_output=True, text=True, timeout=60).stdout.strip()
    except (OSError, subprocess.SubprocessError):
        return ""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--quick", action="store_true")
    ap.add_argument("--render", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    SETUP = "bash tools/setup.sh"

    # python + packages
    v = sys.version_info
    in_venv = Path(sys.prefix).resolve() == (ROOT / "tools" / ".venv").resolve()
    add("python", "ok" if v >= (3, 10) else "fail", f"{v.major}.{v.minor}.{v.micro}{' (tools/.venv)' if in_venv else ' (system, not tools/.venv)'}",
        "" if v >= (3, 10) else "install Python 3.10+")
    if not in_venv:
        add("venv", "warn", "tools/.venv is missing: tools fall back to the system python", SETUP)
    groups = [("core packages", ["numpy", "PIL", "requests", "jsonschema"], "fail"),
              ("voice packages", ["faster_whisper", "kokoro_onnx", "soundfile", "scipy"], "warn"),
              ("cut-out packages", ["rembg", "contourpy"], "warn"),
              ("reference download", ["yt_dlp"], "warn")]
    for name, mods, sev in groups:
        miss = [m for m in mods if importlib.util.find_spec(m) is None]
        add(name, "ok" if not miss else sev, "all present" if not miss else "missing " + ", ".join(miss), "" if not miss else SETUP)

    # node + remotion
    nv = run(["node", "--version"])
    m = re.match(r"v(\d+)", nv)
    add("node", "ok" if m and int(m.group(1)) >= 18 else "fail", nv or "not found", "" if m and int(m.group(1)) >= 18 else "install Node.js 18+")
    pkg = json.loads((ROOT / "package.json").read_text())
    want = pkg["dependencies"].get("remotion")
    rp = ROOT / "node_modules" / "remotion" / "package.json"
    have = json.loads(rp.read_text())["version"] if rp.exists() else None
    add("remotion", "ok" if have == want else "fail", f"{have or 'not installed'} (package.json: {want})", "" if have == want else "npm ci")

    # programs
    for prog, sev, why in [("ffmpeg", "fail", "audio/video"), ("ffprobe", "fail", "audio/video"), ("magick", "fail", "ImageMagick 7: cut-outs, sheets"),
                           ("git", "warn", "updates"), ("pdftoppm", "warn", "PDF documents"), ("flock", "ok", "render lock (Python fallback otherwise)")]:
        p = shutil.which(prog)
        add(prog, "ok" if p else sev, why + ("" if p else " - not found"), "" if p else ("see bash tools/setup.sh --check" if sev != "ok" else ""))

    # models
    mdir = ROOT / "tools" / "voice" / "models"
    have_models = all((mdir / f).exists() for f in ("kokoro-v1.0.onnx", "voices-v1.0.bin"))
    add("voice model", "ok" if have_models else "warn", "Kokoro-82M present" if have_models else "missing: no scratch voice-over (recording your own still works)",
        "" if have_models else SETUP)

    # settings
    env = ROOT / "tools" / "local.env"
    conc = re.search(r"VOX_CONCURRENCY=(\d+)", env.read_text()) if env.exists() else None
    add("render concurrency", "ok" if conc else "warn", f"VOX_CONCURRENCY={conc.group(1)}" if conc else "no tools/local.env (renders use 2)",
        "" if conc else SETUP)

    # catalog + kit pack
    try:
        import lib as L
        cat = L.load()
        core = [x for x in cat["assets"] if "core" in x.get("packs", [])]
        bad, soft = [], []
        for x in core:
            ok, how = L.verify(L.local(x), x.get("file"), quick=a.quick)
            if not ok:
                # AI cut-outs come from the repository's release (or a local rembg rebuild): missing ones only warn
                (soft if x.get("build", {}).get("from") == "release" else bad).append(f"{x['path']} ({how})")
        add("asset catalog", "ok", f"{len(cat['assets'])} entries")
        n_ok = len(core) - len(bad) - len(soft)
        add("kit asset pack", "fail" if bad else "warn" if soft else "ok",
            f"{n_ok}/{len(core)} present" + (f"; first problem: {(bad or soft)[0]}" if bad or soft else ""),
            "" if not (bad or soft) else "tools/py tools/library/fetch.py --pack core" + (" --rebuild" if soft and not bad else ""))
    except Exception as e:  # noqa: BLE001
        add("asset catalog", "fail", str(e)[:120], "check public/assets/library/catalog.json")

    # disk
    free = shutil.disk_usage(ROOT).free / 2**30
    add("disk space", "ok" if free >= 5 else "warn", f"{free:.0f} GB free", "" if free >= 5 else "renders and references need several GB")

    if a.render:
        out = ROOT / "out" / "doctor" / "smoke.png"
        out.parent.mkdir(parents=True, exist_ok=True)
        r = subprocess.run([str(ROOT / "tools" / "remotion-locked.sh"), "still", "src/index.ts", "ProofVoxExplainer", str(out), "--frame=60"],
                           cwd=ROOT, capture_output=True, text=True)
        add("smoke render", "ok" if r.returncode == 0 and out.exists() else "fail",
            str(out.relative_to(ROOT)) if r.returncode == 0 else (r.stderr or r.stdout).strip().splitlines()[-1:][0][:160] if (r.stderr or r.stdout) else "failed",
            "" if r.returncode == 0 else "read the error above; then bash tools/setup.sh")

    worst = "fail" if any(r["status"] == "fail" for r in results) else "warn" if any(r["status"] == "warn" for r in results) else "ok"
    if a.json:
        print(json.dumps({"status": worst, "checks": results}, indent=1))
    else:
        icon = {"ok": "ok ", "warn": "-- ", "fail": "!! "}
        for r in results:
            line = f"  {icon[r['status']]} {r['check']:<20} {r['detail']}"
            if r["fix"] and r["status"] != "ok":
                line += f"   -> {r['fix']}"
            print(line)
        print({"ok": "Ready.", "warn": "Ready (with the warnings above).", "fail": "NOT ready: fix the !! lines."}[worst])
    return 1 if worst == "fail" else 0


if __name__ == "__main__":
    sys.exit(main())
