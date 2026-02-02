# Design: Entry history, calendar, and calming theme

## Context

Dailies v1 has a single editor screen that only loads "today's" entry; there is no calendar, no day navigation, and styling is minimal (stone/neutral). This change adds entry history, a calendar to see and jump to any date, and a consistent beige, calming theme. Tech stack and constraints are unchanged: Next.js App Router, Supabase, TipTap, shadcn/ui, RLS, no schema change.

## Goals / Non-Goals

**Goals:**

- User can navigate by day (prev/next, "Today") and see which date is selected; the editor loads the entry for that date.
- User can open a calendar that shows which dates have an entry vs. none; selecting a date navigates to that day's journal.
- User can backdate (open a past date and write or edit) and open future dates (e.g. for reminders or scheduled thoughts).
- A single beige, mindful, calming theme (palette, typography, spacing, subtle motion) is applied app-wide: login, signup, header, editor, calendar.

**Non-Goals:**

- Sharing, public links, or `is_unlocked` behavior.
- Multiple entries per day or version history.
- User-selectable themes or settings screen.
- Calendar as a full-page view only; it can be the primary way to pick a date (e.g. sheet/popover from header).

## Decisions

### 1. Selected date: URL-based

- **Choice:** Selected date is encoded in the URL, e.g. `/journal/[date]` with `date` as `YYYY-MM-DD`, or `/journal?date=YYYY-MM-DD`. Default (no date or "today") is current calendar date.
- **Rationale:** Bookmarkable, back/forward works, shareable link to a specific day. Server can read date from URL and load the right entry.
- **Alternatives considered:** Client-only state (rejected—lost on refresh); route without date and `?date=` (acceptable—same idea).

### 2. Calendar: sheet or popover from header

- **Choice:** Calendar is shown in a sheet (drawer) or popover opened from the header (e.g. "Calendar" or date button). Not a dedicated full-page route for the first iteration; the main view remains the editor, with the calendar as an overlay to pick a date.
- **Rationale:** Keeps "writing first" and avoids extra navigation; header already holds day nav, so calendar fits there. Sheet/popover is a common pattern for date pickers.
- **Alternatives considered:** Full-page calendar (deferred—adds navigation and scope); sidebar calendar (rejected—more layout change).

### 3. Calendar UI and entry indicators

- **Choice:** Use a calendar component (e.g. shadcn/ui Calendar if available, or Radix-based calendar) that shows a month grid. For each date, show a visual indicator (e.g. dot or subtle highlight) if the user has an entry for that date; no indicator if no entry. User can click a date to navigate to that day's journal.
- **Rationale:** Proposal requires "show on each date if there is a journal entry or nothing written"; a dot or similar is enough. shadcn aligns with project rules.
- **Alternatives considered:** List of dates with entries only (rejected—no "empty" dates visible); custom calendar (acceptable if shadcn doesn’t fit).

### 4. Fetching "dates with entries" for the calendar

- **Choice:** Add a server action or API that returns the set of `entry_date` values for the current user in a given range (e.g. month or two). Calendar (or a wrapper) calls it for the visible month(s) and uses the result to render indicators.
- **Rationale:** Calendar needs to know which dates have entries without loading full entry content. A narrow query (e.g. `select entry_date from journal_entries where user_id = ? and entry_date between ? and ?`) is cheap and RLS applies.
- **Alternatives considered:** Loading all entry dates (rejected—unbounded); fetching entries per day (rejected—too many round-trips).

### 5. Entry read/upsert by date

- **Choice:** Extend existing server actions: `getEntryForDate(date: string)` (or keep name and add optional date; default = today) and `upsertEntryForDate(date: string, contentJson)`. Date is `YYYY-MM-DD`. Same table and RLS; no schema change.
- **Rationale:** Current `getTodayEntry()` and `upsertTodayEntry()` are effectively "today only"; generalizing to a date parameter matches "entry for any calendar date" and keeps one entry per user per day.

### 6. Theme: CSS variables and shared components

- **Choice:** Define a small set of CSS variables (e.g. `--theme-bg`, `--theme-surface`, `--theme-text`, `--theme-muted`, `--theme-accent`, `--theme-border`) with beige/neutral values in `globals.css`. Use these variables in layout, header, editor, calendar, login, and signup so the whole app shares one calming palette. Use existing Tailwind + shadcn; add subtle transitions where appropriate (e.g. focus, hover) and avoid heavy animation.
- **Rationale:** Single source of truth for colors; easy to tweak later. Config says "neutral beige colors, generous whitespace" and "interactions should always be animated and feel smooth"; CSS vars + light transitions satisfy that.
- **Alternatives considered:** Tailwind theme only (acceptable but less centralized); full design token system (deferred—overkill for this scope).

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| Calendar range query cost | Limit range (e.g. one or two months); index on (user_id, entry_date). |
| URL date validation | Validate `date` param (format and reasonable range); fallback to today on invalid. |
| Theme consistency | Use the same CSS variables in every touched component; avoid one-off colors. |
| Mobile calendar UX | Sheet calendar works on small screens; ensure tap targets and readability. |

## Migration Plan

- **Deploy:** No database migration. Deploy app with new routes/components and theme. Existing "today" behavior is preserved when date = today.
- **Rollback:** Revert app deploy; no data migration to undo.

## Open Questions

- **None.** Optional follow-up: if calendar feels cramped in a sheet, a dedicated `/calendar` page could be added later.
