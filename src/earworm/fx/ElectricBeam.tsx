import React from "react";
import { rand } from "../../lib/random";
import { useDrawingFrame, useDrawingIndex } from "../../lib/time";
import { voxEarworm } from "../../tokens/colors";
import { clamp01 } from "./util";

export type ElectricBeamProps = {
  /** frame the glow starts (sequence-relative) */
  at: number;
  /** frame the keyed source ends: the beam dims 3 f later (earworm-B §14, rule 14) */
  until: number;
  /** attack length in frames (19 measured) */
  attackF?: number;
  /** release length in frames */
  releaseF?: number;
  /** centre line, design px */
  y?: number;
  /** x range of the beam, design px (default the full frame) */
  x0?: number;
  x1?: number;
  /** wiggle amplitude (y std 4 → 19 px) */
  amp?: [number, number];
  seed?: string;
};

/**
 * Electric beam keyed to an archival vocal: a horizontal plasma line with a periwinkle core and a soft glow ±60–80 px,
 * re-randomised every drawing. An ENVELOPE (attack → hold → release, release 3 f after the source ends), not an FFT
 * visualiser (analysis/earworm-B.md §14). Additive: stack it BELOW the cut-outs.
 */
export const ElectricBeam: React.FC<ElectricBeamProps> = ({
  at, until, attackF = 19, releaseF = 4, y = 525, x0 = 0, x1 = 1920, amp = [4, 19], seed = "beam",
}) => {
  const f = useDrawingFrame();
  const di = useDrawingIndex();
  const rel = f - at;
  if (rel < 0) return null;
  const rel2 = f - (until + 3);
  const level = Math.min(clamp01((rel + 1) / attackF) ** 0.7, rel2 > 0 ? 1 - clamp01(rel2 / releaseF) : 1);
  if (level <= 0.01) return null;
  const a = amp[0] + (amp[1] - amp[0]) * level;
  const n = 48;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const env = Math.sin(Math.min(1, t * 8) * Math.PI / 2) * Math.sin(Math.min(1, (1 - t) * 8) * Math.PI / 2);
    const dy = (rand(`${seed}-${di}-${i}`) * 2 - 1) * a * (0.35 + 0.65 * rand(`${seed}-e${di}-${i >> 2}`)) * (0.4 + 0.6 * env);
    return `${x0 + (x1 - x0) * t},${y + dy}`;
  }).join(" ");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: "screen", opacity: level }}>
      <polyline points={pts} fill="none" stroke={voxEarworm.glowBody} strokeWidth={170} strokeOpacity={0.8} strokeLinejoin="round" style={{ filter: "blur(34px)" }} />
      <polyline points={pts} fill="none" stroke="#5560E8" strokeWidth={56} strokeOpacity={0.95} strokeLinejoin="round" style={{ filter: "blur(11px)" }} />
      <polyline points={pts} fill="none" stroke="#B4BAFF" strokeWidth={12} strokeLinejoin="round" style={{ filter: "blur(2px)" }} />
      <polyline points={pts} fill="none" stroke="#EEF0FF" strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
};
