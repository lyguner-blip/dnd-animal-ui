# Changelog

## 0.5.0 - 2026-06-11

- Added full cream theming for dnd5e 5.x sheets: palette variables remapped so PC/NPC/item sheets drop the dark slate panels entirely; island banner headers, cream filigree boxes, warm-yellow section headers, teal accents.
- Added cream theming for core roll table sheets (stripes, teal ranges, drawn-row muting), the dnd5e compendium browser, dnd5e chat cards (dice totals with crit/fumble rings) and the native v13 hotbar (cream slots, jelly page controls).
- Changed dnd5e sheets and the chat log to always use the system light-theme branch while the cream theme is active, regardless of the global Foundry theme.
- Changed generic window-shell theming to exclude dnd5e2 windows entirely; they are now owned by the new `styles/dnd-animal-sheets.css` and return fully native when the cream theme is off.
- Removed the `enableDnd5eSheetSafety` and `enableDnd5eAnimalBackground` settings; both are replaced by a single `enableDnd5eCreamTheme` world toggle (default on).
- Changed author to 蟀蟀.

## 0.4.0 - 2026-06-10

- Added GM-defined custom chat stickers: manage label/command/category/image rows in the settings window with a FilePicker, stored as a world setting and merged with the bundled stickers (panel and `/sticker` commands included). Duplicate or incomplete rows are skipped with a warning.
- Changed cursor, button press effects, and asset intensity to client-scope personal preferences; previous world values reset to defaults once.
- Opened the settings window to players: GM sections stay GM-only, while every player can adjust their own cursor/effects/intensity.
- Added i18n support (Simplified Chinese and English, `lang/zh-cn.json` + `lang/en.json`) covering settings, the config window, sticker names, and notifications.
- Improved the themed cursor: text fields, ProseMirror editors, and window resize handles keep their system cursors.
- Escaped sticker labels/paths in generated chat HTML and panel buttons.
- Added `.gitattributes` enforcing LF for text files.

## 0.3.2 - 2026-06-10

- Fixed player sidebar tab hiding on Foundry v13: tab buttons moved to `#sidebar > nav.tabs` and no longer matched the old `#sidebar-tabs` selectors, so hidden tabs stayed visible for players.
- Fixed fallback tab activation on v13 using `Sidebar#changeTab` and `tabGroups.primary`/`aria-pressed` detection instead of the removed v11 APIs, avoiding the `activateTab` deprecation warning.
- Fixed the chat sticker button breaking after collapsing/expanding the sidebar on v13: core moves `#chat-message` between containers, which stranded the old input wrapper. The sticker dock now lives inside `#chat-controls` and travels with the chat input, including into the chat popout.
- Fixed v13 HUD overlays (token/tile HUD, hotbar, scene controls, players, camera views) being painted as cream paper panels with texture and backdrop blur; they keep their native overlay look now.
- Fixed unreadable player list text: warm brown was forced onto the dark player plates and overrode per-user colors.
- Added Animal Island theming for the v13 scene navigation (`#scene-navigation`), matching the v11 `#navigation` treatment.
- Changed sticker messages to use `author` instead of the deprecated `user` field on v12+.
- Raised `compatibility.minimum` to 11 (the stylesheet relies on `:has()` and modern selectors).

## 0.3.1 - 2026-06-08

- Fixed low-contrast text in the Foundry module activation and package configuration windows.
- Moved the chat sticker button to the left side of the message input so it no longer covers native right-side chat controls.
- Softened DnD5e actor and item sheet background tones and reduced the abrupt contrast between warm parchment areas and dark native panels.

## 0.3.0 - 2026-06-07

- Added compatibility mode to temporarily suppress high-risk decorative layers while keeping the base theme active.
- Added sticker categories for the chat sticker panel: all, emotion, adventure, and animal.
- Added `/sticker <name>` and `/表情 <name>` chat commands for sending bundled animal stickers.
- Improved sticker chat cards with category chips and compact command labels in the picker.

## 0.2.3 - 2026-06-07

- Fixed the chat sticker button layout so it no longer shifts or overlaps native chat controls.
- Restricted sticker injection to the real chat message input instead of generic text inputs.
- Changed the sticker entry into an absolute overlay inside the message input wrapper.

## 0.2.2 - 2026-06-07

- Fixed low-contrast DnD5e trait/pill section labels such as weapons and languages on light Animal Island sheet backgrounds.
- Removed `.pills-group` from the dark-panel text override and styled trait headings separately with warm brown high-contrast text.

## 0.2.1 - 2026-06-07

- Covered remaining native DnD5e actor and item sheet background textures when animal sheet backgrounds are enabled.
- Added stronger background-image cleanup for DnD5e sheet content containers and common pseudo-elements.

## 0.2.0 - 2026-06-07

- Moved the animal sticker entry into the chat input bar instead of floating it above chat.
- Added GM toggles for chat stickers, sidebar folder color softening, journal readability, DnD5e sheet safety, and DnD5e animal sheet backgrounds.
- Split DnD5e sheet rules into safer optional layers so actor, NPC, and item sheets can keep native layout while still receiving readable theme colors.
- Added a QA checklist for Foundry runtime checks across chat, journal, sidebar, DnD5e sheets, settings, and player sidebar visibility.

## 0.1.5 - 2026-06-06

- Replaced dnd5e actor header backgrounds with a lighter Animal Island village/sky treatment.
- Improved actor sheet dark panel text contrast for abilities, skills, saves, tags, and item lists.
- Softened the dark red dnd5e section header color.

## 0.1.4 - 2026-06-06

- Added a chat sticker button and six bundled cute animal stickers.
- Sticker messages are sent as local module images through Foundry chat.
- Improved dnd5e dark list/panel text contrast with softer light text and gold accents.

## 0.1.3 - 2026-06-06

- Removed remaining dnd5e sheet interior theme overrides so character, monster, and item cards keep native layout.
- Disabled decorative sheet-header dividers inside dnd5e sheets.
- Increased right sidebar settings text contrast.

## 0.1.2 - 2026-06-06

- Added journal-specific readability rules.
- Kept journal page content on a light paper background with warm dark text.
- Improved journal table-of-contents and sidebar journal item contrast.

## 0.1.1 - 2026-06-06

- Removed the extra themed backing plate behind the lower-left players widget.
- Softened sidebar folder headers so folder colors do not appear as harsh dark/red blocks.
- Excluded dnd5e sheets from global button, input, select, textarea, card, and click-press effects.
- Removed risky dnd5e ability, meter, and pip restyling so player, monster, and item sheets keep their native geometry.

## 0.1.0 - 2026-06-06

- Initial local Foundry VTT module release.
- Added Animal Island inspired Foundry and DnD5e UI theme.
- Added local fonts, bundled images, custom cursor, divider assets, and NookPhone-style UI details.
- Added GM configuration menu for theme state, cursor, asset intensity, button press effects, and player sidebar visibility.
