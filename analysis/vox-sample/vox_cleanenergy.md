# Can clean energy handle the AI boom? — `vox_cleanenergy`
YouTube YGfJeH5HRDQ · Vox *Explain It to Me* (viewer-question explainer, "presented by Klaviyo") · uploaded 2024-10-01 · 9:17.21 (557.9 s, 13,374 f) · 1920×1080 @ 23.976 fps (24000/1001) · captions auto (see §0)

## 0. Inputs and reliability
- **Read:**
  - all 32 sheets (6 re-checked after the cut warning; 38 of 40 views), 15 stills, 8 strips;
  - shot table, per-frame metrics, words, sync, rhythm, features, palette;
  - doc 12, doc 13 §0/§4/§7, `FRAMEWORK_INVENTORY.md`.
- **Own light measurements** (under the lock when heavier): per-word F0, colour classes on every 4th 640×360 frame, 23 reveal traces, a Vox-bug template, the sponsor-bar width, tesseract OCR of on-screen text and credits.
- **The captions are auto, not manual.** The `.en.vtt` has `<c>` word tags and rolling cues, and spells "Cathy", "clavo" and "880,000 households". A manual `en-US` track exists but was not fetched. Treat caption text and punctuation as unreliable; whisper gives the timing, OCR breaks ties.
- **Whisper text fixes:** Alex de Vries (name card), Klaviyo, ChatGPT, "low-lumen LED bulb", "disrupting those plans", "information Nvidia publicizes", "fossil fuels". "80,000 households" is kept (on-screen label).
- **Lines whisper dropped:**
  - 2:12.19–2:18.12 "…electricity demand, but by 2026 that number is expected to double, which is like…" (≈14 words, restored);
  - the closing promo 8:57.11–9:17.14 (≈71 words, a second voice, "JQ").
- **Speakers:** the sync.json labels are wrong both ways, so its "archival voice" class is not used. I re-labelled by who is on screen, per-word F0 (Alex 125–150 Hz, the women 175–185 Hz) and creak (Kathy 14–42 % of words below 100 Hz, host ≈0 %).
- **Cuts.** The detector found 157 shots. Checked on sheets and strips:
  - 7 false: window genies f248, f848, f926; an in-place phone-screen swap f784; dialog jumps f11357 and f11363; a fade-up f12896;
  - 1 probably false: a page flip at f7718;
  - 2 missed: page swaps inside S92;
  - result: **151 shots, 150 cuts**. "S#" is the detector's numbering.
- **Cadence** was checked by frame differencing (`mad`), not taken from the cadence column.
- **Unverified:**
  - all 18 SFX candidates (context-classified; I could not listen);
  - music style;
  - segment BPM (A 87.5, B 94.0, C 59.5, D 74.0, from weak beat strengths): ≈ only.

## 1. Summary (5–10 bullets)
- **A reporter answers one viewer's question.**
  - Kathy, a retired schoolteacher in NYC, asks it in her own voice at 0:15.11.
  - Producer Laura Bult, on camera and in the first person, answers it by name at 7:33.14 (81 % in).
  - The series card comes only after the question (1:02.19).
  - Four handwritten sub-question cards act as chapters.
- **Half live action, half graphics.** Live action: host 12 %, video-call interviews 13 %, b-roll and stock 11 %. Graphics ≈58 %: isometric 3D 18 %, documents 11 %, screen captures 11 %, 2D 7 %, charts/cards/maps 8 %. Earworm has no host and no calls.
- **One hero object carries the energy topic.** An isometric data centre returns in 13 shots and changes once per idea: built, scaled, multiplied, paired with solar, switched to night, wired beside a coal plant, rated A–D, set in a city.
- **Look.** Lemon `#FBFF0B` is the only accent (2.5 % of pixels). It sits on white graph paper or a charcoal grid, with full-colour footage, a sentence-case bold condensed sans, real handwriting, and newsprint and pixel-stripe textures. Earworm is the opposite on every axis: black torn paper, B&W cut-outs, periwinkle, condensed caps.
- **Evidence is shown as documents:** prints on a green cutting mat with a read-along highlighter, web articles in a browser frame, a word-lock montage. There is one source line in the whole film.
- **Motion is calm and stepped:** graphics on twos, stepped document pushes, UI windows that genie open, pop and extrude builds. One speed-ramped push; no Earworm hard camera.
- **Speech first.**
  - The narrator talks 56 % of the time (61 % with the sponsor read) and the interviews 21 %; music alone is 12 %.
  - The library bed sits ≈14 dB under the voice with no ducking.
  - Digital-silence holes mark the title exit, the sponsor tease and the answer.
- **Cuts follow phrasing.** They avoid word onsets (p = 0.98) and ignore beats (p = 0.37), but sit 0–12 f before phrase onsets (p = 0.002). This is the opposite of SIG-EW-1.
- **Commercial wrapper:** the Klaviyo lock-up on the series card, a 32 s mid-roll with a progress bar, and a podcast promo by its host JQ over the credits.

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
|---|---|---|---|---|
| cold-open/hook | 0:00.00–0:15.19 | 2.8 | "I spent some time recently reading through a big spreadsheet of questions…" | NEW-filmed-monitor-punch-in, T-PC, NEW-ui-window-genie, SIG-EW-9 ×2 |
| question/thesis | 0:15.19–1:02.19 | 8.4 | Kathy's question; stakes; "we've changed the entire game" | NEW-typed-question-doc, NEW-video-call-pip-interview, NEW-phone-mockup-screen-swap, NEW-stock-footage-montage |
| title/series-intro | 1:02.19–1:07.15 | 0.9 | (after "So let's get to the bottom of this.") | V-SRP, C-HC, NEW-series-title-knot, SIG-EW-12 |
| context | 1:07.15–1:26.14 | 3.4 | Q1: what do our digital lives need? → data centres | NEW-host-presenter-desk, NEW-handwritten-question-card, VX-6, NEW-isometric-hero-object |
| expert | 1:26.14–1:43.03 | 3.0 | Alex's voice and face, then "I spoke to Alex de Vries…" | NEW-video-call-pip-interview, R-NameCardInterview |
| evidence | 1:43.03–2:24.09 | 7.4 | size, count, 2 % → doubling ≈ Sweden; "I'll explain why in a minute." | NEW-stock-footage-montage, NEW-isometric-hero-object, PD-5, PD-8, NEW-sponsor-cliffhanger |
| cta/membership/sponsor | 2:24.09–2:56.19 | 5.8 | Klaviyo read | NEW-sponsor-progress-bar |
| context | 2:56.19–3:15.15 | 3.4 | Q2: how much electricity does AI use? | NEW-handwritten-question-card |
| evidence | 3:15.15–4:29.15 | 13.3 | AI umbrella, no disclosure, closed source, BLOOM ≈ 130 homes | VX-3, T-WL, SIG-VX-12, VX-5, PD-1 |
| expert | 4:29.15–5:23.14 | 9.7 | 3 Wh per ChatGPT query, 10× a Google search | NEW-video-call-pip-interview, SIG-PD-9 |
| evidence | 5:23.14–5:50.22 | 4.9 | NVIDIA servers → 100 TWh ≈ Netherlands | NEW-stock-footage-montage, NEW-read-along-highlight, PD-5 |
| turn | 5:50.22–5:59.15 | 1.6 | "There's a big part of Kathy's question I haven't gotten to yet." | NEW-host-presenter-desk, NEW-handwritten-question-card |
| evidence | 5:59.15–7:07.18 | 12.2 | pledges vs intermittency, build times, Google +48 %, coal | NEW-isometric-hero-object, NEW-day-night-ground-swap, NEW-build-time-dial, NEW-browser-window-capture |
| thesis | 7:07.18–7:33.10 | 4.6 | finite renewables → less for everything else (Alex) | NEW-isometric-hero-object |
| payoff | 7:33.10–7:43.13 | 1.8 | "…the answer to Kathy's question is… we aren't prepared…" | NEW-host-presenter-desk, SIG-EW-12 |
| ending | 7:43.13–8:57.07 | 13.2 | Q4 "So, what do we do about this?" → transparency, moratoriums, ratings, scale up renewables | NEW-desktop-ui-callback, VX-5, NEW-efficiency-badges, NEW-isometric-hero-object |
| credits | 8:57.07–9:17.21 | 3.7 | JQ's podcast promo | NEW-credits-split-panel, NEW-podcast-host-promo |

Question at 2.8 %, turn at 63 %, answer at 81 % of the runtime.

### 2.2 Claim → visual device map
| claim type | example (time, words) | device ID(s) | asset type | audio treatment |
|---|---|---|---|---|
| question | 0:15.11 "So the question is, can green energy…" | NEW-typed-question-doc | webcam → UI doc | asker's call audio over the bed |
| question | 1:12.21 card "How much electricity do our digital lives require?" | NEW-handwritten-question-card | b-roll + card | bed (stop–start at Q3, Q4) |
| person-expert | 1:26.14 Alex de Vries | R-NameCardInterview, NEW-video-call-pip-interview | call recording | voice leads the picture by 7 f |
| place | 1:58.18 "8,000 data centers around the world" | PD-5 | world map | music change on the push frame |
| number | 2:05.03 "about 2 %… expected to double… Sweden" | PD-8, SIG-VX-4 | bar chart on paper | bed |
| number | 4:05.14 "1,300 megawatt hours… 130 homes" | PD-1, NEW-relatable-unit-equation | icon equation | bed |
| comparison | 1:50.03 "four football fields… 80,000 households" | NEW-isometric-hero-object | iso 3D | bed |
| concept | 3:15.15 "AI is a huge umbrella term" | VX-3 | nested circles | bed |
| causal link | 6:12.20 "solar and wind… can't produce electricity all of the time" | NEW-day-night-ground-swap | iso 3D | bed |
| fact | 6:40.12 "Google's 2024 sustainability report showed…" | SIG-VX-12, NEW-read-along-highlight | print on mat | bed |
| fact | 3:48.09 "closed source" | T-WL | 8 web pages | bed |
| payoff | 7:33.14 "the answer to Kathy's question is…" | NEW-host-presenter-desk | host to camera, 10.1 s | 11 f digital silence, dry, bed +1.8 s |
| ending | 8:42.19 "…plenty of renewable energy to go around" | NEW-isometric-hero-object | iso city, pull-out | 23 f fade → 39 f hole |

**Counts by claim type:**
- question 5: 1 typed doc, 4 cards;
- number/comparison 10: 3 equations, 2 iso labels, 1 chart, 2 maps, 1 ring, 1 dial;
- concept 3;
- causal link 4: all iso transforms;
- fact 16: 8 documents, 6 articles, 1 word-lock, 1 phone mock-up;
- person 5: 3 name cards, 2 returns without a card;
- place 2;
- payoff 1; ending 1;
- no date device.

### 2.3 Script patterns
| measure | value |
|---|---|
| narrator words, pace | ≈1,136 (80 in the sponsor read); 122 wpm over the video, 199 wpm (3.31 w/s) while speaking |
| host wpm per beat | hook 178 · question 97 · context 162/163 · expert 69/42 · evidence 163/148/158/166 · turn 166 · thesis 51 · payoff 178 · ending 115 |
| voice share | host 60.8 % (56.4 % without the sponsor) · Alex 16.3 % · Kathy 5.0 % · JQ ≈3.5 % · music alone 12.3 % · silence 1.6 % |
| sentences | 62; median 17 words, range 2–53; 12 of ≤ 7 words |
| questions | host 3 aloud (0:13.06, 5:54.05, 7:44.12), plus Kathy's question and 4 written cards |
| person | first-person reporter: I-forms 8, we/our/us 13, "you" 1; "Kathy('s)" said 5× |

- **Signposts:** "So let's get to the bottom of this." · "I'll explain why in a minute." · "There's a big part of Kathy's question I haven't gotten to yet." · "With all this context, the answer to Kathy's question is…"
- **Sources.**
  - The narrator names Alex 10 s after his voice begins: "I spoke to Alex de Vries. He runs a research site called Digiconomist, where he's dug into this exact topic." (1:36.20).
  - Unnamed "researchers" are cited 6×, each with the paper on screen.
  - Companies are quoted from their own reports.
- **Opening:** a first-person anecdote → the asker with a descriptor → the asker's voice → "It's a good question."
- **Closing:** a moral imperative ("…how desperately we need to be scaling up renewable energy and fast…"); Kathy's last bite comes 46 s earlier.
- **Sponsor and CTA:** a tease at 2:22.23, then "All right. Support for this video comes from Klaviyo…" (32.4 s, at 26 %), then a hard return in mid-argument at 2:55.22. The membership mention is in the credits promo.

### 2.4 Format specifics
- **Host on camera: yes.** Producer Laura Bult, with her own name card (0:12.23), in four set-ups:
  - office b-roll (0:00);
  - the call desk with headphones (0:12, 1:00);
  - the presenter desk: mustard wall, laptop, broadcast mic (9 shots, 40.5 s);
  - the sponsor set (8 shots).
- **Viewer question: yes.** Kathy is found in a "big spreadsheet of questions" (a filmed monitor), interviewed by video call, and her question typed into "Question_01.doc". She returns three times; the answer names her.
- **Series branding:** the rope-knot card, "Question_01.doc", the handwritten cards, the podcast promo.
- **Chapters:** none in the metadata; the question cards at 1:12.21, 3:13.16, 5:57.03 and 7:45.17 (13/35/64/82 %) serve.
- **Interviews:** two remote calls, shown as raw call frames with the host's inset.
  - Alex: 7 bites, 91 s, one name card. His voice also runs over documents and 3D.
  - Kathy: 4 bites, 27.6 s.
- **Reporting trips:** none.

## 3. Shot economy
151 verified shots (the detector says 157). Mean 3.69 s, median 2.34 s (p10 0.58, p90 8.63), 16.1 cuts/min.

| beat | shots | cuts/min | median shot (s) |
|---|---|---|---|
| hook / question | 8 / 28 | 30.4 / 35.7 | 1.5 / 0.9 (15 stock clips in 6.2 s at 0:44.02) |
| title / context Q1 / expert | 1 / 5 / 4 | 12.4 / 15.8 / 14.5 | 4.8 / 2.2 / 4.0 |
| evidence DC / sponsor / context Q2 | 13 / 14 / 6 | 18.9 / 25.9 / 19.1 | 0.9 / 2.0 / 2.3 |
| evidence AI / expert / hardware | 22 / 8 / 8 | 17.8 / 8.9 / 17.5 | 1.4 / 5.5 / 0.9 |
| turn / renewables / thesis / payoff | 3 / 12 / 3 / 1 | 20.7 / 10.6 / 7.0 / 5.9 | 2.9 / 5.4 / 9.5 / 10.1 |
| ending / credits | 14 / 1 | 11.4 / 2.9 | 4.4 / 20.5 |

**Shot types (% of runtime):** 3d-render 17.6 · interview 13.1 · host-on-camera 12.1 · screen-capture 11.2 · document 10.9 · illustration-2d 7.0 · street/b-roll-original 6.3 · mixed (sponsor, credits) 5.6 · stock-footage 4.2 · type-card 4.2 · chart 3.3 · table/number-card 2.5 · map-2d 2.0.

**Longest holds:** JQ promo 19.9 s (8:57.21); IEA chart 18.3 s (2:05.03, four stepped pushes, ×1.405); Joule paper 17.5 s (5:28.19); final city 15.1 s; the answer 10.1 s.

**How setups reveal their elements (on twos):**
- **S46, 1:16.06:**
  1. List words appear on their nouns ("cryptocurrency" +2 f) and regroup to the corners (13 f).
  2. The yellow newsprint plate grows from a point (f1995–2008) while the arrows draw.
  3. The walls extrude (6 f) and the racks pop every 2–4 f.
  4. "Data" (f2032) and "centers" (f2036) arrive with a white swoosh, 12 f before the spoken word.
- **S99:** crate = "1,300 MWh", which swaps to "130 homes" on "130".
- **S130–S131:** one DC, then many staggered; then DC "1 year" against a dial counting 2 → 7 → 9 years.
- **S153:** A–D badges pop on "an energy efficiency rating" (−1 f).

## 4. Look
### 4.1 Colour: palette hexes, background colours, accent colour(s) and pixel share, grading of archival material.
| role | hex | share / note |
|---|---|---|
| accent | `#FBFF0B` card, `#F5FD19` labels, `#FBFE1A` bar | 2.5 % of all pixels; > 1 % in 24.8 % of frames; 4.5 % of graphics (87 % of the title card) |
| stripe yellows | `#E3E12C`, `#E8F025` + olive | name-card bar, doc title bar |
| white ground | `#FEFEFE` + faint graph grid | 52 % of 3D shots, 80 % of the chart |
| charcoal ground | `#262625` + fine grid, noise | 49 % of 2D, 24 % of 3D |
| host wall | mustard ≈ `#A59737` | 34 % of host shots |
| credits / sponsor | panel `#292929`, names `#AED5DE`; bar `#E15554` | — |

- **Palette** (k-means): `#EAEAEA` 23 %, `#292825` 12 %, `#BEC3C6` 11 %, `#7B8080` 10 %, `#090A09` 10 %, `#EFE506` 3.3 %.
- **Grade:** footage is natural full colour (warm webcams, untouched stock). Only the prints are grey. No B&W archive, no periwinkle.

### 4.2 Typography: families (name it, or describe + nearest free equivalent), roles, sizes as % of frame height, case, tracking, colour, where text sits; caption/subtitle style.
| role | family (nearest free) | cap px (% H) | case / colour |
|---|---|---|---|
| series title | heavy grotesque (Archivo 800) | 94 (8.7 %) | sentence case, black on yellow |
| name / role | distressed bold condensed / light condensed (Barlow Semi Condensed 700 / 300) | 86 (8.0 %) / 41 (3.8 %) | white, lower-left |
| graphic labels | bold condensed | 69–76 (6.4–7.0 %) | white; the key label in yellow |
| chart title / labels | same | 95 / 39–51 (8.8 / 3.6–4.7 %) | dark grey, left-aligned |
| typed question | regular condensed | 47 (4.4 %) | grey in a white window |
| question cards | real marker handwriting, caps | ≈4–5 % | grey on white |
| credits | serif roles / bold caps names (Source Serif 4 / Barlow 700) | 20 / 21 (1.9 %) | white / light blue |

- One sans family carries every role, with normal tracking.
- No subtitles; interviews are not captioned; no karaoke.

### 4.3 Layout & composition: grid, margins/safe area, text vs image placement, depth/layering.
- **Framing:** 16:9 and centred. Labels sit at the hero object's corners, joined by hand-drawn arrows. Documents are framed off-centre and pushed into the line being read.
- **Fixed positions:**
  - name cards lower-left (x ≈ 210 px) with a stripe bar;
  - Vox bug top-right;
  - call inset bottom-right (≈24 % of the width);
  - sponsor bug top-left;
  - credits panel in the left 36 %.
- **Depth:** overlapping UI windows, isometric pseudo-3D and shallow-focus filmed screens only. No multiplane.

### 4.4 Textures & finish: grain, paper, halftone, print/scan look, vignette, chromatic aberration, light leaks.
- **Grounds:** a graph grid on white; grid plus noise on charcoal.
- **Newsprint:** yellow-tinted, in the DC floor plates and the BLOOM crate.
- **Pixel stripes:** vertical, as the doc ground, on building walls, in name-card bars and as a button glitch.
- **Engravings:** line art behind the question cards.
- **Real prints** on a green cutting mat.
- **Name type:** letterpress-distressed.
- **Finish:** light grain; no vignette, chromatic aberration or light leaks.

### 4.5 Branding: logo bug, lower thirds, name cards, source lines, end card, series marks.
- **Vox bug:** top-right on ≈90 % of the runtime. Absent on the series card, during the sponsor read ("PRESENTED BY klaviyo" sits top-left instead) and on the credits.
- **Name cards:** 3 — Laura Bult / Vox producer; Kathy / Retired schoolteacher; Alex de Vries / Digiconomist founder.
- **Source lines:** 1 ("International Energy Agency"); everything else is document-as-proof (≈24 shots). The credits list sources, images (Getty) and 8 music titles.
- **Series marks:** the rope-knot card, "Question_01.doc", the question cards, the podcast promo.
- **End card:** the credits split panel.

## 5. Motion language
- **Camera:** 70 measured moves.
  - **Push-in ≈36.** On graphics, +0.12…+0.59 %/f for 8–28 f (peak 8–19 px/f), then a dead hold, one step per clause. S62 gets four steps.
  - **Pull-out ≈16:** final city ×0.895, sponsor ×0.33.
  - **Pan/scroll ≈13:** web pages at 13–24 px/f; the map pans 778 px.
  - **Crash/snap 1:** S40 ×1.27 in 24 f (39 px/f) into the title.
  - Live action is static.
- **Entries:** genie warp for windows (≈4 f); scale-up from a point; extrusion; staggered pops (bolts over 25 f); word-by-word type-on; name-card tracking-in (≈6 f, no random-letter decode).
- **Annotation:**
  - highlight wipes of 7–13 f, starting −6…+5 f from the keyword (median ≈ +1, n = 14);
  - read-along at one line per 12 f;
  - rings ≈12 f, with the bar tinted 8 f later;
  - arrows draw with their target.
- **Maps:** a Netherlands silhouette with staggered bolts; a world map pan/zoom.
- **Charts:** one stacked bar, 2 % → 4 %, with a hand-drawn arrow. No counters.
- **3D:**
  - 13 isometric shots at a fixed angle, no orbit;
  - the day/night change is made by a cut;
  - a photoreal rope for the title.
- **Drawing rate** (frame differencing):
  - graphics and their camera moves on twos (S62 alternates perfectly);
  - S127, S128 and S155 add a layer on fours (`###.`, probably texture boil);
  - the rope, webcams and host on ones;
  - the S11 ground runs on ones while its words land on even frames.

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |
|---|---|---|---|
| V-HC | ≈127 | throughout | placed 0–12 f before phrases, not on words or beats |
| T-PC | 4 | 0:07.04, 0:08.08, 4:00.12, 8:11.13 | punch-in onto the line being read |
| V-SRP → C-HC | 1 | 1:01.18 → 1:02.19 | push ×1.27/24 f, then a flat yellow card; the rope enters 12 f later |
| T-WL | 1 run, 8 pages | 3:48.09–3:54.04 | keyword locked centre-left, yellow highlight, ≈18 f per page |
| X-BlurThroughCut | 2 | 6:08.17, 8:26.07 | defocus between web pages; no zoom-blur, no sub-boom |
| V-RET | 2 | 6:12.20, 6:14.05 | back to the DC + solar layout; the second swaps the ground to night |
| SIG-PD-8 | 2 | 5:21.22, 5:23.14 | cut hidden in a page flip |
| NEW-writing-to-card-match-cut | 4 | 1:12.21, 3:13.16, 5:57.03, 7:45.17 | hand writing → scanned card |
| NEW-ui-window-genie | 4 (no cut) | 0:10.08, 0:35.09, 0:38.15, 7:50.06 | windows warp open/closed |
| NEW-phone-mockup-screen-swap | 3 | 0:31.06–0:33.04 | in-place swap every ≈17 f |
| T-DS / fade-up | 1 / 1 | 3:39.14 / 8:57.21 | 7 f soft change (unverified) / JQ fades up over 7 f inside the credits |

## 7. Audio
### 7.1 Music: cue table | t0–t1 | style/instrumentation | BPM | mood/role | entry/exit (on a beat? pre-lap? hard?) | ducking under the voice (dB) |
| # | t0–t1 | style/instrumentation | BPM | mood/role | entry/exit | ducking |
|---|---|---|---|---|---|---|
| 1 | 0:00.03–1:02.19 | library bed (not auditioned) | ≈87.5 | anecdote, question | 2 f fade-in; changes 0:09.01, 0:16.04 (on the doc cut) | rises 5.6 dB between lines |
| 2 | 1:02.19–1:07.14 | ident: 4 low hits + 1.6 s sub tail | — | series card | hits follow the rope; the tail ends in 6 f of digital silence | — |
| 3 | 1:07.15–2:21.15 | bed | ≈87.5 | context, evidence | hard on S42's first frame; a change on the map-push frame (2:02.14); 14 f digital silence | ≈0 |
| 4 | 2:24.07–2:56.17 | sponsor bed | ≈94 | ad | 14 f fade-in 2 f after the cut | speech only 5.1 dB over it |
| 5 | 2:58.02–4:15.14 | bed | ≈94 | AI energy | hard; 7 changes; 15 f fade → 14 f hole | ≈0 |
| 6 | 4:17.02–5:49.20 | bed | ≈94 / 59.5 | LLMs, hardware | 8 f fade-in; 23 f fade → 31 f near-silence | ≈0 |
| 7 | 5:51.02–6:00.22 | fragments | — | turn, Q3 | hard 4 f after the turn line; stop/start around the card | — |
| 8 | 6:00.22–7:32.17 | bed in 3 parts | ≈59.5 | renewables, thesis | restarts 6:19.12, 6:47.19; digital silence on the answer cut | ≈0 |
| 9 | 7:35.08–7:43.17 | bed | ≈74 | answer | hard, 1.8 s into the dry answer | — |
| 10 | 7:44.11–8:56.13 | Q4 sting, then bed | ≈74 | solutions | hard 7:47.08; 39 f hole across the credits cut | ≈0 |
| 11 | 8:58.04–9:17.14 | promo bed | — | podcast CTA | 8 f fade in and out | — |

- **Boundaries:** 64 (17 starts, 17 stops, 30 changes); median excerpt 8.7 s. The credits name 8 library titles.
- **Loudness:** −16.6 LUFS integrated, LRA 4.5 LU.
- **Mix:** pooled duck 0.09 dB with speech 14.2 dB over the music (IQR 10.1–17.6). The bed is mixed low throughout, not side-chained.

### 7.2 SFX inventory: | type | count | example timestamps | what it accompanies |
| type (all unverified) | count | example timestamps | what it accompanies |
|---|---|---|---|
| low hits + sub tail (may be music) | 4 + tail | 1:02.22–1:07.08 | rope ident |
| click-like transients | 3 | 0:09.01, 0:09.13, 0:10.17 | cursor; Kathy's window genie |
| broadband transients | 6 | 0:05.22, 0:24.19, 0:47.23, 1:43.02, 1:49.21, 2:54.02 | punch-in, cut out of the doc, montages, end of the sponsor read |

Typing and UI clicks under speech (0:16–0:24, 7:50) cannot be tested.

### 7.3 Voice: VO pace (wpm), typical pause lengths, VO vs interview/archival audio share, any processing (phone EQ etc.).
- **Host VO:** 199 wpm while speaking; phrase gaps median 0.71 s (IQR 0.54–0.91).
- **Shares:** host 60.8 %, Alex 16.3 %, Kathy 5.0 %, JQ ≈3.5 %; no archival audio.
- **Recording:** close-mic studio host; raw video-call interviews, no phone EQ (≈).

### 7.4 Sync: cuts vs word onsets, cuts vs beats (from `<id>_sync.json`), text reveal vs the spoken word (offsets in frames), anything beat-locked.
| pair (sync.json) | measured | null | p |
|---|---|---|---|
| cuts within ±2 f of a word onset | 34 % | 42 % | 0.98 |
| cuts 0–12 f before any phrase (median −3.6 f) | 24.8 % | 9.8 % | 0.002 |
| cuts 0–12 f before a narrator phrase | 15.7 % | 6.8 % | 0.002 |
| cuts within ±2 f of a beat | 24 % | 23 % | 0.37 (phase R 0.085) |
| cuts ±2 f of music boundaries | 3.9 % | 2.5 % | 0.17 |
| camera-move starts ±2 f of words | 41 % | 42 % | 0.58 |

- **Cut contexts:** mid-phrase 71, pause before a phrase 25, voice turn 15, music edit 17, other 25.
- **Text against the spoken word** (my traces):
  - labels lead their noun by 4–16 f ("Data centers" −12 f; "80,000 households" −4 f);
  - highlights and rings land at −6…+5 f;
  - Kathy's typed words trail her voice by +5.5…+12.8 f (median ≈ +9.5);
  - name cards: Kathy +6 f after her name; Alex 12 f after his cut, held 3.25 s.
- **Nothing is beat-locked.** Section joints lock to music starts and silences instead.

### 7.5 Silence and structural sound: drops, dips, stingers, risers.
13 gaps in total (8.9 s, 1.6 %).

- **Digital silence**, 3: 1:07.02 (13 f, the ident tail); 2:22.09 (14 f, before the sponsor tease); 7:33.03 (11 f, on the cut to the answer, which plays dry for 1.8 s).
- **Near-silence**, 3: 4:16.12, 5:49.20 (31 f, before the turn), 8:56.13 (39 f).
- **No risers;** the ident is the only stinger.
- = SIG-EW-12 without dips to black.

## 8. Device catalogue
| ID | what this video does | count | timestamps | stills | differs from our spec? |
|---|---|---|---|---|---|
| NEW-isometric-hero-object | iso data centre (LED racks, yellow newsprint plate) transformed once per idea; plus solar farm, coal plant, city | 13 shots, 98 s | 1:16.06, 1:50.03, 6:26.14, 7:23.17, 8:42.05 | 1m26s_list_to_isometric_datacenter, 1m58s_scale_80000_households | new: no iso kit |
| NEW-typed-question-doc | asker's question typed word by word into "Question_01.doc" over pixel stripes, +9 f behind her voice | 1 (8 s) | 0:16.16 | 0m22s_question_doc_typing | nearest R-QuoteCard / SIG-EW-6 |
| NEW-filmed-monitor-punch-in | source list filmed on a monitor (macro), cut tighter twice | 3 shots | 0:04.00–0:09.17 | — | new |
| NEW-ui-window-genie | desktop with yellow folders; webcam, photo, email and doc windows warp open/closed | 4 | 0:10.08, 0:35.09 | 0m11s_kathy_namecard_desktop | new |
| NEW-desktop-ui-callback | "STORE IN CLOUD" set up at 0:38, paid off by "Are you sure? NO/YES" | 2 | 0:38.15, 7:50.06 | 7m54s_desktop_are_you_sure | new |
| NEW-handwritten-question-card | hand writes the sub-question → match cut to a scanned card; chapter role | 4 | 1:12.21, 3:13.16, 5:57.03, 7:45.17 | 1m16s_handwritten_question_card | new |
| NEW-host-presenter-desk | host to camera: signposts, turn, answer | 9 shots, 40.5 s | 1:07.15, 5:50.22, 7:33.10 | — | new: no host in any look |
| NEW-host-at-work-b-roll | host typing, reading, highlighting prints | ≈8 | 0:00.00, 3:57.24, 5:17.14 | — | new |
| NEW-video-call-pip-interview | raw call frame with the interviewer's inset | 12 shots, 73 s | 1:26.14, 4:29.15, 7:55.23 | 1m29s_alex_namecard_call | not a window on a plate |
| R-NameCardInterview / SIG-EW-9 | distressed sans name + light role, stripe bar, tracking-in | 3 | 0:10.14, 0:12.23, 1:27.02 | 1m29s_alex_namecard_call | no decode, no serif |
| NEW-series-title-knot | yellow card, photoreal rope knot, title + sponsor lock-up, low-hit sting; entered by V-SRP → C-HC | 1 | 1:02.19 | 1m06s_series_title_card | an opening ident, not an end glitch card |
| VX-6 | three labels with arrows → "Data centers" | 1 | 1:16.06 | 1m26s_list_to_isometric_datacenter | iso 3D, not a desk card |
| VX-3 | nested circles: AI ⊃ ML ⊃ generative | 1 | 3:15.15 | — | charcoal ground |
| PD-8 / R-DataChart | one stacked bar, 2 % → 4 %, "Sweden > 160 TWh" | 1 | 2:05.03 | 2m22s_iea_bar_sweden | no counter |
| PD-1 + NEW-relatable-unit-equation | icon = value = everyday unit (130 homes; bulb 1 h; NL 100 TWh) | 4 | 4:05.14, 4:55.01, 5:46.06 | 4m13s_bloom_equation_card | graph paper, iso icons |
| PD-5 | world map pan; Netherlands silhouette with bolts | 2 | 1:58.18, 5:46.06 | — | no route, no pins |
| SIG-VX-12 / VX-2 | prints on a green cutting mat, real hands | 10 + 3 | 3:57.24, 5:28.19, 6:39.24 | 5m11s_joule_chart_rings | no tape labels |
| VX-5 / SIG-VX-5 / K-Highlighter | flat lemon highlight wipe | ≈14 | 1:39.10, 3:41.03, 8:22.01 | — | lemon, not mustard |
| NEW-read-along-highlight | highlight advances one line per 12 f with the reading (±3 f) | 2 | 5:28.19, 6:45.08 | — | new timing mode |
| SIG-PD-9 / K-MarkerRing | yellow rings on bars, then a tint | 2 | 5:09.10 | 5m11s_joule_chart_rings | yellow |
| K-MarkerUnderline / K-SketchArrow (SIG-VX-4) | underline, hand arrows, swoosh | ≈7 | 5:27.18, 1:23.05 | — | — |
| T-WL | "closed source" word-lock | 1 run | 3:48.09 | 3m49s_closed_source_wordlock | ≈18 f per page |
| NEW-browser-window-capture | articles in a browser frame: scroll, highlight, blur | ≈14 shots | 6:04.19, 6:56.08 | — | new |
| X-BlurThroughCut | defocus between pages | 2 | 6:08.17 | — | silent, no zoom |
| NEW-day-night-ground-swap | same iso layout cut white → charcoal | 1 | 6:14.05 | — | new |
| NEW-build-time-dial | month dial + year counter | 1 | 6:33.22 | 6m39s_build_time_dial | new |
| NEW-efficiency-badges | A–D rating badges | 1 | 8:30.11 | — | new |
| NEW-phone-mockup-screen-swap | phone on yellow, screens swap in place | 1 | 0:31.06 | — | new |
| NEW-stock-footage-montage | rapid colour stock runs (15/9/6 clips) | 3 | 0:44.02, 1:43.03, 5:23.14 | — | colour, not cut-outs |
| NEW-pixel-stripe-texture | stripe gradients on grounds, walls, bars, glitches | ≈20 shots | 0:16.16 | 0m22s_question_doc_typing | new |
| NEW-sponsor-progress-bar | coral bar fills linearly f3462→f4238 + "PRESENTED BY" bug + URL pill | 1 | 2:24.09 | 2m55s_sponsor_url_pill | new |
| NEW-sponsor-cliffhanger | "I'll explain why in a minute." before the ad | 1 | 2:22.23 | — | script device |
| NEW-credits-split-panel | charcoal left 36 %: serif roles, blue names, sponsor logo | 1 | 8:57.07 | 9m01s_credits_panel_jq | vs R-EndCard |
| NEW-podcast-host-promo | the podcast host pitches her show in a selfie video | 1 | 8:57.21 | 9m01s_credits_panel_jq | new |
| T-PC / SIG-PD-8 / V-RET / T-DS | punch-ins / page-flip cuts / returns / soft change | 4 / 2 / 2 / 1 | §6 | — | §6 |
| SIG-VX-2 / SIG-PD-3 | yellow the only accent / graphics on twos | film | — | — | lemon `#FBFF0B` / matches |
| SIG-EW-12 | 3 digital-silence holes + 3 near-silences | 6 | 1:07.02, 7:33.03 | — | no dip to black |
| SIG-EW-1 | **absent:** cuts not on words or beats | — | — | — | our default mis-times this look |

## 9. What our framework would need to make this video
1. **NEW-isometric-hero-object:** an iso kit (data centre, solar farm, coal plant, city, badges) with build, scale, multiply and ground-swap moves. 17.6 % of the runtime (1:16.06, 6:26.14, 8:42.05).
2. **A `voxExplainItToMe` theme:** lemon `#FBFF0B` on white graph paper or a `#262625` grid; sentence-case bold condensed sans; pixel stripes and newsprint; no torn paper or periwinkle.
3. **Viewer-question recipe:** filmed list with punch-ins → window genie + name card → typed question trailing the voice by 9 f → host push → series card. 0:04.00–1:07.15.
4. **Question-ladder recipe:** handwriting b-roll → card ×4 as chapters, with a short music stop–start. 1:12.21–7:45.17.
5. **Live-action slots (≈25 %):** a host presenter shot and b-roll in `storyboard.json`; a `CallFrame` component (webcam + inset + name card). 1:26.14, 7:33.10.
6. **Document recipe in this look:** print-on-cutting-mat ground, stepped pushes on twos, read-along highlight, rings. 5:28.19, 6:39.24.
7. **Browser-capture recipe:** browser chrome, scroll, highlight, defocus blur. 6:04.19–7:07.18.
8. **Equation card and single-bar chart** in this look. 4:05.14, 2:05.03.
9. **Desktop-UI kit** with callbacks. 0:35.09, 7:50.06.
10. **Packaging:** series ident (pre-rendered rope + sting into silence), credits split panel, sponsor module. 1:02.19, 2:24.09, 8:57.07.
11. **Audio:** a low-bed mix (−14 dB, no ducking); cue restarts on a scene's first frame; digital-silence holes before payoffs. 7:33.03.
12. **Sync preset:** cuts 0–12 f before phrases, never on beats; labels −4…−16 f; highlights ≈ +1 f; typed quotes +9 f. §7.4.

## 10. Evidence index
| file | time | what it shows |
|---|---|---|
| analysis/stills/vox_cleanenergy/0m11s_kathy_namecard_desktop.jpg | 0:11.15 | window with webcam + name card |
| …/0m22s_question_doc_typing.jpg | 0:22.13 | typed question, pixel stripes |
| …/1m06s_series_title_card.jpg | 1:06.17 | rope-knot series card |
| …/1m16s_handwritten_question_card.jpg | 1:16.05 | question card Q1 |
| …/1m26s_list_to_isometric_datacenter.jpg | 1:26.03 | VX-6 + iso DC |
| …/1m29s_alex_namecard_call.jpg | 1:29.10 | call frame, inset, name card |
| …/1m58s_scale_80000_households.jpg | 1:58.17 | iso scale comparison |
| …/2m22s_iea_bar_sweden.jpg | 2:22.18 | bar chart, the one source line |
| …/2m55s_sponsor_url_pill.jpg | 2:55.13 | sponsor bug, URL pill, progress bar |
| …/3m49s_closed_source_wordlock.jpg | 3:49.01 | word-lock page |
| …/4m13s_bloom_equation_card.jpg | 4:13.10 | relatable-unit equation |
| …/5m11s_joule_chart_rings.jpg | 5:11.12 | print on a mat, rings |
| …/6m39s_build_time_dial.jpg | 6:39.23 | build-time dial |
| …/7m54s_desktop_are_you_sure.jpg | 7:54.22 | callback dialog |
| …/9m01s_credits_panel_jq.jpg | 9:01.18 | credits panel + podcast host |
| analysis/strips/vox_cleanenergy_00246-00293.png | 0:10.06 | window genie, name tracking |
| …/vox_cleanenergy_00400-00447.png | 0:16.16 | typed words +5…+13 f |
| …/vox_cleanenergy_01506-01553.png | 1:02.19 | title: 12 f flat yellow, rope on ones |
| …/vox_cleanenergy_01995-02042.png | 1:23.05 | iso build order |
| …/vox_cleanenergy_07412-07459.png | 5:09.03 | rings on a print |
| …/vox_cleanenergy_08950-08997.png | 6:13.07 | day → night swap |
| …/vox_cleanenergy_11380-11427.png | 7:54.15 | dialog jumps (false cuts) |
| …/vox_cleanenergy_12878-12925.png | 8:57.03 | credits, fade-up |
| analysis/sheets/vox_cleanenergy/sheet_001–004, 017, 018 | 0:00–0:44, 3:48–4:17 | cut checks |
