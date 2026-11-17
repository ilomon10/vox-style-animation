import React from "react";
import { interpolate } from "remotion";
import { TornBox } from "../../earworm";
import { rand } from "../../lib/random";
import { useDrawingFrame, useDrawingIndex } from "../../lib/time";
import { ease } from "../../tokens/easing";
import { earwormType, typeStyle } from "../../tokens/type";
import { capTrim } from "../../type/shared";
import { Capitol, Newsprint, Rowhouses, Scribble } from "../earworm/art";
import { BlueVinyl, Boombox, Cable, Cassette, Cutout, Mic } from "./art";
import { Cam } from "./camera";
import type { Events } from "./events";

const box = (l: number, t: number, w: number, h: number, children: React.ReactNode, extra?: React.CSSProperties): React.ReactNode => (
  <div style={{ position: "absolute", left: l, top: t, width: w, height: h, ...extra }}>{children}</div>
);

/** the first collage (G1346 layout, design px) with its blue 1976 */
const Collage: React.FC<{ digits19: React.ReactNode; digits76: React.ReactNode; gone: (g: number) => boolean }> = ({ digits19, digits76, gone }) => (
  <>
    {digits19}
    {!gone(1360) && box(480, 75, 490, 535, <Capitol w={490} h={505} />, { overflow: "hidden" })}
    {box(975, 310, 330, 185, <Newsprint w={330} h={185} seed="r1" fs={14} />)}
    {box(975, 440, 385, 240, <Rowhouses w={385} h={240} />, { overflow: "hidden" })}
    {box(1320, 425, 190, 160, <Scribble w={190} h={160} seed="r2" />, { clipPath: "polygon(0 8%, 60% 0, 100% 40%, 85% 100%, 10% 90%)" })}
    {box(425, 615, 370, 215, <Newsprint w={370} h={215} seed="r3" fs={22} head="REGIS" />)}
    {box(580, 745, 225, 160, <Cutout src="assets/cutouts/vintage-car.png" w={225} h={160} />)}
    {box(800, 612, 172, 172, <Scribble w={172} h={172} seed="r4" />)}
    {box(795, 785, 175, 160, <Newsprint w={175} h={160} seed="r5" fs={13} />)}
    {!gone(1362) && box(975, 680, 585, 155, <TornBox width={585} height={155} color="#26262a" seed="r6" rough={14} />)}
    {digits76}
    {!gone(1371) && box(1430, 788, 240, 17, <TornBox width={240} height={17} color="#EAE9E6" seed="r7" rough={3} />)}
  </>
);

/** radio assembly (G1420 layout): cassette + boombox + rows + dark strip + big newsprint … pop-ons for cable / vinyl / mic / newsprint */
const RadioBase: React.FC = () => (
  <>
    {box(225, 280, 210, 72, <TornBox width={210} height={72} color="#dedcd8" seed="q1" rough={8} />)}
    {box(1370, 335, 430, 160, <TornBox width={430} height={160} color="#2b2b2e" seed="q2" rough={14} />)}
    {box(415, 325, 255, 395, <Cassette />)}
    {box(670, 235, 630, 262, <Boombox w={630} />)}
    {box(625, 500, 375, 225, <Rowhouses w={375} h={225} />, { overflow: "hidden" })}
    {box(1330, 500, 320, 222, <Newsprint w={320} h={222} seed="q3" fs={20} head="REGIS" />)}
  </>
);

export const Radio: React.FC<{ E: Events }> = ({ E }) => {
  const f = useDrawingFrame(); // sequence starts at E.radioIn, 10 drawings/s
  const di = useDrawingIndex();
  const L = (x: number) => x - E.radioIn; // x = local composition frame
  const Lg = (x: number) => L(x - 791); // x = global frame
  const tTumble = L(E.tumble);
  const tA = L(E.flipA);
  const tB = L(E.flipB);
  const upright = Lg(1393);
  // size: 1 → 0.52 (tumble start .. flipA), hold through the flip, → 0.80 at +23 f, → 1 by f1411 then drifts
  const sBase = interpolate(f, [tTumble, tA], [1, 0.52], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease("accelerate") });
  const sOut = interpolate(f, [tB, Lg(1401)], [0.52, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease("enter") });
  const sGrow = interpolate(f, [Lg(1401), Lg(1411)], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = f < tA ? sBase : f < tB ? 0.52 : f < Lg(1401) ? sOut : sGrow + Math.max(0, f - Lg(1411)) * 0.0004;
  // roll: −20° while shrinking, 180° flip in 8 f, then settle upright
  const rot0 = interpolate(f, [tTumble, tA], [0, -20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotFlip = interpolate(f, [tA, tB], [0, -180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotSettle = interpolate(f, [tB, upright], [0, -160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease("enter") });
  const rot = f < tA ? rot0 : -20 + rotFlip + rotSettle;
  const swapped = f >= tA + 6; // the biggest change of the flip is at f1384 in the reference

  // numerals: blue "19" "76" glitch out in 8 f (random vertical bands drop out), white remnants linger
  const gl = f - L(E.numerals);
  const digitsStyle = { position: "absolute" as const, whiteSpace: "nowrap" as const, ...capTrim, ...typeStyle({ ...earwormType.digits, cap: 190, color: "#5C63C3", leading: 1 }) };
  const dropout = (k: number) => {
    if (gl < 0) return undefined;
    const bands = 7;
    const live = Array.from({ length: bands }, (_, j) => rand(`num${k}-${j}-${di}`) > Math.min(1, gl / 6) * 1.1);
    return live.map((v, j) => (v ? `${(j / bands) * 100}% ${((j + 1) / bands) * 100}%` : null)).filter(Boolean) as string[];
  };
  const digit = (txt: string, x: number, y: number, k: number) => {
    if (gl >= 8) return null;
    const live = dropout(k);
    return (
      <div style={{ ...digitsStyle, left: x, top: y }}>
        {live === undefined ? txt : (
          <div style={{ position: "relative" }}>
            <div style={{ visibility: "hidden" }}>{txt}</div>
            {live.map((r, j) => { const [a, b] = r.split(" "); return <div key={j} style={{ position: "absolute", inset: 0, clipPath: `inset(${a} 0 calc(100% - ${b}) 0)` }}>{txt}</div>; })}
          </div>
        )}
      </div>
    );
  };
  
  // pop-ons, one element per drawing (cable 1396, vinyl + dome 1398, mic 1402, newsprint 1406)
  const popped = (t: number) => f >= L(t);
  const cableP = popped(E.cable) ? Math.min(1, (f - L(E.cable) + 2) / 6) : 0;
  return (
    <Cam z={s} cx={1000} cy={540} >
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1000px 540px", transform: `rotate(${rot}deg)` }}>
        {!swapped && <Collage digits19={digit("19", 438, 258, 0)} digits76={digit("76", 1282, 658, 1)} gone={(g) => f >= Lg(g)} />}
        {swapped && <RadioBase />}
        {swapped && cableP > 0 && box(105, 255, 400, 300, <Cable w={400} h={300} p={cableP} />, { width: 700, height: 650, transformOrigin: "0 0", transform: "scale(1.5, 1.5)" })}
        {swapped && popped(E.vinyl) && (
          <>
            {box(960, 600, 440, 440, <BlueVinyl d={440} />, { left: 960 })}
            {box(1000, 500, 330, 350, <Capitol w={330} h={340} />, { overflow: "hidden", transform: "rotate(180deg)", clipPath: "inset(0 0 0 0)" })}
          </>
        )}
        {swapped && popped(E.mic) && box(1380, 40, 440, 330, <Mic w={440} />)}
        {swapped && popped(E.news) && box(680, 705, 320, 160, <Newsprint w={320} h={160} seed="q4" fs={14} />)}
      </div>
    </Cam>
  );
};
