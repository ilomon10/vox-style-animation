import React from "react";
import { useDrawingIndex } from "../lib/time";
import { rand } from "../lib/random";
import { RATE } from "../tokens/motion";
import { collageType, typeStyle, type TypeRole } from "../tokens/type";
import { gauss, glyphs } from "./shared";

export type BoilTextProps = {
  children: string;
  role?: TypeRole;
  /** boils per second, default RATE.titleBoil (4 = every 6 f @24) */
  rate?: number;
  /** offset σ in px (x, y) and clamp, dark collage: 7 / 4.6 / 12 */
  sigmaX?: number;
  sigmaY?: number;
  clamp?: number;
  /** max rotation in degrees (±3–6) */
  rotation?: number;
  seed?: string;
  style?: React.CSSProperties;
};

/**
 * Dracula end title: every glyph gets a seeded random offset + rotation, re-rolled every N frames.
 * Glyphs keep their natural advance (inline-block) and are jittered with transforms.
 */
export const BoilText: React.FC<BoilTextProps> = ({
  children,
  role = collageType.endTitle,
  rate = RATE.titleBoil,
  sigmaX = 7,
  sigmaY = 4.6,
  clamp = 12,
  rotation = 4.5,
  seed = "boil",
  style,
}) => {
  const step = useDrawingIndex(rate);
  const c = (v: number) => Math.max(-clamp, Math.min(clamp, v));
  return (
    <div style={{ ...typeStyle(role), transform: role.scaleX ? `scaleX(${role.scaleX})` : undefined, transformOrigin: "50% 50%", ...style }}>
      {glyphs(children).map((ch, i) => {
        const k = `${seed}-${step}-${i}`;
        const dx = c(gauss(rand(`${k}a`), rand(`${k}b`), rand(`${k}c`)) * sigmaX);
        const dy = c(gauss(rand(`${k}d`), rand(`${k}e`), rand(`${k}f`)) * sigmaY);
        const rot = (rand(`${k}r`) * 2 - 1) * rotation;
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)` }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};
