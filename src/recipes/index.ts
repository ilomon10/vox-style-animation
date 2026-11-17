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
import { ChapterCard } from "./scrapbook/ChapterCard";
import { PaperStat } from "./scrapbook/PaperStat";
import { SpecimenCompare } from "./scrapbook/SpecimenCompare";
import { SpecimenInterview } from "./scrapbook/SpecimenInterview";
import { SpecimenPlate } from "./scrapbook/SpecimenPlate";
import { StampedStat } from "./scrapbook/StampedStat";

export * from "./shared";
export { ColdOpenYear, DataChart, DocumentHighlight, EndCard, FootageClip, GiantWordCard, KaraokeQuote, KeywordCut, MapRouteScene, MontageCrane, NameCardInterview, PhotoCollageUnfold, QuoteCard, SeriesIdent };
export { ChapterCard, PaperStat, SpecimenCompare, SpecimenInterview, SpecimenPlate, StampedStat };

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
  // scrapbook look (voxScrapbook, analysis/vox-sample/vox_braintravel.md)
  ChapterCard: { component: ChapterCard, events: ["number", "title"] },
  SpecimenPlate: { component: SpecimenPlate, events: ["subject", "backdrop", "magnifier", "label0", "label1", "label2", "label3", "source", "swap"] },
  PaperStat: { component: PaperStat, events: ["value", "context", "payoff"] },
  StampedStat: { component: StampedStat, events: ["stamp"] },
  SpecimenCompare: { component: SpecimenCompare, events: ["left", "right", "callouts"] },
  SpecimenInterview: { component: SpecimenInterview, events: ["label"] },
};

// portrait-native recipes (src/recipes/short/): 1080×1920 design space in a `format: "short"` storyboard
for (const [name, r] of Object.entries(SHORT_RECIPES)) RECIPES[name] = { ...r, layout: "portrait" };
