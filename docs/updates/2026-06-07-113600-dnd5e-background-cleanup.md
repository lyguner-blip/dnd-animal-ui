# 2026-06-07 - DnD5e Background Cleanup

## Summary

- Prepared `0.2.1`.
- Fixed remaining native DnD5e sheet background textures showing through actor and item sheets.

## Changes

- `styles/dnd-animal-ui.css`
  - Applied a clean Animal Island paper background to DnD5e actor and item sheet `.window-content`.
  - Kept the actor header village/sky treatment separate from the body background.
  - Removed background images from common DnD5e content containers and pseudo-elements when animal sheet backgrounds are enabled.

## Notes

- This is a visual patch only.
- It does not change DnD5e sheet layout dimensions or form controls.
