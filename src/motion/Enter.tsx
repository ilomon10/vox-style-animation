import React from "react";
import { useVideoConfig } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { CurveName, ease } from "../tokens/easing";
import { DUR } from "../tokens/motion";
import { keyframes } from "./keyframes";

export type EnterType =
  | "drop"
  | "rise"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "pop"
  | "maskedRise"
  | "gravityDrop"
  | "burst";

export type EnterProps = {
  /** drop = falls from above; rise = from below; slideLeft = MOVES left (enters from the right);
   *  slideRight = moves right (enters from the left); maskedRise = rises from behind `mask`;
   *  gravityDrop = hard landing, no bounce; burst = torn-paper patch 0.54→.80→.92→.98→1 on drawings. */
  type?: EnterType;
  /** travel in design px (default 300; gravityDrop 500; maskedRise 160) */
  distance?: number;
  /** start frame, relative to the enclosing Sequence */
  delay?: number;
  /** frames (default DUR.propEnter; gravityDrop DUR.gravityDrop) */
  duration?: number;
  /** curve token (default `enter`; pop → `pop`; gravityDrop → `gravity`) */
  ease?: CurveName;
  /** props fall in tilted and land at 0° (paper desk: 10–20°) */
  startRotate?: number;
  /** fraction of the move already done on the first frame (paper-desk cut-outs: ≈0.7). Remaps linearly. */
  firstFrameProgress?: number;
  /** maskedRise: y (px from the top of the element's resting box) of the line it rises from behind.
   *  Default = bottom edge of the element. */
  mask?: { y?: number };
  /** burst: transform-origin (default bottom-centre) */
  anchor?: string;
  /** scaleIn / pop start scale (default 0.6 / 0.4) */
  fromScale?: number;
  /** Optional box (design px). Pass it when the child is an absolutely positioned object
   *  (CutOut, PhotoPrint, …): the wrapper then occupies exactly that box, so scale/rotate pivot
   *  on the object's centre — place the child at x=0, y=0 inside. Without a box, Enter is an
   *  in-flow wrapper (fine for text and in-flow content). */
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

type Box = { x?: number; y?: number; width?: number; height?: number };
/** wrapper style for an optional box: absolute at (x, y) with the given size */
export const boxStyle = ({ x, y, width, height }: Box): React.CSSProperties =>
  x === undefined && y === undefined && width === undefined && height === undefined
    ? {}
    : { position: "absolute", left: x ?? 0, top: y ?? 0, width, height };
const innerFill = (b: Box): React.CSSProperties =>
  b.width !== undefined || b.height !== undefined ? { position: "relative", width: "100%", height: "100%" } : {};

// Torn-paper patch scale per drawing, analysis/dracula.md §8 (burst).
const BURST = [0.54, 0.8, 0.92, 0.98, 1];

/** Stepped entrance: nothing before `delay`; no opacity fade (conventions rule 7). */
export const Enter: React.FC<EnterProps> = ({
  type = "rise",
  distance,
  delay = 0,
  duration,
  ease: easeName,
  startRotate = 0,
  firstFrameProgress = 0,
  mask,
  anchor = "50% 100%",
  fromScale,
  x,
  y,
  width,
  height,
  style,
  children,
}) => {
  const f = useDrawingFrame();
  const { fps } = useVideoConfig();
  const box = { x, y, width, height };
  const local = f - delay;
  if (local < 0) return <div style={{ ...boxStyle(box), ...style, visibility: "hidden" }}>{children}</div>;

  const dur =
    duration ?? Math.round((type === "gravityDrop" ? DUR.gravityDrop : DUR.propEnter) * fps);
  const curve: CurveName = easeName ?? (type === "pop" ? "pop" : type === "gravityDrop" ? "gravity" : "enter");
  const d = distance ?? (type === "gravityDrop" ? 500 : type === "maskedRise" ? 160 : 300);
  const raw = ease(curve)(Math.min(1, Math.max(0, local / dur)));
  const p = firstFrameProgress + (1 - firstFrameProgress) * raw;
  const rest = 1 - p;

  let transform = "";
  let origin: string | undefined;
  switch (type) {
    case "drop":
    case "gravityDrop":
      transform = `translateY(${-rest * d}px)`;
      break;
    case "rise":
    case "maskedRise":
      transform = `translateY(${rest * d}px)`;
      break;
    case "slideLeft":
      transform = `translateX(${rest * d}px)`;
      break;
    case "slideRight":
      transform = `translateX(${-rest * d}px)`;
      break;
    case "scaleIn":
    case "pop": {
      const s0 = fromScale ?? (type === "pop" ? 0.4 : 0.6);
      transform = `scale(${s0 + (1 - s0) * p})`;
      break;
    }
    case "burst": {
      const step = fps / 12;
      const s = keyframes(
        BURST.map((v, i) => ({ at: i * step, value: v })),
        local,
      );
      transform = `scale(${s})`;
      origin = anchor;
      break;
    }
  }
  if (startRotate) transform += ` rotate(${startRotate * rest}deg)`;

  const clip: React.CSSProperties =
    type === "maskedRise"
      ? { clipPath: `inset(-4000px -4000px ${mask?.y === undefined ? "0px" : `calc(100% - ${mask.y}px)`} -4000px)` }
      : {};

  return (
    <div style={{ ...boxStyle(box), ...style, ...clip }}>
      <div style={{ ...innerFill(box), transform, transformOrigin: origin }}>{children}</div>
    </div>
  );
};

export type ExitProps = {
  /** fallOut = ease-in cubic downward; slideOut = sideways; shrink = scales to nothing */
  type?: "fallOut" | "slideOut" | "shrink";
  /** start frame, relative to the enclosing Sequence */
  at?: number;
  /** frames (default DUR.exit) */
  duration?: number;
  distance?: number;
  /** slideOut direction */
  direction?: "left" | "right";
  /** rotation reached at the end (deg) */
  endRotate?: number;
  ease?: CurveName;
  /** optional box, as for Enter (absolute objects: place the child at 0,0 inside) */
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Stepped exit (ease-in), hidden once complete. */
export const Exit: React.FC<ExitProps> = ({
  type = "fallOut",
  at = 0,
  duration,
  distance,
  direction = "left",
  endRotate = 0,
  ease: easeName = "exit",
  x,
  y,
  width,
  height,
  style,
  children,
}) => {
  const f = useDrawingFrame();
  const { fps } = useVideoConfig();
  const box = { x, y, width, height };
  const dur = duration ?? Math.round(DUR.exit * fps);
  const t = (f - at) / dur;
  if (t >= 1) return <div style={{ ...boxStyle(box), ...style, visibility: "hidden" }}>{children}</div>;
  const p = ease(easeName)(Math.min(1, Math.max(0, t)));
  const d = distance ?? (type === "fallOut" ? 1200 : 1920);
  const move =
    type === "fallOut"
      ? `translateY(${p * d}px)`
      : type === "slideOut"
        ? `translateX(${(direction === "left" ? -1 : 1) * p * d}px)`
        : `scale(${1 - p})`;
  return (
    <div style={{ ...boxStyle(box), ...style }}>
      <div style={{ ...innerFill(box), transform: `${move}${endRotate ? ` rotate(${endRotate * p}deg)` : ""}` }}>{children}</div>
    </div>
  );
};
