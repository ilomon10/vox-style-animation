import React from "react";
import { KineticWord } from "../earworm";
import { RecipeFrame, SafePhoto, Unfold, ev, type RecipeProps } from "./shared";

export type CollageItem = { src?: string; x?: number; y?: number; w?: number; h?: number; rotate?: number; hinge?: "top" | "bottom" | "left" | "right"; at?: number };
export type PhotoCollageUnfoldProps = { items: CollageItem[]; /** keyword on the collage, pops at event `title` */ title?: string };

/** six default slots (design px) for items without x/y */
const SLOTS = [
  { x: 150, y: 90, w: 560, h: 420, rotate: -2 }, { x: 760, y: 150, w: 480, h: 640, rotate: 1.5 }, { x: 1290, y: 80, w: 520, h: 400, rotate: 2 },
  { x: 220, y: 560, w: 460, h: 380, rotate: 1 }, { x: 1250, y: 540, w: 560, h: 420, rotate: -1.5 }, { x: 740, y: 720, w: 440, h: 300, rotate: 2.5 },
];

/** Recipe "photo collage unfold" (Earworm A shot 1/2): torn B/W prints unfold one by one from alternating hinges, each on its own anchor (`items[].at`, default every 5 f). Events: `title`. */
export const PhotoCollageUnfold: React.FC<RecipeProps<PhotoCollageUnfoldProps>> = ({ ctx, items, title }) => (
  <RecipeFrame seed={ctx.seed}>
    {items.map((it, i) => {
      const s = { ...SLOTS[i % SLOTS.length], ...Object.fromEntries(Object.entries(it).filter(([, v]) => v !== undefined)) } as Required<Pick<CollageItem, "x" | "y" | "w" | "h">> & CollageItem;
      return (
        <Unfold key={i} at={it.at ?? i * 5} hinge={it.hinge ?? (["bottom", "left", "right", "top"] as const)[i % 4]} style={{ left: s.x, top: s.y, width: s.w, height: s.h }}>
          <SafePhoto ctx={ctx} src={it.src} x={0} y={0} width={s.w} height={s.h} rotate={s.rotate} seed={`${ctx.seed}-i${i}`} />
        </Unfold>
      );
    })}
    {title && <KineticWord text={title} delay={ev(ctx, "title", items.length * 5 + 4)} x={960} y={540} glitch="rgb" seed={`${ctx.seed}-t`} />}
  </RecipeFrame>
);
