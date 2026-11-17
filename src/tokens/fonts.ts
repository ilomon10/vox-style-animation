/**
 * Font families (Google Fonts, OFL/Apache) chosen by side-by-side comparison against the
 * reference frames (analysis/assets-and-fonts.md, analysis/stills/G/fontcmp_*.jpg).
 *
 * Every loadFont() call lists weights + subsets explicitly: loading whole families can time
 * out renders, and Remotion v5 makes both arguments mandatory.
 *
 * Commercial originals (license them and load with @remotion/fonts if you want the real thing):
 *   paper desk → Adobe Caslon Pro / Big Caslon, Didot      (our ID)
 *   Vox        → Balto (Type Supply, not for sale), Harriet Display (Okay Type)  (confirmed by Vox)
 */
import { loadFont as loadAlfaSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadSourceSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadAlmendra } from "@remotion/google-fonts/Almendra";
import { loadFont as loadGelasio } from "@remotion/google-fonts/Gelasio";
import { loadFont as loadGochi } from "@remotion/google-fonts/GochiHand";
import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglish";
import { loadFont as loadBaskerville } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadCaslonDisplay } from "@remotion/google-fonts/LibreCaslonDisplay";
import { loadFont as loadCaslon } from "@remotion/google-fonts/LibreCaslonText";
import { loadFont as loadFranklin } from "@remotion/google-fonts/LibreFranklin";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadTinos } from "@remotion/google-fonts/Tinos";
import { loadFont as loadFraktur } from "@remotion/google-fonts/UnifrakturCook";

const latin = { subsets: ["latin"] as ["latin"] };

// ── paper desk (Porsche) ───────────────────────────────────────────────────────────
/** Years, titles, subtitles, charts, quotes (italic). Lining figures only. */
export const CASLON = loadCaslon("normal", { weights: ["400", "700"], ...latin }).fontFamily;
loadCaslon("italic", { weights: ["400"], ...latin });
/** Big display years (> ~150 px). */
export const CASLON_DISPLAY = loadCaslonDisplay("normal", { weights: ["400"], ...latin }).fontFamily;
/** Georgia-compatible serif: ▶ captions (bold italic, old-style figures), quotes, callout labels,
 *  place labels ("STUTTGART"). Two analysts matched the captions to Georgia Bold Italic. */
export const GELASIO = loadGelasio("normal", { weights: ["400", "600", "700"], ...latin }).fontFamily;
loadGelasio("italic", { weights: ["400", "600", "700"], ...latin });
/** Didone desk slips ("356", "911"), date numerals, editorial title. */
export const PLAYFAIR = loadPlayfair("normal", { weights: ["400", "700", "800", "900"], ...latin }).fontFamily;
loadPlayfair("italic", { weights: ["600", "700", "900"], ...latin });

// ── Vox explainer (epigenetics / highlight) ────────────────────────────────────────
/** Display serif for titles and flag labels (stand-in for Harriet Display). */
export const VOX_SERIF = loadBaskerville("normal", { weights: ["700"], ...latin }).fontFamily;
/** Heavy grotesque for annotations / concept labels (stand-in for Balto). */
export const VOX_SANS = loadFranklin("normal", { weights: ["600", "700", "800"], ...latin }).fontFamily;
/** All-caps felt-tip handwriting on tape labels. */
export const MARKER = loadGochi("normal", { weights: ["400"], ...latin }).fontFamily;
/** Chisel marker on sticky notes ("EPI", "Age?"). */
export const MARKER_THICK = loadMarker("normal", { weights: ["400"], ...latin }).fontFamily;

// ── Vox Earworm (dark collage + sound) ─────────────────────────────────────────────
/** ONE condensed grotesque carries every role (Trade Gothic Bold Cond. / Knockout / Alternate Gothic ≈). */
export const CONDENSED = loadOswald("normal", { weights: ["300", "400", "500", "600", "700"], ...latin }).fontFamily;
/** ultra-condensed display for giant / full-bleed kinetic words ("WHUR", "YES") */
export const DISPLAY_CONDENSED = loadAnton("normal", { weights: ["400"], ...latin }).fontFamily;
/** transitional text serif — name-card titles and affiliations only (Tiempos Text / Publico ≈) */
export const TEXT_SERIF = loadSourceSerif("normal", { weights: ["400", "600", "700"], ...latin }).fontFamily;
loadSourceSerif("italic", { weights: ["400"], ...latin });
/** small neo-grotesque for "now playing" credits and source tags (Graphik / Balto ≈) */
export const SMALL_SANS = loadInter("normal", { weights: ["500", "600"], ...latin }).fontFamily;
/** extended heavy grotesque for a series card (Druk Wide / Monument Extended ≈) — never copy a real logo */
export const EXTENDED = loadArchivo("normal", { weights: ["800", "900"], ...latin }).fontFamily;

// ── YouTube Shorts (Vox Shorts captions / hook / labels) ──────────────────────────
/** Shorts captions (500), hook and name label (900) — measured as Roboto in analysis/vox-shorts.md. */
export const ROBOTO = loadRoboto("normal", { weights: ["500", "700", "900"], ...latin }).fontFamily;

// ── dark collage (Dracula) ─────────────────────────────────────────────────────────
/** Black slab display ("XV"). */
export const SLAB = loadAlfaSlab("normal", { weights: ["400"], ...latin }).fontFamily;
/** Distressed typewriter ("century"). */
export const TYPEWRITER = loadElite("normal", { weights: ["400"], ...latin }).fontFamily;
/** Old book / page text ("1897", synthetic pages). */
export const OLD_BOOK = loadFell("normal", { weights: ["400"], ...latin }).fontFamily;
loadFell("italic", { weights: ["400"], ...latin });
/** Spooky end title (closest free match; use scaleX(.82)). */
export const SPOOKY = loadAlmendra("normal", { weights: ["700"], ...latin }).fontFamily;

// ── shared print matter ────────────────────────────────────────────────────────────
/** Newspaper headline + body (Times metrics). */
export const NEWS = loadTinos("normal", { weights: ["400", "700"], ...latin }).fontFamily;
/** Blackletter masthead. */
export const MASTHEAD = loadFraktur("normal", { weights: ["700"], ...latin }).fontFamily;

export const FONTS = {
  CASLON,
  CASLON_DISPLAY,
  GELASIO,
  PLAYFAIR,
  VOX_SERIF,
  VOX_SANS,
  MARKER,
  MARKER_THICK,
  SLAB,
  TYPEWRITER,
  OLD_BOOK,
  SPOOKY,
  NEWS,
  MASTHEAD,
  CONDENSED,
  DISPLAY_CONDENSED,
  TEXT_SERIF,
  SMALL_SANS,
  EXTENDED,
} as const;
export type FontKey = keyof typeof FONTS;
