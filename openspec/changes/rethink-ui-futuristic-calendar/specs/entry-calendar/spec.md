## ADDED Requirements

### Requirement: Calendar layout is breathable and hierarchical
The calendar SHALL use a layout with sufficient spacing between dates and clear visual hierarchy. Month and year MUST be prominently displayed; weekday labels MUST be visible but secondary. The grid MUST NOT feel cramped or form-like.

#### Scenario: Breathable grid
- **WHEN** the user opens the calendar
- **THEN** date cells MUST have sufficient padding and spacing so the grid feels comfortable and easy to scan

#### Scenario: Clear month/year hierarchy
- **WHEN** the user opens the calendar
- **THEN** the current month and year MUST be clearly visible (e.g. as a heading); weekday labels MUST be distinguishable but subordinate

### Requirement: Entry indicator feels part of the date
When a date has a journal entry, the visual indicator SHALL feel integrated with the date cell (e.g. soft fill, underline, or subtle highlight) rather than a small, disconnected dot. The indicator MUST support the calming, human intent of the app.

#### Scenario: Entry presence is clear and integrated
- **WHEN** the user opens the calendar and a date has an existing journal entry
- **THEN** the system MUST show an indicator that feels part of that date (e.g. background or underline) and MUST NOT rely solely on a tiny, isolated dot

#### Scenario: No entry is visually distinct
- **WHEN** the user opens the calendar and a date has no journal entry
- **THEN** the system MUST show distinct styling (e.g. no fill or muted state) so the user can quickly see which dates have entries

### Requirement: Calendar interaction feels natural and human
Calendar interaction SHALL feel natural and human: date cells MUST have comfortable tap targets, and selecting a date or changing months MUST feel intentional rather than mechanical. The system SHALL NOT use heavy or distracting animation.

#### Scenario: Comfortable tap targets
- **WHEN** the user interacts with the calendar on touch or pointer devices
- **THEN** date cells and navigation controls (e.g. prev/next month) MUST have sufficient size and spacing so interaction feels comfortable and reduces cognitive load

#### Scenario: Natural month navigation
- **WHEN** the user changes month (e.g. via prev/next)
- **THEN** the transition MUST feel smooth and intentional (e.g. subtle transition) and MUST NOT feel jarring or form-like
