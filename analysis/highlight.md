# The Highlight by Vox — `highlight` (0–16.2 s, f0–f161)

> Analyst: F. Sources reviewed: sheets 001–007 (all 108 keyframes), 6 full-rate strips (`strips/highlight_00000-00011`, `_00028-00039`, `_00052-00071`, `_00092-00103`, `_00116-00127`, `_00146-00161`), all 162 native frames decoded and measured by script (`stills/F/scripts/hl_*.py`), native crops `stills/F/hl_*.png`, and the H.264 frame-type/packet-size dump (`ffprobe -show_entries frame=pict_type,pkt_size`). Source is 1280×720 @ 10 fps; every pixel value is given **@1080p** (×1.5); "native" = 1280-px value. Time = f/10 s.

## 1. Summary of the look

- **One continuous paper-desk shot** (f0–f151, 15.2 s) with no cuts until a hard cut to black (f152). Every change happens on a single sheet of warm grey, slightly crumpled paper (#b3aca0).
- **Editorial type stack.** A high-contrast bold display serif title, a heavy italic-serif "Vox" wordmark and a small sans "BY". Then a newspaper clipping: bold serif headline, oxblood date tag, hairline rule, blackletter masthead, Times-like body column and a B/W photo.
- **The hero device is a mustard dry-brush highlighter** (#bb923a). It wipes left→right behind key words, three times: title, headline phrase and body phrase.
- **Sparse motion.** The artwork is static for 72% of frames. Holds of 0.5–3.1 s alternate with short actions of 0.2–0.9 s. Moves accelerate and **stop dead**, with no overshoot, no settle and no motion blur.
- **Camera.** One snap zoom ×1.565 about the frame centre (in over 2 frames, out over 2 frames), plus one 209 px tilt-up.
- **Texture is static.** There is no animated grain: held frames are bit-identical. The paper texture has σ 2.3 levels and ~1 px detail. A circular vignette darkens the corners by 15%.
- **1-in-3-frame exposure pulse.** Every frame with index divisible by 3 is brighter: paper +1.1% at the centre to +2.1% at the corners, ink unchanged. This gives a subtle 3.3 Hz flicker.
- **Low-contrast, warm, lifted grade.** All content sits between luma 60 (#3f3930) and 194 (#c6c3b5), with R−B ≈ +20.

## 2. Shot log

The video is auto-shot S1 (f0–f151) plus S2, the black tail (f152–f161). S1 is one continuous shot, so it is split into **beats** below. Coordinates are px@1080p.

| Beat | t0–t1 (frames) | Content / composition | Layers (back→front) | Motion (what, how, how long) | In / out |
|---|---|---|---|---|---|
| S1a | 0.0–0.7 (f0–f7) | Title lockup centred at (959, 535), small state: ink bbox 759×212 px | paper → highlighter → title ink → "BY Vox" | Letters of "The Highlight" pop in **in irregular chunks**: f1 ≈70% of glyphs (bbox 760×110), f3 more, f4 complete. "BY Vox" appears at once on f4. The highlighter dab starts at f6 (26 px wide) and grows to 86 px at f7 | from blank paper (f0) |
| S1b | 0.7–0.8 (f7–f8) | same | same | **Snap zoom-in ×1.565** about the frame centre: bbox width 759 → 797 → 1188 (+5% then +49%). Accelerating, hard stop | – |
| S1c | 0.8–1.4 (f8–f14) | Title at large scale: bbox 1190×332, cap height ≈102 px | same | **Highlighter wipe L→R.** The left edge stays at x 702; the right edge goes 976, 1090, 1210, 1326, 1448, 1568, 1600 (+114…122 px/frame ≈ 1180 px/s, then +32 at the stop). Final stroke 898×164 px | – |
| S1d | 1.4–3.0 (f14–f30) | hold | – | none (pulse only) | – |
| S1e | 3.0–3.2 (f30–f32) | back to small state (bbox 766×213) | – | **Snap zoom-out ×0.644**: width 1190 → 1156 → 766 (−3% then −34%). Accelerating, hard stop | – |
| S1f | 3.2–3.7 (f32–f37) | hold | – | – | – |
| S1g | 3.7–6.1 (f37–f61) | – | – | Highlighter **fades out**. Opacity on P frames (0.3 s apart): 1.00, 0.92, 0.81, 0.68, 0.55, 0.41, 0.22, 0.08, 0.00. Near-linear over 2.4 s | – |
| S1h | 5.4–6.3 (f54–f63) | – | – | **Title erase.** "ghlight" is wiped right→left with a hard vertical edge that cuts the "h" mid-glyph (f55, −38% ink). "The" disappears at f57 (ink x0 jumps 573 → 825). "Vox" erodes with a grunge/scratch dissolve (f55–f62). Everything is gone at f63 | – |
| S1i | 6.3–6.4 (f63–f64) | blank paper | paper | – | – |
| S1j | 6.5–6.9 (f65–f69) | Headline block (bbox 1470×216, centred x 960). Date tag at (186, 327), 296×64 | paper → tag → headline → rule + masthead | **Centre-out horizontal reveal** with a soft-edged mask (feather ≈30 px). Half-width goes 221 → 496 → 691 → 733 (0.30, 0.68, 0.94, 1.0): decelerating, 0.4 s. The tag fades in over f65–f67 (≈0.3, 0.7, 1.0); the rule and masthead fade in over f68–f69 | cut-free; blank → text |
| S1k | 7.0–7.4 (f70–f74) | hold | – | – | – |
| S1l | 7.5–7.8 (f75–f78) | – | highlighter under the phrase | **Stroke 2** on "189 onboard feard dead": x 308 → 322 → 490 → 762 → 1146 (834 px; progress 0.02, 0.22, 0.54, 1.0). Accelerating, ≈0.3 s | – |
| S1m | 7.8–9.3 (f78–f93) | hold 1.6 s | – | – | – |
| S1n | 9.4–10.0 (f94–f100) | Final layout: margins L/R 150, top 120 (tag), bottom 88. Body column x 140–820, photo 848–1773 × 472–990 | paper → photo → body → highlighter → headline group | **Tilt up 209 px**: rule y 621 → 591 → 526 → 412 (Δ 30, 65, 114, then 0), pure translation (tag width 296 → 292). **Body text wipes top→bottom** (bottom edge 577 → 730 → 885 → 949, ≈150 px/frame). **Photo fades in** (opacity 0.07 → 0.20 → 1.0, f98–f100) | – |
| S1o | 10.0–11.7 (f100–f117) | hold 1.8 s | – | – | – |
| S1p | 11.8–12.1 (f118–f121) | – | – | **Stroke 3** on "Lion Air Flight 610": x 309 → 316 → 386 → 476 → 742 (436 px; 0.02, 0.18, 0.39, 1.0). Accelerating, 0.3 s | – |
| S1q | 12.1–15.1 (f121–f151) | hold 3.1 s | – | none | out: hard cut |
| S2 | 15.2–16.1 (f152–f161) | pure black (luma 0.0) | – | none | capture end / padding |

Rhythm: actions last 0.2–0.9 s (2–9 frames). The holds between them are 1.7, 0.5, 0.5, 1.6, 1.8 and 3.1 s (median 1.6 s). Nothing moves during a hold except the exposure pulse.

### Duplicate frames: capture artefacts vs real holds

The auto metric reports 31% held frames (50 of 161). This splits into three groups.

| Class | Frames | Count | Interpretation |
|---|---|---|---|
| Black tail | f153–f161 | 9 (5.6%) | **Capture/padding artefact.** Exact repeats of black after the cut |
| Exact repeats inside S1 | f2, 17, 20, …, 149 (**all at k ≡ 2 mod 3**) | 25 (15.5%) | **Real holds.** The artwork is static, and the H.264 stream codes these as 36–37-byte skip P/B frames. They are exact only because the brighter pulse frame (k ≡ 0 mod 3) breaks every hold into A, B, B |
| Near repeats (mad_lo 0.02–0.4) | f5, 14, 38–62 (k ≡ 2 mod 3), 71, 101, 119, 125, 128 | 16 (10%) | **Real slow change.** For example, highlighter fade progress between P frames |

The remaining frames are either A↔B pulse transitions (mad ≈ 2.1–2.9 even in holds) or genuine motion. After cancelling the pulse with a 3-frame-lag difference, **the artwork is static in 72% of frames**. During actions, content changes on consecutive frames: 92% of change-gaps are one frame. So there is **no stepping on twos** in this capture.

**What is likely a capture artefact.**
1. The 10 fps rate itself. Motions resolve in 2–4 samples, and the snap zooms in 1–2.
2. The strictly periodic exposure pulse (§6): every frame with index ≡ 0 mod 3 for the entire clip, independent of content. It is real source data, not codec noise: those frames are 3–4 KB B-frames, while held frames are 37-byte skip frames. However, its rigid 3-frame period matches the capture grid, so it may come from a frame-rate conversion of a source flicker.
3. Per-frame values within 3-frame groups are shaped by the GOP: only the P frames (k ≡ 1 mod 3) are clean references. Fades and wipes should therefore be read at 0.3 s resolution on P frames.

## 3. Color

Values are medians over the classified pixels of f125 (a B-state frame), with p10–p90 in parentheses. Shares are of the final layout.

| Token | Hex | Role | Share |
|---|---|---|---|
| paper | **#b3aca0** (#a9a296–#beb9ac) | background sheet. Pulse frame: #b5afa3. Blank paper f0: #b9b2a6 | ≈60% |
| ink | **#4c4844** (#3c3934–#59554f) | all text, rule, photo border | ≈8% |
| highlighter | **#bb923a** (#b1892f–#c29a4c) | marker strokes; multiplied under the ink | ≈3.5% |
| tag red | **#7b3c3a** (#72302f–#854947) | date tag box; text inside is paper-coloured | 0.6% |
| photo mids | #807972 (darks #514d48, lights #b2aca4) | B/W photo, warm-grey (R−B +14) | ≈23% |

- **Grade.** The black point (0.5% luma) is 60 → #3f3930; the ink never reaches black. The white point (99.5%) is 194 → #c6c3b5; the paper never reaches white. Range is 60–194, a strongly compressed, matte look.
- **Cast.** Warm in every tone band. Neutral-pixel R−B is +10.6 (darks), +18.9 (mids) and +18.6 (lights); G−(R+B)/2 is +4…+6, a slight olive/sepia. Mean saturation is 0.12.
- **Photos** are monochrome and tinted to the paper (R−B +9.5…+14). They look multiplied onto the paper.
- **Chromatic aberration: none.** Gradient-regression CA estimate: |R−G| median 0.04 px, |B−G| 0.05 px@1080p (`quantitative.md` §4).

## 4. Typography

Cap heights were measured on native crops (±3 px@1080p).

| Role | Case | Cap height @1080p | Weight / class | Colour / background | Effects | Commercial match | Free match |
|---|---|---|---|---|---|---|---|
| Title "The Highlight" | Title case | ≈65 small / ≈102 large state | bold, high-contrast didone-ish display serif with ball terminals | ink on paper + mustard highlighter | chunked letter pop-on; snap zoom; right→left wipe-off | GT Super Display Bold / Tiempos Headline Bold | Playfair Display 800, DM Serif Display |
| "Vox" wordmark | Title | ≈1.1× title cap | black italic serif (Vox logo) | ink | appears with "BY"; grunge-erosion exit | Vox logotype | Playfair Display Black Italic |
| "BY" | CAPS | ≈0.4× title cap | medium grotesque, slightly condensed | ink | – | Balto Medium (Vox sans) | Libre Franklin 600 |
| Headline | Sentence | ≈53 | bold transitional serif, centred, 2 lines, leading ≈67 | ink | centre-out soft mask reveal | Georgia Bold / Cheltenham Bold | Source Serif 4 Bold, Merriweather 700 |
| Date tag "Oct 29,2018" | Title | ≈20 | regular serif | paper colour on #7b3c3a box 296×64 | 0.3 s fade | Times | Tinos |
| Masthead "The Washington Times" | Title | ≈30 | blackletter | ink, right-aligned after a 3 px hairline rule | 0.2 s fade | Old English Text MT | UnifrakturMaguntia |
| Body | Sentence | ≈25, leading ≈47 | Times-like regular, left-aligned, column ≈680 px wide | ink | top→bottom line wipe | Times New Roman | Tinos / Liberation Serif |

**Highlighter geometry.** Stroke height is ≈1.6× cap height on the title (164 px) and ≈1.8× on the headline (94 px). It starts ≈0.1 em before the first glyph and overruns the last glyph by ≈0.2 em. The ends are ragged dry-brush with horizontal streaks (crop `hl_crop_stroke_texture_x2_f125.png`).

## 5. Layout & composition

- **Centre-axis composition.** The title lockup and headline are centred on x = 960. The title sits at y ≈ 535 (optical centre) and spans 40% of frame width in the small state, 62% in the large.
- **Final newspaper layout.** Symmetric 150 px side margins; top 120 px (tag), bottom 88 px. Two columns: body 140–820 and photo 848–1773, with a 28 px gutter. The photo has a 2 px ink border.
- The date tag hangs 39 px left of the headline's left edge and 40 px above it, like a clipping label.
- Everything is flat on one plane: **no rotation (0°), no overlap stacking, no drop shadows, no depth of field.** Depth is implied only by the highlighter sitting under the ink.

## 6. Textures & materials

| Element | Measurement | Procedural recipe |
|---|---|---|
| Paper | median #b3aca0. Static high-pass σ 2.3 levels (σ_hp 1.5 px). Texture correlation half-width 1.1 px@1080p. Crease network and a few blotchy stains (e.g. a grey stain at (430, 390)) | One scanned paper plate, **not animated**. Multiply it over flat #b3aca0, or use a fractal-noise plus crease-normal map. Monochrome (R/G/B correlation 0.99) |
| Film grain | **none.** σ_temporal 0.03 levels on held pairs; temporal/spatial high-pass ratio 0.02 | Do not add per-frame grain for this look |
| Vignette | circular, L(r) = 1 − 0.15·r^1.4 (r = distance / half-diagonal). −2% at r 0.24, −5% at r 0.46, **−15% at the corners**. Fits on 9 frames: a 0.145–0.152, RMSE 0.003 | Radial-gradient multiply on the paper layer |
| Exposure pulse (flicker) | Period **3 frames = 0.3 s (3.33 Hz)**; lag-3 autocorrelation +0.99. The bright frame lifts paper by +1.1% (centre) to +2.1% (corners), i.e. vignette depth −1 pt. Ink is unchanged (+0.09 levels). Frame mean +2.1…+2.9 levels | Every 3rd frame, gain the paper/vignette layer ×1.011 at the centre and ×1.021 at the corners, *below* the ink. A random-phase version (P = 1/3 per frame) reads the same |
| Highlighter | mustard #bb923a, dry-brush. Ragged 20–40 px streaky ends, ~10% opacity breakup inside | Mask a brush-stroke texture with a growing rectangle; multiply-blend under the text |
| Date tag | flat #7b3c3a box, no texture | – |
| Erase grunge | "Vox" erodes through a scratchy, grainy alpha (f55–f62) | Animated threshold on a grunge texture (dissolve) |
| Shadows / dust / light leaks / CA | none measured | – |

## 7. Motion language

Easing is matched against sampled progress. The "best standard curve" column gives the max abs error over the samples. With only 3–10 samples per move, treat these as ±1 class.

| Motion | Frames (s) | Distance / amount | Velocity profile | Best standard curve | Notes |
|---|---|---|---|---|---|
| Snap zoom in/out | 2 (0.2) | ×1.565 / ×0.644 about the canvas centre | 5% then 49% of the change, then nothing | easeInQuart `cubic-bezier(.5,0,.75,0)` (err 0.022) | accelerate-and-land, no settle, no blur. At 24 fps use ≈5 frames |
| Title highlighter wipe | 9 (0.9) | 898 px | ramps over 2 frames, then constant 118 px/frame (1180 px/s), hard stop | ≈linear / easeInOutSine (err 0.06–0.08); practical: `(.3,0,1,1)` | left edge fixed; grows right |
| Inline highlighter wipe | 3–4 (0.3) | 834 px (headline), 436 px (body) | accelerating (progress ≈t^1.6), hard stop | easeInQuad `(.11,0,.5,0)` (err 0.044) / easeInCubic (0.052) | duration independent of length |
| Tilt up | 3 (0.3) | 209 px | Δ 30, 65, 114 px, stop | easeInQuad (err 0.033) | pure translation, **no motion blur** (3 px rule stays 3.0 px FWHM; 4.5 px on the fastest frame) |
| Centre-out text reveal | 4 (0.4) | ±735 px half-width | 0.30, 0.68, 0.94, 1.0 | easeOut `(0,0,.58,1)` (err 0.078) | soft mask edge ≈30 px |
| Body line wipe | 4 (0.4) | ≈410 px tall, top→bottom | ≈150 px/frame | easeInOut `(.42,0,.58,1)` (err 0.039) | – |
| Photo fade-in | 3 (0.3) | opacity 0 → 1 | 0.07, 0.20, 1.0 | easeInQuart (err 0.034) | – |
| Tag / masthead fade-in | 2–3 (0.2–0.3) | opacity | ≈linear | linear | staggered 2–3 frames after the text |
| Highlighter fade-out | 24 (2.4) | opacity 1 → 0 | near-linear | linear (err 0.06) | runs under the erase |
| Letter pop-on / erase | 1–2-frame steps | glyph chunks | stepped, random order | – | hard edges |

There is no overshoot, bounce, wiggle or boil anywhere. Every move begins slow (or linear) and **ends abruptly**. Holds between beats: median 1.6 s.

## 8. Transitions

| Type | Frame-by-frame | Length | Build |
|---|---|---|---|
| **Snap zoom** (beat change) | f6 small state; f7 bbox +5%; f8 final scale (+49%), then held | 2 frames @10 fps (≈5 f @24) | `scale = interpolate(f, [0, 5], [1, 1.565], {easing: Easing.bezier(.5,0,.75,0)})` on the whole paper group, origin centre. Reverse for the zoom-out |
| **Wipe-off + grunge dissolve** (exit) | f54 highlighter at 30% opacity; f55 right half of the title cut by a vertical edge; f57 "The" gone; f55–62 "Vox" erodes; f63 empty | ≈9 frames | Rectangle mask animating right→left for the title, plus a threshold dissolve on a grunge texture for the wordmark |
| **Centre-out soft reveal** (enter) | f64 blank; f65 central 30% visible; f66 68%; f67 94%; f68 full; tag fades f65–67; masthead f68–69 | 4–5 frames | Feathered rectangle mask whose width animates easeOut; stagger tag/masthead opacity by +0 and +3 frames |
| **Highlighter wipe** (emphasis) | right edge advances 114–384 px per frame, hard stop | 3–9 frames | Clip-path inset on a brush PNG (see §9) |
| **Tilt + build** (add content) | f94 start; f95 −30; f96 −95; f97 −209 (stop) with first body lines visible; f98–100 lines wipe down, photo fades | 7 frames | Translate the group with easeInQuad; body mask wipe and photo opacity start on the last frame of the move |
| **Cut to black** (end) | f151 last image; f152 black | 1 frame | – |

## 9. Reusable components

| Component | Props (defaults @1080p, 24 fps) |
|---|---|
| `PaperSheet` | `color="#b3aca0"`, `texture="crumpled-paper.png"` (static, σ≈2.3), `vignette={a: 0.15, p: 1.4, shape: "circle"}`, `pulse={periodFrames: 7 /*≈0.3 s @24*/, gainCenter: 0.011, gainCorner: 0.021}` |
| `HighlighterStroke` | `color="#bb923a"`, `heightEm=1.7`, `padLeftEm=0.1`, `padRightEm=0.2`, `durationFrames=7 /*0.3 s; title: 22*/`, `easing=[.11,0,.5,0]`, `blend="multiply"`, `texture="drybrush.png"`, `fadeOutFrames=58 /*2.4 s linear*/` |
| `TitleLockup` | `title="The Highlight"`, `font="Playfair Display 800"`, `capHeightPx=65`, `byline="BY"` (sans, 0.4× cap), `wordmark="Vox"` (black italic serif), `reveal="chunks"`, `chunkStepFrames=2` |
| `SnapZoom` | `from=1`, `to=1.565`, `frames=5`, `easing=[.5,0,.75,0]`, `origin="50% 50%"`, `motionBlur=false` |
| `NewsHeadline` | `font="Source Serif 4 Bold"`, `capHeightPx=53`, `leadingPx=67`, `align="center"`, `reveal={type: "center-out", frames: 10, easing: [0,0,.58,1], featherPx: 30}` |
| `DateTag` | `bg="#7b3c3a"`, `fg="#b3aca0"`, `size=[296,64]`, `fadeFrames=7` |
| `SourceRule` | `ruleWidthPx=3`, `ruleColor="#4c4844"`, `masthead="UnifrakturMaguntia"`, `capHeightPx=30`, `fadeFrames=5` |
| `BodyColumn` | `font="Tinos"`, `capHeightPx=25`, `leadingPx=47`, `widthPx=680`, `reveal={type: "wipe-down", frames: 10, easing: [.42,0,.58,1]}` |
| `NewsPhoto` | `size=[925,518]`, `border="2px #4c4844"`, `filter="grayscale(1) sepia(.15)"`, `blend="multiply"`, `fadeFrames=7`, `easing=[.5,0,.75,0]` |
| `TiltMove` | `dyPx=-209`, `frames=7`, `easing=[.11,0,.5,0]`, `motionBlur=false` |

## 10. Build notes for code (Remotion/React)

- **Layer stack.** Black canvas → `PaperSheet` (texture + vignette + pulse gain) → content group (photo multiply → highlighter multiply → ink text) → nothing else. There is no global grain, CA, shadow or blur pass.
- **Frame rate.** Re-time to 24 fps on **ones**. The 10 fps reference is a capture; its 1–3-frame moves map to 3–7 frames @24 with the easings in §7.
- **Pulse.** Implement it as a deterministic per-frame gain: `frame % 7 === 0` at 24 fps, or random with P ≈ 1/3. Apply it to the paper layer only, via a CSS filter `brightness()` on the background div or a WebGL uniform. Keep the ink outside the filtered layer, because ink did not change.
- **Highlighter.** Use a single dry-brush PNG (alpha with streaks), scaled to the word box: `clip-path: inset(0 ${100 - p*100}% 0 0)` with p eased, and `mix-blend-mode: multiply`. Add ±2 px vertical jitter per word so each stroke looks hand-drawn.
- **Snap zoom.** Scale the whole content group about (960, 540). Do not add motion blur; the reference has none (the rule keeps its 3 px thickness at 114 px/frame).
- **Erase.** A rectangle mask (right→left) plus a grunge-texture threshold dissolve (`feComponentTransfer` on a noise alpha), with hard edges.
- **Grade.** Map black to #3f3930 and white to #c6c3b5. This is a lifted, compressed range: e.g. render the content pure, then apply `feComponentTransfer` linear slope ≈0.53 and intercept ≈0.24 per channel, with R/B offsets for the +20 warmth. It is simpler to author the colours directly in this palette.

## 11. Evidence index

| Path (under `analysis/`) | Note |
|---|---|
| `sheets/highlight/sheet_001–007.png` | all keyframes |
| `strips/highlight_00000-00011.png` | chunk pop-on, highlighter start, snap zoom-in (f7→f8) |
| `strips/highlight_00028-00039.png` | snap zoom-out (f30–f32) |
| `strips/highlight_00052-00071.png` | highlighter fade, wipe-off erase, blank, centre-out headline reveal |
| `strips/highlight_00092-00103.png` | tilt up, body wipe, photo fade |
| `strips/highlight_00116-00127.png` | stroke 3 |
| `strips/highlight_00146-00161.png` | end hold, cut to black, black tail |
| `stills/F/hl_crop_title_f022.png`, `hl_crop_title_stroke_f010.png` | title type and stroke mid-wipe |
| `stills/F/hl_crop_headline_reveal_f066.png` | soft centre-out mask, ghosted tag |
| `stills/F/hl_crop_erase_f056.png`, `hl_crop_hl_fade_f047.png` | wipe-off edge, grunge erosion of "Vox", fading highlighter |
| `stills/F/hl_crop_body_photo_f130.png`, `hl_crop_stroke_texture_x2_f125.png` | final layout; dry-brush detail (2×) |
| `stills/F/hl_f021_A_native.png`, `hl_f022_B_native.png`, `hl_diff_f21_minus_f22_x12_small.png` | pulse frame vs held frame; ×12 difference (macroblock-coded brightening of paper only) |
| `stills/F/scripts/hl_flicker.py`, `hl_measure.py`, `hl_measure2.py`, `hl_blur_type.py` | per-frame geometry, opacity curves, motion-blur and cap-height checks |
| `stills/F/res_highlight.csv` | jitter-compensated and 3-lag change metrics used for the held share |
