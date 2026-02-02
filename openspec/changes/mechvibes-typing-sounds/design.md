# Design: Mechvibes-style typing sounds

## Context

The journal editor is a TipTap-based component (`JournalEditor`) that mounts on the journal page and handles content and autosave. The app already has a Mechvibes-compatible sound pack: `src/app/config.json` (defines `sound`, `defines` with key identifiers → `[offsetMs, durationMs]`) and `public/purple.ogg`. The proposal and specs require playing the correct slice of the ogg on keydown in the editor only, with no change to editor content or behavior, and graceful handling when the pack is missing or invalid.

**Current state:** No typing sounds. Config uses string key identifiers that match keyboard key codes (e.g. `"32"` for Space, `"65"` for A); `defines` maps each to `[offsetMs, durationMs]` in the single ogg file.

## Goals / Non-Goals

**Goals:**

- Load one Mechvibes-style sound pack (config + ogg) and play the correct slice per key on keydown in the journal editor.
- Map keydown events to pack `defines` (key code → offset/duration); silent for undefined keys.
- Keep playback scoped to the journal editor; no sounds on other screens or when focus is outside the editor.
- If config or audio is missing/invalid, disable sounds and do not break the editor or show errors.

**Non-Goals:**

- Multiple sound packs, user-selectable packs, or settings UI (optional mute/toggle is acceptable but not required).
- Keyup sounds, mouse sounds, or sounds outside the journal editor.
- Changing editor content, autosave, or focus behavior.

## Decisions

### Where to attach keydown and scope

- **Choice:** Attach a keydown listener only when the journal editor (or its editable root) has focus. Implement by either (1) a React hook/context that the journal editor uses and that only subscribes when the editor container is focused, or (2) a TipTap extension that runs inside the editor and listens to keydown, so scope is implicitly “inside this editor.”
- **Rationale:** Spec requires sounds only when typing in the journal; no sounds on login, signup, or when focus is elsewhere. TipTap extension keeps scope by construction; a hook on the editor wrapper is equivalent if we only register when the editor DOM node has focus.
- **Alternatives considered:** Global keydown with “is editor focused?” check (works but less clean); capturing at document level and filtering by target (acceptable).

### Key identifier: use keyCode

- **Choice:** Map `KeyboardEvent.keyCode` to a string and look up in pack `defines` (e.g. `defines[String(e.keyCode)]`). Do not use `key` or `code` for the lookup because the existing config is key-code based.
- **Rationale:** Config keys are stringified key codes (`"32"`, `"65"`, `"61008"`, etc.). Using keyCode preserves compatibility with the existing Mechvibes pack without transforming the config.
- **Alternatives considered:** Mapping `e.code` or `e.key` to config (would require a translation layer or a different config format); adding a small mapping from code/key to keyCode for future packs (out of scope for this change).

### Loading config and audio

- **Choice:** Load config once (e.g. fetch `/config.json` or static import from app) and the audio file from the public URL (e.g. `/purple.ogg`). Do this when the journal editor mounts or when the typing-sounds layer initializes; cache the result. If fetch/load fails or config is invalid, set an internal “disabled” state and never play sounds or throw.
- **Rationale:** Spec requires graceful degradation: missing or invalid pack must not break the editor. Single load keeps implementation simple; config and asset paths are fixed for v1 (`config.json`, `purple.ogg`).
- **Alternatives considered:** Loading on first keydown (adds latency on first key); dynamic pack selection (non-goal).

### Playing an ogg slice (offset + duration)

- **Choice:** Use the Web Audio API: decode the ogg into an `AudioBuffer`, then for each keydown create an `AudioBufferSourceNode`, set it to play from `offset` (in seconds) for `duration` (in seconds), connect to destination, start, and let it stop automatically. Use a single decoded buffer shared across all playbacks so rapid key presses can overlap.
- **Rationale:** Slicing by offset/duration is exact with buffers; multiple keydowns can play concurrently without clipping. HTMLAudioElement with one element would require either multiple elements (pool) or serializing playback; a buffer per keydown is the standard pattern for this use case.
- **Alternatives considered:** Single HTMLAudioElement with currentTime + stop after duration (would need a pool of elements for overlapping keys); decode-once then buffer sources is the preferred approach.

### Module shape and editor integration

- **Choice:** Implement a small typing-sounds module (e.g. `lib/typing-sounds.ts` or `hooks/use-typing-sounds.ts`) that: (1) loads and parses config, (2) decodes the ogg to an AudioBuffer (once), (3) exposes a function like `playKey(keyCode: number)` that looks up define and plays the slice, and (4) is invoked from the journal editor only (e.g. in a keydown handler on the editor root or via a TipTap extension). The editor passes keydown events to this module only when the event target is inside the editor.
- **Rationale:** Keeps sound logic out of the editor component body; one place to handle “disabled” when pack is missing; easy to test and to reuse the same playback API from either a DOM listener or an extension.
- **Implementation note:** Ensure playback only runs in the browser (no SSR); guard with `typeof window !== 'undefined'` and optional chaining so build/SSR does not depend on audio.

## Risks / Trade-offs

- **[keyCode deprecated]** → keyCode is deprecated in favor of `key`/`code`; we use it only to match the existing Mechvibes config. If future packs use a different scheme, the module can be extended to support an optional mapping.
- **[Autoplay policy]** → Some browsers require a user gesture before audio can play. The first keydown in the editor is a user gesture, so playback should be allowed; if not, we fail silently (no sound) and do not show an error.
- **[Overlapping playback]** → Many buffer sources playing at once could theoretically be loud; slices are short (~100–150 ms). If needed, a simple cap (e.g. max N concurrent playbacks) can be added later; not required for initial implementation.
- **[SSR / build]** → Config might be imported or fetched only on the client; decoding and playback must run only in the browser to avoid Node/build errors.

## Migration Plan

1. **Add typing-sounds module:** Implement load (config + decode ogg), `playKey(keyCode)`, and disabled state on error. No routes or API changes.
2. **Integrate in journal editor:** From the journal page/component that renders `JournalEditor`, attach keydown (e.g. on the editor wrapper or via TipTap) and call the typing-sounds playback when the event target is inside the editor; do not alter editor content or autosave.
3. **Verify:** Type in editor → sounds; focus elsewhere or on another page → no sounds; remove or corrupt config/ogg → editor still works, no errors.
4. No feature flags or backend rollout. Rollback = remove the integration and optionally the module.

## Open Questions

- **Mute/toggle:** Spec allows optional mute/toggle; design does not implement it. Can be added later (e.g. a context or localStorage flag) without changing the core playback path.
- **Config path:** Using `src/app/config.json` and `/purple.ogg` is assumed. If the app later serves config from a different URL, the module should accept config (and optionally audio URL) as parameters or from a single options object.
