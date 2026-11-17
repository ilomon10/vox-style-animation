# Vox "Earworm: Quiet Storm", segment D: visuals, A/V sync, sound design and the ending (`earworm`, f2783–3842, 111.32–153.73 s)

> Analyst: D. Sources reviewed: keyframe sheets `sheets/earworm/sheet_042–056` (all cells), AV timelines `av/earworm_104.00-112.00 … 152.00-153.72`, `audio/earworm_words.json`, `earworm_features.csv`, `earworm_rhythm.json`, `metrics/earworm.csv` + `_shots.md`, 4 new full-rate strips, 14 native grabs (`stills/earwormD/`), and my own **mid/side analysis** of `audio/earworm_full_stereo48k.wav` (`stills/earwormD/stereo_midside_f2500-3843.csv`).
> The source is 1920×1080 at 25 fps, so source px are the same as @1080p. Frames are **global** and t = f/25. **dBr** means dB relative to the episode's 99th-percentile frame power (the `rms/low/mid/high_db` columns). Offsets are signed: **+ = visual after audio**. "≈" marks an estimate.
> **Speech onsets.** Whisper word starts are up to 10 f early (for example, "So," is listed at f3332 but its sibilant starts at f3342). Every phrase-initial onset below was re-measured from the frame where the 200–2000 Hz band rises by ≥ 6 dB. Words inside a phrase use whisper ±2 f.
> **Who is speaking.** The female narrator has F0 ≈ 190–232 Hz. Interviewee 1 (F0 ≈ 138 Hz) and interviewee 2 (≈ 154 Hz) appear in webcam windows. The archival radio aircheck at the end (DJ, caller, song) is phone-filtered.
> "and that came cold" (whisper) is the narrator saying "…and Nat King Cole". "They knew how to…" (pitch ≈ 170 Hz, louder than the narration) is interviewee 2 pre-lapped. "But it was all…" (f2832) is probably interviewee 1, interrupted by the song (≈).

## 1. Summary: what is new compared with `epigenetics.md`
- **A dark collage world instead of a light desk.** The picture is full 16:9 with no pillarbox. The ground is a near-black collage of dark paper scraps and low-contrast newsprint (#060606–#101010).
  - Hero material is **B&W photo cut-outs** with ragged white torn borders and newsprint scraps showing behind them.
  - The Vox bug (#CFCFCF–#DFDFDF, x 1717–1888, y 31–113, the same size and place as before) now sits **inside** the picture. It dims with the dip to black and smears with the final zoom-blur.
- **The accent is periwinkle, not yellow.** Periwinkle **#7480F1** is used for the "QUIET STORM" type, the "R & B" / "D J" letters, cables and the phone cord. A deeper **glowing visualizer blue** is used for audio graphics: core #8A92DB, body #414AA6, glow #2A3293.
  - Yellow (#F8F005) appears once in the whole segment: the end-card underline.
- **Sound is the subject, so graphics listen.** There are three audio-linked devices:
  - a **spectrum-bar row** gated by loudness (S22);
  - an **oscilloscope line that spikes on kick drums** (S25);
  - **word-by-word captions of sung and archival voices** (S25, S27).
- **Songs and narration take turns; they don't overlap.** Featured songs play in the clear at −4…−12 dBr. Under narration the voice band (200–2000 Hz) is kept ≥ 25 dB below the voice peaks, while a mono bed may carry bass (−4…−15 dBr). Each handoff is a 21–25 f fade-out of the song that starts 17–24 f before the next voice and ends between 3 f before and 8 f after its first syllable. There is no stacked music.
- **Transitions are wrapped in sound.**
  - Blur-through cuts get a **sub-boom** whose peak sits on the cut frame +1.
  - The one **dip to black** is also a dip to **digital silence**.
  - The 90° **spin-swap** has a whoosh peaking on its swap frame.
  - The end card lands on a **bass hit at 0 f**.
- **New visual devices:** webcam **interview windows**, a 6.25× **mega pull-back** from a macro to a top-down collage, a **90° spin-swap** between two collages, a **recap collage** where every prop flies in to frame the title, and **full-bleed kinetic typography** of archival phone voices spelled as pronounced ("TO EAR", "LOVIN").
- **Unchanged: 12 drawings/s.** Graphics run on twos at 25 fps with a 3-frame hold about every 11 drawings (a 12 fps conform). Fades, blur ramps and footage run on ones. Webcam footage runs at its native 10–17 fps.
- **The ending.** The narration stops at f3663. Then follow 4.5 s of archival aircheck (caller, DJ, song lyric) as giant type, a 6-frame breath, a cut on a bass hit to a glitching "Vox EARWORM" card, and **music still playing at −5 dBr on the last frame**. There is no fade-out and no sign-off.

## 2. Shot log
| Shot | t0–t1 (f) | Content / composition | Layers (back→front) | Motion | In / out |
|---|---|---|---|---|---|
| 22 | 111.32–116.96 (f2783–2924, 142 f) | Nat King Cole B&W cut-out on the right 40 % (x≈1130–1920, bleeding off three edges), laughing into a vintage mic. Artist tag "NAT KING COLE / UNFORGETTABLE" left of centre (x 275–800, y 456–585). Visualizer: 9 glowing columns across the lower middle (y≈700) | collage bg → visualizer → photo cut-out → tag slips + torn white strips → bug | Lands on a **pan carried across the cut**: −77, −95, −72, −36, −31, −21, −12, −3 px/drawing, f2785–2800. Torn newsprint scraps slide off the face and tag f2785–2797. Focus 57→498 (sharpness) and exposure 18→53 luma over 14 f. Bars wipe on right→left f2804–2814. Then drift −0.9 %/s | in: **blur-through cut** + sub-boom · out: hard cut (J 3 f) |
| 23a | 117.00–120.56 (f2925–3014) | Interviewee 1 in a **rounded webcam window** 957×867 (x 480–1437, y 102–969, r≈28) on flat #0C0C0C | bg → window → bug | Static window. Footage at ≈17 fps | in: hard cut · out: **fade to black** f2997–3015 |
| 23b | 120.60–121.24 (f3015–3031) | Pure black (luma 0, bug included) | – | Hold 17 f | dip |
| 23c | 121.28–126.20 (f3032–3155) | Macro of a VU meter (dial ≈1300 px wide). It pulls back to a **top-down console collage**: console centred; boom mic and periwinkle cable top-right; cassette right; turntable and record left; a skyscraper spire left; newsprint ground | bg → newsprint → turntable/spire → console → mic/cassette → bug | Linear **fade-in** f3032–3067 (on ones). Needle swing f3034–3066. **Mega pull-back ×0.160** f3052–3104. Props slide in f3087–3112. Drift −0.8 %/s | in: from black · out: hard cut |
| 24 | 126.24–129.84 (f3156–3246, 91 f) | Interviewee 2, same window geometry | as 23a | Static, ≈11 fps | in: **J-cut, voice 31 f early** · out: hard cut |
| 25 | 129.88–133.20 (f3247–3330, 84 f) | Real footage of a spinning record (lower half, red/green fringes on its rim). **Oscilloscope line** behind the record at y≈500. Credit 'Anita Baker "Angel"' top-left. Sung-lyric line centred (y 540–625) | bg → scope → record → lyric → credit, bug | Record spins (on ones). Scope spikes on kicks. Lyric words glitch in. Exit f3323–3330: record and caption drop and shrink, scope off at f3327 | in: hard cut on the last interview word · out: hard cut |
| 26 | 133.24–145.56 (f3331–3639, 309 f) | Dark newsprint stage built up piece by piece: boombox, torn paper and a soul singer with mic, tuner, record, periwinkle **R & B**. Then a **spin-swap** to the console collage with periwinkle **D J**. Then the **"QUIET STORM" recap collage** (≈14 props fill the frame, title centred x 680–1105) | bg → paper scraps → props → letters (some behind props) → bug | Boombox hinge-flip f3336–3348. Singer rise f3358–3369. Pieces f3371–3381. R/&/B masked rise f3388–3415. **Roll 90° CW** f3426–3466. D/J rise f3460–3481, sink-out f3547–3556. Recap fly-in f3576–3594. Defocus f3631–3639 | in: hard cut, **picture 11 f before the voice** · out: **blur-through** |
| 27 | 145.60–151.20 (f3640–3780, 141 f) | B&W rotary-pad phone (handset and base on newsprint scraps, periwinkle cord), centred. Off-white condensed type **behind** it, full-bleed: "DID YOU WANT TO EAR / SOMETHING ?" → "YES / YES" → "DON'T" → "STOP" → "EVER" → "LOVIN" → "ME". White hand-drawn "ringing" squiggles | bg → giant type → phone cut-outs → squiggles → bug | Settle ×2.64→1 f3637–3652. Handset lifts f3663–3667. Words pop one drawing each. Squiggles boil every 2–3 f | in: blur-through · out: **zoom-blur 4 f → hard cut** |
| 28 | 151.24–153.68 (f3781–3842, 62 f) | End card: #141414 grainy charcoal, "Vox" wordmark (132×66 at x 891, y 345), yellow marker underline (#F8F005, 170×16 at y 425), "EARWORM" (x 522–1389, y 483–611). **No bug** | bg → wordmark → underline → title | 1 blank frame. Glitch-slice build f3782–3799. Residual glitch pairs every 4 f to the end | in: cut on a bass hit · out: file ends mid-music |

## 3. Color
| Token | Hex (median / p10 / p90) | Role | Evidence |
|---|---|---|---|
| collage-black | #060606 / #040404 / #090909; textured areas to #0C–#10 | ground | f2850, f3610 |
| window-surround | #0C0C0C (std 0) | flat field around interview windows | f2950, f3200 |
| endcard-charcoal | #141414 / #131313 / #161616 | end-card ground | f3830 |
| tag-slip / tag-slip-2 | #1F1F1F / #343233 | dark paper slips under the artist tags | f2850 |
| paper-white | ≈#F0F0F0 (photo whites p99 luma 244) | torn borders, tag strips | f2793, f2850 |
| **periwinkle** | **#7480F1** (p90 #7781FE); cords #757FE1 | accent: titles, letters, cables, record labels | f3610, f3700 |
| viz-core / viz-body / viz-glow | #8A92DB / #414AA6 / #2A3293 → #1D2056 | spectrum bars | f2850 |
| viz-dot | #586BB5 (p90 #7887D6) | idle bar dots | f2850 |
| scope | #5C71C2 (p90 #7886DB) | oscilloscope line | f3300 |
| type-offwhite | #DDDDDB (p90 #F1F1EF) | kinetic type | f3700 |
| lyric/credit white | #FFFFFF | lyric and credit text | f3300 |
| logo-grey | #999999–#BEBEBE (scratched) | "EARWORM" | f3830 |
| marker-yellow | **#F8F005** (p90 #FFF42C) | end-card underline only | f3830 |
| bug | #CFCFCF–#DFDFDF | Vox bug | f2850, f3610, f3700 |

**Grade.**
- Photos are fully desaturated: shot sat 0.003–0.03 on the collage shots (S26–S28), against 0.07–0.17 where the glowing blue graphics are on screen (S22, S25). Colour lives **only in the graphics** (periwinkle and glow blue).
- Webcam interviews keep natural colour: interview 1 is warm (shot 23 warmth +2.8), interview 2 slightly warm (S24 +5.9). They get no grade.
- Blacks are true near-black (#06), unlike the lifted #28 of epigenetics.
- Chromatic fringes appear on the record rim (S25) and on the end-card glitch slices. No global CA was measured.

## 4. Typography
| Style | Role / examples | Case | Cap height @1080 | Class / weight | Colour / background | Reveal | Commercial ≈ | Free ≈ |
|---|---|---|---|---|---|---|---|---|
| Artist tag | "NAT KING COLE" | CAPS | ≈45 | condensed grotesque, bold | #FFF on slip #1F1F1F, torn white strip ≈12 px under and right of it | present at the cut, uncovered by sliding scraps | Alternate Gothic No.2 / Knockout 49 | Oswald 600 |
| Song tag | "UNFORGETTABLE" | CAPS | 34 | same, medium | #FFF on #343233 | with the artist tag | same | Oswald 500 |
| Now-playing credit | 'Anita Baker "Angel"' | Title | ≈20 | neo-grotesque, medium | #FFF, no box, top-left x 153, y 12–40 | on with the cut | Graphik / Balto | Inter 500 |
| Lyric line | "YOU'RE MY ANGEL" | CAPS | ≈77 | condensed, semibold | #FFF, no box, centred over the record | word by word, **RGB glitch-in 2–6 f** | Alternate Gothic No.2 | Oswald 600 |
| Big letters | "R & B", "D J" | CAPS | 200–230 | condensed bold, grainy | periwinkle, partly **behind** props | masked rise 17 f, staggered | Knockout | Oswald 700 / Bebas Neue |
| Recap title | "QUIET / STORM" | CAPS, 2 lines | ≈120 / 134 | condensed bold, distressed | periwinkle | flies in with the recap collage | same | Oswald 700 |
| Kinetic voice | "DID YOU WANT TO EAR / SOMETHING ?", "YES", "DON'T"… | CAPS | 156 → 240 → ≥ 820 (single words fill the height) | heavy condensed, paper grain | #DDDDDB, **behind** cut-outs, cropped by the frame | **pops one drawing per word**; the YES line-feeds the previous line up | Druk Condensed / Knockout | Anton / Oswald 700 |
| Series logo | "EARWORM" | CAPS | 128 (867 px wide) | extended heavy grotesque, scratched | grey on charcoal; "Vox" wordmark + yellow marker underline | glitch-slice build | Druk Wide / Monument Extended | Archivo Expanded 800 |

Rules:
- One condensed family carries every role except the series logo. Size is the hierarchy: 20 → 45 → 77 → 120–230 → full-bleed.
- Archival voices are transcribed **as heard** ("TO EAR", "LOVIN").
- Display type sits **behind** foreground cut-outs.
- There is no serif and no handwriting. The marker strokes are the yellow underline and the white squiggles.

## 5. Layout & composition
- **Canvas.** The full 1920×1080 frame is live, with no safe-area framing. Heroes bleed off edges: NKC off three sides, kinetic type off both sides, and the YES top cut at y = 0.
- **Two compositions alternate.**
  - (a) **Asymmetric hero + tag**: cut-out right 40 %, tag left-centre, visualizer in a horizontal band at 60–70 % of the height.
  - (b) **Centred object**: interview window, boombox, phone and console are all centred within ±10 px of x = 958.
- **Interview window.** 957×867 = 50 % of the width and 80 % of the height, r 28. It is the only element on a flat #0C0C0C field: no tag and no lower third.
- **Collage build density.** It grows from 1 object (boombox, 44 % of the width) to about 5 (R&B stage), then to about 14 (recap). The recap is a loose grid with 0–30 px gutters and rotations within ±10°, and the title sits in the optical centre.
- **Depth.** Layers do not parallax. The kinetic type is behind the phone and the letters are behind props, so type is treated as a physical layer. The visualizer sits behind the hero photo.

## 6. Textures & materials
| Item | Measurement | How to generate |
|---|---|---|
| Collage ground | #06–#10, dark paper scraps with torn edges; newsprint text at Δluma +3…+6 | tiled PNG of scanned dark papers + newsprint at 4–6 % screen |
| Photo cut-out | B&W, contrast to p99 244; ragged white border ≈6–12 px; a second ragged newsprint layer peeks out 10–40 px | alpha-matted photo + two dilated, turbulence-displaced masks (white, then newsprint) |
| Torn strip (tags) | white, ≈12 px tall, ragged lower edge, extends 60–100 px beyond the slip | SVG path with displacement |
| Glow (bars, scope) | Core 3–6 px; bloom radius ≈30–60 px; grain inside the bloom | stacked `drop-shadow`/`feGaussianBlur` in blue (σ 8 + 24 px) + noise overlay |
| Type grain | speckles and scratches inside the glyphs (YES, EARWORM) | multiply a paper-scratch texture, clipped to the text |
| Record footage | real; red/green rim fringes ≈2–3 px | footage, or an RGB-split shader on edges |
| Webcam | 10–17 fps, compression-soft | play at source fps and do **not** posterize |
| Film grain | present on the collage shots and the end card; S28 static grain re-rendered with each glitch step | as epigenetics `FilmFinish`, without lifted blacks |

## 7. Motion language
Drawing rate:
- S22, S23 pull-back and S25: intervals of 2 f with a 3 every ≈11 drawings (11.8–12.0 drawings/s).
- S26–S27: 10.5 drawings/s; more 3-frame holds on static stretches.
- Fades, blur ramps, the VU needle footage and webcam video run on ones or at their native rate.

| Motion | Evidence (frames) | Duration | Measured progress | cubic-bezier | Notes |
|---|---|---|---|---|---|
| Pan carried across a blur-cut | f2785–2800: −77, −95, −72, −36, −31, −21, −12, −3 px/drawing (347 px) | 16 f | .22 .50 .70 .81 .90 .96 .99 1 | ≈(0.25, 0.6, 0.35, 1) | the outgoing shot pans left too (−26, −41, −69 px/drawing, f2777–2781) |
| Exposure + focus ramp (incoming) | f2783–2797: luma 18→26→34→40→45→48→52→54; sharpness 57→55→81→175→413→498 | 14 f | – | linear exposure | on twos |
| Bars wipe-on | f2804 (x 1341, 1179) → f2814 (x 57) | 10 f | – | linear R→L ≈3200 px/s | each column enters as a spike, then settles to its dot |
| Fade to black | f2997–3015, luma 58.8 → 0 | 18 f | −3.3 luma/f | linear | on ones; includes the bug |
| Fade from black | f3032–3067, luma 7 → 139 | 36 f | +3.8 luma/f | linear | on ones |
| VU needle swing | f3034–3054: −35.5° → +51°, then back to +28° by f3066 | 20 f + 12 f | .01 .05 .14 .26 .41 .55 .69 .82 .92 .97 1 | **(0.40, 0, 0.65, 1)** | keyframed, **not** audio-driven (§14) |
| **Mega pull-back** | f3052–3104, zoom ×0.160; per drawing .992 … .913, **.824, .822** (f3079–3081), .854 … .980 | 52 f | log-scale .01 .03 .07 .11 .18 .30 .51 .67 .84 .94 .99 1 | **(0.70, 0.10, 0.45, 0.90)** | peak speed at 56 % of the duration |
| Props slide in during the pull-back | mic f3087, cassette f3091, spire f3093, turntable f3097, record f3104, bust f3106 | 6–10 f each | – | ease-out | staggered 2–6 f, all in the decelerating half |
| **Hinge flip-in** (boombox) | visible area 9, 58, 75, 86, 93, 96, 100 % at f3336…3348 | 12 f | – | **(0.30, 0, 0, 1)** | first drawing is a thin sliver |
| Masked rise (singer, letters) | "R" top edge Δ 69, 45, 30, 21, 15, 12, 6, 3 px/drawing (204 px), f3388–3405 | 17 f | .34 .56 .71 .81 .88 .94 .97 .99 1 | ≈ `enter` (0.16, 1, 0.3, 1) | stagger R → & → B = 6 f, 4 f; singer f3358–3369 |
| **Roll spin-swap** | dominant edge angle 0, 2, 4, 8, 16, 23, 33, 43° (f3426–3440, outgoing) → swap f3442–3446 → incoming −44, −35, −26, −20, −11, −6, −2, 0° (f3446–3466) | 40 f | ≈ ease-in-out | ≈(0.5, 0, 0.5, 1) | content turns **90° clockwise**; peak ≈10°/drawing at the swap |
| Letters sink out (D, J) | f3547–3556 | 9 f | – | ease-in | |
| Recap fly-in | f3576–3594, ≈14 props converge from the frame edges with rotation | 18 f | – | ease-out | the title rises from behind the console |
| Defocus-out | sharpness 1409 → 243 (f3631) → 94 (f3635) | 6 f | stepped by drawing | – | |
| Oversized settle (phone) | width 1623 → 1218 → 936 → 777 → 684 → 633 → 612, f3637–3652 | 15 f | log .29 .56 .76 .89 .97 1 | **(0.25, 0.10, 0.20, 0.90)** | sharp by f3644 |
| Handset lift | f3663–3667 | 2 drawings | – | pop | stays "off the hook" |
| Word pop | one drawing, held until the next word | 0 f | – | – | the YES line-feed pushes line 1 up (f3699) |
| Zoom-blur exit | sharpness 626 → 544 → 227 → 102 → 52, f3776–3780 | 4 f | accelerating | – | on ones; smears the bug |
| Logo glitch | build f3782–3799 (W → A RW → A RW M → EA RWOR M → EARWORM); then 2 changed + 2 held frames every 4 f until f3840 | 18 f + residual | – | – | horizontal slice offsets with RGB fringes |

**Coordination.**
- The pull-back's fastest drawing is placed on the title word "storm".
- The spin's swap is hidden at peak speed.
- Every hold still drifts (−0.8…−0.9 %/s) or boils (squiggles, glitch).
- The only true holds are the interview windows and the 17-f black.

## 8. Transitions
| Type | Instances | Frame by frame | Length | Trigger | Build |
|---|---|---|---|---|---|
| **Blur-through cut** | S21→S22 (cut f2783) | Outgoing: f2777 pan −26 px/drawing, then −41, −69, with sharpness 694 → 131 → 68. **Cut f2783**: incoming dark (luma 18 vs 47) and blurred (57). Luma +8/drawing and focus snap by f2793, scraps slide off, pan decelerates to f2800 | 6 f out + 14 f in | change of song/artist | outgoing `blur(0→12 px)` + accelerating pan; incoming starts `brightness(.35) blur(12px)` → 1 over 7 drawings; sub-boom (§13) |
| Blur-through cut (oversized) | S26→S27 (cut f3640) | f3631 the recap collage drops to sharpness 243, f3635 94. f3637 a **2.64× oversized blurred phone** (the new shot pre-rolled). **Cut f3640** at ×1.98, then ×1.52, 1.26, 1.11, 1.03, 1.0 by f3652, sharp by f3644 | 6 f + 15 f | new topic ("call-ins") | `blur` ramp + `overscaleSettle` (0.25, 0.10, 0.20, 0.90) |
| **Dip to black + silence** | inside S23 | Picture fades 18 f (f2997–3015) over the last two words, holds black 17 f; audio decays to digital silence (f3026–3031); **picture and voice restart on the same frame f3032**; fade-in 36 f | 71 f | act break: interviewee → narrator's thesis | `DipToBlack` on ones; mute the bus |
| **Mega pull-back reveal** | S23c | macro VU meter → ×0.16 top-down console collage in 52 f (0.70, 0.10, 0.45, 0.90); props slide in during the deceleration | 52 f | widen from detail to system | `CameraRig` scale in log-space |
| **Spin-swap** | inside S26 | collage A rotates 0 → 45° CW (accelerating), swaps at peak speed (f3442–3446) for collage B already at −45°, which continues CW to 0° and settles by f3466 | 40 f | new term in the sentence ("relaxing DJ") | two world groups under one rotating rig, B pre-rotated −90° |
| **Recap fly-in** | S26 f3576–3594 | all props of the episode converge into a frame-filling grid while the title rises | 18 f | "ties it all together" | per-prop `enter` from off-frame with ±10–30° rotation, stagger 0–6 f |
| Hard cut + J-cut | S22→S23 (voice 3 f early), S23→S24 (voice **31 f** early, cut on a stressed word +5 f) | – | 0 f | talking heads | audio clip offset |
| Picture-first hard cut | S25→S26 (f3331; the narration's "So," arrives f3342) | the song tail L-cuts under the new picture | 0 f | new paragraph | cut 11 f before the voice |
| **Zoom-blur → cut on a bass hit** | S27→S28 | f3777–3780 blur ramp (on ones) with an audio dip to −17 dBr; **cut f3781 = bass onset**; blank frame; logo glitches in | 4 f + glitch | ending | radial/zoom blur shader; cut exactly on the audio transient |
| Not present | – | no cross-dissolves between shots, no wipes, no page tears; black appears only as the one dip | – | – | – |

## 9. Reusable components
| Component | Props (defaults from the measurements) |
|---|---|
| `DarkCollageStage` | `bg:"#060606"`, `paperScraps:true`, `newsprintOpacity:.05`, `bug:{x:1717,y:31,w:171,h:82,color:"#D6D6D6",insidePicture:true}` |
| `CollageCutout` | `src`, `bw:true`, `tornBorder:{px:9,color:"#F0F0F0",rough:3}`, `newsprintUnderlay:{offset:10–40}` |
| `ArtistTag` | `name`, `song`, `font:"Oswald"`, `nameCap:45`, `songCap:34`, `slips:["#1F1F1F","#343233"]`, `tornStrip:{h:12,overhang:80}`, `revealBy:"scrapsSlide"` (12 f) |
| `NowPlayingCredit` | `text`, `x:153`, `y:12`, `cap:20`, `font:"Inter 500"`, `color:"#FFF"`, `inOut:"cut"` |
| `SpectrumBars` | `columns:9`, `pitch:160`, `x0:57`, `y:700`, `idleH:65`, `maxH:1000`, `colors:{core:"#8A92DB",body:"#414AA6",glow:"#2A3293"}`, `bloom:45`, `gateDbr:-12`, `leadF:2`, `randomPerBar:true`, `onTwos:true`, `wipeOn:{dir:"rtl",f:10}` |
| `KickScope` | `y:500`, `color:"#5C71C2"`, `bloom:30`, `idleAmp:10`, `spike:{ppMin:75,ppMax:600,shape:"zigzag",holdF:2}`, `trigger:"lowBandRise>=8dB"`, `lagF:0`, `growInF:12`, `layer:"behindHero"` |
| `LyricLine` | `words:[{text,f}]`, `cap:77`, `font:"Oswald 600"`, `glitchInF:4`, `rgbSplitPx:6`, `leadF:0` |
| `KineticVoice` | `words:[{text,f}]`, `leadF:4` (speech) / `0` (sung), `mode:"line"\|"word"`, `font:"Anton"`, `fill:"#DDDDDB"`, `grain:true`, `bleed:true`, `layer:"behindCutouts"`, `spellAsHeard:true` |
| `InterviewWindow` | `w:957`, `h:867`, `r:28`, `field:"#0C0C0C"`, `fpsNative:true`, `jCutF:3` (default) … `31` |
| `DipToBlack` | `outF:18`, `blackF:17`, `inF:36`, `thump:true`, `silenceF:6`, `resumeOnVoiceFrame:true` |
| `MegaPullBack` | `fromScale:6.25`, `toScale:1`, `f:52`, `ease:[0.70,0.10,0.45,0.90]`, `logSpace:true`, `peakOnWordFrame` |
| `SpinSwap` | `deg:90`, `dir:"cw"`, `f:40`, `swapAt:"peak"`, `whoosh:true` |
| `BlurThroughCut` | `outF:6`, `inF:14–15`, `maxBlur:12`, `incomingExposure:.35`, `oversize:1\|2.64`, `subBoom:{onsetF:-8,peakF:+1}` |
| `MaskedRise` | `f:17`, `ease:"enter"`, `stagger:[6,4]`, `maskEdge:"objectBelow"` |
| `HingeFlipIn` | `f:12`, `firstDrawing:.09`, `ease:[0.30,0,0,1]`, `axis:"bottom"` |
| `RecapCollage` | `items:[…14]`, `title`, `f:18`, `stagger:0–6`, `rotIn:±10–30` |
| `NeedleSwing` | `from:-35`, `to:51`, `f:20`, `ease:[0.40,0,0.65,1]`, `return:{to:28,f:12}`, `peakOnStress:true` |
| `EarwormEndCard` | `bg:"#141414"`, `wordmark:"Vox"`, `underline:{color:"#F8F005",w:170,h:16}`, `title:"EARWORM"`, `glitch:{buildF:18,periodF:4,changedF:2}`, `cutOnHit:true`, `noBug:true` |

## 10. Build notes for code (Remotion/React)
1. **Composition.** 1920×1080 at 25 fps. For graphics use `posterize(frame, 25, 12)`; it gives the observed 2,2,…,3 cadence. Fades, blur ramps and `<OffthreadVideo>` stay on ones. Webcam clips play at source rate (do not posterize).
2. **Audio-reactive drivers.**
   - Precompute per-frame features offline: RMS and low/mid/high bands at 25 fps, as in `earworm_features.csv`, plus low-band flux onsets. Ship them as JSON per music cue.
   - Runtime `useAudioData` is fine for previews, but the JSON keeps renders deterministic.
   - Bars: `active = rms(frame + 2) > -12 dBr`; `height_i = idle + rand(seed(i, drawing)) * k * amp(frame + 2)`.
   - Scope: spike at frames where `low_db` rises ≥ 8 dB within 2 f.
3. **Glow.** Draw the bars and scope as SVG lines, then add two blurred copies (σ 8 and 24, opacity .8/.5) in the glow colours, plus a grain overlay masked to the bloom.
4. **Glitch text.** Split the glyph layer into 6–10 horizontal bands. Every 4 frames (2 changed, 2 held), give 30–50 % of the bands x offsets of ±10–60 px and an R/B split of 3–6 px. During the build, reveal letters out of order (W, A R, M, E, O).
5. **Blur-through and zoom-blur.** Use CSS `filter: blur()` for defocus. The zoom-blur needs a radial shader (the epigenetics `ZoomBlurTransition`) on ones. Ramp exposure with `brightness()`.
6. **Spin-swap.** Use one rig rotating 0 → 90° (ease-in-out, 40 f). Collage A sits at 0° and collage B at −90° in world space. Swap visibility at the peak frame, so no blend is needed.
7. **Sound.** Model the mix as a timeline of cues: narration, featured songs, the mono bed, SFX and the archival bus. Apply the §15 handoff rules with gain automation keyed to the same frame numbers as the picture.

## 11. Evidence index
| Path (under `analysis/`) | Note |
|---|---|
| `sheets/earworm/sheet_042–056.png` | every keyframe of segment D reviewed |
| `av/earworm_104.00-112.00 … 152.00-153.72.png` | spectrogram, onsets, words: the boom at 111 s, silence at 120.5–121.3 s, bass hit at 151.24 s |
| `strips/earworm_02776-02799.png` | blur-through cut S21→S22, scraps slide-off, focus/exposure ramp |
| `strips/earworm_03322-03369.png` | record exit, picture-first cut, boombox hinge flip, singer rise |
| `strips/earworm_03574-03597.png` | recap collage fly-in on "ties it all" |
| `strips/earworm_03776-03799.png` | zoom-blur exit, cut on the bass hit, EARWORM glitch build |
| `stills/earwormD/f2850, f2950, f3045, f3120, f3200, f3300, f3410, f3500, f3610, f3700, f3830.png` | native grabs: colours, type metrics, window geometry, bug |
| `stills/earwormD/f3685_half, f3745_half, f3778_half.png` | kinetic type, zoom-blur |
| `stills/earwormD/stereo_midside_f2500-3843.csv` | per frame: mid/side dB, L/R correlation, 5 bands for mid and side (side ≈ music-only proxy, because voices are mono-centred) |
| `stills/earwormD/bars_S22_heights_f2798-2926.txt` | per-frame height (px @640) of the 9 visualizer columns (x@640: 19, 72, 126, 179, 234, 286, 346, 393, 447) |
| `stills/earwormD/scope_S25_amplitude_f3247-3334.txt` | per-frame scope deviation/height in 4 visible zones + blue pixel count |

## 12. Audio–visual sync (every visual event, signed offset in frames, + = visual after audio)
| # | Visual event (frame) | Audio anchor (frame) | Offset | Note |
|---|---|---|---|---|
| 1 | S21 tail: defocus + accelerating pan begins (2777) | sub-boom onset (2775) | +2 | the boom announces the cut |
| 2 | **Cut** S21→S22, blurred and dark (2783) | boom peak −2.2 dBr, 60–75 Hz (2784) | −1 | cut on the boom's peak |
| 3 | Scraps slide off; focus reached (2785–2793) | boom decays 13 dB (2784–2799) | – | the picture settles before the voice |
| 4 | Artist tag readable (2791) | narrator "…and Nat King Cole" (2800–2820) | −10 | the name is on screen before it is spoken |
| 5 | Bars wipe on R→L (2804–2814) | "Nat" (2801); tracker beat (2804) | +3 / 0 | – |
| 6 | Bar burst (2832) | "But" voiced onset (2832) | 0 | the bars hear the voice too |
| 7 | Bars at maximum, 985 px (2844) | song swell +16 dB (2844–2845) | −1 | – |
| 8 | Bars fall idle (2906–2918) | song fade-out (2898–2919) | ≈0 | – |
| 9 | Bar burst (2920) | interviewee 1 onset (2922) | −2 | – |
| 10 | **Cut** to interviewee 1 (2925) | her voice onset (2922) | +3 | J-cut 3 f |
| 11 | Fade to black starts (2997) | "the songs." (2999–3012) | −2 | black at 3015 = last word end +3 |
| 12 | Black frame (3015) | sub thump onset (3015) → digital silence 3026–3031 | 0 | – |
| 13 | **Fade-in starts** (3032) | hard re-entry of narration + bed (3032; strongest onset of the episode) | **0** | – |
| 14 | VU needle starts (3034) | "Their" (3033) | +1 | – |
| 15 | Needle peak +51° (3054) | stressed "awesome," (3049) | +5 | – |
| 16 | Pull-back starts (3052) | "awesome," (3049) | +3 | – |
| 17 | Pull-back peak speed (3079–3081) | "storm," (3079) | 0 | the title word gets the fastest drawing |
| 18 | Props slide in (3087–3112) | "goes much deeper than that" (3088–3121) | ≈0 | – |
| 19 | Pull-back lands (3104) | "deeper" (3101) | +3 | – |
| 20 | **Cut** to interviewee 2 (3156) | her voice onset (3125); "construct" (3151) | +31 / +5 | J-cut, cut on a stressed word |
| 21 | **Cut** to record + credit (3247) | interviewee's last word ends (3246); song intro (≈3243) | +1 / +4 | – |
| 22 | Scope grows in (3247–3259) | song intro | – | – |
| 23 | Scope spikes (3252, 3260, 3275, 3288) | kick onsets (3252, 3261, 3275, 3288) | 0, −1, 0, 0 | – |
| 24 | "YOU'RE" (3265) | vocal onset (3262) | +3 | – |
| 25 | "MY" glitch-in (3271–3277) | "my" (legato, ≈3268–3271) | ≈+1 | low confidence |
| 26 | "AN" (3288) | "an-" + kick (3288) | 0 | – |
| 27 | "GEL" (3311) | "-gel" onset (3316) | −5 | – |
| 28 | Record drops, scope off (3323–3327) | song fade-out begins (3325) | 0 | – |
| 29 | **Cut** to empty stage (3331) | "So," sibilant onset (3342) | −11 | picture first |
| 30 | Boombox hinge flip (3336–3348) | "So," (3342) | −6 | – |
| 31 | Singer rises (3358–3369) | "you have" (3355) | +3 | – |
| 32 | Tuner, record and paper pieces (3371–3381) | "smooth" (3365) | +6 | – |
| 33 | "R" rises (3388–3405) | "soulful" (3388); spoken "R" (3398) | 0 / −10 | letters assemble across the phrase |
| 34 | "&" (3394), "B" (3398–3415) | "&B" (3404) | −10 / −6; ends +11 | – |
| 35 | Roll starts (3426–3430) | "this" (3430); stereo swell in (3429) | ≈0 | – |
| 36 | Roll swap at peak speed (3442–3446) | "DJ" (3440); whoosh peak (3446) | +2…+6 / 0 | – |
| 37 | Roll lands (3466) | "who" (3452) | +14 | the move owns the word; the label follows |
| 38 | "D" rises (3460), "J" (3467) | "who" (3458); "DJ" (3446) | +2 / +14 | – |
| 39 | Hold | stereo music swell peaks on "fades" (3472), drops on "and out" (3484 → −15 dB by 3495) | 0 | the mix acts out the sentence |
| 40 | D/J sink out (3547–3556) | "else" (3544) | +3 | – |
| 41 | Recap fly-in (3576–3594) | "really ties it all" (3569–3598) | +7 start / −4 end | lands before "together" (3597) |
| 42 | Defocus-out (3631) | "The" (3631); low-pass on the new song opens (3631) | 0 | – |
| 43 | Oversized phone appears (3637); **cut** (3640) | "call-ins" (3632–3644) | +5 / +2 | – |
| 44 | Phone settled (3652) | "dedications." (3648–3663) | 0…+4 | – |
| 45 | Handset lifts (3663–3667) | narration ends (3663); pickup click (3668–3672) | 0 / −1 | – |
| 46 | DID 3669, YOU 3672, WANT 3674, TO EAR 3676, SOMETHING ? 3680 | caller syllables 3673, 3675, 3677, 3680, 3684 | −4, −3, −3, −4, −4 | text leads speech |
| 47 | YES (3694); line-feed (3699); second YES (3701) | "Yes," (3698); "yes." (3707) | −4 / +1 / −6 | – |
| 48 | DON'T 3735, STOP 3744, EVER 3751, LOVIN 3757, ME 3764 | sung syllables 3736, 3741, 3749, 3755, 3760–3764 | −1, +3, +2, +2, +4/0 | – |
| 49 | Zoom-blur ramp (3777–3780) | phrase ends (3775); sub swell (3778–3782) | +2 | – |
| 50 | **Cut** to end card (3781) | bass hit, low band +7 dB in one frame (3781) | **0** | – |
| 51 | Glitch steps (3785–86, 3789–90) | HF glitch bursts (3786, 3790) | 0 / −1 | later steps are silent |
| 52 | Last frame (3842) | music still at −5 dBr | – | no fade |

**Rules the data show.**
1. **There is no beat grid.** The 52 events sit a mean 4.31 f from the 85-BPM beats, where random placement gives 4.40 f. They sit 5.67 f from detected audio onsets, against 9.03 f for random placement (p5 6.00). Edits follow **transients** (speech onsets, kicks, hits), not bars.
2. **Graphics that react to music sync at 0 f** (scope on kicks −1…0; bars best-fit −2 f lead). **Captions of sung words: −5…+4 (median ≈ +1.5, n = 9).** **Captions of spoken archival words lead by 3–6 f** (median −4, n = 7): the text appears just before the syllable.
3. **Element entrances driven by narration land 0…+7 f after the word onset** (median +3; n = 11). Exceptions lead the voice: when the shot opens before the narration (picture-first), objects lead by 6–11 f. Names (tag, credit) lead by 10–15 f.
4. **Camera emphasis.** The fastest drawing of a long move falls on the key noun ("storm", 0 f). Moves end 2–3 f after the next stressed word.
5. **Cuts.**
   - Cut to a talking head 3 f after its voice starts (J 3 f). A new interviewee may pre-lap 31 f, with the cut on a stressed word (+5).
   - Cut to music 1 f after the last spoken word.
   - Cut away from a song ≈11 f before the narration (L-cut of the song tail).
   - Cut to the end card on a bass transient (0 f).
6. **Sound design is frame-locked to transitions** at −1…0 f:
   - boom peak at the blur-cut;
   - silence on the black;
   - voice and fade-in on the same frame;
   - whoosh peak on the spin-swap;
   - filter-open on the defocus;
   - bass hit on the end-card cut.

## 13. Sound design
**What plays, per shot.**
| Shot | Narration / voices | Music | Levels | Entrances and exits |
|---|---|---|---|---|
| 22 | narrator "…and Nat King Cole" (2800–2820); probably interviewee 1 "But it was all" (2832–2845) | Nat King Cole song, stereo (side ≈ −30 dB under voice, −22 alone) | song alone f2846–2915: rms −4.2 dBr (p90 −2.5) | song swells 6–8 dB over 15 f after the voice stops (2846–2860); fades out over 21 f (2898–2919), finishing 3 f before the interview voice |
| 23a | interviewee 1, **dry** | none (<120 Hz p5 −20 dB, side −120 dB) | voice mid p50 −8 dBr | webcam audio low-passed ≈10 kHz (10–14 kHz band −59 dB rel. to the voice band; narrator −15) |
| 23b | – | sub thump 3015 decaying 4.7 dB/f | −12 → −59 dBr by 3026; **digital silence 3026–3031** (−82 dBr) | – |
| 23c–24 | narrator; interviewee 2 pre-lapped from 3125 | mono bed, bass only | bed mid p5 −29 dBr against voice mid p95 −2 dBr | hard entry at 3032 (rms −82 → −24 → −10 → −3 dBr in 3 f) |
| 25 | none | Anita Baker "Angel", wide stereo (L/R corr 0.25, side −20 dB) | rms −7.5 dBr (p90 −5.4) | soft intro from ≈3243 (under the last word); vocal + kick at 3261; fade-out over 25 f (3325–3350), starting 17 f before "So," |
| 26 | narrator | mono bass-heavy bed (low p50 −4 dBr, mid p5 −38 dBr); **stereo music swell 3429–3502** under "relaxing DJ who fades in and out" | swell peaks at side −20 dB on "fades" (3472) | swell out on "and out": −15 dB in 11 f (3484–3495); bed tail 3607–3615 |
| 26 end → 27 | narrator "The call-ins and dedications" (3631–3663) | the outro song enters **low-passed** at 3616 (−20 → −2 dBr in 2 f, HF −57 dBr), 15 f before the voice; **low-pass opens at 3631** (HF +20 dB, on the defocus) | song low band −3 dBr | – |
| 27 | archival aircheck: caller "Did you want to [h]ear something?" (3673–3690), DJ "Yes, yes." (3698–3712), song lyric "Don't stop ever loving me" (3736–3775) | same outro song, stereo | phone voices only ≈3 dB over the music in the voice band | – |
| 28 | none | outro continues | −0.3 → +2.7 dBr at 3781–3783 (loudest point of segment D), then −5…−11 dBr | **no fade**: last 50 ms at −15 dBFS |

**Level rules.**
- Narration sits at rms p50 −4…−8 dBr (p90 −1…−3). Featured songs alone sit at the same loudness, −4…−12 dBr.
- Under narration, the voice band of the bed is kept **≥ 25 dB below** the narration peaks (mid p5 −29…−38 dBr). Its bass may stay loud (−4…−15 dBr): the duck is **spectral and arrangement-based**, not a uniform attenuation.
- A song held under a voice line (NKC) is ≈6–8 dB lower than when it plays alone. Release is 15 f.
- Song-out handoffs are fades of 21–25 f that **start before** the next voice:
  - NKC: fade 2898–2919, voice at 2922, so the fade ends 3 f before it.
  - Angel: fade 3325–3350, "So," at 3342, so the fade ends 8 f after it.
- Song-in starts under the last word (−3 f) and reaches full at the first sung note, ≈15 f after the cut.

**SFX inventory.**
| Frames | Sound | Spectrum / level | Accompanies |
|---|---|---|---|
| 2775–2799 | **sub-boom** | 60–75 Hz centroid; onset 2775, peak −2.2 dBr at 2784, −13 dB over 15 f; HF tick at 2781/2783 | blur-through cut 2783 |
| 3015–3026 | **sub thump** into silence | low band only, −12 → −59 dBr | black frame |
| 3032 | hard audio re-entry (not an SFX) | onset strength 1.0 | fade-in start |
| 3443–3457 | **stereo whoosh** | side air band (>8 kHz) −21 → +5 dB, peak 3446 | spin-swap peak |
| 3429–3502 | stereo music swell ("fades in and out") | side low-mid +10…+20 dB | narration verb, not the picture |
| 3616–3631 | **low-pass on music**, then opening | HF −57 → −30 dBr | defocus into the phone shot |
| 3668–3672 | **handset pickup click/rustle** | mono 3.4–20 kHz burst, +30 dB over the floor, 5 f | handset lift 3663–3667 |
| 3673–3712 | **telephone EQ** on caller and DJ | nothing < 200 Hz; +11…+14 dB at 1.2–3.4 kHz rel. 0.6–1.2 kHz; −24 dB at 8–12 kHz | kinetic type |
| 3736–3775 | archival song vocal, muffled | 3.4–5 kHz −24 dB, 5–8 kHz −32 dB rel. the voice band | one word per cut |
| 3775–3782 | **dip + sub swell + bass hit** | −17 dBr dip (3777), sub rising 3778–3782, low +7 dB at 3781 | zoom-blur + end-card cut |
| 3786, 3790 | **glitch static bursts** | HF −55 → −41 / −37.5 dB | first two logo glitch steps |
| – | **not found** | no vinyl crackle on the record shots (HF crest factor ≈4, ≤ 1 % impulsive windows); no risers apart from 3778–3782; no scratches | – |

**How the episode ends.**
1. The last narration ends at f3663.
2. 4.5 s of **archival radio** take over, each piece filtered differently: phone band-pass for caller and DJ, a muffled song vocal.
3. A 6-frame breath follows (3775–3780).
4. The cut to the end card lands on the outro's **bass hit**.
5. The logo glitches in with two static ticks.
6. The **music is never faded**: the file ends mid-groove at −5 dBr.

There is no voice-over sign-off and no music sting. The outro song itself is the end theme.

## 14. Visualizer / audio-reactive graphics
| Graphic | Driver | Lag | Mapping | Evidence |
|---|---|---|---|---|
| **Spectrum bars** (S22) | **full-mix loudness**, voice included (no single band: low r 0.47, high 0.34) | visual **leads 2 f** (r 0.79 at −2, 0.61 at 0) | 9 columns at x 57, 216, 378, 537, 702, 858, 1038, 1179, 1341 (pitch ≈160). **Gate:** 83 % of drawings have an active bar when rms ≥ −12 dBr, 8 % below. Heights are independent per column (mean inter-column r 0.07): **random per bar × envelope**. Idle dot ≈65 px tall; active 100–1000 px, centred on y≈700; on twos | `stills/earwormD/bars_S22_heights_f2798-2926.txt`; bursts at 2832 (voice), 2844 (swell), 2920 (voice) |
| **Oscilloscope line** (S25) | **kick drum**: low band (<200 Hz) rising ≥ 8 dB | 0 f (−1…0) | idle wobble ±5–15 px; zig-zag spikes 75–600 px peak-to-peak, held one drawing (2–3 f); r 0.49 with low-band amplitude at lag 0, ≤ 0.15 at ±2 | spikes 3252, 3260, 3275, 3288 = kicks; burst 3292–3299 |
| VU needle (S23) | **none**: keyframed | – | smooth −35° → +51° in 20 f while rms swings ±5 dB unrelated; peak placed on the stressed word (+5 f) | §7 |
| Lyric captions (S25) | sung vocal | −5…+3 | one word per syllable group, RGB glitch-in 2–6 f | #24–27 |
| Kinetic voice type (S27) | archival speech / song | speech −6…−3; song −1…+4 | one word per drawing; spelling follows pronunciation | #46–48 |
| End-card glitch (S28) | its own clock (period 4 f), plus 2 SFX ticks | 0 | – | #51 |

**The "flicker cluster" at 120–122.5 s is not a flicker.** The auto-detector flagged soft transitions at f3006–3013, 3036–38, 3041–45, 3050–54, 3056–58 and 3062–64. These are the **linear fade-out (18 f) and fade-in (36 f)** around the black:
- Luma is strictly monotonic: 58.8 → 0, then 7.1 → 139.3.
- The fade-in coincides with the camera starting to pull back (zoom 0.992 → 0.964/frame).
- Nothing in it is driven by audio.

## 15. Rules for the kit (numeric, implementable)
1. **Sync to onsets, not to a BPM grid.** Detect speech and kick onsets (mid band +6 dB within 2 f, low band +8 dB) and snap events to them. Don't quantise to bars.
2. **Narration-driven entrance:** `start = wordOnset + 3 f` (allowed 0…+6). For a long move, put its **peak velocity on the key noun** (0 f) and end it on the next stressed word (+3 f).
3. **Picture-first shot openings:** cut 11 f before the first syllable and bring the hero object in at −6 f. Use this only on paragraph starts.
4. **Names before sounds:** show artist and song tags or credits 10–15 f before the name is spoken or the vocal starts.
5. **Captions of archival speech:** pop each word **4 f before** its syllable onset (range 3–6), one drawing, spelled as heard. **Sung words:** 0…+3 f after the onset.
6. **Talking-head cuts:** voice leads the picture by 3 f (default). The first line of a new interviewee may pre-lap ≤ 31 f, with the cut on a stressed word (+5 f).
7. **Music vs voice handoff.**
   - Never play a featured song under narration.
   - Song out: 21–25 f fade starting 17–24 f before the voice and ending within −3…+8 f of its first syllable.
   - Song in: start the intro under the last word (−3 f); first note ≈15 f after the cut.
   - Bed under voice: voice band ≥ 25 dB below narration peaks; bass allowed at −4…−15 dBr.
   - Song held under a short line: −6…−8 dB, release 15 f.
8. **Transition sound locks.** Each sound sits within −1…0 f of its picture event:
   - `BlurThroughCut`: boom onset −8 f, peak at cut +1, −13 dB over 15 f.
   - `SpinSwap`: whoosh peak on the swap frame.
   - `DipToBlack`: thump on the first black frame, 6 f of true silence, then picture and voice restart on one frame.
   - End card: cut on a bass transient.
   - Defocus: open a low-pass on the same frame.
9. **Act break = `DipToBlack`.** 18 f out (over the last 2 words, black at last word +3), 17 f black, 36 f in. Use it at most once per film.
10. **Audio-reactive defaults.**
    - `SpectrumBars`: gate −12 dBr; per-bar random heights × full-mix envelope; render with a **2 f look-ahead**; posterize to 12 dr/s.
    - `KickScope`: spike when the low band rises ≥ 8 dB; 0 f lag; hold 2 f.
    - Meters and needles: keyframe, don't drive. Swing 20 f `(0.40, 0, 0.65, 1)` and peak on a stressed word.
11. **Literal mix moves.** When the script names a sound behaviour ("fades in and out", "quiet"), automate the bed to match with 0 f offset: fade in on the verb, fade out on its counterpart (−15 dB / 11 f).
12. **Ending recipe.**
    1. The last narration line names the next device.
    2. 4–5 s of archival material as giant kinetic type (phone EQ: HP 200 Hz, +12 dB at 1.2–3.4 kHz).
    3. A 6 f dip.
    4. A 4 f zoom-blur, then a hard cut to the series card on the outro's bass hit.
    5. 18 f glitch build, with SFX ticks on the first 2 steps, then a 4 f glitch period.
    6. Music runs to the last frame (no fade, no VO), and the bug is removed on the card.
13. **Cadence.** Graphics run at 12 dr/s on 25 fps (2,2,…,3). Fades, blurs and footage run on ones. Webcam footage runs at native fps.
