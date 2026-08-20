import { getCurrentVehicles, getRelatedVehicles } from "@/lib/data";
import { buildCompareSlug } from "./slug";
import type { Vehicle } from "@/types/vehicle";

/**
 * The set of comparison pages worth pre-rendering and listing in the sitemap.
 *
 * **Server-side only** — imports the catalog.
 *
 * Enumerating every possible comparison is not an option: C(54,2) + C(54,3)
 * for cars alone runs to five figures, which is why this route deliberately
 * had no `generateStaticParams` at all. But "none" was the wrong end of that
 * trade: "<model A> vs <model B>" is the highest-intent organic query in this
 * category, and every one of those pages was rendering on demand and sitting
 * outside the sitemap (which listed just the six hand-curated homepage
 * pairs).
 *
 * The middle ground: pair each vehicle with its nearest neighbours — same
 * category, same OEM first, then closest on price, via the existing
 * `getRelatedVehicles` — and pre-render those. Those are the comparisons real
 * shoppers actually run, and the count stays in the low hundreds. Everything
 * else still works: `dynamicParams` remains at its default `true`, so an
 * arbitrary pair renders on demand exactly as before.
 */

/** Neighbours per vehicle. 3 keeps the pre-rendered set in the low hundreds. */
const NEIGHBOURS_PER_VEHICLE = 3;

export interface ComparisonPair {
  a: Vehicle;
  b: Vehicle;
  slug: string;
}

export function popularComparisonPairs(neighbours = NEIGHBOURS_PER_VEHICLE): ComparisonPair[] {
  const seen = new Set<string>();
  const pairs: ComparisonPair[] = [];

  // Current vehicles only, on both sides: `getRelatedVehicles` already
  // excludes discontinued candidates, and iterating them here would put
  // comparisons of a superseded scooter into the sitemap. Those pages still
  // render on demand — `dynamicParams` stays at its default `true`.
  for (const vehicle of getCurrentVehicles()) {
    for (const related of getRelatedVehicles(vehicle, neighbours)) {
      // Order-independent key: A-vs-B and B-vs-A are the same page, and the
      // route canonicalises to whichever order `buildCompareSlug` produces.
      const key = [vehicle.slug, related.slug].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ a: vehicle, b: related, slug: buildCompareSlug([vehicle, related]) });
    }
  }

  return pairs;
}
