import type React from "react";
import { ColdOpenYear } from "./ColdOpenYear";
import { DataChart } from "./DataChart";
import { DocumentHighlight } from "./DocumentHighlight";
import { EndCard } from "./EndCard";
import { FootageClip } from "./FootageClip";
import { GiantWordCard } from "./GiantWordCard";
import { KaraokeQuote } from "./KaraokeQuote";
import { KeywordCut } from "./KeywordCut";
import { MapRouteScene } from "./MapRouteScene";
import { MontageCrane } from "./MontageCrane";
import { NameCardInterview } from "./NameCardInterview";
import { PhotoCollageUnfold } from "./PhotoCollageUnfold";
import { QuoteCard } from "./QuoteCard";
import { SeriesIdent } from "./SeriesIdent";
import { SHORT_RECIPES } from "./short";

export * from "./shared";
export { ColdOpenYear, DataChart, DocumentHighlight, EndCard, FootageClip, GiantWordCard, KaraokeQuote, KeywordCut, MapRouteScene, MontageCrane, NameCardInterview, PhotoCollageUnfold, QuoteCard, SeriesIdent };

/** name used in storyboard.json `recipe` -> component. Every recipe also accepts `ctx` (see shared.tsx) and the events listed in its JSDoc. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RECIPES: Record<string, { component: React.FC<any>; events: string[]; layout?: "landscape" | "portrait" }> = {
  ColdOpenYear: { component: ColdOpenYear, events: ["year", "place"] },
  KeywordCut: { component: KeywordCut, events: ["pop", "sub", "exit"] },
  PhotoCollageUnfold: { component: PhotoCollageUnfold, events: ["title"] },
  NameCardInterview: { component: NameCardInterview, events: ["resolve", "lowerThird", "exit"] },
  KaraokeQuote: { component: KaraokeQuote, events: [] },
  GiantWordCard: { component: GiantWordCard, events: ["converge", "photo", "exit"] },
  MontageCrane: { component: MontageCrane, events: [] },
  MapRoute: { component: MapRouteScene, events: ["route", "label"] },
  DocumentHighlight: { component: DocumentHighlight, events: ["ring0", "ring1", "ring2", "hl0", "hl1", "hl2", "read", "isolate", "push"] },
  DataChart: { component: DataChart, events: ["count", "label"] },
  QuoteCard: { component: QuoteCard, events: ["type", "done", "credit"] },
  EndCard: { component: EndCard, events: [] },
  SeriesIdent: { component: SeriesIdent, events: [] },
  FootageClip: { component: FootageClip, events: ["lowerThird", "date"] },
};

// portrait-native recipes (src/recipes/short/): 1080×1920 design space in a `format: "short"` storyboard
for (const [name, r] of Object.entries(SHORT_RECIPES)) RECIPES[name] = { ...r, layout: "portrait" };
