#!/usr/bin/env python3
"""Scaffold a video project: python3 tools/studio/new_project.py <slug> "<one-line idea>"

Creates video-projects/<slug>/ with project.json, script.md (placeholder narration to rewrite), storyboard.json (a 2-scene
skeleton whose anchors match the placeholder script), assets/, audio/music, audio/sfx and CREDITS.md. Next:
  1. write script.md (docs/style-guide/13-story-to-screen.md), tools/py tools/voice/scratch_vo.py video-projects/<slug>/script.md
  2. assets: tools/py tools/library/search.py <words> (kit: paths), or tools/source/* into video-projects/<slug>/assets; credits go to CREDITS.md
  3. write storyboard.json, tools/py tools/studio/validate_storyboard.py <slug>
  4. tools/py tools/studio/publish_project.py <slug>; tools/remotion-locked.sh still src/index.ts StoryboardVideo out/x.png --props='{"project":"<slug>"}' --frame=60
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from storyboard_common import project_dir  # noqa: E402

SCRIPT = """# {idea}
// One-line idea: {idea}
// Plain lines = narration; blank line = paragraph; *stress* marks key words; [BEAT ...] tags are not spoken.

Here is the strange fact at the heart of it. [BEAT recipe=KeywordCut anchor="strange"]
Nobody planned it, and almost nobody noticed.

[PAUSE 0.6]

That is the whole story. [BEAT recipe=EndCard anchor="story"]
"""


def main():
    if len(sys.argv) < 3 or not re.fullmatch(r"[A-Za-z0-9_-]+", sys.argv[1]):
        sys.exit(__doc__)
    slug, idea = sys.argv[1], sys.argv[2]
    pdir = project_dir(slug)
    if os.path.exists(pdir) and os.listdir(pdir):
        sys.exit(f"{pdir} already exists")
    for d in ("assets", "audio/music", "audio/sfx"):
        os.makedirs(os.path.join(pdir, d), exist_ok=True)
        open(os.path.join(pdir, d, ".gitkeep"), "w").close()
    json.dump({"slug": slug, "script": "script.md", "fps": 25, "idea": idea,
               "vo": f"video-projects/{slug}/audio/vo_scratch.wav", "voSource": "scratch", "voice": "am_michael",
               "cues": f"video-projects/{slug}/audio/vo.cues.json"}, open(os.path.join(pdir, "project.json"), "w"), indent=2)
    open(os.path.join(pdir, "script.md"), "w").write(SCRIPT.format(idea=idea))
    sb = {"$schema": "../../src/studio/storyboard.schema.json", "version": 1, "title": idea, "fps": 25, "look": "voxEarworm",
          "scenes": [
              {"id": "open", "recipe": "KeywordCut", "start": {"word": "Here"}, "props": {"word": "STRANGE"},
               "events": [{"id": "pop", "at": {"word": "strange", "kind": "pop"}}]},
              {"id": "end", "recipe": "EndCard", "start": {"word": "story", "edge": "end", "offset": 20},
               "transitionIn": {"kind": "glitchCut"}, "props": {"title": "YOUR SERIES", "tagline": "A VIDEO SERIES"}},
          ], "end": {"scene": "end", "tailSec": 3.5}}
    json.dump(sb, open(os.path.join(pdir, "storyboard.json"), "w"), indent=2)
    open(os.path.join(pdir, "storyboard.json"), "a").write("\n")
    open(os.path.join(pdir, "CREDITS.md"), "w").write(f"# Credits: {slug}\n\nOne entry per file under assets/ and audio/ (the validator checks the file name appears here, or has a sourcing sidecar json).\n")
    print(f"created {os.path.relpath(pdir)}\n{__doc__.split('Next:')[1]}")


if __name__ == "__main__":
    main()
