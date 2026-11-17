import React from "react";
import { useCurrentFrame } from "remotion";
import { voxLight } from "../tokens/colors";
import { useTheme } from "../tokens/theme";
import { typeStyle, voxLightType } from "../tokens/type";
import { capTrim } from "./shared";

export type SourceLineProps = {
  /** the whole line, e.g. "Source: PubMed, 2026" */
  text: string;
  /** left edge, design px (default 93: EL 6:27, x of the "S") */
  x?: number;
  /** BASELINE of the text, design px (default 1026: EL 6:27); for a chart, the line sits under the chart title */
  y?: number;
  /** frame the line appears (sequence-relative); default 0 = on from the cut */
  at?: number;
  /** serif = EL's "Source:" (Source Serif 600, cap 20); sans = the spec's Inter 500, 21 px (CR, AM). Default: serif on the light look, sans elsewhere */
  variant?: "serif" | "sans";
  /** text colour; default the look's text colour (#262626 on light, #f3efdb on dark) */
  color?: string;
  /** cap height override, design px */
  cap?: number;
  style?: React.CSSProperties;
};

/**
 * Source credit line (analysis/vox-framework-coverage.md Build 3): sentence case, no animation — it is simply on
 * from the cut (hard on, "on ones": it uses the raw sequence frame, not the drawing clock). Reused by chart and footage recipes.
 */
export const SourceLine: React.FC<SourceLineProps> = ({ text, x = 93, y = 1026, at = 0, variant, color, cap, style }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const light = theme.name === "voxLight";
  const role = (variant ?? (light ? "serif" : "sans")) === "serif" ? voxLightType.source : voxLightType.small;
  const c = cap ?? role.cap;
  // AM chart source: cream #f3efdb on the dark ground
  const ink = color ?? (light ? voxLight.sourceInk : "#f3efdb");
  return (
    <div style={{ position: "absolute", left: x, top: y - c, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...role, cap: c, color: ink, leading: 1 }), ...style }}>{text}</div>
  );
};
