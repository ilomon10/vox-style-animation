import React, { useId } from "react";
import { staticFile } from "remotion";
import { rand } from "../lib/random";
import { SHADOWS } from "../tokens/finish";

/** Placement shared by every collage object: design px at 1080p, top-left origin, rotation about the centre. */
export type Place = {
  /** left edge, design px */
  x?: number;
  /** top edge, design px */
  y?: number;
  /** degrees, clockwise, about the object centre */
  rotate?: number;
  /** escape hatch merged last */
  style?: React.CSSProperties;
};

export const placeStyle = (
  p: Place,
  width: number,
  height: number,
): React.CSSProperties => ({
  position: "absolute",
  left: p.x ?? 0,
  top: p.y ?? 0,
  width,
  height,
  transform: p.rotate ? `rotate(${p.rotate}deg)` : undefined,
  transformOrigin: "50% 50%",
  ...p.style,
});

/** A valid SVG/CSS fragment id (React's useId contains colons). */
export const useSvgId = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

/** Resolve a SHADOWS key or a raw CSS filter string. */
export const resolveShadow = (s?: keyof typeof SHADOWS | string): string | undefined =>
  s === undefined ? undefined : s in SHADOWS ? SHADOWS[s as keyof typeof SHADOWS] : s;

export type Pt = readonly [number, number];
export const toPolygon = (pts: readonly Pt[]) =>
  `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(",")})`;
export const toPoints = (pts: readonly Pt[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** Sutherland–Hodgman: keep the part of `poly` where a*x + b*y >= c. */
export const clipHalfPlane = (poly: readonly Pt[], a: number, b: number, c: number): Pt[] => {
  const out: Pt[] = [];
  const d = (p: Pt) => a * p[0] + b * p[1] - c;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const dp = d(p);
    const dq = d(q);
    if (dp >= 0) out.push(p);
    if (dp >= 0 !== dq >= 0) {
      const t = dp / (dp - dq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
};

/** Seeded jagged edge along a straight run from p to q: zig-zag (alternating) or random torn. */
export const jaggedEdge = (
  seed: string,
  p: Pt,
  q: Pt,
  step: number,
  amp: number,
  mode: "zigzag" | "torn",
): Pt[] => {
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const n = Math.max(2, Math.round(len / step));
  const nx = -(q[1] - p[1]) / len;
  const ny = (q[0] - p[0]) / len;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const o = mode === "zigzag" ? (i % 2 ? amp : -amp) : (rand(`${seed}-${i}`) * 2 - 1) * amp;
    const jt = mode === "torn" ? (rand(`${seed}-t${i}`) - 0.5) * (1 / n) * 0.6 : 0;
    const tt = Math.min(0.999, Math.max(0, t + jt));
    pts.push([p[0] + (q[0] - p[0]) * tt + nx * o, p[1] + (q[1] - p[1]) * tt + ny * o]);
  }
  return pts;
};

/** "assets/x.png" (relative to public/) → staticFile URL; absolute URLs and data URIs pass through. */
export const resolveSrc = (src: string) =>
  /^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src);

export type Tone = "none" | "bw" | "warmBW" | "duotone";

/** CSS filter functions for the grayscale tones (duotone needs an SVG filter, see CutOut). */
export const toneCss = (tone: Tone | undefined): string =>
  tone === "bw"
    ? "grayscale(1) contrast(1.35) brightness(0.95)"
    : tone === "warmBW"
      ? "grayscale(1) sepia(0.32) contrast(1.2) brightness(0.97)"
      : "";

export const hexToRgb01 = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
};

/** Stand-alone duotone SVG filter definition (luma → [shadow, highlight]); reference as filter: url(#id). */
export const DuotoneDef: React.FC<{ id: string; colors: readonly [string, string] }> = ({ id, colors }) => {
  const [a, b] = colors.map(hexToRgb01);
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values=".299 .587 .114 0 0  .299 .587 .114 0 0  .299 .587 .114 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={`${a[0]} ${b[0]}`} />
            <feFuncG type="table" tableValues={`${a[1]} ${b[1]}`} />
            <feFuncB type="table" tableValues={`${a[2]} ${b[2]}`} />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};
