import React from "react";
import { useCurrentFrame } from "remotion";
import { BlackCollageGround, LabelStrip, TornPhoto, TypeWallpaper } from "../../earworm";
import { useDrawingFrame } from "../../lib/time";
import { DesignSpace } from "../../lib/stage";
import { FONTS } from "../../tokens/fonts";
import { earwormType } from "../../tokens/type";
import { Newsprint } from "../earworm/art";
import { OUT, Reel, Sleeve } from "./art";
import type { Events } from "./events";

const settle = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3.4); // ≈ (0, .8, .15, 1)

/** S19: Washington Post clipping. Lands on a moving tilt (−452 px over 24 f, settle curve), then the accelerating pull-out ×.85 into the cut. Frames: sequence starts at the dissolve. */
export const Newspaper: React.FC<{ E: Events }> = ({ E }) => {
  const raw = useCurrentFrame();
  const f = useDrawingFrame();
  const gf = E.dissolve + f;
  const gr = E.dissolve + raw;
  const p = settle((gf - E.dissolve) / (E.tiltEnd - E.dissolve));
  const dissolve = Math.min(1, (raw + 1) / 7); // linear on ones, 7 f (+18.5 luma/f)
  const k = gr < E.pullOut ? -1 : Math.floor((gr - E.pullOut) / 2);
  const zoom = k < 0 ? 1 : [0.997, 0.983, 0.948, 0.846][Math.min(3, k)];
  return (
    <DesignSpace><div style={{ position: "absolute", inset: 0, opacity: dissolve, background: "#0A0A0A" }}>
      <div style={{ position: "absolute", left: 0, top: -120, width: 1920, height: 1500, transform: `translateY(${452 * (1 - p) - (f * 8) / 25}px) rotate(${3 * (1 - p)}deg) scale(${zoom})`, transformOrigin: "50% 40%", background: "#C5C5C5" }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Newsprint w={450} h={1500} seed="wp" fs={17} /></div>
        <div style={{ position: "absolute", left: 450, top: 40, width: 1080, height: 1400, background: "#CACACA", boxShadow: "inset 0 0 0 3px #8E8E8E", fontFamily: FONTS.NEWS, fontStyle: "italic", color: "#201F20", fontSize: 150, lineHeight: "195px", paddingLeft: 190, paddingTop: 250, boxSizing: "border-box" }}>
          {["Airing the", "Moods of", "Melvin", "Lindsey"].map((l) => <div key={l}>{l}</div>)}
        </div>
        <div style={{ position: "absolute", left: 1530, top: 0, width: 390, height: 1500, background: "radial-gradient(#3a3a3a 1.6px, transparent 2.2px) 0 0/9px 9px, #A9A9A9" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, padding: "4px 10px", font: `400 15px/1.2 ${FONTS.SMALL_SANS}`, color: "#fff", background: "#333" }}>The Washington Post | 1979</div>
    </div></DesignSpace>
  );
};

/** S20: Melvin collage on "WHUR 96.3" wallpaper. Overscaled defocused head settles in 2 drawings, one item every 2–5 f, indigo scribble draws on, push-through exit with bloom. */
export const MelvinCollage: React.FC<{ E: Events }> = ({ E }) => {
  const raw = useCurrentFrame();
  const f = useDrawingFrame();
  const R = (g: number) => g - E.cutMelvin; // → sequence-relative
  const gf = E.cutMelvin + raw;
  // overscaled head: ×1.47 / blur 20 → ×1.14 / 8 → 1 / 0 (drawings at rel 0, 2, 4)
  const head = f < 2 ? { z: 1.47, b: 20 } : f < 4 ? { z: 1.14, b: 8 } : { z: 1, b: 0 };
  const push = gf < E.pushOut ? -1 : Math.floor(((gf - E.pushOut) * 12) / 25 + 1e-9);
  const pz = push < 0 ? 1 : [1.006, 1.018, 1.04, 1.082, 1.22, 1.3, 1.4][Math.min(6, push)];
  const pb = push < 0 ? 0 : [1, 3, 5, 8, 13, 18, 22][Math.min(6, push)];
  const white = push < 4 ? 0 : [0.1, 0.2, 0.3][Math.min(2, push - 4)];
  const grow = 1 + (0.08 * f) / 159;
  const draw = Math.min(1, Math.max(0, (f - R(E.scribble)) / (R(E.scribble) + 55 - R(E.scribble))));
  const showAt = (g: number) => f >= R(g);
  return (
    <>
    <BlackCollageGround variant="whitePaper" seed="s20" />
    <DesignSpace><div style={{ position: "absolute", inset: 0, transform: `scale(${head.z * pz})`, transformOrigin: "46% 52%", filter: head.b + pb > 0.3 ? `blur(${head.b + pb}px) brightness(${1 + push * 0.03})` : undefined }}>
      <TypeWallpaper />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${grow})`, transformOrigin: "46% 52%" }}>
        {showAt(E.cutMelvin + 8) && <div style={{ position: "absolute", left: 990, top: 120, filter: OUT }}><Reel w={480} h={480} /></div>}
        <TornPhoto src="assets/cc0/portraits/victorian-man-full-length-cdv-1870.jpg" x={580} y={225} width={560} height={520} border={12} objectPosition="50% 12%" seed="melvin" />
        {showAt(E.lp) && <div style={{ position: "absolute", left: 1440, top: 285, filter: OUT, transform: "rotate(3deg)" }}><Sleeve w={285} h={285} title="A QUIET STORM" /></div>}
        {showAt(E.cutMelvin + 10) && <div style={{ position: "absolute", left: 1290, top: 740, width: 90, height: 60, background: "#E9E9E6", filter: OUT, font: `700 22px ${FONTS.CONDENSED}`, color: "#222", textAlign: "center", lineHeight: "60px" }}>96.3</div>}
        <LabelStrip lines={["MELVIN LINDSEY"]} x={1125} y={640} delay={R(E.labelIn)} reveal="slide" revealFrames={8} role={{ ...earwormType.stripLabel, cap: 48 }} seed="melvinlbl" />
        {showAt(E.scrap) && <div style={{ position: "absolute", left: 1060, top: 790, filter: OUT, transform: "rotate(-4deg)" }}><Newsprint w={180} h={90} seed="lindsey" head="Lindsey" fs={9} /></div>}
        {showAt(E.scribble) && (
          <svg width={420} height={330} style={{ position: "absolute", left: 640, top: 760 }}>
            <path d="M20 280 C80 120 140 330 190 160 S280 40 330 190 380 300 400 120" fill="none" stroke="#3A4A89" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          </svg>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: white }} />
    </div></DesignSpace>
    </>
  );
};
