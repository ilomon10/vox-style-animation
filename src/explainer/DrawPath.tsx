import React from "react";
import { interpolate } from "remotion";
import { useDrawingFrame, useSec } from "../lib/time";
import { DUR } from "../tokens/motion";
import { ease } from "../tokens/easing";
import { type Pt, cumLengths, offsetPoints, pointsToD, roughen, sliceTo } from "./geometry";

export type EaseFn = (t: number) => number;

/** Full-canvas SVG layer in design px; children are drawn in absolute 1920×1080 coordinates. */
export const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; blend?: React.CSSProperties["mixBlendMode"] }> = ({
  children,
  style,
  blend,
}) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: blend, ...style }}
  >
    {children}
  </svg>
);

/** Eased progress 0..1 of a timed move on the posterized (12 drawings/s) clock. */
export const useProgress = (delay: number, duration: number, easing: EaseFn = ease("enter")): number => {
  const f = useDrawingFrame();
  return easing(interpolate(f, [delay, delay + Math.max(1, duration)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
};

/** Default draw-on duration in frames (DUR token → comp fps). */
export const useDur = (seconds: number) => useSec()(seconds);

/** One path revealed with pathLength=1 + strokeDashoffset (low-level, controlled progress). */
export const RevealPath: React.FC<{
  points: Pt[];
  p: number;
  color: string;
  width: number;
  opacity?: number;
  cap?: "round" | "butt";
}> = ({ points, p, color, width, opacity = 1, cap = "round" }) =>
  p <= 0 ? null : (
    <path
      d={pointsToD(points)}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap={cap}
      strokeLinejoin="round"
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.min(1, p)}
      opacity={opacity}
    />
  );

/**
 * Variable-width brush stroke: closed ribbon polygon around the first `p` of the polyline,
 * tapered over `taperStart` px at the start and `taperEnd` px behind the head (brush lift).
 */
export const RibbonPath: React.FC<{
  points: Pt[];
  p: number;
  color: string;
  width: number;
  taperStart?: number;
  taperEnd?: number;
  /** width fraction at the very tip */
  tip?: number;
  opacity?: number;
}> = ({ points, p, color, width, taperStart = 60, taperEnd = 110, tip = 0.3, opacity = 1 }) => {
  if (p <= 0) return null;
  const pts = sliceTo(points, p);
  if (pts.length < 2) return null;
  const c = cumLengths(pts);
  const L = c[c.length - 1];
  const left: Pt[] = [];
  const right: Pt[] = [];
  pts.forEach((pt, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l = Math.hypot(dx, dy) || 1;
    const sIn = Math.min(1, c[i] / taperStart);
    const sOut = Math.min(1, (L - c[i]) / taperEnd);
    const w = (width / 2) * (tip + (1 - tip) * Math.min(sIn, p >= 1 ? sOut : Math.max(sOut, 0.55 + 0.45 * sOut)));
    left.push({ x: pt.x - (dy / l) * w, y: pt.y + (dx / l) * w });
    right.push({ x: pt.x + (dy / l) * w, y: pt.y - (dx / l) * w });
  });
  const poly = [...left, ...right.reverse()];
  const d = pointsToD(poly) + "Z";
  const end = pts[pts.length - 1];
  return (
    <g opacity={opacity} fill={color}>
      <path d={d} />
      <circle cx={pts[0].x} cy={pts[0].y} r={(width / 2) * tip} />
      <circle cx={end.x} cy={end.y} r={(width / 2) * tip} />
    </g>
  );
};

export type DrawPathProps = {
  /** polylines in design px (use geometry helpers; `catmull` to smooth control points) */
  paths: Pt[][];
  color: string;
  /** stroke width in px */
  width?: number;
  /** start frame, relative to the enclosing Sequence */
  delay?: number;
  /** frames; default DUR.drawOn */
  duration?: number;
  easing?: EaseFn;
  /** hand tremor amplitude in px (seeded) */
  roughness?: number;
  /** parallel jittered strands (pencil = 2–3) */
  strands?: number;
  /** px spread between strands */
  strandSpread?: number;
  /** variable-width brush ribbon instead of constant stroke */
  taper?: { start?: number; end?: number; tip?: number } | boolean;
  opacity?: number;
  seed?: string;
  /** override progress (0..1) instead of the internal timeline */
  progress?: number;
};

/**
 * Draw-on primitive. Each path is revealed (pathLength=1 + strokeDashoffset, or a tapered
 * ribbon) along a token-eased timeline stepped at 12 drawings/s. Rough (seeded) and multi-strand.
 * Must sit inside a <Layer>.
 */
export const DrawPath: React.FC<DrawPathProps> = ({
  paths,
  color,
  width = 4,
  delay = 0,
  duration,
  easing,
  roughness = 0,
  strands = 1,
  strandSpread = 2.2,
  taper,
  opacity = 1,
  seed = "draw",
  progress,
}) => {
  const dur = useDur(DUR.drawOn);
  const p0 = useProgress(delay, duration ?? dur, easing);
  const p = progress ?? p0;
  const tp = taper === true ? {} : taper || undefined;
  return (
    <>
      {paths.map((pts, pi) =>
        Array.from({ length: strands }, (_, si) => {
          const s = `${seed}-${pi}-${si}`;
          let q = roughen(pts, roughness, s);
          if (strands > 1) q = offsetPoints(q, (si - (strands - 1) / 2) * strandSpread);
          return tp ? (
            <RibbonPath key={s} points={q} p={p} color={color} width={width} taperStart={tp.start} taperEnd={tp.end} tip={tp.tip} opacity={opacity} />
          ) : (
            <RevealPath key={s} points={q} p={p} color={color} width={width} opacity={opacity} />
          );
        }),
      )}
    </>
  );
};
