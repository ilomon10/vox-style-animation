# Vox-style motion graphics — instruction system

This guide tells you (a person or an AI agent) **exactly** how to build explainer animations in code that look like the reference material in `reference/`. Every number here was measured frame by frame from the references. The Remotion kit in `src/` implements it.

- Evidence: `analysis/*.md`. These are per-video reports with shot logs and frame citations. All **8,752 frames** of the original references were extracted and measured; see `analysis/README.md`.
- Cross-series evidence: six more official Vox videos (≈ 68 min, 2019–2026: politics, science, Explain It To Me, Atlas, Almanac, a conversation) in `analysis/vox-sample/`, merged in `analysis/vox-framework-coverage.md` (what Vox does in general, what we cover, where our rules differ).
- Tokens: `src/tokens/*`. Colours, easing curves, durations, fonts, type roles and finish presets are all code here, and this guide quotes them.
- Components: `src/effects`, `src/collage`, `src/motion`, `src/transitions`, `src/type`, `src/explainer`, `src/audio` and `src/earworm`.
- Whole videos: `src/studio` (storyboard engine) and `src/recipes` (scene recipes, listed in doc 14 §3).

**Making a video from an idea?** Give the agent a one-line idea. It follows the `vox-video` skill (`.claude/skills/vox-video/SKILL.md`):
1. research and script ([13](13-story-to-screen.md));
2. scratch voice-over;
3. licensed assets and music;
4. storyboard, render and QA.

You then record the voice-over, and the edit re-times itself to your recording ([14](14-production-pipeline.md)).

## The seven looks

| Style id | Reference | One-line description | Ground | Accent | fps |
|---|---|---|---|---|---|
| `voxLight` | Vox main channel 2020–26 (Electoral College, clean energy, creatine) | **today's Vox explainer**: flat light-grey paper, charts and documents with a lemon highlighter, native-colour footage, sentence-case serif and heavy grotesque type, no film finish | light paper `#EAEAEA` | lemon `#FBFF0B` | 24 (on ones; 12–15 in some videos) |
| `paperDesk` | Porsche documentary (Behance), 196 s | warm scrapbook on a desk: taped prints, yellow highlighter boxes, serif dates, RGB-split | cream paper `#F9EFE6` | lemon `#F2E600` | 30 (graphics 12) |
| `darkCollage` | Dracula collage (Behance), 56 s | B&W engraving cut-outs on scratched black card, theatrical tableaux, film weave | black card `#2B2B2B` | crimson `#8A0315` | 24 (graphics 12) |
| `voxExplainer` | Vox "Epigenetics" excerpt, 51 s | a researcher's desk from above: dotted notebook paper, prints, tape labels, sticky notes, pencil annotations | dotted paper `#D6D3D3` | sticky yellow `#F3DA44` | 24 (on twos) |
| `voxEditorial` | "The Highlight by Vox", 16 s | a single newspaper sheet: big serif title, mustard dry-brush highlighter, clippings | crumpled paper `#B3ACA0` | mustard `#BB923A` | 24 (on ones, long holds) |
| `voxScrapbook` | a Vox brand-studio explainer on the brain and travel, 256 s **with sound** | **the scientific scrapbook**: watercolour paper in one colour per chapter, torn scraps and title strips, engravings multiplied onto the paper, specimen plates with "fig." labels and a magnifier, sheets that slide in from a corner | watercolour paper `#EFEFEF` (pink, mint, blue, coral per chapter) | none (pastel data marks) | 24 (graphics 12) |
| `voxEarworm` | Vox *Earworm* "Quiet Storm", 154 s **with sound** | the *Earworm* series look: near-black collage of B&W cut-outs with torn white borders, condensed caps, karaoke captions, audio visualizers, every cut timed to the voice and music | black paper `#0A0A0A` | periwinkle `#6B74DE` | 25 (graphics 12) |

**Choosing one**
- History, biography or brand story with archival photos → `paperDesk`.
- Dark, gothic or crime topics, folklore, theatre → `darkCollage`.
- Science or policy explainers with diagrams, data and evidence → `voxExplainer`.
- A title sequence, a newsletter or an article read-along → `voxEditorial`.
- Politics, science, data or policy explainers in today's Vox look, or a viewer's question → `voxLight` (it gets the `standard` sync profile: doc 11 §10).
- Science stories told as a sequence of studies, or anything chaptered with diagrams of a thing's parts → `voxScrapbook` (the `scrapbook` profile; doc 15).
- Music or culture stories, anything built around archival audio → `voxEarworm`. Its sound-sync rules (the `earworm` profile) are the most tightly measured; the `standard` profile is what the other Vox series do.

Mixing is allowed per section: wrap each section in its own `<StyleProvider style=…>`.

## The core rules (measured on the reference looks)

1. **12 drawings per second.** Graphics and camera moves step at 12 fps: on twos at 24 fps, or alternating 3/2-frame holds at 30 fps. Live footage, caption fades and the film weave run on ones. → `useDrawingFrame()`
2. **Everything is a physical object lying on a surface.** That means paper, card, prints, tape, sticky notes, slips, books and maps. Nothing floats like UI.
3. **One accent colour per style.** It covers 2–8 % of the frame. Ink is never pure black and paper is never pure white.
4. **Editorial type.** Serifs for topics, titles, years and quotes. A heavy grotesque for concepts (Vox only). Handwriting or a typewriter for labels on objects. Text always sits on a carrier (box, tape, slip, page).
5. **Physical entrances, no fades.** Things drop, rise from behind a mask, slide, peel, unfurl, are drawn on or are wiped on. Opacity fades are only for captions and photos over footage.
6. **Exponential ease-out in, ease-in out, (almost) no overshoot.** 90 % of the travel happens in the first third of the duration.
7. **Hard cuts with motion wrapped around them.** Accelerate into the cut and decelerate out of it. The incoming camera is often already moving. Dissolves are rare (2 frames at most).
8. **Holds are never dead.** There is always a slow drift, a hold-boil jitter, film weave or grain.
9. **Finish everything.** Run a grade/finish pass on the composite: RGB split or lens chromatic aberration, monochrome grain, vignette or worn edges, lifted levels. → `<FilmFinish>`
10. **Pacing.** A new visual beat about every 1 s. Median shot length is 1.3 s (`paperDesk`), 1.6 s (`darkCollage`) or 2.8 s (`voxExplainer`). Beats land 0.2–0.5 s after a narration pause ends.
11. **Author once, render any size.** Author in 1920×1080 design px and render at 4K. Raster assets must be ≥ 2× their on-screen size.
12. **Deterministic.** No `Math.random()`. Seeds derive from ids and the drawing index.
13. **Cut picture to sound.** Record the voice-over first. Anchor cuts on word onsets, pops on stressed syllables, and graphics in pauses on the music's bass notes. Snap to the beat only when music plays alone, never under the voice. Pre-lap the next scene's sound 4–15 f ([11](11-audio-sync.md)).

**Where the 2019–26 Vox sample differs** (`analysis/vox-framework-coverage.md` §5). Rules 1, 7, 9 and 13 hold for the looks above but not for today's main-channel videos, which:
- animate on ones, at 12 or at 15 drawings/s;
- dissolve in 5 of 6 videos;
- use no film finish on the light look and show footage in native colour;
- lead the narrator's phrase start by 0–12 f instead of cutting on a keyword's onset.

`voxLight` and the `standard` profile (doc 11 §10) carry those values. The rest of the conflicts are listed in §5 of the coverage doc: narration share, questions in the script, the music plan and the SFX budget.

## Documents

| # | File | Covers |
|---|---|---|
| 01 | [01-style-dna.md](01-style-dna.md) | the principles, signature devices per style, do/don't |
| 02 | [02-color.md](02-color.md) | palettes (hex tokens and roles), grade, accent and photo treatment rules |
| 03 | [03-typography.md](03-typography.md) | fonts (free and commercial originals), sizes by cap height, text treatments |
| 04 | [04-layout-composition.md](04-layout-composition.md) | canvas, grids, placement, scale and rotation ranges, layering and depth |
| 05 | [05-textures-materials.md](05-textures-materials.md) | paper, grain, chromatic aberration, weave, vignette, dust, shadows, borders, tape and edges, each with a code recipe |
| 06 | [06-motion-language.md](06-motion-language.md) | drawing rate, easing tokens, durations, entrances, camera, puppetry, pacing |
| 07 | [07-transitions.md](07-transitions.md) | every transition, frame by frame, with build instructions |
| 08 | [08-scene-recipes.md](08-scene-recipes.md) | ready-made shot templates with beat timelines |
| 09 | [09-assets.md](09-assets.md) | sourcing CC0/public-domain imagery, the cut-out pipeline, licensing |
| 10 | [10-remotion-implementation.md](10-remotion-implementation.md) | architecture, component API, rendering at 1080p/4K, QA tooling |
| 11 | [11-audio-sync.md](11-audio-sync.md) | **audio–visual sync**: word/stress/pause/beat anchors with measured frame offsets, captions and lyrics, music editing and mix, SFX, audio-reactive graphics, workflow |
| 12 | [12-vox-earworm.md](12-vox-earworm.md) | the `voxEarworm` look: colour, type, layout, motion, transitions with sound, recipes, the asset library cut from the episode |
| 13 | [13-story-to-screen.md](13-story-to-screen.md) | **idea → script → shots**: the Vox story arc, targets per minute, voice-over formulas, script markup, claim → recipe lookup, asset and music plans, a worked 60 s example |
| 14 | [14-production-pipeline.md](14-production-pipeline.md) | **the pipeline**: commands from idea to final render, `storyboard.json` (word anchors, no frames, sync profiles), the recipes, publishing, re-timing to your own recording, licensing |
| 15 | [15-vox-scrapbook.md](15-vox-scrapbook.md) | the `voxScrapbook` look: devices with their measured timing, colour, type, layout, finish, sound and what is not built yet |
| — | [../../analysis/vox-framework-coverage.md](../../analysis/vox-framework-coverage.md) | **cross-series coverage**: how Vox builds videos across six official videos (2019–26), the device frequency and coverage matrices, rule conflicts, ranked gaps and build specs |

## Quick start

```bash
npm install
npm run studio                                    # browse galleries, proof shots and storyboard projects
tools/remotion-locked.sh render src/index.ts ProofPaperDesk out/paperdesk.mp4 --concurrency=2
tools/remotion-locked.sh render src/index.ts ProofPaperDesk out/paperdesk-4k.mp4 --scale=2 --concurrency=2   # 4K
tools/remotion-locked.sh render src/index.ts StoryboardVideo out/studio/<slug>.mp4 --props='{"project":"<slug>"}' --concurrency=2
```

`tools/remotion-locked.sh` runs `npx remotion …` under a machine-wide lock (`out/.render.lock`), so only one render or still runs at a time. This machine is low on memory. On a bigger machine, plain `npx remotion …` behaves the same.

```tsx
// a minimal shot in the Vox explainer style
<StyleProvider style="voxExplainer">
  <FilmFinish>
    <DesignSpace>
      <CameraRig keys={[{ at: 0, x: 960, y: 540, scale: 1 }, { at: 20, x: 960, y: 420, scale: 1.2, ease: "push" }]}
                 drift={{ vx: 0, vy: -3, zoomPerSec: 0.02 }}>
        <Paper kind="dots" width={3000} height={2000} />
        <div style={{ position: "absolute", left: 960, top: 260, transform: "translateX(-50%)" }}>
          <TitleRise delay={6}>Genetics</TitleRise>            {/* rises from its baseline mask */}
        </div>
        <StickyNote text="EPI" x={560} y={230} rotate={-2} delay={34} />
      </CameraRig>
    </DesignSpace>
  </FilmFinish>
</StyleProvider>
```

## Production workflow (script → render)

For narrated videos, the storyboard engine handles most of this ([14](14-production-pipeline.md)):
- steps 1–3 become a `script.md` and a `storyboard.json` with one recipe per scene;
- the engine does steps 5–6.

Follow the steps by hand for a shot no recipe covers.

1. **Script to beats.** Split the narration into clauses; each clause is one visual beat (about 1 s, 2–3 words). Mark the beats that need emphasis: a push-in, a highlight or a ring.
2. **Beats to shots.** Group 1–4 beats per shot, aiming for the style's median shot length. Decide what object carries each beat (print, slip, tape label, card) and which transition wraps each cut (07).
3. **Pick recipes.** Most shots are one of the templates in 08. Copy its timeline.
4. **Assets.** Source public-domain or CC0 imagery (09). Cut it out, keep provenance and stay at ≥ 2× resolution.
5. **Build.** One `<Sequence>` (or `<Shot>`) per shot. Put a `CameraRig` inside it, author the world in design px, and drive every animation from tokens.
6. **Finish.** Wrap the whole film in `<FilmFinish>` with the style preset.
7. **QA.** Render stills at beat peaks, then compare them with a reference frame using `tools/py tools/analysis/compare.py <ref> <render>`. Check palette ΔE, grain and levels, and run the checklist in 01. Check stepping by rendering consecutive frames.

## Verification: does the guide reproduce the look?

Four proof compositions (`src/proof/`) rebuild reference moments from the kit and public-domain assets only. Each was scored against the matching reference frame with `tools/analysis/compare.py`. Palette ΔE is CIELAB, weighted by colour share: < 6 is close, < 3 is near-identical.

| Proof | Beats compared → palette ΔE | Report |
|---|---|---|
| `ProofEditorial` (15 s) | title + highlighter 2.0 · erase 2.1 · headline 2.5 · final clipping 2.3 | `analysis/compare/proof-editorial.md` |
| `ProofDarkCollage` (15.5 s) | title 5.1 · parlour 4.1 · bats + lightning 4.6 · end title 1.8 | `analysis/compare/proof-darkcollage.md` |
| `ProofVoxExplainer` (17 s) | title 3.8 · concept 3.8 · "??" 3.3 · inset 5.5 · document 7.0 | `analysis/compare/proof-vox.md` |
| `ProofPaperDesk` (22 s) | year card 2.2 · footage + caption 4.2 · quote card 5.0 · product card 5.5 · desk flyover 8.3 · callout 14.2 | `analysis/compare/proof-paperdesk.md` |

**Sync proofs (`ProofEarworm`, `ProofEarwormB`, `…C`, `…D`; private).** The whole *Earworm* episode (153.7 s) was rebuilt shot for shot with the kit, in four segments, each on the episode's own soundtrack. Each was then measured with the same detectors as the reference.
- The picture is generated art and CC0 stand-ins.
- The only reference pixels are the interview windows in B and D.

| Proof | Segment | Hard cuts on the reference frame | Events within ±1 f / ±2 f | Mean \|Δ\| | Report (`analysis/compare/`) |
|---|---|---|---|---|---|
| `ProofEarworm` | A · 0–31.6 s | 2 of 2 | 93 % / **100 %** (n = 30) | 0.3 f | `proof-earworm.md` |
| `ProofEarwormB` | B · 31.6–69.6 s | 3 of 3 | 58 % / **88 %** (n = 43) | 1.3 f | `proof-earworm-B.md` |
| `ProofEarwormC` | C · 69.6–111.3 s | 4 of 4, plus the drop's restart | 78 % / **84 %** (n = 32) | median 0 f | `proof-earworm-C.md` |
| `ProofEarwormD` | D · 111.3–153.7 s | 5 of 6 (the sixth is a dark-on-dark cut below the detector's threshold on ours) | 69 % / **77 %** (n = 71) | 1.5 f | `proof-earworm-D.md` |

**The target was 90 % within ±2 f. A met it; B, C and D did not.** The misses come from four sources; cuts and word-anchored pops are not among them:
- **The middle and tail of long camera moves.** C's crane half-travel is −12 f. D's pull-back landing and recap settle are −14 / −10 f. The stand-in objects differ, and our eases finish earlier.
- **Settle tails.** C's microphone pendulum is −8 f.
- **Moves that start before the logged beat.** D's record drop is +8 f and its roll +6 f.
- **Detector artefacts.** These are the flickering white letters in B (±4–6 f), plus the randomised spectrum bursts and the thin kick scope in D.

Karaoke captions in A have a mean error of 2.0 f; the reference itself scatters ±3.5 f. The open item is re-fitting the eases of long moves to the reference's frame-difference profile.

These proofs play copyrighted audio, so they are study-only.

**End-to-end pipeline proofs.** These are the maintainer's builds, measured and kept in the maintainer's archive,
not in the repository:
- a 71.8 s daylight-saving explainer built from one line by the `vox-video` skill alone;
  - 12 sourced facts.
  - 17 scenes from 9 recipes.
  - All 14 keyword cuts land within ±1 f of their word onsets.
  - Palette ΔE against *Earworm* frames: 1.8–2.8.
- a 35.6 s filibuster test that re-times between a scratch voice-over and a slower second read without touching the
  storyboard.

The repository ships **`video-projects/example-time-zones`**, text only; `npm run example` rebuilds and renders it. It
has 7 scenes from 5 recipes, all assets come from the shared catalog, and the map is rendered from Natural Earth.

What drives the remaining distance is **content, not style**:
- different photos: B/W 1913 factory photos vs. the reference's pale colour shots, which explains the callout's 14.2;
- line-art furniture engravings vs. photographic furniture;
- a gold-printed 1908 ad vs. a grey journal page.

Stepping (12 drawings/s), easing, layout, type and finish were verified frame by frame in each proof.

**Note on grain.** The references are H.264 at 2–5 Mbps, which removes the finest texture. A lossless render of the same scene measures about 1.3–3× more high-frequency "grain" until it is encoded the same way. Judge grain on encoded output.
