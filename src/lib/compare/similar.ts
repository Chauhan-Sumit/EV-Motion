import { getRelatedVehicles } from "@/lib/data";
import type { Vehicle } from "@/types/vehicle";

export interface SimilarComparisonPair {
  a: Vehicle;
  b: Vehicle;
}

/** Pairs each currently-compared vehicle with its related vehicles (same-category, same-OEM-first then closest price), excluding vehicles already in the current comparison and de-duplicated pairs. */
export function buildSimilarComparisons(vehicles: Vehicle[], limit = 8): SimilarComparisonPair[] {
  const currentSlugs = new Set(vehicles.map((v) => v.slug));
  const seen = new Set<string>();
  const pairs: SimilarComparisonPair[] = [];

  for (const v of vehicles) {
    const related = getRelatedVehicles(v).filter((r) => !currentSlugs.has(r.slug));
    for (const r of related) {
      const key = [v.slug, r.slug].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ a: v, b: r });
      if (pairs.length >= limit) return pairs;
    }
  }

  return pairs;
}
