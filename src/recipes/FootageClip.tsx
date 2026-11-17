import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { DesignSpace } from "../lib/stage";
import { CornerTag } from "../type/CornerTag";
import { DateTag } from "../type/DateTag";
import { LowerThird, type LowerThirdProps } from "../type/LowerThird";
import { Subtitles, type SubtitleItem } from "../type/Subtitles";
import { Placeholder, isMissing, warnOnce, type RecipeProps } from "./shared";
import { packaging } from "../tokens/colors";

/** pillarbox / letterbox bars: flat black (DA 4:05; the kit's `Pillarbox` #1F1F1F is the epigenetics excerpt) */
export const FOOTAGE_BARS = packaging.footageBars;

export type FootageClipProps = {
  /** mp4 / webm, project-relative (`assets/footage/x.mp4`); needs a CREDITS.md line */
  src: string;
  /** source window in seconds: the picture starts `startFromSec` into the file (default 0); `endAtSec` stops it (default: the scene's end) */
  startFromSec?: number;
  endAtSec?: number;
  /** clip sound (played by the storyboard's audio plan, not by this component: the picture here is muted). Default true; `audio: false` for B-roll */
  audio?: boolean;
  /** clip sound level, dB re the voice (default 0: leave the file at the voice level, speech RMS -21.5 dBFS) */
  audioDb?: number;
  /** J-cut: the sound starts this many frames BEFORE the picture (6-31 f, storyboard fps) */
  audioLeadF?: number;
  /** what the music bed does while the clip sound plays: "duck" (-20 dB, default with sound), "out" (key bites), "keep" (default without sound) */
  bed?: "duck" | "out" | "keep";
  /** "cover" (default) fills the picture box, "contain" shows the whole frame */
  fit?: "cover" | "contain";
  /** picture aspect ratio (4/3 -> black side bars); omitted = full frame 16:9 */
  pillarbox?: number;
  /** "native" (default): no grading. "bw": only when the source is black and white and has a colour cast */
  grade?: "native" | "bw";
  /** corner source tag: "Library of Congress, 1958" */
  tag?: string;
  /** date tag; `at` is a frame (sequence-relative) or an anchor (event `date` also sets it); default 0 */
  dateTag?: { text: string; at?: number; style?: "corner" | "spine"; life?: number };
  /** lower third at cut +2 f (event `lowerThird` or `at` moves it); `life` default 120 f, clipped to the scene */
  lowerThird?: { name: string; role?: string; at?: number } & Partial<Pick<LowerThirdProps, "variant" | "bar" | "exit" | "x" | "baselineY" | "life">>;
  /** burned-in subtitles for non-English speech; `t` / `until` are seconds after the scene start */
  subtitles?: SubtitleItem[];
};

/**
 * Recipe "footage clip" (analysis/vox-framework-coverage.md Build 6): full-frame footage in its native colour with its own sound.
 * Picture: `OffthreadVideo` on ones (native rate), muted here; the clip's sound, the J-cut `audioLeadF` and the music bed drop are the
 * storyboard's audio plan (src/studio/StoryAudio.tsx). Dressing: corner source tag, date tag (`corner` / `spine`), lower third, subtitles,
 * pillarbox for 4:3. Cut to an on-camera speaker 2-3 f after their voice starts, or pre-lap with `audioLeadF`; B-roll on the phrase onset.
 * Events: `lowerThird` (start, default cut +2 f), `date` (date tag start, default 0).
 */
export const FootageClip: React.FC<RecipeProps<FootageClipProps>> = ({ ctx, src, startFromSec = 0, endAtSec, fit = "cover", pillarbox, grade = "native", tag, dateTag, lowerThird, subtitles }) => {
  const miss = isMissing(ctx, src);
  if (miss) warnOnce(`asset missing: ${src ?? "(no src)"} — placeholder drawn`);
  const box = pillarbox ? { x: Math.round((1920 - 1080 * pillarbox) / 2), w: Math.round(1080 * pillarbox) } : { x: 0, w: 1920 };
  const ltAt = lowerThird?.at ?? ctx.events.lowerThird?.at ?? 2;
  const dtAt = dateTag?.at ?? ctx.events.date?.at ?? 0;
  return (
    <AbsoluteFill style={{ background: FOOTAGE_BARS }}>
      <DesignSpace>
        <div style={{ position: "absolute", left: box.x, top: 0, width: box.w, height: 1080, overflow: "hidden" }}>
          {miss ? <Placeholder label={src ?? "footage"} w={box.w} h={1080} />
            : (
              <OffthreadVideo
                src={staticFile(src)} muted startFrom={Math.round(startFromSec * ctx.fps)} endAt={endAtSec !== undefined ? Math.round(endAtSec * ctx.fps) : undefined}
                style={{ width: box.w, height: 1080, objectFit: fit, filter: grade === "bw" ? "grayscale(1)" : undefined }}
              />
            )}
        </div>
        {tag && <CornerTag text={tag} />}
        {dateTag && <DateTag text={dateTag.text} at={dtAt} style={dateTag.style} life={dateTag.life} seed={`${ctx.seed}-dt`} />}
        {subtitles && <Subtitles items={subtitles} />}
        {lowerThird && (
          <LowerThird
            {...lowerThird} delay={ltAt} life={lowerThird.life ?? Math.max(1, Math.min(120, ctx.dur - ltAt - 1))} seed={`${ctx.seed}-lt`}
          />
        )}
      </DesignSpace>
    </AbsoluteFill>
  );
};
