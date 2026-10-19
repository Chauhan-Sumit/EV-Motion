import type { CarBodyType, LaunchStatus } from "@/types/vehicle";
import type { CarDims } from "@/lib/compare/showroom/outline";

/** A listed vehicle is one the site currently sells — never `discontinued` (see `vehicle-availability.ts`). */
export type ListedStatus = Exclude<LaunchStatus, "discontinued">;

/**
 * The slice of a catalogue `Vehicle` the Electric Cars listing renders.
 *
 * Built on the server by `buildCarsListingData()` so the client receives
 * plain, serializable fields instead of full catalogue records (variant
 * tables, descriptions, specs it never reads). Every value is copied from the
 * record or derived by an existing policy module — nothing here is estimated.
 * `null` means the record does not publish that figure.
 */
export interface ListingCar {
  id: string;
  slug: string;
  /** OEM key, e.g. `"tata"` — what the brand filter and URL use. */
  oem: string;
  /** OEM display name, e.g. `"Tata Motors"`. */
  oemName: string;
  /** Model name without the maker, e.g. `"Nexon EV"`. */
  model: string;
  /** Short display name, e.g. `"Tata Nexon EV"` (maker without "Motors"/"Motor"). */
  name: string;
  tagline: string;
  body: CarBodyType;
  /** Catalogue ex-showroom range across variants, in lakh, before any city adjustment. */
  basePriceLakh: [number, number];
  rangeKm: number;
  batteryKwh: number;
  /** DC fast-charge time in minutes, as published (usually 10–80%). */
  dcMin: number | null;
  accSec: number | null;
  seats: number | null;
  status: ListedStatus;
  launchDate: string | null;
  colors: string[];
  drive: "FWD" | "RWD" | "AWD" | null;
  /** Resolved through `ncapResultFor()`, so an expired Euro NCAP/ANCAP result is marked as such. */
  ncap: { rating: number; agency: string; year: number | null; expired: boolean } | null;
  variants: number;
  /** Published proportions for the side-view drawing; typical ones for the body type when unpublished. */
  art: CarDims;
}

/** A listing car with its ex-showroom range for the selected city — what filters, sorts and cards read. */
export interface PricedCar extends ListingCar {
  price: [number, number];
}

export interface CarsListingData {
  cars: ListingCar[];
  /** Slug of the hero spotlight — the site's existing featured pick. */
  spotlightSlug: string;
}
