import React from "react";
import { Img, staticFile } from "remotion";
import { useDrawingFrame } from "../../lib/time";
import { voxLight } from "../../tokens/colors";
import { SHADOWS } from "../../tokens/finish";
import { SourceLine } from "../../type/SourceLine";
import { prog } from "../../type/shared";
import { Placeholder, ev, isMissing, warnOnce, type RecipeProps } from "../shared";
import { ROBOTO } from "../../tokens/fonts";
import { SHORT_W, shortType, ShortFrame } from "./parts";

type Rect = { x: number; y: number; w: number; h: number };

export type ShortDocumentProps = {
  /** PNG of the document page (project asset or `kit:` file) */
  src?: string;
  /** pixel size of that PNG: the page-pixel coordinates below are converted with it */
  size: { w: number; h: number };
  /** the page's width on screen, design px (default 1180: wider than the frame, the page overflows like §7c6); `x` = its left edge (default centred), `y` = its top (default 150) */
  pageW?: number;
  x?: number;
  y?: number;
  /** lemon multiply sweeps, in PAGE pixels (x, y = top-left), ≈ 10 f left → right from `at` (events `hl0`.., kind `highlight`) */
  highlights?: (Rect & { at?: number })[];
  /** the page blurs and this strip (PAGE pixels) lifts edge to edge with a soft shadow (§7c6), 13 f from `at` (event `isolate`). `zoom` (default 1): the strip is scaled so its width fills the frame ×zoom; wider zoom crops the ends */
  isolate?: Rect & { at?: number; zoom?: number };
  /** OUR English translation of the isolated sentence, on a clean paper strip under the lifted strip, labelled as a translation. Hard on at `at` (event `translation`, default 10 f after the isolate) */
  translation?: { text: string; label?: string; at?: number };
  /** reframe about the point (cx, cy in PAGE pixels): scale to `to` over 13 f from `at` (event `push`, default 0) */
  push?: { to: number; cx: number; cy: number; at?: number };
  /** source credit (SourceLine), bottom-left just above the caption block (baseline `sourceY`, default 1585) */
  source?: string;
  /** baseline of the source line in design px (default 1585: inside the safe area, clear of the bottom captions) */
  sourceY?: number;
};

const SWEEP_F = 10;
const ISOLATE_F = 13;
const ISOLATE_BLUR = 12;
const STRIP_CY = 830; // creatine strip-lift still: strip centre at 0.43 H
const BAND_PAD = 6; // page px the band grows beyond the ink above / below, so it reads like the marker

/**
 * Recipe "short document" (analysis/vox-shorts.md §7c6): a portrait document page, large (may overflow the width), with lemon highlight sweeps,
 * the strip lift (page blurs, the sentence strip rises edge to edge) and OUR translation under it, a reframe push and a source line.
 * The translation is set in the look's own type on plain paper with a "Translation" tag: it never looks like part of the document.
 * Events: hl0, hl1, hl2, isolate, translation, push.
 */
export const ShortDocument: React.FC<RecipeProps<ShortDocumentProps>> = ({ ctx, src, size, pageW = 1180, x, y = 150, highlights = [], isolate, translation, push, source, sourceY = 1585 }) => {
  const g = useDrawingFrame();
  const k = pageW / size.w; // page px -> design px
  const left = x ?? (SHORT_W - pageW) / 2;
  const pageH = size.h * k;
  const missing = isMissing(ctx, src);
  if (missing) warnOnce(`asset missing: ${src ?? "(no src)"}: placeholder drawn`);

  const pushT = push ? prog(g, push.at ?? ev(ctx, "push", 0), 13, "settle") : 0;
  const pz = push ? 1 + (push.to - 1) * pushT : 1;
  const layer: React.CSSProperties = push ? { transform: `scale(${pz})`, transformOrigin: `${left + push.cx * k}px ${y + push.cy * k}px` } : {};

  const isoAt = isolate ? isolate.at ?? ev(ctx, "isolate", 12) : 0;
  const isoOn = !!isolate && g >= isoAt;
  const isoT = isolate ? prog(g, isoAt, ISOLATE_F, "enter") : 0;

  const bands = highlights.map((h, i) => {
    const start = h.at ?? ev(ctx, `hl${i}`, 12 + i * 18);
    if (g < start) return null;
    const p = prog(g, start, SWEEP_F, "enter");
    return <div key={i} style={{ position: "absolute", left: h.x, top: h.y - BAND_PAD, width: h.w, height: h.h + BAND_PAD * 2, background: voxLight.highlighter, mixBlendMode: "multiply", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }} />;
  });
  /** the page and its bands in page pixels, 1 page px = 1 unit before the `k` scale */
  const page = (
    <div style={{ position: "absolute", left: 0, top: 0, width: size.w, height: size.h, background: voxLight.page }}>
      {missing ? <Placeholder label={src ?? "no asset"} w={size.w} h={size.h} /> : <Img src={staticFile(src!)} style={{ width: size.w, height: size.h }} />}
      {bands}
    </div>
  );

  // strip: shows the page region centred on the isolate rect, full frame width; scale zT page px -> design px
  const zT = isolate ? (SHORT_W / isolate.w) * (isolate.zoom ?? 1) : 1;
  const stripH = isolate ? (isolate.h + 2 * 10) * zT : 0; // 10 page px of paper above / below the sentence
  const cxP = isolate ? isolate.x + isolate.w / 2 : 0;
  const cyP = isolate ? isolate.y + isolate.h / 2 : 0;
  // from the page position to the lifted slot
  const fromCy = y + cyP * k;
  const curCy = fromCy + (STRIP_CY - fromCy) * isoT;
  const curS = k + (zT - k) * isoT;
  const curW = SHORT_W; // the strip runs edge to edge
  const curH = ((isolate?.h ?? 0) + 20) * curS;
  const tAt = translation ? translation.at ?? ev(ctx, "translation", isoAt + 10) : 0;

  return (
    <ShortFrame seed={ctx.seed}>
      <div style={{ position: "absolute", inset: 0, ...layer }}>
        <div style={{ position: "absolute", left, top: y, width: pageW, height: pageH, filter: isoOn ? `blur(${ISOLATE_BLUR * isoT}px)` : SHADOWS.printContact }}>
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `scale(${k})` }}>{page}</div>
        </div>
      </div>
      {isolate && isoOn ? (
        <div style={{ position: "absolute", left: 0, top: curCy - curH / 2, width: curW, height: curH, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,0.38)", background: voxLight.page }}>
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${SHORT_W / 2 - cxP * curS}px, ${curH / 2 - cyP * curS}px) scale(${curS})` }}>{page}</div>
        </div>
      ) : null}
      {translation && isolate && g >= tAt ? (
        <div style={{ position: "absolute", left: 0, top: STRIP_CY + stripH / 2 + 36, width: SHORT_W, boxSizing: "border-box", padding: "34px 70px 40px", background: voxLight.ground, borderTop: `2px solid ${voxLight.ink}` }}>
          <div style={{ fontFamily: ROBOTO, fontWeight: 900, fontSize: 24, letterSpacing: "0.12em", textTransform: "uppercase", color: voxLight.ink, opacity: 0.6 }}>{translation.label ?? "English translation"}</div>
          <div style={{ ...shortType.body, fontSize: 58, lineHeight: 1.22, marginTop: 18, textWrap: "balance" }}>{translation.text}</div>
        </div>
      ) : null}
      {source ? <SourceLine text={source} x={54} y={sourceY} style={{ background: voxLight.ground, padding: "14px 20px", margin: "-14px -20px" }} /> : null}
    </ShortFrame>
  );
};
