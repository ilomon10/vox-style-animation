import React from "react";
import { staticFile } from "remotion";
import { rand } from "../lib/random";
import { useSvgId } from "../collage/util";
import { tex } from "../effects/shared";

/** smoothstep value-noise in [-1,1] along a 1-D path (lattice spacing `lat` px) + per-point jitter. */
export const ragged = (seed: string, s: number, lat = 40, jit = 0.35): number => {
  const k = Math.floor(s / lat);
  const t = (s - k * lat) / lat;
  const v = (i: number) => rand(`${seed}-lat-${i}`) * 2 - 1;
  const sm = t * t * (3 - 2 * t);
  const base = v(k) * (1 - sm) + v(k + 1) * sm;
  return Math.max(-1, Math.min(1, base * (1 - jit) + (rand(`${seed}-j-${Math.round(s)}`) * 2 - 1) * jit));
};

/**
 * Torn paper border as a polygon around a `w×h` photo. The tear is ragged: border width = `border ± rough`
 * (measured 6–20 px, analysis/earworm-B.md §6 / earworm-C.md §6). The polygon lives in a box padded by
 * `border + rough` on every side; returns SVG `points`.
 */
export const tornRectPoints = (w: number, h: number, seed: string, border: number, rough: number, step = 9): string => {
  const pad = border + rough;
  const pts: [number, number][] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number, off: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(2, Math.round(len / step));
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const o = border + ragged(seed, off + t * len) * rough;
      pts.push([x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o]);
    }
  };
  // photo rect occupies (pad, pad)–(pad+w, pad+h); outward normals
  edge(pad, pad, pad + w, pad, 0, -1, 0);
  edge(pad + w, pad, pad + w, pad + h, 1, 0, 2000);
  edge(pad + w, pad + h, pad, pad + h, 0, 1, 4000);
  edge(pad, pad + h, pad, pad, -1, 0, 6000);
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
};

/** Torn border around a circle of diameter `d` (box padded by border + rough). */
export const tornCirclePoints = (d: number, seed: string, border: number, rough: number): string => {
  const pad = border + rough;
  const r = d / 2;
  const n = Math.max(24, Math.round((Math.PI * d) / 9));
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    // periodic noise: sample arc length on a circle; wrap by blending the seam
    const s = (i / n) * Math.PI * d;
    const o = border + ragged(seed, s) * rough;
    out.push(`${(pad + r + Math.cos(a) * (r + o)).toFixed(1)},${(pad + r + Math.sin(a) * (r + o)).toFixed(1)}`);
  }
  return out.join(" ");
};

/**
 * Flat-colour box with a torn (turbulence-displaced) edge: the filter acts on the background layer only, so
 * text children stay crisp. Used for charcoal label strips and black tape (analysis/earworm-C.md §6).
 */
export const TornBox: React.FC<{
  width: number;
  height: number;
  color: string;
  seed: string;
  /** displacement scale in px (edge roughness ≈ ±scale/2) */
  rough?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ width, height, color, seed, rough = 9, style, children }) => {
  const id = useSvgId("tb");
  const sd = Math.floor(rand(seed) * 1000);
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id={id} x="-6%" y="-40%" width="112%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.09" numOctaves={2} seed={sd} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={rough} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, background: color, filter: `url(#${id})` }} />
      {children}
    </div>
  );
};

/** Letterpress distress: white specks / scratches punched out of glyph fills (mask-image, 1 tex px per design px). */
export const distressMask = (seedShiftX = 0, seedShiftY = 0): React.CSSProperties => ({
  WebkitMaskImage: `url(${tex("earworm_distress.png")})`,
  maskImage: `url(${tex("earworm_distress.png")})`,
  WebkitMaskSize: "1024px 1024px",
  maskSize: "1024px 1024px",
  WebkitMaskPosition: `${-seedShiftX}px ${-seedShiftY}px`,
  maskPosition: `${-seedShiftX}px ${-seedShiftY}px`,
});

export const earwormTex = (f: string) => staticFile(`textures/${f}`);

/** seeded random letter from a pool */
export const randGlyph = (seed: string, pool: string) => pool[Math.floor(rand(seed) * pool.length) % pool.length];
