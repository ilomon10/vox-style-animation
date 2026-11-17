import React from "react";
import { Easing } from "remotion";
import { rand } from "../lib/random";
import { voxExplainer, paperDesk } from "../tokens/colors";
import { DUR } from "../tokens/motion";
import { ease } from "../tokens/easing";
import { DrawPath, Layer, RevealPath, useDur, useProgress } from "./DrawPath";
import { type Pt, ellipseLoop, offsetPoints, roughen, sliceRange } from "./geometry";

type RingBase = {
  /** centre, design px */
  cx: number;
  cy: number;
  /** radii of the thing being ringed (the ring is drawn just outside) */
  rx: number;
  ry?: number;
  delay?: number;
  /** frames */
  duration?: number;
  seed?: string;
  tiltDeg?: number;
  startDeg?: number;
};

/**
 * Vox graphite pencil ring: 3–4 loose loops ≈10 px apart in one spiral stroke, ≈3.5 px, ±3 % radius
 * jitter, ≈8 f total, two slightly offset strands (analysis/epigenetics.md §5).
 */
export const PencilRing: React.FC<RingBase & { loops?: number; color?: string; width?: number }> = ({
  cx, cy, rx, ry = rx, delay = 0, duration, seed = "pencil", tiltDeg = -8, startDeg = -120, loops = 3.5,
  color = voxExplainer.graphite, width = 3.5,
}) => {
  const d = useDur(DUR.drawOn);
  const pts = ellipseLoop({ cx, cy, rx, ry, turns: loops, growth: 10, jitterPct: 0.03, tiltDeg, startDeg, seed });
  return (
    <Layer>
      <DrawPath paths={[pts]} color={color} width={width} delay={delay} duration={duration ?? d} easing={ease("linear")}
        strands={2} strandSpread={1.6} roughness={1.2} opacity={0.9} seed={seed} />
    </Layer>
  );
};

/** ≈ linear travel (≈22°/f) with a 5-of-16 ease-out tail (analysis/porsche-part3-stills.md §6 M5). */
const linearWithTail = (tail = 5 / 16) => {
  const v = 1 / (1 - tail / 2);
  return (t: number) => {
    if (t <= 1 - tail) return v * t;
    const s = (t - (1 - tail)) / tail;
    return v * (1 - tail) + v * tail * (s - (s * s) / 2);
  };
};

/**
 * Hand-drawn ring. `variant="maroon"`: paper-desk desk-pen ring, #7F1322, ≈7 px tapered stroke,
 * open end with ≈10° overshoot, 16 f. `variant="white"`: Vox hand-drawn white ring, 1.4 loops, outQuart.
 */
export const HandDrawnRing: React.FC<RingBase & { variant?: "maroon" | "white"; color?: string; width?: number; overshootDeg?: number }> = ({
  cx, cy, rx, ry = rx, delay = 0, duration, seed = "ring", tiltDeg = -6, startDeg, variant = "maroon", color, width, overshootDeg = 10,
}) => {
  const d = useDur(DUR.handRing);
  const maroon = variant === "maroon";
  const turns = maroon ? 1 + overshootDeg / 360 : 1.4;
  const pts = ellipseLoop({
    cx, cy, rx, ry, turns, growth: maroon ? 3 : 7, jitterPct: 0.025, tiltDeg, startDeg: startDeg ?? (maroon ? -70 : -100), seed,
  });
  const easing = maroon ? linearWithTail() : Easing.out(Easing.poly(4));
  const p = useProgress(delay, duration ?? d, easing);
  return (
    <Layer>
      <DrawPath paths={[pts]} progress={p} color={color ?? (maroon ? paperDesk.maroon : voxExplainer.handRing)}
        width={width ?? (maroon ? 7 : 8)} taper={{ start: 70, end: 140, tip: 0.3 }} roughness={1.5} seed={seed} />
    </Layer>
  );
};

/**
 * Dry-brush yellow marker ring/swoosh: many parallel streaks across a 25–60 px brush, ragged gaps,
 * open overlapping tail (analysis/epigenetics.md §7).
 */
export const MarkerRing: React.FC<RingBase & { width?: number; color?: string; turns?: number }> = ({
  cx, cy, rx, ry = rx, delay = 0, duration, seed = "marker", tiltDeg = -10, startDeg = -150, width = 40, color = voxExplainer.markerRing, turns = 1.18,
}) => {
  const dur = useDur(DUR.brushWipe);
  const p = useProgress(delay, duration ?? dur, ease("brush"));
  const base = ellipseLoop({ cx, cy, rx, ry, turns, growth: width * 0.6, jitterPct: 0.03, tiltDeg, startDeg, seed });
  const K = 8;
  const streaks: React.ReactNode[] = [];
  for (let k = 0; k < K; k++) {
    const off = ((k + 0.5) / K - 0.5) * width;
    const line = roughen(offsetPoints(base, off), 1.5, `${seed}-k${k}`);
    // ragged dry-brush gaps: each streak is a few pieces with seeded breaks
    const pieces: Array<[number, number]> = [];
    let a = 0;
    let i = 0;
    while (a < 1) {
      const len = 0.2 + 0.45 * rand(`${seed}-${k}-${i}`);
      const gap = k === 0 || k === K - 1 ? 0.03 + 0.04 * (i % 2) : 0.015 * (i % 3);
      pieces.push([a, Math.min(1, a + len)]);
      a += len + gap;
      i++;
    }
    pieces.forEach(([s, e], pi) => {
      const lp = Math.max(0, Math.min(1, (p - s) / (e - s || 1)));
      streaks.push(<RevealPath key={`${k}-${pi}`} points={sliceRange(line, s, e)} p={lp} color={color} width={(width / K) * 1.5} opacity={0.82 + 0.18 * ((k % 3) / 2)} />);
    });
  }
  return <Layer blend="multiply">{streaks}</Layer>;
};

export type { Pt };
