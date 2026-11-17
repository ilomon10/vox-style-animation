import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { HandRing, TypewriterSlide, XMark, TornBox } from "../../earworm";
import { ElectricBeam } from "../../earworm/fx";
import { useDrawingFrame } from "../../lib/time";
import { earwormType } from "../../tokens/type";
import { Capitol, Newsprint, Rowhouses, Scribble } from "../earworm/art";
import { AlbumArt, Cutout, DarkNews, Flag, GraphPaper, PRIV, WhiteHouse } from "./art";
import { Cam, bez, drawings12, logKeys } from "./camera";
import type { Events } from "./events";

/** The album group is authored in "4a screen px" (the camera starts at Z0 relative to the FINAL collage framing, Z = 1 at f918). */
const Z0 = 4.5;
const A = { x: 902, y: 590 }; // world position of the album (on the White House roof)

/** camera zoom: 4a = settle then linear pull-back 0.997 per drawing, accelerating into the burst, then the decelerating zoom-out to rest (earworm-B §2, §7) */
const zoom = (f: number, E: Events) => {
  if (f <= 66) {
    const d = drawings12(f);
    const SETTLE = [0.98, 0.983, 0.987];
    const ACC = [0.996, 0.99, 0.985, 0.98, 0.975];
    let z = 4.55;
    for (let i = 1; i <= d; i++) {
      const t = (i * 25) / 12; // frame of this drawing
      z *= i <= 3 ? SETTLE[i - 1] : t >= E.accel ? ACC[Math.min(4, Math.round(((t - E.accel) * 12) / 25))] : 0.997;
    }
    return z;
  }
  return logKeys(f, [[67, 3.55], [71, 3.3], [73, 2.7], [75, 2.2], [77, 2.0], [85, 1.68], [E.zoomRest, 1.0, bez(0, 0.1, 0.4, 1)]]);
};
const CAMC: [number, number] = [902, 586];
const camCentre = (z: number): [number, number] => {
  const t = Math.min(1, Math.max(0, Math.log(Z0 / z) / Math.log(Z0)));
  return [CAMC[0] + (960 - CAMC[0]) * t, CAMC[1] + (540 - CAMC[1]) * t];
};

/** the vinyl + band cut-out + sleeve as one group authored at Z0 */
const AlbumGroup: React.FC<{ f: number; E: Events }> = ({ f, E }) => {
  const dissolve = interpolate(f, [E.albumIn, E.albumIn + 13], [0.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = 1 - Math.pow(1 - dissolve, 2);
  return (
    <div style={{ position: "absolute", left: A.x, top: A.y, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${1 / Z0})`, transformOrigin: "0 0" }}>
        {/* record under the sleeve: sheen turns with it ≈ 10°/drawing */}
        <div style={{ position: "absolute", left: -790, top: -830, width: 1580, height: 1580, borderRadius: "50%", overflow: "hidden", opacity: 0.55 }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 50% 50%, #0d0d0d 0px, #1d1d1d 2px, #111 4px)" }} />
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${drawings12(f) * 10}deg)`, background: "conic-gradient(from 20deg, transparent 0 20deg, rgba(255,255,255,.18) 40deg, transparent 90deg, transparent 200deg, rgba(255,255,255,.12) 225deg, transparent 260deg)" }} />
        </div>
        <div style={{ position: "absolute", left: -390, top: -330, width: 780, height: 700, opacity: op }}>
          <AlbumArt w={780} h={700} />
        </div>
        <div style={{ position: "absolute", left: -480, top: -400, width: 960, height: 860, background: "#E4E3DF", clipPath: "polygon(2% 4%, 52% 0, 100% 3%, 98% 100%, 55% 97%, 0 100%)" }}>
          <Img src={staticFile("assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg")} style={{ position: "absolute", left: 18, top: 16, width: 924, height: 828, objectFit: "cover", filter: "grayscale(1) contrast(1.2)" }} />
        </div>
        <div style={{ position: "absolute", left: -660, top: 230, width: 330, height: 120, transform: "rotate(-4deg)" }}><Newsprint w={330} h={120} seed="s4a" fs={13} /></div>
      </div>
    </div>
  );
};

const at = (f: number, t: number, el: React.ReactNode) => (f >= t ? el : null);

export const DC: React.FC<{ E: Events }> = ({ E }) => {
  const f = useDrawingFrame();
  const z = zoom(f, E);
  const [cx, cy] = camCentre(z);
  const b = E.burst;
  const keyless = (t: number, el: React.ReactNode) => at(f, t, el);
  return (
    <>
      <ElectricBeam at={E.beam} until={E.beamEnd} y={525} seed="beam" />
      <Cam z={z} cx={cx} cy={cy}>
        {f < 77 && <AlbumGroup f={f} E={E} />}
        {/* DC collage pieces (final px): vinyl+graph paper, flag, White House, car, photo, rows, Capitol, newsprint, boy */}
        {keyless(b, <div style={{ position: "absolute", left: 285, top: 620, width: 445, height: 315 }}><GraphPaper w={445} h={315} /></div>)}
        {keyless(b, <div style={{ position: "absolute", left: 270, top: 505, width: 400, height: 400, borderRadius: "50%", overflow: "hidden", background: "repeating-radial-gradient(circle at 50% 50%, #121212 0px, #262626 1.5px, #161616 3px)" }}>
          <div style={{ position: "absolute", left: 130, top: 140, width: 140, height: 140, borderRadius: "50%", background: "#cfcfcb" }} />
          <div style={{ position: "absolute", inset: 0, background: "conic-gradient(from 190deg, transparent 0 25deg, rgba(240,240,240,.7) 42deg, transparent 80deg)", mixBlendMode: "screen" }} />
        </div>)}
        {keyless(b + 2, <div style={{ position: "absolute", left: 440, top: 100, width: 460, height: 420 }}><Flag w={460} h={420} /></div>)}
        {keyless(b + 2, <div style={{ position: "absolute", left: 755, top: 615, width: 295, height: 270 }}><WhiteHouse w={295} h={270} /></div>)}
        {keyless(b + 8, <>
          <div style={{ position: "absolute", left: 1030, top: 430, width: 210, height: 170 }}><DarkNews w={210} h={170} seed="dn" /></div>
          <div style={{ position: "absolute", left: 1020, top: 488, width: 230, height: 155 }}><Cutout src="assets/cutouts/vintage-car.png" w={230} h={155} /></div>
        </>)}
        {keyless(b + 10, <>
          <div style={{ position: "absolute", left: 1490, top: 410, width: 125, height: 200, overflow: "hidden" }}><Rowhouses w={260} h={200} /></div>
          <div style={{ position: "absolute", left: 1250, top: 350, width: 330, height: 120 }}><Newsprint w={330} h={120} seed="cn" fs={12} /></div>
          <div style={{ position: "absolute", left: 1245, top: 380, width: 205, height: 255, overflow: "hidden", background: "#222" }}>
            <Img src={PRIV("pa.jpg")} style={{ width: 205, height: 255, objectFit: "cover", filter: "grayscale(1) contrast(1.15)" }} />
          </div>
        </>)}
        {keyless(b + 12, <div style={{ position: "absolute", left: 300, top: 165, width: 230, height: 300, overflow: "hidden" }}><Capitol w={230} h={237} /></div>)}
        {keyless(b + 13, <>
          <div style={{ position: "absolute", left: 880, top: 440, width: 140, height: 32 }}><Newsprint w={140} h={32} seed="ts" fs={9} /></div>
          <div style={{ position: "absolute", left: 1320, top: 650, width: 295, height: 110 }}><TornBox width={295} height={110} color="#cfcfcd" seed="wc" rough={10} /></div>
          <div style={{ position: "absolute", left: 565, top: 600, width: 160, height: 110 }}><Scribble w={160} h={110} seed="s4b" /></div>
        </>)}
        {/* defocused foreground figure at the left edge */}
        {keyless(b + 14, <div style={{ position: "absolute", left: -80, top: 380, width: 420, height: 760, transform: "rotate(-14deg)", filter: "blur(9px)" }}>
          <Cutout src="assets/cutouts/victorian-man.png" w={420} h={760} />
        </div>)}
        {/* type, ring, X: in the world, they come to rest with the zoom */}
        {f >= E.typeChoc && <XMark x={297} y={500} size={100} delay={E.typeChoc + 1} duration={12} color="#D0CCC9" strokeWidth={6} seed="xb" />}
        <TypewriterSlide text="CHOCOLATE" delay={E.typeChoc} finishAt={E.typeChoc + 15} x={314} y={540} slideLetters={0} role={{ ...earwormType.keyword, cap: 124 }} />
        <TypewriterSlide text="CITY" delay={E.typeCityDone - 12} finishAt={E.typeCityDone} x={1073} y={711} slideLetters={0} role={{ ...earwormType.keyword, cap: 124 }} />
        <HandRing cx={1210} cy={716} rx={178} ry={82} delay={E.ring} duration={7} seed="ringcity" />
      </Cam>
    </>
  );
};
