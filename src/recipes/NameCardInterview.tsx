import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { DecodeNameCard, ZoomWindow } from "../earworm";
import { DesignSpace } from "../lib/stage";
import { LowerThird, type LowerThirdProps } from "../type/LowerThird";
import { Placeholder, RecipeFrame, ev, isMissing, warnOnce, type RecipeProps } from "./shared";

export type NameCardInterviewProps = {
  /** interview footage (mp4/webm: live, native rate) or a portrait still */
  src?: string;
  name: string;
  title?: string;
  affiliation?: string;
  window?: { x: number; y: number; w: number; h: number };
  /** "decode" (default): periwinkle decode card beside the window. "lowerThird": house lower third (events: `lowerThird` or `resolve` = start, default cut +2 f; `exit` = end, default 120 f) */
  card?: "decode" | "lowerThird";
  /** "window" (default): rounded window on the black plate. "fullframe": the footage fills the frame (no plate; sound unchanged: muted like the window) */
  layout?: "window" | "fullframe";
  /** lowerThird options: variant, bar, exit, role (defaults to title + affiliation joined by ", ") */
  lowerThird?: Partial<Pick<LowerThirdProps, "variant" | "bar" | "exit" | "role" | "x" | "baselineY" | "life">>;
};

/** Recipe "name card interview" (Earworm B): rounded window on the black plate + decode name card whose SURNAME resolves at event `resolve` (kind name = onset +4). Events: `resolve`, `exit`. */
export const NameCardInterview: React.FC<RecipeProps<NameCardInterviewProps>> = ({ ctx, src, name, title, affiliation, window: w0 = { x: 175, y: 155, w: 860, h: 775 }, card = "decode", layout = "window", lowerThird }) => {
  const full = layout === "fullframe";
  const w = full ? { x: 0, y: 0, w: 1920, h: 1080 } : w0;
  const video = !!src && /\.(mp4|webm|mov)$/i.test(src);
  const miss = isMissing(ctx, src);
  if (miss) warnOnce(`asset missing: ${src ?? "(no src)"} — placeholder drawn`);
  const media = (
    <>
      {miss ? <Placeholder label={src ?? "interview"} w={w.w} h={w.h} x={w.x} y={w.y} />
        : video ? <ZoomWindow src={src!} x={w.x} y={w.y} width={w.w} height={w.h} />
        : (
          <div style={{ position: "absolute", left: w.x, top: w.y, width: w.w, height: w.h, borderRadius: full ? 0 : 20, overflow: "hidden", background: "#0C0C0C" }}>
            <Img src={staticFile(src!)} style={{ width: w.w, height: w.h, objectFit: "cover", filter: full ? undefined : "grayscale(1) contrast(1.1)" }} />
          </div>
        )}
    </>
  );
  if (card === "lowerThird") {
    const start = ctx.events.lowerThird?.at ?? ctx.events.resolve?.at ?? 2;
    const end = ctx.events.exit?.at;
    const role = lowerThird?.role ?? ([title, affiliation].filter(Boolean).join(", ") || undefined);
    const lt = <LowerThird name={name} {...lowerThird} role={role} delay={start} life={lowerThird?.life ?? (end !== undefined ? end - start : 120)} seed={`${ctx.seed}-lt`} />;
    return full ? (
      <AbsoluteFill style={{ background: "#0C0C0C" }}><DesignSpace>{media}{lt}</DesignSpace></AbsoluteFill>
    ) : (
      <RecipeFrame seed={ctx.seed}>{media}{lt}</RecipeFrame>
    );
  }
  const decode = <DecodeNameCard name={name} title={title} affiliation={affiliation} x={w.x + w.w + 110} y={511} delay={0} resolveAt={ev(ctx, "resolve", 21)} exitAt={ctx.events.exit?.at} seed={`${ctx.seed}-nc`} />;
  return full ? (
    <AbsoluteFill style={{ background: "#0C0C0C" }}><DesignSpace>{media}{decode}</DesignSpace></AbsoluteFill>
  ) : (
    <RecipeFrame seed={ctx.seed}>{media}{decode}</RecipeFrame>
  );
};
