import React from "react";
import { interpolate } from "remotion";
import { useDrawingFrame, useSec } from "../lib/time";
import { DUR } from "../tokens/motion";
import { voxExplainer } from "../tokens/colors";
import { fontSizeFor, typeStyle, voxType } from "../tokens/type";
import { type Place, type Pt, clipHalfPlane, placeStyle, toPolygon } from "./util";

export type StickyNoteProps = Place & {
  text?: string;
  /** note face / folded back face */
  color?: string;
  backColor?: string;
  width?: number;
  height?: number;
  /** frames (composition fps) from the enclosing Sequence start; default 0 */
  delay?: number;
  /** peel length in frames; default DUR.stickyPeel */
  duration?: number;
  /** show the note fully stuck from frame 0 (no peel) */
  still?: boolean;
};

/** stuck-area fraction at the 4 drawings of the 8 f peel: ≈20 % → 40 % → 85 % → flat (epigenetics.md §7) */
const PEEL_AREA = [0.2, 0.4, 0.85, 1];

/** unit normal of the fold line pointing toward the loose side (≈ −15° from +x: the fold runs steeply, f863–867 of the "Age?" peel) */
const NORMAL: Pt = [Math.cos((-15 * Math.PI) / 180), Math.sin((-15 * Math.PI) / 180)];

/**
 * Sticky note that peels on: the note is stuck from the bottom-left while the unstuck
 * top-right part is folded over, showing the darker back face; the fold line travels corner to
 * corner, then the note rests flat with a small corner curl. Text is pre-printed and revealed by
 * the peel. CSS 3D (perspective ≈900) gives the lifted flap its tilt.
 */
export const StickyNote: React.FC<StickyNoteProps> = ({
  text = "EPI",
  color = voxExplainer.sticky,
  backColor = voxExplainer.stickyBack,
  width = 180,
  height = 140,
  delay = 0,
  duration,
  still,
  rotate = -2, // measured −2° (epigenetics.md §7)
  ...rest
}) => {
  const f = useDrawingFrame();
  const sec = useSec();
  const dur = duration ?? sec(DUR.stickyPeel);
  const t = still ? 1 : (f - delay) / dur;
  if (t < 0) return null;

  // drawings land on 0, .25, .5, .75 of the peel (4 drawings @ 8 f)
  const stops = PEEL_AREA.map((_, i) => i / PEEL_AREA.length);
  const area = t >= 1 ? 1 : interpolate(t, [...stops, 1], [...PEEL_AREA, 1], { extrapolateRight: "clamp" });

  const sq: Pt[] = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  const [nx, ny] = NORMAL;
  const proj = sq.map(([x, y]) => nx * x + ny * y);
  const pmin = Math.min(...proj);
  const pmax = Math.max(...proj);
  const c = pmin + area * (pmax - pmin); // fold line: n·p = c
  const stuck = area >= 1 ? sq : clipHalfPlane(sq, -nx, -ny, -c);
  const loose = area >= 1 ? [] : clipHalfPlane(sq, nx, ny, c);
  // flap rotates about the fold line (direction t = n rotated 90°), back face toward the camera
  const [tx, ty] = [-ny, nx];
  const origin = `${nx * c + 0}px ${ny * c}px`; // closest point of the line to the note origin
  const flapRot = `rotate3d(${tx}, ${ty}, 0, ${-(60 + (1 - area) * 15)}deg)`; // flap stays lifted ≈60–75° on the loose side, foreshortened by the perspective

  const curl = 17; // resting corner curl, top-right (f867–868)
  return (
    <div style={{ ...placeStyle({ ...rest, rotate }, width, height), perspective: 900 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          // small soft shadow (epigenetics.md §6)
          filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.28))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: toPolygon(stuck),
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ ...typeStyle(voxType.sticky), fontSize: Math.min(fontSizeFor(voxType.sticky), (width - 28) / (text.length * 0.7)) }}>{text}</span>
        </div>
        {loose.length > 2 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: flapRot,
              transformOrigin: origin,
              clipPath: toPolygon(loose),
              background: `linear-gradient(135deg, ${backColor} 0%, ${backColor} 60%, #8C7C17 100%)`,
            }}
          />
        )}
        {area >= 1 && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: curl,
              height: curl,
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              background: `linear-gradient(45deg, ${color} 30%, ${backColor} 100%)`,
              opacity: 0.9,
            }}
          />
        )}
      </div>
    </div>
  );
};
