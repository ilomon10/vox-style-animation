#!/usr/bin/env python3
"""Swap a project's scratch voice-over for the user's real recording and re-time everything to it.

  tools/.venv/bin/python tools/studio/recue.py video-projects/<slug> path/to/user_vo.wav [--fps 25]

Steps: copy the recording to <project>/audio/vo_user.wav (48 kHz mono, active speech normalised to -21.5 dBFS; the
original is kept as vo_user_original.<ext>), transcribe + align it to the SCRIPT words (tolerates small reading
deviations: substituted / skipped / extra words), rebuild the cue file at the project's cues path (the previous cues are
saved as audio/vo_scratch.cues.json), update project.json (vo, cues, voSource="user"), and report every anchor's
old -> new frame. Anchors come from script.parsed.json tags with anchor="word" and, if present, <project>/storyboard.json
{"anchors": [{"id": "s3-title", "anchor": "filibuster" | "word#2", "word": <script word index>}]}.
A word that could not be matched in the recording is reported NOT FOUND (its cue time is interpolated, so the picture still
runs, but check it); words read differently are reported as APPROX.
"""
import argparse
import json
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "voice"))
import numpy as np  # noqa: E402
import vo_common as vc  # noqa: E402


def anchor_frames(cues, idx):
    for w in cues["words"]:
        if w.get("si") == idx:
            return w["onset_frame"], w.get("match")
    return None, None


def collect_anchors(pdir, parsed):
    words = parsed["words"]
    out = []
    for t in parsed["tags"]:
        if t.get("anchor"):
            out.append({"id": f"script tag {t['id']} {t['raw']}", "word": t["anchor_word"], "label": t["anchor"]})
    sb = os.path.join(pdir, "storyboard.json")
    if os.path.exists(sb):
        for k, a in enumerate(json.load(open(sb)).get("anchors", [])):
            idx = a.get("word")
            lab = a.get("anchor", str(idx))
            if idx is None and a.get("anchor"):
                s, _, nth = a["anchor"].partition("#")
                hits = [w["i"] for w in words if w["norm"] == vc.norm(s)]
                idx = hits[int(nth) - 1] if hits and nth and int(nth) <= len(hits) else (hits[0] if hits and not nth else None)
            out.append({"id": f"storyboard {a.get('id', k)}", "word": idx, "label": lab})
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("vo")
    ap.add_argument("--fps", type=float)
    ap.add_argument("--keep-level", action="store_true", help="do not normalise loudness")
    a = ap.parse_args()

    pdir = os.path.abspath(a.project)
    proj = vc.load_project(pdir)
    slug = os.path.basename(pdir)
    fps = a.fps or proj.get("fps", vc.DEFAULT_FPS)
    parsed = vc.load_parsed(pdir, proj.get("script", "script.md"))
    adir = os.path.join(pdir, "audio")
    os.makedirs(adir, exist_ok=True)

    default_cues = os.path.join(vc.ROOT, "public", "audio", slug, "vo.cues.json")
    cues_path = os.path.join(vc.ROOT, proj["cues"]) if proj.get("cues") else default_cues
    old = json.load(open(cues_path)) if os.path.exists(cues_path) else None
    if old and proj.get("voSource", "scratch") != "user":
        shutil.copyfile(cues_path, os.path.join(adir, "vo_scratch.cues.json"))

    ext = os.path.splitext(a.vo)[1] or ".wav"
    shutil.copyfile(a.vo, os.path.join(adir, f"vo_user_original{ext}"))
    y = vc.read_wav_mono(a.vo)
    before = vc.speech_rms_db(y)
    g = 0.0
    if not a.keep_level:
        y, g = vc.normalise(y)
    wav = os.path.join(adir, "vo_user.wav")
    vc.write_wav(wav, y)
    print(f"{vc.rel(wav)}: {len(y) / vc.OUT_SR:.1f} s, speech RMS {before:.1f} -> {vc.speech_rms_db(y):.1f} dBFS (gain {g:+.1f} dB), {vc.lufs(wav):.1f} LUFS")

    cues, st = vc.build_cues(wav, parsed["words"], f"{slug}/vo", fps, cues_path)
    n = len(parsed["words"])
    print(f"{vc.rel(cues_path)}: alignment exact {st['exact']}, fuzzy {st['fuzzy']}, approx {st['sub']}, not heard {st['interp']} of {n} words")

    report = []
    print(f"\nAnchors ({fps:g} fps; old = previous active VO, new = your recording, frame of the word onset)")
    print(f"{'anchor':58} {'word':14} {'old':>6} {'new':>6} {'delta':>6}  note")
    for an in collect_anchors(pdir, parsed):
        idx = an["word"]
        if idx is None:
            row = {**an, "old": None, "new": None, "note": "NOT FOUND: anchor word is not in the script"}
        else:
            of, _ = anchor_frames(old, idx) if old else (None, None)
            nf, m = anchor_frames(cues, idx)
            note = {"interp": "NOT FOUND in recording (interpolated)", "sub": "APPROX (read differently)"}.get(m, "")
            row = {**an, "word_text": parsed["words"][idx]["text"], "old": of, "new": nf, "note": note}
        report.append(row)
        d = "" if row["old"] is None or row["new"] is None else f"{row['new'] - row['old']:+d}"
        print(f"{an['id'][:58]:58} {str(row.get('word_text', an['label']))[:14]:14} {str(row['old']):>6} {str(row['new']):>6} {d:>6}  {row['note']}")
    lost = [r for r in report if r["note"].startswith("NOT FOUND")]
    json.dump({"fps": fps, "alignment": st, "anchors": report}, open(os.path.join(adir, "recue_report.json"), "w"), indent=1)
    print(f"\n{len(report)} anchors, {len(lost)} not found" + (" -> fix before rendering" if lost else ""))

    proj.update({"slug": slug, "fps": fps, "vo": vc.rel(wav), "cues": vc.rel(cues_path), "voSource": "user"})
    if os.path.abspath(cues_path) == os.path.abspath(default_cues):
        shutil.copyfile(wav, os.path.join(vc.ROOT, "public", "audio", slug, "vo.wav"))
        proj["vo_static"] = f"audio/{slug}/vo.wav"
        proj["cues_name"] = f"{slug}/vo"
    vc.save_project(pdir, proj)
    print(f"project.json: vo -> {proj['vo']}")


if __name__ == "__main__":
    main()
