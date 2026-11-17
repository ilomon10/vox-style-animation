# Director mode: guide the user, or run on autopilot

`vox-video` is interactive by default. At each checkpoint below, Claude says where the video stands, makes a
recommendation, and asks one short set of questions. The user can answer, pick the recommended option, or say
**"autopilot"**, after which Claude decides everything for the rest of the video.

## Modes

| Mode | The user says | Claude |
|---|---|---|
| `guided` (default) | "guide me", "interactive", "ask me" | asks at every checkpoint (C1–C9) |
| `key` | "only the big decisions", "ask less" | asks at C1 (brief), C4 (script) and C8 (look check) |
| `auto` | "autopilot", "stop asking", "fully automated", "just make it", "you decide" | asks nothing; takes the recommended option every time; lists each decision in `HANDOFF.md` |

- **Switching:** honour a switch at any moment, even in the middle of a checkpoint. Confirm it in one line ("Autopilot
  on: I'll decide the rest and list every choice in HANDOFF.md").
- **Saving the mode:** run `tools/py tools/studio/director.py <slug> --mode <mode>` (it saves `project.json` →
  `"mode"`), so a later session continues the same way. Before the project exists, keep the mode in the conversation.
- **Starting in a mode:** a request that starts with "autopilot:" (`/vox-video autopilot: <idea>`) starts in `auto`;
  "only the big decisions" starts in `key`.
- **Never in any mode:** inventing facts; publishing; deleting the user's files. The facts rules (SKILL.md §1) are the
  same in every mode.

## How to ask

- **Use the question tool when the interface has one.** In Claude Code that is AskUserQuestion; the claude.ai apps show
  clickable options.
  - 1–4 questions per call, 2–4 options each.
  - The recommended option goes first, with "(Recommended)" at the end of its label.
  - A header of 12 characters at most.
  - Every question stands on its own: name the section and the thing it is about, because the dialog may hide the text
    before it.
  - The user can always type their own answer ("Other").
- **Previews:** when the options are layouts (blocks, looks, plans) and the question tool takes a `preview` per option
  (Claude Code's does; single-select questions only), put a picture of each there: the block's wireframe from
  `examples/blocks/<name>.md` § Wireframe, or a short plan as text. Without previews, name the block and link its GIF
  (`examples/blocks/<name>.gif`).
- **Without a question tool** (plain chat, some IDE panels), write a numbered list. Mark the recommended option and end
  with: *Reply with a number, your own idea, or "autopilot".*
- **Before each question set,** write one line that says where the video is and what the answer changes, for example
  "Step 3 of 9 · Section plan. Your answer picks the scene type for sections 4 and 6."
- **One call per checkpoint,** two at most. Never ask what the research, the catalog or `director.py` can answer, and
  never ask the user to confirm a fact: research it.
- **The first time you ask,** add once: *(Say "autopilot" at any point and I'll decide the rest.)*

## Checkpoints

Run `tools/py tools/studio/director.py <slug> --json` before C3, C5, C6, C7 and C8. It reports the sections, what each
one is missing, recommendations from the catalog, and the next checkpoint. Base the options on its output, not on
guesses.

### C1 · Brief (before research)
Skip any question the request already answers.

| Question (header) | Options, recommended first |
|---|---|
| How long should the video be? (`Length`) | 90 s explainer (Recommended): 7–9 sections · 60 s Short, 9:16 with captions · 3 minutes: room for a person and a document · 30 s teaser: 5–7 sections |
| Which look? (`Look`) | Earworm collage (Recommended): black collage, torn prints, periwinkle; every block is built for it · Light paper: today's Vox explainer; some blocks still draw the collage look · Paper desk: a warm scrapbook |
| Who is it for? (`Audience`) | Curious general viewers (Recommended) · Students · People who know the field · Kids and families |
| How involved do you want to be? (`Mode`) | Guide me step by step (Recommended) · Only the big decisions · Autopilot: decide everything |

### C2 · Angle (after research)
Offer 2–3 angles drawn from the research. Each option is a thesis question; its preview is the first two lines of the
narration for that angle. A second question picks the hook:

| Hook | Block |
|---|---|
| a year | [cold-open-year](../../../examples/blocks/cold-open-year.md) |
| a scene | [photo-collage](../../../examples/blocks/photo-collage.md) |
| a striking number | [giant-word-card](../../../examples/blocks/giant-word-card.md) |
| a single word | [keyword-cut](../../../examples/blocks/keyword-cut.md) |

### C3 · Section plan
1. Show the plan as a short list: `section → block → one line of content`.
2. Build the board, `tools/py tools/studio/board.py <slug> --open`, and say where it is (below: "Previews").
3. Ask only about sections where the choice is open, one question per section, at most 4. Offer the recommended block
   and 1–2 alternatives, each with its wireframe as the preview; "Drop this section" may be one of the options.

`tools/py tools/studio/director.py --suggest "<the section's narration>"` ranks the blocks that fit a line.

### C4 · Script (`guided` and `key`: always)
Show the script with its section marks. Options:
- Approve (Recommended);
- Shorter and punchier;
- A different tone;
- Rewrite one section (their own words via "Other").

This was the skill's one mandatory stop, and it still is in `guided` and `key` mode.

### C5 · Voice
| Option | What happens |
|---|---|
| Scratch voice `am_michael` (Recommended) | the draft gets a synthetic narrator now; record your own voice later |
| Hear the voices first | `tools/py tools/voice/voice_samples.py --slug <slug> --open` makes a sample of each English voice, then ask again |
| I'll record it myself first | `RECORDING_GUIDE.md` now, wait for the WAV, then `recue.py` |
| I already have a recording | ask for the path, then `recue.py` |

### C6 · Gaps (only when `director.py` lists any)
One question per gap, at most 4. The options come from the table below, recommended first.

### C7 · Music and sound
- Offer the 2–3 best catalog beds for the mood (`director.py` lists them with tempo and loudness), the recommended one
  first, plus "No music".
- Sound effects follow the budget in SKILL.md §5: don't ask about them.

### C8 · Look check (after the stills or the draft render)
1. Rebuild the board with pictures: `board.py <slug> --open`. It takes one frame per section from the draft MP4 when
   there is one.
2. Ask how it looks:
   - Looks good, render the final (Recommended);
   - Change one section (which one, and how, via "Other");
   - Open the live preview;
   - Try a different voice or music.

### C9 · Delivery
Ask which output (multi-select):
- 1080p MP4 (Recommended);
- 4K;
- also a 60 s Short cut.

Then hand off (SKILL.md §7). In `auto` mode the hand-off adds **"Decisions made on autopilot"**: each checkpoint, what
was chosen and how to change it.

## When something is missing: what to recommend

| Missing for a section | Recommend, in this order |
|---|---|
| A picture | 1. the catalog (`director.py` lists hits); 2. the web, public domain or CC0 (`source_images.py`); 3. a block that needs no picture: giant-word-card, data-counter, quote-card, or keyword-cut over a texture; 4. a Natural Earth map (map-route) when the line is about a place |
| Footage | catalog footage (NASA, Prelinger); else montage-crane or photo-collage with stills, so the section still moves |
| A portrait of the person | the name card needs a public-domain picture of that person. Without one: keyword-cut with the name over a place or document photo, or a quote-card with their words. Never a look-alike, never a generic portrait with their name on it |
| A document scan | the catalog's documents; the Library of Congress or Chronicling America for newspapers before 1930; else a quote-card with the exact words |
| A number | a source (research). If sources disagree, say "by one count" or drop the number (RESEARCH.md says which) |
| A voice | the scratch voice now (C5) and the user's recording later; `RECORDING_GUIDE.md` shows how to read it |
| Music | the catalog beds for the mood; else a procedural bed (`make_bed.py`); or no music |
| A series name | three names made from the topic, never a real channel's or series' name |
| Sound effects | the catalog SFX, then the kit's procedural set; never more than the budget |
| A reference look | the `vox-reference` skill when the user has one; otherwise the look chosen in C1 |

## Previews to offer

| Preview | How | Where it shows |
|---|---|---|
| The board | `tools/py tools/studio/board.py <slug> --open` → `out/studio/<slug>-board.html`: one card per section with its picture (a frame from the draft, a still, or the block's wireframe), narration, assets, credits and gaps | **Claude Code desktop:** click the path and it opens in the Browser pane. **CLI:** it opens in the default browser. The page is self-contained, so where artifacts are available you may publish it as one, if the user wants a shareable page |
| Block GIFs | `examples/blocks/<name>.gif`, or the gallery `examples/README.md` | anywhere the user can open a file or the repository page |
| Live preview | `npm run studio` (Remotion Studio at http://localhost:3000; pick `StoryboardVideo`, props `{"project": "<slug>"}`); run it in the background | a browser: scrub the timeline, play with sound |
| Voices | `tools/py tools/voice/voice_samples.py --slug <slug> --open` → `out/voice-samples/index.html` | a browser page with one player per voice |
| Question previews | block wireframes as text | inside the question dialog |

Mention the board after C3 and at C8; don't paste its contents into the chat.
