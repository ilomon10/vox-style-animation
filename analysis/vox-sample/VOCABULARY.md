# Shared device vocabulary for the Vox sample analysis

Every analyst tags what they see with an **existing ID from this file**. If nothing fits, use a new ID `NEW-<kebab-name>` (for example `NEW-3d-globe-flyto`). Before you invent one, check whether another analyst may have the same thing: use a plain, literal name.

In the device catalogue, give each row:
- the ID;
- a one-line description of what *this* video does (it may differ from our spec: say how);
- the count;
- example timestamps (`m:ss.ff`, with frame numbers if useful);
- still paths.

The synthesis step decides coverage. You only tag.

## 1. Storyboard recipes (`src/recipes/`; these are what `storyboard.json` can call today)
| ID | What it renders |
|---|---|
| `R-ColdOpenYear` | Year digits fly in over a collage that unfolds, plus a place strip. |
| `R-KeywordCut` | A photo slams in; the keyword pops on its stressed syllable. |
| `R-PhotoCollageUnfold` | Torn B/W prints open one by one from a hinge, plus a keyword title. |
| `R-NameCardInterview` | Interview window with a decoding name card. |
| `R-KaraokeQuote` | Archival clip with word-by-word caps captions (speech or sung). |
| `R-GiantWordCard` | One giant word whose letters converge, with a photo inside the word. |
| `R-MontageCrane` | Multiplane camera tilt through cut-outs keyed to spoken nouns, optional dolly. |
| `R-MapRoute` | A route draws on a dark map, with pins, a station label and an X. |
| `R-DocumentHighlight` | Document print, push-in, hand-drawn rings. |
| `R-DataChart` | Count-up counter or bars, optional ring. |
| `R-QuoteCard` | Quote typed letter by letter, then the attribution. |
| `R-EndCard` | Series card with a glitch build. |

All recipes currently produce only the Earworm look (black collage, torn B/W prints, periwinkle accent, condensed caps).

## 2. Storyboard transitions and event kinds
- **Transitions:** `cut`, `blurThrough`, `spinSwap`, `dip` (act/chapter), `drop`, `glitchCut`.
- **Event kinds** (default sync offset at 25 fps):
  - `cut` 0;
  - `object` +1;
  - `text` −7;
  - `pop` +1 on the stress;
  - `title` +10;
  - `caption` −4;
  - `lyric` +1;
  - `name` +4;
  - `exit` 0.

## 3. Transition catalogue (doc 07, plus Earworm fx in doc 12 §6)
- **Paper-desk momentum cuts:**
  - `T-PI` push-in-through;
  - `T-PO` pull-out-through;
  - `T-PC` punch-in into a cut;
  - `T-OS` overscaled settle (shot head);
  - `T-WH` whip/slide-through;
  - `T-WP` whip-pan over a photo wall;
  - `T-SM` scale-momentum chain;
  - `T-CA` photo carousel;
  - `T-WL` word-lock montage;
  - `T-FS` flash-shrink → exposure settle;
  - `T-ZT` zoom-through;
  - `T-SO` slide-out mid-move;
  - `T-IC` in-card cut;
  - `T-PCap` persistent caption;
  - `T-CS` card swap;
  - `T-PG` page curl;
  - `T-SP` stop-motion paper wipe;
  - `T-FR` focus-reticle;
  - `T-ID` ink/smoke-mask dissolve;
  - `T-DS` short dissolve;
  - `T-FB` fade to black (end).
- **Dark collage:**
  - `C-FTB` fade through black with continuity;
  - `C-TPB` dissolve + torn-paper burst;
  - `C-ZMC` zoom-through match cut;
  - `C-FOBI` fall-out/build-in;
  - `C-CU` crumple-unfold;
  - `C-RZ` radial zoom-blur crash;
  - `C-EYE` push into the eye → colour cut;
  - `C-LS` lightning double strike;
  - `C-HC` hard cut to the title card.
- **Vox explainer:**
  - `V-HC` hard cut (static);
  - `V-RET` return cut (same composition, something new added);
  - `V-MOV` cut onto a moving camera;
  - `V-SRP` speed-ramped push cut;
  - `V-P10` powers-of-ten radial zoom-out;
  - `V-FLY` opening fly-through;
  - `V-PD` page drop (into a document);
  - `V-FRZ` freeze before a cut.
- **Vox editorial:**
  - `E-SZ` snap zoom;
  - `E-WO` wipe-off + grunge dissolve;
  - `E-CO` centre-out soft reveal;
  - `E-TB` tilt + build;
  - `E-CB` cut to black.
- **Earworm fx** (`src/earworm/fx`):
  - `X-BlurThroughCut` (sub-boom);
  - `X-SpinSwap` (whoosh);
  - `X-PushThrough` / `X-PullThrough` (described in doc 12 §6, **no component**);
  - `X-NewsprintMaskWipe`;
  - `X-Drop` (fade → black → fade-up, silence);
  - `X-DipToBlack` (act break);
  - `X-MegaPullBack` (×6.25 → 1);
  - `X-GlitchCut` (ending);
  - `X-Dissolve` (rare, onto a moving camera).

## 4. Shot templates (doc 08)
- **Paper desk:**
  - `PD-1` product/fact card;
  - `PD-2` year card/odometer;
  - `PD-3` quote card (bookends);
  - `PD-4` callout on a photo/blueprint;
  - `PD-5` map with a place label;
  - `PD-6` photo carousel/slideshow;
  - `PD-7` footage with a ▶ caption;
  - `PD-8` bar/line chart;
  - `PD-9` desk scrapbook flyover (finale);
  - `PD-10` typed statement on crumpled paper;
  - `PD-11` dark-map timeline.
- **Dark collage:**
  - `DC-1` tableau build;
  - `DC-2` title over scenery;
  - `DC-3` map route with a stretching arm;
  - `DC-4` window scene with lightning;
  - `DC-5` end title.
- **Vox explainer:**
  - `VX-1` topic title on the desk;
  - `VX-2` evidence print with a tape label;
  - `VX-3` concept annotation;
  - `VX-4` inset magnification;
  - `VX-5` document highlight;
  - `VX-6` card with satellites;
  - `VX-7` scale change (powers of ten);
  - `VX-8` end card.
- **Vox editorial:**
  - `ED-1` title lockup with highlighter;
  - `ED-2` newspaper clipping.

## 5. Signature devices per look (doc 12 §1, doc 01 §1)
- **Earworm (`voxEarworm`):**
  - `SIG-EW-1` every visual cut to the sound (keyword cuts on onsets, pops on stress);
  - `SIG-EW-2` dark collage ground (black torn paper, ghost newsprint);
  - `SIG-EW-3` B&W archival cut-outs with torn white borders;
  - `SIG-EW-4` one periwinkle accent;
  - `SIG-EW-5` one condensed family, size as hierarchy;
  - `SIG-EW-6` karaoke captions of archival voices;
  - `SIG-EW-7` giant single-word title cards;
  - `SIG-EW-8` kinetic voice (full-bleed caps);
  - `SIG-EW-9` decode name cards;
  - `SIG-EW-10` audio graphics/visualizers;
  - `SIG-EW-11` hard camera (stop-dead pushes, crash pushes, mega pull-backs, multiplane cranes);
  - `SIG-EW-12` structural sound (drop to black + silence, dips, sub-boom blur cuts).
- **Paper desk (`paperDesk`):**
  - `SIG-PD-1` highlight box behind a serif title;
  - `SIG-PD-2` RGB split, no animated grain;
  - `SIG-PD-3` 12 fps graphics on a 30 fps timeline;
  - `SIG-PD-4` taped prints on a desk;
  - `SIG-PD-5` hard yellow offset echo;
  - `SIG-PD-6` product/fact card;
  - `SIG-PD-7` ▶ caption over footage;
  - `SIG-PD-8` cuts hidden in motion;
  - `SIG-PD-9` hand-drawn rings;
  - `SIG-PD-10` scalloped stamp slips + Didone numerals;
  - `SIG-PD-11` neon serif on near-black;
  - `SIG-PD-12` hold boil;
  - `SIG-PD-13` overscaled settle + punch-in;
  - `SIG-PD-14` callout trio.
- **Dark collage (`darkCollage`):**
  - `SIG-DC-1` on twos + film weave;
  - `SIG-DC-2` flat offset-echo silhouettes;
  - `SIG-DC-3` drop/rise-in props on a locked stage;
  - `SIG-DC-4` scratched black card;
  - `SIG-DC-5` selective red;
  - `SIG-DC-6` theatrical tableau;
  - `SIG-DC-7` old-film damage loop;
  - `SIG-DC-8` lightning double strike;
  - `SIG-DC-9` kit-bashed transitions;
  - `SIG-DC-10` boiling title.
- **Vox explainer (`voxExplainer`):**
  - `SIG-VX-1` dotted notebook-paper desk from above;
  - `SIG-VX-2` yellow as the only accent;
  - `SIG-VX-3` handwritten caps tape labels with paper clips;
  - `SIG-VX-4` draw-on annotations;
  - `SIG-VX-5` highlighter swipe;
  - `SIG-VX-6` inset magnification;
  - `SIG-VX-7` flat vector science diagrams on black cards;
  - `SIG-VX-8` serif title rising from a baseline mask during a push-in;
  - `SIG-VX-9` sticky-note peel;
  - `SIG-VX-10` 2D desk camera;
  - `SIG-VX-11` powers-of-ten zoom-outs;
  - `SIG-VX-12` printed-and-photographed finish.
- **Vox editorial (`voxEditorial`):**
  - `SIG-ED-1` single crumpled sheet, centred editorial serif title;
  - `SIG-ED-2` mustard dry-brush highlighter that stops dead;
  - `SIG-ED-3` snap zooms;
  - `SIG-ED-4` centre-out soft text reveal and top→bottom body wipe;
  - `SIG-ED-5` newspaper clipping with a date tag and blackletter masthead.

## 6. Kit components that exist (tag with `K-<Name>` when a shot is built from one)
| Folder | Components |
|---|---|
| `src/earworm/` | BlackCollageGround, TornPhoto, LabelStrip, KineticWord, KineticVoice, KaraokeCaption, DecodeNameCard, TypewriterSlide, GiantWord, TextFillSilhouette, XMark, AnnotationLabel, SeriesCard, FlyInGlyphs, StationLabel, VinylRecord, TypeWallpaper, HandRing, ZoomWindow |
| `src/earworm/fx/` | Multiplane (camera); SpectrumBars, KickScope, NeedleMeter, BokehVisualizer, ElectricBeam, SparkBoil (visualizers); SfxAtPeak, PHONE_EQ |
| `src/collage/` | CutOut, PhotoPrint, Tape, TapeLabel, StickyNote, FlagLabel, StampLabel, PaperClip, PushPin, FloorEllipse, TornPaper, DiagramCard, CropMarks |
| `src/effects/` | FilmFinish, Paper, Grain, ChromaticAberration, Levels, Vignette, DustLoop, Jitter, Exposure, Pillarbox |
| `src/explainer/` | DrawPath, PencilRing, HandDrawnRing, MarkerRing, MarkerUnderline, SketchArrow, CrossOut, LeaderLine, InsetMagnifier, DotGrid, DotPop/DotField/ColorFlash, BarChart, MapRoute, TimelineMarker, Callout |
| `src/motion/` | CameraRig (keys + drift; `snapStop` keys), Enter/Exit (9 entrance types), Pendulum, PuppetLimb, Sway, Boil, MotionTrail, RadialBlur |
| `src/transitions/` | Shot head/tail: zoom-through, flash-shrink, exposure-in, scale-momentum, whip, radial zoom, fade through black, fade to black, crash zoom, snap zoom, rack focus, pull-back; LightningStrike |
| `src/type/` | HighlightBox, SubtitleReveal, Highlighter, TitleRise, Typewriter, HandwritingWriteOn, VideoCaption, BoilText, CenterOutReveal, LineWipe, WipeOff, ChunkPopOn, NeonText, BigFigure, SlotReel |
| `src/audio/` | Narration, MusicBed (ducking), SongExcerpt, Sfx, AudioBars, Waveform, PulseOnBeat, LyricLine |

SFX we have:
- **Kit (`public/audio/sfx/`):** bass_hit, black_thump, glitch_tick, needle_drop, phone_eq, radio_static, sub_boom, tick, vinyl_crackle, whoosh.
- **Earworm library (private):** shaker swishes, side ticks, sub swells/drones, radio tuning/static, needle drops, reveal hit swish, spin-swap whump, room tone.

## 7. Taxonomies for the per-video tables (use these labels exactly)
- **Shot type:**
  - `archival-photo`, `archival-video`;
  - `interview`, `host-on-camera`, `street/b-roll-original`, `stock-footage`;
  - `map-2d`, `map-3d/globe`, `satellite`;
  - `chart`, `table/number-card`, `document`, `screen-capture`, `type-card`;
  - `collage`, `illustration-2d`, `3d-render`;
  - `mixed`.
- **Beat (narrative):**
  - `cold-open/hook`, `title/series-intro`, `question/thesis`;
  - `context`, `evidence`, `expert`, `demonstration`;
  - `turn`, `payoff`, `ending`;
  - `cta/membership/sponsor`, `credits`.
- **Camera move:** `static`, `push-in`, `pull-out`, `pan`, `tilt`, `crane/multiplane`, `drift`, `crash/snap`, `handheld`, `3d-orbit/fly`.
- **On-screen sourcing:** `source-line` (e.g. "Source: CDC"), `on-image credit`, `document-as-proof`, `none`.

## 8. Already-known gaps (for awareness; don't re-report them as new)
- No recipe outside the Earworm look.
- PushThrough/PullThrough have no component.
- Tumble-assemble and snap-stop push exist only in `src/proof/*`.
- NewsprintMaskWipe, MegaPullBack, SongIntro and the visualizers are not storyboard-callable.
- Dip/Drop sound handoffs and phone EQ are manual.
- Doc 13 §7.2 lists Earworm devices with no recipe.
