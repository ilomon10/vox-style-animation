import React from "react";
import { Img, staticFile } from "remotion";
import { StationLabel, XMark } from "../earworm";
import { MapRoute as KitMapRoute } from "../explainer";
import { voxEarworm } from "../tokens/colors";
import { Placeholder, RecipeFrame, ev, evUntil, isMissing, warnOnce, type RecipeProps } from "./shared";

export type MapRouteProps = {
  /** map image, darkened to the Earworm plate */
  map?: string;
  waypoints: { x: number; y: number }[];
  /** station-style label at the last waypoint */
  label?: { title: string; sub: string };
  /** crop of the map image (design px offset / width) */
  mapBox?: { x: number; y: number; w: number };
};

/** Recipe "map route": a periwinkle route draws itself over a dark map, pins pop at the waypoints, a station label + X mark confirm the end. Events: `route` (start, default 6; `until` = end), `label`. */
export const MapRouteScene: React.FC<RecipeProps<MapRouteProps>> = ({ ctx, map, waypoints, label, mapBox = { x: -700, y: -500, w: 3000 } }) => {
  const miss = isMissing(ctx, map);
  if (miss) warnOnce(`asset missing: ${map ?? "(no map)"} — placeholder drawn`);
  const start = ev(ctx, "route", 6);
  const end = evUntil(ctx, "route", ctx.dur - 20) ?? ctx.dur - 20;
  const last = waypoints[waypoints.length - 1];
  return (
    <RecipeFrame seed={ctx.seed}>
      <div style={{ position: "absolute", left: 130, top: 90, width: 1660, height: 900, overflow: "hidden", borderRadius: 8, background: "#222" }}>
        {miss ? <Placeholder label={map ?? "map"} w={1660} h={900} /> : (
          <Img src={staticFile(map!)} style={{ position: "absolute", left: mapBox.x, top: mapBox.y, width: mapBox.w, filter: "grayscale(1) contrast(1.4) brightness(0.5)" }} />
        )}
      </div>
      <KitMapRoute waypoints={waypoints} style={{ color: voxEarworm.accent, width: 8, pin: voxEarworm.accent, pinRing: voxEarworm.tornWhite }} delay={start} duration={Math.max(12, end - start)} pins seed={`${ctx.seed}-r`} />
      {last && <XMark x={last.x} y={last.y} size={120} delay={end} duration={12} seed={`${ctx.seed}-x`} />}
      {label && last && (() => {
        // keep the label inside the frame: estimate its width (Oswald 700 at the label role ≈ 0.48 em/char,
        // font-size = cap / 0.81) and flip it to the LEFT of the last pin when it would overflow the right edge
        const fontPx = 94 / 0.81;
        const w = Math.max(label.title.length * fontPx * 0.5, label.sub.length * 26) + 36;
        const right = last.x + 90;
        const x = right + w <= 1840 ? right : Math.max(80, last.x - 90 - w);
        return <StationLabel title={label.title} sub={label.sub} x={x} y={Math.max(last.y - 140, 120)} delay={ev(ctx, "label", end + 4)} seed={`${ctx.seed}-l`} />;
      })()}
    </RecipeFrame>
  );
};
