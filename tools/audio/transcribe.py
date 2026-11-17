#!/usr/bin/env python3
"""Word-level transcript with timestamps (faster-whisper, CPU, int8), segment by segment.

  tools/.venv/bin/python tools/audio/transcribe.py earworm [--model base.en] [--vad]

Reads analysis/segments/<id>_segments.json and the segment WAVs analysis/audio/<id>_<S>.wav,
transcribes each segment separately (low memory), offsets the times by the segment start and writes
  analysis/audio/<id>_words.json   [{word, start, end, prob, frame_start, frame_end, seg}]
  analysis/audio/<id>_phrases.json [{text, start, end, frame_start, frame_end}]  (whisper segments)
  analysis/audio/<id>_transcript.md  readable transcript with timecodes

--vad: faster-whisper's Silero VAD filter (min silence 500 ms) skips non-speech first; use it for long
spoken videos (fewer hallucinations in silence/music). Default unchanged (no VAD).

Notes: sung lyrics inside music excerpts are transcribed too (often with lower probability);
interpret them with the audio features. Word timestamps are ±30–80 ms.
Install: tools/.venv/bin/pip install faster-whisper   (model weights download on first run)
"""
import argparse
import json
import os
import subprocess
import sys

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--model", default="base.en")
    ap.add_argument("--vad", action="store_true", help="voice-activity filter (vad_filter=True, min silence 500 ms)")
    a = ap.parse_args()
    from faster_whisper import WhisperModel

    segs = json.load(open(os.path.join(ROOT, "analysis", "segments", f"{a.id}_segments.json")))
    fps = segs["fps"]
    model = WhisperModel(a.model, device="cpu", compute_type="int8", cpu_threads=4)
    words, phrases = [], []
    for s in segs["segments"]:
        wav = os.path.join(ROOT, "analysis", "audio", f"{a.id}_{s['id']}.wav")
        # decode with ffmpeg to 16 kHz mono float32 (faster-whisper's PyAV path breaks with newer PyAV)
        pcm = subprocess.check_output(["ffmpeg", "-v", "error", "-i", wav, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"])
        audio = np.frombuffer(pcm, np.float32)
        it, info = model.transcribe(audio, language="en", word_timestamps=True, beam_size=5,
                                    condition_on_previous_text=False, vad_filter=a.vad,
                                    vad_parameters={"min_silence_duration_ms": 500} if a.vad else None)
        for seg in it:
            st, en = s["t0"] + seg.start, s["t0"] + seg.end
            phrases.append({"text": seg.text.strip(), "start": round(st, 3), "end": round(en, 3),
                            "frame_start": int(round(st * fps)), "frame_end": int(round(en * fps)),
                            "seg": s["id"], "avg_logprob": round(seg.avg_logprob, 3),
                            "no_speech_prob": round(seg.no_speech_prob, 3)})
            for w in seg.words or []:
                ws, we = s["t0"] + w.start, s["t0"] + w.end
                words.append({"word": w.word.strip(), "start": round(ws, 3), "end": round(we, 3),
                              "prob": round(w.probability, 3), "frame_start": int(round(ws * fps)),
                              "frame_end": int(round(we * fps)), "seg": s["id"]})
        print(f"segment {s['id']}: {sum(1 for w in words if w['seg'] == s['id'])} words", flush=True)
    out = os.path.join(ROOT, "analysis", "audio")
    json.dump(words, open(os.path.join(out, f"{a.id}_words.json"), "w"), indent=0)
    json.dump(phrases, open(os.path.join(out, f"{a.id}_phrases.json"), "w"), indent=1)
    with open(os.path.join(out, f"{a.id}_transcript.md"), "w") as fh:
        fh.write(f"# {a.id} — transcript (faster-whisper {a.model}, word timestamps)\n\n")
        fh.write("| start s (frame) | end s | text | no_speech_p |\n|---|---|---|---|\n")
        for p in phrases:
            fh.write(f"| {p['start']:.2f} (f{p['frame_start']}) | {p['end']:.2f} | {p['text']} | {p['no_speech_prob']} |\n")
    print(f"{len(words)} words, {len(phrases)} phrases", file=sys.stderr)


if __name__ == "__main__":
    main()
