import React from "react";
import { type RecipeProps } from "../shared";
import { Bleed, HOOK_SLOT_Y, HOOK_W, LemonBox, shortType, ShortFrame } from "./parts";

export type ShortHookProps = {
  /** the title, or the title as a yes/no question the Short answers (≤ 8 words); wraps to 2-3 lines, "\n" forces a break */
  text: string;
  /** "lower" (default, box centre y 1420) or "upper" (y 1110) when the lower slot covers the subject */
  slot?: "lower" | "upper";
  /** photo behind the box (project asset): full-bleed, cropped on `focus` (0..1 of the picture), slow ≈ 6 % pull-out. No photo: the paper ground */
  src?: string;
  focus?: { x: number; y: number };
  /** box width, design px (default 864) */
  w?: number;
};

/**
 * Recipe "short hook" (analysis/vox-shorts.md §7b): flat lemon box, Roboto 900 ALL CAPS 60 px (cap 42), 36 px above the first cap and under the
 * last baseline, centred on x 540. FULLY ON from frame 0 (no entrance: it is the first frame autoplay shows), hard off with the scene.
 * Also the question card. No name label may run while it is up. Events: none.
 */
export const ShortHook: React.FC<RecipeProps<ShortHookProps>> = ({ ctx, text, slot = "lower", src, focus, w = HOOK_W }) => (
  <ShortFrame seed={ctx.seed}>
    {src ? <Bleed ctx={ctx} src={src} focus={focus} move="pullOut" /> : null}
    <LemonBox cy={HOOK_SLOT_Y[slot]} w={w} padY={36}>
      <div style={{ ...shortType.hook, textWrap: "balance", whiteSpace: "pre-line" }}>{text}</div>
    </LemonBox>
  </ShortFrame>
);
