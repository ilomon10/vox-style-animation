import React from "react";
import { useDrawingFrame } from "../../lib/time";
import { Pic, ScrapGround, SpecimenLabel, tween } from "../../scrapbook/kit";
import { tornRectPoints } from "../../earworm/shared";
import { ev, RecipeFrame, type RecipeProps } from "../shared";

export type SpecimenInterviewProps = {
  /** an interview clip (picture only here: its sound comes from the storyboard's audio plan) or a portrait still */
  src: string;
  startFromSec?: number;
  /** label: "fig. a", then the name (bold) and role lines. Real names and roles only (RESEARCH.md) */
  fig?: string;
  name?: string;
  roles?: string[];
  /** the person's paper colour (pink, mint, …) and a faint watermark (a map or an engraving) */
  ground?: string;
  watermark?: string;
  /** "bw" for a black-and-white specimen, "native" for footage in its own colour (default) */
  grade?: "bw" | "native";
  /** the deckle print window (default x 167, y 100, 1165 × 858, as measured) */
  window?: { x: number; y: number; w: number; h: number };
};

/**
 * Recipe "specimen interview" (vox_braintravel M9): the person sits in a white deckle-edged print on their own paper
 * colour, a hairline leader runs from the picture to a specimen label in old-style serif. The label is there from the
 * first frame (as measured); event `label` delays it.
 */
export const SpecimenInterview: React.FC<RecipeProps<SpecimenInterviewProps>> = ({ ctx, src, startFromSec, fig = "fig. a", name, roles = [], ground = "pink", watermark, grade = "native", window }) => {
  const f = useDrawingFrame();
  const w = window ?? { x: 167, y: 100, w: 1165, h: 858 };
  const inset = { x: 28, y: 17 };
  const border = 4, rough = 6;
  const pts = tornRectPoints(w.w, w.h, `${ctx.seed}-deckle`, border, rough, 6);
  const pad = border + rough;
  const atLabel = ev(ctx, "label", 0);
  const o = atLabel <= 0 ? 1 : tween(f, atLabel, 6, "fadeIn");
  const lines = [name, ...roles].filter(Boolean) as string[];
  return (
    <RecipeFrame seed={ctx.seed} ground="none">
      <ScrapGround ctx={ctx} color={ground} watermark={watermark} />
      <div style={{ position: "absolute", left: w.x - pad, top: w.y - pad, width: w.w + 2 * pad, height: w.h + 2 * pad, filter: "drop-shadow(3px 6px 9px rgba(0,0,0,0.25))" }}>
        <svg width={w.w + 2 * pad} height={w.h + 2 * pad} style={{ position: "absolute", left: 0, top: 0 }}>
          <polygon points={pts} fill="#F7F5F0" />
        </svg>
        <div style={{ position: "absolute", left: pad + inset.x, top: pad + inset.y, width: w.w - 2 * inset.x, height: w.h - 2 * inset.y, overflow: "hidden", background: "#222" }}>
          <Pic ctx={ctx} src={src} w={w.w - 2 * inset.x} h={w.h - 2 * inset.y} fit="cover" startFromSec={startFromSec}
            filter={grade === "bw" ? "grayscale(1) contrast(1.08)" : undefined} />
        </div>
      </div>
      {lines.length > 0 && (
        <SpecimenLabel fig={fig} lines={lines} x={w.x + w.w + 73} y={w.y + w.h * 0.38} from={{ x: w.x + w.w * 0.9, y: w.y + w.h * 0.5 }}
          opacity={o} draw={o} width={1920 - (w.x + w.w + 73) - 60} />
      )}
    </RecipeFrame>
  );
};
