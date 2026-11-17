# 10 · Remotion implementation

The kit in `src/` implements this guide. Coding rules for contributors are in `src/CONVENTIONS.md`.

## Stack & commands

- Remotion **4.0.539**: every `@remotion/*` package is pinned to exactly this version.
- React 19, TypeScript strict.
- Fonts come from `@remotion/google-fonts` (loaded in `src/tokens/fonts.ts`).

```bash
npm install
npm run studio                                         # Remotion Studio: galleries + proof shots
npx tsc --noEmit                                       # typecheck
npx remotion still  src/index.ts ProofVoxExplainer out/f120.png --frame=120
npx remotion render src/index.ts ProofVoxExplainer out/vox.mp4               # 1920×1080
npx remotion render src/index.ts ProofVoxExplainer out/vox-4k.mp4 --scale=2  # 3840×2160
tools/py tools/textures/generate_textures.py         # regenerate procedural textures
tools/py tools/analysis/compare.py epigenetics@5.8 out/f120.png   # style-match QA
```

**Low-memory machine.** Run every Remotion command through `tools/remotion-locked.sh` with `--concurrency=2` or less, for example:

```bash
tools/remotion-locked.sh render src/index.ts StoryboardVideo out/studio/<slug>.mp4 --props='{"project":"<slug>"}' --concurrency=2
```

The script takes a machine-wide `flock` on `out/.render.lock`, so parallel agents queue instead of running out of memory. The arguments are the same as `npx remotion`.

`remotion.config.ts` renders PNG intermediates, H.264 with **CRF 14** (grain needs bits), `yuv420p`. If you deliver through a platform that re-encodes heavily (~5 Mbps), make the grain about 1.3× stronger (`analysis/quantitative.md` §3).

## Architecture

```
src/
  lib/        stage.tsx (Stage, DesignSpace, useStage)  time.tsx (12-drawing clock)  random.ts (seeded)
  tokens/     colors · easing (CURVES, ease()) · motion (DUR, RATE) · fonts · type (roles, CAP_RATIO)
              finish (FINISH presets, SHADOWS, PHOTO_GRADE, DESK_SPLIT) · theme (THEMES, StyleProvider)
  effects/    FilmFinish, Paper, Grain, ChromaticAberration, Jitter, Vignette, DustLoop, Levels, Pillarbox, Exposure
  collage/    CutOut, PhotoPrint, Tape, StickyNote, StampLabel, FlagLabel, TapeLabel, props (clip, pin, ellipse, torn paper, card, crop marks)
  motion/     CameraRig, keyframes, Enter/Exit, Pendulum, PuppetLimb, Sway, Boil, MotionTrail, RadialBlur
  transitions/Shot (+17 head/tail presets), LightningStrike
  type/       HighlightBox, SubtitleReveal, Highlighter, TitleRise, Typewriter, HandwritingWriteOn, VideoCaption,
              BoilText, CenterOutReveal, LineWipe, WipeOff, ChunkPopOn, NeonText, BigFigure, SlotReel
  explainer/  DrawPath, PencilRing, HandDrawnRing, MarkerRing, MarkerUnderline, SketchArrow, CrossOut, LeaderLine,
              InsetMagnifier, DotPop/DotField/ColorFlash, BarChart, MapRoute, TimelineMarker, Callout
  gallery/    one visual test bench per area (EffectsGallery, CollageGallery, MotionGallery, TypeGallery, AnnotationGallery)
  audio/      cue files (useCues, cueFrame, OnCue), measured SYNC offsets, Narration/MusicBed/SongExcerpt/Sfx,
              AudioBars, Waveform, PulseOnBeat, LyricLine
  earworm/    voxEarworm devices: BlackCollageGround, TornPhoto, LabelStrip, KineticWord, KineticVoice,
              KaraokeCaption, DecodeNameCard, TypewriterSlide, GiantWord, TextFillSilhouette, XMark,
              AnnotationLabel, SeriesCard, FlyInGlyphs, StationLabel, VinylRecord, HandRing, ZoomWindow, TypeWallpaper
  earworm/fx/ sound-locked transitions (BlurThroughCut, SpinSwap, DipToBlack, Drop, NewsprintMaskWipe,
              MegaPullBack, SongIntro, GlitchCut), Multiplane crane, SpectrumBars, KickScope, NeedleMeter,
              BokehVisualizer, ElectricBeam, SparkBoil
  studio/     storyboard engine: types + JSON Schema, resolve (word anchors → frames), Timeline, StoryAudio,
              StoryboardVideo composition (duration from the cue file)
  recipes/    12 scene recipes driven by storyboard data (RECIPES registry in index.ts, shared ctx helpers)
  proof/      ProofPaperDesk, ProofDarkCollage, ProofVoxExplainer, ProofEditorial,
              ProofEarworm + ProofEarwormB/C/D (private sync proofs of the whole episode)
tools/
  audio/      audio_features.py (per-frame features, tempo, beats) · transcribe.py (faster-whisper words) ·
              make_cues.py (narration/music → cue JSON with refined onsets, stress, tempo map) ·
              make_sfx.py (procedural SFX + peak sidecars, offline phone EQ) · make_demo_track.py ·
              av_timeline.py (audio-visual timeline images) · av_sync.py (sync statistics) ·
              extract_sfx.py (voice-safe SFX cut from a reference) · sfx_candidates.py (onsets away from speech)
  analysis/   extract_frames.sh, frame_metrics.py, shots.py, contact_sheets.py, palette.py, compare.py,
              sources_registry.py (sources.json + the git-ignored sources.local.json), frames.py (on-demand frames)
  studio/     new_project.py · validate_storyboard.py · publish_project.py · recue.py (re-time to a new recording)
  voice/      scratch_vo.py (Kokoro TTS scratch voice-over + cues) · recording_guide.py · measure_pace.py
  source/     source_images.py (PD/CC/gov images + credits, optional cut-out) · source_music.py · make_bed.py
  assets/     make_cutouts.sh · cutout_recipes.sh · scissor_cut.py · ai_cutout.py ·
              extract_assets.py (cut a reference into grounds, props, marks, type, fx, frames)
  library/    catalog.py · fetch.py · search.py · add.py · stage.py · make_marks.py · make_maps.py (the asset catalog)
  reference/  ingest.py · scan.py (a user's reference → assets for their project)
  examples/   build_example.py   ·   dev/ release_audit.py   ·   setup.sh · doctor.py · py · lock.sh
  textures/   generate_textures.py, earworm_textures.py
remotion-locked.sh  every Remotion command, one at a time
```

### The frame pipeline

```
<StyleProvider style="paperDesk">          theme: palette, type roles, finish preset, drawing rate (12/s)
  <FilmFinish>                             output-res finish: RGB split / lens CA → grain → dust → vignette (+weave)
    <DesignSpace>                          1920×1080 design px, scaled to the output size
      <Series>
        <Series.Sequence durationInFrames={…}>
          <Shot head={overscaleSettle-like} tail={punchIn-like}>   motion wrapped around the cut
            <CameraRig keys={…} drift={…}>                         2D camera over the world, stepped
              <Paper kind="grid" width={2600} height={1500}/>      the ground lives inside the camera
              …objects, type, annotations (design px, world coords)…
            </CameraRig>
          </Shot>
        </Series.Sequence>
      </Series>
      <VideoCaption …/>                     persistent layers sit outside the Series, so they cross cuts
    </DesignSpace>
  </FilmFinish>
</StyleProvider>
```

### Three clocks

| Clock | Hook | Used for |
|---|---|---|
| drawing clock (12/s, sequence-relative) | `useDrawingFrame()` / `useDrawingIndex()` | every graphic animation and camera move; grain seeds |
| frame clock (on ones) | `useCurrentFrame()` inside `<OnOnes>` | footage, caption fades, film weave, final fade, rendered zoom-throughs |
| custom rate | `<DrawingRate rate={6}>` / `useDrawingFrame(4)` | hold boil (6/s), title boil (4/s), crumple (on fours) |

`posterize(frame, fps, 12)` gives `0,0,2,2…` at 24 fps and `0,0,0,2.5,2.5,5…` (3/2 holds) at 30 fps. The grid restarts in every `<Sequence>`, exactly like the references.

### Resolution independence
- `DesignSpace` lays out a 1920×1080 box and scales it to the composition size. Text and SVG re-rasterise sharp at 4K.
- Effects that must be native-resolution (grain, weave, vignette, CA offsets) live in `FilmFinish`, outside `DesignSpace`, and multiply design px by `useStage().u`.
- Raster assets need ≥ 2× their design size for 4K.

**Portrait (Shorts).** `DesignSpace` lays children out on the active design size: 1920×1080 by default, or 1080×1920 inside `DesignSizeProvider` / with `design={DESIGN_PORTRAIT}`. `useStage().u` follows the active design width. In a `format: "short"` storyboard each scene gets the size of its recipe's layout. Portrait recipes fill the frame; a landscape recipe is drawn as a centred band at `DESIGN_BAND_SCALE` (×0.63, Vox's measured value), and `RecipeFrame` draws the look's paper over the whole portrait frame. Landscape storyboards render exactly as before.

## Component reference (key props; all times in frames, relative to the enclosing Sequence)

### Effects (`src/effects`)
| Component | Props | Notes |
|---|---|---|
| `FilmFinish` | `preset?` (default theme), `overrides?` (`null` removes a layer), `enabled?`, `dustVariant?`, `seed?` | wrap the whole film; 4K cost ≈0.6 s (collage) to 2.5 s (radial CA) per frame |
| `Paper` | `kind?` (`warm` `grid` `desk` `dots` `board` `blackCard` `crumpled`), `color?`, `width`, `height`, `seed?`, `pulse?`, `edgeWear?` | tileable; place inside the camera; size it to the world |
| `Grain` | `sigma` (levels), `sizePx`, `rate` (0 = static), `blend?` | hard-light, calibrated: opacity = σ / (41 × 0.78); 1080p = 4K |
| `ChromaticAberration` | `split` (`uniform` or `radial`) | standalone wrapper |
| `Jitter` | `sigmaPx`, `clampPx`, `rate` (`"frame"` or per s), `overscan` | film weave / hold boil |
| `Vignette` | `strength`, `power` | multiply, r = distance / half-diagonal |
| `DustLoop` | `opacity`, `drawings`, `rate`, `variant` (`bright` or `mixed`) | dark-collage film damage |
| `Levels` | `black`, `white` | for raw footage only (tokens are final colours) |
| `Pillarbox` | `aspect` (4/3), `color` | Vox 4:3 window |
| `Exposure` | `brightness`, `blur`, `contrast`, `unit` | used by lightning, flash and rack focus |

### Motion (`src/motion`)
| Component | Props | Notes |
|---|---|---|
| `CameraRig` | `keys: {at, x, y, scale?, rotate?, ease?}[]`, `drift?: {vx, vy, zoomPerSec, from?}`, `stepped?` (true), `onOnes?` | x/y = the world point at the frame centre; scale interpolated in log space; a key's `ease` shapes the segment *arriving* at it. "Already moving on frame 0" = key at 0, next key with `ease: "settle"` |
| `keyframes(keys, frame, {logScale})` / `useKeyframes(keys, {stepped})` | `{at, value, ease?}` | numbers or `{x, y, scale, rotate}` |
| `Enter` | `type` (`drop` `rise` `slideLeft` `slideRight` `scaleIn` `pop` `maskedRise` `gravityDrop` `burst`), `distance`, `delay`, `duration`, `ease`, `startRotate`, `firstFrameProgress`, `mask={{y}}`, `anchor`, `fromScale`, optional box `x y width height` | nothing is drawn before `delay`; `slideLeft` moves left (enters from the right). **Around absolutely positioned objects (CutOut, PhotoPrint…), pass the object's box** and place the object at 0,0 inside; otherwise scale and rotate pivot on the wrong point |
| `Exit` | `type` (`fallOut` `slideOut` `shrink`), `at`, `duration`, `distance`, `direction`, `endRotate` | ease-in |
| `Pendulum` / `PuppetLimb` / `Sway` / `Boil` | angles+step / pivot+angle+raise/hold/lower / x,y,rotate,speed / every,amp,rotate | puppetry and idle life |
| `MotionTrail` / `RadialBlur` | `dx, dy, count, opacity` / `strength, copies, origin` | fake motion blur, zoom blur |

### Transitions (`src/transitions`)
`<Shot head={…} tail={…}>` wraps a shot's contents and applies effect descriptors over its first and last frames. Each factory takes optional overrides; defaults are the measured values (07):

| Factory | Use |
|---|---|
| `zoomThroughOut()` / `zoomThroughIn()` | push-in-through / zoom-through (Vox speed-ramped push cut) |
| `flashShrinkOut()` / `exposureIn()` | card → footage |
| `scaleMomentumOut()` / `scaleMomentumIn()` | slideshow chain |
| `whipOut()` / `whipIn()` | whip/slide-through with a trail |
| `radialZoomOut()` / `radialZoomIn()` | powers of ten |
| `fadeThroughBlack()` / `fadeThroughBlackIn()` | dark collage continuity fade |
| `fadeToBlack()` | ending (on ones) |
| `crashZoom()`, `snapZoom()`, `rackFocusIn()`, `pullBack()` | punctuation |

`<LightningStrike at bolt>` is a mid-shot effect (bolt early, then a double strike).

### Type (`src/type`)
Type components render **in flow**: position them with an absolutely-positioned wrapper. Each takes a `role` (default from the style's type tokens), `delay`, `duration` and `style`.

| Component | Key props |
|---|---|
| `HighlightBox` | `variant` (`flat` `glow` `sharpenInside`), `color`, `ink` |
| `SubtitleReveal` | `pxPerSec` |
| `Highlighter` | `variant` (`marker` = Vox multiply, `editorial` = mustard dry brush, `paperDesk` = lemon multiply sweep), `color`, `ease` (curve token, e.g. `"linear"` for the editorial title stroke), `cap` or `width`/`height`, `fadeOut*` |
| `TitleRise` | `"\n"` for lines, `stagger` |
| `Typewriter` | `cps` or `schedule`+`scheduleFps` |
| `HandwritingWriteOn` | `cps`, `secondColor`, `seed` |
| `VideoCaption` | `tone` (`dark` `bright`), `triangleIn` (`cut` `riseSpin`), `endAt`, `x`, `textX`, `baseline` |
| `BoilText` | `rate`, `sigmaX`, `sigmaY`, `clamp`, `rotation` |
| `CenterOutReveal`, `LineWipe`, `WipeOff`, `ChunkPopOn` | editorial reveals |
| `NeonText`, `BigFigure` | `BigFigure`: `value`, `prefix`, `countUp`; spaces as thousands separators |
| `SlotReel` | `words`, `target`, `box` |
| `LowerThird` | interview lower third, measured on the 2024–26 Vox videos. `name`, `role?`, `variant` (`house`: Source Serif 4 Bold name cap 58, Inter role, lemon `#FDF203` bar; `stripe`, `tab`, `card` = series variants), `bar` (`worm` on threes / `wipe` on ones), `exit` (`flicker` / `retract` / `none`), `delay` = 2 (cut +2 f), `life` = 120, `x` = 236, `baselineY` = 835, `seed`. Letters fade in scattered on twos over 0–12 f; the role drops in at f13–21. Render inside `DesignSpace` |
| `SourceLine` | on-screen source credit ("Source: …"): `text`, `x` = 93, `y` = 1026 (baseline), `at` (default the cut, no animation), `variant` (`serif` on `voxLight`, `sans` = Inter 500 cap 15 elsewhere), `color`, `cap` |
| `CornerTag` | source tag on third-party footage: translucent plate at x 140, y 0, text cap 21 (CR), `look: "plate" \| "text"`, `at`; no platform icons (they are real marks) |
| `DateTag` | `style: "corner"` (cream year top-left, cap 84, AM) or `"spine"` (VHS-spine box 896×196: glitches in over 14 f, digits slide in over 12 f on twos, DA); `text`, `at`, `life`, `seed` |
| `Subtitles` | `items[{text, t, until}]` (seconds after the cut): white bold grotesque, x 100, baseline 994, cap 54, soft shadow, no box, hard on/off |

Box padding and highlighter bands are measured in cap units (CSS `text-box: trim-both cap alphabetic`).

### Annotations & data (`src/explainer`)
These take **absolute design-px coordinates** and are their own layers.

| Component | Key props |
|---|---|
| `DrawPath` | `paths: Pt[][]`, `color`, `width`, `roughness`, `strands`, `taper`, `easing`, `progress`; inside `<Layer>` |
| `PencilRing`, `HandDrawnRing` (`variant` `maroon` or `white`), `MarkerRing` | `cx, cy, rx, ry` |
| `MarkerUnderline` | `x1, x2, y` |
| `SketchArrow` | `from, to` |
| `CrossOut` | `x, y, w, h` |
| `LeaderLine` | `points` |
| `InsetMagnifier` | `pin`, `circle`, `diameter`, `connector` (`L` or `cone`), `children` (default `DotGrid`) |
| `DotPop` / `DotField` / `ColorFlash` | dot pops with stagger; colour flash render prop |
| `BarChart` | `data`, `x, y, height, max`, `title`, `source`, `ring` |
| `MapRoute` | `waypoints`, `preset` (`darkCollage` or `paperDesk`), `pins`, `renderPin`, `renderHead`, map as `children` |
| `TimelineMarker` | `x, y, year` |
| `Callout` | `cx, cy, r, label, text`: the disc → leader → label trio |

### Collage (`src/collage`)
Every collage component takes a `Place`: `x`, `y` (top-left, design px), `rotate` (degrees about its centre) and `style`.

| Component | Key props | Notes |
|---|---|---|
| `CutOut` | `src` (relative to `public/`), `width`, `height` (both required), `echo?` (`ECHO.crimson` (−32,−25) / `ECHO.yellow` (+9,+12) or custom), `sticker?: {width, color}`, `inkKey?`, `tone?`, `duotone?`, `shadow?` (`SHADOWS` key or CSS), `flip?` | flat 0-blur echo; no shadows for the dark collage |
| `PhotoPrint` | `variant` (`desk` 4.7 % border; `card` rounded + yellow edge; `polaroid`; `vox` deckled), `src` or `children` (e.g. `<OffthreadVideo>`), `width`, `height` (outer size), `tone`, `shadow`, `edge` | |
| `Tape` | `variant` (`opaque` `lime` `black` `masking` `clear`), `width`, `height`, `ends` (`straight` `zigzag` `torn`), `seed`, `delay?`, `duration?` | with `duration` it is pulled on L→R |
| `StickyNote` | `text`, `delay`, `duration`, `still` | peels over `DUR.stickyPeel` (20/40/85/100 %) |
| `StampLabel` | `text`, `tape` | scalloped slip, Didone |
| `FlagLabel` | `text`, `delay`, `duration`, `leader: {dx, dy}` | unfurls; width fits the word |
| `TapeLabel` | `text`, `text2`, `tape` (`lime` `black`), `clip`, `delay`, `framesPerChar` | unfurl + write-on |
| `PaperClip`, `PushPin` (`delay`), `FloorEllipse`, `TornPaper` (`echo`), `DiagramCard`, `CropMarks` (`corners`, `inset`, `length`) | | |

Cut-outs shipped in `public/assets/cutouts/` (see its `SOURCES.md`): `victorian-man`, `vintage-car`, `bran-castle-ink`, `bat`, `candelabrum`, `furniture-{chair,table,bench,sphinx}`. Rebuild them with `bash tools/assets/make_cutouts.sh [magick|ai|man|car]`. AI matting runs rembg in `tools/.venv` with `birefnet-portrait` / `isnet-general-use`, never `bria-rmbg`.

### Audio sync (`src/audio`) — rules in [11-audio-sync.md](11-audio-sync.md)
| API | Use |
|---|---|
| `useCues("vo")` → `CueIndex` | load `public/audio/vo.cues.json` (from `tools/audio/make_cues.py`); frames converted to the composition fps |
| `findWord(text, nth)` / `findWordStress` / `findWordEnd`, `phraseStarts()`, `phraseEnds()`, `wordAt(f)` | narration anchors (onset = refined speech attack) |
| `nearestBeat`, `snapToBeat`, `snapToEighth`, `beatsBetween`, `downbeats`, `eighths` | music anchors (local tempo map) |
| `cueFrame({cues, word, nth, edge: "start" \| "stress" \| "end", offset})`, `beatFrame`, `<OnCue at lead>` | turn anchors into frames / start children on a cue |
| `SYNC`, `syncF(f, fps)`, `AUDIO_DEFAULTS` | measured offsets (frames @25) and mix defaults |
| `<Narration>`, `<MusicBed duckUnder>`, `<SongExcerpt>`, `<Sfx at>` | soundtrack with measured riding / handoffs |
| `useAudioLevel(band)`, `useBeatPulse()`, `AudioBars`, `Waveform`, `PulseOnBeat`, `LyricLine` | audio-reactive visuals from the cue envelope (no decoding at render time) |

### Earworm look (`src/earworm`, `src/earworm/fx`) — spec in [12-vox-earworm.md](12-vox-earworm.md)
| Component | Notes |
|---|---|
| `BlackCollageGround {variant, seed, weave}` | outside `DesignSpace`; the ground weaves on its own (whole px, 2–5 px every 4–6 f) |
| `TornPhoto {src, x, y, width, height, boil, slam, circleCrop}` | B&W cut-out with torn white border; circle crop with break-out |
| `LabelStrip`, `XMark`, `AnnotationLabel` | labels on charcoal torn strips; light annotation with X bullet + arrow |
| `KineticWord`, `KineticVoice`, `KaraokeCaption` (+ `captionTokens(cues…)`) | word pops on stress, archival voices spelled as heard, karaoke on the vocal |
| `DecodeNameCard {resolveAt}`, `TypewriterSlide {finishAt}`, `GiantWord {children}`, `TextFillSilhouette`, `SeriesCard` | name cards, typed titles, giant word with a photo inside, text-filled shapes, your own series card |
| `FlyInGlyphs`, `StationLabel`, `VinylRecord` | per-digit fly-in ("1976"); cursor bar → box wipe → scrambled type-on label; record fly-in + spin + needle (pair with `SongIntro`) |
| `HandRing {cx, cy, rx, ry, delay, duration}` | hand-drawn ring around a word, drawn on in 6–8 f, closing with an overlap (1.08 turns) |
| `ZoomWindow {src, x, y, width, height, radius}` | interview/footage window on a `#0C0C0C` plate, playing at its native rate |
| `TypeWallpaper {text, cap, drift, rows}` | oversized light-grey type rows drifting behind a collage (−45 px/s on the drawing grid) |
| `BokehVisualizer {cues, onAt, barsAt}`, `ElectricBeam {at, until}`, `SparkBoil {x, y, at, level}` | audio-keyed glows: bokeh dots that sprout bars from the low band, a beam keyed to a source, boiling spark strokes |
| `BlurThroughCut`, `SpinSwap`, `DipToBlack`, `Drop`, `NewsprintMaskWipe`, `MegaPullBack`, `SongIntro`, `GlitchCut` | each also has a pure `…Plan(at)` returning its SFX placements; peaks land within 0.25 f of the picture event (measured) |
| `Multiplane` (+ `craneKeysFromCues`) | crane through depth layers, keyed to narration words |
| `SpectrumBars`, `KickScope`, `NeedleMeter` | measured visualizers (gate −12 dBr + 2 f look-ahead; kick ≥ 8 dB, 0 f lag; keyframed needle) |
| `SfxAtPeak`, `SfxList` | place a procedural SFX (`public/audio/sfx/*.wav` + `*.json` peak sidecars) by its PEAK frame |
| `CreditsPanel {pages, pageFrames, delay}` | credits end card's left panel (`#292929`, 36 % W): a white rule grows from a centre dot to full height with lemon dot ends (24 f), Title-case serif roles over light-blue caps names, pages swap by fade (7 f out, 1 empty frame, 6 f in). Used by `EndCard mode: "credits"` |

### Storyboard engine (`src/studio`) and recipes (`src/recipes`): spec in [14-production-pipeline.md](14-production-pipeline.md)

A whole video is data: `video-projects/<slug>/storyboard.json`. `tools/studio/publish_project.py` copies it with its voice-over, cues and assets to `public/projects/<slug>/`, and one composition renders it.

| API | Use |
|---|---|
| `StoryboardVideo` (composition, `props: {project}`) | `calculateStoryboardMetadata` loads `storyboard.json` + `vo.cues.json`, resolves every anchor, probes assets, and sets fps and duration (the `end` scene start + `tailSec`) |
| `resolveStoryboard()` (`resolve.ts`) | anchors → frames. `{word, nth, edge, offset, kind}` goes through `cueFrame` plus the offset of its `kind` (`cut`, `object`, `text`, `pop`, `title`, `caption`, `lyric`, `name`, `exit`, `phrase`, `highlight`, `lowerThird`) from the storyboard's sync profile. Other forms: `{after: sceneId}`; `{sec}` (music-only passages); `{end}`. SFX path items are shifted by their sidecar `peakSec`, so the **peak** lands on the anchor. Chapter holes (`transitionIn.hole`) and the profile's bed defaults are baked into the resolved music tracks |
| `SYNC_PROFILES`, `MIX_PROFILES`, `profileOf(profile, look)`, `bedDefaults` (`src/audio/profiles.ts`) | the `earworm` profile (= `SYNC` + `AUDIO_DEFAULTS`, unchanged) and the `standard` profile measured on the 2019–26 sample (doc 11 §10). `voxEarworm` or no look → `earworm`; any other look → `standard` |
| `Timeline` | the scenes as `Sequence`s on the resolved cut frames. A sound-locked transition (`blurThrough`, `spinSwap`, `dip`, `drop`, `glitchCut`) wraps each cut with its own SFX |
| `StoryAudio` | `Narration`, `MusicBed` (measured ride: bed ≈ −10 dB under voice, swells in gaps), `SongExcerpt`, `SfxAtPeak` |
| `RECIPES` (`src/recipes/index.ts`) | recipe name → `{component, events}`. A scene's `recipe` picks the component; its `props` pass through. Prop keys named `at`, `until` or `*At` hold anchors |
| `ShortCaptions` (`src/studio/ShortCaptions.tsx`) | burned-in karaoke captions for `format: "short"`, built from the voice cue words (spec: `analysis/vox-shorts.md` §7a). Every style value is in `SHORT_CAPTION_STYLE` |
| `SafeArea` (`src/studio/SafeArea.tsx`) | QA overlay of the area Vox keeps its text inside (`SHORTS_SAFE_AREA`), with storyboard `debug.safeArea` |
| `RecipeCtx` (`src/recipes/shared.tsx`) | what every recipe gets: scene frames, resolved `events` (`ev(ctx, id, fallback)`, `evUntil`), cues, missing assets, seed. Helpers: `SafePhoto` / `SafeCutout` (labelled placeholder + one console warning when an asset is missing), `Unfold`, `CapsLine`, `RecipeFrame` (`ground: "auto" \| "collage" \| "theme" \| "none"`, `paper?`: `auto` keeps the black collage on `voxEarworm` and draws the look's paper on `voxLight`) |

**Adding a recipe.**
1. Write a component in `src/recipes/` from kit devices only. Use tokens, the 12 drawings/s clock, and `ev()` for every time.
2. Register it in `RECIPES` with its event ids.
3. Add its props to the schema (`src/studio/storyboard.schema.json`) and to the recipe table in doc 14 §3.
4. Exercise it in a storyboard (a copy of `video-projects/example-time-zones` is a quick start) and look at the stills.

## Recipe → code

```tsx
// PD-1 product card (paper desk, 30 fps)
<Shot head={zoomThroughIn()} tail={zoomThroughOut()}>
  <CameraRig keys={[{ at: 0, x: 960, y: 540, scale: 1 }]} drift={{ vx: 0, vy: 0, zoomPerSec: 0.029 }}>
    <Paper kind="grid" />
    <div style={{ position: "absolute", left: 960, top: 180, transform: "translateX(-50%)" }}>
      <HighlightBox delay={10}>Locomobile Old 16</HighlightBox>
    </div>
    <div style={{ position: "absolute", left: 960, top: 360, transform: "translateX(-50%)" }}>
      <SubtitleReveal delay={16}>Winner of the 1908 Vanderbilt Cup</SubtitleReveal>
    </div>
    {/* absolute objects: give Enter the object's box and place the object at 0,0 inside it */}
    <Enter type="slideLeft" distance={120} duration={8} firstFrameProgress={0.7} x={410} y={560} width={1100} height={400}>
      <CutOut src="assets/cutouts/vintage-car.png" width={1100} height={400} />
    </Enter>
  </CameraRig>
</Shot>
```

## QA tooling

| Tool | What it does |
|---|---|
| `tools/analysis/compare.py ref render` | side-by-side + palette ΔE (< 10 good, < 6 very close), black/white points, saturation, warmth, grain σ, edge density. The reference can be `video@seconds` |
| `tools/analysis/frame_metrics.py` + `shots.py` | run them on **your own render** to check pacing (shot lengths, cuts per minute), held-frame share and cadence. Put the MP4 in `tools/analysis/sources.json` first |
| `tools/analysis/contact_sheets.py strip <id> a b` | a full-frame-rate strip of your render, to check stepping and easing frame by frame |
| `tools/studio/validate_storyboard.py <slug>` | before rendering: anchors found, assets present and credited, cut spacing, on-screen text time (≥ 0.6 s), no beat-locked cuts under narration |
| `tools/audio/av_timeline.py <id>` + `av_sync.py` | after rendering: picture events against word onsets, stresses and beats (doc 11 rules) |
| `out/proof/earworm*/measure_events*.py` | the event detectors used for the sync proofs. They are memory-light: 320 × 180 frames, loaded lazily |
| galleries | each component area renders on its own test bench |

## Performance notes

- SVG filters run per frame. The radial lens CA is the most expensive (≈2.5 s per 4K frame on a busy 16-core machine); uniform split ≈1.1 s; collage ≈0.6 s.
- `RadialBlur` renders its children ~7 times: keep it to transition frames.
- Textures are pre-generated tiles (`public/textures/`). Don't generate noise per frame at 4K.
- Fonts: always pass explicit weights and subsets to `loadFont`. Loading whole families can time out renders.
