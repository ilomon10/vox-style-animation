#!/usr/bin/env bash
# Builds the kit cut-outs (public/assets/cutouts/*.png) from the public-domain test pack (public/assets/cc0/**).
# ImageMagick 7 keys for engravings; AI matting (tools/.venv rembg) for the photo cut-outs.
#
#   bash tools/assets/make_cutouts.sh [magick|ai|man|car|all]      (default: all)
#   SRC=... OUT=... bash tools/assets/make_cutouts.sh magick        (other source/output folders, e.g. for tests)
#
# The magick keys are deterministic for a given ImageMagick version; the rembg mattes need the models
# (birefnet-portrait about 1 GB, isnet-general-use about 180 MB), so `tools/library/fetch.py` normally downloads the
# finished AI cut-outs instead of running `ai` (see public/assets/library/README.md).
# Keys follow tools/assets/cutout_recipes.sh: the silhouette key keeps the engraving's own paper inside the object.
set -euo pipefail
cd "$(dirname "$0")/../.."
SRC=${SRC:-public/assets/cc0}; OUT=${OUT:-public/assets/cutouts}; T=$(mktemp -d); mkdir -p "$OUT"
trap 'rm -rf "$T"' EXIT
LONG=2500
trim() { magick "$1" -trim +repage -resize "${LONG}x${LONG}>" "$2"; }

# silhouette key (= step 2 of cutout_recipes.sh): $1 in, $2 out (untrimmed), $3 threshold (blank = Triangle), $4 speck px
key() {
  local in="$1" out="$2" thr=(-auto-threshold Triangle)
  [ -n "${3:-}" ] && thr=(-threshold "$3")
  magick "$in" -colorspace Gray -blur 0x1 "${thr[@]}" -morphology Erode Disk:3 \
    -colorspace sRGB -bordercolor white -border 1 -fill red -draw 'color 0,0 floodfill' -shave 1x1 \
    -fill white +opaque red -fill black -opaque red -colorspace Gray -threshold 50% \
    -define connected-components:area-threshold="${4:-800}" -define connected-components:mean-color=true \
    -connected-components 8 \
    -morphology Dilate Disk:3 -morphology Open Disk:2 -blur 0x0.8 -level 45%,55% "$T/mask.png"
  magick "$in" "$T/mask.png" -alpha off -compose CopyOpacity -composite "$out"
}

# keep only the largest paper piece(s): $1 in, $2 out, $3 min area px
keep_big() {
  magick "$1" -alpha extract -threshold 50% -define connected-components:area-threshold="$3" \
    -define connected-components:mean-color=true -connected-components 8 -threshold 50% -morphology Dilate Disk:2 "$T/big.png"
  magick "$1" -alpha extract "$T/big.png" -compose Multiply -composite "$T/a.png"
  magick "$1" -alpha off "$T/a.png" -compose CopyOpacity -composite "$T/kb.png"
  trim "$T/kb.png" "$2"
}

make_magick() {
  # bat: the plate at 70 % (1106x823), silhouette key with a LOW fixed threshold (the engraved sky is hatched),
  # then the largest piece only (drops the second bat and the caption specks)
  magick "$SRC/engravings/bat-barbastelle-specht-brehms.jpg" -resize 70% "$T/bat.png"
  key "$T/bat.png" "$T/bat_cut.png" 40% 800
  keep_big "$T/bat_cut.png" "$OUT/bat.png" 150000
  # candelabrum: the plate at 50 %, crop 710x980+150+212 (one candelabrum), Triangle threshold, largest piece
  magick "$SRC/engravings/candelabrum-flambeaux-sallembier-1805.jpg" -resize 50% -crop 710x980+150+212 +repage "$T/cand.png"
  key "$T/cand.png" "$T/cand_cut.png" "" 800
  keep_big "$T/cand_cut.png" "$OUT/candelabrum.png" 150000
  # Bran castle: ink key (engraving -> transparent paper); crop plate frame + caption first
  magick "$SRC/engravings/bran-castle-torcsvar-rohbock-1864.jpg" -crop 2580x1700+190+190 +repage -colorspace Gray -level 12%,80% \
    -negate -background '#1a1410' -alpha Shape "$T/bran.png"
  trim "$T/bran.png" "$OUT/bran-castle-ink.png"
  # furniture: crops from the 2401x3958 plate (coords from an 800 px preview x3.0015)
  local F="$SRC/engravings/furniture-designs-thomas-hope-1807.jpg"
  # line-art key: dilate the ink to close gaps, flood the outside from the corner, invert, shrink back
  crop() {
    magick "$F" -crop "$2" +repage "$T/f.png"
    magick "$T/f.png" -colorspace Gray -blur 0x1 -threshold 78% -negate -morphology Dilate Disk:14 \
      -bordercolor black -border 1 -fill gray50 -draw 'color 0,0 floodfill' -shave 1x1 \
      -fill white +opaque gray50 -fill black -opaque gray50 -colorspace Gray \
      -define connected-components:area-threshold=2000 -define connected-components:mean-color=true -connected-components 8 \
      -threshold 50% -morphology Erode Disk:11 -blur 0x0.8 -level 45%,55% "$T/mask.png"
    magick "$T/f.png" "$T/mask.png" -alpha off -compose CopyOpacity -composite "$T/cut.png"
    trim "$T/cut.png" "$OUT/$1.png"
  }
  crop furniture-bench   930x540+1110+600
  crop furniture-chair   360x560+270+1520
  crop furniture-sphinx  520x720+1400+2500
  crop furniture-table   600x500+890+1585
}

REMBG=${REMBG:-tools/.venv/bin/rembg}
make_man() {
  # Victorian man: portrait matting (MIT BiRefNet weights; never the default bria-rmbg)
  "$REMBG" i -m birefnet-portrait "$SRC/portraits/victorian-man-full-length-cdv-1870.jpg" "$T/man.png"
  trim "$T/man.png" "$OUT/victorian-man.png"
}

make_car() {
  # vintage car: crop the 1931 Chevrolet from the street scene, isnet-general-use matting (Apache-2.0 IS-Net)
  magick "$SRC/photos/chevrolet-1931-shulmans-market-dc-1941.jpg" -crop 1130x520+580+950 +repage "$T/car_in.png"
  "$REMBG" i -m isnet-general-use "$T/car_in.png" "$T/car.png"
  trim "$T/car.png" "$OUT/vintage-car.png"
}

case "${1:-all}" in
  magick) make_magick;; man) make_man;; car) make_car;; ai) make_man; make_car;;
  all|both) make_magick; make_man; make_car;;
  *) echo "usage: $0 [magick|ai|man|car|all]" >&2; exit 2;;
esac
magick identify "$OUT"/*.png
