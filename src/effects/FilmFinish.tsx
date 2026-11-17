import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { useStage } from "../lib/stage";
import { type FinishPreset } from "../tokens/finish";
import { useTheme } from "../tokens/theme";
import { DustLoop } from "./DustLoop";
import { FinishFilter, maxSplitShiftPx } from "./filters";
import { Grain } from "./Grain";
import { Jitter } from "./Jitter";
import { Pillarbox } from "./Pillarbox";
import { FinishLevelsContext, hexToRgb } from "./shared";
import { Vignette } from "./Vignette";

export type FilmFinishProps = {
  /** the scene — usually <DesignSpace>…</DesignSpace> */
  children: React.ReactNode;
  /** a complete preset; default = useTheme().finish */
  preset?: FinishPreset;
  /** per-key overrides merged over the preset (`null` removes a layer, e.g. { grain: null }) */
  overrides?: { [K in keyof FinishPreset]?: FinishPreset[K] | null };
  /** false renders the bare scene (for before/after comparisons) */
  enabled?: boolean;
  /** dust flavour; "auto" = bright specks + scratches for dark looks (black point < 25), else mixed */
  dustVariant?: "auto" | "bright" | "mixed";
  /** seed namespace for grain / weave (default "finish") */
  seed?: string;
};

/**
 * Applies a FinishPreset to a scene. Layer order, back → front (measured pipeline, quantitative.md §3–§8b):
 *   jitter wrapper { scene → ONE svg filter [RGB split → levels]  ;  static grain (rate 0) rides the weave }
 *   → per-drawing grain (afterSplit, no fringes) → dust → vignette → pillarbox
 * Place it OUTSIDE <DesignSpace>; everything here works in output px (× useStage().u).
 * Grain is always drawn above the filter (no fringes); `afterSplit` is therefore implied. Static grain
 * (rate 0) sits inside the jitter wrapper so it rides the weave; re-seeding grain sits outside it.
 */
export const FilmFinish: React.FC<FilmFinishProps> = ({
  children,
  preset,
  overrides,
  enabled = true,
  dustVariant = "auto",
  seed = "finish",
}) => {
  const theme = useTheme();
  const { width, height, u } = useStage();
  const id = "ff" + useId().replace(/[^a-zA-Z0-9]/g, "");
  if (!enabled) {
    return (
      <FinishLevelsContext.Provider value={undefined}>
        <AbsoluteFill>{children}</AbsoluteFill>
      </FinishLevelsContext.Provider>
    );
  }

  const merged: Record<string, unknown> = { ...(preset ?? theme.finish) };
  for (const [k, v] of Object.entries(overrides ?? {})) {
    if (v === null) delete merged[k];
    else if (v !== undefined) merged[k] = v;
  }
  const p = merged as FinishPreset;

  const needsFilter = !!(p.rgbSplit || p.levels);
  // keep split fringes / weave off the frame edge
  const splitOverscan = 1 + (2 * (maxSplitShiftPx(p.rgbSplit, u, width) + 1)) / width;
  const overscan = Math.max(p.jitter?.overscan ?? 1, splitOverscan);
  const staticGrain = p.grain && p.grain.rate === 0;
  const dynamicGrain = p.grain && p.grain.rate > 0;
  // preset.dust.variant wins; "auto" falls back to bright dust on dark looks (black point < 25)
  const variant =
    dustVariant !== "auto"
      ? dustVariant
      : (p.dust?.variant ?? (p.levels && hexToRgb(p.levels.black)[1] < 25 ? "bright" : "mixed"));

  const scene = needsFilter ? (
    <AbsoluteFill style={{ filter: `url(#${id})` }}>
      <FinishFilter id={id} width={width} height={height} u={u} split={p.rgbSplit} levels={p.levels} />
      {children}
    </AbsoluteFill>
  ) : (
    <AbsoluteFill>{children}</AbsoluteFill>
  );

  const inner = (
    <>
      {scene}
      {staticGrain && p.grain && <Grain {...p.grain} seed={`${seed}-grain`} />}
    </>
  );

  return (
    <FinishLevelsContext.Provider value={p.levels}>
    <AbsoluteFill style={{ isolation: "isolate", background: "#000" }}>
      {p.jitter ? (
        <Jitter {...p.jitter} overscan={overscan} seed={`${seed}-weave`}>
          {inner}
        </Jitter>
      ) : (
        <AbsoluteFill style={{ transform: overscan > 1 ? `scale(${overscan})` : undefined }}>{inner}</AbsoluteFill>
      )}
      {dynamicGrain && p.grain && <Grain {...p.grain} seed={`${seed}-grain`} />}
      {p.dust && <DustLoop opacity={p.dust.opacity} drawings={p.dust.drawings} rate={p.dust.rate} variant={variant} />}
      {p.vignette && <Vignette {...p.vignette} />}
      {p.pillarbox && <Pillarbox {...p.pillarbox} />}
    </AbsoluteFill>
    </FinishLevelsContext.Provider>
  );
};

