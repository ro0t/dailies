## ADDED Requirements

### Requirement: One entry per user per calendar day
The system SHALL store at most one journal entry per user per calendar day. An entry is identified by the combination of user and calendar date (entry_date). The system MUST enforce uniqueness of (user_id, entry_date).

#### Scenario: Single entry per user per day
- **WHEN** the system persists journal entries
- **THEN** each user MUST have at most one entry per calendar day; a second entry for the same user and same day MUST replace or update the first (e.g. upsert)

#### Scenario: Different days are separate entries
- **WHEN** a user has entries for different calendar days
- **THEN** the system MUST treat each day as a separate entry (separate rows keyed by entry_date)

### Requirement: Create today's entry if missing
The system SHALL create today's journal entry for the authenticated user when it does not exist. Creation MUST occur when the user needs to read or write today's entry (e.g. on loading the editor).

#### Scenario: First write of the day
- **WHEN** the authenticated user opens the editor and today's entry does not exist
- **THEN** the system MUST create a new journal entry for that user for today (entry_date = today) and MUST allow the user to write into it

### Requirement: Read today's journal entry
The system SHALL allow the authenticated user to read today's journal entry. The system MUST return the entry's content (content_json) and metadata when loading the editor for today.

#### Scenario: Load existing today entry
- **WHEN** the authenticated user opens the editor and today's entry already exists
- **THEN** the system MUST load that entry and MUST make its content available to the editor

#### Scenario: Load when no entry exists
- **WHEN** the authenticated user opens the editor and today's entry does not exist
- **THEN** the system MUST create today's entry and MUST provide empty or default content to the editor

### Requirement: Update today's journal entry
The system SHALL allow the authenticated user to update today's journal entry. Updates MUST persist the editor content (TipTap JSON) to the entry's content_json. The system MUST support silent, automatic persistence (autosave) as defined by the editor-experience spec.

#### Scenario: Content is persisted
- **WHEN** the user edits content in the editor and autosave runs
- **THEN** the system MUST persist the current content_json to today's entry for that user

### Requirement: RLS enforces ownership
All access to journal entries MUST be enforced by Supabase Row Level Security (RLS). Policies MUST restrict SELECT, INSERT, UPDATE, and DELETE so that a user can only access rows where user_id equals the authenticated user's id (auth.uid()).

#### Scenario: User cannot read another user's entry
- **WHEN** user A attempts to read an entry owned by user B (e.g. via Supabase client with user A's session)
- **THEN** the system MUST NOT return user B's entry; RLS MUST deny access

#### Scenario: User cannot update another user's entry
- **WHEN** user A attempts to update an entry owned by user B
- **THEN** the system MUST NOT apply the update; RLS MUST deny access

### Requirement: Entry content stored as JSON
Journal entry content MUST be stored as JSON (TipTap document JSON) in a content_json (or equivalent) field. The system SHALL NOT store entry body as markdown or plain text; the editor format is the stored format.

#### Scenario: Content format
- **WHEN** the system persists or retrieves entry content
- **THEN** content MUST be stored and returned as JSON (TipTap document structure)
