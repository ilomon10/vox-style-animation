---
block: paper-sheet-slide
title: Paper-sheet slide
section: Any transition
recipe: paperSlide (transition)
look: voxScrapbook
summary: The next scene arrives on its own sheet of paper from a corner, or the current sheet slides away and reveals it.
example: example-cab-brain#streets
preview_from: -0.9
preview_sec: 3.0
---

# Paper-sheet slide

![Paper-sheet slide](paper-sheet-slide.gif)

The next scene arrives on its own sheet of paper from a corner, or the current sheet slides away and reveals it.

**Use it for:** moving between two sections without a hard cut, about once a minute. **Section:** Any transition. **Recipe:** `paperSlide (transition)` (props and events: [doc 14 §3](../../docs/style-guide/14-production-pipeline.md)).

## Wireframe

The layout at a glance (what Claude shows in a question's preview before anything is rendered):

```text
+--------------------------------------+
|  current scene keeps playing         |
|        .---------------------.       |
|       /  next scene on its    /      |
|      /  own sheet, from the  /       |
|     /  corner, -25 -> 0 deg /        |
|    '---------------------'           |
+--------------------------------------+
```

## Prompt

Fill in the `{…}` parts and add the line to your video request (see [the starters](../starters/)), or send it on its
own inside a project you already have ("add this to the third section: …").

```text
[block: paper-sheet-slide] {in: the next section arrives on a sheet from the CORNER | out: the current sheet leaves to the CORNER}.
```

## The prompt behind the preview

```text
[block: paper-sheet-slide] in: the map of London arrives on a sheet from the bottom-left corner.
```

The narration it was built on (`video-projects/example-cab-brain/script.md`):

> It covers about twenty-five thousand streets, all within six miles of Charing Cross.

## What the agent builds

Scene `streets` of `video-projects/example-cab-brain/storyboard.json`, as the agent wrote it (kept in step by
`tools/py tools/examples/make_gallery.py`):

<!-- scene-json -->
```json
{
 "id": "streets",
 "recipe": "PaperStat",
 "start": {
  "word": "It"
 },
 "transitionIn": {
  "kind": "paperSlide",
  "variant": "in",
  "corner": "bl"
 },
 "props": {
  "value": "25,000",
  "unit": "streets",
  "context": "within six miles of Charing Cross",
  "payoff": "BY HEART",
  "image": "kit:assets/library/maps/cities/map-london-bacon-1890.jpg"
 },
 "events": [
  {
   "id": "value",
   "at": {
    "word": "twenty-five",
    "kind": "object"
   }
  },
  {
   "id": "context",
   "at": {
    "word": "within",
    "kind": "object"
   }
  },
  {
   "id": "payoff",
   "at": {
    "word": "miles",
    "kind": "object"
   }
  }
 ],
 "note": "block torn-paper-stat; slot=context claim=number (RESEARCH 1)"
}
```
<!-- /scene-json -->

## Agent notes

How Claude turns `[block: paper-sheet-slide]` into a scene (the `vox-video` skill reads this section):

- **Storyboard:** on the INCOMING scene, `"transitionIn": {"kind": "paperSlide", "variant": "in" | "out", "corner": "bl" | "br" | "tl" | "tr"}`. "in": 10 f, ease-out, the sheet rotates −25° → 0. "out": 12 f, accelerating, the old sheet turns +12° as it leaves.
- **Sound:** a paper swoosh peaks 2 f (in) or 4 f (out) after the move starts; `"sfx": false` mutes it (the reference keeps it on some slides only: watch the SFX budget).
- **Use:** about one per minute (the reference: 8 in 4 min 16 s), between sections that each have their own ground.
- **Look:** drawn for `voxScrapbook` (set `"look": "voxScrapbook"` in the storyboard; it brings the `scrapbook` timing profile: phrase cuts lead by 6 f, transitions keep their sounds). Measured on a Vox brand piece: `analysis/vox-sample/vox_braintravel.md`.
