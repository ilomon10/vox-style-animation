import React from "react";
import { Img, interpolate } from "remotion";
import type { CueIndex } from "../../audio";
import { SparkBoil } from "../../earworm/fx";
import { distressMask } from "../../earworm";
import { rand } from "../../lib/random";
import { useDrawingFrame } from "../../lib/time";
import { voxEarworm } from "../../tokens/colors";
import { earwormType, typeStyle } from "../../tokens/type";
import { capTrim } from "../../type/shared";
import { PRIV, Trumpet } from "./art";
import { Cam, bez } from "./camera";
import type { Events } from "./events";

/** 7 (f1619–1696): giant black WHUR over newsprint printed "96.3": linear pull-back 0.9986 / drawing, accelerating into the cut (0.997, 0.985, 0.964). Sequence starts at E.whur. */
export const Whur: React.FC<{ E: Events }> = ({ E }) => {
  const f = useDrawingFrame();
  const di = Math.floor((f * 10) / 25 + 1e-9);
  let s = 1.1 * Math.pow(0.9986, di);
  const tail = f - (E.pullOut - E.whur);
  if (tail >= 0) {
    const k = Math.min(2, Math.floor((tail * 10) / 25 + 1e-9));
    s = s * [0.997, 0.997 * 0.985, 0.997 * 0.985 * 0.964][k];
  }
  const rows = Array.from({ length: 9 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#ECECEC", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: `scale(${s})` }}>
        {rows.map((i) => (
          <div key={i} style={{ position: "absolute", left: -200 + (i % 2) * 120, top: -60 + i * 150, whiteSpace: "nowrap", font: "700 150px/1 Oswald, sans-serif", color: "#d2d2d0", letterSpacing: 6 }}>
            {"96.3 ".repeat(9)}
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, width: 1920, top: 540 - 222, textAlign: "center", whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.giantWord, cap: 470, color: "#202023", leading: 1, tracking: 0 }), ...distressMask(120, 40), transform: "scaleX(1.5)", transformOrigin: "50% 50%" }}>WHUR</div>
      </div>
    </div>
  );
};

const JZ = [
  { ch: "J", x: 460 },
  { ch: "A", x: 665 },
  { ch: "Z", x: 1315 },
  { ch: "Z", x: 1525 },
];
/** 8 (f1697–1738): distressed white J A Z Z converging round a trumpet cut-out; the pull-out continues then a short push; sparks at the bell. Sequence starts at E.jazz. */
export const Jazz: React.FC<{ E: Events; cues: CueIndex }> = ({ E, cues }) => {
  const f = useDrawingFrame();
  const raw = f;
  // pull-out continues 0.893, 0.924, 0.930 (f1699–1704), then pushes 1.022 → 1.005 per drawing while rising
  const d = Math.floor((f * 10) / 25 + 1e-9);
  const z0 = 1.3;
  const pull = [1, 0.893, 0.924, 0.93];
  let z = z0;
  for (let i = 1; i <= Math.min(d, 3); i++) z *= pull[i];
  if (f >= 9) for (let i = 0; i < Math.min(d - 3, 5); i++) z *= 1.022 - (i / 5) * 0.017;
  const rise = interpolate(f, [9, 19], [-28, -4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = bez(0.3, 0, 0.2, 1)(Math.min(1, Math.max(0, f / 20))); // letters converge over 19 f
  const globalF = f + E.jazz;
  const lv = (ff: number) => Math.min(1, 0.55 + 0.6 * cues.level01At(E.jazz + ff - 2, "total")); // music level, lag 2–3 f
  return (
    <Cam z={z} cx={960} cy={540 - rise}>
      {JZ.map((l, i) => {
        const mid = (i - 1.5) / 1.5;
        const dx = mid * 560 * (1 - p);
        return (
          <div key={i} style={{ position: "absolute", left: l.x + dx, top: 560 - 75, transform: "translateX(-50%)", whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.giantWord, cap: 150, color: voxEarworm.wood, leading: 1 }), ...distressMask(Math.floor(rand(`jz${i}`) * 900), Math.floor(rand(`jy${i}`) * 900)) }}>{l.ch}</div>
        );
      })}
      <div style={{ position: "absolute", left: 820, top: 420, width: 380, height: 300, overflow: "hidden", background: "#d8d7d3", clipPath: "polygon(3% 0, 100% 4%, 98% 100%, 0 96%)" }}>
        <Img src={PRIV("pa.jpg")} style={{ position: "absolute", left: 14, top: 12, width: 352, height: 410, objectFit: "cover", filter: "grayscale(1) contrast(1.2)" }} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 330, width: 520 }}><Trumpet w={520} /></div>
      <SparkBoil x={1440} y={255} at={E.sparks - E.jazz} level={lv} strokes={3} length={150} dir={-20} seed="spk" />
      <div style={{ display: "none" }}>{globalF}{raw}</div>
    </Cam>
  );
};
