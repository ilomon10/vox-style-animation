import React from "react";
import { Img, staticFile } from "remotion";
import { rand } from "../../lib/random";

/** B&W stand-ins for the instrument cut-outs of the segment C crane (generated SVG: no scans, no third-party art). */
export const BW = "grayscale(1) contrast(1.12)";
/** cheap torn-white outline (no SVG filter: the crane draws 14 of these per drawing) */
export const OUT = "drop-shadow(0 0 1.5px #E8E8E8) drop-shadow(0 0 1px #E8E8E8) drop-shadow(0 0 1px #E8E8E8)";
const svg = (w: number, h: number, vb: string, children: React.ReactNode) => (
  <svg width={w} height={h} viewBox={vb} style={{ position: "absolute", filter: OUT }}>{children}</svg>
);

const Keys: React.FC<{ x: number; y: number; w: number; h: number; n: number }> = ({ x, y, w, h, n }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#F2F2F0" stroke="#333" strokeWidth={2} />
    {Array.from({ length: n }, (_, i) => <rect key={i} x={x + (w / n) * i} y={y} width={w / n} height={h} fill="none" stroke="#555" strokeWidth={1.5} />)}
    {Array.from({ length: n }, (_, i) => (i % 7 === 2 || i % 7 === 6 ? null : <rect key={i} x={x + (w / n) * (i + 0.68)} y={y} width={(w / n) * 0.62} height={h * 0.6} fill="#151515" />))}
  </g>
);

/** Rhodes-style stage piano on spindly legs */
export const StagePiano: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  svg(w, h, "0 0 600 300", (
    <>
      <path d="M40 270 L110 130 M520 270 L470 130" stroke="#D9D9D6" strokeWidth={9} strokeLinecap="round" />
      <rect x={10} y={60} width={580} height={90} rx={14} fill="#ECECEA" stroke="#2A2A2A" strokeWidth={3} />
      <rect x={30} y={72} width={150} height={20} fill="#222" /><rect x={200} y={76} width={360} height={14} fill="#C9C9C6" />
      <Keys x={20} y={100} w={560} h={46} n={32} />
    </>
  ));

/** suitcase-style piano seen from above, rotated by the caller */
export const SuitcasePiano: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  svg(w, h, "0 0 500 330", (
    <>
      <rect x={6} y={6} width={488} height={318} rx={16} fill="#E4E4E1" stroke="#222" strokeWidth={4} />
      <rect x={24} y={24} width={452} height={116} fill="#BDBDBA" stroke="#333" strokeWidth={2} />
      <text x={40} y={90} fontFamily="Oswald, sans-serif" fontSize={44} fill="#222" fontWeight={700}>RHODES</text>
      <Keys x={24} y={170} w={452} h={130} n={26} />
    </>
  ));

export const Synth: React.FC<{ w: number; h: number; dark?: boolean }> = ({ w, h, dark }) =>
  svg(w, h, "0 0 500 260", (
    <>
      <path d="M10 250 L40 40 L460 40 L490 250 Z" fill={dark ? "#2A2A2A" : "#E7E7E4"} stroke="#222" strokeWidth={4} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={70 + i * 28} cy={80} r={9} fill="#161616" stroke="#EEE" strokeWidth={2} />)}
      <Keys x={50} y={130} w={400} h={100} n={22} />
    </>
  ));

export const Speaker: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  svg(w, h, "0 0 300 400", (
    <>
      <rect x={6} y={6} width={288} height={388} rx={10} fill="#D8D8D5" stroke="#1E1E1E" strokeWidth={4} />
      {[110, 280].map((cy, i) => (
        <g key={i}>
          <circle cx={150} cy={cy} r={i ? 80 : 56} fill="#1A1A1A" /><circle cx={150} cy={cy} r={i ? 52 : 34} fill="#3A3A3A" /><circle cx={150} cy={cy} r={i ? 20 : 12} fill="#111" />
        </g>
      ))}
    </>
  ));

export const Reel: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  svg(w, h, "0 0 400 400", (
    <>
      <circle cx={200} cy={200} r={192} fill="#161616" stroke="#EDEDED" strokeWidth={6} />
      <circle cx={200} cy={200} r={150} fill="#7D7D7A" stroke="#222" strokeWidth={3} />
      {[0, 120, 240].map((a) => <path key={a} d={`M200 200 L${200 + 150 * Math.cos(((a - 90) * Math.PI) / 180)} ${200 + 150 * Math.sin(((a - 90) * Math.PI) / 180)}`} stroke="#222" strokeWidth={34} />)}
      <circle cx={200} cy={200} r={44} fill="#EEE" stroke="#111" strokeWidth={4} /><circle cx={200} cy={200} r={14} fill="#111" />
    </>
  ));

export const Trumpet: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  svg(w, h, "0 0 700 240", (
    <>
      <path d="M30 120 C30 40 120 30 190 60 L560 70 M30 120 C30 200 120 210 190 180 L560 160" fill="none" stroke="#BDBDBB" strokeWidth={22} strokeLinecap="round" />
      <path d="M560 70 L690 8 L690 232 L560 160 Z" fill="#CFCFCC" stroke="#222" strokeWidth={4} />
      {[290, 340, 390].map((x) => <rect key={x} x={x} y={48} width={20} height={110} rx={6} fill="#EEE" stroke="#222" strokeWidth={3} />)}
    </>
  ));

export const Guitar: React.FC<{ w: number; h: number; bass?: boolean }> = ({ w, h, bass }) =>
  svg(w, h, "0 0 700 220", (
    <>
      <rect x={250} y={bass ? 90 : 96} width={430} height={bass ? 30 : 24} fill="#2A2A2A" stroke="#DDD" strokeWidth={2} />
      <path d="M40 120 C20 40 140 30 170 80 C200 40 250 60 250 120 C250 190 190 200 160 160 C130 210 50 200 40 120 Z" fill="#E6E6E3" stroke="#1E1E1E" strokeWidth={4} />
      <circle cx={140} cy={118} r={20} fill="#151515" /><rect x={96} y={142} width={60} height={14} fill="#444" />
    </>
  ));

export const Sax: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  svg(w, h, "0 0 300 560", (
    <>
      <path d="M210 10 C190 10 190 40 200 60 L190 360 C185 480 100 520 60 470 C20 430 40 380 90 380" fill="none" stroke="#C6C6C2" strokeWidth={42} strokeLinecap="round" />
      <path d="M60 470 C20 430 40 380 90 380 L170 380" fill="none" stroke="#222" strokeWidth={4} />
      {[110, 170, 230, 290].map((y) => <circle key={y} cx={196} cy={y} r={14} fill="#EEE" stroke="#222" strokeWidth={3} />)}
    </>
  ));

const TITLES: Record<string, [string, string]> = { "MILES DAVIS": ["#C9C21E", "#161616"], "EARTH WIND & FIRE": ["#2A2A2A", "#EEE"], "HEAD HUNTERS": ["#37353A", "#D8D2B8"] };
/** square LP sleeve with a title (B&W grade applied by the caller via filter) */
export const Sleeve: React.FC<{ w: number; h: number; title: keyof typeof TITLES | string }> = ({ w, h, title }) => {
  const [bg, fg] = TITLES[title] ?? ["#555", "#EEE"];
  return svg(w, h, "0 0 400 400", (
    <>
      <rect x={4} y={4} width={392} height={392} fill={bg} stroke="#EEE" strokeWidth={6} />
      <circle cx={200} cy={240} r={92} fill="none" stroke={fg} strokeWidth={14} /><rect x={170} y={110} width={60} height={160} rx={20} fill={fg} opacity={0.8} />
      <text x={24} y={64} fontFamily="Oswald, sans-serif" fontWeight={700} fontSize={54} fill={fg}>{title}</text>
    </>
  ));
};

export const Vinyl: React.FC<{ w: number; h: number; spin?: number }> = ({ w, h, spin = 0 }) =>
  svg(w, h, "0 0 400 400", (
    <g transform={`rotate(${spin} 200 200)`}>
      <circle cx={200} cy={200} r={194} fill="#111" stroke="#E6E6E4" strokeWidth={4} />
      {[170, 140, 112].map((r) => <circle key={r} cx={200} cy={200} r={r} fill="none" stroke="#3A3A3A" strokeWidth={3} />)}
      <path d="M200 200 L330 40 A190 190 0 0 1 392 160 Z" fill="#fff" opacity={0.16} />
      <circle cx={200} cy={200} r={64} fill="#4F538A" /><circle cx={200} cy={200} r={8} fill="#111" />
      <rect x={170} y={170} width={60} height={5} fill="#C8CAEA" opacity={0.7} />
    </g>
  ));

/** indigo cable loop spanning the world (#3A4A89) */
export const Cable: React.FC<{ w: number; h: number; seed: string }> = ({ w, h, seed }) => {
  const pts = Array.from({ length: 5 }, (_, i) => [rand(`${seed}x${i}`) * w, (i / 4) * h] as const);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` C${pts[i - 1][0] + 400} ${(pts[i - 1][1] + pts[i][1]) / 2 - 300} ${pts[i][0] - 400} ${(pts[i - 1][1] + pts[i][1]) / 2 + 300} ${pts[i][0]} ${pts[i][1]}`;
  return <svg width={w} height={h} style={{ position: "absolute" }}><path d={d} fill="none" stroke="#3A4A89" strokeWidth={7} strokeLinecap="round" /></svg>;
};

/** black torn scrap, the crane's far layer */
export const Scrap: React.FC<{ w: number; h: number; seed: string; tone?: string }> = ({ w, h, seed, tone = "#1B1B1B" }) => {
  const n = 14;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 0.42 + rand(`${seed}${i}`) * 0.1;
    return `${w / 2 + Math.cos(a) * w * r},${h / 2 + Math.sin(a) * h * r}`;
  }).join(" ");
  return <svg width={w} height={h} style={{ position: "absolute" }}><polygon points={pts} fill={tone} stroke="#EAEAEA" strokeWidth={3} strokeOpacity={0.55} /></svg>;
};

/** B&W photo box (cc0 stand-ins) */
export const Photo: React.FC<{ src: string; w: number; h: number; pos?: string; style?: React.CSSProperties }> = ({ src, w, h, pos = "50% 40%", style }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", width: w, height: h, objectFit: "cover", objectPosition: pos, filter: `${BW} ${OUT}`, ...style }} />
);
