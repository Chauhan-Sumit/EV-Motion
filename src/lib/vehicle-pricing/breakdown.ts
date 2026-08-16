import type { StateCharges } from "@/lib/data/state-charges";
import type { PriceBreakdown, PriceRangeBreakdown } from "./types";

/**
 * Ex-showroom + Registration/RTO + Road Tax + Insurance + Other (standard)
 * Charges for a given state's rates — the one place *any* on-road price on
 * the site is computed, for every page.
 *
 * (An earlier pass kept this separate from a `src/lib/pricing.ts` used by the
 * Compare page and homepage. That split was undone and `pricing.ts` deleted
 * when the brief became "every price on the site is city-aware, single source
 * of truth" — see CLAUDE.md point 16. Don't reintroduce a second one.)
 *
 * `onRoad` is always exactly the sum of the components returned alongside it;
 * `pricing.test.ts` pins that, since a breakdown that doesn't add up to its
 * own total is a credibility problem rather than a rounding curiosity.
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
