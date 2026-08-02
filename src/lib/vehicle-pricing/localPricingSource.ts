import type { City } from "@/lib/data/cities";
import { chargesForState } from "@/lib/data/state-charges";
import { calculatePriceRangeBreakdown } from "./breakdown";
import { cityAdjustedExShowroomRange } from "./cityPriceZones";
import { estimateEmiFrom } from "./emi";
import type { VehiclePricingSnapshot } from "./types";

/**
 * "Last verified" date for the local placeholder pricing dataset (state
 * rates in `src/lib/data/state-charges.ts`, city zones in `cityPriceZones.ts`)
 * — every UI surface showing "Price last updated" reads this one constant.
 * A future backend would return a real per-vehicle/per-city timestamp from
 * `GET /api/pricing/...` instead of a single site-wide date; see
 * `pricingSource.ts`.
 */
export const PRICING_DATA_LAST_UPDATED = "2026-08-02";

export interface VehiclePricingInput {
  vehicleId: string;
  vehicleName: string;
  /** In lakh, [low, high] across variants — the vehicle's BASE catalog price, same shape as `Vehicle.priceRangeLakh`. */
  exShowroomRangeLakh: [number, number];
  city: City;
}

/**
 * Builds a full pricing snapshot for one vehicle in one city from local,
 * structured static data: `cityPriceZones.ts` adjusts the base ex-showroom
 * price for the city, then `state-charges.ts`'s state-indexed rate table
 * layers on-road extras (registration/road tax/insurance/other charges) on
 * top of THAT adjusted figure — so both the ex-showroom price itself and the
 * on-road total vary by city, not just the on-road extras.
 *
 * This is the "local" implementation behind the `pricingSource.ts` adapter
 * seam — nothing outside `src/lib/vehicle-pricing/` should import this file
 * directly.
 */
export function getVehiclePricingSnapshot({
  vehicleId,
  vehicleName,
  exShowroomRangeLakh,
  city,
}: VehiclePricingInput): VehiclePricingSnapshot {
  const charges = chargesForState(city.state);
  const adjustedRangeLakh = cityAdjustedExShowroomRange(exShowroomRangeLakh, city);
  const adjustedRangeRupees: [number, number] = [
    Math.round(adjustedRangeLakh[0] * 100000),
    Math.round(adjustedRangeLakh[1] * 100000),
  ];
  const breakdown = calculatePriceRangeBreakdown(adjustedRangeRupees, charges);

  return {
    vehicleId,
    vehicleName,
    cityId: city.id,
    cityName: city.name,
    stateName: city.state,
    baseExShowroomRangeLakh: exShowroomRangeLakh,
    exShowroomRangeLakh: adjustedRangeLakh,
    breakdown,
    emiFromPerMonth: estimateEmiFrom(adjustedRangeRupees[0]),
    lastUpdated: PRICING_DATA_LAST_UPDATED,
  };
}
