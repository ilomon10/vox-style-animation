/**
 * storyboard.json — the whole video as DATA. RULE: frames never appear here. Every time is a spoken WORD (plus a small
 * offset in frames at the storyboard fps), a scene id, or — only in music-only passages — seconds. Re-recording the voice-over
 * re-cues the words, so the whole video re-times itself. JSON Schema: src/studio/storyboard.schema.json.
 */
export type EventKind =
  | "cut" // keyword cut: word onset, offset 0
  | "object" // collage / object entrance: onset +1
  | "text" // illustrative text (digits, names, key words): onset -7
  | "pop" // single-word kinetic pop: STRESSED syllable +1
  | "title" // title / credit confirming a spoken name: onset +10
  | "caption" // archival-speech caption: onset -4
  | "lyric" // sung-lyric caption: onset +1
  | "name" // name card resolves on the surname: onset +4
  | "exit" // exit move on the next keyword: onset 0
  | "phrase" // cut placed on a phrase's FIRST word: onset -3 (default scene-start kind of the `standard` profile)
  | "highlight" // highlighter sweep on a keyword: onset +1
  | "lowerThird"; // lower third on the person's first full-frame cut: +2

type Common = {
  /** frames (storyboard fps) REPLACING the default offset of the anchor's `kind` (defaults come from SYNC, doc 11 §2) */
  offset?: number;
  /** default offset/edge of this kind of event when `offset`/`edge` are omitted */
  kind?: EventKind;
  /** music-only passages ONLY: move onto the nearest beat / eighth of the first music track that has `cues` (never on a cut under narration) */
  snap?: "beat" | "eighth";
};
/** a spoken word of the voice-over script: `word` text (case/punctuation-insensitive), `nth` = 1-based occurrence, edge = onset (default), stress or end */
export type WordAnchor = Common & { word: string; nth?: number; edge?: "start" | "stress" | "end" };
/** the END of scene `after` (= the start of the scene that follows it, or its explicit `end`) */
export type AfterAnchor = Common & { after: string };
/** absolute timeline seconds — music-only passages (intro before the voice, outro) only */
export type SecAnchor = Common & { sec: number };
/** the end of the video */
export type EndAnchor = Common & { end: true };
export type Anchor = WordAnchor | AfterAnchor | SecAnchor | EndAnchor;

/** frame format: `landscape` (default, 1920×1080 design canvas) or `short` (YouTube Shorts, 1080×1920 portrait; `--scale=2` -> 2160×3840) */
export type Format = "landscape" | "short";
/** where the burned-in captions sit: `bottom` (full-frame shots, block centre y 1688) or `seam` (two-up shots, centre y 1010); `split` = old name of `seam` */
export type CaptionPos = "bottom" | "seam";
export type CaptionPosInput = CaptionPos | "split";
export type Captions = {
  pos?: CaptionPosInput;
  /** spoken phrase -> display text (multi-word, case-insensitive), e.g. {"thirty-nine": "39", "twenty nineteen": "2019"}; one karaoke box covers the replaced token */
  replace?: Record<string, string>;
};

export type Look = "voxLight" | "voxEarworm" | "voxExplainer" | "voxEditorial" | "paperDesk" | "darkCollage";

export type TransitionKind = "cut" | "blurThrough" | "spinSwap" | "dip" | "drop" | "glitchCut";
/** boundary treatment into a scene (or out of the previous one). Sound-locked kinds bring their SFX (sub_boom, whoosh, black_thump, bass_hit) */
export type Transition = {
  kind: TransitionKind;
  /** dip only: "act" (18/17/36 f, once per film) or "chapter" (5/9/8 f) */
  variant?: "act" | "chapter";
  /** false mutes the transition's own SFX (`standard` profile: silent unless true) */
  sfx?: boolean;
  /** `cut` only: chapter hole. The running music bed ends `hole` frames (5–29) before the cut and the next music cue
   *  starts the profile's `cueAfterCutF` after it (standard +3 f, earworm -3.5 f). Frames @ the storyboard fps */
  hole?: number;
};

export type SceneEvent = {
  /** key the recipe looks up (see the recipe's `events` in docs/style-guide/14-production-pipeline.md) */
  id: string;
  at: Anchor;
  /** optional second time (exit / end of a hold), same anchor forms */
  until?: Anchor;
  kind?: EventKind;
};

export type Scene = {
  id: string;
  /** recipe name, see src/recipes/index.ts */
  recipe: string;
  /** the cut INTO this scene */
  start: Anchor;
  /** optional; default = start of the next scene (last scene: video end) */
  end?: Anchor;
  /** recipe props. Strings `assets/...` / `audio/...` are project-relative; `kit:assets/...` is a kit asset under public/. Keys `at`, `until`, `*At`, `*Until` hold anchors */
  props?: Record<string, unknown>;
  events?: SceneEvent[];
  transitionIn?: Transition;
  transitionOut?: Transition;
  /** declared montage burst: the validator allows the cut INTO this scene 3 f (not 6) after the previous cut (`standard` profile) */
  burst?: boolean;
  /** `short` format with captions on: caption position for this scene (default: the storyboard's) */
  captionPos?: CaptionPosInput;
  note?: string;
};

export type MusicTrack = {
  id: string;
  /** project-relative (`audio/music/bed.wav`) or `kit:audio/...` */
  src: string;
  kind?: "bed" | "song";
  in: Anchor;
  out: Anchor;
  /** dB; bed default: the profile's (earworm AUDIO_DEFAULTS.musicBedDb -7.6 gap level re the voice; standard -13) */
  gainDb?: number;
  /** ride the bed under narration with the measured duck (default: the profile's, earworm true, standard false) */
  ride?: boolean | { duckDb?: number; releaseSec?: number; attackSec?: number };
  fadeInSec?: number;
  fadeOutSec?: number;
  /** song excerpt: seconds into the file */
  startFromSec?: number;
  /** cue file of this track (make_cues.py --no-words): enables `snap` in music-only passages */
  cues?: string;
};

export type SfxItem = {
  /** a kit SFX name (whoosh, sub_boom, ...: public/audio/sfx/manifest.json) or a project/kit audio path */
  src: string;
  at: Anchor;
  gainDb?: number;
  /** kit names: `at` is the sound's PEAK (default true) */
  peak?: boolean;
  /** file paths: seconds from the clip start to its peak — filled by publish_project.py from the clip's
   *  `.json` sidecar (make_sfx.py / extract_vox_sfx.py), so `at` lands on the PEAK */
  peakSec?: number;
};

export type Storyboard = {
  version: 1;
  title?: string;
  fps: number;
  /** `short`: 9:16 portrait composition (1080×1920); portrait recipes (src/recipes/short/) get the 1080×1920 design space, landscape recipes a centred band (`shortBand`) */
  format?: Format;
  /** burned-in karaoke captions built from the voice cue words (`true` = bottom, or `{pos}`; src/studio/ShortCaptions.tsx) */
  captions?: boolean | Captions;
  /** `short`: landscape recipes render as a centred band of the 1920×1080 design at this scale of the 1080-wide frame (default 0.63 -> 1210×680) */
  shortBand?: { scale?: number };
  /** QA flags */
  debug?: {
    /** draw the YouTube Shorts UI zones as translucent boxes (stills only) */
    safeArea?: boolean;
  };
  look?: Look;
  /** sync + mix defaults (src/audio/profiles.ts). Default: voxEarworm / no look -> "earworm", any other look -> "standard" */
  profile?: "earworm" | "standard";
  /** the voice-over: files come from project.json via publish_project.py (vo.wav, vo.cues.json) */
  vo?: { gainDb?: number; leadSec?: number };
  music?: MusicTrack[];
  sfx?: SfxItem[];
  scenes: Scene[];
  /** the video ends at the start of `scene` (default: the last scene) plus `tailSec` */
  end?: { scene?: string; tailSec?: number };
  /** extra words the re-cue report tracks (recue.py reads this) */
  anchors?: { id: string; anchor: string }[];
};
