import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { DesignSpace } from "../lib/stage";
import { darkCollage, paperDesk, voxEditorial, voxExplainer } from "../tokens/colors";
import { collageType, editorialType, paperDeskType, voxType } from "../tokens/type";
import {
  BigFigure, BoilText, CenterOutReveal, ChunkPopOn, HandwritingWriteOn, HighlightBox, Highlighter, LineWipe,
  NeonText, SlotReel, SubtitleReveal, TitleRise, Typewriter, VideoCaption, WipeOff,
} from "../type";

/** Visual test bench for src/type. Scenes of 80 f @24 on flat backgrounds (Paper component not used). */
const Scene: React.FC<{ from: number; bg: string; label: string; children: React.ReactNode }> = ({ from, bg, label, children }) => (
  <Sequence from={from} durationInFrames={80} layout="none">
    <Sequence from={0} durationInFrames={80} name={label}>
      <AbsoluteFill style={{ background: bg }}>
        <DesignSpace>{children}</DesignSpace>
      </AbsoluteFill>
    </Sequence>
  </Sequence>
);
const at = (left: number, top: number): React.CSSProperties => ({ position: "absolute", left, top });
const tag = (c: string): React.CSSProperties => ({ position: "absolute", left: 40, top: 30, fontFamily: "monospace", fontSize: 18, color: c, opacity: 0.6 });

export const TypeGallery: React.FC = () => (
  <AbsoluteFill style={{ background: "#222" }}>
    <Scene from={0} bg={paperDesk.paper} label="paper desk">
      <div style={tag(paperDesk.inkPlum)}>HighlightBox + SubtitleReveal + BigFigure + Typewriter</div>
      <div style={at(120, 130)}><HighlightBox delay={6}>Porsche Panamera</HighlightBox></div>
      <div style={at(120, 300)}><SubtitleReveal delay={26}>The price at launch is $89,800</SubtitleReveal></div>
      <div style={at(120, 420)}><BigFigure value={43000000000} prefix="$" countUp delay={4} duration={36} /></div>
      <div style={at(120, 600)}>
        <Typewriter delay={2}>{"“We wanted to build the sports car\nwe could not find.”"}</Typewriter>
        <Typewriter role={paperDeskType.attribution} cps={43} delay={30} style={{ marginTop: 12 }}>— Ferry Porsche</Typewriter>
      </div>
      <div style={at(1150, 130)}><SlotReel words={["Legacy", "Sport", "Racing", "Luxury", "Icon", "Heritage"]} target={0} delay={4} box /></div>
    </Scene>
    <Scene from={80} bg={paperDesk.night} label="neon">
      <div style={tag("#aaa")}>HighlightBox glow / sharpenInside + NeonText</div>
      <div style={at(160, 150)}><HighlightBox variant="glow" delay={4}>SUV</HighlightBox></div>
      <div style={at(160, 400)}><HighlightBox variant="sharpenInside" delay={4}>Porsche Cayenne</HighlightBox></div>
      <div style={at(1200, 190)}><NeonText>2002</NeonText></div>
    </Scene>
    <Scene from={160} bg={voxExplainer.paper} label="vox">
      <div style={tag(voxExplainer.ink)}>Highlighter + TitleRise + HandwritingWriteOn</div>
      <div style={at(140, 140)}><TitleRise>{"Genetics\nand more"}</TitleRise></div>
      <div style={at(140, 480)}>
        <Highlighter role={voxType.header} delay={8}>Epigenetics reads the genome</Highlighter>
      </div>
      <div style={at(140, 620)}>
        <Highlighter role={voxType.header} delay={8} variant="editorial" fadeOut fadeOutDuration={40}>Dry-brush editorial pass</Highlighter>
      </div>
      <div style={at(1200, 200)}>
        <HandwritingWriteOn secondColor={voxExplainer.markerBlue} delay={2} style={{ fontSize: 80 }}>Methyl group</HandwritingWriteOn>
      </div>
    </Scene>
    <Scene from={240} bg={voxEditorial.paper} label="editorial">
      <div style={tag(voxEditorial.ink)}>CenterOutReveal / LineWipe / WipeOff / ChunkPopOn</div>
      <div style={at(200, 140)}><CenterOutReveal delay={4}>The Highlight of the week</CenterOutReveal></div>
      <div style={at(200, 300)}><LineWipe role={editorialType.body} delay={4}>{"A text block revealed top to bottom\nline after line, ease in-out\nover about four tenths of a second"}</LineWipe></div>
      <div style={at(200, 600)}><WipeOff role={editorialType.headline} delay={20}>Erased right to left</WipeOff></div>
      <div style={at(200, 800)}><ChunkPopOn role={editorialType.headline} delay={4}>Chunks pop on in bursts</ChunkPopOn></div>
    </Scene>
    <Scene from={320} bg="linear-gradient(90deg,#1b1a18 0%,#2a2724 45%,#d9d3c8 55%,#f0ebe2 100%)" label="captions">
      <div style={tag("#999")}>VideoCaption: dark (riseSpin) over dark / bright over bright</div>
      <VideoCaption triangleIn="riseSpin" delay={2} tone="dark">Porsche first introduced the</VideoCaption>
      <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <VideoCaption tone="bright" delay={4} x={50} textX={144}>Bright footage caption</VideoCaption>
        </div>
      </div>
    </Scene>
    <Scene from={400} bg={darkCollage.plate} label="collage">
      <div style={tag("#aaa")}>BoilText + Typewriter schedule</div>
      <div style={at(300, 100)}><BoilText>dracula</BoilText></div>
      <div style={at(300, 600)}>
        <Typewriter role={collageType.label} schedule={[0, 2, 6, 8, 10, 14, 16]}>century</Typewriter>
      </div>
    </Scene>
  </AbsoluteFill>
);
