import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { AnnotationLabel, TornPhoto, TypewriterSlide } from "../../earworm";
import { useDrawingFrame } from "../../lib/time";
import { ease } from "../../tokens/easing";
import { earwormType } from "../../tokens/type";
import { GraphPaper, Hat, PRIV } from "./art";
import { Cam, drawings12 } from "./camera";
import type { Events } from "./events";

/** 4c-1: the slam photo and its five swaps (torn edge re-cut each drawing for 8 f, then hold), local frames */
const SWAPS: { src: string; w: number; h: number; x: number; y: number; rot: number }[] = [
  { src: "pa.jpg", w: 540, h: 640, x: 960, y: 540, rot: -3 }, // slam
  { src: "pd.jpg", w: 640, h: 690, x: 960, y: 520, rot: 2 }, // beat 989 − 1
  { src: "pc.jpg", w: 560, h: 650, x: 940, y: 560, rot: -5 }, // 991
  { src: "pb.jpg", w: 600, h: 600, x: 975, y: 545, rot: 3 }, // 997
  { src: "pe.jpg", w: 620, h: 520, x: 960, y: 540, rot: -2 }, // rect at 1001
];

export const ClintonPhotos: React.FC<{ E: Events }> = ({ E }) => {
  const f = useDrawingFrame() + E.slam; // sequence starts at the slam
  const t = [E.slam, E.swaps[0], E.swaps[1], E.swaps[2], E.rect];
  let k = 0;
  t.forEach((tt, i) => { if (f >= tt) k = i; });
  const s = SWAPS[k];
  const circleP = Math.min(1, Math.max(0, (f - E.rect) / (E.circle - E.rect))); // 0 rect → 1 circle
  const pad = 14;
  if (f >= E.rect) {
    // morph: rect → rounded → circle over the last drawings, white torn edge follows
    const d = 615;
    const w = s.w + (d - s.w) * circleP;
    const h = s.h + (d - s.h) * circleP;
    const r = Math.min(w, h) / 2 * ease("enter")(circleP);
    return (
      <div style={{ position: "absolute", left: s.x - w / 2 - pad, top: s.y - h / 2 - pad, width: w + 2 * pad, height: h + 2 * pad, borderRadius: r + pad, background: "#E1E3E5", transform: `rotate(${s.rot * (1 - circleP)}deg)` }}>
        <div style={{ position: "absolute", inset: pad, borderRadius: r, overflow: "hidden", background: "#bbb" }}>
          <Img src={PRIV(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.15)" }} />
        </div>
      </div>
    );
  }
  return (
    <TornPhoto
      src={`_private/earwormB/${s.src}`} width={s.w} height={s.h} x={s.x - s.w / 2} y={s.y - s.h / 2} rotate={s.rot} seed={`c1-${k}`} border={14} rough={9}
      boil={f - t[k] < 12 ? 1 : undefined} slam={k === 0 ? { drawings: 2, from: 1.22 } : undefined}
    />
  );
};

/** 4c-2 + exit: Clinton in a circle (Ø615) with the hat breaking out of the mask, type at the left, push, label */
const CIRCLE = { x: 960, y: 640, d: 615 };
export const ClintonCircle: React.FC<{ E: Events }> = ({ E }) => {
  const raw = useDrawingFrame(); // local to this Sequence (starts at E.circle for 4c-2)
  const f = raw + E.circle;
  // pop settle ×0.935 → 1.009 → 1.001 (f1005–1012)
  const pop = f < E.circle ? 0.935 : f < E.circle + 2 ? 0.935 : f < E.circle + 4 ? 1.009 : f < E.circle + 7 ? 1.004 : 1;
  // push-in ×1.674 (E.pushStart … +50), (.85,.10,.05,1); face pans 520 px left
  // push progress = cumulative frame-difference energy of the reference (drawings on twos: f1062, 64, … 1112), the same read-off as the
  // crash push of segment A. Peak speed at f1085 (+14.7 %/drawing), 98 % done by 1102 (earworm-B §7).
  const PUSH: [number, number][] = [[269, 0.003], [271, 0.01], [273, 0.019], [275, 0.031], [277, 0.047], [279, 0.067], [281, 0.091], [283, 0.12], [285, 0.158], [287, 0.208], [289, 0.275], [292, 0.382], [294, 0.553], [296, 0.69], [298, 0.763], [300, 0.815], [302, 0.859], [304, 0.892], [306, 0.919], [308, 0.94], [310, 0.956], [312, 0.969], [314, 0.979], [317, 0.987], [319, 0.994], [321, 1]];
  const rawF = useCurrentFrame() + E.circle;
  const dP = E.pushStart - 271; // the table is in the reference's own local frames (push start = local 271 = f1062)
  let prog = 0;
  for (const [t, v] of PUSH) if (rawF - dP >= t) prog = v;
  let z = Math.exp(Math.log(1.674) * prog);
  if (f >= E.labelExit + 2) {
    // accelerating push into the jump: per drawing 1.006 → 1.041 (f1124–1134)
    const n = drawings12(f - (E.labelExit + 2) + 0.01);
    const fac = [1.006, 1.012, 1.02, 1.03, 1.041, 1.05];
    for (let i = 0; i <= Math.min(n, 5); i++) z *= fac[i];
  }
  const cx = 960 + 412 * prog;
  const cy = 540 + 60 * prog;
  const hatW = 640;
  const scaleCircle = pop;
  return (
    <Cam z={z} cx={cx} cy={cy}>
      {/* type at the left, in the world (GEORGE small over CLINTON) */}
      <TypewriterSlide text="GEORGE" delay={E.george - E.circle} finishAt={E.george - E.circle + 12} x={340} y={488} role={{ ...earwormType.keyword, cap: 52 }} slideLetters={1} />
      <TypewriterSlide text="CLINTON" delay={E.clinton - E.circle} finishAt={E.clinton - E.circle + 20} x={480} y={580} role={{ ...earwormType.keyword, cap: 80 }} slideLetters={1} />
      {/* circle + backing */}
      <div style={{ position: "absolute", left: CIRCLE.x - CIRCLE.d / 2, top: CIRCLE.y - CIRCLE.d / 2, width: CIRCLE.d, height: CIRCLE.d, transform: `scale(${scaleCircle})` }}>
        <div style={{ position: "absolute", left: -14, top: -14, width: CIRCLE.d + 28, height: CIRCLE.d + 28, borderRadius: "50%", background: "#E1E3E5" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
          <GraphPaper w={CIRCLE.d} h={CIRCLE.d} />
          <Img src={PRIV("sq.jpg")} style={{ position: "absolute", left: -267, top: -106, width: 1150, height: 1150, filter: "grayscale(1) contrast(1.2)", mixBlendMode: "multiply" }} />
        </div>
        <div style={{ position: "absolute", left: (CIRCLE.d - hatW) / 2, top: -125, width: hatW, height: hatW / 2 }}><Hat w={hatW} /></div>
      </div>
      <AnnotationLabel lines={["PARLIAMENT", "BAND", "LEADER"]} x={1327} y={528} delay={E.label - E.circle} typeRate={1} bullet arrow={{ from: { x: 1372, y: 680 }, to: { x: 1157, y: 627 } }} exitAt={E.labelExit - E.circle} seed="lab" />
    </Cam>
  );
};

/** the circle jumps to the left edge at the cut to 4d (×1.8) and slides out in 3 drawings */
export const CircleSlide: React.FC = () => {
  const f = useDrawingFrame();
  const k = Math.min(4, Math.floor((f * 12) / 25 + 1e-9));
  const shift = [0, 300, 700, 1100, 1500][k];
  return (
    <Cam z={1.82} cx={1564} cy={600}>
      <div style={{ position: "absolute", left: 960 - 307 - shift / 1.82, top: 640 - 307, width: 615, height: 615, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 14px #E1E3E5" }}>
        <GraphPaper w={615} h={615} />
        <Img src={PRIV("sq.jpg")} style={{ position: "absolute", left: -267, top: -106, width: 1150, height: 1150, filter: "grayscale(1) contrast(1.2)", mixBlendMode: "multiply" }} />
      </div>
    </Cam>
  );
};
