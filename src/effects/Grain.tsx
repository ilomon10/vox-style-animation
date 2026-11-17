import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useStage } from "../lib/stage";
import { drawingIndex } from "../lib/time";
import { rand } from "../lib/random";
import { tex, usePreload } from "./shared";

export type GrainBlend = "hard-light" | "overlay" | "soft-light";

export type GrainProps = {
  /** target std-dev of the added noise, 8-bit levels (measured: dracula 3.4, vox 2.7, porsche 0.6) */
  sigma: number;
  /** particle size in design px (≈ 2 × measured autocorrelation half-width) */
  sizePx: number;
  /** re-seeds per second: 0 = static, 12 = every drawing (on twos at 24 fps), 6 = hold boil */
  rate: number;
  seed?: string;
  /** CSS blend mode of the noise layer. hard-light is the default: its added std-dev is almost
   *  independent of the base tone (see calibration), unlike overlay / soft-light. */
  blend?: GrainBlend;
  style?: React.CSSProperties;
};

/**
 * CALIBRATION (sigma → opacity). Noise tiles are grain_0…7.png: 1024² px, mean 128, std 40 levels,
 * gaussian-blurred white noise (σ_blur 0.5 px → autocorrelation half-width ≈ 0.83 px), tileable.
 * With the layer at opacity α the achieved std-dev of the change on a flat base of tone L is
 *     σ_out = α · G_blend(L) · K
 * G (std of blend(L, tile) for α = 1, computed from the CSS blend formulas on the real tile):
 *     hard-light  L = .15 / .3 / .5 / .7 / .85  →  43.6 / 41.2 / 39.9 / 40.9 / 43.1  (≈ 41, flat)
 *     overlay                                      →  12.0 / 24.0 / 39.9 / 24.0 / 12.0  (mid-tones only)
 *     soft-light                                   →  14.7 / 18.3 / 18.3 / 13.9 /  8.1
 * hence α = σ / (G_ref · K) with G_ref = GAIN[blend] (hard-light 41, overlay 40 @ mid-grey, soft-light 18).
 * K = 0.78: the loss from re-sampling the tile to the requested particle size + 8-bit rounding, measured on
 * rendered stills of flat grey 128 and paper 216, 1080p AND 4K (identical): requested σ 3.4 / 2.7 / 8 gave
 * 3.38 / 2.76 / 8.0 (grey) and 3.40 / 2.74 / 8.5 (paper) after calibration; σ 0.6 gives 0.47–0.69 (quantisation). hard-light also shifts the mean towards
 * mid-grey by ≈ α·22 levels at L = .15/.85 (≈ 1.8 levels at α .08) — negligible next to the grain.
 */
const TILE = 1024;
const TILE_COUNT = 8;
const BAKED_HWHM = 0.83; // tile px
const GAIN: Record<GrainBlend, number> = { "hard-light": 41, overlay: 40, "soft-light": 18 };
/** K: measured fraction of the nominal std-dev that survives resampling + 8-bit clipping (flat grey 128 and paper 216, 1080p: 0.77–0.80). */
const KAPPA = 0.78;

/** scale between tile px and output px so that the grain's HWHM equals sizePx/2 design px */
const tileScale = (sizePx: number, u: number) => Math.max(0.7, (sizePx * u) / 2 / BAKED_HWHM);

export const grainOpacity = (sigma: number, blend: GrainBlend = "hard-light") =>
  Math.min(1, sigma / (GAIN[blend] * KAPPA));

export const Grain: React.FC<GrainProps> = ({ sigma, sizePx, rate, seed = "grain", blend = "hard-light", style }) => {
  const frame = useCurrentFrame(); // grain re-seeds on the film clock (rate), not the artwork clock
  const { u, fps } = useStage();
  usePreload(Array.from({ length: TILE_COUNT }, (_, i) => tex(`grain_${i}.png`)));
  const idx = rate ? drawingIndex(frame, fps, rate) : 0;
  const tile = Math.floor(rand(`${seed}-tile-${idx}`) * TILE_COUNT);
  const size = TILE * tileScale(sizePx, u);
  const ox = Math.floor(rand(`${seed}-ox-${idx}`) * size);
  const oy = Math.floor(rand(`${seed}-oy-${idx}`) * size);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${tex(`grain_${tile}.png`)})`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${-ox}px ${-oy}px`,
        mixBlendMode: blend,
        opacity: grainOpacity(sigma, blend),
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
