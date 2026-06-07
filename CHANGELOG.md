# Changelog

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
