## ADDED Requirements

### Requirement: Literature-style typography from Google Fonts
The system SHALL use a single literature-style typeface (e.g. Literata, Crimson Pro, or similar) from Google Fonts as the primary font for the entire app. The font MUST be loaded in a way that supports readability and a distinctive, premium feel; the system SHALL provide a sensible fallback (e.g. system serif) when the font is loading.

#### Scenario: Literature font applied app-wide
- **WHEN** the user views any screen in the app (login, signup, header, editor, calendar)
- **THEN** the primary text MUST use the chosen literature-style font family

#### Scenario: Fallback during font load
- **WHEN** the literature font is not yet loaded
- **THEN** the system MUST display text using a fallback (e.g. system serif) so content remains readable

### Requirement: Larger base font size and readable scale
The system SHALL use a larger base font size (e.g. 18px or 1.125rem for body) and a consistent type scale so reading and writing feel spectacular and comfortable. The scale MUST be applied consistently across the app so hierarchy is clear without feeling cramped.

#### Scenario: Larger base size for body text
- **WHEN** the user views body or editor content
- **THEN** the base font size MUST be at least 18px (or equivalent rem) so text feels comfortable to read

#### Scenario: Consistent type hierarchy
- **WHEN** the user views any screen in the app
- **THEN** headings, labels, and body text MUST use a consistent scale (e.g. defined via CSS variables or theme) so the hierarchy is clear and the experience feels cohesive

### Requirement: Futuristic, rethought visual identity
The system SHALL extend the existing calming theme with a futuristic, rethought visual identity so the product feels premium, distinctive, and flawless. Typography, spacing, and layout MUST work together to create a cohesive experience that feels intentional and worth returning to.

#### Scenario: Cohesive identity across screens
- **WHEN** the user moves between login, signup, journal, header, and calendar
- **THEN** the same typography, spacing, and visual language MUST apply so the experience feels unified and premium
