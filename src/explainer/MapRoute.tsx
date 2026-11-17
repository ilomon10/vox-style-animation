import React from "react";
import { darkCollage, paperDesk } from "../tokens/colors";
import { ease } from "../tokens/easing";
import { useFrames, useDrawingFrame } from "../lib/time";
import { DrawPath, Layer, useProgress } from "./DrawPath";
import { type Pt, catmull, cumLengths, pointAt, polyLen, roughen } from "./geometry";

export type RouteStyle = { color: string; width: number; pin: string; pinRing: string; blend?: React.CSSProperties["mixBlendMode"] };

/** Style presets: dark collage maroon ≈8 px (analysis/dracula.md §7.2); paper desk yellow route with ink pins. */
export const ROUTE_STYLES = {
  darkCollage: { color: darkCollage.routeMaroon, width: 8, pin: darkCollage.routeMaroon, pinRing: darkCollage.grey5 },
  paperDesk: { color: paperDesk.highlight, width: 12, pin: paperDesk.charcoal, pinRing: paperDesk.paper, blend: "multiply" },
} satisfies Record<string, RouteStyle>;

export type PinRenderCtx = { x: number; y: number; scale: number; index: number; color: string };
export type HeadCtx = { x: number; y: number; angle: number; progress: number };

export type MapRouteProps = {
  /** waypoints; the route is a smooth curve through them */
  waypoints: Pt[];
  preset?: keyof typeof ROUTE_STYLES;
  style?: Partial<RouteStyle>;
  delay?: number;
  /** frames for the whole route */
  duration?: number;
  /** show a pin at each waypoint (pops in ≤2 f when the line head arrives); index 0 pops at start */
  pins?: boolean;
  /** swap the pin (e.g. collage PushPin). Rendered centred on the waypoint inside an absolutely positioned box. */
  renderPin?: (c: PinRenderCtx) => React.ReactNode;
  /** trim mode: render a leader object (hand, arm, car) at the line head */
  renderHead?: (h: HeadCtx) => React.ReactNode;
  easing?: (t: number) => number;
  roughness?: number;
  /** map image / content under the route */
  children?: React.ReactNode;
  seed?: string;
};

const DefaultPin: React.FC<PinRenderCtx & { ring: string }> = ({ color, ring }) => (
  <svg width={44} height={44} viewBox="-22 -22 44 44" style={{ overflow: "visible" }}>
    <circle r={13} fill={ring} />
    <circle r={10} fill={color} />
  </svg>
);

/**
 * Route that draws itself over a map (children), pins popping at waypoints, optional head render prop.
 */
/** smallest t in [0,1] with fn(t) >= y (fn monotone) */
const invert = (fn: (t: number) => number, y: number) => {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (fn(mid) < y) lo = mid;
    else hi = mid;
  }
  return hi;
};

export const MapRoute: React.FC<MapRouteProps> = ({
  waypoints, preset = "darkCollage", style, delay = 0, duration = 60, pins = true, renderPin, renderHead, easing, roughness = 3, children, seed = "route",
}) => {
  const st = { ...ROUTE_STYLES[preset], ...style };
  const fr = useFrames();
  const f = useDrawingFrame();
  const dense = roughen(catmull(waypoints, 16), roughness, seed, 80);
  const ease_ = easing ?? ease("push");
  const p = useProgress(delay, duration, ease_);
  // fraction of the dense line at which each waypoint sits
  const cl = cumLengths(dense);
  const total = polyLen(dense);
  const frac = waypoints.map((w) => {
    let best = 0;
    let bd = Infinity;
    dense.forEach((q, i) => {
      const d = Math.hypot(q.x - w.x, q.y - w.y);
      if (d < bd) { bd = d; best = i; }
    });
    return cl[best] / total;
  });
  const head = pointAt(dense, p);
  return (
    <>
      {children}
      <Layer blend={st.blend}>
        <DrawPath paths={[dense]} progress={p} color={st.color} width={st.width} taper={{ start: 20, end: 0.001, tip: 0.6 }} />
      </Layer>
      {pins &&
        waypoints.map((w, i) => {
          // pins pop in ≤2 f (0.6 → 1) on the drawing when the line head arrives
          const arrive = delay + invert(ease_, frac[i]) * duration;
          const age = f - arrive;
          if (age < -1e-6) return null;
          const scale = age >= fr(2) - 1e-6 ? 1 : 0.6;
          const ctx: PinRenderCtx = { x: w.x, y: w.y, scale, index: i, color: st.pin };
          return (
            <div key={i} style={{ position: "absolute", left: w.x, top: w.y, width: 0, height: 0, transform: `scale(${scale})` }}>
              <div style={{ position: "absolute", left: -22, top: -22 }}>{renderPin ? renderPin(ctx) : <DefaultPin {...ctx} ring={st.pinRing} />}</div>
            </div>
          );
        })}
      {renderHead && p > 0 && (
        <div style={{ position: "absolute", left: head.x, top: head.y, width: 0, height: 0 }}>{renderHead({ x: head.x, y: head.y, angle: head.angle, progress: p })}</div>
      )}
    </>
  );
};
