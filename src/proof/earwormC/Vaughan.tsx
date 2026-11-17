import React from "react";
import { useCurrentFrame } from "remotion";
import type { CueIndex } from "../../audio";
import { BlackCollageGround, LabelStrip, TornPhoto } from "../../earworm";
import { BokehVisualizer, HEAD_PATH, newsprintBackground } from "../../earworm/fx";
import { useDrawingFrame } from "../../lib/time";
import { DesignSpace } from "../../lib/stage";
import { earwormType } from "../../tokens/type";
import type { Events } from "./events";

const maskUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='${HEAD_PATH}' fill='black'/></svg>`)}")`;

/** newsprint-filled head silhouette (the match device, earworm-C §8 C-NMW) centred at (cx, cy), design px */
const NewsHead: React.FC<{ cx: number; cy: number; size: number }> = ({ cx, cy, size }) => (
  <div style={{ position: "absolute", left: cx - size / 2, top: cy - size * 0.35, width: size, height: size, ...newsprintBackground, WebkitMaskImage: maskUrl, maskImage: maskUrl, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
);

/** swinging microphone on its indigo cable, pivot at the top right; angle 30° → 0 over 10 f, no overshoot */
const Mic: React.FC<{ at: number; done: number }> = ({ at, done }) => {
  const f = useDrawingFrame();
  const p = Math.min(1, Math.max(0, (f - at) / (done - at)));
  const a = f < at ? 32 : 30 * Math.exp(-(f - at) / 10); void p;
  return (
    <div style={{ position: "absolute", left: 1660, top: -30, width: 0, height: 0, transform: `rotate(${a}deg)`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 6, height: 190, background: "#3A4A89" }} />
      <div style={{ position: "absolute", left: -64, top: 170, width: 128, height: 250, borderRadius: 40, background: "repeating-linear-gradient(0deg,#B9B9B6 0 5px,#8A8A87 5px 8px)", border: "5px solid #1E1E1E", boxShadow: "0 0 3px #E8E8E8" }} />
      <div style={{ position: "absolute", left: -74, top: 150, width: 148, height: 36, borderRadius: 8, background: "#D5D5D2", border: "4px solid #1E1E1E" }} />
    </div>
  );
};

/** S21: Sarah Vaughan. Newsprint head lifts off her face (f2637–2643), labels rise, dots power on then bars follow the 150–400 Hz band, mic swings in, head covers her again and a defocus push into the cut. */
export const Vaughan: React.FC<{ E: Events; cues: CueIndex }> = ({ E, cues }) => {
  const raw = useCurrentFrame();
  const f = useDrawingFrame();
  const R = (g: number) => g - E.cutVaughan;
  // lift: visible from the cut, slides up-left off the face over rel 2–8
  const lt = Math.min(1, Math.max(0, (f - R(E.maskLift)) / 6));
  const liftE = lt * lt * (3 - 2 * lt);
  // cover: enters top right, slides over the face over 8 f; then a 4 f defocus push
  const ct = Math.min(1, Math.max(0, (f - R(E.cover)) / 8));
  const coverE = ct * ct * (3 - 2 * ct);
  const pushK = raw < R(E.cover) + 9 ? -1 : Math.floor(((raw - R(E.cover) - 9) * 12) / 25 + 1e-9);
  const pz = pushK < 0 ? 1 : [1.05, 1.12, 1.22, 1.34][Math.min(3, pushK)];
  const pb = pushK < 0 ? 0 : [4, 9, 15, 22][Math.min(3, pushK)];
  return (
    <>
    <BlackCollageGround seed="s21" />
    <DesignSpace><div style={{ position: "absolute", inset: 0, transform: `scale(${pz})`, transformOrigin: "35% 45%", filter: pb ? `blur(${pb}px) brightness(${1 + pushK * 0.05})` : undefined }}>
      <BokehVisualizer cues={cues} onAt={R(E.dots)} barsAt={R(G2(E))} cueOffset={E.cutVaughan} seed="vaughan" />
      <TornPhoto src="assets/cc0/portraits/victorian-man-full-length-cdv-1870.jpg" x={-40} y={-30} width={1060} height={1140} border={14} rough={9} objectPosition="50% 8%" seed="vaughan" />
      <div style={{ position: "absolute", left: 1010, top: 0, width: 20, height: 1080, background: "#3A4A89", opacity: 0.9, clipPath: "polygon(0 0,100% 4%,60% 30%,100% 55%,40% 80%,100% 100%,0 100%)" }} />
      <Mic at={R(E.mic)} done={R(E.micDone)} />
      <LabelStrip lines={["SARAH VAUGHAN"]} x={1300} y={800} delay={R(E.nameLabel)} reveal="rise" revealFrames={4} sub="STARDUST" subDelay={5} subOffset={{ x: 250, y: 14 }} role={{ ...earwormType.stripLabel, cap: 47 }} seed="vaughanlbl" />
      {f < R(E.maskLift) + 8 && <NewsHead cx={560 - 640 * liftE} cy={420 - 1100 * liftE} size={900} />}
      {f >= R(E.cover) && ct <= 1 && <NewsHead cx={1900 - (1900 - 560) * coverE} cy={-300 + (420 + 300) * coverE} size={900} />}
      {pushK >= 0 && <NewsHead cx={560} cy={420} size={900} />}
    </div></DesignSpace>
    </>
  );
};
/** frame (global) the bars may start: first sung note + 1 (earworm-C §14) — kept here so Vaughan.tsx has no magic number */
const G2 = (E: Events) => E.firstNote - 3;
