#!/usr/bin/env python3
"""Download official reference videos (YouTube) for PRIVATE analysis and register them for tools/analysis.

  tools/.venv/bin/python -I tools/source/fetch_reference.py VIDEO[=ANALYSIS_ID] ... \
      [--set vox-sample] [--max-height 1080] [--any-channel] [--style TEXT] [--min-sec 240] [--dry-run]

VIDEO = YouTube URL or 11-char id. ANALYSIS_ID defaults to vox_<first two title words> (ascii, lowercase).
Per video:
  1. extract_info(download=False); refuse a channel not in the allowlist (Vox) unless --any-channel;
     skip videos shorter than 240 s.
  2. download H.264 (<= max-height) + m4a -> mp4, English subtitles (manual preferred, auto fallback) as .vtt,
     .info.json and thumbnail -> reference/<set>/<ytid>_<slug>.{mp4,en.vtt,info.json,jpg|webp}
     (skipped when the mp4 already exists with the size recorded in the manifest)
  3. ffprobe: exact fps (r_frame_rate fraction + float), frame count, duration; if the video is variable frame
     rate it is re-encoded to CFR (libx264 crf 16, audio copy) under the analysis lock (tools/lock.sh out/.analysis.lock)
  4. reference/<set>/manifest.json (merged) and tools/analysis/sources.json (same entry format as before).

Reference/ is git-ignored private material: analysis only, never publish or commit it.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from fractions import Fraction

import yt_dlp

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from media import probe, reencode_cfr  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
SOURCES = os.path.join(ROOT, "tools", "analysis", "sources.json")
VOX_CHANNEL = "UCLXo7UDZvByw2ixzpQCufnA"
MIN_SEC = 240
LOCK = os.path.join(ROOT, "out", ".analysis.lock")


def slugify(text, max_words=None, max_len=60):
    s = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    words = re.findall(r"[a-z0-9]+", s)
    if max_words:
        words = words[:max_words]
    return "_".join(words)[:max_len].strip("_")


def atomic_json(path, obj):
    tmp = path + ".tmp"
    with open(tmp, "w") as fh:
        json.dump(obj, fh, indent=1, ensure_ascii=False)
        fh.write("\n")
    os.replace(tmp, path)


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def pick_caption_track(info):
    """('manual', key) for the manual English track (en, en-US, en-GB, …), else ('auto', 'en'), else (None, None).
    Asking yt-dlp for plain "en" with auto captions allowed silently takes the AUTO track whenever the manual one
    is filed under "en-US", so the track is chosen here explicitly."""
    manual = sorted(k for k in (info.get("subtitles") or {}) if k == "en" or k.startswith("en-"))
    if manual:
        return "manual", ("en" if "en" in manual else manual[0])
    if "en" in (info.get("automatic_captions") or {}):
        return "auto", "en"
    return None, None


def fetch_subs(url, stem, base, info, tries=3):
    """Best-effort English captions saved as <stem>.en.vtt. Returns 'manual', 'auto' or None. Retries with a growing
    pause because YouTube answers bursts of caption requests with HTTP 429; never blocks the video itself."""
    kind, lang = pick_caption_track(info)
    if not kind:
        return None
    opts = dict(base, skip_download=True, subtitleslangs=[lang], subtitlesformat="vtt", outtmpl=stem + ".%(ext)s",
                writesubtitles=kind == "manual", writeautomaticsub=kind == "auto")
    for n in range(1, tries + 1):
        try:
            with yt_dlp.YoutubeDL(opts) as y:
                y.download([url])
            got = f"{stem}.{lang}.vtt"
            if not os.path.exists(got):
                return None
            if lang != "en":
                os.replace(got, stem + ".en.vtt")
            return kind
        except Exception as e:  # noqa: BLE001 - yt-dlp raises DownloadError subclasses and plain errors
            wait = 30 * n
            print(f"  captions attempt {n}/{tries} failed: {e}" + (f"; retrying in {wait} s" if n < tries else ""))
            if n < tries:
                time.sleep(wait)
    return None


def fetch(item, a, manifest):
    """Fetch one video. Returns True when it is downloaded and registered (or on a dry run), False when refused or skipped."""
    spec, _, aid = item.partition("=")
    url = spec if spec.startswith("http") else f"https://www.youtube.com/watch?v={spec}"
    base = {"quiet": True, "no_warnings": True, "noplaylist": True}
    with yt_dlp.YoutubeDL(base) as y:
        info = y.extract_info(url, download=False)
    yid, title = info["id"], info["title"]
    chan = info.get("channel_id")
    print(f"{yid}: {title!r} · {info.get('channel')} · {info['duration']} s · {info.get('upload_date')}")
    if chan != VOX_CHANNEL and not a.any_channel:
        print(f"  REFUSED: channel_id {chan} is not the Vox channel (use --any-channel to override)")
        return False
    if info["duration"] < a.min_sec:
        print(f"  SKIPPED: {info['duration']} s is shorter than {a.min_sec} s (lower --min-sec for Shorts)")
        return False
    aid = aid or "vox_" + slugify(title, 2)
    slug = slugify(title)
    if a.dry_run:
        print(f"  dry run: would save reference/{a.set}/{yid}_{slug}.mp4 as analysis id {aid}")
        return True
    outdir = os.path.join(ROOT, "reference", a.set)
    os.makedirs(outdir, exist_ok=True)
    stem = os.path.join(outdir, f"{yid}_{slug}")
    mp4 = stem + ".mp4"
    prev = next((m for m in manifest if m["youtube_id"] == yid), None)
    if prev and os.path.exists(mp4) and os.path.getsize(mp4) == prev.get("size") and prev.get("sha256"):
        print("  already downloaded (size matches manifest), skipping download")
        pr = None
    else:
        h = a.max_height
        # Captions are fetched separately (fetch_subs): YouTube rate-limits caption requests (HTTP 429), and a
        # caption error inside this call would abort the video download too.
        opts = dict(base, quiet=False, noprogress=True, outtmpl=stem + ".%(ext)s", merge_output_format="mp4",
                    format=f"bv*[vcodec^=avc1][height<={h}]+ba[ext=m4a]/b[height<={h}]",
                    writeinfojson=True, writethumbnail=True, overwrites=False, continuedl=True)
        with yt_dlp.YoutubeDL(opts) as y:
            y.download([url])
        pr = probe(mp4)
    if pr is None:
        pr = probe(mp4)
    cfr = bool(prev and prev.get("reencoded_cfr"))
    if pr["vfr"]:
        print(f"  variable frame rate (r={pr['fps_fraction']} avg={pr['avg_frame_rate']} jitter={pr['pts_jitter_frames']} f): re-encoding to CFR")
        reencode_cfr(mp4, pr["fps_fraction"])
        pr, cfr = probe(mp4), True
    meta = json.load(open(stem + ".info.json")) if os.path.exists(stem + ".info.json") else info
    vtt = stem + ".en.vtt"
    sub_kind = prev.get("subtitle_kind") if prev and os.path.exists(vtt) else None
    if a.refresh_subs or not os.path.exists(vtt):
        sub_kind = fetch_subs(url, stem, base, info) or (sub_kind if os.path.exists(vtt) else None)
        if not os.path.exists(vtt):
            print("  WARNING: no English captions saved; whisper words will be the only transcript (rerun later to retry)")
    thumb = next((stem + e for e in (".jpg", ".webp", ".png") if os.path.exists(stem + e)), None)
    rel = lambda p: os.path.relpath(p, ROOT) if p else None  # noqa: E731
    entry = {"youtube_id": yid, "analysis_id": aid, "title": title, "url": info["webpage_url"],
             "channel": info.get("channel"), "channel_id": chan, "upload_date": info.get("upload_date"),
             "duration": pr["duration"], "fps_fraction": pr["fps_fraction"], "fps": pr["fps"],
             "avg_frame_rate": pr["avg_frame_rate"], "frames": pr["frames"], "width": pr["width"],
             "height": pr["height"], "size": pr["size"], "path": rel(mp4), "reencoded_cfr": cfr,
             "subtitle_file": rel(vtt) if os.path.exists(vtt) else None,
             "subtitle_kind": sub_kind if os.path.exists(vtt) else None,
             "thumbnail": rel(thumb), "chapters": meta.get("chapters") or [], "sha256": sha256(mp4)}
    # Re-read the manifest just before writing so a second fetch running at the same time keeps its entries.
    mpath = os.path.join(outdir, "manifest.json")
    on_disk = json.load(open(mpath)) if os.path.exists(mpath) else []
    manifest[:] = [m for m in on_disk if m["youtube_id"] != yid] + [entry]
    atomic_json(mpath, manifest)
    src = json.load(open(SOURCES))
    src[aid] = {"path": entry["path"], "fps": pr["fps"], "style": a.style}
    atomic_json(SOURCES, src)
    print(f"  -> {entry['path']}  {pr['width']}x{pr['height']} {pr['fps_fraction']} fps ({pr['fps']}), "
          f"{pr['frames']} frames, {pr['duration']:.1f} s, subs {entry['subtitle_kind']}, registered as '{aid}'")
    return True


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("videos", nargs="+", help="VIDEO[=ANALYSIS_ID]; VIDEO = YouTube URL or 11-char id")
    ap.add_argument("--set", default="vox-sample", help="folder under reference/")
    ap.add_argument("--max-height", type=int, default=1080)
    ap.add_argument("--any-channel", action="store_true", help="allow channels other than Vox")
    ap.add_argument("--style", default="vox-explainer", help="style tag stored in sources.json")
    ap.add_argument("--min-sec", type=float, default=MIN_SEC, help="skip videos shorter than this (default 240; 0 for Shorts)")
    ap.add_argument("--dry-run", action="store_true", help="metadata only")
    ap.add_argument("--refresh-subs", action="store_true",
                    help="download the captions again (manual track preferred) even if a .en.vtt exists")
    a = ap.parse_args()
    mpath = os.path.join(ROOT, "reference", a.set, "manifest.json")
    manifest = json.load(open(mpath)) if os.path.exists(mpath) else []
    failed = []
    for item in a.videos:
        try:
            if not fetch(item, a, manifest):
                failed.append(item)
        except Exception as e:  # keep going with the other videos
            print(f"  FAILED {item}: {e}", file=sys.stderr)
            failed.append(item)
    if failed:  # non-zero so `fetch_reference.py … && preprocess_long.sh …` stops
        print(f"not fetched: {' '.join(failed)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
