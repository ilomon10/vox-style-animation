import React from "react";
import { Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { AUDIO_DEFAULTS } from "./defaults";
import type { CueBand } from "./cues";
import type { CueIndex } from "./cues";
import { useResolvedCues } from "./useCues";

/**
 * What a cue points at. Exactly one of word / phrase / beat / downbeat / pause / sec / frame.
 *  - word: text of a spoken word, `nth` = 1-based occurrence; edge "start" (default) or "end"
 *  - phrase: 0-based phrase index (its first word)
 *  - beat / downbeat: 0-based index into the beat / downbeat list
 *  - pause: 0-based pause index; lands AUDIO_DEFAULTS.beatAfterPauseS after the pause BEGINS (guide §8: beats land
 *    0.2-0.5 s after narration pauses)
 * `offset` (frames, + later) is added; `snap` moves the result onto a beat if one is within that many frames.
 */
export type CueSpec = {
  cues: CueIndex;
  word?: string;
  nth?: number;
  edge?: "start" | "end" | "stress";
  phrase?: number;
  beat?: number;
  downbeat?: number;
  pause?: number;
  sec?: number;
  frame?: number;
  offset?: number;
  snap?: number;
};

/** Frame (at the composition fps, relative to the audio start) of a cue. Throws if the target does not exist. */
export const cueFrame = (spec: CueSpec): number => {
  const { cues: c, offset = 0 } = spec;
  let base: number | null | undefined;
  if (spec.word !== undefined)
    base =
      spec.edge === "end"
        ? c.findWordEnd(spec.word, spec.nth ?? 1)
        : spec.edge === "stress"
          ? c.findWordStress(spec.word, spec.nth ?? 1)
          : c.findWord(spec.word, spec.nth ?? 1);
  else if (spec.phrase !== undefined) base = c.phrases[spec.phrase]?.frame_start;
  else if (spec.beat !== undefined) base = c.beats[spec.beat];
  else if (spec.downbeat !== undefined) base = c.downbeats[spec.downbeat];
  else if (spec.pause !== undefined) {
    const p = c.pauses[spec.pause];
    base = p ? p.frame_start + Math.round(AUDIO_DEFAULTS.beatAfterPauseS * c.fps) : undefined;
  } else if (spec.sec !== undefined) base = Math.round(spec.sec * c.fps);
  else base = spec.frame;
  if (base === null || base === undefined) throw new Error(`audio: cue not found ${JSON.stringify({ ...spec, cues: undefined })}`);
  const f = base + offset;
  return spec.snap ? c.snapToBeat(f, spec.snap) : f;
};

/** Frame of beat `n` (0-based; downbeats: bar `n`). */
export const beatFrame = (cues: CueIndex, n: number, downbeat = false): number =>
  cueFrame({ cues, ...(downbeat ? { downbeat: n } : { beat: n }) });

export type OnCueProps = {
  /** frame, or a cue spec (frames are relative to the enclosing Sequence = audio start) */
  at: number | CueSpec;
  /** start this many frames BEFORE the cue so the motion lands on it (default AUDIO_DEFAULTS.cueLeadS) */
  lead?: number;
  /** unmount after this many frames (default: stay mounted) */
  duration?: number;
  /** children, or a render prop receiving the frames elapsed since the cue start */
  children: React.ReactNode | ((rel: number) => React.ReactNode);
};

/**
 * Starts its children's animation at a cue: a layout-less Sequence from `at - lead`, so children's own
 * `delay`/drawing-frame clocks start at 0 there (the 12/s grid restarts at the cue, like at a cut).
 * Children are unmounted before the cue.
 */
export const OnCue: React.FC<OnCueProps> = ({ at, lead, duration, children }) => {
  const { fps } = useVideoConfig();
  const l = lead ?? Math.round(AUDIO_DEFAULTS.cueLeadS * fps);
  const from = Math.max(0, (typeof at === "number" ? at : cueFrame(at)) - l);
  return (
    <Sequence from={from} durationInFrames={duration ?? Infinity} layout="none" name="OnCue">
      <RelFrame>{children}</RelFrame>
    </Sequence>
  );
};
const RelFrame: React.FC<{ children: OnCueProps["children"] }> = ({ children }) => {
  const rel = useCurrentFrame();
  return <>{typeof children === "function" ? children(rel) : children}</>;
};

type ReactiveOpts = { cues?: CueIndex; onOnes?: boolean };
const useGridFrame = (onOnes?: boolean) => {
  const raw = useCurrentFrame();
  const grid = useDrawingFrame();
  return onOnes ? raw : grid;
};

/**
 * 0..1 envelope that jumps to 1 on every beat and decays (squared linear) over `decay` seconds.
 * Steps on the 12/s drawing grid unless `onOnes`. `downbeats` pulses only on bar starts; `lead` frames
 * fires the pulse early (to hide the audio/graphic latency).
 */
export const useBeatPulse = (o: ReactiveOpts & { decay?: number; downbeats?: boolean; lead?: number } = {}): number => {
  const c = useResolvedCues(o.cues);
  const f = useGridFrame(o.onOnes) + (o.lead ?? 0);
  const decayF = Math.max(1, (o.decay ?? AUDIO_DEFAULTS.pulseDecayS) * c.fps);
  const list = o.downbeats ? c.downbeats : c.beats;
  let last: number | null = null;
  for (const b of list) if (b <= f) last = b;
  if (last === null) return 0;
  return Math.pow(Math.max(0, 1 - (f - last) / decayF), 2);
};

/** Loudness of a band at the current frame, 0..1, straight from the cue envelope (no audio decoding). */
export const useAudioLevel = (band: CueBand = "total", o: ReactiveOpts = {}): number => {
  const c = useResolvedCues(o.cues);
  return c.level01At(useGridFrame(o.onOnes), band);
};

/** Convenience: linear map of a 0..1 value. */
export const lerp01 = (v: number, a: number, b: number) => interpolate(v, [0, 1], [a, b]);
