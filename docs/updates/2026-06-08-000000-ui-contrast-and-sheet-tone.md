# 2026-06-08 - UI Contrast And Sheet Tone

## Summary

- Prepared `0.3.1`.
- Fixed text contrast in the module activation/package configuration UI.
- Repositioned the chat sticker button away from Foundry's native right-side chat controls.
- Softened DnD5e sheet backgrounds so native dark panels no longer sit on a harsh bright base.

## Changes

- `styles/dnd-animal-ui.css`
  - Added package/module-management selectors for `.package-configuration`, `.module-management`, `#module-management`, package rows, metadata, descriptions, disabled rows, and filter tabs.
  - Moved `.dnd-animal-ui-sticker-dock` from the right side to the left side of the chat message input and adjusted input padding.
  - Changed the sticker panel anchor to open from the left side of the message input.
  - Tuned DnD5e actor/item sheet `window-content`, header, sheet body, dark stat panels, and section headers for a warmer lower-contrast parchment treatment.

## Notes

- No JavaScript behavior was changed in this patch.
- Runtime Foundry visual QA is still recommended for the module activation window, chat input, and one player character sheet.
