import React from "react";
import { Img, staticFile } from "remotion";
import { rand, pick } from "../lib/random";
import { useSvgId } from "../collage/util";
import { voxEarworm } from "../tokens/colors";
import { FONTS } from "../tokens/fonts";
import type { Place } from "../collage/util";
import { placeStyle } from "../collage/util";

const SYL = ["ra", "ton", "me", "dio", "sta", "ver", "lin", "ar", "den", "kor", "tel", "man", "ses", "ob", "pi", "ter", "al", "um", "ney", "ing", "la", "de", "mo", "ris"];
/** generated pseudo-words (never scanned text) */
const word = (seed: string) => {
  const n = 1 + Math.floor(rand(`${seed}-n`) * 3);
  return Array.from({ length: n }, (_, i) => pick(`${seed}-s${i}`, SYL)).join("");
};
const sentence = (seed: string, words: number) => Array.from({ length: words }, (_, i) => word(`${seed}-w${i}`)).join(" ");

export type TextFillSilhouetteProps = Place & {
  /** alpha image (cut-out PNG with transparency): shirt, hat, head — path relative to public/ */
  src: string;
  width: number;
  height: number;
  /** "handwriting": marker script lines (S10 shirt) · "newsprint": justified serif columns (S21 heads) — both generated */
  fill: "handwriting" | "newsprint";
  /** ink / paper colours; defaults ink #201F20 on a warm newsprint grey */
  ink?: string;
  paper?: string;
  /** torn white outline around the silhouette, design px (0 = none; ≈10, earworm-C §6) */
  outline?: number;
  seed?: string;
};

/**
 * An image alpha filled with generated text through a CSS mask (analysis/earworm-C.md §6 "Text-filled silhouette", §9
 * `TextFilledSilhouette`). Optional torn white outline via dilate + turbulence displacement.
 */
export const TextFillSilhouette: React.FC<TextFillSilhouetteProps> = ({
  src, width, height, fill, ink = "#201F20", paper = "#D9D8D4", outline = 0, seed = "tf", ...place
}) => {
  const id = useSvgId("tfo");
  const url = staticFile(src);
  const lines = Math.ceil(height / (fill === "handwriting" ? 46 : 22));
  return (
    <div style={placeStyle(place, width, height)}>
      {outline > 0 && (
        <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
          <defs>
            <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
              <feMorphology in="SourceAlpha" operator="dilate" radius={outline} result="d" />
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={Math.floor(rand(seed) * 100)} result="n" />
              <feDisplacementMap in="d" in2="n" scale={outline * 1.2} xChannelSelector="R" yChannelSelector="G" result="dd" />
              <feFlood floodColor={voxEarworm.tornWhite} />
              <feComposite in2="dd" operator="in" result="border" />
              <feMerge><feMergeNode in="border" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      )}
      <div style={{ position: "absolute", inset: 0, filter: outline > 0 ? `url(#${id})` : undefined }}>
        <div
          style={{
            position: "absolute", inset: 0, background: paper, overflow: "hidden",
            WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
          }}
        >
          {Array.from({ length: lines }, (_, i) =>
            fill === "handwriting" ? (
              <div key={i} style={{ position: "absolute", left: -20 + rand(`${seed}-l${i}`) * 30, top: i * 46, whiteSpace: "nowrap", font: `${40 + rand(`${seed}-z${i}`) * 8}px/1 ${FONTS.MARKER}`, color: ink, transform: `rotate(${-2 + rand(`${seed}-r${i}`) * 3}deg)`, opacity: 0.9 }}>
                {sentence(`${seed}-${i}`, 10)}
              </div>
            ) : (
              <div key={i} style={{ position: "absolute", left: 0, top: i * 22, width, whiteSpace: "nowrap", overflow: "hidden", font: `400 ${i % 9 === 0 ? 24 : 17}px/1 ${FONTS.NEWS}`, textAlign: "justify", color: ink, opacity: 0.92 }}>
                {sentence(`${seed}-${i}`, 22)}
              </div>
            ),
          )}
        </div>
      </div>
      {/* invisible <Img>: makes Remotion wait for the mask image (CSS masks are not awaited) */}
      <Img src={url} style={{ position: "absolute", inset: 0, width, height, opacity: 0 }} />
    </div>
  );
};
