import { AUDIO_DEFAULTS, createCueIndex, cueFrame, syncF, type CueIndex, type Cues } from "../audio";
import { MIX_PROFILES, SYNC_PROFILES, bedDefaults, profileOf, type ProfileName } from "../audio/profiles";
import type { Anchor, CaptionPos, CaptionPosInput, Format, EventKind, MusicTrack, Scene, SfxItem, Storyboard, Transition } from "./types";

/** Default edge per event kind (only `pop` rides the stressed syllable). */
const KIND_EDGE: Partial<Record<EventKind, "stress">> = { pop: "stress" };

/** Default offset (frames @25, scaled to the fps) and edge per event kind of a profile: the measured SYNC table of doc 11 §2 (earworm) or the sample defaults (standard). */
export const kindDefaults = (profile: ProfileName): Record<EventKind, { offset: number; edge: "start" | "stress" | "end" }> =>
  Object.fromEntries(
    Object.entries(SYNC_PROFILES[profile].kindOffsetF).map(([k, offset]) => [k, { offset, edge: KIND_EDGE[k as EventKind] ?? "start" }]),
  ) as Record<EventKind, { offset: number; edge: "start" | "stress" | "end" }>;
export const KIND_DEFAULTS = kindDefaults("earworm");

export const isAnchor = (v: unknown): v is Anchor =>
  !!v && typeof v === "object" && !Array.isArray(v) &&
  ("word" in v || "after" in v || "sec" in v || "end" in v) &&
  Object.keys(v).every((k) => ["word", "nth", "edge", "offset", "kind", "snap", "after", "sec", "end"].includes(k));

/** bed drop under clip speech (doc 11 §5: ≈ 20 dB in the speech band); `bed: "out"` takes the bed out for a key bite */
const CLIP_BED_DUCK_DB = -20;
const CLIP_BED_OUT_DB = -60;

const ANCHOR_KEY = /^(at|until)$|(At|Until)$/;
const ASSET = /^(kit:)?(assets|audio)\/.+\.[A-Za-z0-9]{2,5}$/;

/** `assets/x.png` -> `projects/<slug>/assets/x.png`; `kit:assets/x.png` -> `assets/x.png` (both are public/-relative). */
export const publicPath = (slug: string, s: string) => (s.startsWith("kit:") ? s.slice(4) : `projects/${slug}/${s}`);

/** `split` is the old name of `seam` */
const capPos = (p?: CaptionPosInput): CaptionPos => (p === "seam" || p === "split" ? "seam" : "bottom");

export type ResolvedScene = {
  id: string; recipe: string; start: number; end: number; dur: number;
  props: Record<string, unknown>;
  /** event id -> frames relative to the scene start */
  events: Record<string, { at: number; until?: number }>;
  transitionIn?: Transition;
  captionPos?: CaptionPos;
  seed: string;
};
/** the own sound of a `FootageClip` scene (played by StoryAudio) and what the music bed does under it. All frames @ the storyboard fps, absolute. */
export type ResolvedClip = {
  id: string; src: string;
  /** frame the sound starts (the scene start minus `audioLeadF`, a J-cut) and the source frame it plays from */
  at: number; srcFrom: number; len: number; gainDb: number;
  /** false: no sound (the bed window may still apply) */
  play: boolean;
  /** bed gain change under [at, at + len), dB (negative); null = the bed is left alone */
  bedDb: number | null;
};
export type ResolvedTrack = Omit<MusicTrack, "in" | "out" | "src"> & { src: string; in: number; out: number };
export type ResolvedSfx = { src: string; kit: boolean; at: number; gainDb?: number; peak: boolean };
export type ResolvedStoryboard = {
  slug: string; fps: number; format: Format; captions?: { pos: CaptionPos; replace?: Record<string, string> }; bandScale?: number; safeArea: boolean; look: NonNullable<Storyboard["look"]>; profile: ProfileName; leadF: number; durationInFrames: number; voGainDb: number;
  scenes: ResolvedScene[]; music: ResolvedTrack[]; sfx: ResolvedSfx[];
  /** own sound of the `FootageClip` scenes (absent when there are none) */
  clips?: ResolvedClip[];
  /** every public/-relative asset a scene uses (checked for existence by calculateMetadata) */
  assets: string[];
};

/** Resolve a whole storyboard against the voice cues. Throws with the scene id when a word is not in the cues. */
export const resolveStoryboard = (sb: Storyboard, slug: string, voCues: Cues, musicCues?: Cues): ResolvedStoryboard => {
  const fps = sb.fps;
  const profile = profileOf(sb.profile, sb.look);
  const sync = SYNC_PROFILES[profile];
  const KINDS = kindDefaults(profile);
  const idx: CueIndex = createCueIndex(voCues, fps);
  const mIdx = musicCues ? createCueIndex(musicCues, fps) : null;
  const leadF = Math.round((sb.vo?.leadSec ?? 0) * fps);
  const assets = new Set<string>();

  const startCache = new Map<string, number>();
  const stack: string[] = [];
  let where = "storyboard";

  const sceneIdx = (id: string) => {
    const i = sb.scenes.findIndex((s) => s.id === id);
    if (i < 0) throw new Error(`${where}: unknown scene "${id}"`);
    return i;
  };
  const endScene = sb.end?.scene ? sceneIdx(sb.end.scene) : sb.scenes.length - 1;
  const videoEnd = (): number => sceneStart(endScene) + Math.round((sb.end?.tailSec ?? 4) * fps);

  const anchor = (a: Anchor, defKind: EventKind | null, isUntil = false): number => {
    const kind = a.kind ?? defKind;
    const def = kind ? KINDS[kind] : { offset: 0, edge: "start" as const };
    let f: number;
    if ("word" in a) {
      const off = a.offset ?? (isUntil ? 0 : Math.round(def.offset * fps / 25));
      try {
        f = cueFrame({ cues: idx, word: a.word, nth: a.nth, edge: a.edge ?? def.edge, offset: off }) + leadF;
      } catch {
        throw new Error(`${where}: word "${a.word}"${a.nth ? "#" + a.nth : ""} not found in the voice-over cues`);
      }
    } else {
      const off = a.offset ?? 0;
      if ("sec" in a) f = Math.round(a.sec * fps) + off;
      else if ("after" in a) f = sceneEnd(sceneIdx(a.after)) + off;
      else f = videoEnd() + off;
    }
    if (a.snap && mIdx) f = a.snap === "eighth" ? mIdx.snapToEighth(f) : mIdx.snapToBeat(f);
    return f;
  };

  function sceneStart(i: number): number {
    const s = sb.scenes[i];
    const hit = startCache.get(s.id);
    if (hit !== undefined) return hit;
    if (stack.includes(s.id)) throw new Error(`cyclic anchors through scene "${s.id}"`);
    stack.push(s.id);
    const prev = where;
    where = `scene "${s.id}" start`;
    const f = anchor(s.start, sync.defaultCutKind);
    where = prev;
    stack.pop();
    startCache.set(s.id, f);
    return f;
  }
  function sceneEnd(i: number): number {
    const s = sb.scenes[i];
    if (s.end) {
      const prev = where;
      where = `scene "${s.id}" end`;
      const f = anchor(s.end, null, true);
      where = prev;
      return f;
    }
    return i + 1 < sb.scenes.length ? sceneStart(i + 1) : videoEnd();
  }

  const walk = (v: unknown, key: string | null, base: number): unknown => {
    if (typeof v === "string") {
      if (ASSET.test(v)) {
        const p = publicPath(slug, v);
        assets.add(p);
        return p;
      }
      return v;
    }
    if (Array.isArray(v)) return v.map((x) => walk(x, null, base));
    if (v && typeof v === "object") {
      if (key && ANCHOR_KEY.test(key) && isAnchor(v)) return anchor(v, "object", /(until)$/i.test(key)) - base;
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, k, base)]));
    }
    return v;
  };

  const scenes: ResolvedScene[] = sb.scenes.map((s: Scene, i) => {
    where = `scene "${s.id}"`;
    const start = sceneStart(i);
    const end = sceneEnd(i);
    const events: ResolvedScene["events"] = {};
    for (const e of s.events ?? []) {
      where = `scene "${s.id}" event "${e.id}"`;
      events[e.id] = {
        at: anchor(e.at, e.kind ?? "object") - start,
        ...(e.until ? { until: anchor(e.until, null, true) - start } : {}),
      };
    }
    where = `scene "${s.id}" props`;
    const props = walk(s.props ?? {}, null, start) as Record<string, unknown>;
    let tin = s.transitionIn ?? (i > 0 ? sb.scenes[i - 1].transitionOut : undefined);
    // profiles whose transitions are silent (standard) mute a transition's own SFX unless it sets `sfx` itself
    if (tin && tin.kind !== "cut" && tin.sfx === undefined && !MIX_PROFILES[profile].transitionSfx) tin = { ...tin, sfx: false };
    return { id: s.id, recipe: s.recipe, start, end, dur: Math.max(1, end - start), props, events, transitionIn: tin, ...(s.captionPos ? { captionPos: capPos(s.captionPos) } : {}), seed: `${slug}-${s.id}` };
  });

  // FootageClip: own sound (default on; `audio: false` for B-roll), J-cut `audioLeadF`, bed drop (`bed`: duck | out | keep)
  const clips: ResolvedClip[] = [];
  sb.scenes.forEach((s, i) => {
    const rs = scenes[i];
    const p = rs.props as { src?: unknown; startFromSec?: number; endAtSec?: number; audio?: boolean; audioDb?: number; audioLeadF?: number; bed?: string };
    if (s.recipe !== "FootageClip" || typeof p.src !== "string") return;
    const play = p.audio !== false;
    const bed = p.bed ?? (play ? "duck" : "keep");
    if (!play && bed === "keep") return;
    const from = Math.round((p.startFromSec ?? 0) * fps);
    let at = rs.start - Math.max(0, Math.round(p.audioLeadF ?? 0));
    let srcFrom = from - (rs.start - at);
    if (srcFrom < 0) { at -= srcFrom; srcFrom = 0; } // the file starts too late for the whole lead: shorten it
    const end = p.endAtSec !== undefined ? Math.min(rs.end, rs.start + Math.round((p.endAtSec - (p.startFromSec ?? 0)) * fps)) : rs.end;
    clips.push({ id: s.id, src: p.src, at, srcFrom, len: Math.max(1, end - at), gainDb: p.audioDb ?? 0, play, bedDb: bed === "keep" ? null : bed === "out" ? CLIP_BED_OUT_DB : CLIP_BED_DUCK_DB });
  });

  const trackSrc = (src: string) => {
    const p = publicPath(slug, src);
    assets.add(p);
    return p;
  };
  where = "music";
  const music: ResolvedTrack[] = (sb.music ?? []).map((m) => ({
    ...bedDefaults(profile, m), ...m, src: trackSrc(m.src), in: anchor(m.in, null), out: anchor(m.out, null),
  }));
  // chapter hole: `transitionIn: {kind: "cut", hole}` stops the running bed `hole` frames before the cut; the next cue
  // (a track whose `in` lies within 24 f of the cut) starts the profile's cueAfterCutF from it
  for (const sc of scenes) {
    const hole = sc.transitionIn?.kind === "cut" ? sc.transitionIn.hole : undefined;
    if (!hole) continue;
    const cut = sc.start;
    const next = music.filter((m) => m.kind !== "song" && Math.abs(m.in - cut) <= 24);
    for (const m of music)
      if (m.kind !== "song" && !next.includes(m) && m.in < cut && m.out > cut - hole) m.out = Math.max(m.in + 1, cut - hole);
    for (const m of next) m.in = cut + Math.round(sync.cueAfterCutF * fps / 25);
  }
  // EndCard `silent: true`: all music ends at the card's start (the hard cut leaves digital silence under it)
  for (const [i, s] of sb.scenes.entries()) {
    if (s.recipe !== "EndCard" || s.props?.silent !== true) continue;
    const cut = scenes[i].start;
    for (const m of music) if (m.out > cut) m.out = Math.max(m.in + 1, cut);
    music.splice(0, music.length, ...music.filter((m) => m.in < cut));
  }
  where = "sfx";
  const sfx: ResolvedSfx[] = (sb.sfx ?? []).map((x: SfxItem) => {
    const kit = !/[\/.]/.test(x.src);
    // file clips with a published peak offset: start the clip early so its PEAK lands on the anchor
    const shift = !kit && x.peakSec !== undefined && x.peak !== false ? Math.round(x.peakSec * fps) : 0;
    return { src: kit ? x.src : trackSrc(x.src), kit, at: anchor(x.at, null) - shift, gainDb: x.gainDb, peak: x.peak ?? kit };
  });
  const durationInFrames = Math.max(1, videoEnd());
  const co = typeof sb.captions === "object" ? sb.captions : undefined;
  const captions = sb.captions ? { pos: capPos(co?.pos), ...(co?.replace ? { replace: co.replace } : {}) } : undefined;
  return { slug, fps, format: sb.format ?? "landscape", ...(captions ? { captions } : {}), ...(sb.shortBand?.scale ? { bandScale: sb.shortBand.scale } : {}), safeArea: !!sb.debug?.safeArea, look: sb.look ?? "voxEarworm", profile, leadF, durationInFrames, voGainDb: sb.vo?.gainDb ?? AUDIO_DEFAULTS.narrationGainDb, scenes, music, sfx, ...(clips.length ? { clips } : {}), assets: [...assets] };
};

export { syncF };
