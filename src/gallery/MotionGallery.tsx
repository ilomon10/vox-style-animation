import React from "react";
import { AbsoluteFill, Sequence, Series, useCurrentFrame } from "remotion";
import { DesignSpace, Stage } from "../lib/stage";
import {
  Boil,
  CameraRig,
  Enter,
  EnterType,
  Exit,
  MotionTrail,
  Pendulum,
  PuppetLimb,
  RadialBlur,
  Sway,
} from "../motion";
import {
  Fx,
  LightningStrike,
  Shot,
  crashZoom,
  exposureIn,
  fadeThroughBlack,
  fadeThroughBlackIn,
  fadeToBlack,
  flashShrinkOut,
  pullBack,
  rackFocusIn,
  radialZoomIn,
  radialZoomOut,
  scaleMomentumIn,
  scaleMomentumOut,
  snapZoom,
  whipIn,
  whipOut,
  zoomThroughIn,
  zoomThroughOut,
} from "../transitions";

const FONT = "Helvetica, Arial, sans-serif";
const INK = "#1d1b19";
const PAPER = "#e8e0cf";

const Label: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children,
  size = 28,
  style,
}) => <div style={{ fontFamily: FONT, fontSize: size, fontWeight: 700, color: INK, ...style }}>{children}</div>;

/** frame counter, fixed on screen (outside any rig) */
const Counter: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        top: 20,
        fontFamily: "monospace",
        fontSize: 26,
        color: "#fff",
        background: "#000a",
        padding: "6px 12px",
      }}
    >
      {title} · f{f}
    </div>
  );
};

// ── 1. camera over a world grid ──────────────────────────────────────────────
const WORLD_W = 3600;
const WORLD_H = 2400;
const WorldGrid: React.FC = () => {
  const labels = [];
  for (let gx = 0; gx <= WORLD_W; gx += 400)
    for (let gy = 0; gy <= WORLD_H; gy += 400)
      labels.push(
        <div key={`${gx}-${gy}`} style={{ position: "absolute", left: gx + 8, top: gy + 6, fontFamily: "monospace", fontSize: 22, color: "#9fb4c0" }}>
          {gx},{gy}
        </div>,
      );
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WORLD_W,
          height: WORLD_H,
          background: "#1d2a33",
          backgroundImage:
            "linear-gradient(#3a5160 2px, transparent 2px), linear-gradient(90deg, #3a5160 2px, transparent 2px)",
          backgroundSize: "200px 200px",
        }}
      />
      {labels}
      <div style={{ position: "absolute", left: 1700, top: 900, width: 360, height: 160, background: "#e9c46a", display: "grid", placeItems: "center" }}>
        <Label size={64}>FOCUS</Label>
      </div>
      <div style={{ position: "absolute", left: 880, top: 1300, width: 240, height: 240, background: "#e76f51", borderRadius: 120 }} />
    </>
  );
};

const CameraDemo: React.FC = () => (
  <AbsoluteFill>
    <CameraRig
      keys={[
        // shot starts on an already-moving camera: settle ease has high initial velocity
        { at: 0, x: 1300, y: 1000, scale: 1.25 },
        { at: 34, x: 1000, y: 700, scale: 1, ease: "settle" },
        // push-in to the FOCUS word, 32 f @24
        { at: 40, x: 1000, y: 700, scale: 1 },
        { at: 72, x: 1880, y: 980, scale: 2, ease: "push" },
        // pan with roll (desk flyover)
        { at: 84, x: 1880, y: 980, scale: 2 },
        { at: 112, x: 1000, y: 1420, scale: 1.2, rotate: 12, ease: "pushSoft" },
      ]}
      drift={{ vx: 20, vy: -10, zoomPerSec: 0.04 }}
    >
      <WorldGrid />
    </CameraRig>
    <Counter title="CameraRig: settle 0-34 / push 40-72 / pan+roll 84-112 / drift" />
  </AbsoluteFill>
);

// ── 2. enter / exit presets ──────────────────────────────────────────────────
const Prop: React.FC<{ color: string; text: string }> = ({ color, text }) => (
  <div style={{ width: 150, height: 110, background: color, display: "grid", placeItems: "center", border: `4px solid ${INK}` }}>
    <Label size={26}>{text}</Label>
  </div>
);

const Tile: React.FC<{ i: number; name: string; children: React.ReactNode; line?: boolean }> = ({ i, name, children, line }) => {
  const col = i % 5;
  const row = Math.floor(i / 5);
  return (
    <div style={{ position: "absolute", left: 40 + col * 372, top: 90 + row * 330, width: 350, height: 300, background: "#2b2b2b", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 10, top: 8, fontFamily: "monospace", fontSize: 22, color: "#fff" }}>{name}</div>
      <div style={{ position: "absolute", left: 100, top: 110 }}>{children}</div>
      {line ? <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 3, background: "#e9c46a" }} /> : null}
    </div>
  );
};

const ENTERS: { type: EnterType; extra?: Record<string, unknown>; name?: string }[] = [
  { type: "drop" },
  { type: "rise" },
  { type: "slideLeft" },
  { type: "slideRight" },
  { type: "scaleIn" },
  { type: "pop" },
  { type: "maskedRise", extra: { mask: { y: 110 }, distance: 110 } },
  { type: "gravityDrop", extra: { distance: 220 } },
  { type: "burst" },
  { type: "drop", extra: { startRotate: -15, distance: 200 }, name: "drop+startRotate" },
  { type: "slideLeft", extra: { firstFrameProgress: 0.7 }, name: "slideLeft ffp .7" },
];

const EnterExitDemo: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    {ENTERS.map((e, i) => (
      <Tile key={i} i={i} name={e.name ?? e.type} line={e.type === "maskedRise"}>
        <Enter type={e.type} delay={4 + i * 6} distance={e.type === "gravityDrop" ? 220 : 160} {...(e.extra ?? {})}>
          <Prop color="#6ba3b8" text={e.type === "maskedRise" ? "XV" : "prop"} />
        </Enter>
      </Tile>
    ))}
    {(["fallOut", "slideOut", "shrink"] as const).map((t, j) => (
      <Tile key={t} i={11 + j} name={`Exit ${t}`}>
        <Exit type={t} at={70 + j * 8} distance={t === "fallOut" ? 300 : 400}>
          <Prop color="#e07a5f" text="prop" />
        </Exit>
      </Tile>
    ))}
    <Tile i={14} name="(spare)">
      <div />
    </Tile>
    <Counter title="Enter / Exit presets" />
  </AbsoluteFill>
);

// ── 3. puppetry, trail, radial ───────────────────────────────────────────────
const PuppetDemo: React.FC = () => {
  const f = useCurrentFrame();
  const pos = Math.min(1, f / 40);
  const dx = 900 * (1 - Math.pow(1 - pos, 3));
  const prev = 900 * (1 - Math.pow(1 - Math.min(1, (f - 2) / 40), 3));
  const rs = Math.abs(Math.sin(f / 14)) * 0.5;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 80, top: 80 }}>
        <Label>Pendulum</Label>
        <Pendulum delay={6} style={{ position: "absolute", left: 40, top: 50, width: 200 }}>
          <div style={{ width: 6, height: 120, background: INK, margin: "0 auto" }} />
          <div style={{ width: 200, height: 90, background: "#e9c46a", border: `4px solid ${INK}`, display: "grid", placeItems: "center" }}>
            <Label>XV</Label>
          </div>
        </Pendulum>
      </div>
      <div style={{ position: "absolute", left: 480, top: 80 }}>
        <Label>PuppetLimb</Label>
        <div style={{ position: "absolute", left: 20, top: 120, width: 90, height: 150, background: "#6ba3b8", border: `4px solid ${INK}` }} />
        <PuppetLimb angle={-70} delay={6} pivot="0% 50%" style={{ position: "absolute", left: 110, top: 160, width: 150, height: 36 }}>
          <div style={{ width: 150, height: 36, background: "#e07a5f", border: `4px solid ${INK}` }} />
        </PuppetLimb>
      </div>
      <div style={{ position: "absolute", left: 860, top: 80 }}>
        <Label>Sway</Label>
        <Sway x={14} y={10} rotate={2} speed={0.8} style={{ position: "absolute", left: 20, top: 80 }}>
          <Prop color="#81b29a" text="sway" />
        </Sway>
      </div>
      <div style={{ position: "absolute", left: 1160, top: 80 }}>
        <Label>Boil (every 6 f)</Label>
        <Boil amp={4} rotate={1.5} style={{ position: "absolute", left: 20, top: 80 }}>
          <Prop color="#f2cc8f" text="boil" />
        </Boil>
      </div>
      <div style={{ position: "absolute", left: 80, top: 440, width: 1000, height: 220, background: "#2b2b2b", overflow: "hidden" }}>
        <Label style={{ color: "#fff", position: "absolute", left: 10, top: 6 }}>MotionTrail</Label>
        <MotionTrail dx={dx - prev} dy={0}>
          <div style={{ position: "absolute", left: dx, top: 90, width: 90, height: 90, background: "#e76f51", borderRadius: 45 }} />
        </MotionTrail>
      </div>
      <div style={{ position: "absolute", left: 1160, top: 440, width: 640, height: 400, background: "#2b2b2b", overflow: "hidden" }}>
        <RadialBlur strength={rs} origin={{ x: 320, y: 200 }}>
          <div style={{ position: "absolute", left: 220, top: 100, width: 200, height: 200, background: "#e9c46a", border: "6px solid #fff" }}>
            <Label size={40} style={{ padding: 20 }}>RADIAL</Label>
          </div>
        </RadialBlur>
      </div>
      <Counter title="Puppetry / Trail / Radial" />
    </AbsoluteFill>
  );
};

// ── 4. transition series ─────────────────────────────────────────────────────
const COLORS = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51", "#6d597a", "#355070", "#b56576", "#457b9d", "#1d3557", "#3d405b"];

const Content: React.FC<{ i: number; title: string }> = ({ i, title }) => (
  <AbsoluteFill style={{ background: COLORS[i % COLORS.length] }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(#ffffff22 2px, transparent 2px), linear-gradient(90deg, #ffffff22 2px, transparent 2px)",
        backgroundSize: "120px 120px",
      }}
    />
    <div style={{ position: "absolute", left: 560, top: 240, width: 800, height: 600, border: "10px solid #fff", display: "grid", placeItems: "center" }}>
      <Label size={150} style={{ color: "#fff" }}>{i + 1}</Label>
    </div>
    <Label size={40} style={{ color: "#fff", position: "absolute", left: 40, bottom: 40 }}>{title}</Label>
  </AbsoluteFill>
);

const Bolt: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
    <polyline points="1000,0 900,300 1000,320 860,700 960,720 820,1080" fill="none" stroke="#fff" strokeWidth={14} />
  </svg>
);

const SHOTS: { title: string; head?: Fx; tail?: Fx; len?: number; lightning?: boolean }[] = [
  { title: "tail zoomThroughOut", tail: zoomThroughOut({ brighten: 0.15 }) },
  { title: "head zoomThroughIn · tail flashShrinkOut", head: zoomThroughIn(), tail: flashShrinkOut() },
  { title: "head exposureIn · tail scaleMomentumOut", head: exposureIn(), tail: scaleMomentumOut() },
  { title: "head scaleMomentumIn · tail whipOut", head: scaleMomentumIn(), tail: whipOut() },
  { title: "head whipIn · tail radialZoomOut", head: whipIn(), tail: radialZoomOut() },
  { title: "head radialZoomIn · tail fadeThroughBlack", head: radialZoomIn(), tail: fadeThroughBlack() },
  { title: "head fadeThroughBlackIn · tail crashZoom", head: fadeThroughBlackIn(), tail: crashZoom({ frames: 25 }) },
  { title: "head rackFocusIn · tail snapZoom", head: rackFocusIn(), tail: snapZoom() },
  { title: "tail pullBack · LightningStrike", tail: pullBack(), lightning: true },
  { title: "tail fadeToBlack (on ones)", tail: fadeToBlack(), len: 72 },
];

const TransitionSeries: React.FC = () => (
  <Series>
    {SHOTS.map((s, i) => (
      <Series.Sequence key={i} durationInFrames={s.len ?? 32}>
        <Shot head={s.head} tail={s.tail}>
          {s.lightning ? (
            <LightningStrike at={10} bolt={<Bolt />}>
              <Content i={i} title={s.title} />
            </LightningStrike>
          ) : (
            <Content i={i} title={s.title} />
          )}
        </Shot>
      </Series.Sequence>
    ))}
  </Series>
);

export const MotionGallery: React.FC = () => (
  <Stage background="#000">
    <DesignSpace>
      <Sequence from={0} durationInFrames={120}>
        <CameraDemo />
      </Sequence>
      <Sequence from={120} durationInFrames={150}>
        <EnterExitDemo />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <PuppetDemo />
      </Sequence>
      <Sequence from={360} durationInFrames={360}>
        <TransitionSeries />
      </Sequence>
    </DesignSpace>
  </Stage>
);
