import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { useStage } from "../lib/stage";
import { drawingIndex } from "../lib/time";
import { tex } from "./shared";

export type DustLoopProps = {
  /** overlay opacity (preset: darkCollage 0.85) */
  opacity?: number;
  /** length of the loop in drawings (12 → repeats every 24 frames at 12 drawings/s @24 fps) */
  drawings?: number;
  /** drawings per second (12: on twos at 24 fps) */
  rate?: number;
  /**
   * "bright": bright specks + 1–4 thin vertical scratches drifting ≈3.7 px/f (dark collage, screen blend,
   *           analysis/dracula.md §6). "mixed": dark and light specks and hairs (normal blend).
   */
  variant?: "bright" | "mixed";
  style?: React.CSSProperties;
};

const COUNT = { bright: 12, mixed: 8 } as const;

/** Film dust/scratch overlay that changes every drawing, looping every `drawings` drawings. */
export const DustLoop: React.FC<DustLoopProps> = ({ opacity = 0.85, drawings = 12, rate = 12, variant = "bright", style }) => {
  const frame = useCurrentFrame(); // dust is on the film, not on the 12-drawing artwork clock: but its own rate is `rate`
  const { fps } = useStage();
  const i = drawingIndex(frame, fps, rate) % drawings;
  const file = variant === "bright" ? `dustbright_${i % COUNT.bright}.png` : `dust_${i % COUNT.mixed}.png`;
  return (
    <AbsoluteFill style={{ mixBlendMode: variant === "bright" ? "screen" : "normal", opacity, pointerEvents: "none", ...style }}>
      <Img src={tex(file)} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
