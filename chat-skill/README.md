# `vox-director`: the Claude chat skill

Claude chat (claude.ai) can't render video, but with this skill it plans one with the user, step by step:
1. the brief;
2. research with sources;
3. the angle;
4. a block per section;
5. the script, the music and the storyboard;
6. a board with a sketch of each section.

It hands over a project pack that the framework builds in Claude Code.

- **Source:** `vox-director/SKILL.md`, the only hand-written file.
- **The zip:** `npm run chat-skill` (`tools/dev/make_chat_skill.py`) writes `out/release/vox-director.zip`. It adds
  copies of:
  - the block pages, the starters and the director playbook;
  - docs 13 and 14 of the style guide and the storyboard schema;
  - a one-line-per-asset index of the catalog;
  - `tools/studio/board.py`.

  Rebuild it after any of those change.
- **Install it:** turn on code execution in claude.ai (**Settings → Capabilities**), then **Customize → Skills → + →
  Upload a skill** and choose the zip.
- **Release:** attach the zip to the GitHub release (the build prints the `gh release upload` command), so
  [GETTING_STARTED.md](../GETTING_STARTED.md#plan-in-claude-chat) can link it as
  `releases/latest/download/vox-director.zip`.

The release audit runs `make_chat_skill.py --check`: the skill's `name` must match its folder, and its description
must be at most 1,024 characters.
