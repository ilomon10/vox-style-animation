/**
 * The scientific-scrapbook kit (look `voxScrapbook`; measured in analysis/vox-sample/vox_braintravel.md §4–§5):
 * watercolour-paper grounds in section colours, torn paper scraps, specimen labels ("fig. a") on leaders, a plate frame
 * with a tracked "DIAGRAM OF …" title, a halftone serif for titles and source lines. Everything moves on twos
 * (12 drawings/s): pass `useDrawingFrame()` to `tween`.
 */
import React, { useEffect, useState } from "react";
import { measureText } from "@remotion/layout-utils";
import { AbsoluteFill, continueRender, delayRender, Img, OffthreadVideo, staticFile } from "remotion";
import { TornBox } from "../earworm/shared";
import { Paper } from "../effects/Paper";
import { voxScrapbook as C } from "../tokens/colors";
import { ease, type CurveName } from "../tokens/easing";
import { typeStyle, voxScrapbookType as T, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";
import { isMissing, Placeholder, warnOnce, type RecipeCtx } from "../recipes/shared";

export { C as SCRAP, T as SCRAP_TYPE };

/** 0..1 progress of a move from `at` lasting `frames`, eased (feed it the drawing frame) */
export const tween = (f: number, at: number, frames: number, curve: CurveName = "enter"): number => {
  if (f <= at) return 0;
  if (f >= at + frames) return 1;
  return ease(curve)((f - at) / Math.max(1, frames));
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** a named ground of the look ("pink", "mint", "blue", "coral", "white", "sky", "cork", "creamMap") or any hex */
export const groundColor = (c?: string): string => (c && c in C ? (C as Record<string, string>)[c] : c) ?? C.white;

/** watercolour paper in a section colour, with an optional faint engraving or map watermark (multiplied) */
export const ScrapGround: React.FC<{ ctx: RecipeCtx; color?: string; watermark?: string; watermarkOpacity?: number }> = ({
  ctx, color, watermark, watermarkOpacity = 0.14,
}) => (
  <AbsoluteFill>
    <Paper kind="watercolour" color={groundColor(color)} seed={`${ctx.seed}-ground`} />
    {watermark && !isMissing(ctx, watermark) && (
      <Img src={staticFile(watermark)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        mixBlendMode: "multiply", opacity: watermarkOpacity, filter: "grayscale(1)" }} />
    )}
  </AbsoluteFill>
);

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

/** an image or a clip in a box (object-fit), or a labelled placeholder when the file is missing */
export const Pic: React.FC<{
  ctx: RecipeCtx; src?: string; w: number; h: number; fit?: "cover" | "contain"; filter?: string;
  blend?: React.CSSProperties["mixBlendMode"]; style?: React.CSSProperties; startFromSec?: number;
}> = ({ ctx, src, w, h, fit = "contain", filter, blend, style, startFromSec = 0 }) => {
  if (isMissing(ctx, src)) {
    warnOnce(`asset missing: ${src ?? "(no src)"} — placeholder drawn`);
    return <div style={{ position: "relative", width: w, height: h, ...style }}><Placeholder label={src ?? "no asset"} w={w} h={h} /></div>;
  }
  const common: React.CSSProperties = { width: w, height: h, objectFit: fit, filter, mixBlendMode: blend, display: "block", ...style };
  return isVideo(src!)
    ? <OffthreadVideo src={staticFile(src!)} muted startFrom={Math.round(startFromSec * ctx.fps)} style={common} />
    : <Img src={staticFile(src!)} style={common} />;
};

/** a torn paper scrap (flat colour, ragged edge) with a small soft shadow; children sit on it, crisp */
export const Scrap: React.FC<{
  w: number; h: number; color: string; seed: string; rough?: number; children?: React.ReactNode; style?: React.CSSProperties;
}> = ({ w, h, color, seed, rough = 10, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, filter: "drop-shadow(2px 4px 5px rgba(0,0,0,0.22))", ...style }}>
    <TornBox width={w} height={h} color={color} seed={seed} rough={rough}>{children}</TornBox>
  </div>
);

/** text in a type role, wrapping allowed */
export const Txt: React.FC<{ role: TypeRole; children: React.ReactNode; style?: React.CSSProperties; trim?: boolean }> = ({ role, children, style, trim }) => (
  <div style={{ ...typeStyle(role), whiteSpace: "pre-wrap", ...(trim ? capTrim : null), ...style }}>{children}</div>
);

/** hold the frame until the fonts of these roles are loaded, then return true: `textWidth` must measure the real glyphs */
export const useFontsReady = (...roles: TypeRole[]): boolean => {
  const key = roles.map((r) => {
    const st = typeStyle(r);
    return `${r.italic ? "italic " : ""}${r.weight} ${Math.round(st.fontSize as number)}px "${st.fontFamily}"`;
  }).join("|");
  const [handle] = useState(() => delayRender(`scrapbook fonts: ${key}`));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const done = () => { setReady(true); continueRender(handle); };
    Promise.all(key.split("|").map((k) => document.fonts.load(k))).then(done, done);
  }, [handle, key]);
  return ready;
};

/** the width of one line of `text` set in `role`, in design px: measured once the fonts are ready (useFontsReady),
 *  estimated at `fallbackEm` per character before that or if measuring fails */
export const textWidth = (role: TypeRole, text: string, ready: boolean, fallbackEm = 0.55): number => {
  if (!text) return 0;
  const st = typeStyle(role);
  const estimate = text.length * fallbackEm * (st.fontSize as number);
  if (!ready) return estimate;
  try {
    return measureText({ text, fontFamily: st.fontFamily as string, fontSize: st.fontSize as number, fontWeight: String(role.weight),
      letterSpacing: st.letterSpacing as string | undefined, textTransform: role.uppercase ? "uppercase" : undefined,
      additionalStyles: role.italic ? { fontStyle: "italic" } : undefined, validateFontIsLoaded: true }).width;
  } catch {
    return estimate;
  }
};

/** halftone-dot ink inside the letters (chapter titles): the role's colour as a fine dot screen over a lighter fill */
export const halftoneInk = (color: string, cell = 5): React.CSSProperties => ({
  color: "transparent",
  backgroundImage: `radial-gradient(circle, ${color} 58%, transparent 62%), linear-gradient(${color}CC, ${color}CC)`,
  backgroundSize: `${cell}px ${cell}px, 100% 100%`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
});

/** a specimen label: "fig. a" (regular), then a bold first line and regular tracked lines, on a hairline leader */
export const SpecimenLabel: React.FC<{
  fig?: string; lines: string[]; x: number; y: number; from?: { x: number; y: number }; opacity?: number; draw?: number;
  align?: "left" | "right"; width?: number; firstBold?: boolean;
}> = ({ fig, lines, x, y, from, opacity = 1, draw = 1, align = "left", width = 460, firstBold = true }) => {
  const lx = align === "left" ? x - 14 : x + width + 14;
  return (
    <>
      {from && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }} width={1} height={1}>
          <line x1={from.x} y1={from.y} x2={lerp(from.x, lx, draw)} y2={lerp(from.y, y + 16, draw)} stroke={C.labelInk} strokeWidth={2} />
          <circle cx={from.x} cy={from.y} r={4} fill={C.labelInk} />
        </svg>
      )}
      <div style={{ position: "absolute", left: x, top: y, width, opacity, textAlign: align }}>
        {fig && <Txt role={T.fig} style={{ marginBottom: 10 }}>{fig}</Txt>}
        {lines.map((l, i) => (
          <Txt key={i} role={i === 0 && firstBold ? T.labelName : T.labelRole}>{l}</Txt>
        ))}
      </div>
    </>
  );
};

/** the diagram plate: white watercolour paper, a rounded hairline frame (x72–1848, y75–1003) and a tracked title above */
export const PlateFrame: React.FC<{ title?: string; opacity?: number }> = ({ title, opacity = 1 }) => (
  <>
    <div style={{ position: "absolute", left: 72, top: 75, width: 1776, height: 928, border: `3px solid ${C.frameRule}`, borderRadius: 26, boxSizing: "border-box", opacity }} />
    {title && (
      <div style={{ position: "absolute", left: 0, top: 30, width: 1920, textAlign: "center", opacity }}>
        <Txt role={T.diagramTitle}>{title}</Txt>
      </div>
    )}
  </>
);

/** source line, bottom-left (x ≈ 97, baseline ≈ 1032); white on photographs */
export const SourceLine: React.FC<{ text?: string; light?: boolean; opacity?: number }> = ({ text, light, opacity = 1 }) =>
  text ? (
    <div style={{ position: "absolute", left: 97, top: 1010, opacity }}>
      <Txt role={{ ...T.source, color: light ? "#FFFFFF" : T.source.color }}>{text}</Txt>
    </div>
  ) : null;

/** placement + entry motion for an element riding in from an offset (slide / rise / drop), with rotation */
export const enter = (f: number, at: number, frames: number, from: { dx?: number; dy?: number; rot?: number; scale?: number }, curve: CurveName = "enter") => {
  const t = tween(f, at, frames, curve);
  return {
    t,
    style: {
      opacity: f < at ? 0 : 1,
      transform: `translate(${lerp(from.dx ?? 0, 0, t)}px, ${lerp(from.dy ?? 0, 0, t)}px) rotate(${lerp(from.rot ?? 0, 0, t)}deg) scale(${lerp(from.scale ?? 1, 1, t)})`,
    } as React.CSSProperties,
  };
};
