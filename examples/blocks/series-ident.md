---
block: series-ident
title: Series ident
section: After the question (10–17 % of the runtime)
recipe: SeriesIdent
summary: Our series name rises on a flat colour card under music alone, then a short silence and a hard cut.
example: example-world-time#ident
preview_sec: 3.0
---

# Series ident

![Series ident](series-ident.gif)

Our series name rises on a flat colour card under music alone, then a short silence and a hard cut.

**Use it for:** right after the opening question or thesis. **Section:** After the question (10–17 % of the runtime). **Recipe:** `SeriesIdent` (props and events: [doc 14 §3](../../docs/style-guide/14-production-pipeline.md)).

## Wireframe

The layout at a glance (what Claude shows in a question's preview before anything is rendered):

```text
+--------------------------------------+
|######################################|
|######################################|
|##############  Time Desk  ###########|
|######  HOW THE WORLD AGREED ON TIME #|
|######################################|
|######  (music alone, then a cut) ####|
+--------------------------------------+
```

## Prompt

Fill in the `{…}` parts and add the line to your video request (see [the starters](../starters/)), or send it on its
own inside a project you already have ("add this to the third section: …").

```text
[block: series-ident] Our series "{SERIES NAME}" with the tagline "{TAGLINE}", {card style | over the picture}, right after the question.
```

## The prompt behind the preview

```text
[block: series-ident] Our series "Time Desk" with the tagline "How the world agreed on time", card style, right after the question.
```

The narration it was built on (`video-projects/example-world-time/script.md`):

> (music only: the ident sits in a scripted pause after "So how did the whole world end up on one clock?")

## What the agent builds

Scene `ident` of `video-projects/example-world-time/storyboard.json`, as the agent wrote it (kept in step by
`tools/py tools/examples/make_gallery.py`):

<!-- scene-json -->
```json
{
 "id": "ident",
 "recipe": "SeriesIdent",
 "start": {
  "word": "clock",
  "edge": "end",
  "offset": 12
 },
 "props": {
  "title": "Time Desk",
  "tagline": "HOW THE WORLD AGREED ON TIME",
  "style": "card",
  "holdSec": 3.0,
  "holeF": 6,
  "cardColor": "#6B74DE"
 },
 "note": "block series-ident; after the question, music alone, then a silence hole and a hard cut"
}
```
<!-- /scene-json -->

## Agent notes

How Claude turns `[block: series-ident]` into a scene (the `vox-video` skill reads this section):

- **Script:** put `[PAUSE 3–4]` after the thesis line so the ident has music alone.
- **Storyboard:** start on the thesis's last word (`{"word": "…", "edge": "end", "offset": 12}`); `title` (the user's own series name, sentence case), `tagline`, `style: "card"|"overPicture"`, `cardColor` (the look's accent: `#6B74DE` on `voxEarworm`), `holdSec`, `holeF`. A sting in `sfx[]` at the same anchor (`sub_boom` or `bass_hit`, `peak: true`), and on the NEXT scene `transitionIn: {"kind": "cut", "hole": 6}`.
- **Never** a real channel's name or mark.
