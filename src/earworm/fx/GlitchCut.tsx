import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { rand } from "../../lib/random";
import { ease } from "../../tokens/easing";
import { SfxList, type SfxPlacement } from "./sfx";
import { FxLayer, clamp01, type FxState } from "./util";

/**
 * Glitch end card (earworm-D s8/s12 #49-52): 6 f dip (the breath) -> 4 f zoom-blur -> HARD cut on a bass hit (a blank frame, then the
 * logo) -> 18 f glitch build (5 steps, 4 f apart) with glitch ticks on the 2nd and 3rd step (cut +5, +9) -> a 4 f glitch period
 * (2 changed + 2 held frames). The music keeps playing to the LAST frame: no fade (see `glitchMusicGain`).
 */
export const GLITCH = { dip: 6, blur: 4, build: 18, step: 4, steps: 5, period: 4, dipBrightness: 0.45, musicDipDb: -17 } as const;

export type GlitchPlan = { dipStart: number; blurStart: number; cut: number; buildEnd: number; sfx: SfxPlacement[] };
export const glitchCutPlan = (at: number): GlitchPlan => {
  const cut = at + GLITCH.dip + GLITCH.blur;
  return {
    dipStart: at, blurStart: at + GLITCH.dip, cut, buildEnd: cut + 1 + GLITCH.build,
    sfx: [
      { name: "bass_hit", peak: cut },
      { name: "glitch_tick", peak: cut + 1 + GLITCH.step },
      { name: "glitch_tick", peak: cut + 1 + 2 * GLITCH.step },
    ],
  };
};

/** Music gain (linear): -17 dB under the zoom-blur, back at the cut, never faded out. */
export const glitchMusicGain = (f: number, at: number) => {
  const p = glitchCutPlan(at);
  return f >= p.blurStart && f < p.cut ? Math.pow(10, GLITCH.musicDipDb / 20) : 1;
};

export type GlitchCutProps = {
  /** first frame of the dip, relative to the enclosing Sequence */
  at: number;
  outgoing: React.ReactNode;
  /** the end card (TRANSPARENT background: GlitchCut supplies the ground); `reveal` = 0..1 fraction of the logo built */
  card: (reveal: number) => React.ReactNode;
  seed?: string;
  sfx?: boolean;
  /** picture brightness during the 6 f breath (default GLITCH.dipBrightness; 1 = no picture dip) */
  dipBrightness?: number;
};

export const GlitchCut: React.FC<GlitchCutProps> = ({ at, outgoing, card, seed = "glitch", sfx = true, dipBrightness = GLITCH.dipBrightness }) => {
  const f = useCurrentFrame();
  const p = glitchCutPlan(at);
  let content: React.ReactNode;
  if (f < p.cut) {
    let fx: FxState = {};
    if (f >= p.blurStart) {
      const t = ease("accelerate")(clamp01((f - p.blurStart + 1) / GLITCH.blur));
      fx = { brightness: dipBrightness, scale: 1 + 0.35 * t, blur: 12 * t, radial: 0.35 * t };
    } else if (f >= p.dipStart) {
      fx = { brightness: 1 - (1 - dipBrightness) * clamp01((f - p.dipStart + 1) / GLITCH.dip) };
    }
    content = <FxLayer {...fx}><Sequence from={0} layout="none">{outgoing}</Sequence></FxLayer>;
  } else if (f === p.cut) {
    content = <AbsoluteFill style={{ background: "#0A0A0A" }} />; // the blank frame
  } else {
    const rel = f - p.cut - 1;
    const building = rel < GLITCH.build;
    const step = Math.min(GLITCH.steps, Math.floor(rel / GLITCH.step) + 1);
    const reveal = building ? step / GLITCH.steps : 1;
    // residual: 4 f period, 2 changed + 2 held (the seed index only changes on the first half)
    const per = Math.floor(rel / GLITCH.period);
    const live = building || rel % GLITCH.period < 2;
    const idx = building ? step : per;
    const k = live ? 1 : 0.0;
    const off = (j: number) => (rand(`${seed}-${idx}-${j}`) - 0.5) * 2;
    const bands = 6;
    const fringe = 5 * k;
    content = (
      <AbsoluteFill style={{ filter: live ? `drop-shadow(${fringe}px 0 0 rgba(255,40,80,.7)) drop-shadow(${-fringe}px 0 0 rgba(0,210,255,.7))` : undefined }}>
        {Array.from({ length: bands }, (_, j) => (
          <AbsoluteFill key={j} style={{ clipPath: `inset(${(j / bands) * 100}% 0 ${100 - ((j + 1) / bands) * 100}% 0)`, transform: `translateX(${live && rand(`${seed}-${idx}-b${j}`) > 0.5 ? off(j) * 40 : 0}px)` }}>
            {card(reveal)}
          </AbsoluteFill>
        ))}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {content}
      {sfx && <SfxList items={p.sfx} />}
    </AbsoluteFill>
  );
};
