import React from "react";
import { Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FlyInGlyphs, StationLabel, XMark, type GlyphFly } from "../../earworm";
import { useDrawingFrame } from "../../lib/time";
import { ease } from "../../tokens/easing";
import { Capitol, IrisMask, LineMap, Newsprint, Rowhouses, Scribble, Strip, Unfold } from "./art";
import type { Events } from "./events";
import { World, bez, kStep, lerp } from "./shared";

/** digit geometry (analysis/earworm-A.md §4–§5): widths 67/111/95/110, home x 702–1213, cap 205 */
export const DIGIT_LEFT = [702, 803, 976, 1103];
export const DIGIT_TOP = 436;
/** split targets (design px shift of the "19" and "76" groups, measured f80: 19 at x 426 y 255 · 76 at x 1290 y 660) */
export const SPLIT = { a: { x: -276, y: -181 }, b: { x: 314, y: 224 } };

const FLY = (E: Events): GlyphFly[] => [
  // 1: from the left edge · 9: scales in over itself · 7: from below · 6: from the lower right (first fragment f5)
  { start: E.digits.one, from: { x: -560, y: 0 }, stage: { x: -300, y: 0 } },
  { start: E.digits.nine, from: { x: 0, y: -60 }, stage: { x: 60, y: 30 } },
  { start: E.digits.seven, from: { x: 0, y: 900 }, stage: { x: 0, y: 330 } },
  { start: E.digits.six, from: { x: 690, y: 300 }, stage: { x: 560, y: 0 } },
];

/** the collage's pieces in world px (S1 framing, measured f160) */
export const Pieces: React.FC<{ E: Events; t0: number; digits: React.ReactNode; digits76: React.ReactNode }> = ({ E, t0, digits, digits76 }) => (
  <>
    {digits}
    <Unfold at={E.seed - t0} hinge="bottom" style={{ left: 790, top: 625, width: 170, height: 175 }}><Scribble w={170} h={175} seed="scr" /></Unfold>
    <Unfold at={E.seed + 3 - t0} hinge="left" style={{ left: 988, top: 300, width: 235, height: 400 }}><Newsprint w={235} h={400} seed="nr" rot={90} fs={14} /></Unfold>
    <Unfold at={E.capitol - t0} hinge="bottom" style={{ left: 480, top: 75, width: 495, height: 510 }}><Capitol w={495} h={510} /></Unfold>
    <Unfold at={E.rows - t0} hinge="left" style={{ left: 975, top: 470, width: 315, height: 200 }}><Rowhouses w={315} h={200} /></Unfold>
    <Unfold at={E.news - t0} hinge="right" style={{ left: 420, top: 615, width: 360, height: 315 }}><Newsprint w={360} h={315} seed="nl" rot={-90} head="REG" fs={15} /></Unfold>
    <Unfold at={E.scribble - t0} hinge="top" style={{ left: 855, top: 800, width: 135, height: 145 }}><Newsprint w={135} h={145} seed="nlow" fs={11} /></Unfold>
    <Unfold at={E.car - t0} hinge="bottom" style={{ left: 575, top: 755, width: 230, height: 175 }}>
      <Img src={staticFile("assets/cutouts/vintage-car.png")} style={{ width: 230, height: 175, objectFit: "contain", filter: "grayscale(1) contrast(1.15)" }} />
    </Unfold>
    <Unfold at={E.strips - t0} hinge="left" style={{ left: 975, top: 690, width: 495, height: 92 }}><Strip w={495} h={92} color="#8d8d8b" seed="gs" rough={12} /></Unfold>
    {digits76}
    <Unfold at={E.strips - t0 + 2} hinge="left" style={{ left: 975, top: 452, width: 340, height: 14 }}><Strip w={340} h={14} color="#ECEBE7" seed="ws" rough={4} /></Unfold>
    <Unfold at={E.strips - t0 + 4} hinge="left" style={{ left: 1300, top: 470, width: 210, height: 80 }}><Strip w={210} h={80} color="#DAD9D5" seed="wr" rough={10} /></Unfold>
  </>
);

/** the map cards DROP IN from above in stop-motion steps (bottom edge of the satellite card at y 360 / 700 / 912 on f176 / 178 / 180, read off the
 *  reference), then the inner pan = the cards slide down 528 px, decaying ×0.71 per drawing from the landing f184 (153, 104, 75 … px; earworm-A §7) */
const Cards: React.FC<{ E: Events; push: number; swap: boolean; blur: number }> = ({ E, push, swap, blur }) => {
  const f = useCurrentFrame();
  const L = E.cardLand;
  const FINAL = { x: 258, y: 30, w: 948, h: 1412 };
  // upward shift (design px) of the cards relative to their final position
  const lift = f < L - 4 ? (f < L - 6 ? 1082 : 742) : f < L ? 530 : 528 * Math.pow(0.71, kStep(f, L));
  const zoom = lerp(1, 1.9, push);
  const dx = swap ? -60 : 0;
  return (
    <World scale={lerp(1, 1.2, push)} pivot={[700, 620]} blur={blur}>
      <div style={{ position: "absolute", left: FINAL.x, top: FINAL.y - lift, width: FINAL.w, height: FINAL.h, borderRadius: 10, overflow: "hidden", background: "#222" }}>
        <Img
          src={staticFile("assets/cc0/maps/europe-physical-map-bazewicz-1914-1918.jpg")}
          style={{ position: "absolute", left: -900 + dx, top: -700, width: 3200 * zoom, transformOrigin: "0 0", filter: "grayscale(1) contrast(1.4) brightness(0.5)" }}
        />
      </div>
      {f >= L - 4 && (
        <div style={{ position: "absolute", left: 1205, top: 230 - lift, width: 480, height: 650, overflow: "hidden", borderRadius: 6 }}>
          <LineMap w={480} h={650} seed={zoom > 1.3 ? "lm2" : "lm"} />
        </div>
      )}
    </World>
  );
};

export const Shot1: React.FC<{ E: Events }> = ({ E }) => {
  const f = useCurrentFrame();
  const g = useDrawingFrame();
  // whip-out: cumulative offsets per drawing (18, 66, 163, 386, ≈830 = ⅔ of the cluster off-frame, then gone)
  const wk = kStep(f, E.whip);
  const whipX = f < E.whip ? 0 : -[18, 66, 163, 386, 830, 1600][Math.min(5, wk - 1)];
  const collageOn = f < E.cardLand - 8 + 0; // the map tile replaces the collage on f176
  // push: 241 → 291, snapStop ease on 10 dps drawings, ends dead on the keyword
  const pushN = Math.round(((E.pushStop - E.pushStart) * 10) / 25) + 1; // last drawing lands one drawing before the stop frame
  const pk = Math.min(pushN, kStep(f, E.pushStart));
  const push = f < E.pushStart ? 0 : bez(0.4, 0, 0.85, 0.7)(pk / pushN);
  const sp = interpolate(g, [273, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = 15 * Math.max(0, 1 - 2 * Math.abs(sp - 0.5)) * (sp > 0 && sp < 1 ? 1 : 0);
  const split = ease("enter")(Math.min(1, Math.max(0, (g - E.split) / 14)));
  const off = (grp: "a" | "b") => ({ x: SPLIT[grp].x * split, y: SPLIT[grp].y * split });
  const fly = FLY(E);
  const glyphs = (idx: number[], grp: "a" | "b") => (
    <FlyInGlyphs text="1976" fly={fly} left={DIGIT_LEFT} top={DIGIT_TOP} stageAt={E.stageAt} homeAt={E.homeAt} indices={idx} offset={() => off(grp)} />
  );
  return (
    <>
      {collageOn && (
        <World x={whipX}>
          <Pieces E={E} t0={0} digits={glyphs([0, 1], "a")} digits76={glyphs([2, 3], "b")} />
        </World>
      )}
      {!collageOn && f < E.iris && (
        <>
          <Cards E={E} push={push} swap={sp >= 0.5} blur={blur} />
          <Sequence from={E.labelCursor} layout="none">
            <div style={{ position: "absolute", left: -135 * push, top: 0 }}>
              <StationLabel title="WHUR 96.3" sub="Washington, DC" x={1020} y={675} delay={0} scrambleF={18} />
            </div>
          </Sequence>
          <Sequence from={E.pushStop} layout="none"><XMark x={740} y={810} size={230} duration={12} delay={-2} /></Sequence>
        </>
      )}
      {f >= E.iris && (
        <>
          <Cards E={E} push={1} swap blur={0} />
          <div style={{ position: "absolute", left: 1020 - 135, top: 675 }}><StationLabel title="WHUR 96.3" sub="Washington, DC" x={0} y={0} delay={-30} /></div>
          <XMark x={740} y={810} size={230} duration={12} delay={-30} />
          <IrisMask r={440} seed="iris" />
        </>
      )}
    </>
  );
};
