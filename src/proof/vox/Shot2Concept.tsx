import React from "react";
import { CameraRig } from "../../motion";
import { PhotoPrint, TapeLabel, Tape } from "../../collage";
import { CrossOut, LeaderLine, MarkerRing, PencilRing, SketchArrow } from "../../explainer";
import { TitleRise } from "../../type";
import { useDrawingFrame } from "../../lib/time";
import { voxExplainer } from "../../tokens/colors";
import { SHADOWS } from "../../tokens/finish";
import { typeStyle, voxType } from "../../tokens/type";
import { Desk, WorldShadow } from "./shared";

const PHRASE = { ...voxType.annotation, cap: 66 };

/** VX-3 concept annotation (ref epigenetics@18.5 and @30.5): X during the push, pencil ring, arrow, "??". */
export const Shot2Concept: React.FC = () => {
  const f = useDrawingFrame();
  return (
    <CameraRig
      keys={[
        { at: 0, x: 960, y: 540, scale: 1 },
        { at: 36, x: 960, y: 540, scale: 1 },
        { at: 68, x: 1050, y: 590, scale: 1.375, ease: "push" },
      ]}
      drift={{ vx: 8, vy: 4, zoomPerSec: 0.02, from: 0 }}
    >
      <Desk seed="s2" />
      <WorldShadow x={-700} y={-500} w={1300} h={900} at="0% 0%" a={0.3} />
      {/* hero print cropped by the top edge */}
      <PhotoPrint variant="vox" src="assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg" x={300} y={-380} width={900} height={660} rotate={3} shadow="printContact" />
      <div style={{ position: "absolute", left: 1210, top: -90, width: 560, height: 430, transform: "rotate(-6deg)", background: voxExplainer.board, filter: SHADOWS.printContact }}>
        <div style={{ ...typeStyle(voxType.callout), position: "absolute", left: 120, top: 280, fontSize: 52 }}>Before the line</div>
      </div>
      <LeaderLine points={[{ x: 1300, y: 260 }, { x: 1300, y: 330 }, { x: 1330, y: 330 }]} color={voxExplainer.sansYellow} delay={10} />
      <Tape variant="masking" x={1000} y={250} width={220} height={60} rotate={-8} ends="torn" seed="m2" />
      <TapeLabel text="HIGHLAND" text2="PARK" x={90} y={250} rotate={-3} clip delay={6} />
      <MarkerRing cx={280} cy={930} rx={290} ry={200} delay={20} />
      <PhotoPrint variant="vox" src="assets/cc0/documents/peugeot-ad-avtomobil-magazine-1908.jpg" x={1700} y={480} width={420} height={575} rotate={9} shadow="printContact" />
      {/* phrase 1, crossed out during the push */}
      <div style={{ ...typeStyle(PHRASE), position: "absolute", left: 520, top: 470 }}>{"12 hours\nper car"}</div>
      <CrossOut x={490} y={455} w={420} h={185} delay={40} />
      {/* phrase 2, pencil-ringed */}
      <div style={{ position: "absolute", left: 1010, top: 700 }}>
        <TitleRise role={PHRASE} delay={56} duration={12}>93 minutes</TitleRise>
      </div>
      <PencilRing cx={1250} cy={745} rx={320} ry={92} delay={64} />
      <SketchArrow from={{ x: 1180, y: 640 }} to={{ x: 1290, y: 370 }} delay={74} />
      {f >= 86 && <div style={{ ...typeStyle(voxType.handwriting), position: "absolute", left: 1600, top: 640, fontSize: 110, color: voxExplainer.graphite }}>??</div>}
    </CameraRig>
  );
};
