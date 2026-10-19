import { twoWheelers } from "@/lib/data/two-wheelers";
import { isCurrentlySold } from "@/lib/vehicle-availability";
import type { Vehicle } from "@/types/vehicle";
import { shortBikeBrand } from "./copy";
import { FEATURED_ORDER } from "./featured";
import type { ListedStatus, ListingBike, TwoWheelersListingData } from "./types";

/**
 * Server-side assembly of the Scooters & Bikes listing.
 *
 * **Server-only** — it imports the two-wheeler catalogue (CLAUDE.md #23). The
 * client receives `ListingBike` projections, never the `Vehicle` records.
 */

/** "Ather Rizta"; a model already named after its brand ("Vida VX2") is not prefixed twice. */
function displayName(v: Vehicle): string {
  const brand = shortBikeBrand(v.oemName);
  return v.modelName.toLowerCase().startsWith(`${brand.toLowerCase()} `) ? v.modelName : `${brand} ${v.modelName}`;
}

export function toListingBike(v: Vehicle): ListingBike {
  return {
    id: v.id,
    slug: v.slug,
    oem: v.oem,
    oemName: v.oemName,
    model: v.modelName,
    name: displayName(v),
    tagline: v.tagline,
    type: v.twoWheelerType ?? "scooter",
    basePriceLakh: v.priceRangeLakh,
    rangeKm: v.rangeKm,
    batteryKwh: v.batteryCapacityKwh,
    topSpeedKmph: v.topSpeedKmph,
    homeChargeHr: v.chargingTimeSlowHr,
    fastChargeMin: v.chargingTimeFastMin ?? null,
    powerKw: v.specs?.motor?.peakPowerKw ?? null,
    status: v.launchStatus as ListedStatus,
    launchDate: v.launchDate ?? null,
    colors: v.colors,
    variants: v.variants.length,
  };
}

/** Every two-wheeler the site currently sells — discontinued records are not listed (`vehicle-availability.ts`). */
export function buildTwoWheelersListingData(): TwoWheelersListingData {
  const bikes = twoWheelers.filter(isCurrentlySold).map(toListingBike);
  const spotlight = FEATURED_ORDER.find((slug) => bikes.some((b) => b.slug === slug && b.status !== "upcoming")) ?? bikes[0]?.slug ?? "";
  return { bikes, spotlightSlug: spotlight };
}

/** OEM keys present in the listing — what the URL parser accepts for `brand`. */
export function listedBikeBrandKeys(data: TwoWheelersListingData): string[] {
  return [...new Set(data.bikes.map((b) => b.oem))];
}
