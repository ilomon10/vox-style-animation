import React from "react";
import { Img, staticFile } from "remotion";
import { CameraRig } from "../../motion";
import { PaperClip } from "../../collage";
import { MarkerRing } from "../../explainer";
import { Highlighter } from "../../type";
import { useDrawingFrame } from "../../lib/time";
import { ease } from "../../tokens/easing";
import { SHADOWS } from "../../tokens/finish";
import { Desk, FreezeTail, WorldShadow } from "./shared";

const PAGE = { x: 460, y: 0, w: 1000, h: 1517 };
/** "Twenty Horse Power, Five" line of the ad, measured on the 1319x2000 preview (x .186-.838, y .283) */
const LINE = { x: PAGE.x + 0.186 * PAGE.w, w: 0.652 * PAGE.w, y: PAGE.y + 0.283 * PAGE.h };

/** V-PD page drop: scale 6 -> 1 over 12 f (expo-out), dark + defocused at first. */
const PageDrop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useDrawingFrame();
  const p = ease("enter")(Math.min(1, f / 12));
  const s = 6 - 5 * p;
  return (
    <div style={{ position: "absolute", left: PAGE.x, top: PAGE.y, width: PAGE.w, height: PAGE.h, transform: `scale(${s})`, transformOrigin: "50% 30%", filter: `brightness(${0.55 + 0.45 * p}) blur(${(1 - p) * 14}px) ${p > 0.9 ? SHADOWS.printLifted : ""}` }}>
      {children}
    </div>
  );
};

/** VX-5 document highlight (ref epigenetics@28.6): drop, tilt-push, multiply highlighter at peak speed, freeze. */
export const Shot4Document: React.FC = () => (
  <FreezeTail frames={16}>
    <CameraRig
      keys={[
        { at: 0, x: 960, y: 250, scale: 1 },
        { at: 28, x: 960, y: 250, scale: 1 },
        // tilt-push to the line, 28 f (peak speed ~ f 40 = highlighter start)
        { at: 56, x: 975, y: 455, scale: 1.45, ease: "tilt" },
      ]}
      drift={{ vx: 0, vy: 6, zoomPerSec: -0.02 }}
    >
      <Desk seed="s4" />
      <WorldShadow x={-700} y={-500} w={1300} h={800} at="0% 0%" a={0.3} />
      <MarkerRing cx={500} cy={-20} rx={330} ry={210} delay={0} />
      <PageDrop>
        <Img src={staticFile("assets/cc0/documents/ford-model-t-ad-colliers-1908.jpg")} style={{ width: PAGE.w, height: PAGE.h, display: "block", filter: "saturate(0.04) brightness(0.9) contrast(0.92)" }} />
      </PageDrop>
      <PaperClip x={PAGE.x + 80} y={-60} height={110} rotate={-3} />
      <div style={{ position: "absolute", left: LINE.x, top: LINE.y + 16 }}>
        <Highlighter width={LINE.w} height={72} delay={40} duration={12} seed="ad">
          <span style={{ display: "inline-block", width: LINE.w, height: 72 }} />
        </Highlighter>
      </div>
    </CameraRig>
  </FreezeTail>
);
