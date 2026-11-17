# dracula_gif2 — automatic shot table

```
{
 "id": "dracula_gif2",
 "fps": 10,
 "frames": 65,
 "duration_s": 6.5,
 "shots": 5,
 "hard_cuts": 4,
 "soft_transitions": 0,
 "shot_dur_s": {
  "median": 1.0,
  "mean": 1.3,
  "p10": 1.0,
  "p90": 1.84
 },
 "held_frame_frac": 0.141
}
```

cadence_hold: 0 = animated on ones, 1 = on twos, 2 = on threes; None = mostly static.
cam_*: summed global motion over the shot (px at 1920 width; zoom >1 = push-in).

| # | t0–t1 (s) | frames | moving | cadence | cam tx/ty px | zoom | rot° | luma | sat | warm |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.0–0.9 | 10 | 0.0 | None | 0.0/0.0 | 1.0 | -0.0 | 27.8 | 0.102 | 2.7 |
| 2 | 1.0–1.9 | 10 | 1.0 | 0 | 2.3/-14.4 | 1.006 | -0.41 | 47.8 | 0.065 | 3.0 |
| 3 | 2.0–2.9 | 10 | 1.0 | 0 | 1.0/-1.7 | 0.99 | -0.13 | 26.4 | 0.1 | 2.6 |
| 4 | 3.0–4.2 | 13 | 1.0 | 0 | -0.0/0.1 | 1.0 | 0.0 | 69.9 | 0.061 | 2.6 |
| 5 | 4.3–6.4 | 22 | 1.0 | 0 | -8.7/-5.0 | 0.995 | 0.4 | 112.7 | 0.08 | 7.1 |
