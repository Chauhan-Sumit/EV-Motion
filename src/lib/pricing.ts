import type { StateCharges } from "@/lib/data/state-charges";
import type { VehicleCategory } from "@/types/vehicle";

export interface OnRoadPriceBreakdown {
  exShowroom: number;
  registration: number;
  registrationLabel: string;
  insurance: number;
  onRoad: number;
}

/**
 * Ex-showroom + RTO/registration + insurance for a given state's charges.
 * Single source of truth — previously duplicated between SidebarPriceSummary
 * and SectionCompareSimilar (one with a breakdown + label, one number-only).
 */
export function onRoadPriceBreakdown(exShowroom: number, charges: StateCharges): OnRoadPriceBreakdown {
  const registration = Math.round(exShowroom * (charges.registrationPct / 100));
  const insurance = Math.round(exShowroom * (charges.insurancePct / 100));
  return {
    exShowroom,
    registration,
    registrationLabel: charges.registrationPct === 0 ? "RTO & registration (EV waiver)" : "RTO & registration",
    insurance,
    onRoad: exShowroom + registration + insurance,
  };
}

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalCost: number;
}

/** Standard reducing-balance EMI amortization. */
export function calculateEmi({
  principal,
  annualRatePct,
  tenureMonths,
}: {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
}): EmiResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalCost: 0 };
  }
  if (annualRatePct <= 0) {
    const emi = principal / tenureMonths;
    return { emi, totalInterest: 0, totalCost: principal };
  }
  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  const totalCost = emi * tenureMonths;
  return { emi, totalInterest: totalCost - principal, totalCost };
}

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
