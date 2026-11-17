# public/audio/sfx (generated, git-ignored)

The kit's procedural sound effects (sub boom, whoosh, needle drop, vinyl crackle, tick, bass hit, glitch tick, radio
static, black thump), each with a `<name>.json` peak sidecar for `SfxAtPeak`, plus `manifest.json`. Generate them with
`tools/py tools/audio/make_sfx.py` (`bash tools/setup.sh` does it). CC0.

More sounds (UI clicks, page flips, thuds, glitches, coins, …) are in the shared catalog:
`tools/py tools/library/search.py --kind sfx "<words>"`.
