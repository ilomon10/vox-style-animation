import React from "react";
import { Audio, staticFile } from "remotion";
import { KaraokeCaption, type CaptionToken } from "../earworm";
import { RecipeFrame, SafePhoto, isMissing, warnOnce, type RecipeProps } from "./shared";

export type KaraokeQuoteProps = {
  /** archival clip (plays from the scene start; project audio, phone EQ is baked offline: PHONE_EQ) */
  audio?: string;
  audioStartSec?: number;
  /** words as HEARD, `t` = seconds after the scene start (the clip's own timing, not the voice-over's) */
  tokens: { text: string; t: number; phraseStart?: boolean }[];
  mode?: "speech" | "sung";
  /** portrait cut-out behind the type (optional) */
  src?: string;
};

/** Recipe "karaoke quote" (Earworm A/D): archival audio with its words as full-width caps, each popping 4 f (speech) / +1 f (sung) around its syllable, max 2 lines, previous line 35 %. */
export const KaraokeQuote: React.FC<RecipeProps<KaraokeQuoteProps>> = ({ ctx, audio, audioStartSec = 0, tokens, mode = "speech", src }) => {
  const toks: CaptionToken[] = tokens.map((t) => ({ text: t.text, f: Math.round(t.t * ctx.fps), phraseStart: t.phraseStart }));
  const haveAudio = !!audio && !isMissing(ctx, audio);
  if (audio && !haveAudio) warnOnce(`asset missing: ${audio} — no archival audio`);
  return (
    <RecipeFrame seed={ctx.seed}>
      {src && <SafePhoto ctx={ctx} src={src} x={1130} y={120} width={620} height={760} rotate={1.5} seed={`${ctx.seed}-q`} />}
      {/* with a portrait on the right, centre the caption in the free left part so the photo never covers it */}
      <KaraokeCaption tokens={toks} mode={mode} maxChars={src ? 14 : 20} gridPerLine style={src ? { transform: "translateX(-380px)" } : undefined} />
      {haveAudio && <Audio src={staticFile(audio!)} startFrom={Math.round(audioStartSec * ctx.fps)} />}
    </RecipeFrame>
  );
};
