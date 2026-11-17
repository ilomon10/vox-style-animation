#!/usr/bin/env python3
"""Audio features on the VIDEO FRAME grid, plus onsets, tempo, beats and downbeats (numpy only).

  python3 -I tools/audio/audio_features.py <id> [--audio file] [--fps 25] [--t0 0]

Writes (all times in seconds and GLOBAL video frames):
  analysis/audio/<id>_features.csv  one row per video frame:
      frame, t, rms_db, low_db (<200 Hz: kick/bass), mid_db (200–2k: voice/keys), high_db (>2 kHz),
      onset (spectral-flux onset strength, normalised 0..1), centroid_hz
  analysis/audio/<id>_rhythm.json   {tempo_bpm, beat_period_s, beats:[{t, frame, strength}],
                                     downbeats:[…], onsets:[{t, frame, strength}], tempo_candidates}
  When analysis/segments/<id>_segments.json exists (tools/analysis/segment_long.py) rhythm.json also gets
  "segments": [{id, t0, t1, tempo_bpm, beat_period_s, tempo_candidates, downbeat_phase, beats, downbeats}] —
  tempo/beats re-estimated per segment, because long videos change music (the global tempo is ONE estimate).

Method
  STFT (2048-sample Hann, hop 256 @22.05 kHz ≈ 11.6 ms). Onset strength = half-wave-rectified
  log-magnitude spectral flux summed over 40 log-spaced bands, median-detrended.
  Tempo = autocorrelation of the onset envelope (40–200 BPM) weighted by a log-Gaussian prior
  centred on 110 BPM (as librosa). Beats = Ellis (2007) dynamic programming with tightness 100.
  Downbeats = the beat phase (mod 4) whose beats carry the most low-band (kick/bass) onset energy.
  Onsets = peaks of the onset envelope above an adaptive threshold, ≥ 70 ms apart.
"""
import argparse
import csv
import json
import os
import sys
import subprocess

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)
SR = 22050
N_FFT = 2048
HOP = 256


def load_audio(path, t0=None, t1=None):
    cmd = ["ffmpeg", "-v", "error"]
    if t0 is not None:
        cmd += ["-ss", str(t0)]
    if t1 is not None:
        cmd += ["-to", str(t1)]
    cmd += ["-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    raw = subprocess.check_output(cmd)
    return np.frombuffer(raw, np.float32).astype(np.float64)


def stft_mag(y):
    win = np.hanning(N_FFT)
    pad = np.pad(y, (N_FFT // 2, N_FFT // 2))
    n = 1 + (len(pad) - N_FFT) // HOP
    out = np.empty((n, N_FFT // 2 + 1), np.float32)
    for i in range(0, n, 512):  # chunked to keep memory low
        j = min(n, i + 512)
        idx = (np.arange(i, j) * HOP)[:, None] + np.arange(N_FFT)[None, :]
        out[i:j] = np.abs(np.fft.rfft(pad[idx] * win, axis=1))
    return out


def band_matrix(freqs, n_bands=40, fmin=40.0, fmax=10000.0):
    edges = np.geomspace(fmin, fmax, n_bands + 2)
    m = np.zeros((n_bands, len(freqs)), np.float32)
    for b in range(n_bands):
        lo, c, hi = edges[b], edges[b + 1], edges[b + 2]
        up = (freqs - lo) / (c - lo)
        down = (hi - freqs) / (hi - c)
        m[b] = np.clip(np.minimum(up, down), 0, None)
    return m


def onset_envelope(S, freqs):
    B = band_matrix(freqs)
    logb = np.log1p(1000 * (S @ B.T))
    flux = np.clip(np.diff(logb, axis=0, prepend=logb[:1]), 0, None).sum(1)
    # remove slow trend (median over ~1 s)
    k = int(round(1.0 * SR / HOP)) | 1
    pad = np.pad(flux, (k // 2, k // 2), mode="edge")
    trend = np.array([np.median(pad[i:i + k]) for i in range(len(flux))])
    env = np.clip(flux - trend, 0, None)
    return env / (env.max() + 1e-9)


def tempo_estimate(env, fs):
    env = env - env.mean()
    ac = np.correlate(env, env, mode="full")[len(env) - 1:]
    ac /= ac[0] + 1e-9
    bpms = np.arange(40, 200.5, 0.5)
    lags = 60.0 * fs / bpms
    vals = np.interp(lags, np.arange(len(ac)), ac)
    prior = np.exp(-0.5 * (np.log2(bpms / 110.0) / 1.0) ** 2)
    score = vals * prior
    order = np.argsort(score)[::-1]
    cands = []
    for i in order:
        if all(abs(bpms[i] - c[0]) > 4 for c in cands):
            cands.append((float(bpms[i]), float(score[i]), float(vals[i])))
        if len(cands) == 5:
            break
    return cands[0][0], cands


def beat_track(env, fs, bpm, tightness=100.0):
    period = 60.0 * fs / bpm
    n = len(env)
    score = env.copy().astype(np.float64)
    back = -np.ones(n, int)
    lo, hi = int(round(period / 2)), int(round(period * 2))
    offs = np.arange(-hi, -lo + 1)
    pen = -tightness * (np.log(-offs / period)) ** 2
    for i in range(n):
        j = i + offs
        ok = j >= 0
        if not ok.any():
            continue
        cand = score[j[ok]] + pen[ok]
        k = int(np.argmax(cand))
        if cand[k] > 0:
            score[i] = env[i] + cand[k]
            back[i] = j[ok][k]
    # start from the best score in the last period
    tail = max(0, n - int(period))
    i = tail + int(np.argmax(score[tail:]))
    beats = []
    while i >= 0:
        beats.append(i)
        i = back[i]
    return np.array(beats[::-1])


def peaks(env, fs, min_gap_s=0.07, k=1.5):
    w = int(round(0.5 * fs))
    out = []
    last = -10 ** 9
    for i in range(1, len(env) - 1):
        if env[i] < env[i - 1] or env[i] < env[i + 1]:
            continue
        a, b = max(0, i - w), min(len(env), i + w)
        thr = env[a:b].mean() + k * env[a:b].std()
        if env[i] > thr and env[i] > 0.05 and i - last >= min_gap_s * fs:
            out.append(i)
            last = i
    return np.array(out, int)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--audio", default=None, help="audio/video file (default: sources.json path)")
    ap.add_argument("--fps", type=float, default=None)
    a = ap.parse_args()
    src = load_sources()
    path = a.audio or os.path.join(ROOT, src[a.id]["path"])
    fps = a.fps or src[a.id]["fps"]
    y = load_audio(path)
    dur = len(y) / SR
    S = stft_mag(y)
    freqs = np.fft.rfftfreq(N_FFT, 1 / SR)
    fs = SR / HOP  # envelope rate
    env = onset_envelope(S, freqs)
    t_env = np.arange(len(env)) / fs

    # per video frame features (window centred on the frame time)
    n_frames = int(round(dur * fps))
    rows = []
    power = S.astype(np.float64) ** 2
    low = power[:, freqs < 200].sum(1)
    mid = power[:, (freqs >= 200) & (freqs < 2000)].sum(1)
    high = power[:, freqs >= 2000].sum(1)
    tot = power.sum(1) + 1e-12
    cent = (power * freqs[None, :]).sum(1) / tot
    db = lambda x: 10 * np.log10(x + 1e-12)  # noqa: E731
    ref = np.percentile(tot, 99)
    for f in range(n_frames):
        t = f / fps
        i0 = int(t * fs)
        i1 = max(i0 + 1, int((f + 1) / fps * fs))
        seg = slice(i0, min(i1, len(env)))
        if seg.start >= len(env):
            break
        rows.append({
            "frame": f, "t": round(t, 3),
            "rms_db": round(float(db(tot[seg].mean() / ref)), 2),
            "low_db": round(float(db(low[seg].mean() / ref)), 2),
            "mid_db": round(float(db(mid[seg].mean() / ref)), 2),
            "high_db": round(float(db(high[seg].mean() / ref)), 2),
            "onset": round(float(env[seg].max()), 4),
            "centroid_hz": round(float(cent[seg].mean()), 1),
        })
    os.makedirs(os.path.join(ROOT, "analysis", "audio"), exist_ok=True)
    out_csv = os.path.join(ROOT, "analysis", "audio", f"{a.id}_features.csv")
    with open(out_csv, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)

    bpm, cands = tempo_estimate(env, fs)
    beats = beat_track(env, fs, bpm)
    # downbeat phase from low-band onset energy
    lowlog = np.log1p(1000 * low / ref)
    lowflux = np.clip(np.diff(lowlog, prepend=lowlog[:1]), 0, None)
    phase_energy = [float(sum(lowflux[max(0, b - 2):b + 3].max() for b in beats[p::4])) for p in range(4)]
    p0 = int(np.argmax(phase_energy))
    ons = peaks(env, fs)
    to_item = lambda i: {"t": round(float(t_env[i]), 3), "frame": int(round(t_env[i] * fps)), "strength": round(float(env[i]), 3)}  # noqa: E731
    rhythm = {
        "id": a.id, "fps": fps, "duration_s": round(dur, 3),
        "tempo_bpm": round(bpm, 1), "beat_period_s": round(60 / bpm, 4),
        "beat_period_frames": round(60 / bpm * fps, 3),
        "tempo_candidates": [{"bpm": c[0], "score": round(c[1], 3), "autocorr": round(c[2], 3)} for c in cands],
        "downbeat_phase": p0, "downbeat_phase_energy": [round(x, 2) for x in phase_energy],
        "beats": [to_item(b) for b in beats],
        "downbeats": [to_item(b) for b in beats[p0::4]],
        "onsets": [to_item(i) for i in ons],
    }
    seg_p = os.path.join(ROOT, "analysis", "segments", f"{a.id}_segments.json")
    if os.path.exists(seg_p):
        rhythm["segments"] = []
        for sg in json.load(open(seg_p))["segments"]:
            i0, i1 = int(sg["t0"] * fs), min(len(env), int(sg["t1"] * fs))
            e = env[i0:i1]
            if len(e) < 4 * fs:
                continue
            sb, scands = tempo_estimate(e, fs)
            sbeats = beat_track(e, fs, sb)
            sl = lowflux[i0:i1]
            sph = [float(sum(sl[max(0, b - 2):b + 3].max() for b in sbeats[p::4])) for p in range(4)]
            sp0 = int(np.argmax(sph))
            item = lambda i: {"t": round(float(t_env[i0 + i]), 3), "frame": int(round(t_env[i0 + i] * fps)), "strength": round(float(e[i]), 3)}  # noqa: E731
            rhythm["segments"].append({
                "id": sg["id"], "t0": sg["t0"], "t1": sg["t1"], "tempo_bpm": round(sb, 1),
                "beat_period_s": round(60 / sb, 4),
                "tempo_candidates": [{"bpm": c[0], "score": round(c[1], 3), "autocorr": round(c[2], 3)} for c in scands],
                "downbeat_phase": sp0, "beats": [item(b) for b in sbeats], "downbeats": [item(b) for b in sbeats[sp0::4]]})
        print("per-segment tempo (BPM): " + ", ".join(f"{x['id']} {x['tempo_bpm']}" for x in rhythm["segments"]))
    json.dump(rhythm, open(os.path.join(ROOT, "analysis", "audio", f"{a.id}_rhythm.json"), "w"), indent=1)
    print(f"{a.id}: {len(rows)} frames, tempo {bpm:.1f} BPM, {len(beats)} beats, {len(ons)} onsets; "
          f"candidates {[c[0] for c in cands]}")


if __name__ == "__main__":
    main()
