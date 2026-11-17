#!/usr/bin/env python3
"""Procedural SFX library for the Earworm transitions (numpy only, no copyrighted audio).

  python3 -I tools/audio/make_sfx.py            # writes public/audio/sfx/*.wav + *.json + manifest.json
  python3 -I tools/audio/make_sfx.py --phone-eq in.wav out.wav   # offline telephone EQ (see PHONE_EQ)

48 kHz, 16-bit mono. Every SFX gets a JSON sidecar {peak_s, onset_s, ...}: the sound's OWN peak offset, so the
code can start the clip at (picture event - peak_s). Measured sync (analysis/earworm-D.md s12/s13): every sound
lands within -1..0 f of its picture event.
"""
import json
import os
import sys
import wave

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT = os.path.join(ROOT, "public", "audio", "sfx")
SR = 48000
FPS = 25
rng = np.random.default_rng(2020)


def t_(d):
    return np.arange(int(SR * d)) / SR


def band_noise(n, lo, hi, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    spec = np.fft.rfft(r.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(spec, n)
    return y / (np.abs(y).max() + 1e-9)


def hp(x, fc):
    """one-pole-ish high-pass via FFT (zero-phase), good enough for noise shaping"""
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(spec, len(x))


def norm(x, peak_db=-3.0):
    return x / (np.abs(x).max() + 1e-12) * 10 ** (peak_db / 20)


# --- the sounds -------------------------------------------------------------------------------------------------
def sub_boom():
    """60-75 Hz boom: ~9 f (0.36 s) build to the peak, then -13 dB over 15 f (0.6 s). HF tick at the peak."""
    d = 1.4
    t = t_(d)
    build, decay = 0.36, 0.60
    env = np.where(t < build, (t / build) ** 2.2, 10 ** (-13 * np.clip(t - build, 0, None) / decay / 20))
    env = np.where(t > build + decay, env * np.exp(-(t - build - decay) * 5), env)
    f = 62 + 12 * np.exp(-np.clip(t - build, 0, None) * 6)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env
    tick = hp(rng.standard_normal(len(t)), 3000) * np.exp(-(np.abs(t - build)) * 400) * 0.08
    return norm(y + tick), "peak at the cut +1 f; start the clip 9 f before the cut + 1"


def whoosh():
    """Broadband noise sweep, side-air band; rise 0.30 s, peak, fall 0.30 s."""
    d = 0.8
    t = t_(d)
    n = len(t)
    y = np.zeros(n)
    chunks = 24
    edges = np.linspace(0, n, chunks + 1).astype(int)
    base = rng.standard_normal(n)
    spec = np.fft.rfft(base)
    f = np.fft.rfftfreq(n, 1 / SR)
    for i in range(chunks):
        a, b = edges[i], edges[i + 1]
        tc = (a + b) / 2 / SR
        fc = 500 + 9000 * np.exp(-((tc - 0.30) / 0.22) ** 2)  # centre sweeps up to the peak and back
        sp = spec * np.exp(-((np.log2(np.maximum(f, 1) / fc)) ** 2) / 1.4)
        seg = np.fft.irfft(sp, n)
        w = np.zeros(n); w[a:b] = 1
        y += seg * w
    env = np.exp(-((t - 0.30) / 0.17) ** 2)
    return norm(y * env), "peak at 0.30 s"


def needle_drop():
    """Stylus thump + short low ring (peak at 0.01 s)."""
    t = t_(0.5)
    y = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 18) + 0.4 * band_noise(len(t), 200, 2500) * np.exp(-t * 60)
    y *= np.minimum(1, t / 0.004)
    return norm(y), "thump, peak 0.01 s"


def vinyl_crackle():
    """0.44 s seamless loop (11 f): noise floor + sparse clicks, clicks kept away from the loop edges."""
    d = 0.44
    n = int(SR * d)
    y = 0.05 * hp(rng.standard_normal(n), 1500)
    for _ in range(14):
        i = int(rng.uniform(0.02, 0.42) * SR)
        amp = rng.uniform(0.15, 1.0) * rng.choice([-1, 1])
        k = int(rng.uniform(0.0003, 0.0015) * SR)
        y[i:i + k] += amp * np.exp(-np.arange(k) / (k / 4)) * np.sign(rng.standard_normal(k))
    fade = int(0.01 * SR)
    ramp = np.linspace(0, 1, fade)
    y[:fade] *= ramp; y[-fade:] *= ramp[::-1]
    return norm(y, -9), "loop; 11 f"


def tick():
    """30-90 ms HF tick (50 ms). Use at about -30 dB relative to the voice."""
    t = t_(0.05)
    y = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 90)
    return norm(y), "50 ms; place at -30 dB vs voice"


def bass_hit():
    """Hard end-card bass hit: 55 Hz drop with a click; peak at 5 ms."""
    t = t_(0.7)
    f = 50 + 90 * np.exp(-t * 40)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * np.minimum(1, t / 0.004)
    y += 0.3 * band_noise(len(t), 100, 4000) * np.exp(-t * 80)
    return norm(y), "peak 5 ms"


def glitch_tick():
    """HF static burst, 60 ms with 4 ms-gated stutter."""
    t = t_(0.06)
    gate = (np.floor(t / 0.004) % 2 == 0).astype(float)
    y = hp(rng.standard_normal(len(t)), 4000) * gate * np.exp(-t * 25)
    return norm(y), "60 ms"


def radio_static():
    """Radio-dial static with a ~1 kHz heterodyne whistle, 1.0 s."""
    t = t_(1.0)
    y = band_noise(len(t), 300, 8000) * (0.4 + 0.6 * (rng.random(len(t) // 480 + 1).repeat(480)[: len(t)] > 0.5))
    y = y * 0.5 + 0.25 * np.sin(2 * np.pi * (1000 + 400 * np.sin(2 * np.pi * 1.8 * t)) * t) * (np.sin(2 * np.pi * 5.7 * t * 2.5) > -0.3)
    y *= np.minimum(1, t / 0.02) * np.minimum(1, (1 - t) / 0.05)
    return norm(y, -9), "1 s bed"


def black_thump():
    """Sub thump into silence (first black frame of a dip): low band only, -4.7 dB/f decay."""
    t = t_(0.5)
    y = np.sin(2 * np.pi * (48 + 20 * np.exp(-t * 30)) * t) * 10 ** (-4.7 * t * FPS / 20) * np.minimum(1, t / 0.003)
    return norm(y), "peak 5 ms; decays 4.7 dB/f (to -59 dB by 0.4 s)"


# --- scrapbook look (analysis/vox-sample/vox_braintravel.md §7.2): each sound has its OWN seeded generator, so adding
# or reordering sounds never changes the ones above (they share the module rng in registry order)
def paper_swoosh():
    """A paper sheet sliding over paper: broad 1.5-9 kHz noise with a crinkly flutter; 0.42 s, peak at 0.12 s."""
    r = np.random.default_rng(7101)
    t = t_(0.42)
    n = len(t)
    spec = np.fft.rfft(r.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec *= np.exp(-((np.log2(np.maximum(f, 1) / 3500)) ** 2) / 2.2)
    y = np.fft.irfft(spec, n)
    flutter = np.repeat(r.uniform(0.55, 1.0, n // 240 + 1), 240)[:n]
    env = np.where(t < 0.12, (t / 0.12) ** 1.6, np.exp(-(t - 0.12) / 0.11))
    return norm(y * flutter * env), "peak at 0.12 s; on the sheet's first move (+2 f)"


def paper_flick():
    """A sheet or scrap landing: short 2-6 kHz slap with a faint body; peak about 3 ms."""
    r = np.random.default_rng(7102)
    t = t_(0.14)
    y = hp(r.standard_normal(len(t)), 2000) * np.exp(-t * 45) + 0.35 * np.sin(2 * np.pi * 140 * t) * np.exp(-t * 60)
    return norm(y * np.minimum(1, t / 0.002)), "peak about 3 ms"


def stamp_thud():
    """A rubber stamp hitting paper on a desk: low body with a falling pitch, a papery slap and a click."""
    r = np.random.default_rng(7103)
    t = t_(0.35)
    n = len(t)
    body = np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-t * 50)) / SR) * np.exp(-t * 14)
    slap = band_noise(n, 300, 3000, seed=7104) * np.exp(-t * 90) * 0.6
    click = hp(r.standard_normal(n), 4000) * np.exp(-t * 400) * 0.15
    return norm((body + slap + click) * np.minimum(1, t / 0.002)), "peak about 5 ms"


def sub_swell():
    """Low swell into a chapter card: 0.70 s rise, then a quick fall (measured: onset at the cut, peak +17 f)."""
    t = t_(1.1)
    env = np.where(t < 0.7, (t / 0.7) ** 2.5, np.exp(-(t - 0.7) / 0.16))
    sub = np.sin(2 * np.pi * np.cumsum(38 + 22 * (t / 1.1)) / SR)
    air = band_noise(len(t), 80, 900, seed=7106) * 0.35
    return norm((sub + air) * env), "peak at 0.70 s"


def chime():
    """Bright end-card chime: inharmonic bell partials on C6, the bright part decays in about 0.5 s."""
    t = t_(1.6)
    parts = [(1.0, 1.0, 2.2), (2.0, 0.45, 3.0), (2.76, 0.35, 4.5), (5.4, 0.18, 7.0), (8.93, 0.08, 9.0)]
    y = sum(a * np.sin(2 * np.pi * 1046.5 * m * t + i) * np.exp(-t * dec) for i, (m, a, dec) in enumerate(parts))
    return norm(y * np.minimum(1, t / 0.003), -6), "peak about 3 ms"


SFX = {
    "sub_boom": (sub_boom, -3), "whoosh": (whoosh, -6), "needle_drop": (needle_drop, -6), "vinyl_crackle": (vinyl_crackle, -12),
    "tick": (tick, -30), "bass_hit": (bass_hit, -3), "glitch_tick": (glitch_tick, -24), "radio_static": (radio_static, -14),
    "black_thump": (black_thump, -6),
    "paper_swoosh": (paper_swoosh, -14), "paper_flick": (paper_flick, -16), "stamp_thud": (stamp_thud, -8),
    "sub_swell": (sub_swell, -6), "chime": (chime, -14),
}

# --- telephone EQ ------------------------------------------------------------------------------------------------
PHONE_EQ = {
    "description": "Remotion <Audio> cannot filter. Apply offline to the clip, then use the result as the src.",
    "highpass_hz": 200, "boost": {"from_hz": 1200, "to_hz": 3400, "gain_db": 12}, "lowpass_hz": 8000,
    "ffmpeg": 'ffmpeg -i in.wav -af "highpass=f=200,equalizer=f=2020:width_type=h:width=2200:g=12,lowpass=f=8000" out.wav',
}


def phone_eq(x):
    """numpy equivalent of PHONE_EQ: HP 200 Hz, +12 dB across 1.2-3.4 kHz, -24 dB above 8 kHz."""
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    g *= 1 / np.sqrt(1 + (200 / np.maximum(f, 1e-3)) ** 8)
    g *= 1 + (10 ** (12 / 20) - 1) * ((f >= 1200) & (f <= 3400))
    g *= np.where(f > 8000, 10 ** (-24 / 20), 1)
    return np.fft.irfft(spec * g, len(x))


# --- io ------------------------------------------------------------------------------------------------------------
def write_wav(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def read_wav(path):
    with wave.open(path, "rb") as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(float) / 32768
        return x.reshape(-1, w.getnchannels()).mean(axis=1)


def main():
    if len(sys.argv) == 4 and sys.argv[1] == "--phone-eq":
        write_wav(sys.argv[3], norm(phone_eq(read_wav(sys.argv[2])), -3)); return
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for name, (fn, gain) in SFX.items():
        x, note = fn()
        write_wav(os.path.join(OUT, name + ".wav"), x)
        a = np.abs(x)
        pk = int(a.argmax())
        onset = int(np.argmax(a > a.max() * 10 ** (-40 / 20)))
        meta = {
            "name": name, "file": f"audio/sfx/{name}.wav", "sample_rate": SR, "duration_s": round(len(x) / SR, 4),
            "peak_s": round(pk / SR, 4), "onset_s": round(onset / SR, 4), "peak_dbfs": round(20 * np.log10(a.max()), 2),
            "suggested_gain_db": gain, "loop": name == "vinyl_crackle", "note": note,
        }
        manifest[name] = meta
        with open(os.path.join(OUT, name + ".json"), "w") as fh:
            json.dump(meta, fh, indent=1)
        print(f"{name:14s} dur {meta['duration_s']:.3f}s peak {meta['peak_s']:.4f}s onset {meta['onset_s']:.4f}s")
    manifest["phone_eq"] = PHONE_EQ
    with open(os.path.join(OUT, "manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=1)
    with open(os.path.join(OUT, "phone_eq.json"), "w") as fh:
        json.dump(PHONE_EQ, fh, indent=1)


if __name__ == "__main__":
    main()
