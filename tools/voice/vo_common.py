"""Shared helpers for the voice tools: loudness, script<->heard word alignment, cue building, project.json."""
import difflib
import json
import os
import re
import subprocess
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "tools", "audio"))
from script_markup import norm  # noqa: E402

OUT_SR = 48000
TARGET_RMS_DBFS = -21.5   # active-speech RMS (docs/style-guide/11-audio-sync.md §5)
PEAK_CEIL_DB = -1.5
DEFAULT_FPS = 25


def rel(p):
    return os.path.relpath(p, ROOT)


# ---------- audio ----------
def read_wav_mono(path, sr=OUT_SR):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).astype(np.float64)


def write_wav(path, y, sr=OUT_SR):
    import soundfile as sf
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sf.write(path, np.clip(y, -1, 1).astype(np.float32), sr, subtype="PCM_16")


def speech_rms_db(y, sr=OUT_SR):
    """RMS (dBFS) over active 50 ms frames (within 30 dB of the loudest-decile frame level)."""
    n = int(0.05 * sr)
    m = len(y) // n
    if m == 0:
        return -99.0
    fr = (y[:m * n].reshape(m, n) ** 2).mean(1) + 1e-12
    db = 10 * np.log10(fr)
    ref = np.percentile(db, 90)
    act = fr[db > ref - 30]
    return float(10 * np.log10(act.mean()))


def lufs(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(m[-1]) if m else float("nan")


def normalise(y, sr=OUT_SR):
    """Gain to TARGET_RMS_DBFS active-speech RMS, soft-limited to PEAK_CEIL_DB. Returns (y, gain_db)."""
    g = TARGET_RMS_DBFS - speech_rms_db(y, sr)
    y = y * 10 ** (g / 20)
    ceil = 10 ** (PEAK_CEIL_DB / 20)
    pk = np.abs(y).max()
    if pk > ceil:   # tanh-style knee above 0.7*ceil keeps the peak under the ceiling without hard clipping
        k = 0.7 * ceil
        a = np.abs(y)
        over = a > k
        y = np.where(over, np.sign(y) * (k + (ceil - k) * np.tanh((a - k) / (ceil - k))), y)
    return y, g


# ---------- alignment ----------
def _sim(a, b):
    if a == b:
        return 2.0
    if not a or not b:
        return -0.6
    r = difflib.SequenceMatcher(None, a, b).ratio()
    return 1.0 if r >= 0.75 else -0.6


def align(script_norm, heard_norm):
    """Needleman-Wunsch (banded) on normalised tokens. Returns per script word (heard_index|None, score_class)
    score_class: 'exact' | 'fuzzy' | 'sub' | None. Substitutions are paired when both sides have a word between
    two anchors, so small reading deviations keep timing."""
    n, m = len(script_norm), len(heard_norm)
    GAP = -1.0
    band = max(40, int(0.3 * max(n, m)))
    NEG = -1e9
    S = np.full((n + 1, m + 1), NEG)
    P = np.zeros((n + 1, m + 1), np.int8)   # 0 diag,1 up (skip script),2 left (skip heard)
    S[0, 0] = 0
    for i in range(n + 1):
        c = int(i * m / max(n, 1))
        for j in range(max(0, c - band), min(m, c + band) + 1):
            if i == 0 and j == 0:
                continue
            best, bp = NEG, 0
            if i and j and S[i - 1, j - 1] > NEG:
                v = S[i - 1, j - 1] + _sim(script_norm[i - 1], heard_norm[j - 1])
                best, bp = v, 0
            if i and S[i - 1, j] > NEG and S[i - 1, j] + GAP > best:
                best, bp = S[i - 1, j] + GAP, 1
            if j and S[i, j - 1] > NEG and S[i, j - 1] + GAP > best:
                best, bp = S[i, j - 1] + GAP, 2
            S[i, j], P[i, j] = best, bp
    res = [(None, None)] * n
    i, j = n, m
    while i > 0 or j > 0:
        p = P[i, j]
        if i and j and p == 0:
            s = _sim(script_norm[i - 1], heard_norm[j - 1])
            res[i - 1] = (j - 1, "exact" if s == 2.0 else "fuzzy" if s == 1.0 else "sub")
            i, j = i - 1, j - 1
        elif i and (p == 1 or j == 0):
            i -= 1
        else:
            j -= 1
    return res


def timed_script_words(script_words, heard):
    """Give every script word a time span from the heard (whisper) words. Unmatched words are interpolated
    between matched neighbours (flagged interp). Returns (words-json list for make_cues, stats)."""
    al = align([w["norm"] for w in script_words], [norm(h["text"]) for h in heard])
    n = len(script_words)
    st = [None] * n
    for k, (j, cls) in enumerate(al):
        if j is not None:
            st[k] = (heard[j]["start"], heard[j]["end"], cls, heard[j].get("prob", 1.0))
    known = [k for k in range(n) if st[k]]
    if not known:
        raise SystemExit("could not align any script word to the audio (is it the right recording?)")
    out = [None] * n
    SPW = 0.28

    def spread(a, b, t0, t1):   # fill script words a..b-1 across [t0,t1] weighted by length
        ws = [max(2, len(script_words[k]["norm"])) for k in range(a, b)]
        tot = sum(ws)
        t = t0
        for k, wgt in zip(range(a, b), ws):
            d = (t1 - t0) * wgt / tot
            out[k] = (t, t + d * 0.92, "interp", 0.0)
            t += d
    for k in known:
        out[k] = st[k]
    first, last = known[0], known[-1]
    if first > 0:
        spread(0, first, max(0.0, st[first][0] - SPW * first), st[first][0])
    for a, b in zip(known[:-1], known[1:]):
        if b > a + 1:
            spread(a + 1, b, st[a][1], st[b][0])
    if last < n - 1:
        spread(last + 1, n, st[last][1], st[last][1] + SPW * (n - 1 - last))
    words = []
    for k, w in enumerate(script_words):
        s, e, cls, pr = out[k]
        e = max(e, s + 0.05)
        words.append({"text": w["text"], "start": round(s, 3), "end": round(e, 3), "prob": round(pr, 3),
                      "_si": k, "_cls": cls})
    stats = {c: sum(1 for w in words if w["_cls"] == c) for c in ("exact", "fuzzy", "sub", "interp")}
    return words, stats


def build_cues(wav, script_words, name, fps, cues_out, pause_ms=250):
    """Transcribe wav, align to script words, run make_cues.py with those words, tag cue words with si/match.
    Returns (cues dict, stats)."""
    import make_cues
    heard = make_cues.transcribe(wav)
    words, stats = timed_script_words(script_words, heard)
    tmp = cues_out + ".words.json"
    os.makedirs(os.path.dirname(cues_out), exist_ok=True)
    json.dump([{k: v for k, v in w.items() if not k.startswith("_")} for w in words], open(tmp, "w"))
    subprocess.check_call([sys.executable, os.path.join(ROOT, "tools", "audio", "make_cues.py"), wav, "--name", name,
                           "--fps", str(fps), "--words-json", tmp, "--pause-ms", str(pause_ms), "--global-tempo"],
                          stdout=subprocess.DEVNULL)
    os.remove(tmp)
    default = os.path.join(ROOT, "public", "audio", f"{name}.cues.json")
    cues = json.load(open(default))
    for cw, w in zip(cues["words"], words):
        cw["si"] = w["_si"]
        cw["match"] = w["_cls"]
    cues["source"] = rel(wav)
    if os.path.abspath(default) != os.path.abspath(cues_out):
        os.remove(default)
        try:
            os.rmdir(os.path.dirname(default))
        except OSError:
            pass
    json.dump(cues, open(cues_out, "w"), separators=(",", ":"))
    return cues, stats


# ---------- project ----------
def project_dir(p):
    p = os.path.abspath(p)
    return p


def load_project(pdir):
    f = os.path.join(pdir, "project.json")
    return json.load(open(f)) if os.path.exists(f) else {}


def save_project(pdir, proj):
    json.dump(proj, open(os.path.join(pdir, "project.json"), "w"), indent=2)
    open(os.path.join(pdir, "project.json"), "a").write("\n")


def load_parsed(pdir, script="script.md"):
    import script_markup
    sp = os.path.join(pdir, script)
    pp = os.path.join(pdir, "script.parsed.json")
    if os.path.exists(sp) and (not os.path.exists(pp) or os.path.getmtime(sp) > os.path.getmtime(pp)):
        p = script_markup.parse(open(sp, encoding="utf-8").read())
        json.dump(p, open(pp, "w"), indent=1)
        return p
    return json.load(open(pp))
