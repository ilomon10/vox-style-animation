import React from "react";
import { rand } from "../../lib/random";
import { useDrawingFrame, useDrawingIndex } from "../../lib/time";

export type SparkBoilProps = {
  /** anchor (the trumpet bell), design px */
  x: number;
  y: number;
  /** frame the sparks start (sequence-relative) */
  at: number;
  /** 0..1 amplitude over the sequence frame (a hand-set envelope or a smoothed music level, lag 2–3 f) */
  level?: (f: number) => number;
  /** radiating zigzag strokes (3–5) */
  strokes?: number;
  /** length of the longest stroke, design px */
  length?: number;
  /** fan direction in degrees (0 = right, clockwise) */
  dir?: number;
  color?: string;
  seed?: string;
};

/**
 * Hand-drawn white spark marks that radiate from an anchor and are re-drawn every drawing (the drawing clock of the enclosing
 * <DrawingRate>, 2–3 f); brightness / length follow `level`. earworm-B §9 `SparkBoil`, §14.
 */
export const SparkBoil: React.FC<SparkBoilProps> = ({ x, y, at, level = () => 1, strokes = 4, length = 120, dir = -25, color = "#FFFFFF", seed = "spark" }) => {
  const f = useDrawingFrame();
  const di = useDrawingIndex();
  if (f < at) return null;
  const lv = level(f);
  if (lv <= 0.02) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 0.35 + 0.65 * lv }}>
      {Array.from({ length: strokes }, (_, k) => {
        const a = ((dir + (k - (strokes - 1) / 2) * 24 + (rand(`${seed}-a${di}-${k}`) - 0.5) * 16) * Math.PI) / 180;
        const L = length * (0.45 + 0.55 * rand(`${seed}-l${di}-${k}`)) * (0.5 + 0.5 * lv);
        const pts = Array.from({ length: 4 }, (_, i) => {
          const t = (0.1 + (i / 3) * 0.9) * L;
          const off = i % 2 ? 1 : -1;
          return `${x + Math.cos(a) * t - Math.sin(a) * off * 7 * rand(`${seed}-z${di}-${k}-${i}`)},${y + Math.sin(a) * t + Math.cos(a) * off * 7 * rand(`${seed}-z${di}-${k}-${i}`)}`;
        }).join(" ");
        return <polyline key={k} points={pts} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="miter" strokeLinecap="butt" />;
      })}
    </svg>
  );
};
