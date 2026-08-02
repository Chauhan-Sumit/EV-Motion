import type { Vehicle } from "@/types/vehicle";

export interface VehiclePricingSubject {
  id: string;
  name: string;
  /** In lakh, [low, high] across variants. */
  priceRangeLakh: [number, number];
}

/**
 * Adapts any raw catalog `Vehicle` into the pricing system's plain subject
 * shape — the one place that mapping happens, instead of a
 * `{ id: v.id, name: v.modelName, priceRangeLakh: v.priceRangeLakh }` literal
 * repeated at every call site. Deliberately NOT in `useVehiclePricing.ts`
 * (which is `"use client"`) — a "use client" file's exports, even a plain
 * function with no hooks, can't be *called* from a Server Component (only
 * rendered as/passed to a Client Component), and this needs to be callable
 * from Server Components like `ListingCard`/`RankedListCard`/`CompareCard`.
 */
export function vehiclePricingSubject(vehicle: Vehicle): VehiclePricingSubject {
  return { id: vehicle.id, name: vehicle.modelName, priceRangeLakh: vehicle.priceRangeLakh };
}
