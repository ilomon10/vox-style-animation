# Paper-desk documentary look, part 1 — `porsche` 0–65.6 s (f0–f1967, shots 1–45)

> Analyst: A. Sources reviewed: keyframe sheets 001–031 (all), 35 full-rate strips (33 viewed, list in §11), ~55 native 1280×720 grabs/crops in `analysis/stills/A/`, `metrics/porsche.csv` + `porsche_shots.*`, `palettes/porsche.json`. Measurements were made on native frames pulled with ffmpeg and aligned to the 640-px frame index (mean abs. diff ≤ 3.3 against the reference frame, always clearly lower than the neighbouring frames). All pixel values are given at the source size **720p** and normalised **@1080p** (×1.5). Time is given in frames (f, 30 fps) and seconds. Cubic-béziers come from a least-squares fit of measured positions (rms ≤ 0.02 unless noted). "≈" means estimated by eye or from a fit with fewer than 6 samples.

## 0. Prior claims checked

| Claim | Verdict | Evidence |
|---|---|---|
| "many 3-frame interstitial *flash* shots between 17-frame photo shots, 45–48 s" | **False as flashes.** The 3-frame "shots" (S24, 26, 28, 30, 32, 34) are the 50 % mid-slide frame of a **horizontal photo carousel** rendered at 12 fps. Luma doesn't spike (f1360 154.6 → f1363 131.7 → f1366 129.1 → f1368 134.4). Each "17-frame shot" is one 20-frame carousel cycle (13-frame dwell + the arrival and departure steps). | strips 01330-01377, 01426-01473; csv f1360–f1468 |
| "~36 % held frames overall" | **Confirmed, a little higher here:** 41.3 % of f1–f1967 have `mad_lo` < 0.3. Held frames are bit-identical (paper Δ = 0.00, max 0, f764→765), so **no per-frame grain overlay** sits on top. | csv; native diffs |
| "stepping on twos in many shots" | **Refined: the graphics run at 12 fps**, with holds alternating 3, 2, 3, 2 frames (average 2.5). Footage and big camera moves run on ones. The intro footage is 25 fps conformed to 30 (1 duplicated frame every 6). The crumpled-paper wipe is ≈ 8 fps stop-motion. `cadence_hold` 1 and 2 in the shot table are both this same 2.5-frame pattern. | change frames 729, 732, 734, 737, 739, 742 … (S15); 1046, 1049, 1051, 1054 … (S20 ring); 1361, 1363, 1366, 1368 (carousel) |
| taped photos, pencils, paper slips, flash frames | **None in 0–65.6 s** (probably later in the film). The only flash-like event is the exposure flicker inside the focus transition, f1936–1940 (luma 165/103/188/106/84). | sheets 001–031; luma scan |

## 1. Summary of the look

- **Brand-film intro, then a paper-desk documentary.** 0–11.4 s: a map pull-back, a page curl, then modern Porsche footage in a rounded **inset window** above a one-word caption reel (passion → speed → innovation → style → quality). After that, archival B&W photos and film staged on cream paper, dotted graph paper, crumpled paper, relief maps and a dark map.
- **One accent colour: highlighter yellow** (#FCED00 for label fills, down to chartreuse #D7ED14 for captions and chart lines). It is used for label boxes, highlighter sweeps over dates and names, hand-drawn rings, city outlines, a hard offset rim behind photos and cut-outs, and the ▶ bullet. Everything else is cream, grey-sepia or near-black. Only the 911 is red (#CC1205).
- **Serif typography throughout, no sans-serif.** Bold italic serif (Georgia-like) for captions and quotes, bold serif for labels, high-contrast serif numerals for dates.
- **12 fps "drawn" timing on a 30 fps master.** Wipes, countdowns, rings and slides step in 3/2 holds, and the grain refreshes on the same beat. Footage and hero camera moves stay smooth.
- **Easing is fast, with long tails and almost no overshoot.** Wipes show a thin bar first, then sweep fast and decelerate. New shots start 1.3–1.8× too large or offset and settle in 6–14 frames. Several cuts are preceded by an accelerating 5–12 % punch-in.
- **Print and lens finishing:** a strong halftone dot screen (2.8–3.7 px at 23°) on the intro footage; vignette (−13 % at edge midpoints, about −18 % in corners on paper); soft RGB fringe ghosts of about 3 px; fine monochrome grain; glow on white lines in dark scenes; rounded-rect media cards (r ≈ 25–30 px).
- **Information-design inserts:** a year odometer, a sliding timeline rail, a line chart with draw-on, a typewriter statement inside a dashed frame, and product cards (side-view car, yellow name label, price line).

## 2. Shot log
Shot numbers follow `metrics/porsche_shots.md`. Detector shots that are only steps of one transition are merged and marked.

| Shot | t0–t1 (f) | Content / composition | Layers (back→front) | Motion (what, how, how long) | In / out transition |
|---|---|---|---|---|---|
| 1a | 0–4.2 s (f0–125) | World map (ocean #6588AE, land #A1A574) with ~10 small axis-aligned photo cards that have a pale border | map → cards with soft shadow → halftone/grain/vignette | **Pull-back ×7.6–8 → 1** from anchor (586,250) → @1080p (879,375). Log-scale ease-out on ones f1–118 (see §7), then hold f118–125 | opens on an extreme close-up / **page curl** f126–137 |
| 1b | 4.2–6.63 s (f126–199) | Inset window (918 Spyder footage), 960×540 at (159,44) → 1440×810 at (239,66), r ≈ 29 → 44 px, over a blurred dark copy of itself. Caption row: yellow ▶ plus "passion" | blurred bg (L≈40) → window (L≈140) → caption | ▶ rises f142–153, rotates −90° f152–169; word rises f171–180; footage 25→30 fps conform; slow pull-back 0.993/frame f186–189 | in: page curl / word roll passion→speed f191–201, hard cut f200 |
| 2–5 | 6.67–9.13 s (f200–274) | Same inset layout; dark modern car footage (24/17/8/26 f cuts) | same | word rolls speed→innovation f216–225, innovation→style f240–253; a new word every ≈ 25 f, each roll starting ≈ 8–9 f before the next cut (rolls start f191, 216, 240; cuts at f200, 224, 249) | hard cuts f200, 224, 241, 249 |
| 6 | 9.17–11.37 s (f275–341) | Inset: white Panamera, caption "quality" | same | footage pan (summed tx −1157 px@1920) | hard cut f342 |
| 7 | 11.4–16.27 s (f342–488) | Relief map of Baden-Württemberg; yellow Stuttgart outline; label **STUTTGART** with a speech-bubble pointer | map → glowing yellow outline → yellow label box | **Push-in ×16.7** f343–407 on ones; outline draw-on f420–428; label grows f424–447; hold; wipe-off f465–479 | in: cut / continuous into S8 |
| 8a | 16.3–17.6 s (f489–528) | Two portraits of Ferdinand left/right (≈ 397×540 → 595×810 each), city outline centre, 2-line label "Ferdinand / Porsche" | map dimmed to 70 % → photos with 5–6 px yellow rim → label | photos rise **out of a slot** (clip at their final bottom edge) f483–507; map dims f480–505; label bar f498–499, grows f500–508 | out: dissolve f527–534 |
| 8b | 17.6–18.97 s (f529–569) | Full-frame B&W photo: Ferdinand at a drafting board | photo | pull-back to 0.70 with diagonal drift (−374, +274 px@1920) f534–561, ease-in-out on ones; **punch-in +7.6 %** f562–569 | hard cut f570 |
| 9 | 19.0–19.77 s (f570–593) | Black Taycan in a dark studio; thin gold light-arc swoosh | footage → light stroke | footage on ones | cut |
| 10 | 19.8–21.77 s (f594–653) | Macro of the PORSCHE hood lettering; gold line (≈3 px, #AE976F) traces the crest; colour crest fades in | footage → line → crest | line f594–620; crest fade ≈ 30 f (f620–650); slow push (summed zoom 1.32) | dissolve f654–662 (= S11–12) |
| 11–13 | 21.8–22.97 s (f654–689) | B&W photo: Ferdinand pointing at drawings | photo | **post-cut settle**: zoom ×1.46→1 with drift (+240, −178 @1920) f661–674, 12 fps | 3-frame dissolve f689–691 |
| 14 | 23.0–24.27 s (f690–728) | Archival B&W film with scratches (Ferdinand outdoors) | film | slow push ×1.14 | cut |
| 15 | 24.3–25.77 s (f729–773) | Cream paper; year **odometer 2024 → 1900**, centred; highlighter under 1900 | paper → numerals → yellow sweep | 12 steps in 28 f (12 fps) f729–757; sweep f749–771 | out: next shot at 7 % ghost for 3 f (f774–776 = S16), then cut |
| 16–17 | 25.8–28.27 s (f774–848) | B&W photo of the Lohner-Porsche; yellow inline label "one of the first *hybrid* vehicles" lower left | photo → label | settle ×1.47→1 with drift f778–792 (12 fps); label wipe f789–814 | stepped dissolve f847–852 (α 0.27/0.27/0.66/0.66/0.66/1) |
| 18–19 | 28.3–31.3 s (f849–939) | Egger-Lohner advert (paper #FAF2EC); highlighter over EGGER-LOHNER, then zoom-out to a collage with 2 car photos | page → sweep → neighbour photos | sweep f857–889; zoom-out ×2.44→1 f889–916; **punch-in +5.8 %** f935–939 | hard cut f940 |
| 20 | 31.33–36.8 s (f940–1104) | Dark map (#28231F centre → #060503 corners); glowing timeline rail plus node; years 1900→1948 slide past; then a portrait card (Ferdinand + Ferry) pushes in; yellow marker ring around Ferry; label "Ferry Porsche" | dark map → rail/years → card → ring/label | years stepped at 12 fps f954–1024; card slide f1035–1046 (timeline pushed left with parallax, fading); ring f1046–1071; label f1069–1080 | hard cut f1105 |
| 21 | 36.83–42.33 s (f1105–1270) | Cream paper with faint dotted grid; cut-out of Ferry (hard yellow offset), quote at left; from f1216 a side view of the 356 with label "Porsche 356" and line "The price at launch is $3,750" | paper → text → cut-out / car → label | cut-out settle ×1.76→1 f1105–1119 (on ones); words fade on f1113–1157; f1216 car pops in +122 px and settles in 7 f; label wipe f1221–1243; price typed on f1231–1246; **pull-back −3.4 %** f1263–1268 | hard cut f1271 |
| 22 | 42.37–44.5 s (f1271–1335) | Green-grey archival film of 356 assembly; caption "▶ Porsche 356 featured a 1.1L flat-four engine producing 40 hp." | film → caption | caption fade f1292–1302 | hard cut |
| 23–35 | 44.53–49.47 s (f1336–1484) | **Photo carousel** on dotted graph paper: 6 B&W photo cards (1036×672 → 1554×1008), r ≈ 25 px, yellow rim | paper → cards | first card zooms out ×1.76→1 f1336–1348; slides start f1361, 1381, 1401, 1421, 1441, 1461 (7-f slide + 13-f dwell, 12 fps) | hard cut f1485 |
| 36 | 49.5–53.13 s (f1485–1594) | Black chart (bg #04080A, faint engine blueprint): "Porsche 356 units manufactured", yellow line 1948→1965 | bg → glowing white axes → yellow line + title | line draw-on f1485–1555; title typed f1490–1525; hold | hard cut |
| 37 | 53.17–55.5 s (f1595–1665) | Archival film of the 356 on a mountain road; yellow caption with ▶ | film → caption | footage pan | crumpled paper slides up f1660–1684 (= S38–40) |
| 38–41 | 55.53–58.67 s (f1666–1760) | Crumpled paper, dashed frame, typed "But the true *revolution* came in 1963", highlighter on 1963 | paper → dashed frame → text → sweep | paper stop-motion ≈ 8 fps; typing f1677–1713 (1 char/frame); sweep f1715–1724; creep zoom +0.2 %/s; **punch-in +12 %** f1756–1760 | hard cut f1761 |
| 42–43 | 58.7–61.9 s (f1761–1857) | B&W design-office photo; a second photo slides in over it from the right | photo → photo | S42 settle ×1.09 push f1762–1768; slide-over f1800–1809; S43 settle ×1.29→1 f1804–1812, then slow creep | hard cut f1858 |
| 44 | 61.93–64.57 s (f1858–1937) | Same product-card template: red 911, "Porsche 911", "The price at launch is $6,500" | paper → car → label | car pops in +65 px and settles in 5 f; label wipe f1871–1893 | **focus-reticle transition** f1931–1950 |
| 45 (head) | 64.6–65.6 s (f1938–1968) | Green-tinted film: 911 bonnet going from defocus to focus | film → reticle rings | rings collapse f1946–1950 | continues in part 2 |

## 3. Color

| Token | Hex | Role | Share / where measured |
|---|---|---|---|
| paper-cream | **#F6ECE3** (S21) · #FAF0E7 (S44) · #FAF2EC (S19) | page / background | S21 k-means #EFE7DD 54 % + #D5CFC6 31 % |
| paper-grey | #E9E5DB (S15) · graph paper #DCD3CA–#ECE3DA (S23) | background with laid lines or dotted grid | S15 33 % + 29 % + 22 % |
| paper-crumpled | #E0D6CD centre, #B19D8D corner | S41 background (photographic texture) | S41 44 % + 35 % |
| page-back | #E4D8C0 | back side of the curling page | f131–133 |
| vignette-edge (light scenes) | #CEC7C1 / #BEB8B1 / #CCC5BE | corners of paper scenes | corner/centre ratio 0.80–0.84 |
| night-map | #28231F centre → #100B09 (r=1) → #060503 corners | S20 background | S20 64 % + 24 % |
| chart-black | #04080A | S36 background (slight teal) | 80 % |
| intro-surround | #010101–#030A0D | around the inset window | 41–56 % in S2–S6 |
| ink-label | #3A3021 / #433307 / #503116 | text on yellow labels | median of dark pixels |
| ink-quote | #4A2A35 (darkest core #3C2727) | quote body, aubergine-brown | f1160 |
| ink-typed | #796259 | typewriter statement | f1744 |
| ink-numeral | #6C5E60 | year odometer (soft) | f740 |
| white-on-dark | #F3F7EB | timeline years and rail, with glow | f1025 |
| **yellow-fill** | **#FCED00** · #FAEE00 · #F6EA00 | label boxes | f455, f520, f1250 |
| yellow-bullet | #FBF105 | ▶ in the intro caption | f170 |
| yellow-offset | #E3DA02 | hard silhouette offset behind the cut-out | f1160 |
| yellow-ring | #E0E012 | marker ring | f1090 |
| yellow-highlighter (on paper) | #E6DE17 · #DBD11C on crumpled paper | sweeps; looks multiplied (paper texture shows through, σ 10 inside vs 15 outside) | f765, f1744 |
| yellow-chartreuse | #D7ED14 caption · #CCE206 chart line · #CFDF0F chart title | text and lines on dark footage | f1320, f1570 |
| yellow-rim (blended) | #CCCD63 | 5 px hard rim right/bottom of photo cards | f1375 |
| red | #CC1205 | 911 body (only saturated non-yellow colour) | S44 6 % |
| gold | #AE976F | light-arc stroke | f606 |
| photo greys | #B2B0A7 · #7B7B75 · #4F504C · #2A2924 | B&W prints, neutral to slightly warm | overall 15/11/9/9 % |
| film duotone | #1C2D1D / #617061 / #BFD1BF | archival film tint (S22, S37, S45) | S45 |
| map | ocean #6588AE, land #A1A574 (S1); relief #ABAE7C / #C0BB95 (S7); dimmed #7B785C (S8) | backgrounds | |

**Grade.** Blacks are not lifted on graphics (#000000–#060503; chart #04080A). Archival film blacks are slightly lifted and green (#1C2D1D). Whites never reach 255: paper peaks around #FAF2EC and text whites around #F3F7EB. Paper carries a **warm cast** (R−B ≈ +15…+20, e.g. #F6ECE3 → 19). The intro footage is desaturated and cool (teal shadows #1E231B, #364749). B&W photos are neutral-warm grey, never tinted, except the green film. Saturation stays low (shot `sat` 0.07–0.25) apart from the yellow accents and the 911.
**Chromatic aberration** shows as soft **fringe ghosts, not a hard channel split**. Main edges coincide within 0.1–0.25 px across the frame (phase correlation, 9 regions, f100/f1206/f1570). Next to high-contrast strokes, a blue/yellow ghost about 3 px wide sits up/left and a red/cyan ghost about 3 px wide sits down/right, each at ≈ 20–30 % strength. Examples: quote glyph "I", f1160 row 222 (B dips to 190 vs 240, 3 px left of the stroke; R dips to 205 vs 249, 3 px right); timeline rail, f1025 (B +30 above, R +45 below over 4–6 px); top/left edges of the S1 cards (B centroid −3.3 px). **≈ 3 px @720p → 4.5 px @1080p, diagonal: B toward top-left, R toward bottom-right.**

## 4. Typography

| Role | Sample / where | Style | Case | Size @720p → @1080p | Colour / background | Effect | Closest commercial → free (Google) |
|---|---|---|---|---|---|---|---|
| intro caption word | "passion … quality" S1–S6 | bold italic serif, high contrast | lower | x-height 28 → 42 (full 603–662); centre x≈641, baseline ≈ y648 → 972 | white + CA fringe, after a yellow ▶ (35×41 → 53×62) at x420 | rises 67 px through a mask (9 f); slot-roll on change | Georgia Bold Italic → **Gelasio Bold Italic** (Lora Bold Italic as a fallback) |
| place label | "STUTTGART" S7 | bold bracketed serif | CAPS, tracking ≈ 0 | cap 60 → 90 | #3A3021 on #FCED00 box 553×101 → 830×152, padding L24/R17/T22/B20 → ×1.5; pointer 80×38 → 120×57 | bar, then sweep wipe; wipe-off | Georgia Bold → Gelasio Bold / Merriweather Bold |
| name label | "Ferdinand / Porsche" S8, "Ferry Porsche" S20 | semibold serif | Title | cap 43 → 65, line pitch 55 → 82 (S8); ≈ 25 → 38 (S20) | #433307 on #FAEE00 (449×189 @1080p, S8) | bar, then sweep | Georgia Bold → Gelasio SemiBold |
| year odometer | 2024 → 1900, S15 | regular high-contrast serif, lining figures (flag "1", ball-terminal "9") | — | height 93 → 140, centred (640,361) | #6C5E60 on paper; highlighter 377×165 → 566×248 (padding ≈ 0.6× numeral height) | 12-fps counter, then sweep | Tiempos Headline / Didot → **Playfair Display** |
| timeline year | 1900–1948, S20 | same serif numerals | — | height 77 → 116, baseline y389 → 583 | #F3F7EB + glow, on dark | slides along the rail, edge fade | → Playfair Display |
| inline highlight | "one of the first *hybrid* vehicles" S17 | serif regular plus bold italic emphasis | sentence | ≈ cap 20 → 30 | black on yellow, box 665×63 → 998×95 | bar, then sweep | Georgia → Gelasio |
| quote | "In the beginning I looked …" S21 | **bold italic serif** | sentence | x-height 19 → 28, cap ≈ 26 → 39, pitch 45 → 67, block x272–757 → 408–1136 (left aligned) | #4A2A35 on paper | per-word fade-on | Georgia Bold Italic → **Gelasio Bold Italic** |
| attribution | "-Ferdinand Anton Ernst Porsche" | bold roman serif | Title | cap ≈ 16 → 24, right edge flush with the quote block | same ink | fades in last | Gelasio Bold |
| product label | "Porsche 356 / 911" S21, S44 | regular old-style serif | Title | cap 48 → 72; box 391×89 → 587×134 at (444,122) → (666,183); padding 30/17/23 px → ×1.5 | #503116 on #F6EA00 | bar, then sweep | Adobe Caslon → **Libre Caslon Text** |
| price line | "The price at launch is $3,750" | regular serif | sentence | cap ≈ 14 → 21, y244–264 → 366–396 | #60444F plum-brown (same family as the quote ink) | typed left→right (15 f) | Libre Caslon Text |
| footage caption | "▶ Porsche 356 featured …" S22, S37 | bold italic serif | sentence | cap ≈ 25 → 38; baseline ≈ y656 → 984; x160 → 240 after a black ▶ | #D7ED14 chartreuse | fade 10 f | Georgia Bold Italic → Gelasio Bold Italic |
| chart title / axes | S36 | semibold serif / serif numerals | Title | title cap ≈ 23 → 35; axis labels ≈ 22 → 33 | #CFDF0F / white, both with glow | title typed ≈ 0.86 char/f | → Gelasio / Playfair Display |
| typed statement | "But the true *revolution* came in **1963**" S41 | regular + italic transitional serif | sentence | cap ≈ 40 → 60, x-height 27 → 40, pitch 50 → 75, centred | #796259 on crumpled paper | 1 char/frame, no cursor; highlighter on 1963 | Caslon → Libre Caslon Text (Playfair Display Italic for the emphasis word) |

## 5. Layout & composition

- **Centred, symmetric layouts dominate.** Labels sit on the vertical axis (x≈640 → 960). Years are centred. The S8 portraits are mirrored around the label: L x78–475, R x808–1203, both bottoms at y≈630 → 945.
- **Inset media window** (intro): 75 % scale, horizontally centred, pushed up 46 px (window centre y≈314 → 471) to free a caption row at y≈606–662 → 909–993.
- **Product card template** (356 and 911, identical): label box top at 17 % of height; price line at y≈34–37 %; car spans 64 % of the width (x230–1046 → 345–1569), wheel line at ≈ 80 % of height.
- **Quote card**: text block 21–59 % of the width; cut-out figure 59–87 %, bleeding off the bottom; figure head at y≈200 → 300.
- **Carousel cards**: 81 % × 93 % of frame, centred, pitch ≈ 1200 → 1800 px with a gap of ≈ 166 → 249 px between cards.
- **Timeline**: rail across the middle 65 % (x216–1046 → 324–1569) at y≈425 → 638.
- **Rotation of objects:** none. All cards, photos and labels are axis-aligned (0° ± 0.5°; edge columns are constant along the card sides in f100). Only the stop-motion paper wobbles (±1.5–3.9° per step, f1662–1684) and the ▶ makes one −90° turn.
- **Depth:** 2–4 flat layers plus a finishing stack. DoF is faked with blurred background copies behind the inset footage and with defocus in the focus transition. No parallax inside a scene, except the S20 push (timeline moves ≈ 0.3× the speed of the card).
- **Overlap rule:** labels overlap photos only at the photo edges or in the gaps between them (S8, S20). Highlighters sit under text. Yellow rims and offsets always fall to the right or bottom.

## 6. Textures & materials

| Element | Measurement | Procedural recipe |
|---|---|---|
| Paper (smooth cream) | #F6ECE3; high-pass σ ≈ 2 / 255; S15 shows faint vertical laid lines with a 4.6 px period (FFT peak 0.219 cyc/px) | flat colour + low-frequency mottling (FBM, ±3 %) + optional laid lines (sine, 7 px @1080p, 1–2 % contrast) |
| Graph paper (S21/S44 faint, S23–35 clear) | dotted grid, pitch **23 px → 35 px**, dots ≈ 4 px period (→ 6), dot colour ≈ #B8AFA6 at ~25 % | SVG `pattern` of dotted lines; `stroke-dasharray` 2 4 (×1.5) |
| Crumpled paper (S38–41) | photographic crease texture, σ_hp ≈ 4.3, corners darker (#B19D8D) | photographed crumpled-paper plate (multiply), or normal-mapped noise |
| Film grain | **monochrome** (R–B correlation 0.98–1.0), correlation length ≈ 1–1.5 px → 1.5–2.3 px, σ ≈ 1.6–4 / 255 after H.264 (start at 4–6 / 255 @1080p) | per-step seeded noise (seed = 12-fps step index), overlay blend |
| Grain timing | refreshed **only when the 12-fps drawing changes** (paper high-pass correlation 0.54 across a step, 0.999 across a hold) | do not animate grain per output frame |
| Halftone screen (intro S1–S10) | period **3.65 px at ±23° / 113°** (S1, S5, S6) and 2.77 px (S10); amplitude σ_hp 18–23 levels on mid tones (strong) | WebGL dot-screen: cell ≈ 5 px @1080p, angle 22.5°, mix 20–25 %; intro footage and map only |
| Vignette | paper scenes: L(r)/L(0) ≈ 1 − 0.13·r^1.7 (r = elliptical radius, 1 = edge midpoints); corners 0.80–0.84, slightly cooler. Dark scenes: spotlight, centre #28231F → corners #060503 | radial-gradient multiply; separate spotlight layer for night scenes |
| Chromatic fringe | ghosts ≈ 3 px → 4.5 px at 20–30 %; B toward up-left, R toward down-right (§3) | SVG `feOffset` per channel + `feBlend` screen at 0.25, or a shader |
| Glow / bloom (dark scenes) | rail core 3–4 px, bloom ±8 px → ±12; text glow ≈ 6 px | `drop-shadow(0 0 6px rgba(255,250,235,.6))` ×2 |
| Rounded media corners | inset window r ≈ 29 → 44; carousel cards r ≈ 25 → 38; S20 portrait card r ≈ 12–15 (est.) | `border-radius` |
| **Yellow hard offset** | photo cards: rim **5 px → 7.5 px** right and bottom only, no blur (#CCCD63 blended); cut-out: silhouette offset **≈ +14 px x, 0 y → +21 px**, #E3DA02 (yellow 11–15 px beyond the figure's right edge on every row) | duplicate the shape/alpha, fill yellow, translate (+x, +y), place behind |
| Drop shadow | S1 map cards: offset ≈ (+5, +8) → (+7.5, +12), blur ≈ 12–15 → 18–22, ≈ 45 % at the edge (map falls to 53 %), dark-blue tint from the map. Carousel cards: ≈ (+4, +4), blur ≈ 6, ≈ 15 %. No shadow on top/left edges. | `filter: drop-shadow()` |
| Page curl | back colour #E4D8C0 with a light gradient, curl line runs bottom-right → top-left | WebGL page-curl shader, or two masked layers + a gradient flap |
| Film damage | S14: vertical scratches and dust; S22, S37, S45: green duotone, soft focus | scratch-line overlay; duotone colour matrix |
| Light leaks | only a pinkish blurred haze in the focus transition (f1931–1937); gold light-arc stroke S9–S10 (≈ 3 px, #AE976F, glowing) | — |
| Torn edges, tape, halftone on paper | **not present 0–65.6 s** | — |

## 7. Motion language

| Motion type | Example (frames) | Duration | Velocity / easing (fit) | Overshoot | Stepping |
|---|---|---|---|---|---|
| Opener pull-back | f0–118, scale ×7.6–8 → 1, anchor (586,250) → (879,375) | 118 f / 3.93 s | ln(scale) eases out: cubic-bezier(0, 0.2, 0.34, 1.03) (rms 0.012). Edge speed ≈ 54 px/f @720p at the start (≈ 2400 px/s @1080p), 3.4 px/f at f95, < 1 px/f after f110 | none | ones |
| Map push-in | f343–407, ×16.7 | 64 f / 2.13 s | ln(scale): cubic-bezier(0.61, 0.09, 0.65, 1.04); peak +9.8 %/frame at f383 | none | ones |
| Photo pull-back with drift | f534–561, scale 0.70, (−374, +274)@1920 | 27 f / 0.9 s | ease-in-out; per-frame zoom 0.998 → 0.965 (f546) → 0.995 | none | ones |
| **Post-cut settle** (zoom-out into rest) | S13 f661–674 ×1.46; S17 f778–792 ×1.47; S21 f1105–1119 ×1.76; S23 f1336–1348 ×1.76; S43 f1804–1812 ×1.29 | 8–14 f | S21: cubic-bezier(0.6, 0.07, 0.33, 1.01) (on ones); S23: cubic-bezier(0.77, 0.17, 0.23, 0.91). 12-fps cases fit roughly (rms 0.03) | none | ones or 12 fps |
| Car pop-and-settle | 356: +122 px at f1216 → 0 by f1223; 911: +65 px at f1858 → 0 by f1863 | 5–7 f | ease-out (≈ 80 % of the distance gone in the first step) | ≤ 1 px | 12 fps |
| **Pre-cut punch-in** | f562–569 +7.6 %; f935–939 +5.8 %; f1756–1760 +12 %; reverse f1263–1268 −3.4 % | 5–8 f | accelerating, e.g. per-frame zoom 1.0001, 1.0003, 1.001, 1.0027, 1.0063, 1.0126, 1.0184, 1.026 ≈ easeInQuart cubic-bezier(0.5, 0, 0.75, 0) | — | ones |
| Mask rise (photos out of a slot) | f483–507, +540 → 0 px (+810 @1080p) | 24 f / 0.8 s | cubic-bezier(0.5, 0.28, 0.26, 1.01) | none | ones |
| ▶ rise + turn | rise f142–153 (97 px → 146); rotate −90° f152–169 | 11 f + 17 f | rise cubic-bezier(0.64, 0.24, 0.68, 0.96); rotation cubic-bezier(0.31, 0.15, 0.27, 0.95) | none | ones |
| Word rise / roll | rise f171–180 (67 px → 100); rolls f191–201, f216–225, f240–253 | 9–13 f | rise cubic-bezier(0.17, −0.06, 0.19, 0.93); roll cubic-bezier(0.3, 0.14, 0.07, 0.95). New word enters from +25 px (→ 38) below a mask, old word exits up | none | ones |
| **Highlighter / label wipe** (bar, then sweep) | STUTTGART f424–447; 1900 f749–771; hybrid f789–814; EGGER f857–889; 356 f1221–1243; 911 f1871–1893; 1963 f1715–1724 | 9–32 f (labels ≈ 22 f / 0.73 s) | a bar 5–20 px wide (→ 8–30) holds 3–8 f, then a fast sweep and long deceleration. Fits: cubic-bezier(0.97, 0.23, 0.13, 0.9) STUTTGART; (0.69, 0.13, 0, 1.07) 1900; (0.77, 0.14, 0.07, 0.94) hybrid; (0.79, 0.2, 0.04, 0.91) EGGER; (0.89, 0.28, 0.33, 0.71) 1963 (rms 0.017). Text is revealed by the same clip | ≤ 2 px (1900) | ones (S7, S41) or 12 fps (others) |
| Label wipe-off | f465–479, right → left | 14 f | cubic-bezier(0, −0.11, 0.9, 0.86) ≈ linear | — | ones |
| Outline / stroke draw-on | Stuttgart outline f420–428; gold crest line f594–620 | 8–26 f | ≈ linear | — | ones |
| Marker ring | f1046–1071, starts at ≈125° (10–11 o'clock), clockwise, ≈ 360° plus a second pass; R 135 → 203, band 24 → 36 px | 25 f / 0.83 s | coverage 5, 25, 40, 90, 160, 230, 275, 300, 310, 320° → cubic-bezier(0.6, 0.09, 0.29, 0.97) | — | 12 fps |
| Year odometer | 2024, 2018, 2007, 1994, 1980, 1965, 1951, 1936, 1923, 1911, 1903, 1900 | 12 steps / 28 f | value progress cubic-bezier(0.18, −0.04, 0.79, 1.09) (mild ease-in-out). Each number re-centred | — | 12 fps |
| Timeline scrub | f954–1024: years cross R → L at ≈ 110 px/f (one step moves ≈ 280 px); opacity 1 within ±240 px of centre, ≈ 0.6 at ±315, gone by the rail ends; final year decelerates f1011–1024 (offset 281, 214, 121, 54, 9, 0) | ≈ 2.3 s | linear, then a 5-f ease-out | none | 12 fps |
| Card slide-in | S20 card f1035–1046 (edge 1280 → 380); S43 slide-over f1800–1809 (1280 → 292) | 9–11 f | S20 cubic-bezier(0.64, 0.26, 0.12, 0.8); S43 cubic-bezier(0.06, 0.86, 0.57, 1.07) (very fast start) | ≈ 0 | 12 fps / mixed |
| Carousel | slides start every 20 f; positions 7 %, 50 %, 93 %, 100 % at +0, +2, +5, +7 f | 7 f slide + 13 f dwell | cubic-bezier(0.51, 0.21, 0.19, 0.87); peak ≈ 206 px/f @720p | none | 12 fps |
| Quote word fade | each word 0 → 1 in ≈ 12–15 f (0.2, 0.48, 0.69, 0.80, 0.88, 0.95, 0.97); stagger ≈ 1.7 f/word | quote f1113–1157 | cubic-bezier(0.05, 0.01, 0.04, 1.02) (step to ≈ 0.2, then exponential tail) | — | 12 fps |
| Typewriter | S41: 36 chars f1677–1713 = 1 char/frame (30 cps), spaces cost a frame; price line ≈ 1.5 char/f; chart title ≈ 0.86 char/f | — | linear | — | ones (S41) |
| Caption fade | f1292–1302 opacity 0.03 → 0.94 | 10 f | cubic-bezier(0.58, 0.37, 0.72, 1.01) | — | ones |
| Chart line draw | tip x 273 → 1030 f1485–1555 (≈ 10.8 px/f → 16 px/f @1080p ≈ 490 px/s) | 70 f / 2.33 s | ≈ linear along x (follows the data) | — | 12 fps |
| Stop-motion paper | top edge 720 → 613 → 451 → 376 → 211 → 111 → 39 → 0 at f1660, 1662, 1666, 1669, 1673, 1677, 1680, 1684; rotation jitter −3.9…+2.5° per step | 24 f / 0.8 s | irregular steps, decelerating at the end | — | ≈ 8 fps (3–4 f holds) |
| Holds | typical beat: element settles, then holds 30–90 f (S7 label 18 f, S15 1900 ≈ 25 f, S41 ≈ 36 f, S21 quote ≈ 60 f). Holds are completely static apart from a creep zoom (S41 1.00007/f) | | | | |

## 8. Transitions

| # | Type | Frame-by-frame | Length | Build |
|---|---|---|---|---|
| T1 | **Page curl** (S1a → 1b) | f126 bottom-right corner lifts and the map bends; f127–128 flap 20–40 % shows cream back #E4D8C0; f129–130 curl line crosses the middle, next scene visible underneath; f131–133 most of the map gone (coverage ≈ 93–100 %); f134–137 flap leaves at top-left | 11 f (main sweep 8 f) | WebGL page-curl, or SVG: clip the outgoing layer with a diagonal line moving bottom-right → top-left, draw a gradient flap mirrored across the line |
| T2 | Hard cut | ≈ 19 real hard cuts in 65.6 s (f200, 224, 241, 249, 275, 342, 570, 594, 729, 777, 940, 1105, 1216, 1271, 1336, 1485, 1595, 1761, 1858) plus 8 designed transitions (T1, T3×3, T6, T8, T9, mask rise). The other 25 detector "cuts" are steps inside transitions. One visual beat ≈ 2.4 s on average; the intro cuts are 0.27–0.9 s | 0 | — |
| T3 | Short dissolve | S10→13: α 0.14, 0.21, 0.27, 0.52, 0.61, 0.73, 0.82, 0.90, 1.0 (f654–662, ones). S13→14: 0.24, 0.70, 0.97 (f689–691). S17→19: 0.27, 0.27, 0.66, 0.66, 0.66, 1.0 (f847–852, 12 fps). S8a→8b f527–534 | 3–8 f | `opacity` crossfade, quantised to 12 fps where noted |
| T4 | Ghost pre-blend | next shot at α 0.07 for 3 f (f774–776) over the 1900 card, then hard cut f777 | 3 f | layer the next shot at 7 % |
| T5 | **Punch-in / pull-back into cut** | accelerating zoom 5–12 % over 5–8 f, cut on the fastest frame (f569, 939, 1760; reverse f1268) | 5–8 f | easeInQuart scale on the outgoing comp |
| T6 | Push / slide | carousel (§7); S20 card push with the timeline pushed at ≈ 0.3× and fading; S42→43 photo slides over the old one | 7–11 f | translateX on both layers |
| T7 | Mask rise | photos translate up inside a clip rect equal to their final bounds (f483–507) | 24 f | `overflow:hidden` wrapper |
| T8 | Stop-motion paper wipe | crumpled sheet rises from the bottom at ≈ 8 fps with rotation jitter, becomes the next background; typing starts while it settles (f1677) | 24 f | image layer, keyed y-positions + random rotation per step |
| T9 | **Focus-reticle** (S44 → 45) | f1931–1933 next shot fades in defocused (≈ 20 px blur) and overexposed, pink haze at the edges; f1934 rings appear (outer r 242 → 363 @1080p, mid ≈ 74 and ≈ 57, centre dot, 2 px white); f1935 outer ring overshoots to r 276 (+14 %); f1936–1940 exposure flicker (luma 165, 103, 188, 106, 84) while the old card fades out; f1941–1945 outer ring shrinks 232 → 164 as focus sharpens; f1946–1949 rings collapse (r ≈ 60 → 22 → 13); gone at f1950 | 19 f | blur 30 → 0 px, brightness flicker keyframes, SVG circles with scaled radius |
| T10 | Word slot-roll | caption word swaps through a horizontal mask while the ▶ stays put (§7) | 10–13 f | two text layers in a clip, translateY |
| T11 | Photo-to-card reveal | cut to a photo filling the frame (×1.76), stepped zoom-out to a rounded card on graph paper (f1336–1348) | 12 f | scale + border-radius + paper appear together |

## 9. Reusable components (defaults @1080p, 30 fps master)

| Component | Props → defaults |
|---|---|
| `Stepped` (HOC / hook) | `fps=12` → `qFrame = Math.round(Math.floor(frame*12/30)*30/12)` (holds 3, 2, 3, 2); `bypass` for camera moves on ones |
| `PaperStage` | `color='#F6ECE3'`, `grid={pitch:35, dot:2, dash:'2 4', color:'rgba(150,135,120,.25)', enabled:false}`, `vignette={amount:.13, power:1.7, corner:.82}`, `grain={sigma:5/255, size:1.8, fps:12, mono:true}` |
| `NightStage` | `center='#28231F'`, `edge='#060503'`, `mapOpacity=.25`, `glow=true` |
| `HighlightLabel` | `text`, `font='Gelasio 700'`, `capHeight=90`, `fill='#FCED00'`, `ink='#3A3021'`, `pad={l:36, r:26, t:33, b:30}`, `pointer=null` (or `{w:120, h:57}`), `wipe={bar:24, barHold:6, frames:22, ease:[.79,.2,.04,.91], fps:12}`, `exit={frames:14, ease:'linear', dir:'rtl'}` |
| `HighlighterSweep` | `target` (text bbox), `color='#E6DE17'`, `blend='multiply'`, `padX=.6em`, `padY=.35em`, `frames=22`, `ease=[.69,.13,0,1.07]` |
| `YearOdometer` | `from=2024`, `to=1900`, `steps=12`, `frames=28`, `ease=[.18,-.04,.79,1.09]`, `font='Playfair Display 400'`, `height=140`, `ink='#6C5E60'`, `then=HighlighterSweep` |
| `TimelineRail` | `years[]`, `x=[324,1569]`, `y=638`, `stroke=5`, `glow=12`, `node={r:12, dot:5}`, `yearHeight=116`, `speed=165 px/f`, `fadeStart=360`, `fadeEnd=470`, `settleFrames=13`, `fps=12` |
| `InsetFootage` | `src`, `rect=[239,66,1440,810]`, `radius=44`, `bg={blur:40, dim:.3, scale:1.2}`, `halftone={cell:5, angle:22.5, mix:.22}` |
| `CaptionReel` | `words[]`, `bullet={size:[53,62], color:'#FBF105', x:630}`, `font='Gelasio 700 italic'`, `xHeight=42`, `baseline=972`, `rollFrames=11`, `rollOffset=38`, `ease=[.3,.14,.07,.95]` |
| `PhotoCard` | `src`, `radius=38`, `rim={dx:7.5, dy:7.5, color:'#D6D84A', opacity:.8}`, `shadow={dx:6, dy:6, blur:9, opacity:.15}`, `settle={fromScale:1.76, frames:12, ease:[.77,.17,.23,.91], fps:12}` |
| `PhotoCarousel` | `photos[]`, `pitch=1800`, `slide=7`, `dwell=13`, `ease=[.51,.21,.19,.87]`, `fps=12` |
| `CutOutFigure` | `src` (alpha), `offset={x:21, y:0, color:'#E3DA02'}`, `settle={fromScale:1.76, from:[-342,63], frames:14, ease:[.6,.07,.33,1.01], fps:30}` |
| `QuoteBlock` | `text`, `font='Gelasio 700 italic'`, `xHeight=28`, `lineHeight=67`, `width=728`, `ink='#4A2A35'`, `wordFade={frames:14, stagger:1.7, ease:[.05,.01,.04,1.02], fps:12}`, `attribution={size:24, weight:700, align:'right'}` |
| `ProductCard` | `car`, `title`, `subtitle`, `carSettle={dx:150, frames:6}`, `label=HighlightLabel({font:'Libre Caslon Text', capHeight:72, fill:'#F6EA00', ink:'#503116'})`, `subtitle={size:21, typeFrames:15}` |
| `MarkerRing` | `center`, `r=203`, `stroke=18`, `passes=2`, `color='#E0E012'`, `startDeg=125`, `dir='cw'`, `frames=25`, `ease=[.6,.09,.29,.97]`, `fps=12`, `jitter=3px` |
| `TypewriterText` | `cps=30`, `fps=30`, `cursor=false`, `ink='#796259'`, `font='Libre Caslon Text'`, `cap=60` |
| `DashedFrame` | `dash=97`, `gap=87`, `stroke=4.5`, `color='#786A61'`, `phaseJitter=true` |
| `LineChartDraw` | `data`, `frames=70`, `fps=12`, `line={w:7.5, color:'#CCE206', glow:8}`, `axes={color:'#fff', glow:6}`, `title={color:'#CFDF0F', typeCps:26}` |
| `FootageCaption` | `text`, `bullet='▶'` (black), `color='#D7ED14'`, `font='Gelasio 700 italic'`, `cap=38`, `pos=[240,984]`, `fadeFrames=10` |
| `PageCurl` | `from='bottom-right'`, `frames=11`, `backColor='#E4D8C0'` |
| `PaperRiseWipe` | `plate`, `fps=8`, `frames=24`, `rotJitter=3°`, `steps=[1,.85,.63,.52,.29,.15,.05,0]` |
| `FocusReticleTransition` | `frames=19`, `rings={outer:[363,414,246,0], mid:111, inner:86, stroke:3, color:'#fff'}`, `blur=[30,0]`, `flicker=[1,.62,1.1,.63,.5]` |
| `PunchCut` | `frames=6`, `scale=1.08` (or `0.966` pull), `ease='easeInQuart'` |
| `Finishing` (global) | `chromaFringe={px:4.5, opacity:.25, dir:'R↘ B↖'}`, `vignette` (above), `grain` (above), `halftone` (intro only) |

## 10. Build notes for code (Remotion / React)

- **Two clocks.** Render designed graphics with a 12 fps quantised frame (`qFrame` above). Run camera moves on footage, map zooms, typing and settles on ones (`useCurrentFrame()`). Seed the grain with `Math.floor(frame*12/30)` so it refreshes with the drawings, never on holds.
- **Camera = one transformed `AbsoluteFill`.** Interpolate zoom in **log space**: `scale = exp(lerp(ln s0, ln s1, ease(t)))`. This reproduces the measured ×7.8 and ×16.7 moves. Set `transform-origin` to the measured anchor (opener ≈ 46 % / 35 %).
- **Wipes:** `clip-path: inset(0 calc(100% - w) 0 0)` on the yellow box and the text together. `w(t)` = bar width for `barHold` frames, then the sweep curve. The highlighter goes under the text with `mix-blend-mode: multiply`.
- **Yellow offset and rim:** render the photo or cut-out twice; the back copy gets `filter: brightness(0) … ` or an SVG `feFlood` + `feComposite in=SourceAlpha` in yellow, translated (7.5, 7.5) or (21, 0).
- **Finishing pass** in one WebGL shader (e.g. `@remotion/three` or a canvas layer): RGB fringe ghosts, vignette multiply, monochrome grain, optional halftone for intro footage, and bloom for dark scenes. Keep the main channels registered; only add ghosts at ≈ 25 %. A hard full-strength split looks wrong next to the reference.
- **Fonts:** Gelasio (Georgia-compatible) for italic captions, quotes and labels; Playfair Display for dates; Libre Caslon Text for product labels and typed text. Load with `@remotion/google-fonts`.
- **Footage conform:** the intro footage is 25 fps (one duplicated frame every 6). Use `<OffthreadVideo playbackRate>` at native 30 fps for new footage, or step it to 12 fps when it should feel "archival".
- **Hard to reproduce:** (a) the page-curl flap shading: use a shader rather than CSS 3D. (b) Stop-motion paper: use real scanned crumpled-paper plates. (c) Defocus with exposure flicker: blur plus `brightness()` keyframes 1 → 1.4 → 0.8 → 1.3 → 0.85 on 12 fps steps. (d) Halftone on moving footage: apply in screen space so the dots don't swim with the image.

**Recurring signature devices (0–65.6 s):**
1. Bar-then-sweep yellow highlighter / label wipe (8×).
2. Hard yellow offset rim or silhouette behind photos and cut-outs.
3. 12 fps stepped graphics with grain on the same beat.
4. Serif-only type with yellow ▶ bullets.
5. Post-cut settle zoom from ×1.3–1.8 (6×).
6. Accelerating punch-in or pull-back into a cut (4×).
7. Year odometer and timeline scrub with eased steps.
8. Rounded-rect media on paper or graph paper.
9. Intro print/lens stack: halftone, vignette, fringes, blurred-copy surround.
10. Typing and per-word fade reveals.
11. Mask-rise and slide/push reveals on a 20-frame rhythm.
12. Real paper materials as stage: crumpled sheet, page curl, map.

## 11. Evidence index

Strips (`analysis/strips/`, all viewed unless noted):

| Strip | What it shows |
|---|---|
| `porsche_00000-00035` | opener pull-back start |
| `00120-00155`, `00140-00187` | page curl; ▶ rise and turn |
| `00186-00233`, `00236-00283` | word rolls; 25 fps conform |
| `00284-00331` | S6 inset window |
| `00340-00387`, `00388-00435`, `00436-00483` | map push-in; outline; label wipe in/out |
| `00482-00529` | mask rise; name label |
| `00526-00573` | dissolve; pull-back; punch-in |
| `00590-00637`, `00630-00677` | gold line; crest; dissolve |
| `00684-00731` | 3-f dissolve; archival film |
| `00729-00776` | odometer; 1900 sweep; ghost |
| `00777-00824` | settle; hybrid label |
| `00840-00887`, `00888-00935` | stepped dissolve; EGGER sweep; zoom-out |
| `00936-00983`, `00984-01031` | timeline scrub |
| `01032-01079` | card push; ring |
| `01100-01147` | cut-out settle; quote fade |
| `01200-01247`, `01248-01295` | 356 card; pull-back cut |
| `01276-01311` | caption fade |
| `01330-01377`, `01426-01473` | carousel (no flash frames) |
| `01485-01532` | chart draw |
| `01640-01687`, `01684-01731`, `01732-01779` | paper wipe; typewriter; 1963 sweep; punch-in |
| `01795-01842` | slide-over |
| `01856-01903` | 911 card |
| `01925-01972` | focus-reticle transition |
| `01378-01425` | generated, not viewed (same carousel cycle; measured numerically) |

Stills and crops (`analysis/stills/A/`):

| File | What it shows |
|---|---|
| `f00100*` | map cards: shadow profile, halftone, ocean |
| `f0125-0140_pagecurl_montage` | page curl |
| `f00160_inset_918`, `f00300_inset_window` | inset window geometry and radius |
| `f00189*` | "passion" card, CA crops, halftone 8× |
| `f0180-0275_word_reel_crops` | caption reel words |
| `f00455_*` | STUTTGART label, corners |
| `f00484-490_portrait_rise_bottom`, `f00520_portraits` | mask rise, portraits |
| `f00606_*` | gold line, halftone 2.77 px |
| `f00740_*` | numerals, laid paper |
| `f00765_1900_highlight` | 1900 sweep |
| `f775_848_850_1110_transitions_quad` | ghost, dissolves, cut-out |
| `f01025_*` | timeline rail, glow, CA |
| `f01090_ring_label` | marker ring, Ferry label |
| `f01160_quote*`, `f01206` | quote, ink fringes, vignette |
| `f01250_*` | product label |
| `f01320_caption*` | footage caption |
| `f01336-1348_zoomout_quad`, `f01375_*` | carousel card, radius, yellow rim |
| `f01570_chart` | chart |
| `f01690`, `f01744*` | crumpled paper, dashed frame, typewriter |
| `f01863`, `f01893` | 911 card, vignette |
| `f1931-1942_focus_transition` | reticle transition |

Metrics: `metrics/porsche.csv` rows f0–f1968 (camera products, held-frame mask, luma scan), `metrics/porsche_shots.json`, `palettes/porsche.json` (shots 1–45, checked by eye: paper, black, grey-photo and yellow roles confirmed; k-means "#ECF20C 1.1 %" is the label/highlighter yellow).
