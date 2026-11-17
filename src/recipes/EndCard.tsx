import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { SeriesCard } from "../earworm";
import { CreditsPanel, type CreditsEntry } from "../earworm/CreditsPanel";
import { DesignSpace } from "../lib/stage";
import { Placeholder, isMissing, warnOnce, type RecipeProps } from "./shared";

export type EndCardProps = {
  /** "series" (default): the glitch series card. "credits": dark credits panel + rule on the left, our mark or a clip on the right */
  mode?: "series" | "credits";
  /** YOUR series name: never a real logo */
  title?: string;
  tagline?: string;
  /** credits mode: 1-3 pages of role blocks */
  pages?: CreditsEntry[][];
  /** credits mode, right side: our series mark (black side), or a clip that fades up over 7 f */
  right?: "mark" | { video: string; startFromSec?: number };
  /** credits mode: seconds per page (default 5.5) */
  pageSec?: number;
  /** credits mode: no sound under the card (default true; the storyboard's audio plan decides, this is the intent flag) */
  silent?: boolean;
};

const PANEL_W = 696;

/**
 * Recipe "end card" (Earworm D): own series card, glitch-slice build over 18 f then 2-on/2-off glitch, yellow marker underline on the tagline. Enter it with `transitionIn: {kind: "glitchCut"}` (bass hit on the cut); the music runs to the last frame.
 * `mode: "credits"` (Vox house end card, healthcare 20:28): credits panel left (36 % W) with a growing rule, our series mark on black right (slice-glitch build 21 f from f4) or a `right: {video}` clip; pages swap every `pageSec`. Cut to it 11 f after the last spoken word; silent.
 */
export const EndCard: React.FC<RecipeProps<EndCardProps>> = ({ ctx, mode = "series", title = "SERIES", tagline = "A VIDEO SERIES", pages = [], right = "mark", pageSec = 5.5 }) => {
  const raw = useCurrentFrame();
  if (mode === "series") {
    return (
      <AbsoluteFill style={{ background: "#141414" }}>
        <DesignSpace><SeriesCard title={title} tagline={tagline} delay={1} seed={`${ctx.seed}-sc`} /></DesignSpace>
      </AbsoluteFill>
    );
  }
  const video = right !== "mark" ? right : null;
  const miss = video ? isMissing(ctx, video.video) : false;
  if (miss) warnOnce(`asset missing: ${video!.video} — placeholder drawn`);
  const fadeUp = Math.min(1, Math.max(0, raw / Math.max(1, Math.round((7 * ctx.fps) / 24)))); // clip fades up over 7 f, on ones
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DesignSpace>
        <div style={{ position: "absolute", left: PANEL_W, top: 0, width: 1920 - PANEL_W, height: 1080, overflow: "hidden" }}>
          {video ? (
            miss ? <Placeholder label={video.video} w={1920 - PANEL_W} h={1080} />
              : <OffthreadVideo src={staticFile(video.video)} startFrom={Math.round((video.startFromSec ?? 0) * ctx.fps)} muted style={{ width: 1920 - PANEL_W, height: 1080, objectFit: "cover", opacity: fadeUp }} />
          ) : (
            <SeriesCard title={title} tagline={tagline} delay={4} buildFrames={Math.round((21 * ctx.fps) / 24)} bg="#000000" seed={`${ctx.seed}-sc`} />
          )}
        </div>
        <CreditsPanel pages={pages} pageFrames={Math.round(pageSec * ctx.fps)} delay={0} />
      </DesignSpace>
    </AbsoluteFill>
  );
};
