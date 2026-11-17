import React from "react";
import { voxExplainer } from "../tokens/colors";
import { DUR } from "../tokens/motion";
import { ease } from "../tokens/easing";
import { useFrames } from "../lib/time";
import { rand } from "../lib/random";
import { DrawPath, Layer, useDur, useProgress } from "./DrawPath";
import { LEADER_EASE } from "./strokes";
import { type Pt, wobblyLine } from "./geometry";
import { useDotPopScale } from "./DotPop";

/** Red/green methylation-style dot grid, pitch 55, dot Ø 32 (analysis/epigenetics.md §9). */
export const DotGrid: React.FC<{ size: number; pitch?: number; dot?: number; seed?: string; pRed?: number }> = ({
  size, pitch = 55, dot = 32, seed = "grid", pRed = 0.5,
}) => {
  const n = Math.ceil(size / pitch) + 1;
  const off = (size - (n - 1) * pitch) / 2;
  const els: React.ReactNode[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      els.push(
        <div key={`${r}-${c}`} style={{ position: "absolute", left: off + c * pitch - dot / 2, top: off + r * pitch - dot / 2, width: dot, height: dot, borderRadius: "50%",
          background: rand(`${seed}-${r}-${c}`) < pRed ? voxExplainer.red : voxExplainer.green }} />,
      );
  return <>{els}</>;
};

export type InsetMagnifierProps = {
  /** pin dot position on the thing being magnified */
  pin: Pt;
  /** circle centre and diameter (320–460) */
  circle: Pt;
  diameter?: number;
  /** "L" = pin → one right-angle leader → circle; "cone" = two tangent lines */
  connector?: "L" | "cone";
  delay?: number;
  /** content inside the circle (defaults to a red/green dot grid); sized diameter × diameter */
  children?: React.ReactNode;
  ringColor?: string;
  ringWidth?: number;
  lineColor?: string;
  /** circle fill behind children */
  fill?: string;
  seed?: string;
};

/**
 * Pin dot (r 12) → leader (16 f) → inset circle that pops (ease `pop`, 16 f, starts 6 f before the
 * line finishes), ring 4 px (analysis/epigenetics.md §9, cs_leader_inset.png).
 */
export const InsetMagnifier: React.FC<InsetMagnifierProps> = ({
  pin, circle, diameter = 380, connector = "L", delay = 0, children, ringColor = voxExplainer.graphite, ringWidth = 4,
  lineColor = voxExplainer.graphite, fill = voxExplainer.paperHi, seed = "inset",
}) => {
  const fr = useFrames();
  const lineDur = useDur(DUR.leaderLine);
  const popDur = useDur(DUR.insetPop);
  const lineStart = delay + fr(2);
  const lp = useProgress(lineStart, lineDur, (t) => Math.max(0, LEADER_EASE(t)));
  const popStart = lineStart + lineDur - fr(6);
  const sc = useProgress(popStart, popDur, ease("pop"));
  const pinScale = useDotPopScale(delay);
  const r = diameter / 2;

  const lines: Pt[][] = [];
  if (connector === "L") {
    // vertical from the pin to the circle's row, then horizontal to the circle edge
    const dir = circle.x > pin.x ? -1 : 1;
    lines.push([pin, { x: pin.x, y: circle.y }, { x: circle.x + dir * r, y: circle.y }]);
  } else {
    const dx = pin.x - circle.x;
    const dy = pin.y - circle.y;
    const d = Math.hypot(dx, dy);
    const phi = Math.atan2(dy, dx);
    const a = Math.acos(Math.min(1, r / d));
    for (const s of [1, -1]) lines.push(wobblyLine(pin, { x: circle.x + r * Math.cos(phi + s * a), y: circle.y + r * Math.sin(phi + s * a) }, `${seed}${s}`, 0.8, 0));
  }
  return (
    <>
      <Layer>
        <DrawPath paths={lines} color={lineColor} width={4} progress={lp} seed={seed} />
        {pinScale > 0 && <circle cx={pin.x} cy={pin.y} r={12 * pinScale} fill={voxExplainer.red} />}
      </Layer>
      {sc > 0 && (
        <div style={{ position: "absolute", left: circle.x - r, top: circle.y - r, width: diameter, height: diameter, transform: `scale(${sc})`, transformOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: fill }}>
            {children ?? <DotGrid size={diameter} seed={seed} />}
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `inset 0 0 0 ${ringWidth}px ${ringColor}` }} />
        </div>
      )}
    </>
  );
};
