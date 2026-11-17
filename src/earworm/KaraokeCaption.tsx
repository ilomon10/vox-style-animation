import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { CueIndex } from "../audio/cues";
import { ease } from "../tokens/easing";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim } from "../type/shared";
import { distressMask } from "./shared";

/** One caption token: a vocal word, or a syllable chunk of a long word. `f` = syllable onset, sequence-relative frames. */
export type CaptionToken = {
  text: string;
  f: number;
  /** first token of a vocal phrase: the caption scrolls (current line → previous) here */
  phraseStart?: boolean;
  /** continues the previous token without a space (syllable chunks) */
  joinPrev?: boolean;
};

/** vowel-group syllable count (heuristic, English) */
export const syllableCount = (w: string): number => {
  const s = w.toLowerCase().replace(/[^a-z]/g, "").replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (s.match(/[aeiouy]{1,2}/g) || []).length);
};

/** split a word into syllable chunks at vowel-group boundaries (consonant cluster goes to the following syllable, minus one) */
export const syllableChunks = (w: string): string[] => {
  const m = w.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]+(?![aeiouy])|[^aeiouy](?=[^aeiouy]))?/gi);
  return m && m.join("") === w ? m : [w];
};

/**
 * Cue words → caption tokens: ONE token per vocal word, syllable chunks (timed evenly across the word) for words longer
 * than 3 syllables (analysis/earworm-A.md §15 R6). Uses `frame_onset` (refined attack) so captions land on the sound.
 * `offset` is subtracted from every frame (put the tokens in the sequence's time).
 */
export const captionTokens = (idx: CueIndex, opts: { from?: number; to?: number; offset?: number } = {}): CaptionToken[] => {
  const { from = 0, to = Infinity, offset = 0 } = opts;
  const starts = new Set(idx.phrases.map((p) => p.word_start));
  const out: CaptionToken[] = [];
  idx.words.forEach((w, i) => {
    if (w.frame_onset < from || w.frame_onset > to) return;
    const clean = w.text.trim();
    const chunks = syllableCount(clean) > 3 ? syllableChunks(clean) : [clean];
    chunks.forEach((c, k) => {
      const t = w.frame_onset + ((w.frame_end - w.frame_onset) * k) / chunks.length;
      out.push({ text: c, f: Math.round(t) - offset, phraseStart: k === 0 && starts.has(i), joinPrev: k > 0 });
    });
  });
  return out;
};

export type KaraokeCaptionProps = {
  tokens: CaptionToken[];
  /** "speech": archival speech — caption leads its syllable by 4 f; "sung": lands at the onset +1 f (earworm-D §15 R5, earworm-A R6) */
  mode?: "speech" | "sung";
  /** override the signed offset of the token's appearance relative to the onset (frames; −4 speech, +1 sung) */
  offsetF?: number;
  role?: TypeRole;
  /** baseline of the CURRENT line, design px (≈580 = 54 % H, earworm-A §4) */
  baselineY?: number;
  /** max characters per line (≤ 20) */
  maxChars?: number;
  /** text grid in frames (3 f = 8.33 dps) */
  grid?: number;
  /** rise distance and duration (95 px, 9 f, ease `enter`) */
  risePx?: number;
  riseFrames?: number;
  /** opacity of the previous line (35 %) */
  prevOpacity?: number;
  /** line pitch in caps (1.6× cap = 130 px) */
  pitch?: number;
  /** restart the 3 f text grid at every line's first token (measured: the reference grid phase changes from line to line,
   *  earworm-A §12 caption table: 457/463/469 ≡ 1, 501…522 ≡ 0, 535…544 ≡ 1, 551…572 ≡ 2). Default false = one grid per sequence. */
  gridPerLine?: boolean;
  style?: React.CSSProperties;
};

/**
 * Karaoke caption of a vocal: tokens appear at onset (+1 sung / −4 speech), snapped UP to a 3-frame text grid, rise 95 px while
 * fading in over 9 f (`enter`). At most 2 lines: current 100 %, previous 35 %; the scroll is one drawing (a cut) at phrase starts.
 * Rise steps on the 3 f grid; opacity runs on ones (fades are measured on ones). analysis/earworm-A.md §4, §7, §15 R6.
 */
export const KaraokeCaption: React.FC<KaraokeCaptionProps> = ({
  tokens, mode = "sung", offsetF, role = earwormType.caption, baselineY = 580, maxChars = 20, grid = 3, risePx = 95,
  riseFrames = 9, prevOpacity = 0.35, pitch = 1.6, gridPerLine = false, style,
}) => {
  const frame = useCurrentFrame();
  const g = Math.floor(frame / grid) * grid; // text drawing
  const lead = offsetF ?? (mode === "speech" ? -4 : 1);
  const appear = (t: CaptionToken, a0 = 0) => a0 + Math.ceil((t.f + lead - a0) / grid) * grid;

  // build lines: new line at a phrase start or when ≤ maxChars would be exceeded (whole words, chunks stay together)
  type Item = { tok: CaptionToken; a: number };
  const lines: Item[][] & { a0?: number[] } = [];
  const a0s: number[] = [];
  let len = 0;
  tokens.forEach((t, i) => {
    const joined = t.joinPrev && lines.length;
    const w = t.text.length + (joined ? 0 : 1);
    if (!joined && (t.phraseStart || !lines.length || len + w > maxChars)) {
      // a word's chunks are never split across lines: handled by joinPrev
      lines.push([]);
      a0s.push(gridPerLine ? Math.round(t.f + lead) : 0);
      len = 0;
    }
    lines[lines.length - 1].push({ tok: t, a: appear(t, a0s[a0s.length - 1]) });
    len += w;
    void i;
  });

  // current line = last whose first token has appeared on this text drawing
  let cur = -1;
  lines.forEach((l, k) => {
    if (frame >= l[0].a) cur = k;
  });
  if (cur < 0) return null;
  const capPx = role.cap;
  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {lines.map((l, k) => {
        const d = cur - k;
        if (d < 0 || d > 1) return null;
        const top = baselineY - capPx - d * pitch * capPx;
        return (
          <div
            key={k}
            style={{ position: "absolute", left: 0, width: 1920, top, textAlign: "center", whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...role, leading: 1 }), ...distressMask(k * 211 % 900, k * 97 % 900) }}
          >
            {l.map(({ tok, a }, j) => {
              const t = (gridPerLine ? a0s[k] + Math.floor((frame - a0s[k]) / grid) * grid : g) - a; // rise on the text grid
              const vis = frame >= a;
              const rise = risePx * (1 - ease("enter")(Math.min(1, Math.max(0, t / riseFrames))));
              const op = interpolate(frame, [a, a + riseFrames], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (vis ? 1 : 0);
              return (
                <span
                  key={j}
                  style={{ display: "inline-block", marginLeft: tok.joinPrev || j === 0 ? 0 : capPx * 0.5, opacity: op * (d === 1 ? prevOpacity : 1), transform: `translateY(${vis ? rise : 0}px)` }}
                >
                  {tok.text}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
