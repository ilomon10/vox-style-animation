# 05 · Textures, materials & finish

Everything below is measured. In code, paper materials come from `<Paper kind=…>` and the frame finish from `<FilmFinish>` (presets in `src/tokens/finish.ts`). Textures are generated procedurally and tile seamlessly: `tools/py tools/textures/generate_textures.py` writes `public/textures/`.

## 1. Paper & grounds

| Kind | Style | Measurement | Recipe |
|---|---|---|---|
| `warm` | paper desk | `#F9EFE6`; high-pass σ 1.2–2.5 levels; **speckle** ≈30 dark flecks per 100×100 px, mostly 1–3 px, up to 7 px, rare 40 px blobs, ΔL −8…−20, warm grey with a few red/pink | spectral-noise mottling (±1.5 %) + Poisson-scattered dots r 0.5–2 px at 30–60 % opacity + faint fibres |
| `grid` | paper desk | warm paper + 1 px lines, pitch **35 px**, ≈ −10…−15 L | `repeating-linear-gradient` 1 px, `rgba(90,80,70,.12)` |
| `desk` | paper desk | `#EFE3DA`, darker/greyer at the edges `#D4C8BE` | warm paper texture, slightly darker |
| `dots` | Vox | `#D6D3D3`; static mottling σ≈2.5; **dot grid pitch 32 px, dot Ø 4–5 px**, Δluma −15…−25, slightly soft | SVG `<pattern>`: circle r 2.3 on a 32 px grid, `#4A4A4A` at 35 % multiply + low-frequency noise at 4–5 % |
| `board` | Vox | `#1F1D20`, diagonal dot mesh pitch ≈10–13 px | 45° pattern of r 2 dots, white at 6–8 % |
| black card (`DiagramCard`) | Vox | `#353336` + regular dot mesh pitch 10 px, +10…+15 L | 10 px pattern of r 2 dots, white 6–8 % |
| `blackCard` | dark collage | mean L 24–47; static 1–2 px white scratch arcs, chalky scuffs; **corners/edges lighter by +18…+37 L** (worn card); plate grain σ≈3.6 levels | generated scratched black texture (`paper_black.jpg`) + edge lift (a screen-blended radial gradient, white ≈12 % at the corners) |
| `crumpled` | editorial | `#B3ACA0`, static σ 2.3 levels, ≈1 px detail, a crease network, a few stains | crease-normal noise multiplied over flat colour; never animated |

**Paper never animates**, with two exceptions:
- The editorial **exposure pulse**: the paper layer only brightens +1.1 % at the centre and +2.1 % at the corners every 0.3 s (every 7 f at 24 fps); the ink is unchanged.
- The paper-desk **hold boil** (below).

## 2. Frame finish (global, applied once to the composite)

| Parameter | Paper desk | Dark collage | Vox explainer | Vox editorial |
|---|---|---|---|---|
| **Colour fringing** | **uniform diagonal RGB split**, constant over time, the same in the centre and the corners: R down-right, B up-left. Effective centroid shift **≈1–2 px** (measured from R +0.75/B −0.4 up to R +2/B −1.7; desk-flyover stills up to ±4 px). Some shots read it as soft ≈4.5 px ghosts at ≈25 %. It turns thin black lines plum/magenta. The original applies it per layer (not to blueprints or maps) | none | **radial lens CA**: R scaled ×1.0021, B ×0.9958 about the centre (R +2.1 px, B −3.6 px at the corners); invisible in the centre | none |
| **Grain** | **none animated**: held frames are bit-identical. Only static paper specks and the texture (σ ≈1.4) | **static** monochrome σ ≈3.4 levels, ≈1–2 px, riding the weave (correlation 0.87–0.97 after alignment) | monochrome σ ≈2.7 levels, ≈1–1.5 px, **re-seeded every drawing** (frozen within the pair) | none (static paper only) |
| **Grain order** | — | under the type (title interior σ 2.6) | after CA | — |
| **Whole-frame jitter** | **6 fps "boil"**: the artwork group (paper grid, drawings, discs, labels; not captions or vignette) shifts 0.4–1.1 px every other drawing | **film weave**: σ 1.3 px, clamp 3 px, every frame (white noise, lag-1 ≈0) | none (0.1 px) | none |
| **Vignette** (L × (1 − a·r^p)) | a 0.18, p 1.8, circular, tinted toward `#5A4636` (corners at 0.82 of the centre); **heavy** shots a 0.32 (0.68) | none (the plate's worn edges are lighter instead) | a 0.04, p 2.2 (barely) | a 0.15, p 1.4, circular |
| **Levels** (the measured output range. Colour tokens are already final and inside it, so this is *not* a global pass; grade imagery with `PHOTO_GRADE`) | graphics darkest ≈`#181812`, paper peak `#FDF8F0`; footage keeps true black | black `#0C0B09`, white `#DEDAD4` | black `#272622`, white `#E9E7E7` | black `#3F3930`, white `#C6C3B5` |
| **Dust/scratches** | — | bright specks (≤0.45 % px) + 1–4 thin vertical scratches drifting ≈3.7 px/f; **12-drawing loop on twos** | — | — |
| **Flicker** | none | none (≤0.5 %) | none | 1-in-3 paper exposure pulse |

### Code recipes
- **Uniform RGB split** (SVG filter on the scene wrapper): isolate channels with `feColorMatrix`, `feOffset` R by (dx,dy) and B by (−dx,−dy), recombine additively (`feComposite operator="arithmetic" k2=1 k3=1`).
- **Radial lens CA**: scale the R and B channels about the centre. Either use `feDisplacementMap` driven by a linear-gradient displacement image (displacement ∝ distance from the centre is exactly a scale), or use three channel-isolated copies with `transform: scale(1.0021)` / `scale(0.9958)` composited with `mix-blend-mode: screen` over black.
- **Grain**: pre-generated tileable monochrome noise tiles (`grain_*.png`). Pick the tile and a random offset by seed = ⌊t·rate⌋, then blend overlay/soft-light. Calibrate the opacity so the measured σ is reached on the style's paper luminance (overlay is weaker on light paper).
- **Film weave**: translate the whole composite by a seeded Gaussian (Box–Muller) every frame, clamped, and scale by 1.006 so edges never show. Static grain goes *inside* the weave wrapper.
- **Levels**: `feComponentTransfer` linear per channel: slope = (white − black), intercept = black. Use it only on raw footage or photos (`<Levels>`). The style's tokens are final colours, and the presets apply no global levels.
- **Vignette**: a multiply radial gradient with many stops sampling 1 − a·r^p, where r = distance / half-diagonal.

## 3. Objects & materials

| Material | Spec @1080p | Recipe |
|---|---|---|
| **Desk photo print** (paper desk) | border **4.7 % of the width** (≈21 px), `#F5EFEB`, equal on all 4 sides; shadow **offset (10, 8), blur ≈13 px, opacity 0.43**, light from top-left | padding + `filter: drop-shadow(10px 8px 13px rgba(0,0,0,.43))` |
| **Card stack** (paper desk) | ambient contact shadow, exponential: 75 % at the edge, half-decay 37 px, gone by ≈90 px | large blurred drop-shadow at 0 offset |
| **Rounded photo card** (paper desk) | radius 8–9 px (prints), 24–38 px (video panels, carousel cards); **yellow offset rim** right/bottom: (+9, +12) px hard on cards, or soft `drop-shadow(+2…+6px +4…+5px 6px rgba(242,229,0,.6))` with ≈3 px spread on prints and panels. It replaces the dark shadow | a duplicate silhouette behind, offset, or a yellow drop-shadow |
| **Yellow silhouette echo** (paper desk cut-out figure) | the figure duplicated in `#E3DA02`, offset ≈(+21, 0) px, hard; it may lag the figure by 3–5 f and settle hidden behind it | duplicate alpha → flood yellow → translate |
| **Yellow halo** (paper desk cut-out on graph paper, e.g. a TV) | symmetric 25 px glow, `#F2E500` at 45 % at the edge, falling linearly to 0 | outer glow |
| **Callout disc** (paper desk) | `#E4D700` disc, multiply, Ø 360–560, behind the line drawing / over the photo | `mix-blend-mode: multiply` circle |
| **Deckled date card + stack** (paper desk) | cream `#EEDBBD` card with a 4–6 px sine-noise deckle edge over a stack of prints (±3–6°); stack shadow (−12, +22, 33 px, 0.6) | SVG mask + drop-shadow |
| **Polaroid card on black** (paper desk) | border L 17 / T 18 / **B 41 px**, `#EFE7D2` | uneven padding |
| **Vox print** | border ≈5 % of the width with the top +20 % (e.g. 40/33/29 px), `#E1DDDB`, deckled ±1–2 px, thin darker rim; contact shadow (3, 4, 6 px, 0.45); a lifted print (4, 10, 14 px, 0.55) | rounded rect + `feTurbulence`/`feDisplacementMap` (scale 2) on the outer edge |
| **Vox world shadow** | big soft shadow in a corner, core −45…−55 %, penumbra ≈290 px, attached to the world (moves with the camera) | Gaussian-blurred polygon (σ 120–150 px), black multiply 50 %, inside the camera group |
| **Opaque tape** (paper desk) | `#F9EC00`, **opaque**, 186×63 px (42 % of the photo width, 3:1); long edges straight, short ends straight or **torn zig-zag**; faint own shadow | flat rect + zig-zag `clip-path` |
| **Lime tape** (Vox) | `#DDD031` matte, opaque, straight cut ends, slight curl at one end; black variant `#221F21` | flat rect + darker curl gradient |
| **Masking tape** (Vox) | translucent beige-grey ≈`#ADA9A6` ≈50 %, crinkled, torn ends | multiply 60 % + noise |
| **Clear tape** (collage still) | ≈96 px tall, wrinkled specular streaks, 20–30 % white | screen-blended streak texture |
| **Sticky note** (Vox) | `#F3DA44` 180×140; folded back face `#A5931F` (−35 % luma, more saturated); small soft shadow | flat rect + fold geometry (06) |
| **Stamp/label slip** (paper desk) | ≈290×190, `#E5E0DC`; **scalloped** sides, pitch 22 px, bite depth 7 px; bottom/right shadow | SVG path with semicircle bites |
| **Flag label** (Vox) | `#DFD02C` 259×76, slanted end cut | SVG polygon |
| **Dark collage cut-out** | **hard scissor edge** (10→90 % in 3–5 px including compression); **no stroke, no feather, no soft shadow** | PNG alpha, nothing else |
| **Flat offset echo** (collage) | crimson `#8A0315` at (−32, −25), 100 %, 0 blur; cream page disc at (+40, +35) | `filter: drop-shadow(-32px -25px 0 #8A0315)` |
| **Floor ellipse** (collage) | flat hard-edged ellipse `#6F6461`, h ≈0.12 w | SVG ellipse |
| **Sticker outline** (collage pins) | 4–6 px white | stacked 0-blur drop-shadows or a stroked path |
| **Torn paper patch** (collage) | cream `#D0CABF`, rough torn contour, blue-grey watercolour stains, red echo edge (−25, −20) | seeded noisy polygon `clip-path` |
| **Damask carpet** (collage) | wine `#462528`, motifs 50–100 px, repeat ≈200–270 px, perspective-skewed | tiled pattern + `rotateX(≈60°)` |
| **Neon glow** (paper desk) | core `#ECF103`, the halo halving every ≈8 px, visible over ≈45 px | stacked `drop-shadow(0 0 8px)` + `drop-shadow(0 0 30px)` in yellow |
| **Dry-brush stroke** (paper desk, editorial) | bristle edges, streaky; height 156–216 px (paper desk) / 1.6–1.8× cap (editorial) | brush-mask PNG or SVG turbulence mask, revealed by a wipe |
| **Highlighter** (Vox) | pigment `#FFF80F` multiply, band 1.3× cap, overhang 8–12 px, ragged ends | rect + rough-edge displacement, `mix-blend-mode: multiply` |
| **Pencil / graphite** (Vox) | `#5F5C62`, 3–4 px, 3–4 loose loops ≈10 px apart; arrows as double lines | 3–4 jittered copies of the path (±1–3 % radius) |
| **Crop marks** (paper desk) | ≈488 px lines, 3 px, `#76716B` | SVG lines |

## 4. Photo treatments

| Style | Treatment | CSS |
|---|---|---|
| paper desk | B/W archival **warm-tinted** (R−B ≈ +10); colour photos slightly desaturated and warm; footage crushed and slightly warm | `grayscale(1) sepia(.18) contrast(1.05)` / `saturate(.85) sepia(.08)` |
| dark collage | **fully desaturated**, contrast up, blacks ≈ L 12–24, whites ≤ L 216; faces a hint warm | `grayscale(1) contrast(1.25) brightness(.95)` |
| Vox explainer | natural colour, no treatment (saturation 0.19–0.25) | none |
| Vox editorial | B/W multiplied onto the paper, sepia-tinted (R−B +14) | `grayscale(1) sepia(.15)` + `mix-blend-mode: multiply` |

**Engravings** on light paper need no cut-out: `mix-blend-mode: multiply`. On dark grounds, key them (ink key) or use a silhouette cut that keeps the engraving's own paper (09).
