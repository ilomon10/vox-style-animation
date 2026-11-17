import { random } from "remotion";

/**
 * Deterministic randomness. NEVER use Math.random() in a composition: every frame may be
 * rendered in a different browser tab, so values must be a pure function of (seed, inputs).
 */
export const rand = (seed: string | number) => random(seed);

/** uniform in [min, max) */
export const randRange = (seed: string | number, min: number, max: number) =>
  min + (max - min) * random(seed);

/** symmetric jitter in [-amp, +amp] */
export const jitter = (seed: string | number, amp: number) => (random(seed) * 2 - 1) * amp;

/** pick one element */
export const pick = <T,>(seed: string | number, items: readonly T[]): T =>
  items[Math.floor(random(seed) * items.length) % items.length];

/** Mulberry32 PRNG for bulk procedural generation (canvas textures etc.). */
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Stable 32-bit hash of a string (for deriving numeric seeds). */
export const hashSeed = (s: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
