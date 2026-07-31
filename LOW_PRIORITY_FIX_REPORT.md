# Low-Priority Fix Report — EV Motion

**Date:** 2026-07-31
**Scope:** Phase 3D (final) — resolve all 5 🟢 Low issues from [QA_REPORT.md](QA_REPORT.md) (L1-L5), re-test live, confirm no regressions across the entire app. This closes out every issue identified across the whole QA process.

---

## Summary

| | |
|---|---|
| Low issues at start | 5 |
| Fixed in code | 2 (L2, L3) — L1 was already resolved incidentally during C1 |
| Resolved via considered decision, no code change | 2 (L4, L5) |
| Remaining | 0 |
| Regressions introduced | 0 |
| Files deleted | 10 |
| Files modified | 3 (`package.json`, `SectionImages.tsx`, plus lockfile) |
| `tsc --noEmit` | clean |
| `eslint` (whole project) | **fully clean, zero errors or warnings** — the last pre-existing issue (dead code in `carousel.tsx`) is gone because the file itself was deleted |
| `npm run build` | clean, 58/58 pages |

---

## L1 — already resolved (no action this pass)

Confirmed still fixed — search inputs across the site carry proper `aria-label`s via `VehicleSearchBox`, a side effect of the C1 rebuild back in the Critical-priority phase. Nothing further to do.

---

## L2 — Deleted all unused shadcn UI primitives and their now-orphaned npm dependencies

**Fixed:** Deleted 10 completely unused files from `src/components/ui/`:
`accordion.tsx`, `breadcrumb.tsx`, `carousel.tsx`, `navigation-menu.tsx`, `separator.tsx`, `skeleton.tsx`, `sonner.tsx`, `table.tsx`, `card.tsx`, `badge.tsx`.

(The original audit found 8; `card.tsx` and `badge.tsx` joined the list as a side effect of M1's `VehicleCard.tsx` restyle, which removed their last remaining usages.)

**Went further than the original recommendation:** while confirming these were safe to delete, also checked whether their *npm dependencies* were still needed — and found three that weren't used by anything else in the codebase either:
- `sonner` (toast library) — only ever imported by the now-deleted `sonner.tsx` wrapper; no `toast()` call exists anywhere in the app.
- `embla-carousel-react` — only ever used by the now-deleted `carousel.tsx`.
- `next-themes` — never actually wired up; the Navbar's dark-mode toggle is a hand-rolled `document.documentElement.classList.toggle("dark")` implementation, not `next-themes`' `ThemeProvider`.

Removed all three from `package.json` and ran `npm install` to sync `package-lock.json` and `node_modules` (5 packages removed in total, including their own sub-dependencies).

**Files:** Deleted the 10 files above; modified `package.json`; regenerated `package-lock.json` via `npm install`.

**Verification:** `grep` confirmed zero references to any of the 10 components or 3 packages anywhere in `src/` before deleting/removing. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all re-run clean afterward — `npm run build` still produces all 58 pages with no change in route structure.

---

## L3 — VDP "Images" section count now accurate, plus a related bug fixed along the way

**Fixed:** `SectionImages.tsx`'s header now reads `Images (1 of 8)` for a photographed vehicle or `Images (0 of 8)` for one without — computed from whether `vehicle.sourceVehicle.images.photoUrl` actually exists, not hardcoded.

**A genuinely new bug found and fixed while implementing this:** the section's description text unconditionally read *"Only one confirmed photo is on file..."* regardless of whether that vehicle actually had one. For the 13 of 36 vehicles with **zero** real photos, this was a false claim the original audit hadn't caught (it wasn't checked in the initial pass). Fixed to conditionally show *"No confirmed photos are on file yet..."* when that's the true state.

**Files:** `src/components/vehicle-detail/SectionImages.tsx`.

**Verification:** `/cars/tata-nexon-ev#images` (has a real photo) → "Images (1 of 8)" + the "one confirmed photo" copy, both correct. `/two-wheelers/ampere-nexus#images` (no real photo) → "Images (0 of 8)" + the corrected "no confirmed photos" copy — confirmed live on both.

---

## L4 — Ad placeholders: no action, per your explicit decision

At the start of the Critical-priority phase you instructed: *"Keep advertisement placeholders as placeholders for now."* No code was touched for this item — `AdSlot.tsx` and its static "ADVERTISEMENT" boxes remain exactly as they were. This is a closed decision, not a deferred one.

---

## L5 — No pagination: no action, considered and declined

The catalog is 18 vehicles per category. Building pagination controls for a list that small would be premature engineering — it adds UI complexity and a filter-count edge case (page resets on filter change, etc.) with zero real user benefit at this scale, and would run against not building for hypothetical future scale. No code was changed. Worth revisiting only if the catalog grows to a size (roughly 30-40+ per category) where a single page genuinely becomes unwieldy.

---

## Final regression check (whole app, all 22 fixes combined)

Re-tested live, in a fresh browser tab, after all L2/L3 changes landed:
- Homepage renders instantly and fully (no `loading.tsx`-style hang, confirming M5's fix holds).
- `/cars?range=600` still filters correctly (5 of 18 cars) — M3 unaffected by the dependency cleanup.
- Navbar still shows zero horizontal overflow at 1024px (`clientWidth === scrollWidth`, both 1009) — the Navbar fix holds after every subsequent change in this session.
- Zero console errors on every route re-tested.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` — all three clean, run together as a final gate.

---

## Where the project stands now

Every issue raised across the entire QA process — 4 Critical, 6 High, 6 Medium, 5 Low, plus the mid-process Navbar regression — is closed. See [FINAL_QA_REPORT.md](FINAL_QA_REPORT.md) for the overall production-readiness assessment and scores.
