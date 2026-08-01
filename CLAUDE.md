@AGENTS.md

# EV Motion — Repo Guide

**Full narrative handoff, QA history, and future roadmap:** see [`HANDOFF.md`](HANDOFF.md) — read it before starting non-trivial work. This file is the short, operational version.

## What this is

A static-data Next.js 16 App Router demo of an Indian EV marketplace, styled to match a supplied "EV Motion" design template, taken through a full production-readiness QA cycle (audit → Critical → High → Medium → Low fixes, all resolved — see `FINAL_QA_REPORT.md`), then extended with a real global location system, real filter/search interactions, and — most recently — generalized from a hardcoded car/two-wheeler binary into a genuine multi-category architecture that now also includes **commercial EVs** as a third category. No backend, no auth, no database — everything is static TypeScript data plus client-side interactivity.

**Important right now:** the project is mid-expansion from its original 36-vehicle demo into full India-market coverage, one small OEM batch at a time (see `HANDOFF.md`'s "Full-Market Expansion — Batch Log"). **Batches 1-4 are done** — `src/lib/data/cars.ts` has 54 records across 15 car OEMs (Tata, Mahindra, MG, Hyundai, Kia, BYD, BMW, Mercedes-Benz, Audi, Volvo, MINI, Porsche, Lotus, Rolls-Royce, VinFast); `src/lib/data/two-wheelers.ts` has 68 records (54 scooters + 14 motorcycles) across 31 two-wheeler OEMs (the full Batch 3 scooter list plus Batch 4's motorcycle list). Commercial EVs (Batch 5) is not started — **do not start a new batch without being asked**, each batch stops for approval when done. Separately, the commercial-category *architecture* is complete and working; the commercial *data* is not — `src/lib/data/commercial.ts` is an empty array. `src/lib/data/_research-commercial.ts` (earmarked for Batch 5) still contains real, researched-but-unmerged data. `src/lib/data/_research-two-wheelers.ts` no longer exists — everything it staged has been merged and it was deleted at the end of Batch 4. See `HANDOFF.md`'s "Known Limitations" and "How the next Claude session should continue" before doing anything with the vehicle database.

## Tech stack

Next.js 16 (Turbopack, App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 (`@theme` block in `src/app/globals.css`, no config file) · shadcn/ui **on Base UI, not Radix** · framer-motion · lucide-react · cmdk. No new dependencies since the original QA cycle.

## Folder structure (quick reference)

```
src/app/                 Routes: /, /cars(+[slug]), /two-wheelers(+[slug]), /commercial(+[slug]), /brands(+[oem]), /compare
                          error.tsx, not-found.tsx, sitemap.ts, robots.ts, layout.tsx, template.tsx
src/components/home/     Homepage-only sections
src/components/vehicle-detail/  VDP-only sections (now category-aware for cars/2-wheelers/commercial)
src/components/vehicles/ Shared across /cars, /two-wheelers, /commercial, /brands/[oem], /compare
src/components/search/   VehicleSearchBox (category-scoped search, typo tolerance, recent/popular)
src/components/brands/   BrandLogo
src/components/common/   PlaceholderImage, LeadCaptureDialog, ResponsivePopover (Popover↔Sheet wrapper)
src/components/layout/   Navbar (real location control), Footer, PageTransition, LocationSelector
src/context/             LocationContext — global selected-city state
src/hooks/                useCarouselScroll, useMediaQuery
src/lib/data/            Raw Vehicle/Oem records (cars.ts, two-wheelers.ts, commercial.ts, oems.ts) + categories.ts (the category registry) + cities.ts
src/lib/data/ev-motion/  Adapters reshaping raw data into home/VDP view-model shapes — now category-parameterized, not hardcoded per category
src/lib/                 search.ts, listing-params.ts, vehicle-filter-options.ts, vehicle-labels.ts, structured-data.ts, site.ts, utils.ts
```

## Before you touch anything

1. **Check `git status` and `git log` first.** Two full sessions of work (location/filters/search, and the commercial-category architecture) are uncommitted on top of the original QA-cycle commits — don't assume anything in this repo's current file state is saved unless you verify.
2. **`VehicleCategory` is `"car" | "2-wheeler" | "commercial"`, driven by a registry (`src/lib/data/categories.ts`), not a hardcoded binary.** If you're about to write `category === "car" ? X : Y` anywhere, stop — check whether `routeSegmentFor()`, `categoryConfig()`, or `filterConfigFor()` already covers it. That exact ternary existed in 7+ files before this session's generalization pass; don't reintroduce it.
3. **This shadcn setup uses Base UI, not Radix.** Composing a non-Button element into `Button`/`SheetTrigger`/`DialogTrigger`/etc. needs the **`render` prop**, not `asChild`: `<Button render={<Link href="/cars" />} nativeButton={false}>`.
4. **Next.js 16 has real breaking changes** vs. training-data assumptions (see `AGENTS.md` above and `node_modules/next/dist/docs/`). `params`/`searchParams` are `Promise`s; `PageProps<'/route/path'>` is a generated global type. **A brand-new route's `PageProps` type won't exist until you run `next build` or `next dev` once** to regenerate `.next/types` — a bare `tsc --noEmit` on a just-added route will falsely error until then.
5. **Grep before editing shared files.** `search.ts`, `vehicle-labels.ts`, `listing-params.ts`, `vehicle-filter-options.ts`, `structured-data.ts`, `categories.ts`, `VehicleImage.tsx`, `PlaceholderImage.tsx`, `LeadCaptureDialog.tsx`, `VehicleSearchBox.tsx`, `BrandLogo.tsx`, `LocationContext.tsx`, `ResponsivePopover.tsx` are each used in multiple places on purpose.
5a. **When adding vehicles in a data-expansion batch, re-check `vehicle-filter-options.ts`'s `priceBounds`/`rangeBounds`/`batteryBounds`** against the new dataset's min/max before calling the batch done. Batch 1 hit this live: a new car's price and battery capacity exceeded the old bounds and silently vanished from `/cars` and the homepage filter chips despite a clean `tsc`/`eslint`/`build` — neither catches numeric filter-bound drift, only live verification of the listing count does.
6. **Don't add a root `src/app/loading.tsx` without testing it live.** One was tried during the original QA pass and caused every route to hang permanently in this dev environment. Removed rather than shipped.
7. **Quality gate, every time:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` — all three are clean as of this handoff (179 routes). Keep them clean.
8. **Verify UI/responsive changes live in a browser**, at multiple widths — including the *exact* pixel width you suspect might be tight, not just round breakpoints (a Navbar overflow at exactly 1280px was invisible at every round breakpoint and only appeared with a realistic long city name). If screenshot tooling isn't available, compare `document.documentElement.scrollWidth` vs `clientWidth`.
9. **Background research agents can fail on session usage limits.** This happened in the prior session — all 3 parallel data-research agents failed simultaneously, though 2 had already written usable output before failing. Check for partial output files before assuming nothing was produced.

## Known intentional limitations (not bugs)

Commercial-EV category has real architecture but zero data (see above). One research staging file (`_research-commercial.ts`, for Batch 5) contains real unmerged vehicle data — `_research-two-wheelers.ts` was fully merged and deleted at the end of Batch 4. Car dataset covers Tata/Mahindra/MG/Hyundai/Kia (Batch 1) plus BYD/BMW/Mercedes-Benz/Audi/Volvo/MINI/Porsche/Lotus/Rolls-Royce/VinFast (Batch 2) — 54 records, 15 car OEMs. Two-wheeler dataset covers all Batch-3 scooter brands plus Batch-4 motorcycle brands — 68 records (54 scooters + 14 motorcycles), 31 two-wheeler OEMs. Commercial EVs is not started (Batch 5). Price display doesn't switch to crore notation for the new 100L+ luxury cars (cosmetic, flagged not fixed). Multi-word search queries that skip a word (e.g. "simple ultra") return no results — pre-existing `search.ts` characteristic, not a regression. "Portable Battery" isn't a filterable field despite being requested for Batch 3 — needs a schema change, flagged not done. Ad slots are static placeholders, no pagination yet, Reviews/Latest News are honest empty states with working forms behind them, no real backend, placeholder SEO domain, a few shadcn primitives left unrestyled (`Tabs`, `Popover`/`Command`). Full reasoning for each is in `HANDOFF.md`'s Known Limitations section.

## Where to look for more

- **Full project narrative, architecture rationale, design system, future roadmap:** `HANDOFF.md`
- **Every issue ever found in the original QA cycle and how it was fixed, with evidence:** `QA_REPORT.md` and the phase-specific reports (`CRITICAL_FIX_REPORT.md`, `HIGH_PRIORITY_FIX_REPORT.md`, `REGRESSION_REPORT.md`, `NAVBAR_RESPONSIVE_FIX_REPORT.md`, `MEDIUM_PRIORITY_FIX_REPORT.md`, `LOW_PRIORITY_FIX_REPORT.md`)
- **Overall scores and final production-readiness assessment (as of the original QA cycle):** `FINAL_QA_REPORT.md`
