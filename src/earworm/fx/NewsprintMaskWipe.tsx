import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { DESIGN_H, DESIGN_W } from "../../lib/stage";
import { posterize } from "../../lib/time";
import { ease } from "../../tokens/easing";
import { voxEarworm } from "../../tokens/colors";
import { clamp01 } from "./util";

/** Head-and-shoulders silhouette in a 100x100 box (face centre at 50,35). Pass your own SVG path to match a photo. */
export const HEAD_PATH =
  "M18 100 C18 74 34 66 42 61 C34 55 32 47 32 36 C32 19 40 7 50 7 C60 7 68 19 68 36 C68 47 66 55 58 61 C66 66 82 74 82 100 Z";

const maskUrl = (path: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='${path}' fill='black'/></svg>`)}")`;

const maskStyle = (path: string, size: number, cx: number, cy: number): React.CSSProperties => {
  const css = {
    maskImage: maskUrl(path), maskRepeat: "no-repeat", maskSize: `${size}px ${size}px`,
    maskPosition: `${cx - size * 0.5}px ${cy - size * 0.35}px`,
  };
  return { ...css, WebkitMaskImage: css.maskImage, WebkitMaskRepeat: "no-repeat", WebkitMaskSize: css.maskSize, WebkitMaskPosition: css.maskPosition };
};

/** Newsprint texture (#C5C5C5-#CDCCCE page, ink #201F20): ruled columns + halftone dots. */
export const newsprintBackground: React.CSSProperties = {
  backgroundColor: voxEarworm.serifGrey,
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(32,31,32,.55) 0 3px, transparent 3px 11px), radial-gradient(rgba(32,31,32,.25) 1.2px, transparent 1.6px)",
  backgroundSize: "auto, 9px 9px",
};

export type NewsprintMaskWipeProps = {
  /** first frame of the wipe (relative to the enclosing Sequence) */
  at: number;
  /** frames the silhouette takes to grow past the frame (earworm-C: 10 in / 13 out) */
  duration?: number;
  /** frames the newsprint head leads the revealed picture (its visible rim) */
  lag?: number;
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
  /** centre of the face in design px */
  center?: { x: number; y: number };
  path?: string;
  /** start / end silhouette size, design px */
  startSize?: number;
  endSize?: number;
};

/** The next shot is revealed through a growing newsprint head. Twos. */
export const NewsprintMaskWipe: React.FC<NewsprintMaskWipeProps> = ({
  at, duration = 13, lag = 3, outgoing, incoming, center = { x: DESIGN_W / 2, y: DESIGN_H / 2 }, path = HEAD_PATH, startSize = 100, endSize = 9000,
}) => {
  const frame = useCurrentFrame();
  const g = posterize(frame, 25, 12);
  const size = (t: number) => startSize * Math.pow(endSize / startSize, ease("pushSoft")(clamp01(t)));
  const tHead = (g - at) / duration;
  const tPic = (g - at - lag) / duration;
  if (g < at) return <AbsoluteFill><Sequence from={0} layout="none">{outgoing}</Sequence></AbsoluteFill>;
  const done = tPic >= 1;
  return (
    <AbsoluteFill>
      {!done && <Sequence from={0} layout="none">{outgoing}</Sequence>}
      {!done && <AbsoluteFill style={{ ...newsprintBackground, ...maskStyle(path, size(tHead), center.x, center.y) }} />}
      <AbsoluteFill style={done ? undefined : maskStyle(path, size(tPic), center.x, center.y)}>
        <Sequence from={at} layout="none">{incoming}</Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
