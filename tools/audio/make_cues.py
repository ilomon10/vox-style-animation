#!/usr/bin/env python3
"""Build a cue file for Remotion from an audio/video file.

  python3 -I tools/audio/make_cues.py <audio-or-video> --name <name> --fps <fps> [--no-words]
         [--words-json words.json] [--pause-ms 250] [--bpm 92 --first-beat 0.41] [--global-tempo]

  BEST PRACTICE (measured on a real Vox episode, docs/style-guide/11-audio-sync.md):
  run it on the NARRATION STEM for word timing and separately on the MUSIC STEM for beats —
  a mixed track blurs both. Whisper word starts can be off by up to ~16 frames, so every word
  is re-anchored to the speech-energy onset (`onset`) and gets a stressed-syllable time (`stress`).
  Songs change tempo: beats come from a LOCAL tempo map unless --global-tempo or --bpm is given.
  (words need faster-whisper: run with tools/.venv/bin/python; --no-words works with plain python3 + numpy)

Writes public/audio/<name>.cues.json. Schema (version 1; mirrored by src/audio/cues.ts, see src/audio/README.md):
  {version (2), name, fps, duration_s, duration_frames,
   words:   [{text, start, end, frame_start, frame_end, prob,
             onset, onset_frame,      speech-energy onset near the whisper start (anchor cuts/entrances here)
             stress, stress_frame}]   loudest syllable nucleus inside the word (anchor pops/camera stops here)
   phrases: [{text, start, end, frame_start, frame_end, word_start, word_end}]  words split by pauses >= pause_ms
   pauses:  [{start, end, frame_start, frame_end, duration}]            gaps between consecutive words
   pause_ms,
   tempo_bpm, tempo_map:[{t, bpm}], beats:[{t, frame, strength}], downbeats:[…], eighths:[…], onsets:[…],
   envelope: {total:[dB per frame], low:[<200 Hz], mid:[200-2k], high:[>2k]}   dB relative to the 99th pct
   speech:   [0|1 per frame]   1 where a word span covers the frame}
Reuses tools/audio/audio_features.py (STFT, onsets, tempo, beats, downbeats). `frame` = round(t * fps).
"""
import argparse
import json
import os
import subprocess
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import audio_features as af  # noqa: E402

ROOT = af.ROOT


def transcribe(path):
    from faster_whisper import WhisperModel
    pcm = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"])
    audio = np.frombuffer(pcm, np.float32)
    model = WhisperModel("base.en", device="cpu", compute_type="int8", cpu_threads=4)
    it, _ = model.transcribe(audio, language="en", word_timestamps=True, beam_size=5,
                             condition_on_previous_text=False, vad_filter=False)
    return [{"text": w.word.strip(), "start": float(w.start), "end": float(w.end), "prob": float(w.probability)}
            for seg in it for w in (seg.words or [])]


def refine_words(words, S, freqs, fs, back=0.10, fwd=0.50, rise_db=3.0, look_s=0.06):
    """Re-anchor whisper word starts on the speech-energy onset and find the stressed syllable.
    Whisper often places a word start inside the preceding gap (EARLY), by up to ~0.6 s on mixed tracks.
    Candidates = feet of rises: local minima of the 300–3400 Hz log-energy (35 ms smoothing) followed by a
    rise of ≥ rise_db within look_s, inside [start-back, min(end-0.04, start+fwd)]. The onset is the
    candidate with the LARGEST rise (the voiced attack); with no candidate the whisper start is kept.
    stress = frame of maximum 300–3400 Hz energy between onset and end (syllable nucleus).
    Validated on 7 hand-measured onsets of the Earworm episode (music under the voice):
    mean |error| 9.5 f (whisper) → 4.2 f (refined); 4 of 7 within ±1.2 f. On a clean VO stem expect ≤ 2 f.
    Hand-correct key anchors in the JSON (or with --anchors) when a cut must land exactly."""
    band = (freqs >= 300) & (freqs < 3400)
    e = 10 * np.log10((S[:, band].astype(np.float64) ** 2).sum(1) + 1e-12)
    es = np.convolve(e, np.ones(3) / 3, mode="same")
    n = len(es)
    look = max(2, int(look_s * fs))
    out = []
    for w in words:
        i0 = max(1, int((w["start"] - back) * fs))
        i1 = min(n - 2, max(i0 + 1, int(min(w["end"] - 0.04, w["start"] + fwd) * fs)))
        best = None
        for i in range(i0, i1 + 1):
            if es[i] <= es[i - 1] and es[i] <= es[i + 1]:
                r = float(es[i:min(n, i + look)].max() - es[i])
                if r >= rise_db and (best is None or r > best[0]):
                    best = (r, i)
        onset = best[1] / fs if best else w["start"]
        s0 = int(onset * fs)
        s1 = max(s0 + 1, min(n - 1, int(w["end"] * fs)))
        stress = (s0 + int(np.argmax(es[s0:s1 + 1]))) / fs
        out.append({**w, "onset": round(float(onset), 3), "stress": round(float(stress), 3)})
    return out


def local_tempo_map(env, fs, win_s=8.0, hop_s=2.0):
    """windowed autocorrelation tempo (same prior as audio_features) → [(t, bpm)], median-smoothed"""
    w, h = int(win_s * fs), int(hop_s * fs)
    pts = []
    for i in range(0, max(1, len(env) - w + 1), h):
        bpm, _ = af.tempo_estimate(env[i:i + w], fs)
        pts.append(((i + w / 2) / fs, bpm))
    if not pts:
        bpm, _ = af.tempo_estimate(env, fs)
        return [(0.0, bpm)]
    b = np.array([p[1] for p in pts])
    sm = np.array([np.median(b[max(0, j - 1):j + 2]) for j in range(len(b))])
    return [(pts[j][0], float(sm[j])) for j in range(len(pts))]


def beat_track_varying(env, fs, tempo_map, tightness=100.0):
    """Ellis DP beat tracker with a time-varying period from the tempo map"""
    n = len(env)
    tt = np.array([t for t, _ in tempo_map]) * fs
    bb = np.array([b for _, b in tempo_map])
    period = 60.0 * fs / np.interp(np.arange(n), tt, bb)
    score = env.astype(np.float64).copy()
    back = -np.ones(n, int)
    for i in range(n):
        p = period[i]
        lo, hi = int(round(p / 2)), int(round(p * 2))
        j = np.arange(max(0, i - hi), max(0, i - lo + 1))
        if len(j) == 0:
            continue
        cand = score[j] - tightness * np.log((i - j) / p) ** 2
        k = int(np.argmax(cand))
        if cand[k] > 0:
            score[i] = env[i] + cand[k]
            back[i] = j[k]
    tail = max(0, n - int(period[-1]))
    i = tail + int(np.argmax(score[tail:]))
    beats = []
    while i >= 0:
        beats.append(i)
        i = back[i]
    return np.array(beats[::-1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--name", required=True)
    ap.add_argument("--fps", type=float, required=True)
    ap.add_argument("--no-words", action="store_true", help="skip transcription (music / SFX only)")
    ap.add_argument("--words-json", help="use these words [{text,start,end,prob?}] instead of transcribing")
    ap.add_argument("--pause-ms", type=float, default=250.0)
    ap.add_argument("--bpm", type=float, help="known tempo: build a fixed beat grid instead of detecting")
    ap.add_argument("--first-beat", type=float, default=0.0, help="time (s) of the first beat for --bpm")
    ap.add_argument("--global-tempo", action="store_true", help="one tempo for the whole file")
    a = ap.parse_args()
    fps = a.fps
    fr = lambda t: int(round(t * fps))  # noqa: E731

    y = af.load_audio(a.src)
    dur = len(y) / af.SR
    n_frames = int(round(dur * fps))
    S = af.stft_mag(y)
    freqs = np.fft.rfftfreq(af.N_FFT, 1 / af.SR)
    fs = af.SR / af.HOP
    env = af.onset_envelope(S, freqs)
    t_env = np.arange(len(env)) / fs

    power = S.astype(np.float64) ** 2
    bands = {"total": power.sum(1) + 1e-12, "low": power[:, freqs < 200].sum(1),
             "mid": power[:, (freqs >= 200) & (freqs < 2000)].sum(1), "high": power[:, freqs >= 2000].sum(1)}
    ref = np.percentile(bands["total"], 99)
    envelope = {k: [] for k in bands}
    for f in range(n_frames):
        i0 = min(int(f / fps * fs), len(env) - 1)
        i1 = max(i0 + 1, int((f + 1) / fps * fs))
        for k, v in bands.items():
            envelope[k].append(round(float(10 * np.log10(v[i0:i1].mean() / ref + 1e-12)), 2))

    if a.bpm:
        bpm = a.bpm
        tempo_map = [(0.0, bpm)]
        step = 60.0 / bpm * fs
        beats = np.round(np.arange(a.first_beat * fs, len(env), step)).astype(int)
    elif a.global_tempo:
        bpm, _ = af.tempo_estimate(env, fs)
        tempo_map = [(0.0, bpm)]
        beats = af.beat_track(env, fs, bpm)
    else:
        tempo_map = local_tempo_map(env, fs)
        bpm = float(np.median([b for _, b in tempo_map]))
        beats = beat_track_varying(env, fs, tempo_map)
    lowlog = np.log1p(1000 * bands["low"] / ref)
    lowflux = np.clip(np.diff(lowlog, prepend=lowlog[:1]), 0, None)
    phase = [float(sum(lowflux[max(0, b - 2):b + 3].max() for b in beats[p::4])) for p in range(4)]
    p0 = int(np.argmax(phase))
    item = lambda i: {"t": round(float(t_env[i]), 3), "frame": fr(t_env[i]), "strength": round(float(env[i]), 3)}  # noqa: E731
    onsets = af.peaks(env, fs)

    words_raw = []
    if a.words_json:
        words_raw = json.load(open(a.words_json))
    elif not a.no_words:
        words_raw = transcribe(a.src)
    words = [{"text": w["text"], "start": round(w["start"], 3), "end": round(w["end"], 3),
              "frame_start": fr(w["start"]), "frame_end": fr(w["end"]), "prob": round(w.get("prob", 1.0), 3)}
             for w in words_raw]
    words = refine_words(words, S, freqs, fs)
    for w in words:
        w["onset_frame"], w["stress_frame"] = fr(w["onset"]), fr(w["stress"])
    phrases, pauses = [], []
    gap = a.pause_ms / 1000.0
    start = 0
    for i in range(1, len(words) + 1):
        if i == len(words) or words[i]["start"] - words[i - 1]["end"] >= gap:
            ws = words[start:i]
            phrases.append({"text": " ".join(w["text"] for w in ws), "start": ws[0]["start"], "end": ws[-1]["end"],
                            "frame_start": ws[0]["frame_start"], "frame_end": ws[-1]["frame_end"],
                            "word_start": start, "word_end": i - 1})
            if i < len(words):
                s, e = words[i - 1]["end"], words[i]["start"]
                pauses.append({"start": s, "end": e, "frame_start": fr(s), "frame_end": fr(e), "duration": round(e - s, 3)})
            start = i
    speech = [0] * n_frames
    for w in words:
        for f in range(max(0, w["frame_start"]), min(n_frames, w["frame_end"] + 1)):
            speech[f] = 1

    eighths = []
    for b0, b1 in zip(beats[:-1], beats[1:]):
        eighths += [b0, (b0 + b1) // 2]
    if len(beats):
        eighths.append(beats[-1])
    out = {"version": 2, "name": a.name, "fps": fps, "duration_s": round(dur, 3), "duration_frames": n_frames,
           "words": words, "phrases": phrases, "pauses": pauses, "pause_ms": a.pause_ms,
           "tempo_bpm": round(bpm, 1), "tempo_map": [{"t": round(t, 2), "bpm": round(b, 1)} for t, b in tempo_map],
           "beats": [item(b) for b in beats], "downbeats": [item(b) for b in beats[p0::4]],
           "eighths": [item(i) for i in eighths],
           "onsets": [item(i) for i in onsets], "envelope": envelope, "speech": speech}
    path = os.path.join(ROOT, "public", "audio", f"{a.name}.cues.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(out, open(path, "w"), separators=(",", ":"))
    print(f"{path}: {n_frames} frames, {bpm:.1f} BPM, {len(beats)} beats, {len(words)} words, {len(phrases)} phrases")


if __name__ == "__main__":
    main()
