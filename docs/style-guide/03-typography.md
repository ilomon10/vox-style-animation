# 03 · Typography

## Principles

1. **Editorial voices only.** Serifs carry topics, titles, years, quotes and figures. A heavy grotesque carries concepts (Vox only). Handwriting or a typewriter labels physical things. The paper desk has **no sans-serif at all**.
2. **Type lives on a carrier**: a highlight box, tape, sticky note, slip, flag, book page or clipping. If it sits directly on the paper, it is printed there (ink colour, never pure black). No outlines and no drop shadows on type.
3. **One or two weights per style.** Emphasis comes from *italic* or a highlight, never from colour changes or extra weights.
4. **Size by cap height**, not by font-size. Every size below is the measured cap height at 1080p. Font-size = cap ÷ the font's cap ratio (measured in headless Chrome: `CAP_RATIO` in `src/tokens/type.ts`).
5. **One focal phrase per beat.** At most three labels can be on screen at once.
6. **Numbers.** Big figures use **spaces** as thousands separators ("$43 000 000 000"). Years are big serif numerals, usually highlighted. Quotes use straight `"…"` and attributions start with a hyphen ("-Ferdinand Porsche").

## Fonts

All are Google Fonts (OFL/Apache) loaded through `@remotion/google-fonts` in `src/tokens/fonts.ts`. Each was chosen by side-by-side comparison against reference crops (`analysis/stills/G/fontcmp_*.jpg`).

| Key | Free font | Role | Commercial original / closest |
|---|---|---|---|
| `CASLON` | Libre Caslon Text 400/700 + italic | paper desk years, titles, subtitles, charts, quotes (italic) | Adobe Caslon Pro (our ID: the round italic *v* and the ball-terminal 2 decide it) |
| `CASLON_DISPLAY` | Libre Caslon Display 400 | paper desk years above ~150 px | Big Caslon |
| `GELASIO` | Gelasio 400–700 + italic | paper desk **▶ captions** (bold italic, old-style figures), **quotes**, callout labels, place and name labels | **Georgia Bold Italic** (two analysts independently: "≈ exact, including old-style numerals"); Gelasio is metric-compatible with Georgia |
| `PLAYFAIR` | Playfair Display 400–900 + italic 600–900 | Didone desk slips ("356", "911"), overlay years, editorial title | Didot / Bodoni |
| `VOX_SERIF` | Libre Baskerville 700 | Vox titles, headers, flag labels | **Harriet Display** (Okay Type), Vox.com's headline face |
| `VOX_SANS` | Libre Franklin 600–800 | Vox annotations and concept labels | **Balto** (Type Supply). Vox confirms it uses Balto "in literally every" video; it is not for sale |
| `MARKER` | Gochi Hand | all-caps felt-tip tape labels | hand lettering |
| `MARKER_THICK` | Permanent Marker | chisel marker on sticky notes | hand lettering |
| `SLAB` | Alfa Slab One | dark collage display numerals ("XV") | Clarendon Bold / Rockwell Extra Bold |
| `TYPEWRITER` | Special Elite | dark collage labels ("century") | ITC American Typewriter |
| `OLD_BOOK` | IM Fell English | dates printed on book pages, synthetic old pages | Fell types / Caslon |
| `SPOOKY` | Almendra 700 at `scaleX(.82)` | dark collage end title | unidentified condensed wedge-serif display |
| `NEWS` | Tinos 400/700 | newspaper headline, body and date tags | Times New Roman |
| `MASTHEAD` | UnifrakturCook 700 | blackletter newspaper masthead | Old English Text MT |

Licensed originals (Harriet, Adobe Caslon, Balto if Type Supply licenses it) go in `public/fonts/` and load with `@remotion/fonts@4.0.539`. Swap them in `fonts.ts` and keep the cap-height-based sizing: re-measure `CAP_RATIO` with `src/tools/FontMetrics.tsx`.

## Type roles (sizes @1080p; ×2 at 4K is automatic)

### Paper desk — `paperDeskType`

| Role | Font / weight | Cap → font-size | Colour | Carrier / treatment |
|---|---|---|---|---|
| `year` | Caslon 400 | 126 → 164 px | `#4A2F39` | often in a yellow box; centred; lining figures |
| `title` | Caslon 700 | **69 → 90 px** | `#482F1D` | **inside the `#F2E600` box**: padding ≈34 px T/B, ≈50 px L, ≈32 px R; box revealed by the L→R wipe |
| `subtitle` | Caslon 400 | 33 → 43 px | `#4A2F39` | no box; cap top 54 px below the box; L→R reveal ≈36 px/frame @30, starts ≈5 f after the title |
| `caption` | Gelasio 700 *italic*, old-style figures | 38 → 55 px | `#D8DF2E`/`#FFF36B` on dark footage, `#452F29` on bright | ▶ 55–60 × 64–66 px at x 213–222, text at x ≈ 307–312, baseline 974–977; no box; fades 8–13 f while rising 13 px, on ones |
| `quote` | Gelasio 600 *italic* | 38 → 55 px, line pitch 67 px | `#634B53` (`#4A2A35`) | straight on grid paper; typewriter ≈41 chars/s, or a per-word fade (≈14 f each, 1.7 f stagger) |
| `attribution` | Gelasio 700 | 22 → 32 px | `#745057` | right-aligned to the quote block; "-Name" |
| `placeLabel` | Gelasio 700, CAPS | 90 → 130 px | `#3A3021` | on a `#FCED00`/`#F2E600` box with a speech-bubble pointer (120×57); bar-then-sweep wipe; wipe-off right→left |
| `nameLabel` | Gelasio 600 | 65 → 94 px, 2 lines, pitch 82 px | `#3A3021` | yellow box between two portraits |
| `calloutLabel` | Gelasio 400 *italic* | 47 → 68 px | `#372D13` | yellow box (h ≈100) opening leftward from a leader line's end |
| `typed` | Caslon 400 (+ italic emphasis) | 60 → 78 px, pitch 75 px | `#796259` | typed at 1 char/frame on crumpled paper inside a dashed frame |
| `timelineYear` | Caslon 400 | 116 → 151 px | `#F3F7EB` + glow | slides along a glowing rail on the dark map |
| `slotReel` | Caslon 700 | 45 → 58 px | ink | CRT word reel |
| `figure` | Caslon 700 | 82 → 106 px | `#482F1D` | space-separated thousands; crisp inside a yellow box, soft grey outside |
| `neon` | Caslon 700 | 85 → 110 px | `#ECF103` | on `#050402`; halo ≈45 px |
| `slip` / `slipWord` | Playfair 400 | 90 → 127 px / 41 → 58 px | near-black / plum | on scalloped `#E5E0DC` slips |
| `chartTitle` / `chartAxis` / `chartValue` | Caslon 700 / 400 / 700 | 33 / 18 / 20 | charcoal / charcoal / maroon `#7F1322` | tiny grey source line under the title |

### Vox explainer — `voxType`

| Role | Font / weight | Cap → font-size | Colour | Carrier / treatment |
|---|---|---|---|---|
| `title` | Libre Baskerville 700 | **69 → 90 px** | `#514F53` | printed on the desk paper, centred, baseline at 15–30 % H; **rises from a baseline mask** (12 f) while the camera pushes in |
| `header` | Libre Baskerville 700 | 42 → 55 px | `#555153` | above a card ("Training Data") |
| `flag` | Libre Baskerville 700 | 39 → 51 px | `#201E20` | on a `#DFD02C` flag 259×76 px, ≈18 px side padding; unfurls 16 f |
| `annotation` | Libre Franklin 800 | 48 → 65 px (72 cap at a close framing) | `#464247` | printed on paper; tracking −0.01 em; usually pencil-ringed |
| `cardText` | Libre Franklin 700 | 27 → 36 px, pitch 46 px | `#464247` | on white cards |
| `callout` | Libre Franklin 700 | 31 → 42 px | `#D0C133` | on a black card with a matching 3–4 px L-leader |
| `tape` | Gochi Hand, ALL CAPS | 40 → 70 px | `#433F30` + second word `#596B8D` | on lime/black tape; write-on ≈1 char per drawing; ±3° per-letter wobble |
| `sticky` | Permanent Marker | 69 → 92 px | `#4E4A45` | on a `#F3DA44` sticky note; revealed by the peel |

Rules: **serif = topic, sans = concept, handwriting = provenance/label**. No drop shadows, no outlines, and type never floats.

### Dark collage — `collageType`

| Role | Font | Cap → font-size | Colour | Treatment |
|---|---|---|---|---|
| `display` | Alfa Slab One | 235 → 302 px | `#923F41` | printed on cream paper with letterpress speckle; **rises from behind a horizontal mask** (249 px in ≈11 f) |
| `label` | Special Elite, tracking +0.1 em | 36 → 51 px | `#6E2426` | irregular type-on on twos, glyphs at f 0, 2, 6, 8, 10, 14, 16 |
| `date` | IM Fell English | 55 → 81 px | `#3B3533` on `#ACA39D` | printed on a book page with a 3 px rule ≈17 px below; revealed by a page turn |
| `endTitle` | Almendra 700, `scaleX(.82)`, caps | 226 → 338 px, line pitch 257 px | `#B66D24` | **boils**: per-glyph random offset (σ 7 × 4.6 px, clamp 12) + rotation ±3–6°, new every 6 f |

### Vox editorial — `editorialType`

| Role | Font | Cap → font-size | Treatment |
|---|---|---|---|
| `title` | Playfair Display 800 | 65 → 92 px (102 cap after the snap zoom) | chunked pop-on (irregular glyph chunks over 3–4 drawings), mustard highlighter under it, right→left wipe-off |
| `byline` ("BY") | Libre Franklin 600, caps | ≈0.4× title cap | appears at once with the wordmark |
| `headline` | Tinos 700 | 53 → 81 px, centred, tight leading | centre-out soft-mask reveal (feather 30 px, 0.4 s) |
| `body` | Tinos 400 | 33 → 50 px, pitch 47 px, column 680 px | top→bottom line wipe (0.4 s) |
| `tag` | Tinos 400 | 26 → 40 px, paper colour on an oxblood `#7B3C3A` box 296×64 | fades 0.3 s |
| `masthead` | UnifrakturCook 700 | 63 → 68 px | after a 3 px hairline rule; fades 0.2 s, +3 f after the text |

*(body, tag and masthead sizes were re-fitted against the reference layout in the editorial proof shot: palette ΔE 2.0–2.5; `analysis/compare/proof-editorial.md`)*

### Vox light paper — `voxLightType`

Measured on the 2020–26 explainers (`analysis/vox-framework-coverage.md` §2.4). Sentence case, not condensed caps; size still carries the hierarchy.

| Role | Font | Cap | Treatment |
|---|---|---|---|
| `title` | Libre Franklin 800 (`VOX_SANS`) | 92 px | heavy grotesque statement cards (CR); hard on or rising from a mask |
| `quote` | Source Serif 4 600 (`TEXT_SERIF`) | 40 px, leading 1.4 | quote cards, read along with a lemon highlighter |
| `attribution` / `label` | Source Serif 4 600 | 30 px | chart and map labels (EL), lead their noun by 4–16 f |
| `caption` | Libre Franklin 800 | 30 px | short captions on prints |
| `source` | Source Serif 4 600 | 20 px | `SourceLine`, bottom-left at x 93, baseline 1026 (EL) |
| `small` | Inter 500 (`SMALL_SANS`) | 15.3 px | corner source tags, chart sources (AM, CR) |

Packaging type (all looks): lower-third name Source Serif 4 **700** at cap 58 with an Inter 600 role at cap 29 (`LowerThird`); credits roles Source Serif 4 at cap 22 over Libre Franklin 700 caps names at cap 23 (`CreditsPanel`); series ident Archivo 800 (`EXTENDED`) at cap 94 (`SeriesIdent`). Never set a real series mark: use your own series name.

## Text treatments (motion details in 06 and 07)

| Treatment | Style | Spec | Component |
|---|---|---|---|
| Highlight-box wipe | paper desk | box starts as a 24 px bar, crawls 10 f, covers 50 % in the next 5 f, long tail; 32 f @30; `cubic-bezier(.75,.4,.05,.9)`; text clipped with the box; starts 10 f after the cut | `HighlightBox` |
| Highlight on a figure | paper desk | 20 f, `(.7,.3,.2,.8)`; text sharpens inside the box | `HighlightBox sharpenInside` |
| Highlighter swipe | Vox | multiply `#FFF80F`, height 1.3× cap, overhang 8–12 px, ragged ends, 12 f, `(.3,0,.5,1)`; starts at the camera's peak speed | `Highlighter` |
| Dry-brush highlighter | editorial | `#BB923A`, height 1.6–1.8× cap, from 0.1 em before to 0.2 em past the text; **accelerates** `(.11,0,.5,0)`; 0.3 s inline, 0.9 s for the title; linear fade-out 2.4 s | `Highlighter variant="editorial"` |
| Title rise from mask | Vox, collage | rises ≈1 line-height from behind the baseline, 12 f, `enter (.16,1,.3,1)` | `TitleRise` |
| Typewriter | paper desk quote | ≈41 chars/s; the newest glyph shows at 50 % for one drawing | `Typewriter` |
| Irregular type-on | collage | glyphs at 2–4 f gaps on twos (≈9 chars/s) | `Typewriter schedule` |
| Handwriting write-on | Vox | ≈1 character per drawing (12 chars/s), each glyph wiped L→R within its drawing; underline grows with the word | `HandwritingWriteOn` |
| ▶ caption | paper desk | text opacity `.03 .15 .28 .40 .53 .67 .74 .80 .86 .88 .97 1` (ease-out quad) on ones; ▲ can rise 108 px/10 f then spin 270° CCW/10 f into ▶; fade-out 7 f ending exactly on the cut; may persist across a cut | `VideoCaption` |
| Boil title | collage | new random per-glyph offsets every 6 f | `BoilText` |
| Centre-out reveal | editorial | feathered mask half-width 0.30, 0.68, 0.94, 1.0 over 0.4 s | `CenterOutReveal` |
| Line wipe | editorial | body revealed top→bottom ≈150 px/frame @10 fps, 0.4 s | `LineWipe` |
| Wipe-off erase | editorial | hard vertical edge right→left; wordmark erodes through a grunge dissolve | `WipeOff` |
| Neon | paper desk | core + halo, the halo halving every ≈8 px | `NeonText` |
| Slot reel | paper desk | word list (pitch 54 px) scrolls and decelerates onto the target in ≈20 f; other words ≈20 % opacity | `SlotReel` |
