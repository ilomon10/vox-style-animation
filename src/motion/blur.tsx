import React from "react";
import { AbsoluteFill } from "remotion";
import { DESIGN_H, DESIGN_W } from "../lib/stage";

export type MotionTrailProps = {
  /** displacement (design px) the content moved during the last rendered step — ghosts are spread
   *  back along it. Caller derives it from its own stepped position (pos(now) − pos(previous drawing)). */
  dx?: number;
  dy?: number;
  /** ghost copies (default 4) */
  count?: number;
  /** opacity of the nearest ghost; farther ones fall off linearly (default 0.5) */
  opacity?: number;
  children: React.ReactNode;
};

/** Fake motion blur: ghost copies behind the real one, decreasing opacity. */
export const MotionTrail: React.FC<MotionTrailProps> = ({ dx = 0, dy = 0, count = 4, opacity = 0.5, children }) => {
  if (Math.hypot(dx, dy) < 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const ghosts = [];
  for (let k = count; k >= 1; k--) {
    const o = opacity * (1 - (k - 1) / count);
    ghosts.push(
      <AbsoluteFill key={k} style={{ opacity: o, transform: `translate(${(-dx * k) / count}px, ${(-dy * k) / count}px)` }}>
        {children}
      </AbsoluteFill>,
    );
  }
  return (
    <AbsoluteFill>
      {ghosts}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export type RadialBlurProps = {
  /** total scale spread of the copies (0.1 = ±5 %); ≈0 renders the content once */
  strength: number;
  copies?: number;
  /** blur centre in design px (default frame centre) */
  origin?: { x: number; y: number };
  children: React.ReactNode;
};

/** Zoom blur: equal-weight stack of scaled copies (layer j has opacity 1/(j+1)). */
export const RadialBlur: React.FC<RadialBlurProps> = ({
  strength,
  copies = 6,
  origin = { x: DESIGN_W / 2, y: DESIGN_H / 2 },
  children,
}) => {
  if (strength < 0.004) return <AbsoluteFill>{children}</AbsoluteFill>;
  const layers = [];
  for (let j = 0; j <= copies; j++) {
    layers.push(
      <AbsoluteFill
        key={j}
        style={{
          opacity: 1 / (j + 1),
          transformOrigin: `${origin.x}px ${origin.y}px`,
          transform: `scale(${1 + strength * (j / copies - 0.5)})`,
        }}
      >
        {children}
      </AbsoluteFill>,
    );
  }
  return <AbsoluteFill>{layers}</AbsoluteFill>;
};
