import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { useStage } from "../lib/stage";
import { FinishFilter } from "./filters";

export type LevelsProps = {
  /** output black point: input 0 maps here (e.g. "#272622" — Vox lifted blacks) */
  black: string;
  /** output white point: input 255 maps here (e.g. "#E9E7E7" — capped whites) */
  white: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/** Per-channel linear levels (feComponentTransfer): out = black + in · (white − black). */
export const Levels: React.FC<LevelsProps> = ({ black, white, children, style }) => {
  const { width, height, u } = useStage();
  const id = "lv" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <AbsoluteFill style={{ filter: `url(#${id})`, ...style }}>
      <FinishFilter id={id} width={width} height={height} u={u} levels={{ black, white }} />
      {children}
    </AbsoluteFill>
  );
};
