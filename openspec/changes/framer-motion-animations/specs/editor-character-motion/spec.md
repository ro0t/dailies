## ADDED Requirements

### Requirement: Newly typed characters animate blur-to-crisp
The system SHALL animate each character as it is typed in the journal editor: the character SHALL appear briefly blurred and SHALL transition to crisp within a fast, small motion (e.g. ~100–200 ms). The effect SHALL feel subtle and human, not distracting.

#### Scenario: Character enters with blur then sharpens
- **WHEN** the user types a character in the journal editor
- **THEN** that character MUST be shown with a short blur-to-crisp animation (blurred on enter, then sharp) so it feels like a fast, light touch

#### Scenario: Animation is visual-only and not persisted
- **WHEN** the user types and the blur-to-crisp animation is shown
- **THEN** the system MUST NOT store any animation wrapper or extra markup in the database; persisted content MUST remain plain TipTap document JSON as before

#### Scenario: Animation only while writing
- **WHEN** content is loaded from storage or displayed without the user actively typing that character
- **THEN** the system MUST NOT apply the blur-to-crisp animation to that character; the effect SHALL apply only to characters as they are entered during the current editing session

### Requirement: Character motion is performant
Character animations SHALL use GPU-friendly properties (e.g. transform, opacity, filter) and SHALL NOT cause layout thrash or visible jank. The implementation SHALL wrap characters only in the DOM for the duration of the animation; wrapping SHALL NOT affect cursor behavior, selection, or autosave.

#### Scenario: No jank during typing
- **WHEN** the user types at normal or fast speed in the editor
- **THEN** animations MUST complete without noticeable frame drops or input lag; cursor and selection MUST behave as before

#### Scenario: Stored content unchanged
- **WHEN** the editor saves or syncs content to the backend
- **THEN** the payload MUST be standard TipTap JSON with no animation-related nodes or attributes
