import React from "react";
import { Img, staticFile } from "remotion";
import { HandRing } from "../earworm";
import { rand } from "../lib/random";
import { useDrawingFrame } from "../lib/time";
import { SHADOWS } from "../tokens/finish";
import { voxLight } from "../tokens/colors";
import { useTheme } from "../tokens/theme";
import { SourceLine } from "../type/SourceLine";
import { prog } from "../type/shared";
import { RecipeFrame, SafePhoto, ev, isMissing, warnOnce, type RecipeCtx, type RecipeProps } from "./shared";

type Rect = { x: number; y: number; w: number; h: number };
type Highlight = { x: number; y: number; w: number; h?: number; at?: number; frames?: number };

export type DocumentHighlightProps = {
  /** scan of the document / newspaper page / screenshot of a web page */
  src?: string;
  /** "collage" = torn print on the black collage (Earworm, the default there); "theme" = flat page on the look's paper
   *  (default on the light look); "fullbleed" = screen capture over the whole frame, no ground, no border */
  ground?: "collage" | "theme" | "fullbleed";
  /** paper under a "theme" ground: "light" (default), "lightGrid" (CR, CE) or "lightGhost" (EL ghost newsprint) */
  paper?: "light" | "lightGrid" | "lightGhost";
  /** "browser": a thin browser bar on top of the page (theme / fullbleed grounds) */
  frame?: "none" | "browser";
  /** document box, design px (default portrait page, centred; ignored by "fullbleed") */
  box?: Rect;
  /** highlighter bands, design px (x, y = top-left of the band; h default 59 = 5.5 % H). Start at `at` (default staggered 12 + 18 i f from the cut,
   *  event `hl<i>`), sweep left to right in `frames` (default 10), colour from the look. Under `isolate` they are drawn on the lifted strip, with the page's coordinates. */
  highlights?: Highlight[];
  /** one band per line, each starting `perLineF` (default 12) after the previous one; lines in page coordinates like `highlights` */
  readAlong?: { lines: { x: number; y: number; w: number; h?: number }[]; at?: number; perLineF?: number };
  /** hand-drawn rings around the passages, drawn at `at` (anchor: the word that names the passage); colour from the look */
  rings?: { cx: number; cy: number; rx: number; ry: number; at?: number }[];
  /** the page blurs while the strip `x, y, w, h` (page coordinates) lifts sharp, scales up to ≈ 1040 px wide and moves to the centre, 13 f */
  isolate?: Rect & { at?: number };
  /** reframe burst about (cx, cy) (default the centre): scale to `to` over `frames` (default 13) from `at` (default 0), ease "settle", then a hold. Replaces the slow push-in */
  push?: { to: number; cx?: number; cy?: number; at?: number; frames?: number };
  /** source credit line, bottom-left (see SourceLine), on from the cut */
  source?: string;
};

const FRAME_W = 1920;
const FRAME_H = 1080;
const BAND_H = 59; // 5.5 % H (CR 1:27 band 57–60 px, CE 5:52 62 px, EL 6:27 77 px incl. 1.3 cap)
const SWEEP_F = 10; // 7–17 f measured, median 10
const ISOLATE_F = 13; // CR 1:25.18
const ISOLATE_BLUR = 12; // px, measured on the CR 1:27 still (spec: 6–8 not measured)
const STRIP_W = 1040; // CR 1:27: strip 463–1502
const STRIP_MAX_H = 700;
const BAR_H = 56; // browser bar, design px

/** flat highlighter band, multiplied under the ink, revealed left → right */
const Band: React.FC<{ x: number; y: number; w: number; h: number; start: number; frames: number; color: string }> = ({ x, y, w, h, start, frames, color }) => {
  const g = useDrawingFrame();
  if (g < start) return null;
  const p = prog(g, start, frames, "enter");
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: color, mixBlendMode: "multiply", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }} />
  );
};

/** the document as a flat page (light looks): image in its box, optional browser bar, or a placeholder when the asset did not load */
const FlatPage: React.FC<{ ctx: RecipeCtx; src?: string; rect: Rect; browser: boolean; shadow: boolean }> = ({ ctx, src, rect, browser, shadow }) => {
  const missing = isMissing(ctx, src);
  if (missing) warnOnce(`asset missing: ${src ?? "(no src)"} — placeholder drawn`);
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, background: voxLight.page, filter: shadow ? SHADOWS.printContact : undefined }}>
      {browser ? (
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: BAR_H, background: "#F1F1F1", borderBottom: "2px solid #D6D6D6", zIndex: 1 }}>
          {[28, 56, 84].map((dx) => (
            <div key={dx} style={{ position: "absolute", left: dx - 8, top: BAR_H / 2 - 8, width: 16, height: 16, borderRadius: 8, background: "#CFCFCF" }} />
          ))}
          <div style={{ position: "absolute", left: 120, right: 28, top: 12, height: BAR_H - 24, borderRadius: 16, background: "#E3E3E3" }} />
        </div>
      ) : null}
      {missing ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: browser ? BAR_H : 0, bottom: 0, background: "#D9D9D9", display: "flex", alignItems: "center", justifyContent: "center", color: voxLight.ink, fontFamily: "sans-serif", fontSize: 28 }}>
          MISSING {(src ?? "no asset").split("/").pop()}
        </div>
      ) : (
        <Img src={staticFile(src!)} style={{ position: "absolute", left: 0, top: browser ? BAR_H : 0, width: rect.w, height: rect.h - (browser ? BAR_H : 0), objectFit: browser || rect.w === FRAME_W ? "cover" : "contain", objectPosition: "50% 0%" }} />
      )}
    </div>
  );
};

/** ragged top / bottom edge of the cut strip: seeded, fixed vertex count so it does not crawl while the strip scales */
const tornClip = (seed: string): string => {
  const n = 48;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = ((i / n) * 100).toFixed(2);
    top.push(`${x}% ${(rand(`${seed}-t${i}`) * 7).toFixed(1)}px`);
    bot.push(`${((1 - i / n) * 100).toFixed(2)}% calc(100% - ${(rand(`${seed}-b${i}`) * 7).toFixed(1)}px)`);
  }
  return `polygon(${[...top, ...bot].join(", ")})`;
};

/**
 * Recipe "document highlight". Earworm default: the document sits as a torn print with a slow push-in; the key passage is ringed in
 * periwinkle at the word that names it. Light look: a flat page (or a full-bleed screen capture, `ground: "fullbleed"`, optionally under a
 * browser bar) with lemon highlighter bands, a read-along, rings in the look's colour, the CR "isolate" strip lift, a reframe `push` and a source line.
 * Events: ring0.., hl0.. (a band's start), read (the read-along's start), isolate, push. Anchors in props (`at`) override them.
 */
export const DocumentHighlight: React.FC<RecipeProps<DocumentHighlightProps>> = ({
  ctx, src, ground, paper, frame = "none", box = { x: 540, y: 40, w: 840, h: 1000 }, highlights = [], readAlong, rings = [], isolate, push: pushProp, source,
}) => {
  const g = useDrawingFrame();
  const theme = useTheme();
  const gr = ground ?? (theme.name === "voxLight" ? "theme" : "collage");
  const ringColor = theme.colors.ring ?? theme.accent;
  const hlColor = theme.colors.highlighter ?? theme.accent;
  const browser = frame === "browser" && gr !== "collage";

  let layerStyle: React.CSSProperties;
  if (pushProp) {
    const p = prog(g, pushProp.at ?? ev(ctx, "push", 0), pushProp.frames ?? 13, "settle");
    layerStyle = { transform: `scale(${1 + (pushProp.to - 1) * p})`, transformOrigin: `${pushProp.cx ?? FRAME_W / 2}px ${pushProp.cy ?? FRAME_H / 2}px` };
  } else {
    const push = 1 + 0.06 * Math.min(1, g / Math.max(1, ctx.dur));
    layerStyle = { transform: `scale(${push})`, transformOrigin: "50% 50%" };
  }

  const rect: Rect = gr === "fullbleed" ? { x: 0, y: 0, w: FRAME_W, h: FRAME_H } : box;
  const isoAt = isolate ? isolate.at ?? ev(ctx, "isolate", 12) : 0;
  const isoT = isolate ? prog(g, isoAt, ISOLATE_F, "enter") : 0;
  const isoOn = !!isolate && g >= isoAt;
  const zT = isolate ? Math.min(STRIP_W / isolate.w, STRIP_MAX_H / isolate.h) : 1;
  const z = 1 + (zT - 1) * isoT;

  /** bands in page coordinates; `k` scales the default band height so it reads 59 px on screen after the strip's zoom */
  const bandScale = isoOn ? zT : 1;
  const bands = (
    <>
      {highlights.map((h, i) => (
        <Band key={`h${i}`} x={h.x} y={h.y} w={h.w} h={h.h ?? BAND_H / bandScale} start={h.at ?? ev(ctx, `hl${i}`, 12 + i * 18)} frames={h.frames ?? SWEEP_F} color={hlColor} />
      ))}
      {readAlong?.lines.map((l, i) => {
        const per = readAlong.perLineF ?? 12;
        return <Band key={`r${i}`} x={l.x} y={l.y} w={l.w} h={l.h ?? BAND_H / bandScale} start={(readAlong.at ?? ev(ctx, "read", 12)) + i * per} frames={per} color={hlColor} />;
      })}
    </>
  );

  const page =
    gr === "collage" ? (
      <SafePhoto ctx={ctx} src={src} x={box.x} y={box.y} width={box.w} height={box.h} fit="contain" seed={`${ctx.seed}-d`} slam />
    ) : (
      <FlatPage ctx={ctx} src={src} rect={rect} browser={browser} shadow={gr === "theme"} />
    );

  const frameGround = gr === "collage" ? "collage" : gr === "fullbleed" ? "none" : "theme";
  return (
    <RecipeFrame seed={ctx.seed} ground={frameGround} paper={paper}>
      <div style={{ position: "absolute", inset: 0, ...layerStyle }}>
        {isolate ? <div style={{ position: "absolute", inset: 0, filter: isoOn ? `blur(${ISOLATE_BLUR * isoT}px)` : undefined }}>{page}</div> : page}
        {isolate ? null : bands}
        {rings.map((r, i) => (
          <HandRing key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} delay={r.at ?? ev(ctx, `ring${i}`, 12 + i * 18)} color={ringColor} width={6} seed={`${ctx.seed}-h${i}`} />
        ))}
        {isolate && isoOn ? (
          <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.35))" }}>
            <div
              style={{
                position: "absolute",
                left: isolate.x + isolate.w / 2 + (FRAME_W / 2 - isolate.x - isolate.w / 2) * isoT - (isolate.w * z) / 2,
                top: isolate.y + isolate.h / 2 + (FRAME_H / 2 - isolate.y - isolate.h / 2) * isoT - (isolate.h * z) / 2,
                width: isolate.w * z,
                height: isolate.h * z,
                overflow: "hidden",
                clipPath: tornClip(`${ctx.seed}-strip`),
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, width: FRAME_W, height: FRAME_H, transformOrigin: "0 0", transform: `translate(${-isolate.x * z}px, ${-isolate.y * z}px) scale(${z})` }}>
                {page}
                {bands}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {source ? <SourceLine text={source} /> : null}
    </RecipeFrame>
  );
};
