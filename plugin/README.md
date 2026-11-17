# vox-studio (Claude Code plugin)

Install:

```
/plugin marketplace add ilomon10/vox-style-animation
/plugin install vox-studio@vox-style-animation
```

Then ask Claude for a video ("make a Vox-style explainer about why we have time zones"), attach a reference, or ask
for assets. `vox-video` directs the video with you: it recommends an answer and asks at each step, with previews.
Say "autopilot" at any time, or start with `/vox-studio:vox-video autopilot: <your idea>`, and it decides everything
itself. On first use the skills clone the framework (https://github.com/ilomon10/vox-style-animation)
into `./vox-studio` (or `$VOX_STUDIO_HOME`) and run its `tools/setup.sh`.

| Skill | When |
|---|---|
| `vox-video` | an idea or a script → a narrated, Vox-style video; then re-timed to your own recording |
| `vox-reference` | you attach a reference (video, URL, style frames, PDF, soundtrack): its pieces become assets for your project |
| `vox-assets` | find, fetch or add free assets (photos, engravings, maps, cut-outs, textures, marks, SFX, music, footage) |

The launchers here only find or install the framework; the full skills live in its `.claude/skills/`, versioned with
the code. Not affiliated with Vox Media (see NOTICE.md in the repository).
