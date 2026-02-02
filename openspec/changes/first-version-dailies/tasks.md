## 1. Setup

- [x] 1.1 Add Supabase JS client dependency and create Supabase client helpers (browser + server for Next.js)
- [x] 1.2 Add TipTap and required extensions to package.json
- [x] 1.3 Add env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) and document in .env.example

## 2. Database

- [x] 2.1 Create journal_entries table (id, user_id, entry_date, content_json, created_at, updated_at, is_unlocked)
- [x] 2.2 Add unique constraint on (user_id, entry_date)
- [x] 2.3 Enable RLS on journal_entries and add policies: SELECT, INSERT, UPDATE, DELETE where user_id = auth.uid()

## 3. Auth

- [x] 3.1 Create sign-in page using Supabase Auth
- [x] 3.2 Create sign-up page using Supabase Auth
- [x] 3.3 Add auth middleware or layout guard to protect editor route; redirect unauthenticated to sign-in
- [x] 3.4 Redirect authenticated user from sign-in/sign-up to editor

## 4. Journal entry data layer

- [x] 4.1 Server action or API to fetch today's entry for current user (create row if missing)
- [x] 4.2 Server action or API to upsert today's entry (content_json)

## 5. Editor page and TipTap

- [x] 5.1 Create editor route (e.g. / or /journal) as protected page
- [x] 5.2 Implement TipTap editor component that reads/writes TipTap JSON
- [x] 5.3 Load today's entry on editor mount and set initial content in editor
- [x] 5.4 Focus editor on load (cursor in editor, no extra click)

## 6. Autosave

- [x] 6.1 Debounce editor content changes (e.g. 1–2 s after last change)
- [x] 6.2 On debounce fire, upsert current TipTap JSON to today's entry (silent; no toast or save indicator)

## 7. UI and layout

- [x] 7.1 Minimal layout shell with shadcn/ui and Tailwind; neutral, calm styling
- [x] 7.2 Ensure editor screen has no title field and no save button
- [x] 7.3 Add sign-out control (e.g. in layout or header) for authenticated users
