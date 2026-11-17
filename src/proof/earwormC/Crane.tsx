import React from "react";
import { Easing } from "remotion";
import { BlackCollageGround, LabelStrip, TornPhoto } from "../../earworm";
import { Multiplane, sampleCrane, type CraneKey, type MultiplaneLayer } from "../../earworm/fx";
import { useDrawingFrame } from "../../lib/time";
import { DesignSpace } from "../../lib/stage";
import { Newsprint } from "../earworm/art";
import { Cable, Guitar, Photo, Reel, Sax, Scrap, Sleeve, Speaker, StagePiano, SuitcasePiano, Synth, Trumpet, Vinyl, OUT } from "./art";
import type { Events } from "./events";

const bz = (a: number, b: number, c: number, d: number) => Easing.bezier(a, b, c, d);

/** camera keys of the 18 s crane, t = frames since the fade-up (earworm-C §7: crane 1 108 f, crane 2 83 f, dolly-in 50 f; pull-back ×0.80 over 25 f as a dolly) */
export const craneKeys = (E: Events): CraneKey[] => {
  const T = (f: number) => f - E.restart;
  return [
    { at: 0, y: 540, dolly: 0.2 }, // starts 25 % too close (×1.25 = 1/0.8)
    { at: T(E.pullBackEnd), y: 540, dolly: 0, ease: bz(0.16, 1, 0.3, 1) },
    { at: T(E.crane1Start), y: 566 }, // creep 3–9 px/drawing, then the long ease-in
    { at: T(E.crane1End), y: 3300, ease: bz(0.9, 0, 0.6, 1) }, // tuned so the MAD-weighted half-travel matches the reference (analysis ease (0.8,0,0.6,0.7) is too early)
    { at: T(E.crane2Start), y: 3300 },
    { at: T(E.crane2End), y: 5050, ease: bz(0.6, 0.1, 0.3, 1) },
    { at: T(E.dollyStart), y: 5050 },
    { at: T(E.dollyEnd), y: 5050, dolly: 0.5, ease: bz(0.6, 0, 1, 1) },
    { at: T(E.end) , y: 5050, dolly: 0.54 },
  ];
};

/** the hero: singer collage on a vinyl; the secondary figures slide out from behind it over the build (A f2297–2381) */
const Hero: React.FC<{ buildAt: number; buildLen: number }> = ({ buildAt, buildLen }) => {
  const f = useDrawingFrame();
  const p = Math.min(1, Math.max(0, (f - buildAt) / buildLen));
  const g = 1 + 0.1 * p;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${g})`, transformOrigin: "50% 60%" }}>
      <div style={{ position: "absolute", left: 40, top: -10, width: 560 }}><Vinyl w={560} h={560} spin={f * 7} /></div>
      {[
        { x: 380, y: 120, s: 220, o: 100, src: 0 },
        { x: 130, y: 220, s: 190, o: -90, src: 1 },
      ].map((q, i) => (
        <div key={i} style={{ position: "absolute", left: q.x + q.o * (p - 1) * -1, top: q.y, width: q.s, height: q.s * 1.1, opacity: p > 0 ? 1 : 0 }}>
          <Photo src="assets/cc0/portraits/victorian-man-full-length-cdv-1870.jpg" w={q.s} h={q.s * 1.1} pos={`50% ${10 + i * 8}%`} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 150, top: 230, width: 460, height: 330 }}>
        <TornPhoto src="assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg" x={0} y={0} width={420} height={290} border={9} objectPosition="40% 50%" seed="hero" />
      </div>
      <div style={{ position: "absolute", left: 40, top: 520, width: 560, height: 120 }}><Newsprint w={560} h={120} seed="herostrip" fs={15} /></div>
    </div>
  );
};

export const CraneShot: React.FC<{ E: Events }> = ({ E }) => {
  const T = (f: number) => f - E.restart;
  const keys = craneKeys(E);
  const camY = (t: number) => sampleCrane(keys, t).y;
  const layers: MultiplaneLayer[] = [];
  /** place a layer so that its centre sits at screen (xs, 540+dy) when the camera passes the reference y of frame `tc`; visual size vw×vh at the speed's own scale */
  const add = (speed: number, vw: number, vh: number, xs: number, tc: number, dy: number, rot: number, node: React.ReactNode) =>
    layers.push({
      node: <div style={{ width: vw, height: vh, transform: `scale(${1 / speed})`, transformOrigin: "0 0", position: "relative" }}>{node}</div>,
      w: vw / speed, h: vh / speed, x: 960 + (xs - 960) / speed, y: camY(tc) + dy / speed, speed, rot,
    });

  // far scraps (speed .55) and cables
  for (let i = 0; i < 9; i++) add(0.55, 700, 560, 300 + ((i * 677) % 1500), i * 52 + 20, (i % 2 ? 1 : -1) * 120, (i * 37) % 40 - 20, <Scrap w={700} h={560} seed={`sc${i}`} />);
  [0.8, 1.5, 1.5, 0.8].forEach((v, i) => add(v, 1800, 2200, 960, 60 + i * 110, 0, 0, <Cable w={1800} h={2200} seed={`cb${i}`} />));

  // intro: Rhodes + label + suitcase + drum machine
  add(1.4, 980, 490, 240, 0, 110, -8, <StagePiano w={980} h={490} />);
  add(1.0, 560, 370, 1550, 0, -260, 38, <SuitcasePiano w={560} h={370} />);
  add(1.0, 500, 260, 1450, 0, 290, -4, <Synth w={500} h={260} />);
  add(1.4, 470, 240, 940, 0, 0, 0, <LabelStrip lines={["FENDER", "RHODES"]} reveal="wipe" revealFrames={2} lineOffsetX={100} delay={0} seed="rhodes" />);
  // crane 1: speakers, Minimoog (centre on "synthesizer"), ARP, shadow, reels (arrive on "longer")
  add(1.3, 360, 480, 300, 98, -100, 12, <Speaker w={360} h={480} />);
  add(1.3, 360, 480, 1650, 112, 250, -20, <Speaker w={360} h={480} />);
  add(1.0, 620, 320, 960, T(E.cross.minimoog), 0, -3, <Synth w={620} h={320} dark />);
  add(1.0, 480, 250, 1560, 104, -150, 8, <Synth w={480} h={250} />);
  add(2.2, 900, 900, 420, 104, 0, 0, <Scrap w={900} h={900} seed="big" tone="#D6D6D3" />);
  add(1.5, 520, 520, 1100, T(E.cross.reels), 0, 0, <Reel w={520} h={520} />);
  add(1.0, 330, 330, 520, T(E.cross.reels) + 8, -190, 0, <Reel w={330} h={330} />);
  // crane 2: trumpet + Miles LP (centre on "and jazz"), Earth Wind & Fire, guitars, vinyl (centre on "funk")
  add(1.5, 800, 275, 700, T(E.cross.trumpet), 0, 25, <Trumpet w={800} h={275} />);
  add(1.2, 520, 520, 1550, T(E.cross.trumpet) + 2, -50, 20, <Sleeve w={520} h={520} title="MILES DAVIS" />);
  add(1.2, 460, 460, 300, T(E.cross.trumpet) - 12, 250, -18, <Sleeve w={460} h={460} title="EARTH WIND & FIRE" />);
  add(1.0, 750, 236, 1450, T(E.cross.guitar), 0, -25, <Guitar w={750} h={236} />);
  add(1.0, 700, 220, 700, T(E.cross.guitar) + 8, 110, 12, <Guitar w={700} h={220} bass />);
  add(1.0, 220, 220, 1700, T(E.cross.guitar) - 4, 300, 0, <Vinyl w={220} h={220} />);
  // arrival: sax + Head Hunters + vinyl (these leave in the dolly-in), then the hero
  add(2, 330, 620, 450, T(E.cross.sax), 0, -10, <Sax w={330} h={620} />);
  add(2, 520, 520, 960, T(E.cross.sax) + 6, 120, 0, <Sleeve w={520} h={520} title="HEAD HUNTERS" />);
  add(2, 560, 560, 1500, T(E.dollyStart) - 6, -30, 0, <Vinyl w={560} h={560} />);
  add(0.6, 640, 512, 960, T(E.dollyEnd) + 4, 0, 0, <Hero buildAt={T(E.dollyEnd) + 6} buildLen={T(E.buildEnd) - T(E.dollyEnd) - 6} />);

  return (
    <>
      <BlackCollageGround seed="crane" />
      <DesignSpace><Multiplane layers={layers} keys={keys} background="transparent" /></DesignSpace>
    </>
  );
};
void OUT;
