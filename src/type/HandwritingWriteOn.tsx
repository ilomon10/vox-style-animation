import React from "react";
import { useVideoConfig } from "remotion";
import { jitter } from "../lib/random";
import { useDrawingFrame } from "../lib/time";
import { voxExplainer } from "../tokens/colors";
import { RATE } from "../tokens/motion";
import { typeStyle, type TypeRole } from "../tokens/type";
import { glyphs } from "./shared";

/** felt-tip label hand (local role: voxType has no free handwriting role) */
const handRole: TypeRole = { font: "MARKER", cap: 40, weight: 400, color: voxExplainer.marker, leading: 1.2 };

export type HandwritingWriteOnProps = {
  children: string;
  role?: TypeRole;
  /** characters per second, default RATE.handwritingCps (12 = 1 per drawing) */
  cps?: number;
  delay?: number;
  /** colour for every word after the first (Vox tape labels: 2nd word blue) */
  secondColor?: string;
  seed?: string;
  style?: React.CSSProperties;
};

/**
 * Marker write-on: ≈1 character per drawing; each glyph is revealed by a L→R clip over one drawing so partial
 * strokes are visible; per-letter seeded rotation ±3° and baseline wobble (analysis/epigenetics.md §7).
 */
export const HandwritingWriteOn: React.FC<HandwritingWriteOnProps> = ({
  children,
  role = handRole,
  cps = RATE.handwritingCps,
  delay = 0,
  secondColor,
  seed = "hw",
  style,
}) => {
  const f = useDrawingFrame();
  const { fps } = useVideoConfig();
  const period = fps / 12;
  let word = 0;
  return (
    <div style={{ ...typeStyle(role), ...style }}>
      {glyphs(children).map((ch, i) => {
        if (ch === " ") word++;
        const p = Math.max(0, Math.min(1, (f - delay - (i * fps) / cps) / period + 1 / 3));
        const rot = jitter(`${seed}-r${i}`, 3);
        const dy = jitter(`${seed}-y${i}`, 0.03);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transform: `translateY(${dy}em) rotate(${rot}deg)`,
              clipPath: `inset(-0.2em ${(1 - p) * 100}% -0.2em 0)`,
              color: secondColor && word > 0 ? secondColor : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
