## 1. Typing-sounds module

- [x] 1.1 Add `src/lib/typing-sounds.ts` with types for Mechvibes config (`sound`, `defines` as record of string → `[number, number]`) and a singleton or factory that holds loaded config and decoded AudioBuffer
- [x] 1.2 Implement load: fetch config from `/config.json` and audio from URL in config (e.g. `/purple.ogg`); decode ogg with Web Audio API into AudioBuffer; on any failure set internal disabled state and do not throw
- [x] 1.3 Implement `playKey(keyCode: number)`: look up `defines[String(keyCode)]`; if present create AudioBufferSourceNode, call `start(0, durationSec, offsetSec)` (or equivalent slice), connect to destination; no-op if disabled or no define
- [x] 1.4 Guard all audio and fetch logic with `typeof window !== 'undefined'` so the module is safe during SSR and build

## 2. Editor integration

- [x] 2.1 In the journal editor (e.g. `JournalEditor` or its wrapper), attach a keydown listener so that when the event target is inside the editor, call the typing-sounds module’s `playKey(event.keyCode)`; ensure listener is only active when editor is mounted and focus is in editor
- [x] 2.2 Do not call `preventDefault` or `stopPropagation` in the keydown handler so editor content, cursor, and autosave behave unchanged

## 3. Verification

- [ ] 3.1 Manual test: type in the journal editor → key sounds play for defined keys; focus in a different control or on another page → no typing sounds
- [ ] 3.2 Manual test: with config or ogg missing/corrupt, open journal and type → editor works normally, no sounds, no console errors or thrown exceptions
