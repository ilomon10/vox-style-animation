import React from "react";
import { Easing, interpolate } from "remotion";
import { rand } from "../lib/random";
import { useDrawingFrame } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";
import { distressMask } from "./shared";

export type GiantWordProps = {
  text: string;
  /** "white" paper → ink #161616; "black" → off-white (earworm-C §4) */
  ground?: "white" | "black";
  /** cut frame: the converge starts here (sequence-relative) */
  delay?: number;
  /** converge length: 19 horizontal / 16 vertical / 25 slow (earworm-C §7) */
  convergeFrames?: number;
  /** scatter axis and amplitude: outermost letters start `amp` px away (x, spacing ≈3×), or alternate letters ± amp vertically (y) */
  scatter?: { axis?: "x" | "y"; amp?: number };
  /** bezier of the converge: (0.1, 0, 0, 1) horizontal (earworm-C §7) */
  curve?: [number, number, number, number];
  /** letter-spacing in em once converged (the reference words span 7× cap; Anton alone is ≈4×) */
  tracking?: number;
  /** centre of the word, design px */
  cx?: number;
  cy?: number;
  role?: TypeRole;
  /** frame the pre-cut contraction starts: ×0.92 over 3 accelerating drawings, then hold (earworm-C §7) */
  exitAt?: number;
  /** drawn ABOVE the letters: drop a <TornPhoto> here so it sits inside the word and hides 1–2 letters */
  children?: React.ReactNode;
  seed?: string;
};

/**
 * One giant condensed word, 16–21 % of the frame height (cap 200 = 18.5 %), letters scattered then converging.
 * analysis/earworm-C.md §4 "Display condensed", §7 "Letter converge", §9 `TitleCardWord`.
 */
export const GiantWord: React.FC<GiantWordProps> = ({
  text, ground = "white", delay = 0, convergeFrames = 19, scatter = { axis: "x" }, curve = [0.1, 0, 0, 1], cx = 960, cy = 540,
  role = earwormType.giantWord, tracking = 0.12, exitAt, children, seed = "gw",
}) => {
  const f = useDrawingFrame();
  const chars = Array.from(text);
  const n = chars.length;
  const p = Easing.bezier(...curve)(interpolate(f, [delay, delay + convergeFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ink = ground === "white" ? voxEarworm.displayDark : "#EDEDED";
  const axis = scatter.axis ?? "x";
  const amp = scatter.amp ?? (axis === "x" ? 255 : 240); // outermost letter travels 255 px (SPEECHES) / ±240 px (POETRY)
  // pre-cut contraction: 6 / 24 / 24 px per side per drawing ≈ ×0.97, ×0.92 (earworm-C §7)
  const k = exitAt === undefined ? 0 : Math.max(0, Math.round(((f - exitAt) * 12) / 25));
  const s = exitAt === undefined ? 1 : [1, 0.985, 0.95, 0.92][Math.min(3, k)];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: cx, top: cy - role.cap / 2, transform: `translateX(-50%) scale(${s})`, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...role, color: ink, leading: 1, tracking }), }}>
        {chars.map((ch, i) => {
          const mid = (i - (n - 1) / 2) / Math.max(1, (n - 1) / 2);
          const dx = axis === "x" ? mid * amp * (1 - p) : 0;
          const dy = axis === "y" ? (i % 2 ? 1 : -1) * amp * (0.6 + 0.4 * ((i * 7) % 3) / 2) * (1 - p) : 0;
          return (
            // distress mask per glyph: a mask on the parent would clip the displaced letters
            <span key={i} style={{ display: "inline-block", transform: `translate(${dx}px, ${dy}px)`, ...distressMask(Math.floor(rand(`${seed}-${i}`) * 900), Math.floor(rand(`${seed}-y${i}`) * 900)) }}>
              {ch === " " ? " " : ch}
            </span>
          );
        })}
      </div>
      {children}
    </div>
  );
};
