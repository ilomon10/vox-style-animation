import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_H, DESIGN_W } from "../lib/stage";
import { useDrawingFrame } from "../lib/time";
import { EaseSpec, keyframes } from "./keyframes";

/** Camera key. x/y = WORLD point at frame centre, scale = zoom, rotate = world roll in degrees
 *  (positive = world turns clockwise). `ease` shapes the move that arrives at this key. */
export type CameraKey = { at: number; x: number; y: number; scale?: number; rotate?: number; ease?: EaseSpec };

/** Continuous drift applied after the last key (Vox: "holds are never dead", 1–5 %/s zoom or a few px/s). */
export type CameraDrift = {
  /** px/s in world space */
  vx?: number;
  vy?: number;
  /** fractional zoom per second (0.03 = +3 %/s, compounding) */
  zoomPerSec?: number;
  /** frame drift starts (default: the last key's `at`). Use 0 to drift under the keyed moves too. */
  from?: number;
};

/** Pure camera sampler (exported so shots/tests can read the pose without rendering). */
export const sampleCamera = (keys: readonly CameraKey[], frame: number, fps: number, drift?: CameraDrift) => {
  const pose = keyframes(
    keys.map((k) => ({ at: k.at, ease: k.ease, value: { x: k.x, y: k.y, scale: k.scale ?? 1, rotate: k.rotate ?? 0 } })),
    frame,
    { logScale: true },
  );
  if (drift) {
    const from = drift.from ?? Math.max(...keys.map((k) => k.at));
    const dt = Math.max(0, frame - from) / fps;
    pose.x += (drift.vx ?? 0) * dt;
    pose.y += (drift.vy ?? 0) * dt;
    pose.scale *= Math.pow(1 + (drift.zoomPerSec ?? 0), dt);
  }
  return pose;
};

export type CameraRigProps = {
  /** keys in frames relative to the enclosing Sequence. A shot that starts on a moving camera
   *  puts key 0 at frame 0 and eases to key 1 with `settle` (decelerating, non-zero start velocity). */
  keys: CameraKey[];
  drift?: CameraDrift;
  /** step the camera to the 12 drawings/s grid (default true — the camera is drawn like everything else) */
  stepped?: boolean;
  /** rendered camera moves / live footage: run on ones (overrides `stepped`) */
  onOnes?: boolean;
  children: React.ReactNode;
};

/**
 * Children are laid out in WORLD coordinates (design px; position them absolutely at world x/y).
 * The rig translates/zooms/rolls the world so the key point sits at the centre of the 1920×1080 frame.
 */
export const CameraRig: React.FC<CameraRigProps> = ({ keys, drift, stepped = true, onOnes = false, children }) => {
  const drawn = useDrawingFrame();
  const raw = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = stepped && !onOnes ? drawn : raw;
  const p = sampleCamera(keys, frame, fps, drift);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: DESIGN_W,
          height: DESIGN_H,
          transformOrigin: "0 0",
          transform: `translate(${DESIGN_W / 2}px, ${DESIGN_H / 2}px) rotate(${p.rotate}deg) scale(${p.scale}) translate(${-p.x}px, ${-p.y}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
