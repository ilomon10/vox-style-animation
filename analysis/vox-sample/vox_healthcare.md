# Can Democrats fix healthcare? — `vox_healthcare`
YouTube Y0OTKFdbfcc · Vox main channel, "News Not Noise × Vox collaboration": remote two-person conversation (partner host interviews a Vox correspondent), no series name · uploaded 2026-11-13 · 20:40.16 (1240.7 s, 29,776 f) · 1920×1080 @ 24 fps · captions: none available (no manual track; auto track not fetched) → whisper base.en only

## 0. Inputs and reliability
- **Read:** `info.json` (the description states the format: "In a collaboration with News Not Noise, founder Jessica Yellin joins Vox senior correspondent Dylan Scott"); shots md/json; metrics CSV; transcript, words, phrases, rhythm, features and sync JSON; palette; sheet index. **Viewed:** sheets 001–010, 017, 035, 036 (13 of 36); 4 strips (3 full-resolution crop strips I built, 1 tool strip); 2 crops (type and credits).
- **My own measurements:**
  - a 4-fps scan of the whole video at 480×270 (run under `flock out/.analysis.lock`): a layout classifier, flatness of the two-up canvas zones, white pixels in the name-card zone and presence of the logo bug;
  - per-frame decodes of both name cards and the end card;
  - geometry and colour measured on stills;
  - background patch matching (camera moves) and normalised cross-correlation (crop scale);
  - pause levels and audio discontinuity at cuts, from the WAV;
  - a speaker split by turn.
- **Shot detector: correct for this video.**
  - All 38 cuts are one-frame hard cuts: mad ≈ 48 on the cut frame, then normal.
  - The scan finds 38 layout runs with identical boundaries.
  - No cuts were missed: no cut ever joins two shots of the same layout.
  - **Real count:** 38 segments + a 6-frame black tail. Only three camera set-ups exist.
  - The two "soft transitions" (4:59.02–4:59.12) are Dylan throwing his hands at the webcam.
- **Metrics I distrust:**
  - The `cam zoom` totals (1.044 in shot 1, 0.939 in shot 22) and the 6 `camera_moves` in sync.json are people moving. Patch matching gives scale 1.00 and shift 0 px in 5 long shots.
  - The cadence column ("ones") is right for the live feeds (≤ 0.4 % held frames). The graphics were measured separately (§5).
- **Speakers and classes in sync.json are wrong.**
  - The narrator/other label flips mid-sentence (87 runs).
  - "archival voice" (263.5 s, 21 %) is host and guest speech.
  - "narration+music" (102.7 s) and "music-only" (6.2 s) are false positives (voice harmonics, and laughter at 9:29–9:31). **There is no music.**
  - I split the speakers by turn from the content (the host asks the questions), checked against the layout.
- **rhythm.json** segments A–H are chunks bounded by cuts, not beats. Their tempi (72–112 BPM; C = 199 BPM) measure speech rhythm: 199 ≈ the word rate (3.4 words/s ≈ 206/min).
- **Transcript corrections** (whisper → screen or likely):
  - "Jessica Yellen" → **Yellin** (name card).
  - "Democrats one big" → **won** big.
  - "I came Jeffries" → **Hakeem** Jeffries (video tags).
  - "Trump RX" → TrumpRx.
  - "Frank Palone" → Frank **Pallone** (probable).
  - "Emma Shaw out of Arizona" → **uncertain** (perhaps Amish Shah), unverified.
  - "Annie Andrews in South Carolina" → as heard, unverified.
  - "Hillary and president in a Barack Obama" → garbled ("Hillary [Clinton] and … Barack Obama").
  - "between 2000 and 2006 and 2008" → 2006 and 2008.
  - "makers from both parties" → lawmakers (overlapping segments).
  - "I'll concern" → "a real concern"? (uncertain).
  - **≈ 5 s are missing** at 7:03–7:08, after "43% of Americans". The host's recap at 8:45 gives the claim as "might not take the prescription drugs because they can't afford it".
- **Not measured:**
  - the exact fonts;
  - the mic chain;
  - whether the conversation was trimmed. Energy at the cuts shows no discontinuity: median |ΔE| 3.4 dB at cuts vs 3.2 dB at 300 random speech points. Edits inside shots were not tested.
  - the truth of the policy claims (not checked).

## 1. Summary
- **This is not an animated explainer.** It is a 20-minute remote conversation. The partner host, Jessica Yellin (founder of News Not Noise), interviews Vox senior correspondent Dylan Scott, recorded in the week after the midterms ("last Tuesday", 13:56). 99 % of the runtime is live webcam or studio video. There are **0 graphic inserts, 0 B-roll, 0 charts, 0 maps, 0 archival clips and 0 captions**.
- **Three set-ups do all the work:**
  - a designed **two-up split** (two rounded, keylined portrait windows on flat `#262626`): 48.8 %;
  - the guest's **full-frame webcam single**: 46.8 %;
  - the host's **full-frame single** (open and close): 3.4 %;
  - plus a silent credits card: 1.0 %.
- **Shot economy:** 38 hard cuts, median shot 29.4 s, 1.84 cuts/min.
- **The cutting is pure conversation logic:**
  - the host is only ever seen speaking in the two-up (or in her own single at the open and close);
  - the guest's single appears only inside his answers;
  - the layout switches every ≈ 30 s, half the time in the breath before a sentence;
  - the sign-off uses addressee cuts.
- **"Vox" is carried only by the packaging:**
  - a persistent Vox wordmark bug;
  - the current lower third: serif name with letters fading in scattered order, a yellow `#FDF203` underline "worm" on threes, a grotesque role line, a 5-frame flicker exit;
  - a credits split panel with a yellow-dotted rule and a glitch-built wordmark;
  - plus the correspondent's journalistic register (named sources, numbers, policy mechanics).
- **Policy and numbers are never visualised.** "$1 trillion", "five times more", "43 %", "about 10 holdouts" and "a million people" are voice only. KFF is credited verbally, with no source line.
- **Sound is dialogue only:** no music, no SFX, mono, two mics level-matched within 0.3 dB, −21.8 LUFS integrated. Even the end card is digital silence.
- **Long-form structure:**
  - 7 host questions act as 7 unmarked chapters (2–3.7 min each), ordered from near-term to long-term;
  - one verbal signpost ("let's get out of Washington for a minute");
  - the host recaps the key number once;
  - the returning motif is the 2028/2029 horizon;
  - there are no chapter cards, no YouTube chapters and no recap graphics.
- **Versus our Earworm default:**
  - absent: collage ground, B&W cut-outs, periwinkle, condensed caps, camera moves, karaoke, music and structural sound;
  - the accent is yellow;
  - type is a serif + grotesque pair at small sizes;
  - type is on screen 1.8 % of the runtime (bug excluded) vs 64 % in doc 13.

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
|---|---|---|---|---|
| cold-open/hook (spoken series intro) | 0:00.00–0:33.00 | 2.7 | "Hello, everyone, and welcome to a News Not Noise and Vox collaboration" → Democrats control Congress → "solutions they can actually pass… there are limits" → host self-intro, guest intro, "Dylan, I am a longtime fan" | NEW-host-presenter-desk, NEW-yellow-bar-lower-third, V-HC to NEW-two-up-call-windows on "Dylan", NEW-persistent-corner-bug |
| question/thesis (Q1) | 0:33.00–2:43.00 | 10.5 | first move = repeal the "$1 trillion in Medicaid cuts" of the One Big Beautiful Bill Act; Trump won't sign; push anyway (promise, forced votes, set-up for 2028) | NEW-question-led-chapters, NEW-fullframe-remote-interview (+ 2nd name card 0:55.01), NEW-two-up-single-alternation, NEW-voice-only-claim |
| evidence (Q2) | 2:43.00–6:02.19 | 16.1 | bipartisan "buckets": site-neutral Medicare payment ("five times more" in a hospital outpatient department), the No Surprises Act arbitration backlog, drug prices | same (2.4 cuts/min; Q1 2.8) |
| evidence (Q3) + recap | 6:02.19–8:53.00 | 13.7 | TrumpRx is "more bluster than actual results"; KFF survey "43%"; international reference pricing; expand Medicare negotiation (Pallone); "messaging votes"; host restates the 43 % and asks "Was that right?" | NEW-host-recap-check, NEW-voice-only-claim |
| context (Q4, personal) | 8:53.00–10:49.05 | 9.4 | "personal pet peeve… asking for a friend": prior authorization and AI denials; new members' proposals | two-up holds through the laugh (9:29) |
| turn (Q5, realism check) | 10:49.05–13:06.14 | 11.1 | "any realistic path… or two years of political theater?" → reconciliation bill, Warnock's 2-year delay of work requirements → "the odds are… political theater" | longest holds (75.6 s two-up, 73.3 s single) |
| context (Q6, new arena) | 13:06.14–16:51.06 | 18.1 | "Okay, let's get out of Washington for a minute": the states (≈ 10 Medicaid-expansion holdouts, Texas ≈ 1 million people, public options, abortion, private equity) | verbal signpost only |
| payoff (Q7) | 16:51.06–20:02.21 | 15.4 | Medicare for All "on ice until 2029?" → 2006–08 consensus (ACA) vs 2018–20 litmus tests → "which path are we going to choose?" → open question for 2029 | NEW-question-led-chapters |
| ending | 20:02.21–20:28.14 | 2.1 | "We shall see" → synthesis ("from the politics of healthcare to… the practical business of fixing it") → thanks → "solutions… rather than just crisis news" → "see you again soon" | NEW-addressee-cut ×2, NEW-host-presenter-desk |
| credits | 20:28.14–20:40.16 | 1.0 | (digital silence) two credit pages + wordmark | NEW-credits-split-panel, R-EndCard (glitch build), T-CS |

The macro-order runs from near-term to long-term horizon: federal → bipartisan → drugs → insurers (personal) → realism check → states → 2029. The 5th question is the "turn" (scepticism) and the 7th is the "payoff" (long horizon).

### 2.2 Claim → visual device map
| claim type | example (time, words) | device ID(s) | asset type | audio treatment |
|---|---|---|---|---|
| date | 17:54.02 "2006 when Democrats won really big congressional majorities" | NEW-voice-only-claim on the guest single | live video | dry dialogue |
| place | 13:52.17 "two of those, Georgia and Texas" | NEW-voice-only-claim | live video | dry |
| person-expert | 0:23.12 host names "Dylan Scott, who covers healthcare for Vox"; card at 0:55.01 | NEW-yellow-bar-lower-third | name card | dry |
| person-political | 1:05.06 "Hakeem Jeffries, who's going to be the new Speaker…" | none: name + role in speech | — | dry |
| fact / source | 6:54.06 "KFF, one of the leading health policy think tanks" | NEW-voice-only-claim (no source line) | — | dry |
| number | 0:56.05 "$1 trillion"; 4:03.12 "five times more"; 7:01.19 "43%"; 14:22.02 "a million people" | NEW-voice-only-claim; recap by the host at 8:42.13 | — | dry |
| concept | 3:51.08 "to get a little wonky… called site neutrality" + worked example | NEW-voice-only-claim | — | dry |
| list | 3:30 "a couple different buckets. One of them would be…" (3 items); 13:34 "a couple of different threads" (4 items) | spoken signposts only | — | dry |
| comparison | 4:03 hospital outpatient vs independent office (5×); 2006–08 vs 2018–20 | none | — | dry |
| causal link | 5:28 insurers blame the arbitration "mess" for premium hikes | none | — | dry |
| quote | 1:21 "if you force me to pick my number one priority…" (paraphrased) | none (no quote card, no recording) | — | dry |
| question | 0:42.11 "what is the first thing you think they'll try…?" | NEW-two-up-call-windows (the host is always in the two-up) | live video | dry |
| payoff | 19:57.11 "can we get big changes in 2029, or are we going to be stuck in the same place?" | guest single → two-up | live video | dry |
| ending | 20:26.10 "I'm Jessica Yellin, see you again soon." | NEW-host-presenter-desk → NEW-credits-split-panel | live video + card | digital silence on the card |

**Counts (≈):**
- **date:** 19 year tokens (2028 ×3, 2029 ×5 + "'28", 2006 ×3, 2008 ×3, 2018, 2020 ×2) + relative dates;
- **place:** 11 state mentions (8 states) + Washington ×2 + White House ×4;
- **person-expert:** 2 (the guest; KFF);
- **person-political:** 9 people, 26 mentions (Trump 16);
- **number:** 8 distinct;
- **concept:** 11;
- **list:** 2;
- **comparison:** 3;
- **causal link:** ≈ 6;
- **quote:** 0 recorded, ≈ 5 paraphrased;
- **question:** 7 host questions (+ 5 sub-questions or asides) and 12 guest voiced or rhetorical questions;
- **payoff:** 2;
- **ending:** 1.

**→ device:** every claim (≈ 110) → talking head (two-up or single). **0 claims typeset, 0 source lines, 0 inserts.** The only typeset nouns are the two names, the two roles and the credits.

### 2.3 Script patterns
| item | measurement |
|---|---|
| words/min | **185.5** over the runtime (3,836 words); host 180 (640 words in 213 s of turns); guest 189 (3,196 words in 1,015 s). Per beat: intro 193, Q1 200, Q2 181, Q3 186, Q4 178, Q5 187, Q6 182, Q7 194, outro 203 |
| speech share | speech-bearing frames 88.5 %; the rest is inter-phrase gaps (11 %) and the 12-s silent end card. Guest 81.8 % and host 17.2 % of the runtime (turn time). Narrator in our sense: none |
| sentence length (whisper punctuation) | host median 9 words (p10–p90 2–24, max 36); guest median 19 (7–45; run-ons up to 130) |
| questions | host: 7 chapter questions, 3 two-part follow-ups, 1 fact-check ("Was that right?", 8:50.06), 1 audience aside ("Who's had that experience?", 9:05.15). Guest: 12, mostly voicing actors ("what went wrong? Why did we lose so badly?", 11:16.19) or framing the open end ("which path are we going to choose?", 19:13.09) |
| person / tense | first-person analyst: guest "I" 70× ("I think" 39×), "we" 30× (voicing Democrats); host "you" 14×. Present and future-predictive ("are going to") |
| signposting | "So let's get into this" (0:33.00); "I think of those issues in a couple different buckets" (≈ 3:30); "to get a little wonky for a moment" (3:49.05); "I want to ask you about…" ×2 (6:06, 8:53.03); "Okay, let's get out of Washington for a minute" (13:07.14); "Beyond that" ×2; "So, again…" (12:30.14); "we can't have this conversation without acknowledging Medicare for All" (≈ 17:01) |
| sources and experts | the guest is named and introduced by the host ("Dylan Scott, who covers healthcare for Vox") 30 s before his name card. Politicians get name + role ("Frank Pallone, who will lead the House Energy and Commerce Committee", 8:07.18; "Senator Warnock out of Georgia", 11:56). KFF gets a descriptor only. Candidates get name + state |
| opening formula | greeting + collab label → 3-sentence stakes → limitation ("Of course, there are limits. President Trump is still in the White House") → "I'm …, founder of …" → guest intro → rapport line |
| closing formula | guest ends on an open either/or question → "We shall see." → compliment + one-line synthesis → thanks to the audience → collab restated → mission line ("solutions … rather than just crisis news") → name sign-off |
| sponsor / membership / CTA | none in picture or audio. The app and membership pitch is only in the YouTube description |
| vs doc 13 | breaks rules 3–12: 186 vs 94 words/min of video; 21 questions (12 rhetorical, voiced by the guest) vs 0 rhetorical; meta-talk ("let's"); no sources speak alone; no music; type on screen 1.8 % vs 64 % |

### 2.4 Format specifics
- **Host on camera:**
  - The host is the partner outlet's founder, in her own studio: plum wall, shallow depth of field.
  - She addresses the lens directly for the open (0:00–0:25) and the sign-off (20:09–20:28).
  - Otherwise she is seen only in the two-up.
- **Guest:**
  - one Vox correspondent on a home-office webcam, in over-ear headphones;
  - full-frame head-and-shoulders;
  - he looks into his lens, so the two-up reads as both people addressing the viewer.
- **Interviews:** 1 (the whole video). No other voices, no archival politicians, no clips.
- **Viewer question:** none, but the host invites identification ("Who's had that experience? … asking for a friend").
- **Series intro / branding:** no title card, ident, sting or music. The collaboration is spoken only. No partner logo appears.
- **Chapters:** none (YouTube chapters empty, no cards). Structure = 7 questions (NEW-question-led-chapters).
- **Reporting trips:** none. **Recaps:** the host restates the key stat (8:42.13) and gives a closing synthesis (20:08).
- **Returning motifs (verbal):**
  - the 2028/2029 horizon (≈ 9 mentions);
  - Trump's veto / "signature legislation" (1:30, 10:57, 11:34);
  - "political theater" (11:07, ≈ 12:34).

## 3. Shot economy
| quantity | value |
|---|---|
| shots | 39 detected = 38 real segments (17 two-up, 17 guest single, 3 host single, 1 end card) + 6 black frames. Set-ups: 3 + end card |
| mean / median | conversation shots (n = 37): mean 33.2 s, median 29.4 s. Two-up mean 35.6 (12.2–75.6); guest single 34.1 (1.4–73.3); host single 14.2 |
| cuts per minute | overall 1.84. Per beat: intro 1.8, Q1 2.8, Q2 2.4, Q3 1.4, Q4 1.0, Q5 0.9, Q6 1.6, Q7 1.3, outro 7.0 (3 addressee cuts). Cutting slows after the first 6 min |
| shot-type shares | `interview` 95.6 % (two-up 48.8 + guest single 46.8); `host-on-camera` 3.4 %; `type-card` (credits) 1.0 % |
| longest holds | 75.62 s two-up 10:01.17; 73.25 s single 11:17.08; 68.83 s single 6:37.19; 63.0 s two-up 12:30.14; 60.79 s two-up 8:41.02 |
| answer coverage | guest answers = 1,015 s: 57 % in his single, 43 % in the two-up (the listening shot) |
| reveal of a set-up | none: each layout arrives complete on a hard cut and never animates. The only builds are the two name cards (≈ 1.0 s) and the end card (≈ 1.0 s) |

## 4. Look
### 4.1 Colour
- **Palette** (`palettes/vox_healthcare.json`):
  - `#657687` 18.6 % (guest's slate wall);
  - `#252525` 16.2 % (two-up canvas);
  - `#B4AFAE` 12.2 % (prints, light wall);
  - `#996955` 9.9 %;
  - `#804A50` 8.9 % (host's plum wall);
  - `#D79981` 7.4 % (skin);
  - `#748DBD` 6.1 % (guest's shirt).
- **Grounds:**
  - two-up canvas flat **`#262626`** (RGB 38,38,38; flat in every two-up sample of the 4-fps scan);
  - host wall plum `#622D3F`;
  - guest wall slate `#647483`;
  - end card: panel `#292929` + black.
- **Accent:**
  - yellow **`#FDF203`** (lower-third worm, 2 × 33 f) and `#F9FF0E` (credit-rule dots, wordmark glint);
  - pixel share ≈ 0 (< 0.01 % of pixel-time);
  - credit names light blue `#AFD2D8`;
  - no periwinkle.
- **Grade:** no common grade; each feed keeps its own look.
  - Host: warm (metrics warmth +37, sat 0.41), shallow depth of field (Laplacian variance: background 3 vs face 146).
  - Guest: cool (warmth −11, sat 0.23), deep-focus webcam, softer face (9) than background (44).
  - The two-up averages them (luma 102, warmth +26).
- **Archival:** none.

### 4.2 Typography
| role | family (nearest free) | size (% of frame height) | case | colour | position | notes |
|---|---|---|---|---|---|---|
| name (lower third) | bold text serif, wedge serifs, large x-height (≈ Source Serif 4 Bold / Newsreader Bold) | cap 56 px = 5.2 %; x-height 41 px = 3.8 % | Title | white (≥ 240) | x 236 (12.3 % W); cap top y 779, baseline 835 | no plate, no shadow |
| role line | medium neo-grotesque (≈ Inter SemiBold) | cap 30 px = 2.8 % | Sentence ("Senior correspondent, Vox") | white | baseline y 897; 32 px under the name | — |
| underline worm | rounded stroke | 11 px thick; ≤ 202 px long | — | `#FDF203` | y 847–857; spans the name's left to right edge | §5 |
| logo bug | Vox wordmark (italic high-contrast serif) | 166×83 px = 7.7 % | — | opaque ≈ `#EBEBEB` (234–238 on every ground) | top-right, 32 px from the top, 33 px from the right | 99.0 % of the runtime |
| credit role | regular serif | ≈ 23 px line = 2.1 % | Title | `#D5D5D5` | right-aligned at x ≈ 646, 40 px left of the rule | — |
| credit name | bold grotesque | ≈ 23 px | CAPS | `#AFD2D8` | under each role | — |
| end wordmark | Vox logo | 672×322 px = 29.8 % | — | ≈ `#E1E1E1` | centred in the black area (x 972–1643, y 341–662) | — |

There are no captions or subtitles and no kinetic type. Type is on screen 21.8 s (1.8 %) without the bug: 2 × 5.0 s of name cards + 11.8 s of credits.

### 4.3 Layout & composition
- **Two-up:**
  - two windows of 853×985 px (44.4 % W × 91.2 % H, aspect ≈ 0.87);
  - margins: left 73, right 62, top 49, bottom 46 px (centred within 6 px); gutter 80 px;
  - **corner radius ≈ 55 px**; **3-px white keyline** (plus a 1-px dark rim, probably codec ringing);
  - host left, guest right;
  - each window is a portrait centre-crop of its feed at **≈ 1.05×** (normalised cross-correlation peak 0.81). It crops away the room rather than punching in;
  - the bug overlaps the right window's top-right corner.
- **Singles:** full-bleed 16:9, centred head-and-shoulders. The room stays visible (host: shelf with red books and vases; guest: two framed prints and a landscape painting).
- **Lower thirds:** lower-left over the picture (x 12 %, y 71–83 %), first full-frame appearance only.
- **Depth:** 2 layers (video + bug). No parallax, no shadows.

### 4.4 Textures & finish
None: no grain, paper, halftone, vignette, chromatic aberration or light leaks. The finish is clean digital, with webcam compression on the guest feed and real lens bokeh on the host. The only designed finish is the rounded, keylined windows.

### 4.5 Branding
- **Logo bug:** Vox wordmark, top-right, in every frame until 20:28.13. It does not alternate with a sponsor (cf. NEW-alternating-corner-bug, `vox_electoral`).
- **Name cards:** 2, each exactly 120 f (5.0 s), on each person's first full-frame shot.
- **Source lines:** none.
- **Series marks:** none.
- **Partner:** "News Not Noise" appears only in the host's role line and speech.
- **End card:** NEW-credits-split-panel.
  - Page 1: Producers, Video Editor, Copy Editor, Fact Checker, Senior Audience Editor, Audience Editor, a divider, Executive Producer, Senior Art Director.
  - Page 2: "Special Thanks" (6 names).
  - Right side: the Vox wordmark.
  - Audio: silent.

## 5. Motion language
| element | timing (frames @ 24) | motion / easing | cadence |
|---|---|---|---|
| cameras | whole video | **0 moves**: locked webcams; no digital push-in, reframe or drift | live 24p, ≤ 0.4 % held frames |
| layout | whole video | windows never move or resize | — |
| name letters | f481–f492 (0:20.01–0:20.12) | per-letter opacity fades in **scattered order** (first "i", "el", then "Yel", …), each ≈ 4–6 f; legible at f493 | **twos** for 12 f, then ones while settling (f493–f500) |
| underline worm | f485–f517 (0:20.05–0:21.13) | a 14-px dot at the name's left edge; the head runs right and the tail follows; length 14 → 202 → 11 px; it dies at the name's right edge | **threes**: 11 steps × 3 f (8 positions/s) |
| role line | f494–f502 | drops into place out of a mask under the name (its bottom edge moves 864 → 903 px) | ones |
| exit | f596–f600 (0:24.20–0:25.00) | **5-f flicker fade**: the two lines alternate opacity frame to frame; gone on f600; hard cut on f601 | ones |
| guest card | f1321–f1440 | identical timings, starting on the cut | — |
| end-card rule | f29486–f29509 (20:28.14–20:29.13) | a 17-px dot at mid-height grows into a 1,007-px rule with dot terminals; **ease-in-out** (half-length +0.5 → +50 → +5 px/f) | ones, 24 f |
| end wordmark | f29490–f29511 | horizontal-slice glitch reveal → metallic grey sheen → yellow edge glint → flat white | ≈ 21 f |
| credits | f29486–f29489 fade in; page swap f29623–f29637 | fade-out 7 f, 1 empty frame, fade-in ≈ 6 f; the rule stays | ones |
| annotation, maps, charts, 3D, stop-motion | — | none | — |

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |
|---|---|---|---|
| V-HC hard cut | 38 | 0:25.01 (host → two-up, 1.4 f before "Dylan"), 0:55.01, 8:41.02 (on the host's "Right."), 20:13.17, 20:28.14, 20:40.10 | Same kind. Placed by conversational logic (turns, breaths, addressee) with no SFX and no onset locking; ours are sound-locked (SIG-EW-1) |
| T-CS card swap (fade-out / fade-in) | 1 | 20:34.07–20:34.13 | text-only swap inside a fixed panel, 14 f, silent |
| NEW-flicker-fade-out | 2 | 0:24.20, 0:59.20 | 5-f alternating-line flicker exit; we have none |
| R-EndCard glitch build | 1 | 20:28.18–20:29.15 | slice + sheen + yellow glint on the wordmark only; no SFX, no music |
| (absent) | — | — | no dissolves, dips, drops, whips, push-throughs, blur cuts or match cuts |

Full cut list (→ layout; 2 = two-up, D = guest single, J = host single, K = end card):
- 0:25.01 →2 · 0:55.01 →D · 1:26.08 →2 · 1:38.12 →D · 1:49.15 →2 · 2:08.10 →D · 2:24.15 →2 · 3:15.07 →D · 3:53.00 →2 · 4:09.19 →D
- 4:28.22 →2 · 4:45.13 →D · 5:12.21 →2 · 5:25.11 →D · 5:48.06 →2 · 6:37.19 →D · 7:46.15 →2 · 8:02.19 →D · 8:41.02 →2 · 9:41.21 →D
- 10:01.17 →2 · 11:17.08 →D · 12:30.14 →2 · 13:33.14 →D · 14:21.10 →2 · 14:55.17 →D · 15:17.20 →2 · 15:47.05 →D · 16:39.03 →2 · 17:18.07 →D
- 17:58.06 →2 · 18:26.22 →D · 19:18.00 →2 · 20:09.14 →J · 20:13.17 →D · 20:15.02 →J · 20:28.14 →K · 20:40.10 → black

## 7. Audio
### 7.1 Music
| t0–t1 | style/instrumentation | BPM | mood/role | entry/exit | ducking under the voice (dB) |
|---|---|---|---|---|---|
| — | **no music anywhere** | — | — | — | — |

Evidence:
- Quiet pauses fall to −50 to −63 dB (8:40.04 −56 dB; 6:01.24 −59 dB; 8:36.20 −63 dB). A bed would hold them near −30 dB.
- The opening is 7 f of digital silence, then "Hello,".
- The end card is −120 dB.
- The `segments[]` BPMs are speech rhythm.

### 7.2 SFX inventory
| type | count | example timestamps | what it accompanies |
|---|---|---|---|
| designed SFX | 0 | — | nothing: no whooshes, hits or ticks, even on the name cards and the end card |
| production sounds (the 10 sync.json "SFX candidates") | ≈ 10 | 9:29.12–9:31.02 (both laugh), 15:54.13 (broadband transient: cough or knock, unidentified), breaths | the conversation itself |

### 7.3 Voice
- **Pace:** 185.5 wpm over the runtime; host 180, guest 189.
- **Pauses:**
  - 73 % of inter-word gaps are < 0.1 s, 22 % are 0.1–0.25 s;
  - 61 gaps of 0.5–1 s, 7 of 1–2 s, none ≥ 2 s;
  - longest 1.67 s (10:51.01, 15:53.09).
- **Share:** guest 81.8 %, host 17.2 %. No interview or archival inserts; the whole video is "interview audio".
- **Processing:**
  - mono (side −120 dB);
  - voices matched (median −12.9 / −12.6 dB);
  - full-band, no phone EQ;
  - the guest is 6.6 dB bassier (low band −9.6 vs −16.2 dB re RMS) with a darker centroid (756 vs 824 Hz): remote mic plus proximity effect;
  - integrated −21.8 LUFS, LRA 6.4 LU, sample peak −0.0 dBFS;
  - room tone is left as is: pauses are not filled.

### 7.4 Sync
- **Cuts vs word onsets:** 24 % within ±1 f vs a null of 26 % (p = 0.67): no locking.
- **Cuts vs sentences:**
  - 19 of 37 land within 7 f before to 3 f after a sentence onset, mostly in the breath before it (3:53.00, 2 f before "The same procedure"; 5:12.21, 0 f before "But");
  - 18 cut mid-sentence at word boundaries.
- **Cuts vs turns:**
  - every host turn sits in the two-up;
  - the two-up opens 8–48 s (median ≈ 16 s) before each question and runs 1.2–24.7 s (median 7.5 s) into the answer;
  - only 8:41.02 cuts on a turn (the host's "Right.").
- **Cuts vs named or addressed person:**
  - 0:25.01: the guest appears 1.4 f before "Dylan";
  - 20:13.17: to the guest 2 f before "It was great speaking with you";
  - 20:15.02: back to the host 12 f before "And thanks to all of you".
- **Text vs word:**
  - The host card starts 16 f before "I'm" and 24 f before "Jessica"; the name is legible 22 f before "Yellin".
  - The worm ends between "Yellin" and "founder".
  - The guest card is cut-locked (0 f), mid-answer, 30 s after he was named.
  - Our `name` event is +4 f, resolving on the surname; Vox leads by ≈ 1 s.
- **Beat-locked:** nothing (no music).

### 7.5 Silence and structural sound
- There are no dips, drops, risers, stingers or ducking moves.
- The only structural sound is the **silent end card**: the last word ends at 20:28.03, the cut comes at 20:28.14 (+11 f), and digital silence runs from ≈ 20:28.5 to the end (12 s).

## 8. Device catalogue
| ID | what this video does | count | timestamps | stills | differs from our spec? |
|---|---|---|---|---|---|
| NEW-two-up-call-windows | designed side-by-side remote-call layout: 2 portrait windows (853×985, r ≈ 55, 3-px white keyline) on flat `#262626`; carries every host turn and all listener reactions | 17 shots, 605.8 s (48.8 %) | 0:25.01, 8:41.02, 10:01.17 | 0m30s_two-up-split.jpg, 9m29s_two-up-laugh-reaction.jpg | new. Closest is R-NameCardInterview: one muted rounded `ZoomWindow` on the black plate, with a decode card beside it. Here there are two windows with their own audio, a 3-px keyline and a `#262626` ground. Also not the raw call frame + inset of NEW-video-call-pip-interview (`vox_cleanenergy`) |
| NEW-fullframe-remote-interview | the guest's own webcam full-frame (head-and-shoulders, room visible, headphones), only inside answers | 17 shots, 580.1 s (46.8 %) | 0:55.01, 6:37.19, 11:17.08 | 0m58s_dylan-single-namecard.jpg, 4m59s_dylan-hands-to-camera.jpg | new (no live-interview shot in any look) |
| NEW-host-presenter-desk | partner host to camera in her own studio: open and sign-off only | 3 shots, 42.7 s | 0:00.00, 20:09.14, 20:15.02 | 0m22s_jessica-single-namecard.jpg, 20m11s_jessica-outro-single.jpg | ID from `vox_cleanenergy`; here no desk and no mid-video returns |
| NEW-two-up-single-alternation | edit rule: two-up for host turns and the starts and ends of answers; guest single for answer bodies; a switch every 11–76 s (median 29 s), half in the pre-sentence breath | 34 switches | 0:55.01 … 19:18.00 | — | new |
| NEW-addressee-cut | cut to whoever is being addressed: the guest on his name, the guest on "great speaking with you", the host on "thanks to all of you" | 3 | 0:25.01, 20:13.17, 20:15.02 | 20m14s_dylan-reaction-insert.jpg | new |
| V-HC | single-frame hard cuts, no SFX | 38 | §6 list | — | same kind; not sound-locked |
| NEW-yellow-bar-lower-third (≈ R-NameCardInterview, SIG-EW-9) | serif name with per-letter scattered fade on twos; yellow `#FDF203` 11-px underline worm on threes (33 f); grotesque role dropping from a mask; no plate; 120 f; first full-frame appearance only | 2 | 0:20.01, 0:55.01 | 0m20s_namecard-letter-stagger.jpg, 0m20s_namecard-yellow-sweep.jpg, 0m20s_namecard-build-cropstrip_f480-507.png | ID from `vox_creatine` (there the bar "wipes up on ones"; here it travels on threes). Ours (SIG-EW-9): condensed periwinkle caps tracking +1 em → 0 with a random-letter decode, italic serif affiliation, resolving on the surname |
| NEW-flicker-fade-out | 5-f alternating-line flicker exit, finishing on the frame before the next cut | 2 | 0:24.20, 0:59.20 | 0m24s_namecard-flicker-exit-cropstrip_f592-603.png | new |
| NEW-persistent-corner-bug | channel wordmark top-right in every shot, opaque, never alternating | 1 (99.0 % of the runtime) | 0:00.00–20:28.13 | any still | new (cf. NEW-alternating-corner-bug); our `R-*`/kit has no bug |
| NEW-credits-split-panel (+ R-EndCard, VX-8) | charcoal left 36 % panel, right-aligned serif roles + light-blue caps names, 2 pages; white rule with yellow dot ends grows from a centre dot (ease-in-out 24 f); wordmark slice-glitch build with yellow glint; **silent** | 1 | 20:28.14–20:40.10 | 20m29s_endcard-logo-glitch-build.jpg, 20m32s_endcard-credits-p1.jpg, 20m38s_endcard-credits-p2.jpg | ID from `vox_cleanenergy`. R-EndCard has the glitch build but no credits, no rule and a bass hit |
| T-CS | credit page swap: fade-out 7 f, empty 1 f, fade-in ≈ 6 f | 1 | 20:34.07 | 20m34s_credits-page-swap-cropstrip_f29618-29637.png | close |
| NEW-question-led-chapters | 7 host questions are the chapter breaks (2.0–3.7 min); one verbal signpost; no cards, dips or music changes | 7 | 0:33.00, 2:43.00, 6:02.19, 8:53.00, 10:49.05, 13:06.14, 16:51.06 | — | new; ours marks chapters with `dip` / X-DipToBlack |
| NEW-host-recap-check | host restates the key number from the answer and asks the guest to confirm ("Was that right?" "Yeah.") | 1 | 8:42.13–8:51.00 | — | new (a spoken recap; no recap card) |
| NEW-voice-only-claim | numbers, concepts, places and politicians carried by speech alone: no insert, no type, no source line | ≈ 110 claims | 0:56.05, 3:51.08, 4:03.12, 7:01.19, 14:22.02 | — | new (the opposite of doc 13 §7) |
| SIG-EW-1…12, SIG-PD/DC/VX/ED, all other R-* and K-* | — | 0 | — | — | absent |

## 9. What our framework would need to make this video
Ranked by how much each item defines this video:
1. **A multi-feed `Conversation` composition** (NEW-two-up-call-windows, NEW-fullframe-remote-interview, NEW-host-presenter-desk). Two synced recorded feeds go in, plus an EDL of layouts (two-up / single A / single B). It draws rounded keylined portrait windows on a flat ground. Today R-NameCardInterview can show one muted clip in a rounded `ZoomWindow`; nothing plays two synced feeds with their own audio, full-frame or side by side, or switches layouts. Evidence: 0:25.01, 0:55.01, 20:09.14.
2. **Automatic layout switching from a diarized transcript** (NEW-two-up-single-alternation, NEW-addressee-cut).
   - Host turns → two-up.
   - Answers → alternate every ≈ 30 s (11–76 s), cutting in the breath before a sentence.
   - The guest appears on his spoken name; addressee cuts in the sign-off.
   - Evidence: the §6 cut list.
3. **A `conversation` theme**: canvas `#262626`, radius 55 px, 3-px white keyline, 80-px gutter, yellow `#FDF203` accent, white serif + grotesque pair, no grain or paper. Evidence: 0:30.
4. **Lower third** (NEW-yellow-bar-lower-third, NEW-flicker-fade-out):
   - letters fade in scattered order on twos;
   - the underline worm travels on threes;
   - the role drops in;
   - 5-f flicker exit;
   - 120-f life, on each person's first full-frame appearance;
   - leads the spoken name by ≈ 1 s;
   - our own styling, never Vox's.

   Evidence: 0:20.01–0:25.00, 0:55.01–1:00.00.
5. **A 20-minute Q&A structure template** (doc 13 stops at 8 min) (NEW-question-led-chapters, NEW-host-recap-check):
   - 33-s spoken cold open with the partner intro;
   - 7 questions of 2–3.7 min, ordered near → far: the 5th is the realism check, the 6th changes arena, the 7th looks to the long horizon;
   - the host restates the key number once;
   - 26-s sign-off with a mission line.

   Evidence: §2.1.
6. **A dialogue-only audio mode.**
   - No bed, no SFX; two mono mics levelled within 0.3 dB; room tone untouched; silent end card.
   - MusicBed and structural-sound defaults must be switchable off.
   - The sync tools need 2-speaker diarization: sync.json called 21 % "archival".
   - Evidence: §7.1, 20:28.14.
7. **A credits end card** (NEW-credits-split-panel, T-CS):
   - 36 % panel;
   - a rule that grows from a centre dot (ease-in-out 24 f);
   - 2 pages with a 14-f swap;
   - a wordmark glitch build with a glint, in our own mark.

   It extends R-EndCard. Evidence: 20:28.14–20:40.10.
8. **A channel bug** (NEW-persistent-corner-bug): opaque, 7.7 % H, 32-px inset, over every layout. Own mark only. Evidence: whole video.
9. **(Our option, not Vox's practice.)** NEW-voice-only-claim means the numbers are never shown. If we adapt this format, R-DataChart or PD-1 inserts over the guest single would be our addition. Evidence: 0:56.05, 4:03.12, 7:01.19, 14:22.02.

## 10. Evidence index
| file | time | what it shows |
|---|---|---|
| analysis/stills/vox_healthcare/0m20s_namecard-letter-stagger.jpg | 0:20.05 (f485) | scattered letters + yellow dot |
| analysis/stills/vox_healthcare/0m20s_namecard-yellow-sweep.jpg | 0:20.21 (f501) | underline worm mid-run |
| analysis/stills/vox_healthcare/0m20s_namecard-build-cropstrip_f480-507.png | 0:20.00–0:21.03 | full-res crop strip of the name-card build |
| analysis/stills/vox_healthcare/0m22s_jessica-single-namecard.jpg | 0:22.18 | host single + finished lower third |
| analysis/stills/vox_healthcare/0m24s_namecard-flicker-exit-cropstrip_f592-603.png | 0:24.16–0:25.03 | 5-f flicker exit, then the cut |
| analysis/stills/vox_healthcare/0m30s_two-up-split.jpg | 0:30.00 | two-up geometry, canvas, bug |
| analysis/stills/vox_healthcare/0m58s_dylan-single-namecard.jpg | 0:58.12 | guest webcam single + card |
| analysis/stills/vox_healthcare/4m59s_dylan-hands-to-camera.jpg | 4:59.12 | the false "soft transition" (a gesture) |
| analysis/stills/vox_healthcare/9m29s_two-up-laugh-reaction.jpg | 9:29.12 | both laughing: the two-up as reaction shot |
| analysis/stills/vox_healthcare/20m11s_jessica-outro-single.jpg | 20:11.00 | host sign-off single |
| analysis/stills/vox_healthcare/20m14s_dylan-reaction-insert.jpg | 20:14.07 | 33-f addressee insert |
| analysis/stills/vox_healthcare/20m29s_endcard-logo-glitch-build.jpg | 20:29.00 | wordmark build + rule growing |
| analysis/stills/vox_healthcare/20m32s_endcard-credits-p1.jpg | 20:32.00 | credits page 1, panel, rule |
| analysis/stills/vox_healthcare/20m34s_credits-page-swap-cropstrip_f29618-29637.png | 20:34.02–20:34.21 | page swap |
| analysis/stills/vox_healthcare/20m38s_endcard-credits-p2.jpg | 20:38.00 | "Special Thanks" page |
| analysis/strips/vox_healthcare_29484-29519.png | 20:28.12–20:29.23 | end-card build, every frame (viewed) |
| analysis/strips/vox_healthcare_00478-00509.png, …_00592-00603.png | 0:19.22–0:25.03 | full-frame versions of the name-card strips (not viewed) |
| analysis/sheets/vox_healthcare/sheet_001–010, 017, 035, 036 | 0:00–5:27, 9:03–9:39, 19:54–20:40 | layouts, cards, end card (viewed) |
| analysis/metrics/vox_healthcare_shots.json + .csv | all | 38 cuts (verified), luma/warmth per layout |
| analysis/audio/vox_healthcare_sync.json, _features.csv, _words.json | all | onset alignment, levels, pauses, turn split |
| analysis/av/vox_healthcare_*.png | — | A/V timelines (not needed: no music, no SFX) |
