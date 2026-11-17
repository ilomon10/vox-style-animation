import React, { useMemo } from "react";
import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import type { CueIndex } from "./cues";
import { AUDIO_DEFAULTS, dbToGain } from "./defaults";
import { CuesProvider } from "./useCues";

/** `audio/foo.wav` (public/) or a full URL -> something <Audio> accepts. */
const resolve = (src: string) => (/^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src));

/**
 * Narration. Provides `cues` to descendants (useBeatPulse, LyricLine, …) and plays the track.
 * Mount it in a Sequence that starts where the narration starts; `startFrom` trims the source (frames).
 */
export const Narration: React.FC<{
  src: string;
  cues?: CueIndex;
  gainDb?: number;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({ src, cues, gainDb = AUDIO_DEFAULTS.narrationGainDb, startFrom, children }) => {
  const audio = <Audio src={resolve(src)} volume={dbToGain(gainDb)} startFrom={startFrom} />;
  return cues ? <CuesProvider cues={cues}>{audio}{children}</CuesProvider> : <>{audio}{children}</>;
};

export type DuckOptions = {
  /** gain while ducked, dB relative to the bed level (negative) */
  duckDb?: number;
  /** frames for the duck to reach full depth / to recover */
  attackFrames?: number;
  releaseFrames?: number;
  /** start ducking this many frames before speech */
  leadFrames?: number;
  /** speech gaps shorter than this stay ducked */
  holdFrames?: number;
};

/**
 * Per-frame linear gain (0..1+) for a music bed under a speech mask (1 = speaking). Pure and deterministic:
 * mask is dilated by lead/hold, then a depth value 0..1 slews toward it at 1/attack (down) or 1/release (up),
 * and gain = dbToGain(duckDb * depth). Fades and bed level are applied by the caller.
 */
export const buildDuckCurve = (speech: ArrayLike<number>, total: number, fps: number, o: DuckOptions = {}): Float32Array => {
  const duckDb = o.duckDb ?? AUDIO_DEFAULTS.duckDb;
  const attack = Math.max(1, o.attackFrames ?? Math.round(AUDIO_DEFAULTS.duckAttackS * fps));
  const release = Math.max(1, o.releaseFrames ?? Math.round(AUDIO_DEFAULTS.duckReleaseS * fps));
  const lead = o.leadFrames ?? Math.round(AUDIO_DEFAULTS.duckLeadS * fps);
  const hold = o.holdFrames ?? Math.round(AUDIO_DEFAULTS.duckHoldS * fps);
  // target[f] = 1 if speech within [f - hold, f + lead]
  const target = new Uint8Array(total);
  let lastSpeech = -1e9;
  for (let f = 0; f < total + lead; f++) {
    if ((speech[f] ?? 0) > 0) {
      lastSpeech = f;
      for (let g = Math.max(0, f - lead); g <= f && g < total; g++) target[g] = 1;
    }
    if (f < total && f - lastSpeech <= hold) target[f] = 1;
  }
  const out = new Float32Array(total);
  let d = 0;
  for (let f = 0; f < total; f++) {
    d = target[f] ? Math.min(1, d + 1 / attack) : Math.max(0, d - 1 / release);
    out[f] = dbToGain(duckDb * d);
  }
  return out;
};

export type MusicBedProps = DuckOptions & {
  src: string;
  /** narration cues; no ducking when omitted */
  duckUnder?: CueIndex;
  /** bed level, dB (default AUDIO_DEFAULTS.musicBedDb) */
  gainDb?: number;
  fadeIn?: number;
  fadeOut?: number;
  /** frames the narration timeline is shifted later than the music's start (default 0 = same origin) */
  narrationOffset?: number;
  /** length of the bed for the fade-out (default: composition duration) */
  durationInFrames?: number;
};

/** Gain curve of a MusicBed, exported so graphs / tests use the identical numbers. */
export const musicGainAt = (curve: Float32Array | null, frame: number, total: number, fps: number, p: Pick<MusicBedProps, "gainDb" | "fadeIn" | "fadeOut">): number => {
  const fin = p.fadeIn ?? Math.round(AUDIO_DEFAULTS.musicFadeInS * fps);
  const fout = p.fadeOut ?? Math.round(AUDIO_DEFAULTS.musicFadeOutS * fps);
  const duck = curve ? curve[Math.min(curve.length - 1, Math.max(0, frame))] ?? 1 : 1;
  const fade = interpolate(frame, [0, Math.max(1, fin), total - Math.max(1, fout), total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return dbToGain(p.gainDb ?? AUDIO_DEFAULTS.musicBedDb) * duck * fade;
};

/** Music under narration: Remotion volume automation = bed level x duck curve (from the speech mask) x fades. */
export const MusicBed: React.FC<MusicBedProps> = (p) => {
  const { fps, durationInFrames } = useVideoConfig();
  const total = p.durationInFrames ?? durationInFrames;
  const curve = useMemo(() => {
    if (!p.duckUnder) return null;
    const mask = p.duckUnder.speechMask();
    const off = p.narrationOffset ?? 0;
    const shifted = Array.from({ length: total }, (_, f) => mask[f - off] ?? 0);
    return buildDuckCurve(shifted, total, fps, p);
  }, [p.duckUnder, total, fps, p.duckDb, p.attackFrames, p.releaseFrames, p.leadFrames, p.holdFrames, p.narrationOffset]);
  return <Audio src={resolve(p.src)} volume={(f) => musicGainAt(curve, f, total, fps, p)} />;
};

/**
 * A song clip that starts ON a cut: plays source frames [startFrom, startFrom + (out - in)) during composition
 * frames [in, out), with short fades. Frames are at the composition fps; `in`/`out` are in the enclosing Sequence.
 */
export const SongExcerpt: React.FC<{
  src: string;
  /** source frame the clip starts from */
  startFrom?: number;
  in: number;
  out: number;
  fadeFrames?: number;
  gainDb?: number;
}> = ({ src, startFrom = 0, in: from, out, fadeFrames, gainDb = 0 }) => {
  const { fps } = useVideoConfig();
  const len = out - from;
  const fade = Math.max(0, fadeFrames ?? Math.round(AUDIO_DEFAULTS.songFadeS * fps));
  return (
    <Sequence from={from} durationInFrames={len} layout="none" name="SongExcerpt">
      <Audio
        src={resolve(src)}
        startFrom={startFrom}
        volume={(f) => dbToGain(gainDb) * (fade > 0 ? Math.min(1, f / fade, (len - f) / fade) : 1)}
      />
    </Sequence>
  );
};

/** One-shot sound effect starting at composition frame `at`. */
export const Sfx: React.FC<{ at: number; src: string; gainDb?: number; durationInFrames?: number }> = ({
  at, src, gainDb = AUDIO_DEFAULTS.sfxGainDb, durationInFrames,
}) => (
  <Sequence from={at} durationInFrames={durationInFrames ?? Infinity} layout="none" name="Sfx">
    <Audio src={resolve(src)} volume={dbToGain(gainDb)} />
  </Sequence>
);
