import type { VehicleCategory } from "@/types/vehicle";

/** Same daily-km assumption `toVehicleDetail.ts`'s ownershipTools() uses, kept in sync deliberately — not exported from there, so duplicated here as one small formula rather than reaching into VDP internals. */
const DAILY_KM_BY_CATEGORY: Record<VehicleCategory, number> = { car: 40, "2-wheeler": 25, commercial: 90 };

/** Estimated monthly home-charging electricity cost at a given ₹/unit rate — labeled "estimated" everywhere it's shown, same convention as the rest of the site's ownership tools. */
export function estimateMonthlyChargingCost(
  vehicle: { category: VehicleCategory; rangeKm: number; batteryCapacityKwh: number },
  ratePerUnit = 8,
): number {
  const monthlyKm = DAILY_KM_BY_CATEGORY[vehicle.category] * 30;
  const unitsPerMonth = (monthlyKm / vehicle.rangeKm) * vehicle.batteryCapacityKwh;
  return unitsPerMonth * ratePerUnit;
}
