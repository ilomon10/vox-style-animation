import React from "react";
import { useDrawingFrame } from "../lib/time";
import { rand } from "../lib/random";
import { ease } from "../tokens/easing";
import { paperDesk, voxExplainer } from "../tokens/colors";
import { type Place, placeStyle, type Pt, toPolygon, jaggedEdge } from "./util";

export type TapeVariant = "opaque" | "lime" | "black" | "masking" | "clear";
export type TapeEnds = "straight" | "zigzag" | "torn";

export type TapeProps = Place & {
  variant?: TapeVariant;
  /** length along the tape, design px (paper desk: ≈42 % of the photo width) */
  width?: number;
  /** default width / 3 (paper desk 3:1) */
  height?: number;
  /** short-end treatment; paper desk shows straight or torn zig-zag */
  ends?: TapeEnds;
  /** seed for torn ends and crinkles */
  seed?: string;
  /** if set, the tape is pulled on left→right over `duration` frames starting at `delay` */
  delay?: number;
  duration?: number;
};

const BASE: Record<TapeVariant, string> = {
  opaque: paperDesk.tape, // #F9EC00, opaque (porsche-part3-stills.md §6)
  lime: voxExplainer.tape, // #DDD031 matte
  black: voxExplainer.tapeBlack, // #221F21
  masking: "#C9B48F", // translucent beige, multiplied at ≈50 %
  clear: "#FFFFFF",
};

/** Seeded streak lines (crinkle / wrinkles) for masking and clear tape. */
const streaks = (seed: string, w: number, h: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const x = rand(`${seed}-sx${i}`) * w;
    const len = 0.25 + rand(`${seed}-sl${i}`) * 0.7;
    const y0 = rand(`${seed}-sy${i}`) * h * (1 - len);
    const skew = (rand(`${seed}-sk${i}`) - 0.5) * 6;
    return { x, y0, y1: y0 + h * len, skew, a: 0.35 + rand(`${seed}-sa${i}`) * 0.65 };
  });

/**
 * Adhesive tape strip. Straight long edges; short ends straight, zig-zag or torn.
 *  opaque  paper-desk lemon tape (not translucent, faint own shadow)
 *  lime    Vox matte lime with a slight curl at the right end
 *  black   Vox black tape
 *  masking translucent beige, multiplied ≈50 %, crinkled
 *  clear   20–30 % white wrinkled streaks
 */
export const Tape: React.FC<TapeProps> = ({
  variant = "opaque",
  width = 186,
  height,
  ends = "straight",
  seed = "tape",
  delay = 0,
  duration,
  ...place
}) => {
  const f = useDrawingFrame();
  const h = height ?? width / 3;
  const p = duration ? ease("enter")(Math.min(1, Math.max(0, (f - delay) / duration))) : 1;
  if (duration && f < delay) return null;

  const amp = Math.min(4, h * 0.08);
  const step = Math.max(6, h / 7);
  const left: Pt[] =
    ends === "straight"
      ? [[0, 0]]
      : jaggedEdge(`${seed}-L`, [0, h], [0, 0], step, amp, ends === "zigzag" ? "zigzag" : "torn").map(
          ([x, y]) => [Math.max(0, x + amp), y] as Pt,
        );
  const right: Pt[] =
    ends === "straight"
      ? [[width, 0]]
      : jaggedEdge(`${seed}-R`, [width, 0], [width, h], step, amp, ends === "zigzag" ? "zigzag" : "torn").map(
          ([x, y]) => [Math.min(width, x - amp), y] as Pt,
        );
  const poly: Pt[] =
    ends === "straight"
      ? [
          [0, 0],
          [width, 0],
          [width, h],
          [0, h],
        ]
      : [[amp, 0], [width - amp, 0], ...right.slice(1), [width - amp, h], [amp, h], ...left.slice(1)];

  const translucent = variant === "masking" || variant === "clear";
  const lines = variant === "masking" || variant === "clear" ? streaks(seed, width, h, variant === "clear" ? 16 : 22) : [];
  const alpha = variant === "masking" ? 0.5 : variant === "clear" ? 0.26 : 1;

  return (
    <div
      style={{
        ...placeStyle(place, width, h),
        // opaque tape carries a faint own shadow (porsche-part3-stills.md §6)
        filter: variant === "opaque" ? "drop-shadow(1px 2px 2px rgba(0,0,0,0.22))" : undefined,
        mixBlendMode: variant === "masking" ? "multiply" : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: toPolygon(
            p < 1 ? poly.map(([x, y]) => [Math.min(x, width * p), y] as Pt) : poly,
          ),
          background: BASE[variant],
          opacity: alpha,
        }}
      >
        {variant === "lime" && (
          // slight curl at the right end: darker lip, then a lighter ridge
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: h * 0.55,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(120,110,0,0.28) 62%, rgba(255,250,170,0.35) 82%, rgba(90,80,0,0.2) 100%)",
            }}
          />
        )}
        {variant === "black" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.12) 100%)",
            }}
          />
        )}
        {translucent && (
          <svg width={width} height={h} style={{ position: "absolute", inset: 0 }}>
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x}
                y1={l.y0}
                x2={l.x + l.skew}
                y2={l.y1}
                stroke={variant === "clear" ? "#fff" : "#7A6847"}
                strokeOpacity={variant === "clear" ? l.a * 0.7 : l.a * 0.35}
                strokeWidth={variant === "clear" ? 1.2 : 0.9}
              />
            ))}
            {variant === "masking" && (
              <rect width={width} height={h} fill="none" stroke="#7A6847" strokeOpacity={0.18} />
            )}
          </svg>
        )}
      </div>
    </div>
  );
};
