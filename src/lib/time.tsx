import React, { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * DRAWING RATE — the single most important motion trait of the style.
 *
 * Every reference animates its graphics at 12 drawings per second, independent of the
 * delivery frame rate (measured, see docs/style-guide/06-motion-language.md):
 *   - dark collage (24 fps)  → on twos            (0,0,2,2,4,4,…)
 *   - Vox explainer (23.976) → on twos
 *   - paper desk (30 fps)    → 12 fps conformed to 30: holds alternate 3,2,3,2 frames
 * Live footage, caption fades, a few zoom-throughs and the final fade run "on ones".
 *
 * Usage
 *   const f = useDrawingFrame();          // posterized frame inside the current <Sequence>
 *   interpolate(f, [0, 12], [0, 1], …)    // timings are still written in frames
 *   <OnOnes>…</OnOnes>                    // opt a subtree out (footage, fades)
 *   <DrawingRate rate={6}>…</DrawingRate> // e.g. title boil, hold boil
 *
 * Because useCurrentFrame() is relative to the enclosing <Sequence>, the drawing grid
 * restarts at every shot — exactly like the references (parity resets at each cut).
 */
export const DEFAULT_DRAWING_RATE = 12;

const DrawingRateContext = createContext<number | null>(null);

/** Posterize `frame` (at `fps`) to a grid of `rate` drawings per second. Returns the
 *  (possibly fractional) frame time at which the current drawing was made. */
export const posterize = (frame: number, fps: number, rate: number): number => {
  if (!rate || rate >= fps) return frame;
  const step = Math.floor((frame * rate) / fps + 1e-9);
  return (step * fps) / rate;
};

/** Index of the current drawing (0,1,2,…) — use it as a seed for per-drawing randomness. */
export const drawingIndex = (frame: number, fps: number, rate: number): number => {
  if (!rate || rate >= fps) return frame;
  return Math.floor((frame * rate) / fps + 1e-9);
};

export const useDrawingRate = (): number => {
  const ctx = useContext(DrawingRateContext);
  const { fps } = useVideoConfig();
  return ctx ?? Math.min(DEFAULT_DRAWING_RATE, fps);
};

/** Posterized frame for the current drawing rate (default 12 drawings/s). */
export const useDrawingFrame = (rateOverride?: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rate = useDrawingRate();
  return posterize(frame, fps, rateOverride ?? rate);
};

/** Index of the current drawing for the current drawing rate. */
export const useDrawingIndex = (rateOverride?: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rate = useDrawingRate();
  return drawingIndex(frame, fps, rateOverride ?? rate);
};

export const DrawingRate: React.FC<{ rate: number; children: React.ReactNode }> = ({ rate, children }) => (
  <DrawingRateContext.Provider value={rate}>{children}</DrawingRateContext.Provider>
);

/** Opt a subtree out of stepping (live footage, caption fades, final fade). */
export const OnOnes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fps } = useVideoConfig();
  return <DrawingRateContext.Provider value={fps}>{children}</DrawingRateContext.Provider>;
};

/** seconds → frames at the composition fps */
export const useSec = () => {
  const { fps } = useVideoConfig();
  return (seconds: number) => Math.round(seconds * fps);
};

/**
 * Convert a duration measured in frames at a reference fps (the token tables are written
 * at 24 fps unless noted) to the composition fps, so a 12-frame @24 move stays 0.5 s at 30 fps.
 */
export const useFrames = () => {
  const { fps } = useVideoConfig();
  return (framesAt24: number, refFps = 24) => Math.round((framesAt24 * fps) / refFps);
};
