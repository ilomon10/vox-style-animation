import React from "react";
import { Multiplane, type CraneKey, type MultiplaneLayer } from "../earworm/fx";
import { earwormType, typeStyle } from "../tokens/type";
import { capTrim } from "../type/shared";
import { RecipeFrame, SafeCutout, SafePhoto, type RecipeProps } from "./shared";

export type CraneItem = { src?: string; /** alpha PNG: drawn as a cut-out without the torn print border */ cutout?: boolean; w?: number; h?: number; x?: number; speed?: number; rotate?: number; label?: string; /** anchor: the camera is centred on this item at this word */ at: number };
export type MontageCraneProps = { items: CraneItem[]; /** dolly toward the last item (0 = none, ~0.3 blows the near layers off frame) */ dolly?: number };

/** Recipe "montage crane" (Earworm C): ONE camera tilt down through a stack of cut-outs at different depths; each item is keyed to a noun (`items[].at`), the camera crosses it as the word is spoken. */
export const MontageCrane: React.FC<RecipeProps<MontageCraneProps>> = ({ ctx, items, dolly = 0 }) => {
  const ys = items.map((_, i) => 540 + i * 640);
  const layers: MultiplaneLayer[] = items.map((it, i) => {
    const w = it.w ?? 640;
    const h = it.h ?? 480;
    const speed = it.speed ?? [1.5, 1, 2, 1.2][i % 4];
    // When the camera sits on this item (cam.x = 960, no dolly) Multiplane draws its centre at 960 + (x - 960) * speed and
    // its width at w * speed: near layers get pushed toward the edges. Keep the print (and its left-aligned label) inside a
    // 40 px margin at its own key; items that already fit are unchanged.
    const want = it.x ?? 700 + (i % 2) * 520;
    const half = (w * speed) / 2;
    const sx = half * 2 + 80 >= 1920 ? 960 : Math.min(1880 - half, Math.max(40 + half, 960 + (want - 960) * speed));
    return {
      x: 960 + (sx - 960) / speed, y: ys[i], speed, rot: it.rotate ?? ((i % 3) - 1) * 2, w, h,
      node: (
        <div style={{ position: "relative", width: w, height: h }}>
          {it.cutout ? <SafeCutout ctx={ctx} src={it.src} x={0} y={0} w={w} h={h} /> : <SafePhoto ctx={ctx} src={it.src} x={0} y={0} width={w} height={h} seed={`${ctx.seed}-m${i}`} />}
          {it.label && <div style={{ position: "absolute", left: 0, top: h + 28, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.annotation, cap: 34 }) }}>{it.label}</div>}
        </div>
      ),
    };
  });
  const keys: CraneKey[] = [];
  items.forEach((it, i) => {
    const prev = keys.length ? keys[keys.length - 1].at : -8;
    keys.push({ at: Math.max(it.at, prev + 8), y: ys[i], ease: "pushSoft", dolly: i === items.length - 1 ? dolly : 0 });
  });
  if (keys.length === 1) keys.unshift({ at: 0, y: ys[0] - 200 });
  return <RecipeFrame seed={ctx.seed}><Multiplane layers={layers} keys={keys} background="transparent" /></RecipeFrame>;
};
