import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { rand } from "../lib/random";
import { useDrawingFrame } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { earwormType, typeStyle } from "../tokens/type";
import { capTrim } from "../type/shared";
import { Layer, RevealPath } from "../explainer/DrawPath";
import { wobblyLine } from "../explainer/geometry";

const UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOW = "abcdefghijklmnopqrstuvwxyz";

/**
 * Random-letter decode of `text` at frame `f`: every glyph shows a random letter (re-drawn each drawing) until its own
 * resolve time. Glyphs resolve in random order across [start, end]; `lastWordAtEnd` makes the final word resolve inside the
 * last 5 f, exactly at `end` (the surname, earworm-B §15 rule 5).
 */
const decode = (text: string, f: number, start: number, end: number, seed: string, pool: string, lastWordAtEnd: boolean): string => {
  const lastSpace = text.lastIndexOf(" ");
  return Array.from(text)
    .map((ch, i) => {
      if (ch === " ") return ch;
      const isLast = lastWordAtEnd && i > lastSpace;
      const t = isLast ? end - 5 + Math.round(rand(`${seed}-r-${i}`) * 3) : start + (end - start) * (0.25 + 0.7 * rand(`${seed}-r-${i}`));
      if (f >= t) return ch;
      return pool[Math.floor(rand(`${seed}-g-${i}-${Math.round(f)}`) * pool.length) % pool.length];
    })
    .join("");
};

export type DecodeNameCardProps = {
  /** "FREDARA HADLEY" — the LAST word is the surname that resolves at `resolveAt` */
  name: string;
  /** serif title ("Ethnomusicologist") */
  title?: string;
  /** italic serif affiliation ("The Juilliard School") */
  affiliation?: string;
  /** left edge / baseline of the name, design px (x 1146, baselines 511 / 577 / 635, earworm-B §5) */
  x?: number;
  y?: number;
  /** frame of the cut: the build starts here (sequence-relative) */
  delay?: number;
  /** build length in frames (20–22) when `resolveAt` is not given */
  buildFrames?: number;
  /** frame the surname resolves: spoken onset +3…+5 (earworm-B §15 rule 5). Overrides `buildFrames`. */
  resolveAt?: number;
  /** frame the card exits: X in 2 strokes over 3 f, plus a 5 f fade (on ones) */
  exitAt?: number;
  /** box the exit X covers (design px, relative to x, y−cap) */
  exitBox?: { w: number; h: number };
  seed?: string;
};

/**
 * Interview name card. Name in condensed periwinkle caps with tracking +1 em → 0 and a random-letter decode; serif title and
 * italic affiliation decode from scattered glyphs. Builds 20–22 f from the cut, the surname resolves at its spoken onset
 * +3…+5. Exit: X (2 strokes, 3 f) + 5 f fade. analysis/earworm-B.md §4, §7, §9 `NameCard`, §15 rule 5.
 */
export const DecodeNameCard: React.FC<DecodeNameCardProps> = ({
  name, title, affiliation, x = 1146, y = 511, delay = 0, buildFrames = 21, resolveAt, exitAt, exitBox = { w: 580, h: 170 }, seed = "nc",
}) => {
  const f = useDrawingFrame();
  const raw = useCurrentFrame(); // fade is on ones
  const end = resolveAt ?? delay + buildFrames;
  const nameRole = earwormType.name;
  const trk = interpolate(ease("enter")(interpolate(f, [delay, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), [0, 1], [1, 0]);
  if (f < delay) return null;
  const line = (cap: number, baseline: number, children: React.ReactNode, extra: React.CSSProperties) => (
    <div style={{ position: "absolute", left: x, top: baseline - cap, whiteSpace: "nowrap", ...capTrim, ...extra }}>{children}</div>
  );
  const fade = exitAt === undefined ? 1 : 1 - interpolate(raw, [exitAt, exitAt + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xp = (a: number, b: number) =>
    exitAt === undefined ? 0 : interpolate(f, [exitAt + a, exitAt + b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bx = x - 14;
  const by = y - nameRole.cap - 14;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade }}>
      {line(nameRole.cap, y, decode(name, f, delay, end, `${seed}n`, UP, true), {
        ...typeStyle({ ...nameRole, leading: 1 }),
        letterSpacing: `${trk}em`,
      })}
      {title &&
        line(earwormType.nameTitle.cap, y + 66, decode(title, f, delay, end - 2, `${seed}t`, LOW, false), {
          ...typeStyle({ ...earwormType.nameTitle, leading: 1 }),
        })}
      {affiliation &&
        line(earwormType.nameAffiliation.cap, y + 124, decode(affiliation, f, delay, end, `${seed}a`, LOW, false), {
          ...typeStyle({ ...earwormType.nameAffiliation, leading: 1 }),
        })}
      {exitAt !== undefined && f >= exitAt && (
        <Layer>
          <RevealPath points={wobblyLine({ x: bx, y: by }, { x: bx + exitBox.w, y: by + exitBox.h }, `${seed}x1`, 3, 0.01)} p={xp(0, 2)} color={voxEarworm.accent} width={7} />
          <RevealPath points={wobblyLine({ x: bx + exitBox.w, y: by }, { x: bx, y: by + exitBox.h }, `${seed}x2`, 3, 0.01)} p={xp(1.5, 3)} color={voxEarworm.accent} width={7} />
        </Layer>
      )}
    </div>
  );
};
