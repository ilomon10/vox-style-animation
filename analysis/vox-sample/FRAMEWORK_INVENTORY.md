# Framework inventory (what we can already make), for the coverage matrix

This is a snapshot taken before the Vox-sample study. Device IDs are in `VOCABULARY.md`; this file says **where each capability lives** and **whether a storyboard can reach it**.

## Looks
There are five themes in `src/tokens/` (palettes, finish presets, shadows, photo grades, ≈ 30 easing curves, a duration table, 19 fonts, type roles per look, 7 paper kinds):
- `paperDesk`, `darkCollage`, `voxExplainer`, `voxEditorial`, `voxEarworm`.

**Only `voxEarworm` has storyboard recipes.** The other four only switch theme and finish.

## Style guide (`docs/style-guide/`)
| Doc | Scope |
|---|---|
| README | The five looks, universal rules, doc index, quick start, verification scores. |
| 01 style DNA | Ranked signature devices for four looks, do/don't, QA checklist (§1 line 13, QA line 86). |
| 02 colour | One palette per look; accent use by beat. |
| 03 typography | Fonts, type roles, text treatments. |
| 04 layout | Canvas, safe areas, composition patterns, layering, scale. |
| 05 textures | Paper and grounds, frame finish, objects and materials, photo treatments. |
| 06 motion | Drawing rate, easing, durations, entrances/exits, camera, paper-desk info devices, puppetry, holds. |
| 07 transitions | Which transition when (line 14); catalogues by ID (lines 26, 52, 66, 79). |
| 08 scene recipes | 26 shot templates: PD-1–11, DC-1–5, VX-1–8, ED-1–2 (lines 12, 136, 184, 247). |
| 09 assets | Licences, sources, cut-out pipeline, footage, sourcing tools. |
| 10 implementation | Stack, architecture, component reference (line 113), QA tooling, performance. |
| 11 audio sync | Seven rules, anchors, offsets, captions, music-only passages, mix, SFX (line 147), visualizers (line 161), pacing. |
| 12 Vox Earworm | Ranked devices (line 15), colour, type, layout, motion, transitions with sounds (line 107), recipes (line 121), asset gaps (line 166). |
| 13 story → screen | Twelve rules, structure: arc, per-minute targets, 60 s / 3 min / 8 min templates (line 172), claim → picture (line 38), claim → recipe (line 388), devices without a recipe (line 410), asset mix (line 433). |
| 14 pipeline | Idea → music steps, commands, `storyboard.json`, recipe table (line 121), examples, re-timing, known gaps (line 168). |

## Storyboard engine (`src/studio/`, `src/recipes/`, `tools/studio/validate_storyboard.py`)
- **12 recipes:** ColdOpenYear, KeywordCut, PhotoCollageUnfold, NameCardInterview, KaraokeQuote, GiantWordCard, MontageCrane, MapRoute, DocumentHighlight, DataChart, QuoteCard, EndCard.
- **Scene fields:** id, recipe, start, end, props, events `[{id, at, until, kind}]`, transitionIn/Out, note.
- **Anchors:** a word (nth, edge start/stress/end), after a scene, seconds, or end of video. Each takes an offset and a kind, and can snap to a beat or an eighth.
- **Event kinds:** cut, object, text, pop, title, caption, lyric, name, exit.
- **Transitions:** cut, blurThrough, spinSwap, dip (act/chapter), drop, glitchCut.
- **Music:** bed or song, with ducking and fades.
- **SFX:** one of the kit sounds or a file, placed by its peak.
- **Validator errors:**
  - schema;
  - unique, increasing scenes;
  - anchor words exist;
  - assets exist and are credited;
  - cuts at least 6 f apart;
  - text on screen at least 0.6 s;
  - no snap on a cut under narration.
- **Validator warnings:**
  - SFX budget;
  - overlapping transitions;
  - scenes under 1 s;
  - unknown events;
  - a cut under narration within ±2 f of a beat.

## Kit components (about 120; reachable only from code unless a recipe wraps them)
- **`src/earworm/`:** BlackCollageGround, TornPhoto, LabelStrip, KineticWord, KineticVoice, KaraokeCaption, DecodeNameCard, TypewriterSlide, GiantWord, TextFillSilhouette, XMark, AnnotationLabel, SeriesCard, FlyInGlyphs, StationLabel, VinylRecord, TypeWallpaper, HandRing, ZoomWindow.
- **`src/earworm/fx/`:**
  - transitions: BlurThroughCut, SpinSwap, DipToBlack, Drop, NewsprintMaskWipe, GlitchCut, MegaPullBack, SongIntro;
  - camera: Multiplane;
  - visualizers: SpectrumBars, KickScope, NeedleMeter, BokehVisualizer, ElectricBeam, SparkBoil;
  - sound helpers: SfxAtPeak, PHONE_EQ.
- **`src/collage/`:** CutOut, PhotoPrint, Tape, TapeLabel, StickyNote, FlagLabel, StampLabel, PaperClip, PushPin, FloorEllipse, TornPaper, DiagramCard, CropMarks.
- **`src/effects/`:** FilmFinish, Paper, Grain, ChromaticAberration, Levels, Vignette, DustLoop, Jitter, Exposure, Pillarbox.
- **`src/explainer/`:** DrawPath, PencilRing, HandDrawnRing, MarkerRing, MarkerUnderline, SketchArrow, CrossOut, LeaderLine, InsetMagnifier, DotGrid, DotPop/DotField/ColorFlash, BarChart, MapRoute, TimelineMarker, Callout.
- **`src/motion/`:** CameraRig (keys + drift, `snapStop`), Enter/Exit (9 types), Pendulum, PuppetLimb, Sway, Boil, MotionTrail, RadialBlur, keyframes.
- **`src/transitions/`:** Shot head/tail effects (zoom-through, flash-shrink, exposure-in, scale-momentum, whip, radial zoom, fade through/to black, crash zoom, snap zoom, rack focus, pull-back), LightningStrike.
- **`src/type/`:** HighlightBox, SubtitleReveal, Highlighter, TitleRise, Typewriter, HandwritingWriteOn, VideoCaption, BoilText, CenterOutReveal, LineWipe, WipeOff, ChunkPopOn, NeonText, BigFigure, SlotReel.
- **`src/audio/`:**
  - cue lookups (`cues.ts`) and `useCues`;
  - scheduling (`cueFrame`, `beatFrame`, `OnCue`, beat pulse, level);
  - Soundtrack: Narration, MusicBed (ducking), SongExcerpt, Sfx;
  - Visualizer: AudioBars, Waveform, PulseOnBeat, LyricLine;
  - `defaults.ts`: `SYNC` offsets and mix levels.

## Tools
- **`tools/studio/`:** `new_project`, `validate_storyboard`, `publish_project`, `recue` (re-time to the user's VO).
- **`tools/voice/`:** `script_markup`, `scratch_vo` (Kokoro TTS + cues), `recording_guide`, `measure_pace`, `vo_common`.
- **`tools/source/`:** `source_images` (open archives, licence and news-agency filter, cut-out/B&W), `source_music` (search + rank), `make_bed` (procedural bed + `MUSIC_WANTED.md`), `fetch_reference` (private YouTube reference ingest, Vox channel allowlist).
- **`tools/analysis/`, `tools/audio/`:** frames, metrics, shots, segments, sparse sheets, palette, compare, audio features, transcription, A/V timelines, sync stats, `preprocess_long.sh`.

## Known gaps before this study
- Recipes exist only for the Earworm look.
- PushThrough/PullThrough: doc-only (doc 12 §6).
- Tumble-assemble and snap-stop push: proof-only (`src/proof/earwormB/Radio.tsx`, `src/proof/earworm/Shot1.tsx`).
- NewsprintMaskWipe, MegaPullBack, SongIntro and the visualizers: kit-only.
- DipAudio/DropAudio handoffs and the phone EQ on archival audio: manual.
- Doc 13 §7.2 lists Earworm devices with no recipe.
