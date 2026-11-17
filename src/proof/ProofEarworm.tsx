import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { useCues } from "../audio";
import { FilmFinish } from "../effects";
import { BlackCollageGround } from "../earworm";
import { DesignSpace } from "../lib/stage";
import { DrawingRate } from "../lib/time";
import { StyleProvider } from "../tokens/theme";
import { mkEvents, vocalTokens } from "./earworm/events";
import { Shot1 } from "./earworm/Shot1";
import { Shot2 } from "./earworm/Shot2";
import { Shot3 } from "./earworm/Shot3";

/**
 * PRIVATE sync proof: rebuilds Earworm segment A (f0–790 @25) shot for shot ON ITS OWN SOUNDTRACK (public/_private/earworm_A.wav:
 * copyrighted, study-only, never publish). Every event is derived from the cue sheet + SYNC offsets (src/proof/earworm/events.ts).
 * Report: analysis/compare/proof-earworm.md
 */
export const PROOF_EARWORM_DURATION = 791;

export const ProofEarworm: React.FC = () => {
  const idx = useCues("_private/earworm_A");
  const E = React.useMemo(() => (idx.words.length ? mkEvents(idx) : null), [idx]);
  const tokens = React.useMemo(() => (idx.words.length ? vocalTokens(idx) : []), [idx]);
  return (
    <StyleProvider style="voxEarworm">
      {/* grain re-seeded per DRAWING (≈10 Hz, earworm-A §6): the kit default is 12 */}
      <FilmFinish overrides={{ grain: { sigma: 3, sizePx: 1.5, rate: 10, afterSplit: true } }}>
        <AbsoluteFill style={{ background: "#0A0A0A" }}>
          <Audio src={staticFile("_private/earworm_A.wav")} />
          {E && (
            <DrawingRate rate={10}>
              <Sequence from={0} durationInFrames={E.cut2} name="S1 DC cold open">
                <BlackCollageGround seed="s1" />
                <DesignSpace><Shot1 E={E} /></DesignSpace>
              </Sequence>
              <Sequence from={E.cut2} durationInFrames={E.cut3 - E.cut2} name="S2 collage, record, quote">
                <BlackCollageGround seed="s2" />
                <DesignSpace><Shot2 E={E} tokens={tokens} /></DesignSpace>
              </Sequence>
              <Sequence from={E.cut3} durationInFrames={PROOF_EARWORM_DURATION - E.cut3} name="S3 photo">
                <DesignSpace><Shot3 E={E} /></DesignSpace>
              </Sequence>
            </DrawingRate>
          )}
        </AbsoluteFill>
      </FilmFinish>
    </StyleProvider>
  );
};
