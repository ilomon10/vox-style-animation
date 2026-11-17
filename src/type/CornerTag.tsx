import React from "react";
import { useCurrentFrame } from "remotion";
import { typeStyle, voxLightType } from "../tokens/type";
import { packaging } from "../tokens/colors";
import { capTrim } from "./shared";

// New colour values, to move into src/tokens/colors.ts.
/** corner source tag plate: dark, ~50 % translucent over the footage (CR 0:20: plate x 140-487, y 0-52) */
export const CORNER_TAG_PLATE = packaging.cornerTagPlate;
/** tag text: white */
export const CORNER_TAG_INK = packaging.cornerTagInk;

export type CornerTagProps = {
  /** "Library of Congress, 1958" */
  text: string;
  /** frame the tag appears (sequence-relative); default 0 = on from the cut, hard on (ones) */
  at?: number;
  /** left / top of the plate, design px (default 140 / 0: CR 0:20 "The Diary of a CEO") */
  x?: number;
  y?: number;
  /** cap height, design px (default 21: CR 0:20 measures ~21-22 px, 2 % H; the spec table's 16 px is the AM text-only variant) */
  cap?: number;
  /** "plate" (default): translucent dark plate (CR). "text": no plate, white over a soft 50 % black shadow (AM) */
  look?: "plate" | "text";
  style?: React.CSSProperties;
};

/**
 * Corner source tag of full-frame footage (analysis/vox-framework-coverage.md Build 6): Inter 500 (the `SourceLine` sans role), white,
 * sentence case, top-left, hard on from the cut and off with the scene. No platform icon (never draw a real platform's mark).
 * Must sit inside <DesignSpace>.
 */
export const CornerTag: React.FC<CornerTagProps> = ({ text, at = 0, x = 140, y = 0, cap = 21, look = "plate", style }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const plate = look === "plate";
  const padX = Math.round(cap * 0.6);
  const h = Math.round(cap * 2.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, height: h, padding: `0 ${padX}px`, display: "flex", alignItems: "center", background: plate ? CORNER_TAG_PLATE : undefined, ...style }}>
      <div style={{ whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...voxLightType.small, cap, color: CORNER_TAG_INK, leading: 1 }), textShadow: plate ? undefined : "0 2px 6px rgba(0,0,0,0.5)" }}>{text}</div>
    </div>
  );
};
