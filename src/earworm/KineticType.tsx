import React from "react";
import { rand } from "../lib/random";
import { useDrawingFrame } from "../lib/time";
import { hexToRgb } from "../effects/shared";
import { voxEarworm } from "../tokens/colors";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";
import { distressMask } from "./shared";

export type KineticWordProps = {
  /** the word (or short phrase) */
  text: string;
  /** frame the word pops in, one drawing, no scale or fade (earworm-B §7 "Kinetic word pop"); sequence-relative */
  delay?: number;
  /** frame the word is removed; with `glitch: "white"` the last `glitchFrames` frames flicker white first */
  until?: number;
  /** "rgb": RGB-split glitch-in resolving over 2–6 f (lyric line, earworm-D §4); "white": 2–5 random letters turn white
   *  per drawing for 3–5 f after the pop and before `until` (earworm-B §6/§7) */
  glitch?: "rgb" | "white";
  glitchFrames?: number;
  /** centre of the word, design px */
  x?: number;
  y?: number;
  role?: TypeRole;
  color?: string;
  /** max RGB offset, design px (≈6) */
  rgbSplitPx?: number;
  seed?: string;
  style?: React.CSSProperties;
};

/**
 * Kinetic keyword: one-drawing pop, optional RGB glitch-in or white-letter flicker swap.
 * analysis/earworm-B.md §7 (pop, flicker), earworm-D.md §4 (`LyricLine` glitchInF 4, rgbSplitPx 6).
 */
export const KineticWord: React.FC<KineticWordProps> = ({
  text, delay = 0, until, glitch, glitchFrames, x = 960, y = 540, role = earwormType.keyword, color, rgbSplitPx = 6, seed = "kw", style,
}) => {
  const f = useDrawingFrame();
  if (f < delay || (until !== undefined && f >= until)) return null;
  const c = color ?? role.color;
  const gf = glitchFrames ?? (glitch === "rgb" ? 4 : 4);
  const base: React.CSSProperties = { whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...role, color: c, leading: 1 }), ...distressMask(Math.floor(rand(seed) * 900), 0), ...style };
  const inLeadIn = f < delay + gf;
  const inLeadOut = until !== undefined && f >= until - gf;
  const di = Math.round(f);
  const place: React.CSSProperties = { position: "absolute", left: x, top: y - role.cap / 2, transform: "translateX(-50%)" };

  if (glitch === "rgb" && inLeadIn) {
    const [r, g, b] = hexToRgb(c.length === 7 ? c : "#ffffff");
    const j = (k: string) => (rand(`${seed}-${k}-${di}`) * 2 - 1) * rgbSplitPx * (1 - (f - delay) / gf);
    const layer = (col: string, dx: number, dy: number) => (
      <div style={{ ...place, ...base, color: col, mixBlendMode: "screen", transform: `translate(calc(-50% + ${dx}px), ${dy}px)` }}>{text}</div>
    );
    return (
      <>
        {layer(`rgb(${r},0,0)`, j("rx"), j("ry") * 0.4)}
        {layer(`rgb(0,${g},0)`, j("gx") * 0.3, 0)}
        {layer(`rgb(0,0,${b})`, j("bx"), j("by") * 0.4)}
      </>
    );
  }
  if (glitch === "white" && (inLeadIn || inLeadOut)) {
    const n = Math.round(2 + rand(`${seed}-n-${di}`) * 3); // 2–5 white letters per drawing
    const idx = new Set<number>();
    for (let k = 0; k < n; k++) idx.add(Math.floor(rand(`${seed}-w-${di}-${k}`) * text.length));
    return (
      <div style={{ ...place, ...base }}>
        {Array.from(text).map((ch, i) => (
          <span key={i} style={{ color: idx.has(i) ? voxEarworm.white : undefined }}>{ch}</span>
        ))}
      </div>
    );
  }
  return <div style={{ ...place, ...base }}>{text}</div>;
};

export type KineticVoiceLine = {
  words: { text: string; f: number }[];
  /** cap height of this line (default role cap 240); single words can be much bigger (≥ 820 px fills the height) */
  cap?: number;
};

export type KineticVoiceProps = {
  /** lines of words; `f` = the word's syllable ONSET frame (use cue `frame_onset`), sequence-relative */
  lines: KineticVoiceLine[];
  /** "speech": archival speech words pop `lead` = 4 f BEFORE their syllable (3–6); "sung": 0…+3 after (earworm-D §4, §15 R5) */
  mode?: "speech" | "sung";
  /** override the lead in frames (positive = pops earlier than `f`) */
  leadF?: number;
  /** vertical centre of the current line, design px */
  y?: number;
  /** word gap, in caps */
  gap?: number;
  /** how many older lines stay on screen after a line-feed (the new line feeds the previous ones up) */
  keepPrev?: number;
  role?: TypeRole;
  seed?: string;
  style?: React.CSSProperties;
};

/**
 * Full-bleed kinetic voice words of an archival speaker: one word per drawing, held until the next, spelled as heard
 * ("TO EAR", "LOVIN"). Words are NOT clipped — the frame crops them — and the component carries no z-index: stack it BELOW
 * cut-outs so props sit in front of the type (earworm-D §4–5). A new line feeds the previous line up by one line pitch.
 */
export const KineticVoice: React.FC<KineticVoiceProps> = ({
  lines, mode = "speech", leadF, y = 540, gap = 0.28, keepPrev = 1, role = earwormType.kinetic, seed = "kv", style,
}) => {
  const f = useDrawingFrame();
  const lead = leadF ?? (mode === "speech" ? 4 : 0);
  const pop = (fr: number) => fr - lead;
  // current line = last line with a popped word
  let cur = -1;
  lines.forEach((l, i) => {
    if (l.words.some((w) => f >= pop(w.f))) cur = i;
  });
  if (cur < 0) return null;
  const pitchOf = (i: number) => (lines[i].cap ?? role.cap) * 1.12;
  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {lines.map((l, i) => {
        if (i > cur || cur - i > keepPrev) return null;
        let yy = y;
        for (let k = cur - 1; k >= i; k--) yy -= pitchOf(k);
        const cap = l.cap ?? role.cap;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: "50%", top: yy - cap / 2, whiteSpace: "nowrap", transform: "translateX(-50%)", ...capTrim, ...typeStyle({ ...role, cap, leading: 1 }), ...distressMask(Math.floor(rand(`${seed}-${i}`) * 900), 0) }}
          >
            {l.words.map((w, j) => (
              <span key={j} style={{ display: "inline-block", marginLeft: j ? cap * gap : 0, visibility: f >= pop(w.f) ? "visible" : "hidden" }}>{w.text}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
