import React from "react";
import { AbsoluteFill } from "remotion";
import { useStage } from "../lib/stage";

export type PillarboxProps = {
  /** picture aspect ratio (4/3 for the epigenetics excerpt) */
  aspect?: number;
  /** flat bar colour (analysis/epigenetics.md: #1F1F1F, std 0) */
  color?: string;
};

/** Flat side bars that reduce the picture to `aspect`. Draw it over the (finished) frame. */
export const Pillarbox: React.FC<PillarboxProps> = ({ aspect = 4 / 3, color = "#1F1F1F" }) => {
  const { width, height } = useStage();
  const bar = Math.max(0, (width - height * aspect) / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: bar, background: color }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: bar, background: color }} />
    </AbsoluteFill>
  );
};
