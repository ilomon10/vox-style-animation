import React from "react";
import { AbsoluteFill } from "remotion";
import { cueFrame, type CueSpec } from "../../audio/schedule";
import type { CueIndex } from "../../audio/cues";
import { DESIGN_H, DESIGN_W } from "../../lib/stage";
import { useDrawingFrame } from "../../lib/time";
import { keyframes, type EaseSpec, type Key } from "../../motion/keyframes";

/**
 * Multiplane crane (earworm-C s7, segment C montage): ONE camera move (tilt down ~5300 px over ~18 s) through a stack of cut-outs
 * at different depths. Layers move at `speed` x the reference plane (1.5-4x for the near ones), then a dolly-in
 * (`dolly` -> camZ toward the hero) blows the near layers off frame. Drawn on the 12/s grid.
 *
 * Depth model: z = 1 / speed; on-screen factor s = 1 / (z - camZ). Position = centre + (layer - cam) * s, size x s.
 * A layer with z <= camZ is behind the camera and not drawn.
 */
export type MultiplaneLayer = {
  /** content, authored at its own size (w x h design px) */
  node: React.ReactNode;
  w: number;
  h: number;
  /** world position of the layer centre at the reference plane (speed 1), design px */
  x: number;
  y: number;
  /** parallax multiplier: 0.5 far ... 1 reference ... 1.5-4 near */
  speed: number;
  rot?: number;
};

/** Camera key. `y` / `x` = reference-plane point at frame centre; `dolly` = camZ (0 = none, ~0.3 blows 4x layers off). */
export type CraneKey = { at: number; y: number; x?: number; dolly?: number; ease?: EaseSpec };

/** Keys anchored to NARRATION words (camera follows the voice, not the beat): `at` comes from a cue word. */
export type CueCraneKey = Omit<CraneKey, "at"> & Omit<CueSpec, "cues">;
export const craneKeysFromCues = (cues: CueIndex, keys: CueCraneKey[]): CraneKey[] =>
  keys.map(({ y, x, dolly, ease, ...spec }) => ({ at: cueFrame({ cues, ...spec }), y, x, dolly, ease }));

export const sampleCrane = (keys: readonly CraneKey[], frame: number) =>
  keyframes(
    keys.map((k): Key<{ x: number; y: number; z: number }> => ({ at: k.at, ease: k.ease, value: { x: k.x ?? DESIGN_W / 2, y: k.y, z: k.dolly ?? 0 } })),
    frame,
  );

export type MultiplaneProps = {
  layers: MultiplaneLayer[];
  keys: CraneKey[];
  background?: string;
};

export const Multiplane: React.FC<MultiplaneProps> = ({ layers, keys, background = "#0A0A0A" }) => {
  const f = useDrawingFrame();
  const cam = sampleCrane(keys, f);
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {[...layers].sort((a, b) => a.speed - b.speed).map((l, i) => {
        const d = 1 / l.speed - cam.z;
        if (d <= 0.04) return null;
        const s = 1 / d;
        const sx = DESIGN_W / 2 + (l.x - cam.x) * s;
        const sy = DESIGN_H / 2 + (l.y - cam.y) * s;
        if (Math.abs(sx - DESIGN_W / 2) > DESIGN_W / 2 + (l.w * s) / 2 || Math.abs(sy - DESIGN_H / 2) > DESIGN_H / 2 + (l.h * s) / 2) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: sx - l.w / 2, top: sy - l.h / 2, width: l.w, height: l.h,
              transform: `rotate(${l.rot ?? 0}deg) scale(${s})`, transformOrigin: "50% 50%",
            }}
          >
            {l.node}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
