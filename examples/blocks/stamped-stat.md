---
block: stamped-stat
title: Stamped stat
section: A number, as a record
recipe: StampedStat
look: voxScrapbook
summary: A page rises into frame, the camera pushes in, and a rubber stamp lands the number with a thud; the ink re-inks once a second.
example: example-cab-brain#sixteen
preview_sec: 3.5
---

# Stamped stat

![Stamped stat](stamped-stat.gif)

A page rises into frame, the camera pushes in, and a rubber stamp lands the number with a thud; the ink re-inks once a second.

**Use it for:** a count that feels like an official record: participants, votes, years. **Section:** A number, as a record. **Recipe:** `StampedStat` (props and events: [doc 14 §3](../../docs/style-guide/14-production-pipeline.md)).

## Wireframe

The layout at a glance (what Claude shows in a question's preview before anything is rendered):

```text
+--------------------------------------+
|     .--------------------------.     |
|     | ======================== |     |
|     |   .==================.   |     |
|     |   ||       16       ||   |     |
|     |   || CAB DRIVERS    ||   |     |
|     |   '=================='   |     |
+--------------------------------------+
```

## Prompt

Fill in the `{…}` parts and add the line to your video request (see [the starters](../starters/)), or send it on its
own inside a project you already have ("add this to the third section: …").

```text
[block: stamped-stat] Stamp "{VALUE}" in {red | purple | black} on {a ledger page | a PAGE}, with "{CAPTION}" and "{SUB}".
```

## The prompt behind the preview

```text
[block: stamped-stat] Stamp "16" in purple on a ledger page, with "CAB DRIVERS SCANNED" and "AND 50 OTHER MEN · 2000".
```

The narration it was built on (`video-projects/example-cab-brain/script.md`):

> Sixteen of them, and fifty men who did not drive taxis.

## What the agent builds

Scene `sixteen` of `video-projects/example-cab-brain/storyboard.json`, as the agent wrote it (kept in step by
`tools/py tools/examples/make_gallery.py`):

<!-- scene-json -->
```json
{
 "id": "sixteen",
 "recipe": "StampedStat",
 "start": {
  "word": "Sixteen"
 },
 "props": {
  "value": "16",
  "caption": "CAB DRIVERS SCANNED",
  "sub": "AND 50 OTHER MEN · 2000",
  "ink": "purple",
  "ground": "sky"
 },
 "events": [
  {
   "id": "stamp",
   "at": {
    "word": "Sixteen",
    "offset": 4
   }
  }
 ],
 "note": "block stamped-stat; claim=number (RESEARCH 3)"
}
```
<!-- /scene-json -->

## Agent notes

How Claude turns `[block: stamped-stat]` into a scene (the `vox-video` skill reads this section):

- **Storyboard:** `value`, `caption`, `sub` (short caps lines), `ink`, `rotate` (default −8°), `page` (an ephemera image, default a drawn ledger page), `ground`. Event `stamp` a few frames after the spoken number (the reference: readable +18 f).
- **Sound:** add `{"src": "stamp_thud", "at": <the stamp's anchor>, "peak": true}` to `sfx`.
- **Look:** drawn for `voxScrapbook` (set `"look": "voxScrapbook"` in the storyboard; it brings the `scrapbook` timing profile: phrase cuts lead by 6 f, transitions keep their sounds). Measured on a Vox brand piece: `analysis/vox-sample/vox_braintravel.md`.
