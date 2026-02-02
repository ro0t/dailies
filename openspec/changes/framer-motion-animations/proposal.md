# Proposal: Framer Motion animations (next-gen, subtle and performant)

## Why

The journal today is functional but static. Adding subtle, human-feeling motion with Framer Motion will make the app feel more responsive and “next-gen” without distraction—animations that feel a little magical, smooth, and performant. This improves perceived quality and delight while keeping the product calm and minimal.

## What Changes

- **Editor character motion**: Each newly typed character appears with a fast, small blur-to-crisp effect (blurred on enter, then sharp). Implemented by wrapping each character in an element only during writing; persisted content (TipTap JSON sent to the DB) MUST NOT include these wrappers—effect is visual-only at typing time.
- **Calendar motion**: Animate the calendar opening and closing; animate month changes; stagger the appearance of day cells when the calendar is shown or the month changes.
- **Journal navigation motion**: When moving to previous/next day, a simple “paper switch” transition: the current sheet moves out and the incoming sheet moves in, with light motion blur during the transition. Not a book flip or page curl—a clean sheet swap that feels like paper.
- **Principles**: All animations MUST be subtle, human, smooth, and optimized (no jank). Implement with Framer Motion; prefer GPU-friendly properties and avoid layout thrash.

## Capabilities

### New Capabilities

- `editor-character-motion`: Per-character blur-to-crisp animation as the user types in the journal editor. Wrapping is visual-only; stored content remains plain TipTap JSON with no animation markup.
- `calendar-motion`: Animated calendar open/close, month transitions, and staggered day cells. Motion must stay subtle and performant.
- `journal-navigation-motion`: Paper-style sheet switch when navigating between journal dates (prev/next): outgoing and incoming “sheets” with light motion blur; no book metaphor.

### Modified Capabilities

- None. Animations are additive; existing editor, calendar, and navigation behavior and specs are unchanged.

## Impact

- **Code**: Framer Motion dependency; updates to journal editor (character wrapping/animation only in DOM, not in stored content), calendar sheet/component (open/close, month, stagger), and journal date navigation (page/sheet transition).
- **APIs**: None.
- **Dependencies**: Add `framer-motion` (or existing equivalent). Ensure animations use transform/opacity where possible for performance.
- **Systems**: No backend or schema changes. Stored content format unchanged.
