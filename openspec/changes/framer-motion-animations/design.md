# Design: Framer Motion animations (next-gen, subtle and performant)

## Context

The app uses a TipTap-based journal editor (`JournalEditor`), a bottom sheet calendar (`CalendarSheet`), and Next.js App Router navigation for journal dates (`/journal/[date]`). Prev/next day and Today use `router.push()`, so each date change is a full server round-trip and remount. There is no Framer Motion dependency yet. The proposal and specs require: (1) per-character blur-to-crisp in the editor, view-only (no persistence of wrappers); (2) calendar open/close and month transitions with staggered days; (3) paper-style sheet switch when navigating between days, with optional light motion blur.

## Goals / Non-Goals

**Goals:**

- Add Framer Motion and use it for all new motion (editor, calendar, journal navigation).
- Implement editor character motion via view-only wrapping (TipTap document unchanged; no animation in stored JSON).
- Implement calendar open/close, month transition, and staggered day cells with subtle, performant animations.
- Implement journal day navigation with a simple “paper switch” (outgoing + incoming sheet); optional light motion blur; no book/page-flip metaphor.
- Keep all motion GPU-friendly (transform, opacity, filter where appropriate), subtle, and jank-free.

**Non-Goals:**

- Changing stored content format, autosave behavior, or editor schema.
- Multiple animation “themes” or user-configurable motion.
- Animations on login, signup, or other non-journal screens (only editor, calendar, journal date navigation).

## Decisions

### Dependency: Framer Motion

- **Choice:** Add `framer-motion` as the single animation library for this change. Use `motion` components and `AnimatePresence` for enter/exit and staggered layouts.
- **Rationale:** Matches proposal; well-supported, React-friendly, and good for declarative layout/transition animations. Use `transform` and `opacity` (and sparingly `filter` for blur) so the runtime can optimize on the GPU.
- **Alternatives considered:** CSS-only (harder for stagger and coordinated sheet switch); React Spring (viable but proposal specified Framer Motion).

### Editor character motion: view-only decorations

- **Choice:** Use ProseMirror/TipTap **Decorations** to wrap newly inserted text in the view. For each character (or small run) that was just inserted, add a Decoration that renders a wrapper (e.g. `motion.span`) with `initial={{ filter: 'blur(4px)', opacity: 0.8 }}` and `animate={{ filter: 'blur(0px)', opacity: 1 }}` with a short duration (~100–150 ms). Decorations are view-only and never appear in `getJSON()`, so stored content stays plain TipTap JSON. Detect inserted ranges from the editor state/transaction and clear decorations after the animation completes (or after a short timeout) so we don’t leave wrappers on old text.
- **Rationale:** Spec requires “wrap each character” for the effect but “do not save this in the database”; Decorations are the standard way to add view-only markup in ProseMirror. We avoid adding a mark or node that would be serialized.
- **Alternatives considered:** A transient mark (TipTap marks are part of the document and would serialize); wrapping at the NodeView level for text (would change structure and complicate storage); CSS-only (no way to target “only the last typed character” without view-only decoration or similar).

### Editor: how to detect “newly typed” and cleanup

- **Choice:** On each transaction, compare the previous and current doc to find inserted text (e.g. via `tr.getMeta('addedRange')` or mapping the selection; or track “last known doc” and diff). Create decorations for those ranges. Store decoration keys or positions in a ref; after a short delay (e.g. 150–200 ms) remove those decorations so only the most recent typing is animated. Use a single TipTap extension that provides `decorations(state)` and updates from the transaction so the view stays in sync.
- **Rationale:** Keeps “only while writing” and avoids animating on load or when content is set programmatically. Short timeout keeps the DOM clean and avoids leaving many wrapper nodes.
- **Alternatives considered:** Animating every character forever (would clutter DOM and hurt performance); only animating the last character (simpler but spec says “each character”).

### Calendar: open/close and stagger

- **Choice:** Wrap the calendar overlay and sheet in Framer Motion. Use `AnimatePresence` when `open` is true so the sheet mounts/unmounts with animation. Sheet: `motion.div` with `initial={{ y: '100%', opacity: 0 }}`, `animate={{ y: 0, opacity: 1 }}`, `exit={{ y: '100%', opacity: 0 }}`, and a short duration (e.g. 200–250 ms). Overlay: fade in/out. For day cells, wrap the grid (or each cell) in `motion.div` with `variants` and `staggerChildren` so days appear with a small delay (e.g. 20–30 ms per cell or per row). When the calendar is already open and the user changes month, re-run stagger for the new month’s days (e.g. by keying the day list with `monthLabel` or `viewDate`).
- **Rationale:** Matches spec (open/close animated; month transition; stagger on open and on month change). Bottom sheet convention (slide up) is familiar; stagger is a single Framer Motion pattern.
- **Alternatives considered:** No stagger on month change (spec asks for stagger when “you switch months”); slide left/right for month (possible but stagger is simpler and keeps one grid).

### Calendar: month transition

- **Choice:** When the user clicks prev/next month, update `viewDate` state as today. Animate the **day grid** by giving it a key like `key={${viewDate.year}-${viewDate.month}}` and using `AnimatePresence` with a short exit/enter (e.g. old grid slides out slightly, new grid slides in with stagger). Alternatively, keep one grid and only animate the day cells with stagger (no slide of the whole grid). Prefer the latter for simplicity: one grid, on month change we just re-render the new days and run stagger again.
- **Rationale:** Stagger on month change satisfies “when you switch months”; we don’t need a full slide of the grid if stagger gives enough sense of transition.
- **Implementation note:** If the grid is keyed by month, `AnimatePresence` can animate the old month out and the new month in (e.g. opacity or x) while the new month’s days use staggerChildren.

### Journal navigation: paper sheet switch

- **Choice:** Use the **View Transitions API** (where available) to run a custom transition on navigation. On prev/next/Today click, call `document.startViewTransition(() => router.push(...))`. Assign `view-transition-name` (e.g. `journal-sheet`) to the main content container on the journal page so the old and new “sheets” are identified; use CSS `::view-transition-old(journal-sheet)` and `::view-transition-new(journal-sheet)` to apply a short slide + optional blur (e.g. `filter: blur(2px)` during the transition). Fallback when the API is absent: normal navigation, no transition. Optionally wrap the router call in a small client helper so all journal date navigations go through one path.
- **Rationale:** Achieves “outgoing sheet” and “incoming sheet” with light motion blur without restructuring the app. We keep server-driven `/journal/[date]` and don’t need client-side entry fetching for the transition. View Transitions are well-supported in modern Chromium; fallback is acceptable.
- **Alternatives considered:** Client-side “two-slot” sheet switch (fetch next/prev entry on client, animate, then update URL): full control but larger refactor and duplicate data loading. Framer Motion `AnimatePresence` on the page: would require a client wrapper that controls which “sheet” is visible and when to update the route, i.e. the same two-slot idea.

### Motion blur and performance

- **Choice:** Use `filter: blur()` only where needed (character enter, optional sheet transition). Keep blur duration short and prefer `transform` and `opacity` for calendar and stagger. Use `will-change` sparingly (e.g. only during the short animation) to avoid layer explosion.
- **Rationale:** Blur can be costly; limiting it to small areas and short durations keeps the “magical” feel without jank. Spec says “light” motion blur for the sheet switch.

## Risks / Trade-offs

- **View Transitions API support:** Not available in all browsers. Mitigation: feature-detect and fall back to instant navigation; no errors.
- **TipTap decoration performance:** Many decorations (e.g. one per character on fast typing) could stress the view. Mitigation: batch or limit to the last N characters, and remove decorations quickly after animation.
- **Calendar stagger on large viewports:** Many cells animating could be heavy. Mitigation: use a modest stagger delay and short duration; prefer opacity/transform only for the grid.
- **Framer Motion bundle size:** Adds to client JS. Mitigation: acceptable for the scope; tree-shake where possible.

## Migration Plan

1. **Add Framer Motion:** `pnpm add framer-motion` (or equivalent). No feature flags.
2. **Editor:** Implement a TipTap extension that adds view-only Decorations for newly inserted text, wrapping in `motion.span` with blur-to-crisp; ensure `getJSON()` and autosave are unchanged.
3. **Calendar:** Refactor `CalendarSheet` to use `AnimatePresence` and `motion` for overlay and sheet; add stagger for day cells on open and on month change; optionally key month grid for a light month transition.
4. **Journal navigation:** Add a small client-side wrapper or hook that uses `document.startViewTransition` on journal date navigation when available; add CSS for `journal-sheet` view-transition names and optional blur. Fallback: normal navigation.
5. **Verify:** Type in editor (blur-to-crisp, no wrapper in saved JSON); open/close calendar and change month (smooth, staggered); prev/next day (sheet-like transition where supported). Rollback: remove Framer Motion usage and View Transition CSS; revert to current behavior.

## Open Questions

- **Stagger granularity:** Stagger per cell vs per row for the calendar—per row is fewer elements animating; per cell is more “alive.” Decide during implementation based on feel and performance.
- **View Transitions + App Router:** Confirm that `startViewTransition` works correctly with Next.js client navigation (e.g. no double paint or flash). If problematic, consider the client-side two-slot sheet switch as a fallback design.
