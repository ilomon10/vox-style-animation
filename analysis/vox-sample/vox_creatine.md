# Creatine, debunked — `vox_creatine`
YouTube uK_1UiwTANw · Vox main-channel science explainer, sponsored ("Presented by Colgate Total"; the ad is "An Explainer Studio Production") · uploaded 2026-11-12 · 9:34.11 (574.49 s, 13,774 f) · 1920×1080 @ 23.976 fps (24000/1001) · captions manual

## 0. Inputs and reliability
**Read:** the guide, VOCABULARY, doc 12 §1, doc 13, info.json (no chapters), the manual VTT, whisper words and phrases, shots, metrics, sync.json, rhythm, features and palette.
**Viewed:** 40 sheet images (all except 020, which is pure ad; 9 viewed twice), 15 stills and 8 strips. The strips were rendered with the tool's own grid code into `analysis/stills/vox_creatine/`. I did not open the A/V PNGs; their numbers come from sync.json.
**Light numeric passes (under the lock):** bug template matching; accent and ground pixel shares; element timing; camera bursts; cut verification; cadence by frame differencing; F0 for voice identity.

| issue | handling |
|---|---|
| The speaker labels in sync.json (narrator 1,185 / other 434 words) are wrong in long stretches: Tiller's first bite is "narrator", and "At the 1992 Olympics" is "other". | Rebuilt by F0 and picture: female narrator ≈ 175–220 Hz, experts ≈ 100–135 Hz. **Narrator 850 words, Tiller 279, Taylor 213, archival/social 110, ad presenter 167.** |
| Whisper text errors | Fixed from the captions: *Cognitive benefits*, *Michel-Eugène Chevreul*, κρέας, *nature's steroid*, *creatine*, *triphosphate*, *when sleep deprived*, *Ergomax*. |
| The shot detector over-reports cuts | Each cut checked by image correlation across it. **Only 126 of the 163 detected cuts are editorial.** The other 37: <br>• video start: 1 <br>• inside the ad: 20 <br>• panel additions: 4 (f21, 44, 194, 219) <br>• inside source clips: ≈ 6 (TikTok f254, 258, 11635; the 1993 ad ≈ f2342, 2428, 2475) <br>• false positives: 6 (race motion f1985–2021 ×4, correlation 0.89–0.94; a stutter frame f9299; a hand crossing the lens f11432) |
| It also misses swaps | 4 in-place swaps on held grounds (f667, 6325, 9807, 12995). Corrected: **130 editorial picture changes.** |
| The metrics' "cadence" column | Wrong for the graphics. Frame differencing gives ≈ 15 drawings/s (§5). |
| Camera metrics on footage | They measure the footage's own motion: S27 "zoom 0.258" is a pen tracking EEG paper. I use them only on graphics. |
| sync.json cut statistics | Computed on the detector's 159 cuts. The directions are robust; the shares are approximate. |
| Not measured | Instrumentation (I could not listen). The content of 8 B&W shots (S24, S34–36, S38, S77–78, S80). Who the three "Creatine." speakers are. SFX (3 unverified candidates). Whether the 4–11 f music holes are rests in the cue or edits. |

## 1. Summary (5–10 bullets)
- **A light, document-driven "fact-check" look.**
  - Ground: light grey paper `#EAEAEA` with a faint grid.
  - Type: a near-black (`#262626`) heavy grotesque.
  - Accent: lemon yellow (`#E5EB09`–`#F9FF0C`), for annotation only: 0.13 % of pixels, present in 8.4 % of frames.

  It inverts Earworm: no black collage, no periwinkle, no condensed caps, no torn prints.
- **Evidence is shown as the source itself:**
  - social and podcast clips (≈ 23 editorial shots, 11.7 % of runtime); the 9:16 ones are framed on the paper ground;
  - journal and web pages with flat highlighter sweeps and an isolate-and-blur strip lift;
  - newspaper clippings, an MMSE form, and charts with source lines;
  - a small source tag top-left on every third-party clip.
- **Two remote, self-shot experts carry 26.8 % of runtime** (Tiller 14.1 %, Taylor 12.7 %). Both are full-frame and look into the lens. A yellow-bar serif name super appears on the first appearance only, and the narrator never introduces them first. At least 31 % of expert speech plays over b-roll or graphics.
- **Full-frame period footage instead of cut-outs.** 1920s–70s educational film keeps its native B&W or teal colour and is used literally or ironically: a 1930s pulley exerciser for "high intensity exercise". The rest is 1990s TV, stock and two 3D renders. Archival video of all kinds is 30.8 % of runtime.
- **Modular flat graphics:**
  - a 32 s battery diagram;
  - engraved arm/brain section icons with a focus-scale swap;
  - a **verdict checklist** (✓ ? ✗) that returns as the recap.

  Graphics step at **≈ 15 drawings/s**: a 2-2-1-2-1 frame-hold pattern, i.e. 15 fps conformed to 23.976, not our 12/s. The ground is static. On graphics the camera moves only in 11–15 f reframe bursts.
- **Argument-mode arc:** a claims-montage hook (the subject is named at 0:05) → thesis and expert → Vox ident "presented by" at 0:55 → history 1832→2025 → mechanism → muscle verdict → **59 s mid-roll ad** → brain claims vs studies → Alzheimer's pilot → "exaggeration" turn → recap → the expert's last word → silent credits.
- **Sound:**
  - The narrator takes 40.7 % of runtime (46.7 % of the editorial time) at 3.64 w/s.
  - Music runs under everything (only 1.0 s of narration is dry) and is **unducked** (0.6 dB; voice ≈ 9 dB over the bed). Six library tracks are credited.
  - Each section joint is a 5–29 f silent hole with a hard picture cut inside it.
  - The last 9.9 s are digital silence.
- **Sync is phrase-led.**
  - Cuts are not enriched on word onsets or beats.
  - 25 % of cuts lead a narrator phrase by 0–12 f (null 7.5 %).
  - Cuts coincide with music edits 2.8× over chance.
  - Text, annotations and list items land on their keyword at −2…+6 f (median ≈ +2 f), later than our `text` −7.
- **Branding is heavier than Earworm's:**
  - the Vox bug alternates with "PRESENTED BY Colgate Total" every ≈ 30 s;
  - a mid-video ident;
  - an in-house ad with its own presenter;
  - a co-branded end card.

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
|---|---|---|---|---|
| cold-open/hook | 0:00.00–0:26.06 | 4.6 | "If you're even a little tapped into the wellness algorithm… one supplement you can't escape: *Creatine* ×3" → sold to fitness buffs → pitched to everyone (4 podcast claims) → "sales just keep going up" | NEW-vertical-social-panels, T-WL, NEW-claim-supercut, NEW-corner-source-tag, R-DataChart |
| question/thesis | 0:26.06–0:55.09 | 5.1 | hard to separate science from hype → Tiller: industry sponsorship, bad science → "we're going to take a deep dive… from the mind to the muscles" | T-IC, NEW-yellow-bar-lower-third, NEW-fullframe-archival-broll |
| title/series-intro | 0:55.09–0:59.13 | 0.7 | (music alone) Vox wordmark + "PRESENTED BY Colgate Total" over B&W flexing film | NEW-brand-ident-over-footage, NEW-music-reset-hole |
| context | 0:59.13–2:01.11 | 10.8 | 1832 Chevreul → κρέας "flesh or meat" → 1992 Christie → 1993 Ergomax ad → "muscle candy" → $100 M (1997) → > $0.5 B (2025) | PD-4, T-PCap, NEW-word-morph-etymology, NEW-document-isolate-blur, VX-5, R-DataChart |
| demonstration | 2:01.11–2:56.08 | 9.6 | ATP → "think of it like a battery" → the body makes 1–2 g/day → 3–5 g fills the tank (3 Tiller bites over graphics) | SIG-VX-4, NEW-3d-medical-render, SIG-VX-7, E-SZ |
| evidence | 2:56.08–4:46.08 | 19.1 | "Let's start with the muscles" → reps, not mass → 35 studies +2.4 lb → water weight → only with exercise → 0.07 lb → **verdict ✓ ? ✗** → fake before/after | NEW-engraving-section-icon, NEW-focus-scale-swap, VX-5, NEW-verdict-checklist |
| cta/membership/sponsor | 4:46.08–5:45.18 | 10.3 | Colgate Total ad (own presenter, microscope set) | NEW-midroll-sponsor-ad |
| evidence | 5:45.18–7:33.08 | 18.7 | "Now let's talk about the brain" → web and TikTok claims → +118 % searches → Taylor: it reaches the brain → cognition is hard to measure → 2026 study, MMSE, "one question" → "exploratory" → ads promise "sharper" → Taylor: overstatement | NEW-focus-scale-swap, VX-5, NEW-document-isolate-blur, R-DataChart, NEW-stutter-jumpcut |
| expert | 7:33.08–8:03.12 | 5.3 | Taylor's pilot: 20 people, 20 g/day, 8 weeks, gains, no control group | handout lab b-roll + NEW-corner-source-tag |
| turn | 8:03.12–8:43.12 | 7.0 | "that didn't stop people from exaggerating the data" → TikToks → Taylor: "that's not true" → high doses → Tiller: "be very cautious" | NEW-claim-supercut, NEW-vertical-social-panels |
| payoff | 8:43.12–9:11.23 | 5.0 | "So to recap what we learned…": muscles ✓✓✓ / brain ✓ + 5 ? | NEW-verdict-checklist, T-CS |
| ending | 9:11.23–9:20.06 | 1.4 | Taylor: "It's exciting, but we're not there yet." | interview, music-only tail |
| credits | 9:20.06–9:34.11 | 2.5 | (silent) split end card | R-EndCard (≠) |

### 2.2 Claim → visual device map
| claim type | example (time, words) | device ID(s) | asset type | audio treatment |
|---|---|---|---|---|
| date | 0:59.19 "In 1832" | NEW-fullframe-archival-broll; **never digits** | archival film | new cue 6 f after the cut, after a 13 f hole |
| place | 1:17.04 "At the 1992 Olympics" | archival photos and race TV; no map | archival photo/TV | bed |
| person-historical | 1:01.23 "Michel-Eugène Chevreul" | PD-4 yellow arrow + label; T-PCap across 2 portraits | archival photo | bed |
| person-expert | 0:33.23 Tiller; 6:13.14 Taylor | NEW-yellow-bar-lower-third on a full-frame remote interview | interview | bed ≈ 9 dB under the voice |
| fact | 3:28.16 "across 35 studies… 2.4 more pounds"; 1:24.12 "a mysterious new supplement" | VX-5 highlighter on a journal page; NEW-document-isolate-blur on a clipping | screen-capture, newspaper | bed |
| list | 0:18.16 "Cognitive benefits. Stress. Depression… Neurodegenerative disease." | NEW-claim-supercut (two podcasts in ping-pong) | podcast clips | the sources' own audio |
| concept | 2:17.18 "Think of it like a battery"; 2:07.18 ATP | SIG-VX-7 diagram + E-SZ; NEW-3d-medical-render | illustration, 3D | bed; Tiller's voice over it; music change on the cut |
| causal link | 3:57.23 "only works if you're doing regular high intensity exercise" | NEW-fullframe-archival-broll (ironic 1930s pulley machine) | archival film | bed |
| number | 0:24.07 "sales just keep going up"; 6:08.11 "grew over 118%" | R-DataChart (the area grows; the line draws from "grew" +2 f) | chart + source line | bed |
| comparison | 3:03.06 "from this to this"; 4:34.04 before/after | NEW-vertical-social-panels; a YouTube clip racks into focus | social video | bed; expert J-cut |
| quote | 0:12.08 "I just feel bigger"; 1:35.12 Ergomax ad | the clip itself, with its own captions and audio; NEW-corner-source-tag | social / archival TV | source audio over the bed |
| question | 4:23.19 "So will creatine help you work out harder? Yes." | NEW-verdict-checklist | type card + engraving | bed |
| payoff | 8:43.13 "So to recap what we learned" | NEW-verdict-checklist ×2, T-CS | type card | new cue 3 f after the cut |
| ending | 9:11.23 "we're not there yet." | the expert's last word → silent end card | interview | 4.6 s music-only tail, then silence |

**Counts (≈):**

| claim → device | n | claim → device | n |
|---|---|---|---|
| quote → the clip | 14 | list → supercut / checklist | 1 / 2 |
| fact → page + highlight | 12 | expert → name super | 2 (+17 uncarded) |
| number → chart | 4 | historical person → label | 2 |
| concept → diagram / 3D / engraving | 5 | date → footage, never digits | 4 |
| question → checklist | 3 | causal link → literal b-roll | ≈ 10 |

### 2.3 Script patterns
- **Pace.** The narrator speaks 850 of 1,619 words: 88.8 wpm of runtime, 101.9 wpm of editorial time (500.8 s, without the ad and credits). Articulation 3.64 w/s (218 wpm). Narration is 40.7 % of runtime and 46.7 % of editorial time.
- **Narrator wpm per beat:**

  | hook | thesis | context | demonstration | muscles | brain | expert | turn | payoff | ending |
  |---|---|---|---|---|---|---|---|---|---|
  | 123.5 | 115.3 | 127.0 | 125.7 | 104.2 | 83.1 | 67.6 | 61.5 | **162.4** | 0 |

- **Sentences:** 61, median 13 words (mean 13.7, range 1–34). 12 have ≤ 7 words, including "Yes." "Maybe." "No.".
- **Questions:** 4 from the narrator. One is a signpost (2:56.08, "So how exactly does this extra energy storage affect our muscles and our minds?"). The other three are the verdict triple (4:23–4:32), each answered by the narrator in one word within ≤ 1 s. Taylor asks and answers two of his own questions (7:18–7:28).
- **Person and tense.** Present tense for the frame and the science; past for the history. "you/your" 13×, "we/our/us" 15×, "let's" 2×, deictic "this" 8×.
- **Signposting (all banned by doc 13 §5.5):**
  - "So to really get to the bottom of this, **we're going to take a deep dive**…" (0:46)
  - "**we need to understand** exactly what it's doing in our bodies" (2:01)
  - "**Let's start** with the muscles." (3:01)
  - "Now **let's talk about** the brain." (5:46)
  - "Take this 2026 study, for example." (6:40)
  - "So to recap what we learned:" (8:44)
- **How sources are introduced.**
  - Studies: by count ("across 35 studies"), by year ("Take this 2026 study… Researchers measured…"), or by team ("which is what Dr. Taylor's team studied", at 7:37, **84 s after Taylor's first bite**).
  - Experts are never named before they speak: voice, face and card arrive together. Tiller's voice pre-laps his cut by 6 f.
- **Opening formula:** a 2nd-person conditional, then the subject named by archival voices at 0:05 ("…one supplement you can't escape: Creatine. Creatine. Creatine."), i.e. at 1 % of runtime. Doc 13 puts it at ≈ 80 %.
- **Closing formula:** "So to recap what we learned: we know… It won't work without… We also know… But as for…" → the expert's line → silent credits. There is no sign-off and no CTA in the narration.
- **Sponsor:** the ident, the rotating bug, a 59.4 s ad (10.3 % of runtime) and the end-card logo.

### 2.4 Format specifics
| item | this video |
|---|---|
| host on camera | no; only the ad's presenter |
| viewer question | no; the thesis voices the audience's doubt |
| series intro / branding | ident 0:55.09–0:59.13: the wordmark pops in 1 f (0:56.14); "PRESENTED BY" types at 1 letter/f (0:58.01); the sponsor logo follows (0:58.14). No series name. |
| chapters | none in metadata; two signposts on the arm/brain engraving card (2:59.09, 5:45.18) |
| interviews | 2 experts, 19 shots, 106 s on face, 154 s of voice. Remote and self-shot: Tiller in a home office with the mic and an earbud in frame; Taylor in his lab. Centred MCU, full-frame. |
| reporting trips | none; the lab b-roll is handout footage, tagged "Taylor Nutrition and Brain Health Laboratory" |

## 3. Shot economy
- **The detector's figures:** 164 shots; mean 3.5 s, median 2.4 s.
- **Verified editorial picture changes:** 130 (126 cuts + 4 in-place swaps; §0) in 500.8 s:
  - **15.6 per minute**;
  - mean composition 3.79 s, median 2.77 s (p10 1.1 s, p90 8.2 s).

| beat | dur s | detected cuts | verified changes | per min | median composition s |
|---|---|---|---|---|---|
| cold-open/hook | 26.2 | 20 | 13 (− 4 panel adds, − 2 TikTok-internal, − start) | **29.7** | 1.6 |
| question/thesis | 29.2 | 8 | 10 (+ chart swap) | 20.6 | 2.5 |
| context | 61.9 | 32 | 24 (− race false positives, − ad-internal) | 23.3 | 1.7 |
| demonstration | 54.9 | 6 | 6 | 6.6 | 4.9 |
| evidence (muscles) | 110.0 | 20 | 22 (+ page → checklist) | 12.0 | 3.9 |
| evidence (brain) | 107.6 | 28 | 29 (+ page → MMSE, − stutter false positive) | 16.2 | 2.8 |
| expert | 30.2 | 14 | 12 (− hand pass) | 23.8 | 2.1 |
| turn | 40.0 | 10 | 9 (− TikTok-internal) | 13.5 | 3.9 |
| payoff | 28.5 | 1 | 3 (+ card swap) | 6.3 | 5.0 |
| title · ad · ending · credits | 4.2 · 59.4 · 8.3 · 14.2 | 1 · 21 · 1 · 1 | 1 · ad · 1 · 0 | — | — |

**Shot-type shares (% of runtime):**

| shot type | % | shot type | % |
|---|---|---|---|
| interview | 18.5 | archival-video (TV/news/ads) | 4.1 |
| archival-video (social/podcast) | 11.7 | chart | 3.3 |
| archival-video (film, 1920s–70s) | 11.7 | archival-video (handout lab b-roll) | 3.3 |
| *sponsor ad* | *10.3* | document | 3.2 |
| type-card | 7.5 | archival-photo | 3.1 |
| screen-capture | 7.1 | type-card (credits) | 2.5 |
| illustration-2d | 6.7 | 3d-render | 1.4 |
| stock-footage | 5.6 | | |

There is no map, collage or host shot.

**Longest compositions:**

| composition | length | start |
|---|---|---|
| battery diagram | 32.0 s | 2:17.18 |
| recap, muscles | 18.5 s | 8:43.13 |
| credits | 14.2 s | 9:20.06 |
| verdict | 10.3 s | 4:23.19 |
| journal page | 10.0 s | 3:28.16 |
| recap, brain | 9.9 s | 9:01.23 |
| Tiller | 9.9 s | 4:04.14 |

The long holds are graphics that keep adding one element per idea.

**How setups reveal their elements:**
- **Triptych.** Panel 1 arrives on the cut, panel 2 on "little" (0 f), panel 3 on "wellness" (−2 f): left to right, ≈ 22 f apart. The second triptych follows the same rule (0:07.10 / 0:08.02 / 0:09.03), then its left panel swaps content in place.
- **Battery.**
  - The ATP cells fill (2:18.18), then drain (2:21.18–2:24.18, "runs low in just a few seconds").
  - A reframe burst marks each stage.
  - The "SUPPLEMENT" cells arrive at 2:43.19 on "If you take the suggested dose".
- **Verdict.** Line → ✓ 4 f before "Yes." → line 2 fades up in ≈ 4 f → ? 1 f before "Maybe." → line 3 → ✗ ≈ 16 f before "No.".
- **Recap.**
  - Each line lands on its keyword: "3–5g" on "three" (0 f), "Better workout" (+2 f), "More strength" (−1 f), "More lean muscle mass" (0 f).
  - A 16 f card swap, then one ? line per spoken noun.

## 4. Look
### 4.1 Colour: palette hexes, background colours, accent colour(s) and pixel share, grading of archival material.
**Palette (palette.json):**

| hex | share | hex | share |
|---|---|---|---|
| `#E8E8E8` | 21.7 % | `#69706B` | 10.0 % |
| `#141513` | 12.9 % | `#B38F75` | 7.5 % |
| `#C5C1C0` | 12.6 % | `#6B533D` | 6.6 % |
| `#3D3E3B` | 11.8 % | `#BC1820` (Colgate red, ad) | 1.7 % |
| `#9B9A98` | 11.1 % | | |

| role | hex | note |
|---|---|---|
| ground | `#EAEAEA` | luma p5/p50/p95 226/234/242, σ 4.9; the grid toward the edges dips to 216. The ground covers > 40 % of the frame in 31.5 % of editorial frames. |
| text | `#262626`; gloss `#2B282A` | never pure black |
| accent (yellow) | highlighter `#E4EC0B`, underline `#E5EB09`, labels/arrows `#F3FF2C`, name bar `#FBFC55`, web highlight `#F9FF0C`, end-card dots `#F8FF0F` | mean 0.13 % of pixels; > 0.2 % in 8.4 % of frames; peaks of 1.3–2.0 % on annotation shots. The 11 % peak at 0:14.08 is a TikTok's own caption. |
| diagram | purple `#5600BA`, violet `#4631E6`, sky `#30A0E3`, green `#10F357`, arrow `#8548BD`, red duotone figure `#791E2C` | colour = quantity (supplement, supply, ATP) |
| charts / verdict | area gradient `#9B5EB0`→`#8260BD`, line `#6D88CE`; ✓ `#33AC11`, ? `#402DD4`, ✗ `#BC4552` | — |
| end card | `#292929` panel, `#000000`, names `#B0D3DB`, roles `#D1D1D1`, wordmark `#E1E1E1` | — |

**Archival:** nothing is unified; each source keeps its native look.
- B&W stays B&W (sat 0.00–0.03).
- 1960s–70s film keeps its teal or warm cast.
- 1990s TV stays low-res colour.
- Social clips are untouched (sat 0.3–0.5).

There are no duotones on footage.

### 4.2 Typography: families (name it, or describe + nearest free equivalent), roles, sizes as % of frame height, case, tracking, colour, where text sits; caption/subtitle style.
| role | family (nearest free) | size | case / colour | where |
|---|---|---|---|---|
| explanatory cards | heavy grotesque (≈ Libre Franklin Black / Archivo Black) | cap 70 px = **6.5 %** | sentence case with "?", `#262626` | left column, x ≈ 250 |
| diagram labels | same, caps | cap 46–48 px = 4.4 % | purple, violet or grey | above or below the icon |
| chart title / source / axis | same; the axis title in italic | 28 px = 2.6 % / 21 px = 1.9 % | sentence case | top-left, x 262, y 104 |
| photo label | condensed heavy caps (≈ Oswald 600 / Barlow Condensed Bold) | cap ≈ 32 px = 3.0 %, 2 lines | yellow | under the face, with a 172 px drawn arrow |
| name super | bold transitional serif (≈ Source Serif 4 Bold); role in a grotesque, book title in italic | 64 px = 5.9 % / 28 px = 2.6 % | white, **no plate**; yellow bar 14 × 127 px | lower-left, x 241, y 765–891 |
| etymology word / gloss | heavy sans with Greek (≈ Noto Sans Black) / italic Didone (≈ Playfair Display Italic) | x-height 137 px = **12.7 %** / ≈ 10.6 % line | `#262626` | centre-left |
| end credits / source tags | serif roles + bold caps names / small sans + platform icon | 23 / 24 px; tags ≈ 1.5 % | grey / pale cyan; tags white | right-aligned to the rule; tags top-left |

- Tracking is normal. There is no kinetic type and there are no Vox captions; TikToks keep their own.
- Vox-set type is on screen ≈ 23 % of non-ad time (Earworm: 64 %), ≈ 4 events per minute; ≈ 4 % of narrator words are typeset.

### 4.3 Layout & composition: grid, margins/safe area, text vs image placement, depth/layering.
- **Frame and text column.** Full 16:9, with a flush-left text column at x ≈ 245–265 (13 % W) and the top margin at y ≈ 104 (9.6 % H). Illustrations sit to the right (the arm spans x 1050–1780).
- **9:16 clips.** A single clip is ≈ 607 px wide and centred, with the ground on both sides. The triptych is 3 × 640 px full-height panels.
- **Name super.** Lower-left (71–83 % H), directly on the footage. Labels sit on the subject's chest.
- **Depth is used once.** The page defocuses while a text strip lifts, sharp and with a soft shadow. There is no multiplane and no overlapping or mask-breaking.

### 4.4 Textures & finish: grain, paper, halftone, print/scan look, vignette, chromatic aberration, light leaks.
- **Ground.** Paper-fibre noise (σ ≈ 5) plus faint grid and registration lines toward the frame edges. It is static: 0 of 20 frames change in a hold (f4000–4020), so there is no weave and no re-seeded grain.
- **Drawn elements.** The engravings are 19th-c. cross-hatched line art. Diagram fills carry light noise, and ✓/✗ have dry-brush edges.
- **Footage** keeps its native grain, scratches and compression.
- **Not added anywhere:** no halftone, chromatic aberration, vignette or light leaks. Web pages are flat; the 3D renders are glossy, with bloom.

### 4.5 Branding: logo bug, lower thirds, name cards, source lines, end card, series marks.
- **Bugs.** The Vox wordmark bug sits top-right (≈ 174 × 78 px; margins 3 % top, 1.6 % right). It **alternates every ≈ 30 s** (periods 30.0–31.4 s) with "PRESENTED BY / Colgate Total" (≈ 271 × 92 px). Each switch passes through a 20–28 f gap with no bug and is independent of cuts (1:30.16, 2:00.17, 4:04.18, 6:06.07 … 9:10.07). Matching fails on the light ground, so some switch times are unknown.
- **Ad.** An "AD" tag and logos sit top-left. It ends on a co-brand card: "Vox | Colgate Total | AN EXPLAINER STUDIO PRODUCTION".
- **Sourcing.** A source line under every chart (PubMed; Nutrition Business Journal; Glimpse), corner tags on clips, and journal pages shown as proof.
- **End card** (9:20.06).
  - A hard cut to a split card: a `#292929` credits panel with a white rule ending in **yellow dots**; on the black side, the wordmark (23 % H) and "PRESENTED BY".
  - The credit pages change 3×. They list 15 publication sources, "Images: Getty" and 6 music titles.
  - It is silent from 9:24.14.

## 5. Motion language
| aspect | measured |
|---|---|
| camera on footage | native only: 57 detected moves, almost all inside the footage |
| camera on graphics | holds are static between **reframe bursts** of 11–15 f (zoom ×0.87–1.27, pan up to 415 px). The speed is front-loaded and then settles (S85: 19.7, 19.4, 18.7, 18.1, 16.8, 7.3, 0 % per frame), i.e. ease-out. Bursts are timed to a word or an element: 4:18.12 on "gained", 2:19–2:28 on the battery stages, 9:01.23 on the swap. No "stop-dead" push and no drift: S128 moves ×1.012 in 13 s. |
| cadence (frame differencing) | **Most graphics: ≈ 15 drawings/s.** The motif `##.##.#.` (5 changes per 8 frames) is 15 fps conformed to 23.976. Measured on 14 segments: chart builds ×2, the line draw, the battery fill and reframe, the CREATINE type-on, the Greek morph, underline and gloss, 2 highlights, the focus swap, the page burst and the recap swap. **Twos:** the name-super letters and the Chevreul label. **Ones:** the name-super bar, "PRESENTED BY" and the credit fades. Footage is on ones. |
| entries | type-on: name super 18 f, Chevreul label 13 f, "CREATINE" 11 f (letters drop from above, grey → black). Checklist lines fade up ≈ 4 f; marks **pop in 1 f**. The area chart grows left to right in 24 f; the line chart draws in 54 f. Highlights sweep left to right in 7–17 f (median ≈ 10). |
| exits | hard cuts. Only the name super animates out: the bar retracts first, and the name is gone in 14–24 f. |
| annotation | yellow arrow (shaft, then head, 13 f), labels, underline (9 f), highlighter, isolate-blur. White anatomy line art draws over a B&W photo with dissolves (2:05.09–2:07.18). |
| charts | area ×2 (with an in-place swap at 0:27.20). Bar chart of actual vs projected, with a grey "Projected sales" panel, a yellow drawn curve and a "$557M" label. Line chart with a "+118% growth" end label. |
| maps / 3D / hand-made | no maps; 3D in 2 shots (7.9 s, stock-like medical renders); little hand-made feel (no boil or jitter) |

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |
|---|---|---|---|
| V-HC hard cut | 126 editorial (163 detected) | throughout | static, no momentum; 20 % fall in the pause before a narrator phrase |
| T-IC in-card cut | 5 | 0:09.13 (panel), 0:27.20 (chart), 4:23.19 (page → checklist), 6:49.01 (page → MMSE) | a plain swap on a held layout |
| T-PCap persistent caption | 1 | 1:03.05 the Chevreul label stays across the cut | the persistent element is a yellow annotation |
| T-CS card swap | 1 | 9:01.23, 16 f with a reframe (×1.154, pan −415 px) | — |
| T-WL word-lock montage | 1 | 0:05.14–0:07.10, three speakers say "Creatine.", each cut 0…−1 f before the word | clips, not photos |
| NEW-focus-scale-swap | 2 | 3:01.08, 5:45.18 (≈ 30 f) | — |
| NEW-music-reset-hole | 5 | 0:59.13, 3:03.06, 4:46.08, 5:45.18, 8:43.13 | our X-Drop/dip darkens the **picture**; here only the sound dips |
| NEW-stutter-jumpcut | 1 (4 jump cuts + ≈ 7 blur dissolves) | 6:27.02–6:31.02 ("cognition is a difficult thing to measure") | — |
| T-DS / X-Dissolve | ≈ 3 by the editor | 2:05.09, 3:16.03 (≈) | most of the 31 detected soft transitions are inside the sources (1:41.06, 0:10.11) |
| K-RackFocus (`src/transitions`) | 2 | 4:34.04, 2:56.08 | — |
| hard cut to the end card / into and out of the ad | 1 / 2 | 9:20.06; 4:46.08, 5:45.18 | no glitch build, no bumper |

**Not used:** blurThrough, spinSwap, glitchCut, drop, dip to black, push- or pull-through, whip, carousel.

## 7. Audio
### 7.1 Music: cue table | t0–t1 | style/instrumentation | BPM | mood/role | entry/exit (on a beat? pre-lap? hard?) | ducking under the voice (dB) |
Instrumentation not identified (no listening). Credited titles: *The Jitters, Task at Hand, Public Records, Passing Through, The Waiting Game, Focused Process*. There are ≈ 7 real cue changes; most of the 74 auto boundaries are holes.

| t0–t1 | style (measurable) | BPM | role | entry/exit | duck dB |
|---|---|---|---|---|---|
| 0:00.02–0:59.06 | steady pulse; music-only centroid 471 Hz | 69.5 (139) | hook, thesis, alone under the ident | in at f2 with an 8 f fade; out with a 16 f fade into a 13 f hole | −1.7…+0.7 |
| 0:59.19–2:07.18 | low-confidence pulse; the Ergomax ad's own audio 1:35–1:48 | ≈ 68/136 | history | in 6 f after the cut, 7 f before "In"; out by a change **on the cut** at 2:07.18 | −2.7 |
| 2:07.18–2:29.10 | darker (332 Hz) | ≈ 92 | ATP / 3D | change on the cut | ≈ −2.5 |
| 2:29.10–3:03.03 | darker (330 Hz) | ≈ 138 | battery / dose | change mid-shot; out into a 7 f hole | ≈ |
| 3:03.10–4:45.23 | brighter (671 Hz); 4–9 f near-silences between sentences | 130.5 | muscles | in 4 f after the cut; out with an 11 f hole, the ad cut inside it | −1.4…−2.5 |
| 4:46.08–5:44.18 | the ad's own bed | ≈ 97 | sponsor | hard in and out | — |
| 5:45.23–8:42.07 | one long cue (367 Hz), short holes | 68 | brain → turn | in 5 f after the cut, 12 f before "Now" | ≈ −1 |
| 8:43.16–9:24.14 | music-only tail from 9:19.24 | 95 | recap, last word | in 3 f after the cut; **hard stop** 4.3 s into the end card | — |

**Ducking:** effectively none.
- Pooled duck 0.56 dB; per excerpt −3.3…+0.7 dB.
- The phrase-onset trace moves −1.2 dB, with no ramp.
- Voice sits 9.3 dB over the bed.
- Loudness: −21.2 LUFS integrated, LRA 6.0 LU.

### 7.2 SFX inventory: | type | count | example timestamps | what it accompanies |
| type | count | example timestamps | what it accompanies |
|---|---|---|---|
| broadband transient (**unverified**: sync.json candidates, classified from context only) | 3 | 5:48.12, 7:11.10, 9:18.09 | coincides with the cut to the first web page, a page swap, and the last line |
| source-native sound | many | clips, TV ad, podcasts | quotes |
| transition whoosh / hit / sub-boom | 0 found | — | — |

### 7.3 Voice: VO pace (wpm), typical pause lengths, VO vs interview/archival audio share, any processing (phone EQ etc.).
- **Narrator:** female, 233.6 s (40.7 %), 3.64 w/s. Phrases: median 2.65 s, 10 words. Pauses: 31 of 0.5–1 s, 9 of 1–2 s, 2 of ≥ 2 s; 81 % of word gaps are < 0.1 s.
- **Other voices:**

  | voice | time | share |
  |---|---|---|
  | Tiller | 80.8 s | 14.1 % |
  | Taylor | 73.2 s | 12.7 % |
  | archival / social | 35.9 s | 6.2 % |
  | ad presenter | 48.1 s | 8.4 % |

  The experts have 106 s on face, so at least 48 s of their speech plays over b-roll or graphics.
- **Processing:** none added. The 6.8–12.6 kHz vs 0.95–4.3 kHz ratio is −11.6 dB for the narrator, −8.0 for Tiller, −18.0 for Taylor and −16…−23 for the clips: each source keeps its native, often duller quality. There is no phone EQ.
- **Music** runs under 99.7 % of the narration and under all the interviews.

### 7.4 Sync: cuts vs word onsets, cuts vs beats (from `<id>_sync.json`), text reveal vs the spoken word (offsets in frames), anything beat-locked.
| pair | result |
|---|---|
| cuts vs word onsets | ±2 f: 31.5 % vs null 43.7 % (p 1.0); **no word lock** |
| cuts vs narrator phrase onsets | **cuts lead by 0–12 f in 25.2 %** vs 7.5 % (p 0.002); median −3.7 f |
| context of each cut | mid-phrase 48 % · pause before a phrase 20 % · music edit 13 % · voice turn 12 % |
| cuts vs beats | ±2 f: 19.5 % vs 19.1 % (p 0.47); phase R 0.17 (p 0.048, weak); **not cut to the beat** |
| cuts vs music boundaries | ±2 f: 6.9 % vs 2.5 % (p 0.002, 2.8×); a cut leads the boundary by 0–12 f in 10.1 % vs 5.7 % |
| cuts/min by audio class | music-only 28.9 · narration+music 15.9 · archival voice 12.5 |
| text and annotation vs the word (12 measured) | −11…+6 f, **median ≈ +2 f**: "memory" highlight 0; "Linford" label +6; κρέας underline +4; CREATINE +1; "muscle candy" −11 |
| list items and marks | recap lines −1…+2 f; ✓ −4, ? −1, ✗ ≈ −16 f before the spoken answer |
| panels / charts / name super | panels 0, −2, −1 f to their words; the line draw starts on "grew" +2 f; the name super starts 2–3 f after the cut |
| beat-locked | nothing |

These are sync.json's statistics on the detector's 159 cuts (they include ≈ 20 ad cuts and the false positives, §0). The directions are robust.

### 7.5 Silence and structural sound: drops, dips, stingers, risers.
- **Silence** totals 17.1 s (3.0 %): 9.9 s is the end card (from 9:24.14), and the rest is 21 holes of 4–29 f.
- **Section reset (NEW-music-reset-hole), 5 times:** 0:59.06 (13 f), 3:03.03 (7 f), 4:45.23 (11 f, into the ad), 5:44.18 (29 f, out of the ad), 8:43.11 (5 f). Each time:
  1. the music fades in 14–16 f;
  2. the hole follows;
  3. the picture hard-cuts inside it;
  4. the new cue enters 3–6 f after the cut;
  5. the narrator enters 7–19 f after the cue.
- **Inter-sentence holes:** 16 more of 4–11 f at ≈ −45 dB in the muscle and brain cues, about half containing a cut. They are rests or edited drop-outs (≈).
- **Music alone:** only 13.8 % (79 s). The only real "music alone" moments are the ident (3.4 s) and the tail (4.6 s).
- **Not present:** stingers, risers, sub-booms, a drop to black and a mid-film dip.

## 8. Device catalogue
Stills and strips are in `analysis/stills/vox_creatine/`.

| ID | what this video does | count | timestamps | stills | differs from our spec? |
|---|---|---|---|---|---|
| NEW-light-grid-paper-ground | static light-grey paper `#EAEAEA` with faint grid; the ground for graphics and clips | 31.5 % of frames | 0:00.01, 0:24.07, 1:09.03, 4:23.19 | 1m13s_greek_word_card.jpg | new ground (ours: black collage) |
| NEW-vertical-social-panels | 9:16 clips on the ground: centred single, or 2–3 panels added left to right on word onsets; own captions kept | ≈ 16 editorial shots | 0:00.01, 0:07.10, 0:12.08, 3:03.06, 5:54.16, 8:03.13 | 0m03s_triptych_social_clips.jpg, strip_00016-00051 | new |
| NEW-claim-supercut | bites of 1.2–1.6 s from alternating podcasts, one claim each; influencer bites later | 2 | 0:18.16, 8:03.13 | — | new |
| T-WL | three speakers each say "Creatine.", cut on each | 1 | 0:05.14 | — | sources are clips |
| NEW-corner-source-tag | platform icon + handle, channel or owner ("Jenerise Ltd.", the lab), small, top-left | ≈ 50 shots | 0:14.08, 0:18.16, 1:31.06, 7:37.08 | 0m03s_triptych_social_clips.jpg | we have no on-image credit component |
| NEW-yellow-bar-lower-third (≈ R-NameCardInterview) | serif name, letters on twos (18 f); yellow bar wipes up on ones (12 f); grotesque role; no plate; first appearance only; exit 14–24 f | 2 | 0:34.01, 6:13.17 | 0m37s_name_card_tiller.jpg, strip_00812-00847 | ours: decode card + interview window on a plate |
| NEW-document-isolate-blur | the page defocuses; one sentence strip lifts sharp with a shadow (13 f); then the highlight | 4 | 1:25.18, 1:29.09, 6:44.07, 7:12.01 | 1m27s_newspaper_isolate_highlight.jpg, strip_02026-02073 | new |
| VX-5 / SIG-VX-5 (K-Highlighter) | flat lemon band (5.5 % H) sweeps left to right in 7–17 f over newspaper, web and journal text | ≈ 14 | 1:26.08, 1:49.04, 3:30.20, 4:19.00, 5:49.00 | 5m52s_web_article_highlight.jpg | ours: on printed paper; here flat and digital |
| PD-4 (K-SketchArrow, K-AnnotationLabel) | yellow drawn arrow (13 f) + 2-line yellow caps label on a portrait | 2 | 1:02.02, 1:20.04 | 1m03s_arrow_label_portrait.jpg, strip_01484-01531 | yellow; no desk |
| T-PCap | the label persists across a cut to a second portrait | 1 | 1:03.05 | strip_01484-01531 | — |
| NEW-word-morph-etymology (K-Typewriter, K-MarkerUnderline) | "CREATINE" types on (11 f) → morphs letter by letter into κρεατίνη (11 f, ending on "Greek") → root underline (9 f) → italic gloss | 1 | 1:09.03 | 1m13s_greek_word_card.jpg, strip_01657-01704 | new |
| R-DataChart / PD-8 | area, bar (actual vs projected + drawn curve + value label) and line (end label) charts; title, italic axis, source line; word-locked builds | 4 | 0:24.07, 0:29.23, 1:56.05, 6:08.11 | 0m32s_area_chart_sponsor_bug.jpg, 6m13s_line_chart_growth.jpg | ours: counter or bars in the Earworm look |
| SIG-VX-4 (K-DrawPath) | white anatomy line art drawn over a B&W arm photo | 1 | 2:05.09 | — | on a photo |
| NEW-3d-medical-render | saturated 3D mitochondria with "ATP" particles and capsules | 2 | 2:07.18 | — | new |
| SIG-VX-7 (K-DiagramCard) | flat vector batteries that fill and drain; functional colours; a red duotone figure | 1 (32 s) | 2:17.18 | 2m46s_battery_diagram.jpg | ours: on black cards |
| E-SZ / SIG-ED-3 (≈) | reframe bursts on graphics: 11–15 f, ×0.87–1.27, ease-out, word-timed | ≈ 8 | 2:19.24, 2:28.07, 4:18.12 | — | not "stop dead"; no drift between |
| NEW-engraving-section-icon | 19th-c. engravings (arm, brain) as section icons, re-used on the verdict and recap cards | 5 | 2:59.09, 5:45.18, 8:43.13 | 3m00s_engravings_arm_brain.jpg | new |
| NEW-focus-scale-swap | the active icon grows and sharpens; the other shrinks and blurs (≈ 30 f) | 2 | 3:01.08, 5:45.18 | strip_08290-08337_focus_swap_chapter.png | new |
| NEW-verdict-checklist | question lines; ✓/?/✗ pop on the spoken answer; recap mode adds one item per keyword | 3 cards | 4:23.19, 8:43.13, 9:01.23 | 4m33s_verdict_checklist.jpg, 9m11s_recap_brain_checklist.jpg, strip_06370-06417 | new |
| NEW-fullframe-archival-broll | 1920s–70s educational film, full-frame, native colour; literal or ironic | ≈ 27 shots, 67 s | 0:46.15, 0:59.13, 3:20.21, 3:57.23, 7:28.12 | — | ours: B&W cut-outs on black |
| archival TV / ads | 1992 race (one shot), the 1993 Ergomax excerpt with its own audio and cuts, Rio 2016 | ≈ 6 shots | 1:21.10, 1:31.06, 3:16.03 | — | same |
| NEW-stutter-jumpcut | 3–8 f jump cuts + 3 f blur dissolves within one clip | 1 | 6:27.02 | — | new |
| T-IC / T-CS | in-place swaps / recap card swap | 5 / 1 | 0:27.20, 4:23.19, 6:49.01 / 9:01.23 | — | no paper motion |
| interview (remote, full-frame) | MCU, eyes to the lens, mic in frame, music under it | 19 shots | 0:33.23 … 9:11.23 | 0m37s_name_card_tiller.jpg | ours: windowed on a plate |
| NEW-brand-ident-over-footage | wordmark pop + "PRESENTED BY" (1 letter/f) + sponsor logo over archival, music alone, then a hole | 1 | 0:55.09 | 0m59s_vox_ident_presented_by.jpg, strip_01370-01417 | build a generic one; never Vox marks |
| NEW-sponsor-bug-rotation | Vox bug ↔ sponsor bug every ≈ 30 s through a 20–28 f gap | ≈ 16 | 1:30.16, 2:00.17, 6:06.07 | 0m37s_name_card_tiller.jpg | new |
| NEW-midroll-sponsor-ad | 59.4 s produced ad, own host, AD tag, co-brand card | 1 | 4:46.08 | — | new |
| NEW-music-reset-hole | silent hole at section cuts (§7.5) | 5 | 0:59.06, 3:03.03, 5:44.18 | — | ours dips the picture as well |
| R-EndCard (≠) | silent split card: credits with a yellow-dotted rule; wordmark + "presented by" | 1 | 9:20.06 | 9m27s_end_card_credits.jpg | ours: glitch build, music to the last frame |

**Earworm signatures absent:** SIG-EW-1 (keyword pops), 2, 3, 4, 6 (karaoke), 7, 8, 9, 10, 11 and 12. There is no torn paper, tape, sticky note or desk either.

## 9. What our framework would need to make this video
1. **A `voxFactCheck` theme.** Static light grid-paper ground `#EAEAEA`; near-black `#262626` heavy grotesque in sentence case; one lemon-yellow annotation accent; a functional diagram palette; a serif name super. It also needs **a 15 drawings/s graphics clock** (2-2-1-2-1 holds at 23.976) beside our 12/s. Evidence: 0:24.07, 1:09.03, 4:23.19; §5.
2. **NEW-vertical-social-panels + NEW-corner-source-tag recipe.** 1–3 clips at 9:16 on the ground, added on word onsets, with a platform tag and their own captions and audio; plus rights-checked clip sourcing. Evidence: 0:00.01, 5:54.16, 8:03.13.
3. **A screen-capture `R-DocumentHighlight` variant.** Full-frame page; reframe burst; flat highlighter on the keyword (+2 f, 7–17 f); NEW-document-isolate-blur. Evidence: 1:24.12, 3:28.16, 5:48.13, 6:40.16.
4. **NEW-verdict-checklist recipe.** ✓/?/✗ on the answer (−4…−1 f), an engraving on the right, a recap mode (lines on keywords 0 ± 2 f), a 16 f card swap. Evidence: 4:23.19, 8:43.13, 9:01.23.
5. **A `FootageBroll` recipe** (full-frame archival, stock or handout clips with their native grade, no cut-out), and **a full-frame remote `interview`** with NEW-yellow-bar-lower-third. Evidence: 0:46.15, 3:57.23, 0:33.23, 6:13.14.
6. **Audio model.** A continuous, unducked bed ≈ 9 dB under all voices; NEW-music-reset-hole at section cuts; a silent end card. Evidence: 0:59.06, 3:03.03, 5:44.18, 8:43.11, 9:24.14.
7. **The Vox data-chart style for `R-DataChart`.** Area, line and bar with a projected panel; title, italic axis and source line; end label; drawn callout; word-locked builds. Evidence: 0:24.07, 1:56.05, 6:08.11.
8. **Timing defaults.** `text` +2 f (not −7); cuts 0–12 f before phrase onsets; no beat lock.
9. **NEW-word-morph-etymology** (1:09.03), and **NEW-engraving-section-icon + NEW-focus-scale-swap** as the chapter device, using PD engravings (2:59.09, 5:45.18).
10. **Graphic camera:** E-SZ reframe bursts (11–15 f, ease-out) as CameraRig keys; holds static. Evidence: 2:19.24, 4:18.12.
11. **NEW-claim-supercut / T-WL** for multi-source bites. Evidence: 0:05.14, 0:18.16.
12. **Generic branding blocks,** never Vox marks: NEW-brand-ident-over-footage, NEW-sponsor-bug-rotation, an ad slot, and a silent split credits card (a non-glitch `R-EndCard`). Evidence: 0:55.09, 4:46.08, 9:20.06.
13. **Minor:** NEW-stutter-jumpcut (6:27.02), NEW-3d-medical-render (2:07.18), SIG-VX-4 over a photo (2:05.09).

## 10. Evidence index
All files are in `analysis/stills/vox_creatine/` unless a path is given.

| file | time | what it shows |
|---|---|---|
| 0m03s_triptych_social_clips.jpg | 0:03.17 | three 9:16 TikToks with handle tabs; Vox bug |
| 0m20s_podcast_source_label_name_super.jpg | 0:20.14 | podcast clip with a channel tag and the source's own name super |
| 0m32s_area_chart_sponsor_bug.jpg | 0:32.14 | area chart, title and source line; sponsor bug |
| 0m37s_name_card_tiller.jpg | 0:37.12 | yellow-bar serif name super; remote interview |
| 0m59s_vox_ident_presented_by.jpg | 0:59.06 | ident over B&W archival |
| 1m03s_arrow_label_portrait.jpg | 1:03.00 | yellow arrow + caps label |
| 1m13s_greek_word_card.jpg | 1:13.00 | κρεατίνη, underline, italic gloss, grid paper |
| 1m27s_newspaper_isolate_highlight.jpg | 1:27.12 | isolate-blur strip + highlighter |
| 2m46s_battery_diagram.jpg | 2:46.00 | battery diagram, functional colours |
| 3m00s_engravings_arm_brain.jpg | 3:00.12 | engraving section icons |
| 4m33s_verdict_checklist.jpg | 4:33.14 | ✓ ? ✗ verdict |
| 5m52s_web_article_highlight.jpg | 5:52.07 | web article highlight |
| 6m13s_line_chart_growth.jpg | 6:13.07 | line chart, "+118% growth" |
| 9m11s_recap_brain_checklist.jpg | 9:11.14 | recap card (brain) |
| 9m27s_end_card_credits.jpg | 9:27.10 | silent split end card |
| strip_00016-00051_triptych_panel_entry.png | f16–51 | panels added on "little" and "wellness" |
| strip_00812-00847_name_card_build.png | f812–847 | name letters on twos; bar wipe |
| strip_01370-01417_vox_ident.png | f1370–1417 | "PRESENTED BY" type-on |
| strip_01484-01531_arrow_label_drawon.png | f1484–1531 | arrow and label draw-on; label persists across the cut |
| strip_01657-01704_greek_word_card.png | f1657–1704 | type-on → Greek morph → underline |
| strip_02026-02073_newspaper_isolate_highlight.png | f2026–2073 | blur + strip lift → highlight |
| strip_06370-06417_checklist_mark.png | f6370–6417 | ✓ pop; the next line fades up |
| strip_08290-08337_focus_swap_chapter.png | f8290–8337 | arm ↔ brain focus-scale swap |
| analysis/sheets/vox_creatine/sheet_003, 009, 011, 017, 022, 023, 025, 026, 030 | — | claims montage; Ergomax; ATP/3D; verdict + ad cut; web/TikTok; MRI + Taylor; journal + MMSE; brand ads; influencer TikToks |
| analysis/audio/vox_creatine_sync.json | — | alignment, silence gaps, ducking, music boundaries |
