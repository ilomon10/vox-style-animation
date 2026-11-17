import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Layer, RevealPath } from "../explainer/DrawPath";
import { wobblyLine, type Pt } from "../explainer/geometry";
import { SketchArrow } from "../explainer/strokes";
import { useDrawingFrame } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";

export type XMarkProps = {
  /** centre, design px */
  x: number;
  y: number;
  /** side of the square the X spans (X bullet ≈ cap height of its label; 131 px tall at ×1.67 push) */
  size?: number;
  /** frame the first stroke starts (sequence-relative) */
  delay?: number;
  /** total draw frames: 12 for the standalone X (earworm-A §7 "X draw-on"), 3 for the exit X (earworm-B §7) */
  duration?: number;
  color?: string;
  /** stroke width, design px (≈5) */
  strokeWidth?: number;
  seed?: string;
};

/**
 * Hand-drawn X bullet: two thin linear strokes drawn one after the other, periwinkle (analysis/earworm-A.md §7, §9 `XMark`
 * stroke 5, durF 12). Steps on the 12 drawings/s clock.
 */
export const XMark: React.FC<XMarkProps> = ({ x, y, size = 60, delay = 0, duration = 12, color = voxEarworm.accent, strokeWidth = 5, seed = "x" }) => {
  const f = useDrawingFrame();
  const h = size / 2;
  const p1 = interpolate(f, [delay, delay + duration * 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2 = interpolate(f, [delay + duration * 0.45, delay + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Layer>
      <RevealPath points={wobblyLine({ x: x - h, y: y - h }, { x: x + h, y: y + h * 1.04 }, `${seed}a`, size * 0.03, 0.01)} p={p1} color={color} width={strokeWidth} />
      <RevealPath points={wobblyLine({ x: x + h * 1.02, y: y - h * 0.96 }, { x: x - h * 0.98, y: y + h }, `${seed}b`, size * 0.03, 0.01)} p={p2} color={color} width={strokeWidth} />
    </Layer>
  );
};

export type AnnotationLabelProps = {
  /** one to three caps lines ("PARLIAMENT", "BAND", "LEADER") */
  lines: string[];
  /** left of the text / top of line 1, design px (the X bullet sits left of it) */
  x: number;
  y: number;
  delay?: number;
  /** frames per letter, 2 (1 letter / 1.9 f, earworm-B §7); lines type one after another */
  typeRate?: number;
  /** draw the X bullet left of line 1 */
  bullet?: boolean;
  /** hand-drawn arrow toward the subject; `from` defaults to just right of line 1's end */
  arrow?: { to: Pt; from?: Pt };
  /** frame the label dims and goes (8 f, on ones) */
  exitAt?: number;
  role?: TypeRole;
  seed?: string;
};

/**
 * Light condensed caps annotation, tracking +0.2 em, grey, with an X bullet and an optional periwinkle arrow
 * (analysis/earworm-B.md §4, §7, §9 `AnnotationLabel`). Reuses `SketchArrow`. Lines type on at 1 letter / 2 f.
 */
export const AnnotationLabel: React.FC<AnnotationLabelProps> = ({
  lines, x, y, delay = 0, typeRate = 2, bullet = true, arrow, exitAt, role = earwormType.annotation, seed = "an",
}) => {
  const f = useDrawingFrame();
  const raw = useCurrentFrame();
  const cap = role.cap;
  const pitch = cap * 1.75;
  const fade = exitAt === undefined ? 1 : 1 - interpolate(raw, [exitAt, exitAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (fade <= 0 || f < delay) return null;
  let start = delay;
  const starts = lines.map((l) => {
    const s = start;
    start += l.length * typeRate;
    return s;
  });
  const total = start;
  const end1 = x + lines[0].length * cap * 0.82;
  const live = exitAt === undefined || f < exitAt;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: fade }}>
        {lines.map((l, i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y + i * pitch, whiteSpace: "pre", ...capTrim, ...typeStyle({ ...role, leading: 1 }) }}>
            {Array.from(l).map((ch, k) => (
              <span key={k} style={{ visibility: f >= starts[i] + k * typeRate ? "visible" : "hidden" }}>{ch}</span>
            ))}
          </div>
        ))}
        {bullet && <XMark x={x - cap * 1.5} y={y + cap / 2} size={cap * 0.95} delay={delay} duration={6} strokeWidth={3.5} seed={`${seed}x`} />}
      </div>
      {arrow && live && (
        <div style={{ position: "absolute", inset: 0, opacity: fade }}>
          <SketchArrow from={arrow.from ?? { x: end1 + 30, y: y + cap / 2 }} to={arrow.to} delay={total} duration={6} color={voxEarworm.accent} width={4} seed={`${seed}ar`} />
        </div>
      )}
    </>
  );
};
