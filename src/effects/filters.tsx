import React from "react";
import type { RgbSplit } from "../tokens/finish";
import { hexToRgb } from "./shared";

/**
 * ONE SVG filter for the whole "finish" colour stage: RGB split then output levels.
 * Rendered as a hidden <svg> whose <filter id> is referenced with `filter: url(#id)`.
 * All lengths are OUTPUT px (design px × stage.u) and the filter region is the full frame.
 *
 *   uniform: R / B channels isolated with feColorMatrix, moved with feOffset, recombined with an
 *            additive feComposite (arithmetic k2 = k3 = 1) — G stays put.
 *   radial:  R / B isolated, then scaled about the frame centre with feDisplacementMap driven by a
 *            generated gradient image (an exact linear scale: dx = −k·(x − cx), dy = −k·(y − cy)).
 *            Both axes share the map's `scale`, so the Y ramp is compressed by H/W.
 * color-interpolation-filters = sRGB so channel maths happens in encoded values (no linearisation).
 */

let mapUrl: string | null = null;
/** 512² RGB ramp: R = x / W, G = 0.5 + (y − cy) / W·… generated once per tab, bilinearly stretched by feImage */
const displacementMap = (aspect: number): string => {
  if (mapUrl) return mapUrl;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  const img = g.createImageData(512, 512);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4;
      img.data[i] = Math.round(((x + 0.5) / 512) * 255);
      // y ramp spans only H/W of the range so that one `scale` serves both axes
      img.data[i + 1] = Math.round((0.5 + ((y + 0.5) / 512 - 0.5) / aspect) * 255);
      img.data[i + 2] = 0;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  mapUrl = c.toDataURL("image/png");
  return mapUrl;
};

const iso = (c: "r" | "g" | "b") =>
  ({
    r: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
    g: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
    b: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
  })[c];

export const FinishFilter: React.FC<{
  id: string;
  width: number;
  height: number;
  /** output px per design px */
  u: number;
  split?: RgbSplit;
  levels?: { black: string; white: string };
}> = ({ id, width, height, u, split, levels }) => {
  const lv = levels ? { b: hexToRgb(levels.black), w: hexToRgb(levels.white) } : null;
  const ch = (i: number) => (lv ? { slope: (lv.w[i] - lv.b[i]) / 255, intercept: lv.b[i] / 255 } : null);
  const parts: React.ReactNode[] = [];
  let last = "SourceGraphic";

  if (split?.mode === "uniform") {
    parts.push(
      <feColorMatrix key="r0" in="SourceGraphic" type="matrix" values={iso("r")} result="r0" />,
      <feOffset key="r" in="r0" dx={split.red[0] * u} dy={split.red[1] * u} result="r" />,
      <feColorMatrix key="g" in="SourceGraphic" type="matrix" values={iso("g")} result="g" />,
      <feColorMatrix key="b0" in="SourceGraphic" type="matrix" values={iso("b")} result="b0" />,
      <feOffset key="b" in="b0" dx={split.blue[0] * u} dy={split.blue[1] * u} result="b" />,
      <feComposite key="rg" in="r" in2="g" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="rg" />,
      <feComposite key="rgb" in="rg" in2="b" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="rgb" />,
    );
    last = "rgb";
  } else if (split?.mode === "radial") {
    const kr = split.redScale - 1;
    const kb = split.blueScale - 1;
    parts.push(
      <feImage
        key="map"
        href={displacementMap(width / height)}
        x={0}
        y={0}
        width={width}
        height={height}
        preserveAspectRatio="none"
        result="map"
      />,
      <feColorMatrix key="r0" in="SourceGraphic" type="matrix" values={iso("r")} result="r0" />,
      <feDisplacementMap
        key="r"
        in="r0"
        in2="map"
        scale={-kr * width}
        xChannelSelector="R"
        yChannelSelector="G"
        result="r"
      />,
      <feColorMatrix key="g" in="SourceGraphic" type="matrix" values={iso("g")} result="g" />,
      <feColorMatrix key="b0" in="SourceGraphic" type="matrix" values={iso("b")} result="b0" />,
      <feDisplacementMap
        key="b"
        in="b0"
        in2="map"
        scale={-kb * width}
        xChannelSelector="R"
        yChannelSelector="G"
        result="b"
      />,
      <feComposite key="rg" in="r" in2="g" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="rg" />,
      <feComposite key="rgb" in="rg" in2="b" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="rgb" />,
    );
    last = "rgb";
  }
  if (lv) {
    const [r, g, b] = [ch(0)!, ch(1)!, ch(2)!];
    parts.push(
      <feComponentTransfer key="lv" in={last}>
        <feFuncR type="linear" slope={r.slope} intercept={r.intercept} />
        <feFuncG type="linear" slope={g.slope} intercept={g.intercept} />
        <feFuncB type="linear" slope={b.slope} intercept={b.intercept} />
      </feComponentTransfer>,
    );
  }
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter
          id={id}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={width}
          height={height}
          colorInterpolationFilters="sRGB"
        >
          {parts}
        </filter>
      </defs>
    </svg>
  );
};

/** maximum channel shift (output px) the split can produce at the frame edge — used for overscan */
export const maxSplitShiftPx = (split: RgbSplit | undefined, u: number, width: number): number => {
  if (!split) return 0;
  if (split.mode === "uniform") {
    return u * Math.max(...split.red.map(Math.abs), ...split.blue.map(Math.abs));
  }
  return (Math.max(Math.abs(split.redScale - 1), Math.abs(split.blueScale - 1)) * width) / 2;
};
