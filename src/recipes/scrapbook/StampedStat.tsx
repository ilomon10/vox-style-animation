import React from "react";
import { distressMask } from "../../earworm/shared";
import { useDrawingFrame } from "../../lib/time";
import { rand } from "../../lib/random";
import { voxScrapbook as C } from "../../tokens/colors";
import { voxScrapbookType as T } from "../../tokens/type";
import { groundColor, lerp, Pic, ScrapGround, SourceLine, tween, Txt } from "../../scrapbook/kit";
import { ev, RecipeFrame, type RecipeProps } from "../shared";

export type StampedStatProps = {
  /** the stamped number or word: "16", "97 %" */
  value: string;
  /** small stamp lines under it: "CAB DRIVERS SCANNED", "LONDON · 2000" */
  caption?: string;
  sub?: string;
  /** an ephemera page image (passport, ticket, form); default a drawn ledger page */
  page?: string;
  /** stamp ink: red | purple | black or a hex */
  ink?: string;
  /** stamp angle (default −8°) */
  rotate?: number;
  /** ground colour around the page (default sky) */
  ground?: string;
  source?: string;
};

const INK: Record<string, string> = { red: C.stampRed, purple: C.stampPurple, black: "#1A1A1A" };

/**
 * Recipe "stamped stat" (vox_braintravel M18): the page rises into frame (10 f), the camera pushes into it (×1.3 → 1,
 * 12 f, ease-out), then the stamp lands (3 f overshoot, a thud) and its ink texture re-inks every 24 f (1 Hz), as
 * measured. Event: `stamp` (the measured value is readable about 18 f after its word).
 */
export const StampedStat: React.FC<RecipeProps<StampedStatProps>> = ({ ctx, value, caption, sub, page, ink = "red", rotate = -8, ground = "sky", source }) => {
  const f = useDrawingFrame();
  const atStamp = ev(ctx, "stamp", 18);
  const rise = tween(f, 0, 10, "enter");
  const push = tween(f, 8, 12, "enter");
  const land = tween(f, atStamp, 3, "pop");
  const color = INK[ink] ?? groundColor(ink);
  const reink = Math.floor(Math.max(0, f - atStamp) / 24);
  const shift = Math.floor(rand(`${ctx.seed}-ink-${reink}`) * 900);
  const pw = 1180, ph = 800, px = (1920 - pw) / 2, py = (1080 - ph) / 2;
  return (
    <RecipeFrame seed={ctx.seed} ground="none">
      <ScrapGround ctx={ctx} color={ground} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1.3, 1, push)})`, transformOrigin: "50% 55%" }}>
        <div style={{ position: "absolute", left: px, top: py, width: pw, height: ph, transform: `translateY(${lerp(900, 0, rise)}px) rotate(${lerp(6, 1.5, rise)}deg)`,
          filter: "drop-shadow(4px 8px 12px rgba(0,0,0,0.3))" }}>
          {page ? <Pic ctx={ctx} src={page} w={pw} h={ph} fit="cover" /> : (
            <div style={{ position: "absolute", inset: 0, background: C.page, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 88, background: "#D7CFC4" }} />
              {Array.from({ length: 13 }, (_, i) => (
                <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 140 + i * 48, height: 2, background: "rgba(80,110,150,0.28)" }} />
              ))}
              <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, width: 2, background: "rgba(190,80,70,0.35)" }} />
              {Array.from({ length: 9 }, (_, i) => (
                <div key={`w${i}`} style={{ position: "absolute", left: 170, top: 168 + i * 48, height: 12, borderRadius: 3, background: "rgba(60,55,50,0.16)",
                  width: 300 + Math.floor(rand(`${ctx.seed}-w${i}`) * 560) }} />
              ))}
            </div>
          )}
          {f >= atStamp && (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${lerp(1.6, 1, land)})`,
              opacity: lerp(0.4, 0.9, land), mixBlendMode: "multiply", ...distressMask(shift, shift / 2) }}>
              <div style={{ border: `9px solid ${color}`, borderRadius: 26, padding: "26px 54px 30px", outline: `3px solid ${color}`, outlineOffset: 10, textAlign: "center" }}>
                <Txt role={{ ...T.stamp, color }} trim>{value}</Txt>
                {caption && <Txt role={{ ...T.stampLine, color }} style={{ marginTop: 34 }} trim>{caption}</Txt>}
                {sub && <Txt role={{ ...T.stampLine, cap: 30, color }} style={{ marginTop: 18 }} trim>{sub}</Txt>}
              </div>
            </div>
          )}
        </div>
      </div>
      <SourceLine text={source} />
    </RecipeFrame>
  );
};
