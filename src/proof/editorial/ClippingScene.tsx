import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Paper } from "../../effects";
import { voxEditorial } from "../../tokens/colors";
import { PHOTO_GRADE } from "../../tokens/finish";
import { editorialType, typeStyle } from "../../tokens/type";
import { CenterOutReveal, Highlighter, LineWipe } from "../../type";
import { prog } from "../../type/shared";

/** ED-2 newspaper clipping (analysis/highlight.md S1j–S1q, 24 fps). Frames are relative to the shot. */
const TILT = 209; // px, 0.3 s easeInQuad
const TILT_AT = 70, TILT_F = 7;
const headline = editorialType.headline;
const body = { ...editorialType.body, cap: 33, leading: 0.96 }; // 47 px pitch, ≈23 px/char

const abs = (left: number, top: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

export const ClippingScene: React.FC = () => {
  const f = useCurrentFrame();
  const d = TILT * (1 - prog(f, TILT_AT, TILT_F, "fogClear"));
  const lineBody = TILT_AT + TILT_F; // body wipe + photo fade start when the move lands
  const tagOp = prog(f, 2, 7, "linear");
  const mastOp = prog(f, 5, 5, "linear");
  const photoOp = prog(f, lineBody, 7, "punchIn");

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateY(${d}px)` }}>
        {/* the sheet travels with the tilt: it is taller than the frame by the tilt distance */}
        <Paper kind="crumpled" seed="ed" width={1920} height={1080 + TILT} style={{ position: "absolute", left: 0, top: -TILT }} />

        {/* photo: B/W, multiplied onto the paper, ink border */}
        <div style={abs(848, 472, { width: 925, height: 518, opacity: photoOp, mixBlendMode: "multiply", border: `2px solid ${voxEditorial.ink}`, boxSizing: "border-box", overflow: "hidden" })}>
          <Img
            src={staticFile("assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: `${PHOTO_GRADE.voxEditorial.bw} contrast(0.4) brightness(1.39) blur(0.6px)` }}
          />
        </div>

        {/* body column */}
        <div style={abs(140, 494, { width: 700 })}>
          <LineWipe role={body} delay={lineBody} duration={10}>
            {"On the morning of Tuesday,\nOct. 7, workers at the\n"}
            <Highlighter role={body} variant="editorial" delay={127} duration={7} seed="b1">Highland Park plant</Highlighter>
            {" began\nto haul each chassis on a\nrope while men on either\nside fitted one part each.\nWhere one man had once\nbuilt a whole magneto in a\nday, the work was cut into\ntwenty-nine steps."}
          </LineWipe>
        </div>

        {/* headline + date tag + rule + masthead */}
        <div style={abs(0, 208, { width: 1920, textAlign: "center" })}>
          <CenterOutReveal role={headline} delay={2} duration={10}>
            {"Ford's moving line "}
            <Highlighter role={headline} variant="editorial" delay={24} duration={7} seed="h1">cuts Model T build time</Highlighter>
            {"\nfrom 12 hours to 93 minutes at Highland Park"}
          </CenterOutReveal>
        </div>
        <div style={abs(186, 117, { width: 296, height: 64, background: voxEditorial.tag, display: "flex", alignItems: "center", justifyContent: "center", opacity: tagOp, ...typeStyle(editorialType.tag), fontSize: 40 })}>
          Oct 7, 1913
        </div>
        <div style={abs(187, 410, { width: 960, height: 3, background: voxEditorial.ink, opacity: mastOp })} />
        <div style={abs(1180, 372, { width: 540, textAlign: "right", opacity: mastOp, ...typeStyle({ ...editorialType.masthead, cap: 63 }) })}>The Midland Courier</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
