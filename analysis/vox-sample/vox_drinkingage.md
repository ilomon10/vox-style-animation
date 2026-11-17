# Why the US drinking age is 21 — `vox_drinkingage`
YouTube 9aWYJugVTs4 · Vox Almanac (host-led history explainer by Phil Edwards, "road trip" edition) · uploaded 2019-08-23 · 9:29.18 (569.9 s, 13,662 f) · 1920×1080 @ 23.976 (24000/1001) · captions manual

## 0. Inputs and reliability
- **Read:**
  - all precomputed inputs (info.json, manual VTT, whisper files, rhythm, features, sync.json, palette, shot table, metrics);
  - 34 sheets plus 6 re-views (40 views), 15 full-res stills, 5 strips. The strips are saved in `analysis/stills/vox_drinkingage/`, my only image folder.
- **Extra measurements:** frame differencing (drawing rate); mid/side energy of the mix (under `flock`); band energy at visual events; tesseract OCR of piped frames (tags, labels, credits; nothing saved).
- **Speaker split corrected.** sync.json gives 1,216 narrator / 160 other words. The captions quote every archival line, which gives **819 narrator / 557 archival** words. Its "archival voice" class (47 s) is far too small: I measure ≈ 175 s.
- **Transcript fixes:**
  - "Provision" → Prohibition; "Alona 20" → alone at 20; "here comes the present" → President;
  - "Candice Candie Leitner" → Candace "Candy" Lightner; "Ora Dell" → Oradell; "kachau" → Ka-chow;
  - whisper drops "The problem:" (4:30) and two lines under music at 6:31–6:38.
- **Shot detector:** it misses 11 cuts inside pillarboxed archival (shots 69, 92, 134, 147) and counts 5 series-card swaps and 6 static/glitch frames as cuts. Corrected: 168 editorial cuts (the same total by chance).
- **Not used as-is:**
  - the cadence column (rechecked, §5);
  - rhythm.json segments A–D: these are processing chunks, not cues; cue BPMs come from the tempo map (confidence 0.01–0.76, so ≈);
  - SFX classes: timing checked, identity unverified.
- **Not measured:** instrumentation (not judged by ear).

## 1. Summary (5–10 bullets)
- **Host-led, archive-told.** Phil Edwards is on camera only for the thesis (0:33–0:44) and the outro (8:46–9:18). Elsewhere his casual VO ("in a weird way", "I'll show you") and his **hands colouring a real wall map** carry the film.
- **Archival voices argue.** The narrator speaks 42.9 % of the runtime and archival speech fills 30.8 % (Earworm: 45 % / 20–22 %). Reagan speaks ≈ 2¼ min in bites of up to 23 s, **uncaptioned**, often pillarboxed (≈ 22 % of runtime) with VHS damage.
- **A 31-s cold open with no narration** (MJ at the White House, 1984), paid off at 8:12.
- **History tools:** VHS-spine year tags (8); the hand-coloured map as the timeline (1969 → 1975 → 1983 → today); documents as proof, with yellow highlighter. No timeline graphic, chart or counter.
- **The policy argument is on screen:**
  - Reagan's speech is split into PROBLEM / THEORY / DILEMMA / SOLUTION on a 2×2 "monitor wall";
  - the mechanism (highway money) lands as a turn, with a silence hole and a beat-cut montage;
  - then the court test and "Did it work?" (both sides, as papers).
- **Look vs Earworm:**
  - full-bleed colour archival instead of B&W torn cut-outs on black;
  - yellow #FAFE0A + cyan #159EC8 instead of periwinkle;
  - a white heavy grotesque with per-letter mixed weights instead of condensed caps;
  - red/coral hand-drawn marks.
- **Motion:** graphics and still-image moves on twos, with ease-out; static/VHS glitch cuts; three montages cut on 16th notes.
- **Sound:** library beds under ≈ 91 % of the runtime at a constant low level (speech ≈ 13 dB above). They are pulled out for key archival bites and the "Did it work?" evidence, and silences mark the turns and the outro.
- **Series wrapper:** an Almanac collage card + "Road trip" edition label after the thesis; an outro with viewer comments and the next theme; credits beside the host. Chapters exist only as metadata.

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
|---|---|---|---|---|
| cold-open/hook | 0:00.00–0:30.21 | 5.4 | archival only: MJ at the White House, 1984; Reagan's "PYTs" joke | K-Pillarbox, NEW-name-label-arrow, NEW-tv-static-flip, NEW-vhs-spine-date-tag |
| question/thesis | 0:30.21–0:44.05 | 2.3 | "connects, in a weird way, to the reason you have to be 21… I'll show you" | NEW-host-on-camera-studio, NEW-beat-locked-montage-burst |
| context | 0:44.05–1:11.02 | 4.7 | the 1975 map, category by category | NEW-hands-on-wall-map, NEW-choropleth-us-map, NEW-selective-colour-isolation |
| question/thesis | 1:11.02–1:34.07 | 4.1 | "today it's all 21. How did that change happen?… a story… about roads" | V-RET, NEW-document-text-overprint, NEW-music-reset-hole |
| title/series-intro | 1:34.07–1:40.00 | 1.0 | Almanac card → "Road trip" | NEW-ransom-collage-series-card |
| context | 1:40.00–2:26.15 | 8.2 | Prohibition → late-60s map → 26th Amendment → "drafted… vote… drink" | K-CameraRig, SIG-VX-5, NEW-scatter-letter-type-on |
| turn | 2:26.15–2:34.09 | 1.4 | "that map was short-lived… for one reason" (the map is wiped) | NEW-hands-on-wall-map, NEW-archival-prelap |
| evidence | 2:34.09–3:28.13 | 9.5 | Reagan's 1982 death toll; blame on the 18-states; 1983 map; MJ's PSA | dry archival bite, NEW-vhs-spine-date-tag |
| context | 3:28.13–4:29.23 | 10.8 | Reagan's anti-government quip vs a federal role; MADD, RID, Lightner | NEW-uncaptioned-archival-speech, NEW-paper-card-lower-third, ED-2 |
| evidence | 4:29.23–5:31.20 | 10.9 | "The problem: / The theory: / The dilemma:" in Reagan's words | NEW-monitor-wall-grid, SIG-EW-7 |
| turn | 5:31.20–5:53.17 | 3.8 | "This is where the roads come in": the 1956 Act, federal dollars | NEW-music-reset-hole, NEW-beat-locked-montage-burst |
| evidence | 5:53.17–6:51.01 | 10.1 | SOLUTION: withhold 5 % of highway funds; the law passes | NEW-monitor-wall-grid, NEW-tv-static-flip, T-SP |
| evidence | 6:51.01–7:38.06 | 8.3 | states comply; Louisiana; *South Dakota v. Dole*, 7–2 | SIG-ED-5, R-KaraokeQuote, NEW-document-text-overprint |
| turn | 7:38.06–8:08.19 | 5.4 | "Did it work?" studies vs Cato; Reagan argues both sides | SIG-VX-5, NEW-monitor-wall-grid (1×2) |
| payoff | 8:08.19–8:41.11 | 5.7 | "a strange pairing… the ones that run through them" | archival callback, NEW-hands-on-wall-map, NEW-fullframe-archival-broll |
| ending | 8:41.11–8:46.22 | 1.0 | black; the music decays to silence | E-CB |
| cta/membership/sponsor | 8:46.22–9:09.20 | 4.0 | "that's it for this road trip edition"; viewer comments | NEW-host-outro-comments |
| credits | 9:09.20–9:29.18 | 3.5 | next-edition teaser | NEW-host-sponsor-read-credits |

**Shape of the arc:**
- The thesis is stated twice before the series card.
- The turns sit at 26 %, 58 % (the mechanism) and 80 %; the payoff starts at 86 %.
- There is no expert beat: archival Reagan fills that slot.

### 2.2 Claim → visual device map
| claim type | example (time, words) | device ID(s) | asset type | audio treatment |
|---|---|---|---|---|
| date | 0:14.10 "1984" | NEW-vhs-spine-date-tag (0 f) | archival news | riser → 6-f drop-out |
| place | 6:54.11 "Louisiana" | NEW-hands-on-wall-map (coloured as named) | live action | bed |
| person-historical | 0:06.12 "…Ronald Wilson Reagan" | NEW-name-label-arrow (−7 f) | archival | bed −13 dB |
| person-historical | 4:07.22 "Candy Lightner founded MADD" | NEW-paper-card-lower-third (+9 f) | B&W photo | bed |
| fact | 2:07.05 "the 26th Amendment changed the dynamic" | SIG-VX-5 on "eighteen years of age" (+3 f) | scan | bed |
| list | 0:51–1:09 "blue… 18; green… 19…" | NEW-selective-colour-isolation + a legend chip per item | wall map | bed |
| concept | 4:30–5:28 problem / theory / dilemma | NEW-monitor-wall-grid | archival speech | bed |
| causal link | 2:22 "drafted… and vote, so… drink" | NEW-scatter-letter-type-on → R-KeywordCut "vote" (+2 f) | B&W photos | bed |
| number | 2:36 "Nearly 50,000 people were killed" | NEW-uncaptioned-archival-speech, no graphic | archival | music out |
| number | 7:23 "ruled 7–2" | the two dissenters tinted red | photo + syllabus | bed |
| comparison | 7:46.09 Cato vs "case closed" | two papers + SIG-VX-5 | documents | dry |
| quote | 7:10.19 oral argument | R-KaraokeQuote + SIG-EW-10 | photo + audio | bed |
| question | 7:37 "Did it work?" | cut to the study | document | music out (26 f) |
| payoff | 8:28 "…the ones that run through them" | hands draw interstates → 1958 map → aerial | live + archival | music alone for 7 s |

Counts per claim type → device (≈ 86 claim instances):

| claim type | n | devices |
|---|---|---|
| date | 12 | VHS tag 8; document date line 2; spoken only 2 |
| place | 6 | wall map 4; signage in the footage 2 |
| person-historical | 8 | name label + arrow 3; paper lower third 1; unlabelled footage 4 |
| person-expert | 0 | — |
| fact | 14 | archival photo/footage 7; document + highlighter 4; wall map 3 |
| list | 4 | legend chips; yellow labels; grid; preview montage |
| concept | 3 | grid; map + hands; overprint |
| causal link | 5 | kinetic type 1; wall map 2; map print 2 |
| number | 6 | archival speech 4; tint 1; kinetic "21+" 1; **no charts** |
| comparison | 4 | wall map 2; papers 1; 1×2 cells 1 |
| quote | 15 | uncaptioned archival 12; captioned 1; highlighted text 2 |
| question | 6 | wall map 3; grid, archival, document 1 each |
| payoff | 2 | archival callback; hands on the map → aerial |
| ending | 1 | black + silence |

### 2.3 Script patterns
- **Pace.**
  - Narrator: 819 words = 86 wpm of runtime; 3.35 words/s while speaking (201 wpm).
  - All speech: 145 wpm.
  - Shares of runtime: narration 42.9 %, archival speech 30.8 %, no speech ≈ 26 %.
- **Narrator wpm per beat:** hook 0 · thesis 176 · maps 142–145 · context 79–103 · grid 14 · roads turn 135 · solution 23 · court 119 · payoff 121 · outro 191.
- **Sentences:** 62; median 10 words (mean 13.2; range 1–39, whisper punctuation).
- **Pauses:** 0.30 s at commas, 0.66 s at sentence ends; phrase gaps median 0.54 s. The longest holds are 9.7 s after "roads." and 5.2 s after "come in."
- **Questions (6), each answered within ≈ 2 s:** "How did that change happen?" (1:13); "Did it work?" (7:37); two "see…?" on the map; "Michael Jackson?"; "And here?".
- **Person and tense:** "I" and "you"; map imperatives ("Now look at the map today"); past tense for history, present for the map; hedges "in a weird way" ×2 and "kind of" ×2.
- **Signposts:** "But… ultimately a story… about roads." · "But tactics weren't limited to PR." · "The problem: / The theory: / The dilemma:" · "This is where the roads come in." · "Did it work?" · "But beyond the politics, there's a bigger message."
- **Sources:**
  - Archival speakers are set up before they speak ("President Reagan is famous for saying…") or named after ("That's Candy Lightner, celebrating").
  - Research is named by type, not author ("Most studies of studies…", "Skeptics, like people from the libertarian Cato Institute…"), while the paper is on screen.
  - No source lines.
- **Opening formula:** 31 s of archival scene, then "So this is not just a footnote in history… I'll show you."
- **Closing formula:** a double-meaning line ("not just the lines on states' edges… the ones that run through them") → black → sign-off.
- **Sponsor/CTA:** none in picture.

### 2.4 Format specifics
- **Host on camera:** ≈ 42 s (7 %), voice only elsewhere:
  - 8 s to camera in a studio (0:33.18);
  - a 2.3-s desk ritual: he folds down a flag-painted table and throws a wall map onto it;
  - ≈ 10 shots of his hands on the map;
  - 32 s of outro.
- **Viewer question:** no. The outro reads three comments on the previous edition (Route 66), with app comment panels and a *Cars* clip.
- **Series branding:** the Almanac card at 1:34.07, after the thesis and the preview, with the edition theme; a sign-off; a next-theme teaser.
- **Chapters:** 8, metadata only; 6 of 7 start ≤ 0.25 s before a hard cut. The grid labels work as in-picture section cards.
- **Interviews, experts, reporting trips:** none. Authority comes from archival officials and documents.

## 3. Shot economy
- **Shots:**
  - corrected 169 shots / 168 cuts (the detector also reports 168 cuts, see §0);
  - mean 3.37 s, median 1.96 s (detector 1.50 s), p10 0.21 s, p90 9.05 s;
  - 37 shots < 0.5 s, 11 shots > 10 s;
  - ≈ 50 scenes (mean ≈ 11 s); 17.7 cuts/min.
- **Cuts per minute per beat:** hook 17.5 · thesis 36.1 · 1975 map 24.5 · preview 33.6 · series 10.5 (+ 5 swaps) · context 18.0 · turn 15.5 · evidence 26.6 · context 10.7 · grid 8.7 · roads turn **43.9** · solution 14.6 · court 11.4 · did-it-work 11.8 · payoff 22.0 · outro 15.7 · credits 6.0.
- **Shot types (% of runtime):** archival-video 43.5 · map-2d 21.5 (wall map ≈ 17) · archival-photo 11.0 · mixed 8.8 (monitor wall, outro) · host-on-camera 5.3 · document 5.0 · type-card 2.6 · black 1.0 · collage 0.7 · screen-capture 0.6.
- **Longest holds:** 23.4 s Reagan (6:08.03) · 17.9 s Court photo (7:21.09) · 15.4 s wall map (2:50) · 14.3 s Lightner (4:06.06) · 12.6 s grid (4:57.15). All but the map carry archival speech.
- **How set-ups reveal their elements:**
  - *Monitor wall:*
    1. Dimmed cells pop in with static, 6 f apart (4:29.23).
    2. The active cell brightens and its label turns yellow as the speaker starts (4:31.11).
    3. A hard cut goes into the cell (≈ 2.4×) and back.
    4. The section's summary is written in, with a red pencil underline, **when the narrator names the next section** (4:42.04, 5:05.19).
  - *Wall map:*
    1. One category is isolated: the others desaturate over 25 f, starting 11 f before the colour word, and a torn legend chip appears.
    2. The next category comes on a hard cut.
    3. The colours return on "It's a complicated map" (1:09.12).
  - *Lightner:* B&W pull-out (×0.74, 11.5 s) → paper card → torn clipping → highlighter on each phrase as it is spoken.

## 4. Look
### 4.1 Colour
- **Palette (palette.json, % of pixels):** #090A07 27.6 · #6C6F6D 12.1 · #2B2620 10.7 · #EAE2C9 10.4 · #4D483B 9.3 · #816940 9.3 · #A69F98 6.6 · #5D2F17 5.8 · #3C3C51 4.9 · #0893CB 1.8 · #9287C7 1.1 · #F9ED05 0.4.
- **Grounds:** mostly none (full-bleed footage). Designed grounds:
  - monitor wall #0E0E0E with dark-red hairlines;
  - series cyan #159EC8;
  - cream scans #DED5B7;
  - black #000 for the bars, the ending and the credits.
- **Accents:**
  - yellow #FAFE0A (frames, edition box, active labels): > 0.5 % of pixels in 13.6 % of frames;
  - highlighter #E4DA0F; coral arrows #EA6A6C; pencil red #90352C;
  - paper card #FDF0AC with role red #9F3531;
  - dissent tint ≈ #490A11; credit names #9DC6D0.
- **Grading:** none applied across the board. Colour footage stays VHS-warm (sat 0.3–0.5), 1950s film stays orange, photos stay B&W (24 % of frames are near-B&W).

### 4.2 Typography
- **Families:**
  - one white heavy grotesque, not condensed, letters randomly Regular/Black (NEW-mixed-weight-type); looks like Vox's 2019 house sans (unconfirmed); free: Archivo variable 400/900;
  - typewriter mono for the series tagline (≈ Courier Prime);
  - serif only in credit roles (≈ Source Serif 4) and inside real documents;
  - grey micro labels rotated 90°, ≈ 1.3 % of H ("MONITOR 01", "ORADELL, NJ").
- **Sizes (% of frame height):** "BUT" 25.6 · tag digits 12 (box 18, tracking ≈ 0.5 em) · MADD/RID 6.5 · name label ≈ 6 · kinetic phrases and captions ≈ 5–5.5 · lower third 4.2/2.8 · grid labels 3.7 (≈ 7.4 in a cell) · credits 2.6.
- **Case:** caps for names and categories; sentence case for keywords and summaries.
- **Colour:** white; yellow when active.
- **Placement:** beside the subject, centred, or in the grid gutters. Archival speech is not subtitled, except the oral argument.

### 4.3 Layout & composition
- **Canvas:** 16:9. 4:3 archival is **pillarboxed** with black bars (content x ≈ 195–1719) for ≈ 123 s (22 %). The outro host sits in a thin cyan-bordered window on black.
- **Monitor wall:** 2×2 cells ≈ 605×465 px, gutters ≈ 120/40 px, labels at each cell's foot, summaries over a cell corner; a 1×2 variant.
- **Other placements:** lower third at x 876–1786, y 630–870; date tags centred on the subject.
- **Depth:** flat. Layering only in the series collage and the clipping; real depth only from the hands.

### 4.4 Textures & finish
- **VHS finish on archival:** scanlines, dropout specks, RGB fringing (0:06–0:19, 5:14).
- **Paper and hand-made marks:** torn white legend chips, a mottled paper card, torn newsprint, cream scans; real marker scribbles; drawn red pencil.
- **None seen:** added grain on the graphics, vignette, light leaks.

### 4.5 Branding
- **Vox bug:** top right, except on the series card, the edition label and the credits.
- **Labels:** 3 name labels with arrows, 1 paper lower third, yellow labels. No source lines (1 photo credit).
- **Series marks:** the Almanac card + "Road trip" box; a credits column beside the host, then credits on black. The credits list archives (Library of Congress, Getty, the Reagan and Nixon libraries, National Archives), five library tracks and a riser.
- **End card:** none in picture.

## 5. Motion language
- **Drawing rate (frame differencing):**
  - Every 2nd frame (12 drawings/s on 23.976): graphics, highlighters, still and document moves.
  - On ones: dissolves, the wall-map and closing-map moves, all footage.
- **Camera:** ≈ 40 moves (push-in ≈ 12, pull-out ≈ 16, pan/scroll ≈ 10), no crash zooms.
  - Examples: Prohibition pull-out ×0.35 in 4.4 s; 1975 map push ×1.98 in 7.8 s; *Dole* scroll 2,633 px in 3.9 s; Court push ×1.81 in 17 s.
  - Easing: in 19 of 27 still/map moves the speed peaks in the first quarter (ease-out). That is the opposite of our stop-dead SnapPush.
- **Entrances:**
  - tag: the box glitches in (14 f), then the digits slide in (12 f);
  - name label: wipes in (≈ 10 f), then the arrow draws on (16 f);
  - lower third: the card wipes in (8 f);
  - kinetic phrase: scatter type-on (16 f);
  - grid cells: pop with static;
  - highlighter: 14–22 f, fast start;
  - "BUT": cut in.
- **Exits:** none animated.
- **Annotation:** coral arrows 3, pencil underlines/rings 4, highlighter spans 5, legend chips 5 + 2 panels, yellow labels 4.
- **Maps:** physical colouring, wiping and tracing; digital isolation, legends and tags; archival prints panned. No zooms to places, no routes.
- **Charts, 3D:** none.
- **Hand-made:** the substitution-animated series card, the desk ritual, the torn-paper reveal (T-SP), real markers.

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |
|---|---|---|---|
| V-HC | ≈ 110 | throughout | same |
| V-MOV | ≈ 35 | 1:40.00, 4:06.06, 7:21.09 | moves on twos, ease-out |
| V-RET | 7 | 4:39.15, 4:57.15, 5:23.01, 1:11.02 | new element = summary, lit cell or new colours |
| T-PCap (grid ↔ cell) | 10 | 4:34.14, 4:50.02, 5:53.17 | the label survives the cut, rescaled |
| NEW-tv-static-flip | 7 | 0:13.18, 2:42.15, 4:29.23, 5:53.22, 8:36.07 | 2–6 f static, with a drop-out or a zap (vox_electoral's is silent) |
| T-DS (inside a shot) | ≈ 9 | 0:51.17, 1:09.12, 7:21.09 | isolation and overprint dissolves, 15–25 f on ones |
| NEW-beat-locked-montage-burst | 3 | 0:41.19, 1:34.07, 5:31.20 | cuts on 16th notes (±1 f); doc 13 forbids beat cuts |
| NEW-archival-prelap | 3 | 0:30.21, 2:30.09, 7:07 | J/L-cuts with speech; ours pre-laps music only |
| T-SP | 1 | 6:06.01–6:07.23 | torn edges rise from black, no white border |
| E-CB (+ NEW-music-reset-hole) | 1 | 8:41.11 | hard cut to 5.4 s black; X-Drop fades over 27 f |
| panel wipe | 1 | 9:09.20 | credits column wipes over the host in 9 f |

## 7. Audio
### 7.1 Music
Five library tracks and one riser are credited (Spectral Shift, Hidden Network, Bold Action, Neon Nighttime, Beyond the Fourth Dimension; RM Riser – Booming 602). The voices are mono and the music stereo, so the side channel maps the music: it is present in **90.8 %** of half-second windows.

| t0–t1 | style/instrumentation | BPM | mood/role | entry/exit (on a beat? pre-lap? hard?) | ducking under the voice (dB) |
|---|---|---|---|---|---|
| 0:00.02–0:13.18 | intro, then a bed → broadband riser (+15 dB over 2.4 s) | ≈ 122 | cold open | hard in; dead stop into a 6-f drop-out | 13 |
| 0:19.05–1:29.12 | main groove (conf 0.76) | 91 | story bed to the preview | change-in under speech; hard stop on the highway cut, 1.1 s before "roads" | 0.6 |
| 1:31.00–1:43.01 | title sting | 91 | series card | hard in, 2 f after "roads." | music alone |
| 1:43–1:53 | sparse stabs | — | Prohibition | — | VO in the clear |
| 1:53.06–2:34.00 | context bed | ≈ 84 or 126 | context | 8-f fade in | 2.4 |
| 2:34–2:47 | **out** | — | Reagan's statistics | 25-f fade | — |
| 2:47.06–5:31.09 | three beds (≈ 110, 85, 120; low conf) | — | exposition, argument underscore | hard in and changes; 33-f fade into an 11-f hole | 1.5–7.5 |
| 5:31.21–7:38.10 | montage cue (16th-note hats), then ≈ 2 min underscore | 95 | summit → underscore | hard in 1 f after the cut; 26-f fade at "Did it work?" | 1.5 |
| 7:38–8:03 | **dry** (one stab, 7:53.11) | — | evidence in the clear | — | — |
| 8:03.18–8:41.11 | payoff bed; music alone at the end | ≈ 80–100 | payoff | hard in; the bass drops on the cut to black, then a 35-f decay to silence | 2.0 |
| 8:47.03–9:28.13 | outro bed | ≈ 95 | outro, credits | hard in 5 f after the host cut; 27-f fade + 30 f of silence | 20.3 |

Overall: 62 auto boundaries, ≈ 15 real cues. Pooled duck 2.4 dB, phrase-locked duck 0.7 dB: the bed is left alone, not ridden.

### 7.2 SFX inventory
| type | count | example timestamps | what it accompanies |
|---|---|---|---|
| riser (credited; broadband +15 dB, no speech) | 1 | 0:11.06–0:13.17 | into the static cut |
| audio drop-out (6 f, −60 dB high band) | 1 | 0:13.18 | the static frames |
| static zaps (high-band bursts, 3–5 f; identity unverified) | 4 | 4:30.01, 4:30.10, 5:29.11, 8:36.10 | grid cells; grid switch-off; glitch into the aerial |
| glitch burst (unverified; overlaps Reagan's "decided") | 1 | 5:53.22 | SOLUTION glitch |
| stabs in dry stretches (SFX or music?) | ≈ 4 | 1:43–1:53, 7:53.11 | Prohibition; the 1986 tag |
| production sound (unverified) | 1 passage | 0:41.19 | desk ritual |
| archival sound | — | 0:00–0:30, 3:25, 9:02 | crowd, PSA, *Cars* clip |

### 7.3 Voice
- **VO:** 3.35 words/s; pauses 0.30 / 0.54 / 0.66 s (comma / phrase / sentence). It is mono, dry and close (side −109 dB).
- **Archival speech:** 30.8 % of the runtime. It keeps its PA, room and tape noise; no phone EQ.

### 7.4 Sync
- **Cuts vs words:**
  - word onsets: 30.7 % within ±2 f vs 36.9 % by chance (p 0.95), so cuts do not follow words;
  - narrator phrases: 20.7 % of cuts lead one by 0–12 f vs 8.8 % (p 0.002), median lead 2.3 f;
  - audio onsets: 42.1 % within ±3 f vs 27.9 % (p 0.002).
- **Cuts vs music:**
  - beats: 14.3 % within ±2 f vs ≈ 12 % (p 0.22); downbeats 5.7 % vs 2.9 % (p 0.04);
  - beat-locked only in the three bursts: 9 of 10 road-montage cuts fall within ±1 f of a 16th-note onset.
- **Text reveal vs the spoken word (frames):**
  - date tags 0 (1984, 1975, 1986), +6 (1987), +19 (1956);
  - name label −7; lower third +9; labels +8 / −15 / −3;
  - scatter type-on +6; "vote" +2;
  - highlighters +3, +5, −3, and complete +2 on "case";
  - captions +1 per word;
  - colour isolation −11.

### 7.5 Silence and structural sound
- **0:13.18:** riser → 6-f digital drop-out on the static → the anchor.
- **1:29.12–1:31.00:** the music stops on the highway cut; "…about… roads." plays dry; the sting hits 2 f after the word.
- **2:34–2:47 and 7:38–8:03:** music out for the key statistics and the evidence.
- **5:31.09:** an 11-f digital hole → montage cue (+1 f after the cut).
- **8:41.11:** black; the bass drops, a 35-f decay, 26 f of digital silence, then the host.
- There is no dip-to-black act break.

## 8. Device catalogue
Stills are in `analysis/stills/vox_drinkingage/` (prefixes below).

| ID | what this video does | count | timestamps | stills | differs from our spec? |
|---|---|---|---|---|---|
| NEW-monitor-wall-grid | 2×2/1×2 wall of dimmed 4:3 "monitors"; active cell lit + yellow label; cuts into a cell and back; summaries written in at the next section | 2 set-ups, 11 cell cuts | 4:29.23–5:31.20, 5:51.09, 7:57.12 | 5m27s_f7851, strip_06470 | new |
| NEW-uncaptioned-archival-speech | long archival bites carry the argument, uncaptioned, over a bed | 14 bites, ≈ 175 s | 2:36, 3:30, 4:31, 6:08 | 4m05s_f5888 | doc 13 typesets every archival word |
| K-Pillarbox | 4:3 archival with black bars | 9 runs, ≈ 123 s | 0:00, 3:19, 6:35 | 4m05s_f5888 | Earworm is always full-bleed |
| NEW-hands-on-wall-map | the host's hands colour, wipe and trace on a real laminated map | ≈ 10 shots | 0:41.19, 1:11.02, 2:28.20, 6:54.11, 8:31.13 | 0m54s_f1299 | no live action in our kit |
| NEW-choropleth-us-map | the wall map as data: colour categories, legend chips or a 5-row panel, year tag | 5 maps | 0:48.10, 1:58.00, 3:08.02 | 0m54s_f1299 | hand-made fills |
| NEW-selective-colour-isolation | all but one category desaturates (25 f); dissenters tinted red | 7 | 0:51.17, 1:00.00, 7:21.09 | 0m54s_f1299, 7m33s_f10865 | nearest SIG-DC-5 |
| NEW-vhs-spine-date-tag | year on a VHS-spine label; box glitch 14 f, digits slide 12 f on twos, on the word | 8 | 0:13.20, 0:48.10, 1:58.00, 2:36.08, 5:38.12, 7:04.03, 7:53.11 | 0m15s_f379, strip_00330 | nearest PD-2 / R-ColdOpenYear |
| NEW-mixed-weight-type | all designed type: white grotesque, letters randomly Regular/Black | ≈ 40 events | throughout | 0m08s_f200, 2m23s_f3452 | ours: condensed, uniform |
| NEW-tv-static-flip | 2–6 f static/VHS noise as cuts or punch-ins, with sound | 7 | 0:13.18, 2:42.15, 5:53.22, 8:36.07 | strip_00330 | nearest X-GlitchCut (ending only) |
| NEW-vhs-artifact-finish | scanlines, dropouts, RGB fringe on archival | 3 passages | 0:06–0:19, 5:14 | 0m15s_f379, 5m15s_f7556 | ours: clean grain |
| NEW-fullframe-archival-broll | 1950s colour road films and aerials | ≈ 25 shots | 1:29.12, 5:31.20, 8:36.13 | — | ours: B&W cut-outs |
| K-CameraRig on full-bleed photos | borderless B&W photos, ease-out moves on twos | ≈ 12 | 1:40.00, 2:22.04, 4:06.06 | 4m10s_f5999 | ours: torn borders, stop-dead |
| NEW-name-label-arrow | 3-line white caps label + coral arrow drawn on in 16 f | 3 | 0:06.12, 0:10.19 (OCR), 6:33.11 | 0m08s_f200, strip_00156 | nearest K-AnnotationLabel + K-SketchArrow |
| NEW-paper-card-lower-third | pale-yellow card, black name, red role, tricolour stripe; 8-f wipe | 1 | 4:07.22 | 4m10s_f5999 | ours: decode card |
| yellow category labels | "MADD", "RID", wide-tracked caps over footage | 4 | 3:59.21, 4:02.05 | 4m05s_f5888 | nearest K-LabelStrip |
| SIG-VX-5 / VX-5 / R-DocumentHighlight | yellow swipes on scans and newsprint, 14–22 f on twos, on the phrase | 5 | 2:07.05, 4:17.06, 7:39.14 | 2m09s_f3097, 4m19s_f6234 | ours: Earworm-styled |
| ED-2 | torn clipping beside a photo | 1 | 4:17 | 4m19s_f6234 | no date tag |
| SIG-ED-5 | typeset NYT headline card on a faded map | 1 | 6:52.17 | sheet_026 | not a scan |
| NEW-document-text-overprint | document text dissolved over a photo | 2 | 1:19, 7:21.09 | 7m33s_f10865 | new |
| R-KaraokeQuote + SIG-EW-6 + SIG-EW-10 | oral-argument words on their onsets (+1 f), staggered, tick waveform | 1 | 7:10.19 | 7m19s_f10547 | ours: caps, no waveform |
| SIG-EW-7 | giant "BUT" over a dimmed cell | 1 | 5:14.11 | 5m15s_f7556 | no convergence |
| NEW-scatter-letter-type-on | letters appear in random order at their final places, on twos | 1 | 2:22.14 | strip_03409 | K-DecodeNameCard scrambles |
| R-KeywordCut (variant) | "vote" on the cut; "Withhold highway funds" | 2 | 2:24.00, 5:56.09 | — | lower case, no photo slam |
| SIG-VX-4 / K-HandDrawnRing | red pencil underline and rings | 4 | 2:23, 4:39.15, 5:23.01 | 5m27s_f7851 | thinner |
| NEW-ransom-collage-series-card | cyan, yellow frame, wood-type letters and objects swapped on 16ths → "Road trip" box | 1 | 1:34.07 | 1m34s_f2267, 1m39s_f2390, strip_02252 | K-SeriesCard is a glitch build |
| NEW-beat-locked-montage-burst | 2–7 s bursts cut on 16th notes | 3 | 0:41.19, 1:34.07, 5:31.20 | strip_02252 | doc 13 forbids it |
| NEW-music-reset-hole | the music stops 6–36 f at a joint; the picture keeps cutting | 3 | 0:13.18, 1:29.12, 5:31.09 | — | ours dips the picture too |
| NEW-archival-prelap | speech starts under the previous picture | 3 | 0:30.21, 2:30.09, 7:07 | — | ours: music only |
| T-SP | torn-edged photos rise from black | 1 | 6:06.01 | sheet_025 | no white border |
| E-CB (X-Drop variant) | 5.4 s of black, decay to silence, hard cut to the host | 1 | 8:41.11 | sheet_032 | X-Drop fades |
| V-RET, V-MOV, T-PCap, T-DS | see §6 | 7, 35, 10, 9 | §6 | — | — |
| NEW-host-on-camera-studio | host to camera, static medium shot | 2 | 0:33.18, 8:46.22 | sheet_003 | no live host |
| NEW-host-outro-comments | host reads viewer comments in a bordered window, app panels at right | 1 | 8:47–9:09 | sheet_032 | new |
| NEW-corner-source-tag | photographer credit, top left | 1 | 9:07.21 | sheet_033 | none in our kit |
| NEW-host-sponsor-read-credits | credits column beside the talking host (no sponsor) | 1 | 9:09.20 | 9m13s_f13277 | new |

## 9. What our framework would need to make this video
1. **Archival speech as the main voice:** a speech-bite recipe (in/out points, optional captions, bed under, K-Pillarbox, VHS finish). 30.8 % of the runtime (2:36–2:47, 4:31–5:28, 5:53–6:31).
2. **A NEW-monitor-wall-grid recipe:** cells, an active cell, yellow labels, summaries written in, punch-ins with persistent labels (4:29.23–5:31.20, 7:57.12).
3. **Live-action host support:** studio plates, hands-on-map footage composited with digital isolation and tags, an outro window with UI panels (0:33.18, 1:11.02, 8:46.22).
4. **A "voxAlmanac" theme:**
   - tokens: #FAFE0A, #159EC8, #EA6A6C, #90352C, #FDF0AC, #0E0E0E;
   - type: NEW-mixed-weight-type grotesque;
   - motion: graphics on twos, ease-out moves;
   - pictures: full-bleed colour archival.
5. **NEW-vhs-spine-date-tag** (8×) and NEW-vhs-artifact-finish as a finish preset.
6. **Maps:** NEW-choropleth-us-map with NEW-selective-colour-isolation and legend chips, plus person-tinting for photos (0:44–1:11, 7:21.09).
7. **Documents in this look:** a yellow swipe on twos, scrolling, a clipping, a headline card, NEW-document-text-overprint (2:07, 4:17, 7:04, 7:39).
8. **NEW-tv-static-flip** as a transition with its sound (0:13.18, 5:53.22, 8:36.07).
9. **Labels:** NEW-name-label-arrow, NEW-paper-card-lower-third, yellow labels, NEW-scatter-letter-type-on (0:06.12, 4:07.22, 3:59.21, 2:22.14).
10. **Audio:**
    - a constant low library bed (speech +12–18 dB), pulled for key archival lines (≈ 9 % music-free);
    - a riser into a drop-out; NEW-music-reset-hole;
    - a hard sting after the keyword (1:31.00);
    - black + silence before the outro.
11. **NEW-beat-locked-montage-burst:** snap cuts to 16th notes for ≤ 7 s (5:31.20).
12. **Series wrapper:** NEW-ransom-collage-series-card + edition label, NEW-host-outro-comments, NEW-host-sponsor-read-credits (1:34.07, 8:46.22, 9:09.20).

## 10. Evidence index
| file | time | what it shows |
|---|---|---|
| analysis/stills/vox_drinkingage/0m08s_f200_name-label-arrow.jpg | 0:08.08 | name label, arrow, scanlines |
| …/0m15s_f379_date-tag-1984.jpg | 0:15.19 | VHS-spine tag, RGB fringe |
| …/0m54s_f1299_map-selective-colour-legend.jpg | 0:54.04 | wall map, isolation, legend chip |
| …/1m34s_f2267_almanac-series-collage.jpg | 1:34.13 | series card |
| …/1m39s_f2390_road-trip-edition-label.jpg | 1:39.16 | edition label |
| …/2m09s_f3097_document-highlighter.jpg | 2:09.04 | amendment + highlighter |
| …/2m23s_f3452_kinetic-phrase-drafted.jpg | 2:23.23 | mixed-weight phrase, pencil ring |
| …/4m05s_f5888_madd-rid-labels.jpg | 4:05.13 | yellow labels, pillarbox |
| …/4m10s_f5999_lower-third-lightner.jpg | 4:10.04 | paper lower third |
| …/4m19s_f6234_newspaper-clipping-highlight.jpg | 4:20.00 | clipping + highlighter |
| …/5m15s_f7556_but-word-card.jpg | 5:15.03 | "BUT", monitor chrome |
| …/5m27s_f7851_argument-grid.jpg | 5:27.10 | monitor wall with summaries |
| …/7m19s_f10547_waveform-karaoke-captions.jpg | 7:19.21 | captions + waveform |
| …/7m33s_f10865_ruling-7-2-red-tint.jpg | 7:33.03 | overprint, dissent tint |
| …/9m13s_f13277_outro-credits.jpg | 9:13.18 | credits beside the host |
| …/strip_00156-00203_name-label-arrow.png | 0:06.12–0:08.11 | label wipe, arrow draw-on |
| …/strip_00330-00377_date-tag-build.png | 0:13.18–0:15.17 | static, tag build on twos |
| …/strip_02252-02299_almanac-title-collage.png | 1:33.22–1:35.21 | substitution collage |
| …/strip_03409-03456_kinetic-phrase-reveal.png | 2:22.04–2:24.03 | scatter type-on, cut on "vote" |
| …/strip_06470-06517_argument-grid-build.png | 4:29.20–4:31.19 | cells pop, active cell lights |
| analysis/sheets/vox_drinkingage/sheet_003–004 | 0:21–0:44 | host; desk ritual |
| sheet_008, 013 | 1:20–1:31; 2:24–2:46 | preview overprint, aerial; erase, 1982 tag |
| sheet_016, 018 | 3:20–3:54 | PSA; pillarboxed press conferences |
| sheet_020–025 | 4:25–6:08 | grid, BUT, montage, 1956 map, glitch, torn reveal |
| sheet_026–028 | 6:19–7:39 | signing label, NYT card, hands, *Dole*, justices |
| sheet_029–034 | 7:39–9:29 | studies, LAW/CULTURE, payoff, outro, credits |
