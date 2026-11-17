import React, { useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { hashSeed } from "../lib/random";
import type { FinishPreset } from "../tokens/finish";
import { useTheme, type PaperKind } from "../tokens/theme";
import { FinishLevelsContext, hexToRgb, invertLevels, powerStops, tex, usePreload } from "./shared";

export type PaperProps = {
  /** material; default useTheme().paper */
  kind?: PaperKind;
  /** override the base colour (texture is multiplied over it, keeping its relief) */
  color?: string;
  /** size in design px (paper may be larger than the frame: it lives inside the camera/world) */
  width?: number;
  height?: number;
  /** offsets the (seamless) texture so two sheets never show the same pattern */
  seed?: string;
  /** editorial exposure pulse, default theme.finish.pulse. Paper only — put ink above it. */
  pulse?: FinishPreset["pulse"] | false;
  /**
   * Colours in the style guide are the measured FINAL colours. Inside a <FilmFinish> with `levels`, the paper
   * is pre-compensated (inverse levels) so it still lands on its measured colour; set false to author
   * the paper colour pre-grade. Default true.
   */
  compensate?: boolean;
  /** blackCard: lighter worn edges/corners (screen white at the corners, +18…+37 L on L≈24); default true */
  edgeWear?: boolean;
  style?: React.CSSProperties;
};

/** a paper tile (3072 px) is shown at 1536 design px → 2 texture px per design px, sharp at 4K */
const TILE_DESIGN = 1536;

type Spec = { file: string; color: string; meanLum: number };
const SPEC: Record<PaperKind, Spec> = {
  warm: { file: "paper_warm.jpg", color: "#E4DDD2", meanLum: 0.87 },
  grid: { file: "paper_warm.jpg", color: "#E4DDD2", meanLum: 0.87 },
  desk: { file: "paper_desk.jpg", color: "#EFE3DA", meanLum: 0.9 },
  dots: { file: "paper_cool.jpg", color: "#D6D3D3", meanLum: 0.84 },
  board: { file: "paper_black.jpg", color: "#1F1D20", meanLum: 0.09 },
  blackCard: { file: "paper_black.jpg", color: "#171616", meanLum: 0.09 },
  light: { file: "paper_cool.jpg", color: "#EAEAEA", meanLum: 0.84 }, // flat, texture layer skipped
  lightGrid: { file: "paper_cool.jpg", color: "#EAEAEA", meanLum: 0.84 },
  lightGhost: { file: "paper_cool.jpg", color: "#E9E9E9", meanLum: 0.84 },
  crumpled: { file: "paper_crumpled.jpg", color: "#C9C0B5", meanLum: 0.74 }, // pre-vignette; reads #BCB5A9 mid-frame (highlight@1.2)
};

// Porsche S110 grid paper: pitch 23 px@720 → 35 px, lines rgba(90,80,70,.12) (porsche-part3-stills.md §6)
const GRID = "rgba(90,80,70,0.12)";

const wear = (a: number) => `rgba(255,255,255,${a})`;

export const Paper: React.FC<PaperProps> = ({
  kind: kindProp,
  color,
  width = 1920,
  height = 1080,
  seed = "paper",
  pulse: pulseProp,
  edgeWear = true,
  compensate = true,
  style,
}) => {
  const theme = useTheme();
  const kind = kindProp ?? theme.paper;
  const spec = SPEC[kind];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  usePreload([tex(spec.file)]);
  const pulse = pulseProp === undefined ? theme.finish.pulse : pulseProp || undefined;

  const ox = hashSeed(`${seed}-x`) % TILE_DESIGN;
  const oy = hashSeed(`${seed}-y`) % TILE_DESIGN;
  const texLayer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${tex(spec.file)})`,
    backgroundSize: `${TILE_DESIGN}px ${TILE_DESIGN}px`,
    backgroundPosition: `${-ox}px ${-oy}px`,
  };

  // `color` override: flat colour × texture normalised by its mean luminance (keeps relief, shifts tone)
  const levels = useContext(FinishLevelsContext);
  const finalColor = color ?? spec.color;
  const paperColor = compensate && levels ? invertLevels(finalColor, levels) : finalColor;
  const tinted = color !== undefined || (compensate && !!levels);
  const [cr, cg, cb] = hexToRgb(paperColor);

  const layers: React.ReactNode[] = [];
  if (kind === "board") {
    // #1F1D20 + 45° mesh: dots on a 14 px square lattice with a second lattice at (7, 7) → diagonal pitch ≈ 10 px
    // (analysis/epigenetics.md §6: pitch ≈ 10, white 6–8 %); σ ≈ 8.6 comes from this mesh
    const dot = "radial-gradient(circle, rgba(255,255,255,0.07) 1.6px, rgba(255,255,255,0) 2.3px)";
    layers.push(
      <div
        key="mesh"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `${dot}, ${dot}`,
          backgroundSize: "14px 14px, 14px 14px",
          backgroundPosition: "0 0, 7px 7px",
        }}
      />,
    );
  } else if (kind !== "light" && kind !== "lightGrid" && kind !== "lightGhost") {
    layers.push(
      <div
        key="tex"
        style={{
          ...texLayer,
          mixBlendMode: tinted ? "multiply" : undefined,
          filter: tinted ? `brightness(${1 / spec.meanLum})` : undefined,
        }}
      />,
    );
  }
  if (kind === "grid") {
    layers.push(
      <div
        key="grid"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, ${GRID} 1px, transparent 1px), linear-gradient(to bottom, ${GRID} 1px, transparent 1px)`,
          backgroundSize: "35px 35px",
        }}
      />,
    );
  }
  if (kind === "lightGrid") {
    layers.push(
      <div
        key="lgrid"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(38,38,38,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(38,38,38,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />,
    );
  }
  if (kind === "lightGhost") {
    // ghost newsprint: two columns of text-line bars at ≈ 5 % contrast (EL, analysis/vox-framework-coverage.md §2.4)
    layers.push(
      <div
        key="ghost"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(to bottom, rgba(38,38,38,0.05) 0px, rgba(38,38,38,0.05) 11px, transparent 11px, transparent 40px)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0 5%, #000 5% 47%, transparent 47% 53%, #000 53% 95%, transparent 95%)",
          maskImage: "linear-gradient(to right, transparent 0 5%, #000 5% 47%, transparent 47% 53%, #000 53% 95%, transparent 95%)",
          backgroundPositionY: `${hashSeed(`${seed}-g`) % 40}px`,
        }}
      />,
    );
  }
  if (kind === "dots") {
    // Vox desk paper: pitch 32 px, r ≈ 2.3, #4A4A4A at ≈35 % multiply at the core; softened (video-measured Δluma −15…−25) → 22 % with a soft edge
    layers.push(
      <div
        key="dots"
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "multiply",
          backgroundImage: "radial-gradient(circle, rgba(74,74,74,0.22) 1.7px, rgba(74,74,74,0) 3px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "16px 16px",
        }}
      />,
    );
  }
  if (kind === "blackCard" && edgeWear) {
    // dark collage: worn edges are LIGHTER (+18…+37 L): screen white 12 % at the corners, r^2.2 falloff from the centre
    const R = Math.hypot(width, height) / 2;
    layers.push(
      <div
        key="wear"
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "screen",
          background: `radial-gradient(circle ${R}px at 50% 50%, ${powerStops(0.12, 2.2, wear)})`,
        }}
      />,
    );
  }
  if (pulse) {
    // 3.33 Hz pulse on a 10 Hz grid: one bright step in three (highlight.md §6). plus-lighter adds α·255 levels
    // on paper of L ≈ 195: gain 1.1 % → +2.1 levels (centre), 2.1 % → +4.1 (corners)
    const step = Math.floor((frame * 3) / (pulse.periodSec * fps) + 1e-9);
    if (step % 3 === 0) {
      const R = Math.hypot(width, height) / 2;
      const a0 = pulse.gainCenter * 0.76;
      const a1 = pulse.gainCorner * 0.76;
      layers.push(
        <div
          key="pulse"
          style={{
            position: "absolute",
            inset: 0,
            mixBlendMode: "plus-lighter",
            background: `radial-gradient(circle ${R}px at 50% 50%, ${wear(a0)} 0%, ${wear(a1)} 100%)`,
          }}
        />,
      );
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        isolation: "isolate",
        backgroundColor: `rgb(${cr},${cg},${cb})`,
        ...style,
      }}
    >
      {layers}
    </div>
  );
};
