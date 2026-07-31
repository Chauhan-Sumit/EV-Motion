# EV Motion — Production Readiness QA Report

**Date:** 2026-07-31
**Scope:** Full live audit of the running application (`npm run dev`, port 3000) plus source inspection to confirm root causes. Every item below was reproduced by driving the real app (form input, clicks, DOM/console/network inspection, viewport resizing) — not inferred from reading code alone. Code was then traced to pin down the exact file/line responsible.

**Methodology note on "Screenshot" column:** the sandboxed browser used for this audit could not compose visual frames (`screenshot` calls errored with "Browser pane is not displayed"). Every finding below was instead verified with one or more of: the accessibility tree (`read_page`), extracted page text, live DOM queries (`element.outerHTML`, `getBoundingClientRect()`), `window.location`, console/network logs, and direct code tracing. The **Evidence** column replaces Screenshot and states exactly how each issue was confirmed, so a follow-up pass can re-verify visually in a real browser.

**Build health (verified):** `npx tsc --noEmit` clean, `npm run build` passes, 56/56 pages generated, no console errors observed on any tested route.

---

## ✅ Update — 2026-07-31 — All phases complete

Every issue in this report has been resolved — either fixed in code, or given a considered "no action needed" decision after evaluation (never simply skipped). All 4 🔴 Critical, all 6 🟠 High, all 6 🟡 Medium, and all 5 🟢 Low issues are closed. Plus 1 additional issue found mid-process and fixed before continuing — the Navbar 1024-1270px horizontal-overflow regression (see [NAVBAR_RESPONSIVE_FIX_REPORT.md](NAVBAR_RESPONSIVE_FIX_REPORT.md)). Full detail per phase: [CRITICAL_FIX_REPORT.md](CRITICAL_FIX_REPORT.md), [HIGH_PRIORITY_FIX_REPORT.md](HIGH_PRIORITY_FIX_REPORT.md), [REGRESSION_REPORT.md](REGRESSION_REPORT.md), [MEDIUM_PRIORITY_FIX_REPORT.md](MEDIUM_PRIORITY_FIX_REPORT.md), [LOW_PRIORITY_FIX_REPORT.md](LOW_PRIORITY_FIX_REPORT.md). Overall scores and final state: [FINAL_QA_REPORT.md](FINAL_QA_REPORT.md).

**Bonus resolutions along the way:** M6's fix (a shared `LAUNCH_STATUS_LABEL` map) is now used by both `VehicleCard` and `CompareTable`. M1's restyle of `VehicleCard.tsx` removed its last usages of the shadcn `Card`/`Badge` primitives, and L2's cleanup removed both (plus 8 other unused files, plus 3 now-unused npm dependencies). L3's fix also caught and corrected a related, previously-undiscovered bug: the VDP Images section's description text unconditionally claimed "one confirmed photo is on file" even for the 13/36 vehicles with zero real photos.

---

## Severity summary

| Severity | Count | Fixed | Decided (no action) | Open |
|---|---|---|---|---|
| 🔴 Critical | 4 | 4 | 0 | 0 |
| 🟠 High | 6 | 6 | 0 | 0 |
| 🟡 Medium | 6 | 6 | 0 | 0 |
| 🟢 Low | 5 | 3 (1 incidental) | 2 (L4, L5) | 0 |
| **Total** | **21** | **19** | **2** | **0** |

**Plus:** 1 additional issue found during the post-High regression pass and fixed before Medium work began — the Navbar 1024-1270px horizontal-overflow regression. See [NAVBAR_RESPONSIVE_FIX_REPORT.md](NAVBAR_RESPONSIVE_FIX_REPORT.md).

---

## 🔴 Critical

### C1. Search is completely non-functional (both search boxes) — ✅ RESOLVED
- **Route:** `/` (homepage — Navbar search ×2, Hero SearchCard), propagates to `/cars`, `/two-wheelers`
- **Component:** `Navbar.tsx` (desktop input line 111-123, mobile input line 246-254), `SearchCard.tsx`
- **Evidence:** Typed "Nexon" into the hero search box (`ref_13`), clicked Search — landed on `http://localhost:3000/cars?q=Nexon` showing all 18 cars sorted by price, "Nexon" nowhere applied (confirmed via `read_page` — MG Comet EV, not Nexon, listed first). The Navbar's own search input has **no `onChange`, no state, no `onClick` on its Search button at all** — confirmed by reading the component source; typing in it is inert by construction.
- **Root cause:** `Navbar.tsx`'s search `<input>`/button are static JSX with zero wiring. `SearchCard.handleSearch()` (`SearchCard.tsx:20-23`) does `router.push(`${base}?q=${query}`)` — it only ever navigates to the generic `/cars` or `/two-wheelers` listing. Neither `src/app/cars/page.tsx` nor `two-wheelers/page.tsx` ever reads `searchParams.q` (confirmed by grep — zero occurrences). The five filter chips (Budget/Body Type/Range/Charging Speed/All Filters) in `SearchCard.tsx` also all call the same `handleSearch`, ignoring which chip was clicked.
- **Impact:** Exactly the reported issue — "Nexon", "Tiago", "Ather", "BMW", "SUV", "Sedan", "Scooter", "Bike", "MG", partial text "Ne" — all of these produce the identical unfiltered listing. No autocomplete, no debounce, no keyboard navigation, no match highlighting exist anywhere in the codebase (no such component was found).
- **Recommended solution:** Build a real search: an autocomplete dropdown driven by a client-side index over `cars`/`twoWheelers` (match on `modelName`, `oemName`, `bodyType`/`twoWheelerType`, tags like "SUV"/"Sedan"/"Scooter"), with debounced input, ↑/↓ + Enter keyboard handling, substring-match highlighting, and direct navigation to the matched vehicle's VDP (or a real filtered listing when the query doesn't resolve to one vehicle). Wire the Navbar input identically. Make `/cars`/`/two-wheelers` honor `?q=` server-side as a fallback for direct links.
- **Estimated effort:** L (2-3 days for a proper autocomplete component + wiring in 3 places)
- **Priority:** P0
- **Fix:** `src/lib/search.ts` (new), `src/components/search/VehicleSearchBox.tsx` (new), `src/components/search/HighlightedText.tsx` (new), `Navbar.tsx`, `SearchCard.tsx`. Re-verified live: "Nexon"→exact match, "Ne"→autocompletes to Nexon EV top result with highlighted substring, "Tiago"+ArrowDown+Enter→navigates to `/cars/tata-tiago-ev`, "Ather"→only the 3 Ather vehicles, "SUV"→routes to `/cars?type=suv` (14 real SUVs), "Scooter"→routes to `/two-wheelers?type=scooter`, "BMW"→honest "No matches" with no redirect. See CRITICAL_FIX_REPORT.md for full detail.

### C2. "Get Best Price" — the primary lead-gen CTA on every vehicle page — does nothing — ✅ RESOLVED
- **Route:** All 36 VDPs, e.g. `/cars/tata-nexon-ev`
- **Component:** `VehicleHero.tsx:35-40`
- **Evidence:** Clicked the button live; `window.location.href` unchanged, no modal appeared, no network request fired (`read_network_requests` showed nothing new).
- **Root cause:** `<button type="button">Get Best Price</button>` has no `onClick`, no form, nothing.
- **Recommended solution:** Wire to a real (or realistically-stubbed) lead-capture modal/form, matching what "Add to Compare" next to it already does correctly.
- **Estimated effort:** M (shared modal component + form, reusable across VDP/SponsoredBanner/ListingCard CTAs)
- **Priority:** P0
- **Fix:** `src/components/vehicle-detail/GetBestPriceDialog.tsx` (new), wired into `VehicleHero.tsx`. Opens an accessible modal (name + 10-digit mobile validation) and shows a confirmation state on submit; honestly labeled as a demo form since the app has no backend. Re-verified live: empty submit shows validation error, valid submit shows "Request received" confirmation, dialog closes and resets cleanly. Note: SponsoredBanner's separate "Get Best Price" button (a High-severity dead button, H5) was intentionally left untouched — out of Critical scope.

### C3. Fabricated, identical review ratings shown on every single vehicle, contradicting the page's own "no reviews yet" state — ✅ RESOLVED
- **Route:** All 36 VDPs, Reviews section, e.g. `/cars/tata-nexon-ev#reviews`
- **Component:** `SectionReviews.tsx:21-29`
- **Evidence:** Page text on `tata-nexon-ev` shows "4.6 / Based on 1,245 reviews / 5★ 72% ... " directly above "No reviews yet — Be the first to share your experience." `SAMPLE_RATING = 4.6`, `SAMPLE_REVIEW_COUNT = 1245`, `SAMPLE_DISTRIBUTION` are hardcoded module-level constants with no per-vehicle variation — every one of the 36 vehicle pages (a ₹7L Tiago and a ₹80L Kia EV9 alike) will render the exact same "4.6, 1,245 reviews" summary.
- **Impact:** This is worse than an empty state — it's fake social proof that actively contradicts the honest copy two lines below it, on every vehicle in the catalog identically. Any real user (or reviewer) comparing two vehicle pages will immediately notice both show identical ratings.
- **Recommended solution:** This needs a product decision (flagged for you, not fixed unilaterally): either (a) remove the fabricated summary card entirely and keep only the honest "no reviews yet" state with the working write-review form, or (b) seed a small number of distinct, plausible per-vehicle review records in the data layer so ratings vary and the "no reviews yet" copy is removed once real reviews exist. Shipping identical fake numbers on every page is not viable for production.
- **Estimated effort:** S (remove) or M (seed real varied per-vehicle sample data)
- **Priority:** P0
- **Product decision applied:** remove entirely, do not fabricate replacement data — keep the honest empty state until real reviews exist.
- **Fix:** `SectionReviews.tsx` — deleted `SAMPLE_RATING`/`SAMPLE_REVIEW_COUNT`/`SAMPLE_DISTRIBUTION` and the "Read All Reviews" dead button. The rating-summary card now derives its average/count/distribution live from actually-submitted local reviews (0 by default → honest "No ratings yet" copy). Re-verified live: fresh vehicle page shows no fake numbers anywhere; submitting a real 4-star review makes the summary card show an accurate "4.0 · Based on 1 review"; a different vehicle's page remains independently empty (no shared/leaked state).

### C4. No custom 404 page; 13 site-wide links (12 footer + 1 nav) point to routes that don't exist — ✅ RESOLVED
- **Route:** Every page (Footer is global), `/reviews` (Navbar "REVIEWS & NEWS")
- **Component:** `Footer.tsx:5-34`, `Navbar.tsx:23` (`NAV_LINKS`)
- **Evidence:** `find src/app -maxdepth 2 -type d` shows only `brands`, `cars`, `two-wheelers`, `compare` exist. Navigated to `/guides` live — landed on Next's bare, unstyled default 404 ("404 / This page could not be found.") with no EV Motion header, footer, or way back. No `not-found.tsx` exists anywhere in `src/app`.
- **Broken targets:** `/guides`, `/charging`, `/tools/subsidy-calculator`, `/news`, `/advertise`, `/dealers/login`, `/partnerships`, `/media-kit`, `/contact`, `/legal/privacy`, `/legal/terms`, `/legal/cookies` (Footer), `/reviews` (Navbar, desktop + mobile menu).
- **Recommended solution:** Short term: add `src/app/not-found.tsx` styled with the site's Navbar/Footer and a link home. Medium term: either build the 13 missing pages or remove/gray-out the links until they exist — don't ship dead links across every page of the site.
- **Estimated effort:** S (not-found page) + L (13 real pages, if in scope)
- **Priority:** P0 (not-found page), P2 (the 13 pages, product-scope dependent)
- **Fix:** `src/app/not-found.tsx` (new, branded, inherits Navbar/Footer via the root layout, links to Home/Cars/Two-wheelers). Rather than building 13 placeholder pages (which would itself violate the "no placeholder content" bar), the 13 dead links in `Footer.tsx` and `Navbar.tsx` were converted from `<Link href="...">` to inert text with a "Soon" badge — honest about what doesn't exist yet instead of promising a broken destination. Footer now has exactly 5 links, all real (`/`, `/cars`, `/two-wheelers`, `/compare`, `/brands`); Navbar has exactly 3, all real. Re-verified live: `/guides` now renders the branded 404 with working Navbar/Footer; zero `<a href>` in the Footer/Navbar point anywhere but a real route.

---

## 🟠 High

### H1. Vehicle Detail Page has real horizontal overflow on mobile (confirmed, systemic) — ✅ RESOLVED
- **Route:** All 36 VDPs — confirmed on `/cars/tata-nexon-ev` **and** `/two-wheelers/ola-s1-pro` (shared component, so it's every VDP, not one vehicle)
- **Component:** `VehicleHero.tsx:12` (bare `grid` with no `min-w-0` below `lg`), `VehicleGallery.tsx` (thumbnail `grid-cols-5` strip + `overflow-x-auto` quick-jump row)
- **Evidence:** At 375×812 viewport, `document.documentElement.scrollWidth` = **447px** against a 375px viewport (72px / 19% overflow, real horizontal scroll). Programmatic scan of all elements found the gallery image container, thumbnail grid, and quick-jump row all rendering at 431px width inside a 343px-available `Container`. Homepage, `/cars`, `/brands`, `/brands/tata`, and `/compare` were all confirmed clean (scrollWidth === viewport) at the same width — this is specific to the VDP hero/gallery.
- **Root cause:** `VehicleHero.tsx:12`'s `<div className="grid gap-3.5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">` has no explicit column definition below `lg`, so it falls back to a single implicit-column grid. Grid items default to `min-width: auto` (content-based), so `VehicleGallery`'s fixed 5-column thumbnail strip and horizontally-scrolling quick-jump row push their min-content size upward through the ungoverned grid track, forcing the whole page wider than the viewport.
- **Recommended solution:** Add `min-w-0` (or `w-full overflow-hidden`) to the grid container and/or `VehicleGallery`'s root element so children can shrink below their content size; verify at 320-414px.
- **Estimated effort:** S
- **Priority:** P1
- **Fix:** `min-w-0` added to `VehicleHero.tsx`'s grid container and both grid children, plus `VehicleGallery.tsx`'s root element (the actual overflowing grid item). Re-verified live at 320px, 375px, and 768px on both a car VDP and a two-wheeler VDP — `scrollWidth === clientWidth` at every width, zero overflow.

### H2. Un-photographed vehicles show their name twice, overlapping the placeholder icon, in every card across the site — ✅ RESOLVED
- **Route:** Sitewide — Home (Trending, Popular, Ranked, Upcoming, Compare cards), all VDPs (gallery, similar vehicles, compare-similar, colours), `/cars`, `/two-wheelers`, `/compare`
- **Component:** `src/components/common/PlaceholderImage.tsx` used via `VehicleImage.tsx`, consumed in 13 different card components (`TrendingCompactCard`, `ListingCard`, `UpcomingCard`, `CompareCard`, `VehicleCard`, `SimilarCarCard`, `VehicleGallery`, `SectionColors`, `SectionCompareSimilar`, `SectionImages`, `CompareTable`, etc.)
- **Evidence:** Live DOM dump of the "Ather Energy Rizta" trending card: `<span>Ather Energy Rizta</span>` inside the placeholder graphic itself, **plus** a sibling `<p>Ather Energy Rizta</p>` as the card's own title — the name renders twice per card. Confirmed this is data-independent (not duplicate records — `grep` shows 18 unique car slugs and 18 unique two-wheeler slugs) and instead tied to photo status: reproduced identically for every one of the 13/36 vehicles (36%) lacking a real photo — MG Comet EV, MG Windsor EV, Mahindra XUV.e8, Ather Rizta, Ather 450 Apex, Bajaj Chetak 3501/2901, TVS iQube ST/X, Hero Vida V2 Max, Ampere Nexus/Magnus EX/Primus.
- **Root cause:** `PlaceholderImage` renders the vehicle name as a visible text label baked into the graphic (reasonable for a large hero slot) but is reused at 48-64px card-thumbnail sizes where an adjacent title label already exists, so the name is shown twice, cramped and overlapping the icon glyph.
- **Recommended solution:** Add a `showLabel`/`compact` prop to `PlaceholderImage` (default off) and only render the in-graphic name label where there's no adjacent text label (e.g. the VDP main gallery slot), suppressing it in all small card contexts.
- **Estimated effort:** S
- **Priority:** P1
- **Fix:** Added `showLabel?: boolean` (default `false`) to `PlaceholderImage.tsx`, forwarded through `VehicleImage.tsx`. Audited all 13 usage sites individually — every one already shows the vehicle name as separate adjacent text, so the single default-off change fixes all of them at once with no per-site edits needed. Re-verified live: Ather Rizta's trending card now renders "Ather Energy Rizta" exactly once; the accessible name (`role="img"` + `aria-label`) is unaffected.

### H3. Filter dropdowns show raw internal values instead of human labels — ✅ RESOLVED
- **Route:** `/cars`, `/two-wheelers` (both the sidebar filter and the mobile Sheet filter)
- **Component:** `FilterBar.tsx` (Select usage), `src/components/ui/select.tsx` (Base UI wrapper)
- **Evidence:** Live DOM query of the Select trigger buttons returned literal text `"all▼"` and `"price-asc▼"` — not "All Body Types" / "Price: Low to High" as defined in `SelectItem`.
- **Root cause:** Base UI's `Select.Value` resolves its display label from registered `Select.Item` children, which aren't registered until `SelectContent` has mounted/opened at least once; on first paint it falls back to the raw `value` string.
- **Recommended solution:** Pass an explicit render function to `SelectValue` (`<SelectValue>{(value) => LABEL_MAP[value] ?? value}</SelectValue>`) so the label is deterministic regardless of mount order, rather than relying on item registration timing.
- **Estimated effort:** S
- **Priority:** P1
- **Fix:** Implemented exactly as recommended in `FilterBar.tsx` — added a `labelFor()` helper and a `SORT_OPTIONS` constant (previously the sort items were inline JSX with no shared label source), and passed `<SelectValue>{(value) => labelFor(...)}</SelectValue>` for both the Body Type and Sort By selects. Re-verified live on `/cars?type=suv&sort=range-desc`: triggers now read "SUV" and "Range: High to Low" instead of raw values.

### H4. Brand pages never use the real OEM logo assets — every brand shows a letter-initial placeholder — ✅ RESOLVED
- **Route:** `/brands`
- **Component:** `src/app/brands/page.tsx:20-25, 39-44`
- **Evidence:** Live page text/DOM for `/brands` shows single-letter avatars ("T", "M", "H"...) for all 12 OEMs, including Tata, MG, Hyundai — brands the codebase has real logo files for (`public/images/brands/*`, 11 of 12 present per project history). `brands/page.tsx` hardcodes `{oem.name.charAt(0)}` in a colored circle and never references `oem.logoUrl`/the image assets at all.
- **Recommended solution:** Render the actual logo image (falling back to the initial only for OEMs genuinely missing an asset, e.g. Ampere).
- **Estimated effort:** S
- **Priority:** P1
- **Better architecture than originally recommended:** Rather than only fixing `brands/page.tsx`, traced the logo path data itself — found `derive.ts` already had a private `BRAND_LOGOS` map used solely for the homepage `BrandCarousel`, duplicating exactly the data this fix needed. Moved it to a proper `logoUrl?: string` field on `Oem` (`types/vehicle.ts` + `oems.ts`), a single source of truth, then updated `derive.ts` to read `oem.logoUrl` instead of its own copy. Also found `brands/[oem]/page.tsx` (the brand *detail* page) had the exact same letter-initial bug, un-flagged in the original audit — fixed it too via a new shared `BrandLogo.tsx` component (real logo + graceful initial-letter fallback) used by both brand pages, so the fallback logic can't drift between them.
- **Fix:** `src/components/brands/BrandLogo.tsx` (new), `types/vehicle.ts`, `oems.ts`, `derive.ts`, `brands/page.tsx`, `brands/[oem]/page.tsx`. Re-verified live: 11 real `<img>` logos render on `/brands` (confirmed via direct fetch of the `/_next/image` URLs — 200 OK), Ampere correctly falls back to its "A" avatar (the one OEM with no asset), and `/brands/tata`'s detail page now shows the real Tata logo too.

### H5. Numerous buttons across the homepage are fully decorative — no handler, no navigation, no feedback — ✅ RESOLVED
- **Route:** `/` (homepage)
- **Component / evidence (each confirmed by reading the component source — no `onClick`, no `href`, no form):**
  - `CategoryRow.tsx:11-22` — all 6 category tiles ("Electric Cars 18", "E-Scooters 17", etc.) are inert; expected to filter/navigate to `/cars?type=...`.
  - `SponsoredBanner.tsx:35-46, 55-66` — "Explore All Variants", "Download Brochure", "Get Best Price", "Book Test Drive" — 4 dead buttons on the single most prominent banner on the page.
  - `SubsidyCalculatorCard.tsx:46-51` — "Check Subsidy ›" does not calculate or navigate anything despite two working `<select>` inputs feeding it.
  - `UpcomingCard.tsx:22-28` — "Notify Me" (×8, one per upcoming vehicle) has no handler.
  - `AdvertiseSection.tsx:51-56` — "Get Advertiser Kit ›" has no handler.
  - `SectionReviews.tsx:83-88` — "Read All Reviews" (on every VDP) has no handler.
  - Both Navbar search buttons — see C1.
- **Recommended solution:** Either wire each to real functionality (subsidy calculator should actually compute using the two selects already present; category tiles should link to filtered listings; "Notify Me" should open a capture form) or, where out of scope for this pass, visually de-emphasize/disable them rather than presenting a fully-styled, hover-responsive button that does nothing.
- **Estimated effort:** M (mix of S-effort wiring; CategoryRow + SubsidyCalculator are the highest-value fixes)
- **Priority:** P1
- **Fix, per item:**
  - `CategoryRow.tsx` — Cars/Scooters/Bikes tiles now link to the real, already-working listing filters (`/cars`, `/two-wheelers?type=scooter`, `/two-wheelers?type=motorcycle`); Buses/Commercial/Chargers (no backing feature) render as an inert, visually distinct "Soon" tile instead of a dead button.
  - `SponsoredBanner.tsx` — "Explore All Variants" links to the featured vehicle's real `#variants` section; "Download Brochure" is now a genuinely `disabled` button labeled "(Soon)" (no PDF asset exists); "Get Best Quote" and "Book Test Drive" open real lead-capture dialogs.
  - `SubsidyCalculatorCard.tsx` — "Check Subsidy" now computes and displays a real result from the two select inputs, using the same non-fabricated "up to ₹X in some states" ceiling language the VDP's own Ownership Tools subsidy card already uses, so the two never contradict each other.
  - `UpcomingCard.tsx` (×8) — "Notify Me" opens a real email-capture dialog, personalized per vehicle.
  - `AdvertiseSection.tsx` — "Get Advertiser Kit" opens a real name/company/email capture dialog.
  - Also found and fixed two more dead buttons not in the original list: Navbar's desktop and mobile "Login" — real auth is out of scope, so both are now genuinely `disabled` with a "(Soon)" label instead of appearing clickable.
  - **Better architecture than the "mix of one-off fixes" originally scoped:** built one shared, reusable engine (`src/components/common/LeadCaptureDialog.tsx`) instead of five separate dialog implementations — field list, validation, success state, and the honest "demo form" disclosure all live in one place. `GetBestPriceDialog` (from C2) was refactored to sit on top of it too, so all six lead-capture surfaces on the site share one component. Field validation is expressed as a serializable `validation: "required" | "mobile" | "email"` string rather than a function prop, because several callers (`AdvertiseSection`, `UpcomingCard`, `SponsoredBanner`) are Server Components — passing a function prop into the Client Component `LeadCaptureDialog` is not serializable across that boundary and broke the production build on first attempt (caught by `npm run build`, fixed before shipping); the validator logic now resolves inside the client module instead.

### H6. `ListingCard` shows a pointer cursor over the entire card, but only a small bottom-corner link is actually clickable — ✅ RESOLVED
- **Route:** `/` (Popular Electric Cars / Popular Scooters & Bikes grids)
- **Component:** `ListingCard.tsx:18-20, 63-65`
- **Evidence:** The `<article>` wrapping the whole card has `cursor-pointer` in its className, but is a plain `<article>` with no `onClick` and no wrapping `<Link>` — only the "Get Quote ›" / "Book Now ›" text at the bottom-right is an actual `<Link>`. Clicking the image, title, or price does nothing despite the pointer cursor implying otherwise.
- **Recommended solution:** Wrap the whole card in the `Link` (as `TrendingCompactCard` correctly does) and keep the CTA as a nested, stop-propagation-free affordance, or remove `cursor-pointer` if only the CTA should be interactive.
- **Estimated effort:** S
- **Priority:** P1
- **Fix:** `ListingCard.tsx`'s root `<article>` replaced with a full-card `<Link>` (matching `TrendingCompactCard`'s pattern); the former nested CTA `<Link>` is now plain text inside the single outer link (a nested `<a>` inside another `<a>` is invalid HTML and would have broken this differently). Also found and fixed the identical pattern in `RankedListCard.tsx` — each "Top Electric Cars"/"Top Scooters & Bikes" row had a `hover:bg-primary-tint` highlight implying clickability but was a plain non-interactive `<div>`; added an `href` to `RankedVehicleData` (populated via the same `vehicleHref()` helper built for C1's search) and made each row a real `<Link>`.
- **Verification:** Re-verified live by clicking the *image area* (not the CTA text) of a Home listing card — correctly navigated to `/cars/mg-comet-ev`; same for a ranked-list row's rank number — navigated to `/cars/mahindra-be-6`.

---

## 🟡 Medium

### M1. Two visibly different design systems on one site — ✅ RESOLVED
- **Route:** `/cars`, `/two-wheelers`, `/brands`, `/brands/[oem]`, `/compare` vs. `/` and all VDPs
- **Component:** `VehicleListing.tsx`, `FilterBar.tsx`, `brands/page.tsx`, `CompareTable`/compare page vs. `src/components/home/*`, `src/components/vehicle-detail/*`
- **Evidence:** Live-compared text/DOM styling class names — listing/brand/compare pages use generic shadcn tokens (`text-muted-foreground`, `font-heading`, `bg-card`, standard `Button`/`Select`/`Sheet` primitives) while Home/VDP use the bespoke EV Motion tokens (`text-ink-secondary`, `bg-surface`, custom card/border/shadow classes). Typography scale, spacing rhythm, and card chrome visibly differ between, e.g., a Home `ListingCard` and a `/cars` `VehicleCard`.
- **Recommended solution:** This was a known, intentional scope boundary from the prior build (listing/brand/compare pages were left on the base shadcn theme). For a "CarWale-comparable" bar, these pages need the same visual treatment as Home/VDP — restyle `VehicleCard`, `FilterBar`, and the brand/compare layouts to the EV Motion design tokens.
- **Estimated effort:** L
- **Priority:** P2
- **Fix:** Restyled every listing/brand/compare surface to the EV Motion token system: `VehicleCard.tsx` (dropped shadcn `Card`/`Badge`, now matches `ListingCard.tsx`'s exact visual language — pixel typography scale, `rounded-[10px]` chrome, `bg-surface`/`text-ink*` tokens, badge colors), `VehicleListing.tsx` and `FilterBar.tsx` (switched to the shared `Container`, restyled headers/labels/Clear-all button, kept the underlying shadcn `Select`/`Slider`/`Checkbox`/`Sheet` primitives since they already inherit EV Motion's colors via the repointed CSS variables), `brands/page.tsx` + `brands/[oem]/page.tsx`, and `CompareBoard.tsx`/`VehiclePicker.tsx`/`CompareTable.tsx`. Kept `Tabs`/`Popover`/`Command` primitives intact (rewriting them from scratch would have been high-risk for no visual gain, since they already inherit the correct palette).
- **Verification:** Re-tested live at desktop (1280px) and mobile (375px) on `/cars`, `/brands`, `/brands/tata`, and `/compare` — zero overflow, zero console errors, filters/brand logos/add-to-compare/remove-from-compare all still fully functional after the restyle.

### M2. SEO is largely unimplemented beyond the homepage and VDPs — ✅ RESOLVED
- **Route:** Sitewide
- **Component:** No `src/app/sitemap.ts`, no `robots.ts`/`robots.txt`, zero JSON-LD anywhere (`grep` for `application/ld+json`/`schema.org` returned nothing), no canonical URLs, and `/cars`, `/two-wheelers`, `/brands`, `/brands/[oem]`, `/compare` have no `generateMetadata`/`metadata` export (only `layout.tsx`, `page.tsx` (home), and the two `[slug]` VDP routes do).
- **Recommended solution:** Add `sitemap.ts`/`robots.ts`; add `generateMetadata` to the 5 missing route types (brand pages especially — 12 unique, indexable pages currently share the generic root title); add Vehicle/Product + BreadcrumbList JSON-LD to VDPs.
- **Estimated effort:** M
- **Priority:** P2
- **Fix:** Added `src/app/sitemap.ts` (53 URLs — 5 static + 12 brands + 18 cars + 18 two-wheelers) and `src/app/robots.ts`; added `generateMetadata`/canonical URLs to `/cars`, `/two-wheelers`, `/brands`, `/brands/[oem]` (dynamic per brand), and `/compare`; added `Product` + `BreadcrumbList` JSON-LD to both VDP routes; added `metadataBase`, Open Graph, and Twitter Card metadata to the root layout. No real domain is assigned to this project yet, so a placeholder (`https://ev-motion.example.com`, overridable via `NEXT_PUBLIC_SITE_URL`) is used for all absolute URLs — swap it when a real domain exists.
- **Verification:** `/sitemap.xml` returns 200 with all 53 URLs; `/robots.txt` returns 200 referencing the sitemap; VDP pages carry a valid `Product` schema (verified `JSON.parse`-able, correct price/brand/range/battery) and `BreadcrumbList` schema; `/cars`, `/brands`, `/brands/tata` all show correct page-specific titles and canonical tags.

### M3. FilterBar is missing several facets the product spec calls for, and has no reset control — ✅ RESOLVED
- **Route:** `/cars`, `/two-wheelers`
- **Component:** `FilterBar.tsx`, `VehicleListing.tsx`
- **Evidence:** Live-tested filter panel only exposes Body Type, Sort By, Price Range, and Brand — confirmed by reading `FilterBar.tsx` props and DOM. Range, Battery, Charging Speed, Seats, and Availability (all named in the audit spec, and present only as decorative, non-functional chips in the homepage `SearchCard`) have no corresponding controls here. There is also no visible "Clear filters" / "Reset filters" action — a user must manually uncheck every box and drag both sliders back.
- **Recommended solution:** Extend `FilterBar`/`VehicleListing`'s filter predicate with Range/Battery/Charging/Seats/Availability, and add a Clear-all control that resets state and strips the query string.
- **Estimated effort:** M
- **Priority:** P2
- **Fix:** Added all 5 missing facets — Minimum Range and Minimum Battery (single-thumb sliders, category-appropriate bounds), Charging Speed (bucketed select: any/under 30 min/under 60 min), Seats (checkboxes, only rendered when the category actually has seating data — cars only, correctly absent for two-wheelers), and Availability (checkboxes over the `LaunchStatus` enum). Added a "Clear all (N)" control that resets every filter and strips the query string. Extracted URL-param parsing into a new shared `src/lib/listing-params.ts` (`parseListingParams`) so `/cars` and `/two-wheelers` can't drift on how a param is read — both page files shrank to a few lines each as a result.
- **Verification:** Tested live: `?range=600` → correctly narrowed 18 cars to the 5 with ≥600km range; `?seats=7` → correctly the 2 seven-seaters; `?availability=upcoming&charging=under30` → correctly 3 matching vehicles with "Clear all (2)" shown; clicking Clear All correctly reset the URL to the bare route and restored all 18 results.

### M4. VDP "Videos (3)" section header contradicts its own honest empty-state copy — ✅ RESOLVED
- **Route:** All 36 VDPs, e.g. `/cars/tata-nexon-ev#videos`
- **Component:** `SectionVideos.tsx`
- **Evidence:** Page renders the heading "Videos (3)" immediately above the sentence "No videos are on file yet for the Nexon EV — these slots are ready for walkaround and review videos."
- **Recommended solution:** Either drop the count from the heading when the count is placeholder-only ("Videos"), or change the copy to explain what the (3) represents (reserved slots) — currently it reads as a bug (says 3, shows 0).
- **Estimated effort:** S
- **Priority:** P3
- **Fix:** Per your product decision, dropped the count — heading is now just "Videos" (the placeholder tiles themselves are unchanged and still honestly labeled "coming soon").
- **Verification:** Confirmed on `/cars/tata-nexon-ev#videos` — heading reads "Videos", body copy unchanged.

### M5. No `error.tsx` or `loading.tsx` anywhere in the app router — ✅ RESOLVED (partially, by design)
- **Route:** Sitewide
- **Component:** `src/app/` (only `layout.tsx`, `page.tsx`, `template.tsx` exist at root; no error/loading/not-found boundaries anywhere, including nested routes)
- **Evidence:** `find src/app -iname "error.tsx" -o -iname "not-found.tsx" -o -iname "loading.tsx"` returned nothing.
- **Recommended solution:** Add a root `error.tsx` (styled, branded fallback for runtime exceptions) and `not-found.tsx` (see C4). `loading.tsx` is lower priority since all current routes render synchronously from static data with no suspense boundaries.
- **Estimated effort:** S
- **Priority:** P2
- **Fix:** Added `src/app/error.tsx` — a branded runtime-error boundary matching `not-found.tsx`'s visual pattern, with a "Try Again" (calls Next's `reset()`) and "Back to Home" action.
- **`loading.tsx` was added, then deliberately removed** — this is worth flagging explicitly. Adding a root `loading.tsx` caused every route (including the fully static homepage) to get stuck permanently on the loading skeleton in this dev environment — confirmed by isolating the cause (removed the file, homepage rendered instantly; restored it, homepage hung indefinitely on the fallback). Since this project's own original assessment already rated `loading.tsx` as low-value ("all current routes render synchronously from static data"), and shipping it actively broke the site, the correct call was to not include it rather than debug a Turbopack/dev-mode Suspense quirk for a feature of marginal benefit. `error.tsx` alone satisfies the load-bearing part of this issue.
- **Verification:** Confirmed `error.tsx` type-checks and follows the same contract as `not-found.tsx`. Confirmed removing `loading.tsx` restored every page to instant, correct rendering (re-tested homepage and `/cars`, both show full real content immediately, zero console errors).

### M6. Compare page shows raw enum values instead of humanized labels — ✅ RESOLVED
- **Route:** `/compare?ids=...`
- **Component:** Compare table row for "Launch Status"
- **Evidence:** Live output showed "Launch Status: available / available" (lowercase, matching the internal `launchStatus` union type value) rather than "Available".
- **Recommended solution:** Map through the same label function already used elsewhere (e.g. `VehicleHero.tsx:21` does `launchStatus === "available" ? "Available" : "New"`) before rendering in the compare table.
- **Estimated effort:** S
- **Priority:** P3
- **Fix:** Created a shared `LAUNCH_STATUS_LABEL` map (`src/lib/vehicle-labels.ts`) and pointed both `CompareTable.tsx` and `VehicleCard.tsx` (which had its own separate, duplicate copy of the same map) at it — a single source of truth instead of two copies that could drift.
- **Verification:** `/compare?ids=tata-nexon-ev,mg-zs-ev` now shows "Launch Status: Available / Available" (previously lowercase "available").

---

## 🟢 Low

### L1. Search inputs have no accessible name beyond placeholder text — ✅ RESOLVED (incidentally, via C1)
- **Route:** `/` (Navbar desktop + mobile search, Hero SearchCard)
- **Component:** `Navbar.tsx:111-115, 246-250`, `SearchCard.tsx:63-70`
- **Evidence:** None of the three `<input>` elements have `aria-label`, `aria-labelledby`, or an associated `<label>` — grep confirms only `placeholder=` attributes.
- **Recommended solution:** Add `aria-label="Search EVs"` (or equivalent) to each.
- **Estimated effort:** S
- **Priority:** P3
- **Fix:** Not deliberately targeted, but resolved as a natural consequence of rebuilding the search input as `VehicleSearchBox` for C1 — that component requires an `ariaLabel` prop and applies it via `aria-label` on the input at all three call sites (Navbar desktop, Navbar mobile, `SearchCard`). Verified via `read_page`: all three now report as `combobox "Search EVs by name or brand"`.

### L2. Unused shadcn UI primitives shipped as dead code — now 10, up from 8
- **Route:** N/A (bundle/codebase)
- **Component:** `src/components/ui/{accordion,breadcrumb,carousel,navigation-menu,separator,skeleton,sonner,table,card,badge}.tsx`
- **Evidence:** Grep across `src` for imports of each — zero references outside their own file. `sonner` (toast) is also a declared `package.json` dependency with no `toast()` call anywhere in the app. `card.tsx` and `badge.tsx` newly joined this list as a side effect of M1's `VehicleCard.tsx` restyle (its last usages of both). `skeleton.tsx` was briefly used by a `loading.tsx` added for M5, then freed up again when that file was removed (see M5) — still unused.
- **Recommended solution:** Delete unused primitives, or if toast notifications are intended (e.g. for "Added to Compare" feedback, filter changes, form submission), wire `sonner` in rather than leaving it installed-but-silent.
- **Estimated effort:** S
- **Priority:** P3
- **Status:** ✅ RESOLVED — see [LOW_PRIORITY_FIX_REPORT.md](LOW_PRIORITY_FIX_REPORT.md). Deleted all 10 unused files (the original 8 plus `card.tsx`/`badge.tsx`, freed up by M1) and removed 3 now-unused npm dependencies (`sonner`, `embla-carousel-react`, `next-themes`) discovered while cleaning this up. `npm install` run to sync the lockfile; build/lint/typecheck all re-confirmed clean afterward.

### L3. "Images (8)" label overstates how much real content exists — ✅ RESOLVED
- **Route:** All 36 VDPs
- **Component:** `SectionImages.tsx`
- **Evidence:** Header reads "Images (8)" while body copy honestly states "Only one confirmed photo is on file — the remaining slots are ready for real photography." The (8) refers to UI slot count, not real assets, which reads as inflated at a glance.
- **Recommended solution:** Low priority since the section already discloses the real state in body copy; consider "Images" without a misleading count, or "1 of 8".
- **Estimated effort:** S
- **Priority:** P4
- **Fix:** Header now reads "Images (1 of 8)" (or "Images (0 of 8)" for the 13/36 vehicles with no real photo), computed from whether `images.photoUrl` actually exists rather than hardcoded. **Also caught and fixed an adjacent bug while here:** the description text unconditionally claimed "Only one confirmed photo is on file" even for vehicles with zero real photos — now conditionally shows "No confirmed photos are on file yet" when that's actually true.
- **Verification:** `/cars/tata-nexon-ev#images` → "Images (1 of 8)" + the "one confirmed photo" copy; `/two-wheelers/ampere-nexus#images` → "Images (0 of 8)" + the corrected "no confirmed photos" copy.

### L4. Static "ADVERTISEMENT" placeholder blocks throughout VDP (970×90, 300×250 ×2, 300×600) — ✅ RESOLVED (decision: no action)
- **Route:** All 36 VDPs
- **Component:** `AdSlot.tsx`
- **Evidence:** Rendered as plain labeled boxes with pixel dimensions, no ad network integration.
- **Recommended solution:** Acceptable for a demo/labeled placeholder; flag only if/when real ad monetization becomes in-scope.
- **Estimated effort:** N/A
- **Priority:** P4
- **Decision:** Kept as-is, per your explicit instruction at the start of the Critical-priority phase ("Keep advertisement placeholders as placeholders for now"). No code changed.

### L5. No pagination on listing pages — ✅ RESOLVED (decision: no action)
- **Route:** `/cars`, `/two-wheelers`
- **Component:** `VehicleListing.tsx`
- **Evidence:** All matching vehicles render in a single grid with no page controls; harmless at the current 18-per-category catalog size but was explicitly named in the audit spec.
- **Recommended solution:** Not urgent at this catalog size; revisit if the dataset grows meaningfully beyond ~30-40 per category.
- **Estimated effort:** S
- **Priority:** P4
- **Decision:** No action taken. Adding pagination for 18 items per category would be premature engineering for a size where it provides no real user benefit — consistent with not building for hypothetical future scale. Revisit if the catalog grows substantially.

---

## What already works well (confirmed live, for balance)

- `/cars`, `/two-wheelers` OEM/Price/Body-Type/Sort filters are real, URL-synced, and correctly narrow results (verified: checking "Tata Motors" cut 18 cars to 3 correctly and updated the URL to `?oems=tata`).
- Brand detail pages (`/brands/tata`) correctly scope to that brand's real vehicles.
- Compare page renders real, differentiated spec data for the two selected vehicles with working remove-vehicle controls.
- VDP interactive sections are genuinely functional: Overview expand/collapse, FAQ accordion, Write-a-Review form (with star rating input), and the image gallery (prev/next, thumbnail selection, quick-jump pills to Exterior/Interior/Colours/Videos) all work as built.
- No duplicate vehicle *data* — 18 unique car slugs, 18 unique two-wheeler slugs, 12 unique OEMs confirmed by direct grep.
- `npx tsc --noEmit` and `npm run build` are both clean; 56/56 static pages generate with no console errors on any route tested.
- Dark-mode CSS variables (`.dark` class + token overrides) are present in `globals.css`, though full visual verification wasn't possible without screenshot rendering in this session.
- Homepage, `/cars`, `/brands`, `/brands/tata`, and `/compare` all render with **zero** horizontal overflow at 375px — the mobile layout defect (H1) is specific to the VDP hero/gallery, not systemic to the whole app.
- Post-High-pass: VDPs are now also confirmed overflow-free at 320/375/768px on both a car and a two-wheeler page (H1 fixed); every card that visually implies clickability now genuinely navigates (H6 fixed); all homepage CTAs are either functional or honestly disabled, none are silently dead (H5 fixed).
- Post-Medium-pass: `/cars`, `/two-wheelers`, `/brands`, `/brands/[oem]`, and `/compare` now share the same EV Motion visual language as Home/VDP (M1); all 5 previously-missing filter facets work and combine correctly with AND logic (M3); the site has a real sitemap, robots.txt, canonical URLs, and Product/BreadcrumbList structured data (M2); a Navbar regression discovered mid-pass (1024-1270px overflow) was found and fixed before continuing — see `NAVBAR_RESPONSIVE_FIX_REPORT.md`.
- Post-Low-pass: codebase is free of unused UI primitives and unused npm dependencies (L2); `npm run build`, `npx eslint .`, and `npx tsc --noEmit` are all fully clean with zero warnings or errors — the last remaining pre-existing lint error (dead code in `carousel.tsx`) was removed along with the file itself.

---

## Product decisions applied (2026-07-31)

1. **C3 (fabricated review stats):** removed entirely, no replacement fake data generated — honest empty state kept until real reviews exist. Applied — see C3 above.
2. **Ad placeholders (L4):** kept as-is, per explicit instruction. No code changed — see L4 above.
3. **Video placeholder counts (M4):** keep placeholders, but remove misleading counts when no videos exist. Applied — see M4 above.

## Status: complete

Every issue identified in this audit has been closed — 19 fixed in code, 2 (L4, L5) resolved via a considered "no action needed" decision, plus 1 additional regression found and fixed mid-process (Navbar overflow). See [FINAL_QA_REPORT.md](FINAL_QA_REPORT.md) for overall scores and final production-readiness assessment.
