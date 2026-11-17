import React from "react";
import { useCurrentFrame } from "remotion";
import { rand } from "../lib/random";
import { useDrawingFrame, useDrawingIndex, useFrames } from "../lib/time";
import { ease } from "../tokens/easing";
import { typeStyle } from "../tokens/type";
import { packaging } from "../tokens/colors";
import { capTrim, prog } from "./shared";

// New colour values, to move into src/tokens/colors.ts.
/** `corner` year: cream (AM 1:18 #f3efdb) */
export const DATE_CREAM = packaging.dateCream;
/** `spine` box: charcoal VHS-spine label (DA 0:15) and its white digits */
export const SPINE_BOX = packaging.spineBox;
export const SPINE_INK = packaging.spineInk;
/** the three little coloured marks on the spine's left edge (DA 0:15: magenta, dark red, yellow) */
export const SPINE_MARKS = packaging.spineMarks;

export type DateTagProps = {
  /** "1984" (a year, or a short date) */
  text: string;
  /** frame it appears (sequence-relative); default 0 */
  at?: number;
  /** "corner" (default): cream squared-condensed year top-left, hard on (AM). "spine": a charcoal VHS-spine box centred on the frame, glitching in over 14 f, digits sliding in over 12 f on twos (DA) */
  style?: "corner" | "spine";
  /** frames it stays from `at` (default: until the scene ends) */
  life?: number;
  seed?: string;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Archival date tag over footage (analysis/vox-framework-coverage.md Build 6). `corner` (AM 1:18): year at x 100, cap 84 (7.8 % H), cream with a
 * soft shadow, on from `at`. `spine` (DA 0:15): box 896 x 196 (18 % H) centred, digits cap 128 (12 % H) letter-spaced; the box builds from seeded
 * horizontal slices over 14 f (@24, twos), the digits slide in from the left inside the box over 12 f (twos) from f4. Inside <DesignSpace>.
 */
export const DateTag: React.FC<DateTagProps> = ({ text, at = 0, style = "corner", life, seed = "date" }) => {
  const f24 = useFrames();
  const raw = useCurrentFrame() - at;
  const d = useDrawingFrame() - at; // build on twos
  const di = useDrawingIndex();
  if (raw < 0 || (life !== undefined && raw >= life)) return null;
  if (style === "corner") {
    return (
      <div style={{ position: "absolute", left: 100, top: 57, whiteSpace: "pre", ...capTrim, ...typeStyle({ font: "CONDENSED", cap: 84, weight: 700, color: DATE_CREAM, leading: 1, tracking: 0.02 }), textShadow: "0 3px 10px rgba(0,0,0,0.45)" }}>{text}</div>
    );
  }
  const W = 896, H = 196, X = 512, Y = 441;
  const boxIn = f24(14);
  const sliceN = 7;
  const sliceH = H / sliceN;
  const digitsAt = f24(4);
  const slide = ease("enter")(prog(d, digitsAt, f24(12))); // digits slide on twos (d is the posterised frame)
  const building = d < boxIn;
  const bp = clamp01(d / boxIn);
  const n = text.length;
  const slot = 156;
  const digitsW = n * slot;
  const digitsLeft = (W - 124 - 105 - digitsW) / 2; // centred between the left marks and the right bars
  return (
    <div style={{ position: "absolute", left: X, top: Y, width: W, height: H }}>
      {/* box: horizontal slices that flicker on and shift sideways until the build ends (twos) */}
      {Array.from({ length: sliceN }, (_, i) => {
        const on = !building || rand(`${seed}-on-${i}-${di}`) < 0.35 + 0.65 * bp;
        const shift = building ? (rand(`${seed}-sh-${i}-${di}`) - 0.5) * 120 * (1 - bp) : 0;
        if (!on) return null;
        return <div key={i} style={{ position: "absolute", left: shift, top: i * sliceH, width: W, height: sliceH + 0.5, background: SPINE_BOX }} />;
      })}
      {!building && (
        <>
          {/* left-edge marks */}
          <div style={{ position: "absolute", left: 49, top: 0, width: 7, height: H, display: "flex", flexDirection: "column" }}>
            {SPINE_MARKS.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
          </div>
          {/* right-edge bars */}
          {[[782, 5], [796, 3], [828, 5], [858, 3], [890, 6]].map(([bx, bw]) => <div key={bx} style={{ position: "absolute", left: bx, top: 0, width: bw, height: H, background: SPINE_INK }} />)}
        </>
      )}
      {d >= digitsAt && (
        <div style={{ position: "absolute", left: 124, top: 0, width: W - 124 - 105, height: H, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: digitsLeft - (1 - slide) * 140, top: (H - 128) / 2, display: "flex", width: digitsW }}>
            {text.split("").map((ch, i) => (
              <span key={i} style={{ width: slot, textAlign: "center", ...capTrim, ...typeStyle({ font: "VOX_SANS", cap: 128, weight: 800, color: SPINE_INK, leading: 1 }) }}>{ch}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
