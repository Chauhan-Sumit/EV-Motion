import { getOemBySlug } from "@/lib/data";
import { buildCarsListingData } from "@/lib/cars-listing/page-data";
import type { BrandPageData } from "./types";

/**
 * Server-side assembly of a brand page.
 *
 * **Server-only** — it reaches the car catalogue through
 * `buildCarsListingData()` (CLAUDE.md #23). Discontinued records are already
 * left out there (`vehicle-availability.ts`), so a brand page lists exactly
 * what `/cars` lists for that brand. Returns `null` for an unknown slug.
 */
export function buildBrandPageData(slug: string): BrandPageData | null {
  const oem = getOemBySlug(slug);
  if (!oem) return null;
  return {
    brand: {
      key: oem.key,
      slug: oem.slug,
      name: oem.name,
      country: oem.country,
      description: oem.description,
    },
    market: buildCarsListingData().cars,
  };
}
