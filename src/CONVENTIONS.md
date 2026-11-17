# Code conventions — Vox-style Remotion kit

Read this before writing any component. The style guide lives in `docs/style-guide/` (being written);
the measured evidence lives in `analysis/*.md` (one report per reference video).

## Stack
Remotion 4.0.539 (all `@remotion/*` packages pinned to that exact version — never add one at another
version), React 19, TypeScript strict. Installed: `remotion`, `@remotion/cli`, `@remotion/google-fonts`,
`@remotion/noise`, `@remotion/paths`, `@remotion/shapes`, `@remotion/transitions`, `@remotion/layout-utils`.
Do not add dependencies without saying so in your handoff.

## Folder ownership
| Folder | Owns |
|---|---|
| `src/lib/` | stage scaling, drawing-rate clock, seeded random (shared, read-only for component authors) |
| `src/tokens/` | colours, easing curves, durations, fonts, type roles, finish presets, themes (read-only) |
| `src/effects/` | finish & materials: paper, grain, chromatic aberration, weave, vignette, dust, levels |
| `src/collage/` | physical objects: cut-outs, photo prints, tape, sticky notes, slips, flags, clips, pins |
| `src/motion/`, `src/transitions/` | camera, entrances/exits, puppetry, shot head/tail transitions |
| `src/type/` | text treatments: highlight box, highlighter, title rise, typewriter, captions, boil |
| `src/explainer/` | annotations & data: draw-on strokes, rings, arrows, insets, charts, map routes |
| `src/gallery/<X>Gallery.tsx` | each area's visual test bench (registered in `src/Root.tsx`) |
| `src/proof/` | proof shots that recreate reference moments |

`src/Root.tsx`, `src/lib/*`, `src/tokens/*` are edited only by the lead. If you need a token or lib
change, put a local constant in your file and list the proposed change in your handoff.

## Rules
1. **Design space.** Author everything in 1920×1080 "design px" inside `<DesignSpace>` (`src/lib/stage.tsx`).
   Never read `width/height` to size content; 4K is handled by the stage. Code that must work at native
   output resolution (grain, weave, vignette) lives outside `DesignSpace` and multiplies by `useStage().u`.
2. **Drawing rate.** Graphics animate at 12 drawings/s. Drive every interpolation with
   `useDrawingFrame()` from `src/lib/time.tsx` (posterized, sequence-relative), never raw
   `useCurrentFrame()` — except things measured "on ones": live footage, caption opacity fades,
   film weave/jitter, final fade to black. Use `<OnOnes>` / `useCurrentFrame()` for those and say so in a comment.
3. **Determinism.** Never `Math.random()`. Use `rand/randRange/jitter/pick` from `src/lib/random.ts`
   (Remotion `random(seed)`), seeded by a stable string + drawing index.
4. **Tokens first.** Colours from `src/tokens/colors.ts` (via `useTheme().colors` when style-dependent),
   curves via `ease("enter")` from `src/tokens/easing.ts`, durations from `DUR` (seconds → frames with
   `Math.round(DUR.x * fps)`), type via `typeStyle(role)` from `src/tokens/type.ts`. A literal number is
   fine when it is a measured value specific to your component — cite the source in a comment
   (e.g. `// 24 px start bar, analysis/porsche-part3-stills.md §7 M1`).
5. **Timing props.** Times are in frames at the composition fps, relative to the enclosing `<Sequence>`:
   `delay` (start), `duration` (length). Default durations come from `DUR`. Components animate
   themselves from their own `delay`; they never require a parent to pass progress.
6. **No overshoot by default.** The house style's entrances are exponential ease-outs; exits are ease-in.
   Only use overshoot where a report measured it (inset pop +1.6 %, triptych card pop).
7. **Physical, not digital.** No opacity fades for entrances (Vox: things peel, unfurl, draw, drop,
   rise from a mask); no soft UI shadows on collage cut-outs; ink is never pure black, paper never pure white.
8. **Props API.** Every component: typed props with JSDoc, sensible defaults from the theme, a `style`
   escape hatch where useful, and an `index.ts` barrel export per folder.
9. **Performance.** SVG filters re-run every frame. Keep filtered layers at display size; prefer
   pre-generated textures in `public/textures/` (generator: `tools/textures/generate_textures.py`)
   and CSS patterns over per-frame canvas noise at 4K. Use `<Img>` / `staticFile()` for images.
10. **Verify visually.** Typecheck (`npx tsc --noEmit`), then render stills from your gallery with
    `npx remotion still src/index.ts <GalleryId> out/<area>/<name>.png --frame=<n> --concurrency=2`
    and look at them (Read tool). For motion, render several frames across the move.
    Other agents render at the same time: always pass `--concurrency=2` (or less).

## Assets
- CC0 / public-domain images: `public/assets/cc0/**` (credits in `CREDITS.md` there).
- Cut-outs (PNG with alpha) go in `public/assets/cutouts/` with a line in `public/assets/cutouts/SOURCES.md`.
- Procedural textures: `public/textures/` (`paper_*.jpg`, `grain_*.png`, `dust_*.png`).

## Handoff
End with: files created, components + props summary, what you verified (which stills you looked at),
known gaps, and proposed token/lib changes.
