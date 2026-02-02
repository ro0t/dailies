## ADDED Requirements

### Requirement: Editor bound to today's journal entry
The editor SHALL display and edit the active journal entry, which for v1 is always today's entry for the authenticated user. The editor MUST be wired to the same entry that the journal-entry capability defines (one per user per calendar day).

#### Scenario: Editor shows today's content
- **WHEN** the user opens the editor
- **THEN** the editor MUST display the content of today's journal entry for that user (or empty/default content if the entry was just created)

#### Scenario: Editor edits are applied to today's entry
- **WHEN** the user types or edits in the editor
- **THEN** the changes MUST be applied to today's journal entry only; the system MUST NOT write to other days' entries from this editor

### Requirement: TipTap editor with JSON storage
The system SHALL use TipTap for all writing in the journal. Editor content MUST be stored and transmitted as TipTap document JSON. The system SHALL NOT convert to or from markdown for storage.

#### Scenario: Content is TipTap JSON
- **WHEN** the editor loads or saves content
- **THEN** the content MUST be in TipTap document JSON format; the same format MUST be sent to the backend for persistence

### Requirement: Silent automatic save
The system SHALL save editor changes automatically and silently. There MUST be no explicit save button. The system MUST NOT show a save confirmation toast, modal, or loading overlay for normal autosave. Autosave SHALL run after a short debounce following the user's last change.

#### Scenario: No save button
- **WHEN** the user is on the editor screen
- **THEN** the UI MUST NOT display a save button or equivalent explicit save action for journal content

#### Scenario: Autosave without notification
- **WHEN** the user edits content and the debounced autosave runs
- **THEN** the system MUST persist the content without showing a success toast, modal, or save indicator to the user

### Requirement: Focus in editor on load
When the editor screen loads, the system SHALL place focus in the editor so the user can start typing immediately without an extra click.

#### Scenario: Cursor in editor on load
- **WHEN** the editor page has finished loading with today's entry (or new entry) available
- **THEN** the editor MUST receive focus and the cursor MUST be placed in the editor content area so the user can type immediately

### Requirement: No title field
The editor SHALL NOT display or require a title field for journal entries. The user MUST NOT be prompted to enter a title to write or save.

#### Scenario: No title required
- **WHEN** the user is on the editor screen
- **THEN** the UI MUST NOT show a title input and MUST NOT require a title for writing or saving
