import type { StateCharges } from "@/lib/data/state-charges";
import type { PriceBreakdown, PriceRangeBreakdown } from "./types";

/**
 * Ex-showroom + Registration/RTO + Road Tax + Insurance + Other (standard)
 * Charges for a given state's rates — the one place the VDP's on-road price
 * is ever computed. Deliberately separate from `src/lib/pricing.ts`'s
 * `onRoadPriceBreakdown` (used by the Compare page and homepage Subsidy
 * Calculator, out of scope for this pass) so this itemized breakdown doesn't
 * change those pages' numbers.
 */
export function calculatePriceBreakdown(exShowroom: number, charges: StateCharges): PriceBreakdown {
  const registration = Math.round(exShowroom * (charges.registrationPct / 100));
  const roadTax = Math.round(exShowroom * (charges.roadTaxPct / 100));
  const insurance = Math.round(exShowroom * (charges.insurancePct / 100));
  const otherCharges = charges.otherChargesFlat;
  return {
    exShowroom,
    registration,
    roadTax,
    insurance,
    otherCharges,
    onRoad: exShowroom + registration + roadTax + insurance + otherCharges,
  };
}

export function calculatePriceRangeBreakdown(
  exShowroomRange: [number, number],
  charges: StateCharges,
): PriceRangeBreakdown {
  return {
    low: calculatePriceBreakdown(exShowroomRange[0], charges),
    high: calculatePriceBreakdown(exShowroomRange[1], charges),
  };
}
