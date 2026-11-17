# Your brain on travel — `vox_braintravel`
YouTube f0KLHiJLbL0 · Vox advertiser content (brand-studio explainer for a hotel sponsor: 4 chapters, 2 remote experts) · uploaded 2022-07-20 · 4:15.86 (255.86 s, 6,133 f) · 1920×1080 @ 23.976 fps (24000/1001) · captions manual

## 0. Inputs and reliability
**Read:** the guide, VOCABULARY, `vox_creatine.md` (depth), `devices.json` (canonical IDs), info.json (no chapters), the manual VTT, whisper words/phrases/transcript, shots md/json, metrics CSV, sync.json, rhythm.json, features, palette, segments, both SFX helper CSVs, and the headers of `src/type`, `src/collage`, `src/explainer`, `src/motion`.
**Viewed:** all 17 sheets, 25 stills and 10 strips (in `analysis/stills/vox_braintravel/`). Six strips step every 2nd frame and one every 3rd: the graphics are on twos, so a step-2 strip misses no drawing. I did not open the A/V PNGs.
**Numeric passes** (heavy ones under `flock out/.analysis.lock`):
- picture: frame differencing on the 640×360 frame dump (cadence, bursts, boil); ground-colour coverage per frame (transition easing); phase correlation (camera trucks); colour sampling; segmentation for asset boxes;
- sound: per-frame mid/side levels, band energies, onset flux, one beat grid per music cue, YIN pitch and long-term spectra for speaker identity.

| issue | handling |
|---|---|
| sync.json speaker labels (narrator 562 / other 113) are wrong | Rebuilt from pitch and spectrum: **narrator** (female, F0 ≈ 184 Hz, full band) 402 words; **Shelley Carson** (F0 ≈ 196 Hz, dull webcam sound: 4–16 kHz sits 25–28 dB under the 0.3–3 kHz band, vs 10–16 dB for the narrator) 127 words; **Beau Lotto** (male, F0 ≈ 110–116 Hz) 132 words. The **chapter titles** (14 words) are read by a male voice (F0 103–129 Hz, spectrum closest to Lotto's); whisper missed "Chapter one, the brain". |
| whisper text | Fixed from the captions and the screen: "your brain on travel" (not "her"), "matches", "Awe" ×3 (heard as "R" and "All"), "and travel". The description spells "Beau Lotto"; the captions write "Bo". |
| captions vs screen | The captions say "97 people"; whisper and the picture say **97 %**. I follow the screen. The captions hang "to study that" on Lotto's sentence, but the voice there is the narrator's (F0 ≈ 206 Hz). |
| the detector's 89 cuts | Only **27 are editorial hard cuts.** The other 62: <br>• 30 inside the awe montage; <br>• 11 in or out of windows (EEG wedge ×2 and its wipe to the interview; binoculars ×7 and the whip-in); <br>• 3 plate swaps behind the walker; <br>• 8 paper-sheet slides plus 1 double flag; <br>• 2 in-card prop swaps; <br>• the cold-open pull-back; <br>• the title exit (2 flags); <br>• the push into the passport page; <br>• 3 element entries (f1197, f4778, f5477). |
| beat grid | rhythm.json's single 79.5 BPM grid fits only 2:13–4:14. Cues 1 and 3 run at ≈ 106–108 BPM (side-channel autocorrelation), so the helper CSV's `on_beat` flag is wrong before 2:13. I fitted one grid per cue (§7.1) and re-flagged the onsets. |
| shot-table camera values | On footage they track the footage itself (S78 "zoom 0.175"). I use phase correlation on graphics only. |
| not measured | SFX by ear: types come from features plus the picture, with a confidence for each. Instrumentation. Font names (nearest free equivalents given). Whether the chapter voice really is Lotto (≈). Per-dot timing on the rat plate (only the total area). Rotation angles (read from strips, ≈). |

## 1. Summary (5–10 bullets)
- **A light "scientific scrapbook" look, the inverse of Earworm.** Grounds are pastel watercolour paper, colour-coded by section: pink, mint, dusty blue, coral and white. On them sit 19th-c. anatomical engravings, travel ephemera (postcards, boarding passes, a passport, ink stamps) and B&W die-cut people with white sticker borders. There is no black collage, no periwinkle, no torn B&W prints and no condensed-caps hierarchy.
- **The organising conceit is the specimen plate.**
  - "DIAGRAM OF …" titles in tracked small caps over a rounded hairline frame;
  - old-style serif "fig. a/b/e…" labels on leader lines;
  - magnifier circles.

  The conceit is applied even to the two experts ("fig. a" under each name).
- **A chaptered advertorial.** A hook (0:00–0:21) leads into a word title made of travel ephemera, held in silence, then **4 voiced chapter cards** (torn-paper title strips). Each chapter is one study animated as a diagram plus one expert bite. The sponsor's close is read by the same narrator. The experts carry 34.8 % of the runtime (their voices), the narrator 43.9 %.
- **2D paper physics on twos.**
  - Graphics step at **12 drawings/s on 23.976** (our clock). A full-frame paper grain is re-seeded **every 6 f (4 Hz)**.
  - Sheets slide and rotate over each other in 8–13 f (**NEW-paper-sheet-slide ×8**). Cut-outs drop, tumble or unfold. The camera trucks sideways along long collages.
  - Footage sits on a paper mat (≈ 2.5 % × 3.9 % margin) or inside masks (binoculars, a sightline wedge).
- **Phrase-led cutting, with two kinds of burst.**
  - **39 compositions**: median 5.8 s, 9.1 per minute.
  - 60 % of editorial cuts fall within 12 f of a phrase onset, with a median of 6 f before it. There is no beat lock.
  - The bursts: a 31-image montage that accelerates from 7 f to 3 f per image, and plate swaps locked to words (−2…+4 f).
- **Sound.**
  - Five library cues (106 · sting · 108 · 80 · 80 BPM) run under 98 % of the film, **unducked**, with the voice ≈ 9 dB above.
  - The title and chapter joints are marked by silence holes and sub swells.
  - SFX are sparse (≈ 2.1 likely per minute): literal foley (a match strike, a cage clank), paper swooshes and a closing chime. None sits on the beat.
- **Numbers are typeset as physical objects:**
  - figures on labels (15,000 vs 7,500 for "twice as many");
  - a mint magnifier badge ("6 % thicker", never spoken);
  - a torn calendar page with a kraft payoff tile;
  - "97 %" rubber-stamped on a passport page.
- **Branding.**
  - An "advertiser content from …" bug, in the cold open only.
  - Co-brand lockups after the title and on the silent end card.
  - Sponsor hotels inside the imagery (title tile, closing postcard ring, one montage photo).
  - 5 on-screen source lines.

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
|---|---|---|---|---|
| cold-open/hook | 0:00.00–0:21.02 | 8.2 | a question answered with a pun → toddlers have twice the synapses per neuron → pruning → new experiences help at any age | NEW-map-in-silhouette-pullback, NEW-paper-sheet-slide, NEW-specimen-plate-diagram, NEW-figure-card-list |
| title/series-intro | 0:21.02–0:25.21 | 1.9 | the title line, then music alone | NEW-ephemera-word-title (≈ NEW-series-title-card), co-brand lockup |
| title/series-intro (chapter 1 card) | 0:25.21–0:29.00 | 1.2 | the chapter title, in a second voice | NEW-torn-paper-chapter-card |
| evidence | 0:29.00–0:49.16 | 8.1 | a 2009 creativity study: the candle puzzle → those who had lived abroad scored higher | props on cork, NEW-panorama-truck, NEW-window-shape-traveller |
| expert | 0:49.16–1:17.19 | 11.0 | the narrator names Carson → her 23 s bite on new stimuli | NEW-expert-intro-collage, NEW-specimen-label-interview |
| expert | 1:17.19–1:32.03 | 5.6 | the narrator names Lotto; his voice finishes her sentence → "complexify" | same + NEW-speech-prelap |
| title (chapter 2 card) | 1:32.03–1:36.03 | 1.6 | the chapter title | card |
| context | 1:36.03–1:44.03 | 3.1 | brains were thought fixed → Marian Diamond, 1960s | MRI prints (no portrait, no date type) |
| demonstration | 1:44.03–1:51.15 | 2.9 | an enriched environment shapes the brain | NEW-walker-background-swap |
| evidence | 1:51.15–2:07.04 | 6.1 | multisensory vs bare rat cages → more connections (Carson pre-laps from 2:01.19) | NEW-comparison-split-specimens, NEW-dots-proliferate-badge |
| expert | 2:07.04–2:13.10 | 2.4 | Carson: pathways stay, not pruned | interview (no label) |
| title (chapter 3 card) | 2:13.10–2:16.12 | 1.2 | the chapter title | card, NEW-music-reset-hole |
| context | 2:16.12–2:22.11 | 2.3 | travel can induce awe | NEW-persistent-cutout-montage, C-CU |
| expert | 2:22.11–2:37.23 | 6.1 | Lotto: awe gives curiosity and courage | interview |
| evidence | 2:37.23–2:46.04 | 3.2 | EEG caps on a circus audience | NEW-sightline-wedge, K-DrawPath |
| expert (+ demonstration) | 2:46.04–3:10.04 | 9.4 | Lotto: be adaptable; unknown food, a haircut, engage | interview, NEW-binocular-pov-mask |
| title (chapter 4 card) | 3:10.04–3:13.09 | 1.3 | the chapter title | card |
| evidence | 3:13.09–3:23.04 | 3.8 | 5 weeks after a trip, less stress | photo prints on sky, NEW-torn-paper-stat-stack |
| expert | 3:23.04–3:43.16 | 8.0 | Carson: the reward centre counteracts cortisol | interview |
| evidence | 3:43.16–3:54.03 | 4.1 | planning a trip makes 97 % happier | NEW-items-into-container, V-PD, NEW-stamped-stat-on-ephemera |
| ending | 3:54.03–4:01.02 | 2.7 | embrace the unknown | POV-feet montage |
| cta/sponsor | 4:01.02–4:13.15 | 4.9 | explore the sponsor's properties (same narrator) | NEW-map-dots-postcard-ring |
| credits | 4:13.15–4:15.18 | 0.8 | (silent) co-brand end card | end card |

**Chapters by share:** hook + title 10.1 % · ch1 25.9 % · ch2 16.1 % · ch3 22.2 % · ch4 17.2 % · ending + sponsor + card 8.4 %.

### 2.2 Claim → visual device map
| claim type | example (time, words) | device ID(s) | asset type | audio treatment |
|---|---|---|---|---|
| question | 0:00.09 opening question | NEW-map-in-silhouette-pullback over an ephemera collage | engravings, props | sub swell into the first hit |
| number | 0:06.20 "twice as many synapses per neuron" | NEW-specimen-plate-diagram; the subject swaps child → adult on "many" (0 f) | cut-out photo, line drawing | bed |
| causal link | 0:09.19 pruning | engraved head on a street map; cyan neuron icons pop on, then vanish on "removes" | engraving, flat icons | music section change on "removes" (f281 vs f282) |
| list | 0:14.16 new activities / experiences | NEW-figure-card-list (fig. f instrument, g book, h adventure) | props on a mint card | bed |
| date | 0:28.19 "A 2009 study"; 1:41.01 "1960s" | **never typeset**; study papers fan out; MRI prints | documents, scans | bed |
| fact / demonstration | 0:30–0:39 candle, tacks, matches | props pop on their nouns; reset and solution | object photos on cork | literal foley (match strike, 0:34.20) |
| payoff | 0:41.21 travel and living abroad | NEW-panorama-truck to the travellers → torn-paper "Increase in creativity" + trend arrow | cut-outs, type | paper airplane whoosh (≈) |
| person-expert | 0:49.23 Carson, 1:18.17 Lotto | NEW-expert-intro-collage → NEW-specimen-label-interview | portraits, books | voice pre-laps 16 f / ≈ 1.4–1.8 s |
| person-historical | 1:43.16 Marian Diamond | **no picture of her**; MRI prints carry it | scans | bed |
| concept | 1:44 enriched environment | NEW-walker-background-swap (plates on words) | keyed stock footage | bed |
| comparison | 1:51.19 multisensory vs bare | NEW-comparison-split-specimens | drawing, keyed rat | cage clank (1:53.10) |
| number (not spoken) | 1:59.13 "6 % thicker" | NEW-dots-proliferate-badge | micrograph, flat dots | bed; expert pre-lap |
| concept | 2:16 awe | NEW-persistent-cutout-montage | stock photos + archival portrait | nothing on the cuts |
| fact | 2:37.18 EEG at a circus | NEW-sightline-wedge | drawing + archival film | bed |
| list (expert) | 2:53 food, haircut, barber | NEW-binocular-pov-mask under the expert's voice | stock POV footage | whooshes (≈) |
| number | 3:18.20 "five weeks… less stress" | NEW-torn-paper-stat-stack | type on papers, sky | bed |
| list | 3:43 booking, anticipating | NEW-items-into-container | object cut-outs | bag thump (≈) |
| number | 3:48.19 "97 %" | NEW-stamped-stat-on-ephemera via V-PD | passport page | page swish (≈) |
| ending | 3:54 across the country, the globe | POV feet on 5 terrains, cut ≈ 7 f before each noun | stock POV | bed |
| cta | 4:01 the sponsor's properties | NEW-map-dots-postcard-ring | vintage map, postcards | map booms (≈), end chime |

**Counts:**

| claim → device | n | claim → device | n |
|---|---|---|---|
| number → typeset object (labels, badge, stat stack, stamp) | 4 (2 numbers on screen only) | list → prop sequence | 3 |
| study → diagram/props + source line | 5 source lines for ≈ 8 study claims | concept → drawn metaphor | 4 |
| expert → intro collage + labelled print | 2 (+ 4 returns, 1 relabelled) | comparison → split specimens | 1 |
| date → never typeset | 2 | historical person → not shown | 1 |
| question → answered within 1.3 s | 2 | quote card | 0 |

### 2.3 Script patterns
- **Pace and share of speech.**
  - The narrator speaks 402 words in 112.2 s: 3.58 w/s articulation (215 wpm), or 94 wpm of runtime.
  - All voices: 675 words, 158 wpm of runtime.
  - Speech covers 80.7 % of the runtime: narrator 43.9 %, Carson 20.5 %, Lotto 14.3 %, chapter voice 2.0 %.
- **Narrator wpm per beat:**

  | hook | ch1 evidence | ch2 context | walker | rats | montage | EEG | 5 weeks | 97 % | ending | sponsor |
  |---|---|---|---|---|---|---|---|---|---|---|
  | 165 | 174 | 180 | **200** | 132 | 161 | 168 | 190 | 178 | **215** | 153 |
- **Sentences (narrator, from the captions):** 28; median 14.5 words, range 3–31. Short ones work as punchlines: "It's child's play." · "Well, travel and living abroad." · "This is Dr. Bo Lotto."
- **Questions:** 2, both rhetorical and both answered within 1.3 s (0:00.09 → the pun at 0:03.07; 0:40.10 → 0:41.21).
- **Person and tense.** Past for studies ("a 2009 study gave", "she found", "followed up"); present for brain facts. "You/your" ≈ 14×, mostly in the expert bites and the close.
- **Signposting:** only the spoken chapter titles. There is no "let's" anywhere.
- **Experts** are always introduced by name and credential before they speak ("an expert on creativity in the brain"; "a neuroscientist and an expert in perception"), over an intro collage. Once, the narrator's sentence is finished by Lotto's own voice: F0 drops from ≈ 250 to ≈ 125 Hz at 1:24.00, f2014 (≈).
- **Studies** are introduced by year ("A 2009 study"), by person (Diamond "proved"; Lotto "equipped hundreds of people") or by share ("97 % of people in a study").
- **Opening formula:** rhetorical question → pun → striking number → mechanism → promise → title line at 8 % of the runtime.
- **Closing formula:** a "so whether …" generalisation, then "embrace the unknown", then "may just transform your brain". The sponsor message follows in the same voice, music and rhythm (12.5 s, 4.9 %).

### 2.4 Format specifics
| item | this video |
|---|---|
| host on camera | no |
| viewer question | no |
| series intro / branding | ephemera word title, then a co-brand lockup "[brand studio] × [sponsor]" (0:21.02–0:25.21); disclosure bug in the cold open |
| chapters | 4 voiced cards at 10 %, 36 %, 52 % and 74 % of the runtime; none in the metadata |
| interviews | 2 remote experts, 6 shots: 79.0 s on screen (30.9 %), 89.1 s of voice (34.8 %). Windowed as deckle prints on colour-coded paper (Carson pink, Lotto mint); the "fig. a" label on 3 of the 6 shots. |
| reporting trips | none; stock and archival only |

## 3. Shot economy
- **The detector's figures:** 90 shots; mean 2.84 s, median 1.73 s.
- **Verified: 39 compositions.** Between them sit 27 hard cuts, 8 paper-sheet slides, 1 wedge wipe, 1 dissolve and 1 push into a page.
  - Composition length: mean 6.56 s, median 5.76 s, range 0.79–23.06 s.
  - **9.1 compositions per minute.**
- **Picture changes inside compositions:**
  - 30 montage cuts;
  - 9 window cuts;
  - 3 plate swaps;
  - 3 card/subject swaps;
  - 4 trucks;
  - 2 pull-backs.

  With these, all picture changes total ≈ 90, or ≈ 21 per minute.

| part | dur s | compositions | other changes | changes/min |
|---|---|---|---|---|
| hook + title | 25.9 | 6 | 3 swaps | 20.9 |
| chapter 1 | 66.2 | 8 | 4 trucks | 10.9 |
| chapter 2 | 41.3 | 7 | 3 plate swaps + 1 split | 16.0 |
| chapter 3 | 56.7 | 6 | 30 montage + 9 window cuts | **47.6** |
| chapter 4 | 43.9 | 5 | ≈ 4 print/stat swaps | 12.3 |
| ending + sponsor + card | 21.6 | 7 | 1 pull-out | 22.2 |

**Shot-type shares (% of runtime):** interview 30.9 · collage 19.2 · illustration-2d 16.9 · stock-footage 14.5 (walker, montage, binocular and POV feet) · type-card 13.6 (title, 4 chapter cards, 2 stats, lockups) · map-2d 4.9. Archival film appears only inside the EEG wedge.

**Longest compositions:**

| composition | length | start |
|---|---|---|
| Carson, ch1 | 23.06 s | 0:54.18 |
| Carson, ch4 | 20.48 s | 3:23.04 |
| binocular POV | 16.77 s | 2:53.10 |
| Lotto, ch3 | 15.52 s | 2:22.11 |
| map and postcard ring | 12.51 s | 4:01.02 |
| sky + stat | 9.80 s | 3:13.09 |
| panorama | 9.55 s | 0:40.02 |

**How setups reveal their elements:**
- **Diagram plate:** the sheet lands → the subject tumbles in → the backdrop disc unfolds → magnifier and label fade in together → the source line.
- **Chapter card:** engraving → documents → scraps → "Chapter N" → title strip.
- **Expert intro:** portrait on the name → photo print → engraving → book.
- **Title:** ground prints → word tiles one by one (top, right, left, bottom) → held in silence → each tile leaves the way it came.
- **Comparison:** subject → cage on "rats" → toys on "multi-sensory" → a pull-back reveals the second panel on "others".

## 4. Look
### 4.1 Colour: palette hexes, background colours, accent colour(s) and pixel share, grading of archival material.
**Palette (palette.json):**

| hex | share | hex | share |
|---|---|---|---|
| `#E6E1DD` | 32.0 % | `#7AA8DB` | 5.9 % |
| `#ADC0C0` | 17.2 % | `#9E7446` | 4.8 % |
| `#8A8483` | 8.8 % | `#5D3825` | 3.9 % |
| `#0C0D0B` | 8.7 % | `#165B9D` | 3.3 % |
| `#CBA487` | 6.4 % | `#2E4818` | 1.8 % |
| `#494A4B` | 6.1 % | `#6A8830` | 1.1 % |

| role | hex (sampled) | where |
|---|---|---|
| white watercolour paper | `#EDEDED`–`#EFEFEF` | diagram plates, title, MRI, the footage mat |
| pink paper | `#E1D0C6` | ch1 card, expert intros, **Carson's** interviews, rat cages |
| mint paper | `#A2C0B8`–`#ACCBC5` | cold open, fig cards, **Lotto's** interviews, ch3 card |
| dusty blue / coral | `#72A0B7` / `#E68B7E`–`#ED937B` | ch2 / ch4 cards |
| cork / cream map / sky | `#AC9560` / `#EBDABB` / `#99B8E4` | candle puzzle / its solution / ch4 evidence |
| near-black grain | `#0C0C0C` | binocular POV |
| accents | salmon `#F69585` (dots, ball, head tint) · mint `#BCDDD4` (badge, wheel) · blue `#81B2C1` · cyan neurons ≈ `#9FD8D3` | data marks |
| title strips | pale blue `#BBC5D4` / `#BFD0E2` with slate ink `#314050` / `#405266`; kraft `#BDA991` with `#342C21` | type tiles |
| line work | engraving ink `#80726C`, cage ink `#080401`, frame rule `#3A3A3A`, label ink `#4C3F38` / `#4D4D4D` | — |
| stamps | purple `#6B598C`, red `#C75C4B` | 97 % page |

- **Colour carries structure:** one paper colour per chapter card and one per expert.
- **Grading is not unified:**
  - people are B&W die-cuts (some blue-tinted);
  - engravings are multiply-blended warm grey or tinted salmon;
  - stock photos and footage keep their saturated native colour;
  - the MRI is an orange duotone;
  - the circus film is B&W.
- There is no single accent colour.

### 4.2 Typography: families (name it, or describe + nearest free equivalent), roles, sizes as % of frame height, case, tracking, colour, where text sits; caption/subtitle style.
| role | family (nearest free) | size | case / colour | where |
|---|---|---|---|---|
| chapter title | sharp, slightly condensed bold text serif with **halftone-dot ink** (≈ Newsreader Display SemiBold / Source Serif 4 Display) | cap 10.8–11.8 % | Title case, slate `#314050` | on a pale-blue torn strip, centre-left |
| "Chapter One/Four" | same family, semibold, with a hairline rule after it | cap ≈ 3.6 % | `#261A12` | aged torn scrap, above the title |
| diagram title | tracked old-style small caps (≈ EB Garamond SC) | cap ≈ 2.0 %, tracking ≈ +12 % | caps, `#4A4A4A` | top centre, above the frame |
| specimen labels | old-style Garamond-like (≈ EB Garamond / Crimson Pro): "fig. a" regular, name bold, roles regular tracked +5 % | name cap ≈ 4.1 %; roles ≈ 2.8 %; diagram labels ≈ 3.3 %; label figures ≈ 4.2 % (old-style) | `#4C3F38` / `#4D4D4D` | right of the subject, on a leader |
| stat numbers | "5 weeks": transitional serif ≈ 12 %; "97 %": distressed heavy condensed sans (≈ Bebas Neue + ink texture), ≈ 23.6 % | — | `#454544`; black | centre-left |
| stat payoff | condensed heavy italic grotesque (≈ Barlow Condensed ExtraBold Italic) | cap ≈ 11 % | caps, `#342C21` on kraft | right of the number |
| title lockup | YOUR: white high-contrast serif (≈ Playfair Display Bold) 12 % · BRAIN: condensed black italic grotesque 11.6 % · on: white rounded condensed sans (x-height 5 %) · TRAVEL: gold tracked serif caps 7.9 % | — | mixed | centre |
| source line | neo-grotesque caps: article title in italic, publisher and year roman (≈ Inter) | cap ≈ 1.7–1.9 % | black on paper, white on photos | bottom-left, x ≈ 97, baseline ≈ y 1032 |
| disclosure bug | DIN-like caps (≈ Barlow) + the sponsor wordmark | cap ≈ 2 % | black | top-right, cold open only |

- **Type on screen.** Some typeset text is visible ≈ 45–50 % of the runtime (≈, summed from the composition list): interview labels 36.7 s, diagram plates ≈ 26 s, cards and stats ≈ 30 s, source lines over footage ≈ 22 s. There are no subtitles and no kinetic captions.
- **Serif vs sans.** Serif carries every name and label. Sans appears only in the stat payoff, the stamp, two title tiles, the source lines and the bug.

### 4.3 Layout & composition: grid, margins/safe area, text vs image placement, depth/layering.
- **Diagram plate.** A rounded hairline frame at x 72–1848, y 75–1003 (margins 3.75 % W, 7 % H). The title is centred above the frame at y ≈ 30–55; the source line sits under it at x ≈ 97.
- **Footage mat.** Content at x 45/51–1872/1875, y 42–1038.
- **Interview.**
  - The window is a deckle print at x 167–1332, y 100–958 (left 61 % of the width).
  - The video inside is ≈ 1110 × 823 (4:3 webcam).
  - The label column sits at x ≈ 1405, linked by a leader from the video (≈ x 1215, y 530).
- **Comparison.** A dashed rule at x 960. Text margins at x ≈ 128 / 1065, titles at y ≈ 80–200, legend at y ≈ 870–970.
- **Chapter cards.** A cluster at centre-left (x ≈ 170–1550), with the title strip across the middle (y ≈ 320–765).
- **Stats.** The number sits left or centre; the payoff tile overlaps it on the right.
- **Depth.** Flat 2D, with small soft shadows under prints and tiles (≈). Layer order:
  1. ground;
  2. engravings (multiply);
  3. documents and prints;
  4. die-cut people;
  5. type tiles;
  6. magnifiers and badges.

  Multiplane parallax appears only in the cold-open drift.

### 4.4 Textures & finish: grain, paper, halftone, print/scan look, vignette, chromatic aberration, light leaks.
- **Paper.** Watercolour (cold-press) grain on every ground. A full-frame grain overlay is **re-seeded every 6 f (4 Hz)** during holds. It was measured in 30 shots, including the interviews and the binocular ground: edge-strip spikes recur at 6-f gaps.
- **Print textures.**
  - halftone dots inside the chapter-title letters and on the "Bare" rat;
  - stipple/grunge fill on the EEG head;
  - torn and deckle edges;
  - rubber-stamp ink whose texture changes **every 24 f** (1 Hz) on the 97 % (left-centre bursts at f5523, 5547, 5571, 5595);
  - white die-cut borders ≈ 18 px.
- **Not present:** film weave, chromatic aberration, vignette, light leaks, dust.

### 4.5 Branding: logo bug, lower thirds, name cards, source lines, end card, series marks.
- **Disclosure bug.** "Advertiser content from" + the sponsor's wordmark, top-right (≈ x 1470–1865, y 40–157). It is visible only 0:00.22–0:09.00: an 8-f fade-in and a ≈ 6-f fade-out.
- **Co-brand lockups.**
  - After the title: a cross-dissolve in at 0:24.12, about 6 f.
  - As the end card: 4:13.15, silent from 4:14.14.
- **Name cards.** The serif "fig. a" specimen label (§5 M9); no lower-third plate.
- **Sources.** 5 source lines (synapses, MRI, awe montage, 5-week study, planning study). The 2009, rat and EEG studies carry none.
- **Product placement.** Sponsor hotels appear on the YOUR tile, in one montage photo (2:18.17) and on the closing postcards.
- **Series marks:** none.

## 5. Motion language
| aspect | measured |
|---|---|
| graphics cadence | **twos** (`.#.#.#` in every graphic shot: 12 drawings/s on 23.976). Live action is on ones. The keyed rat steps at 4 fps (6-f holds) and then 12 fps. The crumple-unfold is on ones. |
| texture clocks | paper grain re-seed every 6 f (4 Hz); stamp re-ink every 24 f (1 Hz) |
| camera on graphics | static holds, with slow pushes of ≈ 2–3 % on collages. Moves (on twos): <br>• lateral trucks: 900–1370 px in 16–18 f, ease-in-out, peak ≈ 170 px/f; <br>• one accelerating whip-truck (8 f); <br>• the cold-open pull-back (×0.79 in 20 f) and push (×1.14 over 62 f, constant speed); <br>• the rat split (truck ≈ 1160 px + zoom-out ×≈ 0.6 in 10 f); <br>• the map spin-zoom (22 f, decelerating) and pull-out (27 f). |
| camera on footage | locked; the footage's own handheld motion only |
| entries | drop, slide, rise, tumble, crumple-unfold, scale-pop (dots, toys, badge), fade (engravings, labels) — all 4–16 f, mostly ease-out |
| exits | mostly hard cuts. Sheets slide out with an accelerating move. The title tiles leave the way they came (6 f). The bag flies up. |
| annotation | magnifier circle + tangent leaders; labels on leaders; numbered callouts; no draw-on rings or arrows. The one drawn line is the EEG trace. |
| maps | vintage maps as grounds; a location-dot field; a spin-zoom; a pull-out. No routes or borders. |
| charts / 3D | no charts (one zigzag trend arrow as a symbol); no 3D apart from a passport cover swinging open |
| hand-made feel | twos plus the 4 Hz boil plus paper edges; no puppet boil on the elements |

**Device specs (re-creation level).** Frames are global; "on twos" means the drawing changes every 2 f.

| # | device | elements and layers (bottom → top) | entry / exit (frames, easing) | trigger (word anchor) | colours |
|---|---|---|---|---|---|
| M1 | **NEW-paper-sheet-slide** (8×) | current scene < incoming sheet carrying the *next* scene, complete with its own ground and frame (slide-in); or next scene < current sheet (slide-out) | **In** (f80, f237, f2857): from a corner, rotated ≈ −25° → 0, 8–10 f. New-ground coverage per drawing is 3→43→74→85→87 % (ease-out); f2857 runs linear with a hard stop. **Out** (f347, f686, f954, f2047, f2297): the card leaves towards a top corner, rotating ≈ +10…15°, 10–13 f. Coverage 2→9→21→38→58→65 % (f2297) accelerates; f2047 is linear. Elements riding the sheet start their own entry as it lands. | median 5 f before a phrase onset (f80 +1 on "It's"; f686 −5 on "2009"; f2297 −6 on "Scientists") | the sheets are the next ground (white, sepia map, mint, cream map) |
| M2 | **NEW-map-in-silhouette-pullback** (0:00.00–0:01.09) | mint ground < props (binoculars, postcards, compass, group photo, bag) < a brain silhouette filled with a pink city map < the engraved brain inside the fill | f0–1 hold full-frame on the map; f2–20 pull-back (×0.79) until the silhouette lands; f20–33 the fill dissolves to the engraving (13 f); the bug fades in f22–30. Then a ×1.14 push over 62 f at constant speed, props drifting outward (parallax). | starts with "How" (f9); lands on "can" (f19) | map pink-red; mint `#AAC9C1` |
| M3 | **NEW-specimen-plate-diagram** (synapses 0:03.10–0:09.22) | white plate + frame + title < neuron-texture disc (Ø 790) < B&W die-cut child < magnifier ring (70 px) + tangents + 450-px circle with a neuron drawing < "fig. e / 15,000 / synapses / per neuron" < source line | sheet lands (M1) → child tumbles +45° → 0 with a scale-up in 14 f (f88–102) → a crumpled scrap unfolds into the disc in 20 f (f116–136) → magnifier + label fade in 6 f (f134–140) → source line ≈ 4 f (f144) → the child cross-swaps to an adult in 16 f (f177–193), the label 15,000 → 7,500 | the disc completes on "three" (+1 f); the swap starts on "many" (0 f), 40 f before "adult" | label `#5D5D5D`, disc `#D8C3B5` |
| M4 | neuron prune (0:09.23–0:14.18) | street map < salmon engraved head < cyan neuron icons + links | icons pop on (scale), then vanish over "removes unused connections" (f282–304); the head is clean by "ones" (≈) | "removes" | cyan ≈ `#9FD8D3`, salmon head |
| M5 | **NEW-figure-card-list** (0:14.19–0:21.01) | mint card + inset rule < centred prop < caption "fig. f/g/h + 2 lines" bottom-left | each new prop slides diagonally over the old one, rotating ±15° in 10–14 f, while the caption swaps (f401, f457) | "experiences" −4 f; "at any age" +3 f | mint `#A2C0B8` |
| M6 | **NEW-ephemera-word-title** (0:21.02–0:25.21) | white paper < beige disc (Ø ≈ 770) + grey boarding-pass prints + map engraving < 4 word tiles (postcard, boarding pass, ticket, passport) < biplane silhouette (motion-blurred) | ground prints fade in 10 f (f512–522). YOUR drops from the top in 10 f (f524–534, ease-out); BRAIN slides from the right in 8 f and "on" from the left in 6 f (f536–544); TRAVEL rises from the lower right, rotating −50° → −10°, in 16 f (f540–556); the biplane crosses at the bottom. **Hold 30 f in total silence** (f556–586). Exit: each tile leaves its own way in 6 f (f586–592); the lockup dissolves in (f588–594). | the tiles echo the spoken line **+23 f late** | YOUR white on a photo; BRAIN black; on white on blue `#5BA6DC` (≈); TRAVEL gold on blue |
| M7 | **NEW-torn-paper-chapter-card** (4×) | section-colour paper < engravings (multiply) < documents and ephemera < "Chapter N" scrap < title strip (halftone serif) | hard cut → build in 22–40 f: <br>1. engraving fade, 6 f; <br>2. documents rise from below, 8 f; <br>3. scraps; <br>4. "Chapter N" drops, 4 f; <br>5. title strip wipes in left to right, 8 f. <br>Hold 26–52 f, then a slide-out (ch1, ch2: 10–13 f, accelerating) or a hard cut (ch3, ch4). Total 74–96 f (3.1–4.0 s). | title complete −1 f before the spoken title (ch1); the voice comes 4–22 f after the cut | per chapter: pink, dusty blue, mint, coral |
| M8 | **NEW-expert-intro-collage** (2×) | paper + map watermark < pen and scraps < B&W die-cut portrait < photo print < engraving < book cover | 6 f of empty ground, then: <br>• portrait flies in from the top-left at −20° and lands in 6 f (f1197–1202); <br>• the print slides in from the lower right at +10° (f1202–1206); <br>• the engraving rises (f1206–1214); <br>• the book tumbles ≈ 180° → 5° in 12 f (f1208–1220). <br>Then a slow push of ≈ 2–3 %. | portrait lands +4 f after "Dr."; book +7 f after the surname | pink `#DED0C5` |
| M9 | **NEW-specimen-label-interview** (6 shots) | expert-colour paper + faint map/airship watermark < deckle white print (≈ 28 px side, 17 px top/bottom border) < 4:3 webcam video < 2-px leader < label | hard cut or M1 reveal; the label is present from frame 1 with no animation; the camera is static | the cut lands 0–5 f before the expert's first word, or the voice pre-laps (16 f, 5.3 s) | Carson pink, Lotto mint |
| M10 | **NEW-panorama-truck** (0:40.02–0:49.15) | ≈ 5 vignettes on one long strip: candle solution, boy in a window, woman in a window, …, a torn-paper phrase | trucks: f1056–1064 (whip, accelerating), f1074–1092 (≈ 1370 px), f1102–1118 (≈ 1210 px), f1128–1144 (≈ 900 px), all ease-in-out | each truck starts ≤ 3 f from a phrase keyword; the last lands −6 f before "increase" | sage arrow ≈ `#8FB48A` |
| M11 | **NEW-walker-background-swap** (1:44.03–1:51.14) | plate (rock / clouds / city from below / autumn forest) < keyed walker in place, centred, footage on ones, inside the paper mat | the plates hard-cut on words: −2, +2, +4 f | "she", "enriched", "brain" | native |
| M12 | **NEW-comparison-split-specimens** (1:51.15–1:59.10) | pink paper < cage back < keyed rat (4 fps → 12 fps) < cage front bars < flat toys < labels and legend | cage drops in 4–6 f (f2717–2721) and lands with a clank; toys scale-pop 2 f apart (f2733–2741); a pull-back of ≈ 1160 px + ×0.6 in 10 f (f2765–2775) reveals "fig. a Bare | fig. b Multisensory" | cage +2 f after "rats"; toys +5…+13 after "multi-sensory"; split −7 f before "others" | ink `#080401`; toys mint/salmon/blue |
| M13 | **NEW-dots-proliferate-badge** (1:59.03–2:07.03) | white plate < micrograph < salmon discs < mint badge with tangents | the plate slides in 8 f (linear, hard stop); the badge scales up in 10 f (f2867–2877); ≈ 30 discs (Ø 60–105) accumulate over 157 f (f2867–3024), the area growing linearly to ≈ 8 % of the frame | the badge leads "synaptic" by 8 f; the dots continue under the expert pre-lap | `#F69585`, `#BCDDD4` |
| M14 | **NEW-persistent-cutout-montage** (2:16.12–2:22.10) | 31 stock photos in the paper mat < crumpled B&W print | photo cuts every 7,7,7,6,7,6,6,7,6,5,6,5,5,5,5,4,4,4, then 3 ×12 f (3.4 → 8 images/s). From f3300 a crumpled ball flies in from mid-right, growing from ≈ 5 % to ≈ 45 % of the width and unfolding in 26 f (on ones); it then holds centred while the photos keep cutting. | the face settles −2 f before "mind"; the montage ends −1.5 f before the expert's "Awe" | native photos + B&W |
| M15 | **NEW-sightline-wedge** (2:37.23–2:46.03) | white plate + chart grid < drawn EEG head < wedge from the eye (≈ 50°, torn white edges) holding archival footage | hard cut, everything present. The footage inside cuts twice (f3815, f3896). A blurred pen slides along the bottom drawing the EEG trace (ones). Exit: the wedge shows the next shot for 1 f (f3984), then a cut. | cut +5 f after the narrator's "To" | cap `#EDE6C4`, skin `#D9BFB4` |
| M16 | **NEW-binocular-pov-mask** (2:53.10–3:10.03) | grain ground `#0C0C0C` < two Ø ≈ 930 circles (≈ 110 px overlap) < POV footage on ones | from black, the footage whips in with rotational blur in 6 f (f4159–4164). Inside: 4 hard cuts and 3 whip-blur cuts (≈ 6 f). The mask stays fixed. | whip-in −3 f before the expert's "So" | near-black |
| M17 | **NEW-torn-paper-stat-stack** (3:19.06–3:23.03) | sky in the mat < calendar-page scrap (number) < grey strip (context) < kraft tile (payoff) | 3 B&W photo prints slide in at ±10° (24 f each) and out (f4645–4777). Then the 3 scraps slide in, staggered ≈ 4 f, over 18 f (f4778–4796). | number +1…+19 f after "weeks"; payoff **36 f before** "less" | `#E2E3E3`, `#C4C1B8`, `#BDA991` |
| M18 | **NEW-stamped-stat-on-ephemera** (3:43.16–3:54.03) | sky < items falling into an open bag (staggered 4–6 f) → bag closes and flies up (f5459–5477) → passport rises (f5477–5490) → cover swings open, 6 f (f5495–5501) → push into the page ×≈ 2 → 1 in 12 f, ease-out (f5501–5513) | "97 %" readable at f5504; the ink re-inks every 24 f | +18 f after "97" | black ink on `#E7E2DC` |
| M19 | **NEW-map-dots-postcard-ring** (4:01.02–4:13.14) | sepia map < pastel dots < postcards (pale-blue deckle, ±10°) | cut onto a spin-zoom settle of 22 f (f5781–5803); dots pop f5805–5920; a rotating pull-out of 27 f (f5921–5948); ≈ 18 postcards drop into a ring around the edge, every 6–8 f (f5949–6069), the centre left clear | the map settles +1 f after "journey"; the pull-out comes +6 f after "brands" | cream `#EBDABB` |

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |
|---|---|---|---|
| V-HC hard cut | 27 editorial (+ 30 montage, 9 window, 3 plate swaps) | 0:21.02, 0:54.18, 2:13.10, 3:54.03 | static; lands ≈ 6 f before phrases, not on beats |
| NEW-paper-sheet-slide (≈ T-CS / T-SO) | 8 (3 in, 5 out) | 0:03.08, 0:28.14, 1:25.09, 1:35.19, 1:59.03 | our card swap has no rotation and no reveal-by-exit |
| T-IC in-card swap | 3 + 1 subject swap | 0:16.17, 0:19.01, 0:07.09 | props slide over props |
| T-WH whip/slide-through (trucks, whips) | 4 trucks + 4 whips | 0:44.01, 2:53.13, 2:59.12 | the truck runs along one continuous paper strip |
| NEW-pull-back-reveal | 3 | 0:00.02, 1:55.07, 4:06.22 | — |
| X-Dissolve | 2 | 0:00.20 (fill → engraving), 0:24.12 (lockup) | — |
| C-CU crumple-unfold | 1 | 2:17.15 | used as an entry over a montage, not as a cut |
| V-PD page drop / push into a document | 1 | 3:49.04 | the passport opens first |
| V-MOV cut onto a moving camera | 1 | 4:01.02 | — |
| NEW-window-into-next-shot | 1 | 2:46.03 | the wedge previews the next shot for 1 f |
| NEW-music-reset-hole | 4 (+ 1 micro) | 0:23.04 (28 f, title held); 0:28.03 (5 f, before ch1's first scene); 2:13.00 (13 f digital silence, ch3 cut inside); 3:09.22 (4 f, ch4 cut 2 f later); micro 0:04.06 (9 f) | the picture never dips; ch2 gets a sub riser instead |

**Not used:** fade or dip to black, blurThrough, spinSwap, glitch, flash, drop.

## 7. Audio
### 7.1 Music: cue table | t0–t1 | style/instrumentation | BPM | mood/role | entry/exit (on a beat? pre-lap? hard?) | ducking under the voice (dB) |
Instrumentation was not identified (no listening). The music runs under 98.4 % of the runtime.

| t0–t1 | style (measurable) | BPM | role | entry / exit | duck dB |
|---|---|---|---|---|---|
| 0:00.02–0:23.04 (f2–556) | strong beat (ACF 0.67) | 106 | hook | in at f2 with a 12 f fade + low swell. A **9 f hole** (f102–111) after the pun line; it restarts on the downbeat 7 f before the next phrase. Section changes at f166, f281 and f353 sit 0–3 f from a keyword or slide. Out with a 16 f fade as the title completes → **28 f of silence**. | ≈ 0 |
| 0:24.08–0:28.03 (f584–675) | sting: sub-boom entry, low-dominant | — | co-brand + ch1 card | boom at f584, 2 f before the tiles exit; out with a 34 f fade into a 5 f hole | — |
| 0:28.08–2:11.16 (f680–3157) | steady pulse (ACF 0.44) | 108 (≈ 110 or half-time 73.5 after f2150) | ch1 + ch2 | hard entry (1 f fade) 11 f before "2009". A section change at f2150, 59 f before the ch2 card; a sub riser at the ch2 cut. Out with a 5 f fade under Carson's last words. | ≈ 0 |
| 2:13.13–3:09.22 (f3202–4554) | sparse (side −42…−55 dB under the montage) | 80 | ch3 | rises from **digital silence** at the ch3 cut into the first downbeat at f3221; out with a 21 f fade into a 4 f hole, 6 f before the ch4 cut | ≈ 0 |
| 3:10.02–4:14.11 (f4558–6101) | strong beats and 8ths (beat strength 1.96) | 80 | ch4, ending, sponsor | enters 2 f before the ch4 cut and swells to the first beat at f4571; out with a 31 f fade over the end card; silent from f6104 | ≈ 0 |

- **Ducking:** none. The per-phrase duck has a median of +0.2 dB (IQR −1.6…+2.6). The voice sits 9.0 dB above the music. The side-channel level is the same under narration and in music-only time (−27.3 vs −27.1 dB).
- **Loudness:** −23.5 LUFS integrated, LRA 5.3 LU, sample peak −1.9 dBFS.

### 7.2 SFX inventory: | type | count | example timestamps | what it accompanies |
**Method.** A sound counts as an SFX when it is off the per-cue beat/8th grid, coincides with a picture event within ±8 f, and has a band signature unlike the music. Voice-free windows were checked in the mid channel; windows under speech only in the side channel. Confidence: **H** = medium-high, **M** = medium, **L** = low / low-medium.

| t (frame) | likely type | visual event | offset (sound − picture) | conf. |
|---|---|---|---|---|
| 0:00.02–0:00.20 (f2–21) | sub swell into a soft hit | map pull-back lands in the silhouette (f20) | peak +0…+1 f | M (may be the cue's intro) |
| 0:24.09 (f585) | **sub boom** after 28 f of silence | title tiles exit (f586), lockup in | −1 f | H |
| 0:26.04 (f628) + 0:26.09 (f633) | paper flick / slap ×2 (centred, 2–6 kHz +37 dB) | ch1 documents rise (f630) | −2 / +3 f | M |
| 0:34.20 (f836) | **match strike** (side 2–16 kHz +74 dB, low +35 dB, 0.1 s decay) | matches box pops (f831), "matches" | +5 f | H |
| 0:35.05 (f845) | swish/click | reset cut to the empty cork (f846) | −1 f | L |
| 0:39.22 (f958) | **paper swoosh**, 430 ms | world-map sheet slide (f954) | +4 f (+2 f after the coverage starts) | M |
| 0:42.01 (f1008) | whoosh | paper airplane crossing | in motion | L |
| 0:49.18 (f1193) | swish | pen enters the intro ground (f1191) | +2 f | L |
| 1:25.15 (f2053) | **paper swoosh**, 350 ms | intro card slides out (f2047) | +6 f | M |
| 1:32.04–1:32.20 (f2210–2226) | **sub riser / whoomp** | ch2 card cut (f2209) | +1 f onset, peak +17 f | M |
| 1:39.21 (f2395) | swish | cut to the MRI slices (f2398) | −3 f | L |
| 1:53.10 (f2720) | **metal clank** (side −33 dB abs, 290 ms, off-grid) | cage lands (f2721) | −1 f | H |
| 2:13.10–2:14.08 (f3199–3221) | swell from digital silence into a hit | ch3 cut | +0 f, hit +22 f | L (likely music) |
| 2:38.02 (f3791) | wide hiss/swish | cut to the EEG plate (f3788) | +3 f | L (sibilance?) |
| 2:53.13 / 2:59.16 / 3:05.09 | whooshes | binocular whip-in and 2 whip-blur cuts | +2…+8 f | L (expert speaking) |
| 3:10.04–3:10.15 (f4560–4571) | swell into the first beat | ch4 cut | +2…+11 f | L (likely music) |
| 3:47.14 (f5457) | low thump | bag closes | ≈ 0 f | L |
| 3:49.11 (f5502) | swish (>6 kHz +29 dB) | push into the page (f5501) | +1 f | L |
| 4:01.11 (f5790) / 4:06.18 (f5917) | low whoosh-booms (off-beat) | map spin-zoom / pull-out | +9 / −4 f | L |
| 4:13.17 (f6083) | **bright chime/shimmer**, mono, ≈ 0.5 s decay | end-card cut (f6081) | +2 f | H (possibly the sponsor's audio logo) |

**Counts by type:**
- swells/booms 7 (5 at cue joints, 2 map booms);
- paper swooshes/flicks 3;
- swishes/whooshes 9;
- literal foley 3 (match, cage, bag);
- chime 1.

Likely SFX (H + M): **9 = 2.1 per minute**. With the possible ones: 23 = 5.4 per minute.

**SFX and the music:**
- The structural sounds sit on the cue joints: the silence-then-boom after the title, and the swells at the chapter-2 to chapter-4 cuts. They are probably part of the music edits.
- Every foley sound and swoosh is off the beat grid: the match is 3.6 f off, the swoosh 4.9 f, the cage 4.4 f.
- The awe montage's 30 cuts carry **no** sound: side flux at the cuts 0.51 vs null 0.52 (p 0.53), and no riser.

### 7.3 Voice: VO pace (wpm), typical pause lengths, VO vs interview/archival audio share, any processing (phone EQ etc.).
- **Narrator:** female, studio-clean. 112.2 s, 3.58 w/s.
  - Gaps between words: 81 % are under 0.1 s; 26 pauses of 0.5–1 s, 4 of 1–2 s, 1 of ≥ 2 s.
  - Phrases: median 2.94 s, 10 words.
- **Experts:** Carson 52.5 s (2.42 w/s, slow, with pauses) and Lotto 36.6 s (3.61 w/s). The chapter voice speaks for 5.2 s.
- **Processing:** none added. The experts keep their webcam sound: Carson's 4–16 kHz band sits 25–28 dB under the speech band, vs 10–16 dB for the narrator. No phone EQ.
- **Voice over b-roll (NEW-speech-prelap):**
  - Carson pre-laps her picture by 16 f (0:54.02 vs 0:54.18) and by 5.3 s over the rat plate (2:01.19 → 2:07.04).
  - Lotto completes the narrator's sentence ≈ 1.8 s before his picture.
  - His bite runs 14.4 s over the binocular b-roll.

### 7.4 Sync: cuts vs word onsets, cuts vs beats (from `<id>_sync.json`), text reveal vs the spoken word (offsets in frames), anything beat-locked.
| pair | result |
|---|---|
| cuts vs word onsets (sync.json) | ±2 f: 39 % vs null 40 % (p 0.65): no word lock |
| editorial cuts and slide starts vs phrase onsets (35) | **60 % within 12 f; median −5.7 f** (the cut leads). Examples: 0:21.02 +2; 2:16.12 −2; 2:37.23 +0.5; 3:54.03 −8. |
| cuts vs beats (my per-cue grids) | hard cuts ±2 f: 38 % vs null 32 % (n 26); montage cuts 23 % vs 28 % (n 30): **no beat lock** |
| camera-move starts vs beats (sync.json, global grid) | 29 % vs 13 % (p 0.05): weak, and on the unreliable grid |
| element reveals vs keyword | typical −8…+8 f: disc +1, swap 0, prop swaps −4/+3, cage +2, toys +5…+13, split −7, badge −8, awe face −2, map +1. **Outliers:** the title echoes its line +23 f late; the payoff tile leads "less" by 36 f; "97 %" is readable +18 f after the number. |
| plate swaps vs words | −2, +2, +4 f |
| POV-feet cuts | ≈ 7 f before each noun ("country", "globe"); one cut on "embrace" |
| montage intervals | 7 → 3 f, not tied to the 80 BPM grid (a 16th = 4.5 f) |
| SFX vs picture | foley and swooshes −1…+6 f around the event |
| beat-locked | nothing |

### 7.5 Silence and structural sound: drops, dips, stingers, risers.
**Silence** totals 4.1 s (1.6 %):

| hole | length | context |
|---|---|---|
| f102–111 | 9 f | after the pun |
| f556–584 | **28 f, −58 dB** | the title lockup is held in silence |
| f675–680 | 5 f | before chapter 1's first scene |
| f3157–3162 | 5 f | — |
| f3189–3202 | 13 f, **digital silence** | the chapter-3 cut falls inside it |
| f4554–4558 | 4 f | chapter-4 joint |
| f6104–6133 | 29 f | end card |

**Structural sounds:**
- a sub swell at the open;
- the sub-boom sting after the title silence;
- risers or swells into chapters 2, 3 and 4;
- the closing chime.

**Not present:** a drop to black, a mid-film dip, beat-locked bursts, a stinger per cut.

## 8. Device catalogue
Stills and strips are in `analysis/stills/vox_braintravel/`.

| ID | what this video does | count | timestamps | stills | differs from our spec? |
|---|---|---|---|---|---|
| NEW-paper-sheet-slide | next scene printed on a sheet slides or rotates in, or the current sheet slides out (8–13 f) | 8 | 0:03.08, 0:28.14, 0:39.18, 1:25.09, 1:59.03 | strip_00076-00170, strip_00620-00714 | new (≈ T-CS / T-SO, with rotation and reveal-by-exit) |
| NEW-specimen-plate-diagram (≈ SIG-VX-7, K-InsetMagnifier) | "DIAGRAM OF …" white plate, frame, magnifier, fig labels, source line | 3 plates (synapses, rat brain, EEG) | 0:03.18, 1:59.11, 2:37.23 | 0m07s_f170, 2m04s_f2990, 2m41s_f3860 | ours: diagrams on black cards |
| NEW-torn-paper-chapter-card | per-chapter colour, engraving collage, halftone serif on a torn strip, voiced title | 4 | 0:25.21, 1:32.03, 2:13.10, 3:10.04 | 0m27s_f670, 1m35s_f2280, 2m15s_f3250, 3m12s_f4620 | new |
| NEW-chapter-voice | chapter titles read by a second, male voice (≈ Lotto) | 4 | 0:27.03, 1:33.01, ≈ 2:13.16, 3:10.08 | — | new |
| NEW-specimen-label-interview (≈ R-NameCardInterview) | deckle-print window on expert-colour paper + "fig. a" serif label | 6 shots (label on 3) | 0:54.18, 1:25.17, 2:46.04 | 1m00s_f1450 | ours: decode card; here no animation |
| NEW-expert-intro-collage | portrait die-cut, prints, book and engraving built on the name | 2 | 0:49.16, 1:17.19 | 0m53s_f1290, 1m22s_f1980, strip_01186-01280 | new |
| NEW-ephemera-word-title (≈ NEW-series-title-card) | each word on a different travel scrap; held in silence; reverse exit | 1 | 0:21.02 | 0m23s_f572, strip_00500-00594 | ours: giant single word |
| NEW-figure-card-list | list items as fig. f/g/h props swapped on one card | 1 (3 items) | 0:14.19 | 0m16s_f390 | new |
| NEW-map-in-silhouette-pullback | map fill inside a brain silhouette; pull-back; fill dissolves to the engraving | 1 | 0:00.00 | strip_00014-00061, 0m03s_f75 | new |
| NEW-panorama-truck | ease-in-out trucks along a long collage strip | 4 trucks | 0:44.01–0:47.17 | 0m46s_f1103, 0m48s_f1170 | ≈ K-CameraRig keys |
| NEW-window-shape-traveller | B&W person die-cut before a rounded window of colour scenery | 2 | 0:44.19, 0:45.23 | 0m46s_f1103 | new |
| torn-paper phrase + trend arrow | "Increase in / creativity" on torn papers, zigzag arrow | 1 | 0:47.17 | 0m48s_f1170 | ≈ K-TornPaper |
| NEW-walker-background-swap | keyed walker in place, plates cut on words | 1 (4 plates) | 1:44.03 | 1m46s_f2550 | new |
| NEW-comparison-split-specimens | cage drop, toy pops, pull-back to fig. a/b split, numbered legend | 1 | 1:51.15 | 1m58s_f2830, strip_02677-02771 | new |
| NEW-dots-proliferate-badge (≈ K-DotPop) | dots accumulate over 157 f; mint magnifier badge with an unspoken stat | 1 | 1:59.13 | 2m04s_f2990 | ours: pops, not slow growth |
| NEW-persistent-cutout-montage (≈ T-CA) | 31 photos at 7→3 f under a fixed crumpled cut-out | 1 | 2:16.12 | strip_03270-03317 | not beat-locked; persistent layer |
| C-CU crumple-unfold | the crumpled print unfolds while flying in, on ones | 1 | 2:17.15 | strip_03270-03317 | an entry, not a cut |
| NEW-sightline-wedge | torn wedge from a drawn eye holding archival film; EEG trace draw | 1 | 2:37.23 | 2m41s_f3860, strip_03784-03878 | new |
| K-DrawPath | EEG trace drawn by a moving pen | 1 | 2:37.23 | 2m41s_f3860 | — |
| NEW-binocular-pov-mask | POV footage in a binocular matte, whip-in, inner whips | 1 (8 clips) | 2:53.10 | strip_04152-04199 | new |
| NEW-torn-paper-stat-stack (≈ PD-1) | calendar page + context strip + kraft payoff | 1 | 3:19.06 | 3m22s_f4860 | ours: fact card on a desk |
| NEW-stamped-stat-on-ephemera | rubber-stamped % on a passport page, re-inked at 1 Hz | 1 | 3:49.10 | 3m53s_f5590, strip_05459-05600 | new |
| NEW-items-into-container | items fall into a bag; it closes and flies off | 1 | 3:43.16 | 3m45s_f5410 | new |
| V-PD (≈) | passport opens, push into the page | 1 | 3:49.04 | strip_05459-05600 | opens first |
| NEW-map-dots-postcard-ring (≈ PD-5) | dot field, pull-out, postcard ring frame | 1 | 4:01.02 | 4m06s_f5915, 4m13s_f6075 | new |
| NEW-paper-mat-footage | every full-frame photo/footage inset on paper (≈ 45 × 42 px) | ≈ 45 shots | 1:44.03, 2:16.12, 3:54.03 | 1m46s_f2550 | ours: K-Pillarbox differs |
| K-CutOut (white die-cut border) | B&W people and objects with ≈ 18 px sticker borders | ≈ 12 | 0:03.18, 0:49.22, 2:18.17 | 0m07s_f170 | ours has echoes; here plain white |
| K-PhotoPrint / SIG-PD-4 (≈) | deckle-bordered prints (interviews, postcards, family photos) | ≈ 30 | 0:54.18, 3:13.17, 4:08.02 | 3m22s_f4860 | no tape |
| SIG-PD-3 (≈) | graphics on twos: 12/s on 23.976 | all graphics | — | — | matches our clock |
| SIG-PD-12 hold boil (≈) | full-frame paper grain re-seeded every 6 f | ≈ 30 shots | throughout | — | ours boils elements; here the ground |
| V-HC, V-MOV, X-Dissolve, T-IC, T-WH | see §6 | 27 / 1 / 2 / 4 / 8 | — | — | — |
| NEW-music-reset-hole | holes at the title and chapter joints | 4 (+ 1 micro) | 0:23.04, 0:28.03, 2:13.00, 3:09.22 | — | the picture never dips |
| NEW-speech-prelap | expert voice under the previous picture | 3 | 0:54.02, 1:24.00, 2:01.19 | — | up to 5.3 s |
| NEW-literal-foley-sfx | object sounds for props (match, cage, bag) | 3 | 0:34.20, 1:53.10, 3:47.14 | — | new |
| advertiser disclosure bug | "advertiser content from …" top-right, cold open only | 1 | 0:00.22–0:09.00 | 0m07s_f170 | never reproduce sponsor marks |
| co-brand end card (≈ R-EndCard ≠) | two marks with "×" on a cream circle over a map; silent | 2 | 0:24.12, 4:13.15 | — | no glitch build |

**Earworm signatures absent:** SIG-EW-1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12. SIG-EW-3 appears only as clean (not torn) die-cuts.

## 9. What our framework would need to make this video
**A. NEW-* devices ranked by reuse as one-prompt blocks for other topics:**

| rank | NEW device → block name | section it serves | props it needs | evidence |
|---|---|---|---|---|
| 1 | NEW-paper-sheet-slide → `paper-sheet-slide` | any transition | `next`, `direction` (in/out), `fromCorner`, `rotateDeg` (−25…+15), `frames` (8–13), `ease` (out \| in \| linear-stop), `paper`, `shadow` | 0:03.08, 0:28.14, 1:35.19 |
| 2 | NEW-specimen-plate-diagram → `specimen-plate` | evidence, concept | `title` ("DIAGRAM OF …"), `subject` (cut-out or image), `backdrop` (disc texture/colour), `magnifier` {`at`, `r`, `detail`}, `labels[]` {`fig`, `lines`, `anchor`}, `source`, `swap` (subject + label values on a word) | 0:03.18, 1:59.11, 2:37.23 |
| 3 | NEW-torn-paper-chapter-card → `torn-paper-chapter-card` | chapter break | `number` ("One"), `title`, `ground` colour, `collage[]` (engraving/ephemera + slots), `strip` colour, `halftone`, `voiceCue`, `hold`, `exit` (slide \| cut) | 0:25.21, 3:10.04 |
| 4 | NEW-torn-paper-stat-stack → `torn-paper-stat` | number | `value`, `unit`, `context`, `payoff` (caps), `plate`, `papers` (calendar / strip / kraft), `source`, `payoffLead` (frames) | 3:19.06 |
| 5 | NEW-stamped-stat-on-ephemera → `stamped-stat` | number | `value`, `caption`, `page` (passport / ticket / form), `stamps[]`, `rotateDeg`, `reinkEvery` (24 f), `entry` (open-and-push \| cut), `source` | 3:49.10 |
| 6 | NEW-specimen-label-interview → `specimen-interview` | person | `clip`, `name`, `roles[]`, `fig` ("fig. a"), `ground` (per person), `watermark`, `leaderFrom`, `showLabel` (first appearance) | 0:54.18 |
| 7 | NEW-expert-intro-collage → `person-intro-collage` | person | `portrait` (die-cut), `prints[]`, `book`/`object`, `engraving`, `nameWord` (sync), `ground`, `exit` (cut \| slide to interview) | 0:49.16 |
| 8 | NEW-comparison-split-specimens → `specimen-comparison` | comparison | `left`/`right` {`fig`, `title`, `drawing`, `subject`, `callouts[]`, `legend[]`}, `reveal` (single → pull-back split), `divider` (dashed) | 1:51.15 |
| 9 | NEW-persistent-cutout-montage → `accelerating-montage` | hook, concept, list | `images[]`, `intervals` (7→3 f), `persistent` {`image`, `entry`: crumple-unfold \| drop}, `endOnWord`, `matte`, `source` | 2:16.12 |
| 10 | NEW-ephemera-word-title → `ephemera-title` | title | `words[]` {`text`, `font`, `scrap`, `from`}, `backdrop` (disc + prints), `silenceHold` (30 f), `reverseExit`, `sting` | 0:21.02 |
| 11 | NEW-map-dots-postcard-ring → `map-dots-ring` | ending, places | `map`, `dots[]` {`lon`, `lat`, `colour`}, `pullOut`, `postcards[]`, `ring` layout | 4:01.02 |
| 12 | NEW-figure-card-list → `figure-card-list` | list | `items[]` {`fig`, `caption`, `prop`}, `card` colour, `swap` (slide \| drop), `words[]` | 0:14.19 |
| 13 | NEW-walker-background-swap → `walker-swap` | journey, change | `walker` (keyed clip or cut-out cycle), `plates[]` {`image`, `onWord`}, `matte` | 1:44.03 |
| 14 | NEW-binocular-pov-mask → `pov-mask` | examples, POV | `clips[]`, `mask` (binocular \| circle \| keyhole), `ground` grain, `whipIn`, `whipBetween` | 2:53.10 |
| 15 | NEW-panorama-truck → `panorama-truck` | sequence, list | `panels[]`, `gap`, `truckFrames` (16–18), `ease` | 0:44.01 |
| 16 | NEW-sightline-wedge → `sightline-wedge` | evidence: what someone sees | `head` drawing, `eye` point, `wedgeDeg`, `footage[]`, `tornEdge`, `trace` | 2:37.23 |
| 17 | NEW-dots-proliferate-badge → `dot-growth-badge` | number, growth | `base` image, `dotColour`, `count`, `frames`, `badge` {`text`, `colour`, `anchor`} | 1:59.13 |
| 18 | NEW-items-into-container → `pack-items` | list | `container`, `items[]`, `stagger`, `closeAndExit` | 3:43.16 |
| 19 | NEW-map-in-silhouette-pullback → `silhouette-pullback` | hook | `texture` (map), `silhouette`, `reveal` (engraving), `props[]`, `zoom` | 0:00.00 |
| 20 | NEW-window-shape-traveller → `window-portrait` | person + place | `cutout`, `scene`, `windowShape`, `ephemera[]` | 0:44.19 |

**B. Look and theme needs.**
1. **A `voxScrapbook` light theme:**
   - watercolour-paper grounds in 5 tokens (`#EFEFEF`, `#E1D0C6`, `#A2C0B8`, `#72A0B7`, `#E68B7E`) plus cork, cream map and sky;
   - engraving multiply layers;
   - pastel data marks (`#F69585`, `#BCDDD4`);
   - a halftone serif for titles and an old-style serif for labels;
   - no single accent.

   Evidence: 0:25.21, 1:59.11.
2. **Finish:** a full-frame grain re-seeded every 6 f (4 Hz), a stamp re-ink at 1 Hz, and the `paper-mat` footage inset. Our Boil acts per element.
3. **Assets:** PD anatomical engravings, travel ephemera (postcards, boarding passes, passports, stamps, maps), B&W die-cut people, and torn-paper strips (pale blue, aged, grey, kraft).

**C. Recipe and timing needs.**
1. Chaptered structure with voiced chapter cards (§2.1).
2. **Phrase-led cut timing:** cuts −6 f before phrase onsets; reveals within ±8 f of keywords; no beat lock.
3. **Graphic camera:** ease-in-out trucks and pull-backs as CameraRig keys on twos.
4. A **windowed interview** variant (specimen label, per-expert ground).

**D. Audio needs.**
1. A continuous **unducked** bed ≈ 9 dB under the voice.
2. NEW-music-reset-hole at chapter cuts, including a 13 f digital-silence hole with the cut inside.
3. A silence hold under the title, then a sub-boom.
4. Sparse **literal foley** (match, cage, bag) and paper swooshes, placed on picture events (+1…+6 f), off the beat.
5. Expert pre-laps of up to 5 s.
6. A silent end card.

## 10. Evidence index
All files are in `analysis/stills/vox_braintravel/` unless a path is given.

| file | time | what it shows |
|---|---|---|
| 0m03s_f75_coldopen_collage_bug.jpg | 0:03.03 | cold-open collage on mint, disclosure bug |
| 0m07s_f170_synapse_diagram_child.jpg | 0:07.02 | specimen plate: frame, title, magnifier, fig label, source line |
| 0m12s_f300_head_profile_neurons_map.jpg | 0:12.12 | engraved head on a street map (pruning) |
| 0m16s_f390_fig_f_instrument_card.jpg | 0:16.06 | fig. f prop card |
| 0m23s_f572_title_lockup.jpg | 0:23.20 | ephemera word title |
| 0m27s_f670_chapter1_card.jpg | 0:27.22 | chapter card: halftone serif on a torn strip |
| 0m43s_f1040_candle_solution_map.jpg | 0:43.09 | candle solution, thumbs-up die-cut |
| 0m46s_f1103_window_shape_traveller.jpg | 0:46.00 | window-shape traveller |
| 0m48s_f1170_increase_in_creativity.jpg | 0:48.19 | torn-paper phrase + trend arrow |
| 0m53s_f1290_carson_intro_collage.jpg | 0:53.19 | expert intro collage |
| 1m00s_f1450_carson_interview_label.jpg | 1:00.11 | deckle-print interview + fig. a label |
| 1m22s_f1980_lotto_intro_collage.jpg | 1:22.13 | second intro collage |
| 1m35s_f2280_chapter2_card.jpg | 1:35.02 | chapter 2 card |
| 1m41s_f2440_mri_slices_row.jpg | 1:41.18 | MRI slice row |
| 1m46s_f2550_walker_cloud_plate.jpg | 1:46.08 | walker on the cloud plate, paper mat |
| 1m58s_f2830_rat_cages_bare_vs_multisensory.jpg | 1:58.00 | comparison split |
| 2m04s_f2990_rat_brain_dots_badge.jpg | 2:04.16 | dots + mint badge |
| 2m15s_f3250_chapter3_card.jpg | 2:15.13 | chapter 3 card |
| 2m41s_f3860_eeg_diagram_cone.jpg | 2:40.23 | sightline wedge, EEG trace |
| 3m12s_f4620_chapter4_card.jpg | 3:12.16 | chapter 4 card |
| 3m22s_f4860_five_weeks_less_stress.jpg | 3:22.16 | stat stack, source line on a photo |
| 3m45s_f5410_packing_suitcase.jpg | 3:45.15 | items into the bag |
| 3m53s_f5590_stat_97pct_stamp_page.jpg | 3:53.03 | stamped 97 % |
| 4m06s_f5915_vintage_map_dots.jpg | 4:06.16 | map dot field |
| 4m13s_f6075_postcard_ring_world_map.jpg | 4:13.09 | postcard ring |
| strip_00014-00061_coldopen_mask_collage.png | f14–61 | silhouette pull-back, fill dissolve |
| strip_00076-00170_sheet_slide_synapse_diagram.png | f76–170 (/2) | sheet slide-in, child tumble, disc unfold, label fade |
| strip_00500-00594_title_lockup_build.png | f500–594 (/2) | word tiles in, silence hold, reverse exit |
| strip_00620-00714_chapter_card_build_exit.png | f620–714 (/2) | chapter build and slide-out to cork |
| strip_01186-01280_expert_intro_collage.png | f1186–1280 (/2) | intro collage element order |
| strip_02677-02771_rat_cage_drawon_split.png | f2677–2771 (/2) | cage drop, toy pops, split pull-back |
| strip_03270-03317_awe_montage_crumple_unfold.png | f3270–3317 | 7-f montage cuts, crumple fly-in |
| strip_03784-03878_eeg_cone_build.png | f3784–3878 (/2) | wedge footage cuts, pen trace |
| strip_04152-04199_binocular_pov_enter.png | f4152–4199 | binocular whip-in |
| strip_05459-05600_passport_open_97pct_stamp.png | f5459–5600 (/3) | bag exit, passport open, push, 97 % |
| analysis/sheets/vox_braintravel/sheet_001–017 | — | all compositions; montage on sheets 008–011 |
| analysis/audio/vox_braintravel_sync.json, _sfx_side.csv, _sfx_candidates.csv | — | alignment, holes, ducking, onset features |
| reference/vox-sample/vox_braintravel.proposals.json (private) | — | 71 asset and 23 SFX proposals |
