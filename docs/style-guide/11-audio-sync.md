# 11 · Audio–visual sync: narration, music, sound design

**Evidence.** A real Vox *Earworm* episode ("Quiet Storm", 153.7 s, 1080p, 25 fps, stereo) was analysed frame by frame in four segments:
- 3,843 frames;
- 340 words with refined onsets;
- per-frame loudness, spectrogram, onsets and a local tempo map.

Reports: `analysis/earworm-{A,B,C,D}.md` (visual + sync + sound design per segment) and `analysis/earworm-av-quant.md` (whole-video statistics). The audio-visual timelines are `analysis/av/earworm_*.png`. Offsets are in **frames at 25 fps**; **positive = picture after sound**.

**Code.**
- `tools/audio/make_cues.py` turns your narration and music into a cue file.
- `src/audio` turns cue frames into animation timing and mixes the soundtrack (`src/audio/README.md`).
- `src/earworm` and `src/earworm/fx` hold the Earworm devices and the sound-locked transitions.

## 0 · The model in seven rules

1. **Narration drives the picture.** While the voice talks, every picture event hangs on a word: its onset, its stressed syllable or its end.
2. **Music owns the pauses.** Events that fall in narration pauses land on the music bed's bass notes and arrive 3–9 f before the next phrase.
3. **Cuts are never placed on beats.**
   - None of the 21 cuts falls within ±2 f of a beat, where chance predicts 11 %.
   - Picture events under narration are no closer to the beat grid than chance: mean 4.15–4.31 f vs 4.4 f random.
   - **Quantise to the eighth-note grid only when music plays alone** (mean |error| 0.9 f), using the local tempo.
4. **Songs and narration take turns.** A featured song never plays under narration: it is cut in after the voice and faded or hard-stopped before it returns.
5. **Cuts follow the music edit, and the next scene's sound arrives first.**
   - 43 % of cuts have a music edit 0–12 f before them (p = 0.001).
   - New music enters a median **3.5 f** before the cut (IQR 1–7; scene pre-laps up to 15 f).
   - An old bed often stops 7–10 f early, leaving an **8–11 f silence hole**; the cut lands inside the hole or on its last frame.
6. **Sound belongs to sources and structure, not to motion.**
   - Diegetic objects get sounds: needle thump, crackle, phone line.
   - So do structural transitions: sub-boom, whoosh, dip to silence.
   - Cards, text and whips get **no whoosh**. SFX budget ≈ 1 per 13 s.
7. **Audio graphics listen to envelopes, not raw FFT.**
   - Spectrum bars gate at −12 dBr and render 2 f ahead.
   - An oscilloscope spikes on kicks with 0 f lag.
   - Meters are keyframed, not driven.

## 1 · Anchors

| Anchor | Definition | Tool |
|---|---|---|
| **word onset** | the speech-energy attack of a word. **Do not use raw transcript starts:** whisper was off by up to 16 f, usually early | `make_cues.py` → `words[].onset`, `findWord()` |
| **stress** | the loudest syllable inside the word | `words[].stress`, `findWordStress()`, `cueFrame({edge:"stress"})` |
| **word end** | `words[].end` | `findWordEnd()` |
| **phrase start / end** | words split by pauses ≥ 0.25 s | `phrases[]`, `phraseStarts()` |
| **bass note / onset** | music-bed onsets (use the music stem) | `onsets[]` |
| **beat / eighth** | local-tempo grid (songs change tempo: 69.9, 77, 95.5 and 108.3 BPM were measured in one episode) | `beats[]`, `eighths[]`, `snapToEighth()` |
| **SFX peak** | the sound's own peak frame | `public/audio/sfx/*.json` sidecars |

**Accuracy.**
- Whisper word starts are off by a median 2 f (p90 7 f, 5–12 f at phrase starts).
- The analysts' acoustic refinement reached a median 0.5 f.
- The kit's automatic refinement on a mixed track brings 7 hand-measured problem words from 9.5 f to 4.2 f mean error. On a clean VO stem expect ≤ 2 f.
- Always generate word cues from the **narration stem** and beat cues from the **music stem**.
- Hand-correct the handful of anchors that carry a cut.

## 2 · Narration → picture offsets

| Event | Anchor | Offset (f) | Source |
|---|---|---|---|
| **Keyword cut** (cut to the thing being named) | word onset | **0** (−1…+1); illustrating cuts +0…+8, median **+2.5**: heard first, then seen | B §15.2, C §15.1 |
| Cut on a phrase start | phrase start | **0 / −1** | A §15.4 |
| **Illustrative TEXT** (digits, station names, typed key words: the narrator's graphics) | word onset | **starts −7 f** (range −22…0) so it is readable when the word lands. A type-on may start up to −22 f, inside the narrator's dramatic pause | quant §3.3 |
| **Object / collage entrance** on a keyword | word onset | start **+1** (measured median +0.7, IQR −1…+5; D: +3, range 0…+6); complete ≤ **+8 after the word ends** | A R1, D §15.2 |
| Captions of an **interviewee's keywords** | word onset | **+1.75** (range −4.5…+3.25) | quant §3.3 |
| **Titles & credits confirming a name** | the spoken name | **+8…+13** (or locked to the cut, +4) | quant §3.3 |
| **Single-word pop** (kinetic type) | stressed syllable | **+1** (−1…+2); with a glitch swap: flicker 4 f from the onset, then pop | B §15.3 |
| **Title typewriter** | first title word | **finishes** at onset −0…1 (1 letter / 2 f) | B §15.4 |
| Annotation (ring, underline) | second word | 6–8 f draw, ends at onset +1…+2 | B §15.4 |
| **Name card** | surname | builds 20–22 f from the cut; the surname resolves at onset **+3…+5**. A person/title label lands at the **end of the spoken name −1** | B §15.5, C §15.7 |
| Object label when a shot opens on the object | its spoken name | may **lead** by ≤ 13 f | C §15.7 |
| Artist / song tags, credits | the name or the vocal | **−10…−15** (names before sounds) | D §15.4 |
| Label + arrow | the introducing verb | +6, at 2 f/letter; finishes in the next pause; exits 6–7 f before the next key word | B §15.6 |
| **Camera push** | stressed word | **ends dead on it (0)**, no settle tail. A 2 s push `(.85,.1,.05,1)` starts 6 f after the clause's first word and peaks 3 f before the stressed word ends | A R3, B §15.8 |
| Long camera move | key noun | **peak velocity on it (0)**; ends on the next stressed word (+3) | D §15.2 |
| Pull-back reveal | first spoken word | starts on the cut, peak speed on that word (≈ +8), rests on the sentence end | A R3, B §15.8 |
| **Exit move** of the outgoing shot | next keyword | **−1…+2**; lasts 4–8 f, accelerating; the cut follows **6–8 f** after the exit starts | C §15.2 |
| Cut to the narrator (speaker change) | narrator onset | **−5…−6** (picture first) | B §15.2 |
| Cut to an on-camera speaker | speaker onset | **+2…+3** (voice first); a new interviewee's first line may pre-lap ≤ 31 f | B §15.2, D §15.6 |
| Paragraph opening | first syllable | cut **−11**, hero object in at −6 | D §15.3 |
| Montage move through objects | each object's noun | crosses frame centre at **−2…+8**; arrivals on the next stressed word (+3…+5) | C §15.6 |
| Event inside a narration pause | bed bass note / onset | **±2**, landing 3–9 f before the next phrase | A R2 |
| Keyword isolation (dim the rest) | the copula ("is") | +2; the line goes to 35 % in one drawing | A R13 |

## 3 · Captions of voices and lyrics

- **Archival speech**: each word pops **4 f before** its syllable onset (range 3–6), in one drawing, **spelled as heard** ("TO EAR", "LOVIN"). Full-bleed condensed caps sit behind cut-outs; a new line feeds the previous one up.
- **Sung lyrics**:
  - Timing: words land at **+1 f** (0…+3; 19 of 21 within ±3.5 f), one token per word, syllable chunks for words longer than 3 syllables, on a 3 f text grid.
  - Motion: each word rises 95 px and fades in over 9 f, ease `enter`.
  - Layout: at most 2 lines (current 100 %, previous 35 %, pitch 1.6× cap); scroll in one drawing at vocal phrase starts.
- Captions show only the archival voice. Narration is never captioned.

## 4 · Music-only passages

- Quantise every picture change to the **eighth-note grid** of the local tempo, offset **−1…+2 f** (measured mean |d| 0.9 f). Digits and objects exit on eighths.
- Land music-locked props (a microphone, a visualizer) on the **vocal entry +1 f**. Power ambient lights on as the preceding voice ends (±1 f).
- When narration runs over a music montage, **follow the narration**: only the 12 drawings/s cadence stays.

## 5 · Music editing & mix

**Levels.**
- Master: **−12.6 LUFS** integrated, loudness range 4.1 LU. Deliver −14 LUFS for platforms that normalise.
- Voices are **mono, centre**. Remote-interview voices keep their ≈ 7 kHz band limit as texture.
- Voice ≈ **−21.5 dBFS** for every speaker (narrator and interviewees matched to ±1 dB). Music sits a median **+9.7 dB** under the voice (speech-to-music ratio under narration).
- Music beds sit 7–19 dB under the voice:

  | Bed role | Level re voice |
  |---|---|
  | music is the topic | −7 dB |
  | underscore | −10…−15 dB |
  | exposition | −19 dB |

- Keep the bed's speech band (200 Hz–2 kHz) ≥ 12 dB (better 25 dB) below the voice. Build beds from bass (< 200 Hz) and hats (> 5 kHz).
- Featured songs play in the clear at −22…−25 dBFS (−4…−12 dBr).

**No word-by-word sidechain ducking.** A trace locked to phrase starts shows −0.2 dB. Ride the bed by hand instead:
- **Gap swell**: after a phrase ends the bed swells, median **+2.4 dB** with a ≈ 0.26 s ramp, and up to **+13…+16 dB** where a record is featured (+16 dB in 2 f after a 6 f hold).
- When the voice resumes, the bed comes back down **−10…−12 dB in 3–5 f**.
- Music is removed entirely for a few key lines (3 in this episode).

Under an archival voice, cut the music's speech band by ≈ 20 dB.

**Handoffs.**

| Move | Recipe |
|---|---|
| Song → narration | **fade 21–25 f, starting 17–24 f before the voice**, ending −3…+8 f around its first syllable. Or duck 20 dB over 5 f starting 8 f before the narrator, then hard-stop at the section change |
| Narration → song | cut the song in (no fade) within 3 f of the narration end, or start its intro under the last word (−3 f) with the first note ≈ 15 f after the cut |
| **Fades** | music in: **hard (1–4 f)** at section changes; **0.6–1.2 s** when entering under speech. Music out: **hard (0–3 f)** before cuts; **1.4–1.7 s** fade-outs under an interview or narration. Excerpts last median 6.9 s (p25 5.2, p75 9.3) |
| **Source before sound** | show the record or radio ≥ 20 f before the music; fly-in ≤ 12 f ending 3 f before a **needle thump**, 11 f of crackle, then the song starts hard on a beat; let it play solo ≥ 7 s |
| **Pre-lap** | start the next scene's music/SFX **4–15 f before the cut** (median 10.5): a linear ramp from silence, reaching −7 dB 5 f before the cut. Start the outgoing camera tail 0–5 f after the pre-lap onset. The cut lands on the next voice onset (±1) |
| **Hard stop** | a bed stops (≤ 5 f) within −1…+5 f of the sentence's last word, then 6–13 f of room tone before the next bed |
| Expert's key line | kill the music with a 1 f cut on a word onset; bring a new cue in on that sentence's stressed word (+1…+2) |
| Section end | fade the bed over ≈ 26 f so the last two words are dry, add a short reverb throw (≈ 5 f, −40 dB re voice), then 8 f of near-silence |
| Section cut | music + VO out in 1 f → 8–9 f silence → cut → new bed +1 f → VO +8 f |
| **Literal mix moves** | when the script names a sound behaviour ("fades in and out", "quiet"), automate the bed to match at 0 f |
| Ending | the last line names what comes next → 4–5 s of archival audio as giant type (phone EQ: HP 200 Hz, +12 dB at 1.2–3.4 kHz) → 6 f dip → zoom-blur → hard cut to the series card on a bass hit → **music runs to the last frame** (no fade) |

**Structural breaks.**

| Device | Picture | Sound |
|---|---|---|
| **Drop** (before a montage) | 27 f linear fade to black from the payoff word → 13 f black → fade-up 17 f | ≤ −47 dB 7 f after black, 6 f silence; new music starts **on the fade-up frame**; voice +14 f |
| **Dip to black** (act break, at most once) | out 18 f over the last 2 words → black 17 f → in 36 f. Across 3 instances: out 8–27 f, black 9–18 f, in 9–36 f | the audio fade starts 5–19 f *after* the picture fade (the picture leads out) and lasts 4–11 f; silence while black; **audio hard-in on the first fade-up frame** (0–10 f); thump on the first black frame |
| Chapter break | out 5 f → black 9 f → in 8 f | out 4 f (2 f after the picture) → silence → in 8 f with the fade-in; voice 3 f after the fade completes |

## 6 · Sound design (SFX)

| Sound | Locks to | Offset |
|---|---|---|
| sub-boom | blur-through cut | onset −8 f, **peak on cut +1**, −13 dB over 15 f |
| whoosh | 90° spin-swap | **peak on the swap frame** |
| thump | dip to black | first black frame |
| bass hit | end-card cut | 0 f |
| needle thump + 11 f crackle | record lands | 3 f after the fly-in ends |
| tiny HF tick (30–90 ms, −30 dB re voice) | text pop **in a music-free passage** | 0 f |
| low-pass opening | defocus | same frame |

Budget: about 1 SFX per 13 s. Transitions are usually sold by **music edits** (pre-laps, hard stops, drops), not by whooshes. The one credible whoosh in the episode peaks 2.8 f *before* a whip-pan cut.

## 7 · Audio-reactive graphics ("visualizers")

| Device | Drive | Timing |
|---|---|---|
| **Spectrum bars** | full-mix envelope × per-bar random heights, **gate −12 dBr** | **2 f look-ahead**, posterised to 12 drawings/s. Measured coupling r 0.48–0.59 at lag −2…+1 f, in music-only shots only. Nothing else in the film reacts to the audio (r ≤ 0.06) |
| **Kick scope** (oscilloscope line) | low band rises ≥ 8 dB → spike | **0 f lag**, hold 2 f |
| Vocal-keyed beam / glow | on/off envelope of the source | attack 3 f after it starts, 19 f ramp, release 3 f after it ends; re-randomise the shape every drawing |
| Density field | 150–400 Hz band over the phrase | phrase-level, not frame-level |
| Meters / needles | **keyframed**, not driven | 20 f swing `(0.40, 0, 0.65, 1)` peaking on a stressed word |
| Any continuous reactive motion | low band (< 200 Hz) only, smoothed ≥ 2 f | stepped at the graphics cadence, so it reads like bass notes rather than a VU meter |

Visualizer palette: core `#8A92DB`, body `#414AA6`, glow `#2A3293`.

## 8 · Pacing & cadence

- **Narration.**
  - Delivery: the narrator articulates **3.5 words/s** (208 wpm), in phrases with a median length of **1.6 s** (5.5 words).
  - Pauses: phrase pauses have a median of **0.48 s** (p25 0.34, p90 1.14).
  - Coverage: narration fills ≈ 45 % of the timeline.
  - **Transitions live inside the pauses.**
- **Shots.** The median shot is 3.7 s, about one phrase per shot (ρ = 0.79).
- **The picture cuts most when nobody talks:**

  | Passage | Cuts per minute |
  |---|---|
  | music only | 11 |
  | narration over music | 8 |
  | interview | 5.3 |
  | narration without music | 0 |
- Cadences:

  | Layer | Rate |
  |---|---|
  | graphics and camera | **12 drawings/s** (25 fps: holds 2, 2, …, 3) |
  | typographic collage builds | ≈ 10 drawings/s |
  | caption text | 3 f grid |
  | fades, dissolves, blurs and **all audio** | on ones |
  | interview/webcam footage | native rate |

## 9 · Workflow

1. **Record the voice-over first.** Picture is cut to it, not the reverse.
2. `tools/py tools/audio/make_cues.py vo.wav --name vo --fps 25` gives words with `onset`/`stress`, phrases and pauses.
   `tools/py tools/audio/make_cues.py music.wav --name bed --fps 25 --no-words` gives the local tempo map, beats, eighths, onsets and envelope. Use `--bpm 92 --first-beat 0.41` when the tempo is known.
3. Fix the anchors that carry cuts (edit the JSON). Mark the stressed key words.
4. **Write a cue sheet:** for every visual key, `{anchor, offset}` from §2–§4.
5. Build with `useCues` + `cueFrame({cues, word, edge, offset})` / `snapToEighth`. Mix with `Narration`, `MusicBed`, `SongExcerpt`, `Sfx` and use the §5 recipes.
6. **Verify on your render.**
   - Add the MP4 to `tools/analysis/sources.json`.
   - Run `frame_metrics.py`, `shots.py`, `tools/audio/audio_features.py` and `tools/audio/av_timeline.py`.
   - Read the timelines: every cut and pop should sit on its intended word or beat at the offsets above.
   - `tools/audio/av_sync.py <id>` prints the offset statistics.

```tsx
const vo = useCues("vo");
const bed = useCues("bed");
const cut = cueFrame({ cues: vo, word: "Washington", offset: 0 });              // keyword cut
const pop = cueFrame({ cues: vo, word: "storm", edge: "stress", offset: 1 });   // kinetic word
const tag = cueFrame({ cues: vo, word: "Parliament", offset: -12 });            // names before sounds
const exitInPause = bed.snapToEighth(vo.phraseEnds()[3] + 8);                    // music owns the pause
```

## 10 · Look profiles: `earworm`, `standard` and `scrapbook`

Everything above was measured on *Earworm*. Six other official Vox videos (2019–2026; `analysis/vox-framework-coverage.md` §2.6 and §5) cut and mix differently: cuts lead the narrator's **phrase** start instead of landing on a keyword's onset, the bed is a **static** library track under the voice, the music changes once per **section**, and a chapter is joined by a short **digital-silence hole** and a hard cut. Both behaviours ship as profiles in `src/audio/profiles.ts`; a storyboard picks one with `profile`, or gets one from its look (`voxEarworm` or no look → `earworm`, `voxScrapbook` → `scrapbook`, any other look → `standard`). The `scrapbook` profile was measured on a Vox brand piece in the scientific-scrapbook look (`analysis/vox-sample/vox_braintravel.md` §7; 4:16, 23.976 fps).

| Setting | `earworm` (unchanged) | `standard` (measured on the sample) | `scrapbook` (measured on the brand piece) |
|---|---|---|---|
| default scene-start kind | `cut`: word onset, 0 f | `phrase`: 3 f before the phrase's first word (sample: 0–12 f before; medians 1–4 f) | `phrase`: 6 f before (35 cuts and slide starts: median −5.7 f, 60 % within 12 f; no word or beat lock) |
| `highlight` event | +1 f | +1 f (sample −6…+5 f, sweep 7–22 f) | +1 f |
| `lowerThird` event | cut +2 f | cut +2 f (sample 0…+3 f, life 120 f) | cut +2 f (labels sit on the picture from its first frame) |
| `name` (decode card) | +4 f on the surname | +4 f | +4 f |
| label text | −7 f | −7 f (sample −4…−16 f) | −7 f (reveals −8…+8 f around the keyword; a stat readable +18 f after its number) |
| bed | ridden: gap −7.6 dB re the voice, duck −2.4 dB | static: `ride: false`, −13 dB re the voice (sample −7.3…−19.2 dB), applied only when a music entry sets neither | static, unducked: −9 dB re the voice (voice 9.0 dB over the music; per-phrase duck median +0.2 dB) |
| music changes | 8–12 boundaries per minute | one cue per chapter (validator warns above 2 per minute) | one cue per chapter (5 cues in 4:16; warns above 2 per minute) |
| chapter joint | `dip` (picture + sound) | `transitionIn: {kind: "cut", hole: 12}`: bed out 12 f before the cut, next cue 3 f after (sample 5–29 f holes) | a short hole (measured 4–13 f, one of digital silence) and a hard cut, or a `paperSlide` |
| new cue vs the cut | 3.5 f before (pre-lap) | 3 f after (sample −1…+6 f) | on the cut (0 f; measured 0 and −2 f) |
| SFX | about 1 per 13 s; transitions carry their sounds | at most 1.5 per minute (+1); transitions silent unless `sfx: true` | at most 3 per minute (+1): 2.1 likely per minute measured, 5.4 with the possible ones. Paper swooshes on slides (+2…+6 f), foley on objects (−1…+5 f), a chime on the end card; a montage gets none |
| minimum cut spacing | 6 f | 6 f; 3 f into a scene marked `burst: true` | 6 f; 3 f into a `burst` scene (the montage runs 7 → 3 f) |

All frame values are @25 fps and scale with `fps / 25`. Script markup: `[BEAT kind=phrase|highlight|lowerThird …]`.

**Measured on a render** (a maintainer's test build, not shipped; look `voxExplainer`, `standard`): 20 % of cuts within ±2 f of a word onset (chance ≈ 29 %), 60 % of cuts 0–12 f before a phrase onset (chance 15–20 %, p = 0.002), speech 16.7 dB over the bed (per-phrase median), and a 23 f digital-silence hole at a chapter cut. A hole only stays silent where the voice-over pauses: a `phrase` cut 3 f before a word that follows straight on leaves just a few frames of silence (6 f at the other chapter cut of that test).

### 10.1 Clip sound, bed drop and silent credits

- **Clip sound.** A `FootageClip` scene plays its own sound (`audio`, default true; `audio: false` for B-roll) at `audioDb` re the voice. Level the file offline so its speech sits at the voice level, measuring on the speech windows: `ffmpeg -i in.mp4 -c:v copy -af "volume=<gain>dB" out.mp4`.
- **J-cut.** `audioLeadF` starts the sound that many frames before the picture (the sample: 6–31 f). The file needs that much material before `startFromSec`; otherwise the lead shortens.
- **Bed under clip speech.** `bed: "duck"` drops the music bed by 20 dB (attack 0.16 s, release 0.4 s; measured −20.7 dB); `"out"` removes it for a key bite (digital silence); `"keep"` leaves it (the default for `audio: false`). Songs are not touched.
- **Silent credits.** `EndCard` with `silent: true` ends all music at the card's start: digital silence under the credits (2 of 6 sample videos). Enter it with a plain `cut`, since a transition's own SFX would sound.

Measured on a maintainer's footage test build (not shipped): clip speech within 0.2 dB of the voice, the bed −20.7 dB under the interview and silent under the archival bite, the J-cut leading by exactly 10 f, and digital silence under the silent credits card.
