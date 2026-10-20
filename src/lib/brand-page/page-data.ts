import { getOemBySlug } from "@/lib/data";
import { buildCarsListingData } from "@/lib/cars-listing/page-data";
import { buildTwoWheelersListingData } from "@/lib/two-wheelers-listing/page-data";
import type { BrandPageData } from "./types";

/**
 * Server-side assembly of a brand page.
 *
 * **Server-only** — it reaches the catalogue through the listings' own
 * builders (CLAUDE.md #23). Discontinued records are already left out there
 * (`vehicle-availability.ts`), so a brand page lists exactly what `/cars` or
 * `/two-wheelers` lists for that brand.
 *
 * Returns `null` for an unknown slug, and for a brand whose category has no
 * brand-page template (commercial EVs — the catalogue has none yet).
 */
export function buildBrandPageData(slug: string): BrandPageData | null {
  const oem = getOemBySlug(slug);
  if (!oem) return null;
  const brand = { key: oem.key, slug: oem.slug, name: oem.name, description: oem.description };
  if (oem.categories.includes("car")) return { kind: "car", brand, market: buildCarsListingData().cars };
  if (oem.categories.includes("2-wheeler")) return { kind: "2-wheeler", brand, market: buildTwoWheelersListingData().bikes };
  return null;
}
