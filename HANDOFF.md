# EV Motion — Project Handoff

**Project directory:** `C:\Users\sumit\ev-wale`
**Last updated:** 2026-07-31
**Status:** Feature-complete demo marketplace. Full production-readiness QA cycle (audit → Critical → High → Medium → Low fixes) is complete — see [QA HISTORY](#qa-history) below. Nothing is committed to git yet from this session — see [Known Limitations](#known-limitations).

---

## PROJECT OVERVIEW

### Project purpose

EV Motion is a demo Indian electric-vehicle marketplace — a CarWale/BikeWale-style site for browsing, filtering, and comparing electric cars and two-wheelers. It began as an original build ("EV Wale") with its own 36-vehicle dataset, then was reskinned to match a user-supplied Next.js template's exact visual design ("EV Motion" branding), and has since been through a full multi-pass QA audit and remediation cycle to bring it to a genuinely interactive, production-quality state. It has no backend — all data is static TypeScript, and every "submit" action (lead capture, reviews) is a local, honestly-labeled demo interaction.

### Tech stack

- **Next.js 16** (App Router, Turbopack) — ⚠️ this version has real breaking changes vs. training-data assumptions; see `AGENTS.md` / `node_modules/next/dist/docs/` before writing App Router code. Confirmed: `params`/`searchParams` are `Promise`s that must be `await`ed, and generated `PageProps<'/route/path'>` / `LayoutProps<...>` global types exist and are used instead of hand-written prop shapes.
- **React 19**, **TypeScript** (strict — `npx tsc --noEmit` is part of the project's quality gate)
- **Tailwind CSS v4** — theme defined via a `@theme` block in `src/app/globals.css`, not a `tailwind.config.js`
- **shadcn/ui on Base UI** (not Radix) — see [Architectural Decisions](#architectural-decisions) for the `render`-prop implication
- **framer-motion** (page transitions, card hover, gallery animations), **lucide-react** (icons), **cmdk** (compare page's vehicle picker command palette)
- No backend, no database, no auth — 100% static data + client-side interactivity

### Folder structure

```
src/
  app/                          Next.js App Router routes
    page.tsx                    Homepage
    layout.tsx                  Root layout — Navbar/Footer, metadataBase, global metadata
    template.tsx                Wraps every route in PageTransition (framer-motion fade+slide)
    error.tsx                   Branded runtime-error boundary
    not-found.tsx                Branded 404 (also used for any unresolved route)
    sitemap.ts / robots.ts      Generated SEO routes (53 URLs; see SEO section)
    cars/page.tsx                /cars listing
    cars/[slug]/page.tsx         Car VDP (static params for all 18 cars)
    two-wheelers/page.tsx        /two-wheelers listing
    two-wheelers/[slug]/page.tsx Two-wheeler VDP (static params for all 18)
    brands/page.tsx              /brands index
    brands/[oem]/page.tsx        Per-brand page (static params for all 12 OEMs)
    compare/page.tsx             /compare
  components/
    home/                       Homepage-only sections (Hero, SearchCard, TrendingCompactSection, MainLayout + CategoryRow/SponsoredBanner/ListingGrid/BrandCarousel/RankedListCard/SubsidyCalculatorCard, UpcomingSection, CompareSection, WhyEvMotionSection, AdvertiseSection)
    vehicle-detail/             VDP-only sections (VehicleHero, VehicleGallery, SectionOverview/Variants/Battery/OwnershipTools/CompareSimilar/Colors/Features/Images/Videos/Reviews/Faqs, SectionLatestNews, SectionSimilarElectricCars, VehicleSidebar, StickyTabs, GetBestPriceDialog)
    vehicles/                   Shared across /cars, /two-wheelers, /brands/[oem], /compare (VehicleCard, VehicleListing, FilterBar, VehicleImage, CompareBoard, CompareTable, VehiclePicker)
    search/                     VehicleSearchBox (the real search/autocomplete widget) + HighlightedText
    brands/                     BrandLogo (real logo image with initial-letter fallback)
    common/                     PlaceholderImage, LeadCaptureDialog (shared lead-capture engine)
    layout/                     Navbar, Footer, PageTransition
    ui/                         shadcn/Base UI primitives actually in use (button, checkbox, command, dialog, input, input-group, label, popover, select, sheet, slider, tabs, textarea) plus two small hand-rolled ones (Block, BlockHeading, Container)
  lib/
    data/                       cars.ts, two-wheelers.ts, oems.ts (raw Vehicle/Oem records) + index.ts (getOemBySlug, getVehiclesByOem, getAllVehicles, getVehicleBySlug)
    data/ev-motion/             content.ts, derive.ts, toVehicleDetail.ts — adapters that reshape raw Vehicle data into the homepage/VDP's card-shaped view models
    search.ts                   Vehicle search/autocomplete logic (see Architectural Decisions)
    listing-params.ts           Shared URL-param parsing for /cars and /two-wheelers
    vehicle-labels.ts           Shared LaunchStatus → human label map
    structured-data.ts          JSON-LD builders (Product, BreadcrumbList)
    site.ts                     SITE_URL constant (placeholder domain, see Known Limitations)
    utils.ts                    cn() Tailwind class helper
  types/                       vehicle.ts, vehicle-detail.ts, ev-motion.ts
  hooks/                       useCarouselScroll.ts
```

### Architecture overview

This is a **static-data-driven Next.js App Router site**. There is no API layer — every page imports directly from `src/lib/data/*` at build/request time. Pages fall into two render strategies:
- **Static (SSG)**: homepage, all 36 vehicle VDPs, all 12 brand pages, `/brands` — pre-rendered at build time via `generateStaticParams`.
- **Dynamic**: `/cars`, `/two-wheelers`, `/compare` — server-rendered per-request because they read `searchParams` for filter/compare state.

The homepage and VDPs are the fully bespoke "EV Motion" reskin (see Design system below); `/cars`, `/two-wheelers`, `/brands`, `/brands/[oem]`, and `/compare` were originally left on generic shadcn styling as an explicit scope boundary, but **that boundary was closed during the Medium-priority QA pass** — all pages now share one visual language (see QA History).

### Design system overview

Defined in `src/app/globals.css`'s Tailwind v4 `@theme` block — no separate config file:
- **Color tokens**: `primary` (green `#1FA83C`, + `-hover`/`-tint`/`-bright` variants), `ink`/`ink-secondary`/`ink-muted` (text), `surface`/`surface-secondary`/`surface-dark` (backgrounds), `border`/`border-strong`, semantic `hot`/`info`/`warning`/`error`.
- **Shadows/animation**: `shadow-card`, `shadow-card-hover`, `shadow-popover`, `animate-fade-in`, `animate-pulse-dot`.
- **Utilities**: `.focus-ring` (consistent focus-visible ring used on every interactive element), `.scroll-row` (horizontal-scroll carousel styling), `.line-clamp-*`.
- **Typography**: Inter (via `next/font/google`), applied through pixel-precise Tailwind arbitrary values (`text-[13px]`, `text-[11px]`, etc.) rather than the default `text-sm`/`text-xs` scale — this precise scale is what the shared components (`VehicleCard`, `FilterBar`, brand/compare pages) were aligned to during the Medium-priority pass.
- shadcn's own semantic CSS variables (`--primary`, `--background`, etc.) are **repointed to the same palette**, so any shadcn primitive still in use (Select, Slider, Checkbox, Sheet, Tabs, Popover, Command, Dialog) already renders in the correct brand colors without needing to be rewritten.

---

## CURRENT IMPLEMENTATION

Everything below is live, interactive, and has been verified in-browser (not just read from source) as of the final QA pass.

**Homepage** (`src/app/page.tsx`) — Hero with background image and tagline, a real search card (Car/Bike toggle + autocomplete search box + "Browse all" + filter-shortcut chips), a trending-vehicles horizontal scroll section, the main grid (category tiles, a sponsored banner with working lead-capture CTAs, popular-vehicle listing grids, a brand carousel, ranked "Top 8 by range" lists, a subsidy calculator that computes a real illustrative result), an upcoming-vehicles section, a compare-pairs section, a "Why EV Motion" feature strip, and an advertiser section with a working lead-capture dialog.

**Search system** — a real, shared `VehicleSearchBox` component (`src/components/search/`) used in three places: the Navbar (desktop + mobile), and the homepage hero. Debounced (180ms) substring matching across all 36 vehicles' brand+model names, plus keyword routing for category terms ("SUV", "Sedan", "Scooter", "Bike", etc.) straight to the real, already-working listing filters — never a fake round-trip. Full keyboard support (↑/↓ to navigate suggestions, Enter to select, Escape to close), match-text highlighting, and a brand-only match surfaces a "View all N {Brand} vehicles" shortcut to that brand's page. See [Architectural Decisions](#architectural-decisions) for why it's built this way instead of a server-side search API.

**Navigation** — Navbar (logo, NEW CARS / SCOOTERS & BIKES links, search, dark-mode toggle, city/language dropdowns, disabled "Login (Soon)" placeholder) and Footer (real links to every working route; anything without a real destination is rendered as inert "Soon"-labeled text, never a clickable dead link). The Navbar is responsive across three tiers: mobile hamburger below 1024px, an icon-only "compact" desktop tier from 1024-1279px (search box narrows, city/language/login collapse to icon-only with preserved `aria-label`s, the decorative ad slot hides), and the full desktop layout from 1280px up.

**Listing pages** (`/cars`, `/two-wheelers`) — `VehicleListing.tsx` + `FilterBar.tsx`, shared across both categories via a `category` prop. Real, URL-synced filtering and sorting (see Filters below), rendered through the shared `VehicleCard` component.

**Vehicle Detail Pages** (`/cars/[slug]`, `/two-wheelers/[slug]`) — one shared template (`VehicleDetailTemplate.tsx`) driving both categories. Section order: Overview → Variants → Battery & Charging → Ownership Tools → Compare Similar → Colours → Features → Images → Videos → Reviews → FAQs, then full-width Latest News and Similar Vehicles. Interactive gallery (prev/next, thumbnail strip, quick-jump pills to Exterior/Interior/Colours/Videos, honest "photo coming soon" placeholders for unphotographed angles), expandable Overview, accordion FAQs, a working write-a-review form, and a real lead-capture dialog behind "Get Best Price."

**Brand pages** (`/brands`, `/brands/[oem]`) — real logo images for 11 of 12 OEMs (Ampere has no logo asset, correctly falls back to an initial-letter avatar via the shared `BrandLogo` component), each brand page correctly scoped to that brand's real vehicles.

**Compare page** (`/compare`) — add up to 4 vehicles (category-locked — can't mix cars and two-wheelers), a real `cmdk`-powered searchable vehicle picker, a live spec comparison table, remove-vehicle controls, URL-shareable via `?ids=`.

**Responsive behaviour** — verified with zero horizontal overflow across an extensive breakpoint sweep (320/360/375/390/414/768/1024/1100/1150/1152/1200/1250/1260/1280/1440/1920px) on every page type. Two real overflow bugs were found and fixed during QA (VDP hero/gallery at mobile widths; the Navbar's utility row at the 1024-1270px band) — both fixed at the CSS root cause (`min-w-0` on the actual overflowing flex/grid items, and a genuine 3-tier responsive redesign of the Navbar), not papered over.

**Filters** — `FilterBar.tsx` supports Body Type / Type, Sort (price asc/desc, range desc), Price Range, Minimum Range, Minimum Battery, Charging Speed (bucketed), Seats (cars only — dynamically shown only when the current vehicle list actually has seating data), and Availability (Available / Just Launched / Upcoming). All facets combine with AND logic, are URL-synced (shareable/bookmarkable), and a "Clear all (N)" control resets everything.

**SEO** — `sitemap.ts` (53 URLs: 5 static routes + 12 brands + 18 car VDPs + 18 two-wheeler VDPs), `robots.ts`, per-route `generateMetadata`/canonical URLs on every route type including dynamic per-brand titles, Open Graph + Twitter Card metadata on the root layout, and `Product` + `BreadcrumbList` JSON-LD on every VDP (`src/lib/structured-data.ts`).

**Accessibility** — a skip-to-content link, `.focus-ring` used consistently on every interactive element, `aria-label`s on icon-only controls (verified to persist correctly even when a control's visible text is responsively hidden, e.g. the Navbar's compact-tier city/language/login buttons), `disabled` attribute (not just visual styling) on genuinely non-functional buttons, semantic heading structure. Not independently audited against WCAG with automated tooling (axe/Lighthouse) or a screen-reader pass — see Known Limitations.

**Performance** — 58 total routes, the large majority statically pre-rendered at build time; only `/cars`, `/two-wheelers`, and `/compare` render per-request (they read `searchParams`). Images go through `next/image`. Total JS bundle ~1.7MB uncompressed, no single chunk over 225KB. No Lighthouse/Core Web Vitals baseline has been run — see Known Limitations.

**Shared components** worth knowing about before changing anything: `VehicleImage` (real photo vs. branded placeholder, used everywhere a vehicle image appears), `PlaceholderImage` (the branded fallback graphic — has a `showLabel` prop, default `false`, because every real usage already shows the vehicle name as separate adjacent text), `BrandLogo`, `LeadCaptureDialog` (the one engine behind all five lead-capture surfaces on the site — Get Best Price, Get Best Quote, Book Test Drive, Notify Me, Get Advertiser Kit), `VehicleSearchBox`, `Container`/`Block`/`BlockHeading`.

**Design tokens** — see [Design system overview](#design-system-overview) above.

---

## QA HISTORY

This project went through a complete, live-browser-verified production-readiness QA cycle (not a code-only review):

| Phase | Issues | Fixed |
|---|---|---|
| 🔴 Critical | 4 | 4 |
| 🟠 High | 6 | 6 |
| 🟡 Medium | 6 | 6 |
| 🟢 Low | 5 | 3 fixed in code + 2 resolved via considered "no action needed" decisions |
| Additional regression found mid-process | 1 (Navbar 1024-1270px overflow) | 1 |
| **Total** | **22** | **22 — zero remaining** |

Critical fixes included: a real search implementation (search was previously completely non-functional), a working "Get Best Price" lead-capture flow, removal of fabricated review ratings in favor of an honest empty state, and a branded 404 page with all dead footer/nav links either fixed or honestly marked "Soon." High-priority fixes covered the VDP mobile-overflow bug, a placeholder-image bug that double-rendered vehicle names on 13/36 vehicles, filter dropdowns showing raw values instead of labels, missing brand logos, a dozen-plus dead buttons across the homepage, and inconsistent card click behavior. Medium-priority work unified the site's visual design system, added full SEO infrastructure, extended the filter set, and added a branded error boundary. Low-priority work cleaned up 10 unused files and 3 unused npm dependencies and corrected a couple of minor copy/labeling issues.

**Final outcome:** every issue identified across the whole process has a documented resolution. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` are all clean with zero errors or warnings. Full detail, evidence, and file-level changes for every item live in the repo root: `QA_REPORT.md` (the original audit, now annotated with resolution status inline), `CRITICAL_FIX_REPORT.md`, `HIGH_PRIORITY_FIX_REPORT.md`, `REGRESSION_REPORT.md`, `NAVBAR_RESPONSIVE_FIX_REPORT.md`, `MEDIUM_PRIORITY_FIX_REPORT.md`, `LOW_PRIORITY_FIX_REPORT.md`, and `FINAL_QA_REPORT.md` (overall scores: Production Readiness 84/100, UX 88, UI 85, Accessibility 75, SEO 82, Performance 78, Mobile Responsiveness 95, Code Quality 88 — each with its own justification in that file, not just a bare number).

---

## KNOWN LIMITATIONS

These are intentional, considered decisions — not bugs waiting to be fixed:

- **Advertisement slots are static placeholders** (`AdSlot.tsx`, plus the homepage's "Ad Space" box) — labeled "ADVERTISEMENT" with real pixel dimensions but no ad network integration. Kept as-is per explicit product decision; revisit only if real ad monetization becomes in-scope.
- **No pagination on listing pages** — at 18 vehicles per category, a single page is the right call; adding pagination now would be premature engineering. Revisit if the catalog grows past roughly 30-40 per category.
- **Reviews and Latest News are honest empty states, not populated content** — every vehicle genuinely has zero reviews and zero news coverage; the UI says so plainly rather than fabricating either. The write-a-review form is fully functional and will show real, dynamically-computed rating summaries the moment a review is submitted (verified — not decorative).
- **Images/Videos gallery slots are partially placeholder** — 23 of 36 vehicles have one confirmed real photo; the rest (and every vehicle's video slots) show explicitly-labeled "coming soon" placeholders. Section headers accurately reflect real vs. placeholder counts (e.g. "Images (1 of 8)").
- **No real backend** — every "submit" action (Get Best Price, Book Test Drive, Notify Me, Get Advertiser Kit, Write a Review) is local React state with an honest "Demo form — no data is sent anywhere" disclosure. This is a deliberate scope boundary for a frontend demo, not an oversight.
- **Placeholder domain for SEO/canonical URLs** — `https://ev-motion.example.com` (`src/lib/site.ts`, overridable via `NEXT_PUBLIC_SITE_URL`), since no real domain has been assigned yet. Swap the env var when one exists; nothing else needs to change.
- **A handful of shadcn primitives were deliberately left in their generic (non-EV-Motion-themed) styling** — `Tabs` on the Compare page, `Popover`/`Command` in the vehicle picker — a considered choice to avoid rewriting working, accessible components for marginal visual gain, not an oversight.
- **No independent performance or accessibility lab audit** — no Lighthouse/Core Web Vitals run, no axe-core scan, no manual screen-reader pass. What's documented in the QA reports is verified through live interaction and code inspection, which is a different (and narrower) thing than an automated accessibility/performance audit.

---

## ARCHITECTURAL DECISIONS

**Search architecture** — client-side, not a server API. `src/lib/search.ts` exports a pure `searchVehicles(query)` function that does a scored substring match across the in-memory `Vehicle[]` array (imported directly, no fetch), plus a small keyword table mapping category terms ("SUV", "Scooter", etc.) to the *existing, already-working* listing-filter URLs (`/cars?type=suv`) rather than inventing a second filtering mechanism. This was the right call given the whole dataset (36 vehicles) fits trivially in memory and ships with every page anyway — a server round-trip would add latency for zero benefit at this scale. `VehicleSearchBox` (the UI) is a single shared component used in all three places search appears, so keyboard handling, debouncing, and result rendering can't drift between instances. If the catalog ever grows to the point where in-memory scanning stops being trivial, this is the one place that would need to change to a real index/API — the component boundary was drawn specifically so that swap wouldn't require touching the UI.

**Routing strategy** — flat URL shape throughout: `/cars/[slug]`, `/two-wheelers/[slug]`, `/brands/[oem]`, not nested brand-scoped paths. All dynamic segments use `generateStaticParams` for build-time SSG except the three pages that read `searchParams` (`/cars`, `/two-wheelers`, `/compare`), which are necessarily dynamic. `not-found.tsx` and `error.tsx` are both defined once at the root and apply everywhere.

**Component hierarchy** — three parallel "vertical slices" that share almost nothing at the component level but a lot at the data level: `components/home/*` (homepage only), `components/vehicle-detail/*` (VDP only), and `components/vehicles/*` (the listing/brand/compare pages, i.e. everywhere a vehicle needs to render as a generic card or spec row rather than in a bespoke homepage/VDP layout). This split exists because the homepage and VDP were built to pixel-match a supplied design template, while the listing/brand/compare pages were always meant to be simpler, data-driven views — but during the Medium-priority QA pass, all three slices were brought onto the same design-token system, so the split is now purely organizational, not visual.

**Shared utilities** (`src/lib/`) — anything used by more than one of the three component slices above lives here, not duplicated: `search.ts` (search/autocomplete), `listing-params.ts` (URL-param parsing shared by `/cars` and `/two-wheelers`), `vehicle-labels.ts` (the `LaunchStatus` → human-label map used by both `VehicleCard` and `CompareTable`), `structured-data.ts` (JSON-LD builders), `site.ts` (the SITE_URL constant), and `data/index.ts`'s lookup helpers (`getOemBySlug`, `getVehicleBySlug`, etc.). This consolidation happened incrementally during the QA process specifically because duplicated copies of the same logic were found drifting apart (e.g. `VehicleCard` and `CompareTable` each had their own separate launch-status label map before `vehicle-labels.ts` existed) — treat any new "same logic in two places" as a bug to fix the same way, not a style preference.

**Data flow** — one-directional and static: `src/lib/data/{cars,two-wheelers,oems}.ts` (raw `Vehicle`/`Oem` records) → `src/lib/data/ev-motion/{content,derive,toVehicleDetail}.ts` (adapters that reshape raw vehicles into the specific view-model shapes each home/VDP component expects, e.g. `ListingCardData`, `VehicleDetail`) → components. Nothing fetches at runtime; everything is imported directly. If you need a new derived view (a new card shape, a new spec grid), add a function to `derive.ts` rather than reshaping data inline inside a component.

**State management** — no global state library. Each interactive feature owns its own local `useState`, synced to the URL via `router.replace(..., { scroll: false })` wherever the state should be shareable/bookmarkable (all listing filters, the compare page's selected vehicles). Dialog/dropdown open-state is local to each component. This was sufficient because nothing in the app needs cross-component state that isn't already expressible as "what's in the URL."

**Responsive strategy** — Tailwind's `sm`/`lg`/`xl` breakpoints, no custom breakpoints. The one place a genuinely custom 3-tier strategy was needed (the Navbar, `lg` for "has room for search+icons" turned out to be wrong at 1024-1279px) was solved by adding an `xl:` tier specifically for that component rather than changing the project's global breakpoint conventions — see `NAVBAR_RESPONSIVE_FIX_REPORT.md` for the full reasoning. The general rule applied throughout the QA process: prefer `min-w-0` + flexible sizing + responsive visibility over fixed pixel widths whenever a genuine overflow bug is found, since fixed widths are what caused both real overflow bugs this project had.

---

## FUTURE ROADMAP

Not started, in rough order of how foundational they are:

1. **Real backend + database** — everything currently in `src/lib/data/*` would move to a real data store; this is the prerequisite for almost everything else below.
2. **Authentication + user accounts** — the Navbar's "Login" button is currently a labeled, disabled placeholder ("Login (Soon)").
3. **Reviews API** — `SectionReviews.tsx` already has real local-state review submission and dynamically-computed rating summaries; wiring it to a real backend is additive, not a rewrite.
4. **Dealer portal** — the homepage's "Advertise on EV Motion" section and its lead-capture dialog are the natural entry point; a real dealer-facing portal would sit behind them.
5. **CMS for editorial content** — "Latest News" is currently an honest empty state on every VDP; a real content pipeline would populate it.
6. **Favorites / saved vehicles, synced across devices** — needs accounts first.
7. **Analytics** — no analytics/tracking is wired up anywhere currently.
8. **Admin dashboard** — for managing the vehicle catalog, brands, and dealer leads once there's a real backend.

---

## PROJECT STATUS

**Not production-ready in the sense of "deploy this and take real customers" — but that gap is entirely the intentional limitations above, not unresolved bugs.** Every interactive feature that exists works correctly, has been live-tested, and the codebase is clean (zero TypeScript errors, zero lint errors/warnings, clean build). What stands between this and a real production marketplace is exactly the Future Roadmap above: a backend, auth, real content pipelines, and independent performance/accessibility lab audits — none of which are QA/bug-fix work, they're net-new features and infrastructure that were never in scope for this pass. As a frontend demo of what a polished, fully-interactive EV marketplace looks like, this is complete and hardened.

---

## How the next Claude session should continue

1. **Read this file, then skim the 8 QA report files in the repo root** (`QA_REPORT.md` → `CRITICAL_FIX_REPORT.md` → `HIGH_PRIORITY_FIX_REPORT.md` → `REGRESSION_REPORT.md` → `NAVBAR_RESPONSIVE_FIX_REPORT.md` → `MEDIUM_PRIORITY_FIX_REPORT.md` → `LOW_PRIORITY_FIX_REPORT.md` → `FINAL_QA_REPORT.md`) if the task touches anything already covered there — they contain the *why* behind non-obvious decisions (e.g. why `loading.tsx` doesn't exist, why some shadcn primitives were deliberately left unrestyled, why the search box is client-side).
2. **Don't assume the codebase matches an earlier memory of this project.** If anything here looks stale, trust the actual files over this document — re-verify with `git log`, `git status`, and a fresh read of the relevant source before making changes.
3. **Before changing any shared file** (`src/lib/search.ts`, `vehicle-labels.ts`, `listing-params.ts`, `structured-data.ts`, `VehicleImage.tsx`, `PlaceholderImage.tsx`, `LeadCaptureDialog.tsx`, `VehicleSearchBox.tsx`, `BrandLogo.tsx`), grep for every usage first — each of these is intentionally shared across multiple pages/components specifically to avoid the kind of drift the QA process kept finding and fixing.
4. **This shadcn setup uses Base UI, not Radix.** Composing a non-Button element (e.g. a `Link`) into a `Button`/`SheetTrigger`/`DialogTrigger`/etc. requires the **`render` prop**, not `asChild` — e.g. `<Button render={<Link href="/cars" />} nativeButton={false}>`.
5. **Next.js 16 has real breaking changes vs. training-data assumptions** — read `node_modules/next/dist/docs/` before writing new App Router code if anything feels off; `params`/`searchParams` are `Promise`s, and `PageProps<'/route/path'>` is a generated global type, already used throughout `src/app/`.
6. **Don't add a root `src/app/loading.tsx`** without testing it live first — one was added during this session's Medium-priority pass and caused every route (including fully static ones) to hang permanently on the loading skeleton in this dev environment; it was removed rather than shipped. If you need one, verify it resolves correctly before considering the work done.
7. **Run the quality gate before calling anything finished**: `npx tsc --noEmit`, `npx eslint .`, `npm run build` — all three are clean as of this handoff; keep them that way.
8. **If doing UI/responsive work, verify live in a browser at multiple widths**, not just by reading the JSX. Both real overflow bugs this project had (VDP mobile, Navbar 1024-1270px) were invisible in code review and only surfaced through actual viewport testing — the project's screenshot tooling wasn't available in this session's environment, so verification relied on `document.documentElement.scrollWidth`/`clientWidth` comparisons and DOM/console inspection instead; a future session with working screenshot capability should still do the same numeric checks, not rely on visual inspection alone.
9. **Nothing from this session is committed to git yet.** `git log` shows only 3 commits, none from this session's work (`git status` will show everything from the QA pass as uncommitted). Check with the user before committing, and don't run any destructive git command without checking `git status` first.
