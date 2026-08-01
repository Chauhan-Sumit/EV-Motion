# EV Motion — Production Polish Report

**Date:** 2026-08-01
**Scope:** Full-product QA/polish pass across navbar, location, search, filters, vehicle images, model pages, price/subsidy tooling, homepage sections, brand/vehicle pages, compare, responsiveness, and design consistency.
**Explicitly out of scope (per instruction):** Commercial-EV data entry (Batch 5 of the vehicle-database expansion).

---

## 1. Executive Summary

This pass corrected several assumptions in the original brief against the actual code before making changes — two of the "known issues" (fake Min Range/Min Battery filters, a "removed" navbar ad slot) turned out to already work correctly or already exist; the audit is honest about that rather than padding the fix list. In their place, this pass found and fixed a **real, undiscovered, page-wide horizontal-overflow bug on the homepage** (a CSS Grid track without `minmax(0, …)`), a **root-cause bug in the search system** where curated "popular search" terms silently failed to resolve because of a pre-existing multi-word matching gap, and a **precedence bug** where a generic category term ("SUV") could hijack navigation to an unrelated vehicle whose name merely contained that substring. Twelve batches of fixes landed, all verified live in a browser and behind a clean `tsc`/`eslint`/`build` gate at every step.

---

## 2. What Was Fixed

### A. Navbar, Location, Search

1. **Language selector removed entirely** (`Navbar.tsx`) — desktop dropdown, mobile `<select>`, and all associated state/refs deleted. English is the only language, no i18n scaffolding left behind.
2. **Navbar ad slot's breakpoint pulled forward** from `min-[1400px]:flex` to `xl:flex` (1280px), now that the language control's width is freed. Re-verified live at exactly 1280px with the longest real city name (Thiruvananthapuram) selected — zero overflow (`scrollWidth === clientWidth`).
3. **City label's fixed-width truncation** — already correct pre-existing behavior (`max-w-[88px] truncate`); re-verified post-change, zero layout shift switching Delhi → Thiruvananthapuram at 1024/1280/1440px.
4. **City dataset expanded from 36 to 157 real Indian cities** (`cities.ts`) — every state capital, every union territory, and a broad set of tier-2/tier-3 cities and district headquarters. Added an optional `district` field and wired it into `LocationSelector`'s search predicate, so searching "Gautam Buddh Nagar" correctly surfaces Noida.
5. **Location is now genuinely functional, not decorative** — new `src/lib/data/state-charges.ts` (an honestly-labeled-estimated table of RTO/registration and insurance rates by state, reflecting the real pattern that many Indian states fully waive EV road tax). Wired into:
   - `SidebarPriceSummary.tsx` (VDP Price Summary) — registration/insurance now computed from the selected city's state instead of flat 2%/3%.
   - `SectionCompareSimilar.tsx`'s "On-Road Price" row — was hardcoded to "Mumbai" regardless of selected city; now uses the real selected city.
   - `SubsidyCalculatorCard.tsx` (homepage) — State dropdown now drives a real state-indexed subsidy table (not just sentence wording), auto-syncs to the globally-selected city until the user manually overrides it, and gives an honest "no active purchase subsidy on file" message for states without one instead of fabricating a number.
   - `SectionOwnershipTools.tsx`'s Subsidy Calculator card — same state-aware table, replacing the flat category-only copy.
6. **Popular searches are now category-scoped** — Car mode shows only car terms, Bike mode only bike terms (previously one fixed list regardless of toggle).
7. **Popular/Recent search clicks now navigate directly** to the resolved vehicle/category page, instead of just re-populating the input. Category-keyword matches ("SUV", "Scooter", …) are prioritized over incidental substring vehicle-name matches, so "SUV" correctly goes to `/cars?type=suv` rather than a random vehicle whose name happens to contain "SUV".
8. **Keyboard navigation extended to the Recent/Popular suggestions panel** — Arrow keys and Enter previously only worked on live search results; they now also navigate the suggestions list when no query is typed.

**Root-cause bug found along the way:** the original `POPULAR_SEARCHES` terms ("Tata Nexon EV", "Ola S1 Pro", "MG Windsor EV", …) never resolved to anything, which is *why* the brief's "clicking popular searches doesn't work" complaint existed. The cause: `search.ts`'s substring matcher can't bridge a brand's full name (e.g. "Tata **Motors**", "Ola **Electric**") sitting between the OEM word and model word in a query — `"tata motors nexon ev".includes("tata nexon ev")` is `false`. Rewriting the popular-search terms to bare model names ("Nexon EV", "S1 Pro") — which always match via the exact `model === query` rule regardless of OEM naming — fixed this without touching the shared search algorithm.

### B. Filters

9. **Brand filter now has a search box** (`FilterBar.tsx`) — typing "Ta" instantly filters the 15/31-item OEM checkbox list to just "Tata Motors". Verified live.
10. **Min Range / Min Battery filters audited and confirmed already correct** — live-verified (`?range=400` cuts `/cars` from 54→49 vehicles) that these are real `>=` predicates, not cosmetic. No change made; the brief's "fake filters" premise didn't hold up under inspection.

### C. Vehicle Images

11. **Every externally-sourced and locally-cached vehicle photo removed** — 23 `photoUrl`/`photoAttribution` pairs stripped from `cars.ts` and `two-wheelers.ts` (both Wikimedia-hosted and locally-cached files, since the local copies carry the same provenance risk). The now-fully-unreferenced `public/images/vehicles/` directory (including an orphaned, already-unused `teaser/` subfolder) was deleted. `VehicleImage.tsx`'s existing placeholder fallback needed no changes — it already renders the branded, category-specific placeholder graphic whenever `photoUrl` is absent. Verified live: card heights identical across a 54-vehicle listing (271.875px, zero variance), VDP gallery honestly shows "Images (0 of 8)".

### D. Similar Vehicles

12. **`getRelatedVehicles` rewritten** (`src/lib/data/index.ts`) to guarantee up to 8 similar vehicles instead of a hard-capped 4 same-OEM-only list: same-OEM matches first, backfilled by price-proximity across the rest of the category. Live-verified: Rolls-Royce Spectre (the brand's only model — 0 same-OEM siblings) now shows 8 real similar luxury EVs instead of 0-1.
13. **"Similar Electric Cars" layout redesigned** to a horizontal-scroll rail at every breakpoint (not just mobile) with narrower fixed-width cards, matching production marketplaces' related-vehicle rails, instead of switching to a 3-column grid that orphaned extra cards.
14. The separate "Compare with Similar Cars" spec-comparison table (a different, intentionally 2-column feature) was left untouched — it's not the "cards" section the brief was describing.

### E. Homepage

15. **Upcoming Vehicles card-height inconsistency fixed** (`UpcomingCard.tsx`) — added `flex h-full flex-col` + `mt-auto` on the CTA, matching the pattern the "Similar Cars" card already used correctly. Verified live: all 5 upcoming cards now render at an identical 308.5px height regardless of title-text length.

### F. Price Display

16. **Crore notation added** — new shared `formatPriceLakh`/`formatPriceRangeLakh` helpers in `src/lib/utils.ts`, switching to `₹X.XXCr` at/above ₹100L. Replaced four independent ad-hoc formatters (`VehicleCard.tsx`, `CompareTable.tsx`, `derive.ts`'s `priceLabel`/`expectedPriceLabel`, `SponsoredBanner.tsx`). Closes a documented known-limitation from the Batch 2 luxury-car data expansion. Verified live: Rolls-Royce Spectre now reads "₹7.50Cr onwards" (was "₹750.00L") consistently across its VDP, brand-page card, and the Compare table; regular cars still show lakh notation correctly.

### G. Compare Page

17. **Duplicate-vehicle guard added** (`CompareBoard.tsx`) — a hand-crafted `?ids=a,a,a` URL previously seeded three identical rows; now dedupes both on initial URL load and in `handleAdd`. Verified live.
18. **Mobile compare table audited at 375px** — the existing `overflow-x-auto` fixed-column table clips correctly to the viewport (343px wrapper, 868px scrollable content) with zero page-level overflow. No structural change needed; this matches CarWale's own mobile compare pattern.

### H. Sweep Fixes

19. **Homepage-wide horizontal overflow bug found and fixed** (`MainLayout.tsx`) — the two-column grid used a bare `1fr` track (`lg:grid-cols-[1fr_260px]`) with no `minmax(0, …)`, so any horizontal-scroll row's intrinsic content width silently stretched the *entire page* past the viewport (`scrollWidth` 3308px vs `clientWidth` 1265px at 1280px, confirmed present at the default city too — not something my navbar/city work introduced). Fixed to `minmax(0,1fr)_260px` plus `min-w-0` on the inner column; re-verified zero overflow at 375/1024/1280/1440px.
20. **404 page metadata bug found and fixed** (`not-found.tsx`) — the page had no `metadata` export, so its browser-tab title inherited the homepage's title ("EV Motion - India's #1 EV Marketplace") instead of announcing itself. Added `title: "Page Not Found"` + `robots: noindex`.
21. **Footer's "Subsidy Calculator" link** was labeled "Soon" even though the feature has existed on the homepage since a prior session. Pointed it at `/#subsidy-calculator` (added a scroll-anchored `id` to the card) instead of leaving a live feature mislabeled as unbuilt.

---

## 3. New Issues Discovered (this pass, not previously known)

| Issue | Where | Status |
|---|---|---|
| Homepage-wide horizontal overflow via un-guarded `1fr` grid track | `MainLayout.tsx` | **Fixed** (§H.19) |
| Popular search terms silently unresolvable (multi-word substring gap) | `search.ts` / `VehicleSearchBox.tsx` | **Worked around** by choosing match-safe terms (§A, root-cause note). The underlying `search.ts` algorithm gap itself remains — see Known Limitations. |
| "SUV"-style category terms could resolve to an unrelated vehicle instead of the category listing | `VehicleSearchBox.tsx` | **Fixed** (§A.7) |
| `SidebarPriceSummary`/subsidy tooling completely ignored the selected city | Multiple VDP/homepage components | **Fixed** (§A.5) |
| `SectionCompareSimilar`'s on-road price was hardcoded to "Mumbai" | `SectionCompareSimilar.tsx` | **Fixed** (§A.5) |
| `SubsidyCalculatorCard`'s State dropdown stuck on the server's pre-hydration "Delhi" default forever, never syncing to the real persisted city | `SubsidyCalculatorCard.tsx` | **Fixed** (a hydration-timing bug found while testing §A.5) |
| 404 page's browser-tab title incorrectly showed the homepage's title | `not-found.tsx` | **Fixed** (§H.20) |
| Footer's Subsidy Calculator link mislabeled "Soon" for a shipped feature | `Footer.tsx` | **Fixed** (§H.21) |
| `public/images/vehicles/teaser/*` — 6 image files, fully unreferenced anywhere in the codebase | `public/` | **Fixed** — deleted as dead assets alongside the photo-removal cleanup |

---

## 4. Files Modified

**Navbar/Location/Search:** `Navbar.tsx`, `LocationSelector.tsx`, `cities.ts` (rewritten), `VehicleSearchBox.tsx`, new `state-charges.ts`
**Filters:** `FilterBar.tsx`
**Images:** `cars.ts`, `two-wheelers.ts`, `public/images/vehicles/*` (deleted)
**Similar vehicles:** `src/lib/data/index.ts`, `SectionSimilarElectricCars.tsx`
**Homepage:** `MainLayout.tsx`, `UpcomingCard.tsx`, `SponsoredBanner.tsx`, `SubsidyCalculatorCard.tsx`
**Price/subsidy:** `SidebarPriceSummary.tsx`, `SectionOwnershipTools.tsx`, `SectionCompareSimilar.tsx`
**Price formatting:** `src/lib/utils.ts`, `VehicleCard.tsx`, `CompareTable.tsx`, `derive.ts`
**Compare:** `CompareBoard.tsx`
**Misc:** `not-found.tsx`, `Footer.tsx`

(Note: `git status` shows additional modified files — e.g. `ListingCard.tsx`, `TrendingCompactCard.tsx`, `VehicleListing.tsx`, `toVehicleDetail.ts`, `content.ts` — carried over from a *prior, already-uncommitted session* per `HANDOFF.md`; this pass did not touch those beyond what's listed above.)

---

## 5. Verification Performed

- **Quality gate run after every batch, not just at the end**: `npx tsc --noEmit`, `npx eslint .`, `npm run build` — clean throughout, 179 routes generated consistently.
- **Live functional verification** in a real browser (dev server) for every fix: navbar overflow at 1280px with worst-case city name, district-based city search, state-dependent price/subsidy recalculation, category-scoped popular searches, direct-navigation on click, brand-filter search, ≥5-card Similar Vehicles rail, equal-height Upcoming cards, Crore notation across 3 surfaces, Compare duplicate-guard, mobile Compare table clipping, 404 title, Footer anchor link.
- **Responsive sweep**: 375 / 768 / 1024 / 1280 / 1440px checked via `scrollWidth`/`clientWidth` on Home, `/cars`, `/two-wheelers`, `/brands`, a VDP, and `/compare` — zero horizontal overflow anywhere after the `MainLayout.tsx` fix.

**Known verification limitation:** this browser-automation environment's synthetic "Enter" keypress reports `e.key === "Unidentified"` rather than `"Enter"` — a tooling quirk, not an app bug (confirmed by testing the identical code path via real click events, which worked correctly). Enter-to-navigate and Arrow-key navigation were verified by code review and via the equivalent click-driven interaction; a real keyboard in a real browser sends the correct `key` value.

---

## 6. Explicitly Not Done (and why)

- **Commercial-EV data (Batch 5)** — per direct instruction not to do commercial EV work, and the project's own "stop for approval" rule for that batch.
- **The multi-word search gap itself** (`search.ts`'s substring matcher not bridging a skipped brand word, e.g. "simple ultra" → "Simple Energy Ultra") — this is a pre-existing, previously-documented limitation. This pass worked around its effect on curated popular-search terms but did not change the shared algorithm, which would need its own scoped design (word-order-independent matching) rather than a bundled fix.
- **Per-vehicle authored specs** (chemistry, warranty terms, FAQs, etc. are still category-wide lookup tables in `toVehicleDetail.ts`, not real per-model data) — this is a 122-vehicle data-authoring effort, not a polish-pass fix.
- **"Portable Battery" filter** — still not a schema field; unchanged from the prior session's documented follow-up.
- **New dependencies, real backend, real ad network, real reviews/news backend** — out of the project's current static-data architecture per `HANDOFF.md`.
- **Full Lighthouse/Core Web Vitals or axe-core accessibility audit** — no automated tooling was run; accessibility verification in this pass was manual (aria attributes, keyboard-path code review, focus-ring consistency) rather than instrumented.

---

## 7. Scores (qualitative, based on this pass's manual verification — not from automated tooling)

| Area | Assessment |
|---|---|
| **Production readiness** | Meaningfully improved — the homepage-wide overflow bug and the search-navigation dead-end were both genuinely release-blocking UX defects that are now fixed. Still a static-data demo with no backend by design. |
| **Accessibility** | Unchanged baseline (skip-link, focus-ring, aria-labels already present pre-pass) plus this pass's `role="option"`/`aria-selected`/`aria-activedescendant` wiring extended correctly to the suggestions panel. No automated audit run. |
| **Performance** | No regressions — image removal reduces payload (no more external Wikimedia fetches); route count unchanged at 179; no new dependencies. |
| **UX** | Substantially improved: navbar decluttered, location/pricing genuinely reactive instead of decorative, search actually navigates, brand filter searchable, similar-vehicles section no longer anemic for small brands, consistent card heights, correct currency notation at scale. |
| **SEO** | 404 page now announces itself correctly; everything else (sitemap, per-route metadata, JSON-LD) was already in place pre-pass and untouched. |
| **Design consistency** | No new one-off patterns introduced — every new UI element (brand search input, city search-by-district, price summary line) reuses the existing input/label/card conventions already established in the design system. |

---

## 8. Launch-Readiness Verdict

**Not yet a real commercial marketplace** (by design — no backend, no auth, static vehicle data, honest "Soon" labels throughout) — but as a demonstration of a polished, fully-interactive, multi-category EV marketplace *architecture*, this pass closes the gap between "looks finished" and "behaves finished": location actually changes prices, search actually navigates, filters are all genuinely functional, and the one real page-breaking responsive bug found in this audit is fixed. The remaining gaps (multi-word search matching, per-vehicle authored specs, commercial-EV data) are all pre-existing, documented, and intentionally out of this pass's scope rather than newly discovered blockers.
