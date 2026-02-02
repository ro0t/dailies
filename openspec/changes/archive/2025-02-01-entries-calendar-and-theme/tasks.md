## 1. Theme

- [x] 1.1 Add beige/neutral CSS variables to globals.css (--theme-bg, --theme-surface, --theme-text, --theme-muted, --theme-accent, --theme-border)
- [x] 1.2 Apply theme variables to layout, header, and existing editor page
- [x] 1.3 Apply theme variables to login and signup pages
- [x] 1.4 Add subtle transitions for focus/hover where appropriate (no heavy animation)

## 2. Entry data layer

- [x] 2.1 Add getEntryForDate(date: string) server action (YYYY-MM-DD); create entry if missing
- [x] 2.2 Add upsertEntryForDate(date: string, contentJson) server action
- [x] 2.3 Add getEntryDatesForRange(start: string, end: string) server action returning entry_date list for calendar indicators

## 3. Routing and selected date

- [x] 3.1 Add date to journal URL (e.g. /journal/[date] with date YYYY-MM-DD, or /?date=YYYY-MM-DD); default to today when absent or invalid
- [x] 3.2 Validate date param (format and reasonable range); fallback to today on invalid

## 4. Header day navigation

- [x] 4.1 Add previous-day and next-day controls to header; navigate to that date (update URL and load entry)
- [x] 4.2 Add "Today" control to header; navigate to today's date
- [x] 4.3 Display selected date clearly in header (e.g. formatted date label)

## 5. Calendar

- [x] 5.1 Add calendar UI component (e.g. shadcn Calendar); show month grid, support past/future months
- [x] 5.2 Fetch entry dates for visible month(s) and show indicator (e.g. dot) on dates that have an entry
- [x] 5.3 Show calendar in sheet or popover opened from header (e.g. calendar button or date click)
- [x] 5.4 On date select in calendar, navigate to that date (update URL, close calendar, load entry)

## 6. Editor for selected date

- [x] 6.1 Editor page reads selected date from URL; load entry for that date via getEntryForDate
- [x] 6.2 JournalEditor receives initialContent and selectedDate; autosave calls upsertEntryForDate(selectedDate, content)
- [x] 6.3 When selected date changes (nav or calendar), editor reloads entry for new date and focuses

## 7. Theme polish

- [x] 7.1 Apply theme variables to calendar component and any new UI (sheet/popover)
- [x] 7.2 Ensure generous whitespace and consistent typography app-wide
