# proof_earworm_B — automatic shot table

```
{
 "id": "proof_earworm_B",
 "fps": 25,
 "frames": 949,
 "duration_s": 37.96,
 "shots": 7,
 "hard_cuts": 6,
 "soft_transitions": 2,
 "shot_dur_s": {
  "median": 5.52,
  "mean": 5.42,
  "p10": 2.56,
  "p90": 8.34
 },
 "held_frame_frac": 0.349
}
```

cadence_hold: 0 = animated on ones, 1 = on twos, 2 = on threes; None = mostly static.
cam_*: summed global motion over the shot (px at 1920 width; zoom >1 = push-in).

| # | t0–t1 (s) | frames | moving | cadence | cam tx/ty px | zoom | rot° | luma | sat | warm |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.0–7.0 | 176 | 0.65 | 1 | -23.1/50.0 | 0.296 | -1.71 | 49.6 | 0.028 | -3.1 |
| 2 | 7.04–13.72 | 168 | 0.68 | 1 | -408.7/13.8 | 1.269 | 3.34 | 52.2 | 0.014 | -1.8 |
| 3 | 13.76–17.28 | 89 | 0.59 | 1 | 16.6/-1.6 | 1.018 | 1.52 | 12.1 | 0.007 | -0.8 |
| 4 | 17.32–27.56 | 257 | 0.57 | 1 | -106.8/-20.5 | 1.098 | -35.47 | 43.3 | 0.036 | 1.3 |
| 5 | 27.6–33.08 | 138 | 0.8 | 1 | -43.0/-21.9 | 0.943 | 1.96 | 56.9 | 0.104 | 9.2 |
| 6 | 33.12–36.2 | 78 | 0.6 | 1 | 0.2/-0.5 | 0.965 | -0.04 | 160.0 | 0.023 | -0.5 |
| 7 | 36.24–37.92 | 43 | 0.69 | 1 | -27.8/15.6 | 0.949 | -2.11 | 22.9 | 0.001 | 0.0 |

## Soft transitions (>=3 frames of large color change)

- f538–f542 (21.52–21.68 s, 5 f)
- f552–f558 (22.08–22.32 s, 7 f)
