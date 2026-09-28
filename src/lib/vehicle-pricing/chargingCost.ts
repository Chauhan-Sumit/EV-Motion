import type { VehicleCategory } from "@/types/vehicle";
import { getPricingConfig } from "./config";

/**
 * Estimated monthly home-charging electricity cost.
 *
 * The daily distance, the days-per-month and the ₹/unit tariff all come from
 * `config.ts`. They used to be written out here *and* in
 * `toVehicleDetail.ts`'s ownership tools, with a comment admitting the two
 * were "kept in sync deliberately" — which is a promise a comment cannot keep.
 *
 * `ratePerUnit` stays overridable per call for the rare caller that needs a
 * different tariff, but it defaults to the configured one, so a call site that
 * simply wants "the site's electricity rate" must pass nothing rather than
 * restate the number.
 *
 * Labelled "estimated" everywhere it is displayed, same as the rest of the
 * ownership tools.
 */
export function estimateMonthlyChargingCost(
  vehicle: { category: VehicleCategory; rangeKm: number; batteryCapacityKwh: number },
  ratePerUnit?: number,
): number {
  const { runningCost } = getPricingConfig({ category: vehicle.category });
  const rate = ratePerUnit ?? runningCost.electricityCostPerUnit;
  const monthlyKm = runningCost.dailyKmByCategory[vehicle.category] * runningCost.daysPerMonth;
  const unitsPerMonth = (monthlyKm / vehicle.rangeKm) * vehicle.batteryCapacityKwh;
  return unitsPerMonth * rate;
}
