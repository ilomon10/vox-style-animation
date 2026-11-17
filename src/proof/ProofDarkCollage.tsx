import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FilmFinish, Paper } from "../effects";
import { CutOut, ECHO, FloorEllipse, TornPaper } from "../collage";
import { DesignSpace } from "../lib/stage";
import { useDrawingFrame } from "../lib/time";
import { Enter } from "../motion";
import { Shot, LightningStrike, fadeThroughBlack, fadeThroughBlackIn } from "../transitions";
import { BoilText, Typewriter } from "../type";
import { darkCollage } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { collageType, typeStyle } from "../tokens/type";
import { StyleProvider } from "../tokens/theme";
import { AtFrame, BoltArt, DamaskCarpet, StoneWall, Stars, Tip, archPath } from "./darkcollage/parts";

/**
 * Proof shot: "A Victorian ghost story" in the dark cut-out collage style (Dracula reference).
 * 24 fps, all art on twos (kit clocks), weave on ones (FilmFinish). Shots (frames @24):
 *   1  title over scenery (DC-2)        0–90     tail: fade through black
 *   2  parlour tableau (DC-1)           90–234   head: fade-through-black in, stage lights up
 *   3  bats + lightning (DC-4 / DC-3)   234–330  hard cut
 *   4  end title (DC-5)                 330–372
 */
const S1 = 90;
const S2 = 144;
const S3 = 96;
const S4 = 42;
export const PROOF_DARKCOLLAGE_DURATION = S1 + S2 + S3 + S4;

/** scratched black card, identical in every shot so the fade-through-black has continuity */
const Plate: React.FC = () => (
  <>
    <Paper kind="blackCard" seed="plate" />
    {/* proof round 2: reference black point is L≈13, the kit plate sits at ≈24 */}
    <AbsoluteFill style={{ background: "#000", opacity: 0.3 }} />
  </>
);

const grey = (b: number) => ({ filter: `brightness(${b})` });

// ── 1 · DC-2 title over scenery ─────────────────────────────────────────────
const MOON = { cx: 1500, cy: 285, r: 135 };
/** skyline of the castle engraving (local px of the 1010×665 box): drops the plate's sky, keeps a ragged cut-out edge */
const CASTLE_PTS: [number, number][] = [[130, 665], [105, 560], [150, 450], [120, 380], [185, 300], [230, 275], [300, 255], [400, 215], [440, 150], [470, 112], [500, 96], [540, 100], [580, 112], [620, 150], [670, 205], [740, 265], [800, 300], [880, 245], [960, 205], [1010, 215], [1010, 665]];
const castleClip = (k: number) => `polygon(${CASTLE_PTS.map(([x, y]) => `${x * k}px ${y * k}px`).join(",")})`;

const Title: React.FC = () => (
  <Shot head={undefined} tail={fadeThroughBlack()}>
    <Plate />
    {/* torn cream patch bursts in 0.54→1, bottom-centre anchor, red echo edge */}
    <Enter type="burst" delay={0} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} anchor="1280px 1080px">
      <TornPaper x={740} y={80} width={1120} height={1100} seed="patch" roughness={16} echo={{ color: darkCollage.crimsonEcho, dx: -26, dy: -22 }} />
    </Enter>
    {/* blood-moon disc with a cream echo */}
    <Enter type="scaleIn" fromScale={0.3} delay={22} duration={8} style={{ position: "absolute", left: 0, top: 0 }}>
      <div style={{ position: "absolute", left: MOON.cx - MOON.r - 24, top: MOON.cy - MOON.r - 18, width: MOON.r * 2, height: MOON.r * 2, borderRadius: "50%", background: darkCollage.crescent }} />
      <div style={{ position: "absolute", left: MOON.cx - MOON.r, top: MOON.cy - MOON.r, width: MOON.r * 2, height: MOON.r * 2, borderRadius: "50%", background: darkCollage.bloodMoon }} />
    </Enter>
    {/* "XIX" rises from behind the castle line (masked rise) */}
    <div style={{ position: "absolute", left: 790, top: 470, width: 640, height: 250 }}>
      <Enter type="maskedRise" distance={260} delay={30} duration={11} mask={{ y: 250 }}>
        <div style={{ ...numeral }}>XIX</div>
      </Enter>
    </div>
    {/* castle engraving rises from below (≈12 f) */}
    <Enter type="rise" distance={700} delay={8} duration={12} style={{ position: "absolute", left: 0, top: 0 }}>
      <CutOut src="assets/cutouts/bran-castle-ink.png" x={930} y={445} width={1010} height={665} style={{ clipPath: castleClip(1) }} />
    </Enter>
    <div style={{ position: "absolute", left: 830, top: 735 }}>
      <Typewriter role={collageType.label} delay={38} schedule={[0, 2, 6, 8, 10, 14, 16]}>century</Typewriter>
    </div>
  </Shot>
);
const numeral: React.CSSProperties = { ...typeStyle(collageType.display), lineHeight: "250px" };

// ── 2 · DC-1 parlour tableau ────────────────────────────────────────────────
/** stage lights up: a flat pale wash on the plate over the first drawings (screen, stepped) */
const StageLight: React.FC = () => {
  const f = useDrawingFrame();
  const p = ease("enter")(Math.min(1, Math.max(0, (f - 6) / 12)));
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: 0.2 * p,
        background: "radial-gradient(ellipse 900px 700px at 50% 62%, #BFBDB8 0%, #4C4A49 55%, #0000 100%)",
      }}
    />
  );
};

const GRAV = { type: "gravityDrop" as const, distance: 900, duration: 8 };
const Drop: React.FC<{ at: number; x: number; y: number; w: number; h: number; src: string; ellipse?: number; echo?: boolean; b?: number; children?: React.ReactNode }> = ({
  at, x, y, w, h, src, ellipse = 0.8, echo, b = 0.5,
}) => (
  <>
    <AtFrame at={at + 8}>
      <FloorEllipse x={x + w * (1 - ellipse) / 2} y={y + h - w * ellipse * 0.06} width={w * ellipse} color={darkCollage.floorEllipse} />
    </AtFrame>
    <Enter {...GRAV} delay={at} style={{ position: "absolute", left: 0, top: 0, zIndex: 2, ...(echo ? grey(0.76) : grey(b)) }}>
      <CutOut src={src} x={x} y={y} width={w} height={h} tone="bw" echo={echo ? ECHO.crimson : undefined} />
    </Enter>
  </>
);

const Parlour: React.FC = () => (
  <Shot head={fadeThroughBlackIn()}>
    <Plate />
    <StageLight />
    <Enter type="slideLeft" distance={1765} delay={12} duration={12} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, zIndex: 0 }}>
      <DamaskCarpet top={820} />
    </Enter>
    <Drop at={26} x={40} y={690} w={440} h={284} src="assets/cutouts/furniture-bench.png" />
    <Drop at={32} x={1180} y={600} w={232} h={392} src="assets/cutouts/furniture-chair.png" />
    {/* table lands, then tips over (secondary action) */}
    <AtFrame at={44}>
      <FloorEllipse x={1500} y={962} width={330} color={darkCollage.floorEllipse} />
    </AtFrame>
    <Enter {...GRAV} delay={38} style={{ position: "absolute", left: 0, top: 0, zIndex: 2, ...grey(0.5) }}>
      <div style={{ position: "absolute", left: 1500, top: 640, width: 360, height: 297 }}>
        <Tip at={52} duration={8} degrees={-80} width={360} height={297}>
          <CutOut src="assets/cutouts/furniture-table.png" x={0} y={0} width={360} height={297} tone="bw" />
        </Tip>
      </div>
    </Enter>
    <Drop at={46} x={520} y={560} w={296} h={408} src="assets/cutouts/candelabrum.png" ellipse={0.9} b={0.7} />
    <Drop at={58} x={795} y={235} w={330} h={792} src="assets/cutouts/victorian-man.png" echo ellipse={0.8} />
  </Shot>
);

// ── 3 · bats + lightning ─────────────────────────────────────────────────────
const BATS = [
  { x0: 300, y0: 1100, x1: 760, y1: 250, w: 300, delay: 4 },
  { x0: 260, y0: 1150, x1: 1020, y1: 120, w: 240, delay: 14 },
  { x0: 520, y0: 1180, x1: 1380, y1: 330, w: 330, delay: 24 },
  { x0: 380, y0: 1120, x1: 1280, y1: 60, w: 200, delay: 34 },
  { x0: 700, y0: 1160, x1: 1530, y1: 200, w: 260, delay: 44 },
];
const Bat: React.FC<(typeof BATS)[number] & { i: number }> = ({ x0, y0, x1, y1, w, delay, i }) => {
  const f = useDrawingFrame();
  const p = ease("enter")(Math.min(1, Math.max(0, (f - delay) / 40)));
  if (f < delay) return null;
  const sway = Math.sin(f * 0.9 + i) * 5;
  const flap = 1 + Math.sin(f * 1.6 + i * 2) * 0.07;
  const h = w * (461 / 1065);
  return (
    <div style={{ position: "absolute", left: x0 + (x1 - x0) * p - w / 2, top: y0 + (y1 - y0) * p - h / 2, width: w, height: h, transform: `rotate(${sway - 12}deg) scaleY(${flap})` }}>
      <CutOut src="assets/cutouts/bat.png" width={w} height={h} tone="bw" sticker={{ width: 3 }} />
    </div>
  );
};

const WIN = { x: 700, y: 70, w: 520, h: 660 };
const Window: React.FC = () => (
  <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${WIN.x - 36} ${WIN.y - 36})`}>
        <path d={archPath(WIN.w + 72, WIN.h + 72)} fill="#636160" />
      </g>
      <g transform={`translate(${WIN.x} ${WIN.y})`}>
        <path d={archPath(WIN.w, WIN.h)} fill="#0A0909" />
        <clipPath id="winClip"><path d={archPath(WIN.w, WIN.h)} /></clipPath>
        <g clipPath="url(#winClip)"><Stars w={WIN.w} h={WIN.h} /></g>
      </g>
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(${WIN.y}px ${1920 - WIN.x - WIN.w}px ${1080 - WIN.y - WIN.h}px ${WIN.x}px)` }}>
      <div style={{ position: "absolute", left: 960 - 130 - 22, top: 300 - 130 - 16, width: 260, height: 260, borderRadius: "50%", background: darkCollage.crescent }} />
      <div style={{ position: "absolute", left: 960 - 130, top: 300 - 130, width: 260, height: 260, borderRadius: "50%", background: darkCollage.bloodMoon }} />
      <CutOut src="assets/cutouts/bran-castle-ink.png" x={760} y={470} width={720} height={474} style={{ filter: "invert(1) brightness(0.75)", clipPath: castleClip(720 / 1010) }} />
    </div>
    <div style={{ position: "absolute", left: 690, top: 722, width: 540, height: 26, background: "#5A5856" }} />
  </>
);

const BatsShot: React.FC = () => (
  <Shot>
    <Plate />
    <LightningStrike at={48} bolt={<BoltArt x={940} />}>
      <StoneWall />
      <Window />
      {BATS.map((b, i) => <Bat key={i} i={i} {...b} />)}
      <Enter type="rise" distance={300} delay={6} duration={8} style={{ position: "absolute", left: 0, top: 0, ...grey(0.75) }}>
        <CutOut src="assets/cutouts/candelabrum.png" x={1340} y={560} width={250} height={345} tone="bw" />
      </Enter>
    </LightningStrike>
  </Shot>
);

// ── 4 · DC-5 end title ───────────────────────────────────────────────────────
const End: React.FC = () => (
  <Shot>
    <Plate />
    <div style={{ position: "absolute", left: 0, top: 380, width: 1920, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <BoilText seed="end" style={{ transform: "scale(1.2, 1.45)" }}>THE END</BoilText>
    </div>
  </Shot>
);

export const ProofDarkCollage: React.FC = () => (
  <StyleProvider style="darkCollage">
    <FilmFinish overrides={{ grain: { sigma: 6, sizePx: 1.7, rate: 0, afterSplit: false } }}>
      <DesignSpace>
        <Sequence from={0} durationInFrames={S1}><Title /></Sequence>
        <Sequence from={S1} durationInFrames={S2}><Parlour /></Sequence>
        <Sequence from={S1 + S2} durationInFrames={S3}><BatsShot /></Sequence>
        <Sequence from={S1 + S2 + S3} durationInFrames={S4}><End /></Sequence>
      </DesignSpace>
    </FilmFinish>
  </StyleProvider>
);
