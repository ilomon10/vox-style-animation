# highlight — automatic shot table

```
{
 "id": "highlight",
 "fps": 10,
 "frames": 162,
 "duration_s": 16.2,
 "shots": 2,
 "hard_cuts": 1,
 "soft_transitions": 1,
 "shot_dur_s": {
  "median": 8.1,
  "mean": 8.1,
  "p10": 2.42,
  "p90": 13.78
 },
 "held_frame_frac": 0.311
}
```

cadence_hold: 0 = animated on ones, 1 = on twos, 2 = on threes; None = mostly static.
cam_*: summed global motion over the shot (px at 1920 width; zoom >1 = push-in).

| # | t0–t1 (s) | frames | moving | cadence | cam tx/ty px | zoom | rot° | luma | sat | warm |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.0–15.1 | 152 | 0.73 | 1 | -51.0/-114.3 | 0.936 | 5.75 | 167.5 | 0.122 | 20.8 |
| 2 | 15.2–16.1 | 10 | 0.0 | None | 0.0/0.0 | 1.0 | 0.0 | 0.0 | 0.0 | 0.0 |

## Soft transitions (>=3 frames of large color change)

- f150–f152 (15.0–15.2 s, 3 f)
