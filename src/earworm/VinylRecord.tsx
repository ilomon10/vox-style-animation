import React from "react";
import { useCurrentFrame } from "remotion";

export type VinylRecordProps = {
  /** centre, design px */
  cx: number;
  cy: number;
  /** full diameter, design px (735 after the fly-in) */
  diameter?: number;
  /** frame (sequence-relative) the record first shows */
  delay?: number;
  /** stepped diameter keys of the fly-in: [frames after delay, fraction of `diameter`]. Default = measured 12 f: Ø 15, 198, 198, 516,
   *  640, 684, 735 px at +0, 2, 4, 5, 7, 9, 12 (analysis/earworm-A.md §7 "Record fly-in") */
  flyKeys?: [number, number][];
  /** spin per drawing, clockwise (8.5° at 10 dps, constant before and after the music, earworm-A §7); the wedge reflection stays put */
  spinDeg?: number;
  /** drawing rate of the spin */
  rate?: number;
  /** label colours */
  labelA?: string;
  labelB?: string;
};

const FLY: [number, number][] = [[0, 0.02], [2, 0.27], [4, 0.27], [5, 0.7], [7, 0.87], [9, 0.93], [12, 1]];

/**
 * Photographic-looking black record (grooves, baked specular wedge, coloured label) that flies in at the frame centre and spins
 * clockwise about its label. Procedural (no image): repeating radial gradient + conic wedge. earworm-A §5 "Record stage", §9 `VinylRecord`.
 * The needle-drop thump / crackle are audio: schedule the fly-in to END ≈3 f before the thump (SYNC.needleAfterLandF).
 */
export const VinylRecord: React.FC<VinylRecordProps> = ({
  cx, cy, diameter = 735, delay = 0, flyKeys = FLY, spinDeg = 8.5, rate = 10, labelA = "#5B3F7E", labelB = "#A23B3B",
}) => {
  const raw = useCurrentFrame() - delay;
  if (raw < 0) return null;
  // the fly-in is stepped by its own keys (on ones); the spin steps on the 10 dps grid anchored at `delay`
  let frac = flyKeys[0][1];
  for (const [t, v] of flyKeys) if (raw >= t) frac = v;
  const d = diameter * frac;
  const spin = Math.floor((raw * rate) / 25 + 1e-9) * spinDeg;
  const labelD = d * 0.24;
  return (
    <div style={{ position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: "50%", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${spin}deg)` }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 50% 50%, #121212 0px, #262626 1.5px, #161616 3px)" }} />
        {/* label + spindle turn with the disc */}
        <div
          style={{
            position: "absolute", left: (d - labelD) / 2, top: (d - labelD) / 2, width: labelD, height: labelD, borderRadius: "50%",
            background: `conic-gradient(${labelA} 0deg, ${labelA} 150deg, ${labelB} 150deg, ${labelB} 290deg, ${labelA} 290deg)`,
            boxShadow: `inset 0 0 0 ${labelD * 0.06}px rgba(0,0,0,0.35)`,
          }}
        />
        <div style={{ position: "absolute", left: d / 2 - d * 0.012, top: d / 2 - d * 0.012, width: d * 0.024, height: d * 0.024, borderRadius: "50%", background: "#050505" }} />
      </div>
      {/* specular wedges: a REFLECTION, fixed in screen space (the reference's sheen does not turn with the disc; the grooves are radially symmetric) */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "conic-gradient(from 20deg, rgba(255,255,255,0) 0deg, rgba(240,240,240,0.9) 26deg, rgba(255,255,255,0) 62deg, rgba(255,255,255,0) 180deg, rgba(240,240,240,0.6) 206deg, rgba(255,255,255,0) 240deg, rgba(255,255,255,0) 360deg)",
          mixBlendMode: "screen",
        }}
      />
      <div style={{ position: "absolute", inset: d * 0.04, borderRadius: "50%", boxShadow: `inset 0 0 0 ${Math.max(1, d * 0.004)}px rgba(255,255,255,0.12)` }} />
    </div>
  );
};
