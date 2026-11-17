# dracula_gif1 — automatic shot table

```
{
 "id": "dracula_gif1",
 "fps": 10,
 "frames": 50,
 "duration_s": 5.0,
 "shots": 2,
 "hard_cuts": 1,
 "soft_transitions": 0,
 "shot_dur_s": {
  "median": 2.5,
  "mean": 2.5,
  "p10": 2.34,
  "p90": 2.66
 },
 "held_frame_frac": 0.02
}
```

cadence_hold: 0 = animated on ones, 1 = on twos, 2 = on threes; None = mostly static.
cam_*: summed global motion over the shot (px at 1920 width; zoom >1 = push-in).

| # | t0–t1 (s) | frames | moving | cadence | cam tx/ty px | zoom | rot° | luma | sat | warm |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.0–2.2 | 23 | 0.95 | 0 | 0.2/-0.2 | 0.999 | 0.0 | 205.7 | 0.035 | 0.9 |
| 2 | 2.3–4.9 | 27 | 1.0 | 0 | 4.8/5.7 | 1.106 | 0.38 | 203.0 | 0.524 | 113.8 |
