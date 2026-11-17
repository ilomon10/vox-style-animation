import React from "react";
import { rand } from "../lib/random";
import { useDrawingFrame } from "../lib/time";
import { voxEarworm } from "../tokens/colors";
import { earwormType, typeStyle, type TypeRole } from "../tokens/type";
import { capTrim, useInlineWidth } from "../type/shared";

export type StationLabelProps = {
  /** bold periwinkle line ("WHUR 96.3") */
  title: string;
  /** serif line under it ("Washington, DC") */
  sub: string;
  /** left / top of the title box, design px */
  x: number;
  y: number;
  /** frame the cursor bar appears (sequence-relative) */
  delay?: number;
  /** cursor → boxes (3 f, earworm-A §7 "Label build": cursor f211, boxes f214–216) */
  boxAfter?: number;
  /** box wipe L→R length (≈3 f) */
  wipeF?: number;
  /** scrambled type-on length (12 f: letters appear in random order, f214–226) */
  scrambleF?: number;
  titleRole?: TypeRole;
  subRole?: TypeRole;
  box?: string;
  padX?: number;
  padY?: number;
  /** gap between the two boxes (≈10 px) */
  gap?: number;
  seed?: string;
};

/** a char index set revealed in random order across [0, 1): returns each char's reveal time in 0..1 */
const revealTimes = (n: number, seed: string) => Array.from({ length: n }, (_, i) => rand(`${seed}-${i}`));

/**
 * Station label: a 2-line cursor bar appears, two #181818 boxes wipe open left→right, then the letters type on in random
 * order (every char has a random reveal time; unrevealed slots stay blank: "Was n t n I" → "Washin ton, DC"), 15 f in total
 * (analysis/earworm-A.md §4 "Station label", §7 "Label build", §9 `StationLabel`). Steps on the drawing clock.
 */
export const StationLabel: React.FC<StationLabelProps> = ({
  title, sub, x, y, delay = 0, boxAfter = 3, wipeF = 3, scrambleF = 12, titleRole = earwormType.label, subRole = earwormType.serifLine,
  box = voxEarworm.groundScrap, padX = 18, padY = 18, gap = 10, seed = "whur",
}) => {
  const g = useDrawingFrame() + 2.5;
  const refT = React.useRef<HTMLDivElement>(null);
  const refS = React.useRef<HTMLDivElement>(null);
  const tw = useInlineWidth(refT);
  const sw = useInlineWidth(refS);
  const h1 = titleRole.cap + 2 * padY;
  const h2 = subRole.cap * 1.5 + 2 * (padY - 8);
  if (g < delay + 2.5) return null;
  const boxAt = delay + boxAfter;
  const wipe = Math.min(1, Math.max(0, (g - boxAt) / wipeF));
  const typeP = Math.min(1, Math.max(0, (g - boxAt) / scrambleF));
  const w1 = tw + 2 * padX;
  const w2 = sw + 2 * padX;
  const shown = (s: string, sd: string) => {
    const t = revealTimes(s.length, sd);
    return Array.from(s).map((c, i) => (c === " " || t[i] <= typeP ? c : " ")).join("");
  };
  const row = (top: number, w: number, h: number, role: TypeRole, text: string, ref: React.RefObject<HTMLDivElement | null>, sd: string, padTop: number) => (
    <div style={{ position: "absolute", left: 0, top, width: w, height: h }}>
      {wipe > 0 && (
        <div style={{ position: "absolute", inset: 0, background: box, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }} />
      )}
      {/* hidden full-width probe so the box fits the final text */}
      <div ref={ref} style={{ position: "absolute", visibility: "hidden", whiteSpace: "pre", ...typeStyle({ ...role, leading: 1 }) }}>{text}</div>
      {wipe > 0 && (
        <div style={{ position: "absolute", left: padX, top: padTop, whiteSpace: "pre", ...capTrim, ...typeStyle({ ...role, leading: 1 }) }}>
          {shown(text, sd)}
        </div>
      )}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      {g < boxAt + 2.5 && <div style={{ position: "absolute", left: 0, top: 0, width: 8, height: h1 + gap + h2, background: voxEarworm.offWhite }} />}
      {row(0, w1, h1, titleRole, title, refT, `${seed}-t`, padY)}
      {row(h1 + gap, w2, h2, subRole, sub, refS, `${seed}-s`, (h2 - subRole.cap) / 2)}
    </div>
  );
};
