import React, { createContext, useContext } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

/**
 * Resolution independence.
 *
 * Every measurement in the style guide is expressed in "design px" on a 1920×1080 canvas.
 * <DesignSpace> lays its children out on a fixed 1920×1080 box and scales the box to the
 * real composition size (1920×1080, 2560×1440, 3840×2160, …). Text and SVG re-rasterise
 * at the final size, so 4K renders stay sharp.
 *
 * Effects that must work at the native output resolution (grain, vignette, flicker)
 * live OUTSIDE DesignSpace and use useStage().u to convert design px → output px.
 */
export const DESIGN_W = 1920;
export const DESIGN_H = 1080;
/** portrait design canvas (YouTube Shorts, storyboard `format: "short"`) */
export const DESIGN_SHORT_W = 1080;
export const DESIGN_SHORT_H = 1920;

export type DesignSize = { w: number; h: number };
export const DESIGN_LANDSCAPE: DesignSize = { w: DESIGN_W, h: DESIGN_H };
export const DESIGN_PORTRAIT: DesignSize = { w: DESIGN_SHORT_W, h: DESIGN_SHORT_H };

/** active design size: default 1920×1080; a provider (storyboard `short` format, portrait recipes) switches it */
const DesignSizeContext = createContext<DesignSize>(DESIGN_LANDSCAPE);
export const DesignSizeProvider = DesignSizeContext.Provider;
export const useDesignSize = () => useContext(DesignSizeContext);
/** the design canvas that matches the composition's own aspect (portrait frame -> 1080×1920, else 1920×1080) */
export const useFrameDesign = (): DesignSize => {
  const { width, height } = useVideoConfig();
  return width < height ? DESIGN_PORTRAIT : DESIGN_LANDSCAPE;
};

/** landscape recipes in a `short`: the 1920×1080 design box is scaled by this factor of the 1080-wide canvas (1210×680, overflowing
 *  the width by 65 px per side; analysis/vox-shorts.md §7c6). Storyboard `shortBand.scale` provides it. */
export const DESIGN_BAND_SCALE = 0.63;
const BandScaleContext = createContext<number>(DESIGN_BAND_SCALE);
export const BandScaleProvider = BandScaleContext.Provider;

/** output px per design px of a design box in the frame: fit-to-frame, except a landscape box in a portrait frame (the band) */
const designScale = (width: number, height: number, d: DesignSize, band: number) =>
  d.w / d.h > width / height + 0.01 ? (band * width) / DESIGN_SHORT_W : Math.min(width / d.w, height / d.h);

type StageInfo = {
  /** output px per design px (1 at 1080p, 2 at 4K) */
  u: number;
  width: number;
  height: number;
  fps: number;
};

const StageContext = createContext<StageInfo | null>(null);

export const useStage = (): StageInfo => {
  const ctx = useContext(StageContext);
  const design = useDesignSize();
  const band = useContext(BandScaleContext);
  const { width, height, fps } = useVideoConfig();
  return ctx ?? { u: design.w / design.h > width / height + 0.01 ? designScale(width, height, design, band) : width / design.w, width, height, fps };
};

/** design px → output px (for code that renders outside DesignSpace) */
export const usePx = () => {
  const { u } = useStage();
  return (designPx: number) => designPx * u;
};

export const Stage: React.FC<{ children: React.ReactNode; background?: string }> = ({
  children,
  background = "#000",
}) => {
  const { width, height, fps } = useVideoConfig();
  const design = useDesignSize();
  const band = useContext(BandScaleContext);
  const info: StageInfo = { u: design.w / design.h > width / height + 0.01 ? designScale(width, height, design, band) : width / design.w, width, height, fps };
  return (
    <StageContext.Provider value={info}>
      <AbsoluteFill style={{ background, overflow: "hidden" }}>{children}</AbsoluteFill>
    </StageContext.Provider>
  );
};

/** Children are authored in design px: 1920×1080 by default, or `design` / the active DesignSizeProvider (1080×1920 for portrait recipes).
 *  A landscape box in a portrait frame is a centred band at the `shortBand` scale (default ×0.63, overflowing the width); other aspects are centred and scaled to fit. */
export const DesignSpace: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; design?: DesignSize }> = ({
  children,
  style,
  design,
}) => {
  const { width, height } = useVideoConfig();
  const ctx = useDesignSize();
  const band = useContext(BandScaleContext);
  const { w: DW, h: DH } = design ?? ctx;
  const s = designScale(width, height, { w: DW, h: DH }, band);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: (width - DW * s) / 2,
          top: (height - DH * s) / 2,
          width: DW,
          height: DH,
          transform: `scale(${s})`,
          transformOrigin: "0 0",
          ...style,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
