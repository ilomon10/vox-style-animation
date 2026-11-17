import React from "react";
import { interpolate } from "remotion";
import { paperDesk } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { paperDeskType, typeStyle } from "../tokens/type";
import { useDrawingFrame, useFrames } from "../lib/time";
import { HandDrawnRing } from "./rings";

export type BarDatum = { label: string; value: number; display?: string };

export type BarChartProps = {
  data: BarDatum[];
  /** bottom-left of the first bar's slot (baseline), design px */
  x: number;
  y: number;
  /** pixel height of a bar at `max` */
  height?: number;
  max?: number;
  delay?: number;
  title?: string;
  source?: string;
  /** hand-drawn maroon ring around bars from..to (inclusive), drawn after the growth */
  ring?: { from: number; to: number; delay?: number };
  barWidth?: number;
  pitch?: number;
};

/**
 * Paper-desk bar chart (analysis/porsche-part3-stills.md §5 M4): charcoal bars width 75 / pitch 127,
 * growth staggered ≈4.7 f per bar (@30), 13–22 f each, ease `grow`, no overshoot, three yellow gridlines,
 * maroon value labels, Caslon title + tiny source line.
 */
export const BarChart: React.FC<BarChartProps> = ({
  data, x, y, height = 420, max, delay = 0, title, source, ring, barWidth = 75, pitch = 127,
}) => {
  const f = useDrawingFrame();
  const fr = useFrames();
  const m = max ?? Math.max(...data.map((d) => d.value));
  const width = data.length * pitch;
  const stagger = (4.7 * 30) / 30; // frames @30 in the measurement, scaled below
  const k = fr(1, 30);
  const bars = data.map((d, i) => {
    const dur = fr(13 + 9 * (d.value / m), 30);
    const start = delay + i * stagger * k;
    const g = interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease("grow") });
    return { d, g, done: f >= start + dur, h: (d.value / m) * height * g, left: x + i * pitch + (pitch - barWidth) / 2 };
  });
  const lastEnd = delay + (data.length - 1) * stagger * k + fr(22, 30);
  return (
    <>
      {/* three yellow gridlines (highlighter pigment, multiplied) */}
      {[1 / 3, 2 / 3, 1].map((q) => (
        <div key={q} style={{ position: "absolute", left: x - 14, width: width + 28, top: y - height * q - 2, height: 4, background: paperDesk.highlight, mixBlendMode: "multiply" }} />
      ))}
      <div style={{ position: "absolute", left: x - 14, width: width + 28, top: y, height: 3, background: paperDesk.charcoal }} />
      {bars.map(({ d, h, left, done }, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left, top: y - h, width: barWidth, height: h, background: paperDesk.charcoal }} />
          {done && (
            <div style={{ ...typeStyle(paperDeskType.chartValue), position: "absolute", left: left - 20, width: barWidth + 40, textAlign: "center", top: y - h - 34 }}>
              {d.display ?? d.value}
            </div>
          )}
          <div style={{ ...typeStyle(paperDeskType.chartAxis), position: "absolute", left: left - 20, width: barWidth + 40, textAlign: "center", top: y + 12 }}>{d.label}</div>
        </React.Fragment>
      ))}
      {title && <div style={{ ...typeStyle(paperDeskType.chartTitle), position: "absolute", left: x - 14, top: y - height - 105 }}>{title}</div>}
      {source && <div style={{ ...typeStyle(paperDeskType.chartAxis), fontSize: 13, opacity: 0.8, position: "absolute", left: x - 14, top: y + 50 }}>{source}</div>}
      {ring && (() => {
        const a = bars[ring.from];
        const b = bars[ring.to];
        const top = Math.min(...bars.slice(ring.from, ring.to + 1).map((q) => (q.d.value / m) * height));
        const hi = Math.max(...bars.slice(ring.from, ring.to + 1).map((q) => (q.d.value / m) * height));
        const cx = (a.left + b.left + barWidth) / 2;
        const rx = (b.left + barWidth - a.left) / 2 + 40;
        const ry = hi / 2 + 50;
        void top;
        return <HandDrawnRing cx={cx} cy={y - hi / 2} rx={rx} ry={ry} delay={ring.delay ?? lastEnd + fr(4, 30)} seed="barring" />;
      })()}
    </>
  );
};
