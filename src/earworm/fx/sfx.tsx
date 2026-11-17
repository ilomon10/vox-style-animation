import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { dbToGain } from "../../audio/defaults";
import { Sfx } from "../../audio/Soundtrack";
import manifest from "../../../public/audio/sfx/manifest.json";

/** Procedural SFX from tools/audio/make_sfx.py. Each has a JSON sidecar with the sound's OWN peak offset. */
export type SfxName =
  | "sub_boom" | "whoosh" | "needle_drop" | "vinyl_crackle" | "tick" | "bass_hit" | "glitch_tick" | "radio_static" | "black_thump"
  | "paper_swoosh" | "paper_flick" | "stamp_thud" | "sub_swell" | "chime";

export type SfxMeta = {
  name: SfxName; file: string; sample_rate: number; duration_s: number; peak_s: number; onset_s: number; peak_dbfs: number;
  suggested_gain_db: number; loop: boolean; note: string;
};

export const sfxMeta = (name: SfxName): SfxMeta => (manifest as unknown as Record<SfxName, SfxMeta>)[name];

/** Where a sound goes: its PEAK lands on composition frame `peak` (relative to the enclosing Sequence). */
export type SfxPlacement = {
  name: SfxName;
  /** frame the sound's own peak must land on (omit when `start` is given) */
  peak?: number;
  /** frame the clip starts on instead (loops / beds whose peak is meaningless) */
  start?: number;
  /** default: the sidecar's suggested_gain_db */
  gainDb?: number;
  /** cut the clip after this many frames (crackle: 11) */
  durationInFrames?: number;
};

/** Frame the clip must START at so its peak sits on `peak` (may be negative: clip starts mid-sound). */
export const sfxStartFrame = (name: SfxName, peak: number, fps: number) => Math.round(peak - sfxMeta(name).peak_s * fps);

/** `<Sfx>` placement with peak alignment (uses `startFrom` when the clip would start before frame 0). */
export const SfxAtPeak: React.FC<SfxPlacement> = ({ name, peak, start, gainDb, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const m = sfxMeta(name);
  const from = start ?? sfxStartFrame(name, peak ?? 0, fps);
  const g = gainDb ?? m.suggested_gain_db;
  if (from >= 0) return <Sfx at={from} src={m.file} gainDb={g} durationInFrames={durationInFrames} />;
  return (
    <Sequence from={0} durationInFrames={durationInFrames ?? Infinity} layout="none" name="Sfx">
      <Audio src={staticFile(m.file)} volume={dbToGain(g)} startFrom={-from} />
    </Sequence>
  );
};

/** Render every placement of a transition plan. */
export const SfxList: React.FC<{ items: SfxPlacement[] }> = ({ items }) => (
  <>{items.map((p, i) => <SfxAtPeak key={i} {...p} />)}</>
);

/** Telephone EQ (archival caller / DJ, analysis/earworm-D.md s13): Remotion's <Audio> cannot filter, so this is an
 *  OFFLINE preset. `python3 -I tools/audio/make_sfx.py --phone-eq in.wav out.wav`, or the ffmpeg recipe below. */
export const PHONE_EQ = {
  highpassHz: 200,
  boost: { fromHz: 1200, toHz: 3400, gainDb: 12 },
  lowpassHz: 8000,
  ffmpeg: (input: string, output: string) =>
    `ffmpeg -i ${input} -af "highpass=f=200,equalizer=f=2020:width_type=h:width=2200:g=12,lowpass=f=8000" ${output}`,
} as const;

/** dB ramp helper: linear-in-dB gain between two frames, hard 0 outside when `silentOutside`. */
export const dbRamp = (f: number, f0: number, db0: number, f1: number, db1: number) => {
  const t = Math.min(1, Math.max(0, (f - f0) / Math.max(1, f1 - f0)));
  return dbToGain(db0 + (db1 - db0) * t);
};
