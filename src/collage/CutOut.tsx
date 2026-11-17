import React from "react";
import { Img } from "remotion";
import { darkCollage, paperDesk } from "../tokens/colors";
import type { SHADOWS } from "../tokens/finish";
import { hexToRgb01, type Place, placeStyle, resolveShadow, resolveSrc, type Tone, toneCss, useSvgId } from "./util";

/** Flat, 0-blur offset silhouette behind the object (measured echoes: see ECHO). */
export type Echo = { color: string; dx: number; dy: number };

/** Measured echoes. dark collage: analysis/dracula.md §6; paper desk: porsche-part3-stills.md §6/§9. */
export const ECHO = {
  crimson: { color: darkCollage.crimsonEcho, dx: -32, dy: -25 },
  yellow: { color: paperDesk.highlight, dx: 9, dy: 12 },
} as const satisfies Record<string, Echo>;

export type CutOutProps = Place & {
  /** path relative to public/ (staticFile), e.g. "assets/cutouts/bat.png" */
  src: string;
  /** box size in design px (the PNG is scaled to fit exactly; keep the asset's aspect) */
  width: number;
  height: number;
  /** flat offset silhouette: dark collage crimson (−32,−25), paper desk yellow (+9,+12) */
  echo?: Echo;
  /** white die-cut outline: 4–6 px for pins, larger for stickers */
  sticker?: { width: number; color?: string };
  /**
   * Engraving on light paper → transparent paper + this ink colour (luminance → alpha).
   * `true` = warm black #1A1410.
   */
  inkKey?: string | true;
  /** grading of the image itself; "duotone" maps luma onto `duotone` [shadow, highlight] */
  tone?: Tone;
  duotone?: readonly [string, string];
  /** a SHADOWS key or a CSS filter string; default none (dark-collage cut-outs have no shadow) */
  shadow?: keyof typeof SHADOWS | string;
  /** flip horizontally */
  flip?: boolean;
};

/**
 * Cut-out PNG with the physical finishes of the references: flat offset echo, die-cut sticker
 * outline, ink-key for engravings, B/W / duotone print tones. Static; wrap in a motion component
 * (src/motion) for entrances.
 */
export const CutOut: React.FC<CutOutProps> = ({
  src,
  width,
  height,
  echo,
  sticker,
  inkKey,
  tone = "none",
  duotone = ["#2a0b0e", "#e9d8c8"],
  shadow,
  flip,
  ...place
}) => {
  const id = useSvgId("co");
  const needSvg = !!sticker || !!inkKey || tone === "duotone";
  const pad = sticker ? Math.ceil(sticker.width) + 4 : 0;
  const ink = hexToRgb01(inkKey === true || !inkKey ? "#1A1410" : inkKey);
  const [d0, d1] = duotone.map(hexToRgb01);

  const filters = [
    tone === "duotone" ? "" : toneCss(tone),
    needSvg ? `url(#${id})` : "",
    echo ? `drop-shadow(${echo.dx}px ${echo.dy}px 0 ${echo.color})` : "",
    resolveShadow(shadow) ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div style={placeStyle(place, width, height)}>
      {needSvg && (
        <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
          <defs>
            <filter
              id={id}
              x={-pad / width}
              y={-pad / height}
              width={1 + (2 * pad) / width}
              height={1 + (2 * pad) / height}
              colorInterpolationFilters="sRGB"
            >
              {tone === "duotone" && (
                <>
                  <feColorMatrix type="matrix" values=".299 .587 .114 0 0  .299 .587 .114 0 0  .299 .587 .114 0 0  0 0 0 1 0" />
                  <feComponentTransfer>
                    <feFuncR type="table" tableValues={`${d0[0]} ${d1[0]}`} />
                    <feFuncG type="table" tableValues={`${d0[1]} ${d1[1]}`} />
                    <feFuncB type="table" tableValues={`${d0[2]} ${d1[2]}`} />
                  </feComponentTransfer>
                </>
              )}
              {inkKey && (
                // analysis/assets-and-fonts.md §5: alpha = 1.417 − 0.556·(R+G+B)
                <feColorMatrix
                  type="matrix"
                  values={`0 0 0 0 ${ink[0]}  0 0 0 0 ${ink[1]}  0 0 0 0 ${ink[2]}  -.556 -.556 -.556 0 1.417`}
                />
              )}
              <feOffset dx={0} dy={0} result="art" />
              {sticker && (
                <>
                  <feMorphology in="art" operator="dilate" radius={sticker.width} result="grown" />
                  <feGaussianBlur in="grown" stdDeviation={sticker.width * 0.35} />
                  <feComponentTransfer result="round">
                    <feFuncA type="discrete" tableValues="0 0 0 0 0 0 1 1 1 1 1" />
                  </feComponentTransfer>
                  <feFlood floodColor={sticker.color ?? darkCollage.stickerWhite} />
                  <feComposite in2="round" operator="in" result="border" />
                  <feMerge>
                    <feMergeNode in="border" />
                    <feMergeNode in="art" />
                  </feMerge>
                </>
              )}
            </filter>
          </defs>
        </svg>
      )}
      <Img
        src={resolveSrc(src)}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          transform: flip ? "scaleX(-1)" : undefined,
          filter: filters || undefined,
        }}
      />
    </div>
  );
};
