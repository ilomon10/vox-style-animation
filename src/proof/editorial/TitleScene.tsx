import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Paper } from "../../effects";
import { PLAYFAIR } from "../../tokens/fonts";
import { ease } from "../../tokens/easing";
import { editorialType, typeStyle } from "../../tokens/type";
import { ChunkPopOn, Highlighter, WipeOff } from "../../type";
import { prog } from "../../type/shared";

/** ED-1 title lockup (analysis/highlight.md S1a–S1i, 24 fps, on ones). Frames are relative to the shot. */
const TITLE = "The Assembly Line";
const BRAND = "Weekly";
const CAP = 58; // title cap in the small state; ×1.565 after the snap zoom
const INK = "#3F3B37"; // ref title ink reads darker than the 0.08-share ink token (#4C4844); stays above the #3F3930 black point
const title = { ...editorialType.title, cap: CAP, color: INK };
const ghost = { ...title, color: "transparent" };

/** ref 0.7 s zoom in, 3.0 s zoom out (5 f easeInQuart, no blur) */
const ZOOM_IN = 17, ZOOM_OUT = 72, ZOOM_F = 5;
const HL_AT = 16, HL_DUR = 17, HL_FADE_AT = 89, HL_FADE = 58; // dab 0.6 s, wipe 0.6 s, fade 2.4 s
const ERASE_AT = 130, ERASE_DUR = 17, ERODE_AT = 133, ERODE_DUR = 17;

/** grunge dissolve: threshold an fBm field that rises with progress (wordmark erosion, E-WO) */
const Erode: React.FC<{ p: number; id: string; children: React.ReactNode }> = ({ p, id, children }) => {
  const thr = -0.1 + p * 1.1;
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.2 0.28" numOctaves={3} seed={7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a" />
          <feComponentTransfer in="a" result="m">
            <feFuncA type="linear" slope={14} intercept={-14 * thr} />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </svg>
      <div style={{ filter: p > 0 ? `url(#${id})` : undefined }}>{children}</div>
    </>
  );
};

export const TitleScene: React.FC = () => {
  const f = useCurrentFrame(); // on ones: this style's drawing rate is 24
  const zin = prog(f, ZOOM_IN, ZOOM_F, ease("gravity"));
  const zout = prog(f, ZOOM_OUT, ZOOM_F, ease("gravity"));
  const scale = 1 + 0.565 * zin - 0.565 * zout;
  const brandOn = f >= 10;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "960px 540px", transform: `scale(${scale})` }}>
        <Paper kind="crumpled" seed="ed" width={1920} height={1080} />
        <div style={{ position: "absolute", left: 959, top: 535, transform: "translate(-50%, -50%)" }}>
          {/* highlighter layer: the same line with transparent ink, so the stroke sits under the glyphs */}
          <div style={{ ...typeStyle(ghost) }}>
            {"The "}
            <Highlighter
              role={ghost} variant="editorial" delay={HL_AT} duration={HL_DUR}
              fadeOut fadeOutAt={HL_FADE_AT} fadeOutDuration={HL_FADE} seed="title"
            >Assembly</Highlighter>
            {" Line"}
          </div>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <WipeOff delay={ERASE_AT} duration={ERASE_DUR}>
              <ChunkPopOn role={title} delay={8} seed="asm-title">{TITLE}</ChunkPopOn>
            </WipeOff>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 16, marginTop: 14, visibility: brandOn ? "visible" : "hidden" }}>
            <Erode p={prog(f, ERODE_AT, ERODE_DUR, "linear")} id="erode-by">
              <div style={{ ...typeStyle({ ...editorialType.byline, cap: 25, color: INK }), marginBottom: 12 }}>by</div>
            </Erode>
            <Erode p={prog(f, ERODE_AT, ERODE_DUR, "linear")} id="erode-wm">
              <div style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 900, fontSize: 78, lineHeight: 1, color: INK }}>{BRAND}</div>
            </Erode>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
