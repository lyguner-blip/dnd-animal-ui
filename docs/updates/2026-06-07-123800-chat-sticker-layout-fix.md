# 2026-06-07 - Chat Sticker Layout Fix

## Summary

- Prepared `0.2.3`.
- Fixed the chat sticker button UI bug where the sticker entry shifted into the native chat controls.

## Changes

- `scripts/dnd-animal-ui.js`
  - Added a stricter chat input resolver that prefers `#chat-message` and visible textareas.
  - Removed generic `input[type='text']` matching from sticker injection.
  - Added a dedicated class to the actual chat message input while the sticker button is mounted.
- `styles/dnd-animal-ui.css`
  - Replaced the two-column input/button grid with an absolute overlay button inside the message input wrapper.
  - Added right padding to the message input so the sticker button does not cover typed text.

## Cause

The previous inline-button implementation could match a generic text input inside the chat form, then wrap that element with a grid layout. On Foundry chat UIs with extra mode or roll controls, this changed the native control flow and caused the sticker button to appear in the wrong row.
