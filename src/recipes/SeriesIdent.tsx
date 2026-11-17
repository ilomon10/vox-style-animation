import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { DesignSpace } from "../lib/stage";
import { useDrawingFrame } from "../lib/time";
import { ease } from "../tokens/easing";
import { typeStyle, type TypeRole } from "../tokens/type";
import { packaging } from "../tokens/colors";
import { capTrim, prog } from "../type/shared";
import { isMissing, warnOnce, type RecipeProps } from "./shared";

export type SeriesIdentProps = {
  /** OUR series name, sentence case; never a real logo or a sponsor's mark */
  title: string;
  /** small caps line typed on one letter per frame */
  tagline?: string;
  /** "overPicture" (CR/EL): the picture keeps running, white title pops in. "card" (CE/DA): flat accent card, title rises from a mask, camera pushes ×1.05 */
  style?: "overPicture" | "card";
  /** picture or footage (.mp4/.webm) behind; give the previous scene's `src` so the picture seems to keep running. On `card`: optional art above the title (contain) */
  src?: string;
  /** card: the look's accent (CE #FBFF0B, DA #159EC8) */
  cardColor?: string;
  /** authoring hint: the scene should be about this long (default 4.2 s; set the NEXT scene's start accordingly); only checked, never enforced */
  holdSec?: number;
  /** silence before the hard cut out, frames @24 (default 12; EL 24, CR 13, CE 6). The recipe does not draw it: make it with a `cut` transition `hole` or two music anchors */
  holeF?: number;
};

/** Own tokens (the token files belong to the lead). Title: Archivo 800 extended, cap ≈ 8.7 % H (coverage §6.2, CE 1m06s still: cap 90 px). */
export const seriesIdentType = {
  title: { font: "EXTENDED", cap: 94, weight: 800, color: "#FFFFFF", leading: 1 },
  tagline: { font: "SMALL_SANS", cap: 26, weight: 600, color: "#FFFFFF", leading: 1, tracking: 0.14, uppercase: true },
} satisfies Record<string, TypeRole>;
export const seriesIdentColors = { cardCE: packaging.identCard, ink: packaging.identInk, scrim: packaging.identScrim } as const;

/** all timings are measured at 24 fps (coverage §6.2): frames at the composition fps */
const REF_FPS = 24;
const isVideo = (s: string) => /\.(mp4|webm|mov)$/i.test(s);

/** Picture or footage behind the title, slowly drifting (the still-photo stand-in for "the picture keeps running"). On ones. */
const Backdrop: React.FC<{ ctx: RecipeProps<SeriesIdentProps>["ctx"]; src?: string }> = ({ ctx, src }) => {
  const f = useCurrentFrame();
  if (!src || isMissing(ctx, src)) {
    if (src) warnOnce(`asset missing: ${src}: plain ground drawn`);
    return <AbsoluteFill style={{ background: "#3A3839" }} />;
  }
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {isVideo(src) ? (
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.04 * (f / Math.max(1, ctx.dur))})` }} />
      )}
      <AbsoluteFill style={{ background: seriesIdentColors.scrim }} />
    </AbsoluteFill>
  );
};

/** Tagline: one letter per frame (on ones), from `at` frames. */
const TypedTagline: React.FC<{ text: string; at: number; baseline: number; color?: string }> = ({ text, at, baseline, color }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, f - at + 1));
  const role = { ...seriesIdentType.tagline, ...(color ? { color } : {}) };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: baseline - role.cap, textAlign: "center", ...typeStyle(role), ...capTrim }}>
      {text.slice(0, n)}
    </div>
  );
};

/**
 * Recipe "series ident" (Vox CR/CE/EL, build 5): own series card right after the thesis (9.6–16.5 % of the runtime), 3.5–10.5 s, hard cut out.
 *  - `overPicture` (CR, analysis/stills/vox_creatine/0m59s_vox_ident_presented_by.jpg): picture runs; the title pops in within 1 f at f12; the tagline types 1 letter/frame from f24.
 *  - `card` (CE, analysis/stills/vox_cleanenergy/1m06s_series_title_card.jpg): flat accent card 12 f, then the title rises from a baseline mask over 12 f while the camera pushes ×1.05.
 * Sound: a sting under it via storyboard `sfx[]` (sub_boom / bass_hit, peak:true on the pop), music alone, then `holeF` of silence before the cut out
 * (`transitionIn: {kind: "cut", hole: N}` on the NEXT scene once the engine has it, else two music anchors). Start 0–12 f after the thesis' last word, never under narration.
 */
export const SeriesIdent: React.FC<RecipeProps<SeriesIdentProps>> = ({ ctx, title, tagline, style = "overPicture", src, cardColor = seriesIdentColors.cardCE, holdSec = 4.2 }) => {
  const df = useDrawingFrame();
  const k = ctx.fps / REF_FPS;
  const fr = (f24: number) => Math.round(f24 * k);
  if (Math.abs(ctx.dur / ctx.fps - holdSec) > holdSec * 0.35) warnOnce(`SeriesIdent: scene is ${(ctx.dur / ctx.fps).toFixed(1)} s, holdSec is ${holdSec}: set the next scene's start ≈ ${holdSec} s after this one`);
  // long names shrink to fit (reference title ≈ 820 px wide at 16 characters)
  const cap = seriesIdentType.title.cap * Math.min(1, 18 / Math.max(1, title.length));
  const titleRole = { ...seriesIdentType.title, cap };

  if (style === "overPicture") {
    // on ones: "pops in within 1 f"
    return (
      <AbsoluteFill>
        <Backdrop ctx={ctx} src={src} />
        <OverPictureTitle title={title} tagline={tagline} role={titleRole} popAt={fr(12)} typeAt={fr(24)} />
      </AbsoluteFill>
    );
  }

  // card: the push (×1.05, ease out) runs over the whole scene; card colour is there from f0
  const push = 1 + 0.05 * ease("enter")(prog(df, 0, ctx.dur));
  const riseP = ease("enter")(prog(df, fr(12), fr(12)));
  const baseline = 825; // CE still: title baseline y ≈ 825 (76 % H)
  return (
    <AbsoluteFill style={{ background: cardColor }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 50%" }}>
        <DesignSpace>
          {src && !isMissing(ctx, src) && (
            <Img src={staticFile(src)} style={{ position: "absolute", left: 360, top: 90, width: 1200, height: 580, objectFit: "contain" }} />
          )}
          {/* mask = cap box + descender room; the line rises ≈ 1.4 caps from below it */}
          <div style={{ position: "absolute", left: 0, right: 0, top: baseline - cap, height: cap * 1.4, overflow: "hidden", textAlign: "center" }}>
            <div style={{ transform: `translateY(${(1 - riseP) * cap * 1.5}px)`, ...typeStyle({ ...titleRole, color: seriesIdentColors.ink }), ...capTrim }}>{title}</div>
          </div>
          {tagline && <TypedTagline text={tagline} at={fr(24)} baseline={baseline + 150} color={seriesIdentColors.ink} />}
        </DesignSpace>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OverPictureTitle: React.FC<{ title: string; tagline?: string; role: TypeRole; popAt: number; typeAt: number }> = ({ title, tagline, role, popAt, typeAt }) => {
  const f = useCurrentFrame();
  const baseline = 520; // CR still: wordmark block centred ≈ 42 % H, tagline under it
  return (
    <DesignSpace>
      {f >= popAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: baseline - role.cap, textAlign: "center", ...typeStyle(role), ...capTrim }}>{title}</div>
      )}
      {tagline && <TypedTagline text={tagline} at={typeAt} baseline={baseline + 130} />}
    </DesignSpace>
  );
};
