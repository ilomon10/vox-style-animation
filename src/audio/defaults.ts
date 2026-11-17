/**
 * Every tunable audio-sync default lives HERE. Values are MEASURED on a real Vox "Earworm" episode
 * (analysis/earworm-{A,B,C,D}.md §12–15, analysis/earworm-av-quant.md); rules are documented in
 * docs/style-guide/11-audio-sync.md. Times are seconds unless the name ends in F (frames @25 fps,
 * scale with `fps/25` at other rates); gains are dB. Positive offsets = picture AFTER sound.
 * These are the `earworm` profile; the `standard` profile and the per-profile lookups live in profiles.ts.
 */
export const AUDIO_DEFAULTS = {
  // ── phrasing ─────────────────────────────────────────────────────────────────────
  /** min silence that splits narration into phrases */
  pauseMs: 250,
  /** a graphic beat after a narration pause (epigenetics: 0.2–0.5 s after the pause ends) */
  beatAfterPauseS: 0.35,
  /** default for <OnCue lead>: the picture starts this long BEFORE the cue. Measured: keyword
   *  entrances start +1 f AFTER the word onset (median +0.7 f, IQR −1…+5) → a small negative lead */
  cueLeadS: -0.04,

  // ── mix: voice ≈ −21.5 dBFS (master −12.6 LUFS); NO sidechain ducking — the bed is ridden ──
  /** bed level IN NARRATION GAPS relative to the voice. Under speech the bed sits ≈ −10 dB
   *  (speech-to-music +9.7 dB median) and swells +2.4 dB (median) after phrase ends → −7.6 here.
   *  Featured-record sections swell much more (+13…+16 dB): raise gainDb / deepen duckDb there. */
  musicBedDb: -7.6,
  /** under speech the bed sits this much below its gap level (−2.4 → ≈ −10 dB re voice) */
  duckDb: -2.4,
  /** the bed comes down over 3–5 f when the voice resumes */
  duckAttackS: 0.16,
  /** gap swell ramp after a phrase ends (≈ 0.26 s measured) */
  duckReleaseS: 0.26,
  /** no ride ahead of speech */
  duckLeadS: 0,
  /** gaps shorter than 6 f never let the bed swell */
  duckHoldS: 0.24,
  /** music in: hard (1–4 f) at section changes; 0.6–1.2 s when entering under speech (use 0.72) */
  musicFadeInS: 0.12,
  /** music out: hard (0–3 f) before cuts; 1.4–1.7 s fade-outs under an interview (use 1.6) */
  musicFadeOutS: 0.08,
  /** featured song → voice: 21–25 f fade, starting 17–24 f before the voice */
  songFadeS: 0.92,
  /** SFX relative to the voice (structural booms/whooshes); ticks use sfxTickDb */
  sfxGainDb: -12,
  narrationGainDb: 0,

  // ── audio-reactive visuals ──────────────────────────────────────────────────────────
  /** beat pulse (not measured on Vox — Earworm meters are keyframed; keep subtle) */
  pulseDecayS: 0.28,
  pulseScale: 0.04,
  pulseBrightness: 0.12,
  /** music-only passages snap to the eighth-note grid within ±2 f */
  snapMaxShiftS: 0.08,
  /** dB window mapped to 0..1 for audio-reactive visuals (loudness relative to the 99th pct) */
  levelFloorDb: -48,
  levelCeilDb: -3,
  barCount: 24,
  waveWindowS: 3,
} as const;

/**
 * Measured sync offsets in FRAMES @25 fps (positive = picture after the anchor). Scale by fps/25.
 * See docs/style-guide/11-audio-sync.md §2–§7 for the rules these numbers come from.
 */
export const SYNC = {
  /** cut to the thing being named: on the word onset (−1…+1); illustrating cuts +0…+8, median +2.5 */
  keywordCutF: 0,
  illustratingCutF: 2.5,
  /** keyword graphic entrance after the word onset (A: +0.7 median; D: +3) */
  entranceF: 1,
  /** graphic complete ≤ this many frames after the keyword ENDS */
  entranceCompleteMaxF: 8,
  /** single-word kinetic pop after the STRESSED syllable (−1…+2) */
  popAfterStressF: 1,
  /** archival-speech captions lead each syllable by 4 f (3–6) */
  speechCaptionLeadF: 4,
  /** sung-lyric words land after the vocal onset (0…+3) */
  lyricLagF: 1,
  /** artist / song tags and credits lead the spoken name / vocal (10–15 f) */
  tagLeadF: 12,
  /** name card: surname resolves after its onset (+3…+5); build length 20–22 f */
  nameResolveF: 4,
  nameBuildF: 21,
  /** exit move fires on the next keyword (−1…+2); the cut follows 6–8 f later */
  exitOnKeywordF: 0,
  cutAfterExitF: 7,
  /** next scene's sound pre-laps the cut (4–15 f, median 10.5) */
  preLapF: 10,
  /** cut to the narrator leads her onset by 5–6 f; cut to an on-camera speaker lags by 2–3 f */
  narratorCutLeadF: 5,
  speakerCutLagF: 2,
  /** paragraph opening: cut 11 f before the first syllable, hero object in at −6 f */
  paragraphCutLeadF: 11,
  paragraphHeroLeadF: 6,
  /** events inside narration pauses land on bed notes 3–9 f before the next phrase */
  pauseEventLeadMinF: 3,
  pauseEventLeadMaxF: 9,
  /** music-only passages: quantise to eighths with this offset window */
  eighthOffsetMinF: -1,
  eighthOffsetMaxF: 2,
  /** song → voice handoff: fade 21–25 f starting 17–24 f before the voice */
  songOutFadeF: 23,
  songOutLeadF: 20,
  /** hard stop of a bed after the sentence's last word (−1…+5), then 6–13 f of room tone */
  bedStopAfterLastWordF: 2,
  roomToneF: 9,
  /** source before sound: show the record/radio ≥ 20 f before the music; needle thump 3 f after
   *  the fly-in lands; 11 f of crackle before the song */
  sourceBeforeSoundF: 20,
  needleAfterLandF: 3,
  crackleF: 11,
  /** SFX locks: boom peak on cut +1; whoosh peak on the swap frame; thump on the first black frame */
  boomPeakAfterCutF: 1,
  boomOnsetBeforeCutF: 8,
  /** spectrum bars: render with a 2 f look-ahead, gate −12 dBr; kick scope: ≥ 8 dB rise, hold 2 f */
  barsLookaheadF: 2,
  barsGateDb: -12,
  kickRiseDb: 8,
  kickHoldF: 2,
  /** HF ticks on text pops in music-free passages */
  sfxTickDb: -30,
  /** illustrative TEXT starts ≈7 f before its word (range −22…0) so it reads on the word */
  narratorTextLeadF: 7,
  /** a type-on may start up to 22 f early, inside the narrator's dramatic pause */
  anticipatoryTypeOnLeadF: 22,
  /** captions of an interviewee's keywords land after the onset */
  interviewKeywordF: 2,
  /** titles / credits confirm a name after it is said (+8…+13) */
  titleConfirmF: 10,
  /** cuts follow a music edit: new music enters a median 3.5 f before the cut (IQR 1–7) */
  cutAfterMusicEditF: 3.5,
  /** an old bed stops 7–10 f early, leaving an 8–11 f silence hole; the cut lands in it */
  silenceHoleF: 9,
  /** gap swell where a record is featured */
  featuredSwellDb: 15,
  /** master loudness (integrated) measured; deliver −14 for platforms that normalise */
  masterLufs: -12.6,
} as const;

export const dbToGain = (db: number): number => Math.pow(10, db / 20);
/** convert a SYNC frame value measured at 25 fps to the composition fps */
export const syncF = (framesAt25: number, fps: number) => Math.round((framesAt25 * fps) / 25);
