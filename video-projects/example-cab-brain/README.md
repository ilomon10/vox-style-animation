# Example: how learning London changes a cab driver's brain

A 49-second explainer in the **scrapbook look** (`voxScrapbook`, 24 fps), built from the seven scrapbook blocks. The
scrapbook previews in the [block gallery](../../examples/README.md#the-scrapbook-collection) are cut from it. The prompt
that describes it is [`examples/starters/cab-brain.md`](../../examples/starters/cab-brain.md), and the look is
documented in [doc 15](../../docs/style-guide/15-vox-scrapbook.md).

Only its text lives in git:
- `script.md`;
- `RESEARCH.md`: the seven facts it uses, each with its source (Maguire et al. 2000; Woollett & Maguire 2011);
- `storyboard.json`, `CREDITS.md`, `project.json`.

Its media are rebuilt locally:

```bash
tools/py tools/examples/build_example.py example-cab-brain            # the MP4: out/studio/example-cab-brain.mp4
tools/py tools/examples/build_example.py example-cab-brain --stills   # one still per scene instead
```

What it demonstrates:

| Scene | Recipe (block) | What to look at |
|---|---|---|
| `ch1` | ChapterCard (torn-paper-chapter-card) | the engraving multiplies onto the pink paper, the print rises, "Chapter One" drops, the title strip wipes in on "test" |
| `streets` | PaperStat (torn-paper-stat) | arrives on a sheet from the bottom-left (paper-sheet-slide, with its swoosh); the payoff "BY HEART" comes in unspoken |
| `driver` | SpecimenInterview (specimen-interview) | an 1884 photograph in a deckle print on mint paper, labelled from the first frame |
| `ch2` | ChapterCard (torn-paper-chapter-card) | one paper colour per chapter: blue |
| `sixteen` | StampedStat (stamped-stat) | the stamp lands 4 f after "Sixteen" with the `stamp_thud` |
| `plate` | SpecimenPlate (specimen-plate) | the section tumbles in, the magnifier opens on "hippocampus", the label arrives on "larger" and changes on "longer" |
| `ch3` | ChapterCard (torn-paper-chapter-card) | a short chapter: the next scene starts on a later word |
| `trainees` | PaperStat (torn-paper-stat) | the same block on plain paper |
| `compare` | SpecimenCompare (specimen-comparison) | the stat leaves on a sheet to the top-right; the second group arrives on "did not" |
| `end` | ChapterCard (torn-paper-chapter-card) | a kicker instead of a number makes it an end card; the `chime` |

To make it yours, record the narration (`tools/py tools/voice/recording_guide.py video-projects/example-cab-brain`),
then run `tools/py tools/studio/recue.py video-projects/example-cab-brain my_take.wav` and build again.
