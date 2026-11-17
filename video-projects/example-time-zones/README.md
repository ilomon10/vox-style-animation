# Example: why railroads gave America time zones

A 30-second Vox-style explainer that shows the whole pipeline. Only its text lives in git: `script.md`, `RESEARCH.md`
(every claim with sources), `storyboard.json`, `CREDITS.md`, `project.json`. Its media are rebuilt locally:

```bash
npm run example                       # = tools/py tools/examples/build_example.py example-time-zones
tools/py tools/examples/build_example.py example-time-zones --stills   # one still per scene instead of the MP4
```

`build_example.py` runs, in order:
1. `fetch.py --for-project`: catalog photos, engravings, music and SFX;
2. `make_maps.py region usa --time-zones`: the Natural Earth map;
3. `scratch_vo.py`: the Kokoro voice-over and its word cues;
4. `validate_storyboard.py`;
5. `publish_project.py`;
6. the render, to `out/studio/example-time-zones.mp4`.

What it demonstrates:
- **Scenes and anchors.** 7 scenes from 5 recipes (ColdOpenYear, KeywordCut, GiantWordCard, MapRoute, EndCard),
  every cut anchored to a spoken word.
- **Map and route.** The map is rendered from Natural Earth; the route waypoints come from `make_maps.py locate`.
- **Sound.** A catalog music bed (CC BY: its attribution line is in `CREDITS.md`) and a catalog SFX placed by its peak.

Make it yours: record the narration (`RECORDING_GUIDE.md` after `tools/py tools/voice/recording_guide.py
video-projects/example-time-zones`), then `tools/py tools/studio/recue.py video-projects/example-time-zones my_take.wav`
and build again.
