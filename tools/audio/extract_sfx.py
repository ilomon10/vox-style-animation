#!/usr/bin/env python3
"""Cut reusable sound effects out of a reference's soundtrack (numpy only), voice-safe and peak-aligned.

    tools/py tools/audio/extract_sfx.py --manifest video-projects/<slug>/reference/<id>/sfx.manifest.json
    ... --only whoosh_a,hit_b      ... --dry-run (analyse, write nothing)      ... --verify (re-check written WAVs)
    ... --no-denoise               ... --skip-flagged                          ... --prune

The cut list: {"source": {"video", "wav", "words", "fps", "title", "publisher", "rights"}, "out": "<folder>",
"defaults": {...}, "clips": [...], "rejected": [...], "music": [...]} (template: tools/reference/sfx.manifest.template.json).
`wav` is a 48 kHz stereo WAV of the soundtrack and `words` the faster-whisper words of its speech: tools/reference/scan.py
writes both (when `wav` is missing it is decoded from `video` here). A clip needs {id, t0, t1, kind, notes} (seconds on the
reference timeline); the other keys are listed in CLIP_KEYS below. For every clip the tool

 1. reads only the clip window (+0.5 s padding for the filters) from the WAV, so memory stays at a few MB;
 2. selects channels: 'stereo' or 'side' (S = (L-R)/2, written as dual mono): voices are usually mixed to the centre,
    so the side channel often holds only music and effects;
 3. applies optional zero-phase Butterworth high/low-pass filters;
 4. optionally reduces the bed by spectral subtraction against a nearby bed-only noise print ('denoise');
    (steps 2-4 form one chain; 'layers' sums several chains)
 5. runs the voice test on every chain: transcript words inside the window, plus a mid/side test. With words present the
    chain must prove the voice is gone (side channel only, or the voice band 250 Hz-10 kHz >= 30 dB down and a 150 Hz
    fundamental >= 15 dB down), otherwise the clip is SKIPPED; without words, centre-only speech-band energy FLAGS it;
 6. splices out optional 'remove' spans, then cuts [t0, t1] with 10 ms raised-cosine fades (or a seamless loop crossfade);
 7. normalises the sample peak to -1 dBFS and writes <out>/<id>.wav (48 kHz, stereo, 16-bit);
 8. writes <id>.json in the tools/audio/make_sfx.py sidecar format (peak_s, onset_s, suggested_gain_db, loop, ...), so
    SfxAtPeak can start the clip at (picture event - peak_s);
 9. writes manifest.json, SFX.md and PROVENANCE.md, then re-reads every WAV and checks its peak offset (5 ms tolerance).
Every clip keeps the rights of the reference it was cut from (PROVENANCE.md).
"""
import argparse
import datetime
import hashlib
import json
import os
import platform
import sys
import wave

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
SR = 48000
FPS = 25.0                 # the reference's frame rate: set from the manifest's source.fps in main()
PAD_S = 0.5                # read padding around every window (filter / STFT edges)
SPEECH = (250.0, 3500.0)   # speech band of the mid/side (centre-excess) test
VOICE = (250.0, 10000.0)   # formants + sibilants: band that filtering must clear when transcript words overlap
VOICE_F0_HZ = 150.0        # a low adult voice fundamental
PEAK_TOL_MS = 5.0          # verification tolerance
ONSET_DB = -40.0           # onset = first sample above peak + ONSET_DB (as make_sfx.py)

CLIP_KEYS = {
    "id": "file stem, [a-z0-9_]",
    "t0 / t1": "seconds on the reference timeline (frame = t * fps)",
    "kind": "impact | hit | swish | tick | boom | swell | drone | foley | texture | texture-loop | room-tone-loop",
    "notes": "short placement note -> sidecar 'note'",
    "use": "what to use it for in the kit (SFX.md)",
    "channels": "stereo (default) | side (S=(L-R)/2, written as dual mono so it survives a mono fold-down)",
    "highpass_hz / lowpass_hz / filter_order": "zero-phase Butterworth magnitude filters (default order 4)",
    "denoise": "{t0, t1, over (1.5), floor_db (-24)}: spectral subtraction against this bed-only print",
    "loop / loop_xfade_ms": "seamless loop (equal-power crossfade, default 40 ms) instead of edge fades",
    "remove": "[[t_a, t_b], ...] source spans spliced out (equal-power, 20 ms) before looping, e.g. a stray click",
    "layers": "[{channels, highpass_hz, lowpass_hz, filter_order, denoise}, ...] chains summed into one clip; each "
              "chain must pass the voice test on its own (e.g. a stereo low-passed body + a side-only high-passed attack)",
    "fade_in_ms / fade_out_ms": "override the 10 ms fades",
    "mono_review": "why centre-only speech-band energy is not a voice (clears a 'flagged' result)",
    "grade / grade_note": "A | B | C cleanliness after listening/spectrogram review (see SFX.md)",
    "bleed": "what else is audible in the clip (music, bed)",
    "source_frames": "the frames the analysis reports cite for this sound",
    "origin": "what the sound is in the reference (score element, sound-design layer, foley) for PROVENANCE.md",
}


# ---------------------------------------------------------------------------------------------------- io
def rel(p):
    return os.path.relpath(p, ROOT)


def read_window(path, t0, t1):
    """Stereo float64 samples for [t0, t1) s; zero-filled outside the file. Reads only that span."""
    with wave.open(path, "rb") as w:
        if w.getnchannels() != 2 or w.getsampwidth() != 2 or w.getframerate() != SR:
            raise SystemExit(f"{path}: expected 48 kHz 16-bit stereo")
        n = w.getnframes()
        a, b = int(round(t0 * SR)), int(round(t1 * SR))
        out = np.zeros((b - a, 2))
        r0, r1 = max(0, a), min(n, b)
        if r1 > r0:
            w.setpos(r0)
            raw = np.frombuffer(w.readframes(r1 - r0), dtype="<i2").reshape(-1, 2)
            out[r0 - a:r0 - a + len(raw)] = raw / 32768.0
        return out


def write_wav16(path, y):
    pcm = np.clip(np.round(y * 32767.0), -32768, 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    return pcm


def read_wav16(path):
    with wave.open(path, "rb") as w:
        params = (w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes())
        pcm = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").reshape(-1, w.getnchannels())
    return params, pcm


def sha256(path, chunk=1 << 20):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(chunk), b""):
            h.update(b)
    return h.hexdigest()


def db(p):
    return 10.0 * np.log10(np.asarray(p, dtype=float) + 1e-20)


# ---------------------------------------------------------------------------------------------------- dsp
def select_channels(x, mode):
    if mode == "stereo":
        return x.copy()
    if mode == "side":
        s = (x[:, 0] - x[:, 1]) / 2.0
        return np.stack([s, s], 1)
    raise SystemExit(f"unknown channels mode {mode!r}")


def chain_gain_db(f, hp=None, lp=None, order=4):
    """Magnitude (dB) of the chain's Butterworth filters at frequency f."""
    g = 1.0
    if hp:
        g /= np.sqrt(1.0 + (hp / f) ** (2 * order))
    if lp:
        g /= np.sqrt(1.0 + (f / lp) ** (2 * order))
    return 20.0 * np.log10(g)


def zero_phase_filter(x, hp=None, lp=None, order=4):
    """Butterworth magnitude response applied in the frequency domain (no phase shift). x: (n, 2)."""
    if not hp and not lp:
        return x
    n = len(x)
    f = np.fft.rfftfreq(n, 1.0 / SR)
    g = np.ones_like(f)
    if hp:
        g /= np.sqrt(1.0 + (hp / np.maximum(f, 1e-3)) ** (2 * order))
    if lp:
        g /= np.sqrt(1.0 + (f / lp) ** (2 * order))
    return np.fft.irfft(np.fft.rfft(x, axis=0) * g[:, None], n, axis=0)


def stft(x, n=2048, hop=512):
    win = np.hanning(n + 1)[:-1]
    xp = np.concatenate([np.zeros(n), x, np.zeros(2 * n)])
    nfr = (len(xp) - n) // hop + 1
    idx = np.arange(nfr)[:, None] * hop + np.arange(n)[None, :]
    return np.fft.rfft(xp[idx] * win, axis=1), win


def istft(X, win, hop, length):
    n = len(win)
    fr = np.fft.irfft(X, n, axis=1) * win
    total = (len(fr) - 1) * hop + n
    out, wsum = np.zeros(total), np.zeros(total)
    for i in range(len(fr)):
        out[i * hop:i * hop + n] += fr[i]
        wsum[i * hop:i * hop + n] += win ** 2
    out /= np.maximum(wsum, 1e-8)
    return out[n:n + length]


def spectral_subtract(x, noise, over=1.5, floor_db=-24.0, n=2048, hop=512):
    """Magnitude spectral subtraction per channel; gain smoothed over 3 frames x 3 bins against musical noise."""
    out = np.zeros_like(x)
    floor = 10 ** (floor_db / 20.0)
    for c in range(x.shape[1]):
        X, win = stft(x[:, c], n, hop)
        P, _ = stft(noise[:, c], n, hop)
        inside = P[n // hop:max(n // hop + 1, len(noise) // hop - 1)]  # frames that lie fully inside the print
        nmag = np.abs(inside).mean(0)
        g = np.maximum(1.0 - over * nmag[None, :] / np.maximum(np.abs(X), 1e-12), floor)
        gp = np.pad(g, 1, mode="edge")
        g = sum(gp[1 + i:1 + i + g.shape[0], 1 + j:1 + j + g.shape[1]] for i in (-1, 0, 1) for j in (-1, 0, 1)) / 9.0
        out[:, c] = istft(X * g, win, hop, len(x))
    return out


def band_frames(sig, lo, hi, n=1024, hop=480):
    """Band power per 10 ms frame (frames centred on k*hop, k = 0..). Returns (frame times re clip start, power)."""
    win = np.hanning(n)
    xp = np.concatenate([np.zeros(n // 2), sig, np.zeros(n // 2)])
    nfr = 1 + (len(sig) - 1) // hop
    idx = np.arange(nfr)[:, None] * hop + np.arange(n)[None, :]
    X = np.abs(np.fft.rfft(xp[idx] * win, axis=1)) ** 2
    f = np.fft.rfftfreq(n, 1.0 / SR)
    m = (f >= lo) & (f < hi)
    return np.arange(nfr) * hop / SR, X[:, m].sum(1) / (n * np.sum(win ** 2) / 2.0)


def raised_cosine_fades(y, fin_ms, fout_ms):
    y = y.copy()
    for ms, rev in ((fin_ms, False), (fout_ms, True)):
        k = min(len(y) // 2, int(round(ms * SR / 1000.0)))
        if k <= 0:
            continue
        ramp = 0.5 - 0.5 * np.cos(np.pi * (np.arange(k) + 0.5) / k)
        if rev:
            y[-k:] *= ramp[::-1, None]
        else:
            y[:k] *= ramp[:, None]
    return y


def make_loop(x, xfade_ms):
    """Seamless loop of len(x) - X samples: the X samples after the loop end are crossfaded (equal power) onto the
    head, so sample L-1 runs straight into sample 0 exactly as x[L-1] ran into x[L] in the source."""
    X = int(round(xfade_ms * SR / 1000.0))
    L = len(x) - X
    if X <= 0 or L <= X:
        raise SystemExit("loop too short for its crossfade")
    u = (np.arange(X) + 0.5) / X
    y = x[:L].copy()
    y[:X] = x[:X] * np.sin(0.5 * np.pi * u)[:, None] + x[L:L + X] * np.cos(0.5 * np.pi * u)[:, None]
    return y


def splice(x, spans, xfade_ms=20.0):
    """Cut [a, b) sample spans (sorted, clip-relative) out of x, joining the edges with equal-power crossfades."""
    h = max(1, int(round(xfade_ms * SR / 1000.0)) // 2)
    u = (np.arange(2 * h) + 0.5) / (2 * h)
    parts, cur = [], 0
    for a, b in spans:
        if not (h <= a < b <= len(x) - h) or a - h < cur:
            raise SystemExit(f"bad 'remove' span {a / SR:.3f}-{b / SR:.3f} s")
        parts.append(x[cur:a - h])
        parts.append(x[a - h:a + h] * np.cos(0.5 * np.pi * u)[:, None] + x[b - h:b + h] * np.sin(0.5 * np.pi * u)[:, None])
        cur = b + h
    parts.append(x[cur:])
    return np.concatenate(parts)


def out_to_src(i, spans):
    """Clip-relative output sample -> clip-relative source sample after splice()."""
    for a, b in spans:
        if i >= a:
            i += b - a
    return i


def peak_onset(pcm):
    a = np.abs(pcm.astype(np.int32)).max(1)
    pk = int(np.argmax(a))
    thr = a[pk] * 10 ** (ONSET_DB / 20.0)
    onset = int(np.argmax(a > thr))
    return pk, onset, (20 * np.log10(a[pk] / 32768.0) if a[pk] else -np.inf)


def frame_levels(y, n=960, hop=480):
    m = y.mean(1) if y.ndim == 2 else y
    if len(m) < n:
        return np.array([db(np.mean(m ** 2))])
    idx = np.arange(0, len(m) - n + 1, hop)[:, None] + np.arange(n)[None, :]
    return db(np.mean(m[idx] ** 2, 1))


# ---------------------------------------------------------------------------------------------------- voice
def voice_check(clip, out, src, words, pad):
    """out: processed clip at source level (no fades), src: raw stereo clip; both (n, 2) for [t0, t1]."""
    t0, t1 = clip["t0"], clip["t1"]
    hits = [w for w in words if w["end"] + pad > t0 and w["start"] - pad < t1]
    res = {"words": [f"{w['word']} {w['start']:.2f}-{w['end']:.2f}" for w in hits]}
    mode = clip.get("channels", "stereo")
    if mode == "side":
        res["verdict"] = "removed" if hits else "clean"
        res["detail"] = ("side channel only: the centre (mid) channel, which carries every voice, is discarded"
                         + (f"; transcript words in the window: {len(hits)}" if hits else ""))
        return res
    lo = float(clip.get("highpass_hz") or 20.0)
    hi = float(clip.get("lowpass_hz") or SR / 2.0)
    s_lo, s_hi = max(SPEECH[0], lo), min(SPEECH[1], hi)
    Mo, So = (out[:, 0] + out[:, 1]) / 2.0, (out[:, 0] - out[:, 1]) / 2.0
    if hits:
        Ms = (src[:, 0] + src[:, 1]) / 2.0
        tt, p_src = band_frames(Ms, *VOICE)
        _, p_out = band_frames(Mo, *VOICE)
        tabs = t0 + tt
        inw = np.zeros(len(tt), bool)
        for w in hits:
            inw |= (tabs >= w["start"] - pad) & (tabs <= w["end"] + pad)
        drop = float(db(p_out[inw].mean()) - db(p_src[inw].mean())) if inw.any() else 0.0
        b_lo, b_hi = (s_lo, s_hi) if s_hi > s_lo else (lo, hi)
        _, pM = band_frames(Mo, b_lo, b_hi)
        _, pS = band_frames(So, b_lo, b_hi)
        lev = db(pM)
        act = lev > lev.max() - 40.0
        ce = lev - db(pS)
        base = act & ~inw
        leak = float(np.median(ce[inw & act]) - np.median(ce[base])) if base.sum() >= 5 and (inw & act).any() else None
        f0_att = float(chain_gain_db(VOICE_F0_HZ, clip.get("highpass_hz"), clip.get("lowpass_hz"),
                                     int(clip.get("filter_order", 4))))
        res["voice_band_drop_db"] = round(drop, 1)
        res["f0_150hz_atten_db"] = round(f0_att, 1)
        res["centre_excess_in_words_db"] = None if leak is None else round(leak, 1)
        # Removal must be proven by the processing itself: whisper word boundaries are too loose (errors up to 22 f)
        # for a word-frame vs gap-frame comparison to clear a full-band clip, so the centre-excess figure ('leak') is
        # reported for information only.
        if drop <= -30.0 and f0_att <= -15.0:
            res["verdict"], res["detail"] = "removed", (
                f"{len(hits)} transcript word(s) overlap; after filtering, the voice band (250 Hz-10 kHz) in those "
                f"frames is {drop:+.0f} dB re the source mid and a 150 Hz fundamental {f0_att:+.0f} dB")
        else:
            why = (f"voice band only {drop:+.0f} dB down" if drop > -30.0 else
                   f"a 150 Hz voice fundamental is only {f0_att:+.0f} dB down")
            res["verdict"], res["detail"] = "voice", (
                f"{len(hits)} transcript word(s) overlap; {why}"
                + ("" if leak is None else f"; centre excess in word frames {leak:+.1f} dB vs the rest"))
        return res
    if s_hi <= s_lo:
        res["verdict"], res["detail"] = "clean", f"no transcript word; passband {lo:.0f}-{hi:.0f} Hz has no speech band"
        return res
    _, pM = band_frames(Mo, s_lo, s_hi)
    _, pS = band_frames(So, s_lo, s_hi)
    lev = db(pM)
    act = (lev > -60.0) & (lev > lev.max() - 30.0)
    if not act.any():
        res["verdict"], res["detail"] = "clean", "no transcript word; speech band below -60 dBFS"
        return res
    p90 = float(np.percentile((lev - db(pS))[act], 90))
    res["speech_band_centre_excess_db"] = round(p90, 1)
    if p90 > 20.0:
        if clip.get("mono_review"):
            res["verdict"], res["detail"] = "clean", f"no transcript word; centre-only speech-band energy " \
                f"(mid {p90:.0f} dB over side) reviewed: {clip['mono_review']}"
        else:
            res["verdict"], res["detail"] = "flagged", f"no transcript word, but mid is {p90:.0f} dB over side in " \
                f"{s_lo:.0f}-{s_hi:.0f} Hz (mono SFX, breath or an untranscribed voice): listen"
    else:
        res["verdict"], res["detail"] = "clean", f"no transcript word; speech band mid-over-side p90 {p90:+.0f} dB"
    return res


# ---------------------------------------------------------------------------------------------------- one clip
LAYER_KEYS = ("channels", "highpass_hz", "lowpass_hz", "filter_order", "denoise")
VERDICT_RANK = {"clean": 0, "removed": 1, "flagged": 2, "voice": 3}


def clip_layers(clip):
    """A clip is one processing chain (its top-level keys) or several chains summed ('layers')."""
    if clip.get("layers"):
        return [dict(layer) for layer in clip["layers"]]
    return [{k: clip[k] for k in LAYER_KEYS if k in clip}]


def process_layer(win, layer, src_wav, no_denoise):
    """Channel selection + filters (+ bed subtraction) on the padded window. Returns (signal, bed level dBFS)."""
    mode = layer.get("channels", "stereo")
    hp, lp, order = layer.get("highpass_hz"), layer.get("lowpass_hz"), int(layer.get("filter_order", 4))
    x = zero_phase_filter(select_channels(win, mode), hp, lp, order)
    dn = layer.get("denoise") if not no_denoise else None
    if not dn:
        return x, None
    pw = read_window(src_wav, dn["t0"] - PAD_S, dn["t1"] + PAD_S)
    pr = zero_phase_filter(select_channels(pw, mode), hp, lp, order)
    pa = int(round(PAD_S * SR))
    prn = pr[pa:pa + int(round((dn["t1"] - dn["t0"]) * SR))]
    bed = float(db(np.mean(((prn[:, 0] + prn[:, 1]) / 2.0) ** 2)))
    return spectral_subtract(x, prn, float(dn.get("over", 1.5)), float(dn.get("floor_db", -24.0))), bed


def process_clip(clip, src_wav, words, cfg, no_denoise):
    t0, t1 = float(clip["t0"]), float(clip["t1"])
    if t1 <= t0:
        raise SystemExit(f"{clip['id']}: t1 <= t0")
    win = read_window(src_wav, t0 - PAD_S, t1 + PAD_S)
    a, b = int(round(PAD_S * SR)), int(round(PAD_S * SR)) + int(round((t1 - t0) * SR))
    src = win[a:b]
    out, beds, vcs = np.zeros_like(src), [], []
    for layer in clip_layers(clip):
        x, bed = process_layer(win, layer, src_wav, no_denoise)
        out += x[a:b]
        if bed is not None:
            beds.append(bed)
        lc = dict(layer, t0=t0, t1=t1, mono_review=clip.get("mono_review"))
        vcs.append(voice_check(lc, x[a:b], src, words, cfg["word_pad_s"]))
    worst = max(vcs, key=lambda v: VERDICT_RANK[v["verdict"]])
    if len(vcs) == 1:
        vc = vcs[0]
    else:  # every layer must pass on its own
        vc = {"verdict": worst["verdict"], "words": vcs[0]["words"],
              "detail": " + ".join(f"layer {i + 1}: {v['detail']}" for i, v in enumerate(vcs)),
              "layers": [{k: v for k, v in x.items() if k != "words"} for x in vcs]}
    spans = sorted((int(round((ra - t0) * SR)), int(round((rb - t0) * SR))) for ra, rb in clip.get("remove", []))
    if spans:
        out = splice(out, spans)
    loop = bool(clip.get("loop"))
    if loop:
        y = make_loop(out, float(clip.get("loop_xfade_ms", cfg["loop_xfade_ms"])))
    else:
        y = raised_cosine_fades(out, float(clip.get("fade_in_ms", cfg["fade_ms"])),
                                float(clip.get("fade_out_ms", cfg["fade_ms"])))
    peak = float(np.abs(y).max())
    if peak <= 0:
        raise SystemExit(f"{clip['id']}: silent after processing")
    src_peak_db = 20 * np.log10(peak)
    lv = frame_levels(y)                       # 20 ms mid RMS, source level
    k = 0 if loop else int(np.ceil(max(float(clip.get("fade_in_ms", cfg["fade_ms"])),
                                       float(clip.get("fade_out_ms", cfg["fade_ms"]))) / 10.0)) + 1
    inner = lv[k:len(lv) - k] if len(lv) > 2 * k + 2 else lv
    floor_db = float(np.percentile(inner, 10) - lv.max())
    bed_db = None if not beds else round(max(beds) - float(lv.max()), 1)
    target = 10 ** (cfg["peak_dbfs"] / 20.0)
    y = y * (target / peak)
    return {"y": y, "voice": vc, "src_peak_dbfs": src_peak_db, "norm_gain_db": 20 * np.log10(target / peak),
            "floor_db": floor_db, "bed_db": bed_db, "loop": loop, "spans": spans}


def layer_proc(layer, bed_db):
    d = {"channels": layer.get("channels", "stereo")}
    for key in ("highpass_hz", "lowpass_hz"):
        if layer.get(key):
            d[key] = layer[key]
    if layer.get("highpass_hz") or layer.get("lowpass_hz"):
        d["filter"] = f"zero-phase Butterworth, order {int(layer.get('filter_order', 4))}"
    if layer.get("denoise") and bed_db is not None:
        dn = layer["denoise"]
        d["denoise"] = {"print_t0": dn["t0"], "print_t1": dn["t1"], "over": dn.get("over", 1.5),
                        "floor_db": dn.get("floor_db", -24.0), "bed_re_peak_db": bed_db}
    return d


def sidecar(clip, res, pcm, cfg, src_info):
    pk, onset, pk_db = peak_onset(pcm)
    t0, t1 = float(clip["t0"]), float(clip["t1"])
    dur = len(pcm) / SR
    layers = [layer_proc(layer, res["bed_db"]) for layer in clip_layers(clip)]
    proc = dict(layers[0]) if len(layers) == 1 else {"channels": "+".join(x["channels"] for x in layers), "layers": layers}
    if clip.get("remove"):
        proc["removed_spans_s"] = clip["remove"]
    if res["loop"]:
        proc["loop_xfade_ms"] = float(clip.get("loop_xfade_ms", cfg["loop_xfade_ms"]))
    else:
        proc["fades_ms"] = [float(clip.get("fade_in_ms", cfg["fade_ms"])), float(clip.get("fade_out_ms", cfg["fade_ms"]))]
    proc["normalise_gain_db"] = round(res["norm_gain_db"], 2)
    peak_t = t0 + out_to_src(pk, res["spans"]) / SR
    meta = {
        # --- make_sfx.py sidecar fields (SfxMeta in src/earworm/fx/sfx.tsx) ---
        "name": clip["id"],
        "file": f"{cfg['public_prefix']}/{clip['id']}.wav",
        "sample_rate": SR,
        "duration_s": round(dur, 4),
        "peak_s": round(pk / SR, 4),
        "onset_s": round(onset / SR, 4),
        "peak_dbfs": round(pk_db, 2),
        "suggested_gain_db": round(res["src_peak_dbfs"] - cfg["peak_dbfs"], 1),
        "loop": res["loop"],
        "note": clip["notes"],
        # --- extra fields ---
        "kind": clip["kind"],
        "use": clip.get("use", ""),
        "origin": clip.get("origin", ""),
        "channels": 2,
        "gain_note": "suggested_gain_db restores the level this sound had in the reference mix",
        "source": {
            "video": src_info["video"], "audio": src_info["wav"], "t0": t0, "t1": t1,
            "frame0": round(t0 * FPS, 2), "frame1": round(t1 * FPS, 2),
            "peak_t": round(peak_t, 4), "peak_frame": round(peak_t * FPS, 2),
            "peak_dbfs_in_reference": round(res["src_peak_dbfs"], 2),
            "cited_frames": clip.get("source_frames", ""),
        },
        "processing": proc,
        "voice_check": res["voice"],
        "cleanliness": {"grade": clip.get("grade", "?"), "note": clip.get("grade_note", ""),
                        "bleed": clip.get("bleed", ""), "floor_db": round(res["floor_db"], 1)},
    }
    return meta


# ---------------------------------------------------------------------------------------------------- verify
def verify(out_dir, ids):
    rows = []
    for cid in ids:
        jp, wp = os.path.join(out_dir, cid + ".json"), os.path.join(out_dir, cid + ".wav")
        if not (os.path.exists(jp) and os.path.exists(wp)):
            rows.append({"id": cid, "ok": False, "why": "missing file"})
            continue
        meta = json.load(open(jp))
        (nch, sw, sr, nfr), pcm = read_wav16(wp)
        pk, onset, pk_db = peak_onset(pcm)
        d_ms = abs(pk / sr - meta["peak_s"]) * 1000.0
        m = pcm.astype(np.float64).mean(1) / 32768.0           # independent cross-check: 5 ms RMS energy peak
        k = int(0.005 * sr)
        e = np.convolve(m * m, np.ones(k) / k, mode="same")
        env_ms = abs(int(np.argmax(e)) / sr - meta["peak_s"]) * 1000.0
        problems = []
        if (nch, sw, sr) != (2, 2, SR):
            problems.append(f"format {nch}ch/{8 * sw}bit/{sr}Hz")
        if abs(nfr / sr - meta["duration_s"]) > 0.0005:
            problems.append("duration")
        if d_ms > PEAK_TOL_MS:
            problems.append(f"peak off by {d_ms:.2f} ms")
        if abs(pk_db - meta["peak_dbfs"]) > 0.05:
            problems.append("peak level")
        rows.append({"id": cid, "ok": not problems, "why": ", ".join(problems), "sidecar_peak_s": meta["peak_s"],
                     "wav_peak_s": round(pk / sr, 5), "delta_ms": round(d_ms, 3), "peak_dbfs": round(pk_db, 2),
                     "energy_peak_delta_ms": round(env_ms, 1),
                     "frames": nfr, "sha256": sha256(wp)})
    return rows


# ---------------------------------------------------------------------------------------------------- docs
def fmt_t(t):
    return f"{t:.2f}"


def md_escape(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def write_docs(out_dir, man, metas, rejected_auto, ver, run):
    clips = [c for c in man["clips"] if c["id"] in metas]
    src = man["source"]
    rights = src.get("rights", "unknown")
    lic = ("cut from the user's own reference: the user's rights apply" if rights == "own" else
           "NOT CLEARED for publication: cut from a reference the user does not own; drafts and private use only")
    L = [f"# SFX cut from a reference: {src.get('title', '')}\n",
         f"Sound effects cut from **{src.get('title', '')}**{' (' + src['publisher'] + ')' if src.get('publisher') else ''}. "
         f"Rights: **{rights}**, {lic}. See [PROVENANCE.md](PROVENANCE.md).\n",
         f"Generated by `tools/py tools/audio/extract_sfx.py --manifest {run.get('manifest', '')}`. Edit the manifest, not this file.\n",
         "Every clip is 48 kHz, 16-bit, stereo WAV, sample peak normalised to **−1 dBFS**. Each `<id>.json` sidecar uses the "
         "`tools/audio/make_sfx.py` fields (`peak_s`, `onset_s`, `suggested_gain_db`, `loop`, …). `suggested_gain_db` puts the "
         "sound back at the level it had in the reference mix; `peak_s` is the sample peak, the point to land on the picture "
         "event (docs/style-guide/11-audio-sync.md).\n",
         "## Clips\n",
         f"Times are on the reference timeline (frame = s × {FPS:g}). *Peak* = offset of the sample peak inside the clip. "
         "*Gain* = `suggested_gain_db`. *Voice* is the automatic test: **clean** = no voice in the source window; **removed** = "
         "voice in the window but excluded by construction (side channel, or filtered ≥ 30 dB down); **flagged** = listen to it. "
         "Loops and textures have no meaningful peak: place them with `start`.\n",
         "| id | kind | dur s | peak s | source s (frames) | use | voice | gain dB |", "|---|---|---|---|---|---|---|---|"]
    for c in clips:
        m = metas[c["id"]]
        s = m["source"]
        vc = m["voice_check"]
        L.append(f"| `{c['id']}` | {c['kind']} | {m['duration_s']:.3f} | {m['peak_s']:.4f} | {s['t0']:.3f}–{s['t1']:.3f} "
                 f"(f{s['frame0']:g}–{s['frame1']:g}) | {md_escape(c.get('use', c.get('notes', '')))} | {vc['verdict']} | "
                 f"{m['suggested_gain_db']:+.1f} |")
    L.append("")
    if man.get("rejected") or rejected_auto:
        L += ["## Rejected candidates\n", "| candidate | source s | why it is not in the library |", "|---|---|---|"]
        for r in man.get("rejected", []) + rejected_auto:
            L.append(f"| {md_escape(r['id'])} | {fmt_t(r['t0'])}–{fmt_t(r['t1'])} | {md_escape(r['reason'])} |")
        L.append("")
    if man.get("music"):
        L += ["## Music in the reference (not extracted)\n",
              "Songs and score are not cut. These notes say what to look for in free-licence libraries "
              "(`tools/py tools/library/search.py --kind music`, `tools/source/source_music.py`).\n",
              "| time s | excerpt | tempo | mood / genre | role in the edit | search for |", "|---|---|---|---|---|---|"]
        for mu in man["music"]:
            L.append(f"| {fmt_t(mu['t0'])}–{fmt_t(mu['t1'])} | {md_escape(mu.get('what', ''))} | {md_escape(str(mu.get('tempo', '')))} | "
                     f"{md_escape(mu.get('mood', ''))} | {md_escape(mu.get('role', ''))} | {md_escape(mu.get('search', ''))} |")
        L.append("")
    ok = sum(1 for r in ver if r["ok"])
    L += ["## Verification\n",
          f"Run on {run['date']}: every WAV was re-read, its sample-peak offset compared with the sidecar's `peak_s` "
          f"(tolerance {PEAK_TOL_MS:g} ms); format, duration and peak level checked too. **{ok}/{len(ver)} clips pass.** "
          "Re-run with `--verify`.\n",
          "| id | sidecar peak_s | WAV peak s | Δ ms | peak dBFS | result |", "|---|---|---|---|---|---|"]
    for r in ver:
        if "sidecar_peak_s" in r:
            L.append(f"| `{r['id']}` | {r['sidecar_peak_s']:.4f} | {r['wav_peak_s']:.5f} | {r['delta_ms']:.3f} | {r['peak_dbfs']:.2f} | "
                     f"{'pass' if r['ok'] else 'FAIL: ' + r['why']} |")
        else:
            L.append(f"| `{r['id']}` | – | – | – | – | FAIL: {r['why']} |")
    L.append("")
    with open(os.path.join(out_dir, "SFX.md"), "w") as fh:
        fh.write("\n".join(L))

    P = [f"# Provenance: SFX cut from {src.get('title', 'a reference')}\n", "## Source\n",
         f"- **Work:** {src.get('title', '')}{'. ' + src['publisher'] if src.get('publisher') else ''}"
         f"{'. ' + src['url'] if src.get('url') else ''}.",
         f"- **File:** `{src.get('video', '')}`" + (f", SHA-256 `{run['video_sha256']}`" if run.get("video_sha256") else "") + ".",
         f"- **Audio used:** `{src['wav']}`, SHA-256 `{run['wav_sha256']}`.",
         f"- **Transcript for the voice test:** `{src.get('words', '(none)')}`" + (f" (SHA-256 `{run['words_sha256']}`)" if run.get("words_sha256") else "") + ".",
         "", "## Rights\n", f"- Rights in the reference: **{rights}**. {lic}.",
         "- Cutting a sound out of a soundtrack gives no new rights: each clip keeps the rights of the reference and of any "
         "music or recording inside it (named per clip below).", ""]
    P += [f"- {line}" for line in src.get("rights_notes", [])]
    P += ["## How the clips were made\n",
          f"- Tool: `tools/audio/extract_sfx.py` (SHA-256 `{run['tool_sha256']}`), manifest `{run.get('manifest', '')}` "
          f"(SHA-256 `{run['manifest_sha256']}`).",
          f"- Command: `{run['command']}`; run {run['date']}; Python {run['python']}, numpy {run['numpy']}.",
          "- Deterministic processing (no dither, no randomness): the same inputs give byte-identical WAVs.", "",
          "## Per clip\n", "| id | source s | frames | origin in the reference | what else is inside | output SHA-256 |",
          "|---|---|---|---|---|---|"]
    vmap = {r["id"]: r for r in ver}
    for c in clips:
        s = metas[c["id"]]["source"]
        P.append(f"| `{c['id']}` | {s['t0']:.3f}–{s['t1']:.3f} | {s['frame0']:g}–{s['frame1']:g} | {md_escape(c.get('origin', ''))} | "
                 f"{md_escape(c.get('bleed') or 'nothing audible besides the effect')} | `{vmap.get(c['id'], {}).get('sha256', '?')}` |")
    P.append("")
    with open(os.path.join(out_dir, "PROVENANCE.md"), "w") as fh:
        fh.write("\n".join(P))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--manifest", required=True, help="cut list (template: tools/reference/sfx.manifest.template.json)")
    ap.add_argument("--out", help="output folder (default: the manifest's \"out\")")
    ap.add_argument("--only", default="", help="comma-separated ids to (re)cut; the index and docs keep the others")
    ap.add_argument("--dry-run", action="store_true", help="analyse and print the voice test, write nothing")
    ap.add_argument("--verify", action="store_true", help="only re-check the written WAVs against their sidecars")
    ap.add_argument("--no-denoise", action="store_true", help="skip the spectral bed subtraction")
    ap.add_argument("--skip-flagged", action="store_true", help="treat a 'flagged' voice result like 'voice' (skip)")
    ap.add_argument("--prune", action="store_true", help="delete outputs whose id is no longer in the manifest")
    args = ap.parse_args()

    man = json.load(open(args.manifest))
    if isinstance(man, list):
        man = {"clips": man}
    src = man["source"]
    global FPS
    FPS = float(src.get("fps") or 25)
    out_arg = args.out or man.get("out")
    if not out_arg:
        raise SystemExit("give --out or an \"out\" folder in the manifest")
    out_abs = os.path.abspath(out_arg if os.path.isabs(out_arg) else os.path.join(ROOT, out_arg))
    rel_out = os.path.relpath(out_abs, ROOT).replace(os.sep, "/")
    parts = rel_out.split("/")
    # the path a storyboard or staticFile() uses: project-relative for a project folder, public/-relative under public/
    prefix = "/".join(parts[2:]) if parts[0] == "video-projects" else "/".join(parts[1:]) if parts[0] == "public" else rel_out
    cfg = {"fade_ms": 10.0, "peak_dbfs": -1.0, "word_pad_s": 0.02, "loop_xfade_ms": 40.0, "public_prefix": prefix}
    cfg.update(man.get("defaults", {}))
    ids = [c["id"] for c in man["clips"]]
    if len(set(ids)) != len(ids):
        raise SystemExit("duplicate ids in the manifest")
    out_dir = out_abs

    if args.verify:
        present = [i for i in ids if os.path.exists(os.path.join(out_dir, i + ".json"))]
        rows = verify(out_dir, present)
        for r in rows:
            print(f"{r['id']:28s} {'ok ' if r['ok'] else 'FAIL'} Δpeak {r.get('delta_ms', float('nan')):.3f} ms {r['why']}")
        sys.exit(0 if all(r["ok"] for r in rows) else 1)

    here = lambda p: p if os.path.isabs(p) else os.path.join(ROOT, p)  # noqa: E731
    src_wav = here(src["wav"])
    if not os.path.exists(src_wav):
        if not src.get("video"):
            raise SystemExit(f"no WAV {src['wav']} and no source.video to decode it from")
        os.makedirs(os.path.dirname(src_wav), exist_ok=True)
        import subprocess
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", here(src["video"]), "-vn", "-ac", "2", "-ar", str(SR),
                        "-c:a", "pcm_s16le", src_wav], check=True)
        print(f"decoded {rel(src_wav)}")
    words = json.load(open(here(src["words"]))) if src.get("words") and os.path.exists(here(src["words"])) else []
    if not words:
        print("warning: no transcript words: clips with centre-only speech-band energy are only FLAGGED, listen to them")
    only = {s for s in args.only.split(",") if s}
    if only - set(ids):
        raise SystemExit(f"unknown ids: {sorted(only - set(ids))}")
    if not args.dry_run:
        os.makedirs(out_dir, exist_ok=True)

    rejected_auto = []
    for clip in man["clips"]:
        if only and clip["id"] not in only:
            continue
        for k in ("id", "t0", "t1", "kind", "notes"):
            if k not in clip:
                raise SystemExit(f"clip {clip.get('id')}: missing {k}")
        res = process_clip(clip, src_wav, words, cfg, args.no_denoise)
        vc = res["voice"]
        tag = f"{clip['id']:26s} {clip['t0']:8.3f}-{clip['t1']:8.3f} voice={vc['verdict']:8s} floor {res['floor_db']:+6.1f} dB"
        skip = vc["verdict"] == "voice" or (vc["verdict"] == "flagged" and args.skip_flagged)
        if skip:
            rejected_auto.append({"id": clip["id"], "t0": clip["t0"], "t1": clip["t1"],
                                  "reason": f"skipped by the voice test: {vc['detail']}"})
            print(tag, "-> SKIPPED")
            if not args.dry_run:
                for ext in (".wav", ".json"):
                    p = os.path.join(out_dir, clip["id"] + ext)
                    if os.path.exists(p):
                        os.remove(p)
            continue
        if args.dry_run:
            print(tag, f"src peak {res['src_peak_dbfs']:+.1f} dBFS", "(dry run)")
            continue
        pcm = write_wav16(os.path.join(out_dir, clip["id"] + ".wav"), res["y"])
        meta = sidecar(clip, res, pcm, cfg, src)
        with open(os.path.join(out_dir, clip["id"] + ".json"), "w") as fh:
            json.dump(meta, fh, indent=1, ensure_ascii=False)
        print(tag, f"dur {meta['duration_s']:.3f}s peak {meta['peak_s']:.4f}s (f{meta['source']['peak_frame']:.1f}) "
                   f"gain {meta['suggested_gain_db']:+.1f} dB")
    if args.dry_run:
        return

    # index of every manifest clip present on disk (a partial --only run keeps the others)
    metas = {}
    for cid in ids:
        jp = os.path.join(out_dir, cid + ".json")
        if os.path.exists(jp) and os.path.exists(os.path.join(out_dir, cid + ".wav")):
            metas[cid] = json.load(open(jp))
    stale = sorted({f.rsplit(".", 1)[0] for f in os.listdir(out_dir) if f.endswith((".wav", ".json"))}
                   - set(ids) - {"manifest"})
    for s in stale:
        if args.prune:
            for ext in (".wav", ".json"):
                p = os.path.join(out_dir, s + ext)
                if os.path.exists(p):
                    os.remove(p)
            print("pruned", s)
        else:
            print(f"warning: {s}.* is not in the manifest (use --prune)")
    with open(os.path.join(out_dir, "manifest.json"), "w") as fh:
        json.dump(metas, fh, indent=1, ensure_ascii=False)
    ver = verify(out_dir, list(metas))
    run = {
        "date": datetime.date.today().isoformat(),
        "command": "tools/py tools/audio/extract_sfx.py" + (" " + " ".join(sys.argv[1:]) if sys.argv[1:] else ""),
        "python": platform.python_version(), "numpy": np.__version__,
        "video_sha256": sha256(here(src["video"])) if src.get("video") and os.path.exists(here(src["video"])) else "",
        "video_bytes": os.path.getsize(here(src["video"])) if src.get("video") and os.path.exists(here(src["video"])) else 0,
        "wav_sha256": sha256(src_wav),
        "words_sha256": sha256(here(src["words"])) if src.get("words") and os.path.exists(here(src["words"])) else "",
        "tool_sha256": sha256(os.path.abspath(__file__)), "manifest_sha256": sha256(args.manifest),
        "manifest": rel(os.path.abspath(args.manifest)),
    }
    write_docs(out_dir, man, metas, rejected_auto, ver, run)
    bad = [r for r in ver if not r["ok"]]
    print(f"{len(metas)} clips in {rel(out_dir)}; verification {len(ver) - len(bad)}/{len(ver)} pass"
          + ("" if not bad else ": " + ", ".join(r["id"] for r in bad)))
    if bad:
        sys.exit(1)


if __name__ == "__main__":
    main()
