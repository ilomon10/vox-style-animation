import React from "react";
import type { CueIndex } from "../../audio/cues";
import { useResolvedCues } from "../../audio/useCues";
import { rand } from "../../lib/random";
import { drawingIndex, useDrawingFrame } from "../../lib/time";
import { voxEarworm } from "../../tokens/colors";
import { useCurrentFrame, useVideoConfig } from "remotion";

/** earworm-C s14: a row of 8 indigo bokeh dots (pitch ≈188, y≈695, glow Ø≈110) that power on from x861 rightwards, then sprout vertical bars. */
export const BOKEH = {
  xs: [102, 285, 480, 670, 861, 1047, 1239, 1425, 1602, 1794],
  y: 695,
  glow: 110,
  /** power-on frames after `onAt`: [x, delay]: x861 0 · x1047/1239 +3 · x1425 +5 · x1794 +9 · far-left last +11 (earworm-C s14) */
  powerOn: { 861: 0, 1047: 3, 1239: 3, 1425: 5, 1794: 9, 1602: 7, 670: 4, 480: 6, 285: 8, 102: 11 } as Record<number, number>,
  bar: { w: 4, glow: 40, hMin: 150, hRange: 500 },
  rate: 12,
  /** picture lag against the band level, frames */
  lagF: 1,
  /** release per drawing */
  release: 0.75,
  maxBars: 3,
} as const;

/** Bars driven by a 1 s mean of the 150–400 Hz (low) band: p = clamp((E−lo)/(hi−lo), .1, .7); `lo`/`hi` in dBr. */
const pOn = (cues: CueIndex, f: number, lo: number, hi: number) => {
  let s = 0;
  for (let k = -12; k <= 12; k++) s += cues.levelAt(f + k, "low");
  return Math.min(0.7, Math.max(0.1, (s / 25 - lo) / (hi - lo)));
};

export type BokehVisualizerProps = {
  cues?: CueIndex;
  /** first frame (sequence-relative) the dots power on */
  onAt: number;
  /** first frame bars may fire (the first sung note gates them, earworm-C s14) */
  barsAt: number;
  /** band level range mapped to p (dBr of the cue file's "low" envelope) */
  lo?: number;
  hi?: number;
  seed?: string;
  /** frames to add to the sequence-relative frame before reading the cue envelope (the Sequence starts `cueOffset` after the audio) */
  cueOffset?: number;
  style?: React.CSSProperties;
};

export const BokehVisualizer: React.FC<BokehVisualizerProps> = ({ cues, onAt, barsAt, lo = -30, hi = -8, seed = "bokeh", cueOffset = 0, style }) => {
  const c = useResolvedCues(cues);
  const { fps } = useVideoConfig();
  const f = useDrawingFrame();
  const d = drawingIndex(useCurrentFrame(), fps, BOKEH.rate);
  const d0 = drawingIndex(barsAt, fps, BOKEH.rate);
  const barH = (col: number): number => {
    // newest onset within the last 8 drawings wins
    for (let e = d; e >= Math.max(d0, d - 8); e--) {
      const fe = (e * fps) / BOKEH.rate;
      const p = pOn(c, fe + cueOffset + BOKEH.lagF, lo, hi);
      const n = Math.min(BOKEH.maxBars, Math.round(p * 5));
      const rank = BOKEH.xs.map((_, i) => ({ i, r: rand(`${seed}-rank-${i}-${e}`) + (i === col && e === d - 1 ? 0 : 0) })).sort((a, b) => b.r - a.r).slice(0, n).map((x) => x.i);
      if (rank.includes(col) && !(rand(`${seed}-skip-${col}-${e}`) > p + 0.35)) {
        const u = rand(`${seed}-u-${col}-${e}`);
        const h0 = BOKEH.bar.hMin + BOKEH.bar.hRange * u * u;
        return h0 * Math.pow(BOKEH.release, d - e) * (1 + ((d - e) % 2 ? -0.25 : 0.25) * 0.5);
      }
    }
    return 0;
  };
  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {BOKEH.xs.map((x, i) => {
        if (f < onAt + (BOKEH.powerOn[x] ?? 0)) return null;
        const h = f >= barsAt ? barH(i) : 0;
        const g = BOKEH.glow;
        return (
          <React.Fragment key={x}>
            <div style={{ position: "absolute", left: x - g / 2, top: BOKEH.y - g / 2, width: g, height: g, borderRadius: g, background: `radial-gradient(circle, ${voxEarworm.glowCore} 0 9%, ${voxEarworm.glowBody} 22%, ${voxEarworm.glow}99 52%, transparent 72%)`, mixBlendMode: "screen" }} />
            {h > 60 && (
              <div style={{ position: "absolute", left: x - BOKEH.bar.w / 2, top: BOKEH.y - h / 2, width: BOKEH.bar.w, height: h, borderRadius: 3, background: voxEarworm.glowCore, boxShadow: `0 0 ${BOKEH.bar.glow / 2}px ${BOKEH.bar.glow / 3}px ${voxEarworm.glow}, 0 0 8px 2px ${voxEarworm.glowBody}` }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
