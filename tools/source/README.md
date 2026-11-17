# tools/source: internet sourcing for a video project

Run with `tools/py tools/source/<tool>.py ...` (needs `requests`, `numpy`, `Pillow`, ImageMagick 7, ffmpeg; `rembg` only for `--cutout`).

| Tool | Does |
|---|---|
| `source_images.py "<query>" --project video-projects/<slug>` | search Commons, Openverse, NASA, Smithsonian, LoC; download to `assets/sourced/<id>.<ext>` + `<id>.json`; append `CREDITS.md`; contact sheet `contact_<query>.png` |
| `source_music.py --mood "soul ballad" --bpm 60-90 --min-len 60 --project ...` | find music (Openverse audio, Commons audio, Internet Archive), <= 20 MB each, convert to 48 kHz WAV, analyse (tempo map, LUFS/LRA, energy curve), rank, write `audio/music/candidates.md` |
| `source_music.py --sfx "door slam" --project ...` | same for sound effects; `audio/sfx/candidates.md` |
| `make_bed.py --bpm 72 --key Dm --mood ... --length 90 --sections ... --out ...` | procedural bed (bass < 200 Hz, kick, hats > 5 kHz, low pad), stems, `--stingers`, `--wanted <project>` writes `MUSIC_WANTED.md`; `write_music_wanted()` is importable |

Image options: `--n 8 --min-width 2000 --licenses pd,cc0,by,by-sa --kind photo|portrait|map|document|engraving --source auto|commons|openverse|nasa|smithsonian|loc --cutout --bw --commons-width 1920 --dry-run`.
`--commons-width 1920` takes Commons files wider than that as their cached 1920 px rendition: upload.wikimedia.org answers bursts of
original downloads with HTTP 429 and a 60 s wait. For the shared catalog, stage with `tools/library/stage.py` (it uses these tools with
PD/CC0 only and 1920 px renditions) and add keepers with `tools/library/add.py`; see `public/assets/library/README.md`.
`--dry-run` lists candidates with licences and rejections and downloads nothing. `--cutout` uses rembg `birefnet-portrait` (kind portrait) or `isnet-general-use`, never the default bria model. `--bw` writes `<id>_bw.<ext>` (grayscale, S-curve contrast).

## Licences
- Accepted: public domain / PDM / US-government (`pd`), CC0 (`cc0`), CC BY (`by`), CC BY-SA (`by-sa`). Everything else (NC, ND, GFDL-only, "free use", unknown) is rejected.
- Commons: the licence comes from `extmetadata` (`LicenseShortName`, `UsageTerms`, `LicenseUrl`); `Copyrighted` alone is never trusted.
- CC BY / BY-SA results carry `attribution_required: true` and an attribution string in the `.json` and `CREDITS.md`; put these in the video description. BY-SA obliges share-alike for adaptations of the work itself.
- Openverse PDM tags are user-applied: sidecar `note` says "verify upstream". PD in one country is not PD everywhere (see `docs/style-guide/09-assets.md`).
- News agencies and stock libraries (AP, Reuters, Getty, AFP, UPI, Alamy, Shutterstock, Corbis, Bettmann, ...) are rejected by credit/source/title text.
- Politics and public figures: Commons queries add `hastemplate:"PD-USGov"` for portraits. Still check the landing page.
- Trademarks and personality rights survive PD/CC licences.

## Rate limits and User-Agent policy
- One generic User-Agent (`vox-style-sourcing/1.0 (...)`), no personal info or contact address. Wikimedia's
  [User-Agent policy](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy) asks automated
  clients for a way to reach them: to add one, set `VOX_UA_CONTACT=<a URL or e-mail of your choosing>` before running
  the tools (never set by default).
- Per-host throttle: Commons API <= 1 request/s (1.1 s gap), file downloads from upload.wikimedia.org one per 4 s, loc.gov 3.2 s (limit 20/min), Openverse 0.5 s, archive.org 0.6 s; 429/503 honour `Retry-After` (max 60 s, 4 tries).
- Openverse anonymous: ~20 req/min, 200/day, 240 results per query. Smithsonian uses `api_key=DEMO_KEY` (low hourly limit; set your own key in `source_images.py` if it throttles).
- Downloads: images <= 30 MB (Commons: original when <= 4500 px wide, else the 3840 px thumbnail), audio <= 20 MB.

## Known limits
- `loc.gov` answers scripts with a Cloudflare 403: `--source loc` falls back to Commons files that mention the Library of Congress.
- The Met, Rijksmuseum, IA texts and NYPL are not wired in; use the browser (see 09-assets).
- Smithsonian search is loose (keyword matches in any field): check the contact sheet.
- Free music rarely matches a tempo/mood exactly; ranking prefers tempo fit, length, tempo stability, low dynamics and low speech-band energy. If nothing fits, call `write_music_wanted()` or render a bed.
