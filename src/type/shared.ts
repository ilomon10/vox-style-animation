import React, { useLayoutEffect, useState } from "react";
import { interpolate, useVideoConfig } from "remotion";
import { ease, type CurveName } from "../tokens/easing";

/**
 * Chrome >= 133 `text-box`: trims a block to the CAP-HEIGHT box (top = cap line, bottom = baseline),
 * so padding / band heights can be specified in cap units exactly like the measurements.
 */
export const capTrim: React.CSSProperties = { textBox: "trim-both cap alphabetic" } as React.CSSProperties;

/** 0→1 progress of `f` between `start` and `start+dur` with a token curve (clamped). */
export const prog = (f: number, start: number, dur: number, curve: CurveName | ((t: number) => number) = "linear"): number =>
  interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: typeof curve === "string" ? ease(curve) : curve,
  });

/** seconds → frames at the composition fps */
export const useSecToFrames = () => {
  const { fps } = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/** frames measured at `refFps` → frames at the composition fps */
export const useRefFrames = () => {
  const { fps } = useVideoConfig();
  return (f: number, refFps: number) => Math.round((f * fps) / refFps);
};

/** Natural width (design px) of an element, re-measured once web fonts are ready. */
export const useInlineWidth = (ref: React.RefObject<HTMLElement | null>): number => {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) setW((prev) => (prev !== ref.current!.offsetWidth ? ref.current!.offsetWidth : prev));
    };
    measure();
    document.fonts?.ready.then(measure);
  });
  return w;
};

/** Split into user-perceived glyphs (keeps surrogate pairs together). */
export const glyphs = (s: string): string[] => Array.from(s);

/** approx. normal(0,1) from three uniforms (deterministic input) */
export const gauss = (r1: number, r2: number, r3: number) => (r1 + r2 + r3 - 1.5) * 2;
