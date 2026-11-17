import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { useDrawingFrame, useFrames } from "../lib/time";
import { voxExplainer } from "../tokens/colors";
import { ease } from "../tokens/easing";

/** Scale of a data dot: .58 on the first drawing → .80 by +6 f → 1 by +18 f, expo-out (analysis/epigenetics.md §9). */
export const useDotPopScale = (delay = 0): number => {
  const f = useDrawingFrame();
  const fr = useFrames();
  const t = f - delay;
  if (t < 0) return 0;
  return interpolate(t, [0, fr(6), fr(18)], [0.58, 0.8, 1], { extrapolateRight: "clamp", easing: ease("dotPop") });
};

/** Wrap any element (HTML or SVG-in-HTML) so it pops in like a data dot. */
export const DotPop: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const s = useDotPopScale(delay);
  if (s === 0) return null;
  return <div style={{ transform: `scale(${s})`, transformOrigin: "50% 50%", ...style }}>{children}</div>;
};

export type DotItem = { x: number; y: number; color?: string; r?: number };

/** A list of dots that pop one after another (`stagger` frames apart). */
export const DotField: React.FC<{ dots: DotItem[]; delay?: number; stagger?: number; color?: string; r?: number }> = ({
  dots, delay = 0, stagger = 2, color = voxExplainer.red, r = 16,
}) => (
  <>
    {dots.map((d, i) => (
      <DotPop key={i} delay={delay + i * stagger} style={{ position: "absolute", left: d.x - (d.r ?? r), top: d.y - (d.r ?? r) }}>
        <div style={{ width: (d.r ?? r) * 2, height: (d.r ?? r) * 2, borderRadius: "50%", background: d.color ?? color }} />
      </DotPop>
    ))}
  </>
);

/**
 * Colour flash on a shape (gear "on/off"): `from` → `to` in 2 f, hold, back in 2 f
 * (analysis/epigenetics.md §9). Children is a render prop receiving the current fill.
 */
export const ColorFlash: React.FC<{
  delay?: number;
  /** frames of the held peak colour */
  hold?: number;
  from?: string;
  to?: string;
  children: (fill: string) => React.ReactNode;
}> = ({ delay = 0, hold = 12, from = voxExplainer.dot, to = voxExplainer.red, children }) => {
  const f = useDrawingFrame();
  const fr = useFrames();
  const a = fr(2);
  const t = interpolate(f - delay, [0, a, a + hold, a + hold + a], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <>{children(interpolateColors(t, [0, 1], [from, to]))}</>;
};
