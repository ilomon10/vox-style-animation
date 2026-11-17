import React from "react";
import { AbsoluteFill } from "remotion";
import { useStage } from "../lib/stage";
import { powerStops } from "./shared";

export type VignetteProps = {
  /** corner darkening a: L × (1 − a·r^power) at r = 1 (porsche 0.20, highlight 0.15) */
  strength: number;
  /** falloff exponent (porsche 1.9, highlight 1.4, vox 2.2) */
  power: number;
  style?: React.CSSProperties;
};

/** Circular multiply vignette. r = distance from the frame centre / half-diagonal. */
export const Vignette: React.FC<VignetteProps> = ({ strength, power, style }) => {
  const { width, height } = useStage();
  const R = Math.hypot(width, height) / 2;
  // multiply by grey v = 255·(1 − a(r)) == L × (1 − a)
  const stops = powerStops(strength, power, (a) => {
    const v = Math.round(255 * (1 - a));
    return `rgb(${v},${v},${v})`;
  });
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "multiply",
        background: `radial-gradient(circle ${R}px at 50% 50%, ${stops})`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
