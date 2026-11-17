# 15 · The scientific scrapbook look (`voxScrapbook`)

Measured frame by frame on a Vox brand-studio explainer about the brain and travel (4:16, 23.976 fps, 2022; report:
[`analysis/vox-sample/vox_braintravel.md`](../../analysis/vox-sample/vox_braintravel.md)). It reads like a naturalist's
scrapbook:
- **watercolour paper in one colour per chapter** and one per person;
- torn scraps and title strips with soft shadows;
- old engravings multiplied onto the paper;
- **specimen plates** with "fig." labels on leaders and a magnifier;
- paper sheets that slide in and out from a corner.

Theme: `<StyleProvider style="voxScrapbook">`, or `"look": "voxScrapbook"` in a storyboard, which brings the `scrapbook`
timing profile (doc 11 §10). The recipes are in `src/recipes/scrapbook/` and their devices in `src/scrapbook/`. The
example is `video-projects/example-cab-brain`, and the [scrapbook blocks](../../examples/README.md#the-scrapbook-collection)
show each recipe.

The kit draws the look with public-domain pictures and procedural paper and sound. Nothing from the measured video
ships, and the look carries no Vox mark (`NOTICE.md`).

## 1 · Signature devices (built)

The device numbers (M…) are the report's (§5). The frame counts are at 24 fps; the kit animates at 12 drawings/s.

| Device | Block | Recipe | Measured | Kit |
|---|---|---|---|---|
| M1 paper-sheet slide (8×: 3 in, 5 out) | [paper-sheet-slide](../../examples/blocks/paper-sheet-slide.md) | transition `paperSlide` | in: from a corner, −25° → 0 in 8–10 f, ease-out (coverage 3 → 43 → 74 → 85 %); out: towards a corner, +10…15° in 10–13 f, accelerating | in 10 f, out 12 f (+12°); a paper swoosh peaks +2 f (in) or +4 f (out) |
| M7 torn-paper chapter card (4×) | [torn-paper-chapter-card](../../examples/blocks/torn-paper-chapter-card.md) | `ChapterCard` | engraving fades 6 f, documents rise 8 f, "Chapter N" drops 4 f, the title strip wipes in 8 f; 3.1–4.0 s in all | the same order; event `title` on the spoken title |
| M17 torn-paper stat stack | [torn-paper-stat](../../examples/blocks/torn-paper-stat.md) | `PaperStat` | three scraps (calendar page, grey strip, kraft tile) slide in about 4 f apart over 18 f | `value`, `context` +4 f, `payoff` +10 f |
| M18 stamped stat on ephemera | [stamped-stat](../../examples/blocks/stamped-stat.md) | `StampedStat` | push into the page ×2 → 1 in 12 f, ease-out; the number is readable +18 f after it is said; the ink re-inks every 24 f | page rises 10 f, push 1.3 → 1 in 12 f, stamp pops in 3 f, re-ink every 24 f |
| M3 specimen plate | [specimen-plate](../../examples/blocks/specimen-plate.md) | `SpecimenPlate` | the subject tumbles +45° → 0 with a scale-up in 14 f, a disc unfolds (20 f), the magnifier and its label fade in 6 f, the source line 4 f later; a swap on a word (16 f) | the same, the disc in 12 f; `swap` changes the subject and/or the labels |
| M12 comparison of two specimens | [specimen-comparison](../../examples/blocks/specimen-comparison.md) | `SpecimenCompare` | a dashed rule at x 960; a pull-back of ×0.6 in 10 f reveals the second half | `reveal: "split"` or `"pullback"` (×1.6 → 1 in 10 f) |
| M9 specimen-label interview (6 shots) | [specimen-interview](../../examples/blocks/specimen-interview.md) | `SpecimenInterview` | a deckle print at x 167–1332, y 100–958; the label is there from the first frame, with no animation | the same window and label; the clip's sound goes in the storyboard's audio plan |

## 2 · Colour (`src/tokens/colors.ts` → `voxScrapbook`)

- **Colour carries the structure.** Each chapter card and each person gets one paper colour, and keeps it.
- **No single accent.** Pastel data marks (salmon `#F69585`, mint `#BCDDD4`, blue `#81B2C1`) appear only on data.
- **Mixed grading.** People are black-and-white, engravings are multiplied warm grey, footage and stock photos keep their
  native colour (`PHOTO_GRADE.voxScrapbook`: `bw` or `color`).

| Role | Tokens |
|---|---|
| paper grounds | `white` `#EFEFEF` · `pink` `#E1D0C6` · `mint` `#A2C0B8` · `blue` `#72A0B7` · `coral` `#E68B7E` · `cork` `#AC9560` · `creamMap` `#EBDABB` · `sky` `#99B8E4` |
| scraps and strips | `stripBlue` `#BFD0E2` (title strip) · `calendar` `#E2E3E3` · `greyStrip` `#C4C1B8` · `kraft` `#BDA991` · `page` `#E7E2DC` · `disc` `#D8C3B5` |
| ink | `slate` `#314050` (chapter title) · `chapterInk` `#261A12` · `labelInk` `#4C3F38` · `diagramInk` `#4A4A4A` · `frameRule` `#3A3A3A` · `engravingInk` `#80726C` · `statInk` `#454544` · `kraftInk` `#342C21` |
| stamps | `stampPurple` `#6B598C` · `stampRed` `#C75C4B` |

## 3 · Typography (`voxScrapbookType`)

Cap heights are design px on a 1080-px frame. The fonts are the nearest free equivalents (`src/tokens/fonts.ts`).

| Role | Font | Cap | Measured |
|---|---|---|---|
| `chapterTitle` | Source Serif 4, 700, slate, halftone ink | 122 | a sharp bold text serif with halftone dots, cap 10.8–11.8 % |
| `chapterNumber` | Source Serif 4, 600 | 39 | "Chapter One", cap ≈ 3.6 %, a hairline rule after it |
| `diagramTitle` | Libre Caslon Text, caps, tracking +12 % | 22 | tracked old-style small caps, cap ≈ 2.0 % |
| `fig`, `labelName`, `labelRole` | Libre Caslon Text (name bold; roles tracked +5 %) | 30 / 44 / 30 | an old-style serif: name ≈ 4.1 %, roles ≈ 2.8 % |
| `statNumber` | Source Serif 4, 600 | 130 | a transitional serif, ≈ 12 % |
| `statPayoff` | Oswald 700, caps | 118 | a condensed heavy grotesque on kraft, ≈ 11 % |
| `stamp` | Anton | 250 | a distressed heavy condensed sans, ≈ 23.6 % |
| `source` | Inter, caps | 19 | a neo-grotesque, cap 1.7–1.9 %, bottom left at x ≈ 97 |

Serif carries every name and label; sans appears only in the payoff, the stamp and the source lines. There are no
subtitles or kinetic captions.

## 4 · Layout

- **Plate:** a rounded hairline frame at x 72–1848, y 75–1003; the title centred above it (y ≈ 30–55); the source line
  under it at x ≈ 97.
- **Interview:** the print on the left 61 % of the width; the label column at x ≈ 1405, on a leader from the picture.
- **Comparison:** the dashed rule at x 960; titles at y ≈ 80–200, the legend at y ≈ 870–970.
- **Chapter card:** a cluster at centre-left (x ≈ 170–1550), the title strip across the middle (y ≈ 320–765).
- **Depth:** flat, with small soft shadows. From the bottom up: ground, engravings (multiply), documents and prints,
  people, type tiles, magnifiers and badges.

## 5 · Motion and finish

- **12 drawings/s** (twos at 24 fps). Live footage runs on ones.
- **Entries:** drop, slide, rise, tumble and scale-pop, all 4–16 f and mostly ease-out; engravings and labels fade.
  **Exits:** mostly hard cuts; sheets slide out, accelerating.
- **Camera:** static holds with slow 2–3 % pushes on collages; trucks of 900–1370 px in 16–18 f, ease-in-out.
- **Annotation:** a magnifier circle with tangent leaders, labels on leaders, numbered callouts. No drawn rings or arrows.
- **Finish** (`FINISH.voxScrapbook`): a fine grain re-seeded every 6 f (4 Hz) and watercolour paper on every ground
  (`paper: "watercolour"`). The stamp's ink changes every 24 f. No weave, chromatic aberration, vignette or dust.

## 6 · Sound (profile `scrapbook`)

- **Cuts lead the narrator's phrase** by about 6 f (median −5.7 f). There is no word or beat lock, and reveals fall within ±8 f
  of their keyword.
- **Bed:** a continuous, **unducked** bed about 9 dB under the voice, with one cue per chapter. Chapter joints carry a short
  hole (4–13 f) or a swell.
- **SFX:** sparse, about 2 per minute, placed on picture events and off the beat:
  - paper swooshes on the slides (+2…+6 f);
  - literal foley on objects;
  - a chime on the end card.

  A fast montage gets none.
- **Kit sounds** (procedural, CC0; `tools/audio/make_sfx.py`): `paper_swoosh`, `paper_flick`, `stamp_thud`,
  `sub_swell` and `chime`.

Doc 11 §10 has the full profile table.

## 7 · Not built yet

From the report's ranking (§9), in order of reuse:
- `person-intro-collage` (a die-cut portrait with a book and prints);
- `accelerating-montage` (cuts from 7 f down to 3 f under a crumpled print);
- `ephemera-title` (word tiles held in silence);
- `map-dots-ring`, `figure-card-list`, `walker-swap`, `pov-mask`, `panorama-truck`, `sightline-wedge`,
  `dot-growth-badge`, `pack-items`, `silhouette-pullback` and `window-portrait`.

Two finishing pieces are also missing: the paper mat around full-frame footage, and voice pre-laps of up to 5 s over the
next picture. Until they exist, build those moments by hand from `src/scrapbook/kit.tsx` (`ScrapGround`, `Scrap`, `Pic`,
`SpecimenLabel`, `PlateFrame`) and the camera in `src/motion`.

## 8 · Pieces from a reference (private)

As with doc 12 §8: to match a reference of your own closely, cut its pieces into your project with the `vox-reference`
skill. They stay in the project's git-ignored `assets/ref/`, and a piece cut from a video keeps that video's rights.
