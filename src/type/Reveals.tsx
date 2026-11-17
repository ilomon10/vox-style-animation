import React from "react";
import { useDrawingFrame, useDrawingIndex, useDrawingRate } from "../lib/time";
import { rand } from "../lib/random";
import { Easing } from "remotion";
import { editorialType, typeStyle, type TypeRole } from "../tokens/type";
import { glyphs, prog, useSecToFrames } from "./shared";

type RevealBase = {
  children: React.ReactNode;
  /** type role; omit to inherit */
  role?: TypeRole;
  delay?: number;
  /** frames, default 0.4 s */
  duration?: number;
  style?: React.CSSProperties;
};

const wrap = (role: TypeRole | undefined, style?: React.CSSProperties): React.CSSProperties => ({
  ...(role ? typeStyle(role) : null),
  ...style,
});
/** extends the mask box so descenders / ascenders are never clipped by the mask rectangle */
const bleed: React.CSSProperties = { padding: "0.3em 0", margin: "-0.3em 0" };

/**
 * Editorial headline: a feathered mask opens from the centre. Half-width progress ≈ 0.30, 0.68, 0.94, 1.0 over
 * ≈0.4 s with ease [0,0,.58,1]; feather ≈30 px (analysis/highlight.md §7–§9).
 */
export const CenterOutReveal: React.FC<RevealBase & { feather?: number }> = ({
  children, role = editorialType.headline, delay = 0, duration, feather = 30, style,
}) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const p = prog(f, delay, duration ?? toF(0.4), Easing.bezier(0, 0, 0.58, 1));
  const half = `calc(${p} * (50% + ${feather}px))`; // grows past the edges so p=1 is fully open
  const L = `calc(50% - ${half})`;
  const R = `calc(50% + ${half})`;
  const mask = `linear-gradient(to right, transparent calc(${L} - ${feather / 2}px), #000 calc(${L} + ${feather / 2}px), #000 calc(${R} - ${feather / 2}px), transparent calc(${R} + ${feather / 2}px))`;
  return (
    <div style={{ ...wrap(role, style), ...bleed, WebkitMaskImage: mask, maskImage: mask }}>{children}</div>
  );
};

/** Text block revealed top→bottom, ≈0.4 s, ease [.42,0,.58,1]. */
export const LineWipe: React.FC<RevealBase> = ({ children, role, delay = 0, duration, style }) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const p = prog(f, delay, duration ?? toF(0.4), Easing.bezier(0.42, 0, 0.58, 1));
  return <div style={{ ...wrap(role, style), clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }}>{children}</div>;
};

/** Hard-edged right→left erase (analysis/highlight.md wipe-off). */
export const WipeOff: React.FC<RevealBase> = ({ children, role, delay = 0, duration, style }) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const p = prog(f, delay, duration ?? toF(0.3), "linear");
  return <div style={{ ...wrap(role, style), clipPath: `inset(-0.3em ${p * 100}% -0.3em 0)` }}>{children}</div>;
};

/**
 * Glyphs appear in irregular seeded chunks over 3–4 drawings (left→right chunks of random size).
 */
export const ChunkPopOn: React.FC<{
  children: string;
  role?: TypeRole;
  delay?: number;
  /** number of drawings the pop-on spans, default 4 */
  drawings?: number;
  seed?: string;
  style?: React.CSSProperties;
}> = ({ children, role, delay = 0, drawings = 4, seed = "chunk", style }) => {
  const di = useDrawingIndex();
  const toF = useSecToFrames();
  const g = glyphs(children);
  // delay is in comp frames; convert to drawing steps at the current drawing rate
  const rate = useDrawingRate();
  const start = Math.round(delay / toF(1) * rate);
  const step = di - start;
  // cumulative thresholds, random but monotone; last chunk completes the string
  const cuts: number[] = [];
  let acc = 0;
  for (let d = 0; d < drawings; d++) {
    acc = d === drawings - 1 ? 1 : Math.min(0.98, acc + (0.15 + 0.5 * rand(`${seed}-${d}`)) * (1 - acc));
    cuts.push(acc);
  }
  const shown = step < 0 ? 0 : Math.ceil(cuts[Math.min(step, drawings - 1)] * g.length);
  return (
    <div style={wrap(role, style)}>
      {g.map((ch, i) => (
        <span key={i} style={{ visibility: i < shown ? "visible" : "hidden" }}>{ch}</span>
      ))}
    </div>
  );
};
