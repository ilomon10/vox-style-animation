# Earworm "Quiet Storm": audio-visual sync, quantitative pass

> Analyst Q. Tool: `tools/audio/av_sync.py` (numpy only, `python3 -I`). Output: `analysis/audio/earworm_sync.json`. Scratch, annotations and evidence: `analysis/stills/earwormQ/`.
>
> Source: 153.73 s, 25 fps (3843 frames), stereo AAC 48 kHz, decoded to `earworm_full_stereo48k.wav` and streamed in 2.7 s blocks.
>
> Conventions:
> - Frames are global indices.
> - **d = visual frame − audio time × 25**, in frames. **Negative d means the picture leads the sound.** ±1 f = 40 ms.
> - "dB re p99" is relative to the 99th percentile of 40 ms mid-channel frame power. Loudness is LUFS (ITU-R BS.1770-4).
>
> Null tests (2000 trials each):
> - **circ**: circular shift of the whole visual train by ≥ 2 s;
> - **jit**: every visual event jittered uniformly by ±1 s (25 f).
>
> p = (1 + #null ≥ observed) / (1 + trials). "share ±k" = fraction of visual events with an audio event within ±k frames.

```bash
python3 -I tools/audio/av_sync.py earworm --speakers analysis/stills/earwormQ/earworm_speakers.json \
  --reveals analysis/stills/earwormQ/earworm_text_reveals.json --music analysis/stills/earwormQ/earworm_music.json --colour
# 60 s, < 200 MB (7 s without --colour). Without the three annotation files everything is automatic (§8).
```

## 0. Input reliability (read first)

| Issue | Measured | Consequence |
|---|---|---|
| **faster-whisper word starts** | Against 48 word onsets I verified by hand (10 ms envelopes): median \|error\| **2.0 f**, p90 6.8 f, worst 22 f ("urban", whisper 0.88 s early). On 8 checked phrase starts the error was 1.5–11.7 f (median 7.5 f): "In" −8.0, "George" −11.0, "R&B" +11.7, "So," −10.5, "But" −6.5 f. | Raw whisper times cannot support ±1–3 f statistics, so the tool refines them. |
| **Refined onsets** (tool) | Phrase-initial words: best ≥ 8 dB rise of the 250–8000 Hz mid level within ±0.6 s, scored by preceding silence and centre excess M−S. Other words: monotonic DP within ±0.5 s with a syllable-count prior. | 7/8 phrase starts within ±0.5 f (the 8th, "DC", 4.3 f). On the 48 verified words: median 0.5 f, p90 5.5 f (the DP cannot recover whisper errors > 0.4 s inside a phrase). |
| **Whisper pauses ≥ 250 ms** | Some are not acoustic pauses ("Washington, DC" at 12.2→12.8 s never dips for more than 30 ms). Some real pauses sit one word earlier (before "jazz," not before "mixed"). | About 10 % label noise in the phrase set; left uncorrected. |
| **Speakers** | Manual spans (`earworm_speakers.json`). Evidence: bed-subtracted voice power 7–12 kHz / 1–4 kHz (narrator −8…+2 dB; remote interviews band-limited at 7 kHz, −26 dB or lower; record, radio and phone voices −12…−39 dB), plus transcript and talking heads. | Narrator 241 words, interview 53 (two remote interviewees), archival 46 (George Clinton on the record, a DJ back-announcing "…Sarah Vaughan" and "…Nat King Cole", call-in listeners). The automatic band-limit rule agrees on 93.2 % of words. |
| **Music boundaries** | Manual list of 27 (`earworm_music.json`), read from side-channel and sub-bass envelopes. The automatic detector reaches recall 0.89 and precision 0.74 at ±0.5 s, median error 1 f. | Alignment uses the 26 boundaries not marked "low". |
| **Text reveals** | 48 annotated by hand: frame of the first visible pixel of the new text, checked on strips. The word's acoustic onset was read by hand to ±0.02 s (11 marked "low", ±0.1 s). | Lead/lag is measured against those acoustic onsets. |
| **Beats** | Only 5 of 17 excerpts have an autocorrelation (ACF) peak ≥ 0.2. The ballads are rubato. | The "beats" set is 104 beats from 5 excerpts. A tempo-free "music onsets" set was added. |

## 1. Event sets

| Set | n | Definition | Quality |
|---|---|---|---|
| hard cuts | **21** (27 raw) | `shots.json` cuts. Chains ≤ 6 f apart count once: the strobe f1904–1921 and the card slide f2382–2388. | – |
| soft-transition starts | 11 | `shots.json` (hist change for ≥ 3 f) | 9 of 11 are pieces of linear fades to or from black (§4.5) |
| visual onsets | 64 | Burst detector on `mad_lo`: value ≥ max(0.3, 3 × median of the change frames in the previous 12 f, 6 × the shot floor). Holds on twos do not lower the baseline; footage and drift raise it. | 8–9 of 12 sampled are real (element entrances, caption swaps; `vis_onsets_check.png`). It finds only 6 of the 48 text reveals, because small text is buried under the constant camera drift. |
| camera-move starts | 22 | tx/ty/zoom with pc_conf ≥ 0.5; ≥ 1.2 px/f for ≥ 6 f; path ≥ 40 px; coherent (net/path or zoom sign ≥ 0.6) | No 4-quadrant test, so some layer motion may remain |
| text reveals | 48 | Manual: 21 lyric captions, 13 keywords, 9 call-in quotes, 2 titles, 2 song credits, 1 lower third | ±0.5 f |
| word onsets | 340 (narrator 241) | Refined (§0) | median 0.5 f, p90 5.5 f |
| phrase onsets | 36 narrator / 50 all speakers | First word after a whisper pause ≥ 250 ms, or after a speaker change | ~10 % label noise |
| stressed words | 75 | Narrator content words (not in a 127-word function list) with z(log duration) + z(peak level − phrase median) ≥ 0 | Heuristic; e.g. "year, 1976, radio, station, WHUR, understand, Washington…" |
| beats / downbeats | 104 / 26 | Ellis DP per excerpt where ACF ≥ 0.2. Downbeat = the 4-beat phase with the most < 210 Hz flux. | Tempo ambiguous (§4.1) |
| music onsets | 458 | Peaks of the voice-free envelope (side bands + mid < 210 Hz; full mid only without speech) while music plays | Tempo-free beat proxy |
| music boundaries | 27 | 11 start, 11 stop, 5 change | ±2 f |
| SFX candidates | 12 | Top-3 % broadband onsets (≥ 50 % of bands rising), outside speech spans, ≥ 60 ms from beats | 10/12 fall inside music-only stretches (likely drum hits). 1 is credible: a rising whoosh at 111.21 s into the whip-pan f2779–2782, cut f2783 (d = +2.8 f). No separate SFX layer is evident. |

## 2. Frame classes: music vs narration

**Rule:**
- speech frames = phrase spans;
- **silence** = mid + side level < −35 dB re p99 for ≥ 4 f (acoustic only);
- **music** = any of side > −50 dB, mid sub-bass (< 110 Hz) > −28 dB, or non-silent sound inside a ≥ 1 s non-speech stretch; then a 0.5 s median filter, gaps < 0.5 s closed.

**Validation:** the interview stretches without music have a side channel of exactly digital zero (42.3–45.0 s and 118.0–120.0 s), and narrator voice alone sits at side −70…−80 dB.

| Class | s | share | mid dB | side dB | side − mid dB | sub dB | LUFS (class mean) | ICC ≈ (M−S)/(M+S) |
|---|---|---|---|---|---|---|---|---|
| narration, no music | 9.7 | 6.3 % | −7.0 | −80.4 | **−70.0** (mono) | −39.5 | −13.3 | 1.00 |
| narration + music | 60.3 | 39.2 % | −4.9 | −30.3 | −23.3 | −20.0 | −11.9 | 0.99 |
| archival / interview voice | 34.3 | 22.3 % | −5.2 | −31.5 | −22.3 | −26.8 | −12.2 | 0.99 |
| music only | 43.6 | 28.4 % | −8.8 | −22.6 | **−11.2** | −18.7 | −14.3 | 0.86 |
| silence | 5.8 | 3.8 % | −36.6 | −63.3 | – | −42.7 | −17.4 (incl. fade tails) | – |

**86 % of narrator speech has music under it.**

Music is pulled out under narration three times for longer than 2 s: 64.5–67.7 s ("At the time, WHUR…"), 101.4–104.6 s ("…like-minded jazz") and 142.0–144.2 s ("…ties it all together"). There is also a 1 s gap at 97.6–98.5 s. In each case the music returns on the next key word or cut.

## 3. Alignment

### 3.1 Matrix (selected rows; all 100 pairs are in `alignment` in the JSON)

| visual \| audio | n v/a | med d | share ±1 / ±2 / ±3 f | null ±2 circ / jit | p circ / jit (±2) | lead share (n within ±12 f) |
|---|---|---|---|---|---|---|
| cuts \| narrator phrase onsets (refined) | 21/36 | −1.0 | .05 / **.14** / .14 | .04 / .05 | .052 / .095 | .56 (9) |
| cuts \| narrator phrase onsets (whisper) | 21/36 | −0.5 | .19 / **.24** / .29 | .04 / .06 | **.005 / .006** | .50 (8) |
| cuts \| phrase onsets, all speakers | 21/50 | −0.5 | .10 / **.24** / .24 | .05 / .07 | **.003 / .011** | .55 (11) |
| cuts \| word onsets | 21/340 | +1.5 | .14 / .29 / .38 | .34 / .29 | .78 / .59 | .40 (20) |
| cuts \| stressed words | 21/75 | −3.2 | .05 / .05 / .10 | .08 / .09 | .85 / .87 | .38 (8) |
| cuts \| beats (5 excerpts) | 21/104 | −3.5 | .00 / **.00** / .05 | .11 / .09 | 1.0 / 1.0 | .67 (6) |
| cuts \| downbeats | 21/26 | −6.5 | .00 / .00 / .00 | .03 / .02 | 1.0 / 1.0 | 1.0 (2) |
| cuts \| global 85 BPM grid | 21/219 | −0.3 | .10 / .24 / .38 | .23 / .22 | .59 / .51 | .52 (21) |
| cuts \| music onsets (tempo-free) | 21/458 | +0.2 | .33 / .48 / .52 | .45 / .48 | .49 / .61 | .47 (19) |
| cuts \| music boundaries | 21/26 | **+5.0** | .10 / **.14** / .19 | .03 / .07 | **.026** / .15 | **.11** (9) |
| soft-transition starts \| music boundaries | 11/26 | +1.0 | .27 / .27 / .36 | .03 / .11 | **.003** / .11 | .33 (6) |
| visual onsets \| word onsets | 64/340 | +0.1 | .20 / .27 / .44 | .34 / .35 | .92 / .95 | .45 (56) |
| visual onsets \| narrator phrase onsets | 64/36 | +4.0 | .02 / .03 / .09 | .04 / .05 | .76 / .87 | .50 (18) |
| visual onsets \| stressed words | 64/75 | −0.1 | .03 / .05 / .08 | .08 / .06 | .91 / .76 | .53 (17) |
| visual onsets \| beats | 64/104 | +1.2 | .06 / .11 / .12 | .12 / .07 | .59 / .14 | .47 (15) |
| visual onsets \| music onsets | 64/458 | +0.2 | .33 / .52 / .67 | .45 / .47 | .16 / .23 | .47 (55) |
| visual onsets \| music boundaries | 64/26 | −4.5 | .08 / .08 / .11 | .03 / .03 | .061 / .060 | .42 (12) |
| camera-move starts \| word onsets | 22/340 | −1.0 | .23 / .27 / .59 | .34 / .33 | .81 / .80 | .53 (19) |
| camera-move starts \| narrator phrase onsets | 22/36 | −6.4 | .00 / .00 / .00 | .04 / .04 | 1.0 / 1.0 | .75 (4) |
| camera-move starts \| beats / music onsets | 22 | +1.0 / −1.8 | .14 / .45 (±2) | .11 / .45 | .45 / .58 | – |
| text reveals \| nearest word (any word) | 48/340 | +0.8 | .19 / .48 / .71 | .34 / .47 | .035 / .54 | .40 (47) |

### 3.2 Window tests and context of the 21 cuts

| Test (cuts, n = 21) | share | null circ / jit | p circ / jit |
|---|---|---|---|
| **a music boundary in the 12 f before the cut** (music leads) | **0.43** | 0.08 / 0.15 | **0.001 / 0.001** |
| a music boundary in the 12 f after the cut (cut leads) | 0.10 | 0.08 / 0.17 | 0.54 / 0.92 |
| a narrator phrase onset in the 12 f after the cut | 0.24 | 0.11 / 0.18 | 0.071 / 0.30 |
| a narrator phrase onset in the 12 f before the cut | 0.19 | 0.11 / 0.14 | 0.20 / 0.33 |
| automatic speakers + automatic boundaries: cut ±2 f of a narrator phrase onset / of a music boundary | 0.19 / 0.24 | 0.04 / 0.04 | 0.009 / 0.0005 |

| Cut context | n | Cuts (frame: d to the audio event) |
|---|---|---|
| **music edit** within ±12 f (cut after the music boundary in 9 of 10) | 10 | f697 (−3: restart after a 0.4 s hole), 1481 (+2), 1619 (+8 after a stop), 1697 (+5), 2382 (0), 2476 (+12), 2635 (+7), 2783 (+8), 3247 (0, boundary "low"), 3781 (+1) |
| **pause before a narrator phrase** | 3 | f791 (phrase 1 f later), 1224 (4.75 f), 3331 (11.75 f); f1619 and f697 also lead "At" and "In" by 6.0 and 8.75 f |
| mid narrator phrase | 4 | f316 ("DC"), 1740 ("speeches"), 1904 (strobe on "1976."), 3640 (+8.75 f after "The call-ins") |
| voice turn / other | 4 | f1774, 1810, 2925 and 3156 (archival voice, interview) |

**Answers.**
- **Cuts are not placed on beats.** 0/21 cuts fall within ±2 f of a tracked beat, against 11 % by chance. Tempo-free music onsets give 48 % against 45 % (p = 0.49). Beat-phase Rayleigh test: R = 0.38, p = 0.51 (n = 5); for all visual events R = 0.18, p = 0.47.
- **Cuts follow music edits.** 43 % of cuts have a music start, stop or change 0–12 f before them, against 8 % by chance (p = 0.001).
  - New music enters **a median 3.5 f before the cut** (IQR 1–7 f, range −3…+12 f, 8 cases).
  - When the music stops first, it stops 7–10 f before the cut (4 of 5 cases).
- **Cuts are only weakly tied to narration phrase starts.** Within ±2 f of a refined narrator phrase onset: 14 % against 4 % (p ≈ 0.05–0.10).
  - The effect rises to 24 % (p = 0.005) with whisper's earlier phrase starts, or with all speakers.
  - The cuts that do belong to narration sit **in the pause, 1–12 f (median 6) before the voice resumes**.

### 3.3 On-screen text reveals vs their own spoken word (acoustic onsets; `text_reveals` in the JSON)

| Kind | n | median d | IQR / range | within ±2 f | lead / lag | median d vs whisper |
|---|---|---|---|---|---|---|
| **lyric captions**, word by word, stepping on threes (George Clinton, 17.7–23.7 s) | 21 | **+1.0** | −0.5…+1.75 | 71 % | 29 % / 71 % | +1.0 |
| **interview keyword captions** (GEORGE, CLINTON, POST-, INDUSTRIAL, BLACK, URBAN, EXPERIENCES) | 7 | **+1.75** | −2.6…+2.3 (range −4.5…+3.25) | 43 % | 43 % / 57 % | +8.5 (whisper wrong) |
| **narrator keyword graphics** (1976 digits, WHUR 96.3, R&B letters, CHOCOLATE / CITY type-on) | 6 | **−7.25** | range −22.3…0 | 17 % | 83 % lead | −7.25 |
| **call-in quote captions** (DID, SOMETHING ?, YES, YES, DON'T, STOP, EVER, LOVING, ME) | 9 | **−4.25** | −5.5…−3.25 | 0 % | 100 % lead | −2.5 |
| lower third FREDARA HADLEY (types on) | 1 | −2.25 | – | – | lead | −3.5 |
| titles (CHOCOLATE CITY, Parliament) | 2 | **+10.5** | +8, +13 | 0 | lag | +8.75 |
| song credits (SARAH VAUGHAN; NAT KING COLE) | 2 | +11.25 vs "Sarah" (+1.5 vs "Vaughan"); −13.75 | – | – | – | – |
| all word-synced (lyric + keyword + quote + name) | 44 | −0.8 | −4.1…+1.3 | 43 % | 55 % / 43 % | −0.25 |

**Answer: the lead or lag depends on what the text does.**
- **Captions that transcribe the voice land on the syllable.** Lyric captions sit +1 f after the word (median), interview keywords +1.75 f.
- **Graphics that illustrate the narrator start early** so they are readable on the word: −7 f. The CHOCOLATE / CITY type-on starts 22 f / 20 f early, inside the narrator's dramatic 0.4 s pause.
- **Call-in quote captions lead by about 4 f.**
- **Titles and credits confirm a name after it is spoken** (+8…+13 f), or are locked to the cut instead (NAT KING COLE appears 4 f after cut f2783).

## 4. Music and mix

### 4.1 Tempo map (excerpts between the verified boundaries)

Method: ACF of the voice-free onset envelope; pulse salience = ACF at 1–4 × the lag; log-Gaussian prior at 100 BPM. The ACF value is the confidence.

| Excerpt (s) | music-only share | BPM (ACF) | alternatives (ACF) | beats | note |
|---|---|---|---|---|---|
| 0.00–16.52 | 45 % | 123 (.17) | **61.5 (.19)**, 132.5 | – | intro bed; half/double ambiguous |
| 16.52–27.60 | 24 % | 109 (.11) | 73.5, 146.5 | – | Parliament "Chocolate City", talking |
| 28.00–42.20 | 35 % | 109 (.24) | 72.5 (.25) | 26 | same record after the edit; 0.275 s grid |
| **46.08–53.36** | 14 % | **95 (.68)** | 63.5 (.54) | 12 | the only clear pulse: ACF peaks every 0.316 s |
| 53.68–58.84 / 59.16–64.44 | 1 % / 7 % | – (.06 / .10) | – | – | beds under narration / interview |
| 67.68–77.00 | 45 % | 163 (.14) | 108.5, 81.5 | – | broadcast montage |
| 77.48–94.92 | 23 % | 139.5 (.28) | 70 (.24), 93.5 (.24) | 39 | jazz-funk; 0.215 s grid, bar 1.71 s |
| 105.12–111.00 / 111.00–117.84 | 92 % / 22 % | 85.5 (.14) / 83 (.09) | – | – | Sarah Vaughan / Nat King Cole, rubato |
| 121.32–129.88 | 1 % | 142.5 (.22) | 70 (.17) | 21 | under narration and interview |
| 129.88–134.32 | 92 % | **82 (.21)** | 164 (.20) | 6 | Anita Baker "Angel" with lyric captions |
| 134.32–142.04 / 144.32–151.20 | 12 % / 41 % | – (.09) / 116 (.18) | 67.5 | – | mono bass bed / call-in bed |

**Music-only stretches ≥ 3 s:**
- 106.08–112.00 s: 84.5 BPM, ACF 0.16;
- 129.88–133.68 s: 82 BPM, ACF 0.22.

The global **85 BPM** in `earworm_rhythm.json` is not a tempo of this video: it averages 17 excerpts, most of them slow ballads.

### 4.2 Excerpt boundaries vs cuts

Cut − boundary, frames (raw cuts, boundaries with a cut within ±12 f, 14 of 27):

| Boundary type | values | median | reading |
|---|---|---|---|
| start / change | 27.98: −3 · 59.16: +2 · 67.70: +5 · 95.28: **0** · 98.55: +12 · 105.14: +7 · 111.00: +8 · 151.20: +1 | **+3.5** | new music arrives 0–0.3 s before the picture changes |
| stop | 27.58: +7 · 58.84: +10 · 64.45: +8 · 77.00: −4 · 94.92: +9 | **+8** | a 0.3–0.4 s hole of silence precedes the cut |

- Same frame (±1 f): 3/27.
- Music leads the cut in 8 of the 9 reliable-boundary pairs within ±12 f of the 21 merged cuts. The exception is f697, cut 3 f before the music restarts.
- The other 13 boundaries happen under continuous shots, mostly music sliding under or out of an interview.

### 4.3 Fades

Fade length = time between the boundary and the music indicator (side level, or sub-bass for mono music) reaching, or leaving, 3 dB below its 2 s p90.

| | n | median | IQR | distribution |
|---|---|---|---|---|
| music in | 11 | **7 f (0.28 s)** | 2.5–18 f | **hard (1–4 f)** at section changes (27.98, 46.07, 59.16, 95.28, 121.32 s). **0.6–1.2 s** when entering under speech (53.68: 25 f, 67.70: 18, 98.55: 18, 144.30: 31). |
| music out | 11 | **8 f (0.32 s)** | 3–37.5 f | **hard (0–3 f)** before cuts (27.58, 58.84, 94.92, 142.03). **1.4–1.7 s** fade-outs under interview or narration (42.19: 41 f, 64.45: 42, 101.40: 39, 117.84: 36). |

### 4.4 Music level under narration and ducking

The music indicator is the side level, or sub-bass where the music is mono. Voices are centre mono, so the indicator contains no speech.

| Measure | n | Value |
|---|---|---|
| **speech-to-music ratio** under narration (mid level in the phrase − estimated music mid level) | 28 phrases | **+9.7 dB** median (IQR +2.6…+14.7) |
| narration mid level − adjacent music-only mid level | 28 | +4.2 dB (IQR +2.1…+10.2) |
| duck per phrase (music in the ±2 s music-only frames − music under the phrase) | 28 | **+0.8 dB** median (IQR −3.0…+5.5); 43 % of phrases ≥ 3 dB |
| music alone vs under narration, per excerpt | 7 | +3.6 dB median (−5.3…+15.5; 13.2 and 15.5 dB in the two "Chocolate City" sections) |
| trace locked to phrase onsets (≥ 0.6 s pause before) | 14 | −0.2 dB (IQR −11…+10): **no duck at phrase starts** |
| trace locked to phrase ends (≥ 0.6 s pause after) | 14 | **+2.4 dB swell** (IQR −10…+5.9); 10→90 % from −0.36 to −0.10 s re the whisper word end (≈ 0.26 s ramp; ±0.1 s whisper error) |

**Reading.**
- There is **no automatic side-chain ducking**.
- The bed is mixed about 10 dB under the voice and ridden by hand: swells of +2…+15 dB in the gaps where the record is "featured" (Chocolate City, 37–40 s, "Right on…").
- Music is cut out completely for three narration lines (§2).

### 4.5 Silence gaps (≥ 4 f below −35 dB) and what the picture does

| Gap (s, frames) | len | min dB | picture | timing |
|---|---|---|---|---|
| 27.56 (f689–700) | 11 f | −57 | no black | **cut f697 inside the gap**; music restarts 3 f after the cut |
| 53.36 (f1334–1352) | 18 f | digital 0 | dissolve through black: 8 f out, 9 f black, 9 f in | audio fade starts 5 f after the picture fade (4 f long); audio returns 10 f after the fade-in starts |
| 58.84 (f1471–1479) | 8 f | −61 | no black | music restarts 2 f **before** cut f1481 |
| 77.00 (f1925–1941) | 16 f | −60 | strobe + 27 f fade, 14 f black, 16 f fade-in | audio fade starts 17 f after the picture fade (11 f long); audio returns +3 f |
| 94.92 (f2373–2382) | 9 f | −51 | no black | music restarts **on cut f2382** (0 f) |
| **120.96** (f3024–3032) | 8 f | −70 | 17 f fade to black (−3.4 levels/f), 18 f black, 36 f fade-up (+3.8 levels/f) | audio fade starts 19 f after the picture fade (8 f long); **audio hard-in on the first fade-up frame f3032 (0 f)** |
| 136.92 (f3423–3429) | 6 f | −39 | – | a narration pause inside the music-free stretch, not a designed gap |

Two silence patterns, both used as **section breaks**:

1. **Silence hole before a cut.**
   - 8–11 f of silence.
   - The cut lands inside the hole or on its last frame.
   - New sound starts within ±3 f of the cut.
2. **Dip to black.**
   - The picture leads out by 5–19 f.
   - The audio fades over 4–11 f and is silent while the screen is black.
   - Sound and picture come back together (0–10 f).

## 5. Pacing

| Quantity | Value | Note |
|---|---|---|
| narrator articulation rate | **3.47 words/s** (208 wpm) | 241 words in 69.4 s of phrase time |
| narrator words per minute of video | 94 | narration fills 45 % of the timeline |
| pauses between consecutive narrator words | median 0.04 s | counts: < 0.1 s 151 · 0.1–0.25 s 40 · 0.25–0.5 s 23 · 0.5–1 s 12 · 1–2 s 9 · ≥ 2 s 0 |
| **phrase pauses** (≥ 0.25 s, n = 44) | p25 0.34 · **median 0.48** · p75 0.88 · p90 1.14 s | |
| phrase length | median **1.59 s** (p10 0.52, p90 3.54), 5.5 words | |
| shot length (`shots.json`) | median 3.7 s (p10 0.15, p90 13.4) | 1 phrase per shot (median); Spearman ρ(shot length, phrases in shot) = 0.79 |
| beats per visual event | median 2.5, mean 3.1 (n = 19 intervals in pulsed excerpts; histogram 0:4, 1:6, 2:1, 3:4, 4:1, 5:3) | no integer locking |
| **cut density** | music-only **11.0 /min** (8 in 43.6 s) · narration + music 8.0 /min (8 in 60.3 s) · interview/archival voice 5.3 /min (3 in 34.3 s) · narration without music 0 in 9.7 s · silence 2 in 5.8 s · overall 8.2 /min | the picture cuts most when nobody talks |

## 6. Audio-reactive check (cross-correlation, lags −25…+25 f)

**Series.**
- Audio: total, side, sub-bass, rms/low/mid/high dB, onset.
- Visual: `mad_lo`, `mad`, luma, |Δluma|, accent area (saturated pixels, which in this video are the blue graphics), accent change.

**Method.** Series are z-scored per shot, with cut frames ±2 and soft transitions masked. "Fast" = after removing a 1 s moving average. Family-wise p uses the maximum |r| over all lags across 1000 circular shifts. Positive lag = the picture follows the sound.

| Pair | Scope | lag f | r | p (null p95) | Reading |
|---|---|---|---|---|---|
| loudness (rms_db) ~ luma | all shots, raw | 0 | +0.18 | .001 (.12) | sound and picture dim together (fades, dips to black) |
| sub-bass ~ `mad_lo` | all, raw | −1 | +0.12 | .001 (.06) | slightly more motion when the bass is loud |
| any audio ~ any visual | all, fast | – | ≤ 0.06 | only onset ~ accent area .001 (r 0.058) | **no general frame-level audio reactivity** |
| level ~ accent area | **Nat King Cole equaliser bars** f2783–2924 | −2 | **+0.59** (0.24 at lag 0) | .003 | the bars follow the music level |
| onset ~ accent area | same | 0 | +0.30 | .003 | |
| onset ~ accent area | **Anita Baker waveform line** f3247–3330 | +1 | **+0.48** (0.37 at lag 0) | .003 | the line pulses with the onsets |
| level ~ \|Δluma\| | same | 0 | +0.49 | .003 | |
| level / onset ~ accent | Sarah Vaughan dot meter f2635–2782 | – | n.s. (only onset ~ `mad_lo` +0.21 at −6) | – | the dots animate on their own |
| **"flicker cluster" 120–122.5 s** | f2997–3068 | 0 on the way in, picture −19 f on the way out | – | – | **not a flicker but a dip to black** (§4.5). The soft transitions f3006–3064 are pieces of the two linear ramps. |

Per-shot testing flags 71 of 342 pair tests at p ≤ 0.01 (19 shots ≥ 2 s × 3 audio × 6 visual series), in 15 shots; about 3 are expected by chance. Only the three visualiser shots are interpreted. The rest are slow co-trends or talking-head motion (interview f3156: head motion precedes the speech level by 9–10 f).

**Conclusion: reactivity exists only where a visualiser element is drawn, over music-only passages, at lag −2…+1 f (0 within resolution).** The ± 2 f comes from twos stepping plus the 85 ms analysis window.

## 7. Loudness and stereo (BS.1770-4, K-weighting implemented as an exact 4096-tap FIR; checked +0.70 dB at 1 kHz, +4.0 dB above 5 kHz, −13.4 dB at 20 Hz)

| Quantity | Value |
|---|---|
| integrated loudness (gated −70 / −10) | **−12.6 LUFS** |
| loudness range LRA (3 s, gated −70 / −20) | **4.1 LU** (short-term p10 −14.7, p95 −10.7 LUFS) |
| momentary max / short-term max | −7.7 / −9.6 LUFS |
| sample peak | 0.0 dBFS (limited; true peak is probably > 0) |
| narration + music minus music-only (class means) | **+2.4 LU** (−11.9 vs −14.3) |
| narration without music minus music-only | +1.0 LU |
| speech-to-music ratio under narration | +9.7 dB median (§4.4) |
| stereo width: side − mid, median | narration −70 dB (mono; the interview side channel is digital zero) · music under narration −23.3 dB · **music alone −11.2 dB** (ICC ≈ 0.86) |

## 8. Tool and reproduction

`tools/audio/av_sync.py <id>` needs `metrics/<id>.csv`, `<id>_shots.json` and `audio/<id>_words.json`. It reads `_features.csv` and `_rhythm.json` when present, and uses the stereo WAV or decodes the source with ffmpeg.

It writes `analysis/audio/<id>_sync.json` with these sections:
- `classes`, `speakers`, `words` (whisper vs refined onset, phrase, stressed, band limit);
- `event_counts`, `visual_events`, `music` (boundaries with fades and nearest cut, `tempo_map`, `auto_vs_manual`);
- `alignment` (100 pairs), `cuts_context` (contexts, window tests), `text_reveals`;
- `ducking`, `silence_gaps` (with dip-to-black timing), `pacing`, `audio_reactive`, `loudness`;
- `frame_class`, one character per frame: `.` silence, `n` narration, `N` narration + music, `a` archival voice, `m` music-only.

**Automatic mode** (no annotation files; `analysis/stills/earwormQ/auto_sync.json`) gives the same conclusions:
- cuts ±2 f of a narrator phrase onset: 0.19 (p 0.009);
- cuts ±2 f of a music boundary: 0.24 (p 0.0005);
- music boundary in the 12 f before a cut: 0.33 (p 0.005);
- beats: 0.00.

Evidence in `analysis/stills/earwormQ/`:
- Annotations: `earworm_speakers.json`, `earworm_text_reveals.json`, `earworm_music.json`.
- Reveal verification: `lyric_captions.png`, `seq_a.png`, `seq_b.png`, `rev_a/b/c.png`.
- `vis_onsets_check.png` (visual-onset sample), `seq_sfx.png` (SFX candidates), `overview_ms_spec.png` (mid/side spectrogram of the whole video).
- `scripts/`: the exploration that set the thresholds — `env100`/`envp` for the 10 ms envelopes, `phrase_refine2`, `word_refine` and `spec_cmp`.

## 9. Design tokens

```ts
// Vox "Earworm" audio-sync tokens, measured by analyst Q (analysis/earworm-av-quant.md, analysis/audio/earworm_sync.json).
// Units: frames @25 fps (40 ms) unless the key says s / dB / LUFS. Negative offset = picture BEFORE sound.
export const voxAudioSync = {
  fps: 25,
  mix: {
    integratedLufs: -12.6,          // §7 BS.1770-4 gated; deliver -14 for YouTube if not normalised
    loudnessRangeLu: 4.1,           // §7 LRA; short-term p10..p95 = -14.7..-10.7 LUFS
    speechOverMusicDb: 10,          // §4.4 median +9.7 dB (IQR 2.6..14.7, n=28 phrases)
    narrationOverMusicOnlyLu: 2.4,  // §7 narration+music frames vs music-only frames
    sidechainDuckDb: 0,             // §4.4 phrase-onset-locked trace -0.2 dB: do NOT auto-duck
    gapSwellDb: { median: 2.4, max: 15, rampS: 0.26 },    // §4.4 phrase-end swell; up to 13-15 dB where a record is featured
    musicUnderNarrationShare: 0.86, // §2: share of narration with music underneath
    musicOutForKeyLines: true,      // §2: 3 lines with the bed removed (64.5, 101.4, 142.0 s)
    narrationPan: "mono-centre",    // §7 side-mid -70 dB; interview tracks exactly mono
    musicSideMinusMidDb: -11,       // §7 music alone, ICC ~0.86; under narration -23 dB
    interviewBandLimitHz: 7000,     // §0 remote-interview voices are band-limited, keep that texture
  },
  speech: {
    wordsPerSecond: 3.5,            // §5 articulation 3.47 w/s (208 wpm)
    phrasePauseS: { p25: 0.34, median: 0.48, p75: 0.88, max: 1.14 }, // §5 n=44
    phraseS: { median: 1.6, p10: 0.5, p90: 3.5 }, wordsPerPhrase: 5.5,  // §5
  },
  cuts: {
    onBeat: false,                  // §3.1 0/21 within +-2 f of beats (chance 11 %); Rayleigh p 0.51
    followMusicEdit: { medianFrames: 3.5, iqrFrames: [1, 7] }, // §4.2 new music enters BEFORE the cut (range -3..+12 f, n=8); 43 % of cuts, p 0.001
    silenceHoleBeforeCutFrames: [8, 11], // §4.5 old music stops 7-10 f before the cut; new sound within +-3 f of the cut
    beforeNarratorPhraseFrames: { median: 6, range: [1, 12] }, // §3.2 when a cut sits in a narration pause
    perMinute: { musicOnly: 11, underNarration: 8, interview: 5.3, overall: 8.2 }, // §5
    oneShotPerPhrase: true,         // §5 median 1 phrase per shot; shot median 3.7 s vs phrase 1.6 s
  },
  textReveal: {                     // §3.3 offset of the first visible frame vs the word's acoustic onset
    lyricCaptionFrames: 1,          // n=21, IQR -0.5..+1.75, 71 % within +-2 f; caption steps on threes (3 f)
    interviewKeywordFrames: 2,      // n=7, +1.75 median, range -4.5..+3.25
    narratorGraphicFrames: -7,      // n=6, start animating ~7 f early so it reads on the word
    anticipatoryTypeOnFrames: -22,  // CHOCOLATE CITY type-on inside the narrator's 0.4 s dramatic pause
    quoteCaptionFrames: -4,         // n=9 call-in quotes, IQR -5.5..-3.25, all lead
    lowerThirdFrames: -2,           // FREDARA HADLEY lower third (n=1)
    titleOrCreditFrames: 10,        // n=2+1, +8..+13: confirm a name after it is said; or lock to the cut (+4 f)
  },
  musicEdits: {
    fadeInFrames: { hard: 3, underSpeech: 18 },   // §4.3 median 7 (IQR 2.5-18); slow 18-31 f when entering under a voice
    fadeOutFrames: { hard: 2, underSpeech: 40 },  // §4.3 median 8 (IQR 3-37.5); 36-42 f fades out under an interview
    excerptSeconds: { median: 6.9, p25: 5.2, p75: 9.3, max: 17.4 }, // §4.1 17 excerpts between verified boundaries
  },
  dipToBlack: {                     // §4.5 section break (53.4, 77.0, 121.0 s)
    pictureFadeOutFrames: 17,       // 8-27 (linear, ~ -3.4 luma levels/f)
    audioFadeStartsAfterPictureFrames: 17, // 5-19: picture leads on the way out
    audioFadeOutFrames: 8,          // 4-11
    blackHoldFrames: 14,            // 9-18 black, silence 8-18 f
    audioInVsPictureInFrames: 0,    // 0-10: hard audio-in on the first fade-up frame
    pictureFadeInFrames: 16,        // 9-36 (+3.8 levels/f)
  },
  audioReactive: {
    general: false,                 // §6 fast coupling r <= 0.06 across the film
    visualiserLagFrames: 0,         // §6 equaliser bars / waveform line: r 0.48-0.59 at lag -2..+1 f, music-only shots only
    visualiserDrive: "level+onset", // bars follow level, waveform line follows onsets; update on twos is fine
  },
  sfx: { layer: "minimal", whooshIntoWhipCutFrames: 3 }, // §1 one credible whoosh, peaking 2.8 f before the whip-pan cut
} as const;
```
