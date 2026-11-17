# Contributing

Thanks for helping. This project is a style guide, a Remotion kit, a set of tools and a catalog of free assets. You
can contribute to any of them.

## Ground rules

- **No media in git.** Images, audio, video, models and PDFs never get committed. Instead:
  - assets enter the catalog (`public/assets/library/catalog.json`), which records where each file comes from;
  - generated media come from seeded scripts.
- **No private or third-party material.** Do not commit:
  - reference videos, frames or transcripts;
  - pieces cut from references;
  - voice recordings;
  - anything with an unclear licence.

  `.gitignore` covers the usual places; the audit below catches the rest.
- **No invented facts.** Scripts, examples and catalog titles state only what a source says, and name the source.
- **No Vox branding** in anything we ship (see [NOTICE.md](NOTICE.md)).

## Before a pull request

```bash
npm run typecheck
tools/py tools/dev/release_audit.py            # what git would publish, and whether it is safe
tools/py tools/library/catalog.py check        # if you touched the catalog
```

## Adding assets to the catalog

Follow `public/assets/library/README.md`, or use the `vox-assets` skill.

1. Stage candidates: `tools/py tools/library/stage.py <theme> "<query>" …`.
2. Look at the contact sheet.
3. Add each keeper with `tools/py tools/library/add.py …`. It downloads, processes, verifies and writes the entry.
4. Run `tools/py tools/library/catalog.py check`, then `tools/py tools/library/catalog.py build`.
5. Commit `catalog.json`, `CATALOG.md` and `CREDITS.md`.

What is accepted:
- **Images, maps, footage:** public domain or CC0 only. Write the public-domain basis (`--pd-basis`): published before
  1931, a US federal work, the author died more than 100 years ago, or a CC0 release.
- **Music and SFX:** may also be CC BY, with the attribution line the licensor asks for.
- **Rejected:** watermarks, news-agency or stock credits, prominent modern logos, sensitive images of private people,
  near-duplicates, low-resolution scans.
- **Titles:** factual and short, with 5–9 tags people would search for.

## Adding a recipe or a look

- Read [src/CONVENTIONS.md](src/CONVENTIONS.md): the 12 drawings/s clock, design px, deterministic random, tokens first.
  Then read the style-guide chapter the recipe belongs to.
- Recipes live in `src/recipes/` and are registered in `src/recipes/index.ts`, with the events they read.
- Document new props in [doc 14](docs/style-guide/14-production-pipeline.md).
- Exercise them in a storyboard: a copy of `video-projects/example-time-zones/` is a good start.
- Render stills through `tools/remotion-locked.sh` and look at them before opening the pull request.

## Example projects

Commit only their text: `script.md`, `storyboard.json`, `RESEARCH.md`, `CREDITS.md`, `project.json`, notes. Media come
from the catalog (`kit:` paths) and from local builds. `tools/py tools/examples/build_example.py <slug>` rebuilds:
1. the catalog files and maps the storyboard uses;
2. the scratch voice and its cues;
3. validate and publish;
4. render (`--prepare` stops before it).

## Blocks and starters (`examples/`)

A block is a prompt for one scene, with a page that shows what it makes. To add one:
1. Build the scene in an example project (`video-projects/example-*`), with every fact sourced in its `RESEARCH.md`.
2. Write `examples/blocks/<name>.md`: copy an existing page and point its front matter at the scene
   (`example: <slug>#<scene id>`). The **Agent notes** section is what Claude follows when a user writes
   `[block: <name>]`: keep it short and concrete (narration, props, events, assets, what to check).
3. Run `npm run gallery -- --only <name>`. It cuts `<name>.gif` and fills in the scene JSON and the gallery tables.
   Look at the GIF.
4. The release audit caps the previews (2 MB per block, 4 MB per starter reel, 30 MB in all).

## Skills

The canonical skills are in `.claude/skills/<name>/SKILL.md`. The plugin in `plugin/skills/` holds only launchers,
which point at them, so edit the canonical file. If you add a skill, also add a launcher: `release_audit.py` checks that
the two lists match.
