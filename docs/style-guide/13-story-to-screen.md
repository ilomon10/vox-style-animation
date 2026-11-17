# 13 · Story to screen: from a one-line idea to script, shot plan and soundtrack

This is the **editorial layer** of the framework. It answers four questions before anything is rendered:
- what to say, and in what order;
- how long each part may be;
- which picture carries each claim;
- which sound sits under it.

Every rule below was measured on the Vox *Earworm* episode "Quiet Storm" (153.7 s): see `analysis/earworm-editorial.md`, cited as **E** with its section number. Timing in frames comes from `11-audio-sync.md`; the look comes from `12-vox-earworm.md`. The storyboard engine, the commands and the recipe props are in `14-production-pipeline.md`. The agent playbook that runs the whole chain is `.claude/skills/vox-video/SKILL.md`.

The script markup in §6 is the one parsed by `tools/voice/script_markup.py`. The recipe names in §7 are the ones in `src/recipes/index.ts` and `src/studio/storyboard.schema.json`.

## 0 · The model in twelve rules

1. **Tell a story, not a lecture.** The order is:
   - setting
   - hook
   - context
   - expert voice
   - turn
   - event
   - demonstration
   - thesis
   - payoff
   - handoff

   Context takes about a third of the runtime. The subject's name can wait until about 80 % of the runtime (E §1).
2. **Open with time, then place.** For example: "The year is 1976. The place is Washington, DC, and we're at…". That is 3–4 nested places in under 10 s, in the present tense (E §4.7).
3. **The narrator talks about 45 % of the time.**
   - 3.5 words/s while speaking, which gives ≈ 94 narrator words per minute of video.
   - The rest belongs to the sources: ≈ 20–22 % archival or expert voices, ≈ 28 % music alone, ≈ 4 % silence (E §4.5).
4. **No rhetorical questions.** Pose a question as a statement ("…you have to listen to *this*", "Something changed one summer night in 1976") and let the next element answer it, usually within 1 s (E §1).
5. **"You" only at the hook and the payoff** (3 per film). There is no meta-talk ("in this video", "let's") (E §4.2).
6. **One idea per composition.**
   - A new composition every ≈ 4 s, a picture event every ≈ 0.75 s.
   - A list becomes one card or one object per item.
   - A long "stage" shot is allowed only if it transforms once per idea (E §6).
7. **The claim type picks the picture.**
   - dates → digits
   - places → collage, then map + label
   - persons → face + name card, or a newspaper clipping
   - facts → archival photos
   - concepts → a camera move through an object that embodies them
   - sensory descriptions → physical builds plus literal mix moves
   - music → its source object + label + visualizer
   - quotes → the real recording with captions

   No paraphrased quotes (E §3.5).
8. **Typeset nouns, never claims.**
   - Type is on screen ≈ 64 % of the time, ≈ 11 type events per minute.
   - Only ≈ 11 % of the narrator's words are typeset: names, dates, category nouns.
   - Every word of a featured archival voice is typeset (E §3.6–3.7).
9. **Let the sources speak alone.**
   - The first source plays alone within 16 s.
   - Featured music plays 3–6 s without narration, with its source on screen.
   - Songs and narration take turns (E §4.6).
10. **The music changes every ≈ 6 s, at topic joints.**
    - Remove it under key lines.
    - Use silence before payoffs.
    - Cuts follow music edits, never the beat (E §3.8, §5).
11. **Experts:**
    - The voice comes first and the face later.
    - The narrator names them *after* the bite: "That's [NAME]. She's a [ROLE] who [works] at [PLACE]."
    - The name card resolves on the surname.
    - A witness may introduce herself through her bite.
    - The thesis is delivered by an expert after the narrator's "…it goes much deeper than that" (E §4.3).
12. **End on the source.**
    - The last narrator line names the final element as a verbless fragment.
    - Archival audio has the last word.
    - The series card cuts in on a bass hit, and the music runs to the last frame (E §4.7).

## 1 · The method at a glance

All files live in `video-projects/<slug>/` (scaffold: `tools/py tools/studio/new_project.py <slug> "<idea>"`).

| Step | Do | Output | § |
|---|---|---|---|
| 1 | Turn the idea into a premise card | top of `RESEARCH.md` | 2 |
| 2 | Answer the research questions; one sourced fact per claim | `RESEARCH.md` (fact sheet) | 3 |
| 3 | Pick a structure template and fill the beat sheet | `SHOTLIST.md` (beat sheet) | 4 |
| 4 | Write the voice-over with markup | `script.md` → `script.parsed.json` | 5, 6 |
| 5 | Shot plan: claim type → recipe, asset, audio | `SHOTLIST.md` (shot plan); `[BEAT …]` tags | 7 |
| 6 | Asset shopping list → sourcing | `SHOTLIST.md` (shopping list) → `assets/` + `CREDITS.md` | 8 |
| 7 | Music plan → sourcing or a generated bed | `[MUSIC …]` tags → `audio/music/` (+ `MUSIC_WANTED.md`) | 9 |
| 8 | Scratch VO → cues → `storyboard.json` → validate → render → QA | doc 14 | 10 |

`SHOTLIST.md` is for humans and the agent only; no tool reads it. Everything a tool needs is in `script.md` (§6) and `storyboard.json` (doc 14).

## 2 · Step 1: the premise card

Fill every line before researching. A line you cannot fill becomes a research question.

```
IDEA        one line, as the user gave it
SUBJECT     the noun the film is about (it may be named late, at ≈80 %)
WHEN        the year/season/night of the turn (+ the opening year if different)
WHERE       city → building → room (3–4 nested places)
HOOK SOURCE the archival artifact that makes the subject audible or visible in 3–8 s
CONTEXT     2–3 facts about "before"; the institution that carried it
TURN        "Something changed …" in ≤ 7 words
EVENT       who or what made the change (the protagonist)
THESIS      "[surface] is [true], but it goes deeper: [mechanism]", and who can say it (expert or archive)
PAYOFF      ingredient A + ingredient B + the surprising C (noun phrases)
LAST WORD   the archival moment that ends the film
NUMBER      the one number that sums it up (optional)
FORMAT      60 s | 3 min | 8 min   MODE story | argument   LOOK voxEarworm (default) | voxExplainer | …
```

**Mode**:
- **story**: culture, history, a person or an event. Narration ≈ 45 %.
- **argument**: policy, science, how something works. Narration ≤ 55 %, numbers allowed as diagrams (§7).

## 3 · Step 2: research questions and the fact sheet

Ask these questions in order. Each answer becomes one or more facts with a source. The claim type of the answer tells you which asset you will need (§7).

| # | Question | Fills | Claim type | Asset it must produce |
|---|---|---|---|---|
| R1 | When exactly did it turn (year, season, night, hour)? | setting, turn | date | none (type), or a dated document |
| R2 | Where, from city down to room? | setting | place | 3–6 landmark photos; 1 map if an address matters |
| R3 | Which archival artifact makes the subject heard or seen in 3–8 s (record, speech, broadcast, document)? Is it licensable? | hook | music / quote | the recording or scan **plus its source object** (record, radio, phone, gavel, page) |
| R4 | What was normal before? (2–3 facts) | context 1–2 | fact | 1 photo per fact |
| R5 | Which institution or group carried it? | context | place / concept | photo of the place; an object that embodies it |
| R6 | What changed, when, and who did it? | turn, event | date, person | portrait; a dated newspaper headline |
| R7 | What preconditions made it possible? (a list of 3–4) | context 3 (montage) | fact list | 1 object per item |
| R8 | How does it work: what is the mechanism? | thesis | concept, causal link | the object that embodies the mechanism |
| R9 | Who can interpret it with authority (scholar)? Who lived it (witness)? What is each one's single key line? | expert slots | quote | interview recordings, bites of 4–8 s |
| R10 | What did it look, sound or feel like? Give 2–3 sensory words, with evidence | payoff, demonstration | sensory | props, recordings |
| R11 | Which 1–3 examples demonstrate it best? | demonstration | musical example / quote | PD, CC0 or licensed recordings, documents |
| R12 | What are the 2–3 ingredients or consequences? Which one is the surprising third? | payoff | concept | props reused for the recap |
| R13 | Which archival moment can have the last word? | ending | quote | recording + source object |
| R14 | Is there one number that sums it up? | payoff | number | type / data chart |

**Fact sheet** (`RESEARCH.md`, 6–12 facts for 60 s and ≈ 15–40 for 8 min):

```
| F# | claim (one sentence, as it will be said) | type | slot | exact wording / number | source (title, URL, date checked) | asset id | rights | verified |
```

Rules:
- Primary or official sources first.
- Never invent facts, quotes, statistics or experts.
- A quote enters the script only as a real recording or a scanned document (`[ARCHIVAL …]`).
- An expert slot without a real interview stays a placeholder (§11 shows one). Unverified facts are dropped or hedged ("by most accounts").

## 4 · Step 3: structure

§4.1–4.5 are **Earworm-derived**: one 154 s story-mode episode. §4.6 gives the ranges measured on six other Vox videos by format, and §4.7–4.8 add a long-form (10–20 min) and a conversation template. Evidence: `analysis/vox-framework-coverage.md`.

### 4.1 The arc (Earworm-derived)

Earworm's measured arc (E §1), with the narration density each slot needs. Density = narrator words per second of the slot; use it to budget words.

| Slot | Function | Earworm share | Narration density | Must contain |
|---|---|---|---|---|
| setting | orient: when, then where | 6.8 % | 1.8 w/s | date + nested places; digits → collage → map / label |
| hook | promise in 2nd person + the first source alone | 9.0 % | 1.2 w/s | "But if you want to really understand X, you have to [listen to / see] this." → source ≥ 3 s (7 s in long form) |
| context | the world before; the institution; the preconditions | 35 % (3 blocks) | 1.8–2.3 w/s | facts and lists, one composition per item; 1 witness bite |
| expert | interpretation by an authority | 12–14 % | 0.9 w/s (ID lines only) | voice first, face later, narrator ID after the bite |
| turn | open the main question | 2.4 % | 1.9 w/s | "Something changed [when]." over a **held** picture → black / silence |
| event | answer the turn: who and what | 6.6 % | 2.5 w/s | document (newspaper) → portrait collage |
| demonstration | the viewer hears or sees the thing | 10 % | 0 | the source in the clear, with label + visualizer |
| thesis | the mechanism | 5.6 % | 1.6 w/s | narrator "…it goes much deeper than that" + an expert states it |
| payoff | ingredients A + B, reveal C | 8.6 % | 2.6 w/s | "So, you have A and B. But something else … ties it all together. C." |
| ending | handoff | 4.7 % | 0 | archival C as kinetic type → series card on a bass hit |

Structural marks:
- a chapter dip at ≈ 35 %;
- the turn at ≈ 48 %;
- the drop (fade to black → new music) right after the turn;
- the act-break dip at ≈ 79 %, used once;
- the thesis right after the act break.

### 4.2 Targets per minute of video (Earworm-derived)

| Quantity | Target per minute | Earworm (E) |
|---|---|---|
| Narrator words | **94** (story 85–105; argument up to 115). Count a spoken year as 1 word | 92–94 |
| Narrator speech | 27 s = **45 %** (argument ≤ 55 %) | 45 % |
| Articulation rate | **3.5 words/s** (208 wpm) | 3.47 |
| Narrator sentences | **7**, mean **13 words** (60 s pieces: 8–14), max 25; ≥ 1 sentence ≤ 7 words per section | 7.0; 13.1; 3–25 |
| Phrases | 14 per minute, 5.5 words / 1.6 s each | 14 |
| Pauses | phrase **0.5 s** (0.34–0.88); sentence ≈ **1.0 s**; section 1.5–2 s + music | 0.48; 1.0 |
| Other voices (experts + archival speech) | 12–13 s (≈ 20 %); 1.5–2 bites; bite 4–8 s | 20–22 % |
| Music alone (incl. featured songs) | 17 s (≈ 28 %); ≥ 1 featured source alone for 3–6 s | 28 % |
| Silence (true silence) | 2–3 s, as holes of 8–17 f; plus 2–4 dry lines without music | 4 % + 6 % dry |
| Compositions (setups) | **15** (one per 4 s); shots 9–10 (median 5 s) | 14.8; 9.4 |
| Picture events | ≈ 80 (one per 0.75 s) | 1.36 / s |
| Type events | **9–13** (60 s pieces: up to 15); type on screen 50–70 % of the time | 10.9; 64 % |
| Narrator words typeset | ≤ 15 % (≈ 11 %), nouns only | 11.5 % |
| Music boundaries (start / stop / change) | **8–12**; distinct cues ≈ 6; excerpts ≈ 7 s | 10.5; 5.9; 6.9 s |
| SFX | 4–7, only sources and structure | ≈ 6.6 |
| Open loops (setup → payoff) | 2; payoff ≤ 1 s later, except the turn (≤ 20 s) | 2.0 |
| "you" / rhetorical questions | ≤ 1.2 / **0** | 1.2 / 0 |

**Duration of a sentence**: `words / 3.5 + 0.15 s per comma, colon or semicolon`. The parser then adds 0.48 s after a sentence and 0.9 s after a paragraph (§6.1). A spoken year ("eighteen oh six") takes about 2–3 words' time.

### 4.3 Template: 60 s (Earworm-derived)

| # | Slot | t (s) | % | Words | Content rule |
|---|---|---|---|---|---|
| 1 | setting | 0–6 | 10 | 10–15 | "The year is … The place is …, and …" |
| 2 | hook | 6–12 | 10 | 10–15 | promise ("you have to see / hear this") → the source alone ≥ 1 s |
| 3 | context | 12–25 | 21 | 30 | 2–3 facts, one composition each; a list = 1 card per item |
| 4 | turn | 25–28 | 5 | 4–7 | "Something changed in [YEAR]." over the held picture → short drop |
| 5 | source / demonstration | 28–34 | 10 | 0 | archival voice, document or music alone (3–7 s) |
| 6 | thesis | 34–41 | 12 | 10–15 | the mechanism, ideally from an expert or archival bite; + a 2–3 s data beat |
| 7 | payoff | 41–51 | 17 | 25–30 | "So, you have A and B. But … ties it all together. C." |
| 8 | ending | 51–60 | 15 | 0 | archival last word (4–6 s) → series card on a bass hit |

Totals: ≈ 90–105 narrator words; 12–16 compositions; 1 drop and no dip; 8–10 music boundaries.

### 4.4 Template: 3 min (180 s) (Earworm-derived)

| # | Slot | t (s) | % | Words | Notes |
|---|---|---|---|---|---|
| 1 | setting | 0–11 | 6 | 20 | |
| 2 | hook | 11–27 | 9 | 19 | the source alone ≥ 5 s |
| 3 | context A | 27–45 | 10 | 34 | setup → payoff sentence ("…this explains why." → answer) |
| 4 | expert 1 + ID | 45–61 | 9 | 14 | voice first; chapter dip at the end (≈ 34 %) |
| 5 | context B (+ witness bite) | 61–83 | 12 | 40 | the institution; a list as word cards |
| 6 | turn + drop | 83–88 | 3 | 10 | |
| 7 | context C (montage) | 88–106 | 10 | 41 | 1 crane; objects cross centre on their nouns |
| 8 | event / protagonist | 106–119 | 7 | 32 | newspaper → portrait collage |
| 9 | demonstration | 119–133 | 8 | 0 | 1–2 sources in the clear |
| 10 | expert 2 → act break | 133–142 | 5 | 0 | dip to black + silence (≈ 79 %) |
| 11 | thesis + expert confirmation | 142–152 | 5.5 | 16 | |
| 12 | payoff | 152–170 | 10 | 47 | stage → spin-swap → recap |
| 13 | ending | 170–180 | 5.5 | 0 | |

Totals: **≈ 275 words**, 40–48 compositions, 2 expert voices / 3–4 bites, 2 demonstrations, 27–33 music boundaries.

### 4.5 Template: 8 min (480 s) (Earworm-derived)

Three acts. Act 1 ≈ 35 %, act 2 ≈ 40–44 %, act 3 ≈ 21–25 %. The context → expert → demonstration cycle repeats per act.

| # | Slot | s | Words | # | Slot | s | Words |
|---|---|---|---|---|---|---|---|
| 1 | setting | 14 | 25 | 10 | demonstration 1 | 20 | 0 |
| 2 | hook (source alone ≥ 7 s) | 26 | 31 | 11 | expert 2 (witness) | 26 | 16 |
| 3 | context A | 48 | 91 | 12 | complication / second turn | 34 | 68 |
| 4 | expert 1 + ID | 30 | 27 | 13 | demonstration 2 | 18 | 0 |
| 5 | context B | 44 | 79 | 14 | **act-break dip** (≈ 75–79 %) | 4 | 0 |
| 6 | chapter dip (≈ 35 %) | 4 | 0 | 15 | thesis + expert 3 | 32 | 32 |
| 7 | turn + drop | 10 | 19 | 16 | demonstration 3 | 14 | 0 |
| 8 | context C (montage) | 40 | 92 | 17 | payoff | 46 | 120 |
| 9 | event / protagonist | 40 | 100 | 18 | ending (last line + archival) | 30 | 9 |

Totals: 480 s, **≈ 710 words** (89 per minute), ≈ 120 compositions, 3 experts / 6–9 bites, 3–5 demonstrations, 80 ± 15 music boundaries, 1 dip used as the act break plus 1 chapter dip, 1 drop.

### 4.6 Per-format metric ranges (cross-series)

§4.1–4.5 come from one *Earworm* episode in story mode. Six other Vox videos (2019–2026) measure differently by format. Pick the column of the closest format; keep §4.2 for story mode. Per-video numbers, caveats and sources: `analysis/vox-framework-coverage.md` §2.

| Per minute of video unless noted | Story (Earworm-derived, §4.2) | Data argument (2020) | Expert fact-check (2026) | Viewer question, host-reporter (2024) | Host-led archive history (2019) | Map / Atlas (2019) | Conversation, 20 min (2026) |
|---|---|---|---|---|---|---|---|
| narrator words | 94 (85–105) | ≈ 150 | ≈ 90–100 | ≈ 120 | ≈ 85 | ≈ 100 | no narrator (≈ 185 words of speech) |
| articulation (words/s) | 3.5 | 3.4 | 3.6 | 3.3 | 3.35 | 3.4 | ≈ 3.4 |
| narration, % of runtime | 45 | ≈ 75 | 40–47 | 55–61 | ≈ 43 | ≈ 50 | 0 |
| other voices, % | ≈ 20 | ≈ 5 | ≈ 33 (experts 27) | ≈ 25 | ≈ 31 (archival speech) | ≈ 30 (interviews + archival) | 99 (host + guest) |
| music alone, % | ≈ 28 | ≈ 16 | ≈ 14 | ≈ 12 | ≤ 26 | ≈ 33 | 0 |
| sentence length (words) | mean 13, max 25 | median 15, max ≈ 50 | median 13, max 34 | median 17, max ≈ 50 | median 10, max 39 | median 14, max 35 | host 9, guest 19 |
| narrator questions per film | 0 | 2–3 (the thesis) | 1 signpost + a verdict triple | 3 + the viewer's question | ≈ 6, each answered within 2 s | 1 | 7 host questions = the chapters |
| picture changes | 15 compositions | ≈ 7 scenes (2–3 hard cuts) | ≈ 16 | ≈ 16 | ≈ 18 | ≈ 16 cuts (≈ 19 compositions) | ≈ 2 |
| median shot | 5 s (set-up 4 s) | ≈ 7 s | ≈ 2.8 s | ≈ 2.3 s | ≈ 2.0 s | ≈ 2.3 s | ≈ 29 s |
| type on screen | 50–70 % | ≥ 60 % (charts) | ≈ 23 % | not measured | not measured | not measured | ≈ 2 % |
| music | 8–12 boundaries, ≈ 6 cues | ≈ 1.4 cues | ≈ 0.8 cues | ≈ 1.2 cues | ≈ 1.6 cues | ≈ 0.85 cues | none |
| bed under speech | ≈ −10 dB, ridden | ≈ −19 dB, static | ≈ −9 dB, static | ≈ −14 dB, static | ≈ −13 dB, static | ≈ −7 dB, static | — |
| SFX (unverified outside Earworm) | 4–7 | ≤ 1 | ≤ 0.5 | ≤ 1.5 | ≈ 1 | ≤ 0.5 | 0 |
| chapter joints | dips at ≈ 35 % and ≈ 79 % | 9–24 f music hole + hard cut | 5–29 f hole + hard cut | 11–14 f hole + a question card | 6–11 f hole + hard cut | 7–27 f hole + hard cut; one fade act break at 85 % | the host's next question |
| series card | at the end (98 %) | after the question (14 %) | after the thesis (10 %) | after the question (11 %) | after the thesis (16.5 %) | after the question (13.5 %) | spoken only |
| sources on screen | — | "Source:" lines | a source line per chart, corner tags on clips | documents as proof | documents | source lines, corner credits | none |

### 4.7 Template: long form (10–20 min)

Measured on Vox's 8–12 min explainers (2019–2026). The shares scale with the runtime. **Not Earworm-derived.**

| # | Slot | Share | Content rule | Measured in |
|---|---|---|---|---|
| 1 | cold open | 3–13 % (≤ 90 s) | the sources speak first: a news or claims supercut, an archival scene with no narration, or a first-person anecdote; 25–36 cuts per minute | all five explainers (2.8–12.5 %) |
| 2 | question / thesis | 1–9 % | ask the one question once ("So why…?", "The question is: …", or the viewer's own question); the subject is named by now | question at 2.8–12.8 % |
| 3 | series ident | 0.7–1.5 %, at 10–17 % | your own series card, music alone, then a 6–24 f hole (or a drop) and a hard cut | 5 of 5 (9.6–16.5 %) |
| 4 | chapters (3–7) | 10–20 % each (2–3.7 min) | context → mechanism or demonstration → evidence, with an expert bite (voice first) where there is one. Each chapter opens on a music-reset hole of 5–29 f and a hard cut, optionally with a chapter or question card. A data stage may hold 15–45 s if it changes once per idea | all |
| — | sponsor slot (optional) | 6–10 %, at 25–60 % | a one-line cliffhanger before it; outside the series look; a hard return into the argument | 2 of 5 |
| 5 | turn | 2–13 %, at 53–89 % | a "But…" chapter: what the evidence does not settle, or who benefits; a hole or a drop before it | turns at 53–89 % |
| 6 | payoff / recap | 2–9 %, at 80–91 % | the answer said plainly; a recap device (checklist, recap card or spoken recap) | 80–91 % |
| 7 | ending | 1–13 % | an aphorism, a moral imperative, or the expert's or source's last word | all |
| 8 | credits / outro | 3–8 % | a credits split panel; a host outro or promo beside it is optional; silent credits are allowed | 6 of 6 |

Totals for 12 min: ≈ 1,050–1,450 narrator words (≈ 90–120 per minute; up to ≈ 150 in a data argument) and 40–60 % narration (up to ≈ 75 % in a data argument); 170–230 cuts (14–18 per minute; a data-paper film instead has ≈ 7 scenes per minute that change in place); 8–15 music cues, one per chapter; 3–6 reset holes; at most one dip or drop; one ident and one credits card; ≤ 15 SFX.

**Recipes for these slots** (doc 14 §3):

| Slot | Recipe | Settings |
|---|---|---|
| 1 cold open | `FootageClip` | sources speak first, with their own sound and a corner source tag |
| 3 series ident | `SeriesIdent` | `overPicture` or `card` |
| 4 chapter joint | the next scene's transition | `transitionIn: {kind: "cut", hole: 12}` |
| evidence | `DocumentHighlight` v2 | highlighter, `isolate`, `readAlong` and `source` |
| expert | `NameCardInterview` or `FootageClip` | `card: "lowerThird"` (with `layout: "fullframe"`) or `lowerThird` |
| 8 credits | `EndCard` | `mode: "credits"` |

Use the `standard` profile (doc 11 §10): any look other than `voxEarworm` gets it.

### 4.8 Template: conversation (≈ 20 min)

Measured on one remote two-person conversation (2026). **Not Earworm-derived.** The storyboard cannot make it yet: it needs a full-frame clip player, a lower third and a two-up layout (`analysis/vox-framework-coverage.md` §6).

| # | Slot | Share | Content rule |
|---|---|---|---|
| 1 | spoken open | ≈ 3 % (0:00–0:33) | greeting + collaboration label → the stakes in 3 sentences → the limit ("Of course, there are limits…") → host self-intro → guest intro. Host single, then the two-up on the guest's name. The host's lower third starts ≈ 1 s before her name |
| 2–8 | Q1–Q7 | 9–18 % each (2–3.7 min) | the host asks in the two-up; the guest answers in his full-frame single. Switch every 11–76 s (median 29 s), in the breath before a sentence; back to the two-up for the end of the answer and the next question. Order the questions near-term → long-term: Q5 is the realism check (the turn, ≈ 52 %), Q6 a new arena, Q7 the long horizon (the payoff, ≈ 82 %). The guest's lower third comes on his first single, on the cut |
| — | host recap | once, ≈ 40 % | the host restates the key number and asks "Was that right?" |
| 9 | sign-off | ≈ 2 % | the guest's open either/or → "We shall see" → a one-line synthesis → thanks → the mission line → name sign-off; cut to whoever is addressed |
| 10 | credits | ≈ 1 % | a silent credits split panel, 2 pages |

Totals: ≈ 185 spoken words per minute (guest ≈ 80 %, host ≈ 17 %); ≈ 1.8 cuts per minute; 3 set-ups (two-up, guest single, host single); 2 lower thirds of 120 f; no music, no SFX, no inserts; type on screen ≈ 2 % of the runtime.

### 4.9 The beat sheet (`SHOTLIST.md`)

One row per composition. The **anchor** is a spoken word, so times are only estimates until the VO exists.

```
| beat | t in–out (s) | slot | VO / archival (verbatim) | claim | recipe (+ transition) | anchor (edge, kind / offset) | type on screen | assets | music | SFX | note |
```

## 5 · Step 4: write the voice-over

### 5.1 Length and rhythm

- Budget words per slot from §4.1 and §4.2. Write, then count; cut words before you cut sources.
- Mean sentence 13 words, maximum 25.
- **Short sentences (≤ 7 words) carry structure**: the opening, a payoff, an ID, the turn, the reveal.
- **Long sentences (18–25 words) are lists or causal chains** spoken over builds or montages that change once per item.
- Rhythm per section: short → long → long → short.
- Phrases of 5–6 words. Put a comma where the picture should change inside a sentence.
- One beat per paragraph. A blank line gives a 0.9 s pause, close to the measured 1.0 s between sentences.

### 5.2 Formulas (fill the brackets)

| Use | Formula | E |
|---|---|---|
| Opening | "The year is [YEAR]. The place is [CITY], and we're at [INSTITUTION], specifically [SUB-PLACE]." | N1–N2 |
| Hook | "But if you want to really understand [X], you have to [listen to / look at / read] this." → the source alone | N3 |
| Name the source (after it played) | "This is [TITLE] by the [adjective] [kind] [AUTHOR]." | N4 |
| Setup → payoff | "…and this [document] explains the reason why." → next sentence states it, ≤ 1 s later | N5–N6 |
| Expert ID (after the bite, over a silent shot) | "That's [NAME]. She's/He's a [ROLE] who [teaches / works] at [INSTITUTION]." (≈ 12 words) | N7–N8 |
| Witness | no ID line; the first bite establishes standing ("Although I'm from…, I consider myself…"); card only | I2 |
| Context marker | "At the time, [INSTITUTION] was known for [A], [B], [C] and [D]." | N10 |
| Turn | "Something changed [one summer night] in [YEAR]." | N11 |
| Thesis setup | "[Surface feature] is [true], but for [SUBJECT], it goes much deeper than that." → expert bite | N15 |
| Payoff | "So, you have [A] and [B]. But something else happens that really ties it all together. [C]." | N16–N18 |
| Ending | after [C]: no narration; archival C itself; card | A6 |

### 5.3 Voice rules

- **Tense.** Present tense for the frame, the promise, IDs, the thesis and the payoff. Past tense for history.
- **"you" and "we".** "you" ≤ 3 per film (hook, payoff). "we're" once, in the setting.
- **Point at the source.** Deictic "this" 2–3 times per minute, always at something on screen or on air ("listen to this", "this album", "this relaxing DJ").
- **Repeat the anchors.** Say the key date 3–4 times and the key place 4–5 times; viewers re-anchor on them.
- **Hedges.** At most one per film ("in many ways").
- **Numbers and years.** Write them the way the voice must say them when the scratch TTS might misread digits ("eighteen oh six"); the anchor is then the first spoken word. The typeset form goes in the recipe prop (`year=1806`).

### 5.4 What gets typeset

Mark candidates with `*stress*`. Typeset only:
- (a) proper names and dates, when spoken;
- (b) category nouns when a list is enumerated;
- (c) every word of a featured archival voice;
- (d) an expert's key abstract nouns.

Do not typeset verbs, adjectives or whole claims. A place the picture can mark (an X on a map) or embody (a radio for "Black Radio") is not typeset.

### 5.5 Never

- Rhetorical questions in the narration. Questions belong to archival voices only.
- "In this video", "let's", "here's why", "imagine…", "as we can see", "first / second / finally".
- A paraphrase of a quote that exists as audio. Play the audio.
- A sign-off, a summary after the reveal, or a call to action.
- A number that no picture carries.

## 6 · The script markup (`script.md`)

Parsed by `tools/py tools/voice/script_markup.py video-projects/<slug>/script.md` → `script.parsed.json`. The parser reads the syntax; this section adds the **meaning** the agent uses to write `storyboard.json`.

### 6.1 Lines, paragraphs, pauses

| Markup | Meaning |
|---|---|
| plain text | narration, read as written. Sentence ends: `. ? !` (not `U.S.`, `Sen.`, `Mr.`) |
| blank line | paragraph break: **0.9 s** pause (default). Use one paragraph per beat |
| sentence end inside a paragraph | **0.48 s** pause (default) |
| `[PAUSE 0.6]` | explicit silence in seconds. It **replaces** the default pause at that spot; consecutive PAUSE tags add up |
| `*word*`, `*two words*` | stressed words: bold in the recording guide, `stress` in the parsed words. Mark every word a picture lands on with `kind=pop` or `kind=text` |
| `*rulebook.*`, `*Washington,*` | **punctuation goes inside the stars.** The parser closes a stressed span only when the token *ends* with `*`. With `*rulebook*.` the star stays in the spoken text, and the stress runs on to the end of the line |
| `# heading` | ignored by the parser. Use `# <n> · <SLOT>` to mark arc slots for humans |
| `// note` | ignored (comment) |

### 6.2 Tags

`[NAME attr=value attr="value with spaces"]`, anywhere in a line. Tags are **not spoken**.

- Attribute **keys are lower-cased by the parser**: write them lower-case. Values cannot contain `]`.
- `anchor="word"` links a tag to the **nearest** occurrence of that spoken word at or after the tag (searching 12 words ahead, then 12 back, then anywhere).
- `anchor="word#2"` means the 2nd occurrence in the whole script. Multi-word anchors are allowed ("two-thirds", "eighteen thirty-seven"). Matching ignores case and punctuation.
- **Choose distinctive anchor words.** Avoid "the" and "and", unless the tag sits directly before that word.

| Tag | Attributes (lower-case) | Becomes in `storyboard.json` |
|---|---|---|
| `[BEAT …]` scene | `id`, **`recipe`** (one of the 12 in §7), `anchor`, `edge`=`start\|stress\|end`, `kind`=`cut\|object\|text\|pop\|title\|caption\|lyric\|name\|exit`, `offset` (frames @25), `transition`=`cut\|blurThrough\|spinSwap\|dip\|drop\|glitchCut`, `variant`=`act\|chapter`, `slot`, `claim`, `want="query 1 \| query 2"`, `note`, plus **recipe props** (`year`, `place`, `word`, `sub`, `text`, `title`, `quote`, `attribution`, `mode`, `value`, `src`, …) | `scenes[]`: `{id, recipe, start:{word, nth, edge, kind, offset}, props, transitionIn:{kind, variant}, note:"slot=… claim=…"}` |
| `[BEAT event=…]` | `event` (an id the recipe reads: doc 14 §3), `anchor`, `edge`, `kind`, `offset`, `until="word"`, `untiledge`, `untiloffset`, `snap=beat\|eighth` (music-only passages only) | `events[]` of the **current** scene |
| `[BEAT item=n]` | `item` (0-based), `anchor`, `kind`, `offset`, item props (`src`, `label`, `x`, `y`, `w`, `h`, `rotate`, `hinge`, `cutout`) | `props.items[n]` (PhotoCollageUnfold, MontageCrane), `props.pieces[n]` (ColdOpenYear) or `props.rings[n]` (DocumentHighlight), with `at` = the anchor |
| `[MUSIC …]` | `id`, `kind`=`bed\|song`, `role`=`topic\|underscore\|exposition\|featured`, `src` **or** `want`/`mood`/`bpm` (for sourcing), `anchor` (in-point), `offset`, `out="word"` / `out=end`, `outedge`, `outoffset`, `gain` (dB), `fadein` / `fadeout` (s), `from` (s into the file), `ride`=`true\|false` | `music[]`: `{id, src, kind, in, out, gainDb, fadeInSec, fadeOutSec, startFromSec, ride, cues}` |
| `[SFX …]` | `name` (kit: `sub_boom`, `whoosh`, `needle_drop`, `vinyl_crackle`, `tick`, `bass_hit`, `glitch_tick`, `radio_static`, `black_thump`) or `src`, `anchor`, `edge`, `offset`, `gain`, `peak` (default true) | `sfx[]`: `{src, at, gainDb, peak}` |
| `[ARCHIVAL "…"]` | first quoted string = **the words as heard**, verbatim (stored by the parser as `query`); `id`, `kind`=`speech\|sung\|phone\|broadcast\|interview\|document`, `speaker`, `date`, `src` (file or source page), `dur` (s), `rights`, `card="NAME\|Title\|Affiliation"` (interviews, first appearance only) | the scene that carries it: `KaraokeQuote` (`tokens` from the clip's own word timing, `audio`, `mode`), `NameCardInterview` (`src`, `name`, `title`, `affiliation`), `QuoteCard` (`quote`, `attribution`), or a `song` track |
| `[PAUSE s]` | seconds | silence in the scratch VO and the recording guide |

**Rules the parser cannot enforce (the agent must):**

1. Every `[ARCHIVAL …]` that is heard or read on screen is followed by `[PAUSE d]`, with `d ≥ dur` (+0.2–0.5 s). Featured music alone and data beats without narration also need a `[PAUSE]`. Otherwise the VO leaves no room for them.
2. A scene that starts in a music-only passage anchors to the **last spoken word before it**, with `edge=end` and a positive `offset`, or to the next spoken word with a negative offset. `{sec: …}` anchors are allowed only before the first and after the last spoken word. Word anchors keep re-timing when the user re-records.
3. `want="…"` is the sourcing query (`tools/source/source_images.py "<want>" --project …`). Replace it with `src=` once the file exists and has a `CREDITS.md` line.
4. Transitions bring their own sound: `blurThrough` → `sub_boom`, `spinSwap` → `whoosh`, `dip` → `black_thump`, `glitchCut` → `bass_hit`. Do not add these as `[SFX]`.
5. `kind=song` (featured music) never overlaps narration words (doc 14). Under narration, use a `bed`.
6. Visual-only archival items (an engraving, a photo) are **not** `[ARCHIVAL]`. They are `want=`/`src=` on a BEAT. Older sample scripts used `[ARCHIVAL "description"]` for images; do not copy that.
7. The script carries only what the *words* decide: recipe, anchors, typeset text and sourcing queries. Geometry and timing data are added in `storyboard.json` once the assets exist:
   - item positions and sizes;
   - ring centres and radii on a document;
   - `KaraokeQuote` tokens with their `t` from the clip's own word timing.

### 6.3 Lint before showing the script to the user

Run the parser, then check these (counts from `script.parsed.json`):

| Check | Pass |
|---|---|
| words per minute of target runtime | 85–105 (story), ≤ 115 (argument) |
| estimated narration share = (words / 3.5) / runtime | 0.40–0.50 (story), ≤ 0.55 (argument) |
| sentence length | mean 11–15 (60 s: 8–14), max 25; ≥ 1 sentence ≤ 7 words per slot |
| `?` in narration | 0 |
| "you" | 1–3 per film |
| every BEAT / MUSIC / SFX `anchor` resolves | no "WARNING anchor word not in script" |
| BEAT spacing | 1.2–8 s between scene BEATs (stage scenes up to 18 s with ≥ 3 events or items) |
| one claim per scene BEAT | each scene has one `claim` |
| typeset words | props `word` / `text` / `title` / `year` are nouns, names, dates or numbers; ≤ 3 words per line |
| ARCHIVAL | each has `src` or a source page, `dur`, and a following `[PAUSE ≥ dur]` |
| music | 8–12 `[MUSIC]` boundaries per minute; every featured song has room without narration |
| ending | the last spoken line is ≤ 7 words; an archival item follows; the last scene is `EndCard` with `transition=glitchCut` |

## 7 · Step 5: the shot plan (claim type → recipe, asset, audio)

### 7.1 Lookup

Only these 12 recipes exist in the storyboard engine: `ColdOpenYear`, `KeywordCut`, `PhotoCollageUnfold`, `NameCardInterview`, `KaraokeQuote`, `GiantWordCard`, `MontageCrane`, `MapRoute`, `DocumentHighlight`, `DataChart`, `QuoteCard`, `EndCard` (props: doc 14 §3).
- Event `kind` sets the default offset (doc 11 §2, `SYNC`): `cut` 0 · `object` +1 · `text` −7 · `pop` stress +1 · `title` +10 · `caption` −4 · `lyric` +1 · `name` +4 · `exit` 0.
- The "E" column cites the measured evidence (frames in `analysis/earworm-editorial.md` §2).

| Claim type | Default recipe (+ transition) | Alternatives | Asset to buy | Audio treatment | Timing | E |
|---|---|---|---|---|---|---|
| **date**, first mention | `ColdOpenYear` (`year`, `place`, `pieces` on the place words) | — | 2–4 PD photos for the pieces | bed in hard at 0, no fade | event `year` kind `text` (−7 f; ≤ −22 f in a dramatic pause) | N1, f5–33 |
| **date**, repeat | `PhotoCollageUnfold` with `title=<year>`, or `KeywordCut` (`word=<year>`) | `DataChart` counter for a year odometer | 1 photo | bed | `title` kind `text` | N3b |
| **date**, the turn | no new scene: hold the previous one; the next scene enters with `transition=drop` | `dip variant=chapter` | none | bed decays → 6 f of silence → new music on the first fade-up frame | fade starts on the year | N11 |
| **place**: city, region | `PhotoCollageUnfold` (one landmark per place word) | `ColdOpenYear` at the opening | 3–6 landmark photos | bed; elements in a pause on a bass note | items kind `object` | N2a |
| **place**: institution, address | `MapRoute` (`label{title,sub}` = station-style label, X) | `DocumentHighlight` on a printed map | 1 map (PD) | bed | `label` in the pause before the name (−9…−1 f) | N2c–N3a |
| **person**: expert | `NameCardInterview` (`name`, `title`, `affiliation`) | the 2nd appearance without a name (no card) | interview video at native fps | bed 10–15 dB under; kill the music for the key line | narrator ID: cut −5 f before the narrator; `resolve` kind `name` (+4); J-cut +2…+3 f into a speaking expert | N7–N8, I2 |
| **person**: historical | `DocumentHighlight` (newspaper; ring on the name) → `PhotoCollageUnfold` (portrait + `title`) | `KeywordCut` (portrait + name) | dated headline scan; portrait | bed, pre-lapped 4 f | headline / ring on the name; label at the name's end −1 f | N14a–b |
| **fact**, single | `KeywordCut` (photo slam + keyword) | `PhotoCollageUnfold` | 1 archival photo | bed, or **dry** for a key expository line | cut on the noun 0…+2.5 f; `pop` on the stress | N5a, N10a |
| **fact**, list | `GiantWordCard` per item (`photo` inside the word) | `MontageCrane` (one item per noun) | 1 photo per item | bed + a literal sound per item (radio static for "broadcasts") | cut on each item 0 f; `exit` on the next item's word | N10b, N12 |
| **concept** | `PhotoCollageUnfold` that assembles the embodying object, or `MontageCrane` with `dolly` | `KeywordCut` | props: the object that *is* the concept | bed; **silence before a payoff concept** | items on their nouns; the long move peaks on the key noun | N6, N9, N15 |
| **causal link** | `DocumentHighlight` (the cause's document, ring on the cause) | `KeywordCut` re-using the same photo in its new context | the same image twice | bed fades −25 dB under the setup → 12–14 f silence → hit → the payoff line | cut on the conjunction ("and") 0 / −1 f | N5b, N13 |
| **sensory description** | `PhotoCollageUnfold` (props rise on the described words, `title` = the ingredient noun) | `transition=spinSwap` to the second ingredient | props + figure cut-outs | **literal mix move at 0 f** when the line names a sound behaviour ("fades in and out") | items kind `object`; swap at peak speed on the noun | N16 |
| **musical example** | `KaraokeQuote mode=sung` (+ `src` = artist photo) | `KeywordCut` of the artist for an instrumental bridge (`snap=eighth`) | the recording + the artist photo + its source object | `song` track in the clear, 3–6 s (hook: 7 s); picture changes on eighth notes | name 10–15 f before the vocal; lyric +1 f | A3–A5 |
| **quote**: archival speech | `KaraokeQuote mode=speech` (`audio`, `tokens` as heard) | — | the recording (+ its source object as `src`) | the source alone; any music −20 dB in the speech band | caption −4 f, one word per drawing | A1, A6 |
| **quote**: written | `QuoteCard` (`quote`, `attribution`) | `DocumentHighlight` (ring the sentence) | the scanned page (for provenance) | music alone under it | `done` = last letter, `credit` +10 | — |
| **quote**: expert | `NameCardInterview` | — | interview | dry for the key line; new cue on its stressed word | J-cut | I1, I4 |
| **number** (argument mode) | `DataChart` (`counter` or `bars`, `ring`) | `KeywordCut word="24 HOURS"` | none | bed | `count` kind `text` | — (Epigenetics VX dot pops) |
| **payoff recap** | `PhotoCollageUnfold` with all earlier props + `title` | — | re-use | the music removed (dry line) | lands before the last word | N17 |
| **ending** | `KaraokeQuote` (archival last word) → `EndCard` with `transition=glitchCut` | — | the recording | music to the last frame, no fade | card cut on the outro's bass hit (0 f) | A6 |

### 7.2 Earworm devices without a recipe yet

These devices are measured, and most already have kit components, but `storyboard.json` cannot call them until a recipe wraps them. Use the nearest recipe and write the ideal device in the BEAT's `note`.

| Device (E) | Kit components | Nearest recipe today |
|---|---|---|
| Source before sound: record flies in, needle thump, crackle, song hard on a beat (N3c; `analysis/earworm-A.md` §2, shot 2b) | `SongIntro`, `VinylRecord` | `KaraokeQuote` with the record as `src` + `needle_drop` / `vinyl_crackle` SFX |
| Music feature with visualizer: bars, bokeh, kick scope (A3–A5) | `SpectrumBars`, `BokehVisualizer`, `KickScope`, `LyricLine`, `ElectricBeam` | `KaraokeQuote mode=sung` |
| Macro → mega pull-back for the thesis (N15) | `MegaPullBack`, `NeedleMeter` | `PhotoCollageUnfold` |
| Stage build with big letters behind props (N16) | none yet: hinge flip 12 f, masked letter rise 17 f (`analysis/earworm-D.md` §7) | `PhotoCollageUnfold` + `title` |
| Collage tumbles into the concept's object (N9) | none yet: tumble-assemble (`analysis/earworm-B.md` §7) | `PhotoCollageUnfold` |
| Full-bleed kinetic voice behind a prop (A6) | `KineticVoice` | `KaraokeQuote mode=speech` |
| Keyword isolation → title unpack + credit (N4) | `KaraokeCaption` + credit drop | `KeywordCut` |
| Snap push that stops dead on the stressed word (N3a) | `CameraRig` with `snapStop` keys | `MapRoute` |

## 8 · Step 6: the asset shopping list

One row per asset, written from the shot plan (`SHOTLIST.md`):

```
| id | asset type | what (search query) | beats | on-screen size → min px | candidate sources | rights | cut-out | status |
```

**Asset mix to expect** (Earworm share of claim rows, E §3.3):

| Asset | Share of claim rows | Note |
|---|---|---|
| archival photos | 58 % | |
| typography | 63 % | |
| props / objects | 35 % | |
| interviews | 13 % | |
| documents / newspapers / album covers | 13 % | |
| music visualizers | 10 % | |
| maps | 5 % | once, early |
| footage | 3 % | |
| diagrams | 0 % | argument mode may add data charts for numbers |

**Rules**
- **Every claim needs one non-type asset**, except dates and numbers.
- **Every recording needs its source object**: record, radio, phone, microphone, gavel, newspaper page.
- **Budget.** ≈ 15 compositions per minute means 15–25 cut-outs per minute; a collage build uses 4–14 pieces. Re-use earlier props in the payoff recap: they are free and they *are* the recap.
- **Sources** (doc 09; skill step 4), in this order:
  1. user files;
  2. pieces cut from the user's reference (`assets/ref/<id>/`, the `vox-reference` skill; publishable only when the user owns it);
  3. the shared catalog: `tools/py tools/library/search.py "<words>"` → `kit:assets/library/…` (PD/CC0 photos, engravings,
     documents, maps, cut-outs, marks, textures, footage);
  4. `tools/source/source_images.py` (Commons PD/CC, NASA, Smithsonian, US-government works), then add the good PD/CC0
     finds to the catalog (`tools/library/add.py`).
  Never news-agency photos.
- **Resolution** ≥ 2× the display size (3000–4000 px for 4K pushes). B/W, torn border at render time (doc 12).
- **Provenance.** Every file gets a `CREDITS.md` line. CC-BY and CC-BY-SA attributions are listed for the user.

## 9 · Step 7: the music plan

Write it as `[MUSIC …]` tags in `script.md`, one per cue. If nothing licensable fits, generate a bed (`tools/source/make_bed.py`) and add the wish to `MUSIC_WANTED.md` (skill step 5).

| Rule | Number (E §3.8, §5; doc 11 §5) |
|---|---|
| A new cue at every slot change | 8–12 boundaries per minute; excerpts 5–9 s (median 7); a montage cue may run 18 s |
| Role → level re the voice | topic −7 dB · underscore −10…−15 · exposition −19 (or out) · featured song 0…−3, **never under narration** |
| Beds | bass < 200 Hz + hats > 5 kHz; keep the 200 Hz–2 kHz band ≥ 12 dB (better 25) below the voice |
| No sidechain ducking | ride by hand: +2.4 dB median swell in gaps (up to +16 dB where a record is featured), −10…−12 dB in 3–5 f when the voice resumes |
| Entrances | hard (1–4 f) at section changes; 0.6–1.2 s fade under speech; pre-lap the next scene's music 4–15 f before its cut |
| Exits | hard stop within −1…+5 f of a sentence end, leaving an 8–11 f silence hole before a section cut; song → voice: fade 21–25 f starting 17–24 f before the voice |
| Remove the music | the expert's key line; 2–4 key expository lines per film; the line before the reveal |
| Silence | before payoffs (a 12–14 f hole + hit); the **drop** after the turn; **one** act-break dip |
| Literal moves | when the script names a sound behaviour, the mix does it on the word (0 f) |
| Ending | the outro's own bass hit carries the card cut; **no fade** on the last frame |

**Song choice by slot** (E §5.3):

| Slot | Choose |
|---|---|
| hook | the most characterful *archival* sound, best one with a voice |
| context | beds that **sound like what the line names** (jazz under "jazz", static under "broadcasts", a ballad swell under "smooth ballads") |
| montage | the fastest groove of the film |
| demonstration | the subject's own sound, in the clear |
| thesis | a minimal bed |
| ending | the source's music, unfaded |

**Energy arc.**
- Loudness stays flat (LRA ≈ 4 LU). Shape energy with bass, stereo width, tempo and picture motion.
- Peaks: the hook, the montage right after the turn (the summit, ≈ 50–60 % of the runtime) and the ending.
- Troughs: the expert sections and the act break.

**Licensing.** Commercial songs need sync and master licences (Earworm's songs are licensed to Vox; the `ProofEarworm` is study-only). Free options:
- US sound recordings published in **1925 or earlier** (public domain as of 2026; verify each record);
- compositions published in 1930 or earlier;
- US federal recordings (floor proceedings, agency audio);
- CC0 or licensed library music;
- original beds.

## 10 · Step 8: build and QA

Follow doc 14 for the commands: scratch VO → cues → `storyboard.json` → validate → publish → stills → render. Then check the render against the targets:

| Check | Target | How |
|---|---|---|
| slot shares | ±3 points of the template | beat sheet vs the cue file |
| narration share / music-only / other voices / silence | 45 % (≤ 55 %) / ≈ 28 % / ≈ 20 % / ≈ 4 % | `tools/audio/av_sync.py <id>` frame classes (add the render to `tools/analysis/sources.json`) |
| articulation | 3.2–3.8 words/s | `scratch_vo.py` log or `tools/voice/measure_pace.py` |
| keyword cuts on word onsets | ±1 f; illustrating cuts +0…+8 f | `av_timeline.py`; validator prints resolved frames |
| no cut on a beat under narration | 0 within ±2 f | validator rule 6 |
| text on screen | each ≥ 0.6 s; total 50–70 % of the runtime | validator rule 5; stills |
| compositions / picture events | one per 3–5 s / ≥ 1 per s | `shots.py`, `frame_metrics.py` |
| music boundaries | 8–12 per minute; featured sources alone ≥ 2.5 s | storyboard `music[]` |
| SFX | ≤ 7 per minute, all on sources or transitions | validator warning |
| ending | last narrator word ≤ 96 % of the runtime; music audible on the last frame | cue file; `av_timeline.py` |

## 11 · Worked example: "Why the US Senate filibuster exists" (60 s)

### 11.1 Premise

```
IDEA        Why the US Senate filibuster exists
SUBJECT     the filibuster (named at 37 % of the runtime: an argument-mode film may name it earlier)
WHEN        1806 (opening), 1917 (turn), 1975 (payoff)
WHERE       Washington → the Capitol → the Senate chamber → the Senate rulebook
HOOK SOURCE the Senate rules page with the deleted rule
TURN        "Something changed in 1917."
EVENT       Wilson's protest and the first cloture rule
THESIS      the Senate never restored the deleted rule; it added a brake
PAYOFF      a deleted rule + a brake added a century later → one number: sixty
LAST WORD   the Senate presiding officer announcing a successful cloture vote
FORMAT      60 s   MODE argument   LOOK voxEarworm
```

### 11.2 Facts the script relies on (checked 2026-11-14; re-check before recording)

Checked through search excerpts of the pages below. senate.gov refuses automated fetches, so open its pages in a browser before recording. Three lessons from this check went into the script:
- the 1806 rule did not end debates;
- "the first filibuster was in 1837" is not safe;
- Thurmond's speech is no longer the longest.

| F | Claim (as the script uses it) | Status | Sources |
|---|---|---|---|
| F1 | In 1806 the Senate's rules revision dropped the "previous question" motion. Vice President Aaron Burr had urged the clean-up on March 2, 1805 | **Verified, with a caveat.** The Senate's motion "removed a measure from floor consideration rather than forcing a vote" and was used only three times before 1806. Political scientist Gregory Koger: "In early usage, this motion did not end debate." So **never say the deleted rule used to end debates**. The "accidental origin" story is contested; the script only says what was deleted and what followed | [senate.gov overview](https://www.senate.gov/about/powers-procedures/filibusters-cloture/overview.htm); [National Constitution Center](https://constitutioncenter.org/blog/the-previous-question-the-filibusters-early-murky-history) |
| F2 | For about a century (1806–1917), nothing could force a debate to end | **Verified.** The first cloture rule is Rule XXII, adopted in 1917 | senate.gov overview |
| F3 | By 1841 a minority could stall a bill by talking: the bank-bill fight, in which Henry Clay threatened to change the rules so the majority could close debate | **Verified.** Do not use "the first filibuster came in 1837": no source in this check confirms it, and the senate.gov overview traces delaying speeches back to the first session (1789) | senate.gov overview |
| F4 | "Filibuster" comes from a word for a pirate: Dutch *vrijbuiter* (freebooter) → Spanish *filibustero*. It was applied to Senate obstruction **later** | **Verified; the date varies.** senate.gov says the term caught on in the 1850s; the Online Etymology Dictionary finds no legislative use before 1865. Say "later", not a year | senate.gov overview; [Merriam-Webster](https://www.merriam-webster.com/dictionary/filibuster); [etymonline](https://www.etymonline.com/word/filibuster) |
| F5 | Wilson, March 4, 1917: "A little group of willful men, representing no opinion but their own, have rendered the great Government of the United States helpless and contemptible." | **Wording verified.** A newspaper printed it on March 6, 1917 (spelled "wilful"). For the on-screen quote, copy the wording from a 1917 scan (Chronicling America) and log the page | [CFR](https://www.cfr.org/articles/remembering-robert-m-la-follette-and-the-willful-men-who-defied-woodrow-wilson-on-the-eve-of-world-war-i); [Papers Past, 6 Mar 1917](https://paperspast.natlib.govt.nz/newspapers/TS19170306.2.2.9) |
| F6 | March 8, 1917: Rule XXII lets two-thirds of senators present and voting end debate | **Verified** | [senate.gov "Cloture Rule"](https://www.senate.gov/about/powers-procedures/filibusters-cloture/senate-adopts-cloture-rule.htm) |
| F7 | Strom Thurmond, August 28–29, 1957: 24 h 18 min against the Civil Rights Act of 1957 | **Verified, but no longer the record.** Cory Booker spoke for 25 h 4 min in 2025 (senate.gov; his office says 25 h 5 min). Never call Thurmond's speech "the longest" | [senate.gov SC timeline](https://www.senate.gov/states/SC/timeline.shtml); [booker.senate.gov](https://www.booker.senate.gov/news/press/cory-bookers-long-speech-by-the-numbers) |
| F8 | 1975: cloture needs three-fifths of senators duly chosen and sworn (60 of 100). Changing the standing rules still needs two-thirds | **Verified** | senate.gov overview |
| F9 | The presiding officer's announcement wording | **Open.** Transcribe it from the chosen floor recording and log the date | senate.gov floor video |

**Expert slot.** This 60 s version has none. With a real interview (a Senate historian or political scientist on why the Senate kept unlimited debate), replace the first clause of the thesis sentence with a 4–5 s bite in a `NameCardInterview` scene, and cut ≈ 8 narrator words.

### 11.3 Script (`script.md`)

```
# filibuster-60 · Why the US Senate filibuster exists · 60 s · voxEarworm · argument mode
// F1–F9: see §11.2. Years are spelled as spoken; their anchors are the first spoken word.

# 1 · SETTING
[MUSIC id=m1 kind=bed role=underscore mood="sparse low bass, soft hats" bpm=60-70 anchor="The" out="deleted" outedge=end fadeout=0.04 gain=-10]
[BEAT id=open recipe=ColdOpenYear slot=setting claim=date anchor="The" year=1806 place="WASHINGTON" want="US Capitol engraving 1800-1810 | Senate chamber engraving | US Senate rules page 1806"]
[BEAT event=year anchor="eighteen" kind=text]
The year is *eighteen oh six.*
[PAUSE 0.6]
[BEAT item=0 anchor="Washington" kind=object]
[BEAT item=1 anchor="Senate" kind=object]
[BEAT item=2 anchor="rulebook" kind=object]
The place is *Washington,* and the Senate is tidying its *rulebook.*

# 2 · HOOK
[BEAT id=deleted recipe=DocumentHighlight slot=hook claim=concept anchor="see" want="US Senate rules of 1789 with the previous-question rule (Senate Journal, 1st Congress)" note="ideal: snap push stopping dead on 'deleted'"]
[BEAT item=0 anchor="deleted" kind=pop]
But if you want to understand *today's* Senate, you have to see what it *deleted.*
[PAUSE 0.8]

# 3 · CONTEXT
[MUSIC id=m2 kind=bed role=underscore mood="steady dark pulse" bpm=90-100 anchor="For" offset=-3 out="nineteen" outoffset=8 fadeout=1.3 gain=-12]
[BEAT id=gap recipe=PhotoCollageUnfold slot=context claim=causal anchor="For" want="Old Senate Chamber interior, engraving, 1800s"]
For a century, nothing could force a debate to *end.*

[BEAT id=talking recipe=PhotoCollageUnfold slot=context claim=date anchor="By" title="1841" want="US Senate in session, print 1840s | Henry Clay portrait (PD) | newspaper columns 1841 (Chronicling America)"]
[BEAT event=title anchor="eighteen" kind=text]
[BEAT item=0 anchor="minority" kind=object]
[BEAT item=1 anchor="talking" kind=object]
By *eighteen forty-one,* a minority could stall a bill just by *talking.*

[BEAT id=pirate recipe=GiantWordCard slot=context claim=concept anchor="filibuster" text="FILIBUSTER" ground=white want="engraving of a 17th-century freebooter, public domain"]
[BEAT event=photo anchor="pirate" kind=object]
It later got a name: *filibuster,* from a word for *pirate.*
[PAUSE 0.9]

# 4 · TURN (the FILIBUSTER card holds; no BEAT)
Something changed in *nineteen seventeen.*
[PAUSE 1.4]

# 5 · SOURCE (music only)
[BEAT id=wilson recipe=QuoteCard slot=demo claim=quote anchor="nineteen" offset=48 transition=drop quote="A little group of willful men … helpless and contemptible." attribution="WOODROW WILSON · MARCH 4, 1917" wrap=22]
[ARCHIVAL "A little group of willful men, representing no opinion but their own, have rendered the great Government of the United States helpless and contemptible." id=x1 kind=document speaker="Woodrow Wilson" date=1917-03-04 dur=6.4 src="front page of March 5, 1917 (Chronicling America)" rights=PD]
[MUSIC id=m3 kind=song role=featured want="march recording published 1917 or earlier (US public domain)" anchor="nineteen" offset=48 out="The" outoffset=4 fadeout=0.9]
[PAUSE 6.4]

# 6 · THESIS
[MUSIC id=m4 kind=bed role=exposition mood="mono bass pulse" bpm=70-80 anchor="didn't" offset=-10 fadein=0.6 out="But#2" outoffset=-2 fadeout=0.04 gain=-14]
[BEAT id=brake recipe=DocumentHighlight slot=thesis claim=fact anchor="The" offset=-5 want="US Senate Rule XXII as adopted March 8, 1917 (Congressional Record page)"]
[BEAT item=0 anchor="two-thirds" kind=object]
The Senate didn't *restore* the rule; it added a *brake:* *two-thirds* could end debate.
[PAUSE 3.0]
[BEAT id=thurmond recipe=KeywordCut slot=demo claim=fact anchor="debate" edge=end offset=10 word="24 HOURS" sub="18 MIN · STROM THURMOND · 1957" want="official US Senate photo of Strom Thurmond, 1950s"]
[BEAT event=pop anchor="debate" edge=end offset=16 kind=pop snap=eighth]

# 7 · PAYOFF
[BEAT id=rule recipe=PhotoCollageUnfold slot=payoff claim=sensory anchor="So" offset=-11 title="RULE"]
[BEAT event=title anchor="rule" kind=pop]
[BEAT item=0 anchor="deleted" kind=object]
So, you have a *deleted rule* and a
[BEAT id=brake2 recipe=PhotoCollageUnfold slot=payoff claim=sensory anchor="brake" transition=spinSwap title="BRAKE"]
[BEAT event=title anchor="brake" kind=pop]
*brake* added a century later.

[BEAT id=recap recipe=PhotoCollageUnfold slot=payoff claim=concept anchor="But" title="1975" note="all earlier props fly in; title rises in the middle"]
[BEAT event=title anchor="nineteen" kind=text]
But since *nineteen seventy-five,* one number ties it all *together.*
[PAUSE 0.9]

# 8 · REVEAL + ENDING
[MUSIC id=m5 kind=bed role=topic want="outro groove that lands a strong bass hit" bpm=90-110 anchor="Sixty" offset=-15 fadein=0.6 out=end gain=-8 ride=false]
[BEAT id=sixty recipe=DataChart slot=payoff claim=number anchor="Sixty" transition=blurThrough mode=counter value=60 ring=true]
[BEAT event=count anchor="Sixty" kind=text until="Sixty" untiledge=end untiloffset=12]
*Sixty.*
[PAUSE 0.8]
[BEAT id=cloture recipe=KaraokeQuote slot=ending claim=quote anchor="Sixty" edge=end offset=20 mode=speech want="Senate floor video: presiding officer announces a successful cloture vote"]
[ARCHIVAL "Three-fifths of the senators duly chosen and sworn having voted in the affirmative, the motion is agreed to." id=x2 kind=broadcast speaker="Presiding officer, US Senate" dur=5.6 src="senate.gov floor proceedings (log the date)" rights="US government work"]
[PAUSE 6.0]
[BEAT id=end recipe=EndCard slot=ending anchor="Sixty" edge=end offset=170 transition=glitchCut title="YOUR SERIES" tagline="WHY THINGS ARE"]
```

**How the anchors resolve.** This script was run through `script_markup.py`: 108 words, 11 sentences, 37 tags, every anchor resolved.
- `"Senate"` (item 1) is the first one ahead of its tag.
- `"eighteen"` (talking) is the 1841 one, the word right after the cut word "By".
- `"nineteen"` (wilson, m3) is 12 words back, i.e. the turn.
- `"The"` (brake) and m3's `out="The"` are the word right after their tags.
- `"debate"` (thurmond) is the second one, behind its tag.
- `"rule"`, `"deleted"` and `"brake"` in the payoff are the occurrences right after their tags.
- `"But#2"` is the 2nd "but" overall.

`storyboard.json` gets `end: {scene: "end", tailSec: 3.1}`.

### 11.4 Beat sheet

Times are estimated with the §4.2 formula and the parser's default pauses. They become exact once `scratch_vo.py` has made the cue file.

| Beat | t (s) | Slot | VO / source | Claim | Recipe (+ transition) | Anchor (edge, kind / offset) | Type on screen | Assets | Music / SFX |
|---|---|---|---|---|---|---|---|---|---|
| open | 0.00–9.80 | setting (+ start of hook) | "The year is eighteen oh six. The place is Washington, and the Senate is tidying its rulebook. But if you want to understand today's Senate, you have to…" | date → place | `ColdOpenYear` | "The" (cut 0); year on "eighteen" (text −7); pieces on Washington / Senate / rulebook (object +1) | 1806 · WASHINGTON | Capitol engraving; chamber engraving; 1806 rules page | m1 bed in hard at 0 |
| deleted | 9.80–11.74 | hook | "…see what it *deleted*." + 0.8 s hole | concept (promise) | `DocumentHighlight` | cut on "see" (0); ring on "deleted" (pop) | — (the page's own text) | 1789 rules page with the previous-question rule | m1 hard stop at the end of "deleted" → 0.8 s silence hole |
| gap | 11.74–15.65 | context | "For a century, nothing could force a debate to *end*." | causal link | `PhotoCollageUnfold` | cut on "For" (0) | — | Old Senate Chamber engraving | m2 bed in hard 3 f before |
| talking | 15.65–20.13 | context | "By *eighteen forty-one*, a minority could stall a bill just by *talking*." | date + fact | `PhotoCollageUnfold` | cut on "By"; title on "eighteen" (text −7); items on minority / talking | 1841 | 1840s Senate print; Henry Clay portrait; 1841 newspaper columns | m2 |
| pirate | 20.13–27.25 | context + **turn** | "It later got a name: *filibuster*, from a word for *pirate*." [0.9 s] "Something changed in *nineteen seventeen*." | concept; date (turn) | `GiantWordCard` | keyword cut on "filibuster" (0); photo on "pirate" (+1); **held** through the turn | FILIBUSTER | freebooter engraving inside the word | m2 fades over 1.3 s from "nineteen" +8 f, ending 5 f after black → ≈ 7 f of silence |
| wilson | 27.25–33.50 | source (music only) | [ARCHIVAL x1, typed, no voice] Wilson, March 4, 1917 | quote (written) | `QuoteCard` (`drop`) | "nineteen" +48 f = first frame after the black | the quote · WOODROW WILSON · MARCH 4, 1917 | newspaper scan (provenance) | m3 PD march **starts on the fade-up frame**, in the clear; 0.9 s fade starting 18 f before the voice and ending 4 f after "The" |
| brake | 33.50–38.40 | thesis | "The Senate didn't *restore* the rule; it added a *brake*: *two-thirds* could end debate." | fact (thesis) | `DocumentHighlight` | cut 5 f before "The" (picture first); ring on "two-thirds" | — | Rule XXII page (1917) | m4 mono bed fades in 0.6 s |
| thurmond | 38.40–40.56 | demonstration (data, music only) | — | fact (person, date, number) | `KeywordCut` | "debate" end +10 f; pop +16 f snapped to an eighth note (m4 needs its cue file) | 24 HOURS · 18 MIN · STROM THURMOND · 1957 | Thurmond official photo | m4 alone |
| rule | 40.56–43.44 | payoff | "So, you have a *deleted rule* and a…" | sensory (ingredient A) | `PhotoCollageUnfold` | cut 11 f before "So" (picture first); title on "rule" (pop) | RULE | the 1789 page (re-use) | m4 |
| brake2 | 43.44–45.76 | payoff | "…*brake* added a century later." | sensory (ingredient B) | `PhotoCollageUnfold` (`spinSwap`) | swap on "brake"; title on "brake" (pop) | BRAKE | Rule XXII page (re-use) | whoosh (from `spinSwap`) |
| recap | 45.76–49.67 | payoff | "But since *nineteen seventy-five*, one number ties it all *together*." | concept (signpost) | `PhotoCollageUnfold` | cut on "But"; title on "nineteen" (text) | 1975 | all earlier props | m4 out at "But" −2 f: **dry line**; m5 enters 15 f before "Sixty" |
| sixty | 49.67–50.92 | payoff (reveal) | "*Sixty*." | number | `DataChart` (`blurThrough`) | cut on "Sixty" (0); count until "Sixty" end +12 f | 60 (ringed) | — | sub_boom (from `blurThrough`) |
| cloture | 50.92–56.92 | ending | [ARCHIVAL x2] "Three-fifths of the senators duly chosen and sworn having voted in the affirmative, the motion is agreed to." | quote (archival speech) | `KaraokeQuote mode=speech` | "Sixty" end +20 f; captions −4 f per word | the quote, word by word | floor recording; gavel cut-out as `src` | m5 under it, −20 dB in the speech band |
| end | 56.92–60.00 | ending | — | — | `EndCard` (`glitchCut`) | "Sixty" end +170 f = m5's bass hit | your series card | — | bass_hit (from `glitchCut`); m5 to the last frame; `end.tailSec` 3.1 |

### 11.5 Check against the targets

| Target (§4.2–4.3) | This script |
|---|---|
| narrator words 85–115 (argument) | **103** (108 tokens as written; spoken years count as 1) |
| narration share ≤ 55 % | ≈ 31 s articulated = **51 %** |
| sentences: mean 8–14 words, max 25, short ones at the joints | 11 sentences, mean **9.4**, max 15; short: the opening (4), the turn (4), the reveal (1) |
| "you" 1–3; questions 0 | 3 (hook ×2, payoff ×1); 0 |
| open loops paid off fast | "see what it deleted" → the page (0 s); "Something changed in 1917" → Wilson (1.4 s) → the brake (7.8 s); "one number ties it all together" → "Sixty" (0.9 s) |
| sources alone ≈ 28 % | Wilson + march 6.3 s, Thurmond beat 2.2 s, cloture clip 6.0 s, card 3.1 s ≈ **29 %** |
| compositions ≈ 15 per minute | **14** scenes (median ≈ 3.9 s), one claim each |
| type: ≤ 15 events; narrator words typeset ≤ 15 % | 14 type events; 12 of 108 tokens (**11 %**): 1806, Washington, 1841, filibuster, rule, brake, 1975, sixty |
| music boundaries 8–12 per minute | **9** (m1 in / out, m2 in / out, m3 in / out, m4 in / out, m5 in); m5 runs to the last frame |
| silence used structurally | 0.8 s hole before the context; ≈ 7 f of silence at the drop; a dry line before the reveal |
| SFX 4–7 | 3 transition sounds (sub_boom, whoosh, bass_hit), all structural |
| ending | the last narrator word at 50.1 s (84 %); archival last word; card on the bass hit |
