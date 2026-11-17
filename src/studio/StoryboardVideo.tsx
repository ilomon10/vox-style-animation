import React, { useMemo } from "react";
import { getStaticFiles } from "@remotion/studio";
import { AbsoluteFill, staticFile, type CalculateMetadataFunction } from "remotion";
import { createCueIndex, type Cues } from "../audio";
import { FilmFinish } from "../effects";
import { BandScaleProvider, DESIGN_BAND_SCALE, DESIGN_LANDSCAPE, DESIGN_PORTRAIT, DESIGN_SHORT_H, DESIGN_SHORT_W, DesignSizeProvider } from "../lib/stage";
import { paperDesk } from "../tokens/colors";
import { SMALL_SANS, VOX_SANS } from "../tokens/fonts";
import { StyleProvider } from "../tokens/theme";
import { publicPath, resolveStoryboard, type ResolvedStoryboard } from "./resolve";
import { SafeArea } from "./SafeArea";
import { ShortCaptions } from "./ShortCaptions";
import { StoryAudio } from "./StoryAudio";
import { Timeline } from "./Timeline";
import type { Storyboard } from "./types";

export type { Storyboard } from "./types";
/** Data computed by calculateStoryboardMetadata (never passed by hand). */
export type StoryboardData = { resolved: ResolvedStoryboard; cues: Cues; missing: string[] };
/** Generic renderer for public/projects/<slug>/storyboard.json (publish with tools/studio/publish_project.py <slug>). */
export type StoryboardVideoProps = {
  project: string;
  data?: StoryboardData;
  /** gallery previews (GIFs): drop the finish layers that change every drawing (grain, weave, dust, pulse) so the
   *  preview compresses; the picture, timing and static finish stay as rendered. Never for a delivery render. */
  preview?: boolean;
};
const PREVIEW_FINISH = { grain: null, jitter: null, dust: null, pulse: null } as const;
/** the project the composition opens with: the bundled example when it is published, else any published project, else
 *  none ("" renders a slate that says how to publish one). A project named explicitly (--props) must exist. */
const EXAMPLE = "example-time-zones";
const published = getStaticFiles()
  .map((f) => /^projects\/([^/]+)\/storyboard\.json$/.exec(f.name)?.[1])
  .filter((x): x is string => Boolean(x))
  .sort();
export const defaultStoryboardProps: StoryboardVideoProps = {
  project: published.includes(EXAMPLE) ? EXAMPLE : (published[0] ?? ""),
};

const getJson = async <T,>(path: string): Promise<T> => {
  const r = await fetch(staticFile(path));
  if (!r.ok) throw new Error(`storyboard: cannot load ${path} (${r.status}) — run tools/studio/publish_project.py first`);
  return (await r.json()) as T;
};

/** does a public/-relative asset load? (Range GET aborted after the headers: works on the dev server and the render bundle) */
const exists = async (p: string): Promise<boolean> => {
  try {
    const ctl = new AbortController();
    const r = await fetch(staticFile(p), { signal: ctl.signal, headers: { Range: "bytes=0-0" } });
    ctl.abort();
    return r.ok && !/text\/html/.test(r.headers.get("content-type") ?? "");
  } catch {
    return false;
  }
};

export const calculateStoryboardMetadata: CalculateMetadataFunction<StoryboardVideoProps> = async ({ props }) => {
  if (!props.project) return { durationInFrames: 125, fps: 25, props };
  const base = `projects/${props.project}`;
  const sb = await getJson<Storyboard>(`${base}/storyboard.json`);
  const cues = await getJson<Cues>(`${base}/vo.cues.json`);
  const withCues = (sb.music ?? []).find((m) => m.cues);
  const musicCues = withCues?.cues ? await getJson<Cues>(publicPath(props.project, withCues.cues)) : undefined;
  const resolved = resolveStoryboard(sb, props.project, cues, musicCues);
  const checks = await Promise.all(resolved.assets.map(async (p) => [p, await exists(p)] as const));
  const missing = checks.filter(([, ok]) => !ok).map(([p]) => p);
  for (const p of missing) console.warn(`[storyboard] asset missing: ${p}`);
  // `short` = 9:16 portrait (1080×1920 design canvas; --scale=2 renders 2160×3840)
  const size = resolved.format === "short" ? { width: DESIGN_SHORT_W, height: DESIGN_SHORT_H } : {};
  return { durationInFrames: resolved.durationInFrames, fps: resolved.fps, ...size, props: { ...props, data: { resolved, cues, missing } } };
};

export const StoryboardVideo: React.FC<StoryboardVideoProps> = ({ project, data, preview }) => {
  const idx = useMemo(() => (data ? createCueIndex(data.cues, data.resolved.fps) : null), [data]);
  const missing = useMemo(() => new Set(data?.missing ?? []), [data]);
  if (!project) return <NothingPublished />;
  if (!data || !idx) return <AbsoluteFill style={{ background: "#0A0A0A" }} />;
  const r = data.resolved;
  const short = r.format === "short";
  return (
    <StyleProvider style={r.look}>
      <DesignSizeProvider value={short ? DESIGN_PORTRAIT : DESIGN_LANDSCAPE}>
       <BandScaleProvider value={r.bandScale ?? DESIGN_BAND_SCALE}>
        <FilmFinish overrides={preview ? PREVIEW_FINISH : undefined}>
          <AbsoluteFill style={{ background: "#0A0A0A" }}>
            <Timeline scenes={r.scenes} cues={idx} fps={r.fps} missing={missing} end={r.durationInFrames} short={short} />
          </AbsoluteFill>
        </FilmFinish>
        {r.captions ? <ShortCaptions cues={idx} leadF={r.leadF} fps={r.fps} scenes={r.scenes} pos={r.captions.pos} replace={r.captions.replace} /> : null}
        {r.safeArea ? <SafeArea /> : null}
       </BandScaleProvider>
      </DesignSizeProvider>
      <StoryAudio vo={`projects/${project}/vo.wav`} cues={idx} leadF={r.leadF} voGainDb={r.voGainDb} music={r.music} sfx={r.sfx} clips={r.clips} missing={missing} />
    </StyleProvider>
  );
};

/** shown when no storyboard project is published yet (a fresh clone before `npm run example`) */
const NothingPublished: React.FC = () => (
  <AbsoluteFill style={{ background: "#0A0A0A", color: paperDesk.paper, justifyContent: "center", alignItems: "center", gap: 28 }}>
    <div style={{ fontFamily: VOX_SANS, fontWeight: 800, fontSize: 64 }}>No storyboard project is published yet</div>
    <div style={{ fontFamily: SMALL_SANS, fontWeight: 500, fontSize: 32, opacity: 0.8 }}>
      npm run example  ·  or  ·  tools/py tools/studio/publish_project.py &lt;slug&gt;
    </div>
  </AbsoluteFill>
);
