import React from "react";
import { KineticWord } from "../earworm";
import { RecipeFrame, SafeCutout, SafePhoto, ev, evUntil, type RecipeProps } from "./shared";

export type KeywordCutProps = {
  /** photo (torn B/W print) or, with `cutout`, an alpha PNG cut-out */
  src?: string;
  cutout?: boolean;
  /** the kinetic word (periwinkle caps) */
  word: string;
  side?: "left" | "right";
  grade?: "bw" | "color" | "none";
  /** small second word line under the keyword */
  sub?: string;
};

/** Recipe "keyword cut" (doc 11 §2): cut to the thing being named; the photo slams in on the cut, the keyword pops on its stressed syllable. Events: `pop` (kind pop, default +1 f), `exit` (word removed). */
export const KeywordCut: React.FC<RecipeProps<KeywordCutProps>> = ({ ctx, src, cutout, word, side = "left", grade = "bw", sub }) => {
  const left = side === "left";
  const wordX = left ? 1380 : 540;
  const photoX = left ? 120 : 900;
  return (
    <RecipeFrame seed={ctx.seed}>
      {cutout ? (
        <SafeCutout ctx={ctx} src={src} x={photoX} y={60} w={900} h={960} />
      ) : (
        <SafePhoto ctx={ctx} src={src} x={photoX} y={150} width={880} height={780} rotate={left ? -1.5 : 1.5} grade={grade} slam seed={`${ctx.seed}-ph`} />
      )}
      <KineticWord text={word} delay={ev(ctx, "pop", 1)} until={evUntil(ctx, "pop")} x={wordX} y={sub ? 500 : 540} glitch="white" seed={`${ctx.seed}-w`} />
      {sub && <KineticWord text={sub} delay={ev(ctx, "sub", ev(ctx, "pop", 1) + 8)} x={wordX} y={650} role={{ font: "CONDENSED", cap: 48, weight: 600, color: "#BEBDBE", leading: 1, uppercase: true }} seed={`${ctx.seed}-s`} />}
    </RecipeFrame>
  );
};
