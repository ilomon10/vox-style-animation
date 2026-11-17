---
name: vox-director
description: Plan a Vox-style explainer video with the user in Claude chat, one decision at a time. Covers research with sources, the angle, a section plan from ready-made scene blocks (a cold open on a year, a map with a route, a highlighted document, a quote card, a bar chart, a specimen plate with "fig." labels, and more), the script, a storyboard and a visual board. Hands over a project pack that the open-source vox-style-animation framework renders in Claude Code. Use when the user wants to plan or start a Vox-style video in chat, asks which scene blocks exist, or pastes a starter or [block: …] prompt.
---

# Vox director: plan the video together, in chat

**What happens here:** research, the angle, the section plan, the script, the storyboard, the credits and a visual
board. You and the user decide them together, step by step.

**What doesn't happen here:** rendering. That needs the framework (Remotion, FFmpeg, a voice model) on the user's
computer, in Claude Code. The project pack you hand over builds there, with the `vox-studio` plugin:

```
/plugin marketplace add ilomon10/vox-style-animation
/plugin install vox-studio@vox-style-animation
```

**If you are already in Claude Code with the framework** (a checkout that contains `src/studio/StoryboardVideo.tsx`, or
the `vox-studio` plugin), use its `vox-video` skill instead. It has the same director mode and renders the video.

## Director mode

Interactive by default.
- **Checkpoints:** `reference/director.md` has the question set for each checkpoint, the modes and the table "When
  something is missing". Its `tools/py …` commands run in Claude Code, not here.
- **How to ask:** one short set of questions per checkpoint. Use clickable options when the app shows them, with the
  recommended option first and marked "(Recommended)". Otherwise use a numbered list with the recommendation marked,
  ending: *Reply with a number, your own idea, or "autopilot".*
- **Where we are:** before each set, write one line, for example "Step 3 of 7 · Section plan".
- **Autopilot:** if the user says "autopilot", "stop asking" or "just make it", decide everything with the
  recommendations and list each decision in `HANDOFF.md`. "Guide me" switches back.
- **Checkpoints in chat:** C1 Brief, C2 Angle, C3 Section plan, C4 Script, C6 Gaps and C7 Music happen here. For C5
  Voice, ask which scratch voice to use for the draft and whether the user will record their own; write the answer into
  `project.json`. C8 (look check) and C9 (delivery) happen in Claude Code.
- **Facts:** never invent one, in any mode.

## The steps

1. **C1 · Brief:** length, look, audience and how involved the user wants to be. Skip what the request already says.
2. **Research:** search the web. Put 6–12 facts, each with a source URL, into `RESEARCH.md` as a table
   (`| # | Fact | Source(s) | Note |`).
   - No invented facts, quotes or statistics.
   - When sources disagree, say "by one count" or leave the number out, and note which in RESEARCH.md.
   - Method: `reference/13-story-to-screen.md` §3.
3. **C2 · Angle:** 2–3 thesis questions from the research, plus the hook.
4. **C3 · Section plan:** one block per section (the list below; each page in `reference/blocks/` has a wireframe,
   a prompt template, a working scene and Agent notes). Use the wireframes as option previews. Then make the board
   (step 9).
5. **C4 · Script:** write `script.md` in the markup of `reference/13-story-to-screen.md` §6.
   - Before each section's lines: `[BEAT recipe=<Recipe> anchor="<first word>"]`.
   - `*stress*`, and `[PAUSE 0.6]` between chapters.
   - Numbers spelled as spoken.
   - About 3.5 words a second, phrases of 5–6 words, one idea per shot.
6. **Assets:** choose pictures from `reference/catalog-index.tsv` and use its `kit` column as the path.
   - Never invent a path.
   - A section with nothing that fits is a gap: C6, with the recommendations in director.md.
   - The user's own files go in as `assets/<name>`, each with a CREDITS line.
7. **C7 · Music:** pick a catalog bed (`kind` = `music`). CC BY beds need their attribution line in CREDITS.md.
8. **Storyboard:** write `storyboard.json` following `reference/14-production-pipeline.md` §2–3 and the scenes on
   the block pages.
   - `"fps": 25` (24 for `voxScrapbook`), the look, the music, and one scene per section.
   - Starts and events are word anchors from the script, never frames: Claude Code checks them against the voice-over.
   - Validate it against `reference/storyboard.schema.json` with Python's `jsonschema` if it is installed.
9. **The board:** put the files in a folder `<slug>/`, then run
   `python3 scripts/board.py --project-dir <slug> --blocks reference/blocks --out <slug>/board.html`.
   - Offer `board.html` as a file. It is self-contained, so it can also be shown as an HTML artifact.
   - It shows one card per section: the block's wireframe, the narration and the assets.
10. **Hand over** a zip of `<slug>/` containing `script.md`, `RESEARCH.md`, `storyboard.json`, `CREDITS.md`,
    `project.json`, `HANDOFF.md` and `board.html`. Tell the user to put the folder in the framework's
    `video-projects/`, open Claude Code there and say:

    > Build the video project video-projects/<slug>: make the scratch voice-over, check the storyboard's anchors
    > against it, publish, show me the board with stills, then render.

`project.json`:
`{"slug": "<slug>", "script": "script.md", "fps": 25, "idea": "<title>", "voice": "am_michael", "voSource": "scratch", "mode": "guided"}`
(the same fps as the storyboard).

`HANDOFF.md` lists:
- the decisions made (all of them on autopilot);
- the open gaps;
- the unverified points;
- anything the user must supply.

## Blocks

Two collections, one per look. Build a video from one collection.

**Earworm look** (`voxEarworm`, the default):

| Block | For | Recipe |
|---|---|---|
| cold-open-year | the hook: a year over archival prints | ColdOpenYear |
| photo-collage | the hook or a scene: torn prints and a keyword | PhotoCollageUnfold |
| keyword-cut | one word slammed onto a photo | KeywordCut |
| giant-word-card | a number or claim that fills the frame | GiantWordCard |
| series-ident | our series name after the thesis | SeriesIdent |
| montage-crane | a list of things, one camera tilt | MontageCrane |
| map-route | places: a route on a map, a label | MapRoute |
| name-card | a person's first appearance (a real picture of them) | NameCardInterview |
| data-counter | one number counting up | DataChart (counter) |
| data-bars | numbers side by side | DataChart (bars) |
| document-highlight | a document: highlights and rings | DocumentHighlight |
| quote-card | exact words, typed out | QuoteCard |
| footage-clip | film footage, the turn to today | FootageClip |
| end-card | our series name at the end | EndCard |

**Scrapbook look** (`voxScrapbook`, 24 fps: watercolour paper in one colour per chapter, specimen plates):

| Block | For | Recipe |
|---|---|---|
| torn-paper-chapter-card | each chapter's start; with a kicker instead of a number, the end card | ChapterCard |
| torn-paper-stat | a number with its context and a payoff, over a picture or paper | PaperStat |
| stamped-stat | a count stamped onto a page, as a record | StampedStat |
| specimen-plate | a diagram of a thing: a magnifier and "fig." labels | SpecimenPlate |
| specimen-comparison | two groups side by side | SpecimenCompare |
| specimen-interview | a person in a deckle print with a "fig." label | SpecimenInterview |
| paper-sheet-slide | a transition: the next scene arrives on its own sheet | `transitionIn` `paperSlide` |

Starter requests built from them: `reference/starters/`.
Previews: https://github.com/ilomon10/vox-style-animation/tree/main/examples

## Never

- Vox's (or any other channel's) logo, wordmark or series name. The user's series name is their own.
- News-agency photos.
- A picture that is not public domain or CC0, except the user's own files.
