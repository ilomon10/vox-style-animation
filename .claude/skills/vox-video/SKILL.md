---
name: vox-video
description: Make a Vox-style explainer video from a one-line idea (or a script) with this repo's Remotion framework — research, Vox-pattern script, scratch voice-over, licensed assets from the shared catalog or the web, music, storyboard, render, QA, then re-time to the user's own recording. Use whenever the user gives a video idea/topic, asks for a "Vox style" video, pastes a starter or `[block: …]` prompt from examples/, or hands back a recorded voice-over.
argument-hint: "[idea, script or starter prompt]  (begin with 'autopilot:' to skip the questions)"
---

# Vox video: idea → finished video

The user gives an idea; you deliver a draft video with a scratch voice-over, a recording guide, and — after they
record — the final video re-timed to their voice. Everything is measured from real Vox videos; follow the docs,
don't improvise the style.

## 0 · Workspace (every session)
- This skill runs inside a checkout of https://github.com/ilomon10/vox-style-animation. If the working
  directory has no `src/studio/StoryboardVideo.tsx`, get one first and work inside it:
  `git clone --depth 1 https://github.com/ilomon10/vox-style-animation vox-studio && cd vox-studio && bash tools/setup.sh`
- Run `tools/py tools/doctor.py --quick`. If it prints `NOT ready`, run `bash tools/setup.sh` (idempotent; it says what to
  install) and check again. Tell the user about any `--` warning that matters for this video (e.g. no voice model).
- All Python runs through `tools/py` (the project venv). All Remotion runs through `tools/remotion-locked.sh` (one render at
  a time; concurrency from `tools/local.env`). To wait for a render started elsewhere: `tools/remotion-locked.sh --wait`.

**Read before the first step of a new video:** `docs/style-guide/13-story-to-screen.md` (script + shot rules),
`11-audio-sync.md` (timing; §10 profiles), `12-vox-earworm.md` (default look), `14-production-pipeline.md` (storyboard + commands),
`analysis/vox-framework-coverage.md` §1–2 (how Vox builds videos across six official videos, and which of our rules are
Earworm-only), `src/studio/README.md`, `public/assets/library/README.md` (the shared asset catalog), `examples/README.md`
(the blocks: one working scene per recipe) — skim, then use as reference.

## 0b · Director mode: guided by default, autopilot on request (read `DIRECTOR.md`)
The video is made WITH the user. Read [`DIRECTOR.md`](DIRECTOR.md) before the first question: three modes (`guided`
default, `key`, `auto`), nine checkpoints C1–C9, how to ask (the question tool, recommended option first, wireframe
previews), what to recommend when a section lacks something, and which previews to offer (the HTML board, block GIFs,
Remotion Studio, voice samples).
- **Switching:** the user can switch at any time. "autopilot" / "stop asking" → `auto`: no more questions, the
  recommended option every time, every decision listed in `HANDOFF.md`. "guide me" → `guided`. Save the mode with
  `tools/py tools/studio/director.py <slug> --mode <mode>`.
- **C1 · Brief:** length, look, audience and the involvement level. Ask only what the request leaves open. Also ask
  about any assets, music, voice or **reference** the user already has (a reference → also the `vox-reference` skill).
- **Ground every recommendation:** `tools/py tools/studio/director.py <slug> --json` shows where the project
  stands, its gaps and the next checkpoint.

Looks:
- `voxEarworm` (default): every recipe is built for it.
- `voxLight`: today's main-channel Vox explainer, light paper. So far only `DocumentHighlight` v2, `SeriesIdent`,
  `EndCard mode: "credits"`, `NameCardInterview card: "lowerThird"` and `FootageClip` are drawn for it; the other
  recipes still draw Earworm content on it. Offer it, and say so.
- `voxExplainer` desk, `paperDesk` scrapbook, `darkCollage`, `voxEditorial`.

Any look other than `voxEarworm` gets the `standard` sync profile.

## 0c · Prompts with blocks (`examples/`)
Users often paste a starter from `examples/starters/`, or write one `[block: <name>]` line per section.
- **Read the block pages first.** For every tag, read `examples/blocks/<name>.md` before writing the script. Its **Agent
  notes** say how to write the line, which recipe, props and events to use, where to find the assets and what to check
  in the stills. Its scene JSON is a working example. If a name is unknown, say so and use the closest block (the list
  is in `examples/README.md`).
- **One block line = one section, in the user's order.** Write its narration, then the `[BEAT recipe=… anchor="…"]` tag
  for the block's recipe.
- **Values in a block line are claims.** A number, a date, a quote or a name in a block line is checked like any
  other fact (§1). Correct it or drop it, and tell the user. Never copy an example's facts into another topic.
- **Don't ask about the gaps.** Fill whatever the user left open (pictures, labels, routes) from the research and the
  catalog. The script approval in §2 is still the one stop.
- **Hand-off:** list each block and the scene it became.

## 1 · Research (facts first)
WebSearch for the topic; collect 6–12 facts with dates, numbers, names and a source URL each into
`video-projects/<slug>/RESEARCH.md`. Prefer primary/official sources. No invented facts, quotes or statistics; if a
claim is uncertain, say so in the script or drop it. This applies to **every** project, including samples and tests:
users watch example renders.

Fact traps found so far:
- **Popular origin stories are often contested.** Write "is often traced to" rather than "began as".
- **Records get broken.** Check the current holder before calling anything "the longest" or "the first".
- **Some sites refuse scripted fetches (e.g. senate.gov answers 403).** Use site-restricted WebSearch excerpts and other
  hosts, and mark such facts as "checked via excerpts".

Worked example: doc 13 §11.2.

## 2 · Script (Vox patterns, doc 13)
`tools/py tools/studio/new_project.py <slug> "<idea>"`, then write `script.md` with the markup
(`[BEAT recipe=… anchor="word"]`, `*stress*`, `[PAUSE 0.6]`, `[MUSIC …]`, `[SFX …]`, `[ARCHIVAL "…"]`):
cold open hook → place/time → question/thesis → context → evidence/expert → turn → payoff → ending handoff.
≈3.5 words/s while speaking, narration ≈45 % of runtime, phrases ≈5–6 words, one idea per shot.
Put each tag on its own line **before** the line it belongs to; the recording guide attaches tags to the line that follows them.
Spell numbers as spoken. The aligner hears them as digits and interpolates their word times, so anchor a cut on the
number's first word, never its middle.
**Checkpoint C4: show the script and wait for approval or edits** in `guided` and `key` mode. In `auto` mode, go on
and list the script among the decisions in `HANDOFF.md`.

## 3 · Scratch voice-over + cues
Checkpoint C5 picks the voice: `tools/py tools/voice/voice_samples.py --slug <slug> --open` lets the user hear seven.
Then `tools/py tools/voice/scratch_vo.py video-projects/<slug>/script.md --voice <name>` (Kokoro TTS; `--lang` for
non-English). Put `"voice": "<name>"` in `project.json`, then run `tools/py tools/voice/recording_guide.py
video-projects/<slug>` → `RECORDING_GUIDE.md`.

## 4 · Assets (licensed, credited) — in this order
1. **User-provided** files → `video-projects/<slug>/assets/`, credited in `CREDITS.md`.
2. **Cut from the user's reference** (`vox-reference` skill) → `assets/ref/<id>/…`. Publishable only when the user owns
   the reference (`rights: own`); otherwise drafts only, and HANDOFF lists a replacement for each.
3. **A private library on this machine**, if there is one (a folder under `public/assets/` that is not in the catalog,
   with its own `CATALOG.md`): look-development only, never published; the validator warns when a storyboard uses it.
4. **The shared catalog**: `tools/py tools/library/search.py "<words>" [--kind photos|engravings|portraits|documents|maps|cutouts|textures|marks|footage] [--fetch]`
   → use the printed `kit:assets/library/...` path. Files download on demand (`publish_project.py` fetches what a storyboard uses).
   Base maps: `tools/py tools/library/make_maps.py country <ISO3> --project <slug>`; route waypoints:
   `make_maps.py locate <map.png> --at lon,lat ...`. Hand marks, tape, torn strips: `--kind marks`.
5. **The web**: `tools/py tools/source/source_images.py "<query>" --project video-projects/<slug> [--cutout --bw]`
   (Commons PD/CC, NASA, Smithsonian, US-gov official portraits; never news agencies). Every file must be in
   `CREDITS.md`; CC-BY/BY-SA need on-screen or description attribution — list them for the user.
6. **Grow the catalog** with what was good and is PD/CC0 (`vox-assets` skill, `tools/library/add.py`).

## 5 · Music & SFX
- **Music:** `tools/py tools/library/search.py --kind music "<mood>"` (beds with BPM and loudness; CC BY ones carry an
  attribution line) → `tools/py tools/source/source_music.py --mood "…" --bpm lo-hi --project …` → audition the ranked
  `candidates.md` (reject spoken word/vocals under narration). If nothing fits: `tools/py tools/source/make_bed.py …` and
  `write_music_wanted()` → `MUSIC_WANTED.md`, and TELL the user what to look for.
- **SFX** (budget ≈1 per 13 s, sources/structure only): reference SFX (`assets/ref/<id>/sfx/`) → catalog
  (`search.py --kind sfx`: clicks, ticks, page flips, glitches, thuds, whooshes; every one has a peak sidecar) → the kit's
  procedural set `kit:audio/sfx/` (`make_sfx.py`).

## 6 · Storyboard → render → QA
Write `storyboard.json` (recipes, word anchors with `kind`, transitions; frames never). Loop:
`tools/py tools/studio/validate_storyboard.py <slug>` → `tools/py tools/studio/publish_project.py <slug>` →
stills at every beat via `tools/remotion-locked.sh still src/index.ts StoryboardVideo out/studio/<slug>-f<N>.png --frame=<N> --props='{"project":"<slug>"}'`
→ LOOK at them → fix → full render `tools/remotion-locked.sh render src/index.ts StoryboardVideo out/studio/<slug>.mp4 --props='{"project":"<slug>"}'`.
QA: register the MP4 with `tools/py tools/analysis/sources_registry.py add <slug>__render out/studio/<slug>.mp4` (local, git-ignored), run `frame_metrics.py`/`shots.py`
and `tools/audio/av_timeline.py`; check keyword cuts on word onsets (±1 f), no beat-locked cuts under narration, text on
screen ≥0.6 s; compare a few stills with `tools/analysis/compare.py <ref|video@sec> <still>` when a reference is available.

Packaging every Vox video has (measured on 6 of 6; `analysis/vox-framework-coverage.md` §2.1, §6.2):
- **Series ident:** `SeriesIdent` with OUR series name right after the thesis (at 10–17 % of the runtime). Music alone
  under it, then a silence hole and a hard cut (`transitionIn: {kind: "cut", hole: N}` on the next scene).
- **Lower third:** `NameCardInterview card: "lowerThird"` or a `FootageClip` `lowerThird`, on a person's first full-frame
  appearance only, at cut +2 f (kind `lowerThird`).
- **Sources on screen:** `DocumentHighlight` `source` / `SourceLine`, and the corner tag on third-party footage.
- **Credits:** `EndCard mode: "credits"` with the user's credits, our own mark, `silent: true` or the outro bed.
- **Never** Vox's wordmark, bug or a sponsor's mark (this project is not affiliated with Vox: `NOTICE.md`).

Storyboard gotchas:
- **`drop`:** the scene start is the first frame after the black, and the picture is fully up 17 f later. Use `offset: -17` to land the full picture on a word.
- **`GiantWordCard`:** set `photoBox` so the photo never hides the letters that carry the word.
- **`MontageCrane`:** near layers are pushed outward. The recipe clamps prints to the frame, but check that the labels read in the stills.
- **Changed script words:** after editing words in `script.md`, re-run `scratch_vo.py`. `recue.py` and `validate_storyboard.py` then list every anchor whose word has gone.
- **`standard` profile:** scene starts default to kind `phrase` (3 f before the anchor word). So anchor each cut on the FIRST
  word of the phrase it opens, not on the keyword. Highlights use kind `highlight` (+1 f). A chapter `hole` only stays
  silent where the voice pauses: script a beat of silence before each new chapter.

## Adding a new reference video to the style study (analysis only)
`tools/py tools/source/fetch_reference.py <youtube id>=<analysis_id> --style <tag>` (official Vox channel only
by default; private, git-ignored), then `tools/analysis/preprocess_long.sh <analysis_id>`. After that, analyse with
`analysis/vox-sample/ANALYST_GUIDE.md` + `VOCABULARY.md`. YouTube rate-limits caption downloads (HTTP 429): retry later with
`--refresh-subs`, or rely on the whisper words. (A user's reference for THEIR video is the `vox-reference` skill instead.)

## Shorts (9:16 YouTube Shorts)
When the user asks for a Short, read `analysis/vox-shorts.md` §7 (measured on three official Vox Shorts) and doc 14 "Shorts".

**Storyboard settings:** `"format": "short"`, `"look": "voxLight"`, profile `standard`, and
`"captions": {"pos": "bottom", "replace": {…numbers as digits…}}`.

**Script:** speech starts at frame 0, at about 2.8 words/s. That is about 165 words for 60 s; Vox's own Shorts run 80–110 s.

**Picture:** about 10 hard cuts per minute.
- A `ShortHook` with the title or question (≤ 8 words) is the first frame, so it is also the thumbnail. It leaves on the first cut after the opening sentence.
- The portrait recipes (`ShortPhoto` with a name label on first appearance, `ShortDocument`, `ShortTimeline`, `ShortSteps`, `ShortQuote`, `ShortEnd`) fill the frame. A landscape recipe shows as a ×0.63 band.

**Captions and QA:**
- Captions come from the cue words, so cue text carries the script's case and punctuation. Spell numbers as spoken in the script and map them back with `captions.replace`.
- Check stills with `"debug": {"safeArea": true}`, and view them at 360×640. Remove the debug flag for the final render.

**Hand-off:** add a `DESCRIPTION.md` with the title, the description with source links, and the attribution lines.

## 7 · Hand-off
Give the user:
- the draft MP4;
- `RECORDING_GUIDE.md`;
- `CREDITS.md` (+ attribution lines to paste; catalog files: `public/assets/library/CREDITS.md` has every line);
- `MUSIC_WANTED.md`, if any;
- `HANDOFF.md`: the record → recue → publish → render commands, the list of assumptions and unverified facts, and every
  asset that is not cleared for publication (cut from a reference the user does not own, or from a private library),
  each with a replacement from the catalog or the web. In `auto` mode it also lists the decisions made on autopilot
  (DIRECTOR.md, C9);
- the board, `out/studio/<slug>-board.html` (`tools/py tools/studio/board.py <slug>`).

Examples of complete projects (text only; `tools/py tools/examples/build_example.py <slug>` builds their media):
`video-projects/example-time-zones/` (`npm run example`) and `video-projects/example-world-time/` (the block gallery).

## 8 · User recording → final
When they return a WAV: `tools/py tools/studio/recue.py video-projects/<slug> <file>` → read the report
(anchors NOT FOUND → fix the storyboard word or `nth`) → validate → publish → render 1080p, and 4K with `--scale=2`
if asked. Re-check the sync QA.
