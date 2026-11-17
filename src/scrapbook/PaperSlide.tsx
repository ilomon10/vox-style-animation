import React from "react";
import { AbsoluteFill } from "remotion";
import { SfxList } from "../earworm/fx/sfx";
import { useDrawingFrame } from "../lib/time";
import { lerp, tween } from "./kit";

/** measured frames (vox_braintravel M1): in 8–10 f (ease-out), out 10–13 f (accelerating) */
export const PAPER_SLIDE = { inFrames: 10, outFrames: 12 } as const;
export type PaperSlideCorner = "tl" | "tr" | "bl" | "br";

const OFF: Record<PaperSlideCorner, [number, number]> = { tl: [-1500, -1000], tr: [1500, -1000], bl: [-1500, 1000], br: [1500, 1000] };

/**
 * Transition "paper-sheet slide" (vox_braintravel M1). Window: from the cut (pre 0) for `frames`.
 * - "in": the incoming scene arrives on its own sheet from a corner, rotating −25° → 0 with an ease-out (new-ground
 *   coverage 3 → 43 → 74 → 85 % per drawing, measured) over the outgoing scene, which keeps playing underneath.
 * - "out": the outgoing scene's sheet leaves towards a top corner, rotating +12° and accelerating, revealing the incoming
 *   scene underneath.
 * Both move on twos. SFX: a paper swoosh whose peak lands 2 f after the sheet starts moving (measured +2…+6 f).
 */
export const PaperSlide: React.FC<{ variant?: "in" | "out"; corner?: PaperSlideCorner; outgoing: React.ReactNode; incoming: React.ReactNode; sfx?: boolean }> = ({
  variant = "in", corner, outgoing, incoming, sfx = true,
}) => {
  const f = useDrawingFrame();
  const shadow = "drop-shadow(-6px 10px 18px rgba(0,0,0,0.35))";
  if (variant === "in") {
    const c = corner ?? "bl";
    const t = tween(f, 0, PAPER_SLIDE.inFrames, "enter");
    const [dx, dy] = OFF[c];
    return (
      <AbsoluteFill>
        <AbsoluteFill>{outgoing}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translate(${dx * (1 - t)}px, ${dy * (1 - t)}px) rotate(${lerp(c === "bl" || c === "tl" ? -25 : 25, 0, t)}deg)`,
          transformOrigin: "50% 50%", filter: t < 1 ? shadow : undefined }}>{incoming}</AbsoluteFill>
        {sfx && <SfxList items={[{ name: "paper_swoosh", peak: 2 }]} />}
      </AbsoluteFill>
    );
  }
  const c = corner ?? "tr";
  const t = tween(f, 0, PAPER_SLIDE.outFrames, "accelerate");
  const [dx, dy] = OFF[c];
  return (
    <AbsoluteFill>
      <AbsoluteFill>{incoming}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${dx * t}px, ${dy * t}px) rotate(${lerp(0, c === "tr" || c === "br" ? 12 : -12, t)}deg)`,
        transformOrigin: "50% 50%", filter: shadow, opacity: t >= 1 ? 0 : 1 }}>{outgoing}</AbsoluteFill>
      {sfx && <SfxList items={[{ name: "paper_swoosh", peak: 4 }]} />}
    </AbsoluteFill>
  );
};
