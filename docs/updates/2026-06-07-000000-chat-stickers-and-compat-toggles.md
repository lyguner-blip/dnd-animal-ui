# 2026-06-07 - Chat Stickers And Compatibility Toggles

## Summary

- Prepared `0.2.0`.
- Moved the animal sticker button into the chat input bar.
- Added individual GM toggles for high-risk visual patches.
- Added a reusable QA checklist.

## Changes

- `scripts/dnd-animal-ui.js`
  - Added settings for stickers, folder softening, journal readability, DnD5e sheet safety, and DnD5e animal backgrounds.
  - Added body classes for each setting so CSS layers can be toggled independently.
  - Reworked sticker injection to wrap the chat input and place the button inside the input bar.
  - Added cleanup when stickers or the theme are disabled.
- `styles/dnd-animal-ui.css`
  - Replaced the floating sticker dock with an inline chat input control group.
  - Scoped folder, journal, and DnD5e patches behind specific body classes.
  - Kept DnD5e animal backgrounds separate from sheet safety rules to avoid background priority conflicts.
- `templates/theme-config.hbs`
  - Added sticker and compatibility controls.
- `docs/qa.md`
  - Added static, runtime, and visual acceptance checks.

## Notes

- GitHub project page work was intentionally skipped.
- Runtime Foundry testing still needs a live world pass for final visual sign-off.
