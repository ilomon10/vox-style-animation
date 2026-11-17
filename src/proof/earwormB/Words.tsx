import React from "react";
import { KineticWord } from "../../earworm";
import { Layer, RevealPath } from "../../explainer/DrawPath";
import { wobblyLine } from "../../explainer/geometry";
import { useDrawingFrame } from "../../lib/time";
import { earwormType } from "../../tokens/type";
import type { Events } from "./events";
import { CircleSlide } from "./Clinton";

/** 4d (f1135–1223): one blue word at a time; hard pops on the stressed syllable, white-letter flicker swaps. Sequence starts at E.post. */
export const Words: React.FC<{ E: Events }> = ({ E }) => {
  const f = useDrawingFrame();
  const o = E.post;
  const role = { ...earwormType.keyword, cap: 74, weight: 600, tracking: 0.04 };
  const L = (t: number) => t - o;
  const ul = Math.min(1, Math.max(0, (f - L(E.underline)) / 3));
  return (
    <>
      <CircleSlide />
      {/* POST - INDUSTRIAL: clean pops, then the whole phrase flickers white for 4 f before BLACK replaces it */}
      <KineticWord text="POST" delay={0} until={L(E.black) - 4} x={705} y={548} role={role} seed="post" />
      <KineticWord text="-" delay={L(E.dash)} until={L(E.black) - 4} x={846} y={548} role={role} seed="dash" />
      <KineticWord text="INDUSTRIAL" delay={L(E.industrial)} until={L(E.black) - 4} x={1126} y={548} role={role} seed="ind" />
      <KineticWord text="POST" delay={L(E.black) - 4} until={L(E.black)} glitch="white" glitchFrames={4} x={705} y={548} role={role} seed="post2" />
      <KineticWord text="-" delay={L(E.black) - 4} until={L(E.black)} glitch="white" glitchFrames={4} x={846} y={548} role={role} seed="dash2" />
      <KineticWord text="INDUSTRIAL" delay={L(E.black) - 4} until={L(E.black)} glitch="white" glitchFrames={4} x={1126} y={548} role={role} seed="ind2" />
      <KineticWord text="BLACK" delay={L(E.black)} until={L(E.urban)} glitch="white" glitchFrames={4} x={952} y={546} role={role} seed="blk" />
      <KineticWord text="URBAN" delay={L(E.urban)} until={L(E.experiences)} glitch="white" glitchFrames={4} x={952} y={546} role={role} seed="urb" />
      <KineticWord text="EXPERIENCES" delay={L(E.experiences)} glitch="white" glitchFrames={4} x={954} y={549} role={role} seed="exp" />
      <Layer>
        <RevealPath points={wobblyLine({ x: 690, y: 598 }, { x: 1215, y: 598 }, "ulx", 2, 0.003)} p={ul} color="#EDEDED" width={4} />
      </Layer>
    </>
  );
};
