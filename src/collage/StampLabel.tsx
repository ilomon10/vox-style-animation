import React from "react";
import { paperDesk } from "../tokens/colors";
import { paperDeskType, typeStyle } from "../tokens/type";
import { Tape } from "./Tape";
import { type Place, placeStyle } from "./util";

export type StampLabelProps = Place & {
  /** "911", "356", "Boxster" … numerals use paperDeskType.slip, words slipWord */
  text: string;
  /** force the numeral / word type role (default: numeral if ≤4 chars) */
  role?: "slip" | "slipWord";
  width?: number;
  height?: number;
  /** scallop pitch / depth on the left and right sides (design px) */
  pitch?: number;
  depth?: number;
  color?: string;
  /** small yellow tape (75×45) at the top; `false` for none */
  tape?: boolean | { x?: number; y?: number; rotate?: number };
  /** bottom/right shadow (desk) */
  shadow?: boolean;
};

/** Slip outline: straight top/bottom, semicircular bites on the left and right edges. */
const slipPath = (w: number, h: number, pitch: number, depth: number) => {
  const n = Math.max(1, Math.round(h / pitch));
  const step = h / n;
  const r = depth;
  const bite = (y0: number, dir: 1 | -1) => {
    // semicircle bite centred on the slip edge, midway in the pitch cell
    const mid = y0 + step / 2;
    return `L ${dir > 0 ? w : 0} ${mid - r} A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${dir > 0 ? w : 0} ${mid + r}`;
  };
  let d = "M 0 0 L " + w + " 0";
  for (let i = 0; i < n; i++) d += " " + bite(i * step, 1);
  d += ` L ${w} ${h} L 0 ${h}`;
  for (let i = n - 1; i >= 0; i--) d += " " + bite(i * step, -1);
  return d + " Z";
};

/**
 * Scalloped desk label slip (paper desk S109): ≈290×190, scallop pitch 22 / depth 7 on the
 * left and right sides, #E5E0DC, Didone text, bottom/right shadow, optional 75×45 tape.
 * Static: it rides the camera group of the desk scene.
 */
export const StampLabel: React.FC<StampLabelProps> = ({
  text,
  role,
  width = 290,
  height = 190,
  pitch = 22,
  depth = 7,
  color = paperDesk.slip,
  tape = false,
  shadow = true,
  ...place
}) => {
  const r = role ?? (text.length <= 4 ? "slip" : "slipWord");
  const t = typeof tape === "object" ? tape : {};
  return (
    <div style={placeStyle(place, width, height)}>
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: shadow ? "drop-shadow(3px 4px 3px rgba(0,0,0,0.3))" : undefined,
        }}
      >
        <path d={slipPath(width, height, pitch, depth)} fill={color} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={typeStyle(paperDeskType[r])}>{text}</span>
      </div>
      {tape !== false && (
        <Tape
          variant="opaque"
          width={75}
          height={45}
          x={t.x ?? (width - 75) / 2}
          y={t.y ?? -22}
          rotate={t.rotate ?? -4}
          ends="straight"
        />
      )}
    </div>
  );
};
