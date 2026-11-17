import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { voxLight } from "../../tokens/colors";
import { ROBOTO, TEXT_SERIF } from "../../tokens/fonts";
import { DesignSpace } from "../../lib/stage";
import { prog } from "../../type/shared";
import { type RecipeProps } from "../shared";
import { SHORT_INK, SHORT_LEMON, SHORT_W, f24 } from "./parts";

export type ShortEndProps = {
  /** OUR series mark as text (never a real logo), e.g. "THE EXPLAINER" */
  title: string;
  /** line under the mark (default "Sources in the description") */
  tagline?: string;
  /** card colour: "lemon" (default, packaging lemon, black ink) or "ink" (the light look's ink, lemon text) */
  ground?: "lemon" | "ink";
};

/**
 * Recipe "short end card" (analysis/vox-shorts.md §7d5): full-frame brand colour. First element 5 f after the cut (spec 3-8), our mark builds in 5 f
 * (a left-to-right wipe), the tagline follows ≈ 1.1 s after the mark, hard on. All on ones. Enter it with a hard cut 3-6 f after the last word; the bed stops dead.
 * Events: none.
 */
export const ShortEnd: React.FC<RecipeProps<ShortEndProps>> = ({ ctx, title, tagline = "Sources in the description", ground = "lemon" }) => {
  const raw = useCurrentFrame(); // on ones: hard cut, 5 f build
  const bg = ground === "lemon" ? SHORT_LEMON : voxLight.ink;
  const fg = ground === "lemon" ? SHORT_INK : SHORT_LEMON;
  const start = f24(5, ctx.fps);
  const p = prog(raw, start, f24(5, ctx.fps), "enter");
  const tagAt = start + Math.round(1.1 * ctx.fps);
  return (
    <AbsoluteFill style={{ background: bg }}>
      <DesignSpace>
        {raw >= start ? (
          <div style={{ position: "absolute", left: 0, top: 880, width: SHORT_W, textAlign: "center", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
            <div style={{ fontFamily: ROBOTO, fontWeight: 900, fontSize: 112, lineHeight: "112px", color: fg, textTransform: "uppercase", letterSpacing: "-0.01em" }}>{title}</div>
            <div style={{ width: 150, height: 14, background: fg, margin: "40px auto 0" }} />
          </div>
        ) : null}
        {raw >= tagAt ? <div style={{ position: "absolute", left: 0, top: 1130, width: SHORT_W, textAlign: "center", fontFamily: TEXT_SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 52, lineHeight: "60px", color: fg }}>{tagline}</div> : null}
      </DesignSpace>
    </AbsoluteFill>
  );
};
