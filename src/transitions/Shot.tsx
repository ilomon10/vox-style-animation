import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_H, DESIGN_W } from "../lib/stage";
import { useDrawingFrame } from "../lib/time";
import { MotionTrail, RadialBlur } from "../motion/blur";
import { Fx, FxState } from "./effects";

export type ShotProps = {
  /** effect(s) applied over the first N frames of the shot */
  head?: Fx | Fx[];
  /** effect(s) applied over the last N frames of the shot */
  tail?: Fx | Fx[];
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const arr = (v?: Fx | Fx[]) => (v ? (Array.isArray(v) ? v : [v]) : []);

/**
 * Wraps a shot (use inside <Series.Sequence>/<Sequence>) and applies head/tail transition effects.
 * Cuts stay HARD: the motion is wrapped around the cut, not a cross-dissolve. The shot's length is
 * the enclosing Sequence's duration. Effects are stepped to drawings unless they are `onOnes`.
 */
export const Shot: React.FC<ShotProps> = ({ head, tail, style, children }) => {
  const frame = useCurrentFrame();
  const drawn = useDrawingFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = 24 / fps; // frames → frames@24
  const stepFrames = fps / 12;

  let scale = 1, x = 0, y = 0, brightness = 1, blur = 0, tdx = 0, tdy = 0, radial = 0;
  let origin = { x: DESIGN_W / 2, y: DESIGN_H / 2 };

  const apply = (fx: Fx, isHead: boolean) => {
    const n = fx.frames;
    const tailStart = durationInFrames - n / k;
    const active = isHead ? frame * k < n : frame >= tailStart;
    if (!active) return;
    const f = fx.onOnes ? frame : drawn;
    const step = fx.onOnes ? 1 : stepFrames;
    const t = Math.min(n, Math.max(0, ((isHead ? f : f - tailStart) * k)));
    const s = { scale: 1, x: 0, y: 0, brightness: 1, blur: 0, ...fx.at(t, n) } satisfies FxState;
    // velocity: head = forward difference (motion about to happen), tail = backward (motion just made)
    const t2 = Math.min(n, Math.max(0, t + (isHead ? step : -step) * k));
    const s2 = { scale: 1, x: 0, y: 0, brightness: 1, blur: 0, ...fx.at(t2, n) };
    scale *= s.scale;
    x += s.x;
    y += s.y;
    brightness *= s.brightness;
    blur += s.blur;
    if (fx.trail) {
      const sg = isHead ? 1 : -1;
      tdx += sg * (s2.x - s.x);
      tdy += sg * (s2.y - s.y);
    }
    if (fx.radial) radial += fx.radial * Math.abs(Math.log(s2.scale) - Math.log(s.scale));
    if (fx.origin) origin = fx.origin;
  };
  arr(head).forEach((fx) => apply(fx, true));
  arr(tail).forEach((fx) => apply(fx, false));

  const filters: string[] = [];
  if (Math.abs(brightness - 1) > 1e-4) filters.push(`brightness(${brightness})`);
  if (blur > 0.05) filters.push(`blur(${blur}px)`);

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${origin.x}px ${origin.y}px`,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          filter: filters.length ? filters.join(" ") : undefined,
        }}
      >
        <RadialBlur strength={radial} origin={origin}>
          <MotionTrail dx={tdx} dy={tdy} count={8}>
            {children}
          </MotionTrail>
        </RadialBlur>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
