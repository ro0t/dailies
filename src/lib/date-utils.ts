/** Returns YYYY-MM-DD for today. */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Validates YYYY-MM-DD and returns the string or null if invalid. Reasonable range: 1970–2100. */
export function parseDateParam(date: string | undefined): string | null {
  if (!date || typeof date !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const year = parseInt(y!, 10);
  const month = parseInt(m!, 10);
  const day = parseInt(d!, 10);
  if (year < 1970 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null;
  return `${y}-${m}-${d}`;
}
