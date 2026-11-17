import React from "react";
import { CameraRig } from "../../motion";
import { CutOut, PaperClip, PhotoPrint, StickyNote, TapeLabel, Tape } from "../../collage";
import { MarkerUnderline } from "../../explainer";
import { TitleRise } from "../../type";
import { voxExplainer } from "../../tokens/colors";
import { SHADOWS } from "../../tokens/finish";
import { voxType } from "../../tokens/type";
import { Desk, WorldShadow } from "./shared";

const TITLE = { ...voxType.title, cap: 86 };

/** VX-1 topic title on the desk (analysis/epigenetics.md f0-217; ref epigenetics@5.8). */
export const Shot1Title: React.FC = () => (
  <>
    <CameraRig
      keys={[
        { at: 0, x: 960, y: 560, scale: 0.93 },
        // settle pull-back 16-40
        { at: 18, x: 960, y: 560, scale: 1, ease: "settle" },
        { at: 52, x: 960, y: 560, scale: 1 },
        // push + tilt x1.21, 32 f, pushSoft
        { at: 84, x: 990, y: 495, scale: 1.21, ease: "pushSoft" },
      ]}
      drift={{ vx: 0, vy: 10, zoomPerSec: -0.03, from: 0 }}
    >
      <Desk seed="s1" />
      <WorldShadow x={1250} y={-450} w={1300} h={900} />
      {/* framing props cropped at the edges */}
      <div style={{ position: "absolute", left: 1560, top: -120, width: 520, height: 380, transform: "rotate(7deg)", background: voxExplainer.kraft, filter: SHADOWS.printContact }} />
      <CutOut src="assets/cutouts/vintage-car.png" x={-360} y={-40} width={720} height={270} rotate={-16} shadow="prop" />
      {/* back cards, 10-30 deg */}
      <PhotoPrint variant="vox" src="assets/cc0/photos/panhard-engine-detail-1912.jpg" x={1230} y={380} width={500} height={385} rotate={14} shadow="printContact" />
      <PhotoPrint variant="vox" src="assets/cc0/photos/bureau-of-standards-engine-test-1930.jpg" x={230} y={470} width={380} height={490} rotate={-24} shadow="printContact" />
      {/* hero */}
      <PhotoPrint variant="vox" src="assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg" x={470} y={385} width={980} height={720} rotate={-1} shadow="printLifted" />
      <Tape variant="masking" x={1180} y={360} width={170} height={52} rotate={18} ends="torn" seed="m1" />
      <TapeLabel text="HIGHLAND" text2="PARK" x={380} y={900} rotate={-2} clip delay={22} />
      <PaperClip x={1390} y={360} height={120} rotate={8} />
      {/* title: rises from its baseline mask during the push */}
      <div style={{ position: "absolute", left: 960, top: 225, transform: "translateX(-50%)" }}>
        <TitleRise role={TITLE} delay={58} duration={12}>Assembly Line</TitleRise>
      </div>
      <StickyNote text="1913" x={232} y={190} rotate={-2} delay={92} />
      <MarkerUnderline x1={770} x2={1300} y={352} delay={108} />
    </CameraRig>
  </>
);
