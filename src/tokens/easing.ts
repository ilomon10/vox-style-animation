import { Easing } from "remotion";

/**
 * Easing tokens fitted to measured position curves (cubic-bezier x1,y1,x2,y2).
 * Source shot/frames for every curve are listed in docs/style-guide/06-motion-language.md.
 * The house style has almost NO overshoot: entrances are exponential ease-outs, exits are
 * ease-in, camera pushes are strong ease-in-out with a long decelerating tail.
 */
export const CURVES = {
  /** default entrance: drop / rise / slide / title rise. 90 % of travel in ~1/3 of the time. */
  enter: [0.16, 1, 0.3, 1],
  /** heavy props, big pieces of scenery */
  enterBig: [0.22, 1, 0.36, 1],
  /** leaving the frame: fall-out, slide-out (ease-in cubic) */
  exit: [0.32, 0, 0.67, 0],
  /** gravity drop with a hard landing (no bounce) */
  gravity: [0.5, 0, 0.75, 0],
  /** camera push-in to the focal word (Vox, 32 f @24) */
  push: [0.5, 0, 0, 1],
  /** softer push / tilt */
  pushSoft: [0.6, 0, 0.1, 1],
  /** vertical tilt to reveal the next line */
  tilt: [0.5, 0, 0.2, 1],
  /** camera that is already moving when the shot starts, decelerating (post-cut settle) */
  settle: [0, 0.8, 0.15, 1],
  /** accelerating push INTO a cut (first half of a zoom-through) */
  accelerate: [0.6, 0, 1, 1],
  /** whip-pan across a photo wall */
  whip: [0.45, 0, 0.4, 0.95],
  /** crash zoom — apply to log(scale), not scale */
  crash: [0.6, 0.6, 0.4, 1],
  /** long cut-out slide-in (quote card figure) */
  slide: [0.45, 0.35, 0.3, 0.95],
  /** paper-desk highlighter BOX wipe that reveals the title (crawl, burst, long tail) */
  boxWipe: [0.75, 0.4, 0.05, 0.9],
  /** shorter highlight wipe on a figure */
  highlightWipe: [0.7, 0.3, 0.2, 0.8],
  /** Vox highlighter swipe over printed text (multiply) */
  highlighter: [0.3, 0, 0.5, 1],
  /** bar growth, value counters */
  grow: [0.33, 1, 0.68, 1],
  /** caption / text opacity fade-in (ease-out quad) */
  fadeIn: [0.5, 1, 0.89, 1],
  /** fog / smoke clearing (ease-in quad) */
  fogClear: [0.11, 0, 0.5, 0],
  /** inset circle pop with ~1.6 % overshoot */
  pop: [0.45, 0.2, 0.4, 1.1],
  /** leader line drawing out of a pin / disc */
  leader: [0.15, -0.2, 0.15, 0.8],
  /** paper-desk callout disc growing from its centre (strong in-out) */
  discGrow: [1, 0.39, 0.2, 0.94],
  /** callout label box opening from the leader end */
  labelWipe: [0.42, 0, 0.58, 1],
  /** paper-desk photo carousel slide (7 f slide, 13 f dwell) */
  carousel: [0.51, 0.21, 0.19, 0.87],
  /** accelerating punch-in just before a cut (easeInQuart) */
  punchIn: [0.5, 0, 0.75, 0],
  /** shot starting 1.3–1.8× too large and settling (paper desk post-cut settle) */
  overscaleSettle: [0.6, 0.07, 0.33, 1.01],
  /** ▶ bullet rise / rotate */
  bulletRise: [0.68, 0.34, 0.59, 1],
  bulletTurn: [0.28, 0.08, 0.26, 0.91],
  /** flag-label unfurl: fast scale, slow uncurl */
  unfurl: [0.15, 1, 0.45, 0.9],
  /** dot / marker pop (expo-out) */
  dotPop: [0, 0.4, 0, 0.9],
  /** dry-brush stroke wipe */
  brush: [0.5, 0, 0.1, 1],
  linear: [0, 0, 1, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type CurveName = keyof typeof CURVES;

const cache = new Map<string, (t: number) => number>();
/** Remotion easing function for a token: interpolate(f, [a, b], [0, 1], { easing: ease("enter") }) */
export const ease = (name: CurveName): ((t: number) => number) => {
  let fn = cache.get(name);
  if (!fn) {
    const [a, b, c, d] = CURVES[name];
    fn = name === "linear" ? Easing.linear : Easing.bezier(a, b, c, d);
    cache.set(name, fn);
  }
  return fn;
};

/** CSS string for a token, e.g. for documentation or CSS transitions in previews. */
export const cssBezier = (name: CurveName) => `cubic-bezier(${CURVES[name].join(", ")})`;
