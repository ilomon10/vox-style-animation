# 01 · Style DNA

## What the style is

The look is a **hand-made, photographed collage**. Archival photographs, engravings and printed type are cut out and arranged on paper, then shot under a camera that drifts and pushes. The animation is stepped like stop motion, and the result is finished like film or a scan.

The appeal comes from three tensions:

1. **Precise editorial design vs. analogue imperfection.** Typography and layout are tight, but everything is printed, taped, rough-cut, grainy and colour-fringed.
2. **Snappy vs. stepped.** Moves are fast exponential ease-outs, yet they step at 12 drawings/s, so they feel hand-animated rather than slick.
3. **Restrained colour vs. one loud accent.** The world is neutral (greys, creams, sepia photos), and one accent (yellow or crimson) tells you where to look.

## Signature devices (ranked by how much they make it "read" as the style)

### Paper desk (`paperDesk`)

| # | Device | Spec |
|---|---|---|
| 1 | **Highlight box behind serif title** | flat `#F2E600` box, dark-brown Caslon text revealed by an L→R wipe that starts as a 24 px bar, 32 f @30 `boxWipe` |
| 2 | **RGB split, no animated grain** | uniform diagonal split (R down-right, B up-left, ≈1–2 px; desk stills up to ±4), constant over time; thin black lines read plum; held frames are bit-identical |
| 3 | **12 fps graphics on a 30 fps timeline** | holds alternate 3,2,3,2 frames; footage and caption fades on ones |
| 4 | **Taped prints on a desk** | 4.7 % white border, opaque yellow tape (3:1, torn zig-zag ends), drop shadow (10, 8, 13 px, 0.43) |
| 5 | **Hard yellow offset echo** | duplicate silhouette `#F2E600` at (+9,+12) behind cards/cut-outs; a slightly lagging echo for figures |
| 6 | **Product/fact card template** | title box + subtitle + centred cut-out on cream paper, identical timing every time |
| 7 | **▶ caption over footage** | bold italic serif lower-left, no box, tone inverted by background, persists across cuts |
| 8 | **Cuts hidden in motion** | zoom-throughs, scale momentum across slideshow cuts, cut-outs already mid-move on frame 1, flash-shrink exits |
| 9 | **Hand-drawn rings** | maroon `#7F1322` or yellow, tapered, open end, drawn ≈22°/frame |
| 10 | **Scalloped stamp slips + Didone numerals** | "356", "911" on `#E5E0DC` slips with 22 px scallop pitch |
| 11 | **Neon serif on near-black** | `#ECF103` core with a ≈45 px halo ("SUV", "2002") |
| 12 | **Hold boil** | the artwork jitters 0.4–1.1 px at 6 fps, so holds never freeze |
| 13 | **Overscaled settle + punch-in** | shots open ×1.3–1.8 too large and settle in 8–14 f; many end with an accelerating 5–12 % punch-in into the cut |
| 14 | **Callout trio** | yellow multiply disc → leader line → italic label box opening from the line end |

### Dark collage (`darkCollage`)

| # | Device | Spec |
|---|---|---|
| 1 | **On twos + per-frame film weave** | art on even frames; the whole frame translates σ 1.3 px every frame (white noise) |
| 2 | **Flat offset echo silhouettes** | crimson `#8A0315` duplicate at (−32,−25) px, 0 blur; cream page-disc echo behind the moon |
| 3 | **Drop/rise-in props on a locked stage** | expo ease-out, 90 % of travel in 5–10 f; the camera never pans |
| 4 | **Scratched black card with lighter worn edges** | corners +18…+37 L brighter than the centre (an inverted vignette) |
| 5 | **Selective red** | ≈91 % greys, ≈7 % reds; orange only on the end card |
| 6 | **Theatrical tableau** | centred hero, props on a floor line at ≈76 % H, symmetric staging |
| 7 | **Old-film damage loop** | bright dust and scratches, 12-drawing loop on twos |
| 8 | **Lightning double strike** | exposure + blur flashes 8 f apart |
| 9 | **Kit-bashed transitions** | crumple-unfold (on fours), zoom-through, zoom-blur crash, torn-paper burst |
| 10 | **Boiling title** | each glyph re-randomised every 6 f |

### Vox explainer (`voxExplainer`)

| # | Device | Spec |
|---|---|---|
| 1 | **Dotted notebook paper desk from straight above** | `#D6D3D3`, dot pitch 32 px, everything lies flat on it |
| 2 | **Yellow is the only accent** | sticky `#F3DA44`, lime tape `#DDD031`, highlighter `#FFF80F` (multiply), marker rings |
| 3 | **Handwritten all-caps tape labels with paper clips** | second word in blue-grey marker `#596B8D` |
| 4 | **Draw-on annotations** | pencil rings (3–4 loops), sketchy double-line arrows, marker underline, X cross-out, "??" |
| 5 | **Highlighter swipe** | multiply band 1.3× cap height, 12 f |
| 6 | **Inset magnification** | pin dot → leader/cone → circle of red/green dots popping with +1.6 % overshoot |
| 7 | **Flat vector science diagrams on black cards** | `#353336` card with a 10 px dot mesh, beside real photo props |
| 8 | **Serif title rising from a baseline mask while the camera pushes in** | 12 f rise, 32 f push |
| 9 | **Sticky-note peel** | 8 f, replaces or prefixes a word ("EPI" + Genetics) |
| 10 | **2D desk camera** | constant drift, eased pushes to the focal word, cuts landing on a moving camera |
| 11 | **Powers-of-ten zoom-outs with radial blur** | DNA → cell → organism |
| 12 | **Printed-and-photographed finish** | on twos, mono grain per drawing, radial lens CA, lifted matte levels |

### Vox editorial (`voxEditorial`)
Single crumpled sheet, centred editorial serif title, **mustard dry-brush highlighter that accelerates and stops dead**, snap zooms (×1.565 in ≈5 f, easeInQuart, no blur), centre-out soft text reveal, top→bottom body wipe, newspaper clipping with oxblood date tag and blackletter masthead, no grain, 1-in-3-frame paper exposure pulse, very compressed warm matte range (`#3F3930`–`#C6C3B5`).

## Do / Don't

| Do | Don't |
|---|---|
| Put type on a carrier: a highlight box, tape, slip, sticky note or page | float type on the background with drop shadows or outlines |
| Use one or two weights and get emphasis from italic or a highlight | use colour, weight or size changes everywhere for emphasis |
| Step graphics at 12 drawings/s | animate graphics on ones at 30/60 fps (it looks like After Effects defaults) |
| Ease out exponentially and land hard | use bouncy springs or elastic overshoot |
| Hard-cut on movement | crossfade between shots |
| Use real archival photos and engravings, cut out | use flat vector illustrations as the main imagery (except Vox diagrams on cards) |
| Keep blacks lifted and whites capped; ink warm-black | use pure `#000` ink or a pure `#FFF` paper |
| Keep the camera breathing (drift) and use pushes to point | lock-off holds of more than 1 s (except collage tableaux, which have weave) |
| Put the finish on the whole frame (split/CA, grain, vignette) | apply the finish per element; grain or CA must be global and consistent |
| Use soft shadows for the paper desk and Vox desk | put soft shadows on dark-collage cut-outs (use flat echoes) |
| Write years as big serif numerals, often highlighted | use sans-serif numerals for dates in the paper desk |
| Use thousands separators as spaces in big figures ("43 000 000 000") | use 3D, gradients, glossy UI or glow (except the neon device) |

## QA checklist (before you render the final)

- [ ] Every graphic animation steps at 12 drawings/s. Render 6 consecutive frames to check: pairs (24 fps) or 3/2 holds (30 fps).
- [ ] Nothing enters with a plain fade (captions and footage excepted).
- [ ] The accent covers 2–8 % of the frame. Palette ΔE vs. a reference frame is < 10 (`tools/analysis/compare.py`).
- [ ] Ink and paper are within the style's levels. Blacks are lifted where the style says so.
- [ ] Finish is on: split/CA visible on high-contrast edges at 4K, grain monochrome, vignette or worn edges present.
- [ ] Camera never fully still for more than 1 s (Vox), or film weave is on (collage).
- [ ] Every cut has motion on at least one side, or is a deliberate static hard cut on a new sentence.
- [ ] Beats land 0.2–0.5 s after narration pauses. No more than 3 labels on screen at once.
- [ ] All raster assets are ≥ 2× their display size at 4K, and provenance is recorded.
