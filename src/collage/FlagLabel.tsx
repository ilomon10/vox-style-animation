import React from "react";
import { useDrawingFrame, useSec } from "../lib/time";
import { voxExplainer } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { DUR } from "../tokens/motion";
import { fontSizeFor, typeStyle, voxType } from "../tokens/type";
import { type Place, placeStyle } from "./util";

export type FlagLabelProps = Place & {
  text: string;
  /** default 259 (measured), grown to fit long text */
  width?: number;
  height?: number;
  color?: string;
  /** end-cut skew, degrees (≈ −5°) */
  skew?: number;
  delay?: number;
  /** frames; default DUR.flagUnfurl */
  duration?: number;
  /** thin white leader line from the flag's left edge: end point relative to the flag's left-middle */
  leader?: { dx: number; dy: number; width?: number };
  /** frames the leader takes to draw after the unfurl completes (default 4) */
  leaderDraw?: number;
};

/**
 * Yellow serif flag label, ≈259×76, slanted right end. Unfurls over 16 f: scaleX .48 → 1 on
 * ease "unfurl" while a darker back-face curl strip at the right end shrinks to nothing
 * (epigenetics.md §7). Optional white leader line draws afterwards.
 */
export const FlagLabel: React.FC<FlagLabelProps> = ({
  text,
  width: widthProp,
  height = 76,
  color = voxExplainer.flag,
  skew = -5,
  delay = 0,
  duration,
  leader,
  leaderDraw = 4,
  ...place
}) => {
  // 259 px measured; grow for long words (serif ≈ 0.58 em per glyph + 18 px padding each side)
  const width = widthProp ?? Math.max(259, Math.ceil(fontSizeFor(voxType.flag) * 0.58 * text.length + 48));
  const f = useDrawingFrame();
  const sec = useSec();
  const dur = duration ?? sec(DUR.flagUnfurl);
  if (f < delay) return null;
  const t = Math.min(1, (f - delay) / dur);
  const e = ease("unfurl")(t);
  const sx = 0.48 + 0.52 * e;
  const curlW = (1 - e) * 46 * sx; // back-face strip, px in screen space
  const cut = Math.tan((Math.abs(skew) * Math.PI) / 180) * height; // horizontal run of the slanted end
  const flag = `polygon(0 0, ${width}px 0, ${width - cut}px ${height}px, 0 ${height}px)`;
  const lt = leader ? Math.min(1, Math.max(0, (f - delay - dur) / leaderDraw)) : 0;

  return (
    <div style={placeStyle(place, width, height)}>
      {leader && lt > 0 && (
        <svg width={1} height={1} style={{ position: "absolute", left: 0, top: height / 2, overflow: "visible" }}>
          <line
            x1={0}
            y1={0}
            x2={leader.dx * lt}
            y2={leader.dy * lt}
            stroke="#E8E4E0"
            strokeWidth={leader.width ?? 3}
            strokeLinecap="round"
          />
        </svg>
      )}
      <div style={{ position: "absolute", inset: 0, transform: `scaleX(${sx})`, transformOrigin: "0 50%" }}>
        <div style={{ position: "absolute", inset: 0, clipPath: flag, background: color }}>
          <div
            style={{
              position: "absolute",
              left: 18,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={typeStyle(voxType.flag)}>{text}</span>
          </div>
        </div>
      </div>
      {curlW > 0.5 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="flagCurl" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#B19E22" />
              <stop offset="1" stopColor="#CDB92E" />
            </linearGradient>
          </defs>
          {/* back face (measured #B19E22) mirrored at the slanted end */}
          <polygon
            points={`${width * sx - curlW},0 ${width * sx},0 ${(width - cut) * sx},${height} ${(width - cut) * sx - curlW},${height}`}
            fill="url(#flagCurl)"
          />
        </svg>
      )}
    </div>
  );
};
