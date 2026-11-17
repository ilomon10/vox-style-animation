import React, { createContext, useContext } from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import type { CueIndex } from "../audio";
import { BlackCollageGround, TornPhoto, distressMask, type TornPhotoProps } from "../earworm";
import { Paper } from "../effects/Paper";
import { DesignSpace, useDesignSize, useFrameDesign } from "../lib/stage";
import { useDrawingFrame } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { useTheme, type PaperKind } from "../tokens/theme";
import { earwormType, typeStyle } from "../tokens/type";
import { capTrim } from "../type/shared";

/** What the storyboard engine hands every recipe besides its props. Frames are relative to the scene's first frame. */
export type RecipeCtx = {
  fps: number;
  /** scene length in frames */
  dur: number;
  /** event id -> frames relative to the scene start (the storyboard's `events`); `ev(id, fallback)` is the usual accessor */
  events: Record<string, { at: number; until?: number }>;
  /** voice-over cue index (frames absolute) and the frame this scene starts at, for recipes that read words directly */
  cues: CueIndex;
  sceneStart: number;
  /** public/-relative asset paths that did not load: recipes draw a placeholder instead */
  missing: ReadonlySet<string>;
  seed: string;
};
export type RecipeProps<P> = P & { ctx: RecipeCtx };
const CtxContext = createContext<RecipeCtx | null>(null);
export const RecipeCtxProvider = CtxContext.Provider;
export const useRecipeCtx = () => useContext(CtxContext);

/** event frame (relative to the scene) or a fallback derived from the scene's own start */
export const ev = (ctx: RecipeCtx, id: string, fallback: number) => ctx.events[id]?.at ?? fallback;
export const evUntil = (ctx: RecipeCtx, id: string, fallback?: number) => ctx.events[id]?.until ?? fallback;

const warned = new Set<string>();
export const warnOnce = (msg: string) => {
  if (!warned.has(msg)) {
    warned.add(msg);
    // eslint-disable-next-line no-console
    console.warn(`[storyboard] ${msg}`);
  }
};

/**
 * Ground + the design-space content: every recipe's frame.
 * "auto" (default): the Earworm black collage (bit-identical to before), except on the light look, which draws its paper ground.
 * "collage" forces the black collage, "theme" the look's paper (`theme.paper`), "none" no ground (full-bleed screen capture). `paper` overrides the theme's paper kind (e.g. "lightGhost").
 */
export const RecipeFrame: React.FC<{ seed: string; variant?: "black" | "whitePaper"; ground?: "auto" | "collage" | "theme" | "none"; paper?: PaperKind; children: React.ReactNode }> = ({ seed, variant = "black", ground = "auto", paper, children }) => {
  const theme = useTheme();
  const kind = ground === "auto" ? (theme.name === "voxLight" || theme.name === "voxScrapbook" ? "theme" : "collage") : ground;
  // short format, landscape recipe: its 1920×1080 design box is a letterboxed band, so the look's paper is drawn ONCE
  // over the whole portrait frame (in the frame's own design space) instead of inside the band
  const { width, height } = useVideoConfig();
  const active = useDesignSize();
  const frame = useFrameDesign();
  const letterboxed = Math.abs(active.w / active.h - width / height) > 0.01;
  return (
    <AbsoluteFill>
      {kind === "collage" ? <BlackCollageGround seed={seed} variant={variant} /> : null}
      {kind === "theme" && letterboxed ? (
        <DesignSpace design={frame}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Paper seed={seed} kind={paper} width={frame.w} height={frame.h} />
          </div>
        </DesignSpace>
      ) : null}
      <DesignSpace>
        {kind === "theme" && !letterboxed ? (
          <div style={{ position: "absolute", inset: 0 }}>
            {/* the active design size: 1920×1080 (= Paper's defaults) for landscape, 1080×1920 for portrait recipes */}
            <Paper seed={seed} kind={paper} width={active.w} height={active.h} />
          </div>
        ) : null}
        {children}
      </DesignSpace>
    </AbsoluteFill>
  );
};

/** Procedural stand-in for a missing asset: torn grey slab with the file name in kit caps. */
export const Placeholder: React.FC<{ label: string; w: number; h: number; x?: number; y?: number; rotate?: number }> = ({ label, w, h, x = 0, y = 0, rotate }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: rotate ? `rotate(${rotate}deg)` : undefined, background: "#3A3839", border: `12px solid ${voxEarworm.tornWhite}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ ...typeStyle({ ...earwormType.subLabel, cap: 26, color: voxEarworm.labelGrey }), ...capTrim, textAlign: "center", padding: 16 }}>
      MISSING<br />{label.split("/").pop()}
    </div>
  </div>
);

export const isMissing = (ctx: RecipeCtx, src?: string) => !src || ctx.missing.has(src);

/** Torn B/W photo, or a placeholder (+ console warning) when the asset did not load. */
export const SafePhoto: React.FC<{ ctx: RecipeCtx; src?: string } & Omit<TornPhotoProps, "src">> = ({ ctx, src, ...p }) => {
  if (isMissing(ctx, src)) {
    warnOnce(`asset missing: ${src ?? "(no src)"} — placeholder drawn`);
    return <Placeholder label={src ?? "no asset"} w={p.width} h={p.height} x={p.x} y={p.y} rotate={p.rotate} />;
  }
  return <TornPhoto src={src!} {...p} />;
};

/** Cut-out (alpha PNG) in the kit's B/W grade, no border. */
export const SafeCutout: React.FC<{ ctx: RecipeCtx; src?: string; x: number; y: number; w: number; h: number; rotate?: number }> = ({ ctx, src, x, y, w, h, rotate }) => {
  if (isMissing(ctx, src)) {
    warnOnce(`asset missing: ${src ?? "(no src)"} — placeholder drawn`);
    return <Placeholder label={src ?? "no asset"} w={w} h={h} x={x} y={y} rotate={rotate} />;
  }
  return (
    <Img src={staticFile(src!)} style={{ position: "absolute", left: x, top: y, width: w, height: h, objectFit: "contain", transform: rotate ? `rotate(${rotate}deg)` : undefined, filter: "grayscale(1) contrast(1.15)" }} />
  );
};

/** "hinge" unfold of a collage piece (earworm-A §8): scales open from one edge over `frames` drawings. */
export const Unfold: React.FC<{ at: number; hinge?: "top" | "bottom" | "left" | "right"; frames?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at, hinge = "bottom", frames = 8, children, style,
}) => {
  const f = useDrawingFrame();
  if (f < at) return null;
  const p = ease("enter")(Math.min(1, (f - at + 1) / frames));
  const horiz = hinge === "left" || hinge === "right";
  const origin = { top: "50% 0%", bottom: "50% 100%", left: "0% 50%", right: "100% 50%" }[hinge];
  return (
    <div style={{ position: "absolute", transformOrigin: origin, transform: horiz ? `scaleX(${p})` : `scaleY(${p})`, ...style }}>{children}</div>
  );
};

/** Kit-style big caps line (condensed, distressed). */
export const CapsLine: React.FC<{ text: string; x: number; y: number; role?: keyof typeof earwormType; color?: string; cap?: number; align?: "left" | "center"; seed?: string; opacity?: number }> = ({
  text, x, y, role = "keyword", color, cap, align = "center", seed = "caps", opacity = 1,
}) => {
  const r = earwormType[role];
  return (
    <div style={{ position: "absolute", left: x, top: y - (cap ?? r.cap) / 2, whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : undefined, opacity, ...capTrim, ...typeStyle({ ...r, cap: cap ?? r.cap, color: color ?? r.color, leading: 1 }), ...distressMask(Math.abs(hash(seed)) % 900, 0) }}>
      {text}
    </div>
  );
};
const hash = (s: string) => Array.from(s).reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
