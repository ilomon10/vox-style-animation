---
name: vox-assets
description: Find, fetch and grow free-licence assets for Vox-style videos — public-domain/CC0 archival photos, engravings, documents, historical and Natural Earth maps, cut-outs, paper textures, hand-drawn marks, sound effects, music beds and footage. Search the shared catalog, download on demand, source new material from the web with licence checks, and add good finds to the catalog for the next project. Use when the user asks for assets, "collect more assets", a specific kind of image/sound/map, or wants to contribute to the library.
---

# The shared asset catalog

`public/assets/library/catalog.json` is the library: every entry says where the file comes from, its licence and how to
check it. Git holds no media; files are downloaded from their source (or generated from a seed) when someone needs them.
Read `public/assets/library/README.md` once. Inside a checkout of
https://github.com/ilomon10/vox-style-animation (clone + `bash tools/setup.sh` if the working directory is not one).

## Find and use
```
tools/py tools/library/search.py "<words>" [--kind photos|engravings|portraits|documents|maps|cutouts|textures|marks|sfx|music|footage] [--era 19] [--fetch]
tools/py tools/library/fetch.py --ids <id>[,<id>…]          # or --kind, --tags, --pack core, --for-project <slug>
```
- In a storyboard: `"kit:<path>"` exactly as printed. `publish_project.py` fetches missing catalogued files by itself.
- Credit: PD/CC0 needs none (still good practice); CC BY entries (some music) print `ATTRIBUTION`: paste the line from
  `public/assets/library/CREDITS.md` into the video description.
- Maps: `tools/py tools/library/make_maps.py country <ISO3> --project <slug> [--style paper|dark|line]`, and
  `make_maps.py locate <map.png> --at lon,lat …` for MapRouteScene waypoints.
- Marks, tape, torn strips and scraps are generated (`make_marks.py`); highlighter swipes go under type with
  `mix-blend-mode: multiply`.

## Collect more (curation loop)
1. Check what exists first (`search.py`, `CATALOG.md`, `WANTED.md`): no duplicates.
2. Stage candidates: `tools/py tools/library/stage.py <theme> "<query>" ["<query>" …] [--kind photo|engraving|portrait|map|document] [--n 6]`
   (Commons public domain/CC0 by default, cached 1920 px renditions; `--source nasa|smithsonian` for those).
3. LOOK at `out/library-staging/<theme>/sheet.jpg`. Keep only what a video would use. Reject: watermarks, news-agency or
   stock credits, prominent modern brand logos, sensitive images of private people (patients, victims, children in
   distress), military insignia used decoratively, near-duplicates, blurry or tiny scans, and anything whose licence
   needs a guess.
4. Add each keeper with a short id, a factual title (no invented facts), 5–9 search tags and the public-domain basis:
   `tools/py tools/library/add.py image <sidecar.json> --id <kind-prefix>-<subject>-<year> --kind photos --theme <theme> --title "…" --tags "…" --era <year> --region <ISO2> --pd-basis "…"`
   Other sources: `add.py url <direct file URL> --page <licence page> --license pd|cc0 [--steps zip:<member>,resize:2400,jpeg:88] …`;
   music/SFX candidates from `source_music.py`: `add.py audio <candidates.json> <cid> …` (CC BY allowed for sound only).
   AI cut-outs of catalogued photos: `add.py cutout <source-id> --theme … --title … --tags … [--crop x,y,w,h] [--model birefnet-portrait]`.
5. `tools/py tools/library/catalog.py check` and `catalog.py build` (CATALOG.md, CREDITS.md). Update `WANTED.md` with the
   gaps you noticed.

Licence rules (enforced by add.py and catalog.py): images, maps and footage are public domain or CC0 only; music and SFX
may also be CC BY with an attribution line; never NC, ND, BY-SA, "free to use" or unknown. "Public domain" means in the
US unless the entry says more: write the basis (published before 1931, US federal work, author died 100+ years ago, CC0
release). Release items (AI cut-outs, promoted user files) download from the repository's GitHub release once it is
published; until then `fetch.py --rebuild` rebuilds AI cut-outs locally.
