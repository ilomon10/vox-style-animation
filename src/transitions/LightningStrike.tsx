import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { useDrawingFrame } from "../lib/time";

export type LightningStrikeProps = {
  /** frame (relative to the enclosing Sequence) of strike 1 */
  at: number;
  /** bolt artwork, shown from 4 f BEFORE strike 1 until the second strike has decayed */
  bolt?: React.ReactNode;
  children: React.ReactNode;
};

// analysis/dracula.md §8: strike 1 gain ×1.8 + blur σ20, decaying 1.37 → 1.15 → 1.06 → 1 (2 f each);
// strike 2 eight frames later, ×1.44 + offset + blur 24, same decay shape. Shape = (gain−1)/(peak−1).
const DECAY = [1, 0.46, 0.19, 0.075, 0];

/** Mid-shot lightning: CSS brightness/blur on a wrapper (own minimal wrapper, no Exposure dependency). */
export const LightningStrike: React.FC<LightningStrikeProps> = ({ at, bolt, children }) => {
  const f = useDrawingFrame();
  const { fps } = useVideoConfig();
  const k = fps / 24;
  const shape = (start: number) => {
    const i = Math.floor((f - start) / (2 * k));
    return f < start || i < 0 ? 0 : (DECAY[i] ?? 0);
  };
  const s1 = shape(at);
  const s2 = shape(at + 8 * k);
  const gain = 1 + 0.8 * s1 + 0.44 * s2;
  const blur = 20 * s1 + 24 * s2;
  const showBolt = f >= at - 4 * k && f < at + 8 * k + 8 * k;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `translate(${14 * s2}px, ${-8 * s2}px)`,
          filter: gain > 1.001 || blur > 0.05 ? `brightness(${gain}) blur(${blur}px)` : undefined,
        }}
      >
        {children}
        {showBolt ? bolt : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
