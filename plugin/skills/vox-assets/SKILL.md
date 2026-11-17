---
name: vox-assets
description: Find, fetch and grow free-licence assets for Vox-style videos — public-domain/CC0 archival photos, engravings, documents, historical and Natural Earth maps, cut-outs, paper textures, hand-drawn marks, sound effects, music beds and footage. Search the shared catalog, download on demand, source new material from the web with licence checks, and add good finds to the catalog for the next project. Use when the user asks for assets, "collect more assets", a specific kind of image/sound/map, or wants to contribute to the library.
---

# vox-assets (plugin launcher)

The full instructions live in the framework itself, versioned with its code. This launcher only finds or installs it.

1. **Find the framework.** In this order: the current directory (it contains `src/studio/StoryboardVideo.tsx`), then
   `$VOX_STUDIO_HOME`, then `./vox-studio`.
2. **Install or update it when needed.** If none exists, or `tools/py tools/doctor.py --quick` inside it does not say
   `Ready`, tell the user in one line what happens (a git clone of https://github.com/ilomon10/vox-style-animation, npm and Python packages, a 354 MB scratch-voice
   model; `VOX_SETUP_ARGS=--no-voice` skips the model) and run:
   `bash "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh" [<folder>]`
   Its last line is `VOX_STUDIO_ROOT=<folder>`.
3. **Follow the real skill.** Read `<VOX_STUDIO_ROOT>/.claude/skills/vox-assets/SKILL.md` and follow it from its first step.
   Run every command from `<VOX_STUDIO_ROOT>` (all paths in it are relative to that folder). If you can, suggest the user
   start Claude Code inside that folder next time: the skills then load directly.
