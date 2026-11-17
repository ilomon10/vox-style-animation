# Analyst guide: one Vox video → one report

You analyse **one** official Vox video. The question behind the work is: *how does Vox build this video (story, picture, motion, sound), and what would our framework need to make it?*

Six analysts work in parallel, one per video, and a synthesis step then compares the reports. So:
- follow the template below exactly;
- tag every device with an ID from `analysis/vox-sample/VOCABULARY.md`, or `NEW-<kebab-name>` if nothing fits.

## Inputs (all precomputed; `<id>` is your analysis id, e.g. `vox_creatine`)
| What | Path |
|---|---|
| Video, captions, metadata (chapters, date) | `reference/vox-sample/<youtubeid>_*.mp4`, `*.en.vtt`, `*.info.json`; `reference/vox-sample/manifest.json` |
| Per-frame metrics, shots | `analysis/metrics/<id>.csv`, `analysis/metrics/<id>_shots.{md,json}` |
| Contact sheets (sparse: shot start/mid/end + every 2 s in moving shots; labels show frame, time, shot, word, beat) | `analysis/sheets/<id>/sheet_NNN.png`, `index.md` |
| Words, phrases, transcript, rhythm, audio features, sync stats | `analysis/audio/<id>_{words.json,phrases.json,transcript.md,rhythm.json,features.csv,sync.json}` |
| A/V timelines | `analysis/av/<id>_*.png` |
| Palette | `analysis/palettes/<id>.{json,png}` |
| Segments | `analysis/segments/<id>_segments.json` |

Captions (`.vtt`) are the text reference; manual captions are better than auto. The whisper words give the timing; correct whisper's text from the captions.

## Getting more pixels (light jobs, no lock needed)
- **Still:** `ffmpeg -v error -ss <sec> -i <mp4> -frames:v 1 -q:v 2 analysis/stills/<id>/<m>m<ss>s_<label>.jpg`.
- **Strip of consecutive frames** (motion, ≤ 48 frames): `python3 -I tools/analysis/contact_sheets.py strip <id> <frameA> <frameB>`.
- **Budget** (images are expensive in your context): at most 40 sheet images, 15 stills and 8 strips.
  - If the video has more than 40 sheets, read `index.md` first. Then view the sheets that hold beat boundaries, plus every other sheet in between.
  - Spend the stills and strips on:
    - every beat boundary;
    - the first appearance of each distinct device;
    - motion and transitions you need to measure;
    - anything that looks unlike our framework.
- **Heavy work:** anything heavier (re-decoding, audio analysis) runs under `flock out/.analysis.lock …`, and only if you really need it.
- **Shells:** never leave background shells running, and never wait with `while pgrep -f "…"` (it matches itself).

## Rules
- **Measure, don't guess.** Take numbers from metrics/audio files where possible. Mark estimates with ≈, and say what you could not measure.
- **Timestamps:** `m:ss.ff`, where ff = frame within the second at this video's fps. Add global frame numbers where useful.
- **Write only** to `analysis/vox-sample/<id>.md` and `analysis/stills/<id>/`. The media is private Vox material: don't copy it anywhere else.
- **Length:** tables over prose; 2,500–4,500 words.
- **Your final reply:** about 10 lines of summary, your top 5 `NEW-*` devices, the report path, and confirmation that no background shells are running.

---

## Report template (copy the headings exactly)

```
# <Video title> — `<id>`
YouTube <youtubeid> · <series/format> · uploaded <date> · <duration> · <W×H> @ <fps> · captions <manual|auto>

## 0. Inputs and reliability
What you read and what you could not measure; transcript corrections; any metric you distrust.

## 1. Summary (5–10 bullets)
What makes this read as Vox, and how it differs from our default Earworm look (`docs/style-guide/12-vox-earworm.md`).

## 2. Content structure
### 2.1 Narrative arc
| beat (taxonomy §7) | t0–t1 | share % | what is said (one line) | main devices (IDs) |
### 2.2 Claim → visual device map
| claim type (date, place, person-expert, person-historical, fact, list, concept, causal link, number, comparison, quote, question, payoff, ending) | example (time, words) | device ID(s) | asset type | audio treatment |
Then counts per claim type → device.
### 2.3 Script patterns
Words/min overall and per beat; narration % of runtime; sentence length (median, range); questions (count, where); person/tense; signposting phrases; how sources and experts are introduced (with quotes); opening and closing formulas; sponsor/membership/CTA.
### 2.4 Format specifics
Host on camera? Viewer question? Series intro/branding? Chapters? Interviews (how many, how framed)? Reporting trips?

## 3. Shot economy
Shot count; mean/median shot length; cuts per minute per beat; shot-type shares (taxonomy §7, % of runtime); longest holds; how a setup reveals its elements (order, timing).

## 4. Look
### 4.1 Colour: palette hexes, background colours, accent colour(s) and pixel share, grading of archival material.
### 4.2 Typography: families (name it, or describe + nearest free equivalent), roles, sizes as % of frame height, case, tracking, colour, where text sits; caption/subtitle style.
### 4.3 Layout & composition: grid, margins/safe area, text vs image placement, depth/layering.
### 4.4 Textures & finish: grain, paper, halftone, print/scan look, vignette, chromatic aberration, light leaks.
### 4.5 Branding: logo bug, lower thirds, name cards, source lines, end card, series marks.

## 5. Motion language
Camera moves (taxonomy §7) with counts and measured speeds/easing from strips; how elements enter and exit; annotation animation (draw-on, highlight, rings, arrows); map animation (zooms, borders, labels, routes); chart animation (build order, counters); 3D (what and how much); graphics frame rate (ones, twos, 12 fps); stop-motion or hand-made feel.

## 6. Transitions
| ID (VOCABULARY §3, or NEW-*) | count | example timestamps | how it differs from our spec |

## 7. Audio
### 7.1 Music: cue table | t0–t1 | style/instrumentation | BPM | mood/role | entry/exit (on a beat? pre-lap? hard?) | ducking under the voice (dB) |
### 7.2 SFX inventory: | type | count | example timestamps | what it accompanies |
### 7.3 Voice: VO pace (wpm), typical pause lengths, VO vs interview/archival audio share, any processing (phone EQ etc.).
### 7.4 Sync: cuts vs word onsets, cuts vs beats (from `<id>_sync.json`), text reveal vs the spoken word (offsets in frames), anything beat-locked.
### 7.5 Silence and structural sound: drops, dips, stingers, risers.

## 8. Device catalogue
| ID | what this video does | count | timestamps | stills | differs from our spec? |
Every device you saw: shared ones and NEW-* ones. This table feeds the coverage matrix: be complete.

## 9. What our framework would need to make this video
Ranked by how much each item defines this video's look and sound: NEW-* devices, look/theme needs (colours, type, grounds), recipe needs, audio needs. One line each, with the evidence timestamps.

## 10. Evidence index
| file | time | what it shows |
```
