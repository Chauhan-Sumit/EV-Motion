import { cars } from "@/lib/data/cars";
import { isCurrentlySold } from "@/lib/vehicle-availability";
import { ncapResultFor } from "@/lib/vehicle-safety";
import { featuredVehicle } from "@/lib/featured-vehicle";
import { TYPICAL_DIMS } from "@/lib/compare/showroom/outline";
import type { Vehicle } from "@/types/vehicle";
import { shortBrand } from "./copy";
import type { CarsListingData, ListedStatus, ListingCar } from "./types";

/**
 * Server-side assembly of the Electric Cars listing.
 *
 * **Server-only** — it imports the car catalogue (CLAUDE.md #23). The client
 * receives `ListingCar` projections, never the `Vehicle` records.
 */

function artFor(v: Vehicle): ListingCar["art"] {
  const typical = TYPICAL_DIMS[v.bodyType ?? "suv"];
  const d = v.specs?.dimensions;
  // All three proportions or none — mixing a published length with a typical
  // wheelbase draws a car that is neither.
  if (d?.lengthMm && d.heightMm && d.wheelbaseMm) {
    return { lengthMm: d.lengthMm, heightMm: d.heightMm, wheelbaseMm: d.wheelbaseMm, groundClearanceMm: d.groundClearanceMm ?? typical.groundClearanceMm };
  }
  return typical;
}

export function toListingCar(v: Vehicle): ListingCar {
  const ncap = ncapResultFor(v.specs?.safety);
  return {
    id: v.id,
    slug: v.slug,
    oem: v.oem,
    oemName: v.oemName,
    model: v.modelName,
    name: `${shortBrand(v.oemName)} ${v.modelName}`,
    tagline: v.tagline,
    body: v.bodyType ?? "suv",
    basePriceLakh: v.priceRangeLakh,
    rangeKm: v.rangeKm,
    batteryKwh: v.batteryCapacityKwh,
    dcMin: v.chargingTimeFastMin ?? null,
    accSec: v.accelerationSec0To100 ?? null,
    seats: v.seatingCapacity ?? null,
    status: v.launchStatus as ListedStatus,
    launchDate: v.launchDate ?? null,
    colors: v.colors,
    drive: v.specs?.motor?.driveLayout ?? null,
    ncap: ncap ? { rating: ncap.rating, agency: ncap.agency, year: ncap.year ?? null, expired: ncap.expired } : null,
    variants: v.variants.length,
    art: artFor(v),
  };
}

/** Every car the site currently sells — discontinued records are not listed (`vehicle-availability.ts`). */
export function buildCarsListingData(): CarsListingData {
  return {
    cars: cars.filter(isCurrentlySold).map(toListingCar),
    spotlightSlug: featuredVehicle().slug,
  };
}

/** OEM keys present in the listing — what the URL parser accepts for `brand`. */
export function listedBrandKeys(data: CarsListingData): string[] {
  return [...new Set(data.cars.map((c) => c.oem))];
}
