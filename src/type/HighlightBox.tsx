import React, { useRef } from "react";
import { useVideoConfig } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { paperDesk } from "../tokens/colors";
import { DUR, RATE } from "../tokens/motion";
import { paperDeskType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim, prog, useInlineWidth, useRefFrames, useSecToFrames } from "./shared";

export type HighlightBoxProps = {
  children: React.ReactNode;
  /** type role, default paperDeskType.title (cap 69, ink #482F1D) */
  role?: TypeRole;
  /** start frame inside the enclosing Sequence */
  delay?: number;
  /** wipe length in frames, default DUR.boxWipe (1.07 s) */
  duration?: number;
  /** flat = paper desk title box; glow = neon on near-black; sharpenInside = text soft outside, crisp inside the box */
  variant?: "flat" | "glow" | "sharpenInside";
  /** box colour, default paperDesk.highlight #F2E600 */
  color?: string;
  /** ink colour, default role colour */
  ink?: string;
  style?: React.CSSProperties;
};

/** starting bar width, analysis/porsche-part3-stills.md §7 M1 (8 px @640 = 24 px @1080p) */
const START_BAR = 24;

/**
 * Paper-desk signature: text on a flat yellow box. The box wipes L→R (ease boxWipe) from a 24 px bar and the
 * text is revealed by the same clip. Padding scales with cap: 0.5 cap top/bottom, 50/69 cap left, 32/69 cap right.
 */
export const HighlightBox: React.FC<HighlightBoxProps> = ({
  children,
  role = paperDeskType.title,
  delay = 0,
  duration,
  variant = "flat",
  color = paperDesk.highlight,
  ink,
  style,
}) => {
  const f = useDrawingFrame();
  const toF = useSecToFrames();
  const p = prog(f, delay, duration ?? toF(DUR.boxWipe), "boxWipe");
  const cap = role.cap;
  const pad = `${cap * 0.5}px ${(32 / 69) * cap}px ${cap * 0.5}px ${(50 / 69) * cap}px`;
  const base: React.CSSProperties = { ...typeStyle(role), ...(ink ? { color: ink } : null) };
  const inset = `inset(0 calc((100% - ${START_BAR}px) * ${1 - p}) 0 0)`;

  const text = <div style={{ ...capTrim }}>{children}</div>;
  const box = (extra?: React.CSSProperties) => (
    <div style={{ ...base, display: "inline-block", padding: pad, background: color, clipPath: inset, ...extra }}>{text}</div>
  );

  if (variant === "glow") {
    // core yellow + stacked halos ≈8 px and ≈30 px (porsche M1c); the halo grows with the box
    const g = 0.4 + 0.6 * p;
    return (
      <div style={{ display: "inline-block", filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 30px rgba(242,230,0,${0.55 * g}))`, ...style }}>
        {box()}
      </div>
    );
  }
  if (variant === "sharpenInside") {
    // S107: defocused text outside the box, crisp ink inside it
    return (
      <div style={{ position: "relative", display: "inline-block", ...style }}>
        <div style={{ ...base, padding: pad, color: "#8C857F", filter: "blur(3px)", opacity: 0.85 }}>{text}</div>
        <div style={{ position: "absolute", left: 0, top: 0 }}>{box()}</div>
      </div>
    );
  }
  return <div style={{ display: "inline-block", ...style }}>{box()}</div>;
};

export type SubtitleRevealProps = {
  children: React.ReactNode;
  role?: TypeRole;
  /** start frame; default = 5 f @30 after `titleDelay` */
  delay?: number;
  /** reveal speed in px/s (design px), default RATE.subtitleRevealPxPerSec (36 px/f @30) */
  pxPerSec?: number;
  style?: React.CSSProperties;
};

/** Plain L→R subtitle reveal, ≈linear 36 px/f @30 (analysis/porsche-part3-stills.md §7 M2). */
export const SubtitleReveal: React.FC<SubtitleRevealProps> = ({
  children,
  role = paperDeskType.subtitle,
  delay,
  pxPerSec = RATE.subtitleRevealPxPerSec,
  style,
}) => {
  const f = useDrawingFrame();
  const { fps } = useVideoConfig();
  const toRef = useRefFrames();
  const ref = useRef<HTMLDivElement>(null);
  const w = useInlineWidth(ref);
  const start = delay ?? toRef(5, 30);
  const px = (Math.max(0, f - start) / fps) * pxPerSec;
  const p = w > 0 ? Math.min(1, px / w) : 0;
  return (
    <div
      ref={ref}
      style={{ ...typeStyle(role), display: "inline-block", clipPath: `inset(-0.3em ${(1 - p) * 100}% -0.3em 0)`, ...style }}
    >
      {children}
    </div>
  );
};
