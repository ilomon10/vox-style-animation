import React from "react";
import { useCurrentFrame } from "remotion";
import { useDrawingFrame, useFrames } from "../lib/time";
import { ease } from "../tokens/easing";
import { TEXT_SERIF, VOX_SANS } from "../tokens/fonts";
import { CAP_RATIO } from "../tokens/type";
import { packaging } from "../tokens/colors";
import { capTrim, prog } from "../type/shared";

// New colour values, to move into src/tokens/colors.ts (analysis/vox-framework-coverage.md §6.2 build 2).
/** credits panel ground (HC #292929; the measured pixel is #292929 / 41) */
export const CREDITS_PANEL = packaging.creditsPanel;
/** role lines (HC) */
export const CREDITS_ROLE = packaging.creditsRole;
/** name lines: light blue (HC #AFD2D8, CE #AED5DE, CR #B0D3DB) */
export const CREDITS_NAME = packaging.creditsName;
/** rule end dots (HC #F9FF0E) */
export const CREDITS_DOT = packaging.creditsDot;

export type CreditsEntry = { role: string; names: string[]; /** a thin grey rule above this block (HC "Executive Producer") */ ruleAbove?: boolean };

export type CreditsPanelProps = {
  /** 1-3 pages of role blocks */
  pages: CreditsEntry[][];
  /** frames each page stays (default 5.5 s is the caller's job) */
  pageFrames: number;
  /** frame the rule starts (sequence-relative) */
  delay?: number;
};

// Measured on analysis/stills/vox_healthcare/20m32s_endcard-credits-p1.jpg (1920x1080): panel to x 697, rule centre x 694.5 (4 px),
// roles/names right-aligned at x 646, first role baseline y 92, name pitch 35, block gap 59, caps 22 / 23.
const PANEL_W = 696;
const RULE_X = 694.5;
const RULE_W = 4;
const DOT = 17;
const TEXT_RIGHT = 646;
const FIRST_BASE = 92;
const PITCH = 35;
const GAP = 59;
const ROLE_CAP = 22;
const NAME_CAP = 23;
const RULE_HALF = 500; // dot centres at y 40 / 1040 (measured 31-1048 with the dots, 93-94 % H)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Credits panel of the end card: a dark panel on the left 36 % of the frame, a white vertical rule that grows from a centre dot to
 * 93 % H with lemon dots at its ends (24 f @24, ease in-out), and role / name blocks right-aligned against it. Pages swap by
 * fade-out 7 f, one empty frame, fade-in 6 f (on ones); the rule stays. Must sit inside <DesignSpace>.
 * analysis/vox-framework-coverage.md §6.2 build 2 (HC 20:28-20:38).
 */
export const CreditsPanel: React.FC<CreditsPanelProps> = ({ pages, pageFrames, delay = 0 }) => {
  const f24 = useFrames();
  const fd = useDrawingFrame() - delay; // rule on twos
  const raw = useCurrentFrame() - delay; // page fades on ones
  const p = ease("labelWipe")(prog(fd, 0, f24(24)));
  const half = DOT / 2 + (RULE_HALF - DOT / 2) * p;
  const cy = 540;

  const pageIdx = Math.min(pages.length - 1, Math.max(0, Math.floor(raw / pageFrames)));
  const t = raw - pageIdx * pageFrames; // frames into this page
  const fadeIn = f24(6);
  const fadeOut = f24(7);
  const inStart = pageIdx === 0 ? f24(6) : f24(1); // one empty frame after the previous page
  const last = pageIdx === pages.length - 1;
  const opacity = clamp01((t - inStart) / fadeIn) * (last ? 1 : 1 - clamp01((t - (pageFrames - fadeOut)) / fadeOut));

  const rows: React.ReactNode[] = [];
  let base = FIRST_BASE;
  (pages[pageIdx] ?? []).forEach((e, bi) => {
    if (bi > 0) base += GAP; // last name baseline -> next role baseline
    if (e.ruleAbove) rows.push(<div key={`r${bi}`} style={{ position: "absolute", left: 282, width: TEXT_RIGHT - 282, top: base - ROLE_CAP - 20, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #292929, #777 40%, #777)" }} />);
    rows.push(
      <div key={`${bi}-role`} style={{ position: "absolute", right: 1920 - TEXT_RIGHT, top: base - ROLE_CAP, whiteSpace: "pre", textAlign: "right", ...capTrim, fontFamily: TEXT_SERIF, fontSize: ROLE_CAP / CAP_RATIO.TEXT_SERIF, fontWeight: 400, lineHeight: 1, color: CREDITS_ROLE }}>{e.role}</div>,
    );
    e.names.forEach((n, ni) => {
      base += PITCH;
      rows.push(
        <div key={`${bi}-${ni}`} style={{ position: "absolute", right: 1920 - TEXT_RIGHT, top: base - NAME_CAP, whiteSpace: "pre", textAlign: "right", ...capTrim, fontFamily: VOX_SANS, fontSize: NAME_CAP / CAP_RATIO.VOX_SANS, fontWeight: 700, lineHeight: 1, color: CREDITS_NAME, textTransform: "uppercase" }}>{n}</div>,
      );
    });
  });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: PANEL_W, height: 1080, background: CREDITS_PANEL }} />
      {raw >= 0 && (
        <>
          <div style={{ position: "absolute", left: RULE_X - RULE_W / 2, top: cy - half, width: RULE_W, height: half * 2, background: "#FFFFFF" }} />
          <div style={{ position: "absolute", left: RULE_X - DOT / 2, top: cy - half - DOT / 2, width: DOT, height: DOT, borderRadius: DOT / 2, background: CREDITS_DOT }} />
          <div style={{ position: "absolute", left: RULE_X - DOT / 2, top: cy + half - DOT / 2, width: DOT, height: DOT, borderRadius: DOT / 2, background: CREDITS_DOT }} />
        </>
      )}
      <div style={{ position: "absolute", inset: 0, opacity }}>{rows}</div>
    </div>
  );
};
