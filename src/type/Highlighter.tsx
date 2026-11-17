import React, { useId } from "react";
import { useDrawingFrame } from "../lib/time";
import { hashSeed } from "../lib/random";
import { rand } from "../lib/random";
import { paperDesk, voxEditorial, voxExplainer } from "../tokens/colors";
import type { CurveName } from "../tokens/easing";
import { DUR } from "../tokens/motion";
import { fontSizeFor, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim, prog, useSecToFrames } from "./shared";

export type HighlighterProps = {
  children: React.ReactNode;
  /** text style (also gives the cap height). Omit to inherit the surrounding font and pass `cap`. */
  role?: TypeRole;
  /** cap height in design px when no role is given */
  cap?: number;
  delay?: number;
  /** swipe length in frames; default DUR.highlighter (marker) or 0.3 s (editorial) */
  duration?: number;
  /** marker = Vox #FFF80F multiply band; editorial = mustard dry-brush;
   *  paperDesk = lemon #E6DE17-ish multiply sweep (bar first, then a fast sweep with a long tail) */
  variant?: "marker" | "editorial" | "paperDesk";
  /** override the pigment colour (always multiplied) */
  color?: string;
  /** override the swipe curve (token name) */
  ease?: CurveName;
  /** editorial only: linear fade-out of the stroke after it lands */
  fadeOut?: boolean;
  /** frame the fade-out starts, default end of the swipe */
  fadeOutAt?: number;
  /** fade length in frames, default 2.4 s */
  fadeOutDuration?: number;
  /** overrides: explicit band width / height (design px) instead of measuring the text */
  width?: number;
  height?: number;
  seed?: string;
  style?: React.CSSProperties;
};

/**
 * Highlighter pass behind text (mix-blend-mode multiply, so the ink stays dark).
 * marker: height 1.3 cap, 10 px overhang, ragged ends (analysis/epigenetics.md §4/§6).
 * editorial: mustard #BB923A, height 1.7 cap, starts 0.1 em before the first glyph and overruns 0.2 em,
 * accelerating stroke (ease [.11,0,.5,0]) ≈0.3 s regardless of length (analysis/highlight.md §7–§9).
 */
export const Highlighter: React.FC<HighlighterProps> = ({
  children,
  role,
  cap: capProp,
  delay = 0,
  duration,
  variant = "marker",
  color: colorProp,
  ease: easeProp,
  fadeOut = false,
  fadeOutAt,
  fadeOutDuration,
  width,
  height,
  seed = "hl",
  style,
}) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const id = useId().replace(/:/g, "");
  const editorial = variant === "editorial";
  const desk = variant === "paperDesk";
  const cap = role?.cap ?? capProp ?? 40;
  // paper desk sweeps ≈22 f @30 with the box-wipe curve (analysis/porsche-part1.md §7)
  const dur = duration ?? toF(editorial ? 0.3 : desk ? 0.73 : DUR.highlighter);
  const p = prog(f, delay, dur, easeProp ?? (editorial ? "fogClear" : desk ? "boxWipe" : "highlighter"));
  const h = height ?? cap * (editorial ? 1.7 : 1.3);
  const em = role ? fontSizeFor(role) : cap / 0.7;
  const left = width !== undefined ? 0 : editorial ? -0.1 * em : -10;
  const right = editorial ? -0.2 * em : -10;
  const fadeStart = fadeOutAt ?? delay + dur;
  const opacity = fadeOut ? 1 - prog(f, fadeStart, fadeOutDuration ?? toF(2.4), "linear") : 1;
  const color = colorProp ?? (editorial ? voxEditorial.highlighter : desk ? paperDesk.highlight : voxExplainer.highlighter);
  const s = hashSeed(seed) % 1000;

  // dry-brush streaks: seeded horizontal bands of varying lightness
  const streaks = editorial
    ? (() => {
        const n = 14;
        const stops: string[] = [];
        for (let i = 0; i < n; i++) {
          const a = i / n, b = (i + 1) / n;
          const l = rand(`${seed}-s${i}`);
          const c = l > 0.6 ? `rgba(255,245,215,${(0.03 + 0.06 * l).toFixed(2)})` : l < 0.2 ? "rgba(90,60,10,0.07)" : "rgba(0,0,0,0)";
          stops.push(`${c} ${(a * 100).toFixed(1)}% ${(b * 100).toFixed(1)}%`);
        }
        return `linear-gradient(to bottom, ${stops.join(", ")})`;
      })()
    : "none";

  return (
    <span
      style={{ ...(role ? typeStyle(role) : null), position: "relative", display: "inline-block", ...capTrim, ...style }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id={id} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency={editorial ? "0.035 0.5" : "0.03 0.35"} numOctaves={2} seed={s} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={editorial ? 22 : 12} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span
        aria-hidden
        style={{
          position: "absolute",
          left,
          right: width !== undefined ? undefined : right,
          width,
          top: `calc(50% - ${h / 2}px)`,
          height: h,
          mixBlendMode: "multiply",
          filter: `url(#${id})`,
          opacity,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            background: `${streaks}, ${color}`,
            // marker band: slightly skewed ends; clip L→R with progress
            clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
            borderRadius: editorial ? 0 : 3,
          }}
        />
      </span>
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};
