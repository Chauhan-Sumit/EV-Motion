# Vehicle page redesign — prototype

**Preview:** `npm run dev`, then <http://localhost:3000/prototype/vehicle-page>

**Source:** `nexon-ev-redesign.html` — a byte-for-byte copy of the supplied
design file (`evmotion-nexon-redesign (6).html`). It has not been edited.

**Served by:** `src/app/prototype/vehicle-page/route.ts`

## What it is

A redesign proposal for the Vehicle Detail Page, modelled on the Tata Nexon EV.
It is a working prototype rather than a flat image: the variant, colour,
daily-distance and EMI controls all recalculate live.

Sections, in page order: hero → sticky section nav → overview → variants →
battery & charging → cost of ownership → full specifications → comparison →
top features → videos → owner reviews → FAQs → similar cars, with a sticky
sidebar carrying the EMI calculator, "also compared with", and ad slots.

The document's own **"About this mockup"** note at the foot of the page records
where its numbers come from — which are real Nexon EV figures, which are derived
(and under what assumption), and which slots are placeholders for photography
and video that do not exist yet. Read that before reviewing the content.

## What it is not

- Not wired to `src/lib/data` — the figures are baked into the HTML. It is a
  picture of the design, not a running feature.
- Not a component port. No React, no Tailwind, no project imports. The inline
  token block is copied from the live stylesheet, so the design already speaks
  the existing system's language, but nothing is shared at the code level.
- Not related to `/model-page-mockup`, an earlier and separate VDP prototype
  built as React components against real catalog data. The two are independent
  proposals; neither imports the other.

## If this design is approved

Port it into `src/` as components under the production route, reading real data
through `toVehicleDetail()`, and delete both this folder and
`src/app/prototype/vehicle-page/`.

## If it is rejected

Delete both folders. Nothing else references them.
