# Assets & fonts — typefaces, sourcing, cut-out pipeline, CC0 test pack

> Analyst: G. Sources: OCR sweep of 1,006 sampled frames (tesseract, `stills/G/ocr_text_moments.tsv`), native grabs `stills/G/<id>_f<frame>.png`, and side-by-side renders of 70+ Google Fonts against those crops (`stills/G/fontcmp_*.jpg`, made with `stills/G/font_compare.py`, Pillow + raqm so OpenType features such as `lnum` apply). Sizes are text-block heights normalised to 1080p ("@1080p"; Porsche and highlight are 720p sources, ×1.5). Web research and API probes ran on 2026-11-13. **Confirmed** = stated by Vox or the foundry. **ID** = our visual match. **Guess** = plausible but untested.

## 0. Quick picks

| Role (where it appears) | Free font (Remotion module) | Original or closest commercial font |
|---|---|---|
| Paper-desk years, titles, lower thirds, charts (Porsche) | **Libre Caslon Text** 400/700 (`LibreCaslonText`); **Libre Caslon Display** 400 above ~150 px | Adobe Caslon Pro; Big Caslon for display |
| Paper-desk quotes and *italic emphasis* | **Libre Caslon Text Italic** 400 | Adobe Caslon Pro Italic |
| Keyword and subtitle captions with a ▶ bullet (Porsche) | **Playfair Display Italic** 600–700 (`PlayfairDisplay`), old-style figures | Playfair is probably the original; Austin Italic or Didot italics are the commercial equivalents |
| Vox headline serif ("Genetics", "Training Data", "The Highlight") | **Libre Baskerville** 700; **Playfair Display** 800–900 for the black weight | **Harriet Display** (Okay Type), Vox.com's headline face (confirmed for the site) |
| Vox bold sans labels ("Sexual orientation", "Age?") | **Libre Franklin** 700–800 (`LibreFranklin`) | **Balto** (Type Supply, Tal Leming), Vox's video face (confirmed) |
| Marker caps on tape and sticky notes (Vox) | **Gochi Hand** (`GochiHand`); **Permanent Marker** for a heavier stroke | hand lettering |
| Typewriter labels ("XV", "century" — Dracula) | **Special Elite** (Apache-2.0, distressed); **Courier Prime** 700 (clean) | ITC American Typewriter, Courier |
| Fake newspaper headline and body | **Tinos** 400/700 (Apache-2.0, Times metrics); **Newsreader** 600–700 for a modern paper | Times New Roman |
| Blackletter masthead | **UnifrakturCook** 700 | Old English Text MT |
| 17th-century book page filler | **IM Fell English** / **IM Fell DW Pica** (type `ſ` for the long s) | Fell types, Caslon |
| "HAPPY HALLOWEEN" end card (Dracula) | no exact match: **Almendra** 700 at `scaleX(.82)`, or **MedievalSharp** | unknown |

## 1. Typeface identification by text style

### Paper-desk scrapbook (Porsche, 30 fps, 720p)

Evidence sheets: `fontcmp_porsche_caslon.jpg`, `_numerals.jpg`, `_italics.jpg`, `_caption_playfair.jpg`. The ink is never pure black: it measured about `#4b2b3a` in the quote and `#685d5d` on the soft-focus years, on paper `#d9d4ca`. The highlighter box is about `#e6de17`; on dark footage the captions are about `#d5ea1a`.

| # | Role and frames | Spec @1080p | ID (confidence) | Notes |
|---|---|---|---|---|
| P1 | Big centred year. "2024", "1900", "1907", "1945", "1948", "1969", "2023": f729–790 on paper, f940–1030 on a dark map, f2530, f5260 | lining figures, digits ≈112–140 px, centred; a yellow box sits behind the key year | **Libre Caslon Text 400** (medium). Tells: the 2 has a ball terminal, the 1 has a flag, vertical stress | On the dark map the digits are cream with an outer glow and sit on a timeline rule with a ring node |
| P2 | Model title on a yellow box ("Porsche 356", "Porsche Macan", "Boxster"), f1240, f4720 | cap ≈38–45 px; the box pads about 0.35 em; subline "The price at launch is $3,750" at about 0.55× | **Libre Caslon Text 400** (medium) | The subline is plain, with no box |
| P3 | Quote block, f1120–1210 and f5740–5870 | justified, wide word space, x-height ≈22 px; attribution "-Ferdinand Anton Ernst Porsche" right-aligned | **Libre Caslon Text Italic**; attribution in 700 roman (medium-high) | Letterforms match the italic in P4, whose round Caslon **v** in "revolution" is the decisive tell (Playfair's v is pointed). A B&W cut-out portrait with a yellow offset outline sits beside it |
| P4 | Sentence mixing roman and *italic*: "But the true *revolution* came in **1963**" (f1680–1760); lower third "one of the first *hybrid* vehicles" (f810–840) | 2 lines, cap ≈45 px | **Libre Caslon roman + italic** (high) | Highlighter on one token. In the 1963 shot the type has a letterpress distress texture on crumpled paper |
| P5 | Caption with a yellow ▶ bullet: keyword words "passion / speed / innovation / style / quality" (f190–320, white); subtitles "Porsche 911 had a top speed of around 210 km/h (130 mph)" (f1980), "…Panamera back in 2009" (f4660), "Range of up to 590 km…" (f5220, yellow) | x-height ≈30–35 px, bottom-centre over dimmed footage | **Playfair Display Italic 600–700** (medium-high). Tells: old-style "911/2009/590" (Playfair's default figures) and the spurred italic p | Keep Playfair's default old-style figures; do not set `lining-nums` here |
| P6 | Charts: "Porsche 356 units manufactured" (f1510–1590), "Porsche Global Sales Numbers" (f3940–4030) | title cap ≈25 px; axis figures ≈18 px | **Libre Caslon Text** (medium) | Yellow on a blueprint grid, or ink on paper with a tiny source line ("stuttcars.com") |
| P7 | Fake newspaper "Porsche 944: The Best-Selling Porsche of the Late 1980s" with "FEB 16, 1995", f3320–3420 | condensed bold news serif; justified body text | Times-style news serif (low) → **Newsreader 700** + **Tinos** body | Shot as a photographed page, with depth of field |
| P8 | Word roll in a CRT frame ("Prestige / **Legacy** / Velocity / Mastery"), f5540 | cap ≈45 px; outline box; yellow brush stroke | **Libre Caslon Text 700** (medium) | Non-active words fade to about 25% |
| P9 | Real print matter: brochure "Die elektrischen Automobile EGGER-LOHNER" (f860–920), the "Years Ahead in Engineering" ad and the 1950s–60s newspapers (f2250–2360) | — | these are scans, not live type | Use the `documents/` pack. To fake them, use Old Standard TT (19th-century modern face) or IM Fell |

### Vox explainer (epigenetics, 23.976 fps, 1080p, pillarboxed 4:3)

Paper is cool grey `#ded8d6` with a dot grid, ink `#4d494c`, sticky-note yellow `#f4da44`. Evidence: `fontcmp_vox_serif.jpg`, `_heavy_serif.jpg`, `_sans_balto.jpg`, `_handwriting.jpg`.

| # | Role and frames | Spec @1080p | ID (confidence) | Free match |
|---|---|---|---|---|
| V1 | Section title "Genetics" and "EPI\|Genetics", f88–200 | cap ≈80 px, centred, a hand-drawn underline swoosh | **Harriet Display Bold**. Inference from Vox's documented headline face (medium) | Libre Baskerville 700. Harriet is a Baskerville reimagining |
| V2 | Card title "Training Data", f768–848 | very heavy, high contrast | Harriet Display Black (guess) | Playfair Display 900 or Source Serif 4 900 |
| V3 | Bold sans labels: "Methyl group" (yellow on black), "Sexual orientation" (circled by hand), "Age?" (sticky note), "Epigenetic Predictor of Age" | cap ≈45–60 px, tight leading (1.0) | **Balto Bold**. Balto is Vox's confirmed video face; that these labels are Balto is our ID (high) | **Libre Franklin 700–800**. The single-storey g and the proportions match. Public Sans 800 also works |
| V4 | Marker caps on tape: "EPI", "DNA", "METHYLATED DNA", "HORVATH BRO", "SALIVA TEST", "AGE: 22", "THANK YOU!" | cap ≈30–40 px; black, with the second word often blue; ±3° tilt | hand lettering | **Gochi Hand** (very close, down to the lowercase-shaped M) |
| V5 | Journal page "Epigenetic Predictor of Age" with a highlighted phrase, f680–712 | — | screenshot of the PLOS ONE article (asset) | — |

The Vox "bug" (logo) sits top-right in the side bar. It is a trademark, so do not reproduce it.

### Highlight piece (10 fps, 720p) and dark collage (Dracula, 24 fps, 1080p)

| # | Role | ID → free match |
|---|---|---|
| H1 | "The Highlight BY Vox" wordmark (f33–54, ≈60 px cap) | heavy high-contrast serif (possibly Harriet Display). Use Playfair Display 900 or Gloock. The Vox logo is a trademark |
| H2 | Clipping: date tag "Oct 29,2018" in a crimson `#7d3e3c` box, bold headline (≈40 px cap), rule, blackletter masthead, ragged body column, amber highlighter `#c2973f` | Times New Roman Bold and Regular → **Tinos**. Old-English masthead → **UnifrakturCook 700** (`fontcmp_highlight_news.jpg`) |
| D1 | "XV" in crimson `#934042` (≈150 px cap, worn print texture) over a letterspaced "century" (+0.1 em), f240–280 | distressed typewriter slab → **Special Elite**. Courier Prime 700 if the type should be clean (`fontcmp_dracula_typewriter.jpg`) |
| D2 | "1897" on an open book with an underline rule, f352–432 | book serif → EB Garamond or Libre Caslon Text. The page itself is a real 17th-century scan with the long s. For synthetic pages use IM Fell |
| D3 | "HAPPY HALLOWEEN" in orange `#b66d23` (≈200 px cap, two lines) on scratched black, f1128–1344 | condensed, flared, medieval-ish caps. 15 candidates tested and none matched exactly. Almendra 700 condensed is closest in spirit (`fontcmp_dracula_halloween.jpg`) |

**Type treatment across all three styles.** Every text element sits on a physical carrier: a highlighter box, tape, a sticky note, a stamp, a paper slip, a book or a clipping. Type is set in one or two weights, and emphasis comes from italic or a highlight, not from colour. Grain and chromatic aberration are applied after the type (the RGB fringes visible on "2024" and "356").

## 2. Loading in Remotion (checked against `@remotion/google-fonts@4.0.543` and the project's installed 4.0.539)

The snippet below passes `tsc --strict` against the project's `node_modules` (`stills/G/tscheck/fonts_snippet.ts`). The module path is the family name with spaces removed. I confirmed every name below in the package's `typesVersions` (1,846 font modules). The signature is `loadFont(style?, {weights?, subsets?, document?, ignoreTooManyRequestsWarning?})` → `{fontFamily, fonts, unicodeRanges, waitUntilDone}`. Calling it with no arguments loads every weight and subset, and the docs warn this can time out renders. **In v5, `weights` and `subsets` become mandatory, so always pass them.**

```ts
// src/fonts.ts — import once at module top level
import {loadFont as caslonText} from '@remotion/google-fonts/LibreCaslonText';   // normal 400|700, italic 400
import {loadFont as caslonDisp} from '@remotion/google-fonts/LibreCaslonDisplay'; // normal 400
import {loadFont as playfair} from '@remotion/google-fonts/PlayfairDisplay';      // 400–900 + italics
import {loadFont as baskerville} from '@remotion/google-fonts/LibreBaskerville';  // 400–700 + italics
import {loadFont as franklin} from '@remotion/google-fonts/LibreFranklin';       // 100–900
import {loadFont as gochi} from '@remotion/google-fonts/GochiHand';              // 400, latin only
import {loadFont as elite} from '@remotion/google-fonts/SpecialElite';           // 400
import {loadFont as tinos} from '@remotion/google-fonts/Tinos';                  // 400|700 + italics
import {loadFont as fraktur} from '@remotion/google-fonts/UnifrakturCook';       // 700 only
import {loadFont as fell} from '@remotion/google-fonts/IMFellEnglish';           // 400 + italic

const L = {subsets: ['latin'] as ['latin']};
export const CASLON = caslonText('normal', {weights: ['400', '700'], ...L}).fontFamily; // "Libre Caslon Text"
caslonText('italic', {weights: ['400'], ...L});                    // same family; use fontStyle:'italic'
export const CASLON_DISPLAY = caslonDisp('normal', {weights: ['400'], ...L}).fontFamily;
export const PLAYFAIR = playfair('italic', {weights: ['600', '700'], ...L}).fontFamily;
export const VOX_SERIF = baskerville('normal', {weights: ['700'], ...L}).fontFamily;
export const VOX_SANS = franklin('normal', {weights: ['700', '800'], ...L}).fontFamily;
export const MARKER = gochi('normal', {weights: ['400'], ...L}).fontFamily;
export const TYPEWRITER = elite('normal', {weights: ['400'], ...L}).fontFamily;
export const NEWS = tinos('normal', {weights: ['400', '700'], ...L}).fontFamily;
export const MASTHEAD = fraktur('normal', {weights: ['700'], ...L}).fontFamily;
export const OLDBOOK = fell('normal', {weights: ['400'], ...L}).fontFamily;
```

Licensed fonts (Harriet, Adobe Caslon, and Balto if Type Supply licenses it to you) go in `public/fonts/` and load with `@remotion/fonts`. It is not yet a dependency: add `@remotion/fonts@4.0.539`, since every `@remotion/*` package must share one version. The call is `loadFont({family: 'Harriet Display', url: staticFile('fonts/HarrietDisplay-Bold.woff2'), weight: '700'})`, which returns a `Promise<void>` (signature checked in 4.0.543). Both loaders call `delayRender`/`continueRender` internally (checked in the dist source), so no manual render gating is needed. Figures: Playfair defaults to old-style, so add `fontVariantNumeric: 'lining-nums'` when it sets years. Libre Caslon Text has lining figures only.

## 3. What Vox actually uses — confirmed vs. inferred

**Confirmed (primary or foundry sources):**
- **Balto, by Tal Leming**, is used "in literally every single one of our videos". Vox chose it to sound like "a friend who knows a lot". Source: Vox, *How we got to 10 million subs* (YouTube, 22 Oct 2021; auto-transcript at https://rosetta.to/u/vox/how-we-got-to-10-million-subs, so wording is approximate). The foundry page (https://typesupply.com/fonts/balto) calls it "an American Gothic built for the 21st Century", lists it as an R&D typeface, and says it is not for sale, so you must contact Type Supply for a license.
- **Vox.com used Balto for article text and Harriet Display for headlines** (Digiday, 2015: https://digiday.com/media/mobile-web-another-nail-serifs-coffin/; Fonts In Use, 2014: Harriet, Balto, Alright Sans — https://www.fontsinuse.com/uses/6828/vox-website). Okay Type describes Harriet (Jackson Showalter-Cavanaugh, 2012) as "a contemporary reimagining of Baskerville" with Scotch Roman and Century influences, in Display and Text optical sizes (https://okaytype.com/harriet). I found no source for a newer Vox.com face.
- **Tools named in the same Vox video:** After Effects; the Motion 2 workflow plugin; aescripts.com, including a "layer random shifter" script (name as heard); **GEOlayers** for "all our maps"; Ben Marriott's **paper-cutout tutorial** for "many of my collage videos"; and the **David Rumsey Map Collection** for historical borders. Note that Rumsey images are mostly CC BY-NC-SA, so they are not usable commercially.
- Joey Sendaydiego, Vox video art director, says he sketches and experiments directly in After Effects and that a video takes "two to three weeks max". Some videos are built from hand-cut construction paper (Storybench, 18 Apr 2024: https://www.storybench.org/?p=21229).

**Inferred or community knowledge (not confirmed by Vox):**
- Ben Marriott's free cut-out project (https://benmarriott.gumroad.com/l/NDtPol) builds "boiling" paper edges from shape layers, Wiggle Paths and expressions (https://lesterbanks.com/2020/02/an-easy-way-to-get-a-paper-cutout-stop-motion-look-in-ae/).
- PremiumBeat's *5 Breakdowns on Replicating the VOX Motion Graphic Look* (2021, https://www.premiumbeat.com/blog/replicating-vox-motion-graphic/) lists five techniques: graphics animated at 12 fps inside a 24 fps edit; 3D-camera push transitions with a blur spike; stepped, frame-skipping mask reveals on rough-edged lower thirds; 5–6 paper textures cycled 2–3 times per second; and edge-only chromatic aberration plus blur through an inverted radial mask.
- Common tutorial staples, all guesses as far as Vox's own practice goes: a photographed crumpled-paper layer on Multiply, Posterize Time, and a highlighter made from an animated stroke with Turbulent Displace on Multiply.
- The Porsche and Dracula references are independent Behance "Vox-style" projects. Their fonts in §1 are our identifications, not designer statements.

## 4. Sourcing guide: CC0 and public-domain images

**Rules that apply everywhere.** "Free to use" is not the same as public domain.
- **US (2026):** works published in **1930 or earlier** are PD. A 1931–1963 work is PD only if its copyright was never renewed, and a 1931–1977 work if it was published without a copyright notice; both need checking. US federal-government works are PD.
- **EU:** a work is PD 70 years after the author's death, so authors who died in or before 1955. Anonymous works expire 70 years after publication. Rules vary by country; Germany protects simple photographs (§72 UrhG) for 50 years from publication.
- **Trademarks and personality rights survive PD.** Car badges, brand logos and recognisable people in ads are still restricted.
- **Keep provenance.** Save the landing-page URL, the rights text and the date checked next to every file (see `public/assets/cc0/CREDITS.md`).

| Source | Best for | License reality | Programmatic access (all probed 2026-11-13 unless marked) |
|---|---|---|---|
| **Library of Congress** | Bain News Service and National Photo Co. press photos (racing, engineers, factories), Detroit Publishing, maps, posters | Per-item `rights_advisory`, e.g. "No known restrictions on publication." This is an assessment, not a license | `https://www.loc.gov/photos/?q=auto+race&fa=online-format:image&c=100&fo=json`; item: `https://www.loc.gov/item/<id>/?fo=json`; filters `fa=`, `c=`, `sp=`, `at=`, `sb=date`. Documented limit **20 req/min** (1-hour block); images 150/min. No key. **On 2026-11-13 scripted calls to `www.loc.gov` got a Cloudflare 403 "Just a moment" challenge** (both agents, hours apart). `tile.loc.gov` IIIF still answered (e.g. `…/iiif/service:pnp:ggbain:02400:02418v/full/pct:50/0/default.jpg`), but large sizes reset. Workarounds: use a browser, or use the **Commons mirror** of the LoC item, whose filename carries the LCCN and whose page quotes the LoC rights text |
| **Chronicling America** (LoC) | US newspaper pages 1770–1963 | Pre-1931 issues are PD; check later ones | Since Aug 2025 **only via the loc.gov API**. `chroniclingamerica.loc.gov` now 308-redirects to `www.loc.gov`, so the challenge above applies. Use the browser search, or Commons/IA copies of the same papers |
| **Wikimedia Commons** | everything, including engravings, maps and portraits | Mixed. Accept only `PD-*` / CC0. **CC BY-SA** (e.g. Bundesarchiv) needs attribution and share-alike | API: `generator=search&gsrnamespace=6&prop=imageinfo&iiprop=url\|size\|extmetadata&iiurlwidth=2000`. Search operators that work: `haswbstatement:P6216=Q19652` (copyright status = PD), `hastemplate:"PD-old-100-expired"`, `incategory:"…"`, `filew:>1500`, `filemime:image/jpeg`. Read extmetadata `LicenseShortName`/`UsageTerms`. **`Copyrighted=False` is not reliable alone** (I saw "No restrictions" + `Copyrighted=True`). `PD-US` files may still be protected in the EU. Add `filetype:bitmap` to drop PDFs. Thumbnails snap to fixed widths (330, 500, 960, 1280, **1920**, **3840**); the first 3840 request can stall, so retry. Generic User-Agents get 429s, so go ≤1 req/s and honour `Retry-After` |
| **Smithsonian Open Access** | NMAH automobiles and models, technology, trade literature | Records and media marked `CC0` | `https://api.si.edu/openaccess/api/v1.0/search?q=automobile AND online_visual_material:true&rows=100&api_key=DEMO_KEY` (key from api.data.gov). Check `…online_media.media[].usage.access == "CC0"`. Image: `https://ids.si.edu/ids/deliveryService?id=<media id>&max=3000`. Cooper Hewitt prints: add `AND unit_code:CHNDM` |
| **The Met** | ornament and furniture prints (dept 9, Drawings & Prints), photographs | CC0 when `isPublicDomain: true` | **v1 search was retired 2026-10-01** and returns 410. Use `https://collectionapi.metmuseum.org/public/collection/v1.1/search?q=candelabrum&hasImages=true&departmentId=9&limit=100&offset=0`, then `/public/collection/v1/objects/<id>` → `primaryImage` (original) / `primaryImageSmall` / `additionalImages`. `isPublicDomain=true` is accepted as a filter but is not documented, so re-check each object. No key; ≤80 req/s |
| **Rijksmuseum** | Dutch prints, ornament designs, photos | Mostly PD/CC0 ("Public Domain or CC0" per object); some CC BY 4.0 or in copyright | No key: `https://data.rijksmuseum.nl/search/collection?type=print&imageAvailable=true&description=stoel` returns Linked Art ids. Dutch terms recall far better: 2,168 hits for `stoel` vs 5 for `title=chair`. GET the id with `Accept: application/ld+json`; the JSON holds the rights URI (PDM 1.0 / CC0 1.0) and `iiif.micr.io/<imageId>`. Image: `https://iiif.micr.io/<imageId>/full/2000,/0/default.jpg` (tested) |
| **NYPL Digital Collections** | menus, prints, maps, the 1900s–1920s | Site filter "public domain only" | **Repo API deprecated from 1 Aug 2026, with no replacement.** Use the website filter. Derivative codes: `w` = 760 px, `q` = 1600 px, `v` = 2560 px, `g` = original (not re-tested) |
| **Internet Archive** | whole volumes: *Motor Age*, *Scientific American*, *Horseless Age*, catalogs | IA does not license anything. Rights follow publication date; see the `possible-copyright-status` field | `https://archive.org/advancedsearch.php?q=title:(motor age) AND mediatype:texts AND date:[1900-01-01 TO 1930-12-31]&fl[]=identifier&fl[]=date&rows=50&output=json` (URL-encode it; returned 1,523 *Motor Age* issues). Page image: `https://archive.org/download/<id>/page/n10_w1500.jpg` (works). The IIIF v3 path I tried returned 404 |
| **BHL + Flickr Commons** | natural-history engravings (bats, animals), the Internet Archive Book Images stream | BHL: mostly PD. Flickr Commons says "No known copyright restrictions", which is the institution's claim | Flickr API `flickr.photos.search&is_commons=1` or `license=7,9,10` (7 = no known restrictions, 9 = CC0, 10 = PDM); needs a key. The BHL API also needs a free key |
| **Old Book Illustrations** | curated engravings by subject and illustrator | Its own terms call PD assessments "conjectural" and use "at your own risk". No offline-downloader tools | Browse only. Verify the source book's date |
| **Openverse** | meta-search | Aggregator; Flickr PDM tags are **user-applied**, so verify upstream | `https://api.openverse.org/v1/images/?q=engraving+chair&license=cc0,pdm&page_size=20`. Anonymous: 20/min, 200/day, 240 results max |
| **ambientCG** | paper and cardboard scans (Paper001–006, Cardboard002/004) | CC0 | `https://ambientcg.com/api/v2/full_json?type=Material&q=paper&include=downloadData` → zip, 1K–8K JPG |
| **Poly Haven** | desk surfaces (wood, fabric, plaster); no paper category | assets CC0. The live API asks for a "Powered by Poly Haven" credit and a unique User-Agent | `https://api.polyhaven.com/assets?t=textures&c=wood`, `/files/<id>` |

**Not CC0 — avoid for "PD-only" packs:**
- **Unsplash, Pexels and Pixabay** have their own licenses. They are free, but they forbid selling unaltered copies or building competing collections, and they give no model or brand releases.
- **rawpixel** puts its own license on "enhanced" PD files.
- **David Rumsey** is mostly **CC BY-NC-SA 3.0**.
- **Getty and Alamy** sell licenses even for PD works. Download the PD original from the institution instead.

**Recipe for a topic search ("history of X")**
1. Write the entity and date list: people (with death years), places, objects and events.
2. Mark each item by PD likelihood. US-published ≤1930 is safe. Authors who died ≤1955 are safe in the EU. Anything later goes to the "probably copyrighted" list, to be illustrated with generic period material instead.
3. Run one query batch per source:
   - **LoC:** `q=<object> <decade>`, `fa=online-format:image`; for maps use `/maps/?q=europe&dates=1890/1914` (the `dates` syntax copied from the website, not from the API docs). If LoC challenges scripts, search Commons for `LCCN` mirrors.
   - **Commons:** `<subject> haswbstatement:P6216=Q19652 filew:>1500`, plus `incategory:"<Subject> in the 1900s"`.
   - **Smithsonian:** `q=<subject> AND online_visual_material:true`.
   - **The Met:** v1.1 `q=<object>&departmentId=9` for engravings.
   - **Chronicling America** (via loc.gov) for headlines and dated ads. **IA** for trade magazines. **BHL** for fauna. **Old Book Illustrations** for furniture and objects.
4. Triage on the landing page, not the API row: rights text, creator, date, and whether the scan is the work itself or a retouched derivative.
5. Take the largest file you need: about 2× its on-screen size, so 3000–4000 px for 4K pushes. Save the metadata alongside it.
6. Prefer engravings on plain paper, which key cleanly (§5). Prefer photos with clean silhouettes, which cut out cleanly.

## 5. Cut-out pipeline

**AI matting, for photos, people and cars**
- **rembg** (MIT code; Python 3.11–3.13). Install with `pip install "rembg[cpu,cli]"`, or `rembg[gpu,cli]` for CUDA.
  - Single file: `rembg i -m birefnet-general in.jpg out.png`. Batch: `rembg p -m birefnet-portrait in_dir/ out_dir/`.
  - Flags: `-om` mask only, `-a` alpha matting, `-ppm` binary mask, `-dc` colour decontamination (removes halos).
  - Models: `birefnet-general` (best all-round), `birefnet-portrait`, `birefnet-hrsod` (high-res), `isnet-general-use` (fast, good), `u2net` (legacy), `sam` (prompted).
  - **The default model is now `bria-rmbg` (RMBG-2.0), whose BRIA license requires a paid agreement for commercial use.** Always pass `-m`. Weight licenses are per upstream project; per their repos, BiRefNet is MIT and IS-Net/U²-Net are Apache-2.0 (re-check before shipping).
- **transparent-background** (InSPyReNet; MIT code; the weights' license is unstated). Install with `pip install transparent-background`; it needs a PyTorch wheel index.
  - `transparent-background --source in_dir --dest out_dir --type rgba --mode base`.
  - `--type map` writes the mask only, `--threshold 0.5` makes it hard, `--mode fast` trades quality for speed.
- **Do not use AI matting for engravings or line art.** It drops hatching and thin strokes. Key them by luminance as below.

**Tested ImageMagick 7 recipes** are in `tools/assets/cutout_recipes.sh` (run `bash cutout_recipes.sh in.jpg outdir [inkHex]`, optionally with env `THRESH=40%` and `SPECK=800`). The results on the test pack are in `stills/G/pipeline_demo.jpg` and `stills/G/test/out/`. The core lines:

```bash
# Ink key: paper -> transparent, ink -> solid colour (light-paper engravings)
magick in.jpg -colorspace Gray -level 15%,85% -negate -background '#1a1410' -alpha Shape ink.png
# Silhouette key: drop only the OUTER paper. Threshold (Triangle auto, or -threshold 40% for hatched skies),
# thicken ink, flood-fill the outside from a corner, invert, drop specks < 800 px, soften.
magick in.jpg -colorspace Gray -blur 0x1 -auto-threshold Triangle -morphology Erode Disk:3 -colorspace sRGB \
  -bordercolor white -border 1 -fill red -draw 'color 0,0 floodfill' -shave 1x1 \
  -fill white +opaque red -fill black -opaque red -colorspace Gray -threshold 50% \
  -define connected-components:area-threshold=800 -define connected-components:mean-color=true -connected-components 8 \
  -morphology Dilate Disk:3 -morphology Open Disk:2 -blur 0x0.8 -level 45%,55% mask.png
magick in.jpg mask.png -alpha off -compose CopyOpacity -composite cut.png
# White die-cut sticker border (Disk radius = border px) + soft shadow
magick cut.png -bordercolor none -border 48 \( +clone -alpha extract -morphology Dilate Disk:14 -blur 0x1 \
  -level 48%,52% -background '#fbf8f1' -alpha Shape \) +swap -compose Over -composite \
  \( +clone -background black -shadow 40x9+8+12 \) +swap -background none -layers merge +repage sticker.png
# Duotone / 45-degree halftone (blur first vs. hatching moire; +repage after each rotate) / photocopy B&W
magick in.jpg -colorspace Gray -sigmoidal-contrast 4x50% +level-colors '#231a14','#f3e9d6' duo.jpg
magick in.jpg -colorspace Gray -blur 0x1.5 -background white -rotate 45 +repage -ordered-dither h16x16o \
  -rotate -45 +repage -gravity center -crop WxH+0+0 +repage halftone.png      # WxH = input size
magick in.jpg -colorspace Gray -contrast-stretch 2%x1% -sigmoidal-contrast 7x50% -attenuate .35 +noise Gaussian bw.jpg
```

The torn edge (noise-displaced border) is step 4 of the script. Lessons from the test pack:
- **Crop away plate lines and scan borders first.** A closed frame line stops the flood fill, so the whole plate becomes the "object".
- **Cream paper:** the default Triangle threshold worked on the Sallembier candelabrum.
- **Hatched backgrounds:** the Brehm bat's engraved sky needed `THRESH=40%`.
- **Foxing specks** are removed by `SPECK`.
- The ink key alone is ideal for light-paper scenes. On dark scenes use the silhouette cut, so the engraving keeps its own paper, as in the Dracula look.

**Hand-scissored edge** (straight snips, not a smooth outline): `tools/py tools/assets/scissor_cut.py cut.png out 18 10 <seed>`. It dilates the alpha, traces every outer contour with contourpy (one paper piece per object, holes filled), simplifies with Ramer–Douglas–Peucker (one vertex per ~10 px of deviation) and jitters each snip. Output is `out_scissor.png` plus `out_scissor.json`, which holds the polygons and an SVG `d` path so the paper can be drawn live.

**At render time in Remotion.** Bake the expensive, static work: matting, keys and scissor polygons. Do the animatable look live. The code below, with `scissorClip()` and a demo, passes `tsc --strict` in `stills/G/tscheck/filters_snippet.tsx`:

```tsx
export const PrintFilters: React.FC<{boil: number}> = ({boil}) => (
  <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
    <defs>
      <filter id="sticker" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius={12} result="grown" />
        <feTurbulence type="fractalNoise" baseFrequency={0.035} numOctaves={2} seed={boil} result="n" />
        <feDisplacementMap in="grown" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feFlood floodColor="#fbf8f1" /><feComposite in2="rough" operator="in" result="border" />
        <feGaussianBlur in="rough" stdDeviation={6} /><feOffset dx={5} dy={9} />
        <feComponentTransfer result="shadow"><feFuncA type="linear" slope={0.35} /></feComponentTransfer>
        <feMerge><feMergeNode in="shadow" /><feMergeNode in="border" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {/* engraving key without baking: alpha = 1.417 - 0.556(R+G+B), ink = #1a1410 */}
      <filter id="ink-key" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 .10  0 0 0 0 .08  0 0 0 0 .06  -.556 -.556 -.556 0 1.417" />
      </filter>
      <filter id="duotone" colorInterpolationFilters="sRGB">  {/* #231a14 -> #f3e9d6 */}
        <feColorMatrix type="matrix" values=".299 .587 .114 0 0 .299 .587 .114 0 0 .299 .587 .114 0 0 0 0 0 1 0" />
        <feComponentTransfer><feFuncR type="table" tableValues=".137 .953" />
          <feFuncG type="table" tableValues=".102 .914" /><feFuncB type="table" tableValues=".078 .839" /></feComponentTransfer>
      </filter>
    </defs>
  </svg>
);
// <PrintFilters boil={Math.floor(frame / 3)} />  -> edges "boil" on threes, like stop motion
// <Img src={staticFile('assets/cc0/engravings/x.jpg')} style={{filter: 'url(#ink-key) url(#sticker)'}} />
```

- **Rectangular photo prints:** use `clipPath: polygon(...)` with 3–4 cuts per side, jittered ±0.9% by ``random(`${id}-${i}`)`` from `remotion`. It is deterministic across render workers. For irregular shapes, draw the paper from the JSON path produced by `scissor_cut.py` (`<path d={svgPath} fill="#fbf8f1"/>` under the PNG, offset by `offset`).
- **Engravings on light paper** need no key at all: use `mix-blend-mode: multiply`. On the dark collage, use `#ink-key` with a bone-white ink (`.93 .90 .84`), or the baked `_cut.png` to keep the paper inside the shape.
- **B&W photos:** CSS `filter: grayscale(1) contrast(1.25) brightness(1.05)`.
- **Halftone:** bake it for stills. For animated halftone, use a small GLSL pass (e.g. `@remotion/three`) rather than SVG.
- **Performance:** SVG filters re-run every frame in headless Chrome. Large `feMorphology` radii and `feTurbulence` on 4K-sized layers are slow. Keep filtered layers at their display size, and bake anything that does not animate.

## 6. CC0 / public-domain test pack (`public/assets/cc0/`)

13 images, 16.3 MB. Every file was checked with `file` and `identify` and its license read from the source API or file page. Full provenance is in `public/assets/cc0/CREDITS.md`: title, creator, date, source page, exact file URL, license text as shown, why it is PD, and the rejected candidates. Several LoC and BnF items were fetched as **Commons 1920/3840 px renditions** because of the LoC challenge (§4).

| File (`public/assets/cc0/…`) | What it is | px | Basis |
|---|---|---|---|
| `photos/vanderbilt-cup-robertson-locomobile-1908.jpg` | Vanderbilt Cup 1908, Robertson refuelling (Bain) | 1920×1402 | US pub. 1908; LoC "no known restrictions" |
| `photos/ford-highland-park-magneto-line-1913.jpg` | first moving assembly line (NARA) | 1920×1386 | US pub. 1913 |
| `photos/bureau-of-standards-engine-test-1930.jpg` | engineer at an engine test stand (Harris & Ewing) | 1920×2479 | LoC "no known restrictions"; pub. 1930 |
| `photos/chevrolet-1931-shulmans-market-dc-1941.jpg` | **colour** street scene, 1931 Chevrolet (FSA/OWI) | 1920×1499 | US federal work. Contains Coca-Cola signage, which is a trademark |
| `photos/panhard-engine-detail-1912.jpg` | Panhard sleeve-valve engine (Agence Meurisse, BnF) | 1920×1396 | anonymous FR 1912; US pre-1931 |
| `engravings/bat-barbastelle-specht-brehms.jpg` | bat in flight (Specht, *Brehms Tierleben*) | 1580×1176 | artist d. 1909; key it with `THRESH=40%` |
| `engravings/candelabrum-flambeaux-sallembier-1805.jpg` | two-branch candelabrum plate (Cooper Hewitt) | 2028×3000 | Smithsonian CC0. Crop inside the plate line before keying |
| `engravings/bran-castle-torcsvar-rohbock-1864.jpg` | "Dracula's castle" (Bran), steel engraving | 3000×2430 | artist d. 1893 (PD-old) |
| `engravings/furniture-designs-thomas-hope-1807.jpg` | chairs, stools, table in outline (The Met) | 2401×3958 | Met `isPublicDomain: true` → CC0 |
| `maps/europe-physical-map-bazewicz-1914-1918.jpg` | Polish physical map of Europe (Polona) | 3000×2330 | pub. ≤1918; publisher d. 1929 |
| `documents/ford-model-t-ad-colliers-1908.jpg` | Model T launch ad, *Collier's* 3 Oct 1908 | 1920×2912 | US pub. 1908. The Ford script logo is a trademark |
| `documents/peugeot-ad-avtomobil-magazine-1908.jpg` | Russian-language Peugeot ad page | 1920×2632 | Russian Empire 1908; US pre-1931 |
| `portraits/victorian-man-full-length-cdv-1870.jpg` | full-length carte de visite, man with cane (LoC) | 3281×4096 | ~1870; LoC "no known restrictions in the U.S." |

Treatments tested on this pack are in `stills/G/pipeline_demo.jpg`. Suggested proof uses:
- **Porsche desk:** the photos as taped prints (Bain grey and FSA colour), the ad pages as paper slips, and the map under a push-in.
- **Dracula collage:** the castle, the bat (silhouette key with a white border), the candelabrum and the portrait (`rembg -m birefnet-portrait`) on black.
- **Explainer:** the Hope furniture plate, cut into individual pieces.

## 7. Evidence index (`analysis/stills/G/`)
- `overview_porsche_text.jpg`, `overview_epigenetics_text.jpg`, `overview_dracula_highlight_text.jpg` are 640 px montages of the text moments. The native grabs are `porsche_f*.png` (720p), `epi_f*.png` and `dracula_f*.png` (1080p), and `highlight_f*.png` (720p).
- `fontcmp_*.jpg` holds reference crops (top row) against candidate fonts, made by `font_compare.py`. `ocr_text_moments.tsv` holds every OCR hit (video, frame, confidence, height, word) for finding more text.
- `cutout_recipes.sh`, `scissor_cut.py` and `test/` hold the pipeline scripts and their outputs on the test pack.
