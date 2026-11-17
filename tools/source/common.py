"""Shared helpers for the sourcing tools: polite HTTP, licence normalisation, news-agency filter, credits."""
import html
import os
import re
import sys
import time
from urllib.parse import urlparse

import requests

# Generic client name: no personal info, no contact address (policy in tools/source/README.md). Wikimedia's
# User-Agent policy asks automated clients for a way to reach them: VOX_UA_CONTACT (a URL or e-mail the user chooses)
# adds one. Nothing is added unless the user sets it.
UA = "vox-style-sourcing/1.0 (open-licence asset search; python-requests)"
if os.environ.get("VOX_UA_CONTACT", "").strip():
    UA = f"vox-style-sourcing/1.0 ({os.environ['VOX_UA_CONTACT'].strip()}; open-licence asset search) python-requests"
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

_SESSION = requests.Session()
_SESSION.headers["User-Agent"] = UA
_last = {}
# minimum seconds between requests per host family
# (checked in order: the first suffix that matches wins). upload.wikimedia.org answers bursts of downloads with
# 429 + Retry-After 60 s, so file downloads are paced more slowly than API calls.
_GAP = {"upload.wikimedia.org": 4.0, "wikimedia.org": 1.1, "wikipedia.org": 1.1, "loc.gov": 3.2, "openverse.org": 0.5,
        "archive.org": 0.6}


def _gap(host):
    for k, v in _GAP.items():
        if host.endswith(k):
            return v
    return 0.3


def _wait(host):
    dt = _gap(host) - (time.time() - _last.get(host, 0))
    if dt > 0:
        time.sleep(dt)
    _last[host] = time.time()


def get(url, params=None, stream=False, timeout=45, tries=4, headers=None):
    """GET with per-host throttle and Retry-After handling. Returns Response (raises on final failure)."""
    host = urlparse(url).hostname or ""
    last = None
    for i in range(tries):
        _wait(host)
        try:
            r = _SESSION.get(url, params=params, stream=stream, timeout=timeout, headers=headers)
        except requests.RequestException as e:
            last = e
            time.sleep(2 * (i + 1))
            continue
        if r.status_code in (429, 503):
            try:
                ra = min(float(r.headers.get("Retry-After", 5)), 60)
            except ValueError:
                ra = 5
            print(f"  [{host}] {r.status_code}, waiting {ra:.0f}s", file=sys.stderr)
            time.sleep(ra)
            last = RuntimeError(f"{r.status_code} from {host}")
            continue
        r.raise_for_status()
        return r
    raise RuntimeError(f"{last} (after {tries} tries): GET {url}")


def strip_html(s):
    if not s:
        return ""
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", str(s)))).strip()


def slug(s, n=40):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:n] or "x"


# ---- licences ---------------------------------------------------------------------------
LIC_URL = {
    "cc0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "pd": "https://creativecommons.org/publicdomain/mark/1.0/",
}
LIC_RANK = {"cc0": 0, "pd": 0, "by": 1, "by-sa": 2}


def norm_license(name, url=""):
    """Map a licence name/URL to cc0 | pd | by | by-sa | None (None = not usable)."""
    s = f"{name or ''} {url or ''}".lower()
    if re.search(r"\bnc\b|-nc|noncommercial|\bnd\b|-nd\b|no derivatives|gfdl|fair use|free use|copyrighted", s):
        return None
    if re.search(r"cc[ -]?0|zero|publicdomain/zero", s):
        return "cc0"
    if re.search(r"public domain|\bpd\b|^pd-|\bpdm\b|mark/1\.0|u\.?s\.? government|usgov|no known (copyright )?restrictions|not copyrighted", s):
        return "pd"
    if re.search(r"cc[ -]?by[ -]?sa|by-sa", s):
        return "by-sa"
    if re.search(r"cc[ -]?by\b|licenses/by/", s):
        return "by"
    return None


def parse_licenses(csv):
    return {x.strip().lower() for x in csv.split(",") if x.strip()}


def pretty_license(code, name=""):
    return name or {"cc0": "CC0 1.0", "pd": "Public domain", "by": "CC BY", "by-sa": "CC BY-SA"}[code]


def make_attribution(title, creator, source_name, lic_code, lic_name, lic_url, page_url):
    t = f"\"{title}\"" if title else "Untitled"
    who = f" by {creator}" if creator else ""
    if lic_code in ("pd", "cc0"):
        return f"{t}{who}, via {source_name}; {pretty_license(lic_code, lic_name)} ({page_url})"
    return f"{t}{who}, via {source_name}, licensed {lic_name or pretty_license(lic_code)} ({lic_url or page_url}); source: {page_url}"


# ---- news agencies / commercial stock: never used ----------------------------------------
_NEWS = re.compile(
    r"\b(associated press|reuters|getty images?|agence france|afp|epa-efe|european pressphoto|"
    r"press association|bettmann|corbis|shutterstock|alamy|istock|upi|united press international|"
    r"keystone|ap photo|ap images?|rex features|zuma press|bloomberg|dpa picture|pa images)\b|"
    r"\b(AP|AFP|UPI|PA)\s*(/|-|\()", re.I)


def is_news_agency(*texts):
    blob = " | ".join(strip_html(t) for t in texts if t)
    return bool(_NEWS.search(blob))


def append_credits(project, lines, heading="Sourced assets"):
    path = os.path.join(project, "CREDITS.md")
    new = not os.path.exists(path)
    with open(path, "a", encoding="utf-8") as fh:
        if new:
            fh.write("# Credits\n\nGenerated by tools/source/*. Keep attribution strings for CC BY / CC BY-SA items in the video description.\n")
        fh.write(f"\n## {heading} ({time.strftime('%Y-%m-%d')})\n\n")
        for ln in lines:
            fh.write(f"- {ln}\n")
