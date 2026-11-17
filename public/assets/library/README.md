# The shared asset library (catalog-only)

This folder is the library of free assets for every video made with the framework. **Git holds only the catalog**:
`catalog.json` (the single source of truth), plus `CATALOG.md` and `CREDITS.md`, which are generated from it, and
`WANTED.md`. Each entry records:
- where its file comes from: the source page, the download URL and the processing steps, or the seeded script that
  generates it;
- its licence, with the evidence;
- checksums to verify what arrives.

`tools/library/fetch.py` downloads the files on demand into this folder, which is git-ignored.

```
tools/py tools/library/search.py "telephone operators"            # find (✓ = on disk, ↓ = fetch first)
tools/py tools/library/search.py map --kind maps --fetch          # find and download
tools/py tools/library/fetch.py --ids photo-blue-marble-1972      # download by id
tools/py tools/library/fetch.py --for-project <slug>              # everything a storyboard uses (publish_project.py does this)
tools/py tools/library/fetch.py --pack core                       # the kit pack (setup.sh does this)
```

In a storyboard, use the printed path with the `kit:` prefix, e.g. `"src": "kit:assets/library/photos/space/photo-blue-marble-1972.jpg"`.
In code: `staticFile("assets/library/…")`.

## What is in it

[CATALOG.md](CATALOG.md) lists every entry by kind and theme.

| Kind | What |
|---|---|
| photos | Archival photos, public domain or CC0, by theme: people, work, cities, transport, science, government, money, health, farming, food, energy, media, space. |
| engravings | Prints, engravings, diagrams and illustrations: animals, machines, architecture, history, science, illustrations. |
| portraits | Generic period portraits. |
| documents | Newspaper ads, letters, posters, postcards and other ephemera. |
| maps | Historical maps. Natural Earth base maps in three styles (`paper`, `dark`, `line`): world, continents, world time zones. |
| cutouts | Objects and people with alpha. |
| textures | Generated papers, grain and dust. CC0 paper and cardboard scans. |
| marks | Generated hand-drawn arrows, rings, X marks, checks, underlines, braces, scribbles, highlighter swipes, bursts, torn strips, tape and paper scraps. |
| sfx | UI and foley one-shots. Each comes with a peak sidecar for `SfxAtPeak`. |
| music | Beds by mood, with BPM, LUFS and loudness range in the entry. |
| footage | Short public-domain clips. |
| data | Natural Earth GeoJSON. |

## Licences

- **Images, maps, footage:** public domain or CC0 only. No attribution is required; a credit is still good practice.
- **Music and SFX:** may also be CC BY. These entries carry an `attribution` line, and `search.py` marks them
  `ATTRIBUTION`. Paste the line from [CREDITS.md](CREDITS.md) into the video description.
- **Never accepted:** NC, ND, BY-SA, "free to use" or an unknown licence (`add.py` and `catalog.py check` enforce this).
- **Public domain means in the United States,** unless the entry says more. Every entry states its basis:
  - published before 1931;
  - a US federal government work;
  - the author died more than 100 years ago;
  - a CC0 release.

  Check the source page before a commercial release outside the US.
- **Trademarks and personality rights are not cleared by a public-domain licence.** Do not use a logo or a person's
  likeness to imply endorsement.
- **Generated entries are CC0.** These are the marks, papers, grain, dust, the procedural SFX and the rendered maps.

## How a file arrives (`build.from`)

| From | What happens |
|---|---|
| `download` | Fetch `source.url`, or an `alt` URL (for a Wikimedia thumbnail also the same rendition on upload.wikimedia.org, then the original), into an empty folder under `out/tmp/`. Check that the file is the media its extension says. Run `steps` (`resize`, `jpeg`, `zip:<member>`, `wav48k`, `trim`, …). Verify the result against the recorded checksum; images may instead match size + a 16×16 fingerprint, which survives re-encoding. Move it into place. |
| `generate` | Run the seeded generator (`tools/textures/*.py`, `tools/library/make_marks.py`, `tools/library/make_maps.py`, `tools/audio/make_sfx.py`, …). |
| `script` | Run a script on other entries (`needs`), e.g. the ImageMagick keys of `tools/assets/make_cutouts.sh`. |
| `release` | Download from this repository's GitHub release (`library-v1`): AI cut-outs (rebuilding them needs about 1 GB of models) and files contributed by their owners. Until the release exists, `fetch.py --rebuild` rebuilds AI cut-outs locally with rembg. |

When a source moves a file, `fetch.py` reports the dead link with the source page. `catalog.py check --online` finds
them all. Fix the URL, or replace the entry.

## Adding assets

Use the `vox-assets` skill, or follow these steps:

1. Stage candidates: `tools/py tools/library/stage.py <theme> "<query>" ... [--kind photo|engraving|portrait|map|document]`.
2. Look at `out/library-staging/<theme>/sheet.jpg`. Reject:
   - watermarks;
   - news-agency or stock credits;
   - prominent modern logos;
   - sensitive images of private people;
   - near-duplicates.
3. Add the keepers: `tools/py tools/library/add.py image <sidecar.json> --id … --kind … --theme … --title … --tags … --era … --pd-basis …`.
   Other sources: `add.py url | audio | cutout | promote`.
4. Check and rebuild the pages: `tools/py tools/library/catalog.py check` and `tools/py tools/library/catalog.py build`.

Rules for titles: factual and short; no invented facts. The tags are what people search for: give 5–9 of them.
