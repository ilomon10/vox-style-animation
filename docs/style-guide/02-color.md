# 02 · Colour

All values are pixel medians measured on native-resolution reference frames. Token names match `src/tokens/colors.ts`; in components, read them with `useTheme().colors`.

## Universal rules

1. **Neutral world, one accent.** Neutrals (paper, greys, sepia photos) cover 85–95 % of the frame. The accent covers **2–8 %** and always marks the focal point of the beat.
2. **Ink is never black and paper is never white.** Ink is warm brown, plum or warm grey (`#482F1D`, `#4A2F39`, `#514F53`, `#4C4844`). Paper is cream or grey (`#F9EFE6`, `#D6D3D3`, `#B3ACA0`).
3. **Saturation lives in the graphics, not the photos.** Archival photos are B/W, warm-tinted or desaturated. The yellow box, red echo and data dots carry the chroma.
4. **Grade the whole frame** with the style's levels and warmth (see Grade below). Don't colour-correct elements one at a time.
5. **Data colours** (Vox): red `#C03D40` means "on / methylated / bad" and green `#4AB541` means "off / good". Use the darker variants on dark grounds.

## Paper desk (`paperDesk`)

| Token | Hex | Role | Share / where |
|---|---|---|---|
| `paper` | `#F9EFE6` | page centre (falls to `#CEC6C0` at the corners through the vignette) | 53–87 % of graphic shots |
| `paperQuote` | `#FDF4EC` | grid-paper quote card | — |
| `desk` | `#EFE3DA` | desk surface under the scrapbook flyover | 52–59 % in desk shots |
| `grid` | `rgba(90,80,70,.12)` | 1 px grid lines, 35 px pitch | — |
| `photoBorder` | `#F5EFEB` | print border, cooler and lighter than the desk | — |
| `cardBorder` | `#EFE7D2` | polaroid-like card border on black | — |
| `slip` | `#E5E0DC` | scalloped stamp label slip | — |
| **`highlight`** | **`#F2E600`** | **highlight box behind title text (the accent)** | 2–8 % |
| `tape` | `#F9EC00` | opaque tape and stamp tape | ≈2 % |
| `captionYellow` | `#D8DF2E` | caption text over dark footage (slightly greener) | < 1 % |
| `neon` | `#ECF103` | neon year/label core on near-black (halo fades through `#4E5400`) | 0.5–3 % |
| `inkBrown` | `#482F1D` | title text inside yellow boxes | — |
| `inkPlum` | `#4A2F39` | subtitles and body on paper | — |
| `inkQuote` / `inkAttribution` | `#634B53` / `#745057` | quote text / attribution | — |
| `inkCaptionDark` | `#452F29` | caption text over bright footage | — |
| `charcoal` | `#33332F` | chart bars, dark cut-out areas | 4–10 % |
| `maroon` | `#7F1322` | hand-drawn rings, chart value labels (the second accent) | 0.2 % |
| `night` | `#050402` | black backgrounds (photo walls, neon scenes) | 57–77 % of those shots |

**Grade.**
- Warm: neutral R−B is +2 in darks, +8 in mids and +16 in lights (warm highlights over neutral shadows). Mean saturation 0.21.
- Graphics never reach pure black (darkest ≈`#181812`) or pure white (paper peaks `#FDF8F0`). Footage keeps its true black.
- Archival B/W photos are **warm-tinted** (mids ≈`#98948F`, R−B +10). Colour footage stays saturated, with a slight warm push.
- Uniform RGB split on top (05).

## Dark collage (`darkCollage`)

| Token | Hex | Role |
|---|---|---|
| `plate` | `#2B2B2B` (p5 `#0E0E0E`, p95 `#5C5C5C`) | scratched black card |
| `plateDeep` | `#131212` | darkest plate areas |
| `grey1…grey5` | `#4C4A49` `#63605F` `#817E7C` `#9F9C99` `#BFBDB8` | the B&W cut-out ramp (≈46 % of pixels) |
| `cutoutWhite` | `#E4E0DC` | the brightest a cut-out gets (L≈200–216) |
| `paperCream` / `crescent` | `#D0CABF` / `#B8B6B1` | torn paper and book pages / cream echo disc |
| **`crimsonEcho`** | **`#8A0315`** | **flat offset silhouette (the accent)** |
| `bloodMoon` | `#5B0D09` | hero accent disc |
| `seatRed` / `cushionRed` / `damaskWine` | `#710202` / `#64191A` / `#462528` | spot reds in props and textiles |
| `cherry` | `#AC0E08` | brightest red; tiny accents only |
| `displayRed` | `#923F41` | printed display type ("XV") |
| `routeMaroon` | `#581C1C` | map route line, pins and labels |
| `fogRed` | `#5D1F1E` | full-frame red smoke (sat 0.40, the only saturated shot) |
| `gilt` | `#AE783E` | picture frames |
| `titleOrange` | `#B66D24` | end title only (Halloween orange) |
| `floorEllipse` | `#6F6461` | flat floor/contact ellipse |
| `stickerWhite` | `#F4F4F4` | white sticker outline (pins) |

**Grade.**
- About 91 % neutral greys, 7 % reds and 2 % orange/brown.
- Photos are **fully desaturated** (sat 0.000–0.006), with faces carrying a slight warm tint (R−B +10).
- Black is lifted to ≈`#0C0B09`–`#0E0E0E`; white is capped at L≈216 (`#DEDAD4`).
- No chromatic aberration, duotone or halftone.

## Vox explainer (`voxExplainer`)

| Token | Hex | Role |
|---|---|---|
| `paper` / `paperHi` | `#D6D3D3` / `#E6E5E6` | dotted notebook paper |
| `dot` | `#4A4A4A` @ 35 % (reads `#8F868E`) | dot grid |
| `page` | `#BFBEBE` | journal page (darker than the desk) |
| `printBorder` | `#E1DDDB` | photo print margins |
| `kraft` | `#ADA9A6` | kraft card, masking tape |
| `card` / `board` | `#353336` / `#1F1D20` | black diagram card / dark textured board |
| `bar` | `#1F1F1F` | 4:3 pillarbox bars (optional) |
| `ink` / `inkSans` | `#514F53` / `#464247` | serif text / grotesque annotations |
| `inkOnYellow` | `#201E20` | text on flags and sticky notes |
| `graphite` | `#5F5C62` | pencil rings, sketch arrows |
| `marker` / `markerBlue` | `#433F30` / `#596B8D` | felt-tip handwriting / second word on tape labels |
| **`sticky`** | **`#F3DA44`** | **sticky notes (warm yellow, the accent)** |
| `stickyBack` | `#A5931F` | folded back face (−35 % luma) |
| `tape` / `tapeBlack` | `#DDD031` / `#221F21` | lime (greenish) tape label / black tape |
| `flag` | `#DFD02C` | flag labels |
| `highlighter` | `#FFF80F` | highlighter pigment, **always `mix-blend-mode: multiply`** (reads `#C7C50A` on page paper) |
| `markerRing` | `#D8C92B` | dry-brush rings and swooshes |
| `sansYellow` | `#D0C133` | callout type and leader on black cards |
| `red` / `redDark` | `#C03D40` / `#A82136` | data "on" (light / dark ground) |
| `green` / `greenDark` | `#4AB541` / `#31BF29` | data "off" |
| `blue` | `#4D6DB0` | a single extra data colour |

**Grade.**
- Neutral world: desk saturation 0.037, R−B +2 (even mids R−B +0.7).
- Lifted matte levels: black ≈`#272622` (p1 luma ≈40), white ≈`#E9E7E7`.
- Photos keep their natural colour (no mono or duotone).
- Radial lens CA (05).

## Vox editorial (`voxEditorial`)

| Token | Hex | Role |
|---|---|---|
| `paper` | `#B3ACA0` | crumpled sheet |
| `ink` | `#4C4844` | all text, rules, photo border |
| `highlighter` | `#BB923A` | mustard dry-brush, multiplied under the ink |
| `tag` | `#7B3C3A` | oxblood date tag; its text is set in the paper colour |
| `photoMid` | `#807972` | B/W photo, multiplied onto the paper |

**Grade.** A very compressed warm-olive matte: all content sits between luma 60 (`#3F3930`) and 194 (`#C6C3B5`). R−B is about +20 in every band and G−(R+B)/2 is +4…+6.

## Vox light paper (`voxLight`)

Measured on three official Vox explainers (2020 Electoral College, 2024 clean energy, 2026 creatine; `analysis/vox-sample/`, family A in `analysis/vox-framework-coverage.md` §2.4). The ground is flat light-grey paper with no film finish; footage and archival stay in their **native colour**.

| Token | Hex | Role |
|---|---|---|
| `ground` / `groundAlt` | `#EAEAEA` / `#E9E9E9` | light grey paper (CR, CE); EL adds ghost newsprint at 5–8 % contrast (`paper: "lightGhost"`), CR/CE a faint grid (`"lightGrid"`) |
| `page` | `#F6F6F6` | a printed page lying on the ground |
| `ink` / `sourceInk` | `#262626` | all text and source lines (EL reads darker, `#090B0B`) |
| **`highlighter`** | **`#FBFF0B`** | **lemon, the accent**: multiplied under text (reads `#E4EC0B` on CR's grey page, `#FBF303` on EL white) |
| `ring` | `#E6875A` | EL swing orange, the one warm annotation colour |
| `grid` | `#262626` @ 6 % | the faint grid |
| packaging | lemon `#FDF203` (lower-third bar), credits panel `#292929`, roles `#D5D5D5`, names `#AFD2D8`, rule dots `#F9FF0E` | the house packaging measured on all six sample videos |

Data colours are content, not look: EL uses party red `#E04B4A`, blue `#5577A6` and swing orange `#E6875A`. **Finish:** none (no grain, weave, vignette or chromatic aberration). Drawing rate 24 (on ones); CR's graphics run at ≈ 15 drawings/s and CE's at 12, so set `drawingRate` per project when you match those.

## Accent usage by beat

| Beat type | Paper desk | Dark collage | Vox explainer |
|---|---|---|---|
| key year / number | yellow box behind serif numerals | red printed numeral on cream paper | serif on a yellow flag or sticky |
| key phrase in a document | yellow highlight box (multiply on scans) | — | highlighter swipe (multiply) |
| point at a detail | maroon or yellow hand-drawn ring; yellow disc + leader | red scribbles, red route line | pencil ring, yellow marker ring, inset circle |
| separate a figure from the ground | yellow offset echo (+9,+12) | crimson offset echo (−32,−25) | white print border + contact shadow |
| emphasis on black | neon yellow glow | blood-red disc (moon) | yellow callout type on a black card |
