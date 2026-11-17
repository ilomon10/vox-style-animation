import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import type { RgbSplit } from "../tokens/finish";
import { useStage } from "../lib/stage";
import { FinishFilter } from "./filters";

export type ChromaticAberrationProps = {
  /** uniform (paper desk: R down-right, B up-left) or radial (Vox lens CA); px are design px */
  split: RgbSplit;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * RGB split as one SVG filter over its children. Place OUTSIDE <DesignSpace> (it works at output
 * resolution and converts design px with useStage().u). The frame edge loses ≤ the shift in px for one
 * channel — wrap in <Jitter overscan> or scale slightly if the edge is visible. <FilmFinish> does that.
 */
export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({ split, children, style }) => {
  const { width, height, u } = useStage();
  const id = "ca" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <AbsoluteFill style={{ filter: `url(#${id})`, ...style }}>
      <FinishFilter id={id} width={width} height={height} u={u} split={split} />
      {children}
    </AbsoluteFill>
  );
};
