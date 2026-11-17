#!/usr/bin/env python3
"""Write RECORDING_GUIDE.md for the person who will record the real voice-over.
  tools/.venv/bin/python tools/voice/recording_guide.py video-projects/<slug>   (needs a scratch VO + cues: run scratch_vo.py first)
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vo_common as vc  # noqa: E402


def main():
    pdir = os.path.abspath(sys.argv[1])
    slug = os.path.basename(pdir)
    parsed = vc.load_parsed(pdir)
    proj = vc.load_project(pdir)
    cues = json.load(open(os.path.join(vc.ROOT, proj["cues"])))
    W = cues["words"]
    words, tags = parsed["words"], parsed["tags"]
    tags_at = {}
    for t in tags:
        tags_at.setdefault(t["before_word"], []).append(t)

    def label(w):
        return f"**{w['text']}**" if w["stress"] else w["text"]

    lines = []
    total_words = len(words)
    rows = []
    for c in parsed["chunks"]:
        ws, we = c["word_start"], c["word_end"]
        txt = []
        for i in range(ws, we + 1):
            for t in tags_at.get(i, []):
                txt.append(f"`{t['raw']}`")
            txt.append(label(words[i]))
        dur = W[we]["end"] - W[ws]["onset"]
        rows.append((c, " ".join(txt), dur))
    for t in tags_at.get(total_words, []):
        rows.append((None, f"`{t['raw']}`", 0))

    speech = sum(r[2] for r in rows if r[0])
    out = [f"# Recording guide: {slug}", "",
           f"Scratch take: {cues['duration_s']:.0f} s, {total_words} words, {len(parsed['chunks'])} phrases "
           f"(voice `{proj.get('voice', '?')}`). Your recording replaces it; the picture re-times to your words.", "",
           "## Target pace", "",
           "- Narrator pace **3.5 words/s** (about 208 words/min) while speaking, phrases of roughly 1.6 s (5 to 6 words).",
           "- Pauses: **about 0.5 s** between sentences, **about 0.9 s** between paragraphs, longer where a mark says so. "
           "Pauses are where the picture changes, so do not rush them.",
           "- Being faster or slower than the targets is fine: the edit follows your words. Dropped or changed words "
           "are tolerated, but the word an animation is tied to (anchor) must be said.", "",
           "## How to read the script", "",
           "- **bold** = stress the word (the picture lands on it).",
           "- `(pause 0.6 s)` = leave that much silence. Start each line on a fresh breath.",
           "- `[BEAT ...]`, `[SFX ...]`, `[MUSIC ...]`, `[ARCHIVAL ...]` = production notes, **do not read them aloud**.",
           "- The target time is how long the line took in the scratch take, from first to last word.", "",
           "## Script", ""]
    if parsed["lead_pause"]:
        out.append(f"*(pause {parsed['lead_pause']:.1f} s before the first word)*\n")
    out += ["| # | Line | Target |", "|---|---|---|"]
    n = 0
    for c, txt, dur in rows:
        if c is None:
            out.append(f"| | {txt} | |")
            continue
        n += 1
        row = f"| {n} | {txt} | {dur:.1f} s |"
        out.append(row)
        if c["kind"] == "end":
            continue
        if c["kind"] in ("paragraph", "pause", "sentence"):
            if abs(c["pause_after"] - 0.48) > 0.02:
                out.append(f"| | *(pause {c['pause_after']:.1f} s)* | |")
    out += ["", f"Speaking time in the scratch take: {speech:.0f} s.", "",
            "## Recording setup", "",
            "- **Mono**, **48 kHz WAV** (16 or 24 bit). One file for the whole script (or one per paragraph, say so when you hand them back).",
            "- **Voice only: no music, no effects, no noise reduction that gurgles.** Quiet room, soft furnishings, curtains drawn; "
            "turn off fans and fridges; mic about 10 to 15 cm from your mouth, slightly off-axis (pop filter or a sock over the mic).",
            "- Level: speaking peaks around -6 dBFS, average speech about **-21.5 dBFS** (that is what the mix expects; it is normalised for you afterwards, "
            "so just avoid clipping and avoid being very quiet).",
            "- Record 3 s of room tone at the start and end. Redo a flubbed line by repeating it straight away (leave a clap or a 1 s gap); "
            "keep your best take of a line, but keep the order of the script.",
            "- Warm up: read the first paragraph once out loud before recording.", "",
            "## Hand it back", "",
            f"1. Save as `{slug}_vo.wav`.",
            f"2. Run: `tools/.venv/bin/python tools/studio/recue.py video-projects/{slug} path/to/{slug}_vo.wav`",
            "3. It normalises the level, re-builds the word cues, tells you which animation anchors moved (old frame to new frame) and "
            "which anchor words it could not hear, and switches the project to your voice. The scratch take is kept in `audio/`.", ""]
    path = os.path.join(pdir, "RECORDING_GUIDE.md")
    open(path, "w", encoding="utf-8").write("\n".join(out))
    print(vc.rel(path))


if __name__ == "__main__":
    main()
