# Design: Rethought UI — typography, calendar, navigation

## Context

The app uses Geist (sans + mono), a beige/neutral theme in CSS variables, and a bottom-sheet calendar with header day navigation (prev/next, Today, date label, calendar trigger). The proposal asks for a rethought, futuristic UI with literature-style typography, larger font sizes, a reworked calendar, and navigation that feels natural and human—without changing backend or product behavior.

**Current state:** `layout.tsx` loads Geist; `globals.css` defines `--theme-*` and applies them; `header.tsx` has inline nav controls and opens `CalendarSheet`; `calendar-sheet.tsx` is a bottom drawer with month grid, entry dots, and prev/next month. All behavior (which date has an entry, select date → journal, past/future) is already correct; the change is visual and interaction design only.

## Goals / Non-Goals

**Goals:**

- Introduce a single literature-style Google Font app-wide and a larger, readable type scale so the product feels distinctive and premium.
- Rework the calendar’s layout and interaction so choosing dates feels natural and human (clear hierarchy, comfortable touch targets, less “form-like”).
- Rework navigation (prev/next, Today, calendar) so placement and flow feel intuitive and reduce cognitive load.
- Keep the existing beige/calming palette, generous space, and subtle motion; align all screens (login, signup, header, editor, calendar) to the new typography and spacing.

**Non-Goals:**

- New features (e.g. new entry types, sharing, export).
- Backend, API, or schema changes.
- Changing which dates have entries, routing, or editor binding—only how they look and feel.

## Decisions

### Typography: literature-style font and scale

- **Choice:** Use one Google Font family with a “literature” feel (e.g. **Literata** or **Crimson Pro**) as the primary UI and reading font. Reserve Geist Mono (or keep it) only for code if ever needed; do not mix a second decorative font.
- **Rationale:** A single, strong typeface gives a cohesive, futuristic-yet-readable identity. Literata and Crimson both read well at larger sizes and suit long-form text.
- **Alternatives considered:** Keeping Geist (too generic); adding a display-only font for headings (rejected to avoid visual noise and extra weight).

### Type scale and base size

- **Choice:** Increase base font size (e.g. 18px or 1.125rem for body) and define a small, consistent scale (e.g. 1rem, 1.125rem, 1.25rem, 1.5rem, 1.875rem) via CSS variables or Tailwind. Use the same family for headings and body; differentiate with size and weight only.
- **Rationale:** Larger base size supports “spectacular” readability and matches the “literature” goal; a simple scale keeps the UI calm and consistent.
- **Implementation:** Load the chosen font in `layout.tsx` with `next/font/google`, set a CSS variable (e.g. `--font-serif` or `--font-primary`), and use it in `globals.css` and `@theme` for `body` and components. Optionally add `--text-base`, `--text-lg`, etc. for the scale.

### Calendar: layout and interaction

- **Choice:** Rework the existing bottom sheet calendar (keep the same component entry point and open/close behavior) with: (1) larger, more breathable grid cells and day labels, (2) clearer visual hierarchy (month/year prominent, weekdays subtle), (3) entry indicator that feels part of the date (e.g. soft fill or underline) rather than a tiny dot, (4) comfortable tap targets and spacing so it doesn’t feel like a form.
- **Rationale:** Same UX (open from header, select date → journal, past/future, entry presence) is preserved; only layout and interaction design change to feel more human.
- **Alternatives considered:** Inline calendar on journal page (rejected for this change to avoid scope creep); full-page calendar (rejected; sheet keeps focus on writing).

### Navigation: placement and affordances

- **Choice:** Keep prev/next, Today, and calendar in the header but refine: (1) make the *current date label* the primary affordance (e.g. tappable to open calendar, so “pick a day” is one gesture), (2) group prev/next and Today so “move in time” is one clear cluster, (3) use the new type scale and spacing so controls feel intentional, not cramped.
- **Rationale:** “Natural and human” is achieved by making the mental model obvious (date = where I am; these buttons move me) and reducing visual clutter.
- **Implementation:** No new routes or state; only restructuring and styling of `header.tsx` (and any small subcomponents) plus consistent use of the new font and spacing.

### Theming and consistency

- **Choice:** Keep existing `--theme-*` variables; add font and type-scale variables. Apply the new font and scale in `globals.css`, `layout.tsx`, and every page (login, signup, journal, header, calendar). Do not introduce a second palette; beige/neutral remains the single source of truth.
- **Rationale:** One theme and one typography system prevent drift and keep the “futuristic but calming” look consistent.

## Risks / Trade-offs

- **[Font load / FOUT]** → Use `next/font` with display swap and preload so the literature font loads early; keep fallback to system serif in CSS.
- **[Larger type reduces density]** → Accept slightly more scroll on small screens; prioritize readability and “spectacular” feel over fitting more on one screen.
- **[Calendar rework scope]** → Limit to one component (`calendar-sheet.tsx`) and its styling/layout; do not add new calendar features in this change.
- **[Accessibility]** → Ensure new font and sizes still meet contrast and zoom requirements; keep focus and aria labels on all interactive elements.

## Migration Plan

1. **Typography:** Add Google Font in `layout.tsx`, extend `globals.css` and `@theme` with font variable and type scale, switch `body` and base components to the new font/size. Verify login, signup, and journal in one pass.
2. **Header and navigation:** Restyle header with new type and spacing; make date label the primary calendar trigger; regroup prev/next and Today. No URL or state changes.
3. **Calendar:** Update `calendar-sheet.tsx` layout (grid, labels, entry indicator, tap targets) and typography to match the new system. Keep API and behavior unchanged.
4. **Editor:** Ensure TipTap content and chrome use the same font and scale (via `.tiptap` and editor wrapper). No editor logic changes.
5. **Smoke test:** Sign in, open calendar, move prev/next, jump to Today, select past/future dates, write and save; confirm all screens use the new look and no regressions.

No database or API rollout; no feature flags. Rollback = revert CSS and layout changes and font import.

## Open Questions

- **Font pick:** Literata vs Crimson Pro (or another literature-style Google Font) can be finalized during implementation based on tone (slightly more modern vs classic).
- **Dark mode:** Existing `prefers-color-scheme: dark` overrides for `--theme-*` remain; confirm that the new font and scale look good in dark mode with no extra changes beyond current variables.
