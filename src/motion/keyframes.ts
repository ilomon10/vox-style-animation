import { useCurrentFrame } from "remotion";
import { CurveName, ease } from "../tokens/easing";
import { useDrawingFrame } from "../lib/time";

/** A token curve name or any 0..1 → 0..1 function. */
export type EaseSpec = CurveName | ((t: number) => number);

/**
 * One keyframe. `ease` shapes the segment that ARRIVES at this key (previous key → this key),
 * so `{at: 0, …}, {at: 32, …, ease: "push"}` reads "push to here over 32 frames".
 */
export type Key<T> = { at: number; value: T; ease?: EaseSpec };

export type KeyOptions = {
  /** interpolate the `scale` field in log space (zooms feel constant-rate; crash zoom needs it) */
  logScale?: boolean;
};

const resolve = (e?: EaseSpec) => (typeof e === "function" ? e : ease(e ?? "linear"));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const mix = (a: number, b: number, t: number, log: boolean) =>
  log && a > 0 && b > 0 ? Math.exp(lerp(Math.log(a), Math.log(b), t)) : lerp(a, b, t);

/**
 * Per-segment interpolated value at `frame` (frames relative to the enclosing sequence),
 * clamped to the first/last key. `T` is a number or a flat record of numbers
 * (`{x, y, scale, rotate}`); record fields are interpolated independently.
 */
export function keyframes<T extends number | Record<string, number>>(
  keys: readonly Key<T>[],
  frame: number,
  opts: KeyOptions = {},
): T {
  const ks = [...keys].sort((p, q) => p.at - q.at);
  if (frame <= ks[0].at) return ks[0].value;
  const last = ks[ks.length - 1];
  if (frame >= last.at) return last.value;
  let i = 0;
  while (i < ks.length - 2 && frame >= ks[i + 1].at) i++;
  const a = ks[i];
  const b = ks[i + 1];
  const span = b.at - a.at;
  const t = span <= 0 ? 1 : resolve(b.ease)((frame - a.at) / span);
  if (typeof a.value === "number") return lerp(a.value, b.value as number, t) as T;
  const out: Record<string, number> = {};
  const av = a.value as Record<string, number>;
  const bv = b.value as Record<string, number>;
  for (const k of Object.keys(av)) {
    out[k] = k in bv ? mix(av[k], bv[k], t, !!opts.logScale && k === "scale") : av[k];
  }
  return out as T;
}

/** Hook form. Stepped to the drawing rate by default; pass `stepped: false` for on-ones motion. */
export const useKeyframes = <T extends number | Record<string, number>>(
  keys: readonly Key<T>[],
  opts: KeyOptions & { stepped?: boolean } = {},
): T => {
  const drawn = useDrawingFrame();
  const raw = useCurrentFrame();
  return keyframes(keys, opts.stepped === false ? raw : drawn, opts);
};
