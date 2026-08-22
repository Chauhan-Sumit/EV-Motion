# Price Audit — Phase 2, Sub-batch 3: All Remaining Car Brands (2026-08-22)

Covers the **42 car records across 13 OEMs** left after the Tata and MG clusters. Branch
`price-audit`.

## ⚠️ Read this before trusting the coverage

This was run as a **single sweep across 13 OEMs**, not as 13 reviewed sub-batches. That is a
materially different level of scrutiny from [`PRICE_AUDIT_TATA.md`](PRICE_AUDIT_TATA.md) and
[`PRICE_AUDIT_MG.md`](PRICE_AUDIT_MG.md), where every record got a dedicated OEM-primary lookup.
The small-batch rhythm is what surfaced MG's ₹4.23 lakh ZS EV error.

So **confidence is recorded per record below and is not uniform.** 9 records were corrected on
strong evidence, 8 were confirmed correct, and **25 remain unverified or unresolved** — including
every Mercedes-Benz, Lotus, MINI and Rolls-Royce record, which this sweep did not reach at all.

**Nothing here should be read as "the car prices are now correct."**

---

## Corrected (9 records)

| Vehicle | Was | Now | Evidence |
|---|---:|---:|---|
| `byd-seal` | `[41, 53]` | `[41.5, 53.65]` | BYD India 1 July 2026 revision |
| `byd-emax-7` | `[26.9, 29.9]` | `[27.9, 29.9]` | same |
| `byd-sealion-7` | `[49.4, 55.9]` | `[49.4, 54.9]` | same |
| `mahindra-xev-9e` | `[21.9, 30.5]` | `[21.9, 31.25]` | ZigWheels / CarWale / CarDekho agree |
| `mahindra-xuv-3xo-ev` | `[13.89, 14.96]` | `[13.89, 15.46]` | floor already exact, corroborating the ceiling |
| `mahindra-be-6` | `[18.9, 26.9]`, **`upcoming`** | `[19.45, 26.95]`, **`available`** | 2026 SPORTEQ line-up; see below |
| `bmw-ix1-lwb` | `[51.4, 51.4]` | `[52.4, 52.4]` | Autocar India / CarWale |
| `bmw-i7` | `[205, 258]` | `[205, 250]` | floor confirmed, ceiling corrected |
| `kia-ev6` | `[65.9, 65.9]` | `[65.98, 65.98]` | Kia India lists ₹65,97,937 |

### `byd-seal` — this closes a question the battery work left open

The BYD battery sub-batch explicitly flagged **41.0-vs-41.5** and **53.0-vs-53.65** as unresolved
and deferred them here. BYD India's **1 July 2026 price revision** (₹50,000–₹1,00,000 across Atto 3,
Seal and Sealion 7) settles both. Premium stays at 46.2, which every source still agrees on.

### `mahindra-be-6` — a stale availability status, found by accident

The record was still `launchStatus: "upcoming"` **while its platform twin `mahindra-xev-9e` was
`available`.** The two launched together, so the catalogue was internally inconsistent with itself —
the same shape of defect the Batch 7 staleness sweep existed to catch. The BE 6 has been on sale
since early 2025 and the 2026 SPORTEQ line-up launched on 15 August 2026.

`launchDate` was **deliberately left absent rather than inferred** from the twin.

---

## Confirmed correct as stored (8 records)

No change needed — the stored figures match current published prices:

| Vehicle | Stored | Source figure |
|---|---:|---:|
| `bmw-i4` | `[72.5, 77.5]` | 72.50 – 77.50 |
| `bmw-i5` | `[120, 120]` | 1.20 Cr |
| `bmw-ix` | `[140, 140]` | 1.40 Cr |
| `audi-q8-e-tron` | `[115, 127]` | 1.15 – 1.27 Cr |
| `volvo-ec40` | `[59, 59]` | 59.00 |
| `vinfast-vf6` | `[18.19, 20.09]` | 18.19 – 20.09 |
| `kia-ev9` | `[129.9, 129.9]` | ₹1,29,91,312 |
| `kia-carens-clavis-ev` | `[18, 25]` | 18.01 – 25 |

---

## Unresolved and flagged (5 records) — these need a decision, not just a lookup

| Vehicle | Issue |
|---|---|
| `volvo-ex40` | **Reported DISCONTINUED** — "no longer listed on the brand's official website". Stored as `available` at `[49, 60.2]`. Single source, so **not acted on**, but this is the same class as the BYD e6 / Audi e-tron GT discontinuations. **Highest-priority follow-up in this sweep.** |
| `kia-syros-ev` | Reported as **not yet launched** (expected 30 Sep 2026, expected ₹15–20 L) while stored `available` at `[13.49, 20]`. If correct, both the status and the firm price are wrong |
| `hyundai-ioniq-5` | Stored `[46.05, 46.05]` at 72.6 kWh; sources describe a **₹55.70 L car with an 84 kWh pack and 690 km**. Either a facelift the record predates, or a source conflating it with the Ioniq 6. Entangled with specifications, so not a price-only fix |
| `hyundai-creta-electric` | Stored ceiling `21.99` against a reported `24.7`; Hyundai's own page markup shows a floor of ₹18,02,000 vs the stored 17.99. Ceiling is single-sourced |
| `mahindra-xuv400` | Stored floor `15.99` vs a reported `15.49`, **and** reports that the XUV 3XO EV "replaces the XUV400 EV" — an availability question, not just a price one |

---

## Not verified in this sweep (20 records)

Left exactly as stored. No evidence was gathered, so **no claim is made either way**:

- **Mercedes-Benz ×4** (`eqs`, `eqe`, `g580`, `maybach-eqs-suv`) — searches returned figures that
  conflated the EQS SUV with the Maybach and did not cover the EQS sedan or G 580 at all
- **Lotus ×2**, **Rolls-Royce ×1**, **MINI ×2**, **Porsche Taycan ×1** — not reached
- **Hyundai ×3** (`kona-electric`, `ioniq-6`, `ioniq-9`) — Kona has a facelift reportedly due
  Nov 2026; the two Ioniqs are `upcoming` records whose prices render as "(est.)" anyway
- **BYD ×2** (`atto-3` ceiling reported as 34.49 vs stored 27.6 — anomalous enough to distrust
  without a second source; `e6` discontinued)
- **Mahindra ×1** (`xev-9s` — sources split between a 29.95 and a 30.90 ceiling)
- **Audi ×1** (`e-tron-gt`, discontinued), **Volvo ×2** (`ex30` sources contradict each other),
  **VinFast ×1** (`vf7` ceiling reported 28.09 vs stored 25.49, single source)

---

## Battery-as-a-Service — now four brands

`mahindra-be-6` sells on BaaS at **₹11.45 L + ₹3.75/km** against its ₹19.45 L battery-included
price. Added to the tally from earlier passes:

| Brand | Records affected |
|---|---|
| MG | Comet, Windsor, ZS EV |
| Vida | 3 |
| Royal Enfield | 1 |
| Mahindra | BE 6 |

**Eight-plus records across four brands.** This catalogue records battery-included ex-showroom
throughout, because that is what `src/lib/vehicle-pricing/` consumes. BaaS remains an open schema
question and is still the largest structural gap the price audit has surfaced.

---

## Summary

| | Count |
|---|---:|
| Records in scope | **42** |
| Corrected | **9** |
| Confirmed correct as stored | **8** |
| Unresolved and flagged | **5** |
| Not verified at all | **20** |

### Files changed

- `src/lib/data/cars.ts` — the 9 corrected records only
- `src/lib/vehicle-prices.test.ts` — two added tests
- `PRICE_AUDIT_CARS.md` — this document

No battery, range, top-speed or `batteryMeasuredAt` value was changed. The containment invariant was
re-run across all 123 records and holds; it caught one intermediate error during this pass (the BE 6
range was corrected before its variants, leaving a variant below its own floor), which is the
invariant doing exactly what it was added for.

### Suggested next steps

1. **Verify `volvo-ex40`'s discontinuation** — a live listing for a car Volvo no longer sells.
2. **Verify `kia-syros-ev`'s availability** — same shape.
3. **Resolve `hyundai-ioniq-5`** — likely a facelift the record predates; needs a spec pass, not a
   price lookup.
4. **Run Mercedes, Lotus, MINI, Rolls-Royce and Porsche Taycan as a proper sub-batch.**
5. **Decide on BaaS.**
