import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { SongExcerpt } from "../../audio/Soundtrack";
import { ease } from "../../tokens/easing";
import { SfxList, type SfxPlacement } from "./sfx";
import { clamp01 } from "./util";

/**
 * Song intro (earworm-D s12/s13 #21-28, earworm-B): the picture of the SOURCE (record, artist tag) is up >= 20 f before the song;
 * the collage flies in over <= 12 f and finishes 3 f before the needle thump; 11 f of crackle; the song starts HARD (no fade)
 * on a beat. `songFrom` should be a beat of the song file (source frame).
 */
export const SONG_INTRO = { sourceLead: 30, flyIn: 12, flyEndsBeforeThump: 3, crackle: 11 } as const;

export type SongIntroTimes = { sourceStart: number; flyStart: number; flyEnd: number; thump: number; crackleEnd: number; song: number; sfx: SfxPlacement[] };

/** `song` = frame the song starts. Thump at song - 11, crackle runs thump..song. */
export const songIntroPlan = (song: number, sourceLead: number = SONG_INTRO.sourceLead): SongIntroTimes => {
  const thump = song - SONG_INTRO.crackle;
  const flyEnd = thump - SONG_INTRO.flyEndsBeforeThump;
  return {
    sourceStart: song - sourceLead, flyStart: flyEnd - SONG_INTRO.flyIn, flyEnd, thump, crackleEnd: song, song,
    sfx: [
      { name: "needle_drop", peak: thump },
      { name: "vinyl_crackle", start: thump, durationInFrames: SONG_INTRO.crackle },
    ],
  };
};

export type SongIntroProps = {
  /** frame the song starts, relative to the enclosing Sequence */
  at: number;
  /** picture of the source (record + credit); shown from `at - sourceLead` */
  source: React.ReactNode;
  /** collage flying in; gets 0..1 progress (ease-out, <= 12 f) */
  fly?: (p: number) => React.ReactNode;
  song?: { src: string; startFrom?: number; length: number; gainDb?: number };
  sourceLead?: number;
};

export const SongIntro: React.FC<SongIntroProps> = ({ at, source, fly, song, sourceLead }) => {
  const t = songIntroPlan(at, sourceLead);
  const f = useCurrentFrame();
  const p = ease("enter")(clamp01((f - t.flyStart) / SONG_INTRO.flyIn));
  return (
    <AbsoluteFill>
      <Sequence from={Math.max(0, t.sourceStart)} layout="none">{source}</Sequence>
      {fly && f >= t.flyStart && <AbsoluteFill>{fly(p)}</AbsoluteFill>}
      <SfxList items={t.sfx} />
      {song && <SongExcerpt src={song.src} startFrom={song.startFrom} in={at} out={at + song.length} fadeFrames={0} gainDb={song.gainDb} />}
    </AbsoluteFill>
  );
};
