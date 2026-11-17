# Engineering-paper callouts, title cards & momentum cuts — `porsche` 65.6–130.8 s (f1968–f3924, shots 45–82)

> Analyst: B. Sources reviewed: sheets 032–060 (plus 031/061 for the boundaries), 22 full-rate strips, 9 zoomed crop-strips, 30 native 1280×720 grabs + ~20 crops/diff maps (`analysis/stills/B/`), `metrics/porsche.csv` per-frame rows, `porsche_shots.md`, `palettes/porsche.json`. Pixel values are given at the source resolution ("@720", 1280×720) and normalised to 1920×1080 ("@1080p" = ×1.5; values measured on the 640-px frame dumps are converted with ×3). Time is given as frames (f, 30 fps) and seconds. "≈" = estimate; the method is stated next to it. Easing curves were fitted by least squares on the tracked progress samples (`cubic-bezier(x1,y1,x2,y2)`, rmse given where useful).

**Colour warning for all analysts:** the frame dumps in `analysis/frames/` are JPEGs that store the BT.709 YCbCr, and PIL decodes them with the BT.601 matrix. That pushes every yellow toward green (G +13…+17, R −3). The k-means yellows in `palettes/porsche.json` (#ECF20C, #F2F90B, #F3F80D) are therefore wrong. A tagged-BT.709 decode with ffmpeg gives the true accent ≈ **#F2E500**. Evidence: `stills/B/f2120.png` (native) vs `stills/B/f2120_bt601.png` (forced 601, which matches the JPG). The values here come from the native decode unless marked "(jpg)".

## 1. Summary of the look (this segment)
- **One accent colour on neutral material.** Lemon yellow #F2E500 is the only added colour. It appears as highlighter blocks, label boxes, title boxes, callout discs, underlines, a dry-brush paint stroke, glow rims and caption text. Everything else is warm paper (#EDE3DA, centre hot-spot #FBECE0), near-black ink, or archival imagery that is often fully monochrome (B&W newsprint, maps and photos have sat ≈0.01–0.02).
- **Engineering-paper vocabulary instead of desk props.** This range has no tape, pencils, paper slips or flash frames. The backgrounds are graph paper (pitch 27–70 px@1080p depending on zoom), engine/blueprint line drawings and engineering-drawing paper. Content sits on these as flat cut-outs, photo prints, a TV, video panels and newspaper clippings.
- **Two repeated templates.** (a) The **model title card**: centred yellow box with the serif model name, a centred price line underneath and a side-view car cut-out that slides in. Seen 5× (914/924/928/944/Boxster). (b) The **callout**: a yellow disc (multiply) grows or flies in, a hairline leader with an elbow draws from the disc, and an italic label box wipes open from the line end. Seen 3×.
- **Lower-third caption with a rotating play-triangle.** A near-black triangle rises from below the frame, rotates −90° to point right, then bold-italic yellow serif text fades in while rising 13 px@1080p. The bullet persists across hard cuts while the text swaps.
- **12 fps animation on a 30 fps timeline.** Graphic and paper shots change on a 3-2-3-2 frame pattern (54 % held frames in those shots). Every other 12 fps step (6 fps) the whole artwork layer jitters by 0.4–1.1 px@1080p. Held frames are bit-identical, so there is **no animated grain**. Exceptions run on ones: the TV/doodle shot S61, highlighter and paint swipes, caption fades, panel slides and camera settles at cuts. Archival footage runs at its native 24–25 fps (one duplicate every 5–6 frames).
- **Momentum cuts.** Almost every cut between graphic shots carries the camera through: whip-left/right/vertical, push-in-through or pull-out-through. The motion accelerates for 2–6 f before the cut and decelerates for 3–10 f after it, with no overshoot anywhere.
- **Per-layer RGB split.** R is offset ≈ (+0.75…1.1, +0.75…1.1) px@1080p and B ≈ (−0.4…−0.75) px@1080p, uniform rather than radial. Because of it, thin dark strokes read as **plum/magenta** (leader line #552555, subtitle #4B293A) even though the ink is near-black.
- **Warm radial vignette.** Corners sit at 0.81–0.82 of the centre on most cards and 0.68 on the "heavy" scenes (S62, S63). Footage blacks are crushed to #000000 and paper whites stop at ≈250–253.

### Signature devices (recurring in this range; numbered for reference)
1. **Yellow highlighter swipe** over a scanned word (#F2E500, multiply). Seen in S50, the montage, S69–72 and S77 (3 swipes).
2. **Callout trio**: disc, then leader line, then label. Stagger ≈ +9 f and +5 f, all on 12 fps (S46/47/48).
3. **Model title card**: car slide, box+title mask wipe, feathered price line (S63/68/74a/76/79).
4. **Play-triangle caption**: rise, rotate −90°, then yellow bold-italic text fades up. The bullet persists across cuts (S45/49/75/80–82).
5. **Word-lock montage**: 17 clippings × 5 f, with the highlighted word pinned to one screen rectangle (S50b–59).
6. **Momentum cuts** (whip / push-through / pull-through) instead of dissolves between graphic shots.
7. **12 fps steps plus 6 fps sub-pixel jitter** over a static paper texture (no animated grain).
8. **Yellow offset rim or halo** on placed prints, panels and cut-outs, used instead of a dark drop shadow.
9. **RGB split** that makes black hairlines read magenta.
10. **"Reveal with the mask" text**: the paint stroke, title box and highlighter carry the text in with them.
11. **One-off but stylistically central**:
    - Loupe with an x-ray image swap (S74b).
    - "1969" date card with underline (S62).
    - Year type-on with a hand-brushed ellipse (S78).
    - Doodle field around a vintage TV (S61).

## 2. Shot log
Shot numbers follow `metrics/porsche_shots.md`. S69–S72 are merged (the detector split one stepped slide plus push-in). S50b–S59 are merged (a word-lock montage of 5-frame cards). S74 is split at f3000 (an undetected card swap).

| Shot | t0–t1 (f) | Content / composition | Layers (back→front) | Motion (what, how, how long) | In / out |
|---|---|---|---|---|---|
| 45 (tail) | 65.60–67.63 (1968–2029) | Archival 911 driving toward camera, green duotone; caption "Porsche 911 had a top speed of around 210 km/h (130 mph)." | footage → vignette → bullet → caption | footage at 25 fps (dup every 6 f); caption fade+rise f1972–1980 (8 f) | in: (part 1) / out: hard cut |
| 46 | 67.67–69.13 (2030–2074) | Warm sepia colour photo of an assembly hall | photo → yellow disc (multiply) → leader → label "rear-engine design" | settle pull ≈1.09→1.0 (×0.937, ×0.980 at f2033/35); disc grows from centre f2033–2045; line f2043–2050; label right-anchored wipe f2048–2058; 12 fps | in: hard cut / out: whip-left (−45, −211 px@1080p per step at f2070, f2073) |
| 47 | 69.17–70.97 (2075–2129) | Graph paper + engine cut-away line drawing at right | paper+grid → disc → drawing (lines over disc) → leader → label "powerful six-cylinder engine" | arrives sliding left (−62, −9 px@1080p/step); disc flies in from upper-right and grows f2083–2093; line f2088–2098; label f2093–2103; 6 fps jitter during the hold | in: whip-left / out: whip-left (−14, −85) |
| 48 | 71.00–72.57 (2130–2177) | Graph paper + 911 blueprint (side/front/rear) | paper → disc → blueprint → line → label "unique design" | slide settle −183, −51, −3 px@1080p (f2133/35/38); disc rises from bottom-left f2135–2148; line f2145–2155; label f2150–2158; slow push +2.7 %/s | in: whip-left / out: hard cut |
| 49 | 72.60–74.83 (2178–2245) | B&W photo: rows of 911s at the factory; caption "In its first three years, Porsche sold approximately 36,000 units." | photo → vignette → bullet → caption | zoom-out 1.90→1.00 in 12 f (f2178–2190, 12 fps, anchor ≈(0.71, 0.99) of frame); bullet rise f2183–2190, rotate f2191–2200; caption f2198–2210 | in: hard cut / out: push-in-through (×1.020, ×1.026) |
| 50 | 74.87–75.63 (2246–2269) | 1963 B&W newspaper ad; "PORSCHE" highlighted | newsprint → highlighter (multiply) → vignette | push settle 0.80→1.00 on ones, f2246–2254; highlighter swipe L→R f2255–2265 (10 f, ones) | in: push-in-through / out: hard cut |
| 50b–59 | 75.67–78.70 (2270–2361) | **Word-lock montage**: 17 different clippings (EN/DE/ES). The highlighted "PORSCHE" always lands in the same screen box, x 630–1287, y 423–612 px@1080p | clipping → highlight box (fixed) → vignette | one hard cut every 5 f (6 cards/s); last card holds 6 f, then pulls out ×0.83 accelerating on ones (f2356–2361) | in: hard cut / out: pull-out-through |
| 60 | 78.73–80.13 (2362–2404) | B&W US-map scan with dealer car icons and centre fold | map → yellow dry-brush stroke → black serif text → vignette | entry pull continues 1.47→1.0 (f2362–2369, ones); stroke+text wipe L→R f2364–2377 (14 f, ones); push-in ×1.165 accelerating f2396–2404 | in: pull-out-through / out: push-in-through |
| 61 | 80.17–84.27 (2405–2528) | Vintage TV cut-out on graph paper with yellow halo; screen plays footage (crest → factory → engine); geometric doodles left/right | paper+grid → doodles → TV halo → TV (screen footage) | push 0.67→0.96 in 10 f (ones) plus a 40 f tail to 1.0; doodles move continuously on ones; **0 % held frames** | in: push-in-through / out: whip-right (+4, +6, +12, +22 px/f) |
| 62 | 84.30–85.93 (2529–2578) | "1969" date card: cream deckle-edged card on a stack of old prints, over engineering drawings, heavy vignette | drawing paper → stack shadow → prints → card → numerals → underline | yellow underline draws L→R f2537–2546 (12 fps); 6 fps jitter; +0.66 %/s push | in: whip-right / out: whip-left (−14, −50) |
| 63 | 85.97–87.93 (2579–2638) | Title card "Porsche 914" / "The price at launch is $3,500" + orange 914 side view | paper → car → title box+title → subtitle → vignette | car slides left 84 px@1080p, f2579–2586; box wipe f2589–2614; subtitle feathered wipe f2594–2612; push +2.9 %/s | in: whip-left / out: push-in-through |
| 64 | 87.97–89.00 (2639–2670) | Photo print: magenta-faded 914, front ¾ | paper → print (radius 8, yellow offset rim) | print scale 0.92→1.0 in 5 f (12 fps) | in: push-through / out: pull-out-through |
| 65 | 89.03–90.10 (2671–2703) | Photo print: purple 914, rear ¾ | same | scale ≈1.15→1.0 in ≈5 f (zoom ×0.888, ×0.975 at f2673/2675) | in/out: pull-out-through |
| 66 | 90.13–91.17 (2704–2735) | Photo print: red 914 with a woman, tower behind | same | scale ≈1.13→1.0 in ≈5 f (×0.904, ×0.980); exit pull ×0.988, ×0.932 | in: pull-through / out: pull-out-through |
| 67 | 91.20–92.60 (2736–2778) | Full-frame archival colour footage of a red 914 cornering | footage | 25 fps; intrinsic camera motion | in: pull-through / out: hard cut |
| 68 | 92.63–94.90 (2779–2847) | Title card "Porsche 924" / "$9,000" + red 924 | as S63 | car slide 165 px@1080p f2779–2788; box wipe f2796–2818 | in: hard cut / out: hard cut |
| 69–72 | 94.93–96.90 (2848–2907) | Brochure page: two photos of a yellow 924 on teal + caption strip | paper → page | page slides in from the right (−168, −32 px@1080p, f2851/2853); stepped push ×3.4 f2866–2883 onto the caption line; highlighter on "front-engined" f2878–2890 | in: hard cut / out: hard cut |
| 73 | 96.93–98.03 (2908–2941) | Studio footage of a champagne 924 on a turntable | footage | decelerating slide (+12, −50, −33, −19, −12, −6 px/f) | in: hard cut / out: whip-left (accelerating −2…−22 px/f) |
| 74a | 98.07–99.97 (2942–2999) | Title card "Porsche 928" / "$28,500" + blue 928 | as S63 | box wipe f2948–2970 | in: whip-left / out: card swap |
| 74b | 100.00–103.27 (3000–3098) | Dark-green 928 cut-out, ¾ view; a magnifying-glass cut-out slides in from the left and its lens shows an engine-bay "x-ray" image | paper → car → x-ray image clipped to the lens → lens ring + handle | car scale ≈0.87→1.0 in 5 f; loupe glides linearly at 443 px/s@1080p, f3018–3095, then stops; slow push ≈2 % | in: card swap / out: push-left (−10, −30 px/step) |
| 75 | 103.30–106.80 (3099–3204) | Rounded video panel (Paris street footage of a 928) on graph paper; caption "Porsche 928 had a top speed of around 230 km/h (143 mph)." | paper → panel (yellow offset rim) → bullet → caption | panel slides in from the right, 192 px@1080p in 8 f (ones); bullet f3107–3125; caption f3123–3135 | in: push-left / out: hard cut with momentum |
| 76 | 106.83–109.23 (3205–3277) | Title card "Porsche 944" / "$18,000" + red 944 | as S63 | car slide 207 px@1080p f3205–3213; box wipe f3231–3248+ | in: momentum cut / out: vertical whip (ty −5, −15 / −70, −17) |
| 77 | 109.27–114.30 (3278–3429) | Newspaper article "Porsche 944: The Best-Selling Porsche of the Late 1980s" with a photo of a white 944 | newsprint page → highlighter strokes | swipe "First launched in 1982" f3293–3311; push-in 1.0→2.09 f3293–3336 (12 fps); heading swipe f3364–3386; body-line swipe f3394–3421 | in: vertical whip / out: push-in-through (×1.003…1.024/f) |
| 78 | 114.33–123.17 (3430–3695) | Dark factory montage: blueprint lines on black, then welding sparks, body shells, engines, workers; ends on a body-in-white with "1996" | stacked photos mixed through organic ink/smoke masks → "1996" → brush ellipse | fade up from black f3430–3470; ink-mask dissolves of ≈35–45 f each; "19"/"199"/"1996" at f3659/3662/3664; ellipse drawn f3662–3666 (ones) | in: push-through / out: hard cut |
| 79 | 123.20–125.20 (3696–3756) | Title card "Porsche Boxster" / "$40,000" + silver Boxster | as S63 | car slide 96 px@1080p f3696–3702; box wipe f3703–3732 | in: hard cut / out: pull-out (×0.995, ×0.986) + cut |
| 80 | 125.23–126.27 (3757–3788) | Modern footage: silver Boxster on a forest road | footage → bullet | bullet rises f3764–3773, rotates f3774–3789 (on ones) | in: pull-through / out: hard cut |
| 81 | 126.30–128.03 (3789–3841) | Boxster approaching; caption "Boxster featured a 2.5L flat-six engine producing 204 hp" | footage → bullet → caption | caption fade+rise f3789–3800 | hard cuts |
| 82 | 128.07–130.87 (3842–3926) | Boxster front, panning; caption "It had a top speed of around 240 km/h (149 mph)." | same | old text removed at the cut; new text fades in f3844–3856; the bullet stays | in: hard cut / out: (part 3) |

Rhythm: title cards last 2.0–2.4 s (60–72 f), photo slides 32–33 f (≈1.07 s), montage cards 5 f, callout shots 45–55 f.

## 3. Color

| Token | Hex (native decode) | Role | Where / share of frame |
|---|---|---|---|
| paper-hot | #FBECE0 | centre hot-spot of the paper (vignette peak) | title cards, frame centre |
| paper | #EDE3DA (k-means #EDE4DA / #ECE4DA) | main paper | S47/S48 57 %, S68 87 %, S79 53 % |
| paper-shade | #D2CDC3–#D7D1C8 | vignetted paper ring | S47/48/79 28–36 % |
| paper-corner | #CCC5BE (normal) / #AAA199 (heavy) | vignette corners | S68/76/79 vs S62/S63 |
| graph-paper | #F6EDE2, grid lines 1–2 % darker (−3…−5 levels) | TV scene paper, no vignette | S61 41 % |
| card-cream | #EEDBBD → #DDC8A7 (aged lower edge) | date card | S62 |
| ink | ≈#1F1A17 (stem cores) | title/body type, line drawings, leader lines | thin strokes render as #552555 / #4B293A because of the RGB split |
| bullet | #160D0E | caption triangle | lower third |
| **accent yellow** | **#F2E500** (label boxes 242/229/0); title boxes #EBDD00–#F5E500; discs #E4D700; underline #E8D407 | highlighter, label/title boxes, discs, paint stroke | 2–9 % of frame (S47 10 %, S60 9 %, S63 2.4 %) |
| caption yellow | #FFF36B core (p95) / #C5C921 anti-aliased mean | caption text | lower third |
| halo yellow | #F4EC86 at the edge, fading to paper over 25 px@1080p | glow around the TV | S61 |
| sepia ink | #AE7741 (darkest #996420) | "1969" numerals | S62 |
| type cream | #F4EF83 (p90 #FFF39C) | "1996" | S78 |
| newsprint | #E0E2DC / #A0A19C / #0A0A06 | clippings (neutral, slightly cool) | S50–59 |
| map grey | #C7C8C2 / #B1B2AD / #0A0805 | map scan | S60 |

Grade and treatment:
- **Black level:** crushed to #000000 in footage, the TV and dark shots (L p0.5 = 0–2). It is lifted only in the S49 B&W photo (#1E1E1B, an archival look) and in the S62 vignette scene (min #573F38).
- **White level:** paper peaks at 250–253, never 255. The S49 B&W photo and the newsprint clip at 255.
- **Cast:** warm. R−B is +15…+40 levels on paper shots and ≈0 on monochrome inserts.
- **Photo treatments** (per-shot k-means, verified by eye):
  - S45 green duotone (#031003 → #5D6F5C → #BFD1BF).
  - S46 warm sepia (#402523 → #A18B82 → #D1CDC6).
  - S64 magenta fade (car #9F4883, tarmac #4F4047); S65 purple shift; S66 orange-red #A81805 with yellowed whites.
  - S72 teal #43766B / #639286 with mustard #A58709.
  - S80–82 mauve midtones (#695A63, #B19CA9) with crushed blacks.
  - Newsprint, map and S49: pure greyscale (sat 0.01–0.02), so the yellow is the only chroma on screen.
- **RGB split** (brute-force sub-pixel search of R/B against G in local windows):
  - R is displaced ≈ (+0.5…+0.75, +0.5…+0.75) px@720 = (+0.75…+1.1) px@1080p, i.e. down-right.
  - B is displaced ≈ (−0.25…−0.5) px@720 = (−0.4…−0.75) px@1080p, i.e. up-left.
  - Centre and corner windows give the same value (f2268), so the split is a uniform offset, not radial.
  - Present on newsprint (S50: R −0.75/−0.75, B +0.5/+0.5 needed to align), the TV bezel (cyan fringe on the left edge, pink on the right, f2450 x218–227), title cards, cut-out cars (f2630 wheel), panels and captions.
  - Not detectable on the S47/S48 blueprints, the S49 B&W photo or the S60 map hold, so it is applied per layer.

## 4. Typography

| Style | Role | Case | Size @720 → @1080p | Weight / family | Colour | Background | Effect | Closest commercial / free |
|---|---|---|---|---|---|---|---|---|
| Model title | title-card headline ("Porsche 914") | Title Case | cap 45 → **68**; x-height 32 → 48 (x/cap 0.71); ascender 47 → 70; lining figures at 0.96 of cap | regular/medium transitional text serif, bracketed serifs, ball terminals | ink #1F1A17 with RGB-split fringes | yellow box 391×89 → **587×133**, centred on x = 50 %, top at y 120 → 180 (16.7 %); padding L/R 29–35 → 44–52, top 17–20 → 26–30, bottom 19–24 → 29–36 | box and text share one left→right mask wipe, 22–27 f | Georgia Pro (lining) / Tiempos Text → **Source Serif 4 Semibold** or PT Serif (≈ visual match) |
| Price line | subtitle under the title | Sentence case | cap 22–23 → 34; x-height 13 → 20; width ≈384 → 576 | same serif, regular | near-black (reads #4B293A plum because of the split) | none, on paper; baseline y 267 → 401 (37 %); 38 → 57 px gap below the box | feathered L→R wipe starting ≈5 f after the box, ≈20 f, feather 60–150 → 90–225 px (or a per-glyph fade stagger) | same as title |
| Callout label | annotation on diagrams | lower case | x-height 22 → 33; ascender 34 → 51 | italic serif (Georgia-italic-like) | #372D13 | yellow box #F2E500, height 66–68 → 100–102, padding 19–20 → 29–30 | box grows leftwards from the leader end (right-anchored), 8–11 f | Georgia Italic → **Gelasio Italic** |
| Lower-third caption | fact sentence over footage | Sentence case, ends with "." | x-height 19–20 → 29; cap/ascender 29–30 → 44; old-style figures ("240", "149") | **bold italic** serif | #FFF36B core | no box; left x 208 → 312 (16.25 %), baseline y 649 → 974 (90.2 %) | fade 0→1 over 8–13 f while rising 9 → 13 px; rotating triangle bullet 37×43 → 55×64 at x 148 → 222, gap 24 → 36 | **Georgia Bold Italic** (≈ exact, including old-style numerals) → **Gelasio Bold Italic** |
| Date numerals | "1969" date card | digits | height 70 → 105, width 185 → 278 | serif with lining figures and ball-terminal 6/9 (Caslon/Baskerville-like) | sepia #AE7741, slightly uneven like letterpress | cream deckle card | static; yellow underline 306×10–14 → 459×15–21, drawn L→R in 9 f | Adobe Caslon → **Libre Caslon Text** |
| Overlay year | "1996" over footage | digits | height 104 → 156, width 279 → 419 | high-contrast Didone-ish serif, light weight | cream-yellow #F4EF83 | over the photo; black brush ellipse around it | typed on one character per 12 fps step ("19" first, f3659/3662/3664) | Bodoni / Didot → **Playfair Display** or **Libre Bodoni** |
| Newsprint words | source clippings ("PORSCHE …") | as printed | — | condensed grotesque / slab (scans) | black | highlighter #F2E500 (multiply) | swipe L→R (S50) or already highlighted (montage) | scanned, not typeset |

## 5. Layout & composition

**Title-card grid (S63/68/74a/76/79).** Everything is centred on x = 640 → 960 px@1080p.
- Title box top edge at 16.7 % of height, box bottom at 29 %.
- Price baseline at 37 %.
- Car cut-out: wheels on y ≈ 86 %, width 54–63 % of frame (914: 61 %, 924: 60 %, 944: 63 %, Boxster: 54 %).
- There is no contact shadow under the cars. Paper L jumps from ink to 206 within 4 px below the sill at f2630 x650.

**Lower-third caption.** The bullet sits at x = 11.6 %, the text starts at x = 16.25 % and the baseline is at 90.2 % of height. The text is never boxed.

**Callouts.**
- Disc diameters: 242 → 363 (S46), 374 → 561 (S47), 286 → 429 px@1080p (S48).
- The disc centres on the subject. The label sits upper-left of the disc; the leader runs diagonally out of the disc, then horizontally to the label's right end.
- Leader stroke width 2–3 px@720 = 3–4.5 px@1080p.

**Prints and panels.**
- S64 print: 897×668 px@720 = 70 % × 93 % of the frame, centred, corner radius ≈5–6 → 8–9 px@1080p.
- S75 video panel: 1156×649 px@720, margins 62 / 35 → 93 / 52 px@1080p, corner radius 16–19 → 24–28 px@1080p.
- S61 TV: final height 912 px@1080p (84 % of frame).

**Montage word-lock.** The highlighted word box is fixed at x 630–1287, y 423–612 px@1080p (657×189). Each clipping is positioned so its word lands exactly in that box (centroid stable to ±2 px@640 across 17 cards, f2268–2361).

**Rotation.** Everything is axis-aligned in this range except:
- the S62 under-prints (≈ ±3–6°, visual estimate);
- the magnifier handle (≈ −50°);
- the doodles (continuous rotation).

**Depth.** Single flat plane with no depth of field. Parallax is absent: everything in a shot moves with one 2-D camera. S78 is the only multi-layer blend.

## 6. Textures & materials

| Item | Measurement (method) | Procedural recipe |
|---|---|---|
| Paper base | flat warm off-white plus vignette (below). High-pass (σ = 3) robust std is only 0–1.5 levels on plain paper and 3.0 on graph paper: no visible fibre at this bitrate | solid #EDE3DA plus a 2-octave low-frequency value noise of ±2 % |
| Paper specks | f2845 crop 420×330 @720, high-pass < −6: **42 specks per 100×100 px@720** (≈19 per 100×100 @1080p); median area 3 px@720 (≈2–3 px Ø @1080p), p90 11 px; depth median −11 levels, p10 −25 | static scatter of 1–4 px dark dots at 4–10 % opacity, seeded per shot, changes only on a cut |
| Graph grid | pitch 18 px@720 on S61 (27 @1080p), 23 on S47 (35), 33–36 on S76 (50–54), 47 on S75 (70); depends on camera scale. Lines are 1 px, −3…−5 levels (1–2 %) | SVG/CSS repeating-linear-gradient, 1 px lines at rgba(60,40,20,0.03–0.05), inside the jittering artwork group |
| Animated grain | **none on graphics.** Held frames are bit-identical (mad = 0.0, e.g. f2031/2032, f2082). Between 12 fps steps without jitter only faint 2–3-level speck changes appear (diff f2110→f2113). Footage keeps its own grain (std ≈ 12 levels on S82) | do not add per-frame grain; if wanted, re-seed a 2–3-level dust layer at 12 fps |
| Vignette | median paper L by radius (0 = centre, 1 = corner). Normal (S68/74/76/79): 1.00, 1.00, 0.98, 0.97, 0.95, 0.93, 0.91, 0.87, 0.84, **0.82**. Heavy (S62/S63): …0.90, 0.86, 0.83, 0.77, 0.72, **0.68**. S61 has none | multiply overlay `1 − k·r^1.8`, k = 0.18 (normal) or 0.32 (heavy), tinted toward #5A4636 |
| Yellow offset rim (prints, panels) | S64 rim widths: right 6 px, bottom 9 px, top/left 4 px @720 → offset ≈ (+1, +2.5) px@720. S75: right/bottom 8 px, top 2–4 px, left 0 → offset ≈ (+4, +3) px@720. Coverage of #F2E500 ≈ 60 % at the photo edge (B channel 190 → 77). Right/bottom rims look yellow-green because of the RGB split | `drop-shadow(+2…+6 px, +4…+5 px, 6 px, rgba(242,229,0,0.6))` @1080p; S64 also has ≈3 px of spread |
| Yellow halo (TV cut-out) | symmetric, 17 px@720 = **25 px@1080p** wide; edge colour #F4EC86 ≈ 45 % of #F2E500 over paper, linear falloff | outer glow 25 px, #F2E500 at 45 % → 0 |
| Card-stack shadow (S62) | below the stack: L 88 → 228 over ≈50 px@720; contact opacity ≈ 0.6; 65–75 px of shadow on the bottom-left vs 20–25 px top-right | `drop-shadow(−12 px +22 px 33 px rgba(40,25,10,0.6))` @1080p (≈; light from top-right) |
| Deckle edge | scalloped/serrated border on the card and the under-prints (f2575) | SVG mask with a 4–6 px@1080p sine-noise edge |
| Highlighter | solid #F2E500 multiplied over the text; slightly ragged ends; covers from just above cap height to just below the baseline (S50: 165 px@1080p high on 112 px caps) | rect with a rough-edge mask, `mix-blend-mode: multiply` |
| Dry-brush paint (S60) | ragged horizontal bristle streaks; final 966×366 px@1080p | brush PNG or SVG turbulence mask revealed by a moving gradient |
| RGB split | see §3 | per-layer channel offset (filter) |
| Halftone / misregistration / light leaks / flicker / scratches | none added in this range. Newsprint halftone is in the scans; no luma flicker (held frames are identical); no single-frame luma spikes in f1968–3924 | — |

## 7. Motion language

Cadence (from `porsche.csv`, with a "held" threshold of mad_lo < 0.1 rather than the shot table's 0.5, which hides small moves):

| Content | Frames | Held | Change intervals | Verdict |
|---|---|---|---|---|
| All, f1968–3924 | 1957 | 40 % | 1 f 58 %, 2 f 22 %, 3 f 16 % | — |
| Paper / graphics / photo shots | 1420 | **54 %** | 1 f 30 %, 2 f 34 %, 3 f 29 % | **12 fps** (3-2-3-2), not "on twos". Bursts of 1 f are on-ones moves layered on top |
| Live footage (S45, S67, S73, S80–82) | 413 | 7 % | 1 f 92 % | S67/S80–82: 25 fps source, one duplicate every 6 f ("xxxxx."); S45: 24 fps, one every 5 f ("xxxx."); S73: no duplicates (30 fps, or hidden by the slide) |
| S61 TV + doodles | 124 | 0 % | all 1 f | on ones |

| Motion | What | Duration | Velocity profile → easing | Overshoot | Stepping | Evidence |
|---|---|---|---|---|---|---|
| Highlighter swipe (fast) | right edge of the yellow block | 10 f (0.33 s) | progress .01, .05, .11, .25, .50, .75, .89, .96, .99, 1 → **cubic-bezier(0.75,−0.05,0.35,0.95)** (≈ easeInOutCubic); peak 168 px@1080p per frame | none | ones | f2255–2265 |
| Highlighter swipe (slow, accelerating) | S77 heading / body line | 22 f / 27 f | step increments grow (heading 10, 11, 14, 17, 23, 31, 32 then 7 px@640; body 9 → 24) and stop dead → **ease-in** (heading ≈ linear-to-in, body ≈ easeInQuad) | none | 12 fps | f3364–3386, f3394–3421 |
| Paint-stroke reveal | stroke and text share one mask | 14 f | .14, .30, .45, .57, .67, .74, .80, .85, .93, .97, .99, 1 → **cubic-bezier(0.10,0.10,0.30,0.95)** (≈ easeOutQuad) | none | ones | f2364–2377 |
| Title box wipe | box + title mask, left → right | 22–27 f | thin bar first (≈ padding width), slow over the first glyph, a jump through the middle (.33→.73 in one step), long tail → **cubic-bezier(0.9,0.43,0.0,0.76)** (S63 rmse .012, S79 rmse .007) | none | 12 fps | f2589–2614, 2796–2818, 2948–2970, 3231–3248, 3703–3732 |
| Subtitle reveal | price line | ≈20 f, starts +5 f after the box | feathered left→right front, 60–150 px@720 wide (column ink ratio, f2601/2606/2609) | none | 12 fps | f2594–2612 |
| Disc entrance: grow | S46 disc from its centre | 12 f | diameter .04, .12, .30, .82, .98, 1 → **cubic-bezier(1.0,0.39,0.20,0.94)** (strong in-out) | none | 12 fps | f2033–2045 |
| Disc entrance: fly + grow | S47 from the upper-right edge; S48 from below the bottom edge | 10–13 f | position .35, .72, .91, .98, 1 → **cubic-bezier(0.34,−0.22,0,1.0)** (≈ ease); scale ≈0.2–0.4 → 1 | none | 12 fps | f2083–2093, f2135–2148 |
| Leader-line draw | stroke grows from the disc toward the label | 7–10 f, starts ≈8–10 f after the disc | ≈ linear-out | none | 12 fps | f2043–2050, 2088–2098, 2145–2155 |
| Label wipe | box grows leftward from its right end | 8–11 f, starts ≈5 f after the line | width .03, .27, .63, .94, 1 → ≈ **ease-in-out (0.42,0,0.58,1)** (rmse .024) | none | 12 fps | f2048–2058, 2093–2103, 2150–2158 |
| Car cut-out slide | slides left into place after the cut | 5–8 f, 84–207 px@1080p | .09/.64–.89 on the first step, then .74–.94, 1 → **cubic-bezier(0.36,0.10,0,0.94)** (≈ CSS ease) | none | 12 fps | f2579–86, 2779–88, 3205–13, 3696–3702 |
| Print scale settle | photo prints | 5 f | S64 0.92–0.94 → 1 (push); S65/66 ≈1.13–1.15 → 1 (pull), ≈85 % of the change in the first 12 fps step, so a strong ease-out | none | 12 fps | f2639–44, 2671–76, 2704–09 |
| Panel slide-in | S75 video panel from the right | 8 f, 192 px@1080p | .33, .58, .75, .86, .92, .97, .98, 1 → **cubic-bezier(0.07,−0.04,0.11,1.0)** (≈ easeOutCubic) | none | ones | f3099–3107 |
| Bullet rise | triangle from below the frame | 8–10 f, ≈125 px@1080p | top-edge progress .06….96 → **cubic-bezier(0.68,0.34,0.59,1.0)** (≈ AE easy-ease) | none | ones (S80) / 12 fps (S49) | f3764–3773, f2183–2190 |
| Bullet rotate | −90°, from pointing up to pointing right | 10–16 f, starts 0–2 f after the rise | 90 → 87 → 80 → 72 → 61 → 51 → 40 → 32 → 24 → 19 → 15 → 10 → 8 → 5 → 3 → 0° → **cubic-bezier(0.28,0.08,0.26,0.91)** (≈ ease) | none | ones / 12 fps | f3774–3789, f2191–2200, f3113–3125 |
| Caption fade + rise | yellow text | 8–13 f, starts ≈2 f before the rotation ends | opacity .18, .33, .50, .62, .69, .79, .83, .87, .92, .96, 1 while y drops 4.5 px@640 (13 px@1080p) → **cubic-bezier(0.26,0.57,0.33,0.84)** (≈ easeOutQuad / ease) | none | ones | f3844–3856, 3789–3800, 1972–1980 |
| Underline draw | "1969" underline, left → right | 9 f | .28, .86, .96, 1 → ≈ ease-out | none | 12 fps | f2537–2546 |
| Push-in on a cut, settle | S50, S60, S61 | 7–10 f (+ a 40 f tail on S61) | S50 0.80 → 1.0 **easeOutQuart** (0.15,0.5,0.25,1.05); S60 1.47 → 1.0 **easeOutCubic**; S61 0.67 → 0.96 in 10 f, 1.0 by +50 f (cubic-bezier(0.2,0.6,0.4,0.95)) | none | ones | f2246–54, 2362–69, 2405–55 |
| Stepped zooms | S49 out ×1.90 → 1; S72 in ×3.4; S77 in ×2.09 | 12 f / 17 f / 43 f | S49 **cubic-bezier(0.69,0.35,0.20,0.97)**; S72 ≈ ease (0.06,−0.2,0.25,0.97); S77 ≈ easeInOutQuad (0.49,−0.02,0.66,1.05) | none | 12 fps | f2178–90, 2866–83, 3293–3336 |
| Loupe glide | lens Ø 282–288 px@1080p + handle | 77 f (2.57 s), ≈1140 px@1080p | **linear**, 12.3 px@640 per 12 fps step = 443 px/s@1080p; shallow arc (y dips 63 px@1080p, then rises 78); stops within one step | none | 12 fps | f3018–3095 |
| Doodle loop | outline square / rect / triangles, yellow dot, ring | continuous | square turns 180° in ≈50 f (ease-in-out, peak 7.7°/f), holds 15 f, repeats; dot ping-pongs 153 px@1080p with a 36 f half-period (≈ easeInOutQuad, (0.62,0.09,0.43,0.86)) | none | ones | f2405–2528 |
| Type-on + brush ellipse | "1996"; black ellipse with a tapered brush stroke (47 → 5 px@720) | 5 f each | one glyph per 12 fps step; ellipse drawn clockwise in 5 f | none | 12 fps / ones | f3659–3666 |
| Micro-jitter ("boil") | whole artwork group: paper grid, drawing, disc, label | every other 12 fps step = 6 fps | 0.25–0.75 px@720 = **0.4–1.1 px@1080p**; per-step \|tx\| p90 0.3–2.4 px@1920; rotation p90 ≤ 0.04° | — | 6 fps | f2108→2110 and f2113→2115 shift; f2110→2113 does not |
| Hold drift | slow camera during holds | — | 0 to +2.9 %/s zoom (S48 +2.7, S63 +2.9, S62 +0.66, others ≈0) | — | 12 fps | `porsche.csv` |

Holds between beats: a callout trio finishes about 1 s before the next cut. Title cards hold about 1.0–1.3 s after the wipe completes.

## 8. Transitions

| # | Type | Frame by frame | Length | Instances | Build |
|---|---|---|---|---|---|
| T1 | **Whip/slide-through (12 fps)** | f2070: −45 px@1080p; f2073: −211; **cut f2075**; f2078: −62; f2080: −9; then hold | 5 f out + 5 f in | S46→47, S47→48 (−14, −85 / −183, −51, −3), S62→63 (−14, −50 / car −75, 0, −9) | animate the 2-D camera x with ease-in to v ≈ 200 px@1080p per step, cut, start the new shot offset by the same velocity and ease-out; quantise to 12 fps |
| T2 | Whip-through on ones | f2525: +4; +6; +12; +22 px/f; **cut f2529**; f2531: +18; static | 4 + 2 f | S61→62 (right), S73→74 (left: −2, −2, −5, −8, −13, −22 / −76, −16), S74→75 (−10, −30 / −66, −51, −35, −25, −21, −19, −17) | same as T1 without quantisation |
| T3 | Vertical whip | ty −5 (f3273), −15 (f3275); **cut f3278**; −70 (f3281), −17 (f3283) | 5 + 5 f | S76→77 | T1 on the y axis |
| T4 | **Push-in-through** | outgoing zoom per frame ×1.0007, 1.0016, 1.0037, 1.009, 1.015, 1.022, 1.027, 1.038, 1.039 (cumulative ×1.165, ease-in); **cut f2405**; incoming starts at ×0.67 and eases out (×1.105, 1.082, 1.059, 1.041, 1.028, 1.017 …) | 9 + 10 f (+ tail) | S49→50 (×1.02, ×1.026 / ×1.25 in 8 f), S60→61, S63→64, S77→78 (×1.003 → 1.024 / ×1.032, ×1.023, ×1.005) | scale both shots about their centre; velocity continuous across the cut |
| T5 | **Pull-out-through** | ×0.998, 0.992, 0.984, 0.971, 0.950, 0.923 (cumulative ×0.83); **cut f2362**; ×0.874, 0.902, 0.937, 0.960, 0.976, 0.987, 0.998 (incoming from ×1.47) | 6 + 7 f | S59→60, S64→65 (×0.967 / ×0.888, ×0.975), S65→66, S66→67, S79→80 (×0.995, ×0.986) | mirror of T4 |
| T6 | Hard cut | instantaneous | 0 f | S45→46, S48→49, S67→68, S68→69, S72→73, S78→79 (luma 46 → 200), S80→81→82; montage every 5 f | — |
| T7 | Card swap | the paper stays; car and title vanish; a new car appears at ×0.87 and steps to 1.0 in 5 f | 5 f | S74a→74b (f3000) | swap children inside a persistent paper layer |
| T8 | **Ink/smoke-mask dissolve** | the new photo bleeds in centre-first through an organic mask. Mean blend α (least squares per 20 px block vs the end frames): f3480 .09, 3485 .21, 3490 .34, 3495 .47, 3500 .59, 3505 .70 (≈0.024/f, linear). At f3490 the spatial α spread is p10 .00 / p90 .89 | ≈40 f | S78 internal (f3478–3518, 3560–3606, …) | WebGL: α = smoothstep(t − 0.15, t + 0.15, fbm(uv·3) · 0.6 + (1 − dist·1.2) · 0.4) |
| T9 | Fade from black | luma 8.8 → 46 over f3430–3470, 12 fps steps; faint blueprint lines are first to show | 40 f | S78 opening | black overlay opacity 1 → 0, stepped |

Not present in this range: flash frames, dip-to-white, light-leak wipes (luma-spike scan of f1968–3924 found none).

## 9. Reusable components
Defaults are @1080p and 30 fps; "f" = frames.

| Component | Props (defaults) |
|---|---|
| `Stepped` (HOC / hook) | `fps=12` → `sf = floor(f·12/30)`, evaluate animations at `sf/12` s (gives the 3-2-3-2 holds); `onOnes=false` per child |
| `Jitter` | `fps=6`, `amp=0.75 px` (range 0.4–1.1), `rotDeg=0.03`, seeded from `floor(f·6/30)`; wraps the artwork group, not the vignette or captions |
| `PaperBackground` | `variant: 'plain' \| 'graph' \| 'blueprint'`, `color=#EDE3DA`, `hot=#FBECE0`, `gridPitch=27…70`, `gridAlpha=0.04`, `specks={density:19/10⁴px², size:1–4, alpha:0.04–0.10}` |
| `Vignette` | `strength=0.18` (`heavy`: 0.32), `exponent=1.8`, `tint=#5A4636`, `blend='multiply'` |
| `RGBSplit` | `r=[+1.0,+1.0]`, `b=[−0.6,−0.6]`, `enabled` per layer |
| `HighlighterSwipe` | `color=#F2E500`, `blend='multiply'`, `dur=10f` (on ones), `ease=cubic-bezier(0.75,-0.05,0.35,0.95)`; `variant='slow'` → `dur=22–27f`, 12 fps, ease-in; `padY=0.25·cap`, `roughEdge=true` |
| `PaintStrokeReveal` | `texture='dry-brush'`, `size=[966,366]`, `dur=14f`, `ease=cubic-bezier(0.10,0.10,0.30,0.95)`, `revealsChildren=true` (text masked with it) |
| `CalloutDisc` | `d=360–560`, `color=#E4D700`, `blend='multiply'`, `enter='grow' \| 'fly'`, `from='top-right' \| 'bottom'`, `dur=12f`, `ease=grow: (1,0.39,0.2,0.94) / fly: (0.34,-0.22,0,1)`, 12 fps |
| `LeaderLine` | `points=[disc, elbow, labelRight]`, `stroke=3`, `color=#1F1A17`, `delay=+9f` after the disc, `dur=8f`, draw from the disc end |
| `CalloutLabel` | `text`, `font='Gelasio Italic'`, `xHeight=33`, `h=100`, `padX=30`, `bg=#F2E500`, `anchor='right'`, `delay=+5f` after the line, `dur=10f`, `ease=(0.42,0,0.58,1)` |
| `TitleCard` | `title`, `subtitle`, `car` (PNG cut-out), `boxRect=[663,180,587,133]`, `titleCap=68`, `subCap=34`, `subBaseline=401`, `carSlideFrom=+84…+207`, `carSlideDur=6f` (ease), `boxDelay=6–26f`, `boxDur=25f`, `boxEase=(0.9,0.43,0,0.76)`, `subDelay=+5f`, `subDur=20f`, `subFeather=150` |
| `BulletCaption` | `text`, `font='Gelasio Bold Italic'` (old-style figures), `xHeight=29`, `color=#FFF36B`, `x=222`, `baseline=974`, `tri={w:55,h:64,color:#160D0E}`, `gap=36`, `rise={from:+125,dur:9f,ease:(0.68,0.34,0.59,1)}`, `rotate={from:-90°,dur:13f,ease:(0.28,0.08,0.26,0.91)}`, `text={fade:12f, rise:13 px, ease:(0.26,0.57,0.33,0.84), delay:rotate.end−2f}`, `persistAcrossCuts=true` |
| `PhotoPrint` | `src`, `radius=8`, `rim={color:#F2E500, alpha:0.6, offset:[2,4] (prints) … [6,5] (panels), blur:6, spread:2}`, `enterScale=0.93 (push) \| 1.14 (pull) → 1`, `enterDur=5f` (12 fps, strong ease-out) |
| `VideoPanel` | `radius=26`, `margins=[93,52]`, `rim` as PhotoPrint, `enter='slide-right'`, `dist=192`, `dur=8f` on ones, `ease=(0.07,-0.04,0.11,1)` |
| `CutoutHalo` | `width=25`, `color=#F2E500`, `alpha=0.45` linear to 0 (TV) |
| `WordLockMontage` | `clips=[{src, wordRect}]`, `targetRect=[630,423,657,189]`, `cardDur=5f`, `highlight=#F2E500 multiply`, `exit='pull-out-through'` |
| `DateCard` | `year`, `font='Libre Caslon Text'`, `h=105`, `ink=#AE7741`, `card=#EEDBBD`, `deckle=5`, `stack=[±3–6°]`, `shadow=(-12,22,33,0.6)`, `underline={w:459,h:18,color:#E8D407,delay:8f,dur:9f,ease:'ease-out'}` |
| `Loupe` | `lensR=143`, `ring` + `handle` PNG, `revealSrc` (x-ray image clipped to the lens), `path` = shallow arc, `speed=443 px/s` linear, 12 fps |
| `DoodleField` | `shapes=[square, rect, tri, dot(#F2E500), ring]`, `rotate=180° / 50f in-out + 15f hold`, `dot={amp:153, half:36f, ease:(0.62,0.09,0.43,0.86)}`, on ones |
| `TypeOnYear` + `BrushEllipse` | `stepFps=12`, `font='Playfair Display'`, `h=156`, `color=#F4EF83`; ellipse `bbox≈970×396`, stroke 70 → 8 px tapered, `dur=5f` |
| `MomentumCut` | `kind: 'whipX' \| 'whipY' \| 'pushIn' \| 'pullOut'`, `outDur=2–6f` (ease-in), `inDur=3–10f` (ease-out), `vCut≈200 px/step` or `×1.04–1.10 per frame`, `stepped=true` for paper shots |
| `InkDissolve` | `dur=40f`, `noiseScale=3`, `centreBias=0.4`, `edge=0.15`, 12 fps |

## 10. Build notes for code (Remotion / React)
- **Layer stack per shot:** `<Camera>` (2-D translate/scale, stepped) → `<Jitter>` → paper → artwork (cut-outs, prints, discs (multiply), drawings) → callout lines and labels → `<RGBSplit>` (per layer) → screen-space `<Vignette>` → captions and bullet. Captions stay outside the camera, jitter and vignette. The bullet persists across `<Sequence>` boundaries, so mount it in the parent composition.
- **Stepping:** compute `const sf = Math.floor(frame * 12 / 30)` and pass `sf * 30 / 12` to `interpolate()` for graphic layers. Keep on-ones layers on `frame`: highlighter (S50), paint stroke, caption fades, panel slides, settle pushes at cuts, doodles, footage. Jitter uses `random(seed + Math.floor(frame * 6 / 30))`.
- **Footage:** archival clips are 24–25 fps. `<OffthreadVideo>` at 30 fps reproduces the 1-in-5/6 duplicates for free. Grade per clip with an SVG `feColorMatrix`: green duotone, sepia, magenta fade or mauve, with a black point at 0 and a white point at ≈0.98.
- **RGB split:** SVG filter with `feColorMatrix` (isolate R / G / B) → `feOffset` (R dx = dy = +1, B −0.6) → `feComposite operator="arithmetic"` (sum). In WebGL, three texture taps. Apply it to type, cut-outs and panels, not to the blueprints. This is what turns thin black lines plum.
- **Masks:**
  - Title box: `clip-path: inset(0 calc(100% − p·100%) 0 0)` on a group holding the box and the text.
  - Label: anchor right, so use `inset(0 0 0 calc(100% − p·100%))`.
  - Subtitle: `mask-image: linear-gradient(90deg, #000 calc(p·W − 150px), transparent calc(p·W))`.
  - Highlighter: rect width = p·W, `mix-blend-mode: multiply`.
  - Leader line: `stroke-dasharray` / `stroke-dashoffset`.
  - Paint stroke and underline: reveal a brush PNG with a moving linear mask.
- **Camera through cuts:** drive one continuous camera curve across two `<Sequence>`s (outgoing ease-in, incoming ease-out with the same instantaneous velocity at the cut). Quantise to 12 fps for paper shots; leave it on ones for newsprint, map and TV shots.
- **Vignette:** a full-frame div with `radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(90,70,54,·) 100%)` and `mix-blend-mode: multiply`. Tune the opacity so the corner reaches 0.82 (normal) or 0.68 (heavy) of the centre.
- **Hard to replicate:**
  - The ink/smoke dissolve: needs a WebGL noise threshold (Remotion `<ThreeCanvas>` or a custom canvas).
  - Matching archival grades: use LUTs.
  - The loupe's alternate image: needs a separate, aligned plate.
  - The exact title serif: it is a ≈ match only, so check the 914 crop `stills/B/crop_f2630_title.png`.
- **Colour:** export at BT.709 and set the accent to #F2E500 (not the greenish values in the palette JSON).

## 11. Evidence index
- Sheets: `sheets/porsche/sheet_031.png` … `sheet_061.png` (all viewed in order; 031 and 061 for the boundaries).
- Strips (`strips/`):
  - `porsche_01950-01985` S45 caption.
  - `02030-02077` S46 disc / line / label and the whip.
  - `02080-02127` S47 disc fly-in and the 12 fps holds.
  - `02124-02171` S47→48 whip and S48 callout.
  - `02176-02223` S49 stepped zoom-out and bullet.
  - `02240-02287` S50 push settle, highlighter swipe and montage start.
  - `02354-02377` S59→60 pull-out-through and paint stroke.
  - `02398-02421` S60→61 push-through and TV entry.
  - `02523-02570` S61→62 whip-right and "1969" underline.
  - `02579-02626` S63 car slide, title wipe and subtitle.
  - `02632-02679` S63→64→65 print settles.
  - `02680-02727` S65→66.
  - `02729-02776` S66→67 footage cadence.
  - `02843-02890` S68→72 brochure slide, stepped push and highlight.
  - `02990-03037` S74a→b card swap and loupe entry.
  - `03038-03085` loupe glide.
  - `03093-03140` S74→75 push-left, panel slide and bullet.
  - `03360-03407` S77 heading and body swipes.
  - `03470-03517` S78 ink dissolve.
  - `03560-03607` S78 dissolve.
  - `03694-03741` S79 title card.
  - `03838-03885` S81→82 caption swap with a persistent bullet.
- Crop-strips (`stills/B/`):
  - `cs_caption911_triangle`, `cs_caption928_triangle`, `cs_s49_bullet_caption`, `cs_s80_bullet_caption`: bullet rise and rotate.
  - `cs_s46_circle_line_label`: callout order.
  - `cs_s61_doodles_left`: doodle motion.
  - `cs_s63_titlebox_subtitle`: shared box/text mask and the feathered subtitle.
  - `cs_s60_paint_text_reveal`: stroke reveals the text.
  - `cs_s78_1996_type_ellipse`: type-on and the ellipse.
- Crops and diagnostics (`stills/B/`):
  - `crop_f2630_title`, `crop_f2630_car_edge`: serif, RGB split, no car shadow.
  - `crop_f2065_label`, `crop_f2065_circle`: label typography, multiply disc.
  - `crop_s50_highlight_mid_end`: highlighter edge.
  - `crop_f2450_tv_corner`, `crop_f2450_tv_br`: halo and RGB split on the bezel.
  - `crop_f2575_card_corner`: deckle edge and stack shadow.
  - `crop_f2845_paper_highpass_x8`: specks and grid.
  - `crop_f3050_loupe`: x-ray lens.
  - `crop_f3680_1996`.
  - `crop_f3870_caption`: caption face and bullet.
  - `diff_f2113_f2115_x4`: 6 fps jitter moves the whole artwork including the grid.
  - `diff_f2110_f2113_signed_x10`: the off-beat step changes only faint specks.
  - `alpha_map_f3490`: centre-first dissolve.
  - `overview_S45-58`, `overview_S59-72`, `overview_S73-82`: first / middle / last frame of every shot.
  - `f2120_bt601`: decode-matrix proof.
  - Native grabs `fNNNN.png` (1280×720), used for every px / hex value above.
