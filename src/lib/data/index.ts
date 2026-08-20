import { Vehicle, VehicleCategory } from "@/types/vehicle";
import { isCurrentlySold } from "@/lib/vehicle-availability";
import { cars } from "./cars";
import { twoWheelers } from "./two-wheelers";
import { commercial } from "./commercial";

export { cars } from "./cars";
export { twoWheelers } from "./two-wheelers";
export { commercial } from "./commercial";
export { oems, getOemBySlug } from "./oems";

const BY_CATEGORY: Record<VehicleCategory, Vehicle[]> = {
  car: cars,
  "2-wheeler": twoWheelers,
  commercial,
};

export function getAllVehicles(): Vehicle[] {
  return [...cars, ...twoWheelers, ...commercial];
}

export function getVehiclesByCategory(category: VehicleCategory): Vehicle[] {
  return BY_CATEGORY[category];
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return getAllVehicles().find((vehicle) => vehicle.slug === slug);
}

export function getVehiclesByOem(oemKey: string): Vehicle[] {
  return getAllVehicles().filter((vehicle) => vehicle.oem === oemKey);
}

/**
 * The catalogue minus anything marked `discontinued` — what the site is
 * actually selling.
 *
 * `getAllVehicles()`/`getVehiclesByCategory()` stay unfiltered on purpose:
 * they are what `generateStaticParams`, the sitemap, slug lookup and the
 * illustration/honesty tests need, and a discontinued vehicle's own pages
 * must keep working. Every *discovery* surface calls one of these two
 * instead. `src/lib/vehicle-availability.ts` lists which is which and why.
 */
export function getCurrentVehicles(): Vehicle[] {
  return getAllVehicles().filter(isCurrentlySold);
}

export function getCurrentVehiclesByCategory(category: VehicleCategory): Vehicle[] {
  return getVehiclesByCategory(category).filter(isCurrentlySold);
}

/**
 * Same-OEM matches first (as before), backfilled with the rest of the
 * category sorted by price proximity — so a brand with only 1-2 other
 * models still surfaces a full row of genuinely comparable vehicles instead
 * of an anemic 1-card "similar" section.
 *
 * The candidate pool excludes discontinued vehicles: this drives the VDP's
 * "similar vehicles" rail and the pre-rendered comparison set, both of which
 * are recommendations. Calling it ON a discontinued vehicle still works and
 * still returns current neighbours — its page keeps a useful rail.
 */
export function getRelatedVehicles(vehicle: Vehicle, limit = 8): Vehicle[] {
  const sameCategory = getCurrentVehiclesByCategory(vehicle.category).filter((v) => v.id !== vehicle.id);
  const sameOem = sameCategory.filter((v) => v.oem === vehicle.oem);
  const priceOfOthers = sameCategory
    .filter((v) => v.oem !== vehicle.oem)
    .sort(
      (a, b) =>
        Math.abs(a.priceRangeLakh[0] - vehicle.priceRangeLakh[0]) - Math.abs(b.priceRangeLakh[0] - vehicle.priceRangeLakh[0]),
    );
  return [...sameOem, ...priceOfOthers].slice(0, limit);
}
