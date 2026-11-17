/**
 * Duration tokens in SECONDS (fps-independent). Convert with `useSec()` from lib/time.
 * Each value is a measured duration (source frames @ source fps in the comment).
 */
export const DUR = {
  // ── entrances ───────────────────────────────────────────────────────────────
  titleRise: 0.5, // Vox serif title rising from a baseline mask (12 f @24)
  propEnter: 0.58, // small prop drop/rise/slide, expo-out (14 f @24)
  propEnterBig: 0.83, // big scenery piece (20 f @24)
  carEnter: 0.27, // cut-out already ~70 % through its move on frame 1 (8 f @30)
  cutoutSlide: 1.17, // long figure slide-in on the quote card (35 f @30)
  gravityDrop: 0.33, // furniture dropping with a hard landing (6–10 f @24)
  stickyPeel: 0.33, // sticky note peels on (8 f @24)
  tapeUnfurl: 0.42, // tape label unfurls (10 f @24)
  flagUnfurl: 0.67, // flag label unfurls (16 f @24); stagger 0.6–1.1 s
  dotPop: 0.79, // data dot pops (18–20 f @24)
  insetPop: 0.67, // inset magnification circle (16 f @24)
  // ── exits ───────────────────────────────────────────────────────────────────
  exit: 0.42, // fall-out / slide-out, ease-in (10 f @24)
  // ── text & annotation ───────────────────────────────────────────────────────
  boxWipe: 0.9, // paper-desk highlight box wipe revealing the title (22–32 f @30)
  boxWipeDelay: 0.33, // box starts 10 f after the cut (@30)
  highlightWipe: 0.67, // shorter highlight on a figure (20 f @30)
  highlighter: 0.5, // Vox highlighter swipe (12 f @24)
  drawOn: 0.33, // underline / pencil ring / cross-out stroke (8 f @24)
  handRing: 0.67, // hand-drawn ellipse ring (16 f @24, 16 f @30 for the maroon ring)
  leaderLine: 0.67, // leader line to an inset (16 f @24)
  captionFade: 0.33, // ▶ caption text fade-in, on ones (7–14 f @30)
  captionFadeOut: 0.23, // 7 f @30, ends exactly on the cut
  brushWipe: 0.93, // dry-brush yellow stroke (28 f @30)
  barGrow: 0.6, // one chart bar (13–22 f @30); stagger 2 drawings
  editorialStroke: 0.3, // editorial inline highlighter (accelerating, length-independent)
  editorialTitleStroke: 0.9, // editorial title highlighter
  centerOut: 0.4, // editorial centre-out headline reveal
  slotReel: 0.83, // CRT word reel decelerating onto the target (≈20–25 f)
  odometer: 0.93, // year odometer 2024 → 1900 in 12 steps (28 f @30)
  calloutDisc: 0.4, // paper-desk callout disc grow (12 f @30)
  calloutLine: 0.3, // leader line, starts ≈9 f after the disc
  calloutLabel: 0.33, // label box opening from the line end, starts ≈5 f after the line
  // ── camera ──────────────────────────────────────────────────────────────────
  push: 1.33, // eased push-in to the focal word (32 f @24)
  settle: 1.5, // post-cut decelerating settle (34–44 f @24)
  tilt: 1.07, // tilt to the next line (28–32 f)
  whip: 1.77, // whip-pan across a photo wall (53 f @30)
  crashZoom: 1.04, // ×2.8 crash push (25 f @24)
  pullBack: 0.5, // ×0.8 pull-back (12 f @24)
  punchIn: 0.22, // accelerating 5–12 % punch-in into a cut (5–8 f @30)
  overscaleSettle: 0.4, // new shot starts ×1.3–1.8 and settles (8–14 f @30)
  // ── transitions ─────────────────────────────────────────────────────────────
  carouselSlide: 0.23, // photo carousel slide (7 f @30) …
  carouselDwell: 0.43, // … then dwell (13 f @30): one card every 20 f
  pageCurl: 0.37, // page curl (11 f @30)
  focusReticle: 0.63, // focus-reticle transition (19 f @30)
  shortDissolve: 0.17, // rare 3–8 f dissolves (paper desk only)
  zoomThroughOut: 0.3, // accelerating half before the cut
  zoomThroughIn: 0.45, // decelerating half after the cut
  flashShrink: 0.1, // 2–3 frames of scale .98 + brighten before a cut
  exposureSettle: 0.25, // footage head brightness ramp (6–10 f @30)
  radialZoomOut: 0.25, // powers-of-ten: outgoing half (6 f @24)
  radialZoomIn: 0.33, // incoming half (8 f @24)
  fadeThroughBlack: 0.42, // exposure ×0.5 per drawing (10 f @24)
  lightsUp: 1.5, // stage lights ramp (36 f @24)
  lightning: 0.75, // bolt + double strike (18 f @24)
  fadeToBlack: 1.6, // final fade, linear (48 f @30) …
  endBlack: 0.8, // … followed by pure black (24 f @30)
  // ── pacing ──────────────────────────────────────────────────────────────────
  beat: 1.0, // median interval between visual beats inside a shot (Vox)
  holdAfterBeat: 0.8, // a beat lands, then holds 0.6–1.7 s
  shotPaperDesk: 1.3, // median shot length (Porsche)
  shotCollage: 1.6, // median (Dracula)
  shotExplainer: 2.8, // median (Vox)
} as const;

/** Rates in units per second. */
export const RATE = {
  drawings: 12, // graphics drawings per second (all styles)
  holdBoil: 6, // paper-desk grain/jitter re-roll during holds
  titleBoil: 4, // dark-collage title glyph boil (every 6 f @24)
  typewriterCps: 41, // paper-desk quote typewriter (chars/s)
  handwritingCps: 12, // Vox marker write-on (≈1 char per drawing)
  typeOnCps: 9, // dark-collage irregular type-on
  subtitleRevealPxPerSec: 1080, // paper-desk subtitle L→R reveal (36 px/f @30)
  captionGridFrames: 3, // Earworm karaoke captions step on a 3-frame text grid (@25)
} as const;
