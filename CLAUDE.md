@AGENTS.md

# EV Motion — Repo Guide

**Full narrative handoff, QA history, and future roadmap:** see [`HANDOFF.md`](HANDOFF.md) — read it before starting non-trivial work. This file is the short, operational version.

## What this is

A static-data Next.js 16 App Router demo of an Indian EV marketplace (cars + two-wheelers), styled to match a supplied "EV Motion" design template, and taken through a full production-readiness QA cycle (audit → Critical → High → Medium → Low fixes, all resolved — see `FINAL_QA_REPORT.md`). No backend, no auth, no database — everything is static TypeScript data plus client-side interactivity.

## Tech stack

Next.js 16 (Turbopack, App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 (`@theme` block in `src/app/globals.css`, no config file) · shadcn/ui **on Base UI, not Radix** · framer-motion · lucide-react · cmdk.

## Folder structure (quick reference)

```
src/app/                 Routes: /, /cars(+[slug]), /two-wheelers(+[slug]), /brands(+[oem]), /compare
                          error.tsx, not-found.tsx, sitemap.ts, robots.ts, layout.tsx, template.tsx
src/components/home/     Homepage-only sections
src/components/vehicle-detail/  VDP-only sections
src/components/vehicles/ Shared across /cars, /two-wheelers, /brands/[oem], /compare
src/components/search/   VehicleSearchBox (real search/autocomplete) + HighlightedText
src/components/brands/   BrandLogo
src/components/common/   PlaceholderImage, LeadCaptureDialog (shared engine behind every lead-capture CTA)
src/components/layout/   Navbar, Footer, PageTransition
src/components/ui/       shadcn/Base UI primitives actually in use — nothing unused ships here anymore
src/lib/data/            Raw Vehicle/Oem records + lookup helpers
src/lib/data/ev-motion/  Adapters reshaping raw data into home/VDP view-model shapes
src/lib/                 search.ts, listing-params.ts, vehicle-labels.ts, structured-data.ts, site.ts, utils.ts
```

## Before you touch anything

1. **Check `git status` and `git log` first.** Nothing from the QA pass is committed yet (only 3 commits exist, none from that work) — don't assume any prior session's changes are saved unless you verify.
2. **This shadcn setup uses Base UI, not Radix.** Composing a non-Button element into `Button`/`SheetTrigger`/`DialogTrigger`/etc. needs the **`render` prop**, not `asChild`: `<Button render={<Link href="/cars" />} nativeButton={false}>`.
3. **Next.js 16 has real breaking changes** vs. training-data assumptions (see `AGENTS.md` above and `node_modules/next/dist/docs/`). `params`/`searchParams` are `Promise`s; `PageProps<'/route/path'>` is a generated global type already used throughout `src/app/`.
4. **Grep before editing shared files.** `search.ts`, `vehicle-labels.ts`, `listing-params.ts`, `structured-data.ts`, `VehicleImage.tsx`, `PlaceholderImage.tsx`, `LeadCaptureDialog.tsx`, `VehicleSearchBox.tsx`, and `BrandLogo.tsx` are each used in multiple places on purpose, specifically to prevent the kind of duplicated-logic drift the QA process repeatedly found and fixed.
5. **Don't add a root `src/app/loading.tsx` without testing it live.** One was tried during QA and caused every route — including fully static ones — to hang permanently on the loading skeleton in this dev environment. It was removed rather than shipped.
6. **Quality gate, every time:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` — all three are clean as of this handoff. Keep them clean.
7. **Verify UI/responsive changes live in a browser**, at multiple widths, not just by reading JSX — both real overflow bugs this project had (VDP mobile hero/gallery, Navbar at 1024-1279px) were invisible in code review. If screenshot tooling isn't available, compare `document.documentElement.scrollWidth` vs `clientWidth` at each width instead of relying on visual inspection.

## Known intentional limitations (not bugs)

Ad slots are static placeholders (kept on purpose), no pagination (18 items/category doesn't need it yet), Reviews/Latest News are honest empty states with working submission forms behind them, no real backend (every "submit" is local state, honestly labeled as a demo), placeholder SEO domain (`src/lib/site.ts`, swap via `NEXT_PUBLIC_SITE_URL`), and a few shadcn primitives (`Tabs`, `Popover`/`Command`) were deliberately left unrestyled. Full reasoning for each is in `HANDOFF.md`'s Known Limitations section — don't "fix" these without checking there first.

## Where to look for more

- **Full project narrative, architecture rationale, design system, future roadmap:** `HANDOFF.md`
- **Every issue ever found and how it was fixed, with evidence:** `QA_REPORT.md` and the phase-specific reports (`CRITICAL_FIX_REPORT.md`, `HIGH_PRIORITY_FIX_REPORT.md`, `REGRESSION_REPORT.md`, `NAVBAR_RESPONSIVE_FIX_REPORT.md`, `MEDIUM_PRIORITY_FIX_REPORT.md`, `LOW_PRIORITY_FIX_REPORT.md`)
- **Overall scores and final production-readiness assessment:** `FINAL_QA_REPORT.md`
