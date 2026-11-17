# 04 · Layout & composition

## Canvas

- **Author in 1920×1080 design px** inside `<DesignSpace>`. Render at 1920×1080, 2560×1440 or 3840×2160: `DesignSpace` scales the layout, so text and SVG stay vector-sharp.
- **Raster assets** (photos, cut-outs, textures) must be ≥ 2× their on-screen design size if you deliver 4K.
- **The world is bigger than the frame.** The camera moves over a world authored in design px. For a desk flyover the world is ≈3.2 × 1.7 frame widths (6100 × 1850 px). For a single push-in, about 1.3× the frame.
- **Optional 4:3 picture** (Vox epigenetics): active area 1440×1080 at x = 240–1679, with flat `#1F1F1F` bars. Modern 16:9 delivery is the default; enable it with `finish.pillarbox`.

## Safe areas & margins

| Item | Value @1080p |
|---|---|
| Title-safe for focal text | ≥ 150 px from the active edge (Vox) |
| Caption (paper desk) | ▶ at x 213 (11 % W), text from x ≈307 (16 % W), baseline y 977 (90.5 % H) |
| Product/fact card | top 15 % empty; box at 16.7–29 % H; subtitle at 34–37 % H; cut-out wheel/floor line at 86–91 % H |
| Quote card | text block left edge 19.5 % W, top 30 % H, width 36 % W; figure at 59–84 % W, bleeding off the bottom |
| Crop marks | top-right and bottom-left corners: TR horizontal y = 102, x 1343–1830; TR vertical x = 1737; BL vertical x = 185; BL horizontal y = 977; each line overshoots its corner by ≈10 % |
| Editorial page | symmetric 150 px side margins, top 120 px, bottom 88 px; body column 680 px; 28 px gutter |
| Dark collage end title | ≈18 % side margins, ≈28 % top margin |

## Composition patterns

### Paper desk
- **Centred cards.** Hero content is centred on the vertical axis (product card, year card, chart, slideshow card at 55–91 % W).
- **Desk scatter** (flyover): clusters of 2 photos + 1 label slip + tape, photos ≈20–28 % W.

  | Object | Rotation range |
  |---|---|
  | photos | −12…+12° |
  | slips | ±5–8° |
  | pens and pencils | ±20–40° |

  Objects **bleed off every edge**. Overlap order, back to front: desk < props < newspaper < photos < slips < tape.
- **Charts.**
  - Plot: 25–77 % W, baseline at 73 % H, top gridline at 42 % H.
  - Bars: 75 px wide on a 127 px pitch.
  - The ring hugs the highlighted bars (ellipse ≈495×273 px radii).
- **Footage cards.** 91 % W × 83 % H with 4–8 % paper margins, rounded corners r ≈20, yellow offset edge.

### Dark collage
- **Theatrical tableau.**
  - The hero sits on the vertical centre line (x ≈ 960). Staging is symmetric, the camera locked.
  - Floor line low: carpet top at 76 % H, floor ellipses at y ≈ 930–1000.
  - Hero figures span 46–71 % H; portrait frames ≈77 % H; a moon disc ≈24–41 % H.
- **Depth layers.** 3–6 layers: plate → scenery → props → hero → foreground silhouettes (audience heads). Background props tuck behind foreground ones (a numeral behind the castle, posters behind TVs).
- **Rotation.**
  - Most cut-outs: 0°.
  - Accents: ±3–12°.
  - Side posters: ±15–25°.
  - Falling props enter tilted 10–20° and land at 0°.

### Vox explainer
- **Top-down desk.** A single plane with no parallax: all layers scale together under the camera.
- **Centred hero object** (card, print, page) spanning **45–65 % of the active width**. Titles are centred at x ≈ 960 with the baseline at 15–30 % H.
- **Framing props at the edges.** Pens, tubes, highlighters and clips are cropped by the frame edge and frame the hero. Elements bleed off the frame rather than float in white space.
- **Rotations.**

  | Object | Rotation |
  |---|---|
  | hero card or print | −1…+2° |
  | back cards | 10–30° |
  | tapes and stickies | ±2–5° |
  | flag labels | ≈−5° skew on the end cut |
  | pens, highlighters | 30–45° |
  | tubes | 0–20° |

- **Stacking.** Cards overlap by 10–30 % in a fan. Tapes and clips cross card edges to "fix" them. A pencil ring encloses its text with 40–60 px clearance.
- **Insets.** Circles Ø 300–460 px placed **diagonally opposite** the pin, connected by an L-leader or two tangent cone lines.
- **Real depth only in transitions.** The fly-through and the bokeh corner tags (blur σ 20–30 px) are the exceptions; everything on the desk is in focus.

### Vox editorial
Everything sits on one flat plane, centred on the axis: no rotation, no overlap stacking, no shadows. The title lockup sits at the optical centre (y ≈ 535) and spans 40 % W, or 62 % after the snap zoom. Depth is implied only by the highlighter under the ink.

## Layering stack (back → front)

```
paper / plate (inside the camera)                      ← texture, dot grid / grid, worn edges
world shadow (Vox: big soft multiply polygon, inside the camera)
back props & cards (rotated more)
hero object (print, card, cut-out) + its echo / border / contact shadow
tape, clips, pins, stickies (cross the hero's edges)
annotations: rings, arrows, highlighter (multiply), labels
text carriers (highlight box, flag, slip)
— camera transform ends here —
captions over footage (outside the camera; may persist across cuts)
FINISH: RGB split / lens CA → grain → dust → vignette → (pillarbox)
```

## Scale relationships

| Thing | Size |
|---|---|
| hero print / card | 45–65 % of the frame width |
| desk photo in a cluster | 20–28 % W |
| cut-out car on a product card | 54–59 % W |
| hero figure (collage) | 46–71 % H |
| photo border | 4.7 % of the photo width (paper desk); ≈5 % with the top +20 % (Vox) |
| tape | 42 % of the photo width, 3:1 (paper desk) |
| title cap height | 69 px (both serif styles) |
| focal word after a push-in | cap ≈ 70–100 px on screen |
