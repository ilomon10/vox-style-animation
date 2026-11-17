import React from "react";
import { AbsoluteFill } from "remotion";
import {
  CropMarks,
  CutOut,
  DiagramCard,
  ECHO,
  FlagLabel,
  FloorEllipse,
  PaperClip,
  PhotoPrint,
  PushPin,
  StampLabel,
  StickyNote,
  Tape,
  TapeLabel,
  TornPaper,
} from "../collage";
import { DesignSpace } from "../lib/stage";
import { darkCollage, paperDesk, voxExplainer } from "../tokens/colors";
import { FONTS } from "../tokens/fonts";

/**
 * Visual test bench for src/collage. Flat colour placeholders stand in for the Paper component.
 * Four panels: paper desk (top-left), Vox desk (top-right), dark collage (bottom-left),
 * cut-out treatments (bottom-right). Animated parts (sticky peel f24–32, flag unfurls f48+,
 * tape-label unfurl + write-on f72+, pin pops f40) play over the 480 frames.
 */
const Panel: React.FC<{ x: number; y: number; w: number; h: number; bg: string; label: string; children: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  bg,
  label,
  children,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, overflow: "hidden" }}>
    {children}
    <div style={{ position: "absolute", left: 8, bottom: 6, font: `600 13px ${FONTS.VOX_SANS}`, color: "rgba(128,128,128,.9)" }}>
      {label}
    </div>
  </div>
);

const Cap: React.FC<{ x: number; y: number; children: string }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y, font: `600 12px ${FONTS.VOX_SANS}`, whiteSpace: "nowrap", color: "rgba(110,110,110,.95)" }}>
    {children}
  </div>
);

const PHOTO_A = "assets/cc0/photos/chevrolet-1931-shulmans-market-dc-1941.jpg";
const PHOTO_B = "assets/cc0/photos/vanderbilt-cup-robertson-locomobile-1908.jpg";
const PHOTO_C = "assets/cc0/photos/panhard-engine-detail-1912.jpg";

export const CollageGallery: React.FC = () => (
  <AbsoluteFill style={{ background: "#111" }}>
    <DesignSpace>
      {/* ── paper desk ─────────────────────────────────────────────── */}
      <Panel x={0} y={0} w={960} h={540} bg={paperDesk.paper} label="paper desk: PhotoPrint desk / card / polaroid, Tape, StampLabel, CropMarks">
        <CropMarks width={960} height={540} inset={[70, 44]} length={220} />
        <PhotoPrint variant="desk" src={PHOTO_A} x={40} y={50} width={300} height={230} rotate={-6} />
        <Tape variant="opaque" x={125} y={34} width={126} rotate={-6} />
        <PhotoPrint variant="card" src={PHOTO_B} x={380} y={50} width={270} height={190} />
        <PhotoPrint variant="polaroid" src={PHOTO_C} x={690} y={60} width={210} height={250} rotate={4} />
        <Tape variant="opaque" x={740} y={44} width={110} ends="torn" seed="a" rotate={6} />
        <StampLabel text="911" x={70} y={330} rotate={-6} tape />
        <StampLabel text="Boxster" x={410} y={340} rotate={5} />
        <Tape variant="opaque" x={720} y={380} width={150} ends="zigzag" rotate={-12} />
        <Cap x={718} y={455}>opaque tape, zig-zag ends</Cap>
      </Panel>

      {/* ── Vox desk ───────────────────────────────────────────────── */}
      <Panel x={960} y={0} w={960} h={540} bg={voxExplainer.paper} label="vox: PhotoPrint vox, tapes, StickyNote, FlagLabel, TapeLabel, PaperClip, DiagramCard">
        <div style={{ position: "absolute", left: 960 * 0, top: 0 }}>
          <PhotoPrint variant="vox" src={PHOTO_A} x={30} y={40} width={250} height={200} rotate={-4} />
          <Tape variant="lime" x={95} y={30} width={100} height={34} rotate={-4} />
          <Tape variant="masking" x={170} y={200} width={100} height={36} rotate={22} ends="torn" seed="m" />
          <Tape variant="clear" x={20} y={190} width={110} height={34} rotate={-20} />
          <Tape variant="black" x={40} y={270} width={160} height={40} rotate={2} />
          <Cap x={30} y={330}>lime / masking / clear / black</Cap>
          <StickyNote text="EPI" x={330} y={50} delay={24} />
          <StickyNote text="Age?" x={330} y={220} still />
          <DiagramCard x={570} y={30} width={230} height={150} />
          <PaperClip x={760} y={22} height={80} rotate={14} />
          <TapeLabel text="DNA" text2="CARD" x={525} y={215} delay={72} clip rotate={-3} />
          <TapeLabel text="SALIVA TEST" tape="black" x={525} y={300} delay={96} rotate={2} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 380, width: 960, height: 160, background: voxExplainer.board }}>
          <FlagLabel text="Habits" x={40} y={30} delay={48} leader={{ dx: 80, dy: 70 }} />
          <FlagLabel text="Hardships" x={360} y={50} delay={60} />
          <FlagLabel text="Time" x={700} y={30} delay={72} leader={{ dx: -60, dy: 70 }} />
        </div>
      </Panel>

      {/* ── dark collage ───────────────────────────────────────────── */}
      <Panel x={0} y={540} w={960} h={540} bg={darkCollage.plate} label="dark collage: CutOut echo / sticker, FloorEllipse, PushPin, TornPaper">
        <TornPaper x={470} y={50} width={290} height={190} seed="s3" echo>
          <div style={{ padding: 20, font: `400 40px ${FONTS.OLD_BOOK}`, color: darkCollage.pageInk }}>1897</div>
        </TornPaper>
        <CutOut src="assets/cutouts/bat.png" x={30} y={50} width={340} height={147} echo={ECHO.crimson} />
        <CutOut src="assets/cutouts/candelabrum.png" x={790} y={40} width={130} height={179} echo={ECHO.crimson} />
        <FloorEllipse x={120} y={470} width={330} color={darkCollage.floorEllipse} />
        <CutOut src="assets/cutouts/furniture-chair.png" x={210} y={280} width={120} height={189} sticker={{ width: 7 }} />
        <CutOut src="assets/cutouts/furniture-bench.png" x={440} y={290} width={300} height={188} echo={ECHO.crimson} />
        <PushPin x={800} y={330} delay={40} />
        <PushPin x={860} y={400} delay={52} size={36} />
        <CutOut src="assets/cutouts/furniture-sphinx.png" x={60} y={230} width={90} height={149} sticker={{ width: 5 }} />
      </Panel>

      {/* ── treatments ─────────────────────────────────────────────── */}
      <Panel x={960} y={540} w={960} h={540} bg={paperDesk.paper} label="treatments: inkKey, tone bw / warmBW / duotone, yellow echo, sticker, car + man (AI matting)">
        <CutOut src="assets/cc0/engravings/bran-castle-torcsvar-rohbock-1864.jpg" x={20} y={30} width={300} height={243} inkKey />
        <CutOut src="assets/cutouts/bran-castle-ink.png" x={20} y={280} width={200} height={132} />
        <CutOut src="assets/cutouts/bat.png" x={20} y={430} width={150} height={65} tone="duotone" duotone={["#2a0b0e", "#e9d8c8"]} />
        <CutOut src="assets/cutouts/furniture-table.png" x={200} y={440} width={100} height={83} tone="warmBW" />
        <CutOut src="assets/cutouts/vintage-car.png" x={340} y={70} width={380} height={162} echo={ECHO.yellow} />
        <CutOut src="assets/cutouts/victorian-man.png" x={780} y={20} width={96} height={230} tone="bw" echo={ECHO.yellow} />
        <CutOut src="assets/cutouts/vintage-car.png" x={340} y={290} width={260} height={111} sticker={{ width: 14 }} shadow="prop" />
        <CutOut src="assets/cutouts/victorian-man.png" x={680} y={270} width={70} height={168} tone="warmBW" sticker={{ width: 6 }} />
        <CutOut src="assets/cutouts/candelabrum.png" x={820} y={280} width={100} height={138} tone="duotone" />
        <Cap x={340} y={440}>sticker 14 px + SHADOWS.prop</Cap>
      </Panel>
    </DesignSpace>
  </AbsoluteFill>
);
