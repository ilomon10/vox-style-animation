# tools/voice: scratch voice-over, recording guide, re-cue

Pipeline: `script.md` (Vox-style narration with markup) -> **scratch VO** (local TTS) -> cue file (every visual anchored to
WORDS) -> user records the real VO -> `recue.py` re-times everything. Run all of it with `tools/py` (the project venv made by `bash tools/setup.sh`).

## Install (done once)
`tools/.venv/bin/pip install kokoro-onnx soundfile` (works on Python 3.14; onnxruntime already present; the `espeakng-loader` wheel
brings the phonemiser data). Models (git-ignored, data only) go in `tools/voice/models/`:
```
B=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
curl -L -o tools/voice/models/kokoro-v1.0.onnx $B/kokoro-v1.0.onnx     # 326 MB (fp32)
curl -L -o tools/voice/models/voices-v1.0.bin  $B/voices-v1.0.bin      # 28 MB, 54 voices
```
Licences: Kokoro-82M weights and voices: Apache-2.0 (hexgrad/Kokoro-82M); `kokoro-onnx` code: MIT; onnxruntime: MIT;
phonemizer-fork: GPL-3.0 and espeak-ng: GPL-3.0 (used as a separate library/process for grapheme-to-phoneme only; no GPL code is
shipped in the videos). Generated audio is yours; check voice cards before a commercial release. Good English voices:
`am_michael` (default, male narrator), `am_adam`, `am_eric`, `af_heart`, `af_nicole`, `bm_george` / `bf_emma` (en-gb, auto lang).
Kokoro has no SSML and no stress control: `*stress*` marks only affect the recording guide and the parsed JSON.

## Script markup (`script_markup.py`; matches what the editorial docs should use)
Plain lines of narration; blank line = paragraph; `# heading` / `// note` ignored; `*stressed*` words;
`[PAUSE 0.6]` explicit silence (replaces the default pause there); not-spoken tags kept with their position:
`[BEAT recipe=... anchor="word" ...]`, `[MUSIC ...]`, `[SFX ...]`, `[ARCHIVAL "clip description" ...]`.
`anchor="word"` = nearest occurrence at/after the tag (12 words ahead, then back); `anchor="word#2"` = 2nd occurrence overall.
Parsed to `video-projects/<slug>/script.parsed.json`: `words[{i,text,norm,stress,sentence,paragraph}]`,
`chunks[{word_start,word_end,text,pause_after,kind}]`, `lead_pause`, `tags[{id,type,raw,attrs,before_word,anchor,anchor_word}]`.
Sentence ends = `. ? !` (not `U.S.`, `Sen.`, `Mr.`).

## Commands
```
scratch_vo.py video-projects/<slug>/script.md [--voice am_michael] [--wpm 208] [--fps 25] [--cues-out PATH] [--lang en-gb]
recording_guide.py video-projects/<slug>            # -> RECORDING_GUIDE.md
../studio/recue.py video-projects/<slug> user_vo.wav
measure_pace.py <wav> <n_words>                      # ASR-free pace check
```
Pauses: sentence 0.48 s, paragraph 0.9 s. TTS speed is iterated until articulation (speech only) hits `--wpm` (208 = 3.5 words/s).
Level: active-speech RMS -21.5 dBFS (doc 11 §5), tanh-limited to -1.5 dBFS peak; that measures about -22 LUFS on the bare stem
(the "-16 LUFS" figure applies to the finished mix/master, not to a voice stem at the mix's -21.5 dBFS voice level).
Cue words are the SCRIPT words (punctuation kept), timed from faster-whisper by sequence alignment (`vo_common.align`); each cue word
also has `si` (script word index, the stable key between script, tags and cues) and `match` (`exact|fuzzy|sub|interp`;
`interp` = not heard, time interpolated; numbers such as "1806" vs "eighteen o six" end up here).

## `project.json` (video-projects/<slug>/project.json; paths relative to the repo root)
```
{"slug": "...", "script": "script.md", "fps": 25,
 "vo": "video-projects/<slug>/audio/vo_scratch.wav",   // ACTIVE voice-over file (becomes vo_user.wav after recue)
 "cues": "public/audio/<slug>/vo.cues.json",            // ACTIVE cue file; stable path, rewritten by recue
 "voSource": "scratch" | "user", "voice": "am_michael",
 "vo_static": "audio/<slug>/vo.wav", "cues_name": "<slug>/vo"}   // only when cues are at the default public/ path:
                                                                  // staticFile() path + useCues() name
```
`recue.py` keeps the scratch cues as `audio/vo_scratch.cues.json`, the untouched recording as `audio/vo_user_original.*`, and writes
`audio/recue_report.json`. Storyboards may add `storyboard.json` `{"anchors":[{"id","anchor":"word|word#n","word":<si>}]}` to be included in the report.

## Limits
Whisper `base.en` (CPU, ~1 min for 30 s of audio with make_cues) times words to ~1 to 2 frames after onset refinement; ASR misreads of
numbers/names fall back to interpolation. Alignment tolerates small deviations, not a re-ordered or heavily rewritten read.
