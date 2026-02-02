## 1. Setup

- [x] 1.1 Add `framer-motion` dependency (e.g. `pnpm add framer-motion`)
- [x] 1.2 Ensure journal editor, calendar sheet, and journal date page are ready for motion components (no structural blockers)

## 2. Editor character motion

- [x] 2.1 Implement a TipTap extension that computes view-only Decorations for newly inserted text (detect inserted ranges from transaction/state)
- [x] 2.2 In the extension, create decorations that wrap inserted character(s) in a Framer Motion span with blur-to-crisp animation (e.g. `initial` blur + opacity, `animate` to crisp, ~100–150 ms)
- [x] 2.3 Remove or expire decorations after animation completes (or short timeout) so wrappers do not accumulate; ensure only “just typed” content is animated
- [x] 2.4 Verify editor `getJSON()` and autosave payload contain no animation wrappers or extra nodes; confirm cursor and selection behavior unchanged

## 3. Calendar motion

- [x] 3.1 Wrap calendar overlay and sheet in Framer Motion; use `AnimatePresence` when `open` is true so the sheet mounts/unmounts with enter/exit animation (e.g. slide up from bottom + fade)
- [x] 3.2 Animate overlay (backdrop) fade in/out in sync with sheet open/close
- [x] 3.3 Add staggered animation for day cells when the calendar opens (e.g. `staggerChildren` on the day grid or cells)
- [x] 3.4 When the user changes month, trigger stagger (or keyed transition) for the new month’s day cells so the grid feels alive on month switch
- [x] 3.5 Keep animations GPU-friendly (transform, opacity); verify no noticeable jank when opening, closing, or changing month

## 4. Journal navigation motion

- [x] 4.1 Add View Transitions API usage for journal date navigation: when the user clicks prev/next or Today, call `document.startViewTransition(() => router.push(...))` when the API is available
- [x] 4.2 Assign a `view-transition-name` (e.g. `journal-sheet`) to the main journal content container so old and new “sheets” are identified
- [x] 4.3 Add CSS for `::view-transition-old(journal-sheet)` and `::view-transition-new(journal-sheet)` to implement a simple paper-style switch (e.g. slide out/in) with optional light motion blur during the transition
- [x] 4.4 Ensure fallback when View Transitions API is absent: normal navigation with no transition and no errors

## 5. Verification

- [ ] 5.1 Manual test: type in the journal editor and confirm each new character has a short blur-to-crisp animation; confirm saved content in DB/network has no animation markup
- [ ] 5.2 Manual test: open and close the calendar and change months; confirm open/close and stagger feel smooth and performant
- [ ] 5.3 Manual test: navigate prev/next day and Today; confirm sheet-style transition (and optional blur) where supported, and normal navigation elsewhere
