import React from "react";
import { Img, interpolate, staticFile, useVideoConfig } from "remotion";
import type { Place } from "../collage/util";
import { placeStyle } from "../collage/util";
import { useDrawingFrame, useDrawingIndex } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { PHOTO_GRADE } from "../tokens/finish";
import { tornCirclePoints, tornRectPoints } from "./shared";

export type CircleCrop = {
  /** circle diameter, design px (Clinton circle Ø≈615, earworm-B §5) */
  diameter: number;
  /** image box (design px) relative to the circle's top-left; default = diameter × diameter at (0,0) */
  imgWidth?: number;
  imgHeight?: number;
  imgX?: number;
  imgY?: number;
  /** fraction (0–1) of the image height, from the top, drawn again ABOVE the circle mask: the "breakout"
   *  (hat escaping the circle, earworm-B §5/§8). 0 = none. */
  breakoutAbove?: number;
};

export type TornPhotoProps = Place & {
  /** path relative to public/ */
  src: string;
  /** photo size, design px (ignored for the box when `circleCrop` is set) */
  width: number;
  height: number;
  /** seeds the tear; with `boil` it is re-seeded per step */
  seed?: string;
  /** torn white border width, design px (≈12; 6–20 measured, earworm-B §6, earworm-D §6) */
  border?: number;
  /** ragged amplitude ±px of the border width */
  rough?: number;
  /** border colour, default voxEarworm.tornWhite (#E1E3E5) */
  color?: string;
  /** "bw" = PHOTO_GRADE.voxEarworm.bw (default), "color", or "none" */
  grade?: "bw" | "color" | "none";
  fit?: "cover" | "contain";
  objectPosition?: string;
  /** re-randomise the torn edge every N drawings (earworm-B §7 "torn-edge boil": 4 tears at 2 f each) */
  boil?: number;
  /** slam entrance: lands from `from` × scale in `drawings` (2–3) drawings, full opacity from drawing 1
   *  (photo slam 4 f, earworm-B §8). Hidden before `delay`. */
  slam?: boolean | { drawings?: 2 | 3; from?: number };
  /** frame (sequence-relative) the photo appears */
  delay?: number;
  circleCrop?: CircleCrop;
};

/**
 * B/W photo cut-out with a ragged torn white border (#E1E3E5, ≈12 px). Hard knife edge on the photo, torn edge on
 * the border; no shadow (black on black). Optional boil, slam entrance, circle crop with a breakout layer.
 */
export const TornPhoto: React.FC<TornPhotoProps> = ({
  src, width, height, seed = "tp", border = 12, rough = 6, color = voxEarworm.tornWhite, grade = "bw", fit = "cover",
  objectPosition, boil, slam, delay = 0, circleCrop, ...place
}) => {
  const f = useDrawingFrame();
  const di = useDrawingIndex();
  const { fps } = useVideoConfig();
  if (f < delay) return null;
  const pad = border + rough;
  const s = boil ? `${seed}-${Math.floor(di / boil)}` : seed;
  const filter = grade === "bw" ? PHOTO_GRADE.voxEarworm.bw : grade === "color" ? PHOTO_GRADE.voxEarworm.color : undefined;

  // slam: scale from `from` down to 1 over `drawings` drawings (2 f each at 25 fps)
  let scale = 1;
  if (slam) {
    const o = slam === true ? {} : slam;
    const n = o.drawings ?? 3;
    const from = o.from ?? 1.25;
    const k = Math.round(((f - delay) * 12) / fps); // drawings since the appearance
    scale = interpolate(ease("enter")(Math.min(1, (k + 1) / n)), [0, 1], [from, 1]);
  }

  const d = circleCrop?.diameter;
  const boxW = d ?? width;
  const boxH = d ?? height;
  const cw = boxW + 2 * pad;
  const ch = boxH + 2 * pad;
  const img = (extra?: React.CSSProperties) =>
    circleCrop ? (
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: pad + (circleCrop.imgX ?? 0),
          top: pad + (circleCrop.imgY ?? 0),
          width: circleCrop.imgWidth ?? d,
          height: circleCrop.imgHeight ?? d,
          objectFit: fit,
          objectPosition,
          filter,
          ...extra,
        }}
      />
    ) : (
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", left: pad, top: pad, width, height, objectFit: fit, objectPosition, filter, ...extra }}
      />
    );

  return (
    <div style={{ ...placeStyle({ ...place, x: (place.x ?? 0) - pad, y: (place.y ?? 0) - pad }, cw, ch), transform: `${place.rotate ? `rotate(${place.rotate}deg) ` : ""}scale(${scale})` }}>
      <svg width={cw} height={ch} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <polygon points={d ? tornCirclePoints(d, s, border, rough) : tornRectPoints(width, height, s, border, rough)} fill={color} />
      </svg>
      {circleCrop ? (
        <>
          <div style={{ position: "absolute", inset: 0, clipPath: `circle(${d! / 2}px at ${pad + d! / 2}px ${pad + d! / 2}px)` }}>{img()}</div>
          {!!circleCrop.breakoutAbove && img({ clipPath: `inset(0 0 ${(1 - circleCrop.breakoutAbove) * 100}% 0)` })}
        </>
      ) : (
        img()
      )}
    </div>
  );
};
