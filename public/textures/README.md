# public/textures (generated, git-ignored)

Seamless procedural textures used by the kit (papers, film grain, dust, the Earworm grounds and letter distress mask).
They are generated from fixed seeds, so they are not stored in git:

```
npm run textures            # = tools/py tools/textures/generate_textures.py && tools/py tools/textures/earworm_textures.py
```

`bash tools/setup.sh` (or `tools/py tools/library/fetch.py --pack core`) does this for you. They are CC0. The catalog
entries (`tex-*` in `public/assets/library/catalog.json`) record their checksums.
