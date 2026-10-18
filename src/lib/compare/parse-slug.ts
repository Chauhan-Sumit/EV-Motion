import { getVehicleBySlug } from "@/lib/data";
import { COMPARE_SLUG_DELIMITER, dedupeVehicles, MAX_COMPARE, MIN_COMPARE } from "./slug";
import type { Vehicle } from "@/types/vehicle";

/**
 * Compare-slug *parsing*. **Server-side only** — resolving a slug back into
 * vehicles requires the catalog, so importing this from a client component
 * puts all 122 records in that bundle. Client code that only needs to build
 * a compare URL should import from `./slug`, which has no data dependency.
 */
function resolveParts(parts: string[]): Vehicle[] | null {
  const resolved = parts.map((slug) => getVehicleBySlug(slug));
  if (resolved.some((v) => !v)) return null;
  const vehicles = resolved as Vehicle[];
  const category = vehicles[0].category;
  if (!vehicles.every((v) => v.category === category)) return null;
  const deduped = dedupeVehicles(vehicles);
  if (deduped.length < MIN_COMPARE) return null;
  return deduped.slice(0, MAX_COMPARE);
}

/** Every increasing choice of `k` split points from `positions`, in order. */
function splitChoices(positions: number[], k: number, start = 0): number[][] {
  if (k === 0) return [[]];
  const out: number[][] = [];
  for (let i = start; i <= positions.length - k; i++) {
    for (const rest of splitChoices(positions, k - 1, i + 1)) out.push([positions[i], ...rest]);
  }
  return out;
}

/**
 * Parses a `-vs-`-delimited compare slug back into real vehicles. Doesn't
 * assume a naive single split is safe forever: no current vehicle slug
 * contains the literal substring `-vs-`, but a future one theoretically
 * could, so every possible partition of the string (using 1 to `MAX_COMPARE - 1` of
 * the delimiter's occurrences as split points, fewest first) is tried, and
 * only a partition where every resulting piece resolves to a real,
 * same-category vehicle slug is accepted.
 */
export function parseCompareSlug(slug: string): Vehicle[] | null {
  const positions: number[] = [];
  let idx = slug.indexOf(COMPARE_SLUG_DELIMITER);
  while (idx !== -1) {
    positions.push(idx);
    idx = slug.indexOf(COMPARE_SLUG_DELIMITER, idx + 1);
  }
  if (positions.length === 0) return null;

  for (let splits = 1; splits < MAX_COMPARE && splits <= positions.length; splits++) {
    for (const cuts of splitChoices(positions, splits)) {
      const parts: string[] = [];
      let from = 0;
      for (const cut of cuts) {
        parts.push(slug.slice(from, cut));
        from = cut + COMPARE_SLUG_DELIMITER.length;
      }
      parts.push(slug.slice(from));
      const resolved = resolveParts(parts);
      if (resolved) return resolved;
    }
  }

  return null;
}
