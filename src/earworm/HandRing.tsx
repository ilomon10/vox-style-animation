import React from "react";
import { Layer, RevealPath } from "../explainer/DrawPath";
import { ellipseLoop } from "../explainer/geometry";
import { useDrawingFrame } from "../lib/time";
import { ease } from "../tokens/easing";

export type HandRingProps = {
  /** centre and radii of the ringed word, design px */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** frame the stroke starts (sequence-relative) */
  delay?: number;
  /** draw-on length in frames (6–8, earworm-B §7) */
  duration?: number;
  /** turns, > 1 closes with an overlap (1.08 measured: ≈ 1/8 perimeter per frame) */
  turns?: number;
  /** 0 = right, 90 = bottom: starts bottom-left (135°) and runs clockwise */
  startDeg?: number;
  tiltDeg?: number;
  color?: string;
  width?: number;
  seed?: string;
};

/** White hand-drawn ring (#CDD3D7, 4 px) drawn clockwise from bottom-left with a short overlap, ease-out (earworm-B §7 "Ring draw-on"). */
export const HandRing: React.FC<HandRingProps> = ({ cx, cy, rx, ry, delay = 0, duration = 7, turns = 1.08, startDeg = 135, tiltDeg = -4, color = "#CDD3D7", width = 4, seed = "ring" }) => {
  const f = useDrawingFrame();
  const p = ease("exit")(Math.min(1, Math.max(0, (f - delay) / duration)));
  return (
    <Layer>
      <RevealPath points={ellipseLoop({ cx, cy, rx, ry, turns, startDeg, tiltDeg, jitterPct: 0.02, growth: 6, seed })} p={p} color={color} width={width} />
    </Layer>
  );
};
