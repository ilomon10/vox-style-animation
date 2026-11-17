import React from "react";
import { interpolate } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim, useInlineWidth } from "../type/shared";
import { TornBox } from "./shared";

export type LabelStripProps = {
  /** one or two lines ("FENDER", "RHODES") */
  lines: string[];
  /** left / top of line 1's strip, design px */
  x?: number;
  y?: number;
  /** frame the label starts (sequence-relative) */
  delay?: number;
  /** "wipe" L→R, "slide" in from the right, "rise" from below a mask (earworm-C §4: f1937 / f2493 / f2651) */
  reveal?: "wipe" | "slide" | "rise";
  /** reveal length in frames: wipe 4–8, slide 8, rise 4 (earworm-C §4); default per mode */
  revealFrames?: number;
  /** line 2 is shifted right by this much and overlaps line 1 (≈100 px, earworm-C §4) */
  lineOffsetX?: number;
  /** strip colour, #282627–#393939 */
  strip?: string;
  role?: TypeRole;
  /** padding inside a strip around the cap box, design px */
  padX?: number;
  padY?: number;
  /** optional sub-label on black tape, pops `subDelay` (+5) frames after the label */
  sub?: string;
  subDelay?: number;
  /** sub-label position relative to the last line's strip origin */
  subOffset?: { x: number; y: number };
  seed?: string;
};

/** Strip sized to its text (measured once fonts are ready): torn charcoal box + caps. */
const TextStrip: React.FC<{ text: string; role: TypeRole; color: string; padX: number; padY: number; seed: string; rough: number; outline?: string }> = ({
  text, role, color, padX, padY, seed, rough, outline,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const tw = useInlineWidth(ref);
  const h = role.cap + 2 * padY;
  return (
    <TornBox width={tw + 2 * padX} height={h} color={color} seed={seed} rough={rough} style={{ outline, display: "inline-block" }}>
      <div ref={ref} style={{ position: "absolute", left: padX, top: padY, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...role, leading: 1 }) }}>
        {text}
      </div>
    </TornBox>
  );
};

/**
 * Off-white condensed caps on a charcoal torn strip. Two-line labels are staggered (line 2 right by ≈100 px, overlapping by
 * a few px) like FENDER / RHODES (analysis/earworm-C.md §4, §9 `TornLabel`). The optional sub-label pops on a black
 * tape strip +5 f after the label.
 */
export const LabelStrip: React.FC<LabelStripProps> = ({
  lines, x = 0, y = 0, delay = 0, reveal = "wipe", revealFrames, lineOffsetX = 100, strip = voxEarworm.strip,
  role = earwormType.stripLabel, padX = 26, padY = 15, sub, subDelay = 5, subOffset = { x: 150, y: 14 }, seed = "strip",
}) => {
  const f = useDrawingFrame();
  const cap = role.cap;
  const h = cap + 2 * padY;
  const rf = revealFrames ?? (reveal === "slide" ? 8 : reveal === "wipe" ? 6 : 4);
  const stripY = (i: number) => i * (h - 10); // 10 px overlap
  const stripX = (i: number) => i * lineOffsetX;

  const els = lines.map((t, i) => {
    const t0 = delay + i * 2; // second line 2 f later
    const p = interpolate(f, [t0, t0 + rf], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const e = ease("enter")(p);
    if (f < t0) return null;
    const inner: React.CSSProperties = {};
    let wrap: React.CSSProperties = {};
    if (reveal === "wipe") inner.clipPath = `inset(-20px ${(1 - e) * 100}% -20px -20px)`;
    if (reveal === "slide") inner.transform = `translateX(${(1 - e) * 720}px)`;
    if (reveal === "rise") {
      inner.transform = `translateY(${(1 - e) * (h + 12)}px)`;
      wrap = { clipPath: `inset(-20px -20px 0 -20px)` };
    }
    return (
      <div key={i} style={{ position: "absolute", left: stripX(i), top: stripY(i), height: h, ...wrap }}>
        <div style={{ position: "relative", ...inner }}>
          <TextStrip text={t} role={role} color={strip} padX={padX} padY={padY} seed={`${seed}-${i}`} rough={8} />
        </div>
      </div>
    );
  });

  const last = lines.length - 1;
  const subRole = earwormType.subLabel;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      {els}
      {sub && f >= delay + subDelay && (
        <div style={{ position: "absolute", left: stripX(last) + subOffset.x, top: stripY(last) + h + subOffset.y }}>
          {/* black tape strip: darker than the ground paper, torn ends (earworm-C §4 "sub-label on a black tape strip") */}
          <TextStrip text={sub} role={subRole} color="#050505" padX={16} padY={9} seed={`${seed}-sub`} rough={5} outline="1px solid #1c1c1c" />
        </div>
      )}
    </div>
  );
};
