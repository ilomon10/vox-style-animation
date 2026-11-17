import React from "react";
import { Img, staticFile } from "remotion";
import { packaging, voxLight } from "../../tokens/colors";
import { ROBOTO, TEXT_SERIF } from "../../tokens/fonts";
import { useDrawingFrame } from "../../lib/time";
import { capTrim } from "../../type/shared";
import { Paper } from "../../effects/Paper";
import { Placeholder, RecipeFrame, isMissing, warnOnce, type RecipeCtx } from "../shared";

/** Shared measurements of the portrait recipes (1080×1920 design px). Source: analysis/vox-shorts.md §7. */
export const SHORT_W = 1080;
export const SHORT_H = 1920;
/** flat lemon box of the hook, name label and end card (spec §7b/§7c4; our own box colour: `packaging.lemon`) */
export const SHORT_LEMON = packaging.lemon;
export const SHORT_INK = "#000000"; // hook / label text is pure black in the references (§7b2)
export const HOOK_W = 864; // §7b1
export const HOOK_SLOT_Y = { lower: 1420, upper: 1110 } as const; // §7b4
export const LABEL_SLOT_Y = { lower: 1450, upper: 300 } as const; // §7c4

/** Type roles of the Shorts (design px; cap heights from the measured stills). */
export const shortType = {
  /** hook / question card: Roboto 900, ALL CAPS, 60 px (cap 42), line pitch 1.0 em (§7b2) */
  hook: { fontFamily: ROBOTO, fontWeight: 900, fontSize: 60, lineHeight: "60px", textTransform: "uppercase", color: SHORT_INK } as React.CSSProperties,
  /** name label, name: Roboto 900, cap 39 -> 54 px (§7c4) */
  labelName: { fontFamily: ROBOTO, fontWeight: 900, fontSize: 54, lineHeight: "62px", color: SHORT_INK } as React.CSSProperties,
  /** name label, role: Source Serif 4 Italic, cap 30 -> 45 px (cap ratio 0.67) */
  labelRole: { fontFamily: TEXT_SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 45, lineHeight: "62px", color: SHORT_INK } as React.CSSProperties,
  /** dates, step numbers, counter: Roboto 900 */
  heavy: { fontFamily: ROBOTO, fontWeight: 900, color: voxLight.ink } as React.CSSProperties,
  /** text on the paper: Source Serif 4 600 */
  body: { fontFamily: TEXT_SERIF, fontWeight: 600, color: voxLight.ink } as React.CSSProperties,
};

/** pop envelope of the caption box (§7a7): 0.96 -> 1.03 -> 1.05 -> 1.04 -> 1.01 -> 1.00 over frames 0-5, at 24 fps */
export const POP = [0.96, 1.03, 1.05, 1.04, 1.01, 1];
export const popScale = (f: number, fps: number) => POP[Math.min(POP.length - 1, Math.max(0, Math.floor((f * 24) / fps)))];

/** Frames at 24 fps -> composition fps */
export const f24 = (f: number, fps: number) => Math.round((f * fps) / 24);

/** Flat lemon box with cap-trimmed lines inside: the hook / label look. `pad` is above the first cap and under the last baseline. */
export const LemonBox: React.FC<{ cy: number; w: number; padY: number; padX?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ cy, w, padY, padX = 70, color = SHORT_LEMON, children, style }) => (
  <div style={{ position: "absolute", left: (SHORT_W - w) / 2, top: cy, width: w, transform: "translateY(-50%)", boxSizing: "border-box", padding: `${padY}px ${padX}px`, background: color, textAlign: "center", ...style }}>
    <div style={{ ...capTrim }}>{children}</div>
  </div>
);

/** Full-bleed photo, cropped on `focus` (0..1 of the source), with the slow move of §7c2: pull-out 6 %, push 6 % or ~100 px drift. */
export const Bleed: React.FC<{ ctx: RecipeCtx; src?: string; focus?: { x: number; y: number }; move?: "pullOut" | "push" | "drift"; amount?: number; style?: React.CSSProperties }> = ({ ctx, src, focus = { x: 0.5, y: 0.5 }, move = "pullOut", amount = 0.06, style }) => {
  const g = useDrawingFrame();
  if (isMissing(ctx, src)) {
    warnOnce(`asset missing: ${src ?? "(no src)"}: placeholder drawn`);
    return <Placeholder label={src ?? "no asset"} w={SHORT_W} h={SHORT_H} />;
  }
  const t = Math.min(1, g / Math.max(1, ctx.dur));
  const s = move === "pullOut" ? 1 + amount * (1 - t) : move === "push" ? 1 + amount * t : 1 + amount; // drift is cropped a little so the travel stays inside the picture
  const drift = move === "drift" ? (t - 0.5) * 100 : 0; // ≈ 100 px over the shot
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <Img src={staticFile(src!)} style={{ position: "absolute", inset: 0, width: SHORT_W, height: SHORT_H, objectFit: "cover", objectPosition: `${focus.x * 100}% ${focus.y * 100}%`, transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`, transform: `translateX(${drift}px) scale(${s})` }} />
    </div>
  );
};

/** Ground of every portrait recipe: the look's paper over the whole 1080×1920 frame.
 *  (`RecipeFrame`'s own "theme" ground draws `Paper` at its landscape default size, so only the top 1080 px of a portrait frame get paper.) */
export const ShortFrame: React.FC<{ seed: string; children: React.ReactNode }> = ({ seed, children }) => (
  <RecipeFrame seed={seed} ground="none">
    <div style={{ position: "absolute", inset: 0 }}>
      <Paper seed={seed} width={SHORT_W} height={SHORT_H} />
    </div>
    {children}
  </RecipeFrame>
);
