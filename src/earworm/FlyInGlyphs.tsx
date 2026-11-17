import React from "react";
import { interpolate } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { ease } from "../tokens/easing";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";

export type GlyphFly = {
  /** frame (sequence-relative) the glyph first shows, at its entry point */
  start: number;
  /** entry offset from the staging pose, design px */
  from: { x: number; y: number };
  /** staging pose (offset from home, design px) reached at `stageAt`; the glyph then converges home */
  stage: { x: number; y: number };
};

export type FlyInGlyphsProps = {
  text: string;
  /** one entry per glyph */
  fly: GlyphFly[];
  /** left edge of each glyph at home, design px */
  left: number[];
  /** top of the cap box at home, design px */
  top: number;
  /** frame every glyph has reached its staging pose (scale ≈1.15) */
  stageAt: number;
  /** frame every glyph is home (scale 1) */
  homeAt: number;
  /** scale at the entry point (≈1.75, earworm-A §7) */
  startScale?: number;
  stageScale?: number;
  role?: TypeRole;
  /** render only these glyph indices (to interleave groups with collage layers) */
  indices?: number[];
  /** extra per-glyph offset after the fly-in (split, rise, sink), design px */
  offset?: (i: number) => { x: number; y: number };
};

/**
 * Digits that fly in from the frame edges and converge into one number (analysis/earworm-A.md §7 "Digit z-fly-in": entries from
 * the 4 edges staggered 2–4 f, scale ≈1.75 → 1.15 → 1.0, converge f16–33). Two phases: entry → staging (expo-out), staging → home
 * (ease-in-out). Steps on the drawing clock; the first drawing shows the first pose (no empty drawing at `start`).
 */
export const FlyInGlyphs: React.FC<FlyInGlyphsProps> = ({
  text, fly, left, top, stageAt, homeAt, startScale = 1.75, stageScale = 1.15, role = earwormType.digits, indices, offset,
}) => {
  const g = useDrawingFrame() + 2.5; // one drawing ahead: the first drawing already shows the glyph
  const chars = Array.from(text);
  return (
    <>
      {chars.map((ch, i) => {
        if (indices && !indices.includes(i)) return null;
        const f = fly[i];
        if (g < f.start + 1.25) return null; // drawings fall on a 2.5 f lattice: show the glyph on the drawing nearest its start
        const p1 = interpolate(g - 2.5, [f.start, stageAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const p2 = interpolate(g - 2.5, [stageAt, homeAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const e1 = ease("enter")(p1);
        const e2 = ease("pushSoft")(p2);
        const x = (f.from.x + (f.stage.x - f.from.x) * e1) * (1 - e2);
        const y = (f.from.y + (f.stage.y - f.from.y) * e1) * (1 - e2);
        const s = (startScale + (stageScale - startScale) * e1) * (1 - e2) + e2;
        const o = offset ? offset(i) : { x: 0, y: 0 };
        return (
          <div
            key={i}
            style={{ position: "absolute", left: left[i] + x + o.x, top: top + y + o.y, transform: `scale(${s})`, transformOrigin: "50% 50%", whiteSpace: "pre", ...capTrim, ...typeStyle({ ...role, leading: 1 }) }}
          >
            {ch}
          </div>
        );
      })}
    </>
  );
};
