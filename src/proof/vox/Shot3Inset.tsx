import React from "react";
import { CameraRig } from "../../motion";
import { PaperClip, PhotoPrint, Tape, TapeLabel } from "../../collage";
import { InsetMagnifier } from "../../explainer";
import { Desk, WorldShadow } from "./shared";

/** VX-4 inset magnification on the engine photo (ref epigenetics@45): pin -> cone -> circle, +1.6 % pop. */
export const Shot3Inset: React.FC = () => (
  <CameraRig keys={[{ at: 0, x: 960, y: 540, scale: 1 }]} drift={{ vx: 0, vy: 0, zoomPerSec: -0.02, from: 0 }}>
    <Desk seed="s3" />
    <WorldShadow x={-700} y={-500} w={1300} h={800} at="0% 0%" a={0.3} />
    <PhotoPrint variant="vox" src="assets/cc0/photos/panhard-engine-detail-1912.jpg" x={160} y={110} width={1180} height={880} rotate={-2} shadow="printLifted" />
    <Tape variant="masking" x={190} y={130} width={170} height={52} rotate={-35} ends="torn" seed="m3" />
    <PaperClip x={1220} y={90} height={120} rotate={10} />
    <TapeLabel text="PANHARD" text2="1912" x={140} y={950} rotate={-2} delay={44} />
    <InsetMagnifier pin={{ x: 740, y: 610 }} circle={{ x: 1500, y: 330 }} diameter={500} connector="cone" delay={12} seed="s3" />
  </CameraRig>
);
