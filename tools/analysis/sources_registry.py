#!/usr/bin/env python3
"""The registry of analysable videos, as one dict {id: {"path", "fps", "style", ...}}.

  tools/analysis/sources.json        the references the style guide was measured on (shared; the videos stay private)
  tools/analysis/sources.local.json  git-ignored: references a user added for their own project (tools/reference/ingest.py)

Every analysis tool calls load_sources(), so a user's reference is analysed like any other without being committed.
Shell use:  tools/py tools/analysis/sources_registry.py ids | path <id>
            tools/py tools/analysis/sources_registry.py add <id> <video> [--style render]   (local; e.g. a render for QA)
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SHARED = os.path.join(HERE, "sources.json")
LOCAL = os.path.join(HERE, "sources.local.json")


def load_sources() -> dict:
    d = json.load(open(SHARED, encoding="utf-8")) if os.path.exists(SHARED) else {}
    if os.path.exists(LOCAL):
        d.update(json.load(open(LOCAL, encoding="utf-8")))
    return d


def register_local(sid: str, entry: dict) -> None:
    d = json.load(open(LOCAL, encoding="utf-8")) if os.path.exists(LOCAL) else {}
    d[sid] = entry
    tmp = LOCAL + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(d, fh, indent=1)
        fh.write("\n")
    os.replace(tmp, LOCAL)


if __name__ == "__main__":
    s = load_sources()
    if sys.argv[1:2] == ["ids"]:
        print(" ".join(s))
    elif sys.argv[1:2] == ["path"] and len(sys.argv) > 2:
        print(s[sys.argv[2]]["path"])
    elif sys.argv[1:2] == ["add"] and len(sys.argv) > 3:
        import subprocess
        from fractions import Fraction
        sid, video = sys.argv[2], sys.argv[3]
        style = sys.argv[sys.argv.index("--style") + 1] if "--style" in sys.argv else "render"
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of",
                            "csv=p=0", video], capture_output=True, text=True, check=True).stdout.strip()
        register_local(sid, {"path": video, "fps": float(Fraction(r)), "style": style})
        print(f"registered {sid} -> {video} ({float(Fraction(r)):g} fps) in {os.path.relpath(LOCAL)}")
    else:
        sys.exit("usage: sources_registry.py ids | path <id> | add <id> <video> [--style render]")
