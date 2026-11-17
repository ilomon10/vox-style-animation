#!/usr/bin/env python3
"""Procedural demo track for the AudioSyncGallery (numpy only, no copyrighted audio).

  python3 -I tools/audio/make_demo_track.py

Writes public/audio/demo.wav (19 s, 48 kHz, 16-bit mono) and public/audio/demo.words.json (the fake word
list whose timing matches the noise "syllables"; merge it with `make_cues.py --words-json`).
Contents: 85 BPM kick + bass + hat bed; two band-limited-noise "narration" phrases with a pause between
them; one whoosh SFX.
"""
import json
import os
import wave

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
SR = 48000
DUR = 19.0
BPM = 85.0
BEAT = 60.0 / BPM
rng = np.random.default_rng(7)
N = int(SR * DUR)
t = np.arange(N) / SR


def add(buf, sig, t0):
    i = int(t0 * SR)
    j = min(N, i + len(sig))
    if i < N:
        buf[i:j] += sig[: j - i]


def bandpass_noise(n, lo, hi):
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(spec, n)
    return y / (np.abs(y).max() + 1e-9)


# ---- music bed: kick on every beat, bass note per bar, hat on offbeats
music = np.zeros(N)
kt = np.arange(int(0.3 * SR)) / SR
kick = np.sin(2 * np.pi * (50 + 110 * np.exp(-kt * 28)) * kt) * np.exp(-kt * 9) * 0.9
ht = np.arange(int(0.05 * SR)) / SR
hat = bandpass_noise(len(ht), 6000, 12000) * np.exp(-ht * 90) * 0.18
bass_notes = [55.0, 55.0, 65.4, 49.0]
b = 0
while b * BEAT < DUR - 0.05:
    add(music, kick, b * BEAT)
    add(music, hat, b * BEAT + BEAT / 2)
    if b % 2 == 0:
        bt = np.arange(int(BEAT * 2 * SR)) / SR
        f0 = bass_notes[(b // 2) % 4]
        bass = (np.sin(2 * np.pi * f0 * bt) + 0.3 * np.sin(2 * np.pi * 2 * f0 * bt)) * np.exp(-bt * 1.6) * 0.35
        add(music, bass, b * BEAT)
    b += 1

# ---- narration-like phrases: syllable bursts of band-limited noise
phrases = [
    (1.4, [("Chocolate", 0.62), ("is", 0.18), ("the", 0.14), ("sweetest", 0.5), ("lie", 0.34), ("we", 0.16), ("tell", 0.3)]),
    (9.2, [("But", 0.2), ("the", 0.14), ("beat", 0.36), ("never", 0.38), ("lies", 0.4)]),
]
narr = np.zeros(N)
words = []
for start, ws in phrases:
    cur = start
    for text, d in ws:
        n = int(d * SR)
        env = np.sin(np.pi * np.linspace(0, 1, n)) ** 0.6
        syl = 0.5 + 0.5 * np.sin(2 * np.pi * np.arange(n) / SR * rng.uniform(5, 8))
        add(narr, bandpass_noise(n, 300, 3200) * env * (0.55 + 0.45 * syl) * 0.5, cur)
        words.append({"text": text, "start": round(cur, 3), "end": round(cur + d, 3), "prob": 1.0})
        cur += d + 0.07
    # next phrase begins after >= 250 ms of silence
# ---- whoosh SFX at 14.6 s (rising band-pass sweep)
wn = int(1.2 * SR)
wt = np.arange(wn) / SR
sweep = np.zeros(wn)
noise = rng.standard_normal(wn)
fc = np.geomspace(300, 7000, wn)
# cheap time-varying filter: sum of noise through moving one-pole low-pass with rising cutoff, minus slower lp
lp = np.zeros(wn)
hp_state = 0.0
y = 0.0
for i in range(wn):
    a = 1 - np.exp(-2 * np.pi * fc[i] / SR)
    y += a * (noise[i] - y)
    lp[i] = y
sweep = lp * np.sin(np.pi * wt / 1.2) ** 2
sweep = sweep / (np.abs(sweep).max() + 1e-9) * 0.5
whoosh = np.zeros(N)
add(whoosh, sweep, 14.6)

mix = music * 0.8 + narr + whoosh
mix = np.tanh(mix * 1.1) * 0.9
pcm = (mix * 32767).astype("<i2")
os.makedirs(os.path.join(ROOT, "public", "audio"), exist_ok=True)
with wave.open(os.path.join(ROOT, "public", "audio", "demo.wav"), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
json.dump(words, open(os.path.join(ROOT, "public", "audio", "demo.words.json"), "w"), indent=1)
# separate stems so the gallery can use music-only / narration-only / sfx-only sources
for name, sig in (("demo_music", music * 0.8), ("demo_narration", narr), ("demo_whoosh", whoosh)):
    s = (np.tanh(sig * 1.1) * 0.9 * 32767).astype("<i2")
    with wave.open(os.path.join(ROOT, "public", "audio", name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(s.tobytes())
print(f"demo.wav {DUR}s @ {SR} Hz, {BPM} BPM, {len(words)} words")
