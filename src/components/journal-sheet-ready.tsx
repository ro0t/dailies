"use client";

import { useEffect, type ReactNode } from "react";
import { dispatchJournalReady } from "@/lib/view-transitions";

type JournalSheetReadyProps = {
  date: string;
  children: ReactNode;
};

/**
 * Wraps the journal sheet content and dispatches "journal-entry-ready" when
 * the entry for the given date is shown. View transitions wait for this
 * so the "new" snapshot contains the actual new entry, not a copy of the old.
 */
export function JournalSheetReady({ date, children }: JournalSheetReadyProps) {
  useEffect(() => {
    dispatchJournalReady(date);
  }, [date]);
  return <>{children}</>;
}
