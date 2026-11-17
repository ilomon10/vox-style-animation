import React from "react";
import { useVideoConfig } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { RATE } from "../tokens/motion";
import { paperDeskType, typeStyle, type TypeRole } from "../tokens/type";
import { glyphs } from "./shared";

export type TypewriterProps = {
  children: string;
  role?: TypeRole;
  /** characters per second; paper desk quote 41, attribution 43 */
  cps?: number;
  /** irregular type-on: glyph reveal times (one per glyph, last one repeats) */
  schedule?: number[];
  /** frame rate the schedule is expressed in, default 24 (dark collage "century": [0,2,6,8,10,14,16]) */
  scheduleFps?: number;
  delay?: number;
  style?: React.CSSProperties;
};

/** Glyph-by-glyph type-on; the newest glyph is at 50 % opacity for one drawing (porsche M8). */
export const Typewriter: React.FC<TypewriterProps> = ({
  children,
  role = paperDeskType.quote,
  cps = RATE.typewriterCps,
  schedule,
  scheduleFps = 24,
  delay = 0,
  style,
}) => {
  const f = useDrawingFrame();
  const { fps } = useVideoConfig();
  const g = glyphs(children);
  const period = fps / 12;
  const start = (i: number) =>
    delay + (schedule ? ((schedule[Math.min(i, schedule.length - 1)] ?? 0) * fps) / scheduleFps : (i * fps) / cps);
  let last = -1;
  g.forEach((_, i) => {
    if (f >= start(i)) last = i;
  });
  return (
    <div style={{ ...typeStyle(role), ...style }}>
      {g.map((ch, i) => {
        const t = f - start(i);
        if (t < 0) return <span key={i} style={{ visibility: "hidden" }}>{ch}</span>;
        return (
          <span key={i} style={{ opacity: i === last && t < period && i < g.length ? 0.5 : 1 }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};
