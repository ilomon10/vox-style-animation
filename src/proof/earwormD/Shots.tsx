import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { CueIndex } from "../../audio";
import { BlackCollageGround, TornBox, distressMask } from "../../earworm";
import { KickScope, MegaPullBack, SpectrumBars } from "../../earworm/fx";
import { rand } from "../../lib/random";
import { DESIGN_H, DESIGN_W, DesignSpace } from "../../lib/stage";
import { useDrawingFrame } from "../../lib/time";
import { voxEarworm } from "../../tokens/colors";
import { ease } from "../../tokens/easing";
import { earwormType, typeStyle } from "../../tokens/type";
import { capTrim } from "../../type/shared";
import { Unfold } from "../earworm/art";
import { Newsprint } from "../earworm/art";
import { Boombox, BoomArm, Cassette, Console, Cord, Handset, PhoneBase, PhotoCut, Scrap, Spire, StudioMic, Turntable, needleAngle } from "./art";
import type { Events } from "./events";

/** cue index whose frame 0 is `off` composition frames later: lets audio-reactive kit pieces run inside a Sequence that starts at `off` */
export const shiftCues = (c: CueIndex, off: number): CueIndex => ({ ...c, levelAt: (f: number, b?: never) => c.levelAt(f + off, b) } as CueIndex);

const abs = (x: number, y: number, w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, ...extra });
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** a drawing-stepped eased progress of a move that starts at `at` and lasts `dur` frames (sequence-relative) */
const useMove = (at: number, dur: number, curve: (t: number) => number = ease("enter")) => {
  const f = useDrawingFrame();
  return curve(clamp01((f - at + 2) / dur)) * (f >= at ? 1 : 0);
};

/** masked rise: child rises from below the clip rect (earworm-D §7 "Masked rise", 17 f, `enter`) */
const Rise: React.FC<{ at: number; dur?: number; x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ at, dur = 17, x, y, w, h, children }) => {
  const p = useMove(at, dur);
  const f = useDrawingFrame();
  if (f < at) return null;
  return <div style={abs(x, y, w, h, { overflow: "hidden" })}><div style={abs(0, (1 - p) * h, w, h)}>{children}</div></div>;
};

const Gloss = (role: typeof earwormType.artistTag): React.CSSProperties => ({ ...capTrim, ...typeStyle({ ...role, leading: 1 }), whiteSpace: "nowrap" });

// ───────────────────────── S22 Nat King Cole ─────────────────────────
const PAN_PROG = [0.22, 0.5, 0.7, 0.81, 0.9, 0.96, 0.99, 1];
export const S22: React.FC<{ E: Events; cues: CueIndex }> = ({ E, cues }) => {
  const f = useCurrentFrame();
  let k = -1;
  E.panKeys.forEach((t, i) => { if (f >= t) k = i; });
  const prog = k < 0 ? 0 : PAN_PROG[k];
  const pan = 347 * (1 - prog); // content starts 347 px right of home and decelerates (f2785-2800)
  // scraps slide off the tag / face over the same keys
  const slide = (k + 1) / 8;
  const drift = f > 17 ? -0.009 * ((f - 17) / 25) * 1920 : 0;
  return (
    <AbsoluteFill>
      <BlackCollageGround seed="s22" />
      <DesignSpace>
        <SpectrumBars cues={cues} seed="nkc" wipeOnAt={E.barsWipe} />
        <div style={abs(0, 0, DESIGN_W, DESIGN_H, { transform: `translateX(${pan + drift}px)` })}>
          {/* second ragged newsprint layer behind the cut-out */}
          <div style={abs(1112, 0, 120, 1080, { clipPath: "polygon(30% 0,100% 0,100% 100%,0 100%,15% 60%)", filter: "brightness(.7)" })}><Newsprint w={120} h={1080} seed="nkc" fs={16} /></div>
          <div style={abs(1130, -60, 790, 1200)}><PhotoCut src="assets/cutouts/victorian-man.png" w={790} h={1200} zoom={1.7} border={9} /></div>
          {/* artist + song tags on dark slips, white torn strip */}
          <TornBox width={420} height={78} color={voxEarworm.slip} seed="nkc-a" rough={5} style={{ position: "absolute", left: 270, top: 440 }}>
            <div style={{ position: "absolute", left: 22, top: 17, ...Gloss(earwormType.artistTag) }}>NAT KING COLE</div>
          </TornBox>
          <TornBox width={300} height={56} color={voxEarworm.slip2} seed="nkc-s" rough={5} style={{ position: "absolute", left: 270, top: 522 }}>
            <div style={{ position: "absolute", left: 22, top: 11, ...Gloss(earwormType.songTag) }}>UNFORGETTABLE</div>
          </TornBox>
          <TornBox width={190} height={14} color={voxEarworm.tornWhite} seed="nkc-w" rough={6} style={{ position: "absolute", left: 610, top: 520 }} />
          {/* sliding scraps (dark paper over the tag, newsprint over the face) */}
          <div style={abs(250 - 900 * slide, 420, 520, 180, { background: "#0B0B0B" })} />
          <div style={abs(1130 + 800 * slide, 0, 790, 1080, { background: "#0B0B0B", clipPath: "polygon(0 0,70% 0,60% 100%,0 100%)" })} />
        </div>
      </DesignSpace>
    </AbsoluteFill>
  );
};

// ───────────────────────── interview windows ─────────────────────────
export const InterviewWindow: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ background: "#0C0C0C" }}>
    {/* webcam footage plays at its native rate, NOT posterised (earworm-D §6) */}
    <div style={abs(480, 102, 957, 867, { borderRadius: 28, overflow: "hidden", background: "#222" })}>
      <OffthreadVideo src={staticFile(src)} style={{ width: 957, height: 867, objectFit: "cover" }} muted />
    </div>
  </AbsoluteFill>
);

// ───────────────────────── S23c console macro → mega pull-back ─────────────────────────
const CON = { x: 687, y: 340, w: 546, h: 330 };
/** the console collage world (design px); `f` = frame in the shot's own clock, props slide in from `propsAt` */
const ConsoleWorld: React.FC<{ f: number; peakAt: number; propsAt: number; letters?: React.ReactNode; settled?: boolean }> = ({ f, peakAt, propsAt, letters, settled }) => {
  const g = Math.floor((f * 12) / 25 + 1e-9) * (25 / 12);
  const slideIn = (t0: number, dx: number, dy: number) => {
    if (settled) return { x: 0, y: 0, on: true };
    const p = ease("enter")(clamp01((g - t0 + 2) / 8));
    return { x: dx * (1 - p), y: dy * (1 - p), on: g >= t0 };
  };
  const mic = slideIn(propsAt, 500, -400), cas = slideIn(propsAt + 4, 500, 100), spire = slideIn(propsAt + 6, -800, 0), tt = slideIn(propsAt + 10, -500, 100), rec = slideIn(propsAt + 17, -500, 300);
  const sh = (s: { x: number; y: number; on: boolean }, st: React.CSSProperties) => (s.on ? <div style={{ ...st, transform: `translate(${s.x}px, ${s.y}px) ${st.transform ?? ""}` }} /> : null);
  void sh;
  return (
    <div style={abs(0, 0, DESIGN_W, DESIGN_H)}>
      {/* newsprint ground scraps */}
      <div style={abs(520, 300, 240, 560, { opacity: 0.35, filter: "brightness(.22)" })}><Newsprint w={240} h={560} seed="g1" fs={13} /></div>
      <div style={abs(1180, 640, 360, 300, { opacity: 0.3, filter: "brightness(.22)" })}><Newsprint w={360} h={300} seed="g2" fs={13} /></div>
      {letters}
      {spire.on && <div style={abs(180, 500, 560, 170, { transform: `translate(${spire.x}px,${spire.y}px)` })}><Spire w={560} h={170} /></div>}
      {tt.on && <div style={abs(470, 330, 260, 234, { transform: `translate(${tt.x}px,${tt.y}px)` })}><Turntable w={260} /></div>}
      {rec.on && <div style={abs(1080, 570, 210, 190, { transform: `translate(${rec.x}px,${rec.y}px)` })}><Scrap w={210} h={190} seed="bust" fill="#2b2b2b" text={false} /></div>}
      <div style={abs(CON.x, CON.y, CON.w, CON.h)}><Console w={CON.w} h={CON.h} angle={needleAngle(f, peakAt)} /></div>
      {cas.on && <div style={abs(1250, 350, 190, 300, { transform: `translate(${cas.x}px,${cas.y}px)` })}><div style={{ transform: "rotate(90deg) translate(0,-190px)", transformOrigin: "0 0" }}><Cassette w={300} /></div></div>}
      {mic.on && <div style={abs(1190, 220, 300, 260, { transform: `translate(${mic.x}px,${mic.y}px)` })}><BoomArm w={150} h={150} /><div style={abs(170, 130, 50, 110)}><StudioMic w={50} h={110} /></div></div>}
    </div>
  );
};

export const S23c: React.FC<{ E: Events }> = ({ E }) => {
  const f = useCurrentFrame(); // restart-relative
  const at = E.pullAt - E.restart; // 20
  const peak = E.needlePeak - E.restart;
  const macro = { x: CON.x + CON.w / 2, y: CON.y + CON.h * 0.19 };
  const props = E.propsAt - E.restart;
  // hold drift −0.8 %/s after the landing (earworm-D §7), on twos
  const drift = f > at + 52 ? -0.008 * DESIGN_W * (Math.floor(((f - at - 52) * 12) / 25) / 12) : 0;
  const World = (ff: number) => <div style={abs(0, 0, DESIGN_W, DESIGN_H, { transform: `translateX(${drift}px)` })}><ConsoleWorld f={ff} peakAt={peak} propsAt={props} /></div>;
  return (
    <AbsoluteFill>
      <BlackCollageGround seed="s23" />
      <DesignSpace>
        {f < at ? (
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <div style={abs(0, 0, DESIGN_W, DESIGN_H, { transformOrigin: "0 0", transform: `translate(${DESIGN_W / 2}px, ${DESIGN_H / 2}px) scale(6.25) translate(${-macro.x}px, ${-macro.y}px)` })}>{World(f)}</div>
          </AbsoluteFill>
        ) : (
          <MegaPullBack at={at} macro={macro} center={{ x: DESIGN_W / 2, y: DESIGN_H / 2 }}>
            <PullInner at={at} render={World} />
          </MegaPullBack>
        )}
      </DesignSpace>
    </AbsoluteFill>
  );
};
const PullInner: React.FC<{ at: number; render: (f: number) => React.ReactNode }> = ({ at, render }) => <>{render(useCurrentFrame() + at)}</>;

// ───────────────────────── S25 record + scope + lyric ─────────────────────────
export const S25: React.FC<{ E: Events; cues: CueIndex; start: number }> = ({ E, cues, start }) => {
  const f = useCurrentFrame();
  const g = f + start;
  const sc = shiftCues(cues, start);
  const grow = clamp01((f - 0) / 12);
  const drop = g < E.recordDrop ? 0 : clamp01((g - E.recordDrop) / 7);
  const spin = Math.floor((f * 12) / 25 + 1e-9) * 7;
  const L = E.lyric;
  const word = (t: string, at: number) => {
    const d = g - at;
    const j = d >= 0 && d < 5 ? 6 * (1 - d / 5) : 0;
    return (
      <span key={t} style={{ visibility: d >= 0 ? "visible" : "hidden", marginRight: 22, textShadow: j ? `${j}px 0 rgba(255,0,60,.8), ${-j}px 0 rgba(0,200,255,.8)` : undefined }}>{t}</span>
    );
  };
  return (
    <AbsoluteFill>
      <BlackCollageGround seed="s25" />
      <DesignSpace>
        {g < E.scopeOff && (
          <div style={abs(0, 150, 1920, 700, { transform: `scaleY(${0.1 + 0.9 * grow})`, transformOrigin: "50% 50%", filter: "drop-shadow(0 0 14px rgba(90,110,255,.9)) drop-shadow(0 0 30px rgba(60,70,220,.7))" })}>
            <KickScope cues={sc} width={1920} height={700} riseDb={6} />
          </div>
        )}
        <div style={abs(0, drop * 420, 1920, 1080, { transform: `scale(${1 - 0.25 * drop})`, transformOrigin: "900px 1000px" })}>
          {/* real footage of a spinning record is generated: grooves + baked wedge + RGB rim fringes */}
          <div style={abs(900 - 1200, 1500 - 1200, 2400, 2400, { borderRadius: "50%", boxShadow: "5px 0 0 rgba(255,40,40,.45), -5px 0 0 rgba(40,255,90,.4)", overflow: "hidden", background: "repeating-radial-gradient(circle, #0c0c0c 0 3px, #1a1a1a 3px 6px)" })}>
            <div style={abs(0, 0, 2400, 2400, { transform: `rotate(${spin}deg)`, background: "conic-gradient(from 0deg, transparent 0 4%, rgba(255,255,255,.45) 8%, rgba(255,255,255,.0) 14%, transparent 50%, rgba(255,255,255,.3) 56%, transparent 62%)" })} />
            <div style={abs(950, 950, 500, 500, { borderRadius: "50%", background: voxEarworm.accent, opacity: 0.85 })} />
          </div>
          <div style={{ position: "absolute", left: 612, top: 540, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.lyric, leading: 1 }) }}>
            {word("YOU’RE", L.youre)}{word("MY", L.my)}{word("AN", L.an)}{word("GEL", L.gel)}
          </div>
        </div>
        {g < E.recordDrop + 7 && <div style={{ position: "absolute", left: 153, top: 12, color: "#fff", ...typeStyle({ ...earwormType.nowPlaying, leading: 1 }), ...capTrim }}>Nina Vale “Angel”</div>}
      </DesignSpace>
    </AbsoluteFill>
  );
};

// ───────────────────────── S26 stage → spin-swap → console collage → recap ─────────────────────────
const BIG = { ...typeStyle({ ...earwormType.bigLetters, cap: 215 }), ...capTrim, position: "absolute" as const, whiteSpace: "nowrap" as const };
const StageA: React.FC<{ E: Events; base: number }> = ({ E, base }) => {
  const f = useDrawingFrame();
  const t = (g: number) => g - base;
  const zoomP = useMove(t(E.zoomOut), 16);
  const s = 1.32 - 0.32 * zoomP;
  return (
    <DesignSpace>
      <div style={abs(0, 0, DESIGN_W, DESIGN_H, { transformOrigin: "608px -334px", transform: `scale(${s})` })}>
        <Rise at={t(E.rise.R)} x={470} y={225} w={160} h={260}><div style={{ ...BIG, left: 0, top: 0 }}>R</div></Rise>
        <Rise at={t(E.rise.and)} x={1200} y={500} w={140} h={260}><div style={{ ...BIG, left: 0, top: 0 }}>&amp;</div></Rise>
        <Rise at={t(E.rise.B)} x={1400} y={665} w={170} h={260}><div style={{ ...BIG, left: 0, top: 0 }}>B</div></Rise>
        <Unfold at={t(E.boombox)} dur={12} hinge="bottom" style={{ left: 576, top: 249, width: 640 }}><Boombox w={640} /></Unfold>
        {f >= t(E.pieces) + 4 && <div style={abs(1070, 590, 400, 100)}><Scrap w={400} h={100} seed="tuner" fill="#CFCECA" text={false} /><div style={abs(20, 44, 360, 8, { background: "#444" })} /><div style={abs(200, 20, 4, 60, { background: voxEarworm.accent })} /></div>}
        {f >= t(E.pieces) && <div style={abs(430, 420, 1150, 440)}><Scrap w={1150} h={440} seed="scrapL" fill="#3a3a39" text={false} /></div>}
        <Rise at={t(E.singer)} dur={11} x={648} y={266} w={520} h={640}>
          <PhotoCut src="assets/cutouts/victorian-man.png" w={500} h={640} zoom={1.5} border={7} />
          <div style={abs(-60, 300, 10, 340, { background: "#CCC" })} />
        </Rise>
        {f >= t(E.pieces) + 2 && <div style={abs(460, 520, 150, 150, { borderRadius: "50%", background: "radial-gradient(circle,#222 0 14%,#d9d6d0 15% 48%,#bbb 50%)", boxShadow: "0 0 0 4px #333" })} />}
      </div>
    </DesignSpace>
  );
};

const RECAP: { k: string; x: number; y: number; w: number; h: number; rot: number; from: [number, number]; st: number }[] = [
  { k: "boom", x: 40, y: 40, w: 580, h: 290, rot: -1, from: [-900, -300], st: 0 },
  { k: "console", x: 1284, y: 20, w: 636, h: 440, rot: 0, from: [900, -300], st: 1 },
  { k: "news", x: 855, y: 165, w: 405, h: 255, rot: 2, from: [0, -600], st: 3 },
  { k: "mic", x: 60, y: 430, w: 80, h: 340, rot: -3, from: [-400, 0], st: 2 },
  { k: "cass", x: 170, y: 470, w: 490, h: 310, rot: 1, from: [-700, 200], st: 4 },
  { k: "tt", x: 1470, y: 520, w: 450, h: 500, rot: 0, from: [800, 500], st: 5 },
  { k: "abs", x: 1260, y: 495, w: 190, h: 230, rot: 6, from: [600, 0], st: 3 },
  { k: "woman", x: 130, y: 800, w: 440, h: 235, rot: -2, from: [-600, 600], st: 6 },
  { k: "paper", x: 570, y: 795, w: 620, h: 255, rot: 1, from: [0, 600], st: 5 },
  { k: "car", x: 1035, y: 850, w: 440, h: 150, rot: 0, from: [600, 600], st: 6 },
  { k: "album", x: 825, y: 810, w: 210, h: 210, rot: -4, from: [0, 700], st: 4 },
  { k: "tuner", x: 1146, y: 490, w: 110, h: 140, rot: 0, from: [500, 0], st: 2 },
  { k: "cable", x: 620, y: 20, w: 400, h: 200, rot: 0, from: [0, -400], st: 1 },
];
const RecapPiece: React.FC<{ p: (typeof RECAP)[number] }> = ({ p }) => {
  switch (p.k) {
    case "boom": return <Boombox w={p.w} />;
    case "console": return <Console w={p.w} h={p.h} angle={28} seed="rc" />;
    case "news": return <Newsprint w={p.w} h={p.h} seed="mel" head="Melvin" fs={13} />;
    case "mic": return <StudioMic w={p.w} h={p.h} />;
    case "cass": return <div style={{ transform: "scale(1.6)", transformOrigin: "0 0" }}><Cassette w={300} /></div>;
    case "tt": return <Turntable w={p.w} rot={20} />;
    case "abs": return <Scrap w={p.w} h={p.h} seed="abs" fill="#8a8a88" text={false} />;
    case "woman": return <Newsprint w={p.w} h={p.h} seed="wm" fs={11} />;
    case "paper": return <Newsprint w={p.w} h={p.h} seed="pp" fs={12} />;
    case "car": return <PhotoCut src="assets/cutouts/vintage-car.png" w={p.w} h={p.h} objectPosition="50% 50%" border={4} />;
    case "album": return <Scrap w={p.w} h={p.h} seed="alb" fill="#bdbdb9" text={false} />;
    case "tuner": return <div style={abs(0, 0, p.w, p.h, { background: "#cfcdc8" })} />;
    default: return <Cord w={p.w} h={p.h} d={`M 0 0 C ${p.w * 0.1} ${p.h} ${p.w * 0.5} ${p.h} ${p.w} ${p.h * 0.4}`} />;
  }
};

const StageB: React.FC<{ E: Events; base: number }> = ({ E, base }) => {
  const f = useDrawingFrame();
  const t = (g: number) => g - base;
  const sink = f >= t(E.djSink) ? ease("exit")(clamp01((f - t(E.djSink)) / 9)) : 0;
  const rec = t(E.recap);
  const showOld = f < rec + 16;
  return (
    <DesignSpace>
      {showOld && (
        <div style={abs(0, 0, DESIGN_W, DESIGN_H, { transformOrigin: "960px 540px", transform: "scale(1.07)" })}>
          <ConsoleWorld f={999} peakAt={0} propsAt={0} settled letters={
            <>
              <Rise at={t(E.djD)} x={620} y={190} w={140} h={260}><div style={{ ...BIG, left: 0, top: sink * 300 }}>D</div></Rise>
              <Rise at={t(E.djJ)} x={1190} y={560} w={120} h={260}><div style={{ ...BIG, left: 0, top: sink * 300 }}>J</div></Rise>
            </>
          } />
        </div>
      )}
      {f >= rec && RECAP.map((p, i) => {
        const q = ease("enter")(clamp01((f - rec - p.st * 2.5 + 1) / 22));
        if (f < rec + p.st * 2.5) return null;
        return (
          <div key={i} style={abs(p.x + p.from[0] * (1 - q), p.y + p.from[1] * (1 - q), p.w, p.h, { transform: `rotate(${p.rot + (1 - q) * (rand(`rc${i}`) > 0.5 ? 25 : -25)}deg)` })}>
            <RecapPiece p={p} />
          </div>
        );
      })}
      {f >= rec + 8 && (
        <Rise at={rec + 8} dur={16} x={690} y={450} w={430} h={330}>
          <div style={{ ...typeStyle({ ...earwormType.keyword, cap: 125, weight: 700 }), ...capTrim, ...distressMask(40, 90), position: "absolute", left: 0, top: 10, whiteSpace: "pre", lineHeight: "134px" }}>
            <div style={{ ...capTrim }}>QUIET</div>
            <div style={{ ...capTrim, marginTop: 30, fontSize: undefined }}>STORM</div>
          </div>
        </Rise>
      )}
    </DesignSpace>
  );
};

/** S26: SpinSwap itself is applied by the caller; this builds the outgoing/incoming worlds on the S26 clock */
export const S26A: React.FC<{ E: Events; base: number }> = ({ E, base }) => (
  <AbsoluteFill>
    <BlackCollageGround seed="s26a" />
    <DesignSpace><div style={abs(0, 560, 520, 520, { filter: "brightness(.3)", clipPath: "polygon(0 8%,100% 0,92% 100%,0 100%)" })}><Newsprint w={520} h={520} seed="gh" fs={26} /></div></DesignSpace>
    <StageA E={E} base={base} />
  </AbsoluteFill>
);
export const S26B: React.FC<{ E: Events; base: number; swapLocal: number }> = ({ E, base, swapLocal }) => (
  // incoming Sequence restarts its clock at the swap: add it back so StageB sees the S26 clock
  <Sequence from={-swapLocal} layout="none">
    <AbsoluteFill><BlackCollageGround seed="s26b" /><StageB E={E} base={base} /></AbsoluteFill>
  </Sequence>
);

// ───────────────────────── S27 phone + kinetic voice ─────────────────────────
const KIN = (E: Events) => [
  { t: "DID YOU WANT TO EAR", line: 0, words: [["DID", E.kin.did], ["YOU", E.kin.you], ["WANT", E.kin.want], ["TO EAR", E.kin.to]] as [string, number][], y: 370, cap: 200 },
  { t: "SOMETHING ?", line: 1, words: [["SOMETHING ?", E.kin.something]] as [string, number][], y: 650, cap: 200 },
];
const KinWord: React.FC<{ text: string; y: number; cap: number; seed: string }> = ({ text, y, cap, seed }) => (
  <div style={{ position: "absolute", left: "50%", top: y - cap / 2, transform: "translateX(-50%)", whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.kinetic, cap, leading: 1 }), ...distressMask(Math.floor(rand(seed) * 900), 0) }}>{text}</div>
);
export const S27: React.FC<{ E: Events; start: number }> = ({ E, start }) => {
  const f = useCurrentFrame(); // raw: words pop on the exact frame
  const g = f + start;
  const d = useDrawingFrame();
  const K = E.kin;
  // phone settle: oversized x2.65 → 1 over 854–869 (log steps, earworm-D §7)
  // the reference holds the blurred x2.64 phone f3637-3639, then the hard cut (shots.py) f3640 at x1.98 and the settle
  const KEYS: [number, number, number][] = [[0, 1.98, 8], [2, 1.52, 5], [4, 1.26, 3], [6, 1.11, 1], [8, 1.03, 0], [12, 1, 0]];
  let sc = 2.65, bl = 16;
  for (const [t, s, b] of KEYS) if (g - E.cutPhone >= t) { sc = s; bl = b; }
  const lifted = g >= E.handset;
  // word schedule (one drawing each, held until the next)
  const typeEl = (() => {
    if (g < K.did) return null;
    if (g < K.yes) {
      return <>{KIN(E).map((l, i) => <div key={i} style={{ position: "absolute", inset: 0 }}><LineWords words={l.words} g={g} y={l.y} cap={l.cap} seed={`k${i}`} /></div>)}</>;
    }
    if (g < K.feed) return <KinWord text="YES" y={531} cap={745} seed="y1" />;
    if (g < K.yes2) return <><KinWord text="YES" y={190} cap={640} seed="y1" /></>;
    if (g < K.dont) return <><KinWord text="YES" y={190} cap={640} seed="y1" /><KinWord text="YES" y={790} cap={640} seed="y2" /></>;
    if (g < K.stop) return <KinWord text="DON’T" y={540} cap={780} seed="d" />;
    if (g < K.ever) return <KinWord text="STOP" y={540} cap={800} seed="s" />;
    if (g < K.lovin) return <KinWord text="EVER" y={540} cap={800} seed="e" />;
    if (g < K.me) return <KinWord text="LOVIN" y={540} cap={780} seed="l" />;
    return <KinWord text="ME" y={560} cap={1200} seed="m" />;
  })();
  const wob = Math.floor(d / 1.5);
  return (
    <AbsoluteFill>
      <BlackCollageGround seed="s27" />
      <DesignSpace>
        <div style={abs(0, 0, DESIGN_W, DESIGN_H, { transformOrigin: "1000px 560px", transform: `scale(${sc})`, filter: bl ? `blur(${bl}px)` : undefined })}>
          {typeEl}
          {/* scrap under the phone */}
          <div style={abs(900, 640, 360, 230, { transform: "rotate(-4deg)" })}><Newsprint w={360} h={230} seed="ph" fs={14} /></div>
          <div style={abs(990, 480, 520, 322)}><PhoneBase w={520} /></div>
          <Cord w={400} h={300} d="M 790 620 C 760 700 800 740 880 700" />
          {!lifted ? (
            <div style={abs(1050, 430, 120, 400, { transform: "rotate(78deg)", transformOrigin: "0 0" })}><Handset len={400} /></div>
          ) : (
            <div style={abs(700, 200, 112, 400, { transform: "rotate(8deg)" })}><Handset len={400} /></div>
          )}
          {lifted && [0, 1, 2].map((i) => (
            <svg key={i} width={120} height={60} style={{ position: "absolute", left: 1400 + i * 40, top: 440 - i * 40 + (wob % 2) * 4 }}>
              <path d={`M0 30 q15 ${-20 + rand(`sq${wob}${i}`) * 10} 30 0 t30 0 t30 0`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
            </svg>
          ))}
        </div>
      </DesignSpace>
    </AbsoluteFill>
  );
};
const LineWords: React.FC<{ words: [string, number][]; g: number; y: number; cap: number; seed: string }> = ({ words, g, y, cap, seed }) => (
  <div style={{ position: "absolute", left: "50%", top: y - cap / 2, transform: "translateX(-50%)", whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.kinetic, cap, leading: 1 }), ...distressMask(Math.floor(rand(seed) * 900), 0) }}>
    {words.map(([t, f], j) => <span key={j} style={{ marginLeft: j ? cap * 0.28 : 0, visibility: g >= f ? "visible" : "hidden" }}>{t}</span>)}
  </div>
);

// ───────────────────────── S28 end card ─────────────────────────
export const EndCard: React.FC<{ reveal: number }> = ({ reveal }) => {
  const role = earwormType.seriesCard;
  const title = "SOUNDTRACK";
  const chars = Array.from(title);
  const order = chars.map((_, i) => ({ i, k: rand(`ec-${i}`) })).sort((a, b) => a.k - b.k).map((o) => o.i);
  const shown = new Set(order.slice(0, Math.round(reveal * chars.length)));
  return (
    <AbsoluteFill style={{ background: "#141414" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 345, textAlign: "center", ...typeStyle({ font: "TEXT_SERIF", cap: 46, weight: 400, italic: true, color: "#BEBEBE", leading: 1 }), ...capTrim }}>Kit</div>
      <div style={abs(891, 425, 170, 16, { background: voxEarworm.underline })} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 483, textAlign: "center", whiteSpace: "pre", ...typeStyle(role), ...capTrim, ...distressMask(100, 200) }}>
        {chars.map((c, i) => <span key={i} style={{ visibility: shown.has(i) ? "visible" : "hidden" }}>{c}</span>)}
      </div>
    </AbsoluteFill>
  );
};

export { interpolate };
