# src/audio — syncing animation to sound

Pipeline: `tools/audio/make_cues.py <file> --name X --fps 25 [--no-words | --words-json w.json]` ->
`public/audio/X.cues.json` -> `useCues("X")` -> helpers / components. Words need
`tools/.venv/bin/python` (faster-whisper); `--no-words` runs on plain python3 + numpy.
Demo: `python3 -I tools/audio/make_demo_track.py` (procedural wav + stems + fake words).

All placeholder numbers live in `defaults.ts` (`// TODO measured:`).

## Cue JSON (version 1)
```
{version, name, fps, duration_s, duration_frames,
 words:   [{text, start, end, frame_start, frame_end, prob}],
 phrases: [{text, start, end, frame_start, frame_end, word_start, word_end}],   // split by pauses >= pause_ms
 pauses:  [{start, end, frame_start, frame_end, duration}], pause_ms,
 tempo_bpm, beats:[{t, frame, strength}], downbeats:[...], onsets:[...],
 envelope: {total, low, mid, high}: number[] per frame, dB rel. to 99th percentile,
 speech: (0|1)[] per frame}
```
`createCueIndex(cues, compFps)` converts frames to the composition fps.

## APIs
- Lookup (`CueIndex`): `wordAt, wordIndexAt, phraseAt, findWord(text, nth), phraseStarts, nearestBeat, nextBeat,
  lastBeat, snapToBeat(f, maxShift), beatsBetween(a,b), downbeats, levelAt(f, band), level01At, speechAt`.
- Schedule: `cueFrame({cues, word|phrase|beat|downbeat|pause|sec|frame, nth, edge, offset, snap})`, `beatFrame(cues, n)`,
  `<OnCue at lead duration>` (layout-less Sequence; render prop gets elapsed frames), `useBeatPulse({decay, downbeats, lead, onOnes})`,
  `useAudioLevel(band)`. Visuals step on the 12/s grid unless `onOnes`.
- Sound: `<Narration src cues>` (also provides cues via `CuesProvider`), `<MusicBed src duckUnder duckDb attackFrames releaseFrames
  fadeIn fadeOut>`, `<SongExcerpt src startFrom in out fadeFrames>`, `<Sfx at src gainDb>`; `buildDuckCurve` / `musicGainAt` give the same numbers for graphs.
- Visuals: `AudioBars` (src = real FFT via @remotion/media-utils, else cue bands), `Waveform`, `PulseOnBeat`, `LyricLine`.

Frames are relative to the audio start: mount cue-driven graphics in a Sequence that starts where the audio starts.
