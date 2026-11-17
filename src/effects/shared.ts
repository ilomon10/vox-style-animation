import { createContext, useState, useEffect } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { rand } from "../lib/random";

/** "#rrggbb" -> [r, g, b] 0..255 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

/** standard normal from two seeded uniforms (Box–Muller); deterministic in (seed) */
export const gaussian = (seed: string): number => {
  const u1 = Math.max(1e-6, rand(`${seed}-a`));
  const u2 = rand(`${seed}-b`);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
};

export const tex = (file: string) => staticFile(`textures/${file}`);

/**
 * Gradient stops approximating alpha(r) = max · r^power for r in 0..1 (r = distance / radius),
 * as a CSS colour-stop list. 32 stops keep the power curve smooth.
 */
export const powerStops = (max: number, power: number, rgb: (alpha: number) => string, steps = 32): string => {
  const out: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const r = i / steps;
    out.push(`${rgb(max * Math.pow(r, power))} ${(r * 100).toFixed(2)}%`);
  }
  return out.join(", ");
};

const loaded = new Set<string>();

/**
 * Holds the render until every url is decoded into the browser cache (CSS background images are not
 * awaited by Remotion; <Img> is). Cached per tab, so only the first frame ever waits.
 */
export const usePreload = (urls: readonly string[]) => {
  const key = urls.join("|");
  const [handle] = useState(() => (urls.every((u) => loaded.has(u)) ? null : delayRender(`preload ${key}`)));
  useEffect(() => {
    if (handle === null) return;
    let left = urls.length;
    const done = () => {
      if (--left === 0) {
        urls.forEach((u) => loaded.add(u));
        continueRender(handle);
      }
    };
    urls.forEach((u) => {
      const im = new Image();
      im.onload = done;
      im.onerror = done;
      im.src = u;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, key]);
};

/** Output levels of the enclosing <FilmFinish> (undefined = none). <Paper> reads it to pre-compensate its colour. */
export const FinishLevelsContext = createContext<{ black: string; white: string } | undefined>(undefined);

/** inverse of the levels map for one colour: the pre-levels colour that comes out as `hex` */
export const invertLevels = (hex: string, lv: { black: string; white: string }): string => {
  const c = hexToRgb(hex);
  const b = hexToRgb(lv.black);
  const w = hexToRgb(lv.white);
  const h = c.map((v, i) => Math.round(Math.max(0, Math.min(255, ((v - b[i]) / (w[i] - b[i])) * 255))));
  return "#" + h.map((v) => v.toString(16).padStart(2, "0")).join("");
};
