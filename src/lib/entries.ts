"use server";

import { createClient } from "@/lib/supabase/server";
import { getTodayDateString } from "@/lib/date-utils";

export type JournalEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  content_json: unknown;
  created_at: string;
  updated_at: string;
  is_unlocked: boolean;
};

export async function getTodayEntry(): Promise<JournalEntry | null> {
  return getEntryForDate(getTodayDateString());
}

export async function getEntryForDate(date: string): Promise<JournalEntry | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("entry_date", date)
    .single();

  if (existing) return existing as JournalEntry;

  const { data: inserted, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      entry_date: date,
      content_json: {},
    })
    .select()
    .single();

  if (error) throw error;
  return inserted as JournalEntry;
}

export async function upsertTodayEntry(contentJson: unknown): Promise<void> {
  return upsertEntryForDate(getTodayDateString(), contentJson);
}

export async function upsertEntryForDate(date: string, contentJson: unknown): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("journal_entries").upsert(
    {
      user_id: user.id,
      entry_date: date,
      content_json: contentJson,
    },
    {
      onConflict: "user_id,entry_date",
    }
  );
}

/** Returns list of entry_date (YYYY-MM-DD) for the current user in the given range (inclusive). */
export async function getEntryDatesForRange(start: string, end: string): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("journal_entries")
    .select("entry_date")
    .eq("user_id", user.id)
    .gte("entry_date", start)
    .lte("entry_date", end)
    .order("entry_date", { ascending: true });

  return (data ?? []).map((row) => String(row.entry_date));
}
