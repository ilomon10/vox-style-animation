import type React from "react";
import { darkCollage, paperDesk, voxEarworm, voxEditorial, voxExplainer, voxLight, voxScrapbook } from "./colors";
import { FONTS, type FontKey } from "./fonts";

/**
 * Cap-height ratios (cap height / font-size) measured by rendering "H" in headless Chrome
 * (src/tools/FontMetrics.tsx). Size type by the MEASURED CAP HEIGHT of the reference,
 * not by font-size: fontSize = cap / CAP_RATIO[font].
 */
export const CAP_RATIO: Record<FontKey, number> = {
  CASLON: 0.77,
  CASLON_DISPLAY: 0.69,
  GELASIO: 0.693,
  PLAYFAIR: 0.708,
  VOX_SERIF: 0.77,
  VOX_SANS: 0.742,
  MARKER: 0.57,
  MARKER_THICK: 0.753,
  SLAB: 0.778,
  TYPEWRITER: 0.708,
  OLD_BOOK: 0.681,
  SPOOKY: 0.669,
  NEWS: 0.655,
  MASTHEAD: 0.931,
  CONDENSED: 0.81,
  DISPLAY_CONDENSED: 0.859,
  TEXT_SERIF: 0.67,
  SMALL_SANS: 0.728,
  EXTENDED: 0.687,
};

export type TypeRole = {
  font: FontKey;
  /** measured cap height in design px @1080p */
  cap: number;
  weight: number;
  italic?: boolean;
  color: string;
  /** line-height as a multiple of font-size */
  leading?: number;
  /** letter-spacing in em */
  tracking?: number;
  uppercase?: boolean;
  /** horizontal squash, e.g. 0.82 for the condensed spooky title */
  scaleX?: number;
  numeric?: "lining-nums" | "oldstyle-nums";
};

export const fontSizeFor = (r: TypeRole) => r.cap / CAP_RATIO[r.font];

/** CSS for a type role at design scale (inside <DesignSpace>). */
export const typeStyle = (r: TypeRole): React.CSSProperties => ({
  fontFamily: FONTS[r.font],
  fontSize: fontSizeFor(r),
  fontWeight: r.weight,
  fontStyle: r.italic ? "italic" : "normal",
  color: r.color,
  lineHeight: r.leading ?? 1.15,
  letterSpacing: r.tracking ? `${r.tracking}em` : undefined,
  textTransform: r.uppercase ? "uppercase" : undefined,
  fontVariantNumeric: r.numeric,
  fontKerning: "normal",
  whiteSpace: "pre",
});

/** Paper desk (Porsche). Editorial serif only — no sans-serif anywhere. */
export const paperDeskType = {
  /** big centred year, often on a yellow box ("1900", "2024") */
  year: { font: "CASLON", cap: 126, weight: 400, color: paperDesk.inkPlum, leading: 1 },
  /** model / section title inside the highlight box ("Porsche Panamera") */
  title: { font: "CASLON", cap: 69, weight: 700, color: paperDesk.inkBrown, leading: 1 },
  /** line under the title ("The price at launch is $89,800") */
  subtitle: { font: "CASLON", cap: 33, weight: 400, color: paperDesk.inkPlum },
  /** ▶ caption over footage: bold italic (Georgia Bold Italic ≈ exact → Gelasio), lower-left, no box,
   *  old-style figures */
  caption: { font: "GELASIO", cap: 38, weight: 700, italic: true, color: paperDesk.captionYellow, numeric: "oldstyle-nums" },
  /** quote on grid paper (typewritten or per-word fade), 67 px line pitch */
  quote: { font: "GELASIO", cap: 38, weight: 600, italic: true, color: paperDesk.inkQuote, leading: 1.22 },
  attribution: { font: "GELASIO", cap: 22, weight: 700, color: paperDesk.inkAttribution },
  /** place label in a yellow box with a pointer ("STUTTGART") */
  placeLabel: { font: "GELASIO", cap: 90, weight: 700, color: paperDesk.labelInk, uppercase: true, leading: 1 },
  /** two-line name label in a yellow box ("Ferdinand / Porsche"), 82 px pitch */
  nameLabel: { font: "GELASIO", cap: 65, weight: 600, color: paperDesk.labelInk, leading: 1.26 },
  /** italic callout label on a yellow box opening from the leader end ("rear-engine design") */
  calloutLabel: { font: "GELASIO", cap: 47, weight: 400, italic: true, color: paperDesk.calloutInk, leading: 1 },
  /** typed statement on crumpled paper ("But the true revolution came in 1963") */
  typed: { font: "CASLON", cap: 60, weight: 400, color: paperDesk.inkTyped, leading: 1.25 },
  /** glowing year on the dark-map timeline */
  timelineYear: { font: "CASLON", cap: 116, weight: 400, color: paperDesk.timelineCream, leading: 1 },
  /** CRT slot-reel words */
  slotReel: { font: "CASLON", cap: 45, weight: 700, color: paperDesk.inkBrown, leading: 1 },
  /** big figure ("$43 000 000 000" — thousands separated by spaces) */
  figure: { font: "CASLON", cap: 82, weight: 700, color: paperDesk.inkBrown, leading: 1 },
  /** neon year / label on near-black (add glow) */
  neon: { font: "CASLON", cap: 85, weight: 700, color: paperDesk.neon, leading: 1 },
  /** Didone numerals on scalloped desk slips ("356", "911") */
  slip: { font: "PLAYFAIR", cap: 90, weight: 400, color: "#2A2522", leading: 1, numeric: "lining-nums" },
  slipWord: { font: "PLAYFAIR", cap: 41, weight: 400, color: "#3A2E33", leading: 1 },
  chartTitle: { font: "CASLON", cap: 33, weight: 700, color: paperDesk.charcoal },
  chartAxis: { font: "CASLON", cap: 18, weight: 400, color: paperDesk.charcoal },
  chartValue: { font: "CASLON", cap: 20, weight: 700, color: paperDesk.maroon },
} satisfies Record<string, TypeRole>;

/** Vox explainer. Serif = topic, sans = concept, handwriting = labels on physical things. */
export const voxType = {
  title: { font: "VOX_SERIF", cap: 69, weight: 700, color: voxExplainer.ink, leading: 1 },
  header: { font: "VOX_SERIF", cap: 42, weight: 700, color: voxExplainer.ink, leading: 1 },
  flag: { font: "VOX_SERIF", cap: 39, weight: 700, color: voxExplainer.inkOnYellow, leading: 1 },
  /** heavy grotesque annotation ("Sexual orientation") */
  annotation: { font: "VOX_SANS", cap: 48, weight: 800, color: voxExplainer.inkSans, leading: 1.05, tracking: -0.01 },
  /** small card text */
  cardText: { font: "VOX_SANS", cap: 27, weight: 700, color: voxExplainer.inkSans, leading: 1.27 }, // 46 px pitch
  /** yellow callout on a black card ("Methyl group") */
  callout: { font: "VOX_SANS", cap: 31, weight: 700, color: voxExplainer.sansYellow, leading: 1.05, tracking: -0.01 },
  /** all-caps felt tip on tape */
  tape: { font: "MARKER", cap: 40, weight: 400, color: voxExplainer.marker, uppercase: true, tracking: 0.04, leading: 1 },
  /** handwriting written on (same voice as tape labels) */
  handwriting: { font: "MARKER", cap: 40, weight: 400, color: voxExplainer.marker, uppercase: true, tracking: 0.04, leading: 1 },
  /** chisel marker on sticky notes */
  sticky: { font: "MARKER_THICK", cap: 69, weight: 400, color: "#4E4A45", leading: 1 },
} satisfies Record<string, TypeRole>;

/** Dark collage (Dracula). Found / printed type on physical carriers. */
export const collageType = {
  /** black slab numeral ("XV"), printed on paper */
  display: { font: "SLAB", cap: 235, weight: 400, color: darkCollage.displayRed, leading: 1 },
  /** typewriter label under the display ("century") */
  label: { font: "TYPEWRITER", cap: 36, weight: 400, color: "#6E2426", tracking: 0.1, leading: 1 },
  /** date printed on a book page ("1897") */
  date: { font: "OLD_BOOK", cap: 55, weight: 400, color: darkCollage.pageInk, leading: 1 },
  /** spooky end title, boils every 6 f @24 */
  endTitle: { font: "SPOOKY", cap: 226, weight: 700, color: darkCollage.titleOrange, leading: 1.12, scaleX: 0.82, uppercase: true },
} satisfies Record<string, TypeRole>;

/** "The Highlight by Vox" editorial intro. */
export const editorialType = {
  /** high-contrast display title ("The Highlight"); 65 px small state, 102 px after the snap zoom */
  title: { font: "PLAYFAIR", cap: 65, weight: 800, color: voxEditorial.titleInk, leading: 1 },
  byline: { font: "VOX_SANS", cap: 26, weight: 600, color: voxEditorial.ink, uppercase: true, leading: 1 },
  headline: { font: "NEWS", cap: 53, weight: 700, color: voxEditorial.ink, leading: 0.95 }, // ≈67–77 px pitch, tight
  body: { font: "NEWS", cap: 33, weight: 400, color: voxEditorial.ink, leading: 0.96 }, // 47 px pitch (proof-fitted)
  tag: { font: "NEWS", cap: 26, weight: 400, color: voxEditorial.paper, leading: 1 }, // proof-fitted
  masthead: { font: "MASTHEAD", cap: 63, weight: 700, color: voxEditorial.ink, leading: 1 }, // proof-fitted
} satisfies Record<string, TypeRole>;

/** Vox light paper. Sentence case; serif for statements, quotes and labels (≈ Harriet / Scotch → Source Serif 4),
 *  heavy grotesque for titles and captions (≈ Franklin Gothic → Libre Franklin 800), Inter for small text.
 *  Caps measured on EL 6:27 (quote line pitch 80 px, cap ≈ 40; "Source:" cap 20, baseline y 1026, x 93); `small` is the spec's Inter 21 px (cap 15.3). */
export const voxLightType = {
  title: { font: "VOX_SANS", cap: 92, weight: 800, color: voxLight.ink, leading: 1.05 },
  quote: { font: "TEXT_SERIF", cap: 40, weight: 600, color: voxLight.ink, leading: 1.4 },
  attribution: { font: "TEXT_SERIF", cap: 30, weight: 600, color: voxLight.ink, leading: 1.2 },
  label: { font: "TEXT_SERIF", cap: 30, weight: 600, color: voxLight.ink, leading: 1.2 },
  caption: { font: "VOX_SANS", cap: 30, weight: 800, color: voxLight.ink, leading: 1.1 },
  /** "Source: Alexander Keyssar", bottom-left of EL (serif); other looks use the spec's Inter */
  source: { font: "TEXT_SERIF", cap: 20, weight: 600, color: voxLight.sourceInk, leading: 1.2 },
  small: { font: "SMALL_SANS", cap: 15.3, weight: 500, color: voxLight.sourceInk, leading: 1.2 },
} satisfies Record<string, TypeRole>;

/** Vox Earworm. One condensed family carries every role; SIZE is the hierarchy (20 → 45 → 77 → 120–230 →
 *  full-bleed). The serif appears only on name cards. Key words in blue — never a whole sentence. */
export const earwormType = {
  /** display digits / data ("1976") */
  digits: { font: "CONDENSED", cap: 205, weight: 600, color: voxEarworm.accent, leading: 1 },
  /** kinetic key word / title ("CHOCOLATE CITY", "POST-INDUSTRIAL") */
  keyword: { font: "CONDENSED", cap: 124, weight: 700, color: voxEarworm.accent, leading: 1, uppercase: true },
  /** big letters partly behind props ("R & B") */
  bigLetters: { font: "CONDENSED", cap: 215, weight: 700, color: voxEarworm.accent, leading: 1, uppercase: true },
  /** single giant word title card, 16–21 % of frame height ("SPEECHES"), letters converge */
  giantWord: { font: "DISPLAY_CONDENSED", cap: 200, weight: 400, color: voxEarworm.displayDark, leading: 1, uppercase: true, tracking: 0.12 },
  /** full-bleed kinetic words of archival voices ("DID YOU WANT TO EAR…") */
  kinetic: { font: "DISPLAY_CONDENSED", cap: 240, weight: 400, color: voxEarworm.kinetic, leading: 0.95, uppercase: true },
  /** karaoke caption of an archival vocal, ≤20 chars per line, previous line at 35 % */
  caption: { font: "CONDENSED", cap: 81, weight: 500, color: voxEarworm.offWhite, leading: 1.6, uppercase: true },
  /** sung lyric line over a record */
  lyric: { font: "CONDENSED", cap: 77, weight: 600, color: voxEarworm.white, leading: 1.2, uppercase: true },
  /** station / label box ("WHUR 96.3") on #181818 */
  label: { font: "CONDENSED", cap: 94, weight: 700, color: voxEarworm.accent, leading: 1, uppercase: true },
  /** off-white label caps on a charcoal torn strip ("FENDER / RHODES") */
  stripLabel: { font: "CONDENSED", cap: 62, weight: 700, color: voxEarworm.offWhite, leading: 1, uppercase: true },
  subLabel: { font: "CONDENSED", cap: 31, weight: 600, color: voxEarworm.offWhite, leading: 1, uppercase: true },
  /** light annotation label with an X bullet ("PARLIAMENT / BAND / LEADER") */
  annotation: { font: "CONDENSED", cap: 32, weight: 300, color: voxEarworm.labelGrey, leading: 1.15, tracking: 0.2, uppercase: true },
  /** name card: name (tracks in +1 em → 0 with a random-letter decode) */
  name: { font: "CONDENSED", cap: 64, weight: 600, color: voxEarworm.accent, leading: 1, uppercase: true },
  nameTitle: { font: "TEXT_SERIF", cap: 40, weight: 400, color: voxEarworm.serifGrey, leading: 1.1 },
  nameAffiliation: { font: "TEXT_SERIF", cap: 27, weight: 400, italic: true, color: voxEarworm.serifGrey, leading: 1.1 },
  /** secondary serif line ("Washington, DC") */
  serifLine: { font: "TEXT_SERIF", cap: 45, weight: 400, color: "#BBBDBC", leading: 1 },
  /** artist / song tags on slips */
  artistTag: { font: "CONDENSED", cap: 45, weight: 600, color: voxEarworm.white, leading: 1, uppercase: true },
  songTag: { font: "CONDENSED", cap: 34, weight: 500, color: voxEarworm.white, leading: 1, uppercase: true },
  /** "now playing" credit, top-left, no box */
  nowPlaying: { font: "SMALL_SANS", cap: 20, weight: 500, color: voxEarworm.white, leading: 1 },
  /** series card (extended heavy grotesque) — design your own; never reproduce a real logo */
  seriesCard: { font: "EXTENDED", cap: 128, weight: 800, color: "#9C9C9C", leading: 1, uppercase: true },
} satisfies Record<string, TypeRole>;

/** Scientific scrapbook (vox_braintravel §4.2): cap heights in design px @1080p (measured as % of frame height). */
export const voxScrapbookType = {
  chapterTitle: { font: "TEXT_SERIF", cap: 122, weight: 700, color: voxScrapbook.slate, leading: 1 }, // 10.8–11.8 %
  chapterNumber: { font: "TEXT_SERIF", cap: 39, weight: 600, color: voxScrapbook.chapterInk, leading: 1 }, // 3.6 %
  diagramTitle: { font: "CASLON", cap: 22, weight: 400, color: voxScrapbook.diagramInk, uppercase: true, tracking: 0.12 }, // 2.0 %
  fig: { font: "CASLON", cap: 30, weight: 400, color: voxScrapbook.labelInk, leading: 1.15 },
  labelName: { font: "CASLON", cap: 44, weight: 700, color: voxScrapbook.labelInk, leading: 1.1 }, // 4.1 %
  labelRole: { font: "CASLON", cap: 30, weight: 400, color: voxScrapbook.labelInk, tracking: 0.05, leading: 1.25 }, // 2.8 %
  labelFigure: { font: "CASLON", cap: 45, weight: 400, color: voxScrapbook.labelInk, numeric: "oldstyle-nums" }, // 4.2 %
  statNumber: { font: "TEXT_SERIF", cap: 130, weight: 600, color: voxScrapbook.statInk, leading: 1 }, // ≈ 12 %
  statContext: { font: "CASLON", cap: 34, weight: 400, color: voxScrapbook.labelInk, leading: 1.2 },
  statPayoff: { font: "CONDENSED", cap: 118, weight: 700, color: voxScrapbook.kraftInk, uppercase: true, leading: 1 }, // ≈ 11 %
  stamp: { font: "DISPLAY_CONDENSED", cap: 250, weight: 400, color: "#111111", leading: 1, uppercase: true }, // ≈ 23.6 %
  stampLine: { font: "DISPLAY_CONDENSED", cap: 40, weight: 400, color: "#111111", leading: 1, uppercase: true, tracking: 0.06 },
  source: { font: "SMALL_SANS", cap: 19, weight: 500, color: "#111111", uppercase: true, tracking: 0.04 }, // 1.7–1.9 %
} as const satisfies Record<string, TypeRole>;
