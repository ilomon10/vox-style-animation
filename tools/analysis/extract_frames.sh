#!/usr/bin/env bash
# Dump EVERY decoded frame of each reference video/GIF (all ids, or the ids given as arguments) to analysis/frames/<id>/NNNNNN.jpg
# (frame index starts at 0; 640px wide). Native-res single frames can be pulled on demand:
#   ffmpeg -ss <sec> -i <video> -frames:v 1 out.png
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
IDS="$*"
[ -z "$IDS" ] && IDS=$(python3 -I tools/analysis/sources_registry.py ids)
for id in $IDS; do
  src=$(python3 -I tools/analysis/sources_registry.py path "$id")
  mkdir -p "analysis/frames/$id"
  # The sources are BT.709 (tv range). JFIF decoders (PIL, browsers) always read JPEG YCbCr as
  # BT.601 full range, so re-encode the matrix explicitly; otherwise yellows turn green
  # (#F2E500 -> #ECF20C).
  ffmpeg -v error -y -i "$src" -fps_mode passthrough \
         -vf "scale=640:-2:flags=lanczos:in_color_matrix=bt709:out_color_matrix=bt601:out_range=pc" -pix_fmt yuvj420p \
         -q:v 3 -start_number 0 "analysis/frames/$id/%06d.jpg" &
done
wait
for d in analysis/frames/*/; do echo "$d $(ls "$d" | wc -l)"; done
