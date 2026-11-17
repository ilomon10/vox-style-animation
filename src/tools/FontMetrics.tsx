import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { FONTS } from "../tokens/fonts";

/** Measurement rig: frame 2i renders "H", frame 2i+1 renders "x" for font i at 1000 px.
 *  tools/analysis/font_metrics.py reads the PNGs and writes cap/x-height ratios. */
const KEYS = Object.keys(FONTS) as (keyof typeof FONTS)[];
const Rig: React.FC = () => {
  const f = useCurrentFrame();
  const key = KEYS[Math.floor(f / 2)];
  const ch = f % 2 === 0 ? "H" : "x";
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <div style={{ position: "absolute", left: 200, top: 100, fontFamily: FONTS[key], fontSize: 1000, lineHeight: 1, color: "#000" }}>
        {ch}
      </div>
    </AbsoluteFill>
  );
};
registerRoot(() => (
  <Composition id="FontMetrics" component={Rig} width={1600} height={1400} fps={30} durationInFrames={KEYS.length * 2} />
));
