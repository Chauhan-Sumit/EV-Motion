"use client";

import { useMemo } from "react";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import type { VehiclePricingSnapshot, VehiclePricingSubject } from "@/lib/vehicle-pricing";

export type { VehiclePricingSubject };

/**
 * The single source of pricing truth for the whole site, not just the
 * Vehicle Detail Page — every pricing-aware component anywhere (VDP price
 * card/summary/EMI/similar-cars row, homepage Featured Vehicle and cards,
 * listing/brand page cards, Compare page) calls this same hook rather than
 * deriving its own city math — so a city change (from the global
 * `LocationContext`) recomputes every one of them identically and
 * simultaneously, with the math living in exactly one place
 * (`src/lib/vehicle-pricing/`).
 */
export function useVehiclePricing(vehicle: VehiclePricingSubject): VehiclePricingSnapshot {
  const { city } = useLocation();
  const [lowLakh, highLakh] = vehicle.priceRangeLakh;

  return useMemo(
    () =>
      getVehiclePricingSnapshot({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        exShowroomRangeLakh: [lowLakh, highLakh],
        city,
      }),
    [vehicle.id, vehicle.name, lowLakh, highLakh, city],
  );
}
