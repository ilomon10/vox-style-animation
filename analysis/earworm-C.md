# Vox "Earworm: Quiet Storm", segment C: title cards, black drop, instrument crane, Melvin and Vaughan (`earworm` f1740–2782, 69.60–111.32 s)

> Analyst: C. Sources reviewed: keyframe sheets `sheets/earworm/sheet_023–041`; AV timelines `av/earworm_064.00-072.00` … `104.00-112.00`; 7 new full-rate strips; 7 new mid/side spectrograms, 2 frame grids and 11 native grabs (`stills/earwormC/`); `metrics/earworm.csv` and `_shots.md`; `audio/earworm_words.json`, `_features.csv` and `_rhythm.json`.
>
> I also re-analysed the 48 kHz stereo track myself, as **mid = (L+R)/2** and **side = (L−R)/2** at 10 ms hops. The narration is mono and centred, so it cancels out of the side channel almost completely. The side channel therefore carries only the music, SFX and archival stereo. That is how beds, SFX and ducking are separated from the voice below.
>
> Conventions:
> - Frames are GLOBAL, at 25 fps. The source is 1920×1080, so px are already @1080p.
> - **Offset = visual frame − audio frame**: positive means the picture comes AFTER the sound.
> - "dB" means dB relative to the segment's mix peak unless marked `rms_db` (from features.csv).

## 1. Summary of the look (what is new compared with `epigenetics.md`)
- **Full 16:9 picture, no 4:3 pillarbox.** The Vox bug sits inside the picture at the top right (x≈1716–1890, y≈30–116). It reads #CDCDCF on black and only ≈#E6E6E6 on white, like a faint emboss.
- **Two grounds alternate, with no desk and no yellow.**
  - Ground 1 is **white paper**: #F6F6F6, fibre texture σ≈3–4.
  - Ground 2 is **stage black**: #0B0B0B–#0C0C0C, σ 0.5–2.6, with faint mottling and torn-paper scraps.
  - Everything else is **black-and-white photo cut-outs** with torn white outlines.
- **One accent: indigo.** Cables are #3A4A89, vinyl labels #4F538A, bokeh glow #4553A8 with a #6B72DA core. It covers ≤8 % of pixels. (Epigenetics used yellow.)
- **Title cards are a single giant condensed word** (cap 177–224 px = 16–21 % of the frame height).
  - The letters start scattered and converge.
  - A cut-out photo sits *inside* the word and hides 1–2 letters ("S PEE▮CHE S", "PO▮TRY", "N EW▮SHO WS").
- **Text-filled silhouettes.** Shirts and hats are filled with handwriting; heads are filled with newsprint. The newsprint head is reused as a mask-wipe transition (S21 in and out, and into segment D).
- **The music montage is ONE 18 s multiplane crane, not a cut cluster.**
  - The camera tilts down ≈5300 px (metric estimate; near layers travel up to 4× more) through a vertical stack of instrument cut-outs.
  - Depth layers move at speeds that differ 1.5–4×.
  - It ends with a dolly-in that blows the foreground off the frame.
- **Two drawing rates.**
  - 12 drawings/s (eleven 2-frame holds and one 3-frame hold per 25 f): crane, newspaper, Vaughan.
  - ≈10 drawings/s (2-3-2-3 holds): title cards, Melvin collage.
  - Fades and dissolves run on ones.
- **Soft transitions are back** (epigenetics had none):
  - a 27 f fade to black, 13 f of black and a 17 f fade-up;
  - a 7 f dissolve;
  - defocus/bloom push-throughs;
  - newsprint mask wipes.
- **Sound drives the edit.**
  - Cuts land on narration word onsets.
  - Exit moves fire on the next keyword or on a 13–15 f audio pre-lap.
  - Music hard-stops on sentence ends.
  - One near-silence precedes the montage "drop".
  - Camera moves are **not** locked to the music grid.

## 2. Shot log
The detector's S12–S15 (f1904–1920) and S17–S18 (f2382–2387) are not cuts. The first is a linear fade to black, the second a linear dissolve. The "rapid cut burst at 76 s" and the "95 s cut cluster" do **not exist**. Both are merged below.

| Shot | f (t s) | Content / composition | Layers (back→front) | Motion | In / out |
|---|---|---|---|---|---|
| S9 SPEECHES | 1740–1773 (69.60–70.96) | White paper. Word "SPEECHES" in black condensed caps across 74 % of the width (x 237–1662, cap 197 px, y 442–640). B/W cut-out of activists (raised fist, V-sign, a woman with an afro) inserted between "PEE" and "CHE", with a printed book page glued behind the arms. Newsprint strips at the foot | paper → page scrap → letters → photo → strips | Letters converge horizontally f1740–1759 (19 f). Hold. Contraction ×0.92 f1768–1772 | in: cut on "speeches" · out: contraction cut |
| S10 POETRY | 1774–1809 (70.96–72.40) | Black. Off-white "POETRY" (cap 224 px). Poet in a bucket hat with a microphone; shirt and hat filled with cursive handwriting; "E" hidden | black → letters → poet → torn baseline strip | First drawing held 3 f. Letters converge vertically f1777–1790 (Y top 159→423, P top 633→423). Contraction ×0.91 f1802–1806, 3 f hold | cut / contraction cut |
| S11 NEWS SHOWS | 1810–1936 (72.40–77.48) | White. "N EWS SHO WS" (cap 177 px). Three people at a press table ("PITTS MOTOR"), torn newsprint strip below, curled photo corner | paper → letters → photo → curl → strip | Converge f1810–1835 (25 f). Corner curl flattens f1810–1818. Hold f1835–1897 (drift <1 px/drawing). **Fade to black f1898–1924**, black f1924–1936 | cut / fade-black |
| S16 crane montage | 1937–2387 (77.48–95.52) | Black stack of B/W cut-outs: Fender Rhodes with label "FENDER RHODES"; Minimoog/ARP; speaker cabinets; reel-to-reel and big tape reels; trumpet; Miles Davis LP; bass and electric guitars; Earth Wind & Fire LP; sax; Head Hunters LP; vinyl (indigo labels); indigo cables. Ends on a singer collage (vinyl, guitar, women, child, newsprint) | black → scraps → far / mid / near cut-outs (parallax) → label | Fade-up and pull-back ×0.80 f1937–1962. Hold. Crane 1 f1976–2084. Drift. Crane 2 f2120–2203. Hold f2205–2241. Dolly-in f2241–2291. Build f2297–2381 | fade-up / dissolve |
| S19 newspaper | 2382–2475 (95.28–99.04) | Washington Post 1979 clipping "Airing the Moods of Melvin Lindsey" (italic serif headline, newsprint, halftone at right), small white source tag top-left | page | Lands on a moving tilt −452 px f2389–2412. Drift. Accelerating pull-out ×0.85 f2468–2474 | dissolve / pull-out-through |
| S20 Melvin collage | 2476–2634 (99.04–105.40) | White with an oversized light-grey "WHUR 96.3" type wallpaper (cap ≈130 px). Melvin Lindsey portrait with torn edge; tape reel; "A QUIET STORM" LP; "MELVIN LINDSEY" label; WHUR sticker; "Lindsey" scrap; indigo scribble | wallpaper → portrait → reel/LP → labels → scribble | Overscaled defocused head settles in 2 drawings (f2476–2480). Build f2484–2505. Collage ×1.08 over the shot. Wallpaper drifts −45 px/s. Exit push-through f2621–2634 | overscaled head / push-through |
| S21 Vaughan | 2635–2782 (105.40–111.32) | Black. Sarah Vaughan singing, in profile, torn white outline with an indigo edge strip. Labels "SARAH VAUGHAN" + "STARDUST". Swinging microphone. Indigo bokeh visualizer row | black → bokeh/bars → photo → mic → labels | Newsprint-head mask lifts f2635–2645. Labels f2651/2656. Mic swing f2656–2668. Visualizer f2651–2782. Newsprint head covers her f2770–2778, then a defocus push f2779–2782 | mask lift / mask cover + cut f2783 |

## 3. Color
| Token | Hex | Role | Evidence |
|---|---|---|---|
| paper-white | #F6F6F6 (p10 #F3F3F3, p90 #FAFAFA) | title-card / collage ground | f1760, f1850, f2511 |
| paper-shade | #ECECEC–#F1F1F1 | uneven paper light | f1760 top right, f1850 |
| stage-black | #0B0B0B–#0C0C0C (σ 0.5–2.6) | montage, POETRY and Vaughan ground | f1794, f1968, f2724 |
| title-ink | #161616 (p10 #141514) | letters on white, with white speckle distress | f1760 |
| title-paper-type | ≈#EDEDED on black | letters on black | f1794 |
| wallpaper-grey | #DDDCDD on #F6F6F6 | "WHUR 96.3" background type | f2511 |
| label-strip | #282627–#393939 | torn charcoal label strips / boxes | f1968, f2511, f2724 |
| label-type | #D6D5D6–#F9F8F9 | label caps | same |
| indigo-cable | #3A4A89 | cables, edge strips | f1968 |
| indigo-label | #4F538A | vinyl centre labels | f2282 |
| indigo-glow / core | #4553A8 / #6B72DA | bokeh dots and bars | f2724 |
| newsprint | page #C5C5C5–#CDCCCE, headline panel #C9C9C9, ink #201F20 | S19 page, silhouette fills | f2440, f2637 |
| logo | #CDCDCF on black / ≈#E6E6E6 on white | Vox bug | f2724, f1760 |

**Grade.**
- Photos are fully desaturated: frame saturation 0.004–0.06 outside the indigo. One sepia-tinted photo of the singer (f2297+) is the only warm image.
- Blacks are true black (#0B0B0B, no lift). Whites reach #FAFAFA, which is brighter than the epigenetics cap.
- In the montage only, **edge prism fringes** appear: the left 40 px have mean saturation 2–12 (p99 70–131) against ≈0 in the centre (f1968, f2058, f2282). The title cards are clean.

## 4. Typography
| Style | Role / example | Case | Cap height @1080 | Class | Colour / background | Reveal | Commercial ≈ | Free ≈ |
|---|---|---|---|---|---|---|---|---|
| Display condensed | Title cards: SPEECHES, POETRY, NEWS SHOWS (and JAZZ in segment B) | CAPS | 177–224 px (16–21 % H); word width 1213–1585 px | Heavy condensed grotesque, square counters, letterpress speckle | #161616 on white / off-white on black, no box | Letters scattered → converge (§7). A photo occludes 1–2 letters | Druk Condensed / Knockout | **Oswald 700** (or Anton) |
| Label caps | FENDER / RHODES, MELVIN LINDSEY, SARAH VAUGHAN | CAPS | 60–65 px (Rhodes), 48 px (Melvin), 47 px (Vaughan) | Condensed bold | Off-white on charcoal torn strips (#282627–#393939). Two-line labels sit offset (line 2 shifted right ≈100 px, overlapping) | L→R wipe (f1937–1941), slide from the right (f2493–2501), rise (f2651–2655) | Oswald-like | Oswald 600 |
| Sub-label | STARDUST | CAPS | 31 px | same | on a black tape strip, below and right of the main label; a handwriting scrap between them | pops one drawing after the label (+5 f) | — | Oswald 600 |
| Wallpaper | "WHUR 96.3" rows | CAPS | ≈130 px | condensed | #DDDCDD on white, rows offset, cropped by the frame | linear drift −45 px/s | — | Oswald 700 |
| Newsprint / archival | "Airing the Moods of Melvin Lindsey", silhouette fills | mixed | headline lines ≈110 px tall on a 195 px pitch (f2440 framing) | italic serif + body newsprint | real scans, ink #201F20 | carried by the page | — | scans |
| Source tag | "The Washington Post \| 1979" | Title | ≈15 px (estimated) | small sans | white on the page, top left | present with the page | — | Inter |

Rules:
- One display word per title card, and never more than two type styles on screen.
- Labels name things (an instrument, a person, a song) and sit near a corner of the subject.
- Display words name categories.

## 5. Layout & composition
- **Title cards.**
  - The word is centred (centre x≈950) on a band at y≈410–650.
  - The edge letters bleed to ≤40 px from the frame edge at the start and settle 138–390 px from the edges.
  - The photo is centred on the word and taller than it (≈80 % H), overlapping 1–2 glyphs.
  - Small newsprint strips sit under the photo.
- **Crane.**
  - Objects are scattered at ±10–40° rotation, with no grid.
  - At any moment 3–5 objects are in frame, cropped at the edges.
  - Indigo cables loop between objects as connective lines.
  - A single label sits next to its instrument.
- **Portraits (S20, S21).**
  - The subject is off-centre: left third for Vaughan, centre-left for Melvin.
  - Labels sit at the lower right (Vaughan label x≈1300–1760, y≈800–960).
  - Props (microphone, reel, LP) occupy the opposite upper corner.
- **Depth.**
  - Real parallax in the crane (§7) and a two-layer drift in S20 (wallpaper −45 px/s against collage ×1.08).
  - Defocus is used only in transitions (S19→S20 head, S20 exit, S21 exit).

## 6. Textures & materials
| Item | Measurement | How to generate |
|---|---|---|
| Paper ground | #F6F6F6, σ≈3–4, soft fibres, darker patches to #ECECEC | static feTurbulence (0.8, 2 octaves) at 4 % multiply + one large soft gradient |
| Black ground | #0B0B0B, σ≤2.6, faint blotches, torn grey paper scraps at the edges | flat fill + 2–3 % noise; scrap PNGs |
| Torn white outline | 6–20 px uneven white border around photo cut-outs; jagged "torn" edge on scraps | dilate the alpha by 10 px, displace with turbulence (scale 6), fill white |
| Text-filled silhouette | figure or head alpha filled with handwriting (S10) or newsprint (S21 heads, S9 page) | `mask-image` of the cut-out over a text texture |
| Letter distress | white specks inside black strokes (1–4 px) | threshold noise subtracted from the glyph fill |
| Charcoal label strips | #282627–#393939, torn top/bottom edges, slight grain | rect + torn-edge mask |
| Indigo bokeh | dot glow Ø≈110 px (blue > 45), core #6B72DA, Gaussian falloff; bars are 3–6 px cores with a ≈40 px glow | radial gradients + blurred vertical lines, `mix-blend-mode: screen` |
| Edge prism | montage only, left/right ≤40 px coloured fringe | chromatic offset ramp at the frame edges |
| Grain | none measurable on black (σ 0.5 in flat areas); paper texture static | — |

## 7. Motion language
**Stepping.**
- S16, S19 and S21 run at **12 drawings/s**, with steps `2×11 + 3` per 25 f: `posterize(f, 25, 12)`. Measured over 205 drawings: 187 steps of 2 and 17 of 3.
- S9–S11 and S20 run at **≈10 drawings/s**, steps 2,3,2,3 (mean 2.46–2.51 f).
- Fades and the dissolve run on ones.

| Motion | Evidence | Duration | Profile (measured) | cubic-bezier | Notes |
|---|---|---|---|---|---|
| Letter converge, horizontal | SPEECHES f1740–1759 (right S 1917→1662 px) | 19 f | 0, .34, .61, .76, .87, .93, .98, .99, 1 (τ≈4.3 f) | (0.1, 0, 0, 1) | starts on the cut frame |
| Letter converge, vertical | POETRY f1774–1790 (Y −264 px, P +210 px) | 16 f (3 f held first) | 0, .42, .67, .82, .91, .97, 1 | (0.4, 0.8, 0.2, 0.8) | the photo "pops" (brightens and rises) at f1777 |
| Letter converge, slow | NEWS f1810–1835 (left edge 0→195) | 25 f | 0, .22, .48, .63, .74, .83, .89, .94, .97, .98, 1 | (0.3, 0.8, 0.4, 0.9) | plus the curl flattening, 8 f |
| Pre-cut contraction | f1734–1737 (JAZZ ×0.93), f1768–1772 (×0.92), f1802–1806 (×0.91) | 2–3 drawings (5–6 f) + 1–3 f hold | 6, 24, 24–30 px per side per drawing (accelerating) | (0.5, 0, 0.75, 0) | fires on the next word (§12) |
| Fade-up pull-back | f1937–1962 | 25 f | zoom/drawing .976, .956, .972, .966, .980, .977, .988, .984, .993, .991, .997, .996 (×0.80) | expo-out | under a linear luma fade |
| Crane 1 (tilt down) | f1976–2084 | 108 f | creep 3–9 px/drawing for 38 f → ramp → 150–300 px/drawing → brake 165, 75, 66, 18 | (0.8, 0, 0.6, 0.7) | long ease-in, abrupt 8 f stop (arrival on the tape reels) |
| Crane 2 | f2120–2203 | 83 f | speed doubles every 2 drawings to ≈300 px/drawing (f2145–2153), then halves every ≈10 f | (0.6, 0.3, 0.1, 1) | peak at 35 % of the duration, as in Vox `push` |
| Parallax | block matching f2074, f2130, f2166 | — | layers at 36/63/75/87, 51/93/126/210 and 51/66/78 px per drawing | — | near : far = 1.5–4× |
| Multiplane dolly-in | f2241–2291 | 50 f | near-layer zoom/drawing 1.003→1.064 (×1.67), then a 2.5 % rebound over f2287–2295 | (0.6, 0, 1, 1) + rebound | foreground (sax, LPs) exits; the hero barely scales |
| Emergence build | f2297–2381 | 84 f | secondary cut-outs slide 60–100 px out from behind the hero; group ×1.1; vinyl spins | linear | no pops |
| Dissolve onto a moving tilt | S19 f2389–2412 | 24 f | 0, .29, .54, .68, .78, .85, .90, .94, .96, .98, .99, 1 (−452 px) | ≈ `settle` (0, 0.8, 0.15, 1) | — |
| Accelerating pull-out | f2466–2474 | 8 f | zoom/drawing .997, .986, .964, .892 | (0.6, 0, 1, 1) | into a cut |
| Overscaled defocus head | S20 f2476–2480 | 4 f | zoom/drawing 0.777, 0.879 (×1.47→1); blur → sharp | expo-out | — |
| Element build | f2484, 2486, 2489, 2493–2501, 2505 | 1–2 drawings per item | label slides in from the right over 8 f | ease-out | one item every 2–5 f |
| Push-through exit | S20 f2621–2634 | 13 f | zoom/drawing 1.006, 1.012, 1.022, 1.040, 1.128; tilt −9…−94 px; blur grows; luma 190→220 | `accelerate` | bloom to white |
| Newsprint-head mask lift / cover | S21 f2635–2645 / f2770–2778 | 10 f / 8 f | slides up and off / down and over the face, then a 4 f defocus push | ease-in-out | match device across cuts |
| Mic pendulum | f2656–2668 | 12 f | enters from the top right on its cable, ≈30°→0°, settles | damped, no visible overshoot | lands on the first sung note |
| Dot power-on | f2651–2662 | 11 f | 1–2 dots per drawing from x861 rightwards; far-left dot last | step | — |
| Scribble draw-on | S20 f2541–2596 | ≈55 f | slow, irregular | linear | — |

**Layering rule** (as in epigenetics): nothing animates alone. The letters converge while the photo settles; the label wipes on during the fade-up; the dolly-in clears the frame while the singer collage starts emerging.

## 8. Transitions
| ID | Name | Frame by frame | Length | Trigger (audio) | Build |
|---|---|---|---|---|---|
| C-WTC | **Word-triggered contraction cut** (title cards) | f1768: card shrinks 6 px/side · f1770: 24 · f1772: 30 · f1772–1773 held · f1774 cut to the next card, letters scattered · f1777 first move | 6–8 f (contraction start → cut) | onset of the next card's word | 3 instances: JAZZ→SPEECHES, SPEECHES→POETRY, POETRY→NEWS |
| C-FBF | **Fade to black → black → fade-up "drop"** | f1898–1924: luma −7.7/frame linear (209→0) · f1924–1936: black (13 f) · f1937–1953: +2.8/frame linear to 47 + pull-back ×0.80 | 27 + 13 + 17 f | last word "1976." → music decay → near-silence → new music on f1937 | two opacity ramps on ones; audio as in §13 |
| C-DIS | **Linear dissolve onto a moving camera** | f2382–2388: luma 46.6→176.0, +18.5/frame; the incoming page is already tilting (settles by f2412) | 7 f | new bed pre-lap f2378–2381; "Melvin" f2385.5 | cross-fade on ones + `settle` head |
| C-POT | **Pull-out-through, defocus head** | f2468–2474 zoom ×0.85 accelerating · f2476 cut: portrait at ×1.47, heavy blur · f2478 ×1.14, softer · f2480 settled, sharp | 12 f | swell pre-lap f2463; cut on "smooth" | `accelerate` tail + overscaled blur head |
| C-PTB | **Push-through with defocus + bloom** | f2621–2628 zoom 1.006→1.040/drawing · f2630 ×1.128, blurred, whitened · f2632–2634 dispersing, luma 220 · f2635 cut to black | 14 f | riser pre-lap f2620; cut on the archival "Thanks" | zoom + `blur()` + brightness ramp |
| C-NMW | **Newsprint-head mask wipe** (match device) | in: f2635 a newsprint-filled head silhouette covers the face · f2637–2643 it lifts away · f2645 clear. out: f2770 a silhouette enters top right · f2772–2778 slides over the face · f2779–2782 defocus push · f2783 cut, and segment D lifts the same device off Nat King Cole | 10 f in / 13 f out | voice ("Thanks", "Sarah") / end of a sung phrase | a masked newsprint layer with a profile alpha, slid along a diagonal |
| — | Not present | no whip pans, wipes, flashes or zoom-blur powers-of-ten; hard cuts only in the title cards | — | — | — |

## 9. Reusable components
| Component | Props (defaults from measurements) |
|---|---|
| `TitleCardWord` | `text`, `font:"Oswald 700"`, `cap:200`, `ink:"#161616"\|"#EDEDED"`, `ground:"paper"\|"black"`, `scatter:{axis:"x"\|"y", amp:255}`, `convergeF:19`, `ease:[.1,0,0,1]`, `fps:10`, `photo:{src, hides:[3,4], hFrac:.8}`, `exit:{scale:.92, drawings:3, hold:1}` |
| `TextFilledSilhouette` | `alphaSrc`, `fill:"handwriting"\|"newsprint"`, `outline:{w:10, color:"#FFF", torn:6}` |
| `MultiplaneCrane` | `layers:[{src, x, y, z, rot}]`, `keys:[{f, y, ease}]`, `parallax: speed ∝ 1/z, range 1.5–4×`, `fps:12`, `edgePrism:true` |
| `TornLabel` | `lines:["FENDER","RHODES"]`, `cap:62`, `strip:"#363336"`, `type:"#F0F0F0"`, `lineOffsetX:100`, `reveal:"wipeLR"\|"slideR"\|"rise"`, `revealF:4–8`, `sub:{text, cap:31, delayF:5}` |
| `TypeWallpaper` | `text:"WHUR 96.3"`, `cap:130`, `color:"#DDDCDD"`, `rows:3`, `drift:-45 px/s` |
| `FadeDrop` | `outF:27`, `blackF:13`, `inF:17`, `audioSilenceF:6`, `musicStartOnFirstVisibleFrame:true` |
| `PushThrough` / `PullThrough` | `zoomPerDrawing:[1.006,1.012,1.022,1.040,1.128]` / `[.997,.986,.964,.892]`, `blurMax:24`, `bloom:+30 luma`, `head:{overscale:1.47, settleDrawings:2}` |
| `NewsprintMaskWipe` | `profileAlpha`, `texture:"newsprint"`, `inF:10`, `outF:8`, `tailDefocusF:4` |
| `BokehVisualizer` | `cols:8`, `pitch:188`, `y:695`, `dotGlow:110`, `bar:{w:4, glow:40, hMin:150, hMed:258, hP90:471, hMax:651}`, `fps:12`, `driver:"150–400 Hz band"`, `lagF:1` (§14) |
| `PendulumProp` | `src:"mic"`, `cable:{color:"#3A4A89"}`, `from:{x:+300, y:-400, rot:30}`, `settleF:12`, `landOn:"vocalOnset"` |

## 10. Build notes for code (Remotion/React)
1. **Two posterizers at 25 fps.** `d12 = floor(f*12/25)*25/12` gives the 2-2-…-3 pattern; `d10 = floor(f*10/25)*2.5` gives 2-3-2-3. Reset per `<Sequence>`. Keep `<Audio>`, fades and dissolves on raw frames.
2. **Title card.** Lay each glyph out at its final kerning. Animate an offset `o_i = (x_i − cx)·k(t)` with `k` from 1.18 to 0 (horizontal), or per-letter y offsets ±210–264 px (vertical). Put the photo cut-out above the glyphs. The exit is a group `scale` keyed per drawing (.98, .95, .92).
3. **Crane.** Put each object in a layer with depth `z`. Camera y keys are in px at the reference depth; `screenY = (y − camY)·(z0/z)`. Assign z so that the per-drawing speeds span 1.5–4×. Do the dolly-in by moving `camZ` toward the hero: near layers scale as `1/(z−camZ)` and leave the frame.
4. **Pre-lap audio.** `<Sequence from={cut − 14}>` for the next shot's `<Audio>`, with a linear `volume` ramp over 14 f. Start the outgoing camera tail on the same frame (+1).
5. **Defocus transitions.** Use CSS `filter: blur(px) brightness(x)` per drawing: blur 0→24 px, brightness 1→1.15 over 4 drawings. The incoming head starts at blur 20 and reaches 0 within 2 drawings.
6. **Visualizer.** Use `useAudioData` + `visualizeAudio` (or precomputed band envelopes). Sample at drawing times, with **an absolute envelope** (§14), and map to bar height. Add glow with `drop-shadow`/radial gradients in `screen` blend.
7. **Mid/side for analysis** (tooling): compute S = (L−R)/2. Music beds and SFX remain; the narration vanishes. This is the most reliable way to read beds, pre-laps and ducks from a final mix.

## 11. Evidence index (paths under `analysis/`)
| Path | Note |
|---|---|
| `sheets/earworm/sheet_023–041.png` | all keyframes of f1702–2781 reviewed |
| `av/earworm_064.00-072.00.png … 104.00-112.00.png` | 6 AV timelines |
| `strips/earworm_01738-01779.png`, `_01780-01827.png` | SPEECHES converge and contraction, POETRY, NEWS converge |
| `strips/earworm_01936-01983.png` | fade-up, FENDER RHODES label wipe, pull-back |
| `strips/earworm_02262-02309.png` | dolly-in clearing the foreground |
| `strips/earworm_02466-02513.png` | pull-out-through, overscaled head, S20 build |
| `strips/earworm_02614-02661.png` | push-through bloom, newsprint mask lift, labels, mic, dots |
| `strips/earworm_02758-02797.png` | visualizer, newsprint cover exit, segment D start |
| `stills/earwormC/spec_1690-1815_zoom.png`, `spec_1730-1960`, `spec_1950-2200`, `spec_2195-2445`, `spec_2440-2660`, `spec_2630-2800` | mid/side spectrograms (6–11 px/frame) with word starts and visual events |
| `stills/earwormC/grid_singer_2297-2381.png`, `grid_S20_2501-2625.png` | slow builds (4–5 f steps) |
| `stills/earwormC/f1760_speeches.png … f2724_vaughan.png`, `f2440_newspaper.png`, `crops_labels_type.png` | native grabs; colour and type metrics |
| `metrics/earworm.csv` | cadence, luma ramps, camera |

## 12. Audio–visual sync
**Method.**
- Word onsets were re-measured on the centre speech band (250–4000 Hz, mid minus side) and in the spectrograms.
- **Whisper corrections:**
  - "poetry" is at f1766.5, not 1759.5.
  - "Melvin" (p=0.08) is at f2385.5, not 2372.
  - "The" is at f1950–1951, not 1948.
  - "R&B" is confirmed at f2219.5. The centred chord at f2208–2219 is music, not voice.
- Music events come from the side channel.
- **Tempo check.** In the montage the 16th-note pulse is **0.2145 s = 5.36 f**, and the strongest onsets fall on a **quarter of 0.8585 s = 21.46 f, i.e. 69.9 BPM** (double time 140), from f1955.9. Evidence: side-channel autocorrelation r=0.47 at 43/86 hops against ≤0.10 at 85 BPM. Hi-hats in the music-only gaps land +0.1…+0.5 f after each predicted 16th (mean |Δ| 0.85 f against 1.34 f at random).
- **The rhythm.json 85 BPM grid is wrong for this music** (beat strengths 0.00–0.15). Its "downbeats" drift 13.2 sixteenths per bar of the real groove.

| # | Visual event (frame) | Tied audio event (frame) | Offset f | Note |
|---|---|---|---|---|
| 1 | JAZZ card contraction starts (1734) | "speeches" /s/ (1734.5) | −0.5 | next-word trigger (segment B side) |
| 2 | Cut to SPEECHES; letters start converging (1740) | "speeches" onset 1734.5 / stressed vowel 1737.5 | +5.5 / +2.5 | the word is heard, then seen |
| 3 | SPEECHES letters settled (1759) | "speeches," ends 1755; jazz record hard-stops 1760 | +4 / −1 | — |
| 4 | SPEECHES contraction (1768) | "poetry" onset 1766.5 | +1.5 | next-word trigger |
| 5 | Cut to POETRY (1774) | "poetry" onset 1766.5 (2nd syllable ≈1772) | +7.5 (+2) | — |
| 6 | Poet pops, letters start (1777) | radio whistle burst 1779 | −2 | SFX follows the pop |
| 7 | POETRY letters settled (1790) | "and" 1790 | 0 | — |
| 8 | POETRY contraction (1802) | "shows" onset ≈1800; bed-2 pre-lap 1802–1803 | +2 / 0 | — |
| 9 | Cut to NEWS SHOWS (1810) | "shows" onset 1800 (word end ≈1808); bed-2 onset 1802 | +10 (+2) / +8 | two-word card: cut after the second word |
| 10 | NEWS letters and curl settle (1810–1835) | bed-2 swell peak ≈1812 | ≈0 (start) | — |
| 11 | Hold (1835–1897) | whole sentence "Something changed … 1976." 1844–1908 | — | a static hold carries a full sentence (64 f) |
| 12 | Fade-out starts (1898) | "1976." onset 1890.5 | +7.5 | fades out on the payoff word |
| 13 | Black reached (1924) | "1976." ends 1908; mix reaches near-silence 1931 | +16 / −7 | picture reaches black 7 f before the sound does |
| 14 | Fade-up starts (1937) | montage music onset 1937 | **0** | the drop |
| 15 | FENDER RHODES label complete (1941) | "Fender" 1953.5 | −12.5 | label anticipates the word |
| 16 | Pull-back settled (1962) | "Rhodes" ≈1958–1960 | +2…+4 | — |
| 17 | Crane 1 creep starts (1976) | "massively" 1968–1972 | +4…+8 | weak |
| 18 | Crane 1 accelerates (2014) | "overdosed" 2014.8 | −1 | — |
| 19 | Minimoog crosses frame centre (≈2044) | "synthesizer," 2036–2038 | +6…+8 | object shown on its noun |
| 20 | Crane 1 peak speed (2057–2062) | side broadband hit 2062; "songs" 2062–2063.5 | ≈0 | — |
| 21 | Crane 1 arrives on the tape reels (2080) | "longer" 2075.5 | +4.5 | arrival on the stressed word |
| 22 | Crane 2 starts (2120–2122) | "experimental," ends 2110; synth zap sweeps 2105–2140 | +12 after phrase end | moves in the narration gap, over the sweeps |
| 23 | Trumpet + Miles Davis LP cross centre at peak speed (≈2147–2149) | "and jazz" 2147 | 0…+2 | — |
| 24 | Electric guitar crosses centre (≈2156) | "funk" 2157.8 | −2 | — |
| 25 | Crane 2 arrives (sax + Head Hunters, 2195–2203) | "one." ends 2192 | +3…+11 | hold f2205–2241 under "R&B and soul music," |
| 26 | Dolly-in starts (2241) | "music," 2234; gap 2244–2250 | +7 | — |
| 27 | Foreground cleared, singer isolated (2291) | "of" 2290.8 (after "trajectory") | 0 | — |
| 28 | Secondary figures emerge (2297–2350) | "politically charged music of the 1960s" 2308–2372 | continuous | — |
| 29 | (audio) montage music fast-fades out 2371–2376 | "1960s." ends 2372 | −1 | sentence-end stop |
| 30 | Dissolve starts (2382) | S19 bed pre-lap 2378–2381 | +1…+4 | — |
| 31 | Dissolve ends, headline full (2388) | "Melvin" 2385.5 | +2.5 | name on the page |
| 32 | S19 tilt settles (2412) | "night/tapped" 2409.8 | +2 | weak |
| 33 | Pull-out starts (2466–2468) | swell pre-lap 2463 | +3…+5 | — |
| 34 | Cut to S20 (2476) | "smooth" 2475.5 ("a" 2474) | +0.5 | — |
| 35 | Head settled (2480) | "smooth" vowel 2479 | +1 | — |
| 36 | Build: LP 2489 / label lands 2501 / scrap 2505 | "R" 2490 / "and" 2499 / "B" 2504 | −1 / +2 / +1 | plausible syllable lock, not proven |
| 37 | Scribble draws on (2541–2596) | dry narration, no music | — | — |
| 38 | Exit push starts (2621) | riser pre-lap 2620 | +1 | — |
| 39 | Cut to S21 (2635) | archival "Thanks" fricative 2634.5 / vowel 2636 | +0.5 / −1 | — |
| 40 | Face revealed (2643–2645) | "Sarah" /s/ 2639.5, vowel 2642.5 | +0.5…+3 | — |
| 41 | SARAH VAUGHAN label (2651) | "Vaughan" ≈2646 (ends 2652) | +5 / −1 | label at the end of the name |
| 42 | Dots power on, x861 rightwards (2651–2662) | archival voice ends 2652 | −1 | — |
| 43 | STARDUST sub-label (2656) | — | label +5 | stagger |
| 44 | Mic settles upright (2666) | Vaughan's first sung note 2665 | +1 | — |
| 45 | Bar onsets 2699 / 2764 | sung note changes 2697–2700 / 2764 | 0…+2 / 0 | 2 of 8 bar onsets |
| 46 | Newsprint cover starts (2770) | last sung note, drop to D#3 at 2769 | +1 | — |
| 47 | Cut to segment D (2783) | next song's hiss/bass rising 2768–2784; narration "and" 2795 | −12 vs voice | music-led cut |

**Statistics.**

| Class | n | Offsets (f) | Median |
|---|---|---|---|
| Cuts / transition peaks against the voice onset they illustrate | 7 | +5.5, +7.5, +10 (+2 vs word end), +2.5, +0.5, +0.5, 0 (vs music) | **+2.5** |
| Exit moves against the trigger (next word or pre-lap onset) | 6 | −0.5, +1.5, +2 (0), +3…+5, +1, +1 | **+1** |
| Pre-lap lead (sound onset → cut) | 4 | 8 (bed 2), 4 (S19 bed), 13 (swell), 15 (riser) | **10.5** |
| Objects crossing centre / arrivals against their keyword | 6 | +6…+8, +4.5, 0…+2, −2, 0, +3 | **+2** |
| Montage camera events against the 69.9 BPM quarter grid | 12 | mean \|Δ\| 4.8 f | random expectation 5.4 f → **not beat-locked** |

The montage has **no cuts**. Three of its events (f2080, f2149, f2291) fall within 1 f of rhythm.json's 85 BPM "downbeats" (2081, 2150, 2292). Those are not bars of the real groove, and each event coincides with a stressed narration word. Read it as the narration's stress rhythm, not the music.

## 13. Sound design
| Span (f) | What plays | Level / shape | Visual it serves |
|---|---|---|---|
| 1702–1760 | Jazz record (horn harmonics in the side channel), starts just after "jazz" (segment B) | no duck under the voice; **hard stop at f1760**: −30 dB in 1–2 f | JAZZ → SPEECHES cards |
| 1757–1766, 1779–1803 | **Radio-dial SFX**: heterodyne whistles (≈1 kHz pulsing every ≈5.7 f; 3.5 kHz and 5–8 kHz lines) and static bursts | starts 3 f before the jazz stop; cut out on "poetry" (1766); resumes 1779 | "speeches, poetry, and news shows" = WHUR's broadcasts |
| 1802–1935 | Bed 2: dark stereo pad/groove (weak ≈111 BPM). Pre-laps the NEWS card by 8 f | swells to ≈f1812; ≈−22 dB side under the sentence; decays −13→−60 `rms_db` over f1915–1935 (steepest −4.3 dB/f at f1921–1927) | NEWS SHOWS hold and fade |
| 1931–1936 | **Near-silence** (≤ −47 `rms_db`, min −60.2 at f1935) | 6 f, inside 13 f of black | the breath before the drop |
| 1937–2376 | Montage: jazz-funk groove at 69.9 BPM with straight 16th hats, keys/Rhodes, synth "zap" V-glides (3→1→3 kHz) at f2105–2140 and 2255–2290, broadband hit ≈f2062 | **fade-in from f1937** (+2.4 dB/f to f1950, with the picture); speech-band duck ≈8 dB under the voice, V/M ≈ +10.6 dB; release ≈10 f after a phrase, attack ≤3 f; one gap has no duck; **5 f fade-out at f2371–2376 on the sentence end** | the crane; the sweeps sit under the crane-2 start and the dolly-in |
| 2372–2380 | Narration room tone only | −42…−47 dB | singer collage hold |
| 2378–2438 | S19 bed (smooth pad), 4 f pre-lap before the dissolve | side ≈−37 dB under the voice | newspaper |
| 2440–2462 | **Dry narration** (side at digital silence, −134 dB) | — | newspaper drift |
| 2463–2536 | **Swell**: low (<300 Hz) stereo bloom, rising 2463–2484, decaying to ≈2536 | peaks −12 dB at f2484 = cut +8 f | pull-out-through, S20 build |
| 2536–2619 | **Dry narration** | — | scribble, wallpaper drift |
| 2620–2652 | Vaughan record pre-lap (low orchestra) under the **archival radio voice** "Thanks, Sarah Vaughan" (f2634.5–2652) | rises 15 f to the cut; −19.5 dB in the speech band under the archival voice | push-through, mask lift, labels |
| 2652–2782 | Vaughan, "Stardust" (rubato, weak ≈67 BPM); vocal enters at f2665 | full level, no narration for 143 f | visualizer, mic; newsprint cover from f2770 |
| 2768–2795 | Hand-off to the next song (broadband hiss, rising bass) | — | exit cover + cut f2783 |

**SFX inventory.**
- Radio-dial tuning: whistles and static, f1757–1766 and f1779–1803.
- Synth zap sweeps (part of the music bed): f2105–2140 and f2255–2290.
- Broadband cymbal-like hit: f2062.
- Low swell: f2463–2536.
- Riser / pre-lap: f2620–2635.
- Hiss into the next song: f2768+.
- **No whooshes on the cuts, no scratches, no paper Foley.** Sound marks transitions through *music entries and exits*, not effects.

**Music entries and exits.**
- Hard stops (1–5 f) on sentence ends: f1760, f2371.
- Fades only around black: in at f1937 with the picture; out as a natural decay over 20 f.
- Pre-laps of 4–15 f before the cut.

**The silence/black gap.**
- It is the longest narration gap in the segment: 42 f, from "1976." at f1908 to "The" at f1950.
- It is built as picture fade (27 f) → black (13 f) → audio decay ending 7 f after black → 6 f of near-silence → music and picture start on **the same frame** (f1937).
- Narration re-enters **14 f** after the music, as the fade-up completes (f1951–1953).
- Its role is a chapter break and a "drop": the only point where both picture and sound go empty.

## 14. Visualizer / audio-reactive graphics
- **What it is.**
  - A row of 8 indigo bokeh dots behind Vaughan: pitch ≈188 px; x ≈ 102, 285 … 861, 1047, 1239, 1425, 1602, 1794; y≈695. The dot glow is ≈110 px.
  - Each dot can sprout a vertical light bar centred on it: a 3–6 px core with a glow.
  - The leftmost two columns are mostly hidden by the photo and its indigo outline. The statistics below use the six right columns.
- **Timing.**
  - Dots power on in groups of 1–2 per drawing from x≈861 rightwards (x861 at f2651, x1047/1239 at f2654, x1425 at f2656, x1794 at f2660), with the far-left dot last (f2662), as the archival voice ends.
  - The x1602 "bar" at f2656–2659 is the mic's indigo cable, so it is excluded.
  - Bars run f2662–2782, at **12 fps** (heights change only on drawings).
- **Bar statistics (f2672–2766).**
  - On average 1.50 bars >200 px per frame. Frames with 0/1/2/≥3 bars: 16/28/37/13.
  - Heights >200 px: median 258, p25 243, p90 471, max 651 px.
  - A bar lives 1–4 drawings, flickers high/low on alternate drawings, and decays to ≈½ in ≈8 f (e.g. x1239: 651, 543, 417, 480, 396, 342, 210, 282, 168 at f2706–2722).
- **What drives it.**
  - Frame-level reactivity is **weak**. After removing a 13 f moving average, bar activity correlates with mix loudness at r=0.22 (lag 0) and **0.28 at +1 f**, and with the 150–400 Hz band at r=0.26 (lag 0). The 95 % circular-shift null is 0.18–0.20. Onset flux does not correlate (−0.31…+0.19).
  - At the **phrase scale** it is strong. One-second means of activity follow the 150–400 Hz band with r=0.96:

    | Window | Bars >200 per frame | 150–400 Hz |
    |---|---|---|
    | f2672–2696 (held high note B4–C#5) | 0.52 | 21 dB |
    | f2697–2721 (voice drops to C#4) | 1.48 | 33 dB |
    | f2722–2771 | 2.0–2.2 | 35 dB |

  - Two of eight bar onsets coincide with sung note changes (f2699 and f2764, 0…+2 f).
  - No column has a stable band: best single-band r is 0.47–0.58 against chance maxima of the same order.
- **Mapping to implement:**
  - Per drawing (12 fps), a bar is on with probability `p = clamp((E150–400 − E_lo)/(E_hi − E_lo), .1, .7)`, where E is the band level smoothed over 1 s.
  - Height = 150 + 500·u^2 px (u random, scaled by the instantaneous level relative to the 1 s mean), with lag +1 f.
  - Release: multiply by 0.75 per drawing, with ±25 % flicker on alternate drawings.
  - At most 3 bars at once, and never the same column on consecutive onsets.
  - Gate the system on the vocal: the bars start on the first sung note, the dots before it.

## 15. Rules for the kit (numeric)
1. **Cut on the word, after it starts.** A cut that illustrates a spoken noun lands at **word onset +0…+8 f** (median +2.5). For two-word cards, cut ≤2 f after the second word ends. The word should be *heard first*.
2. **Exits fire on the next keyword.** The outgoing shot's exit move (contraction ×0.92, push or pull) starts at **the next keyword's onset −1…+2 f**, lasts 4–8 f (2–4 drawings, accelerating), and the cut follows **6–8 f** after the exit starts.
3. **Pre-lap the next scene's sound by 10–15 f.**
   - Start the next shot's music or SFX 13–15 f before the cut: a linear ramp from silence, reaching about −7 dB of its final level 5 f before the cut.
   - Start the outgoing camera tail **0–5 f after the pre-lap onset**.
   - The cut itself lands on the next voice onset (±1 f).
4. **Stop music on sentence ends.** A bed hard-stops (≤5 f fade) within **−1…+5 f of the last word's end**. Leave 6–13 f of room tone before the next bed.
5. **The drop.**
   - Fade the picture to black over 27 f (linear luma), starting on the payoff word.
   - Hold black 13 f and let the audio reach ≤ −47 dB 7 f after black.
   - Keep 6 f of silence.
   - Start new music and the picture fade-up (17 f) **on the same frame**.
   - Bring narration back 14 f later.
6. **In montages, follow the narration, not the beat.**
   - Start camera moves in narration gaps (≈+12 f after a phrase end).
   - Pass each object through frame centre on its noun (−2…+8 f).
   - Land arrivals on the next stressed word (+3…+5 f).
   - Do not quantise moves to the music grid; only keep 12 fps.
7. **Labels name, words confirm.** An object label may lead its spoken name by ≤13 f when the shot opens on it. A person/title label lands at the **end of the spoken name (−1 f)**, and a sub-label follows +5 f.
8. **Music-locked props land on musical events.** Land props tied to the music (microphone, visualizer) on the vocal entry (+1 f). Power on ambient lights as the preceding voice ends (±1 f).
9. **Mix.**
   - Music under narration sits about **−8 dB in the speech band** (voice ≈10–11 dB above the music); release ≈10 f after a phrase, attack ≤3 f.
   - Under archival voice, cut the music's speech band ≈20 dB.
   - Allow fully dry narration passages (no bed) between music "illustrations".
   - Keep the louder musical events (sweeps, hits) inside narration gaps.
10. **Cadence.** Use 12 drawings/s for camera-led and music-led shots and ≈10 drawings/s for typographic collage builds. Run opacity ramps (fades, dissolves) on ones.
11. **Analysis tooling.**
    - Treat shot-detector clusters of 3–7 f "shots" as soft transitions: check for linear luma ramps (−7.7/f fade, +18.5/f dissolve).
    - Verify any beat grid on the side channel before using it for sync.
    - Re-check Whisper onsets that have p<0.5 or follow SFX (errors here were 7–13 f).
