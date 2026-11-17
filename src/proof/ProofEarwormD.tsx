import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useCues } from "../audio";
import { FilmFinish } from "../effects";
import { BlurThroughCut, DipToBlack, GlitchCut, SpinSwap } from "../earworm/fx";
import { StyleProvider } from "../tokens/theme";
import { mkEvents } from "./earwormD/events";
import { EndCard, InterviewWindow, S22, S23c, S25, S26A, S26B, S27 } from "./earwormD/Shots";

/**
 * PRIVATE sync proof: rebuilds Earworm segment D (global f2783-3842 = local 0-1059 @25) shot for shot ON ITS OWN SOUNDTRACK
 * (public/_private/earworm_D.wav: copyrighted, study-only, never publish). Events: src/proof/earwormD/events.ts.
 * Report: analysis/compare/proof-earworm-D.md
 */
export const PROOF_EARWORM_D_DURATION = 1060;

/** S26 → S27 defocus-out (analysis f3631-3639): blur px per drawing, on the S26 clock */
const Defocus: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const k = f < at ? -1 : Math.floor(((f - at) * 12) / 25);
  const bl = k < 0 ? 0 : [7, 12, 14, 16][Math.min(3, k)];
  return <AbsoluteFill style={{ filter: bl ? `blur(${bl}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const ProofEarwormD: React.FC = () => {
  const idx = useCues("_private/earworm_D");
  const E = React.useMemo(() => (idx.words.length ? mkEvents(idx) : null), [idx]);
  return (
    <StyleProvider style="voxEarworm">
      <FilmFinish overrides={{ grain: { sigma: 3, sizePx: 1.5, rate: 10, afterSplit: true } }}>
        <AbsoluteFill style={{ background: "#0A0A0A" }}>
          <Audio src={staticFile("_private/earworm_D.wav")} />
          {E && (
            <>
              <Sequence from={0} durationInFrames={E.cutInterview1} name="S22 NKC">
                <BlurThroughCut at={0} sfx={false} outgoing={null} incoming={<S22 E={E} cues={idx} />} />
              </Sequence>
              <Sequence from={E.cutInterview1} durationInFrames={E.cutInterview2 - E.cutInterview1} name="S23 interview 1 / dip / VU pull-back">
                <DipToBlack at={E.dipAt - E.cutInterview1} sfx={false} color="#000" outgoing={<InterviewWindow src="_private/earwormD_win1.mp4" />} incoming={<S23c E={E} />} />
              </Sequence>
              <Sequence from={E.cutInterview2} durationInFrames={E.cutRecord - E.cutInterview2} name="S24 interview 2">
                <InterviewWindow src="_private/earwormD_win2.mp4" />
              </Sequence>
              <Sequence from={E.cutRecord} durationInFrames={E.cutStage - E.cutRecord} name="S25 record + scope">
                <S25 E={E} cues={idx} start={E.cutRecord} />
              </Sequence>
              <Sequence from={E.cutStage} durationInFrames={E.phoneIn - E.cutStage} name="S26 stage, spin-swap, recap">
                <Defocus at={E.defocus - E.cutStage}>
                  <SpinSwap at={E.swap - E.cutStage} sfx={false} outgoing={<S26A E={E} base={E.cutStage} />} incoming={<S26B E={E} base={E.cutStage} swapLocal={E.swap - E.cutStage} />} />
                </Defocus>
              </Sequence>
              <Sequence from={E.phoneIn} durationInFrames={PROOF_EARWORM_D_DURATION - E.phoneIn} name="S27 phone, S28 end card">
                <GlitchCut at={E.glitchAt - E.phoneIn} sfx={false} dipBrightness={1} outgoing={<S27 E={E} start={E.phoneIn} />} card={(r: number) => <EndCard reveal={r} />} />
              </Sequence>
            </>
          )}
        </AbsoluteFill>
      </FilmFinish>
    </StyleProvider>
  );
};
