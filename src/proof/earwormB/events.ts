import type { CueIndex } from "../../audio";
import { SYNC } from "../../audio";

/**
 * Every visual key of Earworm segment B as a LOCAL frame (composition frame 0 = global f791), derived from the cue sheet
 * (public/audio/_private/earworm_B.cues.json, frames are local) + the measured SYNC offsets (analysis/earworm-B.md §12, §15).
 * The whisper word starts are off by up to 16 f in this segment (§0): where the cue word differs from the analyst's hand-measured
 * anchor by more than 2 f the analyst's frame is used and the line says so (marked "analyst"). `g(…)` converts a global frame.
 */
export const G0 = 791;
export const g = (global: number) => global - G0;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const mkEvents = (c: CueIndex) => {
  const w = (t: string, nth = 1) => {
    let n = 0;
    for (const x of c.words) if (norm(x.text) === norm(t) && ++n === nth) return x;
    throw new Error(`cue word not found: ${t}#${nth}`);
  };
  const on = (t: string, nth = 1) => w(t, nth).frame_onset;
  const stress = (t: string, nth = 1) => w(t, nth).frame_stress;
  /** nearest bed onset (bass note / hat) in the cue sheet to a frame measured by the analyst */
  const onset = (f: number, tol = 2) => {
    let b = f;
    let d = 99;
    for (const o of c.onsets) if (Math.abs(o - f) < d) { d = Math.abs(o - f); b = o; }
    return d <= tol ? b : f;
  };
  const eighth = (f: number, tol = 2) => c.snapToEighth(f, tol);

  const E = {
    // ── 4a (f791–857): pull-out-through from segment A ──
    cut: 0,
    albumIn: on("album"), // "album" onset (797)
    hit: onset(g(855.25)), // the tonal chord hit f855
    accel: 0, // = hit − 6 (anticipation, §12 #3)
    // ── 4b (f858–963): zoom-out reveal, DC collage ──
    burst: g(862), // analyst: first new piece (f862); the narrator's first word is at 860.5 (cue "Washington" is 6.5 f late)
    typeChoc: g(876), // "was" 875.5 (analyst; cue "was" 878) — CHOCOLATE starts typing on the preceding word
    typeCityDone: on("chocolate", 1), // CITY complete as "chocolate" starts (899, −0.5)
    ring: g(904), // starts 903–905 and closes on "city" 909.5 +1.5 (911, analyst: the cue word is 5 f late)
    zoomRest: g(918), // phrase end 918
    beam: on("Right") - 3, // vocal "Right" 927 → beam attack starts +3.25 after the song cut-in (924)
    beamEnd: g(957), // analyst: vocal end ≈957 (release +3 f)
    // ── 4c-1 (f964–1004): photo slam, torn-edge boil, swaps on the 8th grid ──
    slam: 0, // eighth 962.0 + 2 (the slam lands +1.8)
    settle: 0, // eighth 976 (−0.1)
    swaps: [0, 0, 0] as number[], // 989 (beat 989.8 −1), 991 (+1), 997 (eighth 997.1)
    rect: g(1001), // analyst: off the grid by −2.8
    circle: 0, // morph complete: eighth 1004.6 + 0.4
    // ── 4c-2 (f1005–1134): circle crop, type, push, label ──
    george: 0, // eighth 1020.3
    clinton: on("Clinton") + 3, // "Clinton" onset (1030) +3 → 1033; GEORGE complete 1032
    clintonDone: g(1047),
    pushStart: on("really") + 7, // 6 f after the first word of its clause (+0.5…) → 1062
    pushEnd: 0,
    label: g(1072), // analyst: "describing" 1066 (the cue word is 8 f late) + 6
    labelExit: on("post") - 8, // 1124: clears the stage 6.5 f before "post"
    // ── 4d (f1135–1223): kinetic words ──
    post: stress("post"), // 1135 = the stressed syllable, +2.5 after the /p/
    dash: on("industrial"), // 1139
    industrial: stress("industrial") - 2, // 1143 ("-DUS-" 1144, −1)
    flickBlack: 0, // bed hat 1149.8 +1.2 → flicker 1151
    black: 0, // flicker + 4
    urban: 0, // hat 1175.9 + 2 (the soft onset is 1176.5)
    experiences: 0, // hat 1197.9 − 1 (the stressed "-PE-" 1197.75)
    underline: 0,
    // ── 5a (f1224–1332): Fredara ──
    fredara: g(1224),
    cardResolve: g(1244), // "Hadley" ≈1240.5 +3…5.5 → the last glyph settles at 1247 in the reference (analyst; the cue word is 8 f late)
    cardExit: g(1327), // the reference's X starts ≈1326 (picture fade 1328–1332)
    // ── dip to black 1328/1333/1342/1350 ──
    dip: g(1328),
    // ── 5c (f1342–1480): tumble → radio ──
    radioIn: g(1342),
    numerals: 0, // glitch-out 1351 = "The" − 1
    tumble: g(1350),
    flipA: 0, // "and" − 5 (1378)
    flipB: 0, // "and" + 3 (1386)
    cable: 0, // 1396
    vinyl: 0, // 1398
    mic: g(1402),
    news: 0, // "Washington" − 5 (1406)
    // ── 6 (f1481–1618): Angela, J-cut ──
    angela: stress("Although") - 1, // 1481 = voice + 2
    // ── 7 (f1619–1696): WHUR ──
    whur: c.phrases[9].frame_start, // "At the time," 1619 (speaker-change cut leads the narrator by 6)
    pullOut: g(1690), // jazz cue pre-lap bass note 1690.5
    // ── 8 (f1697–1738): JAZZ ──
    jazz: 0, // "ahead" onset 1696 + 1 → keyword cut at the word (1697)
    sparks: g(1706),
    lettersLand: g(1716),
    end: 949,
  };
  E.accel = E.hit - 6;
  E.slam = eighth(g(962)) + 2;
  E.settle = eighth(g(976));
  E.swaps = [eighth(g(989.8)) - 1 + 0, eighth(g(989.8)) + 1, eighth(g(997.1))];
  E.circle = eighth(g(1004.6)) + 0;
  E.george = eighth(g(1020.3));
  E.pushEnd = E.pushStart + 50;
  E.flickBlack = onset(g(1149.8)) + 1;
  E.black = E.flickBlack + 4;
  E.urban = onset(g(1175.9)) + 2;
  E.experiences = onset(g(1197.9)) - 1;
  E.underline = E.experiences + 4;
  E.numerals = on("The", 4) - 1;
  E.flipA = on("and", 2) - 5;
  E.flipB = on("and", 2) + 3;
  E.cable = on("in") + 1;
  E.vinyl = on("in") + 3;
  E.news = on("Washington", 2) - 5;
  E.jazz = on("ahead") + SYNC.entranceF;
  return E;
};
export type Events = ReturnType<typeof mkEvents>;
