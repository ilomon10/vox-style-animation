import React from "react";
import { staticFile } from "remotion";
import { useDrawingFrame } from "../../lib/time";
import { voxScrapbook as C } from "../../tokens/colors";
import { groundColor, lerp, Pic, PlateFrame, ScrapGround, SourceLine, SpecimenLabel, tween } from "../../scrapbook/kit";
import { ev, isMissing, RecipeFrame, type RecipeProps } from "../shared";

type Label = { fig?: string; lines: string[]; x: number; y: number; from?: { x: number; y: number }; at?: number; align?: "left" | "right"; width?: number };

export type SpecimenPlateProps = {
  /** tracked small caps above the frame, e.g. "DIAGRAM OF THE HIPPOCAMPUS" */
  title?: string;
  /** the specimen: an engraving, a drawing or a cut-out. Give w/h in the image's own aspect (the magnifier relies on it) */
  subject: { src: string; x?: number; y?: number; w?: number; h?: number; blend?: "multiply" | "normal"; tumble?: boolean };
  /** a soft disc behind the subject (colour, diameter, centre); false for none */
  backdrop?: { color?: string; d?: number; cx?: number; cy?: number } | false;
  /** a small ring on the subject, tangent lines, and a big circle showing that spot enlarged */
  magnifier?: { x: number; y: number; r?: number; bx: number; by: number; br?: number; zoom?: number; at?: number };
  /** "fig." labels on leaders (design px; `from` = the point the leader starts at) */
  labels?: Label[];
  /** source line, bottom-left */
  source?: string;
  /** paper colour (default white) */
  ground?: string;
  /** on a word (event `swap`): the subject and/or the labels' lines change */
  swap?: { subject?: string; labels?: string[][] };
};

const tangents = (ax: number, ay: number, r: number, bx: number, by: number, R: number) => {
  const d = Math.hypot(bx - ax, by - ay) || 1;
  const nx = -(by - ay) / d, ny = (bx - ax) / d;
  return [[ax + nx * r, ay + ny * r, bx + nx * R, by + ny * R], [ax - nx * r, ay - ny * r, bx - nx * R, by - ny * R]];
};

/**
 * Recipe "specimen plate" (vox_braintravel M3): white watercolour plate, rounded hairline frame, tracked "DIAGRAM OF …"
 * title. The subject tumbles in (+45° → 0 with a scale-up, 14 f), a backdrop disc unfolds behind it, a magnifier ring
 * with tangents opens onto an enlarged detail, labels fade in on leaders, then the source line. Events: `subject`,
 * `backdrop`, `magnifier`, `label0`…`label3`, `source`, `swap`.
 */
export const SpecimenPlate: React.FC<RecipeProps<SpecimenPlateProps>> = ({ ctx, title, subject, backdrop, magnifier, labels = [], source, ground = "white", swap }) => {
  const f = useDrawingFrame();
  const sx = subject.x ?? 560, sy = subject.y ?? 190, sw = subject.w ?? 800, sh = subject.h ?? 700;
  const atSubject = ev(ctx, "subject", 4);
  const atDisc = ev(ctx, "backdrop", atSubject + 4);
  const atMag = magnifier?.at ?? ev(ctx, "magnifier", atSubject + 22);
  const atSwap = swap ? ev(ctx, "swap", Number.POSITIVE_INFINITY) : Number.POSITIVE_INFINITY;
  const sw8 = tween(f, atSwap, 8, "fadeIn");
  const t = tween(f, atSubject, 14, "enter");
  const tumble = subject.tumble !== false;
  const disc = backdrop === false ? null : { color: backdrop?.color ?? C.disc, d: backdrop?.d ?? Math.max(sw, sh) * 0.98,
    cx: backdrop?.cx ?? sx + sw / 2, cy: backdrop?.cy ?? sy + sh / 2 };
  const dt = tween(f, atDisc, 12, "discGrow");
  const blend = subject.blend ?? "multiply";
  const swapSrc = swap?.subject;
  const m = magnifier;
  const mt = m ? tween(f, atMag, 6, "fadeIn") : 0;
  const R = m?.br ?? 225, r = m?.r ?? 35, zoom = m?.zoom ?? 3;
  const detailSrc = m && !isMissing(ctx, swapSrc && sw8 > 0.5 ? swapSrc : subject.src) ? (swapSrc && sw8 > 0.5 ? swapSrc : subject.src) : undefined;
  return (
    <RecipeFrame seed={ctx.seed} ground="none">
      <ScrapGround ctx={ctx} color={groundColor(ground)} />
      <PlateFrame title={title} />
      {disc && (
        <div style={{ position: "absolute", left: disc.cx - disc.d / 2, top: disc.cy - disc.d / 2, width: disc.d, height: disc.d, borderRadius: "50%",
          background: groundColor(disc.color), opacity: 0.9, transform: `scale(${dt})`, filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.12))" }} />
      )}
      {/* the blend sits on the outermost wrapper: a transform or opacity on a parent would isolate it from the paper */}
      <div style={{ position: "absolute", left: sx, top: sy, width: sw, height: sh, opacity: f < atSubject ? 0 : 1, mixBlendMode: blend,
        transform: tumble ? `rotate(${lerp(45, 0, t)}deg) scale(${lerp(0.55, 1, t)})` : `scale(${lerp(0.92, 1, t)})` }}>
        <div style={{ position: "absolute", inset: 0, opacity: swapSrc ? 1 - sw8 : 1 }}><Pic ctx={ctx} src={subject.src} w={sw} h={sh} /></div>
        {swapSrc && <div style={{ position: "absolute", inset: 0, opacity: sw8 }}><Pic ctx={ctx} src={swapSrc} w={sw} h={sh} /></div>}
      </div>
      {m && mt > 0 && (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: mt }} width={1} height={1}>
            {tangents(m.x, m.y, r, m.bx, m.by, R).map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.labelInk} strokeWidth={2} />
            ))}
            <circle cx={m.x} cy={m.y} r={r} fill="none" stroke={C.labelInk} strokeWidth={3} />
          </svg>
          <div style={{ position: "absolute", left: m.bx - R, top: m.by - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden",
            border: `3px solid ${C.labelInk}`, background: C.white, opacity: mt, transform: `scale(${lerp(0.85, 1, mt)})`,
            backgroundImage: detailSrc ? `url(${staticFile(detailSrc)})` : undefined, backgroundRepeat: "no-repeat",
            backgroundSize: `${sw * zoom}px ${sh * zoom}px`, backgroundPosition: `${R - (m.x - sx) * zoom}px ${R - (m.y - sy) * zoom}px`,
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.18))" }} />
        </>
      )}
      {labels.map((l, i) => {
        const at = l.at ?? ev(ctx, `label${i}`, atMag + 4 + i * 6);
        const o = tween(f, at, 6, "fadeIn");
        const lines = swap?.labels?.[i] && sw8 > 0.5 ? swap.labels[i] : l.lines;
        return o > 0 ? <SpecimenLabel key={i} fig={l.fig} lines={lines} x={l.x} y={l.y} from={l.from} opacity={o} draw={o} align={l.align} width={l.width} /> : null;
      })}
      <SourceLine text={source} opacity={tween(f, ev(ctx, "source", atMag + 10), 4, "fadeIn")} />
    </RecipeFrame>
  );
};
