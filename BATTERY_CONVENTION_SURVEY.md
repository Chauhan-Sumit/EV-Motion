# Battery Capacity Convention — Survey (2026-08-21)

**Status: complete. The survey is closed — every car states a basis.** Started as a diagnostic pass for the open 🔴 item "Gross-vs-net battery convention — unaudited across the whole catalogue" in
[`HANDOFF.md`](HANDOFF.md)'s data-quality register. It answers *what convention each record
actually follows* so the convention decision can be made on real numbers rather than on the two
records (`bmw-ix`, `hyundai-ioniq-9`) that happened to surface during the Batch 7 staleness sweep.

Branches: `battery-convention-audit` (survey + schema + gate), then `byd-battery-sourcing` (the
last four records), both off `data-model-decisions` at `4df4a1a`.

---

## The headline

**The catalogue is not on one convention, and it cannot be put on one.**

| | Cars (54) |
| --- | --- |
| Records carrying a **gross / nominal** figure | **43** (22 confirmed against a published pair, 21 inferred from single-figure publication) |
| Records carrying a **net / usable** figure | **11** (all confirmed) |
| **Unresolved** | **0** — the last four (all BYD) were resolved 2026-08-22, see the BYD section below |

Two-wheelers (69) are a separate problem and are covered in their own section below: the question is
mostly **not answerable from published sources**, because Indian two-wheeler OEMs publish a single
rated figure and do not disclose usable capacity.

### Three findings that change what the fix has to look like

**1. Two OEMs are internally inconsistent — the defect is not merely cross-brand.**

*BMW is split 3 / 2 inside its own five records.* `bmw-ix1-lwb`, `bmw-i4` and `bmw-i5` carry gross
figures; `bmw-ix` and `bmw-i7` carry net ones. So the iX is understated by 6.3 kWh against the i4
sitting next to it in the same Compare table, from the same manufacturer.

*BYD is split too*, and worse: `byd-atto-3`'s 60.5 is the **usable** figure (64.8 total / 60.48
usable), while `byd-seal`'s 82.5 and `byd-sealion-7`'s 82.56 are **the same Blade pack rounded two
different ways within this catalogue**.

**2. Standardising on gross is impossible without inventing numbers.** Mercedes-Benz publishes
**usable capacity only** and does not disclose a gross figure at all — the ~120 kWh figures in
circulation for the EQS are third-party estimates. Converting the four Mercedes records to gross
would mean recording an estimate as a specification, which is exactly what
[`CLAUDE.md`](CLAUDE.md) point 22 and the Batch 1 data-honesty invariant forbid.

**3. Standardising on net is equally impossible.** Tata, MG, Mahindra, VinFast and every
two-wheeler OEM in the dataset publish one nominal pack figure and no usable figure. Deriving a
usable number from a buffer assumption would be the same violation in the other direction.

**Neither single-convention policy is reachable.** The convention decision is therefore not
"gross or net" — it is *how to record which one each figure is*, which is the shape
`torqueMeasuredAt` already solved for the hub-vs-shaft problem.

---

## Cars — full classification (54 records)

`confirmed` = a published gross/usable pair was found and the stored figure matches one side of it.
`inferred` = the OEM publishes a single nominal pack figure and no usable figure, so the stored
value is nominal by construction. `unresolved` = sources conflict, or the figure matches neither side.

| Record | OEM | Model | Stored kWh | Convention | Confidence | Basis / note |
| --- | --- | --- | --- | --- | --- | --- |
| `tata-nexon-ev` | Tata Motors | Nexon EV | 45 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `tata-tiago-ev` | Tata Motors | Tiago EV | 24 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `tata-curvv-ev` | Tata Motors | Curvv EV | 45 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `tata-punch-ev` | Tata Motors | Punch EV | 40 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `tata-tigor-ev` | Tata Motors | Tigor EV | 26 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `tata-harrier-ev` | Tata Motors | Harrier EV | 75 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `tata-sierra-ev` | Tata Motors | Sierra EV | 75 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mg-zs-ev` | MG Motor | ZS EV | 50.3 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mg-comet-ev` | MG Motor | Comet EV | 17.3 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mg-windsor-ev` | MG Motor | Windsor EV | 52.9 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mg-cyberster` | MG Motor | Cyberster | 77 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mg-m9` | MG Motor | M9 | 90 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `hyundai-kona-electric` | Hyundai | Kona Electric | 39.2 | **GROSS** | confirmed | E-GMP/Hyundai published figures are totals |
| `hyundai-creta-electric` | Hyundai | Creta Electric | 51.4 | **GROSS** | confirmed | same |
| `hyundai-ioniq-5` | Hyundai | Ioniq 5 | 72.6 | **GROSS** | confirmed | 72.6 stated as total, a few % less usable |
| `hyundai-ioniq-6` | Hyundai | Ioniq 6 | 77.4 | **GROSS** | confirmed | 77.4 total |
| `hyundai-ioniq-9` | Hyundai | Ioniq 9 | 110.3 | **GROSS** | confirmed | 110.3 gross / 106.0 usable — already noted in-repo |
| `mahindra-xuv400` | Mahindra | XUV400 | 39.4 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mahindra-be-6` | Mahindra | BE 6 | 79 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mahindra-xev-9e` | Mahindra | XEV 9e | 79 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mahindra-xev-9s` | Mahindra | XEV 9S | 79 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `mahindra-xuv-3xo-ev` | Mahindra | XUV 3XO EV | 39.4 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `byd-atto-3` | BYD | Atto 3 | 60.5 | **NET** | confirmed | 64.8 total / 60.48 usable — record rounds the usable figure |
| `byd-seal` | BYD | Seal | 82.56 | **NET** | confirmed | Corrected from 82.5 to BYD's published 82.56. Resolved 2026-08-22 |
| `byd-e6` | BYD | e6 | 71.7 | **NET** | confirmed | Brand convention; BYD India pairs this pack with the 415 km WLTP figure the record carries |
| `byd-emax-7` | BYD | eMAX 7 | 71.8 | **NET** | confirmed | Brand convention; 55.4/71.8 split matches BYD India's Premium/Superior line-up |
| `byd-sealion-7` | BYD | Sealion 7 | 82.56 | **NET** | confirmed | EV Database labels this figure "useable" and only estimates the total at 84 |
| `kia-ev6` | Kia | EV6 | 77.4 | **GROSS** | confirmed | 77.4 total |
| `kia-ev9` | Kia | EV9 | 99.8 | **GROSS** | confirmed | 99.8 total |
| `kia-carens-clavis-ev` | Kia | Carens Clavis EV | 51.4 | **GROSS** | confirmed | 51.4 total |
| `kia-syros-ev` | Kia | Syros EV | 51.4 | **GROSS** | confirmed | 51.4 total |
| `bmw-ix1-lwb` | BMW | iX1 LWB | 66.4 | **GROSS** | confirmed | 66.5 gross / 64.8 usable |
| `bmw-i4` | BMW | i4 | 83.9 | **GROSS** | confirmed | 83.9 nominal / 81.3 usable (EV Database) |
| `bmw-i5` | BMW | i5 | 83.9 | **GROSS** | confirmed | 83.9 as published by BMW India; usable 81.2. Sources differ on gross (83.9 vs 84.4) |
| `bmw-ix` | BMW | iX | 105.2 | **NET** | confirmed | 111.5 gross / 105.2 net — BMW India states both |
| `bmw-i7` | BMW | i7 | 101.7 | **NET** | confirmed | 105.7 gross / 101.7 usable |
| `mercedes-benz-eqs` | Mercedes-Benz | EQS | 107.8 | **NET** | confirmed | 107.8 usable; Mercedes does not publish gross |
| `mercedes-benz-g580` | Mercedes-Benz | G 580 with EQ Technology | 116 | **NET** | confirmed | 116 usable / 120 gross |
| `mercedes-benz-maybach-eqs-suv` | Mercedes-Benz | Maybach EQS SUV | 122 | **GROSS** | confirmed | Autocar India, on the India car: "122kWh battery pack (118kWh usable)". European listings give the gross as 125 — a source discrepancy, not a convention error |
| `mercedes-benz-eqe` | Mercedes-Benz | EQE | 90.6 | **NET** | confirmed | 90.6 usable |
| `audi-q8-e-tron` | Audi | Q8 e-tron | 114 | **GROSS** | confirmed | 114 gross / 106 usable (audi.com) |
| `audi-e-tron-gt` | Audi | e-tron GT | 93.4 | **GROSS** | confirmed | 93.4 gross / 84 net |
| `volvo-ex30` | Volvo | EX30 | 69 | **GROSS** | confirmed | 69 gross / 65 usable |
| `volvo-ex40` | Volvo | EX40 | 78 | **GROSS** | confirmed | 78 gross / 75 usable |
| `volvo-ec40` | Volvo | EC40 | 78 | **GROSS** | confirmed | 78 gross / 75 usable |
| `mini-countryman-electric` | MINI | Countryman Electric | 66.45 | **GROSS** | confirmed | 66.45 total (BMW-group convention) |
| `mini-cooper-se` | MINI | Cooper SE | 32.6 | **GROSS** | inferred | 32.6 nominal; usable ~28.9 not published by MINI India |
| `porsche-taycan` | Porsche | Taycan | 105 | **GROSS** | confirmed | 105 gross / 97 usable |
| `porsche-macan-electric` | Porsche | Macan Electric | 100 | **GROSS** | confirmed | 100 gross / 95 usable |
| `lotus-eletre` | Lotus | Eletre | 112 | **GROSS** | confirmed | 112 total / 107 usable |
| `lotus-emeya` | Lotus | Emeya | 102 | **GROSS** | inferred | 102 nominal; usable not published |
| `rolls-royce-spectre` | Rolls-Royce | Spectre | 102 | **NET** | confirmed | 105.7 gross / 102 usable |
| `vinfast-vf6` | VinFast | VF6 | 59.6 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |
| `vinfast-vf7` | VinFast | VF7 | 70.8 | **GROSS** | inferred | OEM publishes a single nominal pack figure; no usable figure disclosed |

### BYD — resolved 2026-08-22

**All five BYD records now carry `usable`, and the last four unresolved records in the catalogue
are closed.** The reason they were hard is worth recording: **BYD's own spec sheet does not say.**
The official Seal technical-data PDF on `byd.com` labels the row exactly **"Battery capacity
(kWh)"**, with "Blade Battery" as the type and no gross/usable qualifier anywhere. OEM-primary,
the repo's normal tiebreaker, is silent here.

Three independent lines settle it:

1. **Where a pair exists, BYD quotes the usable side.** The Atto 3 is 60.48 usable of a 64.8 kWh
   total, and 60.48 is BYD's published figure.
2. **No official gross figure exists to cite.** EV Database labels the Seal/Sealion 7 82.5 as
   *useable* and only **estimates** the total at 84 kWh. That estimate is the tell — structurally
   the same situation as Mercedes-Benz.
3. **The Seal spec sheet reconciles.** Capacity ÷ (WLTP range × published consumption):

| Variant | WLTP km | kWh/100km | Wall energy | Capacity | Ratio |
| --- | --- | --- | --- | --- | --- |
| Dynamic | 460 | 15.4 | 70.84 | 61.44 | 0.867 |
| Premium | 570 | 16.6 | 94.62 | 82.56 | 0.873 |
| Performance | 520 | 18.2 | 94.64 | 82.56 | 0.872 |

A consistent ~87% across three variants is a usable figure plus ~13% charging loss. A gross figure
with a normal buffer would imply ~19% charging losses, which is not credible. Premium and
Performance also cross-check against each other: same pack, wall energy 94.62 vs 94.64.

#### The rounding mismatch, and a worse problem underneath it

`byd-seal` carried **82.5** where `byd-sealion-7` carried **82.56** for the same Blade pack. BYD
publishes **82.56**, so the Seal was the imprecise one and is now corrected.

**Checking that turned up something bigger.** `byd-seal`'s variant table was materially wrong:
all three variants carried 82.5 kWh, and the Dynamic also carried the Premium's 650 km. BYD
India actually sells Dynamic (**61.44 kWh / 510 km**, RWD), Premium (82.56 / 650, **RWD**) and
Performance (82.56 / 580, AWD) — so the **entry car at the bottom of the price range was
overstated by 21 kWh and 140 km**, which is the figure a budget filter surfaces first. "Premium
AWD" was also a mislabel, and the Premium carried a duplicate of the Performance's ₹53.0L price.

All corrected. **Prices were deliberately not resolved here** — sources split at the decimal
(Dynamic 41.0 vs 41.5, Performance 53.0 vs 53.65) and they belong to the standing price audit
(HANDOFF.md data-quality item 2). The duplicated ₹53.0L is gone, since ₹46.2L is what every
source agrees on for the Premium.

The other four BYD records were checked for the same shape of error and are clean: `emax-7`
(55.4/420 + 71.8/530), `e6` (71.7 / 415 WLTP), `sealion-7` and `atto-3` all match their sources.
---

## Two-wheelers — the question is mostly unanswerable (69 records)

**No two-wheeler record was classified, and that is the finding.** Spot-checks across the volume
brands returned the same result each time: the OEM publishes one rated capacity and does not
publish usable capacity.

- **Ather** is the one exception, and it is the alarming one. The 450X's pack is **3.7 kWh installed
  / 3.24 kWh usable — an 87.6% ratio, a 12.4% buffer.** All four Ather records store 3.7. The
  buffer on a scooter is proportionally **two to three times larger** than on any car in this
  catalogue (BMW's is 3.5–5.2%). So the convention matters *more* on two-wheelers, not less — and
  it is precisely where the data to resolve it does not exist.
- **Ola** publishes 3 kWh / 4 kWh / 5.2 kWh nominal with no usable figure disclosed.
- **TVS and Bajaj** publish rated capacity only; neither discloses an IS 18590 usable figure.
- The remaining **27 OEMs** are single-record or low-volume brands (Ampere, Okinawa, BGauss, PURE
  EV, Komaki, Kinetic Green, Hop, Zelio, Tunwal, …) with thinner published specifications than the
  four above.

**Implication:** any policy requiring every record to declare gross-or-net would leave all 69
two-wheelers marked "unstated" — which is honest, and is what the existing `torqueMeasuredAt`
precedent already does for the same class of gap (`ampere-nexus` displays its torque but does not
rank on it).

---

## What this means for the fix

The survey did **not** produce a "change these N records" list, because that was not the question.
It produced a shape:

1. **A single-convention rewrite is off the table** — proven above, in both directions.
2. **The 43 gross / 11 net split is a real comparability defect today.** `bmw-ix` at 105.2 net is
   compared directly against `bmw-i4` at 83.9 gross, `audi-q8-e-tron` at 114 gross and
   `lotus-eletre` at 112 gross. The iX loses ground it should not lose, in the Compare winner
   engine, in kWh/100km efficiency, and in the battery filter bounds.
3. **The precedent already exists in this repo.** `VehicleMotor.torqueMeasuredAt` solved exactly
   this — a field that records *which quantity the number is*, plus a comparison gate in
   `src/lib/vehicle-torque.ts` that refuses to rank two values measured differently. A
   `batteryMeasuredAt: "gross" | "usable"` field with a matching gate in a
   `src/lib/vehicle-battery.ts` would be the same solution to the same shape of problem.
4. **`mercedes-benz-maybach-eqs-suv` was checked on its own merits and cleared** — see the
   correction below. It is a gross figure and it is current.

**Implemented 2026-08-21**: `BatteryMeasurementBasis`, an optional top-level
`Vehicle.batteryMeasuredAt`, a `src/lib/vehicle-battery.ts` gate, and the Compare/VDP call sites.
50 of 54 cars carried a basis at that point (43 gross, 7 usable), with four BYD records and all 69
two-wheelers unstamped and no battery figure changed.

**Completed 2026-08-22** (`byd-battery-sourcing`): the four BYD records resolved to `usable`, so
**all 54 cars now state a basis — 43 gross, 11 usable, 0 unresolved.** All 69 two-wheelers remain
deliberately unstamped and that has not changed. Two battery figures did move, both on `byd-seal`
and both corrections rather than restatements: the pack from 82.5 to BYD's published 82.56, and the
Dynamic variant from 82.5 kWh / 650 km to its actual 61.44 kWh / 510 km. See the BYD section.

---

## Correction — the Maybach EQS SUV (2026-08-21)

**The first version of this survey classified `mercedes-benz-maybach-eqs-suv` as unresolved and
flagged it as possible staleness. That was wrong, and this is the corrected finding.**

Autocar India's review of the India car states it outright: **"122kWh battery pack (118kWh
usable)"**, alongside 611 km WLTP and 10-80% in 31 minutes at 200 kW. All three figures match the
record exactly (`batteryCapacityKwh: 122`, `rangeKm: 611`, `chargingTimeFastMin: 31`).

So **122 is the gross figure, correctly paired with the car's 118 kWh usable pack, and the record is
current.** The original error was comparing the record against EV Database's European gross of
**125** without locating the India-market 122/118 pairing. The 122-vs-125 gap is a discrepancy
between Indian and European listings of the same gross figure — not a convention error and not
staleness.

Classification: **GROSS / confirmed**. No value changed.

---

## Method and its limits

- Roughly two dozen lookups (22 searches plus 4 direct page fetches, 2 of which failed), clustered by OEM,
  following the brand-by-brand method the Batch 7 sub-batches established. Sources were preferred in the order OEM-primary → specialist EV
  databases carrying explicit gross/usable pairs → aggregators.
- **`confirmed` means a gross/usable pair was located, not that an OEM-primary page was read for
  every record.** For E-GMP (Hyundai ×5, Kia ×4) the confirmation is a platform-level statement
  that the published figures are totals, applied to all nine records, rather than nine separate
  lookups.
- **The 21 `inferred` rows are the weakest tier.** "The OEM publishes one number and no usable
  figure" is strong evidence that the number is nominal, but it is not the same as seeing a pair.
  Tata, MG, Mahindra and VinFast sit here.
- Two-wheelers were spot-checked at the brand level (Ather, Ola, TVS, Bajaj = 20 of 69 records),
  not enumerated record by record.
- No `Vehicle` record, test, or schema file was modified.
