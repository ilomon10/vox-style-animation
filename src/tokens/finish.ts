/**
 * "Finish" = everything applied to the composited frame: colour fringing, grain, weave,
 * vignette, levels, dust, flicker. This is what makes flat vector/photo collage read as
 * "printed, photographed, filmed". Values are measured (analysis/quantitative.md and the
 * per-video reports; docs/style-guide/05-textures-materials.md). px = design px @1080p.
 */
export type RgbSplit =
  /** constant translation of the R and B channels (paper desk: red down-right, blue up-left) */
  | { mode: "uniform"; red: readonly [number, number]; blue: readonly [number, number] }
  /** lateral, lens-like: R and B scaled about the frame centre (Vox explainer) */
  | { mode: "radial"; redScale: number; blueScale: number };

export type FinishPreset = {
  rgbSplit?: RgbSplit;
  grain?: {
    /** target temporal/spatial std-dev of the added luma noise, in 8-bit levels (measured) */
    sigma: number;
    /** grain particle size in design px (≈2× the measured autocorrelation half-width) */
    sizePx: number;
    /** re-seeds per second; 0 = static grain that only moves with the weave */
    rate: number;
    /** grain sits above the RGB split, so it carries no colour fringes */
    afterSplit: boolean;
  };
  /** whole-frame translation noise: film weave (every frame) or "hold boil" (a few per second) */
  jitter?: {
    sigmaPx: number;
    clampPx: number;
    /** changes per second; "frame" = every frame */
    rate: number | "frame";
    /** overscale so the frame edge never shows */
    overscan: number;
  };
  /** multiply vignette: L × (1 − strength · r^power), r = distance / half-diagonal */
  vignette?: { strength: number; power: number };
  /** output levels: black lifted to `black`, white capped at `white`. NOT used by the presets:
   *  every colour token is a measured FINAL colour, so a global levels pass would grade them
   *  twice. Imagery is graded per element with PHOTO_GRADE instead. Use only for raw footage. */
  levels?: { black: string; white: string };
  /** film dust / hair / scratch overlay sequence */
  dust?: { opacity: number; drawings: number; rate: number; variant?: "bright" | "mixed" };
  /** paper exposure pulse: every `periodSec` the paper layer brightens (centre/corner gain) */
  pulse?: { periodSec: number; gainCenter: number; gainCorner: number };
  /** optional 4:3 picture inside 16:9 with flat bars (the epigenetics excerpt) */
  pillarbox?: { aspect: number; color: string };
};

export const FINISH = {
  /** Porsche: uniform diagonal RGB split (R down-right, B up-left, ≈1–2 px; per layer in the
   *  original), NO animated grain (held frames are bit-identical; paper specks are static), a 6 fps
   *  0.4–1.1 px "boil" jitter of the artwork, warm circular vignette (heavy shots: strength 0.32).
   *  Graphics blacks are authored as warm near-blacks; footage keeps true black → no global levels. */
  paperDesk: {
    rgbSplit: { mode: "uniform", red: [1.5, 1.5], blue: [-1.2, -1.2] },
    jitter: { sigmaPx: 0.5, clampPx: 1.1, rate: 6, overscan: 1.003 },
    vignette: { strength: 0.18, power: 1.8 },
  },
  /** Dracula: no CA, STATIC grain riding a per-frame film weave (σ 1.3 px), dust loop on twos,
   *  no vignette overlay (the scratched plates have lighter worn edges instead). */
  darkCollage: {
    // σ 5: measured temporal 3.3 / spatial high-pass 4.6 levels; the proof shot needed 4.3–4.7 measured σ
    // to match the reference (our procedural plate carries less inherent grain than the scanned one)
    grain: { sigma: 5, sizePx: 1.7, rate: 0, afterSplit: false },
    jitter: { sigmaPx: 1.3, clampPx: 3, rate: "frame", overscan: 1.006 },
    dust: { opacity: 0.85, drawings: 12, rate: 12, variant: "bright" },
  },
  /** Vox explainer: radial lateral CA, fine mono grain re-seeded every drawing, lifted matte
   *  levels, (almost) no vignette. Optional 4:3 pillarbox. */
  voxExplainer: {
    rgbSplit: { mode: "radial", redScale: 1.0021, blueScale: 0.9958 },
    grain: { sigma: 2.7, sizePx: 1.3, rate: 12, afterSplit: true },
    vignette: { strength: 0.04, power: 2.2 },
  },
  /** Vox Earworm: no CA, blacks NOT lifted (p1 luma 5), mono grain re-seeded per drawing; the
   *  ground layer weaves on its own (handled by Paper, not by the finish). */
  voxEarworm: {
    grain: { sigma: 3, sizePx: 1.5, rate: 12, afterSplit: true },
  },
  /** "The Highlight by Vox": static crumpled paper, no grain/CA, circular vignette,
   *  1-in-3 paper exposure pulse, very compressed warm matte range. */
  /** Vox light paper (EL, CR, CE): static paper, no grain, weave, CA or vignette; holds are pixel-still. */
  voxLight: {},
  voxEditorial: {
    vignette: { strength: 0.15, power: 1.4 },
    pulse: { periodSec: 0.3, gainCenter: 0.011, gainCorner: 0.021 },
  },
} as const satisfies Record<string, FinishPreset>;

/**
 * Per-image grade (CSS filter) for photos, engravings and footage, by style. Tokens are final
 * colours, so only imagery gets graded. Measured targets: paper desk B/W archival warm-tinted
 * (mids ≈#98948F, R−B ≈+10); dark collage fully desaturated, blacks ≈L 12–24, whites ≤ L 216;
 * Vox natural; editorial B/W multiplied onto the paper (R−B +14).
 */
export const PHOTO_GRADE = {
  paperDesk: { bw: "grayscale(1) sepia(0.18) contrast(1.05)", color: "saturate(0.85) sepia(0.08)" },
  darkCollage: { bw: "grayscale(1) contrast(1.2) brightness(0.92)", color: "grayscale(1) contrast(1.2) brightness(0.92)" },
  voxExplainer: { bw: "grayscale(1)", color: "none" },
  voxLight: { bw: "grayscale(1)", color: "none" },
  voxEditorial: { bw: "grayscale(1) sepia(0.15)", color: "grayscale(1) sepia(0.15)" },
  /** archive is fully desaturated (sat 0.01–0.05); only interview footage keeps colour */
  voxEarworm: { bw: "grayscale(1) contrast(1.1)", color: "saturate(0.9)" },
} as const;

/** Desk-flyover scenes in the paper-desk style use a stronger split. */
export const DESK_SPLIT: RgbSplit = { mode: "uniform", red: [3.3, 4.1], blue: [-3.2, -4.0] };

/** Shadows (measured). Collage cut-outs have NONE — use flat offset echoes instead. */
export const SHADOWS = {
  /** paper desk: white-bordered photo on the desk (joint fit, light from top-left) */
  photoOnDesk: "drop-shadow(10px 8px 13px rgba(0, 0, 0, 0.43))",
  /** paper desk: stack of cards — exponential ambient falloff, half-decay 37 px */
  cardStackAO: "drop-shadow(0px 0px 37px rgba(0, 0, 0, 0.45))",
  /** Vox: flat print lying on the desk (contact) */
  printContact: "drop-shadow(3px 4px 6px rgba(0, 0, 0, 0.45))",
  /** Vox: lifted print / prop */
  printLifted: "drop-shadow(4px 10px 14px rgba(0, 0, 0, 0.55))",
  /** Vox: props (tubes, pens, magnifier) */
  prop: "drop-shadow(10px 15px 20px rgba(0, 0, 0, 0.4))",
  /** end-card box (paper desk) */
  softAround: "drop-shadow(4px 5px 10px rgba(0, 0, 0, 0.38))",
  /** Vox sticky note lying on the desk */
  stickyNote: "drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.28))",
  /** opaque tape's own faint shadow (paper desk) */
  tapeOpaque: "drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.22))",
} as const;
