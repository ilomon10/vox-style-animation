import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { typeStyle } from "../tokens/type";
import { packaging } from "../tokens/colors";
import { capTrim } from "./shared";

// New colour value, to move into src/tokens/colors.ts.
/** subtitle ink: white */
export const SUBTITLE_INK = packaging.subtitleInk;

export type SubtitleItem = {
  /** one or two lines (a "\n" breaks the line) */
  text: string;
  /** seconds after the scene start: on / off (hard, on ones) */
  t: number;
  until: number;
};
export type SubtitlesProps = {
  items: SubtitleItem[];
  /** left edge / BASELINE of the last line, design px (default 100 / 994: AM 3:51 x 100, baseline 92 % H) */
  x?: number;
  baselineY?: number;
  /** cap height, design px (default 54: AM 3:51 measures ~55 px) */
  cap?: number;
  style?: React.CSSProperties;
};

/**
 * Burned-in subtitles for non-English speech (analysis/vox-framework-coverage.md Build 6, AM 3:51): white bold grotesque, left-aligned
 * at x 100, baseline 92 % H, at most 2 lines, soft shadow, no box, hard on and off ("on ones": raw frame, no fade). Inside <DesignSpace>.
 */
export const Subtitles: React.FC<SubtitlesProps> = ({ items, x = 100, baselineY = 994, cap = 54, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const it = items.find((i) => frame >= Math.round(i.t * fps) && frame < Math.round(i.until * fps));
  if (!it) return null;
  return (
    <div
      style={{
        position: "absolute", left: x, bottom: 1080 - baselineY, whiteSpace: "pre", ...capTrim,
        ...typeStyle({ font: "VOX_SANS", cap, weight: 700, color: SUBTITLE_INK, leading: 1.25 }),
        textShadow: "0 2px 8px rgba(0,0,0,0.55)", ...style,
      }}
    >
      {it.text.split("\n").slice(0, 2).join("\n")}
    </div>
  );
};
