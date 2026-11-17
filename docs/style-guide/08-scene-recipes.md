# 08 · Scene recipes

Ready-made shot templates, each lifted from the references. Every recipe gives:
- **Layers**, back to front, with sizes and positions in design px @1080p.
- A **beat timeline** in frames at the style's fps (paper desk 30, others 24), measured from the shot's first frame.
- The **components** that build it.

All graphic motion steps at 12 drawings/s (06). Transitions in and out are listed with the IDs from 07.

---

## Paper desk (30 fps)

### PD-1 · Product / fact card ("Porsche 911 — The price at launch is $6,500")
Seen 13 times with identical timing, so treat it as a fixed template.

| Layer | Spec |
|---|---|
| paper | `Paper kind="grid"` (faint 35 px grid), vignette |
| cut-out | side-view object, 54–64 % W, centred, floor/wheel line at 80–89 % H, **no contact shadow** |
| title box | `HighlightBox` with `paperDeskType.title`, box top at 16.7 % H, centred |
| subtitle | `SubtitleReveal` with `paperDeskType.subtitle`, baseline at 37 % H |

| Frame | Beat |
|---|---|
| 0 | hard cut (or whip-in or push-through, 07). The cut-out is **already ≈70 % through its slide**: +75…+207 px → 0 in 5–9 f (`enter`, first step motion-blurred); or scale 0.79 → 1 |
| 6–10 | title box starts as a 24 px bar and crawls, then sweeps: 22–32 f, `boxWipe`; the text is revealed with the box |
| +5 after the box | subtitle reveals L→R (feathered, ≈36 px/f), ≈15–20 f |
| ≈40–60 | hold 0.7–1.9 s with a slow push (+2.9 %/s) |
| out | flash-shrink → footage (T-FS), push-through (T-PI), or a hard cut |

### PD-2 · Year card / year odometer ("2024 → 1900")
| Frame | Beat |
|---|---|
| 0 | cream paper (optionally laid lines); the year in `paperDeskType.year`, centred |
| 0–28 | odometer: 12 values (2024, 2018, 2007, 1994, 1980, 1965, 1951, 1936, 1923, 1911, 1903, 1900), one per drawing, each re-centred; progress ease `(.18,−.04,.79,1.09)` |
| 20–42 | highlighter sweep under the final year: a bar first, then a fast sweep, ≈22 f; padding ≈0.6× numeral height |
| hold ≈25 f | then a ghost pre-blend (next shot at 7 % for 3 f) and a hard cut |

### PD-3 · Quote card (bookends: the opening and the final shot)
| Layer | Spec |
|---|---|
| paper | grid paper `#FDF4EC` (35 px), crop marks top-right and bottom-left |
| figure | B/W cut-out of the speaker at 59–87 % W, bleeding off the bottom |
| echo | yellow silhouette (+21 px x) **lagging** the figure |
| text | quote (`paperDeskType.quote`) at 19.5 % W, top 30 % H, width 36 % W; attribution right-aligned |

| Frame | Beat |
|---|---|
| 0–6 | empty paper |
| 6–41 | figure slides in from the right (≈740 px, 35 f, `slide`); echo starts 15 f later, lags 3–5 f, settles hidden behind with a 1–2 px rim |
| 6–51 | quote **typewriter** at ≈41 chars/s, the newest glyph at 50 % for one drawing (opening variant: per-word fade, ≈14 f each, 1.7 f stagger) |
| 53–74 | attribution types on |
| hold ≈1 s with a 6 fps boil | then the end: 48 f linear fade to black + 24 f black (T-FB) |

### PD-4 · Callout on a photo or blueprint ("rear-engine design")
| Frame | Beat |
|---|---|
| 0 | photo/blueprint on graph paper, entering by a short settle (×1.09 → 1) or a whip-in |
| 3–15 | **yellow disc** (`#E4D700`, multiply, Ø 360–560) grows from the centre (`discGrow`, 12 f) or flies in from the frame edge (`(.34,−.22,0,1)`) |
| +9 → +17 | leader line (3–4.5 px, `#1F1A17`) draws from the disc diagonally, then horizontally |
| +5 → +15 | **italic label box** (`paperDeskType.calloutLabel` on `#F2E500`, height ≈100) opens **leftward from the line end** (right-anchored), `labelWipe` |
| hold ≈1 s | whip-out to the next callout (T-WH) |

### PD-5 · Map with a place label ("STUTTGART")
| Frame | Beat |
|---|---|
| 0–64 | push-in ×16.7 on a relief map **on ones**, log-space ease `(.61,.09,.65,1.04)` |
| 78–86 | glowing yellow outline of the place draws on (≈8 f, linear) |
| 82–105 | label box (`placeLabel`, cap 90, caps, `#FCED00`, speech-bubble pointer 120×57) wipes: a bar first, then a sweep |
| hold 18 f, then a 14 f wipe-off right→left | continues into a dimmed map (70 %) with portraits rising out of a slot (mask rise, 24 f) and a name label |

### PD-6 · Photo carousel / slideshow
- **Carousel (T-CA).**
  - Rounded B/W cards (r ≈38, yellow rim +7.5) on graph paper, 81 % × 93 % of the frame.
  - Each card slides 7 f, then dwells 13 f.
  - The first card zooms out ×1.76 → 1 over 12 f.
- **Scale-momentum chain (T-SM).**
  - 30 f per card.
  - Cards enter at 0.865–1.165 → 1 in 8–12 f.
  - The exit scale sign alternates.
- **Word-lock montage (T-WL).**
  - 5 f per clipping.
  - The highlighted word stays locked in one screen box.

### PD-7 · Footage with a ▶ caption
- Footage full frame (on ones, own fps) or inside a rounded card (91 % × 83 %, r 24–28, yellow rim).
- The **bullet** (55×64, `#160D0E` on bright footage / yellow on dark) rises ≈125 px from below the frame in 8–10 f (`bulletRise`), then turns −90° to point right in 10–16 f (`bulletTurn`).
- **Caption text** (`paperDeskType.caption`, x 307–312, baseline 974–977) fades in 8–13 f while rising 13 px, starting ≈2 f before the turn ends. It is on ones.
- On the next cut the bullet **persists** and only the text swaps (T-PCap).

### PD-8 · Bar chart / line chart
- Bar chart on cream paper:
  - Title and a tiny source line.
  - 3 yellow gridlines.
  - Charcoal bars 75 px wide on a 127 px pitch, growing staggered (≈4.7 f), 13–22 f each (`grow`).
  - Maroon value labels.
  - A maroon **hand-drawn ring** draws around the highlighted range in 16 f.
- Line chart on black:
  - White glowing axes.
  - A yellow-chartreuse line draws along x at ≈490 px/s.
  - The title types on at ≈26 chars/s.

### PD-9 · Desk scrapbook flyover (finale)
- **World and objects.**
  - World ≈6100×1850 px of desk paper with speckle.
  - Clusters of 2 taped prints + 1 scalloped slip ("356", "911", "Boxster").
  - Props: pen, pencil, highlighter, paperclips, sticky notes, a period newspaper ad.
  - Rotations: photos ±12°, slips ±5–8°, pens ±20–40°.
- **Camera** (`CameraRig`, strict 12 fps):
  - Push ×1.32 in 12 f.
  - Cruise 1080–1540 px/s with roll 0 → −11.4° → +8.2° → −17.1°.
  - Pull ×0.86 at the end.
  - Total 175 f.
- **Finish.** Stronger RGB split (`DESK_SPLIT`).

### PD-10 · Typed statement on crumpled paper ("But the true *revolution* came in 1963")
| Frame | Beat |
|---|---|
| 0–24 | a crumpled sheet rises from the bottom as stop-motion at ≈8 fps with rotation jitter (T-SP) |
| 17–53 | dashed frame (dash 97, gap 87, 4.5 px); typed text at **1 char/frame** (30 cps), roman + italic emphasis (`paperDeskType.typed`) |
| 55–64 | highlighter on "1963" |
| hold, creep zoom +0.2 %/s | punch-in +12 % into the cut (T-PC) |

### PD-11 · Dark-map timeline
- Dark map (`#28231F` → `#060503`) with a glowing cream rail (5 px + 12 px glow) and a ring node.
- **Years scrub R→L** at ≈110 px/f (12 fps).
  - Opacity 1 within ±240 px of the centre; faded beyond ±470.
  - The final year decelerates over 13 f.
- Then a portrait card pushes in while the timeline slides away at 0.3× and fades.
- A yellow marker ring draws around a face (25 f, start ≈125°, clockwise, 2 passes).
- A name label wipes on.

---

## Dark collage (24 fps, on twos, film weave on)

### DC-1 · Tableau build ("the parlour")
| Frame | Beat |
|---|---|
| 0 | bare scratched black plate (persists from the previous scene) |
| 1–12 | crimson damask carpet slides in from the right (≈1765 px, τ 2.2 f, `enter`); top edge at 76 % H |
| 14–20 | sofa drops (gravity, hard landing) → side table (+4 f) → piano (+6 f; the lid flips open 12 f later) → tilt-top table **tips over** (8 f) |
| 48–50 | hero drops into place in 2 drawings (seated figure ≈71 % H, centred) |
| 52–68 | puppet limb: the glass is raised 16 f (ease-out), held 12 f, lowered 16–20 f (ease-in, abrupt stop) |
| hold ≈0.6–1.7 s | crumple-unfold (C-CU) or fall-out (C-FOBI) |

Layers: plate → carpet → furniture (B&W, hard edges, **no shadows**) → hero → translucent ghost wisps (screen 30–40 %). Selective red only on the cushions and the cherry.

### DC-2 · Title over scenery ("XV century")
| Frame | Beat |
|---|---|
| 0–8 | torn cream paper patch bursts in (0.54 → 1, bottom-centre anchor) with a red echo edge |
| 20–32 | castle engraving rises from below (≈12 f) |
| 36–42 | portrait in a gilt frame drops in at +11°, then swings like a damped pendulum for ≈100 f |
| 83–94 | **"XV" rises from behind the castle line** (249 px in ≈11 f, `collageType.display`) |
| 88–104 | "century" types on irregularly (glyphs at +0, 2, 6, 8, 10, 14, 16 f) |
| hold 40 f | zoom-through match cut (C-ZMC) |

### DC-3 · Map route with a stretching arm
- Torn-edge antique map, dark vignette.
- The hero slides in from the right edge.
- Bats (wings as separate pieces) fly up from bottom-left, staggered 8–12 f.
- A pin pops (≤2 f).
- The **rubber-hose arm** stretches ≈700 px in 8 f, and the maroon route line `#581C1C` (≈8 px) trims on behind the hand.
- The second pin pops.
- Hold, then the radial zoom-blur crash (C-RZ).

### DC-4 · Window scene with lightning
Stone wall with 2 gothic windows, the hero seen from behind, candle, skull, props.
- Red fog clears over 36 f (`fogClear`).
- Balloons drift +35 px over 60 f and the hero sways 10–17 px.
- Three lightning double strikes (C-LS) at ≈2 s intervals.
- Hard cut to the end title.

### DC-5 · End title ("HAPPY HALLOWEEN")
- `BoilText` with `collageType.endTitle`, centred, ≈18 % side margins.
- Glyphs re-randomise every 6 f.
- The dust loop runs on twos.
- Hold 9.9 s; no fade.

---

## Vox explainer (24 fps, on twos)

### VX-1 · Topic title on the desk ("EPI|Genetics")
| Frame | Beat |
|---|---|
| 0–18 | opening fly-through (V-FLY) or a cut |
| 16–40 | settle pull-back (0.96–0.99 per drawing) |
| 52–84 | **push + tilt ×1.21, 184 px** (32 f, `pushSoft`) |
| 58–70 | **title rises from its baseline mask** during the push (12 f, `enter`; `voxType.title`, centred, baseline ≈30 % H) |
| 92–100 | **sticky note peels on** in front of the title ("EPI", `voxType.sticky`) |
| 108–116 | marker underline (8 f) |
| 170–210 | data dots pop, staggered 10, 12, 4, 4 f |
| 120–217 | drift: zoom 0.9955/drawing + tilt −3 px/drawing |

Layers: dotted paper → world shadow (top-right) → back cards at 10–30° → hero black DNA card (60 % W) → lime tape label + paper clip → title → sticky → underline → dots.

### VX-2 · Evidence print with tape label ("HORVATH BROTHERS", "SALIVA TEST")
- **Cut in.** The cut lands on a push already in progress (V-SRP), ×1.53 in 34 f, 60 % in the first drawing.
- **Props.**
  - Photo print (border ≈5 %, deckled) with a paper clip; a petri dish beside it.
  - Black tape **unfurls** in 10 f; a hand-drawn arrow draws in 6 f.
- **Lime tape label.** The text writes on at ≈1 char per drawing (30 f), with the underline growing with the word.
- **Exit.** Hold static, then a hard cut.

### VX-3 · Concept annotation ("Sexual orientation ??")
- Black card with a yellow sans callout ("Methyl group") and a yellow L-leader.
- A sketchy double-line arrow points to a bold-sans phrase (`voxType.annotation`) that is **pencil-ringed** (3–4 loops, 8 f).
- "??" pops in one drawing.
- Accelerating push into the cut (V-SRP).
- Later return cuts (V-RET) add an **X cross-out** (drawn during a ×1.375 push) and an "Age?" sticky peel.

### VX-4 · Inset magnification ("zoom into the cells")
- Hero: a photo or diagram (a petri dish, an engraving).
- **Pin dot** (r 12, `#C03D40`).
- A leader (L-shaped or two tangent cone lines) draws 16 f (`leader`).
- The **inset circle** (Ø 320–460, diagonally opposite) pops in 16 f with +1.6 % overshoot, overlapping the line by 6 f.
- Inside the circle: a red/green dot grid (pitch 55, dot Ø 32).
- Drift −1.2…−2.4 %/s.

### VX-5 · Document highlight ("Epigenetic Predictor of Age")
- **Page drop** in (V-PD): scale 6 → 1, edges bending flat over 12 f.
- **Tilt-push** to the title, 28 f, ≈316 px, ×1.13.
- **Highlighter swipe** (12 f, multiply), starting at the camera's peak speed.
- 16 f freeze before the cut (V-FRZ).

### VX-6 · Card with satellites ("Training Data")
- Small serif header above a white card with masking tape and a bold-sans title.
- Dot-matrix discs carry yellow sticky tags ("AGE: 54"). They slide in from the frame edges at a constant speed and tuck under the card.
- Gears flash red/green: 2 f in, 12 f hold, 2 f out.
- Linear push ×1.17 throughout.

### VX-7 · Scale change (powers of ten)
- Dark board with a diagram (a helix with red/green tags, bokeh tags blurred σ 20–30 in the corners).
- Flag labels unfurl, staggered 26 f then 15 f (`voxType.flag`).
- The radial zoom-out (V-P10) lands on the next scale (dish → cells → organism). Each landing settles 66 % in the first drawing.

### VX-8 · End card
- A dark board with the creator URL in serif.
- A lime tape label "THANK YOU!" with a paper clip, lying on the desk.
- Static (grain still on twos).

---

## Vox editorial (24 fps, on ones, long holds)

### ED-1 · Title lockup with highlighter
| t (s) | Beat |
|---|---|
| 0.0–0.4 | blank crumpled paper → the title pops on in irregular glyph chunks (`ChunkPopOn`, `editorialType.title`); byline + wordmark appear at once |
| 0.6–0.7 | highlighter dab starts |
| 0.7–0.9 | **snap zoom ×1.565** (E-SZ) |
| 0.8–1.4 | mustard dry-brush highlighter wipes L→R under the title (≈1180 px/s, hard stop) |
| 1.4–3.0 | hold |
| 3.0–3.2 | snap zoom out ×0.644 |
| 3.7–6.1 | highlighter fades out linearly over 2.4 s while the title is wiped off right→left and the wordmark erodes (E-WO) |

### ED-2 · Newspaper clipping
| t (s) | Beat |
|---|---|
| 0 | headline (`editorialType.headline`, centred) reveals **centre-out** (0.4 s); the date tag (oxblood box) fades in (0.3 s); the rule + masthead fade in 3 f later |
| +1.0 | inline highlighter stroke under a phrase: **accelerating**, 0.3 s whatever its length |
| +2.5 | **tilt up 209 px** (0.3 s, easeInQuad); the body column wipes top→bottom (0.4 s); the photo fades in (0.07 → 0.20 → 1) |
| +4.4 | second inline stroke |
| hold 3 s | cut to black |
