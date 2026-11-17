import React from "react";
import { Freeze, useCurrentFrame, useVideoConfig } from "remotion";
import { Paper } from "../../effects";

/** Dotted desk, big enough for every camera move; lives inside the CameraRig (world coordinates). */
export const Desk: React.FC<{ seed?: string }> = ({ seed = "desk" }) => (
  <div style={{ position: "absolute", left: -900, top: -700, width: 3800, height: 2600 }}>
    <Paper kind="dots" width={3800} height={2600} seed={seed} />
  </div>
);

/** Large soft world-space shadow in a corner (analysis/epigenetics.md: -50 % soft shadow, top-right). */
export const WorldShadow: React.FC<{ x: number; y: number; w: number; h: number; at?: string; a?: number }> = ({
  x, y, w, h, at = "100% 0%", a = 0.38,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: `radial-gradient(ellipse at ${at}, rgba(20,18,22,${a}) 0%, rgba(20,18,22,${a * 0.5}) 40%, rgba(20,18,22,0) 72%)` }} />
);

/** V-FRZ: everything under it holds the same drawing for the last `frames` of the shot. */
export const FreezeTail: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const at = durationInFrames - frames;
  return f >= at ? <Freeze frame={at}>{children}</Freeze> : <>{children}</>;
};
