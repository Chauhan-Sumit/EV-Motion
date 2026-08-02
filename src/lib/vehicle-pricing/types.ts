/**
 * Shared shape for the Vehicle Detail Page's centralized pricing system.
 * Every VDP pricing widget (hero price card, price summary, EMI calculator,
 * compare-similar row) consumes a `VehiclePricingSnapshot` — never its own
 * copy of the math — so a city change recomputes them all identically.
 */

export interface PriceBreakdown {
  exShowroom: number;
  registration: number;
  roadTax: number;
  insurance: number;
  otherCharges: number;
  onRoad: number;
}

/** Ex-showroom is a range ([low, high] across variants) — so is everything derived from it. */
export interface PriceRangeBreakdown {
  low: PriceBreakdown;
  high: PriceBreakdown;
}

export interface VehiclePricingSnapshot {
  vehicleId: string;
  vehicleName: string;
  cityId: string;
  cityName: string;
  stateName: string;
  /** The vehicle's catalog price range, before any city adjustment. */
  baseExShowroomRangeLakh: [number, number];
  /** Ex-showroom price range adjusted for this city — THE number every UI surface should display as "the price." Varies city to city; see `cityPriceZones.ts`. */
  exShowroomRangeLakh: [number, number];
  /** On-road breakdown computed from the city-adjusted ex-showroom above, not the base catalog price. */
  breakdown: PriceRangeBreakdown;
  /** Estimated monthly EMI off the city-adjusted low-end ex-showroom (see `emi.ts`'s DEFAULT_EMI_ASSUMPTION). */
  emiFromPerMonth: number;
  /** ISO date string. Local static data today — a future backend would return a real per-vehicle/per-city timestamp here instead, no consumer changes needed. */
  lastUpdated: string;
}
