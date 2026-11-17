# 12 · The Vox *Earworm* look (`voxEarworm`)

This is the current Vox house look, measured on the *Earworm* episode "Quiet Storm":
- a near-black collage of B&W archival cut-outs with torn white borders;
- **one periwinkle accent**;
- condensed caps;
- **picture and sound edited as one** (timing rules in [11-audio-sync.md](11-audio-sync.md)).

It shares the stepped 12 drawings/s motion and collage logic of the other looks, but it is darker, cleaner and more typographic than the 4:3 paper-desk explainer (`voxExplainer`).

Evidence: `analysis/earworm-{A,B,C,D}.md`, with the editorial grammar in `analysis/earworm-editorial.md`. Theme: `<StyleProvider style="voxEarworm">`. Components: `src/earworm` (grounds, collage, type) and `src/earworm/fx` (camera, transitions with sound, visualizers).

Proof: the whole episode was rebuilt with these components and measured against the original. See README → Verification. Assets cut from the episode are in §8.

## 1 · Signature devices (ranked)

> **Scope: Earworm is one Vox series look, not Vox's general style.** Six other Vox videos (2019–2026: a data argument, a fact-check, a viewer question, Almanac, Atlas, a conversation) were measured the same way. None of them uses devices 2, 3, 4, 8, 9 or 11, and their cuts follow phrases, not word onsets (device 1). The cross-series findings, per-format ranges and what this framework covers are in `analysis/vox-framework-coverage.md`.

| # | Device | Spec |
|---|---|---|
| 1 | **Every visual is cut to the sound** | keyword cuts on the word onset, pops on the stressed syllable, captions on the voice, transitions with locked SFX ([11](11-audio-sync.md)) |
| 2 | **Dark collage ground** | overlapping black construction paper with torn edges and ghost newsprint (`#0A0A0A`, luma 4–17); the ground **weaves on its own**: whole-pixel jumps of ±2–5 px every 4–6 f |
| 3 | **B&W archival cut-outs with torn white borders** | fully desaturated (sat 0.01–0.05), ragged `#E1E3E5` border ≈9–30 px; the torn edge can boil (re-randomise every 2–4 drawings); newsprint scraps peek out behind them |
| 4 | **One periwinkle accent** | `#6B74DE` (measured `#656ED8`–`#7480F1`) for data, key words, X marks, cables and vinyl labels, ≤ 8 % of pixels. Yellow appears once, on the end card's marker underline |
| 5 | **One condensed family, size as hierarchy** | Oswald (≈ Trade Gothic Bold Cond. / Knockout) at 20 → 45 → 77 → 120–230 px → full-bleed. Key words in blue, **never a whole sentence**. A serif only on name cards |
| 6 | **Karaoke captions of archival voices** | word by word on the voice, two lines max, previous line at 35 % |
| 7 | **Giant single-word title cards** | 16–21 % of frame height; the letters start scattered and converge; a photo sits *inside* the word and hides 1–2 letters |
| 8 | **Kinetic voice** | archival phone/radio voices as full-bleed caps, one word per drawing, spelled as heard, behind the cut-outs |
| 9 | **Decode name cards** | the name tracks in (+1 em → 0) with a random-letter decode; serif title and italic affiliation |
| 10 | **Audio graphics** | spectrum bars, kick-driven oscilloscope, vocal-keyed beams, in the visualizer blues |
| 11 | **Hard camera** | pushes accelerate and stop dead on the keyword; crash pushes ×2.7 in 11 f; mega pull-backs ×6.25; multiplane cranes; holds are dead still (life comes from the ground weave, re-grain and spinning records) |
| 12 | **Structural sound** | drop to black and silence before a montage, dip to digital silence at the act break, sub-boom blur cuts, a whoosh on spin-swaps; music runs to the last frame |

## 2 · Colour (`src/tokens/colors.ts` → `voxEarworm`)

| Token | Hex | Role |
|---|---|---|
| `ground` | `#0A0A0A` | black paper ground (`#060606`–`#101010`) |
| `groundScrap` / `strip` / `slip` / `slip2` | `#181818` / `#2F2D2E` / `#1F1F1F` / `#343233` | label boxes, torn label strips, artist/song slips |
| `whitePaper` | `#F6F6F6` | the alternate white-paper ground (fibre σ ≈ 3–4) |
| `tornWhite` | `#E1E3E5` | torn border around cut-outs |
| **`accent`** | **`#6B74DE`** | periwinkle: data, key words, X marks, arrows |
| `accentDeep` | `#4D5092` | credit lines |
| `indigo` | `#3A4A89` | cables, vinyl labels |
| `glowCore` / `glowBody` / `glow` | `#8A92DB` / `#414AA6` / `#2A3293` | audio visualizers |
| `offWhite` | `#BEBDBE` | distressed caption and title type |
| `kinetic` / `wood` | `#DDDDDB` / `#D7D7D5` | full-bleed kinetic words; distressed wood type |
| `labelGrey` / `serifGrey` | `#A5A5A5` / `#C5C5C5` | light annotation labels; name-card serif lines |
| `displayDark` | `#161616` | giant word on white paper |
| `underline` | `#F8F005` | the one yellow: end-card marker underline |

**Grade.**
- Blacks are **not** lifted (p1 luma 5); collage whites reach 241–255.
- Archive is monochrome; only interview footage keeps colour (sat 0.11, slightly warm).
- No chromatic aberration. Mono grain is re-seeded every drawing (`FINISH.voxEarworm`).

## 3 · Typography (`earwormType`)

| Role | Font | Cap (px @1080p) | Colour | Treatment |
|---|---|---|---|---|
| `digits` ("1976") | Oswald 600 | 205 | accent | per-digit fly-in, then slide together |
| `keyword` ("CHOCOLATE CITY") | Oswald 700 | 124 (88 in context) | accent | typewriter 1 letter / 2 f, or a whole-word pop |
| `bigLetters` ("R & B") | Oswald 700 | 200–230 | accent | masked rise 17 f, staggered, partly behind props |
| `giantWord` ("SPEECHES") | Anton | 177–224 | `#161616` on white / off-white on black | letters scattered → converge (19 f, `[.1,0,0,1]`), photo inside |
| `kinetic` (archival voice) | Anton | 156 → 240 → full-bleed | `#DDDDDB`, paper grain | one word per drawing, behind cut-outs, spelled as heard |
| `caption` (karaoke) | Oswald 500 + letterpress distress | 81 | `#BEBDBE` | per-word rise 95 px + fade 9 f; line pitch 130 px |
| `lyric` | Oswald 600 | 77 | white | word by word with an RGB glitch-in over 2–6 f |
| `label` ("WHUR 96.3") | Oswald 700 | 94 | accent on a `#181818` box | cursor bar → box wipe → scrambled type-on (15 f) |
| `stripLabel` ("FENDER / RHODES") | Oswald 700 | 62 | off-white on a charcoal torn strip | line 2 offset ≈100 px right; L→R wipe, slide or rise; sub-label +5 f |
| `annotation` | Oswald 300, tracking +0.2 em | 32 | `#A5A5A5` + blue X bullet | type L→R at 2 f/letter; exit = dim + un-draw |
| `name` / `nameTitle` / `nameAffiliation` | Oswald 600 / Source Serif 4 / Source Serif 4 italic | 64 / 40 / 27 | accent / `#C5C5C5` | tracking +1 em → 0 with a random-letter decode; build 20–22 f |
| `artistTag` / `songTag` | Oswald 600 / 500 | 45 / 34 | white on slips | revealed by sliding scraps (12 f); torn strip under them |
| `nowPlaying` | Inter 500 | 20 | white, top-left | on with the cut |
| `seriesCard` | Archivo 800 | 128 | grey | glitch-slice build; **design your own series name, never copy a real logo** |

Rules:
- One display word per title card; never more than two type styles on screen.
- Labels name things (an instrument, a person, a song) and sit near a corner of their subject.
- Display words name categories.

## 4 · Layout & depth

- **Full 16:9**, no pillarbox. Compositions are centred.
- Karaoke lines are centred at x ≈ 960 with the current baseline at ≈ 54 % H.
- Labels sit at a subject's corner. Name cards and interview windows sit left or right of centre (interview windows 860–957 × 775–867 px, r 18–28, on a `#0C0C0C` plate).
- **Cut-outs overlap and break masks.** A hat escapes a circle crop; a photo hides letters of a word; kinetic words sit behind cut-outs.
- **Depth only through the camera.** Multiplane cranes move layers at 1.5–4× different speeds; mega pull-backs go from a macro to a top-down collage. Within a hold everything is flat.

## 5 · Motion

- **Cadence.**

  | Layer | Rate |
  |---|---|
  | graphics and camera | 12 drawings/s on 25 fps (holds 2, 2, …, 3) |
  | typographic collage builds | ≈10 drawings/s |
  | caption text | 3 f grid |
  | fades, blurs, opacity and footage | on ones |

- **Camera hits and stops.**
  - `SnapPush` ×1.66 over 50 f, ease `[0.4,0,0.85,0.7]`, **stops dead** on the keyword.
  - Crash push ×2.7 in 11 f.
  - Pull-back reveal ×0.51 in 27 f, peaking on the first spoken word.
  - Holds don't drift (≤ 0.4 %/s).
- **Collage builds unfold.** Pieces grow out of one seed (8–12 f per piece) and push apart to make room ("19 | 76"). Stop-motion placements step through 3–4 poses.
- **Photo slam** (4 f, on a beat); **tumble-assemble** (flip 180° in 8 f, swap every drawing); **pendulum props** (a microphone on its cable settles in 12 f and lands on the vocal onset).
- **Vinyl records spin** at ≈ 8.5° per drawing while music plays.

## 6 · Transitions (with their sounds)

| Transition | Picture | Sound |
|---|---|---|
| `BlurThroughCut` | zoom-blur 6 f out, 14–15 f in, max blur 12 px; the incoming shot at 35 % exposure, settling | sub-boom: onset −8 f, peak on cut +1 |
| `SpinSwap` | 90° clockwise over 40 f, swap at peak speed | whoosh peak on the swap frame |
| `PushThrough` / `PullThrough` | zoom per drawing 1.006 → 1.128 (pull: 0.997 → 0.892), bloom, cut, overscaled head ×1.47 settling in 2 drawings | next scene's music pre-laps the cut |
| `NewsprintMaskWipe` | a newsprint-filled head/profile silhouette grows over 10 f to reveal the next shot | — |
| `Drop` | 27 f fade to black → 13 f black → 17 f fade-up | silence, then new music on the first visible frame |
| `DipToBlack` | 18 f out → 17 f black → 36 f in (once per film) | digital silence + thump |
| `MegaPullBack` | ×6.25 → 1 over 52 f in log space, `[0.70,0.10,0.45,0.90]` | — |
| `GlitchCut` (ending) | 6 f dip → 4 f zoom-blur → hard cut → 18 f glitch build | bass hit on the cut, ticks on the first 2 glitch steps; music to the last frame |
| Dissolve (rare) | 7 f linear dissolve onto a moving camera | the new bed pre-laps |

## 7 · Recipes

| Recipe | Build |
|---|---|
| **Cold open with a year** (see `src/proof/ProofEarworm.tsx`) | black collage ground → "1976" digits fly in per digit (`FlyInGlyphs`) (stagger 0/2/4 f, 28 f assemble) → collage unfolds from a seed between "19" and "76" → `SnapPush` stops dead on the place name → station label (`StationLabel`: cursor → box wipe → scramble) |
| **Song introduction** | the record flies in (≤ 12 f) → needle thump 3 f after it lands → 11 f of crackle → song in hard on a beat → karaoke captions of the vocal → the song ducks 20 dB over 5 f, 8 f before the narrator returns |
| **Expert introduction** | music pre-faded to its floor on her first word → interview window (native fps) → decode name card built from the cut, surname resolving +3…+5 f after its onset → X exit (2 strokes, 3 f) + 5 f fade when her description ends |
| **Concept montage** | `Drop` → a multiplane crane through instrument cut-outs, with objects crossing frame centre on their spoken nouns → strip labels naming the instruments |
| **Music as the subject** | a featured song in the clear (−4…−12 dBr) with spectrum bars or a kick scope; graphics snap to its eighth notes; no narration on top |
| **Ending** | the last narration line names what comes next → 4–5 s of archival voice as kinetic type (phone EQ) → `GlitchCut` to your series card on a bass hit → music to the last frame |

The storyboard engine packages these builds as 12 data-driven recipes (`src/recipes`, [14](14-production-pipeline.md) §3):
- ColdOpenYear, KeywordCut, PhotoCollageUnfold, NameCardInterview;
- KaraokeQuote, GiantWordCard, MontageCrane, MapRoute;
- DocumentHighlight, DataChart, QuoteCard, EndCard.

Claim → recipe choice is in [13](13-story-to-screen.md) §7.

## 8 · Pieces cut from a reference (private)

The look above was measured on the *Earworm* episode, and the kit draws it procedurally: nothing from the episode ships.
To match a reference closely, cut its reusable pieces into the project with the `vox-reference` skill
(`tools/reference/README.md`): `tools/assets/extract_assets.py` (median plates, AI mattes, luma/chroma keys, frame
sequences) and `tools/audio/extract_sfx.py` (voice-safe one-shots with peak sidecars). The pieces stay in the project's
git-ignored `assets/ref/<id>/`, with `catalog.json`, `CATALOG.md`, `PROVENANCE.md` and contact sheets.

| Kind | Typical pieces | Use with |
|---|---|---|
| `grounds/` | median-stacked clean plates (black paper, dark newsprint, white paper) with seamless `-tile` versions; torn irises and strips | `BlackCollageGround`, `TornPaper` |
| `props/` | objects with alpha (records and their spin sequences, radios, phones, microphones, instruments, map cards) | `CutOut`, `Multiplane`, `VinylRecord`, `MapRoute` |
| `photos/` | archival photos with torn borders, as edited | layout reference |
| `marks/` | X marks, hand rings, arrows, underlines, scribbles, spark loops | `XMark`, `HandRing`, annotations |
| `type/` | type treatments as they appear on screen | look reference for the `src/earworm` type components |
| `fx/` | effect sequences (beams, spectrum bars, bokeh, glitch builds, blur transitions) | timing reference for `src/earworm/fx` |
| `frames/` | one full-frame reference per shot | `compare.py`, layout matching |
| `sfx/` | voice-free one-shots (needle drops, ticks, sub booms, swishes, room tone) | storyboard `sfx[]` (placed by peak) |

**Rights.** Cutting a piece out of a video gives no rights: each piece keeps the reference's rights and those of anything
inside it (`PROVENANCE.md`). Only a reference the user owns can ship; anything else is look development, and HANDOFF.md
names a replacement (the shared catalog has free grounds, marks, tape, papers, SFX and maps). Never ship a channel's
logo, bug or wordmark: set `watermark` in the cut list so plates and cut-outs patch it out.

