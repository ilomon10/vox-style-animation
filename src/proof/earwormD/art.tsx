import React from "react";
import { Img, staticFile } from "remotion";
import { rand } from "../../lib/random";
import { voxEarworm } from "../../tokens/colors";
import { needleAngle } from "../../earworm/fx";

/** Generated B&W stand-in props for the segment-D collages (earworm-D §2 S23c / S26 / S27). Everything is a plain box/svg, no real logos. */
const G = { hi: "#A9A9A7", mid: "#737372", lo: "#4A4A49", ink: "#111", dark: "#1B1B1B" };
const abs = (x: number, y: number, w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, ...extra });

export const Knob: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <div style={abs(x - r, y - r, 2 * r, 2 * r, { borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #555, ${G.ink} 70%)`, boxShadow: "0 0 0 2px #ccc" })}>
    <div style={abs(r - 1.5, 3, 3, r * 0.8, { background: "#eee" })} />
  </div>
);

/** VU dial face. `angle` in degrees (-35.5 .. +51, see needleAngle) */
export const VuFace: React.FC<{ w: number; h: number; angle: number }> = ({ w, h, angle }) => {
  const cx = w / 2, cy = h * 1.05, r = h * 0.92;
  const pt = (d: number, k: number) => [cx + Math.sin((d * Math.PI) / 180) * r * k, cy - Math.cos((d * Math.PI) / 180) * r * k];
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <rect width={w} height={h} fill="#C9C9C6" />
      {Array.from({ length: 15 }, (_, i) => {
        const d = -50 + i * 7.6;
        const [x1, y1] = pt(d, 0.8), [x2, y2] = pt(d, i % 2 ? 0.88 : 0.93);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={d > 22 ? "#222" : "#333"} strokeWidth={Math.max(2, h * 0.012)} />;
      })}
      <path d={`M ${pt(22, 0.86)[0]} ${pt(22, 0.86)[1]} A ${r * 0.86} ${r * 0.86} 0 0 1 ${pt(52, 0.86)[0]} ${pt(52, 0.86)[1]}`} stroke="#444" strokeWidth={h * 0.04} fill="none" />
      <text x={w * 0.14} y={h * 0.38} fontSize={h * 0.12} fontFamily="Oswald, sans-serif" fill="#222" transform={`rotate(-25 ${w * 0.14} ${h * 0.38})`}>VU</text>
      <text x={w * 0.84} y={h * 0.38} fontSize={h * 0.12} fontFamily="Oswald, sans-serif" fill="#222" transform={`rotate(25 ${w * 0.84} ${h * 0.38})`}>VU</text>
      <line x1={cx} y1={cy} x2={pt(angle, 1.0)[0]} y2={pt(angle, 1.0)[1]} stroke="#0c0c0c" strokeWidth={Math.max(3, h * 0.016)} strokeLinecap="round" />
    </svg>
  );
};

/** top-down mixing console, w×h box. `needle` = frame inside needleAngle's timeline (peakAt given) */
export const Console: React.FC<{ w: number; h: number; angle?: number; seed?: string }> = ({ w, h, angle = 28, seed = "c" }) => {
  const kr = w * 0.032;
  return (
    <div style={abs(0, 0, w, h, { background: `linear-gradient(180deg, ${G.hi}, ${G.mid})`, boxShadow: `0 0 0 ${w * 0.008}px #3a3a3a` })}>
      <div style={abs(w * 0.3, h * 0.04, w * 0.4, h * 0.3, { background: "#202020", padding: w * 0.012, boxSizing: "border-box" })}>
        <VuFace w={w * 0.4 - w * 0.024} h={h * 0.3 - w * 0.024} angle={angle} />
      </div>
      {[0.1, 0.2, 0.78, 0.9].map((k, i) => <Knob key={i} x={w * k} y={h * 0.14} r={kr} />)}
      <div style={abs(0, h * 0.5, w, h * 0.08, { background: "#EDEDEB", boxShadow: "inset 0 0 0 3px #2a2a2a" })} />
      {[0.12, 0.37, 0.62, 0.87].map((k, i) => <Knob key={i} x={w * k} y={h * 0.78} r={kr * 1.35} />)}
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={abs(w * (0.04 + rand(`${seed}${i}`) * 0.92), h * 0.38, 3, h * 0.1, { background: "#444" })} />)}
    </div>
  );
};

export const Boombox: React.FC<{ w: number }> = ({ w }) => {
  const h = w * 0.5;
  return (
    <div style={abs(0, 0, w, h, { background: `linear-gradient(180deg, ${G.hi}, ${G.mid})`, borderRadius: w * 0.02, boxShadow: `0 0 0 3px #333` })}>
      <div style={abs(w * 0.3, -h * 0.1, w * 0.4, h * 0.12, { border: "7px solid #bbb", borderBottom: "none", borderRadius: "14px 14px 0 0" })} />
      {[0.17, 0.83].map((k, i) => (
        <div key={i} style={abs(w * k - h * 0.3, h * 0.38, h * 0.6, h * 0.6, { borderRadius: "50%", background: "repeating-radial-gradient(circle, #1a1a1a 0 3px, #777 3px 6px)", boxShadow: "0 0 0 4px #ccc" })} />
      ))}
      <div style={abs(w * 0.36, h * 0.08, w * 0.28, h * 0.2, { background: "#161616", boxShadow: "inset 0 0 0 3px #888" })} />
      {[0.1, 0.9].map((k, i) => <div key={i} style={abs(w * k - w * 0.07, h * 0.1, w * 0.14, h * 0.2, { background: "#2a2a2a", boxShadow: "inset 0 0 0 3px #aaa" })} />)}
      <div style={abs(w * 0.38, h * 0.55, w * 0.24, h * 0.3, { background: "#2c2c2c", boxShadow: "inset 0 0 0 3px #999" })} />
    </div>
  );
};

export const Cassette: React.FC<{ w: number }> = ({ w }) => {
  const h = w * 0.64;
  return (
    <div style={abs(0, 0, w, h, { background: "#222", borderRadius: 10, boxShadow: "0 0 0 3px #888" })}>
      <div style={abs(w * 0.08, h * 0.1, w * 0.84, h * 0.46, { background: "#E4E3DE", borderRadius: 6 })}>
        <div style={{ font: `italic 400 ${w * 0.1}px/1 "Source Serif 4", serif`, color: voxEarworm.accent, textAlign: "center", marginTop: h * 0.06 }}>Best slow jams ever</div>
      </div>
      {[0.3, 0.7].map((k, i) => <div key={i} style={abs(w * k - h * 0.1, h * 0.63, h * 0.2, h * 0.2, { borderRadius: "50%", background: "#E8E8E8", boxShadow: "inset 0 0 0 6px #333" })} />)}
    </div>
  );
};

export const Turntable: React.FC<{ w: number; rot?: number }> = ({ w, rot = 0 }) => (
  <div style={abs(0, 0, w, w * 0.9, { background: "#242424", boxShadow: "0 0 0 3px #666" })}>
    <div style={abs(w * 0.06, w * 0.08, w * 0.74, w * 0.74, { borderRadius: "50%", background: "repeating-radial-gradient(circle, #101010 0 2px, #1d1d1d 2px 4px)", transform: `rotate(${rot}deg)` })}>
      <div style={abs(w * 0.27, w * 0.27, w * 0.2, w * 0.2, { borderRadius: "50%", background: voxEarworm.accent })} />
    </div>
    <div style={abs(w * 0.78, w * 0.1, w * 0.04, w * 0.5, { background: "#bbb", transform: "rotate(-18deg)", transformOrigin: "50% 0" })} />
  </div>
);

export const StudioMic: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={abs(0, 0, w, h)}>
    <div style={abs(w * 0.15, 0, w * 0.7, h * 0.45, { borderRadius: w, background: "repeating-linear-gradient(90deg, #ddd 0 3px, #555 3px 6px)", boxShadow: "0 0 0 3px #333" })} />
    <div style={abs(w * 0.46, h * 0.45, w * 0.08, h * 0.55, { background: "#aaa" })} />
  </div>
);

/** boom arm + coiled cable, a periwinkle loop */
export const BoomArm: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} style={{ position: "absolute", overflow: "visible" }}>
    <line x1={0} y1={0} x2={w * 0.9} y2={h * 0.55} stroke="#CFCFCC" strokeWidth={14} strokeLinecap="round" />
    <path d={`M ${w * 0.8} ${h * 0.5} C ${w * 1.15} ${h * 0.3} ${w * 1.15} ${h * 0.95} ${w * 0.88} ${h * 0.9}`} fill="none" stroke={voxEarworm.accent} strokeWidth={9} strokeLinecap="round" />
  </svg>
);

export const Spire: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} style={{ position: "absolute" }}>
    <polygon points={`0,${h / 2} ${w * 0.55},${h * 0.42} ${w * 0.62},${h * 0.3} ${w},${h * 0.1} ${w * 0.62},${h * 0.7} ${w * 0.55},${h * 0.58}`} fill={G.hi} stroke="#333" strokeWidth={3} />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={w * (0.1 + i * 0.07)} y1={h * 0.48} x2={w * (0.1 + i * 0.07)} y2={h * 0.58} stroke="#444" strokeWidth={3} />)}
  </svg>
);

/** news clipping / scrap */
export const Scrap: React.FC<{ w: number; h: number; seed: string; fill?: string; text?: boolean }> = ({ w, h, seed, fill = "#E6E5E0", text = true }) => (
  <div style={abs(0, 0, w, h, { background: fill, clipPath: `polygon(${Array.from({ length: 14 }, (_, i) => { const t = i / 14; const a = t < 0.25 ? [t * 4 * 100, 0] : t < 0.5 ? [100, (t - 0.25) * 400] : t < 0.75 ? [100 - (t - 0.5) * 400, 100] : [0, 100 - (t - 0.75) * 400]; return `${Math.max(0, Math.min(100, a[0] + (rand(`${seed}x${i}`) - 0.5) * 4))}% ${Math.max(0, Math.min(100, a[1] + (rand(`${seed}y${i}`) - 0.5) * 4))}%`; }).join(",")})`, overflow: "hidden" })}>
    {text && Array.from({ length: Math.floor(h / 12) }, (_, i) => <div key={i} style={abs(8, 8 + i * 12, w - 16 - rand(`${seed}l${i}`) * 40, 4, { background: "#555", opacity: 0.7 })} />)}
  </div>
);

/** dark paper scrap / newsprint ground piece */
export const Slab: React.FC<{ w: number; h: number; c?: string; rot?: number }> = ({ w, h, c = "#161616", rot = 0 }) => <div style={abs(0, 0, w, h, { background: c, transform: `rotate(${rot}deg)` })} />;

/** B&W photo cut-out with a ragged white border built from stacked drop-shadows (no soft shadow: 0 blur) */
export const PhotoCut: React.FC<{ src: string; w: number; h: number; objectPosition?: string; border?: number; flip?: boolean; zoom?: number }> = ({ src, w, h, objectPosition = "50% 20%", border = 8, flip, zoom = 1 }) => (
  <div style={abs(0, 0, w, h, { filter: `drop-shadow(${border}px 0 0 #EEE) drop-shadow(-${border}px 0 0 #EEE) drop-shadow(0 ${border}px 0 #EEE) drop-shadow(0 -${border}px 0 #EEE)` })}>
    <div style={abs(0, 0, w, h, { overflow: "hidden" })}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -((zoom - 1) * w) / 2, top: 0, width: w * zoom, height: "auto", objectFit: "cover", objectPosition, filter: "grayscale(1) contrast(1.25) brightness(1.05)", transform: flip ? "scaleX(-1)" : undefined }} />
    </div>
  </div>
);

export const PhoneBase: React.FC<{ w: number }> = ({ w }) => (
  <div style={abs(0, 0, w, w * 0.62)}>
    <div style={abs(0, w * 0.2, w, w * 0.42, { background: "linear-gradient(180deg,#555,#1d1d1d)", borderRadius: "10px 10px 20px 20px", transform: "skewX(-12deg)" })} />
    <div style={abs(w * 0.22, 0, w * 0.5, w * 0.34, { background: "linear-gradient(180deg,#777,#2a2a2a)", borderRadius: 14, transform: "skewX(-12deg)" })}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={abs(w * 0.04 + (i % 3) * w * 0.15, w * 0.03 + Math.floor(i / 3) * w * 0.07, w * 0.11, w * 0.05, { background: "#D5D5D2", borderRadius: 3 })} />)}
    </div>
  </div>
);
export const Handset: React.FC<{ len: number }> = ({ len }) => (
  <div style={abs(0, 0, len * 0.28, len, { borderRadius: len * 0.14, background: "linear-gradient(90deg,#2a2a2a,#8a8a88,#2a2a2a)", boxShadow: "0 0 0 3px #111" })} />
);
export const Cord: React.FC<{ w: number; h: number; d: string }> = ({ w, h, d }) => (
  <svg width={w} height={h} style={{ position: "absolute", overflow: "visible" }}><path d={d} fill="none" stroke={voxEarworm.accent} strokeWidth={9} strokeLinecap="round" /></svg>
);

export { needleAngle };
