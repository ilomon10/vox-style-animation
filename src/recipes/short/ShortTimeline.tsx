import React from "react";
import { useDrawingFrame } from "../../lib/time";
import { voxLight } from "../../tokens/colors";
import { prog } from "../../type/shared";
import { ev, type RecipeProps } from "../shared";
import { SHORT_H, popScale, shortType, ShortFrame } from "./parts";

export type ShortTimelineProps = {
  /** one entry per beat; each pops on its `at` (events `item0`..`item7`; anchor the date's spoken word, kind `text`) */
  items: { date: string; text: string; at?: number }[];
  /** vertical position of the newest item, 0..1 of H (default 0.40) */
  rest?: number;
};

const PITCH = 400; // content px between items
const RULE_X = 150;
const TEXT_X = 230;
const SCROLL_F = 13; // "settle" move of the camera to the new item
const RULE_F = 10;
const DATE_CAP = 84;
const HL_F = 10; // highlight sweep (§7a: ≈ 10 f)

/**
 * Recipe "short timeline": a vertical rule on the paper draws down; each item pops on its spoken word (date Roboto 900, text Source Serif 4 600),
 * the camera scrolls so the newest item sits ≈ 40 % down, and the newest (active) date wears the look's lemon highlighter, which sweeps on.
 * Events: item0..item7 (default 12 + 30 i f from the cut).
 */
export const ShortTimeline: React.FC<RecipeProps<ShortTimelineProps>> = ({ ctx, items, rest = 0.4 }) => {
  const g = useDrawingFrame();
  const ats = items.map((it, i) => it.at ?? ev(ctx, `item${i}`, 12 + i * 30));
  const active = ats.reduce((a, t, i) => (g >= t ? i : a), -1);
  const restY = SHORT_H * rest;
  // scroll: previous item's resting offset -> new one, 13 f settle
  const scrollTo = (i: number) => restY - Math.max(0, i) * PITCH;
  const prev = Math.max(0, active - 1);
  const sp = active >= 1 ? prog(g, ats[active], SCROLL_F, "settle") : 1;
  const scroll = active < 0 ? scrollTo(0) : scrollTo(prev) + (scrollTo(Math.max(0, active)) - scrollTo(prev)) * sp;
  // rule runs from the first dot to the newest dot (+ a stub below), growing 10 f at each item
  const ruleEnd = active < 0 ? 0 : Math.max(0, active - 1) * PITCH + (active >= 1 ? prog(g, ats[active], RULE_F, "enter") * PITCH : 0) + 90;
  return (
    <ShortFrame seed={ctx.seed}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: SHORT_H, transform: `translateY(${scroll}px)` }}>
        <div style={{ position: "absolute", left: RULE_X - 3, top: 0, width: 6, height: ruleEnd, background: voxLight.ink }} />
        {items.map((it, i) => {
          if (g < ats[i]) return null;
          const t = g - ats[i];
          const s = popScale(t, ctx.fps);
          const isActive = i === active;
          const hl = isActive ? prog(g, ats[i], HL_F, "enter") : i < active ? 1 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: i * PITCH, width: 1080 }}>
              <div style={{ position: "absolute", left: RULE_X - 20, top: -20, width: 40, height: 40, borderRadius: 20, background: voxLight.ink, transform: `scale(${s})` }} />
              <div style={{ position: "absolute", left: TEXT_X, top: -DATE_CAP / 2 - 30, transform: `scale(${s})`, transformOrigin: "0 50%" }}>
                <div style={{ position: "relative", display: "inline-block", padding: "26px 22px", margin: "-26px -22px" }}>
                  {/* the active date: lemon highlighter under the ink; older dates keep a faint band so the path reads */}
                  <div style={{ position: "absolute", inset: 0, background: voxLight.highlighter, mixBlendMode: "multiply", opacity: isActive ? 1 : 0.35, clipPath: `inset(0 ${(1 - hl) * 100}% 0 0)` }} />
                  <div style={{ position: "relative", ...shortType.heavy, fontSize: 118, lineHeight: "118px", whiteSpace: "nowrap" }}>{it.date}</div>
                </div>
              </div>
              {t >= 3 ? (
                <div style={{ position: "absolute", left: TEXT_X, top: 70, width: 1080 - TEXT_X - 70, ...shortType.body, fontSize: 64, lineHeight: 1.2, textWrap: "balance" }}>{it.text}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </ShortFrame>
  );
};
