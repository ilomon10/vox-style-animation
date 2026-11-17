# Example: how the world agreed on time

A 39-second Vox-style explainer with ten different blocks, one per section. Most of the previews in the
[block gallery](../../examples/README.md) are cut from it. The prompt that describes it is
[`examples/starters/world-time.md`](../../examples/starters/world-time.md).

Only its text lives in git:
- `script.md`;
- `RESEARCH.md`: every claim, with sources, and the counts it does not use because sources disagree;
- `storyboard.json`, `CREDITS.md`, `project.json`.

Its media are rebuilt locally:

```bash
tools/py tools/examples/build_example.py example-world-time            # the MP4: out/studio/example-world-time.mp4
tools/py tools/examples/build_example.py example-world-time --stills   # one still per scene instead
```

What it demonstrates:

| Scene | Recipe (block) | What to look at |
|---|---|---|
| `collage` | PhotoCollageUnfold (photo-collage) | the sundial unfolds on "sun", the title pops on the same word |
| `ident` | SeriesIdent (series-ident) | music alone in a scripted pause, a sub-boom sting, then a 6 f silence hole before the hard cut |
| `montage` | MontageCrane (montage-crane) | one camera tilt, each print crossed as its noun is spoken |
| `fleming` | NameCardInterview (name-card) | a named portrait of the person, with the card decoding on the name |
| `plan` | DataChart counter (data-counter) | the count starts on "twenty-four" and ends with the phrase |
| `map1883` | DocumentHighlight (document-highlight) | a ring lands on each zone clock as the zone is named |
| `resolution` | QuoteCard (quote-card) | the resolution's own words, typed while the narrator reads them |
| `vote` | DataChart bars (data-bars) | the bars grow on "twenty-two" |
| `today` | FootageClip (footage-clip) | NASA footage, a corner source tag, the date tag on "Today" |
| `end` | EndCard (end-card) | our series name, entered with a glitch cut |

To make it yours, record the narration (`tools/py tools/voice/recording_guide.py video-projects/example-world-time`),
then run `tools/py tools/studio/recue.py video-projects/example-world-time my_take.wav` and build again.
