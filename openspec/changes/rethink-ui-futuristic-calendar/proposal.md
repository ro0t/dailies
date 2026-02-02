# Proposal: Rethought UI — futuristic, human, literature typography

## Why

The app already has entry history, calendar, and a calming theme, but the UI feels generic and mechanical. Users deserve a rethought experience that feels futuristic, works flawlessly, and human—with distinctive literature-style typography, a reworked calendar, and navigation that feels natural rather than form-like. This change elevates the product so every screen feels intentional and worth returning to.

## What Changes

- **Futuristic, rethought UI**: A cohesive visual language applied app-wide so the product feels premium, distinctive, and flawless—building on the existing beige/mindful direction while making it more striking and memorable.
- **Typography**: A literature-style font from Google Fonts (e.g. Literata, Crimson, or similar); larger base font sizes and a clear type hierarchy so reading and writing feel spectacular and comfortable.
- **Calendar rework**: The calendar is reworked—layout, interaction, and discovery—so choosing and moving between dates feels natural and human, not like filling a form.
- **Navigation rework**: Day navigation (prev/next, Today, opening the calendar) and overall flow are refined so moving through time and entries feels natural and human, with a clearer mental model and fewer mechanical steps.
- **Consistency**: Same principles (calming, mindful, generous space, subtle motion) applied everywhere: login, signup, header, editor, and calendar.

## Capabilities

### New Capabilities

- None. This change refines existing capabilities rather than adding new ones.

### Modified Capabilities

- `app-theme`: Extend the calming theme with a futuristic, rethought visual identity: literature-style typography (Google Font), larger font sizes, and a type hierarchy that feels spectacular and readable. Requirements for beige/neutral palette, whitespace, and subtle motion remain; add requirements for typography source, scale, and tone.
- `entry-calendar`: Rework calendar UX so interaction and layout feel natural and human. Existing requirements (dates with/without entries, select date to open journal, past/future) remain; add or refine requirements for layout, interaction pattern, and “human” feel (e.g. clarity, flow, reduced cognitive load).
- `entry-history-navigation`: Rework navigation UX so day navigation and calendar access feel natural and human. Existing requirements (prev/next day, Today, open calendar, selected date visible and driving editor) remain; add or refine requirements for placement, affordances, and flow so the experience feels intuitive rather than mechanical.

## Impact

- **Code**: Global typography (Google Font, CSS variables, larger base sizes); layout and spacing updates; calendar component rework; header and navigation component updates; possible design tokens or theme extensions.
- **APIs**: None.
- **Dependencies**: Google Fonts (one literature-style font family); existing stack (Next.js, TipTap, Supabase, shadcn/Tailwind) unchanged.
- **Systems**: No backend or schema changes.
