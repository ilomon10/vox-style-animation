---
block: torn-paper-chapter-card
title: Torn-paper chapter card
section: Chapter break
recipe: ChapterCard
look: voxScrapbook
summary: A chapter number on an aged scrap and a halftone title strip build over a section-colour paper, with an engraving and a print.
example: example-cab-brain#ch2
preview_sec: 4.4
---

# Torn-paper chapter card

![Torn-paper chapter card](torn-paper-chapter-card.gif)

A chapter number on an aged scrap and a halftone title strip build over a section-colour paper, with an engraving and a print.

**Use it for:** the start of each chapter (and, with a kicker instead of a number, a title or end card). **Section:** Chapter break. **Recipe:** `ChapterCard` (props and events: [doc 14 §3](../../docs/style-guide/14-production-pipeline.md)).

## Wireframe

The layout at a glance (what Claude shows in a question's preview before anything is rendered):

```text
+--------------------------------------+
|                       .------------. |
|  [Chapter Two ---]    | engraving  | |
| .----------------.    | (multiply) | |
| |  The scan      |    '------------' |
| '----------------'      .-------.    |
|   halftone title strip  | print |    |
+--------------------------------------+
```

## Prompt

Fill in the `{…}` parts and add the line to your video request (see [the starters](../starters/)), or send it on its
own inside a project you already have ("add this to the third section: …").

```text
[block: torn-paper-chapter-card] Chapter {NUMBER}: "{TITLE}" on {pink | mint | blue | coral} paper, with {AN ENGRAVING OR MAP} and {A PHOTO} of {SUBJECT}.
```

## The prompt behind the preview

```text
[block: torn-paper-chapter-card] Chapter Two: "The scan" on dusty-blue paper, with a London street plan and a brain engraving.
```

The narration it was built on (`video-projects/example-cab-brain/script.md`):

> In two thousand, neuroscientists scanned the brains of London cab drivers.

## What the agent builds

Scene `ch2` of `video-projects/example-cab-brain/storyboard.json`, as the agent wrote it (kept in step by
`tools/py tools/examples/make_gallery.py`):

<!-- scene-json -->
```json
{
 "id": "ch2",
 "recipe": "ChapterCard",
 "start": {
  "word": "In",
  "nth": 2
 },
 "props": {
  "number": "Two",
  "title": "The scan",
  "ground": "blue",
  "pieces": [
   {
    "src": "kit:assets/library/maps/cities/map-london-temple-ordnance-1890s.jpg",
    "x": 880,
    "y": 30,
    "w": 1000,
    "h": 655,
    "kind": "engraving"
   },
   {
    "src": "kit:assets/library/engravings/anatomy/engr-brain-lateral-sobotta-1909.jpg",
    "x": 1180,
    "y": 600,
    "w": 620,
    "h": 420,
    "rotate": 4,
    "kind": "print"
   }
  ]
 },
 "events": [
  {
   "id": "title",
   "at": {
    "word": "scanned",
    "kind": "title"
   }
  }
 ],
 "note": "block torn-paper-chapter-card; claim=fact (RESEARCH 3)"
}
```
<!-- /scene-json -->

## Agent notes

How Claude turns `[block: torn-paper-chapter-card]` into a scene (the `vox-video` skill reads this section):

- **Script:** the card holds 3–4 s (measured 3.1–4.0 s): if the chapter's first line is short, let the card run under the next phrase too, and start the next scene on a later word.
- **Storyboard:** `number` ("One", "Two"…) or `kicker` (an end card), `title` (1–3 words), `ground` (one colour per chapter), `pieces[]` right of the title (x ≥ 880): `kind: "engraving"` (maps, engravings, multiplied onto the paper) and `kind: "print"` (photos, with a shadow). Event `title` on the spoken title word (kind `title`).
- **Assets:** `search.py "<place> engraving" --kind engravings`, `--kind maps`; a photo of the same subject.
- **Look:** drawn for `voxScrapbook` (set `"look": "voxScrapbook"` in the storyboard; it brings the `scrapbook` timing profile: phrase cuts lead by 6 f, transitions keep their sounds). Measured on a Vox brand piece: `analysis/vox-sample/vox_braintravel.md`.
