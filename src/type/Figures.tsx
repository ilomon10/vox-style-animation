import React from "react";
import { useDrawingFrame } from "../lib/time";
import { paperDesk } from "../tokens/colors";
import { paperDeskType, typeStyle, type TypeRole } from "../tokens/type";
import { prog, useSecToFrames } from "./shared";
import { Easing } from "remotion";

/** Paper desk neon on near-black: core #ECF103, halo halving every ≈8 px over ≈45 px. */
export const NeonText: React.FC<{
  children: React.ReactNode;
  role?: TypeRole;
  style?: React.CSSProperties;
}> = ({ children, role = paperDeskType.neon, style }) => {
  const c = role.color;
  const halo = [8, 16, 24, 45].map((r, i) => `0 0 ${r}px rgba(236,241,3,${(0.9 / 2 ** i).toFixed(3)})`).join(", ");
  return <div style={{ ...typeStyle(role), color: c, textShadow: halo, ...style }}>{children}</div>;
};

/** "43000000000" → "43 000 000 000" (SPACE thousands separators, paper desk house style) */
export const formatSpaced = (n: number): string =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Big number with space separators and optional count-up (ease `grow`). */
export const BigFigure: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  role?: TypeRole;
  /** animate 0 → value */
  countUp?: boolean;
  delay?: number;
  /** frames, default 1 s */
  duration?: number;
  style?: React.CSSProperties;
}> = ({ value, prefix = "", suffix = "", role = paperDeskType.figure, countUp = false, delay = 0, duration, style }) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const p = countUp ? prog(f, delay, duration ?? toF(1), "grow") : 1;
  const final = `${prefix}${formatSpaced(value)}${suffix}`;
  const shown = `${prefix}${formatSpaced(value * p)}${suffix}`;
  return (
    <div style={{ ...typeStyle(role), position: "relative", display: "inline-block", ...style }}>
      <span style={{ visibility: "hidden" }}>{final}</span>
      <span style={{ position: "absolute", left: 0, top: 0 }}>{shown}</span>
    </div>
  );
};

/**
 * Slot reel: the word list scrolls up and stops on the target (pitch 54 px, ≈20 f decelerating at 24 fps;
 * non-target words at ≈20 % opacity; optional 1 px box around the target). analysis/porsche-part3-stills.md M16.
 */
export const SlotReel: React.FC<{
  words: string[];
  /** index into `words` to land on */
  target: number;
  role?: TypeRole;
  delay?: number;
  /** frames, default 20 f @24 fps */
  duration?: number;
  /** words travelled before landing, default 10 */
  travel?: number;
  pitch?: number;
  /** reel width in design px */
  width?: number;
  /** rows visible above/below the target */
  rowsAround?: number;
  box?: boolean;
  style?: React.CSSProperties;
}> = ({ words, target, role = paperDeskType.subtitle, delay = 0, duration, travel = 10, pitch = 54, width = 320, rowsAround = 1, box = false, style }) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const p = prog(f, delay, duration ?? Math.round((20 / 24) * toF(1)), Easing.bezier(0.1, 0.7, 0.3, 1));
  // reel strip: `travel` words leading up to (and ending on) the target, cycling through the list
  const strip: string[] = [];
  for (let i = 0; i <= travel + rowsAround; i++) strip.push(words[(((target - travel + i) % words.length) + words.length) % words.length]);
  const rowsH = (rowsAround * 2 + 1) * pitch;
  const pos = p * travel * pitch; // px scrolled
  return (
    <div style={{ ...typeStyle(role), position: "relative", width, height: rowsH, overflow: "hidden", display: "inline-block", ...style }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${rowsAround * pitch - pos}px)` }}>
        {strip.map((w, i) => {
          // row i centre y in strip; the viewport centre sits at pos + rowsAround*pitch + pitch/2
          const dist = Math.abs(i * pitch - pos);
          const isTarget = i === travel;
          const near = Math.max(0, 1 - dist / pitch);
          return (
            <div key={i} style={{ height: pitch, lineHeight: `${pitch}px`, opacity: isTarget ? 0.2 + 0.8 * near : 0.2 }}>
              {w}
            </div>
          );
        })}
      </div>
      {box && (
        <div style={{ position: "absolute", left: 0, right: 0, top: rowsAround * pitch, height: pitch, boxSizing: "border-box", border: `1px solid ${paperDesk.inkPlum}` }} />
      )}
    </div>
  );
};
