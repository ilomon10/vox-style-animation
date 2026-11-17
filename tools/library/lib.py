"""Shared code for the catalog-only asset library (tools/library/*.py).

Git holds ONE file of the library: public/assets/library/catalog.json. Each entry says
  - what the asset is (id, kind, title, tags, era, region),
  - its rights (licence, why it is public domain, author, attribution line),
  - where the file comes from (`source`: page + download URL) and how it is built (`build`):
        download  fetch `source.url` (or an `alt` URL), then run `steps`
        generate  run a seeded generator script that writes the file(s)
        script    run a script on other entries (`needs`), e.g. the cut-out keys of tools/assets/make_cutouts.sh
        release   download the finished file from this repository's GitHub release (AI cut-outs: the rembg models
                  are about 1 GB), or `rebuild` it locally when the models are installed
  - the facts of the finished file (`file`: bytes, sha256, px size, a 16x16 grey fingerprint, duration)
    so fetch.py can check what it got: same sha256 = exact; images may also pass on size + fingerprint
    (a source that re-encodes its thumbnails does not break the catalog).
Paths are relative to public/: a storyboard uses them as `kit:<path>`, code as staticFile(<path>).
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
LIB = PUBLIC / "assets" / "library"
CATALOG = LIB / "catalog.json"
SCHEMA = "vox-asset-catalog/1"
PY = [str(ROOT / "tools" / "py")]

KINDS = ("photos", "engravings", "portraits", "documents", "maps", "cutouts", "textures", "marks", "sfx", "music",
         "footage", "data")
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp"}
AUDIO_EXT = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}
VIDEO_EXT = {".mp4", ".webm", ".mov"}
LICENSE_NAMES = {"pd": "Public domain", "cc0": "CC0 1.0", "by": "CC BY", "by-sa": "CC BY-SA"}
LICENSE_URLS = {"pd": "https://creativecommons.org/publicdomain/mark/1.0/",
                "cc0": "https://creativecommons.org/publicdomain/zero/1.0/"}
NO_ATTRIBUTION = {"pd", "cc0"}
# licences allowed in the shared library: PD/CC0 everywhere; CC BY only for sound (music beds, SFX), never BY-SA
ALLOWED = {"pd", "cc0", "by"}
BY_KINDS = {"music", "sfx"}
BUILD_FROM = ("download", "generate", "script", "release")
FP_TOL = 0.05          # max mean abs difference (0..1) of two 16x16 grey fingerprints for "the same picture"
SIZE_TOL = 0.02        # max relative px-size difference when only the fingerprint matches
MAX_DOWNLOAD = 400 << 20
MAX_PIXELS = 250_000_000


# ------------------------------------------------------------------------------------------------------------------
# catalog
# ------------------------------------------------------------------------------------------------------------------

def load() -> dict:
    d = json.loads(CATALOG.read_text(encoding="utf-8"))
    if d.get("schema") != SCHEMA:
        raise SystemExit(f"{CATALOG}: unknown schema {d.get('schema')!r} (expected {SCHEMA})")
    return d


def save(d: dict) -> None:
    d["assets"].sort(key=lambda a: (KINDS.index(a["kind"]) if a["kind"] in KINDS else 99, a["path"]))
    text = json.dumps(d, indent=1, ensure_ascii=False) + "\n"
    tmp = CATALOG.with_suffix(".json.tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(CATALOG)


class catalog_txn:
    """with L.catalog_txn() as cat: ... - load, change and save catalog.json under an exclusive lock, so two tools
    (an add.py running rembg for minutes and another add.py) never overwrite each other's entries"""

    def __enter__(self) -> dict:
        import fcntl
        LIB.mkdir(parents=True, exist_ok=True)
        self.fd = os.open(LIB / ".catalog.lock", os.O_RDWR | os.O_CREAT, 0o644)
        fcntl.flock(self.fd, fcntl.LOCK_EX)
        self.cat = load()
        return self.cat

    def __exit__(self, exc_type, exc, tb) -> None:
        import fcntl
        try:
            if exc_type is None:
                save(self.cat)
        finally:
            fcntl.flock(self.fd, fcntl.LOCK_UN)
            os.close(self.fd)


def by_id(d: dict) -> dict:
    return {a["id"]: a for a in d["assets"]}


def theme_of(a: dict) -> str:
    """second folder under the kind (assets/library/photos/<theme>/x.jpg) or the pack folder (assets/cc0/...)"""
    parts = a["path"].split("/")
    if parts[:2] == ["assets", "library"] and len(parts) > 4:
        return parts[3]
    if parts[:2] == ["assets", "library"]:
        return "-"
    return parts[1] if len(parts) > 2 else "-"


def local(a: dict) -> Path:
    return PUBLIC / a["path"]


def all_files(a: dict) -> list[Path]:
    return [PUBLIC / a["path"]] + [PUBLIC / p for p in a.get("files", [])]


def slug(s: str, n: int = 60) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:n].strip("-") or "x"


def attribution_line(a: dict) -> str:
    if a.get("attribution"):
        return a["attribution"]
    who = f" by {a['author']}" if a.get("author") else ""
    site = (a.get("source") or {}).get("site", "")
    page = (a.get("source") or {}).get("page", "")
    lic = a.get("license_name") or LICENSE_NAMES.get(a.get("license", ""), a.get("license", ""))
    return f"\"{a.get('title', a['id'])}\"{who}{', via ' + site if site else ''}; {lic}{' (' + page + ')' if page else ''}"


# ------------------------------------------------------------------------------------------------------------------
# file facts and verification
# ------------------------------------------------------------------------------------------------------------------

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _open_image(path: Path):
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = MAX_PIXELS
    return Image.open(path)


def fingerprint(path: Path) -> str:
    """16x16 grey thumbnail (alpha composited on mid grey) as hex: survives re-encoding and small resizes"""
    from PIL import Image
    im = _open_image(path)
    if im.format == "JPEG":
        im.draft("RGB", (256, 256))
    im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (128, 128, 128, 255))
    bg.alpha_composite(im)
    return bg.convert("L").resize((16, 16), Image.BOX).tobytes().hex()


def fp_distance(a: str, b: str) -> float:
    x, y = bytes.fromhex(a), bytes.fromhex(b)
    if len(x) != len(y) or not x:
        return 1.0
    return sum(abs(p - q) for p, q in zip(x, y)) / (255 * len(x))


def media_duration(path: Path) -> float | None:
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1",
                              str(path)], capture_output=True, text=True, timeout=60).stdout.strip()
        return round(float(out), 3)
    except (ValueError, OSError, subprocess.SubprocessError):
        return None


def file_facts(path: Path) -> dict:
    f = {"bytes": path.stat().st_size, "sha256": sha256(path)}
    ext = path.suffix.lower()
    if ext in IMAGE_EXT:
        im = _open_image(path)
        f["w"], f["h"] = im.size
        f["fp"] = fingerprint(path)
    elif ext in AUDIO_EXT | VIDEO_EXT:
        d = media_duration(path)
        if d is not None:
            f["duration_s"] = d
    return f


def verify(path: Path, facts: dict | None, quick: bool = False) -> tuple[bool, str]:
    """(ok, how). quick: a file with the recorded byte size counts as good without hashing it."""
    if not path.exists():
        return False, "missing"
    if not facts:
        return True, "present (no recorded facts)"
    st = path.stat()
    if quick and facts.get("bytes") == st.st_size:
        return True, "present"
    if facts.get("sha256") and facts.get("bytes") == st.st_size and sha256(path) == facts["sha256"]:
        return True, "exact"
    ext = path.suffix.lower()
    if ext in IMAGE_EXT and facts.get("fp"):
        try:
            w, h = _open_image(path).size
        except Exception as e:  # noqa: BLE001
            return False, f"unreadable image ({e})"
        if facts.get("w") and (abs(w / facts["w"] - 1) > SIZE_TOL or abs(h / facts["h"] - 1) > SIZE_TOL):
            return False, f"size {w}x{h}, catalog {facts['w']}x{facts['h']}"
        d = fp_distance(fingerprint(path), facts["fp"])
        return (d <= FP_TOL), f"same picture (fingerprint distance {d:.3f})" if d <= FP_TOL else f"different picture (fingerprint distance {d:.3f})"
    if ext in AUDIO_EXT | VIDEO_EXT and facts.get("duration_s"):
        d = media_duration(path)
        if d and abs(d - facts["duration_s"]) <= max(0.05, 0.01 * facts["duration_s"]):
            return True, f"same duration ({d:.2f} s)"
        return False, f"duration {d} s, catalog {facts['duration_s']} s"
    return False, "checksum differs"


# ------------------------------------------------------------------------------------------------------------------
# download (untrusted data: a fresh empty folder per download; files are only decoded, never executed)
# ------------------------------------------------------------------------------------------------------------------

def _common():
    sys.path.insert(0, str(ROOT / "tools" / "source"))
    import common  # noqa: PLC0415  (needs `requests`)
    return common


_EXT_FOR_TYPE = {"image/jpeg": ".jpg", "image/png": ".png", "image/tiff": ".tif", "image/gif": ".gif", "image/webp": ".webp",
                 "audio/wav": ".wav", "audio/x-wav": ".wav", "audio/wave": ".wav", "audio/mpeg": ".mp3", "audio/ogg": ".ogg",
                 "audio/flac": ".flac", "video/mp4": ".mp4", "application/zip": ".zip", "application/pdf": ".pdf",
                 "application/json": ".json", "application/geo+json": ".geojson"}


def download(url: str, dest_dir: Path, max_bytes: int = MAX_DOWNLOAD) -> Path:
    C = _common()
    r = C.get(url, stream=True, timeout=180)
    u = urlparse(url)
    name = os.path.basename(unquote(u.path)) or "download"
    if not os.path.splitext(name)[1]:  # e.g. https://host/get?file=Paper003_2K-JPG.zip: name it after the file parameter
        q = [v for _, v in re.findall(r"(?:^|&)([^=&]+)=([^&]+)", u.query) if re.search(r"\.[A-Za-z0-9]{2,5}$", unquote(v))]
        if q:
            name = os.path.basename(unquote(q[0]))
    if not os.path.splitext(name)[1]:  # e.g. an IIIF / museum delivery service: name it after the content type
        ctype = r.headers.get("Content-Type", "").split(";")[0].strip().lower()
        name += _EXT_FOR_TYPE.get(ctype, "")
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", name)[-120:] or "download"
    p = dest_dir / name
    n = 0
    with open(p, "wb") as fh:
        for chunk in r.iter_content(1 << 16):
            n += len(chunk)
            if n > max_bytes:
                raise RuntimeError(f"larger than {max_bytes >> 20} MB")
            fh.write(chunk)
    if n == 0:
        raise RuntimeError("empty download")
    return p


_COMMONS_THUMB = re.compile(r"^https://(?:thumb|upload)\.wikimedia\.org/(wikipedia/[a-z]+)/thumb/([0-9a-f]/[0-9a-f]{2}/[^/]+)/[^/]+$")


def wikimedia_fallbacks(url: str) -> list[str]:
    """other spellings of a Wikimedia thumbnail: the same rendition on upload.wikimedia.org, then the original file.
    Fetch tries them when the catalog's own URLs fail (a 503 from the thumbnail host); verification decides."""
    base = url.split("?", 1)[0]
    m = _COMMONS_THUMB.match(base)
    if not m:
        return []
    return [f"https://upload.wikimedia.org/{m.group(1)}/thumb/{base.split('/thumb/', 1)[1]}",
            f"https://upload.wikimedia.org/{m.group(1)}/{m.group(2)}"]


_CACHE: dict[str, Path] = {}


def download_cached(url: str, dest_dir: Path) -> Path:
    """download() once per process: several entries often come from one zip (a pack of sounds or textures)"""
    keep = ROOT / "out" / "tmp" / "dl-cache" / hashlib.sha1(url.encode()).hexdigest()[:16]
    hit = _CACHE.get(url) or next((f for f in keep.glob("*") if f.is_file()), None) if keep.exists() else _CACHE.get(url)
    if hit and hit.exists():
        dst = dest_dir / hit.name
        shutil.copyfile(hit, dst)
        return dst
    got = download(url, dest_dir)
    keep.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(got, keep / got.name)
    _CACHE[url] = keep / got.name
    return got


def clear_cache() -> None:
    shutil.rmtree(ROOT / "out" / "tmp" / "dl-cache", ignore_errors=True)
    _CACHE.clear()


def sfx_sidecar(wav: Path, public_path: str, note: str = "") -> Path:
    """<stem>.json next to a WAV in the tools/audio/make_sfx.py format (SfxAtPeak starts the clip at event - peak_s)"""
    import wave
    import numpy as np
    with wave.open(str(wav), "rb") as w:
        sr, ch, n, sw = w.getframerate(), w.getnchannels(), w.getnframes(), w.getsampwidth()
        raw = w.readframes(n)
    if sw != 2:
        raise RuntimeError(f"{wav.name}: expected 16-bit PCM")
    x = np.abs(np.frombuffer(raw, dtype="<i2").astype(np.float64).reshape(-1, ch) / 32768).max(1)
    pk = int(x.argmax())
    peak = float(x[pk]) or 1e-9
    onset = int(np.argmax(x >= peak * 10 ** (-40 / 20)))
    peak_db = 20 * np.log10(peak)
    meta = {"name": wav.stem, "file": public_path, "sample_rate": sr, "duration_s": round(n / sr, 4), "peak_s": round(pk / sr, 4),
            "onset_s": round(onset / sr, 4), "peak_dbfs": round(peak_db, 2),
            "suggested_gain_db": round(max(-24.0, min(12.0, -9.0 - peak_db)), 1), "loop": False, "note": note}
    side = wav.with_suffix(".json")
    side.write_text(json.dumps(meta, indent=1) + "\n", encoding="utf-8")
    return side


def head_ok(url: str) -> tuple[bool, str]:
    C = _common()
    try:
        C._wait(urlparse(url).hostname or "")
        r = C._SESSION.head(url, allow_redirects=True, timeout=30)
        if r.status_code in (403, 405, 501):  # some hosts refuse HEAD: try a 1-byte GET
            r = C._SESSION.get(url, headers={"Range": "bytes=0-0"}, stream=True, timeout=30)
        return r.status_code < 400, str(r.status_code)
    except Exception as e:  # noqa: BLE001
        return False, str(e)[:80]


# ------------------------------------------------------------------------------------------------------------------
# processing steps (deterministic; each step reads `cur` and writes a new file in `work`)
#   zip:<member>     extract one member of a zip           pdfpage:<n>@<dpi>  render one PDF page (poppler)
#   crop:x,y,w,h     crop in source px                     resize:<px>        shrink so the long side <= px
#   gray             greyscale                             jpeg[:q]           save JPEG (sRGB, no metadata), default q 88
#   png              save PNG (sRGB, no metadata)          wav48k             decode audio to 48 kHz 16-bit stereo WAV
#   mono             audio to mono                         trim:a-b           cut seconds a..b (audio or video)
#   mp4[:h]          H.264/AAC MP4, at most h px tall (default 1080)            mute  drop the audio track
# ------------------------------------------------------------------------------------------------------------------

def _ffmpeg(args: list[str]) -> None:
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def _save_image(im, dst: Path, fmt: str, quality: int = 88) -> None:
    from PIL import Image, ImageCms
    icc = im.info.get("icc_profile")
    if im.mode == "CMYK" or (icc and im.mode in ("RGB", "RGBA")):
        try:
            import io
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc)) if icc else None
            if src is not None:
                outmode = "RGBA" if im.mode == "RGBA" else "RGB"
                im = ImageCms.profileToProfile(im, src, ImageCms.createProfile("sRGB"), outputMode=outmode)
            else:
                im = im.convert("RGB")
        except Exception:  # noqa: BLE001  broken profile: fall back to a plain conversion
            im = im.convert("RGBA" if im.mode == "RGBA" else "RGB")
    if fmt == "jpeg":
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB") if "A" not in im.mode else _flatten(im)
        im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    else:
        if im.mode not in ("RGB", "RGBA", "L", "LA"):
            im = im.convert("RGBA" if "A" in im.mode or im.mode == "P" else "RGB")
        im.save(dst, "PNG", optimize=True)


def _flatten(im):
    from PIL import Image
    bg = Image.new("RGB", im.size, (255, 255, 255))
    bg.paste(im, mask=im.convert("RGBA").split()[3])
    return bg


def run_steps(src: Path, steps: list[str], work: Path) -> Path:
    cur = src
    for i, st in enumerate(steps):
        op, _, arg = st.partition(":")
        out = work / f"s{i:02d}"
        if op == "zip":
            with zipfile.ZipFile(cur) as z:
                info = z.getinfo(arg)
                if info.file_size > MAX_DOWNLOAD:
                    raise RuntimeError(f"zip member {arg} too large")
                nxt = out.with_suffix(Path(arg).suffix.lower())
                nxt.write_bytes(z.read(info))
            cur = nxt
        elif op == "pdfpage":
            page, _, dpi = arg.partition("@")
            subprocess.run(["pdftoppm", "-f", page, "-l", page, "-r", dpi or "200", "-png", "-singlefile", str(cur), str(out)],
                           check=True)
            cur = out.with_suffix(".png")
        elif op in ("crop", "resize", "gray", "jpeg", "png"):
            from PIL import Image
            im = _open_image(cur)
            if op == "resize" and max(im.size) <= int(arg):
                continue  # already small enough: keep the original bytes (an exact checksum stays possible)
            im.load()
            # keep the input's format between steps; an explicit jpeg/png step decides the final one
            src_fmt = "png" if cur.suffix.lower() == ".png" or im.mode in ("RGBA", "LA", "P") else "jpeg"
            fmt = "jpeg" if op == "jpeg" else "png" if op == "png" else src_fmt
            if op == "crop":
                x, y, w, h = (int(v) for v in arg.split(","))
                im = im.crop((x, y, x + w, y + h))
            elif op == "resize":
                n = int(arg)
                if max(im.size) > n:
                    s = n / max(im.size)
                    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
            elif op == "gray":
                im = im.convert("LA" if "A" in im.mode else "L")
            q = (int(arg) if arg else 88) if op == "jpeg" else 95
            nxt = out.with_suffix(".jpg" if fmt == "jpeg" else ".png")
            _save_image(im, nxt, fmt, q)
            cur = nxt
        elif op == "wav48k":
            nxt = out.with_suffix(".wav")
            _ffmpeg(["-i", str(cur), "-vn", "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", str(nxt)])
            cur = nxt
        elif op == "mono":
            nxt = out.with_suffix(".wav")
            _ffmpeg(["-i", str(cur), "-ac", "1", "-c:a", "pcm_s16le", str(nxt)])
            cur = nxt
        elif op == "trim":
            a, b = (float(v) for v in arg.split("-"))
            nxt = out.with_suffix(cur.suffix)
            codec = ["-c:a", "pcm_s16le"] if cur.suffix.lower() == ".wav" else ["-c:v", "libx264", "-crf", "18", "-c:a", "aac"]
            _ffmpeg(["-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", str(cur), *codec, str(nxt)])
            cur = nxt
        elif op == "mp4":
            h = int(arg or 1080)
            nxt = out.with_suffix(".mp4")
            _ffmpeg(["-i", str(cur), "-vf", f"scale=-2:'min(ih,{h})'", "-c:v", "libx264", "-crf", "20", "-preset", "medium",
                     "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(nxt)])
            cur = nxt
        elif op == "mute":
            nxt = out.with_suffix(cur.suffix)
            _ffmpeg(["-i", str(cur), "-an", "-c:v", "copy", str(nxt)])
            cur = nxt
        else:
            raise ValueError(f"unknown step {st!r}")
    return cur


def check_media(path: Path) -> None:
    """refuse anything that is not the media its extension says (downloads are untrusted)"""
    ext = path.suffix.lower()
    if ext in IMAGE_EXT:
        im = _open_image(path)
        im.verify()
    elif ext in AUDIO_EXT | VIDEO_EXT:
        if media_duration(path) is None:
            raise RuntimeError("ffprobe cannot read it")
    elif ext == ".zip":
        with zipfile.ZipFile(path) as z:
            for n in z.namelist():
                if n.startswith("/") or ".." in Path(n).parts:
                    raise RuntimeError(f"unsafe zip member {n}")
    elif ext in (".json", ".geojson"):
        json.loads(path.read_text(encoding="utf-8"))


def new_workdir() -> Path:
    base = ROOT / "out" / "tmp"
    base.mkdir(parents=True, exist_ok=True)
    return Path(tempfile.mkdtemp(prefix="lib-", dir=base))


def place(built: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if built.suffix.lower() != dst.suffix.lower() and not (built.suffix.lower() in (".jpg", ".jpeg") and dst.suffix.lower() in (".jpg", ".jpeg")):
        raise RuntimeError(f"built a {built.suffix} file but the catalog path is {dst.suffix}")
    tmp = dst.with_name(dst.name + ".part")
    shutil.copyfile(built, tmp)
    tmp.replace(dst)
