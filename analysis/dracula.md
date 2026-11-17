# Dark cut-out collage ("The History of Dracula") — `dracula` f0–1350 (+ `dracula_gif1/2`, 8 stills)

> Analyst: D. Sources reviewed: all 19 keyframe sheets of `dracula` + 4/5 sheets of `dracula_gif1/2`; 26 full-frame-rate strips (22 video, 4 GIF); 8 high-res stills (1400 px); `metrics/dracula*.csv` + `_shots.md`; `palettes/dracula*.json`, `palettes/stills.json`; 20 native 1080p grabs + ≈150 native frames decoded for sub-pixel analysis; crops in `analysis/stills/D/`. The video is 1920×1080, so source px = px@1080p. Stills are 1400 px wide (×1.371 → @1080p). GIFs are 800×600 at 10 fps. Video time is s / frames at 24 fps. ≈ = estimate.

## 1. Summary of the look

- **B&W world, one hue family.** Greyscale engravings and photos with baked grain sit on a scratched black-card plate (mean L 24–47/255, edges lighter). Cut-out whites stop at L≈200–216, blacks at L≈12–24. Colour is reserved for blood/crimson reds (#8a0315, #5b0d09, #64191a, #462528), drifting to orange (#b66d24) for the Halloween ending. Exceptions are a few full-colour "artefacts": Vlad's portrait, the gilt frame, film posters and the pumpkins.
- **Hard scissor edges, flat fake depth.** Edges go 10→90 % in 3–5 px, which includes H.264 softening. There is no stroke, feather or soft drop shadow anywhere. Depth comes from flat **offset echoes**: a crimson duplicate silhouette at (−32, −25) px, or a cream book-page disc at (+40, +35) px behind the moon. Flat **floor ellipses** stand in for contact shadows.
- **Everything is on twos.** All drawings, all camera moves and all 21 hard cuts land on even frame numbers (12 fps). The crumple transition runs on fours and the title boil on sixes.
- **Film weave is why the frame never holds.** It is a random whole-frame translation on ones (σ≈1.3 px, max ≈3 px), applied after compositing. The grain is a static texture that moves only with the weave. Luminance flicker is negligible (≤0.5 %).
- **Locked theatre camera.** Staging is centred and symmetrical, and the camera never pans. Props drop, rise or slide in with snappy exponential ease-outs (τ≈2–4 f, 90 % of travel in 5–10 f) and fall out with ease-in. The camera moves only during transitions: crash push-ins ×2.8, punch zooms and pull-backs.
- **Minimal puppetry.** Rigid cut-outs, single-limb pivots, a rubber-hose stretch arm and separate wing pieces. Heads never animate on their own.
- **Object-driven transitions.** Fade-through-black continuity, torn-paper burst, zoom-through match cut, fall-out/build-in, crumpled-paper unfold, radial zoom-blur crash, lightning double strike.

### 1a. Signature devices (ranked)
| # | Device | Evidence |
|---|---|---|
| 1 | Twos everywhere + post film weave on ones | lag-2 autocorr of mad_lo up to 0.96 (S14); weave σx 1.21–1.37 / σy 1.06–1.23 px (S1, S8, S22) |
| 2 | Flat offset echo silhouette (crimson or cream) | houses f60 `crop_houses_rededge_x2.png`; moon `crop_moon_f45_half.png`; torn paper S3 |
| 3 | Drop/rise-in props with expo ease-out onto a locked stage | houses f2–16, moon f14–28, carpet f437–448, XV f229–240, furniture f450–476 |
| 4 | Scratched black-card plate with lighter worn edges (inverted vignette) | corner L +18…+37 over centre (S1, S8, S22) |
| 5 | Selective red (blood moon, crimson roofs, cushions, damask carpet, ink splats, red fog) | palettes §3 |
| 6 | Theatrical tableau composition: centred hero, props on a floor line | S2, S7, S8, S14, S19 |
| 7 | Old-film damage loop (dust, hairs, vertical scratches; 24 f loop on twos) on the end card | f1114 ≡ f1138, f1116 ≡ f1140 |
| 8 | Lightning double strike: bolt cut-out, then 2 exposure+blur flashes 8 f apart | f942/946/954, f986/990/998, f1062/1066/1074 |
| 9 | Hand-kitbashed transitions (crumple-unfold on fours, zoom-through, zoom-blur) | f542–558, f290–311, f634–643 |
| 10 | Boiling hand-set title (random per-glyph jitter every 6 f) | f1114–1348 |

## 2. Shot log
Merged: S4–S6, S9–S10 and S12–S13 are transition fragments. S16, S18 and S20 are lightning-flash frames split out of the window scene. The automatic table's `cadence 0` (ones) is an artefact of the weave: the art is on twos (§7.1). Its cam/zoom sums are also confounded by element motion and fades. The real camera is static except where noted.

| Shot | t0–t1 (frames) | Content / composition | Layers (back→front) | Motion (what, how, how long) | In / out |
|---|---|---|---|---|---|
| S1 | 0.00–2.54 s (f0–61) | Prologue town. Victorian houses with crimson echo at bottom right; blood moon Ø≈440 px (41 % H) at top left; a giant Dracula (top hat) rises behind the roofs and puts his hands on them | black plate → moon (cream crescent echo) → giant → houses (+red echo) | Houses rise f2–16 (≈808 px, τ 4 f). Moon drops f14–30 (518 px, τ 3.7 f). Giant rises f18–30 (≈150 px). Arms rotate down onto the roofs f32–44. Hold f44–61 | in: bare plate f0–1 · out: T1 |
| S2 | 2.58–6.04 (f62–145) | Theatre stage. Dracula at centre (≈46 % H); moon prop Ø≈261 px on a string; grey curtains, spotlights, crimson seats, two boys from behind (foreground), tilted DRACULA posters left and right | stage plate → curtains/posters → man + moon → seats → audience heads | f62–71 darkening continuity (T1). Lights up f72–106 (L 1.6→48, on twos). Spotlights pop on at f108 (+15 L in 1 step). Moon prop eases +53 px right f74–84 | in T1 · out T2 |
| S3 | 6.08–12.04 (f146–289) | "XV century". Torn cream paper patch (red echo edge) on black plate; Bran castle at bottom right; gilt portrait of Vlad 569×828 px at left; "XV" + "century" | plate → paper patch → XV → castle (masks XV) → portrait | Paper burst f146–154. Castle rises f166–178 (≈12 f). Portrait drops f182–188, entering at +11° tilt, then a damped pendulum to f290. XV rises f229–240. "century" types on f234–250. Hold f250–289 (40 f) | in T2 · out T3 |
| S4–S6 | 12.08–12.96 (f290–311) | Zoom-through: punch into the paper → cream close-up → silver ornamental frame rises | — | Steps on twos; odd frames are true holds (no weave) | T3 |
| S7 | 13.00–18.12 (f312–435) | Open antique book (≈1290×870 px, centred) over a grey disc and brick fragments. Silver-framed Vlad engraving on the right page. Page turn reveals "1897" and full-figure Dracula on a floor ellipse. Quill hand writes red splatter | plate → grey disc/bricks → red splats → book → figure → hand + quill | Splat grows f316–330 (stepped). Page turn f343–351 (8 f). Hand slides in f352–360. Writing f360–420. Book falls out f426–435 (ease-in) | in T3 · out T4 |
| S8 | 18.17–22.54 (f436–541) | Parlour. Crimson damask carpet (top edge y≈820). Sofa (≈710 px wide) with red cushions, side table, square piano, tilt-top table. Dracula seated (≈770 px, 71 % H) holding a martini glass with a cherry. Two translucent ghost wisps | plate → carpet → furniture → Dracula → ghosts | Carpet slides in from right f437–448 (1765 px, τ 2.2 f). Sofa drops f450–456. Side table f454–458. Piano f456–466, lid flips f468–471. Table tips over f466–474. Dracula drops f484→486 (2 drawings). Glass raised f488–504, held, lowered f516–532 | in T4 · out T5 |
| S9–S10 | 22.58–23.04 (f542–553) | Crumpled paper ball grows and unfolds into the map | ball → map | On fours | T5 |
| S11 | 23.08–26.38 (f554–633) | Torn-edge antique map (dark vignette). Dracula half-figure slides in at right (f566–576). Bats (wingspan ≈450 px) fly up from bottom left. Push-pins and red route line | plate → map → route → pins → bats → Dracula | Bats f568–620 (stagger ≈8–12 f). Pin 1 pops at f594. Rubber arm stretches ≈700 px left f596–604, drawing the route. Loop + pin 2 at f612–616. Hold f620–633 | in T5 · out T6 |
| S12–S13 | 26.42–26.79 (f634–643) | Radial zoom-blur crash onto the route line, then 2-f dissolve | — | On twos | T6 |
| S14 | 26.83–36.38 (f644–873) | TV wall. Posters ("Dracula's Daughter" green, tilted DRACULA banner, red DRACULA one-sheet), 5 vintage TVs on a grey floor ellipse, red scribbles on the plate. TVs play B&W film; the centre TV goes to static, then shows a rotated head with claw hands | plate (+scribbles) → posters → TVs → ellipse → screen content | All elements locked for 7.3 s (local motion 0 px). TV static f812–821. Crash push-in ×2.79 f820–844. Head spins ≈2–3°/f with rotational blur. Push into the eye with growing defocus f856–871 | in T6 · out T7 |
| S15–S21 | 36.42–46.38 (f874–1113) | Window scene. Stone wall, 2 gothic windows with starfield, Dracula from behind, glass, candle, skull, jack-o'-lantern balloons, pumpkins, curtain, cobweb | plate/wall → windows/stars → bolt → Dracula → props → balloons → red fog | Pull-back ×0.80 f874–886. Fog clears f886–922. Bolts f942/986/1062, strikes 946+954 / 990+998 / 1066+1074. Balloons drift +35 px over 60 f; Dracula sways ≈10–17 px | in T7 · out hard cut |
| S22 | 46.42–56.25 (f1114–1350) | End card: "HAPPY / HALLOWEEN" in orange, centred on black plate | plate → title → dust/scratch loop | Glyph boil every 6 f; dust loop on twos; 9.9 s hold; no fade-out | in hard cut · out end |

## 3. Color
| Token | Hex (median; p10/p90) | Role | Where / share |
|---|---|---|---|
| plate-black | #2b2b2b–#2f2e2f (p5 #0e0e0e–#131213, p95 #5c5c5c) | background card | S8/S22. S1 plate is darker (mean L 24). Overall k-means: #131212 12 %, #252323 12 %, #373434 11 % |
| plate-edge | L +18…+37 at corners | worn lighter edges | radial median L centre→corner: S22 34→71, S8 58→72, S1 37→55 |
| ink-grey ramp | #4c4a49 / #63605f / #817e7c / #9f9c99 / #bfbdb8 | B&W cut-outs | ≈46 % of all pixels |
| paper-cream | #d0cabf (p95 #dfd7cd); global #e2dcd2 9 % | torn paper, book pages, crescent | S3, S5, S7 |
| crescent | #b8b6b1 | moon echo disc (printed text) | S1 |
| crimson-echo | #8a0315 (σ 6, flat) | offset silhouette | S1 houses |
| blood-moon | #5b0d09 (#390704 / #77130d) | hero accent | S1, S2 |
| seat-red | #710202 (p90 #b83831) | theatre seats | S2 |
| cushion-red | #64191a (#4a0e10 / #792629) | small accents | S8 (still: #5f0f10–#641011) |
| damask-wine | #462528 (#331416 / #663f43) | carpet | S8, 332k px ≈16 % of frame |
| cherry | #ac0e08 | brightest red | still 03c3e7 |
| ink-splat | #8f2a2a (p90 #b24d4c) | S7 splats | S7 |
| XV-red | #923f41 video / #901e27 still | display type | S3 |
| route/label-maroon | #581c1c (still), pins #623333 | map line, pins, labels | S11 |
| bat-rose | #794349 (#60292d / #976066) | bats | S11 |
| scribble-red | #883838 / #842c32 | hand-drawn red lines | S14, close-up still |
| fog-red | #5d1f1e (#491414 / #723a33) | full-frame smoke | S15 (sat 0.40, warmth +36) |
| gilt | #ae783e (p90 #e4aa4e) | portrait frame | S3 |
| title-orange | #b66d24 (#9b6127 / #be7c3b) | end title | S22 |
| pumpkin / balloon | #a26736 / #aa6437 | Halloween props | S15–21 |
| sticker-white | ≈#eeeeee–#f8f8f8 (L 233–248) | pin outline | S11 |
| date-ink on page | #3b3533 on #aca39d | "1897" | S7 |

**Grade**
- **Black level.** Lifted to ≈#0e0e0e–#161616 in the video (S22 p1 L 22). The design stills keep #000000 (35–43 % of some stills), so the video adds lift.
- **White level.** Cut-out p99 is #cccac3–#e4e0dc (L 195–216); pure white appears only in flash frames and the sticker outline.
- **Saturation.** Photos are fully desaturated (piano/table sat 0.000–0.006). Faces carry a light warm tint (R−B +10). Per-shot saturation is 0.045–0.185, except the red-fog shot at 0.40.
- **Cast.** Mild warm cast overall (R−B +3…+18 per shot).
- **Artefacts.** No chromatic aberration, duotone or halftone.
- **Palette hierarchy (overall k-means).** Neutral greys ≈91 %, reds ≈7 % (#4a2a29, #64151d), orange/brown ≈2 % (#98673a); orange reaches 8 % only on the end card (S22 #b06d2a).

## 4. Typography
| Style | Role | Case | Size @1080p | Weight / class | Tracking | Colour / bg | Effect | Commercial ≈ | Free ≈ |
|---|---|---|---|---|---|---|---|---|---|
| "XV" | century numeral (title) | caps | cap ≈235 px (22 % H); "XV" ≈495 px wide; thick strokes ≈46 px, thin ≈33 px (X crossing 76 px) | black bracketed slab serif with letterpress speckle | tight (≈0) | #923f41 printed on cream paper | Rises 249 px from behind a horizontal mask (castle line y≈729) in ≈11 f, τ 2.3 f, on twos | Clarendon Bold / Rockwell Extra Bold | Alfa Slab One |
| "century" | label under XV | lower | x-height ≈26 px; 44 px incl. ascender/descender; 210 px wide (≈30 px/char) | bold typewriter slab (mono look) | mono | dark red on paper | Type-on 7 chars at f234, 236, 240, 242, 244, 248, 250 (gaps 2–4 f, ≈9 cps, on twos) | ITC American Typewriter Bold | Courier Prime Bold / Special Elite. The still uses an italic script instead |
| "1897" | date on page | figures | ≈55 px incl. ascending 8 / descending 9 and 7; ≈135 px wide | old-style serif figures | normal | #3b3533 on #aca39d | 3 px rule ≈155 px long, ≈17 px below. Revealed by page turn (printed on page) | Adobe Caslon Pro | Libre Caslon Text / EB Garamond (onum) |
| "HAPPY / HALLOWEEN" | end title | caps | cap 224–229 px (21 % H); HALLOWEEN 1209 px wide, HAPPY 753 px; line pitch 257 px (1.12×); stroke 28–54 px | condensed spooky display, flared wedge serifs, jaunty glyphs | tight | #b66d24; spatial grain only σ 2.6 (sits above grain) | Hard cut in. Every 6 f each glyph gets a new random offset (σx 7.0, σy 4.6 px, max ≥12) + ≈±3–6° rotation; 40 states, none repeat | ≈ wedge-serif Halloween display | Mystery Quest / Jolly Lodger (≈) |
| "England", "Transilvania" | map labels (still 8cdb95 only; not in video) | title | ≈348×101 px | casual brush script | normal | #581c1c | — | ≈ brush script | Kaushan Script / Yellowtail (≈) |
| Posters, page text | found type | — | — | scans of 1930s one-sheets / 18th-c. book | — | as scanned | moves with its cut-out | — | use images |

## 5. Layout & composition
- **Framing.** Centred, symmetrical tableaux. The hero sits on the vertical centre line: S2 x≈960, S8 sofa centre ≈955, S22 title centred (x 356–1565, y 302–783). Floor lines are low: S8 carpet top at 76 % H, S14 ellipse at y≈930–1000, S1 roof band in the lower half.
- **Scale.** Hero figures span 46–71 % H (stage 46 %, seated 71 %). Portrait frame is 77 % H; moon Ø 41 % H (S1) or 24 % H (S2 prop). Book is ≈67 % W; bats span ≈23 % W.
- **Bleed.** Elements freely bleed off the edges: houses, carpet, curtains, Dracula at the S11 right edge. The title block keeps ≈18 % side margins and ≈28 % top margin.
- **Rotation (≈).** Most cut-outs are upright (0°). Accents tilt ±3–12° (S14 banner ≈+8°, top-left TV ≈−10°); S2 side posters ≈±15–25°. Falling props enter tilted ≈10–20° and land at 0° (portrait enters +11°). The fallen tilt-top table rests at ≈−70°.
- **Stacking.** 3–6 depth layers. Background props tuck behind foreground props (XV behind the castle, posters behind TVs). Foreground "audience" silhouettes appear in S2. There is no depth of field except during transitions (lightning blur σ 20–24 px, zoom blur, push-in defocus).

## 6. Textures & materials
| Material | Measurement | How to generate |
|---|---|---|
| Black card plate | Mean L 24 (S1) to 47 (S22). Static scratches (1–2 px white arcs) are part of the plate. The same plate is reused in S1 and S8 (r = 0.93) | Scanned scratched black paper at 4K; it moves only with the weave |
| Worn edges / vignette | Dark scenes: corners lifted +18…+37 L. Light map scene: normal dark vignette 158→72 L (−55 %) | Radial gradient overlay (screen white ≈12 % at corners) or bake into the plate; multiply vignette for light scenes |
| Grain | Static. After sub-pixel alignment fine-grain corr is 0.87–0.97 across 27 frames. Size ≈1–2 px (HP autocorr lag1 0.55–0.67, lag2 ≈0.1). Monochrome (R/G/B corr 0.99). Single-frame HP σ by tone: L<25 → 5–6, 25–40 → 8–9, 40–60 → 12–13, 60–90 → 13–15, 90–180 → ≈19, >180 → 5–11 (overlay-like). Title interior only 2.6 | Pre-rendered static noise PNG (overlay ≈50 %) on the plate and cut-out group; not on type; never animated |
| Cut-out edge | Hard. 10–90 % transition in 3–5 px (red→white profile at f60 rows 760–880). No white stroke, feather or shadow | PNG alpha cut-outs, no CSS shadow |
| Offset echo | Houses: crimson #8a0315 at dx −32, dy −25 px, 100 % opacity, 0 blur. Moon: cream page disc same Ø, ≈(+40, +35) px. Torn paper: red echo along the top-left edge ≈(−25, −20) ≈ | `filter: drop-shadow(-32px -25px 0 #8a0315)` (0 blur) |
| Floor ellipse | Flat, hard-edged. TVs: #6f6461 on #1e1b1b (+40 % L). Book figure: page −10 % L | SVG ellipse, no blur |
| Sticker outline | Push-pins only: 4–6 px white | `drop-shadow(0 0 0 #fff)` ×4 or a stroked SVG path |
| Damask carpet | Wine #462528; motif elements ≈50–100 px; repeat ≈200–270 px horizontally at the front edge (weak autocorr peaks 190/216/268) ≈ | Tiled damask PNG, perspective-skewed, multiply over wine |
| Torn paper | Cream #d0cabf, rough torn contour, blue-grey watercolour stains | Torn-paper PNG mask |
| Clear tape (still) | ≈96 px tall @1080p, wrinkled specular streaks, ≈20–30 % white | PNG with screen blend |
| Ghost wisps (S8) | Translucent white figure-like smoke, ≈30–40 % ≈ | Screen-blended PNG |
| Red fog (S15) | Full-frame smoke #5d1f1e; clears ease-in over 36 f | Smoke video tinted, opacity animation |
| Dust / hairs (animated) | Changes on twos. S22: bright-only specks 130–2025 px/frame (0.03–0.45 %) plus 1–4 vertical scratches (1–3 px). One scratch drifts left ≈3.7 px/f (x 1109→1021 over 22 f). Loops every 24 f (12 drawings). S8: specks only, 13–258 px/frame (≤0.05 %). S1 and S8 have no vertical lines | 12-frame dust/scratch sequence (screen), indexed `floor(frame/2) % 12` |
| Frame flicker | None deliberate. Detrended luma σ 0.14–0.19 (0.2–0.5 %), p2p 0.5–1.1 L, no spectral peak | Don't add (or keep ≤0.5 %) |
| Halftone, misregistration, light leaks, CA | None measured | — |

## 7. Motion language
### 7.1 Why the frame never holds (mad_lo floor ≈1.0–1.7)
| Component | Rate | Amplitude | Evidence |
|---|---|---|---|
| Whole-frame weave (translate only) | ones (97–100 % of consecutive frames differ by >0.5 px) | σx 1.21–1.37, σy 1.06–1.23 px; range −3.3…+2.9 px; lag-1 autocorr ≈0.2 (x) / ≈0 (y) → white noise; rotation <0.02°, scale <0.03 % | `jit` on S1 f0–40, S8 f500–540, S22 f1114–1162. Plate, carpet, sofa, piano and title shift identically (±0.3 px) → post-comp |
| Artwork | twos (even frames) | — | Even/odd mad_lo median per shot: 2.6/1.1 (S1), 4.4/1.5 (S11), 2.8/1.75 (S14) |
| Dust / scratch overlay | twos, 24-f loop | ≤0.45 % px | f1114 ≡ f1138 |
| Title boil | sixes (4 fps) | σ 7 / 4.6 px | S22 mad_lo spikes exactly every 6 f, f1114–1348 |
| Grain | static (rides the weave) | σ≈11 | sub-pixel aligned corr 0.87–0.97 |
| Luminance flicker | — | ≤0.5 % | §6 |

The only true holds in the film are the odd frames of the zoom-through f292–311 (mad_lo 0.06–0.33): the weave was off there.

### 7.2 Motion catalogue
| Motion | Example (frames) | Duration | Velocity profile → easing | Overshoot / stepping |
|---|---|---|---|---|
| Rise / drop / slide-in (entrance) | Houses f2–16; moon f13–30; carpet f437–448; XV f229–240; paper burst f146–154 | 90 % of travel in 4.6–10 f; settled in 8–18 f | Exponential decay. τ = 2.2 f (carpet, XV, paper) to 3.7–4 f (moon, houses). Per-2f ratio 0.41–0.61. Moon fits easeOutCubic (k 3.25, T 19.5 f); the rest are expo. **bezier(0.16,1,0.3,1)** for small props, **(0.22,1,0.36,1)** for big ones | None (moon settles ≤3 px). On twos |
| Gravity drop with hard landing | Sofa f450–456; side table f454–458; piano f456–466; Dracula f484→486 | 2–10 f | Accelerating fall, instant stop, no squash, no camera shake (landing-frame tx/ty < 5 px = weave) | Secondary action only: piano lid flips open f468–471; tilt-top table tips f466–474 |
| Fall-out exit | Book collage f426–435 | ≈10 f to leave frame | Δy per 2 f: 21, 53, 88, 152 → easeInCubic **bezier(0.32,0,0.67,0)** | — |
| Pendulum swing | Portrait f188–290 | ≈100 f | Damped and irregular (hand-keyed): −2.1° (f194) → +4.5° (f212) → −2.2° (f236) → +1.1° (f284). Half-periods 18 / 24 / ≈48 f | Pivot at top centre |
| Puppet limb | Glass arm f488–532 | raise 16 f, hold ≈12 f, lower 16–20 f | Raise: −16/−24/−27/−29 px at +4/+8/+12/+16 f (ease-out). Lower: −27/−25/−20/−5/0 px at f516/520/524/528/532 (ease-in, abrupt stop). ≈5–7° about the elbow | Head, torso and legs locked (0 px) |
| Rubber-hose stretch | Arm f596–604 | 8 f | Sleeve scales along its length ≈700 px; hand leads; route line trims on behind it | On twos |
| Bat flight | f568–620 | ≈26 f per bat | 121→117→99→87→72→68 px per 2 f (decelerating). Wings are separate pieces rotating ≈±20–30° ≈ | 3–4 bats staggered 8–12 f |
| Type-on | "century" f234–250 | 16 f / 7 chars | Irregular 2–4 f gaps | On twos |
| Stepped growth | Ink splat f316–330; splatter on figure f388–420 | 14–30 f | 3–5 discrete drawings | Twos/fours |
| Page turn | f343–351 | 8 f | Flat page rotates about the spine | On twos |
| Lights-up | f72–108 | 36 f + 1-step lamp pop | L 1.6→48, increments growing 1.1→6.0 per 2 f (≈easeInQuad); +15 L pop at f108 | On twos |
| Crash push-in | f820–844 | 25 f | ×2.79, log-zoom progress at f820…844 (every 2 f) 0.02/0.09/0.19/0.31/0.44/0.59/0.71/0.87/0.93/0.95/0.97/0.99/1.00 → **bezier(0.6,0.6,0.4,1)** in log-scale; peak ×1.18 per 2 f (f834) | On twos (odd frames zoom = 1.000) |
| Pull-back | f874–886 | 12 f | ×0.796, ease-in-out (peak ×0.921 per 2 f at f880) | On twos |
| Fog clear | f886–922 | 36 f | easeInQuad (k 2, rms 0.01) **bezier(0.11,0,0.5,0)** | — |
| Idle drift | Balloons S19; Dracula at window | continuous | ≈0.6 px/f; ±10–17 px sway | — |

**Holds and beats.** Each beat lands, then holds 0.6–1.7 s before the next: S1 f44–61, S3 f250–289, S8 f532–541, S11 f620–633. The TV wall holds 7.3 s with only screen content moving, and the end card holds 9.9 s. The camera never pans or drifts inside a shot; parallax is absent.

## 8. Transitions
| ID | Frames | Frame-by-frame | Length | Build |
|---|---|---|---|---|
| T1 Fade through black with continuity | f62–72 | f61 S1 at L 61.5 → f62 recomposed S1 (Dracula full-figure, houses sinking) at L 23.8 → f64 9.9 → f66 5.4 → f68 2.8 → f70–71 black (L 1.1); moon slides behind the head → f72 S2 stage at L 1.6, then lights up | 10 f + 36 f ramp | Exposure ×≈0.5 per 2 f. Keep the hero and moon positions continuous across the cut |
| T2 Dissolve + torn-paper burst | f146–154 | f146–147 S2 ≈50 % under the S3 plate, paper patch at scale 0.54 → f148 100 % S3, 0.80 → f150 0.92 → f152 0.98 → f154 1.0 | 2 f dissolve, 8 f burst | Scale from a bottom-centre anchor, expo-out |
| T3 Zoom-through match cut | f290–311 | f290 XV gone, ×1.17 punch → f292 ×≈1.5 onto the portrait edge (S4) → f294–298 paper close-up (L 172→197) → f300 cut to clean cream (S5, L 217) with silver ornament rising → f304–306 rising (Δy −16…−44 per 2 f) → f308 S6 vignetted ornament (L 155) → f310 tilt/zoom → f312 cut to S7 (book with the same silver frame) | 22 f | Stepped scale keys on twos; weave off |
| T4 Fall-out / build-in | f426–486 | Book falls (ease-in, 10 f) → bare plate (f436) → carpet slides from right → furniture drops → Dracula drops | 60 f | No cut feel: the plate persists |
| T5 Crumple-ball unfold | f542–558 | f542 crumpled ball (≈35 % H) over S8 → f546 ×≈1.6 → f550 bigger, unfolding, map visible → f554 map near full-frame with crumpled border → f558 flat map | 16 f, on fours | 4–5 pre-rendered crumple stills, each held 4 f |
| T6 Radial zoom-blur crash | f634–643 | f634 radially blurred route-line close-up (L 150) → f636 137 → f638 128 → f640 112 → f642–643 2-f cross-dissolve to the TV wall (L 105) → f644 sharp (L 70) | 10 f | Radial blur shader; 2-f dissolve |
| T7 Push into eye → colour cut | f820–874 | ×2.79 push (f820–844), spin hold, second push with defocus f856–871 → f872–873 near-uniform grey (L 151) → hard cut to red fog (L 43) + pull-back ×0.80 | 54 f | Log-space zoom + blur ramp |
| T8 Lightning double strike (×3) | 942–961, 986–1005, 1062–1081 | Bolt cut-out shows 4 f early. Strike 1: gain ×1.8, blur σ≈20 px; then (×1.37, σ8) → (×1.15, σ4) → (×1.06, σ3), 2 f each. Strike 2 lands 8 f later: ×1.44 + 61 offset, σ≈24 px, then the same decay. Luma peaks 129/156, 87/120, 90/120 | ≈18 f per event | `brightness()` + `blur()` schedule on twos |
| T9 Hard cut | f1114 | window → title card | 0 | — |

## 9. Reusable components
| Component | Props (defaults @1080p, 24 fps) |
|---|---|
| `TwosClock` | `step=2` (`fAnim = floor(f/2)*2`). Use `step=4` for crumple, `step=6` for title boil |
| `FilmWeave` | `sigma=1.3` px, `clamp=3`, `seed`, `rate=1` (every frame), `overscan=1.006`, `enabled` (false during zoom-throughs) |
| `PaperPlate` | `src` (scratched black card), `edgeLift=0.12` (screen white at corners), `vignette='inverse'|'dark'`, `darkVignette=0.55` |
| `StaticGrain` | `size=1.5` px, `opacity=0.5`, `blend='overlay'`, `animated=false` (apply below type) |
| `DustLoop` | `frames=12`, `hold=2`, `specks≤0.45 %`, `scratches=1–4`, `scratchW=1–3` px, `drift=-3.7` px/f, `blend='screen'` |
| `CutOut` | `src`, `x`, `y`, `scale`, `rot`, `pivot`, `edge='hard'`, `echo?` |
| `OffsetEcho` | `color='#8a0315'`, `dx=-32`, `dy=-25`, `blur=0`. Cream variant: `color='#b8b6b1'` + page texture, `dx=40`, `dy=35` |
| `FloorEllipse` | `w`, `h≈0.12w`, `color='#6f6461'`, hard edge |
| `DropIn` | `from='top'|'bottom'|'left'|'right'`, `distance`, `easing=bezier(0.16,1,0.3,1)`, `duration=14` f (big props: `bezier(0.22,1,0.36,1)`, 20 f), `startRot=10°→0` |
| `GravityDrop` | `duration=6–10` f, `easing=bezier(0.5,0,0.75,0)`, `landingAction` (lid flip / tip over), no bounce |
| `FallOut` | `easing=bezier(0.32,0,0.67,0)`, `duration=10` f, `distance=frameH` |
| `Pendulum` | `pivot='top'`, `startRot=+11°`, `keys=[[6,-2.1],[24,4.5],[48,-2.2],[96,1.1],[110,0]]` (f, °) |
| `PuppetLimb` | `pivot`, `angle=6°`, `raise=16`, `hold=12`, `lower=18` f |
| `RubberArm` + `RoutePath` | `stretch=700` px over 8 f; route `stroke='#581c1c'` ≈8 px ≈; `trim` follows the hand; `PushPin` with `outline=5` px white, pop ≤2 f |
| `MaskedRise` (XV) | `maskY=729`, `distance=249`, `duration=11` f, expo-out |
| `TypeOn` | `schedule=[0,2,6,8,10,14,16]` f (≈9 cps, jittered) |
| `BoilTitle` | `every=6` f, `sigmaX=7`, `sigmaY=4.6`, `clamp=12` px, `rot=±4°`, `font='Mystery Quest'`, `color='#b66d24'`, `cap=226` px |
| `LightningStrike` | `preBolt=4` f, `strikes=[{gain:1.8,blur:20},{gain:1.44,offset:61,blur:24}]`, `gap=8` f, `decay=[1.37/8,1.15/4,1.06/3]` |
| `CrashZoom` | `to=2.79`, `duration=25` f, log-space, `easing=bezier(0.6,0.6,0.4,1)` |
| `ZoomBlurCut` | `blurFrames=8`, `dissolve=2` |
| `CrumpleUnfold` | `stills=4–5`, `hold=4` f |
| `FadeThroughBlack` | `factorPer2f=0.5`, `black=2` f |
| `LightsUp` | `duration=36` f, `easing=easeInQuad`, `lampPopAt=36` (+15 L) |
| `FogReveal` | `color='#5d1f1e'`, `duration=36` f, `easing=bezier(0.11,0,0.5,0)` |

## 10. Build notes for code (Remotion / React)
1. **Two clocks.** Drive every `interpolate`/`spring` with `const fa = Math.floor(frame/2)*2`. Drive only `FilmWeave` and `DustLoop` with the raw frame (the weave changes every frame; dust uses `Math.floor(frame/2) % 12`). Put cuts on even frames.
2. **Layer order (back→front).** Plate → grainy cut-outs → props → hero → foreground. Then type, which sits above the grain (title interior grain σ 2.6 vs ≈19 for the plate at that tone). Then dust (screen). Then a `FilmWeave` wrapper around everything: `transform: translate(dx,dy) scale(1.006)`, with dx and dy from seeded Gaussian `random(\`w${frame}\`)`, σ 1.3, clamped ±3 px × (height/1080).
3. **Echoes and shadows.** Use CSS `filter: drop-shadow(-32px -25px 0 #8a0315)` on PNG cut-outs, or SVG `feFlood + feComposite in=SourceAlpha + feOffset`. Never use blurred shadows.
4. **Easing tokens.** `ENTER = Easing.bezier(0.16,1,0.3,1)` (14 f), `ENTER_BIG = Easing.bezier(0.22,1,0.36,1)` (20 f), `EXIT = Easing.bezier(0.32,0,0.67,0)` (10 f), `CRASH = Easing.bezier(0.6,0.6,0.4,1)` applied to `log(scale)`.
5. **Grain.** Bake grain into a 4K plate texture: blob ≈3 px at 4K, monochrome, overlay. Do not regenerate it per frame, or the look becomes video noise rather than "film card".
6. **Lightning and blur.** CSS `filter: brightness(g) blur(b)` on the scene wrapper with the §8 schedule. Radial zoom blur needs a WebGL fragment shader, or ≈12 stacked copies at `scale(1+0.02i)` and opacity 1/12.
7. **Title boil.** Render each glyph as an absolutely positioned `<span>`. Its transform comes from `random(\`g${i}-${Math.floor(frame/6)}\`)`, giving fresh states without repeats.
8. **4K.** Author in a 1920×1080 coordinate space inside a `scale(2)` wrapper. All raster cut-outs and textures must be ≥2× (≥4K plate, ≥2000 px figures), and all px values in this report double.
9. **Hard parts.**
   - Crumple-unfold: pre-render 4 stills (Blender cloth or real paper photos) and hold each 4 f.
   - Page turn: `rotateY` with perspective 1200 px plus a shading gradient, 8 f on twos.
   - Spinning head with rotational blur: canvas with an angular blur, or 6 rotated copies at low opacity.
   - Damask perspective: CSS `perspective` + `rotateX(≈60°)` on a tiled texture.

## 11. Evidence index
| Path (under `analysis/`) | Note |
|---|---|
| `sheets/dracula/sheet_001–019.png`, `index.md` | All keyframes reviewed |
| `sheets/dracula_gif1/sheet_001–004.png`, `sheets/dracula_gif2/sheet_001–005.png` | GIF keyframes |
| `strips/dracula_00000-00047.png` | S1 build: houses / moon / giant on twos |
| `strips/dracula_00044-00091.png`, `strips/dracula_00062-00109.png` | T1 fade through black, S2 lights-up |
| `strips/dracula_00138-00185.png` | T2 dissolve + paper burst, castle rise, portrait drop |
| `strips/dracula_00182-00229.png` | Portrait pendulum |
| `strips/dracula_00228-00275.png` | XV masked rise, "century" type-on |
| `strips/dracula_00282-00329.png` | T3 zoom-through; S7 splat growth |
| `strips/dracula_00330-00377.png`, `strips/dracula_00378-00425.png` | Page turn, quill writing |
| `strips/dracula_00420-00467.png`, `strips/dracula_00460-00507.png` | Book fall-out, carpet slide, furniture drops, Dracula drop |
| `strips/dracula_00530-00577.png` | T5 crumple on fours; map; bat entry |
| `strips/dracula_00578-00625.png` | Bats, rubber arm, route, pins |
| `strips/dracula_00620-00667.png` | T6 zoom-blur + 2-f dissolve; TV wall |
| `strips/dracula_00800-00847.png`, `strips/dracula_00840-00887.png` | TV static, crash push-in, head spin, eye push, red-fog cut |
| `strips/dracula_00880-00927.png` | Fog clear |
| `strips/dracula_00930-00977.png`, `strips/dracula_00980-01027.png`, `strips/dracula_01056-01103.png` | Lightning double strikes ×3 |
| `strips/dracula_01100-01147.png` (+ `01150-01197`, boil checked numerically to f1348) | Hard cut to title, boil every 6 f |
| `strips/dracula_gif1_00000-00047.png`, `strips/dracula_gif1_00048-00049.png`, `strips/dracula_gif2_00000-00047.png`, `strips/dracula_gif2_00048-00064.png` | GIF breakdowns |
| `stills/D/f0024…f1130.png` (20 native grabs) | Measurement sources |
| `stills/D/crop_houses_rededge_x2.png`, `stills/D/crop_houses_left_x2.png` | Crimson echo (−32, −25), hard edges |
| `stills/D/crop_moon_f45_half.png` | Moon + cream page-disc echo |
| `stills/D/crop_sofa_feet_carpet_x2.png`, `stills/D/crop_ghost_overlay_x1.png` | Damask, no contact shadow, ghost wisp |
| `stills/D/crop_XV_century_x1.png`, `stills/D/crop_1897_f400.png` | Type specimens |
| `stills/D/crop_title_boil_1127_1132_1138_1144.png` | Per-glyph boil states |
| `stills/D/crop_bat_flap_f572-586.png`, `stills/D/tiles_arm_route_f592-620.png` | Wing pieces, rubber arm |
| `stills/D/crop_pin_outline_f632_x3.png` | 4–6 px sticker outline |
| `stills/D/stills_contact_8.png`, `stills/D/crop_still_map_tape_topleft.png`, `stills/D/crop_still_map_labels.png` | Still catalogue, tape, script labels |
| `metrics/dracula.csv` | Luma, flicker, even/odd mad_lo, zoom per frame |

## 12. Stills & GIFs catalogue
| File | Scene ↔ shot | Palette (stills.json, top) | Notes / differences from the video |
|---|---|---|---|
| `03c3e7…png` 1400×796 | Parlour ↔ S8 | #0e0e0e 43 %, #262626 21 %, #420a0e 11 %, #681f27 8 % | Dracula **standing** in front of the sofa (seated in the video); martini on the side table; cherry #ac0e08; carpet #4f171c (darker than video #462528) |
| `116fcf…png` 1400×788 | Window ↔ S15–21 | #3c3434, #545454, #0c0c0c, #847c7c, #bb6927 5 % | Bolt shown; stack of books lower right; cobweb |
| `4164d2…png` 1400×788 | TV wall ↔ S14 | #181818, #d8c8c8 20 %, #2c7137 (poster green), #d1ae36 | Floor ellipse #6f6461; red scribbles #883838 |
| `5d6893…jpg` 1400×796 | Theatre ↔ S2 | #000000 43 %, greys, #6d0e08, #ae170b | Moon prop on a string, spotlights, tilted posters, two boys from behind |
| `89abe8…png` 1400×796 | Book ↔ S7 | #000000 35 %, #d4ccc4 24 %, #bd8e76 (hand), #bb0a08 | Grey disc + brick fragments; quill hand; red splats |
| `8cdb95…png` 1400×788 | Map ↔ S11 | light greys, #581c1c | **Script labels "England"/"Transilvania"** and clear tape strips are not in the video; pins have a white sticker outline |
| `98cbbf…jpg` 1400×796 | XV ↔ S3 | #000000 40 %, #c5c3b9 29 %, #892427, #a9763e | "century" set in an **italic script** (typewriter slab in the video); XV #901e27 |
| `f4670f…png` 1400×788 | Close-up head + claw hands ↔ S14 TV content | #3f3e3e, #2a2a2a, #161616, #842c32 | Red scribbles #842c32; source of the spinning head |
| `dracula_gif1` 50 f, 10 fps, 800×600 | **Off-style** (Vox-yellow epigenetics piece, not Dracula) | #e6e6e6 37 %, #e9ed3d 27 %, #d3d729, blue particles #559cb0 | f0–22: asset breakdown board ("png drop + drop footage + png water / shape repeater + splash image + petri dish png"); drop-crown footage loops ≈11–12 f. f23–49: yellow composite — drop falls into a petri dish (f27–29), blue particle splash (f29–35), "SALIVA TEST" label slides in (f31–35), "HORVATH BROTHERS" typed on a highlight strip (f41–47, ≈1–2 chars/frame) |
| `dracula_gif2` 65 f, 10 fps, 800×600 | **Off-style** build-up breakdown (epigenetics DNA) | #161616 45 %, #2d2d2d 33 %, #dbc836, #9e1031, #2ae91a | f0–9 flat ladder; f10–19 twisted helix (rotates in place: phase animation, 0 px translation); f20–29 textured helix; f30–42 inside a deckled white-border photo print; f43–64 desk composite (tape, pen, petri dish, yellow "METHYLATED DNA" label + paperclip); magnifier slides in from the right f43–48 (≈5 f) and magnifies ≈1.7× ≈ |

**Takeaway for the framework.** Both GIFs are process breakdowns of the author's yellow Vox-explainer piece. Use them as method references (PNG cut-out + stock footage + shape-repeater particles, staged build-up) and not as Dracula-style evidence. The 8 stills are styleframes. The video differs in blacks (lifted), several layout details and the "century" typeface, so treat the video as ground truth for motion and finishing, and the stills for asset detail.
