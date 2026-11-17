---
name: vox-reference
description: When the user attaches or links their OWN reference for a video — a video file, a YouTube/Vimeo URL, style frames, a mood board, a PDF or a soundtrack — and wants their video to look like it or reuse pieces of it, bring it into their project privately, scan it (contact sheets, palette, pacing, words) and cut its pieces into project assets: background plates, props, photos, hand marks, type samples, effect loops and sound effects. Use with vox-video whenever a reference is attached.
---

# vox-reference (plugin launcher)

The full instructions live in the framework itself, versioned with its code. This launcher only finds or installs it.

1. **Find the framework.** In this order: the current directory (it contains `src/studio/StoryboardVideo.tsx`), then
   `$VOX_STUDIO_HOME`, then `./vox-studio`.
2. **Install or update it when needed.** If none exists, or `tools/py tools/doctor.py --quick` inside it does not say
   `Ready`, tell the user in one line what happens (a git clone of https://github.com/ilomon10/vox-style-animation, npm and Python packages, a 354 MB scratch-voice
   model; `VOX_SETUP_ARGS=--no-voice` skips the model) and run:
   `bash "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh" [<folder>]`
   Its last line is `VOX_STUDIO_ROOT=<folder>`.
3. **Follow the real skill.** Read `<VOX_STUDIO_ROOT>/.claude/skills/vox-reference/SKILL.md` and follow it from its first step.
   Run every command from `<VOX_STUDIO_ROOT>` (all paths in it are relative to that folder). If you can, suggest the user
   start Claude Code inside that folder next time: the skills then load directly.
