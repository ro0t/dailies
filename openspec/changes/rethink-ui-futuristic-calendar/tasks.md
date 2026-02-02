## 1. Typography

- [x] 1.1 Add literature-style Google Font (e.g. Literata or Crimson Pro) in layout.tsx via next/font/google and set CSS variable (e.g. --font-primary)
- [x] 1.2 Extend globals.css with type scale variables (e.g. --text-base 1.125rem, --text-lg, --text-xl) and apply larger base size to body
- [x] 1.3 Wire font variable and scale into @theme in globals.css; switch body and base components to use the new font and scale
- [x] 1.4 Apply new typography to login and signup pages so they use the same font and scale

## 2. Header and navigation

- [x] 2.1 Make the current date label the primary affordance: tappable to open the calendar (single gesture to pick a day)
- [x] 2.2 Group prev/next day and Today into one clear cluster; restyle with new type scale and spacing
- [x] 2.3 Restyle header with new typography and spacing so controls feel intentional and consistent with rethought UI

## 3. Calendar

- [x] 3.1 Update calendar-sheet.tsx grid: larger, breathable date cells and weekday labels; clear month/year hierarchy
- [x] 3.2 Change entry indicator to feel part of the date (e.g. soft fill or underline) instead of a tiny dot
- [x] 3.3 Ensure comfortable tap targets and sufficient spacing; apply new typography to calendar
- [x] 3.4 Add subtle transition for month navigation so it feels smooth and intentional

## 4. Editor and consistency

- [x] 4.1 Apply same font and type scale to TipTap content and editor chrome (globals.css .tiptap and editor wrapper)
- [x] 4.2 Verify all screens (login, signup, header, editor, calendar) use the new font, scale, and theme; fix any drift

## 5. Verification

- [x] 5.1 Smoke test: sign in, open calendar from date label, move prev/next, jump to Today, select past/future dates, write and save
- [x] 5.2 Confirm dark mode (prefers-color-scheme: dark) still looks correct with new font and scale; keep aria labels and focus behavior
