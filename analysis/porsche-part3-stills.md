# Porsche part 3 (130.8 s → end) + designer stills: porsche f3925–5898 (shots 83–110) and 27 presentation stills

> Analyst: C. Sources reviewed: all keyframe sheets 061–088; 29 full-frame-rate strips (f3927–5816); `metrics/porsche.csv` rows 3925–5898; `porsche_shots.md/json`; `palettes/porsche.json` + `palettes/stills.json`; 16 native 1280×720 grabs and 13 zoom crops in `stills/C/`; all 27 designer stills (3 HR 1400×788). Pixel values are given at source resolution (video 1280×720; 640-px analysis frames ×2; HR stills 1400 px) **and** at 1920×1080 (“@1080p”: video ×1.5, 640-px ×3, HR stills ×1.371). Time is in frames @30 fps and seconds. Estimates are marked ≈.

## 1. Summary of the look
- **Two layers: a 12 fps cut-paper graphics layer over 30 fps footage.** In my range, graphics shots are 65 % held frames and footage shots 17.5 % (52 % overall, not the automatic 36 %). Graphics change every 2 or 3 frames, alternating (70×2 and 41×3 intervals; S109 has exactly 34×2 and 33×3). That is **12 fps conformed to 30 fps**, not “on twos”. A separate **6 fps texture boil** (grain re-roll plus ≈1 px jitter every 5 f) runs underneath, even during holds. Text fades, captions, a few push-ins and the final fade run on ones.
- **One accent colour: lemon highlighter yellow ≈ #F2E600.** It appears as flat boxes behind dark-brown serif text, opaque tape, stamp tape, a hard offset “shadow” behind cut-outs, glows on black, and a dry-brush stroke. The only other accent is a maroon hand-drawn stroke (#7F1322).
- **Warm cream paper everywhere** (#F9EFE6 centre → #CEC6C0 corners), with a multiply vignette (corners at 0.83 of the centre), fine dark speckle and an optional 23 px@720 grid. Blacks are lifted to ≈#181812 in graphics. Footage is crushed to #000.
- **A whole-frame RGB split**: red is shifted down-right and blue up-left by 1–2.5 px@720 (≈2–4 px@1080p). It is a uniform translation, not radial, and constant over time. **Monochrome grain is added after the split** (grain channels correlate 0.84–0.92 at zero shift). Grain is re-rolled only when a new drawing is made, so held frames are bit-identical (`mad`≈0).
- **Editorial serif type only.** Roman semibold for titles, bold italic for captions and quotes, a Didone for desk labels. Text sits on yellow boxes or straight on paper. There is no sans-serif anywhere in this range.
- **Repeated templates.** The *product card* (“Porsche X” in a yellow box, “The price at launch is $Y”, side-view car cut-out) appears 4× in this range and 3× more in the stills, with identical timing. The *video caption* (▶ plus italic line, lower-left) appears 5×. *Photo cards* with a yellow offset edge recur.
- **Cuts hide inside motion.** Zoom-through cuts accelerate into the cut and decelerate out of it. Slideshow cards carry their scale velocity across hard cuts. Cut-outs are already mid-move on the first frame.
- **Desk scrapbook finale (S109).** The camera flies over taped white-bordered photos, scalloped “stamp” label slips (356 / 911 / Boxster / Cayenne / Macan / Panamera), pencil, pen, highlighter, paperclips, sticky notes and a 1950s newspaper ad. It moves at 12 fps with rolling camera rotation.
- **Bookended ending.** The video closes on a grid-paper quote card of Ferry Porsche with a yellow silhouette echo, crop-mark crosshairs, typewriter text, then a 48 f linear fade and 24 f of black. The opening quote (still e15e05, 39.9 s) uses the same card. **The video has no end card.** The “Thanks for watching” card (8e0bc0) exists only as a presentation still.

## 2. Shot log
Shot numbers are from `porsche_shots.md`. Frame ranges are inclusive.
| Shot | t0–t1 (f) | Content / composition | Layers (back→front) | Motion (what, how, how long) | In / out transition |
|---|---|---|---|---|---|
| 83 | 130.90–134.50 (3927–4035) | Bar chart “Porsche Global Sales Numbers / stuttcars.com”, 8 charcoal bars 1998–2005, maroon ring around 1998–2001 | cream paper + vignette → 3 yellow gridlines → bars + maroon value labels → maroon ellipse → split/grain | settle push-in f3927–3934 (zoom/step 1.10, 1.04, 1.016 ⇒ ×1.16, ease-out); bars grow staggered f3941–3996; ellipse draws f4003–4019; exit drift left f4031/4034 (−23, −72 px@1080p) | hard cut in; out: whip continues in S84 |
| 84 | 134.53–138.27 (4036–4148) | 5 colour photos of Porsche plants on near-black (#050402) with faint cursive handwriting and map lines; ends as a 2-over-3 card pyramid | black bg + handwriting texture → cream-bordered cards (thick bottom border) → handwriting overlay on photo skies | whip-pan R→L 3331 px@1080p in 53 f (f4036–4089), ease-in-out, heavy horizontal motion blur, 12 fps; pull-back ×0.80 f4099–4124 ease-out; accelerating pull-back f4141–4148 (0.991→0.961/step) | hard cut (mid-motion) / hard cut to black |
| 85 | 138.30–141.83 (4149–4255) | “SUV” in a glowing yellow box over ghost SUV line drawings; then Cayenne factory photo triptych with 1 px yellow outlines; neon “2002” | black → dim blueprint drawings (≈5–10 % grey) → box/cards → bloom | box wipe L→R f4164–4181 (17 f); box scale ×1.24 f4194–4198; centre card scale-in with overshoot f4199–4214 (≈1.2×→1.0); side cards slide out from behind f4214–4221 (≈ ±300 px@1080p, ease-out); centre card drops ≈¼ H while “2002” rises f4229–4236 | hard cut / hard cut |
| 86 | 141.87–145.17 (4256–4355) | **Product card** “Porsche Cayenne / The price at launch is $56,300”, dark Cayenne side view | paper + faint grid → car cut-out → yellow box → subtitle | car settles from +123 px@1080p in 8 f; title wipe f4266–4298 (32 f); subtitle f4271–4290; hold 58 f | hard cut / hard cut |
| 87–90 | 145.20–149.10 (4356–4473) | 4 photo cards, 30 f each: 1st-gen Cayenne in a quarry, two other Cayenne stills, factory in a green tint | grid paper → photo card (rounded corners) → yellow offset edge (+9,+12 px@1080p) | each card scales in 6–12 f and out 4–7 f by 8–21 %; **scale direction continues across each cut** (see §8 T4); 12 fps | hard cuts at f4386, 4416, 4446 |
| 91–93 | 149.13–152.10 (4474–4563) | factory footage *inside* a card covering 91 % W × 83 % H (assembly line, car on hoist, transmission) | paper → card with footage (on ones) → yellow edge | card scales 0.845→1.0 in 10 f **on ones** (f4474–4484); cuts inside the card at f4507 and f4531; exit slides left with acceleration f4556–4563 (−78 px@1080p) | in-card cuts / hard cut mid-slide |
| 94 | 152.13–154.13 (4564–4624) | **Product card** Panamera ($89,800), blue car | as 86 | car +75 px@1080p → 0 in 7 f; title wipe f4571–4600; subtitle wipe f4576–4591; exit zoom 0.996→0.981 | hard cut / flash-shrink cut |
| 95 | 154.17–156.27 (4625–4688) | footage: 2 Panameras on a bright road; caption “▶ Porsche first introduced the Panamera back in 2009” (yellow ▶, dark text) | footage → caption | exposure ramp-in luma 71→87 (8 f); ▲ rises from below the frame f4632–4642, spins ≈270° CCW into ▶ f4643–4652; text dissolves f4646–4660 | hard cut / hard cut |
| 96 | 156.30–158.10 (4689–4743) | **Product card** Macan ($79,000), white car | as 86 | car +120 px@1080p → 0 in 7 f (motion-blurred); title wipe f4699–4725 | out: 1-frame wash f4743 (luma 205→225, zoom 0.975) |
| 97 | 158.13–160.50 (4744–4815) | footage: red Macan on a cable-stayed bridge, warm grade; caption “▶ The production version of the Macan was unveiled at the 2013” (dark ▶, yellow text) | footage → caption | exposure ramp-in 80→106 (7 f); ▶ appears f4761; text fade f4768–4780 | hard cut |
| 98–101 | 160.53–166.60 (4816–4998) | factory montage (Taycan body line, worker fitting a bumper, Taycan on a lift, robot fitting a wheel) | footage only, no overlays | footage on ones; handheld source motion (tx −5…−30 px/f@1080p); cuts every 1.3–1.8 s | hard cuts |
| 102 | 166.63–168.67 (4999–5060) | **Product card** Taycan ($103,800), silver car | as 86 | car enters by **scale** 0.79→1.0 plus slide in 9 f; title wipe f5009–5040 | flash-shrink cut |
| 103 | 168.70–170.13 (5061–5104) | footage: Taycan parked on a dark urban plaza, desaturated (chroma 7) | footage | slow push (source) | hard cuts |
| 104 | 170.17–172.23 (5105–5167) | footage: Taycan rear 3/4 on a highway; caption “▶ Accelerates from 0 to 100 km/h in as little as 2.8 seconds.” | footage → caption | ▶ at the cut; text fade-in f5109–5116 (7 f); fade-out f5160–5167 (7 f) ends exactly on the cut | hard cut |
| 105–106 | 172.27–174.00 (5168–5220) | footage: Taycan front close-up, then a white Taycan; caption “▶ Range of up to 590 km on a single charge.” | footage → caption | text fade f5175–5184 (9 f); **the caption survives the cut at f5202** | hard cut / hard cut |
| 107 | 174.03–179.93 (5221–5398) | green Taycan Sport Turismo + Taycan studio still, heavy vignette and dark smoke drifting at the top; “2023”, then “$43 000 000 000” | photo → smoke → “2023” (masked behind the cars) → $ text → yellow box | **rack-focus in**: f5221 heavily defocused, sharp by ≈f5226; push-in ×1.09 in 10 f on ones (exp. ease-out); “2023” rises ≈100 px from behind the cars in 8 f; vertical tilt −324 px@1080p f5304–5336; highlight wipe f5326–5346; zoom-through f5391–5398 | hard cut / zoom-through |
| 108 | 179.97–184.80 (5399–5544) | CRT TV: cream barrel screen in a dark bezel; serif word reel (Performance, Excellence, Precision, Engineering, Mastery, Velocity, **Legacy**, Prestige) | bezel → screen paper → faint word list (≈15–20 % opacity) → 1 px black box → yellow dry-brush stroke → crisp word | cursor line opens into a box f5399–5426; reel scrolls up and stops on “Legacy” f5423–5443; brush wipe f5428–5456; content punch ×1.21 at f5458, then slow push; accelerating zoom f5536–5544 with brighten 164→182 | hard cut / zoom-through |
| 109 | 184.83–190.67 (5545–5720) | top-down desk scrapbook: 356 → 911 → Boxster → Cayenne → Macan clusters (Panamera at the edge) | desk paper + speckle → props (pen, pencil, newspaper, drafting sheet, paperclips, sticky notes, highlighter) → photos with borders and drop shadows → yellow tape / stamp slips → split/grain/vignette | decelerating push ×1.32 (f5545–5557); pan X +4070, Y +740 px@1080p; roll 0→−11.4°→+8.2°→−17.1°; pull-out ×0.86 (f5707–5719); strict 12 fps | zoom-through in / hard cut |
| 110 | 190.70–196.60 (5721–5898) | grid-paper quote card: “We build cars that people desire, not just those they need.” / “-Ferdinand Anton Ernst Porsche”; B/W cut-out of old Ferry seated; corner crop marks | grid paper → crop marks → yellow silhouette echo → B/W cut-out → serif text | 6 f of empty paper; Ferry slides in from the right f5727–5762; echo lags 3–5 f; type-on f5727–5772 and f5774–5795; hold to f5826 with 6 fps jitter; fade to black f5827–5874; black f5875–5898 | hard cut / **fade to black (end)** |

## 3. Color
**Palette tokens.** Hex values are pixel medians from native grabs, cross-checked against the k-means palettes.
| Token | Hex | Role | Share / where |
|---|---|---|---|
| paper-cream | #F9EFE6 (centre) / #EEE6DC | page background | 53–87 % of graphic shots (S83 57 %, S86 53 %, S94 87 %) |
| paper-quote | #FDF4EC → corner #D3CCC6 | S110 grid paper | 47 % (S110) |
| desk-paper | #EFE3DA (HR still #ECDDD3) → #D4C8BE | desk surface S109 | 52–59 % |
| photo-border | #F5EFEB | print border (cooler and lighter than the desk) | — |
| card-border-cream | #EFE7D2 | S84 photo borders on black | 12 % |
| highlighter-yellow | #F2E700 (product box), #EDE301 ($ box), #F0E511 (end card) | text boxes | 2–8 % |
| tape-yellow | #F9EC00 (249,236,0) | opaque tape, stamp tape | ≈2 % |
| caption-yellow | #D8DF2E text / #DBD101 ▶ | captions over footage (slightly greener) | <1 % |
| neon-yellow | core #ECF103, halo to ≈#4E5400 | “SUV” / “2002” glow on black | 0.5–3 % |
| ink-brown | #482F1D | title text in yellow boxes | — |
| ink-plum | #4A2F39 (subtitle), #634B53 (quote), #745057 (attribution) | body text on paper | — |
| ink-charcoal | #33332F / #2D2F2A | chart bars, cut-out shadows | 4–10 % |
| maroon | #7F1322 | hand-drawn ring and value labels (chart) | 0.2 % |
| night-black | #050402 / #040403 | S84/S85 backgrounds | 57–77 % |
| lifted-black | #181812 … #1A1510 | darkest pixels in graphic shots (S108/S110 p0.5 ≈ 22) | — |

**Grade.**
- **Blacks.** Graphics are lifted (p0.5 luma 7–22, darkest ≈#181812). Footage is crushed (p0.5 = 0).
- **Whites.** Paper peaks at ≈#FDF8F0 (luma 242–247). No pure white appears in graphics, while footage whites reach 245–250.
- **Warmth.** R−B mean is +15…+40 on graphics (S108 is warmest at +40) and +4…+28 on footage. S98 and S101 are neutral (+0.7, +7).
- **Photos inside graphics** keep their own colour, slightly desaturated and warm. Archive portraits are B/W (Ferry). The S90 factory photo has a green tint. S103–S105 Taycan footage is almost monochrome (chroma 7–9).
- **RGB split** (measured on line and glyph centroids):

| Where | Red shift | Blue shift |
|---|---|---|
| S110, f5800 crop-mark lines (TR and BL agree) | (+1.3, +1.1) px@720 = (+2.0, +1.7)@1080p | (−1.0, −1.1) px@720 = (−1.5, −1.7)@1080p |
| S109, glyph stems in f5600 | +2.3…+2.6 px@720 in x | −2.0…−2.3 px@720 in x |
| HR still a97d70, speckle dots | (+2.4, +3.0) px@1400 = (+3.3, +4.1)@1080p | (−2.3, −2.9) px@1400 = (−3.2, −4.0)@1080p |

  The split is uniform across the frame and constant over time (f5795–5820: R−G = +1.33…1.48). It makes shadows look blue-grey and bright edges show a yellow/red rim, e.g. the f5600 right edge: `(253,239,160)` then `(193,116,129)` then `(156,171,186)`.
- **Flash frames.** In this range there is only a 1-frame wash before a cut (f4743, luma +20) and the brighten into the S108→S109 cut. There are no full white flashes.

## 4. Typography
| Style / role | Case | Cap height @720 → @1080p | Weight / class | Colour + treatment | Effect | Closest commercial ≈ / free ≈ |
|---|---|---|---|---|---|---|
| Product title (“Porsche Panamera”) | Title | 46 → **69 px** | semibold transitional serif, ball terminals, medium contrast | #482F1D on #F2E700 box 570×92 → **855×138**; padding L ≈50, R ≈32, T/B ≈34 @1080p (≈0.5 × cap) | box wipe L→R reveals the text (§7 M1) | Tiempos Headline Medium / **Source Serif 4 Semibold** (alt. Libre Caslon Text Bold) |
| Product subtitle (“The price at launch is $89,800”) | sentence | 22 → **33 px** | regular, same family | #4A2F39, no box; cap top sits 54 px@1080p below the box | L→R reveal ≈36 px/f@1080p, starts ≈5 f after the title | Tiempos Text / Source Serif 4 Regular |
| Video caption | sentence | 25 → **37 px** | **bold italic** serif, calligraphic f | yellow #D8DF2E on dark footage or #452F29 on bright footage; ▶ 40×44 → 60×66 px in the opposite tone | dissolve 7–14 f on ones | Tiempos Text Bold Italic / **Lora Bold Italic** (alt. Source Serif 4 Bold Italic) |
| Quote (S110, also still e15e05) | sentence, straight quotes `"…"` | ≈24 → ≈36 px; leading 45 → 67 px | semibold italic serif | #634B53 straight on grid paper | typewriter ≈41 ch/s | as caption |
| Attribution (“-Ferdinand Anton Ernst Porsche”) | Title, hyphen prefix | ≈13 → ≈20 px | semibold roman | #745057; right edge aligned to the quote block (x 1056@1080p) | typewriter ≈43 ch/s | Source Serif 4 Semibold |
| Big figure (“$43 000 000 000”) | numerals with **space** thousands separators | ≈55 → ≈82 px | semibold serif | grey and slightly defocused on the photo; crisp near-black inside the #EDE301 box 685×109 → 1028×164 | rises with a camera tilt; highlight wipe sharpens it | Source Serif 4 Semibold |
| Year on photo (“2023”) | numerals | ≈40 → ≈60 px | semibold serif | warm dark grey, soft blur | rises from behind the car layer (masked) | same |
| Neon year (“2002”) / neon label (“SUV”) | numerals / caps | 57 → **85 px** / ≈25 → 75 px box h 150 | bold serif | #ECF103 core with ≈45 px@1080p halo; “SUV” dark on a glowing yellow box | glow arrives with the wipe | Source Serif 4 Bold + glow |
| Desk label slips (“911”, “356”, “Boxster”…) | numerals / Title | “911” ≈60 → 90 px; “Boxster” 30 px@1400 → 41 px | high-contrast **Didone**, ball terminal on 9 | near-black / plum on #E5E0DC slip, RGB-split fringes | static (camera moves) | Didot / **Playfair Display** (alt. Bodoni Moda) |
| Chart title / source / axes | Title / lower | title ≈10–12 → 30–36 px; source and axes ≈ 15–20 px | semibold / regular serif | #33332F; source in grey; value labels maroon #7F1322 | static | Source Serif 4 |
| CRT words | Title | “Legacy” ≈15 px@640 → ≈45 px | semibold serif | the list at ≈15–20 % opacity; the target crisp inside a 1 px black rectangle | slot-reel scroll | Source Serif 4 Semibold |
| End card (still only) “Thanks for watching” | sentence | 38 px@1400 → **52 px** | bold serif with double-storey g | dark olive-brown on #F0E511 box 577×81@1400 → 791×111, soft all-round shadow | — | Merriweather Bold ≈ / Tiempos Headline Bold |
| Period newspaper (“Years Ahead in Engineering”) | Title | — | condensed display serif (scanned ad art) | B/W print | — | use the scan, do not typeset |

## 5. Layout & composition
- **Product card.** Everything is centred on the vertical axis. The yellow box spans 16.7–29 % H, its width hugs the title, and it is centred, so the wipe starts at a left edge that varies (x 350–384 @720). The subtitle sits at 34–37 % H. The car fills 54–59 % W and its wheel contact line is at 86–91 % H, leaving 9–14 % bottom margin. The top 15 % of the frame is empty paper.
- **Caption.** ▶ at x = 11 % W (213 px@1080p). The text starts at 16 % W. Baseline at 90.5 % H (977 px@1080p). There is never a background box.
- **Chart (S83).** Plot spans 25–77 % W and baseline at 73 % H. The top gridline sits at 42 % H. Bars are ≈75 px wide on a 127 px pitch @1080p. The ellipse covers bars 1–4: centre (966, 726), radii 495×273 px@1080p.
- **Quote card (S110).** Text block left edge at 19.5 % W, top at 30 % H, width 36 % W. The figure occupies 59–84 % W and bleeds off the bottom edge. Crop marks: TR horizontal y = 102, x 1343–1830; TR vertical x = 1737, y 53–540; BL vertical x = 185, y 540–1032; BL horizontal y = 977, x 90–578 (@1080p). Each line overshoots its corner by ≈10 %. Grid pitch 23 px@720 (≈35 px@1080p).
- **Slideshow and video cards.** Centred, 55–91 % W. Footage cards are 91 % W × 83 % H with ≈4–8 % margins of paper.
- **Desk (S109).** The virtual desk is ≈3.2 × 1.7 frame widths. Clusters are 2 photos + 1 label slip (+ tape). Photo width ≈ 20–28 % W. Rotations: photos −12°…+12°, slips ±5–8°, pen/pencil ±20–40°. Objects bleed off every edge of the frame. Overlap order is desk < props < newspaper < photos < slips < tape. The frame corners look slightly soft (≈ lens/tilt-shift blur).
- **Depth.** Mostly 2.5D. Depth is suggested by drop shadows and by rack-focus via highlight: in S107 the “$43…” text is soft grey outside the yellow box and crisp black inside it.

## 6. Textures & materials
| Material | Measurement (source → @1080p) | Procedural recipe |
|---|---|---|
| Paper base | #F9EFE6 centre; hp(σ2) std 1.2–2.5/255 on video graphics (2.8/255 on HR still) | flat colour + 2-octave value noise ±1.5 % |
| Speckle (HR a97d70) | ≈56 dark flecks per 100×100 px@1400 (≈30 per 100×100 @1080p); 1–3 px mostly, up to 7 px, rare 40 px blobs; ΔL −8…−20; warm grey #E0D1C5 | Poisson-scatter dots r 0.5–2 px at 30–60 % opacity; larger flecks are visibly RGB-split |
| Grid paper | S110 pitch 23 px@720 → 35 px; lines ≈ −10…−15 L (≈); product-card grid barely visible | repeating-linear-gradient 1 px lines rgba(90,80,70,.10–.14) |
| Vignette | corner/centre luminance 0.83 on graphics, 0.88–0.95 on desk; falloff starts at r≈0.4 | multiply by **1 − 0.18·r²** (r = distance / half-diagonal) |
| Film grain | monochrome, channel-aligned; regenerated per drawn step (corr 1.0 inside a hold, 0.45–0.79 between steps); 6 fps in S110 holds | pre-render ≈12 noise tiles; pick by posterized step; overlay at ≈8–12 % |
| Hold jitter | S110: whole frame shifts ±0.35 px@640 (≈±1.1 px@1080p) every 5 f | translate the comp by `random(seed=floor(frame/5))·1.1` px |
| RGB split | see §3; uniform; applied **before** grain | R +(2,2), B −(2,2) px@1080p on paper scenes; up to ±(3.5,4) on the desk |
| Desk photo border | ≈14 px@720 (14–15 px@1400) → **≈21 px** = 4.7 % of photo width; #F5EFEB; equal on all 4 sides | padding 4.7 % w |
| S84 card border | L 11, T 12, B 27 px@720 → 17 / 18 / **41 px** (bottom ≈2.3× side); #EFE7D2 | polaroid-like padding |
| Drop shadow (desk) | down-right only; Gaussian fit offset ≈3–5 px@720, σ ≈6–8 px@720, darkening ≈0.5 at contact; looks blue only because of the split | `drop-shadow(6px 8px 20px rgba(40,28,20,.5))` @1080p |
| Yellow offset edge (cards) | right 5–6 px, bottom 8–9 px@720 → **(+9, +12) px**, hard, ≈2 px soft; corner radius ≈12–16 px@720 → 18–24 px | duplicate the card silhouette in #F2E600 behind it, offset (9, 12) |
| Tape (desk) | opaque #F9EC00, 124×42 px@720 → **186×63** (42 % of photo width, 3:1); long edges straight; short ends straight or **torn zig-zag** (fe0e81); faint own shadow | flat rect with optional zig-zag clip-path; not translucent |
| Slip tape | 50×30 px@720 → 75×45 | same |
| Stamp/label slip | ≈195×125 px@720 → 290×190; scalloped sides, pitch 15.2 px@720 (16.1 px@1400) → **≈22–23 px**, depth ≈5 px@720 → 7 px; bottom/right shadow; slip #E5E0DC | SVG path with semicircle bites r ≈ 7 px@1080p |
| Sticky note | 110×137 px@720 → 165×205; flat yellow | rect |
| CRT screen | barrel rounded rect, inner shadow, dark bezel #1A1510; whole screen tinted warm | SVG mask + inner shadow + mild `feDisplacementMap` barrel |
| Glow / bloom | “2002”: core 236,241,3, halo halves every ≈8 px, visible over ≈30 px@720 → 45 px | stacked `drop-shadow(0 0 8px)` + `drop-shadow(0 0 30px)` in yellow |
| Dry-brush stroke | bristle edges, height 52→72 px@640 (156→216 px@1080p), length 271→442 px@640 | brush PNG mask revealed by a wipe |
| Handwriting overlay (S84) | light-grey cursive at ≈10–20 % over the dark bg and photo skies | script-font text or scan, `screen` blend |
| Footage noise | footage hp std 11–23 (sharpened, noisy) vs 1–2.5 on graphics | leave footage as-is; maybe sharpen and crush |

## 7. Motion language
| ID | Motion | Duration | Velocity profile → cubic-bezier ≈ | Stepping | Evidence |
|---|---|---|---|---|---|
| M1 | **Highlight-box wipe** (product title) | 32 f / 1.07 s; starts 10 f after the cut | Right edge @640 per step: 199, 207, 218, 233, 255, 324, 390, 410, 423, 424, 433, 440, 444, 445. The box starts as an 8 px@640 (**24 px@1080p**) bar, crawls for 10 f, covers 50 % of its width in the next 5 f, then has a long tail. **(0.75, 0.4, 0.05, 0.9)**, rms 0.015. Identical numbers in S86, S94, S96 and S102 (same precomp). | 12 fps | f4266–4298, f4571–4600, f4699–4725, f5009–5040 |
| M1b | Highlight wipe (“$43 000 000 000”) | 20 f / 0.67 s | Right edge 160, 175, 209, 274, 368, 433, 468, 486, 493 → **(0.7, 0.3, 0.2, 0.8)** | 12 fps | f5326–5346 |
| M1c | Box wipe with glow (“SUV”) | 17 f | 256→375 @640, ease-out-heavy; glow grows with the box | 12 fps | f4164–4181 |
| M2 | Subtitle reveal | ≈15 f | ≈linear ≈36 px/f@1080p | 12 fps | f4576–4591 |
| M3 | **Car cut-out entrance** | 7–9 f after the cut | The first frame is already ≈70 % through the move: offset +25…+41 px@640 (+75…+123 @1080p), e.g. +41, +12, +3, +1, 0. Exponential ease-out **(0.16, 1, 0.3, 1)**; motion-blurred first step. Taycan variant: scale 0.79→0.93→0.99→1.0. | 12 fps | f4256–4264, f4564–4571, f4689–4696, f4999–5008 |
| M4 | **Staggered bar growth** | 13–22 f per bar, ≈4.7 f stagger (2 drawings) | Bar 8: 7, 26, 49, 69, 83, 93, 99, 103, 105, 106 px@360 → ease-out cubic **(0.33, 1, 0.68, 1)**; no overshoot | 12 fps | f3941–3996 |
| M5 | **Hand-drawn ring draw-on** | 16 f / 0.53 s | Angular coverage 20, 50, 100, 130, 170, 220, 230, 320, 350, 360° → ≈linear ≈22°/f with a 5 f ease-out tail; open, tapered ends | 12 fps | f4003–4019 |
| M6 | **Card scale “breathing”** | in 6–12 f, out 4–7 f | In: ease-out (e.g. 0.915, 0.97, 0.99, 1.0). Out: ease-in (1.0, 0.99, 0.97, 0.92). Amplitude 8–21 %, sign alternates by card. | 12 fps (S87–90), ones (S91) | f4356–4485 (bbox table in §8 T4) |
| M7 | **Caption** | ▶ at the cut or rise 10 f + spin 10 f; text 7–14 f | S97 opacity per frame: .03 .15 .28 .40 .53 .67 .74 .80 .86 .88 .97 1 → ease-out-quad **(0.5, 1, 0.89, 1)**. ▲ rise centre y 1074→966 px@1080p, ease-in-out. Fade-out 7 f, ending on the cut. | **ones** | f4632–4660, f4761–4780, f5105–5167, f5175–5184 |
| M8 | **Typewriter** | quote 61 ch / 45 f (≈41 ch/s); attribution 30 ch / 21 f (≈43 ch/s) | linear; the newest glyph is ≈50 % opaque for 1 step | 12 fps | f5727–5772, f5774–5795 |
| M9 | **Cut-out slide-in** (Ferry) | 35 f / 1.17 s | Left edge @640: 631, 618, 600, 575, 542, 505, 472, 445, 425, 412, 401, 395, 389, 386, 384 (741 px@1080p) → **(0.45, 0.35, 0.3, 0.95)** | 12 fps | f5727–5762 |
| M10 | **Silhouette echo** | starts 15 f after the figure, lags 3–5 f, settles 20 f | Offset to the figure 37, 25, 17, 11, 7, 1, 0 px@640 → ease-out cubic; ends hidden behind the figure with a 1–2 px rim | 12 fps | f5742–5762 |
| M11 | **Whip-pan** (photo wall) | 53 f / 1.77 s, 3331 px@1080p | Per-step px@1080p: 41, 83, 189, 78, 227, 228, 359, 341, 314, 286, 223, 210, 181, 152, 134, 111, 83, 56, 29, 6 → **(0.45, 0, 0.4, 0.95)**; peak ≈4300 px/s; directional motion blur ≈ the step length | 12 fps | f4036–4089 |
| M12 | **Desk flyover** | 175 f / 5.8 s | Push ×1.32 in 12 f (per step 1.031, 1.062, 1.069, 1.068, 1.060, 1.028). Cruise 90–128 px/step ≈1080–1540 px/s@1080p. Roll swings 0 → −11.4° (f5592) → +8.2° (f5660) → −17.1° (f5714); direction changes blend over 2–3 steps. Pull ×0.86 in 12 f. | strict 12 fps | f5545–5720 |
| M13 | Push-in on still | 10 f | Per-frame zoom 1.028, 1.022, 1.016, 1.012, 1.010, 1.002, … → expo ease-out, ×1.09 | **ones** | f5221–5231 |
| M14 | Vertical tilt (reveal next line) | 32 f | −324 px@1080p, peak −64 px/step at f5311, ease-in-out ≈(0.6, 0, 0.4, 1) | 12 fps | f5304–5336 |
| M15 | **Masked rise** (“2023” from behind the cars) | 8 f | ty +17, +25, +42, +16 px@1080p | 12 fps | f5246–5256 |
| M16 | **Slot-reel words** | ≈20 f | ≈1 word per 2.5–5 f, pitch ≈54 px@1080p, decelerating stop on the target | 12 fps | f5423–5443 |
| M17 | **Dry-brush wipe** | 28 f / 0.93 s | Width 51, 56, 69, 95, 144, 201, 233, 253, 263, 266, 271 px@640 → ≈(0.5, 0, 0.1, 1) | 12 fps | f5428–5456 |
| M18 | Content punch-in | 1 step, then slow push | ×1.21 in one step (f5458), then ×1.41 by f5508 and ×1.63 by f5544 (accelerating) | 12 fps → ones | S108 |
| M19 | Overshoot pop (triptych centre card) | ≈15 f | small → 1.2× → 1.0 (w 238→225→208→198 px@640) | 12 fps | f4199–4214 |
| M20 | Side cards slide out from behind | 7 f | left card edge 155→63→27→19 px@640, ease-out | 12 fps | f4214–4221 |
| M21 | Exposure settle at footage heads | 6–10 f | luma +16…+26 (S95, S97) or −20 (S91), ease-out | ones | f4625–4632, f4744–4750, f4474–4484 |
| M22 | Hold boil | whole holds | ±1.1 px@1080p jitter + grain re-roll every 5 f | 6 fps | f5795–5826 |

**Cadence verification per shot.** “Held” is the share of frames with `mad_lo` < 0.6. “Intervals” is the gap mix between changes with `mad_lo` ≥ 1, as interval×count. The tool's “1 = twos” label does not distinguish 15 fps from 12 fps. The 2/3 mix shows 12 fps.
| Shots | Auto label | Held | Intervals | Verified cadence |
|---|---|---|---|---|
| 83 (chart) | 1 | 73 % | 5×3, 2×2, 3×2 | 12 fps animation; the 5-f changes during holds are the 6 fps boil (f3998, 4003, 4008) |
| 84 (whip-pan) | 1 | 47 % | 2×31, 1×15, 3×3 | big steps at f4044, 46, 49, 51, 54, 56… (perfect 2/3 = 12 fps), plus small changes every 5 f (f4043, 48, 53, 58, 68, 73, 78) = **6 fps boil** |
| 85, 87–90 | 1 | 59–68 % | 2×9, 3×8 … | 12 fps |
| 86, 94, 96, 102 (product cards) | 1 | 76–83 % | long holds of 14–50 f | 12 fps animation, then still |
| 91 | 0 | 6 % | 1×24 | on ones (video card pop) |
| 92–93 | 1 | 25–52 % | 1×9, 2×7 … | footage inside a card; source has duplicated frames |
| 95, 97–101, 103–106 (footage) | 0–1 | 5–37 % | 1×26…54 | on ones; 5–37 % duplicates come from source-rate conversion (≈ a 24→30 pulldown gives 20 %) |
| 107 | 1 | 48 % | 2×34, 1×21, 3×12 | ones for the push-in/zoom-through, 12 fps for the tilt, rise and highlight |
| 108 | 1 | 84 % | 1×7, 3×2 | 12 fps; the final zoom-through is on ones |
| 109 (desk) | 1 | 61 % | **2×34, 3×33** | strict 12 fps |
| 110 (quote) | 2 | 60 % | 1×48, 3×7, 2×6 | 12 fps slide/type; 6 fps hold boil; the 1-f intervals are the fade on ones |

Holds between beats: product cards hold 0.5–1.9 s after the title completes (S86 58 f, S94 25 f, S102 21 f). Captions stay 1.5–2.5 s. The final quote holds 32 f before the fade. Overshoot is rare: only M19 shows a visible bounce. Everything else is ease-out or ease-in-out without overshoot.

## 8. Transitions
| ID | Type | Frame-by-frame | Length | Build |
|---|---|---|---|---|
| T1 | **Hard cut** | All 28 shot boundaries in range are hard cuts at the frame level; there are no dissolves. T2–T9 are motion wrapped *around* a hard cut. The tool's soft-transition flags in range are explained by motion, not dissolves: f4474–4477 = S91 on-ones scale-in + exposure settle; f4743–4745 = T2; f5219–5221 = hard cut into S107's defocused push-in; f5827–5869 = T10. | 0 f | `<Series>` |
| T2 | **Flash-shrink cut → exposure ramp** | f4741: card zoom 0.992. f4743: zoom 0.975 and the paper washes out (luma 205→225). f4744: cut to footage at luma 80, rising to 88, 94, 98, 101, 103, 105 by f4750. Same pattern at f4624/4625 and f5059/5061. | 3 f out + 6–8 f in | last 2–3 frames: `scale(.98)` + `brightness(1.1)`; footage head: `brightness` 0.75→1 easeOut over 7 f |
| T3 | **Zoom-through** | S107→S108: f5391–5398 zoom/frame 1.0006, 1.0010, 1.0025, 1.0037, 1.0084, 1.0133, 1.0179, 1.0232 (accelerating), then a cut to the CRT at rest (f5399). S108→S109: f5536–5544 zoom/frame 1.001…1.028 plus brighten 164→182, cut f5545, then S109 decelerates (1.031→1.069→1.028 per step). | ≈8 f + ≈12 f | expo ease-in scale on the outgoing comp, expo ease-out on the incoming one; total ≈×1.1 out and ×1.3 in |
| T4 | **Scale-momentum cut chain** | Card width @640 (scale relative to settled size in brackets). S87 out: 481→471→448 (shrink). S88 in: 409→372→356→351 (1.165→1.0, shrinking). S88 out: 365→387→424 (grow). S89 in: 308→339→351→356 (0.865→1.0, growing). S89 out shrinks (352→337). S90 in: 634→582→563→556 (shrinking). S90 out grows (563→580). S91 in: 491→581 (growing). | 30 f per card | before each cut, animate scale with the sign of the next card's entrance; carry the per-step rate ≈4–8 % across the cut |
| T5 | **In-card cut** | Card frame and yellow edge persist while the footage inside cuts (f4507, f4531) | 0 f | keep the card component outside `<Series>`; switch the video source inside |
| T6 | **Persistent caption** | Caption stays on screen across the cut S105→S106 (f5202); in S104 it fades out over 7 f exactly to the cut | — | caption track above footage |
| T7 | **Slide-out mid-move cut** | S93 card centre x 320, 318, 315.5, 311.5, 304.5, 294.5 @640 (accelerating, + slight drop), then cut at f4564 | 6 f | ease-in translateX −5 % W |
| T8 | **Motion-matched whip** | S83 drifts left −23 then −72 px@1080p (f4031, f4034); the cut lands in S84's leftward whip | 4 f | same-direction velocity across the cut |
| T9 | **Pull-back to dark** | S84 zoom/step 0.991, 0.981, 0.961 (f4141–4148), then a cut to near-black S85 | 8 f | ease-in scale-down, then cut |
| T10 | **Fade to black (end)** | luma 205.4 → 1.45 over f5827–5874, a constant −4.35 L/frame (linear in display space); f5875–5898 pure black | 48 f + 24 f | black solid opacity `interpolate(f,[0,48],[0,1])`; then 24 f of black |

## 9. Reusable components
| Component | Props (defaults @1080p, 30 fps) |
|---|---|
| `ProductCard` | `title`, `subtitle`, `carSrc` (alpha PNG), `enter='slideRight'|'scale'`, `carOffset=110`, `carSettle=8f`, `titleDelay=10f`, `wipeDur=32f`, `subtitleDelay=5f` after the title, `subtitleSpeed=36px/f`, `carWidth=0.57W`, `wheelLine=0.89H`, `boxTop=0.167H`, `exit='flashShrink'` |
| `HighlightBox` | `text`, `bg=#F2E600`, `ink=#482F1D`, `cap=69`, `pad=[34,32,34,50]`, `minWidth=24`, `dur=32f`, `ease=[.75,.4,.05,.9]`, `revealsText=true`, `glow=false`, `sharpenInside=false` (S107 mode: crisp text inside, soft grey outside) |
| `VideoCaption` | `text`, `tone='auto'` (bright bg → yellow ▶ + #452F29 text; dark bg → dark ▶ + #D8DF2E text), `x=213`, `baseline=977`, `cap=37`, `triangle=60×66`, `triangleIn='cut'|'riseSpin'` (rise 108 px/10 f, spin 270° CCW/10 f), `fadeIn=10f easeOutQuad`, `fadeOut=7f`, `persistAcrossCuts=true` |
| `BarChart` | `data`, `barW=75`, `pitch=127`, `barColor=#33332F`, `gridColor=#EDE95A` (3 lines, ≈5 px), `labelColor=#7F1322`, `stagger=5f`, `growDur=13–22f`, `ease=[.33,1,.68,1]` |
| `HandDrawnRing` | `cx,cy,rx,ry`, `color=#7F1322` (or #F2E600), `stroke≈7px` tapered, `drawDur=16f`, `startAngle≈90°` (bottom), `overshoot≈10°` open end |
| `PhotoCard` | `src`, `radius=20`, `yellowEdge={dx:9,dy:12,color:#F2E600}`, `scaleIn={from:.85–1.17,dur:8–12f}`, `scaleOut={to,dur:4–7f}`, `video?` |
| `TapedPhoto` | `src`, `border=0.047w` (≈21 px), `borderColor=#F5EFEB`, `rotate=±3…12°`, `tape={w:.42, aspect:3, color:#F9EC00, opacity:1, ends:'straight'|'torn'}`, `shadow={dx:6,dy:8,blur:20,opacity:.5}` |
| `StampLabel` | `text`, `font='Playfair Display'`, `size=[290,190]`, `scallop={pitch:22,r:7,sides:['left','right']}`, `paper=#E5E0DC`, `tape={w:75,h:45}`, `rotate=±7°` |
| `DeskScene` | `items[]` on a 3.2×1.7-frame canvas, `cameraPath` keyframes `{x,y,zoom,roll}`, `fps=12`, `pushIn=1.32`, `pullOut=.86` |
| `QuoteCard` | `quote`, `attribution`, `figureSrc` (B/W alpha), `figureEnter={from:+741,dur:35f,ease:[.45,.35,.3,.95]}`, `echo={color:#F2E600,lag:4f,startDelay:15f,settleRim:1.5px}`, `typeCps=41`, `grid=35`, `cropMarks=['tr','bl']` |
| `CropMarks` | `len≈488`, `stroke=3`, `color≈#76716B`, `overshoot=.1` |
| `NeonLabel` | `text`, `color=#ECF103`, `halo=[8,30]px`, `onBlack=#050402` |
| `CRTWordReel` | `words[]`, `target`, `pitch=54`, `reelDur≈20f`, `boxStroke=2`, `brush={src,dur:28f}`, `punch=1.21` |
| `WhipPan` | `distance=3331`, `dur=53f`, `ease=[.45,0,.4,.95]`, `motionBlur=true` |
| `FilmFinish` (root) | `rgbSplit={r:[2,2],b:[-2,-2]}` (desk `±3.5`), `grain={opacity:.1,fps:12,holdFps:6}`, `vignette=.18`, `jitter={px:1.1,fps:6}`, `blackLift=#181812` |
| `FadeToBlack` | `dur=48f`, `tail=24f`, `curve='linear'` |

## 10. Build notes for code (Remotion/React)
1. **Time base.** Render at 1920×1080, 30 fps. Graphics use a posterized frame:

   ```ts
   const step = Math.floor(frame * 12 / 30);
   const t = Math.round(step * 2.5);
   ```

   Feed `t` to every `interpolate`. This reproduces the 2/3 alternation exactly. Footage (`<OffthreadVideo>`), caption fades, M13/M18/T3 zooms and the final fade use the raw `frame`.
2. **Layer stack (back→front).** paper (base + speckle + grid) → camera group (translate/scale/rotate from posterized keyframes) → objects (photos, cut-outs, slips, tape) with drop-shadows → text/boxes → caption track (outside `<Series>` so it can cross cuts) → **RGB-split filter on the whole stack** → grain overlay → vignette multiply → black lift. Grain must sit **after** the split (measured channel-aligned).
3. **RGB split.** Use an SVG filter on the root: three `feColorMatrix` channel isolations, `feOffset` R (+2, +2) and B (−2, −2), then two `feBlend mode="screen"` steps. A WebGL post pass also works. Keep the offsets constant; do not make them radial.
4. **Wipes.** Use `clip-path: inset(0 calc(100% - ${w}px) 0 0)` with `w = max(24, ease(p)·fullW)`. Put box and text in the same clipped element so the text “types” with the box. For S107-style highlights, render the text twice (blurred grey below; crisp ink clipped to the box).
5. **Echo and offset edges.** A copy of the alpha silhouette with `filter: brightness(0) … sepia/hue` → #F2E600, or an SVG `feFlood` + `feComposite in2=SourceAlpha`, placed behind with a lagged position (`t-4`).
6. **Motion blur** on M11 and M3 first steps: `@remotion/motion-blur` `<CameraMotionBlur shutterAngle={180} samples={6}>`, or 4–6 ghost copies at decreasing opacity along the step vector.
7. **Paper.** A pre-rendered 4K paper PNG (speckle, grid) is cheaper than per-frame noise. Grain: 12 pre-rendered 1080p mono noise PNGs, chosen by `step % 12` (by `floor(frame/5)` during long holds), blended `overlay` at 8–12 %.
8. **Hard to replicate.** Car cut-outs need clean alpha PNGs with their contact shadow. The dry-brush stroke needs a scanned brush mask. CRT barrel distortion: `feDisplacementMap` with a radial map, or just a rounded-rect mask plus inner shadow. The whip-pan handwriting texture: a script-font text layer at 12 % opacity. Footage grading: crush blacks with `contrast(1.15)`, add warmth with `sepia(.1)`.
9. **Timing templates.** Store M1/M3/M7 curves as constants. The four product cards share exact frame offsets (title at +10 f, identical step widths), so they should be one component with different props.

## 11. Evidence index
| Path (under `analysis/`) | Note |
|---|---|
| `sheets/porsche/sheet_061…088.png` | all viewed; every shot state in range |
| `strips/porsche_03927-03974.png`, `_03975-04022` | chart settle, bar stagger, ring draw |
| `strips/porsche_04023-04060`, `_04061-04108`, `_04109-04156` | S83→S84 whip, photo-wall pan, pull-back |
| `strips/porsche_04149-04196`, `_04197-04244` | SUV neon wipe, triptych pop / slide-out, 2002 rise |
| `strips/porsche_04245-04292`, `_04293-04340` | Cayenne product card |
| `strips/porsche_04352-04399`, `_04400-04447`, `_04448-04495`, `_04496-04543` | slideshow scale chain, video card, in-card cuts (04400 measured numerically) |
| `strips/porsche_04564-04611`, `_04614-04637`, `_04625-04672` | Panamera card, card→footage cut, ▲ rise/spin caption |
| `strips/porsche_04689-04736` (numeric), `_04736-04759`, `_04744-04791` | Macan card, flash-shrink cut, caption fade |
| `strips/porsche_04999-05046`, `_05105-05152`, `_05168-05215` | Taycan scale-in card, caption fade in/out, caption across cut |
| `strips/porsche_05221-05268`, `_05290-05337`, `_05395-05442`, `_05443-05490`, `_05541-05588` | push-in, 2023 rise, tilt + $ highlight, CRT reel/brush, zoom-through into desk |
| `strips/porsche_05213-05230.png` | S106→S107 hard cut into a defocused push-in (resolves the tool's soft-transition flag) |
| `strips/porsche_05721-05768`, `_05769-05816` | Ferry slide, echo, typewriter, hold |
| `stills/C/porsche_f4030…f5800.png` (16 native grabs) | measurement sources (frame-aligned; verified mad <2 vs `frames/`) |
| `stills/C/crop_f5600_photo_corner_BR_x5.png`, `crop_f5600_tape_x4.png`, `crop_f5600_stamp911_x3.png` | border, shadow, split fringes, opaque tape, scallops |
| `stills/C/crop_f4600_titlebox_x2.png`, `crop_f4600_title_glyphs_x4.png`, `crop_f4660_caption_x2.png` | product typography, caption italic |
| `stills/C/crop_f4375_card_corner_BR_x4.png` | yellow offset edge + rounded corner |
| `stills/C/crop_a97d70_paper_speckle_x3.png`, `crop_fe0e81_torn_tape_x4.png`, `crop_fe0e81_boxster_slip_x2.png`, `crop_fe0e81_photo_corner_x4.png` | HR speckle with Y/M/C split triplets, torn tape, scallop pitch |
| `stills/C/crop_8e0bc0_thanks_box_x2.png`, `crop_8e0bc0_map_cropmark.png` | end-card box/shadow, map + crop marks |
| `metrics/porsche.csv` rows 3925–5898 | cadence strings, camera sums (§7 M11/M12, §8 T3), fade ramp |

## 12. Signature devices (recurring across range and stills)
1. Flat lemon highlight box (#F2E600) behind dark serif text, revealed by an L→R wipe that starts as a 24 px “cursor bar” (8 product cards, $43bn, SUV, Ferry label, 1900, STUTTGART, end card).
2. Hard yellow offset shadow or echo: card edges (+9, +12 px@1080p), the cut-out silhouette that slides in late and tucks behind (S110, e15e05), neon outlines on black.
3. Uniform diagonal RGB split plus monochrome grain applied afterwards, so the grain carries no colour fringes.
4. 12 fps posterized graphics over 30 fps footage; text dissolves on ones.
5. Product-card template: “Porsche X” in a yellow box, “The price at launch is $Y”, centred side-view cut-out on cream paper (stills 8a3671, 973cca, ad46df + S86/94/96/102).
6. Caption device: ▶ plus bold italic serif, lower-left, no box, tone inverted by background, persists across cuts (stills 66b202 “style”, ac863b “passion”).
7. Cuts hidden in motion: zoom-throughs, scale momentum across slideshow cuts, cut-outs already mid-move on frame 1, flash-shrink exits.
8. Hand-drawn rings in maroon or yellow (chart, “1996” 0082b3, Ferry 73e01f).
9. Yellow multiply disc plus thin black leader line pointing at a detail (stills 6a5319, c9ea51).
10. Desk scrapbook kit: white-bordered prints, opaque straight/torn tape, scalloped stamp slips with Didone labels, pen, pencil, highlighter, paperclips, sticky notes, period newspaper ad.
11. Crop-mark crosshairs in opposite corners (S110, end card, About slide).
12. Paper systems: cream paper, grid paper, crumpled paper (45904d), dark maps (73e01f, f44487), colour maps (112153, b86a65), sepia map (8e0bc0).
13. Neon glow type on near-black (SUV, 2002, 1948).
14. 6 fps hold boil (±1 px jitter plus grain re-roll) so held frames never look frozen.
15. Rack-focus in at a shot head: the first frame is heavily defocused and sharp within ≈5 f while a push-in starts (S107 f5221–5226).
16. Scanned period artefacts as props (1950s Porsche newspaper ads, a 1995 article page, racing-results columns), always partly highlighted in yellow.

## 13. Stills catalogue
27 files, 27 unique MD5s. No duplicates: the closest perceptual pair, 8a3671 / 973cca (mean abs diff 11.5 on 64×36 thumbnails), are two different product cards. 2e3a2a and 66b202 share a byte size (98 220) but are different images. “Match” is the nearest video frame by thumbnail MAD (in-video matches score 1–3, non-matches ≥20). HR = 1400×788; all others are 600×338.
| File | Res | Match (frame / s / shot) | Content | Notable devices / measurements |
|---|---|---|---|---|
| a97d70…jpg | **HR** | f5553 / 185.1 / S109 | desk scrapbook, 356 cluster: red 356 Speedster + stewardess + airliner; grey 356 coupé + man in sombrero; “356” slip; pen, pencil, drafting sheet with paperclip, “Years Ahead in Engineering” newspaper | border 14–15 px@1400 (≈20 px@1080p); opaque tape #F8E900 fully covers the photo (no see-through); speckle ≈56/100² px; split R (+2.4, +3.0) / B (−2.3, −2.9) px@1400 |
| fe0e81…jpg | **HR** | f5629 / 187.6 / S109 | desk, Boxster cluster: 911 Targa trio at a villa, silver 718 Boxster, red + yellow Boxsters top-down, “Boxster” slip, highlighter | **torn zig-zag tape ends**; scallop pitch 16.1 px@1400 (22 px@1080p); slip #E5E0DC; split fringes magenta/cyan on glyphs |
| 8e0bc0…webp | **HR** | none (mad 20.7) — **not in video** | end card: “Thanks for watching” in a yellow box over a sepia map of Europe with dot grid, crop marks TR/BL, folded 1950s Porsche newspaper ad (“Miles Ahead on the Road”, cyan PORSCHE bar) | box 577×81@1400 (791×111@1080p), #F0E511, soft all-round shadow ≈ 4–6 px offset, ≈ 0.35–0.4 opacity; cap 38 px@1400 |
| 0082b3 | 600 | f3686 / 122.9 / S78 | double exposure: Boxster body-in-white over factory; dark ink ring around glowing cream “1996” serif | yellow-green duotone wash patches, dark vignette |
| 112153 | 600 | f111 / 3.7 / S1 | colour political world map with ≈11 small traffic photos (cream border + shadow) | photo grid on map |
| 2e3a2a | 600 | f2314 / 77.1 / S54 | extreme close-up B/W newspaper racing results; “Porsche” highlighted in “Porsche Steals Sp…/In Marlboro Auto” | yellow box on scan, heavy grain, defocus |
| 34d184 | 600 | f3419 / 114.0 / S77 | newspaper page “FEB 16, 1995 / Porsche 944: The Best-Selling Porsche of the Late 1980s” + white 944 photo | multiple inline phrase highlights; yellow page-edge line |
| 45904d | 600 | f1741 / 58.0 / S41 | crumpled paper, dashed-line frame, “But the true *revolution* came in 1963” | roman + italic mix; year highlighted |
| 66b202 | 600 | f250 / 8.3 / S5 | dark bg; Cayenne footage in a rounded card; caption “▶ style” | single-word caption, bold italic, cream text |
| 6a2ce6 | 600 | f4186 / 139.5 / **S85** | black bg, ghost SUV line drawings, “SUV” glowing box | neon bloom, blueprint ghosts |
| 6a5319 | 600 | f2119 / 70.6 / S47 | grid paper, B/W engine cut-out with solid yellow disc behind; italic “powerful six-cylinder engine” in box + leader line | multiply-yellow spot fill |
| 73e01f | 600 | f1092 / 36.4 / S20 | dark map bg; B/W portrait card (Ferdinand & Ferry); double yellow ring round Ferry; “Ferry Porsche” box | hand-drawn ring, rounded card |
| 8a3671 | 600 | f1258 / 41.9 / S21 | product card “Porsche 356 / $3,750”, pale-blue coupé | template |
| 938eb7 | 600 | f4023 / 134.1 / **S83** | sales bar chart with maroon ring | see M4/M5 |
| 973cca | 600 | f3749 / 125.0 / S79 | product card “Porsche Boxster / $40,000” | template |
| a04890 | 600 | f2434 / 81.1 / S61 | grid paper; 1970s TV cut-out with yellow glow outline playing B/W factory footage; outline doodles (squares, triangles, circles) in black and yellow | memphis-style doodles |
| a3878e | 600 | none (mad 20.0) — **not in video** | Behance “About the project” slide: credits Hanna Herasimova (MOTION LADY), AI voiceover; “Styleframes” box; orange 356 cut-out | crop marks, curly brace, drafting bg |
| ac863b | 600 | f185 / 6.2 / S1 | dark bg; 918 Spyder on bridge in a rounded card; “▶ passion” | split visible on card edges |
| ad46df | 600 | f2612 / 87.1 / S63 | product card “Porsche 914 / $3,500”, orange 914 | template |
| b86a65 | 600 | f452 / 15.1 / S7 | road map of Baden-Württemberg; “STUTTGART” bold serif caps in a yellow callout with pointer; glowing yellow city outline | callout notch |
| c4229b | 600 | f5465 / 182.2 / **S108** | CRT “Legacy” over dry-brush yellow | see M16/M17 |
| c48a54 | 600 | f1843 / 61.4 / S43 | B/W triptych: sharp centre photo of 3 men, dimmed side panels, thin yellow separator | panel dimming |
| c9ea51 | 600 | f2065 / 68.8 / S46 | 1960s colour factory photo; italic “rear-engine design” box + leader line to a yellow disc over a rear engine | callout system |
| e15e05 | 600 | f1198 / 39.9 / S21 | grid-paper quote “In the beginning I looked around…”, young Ferry cut-out with yellow offset silhouette | **opening bookend** of S110 |
| ed2be3 | 600 | f774 / 25.8 / S16–17 | washed sepia archive photo, “1900” in a big yellow box | year box |
| f3183a | 600 | f5816 / 193.9 / **S110** | final quote frame | echo fully tucked (≈1–2 px rim) |
| f44487 | 600 | f1027 / 34.2 / S20 | near-black map of Europe; white glowing serif “1948” above a timeline line with a glowing node | timeline marker |
