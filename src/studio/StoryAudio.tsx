import React, { useMemo } from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { AUDIO_DEFAULTS, MusicBed, Narration, SongExcerpt, Sfx, buildDuckCurve, dbToGain, musicGainAt, type CueIndex } from "../audio";
import { SfxAtPeak, type SfxName } from "../earworm/fx";
import type { ResolvedClip, ResolvedSfx, ResolvedTrack } from "./resolve";

/** the bed comes down over 0.16 s when a clip's sound starts and back up over 0.4 s after it ends */
const CLIP_BED_ATTACK_S = 0.16;
const CLIP_BED_RELEASE_S = 0.4;

/** A music bed that also drops under clip sound: identical to <MusicBed> times the clip windows' gain (`windows` are bed-local frames, dB). */
const ClipDuckedBed: React.FC<{
  src: string; gainDb?: number; len: number; fadeIn: number; fadeOut: number; cues?: CueIndex; narrationOffset: number;
  duck: { duckDb?: number; attackFrames?: number; releaseFrames?: number };
  windows: { from: number; to: number; db: number }[];
}> = ({ src, gainDb, len, fadeIn, fadeOut, cues, narrationOffset, duck, windows }) => {
  const { fps } = useVideoConfig();
  const curve = useMemo(() => {
    if (!cues) return null;
    const mask = cues.speechMask();
    return buildDuckCurve(Array.from({ length: len }, (_, f) => mask[f - narrationOffset] ?? 0), len, fps, duck);
  }, [cues, len, fps, narrationOffset, duck.duckDb, duck.attackFrames, duck.releaseFrames]);
  const attack = Math.max(1, Math.round(CLIP_BED_ATTACK_S * fps));
  const release = Math.max(1, Math.round(CLIP_BED_RELEASE_S * fps));
  const clipDb = (f: number) =>
    windows.reduce((db, w) => db + w.db * Math.min(1, Math.max(0, Math.min((f - w.from) / attack, (w.to + release - f) / release))), 0);
  return <Audio src={staticFile(src)} volume={(f) => musicGainAt(curve, f, len, fps, { gainDb, fadeIn, fadeOut }) * dbToGain(clipDb(f))} />;
};

/** The soundtrack of a storyboard: narration (+ cues provider), music beds ridden under the voice with the measured duck, song excerpts, SFX. */
export const StoryAudio: React.FC<{
  vo: string; cues: CueIndex; leadF: number; voGainDb: number; music: ResolvedTrack[]; sfx: ResolvedSfx[]; clips?: ResolvedClip[]; missing: ReadonlySet<string>;
}> = ({ vo, cues, leadF, voGainDb, music, sfx, clips = [], missing }) => {
  const { fps } = useVideoConfig();
  const sec = (s: number | undefined, d: number) => Math.round((s ?? d) * fps);
  return (
    <>
      <Sequence from={leadF} layout="none" name="narration"><Narration src={vo} cues={cues} gainDb={voGainDb} /></Sequence>
      {music.filter((m) => !missing.has(m.src)).map((m) => {
        const len = Math.max(1, m.out - m.in);
        if (m.kind === "song")
          return <SongExcerpt key={m.id} src={m.src} in={m.in} out={m.out} startFrom={sec(m.startFromSec, 0)} gainDb={m.gainDb ?? 0} fadeFrames={sec(m.fadeOutSec, AUDIO_DEFAULTS.songFadeS)} />;
        const ride = m.ride === undefined ? true : m.ride;
        const r = typeof ride === "object" ? ride : {};
        // clip windows overlapping this bed (bed-local frames); beds without any play through <MusicBed> exactly as before
        const windows = clips
          .filter((c) => c.bedDb !== null && c.at < m.out && c.at + c.len > m.in)
          .map((c) => ({ from: c.at - m.in, to: c.at + c.len - m.in, db: c.bedDb as number }));
        if (windows.length)
          return (
            <Sequence key={m.id} from={m.in} durationInFrames={len} layout="none" name={`music ${m.id} (clip drop)`}>
              <ClipDuckedBed
                src={m.src} gainDb={m.gainDb} len={len} fadeIn={sec(m.fadeInSec, AUDIO_DEFAULTS.musicFadeInS)} fadeOut={sec(m.fadeOutSec, AUDIO_DEFAULTS.musicFadeOutS)}
                cues={ride ? cues : undefined} narrationOffset={leadF - m.in}
                duck={{ duckDb: r.duckDb, attackFrames: r.attackSec !== undefined ? Math.round(r.attackSec * fps) : undefined, releaseFrames: r.releaseSec !== undefined ? Math.round(r.releaseSec * fps) : undefined }}
                windows={windows}
              />
            </Sequence>
          );
        return (
          <Sequence key={m.id} from={m.in} durationInFrames={len} layout="none" name={`music ${m.id}`}>
            <MusicBed
              src={m.src} gainDb={m.gainDb} durationInFrames={len}
              fadeIn={sec(m.fadeInSec, AUDIO_DEFAULTS.musicFadeInS)} fadeOut={sec(m.fadeOutSec, AUDIO_DEFAULTS.musicFadeOutS)}
              duckUnder={ride ? cues : undefined} narrationOffset={leadF - m.in}
              duckDb={r.duckDb} attackFrames={r.attackSec !== undefined ? Math.round(r.attackSec * fps) : undefined} releaseFrames={r.releaseSec !== undefined ? Math.round(r.releaseSec * fps) : undefined}
            />
          </Sequence>
        );
      })}
      {clips.filter((c) => c.play && !missing.has(c.src)).map((c) => (
        <Sequence key={`clip-${c.id}`} from={c.at} durationInFrames={c.len} layout="none" name={`clip sound ${c.id}`}>
          <Audio src={staticFile(c.src)} startFrom={c.srcFrom} volume={dbToGain(c.gainDb)} />
        </Sequence>
      ))}
      {sfx.filter((x) => x.kit || !missing.has(x.src)).map((x, i) =>
        x.kit
          ? <SfxAtPeak key={i} name={x.src as SfxName} {...(x.peak ? { peak: x.at } : { start: x.at })} gainDb={x.gainDb} />
          : <Sfx key={i} at={x.at} src={x.src} gainDb={x.gainDb} />)}
    </>
  );
};
