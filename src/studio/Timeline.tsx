import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  BLUR_CUT, BlurThroughCut, DIP, DROP, DipToBlack, Drop, GLITCH, GlitchCut, SPIN, SpinSwap,
} from "../earworm/fx";
import { DESIGN_LANDSCAPE, DESIGN_PORTRAIT, DesignSizeProvider } from "../lib/stage";
import { RECIPES, RecipeCtxProvider, type RecipeCtx } from "../recipes";
import { warnOnce } from "../recipes/shared";
import type { CueIndex } from "../audio";
import type { ResolvedScene } from "./resolve";

/** one scene at local time 0 = its start frame. `short` (storyboard format "short"): portrait recipes get the 1080×1920 design
 *  space, landscape recipes 1920×1080 (DesignSpace letterboxes them as a centred band; RecipeFrame grounds the whole frame). */
export const SceneView: React.FC<{ scene: ResolvedScene; cues: CueIndex; fps: number; missing: ReadonlySet<string>; short?: boolean }> = ({ scene, cues, fps, missing, short }) => {
  const ctx: RecipeCtx = { fps, dur: scene.dur, events: scene.events, cues, sceneStart: scene.start, missing, seed: scene.seed };
  const r = RECIPES[scene.recipe];
  if (!r) {
    warnOnce(`unknown recipe "${scene.recipe}" in scene ${scene.id}`);
    return <AbsoluteFill style={{ background: "#0A0A0A" }} />;
  }
  const C = r.component;
  const body = <RecipeCtxProvider value={ctx}><C {...scene.props} ctx={ctx} /></RecipeCtxProvider>;
  if (!short) return body;
  return <DesignSizeProvider value={r.layout === "portrait" ? DESIGN_PORTRAIT : DESIGN_LANDSCAPE}>{body}</DesignSizeProvider>;
};

/** frames of picture before / after the cut that a transition's component owns (from the kit's measured plans) */
export const transitionSpan = (s: ResolvedScene): { pre: number; post: number } | null => {
  const t = s.transitionIn;
  if (!t || t.kind === "cut") return null;
  switch (t.kind) {
    case "blurThrough": return { pre: BLUR_CUT.blurFrames, post: BLUR_CUT.settleFrames };
    case "spinSwap": return { pre: SPIN.outFrames, post: SPIN.inFrames };
    case "dip": { const v = DIP[t.variant ?? "act"]; return { pre: v.out + v.black, post: v.in }; }
    case "drop": return { pre: DROP.out + DROP.black, post: DROP.in };
    case "glitchCut": return { pre: GLITCH.dip + GLITCH.blur, post: 1 + GLITCH.build };
  }
};

/** Scenes cut on their start frames; sound-locked transitions are wrapped around the cut (doc 07/11/12) in a window of
 *  `pre + post` frames that renders BOTH scenes time-shifted so each keeps its own local clock. */
export const Timeline: React.FC<{ scenes: ResolvedScene[]; cues: CueIndex; fps: number; missing: ReadonlySet<string>; end: number; short?: boolean }> = ({ scenes, cues, fps, missing, end, short }) => {
  const view = (s: ResolvedScene, winStart: number) => (
    <Sequence from={s.start - winStart} layout="none" name={s.id}><SceneView scene={s} cues={cues} fps={fps} missing={missing} short={short} /></Sequence>
  );
  return (
    <>
      {scenes.map((s, i) => {
        const span = transitionSpan(s);
        const next = scenes[i + 1];
        const nextSpan = next ? transitionSpan(next) : null;
        const a = s.start + (span ? span.post : 0);
        const b = Math.min(s.end, next ? next.start - (nextSpan?.pre ?? 0) : end);
        if (b <= a) return null;
        return (
          <Sequence key={s.id} from={a} durationInFrames={b - a} name={`${s.id} (${s.recipe})`}>
            <Sequence from={s.start - a} layout="none"><SceneView scene={s} cues={cues} fps={fps} missing={missing} short={short} /></Sequence>
          </Sequence>
        );
      })}
      {scenes.map((s, i) => {
        const span = transitionSpan(s);
        const prev = scenes[i - 1];
        const t = s.transitionIn;
        if (!span || !prev || !t) return null;
        const win = s.start - span.pre;
        const sfx = t.sfx !== false;
        const outgoing = view(prev, win);
        const incoming = view(s, win);
        let body: React.ReactNode;
        switch (t.kind) {
          case "blurThrough": body = <BlurThroughCut at={span.pre} outgoing={outgoing} incoming={incoming} sfx={sfx} />; break;
          case "spinSwap": body = <SpinSwap at={span.pre} outgoing={outgoing} incoming={incoming} sfx={sfx} />; break;
          case "dip": body = <DipToBlack at={0} variant={t.variant ?? "act"} outgoing={outgoing} incoming={incoming} sfx={sfx} />; break;
          case "drop": body = <Drop at={0} outgoing={outgoing} incoming={incoming} sfx={sfx} />; break;
          default: body = <GlitchCut at={0} outgoing={outgoing} card={() => incoming} sfx={sfx} />;
        }
        return (
          <Sequence key={`t-${s.id}`} from={win} durationInFrames={Math.min(span.pre + span.post, Math.max(1, end - win))} name={`${t.kind} into ${s.id}`}>
            {body}
          </Sequence>
        );
      })}
    </>
  );
};
