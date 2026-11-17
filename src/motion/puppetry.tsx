import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { useDrawingFrame } from "../lib/time";
import { jitter } from "../lib/random";
import { keyframes } from "./keyframes";

const sine = Easing.inOut(Easing.sin);

export type PendulumProps = {
  /** swing angles in degrees, one per extreme; ends at rest (0). Default = Dracula hanging sign,
   *  analysis/dracula.md §8: +11 → −2.1 → +4.5 → −2.2 → +1.1 → 0 */
  angles?: number[];
  /** frames between extremes (default 6 = half-period of ~0.5 s at 24 fps) */
  step?: number;
  delay?: number;
  /** transform-origin pivot (default top-centre) */
  pivot?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Damped swing about a top pivot; sine ease between the keyed extremes, stepped to drawings. */
export const Pendulum: React.FC<PendulumProps> = ({
  angles = [11, -2.1, 4.5, -2.2, 1.1, 0],
  step = 6,
  delay = 0,
  pivot = "50% 0%",
  style,
  children,
}) => {
  const f = useDrawingFrame();
  const a = keyframes(
    angles.map((v, i) => ({ at: delay + i * step, value: v, ease: sine })),
    f,
  );
  return (
    <div style={{ ...style, transformOrigin: pivot, transform: `rotate(${a}deg)` }}>{children}</div>
  );
};

export type PuppetLimbProps = {
  /** rotation pivot, e.g. "10% 50%" (shoulder) */
  pivot?: string;
  /** angle at the top of the raise (deg) */
  angle: number;
  delay?: number;
  /** frames: raise (ease-out) / hold / lower (ease-in) */
  raise?: number;
  hold?: number;
  lower?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Cut-out limb raise / hold / lower about a pivot (analysis/dracula.md §8 puppet limb). */
export const PuppetLimb: React.FC<PuppetLimbProps> = ({
  pivot = "0% 50%",
  angle,
  delay = 0,
  raise = 10,
  hold = 12,
  lower = 10,
  style,
  children,
}) => {
  const f = useDrawingFrame();
  const a = keyframes(
    [
      { at: delay, value: 0 },
      { at: delay + raise, value: angle, ease: "enter" as const },
      { at: delay + raise + hold, value: angle },
      { at: delay + raise + hold + lower, value: 0, ease: "exit" as const },
    ],
    f,
  );
  return <div style={{ ...style, transformOrigin: pivot, transform: `rotate(${a}deg)` }}>{children}</div>;
};

export type SwayProps = {
  /** peak offset px */
  x?: number;
  y?: number;
  /** peak rotation deg */
  rotate?: number;
  /** noise cycles per second */
  speed?: number;
  seed?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Idle drift from smooth noise ("holds are never dead"); stepped to drawings. */
export const Sway: React.FC<SwayProps> = ({ x = 6, y = 4, rotate = 0.6, speed = 0.4, seed = "sway", style, children }) => {
  const f = useDrawingFrame();
  const t = (f / 24) * speed;
  return (
    <div
      style={{
        ...style,
        transform: `translate(${noise2D(seed, t, 0) * x}px, ${noise2D(seed, t, 10) * y}px) rotate(${noise2D(seed, t, 20) * rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
};

export type BoilProps = {
  /** re-randomise every N frames (24-fps frames; explicit rate, so it counts raw frames) */
  every?: number;
  /** offset amplitude px */
  amp?: number;
  /** rotation amplitude deg */
  rotate?: number;
  seed?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Hand-drawn "boil": small deterministic offset that re-rolls every N frames. */
export const Boil: React.FC<BoilProps> = ({ every = 6, amp = 1.5, rotate = 0.3, seed = "boil", style, children }) => {
  const idx = Math.floor(useCurrentFrame() / every);
  return (
    <div
      style={{
        ...style,
        transform: `translate(${jitter(`${seed}x${idx}`, amp)}px, ${jitter(`${seed}y${idx}`, amp)}px) rotate(${jitter(`${seed}r${idx}`, rotate)}deg)`,
      }}
    >
      {children}
    </div>
  );
};
