import type React from "react";
import { ShortDocument } from "./ShortDocument";
import { ShortEnd } from "./ShortEnd";
import { ShortHook } from "./ShortHook";
import { ShortPhoto } from "./ShortPhoto";
import { ShortQuote } from "./ShortQuote";
import { ShortSteps } from "./ShortSteps";
import { ShortTimeline } from "./ShortTimeline";

export { ShortDocument, ShortEnd, ShortHook, ShortPhoto, ShortQuote, ShortSteps, ShortTimeline };

const n = (id: string, count: number) => Array.from({ length: count }, (_, i) => `${id}${i}`);

/** portrait recipes (1080×1920 design space, `format: "short"`), see analysis/vox-shorts.md §7 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SHORT_RECIPES: Record<string, { component: React.FC<any>; events: string[] }> = {
  ShortHook: { component: ShortHook, events: [] },
  ShortPhoto: { component: ShortPhoto, events: ["label", "card0", "card1", "counter"] },
  ShortDocument: { component: ShortDocument, events: ["hl0", "hl1", "hl2", "isolate", "translation", "push"] },
  ShortTimeline: { component: ShortTimeline, events: n("item", 8) },
  ShortSteps: { component: ShortSteps, events: n("step", 6) },
  ShortQuote: { component: ShortQuote, events: n("line", 8) },
  ShortEnd: { component: ShortEnd, events: [] },
};
