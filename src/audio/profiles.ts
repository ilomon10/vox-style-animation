import { AUDIO_DEFAULTS, SYNC } from "./defaults";

/**
 * Sync and mix PROFILES. `earworm` is SYNC / AUDIO_DEFAULTS unchanged (Vox Earworm); `standard` holds the defaults measured
 * across five other Vox videos (analysis/vox-framework-coverage.md §6.2 Build 4, §5 conflicts 1–3, 9–12, 19–20).
 * Frame values are @25 fps (scale with fps/25, as SYNC); gains are dB. Positive offsets = picture AFTER the anchor.
 */
export type ProfileName = "earworm" | "standard";
/** event kinds a profile can offset (mirror of EventKind in src/studio/types.ts) */
export type ProfileKind =
  | "cut" | "phrase" | "object" | "text" | "pop" | "title" | "caption" | "lyric" | "name" | "exit" | "highlight" | "lowerThird";

export type SyncProfile = {
  /** default offset (frames @25) per event kind */
  kindOffsetF: Record<ProfileKind, number>;
  /** kind a scene start gets when its anchor names none */
  defaultCutKind: "cut" | "phrase";
  /** new music cue vs the cut: negative = before the cut (pre-lap), positive = after it (inside the hole) */
  cueAfterCutF: number;
  /** allowed chapter hole (frames) before a hard cut: `transitionIn.hole` */
  holeMinF: number;
  holeMaxF: number;
  /** minimum frames between two cuts; `burstMinCutGapF` for a scene declared `burst: true` */
  minCutGapF: number;
  burstMinCutGapF: number;
};
export type MixProfile = {
  /** bed defaults, applied only to a music entry that sets neither itself (gainDb = bed level re the voice) */
  bedRide: boolean;
  bedGainDb: number;
  /** SFX per minute the validator budgets (plus a slack of 1); earworm ≈ 1 per 13 s */
  sfxPerMin: number;
  /** music boundaries per minute the validator tolerates (earworm 8–12; standard 0.7–1.6 cues/min) */
  maxBoundariesPerMin: number;
  /** transitions play their own sounds (dip boom, whoosh, ...) unless a transition sets `sfx` */
  transitionSfx: boolean;
};

const kindOffsetF: SyncProfile["kindOffsetF"] = {
  cut: SYNC.keywordCutF, object: SYNC.entranceF, text: -SYNC.narratorTextLeadF, pop: SYNC.popAfterStressF,
  title: SYNC.titleConfirmF, caption: -SYNC.speechCaptionLeadF, lyric: SYNC.lyricLagF, name: SYNC.nameResolveF,
  exit: SYNC.exitOnKeywordF,
  // new kinds, same in both profiles: a phrase cut leads the phrase's first word by 3 f; highlight +1 f; lower third cut +2 f
  phrase: -3, highlight: 1, lowerThird: 2,
};

export const SYNC_PROFILES: Record<ProfileName, SyncProfile> = {
  earworm: {
    kindOffsetF, defaultCutKind: "cut", cueAfterCutF: -SYNC.cutAfterMusicEditF,
    holeMinF: 5, holeMaxF: 29, minCutGapF: 6, burstMinCutGapF: 6,
  },
  standard: {
    kindOffsetF, defaultCutKind: "phrase", cueAfterCutF: 3,
    holeMinF: 5, holeMaxF: 29, minCutGapF: 6, burstMinCutGapF: 3,
  },
};

export const MIX_PROFILES: Record<ProfileName, MixProfile> = {
  earworm: { bedRide: true, bedGainDb: AUDIO_DEFAULTS.musicBedDb, sfxPerMin: 60 / 13, maxBoundariesPerMin: 12, transitionSfx: true },
  standard: { bedRide: false, bedGainDb: -13, sfxPerMin: 1.5, maxBoundariesPerMin: 2, transitionSfx: false },
};

/** profile of a storyboard: the explicit field, else voxEarworm / no look -> earworm, any other (also an unknown) look -> standard */
export const profileOf = (profile: ProfileName | undefined, look: string | undefined): ProfileName =>
  profile ?? (look === undefined || look === "voxEarworm" ? "earworm" : "standard");

/**
 * Bed defaults of a music entry: fills only what the entry leaves unset, and only for `standard` (earworm keeps the
 * component defaults, so existing projects resolve exactly as before). Songs are never touched.
 */
export const bedDefaults = (profile: ProfileName, m: { ride?: unknown; gainDb?: number; kind?: string }): { ride?: boolean; gainDb?: number } => {
  if (profile === "earworm" || m.kind === "song") return {};
  const mix = MIX_PROFILES[profile];
  return {
    ...(m.ride === undefined ? { ride: mix.bedRide } : {}),
    ...(m.gainDb === undefined ? { gainDb: mix.bedGainDb } : {}),
  };
};
