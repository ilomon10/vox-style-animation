# Vox "Earworm — Quiet Storm", segment A: look + sound (`earworm`, f0–790, 0.00–31.64 s)

> Analyst: A. Sources: keyframe sheets `sheets/earworm/sheet_001–011` (≈180 cells), AV timelines `av/earworm_000.00-008.00 … 024.00-032.00`, 11 full-rate strips (`strips/earworm_*`, list in §11), 29 native grabs/crops (`stills/earwormA/`), `metrics/earworm.csv`, `audio/earworm_{words,phrases,features,rhythm}`, plus my own mid/side analysis of `audio/earworm_full_stereo48k.wav` (M=(L+R)/2, S=(L−R)/2, per-frame bands <200 Hz / 200–2k / >2k, L/R correlation, HF kurtosis). Source is 1920×1080, so px = @1080p. f = global frame @25 fps, t = f/25. Audio levels are **dBr** = dB re the 99th percentile of the mid channel over f0–812 (≈ peak narration = −2 dBr). "VO" = narrator (Estelle Caswell); "vocal" = archival song vocal (George Clinton). Word onsets: faster-whisper, cross-checked with speech-band spectral flux; error ≈ ±2 f (corrected where the energy disagrees: "In" is at **f705**, not f698).

**Frame-rate note.** The master is 24 fps conformed to 25 fps by duplicating one frame per second: in the on-twos photo move the 3-frame holds start at f705, 730, 755, 780 (≡ 5 mod 25). Graphics run at **≈10 drawings/s** (hold pattern 2-3-2-3, mean 2.46–2.54 f/drawing in f0–33, f160–226, f240–296), caption type at **8.3 dps** (on threes: f463, 466, 469 … 544), the photo move at **12 dps** (2,2,…,3; 44 intervals = 92 f). All A/V offsets below therefore carry ±1 f of conversion jitter.

## 1. Summary of the look — what is new vs `epigenetics.md`
- **Full 16:9 picture, no pillarbox.** The Vox bug keeps the identical pixel box (x 1716–1888, y 31–109, #CECECE) but now sits over the picture, in every shot including the photo.
- **Black paper instead of the grey dotted desk.** The ground is overlapping black construction paper with torn edges and ghost newsprint (luma p5/p50/p95 = 4/6/11, scraps ≤30). It **weaves**: the ground layer jumps ±2–5 px (whole pixels) every 4–6 f (f131, 137, 142, 144, 148) independently of the foreground.
- **One accent: periwinkle #6D76DD** (digits, station name, X mark; the credit at ≈68 % = #4D5092). Everything else is monochrome (sat 0.03–0.06). Blacks are **not lifted** (p1 luma 5; epigenetics ≈40); collage whites reach 241–255.
- **Type = condensed grotesque caps + one serif.** Clean periwinkle for data (1976, WHUR 96.3); distressed off-white #BEBDBE for quotes/titles; a transitional serif for secondary lines (Washington, DC / Parliament). No handwriting, tape, stickies or highlighter.
- **B&W cut-out collage that unfolds**: Capitol, rowhouses, car, newsprint, scribble card, torn strips grow out of one seed between "19" and "76". Music props (a spinning 78/LP) become the hero.
- **Karaoke quotes.** The archival vocal is typeset **word by word on the voice** (median +1 f, 19/21 tokens within ±3.5 f), two lines max, old line dimmed to 35 %.
- **Camera hits and stops.** Pushes accelerate and **stop dead** on the keyword (no settle tail, f291). Crash push ×2.7 in 11 f (f452–463). Pull-back reveal ×0.51 in 27 f (f697–724). Holds are **dead** (drift ≤0.4 %/s, f724–783 zoom 1.000): life comes from the ground weave, per-drawing re-grain and the spinning record.
- **Sound tells the story.** A sparse stereo bass+hat bed (≈62–66 BPM) under the cold-open VO. The song is introduced **diegetically**: record flies in → needle-drop thump → 11 f of vinyl crackle → song. It plays solo for 7.6 s, is ducked ≈20 dB under the VO, then **hard-stops** 8 f before the next cut (9 silent frames, −48…−60 dBr).
- **Pacing.** VO 2.5 words/s with 0.4–1.4 s pauses. Transitions live **inside the pauses**, on the bed's bass notes; keyword graphics land on the word.

## 2. Shot log
Auto shots: S1 f0–315, S2 f316–696, S3 f697–790 (S2 is one continuous stage; split into beats 2a–2d here).

| Shot | t0–t1 (f) | Content / composition | Layers (back→front) | Motion (what, how, how long) | In / out |
|---|---|---|---|---|---|
| 1 | 0.00–12.60 (f0–315) | Cold open. 4 periwinkle digits fly in → "1976" (centre 957,538). It splits; a B&W collage of DC unfolds between "19" and "76". The collage whips out left; a satellite-map card (rounded, x 258–1206) and a line-map card (x 1205–1685) are placed stop-motion. "WHUR 96.3 / Washington, DC" label. Push-in through a defocus swap to a close aerial; blue X on Howard Univ.; torn-paper iris | ground → collage cut-outs ⇄ digits (interleaved) → map cards → label → X → iris | digits f5–33; split f64–66; unfold f68–123; hold f123–163; whip-out f164–173; 4 card poses f176–184; inner pan f184–211; label f211–226; push f241–291 (dead stop); X f291–303; iris f314 | in: cold open, no fade · out: torn iris (1 drawing) → hard cut on "DC" |
| 2a | 12.64–15.52 (f316–388) | Re-framed collage (larger Capitol), cut mid-unfold; "19"/"76" rise from behind pieces | ground → collage → digits | unfold f316–330; digit rise f326–341; drift −1.3 %/s, tx −77 px over 72 f | in: hard cut |
| 2b | 15.56–18.12 (f389–453) | Vinyl record flies in at frame centre (965,543), Ø 735, spinning; digits sink | ground → collage → record → digits | fly-in f389–401; spin 8.5°/drawing; digits sink f414 / f421 / f429 | — |
| 2c | 18.16–24.00 (f454–600) | Crash push: record arc fills the lower 42 % (Ø≈2000, centre (960,1617)); 2-line karaoke of Clinton's intro | ground → record → captions | push f452–463; 21 caption tokens f457–594; line scrolls f501, 516, 535, 557, 572 | — |
| 2d | 24.04–27.84 (f601–696) | VO names the song: line dims to "CC", record sinks out, CC unpacks to CHOCOLATE CITY, "Parliament" credit; 0.36 s silent hold | ground → title → credit | isolate f613–623; record sink f618–632; unpack f626–644; credit f679–684; frozen f684–696 | out: hard cut into silence |
| 3 | 27.88–31.60 (f697–790) | Full-frame B&W photo of Parliament (p1/p50/p99 luma 9/116/217) | photo (print) | pull-back ×0.51 f697–724; **dead hold** f724–783; pull-out-through f785–790 revealing the print's white border | in: cut onto moving camera · out: match cut to the same photo as a cut-out on the album (f791, seg. B) |

## 3. Color
| Token | Hex | Role | Evidence |
|---|---|---|---|
| ground-black | #060606 (p5 #040404, p95 #0B0B0B) | black-paper ground | f33, f652 |
| ground-scrap | #141414–#1E1E1E, newsprint ghosts to luma 30 | torn scraps, ghost type ("In", "By", "The", "ng") | f33 |
| periwinkle | **#6D76DD** (p10 #6973D3, p90 #7178DF); label #646FDA | year digits, station name, X mark | f51, f251, f314 |
| periwinkle-dim | #4D5092 (≈68 % over black) | credit line "Parliament" | f696 |
| caption | #BEBDBE (glyph luma mean 186, σ 17, p10 164, p90 204) | quotes, song title | f530, f652 |
| caption-prev | ≈#414141 (35 %) | previous caption line | f530 |
| label-box | #181818 | box behind the label lines | f251 |
| label-serif | #BBBDBC | "Washington, DC" | f251 |
| line-map | white 2 px streets on black, ≈50–100 % | map overlay card | f251, f314 |
| logo | #CECECE | Vox bug | all |
| photo B&W | p1 #090909 / p50 #747474 / p99 #D9D9D9, sat 0.02 | band photo | f730 |

**Grade.** A neutral greyscale world (shot sat 0.039 / 0.053 / 0.056, warmth −0.5…−1.9) with a single cool accent (periwinkle ≈1.5–2.5 % of pixels when present; 2.4 % at f51). Blacks crush to #060606. The record label (purple/red) is the only other chroma.
- **No chromatic aberration**: R−G and B−G edge offsets are 0.00–0.13 px at the logo and title edges. Epigenetics had radial CA.
- **No vignette**: corner luma 7.9–11.4 vs centre 6.3 at f652. The band photo carries its own soft print vignette and white rebate.

## 4. Typography
| Style | Role / examples | Case | Cap height @1080p | Class / weight | Colour / bg | Reveal | ≈ commercial | Best free |
|---|---|---|---|---|---|---|---|---|
| Display digits | "1976" | — | 200–206 px (f51); 210–218 in the collage | condensed bold grotesque, clean; digit widths 67/111/95/110 px, gaps 34–62 px | #6D76DD, no bg | per-digit z-fly-in → slide together; masked rise / sink | Trade Gothic Bold Cond. No. 20 / Knockout | Oswald 600, Antonio 700 |
| Station label | "WHUR 96.3" | caps | ≈94 px (at f251, mid-push) | same family, bold | #646FDA on #181818 box (pad ≈18 px) | cursor bar → box wipe L→R → scrambled type-on, 15 f | same | Oswald 700 |
| Label serif | "Washington, DC" | Title | ≈45 px | transitional serif, regular | #BBBDBC on #181818 box, 10 px under box 1 | scrambled type-on | Publico / Tiempos Text | Source Serif 4 |
| Caption | Clinton quote, 1 line ≤ 20 chars | CAPS | **80–82 px** | condensed grotesque semibold + **letterpress distress** | #BEBDBE; previous line 35 % | per-word rise + fade (6–9 f); line scroll in 1 drawing | Knockout 49 + texture | Oswald 500 + noise mask |
| Song title | "CHOCOLATE CITY" (x 630–1302, y 496–579) | CAPS | 80–84 px | as caption | #BEBDBE | unpacks from "CC" (f626–644) | — | — |
| Credit | "Parliament" (x 776–1159, y 600–659) | Title | ≈58 px ascender | serif regular | #4D5092 | slides down from behind the title, 5 f | Publico | Source Serif 4 |

Caption metrics: lines centred on x≈960, current baseline y≈580 (54 % H), previous line y 368–448 (pitch **130 px = 1.6× cap**), word gap ≈40 px (0.5 cap), the comma is a separate token with a space before it.

## 5. Layout & composition
- **Centre-weighted.** "1976" is centred (x 702–1213, y 436–641). The record fly-in is centred on (965,543). Caption lines are centred. The collage is one compact cluster ≈1250×700 px (x 405–1655, y 65–945) with **axis-aligned pieces (0 ± 2°)**, unlike the rotated cards of epigenetics.
- **Depth interleave.** "19" sits behind the Capitol dome. "76" sits in front of the grey torn strip but behind a thin white torn strip that crosses the "6". Digits rise from and sink behind collage pieces.
- **Map layout**: two cards side by side (satellite ≈50 % W, line map ≈25 % W, offset down 200 px). The label straddles the card seam in the lower-right third (x 1012–1557, y 683–877). The X is placed just left of the label.
- **Record stage**: after the crash push the record arc occupies y 620–1080; captions float in the dark band above it (y 368–585). The record is the "floor" for text, an analogue of the epigenetics desk.
- Focal text keeps ≥ 360 px from the side edges (captions x ≥ 475, label x ≤ 1557). Nothing bleeds except the record and the map cards.

## 6. Textures & materials
| Item | Measurement | How to generate |
|---|---|---|
| Black-paper ground | luma 4–11, torn edges, ghost newsprint ≤ luma 30 | 3–5 large black PNG scraps + newsprint at 8–12 % opacity, multiply |
| Ground weave | whole-pixel jumps (Δy ±4–5, Δx ±2) every 4–6 f, at irregular times; foreground unaffected | `translate(round(noise(t·5Hz)·4))` on the ground layer only, stepped |
| Per-drawing re-grain | static collage changes 4–5 luma (MAD) between drawings with no motion (phase-corr peak 0.5), identical inside a hold | seeded grain overlay re-seeded per drawing (≈10 Hz), soft-light 10–15 % |
| Cut-out photos | B&W, hard knife edges, no halftone, no border, **no visible drop shadow** (black on black) | PNG cut-outs, desaturate, contrast +10 % |
| Torn strips / hatched swatch | 8–12 px white torn strips; hatched card with a torn right edge | SVG path with a turbulence-displaced edge |
| Caption distress | glyph σ 17 luma, speckled voids | text × noise mask (feTurbulence 0.8, threshold) |
| Torn iris | black paper with a torn hole over the map (f314), edge roughness ≈10–20 px | mask = torn-edge polygon, 1 drawing |
| Vinyl | photographic record with a baked specular wedge; coloured label | PNG, rotate about the label centre |
| Print (S3) | B&W photo, soft white rebate revealed on pull-out (f789: luma 109 → 117) | photo inside a white-edged frame, 2–3 % larger than the screen |

## 7. Motion language
Cadence: graphics ≈10 dps, captions 8.3 dps, photo 12 dps (see the note at the top). There are no boils on strokes; life comes from the ground weave and re-grain.

| Motion | Evidence (f) | Duration | Measured profile | Ease (fit) |
|---|---|---|---|---|
| Digit z-fly-in | 7 & 1 f8, 9 f10, 6 f14 (first fragment f5); converge f16–33 | 28 f all, ≈25 f each | scale ≈1.75 (f8) → 1.15 (f16) → 1.0; entries from the 4 edges, staggered 2–4 f | expo-out (`enter`) |
| Collage unfold | seed f68 → full f123 | 55 f | pieces open from hinges in 4–6 drawings each; the cluster grows and pushes 19/76 apart (split f64–66) | ease-out per piece |
| Whip-out (no blur) | f164–173 | 9 f | −18, −48, −97, −223 px/drawing (×2.1 per drawing) | ease-in (`exit`) |
| Stop-motion placement | map card f176, 178, 180, 184 | 8 f, 4 poses | each pose jumps position and size (top → left → centre → final) | stepped |
| Inner pan (map in its card) | f184–211 | 27 f | 153, 104, 75, 56, 43, 32, 23, 17, 11, 6, 3, 2 px/drawing (Σ 528), ×0.72 per drawing | (0.18, 1.05, 0.83, 1), rms .009 ≈ `enter` |
| Label build | cursor f211, boxes f214–216, type f214–226 | 15 f | 2-line bar → boxes wipe right → letters appear in random order (Was n → Was n t n I → Washin ton, DC) | stepped |
| Push to keyword, dead stop | f241–291 | 50 f | zoom/drawing 1.002, 1.006, 1.009, 1.011, 1.019, 1.022, 1.028, 1.037 … 1.079, 1.070, **1.000** (f291) | fit (0.03, −0.15, 0.85, 0.70), rms .035 → **`snapStop` (0.4, 0, 0.85, 0.7)**: ends at 2× mean speed, then 0 |
| Defocus swap | f273 blur → f276 max → f280 sharp | 7 f | blur σ ≈10–15 px hides a swap to a finer map tile (incl. the label) | — |
| X draw-on | f291–303 | 12 f | 2 thin periwinkle strokes | linear |
| Masked digit rise / sink | rise f326–341; sink 7 f414, 6 f421, 19 f429 | 15 f / 4–6 f each | from/behind collage pieces | ease-out / ease-in |
| Record fly-in | Ø 15, 198, 198, 516, 640, 684, 735 px at f389, 391, 393, 394, 396, 398, 401 | 12 f | diameter progress .02, .27, .27, .70, .87, .93, 1 | stepped keys (fit (0.88, 0.5, 0, 0.8), rms .05) |
| Record spin | f396–633 | continuous | **8.5° per drawing clockwise** at 10 dps (≈83°/s ≈ 14 rpm), the same before and after the music starts | linear, stepped |
| Crash push into the record | f452–463 | 11 f | ×2.72 (Ø 735 → 2000), centre +1074 px down; log progress .27, .81, .98, 1 at f457, 459, 461, 463 | (0.75, 0.2, 0.12, 1.15), rms .006 → `crashPush` (0.75, 0.2, 0.15, 1) on log(scale) |
| Caption word in | e.g. HAPPENING f463/466/469 | 6–9 f (2–3 drawings) | rise 95 → 32 → 8 → 0 px, opacity ≈60 → 100 % | progress .66, .92, 1 per drawing ≈ `enter` (0.16, 1, 0.3, 1) |
| Caption line scroll | f516, 535, 557, 572 | 1 drawing | previous line jumps up 130 px and dims to 35 %; the older line disappears | cut |
| Keyword isolation | f613 → 616 → 619 → 623 | 10 f | other words → 35 % → removed; "CC" stays 100 % | stepped |
| Letter unpack | CC split f626, spread f629, CH f632, CHOCOLA f635, CHOCOLATE C f638, … CITY f644 | 18 f | ≈1 char/frame, type-on outward from each C | stepped |
| Record sink-out | f618–632 | 14 f | ty +7, +21, +36 … px/drawing | ease-in |
| Credit drop | f679–684 | 5 f | slides down from behind the title | ease-out |
| Photo pull-back | f697–724 | 27 f | zoom/drawing 0.986, 0.922, 0.851, 0.868, 0.922, 0.935, 0.955, 0.967, 0.978, 0.985, 0.992, 0.999; peak f703–705 | **(0.25, −0.1, 0.1, 1)**, rms .013 → `pullReveal` (0.3, 0, 0.1, 1) on log(scale) |
| Pull-out into cut | f785–790 | 6 f | 0.998, 0.990, 0.959 per drawing (+ print border) → cut, incoming ×0.785 | ease-in (`accelerate`) |

**Differences from the established motion language** (`06-motion-language.md`):
1. Pushes may **end dead** (f291) instead of always having a ≥15 f tail.
2. Holds are dead still (60 f at zoom 1.000) instead of drifting.
3. Graphics run at 10 dps, not 12.
4. Caption type runs on threes (8.3 dps).
5. Type entrances are per word on a vocal, not per phrase.

## 8. Transitions
| Type | Where | Frame by frame | Length | Trigger | Build |
|---|---|---|---|---|---|
| Cold open | f0 | the first frame already shows the ground, the logo and an empty stage; VO + bed start at f0 | 0 f | episode start | no fade |
| Whip-out → stop-motion card drop (in-shot) | f164–184 | f164 −18 px · f166 −48 · f168 −97 · f171 −223 · f173 collage ⅔ off-frame (held 3 f) · f176 map tile small at top · f178 left · f180 centre, big · f184 final + line map | 20 f | bass note f163 in a VO pause | `slideOut(accel)` + `StopMotionPlace(poses[4])` |
| Defocus tile swap | f273–280 | push continues; σ ≈15 px at f276; finer tile sharp at f280 | 7 f | mid-push | blur σ = 15·(1 − 2·abs(p − 0.5)) over the 7 f window, swap the image at p = 0.5 |
| Torn iris → cut | f314–316 | black torn-paper frame closes over the map in 1 drawing; cut on "DC" | 2 f | VO phrase onset | mask PNG + `<Series>` |
| Cut onto a mid-build collage | f316 | the new shot starts with pieces still unfolding (settle by f346) | 30 f | — | start the unfold timeline at ≈40 % |
| Crash push (scene change, no cut) | f452–463 | the collage is pushed out of frame; the record becomes the floor | 11 f | vocal onset ("what's" f458) | camera scale ×2.72, log-space ease |
| Keyword isolation → title | f613–644 | the line dims except "CC"; the record sinks; CC unpacks | 31 f | VO "This is Chocolate City" | opacity steps + letter type-on |
| Silence hold → cut onto moving camera | f689–697 | music + VO stop at f689 (−42 dBr in 1 f); 8 f of frozen frame + silence; cut f697 lands on a pull-back already at speed | 9 f + 27 f | section change | `hardStop` + `head={pullBackReveal}` |
| Pull-out-through (match cut) | f785–791 | ease-in pull-out reveals the white print border → cut to the same photo as a cut-out on the album, ×0.785 | 6 f + cut | VO "and this album" (f791) | T-PO tail + matched element |

No dissolves, no wipes and no radial blur. The only blur is the defocus swap.

## 9. Reusable components
| Component | Props (defaults from measurements) |
|---|---|
| `BlackPaperGround` | `scraps:4`, `newsprintOpacity:.1`, `weave:{ampPx:[2,5], everyF:[4,6], integer:true}`, `regrainHz:10` |
| `FlyInGlyphs` | `text:"1976"`, `font:"Oswald 600"`, `cap:204`, `color:"#6D76DD"`, `from:["top-left","left","bottom-right","right"]`, `startScale:1.75`, `stagger:[0,2,4]`, `assembleF:28`, `dps:10` |
| `UnfoldCollage` | `seed:{x,y}`, `pieces:[{src, hinge, delayF}]`, `pieceF:[8,12]`, `pushApart:["19","76"]`, `dps:10` |
| `StopMotionPlace` | `poses:[{x,y,s}×4]`, `holdF:[2,2,4]` |
| `MapCard` | `src`, `radius:10`, `innerPan:{px:528, decay:.72/drawing}` |
| `StationLabel` | `title:"WHUR 96.3"`, `sub:"Washington, DC"`, `titleCap:94`, `box:"#181818"`, `cursorF:3`, `wipeF:3`, `scrambleF:12` |
| `SnapPush` | `scale:1.66`, `durF:50`, `ease:[0.4,0,0.85,0.7]`, `stopDead:true`, `endOn:"keyword onset"` |
| `DefocusSwap` | `atProgress:.6`, `sigmaMax:15`, `durF:7` |
| `XMark` | `color:"#6D76DD"`, `stroke:5`, `durF:12` |
| `TornIris` | `maskSrc`, `durF:1`, `then:"cut"` |
| `VinylRecord` | `diameter:735`, `center:[965,543]`, `flyIn:{durF:12, keys:[.02,.27,.27,.70,.87,.93,1], fromD:15}`, `spinDegPerDrawing:8.5`, `dps:10` |
| `GlyphSink` | `order:["7","6","19"]`, `onBeats:true`, `durF:5` |
| `KaraokeCaption` | `tokens:[{text, f}]` (from the word JSON), `cap:81`, `color:"#BEBDBE"`, `distress:true`, `riseF:9`, `risePx:95`, `ease:"enter"`, `dps:8.33`, `lines:2`, `prevOpacity:.35`, `linePitch:130`, `scrollF:1` |
| `KeywordIsolate` | `keep:"CC"`, `stepsF:[0,3,6,10]`, `dimTo:.35` |
| `LetterUnpack` | `from:"CC"`, `to:"CHOCOLATE CITY"`, `splitF:3`, `charsPerFrame:1` |
| `CreditDrop` | `text:"Parliament"`, `font:"Source Serif 4"`, `cap:58`, `color:"#4D5092"`, `durF:5` |
| `PhotoPullBack` | `fromScale:1.96`, `durF:27`, `ease:[0.3,0,0.1,1]`, `dps:12`, `thenHold:"dead"` |
| `PullOutThrough` | `perDrawing:[.998,.99,.959]`, `revealBorder:true` |
| audio: `NeedleDrop`, `Duck`, `HardStop`, `SubSwell`, `SubDrone` | see §13–15 |

## 10. Build notes for code (Remotion/React)
1. **Timeline = audio first.** Load the word JSON (start/end per word, speaker tag) and a cue sheet. Every visual key is written as `{anchor:"word:Washington#2", offsetF:0}` and resolved to frames. Never hard-code frame numbers.
2. **Cadence.** Use `posterize(frame, 10)` for graphics, `posterize(frame, 8.33)` (on threes) for caption type, `posterize(frame, 12)` for photo moves. Audio is on ones. Reset the parity per shot.
3. **Layers.** `BlackPaperGround` (weave transform) → `CameraRig` (collage/map/record/photo) → screen-space captions and labels (they do **not** take the crash push; WHAT'S appears mid-push at f457 in screen space) → logo.
4. **Dead stops.** Implement `SnapPush` as an ease-in curve whose last key is reached exactly on the keyword frame, followed by a constant (`extrapolateRight:"clamp"`). Do not add drift afterwards.
5. **Caption engine.** Tokens are words or syllable chunks (TEMP|ORARY, CON|DI|TION TOO). Each token gets `f = round_up_to_text_drawing(vocalOnset + 1)`. A line break is a manual property of the token. At a break, the old line moves to slot −1 at 35 % and the older line is removed, all in one drawing.
6. **Audio graph.** Use `<Audio>` per stem: VO, bed, song, SFX. Ducking is a volume callback built from the VO word list (§15 R11). The hard stop is a 1-frame ramp. Crackle and thump come from samples (§13.3). Render the sub swell with a sine at 35–100 Hz with an attack/decay envelope, or use a sample.
7. **Hard to replicate.** The collage unfold: author the pieces as SVG/PNG with 3D `rotateX/rotateY` about hinge edges (perspective 1200 px), 4–6 drawings each. The letterpress distress: a static noise mask per word, not animated.

## 11. Evidence index
| Path (under `analysis/`) | Note |
|---|---|
| `sheets/earworm/sheet_001–011.png` | every keyframe f0–816 |
| `av/earworm_000.00-008.00 … 024.00-032.00.png` | spectrogram, levels, onsets, beats, words |
| `strips/earworm_00000-00035.png` | digit fly-in and assembly |
| `strips/earworm_00058-00105.png` | split + collage unfold |
| `strips/earworm_00160-00207.png` | whip-out, stop-motion map, inner pan |
| `strips/earworm_00210-00245.png` | label cursor, box, scramble type |
| `strips/earworm_00268-00315.png` | push, defocus swap, X, torn iris |
| `strips/earworm_00316-00351.png` | cut onto mid-build, digit rise |
| `strips/earworm_00386-00433.png` | record fly-in, spin, digit sinks on beats |
| `strips/earworm_00434-00481.png` | crash push, first caption words |
| `strips/earworm_00513-00560.png` | caption line scrolls, syllable tokens |
| `strips/earworm_00606-00653.png` | CC isolation and unpack |
| `strips/earworm_00672-00719.png` | credit drop, silence hold, cut, pull-back |
| `stills/earwormA/f0033 … f0791.png` | native grabs (colour, type metrics, grain/weave f125–131) |
| `stills/earwormA/record_flyin_f391-394-398-420.png`, `lyric_rise_f457-469.png`, `crops_title_label.png`, `crop_f0696_title.png`, `crop_f0251_label.png`, `transition_f730-789-791.png`, `f0314_half.png` | measurement crops |

## 12. Audio–visual sync
Method: visual frame = the first frame where the change is visible. Anchor = the audio event it is tied to. **Δ = visual − audio** (positive = visual later). Beat Δ = offset to the nearest beat of `rhythm.json` (85 BPM, period 17.6 f).

| f | Visual event | Anchor (audio) | Anchor f | Δ f | beat Δ |
|---|---|---|---|---|---|
| 0 | stage + logo, no fade | VO "The" + bed bass | 0 | 0 | — |
| 5 / 8 / 14 | digits fly in (fragment; 7+1; 6) | "year" / "is" / "1976." | 3.5 / 7.5 / 11 | +1.5 / +0.5 / +3 | −5 / −2 / +4 |
| 33 | "1976" assembled | end of "1976." | 25 | **+8** | +5 |
| 64 | 1976 splits | "place" + bass note f66 | 63.5 | +0.5 | +2 |
| 68 / 80 / 91 | seed / Capitol / rowhouses unfold | "is" / "Washington," / "DC," | 69 / 74 / 90.3 | −1 / +6 / +0.7 | +6 / 0 / −6 |
| 164 | collage whip-out starts | **bass note f163** (VO pause; "specifically" f167) | 163 | **+1** (−3 vs word) | −3 |
| 184 | map card lands | "their" | 183.5 | +0.5 | −1 |
| 211 / 214 / 226 | label cursor / boxes / complete | **bass f212** / "WHUR." onset / — | 212 / 219.5 / 219.5 | −1 / −5.5 / +6.5 | +9 / −6 / +6 |
| 241 | push starts | end of "WHUR." | 243 | −2 | +4 |
| 291 | **push stops dead + X starts** | "Washington," (stressed) | 291 | **0** | 0 |
| 303 | X complete | end of "Washington," | 305 | −2 | −5 |
| 314 / 316 | torn iris / **CUT** | "DC" onset (energy f316) | 316 | −2 / **0** | +6 / +8 |
| 326 / 341 | 19/76 rise starts / settled | "1976," onset / end | 330.5 / 342 | −4.5 / −1 | 0 / −2 |
| 389 | record appears | end of "this." + bed's last hit (F#2 + 7 kHz burst f389–396) | 389 | **0** | −6 |
| 394–401 | record reaches full size | needle-drop thump | 401 | −7…0 | — |
| 414 / 421 / 429 | 7 / 6 / 19 sink | song start f412.5 / 8th / beat 430 | 412.5 / 421.5 / 430 | **+1.5 / −0.5 / −1** | +1 / +8 (half-beat) / −1 |
| 454 | crash push starts | vocal "what's" (energy rise 454.5) | 454.5 | −0.5 | +6 |
| 457 … 591 | 21 caption tokens | each vocal word | — | median **+1**, range −2.5…+7.5 | mean abs 4.0 (≈ random) |
| 613 | line dims to "CC" | VO "is" | 611 | +2 | +6 |
| 618 / 626 | record sinks / CC splits | VO "Chocolate" | 620 | −2 / +6 | −7 / +1 |
| 644 | CHOCOLATE CITY complete | end of VO "City" | 636 | **+8** | +1 |
| 679 | credit drops | VO "Parliament." | 673.5 | +5.5 | +1 |
| 697 | **CUT** to photo | music hard stop f689 / VO "In" f705 | 689 / 705 | **+8 / −8** | +1 |
| 705 | pull-back at peak speed | VO "In" | 705 | 0 | −8 |
| 723 | pull-back stops | end of "1976," | 718 | +5 | −8 |
| 785 | pull-out into cut starts | end of "DC." | 778 | +7 | +1 |
| 791 | **CUT** to shot 4 | VO "and" (voice energy f792) | 791 | **0 / −1** | +7 |

Caption tokens (vocal onset → caption frame, Δ):

| Line | Tokens |
|---|---|
| 1 | WHAT'S 458.5→457 (−1.5) · HAPPENING 462→463 (+1) · CC 470→469 (−1) |
| 2 | THEY 497.5→501 (+3.5) · STILL 502.5→504 (+1.5) · CALL 506.5→507 (+0.5) · IT 512.5→510 (−2.5) |
| 3 | THE 516.5→516 (−0.5) · WHITE 519→519 (0) · HOUSE 523.5→522 (−1.5) |
| 4 | BUT 532.5→535 (+2.5) · THAT'S 534.5→538 (+3.5) · A 541.5→541 (−0.5) · TEMP 543→544 (+1) · ORARY →551 |
| 5 | CON 549.5→557 (+7.5, line break) · DI →560 · TION TOO 562.5→563 (+0.5) |
| 6 | CAN 573.5→572 (−1.5) · YOU 575.5→579 (+3.5) · DIG 578.5→582 (+3.5) · IT, 582.5→588 (+5.5) · CC 588→591 (+3) · ? →594 |

**Rules observed (with numbers).**
1. **Narration-tied entrances start on the word**: entrance/move onset − word onset = median +0.7 f (n = 15, IQR −1…+5). The graphic is complete by the **end** of the keyword (−2…+8 f; 1976 +8, 19/76 −1, X −2, CHOCOLATE CITY +8).
2. **Camera moves end on the stressed word, not after it**: the push stops dead at "Washington," (0 f). The pull-back reaches peak speed on the first VO word after the cut (0 f) and stops +5 f after the phrase ends.
3. **Pauses belong to the music.** Events that start in a VO pause snap to the bed's bass-note onsets (f164 +1, f211 −1, f64 −2; 10 of 28 S1/S2a events lie within ±2 f of a bass onset vs ≈6 expected by chance) and land 3–9 f **before** the next phrase. Epigenetics' "0.2–0.5 s after the pause" holds only mid-sentence.
4. **Not beat-quantised.** Over all 62 events the mean |offset| to the 85 BPM grid is 4.15 f, which equals chance (4.4 f). The exception is narration-free music: once the song plays, the three digit exits sit on its pulse (+1.5, −0.5, −1 f; 8th-note spacing 7–8 f).
5. **Cuts land on phrase onsets** (f316 "DC" 0 f, f791 "and" 0/−1 f). The one section cut lands **8 f after a hard music stop** and **8 f before the VO** (f689 → f697 → f705).
6. **Quotes are word-locked**: caption token = vocal onset +1 f median (19/21 within ±3.5 f; the two outliers are CON +7.5 f, a line break, and IT, +5.5 f). Tokens follow syllables for long words (TEMP|ORARY, CON|DI|TION). Line breaks fall on vocal phrase starts (within ±3 f of the song's beats at f501, 516, 535, 572 because the vocal is on the groove).
7. **Show the source before the sound**: the record appears **23 f before** the song (f389 vs f412). Its fly-in ends 3 f before the needle-drop thump (f398 vs f401).
8. **"Explain after saying"**: when the VO names something already on screen as an abbreviation, isolation starts +2 f after the verb ("is") and the expansion completes +8 f after the name ends.

## 13. Sound design
### 13.1 What plays when
| Span (f) | Shot | Content | Level (dBr, p50 / p90 of M) | Notes |
|---|---|---|---|---|
| 0–389 | S1, S2a | **VO + intro bed** | VO voiced p50 −3.7 (M p90 −1.9); bed alone in pauses p50 −10.5, −12…−20 between notes | bed = stereo bass line (notes 8–10 f long: C3, G2, A#2, F#2; S-channel up to −6 dBr, L/R corr down to 0.1) + stereo hat/shaker every ≈23–24 f (0.91–0.98 s → **≈62–66 BPM**; the 85 BPM grid does not fit the intro) + mono 7–9 kHz shaker bursts (f30–33, f37–43, f347, f354) |
| 389–399 | S2b | bed's final hit | — | bass F#2 (91 Hz) f388–396 + 7 kHz noise burst (attack 1 f at f390, decay 6 f) on the record's appearance; bed dies out f397–400 (−5 → −17 dBr) |
| 401 | S2b | **needle-drop thump** | −13 dBr (low band −13.5) | 1 f low thump |
| 401–411 | S2b | **vinyl crackle** | −24 dBr | HF kurtosis 64 / 1109 (L/R), HF L/R corr 0.03 = random stereo pops |
| 412–594 | S2b, S2c | **song solo** ("Chocolate City" intro: groove + Clinton's spoken vocal) | p50 −10.6, vocal p50 −7.2 (≈3.5 dB under the VO) | near-mono (corr 0.97), mid-heavy; **≈86 BPM** (onset autocorrelation 0.695 s, so the 85 BPM `rhythm.json` grid is valid here); **starts hard** (−28 → −4 dBr in 2 f, f411–413) |
| 595–688 | S2d | **song ducked under VO** | floor in VO pauses −27…−36 (f616–618, f641–642); VO p50 −6.9 | S-channel −31 → −48 (≈17–20 dB duck) |
| 689–697 | S2d → cut | **silence** | −48 → −60 dBr | everything stops in 1 f (f688 −19 → f689 −42); 9 f of dead air across the cut |
| 698–725 | S3 | **sub swell** | S −13…−20 dBr, 35–100 Hz, L/R corr −0.4…−0.03 | attack f698–704 (−50 → −16), sustain to f718, decay f719–725 (−19 → −44) |
| 705–784 | S3 | VO over a quiet bed | VO p50 −6.5; bed ≤ −24 dBr in pauses | — |
| 784–810 | S3 → S4 | **sub drone** | S −17…−22 dBr | descending G#1 → F1 (53 → 44 Hz), starts 5 f before the cut f791 and continues across it |

### 13.2 Ducking and entries
| Case | Measurement |
|---|---|
| Intro bed under VO | **no ducking**: S-channel −29.3 dBr with VO vs −30.4 in pauses. The bed is *arranged* out of the voice band (bed mid band −21…−30 dBr vs VO −9) |
| Song → VO | duck starts **f595**, 1 f after the last vocal word ("CC?" ends ≈f594); −9 → −29.5 dBr in **5 f** (f595–599), linear in dB; VO "This" at f603.5 (**duck leads the VO by 8 f**). Depth ≈20 dB. No release |
| Song exit | **hard stop in 1 f** at f689 (8 f before the picture cut, 16 f before the next VO word) |
| Song entry | after the diegetic intro: thump f401 → crackle 11 f → song f412 (full level by f413) |
| Bed re-entry (S3) | sub swell starts f698 (**+1 f after the cut**), VO +8 f |

### 13.3 SFX inventory (from spectrogram + M/S)
| f | Sound | Signature | Accompanies |
|---|---|---|---|
| 30–33, 37–43 | shaker/swish (probably part of the bed: the same sound recurs at f347 and f354 over static frames) | mono, 7.5–9 kHz centroid, attack 0.5 f, 2.5 / 6 f long, peak −6.4 dBr HF | the first burst ends as the digits lock (f33); the second plays over the static "1976" |
| 388–396 | final hit / swish | F#2 bass + 7 kHz noise, attack 1 f, decay 6 f, HF −7 dBr | record appears (f389) and grows |
| 401 | needle-drop thump | low band −13.5 dBr, 1 f | record at full size |
| 401–411 | vinyl crackle | impulsive (kurtosis ≫ 3), decorrelated L/R | spinning record, pre-song |
| 689–697 | dead air | −60 dBr | frozen title, cut |
| 698–725 | sub swell / boom | 35–100 Hz, out-of-phase stereo, 6 f attack, ≈27 f total | cut to photo + pull-back |
| 784–810 | sub drone downward | 53 → 44 Hz | pull-out-through, cut f791 |

**Not sonified**: the whip-out (HF < −38 dBr, f164–175), the stop-motion card poses, the defocus swap, the X, the torn iris, the crash push (HF −22…−28 dBr), the line scrolls and the CC unpack. In this style **motion is mostly silent**: sound marks only *source* changes (record, needle, song, section).

## 14. Visualizer / audio-reactive graphics
| Element | Driven by | Mapping | Lag |
|---|---|---|---|
| Karaoke captions (f457–594) | archival vocal **word/syllable onsets** (from a transcript, not the signal) | 1 token per word or syllable chunk, rise 95 px + fade in 3 drawings | +1 f median (quantised to the 3-frame text grid) |
| Digit sinks (f414–429) | song pulse | 1 glyph per 8th note after the song starts | +1.5 / −0.5 / −1 f |
| Spinning record | nothing (constant) | 8.5°/drawing, the same during silence (f396–411) and music | — |
| CC isolation / unpack | VO words "is", "Chocolate City" | step changes | +2…+8 f |

**There are no waveforms, EQ bars, level-driven scaling or pulsing in segment A.** The "visualizer" is typographic (lyrics) and diegetic (vinyl). If the kit wants a reactive layer, drive it from **word onsets** (as Vox does). Use band energy only for secondary motion (§15 R14).

## 15. Rules for the kit
R1. **Cue sheet first.** Each visual key = `{anchor: wordId | musicEvent | cut, offsetF}`. Default offsets: entrance start **+1 f** after the word onset; completion ≤ **+8 f** after the keyword's end.
R2. **Pre-roll after pauses.** If the key word follows a VO pause ≥ 0.35 s, start the element in the pause on the nearest bass-note onset or bed hit within **[−9, −1] f** of the word, so it is readable when the word lands (label −8.5 f, digit rise −4.5 f).
R3. **Camera moves end on the stressed word.** `SnapPush`: ease-in, last key = word onset, stop dead (no tail). `PullBackReveal`: start on the cut, peak speed on the first VO word (≈+8 f), stop ≤ +5 f after the phrase ends, then hold dead.
R4. **Cuts** on phrase onsets (0…−1 f). Section cuts follow a **hard audio stop**: music + VO out in 1 f, **8–9 f** of silence, cut, new bed at +1 f, VO at +8 f.
R5. **Don't quantise to beats while the VO talks** (Earworm A is beat-neutral: 4.15 f vs 4.4 f random). Quantise to the music grid (8th notes, ±2 f) only in narration-free music passages.
R6. **Quote captions**: one token per vocal word, syllable chunks for words longer than 3 syllables, `f = ceilToTextDrawing(onset + 1)`, text grid = 3 f, rise 95 px + fade over 9 f, ease `enter`. Max 2 lines (current 100 %, previous 35 %, pitch 1.6 cap). Scroll in 1 drawing at vocal phrase starts.
R7. **Song introduction**: picture of the source ≥ 20 f before the music; fly-in ≤ 12 f ending 3 f before a needle thump; 0.4–0.5 s crackle; song starts hard (−28 → −4 dBr in 2 f) on a beat. Let it play solo ≥ 7 s before the VO returns.
R8. **Ducking**: duck depth 20 dB, linear-in-dB ramp of 5 f, starting 0–1 f after the archival phrase ends and ≥ 8 f before the VO. No release ramp: end the ducked music with a 1 f hard stop at the section change.
R9. **Bed under VO**: no ducking; build the bed from low bass (< 200 Hz, notes up to −3 dBr) and hats/shakers (> 5 kHz). Keep the bed's 200 Hz–2 kHz band ≥ 12 dB under the VO (measured −21…−30 vs −9 dBr). Bed alone ≈ −10.5 dBr p50, VO ≈ −3.7 dBr p50.
R10. **Sonify sources, not motion**: SFX only for diegetic objects and structure (needle thump, crackle, sub swell on a section cut, sub drone into a match cut). Whips, card placements and text get **no whoosh**.
R11. **Ducking envelope from words** (`volume(f)`): `gainDb = −20 · clamp((f − (vocalEnd + 1)) / 5, 0, 1)` until the stop frame, then −∞ in 1 f.
R12. **Cadences**: graphics `posterize(10)`, caption text `posterize(8.33)`, photo moves `posterize(12)`. Audio and VO always on ones. If delivering at 25 fps from a 24 fps master, expect a duplicated frame every 25 f.
R13. **Keyword isolation**: dim the line to 35 % in 1 drawing starting +2 f after the copula ("is"). Remove it within 10 f. Unpack the abbreviation at ≈1 char/frame, completing ≤ +8 f after the spoken name ends. Credit line +5…+8 f after its name.
R14. If a reactive layer is added (not in the reference): drive discrete events from word/onset lists. Drive continuous motion only from the low band (< 200 Hz) with ≥ 2 f smoothing and stepped at the graphics cadence, so it reads like the bed's bass notes rather than a meter.
