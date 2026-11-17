#!/usr/bin/env python3
"""Search open-licence image sources, download, record provenance.

  tools/.venv/bin/python tools/source/source_images.py "Abraham Lincoln portrait" \
      --project video-projects/demo [--n 8] [--min-width 2000] [--licenses pd,cc0,by,by-sa] \
      [--cutout] [--bw] [--kind portrait] [--source auto] [--dry-run]

Sources: Wikimedia Commons, Openverse, NASA, Smithsonian Open Access, Library of Congress
(falls back to Commons mirrors when loc.gov challenges scripts). News-agency images are rejected.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C  # noqa: E402

SPACE = re.compile(r"apollo|nasa|moon|mars|space|earth|rocket|astronaut|shuttle|planet|galaxy|satellite|orbit|telescope|gemini|mercury|hubble|nebula", re.I)
KIND_TERMS = {"portrait": "portrait", "map": "map", "document": "document", "engraving": "engraving", "photo": ""}
MAX_BYTES = 30 * 1024 * 1024


def cand(**k):
    base = dict(source="", src_id="", title="", creator="", date="", page_url="", file_url="", thumb_url="",
                width=None, height=None, size=None, lic=None, lic_name="", lic_url="", credit_raw="", note="")
    base.update(k)
    return base


# ---- Wikimedia Commons -----------------------------------------------------------------------
def commons_search(query, kind, want, min_width, extra=None, width=0):
    q = f"{query} {KIND_TERMS.get(kind, '')} filetype:bitmap filew:>{min(min_width, 1500) - 1}"
    queries = [q.strip()]
    if kind == "portrait" or re.search(r"president|senator|congress|minister|official", query, re.I):
        # official portraits of US-government people: PD-USGov
        queries.insert(0, f"{query} hastemplate:\"PD-USGov\" filetype:bitmap filew:>999")
    queries.append(f"{query} haswbstatement:P6216=Q19652 filetype:bitmap filew:>999")
    if extra:
        queries = [f"{query} {extra} filetype:bitmap filew:>999"]
    out, seen = [], set()
    for sq in queries:
        try:
            r = C.get("https://commons.wikimedia.org/w/api.php", params=dict(
                action="query", format="json", generator="search", gsrsearch=sq, gsrnamespace=6, gsrlimit=want * 2,
                prop="imageinfo", iiprop="url|size|mime|extmetadata", iiurlwidth=width or min_width)).json()
        except Exception as e:  # noqa: BLE001
            print(f"  commons: {e}", file=sys.stderr)
            continue
        pages = sorted((r.get("query") or {}).get("pages", {}).values(), key=lambda p: p.get("index", 0))
        for p in pages:
            if p["title"] in seen or not p.get("imageinfo"):
                continue
            seen.add(p["title"])
            ii = p["imageinfo"][0]
            if not ii.get("mime", "").startswith("image/") or ii["mime"] in ("image/svg+xml", "image/gif", "image/tiff"):
                continue
            md = ii.get("extmetadata", {})
            val = lambda k: C.strip_html((md.get(k) or {}).get("value", ""))  # noqa: E731
            lic_name = val("LicenseShortName") or val("UsageTerms")
            lic_url = val("LicenseUrl")
            lic = C.norm_license(lic_name, lic_url)
            if lic is None:
                lic = C.norm_license(val("UsageTerms"))
            # use the original when it is modest, else a thumbnail step
            # the original when it is modest, else a thumbnail step. With --commons-width (e.g. 1920, one of the standard,
            # cached rendition widths) anything wider comes as that rendition: upload.wikimedia.org rate-limits originals
            orig_ok = ii["width"] <= (width or 4500) and ii.get("size", 0) <= MAX_BYTES
            furl = ii["url"] if (orig_ok or not ii.get("thumburl")) else ii["thumburl"]
            out.append(cand(
                source="commons", src_id=p["title"], title=re.sub(r"^File:|\.\w+$", "", p["title"]).replace("_", " "),
                creator=val("Artist"), date=val("DateTimeOriginal") or val("DateTime"),
                page_url=ii["descriptionurl"], file_url=furl, thumb_url=ii.get("thumburl", ""),
                width=ii["width"], height=ii["height"], size=ii.get("size"), lic=lic, lic_name=lic_name,
                lic_url=lic_url or C.LIC_URL.get(lic or "", ""),
                credit_raw=" | ".join([val("Credit"), val("Artist"), val("ImageDescription")[:300]]),
                note=val("Restrictions")))
    return out


# ---- Openverse ---------------------------------------------------------------------------------
def openverse_search(query, kind, want, min_width, lics):
    ov = {"pd": "pdm", "cc0": "cc0", "by": "by", "by-sa": "by-sa"}
    lic = ",".join(ov[x] for x in lics if x in ov)
    q = f"{query} {KIND_TERMS.get(kind, '')}".strip()
    try:
        r = C.get("https://api.openverse.org/v1/images/", params=dict(
            q=q, license=lic, page_size=min(20, want * 2), extension="jpg,png,jpeg", mature="false")).json()
    except Exception as e:  # noqa: BLE001
        print(f"  openverse: {e}", file=sys.stderr)
        return []
    out = []
    for x in r.get("results", []):
        code = {"pdm": "pd", "cc0": "cc0", "by": "by", "by-sa": "by-sa"}.get(x["license"])
        if not code:
            continue
        name = f"CC {x['license'].upper()} {x.get('license_version', '')}".strip() if code in ("by", "by-sa") else \
            ("CC0 1.0" if code == "cc0" else "Public Domain Mark 1.0")
        out.append(cand(
            source="openverse", src_id=x["id"], title=x.get("title") or "", creator=x.get("creator") or "",
            page_url=x.get("foreign_landing_url") or x.get("url"), file_url=x["url"], width=x.get("width"),
            height=x.get("height"), lic=code, lic_name=name, lic_url=x.get("license_url") or "",
            credit_raw=" | ".join([x.get("creator") or "", x.get("source") or "", x.get("provider") or "",
                                   x.get("foreign_landing_url") or "", x["url"]]),
            note=("verify upstream (PDM tags are user-applied); " if code == "pd" else "") + f"provider={x.get('provider')}"))
    return out


# ---- NASA --------------------------------------------------------------------------------------
def nasa_search(query, want):
    try:
        r = C.get("https://images-api.nasa.gov/search", params=dict(q=query, media_type="image", page_size=want * 2)).json()
    except Exception as e:  # noqa: BLE001
        print(f"  nasa: {e}", file=sys.stderr)
        return []
    out = []
    for it in r["collection"]["items"]:
        d = it["data"][0]
        nid = d["nasa_id"]
        try:
            assets = [i["href"] for i in C.get(f"https://images-api.nasa.gov/asset/{nid}").json()["collection"]["items"]]
        except Exception:  # noqa: BLE001
            continue
        pick = next((a for a in assets if "~orig." in a and a.lower().endswith((".jpg", ".png"))), None) or \
            next((a for a in assets if "~large." in a), None) or next((a for a in assets if "~medium." in a), None)
        if not pick:
            continue
        desc = d.get("description", "")
        out.append(cand(
            source="nasa", src_id=nid, title=d.get("title", ""), creator=d.get("photographer") or d.get("secondary_creator") or d.get("center", "NASA"),
            date=d.get("date_created", "")[:10], page_url=f"https://images.nasa.gov/details/{nid}",
            file_url=pick.replace(" ", "%20"), thumb_url=it["links"][0]["href"] if it.get("links") else "",
            lic="pd", lic_name="NASA media (not copyrighted)", lic_url="https://www.nasa.gov/nasa-brand-center/images-and-media/",
            credit_raw=f"{d.get('center', '')} | {d.get('secondary_creator', '')}",
            note="check page if description mentions a copyright holder" if re.search(r"copyright", desc, re.I) else ""))
        if re.search(r"copyright", desc, re.I):
            out.pop()  # description names a copyright: skip
    return out


# ---- Smithsonian Open Access ---------------------------------------------------------------------
def smithsonian_search(query, want):
    try:
        r = C.get("https://api.si.edu/openaccess/api/v1.0/search", params=dict(
            q=f"{query} AND online_visual_material:true", rows=want * 3, api_key="DEMO_KEY")).json()
    except Exception as e:  # noqa: BLE001
        print(f"  smithsonian: {e}", file=sys.stderr)
        return []
    out = []
    for row in r.get("response", {}).get("rows", []):
        c = row["content"]
        dnr = c.get("descriptiveNonRepeating", {})
        for m in (dnr.get("online_media") or {}).get("media", []):
            if m.get("type") != "Images" or (m.get("usage") or {}).get("access") != "CC0":
                continue
            ids = m.get("idsId") or ""
            url = f"https://ids.si.edu/ids/deliveryService?id={ids}&max=3000" if ids else m.get("content")
            fs = c.get("freetext", {})
            names = [n.get("content") for n in fs.get("name", []) if n.get("content")]
            dates = [d.get("content") for d in fs.get("date", []) if d.get("content")]
            out.append(cand(
                source="smithsonian", src_id=row["id"], title=dnr.get("title", {}).get("content", ""),
                creator=names[0] if names else dnr.get("data_source", ""), date=dates[0] if dates else "",
                page_url=dnr.get("record_link") or dnr.get("guid", ""), file_url=url,
                lic="cc0", lic_name="CC0 1.0", lic_url=C.LIC_URL["cc0"],
                credit_raw=f"{dnr.get('data_source', '')} | {' '.join(names)}"))
            break
    return out


# ---- Library of Congress -------------------------------------------------------------------------
def loc_search(query, want):
    try:
        r = C.get("https://www.loc.gov/photos/", params=dict(q=query, fo="json", c=want * 2, **{"fa": "online-format:image"}), tries=1)
        data = r.json()
    except Exception as e:  # noqa: BLE001
        print(f"  loc.gov blocked/unavailable ({str(e)[:60]}); falling back to Commons mirrors of LoC items", file=sys.stderr)
        out = commons_search(query, "photo", want, 1500, extra='"Library of Congress"')
        for c in out:
            c["source"] = "loc(commons-mirror)"
        return out
    out = []
    for it in data.get("results", []):
        rights = " ".join(it.get("item", {}).get("rights", []) if isinstance(it.get("item", {}).get("rights"), list) else [str(it.get("rights_advisory", ""))])
        if not re.search(r"no known restrictions|public domain|no restrictions", rights, re.I):
            continue
        imgs = it.get("image_url") or []
        if not imgs:
            continue
        out.append(cand(
            source="loc", src_id=it.get("id", ""), title=it.get("title", ""), creator=", ".join(it.get("contributor", [])[:1]) if isinstance(it.get("contributor"), list) else "",
            date=str(it.get("date", "")), page_url=it.get("id", ""), file_url=imgs[-1], lic="pd",
            lic_name="No known restrictions on publication (LoC rights advisory)", lic_url="https://www.loc.gov/rr/print/res/rights.html",
            credit_raw=rights))
    return out


# ---- pipeline ------------------------------------------------------------------------------------
def gather(a, lics):
    src = a.source
    want = max(a.n, 5)
    res = {}
    if src in ("auto", "commons"):
        res["commons"] = commons_search(a.query, a.kind, want, a.min_width, width=a.commons_width)
    if src in ("auto", "openverse"):
        res["openverse"] = openverse_search(a.query, a.kind, want, a.min_width, lics)
    if src == "nasa" or (src == "auto" and SPACE.search(a.query)):
        res["nasa"] = nasa_search(a.query, want)
    if src in ("auto", "smithsonian"):
        res["smithsonian"] = smithsonian_search(a.query, want)
    if src in ("auto", "loc"):
        res["loc"] = loc_search(a.query, want)
    return res


def filter_rank(res, lics, min_width, n):
    rejected, kept, seen = [], [], set()
    for lst in res.values():
        for c in lst:
            why = None
            if c["lic"] is None:
                why = f"licence not usable ({c['lic_name'] or 'unknown'})"
            elif c["lic"] not in lics:
                why = f"licence {c['lic']} not requested"
            elif C.is_news_agency(c["credit_raw"], c["creator"], c["title"], c["src_id"], c["page_url"]):
                why = "news-agency / stock credit"
            if why:
                rejected.append((c, why))
                continue
            key = re.sub(r"[^a-z0-9]", "", (c["title"] + c["creator"]).lower())[:60] or c["src_id"]
            m = re.search(r"File:(.+)$", c["page_url"] or "")
            key2 = re.sub(r"[^a-z0-9]", "", m.group(1).lower()) if m else None
            if key in seen or (key2 and key2 in seen):
                continue
            seen.update({key, key2} - {None})
            kept.append(c)
    # interleave sources (relevance order inside each), then stable-sort by width ok + licence preference
    by_src = {}
    for c in kept:
        by_src.setdefault(c["source"], []).append(c)
    inter = []
    while any(by_src.values()):
        for k in list(by_src):
            if by_src[k]:
                inter.append(by_src[k].pop(0))
    inter.sort(key=lambda c: (not (c["width"] is None or c["width"] >= min_width), C.LIC_RANK[c["lic"]]))
    return inter, rejected


def ahash(path):
    from PIL import Image
    im = Image.open(path).convert("L").resize((8, 8))
    px = list(im.tobytes())
    avg = sum(px) / 64
    return sum((1 << i) for i, p in enumerate(px) if p > avg)


def download(c, outdir, hashes):
    r = C.get(c["file_url"], stream=True, timeout=90)
    ext = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}.get(r.headers.get("Content-Type", "").split(";")[0])
    if not ext:
        ext = (re.search(r"\.(jpe?g|png|webp)(\?|$)", c["file_url"], re.I) or [0, "jpg"])[1].lower().replace("jpeg", "jpg")
    cid = f"{c['source'].split('(')[0]}_{C.slug(c['title'], 36)}_{int(hashlib.md5(c['src_id'].encode()).hexdigest()[:5], 16):05x}"
    path = os.path.join(outdir, f"{cid}.{ext}")
    n = 0
    with open(path, "wb") as fh:
        for chunk in r.iter_content(1 << 16):
            n += len(chunk)
            if n > MAX_BYTES:
                fh.close()
                os.remove(path)
                raise RuntimeError("file larger than 30 MB")
            fh.write(chunk)
    try:
        h = ahash(path)
        for o in hashes:
            if bin(h ^ o).count("1") <= 4:
                os.remove(path)
                return None
        hashes.append(h)
        from PIL import Image
        Image.MAX_IMAGE_PIXELS = None
        c["width"], c["height"] = Image.open(path).size
    except Exception:  # noqa: BLE001
        os.remove(path)
        raise
    return cid, path, ext


def bw_grade(src, dst):
    """Vox-archive look: grayscale, strong S-curve, slightly crushed blacks."""
    subprocess.run(["magick", src, "-colorspace", "Gray", "-level", "6%,94%", "-sigmoidal-contrast", "5,48%", dst], check=True)


def cutout(src, dst, kind):
    import rembg
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    model = "birefnet-portrait" if kind == "portrait" else "isnet-general-use"
    im = Image.open(src).convert("RGB")
    im.thumbnail((2000, 2000))
    out = rembg.remove(im, session=rembg.new_session(model))  # never the default bria model
    out = out.crop(out.getchannel("A").getbbox() or (0, 0, *out.size))
    out.save(dst)
    return model


def contact_sheet(files, labels, dst):
    cmd = ["magick", "montage"]
    for f, lb in zip(files, labels):
        cmd += ["-label", lb, f"{f}[0]"]
    cmd += ["-thumbnail", "360x360", "-geometry", "+8+8", "-tile", "4x", "-pointsize", "14",
            "-background", "#1b1b1b", "-fill", "#dddddd", dst]
    subprocess.run(cmd, check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("query")
    ap.add_argument("--project", required=True)
    ap.add_argument("--n", type=int, default=8)
    ap.add_argument("--min-width", type=int, default=2000)
    ap.add_argument("--licenses", default="pd,cc0,by,by-sa")
    ap.add_argument("--cutout", action="store_true")
    ap.add_argument("--bw", action="store_true")
    ap.add_argument("--kind", choices=list(KIND_TERMS), default="photo")
    ap.add_argument("--source", choices=["auto", "commons", "openverse", "nasa", "smithsonian", "loc"], default="auto")
    ap.add_argument("--commons-width", type=int, default=0,
                    help="take Commons files wider than this as their N-px rendition (use a standard width: 1280, 1920, 3840)")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    lics = C.parse_licenses(a.licenses)
    if "pd" in lics:
        lics.add("pd")

    res = gather(a, lics)
    cands, rejected = filter_rank(res, lics, a.min_width, a.n)
    print(f"query={a.query!r}: " + ", ".join(f"{k}={len(v)}" for k, v in res.items()) + f" -> {len(cands)} usable, {len(rejected)} rejected")
    for c, why in rejected:
        print(f"  REJECT [{c['source']}] {c['title'][:60]!r}: {why}")
    if a.dry_run:
        for c in cands[:max(a.n, 10)]:
            print(f"  [{c['source']:<12}] {c['lic']:<5} {c['lic_name'][:28]:<28} {c['width'] or '?'}x{c['height'] or '?'}  {c['title'][:55]!r} / {c['creator'][:30]!r}\n      {c['page_url']}")
        return

    outdir = os.path.join(a.project, "assets", "sourced")
    os.makedirs(outdir, exist_ok=True)
    hashes, done, credits = [], [], []
    for c in cands:
        if len(done) >= a.n:
            break
        try:
            got = download(c, outdir, hashes)
        except Exception as e:  # noqa: BLE001
            print(f"  skip {c['title'][:50]!r}: {str(e)[:80]}", file=sys.stderr)
            continue
        if got is None:
            print(f"  duplicate image skipped: {c['title'][:50]!r}")
            continue
        cid, path, ext = got
        if c["width"] < a.min_width:
            c["note"] = (c["note"] + "; " if c["note"] else "") + f"below min-width ({c['width']}px, largest available)"
        attrib = C.make_attribution(c["title"], c["creator"], c["source"], c["lic"], c["lic_name"], c["lic_url"], c["page_url"])
        meta = dict(id=cid, file=os.path.basename(path), title=c["title"], creator=c["creator"], date=c["date"],
                    source=c["source"], source_page=c["page_url"], file_url=c["file_url"], width=c["width"], height=c["height"],
                    license=c["lic"], license_name=c["lic_name"], license_url=c["lic_url"], attribution=attrib,
                    attribution_required=c["lic"] in ("by", "by-sa"), query=a.query, note=c["note"],
                    retrieved=__import__("time").strftime("%Y-%m-%d"))
        base = os.path.join(outdir, cid)
        if a.bw:
            bw_grade(path, f"{base}_bw.{ext}")
            meta["bw"] = f"{cid}_bw.{ext}"
        if a.cutout:
            try:
                meta["cutout_model"] = cutout(f"{base}_bw.{ext}" if a.bw else path, f"{base}_cut.png", a.kind)
                meta["cutout"] = f"{cid}_cut.png"
            except Exception as e:  # noqa: BLE001
                print(f"  cutout failed for {cid}: {e}", file=sys.stderr)
        json.dump(meta, open(f"{base}.json", "w"), indent=2, ensure_ascii=False)
        done.append((path, f"{cid[:28]}\\n{c['lic']} {c['width']}px"))
        credits.append(f"`{cid}.{ext}`: {attrib}")
        print(f"  saved {cid}.{ext}  {c['width']}x{c['height']}  {c['lic']}  [{c['source']}]")
    if not done:
        print("nothing downloaded")
        return
    append = credits
    C.append_credits(a.project, append, heading=f"Images: {a.query}")
    sheet = os.path.join(outdir, f"contact_{C.slug(a.query)}{'' if a.source == 'auto' else '_' + a.source}.png")
    contact_sheet([d[0] for d in done], [d[1] for d in done], sheet)
    print(f"contact sheet: {sheet}")


if __name__ == "__main__":
    main()
