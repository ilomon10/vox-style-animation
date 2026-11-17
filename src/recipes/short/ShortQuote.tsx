import React from "react";
import { Img, staticFile } from "remotion";
import { useDrawingFrame } from "../../lib/time";
import { voxLight } from "../../tokens/colors";
import { ROBOTO, TEXT_SERIF } from "../../tokens/fonts";
import { SHADOWS } from "../../tokens/finish";
import { prog } from "../../type/shared";
import { Placeholder, ev, isMissing, warnOnce, type RecipeProps } from "../shared";
import { shortType, ShortFrame } from "./parts";

export type ShortQuoteProps = {
  /** the quote, one entry per set line (break lines by hand so the sweep follows the lines); each line's lemon sweep starts on its `at` (events `line0`..`line7`, kind `highlight`) */
  lines: { text: string; at?: number }[];
  attribution: { name: string; role?: string };
  /** small print of the speaker (project asset), top left, flat with a paper border */
  photo?: string;
};

const SWEEP_F = 10;
const X0 = 96;
const SIZE = 70;
const PITCH = 100;

/**
 * Recipe "short quote": OUR quote card on the paper (never a recreation of a document or letter). Source Serif 4 600 set flush left with
 * typographic quote marks; a lemon highlighter sweeps each line in turn on its spoken words and stays; the attribution (name Roboto 900, role italic
 * serif) is on from the last line's start, hard on. Optional small print of the speaker. Events: line0..line7 (default 12 + 30 i f).
 */
export const ShortQuote: React.FC<RecipeProps<ShortQuoteProps>> = ({ ctx, lines, attribution, photo }) => {
  const g = useDrawingFrame();
  const n = lines.length;
  const top = photo ? 760 : 560;
  const ats = lines.map((l, i) => l.at ?? ev(ctx, `line${i}`, 12 + i * 30));
  const missing = photo ? isMissing(ctx, photo) : false;
  if (missing) warnOnce(`asset missing: ${photo}: placeholder drawn`);
  return (
    <ShortFrame seed={ctx.seed}>
      {photo ? (
        <div style={{ position: "absolute", left: X0, top: 250, width: 300, height: 380, padding: 12, boxSizing: "border-box", background: voxLight.page, transform: "rotate(-2deg)", filter: SHADOWS.printContact }}>
          {missing ? <Placeholder label={photo} w={276} h={356} /> : <Img src={staticFile(photo)} style={{ width: 276, height: 356, objectFit: "cover" }} />}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: X0 - 6, top: top - 150, fontFamily: TEXT_SERIF, fontWeight: 700, fontSize: 260, lineHeight: "260px", color: voxLight.ink }}>{"“"}</div>
      {lines.map((l, i) => {
        const p = g >= ats[i] ? prog(g, ats[i], SWEEP_F, "enter") : 0;
        const last = i === n - 1;
        return (
          <div key={i} style={{ position: "absolute", left: X0, top: top + i * PITCH, whiteSpace: "pre" }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ position: "absolute", left: -8, right: -8, top: 14, bottom: 8, background: voxLight.highlighter, mixBlendMode: "multiply", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }} />
              <span style={{ position: "relative", ...shortType.body, fontSize: SIZE, lineHeight: `${PITCH}px` }}>{l.text}{last ? "”" : ""}</span>
            </span>
          </div>
        );
      })}
      {n && g >= ats[n - 1] ? (
        <div style={{ position: "absolute", left: X0, top: top + n * PITCH + 50 }}>
          <div style={{ fontFamily: ROBOTO, fontWeight: 900, fontSize: 54, lineHeight: "62px", color: voxLight.ink }}>{attribution.name}</div>
          {attribution.role ? <div style={{ fontFamily: TEXT_SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 45, lineHeight: "62px", color: voxLight.ink }}>{attribution.role}</div> : null}
        </div>
      ) : null}
    </ShortFrame>
  );
};
