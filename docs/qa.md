# DND Animal UI QA Checklist

Use this checklist after enabling the module in a Foundry VTT world.

## Static Checks

- `node --check scripts/dnd-animal-ui.js`
- Parse `module.json` as JSON.
- Confirm every CSS `url(...)` points to an existing local asset.
- Confirm release ZIP has `module.json` at the ZIP root.

## Runtime Checks

- Enable the module as GM and open `Configure Settings > DND 动物岛 UI`.
- Toggle each option and confirm the UI updates without a reload:
  - Theme
  - Cursor
  - Button press effects
  - Chat animal stickers
  - Sidebar folder softening
  - Journal readability
  - DnD5e sheet safety
  - DnD5e animal sheet background
- Open chat and confirm the animal sticker button is inside the chat input bar.
- Send each sticker and confirm the message uses a local `modules/dnd-animal-ui/assets/stickers/*.svg` image.
- Open player character, NPC/monster, and item sheets. Confirm values, attributes, death saves, resources, item lists, and action buttons remain readable and clickable.
- Open a journal entry with sidebar/page navigation. Confirm headings, body text, links, tables, and selected page rows have enough contrast.
- Check actor, item, journal, scene, compendium, and settings sidebars. Folder colors should feel softened when the option is enabled.
- Log in as a non-GM player. Confirm hidden sidebar tabs disappear and at least one tab remains visible.

## Visual Acceptance

- The first screen should read as warm Animal Island style: paper panels, warm brown text, mint action color, soft yellow accents, and round cartoon controls.
- DnD5e sheet usability wins over decoration. No animal background should obscure ability scores, skills, saves, spell preparation, resources, or item actions.
- The sticker entry should feel like part of the chat bar, not a separate floating widget.
