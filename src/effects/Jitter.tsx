import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useStage } from "../lib/stage";
import { drawingIndex } from "../lib/time";
import { gaussian } from "./shared";

export type JitterProps = {
  /** std-dev of the translation per axis, design px (dracula weave 1.3, paper-desk hold boil 0.55) */
  sigmaPx: number;
  /** hard clamp per axis, design px */
  clampPx: number;
  /** changes per second; "frame" = every frame (film gate weave, on ones) */
  rate: number | "frame";
  /** scale about the centre so the translated frame never shows its edge (1.006 ≈ 6 px at 1080p) */
  overscan: number;
  seed?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Whole-frame translation noise: Gaussian (Box–Muller from the seeded random), white (lag-1
 * autocorrelation ≈ 0, as measured on dracula). Runs ON ONES by design (film weave / hold boil is
 * a camera-gate trait, not part of the 12 drawings/s clock), so it uses the raw frame.
 * Everything inside moves together — put static grain inside to ride the weave.
 */
export const Jitter: React.FC<JitterProps> = ({ sigmaPx, clampPx, rate, overscan, seed = "weave", children, style }) => {
  const frame = useCurrentFrame();
  const { u, fps } = useStage();
  const i = rate === "frame" ? frame : drawingIndex(frame, fps, rate);
  const c = (s: string) => Math.max(-clampPx, Math.min(clampPx, gaussian(`${seed}-${s}-${i}`) * sigmaPx));
  const tx = c("x") * u;
  const ty = c("y") * u;
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${overscan})`, ...style }}>{children}</AbsoluteFill>
  );
};
