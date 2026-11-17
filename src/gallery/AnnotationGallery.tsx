import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { DesignSpace } from "../lib/stage";
import { StyleProvider } from "../tokens/theme";
import { darkCollage, paperDesk, voxExplainer } from "../tokens/colors";
import { paperDeskType, typeStyle, voxType } from "../tokens/type";
import {
  BarChart, Callout, ColorFlash, CrossOut, DotField, HandDrawnRing, InsetMagnifier, LeaderLine, MapRoute,
  MarkerRing, MarkerUnderline, PencilRing, SketchArrow, TimelineMarker,
} from "../explainer";

const SEC = 48; // frames per bench section

const Section: React.FC<{ i: number; bg: string; style: "voxExplainer" | "paperDesk" | "darkCollage"; label: string; children: React.ReactNode }> = ({ i, bg, style, label, children }) => (
  <Sequence from={i * SEC} durationInFrames={SEC} name={label}>
    <StyleProvider style={style}>
      <AbsoluteFill style={{ background: bg }} />
      <DesignSpace>
        {children}
        <div style={{ position: "absolute", left: 24, bottom: 18, fontFamily: "monospace", fontSize: 18, color: "#888" }}>{label}</div>
      </DesignSpace>
    </StyleProvider>
  </Sequence>
);

const Word: React.FC<{ x: number; y: number; children: string; size?: number }> = ({ x, y, children, size = 64 }) => (
  <div style={{ ...typeStyle(voxType.title), fontSize: size, position: "absolute", left: x, top: y }}>{children}</div>
);

const MAP = staticFile("assets/cc0/maps/europe-physical-map-bazewicz-1914-1918.jpg");

export const AnnotationGallery: React.FC = () => (
  <AbsoluteFill>
    <Section i={0} bg={voxExplainer.paper} style="voxExplainer" label="PencilRing / MarkerUnderline / SketchArrow / CrossOut">
      <Word x={200} y={200}>Epigenetics</Word>
      <PencilRing cx={380} cy={235} rx={190} ry={60} />
      <Word x={900} y={200}>Genes</Word>
      <MarkerUnderline x1={900} x2={1120} y={290} delay={4} />
      <Word x={200} y={560}>Mistake</Word>
      <CrossOut x={190} y={540} w={260} h={100} delay={4} />
      <SketchArrow from={{ x: 700, y: 760 }} to={{ x: 1100, y: 640 }} delay={2} />
    </Section>
    <Section i={1} bg={paperDesk.paper} style="paperDesk" label="HandDrawnRing maroon / white / MarkerRing">
      <Word x={200} y={250} size={110}>1900</Word>
      <HandDrawnRing cx={370} cy={300} rx={230} ry={100} />
      <AbsoluteFill style={{ left: 960, width: 960, background: voxExplainer.board }} />
      <Word x={1130} y={250} size={90}>Twins</Word>
      <HandDrawnRing cx={1290} cy={295} rx={190} ry={85} variant="white" delay={2} />
      <div style={{ position: "absolute", left: 200, top: 650, ...typeStyle(voxType.title), fontSize: 90, color: voxExplainer.ink }}>Marker</div>
      <MarkerRing cx={365} cy={705} rx={210} ry={70} delay={2} />
    </Section>
    <Section i={2} bg={voxExplainer.paper} style="voxExplainer" label="InsetMagnifier L + cone / LeaderLine">
      <div style={{ position: "absolute", left: 300, top: 700, width: 400, height: 60, background: voxExplainer.page }} />
      <InsetMagnifier pin={{ x: 500, y: 730 }} circle={{ x: 900, y: 420 }} diameter={400} />
      <InsetMagnifier pin={{ x: 1300, y: 800 }} circle={{ x: 1500, y: 360 }} diameter={340} connector="cone" delay={4} seed="cone" />
      <LeaderLine points={[{ x: 100, y: 200 }, { x: 100, y: 120 }, { x: 400, y: 120 }]} delay={2} />
    </Section>
    <Section i={3} bg={voxExplainer.board} style="voxExplainer" label="DotPop / ColorFlash">
      <DotField dots={Array.from({ length: 24 }, (_, i) => ({ x: 300 + (i % 6) * 100, y: 300 + Math.floor(i / 6) * 100, color: i % 3 ? voxExplainer.redDark : voxExplainer.greenDark }))} stagger={1} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <ColorFlash delay={4}>{(fill) => <circle cx={1300} cy={450} r={110} fill={fill} />}</ColorFlash>
        <ColorFlash delay={12} to={voxExplainer.greenDark}>{(fill) => <rect x={1500} y={340} width={220} height={220} fill={fill} />}</ColorFlash>
      </svg>
    </Section>
    <Section i={4} bg={paperDesk.paper} style="paperDesk" label="BarChart + ring">
      <BarChart x={420} y={800} height={480} max={100} title="Price at launch, 1948-2024" source="Source: company filings"
        data={[{ label: "1948", value: 20 }, { label: "1964", value: 35 }, { label: "1977", value: 52 }, { label: "1990", value: 61 }, { label: "2005", value: 80 }, { label: "2024", value: 100 }]}
        ring={{ from: 4, to: 5, delay: 30 }} />
    </Section>
    <Section i={5} bg={darkCollage.plate} style="darkCollage" label="MapRoute dark collage">
      <MapRoute preset="darkCollage" delay={2} duration={38} waypoints={[{ x: 400, y: 800 }, { x: 700, y: 560 }, { x: 1000, y: 620 }, { x: 1300, y: 380 }, { x: 1560, y: 300 }]}>
        <Img src={MAP} style={{ position: "absolute", left: 160, top: 100, width: 1600, height: 880, objectFit: "cover" }} />
      </MapRoute>
    </Section>
    <Section i={6} bg={paperDesk.desk} style="paperDesk" label="MapRoute paper desk + head">
      <MapRoute preset="paperDesk" delay={2} duration={38} waypoints={[{ x: 400, y: 800 }, { x: 800, y: 500 }, { x: 1200, y: 640 }, { x: 1560, y: 300 }]}
        renderHead={({ angle }) => <div style={{ position: "absolute", left: -18, top: -18, width: 36, height: 36, borderRadius: "50%", background: paperDesk.maroon, transform: `rotate(${angle}rad)` }} />}>
        <Img src={MAP} style={{ position: "absolute", left: 160, top: 100, width: 1600, height: 880, objectFit: "cover" }} />
      </MapRoute>
    </Section>
    <Section i={7} bg={paperDesk.night} style="paperDesk" label="TimelineMarker">
      <TimelineMarker x={960} y={640} year="1964" />
    </Section>
    <Section i={8} bg={paperDesk.paper} style="paperDesk" label="Callout">
      <Callout cx={600} cy={500} r={150} label={{ x: 960, y: 380 }} text="Rear-engine layout, 1964">
        <div style={{ position: "absolute", left: 60, top: 100, width: 180, height: 100, borderRadius: 40, background: paperDesk.charcoal }} />
      </Callout>
      <div style={{ ...typeStyle(paperDeskType.subtitle), position: "absolute", left: 200, top: 800 }}>Callout system</div>
    </Section>
  </AbsoluteFill>
);
