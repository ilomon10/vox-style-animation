import { AUDIO_DEFAULTS } from "./defaults";

/** Cue file schema (version 1 or 2), written by tools/audio/make_cues.py. Frames are at `fps`.
 *  v2 adds per-word `onset` (speech-energy attack; whisper starts can be ~0.3–0.6 s early) and `stress`
 *  (loudest syllable), plus a local `tempo_map` and an `eighths` grid. */
export type CueWord = {
  text: string; start: number; end: number; frame_start: number; frame_end: number; prob: number;
  /** v2: refined attack time (s) — anchor cuts/entrances here */
  onset?: number; onset_frame?: number;
  /** v2: loudest syllable (s) — anchor pops and camera stops here */
  stress?: number; stress_frame?: number;
};
export type CuePhrase = {
  text: string; start: number; end: number; frame_start: number; frame_end: number;
  /** inclusive indices into `words` */
  word_start: number; word_end: number;
};
export type CuePause = { start: number; end: number; frame_start: number; frame_end: number; duration: number };
export type CueBeat = { t: number; frame: number; strength: number };
export type CueBand = "total" | "low" | "mid" | "high";
export type Cues = {
  version: 1 | 2;
  name: string;
  fps: number;
  duration_s: number;
  duration_frames: number;
  words: CueWord[];
  phrases: CuePhrase[];
  pauses: CuePause[];
  pause_ms: number;
  tempo_bpm: number;
  beats: CueBeat[];
  downbeats: CueBeat[];
  /** v2: eighth-note grid (beats + midpoints) — quantise music-only passages to this */
  eighths?: CueBeat[];
  /** v2: local tempo estimates [{t, bpm}] — songs change tempo */
  tempo_map?: { t: number; bpm: number }[];
  onsets: CueBeat[];
  /** dB per frame relative to the track's 99th-percentile loudness */
  envelope: Record<CueBand, number[]>;
  /** 1 where a word span covers the frame */
  speech: number[];
};

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Query helpers over a Cues object. All frame inputs/outputs are at the COMPOSITION fps (`fps`), converted
 * from the cue file's fps, so a 25 fps cue file works in a 30 fps composition. Frames are relative to the start of
 * the audio; place graphics in a Sequence that starts where the audio starts (or add an offset).
 */
export type CueIndex = ReturnType<typeof createCueIndex>;

export const createCueIndex = (cues: Cues, fps: number = cues.fps) => {
  const k = fps / cues.fps;
  const F = (f: number) => Math.round(f * k);
  const back = (f: number) => f / k; // composition frame -> cue-file frame
  // `frame_onset` / `frame_stress` fall back to the whisper start for v1 files
  const words = cues.words.map((w) => ({
    ...w,
    frame_start: F(w.frame_start),
    frame_end: F(w.frame_end),
    frame_onset: F(w.onset_frame ?? w.frame_start),
    frame_stress: F(w.stress_frame ?? w.onset_frame ?? w.frame_start),
  }));
  const phrases = cues.phrases.map((p) => ({ ...p, frame_start: F(p.frame_start), frame_end: F(p.frame_end) }));
  const pauses = cues.pauses.map((p) => ({ ...p, frame_start: F(p.frame_start), frame_end: F(p.frame_end) }));
  const beats = cues.beats.map((b) => Math.round(b.t * fps));
  const downbeats = cues.downbeats.map((b) => Math.round(b.t * fps));
  const onsets = cues.onsets.map((b) => Math.round(b.t * fps));
  const eighths = (cues.eighths ?? []).map((b) => Math.round(b.t * fps));
  const norms = words.map((w) => norm(w.text));

  const nearestIn = (arr: number[], frame: number): number | null => {
    let best: number | null = null;
    for (const b of arr) if (best === null || Math.abs(b - frame) < Math.abs(best - frame)) best = b;
    return best;
  };

  return {
    cues, fps, words, phrases, pauses, beats, downbeats, onsets, eighths,
    durationInFrames: F(cues.duration_frames),

    /** word being spoken at `frame` (null in gaps) */
    wordAt: (frame: number) => words.find((w) => frame >= w.frame_start && frame <= w.frame_end) ?? null,
    /** index of the last word that started at or before `frame` (-1 before the first) */
    wordIndexAt: (frame: number) => {
      let i = -1;
      for (let j = 0; j < words.length; j++) if (words[j].frame_start <= frame) i = j;
      return i;
    },
    /** phrase containing `frame`, or the last one that started before it */
    phraseAt: (frame: number) => {
      let p = null as (typeof phrases)[number] | null;
      for (const q of phrases) if (q.frame_start <= frame) p = q;
      return p;
    },
    /** ONSET frame (refined attack; whisper start for v1 files) of the nth (1-based) occurrence of `text`
     *  (case/punctuation-insensitive); null if absent. This is the anchor for cuts and entrances. */
    findWord: (text: string, nth = 1): number | null => {
      const t = norm(text);
      let n = 0;
      for (let i = 0; i < words.length; i++) if (norms[i] === t && ++n === nth) return words[i].frame_onset;
      return null;
    },
    /** stressed-syllable frame of the nth occurrence — the anchor for word pops and camera stops */
    findWordStress: (text: string, nth = 1): number | null => {
      const t = norm(text);
      let n = 0;
      for (let i = 0; i < words.length; i++) if (norms[i] === t && ++n === nth) return words[i].frame_stress;
      return null;
    },
    /** same, returning the word's end frame */
    findWordEnd: (text: string, nth = 1): number | null => {
      const t = norm(text);
      let n = 0;
      for (let i = 0; i < words.length; i++) if (norms[i] === t && ++n === nth) return words[i].frame_end;
      return null;
    },
    phraseStarts: () => phrases.map((p) => p.frame_start),
    phraseEnds: () => phrases.map((p) => p.frame_end),
    /** beat nearest to `frame` (null if the track has no beats) */
    nearestBeat: (frame: number) => nearestIn(beats, frame),
    /** first beat strictly after `frame` (null past the last) */
    nextBeat: (frame: number) => beats.find((b) => b > frame) ?? null,
    /** `frame` moved onto the nearest beat if within maxShift frames, else unchanged */
    snapToBeat: (frame: number, maxShift: number = Math.round(AUDIO_DEFAULTS.snapMaxShiftS * fps)) => {
      const b = nearestIn(beats, frame);
      return b !== null && Math.abs(b - frame) <= maxShift ? b : frame;
    },
    /** `frame` moved onto the nearest EIGHTH note if within maxShift (music-only passages: ±2 f measured) */
    snapToEighth: (frame: number, maxShift = 2) => {
      const b = nearestIn(eighths.length ? eighths : beats, frame);
      return b !== null && Math.abs(b - frame) <= maxShift ? b : frame;
    },
    /** beats in [a, b) */
    beatsBetween: (a: number, b: number) => beats.filter((x) => x >= a && x < b),
    /** last beat at or before `frame` (null before the first) */
    lastBeat: (frame: number) => {
      let r: number | null = null;
      for (const b of beats) if (b <= frame) r = b;
      return r;
    },
    /** loudness in dB (relative to the track's 99th percentile) at `frame` */
    levelAt: (frame: number, band: CueBand = "total") => {
      const e = cues.envelope[band];
      return e[Math.min(e.length - 1, Math.max(0, Math.round(back(frame))))] ?? -120;
    },
    /** loudness mapped to 0..1 over [levelFloorDb, levelCeilDb] */
    level01At: (frame: number, band: CueBand = "total") => {
      const e = cues.envelope[band];
      const db = e[Math.min(e.length - 1, Math.max(0, Math.round(back(frame))))] ?? -120;
      return clamp01((db - AUDIO_DEFAULTS.levelFloorDb) / (AUDIO_DEFAULTS.levelCeilDb - AUDIO_DEFAULTS.levelFloorDb));
    },
    /** 1 while narration is speaking at `frame` */
    speechAt: (frame: number) => cues.speech[Math.min(cues.speech.length - 1, Math.max(0, Math.round(back(frame))))] ?? 0,
    /** speech mask resampled to composition frames */
    speechMask: (): number[] => Array.from({ length: Math.round(cues.speech.length * k) }, (_, f) => cues.speech[Math.min(cues.speech.length - 1, Math.round(f / k))]),
  };
};
