#!/usr/bin/env bash
# Get (or update) the Vox-style animation framework, then set it up. Used by the vox-studio plugin's skills.
#   bash bootstrap.sh [target-dir]
# Target: the given folder; else the current directory if it is already a checkout; else $VOX_STUDIO_HOME; else ./vox-studio.
# Env: VOX_STUDIO_REPO (default https://github.com/ilomon10/vox-style-animation), VOX_SETUP_ARGS (e.g. --no-voice).
# Prints VOX_STUDIO_ROOT=<folder> as its last line.
set -euo pipefail
REPO="${VOX_STUDIO_REPO:-https://github.com/ilomon10/vox-style-animation}"
is_checkout() { [ -f "$1/src/studio/StoryboardVideo.tsx" ] && [ -f "$1/tools/setup.sh" ]; }
if [ $# -ge 1 ]; then T="$1"
elif is_checkout "$PWD"; then T="$PWD"
elif [ -n "${VOX_STUDIO_HOME:-}" ]; then T="$VOX_STUDIO_HOME"
else T="$PWD/vox-studio"; fi
command -v git >/dev/null 2>&1 || { echo "git is required (https://git-scm.com)" >&2; exit 1; }
if is_checkout "$T"; then
  echo "framework found at $T"
  if [ -d "$T/.git" ]; then git -C "$T" pull --ff-only --quiet || echo "(local changes: kept the local version, no update)"; fi
else
  if [ -e "$T" ] && [ -n "$(ls -A "$T" 2>/dev/null)" ]; then
    echo "$T exists and is not a framework checkout: choose another folder (bash bootstrap.sh <folder>)" >&2; exit 1
  fi
  echo "cloning $REPO -> $T"
  git clone --depth 1 "$REPO" "$T"
fi
# shellcheck disable=SC2086
bash "$T/tools/setup.sh" ${VOX_SETUP_ARGS:-}
echo "VOX_STUDIO_ROOT=$T"
