## ADDED Requirements

### Requirement: Calendar opens and closes with animation
When the user opens or closes the calendar (e.g. by activating the date in the header), the calendar SHALL appear and disappear with a subtle, smooth animation. The motion SHALL feel human and intentional, not mechanical or flashy.

#### Scenario: Calendar opens with motion
- **WHEN** the user opens the calendar (e.g. taps the current date label)
- **THEN** the calendar MUST appear with a smooth open animation (e.g. scale/fade or slide) that feels quick and natural

#### Scenario: Calendar closes with motion
- **WHEN** the user closes the calendar (e.g. taps outside or selects a date)
- **THEN** the calendar MUST disappear with a smooth close animation consistent with the open behavior

### Requirement: Month change is animated
When the user switches month (e.g. prev/next), the transition SHALL be animated so the change feels smooth and intentional rather than an instant swap.

#### Scenario: Month transition is smooth
- **WHEN** the user changes month (e.g. via prev/next controls)
- **THEN** the calendar MUST transition to the new month with a smooth animation (e.g. slide or crossfade) so the user perceives a clear but gentle change

### Requirement: Day cells stagger on appear
When the calendar or a new month is shown, the day cells SHALL appear with a staggered animation (e.g. a short delay between each cell or row) so the grid feels alive without being slow or distracting.

#### Scenario: Days stagger when calendar opens
- **WHEN** the calendar opens and the day grid is shown
- **THEN** the day cells MUST animate in with a subtle stagger (e.g. by row or by cell) so the reveal feels smooth and light

#### Scenario: Days stagger on month change
- **WHEN** the user switches to another month and the new month’s grid is shown
- **THEN** the day cells for that month MUST animate in with a subtle stagger consistent with the open behavior

### Requirement: Calendar motion is performant
All calendar animations SHALL use GPU-friendly properties where possible and SHALL NOT cause noticeable jank or input delay. Motion SHALL remain subtle and aligned with the app’s calm, minimal design.

#### Scenario: No jank during calendar interaction
- **WHEN** the user opens, closes, or changes month in the calendar
- **THEN** animations MUST run smoothly without visible frame drops or lag
