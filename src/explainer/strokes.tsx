import React from "react";
import { Easing } from "remotion";
import { voxExplainer } from "../tokens/colors";
import { DUR } from "../tokens/motion";
import { ease } from "../tokens/easing";
import { DrawPath, Layer, useDur, useProgress } from "./DrawPath";
import { type Pt, catmull, pointAt, wobblyLine } from "./geometry";
import { useFrames } from "../lib/time";

type Timed = { delay?: number; duration?: number; seed?: string; color?: string };

/**
 * Felt-tip underline, ≈5 px, 8 f, with a short second stroke back along the right end
 * (analysis/epigenetics.md §7).
 */
export const MarkerUnderline: React.FC<Timed & { x1: number; x2: number; y: number; width?: number }> = ({
  x1, x2, y, delay = 0, duration, seed = "ul", color = voxExplainer.marker, width = 5,
}) => {
  const d = useDur(DUR.drawOn);
  const main = wobblyLine({ x: x1, y }, { x: x2, y: y + 2 }, `${seed}-a`, 2.5, 0.004);
  const back = wobblyLine({ x: x2 - 4, y: y + 7 }, { x: x2 - (x2 - x1) * 0.22, y: y + 6 }, `${seed}-b`, 1.5, 0.004);
  const dur = duration ?? d;
  return (
    <Layer>
      <DrawPath paths={[main]} color={color} width={width} delay={delay} duration={Math.round(dur * 0.75)} easing={ease("enter")} roughness={1} seed={seed} taper={{ start: 20, end: 30, tip: 0.55 }} />
      <DrawPath paths={[back]} color={color} width={width * 0.85} delay={delay + Math.round(dur * 0.55)} duration={Math.max(2, Math.round(dur * 0.45))} easing={ease("enter")} seed={`${seed}b`} />
    </Layer>
  );
};

/**
 * Pencil sketch arrow: two slightly different strands along a curve, then an open V head
 * (two short strokes). 8 f total.
 */
export const SketchArrow: React.FC<Timed & { from: Pt; to: Pt; bend?: number; width?: number; headSize?: number }> = ({
  from, to, bend = 0.12, delay = 0, duration, seed = "arrow", color = voxExplainer.graphite, width = 3.5, headSize = 34,
}) => {
  const d = useDur(DUR.drawOn);
  const dur = duration ?? d;
  const mid = { x: (from.x + to.x) / 2 - (to.y - from.y) * bend, y: (from.y + to.y) / 2 + (to.x - from.x) * bend };
  const curve = catmull([from, mid, to], 14);
  const end = pointAt(curve, 1);
  const ang = end.angle;
  const wing = (s: number): Pt[] => {
    const a = ang + Math.PI + s * 0.5;
    return [end, { x: end.x + Math.cos(a) * headSize, y: end.y + Math.sin(a) * headSize }];
  };
  const bodyDur = Math.max(2, Math.round(dur * 0.7));
  return (
    <Layer>
      <DrawPath paths={[curve]} color={color} width={width} delay={delay} duration={bodyDur} easing={ease("linear")} strands={2} strandSpread={2.4} roughness={1.2} opacity={0.9} seed={seed} />
      <DrawPath paths={[wing(1), wing(-1)]} color={color} width={width} delay={delay + bodyDur} duration={Math.max(2, dur - bodyDur)} easing={ease("linear")} roughness={0.5} seed={`${seed}h`} />
    </Layer>
  );
};

/** Marker X cross-out: two strokes, 4 f each, width 8 (analysis/epigenetics.md §7). */
export const CrossOut: React.FC<Timed & { x: number; y: number; w: number; h: number; width?: number }> = ({
  x, y, w, h, delay = 0, duration, seed = "x", color = voxExplainer.marker, width = 8,
}) => {
  const f = useFrames();
  const each = duration ? Math.round(duration / 2) : f(4);
  const s1 = wobblyLine({ x, y }, { x: x + w, y: y + h }, `${seed}1`, 3, 0.02);
  const s2 = wobblyLine({ x: x + w, y }, { x, y: y + h }, `${seed}2`, 3, 0.02);
  return (
    <Layer>
      <DrawPath paths={[s1]} color={color} width={width} delay={delay} duration={each} easing={ease("linear")} taper={{ start: 14, end: 24, tip: 0.5 }} seed={`${seed}1`} />
      <DrawPath paths={[s2]} color={color} width={width} delay={delay + each} duration={each} easing={ease("linear")} taper={{ start: 14, end: 24, tip: 0.5 }} seed={`${seed}2`} />
    </Layer>
  );
};

/** Leader-line easing, fitted to analysis/epigenetics.md §9 (slight pull-back at start, long settle). */
export const LEADER_EASE = Easing.bezier(0.15, -0.2, 0.15, 0.8);

/**
 * Thin leader line along a polyline (straight: 2 points; L-shaped: 3). Eased with LEADER_EASE, 16 f.
 * Use `progress` from outside to chain with an inset.
 */
export const LeaderLine: React.FC<Timed & { points: Pt[]; width?: number; progress?: number }> = ({
  points, delay = 0, duration, seed = "leader", color = voxExplainer.graphite, width = 4, progress,
}) => {
  const d = useDur(DUR.leaderLine);
  const p = useProgress(delay, duration ?? d, (t) => Math.max(0, LEADER_EASE(t)));
  return (
    <Layer>
      <DrawPath paths={[points]} color={color} width={width} progress={progress ?? p} seed={seed} />
    </Layer>
  );
};
