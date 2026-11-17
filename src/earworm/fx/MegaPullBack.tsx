import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { DESIGN_H, DESIGN_W } from "../../lib/stage";
import { posterize } from "../../lib/time";
import { CameraRig } from "../../motion/CameraRig";
import { clamp01 } from "./util";

/** Measured (earworm-D s7, f3052-3104): x0.160 (6.25x) in 52 f, log-scale progress with peak speed at 56 %, front-loaded
 *  ease cubic-bezier(0.70, 0.10, 0.45, 0.90), drawn at 12/s. The props slide in during the decelerating half. */
export const MEGA_PULL = { zoom: 6.25, frames: 52, curve: [0.7, 0.1, 0.45, 0.9] as const };
export const megaPullEase = Easing.bezier(...MEGA_PULL.curve);

export type MegaPullBackProps = {
  /** first frame of the pull-back (relative to the enclosing Sequence) */
  at: number;
  duration?: number;
  zoom?: number;
  /** world point (design px) filling the frame at the start; default frame centre */
  macro?: { x: number; y: number };
  /** world point (design px) at frame centre at the end (the collage centre) */
  center?: { x: number; y: number };
  /** the world, in design px; the render form gets the eased progress 0..1 and the frames since `at` (props slide in at p > 0.5) */
  children: React.ReactNode | ((p: number, rel: number) => React.ReactNode);
};

export const MegaPullBack: React.FC<MegaPullBackProps> = ({
  at, duration = MEGA_PULL.frames, zoom = MEGA_PULL.zoom, macro = { x: DESIGN_W / 2, y: DESIGN_H / 2 }, center = { x: DESIGN_W / 2, y: DESIGN_H / 2 }, children,
}) => (
  <Sequence from={at} layout="none">
    <Inner duration={duration} zoom={zoom} macro={macro} center={center}>{children}</Inner>
  </Sequence>
);

const Inner: React.FC<Required<Pick<MegaPullBackProps, "duration" | "zoom" | "macro" | "center">> & { children: MegaPullBackProps["children"] }> = ({
  duration, zoom, macro, center, children,
}) => {
  const rel = useCurrentFrame();
  const p = megaPullEase(clamp01(posterize(rel, 25, 12) / duration));
  return (
    <AbsoluteFill>
      <CameraRig
        keys={[
          { at: 0, x: macro.x, y: macro.y, scale: zoom },
          { at: duration, x: center.x, y: center.y, scale: 1, ease: megaPullEase },
        ]}
      >
        {typeof children === "function" ? children(p, rel) : children}
      </CameraRig>
    </AbsoluteFill>
  );
};
