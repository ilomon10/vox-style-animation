import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useCues } from "../audio";
import { FilmFinish } from "../effects";
import { BlackCollageGround } from "../earworm";
import { bridgeBlack, dipToBlackPlan } from "../earworm/fx";
import { DesignSpace } from "../lib/stage";
import { DrawingRate } from "../lib/time";
import { StyleProvider } from "../tokens/theme";
import { mkEvents } from "./earwormB/events";
import { DC } from "./earwormB/DC";
import { ClintonCircle, ClintonPhotos } from "./earwormB/Clinton";
import { Words } from "./earwormB/Words";
import { Angela, Fredara } from "./earwormB/Interview";
import { Radio } from "./earwormB/Radio";
import { Jazz, Whur } from "./earwormB/Jazz";

/**
 * PRIVATE sync proof: rebuilds Earworm segment B (global f791–1739) shot for shot ON ITS OWN SOUNDTRACK (public/_private/earworm_B.wav,
 * copyrighted, study-only, never publish). Local frame = global − 791. Events derive from the cue sheet + SYNC offsets
 * (src/proof/earwormB/events.ts). Interview footage is the reference's own webcam pixels, cropped (private proof only).
 * Report: analysis/compare/proof-earworm-B.md
 */
export const PROOF_EARWORM_B_DURATION = 949;

const Dip: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: bridgeBlack(f, dipToBlackPlan(at, "chapter")) }} />;
};

export const ProofEarwormB: React.FC = () => {
  const idx = useCues("_private/earworm_B");
  const E = React.useMemo(() => (idx.words.length ? mkEvents(idx) : null), [idx]);
  const plan = E ? dipToBlackPlan(E.dip, "chapter") : null;
  return (
    <StyleProvider style="voxEarworm">
      <FilmFinish overrides={{ grain: { sigma: 3, sizePx: 1.5, rate: 10, afterSplit: true } }}>
        <AbsoluteFill style={{ background: "#0A0A0A" }}>
          <Audio src={staticFile("_private/earworm_B.wav")} />
          {E && plan && (
            <>
              <DrawingRate rate={12}>
                <Sequence from={0} durationInFrames={E.circle} name="4a-4c1 ground">
                  <BlackCollageGround seed="s4a" />
                </Sequence>
                <Sequence from={0} durationInFrames={E.slam + 3} name="4a-4b album, DC collage">
                  <DesignSpace><DC E={E} /></DesignSpace>
                </Sequence>
                <Sequence from={E.slam} durationInFrames={E.circle - E.slam} name="4c-1 Clinton photo">
                  <DesignSpace><ClintonPhotos E={E} /></DesignSpace>
                </Sequence>
                <Sequence from={E.circle} durationInFrames={E.post - E.circle} name="4c-2 circle">
                  <BlackCollageGround seed="s4c" />
                  <DesignSpace><ClintonCircle E={E} /></DesignSpace>
                </Sequence>
              </DrawingRate>
              {/* 4d: the reference's pops land on its own drawing starts (twos): run on ones so every pop is on its event frame */}
              <DrawingRate rate={25}>
                <Sequence from={E.post} durationInFrames={E.fredara - E.post} name="4d kinetic words">
                  <BlackCollageGround seed="s4d" weave={false} />
                  <DesignSpace><Words E={E} /></DesignSpace>
                </Sequence>
              </DrawingRate>
              <Sequence from={E.fredara} durationInFrames={plan.black0 - E.fredara} name="5a Fredara">
                <DesignSpace><DrawingRate rate={12}><Fredara E={E} /></DrawingRate></DesignSpace>
              </Sequence>
              <DrawingRate rate={10}>
                {/* the reference's 10 dps grid sits 1 f earlier than the fade-up (drawings on f1353, 55, 59, 61, 64 …): start the sequence 1 f early (still under black) */}
                <Sequence from={plan.restart - 1} durationInFrames={E.angela - plan.restart + 1} name="5c radio">
                  <BlackCollageGround seed="s5c" />
                  <DesignSpace><Radio E={{ ...E, radioIn: plan.restart - 1 }} /></DesignSpace>
                </Sequence>
              </DrawingRate>
              <Sequence from={E.angela} durationInFrames={E.whur - E.angela} name="6 Angela">
                <DesignSpace><Angela /></DesignSpace>
              </Sequence>
              <DrawingRate rate={10}>
                <Sequence from={E.whur} durationInFrames={E.jazz - E.whur} name="7 WHUR">
                  <DesignSpace><Whur E={E} /></DesignSpace>
                </Sequence>
                <Sequence from={E.jazz} durationInFrames={PROOF_EARWORM_B_DURATION - E.jazz} name="8 JAZZ">
                  <AbsoluteFill style={{ background: "#060606" }} />
                  <DesignSpace><Jazz E={E} cues={idx} /></DesignSpace>
                </Sequence>
              </DrawingRate>
              <Dip at={E.dip} />
            </>
          )}
        </AbsoluteFill>
      </FilmFinish>
    </StyleProvider>
  );
};
