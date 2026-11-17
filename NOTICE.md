# Notice

## Not affiliated with Vox

This is an independent, community project. It is **not affiliated with, sponsored by or endorsed by Vox Media, LLC**.
"Vox" and "Earworm" are trademarks of Vox Media, used here only to describe the visual style the framework studies.
Do not use Vox's names, logos, wordmark, bug or series titles in videos you make with it, and do not present your
videos as Vox's.

## What this repository contains, and what it does not

- **Contains:** our own code, our own measurements and written analysis of public videos (`analysis/`, `docs/`), and a
  **catalog** of free-licence assets (`public/assets/library/catalog.json`): links to public-domain and CC0 files on their
  original websites, with their licence evidence and checksums.
- **Does not contain:** any frame, clip, audio, transcript, logo or other material from Vox or from any other reference
  video, and no asset files. Assets are downloaded on demand from their sources by `tools/library/fetch.py`, or
  generated from fixed seeds (textures, marks, sound effects, demo audio). The one kind of media in the repository is
  the gallery previews in `examples/`: silent GIFs rendered from this repository's two example projects, showing only
  public-domain and CC0 pictures from the catalog (credits: each project's `CREDITS.md`).
- **Reference material you supply** (for example with the `vox-reference` skill) is stored only on your machine, in
  git-ignored folders (`video-projects/<slug>/reference/`, `video-projects/<slug>/assets/ref/`). Whether you may publish
  anything cut from it depends on who owns it: only you can clear it.

## Licences

| Part | Licence |
|---|---|
| Code | MIT ([LICENSE](LICENSE)) |
| Docs, style guide, analysis text, skills | CC BY 4.0 ([LICENSE-docs.md](LICENSE-docs.md)) |
| Generated assets (textures, marks, procedural SFX and beds, demo audio, maps rendered from Natural Earth) | CC0 1.0: no rights reserved |
| Gallery previews (`examples/**/*.gif`) | CC BY 4.0, like the docs; the public-domain and CC0 pictures in them keep their own terms |
| Catalogued assets | their own terms, recorded per file in `public/assets/library/catalog.json` and `CREDITS.md`: public domain or CC0 for images and maps; CC BY only where marked, with the attribution line to paste |

## Third-party software and models (installed by `tools/setup.sh`, not redistributed here)

| Component | Licence | Note |
|---|---|---|
| [Remotion](https://www.remotion.dev) | **Remotion License** | Free for individuals, non-profits and companies of up to 3 people; larger companies need a company licence. Read <https://www.remotion.dev/license> before you use the framework commercially. |
| React, TypeScript | MIT, Apache-2.0 | |
| Google Fonts, loaded through `@remotion/google-fonts` | SIL Open Font License or Apache-2.0, per family | |
| [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) weights and voices (scratch voice-over) | Apache-2.0 | `kokoro-onnx` is MIT; the phonemiser uses espeak-ng (GPL-3.0) as a separate library. No GPL code ends up in your videos. |
| faster-whisper + Whisper weights | MIT | Word timing of voice-overs. |
| rembg | MIT | Cut-outs use `isnet-general-use` (Apache-2.0) and BiRefNet (MIT). Never `bria-rmbg`, which is non-commercial. |
| yt-dlp | Unlicense | Only for downloading references you are entitled to use. |
| ffmpeg, ImageMagick, poppler | LGPL/GPL, ImageMagick License, GPL | Called as separate programs. |
| [Natural Earth](https://www.naturalearthdata.com) | Public domain | Map data. |
