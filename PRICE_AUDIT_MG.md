# Price Audit — Phase 2, Sub-batch 2: MG (2026-08-22)

Second OEM cluster, per the plan in [`PRICE_AUDIT.md`](PRICE_AUDIT.md). Branch `price-audit`.
**MG only — no other OEM was touched.**

**5 MG records**, all in `src/lib/data/cars.ts`.

Primary source: **`mgmotor.co.in`** model pages, which publish a full variant price table. The two
MG Select cars (Cyberster, M9) are not on those pages and are secondary-sourced — flagged as such
throughout.

**Every one of the five records was wrong.** This is the worst cluster found so far.

---

## Findings

| Vehicle | Current Stored | OEM Current | Status | Source | Action |
|---|---:|---:|---|---|---|
| `mg-zs-ev` | `[18.98, 24.98]` | `17.99 – 20.746` | **Outdated (severe)** | mgmotor.co.in | **Corrected** — ceiling was ₹4.23 L too high |
| `mg-windsor-ev` | `[13.49, 17.89]` | `14.698 – 18.998` | **Outdated, both ends** | mgmotor.co.in | **Corrected** + 5 real trims |
| `mg-comet-ev` | `[6.99, 9.98]` | `7.798 – 10.068` | **Outdated, both ends** | mgmotor.co.in | **Corrected** + 5 real trims |
| `mg-cyberster` | `[82.5, 82.5]` | `82.5 – 87.49` | **Ceiling excluded a trim** | Autocar / ZigWheels / CarWale | **Corrected** (secondary) |
| `mg-m9` | `[79.95, 79.95]` | `79.95 – 84.94` | **Ceiling excluded a trim** | Autocar / ZigWheels / CarLelo | **Corrected** (secondary) |

---

## Corrections

### `mg-zs-ev` — the worst single price error found in the audit so far

Stored ceiling **₹24.98 L against a real maximum of ₹20.746 L — ₹4.23 lakh above anything MG
sells.** The floor was also ₹99,000 high (18.98 vs 17.99).

MG's current table: Executive ₹17,99,000 · Excite Pro ₹18,74,600 · Exclusive Plus ₹19,99,600 ·
Essence ₹20,74,600. Exclusive Plus and Essence are each listed twice for two colourways at an
identical price, so each is modelled once — **a colour is not a trim.**

Model **confirmed still on sale**.

### `mg-windsor-ev` — both ends wrong, and a variant name that never existed

The ₹13.49 L floor **matched no current MG price at all** — battery-included starts at ₹14,69,800
(Excite). The ₹17.89 L ceiling was the Exclusive Pro, which is not the top trim: **Essence Pro is
₹18,99,800**.

`"Exclusive AC"` was **not an MG variant name**. MG sells Excite / Exclusive / Essence /
Exclusive Pro / Essence Pro — all five are now modelled. The record's existing 38 kWh vs 52.9 kWh
split (and its 332 km / 449 km MIDC ranges) was already correct and maps onto standard-vs-Pro
exactly, so no specification was changed.

### `mg-comet-ev` — retired trim names

Stored `[6.99, 9.98]` against MG's **₹7,79,800 – ₹10,06,800**. `"Pace"` and `"Play"` are **retired
Comet trim names**; MG now sells Executive / Excite / Excite FC / Exclusive / Exclusive FC, all
five now modelled. All share one 17.3 kWh pack and its 230 km range, so only price separates them
("FC" is the fast-charging option).

### `mg-cyberster` and `mg-m9` — flat ranges hiding a dearer edition

Both stored a **flat range** that excluded a trim MG sells — structurally the same defect as the
Porsche Macan in phase 1:

- Cyberster `[82.5, 82.5]` → **`[82.5, 87.49]`** (Couture Edition)
- M9 `[79.95, 79.95]` → **`[79.95, 84.94]`** (Couture Edition)

**Both are secondary-sourced** and carry lower confidence than the three above, because MG Select
cars are not on `mgmotor.co.in`'s vehicle pages. What raises confidence is that **the stored floor
already matched the sources exactly in both cases** — the disagreement was only ever about the
ceiling.

Each Couture Edition is an appearance edition on a shared powertrain, so range, battery and top
speed are shared and only price differs.

**Introductory prices deliberately not used.** The Cyberster's ₹72.49 L / ₹74.99 L and the M9's
₹69.90 L are July-2025 launch figures still in circulation — exactly the trap phase 1 found on
Oben and Ultraviolette.

---

## Battery-as-a-Service — MG makes this urgent

**MG offers BaaS on three of these five cars**, at a much lower sticker plus a per-km battery
rental:

| Model | Battery-included floor | BaaS floor |
|---|---:|---|
| Comet EV | ₹7.798 L | **₹4.99 L** + ₹3.2/km |
| Windsor EV | ₹14.698 L | **₹9.99 L** + ₹3.99/km (Pro: ₹12.25 L + ₹4.50/km) |
| ZS EV | ₹17.99 L | **₹13 L** + ₹4.50/km |

**This catalogue records the battery-included ex-showroom price throughout**, because that is what
`src/lib/vehicle-pricing/` turns into an on-road figure and what every other record carries. BaaS
is a **financing choice, not a trim**, and the schema has no concept for it.

Phase 1 parked Vida ×3 and Royal Enfield on exactly this question. **MG shows the problem is not a
two-brand edge case** — it now touches at least eight records across three brands, and the gap
between the two prices is large enough (₹4–5 lakh on Windsor and ZS) that a visitor comparing a
BaaS-quoted price elsewhere against this site would see a real discrepancy. **This is now the
strongest argument for a BaaS schema decision**, and it is recorded rather than acted on.

---

## The specific traps checked for

| Trap | Found? |
|---|---|
| Ex-showroom vs on-road confusion | No — MG publishes clean ex-showroom tables |
| Introductory / launch pricing | **Yes** — Cyberster (₹72.49/74.99 L) and M9 (₹69.90 L) launch figures still circulating. Not used |
| Variant-specific pricing | **Yes** — every model; three had entire trims missing |
| City-specific pricing | No defect — MG quotes a single ex-showroom; city adjustment stays with `cityPriceZones.ts` |
| Discontinued variant pricing | **Yes** — Comet `Pace`/`Play` retired; Windsor `Exclusive AC` never existed |
| Ranges excluding/including variants incorrectly | **Yes** — Cyberster and M9 flat ranges; Windsor ceiling stopped one trim short |
| Battery-as-a-Service | **Yes, on 3 of 5** — see above |

---

## Summary

| | Count |
|---|---:|
| MG records audited | **5 of 5** |
| Corrected | **5** |
| Already correct as stored | **0** |
| Unresolved | **0** |

Three are OEM-primary and can be called verified. **Two (Cyberster, M9) are secondary-sourced** and
should be re-checked if MG Select publishes a price page — their floors are corroborated, their
ceilings are not OEM-confirmed.

### Files changed

- `src/lib/data/cars.ts` — the five MG records only
- `src/lib/vehicle-prices.test.ts` — two added tests
- `PRICE_AUDIT_MG.md` — this document

### Exact data changes

```
mg-zs-ev        [18.98, 24.98] -> [17.99, 20.746]
                2 variants -> 4 (Executive / Excite Pro / Exclusive Plus / Essence)
mg-windsor-ev   [13.49, 17.89] -> [14.698, 18.998]
                3 variants -> 5 (Excite / Exclusive / Essence / Exclusive Pro / Essence Pro)
mg-comet-ev     [6.99, 9.98]   -> [7.798, 10.068]
                2 variants -> 5 (Executive / Excite / Excite FC / Exclusive / Exclusive FC)
mg-cyberster    [82.5, 82.5]   -> [82.5, 87.49]     + Couture Edition variant
mg-m9           [79.95, 79.95] -> [79.95, 84.94]    + Couture Edition variant
```

No battery, range, top-speed or `batteryMeasuredAt` value was changed on any record. Per-variant
battery and range figures were carried from the existing record where the trim shares the
powertrain, never invented.

### Tests

Two cases added to `vehicle-prices.test.ts`: one pinning the three OEM-primary ranges plus a guard
that the retired `Pace` / `Play` / `Exclusive AC` names cannot return, and one pinning the two
MG Select ceilings. The containment invariant was re-run across all 123 records and still holds.
**No existing test was weakened or removed.**
