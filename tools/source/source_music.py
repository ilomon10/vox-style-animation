#!/usr/bin/env python3
"""Find, download and rank open-licence music / sound effects for a project.

  tools/.venv/bin/python tools/source/source_music.py --mood "soul ballad" --bpm 60-90 --min-len 60 \
      --project video-projects/demo [--licenses cc0,by,pd] [--n 10]
  tools/.venv/bin/python tools/source/source_music.py --sfx "door slam" --project video-projects/demo

Sources: Openverse audio (Jamendo/Freesound/Wikimedia/...), Wikimedia Commons audio, Internet Archive
(only items whose licenseurl is public-domain / CC0 / CC BY / CC BY-SA). Files are <= 20 MB, converted to
48 kHz stereo WAV (first 4 min), analysed with tools/audio (tempo map, loudness, energy curve) and ranked.
Writes <project>/audio/music/candidates.md (or audio/sfx/) and appends CREDITS.md.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "audio"))
import common as C  # noqa: E402
import audio_features as af  # noqa: E402
import make_cues as mc  # noqa: E402

MAX_BYTES = 20 * 1024 * 1024
AUDIO_EXT = (".mp3", ".ogg", ".oga", ".opus", ".flac", ".wav", ".m4a")


def cand(**k):
    base = dict(source="", src_id="", title="", creator="", page_url="", file_url="", duration=None, size=None,
                lic=None, lic_name="", lic_url="", credit_raw="")
    base.update(k)
    return base


# ---- sources ---------------------------------------------------------------------------------
def openverse_audio(terms, want, kind):
    out, seen = [], set()
    for q in terms:
        try:
            r = C.get("https://api.openverse.org/v1/audio/", params=dict(q=q, license_type="commercial", page_size=20), tries=2).json()
        except Exception as e:  # noqa: BLE001
            print(f"  openverse: {str(e)[:80]}", file=sys.stderr)
            continue
        for x in r.get("results", []):
            if x["id"] in seen or not x.get("url"):
                continue
            seen.add(x["id"])
            cat = (x.get("category") or "")
            if kind == "music" and cat and cat != "music":
                continue
            code = C.norm_license(f"CC {x['license']} {x.get('license_version', '')}" if x["license"] not in ("cc0", "pdm") else x["license"].replace("pdm", "public domain"), x.get("license_url") or "")
            name = {"cc0": "CC0 1.0", "pd": "Public Domain Mark"}.get(code, f"CC {x['license'].upper()} {x.get('license_version', '')}".strip())
            out.append(cand(source="openverse", src_id=x["id"], title=x.get("title", ""), creator=x.get("creator") or "",
                            page_url=x.get("foreign_landing_url") or x["url"], file_url=x["url"],
                            duration=(x.get("duration") or 0) / 1000 or None, size=x.get("filesize"),
                            lic=code, lic_name=name, lic_url=x.get("license_url") or "",
                            credit_raw=f"{x.get('creator')} | {x.get('provider')} | {x['url']}"))
    return out


def commons_audio(terms, want):
    out, seen = [], set()
    for q in terms:
        try:
            r = C.get("https://commons.wikimedia.org/w/api.php", params=dict(
                action="query", format="json", generator="search", gsrsearch=f"{q} filetype:audio", gsrnamespace=6,
                gsrlimit=want * 2, prop="imageinfo", iiprop="url|size|mime|extmetadata")).json()
        except Exception as e:  # noqa: BLE001
            print(f"  commons: {str(e)[:80]}", file=sys.stderr)
            continue
        for p in sorted((r.get("query") or {}).get("pages", {}).values(), key=lambda p: p.get("index", 0)):
            ii = (p.get("imageinfo") or [{}])[0]
            if p["title"] in seen or not ii.get("mime", "").startswith(("audio/", "application/ogg")) or "midi" in ii.get("mime", ""):
                continue
            seen.add(p["title"])
            md = ii.get("extmetadata", {})
            val = lambda k: C.strip_html((md.get(k) or {}).get("value", ""))  # noqa: E731
            name = val("LicenseShortName") or val("UsageTerms")
            out.append(cand(source="commons", src_id=p["title"], title=re.sub(r"^File:|\.\w+$", "", p["title"]), creator=val("Artist"),
                            page_url=ii["descriptionurl"], file_url=ii["url"], size=ii.get("size"), lic=C.norm_license(name, val("LicenseUrl")),
                            lic_name=name, lic_url=val("LicenseUrl"), credit_raw=f"{val('Credit')} | {val('Artist')}"))
    return out


def archive_audio(terms, want):
    out, seen = [], set()
    q = " OR ".join(re.sub(r"[^\w ]", "", t) for t in terms)
    lic = "(*publicdomain* OR *creativecommons*)"  # refined client-side (norm_license drops NC/ND)
    try:
        r = C.get("https://archive.org/advancedsearch.php", params={
            "q": f"({q}) AND mediatype:audio AND licenseurl:{lic} AND NOT subject:(sermon OR lecture OR podcast OR audiobook)",
            "fl[]": ["identifier", "title", "creator", "licenseurl"], "rows": want * 6, "output": "json"}).json()
        if "response" not in r:
            raise RuntimeError(str(r)[:80])
    except Exception as e:  # noqa: BLE001
        print(f"  archive.org: {str(e)[:80]}", file=sys.stderr)
        return out
    for d in r["response"]["docs"]:
        code = C.norm_license("", d.get("licenseurl", ""))
        if not code or d["identifier"] in seen:
            continue
        seen.add(d["identifier"])
        try:
            files = C.get(f"https://archive.org/metadata/{d['identifier']}/files").json().get("result", [])
        except Exception:  # noqa: BLE001
            continue
        aud = [f for f in files if f.get("name", "").lower().endswith(AUDIO_EXT) and int(f.get("size") or 0) <= MAX_BYTES and int(f.get("size") or 0) > 300_000]
        # prefer the longest small file (full track rather than a clip)
        aud.sort(key=lambda f: -float(f.get("length") or 0) if str(f.get("length", "")).replace(".", "").isdigit() else 0)
        if not aud:
            continue
        f = aud[0]
        try:
            dur = float(f["length"])
        except (KeyError, ValueError):
            dur = None
        creator = d.get("creator") or ""
        out.append(cand(source="archive.org", src_id=d["identifier"], title=d.get("title", ""), creator=", ".join(creator) if isinstance(creator, list) else creator,
                        page_url=f"https://archive.org/details/{d['identifier']}",
                        file_url=f"https://archive.org/download/{d['identifier']}/{requests_quote(f['name'])}",
                        duration=dur, size=int(f["size"]), lic=code,
                        lic_name={"pd": "Public domain / CC0 (per item licenseurl)", "cc0": "CC0 1.0"}.get(code, code.upper().replace("-", " ")),
                        lic_url=d.get("licenseurl", ""), credit_raw=d.get("creator", "")))
    return out


def requests_quote(name):
    from urllib.parse import quote
    return quote(name)


# ---- analysis --------------------------------------------------------------------------------
def to_wav(src, dst):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vn", "-t", "240", "-ar", "48000", "-ac", "2", dst], check=True)


def probe_duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode().strip())


def loudness(path):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    t = p.stderr.split("Summary:")[-1]
    g = lambda k: float((re.search(rf"{k}:\s+(-?[\d.]+)", t) or [0, "nan"])[1])  # noqa: E731
    return g("I"), g("LRA")


def analyse(path, full_dur):
    y = af.load_audio(path, 0, 180)
    S = af.stft_mag(y)
    freqs = np.fft.rfftfreq(af.N_FFT, 1 / af.SR)
    fs = af.SR / af.HOP
    env = af.onset_envelope(S, freqs)
    bpm, cands = af.tempo_estimate(env, fs)
    tmap = mc.local_tempo_map(env, fs)
    tb = np.array([b for _, b in tmap])
    pw = S.astype(np.float64) ** 2
    tot = pw.sum(1) + 1e-12
    mid = pw[:, (freqs >= 300) & (freqs < 3000)].sum(1)
    # energy curve: dB re peak per 5 s
    step = int(5 * fs)
    curve = [round(float(10 * np.log10(tot[i:i + step].mean() / tot.max())), 1) for i in range(0, len(tot) - step + 1, step)] or [0.0]
    lufs, lra = loudness(path)
    return dict(duration=round(full_dur, 1), bpm=round(bpm, 1), bpm_alts=[round(c[0], 1) for c in cands[1:4]],
                tempo_median=round(float(np.median(tb)), 1), tempo_spread=round(float(np.std(tb) / (np.median(tb) + 1e-9)), 3),
                lufs=lufs, lra=lra, mid_share_db=round(float(10 * np.log10(mid.sum() / tot.sum())), 1), energy_curve=curve)


def tempo_fit(a, lo, hi):
    best, how = 0.0, ""
    for c in [a["bpm"]] + a["bpm_alts"][:2]:
        for mul, tag in ((1, ""), (0.5, " (x0.5)"), (2, " (x2)")):
            b = c * mul
            d = 0 if lo <= b <= hi else min(abs(b - lo), abs(b - hi))
            f = max(0.0, 1 - d / 20) * (1.0 if c == a["bpm"] else 0.8) * (1.0 if mul == 1 else 0.85)
            if f > best:
                best, how = f, f"{b:.0f}{tag}"
    return best, how


def rank(a, lo, hi, min_len):
    tf, how = tempo_fit(a, lo, hi)
    lf = min(1.0, a["duration"] / min_len) if min_len else 1.0
    stab = max(0.0, 1 - a["tempo_spread"] * 5)
    # underscore-friendly: modest dynamics and little energy in the speech band
    under = max(0.0, 1 - max(0, a["lra"] - 6) / 12) * 0.6 + max(0.0, min(1.0, (-a["mid_share_db"]) / 6)) * 0.4 if not np.isnan(a["lra"]) else 0.5
    return round(0.45 * tf + 0.2 * lf + 0.2 * stab + 0.15 * under, 3), how


def spark(curve):
    bars = "▁▂▃▄▅▆▇█"
    lo, hi = min(curve), max(curve)
    return "".join(bars[int((v - lo) / (hi - lo + 1e-9) * 7)] for v in curve)


# ---- main ------------------------------------------------------------------------------------
def terms_for(text, extra=""):
    words = [w for w in re.findall(r"[A-Za-z]{3,}", text)]
    ts = [f"{text} {extra}".strip()] + ([f"{w} {extra}".strip() for w in words] if len(words) > 1 else [])
    return ts[:4]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--mood", default=None)
    ap.add_argument("--sfx", default=None)
    ap.add_argument("--bpm", default="60-100")
    ap.add_argument("--min-len", type=float, default=60)
    ap.add_argument("--project", required=True)
    ap.add_argument("--licenses", default="cc0,by,pd")
    ap.add_argument("--n", type=int, default=10)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if bool(a.mood) == bool(a.sfx):
        ap.error("give exactly one of --mood / --sfx")
    is_sfx = bool(a.sfx)
    lics = C.parse_licenses(a.licenses) | ({"cc0", "pd"} & C.parse_licenses(a.licenses))
    lo, hi = (float(x) for x in a.bpm.split("-")) if "-" in a.bpm else (float(a.bpm) - 5, float(a.bpm) + 5)
    query = a.sfx if is_sfx else a.mood

    ts = terms_for(query, "" if is_sfx else "")
    res = openverse_audio(ts, a.n, "sfx" if is_sfx else "music") + commons_audio(ts[:2], a.n)
    if not is_sfx:
        res += archive_audio(ts, a.n)
    kept, rej = [], []
    for c in res:
        why = None
        if c["lic"] is None or c["lic"] not in lics:
            why = f"licence {c['lic_name'] or 'unknown'}"
        elif C.is_news_agency(c["credit_raw"], c["creator"]):
            why = "news-agency credit"
        elif c["size"] and c["size"] > MAX_BYTES:
            why = "over 20 MB"
        elif not is_sfx and c["duration"] and c["duration"] < a.min_len * 0.9:
            why = f"too short ({c['duration']:.0f}s)"
        (rej if why else kept).append((c, why) if why else c)
    print(f"{query!r}: {len(res)} raw -> {len(kept)} usable, {len(rej)} rejected "
          f"(" + ", ".join(f"{s}={sum(1 for c in res if c['source'] == s)}" for s in ('openverse', 'commons', 'archive.org')) + ")")
    # interleave sources
    by = {}
    for c in kept:
        by.setdefault(c["source"], []).append(c)
    order = []
    while any(by.values()):
        for k in list(by):
            if by[k]:
                order.append(by[k].pop(0))
    if a.dry_run:
        for c in order:
            print(f"  [{c['source']:<11}] {c['lic']:<5} {(c['duration'] or 0):>5.0f}s  {c['title'][:55]!r} {c['page_url']}")
        return

    sub = "sfx" if is_sfx else "music"
    outdir = os.path.join(a.project, "audio", sub, "candidates")
    os.makedirs(outdir, exist_ok=True)
    results = []
    tmp = tempfile.mkdtemp(prefix="srcmusic_")
    for c in order:
        if len(results) >= a.n:
            break
        cid = f"{c['source'].replace('.', '')}_{C.slug(c['title'], 30)}"
        try:
            r = C.get(c["file_url"], stream=True, timeout=90)
            raw = os.path.join(tmp, "dl" + (os.path.splitext(c["file_url"].split("?")[0])[1] or ".mp3"))
            n = 0
            with open(raw, "wb") as fh:
                for chunk in r.iter_content(1 << 16):
                    n += len(chunk)
                    if n > MAX_BYTES:
                        raise RuntimeError("over 20 MB")
                    fh.write(chunk)
            wav = os.path.join(outdir, f"{cid}.wav")
            to_wav(raw, wav)
            dur = probe_duration(wav)
            full = probe_duration(raw)
            if not is_sfx and full < a.min_len:
                os.remove(wav)
                print(f"  skip {cid}: {full:.0f}s < min-len")
                continue
            info = analyse(wav, full)
            score, how = rank(info, lo, hi, a.min_len) if not is_sfx else (round(1 / (1 + info["duration"] / 5), 3), "")
        except Exception as e:  # noqa: BLE001
            print(f"  skip {cid}: {str(e)[:90]}", file=sys.stderr)
            continue
        c.update(info=info, score=score, tempo_match=how, wav=os.path.relpath(wav, a.project), id=cid)
        results.append(c)
        print(f"  {cid}: {info['duration']}s bpm={info['bpm']} lufs={info['lufs']} score={score}")

    results.sort(key=lambda c: -c["score"])
    md = [f"# {'SFX' if is_sfx else 'Music'} candidates: {query}", "",
          f"Searched {time.strftime('%Y-%m-%d')}; licences {a.licenses}" + ("" if is_sfx else f"; target {lo:.0f}-{hi:.0f} BPM, >= {a.min_len:.0f} s") + ". "
          "WAVs are 48 kHz stereo (first 4 min) in `candidates/`.", ""]
    if not results:
        md += ["**No candidates found.** Write `MUSIC_WANTED.md` (see `make_bed.write_music_wanted`) or render a bed with `make_bed.py`."]
    else:
        md += ["| # | score | title | creator | licence | dur s | BPM (fit) | LUFS | LRA | source |", "|---|---|---|---|---|---|---|---|---|---|"]
        for i, c in enumerate(results, 1):
            f = c["info"]
            md.append(f"| {i} | {c['score']} | [{c['title'][:40]}]({c['page_url']}) | {c['creator'][:25]} | {c['lic_name']} | {f['duration']:.0f} | "
                      f"{f['bpm']} ({c['tempo_match'] or '-'}) | {f['lufs']:.1f} | {f['lra']:.1f} | {c['source']} |")
        md.append("")
        for i, c in enumerate(results, 1):
            f = c["info"]
            att = C.make_attribution(c["title"], c["creator"], c["source"], c["lic"], c["lic_name"], c["lic_url"], c["page_url"])
            c["attribution"] = att
            md += [f"## {i}. {c['title']}", f"- file: `{c['wav']}`", f"- licence: {c['lic_name']} {c['lic_url']}  (attribution required: {'yes' if c['lic'] in ('by', 'by-sa') else 'no'})",
                   f"- attribution: {att}",
                   f"- tempo {f['bpm']} BPM (alts {f['bpm_alts']}), local-tempo median {f['tempo_median']}, spread {f['tempo_spread']:.1%} | "
                   f"{f['lufs']:.1f} LUFS, LRA {f['lra']:.1f} | speech-band share {f['mid_share_db']} dB",
                   f"- energy (5 s steps, dB re peak): `{spark(f['energy_curve'])}`", ""]
    open(os.path.join(a.project, "audio", sub, "candidates.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")
    json.dump([{k: v for k, v in c.items() if k != "credit_raw"} for c in results], open(os.path.join(a.project, "audio", sub, "candidates.json"), "w"), indent=1, ensure_ascii=False)
    if results:
        C.append_credits(a.project, [f"`{c['wav']}` (candidate, not yet chosen): {c['attribution']}" for c in results], heading=f"{'SFX' if is_sfx else 'Music'} candidates: {query}")
    print(f"wrote {a.project}/audio/{sub}/candidates.md ({len(results)} candidates)")


if __name__ == "__main__":
    main()
