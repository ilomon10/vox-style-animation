---
name: vox-video
description: Make a Vox-style explainer video from a one-line idea (or a script) with this repo's Remotion framework — research, Vox-pattern script, scratch voice-over, licensed assets from the shared catalog or the web, music, storyboard, render, QA, then re-time to the user's own recording. Use whenever the user gives a video idea/topic, asks for a "Vox style" video, pastes a starter or `[block: …]` prompt from examples/, or hands back a recorded voice-over.
argument-hint: "[idea, script or starter prompt]  (begin with 'autopilot:' to skip the questions)"
---

# vox-video (plugin launcher)

The full instructions live in the framework itself, versioned with its code. This launcher only finds or installs it.

1. **Find the framework.** In this order: the current directory (it contains `src/studio/StoryboardVideo.tsx`), then
   `$VOX_STUDIO_HOME`, then `./vox-studio`.
2. **Install or update it when needed.** If none exists, or `tools/py tools/doctor.py --quick` inside it does not say
   `Ready`, tell the user in one line what happens (a git clone of https://github.com/ilomon10/vox-style-animation, npm and Python packages, a 354 MB scratch-voice
   model; `VOX_SETUP_ARGS=--no-voice` skips the model) and run:
   `bash "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh" [<folder>]`
   Its last line is `VOX_STUDIO_ROOT=<folder>`.
3. **Follow the real skill.** Read `<VOX_STUDIO_ROOT>/.claude/skills/vox-video/SKILL.md` and its `DIRECTOR.md`, and follow
   them from the first step, with the user's request (ARGUMENTS, if any) as the idea. A request that begins with
   "autopilot:" runs without questions.
   Run every command from `<VOX_STUDIO_ROOT>` (all paths in it are relative to that folder). If you can, suggest the user
   start Claude Code inside that folder next time: the skills then load directly.
