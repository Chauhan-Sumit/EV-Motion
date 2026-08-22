# Price Audit — Phase 1 (2026-08-22)

The diagnostic and first correction pass for 🔴 item 2 in [`HANDOFF.md`](HANDOFF.md)'s data-quality
register: *"Prices are unaudited, and one was 43% wrong."* Branch `price-audit`, off
`byd-battery-sourcing`.

**This is phase 1 of a larger audit. 105 of 123 records are still unverified.**

---

## The decision that shapes everything else

**`priceRangeLakh` means the span of every trim the OEM sells** — not the span of the trims this
repo happens to model (owner decision, 2026-08-22).

Two consequences, and they pull in opposite directions:

1. A range **may** legitimately be wider than the modelled variants. That means trims exist which
   are not modelled — **incompleteness, not error.**
2. A variant may **never** fall outside its own record's range. That is a genuine contradiction:
   the page headlines the range, then lists a price the range excludes.

`vehicle-prices.test.ts` now pins (2) across all 123 records, plus each correction below.

---

## What the free in-repo pass found

Before any research, comparing each record's `priceRangeLakh` against its own variant table found
**18 of 123 records contradicting themselves**, in two shapes:

- **Range wider than the variant list (13).** Under the decision above these are *incomplete*, not
  wrong — the fix is to research and add the missing trims.
- **Range offset from the variant list (5).** These are real errors, in both directions.

Two were confirmed live against a production build before anything was changed:

- `porsche-macan-electric` headlined **₹1.21 Cr** directly above its own variant table listing a
  **₹1.70 Cr** Turbo, and capped the car at ₹1.21 Cr for the budget filter.
- `bgauss-oowah` headlined **"₹0.95 – 1.23L"** while listing exactly one variant, at ₹95,000.

---

## Corrected in this pass (10 records)

| Record | Was | Now | Why |
| --- | --- | --- | --- |
| `porsche-macan-electric` | range `[121, 121]`, variants 121/145/170 | range `[121.62, 168.62]`, variants 121.62/138/168.62 | Flat range under a table reaching ₹1.70 Cr; the 4S was also ₹7 lakh over |
| `bajaj-chetak-c3001` | range 1.14, variant 0.98 | **1.12** both | Whole C-series recorded high |
| `bajaj-chetak-c3501` | range 1.52, variant 1.35 | **1.345** both | ” |
| `bajaj-chetak-c3502` | 1.37 | **1.27** | ” — *was internally consistent* |
| `bajaj-chetak-c3503` | 1.24 | **1.14** | ” — *was internally consistent* |
| `oben-rorr-evo` | range `[1.0, 1.25]` | `[1.25, 1.25]` | 1.0 was an expired launch offer |
| `ultraviolette-tesseract` | range `[1.2, 1.45]`, variant 1.45 | `[1.45, 2.0]`, variant **2.0** | 1.2 was an expired launch offer, and the modelled 6 kWh trim carried the 3.5 kWh trim's price |
| `bgauss-oowah` | 1 variant | **2 trims**, and top-level battery 2.3 → 3.0 | Range was right, variant list incomplete; record also claimed 145 km from the 2.3 kWh pack that does 105 |
| `bgauss-c12i-max` | 1 variant | **3 trims** | Range was right, variant list incomplete |
| `ampere-nexus` | 1 variant | **2 trims** | Range was right; the two Nexus trims differ only in instrumentation (LCD vs TFT) |

### The finding that matters most for the rest of the audit

**`bajaj-chetak-c3502` and `c3503` were internally consistent and still wrong.** They never appeared
in the 18 — their range matched their own variant exactly. They were caught only because sourcing
their two flagged siblings produced the whole current Chetak price list.

**Self-consistency is not evidence of correctness.** `tvs-x` proved this once already at ₹1.5 lakh
against a real ₹2.64 lakh. The free check finds contradictions, not errors.

*(Scope note: `c3502`/`c3503` were outside the 18-record phase-1 set. They were corrected anyway
because the same sourcing pass covered them, and leaving a brand's line-up half-corrected would be
worse than not touching it.)*

### A second recurring shape: expired introductory prices

`oben-rorr-evo` and `ultraviolette-tesseract` both carried a **launch offer** as the floor of their
range — ₹99,999 for Oben's first 10,000 buyers, ₹1.20 lakh for Ultraviolette's. Both offers had
ended. A launch offer is not a trim, and it should never be a range floor. **Worth checking for
explicitly on every remaining record.**

---

## Left unresolved, with reasons (9 records)

| Record | Why not fixed |
| --- | --- |
| `royal-enfield-flying-flea-c6` | The `[1.99, 2.79]` span is **BaaS vs battery-included**, not two trims. The schema has no concept of Battery-as-a-Service, so this is a data-model decision, not a price lookup |
| `vida-vx2`, `vida-v2-plus`, `vida-v2-max` | Same BaaS problem, plus aggregators that contradict each other and each other's subsidy assumptions |
| `bgauss-ruv350` | bgauss.com lists exactly one RUV 350 (MAX, ₹1,43,990). The recorded `[1.15, 1.35]` matches neither end. Needs a decision about which car this record describes |
| `ampere-magnus-ex`, `ampere-primus`, `ampere-magnus-neo` | Ampere's own site returns 403; aggregator figures conflict (Magnus Neo quoted at both ₹79,999 and the recorded ₹87,000, with a documented ₹10,000 introductory step) |
| `kinetic-green-e-luna` | Range `[0.7, 0.82]` is correct and four trims are published with prices — but **per-trim range and top speed are not**, and a variant row cannot be half-sourced |
| `bajaj-chetak-2901` | Discontinued |

---

## What phase 1 does not establish

- **105 of 123 records remain unverified.** This pass only examined records that contradicted
  themselves, plus one brand cluster it had to source anyway.
- **52 records have a single variant**, so no internal check is possible on them at all.
- The internal check cannot detect a record that is uniformly, consistently wrong — which the
  Chetak C-series just demonstrated twice.

**Suggested phase 2:** external verification by OEM cluster, prioritised by traffic — Tata, MG,
Mahindra, Hyundai, Kia on cars; Ola, Ather, TVS on two-wheelers. And a decision on BaaS, which
currently blocks four records and will block more as Vida and Royal Enfield expand.
