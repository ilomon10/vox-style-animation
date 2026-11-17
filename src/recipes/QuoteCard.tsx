import React from "react";
import { TypewriterSlide } from "../earworm";
import { useDrawingFrame } from "../lib/time";
import { earwormType, typeStyle } from "../tokens/type";
import { capTrim } from "../type/shared";
import { RecipeFrame, ev, type RecipeProps } from "./shared";

export type QuoteCardProps = { quote: string; attribution?: string; /** wrap width in characters */ wrap?: number };

const lines = (s: string, n: number) => {
  const out: string[] = [];
  let cur = "";
  for (const w of s.split(/\s+/)) {
    if (cur && (cur + " " + w).length > n) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) out.push(cur);
  return out;
};

/** Recipe "quote card" (Earworm B title typewriter): the quote types in per-letter slide-in caps, the LAST letter landing on event `done` (kind text; default +40 f), then the serif attribution line at `credit` (kind title, done +6). */
export const QuoteCard: React.FC<RecipeProps<QuoteCardProps>> = ({ ctx, quote, attribution, wrap = 26 }) => {
  const f = useDrawingFrame();
  const ls = lines(quote.toUpperCase(), wrap);
  const total = ls.reduce((a, l) => a + l.length, 0);
  const start = ev(ctx, "type", 4);
  const done = ev(ctx, "done", start + total * 2);
  const step = Math.max(0.5, (done - start) / Math.max(1, total - 1));
  const cap = 96;
  const role = { ...earwormType.keyword, cap, color: "#E6E6E6", weight: 600 };
  let at = start;
  const top = 540 - ((ls.length - 1) * cap * 1.5) / 2;
  const credit = ev(ctx, "credit", done + 6);
  return (
    <RecipeFrame seed={ctx.seed}>
      {ls.map((l, i) => {
        const d = at;
        at += l.length * step;
        return <TypewriterSlide key={i} text={l} delay={d} framesPerLetter={step} x={960 - (l.length * cap * 0.5) / 2} y={top + i * cap * 1.5} role={role} />;
      })}
      {attribution && f >= credit && (
        <div style={{ position: "absolute", left: 0, width: 1920, textAlign: "center", top: top + ls.length * cap * 1.5 + 40, ...capTrim, ...typeStyle({ ...earwormType.serifLine, cap: 46 }) }}>{attribution}</div>
      )}
    </RecipeFrame>
  );
};
