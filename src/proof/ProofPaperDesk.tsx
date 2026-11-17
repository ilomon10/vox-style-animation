import React from "react";
import { AbsoluteFill, Easing, Img, Series, staticFile, useCurrentFrame } from "remotion";
import { FilmFinish, Paper } from "../effects";
import { CropMarks, CutOut, PaperClip, PhotoPrint, StampLabel, Tape } from "../collage";
import { Callout } from "../explainer";
import { DesignSpace } from "../lib/stage";
import { useDrawingFrame } from "../lib/time";
import { CameraRig, Enter } from "../motion";
import {
  Shot,
  exposureIn,
  fadeToBlack,
  flashShrinkOut,
  scaleMomentumIn,
  scaleMomentumOut,
  whipIn,
  whipOut,
  zoomThroughIn,
  zoomThroughOut,
} from "../transitions";
import { HighlightBox, SubtitleReveal, Typewriter, VideoCaption } from "../type";
import { DESK_SPLIT, PHOTO_GRADE, SHADOWS } from "../tokens/finish";
import { paperDesk } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { StyleProvider } from "../tokens/theme";
import { paperDeskType, typeStyle } from "../tokens/type";

/**
 * Proof shot, paper desk: "1908–1913: the race car and the assembly line".
 * Six shots (PD-1, PD-4, PD-2, PD-7, PD-9, PD-3) joined by momentum cuts (07), all @30 fps, graphics on 12 drawings/s.
 * Shot lengths (frames): see SHOTS. The flyover shot gets the stronger RGB split via FilmFinish overrides.
 */
const SHOTS = { card: 70, callout: 90, year: 75, footage: 90, desk: 150, quote: 190 } as const;
export const PROOF_PAPERDESK_DURATION = Object.values(SHOTS).reduce((a, b) => a + b, 0);
const DESK_FROM = SHOTS.card + SHOTS.callout + SHOTS.year + SHOTS.footage;

const P = {
  vanderbilt: "assets/cc0/photos/vanderbilt-cup-robertson-locomobile-1908.jpg",
  ford: "assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg",
  panhard: "assets/cc0/photos/panhard-engine-detail-1912.jpg",
  chevy: "assets/cc0/photos/chevrolet-1931-shulmans-market-dc-1941.jpg",
  bureau: "assets/cc0/photos/bureau-of-standards-engine-test-1930.jpg",
  fordAd: "assets/cc0/documents/ford-model-t-ad-colliers-1908.jpg",
  peugeotAd: "assets/cc0/documents/peugeot-ad-avtomobil-magazine-1908.jpg",
  car: "assets/cutouts/vintage-car.png",
  man: "assets/cutouts/victorian-man.png",
};

/** dark archival footage look inside the ▶ card (ref porsche@170.5: p95 ≈129) */
const FOOTAGE = `${PHOTO_GRADE.paperDesk.bw} brightness(0.58)`;
/** desk prints: blacks lifted to the measured archival look (ref blacks ≈58, mids ≈#98948F) */
const LIFT = `${SHADOWS.photoOnDesk} contrast(0.74) brightness(1.1)`;

const at = (x: number, y: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

/* ───────────────────────── PD-1 product card ───────────────────────── */
const ProductCard: React.FC = () => (
  <Shot head={scaleMomentumIn()} tail={zoomThroughOut()}>
    {/* already moving on frame 0: key 0 overscaled, settles to the +2.9 %/s hold push (08 PD-1) */}
    <CameraRig
      keys={[{ at: 0, x: 960, y: 540, scale: 1.04 }, { at: 8, x: 960, y: 540, scale: 1, ease: "settle" }]}
      drift={{ zoomPerSec: 0.029 }}
    >
      <Paper kind="grid" width={2400} height={1400} style={{ left: -240, top: -160 }} />
      <div style={at(960, 200, { transform: "translateX(-50%)" })}>
        <HighlightBox delay={8}>Chevrolet 1931</HighlightBox>
      </div>
      <div style={at(960, 372, { transform: "translateX(-50%)" })}>
        <SubtitleReveal delay={8 + 24 + 5}>Photographed in Washington, D.C., in 1941</SubtitleReveal>
      </div>
      {/* slide: +207 px → 0 in 8 f, 70 % done on the first drawing (08 PD-1); floor line at 84 % H */}
      <Enter type="slideLeft" distance={207} duration={8} firstFrameProgress={0.7} style={{ position: "absolute", inset: 0 }}>
        <CutOut src={P.car} x={345} y={500} width={1230} height={526} />
      </Enter>
    </CameraRig>
  </Shot>
);

/* ───────────────────────── PD-4 callout trio ───────────────────────── */
const CalloutShot: React.FC = () => (
  <Shot head={zoomThroughIn()} tail={whipOut()}>
    {/* settle ×1.09 → 1 on entry (08 PD-4) */}
    <CameraRig keys={[{ at: 0, x: 960, y: 540, scale: 1.09 }, { at: 10, x: 960, y: 540, scale: 1, ease: "overscaleSettle" }]}>
      <Img
        src={staticFile(P.ford)}
        style={{ position: "absolute", left: 0, top: -250, width: 1920, height: 1386, filter: `${PHOTO_GRADE.paperDesk.bw} sepia(0.35) saturate(1.2) contrast(0.7) brightness(1.2)` }}
      />
      <Callout cx={1330} cy={470} r={200} label={{ x: 140, y: 190 }} text="moving assembly line" delay={4} />
    </CameraRig>
  </Shot>
);

/* ───────────────────────── PD-2 year odometer ───────────────────────── */
// progress ease (.18,-.04,.79,1.09), analysis/porsche-part3-stills.md PD-2
const ODOMETER = Easing.bezier(0.18, -0.04, 0.79, 1.09);
const YEARS = [2024, 2011, 1998, 1984, 1971, 1958, 1945, 1936, 1928, 1921, 1916, 1913];

const YearCard: React.FC = () => {
  const f = useDrawingFrame();
  const role = paperDeskType.year;
  const p = ODOMETER(Math.min(1, Math.max(0, f / 28)));
  const idx = Math.min(YEARS.length - 1, Math.round(p * (YEARS.length - 1)));
  // highlighter: a bar first, then a fast sweep, ≈22 f (08 PD-2)
  const hp = ease("highlightWipe")(Math.min(1, Math.max(0, (f - 20) / 22)));
  const bar = f >= 20 ? 24 + hp * (430 - 24) : 0;
  return (
    <Shot head={whipIn()} tail={flashShrinkOut()}>
      <CameraRig keys={[{ at: 0, x: 960, y: 540 }]} drift={{ zoomPerSec: 0.02 }}>
        <Paper kind="warm" width={2400} height={1400} style={{ left: -240, top: -160 }} />
        <div style={at(960, 540, { transform: "translate(-50%, -50%)", width: 430, height: 190 })}>
          <div style={at(-10, 0, { width: bar, height: 160, background: paperDesk.highlight, mixBlendMode: "multiply" })} />
          <div style={{ ...typeStyle(role), ...at(0, 0), width: 430, textAlign: "center" }}>{YEARS[idx]}</div>
        </div>
      </CameraRig>
    </Shot>
  );
};

/* ───────────────────────── PD-7 footage + ▶ caption ───────────────────────── */
const FootageCard: React.FC = () => (
  <Shot head={exposureIn()} tail={scaleMomentumOut()}>
    <CameraRig keys={[{ at: 0, x: 960, y: 540 }]} drift={{ zoomPerSec: 0.015 }}>
      <Paper kind="grid" width={2400} height={1400} style={{ left: -240, top: -160 }} />
      <PhotoPrint variant="card" x={86} y={60} width={1747} height={960}>
        <Img src={staticFile(P.ford)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: FOOTAGE }} />
      </PhotoPrint>
    </CameraRig>
    <VideoCaption triangleIn="riseSpin" tone="dark" delay={4}>
      In 1913 a Model T took 93 minutes to build.
    </VideoCaption>
  </Shot>
);

/* ───────────────────────── PD-9 desk flyover ───────────────────────── */
const DeskFlyover: React.FC = () => (
  <Shot head={zoomThroughIn()}>
    <CameraRig
      keys={[
        { at: 0, x: 640, y: 760, scale: 0.85 },
        { at: 12, x: 760, y: 760, scale: 1.12, ease: "push" },
        { at: 55, x: 2000, y: 740, scale: 1.12, rotate: -11.4, ease: "slide" },
        { at: 95, x: 3300, y: 800, scale: 1.12, rotate: 8.2, ease: "slide" },
        { at: 130, x: 4200, y: 780, scale: 1.12, rotate: -17.1, ease: "slide" },
        { at: 150, x: 4400, y: 780, scale: 0.96, rotate: -12, ease: "settle" },
      ]}
    >
      <Paper kind="desk" width={5600} height={2000} style={{ left: -200, top: -100 }} />
      {/* cluster A: 1908 */}
      <PhotoPrint variant="desk" src={P.vanderbilt} x={330} y={430} width={660} height={500} rotate={-7} tone="warmBW" shadow={LIFT} />
      <Tape variant="opaque" x={540} y={410} width={280} rotate={-7} ends="torn" seed="a1" />
      <PhotoPrint variant="desk" src={P.panhard} x={930} y={560} width={560} height={420} rotate={6} tone="warmBW" shadow={LIFT} />
      <Tape variant="opaque" x={1120} y={545} width={240} rotate={8} ends="zigzag" seed="a2" />
      <StampLabel text="1908" x={640} y={990} rotate={-5} tape />
      <PaperClip x={1440} y={520} height={110} rotate={30} />
      {/* the Ford ad page */}
      <PhotoPrint variant="desk" src={P.fordAd} x={1700} y={260} width={560} height={850} rotate={4} />
      {/* cluster B: 1913 */}
      <PhotoPrint variant="desk" src={P.ford} x={2480} y={420} width={720} height={520} rotate={-4} tone="warmBW" shadow={LIFT} />
      <Tape variant="opaque" x={2740} y={400} width={300} rotate={-4} ends="torn" seed="b1" />
      <PhotoPrint variant="desk" src={P.chevy} x={3160} y={640} width={580} height={450} rotate={8} />
      <Tape variant="opaque" x={3360} y={625} width={240} rotate={8} ends="torn" seed="b2" />
      <StampLabel text="1913" x={2850} y={1010} rotate={6} tape />
      {/* cluster C */}
      <PhotoPrint variant="desk" src={P.bureau} x={3900} y={240} width={470} height={606} rotate={-9} tone="warmBW" shadow={LIFT} />
      <Tape variant="opaque" x={4040} y={225} width={200} rotate={-9} ends="zigzag" seed="c1" />
      <PhotoPrint variant="desk" src={P.peugeotAd} x={4420} y={520} width={470} height={644} rotate={5} />
      <PaperClip x={4780} y={500} height={100} rotate={-20} />
    </CameraRig>
  </Shot>
);

/* ───────────────────────── PD-3 quote card ───────────────────────── */
const FIG_X = 1133;
const FIG_TRAVEL = 740;
const FIG_START = 6;
const FIG_DUR = 35;

const QuoteCard: React.FC = () => {
  const f = useDrawingFrame();
  const e = ease("slide");
  const pos = (t: number) => FIG_X + FIG_TRAVEL * (1 - e(Math.min(1, Math.max(0, (t - FIG_START) / FIG_DUR))));
  const x = pos(f);
  // yellow echo lags 4 f behind and starts 15 f after the figure; settles to a 2 px rim (08 PD-3)
  const echoOn = f >= FIG_START + 15;
  const dx = echoOn ? Math.min(21, Math.max(0, pos(f - 4) - x)) + 2 : 2;
  const visible = f >= FIG_START;
  return (
    <Shot tail={fadeToBlack()}>
      <Paper kind="grid" color="#FAF6F2" width={1920} height={1080} />
      <CropMarks corners={["tr", "bl"]} />
      {visible && (
        <CutOut src={P.man} x={x} y={90} width={540} height={1296} tone="bw" echo={{ color: paperDesk.highlight, dx, dy: 2 }} />
      )}
      <div style={at(374, 324, { width: 760 })}>
        <Typewriter delay={6} cps={41}>
          {"“Any customer can have a\ncar painted any color\nthat he wants so long\nas it is black.”"}
        </Typewriter>
        <div style={{ textAlign: "right", marginTop: 14 }}>
          {/* NB: the portrait is an anonymous ~1870 carte de visite used as a stand-in figure, not Ford */}
          <Typewriter role={paperDeskType.attribution} cps={43} delay={6 + 63 + 4}>— Henry Ford</Typewriter>
        </div>
      </div>
    </Shot>
  );
};

/** FilmFinish whose RGB split strengthens for the desk flyover (DESK_SPLIT), measured on the global frame. */
const Finish: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const desk = frame >= DESK_FROM && frame < DESK_FROM + SHOTS.desk;
  return <FilmFinish overrides={desk ? { rgbSplit: DESK_SPLIT } : undefined}>{children}</FilmFinish>;
};

export const ProofPaperDesk: React.FC = () => (
  <StyleProvider style="paperDesk">
    <AbsoluteFill style={{ background: "#050402" }}>
      <Finish>
        <DesignSpace>
          <Series>
            <Series.Sequence durationInFrames={SHOTS.card}><ProductCard /></Series.Sequence>
            <Series.Sequence durationInFrames={SHOTS.callout}><CalloutShot /></Series.Sequence>
            <Series.Sequence durationInFrames={SHOTS.year}><YearCard /></Series.Sequence>
            <Series.Sequence durationInFrames={SHOTS.footage}><FootageCard /></Series.Sequence>
            <Series.Sequence durationInFrames={SHOTS.desk}><DeskFlyover /></Series.Sequence>
            <Series.Sequence durationInFrames={SHOTS.quote}><QuoteCard /></Series.Sequence>
          </Series>
        </DesignSpace>
      </Finish>
    </AbsoluteFill>
  </StyleProvider>
);
