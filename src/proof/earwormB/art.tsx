import React from "react";
import { Img, staticFile } from "remotion";
import { rand } from "../../lib/random";
import { voxEarworm } from "../../tokens/colors";

/** B&W / periwinkle stand-in art for Earworm segment B (generated SVG/CSS; CC0 photos live in public/assets, crops in public/_private/earwormB). */
const BW = "grayscale(1) contrast(1.12)";
export const PRIV = (f: string) => staticFile(`_private/earwormB/${f}`);

/** triangular pennant flag on a pole: 13 stripes, star canton (B&W). Pole tip at (0,H), flag rises to the upper right. */
export const Flag: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} viewBox="0 0 440 380" style={{ position: "absolute" }}>
    <defs><clipPath id="fl"><polygon points="105,235 440,0 400,330" /></clipPath></defs>
    <line x1="0" y1="380" x2="150" y2="215" stroke="#E8E8E4" strokeWidth={9} strokeLinecap="round" />
    <g clipPath="url(#fl)">
      <rect width="440" height="380" fill="#EDEDEA" />
      {Array.from({ length: 13 }, (_, i) => i % 2 === 0 && <polygon key={i} points={`${105 + i * 26},${235 - i * 18} 520,${-40 + i * 24} 520,${-10 + i * 24 + 24} ${105 + i * 26 + 26},${235 - i * 18 + 8}`} fill="#4a4a4a" />)}
      <polygon points="105,235 300,98 290,230" fill="#3d3d3d" />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={140 + (i % 6) * 26 + Math.floor(i / 6) * 12} cy={205 - (i % 6) * 12 - Math.floor(i / 6) * 17} r={3.6} fill="#EDEDED" />)}
    </g>
  </svg>
);

/** neoclassical portico (pediment, six columns, steps) */
export const WhiteHouse: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} viewBox="0 0 295 270" style={{ position: "absolute" }}>
    <rect width="295" height="270" fill="#8e8e8a" />
    <rect x="40" y="70" width="215" height="175" fill="#5a5a58" />
    <rect x="10" y="40" width="275" height="26" fill="#E9E9E5" />
    <polygon points="5,40 148,0 290,40" fill="#F2F2EE" stroke="#3a3a3a" strokeWidth={2} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={26 + i * 44} y={66} width={15} height={170} fill="#EDEDE9" stroke="#444" strokeWidth={1.5} />)}
    <rect x="30" y="64" width="235" height="8" fill="#DADAD6" />
    <rect x="0" y="236" width="295" height="34" fill="#C9C9C5" />
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={0} y={238 + i * 8} width={295} height={2} fill="#777" />)}
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={50 + i * 33} y={80} width={10} height={28} fill="#2a2a2a" opacity={0.5} />)}
  </svg>
);

/** album sleeve: washington-DC badge top-left + the group's arch lettering */
export const AlbumArt: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#DAD9D4", overflow: "hidden" }}>
    <svg width={w} height={h} viewBox="0 0 770 700" style={{ position: "absolute" }}>
      <rect x="20" y="35" width="105" height="115" fill="#E8E7E3" stroke="#555" strokeWidth={3} />
      <text x="72" y="72" textAnchor="middle" fontSize="14" fontFamily="Oswald, sans-serif" fill="#444">WASHINGTON</text>
      <text x="72" y="125" textAnchor="middle" fontSize="54" fontFamily="Anton, sans-serif" fill="#2a2a2a">DC</text>
      <path d="M150,330 A235,235 0 0 1 620,330" fill="none" stroke="#3a3a3a" strokeWidth={70} />
      <path id="arch" d="M150,330 A235,235 0 0 1 620,330" fill="none" />
      <text fontSize="60" fontFamily="Anton, sans-serif" fill="#E6E5E1" letterSpacing="10"><textPath href="#arch" startOffset="50%" textAnchor="middle">PARLIAMENT</textPath></text>
    </svg>
  </div>
);

/** graph-paper card (light blue grid) with a torn bottom edge: the Clinton circle's backing */
export const GraphPaper: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#E4E6F2", backgroundImage: "linear-gradient(#aab1d8 1px, transparent 1px), linear-gradient(90deg, #aab1d8 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
);

/** wide-brim hat (white felt, shaded) that is drawn over the circle crop's top */
export const Hat: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 400 200" style={{ position: "absolute" }}>
    <ellipse cx="200" cy="150" rx="195" ry="44" fill="#E9E9E6" stroke="#9a9a98" strokeWidth={3} />
    <path d="M95,150 C95,40 135,5 200,5 C265,5 305,40 305,150 C260,175 140,175 95,150 Z" fill="#F4F4F1" stroke="#9a9a98" strokeWidth={3} />
    <path d="M95,138 C150,162 250,162 305,138 L305,150 C250,175 150,175 95,150 Z" fill="#6a6a68" />
    <path d="M130,50 C150,20 200,12 240,24" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.6} />
  </svg>
);

/** newsprint torn fragment (dark, for the 4d ground is the kit's) */
export const Cutout: React.FC<{ src: string; w: number; h: number; blur?: number; style?: React.CSSProperties }> = ({ src, w, h, blur = 0, style }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", width: w, height: h, objectFit: "contain", filter: `${BW}${blur ? ` blur(${blur}px)` : ""}`, ...style }} />
);

/** boombox: handle, two speaker cones, tape deck window with cassette, knobs (greyscale, on a 640×280 box) */
export const Boombox: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 640 320" style={{ position: "absolute" }}>
    <path d="M150,60 C170,6 470,6 490,60" fill="none" stroke="#2a2a2a" strokeWidth={14} />
    <rect x="6" y="52" width="628" height="262" rx="22" fill="#dcdcd8" stroke="#2a2a2a" strokeWidth={5} />
    <rect x="22" y="66" width="596" height="40" rx="10" fill="#efefec" />
    {[0, 1].map((k) => (
      <g key={k}>
        <circle cx={k ? 520 : 120} cy={205} r={88} fill="#2d2d2d" stroke="#101010" strokeWidth={6} />
        <circle cx={k ? 520 : 120} cy={205} r={64} fill="#4b4b4b" />
        <circle cx={k ? 520 : 120} cy={205} r={26} fill="#1a1a1a" />
        <circle cx={k ? 520 : 120} cy={205} r={78} fill="none" stroke="#666" strokeWidth={2} />
      </g>
    ))}
    <rect x="230" y="128" width="180" height="104" rx="8" fill="#353535" stroke="#111" strokeWidth={4} />
    <rect x="246" y="140" width="148" height="62" rx="6" fill="#bdbdb8" />
    <circle cx="290" cy="171" r="16" fill="#2a2a2a" /><circle cx="350" cy="171" r="16" fill="#2a2a2a" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={240 + i * 26} y={212} width={20} height={14} rx={3} fill="#9b9b97" stroke="#111" strokeWidth={1.5} />)}
    {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={262 + i * 28} cy={262} r={9} fill="#666" stroke="#111" strokeWidth={2} />)}
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={30 + i * 48} y={80} width={32} height={10} rx={3} fill="#9d9d98" />)}
  </svg>
);

/** studio microphone on a boom stand (greyscale) */
export const Mic: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.75} viewBox="0 0 440 330" style={{ position: "absolute" }}>
    <path d="M10,10 L150,12 L330,120" fill="none" stroke="#c9c9c5" strokeWidth={13} strokeLinecap="round" />
    <path d="M20,2 L20,50" stroke="#8a8a86" strokeWidth={11} />
    <g transform="rotate(35 350 140)">
      <rect x="322" y="60" width="56" height="140" rx="26" fill="#777" stroke="#222" strokeWidth={5} />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={326} x2={374} y1={76 + i * 20} y2={76 + i * 20} stroke="#222" strokeWidth={3} />)}
    </g>
    <path d="M290,150 C330,260 410,270 430,200" fill="none" stroke="#9a9a96" strokeWidth={6} />
  </svg>
);

/** blue patch cable with a plug at the end */
export const Cable: React.FC<{ w: number; h: number; p?: number }> = ({ w, h, p = 1 }) => (
  <svg width={w} height={h} viewBox="0 0 400 300" style={{ position: "absolute", overflow: "visible" }}>
    <path d="M36,10 C30,120 30,200 110,250 C190,296 300,280 360,170" fill="none" stroke={voxEarworm.accent} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    <rect x="22" y="-26" width="28" height="40" rx="5" fill="#cfcfcb" stroke="#222" strokeWidth={3} />
  </svg>
);

/** black vinyl with a periwinkle label + baked sheen (a static cut-out for the radio collage) */
export const BlueVinyl: React.FC<{ d: number }> = ({ d }) => (
  <div style={{ position: "absolute", width: d, height: d, borderRadius: "50%", background: "repeating-radial-gradient(circle at 50% 50%, #101010 0px, #262626 1.5px, #131313 3px)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: d * 0.36, top: d * 0.36, width: d * 0.28, height: d * 0.28, borderRadius: "50%", background: voxEarworm.indigo, boxShadow: `inset 0 0 0 ${d * 0.02}px #2a2f5e` }} />
    <div style={{ position: "absolute", left: d * 0.49, top: d * 0.49, width: d * 0.02, height: d * 0.02, borderRadius: "50%", background: "#050505" }} />
    <div style={{ position: "absolute", inset: 0, background: "conic-gradient(from 200deg, transparent 0 20deg, rgba(240,240,240,.55) 36deg, transparent 70deg, transparent 180deg)", mixBlendMode: "screen" }} />
  </div>
);

/** trumpet cut-out with a white bell (generated; the player's head is a CC0 bust crop) */
export const Trumpet: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 520 220" style={{ position: "absolute" }}>
    <path d="M0,150 L330,140 L330,120 L0,130 Z" fill="#E6E6E3" stroke="#333" strokeWidth={3} />
    <path d="M330,142 L470,150 L500,168 L505,40 L470,58 L330,118 Z" fill="#F2F2EF" stroke="#333" strokeWidth={4} />
    <ellipse cx="503" cy="104" rx="10" ry="64" fill="#fff" stroke="#333" strokeWidth={4} />
    {[160, 195, 230].map((x) => <rect key={x} x={x} y={92} width={13} height={44} rx={4} fill="#d6d6d3" stroke="#333" strokeWidth={2.5} />)}
    <path d="M60,150 C40,200 150,215 250,168 L250,142" fill="none" stroke="#E6E6E3" strokeWidth={9} />
  </svg>
);

/** dark mid-tone torn newsprint strip behind the car (4b) */
export const DarkNews: React.FC<{ w: number; h: number; seed: string }> = ({ w, h, seed }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#2a2a2c", overflow: "hidden" }}>
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 6 + rand(`${seed}${i}`) * 30, top: 10 + i * (h / 7), font: `700 ${h / 6}px/1 Oswald, sans-serif`, color: "#6a6a6e", whiteSpace: "nowrap" }}>
        {["rem", "fr", "«", "have", "REG", "wk"][i % 6]}
      </div>
    ))}
  </div>
);

/** cassette tape (black shell, two hubs, paper label with handwriting) — upright, 255×395 */
export const Cassette: React.FC = () => (
  <svg width={255} height={395} viewBox="0 0 255 395" style={{ position: "absolute" }}>
    <rect width="255" height="395" rx="10" fill="#1d1d1d" stroke="#333" strokeWidth={3} />
    <rect x="98" y="14" width="64" height="367" fill="#0c0c0c" />
    <rect x="168" y="14" width="68" height="367" fill="#dcdcd6" />
    {[95, 275].map((y) => (<g key={y}><circle cx="130" cy={y} r="46" fill="#f2f2f0" /><circle cx="130" cy={y} r="26" fill="#cfcfcb" /><circle cx="130" cy={y} r="12" fill="#222" /></g>))}
    <text x="214" y="320" fontSize="30" fontFamily="'Segoe Script', cursive" fill="#5360d8" transform="rotate(-90 214 320)">Best of the show</text>
    <text x="18" y="30" fontSize="16" fill="#aaa" fontFamily="Oswald, sans-serif">1</text><text x="18" y="383" fontSize="16" fill="#aaa" fontFamily="Oswald, sans-serif">1</text>
  </svg>
);
