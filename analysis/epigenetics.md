# Vox "Epigenetics" explainer: reverse-engineered house style (`epigenetics`, f0–1224, 0–51.05 s)

> Analyst: E. Sources reviewed: all 13 keyframe sheets (`sheets/epigenetics/sheet_001–013`, 207 keyframes), 26 full-rate strips (`strips/epigenetics_*`), 23 native-resolution crop strips and 33 native stills/crops (`stills/E/`), `metrics/epigenetics.csv` + `_shots.md/.json`, `palettes/epigenetics.json`, and the audio envelope. The source is 1920×1080, so source px are the same as @1080p. Frame index f starts at 0, and t = f / 23.976. "≈" marks an estimate. Every x coordinate is a full-frame coordinate. The picture is a **4:3 window at x = 240–1679** (see §5).

## 1. Summary of the look
- **4:3 picture inside 16:9.** The active image is 1440×1080, centred, with flat **#1F1F1F** pillarbox bars (std 0). The only branding is a static **"Vox" wordmark bug in the right bar** (x 1716–1888, y 31–114, 173×84 px, #CFCFCF). There are no lower-thirds or logos inside the picture.
- **A researcher's desk seen from straight above.** Light-grey dotted notebook paper (#D6D3D3, dot pitch ≈32 px, dots ≈4–5 px #8F868E) is the ground plane in 10 of 13 shots. Everything lies flat on it as a cut-out: photo prints with off-white deckled borders, black diagram cards, lime tape, masking tape, paper clips, pens, test tubes, a petri dish, a magnifier and a highlighter pen.
- **A neutral world with one accent family.** Yellow is the accent: sticky note #F3DA44, tape #DDD031, flag labels #DFD02C, highlighter (multiplied) #C7C50A, marker rings #D8C92B. It covers only ≈2–5 % of pixels but appears in every shot. The data colours are methyl **red #A82136–#CC4046** and **green #31BF29–#4AB541**, plus one blue (#4D6DB0) for the first "marks".
- **Three type voices.** (a) A bold editorial **serif** for titles and labels. (b) A heavy **grotesque** for annotations. (c) **All-caps marker handwriting** on tape. Text ink is dark grey **#4F4D51**, never pure black.
- **Every entrance is a physical metaphor.** Sticky notes peel on, tape and flag labels unfurl, markers write letter by letter, pencil rings, underlines and X marks draw on, a highlighter swipes, a magnifier slides in. **No opacity fades, wipes, paper tears or dissolves were found.**
- **Strictly on twos.** The whole animation, including camera, grain and lighting, runs at 12 drawings/s. The only exception is the live-action insert (shot 6, on ones). Parity resets at each cut. The measured "42 % held frames" are simply the second frame of each pair; there is only one real hold (16 frames, f701–716).
- **The camera breathes and punctuates.** Every composition drifts slowly (1–5 %/s zoom). Narrative emphasis gets eased ~1.3 s push-ins. Several cuts land on a camera that is already moving. Changes of scale use **"powers-of-ten" zoom-outs with radial zoom blur**.
- **An analogue finish.**
  - Fine, mostly luminance grain (total σ≈3/255), re-seeded on every drawing.
  - **Radial lateral chromatic aberration**: R ×1.0023, B ×0.9951, giving orange/blue fringes up to 3.5 px at the frame edge.
  - Lifted blacks (p1 luma ≈40) and capped whites (p99 ≈225–233).
  - Large, soft, world-space shadows (−50 %) in a corner of most shots.
- **Clean flat vector diagrams** are presented as printed cards or on a dark textured "black board" (#1F1D20–#353336 with a ≈10 px dot mesh). Examples: the DNA helix with methyl tags, gears, red/green dot matrices, and inset magnification circles with leader lines.
- **Pacing.** Median shot length is 2.8 s (range 1.4–9.0 s). Inside a shot there is a new visual beat every **≈1.0 s** (median of 42 intervals; IQR 0.43–1.78 s), which is roughly one event per 2–3 narrated words.

### 1.1 Signature devices of the Vox house style (ranked by how much they make it read as "Vox")
| # | Device | Where (evidence) |
|---|---|---|
| 1 | Dotted notebook paper desk as the universal ground plane, seen top-down | shots 2–5, 7–10, 12–13 (f2, f140, f444, f800) |
| 2 | Yellow as the only accent: sticky notes, lime tape labels, highlighter, marker rings, flag labels | every shot; f92, f486, f678, f964 |
| 3 | Handwritten all-caps tape labels pinned with paper clips; second word in blue-grey marker | f140 "DNA", f220 "iSCAN - ILLUMINA", f444 "METHYLATED DNA", f494–524 |
| 4 | Draw-on annotations: pencil rings, sketchy double-line arrows, marker underline, X cross-out, "??" | f108–116, f256–272, f446, f737–743 |
| 5 | Highlighter swipe across printed text (multiply) | f676–688 |
| 6 | Inset magnification: pin dot → cone/leader line → circle of red/green dots | f282–306, f1039+, f1111+ |
| 7 | Flat vector science diagrams treated as printed cards, mixed with real photo props (tubes, magnifier, petri dish, engraving) | shots 3, 9, 11–13 |
| 8 | Serif headline rising from a baseline mask while the camera pushes in | f52–84 |
| 9 | Sticky-note peel that replaces or prefixes a word ("EPI"+Genetics; "Age?" over a crossed-out idea) | f92–100, f863–869 |
| 10 | 2D desk camera: constant drift, eased 32-frame pushes to the focal word, cuts landing on a moving camera | f52–84, f218, f462, f727–759 |
| 11 | Powers-of-ten zoom-out transitions with radial blur (DNA → cells → organism) | f1029–1043, f1101–1121 |
| 12 | On-twos stepping, grain, chromatic aberration, lifted blacks: the "printed and photographed" finish | whole piece |

## 2. Shot log
The auto-detector missed a cut at **f218** (hist_l1 0.347, below its threshold), so shot 2 is split into 2a/2b here. Shot 1 is a 2-frame remnant of the previous edit (same composition as f400–428) and is ignored. Camera values come from the CSV unless marked "direct".

| Shot | t0–t1 (f) | Content / composition | Layers (back→front) | Motion (what, how, how long) | In / out |
|---|---|---|---|---|---|
| 1 | 0.00–0.04 (f0–1) | Previous-edit remnant: magnifier over DNA card | – | – | excerpt start / cut |
| 2a | 0.08–9.05 (f2–217) | Dotted desk; black DNA card (yellow rungs) taped with lime "DNA" label and clip; purple petri photo at +25°; DNA-icon strip at +20°; pen at top-left. Centred serif **"Genetics"** above the card; yellow **"EPI"** sticky; marker underline; blue methyl dots | paper → world shadow (top-right) → back cards → DNA card → tape/clip → title → sticky → underline → dots | Fly-through with depth of field f2–18. Settle pull-back f16–40. **Push+tilt** f52–84 (×1.213, 184 px). Title rise f58–70. EPI peel f92–100. Underline f108–116. Dots pop f170–210 (staggered). Drift 0.9955/drawing + tilt −3 px/drawing f120–217 | in: cut into Z fly-through · out: hard cut |
| 2b | 9.09–13.68 (f218–328) | Photo card of an iScan sequencer with lime tape "iSCAN - ILLUMINA" and clip; DNA card top-right with methyl dots; **white hand-drawn ring**, L-shaped leader line, **inset circle of red/green dots**; lavender tube | paper → cards → ring → leader → inset | Cut lands on a pan of −60 px/drawing, decelerating over 44 f (326 px). Ring f256–272. Leader f282–298. Inset pop f292–306. Pull-back ≈−3.4 %/s | in: cut on moving camera · out: hard cut |
| 3 | 13.72–17.85 (f329–428) | Same DNA card full-frame (cut-in), red/green methyl tags, lime "METHYLATED DNA" tape | paper → cards → tape → **magnifier photo** (lens ≈×1.4) | Static until a magnifier slides in from the right f384–398 (≈500 px, ease-out) while the camera pulls out (zoom 0.968→1.0, f389–405). Then slow drift | in: cut-in (graphic match on the card) · out: hard cut |
| 4 | 17.89–19.23 (f429–461) | Detail: "Methyl group" (yellow sans + yellow leader) on the black card; METHYLATED DNA tape; sketchy arrow to a pencil-ringed bold-sans **"Sexual orientation"**; yellow marker ring around a lavender tube; blue-capped tube | paper → card → tape → pencil → props | "??" pops in at f446. **Accelerating push** (zoom/drawing 1.000→1.070, f430–460) | in: hard cut · out: speed-ramped push cut |
| 5 | 19.27–23.57 (f462–565) | Photo of the twin brothers on a card with clip; petri dish (saliva, teal specks); lime tape **"HORVATH BROTHERS"** write-on; black tape **"SALIVA TEST"**; hand-drawn arrow | paper → photo → tapes → arrow | Push continues across the cut: ×1.53 in 34 f, 60 % in the first drawing (expo-out). Black tape unfurl f486–496. Arrow f490–496. Write-on f494–524. Then static | in: zoom-through cut · out: hard cut |
| 6 | 23.61–25.40 (f566–609) | **Live-action interview** inside a white-bordered print with clip and yellow ring | paper → print → video | Video **on ones**; drift −36 px | hard cut both sides |
| 7 | 25.44–29.86 (f610–716) | Journal page "Epigenetic Predictor of Age" (real PDF) on the desk with highlighter pen and pen | paper → page → highlighter mark → props | Macro of text → pull-back with page bend and flatten f610–624. **Tilt-push** to the title f668–696 (≈316 px, ×1.13, peak at f678). **Highlighter swipe** f676–688. **Freeze** f701–716 | in: cut into macro pull-back · out: freeze then cut |
| 8 | 29.90–31.91 (f717–765) | Return to the shot 4 desk, wider | as shot 4 | Hold f717–727, then **push** ×1.375 + pan 313 px (f727–759). **X cross-out** f737–743 drawn during the push | in: return cut · out: hard cut |
| 9 | 31.95–35.45 (f766–850) | Serif header "Training Data"; white card "Epigenetic Predictor of Age" (bold sans) with gears, fixed with masking tape over kraft card; dot-matrix discs with yellow sticky tags "AGE: 54/13/22/7/71" slide in from the edges and under the card; soft shadow on the left | paper → shadow → discs → kraft → card → tape → tags | Discs move continuously. Gears flash red (f796–812), green (f818–832), red (f842–850). **Linear push** ×1.17 (direct: card 484→566 px; the CSV zoom of 0.228 is wrong because of the moving discs) | hard cuts |
| 10 | 35.49–37.79 (f851–906) | Return to the crossed-out "Sexual orientation" | as shot 8 | **"Age?" sticky** peel f863–869. Drift ty −1 px/drawing | return cut / hard cut |
| 11 | 37.83–43.13 (f907–1034) | Dark textured board (#1F1D20); horizontal DNA helix (yellow rungs, hatched grey backbone) with red/green tags; blurred bokeh tags in the corners; yellow serif **flag labels** "Habits", "Hardships", "Time" with thin white leaders | board → bokeh → helix → tags → labels | Helix twists continuously (decorrelates in ≈12–16 f). Labels unfurl f964–980, f990–1000, f1005–1014. Exit: zoom-out + radial blur f1029–1034 | in: hard cut · out: powers-of-ten blur |
| 12 | 43.17–46.13 (f1035–1106) | Petri dish photographed top-down, full of black cells; red pin dot with cone lines to an inset circle of red/green dots (top-right) | paper → dish → pin → cone → inset | Arrival zoom-out from macro with radial blur f1035–1043 (66 % in the first drawing). Drift −2.4 %/s. Exit zoom-out f1101–1106 | blur in / blur out |
| 13 | 46.17–48.76 (f1107–1169) | Stippled **engraving of a rodent** on the dotted paper; yellow highlighter swooshes behind it and a yellow ring around its head; red pin and cone to an inset dot circle (bottom-left); pen, highlighter and lavender tube | paper → marker swooshes → engraving → pin/cone → inset → props | Arrival radial-blur zoom-out f1107–1113, settle by ≈f1121. Drift −1.2 %/s | blur in / hard cut |
| 14 | 48.80–51.05 (f1170–1224) | End card: dark board with the creator's URL in serif and lime tape "THANK YOU!" with clip, on the desk | paper → props → board → tape | Static (grain still on twos) | hard cut / end |

## 3. Color
| Token | Hex | Role | Share / evidence |
|---|---|---|---|
| bar | #1F1F1F | pillarbox (25 % of the frame by definition) | std 0, all frames |
| board-dark | #1F1D20 (p10 #171517, p90 #2D2A2D) | dark backdrop of shot 11 | 92.7 % of shot 11 |
| card-black | #353336 (p10 #2E2B2E) | diagram card fill | f140; palette #3A393A 7.5 % |
| paper-lit | #D6D3D3 (p90 #E6E5E6) | desk paper | f140; palette #D8D6D7 19.4 % + #CAC9CA 18.1 % |
| paper-page | #BFBEBE | journal page (darker than the desk) | f690 |
| print-border | #DFDAD9 / #E1DDDB | photo print margins | f312 |
| kraft / masking tape | #ADA9A6 (≈) | tape, kraft card, shadowed paper | palette 7.7 % |
| dot-grid | #8F868E (p10 #6D696B) | notebook dots | f140, f2 |
| ink | #514F53 serif / #464247 sans | typeset text on paper | f140, f444 |
| ink-on-yellow | #201E20 | label text on flags | f1000 |
| graphite | #5F5C62 | pencil rings and arrows | f444 |
| marker-black | #433F30 / #3B3A2B | handwriting (warm black) | f444, f540 |
| marker-blue | #596B8D | second word of tape labels ("DNA", "BROTHERS") | f444 |
| **sticky-yellow** | **#F3DA44** | sticky notes (warm yellow) | f140 |
| **tape-lime** | **#DDD031** (#DACD2F–#DED02E) | tape labels (greenish yellow) | f140, f312, f540 |
| flag-yellow | #DFD02C–#E1CD37 | flag labels (shot 11) | f1000 |
| highlighter | #C7C50A on #BFBEBE paper (pigment ≈ #FFF80F, multiply) | highlight | f690 |
| marker-ring | #D8C92B / #C8B415 | dry-brush yellow rings and swooshes | f444, f540, f1140 |
| rung-amber | #E5C15E | DNA rungs | f140 |
| sans-yellow | #D0C133 | "Methyl group" type and leader on the black card | f444 |
| methyl-red | #A82136 on dark / #C03D40–#CC4046 on light | data "on / methylated", gear flash | f1000, f312, f800 |
| methyl-green | #31BF29 on dark / #4AB541 on light | data "off" | f1000, f312 |
| mark-blue | #4D6DB0 | first methyl dots (shot 2a) | f216 |
| tube-blue / tube-lavender | #5794D2 / #BEA0E3 | prop accents | f864, f1140 |
| saliva-teal | #4591A7 | specks in the dish | f540 |
| petri-violet | #3B3349 | photo card | palette 1.3 % |
| logo | #CFCFCF | Vox bug | f0–1224 |

**Grade.**
- Blacks are lifted: p1 luma 24–75 on desk shots (typically ≈40, about #282828), 14 on shot 11, and the darkest element (black tape) sits at #151313 (p10). Whites are capped: p99 ≈ 221–233, paper never above #E6E6E6.
- The world is **neutral** (desk HSV-saturation 0.037, R−B +2). Photos keep natural colour with no mono, duotone or halftone treatment (twins photo sat 0.25, R−B +12; live video sat 0.19, R−B +27, slightly warm).
- Saturation lives in the **graphics**, not the photos.
- Chromatic aberration is **radial and lateral**. Measured on thin lines in f1000: R−G −0.89 px at dx −381 and +0.73 px at dx +315; B−G +1.87 px and −1.57 px. That gives an R scale of **1.0023** and a B scale of **0.9951** around the centre (fitted x = 961). Phase correlation on whole tiles shows ≈0, so the effect only shows on edges.
- **No vignette**: luma falloff ≤3 % on the blank frame f2, and asymmetric, so it comes from lighting.

## 4. Typography
| Style | Role / examples | Case | Cap height @1080p (frame) | x-height | Weight / class | Tracking | Colour / background | Reveal | Closest commercial ≈ | Best free (Google) ≈ |
|---|---|---|---|---|---|---|---|---|---|---|
| Display serif | Section title "Genetics" | Title | **69 px** (G 256–325, f140), word width 406 px | 50 px (0.72) | Bold, bracketed wedge serifs, moderate contrast | ≈0 | #514F53 on paper, no box | Rises ≈1 line-height from a baseline mask, 12 f | Tiempos Headline Semibold / Harriet Display Bold | Source Serif 4 Display SemiBold; Newsreader Display |
| Display serif (small) | Header "Training Data" | Title | 42 px (f800), width 401 px | 27 px | Bold serif | ≈0 | #555153 on paper | (present at cut) | same | same |
| Flag-label serif | "Habits", "Hardships", "Time" | Title | ≈38–40 px (f1000) | ≈27 px | Bold serif | ≈0 | #201E20 on flag #DFD02C, flag ≈259×76 px, ≈18 px side padding | Unfurls with the flag, 16 f | same | same |
| Annotation grotesque | "Sexual orientation", "Epigenetic Predictor of Age" (card), "Age" (sticky) | Sentence / title | 72 px (f444, shot 4 zoom); 27 px on the card (f800, leading 46 px = 1.7× cap) | 0.70 × cap | Heavy grotesque, large x-height | tight, ≈−10/1000 | #464247 on paper | Present at cut, or carried by its sticky/card | ≈ Franklin Gothic Demi / Balto Bold (Vox family, unverified) | Libre Franklin 800; Archivo 700 |
| Callout grotesque | "Methyl group" | Sentence | 31 px (f444) | 22 px | Bold grotesque | tight | **#D0C133** on the black card, with an L-leader of the same yellow, ≈3–4 px | Present at cut | same | Libre Franklin 700 |
| Marker caps (thin) | Tape labels: "METHYLATED DNA", "iSCAN - ILLUMINA", "HORVATH BROTHERS", "AGE: 54", "THANK YOU!" | ALL CAPS | 38–45 px (f540, f444) | – | Felt-tip, uneven baseline, ±3° tilt per letter | loose | #433F30 + **#596B8D** second word, on lime tape; yellow **#A39334** on black tape | **Write-on ≈1 char/drawing (12 char/s)**, stroke-order partial glyphs | Custom scanned hand | Kalam 700; Patrick Hand SC |
| Marker caps (thick) | "EPI" on sticky | CAPS | 69 px (f140) | – | Chisel marker, blobby | tight | #4E4A45 on #F3DA44 | Pre-printed, revealed by the peel | – | Permanent Marker |
| Hand glyphs | "?", "??", arrows | – | ≈60–90 px | – | Pencil / marker | – | graphite #5F5C62 | Pop in one drawing (f446) or draw-on | – | SVG paths |
| Logo bug | "Vox" | – | 84 px tall | – | Vox wordmark | – | #CFCFCF on bar | Static | Vox logo | (use your own bug) |

Rules: one focal phrase per beat (at most three labels coexist, as in shot 11); serif = topic or title, sans = concept being discussed, handwriting = provenance or labels on physical things. No drop shadows on type and no outlines. Type sits *on* paper objects, never floating.

## 5. Layout & composition
- **Canvas.** Active area 1440×1080 at x 240–1679. Bars are #1F1F1F and the logo bug sits in the right bar 31 px from the top edge and 32 px from the right edge (x 1716–1888).
- **Centred hero.**
  - The hero object (card, photo or page) spans **45–65 % of the active width**: the DNA card fill is 868 px = 60 % (f140), the Training card 484–566 px = 34–39 % plus satellite discs.
  - Titles are centred on x ≈ 960 (EPI+Genetics spans 658–1248, centre 953) with the baseline at 15–30 % of the frame height (Genetics baseline y 325; Training Data y 167).
- **Framing props at the edges.** Pens, tubes, the highlighter and clips are deliberately cropped by the 4:3 edge (pen top-left in f140, tube on the right edge in f444) and frame the hero. Elements bleed off the frame instead of floating in white space. The focal text keeps ≥150 px from the active edge.
- **Rotations.**
  - Hero card or print: −1 to +2°.
  - Back cards: 10–30° (petri photo ≈+25°, DNA strip ≈+20°).
  - Tapes and stickies: ±2–5°.
  - Flag labels: slanted end cuts with ≈−5° skew.
  - Pens and highlighter: 30–45°; tubes 0–20°.
- **Stacking.** Cards overlap by 10–30 % in a fanned stack. Tapes and clips cross card edges to "fix" them. Annotations sit on top of the paper, and the pencil ring encloses its text with ≈40–60 px clearance.
- **Depth.**
  - The desk is a single plane with **no parallax**: all layers scale together under the camera.
  - Real depth appears only in the opening fly-through (f2–18, layers pass the lens with depth-of-field blur), in the shot 11 bokeh (corner tags blurred σ≈20–30 px), and in the transitions.
  - Everything on the desk is in sharp focus.
- **Insets.** Inset circles are ≈300–460 px in diameter (f312: 320 px; f1140: ≈460 px). They are placed diagonally opposite the pin and connected by an L-leader or two tangent "cone" lines.

## 6. Textures & materials
| Item | Measurement | How to generate |
|---|---|---|
| Desk paper | #D6D3D3; static mottling σ≈2.5/255 (fibres 1–3 px); dot grid pitch **≈32 px** at the base framing (65 px in the 2× framing of f2), dot Ø ≈4–5 px, Δluma −15…−25, slightly soft | SVG `<pattern>` circle r = 2.3 on a 32 px grid, #4A4A4A at ≈35 % multiply, plus static feTurbulence (baseFrequency ≈0.9, 2 octaves) at 4–5 % |
| Black card | #353336 plus a regular dot mesh, pitch **≈10 px**, Δluma +10…+15 (crop_f0140_blackcard_x4) | 10 px hex pattern of r = 2 dots, white at 6–8 % |
| Dark board | #1F1D20, diagonal mesh pitch ≈9.5–13 px, σ 8.6 | same pattern rotated 45° |
| Film grain | Total high-pass σ ≈3.0/255, nearly monochrome (R/G/B correlation 0.91–0.96); dynamic part ≈1.3–1.8 σ, **re-seeded every drawing** (frame pairs identical, mean abs diff 0.00–0.14; between drawings ≈4); spatial correlation 0.52 at 1 px lag, 0.13 at 2 px, so grain Ø ≈1.5–2 px | Per-drawing seeded feTurbulence (baseFrequency ≈0.7, 1 octave), desaturated, soft-light at ≈10 % |
| Chromatic aberration | Radial: R ×1.0023, B ×0.9951 about (960, 540). At the active edge, R is +1.7 px outward and B −3.5 px inward | WebGL post pass, or three channel-isolated copies (feColorMatrix) scaled per channel and composited additively |
| World shadows | Large soft shadows, core −45…−55 % (#6E6D6D vs #D6D3D5), penumbra ≈290 px (f800: luma 114→203 over 288 px), in a corner or edge (left in shots 9 and 13, top-right in 2a). **Attached to the world**: in shot 9 the edge moves 543→479 px with zoom ×1.15 | Gaussian-blurred polygon (σ≈120–150 px), black multiply at 50 %, inside the camera group, above the objects |
| Contact shadows (flat prints) | Darkest at 2 px from the edge (luma 113 vs 211 = −46 %), back to paper by ≈12 px; light from the top-left | `drop-shadow(3px 4px 6px rgba(0,0,0,.45))` |
| Lifted items (stacked photo, props) | Ramps over ≈30 px below the edge (f312 iScan card: 84→210) | `drop-shadow(4px 10px 14px rgba(0,0,0,.55))`; props (tubes, pens, magnifier) ≈(+10, +15, 20 px, 40 %) |
| Photo-print border | Off-white #DFDAD9–#E1DDDB, ≈30–40 px wide (≈4.5–6 % of print width; top 40, sides 33, bottom 29 px at f312), deckled ±1–2 px, thin darker rim | Rounded-rect with SVG displacement (feTurbulence 0.05, scale 2) on the outer edge |
| Lime tape | #DDD031, opaque matte, straight cut ends, slight curl at one end; black tape #221F21 | Flat rect + darker curl gradient |
| Masking tape | Translucent beige-grey (≈#ADA9A6), crinkled, torn ends, ≈50 % opacity (f800 top and bottom of the card) | Scanned PNG, multiply 60 % |
| Sticky note | #F3DA44; folded back face measured **#A28F1E–#AA9926** (≈−35 % luma, more saturated) at f94 and f864; flag curl back #B19E22 (f966); small soft shadow | Flat rect plus fold geometry (§7) |
| Highlighter | Pigment ≈#FFF80F **multiply** (gives #C7C50A on page paper), band ≈1.3× cap height, overhang 8–12 px, ragged ends | Rect with rough-edge displacement, `mix-blend-mode: multiply` |
| Marker ring / swoosh | Dry brush, stroke 25–60 px, #D8C92B, streaky opacity, open overlapping tail | SVG path stroke with a turbulence mask |
| Pencil / graphite | #5F5C62, 3–4 px, 3–4 loose loops ≈10 px apart; arrows drawn as double lines | Path with 3–4 jittered copies (±1–3 % radius) |
| White hand ring | #E0DBDA, ≈3–4 px, 1.5 loops | Path stroke |
| Halftone / misregistration / light leaks / flicker | **None** on photos; only the CA fringes | – |

## 7. Motion language
**Stepping.**
- Every animated shot alternates drawing and hold exactly (alternation 0.97–1.00, `cadence_hold` 1). The camera, grain and shadows are stepped too.
- Live video in shot 6 runs on ones (0 held frames).
- The drawing phase follows each shot: even frames in shots 2a, 2b, 4, 5, 7, 9 and 14; odd frames in 3, 8, 10, 12 and 13; shot 11 switches at f1001 (a label pre-comp is offset).
- Real holds: **f701–716 (16 f freeze before the cut)**; 3-frame holds at f45–47, f81–83, f111–113 and f697–699 are retime artefacts.
- **No line boil.** Thin strokes only decorrelate from the 0.5 px/frame drift plus grain (cs_pencil_boil).

| Motion | Evidence (frames) | Duration | Velocity profile / measured progress | cubic-bezier fit → recommended | Overshoot |
|---|---|---|---|---|---|
| Push-in to focal text (camera) | f52–84 (×1.213, tilt 184 px) | 32 f / 1.33 s | 0, .02, .05, .10, .19, .37, .65, .83, .92, .97, .99, 1; peak f64 (49 px and 5.5 %/drawing ≈ 590 px/s) | (0.55, 0.1, 0.1, 1.2) → **(0.6, 0, 0.1, 1)** | none |
| Push-in plus pan (camera) | f727–759 (×1.375, 313 px) | 32 f / 1.33 s | 0, .02, .06, .15, .35, .64, .78, .86, .90, .94, .96…1; peak f737 (98 px and 9.5 %/drawing ≈ 1180 px/s) | (0.45, 0.1, 0, 1.1) → **(0.5, 0, 0, 1)** | none |
| Tilt-push to a title | f668–696 (≈316 px, ×1.13) | 28 f | ty per drawing 13, 22, 41, ~60, 69, 47, 31, 23, 17, 11, 8, 4, 3 | ≈(0.5, 0, 0.2, 1) | none |
| Accelerating push into a cut | f440–460 | 20 f | zoom per drawing 1.001→1.002→1.005→1.009→1.014→1.019→1.022→1.030→1.043→1.070 | ease-in ≈(0.6, 0, 1, 1) | – |
| Post-cut settle (pan) | f218–262 (326 px) | 44 f | 0, .18, .38, .53, .60, .67, .75, .81, .85, .88, .92 …1 | (0.1, 0.3, 0.1, 1.1) → (0.1, 0.5, 0.1, 1) | none |
| Post-cut settle (push) | f462–496 (×1.53) | 34 f | 0, .60, .72, .80, .85, .88, .92, .94, .96, .98 …1 | **(0, 0.8, 0.15, 1)**, expo-out | none |
| Post-transition settle | f1039–1051 (×0.818) | 12 f | 0, .66, .92, .96, .98, .99, 1 | expo-out | none |
| Idle drift | 2a f120–217: zoom 0.9955/drawing (−5 %/s) + tilt −3 px/drawing; shot 9: **linear** +4.6 %/s; 10: −12 px/s; 12: −2.4 %/s; 13: −1.2 %/s | whole hold | linear | linear | – |
| Opening Z fly-through | f2–18: blank paper → small mouse print → print grows past the lens → DNA card | 16 f | Depth-of-field blur: edge 10–90 % = 50–55 px at f10–14 (σ≈20 px), 20 px at f16 (σ≈8), sharp at f18 | – | settle pull-back f16–40 (0.96, 0.98, 0.94, 0.96, 0.99/drawing) |
| Title rise from mask | f58–70; mask fixed to paper at the baseline | 12 f / 0.5 s | 0, .49, .73, .84, .93, .98, 1 | (0.15, 0.4, 0.15, 0.9) → **(0.16, 1, 0.3, 1)** | none |
| Sticky-note peel | EPI f92–100; Age? f863–869 (+2 f settle) | 8 f / 0.33 s | Folded triangle ≈20 % → 40 % → 85 % → flat with a corner curl → flat | ease-out | none |
| Tape unfurl | SALIVA TEST f486–496 | 10 f | Starts at ≈35 % width, grows left→right, curled end flattens | ease-out | none |
| Flag-label unfurl | Habits f964–980 (Hardships f990–1000, Time f1005–1014; stagger 26 f, 15 f) | 16 f / 0.67 s | Width .48, .70, .84, .90, .92, .94, .96, .99, 1; back-face pixels 2508→915 | (0.15, 1.0, 0.45, 0.9): fast scale, slow uncurl | none |
| Handwriting write-on | HORVATH BROTHERS f494–524 | 30 f / 1.25 s | ≈1 character per drawing, partial strokes visible; underline grows with the word f516–524 | linear in characters | – |
| Marker underline | f108–116, ≈235 px, 5 px, double stroke at the right end | 8 f / 0.33 s | left→right | ≈ ease-out | – |
| Hand-drawn ring | f256–272 (white) | 16 f | 0→240° in 2 drawings (f258–260), 320° by f264, closes at f272 | ≈ easeOutQuart | – |
| Leader line + inset pop | Line f282–298 (235 px; increments 24, 66, 47, 34, 25, 19, 15, 5 px/drawing). Circle Ø 23→87→167→242→301→323→325→320, f292–306 | 16 f each, overlapping by 6 f | line ease-out; circle ease-in-out | line (0.15, −0.2, 0.15, 0.8); circle (0.45, 0.2, 0.4, 1.2) | circle **+1.6 %**, settles in 4 f |
| X cross-out | f737–743 ("\" stroke f737–739, "/" f741–743) | 6–8 f | Each stroke ≈2 drawings | linear | – |
| Highlighter swipe | f676–688 (P → Predi → Predictor → …of → …Age) | 12 f / 0.5 s | .07, .30, .60, .80, .97, 1; **starts at the camera's peak speed** | (0.2, −0.2, 0.6, 1.1) → (0.3, 0, 0.5, 1) | none |
| Dot pop | Blue dots from f170, stagger 10, 12, 4, 4 f | 18–20 f | Scale .58 in the first drawing, .80 by +6 f, 1.0 by +18 f | (0, 0.4, 0, 0.9), expo-out | none |
| Magnifier slide | f384–398, then drift to f428 | ≈14 f | Fast in, ease-out | ≈(0.2, 0.7, 0.3, 1) | none |
| Colour flash | Gears grey→red: one transitional drawing (f796 #66565A), hold f798–810, out by f812–814 | 2 f in / 12 f hold / 2 f out | crossfade | – | – |
| Conveyor discs | Shot 9: discs enter from the frame edges and slide under the card | 1–2 s each | ≈constant speed | linear | – |
| Helix twist | Shot 11, continuous, tags ride the twist | loop not reached in 5 s | constant | linear | – |

**Layering rule.** An element almost never animates alone. The title rises during a push; the X is drawn during a push; the highlighter starts at the peak of the tilt and finishes as it settles; the magnifier enters while the camera pulls out. Pushes always end in a ≥15-frame decelerating tail plus drift. **Holds are never dead**: only one 0.67 s freeze in 51 s.

### 7.1 Pacing against narration
These estimates assume ≈2.6 words/s (≈155 wpm, typical Vox voice-over); there is no transcript.

| Shot | 2a | 2b | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Duration (s) | 9.01 | 4.63 | 4.17 | 1.38 | 4.34 | 1.84 | 4.46 | 2.04 | 3.55 | 2.34 | 5.34 | 3.00 | 2.63 | 2.29 |
| ≈ words | 23 | 12 | 11 | 4 | 11 | 5 (sound bite) | 12 | 5 | 9 | 6 | 14 | 8 | 7 | 0 (end card) |
| Visual beats | 10 | 4 | 2 | 2 | 3 | 1 | 3 | 3 | 4 | 2 | 5 | 2 | 1 | 1 |

There are 43 beats overall, with intervals of mean 1.16 s and median 1.00 s, giving roughly one beat per 2–3 words or one per clause. The audio envelope has narration pauses of ≥160 ms at 3.24–3.56, 10.22–10.48, 13.02–13.22, 17.20–17.40, 39.52–39.74 and 40.84–41.06 s. The matching beats (EPI at 3.84 s, ring at 10.68 s, cuts at 13.72 and 17.89 s, Habits at 40.21 s, Hardships at 41.29 s) land **0.2–0.5 s after the pause ends**, that is, on the first stressed word of the next phrase (≈, envelope only).

## 8. Transitions
| Type | Instances | Frame-by-frame | Length | Trigger | How to build |
|---|---|---|---|---|---|
| Hard cut (static) | f329, f429, f566, f717, f766, f851, f907, f1170 | Last drawing → first drawing; parity may flip | 0 f | New sentence | Sequence boundary |
| Cut-in / return cut | f329 (2b card → 3 full-frame card); f717 and f851 return to the "Sexual orientation" desk, each time with something new (X, then "Age?") | as a hard cut | 0 f | Same topic continues | Reuse the scene with new camera keys; keep annotations persistent |
| Cut onto a moving camera | f218 (lands on a −60 px/drawing pan, settles over 44 f); f610 (lands on a macro of text) | f610: macro text, dark (luma 56), blurred · f612: abstract visible, smaller · f614: page bottom edge visible, darker · f616: whole page with **concave bent edges**, desk visible · f618–622: bend relaxes · f624: flat · f626–630: drift | 14 f | Introducing a document | Page plane: scale 6→1 expo-out, plus mesh-bend (edge curvature 1→0) over 12 f, shadow under the page |
| Speed-ramped push cut ("zoom-through") | f440–470 | Shot 4 accelerates (1.001→1.070/drawing) · **cut f462** · shot 5 starts at ≈1.29/drawing and decelerates (1.055, 1.032, 1.022, 1.016 …) | ≈30 f around the cut | Moving from concept to evidence | Ease-in push on A, ease-out push on B, no blur |
| Powers-of-ten radial zoom-out | 11→12 (f1029–1043); 12→13 (f1101–1121) | 11→12: f1029 normal · f1031 scale ≈0.95 with slight radial smear · f1033 helix shrunk to ≈15 % width with strong radial streaks · **f1035 cut**: macro of black cells, Gaussian σ≈30 px · f1037 radial streaks, pin dot visible · f1039 dish at ≈1.25× · f1041 ≈1.04× · f1043 settled. 12→13: f1103 dish ×0.88 · f1105 tiny dish (≈20 % width) on a grey field · **f1107 cut**: macro of fur with a huge red pin · f1109 radial blur with yellow streaks · f1111 rodent ≈1.04× · f1113–1121 settle | 14–20 f, half before the cut | Changing scale (molecule → cell → organism) | Outgoing scale 1→0.1 in 4 f; incoming 5→1 in 8 f, expo-out; radial blur (24-tap shader, strength ∝ zoom velocity) on both sides of the cut |
| Opening fly-through | f2–40 | f2 blank dotted paper (2× framing) · f4 small sharp mouse print · f6 print large and blurred · f8–14 DNA card blurred (σ≈20 px) · f16 σ≈8 · f18 sharp · f16–40 settle pull-back | ≈38 f | Cold open | Z-stacked layers with a scale ramp and per-layer `blur()` tied to distance from the focal plane |
| Freeze before cut | f701–716 | Image fully frozen, grain included (editorial hold) | 16 f | Wait for the voice-over | Hold the last drawing |
| **Not present** | – | No dissolves, wipes, paper tears, whip-pans, match-dissolves or flashes. The auto-detector's "0 soft transitions" is correct except for the two radial zoom-blurs | – | – | – |

## 9. Reusable components
| Component | Props (defaults from measurements) |
|---|---|
| `VoxFrame` | `bars: "#1F1F1F"`, active 1440×1080 centred, `logo: {x:1716, y:31, w:173, h:84, color:"#CFCFCF"}`, `onTwos: true` |
| `DeskPaper` | `color:"#D6D3D3"`, `dotPitch:32`, `dotR:2.3`, `dotColor:"#4A4A4A"`, `dotOpacity:.35`, `mottle:{sigma:2.5/255, freq:.9}` |
| `WorldShadow` | `polygon`, `blur:135`, `opacity:.5`, `blend:"multiply"` (child of `CameraRig`) |
| `CameraRig` | `keys:[{f, x, y, scale, rot, ease}]`, `push:{dur:32, ease:[.5,0,0,1]}`, `drift:{zoomPerSec:-0.05…+0.046, panPxPerSec:12}`, `stepped:2` |
| `PhotoPrint` | `src`, `border:0.05` (×width, top +20 %), `borderColor:"#E1DDDB"`, `deckle:1.5`, `rot:0`, `shadow:{dx:3, dy:4, blur:6, a:.45}` (lifted: 4/10/14/.55) |
| `DiagramCard` | `fill:"#353336"`, `mesh:{pitch:10, r:2, a:.07}`, `border` as `PhotoPrint` |
| `TapeLabel` | `text`, `text2`, `tape:"#DDD031"\|"#221F21"`, `ink:"#433F30"`, `ink2:"#596B8D"`, `font:"Kalam"`, `cap:40`, `rot:±3`, `clip:true`, `unfurlF:10`, `writeOnFPerChar:2`, `underline2:true` |
| `StickyNote` | `color:"#F3DA44"`, `back:"#A5931F"`, `w:180`, `h:140`, `text`, `font:"Permanent Marker"`, `peelF:8`, `peelOrigin:"top-left"`, `rot:-2` |
| `FlagLabel` | `color:"#DFD02C"`, `w:259`, `h:76`, `serif cap:38`, `ink:"#201E20"`, `leader:{w:3, color:"#E8E4E0", drawF:4}`, `unfurlF:16`, `stagger:15–26` |
| `TitleRise` | `font:"Source Serif 4 Display 600"`, `cap:69`, `ink:"#514F53"`, `rise:"1em"`, `durF:12`, `ease:[.16,1,.3,1]`, `mask:"baseline"` |
| `Highlighter` | `color:"#FFF80F"`, `blend:"multiply"`, `height:1.3×cap`, `overhang:10`, `durF:12`, `ease:[.3,0,.5,1]`, `roughEdge:2` |
| `MarkerUnderline` | `w:5`, `len:"60 % of word"`, `doubleTail:true`, `durF:8`, `ink:"#433F30"` |
| `PencilRing` | `loops:3.5`, `stroke:3.5`, `color:"#5F5C62"`, `jitter:.03`, `durF:8` |
| `SketchArrow` | `strands:2`, `stroke:3.5`, `curve`, `head:"open V"`, `durF:8` |
| `CrossOut` | `strokes:2`, `w:8`, `color:"#433F30"`, `durF:8` (4 per stroke) |
| `HandRing` | `color:"#E0DBDA"`, `stroke:3.5`, `loops:1.4`, `durF:16`, `ease:"outQuart"` |
| `MarkerRing` | `color:"#D8C92B"`, `stroke:25–60`, `dryBrush:true`, `openTail:true` |
| `InsetMagnifier` | `pin:{r:12, color:"#C03D40"}`, `link:"L"\|"cone"`, `lineW:3.5`, `lineColor:"#4E4A48"`, `circleD:320–460`, `ring:4`, `grid:{pitch:55, dotD:32, colors:["#4AB541","#C03D40"]}`, `lineDrawF:16`, `popF:16`, `overshoot:1.016` |
| `DotPop` | `w:26`, `h:32`, `color:"#4D6DB0"`, `durF:18`, `ease:[0,.4,0,.9]`, `stagger:[10,12,4,4]` |
| `GearFlash` | `colors:{red:"#CC4046", green:"#4AB541", base:"#5C5B5E"}`, `inF:2`, `holdF:12`, `outF:2` |
| `MagnifierLens` | `src` (photo rim), `mag:1.4`, `slideF:14`, `ease:[.2,.7,.3,1]`, `shadow:{dx:10, dy:15, blur:20, a:.4}` |
| `ZoomBlurTransition` | `outF:6`, `inF:8`, `scaleOut:0.1`, `scaleIn:5`, `taps:24`, `ease:"expoOut"` |
| `FlyThrough` | `layers:[{z, src}]`, `durF:16`, `dofSigma:[20,8,0]` |
| `PageDrop` | `scale:[6,1]`, `bend:[1,0]`, `durF:14` |
| `FilmFinish` | `grain:{sigma:3/255, size:1.7, reseedEvery:2}`, `ca:{r:1.0023, b:0.9951}`, `levels:{black:"#282828", white:"#E6E6E6"}` |
| `LiveVideoInset` | `src`, `onOnes:true`, wrapped in `PhotoPrint` + clip + `MarkerRing` |

## 10. Build notes for code (Remotion/React)
1. **Composition.** 1920×1080 at 23.976 fps (or 24). Use one `<AbsoluteFill>` of 1440×1080 centred at left 240 with `overflow:hidden`, bars painted behind it and the logo bug in the right bar. Author everything in a 1440×1080 world; for 4K, scale ×2 (all px values here scale linearly).
2. **On twos per shot.** Compute `const d = shotStart + 2*Math.floor((frame - shotStart)/2)` and use `d` for every `interpolate`, spring, noise seed and camera key. Use the raw `frame` only for `<OffthreadVideo>` live inserts. Keep the parity reset at each cut.
3. **Camera.** Use one `CameraRig` group per shot with `transform: translate(…) scale(…) rotate(…)` and `transform-origin` at the active centre, keyframed with `Easing.bezier` values from §7. Always add a linear drift after a move settles, and make the post-cut settle expo-out. Shadow overlays and paper texture go **inside** the rig; grain, CA and bars go **outside**.
4. **Draw-ons.** Use SVG paths with `pathLength={1}` and `strokeDashoffset = 1 - p`.
   - For handwriting, convert to single-line paths (Hershey/Relief SingleLine), or reveal each glyph with a left→right `clipPath` over one drawing so that ≈1 char appears per drawing.
   - Pencil rings are 3–4 jittered ellipse paths revealed sequentially, with a combined duration of 8 f.
5. **Peels and unfurls.** Use CSS 3D (`perspective: 900px`).
   - Sticky note: two pieces, the flat part plus a triangular flap rotating about the moving fold line with a `#A5931F` back face; the fold line travels corner→corner in 8 f.
   - Flag and tape: `scaleX` from ≈0.45 at the first drawing, plus a right-end "curl" strip (mirrored, darker, width shrinking to 0 over 16 f).
6. **Highlighter.** Use a `div` or path with `mix-blend-mode:multiply` and `scaleX` from the left over 12 f, sharing the paper's transform.
7. **Zoom-blur transitions.** Use a WebGL radial blur (sample along the vector to the centre, 24 taps, strength proportional to |d ln zoom|). A cheaper option is 12 stacked copies at scales 1…1+0.02k with opacity 1/12. Put half the transition before the cut and half after.
8. **Fly-through and depth of field.** Give each layer a z value, drive scale with `1/(zCam - z)`, and set `filter: blur(k·|z - zFocus|)`. Target σ 20 → 8 → 0 px over 3 drawings.
9. **Finish.** Render in two passes (scene to an intermediate, then a shader pass) so that CA can scale channels radially: R ×1.0023, B ×0.9951. In the same pass add grain (σ≈3/255, ≈1.7 px, seed = d/2) and the levels clamp (black ≈#282828, white ≈#E6E6E6). A pure-CSS fallback for CA is three channel copies (`feColorMatrix`) with `scale()` composited with `mix-blend-mode: screen`, which is exact for disjoint channels.
10. **Hard to replicate.**
    - Photographic props (magnifier refraction, petri glass, tubes, clips): use real PNG cut-outs. For the lens, use a circular clip of the underlying layer at ×1.4.
    - Engravings: use public-domain plates.
    - The journal page: a real PDF render on a WebGL plane with a bend uniform.
    - Fabric/dot-mesh textures: tileable PNGs, or SVG patterns as in §6.
11. **Timing defaults.** Beat every ≈1 s; draw-on 8 f; label unfurl 10–16 f; text rise 12 f; camera push 32 f followed by ≥30 f of settle and drift; title-to-annotation offset ≈34–40 f (f58→f92 EPI, f92→f108 underline); entrances land 0.2–0.5 s after a voice-over pause ends.

## 11. Evidence index
| Path (under `analysis/`) | Note |
|---|---|
| `sheets/epigenetics/sheet_001–013.png` | All 207 keyframes reviewed |
| `strips/epigenetics_00000-00035 … 01165-01212.png` (26 strips) | Full-rate coverage of f0–1212 |
| `stills/E/f0000…f1200.png` (23 native grabs: f0, 2, 3, 4, 58, 140, 216, 300, 312, 420, 444, 530, 540, 590, 690, 800, 864, 880, 970, 1000, 1080, 1140, 1200) | Colour sampling, type metrics, shadows, CA. Grabs and `cs_*` strips made before f312 used a +½-frame seek, so a label can be one frame late in on-twos shots (same drawing). All timing numbers in §7 were re-measured with an exact `n/fps` seek |
| `stills/E/overview_shots1-7.png` | Shot content of f0–640 at a glance |
| `stills/E/cs_opening.png` | Fly-through and depth of field, f0–23 |
| `stills/E/cs_title_reveal.png`, `cs_epi_sticky.png`, `cs_underline.png`, `crop_f0140_title.png` | Title rise, sticky peel, marker underline |
| `stills/E/cs_bluedots.png` | Dot pops f172–183 |
| `stills/E/cs_circle_draw.png`, `cs_leader_inset.png` | White ring, leader draw, inset pop |
| `stills/E/cs_magnifier.png` | Magnifier slide f380–430 |
| `stills/E/cs_saliva_tape.png`, `cs_horvath_writeon.png`, `crop_f0540_labels.png` | Tape unfurl, handwriting write-on |
| `stills/E/cs_shot7_open.png`, `cs_paper_drop.png` | Live→page cut, page bend and flatten |
| `stills/E/cs_snapzoom_paper.png`, `cs_highlighter.png`, `cs_highlighter_exact.png` | Tilt-push and highlighter swipe |
| `stills/E/cs_xcross.png`, `cs_xcross_exact.png` | X cross-out |
| `stills/E/cs_age_unfold.png` | "Age?" sticky peel |
| `stills/E/cs_habits_flag.png`, `cs_habits_flag2.png` | Flag-label unfurl and leader |
| `stills/E/cs_zoomblur_trans.png`, `cs_trans_12_13.png` | Powers-of-ten radial-blur transitions |
| `stills/E/cs_pencil_boil.png` | No line boil (shot 10) |
| `stills/E/crop_f0002_dotgrid_x3.png`, `crop_f0140_paper.png`, `crop_f0140_blackcard_x4.png`, `crop_f0140_cardcorner.png`, `crop_f0140_pen.png`, `crop_f0140_dnalabel.png`, `f0880_half.png` | Paper and dot grid, black-card mesh, print border, CA fringes, tape label |
| `metrics/epigenetics.csv` | Cadence/parity, camera sequences, holds (f701–716). The shot 9 zoom is wrong because of the moving discs |
