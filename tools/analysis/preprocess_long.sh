#!/usr/bin/env bash
# Preprocess long reference videos (YouTube references) for analysis: frames, metrics, shots, segments,
# audio features, words, sparse contact sheets, A/V timelines, sync stats and palette.
# Runs one id after another, and every heavy step under the shared analysis lock (low-memory machine).
#   tools/analysis/preprocess_long.sh vox_amazon [vox_other ...]
# The id must already be registered in tools/analysis/sources.json (tools/source/fetch_reference.py does that).
set -euo pipefail
cd "$(dirname "$0")/../.."
mkdir -p out
LOCK=out/.analysis.lock
[ $# -ge 1 ] || { echo "usage: $0 <id> [id ...]" >&2; exit 2; }
step() { echo "   $(date +%T) $*"; tools/lock.sh "$LOCK" "$@" > /dev/null; }
for id in "$@"; do
  echo "== $id start $(date +%T)"
  step tools/analysis/extract_frames.sh "$id"
  step tools/py tools/analysis/frame_metrics.py "$id"
  step tools/py tools/analysis/shots.py "$id"
  step tools/py tools/analysis/segment_long.py "$id" --target-sec 150
  step tools/py tools/audio/audio_features.py "$id"
  step tools/py tools/audio/transcribe.py "$id" --vad
  step tools/py tools/analysis/contact_sheets.py sheets "$id" --sparse
  step tools/py tools/audio/av_timeline.py "$id"
  step tools/py tools/audio/av_sync.py "$id" --trials 500
  step tools/py tools/analysis/palette.py "$id"
  echo "== $id done $(date +%T): $(ls "analysis/frames/$id" | wc -l) frames, $(ls analysis/sheets/"$id"/sheet_*.png | wc -l) sheets"
done
