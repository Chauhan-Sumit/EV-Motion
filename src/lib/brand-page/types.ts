import type { ListingCar } from "@/lib/cars-listing/types";

/** The brand fields the page renders — copied from the `Oem` record, nothing derived. */
export interface BrandIdentity {
  /** OEM key, e.g. `"mg"` — matches `ListingCar.oem`. */
  key: string;
  slug: string;
  /** Display name, e.g. `"MG Motor"`. */
  name: string;
  country: string;
  description: string;
}

/**
 * Everything the brand page needs, built on the server so the client receives
 * slim `ListingCar` projections, never catalogue `Vehicle` records.
 *
 * `market` is every car the site lists, not just this brand's: card badges
 * ("Most affordable", "Longest range") are facts about the whole listing, so
 * they must be judged against it — a brand's cheapest car is not necessarily
 * the most affordable EV.
 */
export interface BrandPageData {
  brand: BrandIdentity;
  market: ListingCar[];
}
