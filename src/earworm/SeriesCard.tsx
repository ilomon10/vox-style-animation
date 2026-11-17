import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Layer, RevealPath } from "../explainer/DrawPath";
import { wobblyLine } from "../explainer/geometry";
import { hexToRgb } from "../effects/shared";
import { rand } from "../lib/random";
import { voxEarworm } from "../tokens/colors";
import { earwormType, typeStyle } from "../tokens/type";
import { capTrim } from "../type/shared";
import { distressMask } from "./shared";

export type SeriesCardProps = {
  /** your own series name — never a real logo. */
  title?: string;
  /** small line carrying the yellow marker underline */
  tagline?: string;
  /** frame the build starts (sequence-relative) */
  delay?: number;
  /** glitch-slice build length (18 f, earworm-D §7 "Logo glitch") */
  buildFrames?: number;
  /** residual glitch cadence: 2 changed + 2 held frames every 4 f (earworm-D §9 `EarwormEndCard`) */
  periodFrames?: number;
  changedFrames?: number;
  /** horizontal slice bands */
  slices?: number;
  /** card colour (#141414) */
  bg?: string;
  seed?: string;
};

/**
 * Generic series end card: extended heavy grotesque in grey on #141414, a glitch-slice build over 18 f (letters arrive in random
 * order through horizontally offset slices with RGB fringes), then a residual glitch of 2 changed + 2 held frames every 4 f,
 * and a yellow marker underline (#F8F005, ≈170×16) on the tagline. Runs on ones (the glitch period is frame-exact).
 * analysis/earworm-D.md §4, §7, §9.
 */
export const SeriesCard: React.FC<SeriesCardProps> = ({
  title = "SOUNDTRACK", tagline = "A KIT SERIES", delay = 0, buildFrames = 18, periodFrames = 4, changedFrames = 2, slices = 7, bg = "#141414", seed = "sc",
}) => {
  const f = useCurrentFrame() - delay;
  const role = earwormType.seriesCard;
  const chars = Array.from(title);
  const n = chars.length;
  const p = Math.min(1, Math.max(0, f / buildFrames));
  // random arrival order → set of visible letters
  const order = chars.map((_, i) => ({ i, k: rand(`${seed}-o-${i}`) })).sort((a, b) => a.k - b.k).map((o) => o.i);
  const shown = new Set(order.slice(0, Math.round(p * n)));
  // slice offsets: large and re-rolled every other frame during the build, then glitch bursts
  const building = f < buildFrames;
  const post = f - buildFrames;
  const glitching = !building && post >= 0 && post % periodFrames < changedFrames;
  const stepIdx = building ? Math.floor(f / 2) : Math.floor(post / periodFrames);
  const amp = building ? 150 * (1 - p) ** 1.4 + 6 : glitching ? 38 : 0;
  const bandH = 1 / slices;
  const fringe = building ? 7 * (1 - p) + 2 : glitching ? 6 : 0;
  const [cr, cg, cb] = hexToRgb(role.color);
  if (f < 0) return <div style={{ position: "absolute", inset: 0, background: bg }} />;

  const text = (visible: Set<number> | null) =>
    chars.map((ch, i) => (
      <span key={i} style={{ visibility: !visible || visible.has(i) ? "visible" : "hidden" }}>{ch}</span>
    ));
  const base: React.CSSProperties = { position: "absolute", left: "50%", top: 470, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...role, leading: 1 }), ...distressMask(540, 40) };

  const bands = Array.from({ length: slices }, (_, b) => {
    // in a glitch burst only a few bands move
    const moved = building || (glitching && rand(`${seed}-m-${stepIdx}-${b}`) < 0.5);
    const dx = moved ? (rand(`${seed}-dx-${stepIdx}-${b}`) * 2 - 1) * amp : 0;
    // bands overlap by 1 px so no hairline seams show at rest
    const clip = `inset(calc(${b * bandH * 100}% - 1px) 0 calc(${(1 - (b + 1) * bandH) * 100}% - 1px) 0)`;
    const layer = (color: string, ox: number, blend: boolean) => (
      <div key={`${b}-${color}`} style={{ ...base, color, clipPath: clip, mixBlendMode: blend ? "screen" : undefined, transform: `translateX(calc(-50% + ${dx + ox}px))` }}>
        {text(shown.size === n && !building ? null : shown)}
      </div>
    );
    return fringe > 0.5 && moved ? (
      <React.Fragment key={b}>
        {layer(`rgb(${cr},0,0)`, fringe, true)}
        {layer(`rgb(0,${cg},0)`, 0, true)}
        {layer(`rgb(0,0,${cb})`, -fringe, true)}
      </React.Fragment>
    ) : (
      <React.Fragment key={b}>{layer(role.color, 0, false)}</React.Fragment>
    );
  });
  const taglineIn = f >= buildFrames - 4;
  const ul = interpolate(f, [buildFrames, buildFrames + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, background: bg }}>
      {bands}
      {taglineIn && (
        <div style={{ position: "absolute", left: 960, top: 640, transform: "translateX(-50%)", whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.subLabel, leading: 1, color: "#D6D6D6", tracking: 0.3 }) }}>{tagline}</div>
      )}
      <Layer>
        <RevealPath points={wobblyLine({ x: 960 - 85, y: 690 }, { x: 960 + 85, y: 689 }, `${seed}u`, 1.2, 0.003)} p={ul} color={voxEarworm.underline} width={16} cap="butt" />
      </Layer>
    </div>
  );
};
