#!/usr/bin/env python3
"""Scratch voice-over from a script, with local Kokoro-82M TTS (kokoro-onnx). Run with tools/.venv/bin/python.

  tools/.venv/bin/python tools/voice/scratch_vo.py video-projects/<slug>/script.md
        [--voice am_michael] [--wpm 208] [--fps 25] [--cues-out public/audio/<slug>/vo.cues.json]
        [--lang en-us] [--no-cues]

Writes  video-projects/<slug>/audio/vo_scratch.wav   (48 kHz mono, active-speech RMS -21.5 dBFS)
        video-projects/<slug>/script.parsed.json
        <cues-out>                                    (cue JSON v2, words == script words, `si` = script word index)
        video-projects/<slug>/project.json            (active vo + cues, see tools/voice/README.md)
        public/audio/<slug>/vo.wav                    (staticFile copy; only when cues are written to the default path)
Pace: articulation (speech only, pauses excluded) is steered to --wpm (208 = 3.5 words/s) by adjusting the TTS speed;
pauses: sentence 0.48 s, paragraph 0.9 s, explicit [PAUSE x].
"""
import argparse
import json
import os
import shutil
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import script_markup  # noqa: E402
import vo_common as vc  # noqa: E402

KSR = 24000
MODELS = os.path.join(HERE, "models")


def trim(y, sr=KSR, floor_db=-42, pad=0.012):
    n = int(0.01 * sr)
    m = len(y) // n
    e = 20 * np.log10(np.abs(y[:m * n]).reshape(m, n).max(1) + 1e-9)
    idx = np.where(e > e.max() + floor_db)[0]
    if not len(idx):
        return y
    a = max(0, idx[0] * n - int(pad * sr))
    b = min(len(y), (idx[-1] + 1) * n + int(pad * sr))
    return y[a:b]


def synth_all(kokoro, chunks, voice, lang, speed):
    out = []
    for c in chunks:
        y, sr = kokoro.create(c["text"], voice=voice, speed=speed, lang=lang)
        assert sr == KSR
        out.append(trim(np.asarray(y, np.float64)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--wpm", type=float, default=208.0, help="target articulation rate (208 wpm = 3.5 words/s)")
    ap.add_argument("--fps", type=float, default=vc.DEFAULT_FPS)
    ap.add_argument("--lang", help="default en-us (en-gb for b* voices)")
    ap.add_argument("--cues-out", help="default public/audio/<slug>/vo.cues.json")
    ap.add_argument("--no-cues", action="store_true")
    a = ap.parse_args()

    sp = os.path.abspath(a.script)
    pdir = os.path.dirname(sp)
    slug = os.path.basename(pdir)
    parsed = script_markup.parse(open(sp, encoding="utf-8").read())
    json.dump(parsed, open(os.path.join(pdir, "script.parsed.json"), "w"), indent=1)
    chunks, words = parsed["chunks"], parsed["words"]
    if not chunks:
        sys.exit("script has no spoken words")
    lang = a.lang or ("en-gb" if a.voice.startswith("b") else "en-us")

    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    target_wps = a.wpm / 60.0
    nwords = [c["word_end"] - c["word_start"] + 1 for c in chunks]
    speed = 1.0
    for it in range(4):
        segs = synth_all(k, chunks, a.voice, lang, speed)
        wps = sum(nwords) / (sum(len(s) for s in segs) / KSR)
        print(f"speed {speed:.3f}: articulation {wps:.2f} words/s (target {target_wps:.2f})")
        if abs(wps / target_wps - 1) < 0.02:
            break
        speed = float(np.clip(speed * target_wps / wps, 0.6, 1.8))

    parts = [np.zeros(int(parsed["lead_pause"] * KSR))]
    for c, s in zip(chunks, segs):
        parts += [s, np.zeros(int(c["pause_after"] * KSR))]
    parts.append(np.zeros(int(0.35 * KSR)))
    y24 = np.concatenate(parts)
    from scipy.signal import resample_poly
    y = resample_poly(y24, 2, 1)
    y, g = vc.normalise(y)

    wav = os.path.join(pdir, "audio", "vo_scratch.wav")
    vc.write_wav(wav, y)
    print(f"{vc.rel(wav)}: {len(y) / vc.OUT_SR:.1f} s, speech RMS {vc.speech_rms_db(y):.1f} dBFS, "
          f"{vc.lufs(wav):.1f} LUFS, peak {20 * np.log10(np.abs(y).max()):.1f} dBFS (gain {g:+.1f} dB)")

    default_cues = os.path.join(vc.ROOT, "public", "audio", slug, "vo.cues.json")
    cues_out = os.path.abspath(a.cues_out) if a.cues_out else default_cues
    proj = vc.load_project(pdir)
    proj.update({"slug": slug, "script": "script.md", "fps": a.fps, "vo": vc.rel(wav), "voSource": "scratch",
                 "voice": a.voice})
    if not a.no_cues:
        cues, st = vc.build_cues(wav, words, f"{slug}/vo", a.fps, cues_out)
        print(f"{vc.rel(cues_out)}: {len(cues['words'])} words, {len(cues['phrases'])} phrases; match {st}")
        proj["cues"] = vc.rel(cues_out)
    if not a.no_cues and os.path.abspath(cues_out) == os.path.abspath(default_cues):
        pub = os.path.join(vc.ROOT, "public", "audio", slug, "vo.wav")
        os.makedirs(os.path.dirname(pub), exist_ok=True)
        shutil.copyfile(wav, pub)
        proj["vo_static"] = f"audio/{slug}/vo.wav"
        proj["cues_name"] = f"{slug}/vo"
    vc.save_project(pdir, proj)


if __name__ == "__main__":
    main()
