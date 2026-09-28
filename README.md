# EV Motion

An India-market electric-vehicle marketplace: 123 vehicles across 46 OEMs — cars,
scooters, motorcycles and (architecturally) commercial EVs — with city-aware
pricing, a spec-comparison engine, and lead capture.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Tailwind CSS v4 · shadcn/ui on Base UI · Supabase (leads + analytics) ·
ImageKit (illustrations).

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

No environment variables are required to run the site. Everything optional is
documented in [`.env.example`](.env.example): Supabase (lead capture and
analytics), ImageKit (vehicle illustrations), Sentry (error monitoring), a lead
webhook, and the pricing configuration below. Each is a no-op when unset —
that is a supported state, not a broken one.

## Quality gate

All four must stay clean. Run them before calling anything done.

```bash
npm test && npx tsc --noEmit && npx eslint . && npm run build
```

Currently: **292 tests**, **415 routes**.

The test suite covers pure logic only — no jsdom, no React Testing Library, by
design. UI behaviour is verified live in a browser instead, because the bugs
this project has actually hit (RSC serializability, grid overflow, a stuck
Suspense boundary, a slider returning `undefined` on track-press) are ones jsdom
would not have caught.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Homepage |
| `/cars`, `/two-wheelers`, `/commercial` | Category listings |
| `/cars/[slug]` etc. | Vehicle Detail Page — one template, every category |
| `/brands`, `/brands/[oem]` | Brand pages |
| `/compare`, `/compare/[slug]` | Side-by-side comparison |
| `/prototype/vehicle-page` | The approved VDP design prototype (noindex, never on production) |

## Architecture worth knowing before you edit

Four things in this codebase are load-bearing and easy to break by accident.
Each is stated at length in [`CLAUDE.md`](CLAUDE.md); the short version:

**One Vehicle Detail Page template.** `VehicleDetailTemplate` serves every
vehicle in the catalogue. `buildVdpViewModel()` is the single seam between the
catalogue model and the page model; the section components are presentational
and hold no state. A different vehicle is a different argument, never a
different component. See [VDP architecture](#vehicle-detail-page).

**One pricing system.** Every price, EMI and running-cost figure on the site
resolves through `src/lib/vehicle-pricing/`. Never add a second one, and never
write a rate or tariff into a component — read it from the configuration.

**Data honesty.** A specification is either real sourced data or it renders as
"Not specified". Never a formula. Derived power, torque, boot space and charge
times were all removed for this reason and must not come back. Calculators are
the exception and each prints its assumptions on screen.

**No `@/lib/data` in client components.** The barrel builds a category→vehicles
map at module scope, so importing anything from it pulls all 123 records into
that route's client bundle (~110–130 KB). Hoist the lookup into a Server
Component parent and pass the result down.

## Vehicle Detail Page

One data-driven template behind the existing dynamic routes.

```
/cars/[slug] · /two-wheelers/[slug] · /commercial/[slug]
  └── VehicleDetailTemplate            Server Component — resolves catalogue data
        buildVdpViewModel(detail, similar)
        └── VdpLayout                  the only client component; owns all state
              └── 14 presentational sections
```

| Path | Holds |
| --- | --- |
| `src/lib/vehicle-detail/types.ts` | The page-shaped view model |
| `src/lib/vehicle-detail/buildVdpViewModel.ts` | Catalogue → page mapping |
| `src/lib/vehicle-detail/chrome.ts` | Section order, nav tabs, ad inventory |
| `src/lib/vehicle-detail/calculations.ts` | Derived figures, no React |
| `src/components/vehicle-detail/vdp/` | The section components |

Section order, mirrored 1:1 by the sticky nav: Images → Overview → Variants →
Battery & Charging → Real World Range → Ownership Tools → Specifications →
Compare → Features → Videos → Reviews → FAQs → Similar → Latest News.

**The approved prototype is the source of truth for UI and layout** — markup,
spacing, typography, colour, hierarchy, interactions. It is *not* the source of
truth for content claims or financial assumptions: those come from the
catalogue and from the pricing configuration. Port it verbatim and raise
conflicts rather than resolving them in code.

## Pricing configuration

Every rate, tenure and tariff the site quotes is resolved in
`src/lib/vehicle-pricing/config.ts` and nowhere else — the VDP, Compare, listing
cards and both calculators all read the same values, so they cannot disagree.

Thirteen settings are overridable by environment variable, so changing the
financed rate or the electricity tariff is a deployment setting rather than a
code change. A malformed or out-of-range value falls back to its documented
default with a dev-time warning; it can never reach a price label as `NaN`.
See [`.env.example`](.env.example).

Two seams exist for what comes next, and neither requires a consumer change:

- `setPricingConfigResolver()` swaps the source, for an API- or
  database-backed pricing service. Fetch asynchronously at startup, serve
  synchronously thereafter.
- `getPricingConfig(scope)` already receives the state and vehicle category
  from every call site, so a future state-wise rate table is a change to that
  one file.

## Documentation

| File | What it holds |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | Operational rules. Read before editing anything |
| [`HANDOFF.md`](HANDOFF.md) | Full project narrative, decisions, roadmap |
| [`.env.example`](.env.example) | Every environment variable, all optional |
| `prototypes/` | Approved design prototypes and how to view them |

## Known limitations

These are deliberate, not bugs:

- **No vehicle has a photograph.** `photoUrl` is empty for all 123; real
  licensed photography is unsourced. Cards render generic AI body-type
  illustrations or a branded placeholder — neither is a photo of the vehicle.
- **`Vehicle.specs` covers 65 of 123.** The rest render "Not specified".
- **Commercial EVs have architecture but no data.** `commercial.ts` is `[]`,
  so that path has never rendered a real record.
- **No news source exists**, so news sections are honest empty states.
- **Reviews are local React state**, with no backend behind them.
- **`loading.tsx` hangs routes** at every level, root or segment-scoped. Root
  cause unresolved — do not add one.
