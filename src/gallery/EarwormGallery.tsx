import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CutOut } from "../collage";
import { useCues } from "../audio";
import { FilmFinish } from "../effects";
import {
  AnnotationLabel, BlackCollageGround, DecodeNameCard, GiantWord, KaraokeCaption, KineticVoice, KineticWord, LabelStrip, SeriesCard,
  TextFillSilhouette, TornPhoto, TypewriterSlide, XMark, captionTokens,
} from "../earworm";
import { DesignSpace } from "../lib/stage";
import { StyleProvider } from "../tokens/theme";
import { earwormType } from "../tokens/type";

/**
 * Test bench for src/earworm. Scenes (frames): A 0 torn photos + label strips · B 75 annotation + X + name card ·
 * C 150 kinetic voice behind a cut-out · D 240 kinetic words + typewriter slide · E 330 karaoke caption (demo cues) ·
 * F 480 giant word on white paper with a photo inside · G 555 giant word on black + text-filled silhouettes · H 630 series card.
 */
const SCENES: { id: string; from: number; dur: number }[] = [
  { id: "A", from: 0, dur: 75 },
  { id: "B", from: 75, dur: 75 },
  { id: "C", from: 150, dur: 90 },
  { id: "D", from: 240, dur: 90 },
  { id: "E", from: 330, dur: 150 },
  { id: "F", from: 480, dur: 75 },
  { id: "G", from: 555, dur: 75 },
  { id: "H", from: 630, dur: 60 },
];
export const EarwormGallery_DURATION = 690;

const PHOTO = "assets/cc0/photos/";
const CUT = "assets/cutouts/";

const Scene: React.FC<{ id: string; white?: boolean; children: React.ReactNode }> = ({ id, white, children }) => {
  const s = SCENES.find((x) => x.id === id)!;
  return (
    <Sequence from={s.from} durationInFrames={s.dur}>
      <BlackCollageGround variant={white ? "whitePaper" : "black"} seed={id} weave={true} />
      <DesignSpace>{children}</DesignSpace>
    </Sequence>
  );
};

export const EarwormGallery: React.FC = () => {
  const idx = useCues("demo");
  // phrase 1 (cue frames 30–110) and phrase 2 (225–280, pulled forward) into scene E's time
  const tokens = [...captionTokens(idx, { from: 30, to: 110, offset: 30 }), ...captionTokens(idx, { from: 225, to: 280, offset: 225 - 95 })];
  return (
    <StyleProvider style="voxEarworm">
      <FilmFinish>
        <AbsoluteFill style={{ background: "#0A0A0A" }}>
          <Scene id="A">
            <TornPhoto src={`${PHOTO}chevrolet-1931-shulmans-market-dc-1941.jpg`} x={120} y={110} width={560} height={400} seed="a" slam delay={0} />
            <TornPhoto src={`${PHOTO}vanderbilt-cup-robertson-locomobile-1908.jpg`} x={780} y={170} width={440} height={310} rotate={-3} seed="b" boil={2} delay={6} />
            <TornPhoto src={`${CUT}victorian-man.png`} x={1360} y={110} width={420} height={420} grade="bw" seed="c" delay={10}
              circleCrop={{ diameter: 420, imgWidth: 330, imgHeight: 790, imgX: 45, imgY: -70, breakoutAbove: 0.14 }} />
            <LabelStrip lines={["FENDER", "RHODES"]} x={150} y={640} delay={12} reveal="wipe" sub="STARDUST" />
            <LabelStrip lines={["MELVIN LINDSEY"]} x={800} y={720} delay={20} reveal="slide" />
            <LabelStrip lines={["SARAH VAUGHAN"]} x={1280} y={640} delay={30} reveal="rise" />
          </Scene>
          <Scene id="B">
            <CutOut src={`${CUT}bat.png`} x={300} y={170} width={780} height={338} tone="bw" />
            <AnnotationLabel lines={["PARLIAMENT", "BAND", "LEADER"]} x={170} y={640} delay={4} arrow={{ to: { x: 520, y: 470 } }} exitAt={64} />
            <XMark x={1000} y={760} size={90} delay={10} />
            <DecodeNameCard name="FREDARA HADLEY" title="Ethnomusicologist" affiliation="The Juilliard School" delay={0} resolveAt={22} exitAt={58} />
          </Scene>
          <Scene id="C">
            <KineticVoice
              lines={[
                { words: [{ text: "DID", f: 8 }, { text: "YOU", f: 14 }, { text: "WANT", f: 20 }, { text: "TO", f: 26 }, { text: "EAR", f: 32 }], cap: 170 },
                { words: [{ text: "SOMETHING", f: 44 }, { text: "?", f: 56 }], cap: 170 },
                { words: [{ text: "YES", f: 66 }], cap: 560 },
              ]}
            />
            <CutOut src={`${CUT}vintage-car.png`} x={560} y={430} width={900} height={385} tone="bw" />
          </Scene>
          <Scene id="D">
            <KineticWord text="POST" delay={4} glitch="rgb" x={500} y={300} role={{ ...earwormType.keyword, cap: 150 }} />
            <KineticWord text="INDUSTRIAL" delay={16} until={50} glitch="white" x={1230} y={300} />
            <KineticWord text="BLACK" delay={54} glitch="white" x={960} y={500} />
            <TypewriterSlide text="GEORGE" finishAt={44} x={400} y={700} />
            <TypewriterSlide text="CLINTON" finishAt={64} x={760} y={840} framesPerLetter={2} />
          </Scene>
          <Scene id="E">
            <KaraokeCaption tokens={tokens} mode="sung" />
          </Scene>
          <Scene id="F" white>
            <GiantWord text="SPEECHES" ground="white" delay={0}>
              <TornPhoto src={`${PHOTO}ford-highland-park-magneto-line-1913.jpg`} x={850} y={380} width={300} height={240} seed="f" slam delay={4} />
            </GiantWord>
          </Scene>
          <Scene id="G">
            <GiantWord text="POETRY" ground="black" scatter={{ axis: "y" }} delay={0} cy={300} />
            <TextFillSilhouette src={`${CUT}victorian-man.png`} x={300} y={400} width={230} height={550} fill="handwriting" outline={9} />
            <TextFillSilhouette src={`${CUT}vintage-car.png`} x={760} y={560} width={760} height={324} fill="newsprint" outline={9} seed="car" />
          </Scene>
          <Scene id="H">
            <SeriesCard />
          </Scene>
        </AbsoluteFill>
      </FilmFinish>
    </StyleProvider>
  );
};
