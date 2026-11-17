#!/usr/bin/env bash
# Cut-out / print-treatment recipes for the Vox-style framework (ImageMagick 7, tested 2026-11-13).
# Usage: bash tools/assets/cutout_recipes.sh <input image> <output dir> [ink-hex]
#   env THRESH=40%  -> fixed paper/ink threshold for the silhouette key (default: -auto-threshold Triangle;
#                      use a LOW value such as 40% when the background itself is hatched, e.g. engraved sky)
#   env SPECK=800   -> drop specks/blobs smaller than this many pixels from the mask
# Produces: _ink (paper->transparent), _mask + _cut (outer paper removed, interior kept),
#           _sticker (white die-cut border + shadow), _torn (rough displaced border),
#           _duotone, _halftone, _photocopy.  Background: analysis/assets-and-fonts.md section 5, docs/style-guide/09-assets.md section 3.
set -euo pipefail
in="$1"; out="${2:-.}"; ink="${3:-#1a1410}"
mkdir -p "$out"; b=$(basename "${in%.*}")

# 1) INK KEY - engraving/line art on light paper: luminance -> alpha, recolour ink.
#    -level black%,white%: everything darker than 15% = full ink, lighter than 85% = paper (gone).
magick "$in" -colorspace Gray -level 15%,85% -negate -background "$ink" -alpha Shape "$out/${b}_ink.png"

# 2) SILHOUETTE KEY - keep the paper INSIDE the object, drop only the outer background
#    (threshold -> thicken ink to close gaps -> flood-fill outside from the corner -> invert -> soften).
#    Triangle auto-threshold suits "mostly paper" scans; set THRESH=90% (etc.) to force a level.
#    Raise Erode radius if the flood fill leaks inside the object. Crop away scan borders/plate lines first.
#    Connected components < SPECK px (default 800) are dropped: foxing, dust, stray hatching.
if [ -n "${THRESH:-}" ]; then thr=(-threshold "$THRESH"); else thr=(-auto-threshold Triangle); fi
magick "$in" -colorspace Gray -blur 0x1 "${thr[@]}" -morphology Erode Disk:3 \
  -colorspace sRGB -bordercolor white -border 1 -fill red -draw 'color 0,0 floodfill' -shave 1x1 \
  -fill white +opaque red -fill black -opaque red -colorspace Gray -threshold 50% \
  -define connected-components:area-threshold="${SPECK:-800}" -define connected-components:mean-color=true \
  -connected-components 8 \
  -morphology Dilate Disk:3 -morphology Open Disk:2 -blur 0x0.8 -level 45%,55% "$out/${b}_mask.png"
magick "$in" "$out/${b}_mask.png" -alpha off -compose CopyOpacity -composite "$out/${b}_cut.png"

# 3) STICKER - white die-cut border (dilated alpha) + soft drop shadow.  Border = Disk radius in px.
magick "$out/${b}_cut.png" -bordercolor none -border 48 \
  \( +clone -alpha extract -morphology Dilate Disk:14 -blur 0x1 -level 48%,52% \
     -background '#fbf8f1' -alpha Shape \) +swap -compose Over -composite \
  \( +clone -background black -shadow 40x9+8+12 \) +swap -background none -layers merge +repage \
  "$out/${b}_sticker.png"

# 4) TORN / HAND-CUT EDGE - displace the dilated border with blurred noise (seeded => reproducible).
read -r W H < <(magick identify -format '%w %h\n' "$out/${b}_cut.png")
W2=$((W+96)); H2=$((H+96))
magick -seed 7 -size ${W2}x${H2} xc:gray50 +noise Random -channel R -separate +channel \
  -virtual-pixel tile -blur 0x5 -auto-level "$out/${b}_noise.png"
magick "$out/${b}_cut.png" -bordercolor none -border 48 \
  \( +clone -alpha extract -morphology Dilate Disk:16 "$out/${b}_noise.png" \
     -compose Displace -define compose:args=14x14 -composite -blur 0x0.6 -level 48%,52% \
     -background '#f4ecdc' -alpha Shape \) +swap -compose Over -composite "$out/${b}_torn.png"
rm -f "$out/${b}_noise.png"

# 5) DUOTONE - map gray ramp onto two inks (shadow, highlight). Warm paper below; crimson variant:
#    +level-colors '#2a0b0e','#e9d8c8'
magick "$in" -colorspace Gray -sigmoidal-contrast 4x50% +level-colors '#231a14','#f3e9d6' "$out/${b}_duotone.jpg"

# 6) HALFTONE - 45 deg ordered-dither dots (h16x16o = 16 px cells; h8x8o = finer). Blur first kills
#    moire with the engraving's own hatching; +repage after each rotate or the crop goes off-centre.
magick "$in" -colorspace Gray -blur 0x1.5 -background white -rotate 45 +repage -ordered-dither h16x16o \
  -rotate -45 +repage -gravity center -crop "$(magick identify -format '%wx%h' "$in")+0+0" +repage \
  "$out/${b}_halftone.png"

# 7) PHOTOCOPY B&W (dark-collage look): crush mids, lift contrast, add mono grain.
magick "$in" -colorspace Gray -contrast-stretch 2%x1% -sigmoidal-contrast 7x50% \
  -attenuate 0.35 +noise Gaussian -colorspace Gray "$out/${b}_photocopy.jpg"
echo "done: $out/${b}_*"
