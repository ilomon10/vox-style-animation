"""Video probing shared by tools/source/fetch_reference.py and tools/reference/ingest.py."""
import json
import os
import subprocess
from fractions import Fraction

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
LOCK = os.path.join(ROOT, "out", ".analysis.lock")


def probe(path):
    """exact fps, frame count, duration, size; vfr = True when frame timing is not constant."""
    j = json.loads(subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate,avg_frame_rate,codec_name,time_base:format=duration,size",
         "-of", "json", path]))
    st, fmt = j["streams"][0], j["format"]
    pts = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                   "packet=pts_time", "-of", "csv=p=0", path]).decode().split()
    pts = sorted(float(x) for x in pts if x not in ("", "N/A"))
    r, avg = Fraction(st["r_frame_rate"]), Fraction(st["avg_frame_rate"]) if st["avg_frame_rate"] != "0/0" else Fraction(0)
    nominal = 1 / float(r)
    d = [b - a for a, b in zip(pts, pts[1:])]
    jitter = (max(d) - min(d)) / nominal if d else 0
    vfr = (avg != 0 and abs(float(r) - float(avg)) / float(r) > 0.001) or jitter > 0.25
    return {"fps_fraction": st["r_frame_rate"], "fps": float(r), "avg_frame_rate": st["avg_frame_rate"],
            "frames": len(pts), "duration": float(fmt["duration"]), "size": int(fmt["size"]),
            "width": st["width"], "height": st["height"], "codec": st["codec_name"],
            "vfr": bool(vfr), "pts_jitter_frames": round(jitter, 3)}


def has_audio(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", path],
                         capture_output=True, text=True).stdout.strip()
    return bool(out)


def reencode_cfr(path, fps_fraction):
    """re-encode a variable-frame-rate video to constant frame rate in place (one heavy job at a time)"""
    tmp = path[:-4] + ".cfr.mp4"
    os.makedirs(os.path.dirname(LOCK), exist_ok=True)
    subprocess.check_call([os.path.join(ROOT, "tools", "lock.sh"), LOCK, "ffmpeg", "-v", "error", "-y", "-i", path, "-fps_mode", "cfr",
                           "-r", fps_fraction, "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-c:a", "copy", tmp])
    os.replace(tmp, path)
