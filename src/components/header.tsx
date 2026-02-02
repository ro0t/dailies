"use client";

import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarSheet } from "@/components/calendar-sheet";

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr: string): string {
  const today = getTodayDateString();
  if (dateStr === today) return "Today";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function Header() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  const dateMatch = pathname?.match(/^\/journal\/(\d{4}-\d{2}-\d{2})$/);
  const selectedDate = dateMatch ? dateMatch[1] : null;

  if (!user) return null;

  return (
    <header className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/90 backdrop-blur-sm transition-colors">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-6 px-5 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="shrink-0 text-[var(--text-lg)] font-medium text-[var(--theme-text)]">Dailies</span>
          {selectedDate && (
            <nav className="flex min-w-0 flex-1 items-center gap-3" aria-label="Day navigation">
              <div className="flex items-center gap-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)]/50 p-1">
                <button
                  type="button"
                  onClick={() => router.push(`/journal/${addDays(selectedDate, -1)}`)}
                  className="rounded-md p-2 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
                  aria-label="Previous day"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/journal/${getTodayDateString()}`)}
                  className="rounded-md px-3 py-2 text-[var(--text-base)] font-medium text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-border)]/50"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/journal/${addDays(selectedDate, 1)}`)}
                  className="rounded-md p-2 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
                  aria-label="Next day"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="min-w-0 flex-1 truncate rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)]/50 px-4 py-2.5 text-left text-[var(--text-base)] font-medium text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-border)]/30"
                title={selectedDate}
                aria-label="Open calendar to pick a day"
              >
                {formatDateLabel(selectedDate)}
              </button>
            </nav>
          )}
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="shrink-0 text-[var(--text-base)] text-[var(--theme-muted)] transition-colors duration-150 hover:text-[var(--theme-text)]"
        >
          Sign out
        </button>
      </div>
      <CalendarSheet open={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </header>
  );
}
