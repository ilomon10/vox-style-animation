# Vox-style animation framework

Remotion (React/TS) kit + measured style guide + Claude Code skills for making Vox-style explainer videos.

- **Making a video from an idea or script → the `vox-video` skill** (`.claude/skills/vox-video/SKILL.md`).
  A reference attached (video, URL, style frames) → **`vox-reference`**. Finding or adding assets → **`vox-assets`**.
- Prompts users copy: `examples/` (starters, and `[block: <name>]` pages: read `examples/blocks/<name>.md` before building
  that section). Previews: `tools/py tools/examples/make_gallery.py`. User guide: `GETTING_STARTED.md`.
- Director mode (interactive by default, "autopilot" on request): `.claude/skills/vox-video/DIRECTOR.md`. Project state and
  gaps: `tools/py tools/studio/director.py <slug>`; board: `tools/studio/board.py`; voices: `tools/voice/voice_samples.py`.
  The claude.ai chat skill (planning only) is `chat-skill/vox-director/`, zipped by `tools/dev/make_chat_skill.py`.
- Start of a session: `tools/py tools/doctor.py --quick`; if it is not ready, `bash tools/setup.sh` (idempotent).
- Style rules: `docs/style-guide/` (start at README; 11 = audio sync, 12 = Vox Earworm look, 13 = story → screen, 14 = pipeline).
- Code conventions: `src/CONVENTIONS.md` (12 drawings/s clock, design px, deterministic random, tokens first).
- Evidence/analysis: `analysis/` (frame-by-frame reports of every reference video). How Vox builds videos across six
  official videos (2019–26), what we cover and where our Earworm-derived rules differ: `analysis/vox-framework-coverage.md`.
  Looks: `voxEarworm` (default, all recipes) and `voxLight` (today's Vox explainer; partly covered). Sync profiles: doc 11 §10.
- **Renders:** run every Remotion command through `tools/remotion-locked.sh` (one process at a time; concurrency comes
  from `tools/local.env`, written by setup from this machine's RAM). To wait for a render started elsewhere:
  `tools/remotion-locked.sh --wait`. Never poll with `while pgrep -f "remotion render"`: the pattern matches the loop's
  own shell. Stop any background shell you no longer need before you report back.
- **Python:** always `tools/py <script>` (the project venv in isolated mode; falls back to `python3 -I`).
- **Assets:** git holds no media (one exception: the gallery GIFs in `examples/`, ≤ 2 MB each). The shared library is the catalog `public/assets/library/catalog.json`; files are
  fetched on demand (`tools/library/fetch.py`, `search.py`). Add entries only with `tools/library/add.py`
  (images PD/CC0; sound may be CC BY with an attribution line).
- **Private material stays in git-ignored folders and is never committed or published:** `reference/`,
  `public/_private/`, any private library under `public/assets/` that is not in the catalog, `video-projects/*/reference/`
  and `video-projects/*/assets/ref/` (pieces cut from a user's reference), and users' recordings (`audio/vo_user*`).
  Before committing: `tools/py tools/dev/release_audit.py`.
- Never invent facts in scripts; cite sources in `RESEARCH.md`. Never use news-agency photos; record every asset in `CREDITS.md`.
- Not affiliated with Vox Media: never put Vox's logos, wordmark, bug or series titles in output (`NOTICE.md`).
