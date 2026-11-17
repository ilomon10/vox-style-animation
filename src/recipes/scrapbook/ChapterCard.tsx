import React from "react";
import { AbsoluteFill } from "remotion";
import { useDrawingFrame } from "../../lib/time";
import { voxScrapbook as C } from "../../tokens/colors";
import { fontSizeFor, voxScrapbookType as T } from "../../tokens/type";
import { enter, halftoneInk, Pic, Scrap, ScrapGround, textWidth, tween, Txt, useFontsReady } from "../../scrapbook/kit";
import { ev, RecipeFrame, type RecipeProps } from "../shared";

type Piece = { src: string; x: number; y: number; w: number; h: number; rotate?: number; kind?: "engraving" | "print"; at?: number };

export type ChapterCardProps = {
  /** "One", "Two"… shown as "Chapter One" on an aged scrap; omit it for a title or end card */
  number?: string;
  /** the chapter title, on a torn strip in a halftone serif */
  title: string;
  /** a small line on the scrap instead of "Chapter N" (e.g. our series name on an end card) */
  kicker?: string;
  /** section colour: pink | mint | blue | coral | white | cork | creamMap | sky, or a hex */
  ground?: string;
  /** the collage around the title: engravings fade in multiplied (6 f), prints rise from below (8 f) */
  pieces?: Piece[];
  /** title strip colour (default pale blue) and ink (default slate) */
  strip?: string;
  ink?: string;
};

/**
 * Recipe "torn-paper chapter card" (vox_braintravel M7): hard cut to a section-colour paper, then a build in 22–40 f —
 * engravings fade (6 f), documents rise from below (8 f), "Chapter N" drops (4 f, event `number`), the title strip wipes in
 * left to right (8 f, event `title`). Hold, then a hard cut or a paperSlide out. Events: `number`, `title`.
 */
export const ChapterCard: React.FC<RecipeProps<ChapterCardProps>> = ({ ctx, number, title, kicker, ground = "pink", pieces = [], strip = C.stripBlue, ink = C.slate }) => {
  const f = useDrawingFrame();
  const atNumber = ev(ctx, "number", 14);
  const atTitle = ev(ctx, "title", atNumber + 4);
  const fs = fontSizeFor(T.chapterTitle);
  const ready = useFontsReady(T.chapterTitle, T.chapterNumber);
  // the strip fits the title (measured in its font) + padding, shrunk when it would leave the frame
  const est = textWidth(T.chapterTitle, title, ready, 0.5) + 170;
  const scale = Math.min(1, 1560 / est);
  const stripW = Math.min(1600, est * scale);
  const stripH = Math.round(fs * scale * 1.32);
  const wipe = tween(f, atTitle, 8, "labelWipe");
  const top = number ? `Chapter ${number}` : kicker;
  // the scrap fits its text plus the hairline rule and padding
  const topW = top ? Math.round(textWidth(T.chapterNumber, top, ready, 0.56)) + 34 + 22 + 150 + 46 : 0;
  const drop = enter(f, atNumber, 4, { dy: -70, rot: -4 }, "pop");
  return (
    <RecipeFrame seed={ctx.seed} ground="none">
      <ScrapGround ctx={ctx} color={ground} />
      {pieces.map((p, i) => {
        const at = p.at ?? (p.kind === "engraving" ? i * 2 : 4 + i * 3);
        const m = p.kind === "engraving"
          ? { opacity: tween(f, at, 6, "fadeIn"), transform: `rotate(${p.rotate ?? 0}deg)` }
          : enter(f, at, 8, { dy: 140, rot: (p.rotate ?? 0) + 6 }).style;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, ...m,
            ...(p.kind === "engraving" ? { mixBlendMode: "multiply" } : { filter: "drop-shadow(3px 5px 7px rgba(0,0,0,0.28))" }) }}>
            <div style={{ transform: p.kind === "engraving" ? undefined : `rotate(${p.rotate ?? 0}deg)` }}>
              <Pic ctx={ctx} src={p.src} w={p.w} h={p.h} filter={p.kind === "engraving" ? "grayscale(1) contrast(1.05)" : undefined} />
            </div>
          </div>
        );
      })}
      <AbsoluteFill>
        {top && (
          <div style={{ position: "absolute", left: 210, top: 338, ...drop.style }}>
            <Scrap w={topW} h={96} color="#E9E3D6" seed={`${ctx.seed}-n`} rough={8}>
              <div style={{ position: "absolute", left: 34, top: 30, display: "flex", alignItems: "center", gap: 22 }}>
                <Txt role={T.chapterNumber} style={{ whiteSpace: "pre" }}>{top}</Txt>
                <div style={{ width: 150, height: 2, background: C.chapterInk, opacity: 0.8 }} />
              </div>
            </Scrap>
          </div>
        )}
        <div style={{ position: "absolute", left: 170, top: 448, width: stripW, height: stripH, opacity: f >= atTitle ? 1 : 0,
          clipPath: `inset(-20px ${(1 - wipe) * 100}% -20px -20px)` }}>
          <Scrap w={stripW} h={stripH} color={strip} seed={`${ctx.seed}-t`} rough={12}>
            <div style={{ position: "absolute", left: 70 * scale, top: stripH * 0.17 }}>
              <Txt role={{ ...T.chapterTitle, cap: T.chapterTitle.cap * scale, color: ink }} style={halftoneInk(ink, Math.max(3, 5 * scale))}>{title}</Txt>
            </div>
          </Scrap>
        </div>
      </AbsoluteFill>
    </RecipeFrame>
  );
};
