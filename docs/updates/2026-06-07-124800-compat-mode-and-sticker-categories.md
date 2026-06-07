# 2026-06-07 - Compat Mode And Sticker Categories

## Summary

- Prepared `0.3.0`.
- Added compatibility mode for quick UI conflict isolation.
- Upgraded chat stickers with category filtering and slash commands.

## Changes

- `scripts/dnd-animal-ui.js`
  - Added `compatMode` world setting.
  - Compatibility mode keeps the base theme active but suppresses button press effects, folder softening, journal readability overrides, DnD5e animal backgrounds, and high asset intensity.
  - Added sticker metadata for categories and command aliases.
  - Added `/sticker <name>` and `/表情 <name>` chat command handling.
  - Added unknown sticker warnings instead of passing bad sticker commands to normal chat.
- `templates/theme-config.hbs`
  - Added a compatibility mode toggle.
- `styles/dnd-animal-ui.css`
  - Added categorized sticker panel tabs and compact command labels.
  - Added category chips to sticker chat cards.
- `docs/qa.md`
  - Added checks for compatibility mode, sticker category filtering, and sticker commands.

## Notes

- No new runtime dependency was added.
- No new sticker image assets were added in this version.
