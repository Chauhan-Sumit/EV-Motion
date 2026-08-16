import { cars } from "@/lib/data/cars";
import type { Vehicle } from "@/types/vehicle";

/** Slug of the vehicle promoted in the homepage's Featured EV banner. */
const FEATURED_SLUG = "tata-nexon-ev";

/**
 * The homepage's "Featured EV of the Week" pick.
 *
 * **Server-side only** — it imports the car catalog. `FeaturedBanner` is a
 * client component (it needs `useVehiclePricing` for a city-aware price), so
 * it takes the chosen vehicle as a prop instead of selecting one itself;
 * doing the selection inside the client component put all 54 car records
 * into the homepage bundle to pick exactly one of them.
 */
export function featuredVehicle(): Vehicle {
  return cars.find((v) => v.slug === FEATURED_SLUG) ?? cars[0];
}
