import { rand } from "../lib/random";

/** Geometry helpers for hand-drawn strokes. All coordinates are 1920×1080 design px. */
export type Pt = { x: number; y: number };

/** 1-D value noise (cosine-interpolated), range [-1, 1], deterministic per seed. */
export const smoothNoise = (seed: string, x: number): number => {
  const i = Math.floor(x);
  const t = x - i;
  const a = rand(`${seed}-${i}`) * 2 - 1;
  const b = rand(`${seed}-${i + 1}`) * 2 - 1;
  const s = (1 - Math.cos(t * Math.PI)) / 2;
  return a + (b - a) * s;
};

/** Densify control points with a Catmull-Rom spline (open). */
export const catmull = (pts: Pt[], perSeg = 10): Pt[] => {
  if (pts.length < 3) return pts.slice();
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < perSeg; k++) {
      const t = k / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

export const pointsToD = (pts: Pt[]): string =>
  pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");

export const cumLengths = (pts: Pt[]): number[] => {
  const c = [0];
  for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return c;
};
export const polyLen = (pts: Pt[]) => cumLengths(pts)[pts.length - 1] ?? 0;

/** Point (and heading in radians) at fraction t of the polyline length. */
export const pointAt = (pts: Pt[], t: number): Pt & { angle: number } => {
  const c = cumLengths(pts);
  const target = Math.max(0, Math.min(1, t)) * c[c.length - 1];
  let i = 1;
  while (i < pts.length - 1 && c[i] < target) i++;
  const a = pts[i - 1];
  const b = pts[i];
  const seg = c[i] - c[i - 1] || 1;
  const u = (target - c[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, angle: Math.atan2(b.y - a.y, b.x - a.x) };
};

/** Prefix of the polyline up to fraction t (end point interpolated). */
export const sliceTo = (pts: Pt[], t: number): Pt[] => {
  const c = cumLengths(pts);
  const target = Math.max(0, Math.min(1, t)) * c[c.length - 1];
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (c[i] <= target) out.push(pts[i]);
    else {
      const u = (target - c[i - 1]) / (c[i] - c[i - 1] || 1);
      out.push({ x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * u, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * u });
      break;
    }
  }
  return out;
};

/** Sub-range [a, b] of the polyline (fractions of length). */
export const sliceRange = (pts: Pt[], a: number, b: number): Pt[] => {
  const head = sliceTo(pts, b);
  const c = cumLengths(head);
  const total = polyLen(pts);
  const start = a * total;
  const out: Pt[] = [];
  for (let i = 0; i < head.length; i++) {
    if (c[i] >= start) {
      if (!out.length && i > 0) {
        const u = (start - c[i - 1]) / (c[i] - c[i - 1] || 1);
        out.push({ x: head[i - 1].x + (head[i].x - head[i - 1].x) * u, y: head[i - 1].y + (head[i].y - head[i - 1].y) * u });
      }
      out.push(head[i]);
    }
  }
  return out;
};

const normalAt = (pts: Pt[], i: number): Pt => {
  const a = pts[Math.max(0, i - 1)];
  const b = pts[Math.min(pts.length - 1, i + 1)];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l = Math.hypot(dx, dy) || 1;
  return { x: -dy / l, y: dx / l };
};

/** Offset a polyline along its normal. `off` is px, or a function of fraction t. */
export const offsetPoints = (pts: Pt[], off: number | ((t: number) => number)): Pt[] =>
  pts.map((p, i) => {
    const n = normalAt(pts, i);
    const o = typeof off === "number" ? off : off(i / Math.max(1, pts.length - 1));
    return { x: p.x + n.x * o, y: p.y + n.y * o };
  });

/** Low-frequency wobble along the normal (hand tremor), amplitude in px. */
export const roughen = (pts: Pt[], amp: number, seed: string, wavelengthPx = 60): Pt[] => {
  if (amp <= 0) return pts;
  const c = cumLengths(pts);
  return pts.map((p, i) => {
    const n = normalAt(pts, i);
    const o = smoothNoise(seed, c[i] / wavelengthPx) * amp;
    return { x: p.x + n.x * o, y: p.y + n.y * o };
  });
};

export type LoopOpts = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** number of turns (1.4 = 1 loop + 40 %) */
  turns?: number;
  /** start angle in degrees (0 = right, clockwise on screen) */
  startDeg?: number;
  /** radius growth per turn, px (spiral spacing between loops) */
  growth?: number;
  /** ± radius jitter as a fraction of the radius */
  jitterPct?: number;
  /** tilt of the ellipse in degrees */
  tiltDeg?: number;
  seed: string;
  /** counter-clockwise */
  ccw?: boolean;
};

/** Hand-drawn ellipse / spiral loop as a dense polyline. */
export const ellipseLoop = (o: LoopOpts): Pt[] => {
  const { cx, cy, rx, ry, turns = 1, startDeg = -90, growth = 0, jitterPct = 0.03, tiltDeg = 0, seed, ccw } = o;
  const n = Math.max(24, Math.round(72 * turns));
  const tilt = (tiltDeg * Math.PI) / 180;
  const dir = ccw ? -1 : 1;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const th = (startDeg * Math.PI) / 180 + dir * t * turns * Math.PI * 2;
    const g = growth * turns * t;
    const j = 1 + smoothNoise(seed, t * turns * 6) * jitterPct;
    const x = (rx + g) * j * Math.cos(th);
    const y = (ry + g) * j * Math.sin(th);
    pts.push({ x: cx + x * Math.cos(tilt) - y * Math.sin(tilt), y: cy + x * Math.sin(tilt) + y * Math.cos(tilt) });
  }
  return pts;
};

/** Slightly bowed, wobbling line from a to b. */
export const wobblyLine = (a: Pt, b: Pt, seed: string, amp = 3, bow = 0.01): Pt[] => {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const n = Math.max(6, Math.round(len / 12));
  const nx = -(b.y - a.y) / (len || 1);
  const ny = (b.x - a.x) / (len || 1);
  const bowAmt = len * bow * (rand(`${seed}-bow`) * 2 - 1);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const o = Math.sin(t * Math.PI) * bowAmt + smoothNoise(seed, t * len / 70) * amp * Math.sin(Math.min(1, t * 6) * Math.PI / 2);
    pts.push({ x: a.x + (b.x - a.x) * t + nx * o, y: a.y + (b.y - a.y) * t + ny * o });
  }
  return pts;
};
