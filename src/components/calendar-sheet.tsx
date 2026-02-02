"use client";

import { getEntryDatesForRange } from "@/lib/entries";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LOCALE = "is-IS";

/** Today in local date (YYYY-MM-DD). */
function getTodayDateString(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(t.getDate()).padStart(2, "0")}`;
}

function getMonthStartEnd(
  year: number,
  month: number
): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(
    lastDay
  ).padStart(2, "0")}`;
  return { start, end };
}

/** Monday = 0, Sunday = 6 (is-IS week start). */
function getDayIndexMondayFirst(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
}

function getDaysInMonth(year: number, month: number): (string | null)[] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startPad = getDayIndexMondayFirst(first);
  const days: (string | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(
      `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );
  }
  return days;
}

function getWeekdayShortLabels(): string[] {
  const base = new Date(2024, 0, 1); // Mon 1 Jan 2024
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString(LOCALE, { weekday: "short" });
  });
}

type CalendarSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function CalendarSheet({ open, onClose }: CalendarSheetProps) {
  const router = useRouter();
  const today = getTodayDateString();
  const [viewDate, setViewDate] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() + 1 };
  });
  const [entryDates, setEntryDates] = useState<Set<string>>(new Set());
  const weekdayLabels = useMemo(() => getWeekdayShortLabels(), []);

  const { start, end } = getMonthStartEnd(viewDate.year, viewDate.month);

  useEffect(() => {
    if (!open) return;
    const t = new Date();
    setViewDate({ year: t.getFullYear(), month: t.getMonth() + 1 });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    getEntryDatesForRange(start, end).then((dates) =>
      setEntryDates(new Set(dates))
    );
  }, [open, start, end]);

  const handleSelect = useCallback(
    (date: string) => {
      router.push(`/journal/${date}`);
      onClose();
    },
    [router, onClose]
  );

  const goPrevMonth = () =>
    setViewDate((v) =>
      v.month === 1
        ? { year: v.year - 1, month: 12 }
        : { year: v.year, month: v.month - 1 }
    );
  const goNextMonth = () =>
    setViewDate((v) =>
      v.month === 12
        ? { year: v.year + 1, month: 1 }
        : { year: v.year, month: v.month + 1 }
    );

  const days = getDaysInMonth(viewDate.year, viewDate.month);
  const monthLabel = new Date(
    viewDate.year,
    viewDate.month - 1
  ).toLocaleDateString(LOCALE, {
    month: "long",
    year: "numeric",
  });
  const monthKey = `${viewDate.year}-${viewDate.month}`;

  const overlayTransition = { duration: 0.2, ease: "easeOut" as const };
  const sheetTransition = { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.025, delayChildren: 0.02 },
    }),
  };
  const staggerItem = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/20"
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-auto rounded-t-2xl border-t border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Dagatal"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={sheetTransition}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-4">
              <h2 className="text-[var(--text-xl)] font-medium text-[var(--theme-text)]">
                {monthLabel}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2.5 text-[var(--theme-muted)] transition-colors duration-150 hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
                  aria-label="Loka"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goPrevMonth}
                  className="rounded-lg p-2.5 text-[var(--theme-muted)] transition-colors duration-150 hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
                  aria-label="Fyrri mánuður"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNextMonth}
                  className="rounded-lg p-2.5 text-[var(--theme-muted)] transition-colors duration-150 hover:bg-[var(--theme-border)]/50 hover:text-[var(--theme-text)]"
                  aria-label="Næsti mánuður"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            <motion.div
              key={monthKey}
              className="grid grid-cols-7 gap-2 p-5"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {weekdayLabels.map((label) => (
                <div
                  key={label}
                  className="py-2 text-center text-[var(--text-sm)] font-medium text-[var(--theme-muted)]"
                >
                  {label}
                </div>
              ))}
              {days.map((date, i) => {
                if (date === null) return <motion.div key={`pad-${i}`} variants={staggerItem} />;
                const hasEntry = entryDates.has(date);
                const isToday = date === today;
                return (
                  <motion.button
                    key={date}
                    type="button"
                    onClick={() => handleSelect(date)}
                    variants={staggerItem}
                    className={`flex min-h-[3rem] flex-col items-center justify-center rounded-xl py-3 text-[var(--text-base)] transition-colors duration-150 ${
                      isToday
                        ? "bg-[var(--theme-accent)]/20 font-medium text-[var(--theme-accent)]"
                        : "text-[var(--theme-text)] hover:bg-[var(--theme-border)]/50"
                    } ${
                      hasEntry
                        ? "ring-1 ring-inset ring-[var(--theme-accent)]/40"
                        : ""
                    }`}
                  >
                    <span>{new Date(date + "T12:00:00").getDate()}</span>
                    {hasEntry && (
                      <span
                        className="mt-1 block h-0.5 w-6 rounded-full bg-[var(--theme-accent)]/70"
                        aria-hidden
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
