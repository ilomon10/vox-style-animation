# 06 · Motion language

## 1. Drawing rate: 12 drawings per second (the most important rule)

Every reference animates its graphics at **12 drawings/s**, whatever the delivery frame rate:

| Delivery | Pattern | Evidence |
|---|---|---|
| 24 / 23.976 fps | **on twos**: a new drawing on every second frame (`0,0,2,2,4,4…`) | dracula 85 % twos; epigenetics 89 % twos, including camera moves, grain and lighting |
| 30 fps | **12 fps conformed to 30**: holds alternate 3,2,3,2 frames | porsche S21 `#.#..#.#..#.#..`; S109 34×2 + 33×3 intervals |

**On ones** (every frame): live footage, caption opacity fades, the dark-collage film weave, rendered zoom-throughs and push-ins on stills, the final fade to black, and the whole editorial piece (which uses long holds instead of stepping).

The drawing grid **restarts at every cut**, so parity resets per shot. A held frame must be *identical*, grain included, unless the style adds a boil.

```ts
// src/lib/time.tsx
posterize(frame, fps, 12)   // (⌊frame·12/fps⌋ · fps/12) → 0,0,0,2.5,2.5,5,5,5,7.5… at 30 fps
useDrawingFrame()           // posterized frame of the current <Sequence>
<OnOnes>…</OnOnes>          // opt-out for footage / fades
```

Variants: the collage **crumple transition runs on fours** and the **boil title on sixes** (4 fps). The paper-desk **hold boil** runs at 6 fps (jitter ±1.1 px plus a grain re-roll every 5 f @30) so held frames never freeze.

## 2. Easing tokens

Fitted to measured position curves (`src/tokens/easing.ts`; use `ease("name")`).

| Token | cubic-bezier | Measured on | Use for |
|---|---|---|---|
| `enter` | (0.16, 1, 0.3, 1) | Vox title rise (0, .49, .73, .84, .93, .98, 1); collage props (τ 2.2–4 f); paper-desk car entrance | **every entrance**: drop, rise, slide, title rise |
| `enterBig` | (0.22, 1, 0.36, 1) | collage moon and houses (τ 3.7–4 f) | heavy scenery |
| `exit` | (0.32, 0, 0.67, 0) | collage book fall-out (Δy 21, 53, 88, 152 per 2 f) | leaving the frame |
| `gravity` | (0.5, 0, 0.75, 0) | collage furniture drops (hard landing, no bounce) | falling props |
| `push` | (0.5, 0, 0, 1) | Vox push + pan ×1.375 (0, .02, .06, .15, .35, .64, .78, .86, .90, .94 …) | camera push to the focal word |
| `pushSoft` | (0.6, 0, 0.1, 1) | Vox push ×1.213 (0, .02, .05, .10, .19, .37, .65, .83, .92, .97, .99, 1) | gentler push / push + tilt |
| `tilt` | (0.5, 0, 0.2, 1) | Vox tilt-push to a title; paper-desk tilt to the next line | vertical reveal |
| `settle` | (0, 0.8, 0.15, 1) | Vox post-cut push ×1.53: 60 % in the first drawing | a camera already moving when the shot starts |
| `accelerate` | (0.6, 0, 1, 1) | Vox push into a cut (zoom 1.001 → 1.070/drawing) | first half of a zoom-through |
| `whip` | (0.45, 0, 0.4, 0.95) | paper-desk whip-pan 3331 px / 53 f | whip-pans |
| `crash` | (0.6, 0.6, 0.4, 1) **on log(scale)** | collage crash push ×2.79 | crash zoom |
| `slide` | (0.45, 0.35, 0.3, 0.95) | paper-desk quote figure slide-in, 35 f | long cut-out slides |
| `boxWipe` | (0.75, 0.4, 0.05, 0.9) | paper-desk title box (crawl, burst, long tail), identical in 4 shots; other fits (0.9,0.43,0,0.76), (0.79,0.2,0.04,0.91) | highlight-box / label wipe |
| `discGrow` | (1, 0.39, 0.2, 0.94) | paper-desk callout disc (Ø .04, .12, .30, .82, .98, 1) | callout disc |
| `labelWipe` | (0.42, 0, 0.58, 1) | callout label opening from the line end | label boxes |
| `leader` | (0.15, −0.2, 0.15, 0.8) | Vox leader line (24, 66, 47, 34, 25, 19, 15, 5 px per drawing) | leader lines |
| `carousel` | (0.51, 0.21, 0.19, 0.87) | paper-desk photo carousel (7 %, 50 %, 93 %, 100 % at +0, +2, +5, +7 f) | slides |
| `punchIn` | (0.5, 0, 0.75, 0) | paper-desk accelerating 5–12 % zoom into a cut | pre-cut punch |
| `overscaleSettle` | (0.6, 0.07, 0.33, 1.01) | paper-desk shots starting ×1.3–1.8 and settling in 8–14 f | post-cut settle |
| `bulletRise` / `bulletTurn` | (0.68, 0.34, 0.59, 1) / (0.28, 0.08, 0.26, 0.91) | ▶ bullet rising from below the frame, then turning −90° | caption bullet |
| `highlightWipe` | (0.7, 0.3, 0.2, 0.8) | "$43 000 000 000" box | shorter highlight wipes |
| `highlighter` | (0.3, 0, 0.5, 1) | Vox highlighter (.07, .30, .60, .80, .97, 1) | Vox highlighter swipe |
| `grow` | (0.33, 1, 0.68, 1) | paper-desk bar growth (no overshoot) | bars, counters |
| `fadeIn` | (0.5, 1, 0.89, 1) | ▶ caption opacity | caption/photo fades |
| `fogClear` | (0.11, 0, 0.5, 0) | collage red fog clearing | smoke and fog |
| `pop` | (0.45, 0.2, 0.4, 1.2) | Vox inset circle (+1.6 % overshoot, settles in 4 f) | the only overshoot in the style |
| `unfurl` | (0.15, 1, 0.45, 0.9) | Vox flag label | tapes and flags |
| `dotPop` | (0, 0.4, 0, 0.9) | Vox data dots (.58 → .80 → 1) | dots, pins |
| `brush` | (0.5, 0, 0.1, 1) | paper-desk dry-brush wipe | brush strokes |

Cross-video pooled camera fits (`analysis/quantitative.md` §2):

| Fit | cubic-bezier |
|---|---|
| ease-in-out camera | (0.58, 0.09, 0.49, 0.94) |
| pans | (0.50, 0.06, 0.54, 1.00) |
| push-ins (back-loaded) | (0.70, 0.13, 0.42, 0.84) |
| big pull-outs (front-loaded) | (0.08, 0.06, 0.01, 0.84) |
| layer entrance with overshoot (paper desk) | (0.55, 1.22, 0.41, 0.97) |
| editorial snap zoom | (0.5, 0, 0.75, 0) |
| editorial highlighter (accelerating) | (0.11, 0, 0.5, 0) |
| editorial centre-out reveal | (0, 0, 0.58, 1) |

**Shape rules.**
- Entrances: 90 % of the travel in the first ~⅓ of the duration, then a long settle.
- Exits accelerate out. Camera moves are ease-in-out with a long decelerating tail.
- The first drawing of a fast entrance can already be 50–70 % of the way there, often with a motion-blurred first step.
- **No bounces and no elastic.** The only overshoots are the Vox inset circle (+1.6 %), the paper-desk triptych card pop (≈1.2× → 1.0) and occasional layer slides `(.55,1.22,.41,.97)`.

## 3. Durations (`DUR`, seconds)

| Group | Token | s | Measured |
|---|---|---|---|
| entrance | `titleRise` | 0.50 | 12 f @24 |
| | `propEnter` / `propEnterBig` | 0.58 / 0.83 | 14 / 20 f @24 |
| | `carEnter` | 0.27 | 8 f @30, from 70 % on frame 1 |
| | `cutoutSlide` | 1.17 | 35 f @30 |
| | `gravityDrop` | 0.33 | 6–10 f @24 |
| | `stickyPeel` / `tapeUnfurl` / `flagUnfurl` | 0.33 / 0.42 / 0.67 | 8 / 10 / 16 f @24 |
| | `dotPop` / `insetPop` | 0.79 / 0.67 | 18–20 / 16 f |
| exit | `exit` | 0.42 | 10 f @24 |
| text | `boxWipe` (+ `boxWipeDelay` 0.33) | 0.90 | 22–32 f @30: a 24 px bar holds 3–8 f, then sweeps |
| | `highlighter` | 0.50 | 12 f @24 |
| | `drawOn` | 0.33 | 8 f @24 (underline, pencil ring, cross-out) |
| | `handRing` | 0.67 | 16 f |
| | `captionFade` / `captionFadeOut` | 0.33 / 0.23 | 10 / 7 f @30 |
| | `brushWipe` | 0.93 | 28 f @30 |
| | `barGrow` | 0.60 | 13–22 f @30, stagger 2 drawings |
| camera | `push` | 1.33 | 32 f @24, then ≥ 30 f settle + drift |
| | `settle` | 1.5 | 34–44 f @24 |
| | `tilt` | 1.07 | 28–32 f |
| | `whip` | 1.77 | 53 f @30 |
| | `crashZoom` | 1.04 | 25 f @24 |
| | `pullBack` | 0.50 | 12 f @24 |

Rates: typewriter 41 chars/s, handwriting 12 chars/s (1 per drawing), irregular type-on ≈9 chars/s, subtitle reveal ≈1080 px/s.

## 4. Entrances & exits by style

| Style | Entrance vocabulary | Exit |
|---|---|---|
| paper desk | **shots open overscaled** (×1.3–1.8 → 1 in 8–14 f) or already moving; cut-outs **already mid-move on frame 1** (offset +75…+123 px → 0 in 7–9 f, expo-out, motion-blurred first step); cards **scale in** (0.85–1.17 → 1 in 8–12 f) and **out** (4–7 f, ease-in); box wipes; ring draw-ons; staggered bar growth; masked rise ("2023" from behind the cars, 8 f); late **echo** silhouette (starts 15 f after the figure, lags 3–5 f); typewriter | slide-out accelerating (−5 % W in 6 f), flash-shrink, zoom-through |
| dark collage | **drop / rise / slide on a locked stage** (90 % of travel in 5–10 f; τ 2.2–4 f); **gravity drops** with a hard landing and secondary action (a lid flips, a table tips); **masked rise** ("XV" 249 px in 11 f behind the castle); torn-paper **burst** (.54 → .80 → .92 → .98 → 1); stepped growth (ink splats in 3–5 drawings) | **fall-out** (ease-in cubic, 10 f) |
| Vox explainer | everything is a **physical metaphor**: sticky-note **peel** (8 f), tape/flag **unfurl** (10–16 f), handwriting **write-on**, pencil/marker **draw-on** (8 f), **highlighter swipe** (12 f), magnifier **slide** (14 f), dot **pop** (18 f), inset **pop** (16 f, +1.6 %); title **rise from mask** (12 f). **No opacity fades**, wipes or dissolves | objects rarely leave; the camera moves on or the shot cuts |
| Vox editorial | chunk pop-on of letters; highlighter accelerating wipe; centre-out soft reveal; top→bottom body wipe; photo fade (0.3 s) | right→left hard wipe-off + grunge dissolve; highlighter linear fade (2.4 s) |

## 5. Camera

The camera is a 2D rig over a flat world: translate, scale and roll, **stepped with the drawings**. There is no parallax inside a shot; Vox scales all layers together.

| Move | Spec | Notes |
|---|---|---|
| **Push to the focal word** (Vox) | 32 f @24 (1.33 s), ×1.2–1.4, `push`/`pushSoft`; peak ≈590–1180 px/s, 5–10 %/drawing | **always followed by ≥ 15–30 f of decelerating tail + linear drift** |
| **Drift** (Vox) | every hold drifts: zoom −5…+4.6 %/s or pan 3–12 px/s, linear | "holds are never dead" |
| **Post-cut settle** | the cut lands on a camera already moving (−60 px/drawing, or ≈1.29× zoom/drawing) that decelerates expo-out over 34–44 f | `settle` |
| **Tilt** | 28–32 f, ≈316–324 px, `tilt` | reveal the next line |
| **Pan** | median 1.07 s, 343 px; mean 514 px/s, peak 2340 px/s; ease-in-out | |
| **Whip-pan** (paper desk) | 3331 px in 53 f; peak ≈4300 px/s; directional motion blur ≈ the step length; on 12 fps | `whip` + `MotionTrail` |
| **Desk flyover** (paper desk) | 175 f; push ×1.32 in 12 f; cruise 1080–1540 px/s; **roll** swinging 0 → −11.4° → +8.2° → −17.1°; pull ×0.86 at the end; strict 12 fps | `CameraRig` keys with roll |
| **Locked stage** (collage) | the camera never pans inside a shot; it moves only in transitions | weave provides life |
| **Crash push** (collage) | ×2.79 in 25 f, log-space `crash`, ends in defocus | |
| **Pull-back** | ×0.80 in 12 f ease-in-out (collage); big pull-outs are front-loaded (porsche opening ×0.14 over 2.5 s, 48 % of the change at t = 0.11) | |
| **Snap zoom** (editorial) | ×1.565 in ≈5 f @24, easeInQuart, **stops dead, no blur** | |
| **Overscaled settle** (paper desk) | a new shot starts ×1.3–1.8 too large (or offset) and settles in 8–14 f (`overscaleSettle`); seen 6× in 65 s | the default shot head |
| **Punch-in into a cut** (paper desk) | accelerating +5…+12 % over 5–8 f (`punchIn`), cut on the fastest frame; reverse −3.4 % | the default shot tail |
| **6 fps boil** (paper desk) | the artwork group jitters 0.4–1.1 px every other drawing during holds | `finish.jitter` |
| **Push on a still** (paper desk) | per-frame zoom 1.028, 1.022, 1.016, 1.012 … (expo-out, ×1.09) on ones, from a rack-focus (blurred first frame, sharp in ≈5 f) | |

**Motion blur.** Mostly none: a 3 px rule stays 3 px at 114 px/frame in the editorial piece, and the Vox desk is sharp. Blur appears only on whip-pans, the first step of fast cut-out entrances, and zoom transitions (radial).

## 5b. Paper-desk information devices

| Device | Timing |
|---|---|
| **Callout trio**: disc → leader → label | disc grows 12 f (`discGrow`) or flies in 10–13 f; leader +9 f, draws 7–10 f; label +5 f, opens leftward 8–11 f (`labelWipe`); all at 12 fps; whole trio ≈1 s, then hold ≈1 s |
| **▶ caption bullet** | rises ≈125 px from below the frame in 8–10 f, turns −90° in 10–16 f; the text fades in 8–13 f while rising 13 px, starting 2 f before the turn ends; the bullet persists across cuts |
| **Year odometer** | 12 values over 28 f (one per drawing), ease `(.18,−.04,.79,1.09)`, then a highlighter sweep |
| **Timeline scrub** | years cross R→L at ≈110 px/f on the dark map, opacity 1 within ±240 px of the centre; the last year decelerates over 13 f |
| **Photo carousel** | 7 f slide + 13 f dwell, `carousel`, 12 fps |
| **Word-lock montage** | one clipping every 5 f; the highlighted word stays in a fixed screen box |
| **Loupe** | lens glides linearly at 443 px/s along a shallow arc; an alternate (x-ray) image is clipped to the lens |
| **Doodle field** | outline shapes rotate 180° in 50 f (in-out), hold 15 f; a dot ping-pongs 153 px (36 f half-period); on ones |

## 6. Puppetry (dark collage)

Puppetry is minimal and rigid. Heads never animate on their own.

| Device | Spec |
|---|---|
| Limb pivot | e.g. a glass arm raised 16 f (ease-out), held ≈12 f, lowered 16–20 f (ease-in, abrupt stop), ≈5–7° about the elbow |
| Rubber-hose stretch | the sleeve scales along its length ≈700 px in 8 f; the hand leads and the route line trims on behind it |
| Pendulum | a portrait enters at +11°, then a damped irregular swing: −2.1° → +4.5° → −2.2° → +1.1°, half-periods 18 / 24 / ≈48 f, pivot at top centre |
| Wings | separate pieces rotating ±20–30° while the body decelerates (121 → 68 px per 2 f) |
| Idle sway | ≈0.6 px/f drift, ±10–17 px |

## 7. Coordination rules

1. **An element almost never animates alone.**
   - The title rises *during* a push.
   - The X is drawn *during* a push.
   - The highlighter starts at the camera's peak speed and finishes as it settles.
   - The magnifier enters while the camera pulls out.
2. **Staggers**: same-kind elements are offset 4–12 f (bars 2 drawings; dots 10, 12, 4, 4 f; flags 26 then 15 f).
3. **Title → annotation offset**: ≈34–40 f (Vox: title at f58, sticky at f92, underline at f108).
4. **Product-card timing** (paper desk) is a fixed template: the car settles 7–9 f after the cut; the title box starts at +10 f; the subtitle at +15 f; hold 0.7–1.9 s.

## 8. Holds & pacing

| | Paper desk | Dark collage | Vox explainer | Vox editorial |
|---|---|---|---|---|
| cuts per minute | 33 | 22 | 15 | 0 (one shot) |
| shot length median (p10–p90) | 1.3 s (0.4–4.9) | 1.6 s (0.33–6.8) | 2.8 s (1.9–5.2) | — |
| beat interval | ≈1 s | 0.6–1.7 s hold after each beat | **≈1.0 s median** (one beat per 2–3 narrated words) | holds 0.5–3.1 s (median 1.6 s) between 0.2–0.9 s actions |
| held share (artwork static) | 34 % | 76 % (but weave every frame) | 47 % | 72 % |

**Narration sync** (Vox): beats land **0.2–0.5 s after a narration pause ends**, on the first stressed word of the next phrase. A 16-frame freeze before a cut is fine when waiting for the voice.
