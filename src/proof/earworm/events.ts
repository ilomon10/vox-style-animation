import type { CueIndex } from "../../audio";
import { SYNC } from "../../audio";
import type { CaptionToken } from "../../earworm";

/**
 * Every visual key of Earworm segment A as a GLOBAL frame, derived from the cue sheet (public/audio/_private/earworm_A.cues.json)
 * + the measured SYNC offsets. Where the whisper word start/onset is off by > 2 f (checked against analysis/earworm-A.md §12) the
 * analyst's anchor is used and the line says so. Nothing is a bare frame number except where marked "analyst".
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
  /** nearest bed onset (bass note / hat) in the cue sheet to a frame measured by the analyst: events inside VO pauses land on these */
  const onset = (f: number, tol = 2) => {
    let b = f;
    let d = 99;
    for (const o of c.onsets) if (Math.abs(o - f) < d) { d = Math.abs(o - f); b = o; }
    return d <= tol ? b : f;
  };
  /** song start = first frame whose total envelope jumps above −10 dBr after the crackle (hard entry, f412–413) */
  const env = c.cues.envelope.total;
  let song = 412;
  for (let f = 405; f < 430; f++) if (env[f] > -10) { song = f - 1; break; }

  const E = {
    // ── shot 1 ──
    digits: { six: on("year") + SYNC.entranceF, one: on("is", 1), seven: on("is", 1), nine: on("is", 1) + 2 }, // f5 / 8 / 8 / 10
    stageAt: 16,
    homeAt: en("1976", 1) + 8, // graphic complete 8 f after the keyword ends (SYNC.entranceCompleteMaxF)
    split: on("place") - 2, // "place" + bass note f66
    seed: st("is", 2) - 1, // whisper start (onset is 3 f late)
    capitol: st("Washington", 1) + 6, // analyst: +6
    rows: on("D", 1) + SYNC.entranceF,
    news: st(".C.,", 1) + 3, // "DC," 96 → f99
    scribble: on("Howard") - 29, // f106 (keys between the two keyword hits)
    car: on("and") - 3, // f115
    strips: on("and") + 3, // f121
    unfoldDone: on("and") + 5,
    whip: onset(163) + SYNC.entranceF, // bass note f163 in the VO pause (+1)
    cardLand: st("their"), // whisper start = analyst anchor 183.5
    labelCursor: onset(212) - 1, // bass f212 (−1)
    pushStart: en("WHUR") - 2, // end of "WHUR."
    pushStop: st("Washington", 2), // the stressed word: stop dead (whisper start = analyst f291; onset is 1 f late)
    iris: 0,
    cut2: 0, // set below
    // ── shot 2 ──
    digitRise: st("1976", 2) - 4,
    recordIn: en("this", 1), // "this." ends 389 = the bed's last hit
    songStart: song,
    sinks: { seven: song + SYNC.lyricLagF + 1, six: song + 9, nine: c.snapToEighth(song + 17, 2) }, // 414 / 421 / 429
    crashStart: st("what's") - 10, // first drawing f448 (the reference frame differences: 448, 452, 454, 457, 459, 461, 463); "what's" whisper start 458
    dim: st("is", 3) + 1, // "is" → isolation (+1…+2)
    recordSink: st("Chocolate") - 2,
    ccSplit: st("Chocolate") + 6,
    unpackDone: en("City") + 8,
    credit: st("Parliament", 1) + 5,
    // ── shot 3 ──
    cut3: st("In", 2),
    pullPeak: 705, // analyst: "In" energy
    pullStop: 723,
    pullOut: 0,
    end: 791,
  };
  E.cut2 = c.phrases[6].frame_start + 2; // "DC," phrase start; whisper is 2 f early (energy f316)
  E.iris = E.cut2 - 2;
  E.pullOut = c.phrases[c.phrases.length - 1].frame_end + 2;
  return E;
};
export type Events = ReturnType<typeof mkEvents>;

/**
 * Karaoke tokens for the archival vocal: cue words with the vocal onset (refined). Whisper is off by 3–6 f on a few words of the SONG
 * (it is sung/spoken over a groove), so those use the analyst's vocal onsets (§12 caption table) — marked "A".
 */
export const vocalTokens = (c: CueIndex): CaptionToken[] => {
  const W = c.words.filter((x) => x.frame_onset >= 455 && x.frame_onset <= 600 && x.text.trim() !== "Oh,");
  /** cue onset of the nth word `t`; replaced by the analyst's measured vocal onset `a` when whisper is off by more than 1.5 f */
  const o = (t: string, a: number, nth = 1) => {
    let n = 0;
    for (const x of W) if (norm(x.text) === norm(t) && ++n === nth) return Math.abs(x.frame_onset - a) <= 1.5 ? x.frame_onset : a;
    return a;
  };
  const T = (text: string, f: number, extra: Partial<CaptionToken> = {}): CaptionToken => ({ text, f, ...extra });
  return [
    T("WHAT'S", 456 /* A: the first caption of the quote leads the voice by 1.5 f (458.5 → f457), it rides the crash push */), T("HAPPENING", o("happening", 462)), T("CC", o("c", 470, 1)),
    T("THEY", o("they", 497.5), { phraseStart: true }), T("STILL", o("still", 502.5)), T("CALL", o("call", 506.5)), T("IT", o("it", 512.5, 1)),
    T("THE", o("the", 516.5, 1), { phraseStart: true }), T("WHITE", o("white", 519)), T("HOUSE", o("house", 523.5)),
    T("BUT", o("but", 532.5), { phraseStart: true }), T("THAT'S", o("that's", 534.5)), T("A", o("a", 541.5)),
    T("TEMP", o("temporary", 543)), T("ORARY", 550, { joinPrev: true }),
    T("CON", o("condition", 549.5), { phraseStart: true }), T("DI", 556, { joinPrev: true }), T("TION", 559, { joinPrev: true }),
    T("TOO", o("too", 562.5)),
    T("CAN", o("can", 573.5), { phraseStart: true }), T("YOU", o("you", 575.5, 1)), T("DIG", o("dig", 578.5)), T("IT ,", o("it", 582.5, 2)),
    T("CC", o("c", 588, 3)), T("?", 594),
  ];
};
