# Vox framework coverage: six Vox videos against our framework

Synthesis of six frame-by-frame reports (`analysis/vox-sample/vox_*.md`, device IDs from `analysis/vox-sample/VOCABULARY.md`) against the Earworm baseline (`analysis/earworm-editorial.md`), the style guide and the code. Statuses were checked in `src/` and `tools/`, not taken from `analysis/vox-sample/FRAMEWORK_INVENTORY.md`. The device list as data: `analysis/vox-sample/devices.json`.

**Conventions**
- Videos: EL `vox_electoral`, CR `vox_creatine`, CE `vox_cleanenergy`, DA `vox_drinkingage`, AM `vox_amazon`, HC `vox_healthcare`; EW = the Earworm baseline (a 7th column, never counted).
- **Denominator rule.** "n/6" counts the six sample videos that use a device. HC is a 20-minute talk with no graphics, music or archival, so for graphics, maps, charts and music I also give "of 5 animated" (EL, CR, CE, DA, AM).
- Frames are at 23.976/24 fps unless marked @25 (Earworm and our `SYNC` table). ≈ = an estimate, or a count the analyst marked approximate. Numbers carry their source report; "§" without a file means a section of this document.

## 0. Sample and reliability

| Video | Series / format | Uploaded | Duration | Captions | Caveats |
|---|---|---|---|---|---|
| EL "The Electoral College, explained" | Vox Election 2020, sponsored; data argument on light paper | 2020-10-31 | 8:08 (488.3 s), 23.976 fps | auto (ASR); the manual track is saved now | text corrected from context; sync.json speaker classes wrong (split by hand); 25 of 32 detected cuts real, ≈ 20 hidden scene changes added → 58 scenes |
| CR "Creatine, debunked" | main channel, science fact-check with experts; sponsored, 59 s mid-roll ad | 2026-11-12 | 9:34 (574.5 s), 23.976 | manual | 126 of 163 detected cuts editorial (+ 4 swaps); speakers rebuilt from F0; the metrics' cadence column is wrong (frame differencing used); editorial metrics exclude the ad |
| CE "Can clean energy handle the AI boom?" | Explain It to Me: viewer question, host-reporter; sponsored | 2024-10-01 | 9:18 (557.9 s), 23.976 | auto (ASR); the manual track is saved now | 151 verified shots (157 detected); ≈ 85 words whisper dropped were restored; speakers re-labelled by F0 and picture; BPM ≈ |
| DA "Why the US drinking age is 21" | Almanac: host-led history, archive-told | 2019-08-23 | 9:30 (569.9 s), 23.976 | manual | 11 missed cuts in pillarboxed archival added, 11 false removed; narrator vs archival words from the captions (819 / 557); cue BPMs ≈ (confidence 0.01–0.76) |
| AM "The destruction of the Amazon, explained" | Atlas: maps, part 1 of 3, field reporting | 2019-11-21 | 11:45 (704.9 s), 23.976 | manual | **0:00–3:45 counts ≈** (rebuilt from stills and OCR); sync.json's 190 cuts + ≈ 35 hand-counted changes; tempos ≈ |
| HC "Can Democrats fix healthcare?" | News Not Noise × Vox: 20-min remote conversation. **Not an animated explainer** (no graphics, archival or music): used for format, packaging and interview devices | 2026-11-13 | 20:41 (1,240.7 s), 24 fps | none (rate-limited): **whisper base.en only** | ≈ 5 s missing at 7:03–7:08; speakers split by turn; no music (pause floors −50…−63 dB); the detector's 38 cuts are all correct |
| EW Earworm "Quiet Storm" excerpt (baseline) | Earworm: music history, story mode | — | 2:34 (153.7 s), 25 fps | — | our measured baseline (`analysis/earworm-editorial.md`) |

**Across all reports**
- **SFX are unverified** in every report: nobody listened. SFX counts are candidates classified from context.
- Every analyst corrected the shot detector's cuts by hand (false cuts inside clips, missed swaps and pans).
- Spot-check of 15 device claims against source frames: 13 clear, 2 caught mid-transition, 0 wrong.
- Analysts count in different units (shots, set-ups, instances). Presence (n/6) is the robust number; per-video totals are ≈.

**Status legend (§4)**
- **covered**: a recipe or storyboard feature renders it as measured.
- **covered ≠**: storyboard-callable, but our spec differs materially (see the note).
- **kit-only**: a component exists; no recipe or storyboard field reaches it.
- **proof-only**: exists only in `src/proof/`.
- **doc-only**: described in `docs/style-guide/`, no code.
- **missing**: nowhere.

## 1. Answer first

**Partly.** The framework covers Vox's *method*: word-anchored storyboard timing, claim → picture planning, PD-first sourcing with credits, music in/out anchors and silence holes, re-timing to a new voice-over. But it renders one series look, Earworm, and in this sample Earworm is the outlier.

| | Devices (of 139 used in the sample) | Device-uses (Σ n/6 = 277) | What |
|---|---|---|---|
| **Covered** | 9 | 19 (7 %) | hard cuts (6/6), cuts never on beats and often at music edits, type-on labels, giant word card, keyword cut, karaoke quote, drop and dip as an Atlas act break, a silent blur-through |
| **Partly covered** (covered ≠) | 22 | 79 (29 %) | the name card (decode card in a window vs a plate-less lower third), the series card (end-only glitch card vs an ident after the thesis), documents (rings on a torn print vs a flat highlighter on a full page), charts (counter or periwinkle bars vs titled light charts with source lines), interviews (muted window vs full frame with sound), map labels, archival speech (always captioned), and four audio/sync patterns reachable only by hand: static bed, one cue per section, reset holes, phrase-led cuts |
| **Not reachable** (kit / proof / doc only) | 31 | 67 (24 %) | the highlighter, arrows, line drawing, flat diagrams, ease-out camera moves (kit); dissolves (proof); word-lock montage, card swap, punch-in (doc) |
| **Missing** | 77 | 112 (40 %) | full-frame footage with its own sound (5/6), credits split panel (6/6), an own corner bug (6/6), source lines (4/6), any light paper look (3/6), choropleth maps (3/6), host and conversation formats |

**What the sample shares and we lack:** packaging (corner bug 6/6, lower third 6/6, credits panel 6/6, series ident after the thesis 5/5 animated), native-colour footage, a lemon highlighter on documents, a static music bed that changes once per section, and cuts placed by phrases.

**What it never uses:** Earworm's dark collage ground, torn B&W cut-outs, periwinkle accent, kinetic voice, decode name card and stop-dead camera. No video cuts on word onsets.

**Rules that conflict** (§5): word-onset cuts, a ridden bed, music changes every ≈ 6 s, 4–7 SFX per minute, dips as chapter markers, no questions and no meta-talk, typesetting nouns only and captioning every archival word, 12 drawings/s for every look, the stop-dead camera, a mandatory film finish, a series card only at the end with music to the last frame, narration ≤ 55 % at ≤ 115 wpm.

## 2. Vox's general framework across the sample

### 2.1 Formats and structure templates

**Beat sequences** (share of runtime, %; from each report's §2.1):

| Video | Beat sequence |
|---|---|
| EL | cold open 4.4 → context 8.4 → **question 1.2** → **ident 0.7** → demonstration 15.4 → evidence 15.3 + 7.7 → turn 2.2 → context 12.5 + 4.5 → evidence 7.6 → payoff 9.4 → turn 4.5 → ending 2.6 → sponsor + credits 3.6 |
| CR | hook 4.6 → thesis 5.1 → **ident 0.7** → context 10.8 → demonstration 9.6 → evidence (muscles) 19.1 → **ad 10.3** → evidence (brain) 18.7 → expert 5.3 → turn 7.0 → recap 5.0 → expert's last word 1.4 → credits 2.5 |
| CE | hook 2.8 → **viewer's question 8.4** → **ident 0.9** → Q1 3.4 → expert 3.0 → evidence 7.4 → **sponsor 5.8** → Q2 3.4 → evidence 13.3 → expert 9.7 → evidence 4.9 → turn 1.6 → Q3 evidence 12.2 → thesis 4.6 → answer 1.8 → Q4 solutions 13.2 → credits + promo 3.7 |
| DA | archival cold open (no narration) 5.4 → host thesis 2.3 → context 4.7 → thesis 4.1 → **ident 1.0** → context 8.2 → turn 1.4 → evidence 9.5 → context 10.8 → evidence 10.9 → turn 3.8 → evidence 10.1 + 8.3 → turn 5.4 → payoff 5.7 → black 1.0 → host outro 4.0 → credits 3.5 |
| AM | news supercut 12.5 → **question 1.0** → **ident 1.5** → context 12.8 + 4.1 → field report 5.6 → evidence 4.6 → expert 17.1 → evidence 9.8 → turn 12.9 → payoff 7.0 → two-voice ending 4.7 → ending 1.6 → host outro + credits 4.6 |
| HC | spoken open 2.7 → Q1 10.5 → Q2 16.1 → Q3 13.7 → Q4 9.4 → Q5 (turn) 11.1 → Q6 18.1 → Q7 (payoff) 15.4 → sign-off 2.1 → credits 1.0 |
| EW | setting 6.8 → hook 9.0 → context 10.6 → expert 8.8 → context 12.9 → turn 2.4 → montage 11.6 → event 6.6 → demonstration 7.5 → expert + act break 2.8 → thesis 5.6 → demonstration 2.2 → payoff 8.6 → ending 4.7 |

**Landmarks** (% of runtime):

| Landmark | EL | CR | CE | DA | AM | HC | EW |
|---|---|---|---|---|---|---|---|
| subject named / question asked | 7 / 12.8 | 1 / 4.6 (thesis) | 2.8 (viewer) | 6.5 (thesis) | 1.0 / 12.5 | ≤ 2.7 | 80 (name spoken) |
| series ident | 14.0 | 9.6 | 11.3 | 16.5 | 13.5 | — | 98 (end card) |
| first expert or interview voice | — | 5.9 | 15.5 | — (archival speech) | 32 (field) | 2 | 27 |
| sponsor | 97 (end read) | 50–60 | 26–32 | — | — | — | — |
| turn(s) | 53, 89 | 84 | 63 | 26, 58, 80 | 69 | 52 | 48 |
| payoff / answer / recap | 80 | 91 | 81 | 86 | 82 (act break 85) | 82 | 87 |
| credits start | 96.5 | 97.5 | 96.3 | 96.5 (outro 92.6) | 95.4 | 99.0 | — |

**Templates measured in the sample**

| Template | Videos | Shape |
|---|---|---|
| **T1 argument explainer, 8–12 min** | EL, CR (AM in map dress) | cold open 4–13 % (a supercut of sources, 25–36 cuts/min) → one explicit question or promise (1–9 %) → series ident at 10–17 % → 2–4 chapters (context → mechanism → evidence; data stages 15–45 s) joined by music-reset holes → optional sponsor (6–10 %) → turn at 53–89 % → payoff or recap at 80–91 % → ending 1–3 % (aphorism, recap, the expert's last word) → credits 2.5–4 % |
| **T2 viewer question** (Explain It to Me) | CE | first-person anecdote → the asker's own voice and her typed question (2.8 %) → host pledge ("So let's get to the bottom of this.") → ident (11 %) → 4 written sub-question cards as chapters (13 / 35 / 64 / 82 %) → sponsor after a cliffhanger (26 %) → turn on camera ("a big part of Kathy's question I haven't gotten to yet", 63 %) → the answer by name, on camera, after 11 f of silence (81 %) → solutions (13 %) → credits + podcast promo |
| **T3 host-led history** (Almanac) | DA | 31 s archival scene, no narration → host thesis on camera (5 %) → map preview → ident + edition label (16.5 %) → chronological chapters, archival speech ≈ 31 % of the runtime → turns at 26 / 58 / 80 % (the mechanism lands with a silence hole and a beat-cut montage) → payoff with an archival callback (86 %) → cut to black and silence → host outro with viewer comments → credits beside the host |
| **T4 map / Atlas** | AM | news supercut over a year odometer on the map (12.5 %) → "The question is: …" (1 %) → series intro + drop (13.5 %) → history on the satellite map (17 %) → field report (6 %) → expert block, voice first (17 %) → turn (69 %) → fade-to-black act break (85 %) → two-voice ending → host outro + part-2 tease |
| **T5 conversation, ≈ 20 min** | HC | spoken open with the partner intro (2.7 %) → 7 host questions of 2–3.7 min, near-term → long-term (Q5 = the realism check, Q6 = a new arena, Q7 = the long horizon) → one host recap of the key number → sign-off with a mission line → silent credits |
| **Long form, 10–20 min** (synthesis) | all six | the rows below; written into `docs/style-guide/13-story-to-screen.md` §4.7 (conversation: §4.8) |

| Long form slot | Share | Rule (evidence above) |
|---|---|---|
| cold open | 3–13 % (≤ 90 s) | the sources speak first (supercut, archival scene) or a first-person anecdote |
| question / thesis | 1–9 % | ask the one question once; the subject is named by now |
| series ident | 0.7–1.5 %, at 10–17 % | own card, music alone, then a 6–24 f hole or a drop |
| 3–7 chapters | 10–20 % each | context → mechanism → evidence (+ an expert bite); each opens on a reset hole + hard cut, optionally a chapter or question card |
| sponsor slot (optional) | 6–10 %, at 25–60 % | after a one-line cliffhanger |
| turn | 2–13 %, at 53–89 % | "But…": what the evidence doesn't settle |
| payoff / recap | 2–9 %, at 80–91 % | the answer said plainly; a recap device |
| ending | 1–13 % | aphorism, imperative, or the source's last word |
| credits / outro | 3–8 % | credits split panel; host outro optional |

**Against Earworm (doc 13 §4):** the ident moves from 98 % to 10–17 %; the question is asked explicitly and the subject named in the first 13 % (Earworm names it at 80 %); the turn comes later (53–89 % vs 48 %) and is often repeated; chapters are joined by music holes, not dips; every film ends on a credits block (3–8 %).

### 2.2 Script metrics

| Metric | EL | CR | CE | DA | AM | HC | EW | doc 13 target (Earworm-derived) |
|---|---|---|---|---|---|---|---|---|
| narrator words / min of video | 152.7 | 88.8 (101.9 without the ad) | 122 | 86 | 101 | — (185.5 all speech) | 94 | 94; story 85–105, argument ≤ 115 |
| articulation (words/s while speaking) | 3.37 | 3.64 | 3.31 | 3.35 | 3.38 | ≈ 3.4 | 3.47 | 3.5 |
| narration % of runtime | 75.6 | 40.7 (46.7) | 60.8 (56.4 without the read) | 42.9 | 50.0 | — | 45.5 | 45; argument ≤ 55 |
| other voices % | clips 3.3, host ≈ 2 | experts 26.8, archival/social 6.2, ad presenter 8.4 | expert 16.3, viewer 5.0, promo host ≈ 3.5 | archival speech 30.8 | interviews ≈ 16–18, archival 9.7, host 3.2 | guest 81.8, host 17.2 | 22.3 | ≈ 20 |
| music only % | ≈ 16 | 13.8 | 12.3 | ≈ 26 no speech (music under ≈ 91 %) | 32.7 | 0 | 28.4 | ≈ 28 |
| silence % | 5.7 | 3.0 (9.9 s is the end card) | 1.6 | holes only | 0.5 | ≈ 1 (end card) | 3.8 | ≈ 4 |
| sentence length, median (range) | 15 (2–53) | 13 (1–34) | 17 (2–53) | 10 (1–39) | 14 (4–35) | host 9, guest 19 (run-ons to 130) | 14.5 (3–25) | mean 13, max 25 |
| short sentences (≤ 7 words) | 16 % | 12 of 61 | 12 of 62 | — | — | — | 28 % | ≥ 1 per section |
| questions in narration | 3 (a thesis pair + 1 rhetorical) | 4 (1 signpost + a verdict triple, each answered in one word) | 3 + the viewer's + 4 written cards | 6, each answered within ≈ 2 s | 1 ("The question is:") | host 12, guest 12 | 0 | 0 |
| person, meta-talk | "you" 4, "let's look at Texas" | "you" 13, "let's" 2, "we're going to take a deep dive" | first person ("I" 8); "So let's get to the bottom of this." | "I", "you", "I'll show you" | "you" 0 | host "you" 14 | "you" 3, meta 0 | "you" ≤ 3, meta 0 |
| sources on screen | "Source:" lines bottom-left, chart subtitles, em-dash attributions | a source line under every chart, corner tags on ≈ 50 clip shots, pages as proof | 1 source line; ≈ 24 document shots as proof | none (documents on screen; 1 photo credit) | source lines under charts and on maps, top-left credits, broadcasters' chyrons kept | none (verbal: "KFF, one of the leading…") | 1 source tag on a clipping | not specified |
| sources in speech | "A study found…", "Polls show…" | "across 35 studies", "Take this 2026 study" | "I spoke to Alex de Vries…", "researchers" × 6 | "Most studies of studies…", "Skeptics, like … the Cato Institute" | "A 2018 report estimated…" | name + role ("Frank Pallone, who will lead…") | never | — |
| expert introduction | — | never before speaking: voice, face and card together | voice 10 s before "I spoke to…" | archival speakers set up or named after | bite first, then "This is Marina Silva." | the host names the guest 30 s before his card | voice 8 s before the face | voice first, ID after |

- **Articulation is the one constant:** 3.31–3.64 words/s in all six. Doc 13's 3.5 holds.
- **Density depends on the format:** 86–153 narrator wpm and 41–76 % narration. The data argument (EL) talks most; the archive-led (DA) and expert-led (CR) films least.
- **Every animated explainer asks questions** in the narration (1–6), uses some "you" or "let's", and lets sentences run to 34–53 words. Earworm's no-question, 25-word-maximum style is a story-mode choice, not Vox's.
- **4/6 put sources on screen.** Doc 13 has no on-screen sourcing rule.

### 2.3 Shot economy

| Metric | EL | CR | CE | DA | AM | HC | EW |
|---|---|---|---|---|---|---|---|
| picture changes / min | 7.1 scenes (2.3 hard cuts) | 15.6 | 16.1 | 17.7 | 16.2 cuts (≈ 19 compositions) | 1.84 | 9.4 shots (14.8 set-ups) |
| median shot / composition | 7.1 s | 2.77 s | 2.34 s | 1.96 s | 2.25 s | 29.4 s | 5.0 s (set-up 4.0 s) |
| longest hold | 44 s (data stage) | 32 s (diagram) | 18.3 s (chart) | 23.4 s (archival speech) | 28.7 s (bar stage) | 75.6 s | 17.8 s (montage) |
| fastest beat / min | cold open 25.3 | hook 29.7 | question 35.7 | the roads turn 43.9 | hook 35.3 | outro 7.0 | 21.3 set-ups (P5) |
| slowest beat / min | demonstration 3.2 | payoff 6.3 | payoff 5.9 | grid 8.7 | outro 7.4 | Q5 0.9 | expert 13.4 set-ups |
| scene-change types | 19 cuts (33 %), 13 in-place swaps, 8 dissolves or fades, 5 pans, 4 morphs, 3 static flips, 6 other | ≈ 97 % hard cuts, ≈ 3 dissolves, 1 card swap | ≈ 85 % hard cuts; 4 punch-ins, 4 match cuts, 2 blur-throughs, 2 page flips | ≈ 86 % hard cuts (≈ 35 onto a moving camera), 7 static flips, ≈ 9 dissolves | ≈ 97 % hard cuts; 6 dissolves, ≈ 6 flicker cuts, 2 morphs, 1 drop, 1 fade act break | 100 % hard cuts | 21 cuts in 24 shot changes, most wrapped in motion or a sound-locked effect; 2 dips, 1 fade |
| top shot types (% runtime) | chart 38.6, table/number 22.1, map 10.6, type-card 7.0, archival 12.1 | archival video 27.5 (social, film, TV), interview 18.5, ad 10.3, type-card 7.5, screen 7.1 | 3D 17.6, interview 13.1, host 12.1, screen 11.2, document 10.9 | archival video 43.5, map 21.5 (wall map ≈ 17), archival photo 11.0, mixed 8.8 | archival video 24.6, chart 21.7, map 19.7 (+ satellite 3.2), interview 9.9 | interview 95.6, host 3.4 | archival photos in 58 % of claim rows, type 63 %, props 35 %, interviews 13 % |
| graphics : footage : people (≈ % runtime) | 85 : 12 : 3 | 32 : 40 : 18 (+ ad 10) | 59 : 11 : 25 (+ mixed 6) | 9 : 55 : 5 (+ wall map 17, mixed 9) | 50 : 36 : 13 | 1 : 0 : 99 | collage throughout |

- **The hook cuts 2–3× faster than the body** in 5/5 animated films (25–36 per minute against 6–16).
- **Main-channel films since 2019 cut at 15.6–17.7 per minute** with median shots of 2.0–2.8 s (CR, CE, DA, AM), faster than Earworm's 9.4 shots per minute. The data film (EL) instead builds long stages (7 scenes per minute, 53 % of frames in holds ≥ 2 s) and changes them in place.
- **"One idea per composition" survives as "a stage transforms once per idea":** EL's 25 s Texas/Vermont stage, CR's 32 s battery, AM's 28.7 s bar stage, CE's isometric hero object.
- **Footage of people and sources fills 25–58 %** of the 2019–2026 films (CR, CE, DA, AM). Earworm and EL are built almost entirely from designed graphics.

### 2.4 Look families

| Family | Videos | Ground | Palette | Accent use | Type (free equivalent) | Texture / finish | Drawing rate | Branding |
|---|---|---|---|---|---|---|---|---|
| **A1 Light paper: "data paper"** | EL (2020) | static off-white `#E9E9E9` (top `#F1F1F1`), ghost newsprint at 5–8 % contrast, 83 % of the runtime | ink `#090B0B`, tile charcoal `#41423D`, map grey `#777777`; party red `#E04B4A`, blue `#5577A6`, swing orange `#E6875A`, highlighter `#FBF303`, tag mustard `#F3C357` | semantic multi-accent: red 2.1 %, blue 1.6 %, orange 0.7 %, yellow 0.2 % of paper pixels | Scotch-style text serif with old-style figures, sentence case (≈ Harriet / Georgia → Source Serif 4, Gelasio); heavy grotesque only in captions and credits (≈ Franklin Gothic → Libre Franklin Black) | none: no grain, weave or CA; holds pixel-still | ones | bug alternating with "Presented by"; title lockup on the data grid; end lockup; credits beside the host |
| **A2 Light paper: "grid paper"** | CR (2026), CE (2024) | light grey `#EAEAEA` with a faint grid (CR); white `#FEFEFE` graph paper + charcoal `#262625` grid (CE) | text `#262626`; lemon `#E4EC0B`–`#F9FF0C` (CR), `#FBFF0B` (CE); functional diagram colours (CR purple `#5600BA`, sky `#30A0E3`, green `#10F357`); CE stripe yellows `#E3E12C` / `#E8F025` | lemon is the only accent: 0.13 % of pixels (CR), 2.5 % (CE) | heavy grotesque, sentence case (≈ Libre Franklin Black / Archivo Black; CE title Archivo 800); bold condensed labels (≈ Oswald 600 / Barlow Semi Condensed 700); serif name super (≈ Source Serif 4 Bold); real handwriting (CE) | static paper; CE: light grain, pixel stripes, newsprint plates; footage keeps its native look | 15/s (CR: 2-2-1-2-1 holds); twos (CE) | bug + "Presented by" (CR); ident; yellow-bar lower third; split credits |
| **B Archive-first: "Almanac"** | DA (2019) | mostly full-bleed colour archival; monitor wall `#0E0E0E`, series cyan `#159EC8`, cream scans `#DED5B7` | yellow `#FAFE0A`, highlighter `#E4DA0F`, coral arrows `#EA6A6C`, pencil red `#90352C`, paper card `#FDF0AC` | yellow > 0.5 % of pixels in 13.6 % of frames | white heavy grotesque with letters randomly Regular/Black (≈ Archivo variable 400/900); typewriter mono for the tagline (≈ Courier Prime); serif only in the credits | VHS scanlines, dropouts and RGB fringe on archival only; real marker; torn legend chips | twos | ransom-collage series card + edition box; host outro; credits beside the host |
| **C Dark data map: "Atlas"** | AM (2019) | charcoal grain `#1d1d1b`–`#292929`; map ocean `#0f1314`–`#181c1f`; satellite greens `#405232` / `#687548` | cream text `#f3efdb`–`#fcf6de`; yellow `#f2ec0e`, coral `#e0604f`, green `#5f9a5f` | each accent ≤ 0.5 % of pixels | squared, chamfered condensed caps for display (≈ Chakra Petch / Saira Condensed); bold neo-grotesque for text (≈ Inter / Work Sans Bold) | static paper grain on charcoal; HUD graticule and crosshairs; map texture used as a material | ones; data builds step every 12 f | HUD intro + ATLAS card; typed name cards with a green tab; burned subtitles |
| **D Conversation** | HC (2026) | flat `#262626` canvas, two rounded (r ≈ 55 px) windows with a 3 px white keyline | lemon `#FDF203` (lower-third underline), credit names `#AFD2D8` | ≈ 0 % (2 × 33 f) | bold text serif names (≈ Source Serif 4 Bold / Newsreader Bold), Inter SemiBold roles | none (clean digital, webcam compression) | live on ones; type on twos and threes | persistent bug; lower third; split credits with a glitch-built mark |
| **E Dark collage: "Earworm"** (baseline) | EW | black torn paper `#0A0A0A`, ghost newsprint | periwinkle `#6B74DE`, off-white `#BEBDBE` | one accent, ≤ 8 % | Oswald condensed caps (+ Anton; Source Serif 4 on name cards) | grain re-seeded per drawing, ground weave | 12/s | bug (patched out of our assets); EARWORM end card |

**Constants across families A–D (the six videos):** a corner bug (6/6); lemon yellow as an accent (6/6); a credits split panel (6/6) with light-blue caps names (`#9DC6D0`–`#B0D3DB` in 5/6); footage in its native colour (5/5 with footage); sentence-case statements and questions on screen (EL, CR, CE) with caps for names and titles; no collage ground, torn borders, periwinkle or film weave.

**Our looks against the families:** `voxEarworm` = E. `voxExplainer` (dotted notebook desk, yellow accents, radial CA + grain, 12/s) is the nearest to A2 but is a photographed desk. Nothing matches A1, B, C or D. Family A (EL, CR, CE) is the best single new look: 3/6 videos.

### 2.5 Motion and transitions

| | EL | CR | CE | DA | AM | HC | EW |
|---|---|---|---|---|---|---|---|
| graphics drawing rate | ones (new-frame share 0.78–1.00) | ≈ 15/s (2-2-1-2-1 holds); name letters on twos | twos (12/s); some layers on fours | twos (12/s); dissolves and map moves on ones | ones; typed text on twos/fours; data builds step every 12 f | type on twos (letters) and threes (underline) | 12/s (25 fps: 2, 2, …, 3) |
| camera on graphics | slow eased pushes (9), pull-outs (4), pans (8) with peak/mean speed 2.1–2.9 | still holds + 11–15 f reframe bursts, front-loaded, then settling | stepped pushes (+0.12…+0.59 %/f for 8–28 f), then a dead hold | 19 of 27 moves peak in the first quarter; long slow pushes (×1.81 in 17 s) | map fly-outs symmetric (peak at 45–51 %); shot-head pull-outs peak at 0–17 %; one crash ×7.1 in 39 f | none | pushes accelerate and stop dead on the keyword; crash ×2.7 in 11 f; multiplane |
| grammar | S-curve | fast start, slow settle | step, then hold | fast start, slow settle | S-curve (maps), ease-out (shot heads) | static | stop dead |
| holds | pixel-still | pixel-still | dead after each push | still | still (static grain) | — | dead still; life from the ground weave |
| entrances | fades 4–15 f, box-wipe + type-on 15 f, unit dots ≈ 1 per frame, bars 25–40 f | type-on 11–18 f, marks pop in 1 f, highlights 7–17 f | genie ≈ 4 f, extrusion, pops every 2–4 f, tracking-in 6 f | box glitch 14 f + slide 12 f, wipes 8–10 f, scatter type-on 16 f | type-on ≈ 14 chars/s (and un-type), wipes, 5 f slides | scattered letter fade on twos | unfold, slam, masked rise, decode |

**Transition frequencies** (count per video):

| Transition | EL | CR | CE | DA | AM | HC | EW |
|---|---|---|---|---|---|---|---|
| hard cut (`V-HC`) | 19 | 126 | ≈ 127 | ≈ 110 | ≈ 175 | 38 | ≈ 21 |
| onto a moving camera (`V-MOV`) | 2 | — | — | ≈ 35 | ≈ 10 | — | — |
| in-place swap (`T-IC`) | 13 | 5 | (3 phone swaps) | — | 4 | — | — |
| dissolve (`T-DS`) | 6 (9–28 f) | ≈ 3 | 1 (7 f) | ≈ 9 (15–25 f) | 6 (5–12 f) | — | 1 (7 f) |
| label persists across a cut (`T-PCap`) | 2 | 1 | — | 10 | ≈ 12 | — | — |
| morph or slide without a cut | 4 + 2 | 2 focus swaps | 4 window genies | — | 2 | — | 1 spin-swap |
| static / flicker / glitch flip | 3 | 1 stutter | — | 7 | ≈ 6 | — | 1 glitch cut (end card) |
| black (drop, dip, fade, cut to black) | 1 fade (end) | — | — | 1 cut to black | 1 drop, 1 act-break fade, 1 dip, 2 cuts to black, 1 fade (end) | — | 1 drop, 2 dips |
| blur-through | — | (2 rack focus) | 2 (silent) | — | — | — | 2 (sub-boom) |

Hard cuts dominate everywhere. Motion around the cut is rare: one speed-ramped push into the ident and 4 punch-ins (CE); no Earworm-style push- or pull-through. Dissolves are normal (5/6). Black belongs to the Atlas act break and the Almanac outro, not to chapters.

### 2.6 Audio and sync

| | EL | CR | CE | DA | AM | HC | EW / our default |
|---|---|---|---|---|---|---|---|
| speech over music | 19.2 dB (IQR 15.3–23.5) | 9.3 dB | 14.2 dB (IQR 10.1–17.6) | ≈ 13 dB | 7.3 dB | no music | 9.7 dB; our bed: gap −7.6 dB, ≈ −10 dB under speech |
| ducking | median 2.3 dB per phrase: static | 0.56 dB: none | 0.09 dB: none | 2.4 pooled, 0.7 phrase-locked: not ridden | 1.8 dB; only interviews (12–18 dB) and the host are ducked | — | ridden by hand: +2.4 dB gap swell, −10…−12 dB in 3–5 f; code default `ride: true` |
| distinct cues | ≈ 11 (8 tracks), ≈ 1.4/min | ≈ 8 (6 tracks), ≈ 0.8/min | 11 (8 tracks), 1.2/min | ≈ 15 (5 tracks + a riser), ≈ 1.6/min | 10 (7 tracks), ≈ 0.85/min | 0 | ≈ 15 cues, 10.5 boundaries/min; doc 13 asks 8–12/min |
| silence holes at joints | 3 digital (9–24 f) + 4 bed drops | 5 resets (5–29 f) + 16 rests (4–11 f); 9.9 s silent end card | 3 digital (11–14 f) + 3 near (31–39 f) | 6 f drop-out, 11 f hole, 35 f decay + 26 f silence | 17, 13, 27, 7 f; 5 f in the drop and the act break | none | 8–11 f holes; dips and the drop black out the picture |
| new cue vs the cut | hard in on the cut (×3); one 5 f pre-lap | 3–6 f after the cut | on the scene's first frame | 1 f and 5 f after the cut | within ±4 f of the cut | — | music first: median 3.5 f before the cut (pre-lap 4–15 f) |
| last frame | music alone under the card, then 15 f of silence | silent end card (hard stop 4.3 s into it) | promo bed, 8 f fade | 27 f fade + 30 f silence | music to the last frame | silent | music to the last frame |
| SFX (unverified) | ≈ 7, ≈ 0.9/min; none on slides, dots or type-on | 3 candidates, ≈ 0.3/min | ≈ 13 candidates, ≈ 1.4/min | ≈ 11 (riser, drop-out, zaps), ≈ 1.2/min | ≈ 6, ≈ 0.5/min | 0 | 6.6/min; doc 13 asks 4–7/min |
| cuts within ±2 f of a word onset (vs chance) | 28 % vs 42 % (p 0.97) | 31.5 % vs 43.7 % (p 1.0) | 34 % vs 42 % (p 0.98) | 30.7 % vs 36.9 % (p 0.95) | 22.1 % vs 33.1 % (avoided) | 24 % vs 26 % (±1 f, p 0.67) | keyword cuts on the onset (0 f) |
| cuts vs phrase onsets | scene changes median −1 f, 67 % within ±12 f | 25.2 % lead by 0–12 f vs 7.5 % (median −3.7 f) | 24.8 % vs 9.8 % (median −3.6 f) | 20.7 % vs 8.8 % (median lead 2.3 f) | not tested (20 % of cuts in pauses) | 19 of 37 within −7…+3 f of a sentence onset | cut −5 f before a narrator onset, −11 f before a paragraph |
| cuts vs beats | R 0.10 (p 0.82) | 19.5 % vs 19.1 % | 24 % vs 23 % | 14.3 % vs ≈ 12 %; 3 bursts on 16th notes | enrichment 1.62, R 0.12: no lock | — | never on beats |
| cuts vs music edits | ×2.66 (p 0.034) | ×2.8 (p 0.002) | ×1.6 (p 0.17) | (audio onsets 42 % vs 28 %) | ×4.6 (p 0.002) | — | 43 % within 0–12 f |
| labels vs the spoken word | −4…−15 f (type-on start); the "270" marker +52 f | median ≈ +2 f (−11…+6) | −4…−16 f | name label −7, labels −15…+8, date tags 0 / +6 / +19 | median −6 f (IQR −26…+9) | lower third 16–24 f before the name | text −7 f (−22…0) |
| highlights and rings vs the word | rings 6–16 f on the stressed word; a highlighter starts −12 f | median +2 f; sweeps 7–17 f | −6…+5 f (median ≈ +1); 7–13 f | +3, +5, −3 f; 14–22 f | — | — | rings end at onset +1…+2 |
| name card vs the person | super on the clip | 2–3 f after the cut | +6 f after the name; 12 f after the cut | +9 f | −4 / +9 f | on the cut (0 f), or ≈ 1 s before the name | surname resolves at +4 f |
| beat-locked | a map flipbook on the pulse (18.6 f ≈ 77 BPM) | nothing | nothing | 3 montage bursts on 16th notes (±1 f) | nothing proven | — | music-only passages on eighths |

- **The sample's sound is simpler than Earworm's:** one static bed per section, a short silent hole at each chapter joint, very few SFX, and the new cue enters at or just after the cut rather than before it.
- **Cuts are placed by phrases** (they lead the phrase onset by 0–12 f) **and by music edits.** They avoid word onsets inside a phrase and ignore the beat outside short montage bursts.
- **Annotation timing is close to ours:** labels lead their word by 4–16 f (our text kind: −7 f); highlights and rings land on the word (≈ 0…+3 f).

## 3. Device frequency matrix

Canonical devices with their aliases merged (aliases and descriptions: `analysis/vox-sample/devices.json`). Ranked by the number of videos using a device, then by its total count. "·" = not used; ≈ = approximate count. Whole-film patterns count 1 per video. The last rows are Earworm signatures that no sample video uses.

| # | Device (family) | EL | CR | CE | DA | AM | HC | n/6 | total | EW |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `V-HC` (transition) | 19 | 126 | ≈127 | ≈110 | ≈175 | 38 | **6** | 595 | 21 |
| 2 | `NEW-lower-third` (packaging) | 1 | 2 | 3 | 1 | 3 | 2 | **6** | 12 | 2 |
| 3 | `NEW-corner-bug` (packaging) | 1 | 1 | 1 | 1 | 1 | 1 | **6** | 6 | 1 |
| 4 | `NEW-credits-split-panel` (packaging) | 1 | 1 | 1 | 1 | 1 | 1 | **6** | 6 | 0 |
| 5 | `SIG-VX-2` (look) | 1 | 1 | 1 | 1 | 1 | 1 | **6** | 6 | 0 |
| 6 | `NEW-fullframe-archival-broll` (footage) | 4 | ≈33 | ≈30 | ≈25 | ≈106 | · | **5** | 198 | 1 |
| 7 | `SIG-VX-5` (document) | 1 | ≈14 | ≈14 | 5 | 2 | · | **5** | 36 | 0 |
| 8 | `T-DS` (transition) | 6 | ≈3 | 1 | ≈9 | 6 | · | **5** | 25 | 1 |
| 9 | `NEW-music-reset-hole` (audio) | 3 | 5 | 6 | 3 | 4 | · | **5** | 21 | 3 |
| 10 | `K-SketchArrow` (annotation) | ≈6 | 2 | ≈7 | 3 | 1 | · | **5** | 19 | 1 |
| 11 | `NEW-host-on-camera` (packaging) | 1 | · | 9 | 2 | 1 | 3 | **5** | 16 | 0 |
| 12 | `K-HandDrawnRing` (annotation) | 6 | 1 | 2 | 4 | 1 | · | **5** | 14 | 1 |
| 13 | `NEW-phrase-lead-cut` (sync) | 1 | 1 | 1 | 1 | · | 1 | **5** | 5 | 0 |
| 14 | `NEW-section-cue-music` (audio) | 1 | 1 | 1 | 1 | 1 | · | **5** | 5 | 0 |
| 15 | `NEW-series-title-card` (packaging) | 1 | 1 | 1 | 1 | 1 | · | **5** | 5 | 0 |
| 16 | `NEW-static-low-bed` (audio) | 1 | 1 | 1 | 1 | 1 | · | **5** | 5 | 0 |
| 17 | `NEW-uncaptioned-archival-speech` (footage) | 2 | 14 | · | 14 | ≈45 | · | **4** | 75 | 2 |
| 18 | `NEW-fullframe-interview` (footage) | · | 19 | 12 | · | ≈10 | 17 | **4** | 58 | 0 |
| 19 | `R-DocumentHighlight` (document) | · | 12 | ≈24 | ≈5 | 4 | · | **4** | 45 | 1 |
| 20 | `T-PCap` (transition) | 2 | 1 | · | 10 | ≈12 | · | **4** | 25 | 0 |
| 21 | `NEW-source-line` (data) | 4 | 4 | 1 | · | ≈12 | · | **4** | 21 | 1 |
| 22 | `R-DataChart` (data) | 9 | 4 | 1 | · | 7 | · | **4** | 21 | 0 |
| 23 | `NEW-corner-source-tag` (footage) | · | ≈50 | · | 1 | ≈40 | · | **3** | 91 | 1 |
| 24 | `V-MOV` (transition) | 2 | · | · | ≈35 | ≈10 | · | **3** | 47 | — |
| 25 | `NEW-ease-out-reframe` (camera) | · | ≈8 | · | 19 | ≈10 | · | **3** | 37 | — |
| 26 | `K-Typewriter` (annotation) | 6 | 3 | · | · | ≈25 | · | **3** | 34 | 3 |
| 27 | `T-IC` (transition) | 13 | 5 | · | · | 4 | · | **3** | 22 | 0 |
| 28 | `NEW-tv-static-flip` (transition) | 3 | · | · | 7 | ≈6 | · | **3** | 16 | 0 |
| 29 | `NEW-choropleth-map` (map) | 7 | · | · | 5 | 1 | · | **3** | 13 | 0 |
| 30 | `PD-5` (map) | 1 | · | 2 | · | ≈6 | · | **3** | 9 | 1 |
| 31 | `NEW-flat-vector-diagram` (data) | 3 | 1 | 2 | · | · | · | **3** | 6 | 0 |
| 32 | `NEW-speech-prelap` (audio) | · | 1 | 1 | 3 | · | · | **3** | 5 | 3 |
| 33 | `NEW-archival-news-supercut` (footage) | 1 | 2 | · | · | 1 | · | **3** | 4 | 0 |
| 34 | `NEW-line-chart-draw` (data) | 1 | 1 | · | · | 2 | · | **3** | 4 | 0 |
| 35 | `NEW-read-along-highlight` (document) | 1 | · | 2 | 1 | · | · | **3** | 4 | 0 |
| 36 | `NEW-cut-on-music-edit` (sync) | 1 | 1 | · | · | 1 | · | **3** | 3 | 1 |
| 37 | `NEW-light-paper-ground` (look) | 1 | 1 | 1 | · | · | · | **3** | 3 | 0 |
| 38 | `NEW-sponsor-segment` (packaging) | 1 | 1 | 1 | · | · | · | **3** | 3 | 0 |
| 39 | `R-EndCard` (packaging) | 1 | 1 | · | · | · | 1 | **3** | 3 | 1 |
| 40 | `SIG-PD-8` (transition) | ≈30 | · | 2 | · | · | · | **2** | 32 | — |
| 41 | `NEW-archival-date-tag` (footage) | · | · | · | 8 | 6 | · | **2** | 14 | 0 |
| 42 | `NEW-chart-morph-chain` (data) | 3 | · | · | · | 8 | · | **2** | 11 | 0 |
| 43 | `NEW-question-led-chapters` (structure) | · | · | 4 | · | · | 7 | **2** | 11 | 0 |
| 44 | `V-RET` (transition) | · | · | 2 | 7 | · | · | **2** | 9 | — |
| 45 | `PD-2` (data) | 2 | · | · | · | 5 | · | **2** | 7 | 0 |
| 46 | `T-WH` (transition) | 5 | · | · | · | 1 | · | **2** | 6 | — |
| 47 | `NEW-name-label-arrow` (annotation) | · | 2 | · | 3 | · | · | **2** | 5 | 1 |
| 48 | `NEW-beat-locked-montage-burst` (sync) | 1 | · | · | 3 | · | · | **2** | 4 | 1 |
| 49 | `NEW-headline-card` (document) | · | · | · | 2 | 2 | · | **2** | 4 | 0 |
| 50 | `E-CB` (transition) | · | · | · | 1 | 2 | · | **2** | 3 | 0 |
| 51 | `K-RackFocus` (transition) | 1 | 2 | · | · | · | · | **2** | 3 | — |
| 52 | `NEW-scatter-letter-type-on` (packaging) | · | · | · | 1 | · | 2 | **2** | 3 | 0 |
| 53 | `SIG-EW-7` (annotation) | · | · | · | 1 | 1 | · | **2** | 2 | 4 |
| 54 | `T-CS` (transition) | · | 1 | · | · | · | 1 | **2** | 2 | — |
| 55 | `T-FB` (transition) | 1 | · | · | · | 1 | · | **2** | 2 | 0 |
| 56 | `T-WL` (transition) | · | 1 | 1 | · | · | · | **2** | 2 | 0 |
| — | `R-ColdOpenYear` (packaging) | · | · | · | · | · | · | **0** | 0 | 1 |
| — | `R-MontageCrane` (camera) | · | · | · | · | · | · | **0** | 0 | 1 |
| — | `R-PhotoCollageUnfold` (packaging) | · | · | · | · | · | · | **0** | 0 | 7 |
| — | `SIG-EW-1` (sync) | · | · | · | · | · | · | **0** | 0 | 1 |
| — | `SIG-EW-11` (camera) | · | · | · | · | · | · | **0** | 0 | 1 |
| — | `SIG-EW-2/3` (look) | · | · | · | · | · | · | **0** | 0 | 1 |
| — | `SIG-EW-9` (packaging) | · | · | · | · | · | · | **0** | 0 | 2 |

**Devices used by one video only** (83; ranked by count inside each video):

| Video | Devices used only here (count) |
|---|---|
| EL (14) | `NEW-state-badge-tile` 9, `NEW-portrait-roundel-tags` 7, `NEW-two-tone-party-label` 5, `NEW-unit-grid-cartogram` 5, `K-DotField` 4, `NEW-bubble-map` 2, `NEW-chart-slide-swap` 2, `NEW-paper-timeline-scroll` 2, `NEW-tile-to-unit-dots` 2, `R-QuoteCard` 2, `E-TB` 1, `K-ColorFlash` 1, `NEW-key-line-caption-box` 1, `NEW-print-slide-over` 1 |
| CR (8) | `NEW-vertical-social-panels` ≈16, `NEW-engraving-section-icon` 5, `NEW-document-isolate-blur` 4, `NEW-verdict-checklist` 3, `NEW-3d-medical-render` 2, `NEW-focus-scale-swap` 2, `NEW-stutter-jumpcut` 1, `NEW-word-morph-etymology` 1 |
| CE (17) | `NEW-pixel-stripe-texture` ≈20, `NEW-isometric-hero-object` 13, `NEW-host-at-work-b-roll` ≈8, `NEW-relatable-unit-equation` 4, `NEW-ui-window-genie` 4, `T-PC` 4, `NEW-filmed-monitor-punch-in` 3, `NEW-desktop-ui-callback` 2, `X-BlurThroughCut` 2, `NEW-build-time-dial` 1, `NEW-day-night-ground-swap` 1, `NEW-efficiency-badges` 1, `NEW-phone-mockup-screen-swap` 1, `NEW-podcast-host-promo` 1, `NEW-sponsor-cliffhanger` 1, `NEW-typed-question-doc` 1, `V-SRP` 1 |
| DA (13) | `NEW-mixed-weight-type` ≈40, `NEW-hands-on-wall-map` ≈10, `K-Pillarbox` 9, `NEW-selective-colour-isolation` 7, `K-LabelStrip` 4, `NEW-vhs-artifact-finish` 3, `NEW-document-text-overprint` 2, `NEW-monitor-wall-grid` 2, `R-KeywordCut` 2, `NEW-host-outro-comments` 1, `R-KaraokeQuote` 1, `SIG-EW-10` 1, `T-SP` 1 |
| AM (25) | `NEW-burned-subtitles` ≈45, `NEW-satellite-basemap` 17, `NEW-map-texture-stacked-bar` 8, `NEW-map-region-mask` ≈6, `K-LeaderLine` 4, `NEW-era-band-under-axis` 4, `NEW-map-fly-out-fly-in` 4, `NEW-protected-areas-mosaic` 4, `NEW-dot-hemicycle` 3, `NEW-map-tile-accretion` 3, `NEW-bar-tilt-org-chart` 2, `NEW-fire-dot-overlay` 2, `NEW-map-band-label` 2, `NEW-map-photo-window` 2, `NEW-two-panel-split` 2, `X-DipToBlack` 2, `NEW-big-title-over-dimmed-photo` 1, `NEW-flow-ribbon-world` 1, `NEW-hatched-region-label-box` 1, `NEW-location-tag` 1, `NEW-photo-flash-burst` 1, `NEW-satellite-timelapse` 1, `NEW-scale-card-map-texture` 1, `R-MapRoute` 1, `X-Drop` 1 |
| HC (6) | `NEW-voice-only-claim` ≈110, `NEW-two-up-single-alternation` 34, `NEW-two-up-call-windows` 17, `NEW-addressee-cut` 3, `NEW-flicker-fade-out` 2, `NEW-host-recap-check` 1 |

## 4. Coverage matrix

Statuses were verified in the code. Four checks changed the inventory's picture:
- `CameraRig` has no stop-dead preset. The snap-stop push exists only in `src/proof/earworm/Shot1.tsx`.
- Dissolves exist only inline in proof shots (`src/proof/earwormC/Melvin.tsx`). The storyboard's transitions are cut, blurThrough, spinSwap, dip, drop and glitchCut (`src/studio/Timeline.tsx`).
- Every recipe hard-codes `voxEarworm` colours, and `RecipeFrame` always draws the black collage ground (`src/recipes/shared.tsx`).
- `ZoomWindow` plays video muted (`src/earworm/ZoomWindow.tsx`). The only recipe that plays a clip's sound is `KaraokeQuote`, and it always captions it.

**Summary by status** (devices used by at least one video):

| Status | Devices used by ≥ 2 videos | Devices used by 1 video | All used devices | Device-uses (Σ n/6) |
|---|---|---|---|---|
| covered | 4 | 5 | 9 | 19 |
| covered ≠ | 19 | 3 | 22 | 79 |
| kit-only | 13 | 8 | 21 | 47 |
| proof-only | 2 | 0 | 2 | 7 |
| doc-only | 4 | 4 | 8 | 13 |
| missing | 14 | 63 | 77 | 112 |
| **total** | 56 | 83 | 139 | 277 |

**Devices used by ≥ 2 videos, and absent Earworm signatures:**

| Device | n/6 | Status | Our file(s) | Notes (how our spec differs) |
|---|---|---|---|---|
| `V-HC` | 6 | covered | `src/studio/Timeline.tsx` | placed by phrase and turn logic, not word onsets (see NEW-phrase-lead-cut) |
| `NEW-lower-third` | 6 | covered ≠ | `src/recipes/NameCardInterview.tsx`, `src/earworm/DecodeNameCard.tsx` | ours = Earworm decode card (condensed periwinkle caps, random-letter decode) beside a window on a black plate; no plate-less super over full-frame footage |
| `NEW-corner-bug` | 6 | missing | — | nothing in the kit; never ship the Vox bug (doc 12 §8): build an own series bug as a storyboard-level overlay |
| `NEW-credits-split-panel` | 6 | missing | `src/recipes/EndCard.tsx` | R-EndCard renders only a glitch-built series card on #141414 with a bass hit; no credits, pages, rule or video panel |
| `SIG-VX-2` | 6 | covered ≠ | `src/tokens/colors.ts` | voxExplainer tokens carry yellows, but every recipe hard-codes periwinkle |
| `NEW-fullframe-archival-broll` | 5 | missing | `src/earworm/ZoomWindow.tsx`, `src/effects/Pillarbox.tsx`, `src/tokens/finish.ts` | nearest = ZoomWindow (muted, windowed); PHOTO_GRADE.voxEarworm desaturates archive |
| `SIG-VX-5` | 5 | kit-only | `src/type/Highlighter.tsx` | Highlighter exists (multiply, 12 f) but no recipe uses it; DocumentHighlight draws periwinkle rings only |
| `T-DS` | 5 | proof-only | `src/proof/earwormC/Melvin.tsx` | no `dissolve` transition kind; doc 07 forbids dissolves for the Vox explainer |
| `NEW-music-reset-hole` | 5 | covered ≠ | `src/studio/StoryAudio.tsx`, `docs/style-guide/11-audio-sync.md` | doable by hand with music in/out anchors; doc 11 rule 5 measures 8–11 f; our `dip`/`drop` also black out the picture |
| `K-SketchArrow` | 5 | kit-only | `src/explainer/strokes.tsx` | SketchArrow exists in the kit; no recipe draws an arrow |
| `NEW-host-on-camera` | 5 | missing | `src/earworm/ZoomWindow.tsx` | no live-action slot: ZoomWindow plays a muted clip in a window; needs a full-frame clip with its own sound (build 6) |
| `K-HandDrawnRing` | 5 | covered ≠ | `src/recipes/DocumentHighlight.tsx`, `src/earworm/HandRing.tsx`, `src/explainer/rings.tsx` | the recipe ring is periwinkle and only on documents |
| `NEW-phrase-lead-cut` | 5 | covered ≠ | `src/studio/resolve.ts`, `src/audio/defaults.ts` | reachable with a manual `offset`; the default `cut` kind lands on the word onset (0 f) |
| `NEW-section-cue-music` | 5 | covered ≠ | `docs/style-guide/13-story-to-screen.md` | cues: electoral ≈ 11, creatine ≈ 8, cleanenergy 11, drinkingage ≈ 15, amazon 10; Earworm changes every 5.7 s (10.5 boundaries/min) and doc 13 asks for 8–12/min |
| `NEW-series-title-card` | 5 | covered ≠ | `src/recipes/EndCard.tsx`, `src/earworm/SeriesCard.tsx` | EndCard can be placed mid-video, but it is the end glitch card; doc 13 templates put the series card only at the end (Earworm: 98 %) |
| `NEW-static-low-bed` | 5 | covered ≠ | `src/studio/StoryAudio.tsx`, `src/audio/defaults.ts` | `ride: false` exists; the default rides the bed (duck −2.4 dB, gap level −7.6 dB) |
| `NEW-uncaptioned-archival-speech` | 4 | covered ≠ | `src/recipes/KaraokeQuote.tsx` | KaraokeQuote plays the clip's audio but always captions it word by word, over a still at most; doc 13 rule 8 typesets every archival word |
| `NEW-fullframe-interview` | 4 | covered ≠ | `src/recipes/NameCardInterview.tsx`, `src/earworm/ZoomWindow.tsx` | ours: a muted window on the black plate with a decode card beside it |
| `R-DocumentHighlight` | 4 | covered ≠ | `src/recipes/DocumentHighlight.tsx` | ours: torn B&W print on the black collage, linear 6 % push, periwinkle rings; no full-bleed page, browser frame, highlighter or source line |
| `T-PCap` | 4 | kit-only | `src/type/VideoCaption.tsx` | no storyboard layer spans scenes |
| `NEW-source-line` | 4 | missing | — | no component; RESEARCH.md/CREDITS.md hold sources but nothing reaches the picture |
| `R-DataChart` | 4 | covered ≠ | `src/recipes/DataChart.tsx`, `src/explainer/BarChart.tsx` | ours: a counter or periwinkle bars on the black plate; no title, axis, line/area/stacked mode, source line or theme colours |
| `NEW-corner-source-tag` | 3 | missing | `src/tokens/type.ts` | only the `nowPlaying` type role exists; no component |
| `V-MOV` | 3 | kit-only | `src/motion/CameraRig.tsx`, `src/tokens/easing.ts` | the `settle` ease exists; no recipe starts on a moving camera |
| `NEW-ease-out-reframe` | 3 | kit-only | `src/motion/CameraRig.tsx`, `src/tokens/easing.ts` | recipes expose no camera keys; Earworm's push stops dead |
| `K-Typewriter` | 3 | covered | `src/type/Typewriter.tsx`, `src/earworm/TypewriterSlide.tsx`, `src/earworm/StationLabel.tsx` | matches; our recipes type in condensed caps |
| `T-IC` | 3 | covered ≠ | `src/studio/Timeline.tsx` | a cut between two scenes on the same static ground looks alike, but the content cannot fade |
| `NEW-tv-static-flip` | 3 | covered ≠ | `src/earworm/fx/GlitchCut.tsx` | glitchCut = 6 f dip + 4 f zoom blur + 18 f glitch build + bass hit (an end-card transition) |
| `NEW-choropleth-map` | 3 | missing | — | needs public-domain region geometry (US Census / Natural Earth) |
| `PD-5` | 3 | covered ≠ | `src/recipes/MapRouteScene.tsx`, `src/earworm/StationLabel.tsx` | ours: dark vector map + Earworm station label + X |
| `NEW-flat-vector-diagram` | 3 | kit-only | `src/collage/Props.tsx`, `src/proof/vox/Shot2Concept.tsx` | DiagramCard draws a black Vox card; diagrams exist only in a proof shot; no diagram recipe |
| `NEW-speech-prelap` | 3 | doc-only | `docs/style-guide/11-audio-sync.md`, `src/audio/defaults.ts` | doc 11 §2 has the offsets (speakerCutLagF, ≤ 31 f pre-lap), but no recipe plays a clip's audio across a cut |
| `NEW-archival-news-supercut` | 3 | missing | — | news clips need a fair-use path outside our PD-first sourcing |
| `NEW-line-chart-draw` | 3 | kit-only | `src/explainer/DrawPath.tsx` | DrawPath can draw the line; DataChart has no line mode |
| `NEW-read-along-highlight` | 3 | missing | `src/type/Highlighter.tsx` | Highlighter makes one sweep; no per-line timing |
| `NEW-cut-on-music-edit` | 3 | covered | `docs/style-guide/11-audio-sync.md`, `src/audio/defaults.ts` | doc 11 rule 5; placed by hand |
| `NEW-light-paper-ground` | 3 | kit-only | `src/effects/Paper.tsx`, `src/tokens/theme.tsx`, `src/recipes/shared.tsx` | Paper kinds `grid` (cream) and `dots` exist; RecipeFrame always draws the black collage ground |
| `NEW-sponsor-segment` | 3 | missing | — | build only an empty slot in the templates; never reproduce a sponsor's marks |
| `R-EndCard` | 3 | covered ≠ | `src/recipes/EndCard.tsx`, `src/earworm/fx/GlitchCut.tsx` | glitch build matches healthcare's mark build; no credits beside it; ours always gets a bass hit |
| `SIG-PD-8` | 2 | kit-only | `src/transitions/Shot.tsx`, `src/transitions/effects.ts` | head/tail effects exist for coded shots; the storyboard cannot hide a cut in a morph |
| `NEW-archival-date-tag` | 2 | missing | `src/earworm/LabelStrip.tsx` | nearest: LabelStrip (an Earworm strip label) |
| `NEW-chart-morph-chain` | 2 | missing | `src/explainer/BarChart.tsx` | BarChart animates one state; no morph between views |
| `NEW-question-led-chapters` | 2 | missing | `src/type/HandwritingWriteOn.tsx` | our chapter marker is a dip to black (doc 13 §4.1); handwriting write-on exists only as a kit component |
| `V-RET` | 2 | covered ≠ | `src/recipes/index.ts` | re-call the recipe; annotations do not persist |
| `PD-2` | 2 | covered ≠ | `src/recipes/DataChart.tsx`, `src/type/Figures.tsx` | DataChart counter or SlotReel; no year flipbook on a map |
| `T-WH` | 2 | kit-only | `src/transitions/effects.ts` | whipIn/whipOut are coded shot head/tails, not storyboard transitions |
| `NEW-name-label-arrow` | 2 | kit-only | `src/earworm/Marks.tsx`, `src/explainer/strokes.tsx` | AnnotationLabel + SketchArrow, in no recipe |
| `NEW-beat-locked-montage-burst` | 2 | covered ≠ | `src/studio/resolve.ts`, `tools/studio/validate_storyboard.py` | `snap` (beat or eighth) only in music-only passages; no 16th-note grid |
| `NEW-headline-card` | 2 | proof-only | `src/proof/editorial/ClippingScene.tsx` | ClippingScene is a proof of the editorial look |
| `E-CB` | 2 | doc-only | `docs/style-guide/07-transitions.md` | no black or empty scene in the storyboard |
| `K-RackFocus` | 2 | kit-only | `src/transitions/effects.ts` | rackFocusIn is a coded shot head |
| `NEW-scatter-letter-type-on` | 2 | missing | `src/earworm/DecodeNameCard.tsx` | DecodeNameCard scrambles letters (random glyphs), it does not reveal them in place |
| `SIG-EW-7` | 2 | covered | `src/recipes/GiantWordCard.tsx` | matches (GiantWordCard) |
| `T-CS` | 2 | doc-only | `docs/style-guide/07-transitions.md` | no panel persists across scenes |
| `T-FB` | 2 | kit-only | `src/transitions/effects.ts` | fadeToBlack is a coded shot tail; storyboards end on a cut |
| `T-WL` | 2 | doc-only | `docs/style-guide/07-transitions.md` | 5 f cards would also break the validator's 6 f cut rule |
| `R-ColdOpenYear` | 0 | covered | `src/recipes/ColdOpenYear.tsx` | no match in the sample (amazon's odometer is PD-2) |
| `R-MontageCrane` | 0 | covered | `src/recipes/MontageCrane.tsx` | no match in the sample (no multiplane anywhere) |
| `R-PhotoCollageUnfold` | 0 | covered | `src/recipes/PhotoCollageUnfold.tsx` | no match in the sample |
| `SIG-EW-1` | 0 | covered | `src/studio/resolve.ts`, `src/audio/defaults.ts` | absent in all six: cuts avoid word onsets (electoral p 0.97, creatine p 1.0, cleanenergy p 0.98, drinkingage p 0.95, amazon enrichment 0.67) |
| `SIG-EW-11` | 0 | proof-only | `src/proof/earworm/Shot1.tsx`, `src/motion/CameraRig.tsx` | absent in all six; the snap-stop push lives only in the proof shot |
| `SIG-EW-2/3` | 0 | covered | `src/earworm/BlackCollageGround.tsx`, `src/earworm/TornPhoto.tsx` | absent in all six |
| `SIG-EW-9` | 0 | covered | `src/earworm/DecodeNameCard.tsx` | absent in all six (all name cards are other styles) |

**Devices used by one video only:**

| Device | Video (count) | Status | Our file(s) / nearest | Note |
|---|---|---|---|---|
| `NEW-flicker-fade-out` | HC 2 | missing | — |  |
| `NEW-host-outro-comments` | DA 1 | missing | — |  |
| `NEW-podcast-host-promo` | CE 1 | missing | — |  |
| `NEW-addressee-cut` | HC 3 | missing | — |  |
| `NEW-desktop-ui-callback` | CE 2 | missing | — |  |
| `NEW-engraving-section-icon` | CR 5 | missing | — |  |
| `NEW-focus-scale-swap` | CR 2 | missing | — |  |
| `NEW-host-recap-check` | HC 1 | missing | — |  |
| `NEW-sponsor-cliffhanger` | CE 1 | missing | — | script device; doc 13 has no sponsor slot |
| `NEW-two-up-call-windows` | HC 17 | missing | `src/earworm/ZoomWindow.tsx` |  |
| `NEW-two-up-single-alternation` | HC 34 | missing | — |  |
| `NEW-typed-question-doc` | CE 1 | missing | `src/type/Typewriter.tsx` |  |
| `NEW-verdict-checklist` | CR 3 | missing | — |  |
| `NEW-voice-only-claim` | HC ≈110 | missing | `docs/style-guide/13-story-to-screen.md` | doc 13 §5.5 forbids 'a number that no picture carries'; acceptable only in the conversation format |
| `K-Pillarbox` | DA 9 | kit-only | `src/effects/Pillarbox.tsx` |  |
| `NEW-3d-medical-render` | CR 2 | missing | — | licensed stock footage → a full-frame clip |
| `NEW-burned-subtitles` | AM ≈45 | missing | `src/type/VideoCaption.tsx` |  |
| `NEW-filmed-monitor-punch-in` | CE 3 | missing | — |  |
| `NEW-host-at-work-b-roll` | CE ≈8 | missing | — |  |
| `NEW-location-tag` | AM 1 | missing | — |  |
| `NEW-vertical-social-panels` | CR ≈16 | missing | — |  |
| `NEW-document-isolate-blur` | CR 4 | missing | `src/motion/blur.tsx` |  |
| `NEW-document-text-overprint` | DA 2 | missing | — |  |
| `NEW-key-line-caption-box` | EL 1 | missing | — |  |
| `NEW-word-morph-etymology` | CR 1 | missing | `src/type/Typewriter.tsx`, `src/explainer/strokes.tsx` |  |
| `R-QuoteCard` | EL 2 | covered ≠ | `src/recipes/QuoteCard.tsx` | ours types the quote letter by letter in condensed caps on black |
| `K-ColorFlash` | EL 1 | kit-only | `src/explainer/DotPop.tsx` |  |
| `K-DotField` | EL 4 | kit-only | `src/explainer/DotPop.tsx` |  |
| `NEW-bar-tilt-org-chart` | AM 2 | missing | — |  |
| `NEW-build-time-dial` | CE 1 | missing | — |  |
| `NEW-dot-hemicycle` | AM 3 | missing | — |  |
| `NEW-efficiency-badges` | CE 1 | missing | — |  |
| `NEW-era-band-under-axis` | AM 4 | missing | — |  |
| `NEW-isometric-hero-object` | CE 13 | missing | — |  |
| `NEW-map-texture-stacked-bar` | AM 8 | missing | — |  |
| `NEW-paper-timeline-scroll` | EL 2 | kit-only | `src/explainer/TimelineMarker.tsx` | TimelineMarker is the dark-map timeline (PD-11) |
| `NEW-portrait-roundel-tags` | EL 7 | missing | — |  |
| `NEW-relatable-unit-equation` | CE 4 | doc-only | `docs/style-guide/08-scene-recipes.md` |  |
| `NEW-scale-card-map-texture` | AM 1 | missing | — |  |
| `NEW-state-badge-tile` | EL 9 | missing | — | ≈ 30 tiles in 9 set-ups |
| `NEW-tile-to-unit-dots` | EL 2 | missing | `src/explainer/DotPop.tsx` |  |
| `NEW-unit-grid-cartogram` | EL 5 | missing | — |  |
| `NEW-bubble-map` | EL 2 | missing | — |  |
| `NEW-fire-dot-overlay` | AM 2 | missing | — |  |
| `NEW-flow-ribbon-world` | AM 1 | missing | — |  |
| `NEW-hands-on-wall-map` | DA ≈10 | missing | — |  |
| `NEW-hatched-region-label-box` | AM 1 | missing | — |  |
| `NEW-map-band-label` | AM 2 | missing | — |  |
| `NEW-map-fly-out-fly-in` | AM 4 | kit-only | `src/motion/CameraRig.tsx` |  |
| `NEW-map-photo-window` | AM 2 | missing | — |  |
| `NEW-map-region-mask` | AM ≈6 | missing | — |  |
| `NEW-map-tile-accretion` | AM 3 | missing | — |  |
| `NEW-protected-areas-mosaic` | AM 4 | missing | — |  |
| `NEW-satellite-basemap` | AM 17 | missing | — |  |
| `NEW-satellite-timelapse` | AM 1 | missing | — |  |
| `NEW-selective-colour-isolation` | DA 7 | missing | — |  |
| `R-MapRoute` | AM 1 | covered ≠ | `src/recipes/MapRouteScene.tsx`, `src/explainer/MapRoute.tsx` |  |
| `K-LabelStrip` | DA 4 | covered ≠ | `src/earworm/LabelStrip.tsx` |  |
| `K-LeaderLine` | AM 4 | kit-only | `src/explainer/strokes.tsx` |  |
| `NEW-big-title-over-dimmed-photo` | AM 1 | missing | — |  |
| `NEW-monitor-wall-grid` | DA 2 | missing | — |  |
| `NEW-two-tone-party-label` | EL 5 | missing | `src/earworm/StationLabel.tsx` |  |
| `R-KaraokeQuote` | DA 1 | covered | `src/recipes/KaraokeQuote.tsx` |  |
| `R-KeywordCut` | DA 2 | covered | `src/recipes/KeywordCut.tsx` |  |
| `SIG-EW-10` | DA 1 | kit-only | `src/audio/Visualizer.tsx` |  |
| `NEW-mixed-weight-type` | DA ≈40 | missing | — |  |
| `NEW-pixel-stripe-texture` | CE ≈20 | missing | — |  |
| `NEW-vhs-artifact-finish` | DA 3 | missing | `src/effects/ChromaticAberration.tsx` |  |
| `E-TB` | EL 1 | kit-only | `src/type/Reveals.tsx`, `src/motion/CameraRig.tsx` |  |
| `NEW-chart-slide-swap` | EL 2 | missing | — |  |
| `NEW-day-night-ground-swap` | CE 1 | missing | — |  |
| `NEW-phone-mockup-screen-swap` | CE 1 | missing | — |  |
| `NEW-photo-flash-burst` | AM 1 | missing | — |  |
| `NEW-print-slide-over` | EL 1 | missing | — |  |
| `NEW-stutter-jumpcut` | CR 1 | missing | — |  |
| `NEW-two-panel-split` | AM 2 | missing | — |  |
| `NEW-ui-window-genie` | CE 4 | missing | — |  |
| `T-PC` | CE 4 | doc-only | `docs/style-guide/07-transitions.md` |  |
| `T-SP` | DA 1 | doc-only | `docs/style-guide/07-transitions.md` |  |
| `V-SRP` | CE 1 | doc-only | `docs/style-guide/07-transitions.md` |  |
| `X-BlurThroughCut` | CE 2 | covered | `src/earworm/fx/BlurThroughCut.tsx` | use `sfx: false` |
| `X-DipToBlack` | AM 2 | covered | `src/earworm/fx/BlackBridge.tsx` |  |
| `X-Drop` | AM 1 | covered | `src/earworm/fx/BlackBridge.tsx` |  |

## 5. Rule conflicts

Our rule against the measured range. No code default was changed. Each recommendation keeps today's values for `voxEarworm` and adds per-look values; the per-format targets are now in `docs/style-guide/13-story-to-screen.md` §4.6.

| # | Our rule (where) | Measured in the sample | Recommendation |
|---|---|---|---|
| 1 | **Keyword cuts on the word onset**: doc 11:17 (rule 1), doc 12:19 (#1); `src/audio/defaults.ts:62`, `src/studio/resolve.ts:6` | cuts avoid word onsets in 5/6 (±2 f: 22–34 % vs chance 33–44 %); 16–25 % of cuts lead a narrator phrase onset by 0–12 f (chance 7–10 %), medians −1…−4 f; HC cuts in the breath before a sentence | keep 0 f for `voxEarworm`; add a `phrase` anchor kind (the phrase's first word, −3 f @24) as the default cut of other looks |
| 2 | **Text starts 7 f early**: doc 11:62; `src/audio/defaults.ts:118` | labels −4…−16 f (EL, CE), median −6 f (AM); CR median +2 f; highlights +1…+3 f (CE, CR, DA) | keep −7 f for labels; add a `highlight` kind at +1 f; fact-check look `text` +2 f |
| 3 | **Name card resolves on the surname +4 f**: doc 11:69, doc 13:395; `src/audio/defaults.ts:77` | the lower third starts on the person's first full-frame cut (+0…+3 f: CR, HC), or 16–24 f before the spoken name (HC host), or +6…+9 f after it (CE, DA); life 120 f (HC) | keep `name` +4 for the decode card; lower third = cut +2 f, 120 f, first full-frame appearance only |
| 4 | **Narration 45 % at 94 wpm; argument ≤ 55 % and ≤ 115 wpm**: doc 13:29–31, 176–177; lint 367–368 | 41–76 % at 86–153 wpm (EL 75.6 % / 152.7; CE 60.8 / 122; AM 50.0 / 101; CR 40.7 / 89; DA 42.9 / 86); articulation 3.31–3.64 words/s everywhere | per format (doc 13 §4.6): data argument ≤ 76 % and ≤ 155 wpm; host-reporter ≤ 61 % and ≈ 120; map ≈ 50 % and ≈ 100; expert- or archive-led 40–47 % and 85–105; keep 3.5 words/s |
| 5 | **No rhetorical questions, no meta-talk, "you" only at the hook and payoff**: doc 13:32–33, 192, 306–307; lint 370–371 | 1–6 narrator questions in 5/5 animated films (thesis questions; CR's verdict triple answered in one word); "let's" and "we're going to…" signposts (CR, CE, EL); host formats speak in the first person | argument and question formats: 1–3 thesis questions and ≤ 2 chapter signposts per 10 min; first person in host-led formats; story mode unchanged |
| 6 | **Sentences ≤ 25 words**: doc 13:179; lint 369 | medians 10–17 words, maxima 34–53 (EL 53, CE 53, DA 39, AM 35, CR 34); short sentences still mark the pivots | argument formats: mean 13–16, max 35; keep "≥ 1 short sentence per section" |
| 7 | **Open with time, then place; name the subject at ≈ 80 %**: doc 13:27–28 | a date-first opening only in AM; the others open on a media or claims hook (EL, CR), a first-person anecdote (CE) or an archival scene (DA); the subject is named at 1–13 % | long form (doc 13 §4.7): sources first, the question and the subject in the first 13 % |
| 8 | **Type on screen 50–70 %, nouns only, every archival word captioned**: doc 13:49–52, 187–188, 296–302; doc 12:24 (#6) | CR ≈ 23 % of non-ad time (≈ 4 events/min), HC 1.8 %, EL ≥ 60 % (charts); sentence-case statement and question cards (CR, CE, EL); archival speech uncaptioned in 4/6 (DA ≈ 175 s of bites, AM ≈ 45 clips, CR clips keep their own captions) | per look: Earworm 50–70 %; fact-check 20–30 %; data paper ≥ 60 %; conversation ≈ 2 %. Allow sentence-case cards ≤ 12 words. Caption archival speech only when it is featured or hard to hear; subtitle foreign languages |
| 9 | **The music changes every ≈ 6 s (8–12 boundaries/min)**: doc 13:57, 189, 377, 466, 513 | one cue per section in 5/5 with music: 0.7–1.6 cues/min, ≈ 30–120 s each | Earworm: unchanged; other formats: one cue per chapter, with a reset hole at each joint |
| 10 | **The bed is ridden by hand**: doc 11:116–119, doc 13:469, doc 14:105; `src/audio/defaults.ts:21`, `:23`; `src/studio/StoryAudio.tsx:20` (`ride` defaults to true) | static beds in 5/5: speech 7.3–19.2 dB over the music, per-phrase duck 0.1–2.4 dB | Earworm: ridden (as now); other looks `ride: false` with the bed ≈ 13 dB under the voice (EL 19, CE 14, DA 13, CR 9, AM 7); pull it only under key archival bites |
| 11 | **4–7 SFX per minute; transitions bring their sounds**: doc 13:190, 353, 514; doc 11:159; `tools/studio/validate_storyboard.py:281` | ≤ 1.4 per minute, all unverified (EL ≈ 0.9, CR ≈ 0.3, CE ≈ 1.4, DA ≈ 1.2, AM ≈ 0.5, HC 0); "whoosh, pop, typing tick, static: 0" (EL) | other looks: 0–1.5 per minute (ident sting, static zaps, joints); transitions silent (`sfx: false`) |
| 12 | **Chapter dip at ≈ 35 %, act-break dip at ≈ 79 %**: doc 13:165–170, 247; doc 11:144–145; doc 07:96 | chapters joined by a reset hole + hard cut (5/5 with music) or an in-picture card (CE questions, CR focus swap, DA grid labels); black only in AM (a drop at 15 %, an act-break fade at 85 %) and DA (5.4 s before the outro) | other looks: chapter = reset hole of 5–29 f + hard cut (+ an optional chapter card); at most one dip or drop per film |
| 13 | **No dissolves in the Vox explainer; never cross-fade designed shots**: doc 07:8, 91; doc 01:77 | dissolves in 5/6 (EL 9–28 f, DA 15–25 f, AM 5–12 f, CR ≈ 3, CE 7 f) | add a `dissolve` transition (7–28 f, on ones) for non-Earworm looks, ≤ 1 per minute |
| 14 | **Graphics at 12 drawings/s in every style**: `src/CONVENTIONS.md:32`, `src/lib/time.tsx:23`, `src/tokens/motion.ts:76`; doc 11:194; doc 01:75, 88 | ones (EL, AM), 12/s (CE, DA), 15/s (CR) | set `drawingRate` per look (the field exists in `src/tokens/theme.tsx`; `DrawingRate` already produces the 2-2-1-2-1 pattern at 15/s): data paper 24, fact-check 15, EITM and Almanac 12, Atlas 24 with 12 f data steps |
| 15 | **The camera stops dead on the keyword; no still holds over 1 s**: doc 12:29 (#11), doc 11:73, doc 01:80, 93 | ease-out reframes (CR, DA, AM shot heads) or S-curves (EL pans, AM fly-outs); holds pixel-still (EL, CR, CE); no stop-dead push in 6/6 | Earworm: unchanged; other looks: ease-out (`settle`) reframes of 11–15 f or S-curve pans, still holds allowed |
| 16 | **Film finish everywhere; archive desaturated with torn borders**: doc 01:81, 92; doc 12:21 (#3); doc 13:457; `src/tokens/finish.ts:99` | no grain, CA or vignette in EL, CR, HC; light grain (CE), static grain (AM), VHS only on archival (DA); native colour in 5/5 with footage | light-paper and conversation looks: no finish, grade `none`, full-frame footage without cut-outs; Atlas: static paper grain |
| 17 | **Series card only at the end, on a bass hit, music to the last frame**: doc 13:67–70, 163, 378, 515 | ident after the thesis at 9.6–16.5 % (5/5); credits split panel at the end (6/6); music to the last frame only in AM; silent credits in CR and HC | an ident slot after the thesis; a credits card at the end; silent credits allowed |
| 18 | **A new composition every ≈ 4 s (15 per minute)**: doc 13:34–37, 185 | EL one scene per 8.4 s (53 % of frames in holds ≥ 2 s); CR, CE, DA, AM median shots 2.0–2.8 s (15.6–17.7 cuts/min); HC 29 s | per format (doc 13 §4.6); "a stage transforms once per idea" holds everywhere |
| 19 | **Pre-lap: new music 3.5 f (4–15 f) before the cut**: doc 11:24–27; `src/audio/defaults.ts:83`, `:126` | the new cue enters at or after the cut: CR +3…+6 f, DA +1 / +5 f, AM ±4 f, CE on the first frame | Earworm: pre-lap; other looks: cue in 0…+6 f after the cut, inside the hole |
| 20 | **Validator: cuts ≥ 6 f apart; `snap` only in music-only passages**: doc 14:112–114; `tools/studio/validate_storyboard.py:239`, `:268` | DA p10 shot 5 f (37 shots < 0.5 s), CR 3–8 f jump cuts, AM 4 × 3 f photo burst; DA's 3 montage bursts cut on 16th notes (≤ 7 s) under the voice | allow ≥ 3 f and a 16th-note grid inside a declared montage burst of ≤ 7 s |
| 21 | **Do/Don't: no flat vector illustrations as the main imagery; no 3D, gradients or glossy UI; type on a carrier**: doc 01:73, 78, 84 | flat vector data is EL's main imagery (charts 38.6 % + number cards 22.1 %); CE isometric 3D (17.6 %) and UI windows; CR area gradients and 3D renders; type sits straight on the paper in EL, CR, CE | scope doc 01's list to its four looks; family A needs its own do/don't |

## 6. Ranked gaps and the top 6 builds

### 6.1 Ranked gap list

**Score = videos using it (n/6) × impact ÷ effort.**
- **Impact.** 3 = defines a format's look, structure or sound (≥ 10 % of the runtime where it is used, or it governs every cut or the whole mix). 2 = a recurring identity device (a fixed slot in every film that uses it, or ≥ 3 uses per film). 1 = occasional or small.
- **Effort.** S = 1 (one component or recipe change, or a profile table). M = 2 (a new recipe with kit pieces, or changes across the storyboard engine). L = 3 (a new subsystem or asset pipeline: geometry, 3D, multiple synced feeds).
- Scored: every device that is not plainly covered (covered ≠ included). Ties: more videos first, then the larger total count.

| Rank | Gap (device) | Status | n/6 | Impact | Effort | **Score** | Evidence (video time, still) |
|---|---|---|---|---|---|---|---|
| 1 | `NEW-lower-third` | covered ≠ | 6 | 2 | S | **12** | healthcare 0:20.01 (analysis/stills/vox_healthcare/0m20s_namecard-build-cropstrip_f480-507.png); creatine 0:34.01 (analysis/stills/vox_creatine/0m37s_name_card_tiller.jpg); electoral 7:11.04 (analysis/stills/vox_electoral/7m13s03_warren-lower-third.jpg); cleanenergy 1:27.02 (analysis/stills/vox_cleanenergy/1m29s_alex_namecard_call.jpg); amazon 3:49.10 (analysis/stills/vox_amazon/3m51s_namecard-subtitle-field.jpg); drinkingage 4:07.22 (analysis/stills/vox_drinkingage/4m10s_f5999_lower-third-lightner.jpg) |
| 2 | `NEW-credits-split-panel` | missing | 6 | 2 | S | **12** | healthcare 20:28.14 (analysis/stills/vox_healthcare/20m32s_endcard-credits-p1.jpg); creatine 9:20.06 (analysis/stills/vox_creatine/9m27s_end_card_credits.jpg); cleanenergy 8:57.07 (analysis/stills/vox_cleanenergy/9m01s_credits_panel_jq.jpg); drinkingage 9:09.20 (analysis/stills/vox_drinkingage/9m13s_f13277_outro-credits.jpg); electoral 7:55.04 (analysis/stills/vox_electoral/8m05s04_host-sponsor-credits.jpg); amazon 11:17.05 |
| 3 | `SIG-VX-5` | kit-only | 5 | 2 | S | **10** | creatine 1:26.08 (analysis/stills/vox_creatine/1m27s_newspaper_isolate_highlight.jpg), 5:49.00 (analysis/stills/vox_creatine/5m52s_web_article_highlight.jpg); drinkingage 2:07.05 (analysis/stills/vox_drinkingage/2m09s_f3097_document-highlighter.jpg); electoral 6:22.17 (analysis/stills/vox_electoral/6m27s20_quote-card-highlight.jpg); cleanenergy 1:39.10 |
| 4 | `NEW-music-reset-hole` | covered ≠ | 5 | 2 | S | **10** | creatine 0:59.06, 3:03.03, 5:44.18, 8:43.11; electoral 1:10.20 (analysis/av/vox_electoral_064.00-072.00.png), 4:29.13 (analysis/av/vox_electoral_264.00-272.00.png); amazon 4:40.04, 7:03.22 |
| 5 | `NEW-phrase-lead-cut` | covered ≠ | 5 | 2 | S | **10** | analysis/audio/vox_creatine_sync.json (25.2 % vs 7.5 %); analysis/audio/vox_cleanenergy_sync.json (24.8 % vs 9.8 %); analysis/audio/vox_drinkingage_sync.json (20.7 % vs 8.8 %) |
| 6 | `NEW-section-cue-music` | covered ≠ | 5 | 2 | S | **10** | cue tables in analysis/vox-sample/vox_electoral.md, analysis/vox-sample/vox_creatine.md, analysis/vox-sample/vox_cleanenergy.md, analysis/vox-sample/vox_drinkingage.md, analysis/vox-sample/vox_amazon.md (§7.1 each) |
| 7 | `NEW-series-title-card` | covered ≠ | 5 | 2 | S | **10** | electoral 1:08.09 (analysis/stills/vox_electoral/1m09s14_title-card-on-grid.jpg); creatine 0:55.09 (analysis/stills/vox_creatine/0m59s_vox_ident_presented_by.jpg); cleanenergy 1:02.19 (analysis/stills/vox_cleanenergy/1m06s_series_title_card.jpg); drinkingage 1:34.07 (analysis/stills/vox_drinkingage/1m34s_f2267_almanac-series-collage.jpg); amazon 1:35.05 (analysis/stills/vox_amazon/1m42s_atlas-title-card.jpg) |
| 8 | `NEW-static-low-bed` | covered ≠ | 5 | 2 | S | **10** | analysis/audio/vox_electoral_sync.json (19.2 dB, duck 2.3 dB); analysis/audio/vox_creatine_sync.json (9.3 dB, 0.6 dB); analysis/audio/vox_cleanenergy_sync.json (14.2 dB, 0.1 dB) |
| 9 | `NEW-uncaptioned-archival-speech` | covered ≠ | 4 | 2 | S | **8** | drinkingage 2:36, 4:31, 6:08 (analysis/stills/vox_drinkingage/4m05s_f5888_madd-rid-labels.jpg); amazon 0:00–1:28; creatine 0:12.08 (analysis/stills/vox_creatine/0m03s_triptych_social_clips.jpg) |
| 10 | `R-DocumentHighlight` | covered ≠ | 4 | 2 | S | **8** | cleanenergy 5:28.19 (analysis/stills/vox_cleanenergy/5m11s_joule_chart_rings.jpg); creatine 3:28.16; drinkingage 4:17 (analysis/stills/vox_drinkingage/4m19s_f6234_newspaper-clipping-highlight.jpg); amazon 10:17.17 |
| 11 | `NEW-source-line` | missing | 4 | 2 | S | **8** | amazon 3:07 (analysis/stills/vox_amazon/3m07s_bar-chart-ring-source.jpg); creatine 0:32 (analysis/stills/vox_creatine/0m32s_area_chart_sponsor_bug.jpg); electoral 6:27.20 (analysis/stills/vox_electoral/6m27s20_quote-card-highlight.jpg); cleanenergy 2:22 (analysis/stills/vox_cleanenergy/2m22s_iea_bar_sweden.jpg) |
| 12 | `NEW-fullframe-archival-broll` | missing | 5 | 3 | M | **7.5** | creatine 0:46.15, 3:57.23; drinkingage 1:29.12, 5:31.20; amazon 0:13, 4:47 (analysis/stills/vox_amazon/1m18s_year-tag-corner-archival.jpg); cleanenergy 0:44.02 |
| 13 | `NEW-corner-bug` | missing | 6 | 1 | S | **6** | all six; creatine sponsor bug in the alternation (analysis/stills/vox_creatine/0m32s_area_chart_sponsor_bug.jpg); healthcare whole film (analysis/stills/vox_healthcare/0m30s_two-up-split.jpg) |
| 14 | `SIG-VX-2` | covered ≠ | 6 | 2 | M | **6** | creatine 4:23.19 (analysis/stills/vox_creatine/4m33s_verdict_checklist.jpg); cleanenergy 1:02.19 (analysis/stills/vox_cleanenergy/1m06s_series_title_card.jpg); healthcare 0:20.21 (analysis/stills/vox_healthcare/0m20s_namecard-yellow-sweep.jpg) |
| 15 | `NEW-fullframe-interview` | covered ≠ | 4 | 3 | M | **6** | creatine 0:33.23 (analysis/stills/vox_creatine/0m37s_name_card_tiller.jpg); cleanenergy 1:26.14 (analysis/stills/vox_cleanenergy/1m29s_alex_namecard_call.jpg); healthcare 0:55.01 (analysis/stills/vox_healthcare/0m58s_dylan-single-namecard.jpg); amazon 3:49.10 |
| 16 | `R-DataChart` | covered ≠ | 4 | 3 | M | **6** | electoral 2:27.10 (analysis/stills/vox_electoral/3m27s19_state-bars-campaign-events.jpg); creatine 0:24.07 (analysis/stills/vox_creatine/0m32s_area_chart_sponsor_bug.jpg), 6:08.11 (analysis/stills/vox_creatine/6m13s_line_chart_growth.jpg); cleanenergy 2:05.03 (analysis/stills/vox_cleanenergy/2m22s_iea_bar_sweden.jpg); amazon 3:02.05 (analysis/stills/vox_amazon/3m07s_bar-chart-ring-source.jpg) |
| 17 | `NEW-line-chart-draw` | kit-only | 3 | 2 | S | **6** | creatine 6:08.11 (analysis/stills/vox_creatine/6m13s_line_chart_growth.jpg); amazon 3:16.04 |
| 18 | `NEW-read-along-highlight` | missing | 3 | 2 | S | **6** | cleanenergy 5:28.19, 6:45.08; electoral 7:29.09; drinkingage 4:17 |
| 19 | `T-DS` | proof-only | 5 | 1 | S | **5** | electoral 1:11.20 (28 f, colour → B&W); amazon 7:39.20 (analysis/strips/vox_amazon_11015-11062.png); drinkingage 0:51.17 |
| 20 | `K-SketchArrow` | kit-only | 5 | 1 | S | **5** | electoral 1:52.00 (analysis/stills/vox_electoral/1m52s15_texas-vermont-hand-arrows.jpg); creatine 1:02.02 (analysis/stills/vox_creatine/strip_01484-01531_arrow_label_drawon.png) |
| 21 | `NEW-host-on-camera` | missing | 5 | 2 | M | **5** | cleanenergy 1:07.15, 7:33.10; drinkingage 0:33.18; healthcare 0:00.00 (analysis/stills/vox_healthcare/0m22s_jessica-single-namecard.jpg) |
| 22 | `K-HandDrawnRing` | covered ≠ | 5 | 1 | S | **5** | electoral 2:40.06 (analysis/stills/vox_electoral/4m08s04_influence-squares-rings.jpg); cleanenergy 5:09.10 (analysis/strips/vox_cleanenergy_07412-07459.png) |
| 23 | `NEW-choropleth-map` | missing | 3 | 3 | M | **4.5** | electoral 2:31.11 (analysis/stills/vox_electoral/strip_03626-03673_bars-to-map.png); drinkingage 0:48.10 (analysis/stills/vox_drinkingage/0m54s_f1299_map-selective-colour-legend.jpg); amazon 3:27 (analysis/stills/vox_amazon/3m31s_map-choropleth-legend.jpg) |
| 24 | `NEW-light-paper-ground` | kit-only | 3 | 3 | M | **4.5** | electoral 4:17 (analysis/stills/vox_electoral/4m17s01_spending-map-arrow.jpg); creatine 1:09.03 (analysis/stills/vox_creatine/1m13s_greek_word_card.jpg); cleanenergy 4:05.14 (analysis/stills/vox_cleanenergy/4m13s_bloom_equation_card.jpg) |
| 25 | `NEW-archival-date-tag` | missing | 2 | 2 | S | **4** | drinkingage 0:13.20 (analysis/stills/vox_drinkingage/0m15s_f379_date-tag-1984.jpg); amazon 1:16.14 (analysis/stills/vox_amazon/1m18s_year-tag-corner-archival.jpg) |
| 26 | `NEW-question-led-chapters` | missing | 2 | 2 | S | **4** | cleanenergy 1:12.21 (analysis/stills/vox_cleanenergy/1m16s_handwritten_question_card.jpg); healthcare 0:33.00 … 16:51.06 |
| 27 | `NEW-corner-source-tag` | missing | 3 | 1 | S | **3** | creatine 0:14.08 (analysis/stills/vox_creatine/0m20s_podcast_source_label_name_super.jpg); amazon 4:47 |
| 28 | `NEW-ease-out-reframe` | kit-only | 3 | 2 | M | **3** | creatine 2:19.24, 4:18.12; drinkingage 1:40.00, 4:06.06 (analysis/stills/vox_drinkingage/4m10s_f5999_lower-third-lightner.jpg); amazon 2:08.00 (×0.27 in 22 f) |
| 29 | `T-IC` | covered ≠ | 3 | 1 | S | **3** | electoral 1:24.00, 2:07.23 (analysis/stills/vox_electoral/xsheet_shot16_1m12-2m27.jpg); creatine 4:23.19, 6:49.01 |
| 30 | `NEW-tv-static-flip` | covered ≠ | 3 | 1 | S | **3** | drinkingage 0:13.18 (analysis/stills/vox_drinkingage/strip_00330-00377_date-tag-build.png); electoral 0:00.00 (analysis/stills/vox_electoral/strip_00000-00047_coldopen-static.png); amazon 1:16.08 (analysis/strips/vox_amazon_01822-01869.png) |
| 31 | `PD-5` | covered ≠ | 3 | 2 | M | **3** | amazon 1:56 (analysis/stills/vox_amazon/1m56s_map-label-photo-window.jpg) |
| 32 | `NEW-flat-vector-diagram` | kit-only | 3 | 2 | M | **3** | creatine 2:17.18 (analysis/stills/vox_creatine/2m46s_battery_diagram.jpg); electoral 0:21.08 (analysis/stills/vox_electoral/0m25s07_ballot-bar-popular-vote.jpg) |
| 33 | `NEW-archival-news-supercut` | missing | 3 | 2 | M | **3** | amazon 0:00–1:28; electoral 0:00–0:19 (analysis/stills/vox_electoral/0m00s08_tv-frame-newsclip.jpg); creatine 0:18.16 |
| 34 | `NEW-sponsor-segment` | missing | 3 | 1 | S | **3** | creatine 4:46.08; cleanenergy 2:24.09 (analysis/stills/vox_cleanenergy/2m55s_sponsor_url_pill.jpg); electoral 7:55.04 (analysis/stills/vox_electoral/8m05s04_host-sponsor-credits.jpg) |
| 35 | `R-EndCard` | covered ≠ | 3 | 1 | S | **3** | healthcare 20:28.18 (analysis/stills/vox_healthcare/20m29s_endcard-logo-glitch-build.jpg) |

**Score < 3, not ranked individually:** `T-PCap` 2; `NEW-chart-morph-chain` 2; `V-RET` 2; `PD-2` 2; `T-WH` 2; `NEW-name-label-arrow` 2; `NEW-beat-locked-montage-burst` 2; `NEW-headline-card` 2; `E-CB` 2; `K-RackFocus` 2; `NEW-scatter-letter-type-on` 2; `T-CS` 2; `T-FB` 2; `T-WL` 2; `NEW-mixed-weight-type` 2; `NEW-state-badge-tile` 2; `NEW-verdict-checklist` 2; `V-MOV` 1.5; `NEW-speech-prelap` 1.5; `NEW-unit-grid-cartogram` 1.5; `SIG-PD-8` 1; `NEW-voice-only-claim` 1; `NEW-burned-subtitles` 1; `NEW-two-up-single-alternation` 1; `NEW-pixel-stripe-texture` 1; `NEW-satellite-basemap` 1; `NEW-two-up-call-windows` 1; `NEW-vertical-social-panels` 1; `NEW-isometric-hero-object` 1; `K-Pillarbox` 1; `NEW-host-at-work-b-roll` 1; `NEW-map-texture-stacked-bar` 1; `NEW-portrait-roundel-tags` 1; `NEW-selective-colour-isolation` 1; `NEW-engraving-section-icon` 1; `NEW-two-tone-party-label` 1; `K-DotField` 1; `K-LabelStrip` 1; `K-LeaderLine` 1; `NEW-document-isolate-blur` 1; `NEW-era-band-under-axis` 1; `NEW-map-fly-out-fly-in` 1; `NEW-relatable-unit-equation` 1; `T-PC` 1; `NEW-addressee-cut` 1; `NEW-filmed-monitor-punch-in` 1; `NEW-vhs-artifact-finish` 1; `NEW-3d-medical-render` 1; `NEW-chart-slide-swap` 1; `NEW-document-text-overprint` 1; `NEW-flicker-fade-out` 1; `NEW-focus-scale-swap` 1; `NEW-monitor-wall-grid` 1; `NEW-tile-to-unit-dots` 1; `NEW-two-panel-split` 1; `R-QuoteCard` 1; `E-TB` 1; `K-ColorFlash` 1; `NEW-big-title-over-dimmed-photo` 1; `NEW-build-time-dial` 1; `NEW-day-night-ground-swap` 1; `NEW-efficiency-badges` 1; `NEW-host-recap-check` 1; `NEW-key-line-caption-box` 1; `NEW-location-tag` 1; `NEW-phone-mockup-screen-swap` 1; `NEW-photo-flash-burst` 1; `NEW-podcast-host-promo` 1; `NEW-print-slide-over` 1; `NEW-scale-card-map-texture` 1; `NEW-sponsor-cliffhanger` 1; `NEW-stutter-jumpcut` 1; `NEW-typed-question-doc` 1; `NEW-word-morph-etymology` 1; `R-MapRoute` 1; `SIG-EW-10` 1; `V-SRP` 1; `NEW-hands-on-wall-map` 0.7; `NEW-map-region-mask` 0.5; `NEW-protected-areas-mosaic` 0.5; `NEW-ui-window-genie` 0.5; `NEW-dot-hemicycle` 0.5; `NEW-map-tile-accretion` 0.5; `NEW-bar-tilt-org-chart` 0.5; `NEW-bubble-map` 0.5; `NEW-desktop-ui-callback` 0.5; `NEW-fire-dot-overlay` 0.5; `NEW-map-band-label` 0.5; `NEW-map-photo-window` 0.5; `NEW-paper-timeline-scroll` 0.5; `NEW-flow-ribbon-world` 0.5; `NEW-hatched-region-label-box` 0.5; `NEW-host-outro-comments` 0.5; `NEW-satellite-timelapse` 0.5; `T-SP` 0.5.

### 6.2 Top 6 recommended builds

Each build takes its lead gap's score and folds in the adjacent gaps that the same code closes. Timings are frames at 24 fps (our storyboards run at 25: scale by fps/24). Sizes are % of the 1920 × 1080 frame. Constraints for all six: Remotion, tokens first (new colours and type roles go into `src/tokens/` through the lead), deterministic (`src/lib/random.ts`), our own series name and bug only (never Vox's or a sponsor's marks), and the licensing rules in `CLAUDE.md`.

| Build | Kind | Score | Lead gap (+ folded in) |
|---|---|---|---|
| 1 `LowerThird` | kit component + recipe option | **12** | `NEW-lower-third` 6/6 (+ `NEW-scatter-letter-type-on`, `NEW-flicker-fade-out`) |
| 2 Credits end card | recipe mode + kit component | **12** | `NEW-credits-split-panel` 6/6 (+ `R-EndCard` mark, `T-CS` page swap) |
| 3 `DocumentHighlight` v2 + `SourceLine` | recipe upgrade + kit component | **10** | `SIG-VX-5` 5/6 (+ `R-DocumentHighlight`, `NEW-source-line`, `NEW-read-along-highlight`, ring colours, `NEW-document-isolate-blur`) |
| 4 Sync and audio look profiles | storyboard DSL + audio/sync feature | **10** | `NEW-music-reset-hole`, `NEW-phrase-lead-cut`, `NEW-static-low-bed`, `NEW-section-cue-music` (5/6 each) |
| 5 `SeriesIdent` | recipe | **10** | `NEW-series-title-card` 5/6 |
| 6 `FootageClip` | recipe | **8** (as a bundle: 6/6 × 3 ÷ M = 9) | `NEW-uncaptioned-archival-speech` 4/6 (+ `NEW-fullframe-archival-broll`, `NEW-fullframe-interview`, `NEW-host-on-camera`, `NEW-corner-source-tag`, `NEW-archival-date-tag`, `K-Pillarbox`, `NEW-burned-subtitles`) |

#### Build 1: `LowerThird` (score 12)

- **What.** A kit component, new file `LowerThird.tsx` in `src/type/`. Storyboard reach: `NameCardInterview` gains `card: "decode" | "lowerThird"` and `layout: "window" | "fullframe"`; build 6 takes a `lowerThird` prop. Token proposals: colour `lemon #FDF203`, type roles `lowerName` and `lowerRole`, and Source Serif 4 weight 700 (only 400 and 600 are loaded in `src/tokens/fonts.ts`).
- **Props.**
  ```ts
  type LowerThirdProps = {
    name: string;
    role?: string;                                  // sentence case: "Senior correspondent, Vox"
    variant?: "house" | "stripe" | "tab" | "card";  // house first; the others are series looks
    delay?: number;                                 // frames from the sequence start; default 2 (cut +2 f)
    life?: number;                                  // default 120 f (5.0 s)
    x?: number; baselineY?: number;                 // design px; default 236 / 835
    bar?: "worm" | "wipe";                          // HC: underline travels on threes; CR: bar wipes up on ones
    exit?: "flicker" | "retract" | "none";
    seed?: string;
  };
  ```
- **Visual spec (house variant).**

  | Element | Spec | Measured in |
  |---|---|---|
  | name | Source Serif 4 Bold, cap 56–64 px = 5.2–5.9 % H, Title case, `#FFFFFF`, no plate, no shadow; left x 236 (12.3 % W), baseline y 835 (77.3 % H) | HC 0:20, CR 0:34 |
  | role | Inter SemiBold (`SMALL_SANS`), cap 28–30 px = 2.6–2.8 % H, sentence case, white; baseline y 897 (83 % H) | HC, CR |
  | bar | lemon `#FDF203`, 11–14 px thick (1.0–1.3 % H), rounded ends, at y 847–857 (78.4–79.4 % H), as long as the name (106–202 px) | HC, CR, EL |
  | `stripe` | distressed bold condensed name 8.0 % H (≈ Barlow Semi Condensed 700; nearest loaded: Oswald 600), stripe bar `#E3E12C` / `#E8F025`, tracking-in 6 f | CE |
  | `tab` | green `#5f9a5f` tab, caps name 3.4 % H with tracking +35 %, typed on twos, cream bar `#f3efdb` | AM |
  | `card` | `#FDF0AC` card, black name 4.2 % H, red role `#9F3531` 2.8 % H, 8 f wipe | DA |

- **Timing (house).**
  1. f0–12: the name's letters fade in, in a seeded scattered order, 4–6 f each, stepped on twos.
  2. f4–37: the bar. `worm`: a 14 px dot at the name's left edge; the head runs right on threes (8 positions/s), the tail follows, and it ends as an 11 px dot at the right edge (HC). `wipe`: the bar wipes up on ones in 12 f (CR).
  3. f13–21: the role drops in from a mask under the name (ones).
  4. Hold to f115.
  5. Exit. `flicker`: the two lines alternate opacity frame by frame for 5 f, gone on the frame before the next cut (HC). `retract`: the bar retracts first, the name is gone in 14–24 f (CR).
- **Sync.** Start on the cut +2 f of the person's first full-frame shot; never on later appearances. A host introducing themselves: start 16 f before "I'm" (≈ 24 f before the name). The `name` kind (+4 f on the surname) stays for the Earworm decode card.
- **Acceptance stills.** `analysis/stills/vox_healthcare/0m20s_namecard-build-cropstrip_f480-507.png` (build, frame by frame), `analysis/stills/vox_healthcare/0m22s_jessica-single-namecard.jpg` (settled), `analysis/stills/vox_healthcare/0m24s_namecard-flicker-exit-cropstrip_f592-603.png` (exit), `analysis/stills/vox_creatine/0m37s_name_card_tiller.jpg` and `analysis/stills/vox_creatine/strip_00812-00847_name_card_build.png` (wipe), `analysis/stills/vox_electoral/7m13s03_warren-lower-third.jpg`. Pass: positions within ±1 % of W/H, cap height ±0.3 % H, bar thickness ±2 px, each phase within ±1 drawing.
- **Reuse.** `src/earworm/DecodeNameCard.tsx` (structure and exit), `src/recipes/NameCardInterview.tsx`, `src/type/shared.ts`, `src/lib/random.ts`, `src/lib/time.tsx` (`DrawingRate` 12 for the letters, 8 for the worm), `src/tokens/fonts.ts`.
- **Depends on.** Nothing. Full-frame interviews with their own sound need build 6.

#### Build 2: credits end card (score 12)

- **What.** `EndCard` (`src/recipes/EndCard.tsx`) gains `mode: "series" | "credits"`; a new kit component `CreditsPanel.tsx` in `src/earworm/`, next to `SeriesCard.tsx`.
- **Props.**
  ```ts
  type EndCardProps = {
    mode?: "series" | "credits";
    title?: string; tagline?: string;                    // OUR series mark, never a real logo
    pages?: { role: string; names: string[] }[][];       // credits mode: 1–3 pages
    right?: "mark" | { video: string; startFromSec?: number };  // our mark, or a host / promo clip
    pageSec?: number;                                    // default 5.5
    silent?: boolean;                                    // default true in credits mode
  };
  ```
- **Visual spec.**

  | Element | Spec | Measured in |
  |---|---|---|
  | panel | `#292929`, x 0–690 (36 % W), full height; the other side `#000` (mark) or the clip (fade-up 7 f) | HC, CE |
  | rule | vertical, white, 3 px, at x ≈ 686; grows from a 17 px centre dot to 1,007 px (93 % H) with lemon `#F9FF0E` dot ends, 24 f, ease-in-out | HC 20:28.14 |
  | roles | Source Serif 4 Regular, ≈ 23 px line (2.1 % H), Title case, `#D5D5D5`, right-aligned at x 646 | HC |
  | names | bold grotesque caps (Libre Franklin 700, `VOX_SANS`), ≈ 23 px (2.1 % H), `#AFD2D8`, under each role | HC (CE `#AED5DE`, CR `#B0D3DB`) |
  | mark | our series title (`SeriesCard`), ≈ 30 % H block centred on the black side (HC: x 972–1643), slice-glitch build ≈ 21 f with a lemon edge glint | HC |
  | pages | fade-out 7 f → 1 empty frame → fade-in 6 f; the rule stays | HC 20:34.07 |

- **Sync.** Cut to the card 11 f after the last spoken word (HC). The rule starts on the cut, the mark builds over f4–25, page 2 comes at `pageSec`. Silent (CR, HC), or the outro bed with a 27 f fade (DA).
- **Acceptance stills.** `analysis/stills/vox_healthcare/20m29s_endcard-logo-glitch-build.jpg`, `analysis/stills/vox_healthcare/20m32s_endcard-credits-p1.jpg`, `analysis/stills/vox_healthcare/20m34s_credits-page-swap-cropstrip_f29618-29637.png`, `analysis/stills/vox_healthcare/20m38s_endcard-credits-p2.jpg`, `analysis/strips/vox_healthcare_29484-29519.png` (build, every frame), `analysis/stills/vox_creatine/9m27s_end_card_credits.jpg`, `analysis/stills/vox_cleanenergy/9m01s_credits_panel_jq.jpg` (video variant). Pass: panel edge ±10 px, rule length ±2 %, type ±0.2 % H, timings ±1 f, with our mark in place of Vox's.
- **Reuse.** `src/recipes/EndCard.tsx`, `src/earworm/SeriesCard.tsx`, `src/earworm/fx/GlitchCut.tsx` (slice build), `src/explainer/DrawPath.tsx` (rule), `src/tokens/fonts.ts`.
- **Depends on.** Nothing. The video panel uses build 6's clip player.

#### Build 3: `DocumentHighlight` v2 + `SourceLine` (score 10)

- **What.** A recipe upgrade (`src/recipes/DocumentHighlight.tsx`). `RecipeFrame` draws the theme's ground instead of always the black collage (`src/recipes/shared.tsx`). A new kit component `SourceLine.tsx` in `src/type/`, reused by a future chart recipe and by build 6.
- **Props.**
  ```ts
  type DocumentHighlightProps = {
    src?: string;
    ground?: "collage" | "theme" | "fullbleed";   // fullbleed = screen capture, no torn border
    frame?: "none" | "browser";                    // a thin browser bar for web pages (CE)
    box?: { x: number; y: number; w: number; h: number };
    highlights?: { x: number; y: number; w: number; h?: number; at?: number; frames?: number }[];
    readAlong?: { lines: { x: number; y: number; w: number }[]; at?: number; perLineF?: number };
    rings?: { cx: number; cy: number; rx: number; ry: number; at?: number }[];  // colour from the theme
    isolate?: { x: number; y: number; w: number; h: number; at?: number };     // CR strip lift
    push?: { to: number; cx?: number; cy?: number; at?: number; frames?: number };
    source?: string;                               // "Source: PubMed, 2026"
  };
  ```
- **Visual spec.**

  | Element | Spec | Measured in |
  |---|---|---|
  | highlight | flat band in the look's yellow (CR `#E4EC0B`, CE `#FBFF0B`, EL `#FBF303`, DA `#E4DA0F`, AM `#f2ec0e`; `voxExplainer` `#FFF80F`), multiplied under the text; 5.5 % H at the page's on-screen scale (≈ 1.3 × the line's cap height); left → right in 10 f (7–17 f), ease-out (`enter`) | CR, CE, EL |
  | read-along | one line per 12 f, each starting on the line's first word ±3 f | CE 5:28.19 |
  | push | a reframe burst of 11–15 f, ×1.10–1.27, ease-out (`settle`), then a still hold (CR); or stepped pushes of +0.12…+0.59 %/f for 8–28 f (CE) | CR, CE |
  | isolate | the page blurs (≈ 6–8 px, not measured) while the sentence strip lifts sharp with a soft shadow, over 13 f | CR 1:25.18 |
  | ring | the look's colour (EL lemon / orange, DA pencil red `#90352C`, AM red `#c8303f`); smooth stroke, 6–16 f | EL, DA, AM |
  | source line | Inter 500 (`SMALL_SANS`), 21 px = 1.9 % H, sentence case, the look's text colour (`#262626` on light, `#f3efdb` on dark); bottom-left at x 60, baseline y 1020 (EL), or under a chart title (CR, AM) | EL, CR, AM |

- **Sync.** A highlight starts at the keyword's onset +1 f (sample ≈ +1…+3 f, range −6…+5 f). A ring lands on the stressed word. The push lands on the line being read. The source line is on from the cut.
- **Acceptance stills.** `analysis/stills/vox_creatine/1m27s_newspaper_isolate_highlight.jpg`, `analysis/stills/vox_creatine/5m52s_web_article_highlight.jpg`, `analysis/stills/vox_creatine/strip_02026-02073_newspaper_isolate_highlight.png`, `analysis/stills/vox_drinkingage/2m09s_f3097_document-highlighter.jpg`, `analysis/stills/vox_drinkingage/4m19s_f6234_newspaper-clipping-highlight.jpg`, `analysis/stills/vox_electoral/6m27s20_quote-card-highlight.jpg`, `analysis/stills/vox_amazon/3m07s_bar-chart-ring-source.jpg` (source line). Pass: band height ±0.5 % H, sweep length ±2 f, start within ±2 f of the target word.
- **Reuse.** `src/recipes/DocumentHighlight.tsx`, `src/type/Highlighter.tsx`, `src/explainer/rings.tsx`, `src/motion/CameraRig.tsx`, `src/motion/blur.tsx`, `src/effects/Paper.tsx`, `src/tokens/easing.ts`.
- **Depends on.** Exact colours need a light look (gap `NEW-light-paper-ground`, score 4.5). Until then `look: "voxExplainer"` gives the yellow highlighter on dotted paper.

#### Build 4: sync and audio look profiles (score 10)

- **What.** A new module `profiles.ts` in `src/audio/` with `SYNC_PROFILES` and `MIX_PROFILES` keyed by profile; the `voxEarworm` profile is today's `SYNC` and `AUDIO_DEFAULTS`, unchanged. In the storyboard:
  - an optional `profile` field (default: the look);
  - `src/studio/resolve.ts` reads the kind defaults from the profile, with three new kinds: `phrase`, `highlight` and `lowerThird`;
  - `src/studio/StoryAudio.tsx` takes the bed's default `ride` and `gainDb` from the profile;
  - a scene's `transitionIn: {kind: "cut", hole: 12}` ends the running bed `hole` frames before the cut and starts the next cue `cueAfterCutF` frames after it;
  - the validator applies the SFX budget, cut spacing and music-boundary lint per profile.
- **Values.**

  | Setting | `voxEarworm` (unchanged) | default for the other looks (sample) | range in the sample |
  |---|---|---|---|
  | default cut kind | `cut`: word onset, 0 f | `phrase`: 3 f before the phrase's first word | 0…12 f before; medians 1–4 f |
  | label text | −7 f | −7 f | −4…−16 f; CR +2 f |
  | highlight | — | +1 f, 10 f sweep | −6…+5 f; 7–22 f |
  | lower third | `name`: +4 f on the surname | cut +2 f, life 120 f | 0…+3 f after the cut |
  | bed | ridden: gap −7.6 dB, duck −2.4 dB | static: `ride: false`, −13 dB re the voice | −7.3…−19.2 dB |
  | music changes | 8–12 boundaries/min | one cue per chapter | 0.7–1.6 cues/min |
  | chapter joint | `dip` (picture + sound) | 12 f hole + hard cut | 5–29 f |
  | new cue vs the cut | 3.5 f before (pre-lap 10 f) | 0…+6 f after | −1…+6 f |
  | SFX budget | ≈ 1 per 13 s | ≤ 1.5 per minute; transitions silent | 0–1.4 per minute |
  | minimum cut spacing | 6 f | 6 f; 3 f inside a declared burst | 3–5 f in bursts |

- **Acceptance.** Render a 60–90 s test storyboard in a non-Earworm look and run `tools/audio/av_sync.py` on it:
  - cuts within ±2 f of word onsets at or below chance (≈ 30–35 %);
  - ≥ 20 % of cuts 0–12 f before narrator phrase onsets (sample 16–25 % against chance 7–10 %);
  - speech 9–19 dB over the bed, per-phrase duck < 1 dB;
  - 5–29 f digital-silence holes at the chapter cuts.

  Compare with `analysis/audio/vox_creatine_sync.json`, `analysis/audio/vox_cleanenergy_sync.json`, `analysis/audio/vox_drinkingage_sync.json` and `analysis/av/vox_electoral_064.00-072.00.png` (a hole, then the cue hard in on the cut). An existing Earworm project must render bit-identical.
- **Reuse.** `src/audio/defaults.ts` (becomes the Earworm profile), `src/studio/resolve.ts`, `src/studio/StoryAudio.tsx`, `src/studio/types.ts`, `src/studio/storyboard.schema.json`, `tools/studio/validate_storyboard.py`, `tools/voice/script_markup.py` (`[BEAT kind=phrase]`), `tools/audio/av_sync.py`.
- **Depends on.** Nothing; builds 1, 3, 5 and 6 use its kinds and the hole.

#### Build 5: `SeriesIdent` (score 10)

- **What.** A new recipe, `SeriesIdent.tsx` in `src/recipes/` (registered in `src/recipes/index.ts` and `src/studio/storyboard.schema.json`). The long-form template places it after the thesis (`docs/style-guide/13-story-to-screen.md` §4.7).
- **Props.**
  ```ts
  type SeriesIdentProps = {
    title: string; tagline?: string;     // OUR series name; never a real logo or a sponsor's
    style?: "overPicture" | "card";      // CR/EL: over the last picture; CE/DA: a flat card
    src?: string;                        // picture or footage behind (overPicture)
    cardColor?: string;                  // card: the look's accent (CE #FBFF0B, DA #159EC8)
    holdSec?: number;                    // default 4.2 (sample 3.5–10.5 s)
    holeF?: number;                      // silence before the hard cut out; default 12 (sample 6–24)
  };
  ```
- **Visual spec.**
  - `overPicture` (CR): the previous picture keeps running (or `src`). The title pops in within 1 f at about f12: white, Archivo 800 (`EXTENDED`), cap ≈ 8.7 % H. The tagline types at 1 letter per frame from about f24.
  - `card` (CE): a flat accent card for 12 f, then the title rises from a baseline mask (12 f) while the camera pushes ×1.05. The title is black on the card, sentence case, cap 8.7 % H.
  - EL variant: built over the data stage with a ×0.86 pull-back across 160 f and a 22 f type-on.
  - Exit: a hard cut.
- **Sound.** A sting or swell under the card (music alone), then `holeF` frames of silence (EL 24 f, CR 13 f, CE 6 f) and a hard cut. The first chapter's cue enters 0–6 f after the cut. Atlas variant: `transitionOut: drop`.
- **Sync.** Start 0–12 f after the last word of the thesis or question (CE: the push starts 1 f after it; DA: the sting hits 2 f after "roads."). Never under narration.
- **Acceptance stills.** `analysis/stills/vox_cleanenergy/1m06s_series_title_card.jpg` with `analysis/strips/vox_cleanenergy_01506-01553.png`; `analysis/stills/vox_creatine/0m59s_vox_ident_presented_by.jpg` with `analysis/stills/vox_creatine/strip_01370-01417_vox_ident.png`; `analysis/stills/vox_electoral/1m09s14_title-card-on-grid.jpg` with `analysis/stills/vox_electoral/strip_01636-01683_title-card-build.png`; `analysis/stills/vox_drinkingage/1m34s_f2267_almanac-series-collage.jpg`; `analysis/stills/vox_amazon/1m42s_atlas-title-card.jpg`. Compare placement (9.6–16.5 % of the runtime), length, layout and the hole, never the marks.
- **Reuse.** `src/earworm/SeriesCard.tsx`, `src/recipes/EndCard.tsx`, `src/type/TitleRise.tsx`, `src/type/Typewriter.tsx`, `src/earworm/fx/BlackBridge.tsx` (drop), `src/studio/StoryAudio.tsx`.
- **Depends on.** Nothing; the hole uses build 4 (or two music anchors by hand today).

#### Build 6: `FootageClip` (score 8; 9 as a bundle)

- **What.** A new recipe, `FootageClip.tsx` in `src/recipes/` (registered in `src/recipes/index.ts`, the schema and the doc 14 recipe table). Publishing and validation must accept video assets with a `CREDITS.md` line (`tools/studio/publish_project.py`, `tools/studio/validate_storyboard.py`).
- **Props.**
  ```ts
  type FootageClipProps = {
    src: string;                                  // mp4 / webm, project-relative; credited
    startFromSec?: number; endAtSec?: number;
    audio?: boolean; audioDb?: number;            // clip sound on (default for speech), dB re the voice
    audioLeadF?: number;                          // J-cut: the sound starts this many frames before the picture (6–31)
    fit?: "cover" | "contain"; pillarbox?: number; // 4/3 → black bars
    grade?: "native" | "bw";                      // native = no grading (the sample); bw only if the source is B&W
    tag?: string;                                 // corner source tag: "Library of Congress, 1958"
    dateTag?: { text: string; at?: number; style?: "corner" | "spine" };
    lowerThird?: { name: string; role?: string; at?: number };   // build 1
    subtitles?: { text: string; t: number; until: number }[];    // non-English speech
  };
  ```
- **Visual spec.**

  | Element | Spec | Measured in |
  |---|---|---|
  | picture | full-bleed 1920 × 1080 `OffthreadVideo` on ones (native rate); `grade: "native"` applies no filter | CR, DA, AM |
  | pillarbox | 4:3 content at x 195–1719, black bars | DA |
  | corner tag | top-left, x ≈ 40, y ≈ 40; Inter 500 ≈ 1.5 % H (16 px), white over a soft 50 % black shadow; optional platform icon; on from the cut | CR, AM |
  | date tag | `corner`: cream `#f3efdb` year top-left, 8.3 % H, squared condensed caps (AM); `spine`: a VHS-spine box 18 % H with 12 % H digits, the box glitches in over 14 f and the digits slide in over 12 f on twos (DA) | AM, DA |
  | subtitles | white bold grotesque, left x 100, baseline 92 % H, ≤ 2 lines, soft shadow, no box, hard on and off | AM |

- **Sync.** Cut to an on-camera speaker 2–3 f after their voice starts, or pre-lap with `audioLeadF` 6–31 f. B-roll cuts on the phrase onset −3 f (build 4). Date tag on the spoken year (0 f). Lower third at cut +2 f.
- **Audio.** Clip speech at the voice level (−21.5 dBFS ± 1). Under archival speech the music drops ≈ 20 dB in the speech band (doc 11 §5), or goes out for key bites (DA). No phone EQ by default.
- **Acceptance stills.** `analysis/stills/vox_creatine/0m37s_name_card_tiller.jpg` (interview), `analysis/stills/vox_creatine/0m20s_podcast_source_label_name_super.jpg` (corner tag), `analysis/stills/vox_drinkingage/4m05s_f5888_madd-rid-labels.jpg` (pillarbox), `analysis/stills/vox_drinkingage/0m15s_f379_date-tag-1984.jpg` (spine tag), `analysis/stills/vox_amazon/1m18s_year-tag-corner-archival.jpg` (corner year), `analysis/stills/vox_amazon/3m51s_namecard-subtitle-field.jpg` (subtitles), `analysis/stills/vox_healthcare/0m58s_dylan-single-namecard.jpg` (webcam single).
- **Reuse.** `src/earworm/ZoomWindow.tsx` (`OffthreadVideo`, unmuted here), `src/recipes/KaraokeQuote.tsx` (clip sound with `startFrom`), `src/effects/Pillarbox.tsx`, `src/type/VideoCaption.tsx`, `src/tokens/finish.ts` (`PHOTO_GRADE`), `src/studio/StoryAudio.tsx`, `tools/source/source_images.py`.
- **Licensing.** Public-domain and US-government footage first (NARA, LoC, NASA, public-domain Prelinger films). News-agency and broadcaster clips are not public domain: they need the user's own fair-use decision and are never sourced automatically. Every clip gets a `CREDITS.md` line.
- **Depends on.** Build 1 (lower third), build 4 (cut timing and the clip / bed mix), build 3's `SourceLine` style for the tag.

### 6.3 Build order and what comes next

1. **Build 4** (profiles) first: no dependencies, and every later build times its events with it.
2. **Build 1**, then **build 6**: the lower third, then the footage recipe that carries it (interviews, hosts, archival speech).
3. **Builds 3, 5 and 2** in any order. Build 2's video panel reuses build 6.
4. **Next by score:**
   - an own corner bug as a storyboard-level overlay (6);
   - recipes reading the theme's accent and ground (`SIG-VX-2`, 6);
   - a chart recipe with line, area and stacked modes plus title, axis and source line (6);
   - a `dissolve` transition (5);
   - arrows and themed rings in recipes (5).
5. **The light paper look** (`NEW-light-paper-ground`, 4.5) must exist before family-A versions of the chart and document recipes and before a choropleth recipe (4.5). It means a palette, type roles, an empty finish, a static grey-grid `Paper` kind, `drawingRate` 24 or 15, and an entry in the `Look` union.
6. **Formats that need their own subsystem** (L effort, 1 video each): the conversation composition (two-up windows + layout switching from a diarized transcript), the isometric hero object, the satellite map engine.

## 7. Build round of 2026-11-14 (what was built from §6)

All six top builds were built, plus the light paper look that build 3 depends on:
1. `LowerThird`, used by `NameCardInterview card: "lowerThird"` and by `FootageClip`.
2. `EndCard mode: "credits"` with `CreditsPanel`.
3. `DocumentHighlight` v2 with `SourceLine`. `RecipeFrame` now draws the look's ground.
4. The `earworm` and `standard` sync/audio profiles, the `phrase`, `highlight` and `lowerThird` kinds, chapter `hole`s and `burst` scenes.
5. `SeriesIdent`.
6. `FootageClip`, with `CornerTag`, `DateTag` and `Subtitles`, plus clip audio (J-cut, bed duck/out) and silent credits.

The light look is `voxLight` (tokens, paper kinds, no finish). The packaging colours are tokens: `packaging` in `src/tokens/colors.ts`.

**Where things are:**
- Test projects: the maintainer's five build projects (profiles, packaging, document, ident, footage; archived, not in the repository).
- Renders: under `out/` on the maintainer's machine (not shipped).
- API: doc 14 §2–3 and doc 10.
- Timing and mix: doc 11 §10.
- Gap status: doc 14 §6.

**Verification:**
- `tsc` is clean. All eight projects validate with 0 errors.
- The resolved timelines of the maintainer's three regression projects (not shipped) are byte-identical before and after.
- The recipe gallery project re-renders bit-identical, video and audio.
- The voice test project re-renders with identical audio. Its video checksum changed between two renders three minutes apart with no code change in between (bisected). At the source level its frames match the pre-build baseline to within encoder noise: no 16×16 block deviates more than 1 level beyond the encoder's own error. So it is a sub-level rendering wobble amplified by H.264, not a regression.

## 8. A seventh video: the scrapbook brand piece (2026-11-17)

**BT** `vox_braintravel`: a Vox brand-studio explainer (advertiser content, 2022) on what travel does to the brain.
4:16 (255.9 s) at 23.976 fps, 4 voiced chapters and 2 remote experts. Report: `analysis/vox-sample/vox_braintravel.md`.
It is a sponsored brand piece, not an editorial video, so it is **not counted** in the n/6 matrices above. Like EW, it is
a separate reference: the source of the `voxScrapbook` look.

**What it confirms about the sample (§2.6, §5):**
- Cuts lead the narrator's phrase: 60 % of 35 editorial cuts and slide starts fall within 12 f of a phrase onset
  (median −5.7 f). There is no word lock (39 % within ±2 f vs 40 % by chance) and no beat lock.
- The bed is static and unducked: per-phrase duck median +0.2 dB, voice 9.0 dB over the music. It changes once per
  chapter (5 cues).
- Chapter joints get short holes (4–13 f, one of them digital silence) instead of a dip.

**Where it differs:**
- **Graphics on twos** (12 drawings/s on 23.976) throughout, as in CE and DA (EL and AM animate on ones, CR at about
  15/s), under a full-frame grain re-seeded every 6 f (4 Hz).
- **Colour carries the structure:** one paper colour per chapter and one per expert, and no single accent.
- **More sound effects** than the `standard` budget: 2.1 likely per minute (5.4 with the possible ones). Its
  transitions carry sound (paper swooshes on the sheet slides).
- **Voiced chapter cards** (4, at 10 %, 36 %, 52 % and 74 % of the runtime), and specimen-style labels ("fig. a") in
  place of lower thirds.

**Built from it** (the same day):
- the `voxScrapbook` look (tokens, watercolour paper, finish) and the `scrapbook` profile (doc 11 §10);
- six recipes: `ChapterCard`, `PaperStat`, `StampedStat`, `SpecimenPlate`, `SpecimenCompare` and `SpecimenInterview`;
- the `paperSlide` transition;
- five procedural sounds: `paper_swoosh`, `paper_flick`, `stamp_thud`, `sub_swell` and `chime`;
- seven blocks in `examples/blocks/` and the example `video-projects/example-cab-brain`;
- doc 15 (the look) and the doc 14 §3 table.

The report's §9 ranks the rest of its devices; doc 15 §7 lists those not built yet. Nothing cut from the video ships:
its frames and sounds stay on the maintainer's machine for study, as with EW.
