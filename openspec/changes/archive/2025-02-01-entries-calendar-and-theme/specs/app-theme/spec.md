## ADDED Requirements

### Requirement: Beige, calming palette app-wide
The system SHALL apply a consistent beige and neutral color palette across the entire app: login, signup, layout, header, editor, and calendar. Colors MUST feel calming and mindful; the system SHALL NOT use jarring or high-contrast accent colors that conflict with the calming intent.

#### Scenario: Consistent palette on auth pages
- **WHEN** the user views the login or signup page
- **THEN** the page MUST use the same beige/neutral palette as the rest of the app

#### Scenario: Consistent palette on journal and calendar
- **WHEN** the user views the header, editor, or calendar
- **THEN** those areas MUST use the same beige/neutral palette

### Requirement: Generous whitespace and typography
The system SHALL use generous whitespace and consistent, readable typography app-wide. Layout and spacing MUST support a focused, uncluttered experience.

#### Scenario: Readable and spacious layout
- **WHEN** the user views any screen in the app
- **THEN** the layout MUST use consistent typography and sufficient whitespace so the experience feels calm and readable

### Requirement: Subtle, smooth interactions
Interactions (e.g. focus, hover, navigation, opening the calendar) SHALL use subtle motion or transition where appropriate. The system MUST NOT use heavy or distracting animation.

#### Scenario: Transitions feel smooth
- **WHEN** the user triggers navigation, opens the calendar, or interacts with focusable elements
- **THEN** the system MAY use subtle transitions or motion so interactions feel smooth and intentional

#### Scenario: No heavy animation
- **WHEN** the user uses the app
- **THEN** the system MUST NOT use heavy or distracting animation that conflicts with the calming intent
