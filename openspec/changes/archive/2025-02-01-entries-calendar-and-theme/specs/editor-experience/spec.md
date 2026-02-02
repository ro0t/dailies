## MODIFIED Requirements

### Requirement: Editor bound to today's journal entry
The editor SHALL display and edit the active journal entry for the *selected* calendar date (which MAY be today, a past date, or a future date). The editor MUST be wired to the same entry that the journal-entry capability defines for that date (one per user per calendar day).

#### Scenario: Editor shows selected date's content
- **WHEN** the user opens the editor (or changes the selected date)
- **THEN** the editor MUST display the content of the journal entry for the selected date for that user (or empty/default content if the entry was just created)

#### Scenario: Editor edits are applied to selected date's entry
- **WHEN** the user types or edits in the editor
- **THEN** the changes MUST be applied to the selected date's journal entry only; the system MUST NOT write to other days' entries from this editor
