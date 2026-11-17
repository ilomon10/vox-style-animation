import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { DesignSpace } from "../lib/stage";
import { voxExplainer as C } from "../tokens/colors";
import { voxType } from "../tokens/type";
import { HighlightBox, TitleRise } from "../type";
import {
  AudioBars, LyricLine, MusicBed, Narration, OnCue, PulseOnBeat, Sfx, buildDuckCurve, cueFrame, musicGainAt, useBeatPulse, useCues,
} from "../audio";

/** Visual test bench for src/audio: demo track (85 BPM bed, 2 narration-like phrases, 1 whoosh) + cue-driven visuals. */
export const AUDIO_SYNC_GALLERY_DURATION = 480;

const WHOOSH_AT = Math.round(14.6 * 25);
const at = (left: number, top: number): React.CSSProperties => ({ position: "absolute", left, top });
const mono: React.CSSProperties = { fontFamily: "monospace", fontSize: 18, color: C.ink };

export const AudioSyncGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = useCues("demo");
  const total = AUDIO_SYNC_GALLERY_DURATION;
  const lead = Math.round(0.08 * fps);

  const curve = useMemo(() => buildDuckCurve(cues.speechMask(), total, fps), [cues, total, fps]);
  const gainDb = (f: number) => 20 * Math.log10(Math.max(1e-4, musicGainAt(curve, f, total, fps, {})));

  // timeline geometry (design px)
  const TL = { x: 120, w: 1680 };
  const fx = (f: number) => TL.x + (f / total) * TL.w;
  const pulse = useBeatPulse({ cues });
  const bar = cues.downbeats.includes(cues.lastBeat(frame) ?? -1);

  const graphY = 800, graphH = 140;
  const path = Array.from({ length: total }, (_, f) => {
    const y = (Math.min(0, Math.max(-30, gainDb(f))) / -30) * graphH;
    return `${f === 0 ? "M" : "L"}${fx(f).toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {cues.cues.words.length > 0 && (
        <>
          <Narration src="audio/demo_narration.wav" cues={cues} />
          <MusicBed src="audio/demo_music.wav" duckUnder={cues} durationInFrames={total} />
          <Sfx at={WHOOSH_AT} src="audio/demo_whoosh.wav" gainDb={0} />
        </>
      )}
      <DesignSpace>
        <div style={{ ...at(60, 30), ...mono, opacity: 0.6 }}>AudioSyncGallery — beats / words / ducking from public/audio/demo.cues.json ({cues.cues.tempo_bpm} BPM)</div>

        {/* TitleRise on the first spoken word, HighlightBox on "beat" */}
        {cues.cues.words.length > 0 && (
          <>
            <div style={at(120, 110)}>
              <OnCue at={cueFrame({ cues, word: "Chocolate" })} lead={lead}>
                <TitleRise>Chocolate</TitleRise>
              </OnCue>
            </div>
            <div style={at(120, 230)}>
              <OnCue at={cueFrame({ cues, word: "beat", snap: 4 })} lead={lead}>
                <HighlightBox variant="flat" role={voxType.title}>the beat</HighlightBox>
              </OnCue>
            </div>
          </>
        )}

        {/* pulse-on-beat object + EQ bars */}
        <div style={at(1130, 90)}>
          <PulseOnBeat cues={cues}>
            <div style={{ width: 200, height: 200, background: bar ? C.tape : C.sticky, boxShadow: "none", display: "grid", placeItems: "center", ...voxType.sticky as object, fontSize: 40 }}>
              {bar ? "BAR" : "beat"}
            </div>
          </PulseOnBeat>
        </div>
        <div style={at(1450, 70)}>
          <AudioBars src="audio/demo.wav" width={380} height={220} bars={16} />
        </div>
        <div style={{ ...at(1450, 300), ...mono, fontSize: 14 }}>pulse {pulse.toFixed(2)}</div>

        {/* word-timed lyric line */}
        <div style={at(120, 470)}>
          <LyricLine cues={cues} />
        </div>

        {/* beat ticks + speech spans */}
        <div style={{ ...at(TL.x, 600), ...mono, fontSize: 14 }}>beats (tall = downbeat) / speech</div>
        <svg width={1920} height={150} style={at(0, 620)}>
          {cues.phrases.map((p, i) => (
            <rect key={i} x={fx(p.frame_start)} y={60} width={fx(p.frame_end) - fx(p.frame_start)} height={30} fill={C.markerRing} opacity={0.7} />
          ))}
          {cues.beats.map((b, i) => (
            <rect key={i} x={fx(b) - 1.5} y={cues.downbeats.includes(b) ? 10 : 30} width={3} height={cues.downbeats.includes(b) ? 100 : 60} fill={C.ink} />
          ))}
          <rect x={fx(WHOOSH_AT)} y={115} width={fx(WHOOSH_AT + 30) - fx(WHOOSH_AT)} height={14} fill={C.markerBlue} />
          <rect x={fx(frame) - 2} y={0} width={4} height={150} fill={C.marker} />
        </svg>

        {/* ducked music gain, dB */}
        <div style={{ ...at(TL.x, graphY - 34), ...mono, fontSize: 14 }}>music gain dB (0 to -30) under narration — duck {"-14 dB"}, attack/release from audio/defaults.ts</div>
        <svg width={1920} height={graphH + 20} style={at(0, graphY - 4)}>
          {cues.phrases.map((p, i) => (
            <rect key={i} x={fx(p.frame_start)} y={0} width={fx(p.frame_end) - fx(p.frame_start)} height={graphH + 10} fill={C.markerRing} opacity={0.35} />
          ))}
          <path d={path} transform="translate(0,4)" fill="none" stroke={C.ink} strokeWidth={3} />
          <rect x={fx(frame) - 2} y={0} width={4} height={graphH + 10} fill={C.marker} />
        </svg>
      </DesignSpace>
    </AbsoluteFill>
  );
};
