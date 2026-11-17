import React from "react";
import { useDrawingFrame } from "../../lib/time";
import { voxScrapbook as C } from "../../tokens/colors";
import { voxScrapbookType as T } from "../../tokens/type";
import { lerp, Pic, ScrapGround, SourceLine, tween, Txt } from "../../scrapbook/kit";
import { ev, RecipeFrame, type RecipeProps } from "../shared";

type Side = { fig?: string; title: string; src?: string; callouts?: string[]; blend?: "multiply" | "normal" };

export type SpecimenCompareProps = {
  left: Side;
  right: Side;
  /** paper colour (default pink) */
  ground?: string;
  /** a line or two under both halves */
  legend?: string[];
  /** "split": the left half first, the right on its word. "pullback": start close on the left and pull back to reveal
   *  the split (×1.6 → 1 in 10 f, as measured) */
  reveal?: "split" | "pullback";
  source?: string;
};

const Half: React.FC<{ ctx: RecipeProps<object>["ctx"]; side: Side; x: number; at: number; f: number; atCall: number }> = ({ ctx, side, x, at, f, atCall }) => {
  const t = tween(f, at, 8, "pop");
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 800, height: 1080, opacity: f < at ? 0 : 1 }}>
      <div style={{ position: "absolute", left: 0, top: 84 }}>
        {side.fig && <Txt role={T.fig}>{side.fig}</Txt>}
        <Txt role={T.labelName} style={{ marginTop: 10 }}>{side.title}</Txt>
      </div>
      <div style={{ position: "absolute", left: 40, top: 250, transform: `scale(${lerp(0.82, 1, t)})`, transformOrigin: "50% 60%", mixBlendMode: side.blend ?? "multiply" }}>
        <Pic ctx={ctx} src={side.src} w={720} h={500} />
      </div>
      {(side.callouts ?? []).map((c, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 800 + i * 52, opacity: tween(f, atCall + i * 4, 6, "fadeIn") }}>
          <Txt role={T.labelRole}>{c}</Txt>
        </div>
      ))}
    </div>
  );
};

/**
 * Recipe "specimen comparison" (vox_braintravel M12): two specimens on one sheet, split by a dashed rule at x 960, each
 * with "fig." + a title above and callouts below; a legend at the bottom. Events: `left`, `right` (the split), `callouts`.
 */
export const SpecimenCompare: React.FC<RecipeProps<SpecimenCompareProps>> = ({ ctx, left, right, ground = "pink", legend, reveal = "split", source }) => {
  const f = useDrawingFrame();
  const atLeft = ev(ctx, "left", 2);
  const atRight = ev(ctx, "right", atLeft + 22);
  const atCall = ev(ctx, "callouts", atRight + 8);
  const pb = reveal === "pullback" ? tween(f, atRight, 10, "enter") : 1;
  const rule = tween(f, atRight, 6, "linear");
  return (
    <RecipeFrame seed={ctx.seed} ground="none">
      {/* the paper rides inside the (scaled) container: the engravings multiply onto it, which a transform would isolate */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1.6, 1, pb)})`, transformOrigin: `${lerp(26, 50, pb)}% 50%` }}>
        <ScrapGround ctx={ctx} color={ground} />
        <Half ctx={ctx} side={left} x={110} at={atLeft} f={f} atCall={atCall} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <line x1={960} y1={90} x2={960} y2={90 + (legend ? 810 : 900) * rule} stroke={C.labelInk} strokeWidth={3} strokeDasharray="14 12" opacity={f >= atRight ? 0.85 : 0} />
        </svg>
        <Half ctx={ctx} side={right} x={1040} at={atRight} f={f} atCall={atCall + 2} />
      </div>
      {legend && (
        <div style={{ position: "absolute", left: 0, top: 952, width: 1920, textAlign: "center", opacity: tween(f, atCall + 6, 6, "fadeIn") }}>
          {legend.map((l, i) => <Txt key={i} role={{ ...T.labelRole, cap: 26 }}>{l}</Txt>)}
        </div>
      )}
      <SourceLine text={source} />
    </RecipeFrame>
  );
};
