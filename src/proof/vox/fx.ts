import { ease } from "../../tokens/easing";
import type { Fx } from "../../transitions";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const logTo1 = (s0: number, e: number) => Math.exp(Math.log(s0) * (1 - e));

/** V-SRP outgoing half, stepped to drawings: zoom/drawing 1.001 -> 1.070 (cumulative ~x1.25), `accelerate`. (07 V-SRP) */
export const srpOut = (o: { frames?: number; to?: number } = {}): Fx => {
  const { frames = 20, to = 1.3 } = o;
  return { name: "srpOut", frames, at: (t, n) => ({ scale: Math.exp(Math.log(to) * ease("accelerate")(clamp01(t / n))) }) };
};

/** V-SRP incoming half: x1.53 in 34 f, `settle` (60 % in the first drawing), no blur. (07 V-SRP) */
export const srpIn = (o: { frames?: number; from?: number } = {}): Fx => {
  const { frames = 34, from = 1.53 } = o;
  return { name: "srpIn", frames, at: (t, n) => ({ scale: logTo1(from, ease("settle")(clamp01(t / n))) }) };
};
