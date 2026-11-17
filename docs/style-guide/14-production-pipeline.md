# 14 · Production pipeline: storyboard engine (schema, recipes, commands)

Part 1 covers idea → script → voice → assets → music. Part 2 (from §0 below) covers the **storyboard** that turns script, cues and assets into a video. The agent playbook that runs all of it is `.claude/skills/vox-video/SKILL.md`.

## Part 1 · Idea → script → voice → assets → music

| Step | Command / file | Output |
|---|---|---|
| 1. Project | `tools/py tools/studio/new_project.py <slug> "<idea>"` | `video-projects/<slug>/` with `project.json`, `script.md`, `storyboard.json`, `CREDITS.md` |
| 2. Research | WebSearch → `RESEARCH.md` | 6–12 sourced facts (no invented facts or quotes) |
| 3. Script | `script.md` in the markup of [13-story-to-screen.md](13-story-to-screen.md) | Vox-pattern narration with `[BEAT …]`, `*stress*`, `[PAUSE …]`, `[MUSIC …]`, `[SFX …]`, `[ARCHIVAL …]`. **The user approves it** |
| 4. Scratch VO | `tools/py tools/voice/scratch_vo.py video-projects/<slug>/script.md [--voice am_michael]` | `audio/vo_scratch.wav` (Kokoro-82M, ≈3.5 words/s, 0.48 s phrase pauses, −21.5 dBFS) + `vo.cues.json` whose words match the script exactly |
| 5. Recording guide | `tools/py tools/voice/recording_guide.py video-projects/<slug>` | `RECORDING_GUIDE.md`: pauses, stressed words, per-phrase target durations, mic/room/level tips |
| 6. Assets | (a) user files → (b) pieces cut from the user's reference (`vox-reference`: `tools/reference/ingest.py`, `scan.py`, `tools/assets/extract_assets.py` → `assets/ref/<id>/`) → (c) the shared catalog: `tools/py tools/library/search.py "<words>" [--fetch]` → `kit:assets/library/…` → (d) `tools/py tools/source/source_images.py "<query>" --project video-projects/<slug> [--cutout --bw]`; add good PD/CC0 finds to the catalog with `tools/library/add.py` | files in `assets/` (or `kit:` paths), every one credited (`CREDITS.md`, sourcing sidecars, or the catalog's `CREDITS.md`) |
| 7. Music | catalog beds (`search.py --kind music`, CC BY lines in its CREDITS.md) → `tools/py tools/source/source_music.py --mood "…" --bpm 60-90 --project …` → audition `audio/music/candidates.md`. Fallback: `tools/source/make_bed.py --bpm … --key … --mood … --length … --sections …` + `MUSIC_WANTED.md` for the user | a bed with its own cue file (`make_cues.py --no-words`) so the music can be snapped to its eighth notes |
| 8. SFX | reference SFX (`tools/audio/extract_sfx.py` → `assets/ref/<id>/sfx/`) → catalog SFX (`search.py --kind sfx`) → the procedural kit `public/audio/sfx/` (`make_sfx.py`) | placed by peak with `SfxAtPeak`/storyboard `sfx[]` |
| 9. Storyboard → render | Part 2 below | draft MP4 |
| 10. Hand-off | draft MP4 + `RECORDING_GUIDE.md` + `CREDITS.md` + `MUSIC_WANTED.md` | the user records the voice-over |
| 11. Final | `tools/py tools/studio/recue.py video-projects/<slug> my_vo.wav` → validate → publish → render | the video re-timed to the real voice (anchors are words, so nothing else changes) |

**Licensing.**
- Public domain, CC0 and US-government works are free to use.
- CC-BY and CC-BY-SA need the attribution string from the sidecar (description or end credits).
- The extracted Vox library is Vox Media copyright. The user accepted the risk for direct use. Prefer its grounds, marks and props, and keep recognisable Vox branding and their licensed archival photos out of published videos.
- Songs are never extracted. Find free-licence equivalents, or let the user supply licensed music.

## 0 · The idea in one paragraph

A video is `video-projects/<slug>/storyboard.json`: a list of **scenes**, each a **recipe** with props, cut in on a **spoken word**.
**Frames never appear in a storyboard.** Every time is a word of the voice-over script (`{word, nth, edge, offset}`), a scene id (`{after}`)
or, only in music-only passages, seconds. Durations come from the cue file. Re-record the voice-over, run `recue.py`, re-publish: the
whole video re-times itself (proof: §6).

```
video-projects/<slug>/                          public/projects/<slug>/ (git-ignored, written by publish_project.py)
  project.json   script.md  script.parsed.json    storyboard.json   vo.wav   vo.cues.json   manifest.json
  storyboard.json                                 assets/...  audio/music/...   (only files the storyboard references)
  assets/  audio/{vo_*.wav, vo.cues.json, music/, sfx/}  CREDITS.md
```

## 1 · Commands

| Command | Does |
|---|---|
| `tools/py tools/studio/new_project.py <slug> "<idea>"` | scaffold `video-projects/<slug>/` (project.json, placeholder script, 2-scene storyboard, CREDITS.md) |
| `tools/py tools/studio/validate_storyboard.py <slug> [--vo scratch\|user] [--write-anchors]` | check anchors/assets/credits/cuts/text/beats; `--write-anchors` fills `storyboard.json` `anchors` for `recue.py` |
| `tools/py tools/studio/publish_project.py <slug> [--vo scratch\|user] [--clean]` | incremental copy to `public/projects/<slug>/` (active VO + cues from `project.json`, referenced assets) |
| `tools/remotion-locked.sh still src/index.ts StoryboardVideo out/x.png --props='{"project":"<slug>"}' --frame=N --concurrency=2` | one frame |
| `tools/remotion-locked.sh render src/index.ts StoryboardVideo out/studio/<slug>.mp4 --props='{"project":"<slug>"}' --concurrency=2` | the video |
| `tools/py tools/studio/recue.py video-projects/<slug> my_vo.wav` | re-time to the real recording, then validate + publish again |
| `tools/py tools/studio/director.py <slug> [--json] [--mode guided\|key\|auto]` | director mode's data: each section's block, timing, narration and assets, the gaps with catalog recommendations, the next checkpoint; `--mode` saves the mode; `--suggest "<line>"` ranks the blocks that fit a line |
| `tools/py tools/studio/board.py <slug> [--open]` | `out/studio/<slug>-board.html`: one self-contained page, a card per section (a frame of the draft, a still or the block's wireframe; narration; assets; gaps) |
| `tools/py tools/voice/voice_samples.py --slug <slug> [--open]` | the first sentence in seven scratch voices, with a player page (`out/voice-samples/`) |

Loop: write script -> scratch VO + cues -> source assets -> write storyboard -> **validate** -> publish -> stills at the beats -> render.

## 2 · `storyboard.json`

TypeScript: `src/studio/types.ts`. JSON Schema: `src/studio/storyboard.schema.json`.

```jsonc
{ "version": 1, "fps": 25, "look": "voxEarworm",            // voxEarworm | voxLight | voxScrapbook | voxExplainer | voxEditorial | paperDesk | darkCollage
  "profile": "earworm",                                      // optional sync + mix profile (doc 11 §10); default: voxEarworm -> earworm, voxScrapbook -> scrapbook, any other look -> standard
  "vo":    { "gainDb": 0, "leadSec": 0 },                   // leadSec = music-only pre-roll before the voice starts
  "music": [ { "id": "bed", "src": "audio/music/bed.wav", "cues": "audio/music/bed.cues.json", "kind": "bed",
               "in": {"sec": 0}, "out": {"end": true}, "gainDb": -9.6, "fadeInSec": 0.7, "ride": true } ],
  "sfx":   [ { "src": "whoosh", "at": {"word": "Constitution"} } ],   // kit SFX name (peak on `at`) or an audio path
  "scenes": [ { "id": "deleted", "recipe": "KeywordCut",
                "start": {"word": "when"},                              // the cut INTO the scene
                "props": { "src": "assets/photo.jpg", "word": "DELETED" },
                "events": [ {"id": "pop", "at": {"word": "deleted", "kind": "pop"}} ],
                "transitionIn": {"kind": "blurThrough"} } ],
  "end": { "scene": "end", "tailSec": 3.5 } }                           // video ends at that scene's start + tail
```

### Anchors

| Form | Meaning |
|---|---|
| `{"word": "filibuster", "nth": 2, "edge": "start\|stress\|end", "offset": -3}` | a word of the script (case/punctuation-insensitive), nth occurrence (1-based) in the **cue file**; `start` = refined onset, `stress` = loudest syllable, `end`. `offset` in frames at the storyboard fps |
| `{"after": "sceneId"}` | the end of that scene |
| `{"sec": 12.5}` | absolute seconds: music-only passages only |
| `{"end": true}` | the end of the video |

`kind` supplies the **default offset and edge** from `SYNC` (doc 11 §2) when `offset`/`edge` are omitted; an explicit `offset` replaces the default.
Scene starts default to the profile's cut kind (`cut` in `earworm`, `phrase` in `standard` and `scrapbook`); events default to `object`; `until` anchors default to offset 0.

| kind | edge | offset (f @25) | for |
|---|---|---|---|
| `cut` | onset | 0 | keyword cut (illustrating cut: use +2…+5) |
| `object` | onset | +1 | collage / object entrance |
| `text` | onset | -7 | digits, typed key words (the narrator's graphics) |
| `pop` | **stress** | +1 | single-word kinetic pop |
| `title` | onset | +10 | credit / title confirming a name |
| `caption` / `lyric` | onset | -4 / +1 | archival speech / sung lyrics |
| `name` | onset | +4 | name card surname resolves |
| `exit` | onset | 0 | exit move on the next keyword |
| `phrase` | onset | -3 | cut placed on a phrase's **first** word (the `standard` profile's default scene start; the sample's cuts lead phrase onsets by 0–12 f) |
| `highlight` | onset | +1 | highlighter sweep or ring on a keyword (`DocumentHighlight` `hl<i>`) |
| `lowerThird` | onset | +2 | lower third on the person's first full-frame cut (anchor it on the cut) |

Offsets scale with `fps / 25`. `"snap": "beat"\|"eighth"` moves an anchor onto the grid of the first music track with `cues` (**only in music-only passages**; the validator rejects it on a cut under narration).

### Scenes

`id`, `recipe`, `start`, optional `end` (default: next scene's start; last: video end), `props`, `events`, `transitionIn` / `transitionOut`, `burst` (`standard` profile: allows the cut into this scene 3 f after the previous one, for montage bursts), `note`.

- **Chapter hole** (`transitionIn: {"kind": "cut", "hole": 12}`): the running bed ends `hole` frames (5–29) before the cut, and the next music cue (a track whose `in` lies within 24 f of the cut) starts the profile's `cueAfterCutF` after it (`standard` +3 f). It is the sample's chapter joint: no picture dip, a short digital silence, a hard cut. The hole needs a pause in the voice-over: a `phrase` cut 3 f before a word that follows straight on leaves only a few frames of silence.

- **Assets in props:** any string `assets/...` or `audio/...` is project-relative (published to `public/projects/<slug>/`); `kit:assets/cc0/...` is a kit file under `public/`. Every file needs a line in `CREDITS.md` (or a sourcing sidecar `.json`).
- **Anchors in props:** a key named `at`, `until`, or ending `At`/`Until` that holds an anchor object becomes frames **relative to the scene start** (`items[].at`, `rings[].at`).
- **Events:** `{id, at, until?, kind?}`; the recipe reads the ids it documents (table below) and falls back to a measured default relative to the cut. Unknown ids produce a validator warning.
- **Transitions** (`kind`): `cut` (default), `blurThrough` (4 f in / 14 f settle, sub-boom peak on the cut +1), `spinSwap` (whoosh on the swap), `dip` (`variant` act 18/17/36 or chapter 5/9/8, thump on the first black frame), `drop` (27/13/17), `glitchCut` (6 f dip, 4 f zoom blur, hard cut on a bass hit, 18 f glitch build: use for the end card), `paperSlide` (scrapbook look; `variant: "in"` 10 f: the new scene arrives on its own sheet from `corner` `bl`\|`br`\|`tl`\|`tr`, turning −25° → 0, ease-out; `"out"` 12 f: the old sheet leaves towards `corner`, turning +12°, accelerating; a paper swoosh peaks 2 f / 4 f in; measured 8 slides in 4:16). `sfx: false` mutes a transition's own sound. The scene's `start` is **the cut frame**. For `dip`/`drop` it is the first frame after the black: the fade-up *starts* there, and the new picture is fully up 17 f later for a `drop`. To land the full picture on a word, give that scene's start `offset: -17` (proven in a maintainer's test project). The engine renders both scenes inside the kit transition's window, time-shifted so each keeps its own clock. SFX budget ~1 per 13 s (validator warns).
- **Music:** `kind: "bed"` is a `MusicBed` ridden under the voice (measured duck: -2.4 dB under speech, 0.16 s attack, 0.26 s release; `ride: false` or `{duckDb, attackSec, releaseSec}`); `gainDb` is the gap level: set it so the bed's loudness sits ~7.6 dB under the voice (LUFS-matched: bed -20.1 LUFS vs voice -22.1 -> -9.6 dB). `kind: "song"` is a `SongExcerpt` (`startFromSec`, hard in, `fadeOutSec`), never under narration.

### Validator rules (`validate_storyboard.py`)

1. schema; scene ids unique; scene starts strictly increasing;
2. every anchor word exists in the cues (occurrence `nth`), with the resolved frame printed;
3. every asset exists and has a credits entry;
4. no two cuts (scene starts, `cut` events) closer than **6 f**;
5. text-type events (`text`, `title`, `name`, `caption`, `lyric`, `pop`) stay **>= 0.6 s** on screen (until `until` or the scene end);
6. beats: `snap` on a cut under narration is an error; a cut under narration within +-2 f of a bed beat is a warning (rule 3 of doc 11);
7. warnings: SFX budget, overlapping transition windows, scenes < 1 s, events a recipe does not read;
8. `standard` and `scrapbook` profiles: a `phrase` cut whose word has less than `pause_ms` of silence before it; SFX above the profile's budget (1.5 per minute in `standard`, 3 in `scrapbook`; +1); more than 2 music cue changes per minute; a music boundary more than 1.5 s from a cut; a `hole` outside 5–29 f; cuts 3 f apart only into a `burst` scene.

### Shorts (9:16): `format: "short"`

Measured on three official Vox Shorts (`analysis/vox-shorts.md`, §7 is the spec).

- **Format.** `"format": "short"` renders 1080×1920 (`--scale=2` → 2160×3840); `look` and `profile` work as before (Shorts use `voxLight` + `standard`).
- **Captions.** `"captions": true | {"pos": "bottom" | "seam", "replace": {...}}` burns in Vox's karaoke captions from the voice cue words:
  - Roboto 500 45 px, white, on a 26 % black backing.
  - Two-line pages filled to 735 px of ink by measured width; pages never cross a sentence end.
  - The current word sits on a lemon box that pops in (0.96 → 1.00 over 6 f) and turns on at the word's onset.
  - Position: block centre y 1688 (`bottom`), or y 1010 on a two-up seam (`seam`; scene field `captionPos`).
  - `replace` maps spoken words to display text, e.g. `{"twenty nineteen": "2019", "one hundred twenty": "120"}`; one box covers the replaced words.
  - All values are in `SHORT_CAPTION_STYLE` (`src/studio/ShortCaptions.tsx`).
- **Portrait recipes** (`src/recipes/short/`, registered in `SHORT_RECIPES`) are laid out on a 1080×1920 design space (table below).
- **Landscape recipes** still work in a short: they render as a centred band at ×0.63 (1210×680, overflowing the width as Vox does), with the look's ground over the whole frame (`shortBand: {"scale": …}` to change it; the validator warns).
- **QA.** `"debug": {"safeArea": true}` draws the area Vox keeps its text inside (top 7 %, bottom 8 %, right 12 %) for stills; remove it before the final render.
- **Vox Shorts grammar:**
  - Always full-bleed, hard cuts only, ≈ 10 cuts per minute.
  - A lemon hook card (`ShortHook`) is fully on at frame 0, so it is also the thumbnail, and leaves on the first cut after the opening sentence (3–10 s).
  - A name label on a person's first appearance only.
  - Speech from frame 0 at 2.5–3.0 words/s.
  - A full-frame end card 3–6 f after the last word.
  - Vox's Shorts run 80–110 s.

## 3 · Recipes (`src/recipes/`)

All take typed props + `ctx` (frames, events, cues, missing assets), are built only from kit devices (`src/earworm`, `src/earworm/fx`, `src/explainer`, `src/type`), look like the Earworm reference by default (black collage ground, torn B/W prints with `#E1E3E5` borders, periwinkle `#6B74DE`, condensed caps) and degrade to a labelled placeholder + a console warning when an asset is missing.

**Light look (`voxLight`).** `RecipeFrame` draws the look's ground (light grey paper; `paper: "light" | "lightGrid" | "lightGhost"`). Built for it so far: `DocumentHighlight` v2, `SeriesIdent`, `EndCard mode: "credits"`, `NameCardInterview card: "lowerThird"` and `FootageClip`. The other recipes still draw Earworm content (off-white caps, torn borders, periwinkle) and read wrongly on light paper: see `analysis/vox-framework-coverage.md` §6.3 and the gap list below.

| Recipe | Props | Events (default) | Kit devices |
|---|---|---|---|
| `ColdOpenYear` | `year`, `place?`, `pieces[{src,x,y,w,h,rotate?,hinge?,at?}]` | `year` (4), `place` | `FlyInGlyphs`, `LabelStrip`, torn photos + unfold |
| `KeywordCut` | `src`, `cutout?`, `word`, `side?`, `sub?`, `grade?` | `pop` (1), `sub`, `exit` | `TornPhoto` (slam), `KineticWord` |
| `PhotoCollageUnfold` | `items[{src,x?,y?,w?,h?,rotate?,hinge?,at?}]`, `title?` | `title` | `TornPhoto`, unfold, `KineticWord` |
| `NameCardInterview` | `src` (mp4 or still), `name`, `title?`, `affiliation?`, `window?`; `card: "decode"\|"lowerThird"`, `layout: "window"\|"fullframe"`, `lowerThird?{variant,bar,exit,role,x,baselineY,life}` | `resolve` (21), `lowerThird` (cut +2; start of the lower third), `exit` | `ZoomWindow`, `DecodeNameCard`, `LowerThird` |
| `KaraokeQuote` | `tokens[{text,t(seconds),phraseStart?}]`, `audio?`, `audioStartSec?`, `mode?`, `src?` | none | `KaraokeCaption` |
| `GiantWordCard` | `text`, `ground?`, `photo?`, `photoBox?{x,y,w,h,rotate}`, `converge?` | `converge` (0), `photo`, `exit` | `GiantWord`, `BlackCollageGround` white |
| `MontageCrane` | `items[{src,cutout?,w?,h?,x?,speed?,label?,at}]`, `dolly?` | none (`items[].at`) | `Multiplane` |
| `MapRoute` | `map`, `waypoints[{x,y}]`, `label?{title,sub}` | `route` (6; `until` = end), `label` | explainer `MapRoute`, `XMark`, `StationLabel` |
| `DocumentHighlight` | `src`, `box?`, `rings?[{cx,cy,rx,ry,at?}]` (colour from the look); v2: `ground: "collage"\|"theme"\|"fullbleed"`, `paper?`, `frame: "none"\|"browser"`, `highlights[{x,y,w,h?,at?,frames?}]`, `readAlong{lines[{x,y,w,h?}],at?,perLineF?}`, `isolate{x,y,w,h,at?}` (page blurs, the sentence strip lifts sharp), `push{to,cx?,cy?,at?,frames?}`, `source` | `ring<i>`, `hl<i>` (use kind `highlight`), `read`, `isolate`, `push` | `TornPhoto`, `HandRing`, flat multiply highlighter, `SourceLine` |
| `DataChart` | `mode counter\|bars`, `value`, `prefix/suffix`, `label`, `bars[]`, `ring?` | `count` (4; `until`), `label` | `HandRing`, kit type roles |
| `QuoteCard` | `quote`, `attribution?`, `wrap?` | `type` (4), `done`, `credit` | `TypewriterSlide` |
| `EndCard` | `title`, `tagline`; `mode: "series"\|"credits"`, `pages[[{role,names[],ruleAbove?}]]`, `right: "mark"\|{video,startFromSec?}`, `pageSec` (5.5), `silent` | none | `SeriesCard`, `CreditsPanel`; enter `series` with `glitchCut`, cut to `credits` 11 f after the last word |
| `FootageClip` | `src` (mp4/webm, needs a `CREDITS.md` line), `startFromSec`, `endAtSec`, `audio` (true), `audioDb` (re the voice), `audioLeadF` (J-cut 6–31 f), `bed: "duck"\|"out"\|"keep"`, `fit`, `pillarbox` (aspect, e.g. 1.3333), `grade: "native"\|"bw"`, `tag` (corner source tag), `dateTag{text,at?,style:"corner"\|"spine",life?}`, `lowerThird{name,role?,…}`, `subtitles[{text,t,until}]` (s after the cut) | `lowerThird` (cut +2), `date` | full-bleed `OffthreadVideo` in native colour; `CornerTag`, `DateTag`, `Subtitles`, `LowerThird`; its sound and the bed drop are played by `StoryAudio` |
| `SeriesIdent` | `title` (our own series name), `tagline?`, `style: "overPicture"\|"card"`, `src?`, `cardColor?`, `holdSec?` (4.2), `holeF?` | none; the sting goes in `sfx[]` (`sub_boom` / `bass_hit`) and the silence via `transitionIn: {kind: "cut", hole: N}` on the next scene (card 6, overPicture 13, EL-style 24 f @24) | `TitleRise`-style baseline mask, typed tagline, camera push |

**Scrapbook look (`voxScrapbook`, profile `scrapbook`).** Re-created from a Vox brand piece measured frame by frame (`analysis/vox-sample/vox_braintravel.md`, devices M1–M19; style guide doc 15): watercolour paper in one colour per chapter (`paper: "watercolour"`), torn scraps with a soft shadow, engravings multiplied onto the paper, a slate halftone serif, Caslon "fig." labels. 24 fps, 12 drawings/s. The recipes live in `src/recipes/scrapbook/`, their devices in `src/scrapbook/kit.tsx`. Colours are palette names (`pink`, `mint`, `blue`, `coral`, `white`, `cork`, `creamMap`, `sky`) or hex. The blocks in `examples/blocks/` with `look: voxScrapbook` show each one.

| Recipe | Props | Events (default) | Kit devices |
|---|---|---|---|
| `ChapterCard` | `number?` ("One": "Chapter One" on an aged scrap) or `kicker?` (a title or end card), `title`, `ground` (pink), `pieces[{src,x,y,w,h,rotate?,kind:"engraving"\|"print",at?}]`, `strip?`, `ink?` | `number` (14), `title` (number +4) | `ScrapGround`, `Scrap`, halftone title strip with a label wipe (8 f); engravings fade in multiplied (6 f), prints rise with a shadow (8 f). Holds 3–4 s |
| `PaperStat` | `value` (as it reads: "25,000"), `unit?`, `context?`, `payoff?` (caps), `image?` (full frame in a paper mat) or `ground` (sky), `source?` | `value` (2), `context` (value +4), `payoff` (value +10) | three torn scraps: the number on white, the context on a grey strip, the payoff in condensed caps on kraft; long lines shrink to one line |
| `StampedStat` | `value`, `caption?`, `sub?`, `page?` (ephemera image; default a drawn ledger page), `ink` (red\|purple\|black\|hex), `rotate` (−8°), `ground` (sky), `source?` | `stamp` (18) | the page rises (10 f), the camera pushes 1.3 → 1 (12 f), the stamp pops (3 f) with a distressed mask re-inked every 24 f; pair it with the `stamp_thud` SFX |
| `SpecimenPlate` | `title?` ("DIAGRAM OF …"), `subject{src,x,y,w,h,blend?,tumble?}` (w/h in the image's aspect), `backdrop?{color,d,cx,cy}\|false`, `magnifier?{x,y,r,bx,by,br,zoom,at?}`, `labels[{fig?,lines[],x,y,from?,at?,align?,width?}]`, `swap?{subject?,labels?[[]]}`, `source?`, `ground` (white) | `subject` (4), `backdrop` (subject +4), `magnifier` (subject +22), `label0`…`label3` (magnifier +4, +6 each), `source`, `swap` | `PlateFrame` (rounded hairline frame, tracked title), the subject tumbles +45° → 0 with a scale-up (14 f), a disc unfolds (12 f), magnifier ring + tangents + an enlarged circle, `SpecimenLabel` leaders |
| `SpecimenCompare` | `left` / `right` `{fig?,title,src?,callouts[],blend?}`, `legend?[]`, `ground` (pink), `reveal: "split"\|"pullback"`, `source?` | `left` (2), `right` (left +22), `callouts` (right +8) | a dashed rule at x 960 draws down (6 f); each half pops 0.82 → 1 (8 f); `pullback` starts ×1.6 on the left and pulls back in 10 f |
| `SpecimenInterview` | `src` (clip or still), `startFromSec?`, `fig?`, `name?`, `roles[]`, `ground` (pink), `watermark?`, `grade: "bw"\|"native"`, `window?{x,y,w,h}` | `label` (0: there from the first frame, as measured) | a deckle-edged print on the person's paper colour, a faint multiplied watermark, a `SpecimenLabel` on a leader; the clip's sound goes in the storyboard's audio plan |

**Portrait recipes** (layout `portrait`; only in a `format: "short"` storyboard; 1080×1920 design px). Rect coordinates in `ShortDocument` are in page-image pixels and need `size`.

| Recipe | Props | Events (default) | Kit devices |
|---|---|---|---|
| `ShortHook` | `text` (≤ 8 words, caps), `slot: "lower"\|"upper"` (box centre y 1420 / 1110), `src?`, `focus?{x,y}`, `w?` (864) | none (on at frame 0, off at the scene end) | lemon box, Roboto 900, full-bleed photo with a ≈ 6 % pull-out |
| `ShortPhoto` | `src?`, `focus?`, `move: "pullOut"\|"push"\|"drift"`, `label?{name,role?,at?,slot?,w?}`, `cards?[{src,at}]`, `counter?{value,prefix?,suffix?,label?,at?,y?}`, `credit?` (vertical), `tag?` (corner) | `label` (5 f after the cut), `card0`, `card1`, `counter` | Vox name label (lemon box, Roboto 900 name, Source Serif 4 italic role), stacked cards, number card |
| `ShortDocument` | `src`, `size{w,h}`, `pageW?` (1180), `x?`, `y?`, `highlights?[{x,y,w,h,at}]`, `isolate?{x,y,w,h,at,zoom?}`, `translation?{text,label?,at}`, `push?{to,cx,cy,at}`, `source?` | `hl0..2` (kind `highlight`), `isolate`, `translation`, `push` | page blur + strip lift, lemon multiply band, our translation strip, `SourceLine` |
| `ShortTimeline` | `items[{date,text,at}]`, `rest?` (0.40) | `item0..7` (kind `text`) | vertical rule, lemon date boxes, camera scroll |
| `ShortSteps` | `steps[{num?,text,at}]`, `title?` | `step0..5` (kind `text`) | numbered lemon squares joined by a rule |
| `ShortQuote` | `lines[{text,at}]`, `attribution{name,role?}`, `photo?` | `line0..7` (kind `highlight`) | read-along lemon sweep per line; our card, never a replica of a document |
| `ShortEnd` | `title` (our series mark), `tagline?` ("Sources in the description"), `ground: "lemon"\|"ink"` | none (mark 5 f after the cut, builds in 5 f; tagline 1.1 s later) | full-frame brand colour |

Claim -> recipe mapping and the script markup (`[BEAT recipe=... anchor="word"]`) are in doc 13.

## 4 · Examples

**`video-projects/example-time-zones`** ships with the repository as text only: script, research, storyboard, credits
and `build.json`. `npm run example` (`tools/examples/build_example.py`) rebuilds its media and renders it:
1. catalog files;
2. a Natural Earth map;
3. the scratch voice-over;
4. validate → publish → render.

- **Idea:** *"Why railroads gave America time zones"*, 80 words, 26 s of narration, about 30 s with the end card.
- **Research:** `RESEARCH.md`, 5 sourced facts. Contested details are noted there: the count of zones and the "only day
  with two noons".
- **Pictures:** 7 scenes from 5 recipes: ColdOpenYear, KeywordCut ×2, GiantWordCard ×2, MapRoute, EndCard.
  - Every image comes from the shared catalog (`kit:assets/library/…`).
  - The map is `make_maps.py region usa --time-zones`; its waypoints come from `make_maps.py locate`.
- **Sound:** a catalog bed ("Investigations", CC BY: the attribution line is in `CREDITS.md`) and a catalog page-flip
  SFX placed by its peak.
- **Validator:** 0 errors, 0 warnings.

**`video-projects/example-world-time`** ("How the world agreed on time", 39 s) uses ten different recipes, one per
section: PhotoCollageUnfold, SeriesIdent, MontageCrane, NameCardInterview, DataChart (counter and bars),
DocumentHighlight with word-anchored rings, QuoteCard, FootageClip and EndCard. The block gallery in `examples/` is
cut from these two projects by `tools/examples/make_gallery.py`. It renders with `"preview": true` (no grain,
weave, dust or pulse) and writes the GIFs, the scene JSON on each block page and the gallery tables.

**`video-projects/example-cab-brain`** ("How learning London changes a cab driver's brain", 49 s, 24 fps) is the scrapbook look's example:
ten scenes from the six scrapbook recipes and two `paperSlide` transitions, seven sourced facts (Maguire et al. 2000; Woollett & Maguire 2011),
engravings, maps and 1880s–1890s photographs from the catalog, a CC BY bed and two of the kit's sounds (`stamp_thud`, `chime`). Build it with
`tools/py tools/examples/build_example.py example-cab-brain`; the scrapbook blocks in the gallery are cut from it.

The maintainer's earlier pipeline builds are measured above and in doc 11 (a 71.8 s daylight-saving explainer; a
35.6 s filibuster test with a re-timed second read; recipe and profile builds). They stay in the maintainer's archive
and are not part of the repository. One lesson from them is kept here because it is the loop every user runs: the
filibuster test's first draft had a false line. Fixing it took:
1. one script edit;
2. `scratch_vo.py`;
3. `recue.py`, which flagged the storyboard anchors whose words had gone;
4. new anchors;
5. validate → publish → render.

## 5 · Re-timing (re-record the voice)

`recue.py` rewrites the cues (and `project.json`'s active VO); `publish_project.py` copies them; the next render uses them. Nothing in `storyboard.json` changes. `publish_project.py --vo scratch|user` flips between the two recordings of a project for comparison without touching `project.json`.

## 6 · Known gaps

Most recipes draw Earworm content (on `voxLight` they get the light ground but keep off-white caps, torn borders and periwinkle); the `DipAudio`/`DropAudio` handoffs and the phone EQ of archival audio are not automatic; `KaraokeQuote` takes word times in seconds relative to the scene (archival clips have no cue file in the pipeline yet); `NameCardInterview`, `MapRoute` and `KaraokeQuote` are exercised only by the recipe gallery project (see `src/studio/README.md`).

**Cross-series gaps**, ranked by score = videos using it (of 6 sample videos) × impact ÷ effort. Evidence, build specs and the full list are in `analysis/vox-framework-coverage.md` §6. Status after the build round of 2026-11-14 (the maintainer's test projects `_build-*`, archived, not in the repository):
1. **Built.** Plate-less lower third: `LowerThird`, via `NameCardInterview card: "lowerThird"` and `FootageClip lowerThird`. 6/6, score 12.
2. **Built.** Credits end card: `EndCard mode: "credits"` (`CreditsPanel`, our own mark, `silent`). The video panel (`right: {video}`) is untested. 6/6, 12.
3. **Built.** Highlighter in a recipe: `DocumentHighlight` v2 `highlights`. 5/6, 10.
4. **Built.** Chapter joint: `transitionIn: {kind: "cut", hole}`. 5/6, 10.
5. **Built.** Phrase-led cuts: the `phrase` kind, the default scene start of the `standard` profile. 5/6, 10.
6. **Built (lint).** Music plan: in `standard` the validator warns above 2 cue changes per minute; doc 13's Earworm music plan is unchanged. 5/6, 10.
7. **Built.** Series ident after the thesis: `SeriesIdent`. 5/6, 10.
8. **Built.** Static bed: the `standard` profile defaults to `ride: false` at −13 dB. 5/6, 10.
9. **Built.** Uncaptioned archival speech with its own sound: `FootageClip` (subtitles optional). 4/6, 8.
10. **Built.** `DocumentHighlight` full-frame page, browser frame and theme colours. 4/6, 8.
11. **Built.** On-screen source line: `SourceLine`, `DocumentHighlight source`, and the `FootageClip` corner tag. 4/6, 8.
12. **Built.** Full-frame footage in native colour with its own sound: `FootageClip`. 5/6, 7.5.
13. **Open.** Our own corner bug as a storyboard-level overlay. 6/6, 6.
14. **Open.** Recipes read the theme's accent (only `DocumentHighlight` does). 6/6, 6.
15. **Partly built.** Interviews: full-frame with sound via `FootageClip`; `NameCardInterview layout: "fullframe"` is still muted. 4/6, 6.
16. **Open.** `DataChart` line, area and stacked modes, title, axis and source line. 4/6, 6.
17. **Partly built.** The read-along highlight is built (`DocumentHighlight readAlong`); the line-chart draw is open. 3/6, 6 each.
18. **Open.** A `dissolve` transition (it exists only in a proof shot). 5/6, 5.
19. **Open.** Arrows and themed rings in recipes; a host-on-camera slot (use `FootageClip` for now). 5/6, 5.
20. **Partly built.** The light paper look `voxLight` exists (tokens, ground, finish). Its recipes are listed in §3; the choropleth map is open. 3/6, 4.5 each.

**Formats that need their own subsystem** (one sample video each): the remote conversation (two-up windows with layout switching from a diarized transcript), the isometric "hero object", and the satellite map engine of *Atlas*.
