# Quantitative measurement pass — porsche · dracula · epigenetics · highlight

> Analyst: F. Inputs:
> - `metrics/<id>.csv` and `metrics/<id>_shots.json`;
> - the 640 px frames;
> - native frames decoded by ffmpeg (1280×720 for porsche and highlight; 1920×1080 for dracula and epigenetics).
>
> Every script is in `analysis/stills/F/scripts/` (numpy + PIL only; run with `python3 -I`), and every intermediate output is in `analysis/stills/F/`. Unless stated otherwise:
> - all lengths are **px@1080p** (= px@1920 wide);
> - luma is Rec.709 on a 0–255 scale;
> - "levels" means 8-bit code values;
> - radius r is normalised so that the frame corner is 1.
>
> **Video roles.** porsche = paper-desk scrapbook; dracula = dark collage; epigenetics = real Vox explainer (pillarboxed 4:3 content, x 240–1680, bars #1f1f1f); highlight = Vox-style intro, a 10 fps capture.

## 0. Common corrections applied

| Problem | Effect on the automatic metrics | Fix used here |
|---|---|---|
| Dracula **jitters every frame**: per-frame global shift σ 1.6–1.8 px, p95 4.5 px | `mad_lo` never reaches 0, so the auto held-share is 0.004 and the auto cadence reads "ones" | `residual.py`: phase-correlate each frame to the previous one, sub-pixel Fourier-shift, remove the mean-luma offset, then take the 4×4 box mean abs diff (`mad_res`) |
| Highlight has a **1-in-3 brightness pulse** | every 3rd frame differs even when the artwork is held | use a 3-frame-lag difference (`mad_res3`) |
| H.264 4:2:0 chroma | colour fringes appear only at half resolution; edge-based CA is under-read | gradient-regression CA estimator, validated through a simulated 4:2:0 round trip (×0.68 attenuation, corrected) |
| Large per-frame zooms (>5%/frame) | quadrant-divergence zoom saturates | magnitudes reported as lower bounds; curve shapes checked visually |

## 1. Pacing

Method:
- Shot lengths come from the auto cuts.
- "Merged" absorbs ≤4-frame fragments into the next shot. For porsche these fragments are stepped card-slide/whip transition frames (e.g. f1361–1366), not separate shots.
- A frame is **held** when `mad_res` is below the video's histogram-valley threshold: porsche 0.10, epigenetics 0.30, dracula a per-shot floor test, highlight `mad_res3` < 0.9.
- **Cadence** = histogram of gaps between consecutive change frames inside shots (gap 1 = ones, 2 = twos, 2/3 alternation = 12 fps on a 30 fps timeline).

| | porsche (30 fps) | dracula (24 fps) | epigenetics (23.976) | highlight (10 fps) |
|---|---|---|---|---|
| duration | 196.6 s | 56.3 s | 51.1 s | 16.2 s (15.2 content + 1.0 black) |
| shots / hard cuts | 110 / 109 | 22 / 21 | 14 / 13 | 1 / 1 (cut to black) |
| **cuts per minute** | **33.3** | **22.4** | **15.3** | 0 content cuts |
| shot length s: min / p10 / p25 / **median** / p75 / p90 / max / mean | 0.10 / 0.13 / 0.57 / **1.32** / 2.35 / 4.21 / 8.87 / 1.79 | 0.17 / 0.17 / 0.33 / **1.58** / 3.46 / 5.99 / 9.88 / 2.56 | 0.08 / 1.51 / 2.11 / **2.82** / 4.30 / 5.08 / 13.64 / 3.65 | 15.2 |
| ≤4-frame fragments | 12 (S11, 12, 16, 18, 24, 26, 28, 30, 32, 39, 69, 71) | 3 (S6, S10, S13) | 1 (S1, 2 f) | 0 |
| merged: p10 / median / p90 / mean (s); shots per min | 0.39 / **1.48** / 4.88 / 2.01; 29.9 | 0.33 / **2.58** / 6.82 / 2.96; 20.3 | 1.88 / **3.00** / 5.16 / 3.93; 15.3 | – |
| held share: auto (`mad_lo` < 0.1) → **compensated** | 0.359 → **0.337** | 0.004 → **0.756** | 0.418 → **0.472** | 0.311 → **0.722** |
| change-gap histogram | 1: 69%, 2: 21%, 3: 9%, 4: 1% | 1: 1%, **2: 85%**, 4: 13% | 1: 11%, **2: 89%** | **1: 92%**, 2: 5% |
| per-shot cadence class (share of frames) | ones 40% (40 shots: footage and 3D camera); **12 fps 2:3 15%** (13 shots); mixed 42% (30); static/short 3% | **twos** in 9/9 measurable shots | **twos 92%** (11 shots), ones 4% | ones (10 fps capture) |
| unique drawings per s while animating | 21.1 (mix of 30 and 12) | 10.7 | 12.7 | 8.8 |
| auto `cadence_hold` agrees with gap method | 30 of 83 shots (auto says "twos" for ones-shots with a few stray holds) | 0 of 9 (jitter → auto says "ones") | 13 of 13 | – |

**Verification sequences** (`#` = artwork change, `.` = hold, residual metric; `pacing.py`):

| Video / shot / frames | Pattern | Reading |
|---|---|---|
| porsche S21 f1126–1161 | `#.#..#.#..#.#..#.#..#.#..#.#..#.#..#` | **2:3 alternation = 12 drawings/s on 30 fps** (24p-on-twos source exported at 30p) |
| porsche S44 f1879–1914 | `..#.#..#.#..#.#..#.#..#.#..#.#..#.#.` | same |
| porsche S1 f21–56 | `####################################` | ones: rendered camera pull-out at 30 fps |
| porsche S109 f5566–5601 | `.##.#.##.#.##.###..###..###` | camera pan stepped 2:3 with a few extra layer changes |
| epigenetics S9 f797–832 | `.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#` | **twos** (camera moves are on twos too) |
| dracula S3 f150–174, `mad_res` | 25.4 0.81 14.0 1.10 5.02 0.68 1.09 0.61 … 5.26 0.53 7.11 0.63 5.96 0.69 5.14 | **twos** under per-frame jitter and grain (raw `mad_lo` ≈1–2 on every frame) |
| highlight f8–f14 vs f14–f30 | change on consecutive frames during the wipe; `mad_res3` ≈ 0 in the hold | ones (capture), long holds |

**Conclusion.** The reference animation runs at **12 drawings/s**, either on twos at 24 fps or as 2:3 at 30 fps. Live footage and some rendered camera moves run on ones. Dracula adds a per-frame (24 fps) jitter and grain layer **on top of** twos animation.

## 2. Camera moves

**Method** (`camera.py`, `camera_coherence.py`, `camera_summary.py`):
- Per shot, build cumulative Px, Py (px) and Z = Σ ln(zoom). Combined speed v = |ΔP| + |ΔZ|·1101 px (the corner displacement), smoothed over 5 frames to kill the twos/2:3 stepping and the jitter.
- A move is a core with v ≥ 1.2 px/frame for ≥ 6 frames and ≥ 10 frames in total, extended both ways until v < 10% of its peak.
- Progress is normalised to 0..1 in time and distance. For zooms this is done in **linear scale space**, (s − s0)/(s1 − s0), which is what `interpolate()` drives.
- Cubic-bezier fit by least squares (numpy Nelder–Mead, 7 starts). The fitter was validated on synthetic CSS curves to ±0.02 per parameter.
- **Coherence test.** The 4 quadrant shifts per frame must fit one similarity transform: residual / predicted RMS ≤ 0.30. Without this test, sliding layers, orbiting objects and footage were counted as moves.
- Of 106 candidates, **22 coherent camera moves** were kept. Rejection reasons: 62 small or noisy, the rest incoherent. Example rejects: epigenetics f767–850 (dishes orbit a static card, coh 0.95) and porsche f490–501 (portraits slide up over a static map, coh 0.39).
- **Abruptness metric.** vS / vE = mean normalised velocity over the first / last 15% of the move (1 = average speed). Eased if < 0.5, abrupt if > 1.0.

| Cat. | Video S, frames | n f / s | Distance / zoom | Mean px/s · peak px/s (zoom %/s) | bezier (x1, y1, x2, y2) | RMSE | vS / vE | Shape |
|---|---|---|---|---|---|---|---|---|
| pan | dracula S7 f423–434 | 12 / 0.50 | 342 px (×1.15) | 684 · 2836 | .62, .07, .72, 1.18 | .048 | .41 / .02 | in-out |
| pan | epig S7 f661–692 † | 32 / 1.33 | 343 px | 257 · 2340 | .69, .05, .42, .87 | .021 | .15 / .46 | in-out |
| pan | porsche S8 f537–557 | 21 / 0.70 | 453 px (×0.70) | 647 · 2506 | .58, .10, .41, .90 | .002 | .33 / .29 | in-out |
| pan | porsche S93 f4533–4554 | 22 / 0.73 | 56 px | 76 · 195 | .19, −.05, .00, .26 | .047 | .01 / 1.02 | in |
| pan | porsche S100 f4915–4958 | 44 / 1.47 | 754 px | 514 · 1155 | .50, .21, .56, 1.10 | .011 | .55 / .08 | out-ish |
| pan | porsche S107 f5302–5333 | 32 / 1.07 | 319 px | 299 · 1646 | .41, −.01, .33, .90 | .028 | .48 / .35 | in-out |
| pan | porsche S109 f5546–5720 | 175 / 5.83 | 4144 px | 710 · 2672 | .27, −.03, .27, .75 | .022 | .61 / .27 | in-out (long) |
| push | dracula S14 f819–842 † | 24 / 1.00 | ×2.77 (visual ≈×4–5) | (+176%/s) · 3138 | .59, .08, .53, .96 | .029 | .31 / .38 | in-out |
| push | epig S2 f55–71 | 17 / 0.71 | ×1.20 | (+29%/s) · 1451 | .73, .08, .40, .84 | .036 | .14 / .32 | in-out |
| push | epig S4 f444–461 | 18 / 0.75 | ×1.24 | (+33%/s) · 1026 | 1.0, .19, .89, 1.12 | .034 | .30 / 2.04 | in |
| push | epig S8 f729–745 | 17 / 0.71 | ×1.35 | (+52%/s) · 2702 | .79, .21, .18, .69 | .036 | .34 / .52 | in-out |
| push | porsche S7 f346–403 | 58 / 1.93 | ×17.8 (map zoom-through) | (+343%/s) · 3523 | .86, −.05, .71, .71 | .007 | .06 / 1.89 | in |
| push | porsche S77 f3296–3334 | 39 / 1.30 | ×2.08 | (+76%/s) · 2606 | .59, .02, .73, .93 | .023 | .21 / .64 | in-out |
| push | porsche S92 f4508–4530 | 23 / 0.77 | ×1.15 | (+19%/s) · 860 | .82, 1.56, .20, .33 | .050 | 2.4 / .42 | out |
| push | porsche S108 f5453–5469 | 17 / 0.57 | ×1.07 | (+12%/s) · 490 | 1.0, .33, .26, .65 | .050 | .03 / .31 | in-out |
| pull | dracula S15 f875–886 | 12 / 0.50 | ×0.80 | (−37%/s) · 1893 | .59, −.03, .43, 1.03 | .053 | .27 / .11 | in-out |
| pull | porsche S1 f1–75 | 75 / 2.50 | ×0.143 | (−54%/s) · 3464 | .15, .50, .00, .92 | .009 | 4.0 / .12 | **out** |
| pull | porsche S1 f76–105 | 30 / 1.00 | ×0.907 | (−9%/s) · 291 | .23, .52, .49, .88 | .007 | 2.03 / .28 | **out** |
| whip | porsche S84 f4063–4086 | 24 / 0.80 | 1180 px | 1475 · **4443** | .16, −.16, .33, .77 | .034 | 1.14 / .43 | out |
| whip/zoom | porsche S17 f778–791 | 14 / 0.47 | 287 px, ×0.68 | 616 · 3664 | .86, .55, .00, .40 | .053 | .87 / .00 | mixed |
| drift | porsche S77 f3346–3418 | 73 / 2.43 | 112 px | 46 · 142 | .49, .06, .63, .89 | .012 | .27 / .62 | ≈linear |
| drift | porsche S78 f3439–3695 | 257 / 8.57 | ×1.148 | (+1.6%/s) · 77 | .40, .16, 1.0, 1.03 | .009 | .56 / 1.25 | ≈linear |

† The zoom component saturates the per-frame estimator; the true scale change is larger. Epig S7 is visually a push into the page (≈×3).

**Summary per category** (medians; IQR in brackets):

| Category | n | Duration s (frames @24) | Amount | Speed | Start eased / abrupt | End eased / abrupt | Pooled bezier (RMSE) |
|---|---|---|---|---|---|---|---|
| pan | 7 | **1.07** [0.71–1.40] (26 f) | 343 px | mean 514 px/s, peak 2340 px/s | 5 / 0 | 6 / 1 | .40, .07, .56, .95 (.070); in-out subset n=5: **.50, .06, .54, 1.00** (.060) |
| push-in | 8 | **0.76** [0.71–1.07] (18 f) | ×1.29 (×1.07–17.8) | +43%/s | 7 / 1 | 4 / 2 | .51, .14, .64, .75 (.145); in-out subset n=4: **.70, .13, .42, .84** (.046) |
| pull-out | 3 | **1.00** [0.75–1.75] (24 f) | ×0.80 (×0.14–0.91) | −37%/s | 1 / 2 | 3 / 0 | decelerating pair (porsche S1): **.08, .06, .01, .84** (.085) |
| whip | 2 | 0.47–0.80 (11–19 f) | 287–1180 px | peak 3660–4440 px/s | 0 / 1 | 1 / 0 | .16, −.16, .33, .77 |
| drift | 2 | 2.4–8.6 | 112 px / ×1.15 | 46 px/s / +1.6%/s | – | – | .37, .06, .77, .89 (.031), ≈linear |
| **all ease-in-out** | 10 | 0.71 | – | – | – | – | **.58, .09, .49, .94** (.059) |

**Findings.**
1. **Ease-in-out dominates** (10 of 22). Starts are eased in 14/22 moves (abrupt 4/22), ends in 15/22 (abrupt 4/22).
2. Push-ins are **back-loaded**: slow start, x1 ≈ 0.7–0.8.
3. Big pull-outs are **front-loaded**, expo-out style: porsche S1 reaches 48% of its scale change at t = 0.11, starting from a zoom-blurred frame.
4. Pans are close to a symmetric `easeInOutCubic`.
5. In porsche and epigenetics, camera moves are **stepped with the drawings** (2:3 or twos), so the position curves are staircases (`easing_curves.png`). Dracula moves on twos under its per-frame jitter.
6. **Layer motion is not camera motion.** Porsche f490–501 (two portraits rising from below over a static map) fits `.55, 1.22, .41, .97` over 12 f / 0.4 s, an **overshoot ease-out**: use it for element entrances.

**Visual sanity checks** (montages `stills/F/move_*.png`):
- porsche S1 pull-out ✔ (ease-out from a zoom-blurred close-up);
- porsche S109 pan ✔ (desk pan, ease-in-out);
- dracula S14 push into the TV ✔ (ends in zoom blur);
- porsche S77 push to the article ✔;
- epigenetics S7: push into the paper, scale under-read;
- epigenetics S9: object orbit, rejected ✔;
- porsche f490: layer slide, rejected ✔.

## 3. Film grain

**Method** (`grain.py`):
- Sample consecutive native pairs (k−1, k) inside shots: porsche every 9th frame, dracula and epigenetics every 5th, highlight every frame. Dracula pairs are integer-aligned first.
- **Static flat blocks** (48 px @1080p): low-pass content unchanged between the two frames (|ΔL| < 1.5), low-pass gradient < 1.2 levels/px, luma 40–215.
- σ_t = std(ΔY)/√2 is the per-frame temporal noise. The high-pass uses σ = 1.5 px@1080p.
- Grain size = autocorrelation half-width at 50% (HWHM) of ΔY. Texture size = HWHM of the single-frame high-pass.
- Mono vs chroma = correlation of ΔR and ΔB with ΔG, and std(ΔR − ΔG)/std(ΔG).
- **Uncertainty.** These are values *after* H.264 (5 Mbps at 1080p, ~2 Mbps at 720p), which removes the finest grain. σ is about ±15% shot to shot; HWHM is about ±0.2 px.

| | porsche | dracula | epigenetics | highlight |
|---|---|---|---|---|
| pairs analysed | 444 | 135 | 196 | 80 |
| **σ_t per frame (levels)**, median [IQR] | 0.16 [0.05–0.40] | **3.25** [2.19–4.10] | 0.99 [0.54–2.63] | 0.06 [0.00–0.57] |
| σ_t on change / hold frames | 0.32 / 0.05 | 4.00 / 2.89 | **2.67 / 0.54** | 0.66 / 0.03 (pulse) |
| animated? | no. Only 7 of 77 shots have σ_t > 0.5 (footage-like shots) | **every frame (24 fps)**; no duplicate pairs | **with each drawing (on twos)**. Holds keep the grain frozen; change frames with zero global shift still show σ 2.26 | no; held frames are bit-identical |
| spatial high-pass σ (single frame) | 1.41 | 4.55 | 3.42 | 2.28 |
| temporal / spatial high-pass ratio | 0.09 (texture static) | 0.62 | 0.26 (0.8 on change frames) | 0.02 |
| implied static texture σ | ≈1.4 | ≈3.6 | ≈3.3 | 2.3 (paper) |
| **grain size, HWHM** px@1080p (temporal) | 0.80 * | **0.82** | 0.57 | 0.78 * |
| texture HWHM px@1080p (spatial) | 1.14 | 0.91 | 0.71 | 1.10 |
| corr(ΔR, ΔG) / corr(ΔB, ΔG) | 0.94 / 0.92 | **0.99 / 0.99** | 0.98 / 0.96 | 1.00 / 0.95 |
| chroma noise std(ΔR − ΔG)/std(ΔG) | 0.25 | 0.12 | 0.18 | 0.00 |
| verdict | **monochrome**, near-none | **monochrome, animated every frame**, ≈1 px | **monochrome, animated on twos**, ≈1 px | none; static mono paper |
| σ_t by level (darks → lights) | – | 3.5 → 2.8 (≈additive) | ≈1 → 1 | – |

\* Porsche and highlight temporal residuals are mostly codec noise.

## 4. Chromatic aberration

**Method v1** (`ca.py`): upsampled phase correlation of R and B vs G in an 8×5 tile grid. Precision ±0.01 px on synthetic shifts. It reads ≈0 everywhere because 4:2:0 H.264 carries the high-frequency edges in luma, so R and B edges follow G.

**Method v2** (`ca2.py`, used for the numbers below):
- On neutral tiles (HSV-S < 0.15), blur to chroma bandwidth (σ 1.2 px) and regress C − G = c0 + c1·G − dx·∂G/∂x − dy·∂G/∂y.
- Validation: shifts of 0.4–1.5 px are recovered exactly in RGB, and at **0.68×** through a simulated 4:2:0 round trip. Values below are divided by 0.68.
- It saturates above ≈2 px (a 3 px shift reads as 1.8).
- One held frame per shot. Model: shift = uniform offset + k·(p − centre).

| | porsche | dracula | epigenetics | highlight |
|---|---|---|---|---|
| frames (≥4 neutral tiles) / tiles | 64 / 979 | 12 / 315 | 12 / 247 | 10 / 158 |
| per-frame median \|R−G\| px@1080p, raw: p50 / p90 / max | 0.64 / 1.56 / 3.27 | 0.01 / 0.08 / 0.14 | 0.70 / 0.91 / 0.94 | 0.04 / 0.09 / 0.09 |
| frames > 0.5 px raw | 41/64 (16 > 1 px) | 0/12 | 9/12 | 0/10 |
| **pattern** | **uniform diagonal RGB split** in a subset of shots: R toward +x+y, B toward −x−y. E.g. f2344 R (+1.31, +1.30) raw with B ≈ 0; f5634 R (+2.0, +2.7), B (−2.2, −2.75). Radial term inconsistent (±0.9) | **none** | **radial, lens-like** in every frame: R magnified, B shrunk, uniform offset ≈0 (±0.1) | none |
| **corrected magnitude @1080p** | typical R (+1.5, +1.5), B 0 to (−1.5, −1.5); up to ≈±4–5 px on strong shots (saturated) | < 0.15 | **R +2.1 px, B −3.6 px at the frame corner** (k_R = +0.0019, k_B = −0.0033 per px of radius). At the 4:3 content corner (r = 0.82): +1.7 / −2.9 px | < 0.15 |

The visual check of porsche f912 (`porsche_f912_crop_x2.png`) shows cyan/orange fringes on B/W archival photos, consistent with the RGB split.

## 5. Vignette

**Method** (`vigtone.py`, `vignette2.py`):
- (a) Per-pixel median of exposure-normalised frames, which works when content is uncorrelated with position: porsche only.
- (b) Fits on **background-only pixels** (flat, low saturation, within ±35% of the frame's background median) on frames where paper or desk fills the frame. The model is L = L0(1 − a·r^p), with r circular (distance / half-diagonal) or elliptical (aspect-normalised); both are reported.
- Uncertainty = IQR over frames.

| | porsche | dracula | epigenetics | highlight |
|---|---|---|---|---|
| frames | 347 (median image) + 12 cream frames | 12 paper / zoom-blur frames + 5 end-card frames | 11 desk frames (content area only) | 9 (blank paper f0, f63, f64 + paper pixels) |
| **a (corner darkening)** | **0.21** [0.18–0.30]; median image 0.19 | 0.02 on full-frame paper (f294–306); the end card reads *negative* (lighter grunge at the edges) → **no global vignette** | 0.036 (ellipse) / 0.064 (circle) | **0.15** [0.145–0.152] |
| exponent p | 1.9 (median image fit 1.6) | – | 2.2 / 3.6 | 1.4 |
| −2% / −5% radius | 0.29 / 0.47 | – | ≈0.6 / ≈0.85 | 0.24 / 0.46 |
| shape | **circular**: edge midpoints L/R 0.858 vs T/B 0.951; a circular model predicts 0.84 / 0.94 | – | follows the 4:3 window (ellipse RMSE 0.0024 < circle 0.0045) | **circular** (RMSE 0.0029 vs 0.0044) |
| fit RMSE | 0.0016–0.0028 on cream frames | – | 0.0024 | 0.0029 |

Dracula's dark edges come from the collage plates (grunge borders), not from an overlay.

## 6. Tone

**Method** (`vigtone.py`): 290–360 sampled 640 px frames per video (95 B-state frames for highlight), content area only.
- Per frame: luma 0.5 / 99.5 percentiles and channel percentiles. Hex = median over frames.
- R−B mean; HSV-S mean.
- Neutral-pixel (S < 0.25) tint per luma band: dark 10–70, mid 70–170, light 170–250.

| | porsche | dracula | epigenetics (content only) | highlight |
|---|---|---|---|---|
| **black point** luma p10 / med / p90 → hex | 0 / 2.6 / 31 → **#020200** | 8 / 10.3 / 23 → **#0b0a07** | 20 / 37.9 / 46 → **#262519** | 59 / 60 / 68 → **#3f3930** |
| **white point** p10 / med / p90 → hex | 203 / 235 / 249 → **#f3eee1** | 128 / 210 / 228 → **#d3d2cc** | 211 / 228 / 234 → **#ece8e9** | 193 / 194 / 196 → **#c6c3b5** |
| lifted blacks? | no: true black in TV-frame surrounds and dark plates | slightly (≈10) | **yes** (≈38): the darkest elements are charcoal cards. Pillarbox #1f1f1f | **strongly** (60), with dimmed whites (194) |
| warmth R−B p10 / med / p90 | 2 / **14.8** / 34 | 5 / **10.0** / 15 | 2.5 / **5.6** / 10.5 | 19 / **20.3** / 22 |
| mean saturation p10 / med / p90 | 0.10 / **0.21** / 0.43 | 0.06 / **0.11** / 0.16 | 0.05 / **0.08** / 0.11 | 0.11 / **0.12** / 0.13 |
| neutral share (S < 0.1) | 0.47 | 0.72 | 0.81 | 0.40 (tinted paper) |
| neutral tint R−B, dark / mid / light | +2.3 / +7.6 / +16.0 | +0.5 / +2.0 / +10.5 | −0.6 / +0.7 / +1.2 | +10.6 / +18.9 / +18.6 |
| neutral tint G−(R+B)/2, dark / mid / light | +1.2 / +2.1 / +2.0 | −0.2 / −0.1 / +1.5 | −1.8 / −1.7 / −0.7 | +3.8 / +5.8 / +6.0 |
| photos | archival B/W photos **warm-tinted** (f912 mids #98948f, R−B +9.8); colour footage kept saturated | B/W cut-outs **near-neutral** (Lugosi mids #817f7c, R−B +4.6); colour is only spot red (#7b…) and orange | neutral greys + yellow accent | **sepia-tinted** photo (#807972, R−B +14) |
| reading | warm highlights over neutral shadows (paper grade) | neutral mono + warm paper + spot colour | neutral, matte, lifted | warm-olive matte, very low contrast |

## 7. Shadows of photos and cut-outs

**Method** (`shadow.py`, `shadow_joint.py`):
- Native stills. Per scanline, find the object edge (the outer bright-to-dark edge for white-bordered photos), align the profiles and take the median background luma B(d).
- Darkening D(d) = 1 − B(d)/B_far is fitted with α·(1 − Φ((d − o)/σ)).
- For a full drop shadow, sides are fitted jointly with shared α and σ, and a signed offset per axis.
- Uncertainty is about ±2 px in offset and σ, and ±0.05 in α (one object, 50–200 scanlines per side).

| # | Video, frame (shot) | Element → receiver | Measured | Read as |
|---|---|---|---|---|
| P1 | porsche f5720 (S109) | white-bordered photo → cream desk (B_far #f1e3d8) | darkening at the edge: right 33%, bottom 31%, **left 0%**. Half-decay ≈12 px (right), 10.5 px (bottom). Joint fit: **opacity 0.43, σ 6.4 px (CSS blur ≈13 px), offset (+9.8, +7.5) px**, RMSE 0.011 | classic drop shadow, light from the top-left; colour near-neutral to slightly cool on the warm desk (channel split contaminated by this shot's RGB split) |
| P2 | porsche f2560 (S62) | "1969" card stack → blueprint paper | 76% darkening at the contact edge, decaying 73, 69, 64 … 13, 10, 8% over 58 native px. **Half-decay ≈37 px, 10% at ≈85 px**. Exponential, not Gaussian (the erf fit needs α > 1) | soft ambient/contact shadow (AO falloff) around a stack of cards |
| P3 | porsche f1900 (S44) | 911 cut-out → cream ground | luma right below the body 221–233 vs 214–227 further down (the vignette) → **no contact shadow** | floating cut-out |
| D1 | dracula f250 (S3) | gold frame → torn paper | 1.3% at d = 2–4 px, then 0 ± 0.6% | **no drop shadow** |
| D2 | dracula f600 (S11) | push-pin with a 5 px white sticker outline → map | right side −9…+10% (map line texture); left 25% on only 7 scanlines (inconsistent) | no measurable shadow (< ≈5%) |
| D3 | dracula f400 (S7) | standing figure → book page | no elliptical contact shadow; the page darkens 215 → 150 over 260 px (book shading) | none |

**Verdict.** The paper-desk look uses real drop shadows on photos (α ≈ 0.4, blur ≈13 px, offset ≈(10, 8) px) and AO-like contact shadows on paper stacks. The **dark collage uses flat, shadowless cut-outs**; their separation comes from white sticker outlines, red torn edges and value contrast.

## 8. Flicker

**Method** (`flicker.py`):
- Global luma (320 px mean) on **held pairs only** (artwork unchanged by the compensated metric), so animation does not count as flicker.
- σ_flicker = std(ΔL)/√2.
- Periodicity from the mean autocorrelation over runs of ≥ 8 held frames, plus a 16-frame windowed spectrum.
- Porsche and epigenetics have no long held runs, so ΔL between consecutive *unique drawings* with slow change was also checked.

| | porsche | dracula | epigenetics | highlight |
|---|---|---|---|---|
| held pairs | 1814 (mostly 2:3 duplicates) | 927 | 562 | 109 |
| per-frame σ (levels / % of luma) | 0.006 / 0.00%; between unique drawings p95 \|ΔL\| 0.30, lag-1 autocorrelation +0.95 (slow fades, not flicker) | **0.17 / 0.26%** | 0.025 / 0.02%; between drawings p95 0.37 | **1.37 / 0.81%** |
| periodicity | none | none (autocorrelation lags 1–6 within ±0.1) | none | **period 3 frames** (lag-3 autocorrelation +0.99, lags 1–2 −0.5) = 0.3 s, 3.33 Hz; spectral peak/median 63 |
| pulse shape | – | – | – | 1 bright frame in 3: +2.1…+2.9 levels mean; paper +1.1% (centre) → +2.1% (corners); ink unchanged |

## 8b. Jitter (gate weave)

Measured with `res_<id>.csv` global shifts, on shots with no detected camera move.

| | dracula | epigenetics | porsche |
|---|---|---|---|
| per-frame Δ shift σ x / y | **1.63 / 1.79 px** (\|Δ\| median 0.95, p95 4.5) | 0.20 / 0.11 | dominated by footage motion; median \|Δ\| 0.01 → none |
| position residual σ (after a 9-frame moving average) | **1.31 px** | 0.11 | – |
| lag-1 autocorrelation of Δ | −0.15 (mostly random, weakly mean-reverting) | – | – |

## 9. Design tokens

```ts
// Vox-style reference tokens, measured by analyst F (analysis/quantitative.md).
// Units: px @1920x1080 (scale ×2 for 4K), seconds, 8-bit levels (0–255), CSS cubic-bezier [x1, y1, x2, y2].
export const voxTokens = {
  timeline: {
    fps: 24,                       // dracula 24, epigenetics 23.976 (§1)
    drawingFps: 12,                // §1: epigenetics 89% gap=2, dracula 85% twos, porsche 2:3 on 30p
    holdFrames: 2,                 // on twos @24
    cameraStepsWithDrawings: true, // §2: porsche/epigenetics camera moves are staircases on 2s/2:3
    jitterAndGrainOnOnes: true,    // §3/§8b: dracula grain and jitter update every 24 fps frame
  },
  pacing: {
    shotSeconds: {                 // §1 median [p10, p90] after merging <=4 f fragments
      explainer: { median: 3.0, p10: 1.9, p90: 5.2 },   // epigenetics
      collage:   { median: 2.6, p10: 0.33, p90: 6.8 },  // dracula
      paperDesk: { median: 1.5, p10: 0.39, p90: 4.9 },  // porsche
    },
    cutsPerMinute: { explainer: 15, collage: 22, paperDesk: 33 },             // §1
    heldShare: { explainer: 0.47, collage: 0.76, paperDesk: 0.34, intro: 0.72 }, // §1 compensated
    beatHoldSeconds: { min: 0.5, median: 1.6, max: 3.1 },  // highlight.md §2: holds between actions
    transitionFragmentFrames: 3,                           // §1 porsche card-slide steps at 30 fps
  },
  easing: {
    cameraInOut: [0.58, 0.09, 0.49, 0.94],  // §2 pooled 10 ease-in-out camera moves, RMSE 0.059
    pan:         [0.50, 0.06, 0.54, 1.00],  // §2 pans (ease-in-out subset n=5), RMSE 0.060
    pushIn:      [0.70, 0.13, 0.42, 0.84],  // §2 push-ins (n=4), back-loaded, RMSE 0.046
    pullOut:     [0.08, 0.06, 0.01, 0.84],  // §2 porsche S1 pull-outs, front-loaded expo-out, RMSE 0.085
    drift:       [0.37, 0.06, 0.77, 0.89],  // §2 slow drifts ≈ linear, RMSE 0.031
    whip:        [0.16, -0.16, 0.33, 0.77], // §2 porsche S84 whip-pan
    layerEnterOvershoot: [0.55, 1.22, 0.41, 0.97], // §2 porsche f490 photos slide up (12 f / 0.4 s)
    snapZoom:    [0.5, 0, 0.75, 0],         // highlight.md §7 easeInQuart, max err 0.022
    highlighter: [0.11, 0, 0.5, 0],         // highlight.md §7 easeInQuad, max err 0.044
    textRevealCenterOut: [0, 0, 0.58, 1],   // highlight.md §7 easeOut, max err 0.078
  },
  durations: {                     // seconds (frames @24 in comments)
    pan: 1.07,                     // §2 median, IQR 0.71–1.40 (17–34 f)
    pushIn: 0.76,                  // §2 median, IQR 0.71–1.07 (17–26 f)
    pullOut: 1.0,                  // §2 median (0.75–1.75); big map pull-out 2.5
    whip: 0.6,                     // §2 0.47–0.80
    drift: [2.4, 8.6],             // §2
    snapZoom: 0.2,                 // highlight.md: 2 f @10 fps (≈5 f @24)
    highlighterInline: 0.3,        // highlight.md: strokes 2/3, independent of length (436–834 px)
    highlighterTitle: 0.9,         // highlight.md: 898 px stroke
    textReveal: 0.4,               // highlight.md: centre-out headline, line wipe of the body
    fadeIn: 0.3,                   // highlight.md: tag, photo
    highlighterFadeOut: 2.4,       // highlight.md: linear
    layerEnter: 0.4,               // §2 porsche f490
  },
  speeds: {
    panPxPerSec: { mean: 514, peak: 2340 },  // §2 medians
    whipPeakPxPerSec: 4000,                  // §2 3660–4440
    pushInZoomPctPerSec: 43,                 // §2 median
    pullOutZoomPctPerSec: -37,               // §2 median
    driftPxPerSec: 46, driftZoomPctPerSec: 1.6, // §2 porsche S77 (translation) / S78 (slow push)
    highlighterPxPerSec: 1200,               // highlight.md title stroke (inline strokes reach ≈3800 at the end)
    motionBlur: false,                       // highlight.md: a 3 px rule stays 3 px at 114 px/frame
  },
  grain: {                         // monochrome additive luma noise; size ≈1 px @1080p (HWHM 0.6–0.9), §3
    collage:   { sigma: 3.3, update: "everyFrame", sizePx: 0.85, chroma: 0.12, staticTextureSigma: 3.6 }, // dracula
    explainer: { sigma: 2.7, update: "onDrawings", sizePx: 0.6, chroma: 0.18, staticTextureSigma: 3.3 },   // epigenetics change frames
    paperDesk: { sigma: 0.3, update: "onDrawings", sizePx: 0.8, staticTextureSigma: 1.4 },               // porsche: practically none
    intro:     { sigma: 0, staticTextureSigma: 2.3, textureSizePx: 1.1 },                                // highlight: static paper only
    encodeCompensation: 1.3,       // measured after H.264; render about 1.3× stronger if the final encode is ~5 Mbps
  },
  jitter: { collage: { positionSigmaPx: 1.3, update: "everyFrame", meanReversion: 0.15 } }, // §8b dracula
  chromaticAberration: {          // §4 (gradient regression, corrected for 4:2:0)
    explainerLens: { redScale: 0.0019, blueScale: -0.0033 }, // radial: R +2.1 / B −3.6 px at the frame corner
    paperDeskSplit: { red: [1.5, 1.5], blue: [-1.5, -1.5], maxPx: 4, onlySomeShots: true }, // uniform diagonal split
    collage: null, intro: null,   // < 0.15 px
  },
  vignette: {                     // L = 1 - a * r^p, r = distance / half-diagonal (§5)
    paperDesk: { a: 0.21, p: 1.9, shape: "circle" },  // porsche
    intro:     { a: 0.15, p: 1.4, shape: "circle" },  // highlight
    explainer: { a: 0.04, p: 2.2, shape: "ellipse" }, // epigenetics, inside the 4:3 window
    collage:   { a: 0 },                              // dracula: none (dark plates instead)
  },
  flicker: {                      // §8
    intro: { periodFrames: 3, periodSec: 0.3, gainCenter: 0.011, gainCorner: 0.021, layer: "paper" }, // highlight
    others: { sigmaPct: 0.3 },    // dracula 0.26%; porsche/epigenetics ≈0: leave off
  },
  shadows: {                      // §7
    photoOnDesk: { offsetX: 10, offsetY: 8, blurPx: 13, opacity: 0.43, color: "#000" }, // porsche P1 joint fit
    paperStackAO: { edgeOpacity: 0.75, halfDecayPx: 37, extentPx: 90 },                // porsche P2 (exponential)
    collageCutout: null,          // dracula D1–D3: no shadows; use 5 px white sticker outlines instead
  },
  tone: {                         // §6 (0.5% / 99.5% luma → hex), warmth = mean(R−B) levels, sat = mean HSV-S
    paperDesk: { black: "#020200", white: "#f3eee1", warmth: 15, sat: 0.21, photoTint: "warm B/W, R−B ≈ +10" },
    collage:   { black: "#0b0a07", white: "#d3d2cc", warmth: 10, sat: 0.11, photoTint: "neutral B/W + spot red" },
    explainer: { black: "#262519", white: "#ece8e9", warmth: 5.6, sat: 0.08, pillarbox: "#1f1f1f", contentWidth: 1440 },
    intro:     { black: "#3f3930", white: "#c6c3b5", warmth: 20, sat: 0.12,
                 paper: "#b3aca0", ink: "#4c4844", highlighter: "#bb923a", tag: "#7b3c3a" },
  },
} as const;
```

## 10. Evidence index (`analysis/stills/F/`)

| File | Content |
|---|---|
| `scripts/common.py`, `bezier.py` | decode, phase correlation, blur helpers; cubic-bezier evaluator and Nelder–Mead fitter |
| `scripts/residual.py` → `res_<id>.csv` | jitter- and flicker-compensated change metric (`mad_res`, `mad_res3`, global shift) |
| `scripts/pacing.py` | §1 tables and cadence |
| `scripts/camera.py`, `camera_coherence.py`, `camera_summary.py` → `camera_moves.json`, `camera_summary.json`, `easing_curves.png` | §2 detection, coherence, fits, plot (grey = per-move normalised curves, red = pooled fit, blue = CSS `ease`) |
| `move_*.png` (via `scripts/move_strip.py`) | sanity montages of moves (t, progress per cell) |
| `scripts/grain.py` → `grain_*.json`, `grain_porsche.log` | §3 |
| `scripts/ca.py`, `ca2.py`, `ca_frames.py` → `ca*.json`, `ca.log`, `porsche_f912_crop_x2.png` | §4 (v1 phase correlation, v2 gradient regression with a 4:2:0 validation mode) |
| `scripts/vigtone.py`, `vignette2.py` → `vigtone.json`, `vignette_median_<id>.png`, `vignette_medians_all.png`, `dracula_vignette_check.png` | §5, §6 |
| `scripts/shadow.py`, `shadow_joint.py`, `gridcrop.py` → `shadowprof_*.npy`, `grid_*.png`, `*_native.png`, `shadow_*.png` | §7 |
| `scripts/flicker.py` | §8 |
| `overview_<id>.png` (via `scripts/overview.py`) | one frame per shot, for orientation |
| `../strips/porsche_01359-01370.png` | porsche card-slide transition split into 3-frame "shots" |
