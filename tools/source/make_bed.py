#!/usr/bin/env python3
"""Procedural music bed in the measured Vox Earworm bed style (docs/style-guide/11-audio-sync.md section 5).

Bass < 200 Hz (sine bass + sub kick) and hats > 5 kHz, a soft low pad, and the speech band (300 Hz - 3 kHz)
explicitly kept clear so a voice sits on top. numpy only; 48 kHz stereo WAV + stems.

  tools/.venv/bin/python tools/source/make_bed.py --bpm 72 --key Dm --mood "late-night soul" --length 90 \
      --sections "intro:8,verse:32,drop:4,montage:24,outro:22" --out video-projects/demo/audio/music/bed.wav \
      [--stingers "hit:12.5,riser:30:4,hit:60"] [--wanted video-projects/demo]

Writes <out>, <out stem>_bass.wav / _drums.wav / _pad.wav / _fx.wav (stems; they sum to the mix before the
final peak normalisation, which is applied equally to all of them) and prints a band report.
Section names: intro, verse, drop, montage, outro (unknown names behave like verse).
Stinger syntax: hit:<t>  (low boom + air burst), riser:<end t>[:<length s>=3]  (filtered noise swell > 4 kHz).
"""
import argparse
import os
import re
import wave

import numpy as np

SR = 48000
NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
# (semitone offset from the key root, chord tones as semitone offsets from the chord root)
CHORD = {"m7": (0, 3, 7, 10), "maj7": (0, 4, 7, 11), "7": (0, 4, 7, 10), "m": (0, 3, 7), "": (0, 4, 7)}
PROG_MINOR = [(0, "m7"), (8, "maj7"), (3, "maj7"), (10, "7")]   # i7 - VImaj7 - IIImaj7 - VII7
PROG_MAJOR = [(0, "maj7"), (9, "m7"), (5, "maj7"), (7, "7")]    # Imaj7 - vi7 - IVmaj7 - V7
# per-section stem gains: bass, kick, hats, pad
SECTION = {
    "intro":   dict(bass=0.0, kick=0.0, hats=0.5, pad=1.0),
    "verse":   dict(bass=1.0, kick=0.7, hats=0.7, pad=0.8),
    "drop":    dict(bass=0.0, kick=0.0, hats=0.0, pad=0.0),
    "montage": dict(bass=1.0, kick=1.0, hats=1.0, pad=0.9),
    "outro":   dict(bass=0.9, kick=0.5, hats=0.5, pad=1.0),
}


def parse_key(k):
    m = re.fullmatch(r"([A-Ga-g])([#b]?)(m|min|minor)?", k.strip())
    if not m:
        raise SystemExit(f"bad --key {k!r} (examples: Dm, F#m, Bb, C)")
    n = NOTE[m.group(1).upper()] + {"#": 1, "b": -1, "": 0}[m.group(2)]
    return n % 12, bool(m.group(3))


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def parse_sections(s, length):
    secs = []
    for part in s.split(","):
        name, dur = part.split(":")
        secs.append([name.strip().lower(), float(dur)])
    tot = sum(d for _, d in secs)
    if length and abs(tot - length) > 0.01:
        secs[-1][1] = max(1.0, secs[-1][1] + (length - tot))
    return secs


def mood_params(mood, bpm):
    m = mood.lower()
    p = dict(swing=0.0, hat_div=2, pad_level=0.5, kick_pattern=(0.0, 2.0), bass_busy=0.5)
    if re.search(r"soul|late|night|smoke|jazz|lazy|slow", m):
        p.update(swing=0.16, hat_div=2, pad_level=0.6)
    if re.search(r"tense|urgent|thriller|dark|drive|pulse", m):
        p.update(hat_div=4, kick_pattern=(0.0, 1.5, 2.0, 3.5), bass_busy=0.8, pad_level=0.35)
    if re.search(r"calm|ambient|soft|gentle|sleep", m):
        p.update(hat_div=1, kick_pattern=(0.0,), pad_level=0.8, bass_busy=0.2)
    if re.search(r"upbeat|bright|happy|playful", m):
        p.update(hat_div=2, kick_pattern=(0.0, 1.0, 2.0, 3.0), bass_busy=0.7)
    if bpm > 110:
        p["hat_div"] = min(p["hat_div"], 2)
    return p


def speech_clear(x, atten_db=-24.0):
    """Frequency-domain cut over 300 Hz - 3 kHz with raised-cosine edges (250-300 Hz, 3.0-3.5 kHz)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    a = 10 ** (atten_db / 20)
    inner = (f >= 300) & (f <= 3000)
    g[inner] = a
    lo = (f >= 250) & (f < 300)
    g[lo] = a + (1 - a) * 0.5 * (1 + np.cos(np.pi * (f[lo] - 250) / 50))
    hi = (f > 3000) & (f <= 3500)
    g[hi] = a + (1 - a) * 0.5 * (1 - np.cos(np.pi * (f[hi] - 3000) / 500))
    return np.fft.irfft(X * g, len(x))


def highpass(x, fc):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.clip((f - fc * 0.8) / (fc * 0.4), 0, 1)
    return np.fft.irfft(X * g, len(x))


def add(buf, t, sig):
    i = int(round(t * SR))
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[:j - i]


def kick(level):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 42 + 80 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return level * np.sin(ph) * np.exp(-t * 7) * np.minimum(1, t * 600)


def bass_note(freq, dur, level):
    n = int((dur + 0.1) * SR)
    t = np.arange(n) / SR
    env = np.minimum(1, t * 120) * np.exp(-t * 1.6) * np.clip((dur + 0.1 - t) / 0.1, 0, 1)
    y = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) * (freq * 2 < 190)
    return level * y * env


def pad_chord(freqs, dur, level):
    n = int((dur + 0.6) * SR)
    t = np.arange(n) / SR
    env = np.minimum(1, t / 0.6) * np.clip((dur + 0.6 - t) / 0.6, 0, 1)
    L = np.zeros(n)
    R = np.zeros(n)
    for k, f in enumerate(freqs):
        L += np.sin(2 * np.pi * f * 1.002 * t + k)
        R += np.sin(2 * np.pi * f * 0.998 * t + 2 * k)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 0.2 * t)
    return level * env * trem * L / len(freqs), level * env * trem * R / len(freqs)


def render(a):
    root, minor = parse_key(a.key)
    prog = PROG_MINOR if minor else PROG_MAJOR
    secs = parse_sections(a.sections, a.length) if a.sections else [["verse", a.length]]
    length = sum(d for _, d in secs)
    N = int(length * SR)
    rng = np.random.default_rng(a.seed)
    P = mood_params(a.mood, a.bpm)
    beat = 60.0 / a.bpm
    bar = 4 * beat
    nbars = int(np.ceil(length / bar))

    bass = np.zeros(N)
    kck = np.zeros(N)
    hats = np.zeros(2 * N).reshape(2, N)
    padL = np.zeros(N)
    padR = np.zeros(N)
    fx = np.zeros(2 * N).reshape(2, N)

    def sec_at(t):
        acc = 0
        for name, d in secs:
            if t < acc + d:
                return name, acc, acc + d
            acc += d
        return secs[-1][0], length - secs[-1][1], length

    # hat noise bank (> 5 kHz), a few variants
    bank = []
    for _ in range(4):
        nz = highpass(rng.standard_normal(int(0.25 * SR)), 5500)
        tt = np.arange(len(nz)) / SR
        bank.append(nz)
    hat_env = {"closed": lambda tt: np.exp(-tt * 70), "open": lambda tt: np.exp(-tt * 18)}

    for b in range(nbars):
        t0 = b * bar
        if t0 >= length:
            break
        name, s0, s1 = sec_at(t0)
        g = SECTION.get(name, SECTION["verse"])
        # outro: linear fade across its final 8 s
        def fade(t):
            return float(np.clip((length - t) / 8.0, 0, 1)) if name == "outro" else 1.0
        off, qual = prog[(b // (2 if a.bpm < 80 else 1)) % len(prog)]
        croot = root + off
        tones = [croot + x for x in CHORD[qual]]
        # bass: root on 1, optional syncopated fifth/octave pick-ups; keep fundamentals 36-98 Hz
        base_midi = 24 + (croot % 12)
        if base_midi > 31:
            base_midi -= 12
        base_midi = max(base_midi, 28)
        if g["bass"] > 0:
            add(bass, t0, bass_note(midi_hz(base_midi), 1.6 * beat, 0.9 * g["bass"] * fade(t0)))
            if P["bass_busy"] > 0.3:
                add(bass, t0 + 2.5 * beat, bass_note(midi_hz(base_midi + 7), 0.9 * beat, 0.6 * g["bass"] * fade(t0)))
            if P["bass_busy"] > 0.6:
                add(bass, t0 + 3.5 * beat, bass_note(midi_hz(base_midi + 12 if base_midi < 36 else base_midi), 0.4 * beat, 0.5 * g["bass"] * fade(t0)))
        if g["kick"] > 0:
            for kb in P["kick_pattern"]:
                add(kck, t0 + kb * beat, kick(0.85 * g["kick"] * fade(t0)))
        if g["hats"] > 0:
            div = P["hat_div"]
            for i in range(4 * div):
                pos = i / div
                if div > 1 and i % 2 == 1:
                    pos += P["swing"] / div
                t = t0 + pos * beat
                if t >= length:
                    break
                accent = 1.0 if i % div == 0 else 0.55
                kind = "open" if (i == 4 * div - 1 and div >= 2 and b % 2 == 1) else "closed"
                tt = np.arange(len(bank[0])) / SR
                h = bank[int(rng.integers(0, 4))] * hat_env[kind](tt) * 0.45 * accent * g["hats"] * fade(t) * float(rng.uniform(0.8, 1.0))
                pan = 0.5 + (0.22 if i % 2 else -0.22)
                add(hats[0], t, h * (1 - pan))
                add(hats[1], t, h * pan)
        if g["pad"] > 0:
            # chord tones at 110-260 Hz so the pad stays outside the speech band
            fr = []
            for tmi in tones:
                m = 45 + (tmi - 45) % 12 + 12 * 0
                while midi_hz(m) > 262:
                    m -= 12
                while midi_hz(m) < 108:
                    m += 12
                fr.append(midi_hz(m))
            L, R = pad_chord(fr, bar, 0.22 * P["pad_level"] * g["pad"] * fade(t0))
            add(padL, t0, L)
            add(padR, t0, R)

    # stingers
    if a.stingers:
        for tok in a.stingers.split(","):
            parts = tok.strip().split(":")
            kind, t = parts[0], float(parts[1])
            if kind == "hit":
                n = int(2.0 * SR)
                tt = np.arange(n) / SR
                boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-tt * 14)) * tt) * np.exp(-tt * 2.2) * 0.9
                air = highpass(rng.standard_normal(n), 6000) * np.exp(-tt * 9) * 0.25
                add(fx[0], t, boom + air)
                add(fx[1], t, boom + air)
            elif kind == "riser":
                ln = float(parts[2]) if len(parts) > 2 else 3.0
                n = int(ln * SR)
                nz = highpass(rng.standard_normal(n), 4500)
                swell = (np.arange(n) / n) ** 2.2
                add(fx[0], t - ln, nz * swell * 0.22)
                add(fx[1], t - ln, np.roll(nz, 77) * swell * 0.22)

    bass = speech_clear(bass)  # a 36-98 Hz bass is already clear; this removes any rendering residue
    padL, padR = speech_clear(padL), speech_clear(padR)
    stems = {
        "bass": np.stack([bass, bass]),
        "drums": hats + kck[None, :],
        "pad": np.stack([padL, padR]),
        "fx": fx,
    }
    # soft-clip kick+bass overlap, then one shared normalisation so stems still sum to the mix
    mix = sum(stems.values())
    peak = np.abs(mix).max() + 1e-9
    gain = 10 ** (a.peak_db / 20) / peak
    return {k: v * gain for k, v in stems.items()}, length


def write_wav(path, x):
    pcm = (np.clip(x.T, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def band_report(mix):
    m = mix.mean(0)
    P = np.abs(np.fft.rfft(m)) ** 2
    f = np.fft.rfftfreq(len(m), 1 / SR)
    db = lambda lo, hi: 10 * np.log10(P[(f >= lo) & (f < hi)].sum() / len(m) ** 2 + 1e-18)  # noqa: E731
    r = dict(bass_lt200=db(20, 200), speech_300_3k=db(300, 3000), hats_gt5k=db(5000, 16000))
    r["bass_minus_speech_db"] = r["bass_lt200"] - r["speech_300_3k"]
    return r


def write_music_wanted(project, mood, bpm, key, length, sections=None, licenses="CC0, public domain, CC BY (attribution in CREDITS.md)",
                       notes="", filename="MUSIC_WANTED.md"):
    """Describe the track to look for when no free track fits (brief for a human or a later search)."""
    path = os.path.join(project, filename)
    sec = "\n".join(f"  - {n}: {d:g} s" for n, d in (parse_sections(sections, length) if sections else [])) or "  - single bed, no sections"
    txt = f"""# Music wanted

- **Mood:** {mood}
- **Tempo:** {bpm} BPM (half/double-time feel acceptable), steady, no tempo drift (a click-free live groove is fine)
- **Key:** {key} (any key if the track is only underscore; relative major/minor acceptable)
- **Length:** at least {length:g} s, or a loopable 30-60 s section that can be extended
- **Structure:**
{sec}
- **Mix requirements (docs/style-guide/11-audio-sync.md section 5):** mostly bass (< 200 Hz) and hats (> 5 kHz); little energy in 300 Hz - 3 kHz, because a narrator sits there;
  no vocals under narration; the bed must sit 10-15 dB under the voice; stems or a variant without lead melody preferred.
- **Licence required:** {licenses}. Never: CC BY-NC / ND, "royalty-free" stock with its own licence, content-ID-registered tracks.
- **Where to search:**
  - Internet Archive: `mediatype:audio AND licenseurl:*publicdomain*` (Musopen PD recordings for classical)
  - Wikimedia Commons: `filetype:audio` + mood words, categories "Audio files of ..."
  - Openverse audio (Jamendo, Freesound, Wikimedia): filter licence CC0 / BY
  - Free Music Archive and ccMixter (check each track's licence page)
  - `tools/source/source_music.py --mood "{mood}" --bpm {bpm - 10}-{bpm + 10} --min-len {int(length)} --project {project}`
  - fallback: `tools/source/make_bed.py --bpm {bpm} --key {key} --mood "{mood}" --length {length:g}`
{('- **Notes:** ' + notes) if notes else ''}
"""
    os.makedirs(project, exist_ok=True)
    open(path, "w", encoding="utf-8").write(txt)
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--bpm", type=float, default=72)
    ap.add_argument("--key", default="Dm")
    ap.add_argument("--mood", default="late-night soul")
    ap.add_argument("--length", type=float, default=90)
    ap.add_argument("--sections", default=None, help='e.g. "intro:8,verse:32,drop:4,montage:24,outro:22" (last section absorbs length mismatch)')
    ap.add_argument("--stingers", default=None)
    ap.add_argument("--out", required=True)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--peak-db", type=float, default=-3.0)
    ap.add_argument("--wanted", default=None, metavar="PROJECT", help="also write PROJECT/MUSIC_WANTED.md")
    a = ap.parse_args()
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    stems, length = render(a)
    write_wav(a.out, sum(stems.values()))
    stem = os.path.splitext(a.out)[0]
    for k, v in stems.items():
        write_wav(f"{stem}_{k}.wav", v)
    r = band_report(sum(stems.values()))
    print(f"wrote {a.out} ({length:g} s, {a.bpm:g} BPM, {a.key}) + stems bass/drums/pad/fx")
    print("bands (dB): bass<200 {bass_lt200:.1f}  speech300-3k {speech_300_3k:.1f}  hats>5k {hats_gt5k:.1f}  -> bass minus speech {bass_minus_speech_db:.1f} dB".format(**r))
    if a.wanted:
        print("wrote", write_music_wanted(a.wanted, a.mood, a.bpm, a.key, length, a.sections))


if __name__ == "__main__":
    main()
