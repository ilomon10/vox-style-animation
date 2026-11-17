"""Shared helpers for the storyboard tools (publish, validate, new project). Pure stdlib."""
import json
import math
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
ASSET = re.compile(r"^(kit:)?(assets|audio)/.+\.[A-Za-z0-9]{2,5}$")
ANCHOR_KEYS = {"word", "nth", "edge", "offset", "kind", "snap", "after", "sec", "end"}
ANCHOR_KEY_NAME = re.compile(r"^(at|until)$|(At|Until)$")


def project_dir(slug):
    return os.path.join(ROOT, "video-projects", slug)


def load_json(path):
    with open(path) as f:
        return json.load(f)


def is_anchor(v):
    return isinstance(v, dict) and bool(v.keys() & {"word", "after", "sec", "end"}) and set(v) <= ANCHOR_KEYS


def walk_strings(v):
    """every string value in a JSON tree"""
    if isinstance(v, str):
        yield v
    elif isinstance(v, list):
        for x in v:
            yield from walk_strings(x)
    elif isinstance(v, dict):
        for x in v.values():
            yield from walk_strings(x)


def referenced_assets(sb):
    """project-relative / kit: asset strings used anywhere in the storyboard"""
    return sorted({s for s in walk_strings(sb) if ASSET.match(s)})


def rnd(x):
    """JS Math.round"""
    return int(math.floor(x + 0.5))
