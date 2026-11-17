import React, { useMemo } from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio, type AudioData } from "@remotion/media-utils";
import { useDrawingFrame } from "../lib/time";
import { rand } from "../lib/random";
import { voxExplainer } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { typeStyle, voxType, type TypeRole } from "../tokens/type";
import type { CueIndex } from "./cues";
import { AUDIO_DEFAULTS } from "./defaults";
import { useBeatPulse } from "./schedule";
import { useResolvedCues } from "./useCues";

const resolve = (src: string) => (/^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src));
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** frame the visual samples: posterized to the drawing grid unless onOnes (CONVENTIONS rule 2) */
const useVisFrame = (onOnes?: boolean) => {
  const raw = useCurrentFrame();
  const grid = useDrawingFrame();
  return onOnes ? raw : grid;
};

export type AudioBarsProps = {
  /** audio file (public/ path or URL): real FFT via @remotion/media-utils. Omit to derive bars from `cues`. */
  src?: string;
  cues?: CueIndex;
  bars?: number;
  width?: number;
  height?: number;
  color?: string;
  /** bar gap as a fraction of the pitch */
  gap?: number;
  onOnes?: boolean;
  style?: React.CSSProperties;
};

/** Flat ink EQ bars (square caps, no glow). Real spectrum when `src` is given, else low/mid/high cue levels. */
export const AudioBars: React.FC<AudioBarsProps> = ({
  src, cues, bars = AUDIO_DEFAULTS.barCount, width = 600, height = 220, color = voxExplainer.ink, gap = 0.3, onOnes, style,
}) => {
  const f = useVisFrame(onOnes);
  const { fps } = useVideoConfig();
  const ctx = cues ?? undefined;
  return src ? (
    <SpectrumBars src={src} f={f} fps={fps} bars={bars} width={width} height={height} color={color} gap={gap} style={style} />
  ) : (
    <CueBars cues={ctx} f={f} bars={bars} width={width} height={height} color={color} gap={gap} style={style} />
  );
};

type BarsInner = { f: number; bars: number; width: number; height: number; color: string; gap: number; style?: React.CSSProperties };
const drawBars = (v: number[], p: BarsInner) => {
  const pitch = p.width / v.length;
  return (
    <svg width={p.width} height={p.height} style={{ display: "block", ...p.style }}>
      {v.map((x, i) => (
        <rect key={i} x={i * pitch} width={pitch * (1 - p.gap)} y={p.height - Math.max(4, x * p.height)} height={Math.max(4, x * p.height)} fill={p.color} />
      ))}
    </svg>
  );
};

const SpectrumBars: React.FC<BarsInner & { src: string; fps: number }> = (p) => {
  const data = useAudioData(resolve(p.src));
  if (!data) return null;
  const n = 64; // visualizeAudio needs a power of two; use the lower (louder) half of the spectrum
  const raw = visualizeAudio({ fps: p.fps, frame: Math.round(p.f), audioData: data, numberOfSamples: n, optimizeFor: "speed" });
  const useN = n / 2;
  const v = Array.from({ length: p.bars }, (_, i) => {
    const j = Math.min(useN - 1, Math.floor(Math.pow(i / p.bars, 1.6) * useN)); // log-ish: more bars on the low end
    return clamp01(Math.pow(raw[j], 0.5) * 1.4);
  });
  return drawBars(v, p);
};

const CueBars: React.FC<BarsInner & { cues?: CueIndex }> = ({ cues, ...p }) => {
  const c = useResolvedCues(cues);
  const v = Array.from({ length: p.bars }, (_, i) => {
    const x = i / (p.bars - 1);
    const lo = c.level01At(p.f, "low"), mid = c.level01At(p.f, "mid"), hi = c.level01At(p.f, "high");
    const base = x < 0.5 ? lo + (mid - lo) * (x / 0.5) : mid + (hi - mid) * ((x - 0.5) / 0.5);
    return clamp01(base * (0.75 + 0.25 * rand(`bars-${i}-${Math.round(p.f)}`)));
  });
  return drawBars(v, p);
};

export type WaveformProps = {
  src?: string;
  cues?: CueIndex;
  mode?: "scrolling" | "static";
  width?: number;
  height?: number;
  /** scrolling window length, seconds */
  windowS?: number;
  color?: string;
  playheadColor?: string;
  onOnes?: boolean;
  style?: React.CSSProperties;
};

/** Ink waveform strip (peak columns). Real samples when `src` is given, else the cue loudness envelope. */
export const Waveform: React.FC<WaveformProps> = (p) => (p.src ? <WaveWithData {...p} src={p.src} /> : <WaveInner {...p} data={null} />);
const WaveWithData: React.FC<WaveformProps & { src: string }> = (p) => <WaveInner {...p} data={useAudioData(resolve(p.src))} />;

const WaveInner: React.FC<WaveformProps & { data: AudioData | null }> = (p) => {
  const { data } = p;
  const { fps } = useVideoConfig();
  const f = useVisFrame(p.onOnes);
  const { width = 800, height = 140, mode = "scrolling", color = voxExplainer.ink, playheadColor = voxExplainer.markerRing } = p;
  const cues = p.cues;
  const cols = Math.round(width / 5);
  const win = p.windowS ?? AUDIO_DEFAULTS.waveWindowS;
  const t = f / fps;
  const [t0, t1] = mode === "static" ? [0, data ? data.durationInSeconds : cues ? cues.durationInFrames / fps : 1] : [t - win / 2, t + win / 2];

  const peaks = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < cols; i++) {
      const a = t0 + ((t1 - t0) * i) / cols, b = t0 + ((t1 - t0) * (i + 1)) / cols;
      if (b < 0 || a > t1) { out.push(0); continue; }
      if (data) {
        const s = data.channelWaveforms[0];
        const i0 = Math.max(0, Math.floor(a * data.sampleRate)), i1 = Math.min(s.length, Math.ceil(b * data.sampleRate));
        const step = Math.max(1, Math.floor((i1 - i0) / 64));
        let m = 0;
        for (let j = i0; j < i1; j += step) m = Math.max(m, Math.abs(s[j]));
        out.push(m);
      } else if (cues) {
        out.push(cues.level01At(Math.round(((a + b) / 2) * fps)));
      } else out.push(0);
    }
    return out;
  }, [data, cues, t0, t1, cols, fps]);

  if (p.src && !data) return null;
  const pitch = width / cols;
  return (
    <svg width={width} height={height} style={{ display: "block", ...p.style }}>
      {peaks.map((m, i) => {
        const h = Math.max(2, m * height);
        return <rect key={i} x={i * pitch} y={(height - h) / 2} width={pitch * 0.7} height={h} fill={color} />;
      })}
      {mode === "scrolling" ? <rect x={width / 2 - 2} y={0} width={4} height={height} fill={playheadColor} /> : (
        <rect x={((t - t0) / (t1 - t0)) * width - 2} y={0} width={4} height={height} fill={playheadColor} />
      )}
    </svg>
  );
};

export type PulseOnBeatProps = {
  children: React.ReactNode;
  cues?: CueIndex;
  /** scale added at pulse = 1 (default AUDIO_DEFAULTS.pulseScale) */
  scale?: number;
  /** brightness added at pulse = 1 */
  brightness?: number;
  decay?: number;
  downbeats?: boolean;
  lead?: number;
  onOnes?: boolean;
  style?: React.CSSProperties;
};

/** Scales + brightens its children on each beat. No glow or opacity: scale/filter only. */
export const PulseOnBeat: React.FC<PulseOnBeatProps> = ({
  children, cues, scale = AUDIO_DEFAULTS.pulseScale, brightness = AUDIO_DEFAULTS.pulseBrightness, decay, downbeats, lead, onOnes, style,
}) => {
  const p = useBeatPulse({ cues, decay, downbeats, lead, onOnes });
  return (
    <div style={{ transform: `scale(${1 + scale * p})`, filter: `brightness(${1 + brightness * p})`, ...style }}>{children}</div>
  );
};

export type LyricLineProps = {
  cues?: CueIndex;
  role?: TypeRole;
  /** frames to keep a finished phrase on screen before it is replaced / removed */
  hold?: number;
  /** highlight colour behind the word being spoken */
  highlight?: string;
  style?: React.CSSProperties;
};

/**
 * Shows the current phrase; each word rises out of a baseline mask when it is spoken/sung (ease `enter`) and the
 * word being spoken sits on a yellow box. Words appear on the drawing grid (timing from the cue file).
 */
export const LyricLine: React.FC<LyricLineProps> = ({
  cues, role = voxType.title, hold, highlight = voxExplainer.sticky, style,
}) => {
  const c = useResolvedCues(cues);
  const { fps } = useVideoConfig();
  const f = useDrawingFrame();
  const phrase = c.phraseAt(f);
  if (!phrase) return null;
  const holdF = hold ?? Math.round(1.0 * fps);
  if (f > phrase.frame_end + holdF) return null;
  const lh = (role.leading ?? 1.15) * 1.15;
  const rise = Math.max(1, Math.round(0.35 * fps)); // ≈ DUR.titleRise-ish, placeholder
  return (
    <div style={{ ...typeStyle(role), display: "flex", gap: "0.3em", ...style }}>
      {c.words.slice(phrase.word_start, phrase.word_end + 1).map((w, i) => {
        const p = ease("enter")(clamp01((f - w.frame_start) / rise));
        const active = f >= w.frame_start && f <= w.frame_end;
        return (
          <div key={i} style={{ overflow: "hidden", height: `${lh}em`, lineHeight: `${lh}em` }}>
            <div style={{ transform: `translateY(${(1 - p) * 100}%)`, background: active ? highlight : "transparent", padding: "0 0.12em", margin: "0 -0.12em" }}>
              {w.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
