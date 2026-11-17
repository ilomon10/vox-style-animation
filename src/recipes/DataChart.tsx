import React from "react";
import { interpolate } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { earwormType, typeStyle } from "../tokens/type";
import { capTrim } from "../type/shared";
import { HandRing } from "../earworm";
import { CapsLine, RecipeFrame, ev, evUntil, type RecipeProps } from "./shared";

export type DataChartProps = {
  mode?: "counter" | "bars";
  /** counter: the number counted up to (e.g. 60) */
  value?: number;
  prefix?: string;
  suffix?: string;
  /** caption under the number / above the bars */
  label?: string;
  /** bars: periwinkle bars on the black plate */
  bars?: { label: string; value: number; display?: string }[];
  /** hand ring around the final number */
  ring?: boolean;
};

/** Recipe "data chart" (Earworm digits / data in periwinkle): a counter that counts up with ease `grow` between events `count` and its `until`, or staggered bars. Events: `count` (kind text, default 4; `until` = end of the count, default +24 f), `label`. */
export const DataChart: React.FC<RecipeProps<DataChartProps>> = ({ ctx, mode = "counter", value = 0, prefix = "", suffix = "", label, bars = [], ring }) => {
  const f = useDrawingFrame();
  const t0 = ev(ctx, "count", 4);
  const t1 = evUntil(ctx, "count", t0 + 24) ?? t0 + 24;
  const p = interpolate(f, [t0, Math.max(t0 + 1, t1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease("grow") });
  const tLabel = ev(ctx, "label", t1 + 2);
  if (mode === "counter") {
    const shown = f < t0 ? "" : `${prefix}${Math.round(value * p)}${suffix}`;
    return (
      <RecipeFrame seed={ctx.seed}>
        <CapsLine text={shown || " "} x={960} y={470} role="digits" cap={340} seed={`${ctx.seed}-n`} />
        {label && f >= tLabel && <CapsLine text={label} x={960} y={760} role="stripLabel" cap={64} seed={`${ctx.seed}-l`} />}
        {ring && f >= t1 && <HandRing cx={960} cy={470} rx={Math.max(260, shown.length * 110)} ry={230} delay={t1} color={voxEarworm.accent} width={6} seed={`${ctx.seed}-r`} />}
      </RecipeFrame>
    );
  }
  const max = Math.max(1, ...bars.map((b) => b.value));
  const pitch = 1400 / Math.max(1, bars.length);
  const bw = Math.min(200, pitch * 0.6);
  return (
    <RecipeFrame seed={ctx.seed}>
      {bars.map((b, i) => {
        const s = t0 + i * 5;
        const g = interpolate(f, [s, s + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease("grow") });
        const h = (b.value / max) * 560 * g;
        const x = 260 + i * pitch + (pitch - bw) / 2;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: 840 - h, width: bw, height: h, background: voxEarworm.accent }} />
            <div style={{ position: "absolute", left: x - 40, width: bw + 80, textAlign: "center", top: 870, ...capTrim, ...typeStyle({ ...earwormType.stripLabel, cap: 40 }) }}>{b.label}</div>
            {g > 0.95 && <div style={{ position: "absolute", left: x - 40, width: bw + 80, textAlign: "center", top: 840 - h - 64, ...capTrim, ...typeStyle({ ...earwormType.keyword, cap: 48, color: "#EDEDED" }) }}>{b.display ?? String(b.value)}</div>}
          </React.Fragment>
        );
      })}
      {label && <CapsLine text={label} x={960} y={110} role="stripLabel" cap={56} seed={`${ctx.seed}-l`} />}
    </RecipeFrame>
  );
};
