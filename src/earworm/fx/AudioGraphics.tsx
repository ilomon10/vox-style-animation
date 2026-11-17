import React from "react";
import { Easing, useCurrentFrame, useVideoConfig } from "remotion";
import type { CueIndex } from "../../audio/cues";
import { useResolvedCues } from "../../audio/useCues";
import { rand } from "../../lib/random";
import { drawingIndex, useDrawingFrame } from "../../lib/time";
import { voxEarworm } from "../../tokens/colors";
import { clamp01 } from "./util";

/** Visualizer palette (earworm-C s14): core / body / glow. */
export const VIS = { core: voxEarworm.glowCore, body: voxEarworm.glowBody, glow: voxEarworm.glow } as const;

/** Measured behaviour of the audio graphics (earworm-D s14). */
export const SPECTRUM = {
  /** 9 columns at x 57 + 160 i, active 100-1000 px centred on y 700, idle dot 65 px */
  columns: 9, x0: 57, pitch: 160, centerY: 700, idle: 65, minH: 100, maxH: 1000,
  /** bars wake when the full-mix level is >= -12 dBr (83 % active above, 8 % below) */
  gateDb: -12,
  /** the picture LEADS the audio by 2 f (best fit) */
  lookAhead: 2,
  /** posterised to 12 drawings/s */
  rate: 12,
  /** R->L wipe-on 3200 px/s (10 f across the row) */
  wipePxPerSec: 3200,
} as const;

/** Heights (px) of the 9 spectrum bars for frame `f` (audio-start-relative): per-bar random x full-mix envelope. */
export const spectrumHeights = (cues: CueIndex, f: number, seed = "spec", drawing = Math.round(f)): number[] => {
  const level = cues.levelAt(f + SPECTRUM.lookAhead, "total");
  if (level < SPECTRUM.gateDb) return Array(SPECTRUM.columns).fill(SPECTRUM.idle);
  const env = clamp01(0.45 + (level - SPECTRUM.gateDb) / 18);
  return Array.from({ length: SPECTRUM.columns }, (_, i) => {
    const r = rand(`${seed}-${i}-${drawing}`);
    return SPECTRUM.minH + (SPECTRUM.maxH - SPECTRUM.minH) * clamp01(r * env);
  });
};

const glowStack = (w: number, h: number, round: boolean): React.CSSProperties => ({
  width: w, height: h, borderRadius: round ? w : 6, background: VIS.core,
  boxShadow: `0 0 0 ${w * 0.16}px ${VIS.body}, 0 0 ${w * 0.9}px ${w * 0.5}px ${VIS.glow}`,
});

/** Spectrum bars: gate -12 dBr, per-bar random heights x full-mix envelope, 2 f look-ahead, 12 drawings/s.
 *  Mount in a Sequence that starts where the audio starts. Design px, absolute (place in a 1920x1080 DesignSpace). */
export const SpectrumBars: React.FC<{ cues?: CueIndex; seed?: string; wipeOnAt?: number; style?: React.CSSProperties }> = ({
  cues, seed = "spec", wipeOnAt, style,
}) => {
  const c = useResolvedCues(cues);
  const { fps } = useVideoConfig();
  const f = useDrawingFrame(); // 12/s grid
  const idx = drawingIndex(useCurrentFrame(), fps, SPECTRUM.rate);
  const h = spectrumHeights(c, f, seed, idx);
  const wipeX = wipeOnAt === undefined ? -1e9 : 1341 + 57 - ((f - wipeOnAt) / fps) * SPECTRUM.wipePxPerSec;
  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {h.map((hh, i) => {
        const x = SPECTRUM.x0 + SPECTRUM.pitch * i;
        if (wipeOnAt !== undefined && x < wipeX) return null;
        const idle = hh <= SPECTRUM.idle;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: SPECTRUM.centerY - hh / 2 }}>
            <div style={glowStack(SPECTRUM.idle, hh, idle)} />
          </div>
        );
      })}
    </div>
  );
};

/** Kick oscilloscope (earworm-D s14): idle wobble +-5-15 px; spikes of 75-600 px peak-to-peak on the frame the low band
 *  rises >= 8 dB (0 f lag), held 2 f. Runs on ones (the spike is a drawing of 2-3 f). */
export const KICK = { riseDb: 8, holdFrames: 2, minP2P: 75, maxP2P: 600, wobble: [5, 15] as const };

/** Spike info at `f`: the most recent kick frame within the hold and its peak-to-peak amplitude, else null. */
export const kickSpike = (cues: CueIndex, f: number, riseDb: number = KICK.riseDb) => {
  for (let g = f; g > f - KICK.holdFrames; g--) {
    const rise = cues.levelAt(g, "low") - cues.levelAt(g - 1, "low");
    if (rise >= riseDb) return { frame: g, p2p: KICK.minP2P + (KICK.maxP2P - KICK.minP2P) * clamp01((rise - riseDb) / 16) };
  }
  return null;
};

export const KickScope: React.FC<{ cues?: CueIndex; width?: number; height?: number; riseDb?: number; seed?: string; style?: React.CSSProperties }> = ({
  cues, width = 1500, height = 700, riseDb, seed = "scope", style,
}) => {
  const c = useResolvedCues(cues);
  const f = useCurrentFrame();
  const spike = kickSpike(c, f, riseDb);
  const wobbleIdx = drawingIndex(f, 25, 12);
  const n = 120;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const x = (i / n) * width;
    const wob = KICK.wobble[0] + (KICK.wobble[1] - KICK.wobble[0]) * rand(`${seed}-a${wobbleIdx}`);
    let y = height / 2 + Math.sin(i * 0.9 + wobbleIdx * 1.7) * wob * 0.6 + (rand(`${seed}-w${wobbleIdx}-${i}`) - 0.5) * wob;
    if (spike) y += (i % 2 ? 1 : -1) * 0.5 * spike.p2p * (0.3 + 0.7 * rand(`${seed}-s${spike.frame}-${i}`)) * Math.sin((Math.PI * i) / n);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible", ...style }}>
      <polyline points={pts.join(" ")} fill="none" stroke={VIS.glow} strokeWidth={22} strokeLinejoin="round" opacity={0.8} style={{ filter: "blur(10px)" }} />
      <polyline points={pts.join(" ")} fill="none" stroke={VIS.core} strokeWidth={6} strokeLinejoin="miter" />
    </svg>
  );
};

/** VU needle (earworm-D s7): KEYFRAMED, not audio-driven. 20 f swing cubic-bezier(0.40, 0, 0.65, 1) from rest -35.5 deg to
 *  +51 deg peaking on a stressed word (`peakAt`), then back to +28 in 12 f. On ones (needle footage). */
export const NEEDLE = { rest: -35.5, peak: 51, settle: 28, swing: 20, back: 12, curve: [0.4, 0, 0.65, 1] as const };
const needleEase = Easing.bezier(...NEEDLE.curve);
export const needleAngle = (f: number, peakAt: number) => {
  const a = peakAt - NEEDLE.swing;
  if (f <= a) return NEEDLE.rest;
  if (f <= peakAt) return NEEDLE.rest + (NEEDLE.peak - NEEDLE.rest) * needleEase((f - a) / NEEDLE.swing);
  return NEEDLE.peak + (NEEDLE.settle - NEEDLE.peak) * needleEase(Math.min(1, (f - peakAt) / NEEDLE.back));
};

export const NeedleMeter: React.FC<{ peakAt: number; size?: number; style?: React.CSSProperties }> = ({ peakAt, size = 560, style }) => {
  const f = useCurrentFrame();
  const a = needleAngle(f, peakAt);
  const w = size, h = size * 0.62;
  const cx = w / 2, cy = h * 1.02, r = h * 0.95;
  const pt = (deg: number, rad: number) => [cx + Math.sin((deg * Math.PI) / 180) * rad, cy - Math.cos((deg * Math.PI) / 180) * rad];
  const ticks = Array.from({ length: 13 }, (_, i) => -50 + i * (110 / 12));
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "hidden", ...style }}>
      <rect width={w} height={h} fill={voxEarworm.groundScrap} />
      {ticks.map((d, i) => {
        const [x1, y1] = pt(d, r * 0.82), [x2, y2] = pt(d, r * (i % 3 === 0 ? 0.96 : 0.9));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={d > 30 ? voxEarworm.accent : voxEarworm.offWhite} strokeWidth={i % 3 === 0 ? 4 : 2} />;
      })}
      <line x1={cx} y1={cy} x2={pt(a, r * 0.98)[0]} y2={pt(a, r * 0.98)[1]} stroke={voxEarworm.whitePaper} strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={h * 0.06} fill={voxEarworm.slip2} />
    </svg>
  );
};
