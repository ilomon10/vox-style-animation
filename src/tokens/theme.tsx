import React, { createContext, useContext } from "react";
import { DrawingRate } from "../lib/time";
import { darkCollage, paperDesk, voxEarworm, voxEditorial, voxExplainer, voxLight } from "./colors";
import { FINISH, type FinishPreset } from "./finish";
import { collageType, earwormType, editorialType, paperDeskType, voxLightType, voxType, type TypeRole } from "./type";

/**
 * A Theme bundles everything a component needs to render "in style": palette, type roles,
 * finish preset, recommended fps and the background material. Components read it with
 * useTheme() and take props only for what differs from the style default.
 */
export type StyleName = "paperDesk" | "darkCollage" | "voxExplainer" | "voxEditorial" | "voxEarworm" | "voxLight";

export type PaperKind =
  | "warm" // cream scrapbook paper (paper desk)
  | "grid" // cream paper with a 35 px grid (paper desk quote/product cards)
  | "desk" // desk surface (paper desk flyover)
  | "dots" // dotted notebook paper (Vox)
  | "board" // dark textured board with a fine dot mesh (Vox)
  | "blackCard" // scratched black card with lighter worn edges (dark collage)
  | "crumpled" // warm grey crumpled sheet (Vox editorial)
  | "light" // flat light grey paper (Vox light look)
  | "lightGrid" // light grey with a faint grid (CR, CE)
  | "lightGhost"; // light grey with ghost newsprint at 5 % contrast (EL)

export type Theme = {
  name: StyleName;
  label: string;
  /** recommended delivery frame rate */
  fps: number;
  /** graphics drawings per second (12 in every reference) */
  drawingRate: number;
  colors: Record<string, string>;
  type: Record<string, TypeRole>;
  finish: FinishPreset;
  paper: PaperKind;
  /** the one accent colour of the style */
  accent: string;
};

export const THEMES: Record<StyleName, Theme> = {
  paperDesk: {
    name: "paperDesk",
    label: "Paper desk scrapbook",
    fps: 30,
    drawingRate: 12,
    colors: paperDesk,
    type: paperDeskType,
    finish: FINISH.paperDesk,
    paper: "warm",
    accent: paperDesk.highlight,
  },
  darkCollage: {
    name: "darkCollage",
    label: "Dark cut-out collage",
    fps: 24,
    drawingRate: 12,
    colors: darkCollage,
    type: collageType,
    finish: FINISH.darkCollage,
    paper: "blackCard",
    accent: darkCollage.crimsonEcho,
  },
  voxExplainer: {
    name: "voxExplainer",
    label: "Vox explainer desk",
    fps: 24,
    drawingRate: 12,
    colors: voxExplainer,
    type: voxType,
    finish: FINISH.voxExplainer,
    paper: "dots",
    accent: voxExplainer.sticky,
  },
  voxEditorial: {
    name: "voxEditorial",
    label: "Vox editorial (The Highlight)",
    fps: 24,
    // the editorial intro moves on ones (no stepping) with long holds
    drawingRate: 24,
    colors: voxEditorial,
    type: editorialType,
    finish: FINISH.voxEditorial,
    paper: "crumpled",
    accent: voxEditorial.highlighter,
  },
  voxEarworm: {
    name: "voxEarworm",
    label: "Vox Earworm (dark collage, edited to sound)",
    fps: 25,
    drawingRate: 12,
    colors: voxEarworm,
    type: earwormType,
    finish: FINISH.voxEarworm,
    paper: "blackCard",
    accent: voxEarworm.accent,
  },
  voxLight: {
    name: "voxLight",
    label: "Vox light paper (Electoral College / Creatine / Clean energy)",
    fps: 24,
    // EL animates on ones (0.78–1.00 new-frame share); CR ≈ 15/s, CE 12/s — default to ones
    drawingRate: 24,
    colors: voxLight,
    type: voxLightType,
    finish: FINISH.voxLight,
    paper: "light",
    accent: voxLight.highlighter,
  },
};

const ThemeContext = createContext<Theme>(THEMES.voxExplainer);

export const useTheme = () => useContext(ThemeContext);

/** Wrap a composition (or a section of one) to set the style — also sets the drawing rate.
 *  Nest to mix styles. */
export const StyleProvider: React.FC<{ style: StyleName | Theme; children: React.ReactNode }> = ({ style, children }) => {
  const theme = typeof style === "string" ? THEMES[style] : style;
  return (
    <ThemeContext.Provider value={theme}>
      <DrawingRate rate={theme.drawingRate}>{children}</DrawingRate>
    </ThemeContext.Provider>
  );
};
