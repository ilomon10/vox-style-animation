import React from "react";
import { GiantWord } from "../earworm";
import { RecipeFrame, SafePhoto, ev, evUntil, type RecipeProps } from "./shared";

export type GiantWordCardProps = {
  text: string;
  ground?: "white" | "black";
  /** optional torn photo sitting inside the word (hides 1-2 letters) */
  photo?: string;
  /** where the photo sits (design px, default: centred 400x440 over the word); move it aside for long or short words */
  photoBox?: { x?: number; y?: number; w?: number; h?: number; rotate?: number };
  converge?: number;
};

/** Recipe "giant word card" (Earworm C): one condensed word at ~18 % of the frame height, letters converging from the sides over 19 f on the cut. Events: `converge` (start, default 0), `exit` (the pre-cut contraction). */
export const GiantWordCard: React.FC<RecipeProps<GiantWordCardProps>> = ({ ctx, text, ground = "white", photo, photoBox, converge = 19 }) => (
  <RecipeFrame seed={ctx.seed} variant={ground === "white" ? "whitePaper" : "black"}>
    <GiantWord text={text} ground={ground} delay={ev(ctx, "converge", 0)} convergeFrames={converge} exitAt={evUntil(ctx, "exit", ctx.events.exit?.at)} seed={`${ctx.seed}-g`}>
      {photo && <SafePhoto ctx={ctx} src={photo} x={photoBox?.x ?? 760} y={photoBox?.y ?? 320} width={photoBox?.w ?? 400} height={photoBox?.h ?? 440} rotate={photoBox?.rotate ?? -2} seed={`${ctx.seed}-gp`} delay={ev(ctx, "photo", 8)} />}
    </GiantWord>
  </RecipeFrame>
);
