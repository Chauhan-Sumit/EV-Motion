import type { TwoWheelerType } from "@/types/vehicle";
import type { ListedStatus } from "@/lib/cars-listing/types";

export type { ListedStatus };

/**
 * The slice of a catalogue `Vehicle` the Scooters & Bikes listing renders.
 *
 * Built on the server by `buildTwoWheelersListingData()`, so the client gets
 * plain serializable fields rather than catalogue records. Every value is
 * copied from the record; `null` means the record does not publish it.
 */
export interface ListingBike {
  id: string;
  slug: string;
  /** OEM key, e.g. `"ather"` — what the brand filter and URL use. */
  oem: string;
  /** OEM display name, e.g. `"Ather Energy"`. */
  oemName: string;
  /** Model name without the maker, e.g. `"450X"`. */
  model: string;
  /** Short display name, e.g. `"Ather 450X"`. */
  name: string;
  tagline: string;
  type: TwoWheelerType;
  /** Catalogue ex-showroom range across variants, in lakh, before any city adjustment. */
  basePriceLakh: [number, number];
  rangeKm: number;
  batteryKwh: number;
  topSpeedKmph: number;
  /** Charging time on a home socket, in hours, as published. */
  homeChargeHr: number;
  /** Fast-charging time in minutes, where the OEM publishes one. */
  fastChargeMin: number | null;
  /** Peak motor power in kW, from researched specs only. */
  powerKw: number | null;
  status: ListedStatus;
  launchDate: string | null;
  colors: string[];
  variants: number;
}

/** A listing bike with its ex-showroom range for the selected city — what filters, sorts and cards read. */
export interface PricedBike extends ListingBike {
  price: [number, number];
}

export interface TwoWheelersListingData {
  bikes: ListingBike[];
  /** Slug of the hero spotlight. */
  spotlightSlug: string;
}
