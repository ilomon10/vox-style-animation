import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { posterize } from "../../lib/time";
import { SfxList, type SfxPlacement } from "./sfx";
import { FxLayer, clamp01 } from "./util";

/** Measured (earworm-D s7/s8): collage A rolls 0 -> 45 deg CW (accelerating, 16 f) and swaps at peak speed for collage B,
 *  already at -45 deg, which continues CW to 0 over 20 f. Whoosh PEAK on the swap frame. On twos. */
export const SPIN = { outFrames: 16, inFrames: 20, deg: 45 } as const;

export const spinSwapPlan = (swap: number): { sfx: SfxPlacement[] } => ({ sfx: [{ name: "whoosh", peak: swap }] });

export type SpinSwapProps = {
  /** swap frame (first frame of `incoming`), relative to the enclosing Sequence */
  at: number;
  /** both worlds must bleed past the frame (the rotation shows the corners): author them oversized */
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
  sfx?: boolean;
};

const accel = Easing.bezier(0.55, 0, 0.9, 0.7);
const decel = Easing.bezier(0.1, 0.35, 0.3, 1);

export const SpinSwap: React.FC<SpinSwapProps> = ({ at, outgoing, incoming, sfx = true }) => {
  const frame = useCurrentFrame();
  const g = posterize(frame, 25, 12);
  let rotate = 0;
  let blur = 0;
  if (g < at) {
    const t = clamp01((g - (at - SPIN.outFrames)) / SPIN.outFrames);
    rotate = SPIN.deg * accel(t);
    blur = 6 * t ** 3;
  } else {
    const t = clamp01((g - at) / SPIN.inFrames);
    rotate = -SPIN.deg * (1 - decel(t));
    blur = 6 * (1 - t) ** 3;
  }
  return (
    <AbsoluteFill>
      <FxLayer rotate={rotate} blur={blur}>
        {frame < at ? <Sequence from={0} layout="none">{outgoing}</Sequence> : <Sequence from={at} layout="none">{incoming}</Sequence>}
      </FxLayer>
      {sfx && <SfxList items={spinSwapPlan(at).sfx} />}
    </AbsoluteFill>
  );
};
