## ADDED Requirements

### Requirement: Header provides previous/next day navigation
The system SHALL provide controls in the header (or equivalent) to move to the previous calendar day and the next calendar day. The editor MUST load the entry for the newly selected day after navigation.

#### Scenario: Go to previous day
- **WHEN** the authenticated user activates "previous day" (e.g. button or link) in the header
- **THEN** the system MUST set the selected date to the previous calendar day and MUST load or create the entry for that day in the editor

#### Scenario: Go to next day
- **WHEN** the authenticated user activates "next day" in the header
- **THEN** the system MUST set the selected date to the next calendar day and MUST load or create the entry for that day in the editor

### Requirement: Header provides "Today" shortcut
The system SHALL provide a "Today" (or equivalent) control in the header that, when activated, sets the selected date to the current calendar day and loads today's entry in the editor.

#### Scenario: Jump to today
- **WHEN** the authenticated user activates "Today" in the header
- **THEN** the system MUST set the selected date to today and MUST load or create today's entry in the editor

### Requirement: Header provides control to open the calendar
The system SHALL provide a control in the header (e.g. button or date display) that opens the calendar (e.g. sheet or popover). The user MAY use this to jump to any date.

#### Scenario: Open calendar from header
- **WHEN** the user activates the calendar control in the header
- **THEN** the system MUST display the calendar (e.g. in a sheet or popover)

### Requirement: Selected date is clearly shown and drives the editor
The selected date MUST be clearly visible in the header (or equivalent). The editor MUST always display and persist the journal entry for the selected date; changing the selected date MUST load the entry for the new date.

#### Scenario: Selected date is visible
- **WHEN** the user is on the journal screen
- **THEN** the selected date MUST be visible (e.g. in the header) so the user knows which day's entry they are viewing or editing

#### Scenario: Editor reflects selected date
- **WHEN** the selected date changes (e.g. via calendar or prev/next)
- **THEN** the editor MUST load the entry for the new selected date (or create it if missing) and MUST persist edits to that date's entry only
