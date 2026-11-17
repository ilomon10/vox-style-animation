import React from "react";
import { useDrawingFrame } from "../lib/time";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";

export type TypeWallpaperProps = {
  text?: string;
  /** cap height, design px (≈130, earworm-C §4 "Wallpaper") */
  cap?: number;
  /** #DDDCDD on white paper */
  color?: string;
  /** horizontal drift, px per second (−45, earworm-C §7); drawn on the drawing grid */
  drift?: number;
  /** rows are offset by this fraction of one repeat */
  rowOffset?: number;
  /** vertical row pitch = cap × this */
  pitch?: number;
  /** top of the first row (may be negative: rows are cropped by the frame) */
  top?: number;
  rows?: number;
  role?: TypeRole;
};

/** Oversized light-grey type wallpaper behind the Melvin collage (analysis/earworm-C.md §4, §9 `TypeWallpaper`). */
export const TypeWallpaper: React.FC<TypeWallpaperProps> = ({
  text = "WHUR 96.3", cap = 130, color = "#DDDCDD", drift = -45, rowOffset = 0.37, pitch = 1.9, top = -30, rows = 6, role = earwormType.keyword,
}) => {
  const f = useDrawingFrame();
  const unit = `${text}   `;
  const repeat = Array.from({ length: 8 }, () => unit).join("");
  const unitW = cap * 0.52 * unit.length; // Anton-ish condensed advance ≈0.52 em of the cap
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {Array.from({ length: rows }, (_, i) => {
        const x = -unitW * (0.2 + rowOffset * i) + (drift * f) / 25;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: top + i * cap * pitch, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...role, cap, color, weight: 700, leading: 1, tracking: 0.04 }) }}>
            {repeat}
          </div>
        );
      })}
    </div>
  );
};
