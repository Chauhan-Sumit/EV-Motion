import type { City } from "@/lib/data/cities";

/**
 * The "City Pricing Service" data layer: how much a vehicle's ex-showroom
 * price is estimated to differ from its base catalog price in a given city.
 *
 * Real Indian ex-showroom prices genuinely vary city-to-city — manufacturers
 * quote different figures per RTO/state mainly because of freight/logistics
 * cost from the factory and state-level levies baked into the "ex-showroom"
 * figure itself (this is separate from the registration/road-tax/insurance
 * layered on top afterward in `state-charges.ts` to reach the on-road price).
 *
 * This app has no sourced per-city price sheet (no backend, no manufacturer
 * feed), so — same honesty convention as `state-charges.ts` ("estimated, not
 * sourced from a live API") — this models the *shape* of that real variation
 * with a small, explainable, two-factor formula instead of 150+ hand-typed,
 * unsourced numbers that would look precise but be arbitrary:
 *
 *   1. A per-state "logistics zone" — states with major EV/auto manufacturing
 *      and the biggest dealer networks (Delhi-NCR, Maharashtra, Gujarat,
 *      Tamil Nadu, Karnataka) sit closest to 0%; farther states carry a
 *      progressively larger estimated freight premium.
 *   2. A small non-metro tier extra — a city not in `cities.ts`'s curated
 *      `popular` metro set gets a modest additional bump (smaller dealer
 *      volume, longer last-mile logistics).
 *
 * A handful of Delhi-NCR satellite cities (Noida, Gurugram, Ghaziabad,
 * Faridabad) are pinned to Delhi's own 0% via `CITY_OVERRIDE_PCT` — they sit
 * in Uttar Pradesh/Haryana's state zone on paper, but are realistically part
 * of the same logistics catchment as Delhi, not a separate one.
 *
 * Every value here renders through UI copy labeled "estimated" — same
 * convention as the rest of the pricing system.
 */

/** Per-state estimated ex-showroom adjustment, in %, relative to the Delhi-NCR/manufacturing-belt baseline. */
const STATE_ZONE_PCT: Record<string, number> = {
  // Manufacturing/logistics belt — baseline
  Delhi: 0,
  Haryana: 0,
  Maharashtra: 0.25,
  Gujarat: 0.25,
  "Tamil Nadu": 0.25,
  Karnataka: 0.25,

  // Rest of North/West India
  "Uttar Pradesh": 0.5,
  Telangana: 0.5,
  Rajasthan: 0.75,
  Punjab: 0.75,
  "Madhya Pradesh": 0.75,
  "Andhra Pradesh": 1,
  Chandigarh: 0.5,

  // South (further from the western manufacturing belt)
  Kerala: 1.25,

  // East
  "West Bengal": 1.25,
  Chhattisgarh: 1.25,
  Odisha: 1.5,
  Jharkhand: 1.5,
  Bihar: 1.75,

  // Hill states + Goa
  Uttarakhand: 1.5,
  Goa: 1,
  "Himachal Pradesh": 2,

  // Union territories (non-NCR)
  Puducherry: 1.5,
  "Dadra & Nagar Haveli and Daman & Diu": 1,

  // Northeast — genuinely longer freight routes in reality
  Assam: 2.5,
  Tripura: 2.75,
  Manipur: 2.75,
  Meghalaya: 2.75,
  Mizoram: 2.75,
  Nagaland: 2.75,
  "Arunachal Pradesh": 3,
  Sikkim: 2.5,

  // Far north / islands — highest estimated freight premium
  "Jammu & Kashmir": 3.5,
  Ladakh: 4.5,
  "Andaman & Nicobar Islands": 4,
  Lakshadweep: 4,
};

/** Fallback for any state not explicitly listed above — never leaves a city with no price, per "gracefully fall back, never blank." */
const DEFAULT_ZONE_PCT = 2;

/** Extra estimated logistics cost for a city outside `cities.ts`'s curated metro (`popular: true`) set. */
const NON_METRO_EXTRA_PCT = 0.5;

/** Delhi-NCR satellite cities — same logistics catchment as Delhi despite sitting in a different state on paper. */
const CITY_OVERRIDE_PCT: Partial<Record<string, number>> = {
  noida: 0,
  gurugram: 0,
  ghaziabad: 0,
  faridabad: 0,
};

export interface CityPriceZone {
  /** % ex-showroom adjustment vs. a vehicle's base catalog price, for this city. */
  exShowroomAdjustmentPct: number;
}

export function cityPriceZone(city: City): CityPriceZone {
  const override = CITY_OVERRIDE_PCT[city.id];
  if (override !== undefined) return { exShowroomAdjustmentPct: override };

  const statePct = STATE_ZONE_PCT[city.state] ?? DEFAULT_ZONE_PCT;
  const tierExtra = city.popular ? 0 : NON_METRO_EXTRA_PCT;
  return { exShowroomAdjustmentPct: statePct + tierExtra };
}

/** Rounds to the nearest ₹0.01L (2 decimal places), matching `formatPriceLakh`'s display precision. */
function roundLakh(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Applies a city's ex-showroom adjustment to a vehicle's base [low, high] price range, in lakh. */
export function cityAdjustedExShowroomRange(baseRangeLakh: [number, number], city: City): [number, number] {
  const { exShowroomAdjustmentPct } = cityPriceZone(city);
  const factor = 1 + exShowroomAdjustmentPct / 100;
  return [roundLakh(baseRangeLakh[0] * factor), roundLakh(baseRangeLakh[1] * factor)];
}
