#!/usr/bin/env python3
"""Audio-visual synchronisation statistics for an analysed video (numpy only).

  python3 -I tools/audio/av_sync.py <id> [--speakers FILE] [--reveals FILE] [--music FILE] [--colour]
                                         [--trials 2000] [--seed 7] [--out FILE]

Inputs (from the existing pipeline; frame numbers are global video frames, index 0):
  analysis/metrics/<id>.csv, <id>_shots.json   per-frame visual metrics, hard cuts, soft transitions
  analysis/audio/<id>_words.json               word timings (tools/audio/transcribe.py, faster-whisper)
  analysis/audio/<id>_features.csv             per-frame rms/low/mid/high dB, onset (audio_features.py)
  analysis/audio/<id>_rhythm.json              global tempo + beat grid (audio_features.py), for comparison
  analysis/audio/<id>_full_stereo48k.wav       stereo PCM; when missing, the source video is decoded by ffmpeg
  --speakers FILE  manual speaker spans {"spans":[{"t0","t1","speaker"}]}, speaker = narrator|interview|archival|sung
                   (words outside every span = narrator). Without it speakers are guessed from the voice band limit.
  --reveals FILE   on-screen text reveals {"reveals":[{"frame","text","whisper_t","acoustic_t"?,"kind"}]}
  --music FILE     verified music-excerpt boundaries {"boundaries":[{"t","type":"start|stop|change","what"}]}; used instead
                   of the automatic ones for alignment, excerpts and the tempo map (automatic recall/precision reported)
  --colour         also read analysis/frames/<id>/*.jpg once for a saturated-pixel area series (audio-reactive check)
Writes analysis/audio/<id>_sync.json and prints a summary. Audio is streamed in ~2.7 s blocks (low memory).

Method
  Audio front end (100 Hz hops, Hann window of 2^ceil(log2(40 ms))): power of mid M=(L+R)/2 and side S=(L-R)/2
  in 24 log bands 40 Hz-16 kHz, BS.1770-4 K-weighted mean square per hop (exact biquads as a 4096-tap FIR).
  Levels are dB re the 99th percentile of 40 ms frame power ("dB re p99"); loudness is LUFS.
  Speech: whisper words; onsets refined to acoustic onsets (rise >= 8 dB of the 250-8000 Hz M level; phrase-initial
  words pick the best rise within +-0.6 s weighted by preceding silence and centre excess M-S, other words a monotonic
  DP within +-0.5 s with a syllable-count prior). Phrase onset = first word after >= 250 ms pause or a speaker change.
  Stressed word = narrator content word (not in FUNCTION_WORDS) with z(log duration) + z(peak level re phrase) >= 0.
  Speaker turns: --speakers spans, else bed-subtracted voice power 7-12 kHz / 1-4 kHz >= -16 dB = narrator (full band).
  Speech frames = phrase spans (words joined across pauses < 250 ms). Silence = total M+S level < -35 dB re p99 for
  >= 4 frames (acoustic only). Music present = side level > -50 dB or M sub-bass (< 110 Hz) > -28 dB, or non-silent
  sound inside a >= 1 s non-speech stretch; 0.5 s median filter, gaps < 0.5 s closed, runs < 0.5 s dropped.
  Frame classes: silence / narration / narration+music / archival voice (any non-narrator speech) / music-only.
  Music boundaries: presence on/off + side-band spectral-shape novelty (+-2 s, > median + 3 MAD), or --music.
  Tempo per excerpt: autocorrelation of a voice-free onset envelope (side bands + M < 210 Hz everywhere, full M only
  where nobody speaks), 60-180 BPM, pulse salience = ACF at 1..4 x the beat lag, log-Gaussian prior at 100 BPM;
  beats = Ellis DP where ACF >= 0.2; downbeat phase = most low-band flux. Music onsets = envelope peaks (tempo-free).
  SFX candidates = top-3 % broadband (>= 50 % of bands rising) onsets outside speech spans and >= 60 ms from beats.
  Visual events: hard cuts (fragments <= 6 f apart merged), soft-transition starts, visual onsets (burst detector, see
  visual_onsets(): robust to on-twos holds and to continuously moving footage), coherent camera-move starts.
  Alignment: nearest audio event to each visual event, d = visual - audio in frames (negative = picture leads);
  share within +-1/2/3 f; nulls = circular shift of the visual train (offset >= 2 s) and +-1 s local jitter, p-values
  = (1 + #null >= observed) / (1 + trials). Window tests: share of cuts with an audio event 0-12 f after/before.
  Mix: per-phrase ducking (music indicator = side level, or sub-bass for mono music, in the phrase vs music-only
  frames within 2 s), event-locked traces at phrase onsets/ends, fades, dip-to-black timing of silence gaps.
  Audio-reactive: per-shot z-scored series (raw, and 1 s high-passed = fast coupling only), cross-correlation over
  lags -25..+25 f, family-wise p from circular-shift surrogates of the visual series (max |r| over all lags).
"""
import argparse
import csv
import json
import math
import os
import re
import struct
import subprocess
import sys

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "analysis"))
from sources_registry import load_sources  # noqa: E402  (sources.json + the git-ignored sources.local.json)
HOP_HZ = 100            # audio envelope rate
NB = 24                 # log bands, 40 Hz .. 16 kHz
BLOCK = 1 << 17         # streamed audio block (samples)
SIL_DB, SIL_MIN = -35.0, 4
MUSIC_S_DB, MUSIC_SUB_DB = -50.0, -28.0
PAUSE_PHRASE = 0.25
JITTER = 25             # +-frames for the local-jitter null
FUNCTION_WORDS = set("""a an the and or but nor so yet for of in on at to from by with as into onto upon about over under
after before than then that this these those there here it its it's i i'm me my we we're our you your you're he she him her
his hers they them their they're is are was were be been being am do does did have has had will would can could shall should
may might must not no if when while who whom which what what's where why how all any some such very just also too only
up out off down one s like that's let's don't she's he's we've i've you've they've isn't wasn't aren't weren't didn't
doesn't can't won't""".split())
CLASSES = ["silence", "narration", "narration+music", "archival voice", "music-only"]


# ----------------------------------------------------------------------------------------------------------- I/O
def load_csv(path):
    rows = list(csv.DictReader(open(path)))
    return {k: np.array([float(r[k]) for r in rows]) for k in rows[0]}


def wav_header(path):
    with open(path, "rb") as fh:
        if fh.read(4) != b"RIFF":
            raise ValueError("not RIFF")
        fh.read(4)
        if fh.read(4) != b"WAVE":
            raise ValueError("not WAVE")
        fmt = None
        while True:
            hdr = fh.read(8)
            if len(hdr) < 8:
                raise ValueError("no data chunk")
            cid, size = struct.unpack("<4sI", hdr)
            if cid == b"fmt ":
                d = fh.read(size + (size & 1))
                tag, ch, sr, _, _, bits = struct.unpack("<HHIIHH", d[:16])
                if tag == 0xFFFE and size >= 26:
                    tag = struct.unpack("<H", d[24:26])[0]
                fmt = (tag, ch, sr, bits)
            elif cid == b"data":
                return fmt, fh.tell(), size
            else:
                fh.seek(size + (size & 1), 1)


def wav_blocks(path):
    (tag, ch, sr, bits), off, size = wav_header(path)
    bps = bits // 8
    total = size // (bps * ch)
    dt = {(3, 32): "<f4", (3, 64): "<f8", (1, 16): "<i2", (1, 32): "<i4"}[(tag, bits)]
    scale = {"<f4": 1.0, "<f8": 1.0, "<i2": 32768.0, "<i4": 2.0 ** 31}[dt]
    with open(path, "rb") as fh:
        fh.seek(off)
        done = 0
        while done < total:
            n = min(BLOCK, total - done)
            x = np.frombuffer(fh.read(n * bps * ch), dt).astype(np.float32).reshape(-1, ch) / np.float32(scale)
            yield np.repeat(x, 2, axis=1) if ch == 1 else x[:, :2]
            done += n


def ffmpeg_blocks(src, sr):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vn", "-ac", "2", "-ar", str(sr), "-f", "s16le", "-"],
                         stdout=subprocess.PIPE)
    while True:
        raw = p.stdout.read(BLOCK * 4)
        if not raw:
            break
        yield np.frombuffer(raw[:len(raw) // 4 * 4], "<i2").astype(np.float32).reshape(-1, 2) / 32768.0
    p.wait()


def jsonable(o):
    if isinstance(o, dict):
        return {str(k): jsonable(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [jsonable(v) for v in o]
    if isinstance(o, np.ndarray):
        return [jsonable(v) for v in o.tolist()]
    if isinstance(o, (np.integer,)):
        return int(o)
    if isinstance(o, (np.floating, float)):
        v = float(o)
        return None if not math.isfinite(v) else round(v, 4)
    if isinstance(o, np.bool_):
        return bool(o)
    return o


# -------------------------------------------------------------------------------------------- audio front end
def k_weighting_ir(sr, n=4096):
    """ITU-R BS.1770-4 K-weighting (shelf + RLB high-pass) for any rate, as an impulse response."""
    G, f0, Q = 3.999843853973347, 1681.974450955533, 0.7071752369554196
    K = math.tan(math.pi * f0 / sr)
    Vh, a0 = 10 ** (G / 20), 1 + K / Q + K * K
    Vb = Vh ** 0.4996667741545416
    b1 = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0]
    a1 = [1.0, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
    f0, Q = 38.13547087602444, 0.5003270373238773
    K = math.tan(math.pi * f0 / sr)
    a0 = 1 + K / Q + K * K
    b2, a2 = [1.0, -2.0, 1.0], [1.0, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]

    def biquad(x, b, a):
        y, x1, x2, y1, y2 = [], 0.0, 0.0, 0.0, 0.0
        for xi in x:
            yi = b[0] * xi + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2
            y.append(yi)
            x2, x1, y2, y1 = x1, xi, y1, yi
        return y
    imp = [1.0] + [0.0] * (n - 1)
    return np.array(biquad(biquad(imp, b1, a1), b2, a2))


def analyse_audio(blocks, sr):
    """Stream stereo blocks -> 100 Hz M/S band powers, full-band M/S power, K-weighted mean squares per hop."""
    hop = int(round(sr / HOP_HZ))
    nfft = 1 << int(math.ceil(math.log2(0.04 * sr)))
    win = np.hanning(nfft).astype(np.float32)
    freqs = np.fft.rfftfreq(nfft, 1 / sr)
    edges = np.geomspace(40.0, min(16000.0, 0.45 * sr), NB + 1)
    bidx = np.digitize(freqs, edges) - 1
    bmat = np.zeros((len(freqs), NB), np.float32)
    ok = (bidx >= 0) & (bidx < NB)
    bmat[np.where(ok)[0], bidx[ok]] = 1.0
    ir = k_weighting_ir(sr)
    lir = len(ir)
    pad = nfft // 2 - hop // 2
    buf, b0, h_next = np.zeros((pad, 2), np.float32), -pad, 0
    khist = np.zeros((lir - 1, 2))
    out_mb, out_sb, out_mf, out_sf = [], [], [], []
    ksum = []
    nsamp, peak = 0, 0.0

    def spectra(h0, h1):
        starts = np.arange(h0, h1) * hop - pad - b0
        idx = starts[:, None] + np.arange(nfft)[None, :]
        fr = buf[idx]  # (k, nfft, 2)
        m = (fr[..., 0] + fr[..., 1]) * 0.5 * win
        s = (fr[..., 0] - fr[..., 1]) * 0.5 * win
        pm = np.abs(np.fft.rfft(m, axis=1)) ** 2
        ps = np.abs(np.fft.rfft(s, axis=1)) ** 2
        out_mb.append(pm @ bmat)
        out_sb.append(ps @ bmat)
        out_mf.append(pm.sum(1))
        out_sf.append(ps.sum(1))

    for x in blocks:
        n = len(x)
        if n == 0:
            continue
        peak = max(peak, float(np.abs(x).max()))
        # K-weighting by overlap-save FIR
        xx = np.concatenate([khist, x.astype(np.float64)])
        nc = 1 << int(math.ceil(math.log2(len(xx) + lir - 1)))
        y = np.fft.irfft(np.fft.rfft(xx, nc, axis=0) * np.fft.rfft(ir, nc)[:, None], nc, axis=0)[lir - 1:lir - 1 + n]
        khist = xx[-(lir - 1):]
        hidx = (nsamp + np.arange(n)) // hop
        h0 = hidx[0]
        part = np.stack([np.bincount(hidx - h0, weights=y[:, c] ** 2) for c in range(2)], 1)
        if ksum and len(ksum) > h0:
            ksum[h0] = ksum[h0] + part[0]
            part = part[1:]
        ksum.extend(list(part))
        nsamp += n
        # spectral hops
        buf = np.concatenate([buf, x])
        h_max = (b0 + len(buf) - nfft + pad) // hop
        if h_max >= h_next:
            spectra(h_next, h_max + 1)
            h_next = h_max + 1
            drop = h_next * hop - pad - b0
            buf, b0 = buf[drop:], b0 + drop
    n_hops = int(math.ceil(nsamp / hop))
    buf = np.concatenate([buf, np.zeros((nfft, 2), np.float32)])
    if n_hops > h_next:
        spectra(h_next, n_hops)
    ks = np.array(ksum[:n_hops]) / hop
    return {"sr": sr, "hop": hop, "nfft": nfft, "edges": edges, "n_hops": n_hops, "duration": nsamp / sr,
            "MB": np.concatenate(out_mb)[:n_hops], "SB": np.concatenate(out_sb)[:n_hops],
            "MF": np.concatenate(out_mf)[:n_hops], "SF": np.concatenate(out_sf)[:n_hops],
            "kL": ks[:, 0], "kR": ks[:, 1], "peak": peak}


def loudness(kL, kR, hop_s):
    z = kL + kR
    c = np.concatenate([[0.0], np.cumsum(z)])

    def blocks(dur, step):
        nb, st = int(round(dur / hop_s)), int(round(step / hop_s))
        i = np.arange(0, len(z) - nb + 1, st)
        return (c[i + nb] - c[i]) / nb
    lk = lambda e: -0.691 + 10 * np.log10(np.maximum(e, 1e-20))  # noqa: E731
    m = blocks(0.4, 0.1)
    g1 = m[lk(m) > -70]
    rel = lk(g1.mean()) - 10
    integ = float(lk(g1[lk(g1) > rel].mean()))
    st = blocks(3.0, 0.1)
    s1 = st[lk(st) > -70]
    s2 = s1[lk(s1) > lk(s1.mean()) - 20]
    ls = lk(s2)
    return {"integrated_lufs": integ, "lra_lu": float(np.percentile(ls, 95) - np.percentile(ls, 10)),
            "short_term_p10_p95": [float(np.percentile(ls, 10)), float(np.percentile(ls, 95))],
            "momentary_max_lufs": float(lk(m).max()), "short_term_max_lufs": float(lk(st).max())}


def per_frame(a, x, n_frames, fps):
    fr = np.floor((np.arange(a["n_hops"]) + 0.5) * a["hop"] / a["sr"] * fps).astype(int)
    ok = fr < n_frames
    cnt = np.maximum(np.bincount(fr[ok], minlength=n_frames), 1)
    if x.ndim == 1:
        return np.bincount(fr[ok], weights=x[ok], minlength=n_frames)[:n_frames] / cnt[:n_frames]
    return np.stack([np.bincount(fr[ok], weights=x[ok, b], minlength=n_frames)[:n_frames] / cnt[:n_frames]
                     for b in range(x.shape[1])], 1)


def db(x, ref=1.0):
    return 10 * np.log10(np.maximum(np.asarray(x, float) / ref, 1e-12))


def smooth(x, k):
    if k <= 1:
        return x
    return np.convolve(np.pad(x, (k // 2, k - 1 - k // 2), mode="edge"), np.ones(k) / k, mode="valid")


def runs(mask):
    """[(start, end_exclusive)] of True runs"""
    m = np.concatenate([[False], np.asarray(mask, bool), [False]])
    d = np.diff(m.astype(int))
    return list(zip(np.where(d == 1)[0], np.where(d == -1)[0]))


def median_filter(x, k):
    pad = np.pad(x.astype(float), (k // 2, k // 2), mode="edge")
    return np.median(np.lib.stride_tricks.sliding_window_view(pad, k), axis=1)


# ---------------------------------------------------------------------------------------------------- speech
def syllables(word):
    s = re.sub(r"[^a-z]", "", word.lower())
    if not s:
        return 4 if re.search(r"\d", word) else 1
    g = re.findall(r"[aeiouy]+", s)
    k = len(g) - (1 if s.endswith("e") and len(g) > 1 and not s.endswith("le") else 0)
    return max(1, k)


def speaker_labels(words, spans, a, edges):
    """manual spans if given; automatic guess = voice band limit (bed-subtracted 7-12 kHz / 1-4 kHz power)."""
    n = len(words)
    MB = a["MB"]
    isw = np.zeros(a["n_hops"], bool)
    for w in words:
        isw[int(w["start"] * HOP_HZ):int(w["end"] * HOP_HZ) + 1] = True
    lo = (edges[:-1] >= 950) & (edges[1:] <= 4300)
    hi = (edges[:-1] >= 6800) & (edges[1:] <= 12600)
    groups, cur = [], [0]
    for i in range(1, n):
        if words[i]["start"] - words[i - 1]["end"] >= PAUSE_PHRASE:
            groups.append(cur)
            cur = []
        cur.append(i)
    groups.append(cur)
    auto, bl = ["narrator"] * n, [None] * n
    for g in groups:
        h0, h1 = int(words[g[0]]["start"] * HOP_HZ), int(words[g[-1]]["end"] * HOP_HZ) + 1
        fr = np.arange(h0, min(h1, a["n_hops"]))
        fr = fr[isw[fr]]
        if len(fr) < 5:
            continue
        ctx = np.r_[max(0, h0 - 150):h0, h1:min(a["n_hops"], h1 + 150)]
        pz = ctx[~isw[ctx]]
        bed = np.median(MB[pz], 0) if len(pz) >= 10 else np.percentile(MB[fr], 10, axis=0)
        v = np.maximum(MB[fr].mean(0) - bed, 0)
        r = float(db(v[hi].sum() + 1e-30) - db(v[lo].sum() + 1e-30))
        for i in g:
            bl[i] = r
            auto[i] = "narrator" if r >= -16 else "other"
    if spans:
        lab = []
        for w in words:
            mid = 0.5 * (w["start"] + w["end"])
            sp = [s["speaker"] for s in spans if s["t0"] <= mid < s["t1"]]
            lab.append(sp[0] if sp else "narrator")
    else:
        lab = auto
    return lab, auto, bl


def voice_env(a):
    e = a["edges"]
    tiny = 1e-10 * np.percentile(a["MF"], 99)
    sel = (e[:-1] >= 230) & (e[1:] <= 8200)
    v = 10 * np.log10(a["MB"][:, sel].sum(1) + tiny)
    s = 10 * np.log10(a["SB"][:, sel].sum(1) + tiny)
    v = smooth(v, 3)
    c = smooth(v - np.maximum(s, v - 60), 3)
    return v, c


def onset_candidates(v, c, W=8):
    n = len(v)
    sw = np.lib.stride_tricks.sliding_window_view
    prev_min = sw(np.pad(v, (W, 0), mode="edge"), W)[:n].min(1)
    next_max = sw(np.pad(v, (0, W), mode="edge"), W)[:n].max(1)
    rise = next_max - prev_min
    half = prev_min + 0.5 * rise
    idx = np.where((v[:-1] < half[1:]) & (v[1:] >= half[1:]) & (rise[1:] >= 8))[0] + 1
    c_after = sw(np.pad(c, (0, W), mode="edge"), W)[:n].max(1)
    quiet = np.zeros(len(idx), int)
    for k, i in enumerate(idx):
        pk = v[i:i + 10].max()
        j = i - 1
        while j > 0 and v[j] < pk - 12 and i - j < 100:
            j -= 1
        quiet[k] = i - 1 - j
    return {"t": idx / HOP_HZ, "rise": rise[idx], "c_after": c_after[idx], "quiet": quiet}


def refine_onsets(words, labels, cand):
    """acoustic onsets: phrase-initial words = best scored rise within +-0.6 s; others = monotonic DP within +-0.5 s."""
    n = len(words)
    ws = np.array([w["start"] for w in words])
    we = np.array([w["end"] for w in words])
    ct, rv, ca, qr = cand["t"], cand["rise"], cand["c_after"], cand["quiet"]
    phrase = np.r_[True, ((ws[1:] - we[:-1]) >= PAUSE_PHRASE) |
                   (np.array(labels[1:]) != np.array(labels[:-1]))]
    anchor = [None] * n
    for i in np.where(phrase)[0]:
        j = np.where(np.abs(ct - ws[i]) <= 0.6)[0]
        if not len(j):
            continue
        cw = 0.7 if labels[i] == "narrator" else 0.0
        score = (np.minimum(rv[j], 30) + cw * np.minimum(ca[j], 30) + np.minimum(qr[j], 40) / 2
                 - 30 * np.abs(ct[j] - ws[i]) - 10 * (qr[j] < 8))
        k = j[int(np.argmax(score))]
        if score.max() > 10:
            anchor[i] = k
    SIG, WIN, NONE = 0.2, 0.5, 2.5
    opts = []
    for i in range(n):
        if anchor[i] is not None:
            opts.append([(anchor[i], ct[anchor[i]], 0.0)])
            continue
        o = [(-1, ws[i], NONE)]
        for j in np.where(np.abs(ct - ws[i]) <= WIN)[0]:
            o.append((j, ct[j], ((ct[j] - ws[i]) / SIG) ** 2 - min(rv[j], 30) / 10))
        opts.append(o)
    best = [np.array([o[2] for o in opts[0]])]
    back = [np.zeros(len(opts[0]), int)]
    for i in range(1, n):
        b, bk = np.full(len(opts[i]), 1e18), np.zeros(len(opts[i]), int)
        for a_, (j, t, cst) in enumerate(opts[i]):
            for p, (j0, t0, _) in enumerate(opts[i - 1]):
                if t0 > t - 0.05 and not (j == -1 or j0 == -1):
                    continue
                if (j == -1 or j0 == -1) and t0 >= t:
                    continue
                pen = 0.6 * abs(j - j0 - 1 - (syllables(words[i - 1]["word"]) - 1)) if (j >= 0 and j0 >= 0) else 0
                val = best[i - 1][p] + cst + pen
                if val < b[a_]:
                    b[a_], bk[a_] = val, p
        if not np.isfinite(b).any() or b.min() >= 1e18:  # infeasible: fall back to whisper for this word
            opts[i] = [(-1, ws[i], NONE)]
            b = np.array([best[i - 1].min() + NONE])
            bk = np.array([int(np.argmin(best[i - 1]))])
        best.append(b)
        back.append(bk)
    k = int(np.argmin(best[-1]))
    out = np.zeros(n)
    snapped = np.zeros(n, bool)
    for i in range(n - 1, -1, -1):
        j, t, _ = opts[i][k]
        out[i], snapped[i] = t, j >= 0
        k = back[i][k]
    return out, snapped, phrase


def stressed_words(words, labels, onsets, v, phrase):
    n = len(words)
    content = np.array([re.sub(r"[^a-z0-9']", "", w["word"].lower()) not in FUNCTION_WORDS for w in words])
    pid = np.cumsum(phrase) - 1
    dur = np.array([max(0.05, min(1.5, (onsets[i + 1] if i + 1 < n and pid[i + 1] == pid[i] else words[i]["end"]) - onsets[i]))
                    for i in range(n)])
    peak = np.array([v[int(onsets[i] * HOP_HZ):max(int(onsets[i] * HOP_HZ) + 2, int(words[i]["end"] * HOP_HZ) + 1)].max()
                     for i in range(n)])
    rel = peak.copy()
    for p in np.unique(pid):
        m = pid == p
        rel[m] = peak[m] - np.median(peak[m])
    sel = content & (np.array(labels) == "narrator")
    z = lambda x: (x - x[sel].mean()) / (x[sel].std() + 1e-9)  # noqa: E731
    score = z(np.log(dur)) + z(rel)
    return sel & (score >= 0), content, score


# ----------------------------------------------------------------------------------------------------- music
def music_envelope(a, speech_hop):
    """voice-free onset envelope (100 Hz): side bands + M < 200 Hz everywhere, full M where nobody speaks."""
    e = a["edges"]
    MB, SB = a["MB"], a["SB"]
    def lflux(X):
        L = np.log1p(100 * X / (np.percentile(X, 99, axis=0) + 1e-20))
        return np.maximum(np.diff(L, axis=0, prepend=L[:1]), 0)
    fm = lflux(MB)
    fs = lflux(SB)
    low = e[1:] <= 210
    env = fs.sum(1) + fm[:, low].sum(1) + (~speech_hop) * fm[:, ~low].sum(1)
    k = HOP_HZ | 1
    tr = median_filter(env, k)
    env = np.maximum(env - tr, 0)
    return env / (np.percentile(env, 99.5) + 1e-9)


def tempo(env, lo=60, hi=180, prior=100.0):
    x = env - env.mean()
    if len(x) < 3 * HOP_HZ or not np.any(x):
        return None
    nf = 1 << int(math.ceil(math.log2(2 * len(x))))
    F = np.fft.rfft(x, nf)
    ac = np.fft.irfft(F * np.conj(F), nf)[:len(x)]
    ac = ac / (ac[0] + 1e-12)
    bpm = np.arange(lo, hi + 0.25, 0.5)
    lag = 60.0 * HOP_HZ / bpm
    val = np.interp(lag, np.arange(len(ac)), ac)
    # pulse salience: the beat lag and its multiples (bar level) should all correlate
    sal = sum(np.interp(k * lag, np.arange(len(ac)), ac, right=0) / k for k in (1, 2, 3, 4)) / (1 + 1 / 2 + 1 / 3 + 1 / 4)
    w = np.exp(-0.5 * (np.log2(bpm / prior)) ** 2)
    s = sal * w
    i = int(np.argmax(s))
    alt = []
    for j in np.argsort(s)[::-1]:
        if all(abs(bpm[j] - b) > 6 for b in [bpm[i]] + [x[0] for x in alt]):
            alt.append((float(bpm[j]), float(val[j])))
        if len(alt) == 2:
            break
    return {"bpm": float(bpm[i]), "conf": float(val[i]), "salience": float(sal[i]),
            "alt": [{"bpm": b, "acf": v} for b, v in alt]}


def beat_track(env, bpm, tightness=100.0):
    period = 60.0 * HOP_HZ / bpm
    n = len(env)
    score = env.astype(float).copy()
    back = -np.ones(n, int)
    offs = np.arange(-int(round(2 * period)), -int(round(period / 2)) + 1)
    pen = -tightness * np.log(-offs / period) ** 2
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
    tail = max(0, n - int(period))
    i = tail + int(np.argmax(score[tail:]))
    out = []
    while i >= 0:
        out.append(i)
        i = back[i]
    return np.array(out[::-1])


# ---------------------------------------------------------------------------------------------------- visual
def merge_cuts(cuts, gap=6):
    """chains of cuts <= gap frames apart (strobes, stepped card slides) count once, at their first frame"""
    out, prev = [], None
    for c in sorted(cuts):
        if prev is None or c - prev > gap:
            out.append(c)
        prev = c
    return out


def visual_onsets(x, shots, cuts, soft, look=12, refractory=6):
    """Burst onsets of visual change, robust to stepped animation and to footage.

    Per shot: noise floor q0 = max(0.05, p20(mad_lo)) (held frames of twos/threes animation sit near 0);
    'change frames' = mad_lo > max(3 q0, 0.15). Baseline B_t = median mad_lo of the change frames among the previous
    `look` frames (holds are ignored, so twos/threes stepping does not lower it; continuous footage or camera drift
    raises it), or q0 if there are fewer than 2. Onset at t if mad_lo_t >= max(0.3, 3 B_t, 6 q0), not within 3 f of a
    cut or inside a soft transition, and >= `refractory` frames after the previous onset."""
    n = len(x)
    ev = []
    excl = np.zeros(n, bool)
    for c in cuts:
        excl[max(0, c - 3):c + 4] = True
    for s in soft:
        excl[max(0, s["start"] - 2):s["end"] + 3] = True
    for sh in shots:
        a, b = sh["start"], sh["end"] + 1
        if b - a < 6:
            continue
        q0 = max(0.05, float(np.percentile(x[a:b], 20)))
        chg = x > max(3 * q0, 0.15)
        last = -10 ** 9
        for t in range(a + 2, b):
            if excl[t] or t - last < refractory:
                continue
            lo = max(a, t - look)
            prev = x[lo:t][chg[lo:t]]
            base = float(np.median(prev)) if len(prev) >= 2 else q0
            if x[t] >= max(0.3, 3 * base, 6 * q0):
                ev.append(t)
                last = t
    return np.array(sorted(ev), int)


def camera_moves(m, cuts, conf_min=0.5, vmax=60.0):
    """Global camera moves from per-frame tx/ty/zoom (frame_metrics.py). Speed v = |t| + |ln zoom| * 1101 px
    (corner displacement at 1920x1080); frames with pc_conf < conf_min or v > vmax (cuts, flashes) count as 0.
    Core = 5-frame mean >= 1.2 px/f for >= 6 f, extended both ways to 10 % of the peak. Kept if path >= 40 px and the
    motion is coherent (net/path >= 0.6 for translation or |sum ln z| / sum |ln z| >= 0.6 for zoom), a cheap proxy
    for the 4-quadrant coherence test of analysis/quantitative.md, which needs the frames."""
    n = len(m["tx"])
    lz = np.log(np.maximum(m["zoom"], 1e-3))
    v = np.hypot(m["tx"], m["ty"]) + np.abs(lz) * 1101
    bad = (m["pc_conf"] < conf_min) | (v > vmax)
    for c in cuts:
        bad[max(0, c - 1):c + 2] = True
    v = np.where(bad, 0.0, v)
    tx, ty, lz = np.where(bad, 0, m["tx"]), np.where(bad, 0, m["ty"]), np.where(bad, 0, lz)
    vs = smooth(v, 5)
    cutset = set(cuts)
    moves = []
    for a, b in runs(vs >= 1.2):
        if b - a < 6:
            continue
        pk = vs[a:b].max()
        s = a
        while s > 0 and vs[s - 1] >= 0.1 * pk and s not in cutset:
            s -= 1
        e = b
        while e < n and vs[e] >= 0.1 * pk and e not in cutset:
            e += 1
        path = float(v[s:e].sum())
        tpath = float(np.hypot(tx[s:e], ty[s:e]).sum()) + 1e-9
        coh_t = float(np.hypot(tx[s:e].sum(), ty[s:e].sum()) / tpath)
        coh_z = float(abs(lz[s:e].sum()) / (np.abs(lz[s:e]).sum() + 1e-12))
        if path < 40 or max(coh_t, coh_z) < 0.6:
            continue
        if moves and s <= moves[-1]["end"]:
            moves[-1]["end"] = max(moves[-1]["end"], e)
            continue
        moves.append({"start": int(s), "end": int(e), "peak_px_f": float(pk), "path_px": path,
                      "net_px": float(np.hypot(tx[s:e].sum(), ty[s:e].sum())), "zoom_total": float(np.exp(lz[s:e].sum())),
                      "coherence": float(max(coh_t, coh_z))})
    return moves


# ------------------------------------------------------------------------------------------------- alignment
def nearest_d(V, A):
    """signed distance (frames) from each V to the nearest A"""
    A = np.sort(np.asarray(A, float))
    i = np.clip(np.searchsorted(A, V), 1, len(A) - 1)
    lo, hi = A[i - 1], A[i]
    return np.where(np.abs(V - lo) <= np.abs(V - hi), V - lo, V - hi)


def align(V, A, n, trials, rng, maxd=12):
    V = np.asarray(V, float)
    A = np.asarray(A, float)
    if len(V) < 3 or len(A) < 2:
        return None
    d = nearest_d(V, A)
    share = {k: float(np.mean(np.abs(d) <= k)) for k in (1, 2, 3)}
    near = d[np.abs(d) <= maxd]
    sh = rng.integers(2 * JITTER, n - 2 * JITTER, size=trials)
    Vc = (V[None, :] + sh[:, None]) % n
    dc = np.abs(nearest_d(Vc.ravel(), A)).reshape(trials, -1)
    Vj = np.clip(V[None, :] + rng.integers(-JITTER, JITTER + 1, size=(trials, len(V))), 0, n - 1)
    dj = np.abs(nearest_d(Vj.ravel(), A)).reshape(trials, -1)
    out = {"n_visual": int(len(V)), "n_audio": int(len(A)),
           "median_d": float(np.median(d)), "median_abs_d": float(np.median(np.abs(d))),
           "iqr_d": [float(np.percentile(d, 25)), float(np.percentile(d, 75))],
           "share_1": share[1], "share_2": share[2], "share_3": share[3],
           "n_within_12": int(len(near)),
           "lead_share": float(np.mean(near < 0)) if len(near) else None,
           "lag_share": float(np.mean(near > 0)) if len(near) else None,
           "median_d_within_12": float(np.median(near)) if len(near) else None}
    for name, dd in (("circ", dc), ("jit", dj)):
        for k in (1, 2, 3):
            null = np.mean(dd <= k, axis=1)
            out[f"null_{name}_share_{k}"] = float(null.mean())
            out[f"p_{name}_{k}"] = float((1 + np.sum(null >= share[k] - 1e-12)) / (1 + trials))
    out["enrichment_2"] = share[2] / max(out["null_circ_share_2"], 1e-9)
    return out


def rayleigh(phases):
    phases = np.asarray(phases)
    nn = len(phases)
    if nn < 3:
        return None
    R = np.abs(np.mean(np.exp(1j * phases)))
    Z = nn * R * R
    p = math.exp(-Z) * (1 + (2 * Z - Z * Z) / (4 * nn) - (24 * Z - 132 * Z ** 2 + 76 * Z ** 3 - 9 * Z ** 4) / (288 * nn * nn))
    return {"n": nn, "R": float(R), "p": float(min(1.0, max(0.0, p))),
            "mean_phase_beats": float((np.angle(np.mean(np.exp(1j * phases))) / (2 * np.pi)) % 1.0)}


# --------------------------------------------------------------------------------------------- audio-reactive
def zscore_by_shot(x, bounds, mask, hp=0):
    """z-score inside each shot (masked frames -> 0); hp > 0 first removes a centred hp-frame moving average
    (keeps only fast coupling: fades and slow co-trends drop out)."""
    out = np.zeros(len(x))
    for a, b in bounds:
        seg = slice(a, b)
        ok = mask[seg]
        if ok.sum() < 10:
            continue
        y = x[seg].astype(float)
        if hp and b - a > hp:
            y = y - smooth(y, hp)
        mu, sd = y[ok].mean(), y[ok].std()
        if sd > 1e-9:
            out[seg] = np.where(ok, (y - mu) / sd, 0.0)
    return out


def xcorr_lags(a, v, L=25):
    n = len(a)
    nf = 1 << int(math.ceil(math.log2(2 * n)))
    A, Vv = np.fft.rfft(a, nf), np.fft.rfft(v, nf)
    cc = np.fft.irfft(np.conj(A) * Vv, nf)
    den = math.sqrt(float((a * a).sum() * (v * v).sum())) + 1e-12
    lags = np.arange(-L, L + 1)
    return lags, np.array([cc[k % nf] for k in lags]) / den   # r(k) = sum a[t] v[t+k]: k > 0 => picture lags sound


def xcorr_test(a, v, trials, rng, L=25):
    lags, r = xcorr_lags(a, v, L)
    k = int(np.argmax(np.abs(r)))
    n = len(a)
    nf = 1 << int(math.ceil(math.log2(2 * n)))
    A = np.conj(np.fft.rfft(a, nf))
    den = math.sqrt(float((a * a).sum() * (v * v).sum())) + 1e-12
    mx = np.empty(trials)
    lo_s, hi_s = 2 * L, n - 2 * L
    if hi_s <= lo_s:
        lo_s, hi_s = 1, n
    for t, s in enumerate(rng.integers(lo_s, hi_s, size=trials)):
        cc = np.fft.irfft(A * np.fft.rfft(np.roll(v, s), nf), nf)
        mx[t] = np.abs(np.array([cc[q % nf] for q in lags])).max() / den
    return {"best_lag": int(lags[k]), "r": float(r[k]), "r_lag0": float(r[L]),
            "p_familywise": float((1 + np.sum(mx >= abs(r[k]))) / (1 + trials)), "null_max_abs_r_p95": float(np.percentile(mx, 95))}


def colour_series(vid, n):
    d = os.path.join(ROOT, "analysis", "frames", vid)
    from PIL import Image  # only needed with --colour
    out, prev = np.zeros(n), None
    chg = np.zeros(n)
    for f in range(n):
        p = os.path.join(d, f"{f:06d}.jpg")
        if not os.path.exists(p):
            break
        im = np.asarray(Image.open(p).convert("RGB"), np.int16)
        mx, mn = im.max(-1), im.min(-1)
        m = ((mx - mn) > 0.35 * mx) & (mx > 90)
        out[f] = m.mean()
        chg[f] = (m ^ prev).mean() if prev is not None else 0
        prev = m
    return out, chg


# ------------------------------------------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("id")
    ap.add_argument("--speakers")
    ap.add_argument("--reveals")
    ap.add_argument("--music", help="verified music boundaries {\"boundaries\":[{\"t\",\"type\":start|stop|change}]}")
    ap.add_argument("--colour", action="store_true")
    ap.add_argument("--trials", type=int, default=2000)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--out")
    args = ap.parse_args()
    vid = args.id
    rng = np.random.default_rng(args.seed)
    src = load_sources()[vid]
    fps = float(src["fps"])
    m = load_csv(os.path.join(ROOT, "analysis", "metrics", f"{vid}.csv"))
    shots_js = json.load(open(os.path.join(ROOT, "analysis", "metrics", f"{vid}_shots.json")))
    n = len(m["frame"])
    words = sorted([w for w in json.load(open(os.path.join(ROOT, "analysis", "audio", f"{vid}_words.json")))
                    if w["word"].strip()], key=lambda w: w["start"])
    feat_p = os.path.join(ROOT, "analysis", "audio", f"{vid}_features.csv")
    feat = load_csv(feat_p) if os.path.exists(feat_p) else None
    rh_p = os.path.join(ROOT, "analysis", "audio", f"{vid}_rhythm.json")
    rhythm = json.load(open(rh_p)) if os.path.exists(rh_p) else None
    spans = json.load(open(args.speakers))["spans"] if args.speakers else None

    # ---- audio front end
    wav = os.path.join(ROOT, "analysis", "audio", f"{vid}_full_stereo48k.wav")
    if os.path.exists(wav):
        sr = wav_header(wav)[0][2]
        a = analyse_audio(wav_blocks(wav), sr)
        audio_src = os.path.relpath(wav, ROOT)
    else:
        sr = 48000
        a = analyse_audio(ffmpeg_blocks(os.path.join(ROOT, src["path"]), sr), sr)
        audio_src = src["path"] + " (ffmpeg)"
    e = a["edges"]
    hop_s = a["hop"] / a["sr"]
    ld = loudness(a["kL"], a["kR"], hop_s)
    Mf = per_frame(a, a["MF"], n, fps)
    Sf = per_frame(a, a["SF"], n, fps)
    MBf = per_frame(a, a["MB"], n, fps)
    ref = float(np.percentile(Mf, 99))
    M_db, S_db = db(Mf, ref), db(Sf, ref)
    T_db = db(Mf + Sf, ref)
    sub_db = db(MBf[:, e[1:] <= 110].sum(1), ref)
    kz = per_frame(a, a["kL"] + a["kR"], n, fps)
    # momentary loudness per frame (400 ms centred)
    kh = a["kL"] + a["kR"]
    ck = np.concatenate([[0.0], np.cumsum(kh)])
    hc = ((np.arange(n) + 0.5) / fps / hop_s).astype(int)
    h0, h1 = np.clip(hc - 20, 0, a["n_hops"]), np.clip(hc + 20, 0, a["n_hops"])
    mom = -0.691 + 10 * np.log10(np.maximum((ck[h1] - ck[h0]) / np.maximum(h1 - h0, 1), 1e-20))

    # ---- speech
    labels, auto_lab, bl = speaker_labels(words, spans, a, e)
    v, c = voice_env(a)
    cand = onset_candidates(v, c)
    onsets, snapped, phrase = refine_onsets(words, labels, cand)
    ws = np.array([w["start"] for w in words])
    we = np.array([w["end"] for w in words])
    stressed, content, sscore = stressed_words(words, labels, onsets, v, phrase)
    is_narr = np.array([l == "narrator" for l in labels])
    # speech = phrase spans (words joined across pauses < PAUSE_PHRASE of the same speaker)
    speech_f = np.zeros(n, bool)
    narr_f = np.zeros(n, bool)
    other_f = np.zeros(n, bool)
    speech_hop = np.zeros(a["n_hops"], bool)
    segs = []  # [t0, t1, is_narrator, first_word_index]
    for i, w in enumerate(words):
        t0, t1 = onsets[i], max(w["end"], onsets[i] + 0.08)
        if segs and not phrase[i]:
            segs[-1][1] = max(segs[-1][1], t1)
        else:
            segs.append([t0, t1, bool(is_narr[i]), i])
    for t0, t1, nr, _ in segs:
        f0, f1 = int(math.floor(t0 * fps)), int(math.ceil(t1 * fps))
        speech_f[f0:f1] = True
        (narr_f if nr else other_f)[f0:f1] = True
        speech_hop[int(t0 * HOP_HZ):int(t1 * HOP_HZ)] = True

    # ---- music / silence / classes
    sil = np.zeros(n, bool)                 # acoustic only: a word over a true silence is a timing error
    for s0, s1 in runs(T_db < SIL_DB):
        if s1 - s0 >= SIL_MIN:
            sil[s0:s1] = True
    speech_f &= ~sil
    narr_f &= ~sil
    other_f &= ~sil
    quiet_long = np.zeros(n, bool)          # non-speech sound counts as music only >= 3 f inside >= 1 s stretches
    for s0, s1 in runs(~speech_f & ~sil):
        if s1 - s0 >= int(fps):
            quiet_long[s0 + 3:s1 - 3] = True
    music_raw = (S_db > MUSIC_S_DB) | (sub_db > MUSIC_SUB_DB) | (quiet_long & (T_db >= SIL_DB))
    music = median_filter(music_raw.astype(float), 13) > 0.5
    for s0, s1 in runs(~music):             # closing: fill non-silent gaps < 0.5 s, drop runs < 0.5 s
        if s1 - s0 < int(0.5 * fps) and s0 > 0 and s1 < n and not sil[s0:s1].any():
            music[s0:s1] = True
    for s0, s1 in runs(music):
        if s1 - s0 < int(0.5 * fps):
            music[s0:s1] = False
    music &= ~sil
    cls = np.full(n, "music-only", object)
    cls[sil] = "silence"
    cls[narr_f & ~music] = "narration"
    cls[narr_f & music] = "narration+music"
    cls[other_f] = "archival voice"
    cls[~speech_f & ~music & ~sil] = "silence"
    class_stats = {}
    for k in CLASSES:
        msk = cls == k
        if not msk.any():
            continue
        class_stats[k] = {"frames": int(msk.sum()), "seconds": float(msk.sum() / fps), "share": float(msk.mean()),
                          "M_db_median": float(np.median(M_db[msk])), "S_db_median": float(np.median(S_db[msk])),
                          "side_minus_mid_db": float(np.median(S_db[msk] - M_db[msk])),
                          "sub_db_median": float(np.median(sub_db[msk])),
                          "loudness_lufs": float(-0.691 + 10 * np.log10(np.mean(kz[msk]) + 1e-20)),
                          "momentary_lufs_median": float(np.median(mom[msk]))}
    # per-class stereo correlation from the hop powers: ICC ~ (M - S) / (M + S)
    for k in class_stats:
        msk = cls == k
        class_stats[k]["icc_from_ms"] = float(np.median((Mf[msk] - Sf[msk]) / (Mf[msk] + Sf[msk] + 1e-20)))

    # music excerpt segmentation: presence runs, split at timbre changes (gain-invariant side-band shape)
    SBf = per_frame(a, a["SB"], n, fps)
    selb = (e[:-1] >= 60) & (e[1:] <= 10500)
    X = db(SBf[:, selb] + 1e-30, ref)
    X = X - X.mean(1, keepdims=True)
    valid = (S_db > MUSIC_S_DB) & music
    Lw = int(2 * fps)
    nov = np.zeros(n)
    for t in range(Lw, n - Lw):
        l, r = valid[t - Lw:t], valid[t:t + Lw]
        if l.mean() < 0.5 or r.mean() < 0.5:
            continue
        nov[t] = np.sqrt(np.mean((X[t - Lw:t][l].mean(0) - X[t:t + Lw][r].mean(0)) ** 2))
    nz = nov[nov > 0]
    nthr = float(np.median(nz) + 3 * 1.4826 * np.median(np.abs(nz - np.median(nz)))) if len(nz) else 1e9
    changes = []
    for t in np.argsort(nov)[::-1]:
        if nov[t] < nthr:
            break
        if all(abs(t - u) >= 3 * fps for u in changes):
            changes.append(int(t))
    changes.sort()
    music_runs = [(s0, s1) for s0, s1 in runs(music) if s1 - s0 >= int(0.5 * fps)]
    starts = [s0 for s0, _ in music_runs if s0 > 0]
    stops = [s1 for _, s1 in music_runs if s1 < n]
    auto_bounds = sorted([{"frame": int(s), "type": "start"} for s in starts] + [{"frame": int(s), "type": "stop"} for s in stops] +
                         [{"frame": int(t), "type": "change", "novelty": float(nov[t])} for t in changes], key=lambda b: b["frame"])
    bound_check = None
    if args.music:
        manual_b = json.load(open(args.music))["boundaries"]
        bounds = [{"frame": int(round(b["t"] * fps)), "t": b["t"], "type": b["type"], "conf": b.get("conf", "high"),
                   "what": b.get("what"), "source": "manual"} for b in manual_b]
        af = np.array([b["frame"] for b in auto_bounds], float)
        mf = np.array([b["frame"] for b in bounds], float)
        dm = np.abs(nearest_d(mf, af)) if len(af) > 1 else np.full(len(mf), np.inf)
        da = np.abs(nearest_d(af, mf)) if len(mf) > 1 else np.full(len(af), np.inf)
        bound_check = {"manual": len(mf), "auto": len(af), "recall_0.5s": float(np.mean(dm <= 0.5 * fps)),
                       "precision_0.5s": float(np.mean(da <= 0.5 * fps)), "median_abs_err_f": float(np.median(dm[dm <= 0.5 * fps]))
                       if np.any(dm <= 0.5 * fps) else None}
    else:
        bounds = auto_bounds
    # music indicator level for fades / ducking: side level, or sub-bass where the music is (near) mono
    ind = np.where(S_db > MUSIC_S_DB, S_db, np.maximum(sub_db, -90))
    ind_s = smooth(ind, 3)
    W2 = 2 * int(fps)   # fade = time between the boundary and the level reaching / leaving (p90 over 2 s) - 3 dB
    for b in bounds:
        f = b["frame"]
        if b["type"] == "start" and f < n - 2:
            plat = np.percentile(ind_s[f:min(n, f + W2)], 90)
            g = f
            while g < min(n - 1, f + W2) and ind_s[g] < plat - 3:
                g += 1
            b["fade_frames"] = int(g - f)
        elif b["type"] == "stop" and f > 2:
            plat = np.percentile(ind_s[max(0, f - W2):f], 90)
            g = f - 1
            while g > max(0, f - W2) and ind_s[g] < plat - 3:
                g -= 1
            b["fade_frames"] = int(f - 1 - g)
    excerpts = []
    if args.music:   # excerpts between verified boundaries: start/change opens, stop/change closes
        cur = 0 if music[:int(fps)].mean() > 0.5 else None
        for b in bounds:
            f = b["frame"]
            if b["type"] in ("stop", "change") and cur is not None:
                if f - cur >= int(fps):
                    excerpts.append((cur, f))
                cur = None
            if b["type"] in ("start", "change"):
                cur = f
        if cur is not None and n - cur >= int(fps):
            excerpts.append((cur, n))
    else:
        for s0, s1 in music_runs:
            cuts_in = [s0] + [t for t in changes if s0 < t < s1] + [s1]
            for x0, x1 in zip(cuts_in[:-1], cuts_in[1:]):
                if x1 - x0 >= int(1.0 * fps):
                    excerpts.append((x0, x1))

    # ---- tempo map and beats
    menv = music_envelope(a, speech_hop)
    tmap, beats, downs = [], [], []
    lowflux = np.maximum(np.diff(np.log1p(100 * a["MB"][:, e[1:] <= 210].sum(1) / np.percentile(a["MB"][:, e[1:] <= 210].sum(1), 99)), prepend=0), 0)
    for x0, x1 in excerpts:
        h0, h1 = int(x0 / fps * HOP_HZ), int(x1 / fps * HOP_HZ)
        tp = tempo(menv[h0:h1])
        mo = (cls[x0:x1] == "music-only").mean()
        item = {"f0": x0, "f1": x1, "t0": x0 / fps, "t1": x1 / fps, "music_only_share": float(mo)}
        if tp:
            item.update(tp)
            if tp["conf"] >= 0.2 and (x1 - x0) >= 4 * fps:
                bt = beat_track(menv[h0:h1], tp["bpm"]) + h0
                item["n_beats"] = int(len(bt))
                ph = [float(sum(lowflux[max(0, b - 2):b + 3].max() for b in bt[p::4])) for p in range(4)]
                p0 = int(np.argmax(ph))
                beats += list(bt / HOP_HZ * fps)
                downs += list(bt[p0::4] / HOP_HZ * fps)
        tmap.append(item)
    beats, downs = np.array(sorted(beats)), np.array(sorted(downs))
    mo_stretch = []
    for s0, s1 in runs(cls == "music-only"):
        if s1 - s0 >= 3 * fps:
            h0, h1 = int(s0 / fps * HOP_HZ), int(s1 / fps * HOP_HZ)
            tp = tempo(menv[h0:h1])
            mo_stretch.append({"t0": s0 / fps, "t1": s1 / fps, **(tp or {})})

    # ---- music onsets: peaks of the voice-free music envelope while music plays (tempo-free beat proxy)
    mus_on = []
    w5 = HOP_HZ // 2
    last = -10 ** 9
    for h in range(1, len(menv) - 1):
        if menv[h] < menv[h - 1] or menv[h] < menv[h + 1] or menv[h] < 0.1:
            continue
        seg = menv[max(0, h - w5):h + w5]
        f = int(h / HOP_HZ * fps)
        if f < n and music[f] and menv[h] > seg.mean() + 1.5 * seg.std() and h - last >= 7:
            mus_on.append(h / HOP_HZ * fps)
            last = h
    mus_on = np.array(mus_on)

    # ---- SFX candidates: strong broadband onsets away from words and beats
    TB = a["MB"] + a["SB"]
    Lg = np.log1p(100 * TB / (np.percentile(TB, 99, axis=0) + 1e-20))
    fl = np.maximum(np.diff(Lg, axis=0, prepend=Lg[:1]), 0)
    strength = fl.sum(1)
    broad = (fl > 0.3).mean(1)
    hiflux = fl[:, e[:-1] >= 4000].sum(1)
    thr = np.percentile(strength, 97)
    word_t = np.concatenate([onsets, ws])
    sfx = []
    for h in range(2, len(strength) - 2):
        if strength[h] < thr or strength[h] < strength[h - 2:h + 3].max() or broad[h] < 0.5 or hiflux[h] <= 0:
            continue
        t = h / HOP_HZ
        if np.min(np.abs(word_t - t)) <= 0.08 or speech_hop[max(0, h - 10):h + 11].any():
            continue
        if len(beats) and np.min(np.abs(beats / fps - t)) <= 0.06:
            continue
        pre = TB[max(0, h - 50):h].sum(1)
        whoosh = bool(len(pre) > 20 and np.corrcoef(np.arange(len(pre)), db(pre + 1e-30))[0, 1] > 0.7)
        sfx.append({"t": t, "frame": t * fps, "strength": float(strength[h]), "broadband": float(broad[h]),
                    "class": cls[min(n - 1, int(t * fps))], "rising_pre": whoosh})

    # ---- visual events
    cuts_raw = list(shots_js["cuts"])
    cuts = merge_cuts(cuts_raw)
    soft = shots_js.get("soft_transitions", [])
    vis_on = visual_onsets(m["mad_lo"], shots_js["shots"], cuts_raw, soft)
    moves = camera_moves(m, cuts_raw)
    cam = np.array([mv["start"] for mv in moves if all(abs(mv["start"] - k) > 2 for k in cuts_raw)], int)
    reveals = json.load(open(args.reveals))["reveals"] if args.reveals else []

    # ---- audio event sets (frames, float)
    ph_all = onsets[phrase] * fps
    ph_narr = onsets[phrase & is_narr] * fps
    aud = {
        "word_onsets": onsets * fps,
        "word_onsets_whisper": ws * fps,
        "narrator_word_onsets": onsets[is_narr] * fps,
        "phrase_onsets_narrator": ph_narr,
        "phrase_onsets_narrator_whisper": ws[phrase & is_narr] * fps,
        "phrase_onsets_all": ph_all,
        "stressed_words": onsets[stressed] * fps,
        "beats": beats,
        "downbeats": downs,
        "beats_global_85bpm": np.array([b["t"] * fps for b in rhythm["beats"]]) if rhythm else np.array([]),
        "music_boundaries": np.array([b["frame"] for b in bounds if b.get("conf", "high") != "low"], float),
        "music_onsets": mus_on,
        "sfx": np.array([s["frame"] for s in sfx]),
        "audio_onsets": np.array([o["t"] * fps for o in rhythm["onsets"]]) if rhythm else np.array([]),
    }
    vis = {"cuts": np.array(cuts, float), "cuts_raw": np.array(cuts_raw, float),
           "soft_transition_starts": np.array([s["start"] for s in soft], float),
           "visual_onsets": vis_on.astype(float), "camera_move_starts": cam.astype(float)}
    if reveals:
        vis["text_reveals"] = np.array([r["frame"] for r in reveals], float)
    table = {}
    for vk, V in vis.items():
        for ak, A in aud.items():
            r = align(V, A, n, args.trials, rng)
            if r:
                table[f"{vk} | {ak}"] = r

    # ---- cuts vs phrases in detail: where inside the pause does the cut fall?
    cut_ctx = []
    ph_idx = np.where(phrase & is_narr)[0]
    for k in cuts:
        t = k / fps
        nxt = [i for i in ph_idx if onsets[i] >= t - 0.5]
        prev_end = we[(we <= t + 0.04)]
        inside = bool(speech_f[min(n - 1, k)])
        item = {"frame": k, "class": cls[min(n - 1, k)], "inside_speech": inside}
        if nxt:
            i = nxt[0]
            item["next_phrase_d"] = float(k - onsets[i] * fps)
            item["next_phrase_word"] = words[i]["word"]
        if len(prev_end):
            item["since_prev_word_end_f"] = float(k - prev_end.max() * fps)
        cut_ctx.append(item)

    def window_share(V, A, lo, hi):
        V = np.asarray(V, float)
        A = np.sort(np.asarray(A, float))
        def share(Vx):
            i0 = np.searchsorted(A, Vx + lo, side="left")
            i1 = np.searchsorted(A, Vx + hi, side="right")
            return (i1 > i0).mean(axis=-1)
        obs = float(share(V))
        sh = rng.integers(2 * JITTER, n - 2 * JITTER, size=args.trials)
        nc = share((V[None, :] + sh[:, None]) % n)
        nj = share(np.clip(V[None, :] + rng.integers(-JITTER, JITTER + 1, size=(args.trials, len(V))), 0, n - 1))
        return {"window_f": [lo, hi], "share": obs, "null_circ": float(nc.mean()), "p_circ": float((1 + np.sum(nc >= obs)) / (1 + args.trials)),
                "null_jit": float(nj.mean()), "p_jit": float((1 + np.sum(nj >= obs)) / (1 + args.trials))}
    lead_tests = {"cuts lead narrator phrase by 0-12 f": window_share(cuts, ph_narr, 0, 12),
                  "cuts lead any phrase by 0-12 f": window_share(cuts, ph_all, 0, 12),
                  "cuts lag narrator phrase by 0-12 f": window_share(cuts, ph_narr, -12, 0),
                  "music boundary leads cut by 0-12 f": window_share(cuts, aud["music_boundaries"], -12, 0),
                  "cut leads music boundary by 0-12 f": window_share(cuts, aud["music_boundaries"], 0, 12)}
    bfr = np.array([b["frame"] for b in bounds], float)
    for it in cut_ctx:
        k = it["frame"]
        if len(bfr) and np.min(np.abs(bfr - k)) <= 12:
            it["context"] = "music edit (+-12 f)"
        elif not it["inside_speech"] and it.get("next_phrase_d") is not None and -25 <= it["next_phrase_d"] <= 0:
            it["context"] = "pause before narrator phrase"
        elif it["inside_speech"] and it["class"] in ("narration", "narration+music"):
            it["context"] = "mid narrator phrase"
        elif len(ph_all) and np.min(np.abs(ph_all - k)) <= 12:
            it["context"] = "voice turn (+-12 f)"
        else:
            it["context"] = "other"
    ctx_counts = {}
    for it in cut_ctx:
        ctx_counts[it["context"]] = ctx_counts.get(it["context"], 0) + 1

    # ---- text reveals vs their words
    rev_out = []
    for r in reveals:
        i = int(np.argmin(np.abs(ws - r["whisper_t"])))
        it = {"frame": r["frame"], "text": r["text"], "kind": r.get("kind"), "word": words[i]["word"],
              "speaker": labels[i], "d_whisper": float(r["frame"] - ws[i] * fps),
              "d_refined": float(r["frame"] - onsets[i] * fps)}
        if r.get("acoustic_t") is not None:
            it["d_acoustic"] = float(r["frame"] - r["acoustic_t"] * fps)
            it["refined_error_f"] = float((onsets[i] - r["acoustic_t"]) * fps)
            it["whisper_error_f"] = float((ws[i] - r["acoustic_t"]) * fps)
        it["confidence"] = r.get("confidence", "normal")
        rev_out.append(it)
    rev_sum = {}
    if rev_out:
        for kind in sorted(set(x["kind"] for x in rev_out)) + ["all", "word-synced"]:
            sel = [x for x in rev_out if (kind == "all" or x["kind"] == kind or
                                          (kind == "word-synced" and x["kind"] in ("lyric", "keyword", "quote", "name")))]
            da = np.array([x["d_acoustic"] for x in sel if "d_acoustic" in x])
            dw = np.array([x["d_whisper"] for x in sel])
            if len(da):
                rev_sum[kind] = {"n": len(sel), "median_d_acoustic": float(np.median(da)), "mean_d_acoustic": float(da.mean()),
                                 "iqr_acoustic": [float(np.percentile(da, 25)), float(np.percentile(da, 75))],
                                 "lead_share": float(np.mean(da < -0.5)), "lag_share": float(np.mean(da > 0.5)),
                                 "within_1": float(np.mean(np.abs(da) <= 1)), "within_2": float(np.mean(np.abs(da) <= 2)),
                                 "within_3": float(np.mean(np.abs(da) <= 3)), "median_d_whisper": float(np.median(dw))}
        we_ = np.array([x["whisper_error_f"] for x in rev_out if "whisper_error_f" in x])
        re_ = np.array([x["refined_error_f"] for x in rev_out if "refined_error_f" in x])
        rev_sum["onset_error_vs_manual"] = {"n": int(len(we_)), "whisper_median_abs_f": float(np.median(np.abs(we_))),
                                            "whisper_p90_abs_f": float(np.percentile(np.abs(we_), 90)),
                                            "whisper_median_signed_f": float(np.median(we_)),
                                            "refined_median_abs_f": float(np.median(np.abs(re_))),
                                            "refined_p90_abs_f": float(np.percentile(np.abs(re_), 90))}

    # ---- mix: music under narration vs alone, ducking, boundaries vs cuts, silence gaps
    duck = []
    for x0, x1 in excerpts:
        c_ = cls[x0:x1]
        mo, nm = c_ == "music-only", c_ == "narration+music"
        if mo.sum() >= fps and nm.sum() >= fps:
            S_ = S_db[x0:x1]
            sb_ = sub_db[x0:x1]
            M_ = M_db[x0:x1]
            use_side = np.median(S_[mo]) > MUSIC_S_DB + 5
            ind_ = S_ if use_side else sb_
            r_ms = float(np.median(M_[mo] - ind_[mo]))  # music's own M minus indicator
            duck.append({"t0": x0 / fps, "t1": x1 / fps, "indicator": "side" if use_side else "sub-bass",
                         "music_alone_db": float(np.median(ind_[mo]) + r_ms), "music_under_narration_db": float(np.median(ind_[nm]) + r_ms),
                         "duck_db": float(np.median(ind_[mo]) - np.median(ind_[nm])),
                         "narration_M_db": float(np.median(M_[nm])),
                         "speech_to_music_db": float(np.median(M_[nm]) - (np.median(ind_[nm]) + r_ms))})
    # local ducking: each narrator phrase inside music vs the music-only frames within 2 s before/after it
    local = []
    for t0, t1, nr, _ in segs:
        if not nr:
            continue
        f0, f1 = int(t0 * fps), int(math.ceil(t1 * fps))
        if f1 - f0 < int(0.5 * fps) or music[f0:f1].mean() < 0.5:
            continue
        ctx = np.r_[max(0, f0 - 2 * int(fps)):max(0, f0 - 3), min(n, f1 + 3):min(n, f1 + 2 * int(fps))].astype(int)
        gap = ctx[cls[ctx] == "music-only"]
        if len(gap) < int(0.4 * fps):
            continue
        use_side = bool(np.median(S_db[gap]) > MUSIC_S_DB + 5)
        ind_ = S_db if use_side else sub_db
        r_ms = float(np.median(M_db[gap] - ind_[gap]))
        local.append({"t0": t0, "t1": t1, "indicator": "side" if use_side else "sub-bass",
                      "duck_db": float(np.median(ind_[gap]) - np.median(ind_[f0:f1])),
                      "speech_to_music_db": float(np.median(M_db[f0:f1]) - (np.median(ind_[f0:f1]) + r_ms)),
                      "music_gap_M_db": float(np.median(M_db[gap])), "narration_M_db": float(np.median(M_db[f0:f1]))})
    def q3(x):
        x = np.asarray(x, float)
        return [float(np.percentile(x, 25)), float(np.median(x)), float(np.percentile(x, 75))] if len(x) else None
    local_sum = {"n": len(local), "duck_db_q25_med_q75": q3([d["duck_db"] for d in local]),
                 "speech_to_music_db_q25_med_q75": q3([d["speech_to_music_db"] for d in local]),
                 "narration_minus_music_gap_M_db_q25_med_q75": q3([d["narration_M_db"] - d["music_gap_M_db"] for d in local]),
                 "share_ducked_3db": float(np.mean([d["duck_db"] >= 3 for d in local])) if local else None,
                 "items": local}
    # event-locked ducking at 100 Hz on the side level
    s100 = smooth(db(a["SF"], ref), 5)
    sub100 = smooth(db(a["MB"][:, e[1:] <= 110].sum(1), ref), 5)
    lock_on, lock_off = [], []
    narr_ph = np.where(phrase & is_narr)[0]
    for i in narr_ph:
        t = onsets[i]
        prev_end = we[:i].max() if i > 0 else -10
        h = int(t * HOP_HZ)
        if t - prev_end >= 0.6 and h - 150 >= 0 and h + 100 < len(s100):
            f = int(t * fps)
            if music[max(0, f - 15):f].mean() > 0.5:
                tr = s100[h - 150:h + 100]
                if np.median(tr[:90]) > MUSIC_S_DB:
                    lock_on.append(tr - np.median(tr[30:90]))
    ends_idx = [i for i in range(len(words)) if is_narr[i] and (i + 1 == len(words) or ws[i + 1] - we[i] >= 0.6)]
    for i in ends_idx:
        t = we[i]
        h = int(t * HOP_HZ)
        if h - 100 >= 0 and h + 150 < len(s100) and music[min(n - 1, int(t * fps)):min(n, int(t * fps) + 15)].mean() > 0.5:
            tr = s100[h - 100:h + 150]
            if np.median(tr[150:]) > MUSIC_S_DB:
                lock_off.append(tr - np.median(tr[30:90]))

    def lock_stats(L, onset):
        if len(L) < 3:
            return None
        L = np.array(L)
        mtr = np.median(L, 0)
        tt = (np.arange(L.shape[1]) - (150 if onset else 100)) / HOP_HZ
        if onset:
            pre, post = np.median(mtr[30:90]), np.median(mtr[180:240])
        else:
            pre, post = np.median(mtr[30:90]), np.median(mtr[160:240])
        depth = pre - post if onset else post - pre
        hi_, lo_ = (pre, post) if onset else (post, pre)
        def cross(level, falling):
            idx = np.where(mtr <= level)[0] if falling else np.where(mtr >= level)[0]
            idx = idx[idx >= 60]
            return float(tt[idx[0]]) if len(idx) else None
        if onset:
            t10, t90 = cross(pre - 0.1 * depth, True), cross(pre - 0.9 * depth, True)
        else:
            t10, t90 = cross(pre + 0.1 * depth, False), cross(pre + 0.9 * depth, False)
        per_ev = []
        for tr in L:
            p_, q_ = np.median(tr[30:90]), np.median(tr[180:240] if onset else tr[160:240])
            per_ev.append(p_ - q_ if onset else q_ - p_)
        return {"n": int(len(L)), "depth_db_median_trace": float(depth), "depth_db_per_event_median": float(np.median(per_ev)),
                "depth_db_iqr": [float(np.percentile(per_ev, 25)), float(np.percentile(per_ev, 75))],
                "t10_s": t10, "t90_s": t90, "ramp_s": (t90 - t10) if (t10 is not None and t90 is not None) else None,
                "trace_s": [float(x) for x in tt[::10]], "trace_db": [float(x) for x in mtr[::10]]}
    ducking = {"local_per_phrase": local_sum, "per_excerpt": duck,
               "pooled_duck_db_median": float(np.median([d["duck_db"] for d in duck])) if duck else None,
               "pooled_speech_to_music_db_median": float(np.median([d["speech_to_music_db"] for d in duck])) if duck else None,
               "phrase_onset_locked": lock_stats(lock_on, True), "phrase_end_locked": lock_stats(lock_off, False)}
    bvc = []
    for b in bounds:
        dd = np.array(cuts_raw, float) - b["frame"]
        j = int(np.argmin(np.abs(dd)))
        b["nearest_cut_d"] = float(dd[j])   # cut - boundary (frames): negative = cut first
        bvc.append(dd[j])
    gaps = []
    for s0, s1 in runs(sil):
        cin = [k for k in cuts_raw if s0 - 2 <= k <= s1 + 2]
        evs = [int(x) for x in vis_on if s0 - 2 <= x <= s1 + 2]
        # picture: black run (luma < 3) near the gap and the linear fades into / out of it
        L_ = m["luma"]
        lo_, hi_ = max(0, s0 - 50), min(n, s1 + 50)
        blk = np.where(L_[lo_:hi_] < 3)[0] + lo_
        pic = {}
        if len(blk):
            b0_, b1_ = int(blk[0]), int(blk[-1]) + 1
            fo = b0_
            while fo > 0 and L_[fo - 1] - L_[fo] > 0.5:
                fo -= 1
            fi = b1_
            while fi < n - 1 and L_[fi] - L_[fi - 1] > 0.5:
                fi += 1
            # audio fade-out start: last frame before the silence where the 3-frame level was within 3 dB of its 1 s median
            Ts = smooth(T_db, 3)
            ref_lv = np.median(Ts[max(0, s0 - 50):max(1, s0 - 25)])
            ao = s0
            while ao > max(0, s0 - 50) and Ts[ao - 1] < ref_lv - 3:
                ao -= 1
            pic = {"black_f": [b0_, b1_], "pic_fade_out_f": [fo, b0_], "pic_fade_in_f": [b1_, fi],
                   "pic_fade_out_frames": b0_ - fo, "pic_fade_in_frames": fi - b1_,
                   "audio_fade_out_start_f": int(ao), "audio_fade_out_frames": int(s0 - ao),
                   "audio_in_minus_picture_in_f": int(s1 - b1_), "audio_out_minus_picture_fade_start_f": int(ao - fo)}
        gaps.append({"f0": s0, "f1": s1, "t0": s0 / fps, "len_frames": s1 - s0, "min_db": float(T_db[s0:s1].min()), **pic,
                     "cuts": cin, "visual_onsets": evs, "luma_min": float(m["luma"][s0:s1].min()),
                     "luma_mean": float(m["luma"][s0:s1].mean()),
                     "soft_transitions": [s["start"] for s in soft if s["start"] <= s1 + 2 and s["end"] >= s0 - 2]})

    # ---- pacing
    nw = np.where(is_narr)[0]
    gaps_w = np.array([onsets[j] - we[i] for i, j in zip(nw[:-1], nw[1:]) if j == i + 1])
    gaps_w = np.maximum(gaps_w, 0)
    narr_phr = []
    cur = None
    for i in range(len(words)):
        if not is_narr[i]:
            cur = None
            continue
        if phrase[i] or cur is None:
            cur = [onsets[i], we[i], 1]
            narr_phr.append(cur)
        else:
            cur[1], cur[2] = we[i], cur[2] + 1
    pl = np.array([p[1] - p[0] for p in narr_phr])
    speak_t = pl.sum()
    shot_len = np.array([s["frames"] / fps for s in shots_js["shots"]])
    sh_b = [(s["start"], s["end"] + 1) for s in shots_js["shots"]]
    ph_per_shot = [int(np.sum((onsets[phrase] * fps >= x0) & (onsets[phrase] * fps < x1))) for x0, x1 in sh_b]
    def spearman(x, y):
        rx, ry = np.argsort(np.argsort(x)), np.argsort(np.argsort(y))
        return float(np.corrcoef(rx, ry)[0, 1])
    vis_all = np.array(sorted(set(cuts) | set(vis_on.tolist()) | set(cam.tolist())), float)
    bpe = []
    lock = {}
    if len(beats) > 4:
        for x0, x1 in excerpts:
            ev = vis_all[(vis_all >= x0) & (vis_all < x1)]
            bt = beats[(beats >= x0) & (beats < x1)]
            if len(bt) < 4:
                continue
            for p, q in zip(ev[:-1], ev[1:]):
                bpe.append(np.sum((bt >= p) & (bt < q)))
        for nm_, V in (("cuts", np.array(cuts, float)), ("visual_onsets", vis_on.astype(float)), ("all_visual", vis_all)):
            ph_ = []
            for x in V:
                i = np.searchsorted(beats, x)
                if 1 <= i < len(beats) and beats[i] - beats[i - 1] < 2.5 * fps:
                    ph_.append(2 * np.pi * (x - beats[i - 1]) / (beats[i] - beats[i - 1]))
            lock[nm_] = rayleigh(ph_)
    dur_class = {k: float(np.sum(cls == k) / fps) for k in CLASSES}
    cut_cls = {}
    for k in cuts:
        win_c = cls[max(0, k - 12):min(n, k + 13)]
        vals, cnts = np.unique(win_c, return_counts=True)
        kk = vals[int(np.argmax(cnts))]
        cut_cls[kk] = cut_cls.get(kk, 0) + 1
    pacing = {
        "narrator_words": int(is_narr.sum()), "narrator_phrases": len(narr_phr),
        "words_per_s_articulation": float(is_narr.sum() / speak_t) if speak_t else None,
        "words_per_min_narration_time": float(is_narr.sum() / ((cls == "narration").sum() + (cls == "narration+music").sum()) * fps * 60),
        "words_per_min_whole_video": float(is_narr.sum() / (n / fps) * 60),
        "pause_s_percentiles_all_gaps": {str(p): float(np.percentile(gaps_w, p)) for p in (10, 25, 50, 75, 90)},
        "pause_hist": {k: int(np.sum((gaps_w >= lo) & (gaps_w < hi))) for k, (lo, hi) in
                       {"<0.1": (0, 0.1), "0.1-0.25": (0.1, 0.25), "0.25-0.5": (0.25, 0.5), "0.5-1": (0.5, 1),
                        "1-2": (1, 2), ">=2": (2, 1e9)}.items()},
        "phrase_s": {"median": float(np.median(pl)), "p10": float(np.percentile(pl, 10)), "p90": float(np.percentile(pl, 90)),
                     "mean": float(pl.mean())},
        "phrase_words_median": float(np.median([p[2] for p in narr_phr])),
        "shot_s": {"median": float(np.median(shot_len)), "p10": float(np.percentile(shot_len, 10)), "p90": float(np.percentile(shot_len, 90))},
        "phrases_per_shot_median": float(np.median(ph_per_shot)),
        "spearman_shotlen_vs_phrases": spearman(shot_len, np.array(ph_per_shot)),
        "beats_per_visual_event": {"median": float(np.median(bpe)), "mean": float(np.mean(bpe)),
                                   "hist": {str(k): int(np.sum(np.array(bpe) == k)) for k in range(0, 9)}} if bpe else None,
        "beat_phase_locking": lock,
        "seconds_by_class": dur_class,
        "cuts_by_class": cut_cls,
        "cuts_per_min_by_class": {k: float(cut_cls.get(k, 0) / dur_class[k] * 60) for k in dur_class if dur_class[k] > 5},
    }

    # ---- audio-reactive cross-correlation
    bad = np.zeros(n, bool)
    for k in cuts_raw:
        bad[max(0, k - 2):k + 3] = True
    for s in soft:
        bad[max(0, s["start"] - 1):s["end"] + 2] = True
    okm = ~bad
    sb = [(s["start"], s["end"] + 1) for s in shots_js["shots"]]
    dl = np.abs(np.diff(m["luma"], prepend=m["luma"][0]))
    vis_series = {"mad_lo": np.log1p(m["mad_lo"]), "mad": np.log1p(m["mad"]), "luma": m["luma"], "abs_dluma": dl}
    if args.colour:
        col, colchg = colour_series(vid, n)
        vis_series["accent_area"] = col
        vis_series["accent_change"] = colchg
    aud_series = {"total_db": T_db, "side_db": S_db, "sub_db": sub_db}
    if feat is not None:
        for k in ("rms_db", "low_db", "mid_db", "high_db", "onset"):
            aud_series[k] = feat[k][:n] if len(feat[k]) >= n else np.pad(feat[k], (0, n - len(feat[k])), mode="edge")
    xc = {"raw": {}, "fast_hp1s": {}}
    for mode, hp in (("raw", 0), ("fast_hp1s", int(fps))):
        for ak, av in aud_series.items():
            za = zscore_by_shot(av, sb, okm, hp)
            for vk, vv in vis_series.items():
                zv = zscore_by_shot(vv, sb, okm, hp)
                xc[mode][f"{ak} ~ {vk}"] = xcorr_test(za, zv, min(args.trials, 1000), rng)
    per_shot = []
    for s0, s1 in sb:
        if s1 - s0 < 50:
            continue
        for ak in ("total_db", "sub_db") + (("onset",) if feat is not None else ()):
            for vk in vis_series:
                ok = okm[s0:s1]
                za = zscore_by_shot(aud_series[ak][s0:s1], [(0, s1 - s0)], ok, int(fps))
                zv = zscore_by_shot(vis_series[vk][s0:s1], [(0, s1 - s0)], ok, int(fps))
                if ok.sum() < 40 or not za.any() or not zv.any():
                    continue
                r = xcorr_test(za, zv, 300, rng, L=12)
                if r["p_familywise"] <= 0.01:
                    per_shot.append({"f0": s0, "f1": s1, "t0": s0 / fps, "pair": f"{ak} ~ {vk}", "mode": "fast_hp1s", **r})

    # ---- assemble
    out = {
        "id": vid, "fps": fps, "frames": n, "audio_source": audio_src, "sample_rate": a["sr"],
        "conventions": {"d": "visual frame - audio event time*fps (frames); negative = picture leads sound",
                        "levels": "dB re 99th percentile of 40 ms mid-channel frame power unless LUFS",
                        "null": "circular shift of the visual train by >= 2 s, and +-1 s jitter of each visual event",
                        "trials": args.trials, "seed": args.seed},
        "loudness": {**ld, "sample_peak_dbfs": float(20 * np.log10(a["peak"] + 1e-12))},
        "classes": class_stats,
        "speakers": {"manual": bool(spans), "counts": {k: labels.count(k) for k in sorted(set(labels))},
                     "auto_vs_manual_word_agreement": (float(np.mean([(au == "narrator") == (lb == "narrator") for au, lb in zip(auto_lab, labels)]))
                                                       if spans else None)},
        "words": [{"i": i, "word": w["word"], "speaker": labels[i], "whisper_t": w["start"], "onset_t": float(onsets[i]),
                   "end_t": w["end"], "snapped": bool(snapped[i]), "phrase_start": bool(phrase[i]), "content": bool(content[i]),
                   "stressed": bool(stressed[i]), "bandlimit_db": bl[i]} for i, w in enumerate(words)],
        "event_counts": {**{k: int(len(v_)) for k, v_ in aud.items()}, **{k: int(len(v_)) for k, v_ in vis.items()}},
        "visual_events": {"cuts": cuts, "cuts_raw": cuts_raw, "visual_onsets": vis_on.tolist(), "camera_moves": moves},
        "music": {"boundaries": bounds, "excerpts": [{"f0": x0, "f1": x1} for x0, x1 in excerpts],
                  "novelty_threshold": nthr, "auto_vs_manual": bound_check,
                  "auto_boundaries": auto_bounds if args.music else None, "tempo_map": tmap, "music_only_stretches": mo_stretch,
                  "global_tempo_bpm": rhythm["tempo_bpm"] if rhythm else None,
                  "boundary_minus_cut": {"n": len(bvc), "within_1": float(np.mean(np.abs(bvc) <= 1)) if bvc else None,
                                         "within_3": float(np.mean(np.abs(bvc) <= 3)) if bvc else None,
                                         "median_cut_minus_boundary": float(np.median(bvc)) if bvc else None}},
        "sfx_candidates": sfx,
        "alignment": table,
        "cuts_context": {"items": cut_ctx, "counts": ctx_counts, "lead_window_tests": lead_tests},
        "text_reveals": {"items": rev_out, "summary": rev_sum},
        "ducking": ducking,
        "silence_gaps": gaps,
        "pacing": pacing,
        "audio_reactive": {"global": xc, "significant_shots_p01": per_shot},
        "frame_class": "".join({"silence": ".", "narration": "n", "narration+music": "N", "archival voice": "a",
                                "music-only": "m"}[k] for k in cls),
    }
    path = args.out or os.path.join(ROOT, "analysis", "audio", f"{vid}_sync.json")
    with open(path, "w") as fh:
        json.dump(jsonable(out), fh, indent=1)
    # ---- summary
    print(f"{vid}: {n} frames, audio {a['duration']:.2f} s @ {a['sr']} Hz, loudness {ld['integrated_lufs']:.1f} LUFS, LRA {ld['lra_lu']:.1f} LU")
    print("classes:", {k: round(v_['share'], 3) for k, v_ in class_stats.items()})
    for key in ("cuts | phrase_onsets_narrator", "cuts | beats", "cuts | music_boundaries", "visual_onsets | word_onsets",
                "visual_onsets | beats", "text_reveals | word_onsets"):
        if key in table:
            r = table[key]
            print(f"{key:40s} n={r['n_visual']:3d} med d={r['median_d']:+.1f} ±2f={r['share_2']:.2f} "
                  f"(null {r['null_circ_share_2']:.2f}, p_circ {r['p_circ_2']:.3f}, p_jit {r['p_jit_2']:.3f})")
    print("wrote", os.path.relpath(path, ROOT))


if __name__ == "__main__":
    main()
