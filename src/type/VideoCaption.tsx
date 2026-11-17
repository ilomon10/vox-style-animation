import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { useDrawingFrame } from "../lib/time";
import { paperDesk } from "../tokens/colors";
import { DUR } from "../tokens/motion";
import { paperDeskType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim, prog, useRefFrames, useSecToFrames } from "./shared";

export type VideoCaptionProps = {
  children: string;
  role?: TypeRole;
  /** auto = dark footage look (bright footage must be requested explicitly: the kit cannot see the footage) */
  tone?: "auto" | "dark" | "bright";
  /** ▶ entrance: cut (appears) or riseSpin (rises 108 px / 10 f, then spins 270° CCW / 10 f into ▶) */
  triangleIn?: "cut" | "riseSpin";
  delay?: number;
  /** frame at which the text has fully faded OUT (fade-out lasts 7 f @30 and ends here) */
  endAt?: number;
  /** x of the ▶ (design px), default 213 = 11 % W */
  x?: number;
  /** text x, default 307 = 16 % W */
  textX?: number;
  /** baseline y, default 977 = 90.5 % H */
  baseline?: number;
};

/** ▶ triangle size, analysis/porsche-part3-stills.md plan row VideoCaption (60×66) */
const TRI_W = 60;
const TRI_H = 66;

/**
 * Paper-desk lower-left caption: ▶ + bold italic text, never a box. The text fade is measured ON ONES
 * (useCurrentFrame, not the drawing clock); the triangle moves on drawings (porsche M7).
 */
export const VideoCaption: React.FC<VideoCaptionProps> = ({
  children,
  role = paperDeskType.caption,
  tone = "auto",
  triangleIn = "cut",
  delay = 0,
  endAt,
  x = 213,
  textX = 307,
  baseline = 977,
}) => {
  const onesFrame = useCurrentFrame(); // ON ONES: caption opacity
  const df = useDrawingFrame();
  const toRef = useRefFrames();
  const toF = useSecToFrames();
  const bright = tone === "bright";
  const textColor = bright ? paperDesk.inkCaptionDark : paperDesk.captionYellow;
  const triColor = bright ? paperDesk.highlight : paperDesk.captionTriangle;

  const riseF = toRef(10, 30);
  const spinF = toRef(10, 30);
  const textStart = delay + (triangleIn === "riseSpin" ? riseF + spinF : 0);
  const fadeIn = prog(onesFrame, textStart, toF(DUR.captionFade), "fadeIn");
  const fadeOutLen = toF(DUR.captionFadeOut);
  const fadeOut = endAt === undefined ? 1 : 1 - prog(onesFrame, endAt - fadeOutLen, fadeOutLen, "linear");
  const textOpacity = fadeIn * fadeOut;

  const centreY = baseline - 11; // ▶ centre at 966 for baseline 977
  let ty = 0;
  let rot = 0;
  let triVisible = df >= delay;
  if (triangleIn === "riseSpin") {
    const inOut = Easing.bezier(0.42, 0, 0.58, 1);
    const pr = prog(df, delay, riseF, inOut);
    const ps = prog(df, delay + riseF, spinF, inOut);
    ty = (1 - pr) * 108;
    rot = -90 - 270 * ps; // ▲ → spins CCW 270° → ▶
    triVisible = df >= delay;
  }
  const triOpacity = endAt !== undefined ? fadeOut : 1;

  return (
    <>
      {triVisible && (
        <svg
          width={TRI_W}
          height={TRI_H}
          viewBox="0 0 60 66"
          style={{
            position: "absolute",
            left: x,
            top: centreY - TRI_H / 2 + ty,
            transform: `rotate(${rot}deg)`,
            transformOrigin: "50% 50%",
            opacity: triOpacity,
          }}
        >
          <polygon points="4,2 58,33 4,64" fill={triColor} />
        </svg>
      )}
      <div
        style={{
          ...typeStyle(role),
          ...capTrim,
          color: textColor,
          position: "absolute",
          left: textX,
          bottom: 1080 - baseline,
          opacity: textOpacity,
        }}
      >
        {children}
      </div>
    </>
  );
};
