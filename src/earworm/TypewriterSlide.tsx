import React from "react";
import { useDrawingFrame } from "../lib/time";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";

export type TypewriterSlideProps = {
  text: string;
  /** frame the first letter lands (sequence-relative). Omit when using `finishAt`. */
  delay?: number;
  /** frames per letter: 2 (line 1) / 4 (line 2), earworm-B §7 */
  framesPerLetter?: number;
  /** the LAST letter lands exactly on this frame (title typewriter finishes at the first title word's onset −0…1, earworm-B §15 rule 4).
   *  With `delay` omitted the start is derived from `framesPerLetter`; with both, the rate is derived. */
  finishAt?: number;
  /** centre-left anchor, design px: left edge / vertical centre */
  x?: number;
  y?: number;
  role?: TypeRole;
  /** each new letter first appears this many letter-widths right of its slot, then snaps in `snapFrames` later */
  slideLetters?: number;
  snapFrames?: number;
  style?: React.CSSProperties;
};

/**
 * Per-letter slide-in typewriter (GEORGE / CLINTON, earworm-B §7): a new letter appears ≈1 letter-width right of its slot
 * and snaps into place on the next drawing; 1 letter / 2 f. Steps on the 12 drawings/s clock.
 */
export const TypewriterSlide: React.FC<TypewriterSlideProps> = ({
  text, delay, framesPerLetter = 2, finishAt, x = 0, y = 0, role = earwormType.keyword, slideLetters = 1, snapFrames = 2, style,
}) => {
  const f = useDrawingFrame();
  const n = Array.from(text).length;
  let step = framesPerLetter;
  let t0 = delay ?? 0;
  if (finishAt !== undefined) {
    if (delay === undefined) t0 = finishAt - (n - 1) * step;
    else step = n > 1 ? (finishAt - delay) / (n - 1) : 0;
  }
  const w = role.cap * 0.5;
  return (
    <div style={{ position: "absolute", left: x, top: y - role.cap / 2, whiteSpace: "pre", ...capTrim, ...typeStyle({ ...role, leading: 1 }), ...style }}>
      {Array.from(text).map((ch, i) => {
        const a = Math.round(t0 + i * step);
        const t = f - a;
        if (t < 0) return <span key={i} style={{ visibility: "hidden" }}>{ch}</span>;
        // landing letter sits one letter-width right until `snapFrames` after appearing
        return (
          <span key={i} style={{ display: "inline-block", transform: t < snapFrames && ch !== " " ? `translateX(${w * slideLetters}px)` : undefined }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};
