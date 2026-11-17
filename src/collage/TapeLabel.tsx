import React from "react";
import { useDrawingFrame, useSec } from "../lib/time";
import { rand } from "../lib/random";
import { voxExplainer } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { DUR } from "../tokens/motion";
import { typeStyle, voxType } from "../tokens/type";
import { PaperClip } from "./Props";
import { type Place, placeStyle } from "./util";

export type TapeLabelProps = Place & {
  /** all-caps marker text; shown in `ink` */
  text: string;
  /** optional second word, written in markerBlue (#596B8D) */
  text2?: string;
  /** tape colour: lime (#DDD031) or black (#221F21, text defaults to yellow #A39334) */
  tape?: "lime" | "black";
  ink?: string;
  ink2?: string;
  /** frames from Sequence start */
  delay?: number;
  /** unfurl length in frames; default DUR.tapeUnfurl */
  duration?: number;
  /** frames per character during write-on (default 2 = one drawing @24 fps ≈ 12 char/s) */
  framesPerChar?: number;
  /** show the paper clip at the left end */
  clip?: boolean;
  /** tape height, design px */
  height?: number;
};

/**
 * Marker-on-tape label: the tape unfurls from 35 % width over DUR.tapeUnfurl (a darker curl at the
 * right end flattens), then the text is written ≈1 character per drawing, each glyph revealed by a
 * left→right clip over one drawing (epigenetics.md §7/§9). Letters carry ±2° tilt and an uneven
 * baseline, seeded per glyph.
 */
export const TapeLabel: React.FC<TapeLabelProps> = ({
  text,
  text2,
  tape = "lime",
  ink,
  ink2,
  delay = 0,
  duration,
  framesPerChar = 2,
  clip = false,
  height = 64,
  rotate = 0,
  ...rest
}) => {
  const f = useDrawingFrame();
  const sec = useSec();
  const dur = duration ?? sec(DUR.tapeUnfurl);
  if (f < delay) return null;

  const base = tape === "lime" ? voxExplainer.tape : voxExplainer.tapeBlack;
  const c1 = ink ?? (tape === "lime" ? voxExplainer.marker : "#A39334");
  const c2 = ink2 ?? (tape === "lime" ? voxExplainer.markerBlue : "#A39334");

  const t = Math.min(1, (f - delay) / dur);
  const e = ease("enter")(t);
  const sx = 0.35 + 0.65 * e; // starts at ≈35 % width
  const curl = (1 - e) * 26;
  const step = f - delay - dur < 0 ? -10 : Math.floor((f - delay - dur) / framesPerChar); // write-on starts once unfurled

  const glyphs = [...text].map((ch, i) => ({ ch, color: c1, i }));
  if (text2) glyphs.push(...[...` ${text2}`].map((ch, j) => ({ ch, color: c2, i: text.length + j })));

  return (
    <div style={{ ...placeStyle({ ...rest, rotate }, 0, 0), width: "auto", height: "auto" }}>
      <div style={{ transform: `scaleX(${sx})`, transformOrigin: "0 50%", display: "inline-block", position: "relative" }}>
        <div
          style={{
            height,
            padding: "0 26px",
            background: base,
            display: "flex",
            alignItems: "center",
            whiteSpace: "pre",
            filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.18))",
          }}
        >
          {glyphs.map(({ ch, color, i }) => {
            const prog = Math.min(1, Math.max(0, (step - i + 1) / 2)); // half a glyph on its first drawing, whole on the next
            const tilt = (rand(`tl-${text}-${i}`) - 0.5) * 4;
            const dy = (rand(`tb-${text}-${i}`) - 0.5) * 3;
            return (
              <span
                key={i}
                style={{
                  ...typeStyle(voxType.tape),
                  color,
                  display: "inline-block",
                  transform: `translateY(${dy}px) rotate(${tilt}deg)`,
                  clipPath: `inset(-10% ${(1 - prog) * 100}% -10% 0)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {curl > 0.5 && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: curl / sx,
              background: `linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.15))`,
            }}
          />
        )}
      </div>
      {clip && <PaperClip x={-34} y={-height * 0.5} height={height * 1.6} rotate={-8} />}
    </div>
  );
};
