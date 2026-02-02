"use client";

type StartViewTransition = (callback: () => void | Promise<void>) => { ready: Promise<void>; finished: Promise<void> };

const JOURNAL_READY_EVENT = "journal-entry-ready";
const JOURNAL_READY_TIMEOUT_MS = 5000;

/**
 * Resolves when the journal page has rendered the entry for the given date.
 * Used so the View Transition captures the new content, not a copy of the old.
 */
export function waitForJournalReady(date: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener(JOURNAL_READY_EVENT, handler);
      resolve();
    }, JOURNAL_READY_TIMEOUT_MS);
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ date: string }>).detail?.date;
      if (d === date) {
        clearTimeout(timeout);
        window.removeEventListener(JOURNAL_READY_EVENT, handler);
        resolve();
      }
    };
    window.addEventListener(JOURNAL_READY_EVENT, handler);
  });
}

export function dispatchJournalReady(date: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(JOURNAL_READY_EVENT, { detail: { date } })
  );
}

/**
 * Run a callback, wrapping it in View Transitions API when available
 * so the browser can animate the change. Fallback: run callback immediately.
 * If the callback returns a Promise, the transition captures after it resolves.
 */
export function withViewTransition(callback: () => void | Promise<void>): void {
  if (typeof document === "undefined") {
    void Promise.resolve(callback());
    return;
  }
  const doc = document as Document & { startViewTransition?: StartViewTransition };
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(callback);
  } else {
    void Promise.resolve(callback());
  }
}
