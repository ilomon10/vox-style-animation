# 09 · Assets: sourcing, cut-outs, licensing

The style is built from **real archival imagery**: photos, engravings, maps, newspaper pages, period ads. Cut it out, tint it and place it on paper. The kit ships **no third-party textures**: paper, grain and dust are generated (`tools/textures/generate_textures.py`). Imagery comes from public-domain or CC0 sources, with provenance recorded next to each file.

Full research notes, including API probes and rejected candidates: `analysis/assets-and-fonts.md`.

## 1. What counts as safe

- **US (as of 2026):** works published in **1930 or earlier** are public domain.
  - 1931–1963: PD only if the copyright was not renewed.
  - 1931–1977: PD if published without a notice.
  - US federal-government works are PD.
- **EU:** PD 70 years after the author's death (author died ≤ 1955). Anonymous works: 70 years after publication.
  - Germany protects simple photographs for 50 years from publication (§72 UrhG).
- **Trademarks and personality rights survive PD.** Logos, car badges and recognisable people in ads may still be restricted. The Vox logo is a trademark: never reproduce it.
- **"Free to use" is not PD.** Unsplash, Pexels and Pixabay have their own licenses (no resale of unaltered copies, no releases). rawpixel puts its own license on "enhanced" PD scans. The David Rumsey maps are mostly **CC BY-NC-SA**, which rules them out for commercial use. Getty and Alamy sell PD works, so download the original from the institution instead.
- **Keep provenance**: landing-page URL, rights text as shown, date checked. See `public/assets/cc0/CREDITS.md`.

## 2. Where to look (by need)

| Need | Source | Access |
|---|---|---|
| press photos 1900–1930s (racing, engineers, factories, cities) | **Library of Congress** (Bain, National Photo Co., Harris & Ewing, Detroit Publishing), rights "No known restrictions" | `https://www.loc.gov/photos/?q=<q>&fa=online-format:image&fo=json` (20 req/min; scripted access was Cloudflare-challenged on 2026-11-13. Fall back to the Commons mirror, whose filename carries the LCCN) |
| anything, especially engravings, maps and portraits | **Wikimedia Commons**: accept only `PD-*` or CC0 | API `generator=search&gsrnamespace=6&prop=imageinfo&iiprop=url\|size\|extmetadata&iiurlwidth=2000`; search `<subject> haswbstatement:P6216=Q19652 filew:>1500`; read `LicenseShortName` (don't trust `Copyrighted` alone); ≤1 req/s |
| objects, automobiles, technology, trade literature | **Smithsonian Open Access** (CC0) | `https://api.si.edu/openaccess/api/v1.0/search?q=<q> AND online_visual_material:true&api_key=…`; check `usage.access == "CC0"` |
| ornament and furniture engravings, photographs | **The Met** (CC0 when `isPublicDomain`) | v1 search retired 2026-10-01 → use `/public/collection/v1.1/search?q=<q>&hasImages=true&departmentId=9` |
| Dutch prints, ornament, photos | **Rijksmuseum** (PDM/CC0 per object) | `https://data.rijksmuseum.nl/search/collection?type=print&imageAvailable=true&description=<dutch term>` → IIIF `https://iiif.micr.io/<id>/full/2000,/0/default.jpg` |
| 1900s–1920s menus, prints, maps | **NYPL Digital Collections** (PD filter) | website only (the API is deprecated) |
| whole period magazines (Motor Age, Scientific American) | **Internet Archive**: rights follow the publication date | `advancedsearch.php?q=title:(<t>) AND mediatype:texts AND date:[1900-01-01 TO 1930-12-31]&output=json`; page images `/download/<id>/page/n10_w1500.jpg` |
| natural-history engravings (bats, animals, plants) | **Biodiversity Heritage Library**, Flickr Commons | API keys needed |
| newspapers 1770–1963 | **Chronicling America** (via loc.gov) | pre-1931 issues are PD |
| meta-search | **Openverse** | `api.openverse.org/v1/images/?q=<q>&license=cc0,pdm` (verify upstream; PDM tags are user-applied) |
| paper and cardboard scans (optional) | **ambientCG** (CC0) | `api/v2/full_json?type=Material&q=paper` |

### Topic-driven search recipe ("the history of X")

1. List the entities: people (with death years), places, objects, events and dates.
2. Mark each item's PD likelihood. US-published ≤ 1930 is safe. For anything later, plan a stand-in: generic period material, an engraving, a map or a document.
3. Run one query batch per source:
   - LoC: `<object> <decade>`; maps via `/maps/?q=…&dates=1890/1914`.
   - Commons: `haswbstatement:P6216=Q19652`.
   - Smithsonian: `online_visual_material:true`.
   - The Met: dept 9 for engravings.
   - IA: trade magazines.
   - BHL: fauna.
4. Triage on the **landing page**: rights text, creator, date, and whether the file is the work itself.
5. Download **≥ 2× display size** (3000–4000 px for 4K pushes) and save the metadata beside the file.
6. Prefer engravings on plain paper (they key cleanly) and photos with clean silhouettes (they cut cleanly).

## 3. Cut-out pipeline

| Input | Method | Command |
|---|---|---|
| photos of people and objects | **AI matting**: rembg with `birefnet-general` / `birefnet-portrait` (MIT) or `isnet-general-use` (Apache-2.0). **Never the default `bria-rmbg`** (RMBG-2.0 needs a paid license for commercial use) | `rembg i -m birefnet-portrait in.jpg out.png` (`-a` alpha matting, `-dc` decontaminates halos) |
| engravings on light paper (for light grounds) | **no cut needed**: `mix-blend-mode: multiply`, or the ink key | `magick in.jpg -colorspace Gray -level 15%,85% -negate -background '#1a1410' -alpha Shape ink.png` |
| engravings for dark grounds | **silhouette key**: threshold → flood-fill the outside → keep the engraving's own paper inside the shape | `tools/assets/cutout_recipes.sh in.jpg outdir` (`THRESH=40%` for hatched skies, `SPECK=800` removes foxing; crop plate lines first) |
| hand-scissored edge | straight snips: dilate the alpha → trace → simplify (RDP) → jitter | `tools/py tools/assets/scissor_cut.py cut.png out 18 10 <seed>` → PNG + an SVG path for drawing the paper live |

**Bake vs. render live.** Bake anything static and expensive: matting, keys, scissor polygons. Do the animatable look at render time:

| Look | Render-time recipe |
|---|---|
| white die-cut border | SVG `feMorphology dilate` + flood |
| rough / boiling edge | `feTurbulence` + `feDisplacementMap`, with the seed re-picked every 2–3 frames |
| duotone | `feColorMatrix` + `feComponentTransfer` tables |
| B/W | `grayscale(1) contrast(1.25)` |
| halftone | for stills: bake it with ImageMagick `-ordered-dither h16x16o`, or a small WebGL pass |

**Size rules.** Cut-outs ≥ 2× their on-screen size at 4K, trimmed to their alpha bounds, PNG. Keep `SOURCES.md` lines: source file, method, inherited license.

## 4. The shared asset catalog (what the kit brings)

Git holds no media. `public/assets/library/catalog.json` lists every asset with its source, licence evidence and checksum;
files are downloaded on demand (`tools/library/fetch.py`) or generated from a fixed seed. `bash tools/setup.sh` fetches the
`core` pack; `publish_project.py` fetches whatever a storyboard uses. Details: `public/assets/library/README.md`.

| Kind | What | Where it comes from |
|---|---|---|
| kit test pack | the 13 PD/CC0 images of `public/assets/cc0/` (provenance in its `CREDITS.md`) and the 9 cut-outs of `public/assets/cutouts/` (`SOURCES.md`) used by the proof shots and galleries | Commons, Smithsonian, The Met; cut-outs rebuilt by `bash tools/assets/make_cutouts.sh`, the two AI mattes from the repository's release |
| photos, engravings, portraits, documents, historical maps | public domain / CC0 archival material by theme (people, work, cities, transport, science, government, money, health, farming, energy, media, space; animals, machines, architecture, history; ads, letters, posters, ephemera) | Wikimedia Commons (LoC, NARA, NASA, Smithsonian, Internet Archive Book Images), NASA Image Library |
| maps | Natural Earth (PD) world, continents and time zones in three styles; `make_maps.py country <ISO3>` for one country | rendered by `tools/library/make_maps.py` |
| textures | `public/textures/` (generated, tileable: papers, grain, dust) and CC0 paper/cardboard scans | `tools/textures/*.py`; ambientCG |
| marks | hand-drawn arrows, rings, X marks, checks, underlines, braces, scribbles, highlighter swipes, bursts, torn strips, tape, paper scraps | `tools/library/make_marks.py` (CC0) |
| sfx | UI clicks, ticks, glitches, page flips, thuds, cloth, coins (Kenney, CC0) + the procedural kit `public/audio/sfx/` | each with a peak sidecar for `SfxAtPeak` |
| music | beds by mood with BPM and loudness | Kevin MacLeod (incompetech.com, **CC BY 4.0: attribution line in CREDITS.md**) |
| footage | short PD clips: Saturn V, Earth from the ISS, 1940s New York | NASA, Prelinger Archives (Internet Archive) |

Find: `tools/py tools/library/search.py "<words>" [--kind …] [--fetch]`. Use: `"kit:<path>"` in a storyboard.
Grow it: `tools/library/stage.py` (candidates + contact sheet) → look → `tools/library/add.py` (licence rules enforced:
images PD/CC0 only; sound may be CC BY) → `tools/library/catalog.py check|build`. Gaps worth filling: `public/assets/library/WANTED.md`.

## 5. Footage

Archival film is fine if PD (e.g. US government films, pre-1931). Run it at its own rate: `<OffthreadVideo>` at the composition fps reproduces the 24/25 → 30 pulldown duplicates.

Grade per clip, then let the global finish do the rest:

| Grade | Style |
|---|---|
| green duotone, or sepia | paper desk |
| fully desaturated | dark collage |
| natural | Vox |

## 6. Sourcing tools

`tools/source/` fetches licensed material into a project and records provenance. Details: `tools/source/README.md`.

```bash
PY=tools/py
$PY tools/source/source_images.py "Abraham Lincoln portrait" --project video-projects/<slug> --kind portrait --cutout --bw
$PY tools/source/source_images.py "Apollo 11" --project video-projects/<slug> --source nasa --dry-run
$PY tools/source/source_music.py --mood "soul ballad" --bpm 60-90 --min-len 60 --project video-projects/<slug>
$PY tools/source/make_bed.py --bpm 72 --key Dm --mood "late-night soul" --length 90 --out video-projects/<slug>/audio/music/bed.wav
```

- **Images** land in `assets/sourced/<id>.<ext>` with `<id>.json` (title, creator, date, page and file URLs, licence + URL, attribution string, query), a contact sheet, and a line in `CREDITS.md`. Sources: Commons, Openverse, NASA, Smithsonian Open Access, LoC (Commons mirrors when loc.gov is blocked).
- **Accepted licences:** PD, CC0, CC BY, CC BY-SA. CC BY / BY-SA need the attribution string from `CREDITS.md` in the video description.
- **Never used:** news-agency or stock images (AP, Reuters, Getty, AFP, ...), NC/ND licences. People in politics: prefer US-government portraits (`PD-USGov`).
- **Music / SFX:** `source_music.py` downloads <= 20 MB candidates as 48 kHz WAV, measures tempo, loudness and energy, and writes `audio/music/candidates.md` (ranked). Listen before choosing; a PD/BY licence says nothing about fit.
- **No fit?** `make_bed.py` renders a bed in the measured style (bass < 200 Hz, hats > 5 kHz, speech band cut) with stems and stingers; `write_music_wanted()` writes `MUSIC_WANTED.md`.
