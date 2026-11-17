#!/usr/bin/env python3
"""Parse a narration script (script.md) into script.parsed.json.

  tools/.venv/bin/python tools/voice/script_markup.py video-projects/<slug>/script.md [-o script.parsed.json]

Markup (one line of narration = plain text; blank line = paragraph break):
  plain text                  spoken
  *stressed*  *two words*     spoken, flagged stress (bold in the recording guide)
  [PAUSE 0.6]                 explicit silence (seconds); replaces the default pause at that spot
  [BEAT recipe=stat-pop anchor="filibuster" ...]   NOT spoken; kept with its position
  [BEAT kind=phrase|highlight|lowerThird ...]   optional event kind of the beat (storyboard event kinds, src/studio/types.ts):
                              phrase = cut on a phrase's first word (-3 f), highlight = keyword highlighter (+1 f),
                              lowerThird = lower third on the first full-frame cut (+2 f). Any other kind value is rejected.
  [MUSIC ...] [SFX ...] [ARCHIVAL "clip description" ...]   same
  # heading / // comment      ignored (not narration)
Tag attributes: key=value or key="quoted value". `anchor="word"` links the tag to a spoken word:
the nearest occurrence at/after the tag position (searching up to 12 words ahead, then 12 back, then
anywhere); `anchor="word#2"` = 2nd occurrence in the whole script.

Output JSON:
  words:  [{i, text, norm, stress, sentence, paragraph}]       text keeps punctuation (what TTS/mic reads)
  chunks: [{id, word_start, word_end, text, pause_after, kind}] kind = sentence | pause | paragraph | end
          (a chunk is synthesised/recorded in one breath; pause_after is the silence that follows it)
  lead_pause: seconds of silence before the first word
  tags:   [{id, type, raw, attrs, before_word, anchor, anchor_word}]  before_word = index of the next spoken
          word (== len(words) for a tag at the end); anchor_word = resolved word index or null
"""
import argparse
import json
import re
import sys

PAUSE_SENTENCE = 0.48   # docs/style-guide/11-audio-sync.md §8 median phrase pause
PAUSE_PARAGRAPH = 0.90
TAG_RE = re.compile(r"\[(PAUSE|BEAT|MUSIC|SFX|ARCHIVAL)\b([^\]]*)\]", re.I)
ATTR_RE = re.compile(r'([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|(\S+))')
BEAT_KINDS = {"phrase", "highlight", "lowerThird"}  # new profile kinds; the Earworm kinds (cut, object, ...) are set in the storyboard
ABBREV = {"mr", "mrs", "ms", "dr", "sen", "rep", "st", "vs", "gov", "gen", "jr", "sr", "no", "etc"}


def norm(tok):
    return re.sub(r"[^a-z0-9']", "", tok.lower().replace("’", "'")).strip("'")


def is_sentence_end(tok):
    t = tok.rstrip("\"')”’*]")
    if not t or t[-1] not in ".?!…":
        return False
    if t[-1] == ".":
        if re.search(r"(?:^|\W)(?:[A-Za-z]\.){2,}$", t) or norm(t) in ABBREV:
            return False
    return True


def parse_attrs(s):
    return {m.group(1).lower(): (m.group(2) if m.group(2) is not None else m.group(3)) for m in ATTR_RE.finditer(s)}


def parse(text):
    words, tags, pauses = [], [], []   # pauses: (before_word, seconds)
    para = 0
    sent = 0
    para_has_words = False
    stress = False
    para_ends = set()   # word index of the last word of each paragraph
    sent_ends = set()

    def close_paragraph():
        nonlocal para, para_has_words, sent
        if para_has_words:
            para_ends.add(len(words) - 1)
            sent_ends.add(len(words) - 1)
            para += 1
            sent += 1
        para_has_words = False

    for line in text.splitlines():
        s = line.strip()
        if not s:
            close_paragraph()
            continue
        if s.startswith("#") or s.startswith("//"):
            continue
        pos = 0
        pieces = []
        for m in TAG_RE.finditer(s):
            pieces.append(("text", s[pos:m.start()]))
            pieces.append(("tag", m))
            pos = m.end()
        pieces.append(("text", s[pos:]))
        for kind, val in pieces:
            if kind == "tag":
                typ = val.group(1).upper()
                body = val.group(2).strip()
                if typ == "PAUSE":
                    try:
                        pauses.append((len(words), float(body.split()[0])))
                    except (IndexError, ValueError):
                        sys.exit(f"bad [PAUSE] tag: {val.group(0)}")
                    continue
                attrs = parse_attrs(body)
                if typ == "BEAT" and "kind" in attrs and attrs["kind"] not in BEAT_KINDS:
                    sys.exit(f"bad [BEAT] kind={attrs['kind']!r} (use one of {', '.join(sorted(BEAT_KINDS))}): {val.group(0)}")
                if typ == "ARCHIVAL":
                    q = re.match(r'\s*"([^"]*)"', body)
                    if q:
                        attrs.setdefault("query", q.group(1))
                tags.append({"id": len(tags), "type": typ, "raw": val.group(0), "attrs": attrs,
                             "before_word": len(words), "anchor": attrs.get("anchor")})
                continue
            for tok in val.split():
                # toggle stress on each * in the token; punctuation may follow the closing *: "*Greenwich*."
                m = re.match(r"^(\**)(.*?)(\**)([.,;:!?\"')\]]*)$", tok)
                lead, trail = len(m.group(1)), len(m.group(3))
                if lead:
                    stress = not stress if lead % 2 else stress
                core = m.group(2) + m.group(4)
                w_stress = stress or bool(lead % 2) or bool(trail % 2)
                if trail % 2:
                    stress = False
                if not core:
                    continue
                words.append({"i": len(words), "text": core, "norm": norm(core), "stress": w_stress,
                              "sentence": sent, "paragraph": para})
                para_has_words = True
                if is_sentence_end(core):
                    sent_ends.add(len(words) - 1)
                    sent += 1
        stress = False
    close_paragraph()
    # words after a sentence end belong to the next sentence: recompute sentence ids from sent_ends
    sid = 0
    for w in words:
        w["sentence"] = sid
        if w["i"] in sent_ends:
            sid += 1

    n = len(words)
    pause_at = {}
    lead = 0.0
    for before, sec in pauses:
        if before == 0:
            lead += sec
        else:
            pause_at[before] = pause_at.get(before, 0.0) + sec
    # chunk boundaries after word k when: sentence end, paragraph end, or explicit pause before k+1
    chunks = []
    start = 0
    for k in range(n):
        explicit = pause_at.get(k + 1)
        if k in sent_ends or explicit is not None or k == n - 1:
            if k in para_ends or k == n - 1:
                kind, dflt = ("end" if k == n - 1 else "paragraph"), PAUSE_PARAGRAPH
            elif k in sent_ends:
                kind, dflt = "sentence", PAUSE_SENTENCE
            else:
                kind, dflt = "pause", PAUSE_SENTENCE
            chunks.append({"id": len(chunks), "word_start": start, "word_end": k,
                           "text": " ".join(w["text"] for w in words[start:k + 1]),
                           "pause_after": 0.0 if kind == "end" and explicit is None else (explicit if explicit is not None else dflt),
                           "kind": kind})
            start = k + 1
    # resolve anchors
    for t in tags:
        t["anchor_word"] = None
        a = t["anchor"]
        if not a:
            continue
        nth = None
        if "#" in a:
            a, nth = a.rsplit("#", 1)
            nth = int(nth)
        want = [norm(x) for x in a.split()]
        hits = [w["i"] for w in words if w["norm"] == want[0]
                and [x["norm"] for x in words[w["i"]:w["i"] + len(want)]] == want]
        if not hits:
            continue
        if nth:
            t["anchor_word"] = hits[nth - 1] if nth <= len(hits) else None
            continue
        b = t["before_word"]
        ahead = [h for h in hits if b <= h <= b + 12]
        back = [h for h in hits if b - 12 <= h < b]
        t["anchor_word"] = (ahead[0] if ahead else back[-1] if back else min(hits, key=lambda h: abs(h - b)))
    return {"version": 1, "words": words, "chunks": chunks, "lead_pause": lead, "tags": tags}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("-o", help="default: script.parsed.json next to the script")
    a = ap.parse_args()
    out = a.o or re.sub(r"[^/]*$", "script.parsed.json", a.script, count=1)  # count=1: Python >= 3.7 also replaces the empty match at the end
    p = parse(open(a.script, encoding="utf-8").read())
    json.dump(p, open(out, "w"), indent=1)
    miss = [t["raw"] for t in p["tags"] if t["anchor"] and t["anchor_word"] is None]
    print(f"{out}: {len(p['words'])} words, {len(p['chunks'])} chunks, {len(p['tags'])} tags")
    for m in miss:
        print(f"  WARNING anchor word not in script: {m}")


if __name__ == "__main__":
    main()
