## ADDED Requirements

### Requirement: Return dates with entries for a range
The system SHALL provide a way to obtain the set of calendar dates (entry_date) for which the authenticated user has at least one journal entry within a given date range. This SHALL be used to show calendar indicators (which dates have an entry).

#### Scenario: Fetch entry dates for month
- **WHEN** the client requests entry dates for the authenticated user for a given month (or range)
- **THEN** the system MUST return the list of entry_date values for that user within that range, and MUST NOT return entry content (only dates)

## MODIFIED Requirements

### Requirement: Create today's entry if missing
The system SHALL create the journal entry for the authenticated user for a chosen calendar date when it does not exist. Creation MUST occur when the user needs to read or write that date's entry (e.g. on loading the editor for that date). The chosen date MAY be today or any past or future calendar date.

#### Scenario: First write for chosen date
- **WHEN** the authenticated user opens the editor for a chosen date and that date's entry does not exist
- **THEN** the system MUST create a new journal entry for that user for that date (entry_date = chosen date) and MUST allow the user to write into it

### Requirement: Read today's journal entry
The system SHALL allow the authenticated user to read the journal entry for a chosen calendar date. The system MUST return the entry's content (content_json) and metadata when loading the editor for that date. The chosen date MAY be today or any past or future calendar date.

#### Scenario: Load existing entry for chosen date
- **WHEN** the authenticated user opens the editor for a chosen date and that date's entry already exists
- **THEN** the system MUST load that entry and MUST make its content available to the editor

#### Scenario: Load when no entry exists for chosen date
- **WHEN** the authenticated user opens the editor for a chosen date and that date's entry does not exist
- **THEN** the system MUST create that date's entry and MUST provide empty or default content to the editor

### Requirement: Update today's journal entry
The system SHALL allow the authenticated user to update the journal entry for a chosen calendar date. Updates MUST persist the editor content (TipTap JSON) to that date's entry content_json. The chosen date MAY be today or any past or future calendar date. The system MUST support silent, automatic persistence (autosave) as defined by the editor-experience spec.

#### Scenario: Content is persisted to chosen date
- **WHEN** the user edits content in the editor for a chosen date and autosave runs
- **THEN** the system MUST persist the current content_json to that date's entry for that user
