import type { ListingCar } from "@/lib/cars-listing/types";
import type { ListingBike } from "@/lib/two-wheelers-listing/types";

/** The brand fields the page renders — copied from the `Oem` record, nothing derived. */
export interface BrandIdentity {
  /** OEM key, e.g. `"mg"` — matches the listing projections' `oem`. */
  key: string;
  slug: string;
  /** Display name, e.g. `"MG Motor"`. */
  name: string;
  description: string;
}

/**
 * Everything a brand page needs, built on the server so the client receives
 * the listings' slim projections, never catalogue `Vehicle` records.
 *
 * `kind` is what the brand sells — every brand in the catalogue sells one
 * category. `market` is every listed vehicle of that kind, not just this
 * brand's: card badges ("Most affordable", "Longest range") are facts about
 * the whole listing, so they must be judged against it.
 */
export type BrandPageData =
  | { kind: "car"; brand: BrandIdentity; market: ListingCar[] }
  | { kind: "2-wheeler"; brand: BrandIdentity; market: ListingBike[] };
