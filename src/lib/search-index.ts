import { getAllVehicles, oems } from "@/lib/data";
import { getOemBySlug } from "@/lib/data/oems";
import type { SearchIndex } from "@/types/search-index";

/**
 * Projects the full catalog down to the minimum the search box needs.
 *
 * **Server-side only.** This module imports `@/lib/data`, so anything that
 * imports it pulls all 122 vehicle records — descriptions, variants, specs
 * and all — into its bundle. Its one legitimate consumer is the
 * `/search-index.json` route handler, which serves the result as a static,
 * browser-cacheable file. Client code should call `loadSearchIndex()` from
 * `@/lib/search-index-client` instead.
 *
 * Previously the browser got the whole database on every page load, because
 * `Navbar` (rendered in the root layout) is a client component that imports
 * `VehicleSearchBox` -> `@/lib/search` -> `getAllVehicles()`.
 */
export function buildSearchIndex(): SearchIndex {
  return {
    vehicles: getAllVehicles().map((vehicle) => ({
      id: vehicle.id,
      slug: vehicle.slug,
      category: vehicle.category,
      oem: vehicle.oem,
      oemName: vehicle.oemName,
      modelName: vehicle.modelName,
      oemColor: getOemBySlug(vehicle.oem)?.color ?? "#1FA83C",
      // Only `photoUrl` is carried — `gallery` and `hero` are unused by search.
      images: vehicle.images.photoUrl ? { photoUrl: vehicle.images.photoUrl } : {},
    })),
    oems: oems.map((oem) => ({ key: oem.key, slug: oem.slug, name: oem.name })),
  };
}
