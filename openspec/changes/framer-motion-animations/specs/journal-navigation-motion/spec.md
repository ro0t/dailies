## ADDED Requirements

### Requirement: Day navigation uses paper-style sheet switch
When the user navigates to the previous or next day (e.g. via prev/next or Today), the transition SHALL use a “paper switch” animation: the current entry (outgoing sheet) and the target entry (incoming sheet) SHALL move in a simple, clear way that feels like switching sheets of paper—not opening a book or flipping pages.

#### Scenario: Outgoing sheet moves out
- **WHEN** the user navigates to another day (prev/next or Today)
- **THEN** the current day’s content MUST animate out as a single “sheet” (e.g. slide or fade) so the user sees it leaving

#### Scenario: Incoming sheet moves in
- **WHEN** the user navigates to another day and the outgoing sheet animates out
- **THEN** the new day’s content MUST animate in as a single “sheet” (e.g. slide or fade from the opposite direction) so the user clearly sees the new entry arriving

#### Scenario: Light motion blur during transition
- **WHEN** the sheet switch animation is in progress
- **THEN** the system MAY apply a subtle motion blur or blur-to-crisp effect to the moving content so the transition feels smooth and a little magical, without being heavy or distracting

### Requirement: Paper switch is simple and not book-like
The navigation animation SHALL be a straightforward sheet switch (outgoing + incoming). It SHALL NOT mimic opening a book, flipping pages, or curling corners—only a clean, paper-like swap between two “sheets.”

#### Scenario: No book or page-flip metaphor
- **WHEN** the user navigates between days
- **THEN** the animation MUST NOT use 3D book open, page curl, or similar metaphors; it MUST feel like two flat sheets switching place

### Requirement: Journal navigation motion is performant
Sheet switch animations SHALL use GPU-friendly properties and SHALL NOT cause noticeable jank or delay when loading the new day’s content. The transition SHALL feel quick and responsive.

#### Scenario: Smooth transition between days
- **WHEN** the user navigates to another day and the new entry loads
- **THEN** the sheet switch MUST complete smoothly without visible frame drops or long freezes
