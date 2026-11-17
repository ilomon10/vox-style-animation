import React from "react";
import { DESIGN_H, DESIGN_W } from "../../lib/stage";
import { World, bez } from "../earworm/shared";

export { World, bez };
/** camera pose → World: world point (cx, cy) at the frame centre, zoom Z (screen = centre + Z·(world − c)) */
export const Cam: React.FC<{ z: number; cx?: number; cy?: number; blur?: number; children: React.ReactNode }> = ({ z, cx = DESIGN_W / 2, cy = DESIGN_H / 2, blur = 0, children }) => (
  <World scale={z} pivot={[DESIGN_W / 2, DESIGN_H / 2]} x={z * (DESIGN_W / 2 - cx)} y={z * (DESIGN_H / 2 - cy)} blur={blur}>{children}</World>
);

/** log-scale interpolation over `keys` [frame, value, optional bezier for the segment arriving at this key] */
export const logKeys = (f: number, keys: [number, number, ((t: number) => number)?][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [f0, v0] = keys[i - 1];
      const [f1, v1, e] = keys[i];
      const t = (f - f0) / (f1 - f0);
      return Math.exp(Math.log(v0) + (Math.log(v1) - Math.log(v0)) * (e ? e(t) : t));
    }
  }
  return keys[keys.length - 1][1];
};
export const drawings12 = (f: number) => Math.floor((f * 12) / 25 + 1e-9);
