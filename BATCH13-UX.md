# Batch 13 — Unified Camera / Photos UX

## Navigation
- Three equal top-level views only: `拍攝` / `後製` / `全部`.
- Removed top-level `風格` and `硬體` navigation.
- `通用設定` is an auxiliary guide page, not a fourth content category.
- Mobile bottom bar has exactly the same three content views.

## Content model
- Capture items = scene-based camera guidance.
- Edit items = Photos edit recipes.
- All = both sets in one flat browsing level.
- Tags are used for stage and descriptive browsing (自然、明亮、冷色、暖色、戲劇、日系、風景、夜景等).
- Scene pages no longer recommend or embed Style/Edit sections.

## Camera / Photos distinction
- Camera Photographic Style remains a capture-stage system.
- Photos edit Style is independent and represented only as a 0–100 intensity control.
- Photos edit UI does not expose Tone / Color / Palette / Texture as Style sub-controls.
- Camera Style data has been marked capture-only in the canonical parameter/style data.

## Scene page
- Scene header appears immediately at the top.
- Capture Mode appears inside the scene page, in the requested iPhone order:
  Time-lapse → Slo-mo → Cinematic → Video → Photo → Portrait → Spatial → Pano.
- Scene tables use the same `必須` / `選項` structure.
- Each parameter is displayed as `Emoji 中文名稱 (English Name)`.
- Histogram and Format + Aspect are removed from scene-specific tables and moved to the General Guide.

## General Guide
- Histogram guidance is expressed as `貼近左邊 / 集中中間 / 貼近右邊`, not merely `開`.
- Format / Aspect / 48MP / ProRAW are explained once in the General Guide.
