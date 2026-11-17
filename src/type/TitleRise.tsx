import React from "react";
import { useDrawingFrame } from "../lib/time";
import { DUR } from "../tokens/motion";
import { typeStyle, type TypeRole } from "../tokens/type";
import { prog, useSecToFrames } from "./shared";
import { voxType } from "../tokens/type";

export type TitleRiseProps = {
  /** text; "\n" splits lines, each rising from its own baseline mask */
  children: string;
  role?: TypeRole;
  delay?: number;
  /** frames, default DUR.titleRise (0.5 s) */
  duration?: number;
  /** extra delay between lines, frames */
  stagger?: number;
  style?: React.CSSProperties;
};

/** Vox "Genetics": text rises ≈1 line-height from behind a baseline mask, ease `enter`. */
export const TitleRise: React.FC<TitleRiseProps> = ({
  children,
  role = voxType.title,
  delay = 0,
  duration,
  stagger = 3,
  style,
}) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const lines = children.split("\n");
  const lh = role.leading ?? 1.15;
  return (
    <div style={{ ...typeStyle(role), ...style }}>
      {lines.map((line, i) => {
        const p = prog(f, delay + i * stagger, duration ?? toF(DUR.titleRise), "enter");
        return (
          // mask = the line box; descenders sit inside it (leading ≥ 1.1)
          <div key={i} style={{ overflow: "hidden", height: `${Math.max(lh, 1.15)}em`, lineHeight: `${Math.max(lh, 1.15)}em` }}>
            <div style={{ transform: `translateY(${(1 - p) * 100}%)` }}>{line}</div>
          </div>
        );
      })}
    </div>
  );
};
