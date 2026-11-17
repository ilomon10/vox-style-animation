---
name: vox-reference
description: When the user attaches or links their OWN reference for a video — a video file, a YouTube/Vimeo URL, style frames, a mood board, a PDF or a soundtrack — and wants their video to look like it or reuse pieces of it, bring it into their project privately, scan it (contact sheets, palette, pacing, words) and cut its pieces into project assets: background plates, props, photos, hand marks, type samples, effect loops and sound effects. Use with vox-video whenever a reference is attached.
---

# Reference → assets for the user's project

The user gives a reference; you cut reusable pieces out of it for **their** project and note its style, so the video
can match it. Nothing from a reference ever leaves their machine through this repository (all of it is git-ignored).

## 0 · Workspace
Inside a checkout of https://github.com/ilomon10/vox-style-animation (if the working directory has no
`src/studio/StoryboardVideo.tsx`: `git clone --depth 1 https://github.com/ilomon10/vox-style-animation vox-studio && cd vox-studio && bash tools/setup.sh`).
`tools/py tools/doctor.py --quick` must say Ready. The project must exist: `tools/py tools/studio/new_project.py <slug> "<idea>"`.
Read `tools/reference/README.md` once.

## 1 · Rights (ask once, record it)
Ask who owns the reference unless it is obvious, and pass it as `--rights`:
- `own`: the user made it or holds its rights → pieces may ship in their published video.
- `third-party` / `unknown` (default): pieces are for look development and drafts only. Say so plainly; at hand-off,
  HANDOFF.md lists a replacement for each piece (shared catalog or web). Do not refuse: studying a reference is normal.
A URL is downloaded with yt-dlp: only do it for material the user may use, and say that.

## 2 · Ingest and scan
```
tools/py tools/reference/ingest.py <slug> <file|folder|URL> --rights <own|third-party|unknown> [--title "..."] [--id ref1]
tools/py tools/reference/scan.py <slug> <id>          # --lang <code> if the speech is not English
```
Then READ `video-projects/<slug>/reference/<id>/STYLE_NOTES.md` and LOOK at `scan/sheets/*.png` (video) or `scan/grids/*.jpg`
(images). Tell the user in a few lines what defines the look: grounds and colours, type, marks, pacing (cuts per minute,
shot length), camera moves, sound. Pick the closest kit look (`voxEarworm`, `voxLight`, `paperDesk`, `darkCollage`,
`voxEditorial`, `voxExplainer`) and say which recipes will carry it.

## 3 · Cut list (visual)
Plan 5–25 pieces that the video can actually reuse, by kind:
- `grounds`: clean background plates (method `plate`: median over a static stretch removes moving foreground; `tile` for a
  seamless repeat);
- `props` / `photos`: objects and printed photos (`rembg` for photos and objects, `lumakey` with `mode: matte` for prints on
  dark grounds);
- `marks`: hand-drawn arrows, rings, X marks, underlines (`chroma` against their colour, or `lumakey`);
- `type`: title cards and captions as look references (`lumakey` / `raw`);
- `fx`: short effect loops (`sequence` with `dedupe`);
- `frames`: one raw full frame per shot you will match (`raw`), for `tools/analysis/compare.py`.

Get exact coordinates: `tools/py tools/assets/extract_assets.py preview <frame> [<frame> ...] --manifest video-projects/<slug>/reference/<id>/assets.manifest.json`
draws a 100 px grid on native frames (`out/reference/<slug>/<id>/extract/preview/`): LOOK at them, then write the entries
into `assets.manifest.json` (methods and options: `tools/reference/manifest.template.json` and the extractor's docstring).
If the reference carries a channel logo, set `"watermark": [x, y, w, h]` so plates and cut-outs patch it out.

## 4 · Extract and check
```
tools/py tools/assets/extract_assets.py --manifest video-projects/<slug>/reference/<id>/assets.manifest.json
```
LOOK at `video-projects/<slug>/assets/ref/<id>/contact_sheet_<kind>.png`. Fix keys that leak ground or eat into objects
(adjust `params`, `--only <id> --force`). Every file is listed in the project's `CREDITS.md` automatically.

## 5 · Sound (optional)
```
tools/py tools/audio/sfx_candidates.py video-projects/<slug>/reference/<id>/audio48k.wav --words video-projects/<slug>/reference/<id>/words.json
```
Copy `tools/reference/sfx.manifest.template.json` to `reference/<id>/sfx.manifest.json`, add the windows worth keeping
(whooshes, hits, risers, room tone), then `tools/py tools/audio/extract_sfx.py --manifest …`. Clips that still contain a
voice are skipped automatically. Songs and score are never cut: describe them in the manifest's `music` list instead and
find a free bed (`vox-assets`, `tools/source/source_music.py`).

## 6 · Use and hand-off
- Storyboard paths: `assets/ref/<id>/<kind>/<file>` (SFX: `assets/ref/<id>/sfx/<clip>.wav`, peaks come from the sidecar).
- Match the reference's pacing from STYLE_NOTES (cuts per minute, shot length) within the vox-video rules.
- `validate_storyboard.py` warns about pieces from references the user does not own; HANDOFF.md must list each with a
  replacement before publishing.
- If the user owns the reference and wants to share pieces with everyone, promote them:
  `tools/py tools/library/add.py promote <file> --owner-confirmed --author "<name the user gives>" --title ... --kind ... --theme ... --tags ...`
  (CC0; published later as a release asset). Only with the user's explicit yes.
