"use client";

import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarSheet } from "@/components/calendar-sheet";
import {
  withViewTransition,
  waitForJournalReady,
} from "@/lib/view-transitions";

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
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
      supabase.auth
        .getUser()
        .then(({ data: { user: u } }) => setUser(u ?? null));
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
    <>
      <header className="border-b border-theme-border bg-(--theme-surface)/90 backdrop-blur-sm transition-colors">
        <div className="flex flex-col max-w-2xl mx-auto gap-4">
          <div className="shrink-0 text-theme-text mt-6">
            <svg
              width="90"
              viewBox="0 0 237 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.52 2.52C39.732 2.52 52.08 15.288 52.08 31.92C52.08 48.552 39.732 61.32 23.52 61.32H0V2.52H23.52ZM23.52 48.384C32.76 48.384 39.144 42 39.144 31.92C39.144 21.84 32.76 15.456 23.52 15.456H13.44V48.384H23.52Z"
                fill="currentColor"
              />
              <path
                d="M86.3487 19.32H98.9487V61.32H86.3487V57.372C83.5767 60.564 79.4607 62.496 73.8327 62.496C62.8287 62.496 53.7567 52.836 53.7567 40.32C53.7567 27.804 62.8287 18.144 73.8327 18.144C79.4607 18.144 83.5767 20.076 86.3487 23.268V19.32ZM76.3527 50.568C82.1487 50.568 86.3487 46.62 86.3487 40.32C86.3487 34.02 82.1487 30.072 76.3527 30.072C70.5567 30.072 66.3567 34.02 66.3567 40.32C66.3567 46.62 70.5567 50.568 76.3527 50.568Z"
                fill="currentColor"
              />
              <path
                d="M111.133 15.624C107.017 15.624 103.573 12.18 103.573 8.064C103.573 3.948 107.017 0.503999 111.133 0.503999C115.249 0.503999 118.693 3.948 118.693 8.064C118.693 12.18 115.249 15.624 111.133 15.624ZM104.833 61.32V19.32H117.433V61.32H104.833Z"
                fill="currentColor"
              />
              <path
                d="M123.293 61.32V0H135.893V61.32H123.293Z"
                fill="currentColor"
              />
              <path
                d="M148.053 15.624C143.937 15.624 140.493 12.18 140.493 8.064C140.493 3.948 143.937 0.503999 148.053 0.503999C152.169 0.503999 155.613 3.948 155.613 8.064C155.613 12.18 152.169 15.624 148.053 15.624ZM141.753 61.32V19.32H154.353V61.32H141.753Z"
                fill="currentColor"
              />
              <path
                d="M171.47 45.36C173.066 49.728 176.93 51.24 181.55 51.24C184.994 51.24 187.934 49.896 189.614 48.048L199.694 53.844C195.578 59.556 189.362 62.496 181.382 62.496C167.018 62.496 158.114 52.836 158.114 40.32C158.114 27.804 167.186 18.144 180.458 18.144C192.722 18.144 201.794 27.636 201.794 40.32C201.794 42.084 201.626 43.764 201.29 45.36H171.47ZM171.218 35.952H189.278C187.934 31.08 184.154 29.316 180.374 29.316C175.586 29.316 172.394 31.668 171.218 35.952Z"
                fill="currentColor"
              />
              <path
                d="M215.868 31.584C215.868 36.372 236.532 33.18 236.532 48.72C236.532 58.38 228.132 62.496 219.06 62.496C210.66 62.496 204.276 59.304 201 52.5L211.92 46.284C213.012 49.476 215.364 51.24 219.06 51.24C222.084 51.24 223.596 50.316 223.596 48.636C223.596 44.016 202.932 46.452 202.932 31.92C202.932 22.764 210.66 18.144 219.396 18.144C226.2 18.144 232.248 21.168 235.776 27.132L225.024 32.928C223.848 30.744 222.168 29.232 219.396 29.232C217.212 29.232 215.868 30.072 215.868 31.584Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between gap-6 py-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {selectedDate && (
                <nav
                  className="flex min-w-0 flex-1 items-center gap-3"
                  aria-label="Day navigation"
                >
                  <div className="flex items-center gap-1 rounded-lg border border-theme-border bg-[var(--theme-bg)]/50 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        const targetDate = addDays(selectedDate, -1);
                        withViewTransition(async () => {
                          router.push(`/journal/${targetDate}`);
                          await waitForJournalReady(targetDate);
                        });
                      }}
                      className="rounded-md p-2 text-theme-muted transition-colors hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
                      aria-label="Previous day"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const targetDate = getTodayDateString();
                        if (selectedDate === targetDate) return;
                        withViewTransition(async () => {
                          router.push(`/journal/${targetDate}`);
                          await waitForJournalReady(targetDate);
                        });
                      }}
                      className="rounded-md px-3 py-2 text-[var(--text-base)] font-medium text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-border)]/50"
                    >
                      Go to today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const targetDate = addDays(selectedDate, 1);
                        withViewTransition(async () => {
                          router.push(`/journal/${targetDate}`);
                          await waitForJournalReady(targetDate);
                        });
                      }}
                      className="rounded-md p-2 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
                      aria-label="Next day"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
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
        </div>
      </header>
      <CalendarSheet
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />
    </>
  );
}
