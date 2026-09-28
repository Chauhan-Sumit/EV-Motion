"use client";

import { useMemo } from "react";
import { useLocation } from "@/context/LocationContext";
import { chargesForState } from "@/lib/data/state-charges";
import { getPricingConfig } from "@/lib/vehicle-pricing";
import type { VehicleCategory } from "@/types/vehicle";
import type { PricingAssumptions } from "./types";

/**
 * Assembles the page's pricing assumptions for the current city and vehicle.
 *
 * **Every figure here is read, never written.** The rate, the tenure, the
 * slider bounds and the tariffs all come from the pricing service's
 * configuration (`@/lib/vehicle-pricing/config`), so changing any of them is a
 * deployment setting rather than an edit to this page. The Vehicle Detail Page
 * owns no assumption of its own — it previously held its own slider bounds and
 * tariffs in `chrome.ts`, which is how a page ends up quoting a different EMI
 * from the listing card beside it.
 *
 * Why a hook and not part of the view model: these routes are statically
 * generated, so anything baked in at build time is baked in for every visitor.
 * The city lives in the global `LocationContext` and changes at runtime, and
 * the RTO rates follow from it — so the on-road figure has to be computed
 * client-side or it would silently show one city's tax to everyone.
 *
 * `chargesForState` and `@/lib/vehicle-pricing` are both catalogue-free, so
 * importing them here does not drag vehicle records into the client bundle
 * (CLAUDE.md #23).
 */
export function useVdpPricingAssumptions(category: VehicleCategory): PricingAssumptions {
  const { city } = useLocation();

  return useMemo(() => {
    const { finance, runningCost } = getPricingConfig({ state: city.state, category });
    const comparator = runningCost.petrolComparatorByCategory[category];

    return {
      charges: chargesForState(city.state),
      annualRatePct: finance.annualRatePct,
      defaultTenureMonths: finance.defaultTenureMonths,
      tenureOptions: finance.tenureMonths,
      downPaymentOptions: finance.downPaymentPct,
      electricityCostPerUnit: runningCost.electricityCostPerUnit,
      petrolPricePerLitre: runningCost.petrolPricePerLitre,
      // Category-aware: a scooter is costed against a petrol scooter, not a car.
      petrolKmPerLitre: comparator.kmPerLitre,
      petrolComparatorLabel: comparator.label,
      daysPerMonth: runningCost.daysPerMonth,
      city: city.name,
      state: city.state,
    };
  }, [city, category]);
}
