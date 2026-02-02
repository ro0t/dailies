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

export async function getEntryForDate(
  date: string
): Promise<JournalEntry | null> {
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

export async function upsertEntryForDate(
  date: string,
  contentJson: unknown
): Promise<void> {
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

/** True if TipTap-style content_json has at least one non-empty text node. */
function hasTextInContent(content: unknown): boolean {
  if (!content || typeof content !== "object") return false;
  const obj = content as Record<string, unknown>;
  if (
    obj.type === "text" &&
    typeof obj.text === "string" &&
    obj.text.trim().length > 0
  ) {
    return true;
  }
  const children = obj.content;
  if (Array.isArray(children)) {
    return children.some((child) => hasTextInContent(child));
  }
  return false;
}

/** Returns list of entry_date (YYYY-MM-DD) for the current user in the given range (inclusive). Only includes entries that have some text in content. */
export async function getEntryDatesForRange(
  start: string,
  end: string
): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("journal_entries")
    .select("entry_date, content_json")
    .eq("user_id", user.id)
    .gte("entry_date", start)
    .lte("entry_date", end)
    .order("entry_date", { ascending: true });

  if (!data) return [];
  return data
    .filter((row) => hasTextInContent(row.content_json))
    .map((row) => String(row.entry_date));
}
