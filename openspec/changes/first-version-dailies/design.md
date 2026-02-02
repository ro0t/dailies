# Design: First version of Dailies

## Context

Dailies is a greenfield personal journal. The proposal defines the first version: sign in, one writing screen, TipTap editor, silent autosave, and Supabase-backed storage with RLS. The codebase is a minimal Next.js App Router app with TypeScript and Tailwind; we are adding Supabase (Auth + Postgres) and TipTap. Constraints from project config: Supabase Auth only, TipTap with JSON storage, shadcn/ui, neutral/calm UI, no custom auth logic, RLS for all data access.

## Goals / Non-Goals

**Goals:**

- Authenticate users via Supabase Auth and protect app routes.
- One primary screen: the editor. User lands there and can write immediately.
- One journal entry per user per calendar day; create or load "today's" entry and autosave.
- TipTap editor bound to that entry; content stored as JSON; silent, debounced autosave.
- Supabase Postgres for persistence; RLS so each user only sees their own entries.
- Minimal UI shell (layout + editor) with shadcn/ui and calm styling.

**Non-Goals (v1):**

- Entry list, dashboard, or navigation between past days.
- Sharing, public links, or `is_unlocked` behavior (column can exist for future use).
- Settings, themes, or markdown export.
- Version history or conflict resolution for concurrent edits.

## Decisions

### 1. Entry granularity: one per user per calendar day

- **Choice:** One row per user per calendar day. "Today's" entry is identified by `(user_id, entry_date)` where `entry_date` is the calendar date (e.g. `DATE` or `date(created_at)`).
- **Rationale:** "Dailies" implies daily; one-per-day keeps the model simple and matches the product name. Explicit `entry_date` makes "load today's entry" and "create if missing" straightforward.
- **Alternatives considered:** One entry per session (abandoned—harder to reason about "today"); free-form multiple entries per day (deferred—adds UI and scope).

### 2. Auth and routing

- **Choice:** Supabase Auth only. Middleware (or root layout) checks session; unauthenticated users are redirected to a sign-in/sign-up page; authenticated users hitting that page are redirected to the editor. All data access uses the Supabase client with the session so RLS applies.
- **Rationale:** Config forbids custom auth; Supabase Auth is the single source of truth. Middleware keeps protection in one place.
- **Alternatives considered:** Per-route checks only (rejected—easy to miss); separate auth provider (rejected—unnecessary with Supabase).

### 3. Editor and autosave

- **Choice:** TipTap editor on the client. Content stored as TipTap JSON. Autosave: debounce (e.g. 1–2 s after last change), then upsert current document to Supabase (insert or update today's row). No save button, no toast, no loading overlay on save.
- **Rationale:** Config requires TipTap and JSON; silent autosave matches "zero friction." Debounce reduces write volume; upsert keeps "one entry per day" simple.
- **Alternatives considered:** Save on blur only (rejected—risk of loss on crash); markdown (rejected—config says JSON).

### 4. Data model and RLS

- **Choice:** Table `journal_entries`: `id` (uuid, PK), `user_id` (uuid, FK to auth.users), `entry_date` (date, not null), `content_json` (jsonb), `created_at`, `updated_at`. Unique constraint on `(user_id, entry_date)`. Optional `is_unlocked` (boolean, default false) for future sharing. RLS: all operations restricted to `user_id = auth.uid()`.
- **Rationale:** Matches proposal and config; unique on (user_id, entry_date) enforces one-per-day and simplifies upsert. RLS is the only enforcement—no reliance on client filtering.

### 5. App structure (Next.js)

- **Choice:** App Router. Public routes: e.g. `/login` (or single `/auth` with sign-in/sign-up). Protected route: `/` (or `/journal`) as the editor page. Server components where possible (e.g. layout, loading today's entry); client component for TipTap and autosave logic. Supabase client created via cookies/server for SSR and via browser client for client components, following Supabase Next.js guidance.
- **Rationale:** Config prefers server components; editor must be client for TipTap and debounce. Single editor route keeps v1 scope minimal.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| Autosave fails (network/offline) | Debounced save only; no retry queue in v1. User can refresh to retry. Future: offline queue or indicator. |
| Multiple tabs same user | Last write wins; no conflict merge in v1. Acceptable for single-user journal. |
| RLS misconfiguration | Test with multiple test users; deny access to each other's rows. |
| TipTap JSON schema drift | Store opaque JSON; no strict schema in DB. Document minimal expected shape if we ever migrate. |

## Migration Plan

- **Initial deploy (no existing data):** Create Supabase project; run migration for `journal_entries` and RLS policies. Set env vars in host (Vercel/local). Deploy Next.js app. No rollback of data needed; if rollback, redeploy previous app version and fix forward.
- **Rollback:** Revert app deployment; DB can stay. No destructive migrations in v1.

## Open Questions

- **None for v1.** Entry list and "pick a day" can be designed when we add that capability.
