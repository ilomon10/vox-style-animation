import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FilmFinish } from "../effects";
import { DesignSpace } from "../lib/stage";
import { StyleProvider } from "../tokens/theme";
import { ClippingScene } from "./editorial/ClippingScene";
import { TitleScene } from "./editorial/TitleScene";

/**
 * Proof shot: "The Assembly Line" newsletter title sequence in the Vox editorial style (24 fps, on ones).
 * ED-1 title lockup 0–6.5 s, ED-2 clipping 6.5–15.0 s, cut to black. Beat times follow highlight@0–15 s.
 */
const TITLE_F = 156; // ref 6.5 s
const CLIP_F = 204; // ref 8.5 s (hold to 15.1 s)
const BLACK_F = 6;
export const PROOF_EDITORIAL_DURATION = TITLE_F + CLIP_F + BLACK_F;

export const ProofEditorial: React.FC = () => (
  <StyleProvider style="voxEditorial">
    <FilmFinish>
      <DesignSpace>
        <Sequence from={0} durationInFrames={TITLE_F} layout="none"><TitleScene /></Sequence>
        <Sequence from={TITLE_F} durationInFrames={CLIP_F} layout="none"><ClippingScene /></Sequence>
        <Sequence from={TITLE_F + CLIP_F} durationInFrames={BLACK_F} layout="none"><AbsoluteFill style={{ background: "#000" }} /></Sequence>
      </DesignSpace>
    </FilmFinish>
  </StyleProvider>
);
