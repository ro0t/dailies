## ADDED Requirements

### Requirement: Current date label is primary calendar affordance
The selected date displayed in the header (or equivalent) SHALL be the primary affordance for opening the calendar. Activating the date label (e.g. tap or click) MUST open the calendar so that "pick a day" is a single, obvious gesture.

#### Scenario: Date label opens calendar
- **WHEN** the user activates the displayed date (e.g. the label showing "Today" or "Wed, Jan 15, 2025") in the header
- **THEN** the system MUST open the calendar so the user can jump to any date

#### Scenario: Date label is visibly tappable
- **WHEN** the user is on the journal screen
- **THEN** the selected date MUST be presented so it is clear that it can be activated to open the calendar (e.g. styling or placement that suggests interactivity)

### Requirement: Day navigation is grouped and clear
Controls for moving to the previous day, next day, and "Today" SHALL be grouped so that "move in time" is one clear cluster. The placement and styling MUST make the mental model obvious (date = where I am; these controls move me) and MUST reduce visual clutter.

#### Scenario: Prev/next and Today are grouped
- **WHEN** the user views the header on the journal screen
- **THEN** previous day, next day, and "Today" controls MUST appear as a coherent group (e.g. adjacent or visually related) so the user understands they control time navigation

#### Scenario: Navigation feels intentional
- **WHEN** the user activates previous day, next day, or Today
- **THEN** the transition to the new date and entry MUST feel smooth and intentional; the system MUST use the same typography and spacing as the rest of the rethought UI

### Requirement: Navigation flow feels intuitive
The overall flow from viewing the current date to opening the calendar, selecting a date, or moving by day SHALL feel intuitive and human. The system SHALL NOT require unnecessary steps or leave the user unsure how to change dates.

#### Scenario: Obvious path to change date
- **WHEN** the user wants to view or edit another day's entry
- **THEN** the primary ways to do so (date label for calendar, prev/next and Today for adjacent days) MUST be discoverable and require minimal steps

#### Scenario: Consistent with rethought UI
- **WHEN** the user uses day navigation or the calendar
- **THEN** controls MUST use the same typography, spacing, and visual language as the rest of the app so the experience feels cohesive and human
