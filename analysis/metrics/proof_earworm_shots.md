# proof_earworm — automatic shot table

```
{
 "id": "proof_earworm",
 "fps": 25,
 "frames": 791,
 "duration_s": 31.64,
 "shots": 3,
 "hard_cuts": 2,
 "soft_transitions": 0,
 "shot_dur_s": {
  "median": 12.64,
  "mean": 10.55,
  "p10": 5.54,
  "p90": 14.72
 },
 "held_frame_frac": 0.404
}
```

cadence_hold: 0 = animated on ones, 1 = on twos, 2 = on threes; None = mostly static.
cam_*: summed global motion over the shot (px at 1920 width; zoom >1 = push-in).

| # | t0–t1 (s) | frames | moving | cadence | cam tx/ty px | zoom | rot° | luma | sat | warm |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.0–12.6 | 316 | 0.53 | 1 | 67.2/1041.1 | 0.796 | -18.62 | 38.5 | 0.012 | -1.7 |
| 2 | 12.64–27.84 | 381 | 0.67 | 1 | -82.5/372.4 | 1.629 | -17.16 | 31.1 | 0.006 | -0.5 |
| 3 | 27.88–31.6 | 94 | 0.52 | 1 | -255.4/223.9 | 0.462 | -0.7 | 75.4 | 0.0 | 0.0 |
