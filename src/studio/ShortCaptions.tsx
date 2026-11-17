import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame } from "remotion";
import { measureText } from "@remotion/layout-utils";
import type { CueIndex } from "../audio";
import { DESIGN_PORTRAIT, DesignSpace } from "../lib/stage";
import { ROBOTO } from "../tokens/fonts";
import { packaging } from "../tokens/colors";
import type { CaptionPos } from "./types";
import type { ResolvedScene } from "./resolve";

/**
 * Every style value of the burned-in Shorts captions in ONE place (design px on the 1080×1920 canvas, 24 fps).
 * Measured from three official Vox Shorts: analysis/vox-shorts.md §4 and spec §7(a).
 */
export const SHORT_CAPTION_STYLE = {
  /** type: Roboto 500 45 px (cap 32, x-height 23), letter-spacing -0.02 em, line-height 50.5 px, white, no stroke / shadow */
  font: ROBOTO,
  weight: 500,
  size: 45,
  letterSpacingEm: -0.02,
  lineHeight: 50.5,
  /** baseline distance from the top of a line box (Roboto metrics 0.928 / 0.244 em, half-leading -1.12; -2 px calibrated so the measured ink baseline hits the spec rows) */
  baselineInLine: 38.63,
  color: "#FFFFFF",
  /** page: <= maxLines lines, line ink <= maxInk, centred on centerX */
  maxLines: 2,
  maxInk: 735,
  centerX: 540,
  /** backing: union of the line boxes (ascent above / descent below the baseline) + padX left/right + padY top/bottom, black at 26 %, square */
  backingColor: "#000000",
  backingOpacity: 0.26,
  backingPadX: 10,
  backingPadY: 9,
  lineAscent: 31,
  lineDescent: 9.5,
  /** karaoke box: height `boxH` starting `boxAbove` above the baseline, word ink + boxPadX per side, lemon, radius 3; the active word turns black */
  highlightColor: packaging.lemon,
  highlightTextColor: "#000000",
  boxH: 48,
  boxAbove: 35,
  boxPadX: 7.5,
  boxRadius: 3,
  /** per-word pop of the box (scale about its centre) on frames 0..5 after the box turns on */
  pop: [0.96, 1.03, 1.05, 1.04, 1.01, 1.0],
  /** frames at 24 fps (scaled): the box turns on this long after the whisper word start (Vox +2 f), but never later than the audible onset;
   *  a page comes up `pageLeadF` before its first box; the last page stays `lagF` after its last word */
  startLagF: 2,
  pageLeadF: 1,
  lagF: 6,
  /** baselines (y of the baseline) of a page with one / two lines. `bottom`: full-frame shots, block centre 1688; `seam`: two-up shots, block centre 1010 */
  baselines: {
    bottom: { one: 1700, two: [1674, 1725] },
    seam: { one: 1022, two: [997, 1047] },
  } as Record<CaptionPos, { one: number; two: [number, number] }>,
};
export type ShortCaptionStyle = typeof SHORT_CAPTION_STYLE;

/** one displayed unit: a cue word, or the cue words a `captions.replace` entry swaps for one token */
type Token = { text: string; at: number };
type Placed = Token & { x: number; w: number };
export type Page = { lines: Placed[][]; ink: [number, number]; start: number; end: number };
export type Measure = (text: string) => number;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const SENTENCE_END = /[.!?…]["'”’)\]]*$/;
const ABBREV = /^(?:(?:[A-Za-z]\.)+|Mr\.|Mrs\.|Ms\.|Dr\.|St\.|vs\.|No\.)$/;
/** leading / trailing punctuation of a cue word, kept around a replacement ("six," -> "1806,") */
const edges = (w: string): [string, string] => [w.match(/^[^\p{L}\p{N}]*/u)![0], w.match(/[^\p{L}\p{N}]*$/u)![0]];

/** display tokens with their box-on frames (storyboard fps, VO lead added). Cue text is the script's text (case, punctuation) from make_cues;
 *  `replace` swaps spoken phrases ("twenty nineteen") for display text ("2019"), one box over all the words it replaces. */
export const buildTokens = (cues: CueIndex, leadF: number, fps: number, replace: Record<string, string> = {}, st: ShortCaptionStyle = SHORT_CAPTION_STYLE): Token[] => {
  const lag = Math.round((st.startLagF * fps) / 24);
  const words = cues.words.map((w) => ({ text: w.text.replace(/[*_]/g, "").trim(), start: w.frame_start, onset: w.frame_onset })).filter((w) => w.text);
  const rules = Object.entries(replace)
    .map(([k, v]) => ({ key: k.split(/\s+/).map(norm).filter(Boolean), to: v }))
    .filter((r) => r.key.length)
    .sort((a, b) => b.key.length - a.key.length);
  const out: Token[] = [];
  let last = -1;
  for (let i = 0; i < words.length; ) {
    const rule = rules.find((r) => r.key.every((k, j) => words[i + j] && norm(words[i + j].text) === k));
    const n = rule ? rule.key.length : 1;
    const w = words[i];
    const text = rule ? `${edges(w.text)[0]}${rule.to}${edges(words[i + n - 1].text)[1]}` : w.text;
    // on at whisper start + 2 f, never later than the audible onset; strictly increasing
    const at = Math.max(last + 1, 0, Math.min(w.start + lag, w.onset) + leadF);
    out.push({ text, at });
    last = at;
    i += n;
  }
  return out;
};

/** pages: never across a sentence end, <= maxLines lines of measured ink <= maxInk, filled greedily; a sentence tail is its own page */
export const buildPages = (tokens: Token[], endF: number, measure: Measure, fps: number, st: ShortCaptionStyle = SHORT_CAPTION_STYLE): Page[] => {
  const sentences: Token[][] = [];
  let cur: Token[] = [];
  tokens.forEach((t, i) => {
    cur.push(t);
    const next = tokens[i + 1];
    if (SENTENCE_END.test(t.text) && !(ABBREV.test(t.text) && next && /^\p{Ll}/u.test(next.text))) { sentences.push(cur); cur = []; }
  });
  if (cur.length) sentences.push(cur);

  const groups: Token[][][] = []; // page -> lines -> tokens
  for (const s of sentences) {
    let page: Token[][] = [[]];
    for (const t of s) {
      const line = page[page.length - 1];
      if (line.length && measure([...line, t].map((x) => x.text).join(" ")) > st.maxInk) {
        if (page.length >= st.maxLines) { groups.push(page); page = [[t]]; } else page.push([t]);
      } else line.push(t);
    }
    groups.push(page);
  }

  const lag = Math.round((st.lagF * fps) / 24);
  const pages: Page[] = groups.map((lines) => {
    const first = lines[0][0].at;
    const placed = lines.map((l) => {
      const w = measure(l.map((t) => t.text).join(" "));
      const left = st.centerX - w / 2;
      return l.map((t, i) => {
        const upto = l.slice(0, i + 1).map((x) => x.text).join(" ");
        const tw = measure(t.text);
        return { ...t, x: left + measure(upto) - tw, w: tw };
      });
    });
    const ink: [number, number] = [Math.min(...placed.map((l) => l[0].x)), Math.max(...placed.map((l) => l[l.length - 1].x + l[l.length - 1].w))];
    return { lines: placed, ink, start: Math.max(0, first - Math.round((st.pageLeadF * fps) / 24)), end: 0 };
  });
  pages.forEach((p, i) => {
    const n = pages[i + 1];
    const lastLine = p.lines[p.lines.length - 1];
    p.end = n ? n.start : Math.max(lastLine[lastLine.length - 1].at + 1, endF + lag);
  });
  return pages;
};

/** measure with the caption font (call only once the font is loaded) */
export const captionMeasure = (st: ShortCaptionStyle = SHORT_CAPTION_STYLE): Measure => (text) =>
  measureText({ text, fontFamily: st.font, fontSize: st.size, fontWeight: st.weight, letterSpacing: `${st.letterSpacingEm}em`, validateFontIsLoaded: true }).width;

/** hold the render until the caption font is loaded: the text measuring must see the real glyphs */
const useCaptionFont = (st: ShortCaptionStyle) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const h = delayRender("caption font");
    document.fonts.load(`${st.weight} ${st.size}px ${st.font}`).then(() => { setReady(true); continueRender(h); }, () => { setReady(true); continueRender(h); });
  }, [st]);
  return ready;
};

/** Burned-in karaoke captions over the whole timeline. Hard page swaps, box pop per word (spec §7a). */
export const ShortCaptions: React.FC<{
  cues: CueIndex; leadF: number; fps: number; scenes: ResolvedScene[]; pos: CaptionPos; replace?: Record<string, string>; style?: ShortCaptionStyle;
}> = ({ cues, leadF, fps, scenes, pos, replace, style = SHORT_CAPTION_STYLE }) => {
  const f = useCurrentFrame();
  const ready = useCaptionFont(style);
  const pages = useMemo(() => {
    if (!ready) return [];
    const last = cues.words[cues.words.length - 1];
    return buildPages(buildTokens(cues, leadF, fps, replace, style), (last?.frame_end ?? 0) + leadF, captionMeasure(style), fps, style);
  }, [ready, cues, leadF, fps, replace, style]);
  const page = pages.find((p) => f >= p.start && f < p.end);
  if (!page) return null;
  const scene = scenes.find((s) => f >= s.start && f < s.end);
  // Vox cuts to a clean end card 3–6 f after the last word: no caption page may linger over it
  if (scene && (scene.recipe === "ShortEnd" || scene.recipe === "EndCard")) return null;
  const st = style;
  const scenePos = scene?.captionPos ?? pos;
  const bl = st.baselines[scenePos];
  const ys = page.lines.length === 1 ? [bl.one] : bl.two;
  const flat = page.lines.flat();
  const cur = flat.reduce((a, t, i) => (t.at <= f ? i : a), -1);
  const x0 = page.ink[0] - st.backingPadX;
  const top = ys[0] - st.lineAscent - st.backingPadY;
  const bottom = ys[page.lines.length - 1] + st.lineDescent + st.backingPadY;
  const pop = cur >= 0 ? st.pop[Math.min(f - flat[cur].at, st.pop.length - 1)] : 1;
  const text: React.CSSProperties = {
    position: "absolute", whiteSpace: "pre", fontFamily: st.font, fontWeight: st.weight, fontSize: st.size, lineHeight: `${st.lineHeight}px`, height: st.lineHeight, letterSpacing: `${st.letterSpacingEm}em`,
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <DesignSpace design={DESIGN_PORTRAIT}>
        <div style={{ position: "absolute", left: x0, top, width: page.ink[1] - page.ink[0] + 2 * st.backingPadX, height: bottom - top, background: st.backingColor, opacity: st.backingOpacity }} />
        {cur >= 0 ? (
          <div
            style={{
              position: "absolute", left: flat[cur].x - st.boxPadX, width: flat[cur].w + 2 * st.boxPadX, height: st.boxH,
              top: ys[page.lines.findIndex((l) => l.includes(flat[cur]))] - st.boxAbove,
              background: st.highlightColor, borderRadius: st.boxRadius, transform: `scale(${pop})`,
            }}
          />
        ) : null}
        {page.lines.map((line, li) =>
          line.map((t, i) => (
            <div key={`${li}-${i}`} style={{ ...text, left: t.x, top: ys[li] - st.baselineInLine, color: t === flat[cur] ? st.highlightTextColor : st.color }}>{t.text}</div>
          )),
        )}
      </DesignSpace>
    </AbsoluteFill>
  );
};
