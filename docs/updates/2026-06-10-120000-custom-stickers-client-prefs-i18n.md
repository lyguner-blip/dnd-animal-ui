# 2026-06-10 - Custom Stickers, Client Preferences, i18n

## Summary

- Prepared `0.4.0` (feature release on top of the `0.3.2` v13 compatibility fixes).
- Implemented the improvement plan: GM custom stickers, per-client personal preferences, player-accessible settings window, i18n, cursor usability fixes, `.gitattributes`.

## Changes

- `scripts/dnd-animal-ui.js`
  - New `customStickers` world setting (Array). `getCustomStickers()` sanitizes entries (requires `command` + `path`, validates category, defaults to `animal`); `getAllStickers()` merges bundled + custom; `findStickerByQuery()` replaces the static `STICKERS_BY_COMMAND` map so lookups see custom stickers and localized labels.
  - `DndAnimalThemeConfig`: custom sticker row management (add/delete/FilePicker via `foundry.applications.apps.FilePicker.implementation` with v11/12 fallback), `_collectCustomStickers()` dedupes commands against bundled stickers and warns on duplicates.
  - `enableCursor`, `enableButtonPressFx`, `assetIntensity` moved from `world` to `client` scope; settings menu `restricted: false`. `_updateObject` writes personal settings for everyone and world settings only for GMs.
  - All user-facing strings replaced with `DNDANIMALUI.*` i18n keys (settings, menu, config window, sticker names, categories, notifications, sidebar tab fallbacks).
  - Sticker labels/paths/ids are HTML-escaped in chat cards and panel buttons.
  - `refreshStickerDock()` rebuilds the chat dock when custom stickers change on any client.
- `templates/theme-config.hbs`
  - Rewritten with `{{localize}}`, `{{#if isGM}}` gating for world sections, a custom sticker manager section, and an always-visible personal preferences section.
- `styles/dnd-animal-ui.css`
  - Cursor exceptions: text inputs/ProseMirror keep `cursor: text`; window resize handles keep `nwse-resize`.
  - Styles for config hint lines, custom sticker rows, and the add button.
- `lang/zh-cn.json`, `lang/en.json`
  - New. 75 referenced keys, verified present in both files.
- `module.json`
  - Version `0.4.0`; `languages` for `en`, `zh-cn`, and the community `cn` code (shares the zh-cn file).
- `.gitattributes`
  - New: LF for js/css/json/md/hbs/svg, binary for fonts/images.
- `README.md`, `CHANGELOG.md`, `docs/qa.md` updated.

## Migration Notes

- Cursor / button FX / asset intensity values stored in the world before 0.4.0 are ignored; each client starts from defaults (on/on/high) and can be set per player.
- Custom stickers cannot reuse bundled commands (`duck`, `hug`, `cat`, `frog`, `rabbit`, `owl`).

## Static Checks

- `node --check scripts/dnd-animal-ui.js` OK; `module.json` + both lang files parse; CSS braces balanced; all 20 CSS `url()` assets exist; all 75 referenced i18n keys present in zh-cn and en.

## Runtime QA Reminders

- GM: add a custom sticker via FilePicker, save, confirm it appears in the panel and `/sticker <command>` works on a second client.
- Player (non-GM): open the settings window, confirm only the personal section is visible and saving toggles cursor/FX/intensity locally without errors.
- Confirm text inputs show the I-beam cursor and window corners show the resize cursor while the themed cursor is on.
