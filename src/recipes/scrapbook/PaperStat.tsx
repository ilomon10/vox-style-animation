import React from "react";
import { useDrawingFrame } from "../../lib/time";
import { voxScrapbook as C } from "../../tokens/colors";
import { voxScrapbookType as T, type TypeRole } from "../../tokens/type";
import { enter, Pic, Scrap, ScrapGround, SourceLine, textWidth, Txt, useFontsReady } from "../../scrapbook/kit";
import { ev, RecipeFrame, type RecipeProps } from "../shared";

/** the unit line under the number */
const UNIT: TypeRole = { ...T.labelName, cap: 46 };

export type PaperStatProps = {
  /** the number, as it should read: "25,000" */
  value: string;
  /** under the number: "streets" */
  unit?: string;
  /** a context line on a grey strip: "within six miles of Charing Cross" */
  context?: string;
  /** the payoff on a kraft tile, in condensed caps: "BY HEART" */
  payoff?: string;
  /** a full-frame picture in a white paper mat (a map, a photo), or a ground colour */
  image?: string;
  ground?: string;
  source?: string;
};

/**
 * Recipe "torn-paper stat" (vox_braintravel M17): three paper scraps slide in over a picture or a coloured ground,
 * staggered about 4 f over 18 f — the number on a calendar scrap, the context on a grey strip, the payoff on kraft.
 * Events: `value`, `context`, `payoff` (the payoff may lead its word, as measured).
 */
export const PaperStat: React.FC<RecipeProps<PaperStatProps>> = ({ ctx, value, unit, context, payoff, image, ground = "sky", source }) => {
  const f = useDrawingFrame();
  const atValue = ev(ctx, "value", 2);
  const atContext = ev(ctx, "context", atValue + 4);
  const atPayoff = ev(ctx, "payoff", atValue + 10);
  const a = enter(f, atValue, 8, { dx: -900, rot: -10 });
  const b = enter(f, atContext, 8, { dy: 420, rot: 8 });
  const c = enter(f, atPayoff, 8, { dx: 1000, rot: 12 });
  // every scrap fits its text, measured in its font; the payoff tile overlaps the number scrap's right edge only
  const ready = useFontsReady(T.statNumber, UNIT, T.statPayoff, T.statContext);
  const valueW = Math.max(520, Math.round(Math.max(textWidth(T.statNumber, value, ready, 0.6), textWidth(UNIT, unit ?? "", ready))) + 150);
  // payoff and context stay on one line, shrunk to stay inside the frame
  const payoffText = textWidth(T.statPayoff, payoff ?? "", ready, 0.5);
  const payoffScale = Math.min(1, 740 / Math.max(1, payoffText));
  const payoffW = Math.round(payoffText * payoffScale) + 140;
  const contextText = textWidth(T.statContext, context ?? "", ready, 0.47);
  const contextScale = Math.min(1, 1300 / Math.max(1, contextText));
  const contextW = Math.round(contextText * contextScale) + 110;
  return (
    <RecipeFrame seed={ctx.seed} ground="none">
      <ScrapGround ctx={ctx} color={image ? "white" : ground} />
      {image && (
        <div style={{ position: "absolute", left: 48, top: 42, width: 1824, height: 996, overflow: "hidden" }}>
          <Pic ctx={ctx} src={image} w={1824} h={996} fit="cover" />
        </div>
      )}
      <div style={{ position: "absolute", left: 170, top: 270, ...a.style }}>
        <Scrap w={valueW} h={unit ? 330 : 250} color={C.calendar} seed={`${ctx.seed}-v`}>
          <div style={{ position: "absolute", left: 60, top: 56 }}>
            <Txt role={T.statNumber} trim>{value}</Txt>
            {unit && <Txt role={UNIT} style={{ marginTop: 40 }}>{unit}</Txt>}
          </div>
        </Scrap>
      </div>
      {context && (
        <div style={{ position: "absolute", left: 220, top: unit ? 640 : 560, ...b.style }}>
          <Scrap w={contextW} h={104} color={C.greyStrip} seed={`${ctx.seed}-c`} rough={8}>
            <div style={{ position: "absolute", left: 48, top: 34 }}><Txt role={{ ...T.statContext, cap: T.statContext.cap * contextScale }} style={{ whiteSpace: "pre" }}>{context}</Txt></div>
          </Scrap>
        </div>
      )}
      {payoff && (
        <div style={{ position: "absolute", left: Math.min(1920 - payoffW - 60, 170 + valueW - 40), top: 430, ...c.style }}>
          <Scrap w={payoffW} h={200} color={C.kraft} seed={`${ctx.seed}-p`} rough={10}>
            <div style={{ position: "absolute", left: 60, top: 42 + (1 - payoffScale) * 50, transform: "skewX(-8deg)" }}>
              <Txt role={{ ...T.statPayoff, cap: T.statPayoff.cap * payoffScale }} style={{ whiteSpace: "pre" }} trim>{payoff}</Txt>
            </div>
          </Scrap>
        </div>
      )}
      <SourceLine text={source} light={!!image} />
    </RecipeFrame>
  );
};
