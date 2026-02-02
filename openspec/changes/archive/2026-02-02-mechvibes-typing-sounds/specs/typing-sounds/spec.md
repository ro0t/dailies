## ADDED Requirements

### Requirement: Mechvibes-style sound pack loading
The system SHALL load a single Mechvibes-compatible sound pack for typing sounds. The pack MUST consist of a config (e.g. JSON) and a single audio file (e.g. ogg). The config SHALL define a `sound` field pointing to the audio file and a `defines` map from key identifiers to `[offsetMs, durationMs]` for slicing the audio.

#### Scenario: Pack loads from app config and asset
- **WHEN** the journal editor is ready to play typing sounds
- **THEN** the system MUST load the sound pack config from the app (e.g. `config.json`) and the audio file from the public asset path (e.g. `purple.ogg`) and MUST be able to resolve key identifiers to offset and duration

#### Scenario: Missing or invalid pack does not break editor
- **WHEN** the sound pack config or audio file is missing or invalid
- **THEN** the editor MUST continue to work normally; typing sounds MUST be disabled and the system MUST NOT throw or show an error to the user for this condition

### Requirement: Key event to sound mapping
The system SHALL map keyboard keydown events in the journal editor to sound pack defines. Each key SHALL be resolved to a key identifier used in the pack's `defines` (e.g. key code or normalized key). If a key has no define in the pack, the system SHALL NOT play a sound for that key.

#### Scenario: Defined key plays corresponding sound
- **WHEN** the user presses a key that has an entry in the sound pack's `defines`
- **THEN** the system MUST play the audio slice for that key (start at offsetMs, play for durationMs)

#### Scenario: Undefined key is silent
- **WHEN** the user presses a key that has no entry in the sound pack's `defines`
- **THEN** the system MUST NOT play any typing sound for that key

### Requirement: Playback on keydown in journal only
The system SHALL trigger typing sound playback on keydown (not keyup) when the user types in the journal editor. Playback SHALL use the correct slice of the pack's audio file (offset and duration from config). Typing sounds SHALL NOT play on any other screen (e.g. login, signup, calendar) or when focus is outside the journal editor.

#### Scenario: Typing in editor plays sound
- **WHEN** the user has focus in the journal editor and presses a key that has a define
- **THEN** the system MUST play the corresponding key sound (ogg slice) on keydown

#### Scenario: No sound when not in editor
- **WHEN** the user is on a screen that does not contain the journal editor, or focus is outside the editor (e.g. in a button or link)
- **THEN** the system MUST NOT play typing sounds for key presses

### Requirement: No change to editor content or behavior
Typing sounds SHALL be additive only. The system MUST NOT alter how the editor captures, stores, or displays content. Autosave, focus, and all existing editor requirements SHALL behave exactly as before.

#### Scenario: Editor behavior unchanged
- **WHEN** typing sounds are enabled and the user types in the editor
- **THEN** character input, cursor movement, and autosave MUST behave identically to when typing sounds are disabled or unavailable
