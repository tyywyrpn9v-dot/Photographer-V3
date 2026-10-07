# Batch 11 — Field UX

## Goal
Add a practical field-use mode to scene pages without changing any photography values or canonical data.

## Changes
- Added `📱 現場簡潔版` / `📋 完整參數版` scene view switch.
- Scene view preference persists in localStorage (`iphone18proSceneView.v1`).
- Quick mode shows: current capture mode, one-glance summary, required capture parameters, Style recommendations, Edit recipes, and a short field-use reminder.
- Optional parameters, histogram/format notes, full workflow notes and detailed notes are collapsed into `📋 查看完整參數、原因及注意事項`.
- Full mode keeps optional parameters and capture notes visible/open.
- Existing 26 scenes, 24 capture parameters, 14 styles and 19 recipes are unchanged.
- Mobile sticky view switch added for fast switching while shooting.

## Regression checks
- JavaScript syntax: PASS (`node --check app.js`)
- JSON files: PASS (all parse successfully)
- Canonical data files: unchanged from Batch 10
