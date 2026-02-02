# Proposal: Mechvibes-style typing sounds in the journal

## Why

Many users enjoy the tactile feedback of mechanical keyboards but type in quiet environments (night, office, shared space). Playing short key sounds while typing in the journal gives that satisfying feedback without disturbing others, and makes writing feel more responsive and enjoyable. The app already has a Mechvibes-compatible sound pack (EG Crystal Purple) and config in place; this change wires playback to the editor so it behaves like [Mechvibes](https://github.com/hainguyents13/mechvibes).

## What Changes

- **Key sound playback**: When the user types in the journal editor, the app plays the corresponding key sound from the loaded sound pack (e.g. `purple.ogg`) using the pack’s config (offset and duration per key).
- **Mechvibes config format**: Support the existing `config.json` format: `defines` maps key identifiers to `[offsetMs, durationMs]` in a single ogg file; `sound` points to the file (e.g. `purple.ogg`).
- **Scope**: Sounds only in the journal editor; no playback on login, signup, or other screens. Optional mute/toggle is acceptable but not required for this change.

## Capabilities

### New Capabilities

- `typing-sounds`: Load a Mechvibes-style sound pack (config + ogg), map editor key events to pack defines, and play the correct slice of the ogg (start at offset, play for duration) on keydown so typing in the journal produces mechanical-keyboard-style sounds.

### Modified Capabilities

- None. This is additive; existing editor behavior and specs are unchanged.

## Impact

- **Code**: New typing-sounds module or hook (load config, resolve key → define, play ogg slice); integration in the journal editor (e.g. keydown listener or TipTap extension). Config and asset paths: `src/app/config.json`, `public/purple.ogg`.
- **APIs**: None.
- **Dependencies**: None new; use Web Audio API or `<audio>` for playback.
- **Systems**: No backend or schema changes.
