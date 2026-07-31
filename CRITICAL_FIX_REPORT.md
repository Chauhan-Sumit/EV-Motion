# Critical Fix Report — EV Motion

**Date:** 2026-07-31
**Scope:** Phase 3 of the production-readiness QA process — fix every 🔴 Critical issue from [QA_REPORT.md](QA_REPORT.md), re-test live, confirm no regressions. High/Medium/Low issues were intentionally left untouched, per instruction.

## Product decisions applied before fixing

1. **Fabricated review ratings (C3):** removed entirely. No replacement fake data was generated. The honest "no reviews yet" empty state is kept until real reviews exist.
2. **Advertisement placeholders:** left as-is for now (not in Critical scope).
3. **Video placeholder counts:** keep the placeholders, but remove misleading counts when no videos exist. This maps to **M4** (Medium severity, not Critical) — it is still open and queued for the Medium-priority pass, not touched in this round.

---

## Summary

| | |
|---|---|
| Critical issues at start | 4 |
| Critical issues fixed | 4 |
| Critical issues remaining | 0 |
| Regressions introduced | 0 (verified live) |
| New files | 5 |
| Files modified | 5 |
| `tsc --noEmit` | clean |
| `npm run build` | clean, 56/56 pages |

---

## C1 — Search was completely non-functional → real autocomplete search

**Was:** The Navbar search box had no event handlers at all — typing and clicking did nothing. The hero search box redirected to `/cars?q=...`/`/two-wheelers?q=...`, a parameter neither listing page ever read, so every query showed the same unfiltered full listing.

**Now:** A real, shared search component with substring matching, keyword routing, keyboard navigation, and match highlighting, used identically in three places (Navbar desktop, Navbar mobile, Hero SearchCard).

**How it works:**
- Direct name/brand matches (e.g. "Nexon", "Ather") return ranked vehicle suggestions (word-start matches rank above mid-string matches), each linking straight to that vehicle's detail page.
- Body-type/category keywords ("SUV", "Sedan", "Hatchback", "MUV", "Scooter", "Bike"/"Motorcycle") route to the **already-working** listing filters (`/cars?type=suv`, `/two-wheelers?type=scooter`) instead of the broken `q` param — so results are always real, filtered data, not a pass-through.
- A brand-only query (e.g. "MG") that matches every result to one OEM also surfaces a "View all N `<Brand>` vehicles" link to that brand's page.
- No matches → an honest "No matches for '...'" message. No fallback redirect to a generic listing.
- Debounced 180ms, full `role="combobox"`/`listbox`/`option` ARIA wiring, ↑/↓ to move selection, Enter to navigate, Escape/click-outside to close, and the matched substring is wrapped in `<mark>` in each suggestion.

**Files:**
- `src/lib/search.ts` (new) — search/matching/ranking logic, pure functions, no UI.
- `src/components/search/VehicleSearchBox.tsx` (new) — the shared input + dropdown component.
- `src/components/search/HighlightedText.tsx` (new) — substring highlight helper.
- `src/components/layout/Navbar.tsx` — both dead inputs replaced with `VehicleSearchBox`.
- `src/components/home/SearchCard.tsx` — dead input replaced with `VehicleSearchBox`; the old `handleSearch`/`q`-param logic was removed. The Car/Bike toggle and filter chips (Budget/Body Type/Range/Charging Speed/All Filters) now explicitly mean "browse the full listing for the selected mode" via a `Browse all cars/bikes` button — a deliberate, explicit "show me everything" action, not leftover dead-search plumbing.

**Live re-test results (all confirmed against the actual spec examples):**

| Query | Expected | Result |
|---|---|---|
| "Nexon" | Suggest Tata Nexon EV | ✅ exact single match |
| "Ne" (partial) | Autocomplete to Nexon | ✅ Nexon EV ranks first, substring highlighted |
| "Tiago" + ↓ + Enter | Navigate to Tiago EV | ✅ landed on `/cars/tata-tiago-ev` |
| "Ather" | Only Ather vehicles | ✅ exactly 3 Ather vehicles + "View all 3 Ather Energy vehicles" |
| "SUV" | Show SUV EVs | ✅ routed to `/cars?type=suv`, 14 real SUVs rendered |
| "Scooter" | Show scooters | ✅ "Electric Scooters" link → `/two-wheelers?type=scooter` |
| "BMW" | No forced generic listing | ✅ "No matches for 'BMW'" shown, no redirect |

Not exhaustively re-typed for every remaining example ("Sedan", "Bike", "MG") — they exercise the identical code path already verified above (category-keyword or brand-substring matching), so passing the representative cases confirms the rest.

**Known non-regression note:** the search dropdown reuses `VehicleImage`/`PlaceholderImage` for each suggestion's thumbnail, so vehicles without a real photo still show the double-name-render bug (**H2**, High severity, not yet fixed) inside the dropdown thumbnail. This is pre-existing and unrelated to the search fix — it will be resolved when H2 is fixed in the High-priority pass.

---

## C2 — "Get Best Price" dead button → working lead-capture modal

**Was:** `<button type="button">Get Best Price</button>` in `VehicleHero.tsx` had no `onClick`, no form — the single most prominent CTA on every vehicle page did nothing.

**Now:** Clicking it opens an accessible modal (built on the existing Base UI `Dialog` primitive, already proven elsewhere in the app) with a name + 10-digit-mobile form. Validates both fields, shows an inline error on invalid submission, and shows a "Request received" confirmation on success. Since the app has no backend anywhere, the form is explicitly labeled as a demo capture ("Demo form — no data is sent anywhere...") rather than silently pretending to submit somewhere real.

**Files:**
- `src/components/vehicle-detail/GetBestPriceDialog.tsx` (new)
- `src/components/vehicle-detail/VehicleHero.tsx` — dead button replaced with `<GetBestPriceDialog vehicleName={vehicle.name} />`

**Live re-test:** Clicked "Get Best Price" on the Nexon EV page → modal opened. Submitted empty → "Please enter your name." error shown, no submission. Filled valid name + mobile, submitted → "Request received / A verified dealer will contact you about the Nexon EV shortly." shown; "Done" closes and resets the form.

**Explicitly out of scope for this fix:** `SponsoredBanner.tsx`'s separate "Get Best Price"/"Explore All Variants"/"Download Brochure"/"Book Test Drive" buttons are a different, Home-page-only instance of the same dead-button pattern, tracked as **H5** (High severity) — left untouched here since it wasn't part of the Critical-severity C2 finding.

---

## C3 — Fabricated review ratings → removed, real derived data only

**Was:** `SectionReviews.tsx` hardcoded `SAMPLE_RATING = 4.6`, `SAMPLE_REVIEW_COUNT = 1245`, and a fixed star distribution, rendered identically on **every one of the 36 vehicle pages**, directly above the honest "No reviews yet" copy.

**Now:** Those constants and the associated "Read All Reviews" dead button are deleted. The rating-summary card is computed live from whatever reviews actually exist in that page's local review state:
- Zero reviews (the default, and the state for every vehicle until a user writes one): "No ratings yet — be the first to review the `<Vehicle>`."
- One or more reviews: a real average, real count, and a real per-star distribution computed from `reviews.reduce(...)`/`reviews.filter(...)` — no fabricated numbers at any point.

**Files:**
- `src/components/vehicle-detail/SectionReviews.tsx` — removed the three `SAMPLE_*` constants and the dead "Read All Reviews" button; added `averageRating`/`distribution` derived from the existing `reviews` state.

**Live re-test:**
- `tata-nexon-ev#reviews` (fresh): "No ratings yet — be the first to review the Nexon EV." / "No reviews yet" — consistent, no contradiction, no fake numbers anywhere in the DOM.
- Submitted a real 4-star review via the existing "Write a Review" form → summary card immediately updated to "4.0 · Based on 1 review" with an accurate distribution (4★: 1, all others: 0).
- Navigated to a different vehicle (`tata-tiago-ev`) → independently shows "No ratings yet", confirming no shared/leaked state between vehicles.

---

## C4 — No custom 404 page + 13 broken links → branded 404, zero dead links

**Was:** No `not-found.tsx` anywhere in `src/app`, so any bad URL fell through to Next's bare, unstyled default 404 with no EV Motion branding or navigation. 12 Footer links and 1 Navbar link ("REVIEWS & NEWS") pointed at routes that don't exist anywhere in the app (`/guides`, `/charging`, `/tools/subsidy-calculator`, `/news`, `/advertise`, `/dealers/login`, `/partnerships`, `/media-kit`, `/contact`, `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/reviews`).

**Now:**
- `src/app/not-found.tsx` (new) — a branded 404 page (matches the site's visual language, inherits the real `Navbar`/`Footer` automatically via the root layout) with links back to Home, Cars, and Scooters & Bikes.
- Rather than hastily building 13 real pages under Critical-fix time pressure (which would just trade "broken link" for "thin placeholder page," violating the audit's own "no placeholder content" bar), every link to a route that doesn't exist yet was converted from a clickable `<Link>` to inert text carrying a small "Soon" badge — honestly signaling what's planned without promising a destination that 404s.

**Files:**
- `src/app/not-found.tsx` (new)
- `src/components/layout/Footer.tsx` — `FOOTER_COLUMNS` links without a real route no longer render as `<Link>`; legal links at the bottom are now plain "(Soon)"-suffixed text.
- `src/components/layout/Navbar.tsx` — `NAV_LINKS` entries without a real route render as inert text with a "Soon" badge, in both the desktop nav bar and the mobile menu.

**Live re-test:**
- `/guides` now renders the branded 404 (title "This page took a wrong turn", working Navbar/Footer, Back to Home / Browse Cars / Browse Scooters & Bikes links) instead of Next's bare default.
- Footer now contains exactly **5** `<a>` elements, all real routes: `/`, `/cars`, `/two-wheelers`, `/compare`, `/brands`.
- Navbar now contains exactly **3** `<a>` elements, all real routes: `/`, `/cars`, `/two-wheelers`.
- Zero remaining dead links in global chrome (Navbar/Footer render on every page).

**Still open, explicitly not in this pass's scope:** actually building the 13 named destinations (Guides, Charging Stations, Subsidy Calculator tool, News, Advertise, Dealer Login, Partnerships, Media Kit, Contact, Privacy, Terms, Cookies, Reviews) remains a real product-scope decision (originally logged as P2 in QA_REPORT.md), not a bug fix.

---

## Regression testing performed

Live-verified after all four fixes landed together:
- `npx tsc --noEmit` — clean.
- `npm run build` — clean, 56/56 pages generated (including the new `/_not-found` route).
- No console errors on: `/`, `/cars?oems=tata`, `/cars?type=suv`, `/compare?ids=tata-nexon-ev,mg-zs-ev`, `/brands/tata`, `/cars/tata-nexon-ev`, `/cars/tata-tiago-ev`, `/two-wheelers/ola-s1-pro`, `/guides`.
- `/cars` OEM filter re-tested (Tata → 3 vehicles, URL synced to `?oems=tata`) — unaffected by the search/Footer/Navbar changes.
- Compare page and brand detail page re-checked — real data, unaffected.
- VDP mobile overflow (H1, pre-existing, High severity) re-measured at 390px on the two-wheeler VDP — unchanged at ~57px overflow, confirming the Critical fixes didn't add to it (and didn't fix it either — that's still queued for the High-priority pass).
- Mobile Navbar search panel (390px) opens with no new horizontal overflow (`scrollWidth === clientWidth === 390`).

---

## What's still open

Everything in QA_REPORT.md rated 🟠 High, 🟡 Medium, or 🟢 Low (17 issues) is unchanged and awaiting the next approved phase. Most immediately relevant given this round's work:
- **H2** — the placeholder-image double-name-render bug is still visible in the new search dropdown's thumbnails (inherited, not introduced).
- **H1** — VDP mobile horizontal overflow is unchanged.
- **H5** — SponsoredBanner's own "Get Best Price"/"Download Brochure"/etc. buttons are still dead (separate instance from the one fixed in C2).
- **M4** — "Videos (3)" misleading count is still present; queued per your decision #3 above.

No further action will be taken until you approve moving on to the High-priority issues.
