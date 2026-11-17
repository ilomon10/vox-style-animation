#!/usr/bin/env bash
# Run any `npx remotion …` command under a lock, so only ONE Remotion process (render, still, compositions) runs at a
# time: renders take a lot of memory. Concurrency comes from tools/local.env (VOX_CONCURRENCY, written by
# tools/setup.sh from this machine's RAM and cores; remotion.config.ts reads it); an explicit --concurrency flag wins.
#   tools/remotion-locked.sh render src/index.ts StoryboardVideo out/studio/<slug>.mp4 --props='{"project":"<slug>"}'
#   tools/remotion-locked.sh still  src/index.ts StoryboardVideo out/f.png --frame=120 --props='{"project":"<slug>"}'
#   tools/remotion-locked.sh --wait          # block until a render started elsewhere has finished
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -f tools/local.env ]; then set -a; . tools/local.env; set +a; fi
if [ "${1:-}" = "--wait" ]; then exec tools/lock.sh out/.render.lock true; fi
exec tools/lock.sh out/.render.lock npx remotion "$@"
