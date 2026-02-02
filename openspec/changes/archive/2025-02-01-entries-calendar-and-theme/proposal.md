# Proposal: Entry history, calendar, and calming theme

## Why

Users need to revisit past entries and plan ahead—not only write "today." They also deserve a UI that feels mindful and calming so the app becomes a place they want to return to. This change adds entry history and calendar navigation plus a consistent beige, calming theme across the app.

## What Changes

- **Entry history and navigation**: Users can view previous journal entries and navigate by day (e.g. header day picker or prev/next). The editor shows the entry for the *selected* date, not only today.
- **Calendar**: A calendar (e.g. in header or as a sheet) shows which dates have an entry and which are empty. Users can open the calendar to jump to any date.
- **Backdating and future entries**: Users can go back in time to add or edit a past day's entry, and can open future dates to write reminders or schedule thoughts.
- **Beige, mindful theme**: A single, calming visual system (beige/neutral palette, generous whitespace, smooth interactions) applied across login, signup, header, editor, and calendar so the whole app feels cohesive and calming.
- **Header**: Header includes day navigation (e.g. prev/next day, or "Today") and an option to open the calendar.

## Capabilities

### New Capabilities

- `entry-calendar`: Calendar view showing each date; visual indicator for dates that have an entry vs. no entry. User can select a date to open that day's journal. Supports past and future dates.
- `entry-history-navigation`: Header (or equivalent) provides navigation through days—e.g. previous/next day, "Today" shortcut, and control to open the calendar. Selected date is clearly shown and drives which entry the editor loads.
- `app-theme`: Beige, mindful, calming visual theme applied app-wide (login, signup, layout, header, editor, calendar). Consistent typography, spacing, and subtle motion; no jarring colors or heavy animation.

### Modified Capabilities

- `journal-entry`: Extend from "today only" to "entry for any calendar date." Read and upsert must support a chosen date (not only the current date). One entry per user per calendar day remains; RLS and ownership unchanged.
- `editor-experience`: Editor is bound to the *selected* journal entry (for the chosen date), not only today. Load and autosave target the entry for the selected date. Focus and no-title/silent-save behavior unchanged.

## Impact

- **Code**: New calendar component(s); header updated with day navigation and calendar trigger; routing or state for "selected date"; entry fetch/upsert extended to accept date; theme tokens and styles across pages and components.
- **APIs**: No new external APIs; Supabase usage unchanged except querying/upserting by arbitrary `entry_date`.
- **Dependencies**: Possible calendar UI dependency (e.g. radix calendar, or custom); existing stack (Next.js, TipTap, Supabase, shadcn/Tailwind) unchanged.
- **Systems**: No Supabase schema change required (already one entry per user per day keyed by `entry_date`).
