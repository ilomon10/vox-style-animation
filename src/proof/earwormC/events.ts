import type { CueIndex } from "../../audio";
import { dropPlan } from "../../earworm/fx";

/**
 * Every visual key of Earworm segment C as a LOCAL frame (0 = global f1740 = the start of earworm_C.wav; the cue file is local too),
 * derived from the cue sheet + the analyst's hand-measured onsets (analysis/earworm-C.md §12/§15: whisper is off by up to 13 f here, esp. the crane
 * narration and "Melvin"). Lines marked "A" use the analyst's global frame (G); the rest hang off a cue word.
 */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
/** analyst GLOBAL frame → local */
export const G = (global: number) => global - 1740;

export const mkEvents = (c: CueIndex) => {
  const w = (t: string, nth = 1) => {
    let n = 0;
    for (const x of c.words) if (norm(x.text) === norm(t) && ++n === nth) return x;
    throw new Error(`cue word not found: ${t}#${nth}`);
  };
  const on = (t: string, nth = 1) => w(t, nth).frame_onset;
  const st = (t: string, nth = 1) => w(t, nth).frame_start;
  const en = (t: string, nth = 1) => w(t, nth).frame_end;

  // ── title cards ──
  const cutPoetry = on("poetry") + 8; // 34 (illustrating cut: onset +7.5)
  const cutNews = en("shows") + 4; // 70 (two-word card: after the second word ends)
  const fadeStart = on("1976.") + 7; // 157: first changed frame 158 = onset +7.5
  const drop = dropPlan(fadeStart); // black0 184, restart 197 = the music starts on this frame
  const E = {
    cutPoetry,
    contractSpeeches: on("poetry") + 2, // 28: next-word trigger
    poetPop: cutPoetry + 3, // 37: first drawing is held 3 f
    contractPoetry: en("shows") - 4, // 62 = bed-2 pre-lap
    cutNews,
    newsSettle: cutNews + 25,
    fadeStart,
    black0: drop.black0,
    restart: drop.restart,
    // ── crane (A: narration anchors, global frames) ──
    label: drop.restart, // wipe starts on the music frame; complete 1941 = restart + 4
    pullBackEnd: drop.restart + 25,
    crane1Start: on("massively") + 5, // 236 = A 1976
    crane1End: G(2103),
    crane2Start: G(2103),
    crane2End: G(2202),
    dollyStart: G(2240), // "music," + 6
    dollyEnd: G(2284),
    buildEnd: G(2381),
    cross: { minimoog: G(2044), reels: G(2080), trumpet: G(2148), guitar: G(2156), sax: G(2199) },
    // ── Melvin ──
    dissolve: en("1960s.") + 10, // 642 = A 2382
    dissolveEnd: G(2388),
    tiltEnd: G(2412),
    pullOut: G(2468),
    cutMelvin: st("smooth") + 1, // 736 (A 2476, "smooth" 2475.5)
    lp: G(2489),
    labelIn: G(2493),
    scrap: G(2505),
    scribble: G(2541),
    pushOut: G(2621),
    // ── Vaughan ──
    cutVaughan: on("Thanks,") - 1, // 895
    maskLift: G(2634),
    nameLabel: en("Vaughan.") + 1, // 911: end of the spoken name −1
    dots: en("Vaughan.") - 1,
    mic: G(2654),
    micDone: G(2666),
    firstNote: G(2665),
    cover: G(2770),
    end: 1043,
  };
  return E;
};
export type Events = ReturnType<typeof mkEvents>;
