# Batch 9 — UI / Data Regression Pass

## Fixed
- Added missing CSS variables used by the unified UI (`--surface`, `--ink`, `--chip`) for light/dark/outdoor themes.
- Corrected the recipe index to render the canonical 19 records from `recipes.json` once; the 3 user presets are not duplicated from `japanese-adjustment-presets.json`.
- Added bilingual labels for the 15 edit Adjustment controls in recipe detail pages.
- Preset detail pages expose their linked Photographic Style when `styleRefs` are present.

## Regression checks
- 26 scenes / 26 workflows
- 16 original recipes + 3 Japanese presets = 19 canonical recipe records
- 14 styles
- 24 capture parameters
- 15 edit adjustment parameters
- JSON parse: PASS
- Cross-reference audit: PASS
- Scene example images: PASS
- Recipe sample images: PASS
- JavaScript syntax: PASS

## Source-data handling
- `咖啡廳` Color value `01` is preserved verbatim and is not guessed.
- Recipe → Scene relationships marked heuristic remain labelled as heuristic in workflow data.
- Cinematic remains a Photographic Style control, not a generic Edit Adjustment.
