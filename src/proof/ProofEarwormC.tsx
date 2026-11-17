import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { useCues } from "../audio";
import { FilmFinish } from "../effects";
import { Drop } from "../earworm/fx";
import { DrawingRate } from "../lib/time";
import { StyleProvider } from "../tokens/theme";
import { CraneShot } from "./earwormC/Crane";
import { mkEvents } from "./earwormC/events";
import { MelvinCollage, Newspaper } from "./earwormC/Melvin";
import { NewsShows, Poetry, Speeches } from "./earwormC/Titles";
import { Vaughan } from "./earwormC/Vaughan";

/**
 * PRIVATE sync proof: rebuilds Earworm segment C (global f1740–2782 @25) shot for shot ON ITS OWN SOUNDTRACK (public/_private/earworm_C.wav:
 * copyrighted, study-only, never publish). All frames local (0 = f1740). Events: src/proof/earwormC/events.ts. Report: analysis/compare/proof-earworm-C.md
 */
export const PROOF_EARWORM_C_DURATION = 1043;

export const ProofEarwormC: React.FC = () => {
  const idx = useCues("_private/earworm_C");
  const E = React.useMemo(() => (idx.words.length ? mkEvents(idx) : null), [idx]);
  return (
    <StyleProvider style="voxEarworm">
      <FilmFinish overrides={{ grain: { sigma: 1.5, sizePx: 1.5, rate: 12, afterSplit: true } }}>
        <AbsoluteFill style={{ background: "#0A0A0A" }}>
          <Audio src={staticFile("_private/earworm_C.wav")} />
          {E && (
            <>
              <DrawingRate rate={10}>
                <Sequence from={0} durationInFrames={E.cutPoetry} name="S9 SPEECHES"><Speeches contractAt={E.contractSpeeches} /></Sequence>
                <Sequence from={E.cutPoetry} durationInFrames={E.cutNews - E.cutPoetry} name="S10 POETRY"><Poetry contractAt={E.contractPoetry - E.cutPoetry} pop={E.poetPop - E.cutPoetry} /></Sequence>
              </DrawingRate>
              {/* S11 NEWS SHOWS → 27 f fade, 13 f black, 17 f fade-up (the "drop") → S16 crane, one Sequence so the Drop owns the black */}
              <Sequence from={E.cutNews} durationInFrames={E.dissolve + 8 - E.cutNews} name="S11 NEWS + drop + S16 crane">
                <Drop
                  at={E.fadeStart - E.cutNews}
                  sfx={false}
                  outgoing={<DrawingRate rate={10}><NewsShows /></DrawingRate>}
                  incoming={<DrawingRate rate={12}><CraneShot E={E} /></DrawingRate>}
                />
              </Sequence>
              <DrawingRate rate={12}>
                <Sequence from={E.dissolve} durationInFrames={E.cutMelvin - E.dissolve} name="S19 newspaper"><Newspaper E={E} /></Sequence>
              </DrawingRate>
              <DrawingRate rate={10}>
                <Sequence from={E.cutMelvin} durationInFrames={E.cutVaughan - E.cutMelvin} name="S20 Melvin collage"><MelvinCollage E={E} /></Sequence>
              </DrawingRate>
              <DrawingRate rate={12}>
                <Sequence from={E.cutVaughan} durationInFrames={E.end - E.cutVaughan} name="S21 Vaughan"><Vaughan E={E} cues={idx} /></Sequence>
              </DrawingRate>
            </>
          )}
        </AbsoluteFill>
      </FilmFinish>
    </StyleProvider>
  );
};
