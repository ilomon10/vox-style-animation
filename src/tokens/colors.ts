/**
 * Colour tokens per sub-style. Every value is a pixel median measured on native-resolution
 * reference frames (see analysis/*.md §3 and docs/style-guide/02-color.md).
 * Ink is NEVER pure black and paper is NEVER pure white in any of the three styles.
 */

/** Warm "paper desk" scrapbook (Porsche documentary). One accent: lemon highlighter yellow. */
export const paperDesk = {
  paper: "#F9EFE6", // page centre (corners fall to ~#CEC6C0 through the vignette)
  paperCorner: "#CEC6C0",
  paperQuote: "#FDF4EC", // grid-paper quote card
  desk: "#EFE3DA", // desk surface under the scrapbook flyover
  grid: "rgba(90, 80, 70, 0.12)", // 1 px grid lines, 35 px pitch @1080p
  photoBorder: "#F5EFEB", // print border (cooler + lighter than the desk)
  cardBorder: "#EFE7D2", // polaroid-like card border on black
  slip: "#E5E0DC", // scalloped stamp label slip
  highlight: "#F2E600", // highlighter box behind dark serif text
  tape: "#F9EC00", // OPAQUE tape (not translucent)
  captionYellow: "#D8DF2E", // ▶ caption text over dark footage (slightly greener)
  captionTriangle: "#DBD101",
  neon: "#ECF103", // neon year / label core on near-black
  inkBrown: "#482F1D", // title text inside yellow boxes
  inkPlum: "#4A2F39", // subtitles / body on paper
  inkQuote: "#634B53",
  inkAttribution: "#745057",
  inkCaptionDark: "#452F29", // caption text over bright footage
  labelInk: "#3A3021", // text on yellow place/name labels
  calloutInk: "#372D13", // italic callout label text
  inkTyped: "#796259", // typewriter statement on crumpled paper
  bullet: "#160D0E", // ▶ caption triangle (rises, turns −90°, persists across cuts)
  timelineCream: "#F3F7EB", // glowing years and rail on the dark map
  nightMap: "#28231F", // dark map centre (→ #060503 corners)
  charcoal: "#33332F", // chart bars, cut-out dark areas
  maroon: "#7F1322", // hand-drawn rings, chart value labels
  night: "#050402", // black backgrounds (photo walls, neon scenes)
  liftedBlack: "#181812", // darkest value in graphics
  speckDark: "#6F5F55",
  speckRed: "#A2685E",
} as const;

/** Dark cut-out collage (Dracula). ~91 % neutral greys, ~7 % reds, orange only at the end. */
export const darkCollage = {
  plate: "#2B2B2B", // scratched black card, mean
  plateDeep: "#131212",
  plateLift: "#0E0E0E", // black level after grade
  grey1: "#4C4A49",
  grey2: "#63605F",
  grey3: "#817E7C",
  grey4: "#9F9C99",
  grey5: "#BFBDB8",
  cutoutWhite: "#E4E0DC", // cut-out whites stop at L≈200–216
  paperCream: "#D0CABF", // torn paper patches, book pages
  crescent: "#B8B6B1", // cream "page disc" echo
  crimsonEcho: "#8A0315", // flat offset silhouette
  bloodMoon: "#5B0D09",
  seatRed: "#710202",
  cushionRed: "#64191A",
  damaskWine: "#462528",
  cherry: "#AC0E08", // brightest red, tiny accents only
  inkSplat: "#8F2A2A",
  displayRed: "#923F41", // "XV"
  routeMaroon: "#581C1C", // map route line, pins, labels
  batRose: "#794349",
  scribbleRed: "#883838",
  fogRed: "#5D1F1E",
  gilt: "#AE783E",
  titleOrange: "#B66D24", // end title only
  floorEllipse: "#6F6461",
  stickerWhite: "#F4F4F4",
  pageInk: "#3B3533",
} as const;

/** Vox explainer (epigenetics). Neutral desk, yellow accent family, red/green for data. */
export const voxExplainer = {
  bar: "#1F1F1F", // 4:3 pillarbox bars
  board: "#1F1D20", // dark textured backdrop
  card: "#353336", // black diagram card
  paper: "#D6D3D3", // dotted notebook paper
  paperHi: "#E6E5E6",
  page: "#BFBEBE", // journal page (darker than the desk)
  printBorder: "#E1DDDB",
  kraft: "#ADA9A6", // kraft card / masking tape
  dot: "#4A4A4A", // dot grid ink (drawn at ~35 % → measured #8F868E)
  ink: "#514F53", // serif text
  inkSans: "#464247", // grotesque annotations
  inkOnYellow: "#201E20",
  graphite: "#5F5C62", // pencil rings, sketch arrows
  marker: "#433F30", // warm-black felt tip
  markerBlue: "#596B8D", // 2nd word of tape labels
  sticky: "#F3DA44", // sticky note (warm yellow)
  stickyBack: "#A5931F", // folded back face (-35 % luma)
  tape: "#DDD031", // lime tape label
  tapeBlack: "#221F21",
  flag: "#DFD02C", // flag labels
  flagBack: "#B19E22", // flag curl back face
  markerOnBlack: "#A39334", // yellow marker writing on black tape
  maskingTape: "#C9B48F", // translucent masking tape (≈50 %, multiply)
  highlighter: "#FFF80F", // pigment; ALWAYS mix-blend-mode: multiply
  markerRing: "#D8C92B", // dry-brush yellow rings/swooshes
  rung: "#E5C15E",
  sansYellow: "#D0C133", // callout type on black cards
  red: "#C03D40", // methyl "on" on light ground
  redDark: "#A82136", // on dark ground
  green: "#4AB541", // methyl "off" on light ground
  greenDark: "#31BF29",
  blue: "#4D6DB0",
  handRing: "#E0DBDA",
  shadow: "rgba(0, 0, 0, 0.5)", // world shadow core (multiply)
  logo: "#CFCFCF",
} as const;

/** "The Highlight by Vox" editorial intro: warm grey crumpled paper, mustard highlighter. */
export const voxEditorial = {
  paper: "#B3ACA0", // crumpled sheet (never white)
  ink: "#4C4844", // all text, rules, photo border (never black)
  titleInk: "#3F3B37", // the big title reads darker (stays above the #3F3930 black point)
  highlighter: "#BB923A", // mustard dry-brush, multiplied under the ink
  tag: "#7B3C3A", // oxblood date tag (text inside in paper colour)
  photoMid: "#807972", // B/W photo tinted to the paper
} as const;

/** Vox light paper (family A: Electoral College 2020, Creatine 2026, Clean energy 2024; analysis/vox-framework-coverage.md §2.4):
 *  light grey ground, near-black ink, lemon highlighter multiplied under the ink. No film finish. */
export const voxLight = {
  ground: "#EAEAEA", // CR / CE paper (EL #E9E9E9, ghost newsprint at 5–8 % contrast)
  groundAlt: "#E9E9E9",
  page: "#F6F6F6", // a printed page lying on the ground
  ink: "#262626", // all text (EL #090B0B reads darker, CR/CE #262626)
  highlighter: "#FBFF0B", // lemon; ×multiply on the ground gives CR #E4EC0B, on white CE #FBFF0B / EL #FBF303
  ring: "#E6875A", // EL swing orange, the only warm accent; lemon stays the highlighter
  sourceInk: "#262626",
  grid: "rgba(38,38,38,0.06)", // faint grid (CR / CE)
} as const;

/** Vox "Earworm" (2020s Vox): near-black collage of B&W photo cut-outs with torn white borders,
 *  ONE periwinkle accent, condensed caps; picture and sound edited as one (analysis/earworm-*.md). */
export const voxEarworm = {
  ground: "#0A0A0A", // overlapping black construction paper (luma 4–17), ghost newsprint
  groundScrap: "#181818", // charcoal label boxes / scraps
  strip: "#2F2D2E", // charcoal torn label strips (#282627–#393939)
  slip: "#1F1F1F", // artist-tag slip
  slip2: "#343233", // song-tag slip
  whitePaper: "#F6F6F6", // the alternate white-paper ground (fibre σ≈3–4)
  tornWhite: "#E1E3E5", // torn paper border around photo cut-outs
  accent: "#6B74DE", // periwinkle (#656ED8–#7480F1 measured): data, key words, X marks, cables
  accentDeep: "#4D5092", // credit lines (accent at ≈68 %)
  indigo: "#3A4A89", // cables, vinyl labels (#4F538A)
  glowCore: "#8A92DB", // audio-visualizer core
  glowBody: "#414AA6",
  glow: "#2A3293",
  offWhite: "#BEBDBE", // distressed caption / title type
  kinetic: "#DDDDDB", // full-bleed kinetic words of archival voices
  wood: "#D7D7D5", // distressed wood-type letters
  labelGrey: "#A5A5A5", // light annotation labels
  serifGrey: "#C5C5C5", // name-card serif lines
  displayDark: "#161616", // giant word on white paper
  white: "#FFFFFF", // tags, lyric lines (on black only)
  tape: "#050505", // black tape under sub-labels
  underline: "#F8F005", // the ONE yellow: end-card marker underline
} as const;

/** House packaging measured on the 2019–26 sample (analysis/vox-framework-coverage.md §6.2): lower third, credits
 *  panel, series ident, corner and date tags, subtitles. Look-independent. Our own marks only, never Vox's. */
export const packaging = {
  lemon: "#FDF203", // lower-third bar (HC/CR/EL)
  stripeBar: "#E3E12C", // `stripe` lower-third bar (CE)
  tabGreen: "#5f9a5f", // `tab` lower third (AM)
  tabCream: "#f3efdb",
  cardYellow: "#FDF0AC", // `card` lower third (DA)
  cardRed: "#9F3531",
  creditsPanel: "#292929", // credits end card: left panel
  creditsRole: "#D5D5D5", // roles (serif)
  creditsName: "#AFD2D8", // names (caps)
  creditsDot: "#F9FF0E", // the rule's end dots
  identCard: "#FBFF0B", // `SeriesIdent` card (CE)
  identInk: "#111111",
  identScrim: "rgba(0,0,0,0.22)",
  cornerTagPlate: "rgba(12,12,12,0.5)", // corner source tag plate (CR)
  cornerTagInk: "#FFFFFF",
  dateCream: "#f3efdb", // corner year (AM)
  spineBox: "#282828", // VHS-spine date tag (DA)
  spineInk: "#F4F4F2",
  spineMarks: ["#C85A9A", "#8E2A33", "#EFE41C"],
  subtitleInk: "#FFFFFF",
  footageBars: "#000000", // pillarbox bars (DA)
} as const;

export const palettes = { paperDesk, darkCollage, voxExplainer, voxEditorial, voxLight, voxEarworm } as const;
