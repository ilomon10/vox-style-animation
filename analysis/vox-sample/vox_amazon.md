# The destruction of the Amazon, explained — `vox_amazon`
YouTube SAZAKPUQMw0 · Vox Atlas (map-driven geopolitics; part 1 of 3, "Vox Atlas: The Amazon") · uploaded 2019-11-21 · 704.9 s (11:44.21) · 1920×1080 @ 23.976 fps · captions manual

## 0. Inputs and reliability
- **Read:** all inputs in the guide; 40 sheets, 8 strips, 15 stills viewed.
- **Extra light work:** tesseract OCR on ≈ 250 frames; pixel counts for 17 text reveals; frame differencing for drawing rate.
- **Gap:** my notes for sheets 1–19 (0:00–3:45) were not kept. That range is rebuilt from 11 stills, 3 strips, OCR and metrics, so its counts are marked ≈.
- **Transcript fixes:** "Okra State" → Acre; "Obama" → IBAMA; "Dilma a Rusev" → Rousseff; "Michelle Temer" → Michel Temer; "rural east" → ruralistas; "find" → fine; "box atlas" → Vox Atlas. Whisper invents English over the Portuguese interviews (4:57, 5:59, 10:33); those exist only as burned-in subtitles.
- **Distrusted metrics:**
  - **cuts:** the detector's 215 include ≈ 25 flicker/glitch/dip frames. I use sync.json's 190 cuts (191 shots) and add ≈ 35 scene changes inside long graphic shots, counted by hand.
  - **cadence column:** wrong. 9 measured graphic moves have 0 held frames, so graphics run on ones; only typed text steps on twos or fours.
  - **speaker classes:** they mislabel narrator lines (1:15.16, 3:16) and file the interviews under narration. Voice shares come from the VTT and the subtitles instead.
  - **SFX candidates (85):** almost all are music transients. None verified (no listening).
  - **tempo:** rhythm.json and the sync tempo map disagree, conf ≤ 0.5. The exception is the intro theme (122.5 BPM, conf 0.82). All other BPMs are ≈.
  - **text reveals:** sync.json's list is empty; I measured them myself.
- **Not measured:** instrumentation by ear, exact fonts, sources of the cold-open clips.

## 1. Summary (5–10 bullets)
- **Map-and-chart film.** Graphics fill ≈ 50 % of the runtime: maps 19.7 %, charts 21.7 %, satellite 3.2 %, documents 3.0 %, cards 2.7 %. Archival fills 30 %; own Acre reporting and interviews 16 %; the host 3 %.
- **Map grammar:**
  - a flat true-colour satellite photo-map with a near-black ocean, seen top-down;
  - a 2D camera with eased zooms from ×0.18 to ×7.1;
  - drawn on with masks, a band, hatches, a raster choropleth, fire dots, flow ribbons, a dashed route, square pins and typewriter labels;
  - no globe or terrain.
- **The map is also a material.** Its texture fills a scale card and a 100 % stacked bar. The bar morphs out of the map (5:19.04) and appears 8× in all, as a running ledger of protected land.
- **Numeric spine:** one deforestation bar chart, re-shown 6× and extended each time, with president-term bands under the axis.
- **Hook:** a news supercut (1980s → 2019) against a running year odometer on the satellite map at 5 of the 6 narrator lines, joined by TV-flicker and glitch cuts.
- **Not Earworm:**
  - no collage, and no B&W treatment of archival;
  - charcoal grain `#1f1f1f`, cream type;
  - accents coral `#e0604f`, yellow `#f2ec0e` and green `#5f9a5f`, each ≤ 0.5 % of pixels;
  - squared condensed caps plus bold grotesque labels.
- **Doc-13 rules kept:**
  - date-first opening;
  - "Then, something changed:" with a hard music stop and 0.7 s of silence;
  - expert heard before she is named ("This is Marina Silva.");
  - one question;
  - music to the last frame.
- **Doc-13 rules broken:**
  - narration 50 % of runtime at 101 wpm;
  - stage shots up to 28.7 s;
  - ≈ 10 long cues as a flat bed;
  - cuts avoid word onsets.
- **Field package:**
  - Portuguese interviews with burned-in white subtitles (bottom left) that persist across cuts;
  - typed name cards with a green tab;
  - a tiny location tag.
- **Outro:** the producer on camera beside the credits roll, teasing part 2.

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
|---|---|---|---|---|
| cold-open/hook | 0:00.00–1:28.08 | 12.5 | 1980s→2019 news: the Amazon vanishes, is saved, burns again | NEW-archival-news-supercut, PD-2 odometer (5 returns), NEW-tv-flicker-glitch-cut, NEW-year-tag-corner |
| question/thesis | 1:28.08–1:35.05 | 1.0 | "The question is: Can it be saved this time?" | 4 aerial crane-ups |
| title/series-intro | 1:35.05–1:45.17 | 1.5 | music only | NEW-hud-series-intro, R-GiantWordCard, X-Drop |
| context | 1:45.17–3:16.04 | 12.8 | military regime, highway, land rush, pasture, Arc of Deforestation | NEW-satellite-basemap, NEW-map-photo-window, R-MapRoute, NEW-satellite-timelapse, NEW-recurring-bar-chart, K-HandDrawnRing |
| context | 3:16.04–3:45.02 | 4.1 | meat demand → soy; Brazil suited; exports soar | NEW-line-chart-draw, NEW-choropleth-raster-legend, NEW-map-fly-out-fly-in |
| demonstration | 3:45.02–4:24.20 | 5.6 | "Like this one, in Acre state." Farmer: "This is how development happens." | NEW-field-report-broll, NEW-location-tag, R-NameCardInterview, NEW-burned-subtitles, T-PCap |
| evidence | 4:24.20–4:57.08 | 4.6 | record rates; the arc grows north; Greenpeace; Lula steps in | NEW-recurring-bar-chart, NEW-map-band-label, NEW-two-panel-split |
| expert | 4:57.08–6:57.22 | 17.1 | Marina Silva's plan: reserves, Forest Code, IBAMA | interview (voice first, ID after), NEW-map-texture-stacked-bar, K-LeaderLine, NEW-protected-areas-mosaic, NEW-bar-tilt-org-chart |
| evidence | 6:57.22–8:07.05 | 9.8 | rates halve; moratoria; foreign money | NEW-recurring-bar-chart, NEW-hatched-region-label-box, NEW-flow-ribbon-world |
| turn | 8:07.05–9:38.10 | 12.9 | ruralistas gain power; rollbacks; Bolsonaro | NEW-big-title-over-dimmed-photo, NEW-dot-hemicycle, NEW-headline-card-over-plate |
| payoff | 9:38.10–10:27.15 | 7.0 | 30,000 fires; collapse at 20–25 % | NEW-fire-dot-overlay, C-FTB, R-DocumentHighlight |
| expert | 10:27.15–11:01.02 | 4.7 | farmer "it should be destroyed" vs Silva "preserved by itself" | NEW-burned-subtitles, `dip` |
| ending | 11:01.02–11:12.12 | 1.6 | "It's why this place was saved once before." | drone b-roll, PD-5 label, E-CB |
| cta/membership/sponsor + credits | 11:12.12–11:44.21 | 4.6 | host thanks, teases Chico Mendes | NEW-host-sponsor-read-credits, T-IC |

**Structural marks:**
- "Something changed" at 7 %;
- title card at 13.5 %;
- turn at 69 % ("But there were some who still wanted it to be a more profitable place.");
- fade act break at 85 %;
- the 10 YouTube chapters match beats 4–11.

### 2.2 Claim → visual device map
| claim type (date, place, person-expert, person-historical, fact, list, concept, causal link, number, comparison, quote, question, payoff, ending) | example (time, words) | device ID(s) | asset type | audio treatment |
|---|---|---|---|---|
| date | 0:10.02 "In the 1980s…" | PD-2 odometer on satellite (1981→1987) | satellite mosaic | bed |
| date (archival) | 1:16.14 2019 fires news | NEW-year-tag-corner "2019" | CNN/Globo clips | archival audio |
| place | 2:21.02 "the southeast… Rio de Janeiro" | basemap pan peaking on the word; pins + typed labels; photo window | map + B&W photo | bed |
| place (field) | 3:45.02 "in Acre state" | NEW-location-tag (−22 f) | own footage | bed |
| person-expert | 4:57.08 bite → 5:07.00 "This is Marina Silva." | interview + subtitles; ID after the bite; no Vox name card | own interview | interview over bed |
| person-historical | 4:55.00 Lula; 9:00.20 Bolsonaro | photo + typed name card (on the name) | press photos | bed |
| fact | 0:13.20 "Trees are falling at a startling rate…" | NEW-archival-news-supercut | archival TV | archival voices |
| list | 5:34.10 "…Brazil nut harvesting and rubber-tapping" | bar label, then one photo per item | stock photos | bed |
| concept | 5:17.08 "rainforest under protection" | NEW-map-texture-stacked-bar | graphic | bed |
| causal link | 3:21.02 "That trend raised the need for more soybeans" | line chart → choropleth | data graphics | new cue after a 4 f hole |
| number | 5:23.07 "only about 28%" | yellow % under an outlined segment (+4 f) | graphic | bed |
| comparison | 7:58.09 "productive, and protected" | NEW-two-panel-split | archival video | bed |
| quote (archival) | 4:47.08 Greenpeace ad | 6-shot montage, no on-screen text | Greenpeace footage | source alone |
| quote (written) | 8:41.17, 10:17.17 | NEW-headline-card-over-plate; R-DocumentHighlight | articles, scans | bed |
| question | 1:32.05 | aerial crane-ups → intro | aerial b-roll | bed → theme |
| payoff | 9:54.14 "unlikely to survive" | fire dots → 29-f fade to black | map | 5 f silence → new cue |
| ending | 11:09.09 "saved once before" | map label → cut to black | map | music to the end |

**Counts per claim type → device:**
- **date ≈ 18:** odometer 5, year tag 6, hemicycle year 4, era bands 3.
- **place ≈ 12:** satellite map 9, world map 2, location tag 1.
- **person-expert 2:** interview + subtitles.
- **person-historical 4:**
  - photo + name card 2;
  - era band only 2 (Rousseff, Temer).
- **fact ≈ 45:**
  - archival video ≈ 25;
  - archival photo ≈ 10;
  - field b-roll ≈ 10.
- **list 3:** supercut, photo per item, bar segments.
- **concept 5:** stacked bar 2, org tilt 1, band 1, greyed bar 1.
- **causal link 6:**
  - chart or map state change 5;
  - split screen 1.
- **number ≈ 16:**
  - bar chart 6;
  - bar % 4;
  - hemicycle % 4;
  - scale card 1;
  - fire dots 1.
- **comparison 2:** split screen; dip between the two interviews.
- **quote ≈ 31:**
  - archival clip 27;
  - headline 2;
  - document 2.
- **question / payoff / ending 1 each.**

### 2.3 Script patterns
- **Rate:**
  - narrator 1,191 words (VTT): 101 wpm across the video; 3.38 words/s while speaking;
  - narrator speech = 352 s = 50.0 % of runtime.
- **Narrator wpm per beat:**

  | beat | wpm |
  |---|---|
  | hook | 33 (plus 186 archival words) |
  | question | 157 |
  | context | 143 / 149 |
  | demonstration | 56 |
  | evidence | 113 / 147 |
  | expert | 103 |
  | turn | 127 |
  | payoff | 150 |
  | ending | 152 |
  | host outro | 187 |
- **Sentences:** 80; median 14 words, mean 14.9, range 4–35. 13 sentences have ≥ 22 words (relative-clause chains).
- **Questions:** 1 (1:33.13), set up by "The question is:".
- **Person and tense:**
  - third person: past for history, present continuous for today;
  - "you" 0, "we" 1.
- **Signposts:** "Then, something changed:", "But in order to keep it safe, there was one condition:", "But it didn't.", "So…", "And yet…", "But this time…".
- **How sources and experts are introduced:**
  - **Marina Silva:** her bite first, then "This is Marina Silva. She was Brazil's Environment Minister in 2003…";
  - **the farmer:** introduces himself through his bite;
  - **data:** on screen only ("Source: Economist / Mongabay / INPE"). The narration just says "A 2018 report estimated…".
- **Opening and closing formulas:**
  - **opening:** archival voice first; the narrator's first line is date-first, and later hook lines are one-sentence hinges;
  - **closing:** thesis, callback to the question, black, host CTA.
- **Sponsor / membership:** none.

### 2.4 Format specifics
- **Host:** on camera in the outro only (producer, credited as Sam Ellis; that he is also the narrator is not verified).
- **Viewer question:** none.
- **Series branding:** Atlas intro of 10.5 s after the question.
- **Chapters:** 10 YouTube chapters, not drawn on screen.
- **Interviews:** 2 original, both in Portuguese.
  - **Soy farmer:** 4 handheld field setups.
  - **Marina Silva:** seated, off-centre right, 6 appearances.
- **Archival statements:** Bolsonaro selfie video; Silva TV clip, 2003.
- **Reporting trip:** yes, to Acre: ≈ 41 s of b-roll.

## 3. Shot economy
- **Shots:**
  - 191 shots (detector: 216); mean 3.69 s, median 2.25 s, p10 0.83, p90 7.42;
  - 16.2 cuts/min;
  - ≈ 225 compositions, one per 3.1 s.
- **Cuts/min per beat:**

  | beat | cuts/min |
  |---|---|
  | hook | 35.3 |
  | question | 26.2 |
  | title | 22.9 |
  | context | 12.6 / 10.4 |
  | demonstration | 16.6 |
  | evidence | 25.9 |
  | expert | 10.4 |
  | evidence | 14.7 |
  | turn | 11.2 |
  | payoff | 14.6 |
  | expert | 12.6 |
  | ending | 21.0 |
  | outro | 7.4 |
- **Shot types (% of runtime):**

  | shot type | % |
  |---|---|
  | archival-video | 24.6 |
  | chart | 21.7 |
  | map-2d | 19.7 |
  | interview | 9.9 |
  | street/b-roll-original | 5.8 |
  | archival-photo | 5.5 |
  | satellite | 3.2 |
  | host-on-camera | 3.1 |
  | document | 3.0 |
  | type-card | 2.7 |
  | mixed | 0.9 |
- **Longest holds** (each is a graphic stage that changes ≥ 3 times):
  - 6:10.07, 28.7 s: bar states;
  - 7:22.23, 28.1 s: map → world → chart;
  - 2:08.00, 28.0 s: highway map;
  - 10:05.12, 22.2 s: bar → documents.
- **How a setup reveals its elements, highway map 2:08–2:36:**
  1. dissolve from footage into a decelerating pull-out (×0.27 in 22 f);
  2. region label;
  3. dashed route + typed "TRANS-AMAZONIAN HIGHWAY";
  4. pan south-east peaking on "southeast": the highway label un-types while "Rio de Janeiro" types beside a square pin;
  5. archival photo slides in from the right under the land (5 f);
  6. "São Paulo";
  7. pan back on "people" (0 f);
  8. crash push ×7.1 in 39 f on "free" (0 f).
- **How a setup reveals its elements, stacked bar 5:17–5:32:**
  1. texture squashes into a bar (36 f);
  2. segments wipe down, staggered ≈ 6 f;
  3. headers type on at 1 letter per 2 f;
  4. brackets;
  5. "28%" (+4 f);
  6. leader label.
- **How a setup reveals its elements, chart (4:31.19):** axes first; bars left to right at ≈ 4–5 per second.

## 4. Look
### 4.1 Colour: palette hexes, background colours, accent colour(s) and pixel share, grading of archival material.
- **Overall palette (k-means):**

  | hex | share % |
  |---|---|
  | `#121615` | 16.8 |
  | `#292b29` | 14.9 |
  | `#636260` | 10.6 |
  | `#d4d5d2` | 9.5 |
  | `#384c34` | 9.4 |
  | `#a49d8b` | 8.7 |
  | `#443820` | 8.1 |
  | `#747250` | 7.3 |
  | `#8697a7` | 6.8 |
  | `#a57950` | 3.7 |
- **Grounds:**
  - charcoal `#1d1d1b`–`#292929`: 76 % of chart pixels;
  - map ocean `#0f1314`–`#181c1f`: 34 % of map pixels;
  - title card `#030303` with a graticule.
- **Map land:** satellite greens `#405232`/`#687548`; Amazon mask `#21391c`–`#2b4e3b`.
- **Text:** cream `#f3efdb`–`#fcf6de`, also used for the chart bars.
- **Accents (sampled 1 frame/s):**
  - yellow `#f2ec0e` (key %, outlines, hatch, highlighter): 0.1–0.5 % of pixels;
  - coral `#e0604f`/salmon `#e99872`/terracotta `#a86849`: 0.1–0.2 %;
  - green `#5f9a5f` (headers, kickers, card tab);
  - one-offs: blue `#39567c`, fire orange `#cb8227`, ring red `#c8303f`.
- **Archival grading:** original colour and broadcaster chyrons kept; 1970s film stays B&W as found.
- **Other grades:** Acre footage warm (warmth +20…+40); intro aerial graded teal.

### 4.2 Typography: families (name it, or describe + nearest free equivalent), roles, sizes as % of frame height, case, tracking, colour, where text sits; caption/subtitle style.
- **Display:** squared, chamfered condensed caps (nearest free: Chakra Petch or Saira Condensed).

  | role | size (% of frame height) |
  |---|---|
  | odometer | 15.7 |
  | big % | 13 |
  | year tag / hemicycle year | 8.3 |
  | scale-card title | 7.9 |
  | chart titles and headers | 5.3–5.4 |
  | name cards | 3.4 (tracking ≈ +35 %) |
  | kickers | 2.3 |
- **Text:** bold neo-grotesque, sentence case (nearest free: Inter or Work Sans Bold). Cap height as % of frame height:

  | role | cap height (% fh) |
  |---|---|
  | region labels | 3.9 |
  | city labels (Regular weight) | 3.2 |
  | headlines | 4.6 |
  | subtitles | 4.4 |
  | sources | 2.5–3 |
- **Serif:** only the Vox wordmark and the credits roles.
- **Case:** caps for titles, names and years; sentence case elsewhere.
- **Subtitles:**
  - white bold, left-aligned at x ≈ 100 px, baseline 92 % fh;
  - ≤ 2 lines;
  - soft shadow, no box;
  - hard on/off, persist across cuts.
- **"ATLAS":** 22 % fh, letters filled with antique-map texture.

### 4.3 Layout & composition: grid, margins/safe area, text vs image placement, depth/layering.
- **Margins:** left margin ≈ 100 px (5 % fw) for titles, tags, cards and subtitles; Vox bug fixed top right.
- **Maps:** full-bleed, labels centred on their regions.
- **Depth:** photo windows sit in the empty ocean, layered under the land.
- **Charts:** title top left; plot ≈ 60 % fw.
- **Stacked bar:** 89 % fw at mid-height.
- **Splits:** panels on black.
- **Outro:** credits column left, yellow divider, video panel right.

### 4.4 Textures & finish: grain, paper, halftone, print/scan look, vignette, chromatic aberration, light leaks.
- **Grain:** static paper grain on charcoal grounds (mad 0.1–0.2, no boil).
- **HUD layer** (intro, title card, headline cards): graticule, "+" crosshairs, a yellow-green vertical rule.
- **Satellite texture as a material** (bar segments, scale card).
- **Finish:** vignette on the odometer shots; soft shadows under labels.
- **Absent:** halftone, light leaks, chromatic aberration (except the 1:16.08 glitch).

### 4.5 Branding: logo bug, lower thirds, name cards, source lines, end card, series marks.
- **Logo bug:** Vox wordmark top right throughout, ≈ 8 % fh at ≈ 85 % white.
- **Series marks:** Atlas intro + ATLAS card. No end card.
- **Name cards:** 3. Green tab + caps name + bold role + cream bar.
- **Location tag:** "ACRE, BRAZIL".
- **Sources:**
  - source lines under chart titles or at the bottom left of maps ("FAO | GAEZ", "NASA FIRMS", "Stratfor, 2018");
  - on-image credits top left ("Greenpeace, 2006");
  - third-party chyrons kept.

## 5. Motion language
- **Camera (77 moves):**

  | shot group | push-in | pull-out | pan | other |
  |---|---|---|---|---|
  | graphics | 13 (median 0.79 s) | 11 (1.25 s) | 8 (1.04 s) | — |
  | footage | 6 (5.7 s, photo pushes) | 3 | 7 | handheld |
- **Map moves:**
  - fly-outs and fly-ins ease symmetrically, peaking at 45–51 % of the move:

    | start | zoom | frames |
    |---|---|---|
    | 7:32.07 | ×0.24 | 68 f |
    | 7:37.07 | ×4.31 | 52 f |
    | 2:30.02 | ×7.1 | 39 f |
    | 3:27.06 | ×0.18 | 53 f |
  - pull-outs at a shot head ease out (peak in the first 0–17 %): 2:08.00 ×0.27 in 22 f; 3:08.06 ×0.23 in 30 f;
  - roll ≤ 7° during the big zooms;
  - moves start on stressed words (§7.4).
- **Entrances:**
  - map labels type on at ≈ 14 chars/s and un-type on exit;
  - name cards type in steps on twos;
  - "THE RURALISTAS" types at 1 letter per 4 f;
  - bar segments wipe;
  - photo windows slide in over 5 f;
  - tiles pop one by one;
  - dissolves run 5–12 f.
- **Annotation:**
  - 1 red hand ring (3:07.10);
  - 1 yellow hand arrow (8:19);
  - outline boxes;
  - leader lines;
  - document highlighter.
- **Map animation:**
  - masks and mosaics fade;
  - the band grows north;
  - hatch with label boxes;
  - ribbons draw;
  - the map dissolves into a chart (12 f) or morphs into a bar (36 f).
- **Chart animation:**
  - left-to-right builds;
  - extensions with era bands;
  - last bar in coral;
  - bars grey out under drawn lines;
  - the hemicycle year rolls.
- **12-frame steps:** stepped data builds advance every 12 f (0.50 s): odometer, satellite time-lapse (2:38.14), line chart (16 steps), IBAMA bars.
- **3D:** only the bar tilting onto a perspective floor (24 f), twice. Graphics run on ones; hand-made touches are minimal.

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |
|---|---|---|---|
| V-HC | ≈ 175 | throughout | same |
| V-MOV | ≈ 10 | 2:08.00, 3:08.06 | map already zooming out, ease-out settle |
| T-DS / X-Dissolve | 6 | 3:02.05, 7:39.20 (12 f), 10:17.17 (7 f) | between graphic states |
| NEW-map-to-chart-morph | 2 | 5:19.04 (36 f), 9:14.21 (24 f) | no cut; the map becomes the chart (cf. NEW-chart-morph-chain) |
| NEW-tv-flicker-glitch-cut | ≈ 6 | 0:00.00 opening flicker, 0:13.20, 1:16.08 (6-f teal glitch) | links TV clips and the odometer; mid-video |
| X-Drop | 1 | 1:44.14 (27 f black + 5 f digital silence) | hard in, no fade-up |
| C-FTB / X-DipToBlack | 1 | 9:58.14 (29-f fade, 1 f black, hard in) | asymmetric act break |
| `dip` | 1 | 10:52.02 (18 f) | the next speaker's subtitle already on |
| E-CB | 2 | 8:02.00, 11:12.12 | — |
| T-WH | 1 | 1:36.19 vertical UI scroll | vertical |
| T-PCap | ≈ 12 | 3:52.02, 4:04.10 | subtitles persist, even over maps |
| T-IC | 4 | 11:17.05, 11:32.14 | panel beside the credits |
| NEW-two-panel-split | 2 | 4:40.21, 7:58.09 | — |
| NEW-photo-flash-burst | 1 | 1:24.11 (4 × 3 f) | — |
| T-FB | 1 | 11:42.22 | — |

## 7. Audio
### 7.1 Music: cue table | t0–t1 | style/instrumentation | BPM | mood/role | entry/exit (on a beat? pre-lap? hard?) | ducking under the voice (dB) |
Not auditioned. Styles below come from spectra (centroids 240–690 Hz, weak highs = dark pad/bass underscore); the credits list 7 library tracks (e.g. "Network Fusion", "Forest Creatures").

| # | t0–t1 | style | BPM | role | entry/exit | duck (dB) |
|---|---|---|---|---|---|---|
| 1 | 0:00.01–0:51.05 | dark pulse, sub-heavy | ≈ 122.5 | hook tension | hard in; hard stop on "Then, something changed:" | 1.8 |
| 2 | 0:55.02–1:16.07 | brighter, quiet | ≈ 92–108 | reversal | 26-f fade-in; hard out at the glitch | −6.2 |
| 3 | 1:16.11–1:35.07 | low hits | ≈ 92 | 2019 fires | in at the glitch cut | 1.8 |
| 4 | 1:35.07–1:45.12 | series theme, loud | 122.5 | intro, music alone | edit at the thesis end; 20-f fade into the drop | — |
| 5 | 1:45.18–3:16.00 | dark pad | ≈ 92 | context | first frame after the drop; 36-f fade-out | 6.7 |
| 6 | 3:16.04–4:40.04 | darker, ≈ 10 internal changes | ≈ 140 | economy, Acre | 29-f in; 30-f out to 13 f silence | narration ≈ 0–5; farmer 12–18 |
| 7 | 4:40.17–7:03.19 | low | ≈ 100 | Silva's plan | pre-lap 4 f; 17-f out to 27 f silence | ≈ 0–1 |
| 8 | 7:05.01–8:06.23 | quietest | ≈ 100 | results | 4 f after the cut; out to 7 f silence | 5.2 |
| 9 | 8:07.07–9:59.15 | very dark | ≈ 85–120 | turn, fires | 1 f before the cut; fades with the picture | ≈ 0–1 |
| 10 | 9:59.21–11:44.21 | pulse ≈ 80 | ≈ 80 | outlook to credits | hard in; runs to the last frame | ≈ 4; host 11.1 |

**Ducking:** median per phrase 1.8 dB; speech sits 7.3 dB over the music. Only the interviews and the host are really ducked.

### 7.2 SFX inventory: | type | count | example timestamps | what it accompanies |
| type | count | example timestamps | what it accompanies |
|---|---|---|---|
| low hit (unverified, may be music) | 3 | 1:16.11, 2:36.03, 1:45.18 | glitch cut, photo burst, cue after the drop |
| shutter-like clicks (unverified) | ≈ 3 | 1:24.11–1:24.22 | photo flashes |
| typing clicks / whooshes | 0 detected | label typing; 2:30.02 crash push | — |

### 7.3 Voice: VO pace (wpm), typical pause lengths, VO vs interview/archival audio share, any processing (phone EQ etc.).
- **Pace:** 3.38 words/s (≈ 203 wpm articulation); 101 wpm across the video.
- **Pauses:** 72 % of gaps < 0.1 s. 0.25–1 s ×125, 1–2 s ×26, ≥ 2 s ×19 (section breaks). Phrases: median 2.57 s / 9 words.
- **Shares of runtime:**
  - narrator 50.0 %;
  - archival voices 9.7 %;
  - interviews ≈ 16–18 % (subtitle time 127 s);
  - host 3.2 %;
  - no-voice music 32.7 % (classifier).
- **Processing:** archival TV and host audio band-limited as recorded (−15.7 / −14.5 dB vs −5.4 dB for the VO). No added phone EQ. The VO is dry and close.

### 7.4 Sync: cuts vs word onsets, cuts vs beats (from `vox_amazon_sync.json`), text reveal vs the spoken word (offsets in frames), anything beat-locked.
- **Cuts vs word onsets:** 22.1 % within ±2 f vs 33.1 % chance (enrichment 0.67), so cuts avoid onsets. 38 % of cuts fall mid-phrase, 20 % in pauses.
- **Cuts vs beats:**
  - 17.9 % vs 11.0 % (enrichment 1.62; p_circ 0.016, p_jit 0.22);
  - downbeats 2.13 (p_jit 0.15);
  - R 0.12, so no lock.
- **Cuts vs music boundaries:** enrichment 4.6 (p 0.002); median +2.5 f.
- **Camera-move starts vs stressed words:** 21.4 % vs 10.0 % (enrichment 2.14; p_circ 0.006, p_jit 0.024). Examples: pan on "people" 0 f, crash push on "free" 0 f, flows on "money" −2 f.
- **Text reveal − word, 17 measured** (median −6 f, IQR ≈ −26…+9: labels land up to 1 s before the word; numbers land on it):

  | text | offset (f) |
  |---|---|
  | 17 % deforested | −50 |
  | hemicycle 17 % | −45 |
  | 2003 tag | −43 |
  | Strict reserves | −26 |
  | Indigenous lands | −26 |
  | ACRE tag | −22 |
  | Forest code | −9 |
  | 2019 tag | −6 |
  | Bolsonaro card | −4 |
  | "FIRES" title | +2 |
  | 28 % | +4 |
  | Lula card | +9 |
  | country fills | +23 |
  | Sustainable use | +32 |
  | Soy moratorium | +64 |
- **Beat-locked:** nothing proven. The 12-f odometer step ≈ one beat at 122.5 BPM, but its phase is unconfirmed.

### 7.5 Silence and structural sound: drops, dips, stingers, risers.
- **0:51.06:** hard music stop, 17 f silence, then 3.1 s of dry archival voice before cue 2 (the doc-13 turn, used inside the hook).
- **1:44.14:** title → 27 f black, music fades into 5 f of digital silence (−116 dB), then a new cue and picture on one frame.
- **Chapter holes:** 4:40.04 (13 f), 7:03.22 (27 f), 8:06.23 (7 f). Each new cue starts within ±4 f of the cut.
- **9:58.14:** picture fade 29 f + music fade 23 f → 5 f silence → hard in with a new cue.
- **Totals:** silence 3.6 s (0.5 %). No verified stingers or risers.

## 8. Device catalogue
| ID | what this video does | count | timestamps | stills | differs from our spec? |
|---|---|---|---|---|---|
| NEW-satellite-basemap | flat relief satellite map, dark ocean, 2D eased camera | 17 shots, 139 s | 1:50–2:36, 3:27, 7:22, 9:41 | 1m56s, 2m23s, 7m36s | R-MapRoute is a dark vector map |
| NEW-map-region-mask | region flattened to dark green + bold label | ≈ 6 | 1:56, 3:14, 11:10 | 1m56s | — |
| NEW-map-band-label | terracotta band, rotated label; grows north | 2 | 3:09.12, 4:37.20 | 3m14s | — |
| NEW-map-photo-window | archival window in the ocean, under the land, gridded, caption chip | 2 | 1:53, 2:21.02 | 1m56s, 2m23s | — |
| R-MapRoute / DC-3 | dashed route, square pins, typed city labels | 1 | 2:13–2:26 | 2m23s | satellite base; no X |
| PD-5 | place labels ("SOY FARM", "Amazon rainforest") | ≈ 6 | 1:56, 3:42, 11:10 | 1m56s | grotesque labels |
| NEW-satellite-timelapse | roadside clearing, 1 image per 12 f | 1 | 2:38.14 | — | — |
| NEW-map-tile-accretion | clearing tiles pop over green texture | 3 | 2:53, 4:04.10, 5:17.08 | — | — |
| NEW-map-fly-out-fly-in | region↔world zooms, crash push ×7.1 | 4 | 2:30.02, 3:27.06, 7:32.07 | 7m36s | — |
| NEW-choropleth-raster-legend | FAO yield raster, gradient legend | 1 | 3:27 | 3m31s | — |
| NEW-flow-ribbon-world | coral country fills + ribbons to Brazil | 1 | 7:34.08 | 7m36s | — |
| NEW-hatched-region-label-box | hatch + black-on-yellow boxes | 1 | 7:23.18 | — | — |
| NEW-protected-areas-mosaic | coral/yellow mosaic fades in/out | 4 | 5:50.00, 9:54.14 | — | — |
| NEW-fire-dot-overlay | NASA FIRMS dots + title | 2 | 9:43.23 | — | — |
| NEW-scale-card-map-texture | texture rectangle, caps title, number | 1 | 2:44.05 | 2m46s | — |
| NEW-map-texture-stacked-bar | map → 100 % bar; segments, %, leader labels; greys out | 8 | 5:17.08, 6:10.07, 9:14.21, 10:05.12 | 5m24s | — |
| NEW-bar-tilt-org-chart | bar tilts onto a 3D floor; org labels type | 2 | 6:34.03, 9:14.21 | — | only 3D |
| NEW-recurring-bar-chart | one chart, extended 6× | 6 | 3:02.05, 6:57.22, 9:29.03 | 3m07s | R-DataChart is a one-off |
| NEW-era-band-under-axis | president tags under the x-axis | 4 | 6:57.22 | — | — |
| NEW-dual-axis-line-overlay | bars grey; lines draw on a 2nd axis | 1 | 7:44 | — | — |
| NEW-line-chart-draw | consumption lines, 12-f steps | 1 | 3:16.04 | — | — |
| R-DataChart / PD-8 | cream bars on charcoal; blue IBAMA bars | 7 | 3:02, 8:38.16 | 3m07s | Atlas look |
| K-HandDrawnRing / SIG-PD-9 | red ring on the first bar | 1 | 3:07.10 | 3m07s | red |
| K-SketchArrow | yellow arrow to dots | 1 | 8:19 | 8m22s | — |
| K-LeaderLine | segment labels on leaders | 4 | 5:29.11, 6:21.06 | 5m24s | typed |
| K-Typewriter | labels/titles type on and off | ≈ 25 | 2:21, 3:49, 8:11 | 2m23s, 9m23s | also un-types |
| NEW-dot-hemicycle | seat dots, yellow faction, year roll, big % | 3 | 8:17.07, 8:57.16 | 8m22s | — |
| NEW-big-title-over-dimmed-photo | "THE RURALISTAS" typed, then dims | 1 | 8:09.22 | — | no converging letters |
| NEW-headline-card-over-plate | kicker + typed headline + byline over HUD aerial | 2 | 8:41.17, 9:23.22 | 9m23s | ED-2 uses paper |
| R-DocumentHighlight / SIG-VX-5 | clean scans, yellow highlighter | 2 | 10:17.17 | — | no rings |
| PD-2 | year odometer on satellite map, one count across 5 returns | 5 | 0:09.16, 0:36.21, 1:13.07 | 0m11s | 12-f ticks; cf. R-ColdOpenYear |
| NEW-year-tag-corner | cream year top-left on archival (cf. NEW-vhs-spine-date-tag) | 6 | 1:16.14, 5:08.07, 9:59.21 | 1m18s | — |
| NEW-archival-news-supercut + NEW-uncaptioned-archival-speech | anchors finish each other's lines; chyrons kept; no captions (cf. NEW-claim-supercut) | ≈ 45 clips | 0:00–1:28 | 1m18s | no karaoke captions |
| NEW-fullframe-archival-broll | full-frame archival in native colour | ≈ 90 shots, 173 s | 0:13, 4:47, 7:04 | 1m18s | no B&W cut-outs |
| NEW-tv-flicker-glitch-cut | flicker/teal glitch (cf. NEW-tv-static-flip) | ≈ 6 | 0:00, 1:16.08 | — | not only at the ending |
| NEW-photo-flash-burst | 4 photos × 3 f | 1 | 1:24.11 | — | — |
| NEW-two-panel-split | two panels on black | 2 | 4:40.21, 7:58.09 | — | — |
| NEW-burned-subtitles | white bold, bottom left, persistent | ≈ 45 lines | 3:50.17–11:01 | 3m51s | R-KaraokeQuote differs |
| R-NameCardInterview / SIG-EW-9 | typed card: green tab, caps, role, bar | 3 | 3:49.10, 9:00.20 | 3m51s | no decode, no serif |
| NEW-location-tag | "ACRE, BRAZIL" + green square | 1 | 3:45.06 | — | — |
| NEW-field-report-broll | own Acre footage, drone | ≈ 16 shots | 3:45–4:24 | 3m51s | — |
| NEW-hud-series-intro | HUD aerial → antique-map window | 1 | 1:35.05 | 1m36s | — |
| R-GiantWordCard / SIG-EW-7 | ATLAS with map texture in the letters | 1 | 1:39.04 | 1m42s | series card |
| NEW-host-sponsor-read-credits (+ NEW-credits-split-panel) | host panel + credits column (no sponsor) + archival tease | 1 | 11:17.05 | — | no end card |
| NEW-persistent-corner-bug | Vox wordmark top right in every shot | 1 | whole video | all | — |
| SIG-EW-12 + NEW-music-reset-hole | music stop + silence; 3 holes at joints while the picture cuts; drop | 6 | 0:51.06, 4:40.04, 7:03.22, 8:06.23 | — | 5–27 f holes |
| source-line / NEW-corner-source-tag / document-as-proof | source lines; top-left credits ("Greenpeace, 2006"); documents | ≈ 12 / ≈ 40 / 4 | 3:07, 4:47, 10:17 | 3m07s, 3m31s | — |

## 9. What our framework would need to make this video
1. **Satellite map engine:** flat raster, dark ocean, 2D eased region↔world camera, masks, bands, hatches, choropleth + legend, fire points, ribbons, routes, square pins, typed/un-typed labels, photo windows (1:50–2:36, 7:22–7:50).
2. **"Atlas" theme:** charcoal grain, cream, coral/yellow/green, squared caps + bold grotesque (3:07, 5:24, 8:22).
3. **NEW-map-texture-stacked-bar recipe** with morph, wipes, % callouts, greying and 3D org-chart tilt (5:17–6:38, 9:14).
4. **Persistent chart:** extend axis, era bands, highlight, grey + lines, map→chart dissolve, 12-f steps (3:02 → 9:29).
5. **Hook kit:** news supercut + odometer returns + year tags + flicker/glitch cuts (0:00–1:28).
6. **Interview package:** burned subtitles persisting across cuts, typed name card, location tag, ID after the bite, duck 12–18 dB under interviews only (3:45–6:57).
7. **NEW-dot-hemicycle** (8:17–8:57).
8. **Headline cards + clean-scan highlighter** (8:41, 9:23, 10:17).
9. **Series wrapper:** HUD intro + ATLAS card; NEW-host-sponsor-read-credits (1:35–1:45, 11:17).
10. **Audio model:** ≈ 10 long library cues as a flat bed; cue changes on cuts with 5–27 f silence holes; hard stop at "Then, something changed:" (0:51, 1:44, 9:58).
11. **Long-form targets:**
    - hook 12.5 %, title at 13.5 %, expert block 17 %, turn at 69 %, act break at 85 %;
    - narration 50 % at ≈ 100 wpm;
    - stage shots up to 28 s.

## 10. Evidence index
| file | time | what it shows |
|---|---|---|
| analysis/stills/vox_amazon/0m11s_year-odometer-satellite.jpg | 0:11.16 | odometer on the satellite map |
| analysis/stills/vox_amazon/1m18s_year-tag-corner-archival.jpg | 1:18.18 | "2019" tag on CNN |
| analysis/stills/vox_amazon/1m36s_title-hud-overlay.jpg | 1:36.01 | HUD intro |
| analysis/stills/vox_amazon/1m42s_atlas-title-card.jpg | 1:42.10 | ATLAS card |
| analysis/stills/vox_amazon/1m56s_map-label-photo-window.jpg | 1:56.07 | mask, label, photo window |
| analysis/stills/vox_amazon/2m23s_map-pins-route-photo.jpg | 2:23.15 | route, pins, photo under land |
| analysis/stills/vox_amazon/2m46s_map-scale-card.jpg | 2:46.04 | scale card |
| analysis/stills/vox_amazon/3m07s_bar-chart-ring-source.jpg | 3:07.10 | chart, source line, hand ring |
| analysis/stills/vox_amazon/3m14s_map-arc-region.jpg | 3:14.02 | Arc band |
| analysis/stills/vox_amazon/3m31s_map-choropleth-legend.jpg | 3:31.05 | choropleth + legend |
| analysis/stills/vox_amazon/3m51s_namecard-subtitle-field.jpg | 3:51.09 | name card + subtitle |
| analysis/stills/vox_amazon/5m24s_map-texture-stacked-bar.jpg | 5:24.16 | stacked bar, 28 % |
| analysis/stills/vox_amazon/7m36s_map-flow-arrows-world.jpg | 7:36.16 | flow ribbons |
| analysis/stills/vox_amazon/8m22s_hemicycle-dot-chart.jpg | 8:22.01 | dot hemicycle |
| analysis/stills/vox_amazon/9m23s_headline-card-typing.jpg | 9:23.22 | headline card |
| analysis/strips/vox_amazon_00268-00315.png | 0:11.04 | odometer roll, 12 f per year |
| analysis/strips/vox_amazon_01822-01869.png | 1:15.24 | teal glitch cut |
| analysis/strips/vox_amazon_02290-02337.png | 1:35.12 | HUD scroll → map window |
| analysis/strips/vox_amazon_03383-03430.png | 2:21.02 | label un-type/type, photo slide |
| analysis/strips/vox_amazon_05500-05547.png | 3:49.10 | name card typed on twos |
| analysis/strips/vox_amazon_07652-07699.png | 5:19.04 | map → bar morph |
| analysis/strips/vox_amazon_11015-11062.png | 7:39.10 | map → chart dissolve |
| analysis/strips/vox_amazon_13304-13351.png | 9:14.21 | bar tilt + org labels |
| analysis/sheets/vox_amazon/sheet_022/026/029/032/036/039.png | 4:26–11:34 | arc, mosaic, flows, hemicycle, documents, outro |
| analysis/audio/vox_amazon_sync.json | — | alignment, boundaries, ducking, silences |
