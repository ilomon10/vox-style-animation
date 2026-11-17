# Vox "Earworm: Quiet Storm", segment B: look, motion and audio–visual sync (`earworm`, f791–1739, 31.64–69.60 s)

> Analyst: B. Sources reviewed: keyframe sheets `sheets/earworm/sheet_011–023`, AV timelines `av/earworm_024.00-032.00 … 064.00-072.00`, 14 full-rate strips, 12 native grabs + 3 crop sheets (`stills/earwormB/`), `metrics/earworm.csv`, `audio/earworm_{words,phrases,rhythm}.json`, `earworm_features.csv`.
> I also ran my own **mid/side analysis** of `audio/earworm_full_stereo48k.wav` (M=(L+R)/2, S=(L−R)/2; 40 ms Hann window, 10 ms hop, bands <120 / 120–300 / 300–1k / 1–3.4k / 3.4–8k / 8–16 kHz). Source is 1920×1080, so source px = @1080p. 25 fps. Frames are GLOBAL. "Offset" = visual frame − audio frame (positive = visual after audio). dBFS values are mid-channel RMS (40 ms windows). "≈" = estimate.

**Two corrections to the shared data. Read these before using the sheet labels.**
1. **Whisper word starts are off by up to ±16 f.** I re-measured every anchor below from the 10 ms voice-band envelope. Corrections (whisper → measured):
   - "Washington" f867 → **f860.5**
   - "George" f1013 → **f1024.0**
   - "post" f1126 → **f1132.5**
   - "urban" f1160 → **f1176.5** (soft onset; loud syllable f1182.5)
   - "At" f1619 → **f1625.0**
   - "Fredara" ("for Dara") → **f1235**
2. **The global 85 BPM grid (|B, |D on the sheets) does not fit this segment.** Tempos measured on the side channel, which carries only the music:
   - Chocolate City bed under narration: ≈77 BPM (acf peak at 155).
   - Song instrumental f955–1012: **108.3 BPM**, 13.86 f per beat, beats at f962.2, 976.1, 990.0, 1003.8, 1017.7.
   - Bed f1152–1330: **95.5 BPM** (acf 0.72); hi-hat 8ths every **7.91 f**.
   - All beat-sync claims below use these local grids.

## 1. Summary of the look (what is new compared with `epigenetics.md`)
- **Full-frame 16:9 dark collage instead of a 4:3 paper desk.** There is no pillarbox. The ground is near-black #0A0A0A with a faint, static newsprint texture (luma 4–17). The Vox bug sits exactly where it did in Epigenetics (x1716–1888, y31–114, #CECECE), but it is now drawn over the picture.
- **Black-and-white archive and one accent.** Photos are desaturated cut-outs (sat 0.01–0.05) with torn white paper edges (#E1E3E5). The only colour is a **periwinkle blue #656ED8**: all display type, X bullets, arrows, the radio cable and the vinyl label. Hand marks are white. The two Zoom interviews are the only colour footage (sat 0.11, warm +9.8).
- **Type is condensed bold caps in blue** (Oswald-like), used as titles, names and single kinetic words. A serif appears only in the name card. Supporting display faces:
  - "WHUR": giant black ultra-condensed letterpress.
  - "J A Z Z": distressed white wood type.
- **Every scene is built to the word.** Word-by-word kinetic type follows an interviewee's stresses. Typewriter titles complete just before the spoken title. Name cards resolve while the surname is spoken.
- **New devices.** None of these appear in Epigenetics:
  - typewriter with per-letter slide-in
  - random-letter decode name cards
  - photo slam plus torn-edge boil
  - circle crop with the hat breaking out of the mask
  - white-glitch word swaps
  - tumbling collage that reassembles into a radio
  - dip-to-black chapter break with a matched dip to digital silence
  - pull-out-through momentum cuts
  - blue electric beam keyed to an archival song vocal
- **Cadence.** Shot 4 runs at **12 drawings/s** (twos with an occasional 3). Shots 5c, 7 and 8 run at **≈10 drawings/s** (2-3-2-3 holds). The Zoom videos keep their native low frame rate (≈7–14 fps).
- **Sound is edited as hard as the picture.**
  - Narrator and interviewees are loudness-matched at −21.5 dBFS.
  - Beds sit 7–19 dB under the voice.
  - The music is **killed** for the expert's key line and re-enters on its stressed word.
  - Song excerpts are cut in, not faded. Next-scene music pre-laps the cut by 4–6.5 f.
  - SFX are almost absent: two ticks and one reverb throw in 38 s.

## 2. Shot log
Auto-shots 4–8, split into sub-scenes at in-shot transitions.

| Shot | f (t) | Content / composition | Layers back→front | Motion | In / out |
|---|---|---|---|---|---|
| 4a | f791–857 (31.64–34.28) | Torn cut-out of the Parliament band photo, centred over a black vinyl record. Album art (DC badge, "PARLIAMENT" arch) dissolves in behind the band f797–810. Newsprint strips bottom-left | ground → vinyl (rotating ≈4–5°/f, baked-in sheen) → album art → band cut-out → newsprint | Settle 0.980, 0.983, 0.987/drawing (f795–799), then linear pull-back **0.997/drawing (−3.5 %/s)**. Accelerates f849–857 (0.996→0.980) | in: **pull-out-through** from S3, whose photo pulls back 0.998, 0.990, 0.959 per drawing f785–789. Out: zoom-out burst |
| 4b | f858–963 (34.32–38.52) | DC collage: Capitol, flag, White House, vinyl, car, Clinton-with-boombox photo, row houses, newsprint, a defocused foreground figure at the left edge. Blue "CHOCOLATE" over a staggered "CITY", a white X bullet, a white ring round CITY. From f924 a blue electric beam crosses at text height | ground → cut-outs → type → ring → beam (additive glow) → blurred foreground figure | The album shrinks into the collage f862–877 as pieces arrive about one per drawing. Zoom-out ×0.596 over f876–918, decelerating, `(0, .10, .40, 1.10)`. Static f918–963 | in: in-shot zoom-out reveal. Out: photo slam |
| 4c-1 | f964–1004 | One torn photo of Clinton, replaced by 5 different photos/crops | ground → photo | Slam (2 drawings); torn edge re-cut every drawing f968–975; swaps at f989, 991, 997, 1001 | out: circle-crop morph |
| 4c-2 | f1005–1134 | Clinton in a circle (Ø≈615 px, centred; graph-paper backing) with the hat breaking out above the mask. "GEORGE" (small) over "CLINTON" (large) at the left. "X PARLIAMENT / BAND / LEADER" label and blue arrow at the right | ground → circle → photo → hat (above the mask) → type | Settle ×0.935→1.009 (f1005–1012). **Push-in ×1.674** f1062–1112, `(.85, .10, .05, 1.00)`, peak +14.7 %/drawing at f1085, subject panned 520 px left. Second accelerating push f1124–1134 (1.006→1.041/drawing) | out: push into a jump |
| 4d | f1135–1223 | One blue word at a time, centred on the dark newsprint ground: POST - INDUSTRIAL → BLACK → URBAN → EXPERIENCES (underlined) | ground → word | The circle slides out left (3 drawings, f1135–1141). Words pop and swap; otherwise static (86 % held frames) | out: hard cut |
| 5a | f1224–1332 | Zoom video of Fredara Hadley, smiling and silent, in a rounded window (x175–1035, y155–930, r≈20 px). Name card at the right | flat #0C0C0C → video → card | Video at native fps. Card decode f1224–1246. X plus fade f1328–1332 | in: hard cut. Out: **dip to black** |
| 5b | f1333–1341 | Black (9 f) | – | – | – |
| 5c | f1342–1480 | Collage: Capitol, row houses, newsprint, car, scribble, blue "19" and "76". It becomes a boombox radio with mic stand, blue cable and jack, vinyl with a blue label, the dome, newsprint strips | ground → collage → numerals | Fade-up 8 f. Numerals glitch out f1351–1359. The cluster shrinks to 0.52× linear while rotating ≈−20° (f1350–1378), flips ≈180° in 8 f (f1378–1386) as pieces swap into the radio, then grows back. Pop-ons one per drawing f1396–1411, then drift | out: hard cut |
| 6 | f1481–1618 | Zoom video of Angela Stribling, speaking, centred (≈x480–1460, y90–990). Her card is clipped by the right frame edge and already decoding out | black → video → card | Video ≈14 fps. Card gone by f1493 | J-cut in (voice 2 f early); hard cut out |
| 7 | f1619–1696 | "WHUR" in giant black letters (cap ≈445 px, full width) over newsprint printed with "96.3" | paper → letters | Linear pull-back 0.9986/drawing (≈−1.4 %/s) at 10 drawings/s. Accelerates f1690–1696 (0.997, 0.985, 0.964) | out: **pull-out-through** |
| 8 | f1697–1739 | Distressed white "J A Z Z" converging round a Miles Davis trumpet cut-out; white spark marks at the bell | black → letters → photo → sparks | Pull-out continues (0.893, 0.924, 0.930 f1699–1704), then pushes 1.022→1.005 (f1706–1715) while rising (ty −28→−4 px). Letters track in f1697–1716. Sparks re-drawn every drawing f1706+ | out: keyword cut to "SPEECHES" (f1740, segment C) |

## 3. Color
| Token | Hex | Role / evidence |
|---|---|---|
| ground-collage | #0A0A0A (top #080606) | Collage ground; static newsprint texture at luma 4–17 (f905, f1150) |
| ground-interview | #0C0C0C, std 0 | Flat plate behind the Zoom windows; no grain (frame diff 0.00, f1252/1253) |
| **accent-blue** | **#656ED8** (#646EDA f905, #666ED7 f1250) | All display type, X bullets, arrows, cable, vinyl label; small anti-aliased type reads #7A7FDC |
| numerals-blue | #5C63C3 | "1976" (f1349, last frame of the fade-up; may read slightly dark) |
| mark-white | #D0CCC9 (X), #CDD3D7 (ring) | Hand-drawn X bullet (84×131 px), ring 3–5 px |
| paper-white | #E1E3E5 | Torn paper borders and backing cards |
| serif-grey | #C5C5C5 / #C2C2C2 | Name-card title and affiliation |
| label-grey | #A5A5A5 | "PARLIAMENT BAND LEADER" |
| ink-black / newsprint | #202023 on #ECECEC | WHUR shot |
| woodtype-white | #D7D7D5 | "J A Z Z" |
| logo | #CECECE | Vox bug, unchanged |

**Grade.**
- Photos are fully desaturated, with crushed blacks and bright paper whites. Contrast comes from cut-out against black.
- Saturation lives only in the blue accent and in the two colour interviews.
- There is no chromatic aberration and no animated grain on the interview plates. The collages carry a static print texture rather than film grain.
- The blurred foreground figure in 4b gives depth of field (σ≈15–25 px) without camera parallax.

## 4. Typography
| Style | Role / examples | Case | Cap @1080p | Weight / class | Tracking | Colour | Reveal | Commercial ≈ | Google ≈ |
|---|---|---|---|---|---|---|---|---|---|
| Display condensed | Titles and kinetic words: CHOCOLATE / CITY, POST - INDUSTRIAL, BLACK, URBAN, EXPERIENCES, GEORGE / CLINTON | CAPS | 124 (f905), 88 (f1150) | Bold condensed grotesque; letter width ≈0.5 cap, gaps ≈0.11 cap | 0 | #656ED8 | Typewriter (1 letter / 2 f) or whole-word pop | Trade Gothic Bold Cond. No.20 / Alternate Gothic | **Oswald 600–700** |
| Name | "FREDARA HADLEY" | CAPS | 64 (f1250); line 559 px | same | **+1 em → 0** during the build | #666ED7 | Tracking-in plus random-letter decode | same | Oswald 600 |
| Name-card title | "Ethnomusicologist" | Sentence | 40 | Text serif, regular | 0 | #C5C5C5 | Decode | Tiempos Text / Lyon | Source Serif 4 / Newsreader |
| Name-card affiliation | "The Juilliard School" | Sentence | 27 | Serif italic | 0 | #C2C2C2 | Decode | same italic | same italic |
| Annotation label | "PARLIAMENT / BAND / LEADER" | CAPS | 50–57 at ×1.67 push (≈32 before it) | Light/regular condensed | wide (≈+0.2 em) | #A5A5A5, blue X | Left→right type; LEADER is wiped right→left with its arrow | Oswald Light | Oswald 300–400 |
| Station display | "WHUR" | CAPS | ≈445 | Ultra-bold condensed, letterpress grain | tight | #202023 | Present at the cut | Knockout / Compacta | Anton |
| Wood type | "J A Z Z" (and "S PEE CHE S" in C) | CAPS | ≈90–120 | Distressed condensed | from ≈+3 em to tight | #D7D7D5 | Letters converge | wood type | Anton plus a distress mask |
| Hand marks | X bullet, ring, underline, arrow | – | X 131 px tall | Marker / pen | – | white or blue | 2–8 f draw-on, or a pop | – | SVG paths |

**Rules.**
- One blue type voice for everything spoken, used as the key word: never a sentence.
- The serif appears only in name cards.
- Labels are grey, light and tracked.
- No boxes, tapes, shadows or outlines on type: the type sits directly on black.

## 5. Layout & composition
- **Centred hero on black.** Each composition places one hero (cut-out, circle, word) at the frame centre, typically 30–55 % of the frame width:
  - album cut-out ≈770 px (40 %)
  - Clinton circle Ø≈615 px
  - kinetic words 300–750 px wide on the centre line, y≈500–590
- **Collage clusters overlap.** Pieces overlap by 10–40 % at 0–10° tilts. The cluster fills ≈70 % of the width (4b), and the frame edges stay mostly empty black. The only edge-cropped element is the blurred foreground figure.
- **Interview layout.**
  - Window on the left half: x175–1035, 860×775, about 10:9, rounded r≈20 px.
  - Name block left-aligned at x1146, baselines at y≈511 / 577 / 635.
  - Angela's window is centred instead, so her card overflows the right edge.
- **Title layout.** Two lines are staggered: line 1 spans x314–1002 (y478–602); line 2 starts 71 px after line 1 ends (x1073) and 47 px (≈0.4 cap) below its baseline. An X bullet sits left of line 1. The ring wraps line 2.
- **No parallax inside the collage.** Depth comes only from the defocused foreground figure (4b) and the hat breaking out of the circle mask (4c-2).

## 6. Textures & materials
| Item | Measurement | How to generate |
|---|---|---|
| Dark newsprint ground | Columns of body text at luma 4–17 on #0A0A0A; static per shot; no measurable vignette (corner luma 9–11) | Tiled newsprint scan, multiply at 6–8 % on #0A0A0A |
| Torn paper edge | White border ≈10–30 px, ragged ≈±6–10 px. In 4c-1 the tear is re-cut every drawing (f968–975) | SVG displacement (feTurbulence 0.04, scale 12) on a white rect behind the photo; re-seed per drawing for a boil |
| B&W archive photo | Desaturated, high contrast, paper-white highlights | `filter: grayscale(1) contrast(1.15)` |
| Vinyl with baked sheen | The sheen wedge rotates with the record ≈4–5°/f (≈19 rpm) | Rotate one PNG that includes the highlight |
| Electric beam | Horizontal plasma line: blue core (lum 186–199) plus a soft glow ±60–80 px; wiggle amplitude (y std) 4→19 px | Additive blurred noise-displaced stroke, re-randomised every drawing |
| Glitch flicker | 2–5 random letters turn white per drawing for 2–5 f | Per-letter colour toggle with a seeded random per drawing |
| Interview window | Video, rounded corners r≈20 px, no visible border or shadow | `border-radius:20px; overflow:hidden` |

## 7. Motion language
**Stepping** (from `mad_lo` intervals between changed frames):

| Scene | Intervals (f) | Drawings/s |
|---|---|---|
| 4a | 2×28, 3×2 | 12.1 |
| 4b | 2×46, 3×4 | 12.0 |
| 4c-1 | 2×17, 3×1 | 12.2 |
| 4c-2 | 2×48, 3×5 | 10.7 (incl. holds) |
| 5c | 2×32, 3×15, 4×5 | 10.2 |
| 7 | 2×17, 3×10 | 10.1 |
| 8 | 2×7, 3×8 | 9.9 |
| 6 (video) | 1×42, 2×25 | ≈14 |

Phase slips occur at f806–808 and f832–833, where a pre-comp is offset. The camera steps with the drawings.

| Motion | Evidence (f) | Duration | Profile / numbers | Ease → recommended |
|---|---|---|---|---|
| Typewriter title | CHOCOLATE f876–891; CITY f887–899 | 15 f; 12 f | 1 letter / 2 f (12.5 /s) for line 1; 1 / 4 f for line 2 | linear in letters |
| Typewriter with slide | GEORGE f1020–1032; CLINTON f1033–1047 | 12 f; 14 f | Each new letter appears ≈1 letter-width right of its slot and snaps in on the next drawing | step + 1-drawing snap |
| Label type-on | PARLIAMENT f1072–1091; BAND pops f1080; LEADER wipe R→L f1083–1093 with its arrow | 19 f | 1 letter / 1.9 f | linear |
| Kinetic word pop | POST f1135, "-" f1139, INDUSTRIAL f1143, BLACK f1155, URBAN f1178, EXPERIENCES f1197 | 1 f | Hard pop, no scale or fade. A swap is preceded by 2–4 f of white-letter flicker (f1151–1154, f1195–1196) and followed by 3–5 f of flicker | step |
| Underline draw | f1201–1203 | 3 f | Left→right under EXPERIENCES | linear |
| Ring draw-on | f903/905–911 | 6–8 f | ≈1/8 perimeter per frame: starts bottom-left, clockwise, overlapping close | ease-out |
| Name-card decode | f1224–1246 | 22 f | Name tracking +1 em→0 (FREDARA ≈690→290 px wide). Missing letters fill in random order; the serif lines decode from scattered glyphs. Complete at f1243–1246 | ease-out tracking `(.16,1,.3,1)` + random fill |
| Name-card exit | Fredara f1328–1332 (X in 2 strokes + global fade); Angela f1481–1493 (random dropout) | 5 f; 12 f | Reverse decode | – |
| Album-art dissolve | f797–810 | ≈13 f | Region luma .18, .40, .53, .64, .77, .87, .93, .97, .99 per drawing (mixed with the pull-back) | ease-out opacity — **the only opacity fade inside a shot** |
| Photo slam | f964 photo on top → f966 collage half gone → f968 clean | 4 f | 2 drawings | step |
| Torn-edge boil | f968, 970, 972, 974 | 8 f | New tear and crop each drawing, then hold | step |
| Circle-crop morph | Rectangle f1001 → partial circle f1003 → circle f1005; scale 0.935 → 1.008 → 1.009 → 1.001 (f1005–1012) | 4 f + 7 f settle | +0.9 % overshoot | pop `(.45,.2,.4,1.2)` |
| Collage zoom-out reveal | f862–877 burst (≈1 new piece per drawing), then f876–918 | 15 f + 42 f | Per-drawing zoom 0.949 → 0.999. Progress .16, .37, .55, .69, .79, .87, .93, .98 at t .05, .17, .26, .36, .45, .55, .64, .76 | fit `(0, .10, .40, 1.10)` → **(0, .1, .4, 1)** |
| Push-in on subject | f1062–1112, ×1.674 | 50 f / 2.0 s | Progress .05 @.22, .22 @.37, .59 @.47, .83 @.55, .92 @.63, .98 @.78 | fit **(.85, .10, .05, 1.00)** (expo in-out) |
| Accelerating push / pull into a jump or cut | f1124–1134 (1.006→1.041); f1690–1696 (0.997→0.964); S3 f785–789 (0.998→0.959) | 6–10 f | Ease-in | `accelerate (.6,0,1,1)` |
| Slow drift | 4a −3.5 %/s; 7 −1.4 %/s; 5c rotation drift | whole hold | linear | linear |
| Tumble reassembly | f1350–1401 | 51 f | Scale 1 → 0.52 (f1378) → 0.80 (f1401). 180° flip in f1378–1386. Pieces swapped every drawing | ease-in, then ease-out |
| Pop-on assembly | Cable f1396, vinyl+dome f1398, mic f1402–1405, newsprint f1405–1411 | 1 drawing each | One element per drawing | step |
| Letters converge | J-A-Z-Z f1697–1716 | 19 f | Spacing ≈3× → tight | ease-out |
| Glitch-out numerals | "19 76" f1351–1359 (white blocks linger to f1371) | 8 f | Block dropout | step |

**Layering rule (same as in Epigenetics).**
- Labels type on during a push: PARLIAMENT during ×1.67.
- A word pops during a jump: POST.
- Type writes on during the zoom-out settle: CHOCOLATE CITY.

**New compared with Epigenetics.**
- Hard pops, flicker and glitch.
- A real opacity dissolve: the album art.
- Long static holds in the kinetic-word section (86 % held frames).

## 8. Transitions
| Type | Instance | Frame by frame | Length | Trigger | Build |
|---|---|---|---|---|---|
| **Pull-out-through cut** | S3→4a (f791) | f785–789: photo zooms 0.998, 0.990, 0.959 per drawing and its white print edges appear. **Cut f791**: the same photo as a smaller torn cut-out continues pulling back at 0.980, 0.983, 0.987, then 0.997/drawing | ≈14 f | Narrator's next phrase, −1 f | `accelerate` tail + `settle` head; match the image across the cut |
| Pull-out-through cut | 7→8 (f1697) | f1690–1696: 0.997, 0.985, 0.964. **Cut**: 0.893, 0.924, 0.930, then reverses to 1.02 push | 13 f | Keyword "jazz" (0 f); the music pre-laps from f1690.5 | same |
| In-shot zoom-out reveal | 4a→4b (f858–918) | Accelerating pull f849–860. f862 vinyl edge, f864 flag + White House, the album shrinks onto the White House; f868 album gone; f870 car; f872 Clinton photo; f874–876 Capitol + newsprint. Settle to f918 | 70 f | Music hit f855.25 → narrator f860.5 → burst | Camera zoom-out + 1 new piece per drawing |
| Photo slam | 4b→4c-1 (f964) | Hero photo appears on top (f964), collage removed (f966–968) | 4 f | Music beat f962.2 (+1.8) | Z-order swap over 2 drawings |
| Circle-crop morph | 4c-1→4c-2 (f1001–1005) | Torn rectangle → partial circle → circle; the hat stays outside the mask | 4 f | Beat f1003.8 | Animated `clip-path: circle()` + an unmasked hat layer |
| Push-into-jump | 4c-2→4d (f1124–1135) | Label dims and un-draws while the push accelerates; f1135 jump: circle at the left edge, POST at centre | 11 f | Word "post" (+2.5) | Accelerating push, then hard reposition |
| **Dip to black (A/V)** | 5a→5c (f1328–1349) | Picture: fade f1328–1332 (5 f), black f1333–1341 (9 f), fade-up f1342–1349 (8 f). Audio: fade f1330–1334, **digital silence f1334.5–1341.75**, fade-up f1341.75–1349.75 | 22 f | Chapter break; narrator re-enters f1352.75 | opacity on ones + a matching gain envelope |
| Hard cut | f1224, f1481, f1619, f1740 | – | 0 f | Speaker change / keyword (§12) | `<Series>` |
| **Not present** | – | No whip-pans, page turns, radial blur or cross-dissolves between designed shots. The only fades are the chapter dip and the album-art dissolve | – | – | – |

## 9. Reusable components
| Component | Props (defaults from the measurements) |
|---|---|
| `DarkCollageGround` | `color:"#0A0A0A"`, `newsprint:{opacity:.07, blend:"multiply"}` |
| `TornCutout` | `src`, `grayscale:1`, `border:{color:"#E1E3E5", w:10–30, rough:8}`, `boil:{drawings:4, everyF:2}` |
| `TypewriterTitle` | `lines:[{text, x, y}]`, `font:"Oswald 700"`, `cap:124`, `color:"#656ED8"`, `rate:{line1:2, line2:4}` (f/letter), `startOn:"preceding word"`, `finishBeforeWordF:0–1`, `bullet:"X"` |
| `SlideTypewriter` | `rate:2` f/letter, `enterOffset:"1 letter width right"`, `snapF:2` (GEORGE / CLINTON) |
| `KineticWord` | `words:[{text, stressF}]`, `cap:88`, `centre:true`, `popAt:"stress + 0…+2 f"`, `flickerOut:{f:2–4, letters:"random 2–5", color:"#FFFFFF"}`, `flickerIn:{f:3–5}`, `underline:{drawF:3}` |
| `HandRing` | `color:"#CDD3D7"`, `stroke:4`, `drawF:6–8`, `start:"bottom-left"`, `dir:"cw"`, `overlap:.08`, `endOn:"second key word"` |
| `CircleCrop` | `d:615`, `popOut:"hat layer above mask"`, `morphF:4`, `overshoot:1.009`, `backing:"graph paper"` |
| `NameCard` | `name`, `title`, `org`, `nameFont:"Oswald 600 64px #666ED7"`, `serif:"Source Serif 4 40px #C5C5C5"`, `italic:"27px #C2C2C2"`, `trackingFrom:"1em"`, `buildF:20`, `decode:"random fill"`, `exit:{x:true, f:5}` |
| `AnnotationLabel` | `lines:["PARLIAMENT","BAND","LEADER"]`, `font:"Oswald 300"`, `color:"#A5A5A5"`, `bullet:"X blue"`, `arrow:{color:"#656ED8", drawF:6, dir:"toward subject"}`, `typeRate:2`, `exit:{dim+undraw, f:8}` |
| `PhotoSlam` | `inF:4`, `onBeat:true` |
| `TumbleAssemble` | `scaleTo:.52`, `flipDeg:180`, `flipF:8`, `swapEvery:"drawing"`, `popOns:[...]`, `rate:10` drawings/s |
| `ElectricBeam` | `y:"text centre"`, `color:"#656ED8"`, `glow:70`, `envelope:{attackF:19, release:"vocal end + 3 f"}`, `boilEvery:2` |
| `SparkBoil` | `anchor:"trumpet bell"`, `strokes:3–5 zigzags`, `color:"#FFFFFF"`, `redrawEvery:2–3`, `amp:"music level, lag 2–3 f"` |
| `ZoomWindow` | `w:860`, `h:775`, `radius:18`, `x:175`, `y:155`, `plate:"#0C0C0C"`, `video:"native fps"` |
| `ChapterDip` | `outF:5`, `blackF:9`, `inF:8`, `audio:{outF:4, lag:2, silence:true, inF:8}` |

## 10. Build notes for code (Remotion/React)
1. **Composition.** 1920×1080 @ 25 fps, full frame. Draw the Vox bug over the picture. Use two drawing grids:
   - `posterize(frame, 25, 12)` for collage shots;
   - a 2-3-2-3 hold table (≈10 drawings/s) for the radio, WHUR and JAZZ scenes;
   - interview video in `<OffthreadVideo>` at its own rate.
2. **Word timeline first.** Drive every key event from a `words[]` track (stress frame per word), **not** from transcript word starts. In this segment, whisper starts were 6–16 f off on 6 of 25 anchors. Keep a manual `stressF` override per keyword.
3. **Kinetic words.** One centred `<KineticWord>` slot. Each entry has `{text, popF, flickerOutF, flickerInF}`. Use a seeded random per drawing for the white letters. No easing.
4. **Typewriter.** Reveal letters with `Math.floor((d - start)/rate)`, using the drawing frame `d`. For the slide variant, render the newest letter at +1 letter width for one drawing.
5. **Name card decode.** Render the final string. For each glyph, choose a reveal drawing (shuffle within the build window) and interpolate letter-spacing from 1 em to 0 with `ease("enter")`.
6. **Circle crop with pop-out.** Two copies of the photo: one clipped by `clip-path: circle(r)`, the other clipped by a hand-painted hat matte above the circle.
7. **Beam and sparks.** These are keyed envelopes, not FFT visualisers (§14). Generate them procedurally per drawing: noise-displaced stroke plus glow. Scale their amplitude with a hand-set envelope or a smoothed (≥10 f) RMS.
8. **Audio.** Mix in Remotion with `<Audio volume={f => …}>` gain envelopes:
   - dips: 4–8 f linear ramps in dB;
   - music kill: a 1-frame cut;
   - pre-lap: start the next cue 4–7 f before the `<Sequence>` cut.
   Keep the voice at −21.5 dBFS and the beds −10 to −15 dB below it (§13).

## 11. Evidence index
| Path (under `analysis/`) | Note |
|---|---|
| `strips/earworm_00784-00813.png` | S3→4a pull-out-through, album dissolve, settle |
| `strips/earworm_00850-00897.png` | Silence → hit → zoom-out reveal; CHOCOLATE / CITY typewriter |
| `strips/earworm_00898-00945.png` | CITY ring; song entry; beam build |
| `strips/earworm_00946-00993.png` | Beam hold/release; photo slam; torn-edge boil; swaps |
| `strips/earworm_00994-01041.png` | Swaps on the 108 BPM grid; circle morph; GEORGE / CLINTON type |
| `strips/earworm_01042-01089.png` | Push-in; PARLIAMENT label and arrow |
| `strips/earworm_01090-01137.png` | Label hold and exit; push-into-jump; POST |
| `strips/earworm_01138-01185.png` | Dash, INDUSTRIAL, flicker swap to BLACK, URBAN |
| `strips/earworm_01186-01233.png` | EXPERIENCES and underline; cut to Fredara; card start |
| `strips/earworm_01234-01257.png` | Name-card decode completing on "Hadley" |
| `strips/earworm_01318-01365.png` | X plus dip to black; fade-up; 1976 glitch-out |
| `strips/earworm_01366-01413.png` | Tumble and radio assembly, pop-ons |
| `strips/earworm_01472-01501.png` | J-cut to Angela; card decode-out |
| `strips/earworm_01692-01739.png` | WHUR pull-out-through → JAZZ; sparks |
| `stills/earwormB/f0812 … f1720.png` | 12 native grabs used for colour and type metrics (exact seek: local s = f/25 − 31.64) |
| `stills/earwormB/rays_f826-852.png` | Vinyl sheen rotation (not audio-reactive) |
| `stills/earwormB/cs_ring_city_f902-913.png` | Ring draw-on, frame by frame |
| `stills/earwormB/cs_leader_arrow_f1081-1094.png` | LEADER wipe / arrow (dark; low value) |

## 12. Audio–visual sync
### 12.1 Event table
| # | Visual event (f) | Audio anchor (f) | Offset (f) | Note |
|---|---|---|---|---|
| 1 | Cut S3→4a (791) | Narrator "and" onset 792.0; previous phrase ended 787.5 | **−1** | Cut sits in a 4.5 f pause, 1 f before the voice |
| 2 | Album art starts dissolving (797) | "album" 798.25 | **−1** | The illustration lands on its noun |
| 3 | Pull-back starts accelerating (849) | Music hit 855.25 | −6 | Anticipation |
| 4 | Collage burst: biggest step (864) | "Washington" 860.5; hit 855.25 | +3.5; +8.75 | The burst follows the first word, not the hit |
| 5 | CHOCOLATE starts typing (876) | "was" 875.5 | +0.5 | The title sets up during "DC was" |
| 6 | CHOCOLATE complete (891) / CITY complete (899) | "chocolate" 899.5 | −8.5 / **−0.5** | Title finishes as its first word starts |
| 7 | Ring start (903–905) / ring closed (911) | "chocolate" 899.5 / "city" 909.5 | +4.5 / **+1.5** | The ring closes on "city" |
| 8 | Zoom-out comes to rest (916–918) | Phrase end 918 | 0…−2 | The camera settles with the sentence |
| 9 | Beam first glow (924) | Song (stereo) cut-in 920.75 | +3.25 | Archival audio onset |
| 10 | Beam reaches the right half (926) | Vocal "Right" 927.25 | −1.25 | – |
| 11 | Beam at full (945) | Vocal sustains to ≈957 | ramp 19 f | Envelope attack |
| 12 | Beam dims (960) | Vocal end ≈957 | +3 | Envelope release |
| 13 | Photo slam (964) | Beat 962.2 (M+S flux) | **+1.8** | 108 BPM grid |
| 14 | Boil ends, photo settles (976) | Beat 976.1 | **−0.1** | – |
| 15 | Photo swaps (989 / 991) | Beat 990.0 | −1 / +1 | – |
| 16 | Photo swap (997) | Off-beat 8th 996.9 | +0.1 | – |
| 17 | Circle morph (1003–1005) | Beat 1003.8 | −0.8 / +1.2 | – |
| 18 | GEORGE starts (1020) | Fredara "George" 1024.0; beat 1017.7 | −4; +2.3 | Music fade f1010–1022 ends at her first word |
| 19 | GEORGE complete (1032) / CLINTON starts (1033) | "Clinton" 1031.5 | +0.5 / +1.5 | First name lands on the surname |
| 20 | CLINTON complete (1047) | Inside "is" (1036–1050) | +15.5 | Surname finishes ≈0.6 s later |
| 21 | (music hard-cut 1056) | "really" 1055.5 | (audio +0.5) | Music killed on a word |
| 22 | Push-in start (1062) / peak (1085) / end (1112) | "really" 1055.5 / end of "describing" ≈1088 / "vibe" 1106 | +6.5 / −3 / +6 | The push peaks just before the emphasised word ends |
| 23 | PARLIAMENT label starts (1072); complete with arrow (1093) | "describing" 1066; pause 1090–1097 | +6; +3 after the word | The label completes inside the pause |
| 24 | Label exit + accelerating push (1124–1126) | "post" 1132.5 | −6.5 | Clears the stage before the word |
| 25 | Jump + POST pop (1135) | "post" /p/ 1132.5 (vowel 1133); SFX tick 1135.25 | **+2.5**; −0.25 | Pop and SFX are simultaneous |
| 26 | Dash pops (1139) | "in-" 1139.5 | −0.5 | – |
| 27 | INDUSTRIAL pops (1143) | Stressed "-DUS-" 1144; tick 1141.0 | **−1**; +2 | – |
| 28 | Flicker-out starts (1151) / BLACK pops (1155) | "black" 1150.75; new music cue 1152.5 | +0.25 / +4.25; +2.5 | The music returns on "black" |
| 29 | URBAN pops (1178) | "ur-" soft onset 1176.5 (loud 1182.5); hat 1176.25 | **+1.5**; +1.75 | – |
| 30 | EXPERIENCES pops (1197) | Word onset 1187.5; stressed "-PE-" 1197.75; 16th hat 1196 | +9.5; **−0.75**; +1 | Pops on the stress, not the word start |
| 31 | Underline draws (1201–1203) | Hat 1200.0 | +1 | – |
| 32 | Cut to Fredara + card starts (1224) | Her bite ends 1220.75; narrator "That's" 1229.0; hat 1223.75 | +3.25; **−5**; +0.25 | Picture leads the narrator |
| 33 | Card resolved (1243–1246) | "Hadley" ≈1240.5 | **+3…+5.5** | Resolves during the surname |
| 34 | X + fade-out start (1328) | "School." ends 1325; audio fade 1330–1334 | +3; −2 | Picture leads the audio dip by 2 f |
| 35 | Black reached (1333) | Digital silence 1334.5 | −1.5 | – |
| 36 | Fade-up (1342–1349) | Audio fade-up 1341.75–1349.75 | **+0.25 / −0.75** | Matched |
| 37 | 1976 glitch-out (1351) | "The hub" 1352.75 | −1.75 | Clears for the new sentence |
| 38 | Tumble flip (1378–1386) | Pause after "culture," 1380–1385 (breath 1381.5) | 0 | The big move sits in the pause |
| 39 | Radio upright (1393); vinyl + dome (1398) | "news" ends 1391; "cities" 1398 | +2; **0** | – |
| 40 | Mic pops (1402–1405); newsprint (1405–1411) | "like" 1403; "Washington" 1410 | −1…+2; −5…+1 | Pop-ons follow the noun list |
| 41 | Cut to Angela (1481) | Her "Although" 1479.0 | **+2** | J-cut: voice leads |
| 42 | Her card decodes out (1481–1493) | – | 0…+12 | No build-in visible (§13.5) |
| 43 | Cut to WHUR (1619) | Angela's last sound ends ≈1619.0; narrator "At" 1625.0 | 0; **−6** | Picture leads the narrator |
| 44 | Pull-back accelerates (1690) | Jazz cue bass note 1690.5 (pre-lap) | **−0.5** | Camera rides the pre-lapped music |
| 45 | Cut to JAZZ (1697) | "jazz" /dʒ/ 1697.0 | **0** | Keyword cut |
| 46 | Letters land (≈1716) | "mixed" 1714.5 | +1.5 | – |
| 47 | Sparks start (1706) | Bass onset 1701.75 | +4.25 | Amplitude lag 2–3 f (§14) |
| 48 | Cut to SPEECHES (1740, segment C) | "speeches" /s/ 1739.25; next cue flux 1736 | **+0.75**; +4 | Keyword cut with a 4 f pre-lap |

### 12.2 Sync rules
1. **Keyword cuts land on the word onset**: −1, 0, +0.75 f (n=3: f791, f1697, f1740).
2. **Speaker-change cuts.**
   - When the narrator follows the cut, the cut leads her by 5–6 f (f1224 −5, f1619 −6) and comes 0–3 f after the outgoing speaker's last sound (+3.25, 0).
   - When the new speaker talks on camera, the voice leads the cut by 2 f (f1481, J-cut).
3. **Kinetic word pops land on the stressed syllable**: offsets +2, −1, +1.5, −0.75 (POST, INDUSTRIAL, URBAN, EXPERIENCES); mean +0.4 f, |d| ≤ 2 f.
   - When a glitch swap is used, the flicker starts on the word onset (+0.25 f) and the new word pops 4 f later.
   - Never sync a pop to the word start of a long word (EXPERIENCES would be +9.5 f).
4. **Titles anticipate, annotations confirm.**
   - A two-line title starts typing on the preceding word (+0.5 f) and completes just as its own first word starts (−0.5 f).
   - The annotation on the second word (the ring) completes on that word (+1.5 f).
5. **Names bracket the spoken name.**
   - The typewriter starts 4 f before the first name and finishes it on the surname onset (+0.5 f).
   - The name card starts on the cut and resolves 3–5.5 f into the spoken surname.
6. **In music-only passages, picture changes sit on the 8th-note grid.** 7 events: mean |d| 0.9 f, max 1.8 f (f964, 976, 989, 991, 997, 1003, 1005), plus the GEORGE start at +2.3 f; one swap (f1001) is off by −2.8 f. In narrated passages the voice wins: 6 of 6 kinetic events follow speech.
7. **Camera.**
   - Settles with the end of a sentence (0 to −2 f).
   - A push starts ≈6 f after the first word of its clause and peaks ≈3 f before the emphasised word ends.
   - Accelerating moves start on a music pre-lap note (−0.5 f) and run into the cut.
8. **Clear the stage 6–7 f before the next key word** (label exit −6.5, 1976 glitch −1.75 relative to the sentence start).
9. **Chapter dip.** Picture and sound fade together: the picture leads by 2 f going out, both fade in over the same 8 f (±0.75 f), and the voice returns 3 f after the fade-up ends.

## 13. Sound design
### 13.1 Per shot
| Shot | Voice (who, measured span) | Music / other | Levels |
|---|---|---|---|
| 4a | Narrator (studio: F0≈180 Hz, full band to 16 kHz) f792–839.5 | Chocolate City bed (≈77 BPM) faded **−25 dB in 8 f** (f829–836) under "why". **Near-silence f841–854 (14 f)**: only a −51 dBFS sub rumble <120 Hz, voice band −73. Tonal chord hit at f855.25 | Voice −21.5; bed −28 in gaps (≈7 dB under) |
| 4b | Narrator f860.5–918 ("…was" + 0.36 s pause f886–895 + "a chocolate city") | Bed after the hit at −35 dBFS (13 dB under). **Song excerpt cut in at f920.75** (no fade; soft −56 dB S intro), vocal "Right on, chocolate city" f927.25–957 | Song −21.8 (equal to the voice) |
| 4c | Fredara (Zoom: F0≈150 Hz, air −50 dB, band-limited) from f1024.0 | Instrumental 108 BPM at −24.5 dBFS. Fade **−20 dB over 14 f** (f1010→1024) ending on her first word. Bed under "George Clinton is" at S −58. **Hard music cut f1055→1056 (one frame) on "really"**; then **digitally mono, no music, f1056–1151** | Voice −21.0 |
| 4d | Fredara to f1220.75 | **New cue enters hard at f1152.5 on "black"** (95.5 BPM, hi-hat 8ths every 7.91 f, no sub). Two stereo HF ticks f1135.25, f1141.0 | Bed −36 in gaps (15 dB under) |
| 5a | Narrator f1229–1325 | Same 95.5 BPM bed. Fade f1330–1334, then **digital silence f1334.5–1341.75** | Bed −36 (15 dB under) |
| 5c | Narrator f1352.75–1468 | Bass-heavy stereo bed (S_sub≈S_all) **fades in f1341.75–1349.75** and **fades out f1434–1460**, so "Black Radio" is dry. **Reverb throw f1468.75** (stereo tail −62 dB S, ≈5 f). Near-silence f1471–1478 (−77 dBFS). Breath f1381.5 | Bed −36 in gaps (15 dB under) |
| 6 | Angela (Zoom: F0≈157 Hz, air −42 dB) f1479.0–1619 | Bed with bass. **Ride in her 0.6 s pause**: +16 dB in 2 f at f1559 (6 f after she stops), back −10 dB in 5 f from f1569 | Bed −32 (10 dB under) |
| 7 | Narrator f1625–1696 | Nearly silent bed (S −72…−90). **Jazz cue pre-laps at f1690.5** (bass note, 6.5 f before the cut) | Bed −40.6 (19 dB under) |
| 8 | Narrator f1697–1738 | Jazz cue (bass onsets f1701.75, f1719.75). Swells to S −30.6 in the 3 f gap after "jazz,", then pulled −12 dB in 3 f at "mixed". Next cue pre-laps f1736 | Bed −29.6 (8 dB under) |

### 13.2 Levels and ducking
- **Loudness matching.** Speech sits at −21.5 dBFS (median over speech frames; per cue −21.0 to −23.8, median −21.6) for the narrator and both Zoom interviewees.
- **Bed depth depends on the role of the music.**
  - 7–8 dB under the voice when the narration is *about* the music being heard (Chocolate City f791–840; jazz f1697+).
  - 10–15 dB under for underscore.
  - 19 dB under for plain exposition (WHUR).
  - Featured music with no voice: −21.8 to −24.5 dBFS, i.e. 0–3 dB under the voice.
- **No word-by-word sidechain.** Bed level under words vs between words differs by only +1.0, +2.4 and +0.6 dB (cues 4a, 4d/5a, 8).
- **Instead, manual rides in pauses ≥0.5 s.**
  - Up: a 6 f hold, then +16 dB in 2 f.
  - Down: −10 to −12 dB in 3–5 f, starting 0–1 f after the voice resumes.

### 13.3 Music entrances and exits
| Device | Instance | Numbers |
|---|---|---|
| Fade under the last word, then silence, then a hit | f829–855 | −25 dB in 8 f under "why"; 14 f near-silence; chord hit; narrator 5.25 f after the hit; visual burst 3.5 f after the narrator |
| Song excerpt cut in | f920.75 | 2.75 f after the narrator's line ends; vocal 6.5 f after the cut-in |
| Pre-fade to the interviewee | f1010–1024 | 14 f, −20 dB, bottom of the fade = first word (0 f) |
| Kill for the key line | f1056–1151 | 1-frame cut on a word onset (+0.5 f); 95 f (3.8 s) of dry mono |
| New cue on the stressed word | f1152.5 | +1.75 f after "black"; the visual pop lands 2.5 f after the music |
| Section-end fade and reverb throw | f1434–1474 | 26 f fade so the last 2 words are dry; ≈5 f stereo tail; 8 f near-silence before the next speaker |
| Chapter dip | f1330–1350 | 4 f out, 7.25 f digital silence, 8 f in (picture-matched) |
| Pre-lap | f1690.5, f1736 | Next cue starts 6.5 f / 4 f before the cut |

### 13.4 SFX inventory
Found by testing every transition (±8 f) for broadband stereo noise. Speech and music are explained elsewhere.

| f | What | Spectrum / level | Visual |
|---|---|---|---|
| 1135.25 | Tick, 30–90 ms | Stereo-only HF (3.4–16 kHz), −50 dBFS S, inside a digitally mono passage | POST pop + camera jump (−0.25 f) |
| 1141.0 | Tick, 60 ms | Same, −54 dBFS S | Between the dash (f1139) and INDUSTRIAL (f1143) |
| 1468.75 | Reverb throw | Stereo tail −62 dB S, decays over ≈5 f | End of a section, radio collage hold |
| 1381.5 | Narrator breath (not an SFX) | Mono, centroid 5–8 kHz | During the tumble flip |

**Not found:** whooshes, risers, scratches, vinyl crackle beds, static or impact hits on the zoom-out burst, the photo slam, the circle morph, the cuts or the dip. The chord at f855 and the beat at f962 are music, not SFX. The picture's percussion comes from **music edits**.

### 13.5 How the interviewees are introduced
- **Fredara: voice first, then face.**
  - Her bite starts at f1024 over the George Clinton graphics, with no name on screen and the music pre-faded to the bottom on her first word.
  - She is cut to only at f1224, 8.0 s (200 f) later and 3.25 f after her bite ends. On screen she is silent and smiling while the narrator says "That's Fredara Hadley…" (f1229).
  - The card starts on the cut (5 f before the narrator names her), resolves on "Hadley" (+3–5.5 f) and stays exactly as long as the two narrator sentences (f1224–1328, 4.2 s). It exits with an X and the chapter dip.
- **Angela: on camera from her first syllable.** The J-cut gives her voice a 2 f lead.
  - Her card is already complete at the cut and decodes out in 12 f (f1481–1493).
  - It is clipped by the right frame edge because her window is centred.
  - No build-in exists in this segment. Treat it as a trimmed head and do not copy it. The house pattern is Fredara's card.

## 14. Visualizer / audio-reactive graphics
| Graphic | f | What drives it | Measured |
|---|---|---|---|
| **Electric beam** across "CHOCOLATE CITY" | 924–963 | **Keyed envelope** on the archival song vocal | Blue pixels (x1515–1920, y420–660): 44 → 245 → 2405 → 4157 → 5084 → 5346 (f926–945), plateau 5200–5390, 5050 at f960, gone at f964. Steps on twos. Attack +3.25 f after the song cut-in, 19 f ramp. Release +3 f after the vocal ends. Correlation with per-frame audio level only 0.15–0.36 at lag 0 (S, M, voice band), so there is **no FFT reaction**. The beam shape is re-randomised every drawing |
| **Trumpet sparks** | 1706–1739 | Hand-drawn boil; brightness loosely follows the jazz-cue level | Mean luma of the spark region vs music S level: r 0.68 at lag 0, **0.83 at +2…+3 f**. The photo drifts into the region until f1716 (confound). After f1716 the dip f1722–1729 and the rise f1731 still trail S by 2–3 f. New drawing every 2–3 f regardless of onsets |
| Vinyl "light rays" | 792–857 | Not reactive: a baked-in sheen rotating with the record (≈4–5°/f) | Region luma does not correlate with HF (r ≤ 0.05) |
| Lyrics | – | **None.** The CHOCOLATE CITY title is timed to the narrator, not to the song vocal that follows | – |

**Conclusion.** The episode has no frame-accurate visualiser: no waveforms, EQ bars or per-beat pulsing. The music drives envelopes (on/off and slow amplitude, 2–3 f lag) and the timing of picture changes in music-only passages (§12.2 rule 6).

## 15. Rules for the kit
1. **Anchor timing to a `words[]` track with `onsetF` and `stressF`** (10 ms envelope or manual), never to raw transcript starts (errors up to 16 f).
2. **Keyword cut:** `cutF = onsetF + 0` (allowed −1…+1). **Speaker-change cut to the narrator:** `cutF = narratorOnsetF − 5` (5–6), and ≥ outgoing speaker's last sound + 0…3. **Cut to an on-camera speaker:** `cutF = speakerOnsetF + 2`.
3. **Kinetic word:** `popF = stressF + 1` (range −1…+2). With a glitch swap: flicker 4 f from `onsetF`, then pop. Hold each word until the next one; the last word holds ≥ 20 f after the bite ends.
4. **Title typewriter:** start on the preceding word; rate 2 f/letter (line 2: 4 f/letter); finish at `firstTitleWord.onsetF − 0…1`. Annotation (ring/underline) draws 6–8 f and ends at `secondWord.onsetF + 1…2`.
5. **Name card:** build 20–22 f starting on the cut (≈5 f before the name is spoken); the surname resolves at `surnameOnsetF + 3…5`. Hold until the description ends, then exit with an X (2 strokes, 3 f) plus a 5 f fade.
6. **Label + arrow:** start ≈6 f after the verb that introduces it; 2 f/letter; finish in the next speech pause. Exit (dim + un-draw, 8 f) 6–7 f before the next key word.
7. **Music-only passages:** quantise every picture change to the cue's 8th-note grid with `offset ∈ [−1, +2] f` (measured mean |d| 0.9 f). Compute the grid from the cue's tempo map, not a global BPM.
8. **Camera:** pushes take 2 s with `(.85,.1,.05,1)`, starting 6 f after the clause's first word and peaking 3 f before the stressed word ends. Zoom-out reveals decelerate with `(0,.1,.4,1)` and come to rest on the sentence end. Momentum cuts accelerate 3–7 f into the cut and decelerate 3–6 f after it.
9. **Chapter break:** picture `out 5 f → black 9 f → in 8 f`; audio `out 4 f (2 f after picture) → digital silence → in 8 f` aligned to the picture fade-in; voice returns 3 f after the fade-in completes.
10. **Mix levels:** voice −21.5 dBFS (±1) for every speaker. Bed −7 dB (music is the topic), −10…−15 dB (underscore) or −19 dB (exposition) relative to the voice. Featured music −22…−25 dBFS.
11. **No sidechain ducking between words.** Ride only in pauses ≥ 12 f: +16 dB in 2 f after a 6 f hold; −10…−12 dB in 3–5 f when the voice resumes.
12. **Music editing as punctuation:**
    - fade the bed −25 dB over the last word (8 f), leave 12–14 f of near-silence, hit, then voice 5 f later and the visual 3–4 f after the voice;
    - pre-fade music −20 dB over 14 f so it bottoms out on an interviewee's first word;
    - kill music with a 1-frame cut on a word onset for an expert's key sentence, and bring a new cue in on that sentence's stressed word (+1…+2 f);
    - pre-lap every new scene's music 4–7 f before its cut;
    - cut archival song excerpts in (no fade) within 3 f of the narration ending.
13. **Section ends:** fade the bed over ≈26 f so the last two words are dry, add a reverb throw (≈5 f tail, −40 dB re voice), then 8 f of near-silence before the next speaker.
14. **Audio-driven graphics** use smoothed envelopes, not FFT: attack starts 3 f after the source starts, 19 f ramp, release 3 f after it ends, re-randomised shape every drawing. Amplitude-follow (if any) lags 2–3 f.
15. **SFX budget:** ≈1 per 13 s. Use only tiny HF ticks (30–90 ms, ≈ −30 dB re voice) on text pops that fall in a music-free passage. Transitions get music edits, not whooshes.
