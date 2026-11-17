import { ease } from "../tokens/easing";

/**
 * Shot head/tail effect descriptors. `at(t, n)` is a pure function of `t` = frames @24 since the
 * effect started (head: since the first frame of the shot; tail: since the tail began, `t = n` on
 * the last frame) and returns a partial transform state. `<Shot>` composes, steps and renders them.
 * All frame counts are @24 fps and are converted to the composition fps by the Shot.
 */
export type FxState = { scale: number; x: number; y: number; brightness: number; blur: number };

export type Fx = {
  name: string;
  /** effect length, frames @24 */
  frames: number;
  /** measured "on ones" (otherwise stepped to 12 drawings/s) */
  onOnes?: boolean;
  /** scale origin in design px (default frame centre) */
  origin?: { x: number; y: number };
  /** ghost trail along the per-step x/y displacement */
  trail?: boolean;
  /** radial blur strength = radial × |Δ ln scale| per step */
  radial?: number;
  at: (t: number, n: number) => Partial<FxState>;
};

type Common = { origin?: { x: number; y: number } };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const prog = (t: number, n: number) => clamp01(t / n);
/** scale that goes from `s0` (p = 0) to 1 (p = 1) in log space along `e` */
const logTo1 = (s0: number, e: number) => Math.exp(Math.log(s0) * (1 - e));

/** Accelerating half of a zoom-through, ON ONES. Per-frame multiplier grows geometrically
 *  1.0006 → 1.023 (analysis/porsche-part3-stills.md §8 T1; epigenetics §8), ≈8–12 f. */
export const zoomThroughOut = (o: Common & { frames?: number; from?: number; to?: number; brighten?: number } = {}): Fx => {
  const { frames = 10, from = 1.0006, to = 1.023, brighten = 0 } = o;
  return {
    name: "zoomThroughOut",
    frames,
    onOnes: true,
    origin: o.origin,
    at: (t, n) => {
      let s = 1;
      for (let j = 0; j < Math.floor(t); j++) s *= from * Math.pow(to / from, j / Math.max(1, n - 1));
      return { scale: s, brightness: 1 + brighten * prog(t, n) };
    },
  };
};

/** Decelerating half: starts ≈×1.29 per drawing, expo-out over 12–34 f (porsche T1/T2; epigenetics §8).
 *  `from` = 1.57 reproduces the 1.29 first step with the `enter` curve over 24 f. */
export const zoomThroughIn = (o: Common & { frames?: number; from?: number } = {}): Fx => {
  const { frames = 24, from = 1.57 } = o;
  return { name: "zoomThroughIn", frames, origin: o.origin, at: (t, n) => ({ scale: logTo1(from, ease("enter")(prog(t, n))) }) };
};

/** Last 2–3 f before a cut: scale .975 + paper-wash brighten +10 % (porsche T3 flash-shrink). */
export const flashShrinkOut = (o: { frames?: number; scale?: number; wash?: number } = {}): Fx => {
  const { frames = 3, scale = 0.975, wash = 0.1 } = o;
  return { name: "flashShrinkOut", frames, onOnes: true, at: () => ({ scale, brightness: 1 + wash }) };
};

/** Footage head: brightness 0.75 → 1 over ≈7 f, ON ONES, linear (porsche T3 exposure settle). */
export const exposureIn = (o: { frames?: number; from?: number } = {}): Fx => {
  const { frames = 7, from = 0.75 } = o;
  return { name: "exposureIn", frames, onOnes: true, at: (t, n) => ({ brightness: from + (1 - from) * prog(t, n) }) };
};

/** Photo-card slideshow: scale continues across the cut. In: 0.865–1.165 → 1 over 8–12 f ease-out
 *  (porsche T5 scale-momentum chain). `from < 1` for the shrinking variant. */
export const scaleMomentumIn = (o: Common & { frames?: number; from?: number } = {}): Fx => {
  const { frames = 10, from = 1.165 } = o;
  return { name: "scaleMomentumIn", frames, origin: o.origin, at: (t, n) => ({ scale: logTo1(from, ease("enter")(prog(t, n))) }) };
};

/** Out: ease-in so the LAST drawing steps ±`perDrawing` (4–8 %). `direction` 1 = grows, −1 = shrinks. */
export const scaleMomentumOut = (o: Common & { frames?: number; perDrawing?: number; direction?: 1 | -1 } = {}): Fx => {
  const { frames = 8, perDrawing = 0.06, direction = 1 } = o;
  const e = ease("exit");
  const k = Math.log(1 + perDrawing) / (1 - e(Math.max(0, (frames - 2) / frames)));
  return { name: "scaleMomentumOut", frames, origin: o.origin, at: (t, n) => ({ scale: Math.exp(direction * k * e(prog(t, n))) }) };
};

/** Horizontal whip with motion trail, `whip` ease (porsche T6 whip). direction −1 leaves to the left. */
export const whipOut = (o: { frames?: number; distance?: number; direction?: 1 | -1 } = {}): Fx => {
  const { frames = 8, distance = 1920, direction = -1 } = o;
  return { name: "whipOut", frames, trail: true, at: (t, n) => ({ x: direction * distance * ease("whip")(prog(t, n)) }) };
};
/** Arrives from the side the previous shot left to (same `direction`), time-mirrored whip ease. */
export const whipIn = (o: { frames?: number; distance?: number; direction?: 1 | -1 } = {}): Fx => {
  const { frames = 8, distance = 1920, direction = -1 } = o;
  return { name: "whipIn", frames, trail: true, at: (t, n) => ({ x: -direction * distance * ease("whip")(1 - prog(t, n)) }) };
};

/** Powers-of-ten out: scale 1 → ≈0.1 in ≈6 f with radial blur (epigenetics §8). */
export const radialZoomOut = (o: Common & { frames?: number; to?: number } = {}): Fx => {
  const { frames = 6, to = 0.1 } = o;
  return {
    name: "radialZoomOut",
    frames,
    radial: 0.6,
    origin: o.origin,
    at: (t, n) => ({ scale: Math.exp(Math.log(to) * ease("accelerate")(prog(t, n))) }),
  };
};
/** Powers-of-ten in: ≈5 → 1 in ≈8 f expo-out with radial blur (epigenetics §8). */
export const radialZoomIn = (o: Common & { frames?: number; from?: number } = {}): Fx => {
  const { frames = 8, from = 5 } = o;
  return {
    name: "radialZoomIn",
    frames,
    radial: 0.6,
    origin: o.origin,
    at: (t, n) => ({ scale: logTo1(from, ease("enter")(prog(t, n))) }),
  };
};

/** Exposure ×0.5 per drawing down to black (dracula §8 fade-through-black, 10 f @24); last drawing = black. */
export const fadeThroughBlack = (o: { frames?: number } = {}): Fx => {
  const { frames = 10 } = o;
  return {
    name: "fadeThroughBlack",
    frames,
    at: (t, n) => ({ brightness: t >= n ? 0 : Math.pow(0.5, Math.floor(t / 2) + 1) }),
  };
};
/** Mirror of fadeThroughBlack for a shot head (×2 per drawing up from black). */
export const fadeThroughBlackIn = (o: { frames?: number } = {}): Fx => {
  const { frames = 10 } = o;
  return { name: "fadeThroughBlackIn", frames, at: (t, n) => ({ brightness: t >= n ? 1 : Math.pow(0.5, Math.floor((n - t) / 2)) }) };
};

/** Final fade: linear 48 f @30 (1.6 s) then 24 f @30 (0.8 s) pure black, ON ONES (porsche §8 T10). */
export const fadeToBlack = (o: { fadeFrames?: number; blackFrames?: number } = {}): Fx => {
  const { fadeFrames = 38.4, blackFrames = 19.2 } = o;
  return { name: "fadeToBlack", frames: fadeFrames + blackFrames, onOnes: true, at: (t) => ({ brightness: Math.max(0, 1 - t / fadeFrames) }) };
};

/** Crash zoom ×2.79 over 25 f @24 in LOG space, `crash` ease (dracula §8). */
export const crashZoom = (o: Common & { frames?: number; to?: number } = {}): Fx => {
  const { frames = 25, to = 2.79 } = o;
  return { name: "crashZoom", frames, origin: o.origin, at: (t, n) => ({ scale: Math.exp(Math.log(to) * ease("crash")(prog(t, n))) }) };
};

/** Editorial snap zoom ×1.565 over ≈5 f, easeInQuart [.5,0,.75,0] (= `gravity`), no blur (highlight.md §7). */
export const snapZoom = (o: Common & { frames?: number; to?: number } = {}): Fx => {
  const { frames = 5, to = 1.565 } = o;
  return { name: "snapZoom", frames, origin: o.origin, at: (t, n) => ({ scale: 1 + (to - 1) * ease("gravity")(prog(t, n)) }) };
};

/** Rack focus: blur ≈12 → 0 px over ≈5 f with a small push (highlight.md §8). */
export const rackFocusIn = (o: Common & { frames?: number; blur?: number; push?: number } = {}): Fx => {
  const { frames = 5, blur = 12, push = 1.04 } = o;
  return {
    name: "rackFocusIn",
    frames,
    origin: o.origin,
    at: (t, n) => {
      const r = 1 - ease("enter")(prog(t, n));
      return { blur: blur * r, scale: 1 + (push - 1) * r };
    },
  };
};

/** Pull-back ×0.8 over 12 f (epigenetics §7). */
export const pullBack = (o: Common & { frames?: number; to?: number } = {}): Fx => {
  const { frames = 12, to = 0.8 } = o;
  return { name: "pullBack", frames, origin: o.origin, at: (t, n) => ({ scale: 1 + (to - 1) * ease("pushSoft")(prog(t, n)) }) };
};
