#!/usr/bin/env python3
"""Release audit: list what git would publish and check that it is safe to publish.

  tools/py tools/dev/release_audit.py            # checks; exit 1 on any error
  tools/py tools/dev/release_audit.py --list     # also print every file that would be published

Needs a git repository (no commit required): the would-be-published set is `git ls-files -co --exclude-standard`,
i.e. tracked + untracked files minus everything .gitignore and .git/info/exclude hide.

Errors:
  - a private path (reference videos and everything derived from them, users' recordings, reference extractions)
  - any media or model file (the asset library is catalog-only), except the palette swatches in analysis/palettes
    and the gallery previews in examples/ (GIFs: blocks <= 2 MB, starter reels <= 4 MB, 30 MB together)
  - a file over 5 MB
  - a home-directory path, an e-mail address, or something that looks like a token or private key, in a text file
  - a private library cut from a Vox video (`assets/vox-<name>`, e.g. the maintainer's Earworm library) mentioned in a
    published file, or any file under public/assets/vox-*
  - the name of a local project that does not ship (a folder in video-projects/ with no published file) mentioned in a
    published file: storyboard defaults, registries and docs must not point at someone's private work
  - catalog check errors (tools/library/catalog.py check)
  - plugin / marketplace / skill inconsistencies, and an invalid chat skill (tools/dev/make_chat_skill.py --check)
"""
from __future__ import annotations

import argparse
import fnmatch
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MAX_BYTES = 5 << 20
PRIVATE = ["reference/*", "public/_private/*", "public/assets/vox-*", "public/audio/_private/*", "public/projects/*",
           "analysis/frames/*", "analysis/stills/*", "analysis/sheets/*", "analysis/strips/*", "analysis/segments/*",
           "analysis/av/*", "analysis/compare/*", "analysis/audio/*_words.json", "analysis/audio/*_transcript.md",
           "analysis/audio/*_phrases.json", "analysis/audio/*_sync.json", "video-projects/*/reference/*",
           "video-projects/*/assets/ref/*", "*vo_user*", "tools/local.env", "tools/analysis/sources.local.json",
           "tools/voice/models/*", "out/*", "node_modules/*", "tools/.venv/*"]
PRIVATE_LIB = re.compile(r"assets/vox-[a-z0-9][a-z0-9-]*")  # libraries cut from Vox videos stay on the maintainer's disk
MEDIA = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".bmp", ".psd", ".wav", ".mp3", ".flac", ".ogg", ".oga",
         ".m4a", ".aac", ".mp4", ".mov", ".webm", ".mkv", ".avi", ".onnx", ".bin", ".pt", ".pdf", ".zip", ".npz", ".npy"}
MEDIA_OK = ["analysis/palettes/*.png", "examples/blocks/*.gif", "examples/starters/*.gif"]
PREVIEW_MAX = {"examples/blocks/": 2_000_000, "examples/starters/": 4_000_000}  # bytes per gallery GIF
PREVIEWS_MAX = 30_000_000  # bytes, all of them
TEXT_EXT = {".md", ".json", ".ts", ".tsx", ".js", ".mjs", ".py", ".sh", ".txt", ".csv", ".yml", ".yaml", ".toml", ".html", ""}
SECRETS = [
    (re.compile(r"/home/(?!user\b|you\b|<)[a-z_][a-z0-9_-]+/"), "home-directory path"),
    (re.compile(r"/Users/(?!you\b|<)[A-Za-z][A-Za-z0-9_-]+/"), "home-directory path"),
    (re.compile(r"/tmp/claude-\d+"), "agent scratchpad path"),
    (re.compile(r"\b[A-Za-z0-9._%+-]+@(?!example\.|users\.noreply\.github\.com)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b"), "e-mail address"),
    (re.compile(r"\b(ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}"), "GitHub token"),
    (re.compile(r"\bsk-(ant-)?[A-Za-z0-9_-]{20,}"), "API key"),
    (re.compile(r"\bAKIA[0-9A-Z]{16}\b"), "AWS key"),
    (re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}"), "Slack token"),
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"), "private key"),
]
EMAIL_OK = {"git@github.com", "noreply@anthropic.com", "support@anthropic.com"}
SKIP_TEXT = {"package-lock.json"}


def published() -> list[str]:
    if not (ROOT / ".git").exists():
        raise SystemExit("not a git repository: run `git init` first (no commit is needed)")
    out = subprocess.run(["git", "ls-files", "-co", "--exclude-standard", "-z"], cwd=ROOT, capture_output=True, check=True).stdout
    return sorted(p for p in out.decode().split("\0") if p and (ROOT / p).is_file())


def match(path: str, pats: list[str]) -> bool:
    return any(fnmatch.fnmatch(path, p) for p in pats)


def unshipped_project_names(files: list[str]) -> list[re.Pattern]:
    """whole-word patterns for local projects that do not ship (and their snake_case spelling, e.g. a registry key)"""
    root = ROOT / "video-projects"
    shipped = {Path(p).parts[1] for p in files if p.startswith("video-projects/") and len(Path(p).parts) > 2}
    local = {d.name for d in root.iterdir() if d.is_dir()} if root.exists() else set()
    names = set()
    for n in local - shipped:
        core = n.strip("_-")
        names |= {core, core.replace("-", "_")}
    return [re.compile(rf"(?<![A-Za-z0-9-]){re.escape(n)}(?![A-Za-z0-9-])") for n in sorted(names) if len(n) >= 6]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()
    files = published()
    private_projects = unshipped_project_names(files)
    errors: list[str] = []
    total = 0
    previews = 0
    sizes = []
    for p in files:
        f = ROOT / p
        n = f.stat().st_size
        total += n
        sizes.append((n, p))
        ext = f.suffix.lower()
        if match(p, PRIVATE):
            errors.append(f"private path: {p}")
        for rx in private_projects:
            if rx.search(p):
                errors.append(f"file named after the unshipped local project {rx.search(p).group(0)!r}: {p}")
        if ext in MEDIA and not match(p, MEDIA_OK):
            errors.append(f"media file (the library is catalog-only): {p}")
        if n > MAX_BYTES:
            errors.append(f"over 5 MB ({n / 1e6:.1f} MB): {p}")
        if ext == ".gif" and match(p, MEDIA_OK):
            previews += n
            cap = next(v for k, v in PREVIEW_MAX.items() if p.startswith(k))
            if n > cap:
                errors.append(f"gallery preview over {cap / 1e6:.0f} MB ({n / 1e6:.2f} MB): {p} (shorten its preview, then make_gallery.py)")
        if ext in TEXT_EXT and f.name not in SKIP_TEXT and n < 8 << 20:
            try:
                text = f.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for rx, what in SECRETS:
                for m in rx.finditer(text):
                    s = m.group(0)
                    if what == "e-mail address" and (s in EMAIL_OK or s.endswith((".png", ".jpg", ".svg", ".js", ".ts"))):
                        continue
                    line = text.count("\n", 0, m.start()) + 1
                    errors.append(f"{what} in {p}:{line}: {s[:60]}")
            m = PRIVATE_LIB.search(text) if p != "tools/dev/release_audit.py" else None
            if m:
                line = text.count("\n", 0, m.start()) + 1
                errors.append(f"mentions the private library {m.group(0)}: {p}:{line}")
            for rx in private_projects:
                for m in rx.finditer(text):
                    line = text.count("\n", 0, m.start()) + 1
                    errors.append(f"names the unshipped local project {m.group(0)!r}: {p}:{line}")

    if previews > PREVIEWS_MAX:
        errors.append(f"gallery previews total {previews / 1e6:.1f} MB (limit {PREVIEWS_MAX / 1e6:.0f} MB)")

    # catalog
    r = subprocess.run([sys.executable, "-I", str(ROOT / "tools" / "library" / "catalog.py"), "check"], cwd=ROOT,
                       capture_output=True, text=True)
    if r.returncode != 0:
        errors += [f"catalog: {ln.strip()}" for ln in r.stdout.splitlines() if "ERROR" in ln] or ["catalog check failed"]

    # the claude.ai chat skill (chat-skill/vox-director)
    r = subprocess.run([sys.executable, "-I", str(ROOT / "tools" / "dev" / "make_chat_skill.py"), "--check"], cwd=ROOT,
                       capture_output=True, text=True)
    if r.returncode != 0:
        errors += [f"chat skill: {ln.strip()[3:]}" for ln in r.stdout.splitlines() if ln.strip().startswith("!!")] or ["chat skill check failed"]

    # plugin, marketplace, skills
    canon = {d.name for d in (ROOT / ".claude" / "skills").iterdir() if (d / "SKILL.md").exists()} if (ROOT / ".claude" / "skills").exists() else set()
    for name in canon:
        head = (ROOT / ".claude" / "skills" / name / "SKILL.md").read_text(encoding="utf-8").split("---")
        if len(head) < 3 or f"name: {name}" not in head[1] or "description:" not in head[1]:
            errors.append(f"skill {name}: SKILL.md needs front matter with name: {name} and a description")
    mp = ROOT / ".claude-plugin" / "marketplace.json"
    if mp.exists():
        try:
            m = json.loads(mp.read_text())
            for pl in m.get("plugins", []):
                src = pl.get("source")
                pdir = ROOT / src if isinstance(src, str) else None
                if not pdir or not (pdir / ".claude-plugin" / "plugin.json").exists():
                    errors.append(f"marketplace plugin {pl.get('name')}: no .claude-plugin/plugin.json under {src}")
                    continue
                pj = json.loads((pdir / ".claude-plugin" / "plugin.json").read_text())
                if pj.get("name") != pl.get("name"):
                    errors.append(f"plugin name {pj.get('name')!r} != marketplace entry {pl.get('name')!r}")
                launchers = {d.name for d in (pdir / "skills").iterdir() if (d / "SKILL.md").exists()} if (pdir / "skills").exists() else set()
                for ln in launchers:
                    if ln not in canon:
                        errors.append(f"plugin skill {ln} has no canonical .claude/skills/{ln}/SKILL.md")
                    elif f".claude/skills/{ln}/SKILL.md" not in (pdir / "skills" / ln / "SKILL.md").read_text(encoding="utf-8"):
                        errors.append(f"plugin skill {ln} does not point at .claude/skills/{ln}/SKILL.md")
                for c in canon - launchers:
                    errors.append(f"skill {c} has no launcher in {src}/skills/")
        except (json.JSONDecodeError, OSError) as e:
            errors.append(f"marketplace.json: {e}")
    else:
        errors.append("missing .claude-plugin/marketplace.json")

    if a.list:
        for p in files:
            print(p)
    print(f"would publish {len(files)} files, {total / 1e6:.1f} MB. Largest:")
    for n, p in sorted(sizes, reverse=True)[:6]:
        print(f"  {n / 1e6:6.2f} MB  {p}")
    for e in errors:
        print(f"  ERROR {e}")
    print("audit: " + ("PASS" if not errors else f"{len(errors)} errors"))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
