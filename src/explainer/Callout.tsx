import React from "react";
import { paperDesk } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { paperDeskType, typeStyle } from "../tokens/type";
import { useFrames } from "../lib/time";
import { DrawPath, Layer, useProgress } from "./DrawPath";
import { type Pt, wobblyLine } from "./geometry";
import { useDotPopScale } from "./DotPop";

export type CalloutProps = {
  /** centre of the detail being called out */
  cx: number;
  cy: number;
  /** disc radius */
  r?: number;
  /** label box top-left corner */
  label: Pt;
  text: string;
  delay?: number;
  /** the detail (photo crop, cut-out) sitting on the disc */
  children?: React.ReactNode;
};

/**
 * Paper-desk callout (analysis/porsche-part3-stills.md §7): yellow multiply disc behind the detail,
 * thin ink leader line to an italic label in a yellow box (box wipes open L→R, no fade).
 */
export const Callout: React.FC<CalloutProps> = ({ cx, cy, r = 130, label, text, delay = 0, children }) => {
  const fr = useFrames();
  const s = useDotPopScale(delay);
  const wipe = useProgress(delay + fr(10), fr(10), ease("highlightWipe"));
  // measured label: calloutLabel role (cap 47), box ≈100 high (08 PD-4); width estimated from the glyph count
  const sty = typeStyle(paperDeskType.calloutLabel);
  const boxH = 100;
  const boxW = 48 + text.length * (sty.fontSize as number) * 0.52;
  // a label that sits LEFT of the disc is reached at its right end and opens leftward from the line end (porsche@68.8);
  // otherwise the leader meets its left end and the box wipes L→R
  const fromRight = label.x + boxW < cx;
  const end: Pt = { x: fromRight ? label.x + boxW : label.x, y: label.y + boxH / 2 };
  const edge: Pt = { x: cx + (fromRight ? -1 : 1) * r * 0.74, y: cy + (end.y > cy ? 1 : -1) * r * 0.67 };
  const line = wobblyLine(edge, end, "callout", 1, 0.01);
  const clip = fromRight ? `inset(0 0 0 ${(1 - wipe) * 100}%)` : `inset(0 ${(1 - wipe) * 100}% 0 0)`;
  return (
    <>
      {s > 0 && (
        // the transform makes this wrapper its own stacking context, so a multiply on the inner disc would only blend
        // inside it (an opaque disc over the photo); with no detail children the wrapper itself carries the multiply
        <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, transform: `scale(${s})`, transformOrigin: "50% 50%", mixBlendMode: children ? undefined : "multiply" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: paperDesk.highlight, mixBlendMode: children ? "multiply" : undefined }} />
          <div style={{ position: "absolute", inset: 0 }}>{children}</div>
        </div>
      )}
      <Layer>
        <DrawPath paths={[line]} color={paperDesk.charcoal} width={3.5} delay={delay + fr(6)} duration={fr(8)} easing={ease("enter")} seed="callout" />
      </Layer>
      <div style={{ position: "absolute", left: label.x, top: label.y, width: boxW, height: boxH, clipPath: clip }}>
        <div style={{ position: "absolute", inset: 0, background: paperDesk.highlight }} />
        <div style={{ ...sty, position: "absolute", left: 24, top: 0, height: boxH, display: "flex", alignItems: "center", color: paperDesk.inkBrown }}>{text}</div>
      </div>
    </>
  );
};
