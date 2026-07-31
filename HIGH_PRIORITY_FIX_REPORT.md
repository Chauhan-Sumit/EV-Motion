# High-Priority Fix Report — EV Motion

**Date:** 2026-07-31
**Scope:** Phase 3B — fix all 6 🟠 High issues from [QA_REPORT.md](QA_REPORT.md) (H1-H6), re-test live, confirm no regressions in the app or in the four 🔴 Critical fixes from Phase 3. Medium/Low issues were intentionally left untouched, per instruction.

**Requirements followed:** production-quality (no quick patches), scalable/reusable where a shared pattern existed, EV Motion design system preserved throughout, every fix verified live in the running app, no regressions in C1-C4.

---

## Summary

| | |
|---|---|
| High issues at start | 6 |
| High issues fixed | 6 |
| High issues remaining | 0 |
| Bonus fix | L1 (search a11y labels) resolved incidentally by C1's rebuild |
| Regressions introduced | 0 (verified live, including a full re-check of C1-C4) |
| New files | 4 |
| Files modified | ~20 |
| `tsc --noEmit` | clean |
| `eslint` | clean |
| `npm run build` | clean, 56/56 pages |

---

## H1 — VDP mobile horizontal overflow → fixed at the actual overflow source

**Was:** Every one of the 36 vehicle detail pages had ~72px of real horizontal scroll at 375px width (measured: `scrollWidth` 447px vs. 375px viewport).

**Root cause, precisely:** `VehicleHero.tsx`'s `<div className="grid gap-3.5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">` has no explicit column definition below the `lg` breakpoint, so CSS Grid falls back to a single implicit-column track. Grid items default to `min-width: auto`, which resolves to their *min-content* size — `VehicleGallery`'s internal content (a fixed 5-column thumbnail strip, a horizontally-scrolling quick-jump pill row) has a min-content width wider than the viewport, and with no `min-width: 0` override that width becomes the forced minimum size of the grid track, spilling the whole page wider than its container.

**Fix:** `min-w-0` added to `VehicleHero.tsx`'s grid container and to both of its direct children — but the load-bearing change is on `VehicleGallery.tsx`'s own root `<div>` (the actual grid item carrying the oversized content), which now also has `min-w-0`. This lets the track shrink to the available width instead of being pinned to its content's min-content size — the standard, correct fix for this well-known CSS Grid/Flexbox overflow class of bug, not a workaround like `overflow-x: hidden` that would just clip content silently.

**Files:** `src/components/vehicle-detail/VehicleHero.tsx`, `src/components/vehicle-detail/VehicleGallery.tsx`

**Verification:** Live-measured `document.documentElement.scrollWidth` vs. `clientWidth` at 320px, 375px, and 768px on both `/cars/tata-nexon-ev` and `/two-wheelers/ola-s1-pro` — equal at every width, zero overflow, on both vehicle types.

---

## H2 — Placeholder-image double-name rendering → fixed once, at the source, for all 13 usage sites

**Was:** `PlaceholderImage` bakes the vehicle's name as visible text inside the placeholder graphic itself. Every card that also shows the name as a separate title (which turned out to be *all of them*) rendered it twice for the 13 of 36 vehicles (36%) without a real photo — visibly overlapping the icon in small thumbnails.

**Fix:** Added `showLabel?: boolean` (default `false`) to `PlaceholderImage`, forwarded through `VehicleImage`. Before changing the default, audited all 13 consuming components (`TrendingCompactCard`, `ListingCard`, `UpcomingCard`, `CompareCard`, `VehicleCard`, `SimilarCarCard`, `VehicleGallery`, `SectionColors`, `SectionCompareSimilar`, `SectionImages`, `CompareTable`, plus two more found during the audit) — every single one already renders the vehicle name as adjacent text, so flipping the default to `false` fixes all 13 at once with zero per-call-site edits, and the accessible name (`role="img"` + `aria-label`) is untouched, so nothing was lost for screen-reader users. This is the more scalable option versus threading a `compact` prop through 13 call sites individually, which would also leave the door open for a *future* new card to reintroduce the bug by defaulting to "on" again.

**Files:** `src/components/common/PlaceholderImage.tsx`, `src/components/vehicles/VehicleImage.tsx`

**Verification:** Live DOM inspection of the Ather Rizta trending card (previously `"Ather Energy RiztaAther Energy Rizta"`) now shows the name exactly once. As a side effect, this also cleaned up the new search-autocomplete dropdown built for C1, which reuses `VehicleImage` for its thumbnails.

---

## H3 — Filter `Select` showing raw values → explicit label resolution

**Was:** The Body Type and Sort By dropdowns on `/cars` and `/two-wheelers` displayed the raw internal value (`"all"`, `"price-asc"`) instead of the human label, because Base UI's `Select.Value` only resolves a label from registered `Select.Item` children, which aren't registered until the popup has mounted at least once.

**Fix:** Implemented exactly the QA report's recommendation — passed an explicit render function to `SelectValue`. Also extracted the previously-inline sort options into a `SORT_OPTIONS` constant (mirroring the `subTypeOptions` prop shape) and a shared `labelFor()` helper, so both selects resolve their label from one small, typed lookup rather than duplicating logic.

**Files:** `src/components/vehicles/FilterBar.tsx`

**Verification:** `/cars?type=suv&sort=range-desc` — triggers read "SUV" and "Range: High to Low" (previously "all" / "price-asc").

---

## H4 — Brand pages ignore real logo assets → single source of truth + shared component

**Was:** `/brands` rendered a letter-initial avatar for every OEM, ignoring the real logo files already present in `public/images/brands/`.

**Better architecture than the narrow fix originally scoped:** the QA report only named `brands/page.tsx`, but tracing the actual logo data found `src/lib/data/ev-motion/derive.ts` already maintained a *private* `BRAND_LOGOS` map used only by the homepage's `BrandCarousel` — meaning the correct logo paths already existed in the codebase, just not where the brand pages could see them, and duplicated logic waiting to drift. Also found the brand *detail* page (`/brands/[oem]`) had the identical bug, which the original audit hadn't flagged.

**Fix:**
- Added `logoUrl?: string` to the `Oem` type (`types/vehicle.ts`) and populated it directly on each OEM record in `oems.ts` (11 of 12 — Ampere has no asset).
- Deleted the duplicate `BRAND_LOGOS` map from `derive.ts`; it now reads `oem.logoUrl`.
- Built `src/components/brands/BrandLogo.tsx` — a single shared component (real logo image, or an initial-letter fallback in the OEM's brand color when no asset exists) — and used it in both `brands/page.tsx` and `brands/[oem]/page.tsx`, so the fallback behavior can never diverge between the two pages.

**Files:** `src/components/brands/BrandLogo.tsx` (new), `src/types/vehicle.ts`, `src/lib/data/oems.ts`, `src/lib/data/ev-motion/derive.ts`, `src/app/brands/page.tsx`, `src/app/brands/[oem]/page.tsx`

**Verification:** `/brands` renders 11 real `<img>` logos (each confirmed 200 OK by fetching its underlying `/_next/image` URL directly, since this sandbox's browser pane doesn't composite image frames for a naive `naturalWidth` check); Ampere correctly shows its "A" fallback. `/brands/tata` also now shows the real Tata logo in its header.

---

## H5 — Remaining dead buttons → wired to real functionality or honestly disabled

Per your instruction ("implement the intended functionality or intentionally disable/remove... no dead interactive elements should remain"), every item got one of two treatments — never left as a silently-dead styled button:

| Button | Treatment |
|---|---|
| `CategoryRow` — Electric Cars / E-Scooters / E-Bikes | **Wired** — link to the real, already-working listing filters (`/cars`, `/two-wheelers?type=scooter`, `/two-wheelers?type=motorcycle`) |
| `CategoryRow` — E-Buses / Commercial / Chargers | **Disabled** — no backing feature exists; rendered as an inert, visually muted "Soon" tile instead of a clickable dead end. Also corrected the "Chargers" tile's fabricated "890" count to "—", matching the other two honestly-empty categories, since a fake precise number attached to a disabled tile would be worse than the button being dead in the first place |
| `SponsoredBanner` — "Explore All Variants" | **Wired** — real link to the featured vehicle's `#variants` section |
| `SponsoredBanner` — "Download Brochure" | **Disabled** — genuinely `disabled`, labeled "(Soon)"; no brochure asset exists |
| `SponsoredBanner` — "Get Best Quote" / "Book Test Drive" | **Wired** — real lead-capture dialogs |
| `SubsidyCalculatorCard` — "Check Subsidy" | **Wired** — now genuinely computes a result from the two select inputs, using the same non-fabricated "up to ₹X in some states" language the VDP's own Ownership Tools subsidy card already displays, so the two never contradict each other |
| `UpcomingCard` — "Notify Me" (×8) | **Wired** — real, per-vehicle-personalized email-capture dialog |
| `AdvertiseSection` — "Get Advertiser Kit" | **Wired** — real name/company/email capture dialog |
| Navbar — "Login" (desktop + mobile menu) | **Disabled** — found during the sweep, not in the original QA report; real auth is out of scope for this pass, so both now show `disabled` + "(Soon)" instead of a clickable no-op |

**Better architecture than "wire each one separately":** built one shared, reusable engine — `src/components/common/LeadCaptureDialog.tsx` — instead of five near-identical dialog implementations. It owns field rendering, validation, the success state, and the honest "Demo form — no data is sent anywhere" disclosure (this app has no backend, so every lead-capture surface is transparently labeled as a demo rather than silently pretending to submit somewhere real). `GetBestPriceDialog` (built in Phase 3 for C2) was refactored to sit on top of the same engine, so all six lead-capture CTAs on the site now share one component instead of six.

**A real bug this refactor caught:** field validators are expressed as a serializable `validation: "required" | "mobile" | "email"` string, not a function prop. `AdvertiseSection`, `UpcomingCard`, and `SponsoredBanner` are Server Components — passing a validator *function* into the Client Component `LeadCaptureDialog` is not serializable across that boundary. The first implementation did exactly that and broke `npm run build` with a cryptic minified runtime error (`validators.email is not a function`) during static prerendering. Caught by the build step, root-caused, and fixed by moving the actual validator functions inside the client module and having callers just name which rule they want. This is the correct fix, not a workaround — it also means Server Components stay Server Components (no unnecessary `"use client"` added to otherwise-static sections just to route around the boundary).

**Files:** `src/components/common/LeadCaptureDialog.tsx` (new), `src/components/vehicle-detail/GetBestPriceDialog.tsx` (refactored), `src/components/home/CategoryRow.tsx`, `src/components/home/SponsoredBanner.tsx`, `src/components/home/SubsidyCalculatorCard.tsx`, `src/components/home/UpcomingCard.tsx`, `src/components/home/AdvertiseSection.tsx`, `src/components/layout/Navbar.tsx`, `src/lib/data/ev-motion/content.ts`, `src/types/ev-motion.ts`

**Verification (all live):**
- CategoryRow: 3 real links confirmed navigable, 3 disabled tiles confirmed non-interactive with "Soon" labels.
- SubsidyCalculatorCard: selecting Delhi + Electric Car and clicking Check Subsidy produced a real computed result string tied to the actual selections.
- UpcomingCard: submitted an invalid email → validation error shown; submitted a valid email → "You're on the list" confirmation, personalized to "BE 6".
- AdvertiseSection: submitted the 3-field form → "Kit on its way" confirmation.
- SponsoredBanner: "Explore All Variants" navigated to `/cars/tata-nexon-ev#variants`; "Download Brochure" confirmed `disabled`; "Get Best Quote" and "Book Test Drive" both opened correctly-personalized dialogs.
- Navbar Login: confirmed `disabled` in both desktop and mobile menu, with a "coming soon" tooltip.
- A form-level bug was also caught and fixed during this verification: `<input type="email">`'s native browser validation was silently intercepting submission before the custom validator could run, for the email field specifically. Added `noValidate` to `LeadCaptureDialog`'s `<form>` so the app's own (consistent, better-worded) validation is always the single source of truth across every field type, not just some.

---

## H6 — Inconsistent card clickability → fixed at both instances found

**Was:** `ListingCard` (Home's "Popular Electric Cars"/"Popular Scooters & Bikes" grids) had `cursor-pointer` on the whole card, implying it's clickable, but only a small "Get Quote ›" text at the bottom-right was an actual `<Link>`.

**Fix:** `ListingCard.tsx`'s root `<article>` was replaced with a full-card `<Link>` (matching the pattern `TrendingCompactCard` already used correctly). The former nested CTA link is now plain text inside the single outer link — a nested `<a>` inside another `<a>` is invalid HTML and browsers silently break the nesting to "fix" it, which would have produced its own bugs.

**Found and fixed the identical pattern elsewhere, not in the original report:** `RankedListCard.tsx` (the "Top Electric Cars" / "Top Scooters & Bikes" home widgets) had each row styled with `hover:bg-primary-tint` — implying interactivity — on a plain, non-interactive `<div>`. Since `RankedVehicleData` didn't carry a vehicle slug/href, added `href: string` to the type, populated it in `toRankedVehicle()` via the same `vehicleHref()` helper built for C1's search (`src/lib/search.ts`) rather than writing a third independent `/cars/{slug}` vs `/two-wheelers/{slug}` implementation, and made each row a real `<Link>`.

**Files:** `src/components/home/ListingCard.tsx`, `src/components/home/RankedListCard.tsx`, `src/types/ev-motion.ts`, `src/lib/data/ev-motion/derive.ts`

**Verification:** Clicked the *image area* of a Home listing card (not the CTA text) — correctly navigated to `/cars/mg-comet-ev`. Clicked a ranked-list row's rank-number area (not the price) — correctly navigated to `/cars/mahindra-be-6`.

---

## Regression testing performed

- `npx tsc --noEmit` — clean after every change, final pass clean.
- `npx eslint` across every touched directory — clean (also caught and fixed a real `react-hooks/set-state-in-effect` violation in the new `VehicleSearchBox` during this pass, unrelated to H1-H6 but surfaced by the lint sweep).
- `npm run build` — clean, 56/56 pages, twice (once mid-pass after the RSC-boundary bug was found and fixed, once at the end).
- **Process note:** running `npm run build` while the `next dev` server was still active corrupted the dev server's `.next` cache and produced a wall of stale/misleading compile errors in the browser console on the next few checks. Diagnosed via a fresh, non-cached tab (zero errors there) and confirmed by clearing `.next` and restarting the dev server cleanly. Not an app bug — noted here so it isn't mistaken for one if seen again.
- Re-verified all four Critical fixes after the High-priority work landed:
  - **C1 (search):** "Ather" still returns exactly the 3 Ather vehicles (and, bonus, no longer shows the double-name bug in the dropdown thanks to H2).
  - **C2 (Get Best Price):** still opens, validates, and confirms correctly on `/cars/tata-nexon-ev`.
  - **C3 (no fake reviews):** `/cars/tata-nexon-ev#reviews` still shows the honest empty state with no fabricated numbers.
  - **C4 (404 + no broken links):** `/nonexistent-page` still renders the branded 404.
- Full-breakpoint overflow sweep (320/375/768px) re-run across `/`, `/cars/tata-nexon-ev`, `/cars`, `/brands`, `/compare` — all clean, zero horizontal scroll anywhere.
- No console errors on any route tested, in a fresh browser tab.

---

## What's still open

Everything in QA_REPORT.md rated 🟡 Medium (6 issues: M1-M6) or 🟢 Low (4 remaining: L2-L5) is unchanged and awaiting the next approved phase — no Medium-priority work was started, per instruction. Quick pointers for what's next, since a few of them are now more visible:
- **M1** (two visibly different design systems between Home/VDP and the listing/brand/compare pages) is now slightly more noticeable, since `BrandLogo` on `/brands` looks closer to production quality while the surrounding page chrome is still on the generic shadcn theme.
- **M3** (FilterBar missing Range/Battery/Charging/Seats/Availability facets, no Clear-all control) is unaffected by this pass — H3 only fixed the *display* of the two existing selects, not the missing facets.
- **L1** is done (see QA_REPORT.md) — one fewer Low item to plan for.

No further action will be taken until you approve moving on to the Medium-priority issues.
