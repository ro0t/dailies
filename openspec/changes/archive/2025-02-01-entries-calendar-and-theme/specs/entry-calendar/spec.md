## ADDED Requirements

### Requirement: Calendar shows which dates have an entry
The system SHALL display a calendar view in which each date shows a visual indicator when the authenticated user has a journal entry for that date, and no indicator (or distinct styling) when the user has no entry for that date.

#### Scenario: Date with entry is indicated
- **WHEN** the user opens the calendar and a date has an existing journal entry for that user
- **THEN** the system MUST show a visual indicator (e.g. dot or highlight) for that date

#### Scenario: Date without entry is indicated
- **WHEN** the user opens the calendar and a date has no journal entry for that user
- **THEN** the system MUST show no entry indicator (or distinct styling) for that date

### Requirement: User can select a date to open that day's journal
The system SHALL allow the user to select a date in the calendar. Selecting a date MUST navigate the user to that day's journal (i.e. the editor loads the entry for the selected date, or creates it if missing).

#### Scenario: Select past date
- **WHEN** the user selects a past date in the calendar
- **THEN** the system MUST navigate to that day's journal and MUST load or create the entry for that date

#### Scenario: Select future date
- **WHEN** the user selects a future date in the calendar
- **THEN** the system MUST navigate to that day's journal and MUST load or create the entry for that date

#### Scenario: Select today
- **WHEN** the user selects today's date in the calendar
- **THEN** the system MUST navigate to today's journal and MUST load or create today's entry

### Requirement: Calendar supports past and future dates
The calendar SHALL allow the user to view and select dates in the past and in the future. The system MUST NOT restrict selection to the current date only.

#### Scenario: Navigate to past month
- **WHEN** the user navigates the calendar to a past month
- **THEN** the system MUST display dates for that month and MUST allow selecting any date

#### Scenario: Navigate to future month
- **WHEN** the user navigates the calendar to a future month
- **THEN** the system MUST display dates for that month and MUST allow selecting any date
