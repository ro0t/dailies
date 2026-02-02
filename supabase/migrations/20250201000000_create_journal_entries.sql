-- journal_entries: one row per user per calendar day
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  content_json jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_unlocked boolean not null default false,
  unique (user_id, entry_date)
);

-- RLS
alter table public.journal_entries enable row level security;

create policy "Users can select own entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.journal_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger journal_entries_updated_at
  before update on public.journal_entries
  for each row execute function public.set_updated_at();
