# src/studio: the storyboard engine

Renders a whole video from DATA: `video-projects/<slug>/storyboard.json` -> `public/projects/<slug>/` -> composition `StoryboardVideo`.

```
tools/py tools/studio/new_project.py <slug> "<idea>"                        # scaffold
tools/py tools/studio/validate_storyboard.py <slug>          # anchors, assets+credits, cuts, text time, beats
tools/py tools/studio/publish_project.py <slug> [--vo scratch|user] [--clean]
tools/remotion-locked.sh still  src/index.ts StoryboardVideo out/studio/x.png --props='{"project":"<slug>"}' --frame=120 --concurrency=2
tools/remotion-locked.sh render src/index.ts StoryboardVideo out/studio/<slug>.mp4 --props='{"project":"<slug>"}' --concurrency=2
```

| File | Role |
|---|---|
| `types.ts` | the storyboard TypeScript types (`Storyboard`, `Scene`, `Anchor`, `Transition`, `MusicTrack`, ...) |
| `storyboard.schema.json` | JSON Schema of the same (used by the validator; add `"$schema"` in a storyboard for editor completion) |
| `resolve.ts` | anchors -> frames (`cueFrame` + the `SYNC` offsets per event kind), scene starts/ends, asset path rewriting, `resolveStoryboard()` |
| `Timeline.tsx` | scene sequence on the cut frames; sound-locked transitions wrapped around the cuts (both scenes time-shifted into the kit transition's window) |
| `StoryAudio.tsx` | Narration + `MusicBed` (measured duck/ride) + `SongExcerpt` + `Sfx`/`SfxAtPeak` |
| `StoryboardVideo.tsx` | the composition; `calculateStoryboardMetadata` loads storyboard + cues, resolves everything, checks assets (`HEAD`-style probe), sets duration + fps. Props: `project` (default: the published example, else a slate that says how to publish one), `preview: true` (gallery GIFs: no grain, weave, dust or pulse; never for delivery) |

Rules: frames never appear in a storyboard (words + offsets, scene ids, seconds only in music-only passages); durations come from the cue
file; the video ends at the `end.scene` start + `tailSec`. Recipes live in `src/recipes/` (one component per recipe, built only from kit devices).
Full schema, recipe props/events and workflow: `docs/style-guide/14-production-pipeline.md`.

Known limits: recipes are Earworm-native (other `look` values switch theme + film finish only); archival-audio phone EQ is an offline step;
`DipAudio` / `DropAudio` music handoffs are not wired to transitions (mix with `music` track anchors instead).

Example: `video-projects/example-time-zones` (7 scenes, 5 recipes, catalog assets, a Natural Earth map; `npm run example` rebuilds its media and renders it; facts in its RESEARCH.md).
