import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { hashSeed, rand } from "../lib/random";
import { useStage } from "../lib/stage";
import { tex, usePreload } from "../effects/shared";
import { voxEarworm } from "../tokens/colors";

export type WeaveOpts = {
  /** jump magnitude range per axis, design px (Δy ±4–5, Δx ±2 measured, earworm-A §6) */
  ampPx?: [number, number];
  /** frames between jumps, irregular in this range (4–6 f, earworm-A §6) */
  everyF?: [number, number];
  /** the ground never wanders further than this from its rest position (design px) */
  maxPx?: [number, number];
};

/**
 * Cumulative whole-pixel weave offset (design px) at `frame`: the ground jumps by ±2–5 px every 4–6 frames,
 * on its own schedule, independent of anything drawn above it (analysis/earworm-A.md §6).
 * Runs ON ONES by design. Pure function of (frame, seed).
 */
export const weaveOffset = (frame: number, seed: string, o: WeaveOpts = {}): [number, number] => {
  const [a0, a1] = o.ampPx ?? [2, 5];
  const [e0, e1] = o.everyF ?? [4, 6];
  const [mx, my] = o.maxPx ?? [3, 7];
  let t = 0;
  let x = 0;
  let y = 0;
  for (let i = 0; t <= frame && i < 20000; i++) {
    const dy = Math.round(a0 + rand(`${seed}-dy-${i}`) * (a1 - a0));
    const dx = Math.max(1, Math.round(a0 + rand(`${seed}-dx-${i}`) * (a1 - a0)) - 2); // Δx smaller: ±1–3
    const sy = rand(`${seed}-sy-${i}`) < 0.5 ? -1 : 1;
    const sx = rand(`${seed}-sx-${i}`) < 0.5 ? -1 : 1;
    // bounce back toward 0 instead of wandering off
    y += Math.abs(y + sy * dy) > my ? -sy * dy : sy * dy;
    x += Math.abs(x + sx * dx) > mx ? -sx * dx : sx * dx;
    t += Math.round(e0 + rand(`${seed}-t-${i}`) * (e1 - e0));
  }
  return [x, y];
};

export type BlackCollageGroundProps = {
  /** "black" (#0A0A0A construction paper + ghost newsprint, default) or "whitePaper" (#F6F6F6, fibre σ≈3–4) */
  variant?: "black" | "whitePaper";
  /** decorrelates the tile offset and the weave schedule between shots */
  seed?: string;
  /** the ground weaves by itself; default on for black, off for white paper (earworm-C §6: "paper texture static"). false = still */
  weave?: WeaveOpts | boolean;
  style?: React.CSSProperties;
};

/** one texture tile (3072 px) is shown at 1536 design px: 2 texture px per design px, sharp at 4K */
const TILE_DESIGN = 1536;

/**
 * Near-black overlapping construction-paper scraps with torn edges and faint ghost newsprint (luma 4–17,
 * earworm-A §6, earworm-B §6), procedural and tileable (tools/textures/earworm_textures.py).
 *
 * Place OUTSIDE <DesignSpace> and below it: the weave is whole OUTPUT pixels (design px × stage.u, rounded)
 * and must not move the foreground. Fills its parent.
 */
export const BlackCollageGround: React.FC<BlackCollageGroundProps> = ({ variant = "black", seed = "ground", weave, style }) => {
  const frame = useCurrentFrame();
  const { u } = useStage();
  const file = variant === "black" ? "earworm_ground_black.jpg" : "earworm_ground_white.jpg";
  usePreload([tex(file)]);
  const on = weave === undefined ? variant === "black" : weave !== false;
  const [wx, wy] = on ? weaveOffset(frame, seed, weave === true ? {} : weave || {}) : [0, 0];
  const ox = hashSeed(`${seed}-x`) % TILE_DESIGN;
  const oy = hashSeed(`${seed}-y`) % TILE_DESIGN;
  return (
    <AbsoluteFill
      style={{
        background: variant === "black" ? voxEarworm.ground : voxEarworm.whitePaper,
        backgroundImage: `url(${tex(file)})`,
        backgroundSize: `${TILE_DESIGN * u}px ${TILE_DESIGN * u}px`,
        backgroundPosition: `${Math.round((-ox + wx) * u)}px ${Math.round((-oy + wy) * u)}px`,
        ...style,
      }}
    />
  );
};
