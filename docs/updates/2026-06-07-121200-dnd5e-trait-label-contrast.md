# 2026-06-07 - DnD5e Trait Label Contrast

## Summary

- Prepared `0.2.2`.
- Fixed low-contrast trait section labels on DnD5e actor sheets.

## Changes

- `styles/dnd-animal-ui.css`
  - Removed `.pills-group` from the dark-panel text override.
  - Added a dedicated warm-brown high-contrast rule for `.pills-group` headings, icons, labels, and config buttons.

## Cause

DnD5e trait groups such as weapons and languages render through `actor-trait-pills.hbs` as `.pills-group h3 .roboto-upper`. The previous contrast patch treated `.pills-group` as a dark panel and turned this heading light, which made it hard to read on the light Animal Island sheet body.
