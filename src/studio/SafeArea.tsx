import React from "react";
import { AbsoluteFill } from "remotion";
import { DESIGN_PORTRAIT, DesignSpace } from "../lib/stage";

/** Where Vox puts text in its Shorts (all text between y ≈ 135 and ≈ 1770, x ≤ 950 on the right; analysis/vox-shorts.md §6), as fractions of the frame: top 7 %, bottom 8 %, right 12 % */
export const SHORTS_SAFE_AREA = { top: 0.07, bottom: 0.08, right: 0.12 };

/** QA overlay (`debug.safeArea`): translucent boxes outside the "Vox text bounds" rectangle. Never in a delivery render. */
export const SafeArea: React.FC = () => {
  const { w, h } = DESIGN_PORTRAIT;
  const z = SHORTS_SAFE_AREA;
  const box = (style: React.CSSProperties, label?: string) => (
    <div style={{ position: "absolute", background: "rgba(255,0,60,0.28)", border: "3px dashed rgba(255,0,60,0.9)", boxSizing: "border-box", color: "#fff", font: "600 28px sans-serif", padding: 10, ...style }}>{label}</div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <DesignSpace design={DESIGN_PORTRAIT}>
        {box({ left: 0, top: 0, width: w, height: h * z.top }, `above Vox text bounds (top ${Math.round(z.top * 100)}%)`)}
        {box({ left: 0, top: h * (1 - z.bottom), width: w, height: h * z.bottom }, `below Vox text bounds (bottom ${Math.round(z.bottom * 100)}%)`)}
        {box({ left: w * (1 - z.right), top: h * z.top, width: w * z.right, height: h * (1 - z.top - z.bottom) })}
        <div style={{ position: "absolute", left: 0, top: h * z.top, width: w * (1 - z.right), height: h * (1 - z.top - z.bottom), border: "3px solid rgba(255,0,60,0.9)", boxSizing: "border-box", color: "#fff", font: "600 28px sans-serif", padding: 10 }}>Vox text bounds</div>
      </DesignSpace>
    </AbsoluteFill>
  );
};
