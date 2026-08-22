# Price Audit — Phase 2, Sub-batch 1: Tata (2026-08-22)

First OEM cluster of the systematic phase, per the plan in [`PRICE_AUDIT.md`](PRICE_AUDIT.md).
Branch `price-audit`. **Tata only — no other OEM was touched.**

**7 Tata records**, all in `src/lib/data/cars.ts`. (`_research-commercial.ts` holds two more Tata
entries, but that file is unmerged Batch 5 staging and is out of scope.)

Primary source throughout: **`ev.tatamotors.com`**, per-model `/price.html` pages plus the EV
homepage. Secondary sources were used only to corroborate or to resolve a gap, never to overrule
Tata.

---

## Findings

| Vehicle | Current Stored | OEM Current | Status | Source | Action |
|---|---:|---:|---|---|---|
| `tata-nexon-ev` | `[12.49, 17.19]` | `12.49 – 17.69` | **Outdated** | tata.ev price page + EV homepage | **Corrected** — ceiling and 2 variant prices, plus retired variant names |
| `tata-punch-ev` | `[9.69, 12.79]` | `9.69 – 12.59` | **Outdated** | tata.ev price page | **Corrected** — ceiling + top variant |
| `tata-curvv-ev` | `[14.99, 19.99]` | `16.99 – 19.49` | **Outdated, entangled** | tata.ev price page | **Unresolved** — see below |
| `tata-harrier-ev` | `[21.69, 29.19]` | `21.69 – 28.99` (Tata) vs `29.7 – 30.66` (secondaries) | **Conflicting** | tata.ev vs CarWale/Acko/CarLelo | **Unresolved** |
| `tata-sierra-ev` | `[18.79, 25.99]` | `18.79 – ` not published | **Partially confirmed** | tata.ev price page | Floor confirmed; ceiling unclear — no change |
| `tata-tigor-ev` | `[12.49, 13.75]` | `12.49 – ` not published | **Partially confirmed** | tata.ev price page | Floor confirmed, on sale; ceiling unverified — no change |
| `tata-tiago-ev` | `[7.99, 11.29]` | `"From ₹6.99 L"`, shown as *Offer Price* | **Unclear** | tata.ev price page | **Unresolved** — see below |

---

## Corrections made (2 records)

### `tata-nexon-ev`

- **Range ceiling `17.19` → `17.69`.** The old ceiling excluded the `#DARK` trims Tata actually
  sells. Tata's price page lists `Empowered+ A 45 Red #DARK` and `Empowered+ A 45 #DARK`, and the
  EV homepage carries "Nexon.ev #DARK" at **₹17.69 L**.
- **The two Tata figures are not a contradiction.** The price-page FAQ's **₹17.49 L** is the top
  *standard* trim (Empowered Plus LR); **₹17.69 L** is the #DARK. Since `priceRangeLakh` spans every
  trim on sale, 17.69 is the correct ceiling. This was checked specifically because an OEM
  contradicting itself is a documented trap in this project (CLAUDE.md #28(c)).
- **Variant prices:** `Fearless` 15.49 → **14.99**; `Empowered+` 17.19 → **16.99**.
- **Variant names:** Tata has retired the `LR` suffix. `Fearless LR` / `Empowered+ LR` are
  **discontinued variant names**; the current table is `Creative Plus MR` / `Fearless 45` /
  `Empowered+ A 45`. Per-variant battery and range figures already matched that MR/45 split and were
  left untouched.
- The two `#DARK` trims are **not** added as variants — their range and charging figures are not
  published separately, and a variant row cannot be half-sourced.

### `tata-punch-ev`

- **Range ceiling `12.79` → `12.59`**, and the `Empowered+ S 40` variant with it. Tata publishes
  `Smart 30` at ₹9.69 L and `Empowered+ S 40` at ₹12.59 L.
- The floor and **both variant names already matched Tata's current table exactly** — a single
  ₹20,000 drift and nothing else. The cleanest record in the cluster.

---

## Unresolved, with reasons (2 records)

### `tata-curvv-ev` — outdated, but the price fix is entangled with a spec change

Tata's page states the Curvv.ev **Series X** range as **₹16.99 L – ₹19.49 L**, with variants
`Accomplished X 55` (16.99), `Empowered X 55` (19.19) and `Empowered X 55 #DARK` (19.49).

The stored record describes a **different, superseded line-up**: `Creative 45` (14.99) and
`Accomplished+ 45` (19.99), on a **45 kWh** pack. The current trims are **55 kWh**.

Correcting only the range to `[16.99, 19.49]` would push both stored variants outside it and break
the `priceRangeLakh` containment invariant. Correcting the variants would mean attaching 55-badged
names to 45 kWh specifications, or inventing per-trim range/top-speed figures that Tata does not
publish separately. **Neither is acceptable**, so the record is left as-is and flagged.

**This is the highest-priority Tata follow-up** and it is a specification task, not a price lookup.

### `tata-tiago-ev` — offer price vs ex-showroom, plus retired variant names

Tata's page headlines **"From ₹6.99 Lakh Onwards"** but renders each variant under an **"Offer
Price"** label, so it is not established whether ₹6.99 L is the ex-showroom price or a promotion.
Phase 1 already found two records (`oben-rorr-evo`, `ultraviolette-tesseract`) carrying **expired
launch offers as range floors**, so adopting an offer price here would repeat exactly the error this
audit exists to remove.

The stored variant names are also wrong: the record carries `XE 24kWh` / `XZ+ LR`, which is **ICE
Tiago nomenclature**. Tata's Tiago.ev table reads `Smart 19` / `Pure+ 19` / `Pure+ 24` /
`Creative+ 24`. Per-variant prices were not rendered on the page.

Stored `[7.99, 11.29]` against a possible ₹6.99 floor is a material gap, but **not resolvable from
what Tata publishes today**.

---

## Confirmed-in-part, deliberately unchanged (3 records)

- **`tata-harrier-ev`** — Tata's own page headlines **"From ₹21.69 L to ₹28.99 L"**, but every
  secondary puts the top trims *above* that: ₹29.7 L, ₹30.23 L, ₹30.43 L, ₹30.66 L for the
  Empowered AWD/QWD Stealth and ACFC variants. The stored `29.19` sits between Tata's stated maximum
  and the secondaries' figures. Tata's headline appears to cover only the non-Stealth/non-ACFC
  trims, but that is inference, not evidence. **Floor `21.69` confirmed; ceiling genuinely
  conflicting.**
- **`tata-sierra-ev`** — floor **18.79 confirmed** by Tata. Tata does not publish the ceiling;
  secondaries give ₹26.48 L, with the QWD option reportedly adding ₹1.2 L on top. Stored `25.99`
  matches none of these cleanly. Note the stored variant name `Empowered A 75 QWD` **is legitimate**
  — QWD (Quad Wheel Drive) is a real Tata designation, not a typo for AWD.
- **`tata-tigor-ev`** — floor **12.49 confirmed**, model **confirmed still on sale** (an
  availability check, since a stale `available` status was a Batch 7 failure mode). Variant names
  `XE` / `XZ+ LUX` match Tata's Tigor.ev table. Ceiling `13.75` not published; unverified.

---

## The specific traps checked for

| Trap | Found? |
|---|---|
| Ex-showroom vs on-road confusion | **Risk present** — Tata renders Tiago.ev and Tigor.ev variants under "Offer Price", not a plain ex-showroom figure |
| Introductory / launch pricing | **Suspected on Tiago.ev** (₹6.99 L). Not adopted, for exactly the reason phase 1 found two such floors already |
| Variant-specific pricing | **Yes** — Nexon (two variants) and Punch (one) had drifted independently of their range |
| City-specific pricing | **No defect.** Tata's pages require a city; this dataset stores city-agnostic ex-showroom and applies city adjustment through `src/lib/vehicle-pricing/cityPriceZones.ts`. The two models are consistent |
| Discontinued variant pricing | **Yes** — Nexon carried the retired `LR` suffix (fixed); Tiago carries ICE `XE`/`XZ+` naming (unresolved) |
| Ranges excluding/including variants incorrectly | **Yes** — Nexon's ceiling excluded the `#DARK` trims |

---

## Summary

| | Count |
|---|---:|
| Tata records audited | **7 of 7** |
| Corrected | **2** (`tata-nexon-ev`, `tata-punch-ev`) |
| Confirmed correct as stored | **0 fully** — 3 confirmed on the floor only |
| Unresolved | **5** (2 outdated-but-blocked, 3 partially confirmed) |

**No Tata record is now certified fully correct.** Three have a Tata-confirmed floor and an
unverified ceiling; that is better than before and is not the same as verified.

### Files changed

- `src/lib/data/cars.ts` — `tata-nexon-ev`, `tata-punch-ev` only
- `src/lib/vehicle-prices.test.ts` — one added test
- `PRICE_AUDIT_TATA.md` — this document

### Exact data changes

```
tata-nexon-ev  priceRangeLakh  [12.49, 17.19] -> [12.49, 17.69]
               variant creative-mr  "Creative MR"    12.49 -> creative-plus-mr    "Creative Plus MR"  12.49
               variant fearless-lr  "Fearless LR"    15.49 -> fearless-45         "Fearless 45"       14.99
               variant empowered-lr "Empowered+ LR"  17.19 -> empowered-plus-a-45 "Empowered+ A 45"   16.99

tata-punch-ev  priceRangeLakh  [9.69, 12.79] -> [9.69, 12.59]
               variant empowered-plus-s-40  12.79 -> 12.59
```

No battery, range, top-speed or `batteryMeasuredAt` value was touched, and no other OEM's records
were opened.

### Tests

Added one case to `vehicle-prices.test.ts` pinning both corrected records, including a guard that
the retired `LR` variant name cannot return. The existing containment invariant (`priceRangeLakh`
must contain every variant) was re-run across all 123 records and still holds — **no existing test
was weakened or removed**.
