# Proposal: First version of Dailies

## Why

People need a place to write daily thoughts with zero friction—no signup friction, no "title required," no save button. This change delivers the first usable version of Dailies: a minimal personal journal where opening the app means you can start writing immediately. We're doing it now to validate the core loop (sign in → write → autosave) before adding sharing or extra features.

## What Changes

- **Authentication**: Sign in / sign up via Supabase Auth. No custom auth logic.
- **Single writing screen**: One primary view—the editor. No dashboard, no entry list in v1; user lands in the editor and writes.
- **TipTap editor**: Rich-text editor for journal content. Content stored as JSON. No markdown conversion.
- **Autosave**: Entries save automatically and silently. No explicit save action.
- **Journal entry model**: One entry per "moment" (we can start with one entry per day or one per session; design will clarify). Fields: `id`, `user_id`, `content_json`, `created_at`. Private by default.
- **Supabase backend**: Postgres for entries, Row Level Security so each user only sees their own data.
- **UI**: Minimal shell (layout, editor area) using shadcn/ui and Tailwind. Neutral, calm styling. No settings screen in v1.

## Capabilities

### New Capabilities

- `user-auth`: Sign in, sign up, and sign out via Supabase Auth. All app routes require an authenticated user.
- `journal-entry`: Create, read, and update journal entries. One entry per user per day (or per session—design will pin this). Autosave from editor to Supabase. RLS enforces ownership.
- `editor-experience`: TipTap editor wired to the active journal entry. Silent autosave. Cursor in editor on load. No title field, no save button.

### Modified Capabilities

- *(None—no existing specs.)*

## Impact

- **Code**: New Supabase client and env vars; auth middleware or layout guard; editor page(s); API or server actions for entry read/write; RLS policies.
- **APIs**: Supabase Auth and Postgres only. No new public API.
- **Dependencies**: Supabase JS client, TipTap (and required extensions), existing Next.js / shadcn / Tailwind stack.
- **Systems**: Supabase project (Auth + Postgres) and env configuration (e.g. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
