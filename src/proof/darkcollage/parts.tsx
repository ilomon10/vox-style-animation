import React from "react";
import { mulberry32 } from "../../lib/random";
import { useDrawingFrame } from "../../lib/time";
import { ease } from "../../tokens/easing";

/** Shows children from drawing-frame `at` on (hard appearance, no fade). */
export const AtFrame: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useDrawingFrame();
  return f >= at ? <>{children}</> : null;
};

/** Secondary action: after landing the piece tips over about its bottom corner (ease-in, abrupt stop). */
export const Tip: React.FC<{
  at: number;
  duration: number;
  degrees: number;
  origin?: string;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ at, duration, degrees, origin = "100% 100%", width, height, children }) => {
  const f = useDrawingFrame();
  const p = ease("exit")(Math.min(1, Math.max(0, (f - at) / duration)));
  return <div style={{ position: "relative", width, height, transform: `rotate(${degrees * p}deg)`, transformOrigin: origin }}>{children}</div>;
};

/** Procedural damask tile: mirrored lobed motif + diagonal lattice, wine tones (#462528 family). */
const DamaskTile: React.FC<{ id: string; base: string; hi: string; lo: string; transform: string }> = ({ id, base, hi, lo, transform }) => {
  const motif = (
    <g>
      <path d="M0 -62 C26 -40 30 -10 0 16 C-30 -10 -26 -40 0 -62Z" fill={hi} />
      <path d="M0 -40 C12 -28 12 -12 0 2 C-12 -12 -12 -28 0 -40Z" fill={lo} />
      <path d="M0 18 C34 4 62 14 66 38 C46 30 24 34 0 62 C-24 34 -46 30 -66 38 C-62 14 -34 4 0 18Z" fill={hi} />
      <path d="M0 30 C20 22 38 26 46 38 C30 36 14 40 0 52 C-14 40 -30 36 -46 38 C-38 26 -20 22 0 30Z" fill={lo} />
      <circle cx="0" cy="-70" r="6" fill={hi} />
    </g>
  );
  return (
    <pattern id={id} width="160" height="200" patternUnits="userSpaceOnUse" patternTransform={transform}>
      <rect width="160" height="200" fill={base} />
      <g transform="translate(80 100)">{motif}</g>
      <g>{motif}</g>
      <g transform="translate(160 0)">{motif}</g>
      <g transform="translate(0 200)">{motif}</g>
      <g transform="translate(160 200)">{motif}</g>
      <path d="M0 100 L80 0 L160 100 L80 200Z" fill="none" stroke={lo} strokeWidth="3" opacity="0.8" />
    </pattern>
  );
};

const STRIPS = 30;
/**
 * Crimson damask carpet in perspective, pure 2D (a CSS-3D carpet z-sorts above later siblings in Chrome):
 * horizontal strips whose pattern scale grows linearly with distance from the horizon, trapezoid to the frame bottom.
 */
export const DamaskCarpet: React.FC<{ top?: number }> = ({ top = 820 }) => {
  const horizon = top - 330;
  const strips = Array.from({ length: STRIPS }, (_, i) => {
    const t0 = i / STRIPS;
    const t1 = (i + 1) / STRIPS;
    const y0 = top + (1080 - top) * t0;
    const y1 = top + (1080 - top) * t1 + 1;
    const s = (((y0 + y1) / 2 - horizon) / 330) * 0.9;
    return { y0, h: y1 - y0, s, i };
  });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        {strips.map(({ s, i, y0 }) => (
          <DamaskTile key={i} id={`dmk${i}`} base="#5C2128" hi="#772F35" lo="#43181D" transform={`translate(960 ${y0}) scale(${s} ${s * 0.42})`} />
        ))}
        <linearGradient id="dmkShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <clipPath id="dmkClip">
          <polygon points={`330,${top} 1890,${top} 2000,1080 -80,1080`} />
        </clipPath>
      </defs>
      <g clipPath="url(#dmkClip)">
        {strips.map(({ y0, h, i }) => (
          <rect key={i} x={-100} y={y0} width={2200} height={h} fill={`url(#dmk${i})`} />
        ))}
        <rect x={-100} y={top} width={2200} height={1080 - top} fill="url(#dmkShade)" />
      </g>
    </svg>
  );
};

/** Gothic arch path (width w, spring height r) from (0,h) base. */
export const archPath = (w: number, h: number) =>
  `M0 ${h} L0 ${w * 0.55} C0 ${w * 0.25} ${w * 0.3} ${w * 0.08} ${w / 2} 0 C${w * 0.7} ${w * 0.08} ${w} ${w * 0.25} ${w} ${w * 0.55} L${w} ${h}Z`;

/** Static gray stone wall: seeded bricks in 4C4A49–817E7C greys. */
export const StoneWall: React.FC = () => {
  const r = mulberry32(77);
  const bricks: React.ReactNode[] = [];
  const rowH = 96;
  for (let row = 0; row < 12; row++) {
    let x = -(r() * 120);
    while (x < 1920) {
      const w = 150 + r() * 130;
      const g = Math.round(72 + r() * 46);
      bricks.push(
        <rect key={`${row}-${x}`} x={x + 3} y={row * rowH + 3} width={w - 6} height={rowH - 6} rx={9} fill={`rgb(${g + 2},${g},${g - 3})`} />,
      );
      x += w;
    }
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect width={1920} height={1080} fill="#1A1918" />
      {bricks}
    </svg>
  );
};

/** Seeded star field, hard white dots. */
export const Stars: React.FC<{ w: number; h: number; n?: number }> = ({ w, h, n = 90 }) => {
  const r = mulberry32(19);
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={r() * w} cy={r() * h} r={1.2 + r() * 3.2} fill="#D8D5D0" opacity={0.55 + r() * 0.45} />
      ))}
    </>
  );
};

/** Jagged lightning bolt polygon-line (design px, from top). */
export const BoltArt: React.FC<{ x: number; seed?: number }> = ({ x, seed = 3 }) => {
  const r = mulberry32(seed);
  let px = x;
  const pts: string[] = [`${px},0`];
  for (let y = 60; y <= 620; y += 60) {
    px += (r() - 0.5) * 110;
    pts.push(`${px},${y}`);
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <polyline points={pts.join(" ")} fill="none" stroke="#F4F1EA" strokeWidth={7} strokeLinejoin="miter" />
      <polyline points={pts.join(" ")} fill="none" stroke="#B8B6B1" strokeWidth={16} opacity={0.45} />
    </svg>
  );
};
