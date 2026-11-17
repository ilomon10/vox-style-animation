# The Electoral College, explained — `vox_electoral`
YouTube ajavsMbCapY · Vox explainer, "Vox Election 2020" series, presented by Absolut · uploaded 2020-10-31 · 8:08.07 (488.28 s, 11,707 f) · 1920×1080 @ 23.976 (24000/1001) · captions auto (the downloaded `.en.vtt` is YouTube ASR; the manual `en-US` track was not downloaded)

## 0. Inputs and reliability
- **Read:** guide, vocabulary, docs 12 §1 and 13, shots, metrics, all 13 sheets, words/phrases/transcript/rhythm/features/sync, palette, info.json, VTT, and A/V timelines 64–72 s and 264–272 s.
  - I also built 2 extra sheets of the settled state after every change inside shots 16 and 18–24, which the sparse sampler covered with only 3 cells.
- **Budget used:** 17 sheet-type images of 40, 8 strips of 8, 15 stills of 15 (+2 crops of those stills).
- **Transcript corrections** (1,342 → 1,333 words). The VTT is ASR too, so text was corrected from context:
  - "national League" → "national lead", "Swing seats" → "Swing states";
  - "Three Fist Claws" / "three fists" → "three-fifths clause" / "three-fifths", "a lot wider" → "a lot whiter";
  - "Can't rid of" → "Get rid of" (Warren), "Absolute" → "Absolut";
  - removed the duplicates "votes." (2:55.23) and "locked." (3:23.09), and the hallucinated "a few more votes in the election." at the B/C seam (5:26.18). The captions read "the candidate from Virginia just enough to win".
- **Speakers are mis-labelled in sync.json.** It guesses them from the voice band limit, so its "archival voice" class (97 s, 19.9 %) flags dry narrator lines (0:21.16, 1:12.04).
  - By hand: news-clip voices 0:04.03–0:18.14 (54 words), Warren 7:10.23–7:13.05, host read 7:49.21–8:07.08; everything else is the narrator.
  - The quote cards sound narrator-read; this is unverified.
- **Cut detector:** of 32 "cuts", 25 are real boundaries and **19 are instant cuts**. The 7 false ones are f5/f8 (opening static), f34 (double), f5673/f5681 (blink highlight) and f11250/f11256 (inside the end fade).
- **Soft transitions:** 16 of 32 are real. 9 are builds inside one composition and 7 are fragments of one dissolve or fade.
- **Missed changes:** ≈ 20 scene changes made by pans, slides or swaps are undetected, so §3 uses **58 hand-verified scenes**.
- **Distrusted metrics:**
  - shot cadence "on twos": frame differencing in 13 moves says **on ones**;
  - longest hold capped at 5.0 s by one-frame keyframe blips every ≈ 120 f (recomputed ignoring them);
  - 168 of 184 music "boundaries" track voice gaps (the cue list uses novelty changes, the tempo map and silences);
  - segment tempos (A 81, B 136, C 95.5 BPM) average several cues.
- **Not measured:** exact fonts; SFX identity (I could not listen); whether the quote reads are EQ'd.

## 1. Summary (5–10 bullets)
- **A light, flat data explainer, not a collage.** 83 % of the runtime is an off-white paper ground (`#E9E9E9`, faint ghost newsprint) where charts, maps and state tiles morph. Archival material fills only 12 %. Earworm is the opposite: black torn paper with B&W cut-outs.
- **The argument is a proof built by one chart turning into the next:**
  - popular vote → 538 elector squares → states;
  - Texas vs Vermont as unit dots → weight per vote → winner-take-all;
  - swing states → influence → slavery and the three-fifths clause → blocked reforms → who benefits today.
- **Signature: the 538-square elector grid** (`NEW-unit-grid-cartogram`). It groups into states, fills red/blue, carries the 270 line, and is the ground of the title card (1:08) and the ending (7:44).
- **Colour is semantic and multi-accent:** party red `#E04B4A` / blue `#5577A6`, swing orange `#E6875A`, lemon highlighter `#FBF303`, mustard tags `#F3C357`. Earworm uses one periwinkle. Accents are still small (red 2.1 %, blue 1.6 %, orange 0.7 % of paper frames).
- **Type:** a Scotch-style text serif with old-style figures (≈ Harriet/Georgia), sentence case. A heavy grotesque appears only in captions and credits. No condensed caps.
- **Motion:** smooth eased moves on ones, pans and scrolls along long horizontal strips. No 12 fps stepping, no grain, no weave; holds are pixel-still.
- **Editing:** 58 scenes, one per 8.4 s, but only 19 instant cuts; the rest are swaps, morphs, slides and dissolves.
  - Scene changes land on sentence onsets (median −1 f).
  - Cuts follow music edits (p = 0.03), never beats.
- **Narration-heavy argument:** the narrator speaks 76 % of the time at 153 wpm. There are no experts on camera: sources appear as chart subtitles and "Source:" lines, and politicians' words as read quote cards with highlighter.
- **Sound:** one low, steady library bed (speech ≈ 19 dB over music; median duck 2 dB; 8 credited tracks), three digital-silence holes with hard re-entries on cuts, almost no SFX.
- **Format:** news-clip cold open → 2 thesis questions → sponsored series title at 14 % → 4 chapters → aphorism ending → end card → host reads the sponsor beside the credits.

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
|---|---|---|---|---|
| cold-open/hook | 0:00.00–0:21.08 | 4.4 | "If you watch the news… you'll hear a lot of this" → pundits → "Ah yes, the swing states." | NEW-tv-frame-news-montage, NEW-tv-static-flip, SIG-VX-4, NEW-key-line-caption-box, NEW-two-tone-party-label, T-PCap |
| context | 0:21.08–1:02.11 | 8.4 | Popular vote elsewhere; "in America, we do it a little differently"; delegates by state; minority presidents; unpopular | NEW-flat-icon-illustration, NEW-unit-grid-cartogram, NEW-portrait-roundel-tags, PD-8 |
| question/thesis | 1:02.11–1:08.09 | 1.2 | "So why does the US still use the Electoral College? And who actually benefits from it?" | grid zoom + party fill |
| title/series-intro | 1:08.09–1:11.22 | 0.7 | — (swell, then silence) | R-EndCard-style lockup on the grid |
| demonstration | 1:11.22–2:27.00 | 15.4 | Congress → Texas vs Vermont → people per elector → Wyoming vs California → 270 | NEW-state-badge-tile, NEW-tile-to-unit-dots, K-DotField, K-SketchArrow |
| evidence | 2:27.00–3:41.21 | 15.3 | 2016 results; winner-take-all; California's Trump votes "didn't matter"; visits; Florida | NEW-chart-morph-chain, NEW-chart-slide-swap, NEW-choropleth-us-map |
| evidence | 3:41.21–4:19.13 | 7.7 | Swing states shift; Michigan 51× Utah; campaign spending | NEW-choropleth-us-map (flipbook), proportional tiles, NEW-bubble-map |
| turn | 4:19.13–4:30.03 | 2.2 | "…has always shifted power away from some people… It was how it was designed." | painting, K-RackFocus/K-PullBack, silence hole |
| context | 4:30.03–5:31.00 | 12.5 | Constitution; North vs South; three-fifths clause; Virginia vs Pennsylvania 1800 | PD-5, NEW-state-badge-tile, NEW-print-slide-over |
| context | 5:31.00–5:53.05 | 4.5 | Grandfather clause, literacy tests, poll taxes; 1963 registration | NEW-paper-timeline-scroll, PD-8 |
| evidence | 5:53.05–6:30.02 | 7.6 | 1816 and 1969 reforms blocked by Southern senators; "Let's keep it." | NEW-paper-timeline-scroll, K-DotField, R-QuoteCard + SIG-VX-5, E-TB |
| payoff | 6:30.02–7:16.02 | 9.4 | Beneficiaries changed: whiter, Republican states; Bush, Trump; Democrats lead repeal; Warren | tiles + bars, NEW-portrait-roundel-tags, archival + name super |
| turn | 7:16.02–7:38.03 | 4.5 | Critics flipped: 1948 New York; Gossett quote | NEW-choropleth-us-map, NEW-karaoke-highlighter |
| ending | 7:38.03–7:50.22 | 2.6 | "Swing states change. What doesn't is…" | flipbook → grid pull-back → T-FB |
| cta/membership/sponsor + credits | 7:50.22–8:08.07 | 3.6 | End card; host's Absolut read; credits | R-EndCard, NEW-host-sponsor-read-credits |

### 2.2 Claim → visual device map
| claim type | example (time, words) | device ID(s) | asset type | audio treatment |
|---|---|---|---|---|
| date | 5:57.14 "back in 1816"; 3:41.21 "changed over time" | NEW-paper-timeline-scroll marker; PD-2 year flipbook on the map | vector | bed; flipbook on the music pulse |
| place | 1:24.00 "let's look at Texas" | NEW-state-badge-tile (silhouette, name, population) | vector | bed |
| person-historical | 0:46.01 "wins… without winning the popular vote"; 5:26.22 "the candidate from Virginia" | NEW-portrait-roundel-tags + PD-6 pan; NEW-print-slide-over + name | archival photos, painting | bed |
| person-expert | 3:58.06 "A study found…" | chart subtitle "Mixon, Duquette, Cebula 2017"; "Source: Alexander Keyssar" | type | bed |
| fact | 0:21.08 "Most democracies… popular vote" | NEW-flat-icon-illustration | vector icons | new cue hard in on the cut |
| list | 5:35.00 "poll taxes and acts of violence" | timeline period bands | vector | slow cue |
| concept | 0:34.09 "the Electoral College" (label 15 f before) | NEW-unit-grid-cartogram + NEW-two-tone-party-label | vector | bed |
| causal link | 2:45.04 "awards its electoral votes the same way" | NEW-chart-morph-chain (bars snap to the winner) | vector | bed |
| number | 1:30.00 "Texas has 36 representatives"; 4:17.00 "$127 million" | NEW-tile-to-unit-dots; NEW-bubble-map + callout + K-SketchArrow | vector | bed |
| comparison | 2:07.23 "Wyoming… three and a half times… California" | tiles sized by vote weight | vector | bed |
| quote | 6:17.07 "A senator from Alabama wrote…"; 7:26.03 "A congressman from Texas said…" | R-QuoteCard + SIG-VX-5; NEW-karaoke-highlighter | type card | narrator reads; bed drop after |
| quote (archival) | 7:11.04 "Get rid of the Electoral College." | archival video + name super | CNN footage | clip audio + applause |
| question | 1:02.11 "So why does the US still use…" | grid zoom + fill → title card | vector | swell → silence |
| payoff / ending | 7:38.03 "Swing states change…" → 7:50.22 | flipbook → grid pull-back → T-FB → R-EndCard | vector, lockup | new cue on the line; music alone under the card |

**Counts per claim type → device (≈):**
- number 22: tile and bar labels 9, unit dots or squares 5, proportional tiles 3, chart callouts 3, bubble callouts 2;
- place 20: badge tiles 12, choropleths 7, archival map 1;
- date 12: timeline 6, portrait tags 5, flipbooks 2;
- comparison 8: side-by-side tiles 5, paired bars or lines 2, split bar 1;
- person-historical 8: roundels 7, print 1;
- concept 6: labels 5, grid 1;
- causal link 6: morphs 4, arrows 2;
- quote 4; question 3; list 2; person-expert 0 on camera (4 source lines).

### 2.3 Script patterns
| beat | narrator words | wpm (beat) | narration % |
|---|---|---|---|
| cold-open | 20 | 56 | 23 (the clips carry it) |
| context / question | 124 / 16 | 181 / 162 | 84 / 83 |
| demonstration | 196 | 157 | 80 |
| evidence (2:27 / 3:41) | 213 / 102 | 171 / 162 | 81 / 86 |
| turn / context (4:30, 5:31) | 26 / 167 / 59 | 147 / 165 / 159 | 81 / 82 / 85 |
| evidence (5:53) / payoff | 95 / 123 | 154 / 161 | 82 / 77 |
| turn (7:16) / ending | 69 / 33 | 188 / 155 | 84 / 80 |

- **Pace:** 1,243 narrator words = **152.7 wpm** over the video, articulation 3.37 words/s.
- **Voice shares:** narration **75.6 %** of the runtime (369 s); clips 3.3 %; host ≈ 2 %.
- **Sentences:** 79; median 15 words (mean 15.7, range 2–53); 16 % are ≤ 7 words, 13 % are ≥ 25.
  - Short sentences are the pivots: "Vermont only gets one." "But it didn't matter." "One problem." "Swing states change."
- **Questions (3):** the thesis pair at 1:02.11 and 1:06.10, then a rhetorical one at 6:23.22 ("Why change a system that… was benefiting white southerners?").
- **Person:** "you" ×4 (the hook, and "You're probably more familiar with this version"); "we" ×2; meta "let's look at Texas". Present tense for the mechanism, past for history.
- **Signposting:** deictic "this/these" ×15, always pointing at a chart ("this chart tells a different story", "these states… than these ones"). "but" ×13 drives every turn; also "That's because…", "That's one reason…", "This meant…".
- **Sources:** spoken in passing ("A study found…", "Polls show…", "A senator from Alabama wrote,"). The proof sits on screen: em-dash attribution with year, bottom-left "Source:" lines, chart subtitles (Gallup, NYT, US Commission on Civil Rights).
- **Opening and closing formulas:** a second-person media hook → clips → wry aside → global contrast ("Most democracies… But in America…"). It closes on a two-part aphorism ("Swing states change. What doesn't is…").
- **Sponsor:** "Thanks to Absolut… So drink responsibly, and vote responsibly." The membership CTA is in the description only.

### 2.4 Format specifics
- **Host:** on camera only for the sponsor read (7:55.04–8:08.07), webcam-style at home, unnamed.
- **Viewer question:** none.
- **Series branding:** a "Vox · ELECTION 2020 · presented by ABSOLUT." lockup at 1:08.09 and again as the end card.
- **Chapters:** 4 YouTube chapters (0:00, 2:08, 4:22, 5:53). There are no chapter cards, but each joint coincides with a scene change.
- **Interviews and trips:** no interviews and no reporting trips. The archival clips are 9 TV news clips (8 in the cold open) plus a CNN town hall (Warren, 4 shots).

## 3. Shot economy
- **Scenes:** the detector gives 33 shots. Verified: **58 scenes**, entered by:
  - 19 instant cuts, 13 in-place swaps, 8 dissolves or fades, 5 pans, 4 morphs, 3 static flips;
  - 2 slides, 2 builds, 1 slide-in, 1 tilt.
- **Scene length:** mean **8.4 s**, median 7.1 s (p10 1.6, p90 14.0), max 44.0 s. Our Earworm target is one composition per 4 s.
- **Picture events:** ≈ 80–90 (79 detected visual onsets plus small builds), one per ≈ 6 s.

| beat | scenes | scenes/min | hard cuts/min |
|---|---|---|---|
| cold-open | 9 | 25.3 | 14.1 |
| context / question | 6 / 1 | 8.8 / 10.2 | 4.4 / 0 |
| demonstration | 4 | **3.2** | 0 |
| evidence 2:27 / 3:41 | 7 / 5 | 5.6 / 8.0 | 0.8 / 3.2 |
| turn / context 4:30 / 5:31 | 1 / 5 / 2 | 5.7 / 4.9 / 5.4 | 5.7 / 1.0 / 2.7 |
| evidence 5:53 / payoff | 4 / 5 | 6.5 / 6.5 | 0 / 2.6 |
| turn 7:16 / ending / sponsor | 5 / 1 / 2 | 13.6 / 4.7 / 6.9 | 8.2 / 0 / 0 |

- **Shot types (% runtime):** chart 38.6, table/number-card 22.1, map-2d 10.6, type-card 7.0, archival-video 6.5, archival-photo 5.6, illustration-2d 4.4, host-on-camera 2.7, collage 2.5.
- **Longest holds** (no change above mad 0.15): 25.4 s at 1:31.05 (Texas/Vermont dots), 18.6 s at 3:09.07 (state bars), 10.8 s at 6:19.02 (quote card), 10.1 s at 4:12.12 (spending map). 53 % of frames sit in holds ≥ 2 s.
- **How a setup reveals its elements.**
  - **Texas/Vermont (1:24–2:27):**
    1. Texas tile on "Texas" (1:24.00), then its population (1:26.14), then Vermont (1:27.14).
    2. The tile dissolves while **36 dots count in, about one per frame** (1:30.00–1:31.09).
    3. Dots become squares (≈ 1:42); 2 senator dots arrive on "plus two for each senator" (≈ 1:45–1:48).
    4. 664,000 / 210,000 appear with arrows (1:52.00); the tiles are resized by vote weight (1:56.07).
    5. Wyoming/California (2:07.23) → grid (2:18.14) → party fill → 270 line (2:24.03).
  - **2016 (2:27–3:41):**
    1. Title, then the bars rise (2:27.10).
    2. Slide to the map and back (2:31.11, 2:36.19); ring on "actually" (2:40.06).
    3. The bars snap to the winner's colour (2:45.04, ≈ 25 f) and squash into a strip (2:46.13, ≈ 40 f).
    4. Electoral-vote dot columns rise (2:48.22).
    5. Minnesota (2:51.12), then California (2:57.03), then 6 states (3:01.07), then 3 (3:07.07).
    6. Campaign-event labels, the "Swing state" label (3:29.08), then a push-in with a ring on Florida's margin (3:36.00–3:38.20).

## 4. Look
### 4.1 Colour
| role | hex | where |
|---|---|---|
| paper ground / patches | `#E9E9E9` (top `#F1F1F1`) / `#D6D9D3` | 83 % of runtime; 74 % of the pixels of those frames |
| ink / tile charcoal / history slate-teal | `#090B0B` / `#41423D` / `#556767` | text, squares; state badges; 1787–1800 tiles |
| map grey / gridline grey | `#777777` / `#B8B8B8` | US base map |
| party red (light) / blue (light) | `#E04B4A` (`#E76968`) / `#5577A6` (`#7794B7`) | results, grid, lines |
| swing/data orange | `#E6875A` | swing states, bubbles, rings, arrows, Gallup dots |
| highlighter / ring yellow | `#FBF303` / `#F8F323` | quote highlight, rings |
| tag mustard / year-tag red | `#F3C357` / `#E17D5F` | portrait tags |
| label red + teal-navy block | `#CE4948` + `#326785` | keyword labels |
| salmon highlight; timeline mustard, blue-grey, pink; teal bar | `#DA9676`; `#E3BC64`, `#889BB3`, `#F28D8C`; `#6FA3AF` | quote; 5:31–5:53 |
| clip caption box | `#788DB1` | 0:13–0:20 |

- **Accent share on paper frames:** red 2.1 %, blue 1.6 %, orange 0.7 %, yellow 0.2 %; up to ≈ 40 % in full-grid shots.
- **Archival grade:** none. Clips keep broadcast colour (saturation 0.3–0.7) inside a TV bezel; paintings are warm, full colour; 19th-century portraits are B&W. Blacks are not lifted.

### 4.2 Typography
| role | family (≈ / nearest free) | size (% H) | case, colour | placement |
|---|---|---|---|---|
| chart title / subtitle | bold Scotch serif ≈ Harriet/Georgia / Source Serif 4, Gelasio | cap 3.1 (34 px) / 1.7 | sentence, near-black | top centre, y ≈ 100–150 px |
| keyword label | same, bold white | box ≈ 9.5, cap ≈ 5 | sentence, red + teal-navy | near its subject, rotated −3…−4° |
| numbers, callouts | same, **old-style figures** | ≈ 4–4.6 | grey-black | beside the data |
| quote card | semibold serif, curly quotes | cap ≈ 3.7 (line 62 px, pitch 81 px) | sentence | centred; "—Name, State / year" right; source line bottom-left ≈ 1 |
| portrait tags | bold serif on mustard / white on red | tag 6.9 / 4.8 | title | under each roundel |
| state badge | white serif | 1.5–5 (scales) | title | inside the tile |
| name super (Warren) | white bold serif + heavy sans "D-MA" | cap ≈ 5 + 2.3; yellow rule 10×106 px at x 91 | title | mid-left, clear of the CNN chyron |
| clip caption / credits | heavy grotesque ≈ Balto/Franklin Gothic / Libre Franklin Black | ≈ 5 / ≈ 2 | sentence / caps (light blue + white) | lower middle / right-aligned column |

- **Rules:** normal tracking; no condensed type; no handwriting (annotation words are typeset serif); ≤ 2 styles per frame; no narration subtitles.

### 4.3 Layout & composition
- Full 16:9, centred and symmetric: title top-centre, data in the middle ≈ 70 % of the width, source line bottom-left (≈ x 60, y 1020), corner bug top-right.
- **Comparisons** split left|right (Texas|Vermont, South|North, Virginia|Pennsylvania). **Lists** are rows with a badge as each row's header.
- **Timelines** are a white band at ≈ 60 % H with vertical event rules.
- **Depth:** nearly none. Labels over clips, a print over a chart, and a drop-shadowed TV bezel; masks are never broken.

### 4.4 Textures & finish
- **Paper:** static off-white with ghost newsprint at ≈ 5–8 % contrast. Holds measure mad 0.0, so there is no weave, boil or re-grain.
- **Tiles:** charcoal tiles carry a mottled paper texture.
- **Analog cues:** the TV bezel and scanline static, in the cold open only.
- **Not present:** halftone, RGB split, chromatic aberration, leaks, film damage.

### 4.5 Branding
- **Corner bug:** top right, alternating the Vox wordmark ↔ "Presented by ABSOLUT." every ≈ 25–50 s (≈ 7 switches); absent over footage.
- **Title card (1:08.09):**
  1. pull-back on the grid as it fills with colour;
  2. logo fades in (≈ 10 f);
  3. "ELECTION 2020" types on (22 f).
- **End card:** the same lockup on black (7:50.22).
- **Supers and sources:** Warren super, portrait tags, Jefferson name; "Source:" lines.
- **Credits:** Sources, Images (Library of Congress, Getty), Footage (CNBC, MSNBC, CNN), Music.

## 5. Motion language
| camera move | count (≈) | examples | measured |
|---|---|---|---|
| push-in | 9 | 0:08.18 news screen ×1.37; 0:25.17 76 f ×1.26; 3:36.00 35 f ×1.28 | slow, eased |
| pull-out | 4 | 1:04.17 160 f ×0.86 (to title); 4:22.15 painting ×0.73 after rack focus; 7:45.17 86 f ×0.88 | slow |
| pan / scroll | 8 | 0:39.02 720 px/31 f (peak 49 px/f); 0:47.17 1,945 px/132 f (peak 42); 5:35.00 1,760 px/254 f; 6:06.07 1,829 px/95 f | peak/mean 2.1–2.9: strong S-curve |
| tilt | 1 | 6:17.07 to the quote card, 811 px/44 f (peak 53 px/f) | eased |
| static | majority | holds | pixel-still |
| crash, handheld, 3D, multiplane | 0 | — | fastest ≈ 2.8 % of width per frame |

- **Entrances:** fades (4–15 f), box-wipe + type-on labels (≈ 15 f), staggered per-state map fades (≈ 12 f), unit dots at ≈ 1 per frame, bars grow/snap/squash (25–40 f), a print slide-up with its rotation settling (15 f).
- **Annotation:**
  - state borders stroke on in 12 f (0:36.14);
  - yellow rings draw in **6–16 f on the stressed word** ("national polls" 0:09.08, "actually" 2:40.06, "100,000" 3:38.20);
  - orange/red rings ×3, arrows ≈ 6, highlighter 16 f ease-out.
- **Maps:** fills fade in per state; a year flipbook at 18.6 f per step; bubbles; a ring on New York (7:21); a colonial map pushed and panned with yellow outlines. No zooms to places, no routes.
- **Charts:** frame → title → data rise → annotation → morph to the next view. Lines are dots first, then strokes (7:05). No rolling counters.
- **Frame rate and feel:** no 3D. On ones in every measured move (new-frame share 0.78–1.00), not 12 fps. No stop-motion feel; the rings are smooth vector strokes.

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |
|---|---|---|---|
| `V-HC` hard cut | 19 | 0:04.01, 0:21.08, 2:27.00, 3:41.21, 4:22.15, 4:30.03, 7:11.04, 7:21.00 | not word- or beat-locked; at music edits and sentence onsets |
| `T-IC` in-place swap on the same paper | 13 | 1:24.00, 2:07.23, 2:57.03, 3:48.20, 4:37.19, 4:58.02, 6:55.07, 7:03.00 | ground persists; 4–15 f fades |
| `NEW-chart-morph-chain` morph | 4 (+≈ 6 inside stages) | 1:30.00, 2:45.04, 2:46.13, 6:37.05 | data changes state, no cut |
| pan/scroll as transition (`T-WH`-like) | 5 | 0:39.02, 0:54.02, 1:03.15, 5:53.17, 6:06.07 | eased, 13–49 px/f, no blur |
| `T-DS` short dissolve | 6 | 0:45.17 (9 f), 1:11.20 (28 f, colour → B&W), 4:11.20 (14 f), 7:26.03, 7:38.00, 7:55.04 | longer than our 7 f |
| `NEW-tv-static-flip` | 3 | 0:00.00 (9 f), 0:01.07 (4 f), 0:02.13 (6 f) | silent scanline static |
| `T-PCap` persistent caption | 2 | 0:19.10 label over the clip → paper dissolve; 2:31.11 chart title | — |
| `NEW-chart-slide-swap` | 2 | 2:31.11 (24 f), 2:36.19 | lateral slide + per-state stagger |
| `NEW-print-slide-over` / `E-TB` / `V-MOV` | 1 / 1 / 2 | 5:26.22 / 6:17.07 / 0:21.08, 4:30.03 | — |
| `T-FB` fade to black | 1 | 7:49.05 → black at 7:50.22 (42 f) | starts on "the most", ends 1.1 s after the last word |
| title build | 1 | 1:08.09 | our `R-EndCard` uses a glitch build |

## 7. Audio
### 7.1 Music
Eight library tracks are credited ("Tic Tac", "Time Tension", "On the Nail", "Pace Yourself", "In a Tizz", "Up to No Good", "Occupied", "Persistence"). Matching titles to cues was not possible (≈).

| t0–t1 | style (≈) | BPM | mood/role | entry/exit | ducking |
|---|---|---|---|---|---|
| 0:00–0:19.22 | tense pulse | ≈ 130 | news urgency | in f2; 6 f fade under the label | under clip audio |
| 0:21.10–0:53.08 | light percussive | ≈ 120 | exposition | **hard in on the cut**; hard out → 9 f hole | none |
| 0:54.02–1:10.17 | sparse | 84/120 | problem → questions | 29 f fade into the title swell → **24 f digital silence** | none |
| 1:11.22–2:23.21 | driving pulse | 136 | mechanism | **hard in on the cut**; 15 f fade → 18 f digital silence | none |
| 2:26.03–≈3:41 | data cue | 130 | 2016 | pre-laps the cut by ≈ 0.9 s, with a hit | none |
| ≈3:42–4:22 | mid-tempo | 86 | swing power | changes at 4:08.10 and 4:19.14 | none |
| 4:22.15–4:29.13 | bed out (≈) | — | turn line dry | 9 f silence → hit **pre-laps the cut by 5 f** | — |
| 4:29.23–5:30.17 | sparse | ≈ 129 | slavery | micro-gaps | none |
| 5:30.17–7:12 | slow | ≈ 60 | Jim Crow → payoff | re-fades in over 20 f at 6:29.19 | none |
| 7:13–7:37.05 | under applause; then a ≈ 120 cue | 90 / 120 | Warren; 1948 / Gossett | out → 16 f hole | none |
| 7:38.03–8:06.17 | ending cue | 120 → 80 | aphorism, card, sponsor | **in on "Swing states change."**; 6 f fade → 15 f of silence | none |

**Ducking:** speech-to-music is 19.2 dB median (IQR 15.3–23.5); the per-phrase duck median is 2.3 dB, with only 43 % of phrases ducked ≥ 3 dB. This is a **static low bed, not a ride**.

### 7.2 SFX inventory
| type | count | example timestamps | what it accompanies |
|---|---|---|---|
| swell/riser + hit (≈) | 1 | 1:08.23 | title-card build |
| broadband hits (≈ cue downbeats) | 3 | 0:30.07, 2:26.04, 4:29.23 | section joints |
| short accents (≈) | 3 | 2:57.15, 4:06.11, 6:48.14 | badge, rings, bars |
| diegetic clip audio, applause | 2 passages | 0:00–0:18, 7:13–7:21 | archival |
| whoosh, pop, typing tick, static | **0** | static flips, slides, dots and type-on are silent | — |

### 7.3 Voice
- **Pace:** 3.37 words/s while speaking; 147–188 wpm per beat.
- **Pauses:** after a sentence 0.80 s median (IQR 0.60–0.98); after a comma 0.41 s; phrases have a median of 2.9 s and 10 words.
- **Shares:** narration 75.6 %, clips 3.3 %, Warren 0.5 %, host ≈ 2 %, music alone ≈ 16 %, silence 5.7 % (mostly sub-second holes).
- **Processing:** the narrator is mono-centred (side − mid −44.6 dB), dry and close. No phone EQ.

### 7.4 Sync
- **Cuts vs word onsets:** median −1.9 f; 28 % within 2 f against a null of 42 % (p = 0.97). **Not word-locked.**
- **Cuts vs music boundaries:** ×2.66 (p = 0.034).
- **Cuts vs beats:** R = 0.10 (p = 0.82). Visual onsets: R = 0.13 (p = 0.43).
- **Scene changes vs narrator phrase onsets** (45 changes): median −1 f, 67 % within ±12 f, 56 % lead. Visual onsets vs phrases: ×2.9 (p = 0.002). Some land on "but" (painting, 4:22.15, +1 f).
- **Text vs spoken word:**

  | text | offset |
  |---|---|
  | "Swing states" (type-on start) | −7 f |
  | "Popular vote" | −4 f |
  | "Electoral College" | −15 f |
  | "Couldn't vote" | −13 f |
  | "Thomas Jefferson" | −6 f (to "Virginia"; he is never named) |
  | "Three-fifths clause" | lands on "clause" |
  | "270" marker | **+52 f** (end of phrase) |

- **Highlighter:** Allen's starts −12 f before "Let's" and ends +2 f after it. Gossett's spans follow the reading (18/56/40 f).
- **Unit dots:** they count over "Texas has 36 representatives" (0 → +33 f).
- **The one beat-locked device:** the swing-map flipbook. It steps every 18.6 f (≈ 77 BPM; the cue reads 78), and 8 of 10 steps fall within ±2 f of an audio onset.

### 7.5 Silence and structural sound
- **Digital silences:** 1:10.20 (24 f, then the cue hard in on the cut at 1:11.22), 2:25.08 (18 f), 4:29.13 (9 f, then a hit pre-lapping the cut at 4:30.03). They work like our `X-DipToBlack`, but without a picture dip.
- **Bed drops:** 0:20.14, 0:53.08, 7:21.00, 7:37.05. No risers apart from the title swell; no sub-booms.
- **End:** music alone under the end card, then under the sponsor read, then out.

## 8. Device catalogue
| ID | what this video does | count | timestamps | stills | differs from our spec? |
|---|---|---|---|---|---|
| NEW-unit-grid-cartogram | 538 squares; state borders stroke on; party fill; 270 line; zoom and pull-back; title and ending ground | 5 | 0:31.07, 1:03.15, 1:08.09, 2:18.14, 7:44.13 | strip_00876, strip_01636, 1m09s14 | new |
| NEW-chart-morph-chain | one data stage morphing through views under a persistent title | 3 stages | 1:24–2:27, 2:27–3:41, 6:30–6:55 | xsheet_shot16, strip_03995 | new |
| NEW-state-badge-tile | charcoal tile, state silhouette, serif name; row header; size = value | ≈ 30 tiles / 9 setups | 1:24.00, 2:51.12, 3:58.06, 4:37.19, 6:29.23 | 4m08s04, 3m27s19 | new |
| NEW-choropleth-us-map | flat US map; per-state fill stagger; legend; year label | 7 | 2:31.11, 3:41.21, 3:52.14, 7:21.00, 7:38.00 | strip_03626 | PD-5 is only a place label |
| NEW-bubble-map | proportional circles + serif callout + arrow | 2 | 3:48.20, 4:11.22 | 4m17s01 | new |
| NEW-two-tone-party-label | white serif on a red box with an offset teal-navy block; rotated; box-wipe + type-on (15 f) | 5 | 0:19.10, 0:24.06, 0:34.09, 3:29.08, 4:58.18 | 0m20s15, strip_00458 | like StationLabel, but serif, two-tone, no scramble |
| NEW-tile-to-unit-dots | tile dissolves while N dots count in at ≈ 1 per frame | 2 | 1:30.00, ≈ 1:42 | strip_02152 | K-DotField has no tile cross-fade |
| NEW-chart-slide-swap | view slides out sideways; the next view fades in staggered | 2 | 2:31.11, 2:36.19 | strip_03626 | new |
| NEW-tv-frame-news-montage | news clips in a TV bezel on grey, fast cuts | 8 clips | 0:00–0:19 | 0m00s08, strip_00000 | new (PD-7 is a ▶ caption) |
| NEW-tv-static-flip | 4–9 f scanline static | 3 | 0:00.00, 0:01.07, 0:02.13 | strip_00000 | new, silent |
| NEW-key-line-caption-box | Vox box quoting a clip's key line | 1 | 0:15.11 | 0m17s00 | static, unlike R-KaraokeQuote |
| NEW-karaoke-highlighter | highlight spans track the read quote (yellow = who, salmon = value) | 3 spans | 7:29.09, 7:32.11, 7:35.07 | sheet_012 | combines SIG-VX-5 and SIG-EW-6 |
| NEW-portrait-roundel-tags | circular portraits + mustard name tag + red year tag; panned row | 7 | 0:46.01–0:53, 6:55.07 | 0m49s23 | new (PD-6 carousel) |
| NEW-paper-timeline-scroll | white-band timeline, period bands, event markers, camera scroll | 2 | 5:31.00, 5:53.05–6:17 | 5m42s18 | PD-11 is dark and static |
| NEW-print-slide-over | print rises over the chart, name super | 1 | 5:26.22 | strip_07834 | new |
| NEW-flat-icon-illustration | ballot box in a disc, vote tug-bar, winner figure, person pictogram | 3 | 0:21.08, 0:39.02, 4:58.02 | 0m25s07 | new |
| NEW-host-sponsor-read-credits | webcam host + credits column + sponsor logo | 1 | 7:55.04 | 8m05s04 | new |
| NEW-alternating-corner-bug | channel logo ↔ "Presented by" sponsor | ≈ 7 switches | whole video | 0m20s15 | new |
| R-DataChart / PD-8 / K-BarChart | stacked and state bars, registration bars, Gallup lines (dots then strokes) | 9 | 0:54.02, 2:27.10, 5:45.14, 6:44.22, 7:03.00 | 3m27s19 | light paper, serif, party colours |
| K-DotField / K-DotPop | House 435 / Senate 100, electoral-vote columns, 1969 House vote | 4 | 1:13, 2:48.22, 6:06.07 | xsheet_shot16 | — |
| SIG-VX-4 / K-HandDrawnRing / SIG-PD-9 | vector ellipses, 6–16 f, on the stressed word | 6 | 0:09.08, 2:40.06, 3:38.20, 4:06.14, 7:21.10 | 4m08s04 | smooth stroke, no marker texture |
| K-SketchArrow | curved arrows with typeset labels | ≈ 6 | 1:52.00, 4:17.00, 4:42, 4:52, 5:50.22 | 1m52s15 | no handwriting |
| SIG-VX-5 / K-Highlighter | flat lemon sweep, 16 f | 1 | 6:22.17 | 6m27s20 | lemon, not mustard |
| R-QuoteCard / PD-3 | centred serif quote, em-dash attribution, source line | 2 (+1 note) | 6:17.07, 7:26.03, 5:57 | 6m27s20 | appears whole, no typing |
| PD-2 year odometer | year steps with the map | 2 | 3:41.21, 7:38.00 | xsheet_shots18-24 | beat-locked |
| PD-5 | archival colonial map, push/pan, yellow outlines | 1 | 4:30.03 | xsheet_shots18-24 | archival print |
| R-NameCardInterview / SIG-EW-9 | super on archival: white serif, sans tag, yellow rule | 1 | 7:11.04 | 7m13s03 | fade, no decode |
| R-EndCard / VX-8 | series lockup: on the grid (title), on black (end) | 2 | 1:08.09, 7:50.22 | 1m09s14 | type-on, no glitch |
| SIG-EW-2 (variant) | ghost-newsprint ground, but off-white and static | whole | — | 4m17s01 | white, no weave |
| SIG-VX-10 / SIG-PD-8 | 2D camera over one flat plane; cuts hidden in morphs and slides | ≈ 22 / ≈ 30 | §5, §6 | — | no desk objects |
| K-ColorFlash | non-swing states blink twice | 1 | 3:56.15 | sheet_007 | — |
| K-RackFocus / K-PullBack (src/transitions) | painting: blur → sharp → pull-out | 1 | 4:22.15 | sheet_007 | — |
| SIG-EW-12 (variant) | digital-silence holes + hard cue entries on cuts | 3 | 1:10.20, 2:25.08, 4:29.13 | av 064, 264 | no picture dip or thump |
| T-IC, T-DS, T-PCap, V-HC, V-MOV, T-FB, E-TB | see §6 | §6 | §6 | §6 | §6 |

## 9. What our framework would need to make this video
1. **A light "paper data" theme** (83 % of runtime):
   - tokens for an off-white ground with static ghost newsprint, party red/blue, swing orange, lemon highlighter and charcoal tiles;
   - a Scotch serif with old-style figures;
   - smooth on-ones motion with no grain and no 12 fps stepping. Today's recipes are Earworm-only.
2. **NEW-unit-grid-cartogram recipe** (0:31, 1:03–1:12, 2:18, 7:44): a fixed 538-cell US layout, stroke-on state borders, party fill, a threshold line, and a pull-back as a title ground.
3. **NEW-chart-morph-chain stage** (1:24–2:27, 2:27–3:41): views morph on phrase-onset events under a persistent title.
4. **US state geometry (public domain) + NEW-choropleth-us-map / NEW-bubble-map** (2:31, 3:41, 4:11, 7:21): per-state stagger, legend, and a flipbook snapped to the music pulse.
5. **NEW-state-badge-tile** with proportional sizing (1:24, 2:51, 3:58, 4:37, 6:29).
6. **NEW-two-tone-party-label:** box-wipe + type-on at −7 f (0:19, 0:24, 0:34, 3:29, 4:58).
7. **QuoteCard + NEW-karaoke-highlighter:** spans timed to the narrator's words (6:22, 7:29–7:36).
8. **NEW-tile-to-unit-dots:** a K-DotField stagger of ≈ 1 dot per frame with a tile cross-fade (1:30).
9. **NEW-paper-timeline-scroll:** bands, markers, camera scroll (5:31–6:17).
10. **Cold-open kit** (0:00–0:21): TV-frame montage, static flip, key-line caption box. News clips also need a fair-use path outside our PD-first sourcing.
11. **Portrait and print kit** (0:46, 5:26, 7:11): roundels with tags and a carousel pan; print slide-over; a yellow-rule super for archival.
12. **Audio profile** (1:10, 2:25, 4:29): a static bed ≈ 19 dB under the voice with no ride; a cue per section; silence holes with a hard entry or a 4–5 f pre-lap on the cut; no transition SFX.
13. **Script profile "data argument":** ≈ 150 wpm, 75 % narration, quotes read on cards, sources on screen. This exceeds doc 13's argument caps of 115 wpm and 55 %.
14. **Branding templates (own names only)** (1:08, 7:50, 7:55): series title and end cards, an alternating corner bug, and a credits column beside a host.

## 10. Evidence index
All files are in `analysis/stills/vox_electoral/` unless noted.

| file | time | what it shows |
|---|---|---|
| 0m00s08_tv-frame-newsclip.jpg | 0:00.08 | clip in a TV bezel, corner bug |
| 0m10s17_news-screen-yellow-ring.jpg | 0:10.17 | news screen push-in with a yellow ring |
| 0m17s00_vox-caption-box-on-clip.jpg | 0:17.00 | key-line caption box |
| 0m20s15_swing-states-label.jpg | 0:20.15 | two-tone label on paper |
| 0m25s07_ballot-bar-popular-vote.jpg | 0:25.07 | flat icons, vote bar, label |
| 0m49s23_portrait-row-name-tags.jpg | 0:49.23 | portrait roundels with tags |
| 1m09s14_title-card-on-grid.jpg | 1:09.14 | title lockup on the filled grid |
| 1m52s15_texas-vermont-hand-arrows.jpg | 1:52.15 | unit squares, numbers, arrows |
| 3m27s19_state-bars-campaign-events.jpg | 3:27.19 | badges, bars, campaign events |
| 4m08s04_influence-squares-rings.jpg | 4:08.04 | proportional tiles, rings |
| 4m17s01_spending-map-arrow.jpg | 4:17.01 | bubble map, "$127 million" |
| 5m42s18_timeline-bands.jpg | 5:42.18 | timeline period bands |
| 6m27s20_quote-card-highlight.jpg | 6:27.20 | quote card, lemon highlight |
| 7m13s03_warren-lower-third.jpg | 7:13.03 | archival clip with name super |
| 8m05s04_host-sponsor-credits.jpg (+ _credits-crop) | 8:05.04 | host read, credits, music list |
| typecrops_composite.jpg | various | typography crops of the stills |
| strip_00000-00047_coldopen-static.png | 0:00–0:01.23 | static flips |
| strip_00458-00505_swing-label-build.png | 0:19.03–0:21.02 | label type-on; persistent label over the dissolve |
| strip_00876-00923_elector-grid-states.png | 0:36.13–0:38.12 | state borders stroke on |
| strip_01636-01683_title-card-build.png | 1:08.06–1:10.05 | grid fill + pull-back + logo + type-on |
| strip_02152-02199_tile-to-dots.png | 1:29.18–1:31.17 | tile → 36 dots |
| strip_03626-03673_bars-to-map.png | 2:31.06–2:33.05 | chart slide swap |
| strip_03995-04042_winner-take-all.png | 2:46.15–2:48.14 | winner bars squash |
| strip_07834-07881_portrait-card-slide.png | 5:26.18–5:28.17 | print slide-over |
| xsheet_shot16_1m12-2m27.jpg / xsheet_shots18-24_3m42-5m27.jpg | 1:13–2:25 / 3:42–5:22 | settled states inside the long stages |
| analysis/sheets/vox_electoral/sheet_001–013.png | whole | sparse keyframes |
| analysis/av/vox_electoral_064.00-072.00.png / _264.00-272.00.png | 1:04–1:12 / 4:24–4:32 | swell → silence → hard cue; turn hole + pre-lap hit |
