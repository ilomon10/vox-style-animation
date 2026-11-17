import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { KaraokeCaption, VinylRecord } from "../../earworm";
import { FlyInGlyphs, type CaptionToken } from "../../earworm";
import { ease } from "../../tokens/easing";
import { voxEarworm } from "../../tokens/colors";
import { earwormType, typeStyle } from "../../tokens/type";
import { capTrim } from "../../type/shared";
import { distressMask } from "../../earworm";
import { Pieces, DIGIT_LEFT, DIGIT_TOP, SPLIT } from "./Shot1";
import type { Events } from "./events";
import { World, lerp, stepE } from "./shared";


/** the collage again, re-framed larger (×1.24) and cut mid-unfold: pieces start already opening (earworm-A §8 "Cut onto a mid-build collage") */
const COLLAGE_FRAME = { s: 1.1, x: -56, y: -34 };
const FLY_HOME = [{ start: -99, from: { x: 0, y: 0 }, stage: { x: 0, y: 0 } }, { start: -99, from: { x: 0, y: 0 }, stage: { x: 0, y: 0 } }, { start: -99, from: { x: 0, y: 0 }, stage: { x: 0, y: 0 } }, { start: -99, from: { x: 0, y: 0 }, stage: { x: 0, y: 0 } }];

/** caption role: the kit's distress mask eats ≈40 % of the glyph ink, so the weight is raised to 600 to reach the measured ink (p99 200, 11.5 k px > 150) */
const ROLE = { ...earwormType.caption, weight: 600, color: "#CFCECF" };

export const Shot2: React.FC<{ E: Events; tokens: CaptionToken[] }> = ({ E, tokens }) => {
  const f = useCurrentFrame();
  const S2_START = E.cut2;
  const gf = f + S2_START;
  // pieces: local unfold times (negative = already opening at the cut; settled by f346 = local 30)
  const E2 = { ...E, seed: S2_START - 6, capitol: S2_START - 2, rows: S2_START + 2, news: S2_START + 5, scribble: S2_START + 8, car: S2_START + 10, strips: S2_START + 12 } as Events;

  // digit rise (f326–341) from behind the pieces, then sinks on the song's pulse (7 → 6 → 19)
  const riseP = stepE(gf, E.digitRise, 15, ease("enter"));
  const sink = (t0: number) => stepE(gf, t0, 5, ease("exit"));
  const DEEP = 800;
  const off = (i: number) => {
    const s = i === 2 ? sink(E.sinks.seven) : i === 3 ? sink(E.sinks.six) : sink(E.sinks.nine);
    const grp = i < 2 ? SPLIT.a : SPLIT.b;
    return { x: grp.x, y: grp.y + (1 - riseP) * DEEP + s * DEEP };
  };
  const hidden = gf < E.digitRise;
  const glyphs = (idx: number[]) =>
    hidden ? null : <FlyInGlyphs text="1976" fly={FLY_HOME} left={DIGIT_LEFT} top={DIGIT_TOP} stageAt={0} homeAt={1} indices={idx} offset={off} />;

  // drift: tx −77 px while the pieces finish unfolding (the reference picture is static from f350; analyst: over 72 f)
  const drift = -77 * stepE(f, 0, 34);

  // crash push: record Ø735 → 2000 (×2.72) and 1074 px down. Read off the reference's frame differences: drawings at f448 (creep), 452, 454, 457, 459, 461, 463;
  // log-progress .27 (f457) .81 (f459) .98 (f461) 1 (f463), earworm-A §7
  const CRASH: [number, number][] = [[0, 0.01], [4, 0.05], [6, 0.12], [9, 0.27], [11, 0.81], [13, 0.98], [15, 1]];
  let cp = 0;
  if (gf >= E.crashStart) for (const [t, v] of CRASH) if (gf - E.crashStart >= t) cp = v;
  const crashed = gf >= E.crashStart + 15;
  // record sink-out: ease-in, 14 f
  const sinkRec = gf < E.recordSink ? 0 : stepE(gf, E.recordSink, 14, (t) => t * t) * 560;

  const recLocal = E.recordIn - S2_START;
  const showRecord = gf >= E.recordIn && gf < E.recordSink + 14;
  const cap = ROLE.cap;

  // keyword isolation → CHOCOLATE CITY (f613–644) and the credit drop (f679)
    const caps = { ...typeStyle({ ...ROLE, leading: 1 }), ...capTrim };

  return (
    <>
      {gf < E.crashStart + 17 && (
        <World scale={COLLAGE_FRAME.s} pivot={[0, 0]} x={COLLAGE_FRAME.x + drift} y={COLLAGE_FRAME.y}>
          <World scale={lerp(1, 2.72, cp)} pivot={[965, 543]} y={1074 * cp}>
            <Pieces E={E2} t0={S2_START} digits={glyphs([0, 1])} digits76={glyphs([2, 3])} />
          </World>
        </World>
      )}
      {showRecord && (
        <World scale={lerp(1, 2.72, cp)} pivot={[965, 543]} y={1074 * cp + sinkRec}>
          <Sequence from={recLocal} layout="none"><VinylRecord cx={965} cy={543} diameter={735} /></Sequence>
        </World>
      )}
      {crashed || gf >= E.crashStart ? (
        <Sequence from={E.crashStart - S2_START - 0} durationInFrames={E.dim + 1 - E.crashStart} layout="none">
          <KaraokeCaption tokens={tokens.map((t) => ({ ...t, f: t.f - E.crashStart }))} mode="sung" maxChars={24} gridPerLine role={ROLE} />
        </Sequence>
      ) : null}
      <Isolate E={E} gf={gf} cap={cap} caps={caps} />
      {gf >= E.credit && (
        <div style={{ position: "absolute", left: 600, width: 720, top: 590, height: 90, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute", left: 0, width: 720, textAlign: "center", top: 10 + -70 * (1 - stepE(gf, E.credit, 5, ease("enter"))),
              ...typeStyle({ ...earwormType.serifLine, cap: 58, color: voxEarworm.accentDeep, leading: 1 }),
            }}
          >
            Parliament
          </div>
        </div>
      )}
    </>
  );
};

const LINE = ["CAN", "YOU", "DIG", "IT", ",", "CC", "?"];
/** line scroll → keyword isolation (f613–623) then "CC" splits (f626), spreads (f629) and types outward into CHOCOLATE CITY by f644.
 *  Sequence read frame by frame from the reference (f609–639): punctuation dims first, then CAN YOU DIG IT → 35 %, the previous line thins out,
 *  CAN and the punctuation go, YOU DIG IT go, CC stays where it was. */
const Isolate: React.FC<{ E: Events; gf: number; cap: number; caps: React.CSSProperties }> = ({ E, gf, cap, caps }) => {
  const rel = gf - E.dim;
  if (rel < 1 || gf >= E.ccSplit + 19 + 100) return null;
  const top = 580 - cap;
  const base: React.CSSProperties = { position: "absolute", left: 0, width: 1920, textAlign: "center", whiteSpace: "pre", ...caps, ...distressMask(0, 0) };
  if (rel < 11) {
    const op = (w: string) => {
      const punct = w === "," || w === "?";
      if (rel < 1) return 1;
      if (rel < 3) return punct ? 0.35 : 1;
      if (w === "CC") return 1;
      if (rel >= 5 && (punct || w === "CAN")) return 0;
      return 0.35;
    };
    return (
      <>
        {rel < 5 && (
          <div style={{ ...base, top: top - 1.6 * cap, opacity: 0.35 }}>{rel < 3 ? "CONDITION TOO" : "           TOO"}</div>
        )}
        <div style={{ ...base, top }}>
          {LINE.map((w, i) => (
            <span key={i} style={{ display: "inline-block", marginLeft: i ? cap * 0.5 : 0, opacity: op(w) }}>{w}</span>
          ))}
        </div>
      </>
    );
  }
  const r = gf - E.ccSplit;
  const CC_X = 1310;
  const span = (txt: string, x: number, anchor: "c" | "l") => (
    <div style={{ position: "absolute", top, left: x, transform: anchor === "c" ? "translateX(-50%)" : undefined, whiteSpace: "pre", ...caps, ...distressMask(0, 0) }}>{txt}</div>
  );
  if (r < 0) return span("CC", CC_X, "c");
  if (r < 3) return <>{span("C", CC_X - 22, "c")}{span("C", CC_X + 22, "c")}</>;
  // [frames after the split, word-1 left edge, second C centre]
  const keys: [number, number, number][] = [[3, 1100, 1377], [7, 720, 1374], [9, 650, 1340], [11, 640, 1340], [13, 630, 1215]];
  let k = keys[0];
  for (const q of keys) if (r >= q[0]) k = q;
  const reveal = [0, 6, 8, 8, 9, 9, 9, 12, 13]; // CHOCOLATE: frames after the split each letter shows
  const w1 = Array.from("CHOCOLATE").map((ch, j) => (j === 0 || r >= reveal[j] ? ch : " ")).join("");
  const rev2 = [0, 15, 17, 18];
  const w2 = Array.from("CITY").map((ch, j) => (j === 0 || r >= rev2[j] ? ch : " ")).join("");
  return <>{span(w1, k[1], "l")}{span(w2, k[2] - (r >= 13 ? 25 : 0), r >= 13 ? "l" : "c")}</>;
};
