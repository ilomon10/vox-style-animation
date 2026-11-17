"""Frame access for the analysis tools: analysis/frames/<id>/NNNNNN.jpg (640 px wide, BT.709-correct JPEG).

tools/analysis/extract_frames.sh dumps every frame of a reference. For a long or a user-supplied reference that is
wasteful, so frame_path() pulls a missing frame on demand (one exact ffmpeg seek) into the same place, and
n_frames() counts frames from the metrics CSV (one row per decoded frame) when the folder is only partly filled.
"""
import csv
import os
import subprocess

# same conversion as extract_frames.sh: JFIF decoders read JPEG as BT.601 full range, so convert the matrix explicitly
VF = "scale=640:-2:flags=lanczos:in_color_matrix=bt709:out_color_matrix=bt601:out_range=pc"


def frame_path(root, sources, vid, i):
    p = os.path.join(root, "analysis", "frames", vid, f"{i:06d}.jpg")
    if os.path.exists(p) or vid not in sources:
        return p
    src = sources[vid]["path"]
    src = src if os.path.isabs(src) else os.path.join(root, src)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    t = max(0.0, (i - 0.25) / float(sources[vid]["fps"]))  # the first frame with pts >= t is frame i
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.4f}", "-i", src, "-frames:v", "1", "-vf", VF,
                    "-pix_fmt", "yuvj420p", "-q:v", "3", p], check=True)
    return p


def n_frames(root, sources, vid):
    m = os.path.join(root, "analysis", "metrics", f"{vid}.csv")
    if os.path.exists(m):
        with open(m) as fh:
            return max(0, sum(1 for _ in csv.reader(fh)) - 1)
    d = os.path.join(root, "analysis", "frames", vid)
    return len(os.listdir(d)) if os.path.isdir(d) else int(sources.get(vid, {}).get("frames", 0))
