import React from "react";
import { AbsoluteFill } from "remotion";
import { DESIGN_H, DESIGN_W } from "../../lib/stage";
import { RadialBlur } from "../../motion/blur";

/** Shared picture-effect layer: transform + blur + brightness + zoom-blur around `origin`. */
export type FxState = {
  scale?: number; x?: number; y?: number; rotate?: number; blur?: number; brightness?: number;
  /** zoom-blur spread (RadialBlur strength) */
  radial?: number;
  origin?: { x: number; y: number };
};
export const FxLayer: React.FC<FxState & { children: React.ReactNode }> = ({ scale = 1, x = 0, y = 0, rotate = 0, blur = 0, brightness = 1, radial = 0, origin = { x: DESIGN_W / 2, y: DESIGN_H / 2 }, children }) => {
  const filters: string[] = [];
  if (Math.abs(brightness - 1) > 1e-3) filters.push(`brightness(${brightness})`);
  if (blur > 0.05) filters.push(`blur(${blur}px)`);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${origin.x}px ${origin.y}px`,
          transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
          filter: filters.length ? filters.join(" ") : undefined,
        }}
      >
        <RadialBlur strength={radial} origin={origin}>{children}</RadialBlur>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
