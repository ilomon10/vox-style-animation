import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  ChromaticAberration, DustLoop, Exposure, FilmFinish, Grain, Jitter, Levels, Paper, Pillarbox, Vignette,
} from "../effects";
import { DesignSpace, useStage } from "../lib/stage";
import { CASLON } from "../tokens/fonts";
import { FINISH } from "../tokens/finish";
import { StyleProvider, type PaperKind, type StyleName } from "../tokens/theme";

/** Visual test bench for src/effects: one 48-frame section per paper kind under its matching finish,
 *  then a finish on/off split, standalone effects, and a flat-tone grain calibration chart. */
const SEC = 48;

/** crisp ink for judging fringes, grain and texture: lines, a black bar, glyphs, colour swatches */
const Ink: React.FC<{ ink?: string; label: string }> = ({ ink = "#2B2622", label }) => (
  <>
    <div style={{ position: "absolute", left: 120, top: 150, fontFamily: CASLON, fontWeight: 700, fontSize: 150, color: ink, lineHeight: 1 }}>
      Aa 1969
    </div>
    <div style={{ position: "absolute", left: 120, top: 360, width: 1000, height: 3, background: ink }} />
    <div style={{ position: "absolute", left: 120, top: 380, width: 1000, height: 1, background: ink }} />
    <div style={{ position: "absolute", left: 1250, top: 150, width: 440, height: 260, background: ink }} />
    <div style={{ position: "absolute", left: 1300, top: 190, width: 340, height: 180, border: "2px solid #E8E2D6" }} />
    {["#C93A2B", "#F2E600", "#2D6FB5", "#3A9B5C"].map((c, i) => (
      <div key={c} style={{ position: "absolute", left: 120 + i * 150, top: 440, width: 120, height: 120, background: c }} />
    ))}
    <div style={{ position: "absolute", left: 120, top: 620, fontFamily: CASLON, fontSize: 34, color: ink, width: 900, lineHeight: 1.4 }}>
      Paper, grain and fringes should look photographed, not rendered.
    </div>
    <div style={{ position: "absolute", left: 24, bottom: 18, fontFamily: "monospace", fontSize: 20, color: ink, opacity: 0.7 }}>{label}</div>
  </>
);

const Section: React.FC<{
  i: number;
  style: StyleName;
  kind: PaperKind;
  ink?: string;
  label: string;
}> = ({ i, style, kind, ink, label }) => (
  <Sequence from={i * SEC} durationInFrames={SEC} name={label}>
    <StyleProvider style={style}>
      <FilmFinish>
        <DesignSpace>
          <Paper kind={kind} seed={kind} />
          <Ink ink={ink} label={label} />
        </DesignSpace>
      </FilmFinish>
    </StyleProvider>
  </Sequence>
);

/** left half bare, right half finished (same scene) */
const Split: React.FC<{ i: number }> = ({ i }) => (
  <Sequence from={i * SEC} durationInFrames={SEC} name="finish on/off (paperDesk)">
    <StyleProvider style="paperDesk">
      <AbsoluteFill>
        <FilmFinish enabled={false}>
          <DesignSpace>
            <Paper kind="desk" seed="split" />
            <Ink label="finish OFF" />
          </DesignSpace>
        </FilmFinish>
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "inset(0 0 0 50%)" }}>
        <FilmFinish overrides={{ rgbSplit: { mode: "uniform", red: [3.3, 4.1], blue: [-3.2, -4.0] } }}>
          <DesignSpace>
            <Paper kind="desk" seed="split" />
            <Ink label="finish ON (desk split)" />
          </DesignSpace>
        </FilmFinish>
      </AbsoluteFill>
      <AbsoluteFill style={{ left: "50%", width: 2, background: "#e33" }} />
    </StyleProvider>
  </Sequence>
);

/** standalone components: CA radial, levels, jitter, vignette, dust, exposure, pillarbox */
const Standalone: React.FC<{ i: number }> = ({ i }) => (
  <Sequence from={i * SEC} durationInFrames={SEC} name="standalone effects">
    <StyleProvider style="voxExplainer">
      <AbsoluteFill style={{ display: "grid", gridTemplateColumns: "640px 640px 640px", gridTemplateRows: "360px 360px 360px" }}>
        <Cell label="ChromaticAberration radial">
          <ChromaticAberration split={FINISH.voxExplainer.rgbSplit}>
            <Scene />
          </ChromaticAberration>
        </Cell>
        <Cell label="Levels #272622 → #E9E7E7">
          <Levels black="#272622" white="#E9E7E7">
            <Scene />
          </Levels>
        </Cell>
        <Cell label="Jitter σ 18 px, every frame">
          <Jitter sigmaPx={18} clampPx={36} rate="frame" overscan={1.06}>
            <Scene />
          </Jitter>
        </Cell>
        <Cell label="Vignette 0.5 / 1.6 + DustLoop mixed">
          <Scene />
          <Vignette strength={0.5} power={1.6} />
          <DustLoop variant="mixed" opacity={1} />
        </Cell>
        <Cell label="Exposure 1.8 / blur 20">
          <Exposure brightness={1.8} blur={20}>
            <Scene />
          </Exposure>
        </Cell>
        <Cell label="Pillarbox 4:3">
          <Scene />
          <Pillarbox />
        </Cell>
        {(["darkCollage", "voxExplainer", "voxEditorial"] as const).map((n) => (
          <Cell key={n} label={`FilmFinish ${n}`}>
            <FilmFinish preset={FINISH[n]}>
              <Scene />
            </FilmFinish>
          </Cell>
        ))}
      </AbsoluteFill>
    </StyleProvider>
  </Sequence>
);

/** each cell hosts a full 1920×1080 frame scaled to 1/3, so frame-sized filters/vignette behave as in a real shot */
const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ position: "relative", overflow: "hidden", outline: "1px solid #555" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.3333)", transformOrigin: "0 0" }}>
      {children}
    </div>
    <div style={{ position: "absolute", left: 8, bottom: 6, fontFamily: "monospace", fontSize: 16, color: "#fff", background: "#0008", padding: "0 4px" }}>
      {label}
    </div>
  </div>
);

/** compact test scene (output px, no DesignSpace) */
const Scene: React.FC = () => (
  <AbsoluteFill style={{ background: "#D8D2C6" }}>
    <div style={{ position: "absolute", left: "8%", top: "12%", width: "84%", height: 6, background: "#222" }} />
    <div style={{ position: "absolute", left: "8%", top: "30%", width: "30%", height: "40%", background: "#C93A2B" }} />
    <div style={{ position: "absolute", left: "44%", top: "30%", width: "48%", height: "40%", background: "#222" }} />
    <div style={{ position: "absolute", left: "52%", top: "40%", fontFamily: CASLON, fontWeight: 700, fontSize: 150, color: "#EEE" }}>Aa 12</div>
    <div style={{ position: "absolute", left: "8%", top: "82%", width: "84%", height: 2, background: "#222" }} />
  </AbsoluteFill>
);

/** Flat tones with Grain only, for measuring achieved std-dev (python: numpy on the still, central crop). */
const Calibration: React.FC<{ i: number }> = ({ i }) => {
  const { width, height } = useStage();
  const cases = [
    { sigma: 3.4, size: 1.7, label: "σ3.4 s1.7 (dracula)" },
    { sigma: 2.7, size: 1.3, label: "σ2.7 s1.3 (vox)" },
    { sigma: 0.6, size: 1.6, label: "σ0.6 s1.6 (porsche)" },
    { sigma: 8, size: 2.5, label: "σ8 s2.5" },
  ];
  const tones = ["#808080", "#E0D8CC"];
  return (
    <Sequence from={i * SEC} durationInFrames={SEC} name="grain calibration">
      <AbsoluteFill style={{ background: "#000" }}>
        {tones.map((t, r) =>
          cases.map((c, k) => (
            <div
              key={`${r}${k}`}
              style={{ position: "absolute", left: (k * width) / 4, top: (r * height) / 2, width: width / 4, height: height / 2, background: t, overflow: "hidden" }}
            >
              <Grain sigma={c.sigma} sizePx={c.size} rate={0} seed="cal" />
            </div>
          )),
        )}
      </AbsoluteFill>
    </Sequence>
  );
};

export const EffectsGallery: React.FC = () => {
  useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#222" }}>
      <Section i={0} style="paperDesk" kind="warm" label="warm — paperDesk finish" />
      <Section i={1} style="paperDesk" kind="grid" label="grid — paperDesk finish" />
      <Section i={2} style="paperDesk" kind="desk" label="desk — paperDesk finish" />
      <Section i={3} style="voxExplainer" kind="dots" ink="#464247" label="dots — voxExplainer finish" />
      <Section i={4} style="voxExplainer" kind="board" ink="#CFCFCF" label="board — voxExplainer finish" />
      <Section i={5} style="darkCollage" kind="blackCard" ink="#D3D2CC" label="blackCard — darkCollage finish" />
      <Section i={6} style="voxEditorial" kind="crumpled" ink="#33332F" label="crumpled — voxEditorial finish (pulse)" />
      <Split i={7} />
      <Standalone i={8} />
      <Calibration i={9} />
    </AbsoluteFill>
  );
};
