import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import { CuesProvider, useCues, cueFrame } from "../audio";
import { DesignSpace } from "../lib/stage";
import { voxEarworm as C } from "../tokens/colors";
import { earwormType, typeStyle } from "../tokens/type";
import {
  BlurThroughCut, DipAudio, DipToBlack, Drop, DropAudio, GlitchCut, KickScope, MegaPullBack, Multiplane, NeedleMeter, NewsprintMaskWipe,
  SongIntro, SpectrumBars, SpinSwap, glitchMusicGain, type MultiplaneLayer,
} from "../earworm/fx";

/**
 * Test bench for src/earworm/fx: every sound-locked transition with its SFX (procedural, public/audio/sfx), the multiplane crane
 * and the measured audio graphics, over the demo track (public/audio/demo.*). Sections (25 fps, global frames):
 *   0 BlurThroughCut (cut 30) | 50 SpinSwap (swap 75) | 100 DipToBlack chapter (black 117) | 150 DipToBlack act (black 180)
 *   250 Drop | 350 NewsprintMaskWipe | 390 MegaPullBack | 480 SongIntro (song 540) | 570 Multiplane
 *   700 audio graphics (demo audio frame 215+) | 800 GlitchCut (cut 820)
 */
export const EarwormFxGallery_DURATION = 880;

const PHOTOS = [
  "photos/panhard-engine-detail-1912.jpg", "photos/ford-highland-park-magneto-line-1913.jpg", "photos/vanderbilt-cup-robertson-locomobile-1908.jpg",
  "photos/bureau-of-standards-engine-test-1930.jpg", "photos/chevrolet-1931-shulmans-market-dc-1941.jpg", "portraits/victorian-man-full-length-cdv-1870.jpg",
];
const photo = (i: number) => staticFile(`assets/cc0/${PHOTOS[i % PHOTOS.length]}`);

/** B/W cut-out with a torn-white border. */
const Cut: React.FC<{ i: number; w?: number; h?: number; style?: React.CSSProperties }> = ({ i, w = 1000, h = 680, style }) => (
  <div style={{ width: w, height: h, padding: 14, background: C.tornWhite, boxSizing: "border-box", ...style }}>
    <Img src={photo(i)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)" }} />
  </div>
);

/** A full scene: near-black ground, one photo, one periwinkle word. `big` = oversized world for rotations. */
const Scene: React.FC<{ i: number; word: string; big?: boolean }> = ({ i, word, big }) => {
  const inner = (
    <>
      <Cut i={i} style={{ position: "absolute", left: 460, top: 110 }} />
      <div style={{ position: "absolute", left: 470, top: 790, ...typeStyle(earwormType.keyword) }}>{word}</div>
    </>
  );
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <DesignSpace>
        {big ? <div style={{ position: "absolute", left: -940, top: -760, width: 3800, height: 2600, background: C.ground }}><div style={{ position: "absolute", left: 940, top: 760 }}>{inner}</div></div> : inner}
      </DesignSpace>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ children: string }> = ({ children }) => (
  <div style={{ position: "absolute", left: 40, bottom: 28, font: "18px monospace", color: C.labelGrey, zIndex: 5 }}>{children}</div>
);

const Sec: React.FC<{ from: number; dur: number; label: string; children: React.ReactNode }> = ({ from, dur, label, children }) => (
  <Sequence from={from} durationInFrames={dur} name={label}>
    <AbsoluteFill style={{ background: C.ground }}>
      {children}
      <DesignSpace><Label>{label}</Label></DesignSpace>
    </AbsoluteFill>
  </Sequence>
);

const BANDS = [0.7, 1, 1.5, 2, 2.6, 3.3, 4];
const crane: MultiplaneLayer[] = Array.from({ length: 42 }, (_, k) => {
  const speed = BANDS[k % 7];
  const w = Math.round(520 / Math.sqrt(speed));
  return {
    node: <Cut i={k} w={w} h={Math.round(w * 0.7)} />, w, h: Math.round(w * 0.7), speed,
    x: 960 + ((k * 577) % 1700) - 850, y: 100 + ((k * 389) % 1000) * 5.2, rot: ((k * 7) % 11) - 5,
  };
});

const EndLogo: React.FC<{ reveal: number }> = ({ reveal }) => {
  const word = "EARWORM";
  const n = Math.ceil(word.length * reveal);
  return (
    <AbsoluteFill>
      <DesignSpace><div style={{ ...typeStyle(earwormType.bigLetters), position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", letterSpacing: 8 }}>{word.slice(0, n)}</div></DesignSpace>
    </AbsoluteFill>
  );
};

export const EarwormFxGallery: React.FC = () => {
  const cues = useCues("demo");
  const needleAt = cues.words.length ? cueFrame({ cues, word: "beat", edge: "stress" }) : 245;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Sec from={0} dur={50} label="BlurThroughCut: zoom-blur 4 f into hard cut 30; sub_boom peak on cut+1">
        <BlurThroughCut at={30} outgoing={<Scene i={0} word="OUT" />} incoming={<Scene i={1} word="IN" />} />
      </Sec>
      <Sec from={50} dur={50} label="SpinSwap: 90 deg roll, swap frame 25 (global 75); whoosh peak on the swap">
        <SpinSwap at={25} outgoing={<Scene i={2} word="OLD TERM" big />} incoming={<Scene i={3} word="NEW TERM" big />} />
      </Sec>
      <Sec from={100} dur={50} label="DipToBlack chapter: out 5 / black 9 / in 8, thump on first black frame (117), audio silent in black">
        <DipToBlack at={12} variant="chapter" outgoing={<Scene i={4} word="CH 1" />} incoming={<Scene i={5} word="CH 2" />} />
        <DipAudio at={12} variant="chapter" src="audio/demo_music.wav" gainDb={-8} />
      </Sec>
      <Sec from={150} dur={100} label="DipToBlack act break: out 18 / black 17 / in 36; voice restarts with the picture (47)">
        <DipToBlack at={12} outgoing={<Scene i={0} word="ACT I" />} incoming={<Scene i={3} word="ACT II" />} />
        <DipAudio at={12} src="audio/demo_narration.wav" startFrom={75} />
        <Sequence from={47} layout="none"><Audio src={staticFile("audio/demo_narration.wav")} startFrom={230} /></Sequence>
      </Sec>
      <Sec from={250} dur={100} label="Drop: fade 27 / black 13 / up 17; <=-47 dB at black+7, new music on the fade-up, voice +14">
        <Drop at={10} outgoing={<Scene i={1} word="PAYOFF" />} incoming={<Scene i={2} word="DROP" />} />
        <DropAudio at={10} oldMusic="audio/demo_music.wav" nextMusic="audio/demo_music.wav" narration="audio/demo_narration.wav" narrationFrom={230} />
      </Sec>
      <Sec from={350} dur={40} label="NewsprintMaskWipe: next shot revealed through a growing newsprint head (13 f)">
        <NewsprintMaskWipe at={8} outgoing={<Scene i={4} word="BEFORE" />} incoming={<Scene i={5} word="AFTER" />} center={{ x: 960, y: 480 }} />
      </Sec>
      <Sec from={390} dur={90} label="MegaPullBack: 6.25x macro VU -> top-down collage in 52 f, bezier(.70,.10,.45,.90)">
        <MegaPullBack at={5}>
          {(p) => (
            <AbsoluteFill style={{ background: C.ground }}>
              <Sequence from={0} layout="none"><div style={{ position: "absolute", left: 960 - 280, top: 540 - 170 }}><NeedleMeter peakAt={30} /></div></Sequence>
              {[0, 1, 2, 3, 4, 5].map((k) => {
                const a = (k / 6) * Math.PI * 2;
                const slide = Math.min(1, Math.max(0, (p - 0.5 - k * 0.05) / 0.4));
                const dist = 700 + (1 - slide) * 900;
                return <Cut key={k} i={k} w={380} h={270} style={{ position: "absolute", left: 960 + Math.cos(a) * dist * 1.3 - 190, top: 540 + Math.sin(a) * dist * 0.8 - 135, transform: `rotate(${(k - 3) * 6}deg)` }} />;
              })}
            </AbsoluteFill>
          )}
        </MegaPullBack>
      </Sec>
      <Sec from={480} dur={90} label="SongIntro: source up 30 f before, fly-in 12 f ends 3 f before thump (49), crackle 11 f, song hard on a beat (60)">
        <SongIntro
          at={60}
          source={<Scene i={3} word="STARDUST" />}
          fly={(p) => <Cut i={1} w={500} h={340} style={{ position: "absolute", left: 1100 + (1 - p) * 900, top: 80, transform: `rotate(${(1 - p) * 20}deg)` }} />}
          song={{ src: "audio/demo_music.wav", startFrom: 17, length: 30 }}
        />
      </Sec>
      <Sec from={570} dur={130} label="Multiplane: crane through 7 depths (0.7-4x), dolly-in blows the foreground off frame">
        <Multiplane
          layers={crane}
          keys={[
            { at: 0, y: 540 },
            { at: 90, y: 4700, ease: "tilt" },
            { at: 125, y: 4900, dolly: 0.28, ease: "accelerate" },
          ]}
        />
      </Sec>
      <Sec from={700} dur={100} label="Audio graphics: SpectrumBars (gate -12 dBr, 2 f look-ahead, 12/s), KickScope (low +8 dB, 0 lag), keyframed needle on 'beat'">
        <Audio src={staticFile("audio/demo.wav")} startFrom={215} />
        <Sequence from={-215} layout="none">
          <CuesProvider cues={cues}>
            <DesignSpace>
              <SpectrumBars />
              <div style={{ position: "absolute", left: 210, top: 70 }}><KickScope width={1500} height={260} /></div>
              <div style={{ position: "absolute", left: 1300, top: 60 }}><NeedleMeter peakAt={needleAt} size={520} /></div>
            </DesignSpace>
          </CuesProvider>
        </Sequence>
      </Sec>
      <Sec from={800} dur={80} label="GlitchCut: dip 6, zoom-blur 4, hard cut 20 on bass_hit, 18 f glitch build, ticks at 26 / 30; music never fades">
        <GlitchCut at={10} outgoing={<Scene i={2} word="LAST" />} card={(r) => <EndLogo reveal={r} />} />
        <Audio src={staticFile("audio/demo_music.wav")} volume={(f) => glitchMusicGain(f, 10) * 0.5} />
      </Sec>
    </AbsoluteFill>
  );
};
