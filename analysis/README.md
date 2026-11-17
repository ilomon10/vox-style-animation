# Reference analysis workspace

Everything here is derived from `reference/` by the scripts in `tools/analysis/` (run them with `python3 -I`).

| Path | What it is |
|---|---|
| `frames/<id>/NNNNNN.jpg` | **every** decoded frame, 640 px wide, index from 0 (large; regenerate with `tools/analysis/extract_frames.sh`) |
| `metrics/<id>.csv` | one row per frame: `mad` (motion energy), `mad_lo` (grain-insensitive change; ~0 = held frame), `hist_l1` (cut detector), `luma`, `luma_std`, `sat`, `warmth` (R−B), `tx`/`ty` (global translation px @1920 wide, + = right/down), `zoom` (per-frame scale, >1 = push-in), `rot_deg`, `pc_conf` (confidence of tx/ty/zoom) |
| `metrics/<id>_shots.md/.json` | automatic shot segmentation: cut list, soft transitions, per-shot duration, held-frame share, animation cadence (on ones/twos/threes), summed camera motion, luma/sat/warmth |
| `sheets/<id>/sheet_NNN.png` + `index.md` | adaptive keyframe contact sheets: every visually distinct state; label `f<frame> <s>s S<shot> +<gap>`; red label = new shot |
| `strips/<id>_<a>-<b>.png` | full-frame-rate strips (every frame) — make more with `tools/py tools/analysis/contact_sheets.py strip <id> <a> <b>` |
| `palettes/<id>.json/.png`, `palettes/stills.json` | CIELAB k-means palettes per video, per shot and per still |
| `stills/<id>/` | crops / native-resolution grabs made by analysts |
| `<report>.md` | analyst reports (template: `TEMPLATE.md`) |

Video ids: `porsche` (30 fps, 1280×720), `dracula` (24 fps, 1080p), `epigenetics` (23.976 fps, 1080p, real Vox), `highlight` (10 fps, 720p), `dracula_gif1/2` (10 fps, 800×600).
Native-resolution frame grab: `ffmpeg -v error -ss <seconds> -i "<video path from tools/analysis/sources.json>" -frames:v 1 analysis/stills/<id>/<name>.png`

## Colour-decoding note (fixed 2026-11-13)
The sources are BT.709 / tv range. The first extraction wrote BT.709 YCbCr into JPEGs, which every
decoder reads as BT.601, so yellows came out green (`#F2E500` → `#ECF20C`). `extract_frames.sh` now
converts the matrix explicitly; `frames/`, `sheets/` and `palettes/` were regenerated. Strips made by
analysts before the fix (`strips/*.png`) and hex values read from them are slightly green-shifted —
the analysts' colour tokens were taken from native ffmpeg PNG grabs (correct) and are the ones
used in `src/tokens/colors.ts`. `metrics/*.csv` were decoded via ffmpeg → rgb24 and are unaffected.

## Audio–visual analysis (added for the Vox "Earworm — Quiet Storm" episode, `earworm`, 25 fps, with sound)

| Path | What it is |
|---|---|
| `segments/earworm_segments.json`, `segments/earworm_{A,B,C,D}.mp4` | the episode split at hard cuts near each quarter (A 0–31.64 s, B –69.6 s, C –111.32 s, D –153.73 s); frame numbers stay **global** |
| `audio/earworm_{A..D}.wav`, `audio/earworm_full.wav`, `audio/earworm_full_stereo48k.wav` | analysis audio (mono 22.05 kHz f32; stereo 48 kHz) |
| `audio/earworm_features.csv` | per video frame: `rms_db`, `low_db` (<200 Hz), `mid_db` (200–2k), `high_db` (>2k), `onset` (spectral flux 0..1), `centroid_hz` — `tools/audio/audio_features.py` |
| `audio/earworm_rhythm.json` | tempo (85 BPM estimate), beats, downbeats, onsets (s + frames) |
| `audio/earworm_words.json`, `_phrases.json`, `_transcript.md` | word-level transcript with timestamps (faster-whisper base.en; `tools/py tools/audio/transcribe.py`). Private: transcripts copy the narration, so they are git-ignored and never published |
| `av/earworm_<t0>-<t1>.png` | 8 s audio-visual timelines on one frame axis: thumbnails, visual change + cuts + visual events, audio levels, spectrogram, onsets, beats/downbeats, words — `tools/audio/av_timeline.py` |
| `sheets/earworm/`, `strips/earworm_*` | as for the other videos, but every cell label also shows the spoken word and `|B`/`|D` beat/downbeat marks |
| `earworm-{A,B,C,D}.md`, `earworm-av-quant.md` | segment reports (visual + sync + sound design) and the whole-video sync statistics |

## Long videos (YouTube references)

For 6–15 min official videos (private analysis only: `reference/`, `analysis/segments/`, `analysis/audio/*.wav`, `analysis/{frames,sheets,strips,stills,av}/` are git-ignored; never commit or republish them).
Run every heavy step under the lock, one at a time: `flock out/.analysis.lock <cmd>`. Always pass an id to `extract_frames.sh` (no args = all videos in parallel).

```
tools/py tools/source/fetch_reference.py <youtube-id>=<analysis_id> --style vox-sample/main-2026   # -> reference/vox-sample/, manifest.json, sources.json (--dry-run, --any-channel, --max-height)
tools/analysis/extract_frames.sh <id>
tools/py tools/analysis/frame_metrics.py <id>
tools/py tools/analysis/shots.py <id>
tools/py tools/analysis/segment_long.py <id> --target-sec 150      # segments at hard cuts + per-segment wavs + full_stereo48k.wav
tools/py tools/audio/audio_features.py <id>                        # adds per-segment tempo/beats ("segments" in rhythm.json)
tools/py tools/audio/transcribe.py <id> --vad          # --vad: skip non-speech (fewer hallucinations)
tools/py tools/analysis/contact_sheets.py sheets <id> --sparse     # first/mid/last frame per shot + every 2 s in moving shots, 20 cells/sheet
tools/py tools/audio/av_timeline.py <id>                           # 8 s timelines (second ticks correct at 23.976/29.97 fps)
tools/py tools/audio/av_sync.py <id> --trials 500
tools/py tools/analysis/palette.py <id>                            # ids given: only those, no stills scan
```
