import React from "react";
import { Img, staticFile } from "remotion";
import { rand } from "../../lib/random";
import { useDrawingFrame } from "../../lib/time";
import { ease } from "../../tokens/easing";
import { TornBox } from "../../earworm";

/** B&W stand-in art for the Earworm collage (CC0 sources under public/assets, generated SVG/CSS for the rest). */
const INK = "#141414";
const PAPER = "#E9E8E4";
const BW = "grayscale(1) contrast(1.12)";

/** pseudo-newsprint: dense justified columns of tiny serif "text" built from generated words */
const SYL = ["ra", "ton", "me", "dio", "sta", "ver", "lin", "ar", "den", "kor", "tel", "man", "ses", "ob", "pi", "ter", "al", "um", "ney", "ing", "la", "de", "mo", "ris"];
const word = (seed: string) => Array.from({ length: 1 + Math.floor(rand(`${seed}n`) * 3) }, (_, i) => SYL[Math.floor(rand(`${seed}${i}`) * SYL.length)]).join("");

export const Newsprint: React.FC<{ w: number; h: number; seed: string; rot?: 0 | 90 | -90; head?: string; fs?: number }> = ({ w, h, seed, rot = 0, head, fs = 15 }) => {
  const inner = rot === 0 ? { w, h } : { w: h, h: w };
  const lines = Math.ceil(inner.h / (fs * 1.18));
  return (
    <div style={{ position: "absolute", width: w, height: h, background: PAPER, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: rot === 0 ? 0 : rot === 90 ? w : 0, top: rot === 0 ? 0 : rot === 90 ? 0 : h, width: inner.w, height: inner.h, transformOrigin: "0 0", transform: rot ? `rotate(${rot}deg)` : undefined, padding: 8, boxSizing: "border-box" }}>
        {head && <div style={{ font: `700 ${fs * 4.4}px/1 "Oswald", sans-serif`, color: INK, textTransform: "uppercase", marginBottom: 6, whiteSpace: "nowrap" }}>{head}</div>}
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} style={{ font: `400 ${fs}px/${fs * 1.18}px "Source Serif 4", serif`, color: INK, whiteSpace: "nowrap", overflow: "hidden", textAlign: "justify" }}>
            {Array.from({ length: 12 }, (_, k) => word(`${seed}-${i}-${k}`)).join(" ")}
          </div>
        ))}
      </div>
    </div>
  );
};

/** white card with bold black scribble loops (the "scribble card") */
export const Scribble: React.FC<{ w: number; h: number; seed: string }> = ({ w, h, seed }) => {
  const pts: string[] = [];
  let x = w * 0.5;
  let y = h * 0.5;
  for (let i = 0; i < 46; i++) {
    const a = rand(`${seed}a${i}`) * Math.PI * 2;
    const r = 18 + rand(`${seed}r${i}`) * 70;
    const nx = Math.min(w - 8, Math.max(8, x + Math.cos(a) * r));
    const ny = Math.min(h - 8, Math.max(8, y + Math.sin(a) * r));
    pts.push(`${i ? "Q" : "M"}${(x + nx) / 2 + (rand(`${seed}q${i}`) - 0.5) * 50},${(y + ny) / 2 + (rand(`${seed}p${i}`) - 0.5) * 50} ${nx},${ny}`);
    x = nx;
    y = ny;
  }
  return (
    <svg width={w} height={h} style={{ position: "absolute", background: "#F2F2F0" }}>
      <path d={`M${w / 2},${h / 2} ${pts.join(" ")}`} fill="none" stroke={INK} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

/** stylised Capitol: drum + dome + lantern, colonnade, wings (B&W line-and-tone drawing, SVG) */
export const Capitol: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const cols = (x0: number, x1: number, y0: number, y1: number, n: number, cw: number) =>
    Array.from({ length: n }, (_, i) => <rect key={`${x0}${i}`} x={x0 + ((x1 - x0 - cw) * i) / (n - 1)} y={y0} width={cw} height={y1 - y0} fill="#D9D9D6" stroke="#2a2a2a" strokeWidth={2} />);
  return (
    <svg width={w} height={h} viewBox="0 0 495 510" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="dome" x1="0" x2="1"><stop offset="0" stopColor="#7d7d7b" /><stop offset="0.45" stopColor="#ecece8" /><stop offset="1" stopColor="#5d5d5b" /></linearGradient>
      </defs>
      <rect x="0" y="300" width="495" height="210" fill="#B9B8B4" />
      <rect x="0" y="300" width="495" height="14" fill="#E5E4E0" />
      {/* wings */}
      <rect x="0" y="330" width="150" height="150" fill="#CFCFCB" /><rect x="345" y="330" width="150" height="150" fill="#CFCFCB" />
      {cols(8, 140, 345, 465, 9, 9)}{cols(355, 487, 345, 465, 9, 9)}
      {/* centre block + pediment */}
      <rect x="150" y="270" width="195" height="215" fill="#DCDBD7" stroke="#2a2a2a" strokeWidth={2} />
      <polygon points="150,270 247,238 345,270" fill="#F0F0EC" stroke="#2a2a2a" strokeWidth={2} />
      {cols(158, 337, 280, 470, 8, 14)}
      {/* drum + dome */}
      <rect x="168" y="200" width="160" height="40" fill="#E4E3DF" stroke="#2a2a2a" strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={176 + i * 13} y={206} width={6} height={28} fill="#555" />)}
      <path d="M176,200 Q248,20 320,200 Z" fill="url(#dome)" stroke="#2a2a2a" strokeWidth={2} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${248 + (i - 4) * 4},192 Q${248 + (i - 4) * 12},110 248,52`} fill="none" stroke="#6f6f6d" strokeWidth={1.5} />)}
      <rect x="236" y="30" width="24" height="26" fill="#DAD9D5" stroke="#2a2a2a" strokeWidth={2} />
      <path d="M240,30 Q248,0 256,30 Z" fill="#CFCFCB" stroke="#2a2a2a" strokeWidth={2} />
      <rect x="0" y="482" width="495" height="28" fill="#9d9c98" />
    </svg>
  );
};

/** row houses: crop of the 1941 DC street photo (CC0), B&W */
export const Rowhouses: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ position: "absolute", width: w, height: h, overflow: "hidden", background: "#555" }}>
    <Img src={staticFile("assets/cc0/photos/chevrolet-1931-shulmans-market-dc-1941.jpg")} style={{ position: "absolute", left: -w * 0.1, top: -h * 0.55, width: w * 2.2, filter: BW }} />
  </div>
);

export const Strip: React.FC<{ w: number; h: number; color: string; seed: string; rough?: number }> = ({ w, h, color, seed, rough = 10 }) => (
  <TornBox width={w} height={h} color={color} seed={seed} rough={rough} />
);

/** ragged polygon hole for the torn iris: black paper over everything, a torn hole of radius ≈ r */
export const IrisMask: React.FC<{ r: number; seed: string }> = ({ r, seed }) => {
  const n = 64;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + (rand(`${seed}${i}`) - 0.5) * 0.14) * (1 + 0.08 * Math.sin(a * 3 + 1));
    return `${960 + Math.cos(a) * rr * 1.55},${540 + Math.sin(a) * rr}`;
  }).join(" ");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path fillRule="evenodd" fill="#050505" d={`M0,0H1920V1080H0Z M${pts.split(" ").join(" L")} Z`} />
    </svg>
  );
};

/** street-line map (white 2 px streets on black) */
export const LineMap: React.FC<{ w: number; h: number; seed: string }> = ({ w, h, seed }) => {
  const ls: React.ReactNode[] = [];
  for (let i = 0; i < 300; i++) {
    const x = rand(`${seed}x${i}`) * w;
    const y = rand(`${seed}y${i}`) * h;
    const L = 30 + rand(`${seed}l${i}`) * 140;
    const diag = rand(`${seed}d${i}`) < 0.3;
    const a = diag ? (rand(`${seed}t${i}`) - 0.5) * 1.6 : rand(`${seed}h${i}`) < 0.5 ? 0 : Math.PI / 2;
    ls.push(<line key={i} x1={x} y1={y} x2={x + Math.cos(a) * L} y2={y + Math.sin(a) * L} stroke="#fff" strokeOpacity={0.25 + rand(`${seed}o${i}`) * 0.4} strokeWidth={1.6} />);
  }
  return <svg width={w} height={h} style={{ position: "absolute", background: "#0c0c0c" }}>{ls}</svg>;
};

/** One collage piece that unfolds from a hinge: rotateX about the hinge edge over `dur` frames, 4–6 drawings (earworm-A §7). */
export const Unfold: React.FC<{ at: number; dur?: number; hinge?: "bottom" | "left" | "top" | "right"; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, dur = 10, hinge = "bottom", children, style }) => {
  const f = useDrawingFrame() + 2.5;
  if (f < at + 2.5) return null;
  const p = Math.min(1, Math.max(0, (f - at) / dur));
  const e = ease("enter")(p);
  const ang = (1 - e) * -88;
  const axis = hinge === "bottom" || hinge === "top" ? "X" : "Y";
  const sign = hinge === "bottom" || hinge === "right" ? 1 : -1;
  const origin = hinge === "bottom" ? "50% 100%" : hinge === "top" ? "50% 0%" : hinge === "left" ? "0% 50%" : "100% 50%";
  return (
    <div style={{ position: "absolute", ...style, transformOrigin: origin, transform: `perspective(1200px) rotate${axis}(${ang * sign}deg) scale(${0.9 + 0.1 * e})` }}>{children}</div>
  );
};
