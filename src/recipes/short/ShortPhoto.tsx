import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { CornerTag } from "../../type/CornerTag";
import { useDrawingFrame } from "../../lib/time";
import { voxLight } from "../../tokens/colors";
import { SHADOWS } from "../../tokens/finish";
import { typeStyle, voxLightType } from "../../tokens/type";
import { prog } from "../../type/shared";
import { Placeholder, ev, isMissing, warnOnce, type RecipeProps } from "../shared";
import { Bleed, LABEL_SLOT_Y, LemonBox, SHORT_H, SHORT_W, f24, popScale, shortType, ShortFrame } from "./parts";

export type ShortPhotoProps = {
  /** photo (project asset) */
  src?: string;
  /** crop centre, 0..1 of the picture (the subject) */
  focus?: { x: number; y: number };
  /** slow move over the whole shot: "pullOut" (default, 6 % → 1.0), "push", "drift" (≈ 100 px) */
  move?: "pullOut" | "push" | "drift";
  /** Vox name label (§7c4): hard on `at` (default ≤ 1.2 s after the cut: event `label`, 5 f), hard off with the scene (= the next cut) */
  label?: { name: string; role?: string; at?: number; /** "lower" (centre y 1450, eyes ≤ 0.35 H) or "upper" (y 300) */ slot?: "lower" | "upper"; /** box width, 600-864 (default 864) */ w?: number };
  /** paired images (§7c7): two stacked near-square cards on the paper (no full-bleed photo unless `src` is given); the second pops in on its `at` (events `card0`, `card1`) */
  cards?: { src?: string; at?: number }[];
  /** big number beat: counts up over 14 f from `at` (event `counter`), flat lemon box, number Roboto 900 + short label. `y` = box centre (default 620) */
  counter?: { value: number; suffix?: string; prefix?: string; label?: string; at?: number; y?: number };
  /** footage credit (§7c8): white text rotated 90° CCW at x ≈ 85, mid-height */
  credit?: string;
  /** corner source tag (§7c8), top-left, inset 6 px */
  tag?: string;
};

const CARD_W = 820;
const CARD_H = 860;
const CARD_X = (SHORT_W - CARD_W) / 2;
const CARD_Y = [48, 963]; // §7c7

const Card: React.FC<{ ctx: RecipeProps<ShortPhotoProps>["ctx"]; src?: string; y: number; at: number }> = ({ ctx, src, y, at }) => {
  const g = useDrawingFrame();
  if (g < at) return null;
  const s = popScale(g - at, ctx.fps);
  const missing = isMissing(ctx, src);
  if (missing) warnOnce(`asset missing: ${src ?? "(no src)"}: placeholder drawn`);
  return (
    <div style={{ position: "absolute", left: CARD_X, top: y, width: CARD_W, height: CARD_H, transform: `scale(${s})`, filter: SHADOWS.printContact, background: voxLight.page }}>
      {missing ? <Placeholder label={src ?? "no asset"} w={CARD_W} h={CARD_H} /> : <Img src={staticFile(src!)} style={{ width: CARD_W, height: CARD_H, objectFit: "cover" }} />}
    </div>
  );
};

/**
 * Recipe "short photo" (analysis/vox-shorts.md §7c2-4, 7, 8): full-bleed photo crop on the subject with a slow move, plus the optional Vox name label,
 * two stacked cards, a counter, a vertical credit or a corner tag. Everything on screen is hard on / hard off (no fades).
 * Events: label, card0, card1, counter.
 */
export const ShortPhoto: React.FC<RecipeProps<ShortPhotoProps>> = ({ ctx, src, focus, move = "pullOut", label, cards, counter, credit, tag }) => {
  const raw = useCurrentFrame(); // label and tag are hard on / off (ones)
  const g = useDrawingFrame();
  const labelAt = label?.at ?? ev(ctx, "label", f24(5, ctx.fps));
  const cAt = counter ? counter.at ?? ev(ctx, "counter", 6) : 0;
  const cp = counter ? prog(g, cAt, 14, "enter") : 0;
  const slot = label?.slot ?? "lower";
  return (
    <ShortFrame seed={ctx.seed}>
      {src || !cards?.length ? <Bleed ctx={ctx} src={src} focus={focus} move={move} /> : null}
      {cards?.map((c, i) => <Card key={i} ctx={ctx} src={c.src} y={CARD_Y[i] ?? CARD_Y[1]} at={c.at ?? ev(ctx, `card${i}`, i ? 24 : 0)} />)}
      {counter && g >= cAt ? (
        <LemonBox cy={counter.y ?? 620} w={864} padY={44} padX={40}>
          <div style={{ ...shortType.heavy, fontSize: 250, lineHeight: "250px", color: "#000", fontVariantNumeric: "tabular-nums lining-nums" }}>
            {counter.prefix ?? ""}{Math.round(counter.value * cp).toLocaleString("en-US")}{counter.suffix ?? ""}
          </div>
          {counter.label ? <div style={{ ...shortType.labelRole, marginTop: 40 }}>{counter.label}</div> : null}
        </LemonBox>
      ) : null}
      {label && raw >= labelAt ? (
        <LemonBox cy={LABEL_SLOT_Y[slot]} w={label.w ?? 864} padY={47} padX={40}>
          <div style={shortType.labelName}>{label.name}</div>
          {label.role ? <div style={shortType.labelRole}>{label.role}</div> : null}
        </LemonBox>
      ) : null}
      {credit ? (
        <div style={{ position: "absolute", left: 85, top: SHORT_H / 2, transform: "translate(-50%, -50%) rotate(-90deg)", whiteSpace: "nowrap", ...typeStyle({ ...voxLightType.small, cap: 20, color: "#FFFFFF", leading: 1 }), textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>{credit}</div>
      ) : null}
      {tag ? <CornerTag text={tag} x={6} y={6} /> : null}
    </ShortFrame>
  );
};
