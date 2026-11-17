import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { dbToGain } from "../../audio/defaults";
import { SfxList, dbRamp, type SfxPlacement } from "./sfx";
import { clamp01 } from "./util";

/**
 * Picture-and-sound black bridges, all on ones (fades are measured on ones, analysis/earworm-C/D s7).
 *  - DipToBlack "act":     out 18 / black 17 / in 36 (earworm-D f2997-3067). Thump on the first black frame, audio to digital
 *                          silence, picture AND voice restart on the same frame. Use at most once per film.
 *  - DipToBlack "chapter": out 5 / black 9 / in 8 (earworm-B f1328-1349). Audio ramps (4 f) to silence and back (8 f).
 *  - Drop:                 out 27 / black 13 / in 17 (earworm-C f1898-1953). Starts on the payoff word. Old audio <= -47 dB
 *                          7 f after black, then 6 f of silence; new music + fade-up start on the same frame as the fade-in;
 *                          narration returns 14 f later.
 */
export type BridgePlan = {
  /** first frame of the fade-out */
  start: number;
  out: number;
  black: number;
  in: number;
  /** first fully black frame (thump lands here) */
  black0: number;
  /** first frame of the incoming picture (+ audio restart) */
  restart: number;
  end: number;
  sfx: SfxPlacement[];
};

const mk = (start: number, out: number, black: number, inn: number, sfx: SfxPlacement[] = []): BridgePlan => ({
  start, out, black, in: inn, black0: start + out, restart: start + out + black, end: start + out + black + inn, sfx,
});

export const DIP = {
  act: { out: 18, black: 17, in: 36 },
  chapter: { out: 5, black: 9, in: 8 },
} as const;
export const DROP = { out: 27, black: 13, in: 17, silenceDbAt: 7, silenceFrames: 6, narrationLag: 14 } as const;

export type DipVariant = keyof typeof DIP;

/** `at` = first frame of the fade-out. The thump sits on the first black frame. */
export const dipToBlackPlan = (at: number, variant: DipVariant = "act"): BridgePlan => {
  const v = DIP[variant];
  const p = mk(at, v.out, v.black, v.in);
  p.sfx = [{ name: "black_thump", peak: p.black0 }];
  return p;
};
export const dropPlan = (at: number): BridgePlan => mk(at, DROP.out, DROP.black, DROP.in);

/** Black overlay opacity (1 = black) at `f`: linear out, hold, linear in. */
export const bridgeBlack = (f: number, p: BridgePlan) =>
  f < p.start ? 0 : f < p.black0 ? clamp01((f - p.start) / p.out) : f < p.restart ? 1 : clamp01(1 - (f - p.restart + 1) / p.in);

/** Program-audio gain for a DipToBlack: 4 f ramp down ending 1 f into the black, silence, then back (act: hard; chapter: 8 f). */
export const dipGain = (f: number, p: BridgePlan, variant: DipVariant = "act") => {
  if (f < p.black0 - 3) return 1;
  if (f < p.black0 + 1) return clamp01(1 - (f - (p.black0 - 3)) / 4);
  if (f < p.restart) return 0;
  return variant === "act" ? 1 : clamp01((f - p.restart + 1) / p.in);
};

/** Gains of a Drop: the old music, the new music and the narration (linear, per frame). */
export const dropGains = (f: number, p: BridgePlan) => {
  const silentAt = p.black0 + DROP.silenceDbAt;
  const old = f < p.start ? 1 : f < silentAt ? dbRamp(f, p.start, -6, silentAt, -47) : 0;
  const next = f < p.restart ? 0 : dbRamp(f, p.restart, -40, p.restart + DROP.in, 0);
  const narration = f < p.restart + DROP.narrationLag ? 0 : 1;
  return { old, next, narration };
};

export type BridgeProps = {
  /** first frame of the fade-out, relative to the enclosing Sequence */
  at: number;
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
  /** black colour (default near-black ground) */
  color?: string;
  sfx?: boolean;
};

const Bridge: React.FC<BridgeProps & { plan: BridgePlan }> = ({ plan, outgoing, incoming, color = "#000", sfx = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: color }}>
      {f < plan.black0 && <Sequence from={0} layout="none">{outgoing}</Sequence>}
      {f >= plan.restart && <Sequence from={plan.restart} layout="none">{incoming}</Sequence>}
      <AbsoluteFill style={{ background: color, opacity: bridgeBlack(f, plan) }} />
      {sfx && <SfxList items={plan.sfx} />}
    </AbsoluteFill>
  );
};

export const DipToBlack: React.FC<BridgeProps & { variant?: DipVariant }> = ({ variant = "act", ...p }) => (
  <Bridge {...p} plan={dipToBlackPlan(p.at, variant)} />
);

export const Drop: React.FC<BridgeProps> = (p) => <Bridge {...p} plan={dropPlan(p.at)} />;

/** Program audio that follows a DipToBlack (mount in the same Sequence; frames line up with `at`). */
export const DipAudio: React.FC<{ at: number; variant?: DipVariant; src: string; startFrom?: number; gainDb?: number }> = ({
  at, variant = "act", src, startFrom, gainDb = 0,
}) => {
  const p = dipToBlackPlan(at, variant);
  return <Audio src={staticFile(src)} startFrom={startFrom} volume={(f) => dipGain(f, p, variant) * dbToGain(gainDb)} />;
};

/** Audio of a Drop: old music decays, new music fades up on the fade-in frame, narration returns 14 f later. */
export const DropAudio: React.FC<{ at: number; oldMusic?: string; nextMusic?: string; narration?: string; narrationFrom?: number }> = ({
  at, oldMusic, nextMusic, narration, narrationFrom,
}) => {
  const p = dropPlan(at);
  return (
    <>
      {oldMusic && <Audio src={staticFile(oldMusic)} volume={(f) => dropGains(f, p).old} />}
      {nextMusic && (
        <Sequence from={p.restart} layout="none">
          <Audio src={staticFile(nextMusic)} volume={(f) => dropGains(f + p.restart, p).next} />
        </Sequence>
      )}
      {narration && (
        <Sequence from={p.restart + DROP.narrationLag} layout="none">
          <Audio src={staticFile(narration)} startFrom={narrationFrom} />
        </Sequence>
      )}
    </>
  );
};
