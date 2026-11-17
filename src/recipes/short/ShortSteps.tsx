import React from "react";
import { useDrawingFrame } from "../../lib/time";
import { voxLight } from "../../tokens/colors";
import { prog } from "../../type/shared";
import { ev, type RecipeProps } from "../shared";
import { SHORT_LEMON, popScale, shortType, ShortFrame } from "./parts";

export type ShortStepsProps = {
  /** numbered steps; the big number pops on `at` (events `step0`..`step5`, kind `text`), the text follows 3 f later */
  steps: { num?: string; text: string; at?: number }[];
  /** heading above the steps, Roboto 900 caps */
  title?: string;
};

const BOX = 190;
const TEXT_LAG = 3;
const CONNECT_F = 8;

/**
 * Recipe "short steps": numbered steps on the paper for sequences ("2 candidates → MPR vote → Dec 2"). Big numbers sit in flat lemon squares
 * and pop in order (caption-box pop envelope), the text beside them follows 3 f later, a thin rule draws down to the next number.
 * Events: step0..step5 (default 12 + 24 i f from the cut).
 */
export const ShortSteps: React.FC<RecipeProps<ShortStepsProps>> = ({ ctx, steps, title }) => {
  const g = useDrawingFrame();
  const n = steps.length;
  const pitch = Math.min(340, 1080 / Math.max(1, n));
  const top = title ? 470 : 380;
  const y0 = title ? top : 960 - ((n - 1) * pitch + BOX) / 2;
  return (
    <ShortFrame seed={ctx.seed}>
      {title ? <div style={{ position: "absolute", left: 90, right: 90, top: 300, ...shortType.heavy, fontSize: 64, lineHeight: "70px", textTransform: "uppercase" }}>{title}</div> : null}
      {steps.map((st, i) => {
        const at = st.at ?? ev(ctx, `step${i}`, 12 + i * 24);
        if (g < at) return null;
        const y = y0 + i * pitch;
        const next = steps[i + 1] ? steps[i + 1].at ?? ev(ctx, `step${i + 1}`, 12 + (i + 1) * 24) : null;
        const cp = next !== null && g >= at ? prog(g, at + 4, CONNECT_F, "enter") : 0;
        return (
          <React.Fragment key={i}>
            {i + 1 < n ? <div style={{ position: "absolute", left: 90 + BOX / 2 - 3, top: y + BOX, width: 6, height: (pitch - BOX) * cp, background: voxLight.ink }} /> : null}
            <div style={{ position: "absolute", left: 90, top: y, width: BOX, height: BOX, background: SHORT_LEMON, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${popScale(g - at, ctx.fps)})` }}>
              <span style={{ ...shortType.heavy, color: "#000", fontSize: 150, lineHeight: "150px", fontVariantNumeric: "lining-nums" }}>{st.num ?? i + 1}</span>
            </div>
            {g >= at + TEXT_LAG ? <div style={{ position: "absolute", left: 90 + BOX + 50, right: 70, top: y, height: BOX, display: "flex", alignItems: "center", ...shortType.body, fontSize: 68, lineHeight: 1.15, textWrap: "balance" }}>{st.text}</div> : null}
          </React.Fragment>
        );
      })}
    </ShortFrame>
  );
};
