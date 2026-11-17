---
block: data-counter
title: Number counter
section: Evidence: one number
recipe: DataChart
summary: A number counts up to its value on the spoken number, with a label and a hand-drawn ring.
example: example-world-time#plan
preview_sec: 2.8
---

# Number counter

![Number counter](data-counter.gif)

A number counts up to its value on the spoken number, with a label and a hand-drawn ring.

**Use it for:** a single number the audience should remember. **Section:** Evidence: one number. **Recipe:** `DataChart` (props and events: [doc 14 §3](../../docs/style-guide/14-production-pipeline.md)).

## Wireframe

The layout at a glance (what Claude shows in a question's preview before anything is rendered):

```text
+--------------------------------------+
|               .-----.                |
|              (  2 4  )  counts up    |
|               '-----'   on the word  |
|                                      |
|      TIME ZONES . ONE PER HOUR       |
|                                      |
+--------------------------------------+
```

## Prompt

Fill in the `{…}` parts and add the line to your video request (see [the starters](../starters/)), or send it on its
own inside a project you already have ("add this to the third section: …").

```text
[block: data-counter] Count up to {NUMBER}{ with a prefix/suffix such as $ or %} with the label "{LABEL}"{ and ring it}.
```

## The prompt behind the preview

```text
[block: data-counter] Count up to 24 with the label "TIME ZONES · ONE PER HOUR" and ring it.
```

The narration it was built on (`video-projects/example-world-time/script.md`):

> His plan: twenty-four time zones, one for every hour.

## What the agent builds

Scene `plan` of `video-projects/example-world-time/storyboard.json`, as the agent wrote it (kept in step by
`tools/py tools/examples/make_gallery.py`):

<!-- scene-json -->
```json
{
 "id": "plan",
 "recipe": "DataChart",
 "start": {
  "word": "His"
 },
 "props": {
  "mode": "counter",
  "value": 24,
  "label": "TIME ZONES · ONE PER HOUR",
  "ring": true
 },
 "events": [
  {
   "id": "count",
   "at": {
    "word": "twenty-four",
    "kind": "object"
   },
   "until": {
    "word": "zones",
    "edge": "end"
   }
  }
 ],
 "note": "block data-counter; slot=evidence claim=number (RESEARCH 4)"
}
```
<!-- /scene-json -->

## Agent notes

How Claude turns `[block: data-counter]` into a scene (the `vox-video` skill reads this section):

- **Storyboard:** `mode: "counter"`, `value`, `prefix`/`suffix`, `label` (caps; use ` · ` rather than a comma, which reads as a full stop in the condensed caps), `ring`. Event `count` on the number's first spoken word (kind `object`) with `until` the end of its phrase.
- **Facts:** the number comes from `RESEARCH.md`; spell it as spoken in the script.
