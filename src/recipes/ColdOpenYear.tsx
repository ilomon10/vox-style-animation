import React from "react";
import { FlyInGlyphs, LabelStrip, type GlyphFly } from "../earworm";
import { RecipeFrame, SafePhoto, Unfold, ev, type RecipeProps } from "./shared";

export type ColdOpenPiece = { src?: string; x: number; y: number; w: number; h: number; rotate?: number; hinge?: "top" | "bottom" | "left" | "right"; at?: number };
export type ColdOpenYearProps = {
  /** the digits, flown in from the four frame edges (earworm-A §7: converge f16-33) */
  year: string;
  /** place line on a charcoal strip under the digits */
  place?: string;
  /** collage pieces unfolded behind the digits; `at` = anchor (frames after scene start), default staggered 5 f */
  pieces?: ColdOpenPiece[];
};

const FROM = [{ x: -560, y: 0 }, { x: 0, y: -60 }, { x: 0, y: 900 }, { x: 690, y: 300 }];
const STAGE = [{ x: -300, y: 0 }, { x: 60, y: 30 }, { x: 0, y: 330 }, { x: 560, y: 0 }];

/** Recipe "cold-open year" (08-scene-recipes; Earworm A shot 1): a year flies in as separate digits over a collage that unfolds piece by piece. Events: `year` (kind text, digits start). */
export const ColdOpenYear: React.FC<RecipeProps<ColdOpenYearProps>> = ({ ctx, year, place, pieces = [] }) => {
  const t0 = Math.max(0, ev(ctx, "year", 4));
  const chars = Array.from(year);
  const pitch = 118;
  const left = chars.map((_, i) => 960 - (chars.length * pitch) / 2 + i * pitch);
  const fly: GlyphFly[] = chars.map((_, i) => ({ start: t0 + (i % 4) * 2, from: FROM[i % 4], stage: STAGE[i % 4] }));
  return (
    <RecipeFrame seed={ctx.seed}>
      {pieces.map((p, i) => (
        <Unfold key={i} at={p.at ?? 2 + i * 5} hinge={p.hinge ?? (["bottom", "left", "right", "top"] as const)[i % 4]} style={{ left: p.x, top: p.y, width: p.w, height: p.h }}>
          <SafePhoto ctx={ctx} src={p.src} x={0} y={0} width={p.w} height={p.h} rotate={p.rotate} seed={`${ctx.seed}-p${i}`} />
        </Unfold>
      ))}
      <FlyInGlyphs text={year} fly={fly} left={left} top={436} stageAt={t0 + 16} homeAt={t0 + 34} />
      {place && <LabelStrip lines={[place]} x={960 - place.length * 20} y={820} delay={ev(ctx, "place", t0 + 34)} reveal="wipe" seed={`${ctx.seed}-pl`} />}
    </RecipeFrame>
  );
};
