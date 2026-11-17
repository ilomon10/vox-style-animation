#!/usr/bin/env bash
# One-command setup for the Vox-style animation framework (Linux, macOS, Windows through WSL2).
# Safe to re-run: every step skips what is already done.
#   bash tools/setup.sh                # everything
#   bash tools/setup.sh --no-voice     # skip the scratch-voice model (354 MB); recording your own voice still works
#   bash tools/setup.sh --no-assets    # skip the kit asset pack (generated textures/SFX + downloaded test images)
#   bash tools/setup.sh --locked       # install the exact Python versions of tools/requirements.lock.txt
#   bash tools/setup.sh --check        # only check the prerequisites
# VOX_MODELS_DIR=<folder holding kokoro-v1.0.onnx and voices-v1.0.bin> reuses voice models you already have.
set -euo pipefail
cd "$(dirname "$0")/.."
VOICE=1 ASSETS=1 LOCKED=0 CHECK=0
for a in "$@"; do
  case "$a" in
    --no-voice) VOICE=0 ;; --no-assets) ASSETS=0 ;; --locked) LOCKED=1 ;; --check) CHECK=1 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "unknown option: $a (see --help)" >&2; exit 2 ;;
  esac
done

say() { printf '\n== %s\n' "$*"; }
ok() { printf '   ok  %s\n' "$*"; }
warn() { printf '   --  %s\n' "$*"; }
MISSING=()
need() { MISSING+=("$1"); printf '   !!  %s\n' "$2"; }

case "$(uname -s)" in
  Linux) OS=linux ;; Darwin) OS=mac ;;
  MINGW*|MSYS*|CYGWIN*) echo "Native Windows shells are not supported: install WSL2 (Ubuntu) and run this inside it." >&2; exit 1 ;;
  *) OS=other ;;
esac
PM=""
for p in apt-get dnf pacman zypper brew; do command -v "$p" >/dev/null 2>&1 && { PM=$p; break; }; done

say "Prerequisites"
if command -v node >/dev/null 2>&1 && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 18 ]; then ok "node $(node --version)"
else need node "Node.js 18 or newer"; fi
command -v npm >/dev/null 2>&1 && ok "npm $(npm --version)" || need node "npm (comes with Node.js)"
if command -v python3 >/dev/null 2>&1 && python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)'; then
  ok "python $(python3 -c 'import platform; print(platform.python_version())')"
  python3 -c 'import venv, ensurepip' 2>/dev/null || need python3-venv "the Python venv module (Debian/Ubuntu: python3-venv)"
else need python3 "Python 3.10 or newer"; fi
for t in ffmpeg ffprobe; do command -v $t >/dev/null 2>&1 && ok "$t" || need ffmpeg "$t (FFmpeg)"; done
if command -v magick >/dev/null 2>&1; then ok "ImageMagick $(magick -version | head -1 | awk '{print $3}')"
else need imagemagick "ImageMagick 7 (the \`magick\` command; version 6's \`convert\` is not enough)"; fi
command -v git >/dev/null 2>&1 && ok "git" || need git "git"
command -v curl >/dev/null 2>&1 && ok "curl" || need curl "curl"
command -v pdftoppm >/dev/null 2>&1 && ok "poppler (pdftoppm)" || warn "poppler (pdftoppm) not found: only needed for PDF documents"
command -v flock >/dev/null 2>&1 && ok "flock" || warn "no flock: render locks fall back to Python (fine)"

if [ ${#MISSING[@]} -gt 0 ]; then
  echo
  echo "Missing: $(printf '%s\n' "${MISSING[@]}" | sort -u | tr '\n' ' ')"
  echo "Install them, then run this script again. Typical commands:"
  case "$PM" in
    apt-get) echo "  sudo apt-get install -y nodejs npm python3 python3-venv ffmpeg git curl poppler-utils"
             echo "  ImageMagick 7: https://imagemagick.org/script/download.php (Debian/Ubuntu's 'imagemagick' package is version 6)" ;;
    dnf) echo "  sudo dnf install -y nodejs python3 ffmpeg ImageMagick git curl poppler-utils" ;;
    pacman) echo "  sudo pacman -S --needed nodejs npm python ffmpeg imagemagick git curl poppler" ;;
    zypper) echo "  sudo zypper install nodejs npm python3 ffmpeg ImageMagick git curl poppler-tools" ;;
    brew) echo "  brew install node python ffmpeg imagemagick git poppler" ;;
    *) echo "  Node.js 18+ (https://nodejs.org), Python 3.10+, FFmpeg, ImageMagick 7, git, curl" ;;
  esac
  [ "$OS" = linux ] && [ -z "$PM" ] && echo "  (no known package manager found)"
  exit 1
fi
[ $CHECK = 1 ] && { echo; echo "Prerequisites are all there."; exit 0; }

say "Node packages"
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund
else ok "node_modules is up to date"; fi

say "Python environment (tools/.venv)"
[ -x tools/.venv/bin/python ] || python3 -m venv tools/.venv
REQ=tools/requirements.txt; [ $LOCKED = 1 ] && REQ=tools/requirements.lock.txt
want=$( (cat "$REQ"; tools/.venv/bin/python -c 'import sys; print(sys.version)') | cksum | cut -d' ' -f1)
if [ "$(cat tools/.venv/.requirements-stamp 2>/dev/null)" != "$want" ]; then
  tools/.venv/bin/python -m pip install --quiet --upgrade pip
  tools/.venv/bin/python -m pip install --quiet -r "$REQ"
  echo "$want" > tools/.venv/.requirements-stamp
  ok "installed $REQ"
else ok "packages are up to date ($REQ)"; fi

sha() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }
if [ $VOICE = 1 ]; then
  say "Scratch-voice model (Kokoro-82M, Apache-2.0; 354 MB)"
  mkdir -p tools/voice/models
  B=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
  while read -r f sum; do
    dst=tools/voice/models/$f
    if [ -f "$dst" ] && [ "$(sha "$dst")" = "$sum" ]; then ok "$f"; continue; fi
    if [ -n "${VOX_MODELS_DIR:-}" ] && [ -f "$VOX_MODELS_DIR/$f" ]; then cp "$VOX_MODELS_DIR/$f" "$dst.part"
    else curl -L --fail --progress-bar -o "$dst.part" "$B/$f"; fi
    if [ "$(sha "$dst.part")" != "$sum" ]; then rm -f "$dst.part"; echo "   !!  $f: checksum mismatch, not installed" >&2; exit 1; fi
    mv "$dst.part" "$dst"; ok "$f"
  done <<'EOF'
kokoro-v1.0.onnx 7d5df8ecf7d4b1878015a32686053fd0eebe2bc377234608764cc0ef3636a6c5
voices-v1.0.bin bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d
EOF
fi

say "Machine settings (tools/local.env)"
if [ -f tools/local.env ]; then ok "kept your tools/local.env"
else
  tools/.venv/bin/python - <<'EOF'
import os
ram_gb = os.sysconf("SC_PAGE_SIZE") * os.sysconf("SC_PHYS_PAGES") / 2**30
cores = os.cpu_count() or 2
c = max(1, min(8, cores // 2, int(ram_gb // 5)))
open("tools/local.env", "w").write(
    "# Machine-local settings (git-ignored), written by tools/setup.sh. Edit freely.\n"
    f"# Parallel frames per render, from {ram_gb:.0f} GB RAM and {cores} cores. Lower it if renders run out of memory.\n"
    f"VOX_CONCURRENCY={c}\n")
print(f"   ok  VOX_CONCURRENCY={c} ({ram_gb:.0f} GB RAM, {cores} cores)")
EOF
fi

if [ $ASSETS = 1 ]; then
  say "Kit asset pack (generated textures, SFX and demo audio; downloaded test images and cut-outs)"
  tools/py tools/library/fetch.py --pack core || warn "some core assets failed (see above); everything else still works"
fi

say "Check"
tools/py tools/doctor.py --quick || true
cat <<'EOF'

Next:
  npm run studio            # browse the kit: galleries, proof shots, storyboard projects
  npm run example           # build and render the example video (video-projects/example-time-zones)
  claude                    # then ask: "make a Vox-style video about <your idea>"
EOF
