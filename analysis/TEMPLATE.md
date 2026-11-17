# <Report title> — <video id / time range>

> Analyst: <A–G>. Sources reviewed: <sheets x–y, N strips, stills ...>. All pixel values are given at the source resolution AND normalised to a 1920×1080 canvas ("@1080p"). Time is given in seconds and frames at the source fps.

## 1. Summary of the look (5–10 bullets)
The non-negotiable traits a viewer would recognise.

## 2. Shot log
One row per shot (use the shot numbers from `metrics/<id>_shots.md`; merge trivially similar consecutive shots and say so).
| Shot | t0–t1 | Content / composition | Layers (back→front) | Motion (what moves, how, how long) | In / out transition |

## 3. Color
- Palette tokens with hex, role (background / paper / ink / accent / highlight / shadow), share of frame.
- Grade: black level (lifted? to what hex), white level, warm/cool cast, saturation treatment of photos (mono, tinted, duotone?), colour fringing/chromatic aberration.

## 4. Typography
Per text style: role (title / date / label / quote / caption / annotation), case, approx. cap height @1080p, weight, serif/sans/mono/handwritten, tracking, colour, background treatment (highlighter box, tape, stamp, paper slip), effects (typewriter on, wipe, scale pop), closest commercial match AND best free/Google-Fonts match.

## 5. Layout & composition
Framing grid, margins, where focal content sits, scale of photos/cut-outs relative to frame, rotation ranges of scattered objects (degrees), overlap/stacking rules, depth layers and depth of field.

## 6. Textures & materials
Paper (colour, fibre/speckle size, grain), film grain (static or animated, size, intensity), dust/scratches, vignette, torn/cut edges (white border width px @1080p, roughness), tape (colour, opacity, size, edge), shadows (offset, blur, opacity, colour — measure them), halftone, print misregistration, light leaks, frame flicker. Say how each would be generated procedurally.

## 7. Motion language
For each recurring motion type: what moves, duration (frames + seconds), easing (describe velocity profile and give an estimated cubic-bezier), overshoot/bounce, stepping (on ones/twos/threes — check the strips), wiggle/boil, camera moves (pan/push/rotate, speed in px/s @1080p, parallax between layers), holds between beats. Cite frame numbers as evidence.

## 8. Transitions
Catalogue each transition type: frame-by-frame description (f N: …, f N+1: …), total length in frames, what triggers it, how to build it in code.

## 9. Reusable components
List the building blocks (e.g. `TapedPhoto`, `HighlightedYear`, `StampLabel`, `CutOutFigure`, `PaperSlip`, `MapPin`, `FlashFrame`), each with props and default values derived from the measurements above.

## 10. Build notes for code (Remotion/React)
Concrete implementation hints: layer structure, SVG/CSS filters, canvas/WebGL noise, how to get the stepping, how to fake the camera, anything hard to replicate and a strategy for it.

## 11. Evidence index
Sheets/strips/crops you made or relied on, with one-line notes (paths under `analysis/`).
