import { getVehiclesByCategory } from "@/lib/data";
import { CATEGORIES } from "@/lib/data/categories";
import type { VehicleCategory } from "@/types/vehicle";

/**
 * Filter facets that have to be derived from the live dataset rather than
 * hardcoded — currently just the distinct seating capacities on offer.
 *
 * **Server-side only** (it imports `@/lib/data`). Call it from a Server
 * Component and pass the result down as a prop; the homepage's `SearchCard`
 * used to call `getVehiclesByCategory()` itself, which meant the entire
 * vehicle catalog shipped in the homepage's client bundle purely to compute
 * a list of four small integers.
 *
 * Deriving rather than hardcoding is deliberate: per CLAUDE.md point 5a, a
 * hand-maintained facet list silently goes stale when a data batch adds a
 * vehicle outside the existing set, and neither `tsc`, `eslint` nor
 * `next build` catches that.
 */
export type SeatOptionsByCategory = Record<VehicleCategory, number[]>;

export function seatOptionsByCategory(): SeatOptionsByCategory {
  return Object.fromEntries(
    CATEGORIES.map(({ key: category }) => [
      category,
      Array.from(
        new Set(
          getVehiclesByCategory(category)
            .map((v) => v.seatingCapacity)
            .filter((s): s is number => s != null),
        ),
      ).sort((a, b) => a - b),
    ]),
  ) as SeatOptionsByCategory;
}
