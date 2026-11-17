import React from "react";
import { Easing } from "remotion";
import { DESIGN_H, DESIGN_W } from "../../lib/stage";

/** drawings STARTED by a 10 dps move that begins at `start`: 0 before it, 1 on `start` itself (the first change is visible ON the event frame),
 *  then a new drawing at rel 2, 4, 7, 9, 12 … (2-2-3-2-3 holds, the reference whip-out pattern f164/166/168/171/173/176, earworm-A §7) */
export const kStep = (f: number, start: number, rate = 10) => (f < start ? 0 : Math.round(((f - start) * rate) / 25 + 1e-9) + 1);
/** stepped, eased progress 0..1 of a move of `dur` frames at 10 dps from `start` (last drawing reached = progress 1) */
export const stepE = (f: number, start: number, dur: number, curve: (t: number) => number = (t) => t, rate = 10) => {
  if (f < start) return 0;
  const n = Math.max(1, Math.round((dur * rate) / 25));
  return curve(Math.min(1, kStep(f, start, rate) / n));
};
/** drawing index of the photo move: 12 dps from a 24 fps master conformed to 25 fps. A 3-frame hold starts at f705, 730, 755, 780 (≡ 5 mod 25),
 *  every other drawing is 2 frames: starts at 5, 8, 10, 12 … 28 (mod 25), earworm-A §0 frame-rate note */
export const drawing12 = (f: number) => {
  const p = Math.floor((f - 5) / 25);
  const r = f - 5 - 25 * p;
  return p * 12 + (r < 3 ? 0 : 1 + Math.floor((r - 3) / 2));
};
export const bez = (x1: number, y1: number, x2: number, y2: number) => Easing.bezier(x1, y1, x2, y2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** world layer: scale about a design-px pivot then translate */
export const World: React.FC<{ scale?: number; pivot?: [number, number]; x?: number; y?: number; blur?: number; children: React.ReactNode }> = ({ scale = 1, pivot = [DESIGN_W / 2, DESIGN_H / 2], x = 0, y = 0, blur = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: DESIGN_W, height: DESIGN_H, transformOrigin: `${pivot[0]}px ${pivot[1]}px`, transform: `translate(${x}px, ${y}px) scale(${scale})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
    {children}
  </div>
);
