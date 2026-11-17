import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { FilmFinish, Pillarbox } from "../effects";
import { DesignSpace } from "../lib/stage";
import { Shot, radialZoomIn, radialZoomOut } from "../transitions";
import { StyleProvider } from "../tokens/theme";
import { srpIn, srpOut } from "./vox/fx";
import { Shot1Title } from "./vox/Shot1Title";
import { Shot2Concept } from "./vox/Shot2Concept";
import { Shot3Inset } from "./vox/Shot3Inset";
import { Shot4Document } from "./vox/Shot4Document";

/** Proof shot: "How the assembly line changed work", Vox explainer style, 4 shots, 24 fps on twos. */
const D = [120, 108, 84, 96] as const;
export const PROOF_VOXEXPLAINER_DURATION = D[0] + D[1] + D[2] + D[3];

/** `pillarbox` = 4:3 window with #1F1F1F bars, for comparing against the (4:3) reference. */
export const ProofVoxExplainer: React.FC<{ pillarbox?: boolean }> = ({ pillarbox = false }) => (
  <StyleProvider style="voxExplainer">
    <FilmFinish>
      <DesignSpace>
        <Series>
          <Series.Sequence durationInFrames={D[0]}>
            <Shot tail={srpOut()}><Shot1Title /></Shot>
          </Series.Sequence>
          <Series.Sequence durationInFrames={D[1]}>
            <Shot head={srpIn()} tail={radialZoomOut({ frames: 8, to: 0.15 })}><Shot2Concept /></Shot>
          </Series.Sequence>
          <Series.Sequence durationInFrames={D[2]}>
            <Shot head={radialZoomIn({ frames: 12 })}><Shot3Inset /></Shot>
          </Series.Sequence>
          <Series.Sequence durationInFrames={D[3]}>
            <Shot><Shot4Document /></Shot>
          </Series.Sequence>
        </Series>
        {/* grade (round 2): reference blacks are lifted (p1 luma ~40) and the whole picture carries a faint warm cast */}
        <AbsoluteFill style={{ background: "#2A282B", mixBlendMode: "lighten" }} />
        <AbsoluteFill style={{ background: "#FEFCF8", mixBlendMode: "multiply" }} />
      </DesignSpace>
    </FilmFinish>
    {pillarbox ? <Pillarbox /> : null}
  </StyleProvider>
);
