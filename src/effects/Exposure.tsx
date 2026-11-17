import React from "react";
import { useStage } from "../lib/stage";

export type ExposureProps = {
  /** brightness multiplier (1 = unchanged; lightning / flash transitions go to 1.5–3) */
  brightness?: number;
  /** blur radius in design px (rack-focus / flash bloom) */
  blur?: number;
  contrast?: number;
  /** "design": blur is design px and gets ×u (use OUTSIDE <DesignSpace>); "css": raw CSS px (use inside it) */
  unit?: "design" | "css";
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Generic exposure / focus wrapper for flash, lightning and rack-focus transitions:
 * `filter: brightness() contrast() blur()`. Animate the props from the caller.
 */
export const Exposure: React.FC<ExposureProps> = ({
  brightness = 1,
  blur = 0,
  contrast = 1,
  unit = "design",
  children,
  style,
}) => {
  const { u } = useStage();
  const parts: string[] = [];
  if (brightness !== 1) parts.push(`brightness(${brightness})`);
  if (contrast !== 1) parts.push(`contrast(${contrast})`);
  if (blur > 0) parts.push(`blur(${blur * (unit === "design" ? u : 1)}px)`);
  return (
    <div style={{ position: "absolute", inset: 0, filter: parts.length ? parts.join(" ") : undefined, ...style }}>
      {children}
    </div>
  );
};
