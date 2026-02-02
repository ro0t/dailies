"use client";

import { getEntryDatesForRange } from "@/lib/entries";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMonthStartEnd(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

function getDaysInMonth(year: number, month: number): (string | null)[] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startPad = first.getDay();
  const days: (string | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(`${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  return days;
}

type CalendarSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function CalendarSheet({ open, onClose }: CalendarSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const today = getTodayDateString();
  const [viewDate, setViewDate] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() + 1 };
  });
  const [entryDates, setEntryDates] = useState<Set<string>>(new Set());

  const { start, end } = getMonthStartEnd(viewDate.year, viewDate.month);

  useEffect(() => {
    if (!open) return;
    getEntryDatesForRange(start, end).then((dates) => setEntryDates(new Set(dates)));
  }, [open, start, end]);

  const handleSelect = useCallback(
    (date: string) => {
      router.push(`/journal/${date}`);
      onClose();
    },
    [router, onClose]
  );

  const goPrevMonth = () =>
    setViewDate((v) => (v.month === 1 ? { year: v.year - 1, month: 12 } : { year: v.year, month: v.month - 1 }));
  const goNextMonth = () =>
    setViewDate((v) => (v.month === 12 ? { year: v.year + 1, month: 1 } : { year: v.year, month: v.month + 1 }));

  if (!open) return null;

  const days = getDaysInMonth(viewDate.year, viewDate.month);
  const monthLabel = new Date(viewDate.year, viewDate.month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-200"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-auto rounded-t-2xl border-t border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-lg transition-transform duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label="Calendar"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-4">
          <h2 className="text-[var(--text-xl)] font-medium text-[var(--theme-text)]">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrevMonth}
              className="rounded-lg p-2.5 text-[var(--theme-muted)] transition-colors duration-150 hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
              aria-label="Previous month"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              type="button"
              onClick={goNextMonth}
              className="rounded-lg p-2.5 text-[var(--theme-muted)] transition-colors duration-150 hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
              aria-label="Next month"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 p-5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2 text-center text-[var(--text-sm)] font-medium text-[var(--theme-muted)]">
              {d}
            </div>
          ))}
          {days.map((date, i) => {
            if (date === null) return <div key={`pad-${i}`} />;
            const hasEntry = entryDates.has(date);
            const isToday = date === today;
            return (
              <button
                key={date}
                type="button"
                onClick={() => handleSelect(date)}
                className={`flex min-h-[3rem] flex-col items-center justify-center rounded-xl py-3 text-[var(--text-base)] transition-colors duration-150 ${
                  isToday
                    ? "bg-[var(--theme-accent)]/20 font-medium text-[var(--theme-accent)]"
                    : "text-[var(--theme-text)] hover:bg-[var(--theme-border)]/50"
                } ${hasEntry ? "ring-1 ring-inset ring-[var(--theme-accent)]/40" : ""}`}
              >
                <span>{new Date(date + "T12:00:00").getDate()}</span>
                {hasEntry && (
                  <span className="mt-1 block h-0.5 w-6 rounded-full bg-[var(--theme-accent)]/70" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
