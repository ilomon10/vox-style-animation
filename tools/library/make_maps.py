#!/usr/bin/env python3
"""Base maps from Natural Earth (public domain), styled for the kit's looks; PNG with transparent sea.

  tools/py tools/library/make_maps.py                      # the catalogued set: world, continents, world time zones
  tools/py tools/library/make_maps.py --catalog            # ... and (re)write their catalog entries
  tools/py tools/library/make_maps.py country IDN --project <slug> [--style paper|dark|line] [--pad 0.25]
        # a map of one country (ISO 3166-1 alpha-3) with its neighbours, written into the PROJECT's assets/maps/
        # and credited in its CREDITS.md (use it in the storyboard as "assets/maps/country-idn-paper.png")
  tools/py tools/library/make_maps.py region usa --box -128,22,-64,52 --project <slug> [--time-zones] [--style paper]
        # any lon/lat box (equirectangular), optionally with time-zone bands, into the project's assets/maps/
  tools/py tools/library/make_maps.py locate <map.png> --at "106.8,-6.2" "115.2,-8.7" [--mapbox -700,-500,3000]
        # design-px waypoints for MapRouteScene (the map shown with its mapBox inside the 1660x900 window at 130,90)

Styles: paper = cream land, warm-grey borders (paper looks, voxLight); dark = charcoal land (voxEarworm black
ground); line = white outlines only. Highlighted countries take the look's accent. Every map gets a <name>.json
sidecar with its projection, so `locate` can turn longitude/latitude into pixels. Data (Natural Earth v5.1.2
GeoJSON, fetched on demand through the catalog): data-ne-110m-countries, data-ne-50m-countries, data-ne-10m-time-zones.
"""
from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lib as L  # noqa: E402

OUT = L.LIB / "maps" / "naturalearth"
DATA = {"110m": "data-ne-110m-countries", "50m": "data-ne-50m-countries", "tz": "data-ne-10m-time-zones"}
STYLES = {
    "paper": dict(land="#E4DCCB", border="#9A907F", border_w=1.3, hl="#E6875A", tz=("#E6DAC0", "#CFC1A4")),
    "dark": dict(land="#272727", border="#525252", border_w=1.3, hl="#6B74DE", tz=("#2A2A2A", "#383838")),
    "line": dict(land=None, border="#F4F4F4", border_w=1.6, hl="#6B74DE", tz=None),
}
CONTINENTS = {  # lon0, lat0, lon1, lat1
    "africa": (-20, -37, 55, 38), "asia": (25, -12, 150, 62), "europe": (-25, 34, 45, 72),
    "north-america": (-170, 5, -50, 75), "south-america": (-85, -57, -32, 14), "oceania": (110, -50, 180, 2),
}
SS = 2


def hexrgb(h: str, a: int = 255) -> tuple:
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (a,)


# ---- projections (lon/lat degrees -> unitless x/y, y up) ----------------------------------------------------------

def natural_earth(lon, lat):
    lam, phi = np.radians(lon), np.radians(lat)
    p2 = phi * phi
    p4 = p2 * p2
    x = lam * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)))
    y = phi * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))
    return x, y


def equirect(lat0):
    k = math.cos(math.radians(lat0))
    return lambda lon, lat: (np.radians(lon) * k, np.radians(lat))


PROJ = {"natural-earth": lambda meta: natural_earth, "equirect": lambda meta: equirect(meta["lat0"])}


def load_geo(key: str) -> dict:
    cat = L.load()
    x = L.by_id(cat)[DATA[key]]
    p = L.local(x)
    if not p.exists():
        subprocess.run([*L.PY, str(Path(__file__).with_name("fetch.py")), "--ids", x["id"]], cwd=L.ROOT, check=True)
    return json.loads(p.read_text(encoding="utf-8"))


def rings(geom: dict):
    """yield (exterior, [holes]) as lists of [lon, lat]"""
    if geom["type"] == "Polygon":
        yield geom["coordinates"][0], geom["coordinates"][1:]
    elif geom["type"] == "MultiPolygon":
        for poly in geom["coordinates"]:
            yield poly[0], poly[1:]


def iso3(f: dict) -> str:
    p = f["properties"]
    for k in ("ADM0_A3", "ISO_A3", "SOV_A3", "adm0_a3", "iso_a3"):
        v = p.get(k)
        if v and v != "-99":
            return v
    return ""


class Map:
    def __init__(self, proj_name: str, meta: dict, lonlat_box: tuple, width: int):
        self.proj_name, self.meta = proj_name, meta
        self.proj = PROJ[proj_name](meta)
        lon0, lat0, lon1, lat1 = lonlat_box
        gl, gt = np.meshgrid(np.linspace(lon0, lon1, 60), np.linspace(lat0, lat1, 60))
        xs, ys = self.proj(gl.ravel(), gt.ravel())
        self.x0, self.x1, self.y0, self.y1 = xs.min(), xs.max(), ys.min(), ys.max()
        self.W = width
        self.H = int(round(width * (self.y1 - self.y0) / (self.x1 - self.x0)))
        self.box = lonlat_box
        self.img = Image.new("RGBA", (self.W * SS, self.H * SS), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.img)

    def px(self, lon, lat):
        x, y = self.proj(np.asarray(lon, float), np.asarray(lat, float))
        return ((x - self.x0) / (self.x1 - self.x0) * self.W * SS, (self.y1 - y) / (self.y1 - self.y0) * self.H * SS)

    def poly_pts(self, ring) -> list:
        a = np.asarray(ring, float)
        X, Y = self.px(a[:, 0], a[:, 1])
        return list(zip(X.tolist(), Y.tolist()))

    def fill(self, geom: dict, color: str, alpha: int = 255) -> None:
        for ext, holes in rings(geom):
            pts = self.poly_pts(ext)
            if len(pts) < 3:
                continue
            xs, ys = [p[0] for p in pts], [p[1] for p in pts]
            bx0, by0 = max(0, int(min(xs)) - 1), max(0, int(min(ys)) - 1)
            bx1, by1 = min(self.img.width, int(max(xs)) + 2), min(self.img.height, int(max(ys)) + 2)
            if bx1 <= bx0 or by1 <= by0:
                continue
            m = Image.new("L", (bx1 - bx0, by1 - by0), 0)
            md = ImageDraw.Draw(m)
            md.polygon([(x - bx0, y - by0) for x, y in pts], fill=255)
            for h in holes:
                hp = self.poly_pts(h)
                if len(hp) >= 3:
                    md.polygon([(x - bx0, y - by0) for x, y in hp], fill=0)
            if alpha >= 255:
                self.img.paste(Image.new("RGBA", m.size, hexrgb(color)), (bx0, by0), m)
            else:  # translucent tint over what is already drawn
                layer = Image.new("RGBA", m.size, hexrgb(color, 0))
                layer.putalpha(m.point(lambda v: v * alpha // 255))
                self.img.alpha_composite(layer, (bx0, by0))

    def stroke(self, geom: dict, color: str, w: float) -> None:
        for ext, holes in rings(geom):
            for r in [ext, *holes]:
                pts = self.poly_pts(r)
                if len(pts) >= 2:
                    self.d.line(pts + [pts[0]], fill=hexrgb(color), width=max(1, round(w * SS)), joint="curve")

    def save(self, dst: Path, extra: dict | None = None) -> None:
        dst.parent.mkdir(parents=True, exist_ok=True)
        self.img.resize((self.W, self.H), Image.LANCZOS).save(dst, "PNG", optimize=True)
        side = {"projection": self.proj_name, **self.meta, "lonlat_box": self.box, "xy_box": [self.x0, self.y0, self.x1, self.y1],
                "width": self.W, "height": self.H, "source": "Natural Earth v5.1.2 (public domain), https://www.naturalearthdata.com",
                **(extra or {})}
        dst.with_suffix(".json").write_text(json.dumps(side, indent=1) + "\n", encoding="utf-8")


def draw_countries(m: Map, geo: dict, style: str, highlight: set[str] = frozenset()) -> None:
    st = STYLES[style]
    for f in geo["features"]:
        hl = iso3(f) in highlight
        if st["land"] or hl:
            m.fill(f["geometry"], st["hl"] if hl else st["land"])
    for f in geo["features"]:
        m.stroke(f["geometry"], st["border"], st["border_w"] * (1.6 if style == "line" and iso3(f) in highlight else 1))


def draw_time_zones(m: Map, tz: dict, style: str) -> None:
    a, b = STYLES[style]["tz"]
    for f in tz["features"]:
        z = f["properties"].get("zone")
        try:
            k = int(math.floor(float(z)))
        except (TypeError, ValueError):
            continue
        m.fill(f["geometry"], a if k % 2 == 0 else b)


def build_set(catalog: bool) -> None:
    g110, g50, tz = load_geo("110m"), load_geo("50m"), load_geo("tz")
    made = []
    for style in STYLES:
        m = Map("natural-earth", {}, (-180, -90, 180, 90), 3840)
        draw_countries(m, g110, style)
        dst = OUT / f"world-{style}.png"
        m.save(dst)
        made.append((dst, f"World map, {style} style (Natural Earth projection)", ["world", "map", "countries", "borders", style]))
    for name, box in CONTINENTS.items():
        for style in ("paper", "dark"):
            m = Map("natural-earth", {}, box, 3200)
            draw_countries(m, g50, style)
            dst = OUT / f"{name}-{style}.png"
            m.save(dst)
            made.append((dst, f"{name.replace('-', ' ').title()} map, {style} style", [name.replace("-", " "), "continent", "map", "countries", "borders", style]))
    for style in ("paper", "dark"):
        m = Map("natural-earth", {}, (-180, -90, 180, 90), 3840)
        draw_time_zones(m, tz, style)
        for f in g110["features"]:  # land reads through the bands: a light tint over it, then the borders
            m.fill(f["geometry"], "#5A4A30" if style == "paper" else "#FFFFFF", 38 if style == "paper" else 22)
        for f in g110["features"]:
            m.stroke(f["geometry"], STYLES[style]["border"], 1.0)
        dst = OUT / f"world-time-zones-{style}.png"
        m.save(dst)
        made.append((dst, f"World time zones (alternating bands, country borders), {style} style",
                     ["world", "time zones", "utc", "clock", "map", "borders", style]))
    for dst, title, _ in made:
        print(f"  {dst.relative_to(L.PUBLIC)}")
    if catalog:
        new = {}
        for dst, title, tags in made:
            eid = "map-ne-" + dst.stem
            new[eid] = {"id": eid, "kind": "maps", "path": str(dst.relative_to(L.PUBLIC)), "files": [str(dst.with_suffix(".json").relative_to(L.PUBLIC))],
                        "title": title, "tags": sorted(set(tags + ["natural earth", "base map"])), "license": "pd", "license_name": "Public domain",
                        "license_url": "https://www.naturalearthdata.com/about/terms-of-use/", "author": "Natural Earth (rendered by this repository)",
                        "pd_basis": "Natural Earth data is in the public domain; the rendering is CC0.",
                        "source": {"site": "Natural Earth", "page": "https://www.naturalearthdata.com/about/terms-of-use/"},
                        "build": {"from": "generate", "cmd": "tools/library/make_maps.py", "needs": sorted(DATA.values())},
                        "file": L.file_facts(dst)}
        with L.catalog_txn() as cat:
            cat["assets"] = [x for x in cat["assets"] if x["id"] not in new] + list(new.values())
        print(f"catalog: {len(new)} map entries written")


def build_country(code: str, project: str, style: str, pad: float, width: int) -> None:
    geo = load_geo("50m")
    code = code.upper()
    feats = [f for f in geo["features"] if iso3(f) == code]
    if not feats:
        raise SystemExit(f"no country {code} (ISO 3166-1 alpha-3, e.g. IDN, USA, FRA)")
    lons, lats = [], []
    for f in feats:
        for ext, _ in rings(f["geometry"]):
            a = np.asarray(ext, float)
            lons += a[:, 0].tolist()
            lats += a[:, 1].tolist()
    lon0, lon1, lat0, lat1 = min(lons), max(lons), min(lats), max(lats)
    dl, dt = (lon1 - lon0) * pad, (lat1 - lat0) * pad
    box = (max(-180, lon0 - dl), max(-89, lat0 - dt), min(180, lon1 + dl), min(89, lat1 + dt))
    m = Map("equirect", {"lat0": (box[1] + box[3]) / 2}, box, width)
    draw_countries(m, geo, style, {code})
    pdir = L.ROOT / "video-projects" / project
    if not pdir.exists():
        raise SystemExit(f"no project {pdir}")
    dst = pdir / "assets" / "maps" / f"country-{code.lower()}-{style}.png"
    m.save(dst, {"highlight": [code]})
    cp = pdir / "CREDITS.md"
    line = (f"- `assets/maps/{dst.name}`: base map rendered by tools/library/make_maps.py from Natural Earth v5.1.2 "
            "(public domain, https://www.naturalearthdata.com/about/terms-of-use/). No attribution required.\n")
    text = cp.read_text(encoding="utf-8") if cp.exists() else "# Credits\n"
    if dst.name not in text:
        cp.write_text(text.rstrip("\n") + "\n\n" + line, encoding="utf-8")
    print(f"{dst.relative_to(L.ROOT)}  {m.W}x{m.H}  (storyboard: \"assets/maps/{dst.name}\")")


def build_region(name: str, box: tuple, project: str, style: str, width: int, tz: bool) -> None:
    """a map of any lon/lat box (equirectangular around its middle latitude), optionally with time-zone bands"""
    g = load_geo("50m")
    m = Map("equirect", {"lat0": (box[1] + box[3]) / 2}, box, width)
    if tz:
        draw_time_zones(m, load_geo("tz"), style)
        for f in g["features"]:
            m.fill(f["geometry"], "#5A4A30" if style == "paper" else "#FFFFFF", 38 if style == "paper" else 22)
        for f in g["features"]:
            m.stroke(f["geometry"], STYLES[style]["border"], 1.2)
    else:
        draw_countries(m, g, style)
    pdir = L.ROOT / "video-projects" / project
    if not pdir.exists():
        raise SystemExit(f"no project {pdir}")
    dst = pdir / "assets" / "maps" / f"region-{L.slug(name, 30)}{'-time-zones' if tz else ''}-{style}.png"
    m.save(dst, {"region": name, "time_zones": tz})
    cp = pdir / "CREDITS.md"
    line = (f"- `assets/maps/{dst.name}`: base map rendered by tools/library/make_maps.py from Natural Earth v5.1.2 "
            "(public domain, https://www.naturalearthdata.com/about/terms-of-use/). No attribution required.\n")
    text = cp.read_text(encoding="utf-8") if cp.exists() else "# Credits\n"
    if dst.name not in text:
        cp.write_text(text.rstrip("\n") + "\n\n" + line, encoding="utf-8")
    print(f"{dst.relative_to(L.ROOT)}  {m.W}x{m.H}  (storyboard: \"assets/maps/{dst.name}\")")


def locate(png: str, at: list[str], mapbox: str) -> None:
    meta = json.loads(Path(png).with_suffix(".json").read_text())
    proj = PROJ[meta["projection"]](meta)
    x0, y0, x1, y1 = meta["xy_box"]
    bx, by, bw = (float(v) for v in mapbox.split(","))
    scale = bw / meta["width"]
    out = []
    for s in at:
        lon, lat = (float(v) for v in s.split(","))
        x, y = proj(np.array([lon]), np.array([lat]))
        mx = (x[0] - x0) / (x1 - x0) * meta["width"]
        my = (y1 - y[0]) / (y1 - y0) * meta["height"]
        out.append({"x": round(130 + bx + mx * scale), "y": round(90 + by + my * scale)})
    print(json.dumps(out))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", nargs="?", default="set", choices=["set", "country", "region", "locate"])
    ap.add_argument("arg", nargs="?")
    ap.add_argument("--catalog", action="store_true")
    ap.add_argument("--project")
    ap.add_argument("--style", default="paper", choices=list(STYLES))
    ap.add_argument("--pad", type=float, default=0.25)
    ap.add_argument("--width", type=int, default=3200)
    ap.add_argument("--at", nargs="+")
    ap.add_argument("--mapbox", default="-700,-500,3000")
    ap.add_argument("--box", help="region: lon0,lat0,lon1,lat1")
    ap.add_argument("--time-zones", action="store_true", help="region: alternating time-zone bands under the borders")
    a = ap.parse_args()
    if a.cmd == "set":
        build_set(a.catalog)
    elif a.cmd == "country":
        if not a.arg or not a.project:
            raise SystemExit("usage: make_maps.py country <ISO3> --project <slug> [--style paper|dark|line]")
        build_country(a.arg, a.project, a.style, a.pad, a.width)
    elif a.cmd == "region":
        if not a.arg or not a.project or not a.box:
            raise SystemExit("usage: make_maps.py region <name> --box lon0,lat0,lon1,lat1 --project <slug> [--time-zones] [--style ...]")
        build_region(a.arg, tuple(float(v) for v in a.box.split(",")), a.project, a.style, a.width, a.time_zones)
    else:
        if not a.arg or not a.at:
            raise SystemExit("usage: make_maps.py locate <map.png> --at lon,lat [lon,lat ...] [--mapbox x,y,w]")
        locate(a.arg, a.at, a.mapbox)
    return 0


if __name__ == "__main__":
    sys.exit(main())
