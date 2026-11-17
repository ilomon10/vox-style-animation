import type { CueIndex } from "../../audio";

/**
 * Every key frame of Earworm segment D as a LOCAL frame (global - 2783, = audio-relative), derived from the cue sheet
 * (public/audio/_private/earworm_D.cues.json). Where the cue sheet has no word (interviews, songs, archival voices) or its whisper
 * time is off by more than 2 f the analyst's frame from analysis/earworm-D.md §12 is used and marked "analyst".
 */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const mkEvents = (c: CueIndex) => {
  const w = (t: string, nth = 1) => {
    let n = 0;
    for (const x of c.words) if (norm(x.text) === norm(t) && ++n === nth) return x;
    throw new Error(`cue word not found: ${t}#${nth}`);
  };
  const on = (t: string, nth = 1) => w(t, nth).frame_onset;
  const st = (t: string, nth = 1) => w(t, nth).frame_start;
  const en = (t: string, nth = 1) => w(t, nth).frame_end;
  const E = {
    // S22 NKC (cut = blur-through at 0): pan keys 2785-2800, bars wipe 2804, bars gate by loudness
    panKeys: [2, 4, 6, 9, 11, 13, 15, 17], // analyst: 8 drawings f2785-2800 (local)
    barsWipe: 21, // analyst 2804 = "Nat" 2801 / tracker beat
    cutInterview1: 142, // analyst 2925: voice onset 2922 + J 3 f
    // act break (DipToBlack act): black at the last word end + 3, voice restarts on "Their"
    dipAt: en("songs") + 3 - 18, // 214 = fade start; black0 = last word end + 3 = 232
    restart: st("Their") - 1, // 249: picture + voice restart on one frame
    needleStart: st("Their") + 1, // 251: +1
    needlePeak: st("awesome") + 5, // 271: stressed "awesome," +5 (analyst)
    pullAt: st("awesome") + 3, // 269
    propsAt: st("goes") - 7, // 304: props slide in over "goes much deeper than that"
    cutInterview2: st("construct") + 3, // 373: cut on the stressed word +5 f
    cutRecord: 464, // analyst 3247: interviewee's last word ends 3246 (no cue word), +1
    scopeOff: 544, // analyst 3327
    recordDrop: 540, // analyst 3323
    lyric: { youre: 482, my: 488, an: 505, gel: 528 }, // analyst 3265 / 3271 / 3288 / 3311 (sung onsets +3 / +1 / 0 / -5)
    // S26
    cutStage: st("So"), // 548: 11 f before the "So," sibilant (559), picture first
    boombox: st("So") + 5, // 553: "So," -6
    singer: on("you") + 4, // 575
    zoomOut: on("you") - 4, // 567: the stage zoom-out starts before the singer rises (reference first change 567)
    pieces: st("smooth") + 5, // 588
    rise: { R: st("soulful") + 1, and: st("soulful") + 7, B: st("soulful") + 11 }, // 605 / 611 / 615
    swap: 658, // analyst 3442 (=659): roll peak speed, whoosh peak; -1 because the kit roll peaks 2 f late vs the reference (measured 661 vs 659)
    djD: 677, djJ: 678, // analyst 3460 / 3467; the reference detector sees blue in the J region at 677
    djSink: st("else") + 1, // 764
    recap: on("really") - 9, // 783: the reference collage starts converging at 786 (frame-difference detector), analyst 793
    defocus: st("The", 5), // 848
    phoneIn: st("call") + 5, // 854: oversized blurred phone appears
    cutPhone: st("call") + 8, // 857: the hard cut the reference detector finds (f3640); the blurred phone shows from 854
    handset: en("dedications"), // 880
    // S27 kinetic voice: caller syllables (analyst, whisper has two words on one onset) minus the 4 f lead
    kin: { did: 886, you: 889, want: 891, to: 893, something: 897, yes: 911, feed: 916, yes2: 918, dont: 952, stop: 961, ever: 968, lovin: 974, me: 981 },
    glitchAt: en("me") + 8 - 10, // zoom-blur dip starts 10 f before the cut on the bass hit
  };
  return E;
};
export type Events = ReturnType<typeof mkEvents>;
