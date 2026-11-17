import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { posterize } from "../../lib/time";
import { ease } from "../../tokens/easing";
import { SfxList, type SfxPlacement } from "./sfx";
import { FxLayer, clamp01, type FxState } from "./util";

/** Measured, analysis/earworm-D.md s8 + s12: outgoing zoom-blur 4 f on ones into a HARD cut; incoming starts dark and
 *  blurred and settles on twos over 7 drawings; sub-boom onset cut-8, PEAK on cut+1 (-13 dB over 15 f). */
export const BLUR_CUT = { blurFrames: 4, settleFrames: 14, boomPeakOffset: 1 } as const;

export const blurThroughCutPlan = (cut: number): { sfx: SfxPlacement[] } => ({
  sfx: [{ name: "sub_boom", peak: cut + BLUR_CUT.boomPeakOffset }],
});

export type BlurThroughCutProps = {
  /** the hard-cut frame (first frame of `incoming`), relative to the enclosing Sequence */
  at: number;
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
  blurFrames?: number;
  settleFrames?: number;
  /** render the matching sub-boom (default true) */
  sfx?: boolean;
};

export const BlurThroughCut: React.FC<BlurThroughCutProps> = ({
  at, outgoing, incoming, blurFrames = BLUR_CUT.blurFrames, settleFrames = BLUR_CUT.settleFrames, sfx = true,
}) => {
  const frame = useCurrentFrame();
  let fx: FxState = {};
  if (frame < at && frame >= at - blurFrames) {
    const t = ease("accelerate")(clamp01((frame - (at - blurFrames) + 1) / blurFrames)); // on ones
    fx = { scale: 1 + 0.3 * t, blur: 10 * t, radial: 0.3 * t };
  } else if (frame >= at && frame < at + settleFrames) {
    const g = posterize(frame - at, 25, 12);
    const t = clamp01(g / settleFrames);
    fx = { brightness: 0.35 + 0.65 * t, blur: 12 * (1 - t) ** 2 };
  }
  return (
    <AbsoluteFill>
      <FxLayer {...fx}>
        {frame < at ? <Sequence from={0} layout="none">{outgoing}</Sequence> : <Sequence from={at} layout="none">{incoming}</Sequence>}
      </FxLayer>
      {sfx && <SfxList items={blurThroughCutPlan(at).sfx} />}
    </AbsoluteFill>
  );
};
