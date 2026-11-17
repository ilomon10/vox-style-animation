import React from "react";
import { useDrawingFrame } from "../lib/time";
import { darkCollage, voxExplainer } from "../tokens/colors";
import { SHADOWS } from "../tokens/finish";
import { PhotoPrint } from "./PhotoPrint";
import { type Place, type Pt, jaggedEdge, placeStyle, toPoints, useSvgId } from "./util";

/* ───────────────────────────── PaperClip ───────────────────────────── */

export type PaperClipProps = Place & {
  /** clip height in design px (width = 0.4 × height) */
  height?: number;
};

/** Metallic grey gem paper clip (SVG). Seen from above on a tape label or card edge. */
export const PaperClip: React.FC<PaperClipProps> = ({ height = 110, ...place }) => {
  const id = useSvgId("pc");
  const w = height * 0.4;
  const d = "M14 34 L14 84 A8 8 0 0 0 30 84 L30 22 A14 14 0 0 0 2 22 L2 88 A20 20 0 0 0 42 88 L42 40";
  return (
    <div style={{ ...placeStyle(place, w, height), filter: "drop-shadow(2px 3px 2px rgba(0,0,0,0.32))" }}>
      <svg viewBox="0 0 44 110" width={w} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D9DADD" />
            <stop offset="0.35" stopColor="#8D8F95" />
            <stop offset="0.6" stopColor="#C6C8CC" />
            <stop offset="1" stopColor="#6C6E74" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={1} strokeLinecap="round" transform="translate(-0.9 -0.9)" />
      </svg>
    </div>
  );
};

/* ───────────────────────────── PushPin ───────────────────────────── */

export type PushPinProps = Place & {
  /** head diameter, design px */
  size?: number;
  color?: string;
  /** white die-cut outline width (dark collage: 4–6 px) */
  outline?: number;
  /** frame at which the pin pops in (≤ 2 frames: one drawing); before it nothing is drawn */
  delay?: number;
};

/** Map push-pin: dark-collage maroon head, white sticker outline 5 px. Pops in within one drawing. */
export const PushPin: React.FC<PushPinProps> = ({
  size = 44,
  color = darkCollage.routeMaroon,
  outline = 5,
  delay = 0,
  ...place
}) => {
  const f = useDrawingFrame();
  if (f < delay) return null;
  const first = f - delay < 2; // first drawing: slightly small, then full size
  const r = size / 2;
  const pad = outline + 2;
  const W = size + pad * 2;
  return (
    <div style={{ ...placeStyle(place, W, W + r), transform: `${place.rotate ? `rotate(${place.rotate}deg) ` : ""}scale(${first ? 0.82 : 1})` }}>
      <svg width={W} height={W + r} style={{ overflow: "visible" }}>
        {/* sticker outline = stroked union of head + shaft */}
        <g stroke={darkCollage.stickerWhite} strokeWidth={outline * 2} strokeLinejoin="round" fill={darkCollage.stickerWhite}>
          <circle cx={W / 2} cy={W / 2} r={r} />
          <path d={`M${W / 2 - 3} ${W / 2} L${W / 2} ${W / 2 + r + 6} L${W / 2 + 3} ${W / 2}`} />
        </g>
        <path d={`M${W / 2 - 2.5} ${W / 2} L${W / 2} ${W / 2 + r + 5} L${W / 2 + 2.5} ${W / 2}`} fill="#3A3434" />
        <circle cx={W / 2} cy={W / 2} r={r} fill={color} />
        <circle cx={W / 2} cy={W / 2} r={r * 0.78} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={r * 0.18} />
        <ellipse cx={W / 2 - r * 0.3} cy={W / 2 - r * 0.32} rx={r * 0.3} ry={r * 0.2} fill="rgba(255,255,255,0.38)" transform={`rotate(-35 ${W / 2 - r * 0.3} ${W / 2 - r * 0.32})`} />
      </svg>
    </div>
  );
};

/* ───────────────────────────── FloorEllipse ───────────────────────────── */

export type FloorEllipseProps = Place & {
  width: number;
  /** default 0.12 × width (dracula.md §9) */
  height?: number;
  color?: string;
};

/** Flat hard-edged floor ellipse standing in for a contact shadow (dark collage). No blur. */
export const FloorEllipse: React.FC<FloorEllipseProps> = ({
  width,
  height,
  color = darkCollage.floorEllipse,
  ...place
}) => {
  const h = height ?? width * 0.12;
  return <div style={{ ...placeStyle(place, width, h), background: color, borderRadius: "50%" }} />;
};

/* ───────────────────────────── TornPaper ───────────────────────────── */

export type TornPaperProps = Place & {
  width: number;
  height: number;
  seed?: string;
  color?: string;
  /** torn-edge roughness, design px */
  roughness?: number;
  /** flat offset echo along the torn edge (dark collage: red, ≈(−25,−20)) */
  echo?: { color: string; dx: number; dy: number } | boolean;
  children?: React.ReactNode;
};

const tornOutline = (seed: string, w: number, h: number, amp: number, inset = 0): Pt[] => {
  const step = 15;
  const c: Pt[] = [
    [inset, inset],
    [w - inset, inset],
    [w - inset, h - inset],
    [inset, h - inset],
  ];
  const pts: Pt[] = [];
  for (let i = 0; i < 4; i++) pts.push(...jaggedEdge(`${seed}-${i}`, c[i], c[(i + 1) % 4], step, amp, "torn"));
  return pts;
};

/** Seeded torn-paper patch (cream #D0CABF) with a lighter fibre rim and optional flat echo. */
export const TornPaper: React.FC<TornPaperProps> = ({
  width,
  height,
  seed = "torn",
  color = darkCollage.paperCream,
  roughness = 9,
  echo,
  children,
  ...place
}) => {
  const pad = roughness + 2;
  const outer = tornOutline(seed, width, height, roughness, pad);
  const inner = tornOutline(`${seed}-in`, width, height, roughness * 0.7, pad + 3);
  const e = echo === true ? { color: darkCollage.crimsonEcho, dx: -25, dy: -20 } : echo || undefined;
  return (
    <div style={placeStyle({ ...place, x: (place.x ?? 0) - pad, y: (place.y ?? 0) - pad }, width + pad * 2, height + pad * 2)}>
      <svg width={width + pad * 2} height={height + pad * 2} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {e && <polygon points={toPoints(outer)} fill={e.color} transform={`translate(${e.dx} ${e.dy})`} />}
        <polygon points={toPoints(outer)} fill="#E6DFD2" />
        <polygon points={toPoints(inner)} fill={color} />
      </svg>
      {children && <div style={{ position: "absolute", left: pad, top: pad, width, height }}>{children}</div>}
    </div>
  );
};

/* ───────────────────────────── DiagramCard ───────────────────────────── */

export type DiagramCardProps = Place & {
  width: number;
  height: number;
  /** card fill (Vox black diagram card #353336) */
  fill?: string;
  /** dot-mesh pitch in design px (≈10) */
  pitch?: number;
  /** light print border like a Vox photo print; false = bare card */
  printBorder?: boolean;
  children?: React.ReactNode;
};

/** Black diagram card: #353336 with a ≈10 px hex dot mesh (white at ≈7 %), inside a print border. */
export const DiagramCard: React.FC<DiagramCardProps> = ({
  width,
  height,
  fill = voxExplainer.card,
  pitch = 10,
  printBorder = true,
  children,
  ...place
}) => {
  const dot = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07) 2px, transparent 2.6px)`;
  const body = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: fill,
        backgroundImage: `${dot}, ${dot}`,
        backgroundSize: `${pitch}px ${pitch}px`,
        backgroundPosition: `0 0, ${pitch / 2}px ${pitch / 2}px`,
      }}
    >
      {children}
    </div>
  );
  if (!printBorder)
    return <div style={{ ...placeStyle(place, width, height), filter: SHADOWS.printContact }}>{body}</div>;
  return (
    <PhotoPrint variant="vox" width={width} height={height} {...place}>
      {body}
    </PhotoPrint>
  );
};

/* ───────────────────────────── CropMarks ───────────────────────────── */

export type CropMarksProps = {
  /** which corners carry a crosshair; paper desk: ["tr","bl"] */
  corners?: readonly ("tl" | "tr" | "bl" | "br")[];
  /** distance of the crosshair centre from the frame edges (design px) */
  inset?: readonly [number, number];
  /** line length (≈488), stroke (3), colour (#76716B), outward overshoot as a fraction of length (≈0.1) */
  length?: number;
  stroke?: number;
  color?: string;
  overshoot?: number;
  width?: number;
  height?: number;
};

/**
 * Paper-desk crop-mark crosshairs (S110 quote card, end card): per corner one horizontal and one
 * vertical line meeting at (inset); each line runs 90 % inward and overshoots the corner by ≈10 %.
 * Measured TR: horizontal y=102 x 1343–1830, vertical x=1737 y 53–540 (porsche-part3-stills.md §6).
 */
export const CropMarks: React.FC<CropMarksProps> = ({
  corners = ["tr", "bl"],
  inset = [183, 102],
  length = 488,
  stroke = 3,
  color = "#76716B",
  overshoot = 0.1,
  width = 1920,
  height = 1080,
}) => {
  const out = length * overshoot;
  const inn = length - out;
  return (
    <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {corners.map((c) => {
        const sx = c.includes("r") ? -1 : 1; // inward direction
        const sy = c.includes("b") ? -1 : 1;
        const cx = c.includes("r") ? width - inset[0] : inset[0];
        const cy = c.includes("b") ? height - inset[1] : inset[1];
        return (
          <g key={c} stroke={color} strokeWidth={stroke}>
            <line x1={cx - sx * out} y1={cy} x2={cx + sx * inn} y2={cy} />
            <line x1={cx} y1={cy - sy * out} x2={cx} y2={cy + sy * inn} />
          </g>
        );
      })}
    </svg>
  );
};
