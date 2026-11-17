import React from "react";
import { Img } from "remotion";
import { paperDesk, voxExplainer } from "../tokens/colors";
import { SHADOWS } from "../tokens/finish";
import {
  DuotoneDef,
  type Place,
  placeStyle,
  resolveShadow,
  resolveSrc,
  type Tone,
  toneCss,
  useSvgId,
} from "./util";

export type PhotoVariant = "desk" | "card" | "polaroid" | "vox";

export type PhotoPrintProps = Place & {
  /** image path relative to public/; or pass `children` (e.g. <OffthreadVideo/>) */
  src?: string;
  children?: React.ReactNode;
  variant?: PhotoVariant;
  /** OUTER size, design px (border included) */
  width: number;
  height: number;
  tone?: Tone;
  duotone?: readonly [string, string];
  /** override the variant's shadow: a SHADOWS key or CSS filter; `"none"` removes it */
  shadow?: keyof typeof SHADOWS | string;
  /** card: yellow offset edge colour/offset (default #F2E600, +9/+12) */
  edge?: { color?: string; dx?: number; dy?: number };
};

/**
 * Printed photo lying on the desk.
 *  desk     paper desk: white border 4.7 % of width, equal sides, photoOnDesk shadow
 *  card     paper desk rounded card r 20 with a hard yellow offset edge (+9,+12)
 *  polaroid S84 card on black: sides 17/18, bottom 41, #EFE7D2
 *  vox      border ≈5 % of width (top +20 %), #E1DDDB, deckled ±1.5 px, contact shadow
 * Evidence: analysis/porsche-part3-stills.md §6, epigenetics.md §6.
 */
export const PhotoPrint: React.FC<PhotoPrintProps> = ({
  src,
  children,
  variant = "desk",
  width,
  height,
  tone = "none",
  duotone = [voxExplainer.bar, "#e9d8c8"],
  shadow,
  edge,
  ...place
}) => {
  const id = useSvgId("pp");
  const deckleId = `${id}d`;
  const b = width * (variant === "vox" ? 0.05 : 0.047);
  const pad =
    variant === "desk"
      ? [b, b, b, b]
      : variant === "polaroid"
        ? [18, 17, 41, 17]
        : variant === "vox"
          ? [b * 1.2, b, b, b]
          : [0, 0, 0, 0];
  const frameColor =
    variant === "desk" ? paperDesk.photoBorder : variant === "polaroid" ? paperDesk.cardBorder : voxExplainer.printBorder;
  const radius = variant === "card" ? 20 : variant === "desk" ? 1 : 0;

  const defaultShadow =
    variant === "desk" ? SHADOWS.photoOnDesk : variant === "vox" ? SHADOWS.printContact : undefined;
  const filter = shadow === "none" ? undefined : (resolveShadow(shadow) ?? defaultShadow);

  const picFilter = tone === "duotone" ? `url(#${id})` : toneCss(tone) || undefined;
  const e = { color: paperDesk.highlight, dx: 9, dy: 12, ...edge };

  return (
    <div style={{ ...placeStyle(place, width, height), filter }}>
      {tone === "duotone" && <DuotoneDef id={id} colors={duotone} />}
      {variant === "card" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${e.dx}px, ${e.dy}px)`,
            background: e.color,
            borderRadius: radius,
          }}
        />
      )}
      {variant === "vox" && (
        <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
          <defs>
            {/* deckled outer edge: displacement ≈ ±1.5 px (analysis/epigenetics.md §6) */}
            <filter id={deckleId} x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency={0.05} numOctaves={2} seed={7} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={3} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      )}
      {variant !== "card" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: frameColor,
            borderRadius: radius,
            boxShadow: variant === "vox" ? "inset 0 0 0 1px rgba(60,50,45,0.14)" : "inset 0 0 0 1px rgba(90,80,70,0.08)",
            filter: variant === "vox" ? `url(#${deckleId})` : undefined,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: pad[3],
          top: pad[0],
          right: pad[1],
          bottom: pad[2],
          borderRadius: variant === "card" ? radius : 0,
          overflow: "hidden",
          filter: picFilter,
        }}
      >
        {src ? <Img src={resolveSrc(src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : children}
      </div>
    </div>
  );
};
