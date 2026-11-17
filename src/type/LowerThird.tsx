import React, { useRef } from "react";
import { useCurrentFrame } from "remotion";
import { rand } from "../lib/random";
import { useDrawingFrame, useFrames } from "../lib/time";
import { ease } from "../tokens/easing";
import { CONDENSED, SMALL_SANS, TEXT_SERIF } from "../tokens/fonts";
import { CAP_RATIO } from "../tokens/type";
import { packaging } from "../tokens/colors";
import { capTrim, glyphs, prog, useInlineWidth } from "./shared";

// New colour values, to move into src/tokens/colors.ts (analysis/vox-framework-coverage.md §6.2 build 1).
/** the house lower-third bar (HC, CR, EL) */
export const LEMON = packaging.lemon;
/** `stripe` variant bar (CE) */
export const STRIPE_BAR = packaging.stripeBar;
/** `tab` variant: green tab and cream bar (AM) */
export const TAB_GREEN = packaging.tabGreen;
export const TAB_CREAM = packaging.tabCream;
/** `card` variant: pale yellow card and red role (DA) */
export const CARD_YELLOW = packaging.cardYellow;
export const CARD_RED = packaging.cardRed;

export type LowerThirdProps = {
  /** "Jessica Yellin" (Title case) */
  name: string;
  /** sentence case: "Senior correspondent, Vox" */
  role?: string;
  /** house first; the others are series looks (stripe: CE, tab: AM, card: DA) */
  variant?: "house" | "stripe" | "tab" | "card";
  /** frames from the sequence start; default 2 (cut +2 f) */
  delay?: number;
  /** frames the card stays, from `delay` (default 120 = 5.0 s); the exit runs inside the last frames */
  life?: number;
  /** left edge / name baseline, design px (default 236 / 835) */
  x?: number;
  baselineY?: number;
  /** house bar: `worm` travels on threes (HC), `wipe` wipes up on ones (CR) */
  bar?: "worm" | "wipe";
  /** `flicker`: the two lines alternate for 5 f (HC); `retract`: bar retracts, name fades (CR); `none`: cut */
  exit?: "flicker" | "retract" | "none";
  seed?: string;
};

const HOUSE = {
  // analysis/vox-framework-coverage.md §6.2: cap 56-64 (HC jessica still: baseline 835, x 236)
  nameCap: 58, roleCap: 29, roleDy: 62, barDy: 17, barD0: 14, barD1: 11,
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Interview lower third (Vox house look, 6/6 reference videos). Name in Source Serif 4 Bold (white, no plate), role in Inter SemiBold,
 * a lemon bar under the name. Build (frames @24, scaled to the comp fps): name letters fade in a seeded scattered order over 0-12 f on
 * twos; f4-37 the bar (`worm`: a 14 px dot at the left edge, head runs right on threes, tail follows, ends as an 11 px dot at the right
 * edge; `wipe`: wipes up on ones in 12 f); f13-21 the role drops in from a mask under the name (ones). Exit `flicker` (5 f) or `retract`.
 * Must sit inside <DesignSpace>. Start it on the cut +2 f of the person's first full-frame shot.
 * Variants `stripe`, `tab`, `card` follow the sample's numbers where measured (type size, colours, build); their geometry is approximate.
 */
export const LowerThird: React.FC<LowerThirdProps> = ({
  name, role, variant = "house", delay = 2, life = 120, x = 236, baselineY = 835, bar = "worm", exit = "flicker", seed = "lt",
}) => {
  const f24 = useFrames();
  const raw = useCurrentFrame() - delay; // exit, role drop and wipe are on ones
  const f = useDrawingFrame() - delay; // letters on twos
  const fw = useDrawingFrame(8) - delay; // worm on threes
  const nameRef = useRef<HTMLDivElement>(null);
  const nameW = useInlineWidth(nameRef);
  if (raw < 0 || raw >= life) return null;

  const exitLen = exit === "flicker" ? f24(5) : exit === "retract" ? f24(20) : 0;
  const x0 = life - exitLen;
  const k = raw - x0; // frames into the exit
  const exiting = exit !== "none" && k >= 0;

  // per-variant type
  const v = variant;
  const nameCap = v === "stripe" ? 86 : v === "tab" ? 37 : v === "card" ? 45 : HOUSE.nameCap;
  const roleCap = v === "card" ? 30 : v === "tab" ? 26 : HOUSE.roleCap;
  const nameFont = v === "stripe" ? CONDENSED : v === "house" ? TEXT_SERIF : v === "card" ? TEXT_SERIF : SMALL_SANS;
  const nameCapRatio = v === "stripe" ? 0.81 : v === "house" || v === "card" ? CAP_RATIO.TEXT_SERIF : CAP_RATIO.SMALL_SANS;
  const nameWeight = v === "stripe" ? 600 : v === "tab" ? 600 : 700;
  const nameColor = v === "card" ? "#0C0C0C" : "#FFFFFF";
  const roleColor = v === "card" ? CARD_RED : "#FFFFFF";
  const roleBase = baselineY + HOUSE.roleDy;

  // name letters: seeded scattered order, 4-6 f each, over 0-12 f, stepped on twos (house). Tab types on twos left to right.
  const chars = glyphs(name);
  const letterOpacity = (i: number) => {
    if (v === "tab") return f >= i * 2 ? 1 : 0; // typed on: one letter per drawing
    if (v === "stripe") return 1;
    const s = rand(`${seed}-s-${i}`) * f24(7);
    const d = f24(4) + rand(`${seed}-d-${i}`) * f24(2);
    return v === "card" ? 1 : clamp01((f - s) / d);
  };
  // house/card: -0.03 em, Source Serif 4 Bold is 8 % wider than the reference face at the same cap height (552 vs 510 px)
  const trk = v === "house" ? -0.03 : v === "stripe" ? 0.35 * (1 - ease("enter")(prog(f, 0, f24(6)))) : v === "tab" ? 0.35 : 0;
  const nameFade = exiting ? (exit === "flicker" ? (k % 2 === 0 ? 1 : 0.35) : 1 - clamp01(k / f24(16))) : 1;
  const roleFade = exiting ? (exit === "flicker" ? (k % 2 === 0 ? 0.35 : 1) : 1 - clamp01((k - f24(2)) / f24(16))) : 1;

  const nameSize = nameCap / nameCapRatio;
  const roleSize = roleCap / CAP_RATIO.SMALL_SANS;
  const nameStyle: React.CSSProperties = {
    position: "relative", display: "inline-block", whiteSpace: "pre", ...capTrim, fontFamily: nameFont, fontSize: nameSize, fontWeight: nameWeight,
    lineHeight: 1, color: nameColor, letterSpacing: trk ? `${trk}em` : undefined, textTransform: v === "tab" ? "uppercase" : undefined, fontKerning: "normal",
  };

  // house bar (also the stripe / tab / card underline)
  const th = HOUSE.barD1 + (HOUSE.barD0 - HOUSE.barD1) * (1 - clamp01(prog(fw, f24(9), f24(22))));
  const barTop = baselineY + HOUSE.barDy - th / 2;
  let barEl: React.ReactNode = null;
  const barColor = v === "stripe" ? STRIPE_BAR : v === "tab" ? TAB_CREAM : LEMON;
  if (v === "house" || v === "stripe" || v === "tab") {
    const L = nameW || 510;
    if (v === "house" && bar === "worm") {
      // the settled HC still (0:22) shows no bar: the 11 px end dot is gone after f37
      if (fw >= f24(4) && fw < f24(37)) {
        const d = th;
        const hx = ease("labelWipe")(prog(fw, f24(4), f24(21))) * (L - d); // in-out: fractions measured on HC f485-507
        const tx = ease("labelWipe")(prog(fw, f24(9), f24(22))) * (L - d);
        const retract = exit === "retract" && exiting ? clamp01(k / f24(8)) : 0;
        const w = Math.max(d, hx + d - tx) * (1 - retract);
        barEl = <div style={{ position: "absolute", left: x + tx, top: barTop, width: w, height: d, borderRadius: d / 2, background: barColor }} />;
      }
    } else {
      // wipe up on ones in 12 f (house / wipe, stripe, tab)
      const p = ease("enter")(prog(raw, f24(4), f24(12)));
      const retract = exit === "retract" && exiting ? clamp01(k / f24(8)) : 0;
      const t2 = HOUSE.barD1 + 1;
      barEl = (
        <div style={{ position: "absolute", left: x, top: baselineY + HOUSE.barDy - t2 / 2, width: L * (1 - retract), height: t2, overflow: "hidden" }}>
          <div style={{ width: "100%", height: t2, background: barColor, borderRadius: v === "house" ? t2 / 2 : 0, transform: `translateY(${(1 - p) * t2}px)` }} />
        </div>
      );
    }
  }

  // role drop from a mask under the name (ones)
  const rp = ease("enter")(prog(raw, f24(13), f24(8)));
  const maskPad = 10;
  const roleEl = role ? (
    <div style={{ position: "absolute", left: x, top: roleBase - roleCap - maskPad, width: 900, height: roleCap + maskPad + roleCap * 0.4, overflow: "hidden", opacity: roleFade }}>
      <div style={{ position: "absolute", left: 0, top: maskPad, whiteSpace: "pre", ...capTrim, fontFamily: SMALL_SANS, fontSize: roleSize, fontWeight: 600, lineHeight: 1, color: roleColor, transform: `translateY(${-(1 - rp) * (roleCap + maskPad + 4)}px)` }}>{role}</div>
    </div>
  ) : null;

  const nameEl = (
    <div ref={nameRef} style={{ position: "absolute", left: 0, top: 0, opacity: nameFade }}>
      <div style={nameStyle}>
        {chars.map((ch, i) => (
          <span key={i} style={{ opacity: letterOpacity(i) }}>{ch}</span>
        ))}
      </div>
    </div>
  );

  if (v === "card") {
    // 8 f wipe left to right (ones) over a pale yellow card; name black, role red
    const w = Math.max(nameW, role ? role.length * roleSize * 0.52 : 0) + 56;
    const p = ease("enter")(prog(raw, 0, f24(8)));
    return (
      <div style={{ position: "absolute", left: x - 28, top: baselineY - nameCap - 28, width: w, height: nameCap + 28 + (role ? HOUSE.roleDy + roleCap * 0.4 + 14 : 24), background: CARD_YELLOW, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: exiting ? nameFade : 1 }}>
        <div style={{ position: "absolute", left: 28, top: 28 }}><div ref={nameRef} style={{ position: "relative", height: nameCap }}><div style={nameStyle}>{name}</div></div></div>
        {role && <div style={{ position: "absolute", left: 28, top: 28 + nameCap + 18, whiteSpace: "pre", ...capTrim, fontFamily: SMALL_SANS, fontSize: roleSize, fontWeight: 600, lineHeight: 1, color: roleColor }}>{role}</div>}
      </div>
    );
  }

  const tab = v === "tab" && (
    <div style={{ position: "absolute", left: x - 18, top: baselineY - nameCap - 16, width: (nameW || 400) + 36, height: nameCap + 32, background: TAB_GREEN, opacity: nameFade }} />
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {tab}
      <div style={{ position: "absolute", left: x, top: baselineY - nameCap }}>{nameEl}</div>
      {barEl}
      {roleEl}
    </div>
  );
};
