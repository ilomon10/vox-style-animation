import React from "react";
import { paperDesk } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { paperDeskType, typeStyle } from "../tokens/type";
import { useFrames } from "../lib/time";
import { DrawPath, Layer, useProgress } from "./DrawPath";
import { ellipseLoop, wobblyLine } from "./geometry";

/** Warm cream of the glowing year on the dark map (measured on analysis stills, stand-in for #F6E9B0). */
const CREAM = "#F3E8BE";

export type TimelineMarkerProps = {
  /** x of the node, y of the horizontal line */
  x: number;
  y: number;
  year: string;
  /** line extent (design px x) */
  from?: number;
  to?: number;
  delay?: number;
  color?: string;
};

/**
 * Paper-desk dark-map timeline device (analysis/porsche-part3-stills.md §9): glowing cream serif year
 * above a horizontal line that carries a ring node. Line draws, the node ring draws, the year rises
 * from a baseline mask (no fade).
 */
export const TimelineMarker: React.FC<TimelineMarkerProps> = ({ x, y, year, from = x - 420, to = x + 420, delay = 0, color = CREAM }) => {
  const fr = useFrames();
  const rise = useProgress(delay + fr(8), fr(12), ease("enter"));
  const line = wobblyLine({ x: from, y }, { x: to, y }, "tl", 1.5, 0.002);
  const node = ellipseLoop({ cx: x, cy: y, rx: 16, ry: 16, turns: 1.08, seed: "tlnode", jitterPct: 0.03 });
  const sty = typeStyle({ ...paperDeskType.neon, color });
  const h = (sty.fontSize as number) * 1.1;
  return (
    <>
      <Layer>
        <DrawPath paths={[line]} color={color} width={4} delay={delay} duration={fr(14)} easing={ease("enter")} seed="tl" />
        <DrawPath paths={[node]} color={color} width={5} delay={delay + fr(8)} duration={fr(6)} easing={ease("linear")} seed="tlnode" />
      </Layer>
      <div style={{ position: "absolute", left: x - 300, width: 600, top: y - 34 - h, height: h, overflow: "hidden", textAlign: "center" }}>
        <div style={{ ...sty, transform: `translateY(${(1 - rise) * 100}%)`, textShadow: `0 0 14px ${paperDesk.neon}99, 0 0 36px ${paperDesk.neon}55` }}>{year}</div>
      </div>
    </>
  );
};
