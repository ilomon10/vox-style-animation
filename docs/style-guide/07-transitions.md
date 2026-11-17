# 07 · Transitions

**Hard cuts dominate in every style.** What makes them feel designed is the **motion wrapped around the cut**:
- the outgoing shot accelerates into the cut;
- the incoming shot is already moving and decelerates;
- scale or position velocity carries across the cut.

Real dissolves are rare: 2–8 frames, and only in the paper desk and dark collage. Vox explainer: **no dissolves, wipes or paper tears at all.**

In code, transitions are **shot head/tail effects** (`src/transitions`, `<Shot head={…} tail={…}>`), not cross-fading presentations. Frame counts below are at the source fps (paper desk 30, others 24); convert with seconds.

## Which transition when

| Situation | Paper desk | Dark collage | Vox explainer | Editorial |
|---|---|---|---|---|
| next fact in the same thread | push-in-through / pull-out-through, whip-through | fall-out → build-in on the same plate | cut on a moving camera; speed-ramped push cut | — |
| change of topic | hard cut (often onto an overscaled settle) | fade through black; crumple-unfold; torn-paper burst | hard cut on a new sentence | wipe-off erase → blank → centre-out reveal |
| change of scale (macro ↔ micro) | zoom-through (map ×16.7 push) | zoom-through match cut; crash push into an eye | **powers-of-ten radial zoom** | snap zoom |
| into a document | photo slide-over; page curl | page turn | cut into a macro, then a page drop | tilt + build |
| into footage | flash-shrink → exposure settle; focus-reticle | lightning | cut into a print with video | — |
| a run of photos | **scale-momentum chain** / **photo carousel** / word-lock montage | — | — | — |
| ending | 48 f linear fade to black + 24 f black | hard cut to the title card | hard cut to the end card | cut to black |

## Catalogue

### Momentum cuts (paper desk; the most common)

| ID | Name | Frame by frame | Build |
|---|---|---|---|
| T-PI | **Push-in-through** | outgoing per-frame zoom ×1.0007, 1.0016, 1.0037, 1.009, 1.015, 1.022, 1.027, 1.038, 1.039 (×1.165 cumulative, ease-in) → **cut** → incoming starts at ×0.67–0.80 and eases out (×1.105, 1.082, 1.059, 1.041, 1.028, 1.017 …) over 8–10 f, sometimes with a 40 f tail | `tail={zoomThroughOut}`, `head={zoomThroughIn}`; scale about the centre; continuous velocity across the cut |
| T-PO | **Pull-out-through** | ×0.998, 0.992, 0.984, 0.971, 0.950, 0.923 (×0.83) → **cut** → incoming from ×1.47: ×0.874, 0.902, 0.937, 0.960, 0.976, 0.987, 0.998 | mirror of T-PI |
| T-PC | **Punch-in into a cut** | accelerating 5–12 % zoom over 5–8 f (per frame 1.0001, 1.0003, 1.001, 1.0027, 1.0063, 1.0126, 1.0184, 1.026; easeInQuart); cut on the fastest frame. Reverse: −3.4 % pull | `tail={punchIn}` |
| T-OS | **Overscaled settle** (shot head) | a new shot starts **×1.3–1.8 too large** (or offset) and settles in 8–14 f; S21 `(0.6,.07,.33,1.01)` on ones, S23 `(.77,.17,.23,.91)` at 12 fps | `head={overscaleSettle}` |
| T-WH | **Whip / slide-through** (12 fps) | f−5: −45 px; f−2: −211 → **cut** → +3: −62; +5: −9; hold (5 f out + 5 f in, ≈200 px per step at the cut). On-ones variant: +4, +6, +12, +22 px/f → cut → +18 | `tail={whipOut}`, `head={whipIn}`; horizontal or vertical; quantise to 12 fps on paper shots |
| T-WP | **Whip-pan** over a photo wall | 3331 px in 53 f, per-step 41, 83, 189, 78, 227, 228, 359, 341, 314, 286, 223, 210 …; directional motion blur ≈ the step length | `CameraRig` + `MotionTrail` |
| T-SM | **Scale-momentum chain** (slideshow) | each card 30 f; before each cut, scale moves with the sign of the next card's entrance (±4–8 % per drawing). In: 0.865–1.165 → 1 over 8–12 f ease-out; out: 4–7 f ease-in | `head={scaleMomentumIn}`, `tail={scaleMomentumOut}`, alternating sign |
| T-CA | **Photo carousel** | 6 cards (81 % × 93 % of frame) slide horizontally on graph paper: positions 7 %, 50 %, 93 %, 100 % at +0, +2, +5, +7 f, then a 13 f dwell (one card every 20 f); `(.51,.21,.19,.87)`; 12 fps | translateX on a strip of cards, pitch 1800 px |
| T-WL | **Word-lock montage** | 17 clippings × 5 f (6 cards/s); each is positioned so the highlighted word lands in the same screen box (x 630–1287, y 423–612); the last card holds 6 f, then pulls out-through | hard cuts with per-card offsets |
| T-FS | **Flash-shrink → exposure settle** | last frames: card zoom 0.992 → 0.975 and the paper washes out (luma +20) → **cut** → footage at −25 % brightness ramps up 80, 88, 94, 98, 101, 103, 105 in 6–8 f (on ones) | `tail={flashShrinkOut}`, `head={exposureIn}` |
| T-ZT | **Zoom-through** (still → still) | outgoing per-frame zoom 1.0006 → 1.0232 accelerating (8 f, + brighten 164 → 182) → **cut** → incoming decelerates 1.031 → 1.069 → 1.028 per step | `zoomThroughOut` + `zoomThroughIn` |
| T-SO | **Slide-out mid-move** | card centre accelerates left (320, 318, 315.5, 311.5, 304.5, 294.5 @640) with a slight drop → cut | `tail={slideOut}` |
| T-IC | **In-card cut** | the rounded card and its yellow edge persist while the footage inside it cuts | keep the card outside the `<Series>`; switch the video inside |
| T-PCap | **Persistent caption** | the ▶ and caption stay on screen across a cut and the text swaps (or it fades out exactly onto the cut) | caption track above the shots |
| T-CS | **Card swap** | the paper stays; car and title vanish; a new car appears at ×0.87 and steps to 1.0 in 5 f | swap children inside a persistent paper layer |
| T-PG | **Page curl** | the bottom-right corner lifts; the flap shows the cream back `#E4D8C0`; the curl line crosses bottom-right → top-left in 8 f (11 f total) | clip the outgoing layer by a moving diagonal + a gradient flap (or a shader) |
| T-SP | **Stop-motion paper wipe** | a crumpled sheet rises from the bottom at ≈8 fps (top edge 720, 613, 451, 376, 211, 111, 39, 0 @720) with ±1.5–3.9° rotation jitter per step, and becomes the next background | keyed y positions + random rotation per step |
| T-FR | **Focus-reticle** (→ footage) | next shot fades in defocused (≈20 px) and overexposed; 2 px white rings appear (outer r 242 → 363, overshoot +14 %); exposure flickers 165/103/188/106/84; the rings shrink as focus sharpens, then collapse; 19 f | blur 30 → 0, brightness keyframes, SVG circles |
| T-ID | **Ink/smoke-mask dissolve** | the new photo bleeds in centre-first through an organic noise mask, α ≈ +0.024/frame (≈40 f) | WebGL noise threshold, or a turbulence mask stepped at 12 fps |
| T-DS | Short dissolve (rare) | α 0.14 … 1.0 over 3–8 f, sometimes quantised to 12 fps (0.27, 0.27, 0.66, 0.66, 0.66, 1); a "ghost pre-blend" puts the next shot at 7 % for 3 f before a hard cut | opacity |
| T-FB | **Fade to black (end)** | luma falls linearly, −4.35 L/frame over 48 f, then 24 f of pure black | `tail={fadeToBlack}` on ones |

### Dark collage

| ID | Name | Frame by frame | Build |
|---|---|---|---|
| C-FTB | **Fade through black with continuity** | the outgoing scene is recomposed at the cut (hero and moon keep their screen positions) while exposure halves every 2 f (61.5 → 23.8 → 9.9 → 5.4 → 2.8 → 1.1); 2 f black; the next scene starts dark and **lights up** over 36 f (ease-in quad), then the lamps pop (+15 L in one step) | `tail={fadeThroughBlack}`, `LightsUp` on the next shot |
| C-TPB | **Dissolve + torn-paper burst** | 2 f 50 % dissolve; a torn paper patch scales 0.54 → 0.80 → 0.92 → 0.98 → 1.0 (on twos) from a bottom-centre anchor and becomes the new ground | `Enter type="burst"` |
| C-ZMC | **Zoom-through match cut** | ×1.17 punch → ×1.5 onto an edge → paper close-up → cut to clean cream with an ornament rising → cut to a new scene containing the same ornament (22 f on twos; weave off) | stepped scale keys |
| C-FOBI | **Fall-out / build-in** | the whole collage falls out (ease-in cubic, 10 f) → bare plate → new pieces slide or drop in one by one (carpet 11 f, furniture 2–10 f each); the plate never cuts | `Exit fallOut` + staggered `Enter` |
| C-CU | **Crumple-unfold** | a crumpled ball (≈35 % H) appears over the scene, grows ×1.6, unfolds into the next map; 4–5 drawings held 4 f each (**on fours**) | pre-rendered crumple stills |
| C-RZ | **Radial zoom-blur crash** | a radially blurred close-up whose luma falls 150 → 112 over 8 f, then a 2 f cross-dissolve to the next scene | `RadialBlur` + 2 f dissolve |
| C-EYE | **Push into the eye → colour cut** | ×2.79 crash push (25 f, log-space), rotational blur on the spinning head, a second push with growing defocus, a near-uniform grey frame, then a hard cut to red fog + pull-back ×0.80 | `crashZoom` + `rackFocus` |
| C-LS | **Lightning double strike** | bolt cut-out shows 4 f early. Strike 1: gain ×1.8 + blur σ 20 px, decaying (×1.37/8, ×1.15/4, ×1.06/3, 2 f each). Strike 2 lands **8 f later**: ×1.44 + offset + blur 24, same decay (≈18 f per event) | `LightningStrike` |
| C-HC | Hard cut to the title card | — | — |

### Vox explainer

| ID | Name | Frame by frame | Build |
|---|---|---|---|
| V-HC | Hard cut (static) | last drawing → first drawing; parity may flip; used on a new sentence | `<Series>` |
| V-RET | **Return cut** | cut back to an earlier desk composition, each time with something new on it (an X, then an "Age?" sticky); annotations persist | reuse the scene with new camera keys |
| V-MOV | **Cut onto a moving camera** | the cut lands on a pan of −60 px/drawing that decelerates over 44 f (`settle`) | `head={settle}` |
| V-SRP | **Speed-ramped push cut** | outgoing push accelerates (zoom/drawing 1.001 → 1.002 → 1.005 → 1.009 → 1.014 → 1.019 → 1.022 → 1.030 → 1.043 → 1.070) → **cut** → incoming starts at ≈1.29/drawing and decelerates (1.055, 1.032, 1.022, 1.016 …), ×1.53 in 34 f, 60 % in the first drawing | `accelerate` tail + `settle` head; no blur |
| V-P10 | **Powers-of-ten radial zoom-out** | outgoing: scale 1 → ≈0.15 in 4 drawings with growing radial streaks → **cut** → incoming macro at ≈5× under σ≈30 px blur, radial streaks, then ≈1.25× → 1.04× → settled within 8 f (66 % in the first drawing); half the transition sits on each side of the cut | `radialZoomOut` + `radialZoomIn` (24-tap radial blur ∝ zoom velocity) |
| V-FLY | **Opening fly-through** | blank dotted paper (2× framing) → a small print passes the lens, growing and blurring → the hero card at σ 20 → 8 → 0 px over 3 drawings → settle pull-back | Z-stacked layers, `scale = 1/(zCam − z)`, `blur ∝ |z − zFocus|` |
| V-PD | **Page drop** (into a document) | cut into a dark blurred macro of text → the page shrinks (scale 6 → 1, expo-out) with concave bent edges that relax to flat over 12 f, a shadow appearing under it | scale + bend + shadow |
| V-FRZ | **Freeze before a cut** | 16 f of a completely frozen frame (grain included) while the voice-over finishes | hold the last drawing |

### Vox editorial

| ID | Name | Frame by frame | Build |
|---|---|---|---|
| E-SZ | **Snap zoom** | ×1.565 about the centre: 5 % then 49 % of the change, then nothing (≈5 f @24, easeInQuart `(.5,0,.75,0)`), **no blur**; reverse ×0.644 | `snapZoom` |
| E-WO | **Wipe-off + grunge dissolve** | the highlighter is at 30 %; a hard vertical edge erases the title right→left (it cuts a glyph mid-stroke); the wordmark erodes through a scratchy grain dissolve; empty after ≈9 f | `WipeOff` + a threshold dissolve |
| E-CO | **Centre-out soft reveal** | a feathered (≈30 px) mask's half-width goes 0.30, 0.68, 0.94, 1.0 over 0.4 s; the tag fades with the text; the masthead +3 f later | `CenterOutReveal` |
| E-TB | **Tilt + build** | the group translates up 209 px (Δ 30, 65, 114, stop; easeInQuad, no blur); the body wipes top→bottom ≈150 px/frame; a photo fades 0.07 → 0.20 → 1.0 | camera tilt + `LineWipe` |
| E-CB | Cut to black | — | — |

## Rules of thumb

1. **Never cross-fade two designed shots** (exceptions: the ≤ 8 f paper-desk dissolves and the 2 f collage dissolves). Cut, and put motion on one or both sides.
2. **Match velocity across the cut.** The incoming shot starts at the same speed and direction the outgoing one ended with, then decelerates (`settle`). Push → push, whip-left → whip-left.
3. **Accelerate out, decelerate in.** The outgoing half is ease-in (`accelerate`, `punchIn`); the incoming half is ease-out (`settle`, `overscaleSettle`).
4. **Keep the drawing rate.** Transition moves on paper/graphic shots step at 12 fps. Footage heads, caption fades and zoom-throughs on stills may run on ones.
5. **Persistent layers don't cut.** Captions, the ▶ bullet, a rounded card holding footage and the dark-collage plate continue across cuts.
6. **Black is a transition only in the dark collage** (fade through black). Elsewhere, black appears only at the very end.
