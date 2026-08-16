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

/**
 * Parses a `-vs-`-delimited compare slug back into real vehicles. Doesn't
 * assume a naive single split is safe forever: no current vehicle slug
 * contains the literal substring `-vs-`, but a future one theoretically
 * could, so every possible partition of the string (using 1 or 2 of the
 * delimiter's occurrences as split points) is tried, and only a partition
 * where every resulting piece resolves to a real, same-category vehicle
 * slug is accepted.
 */
export function parseCompareSlug(slug: string): Vehicle[] | null {
  const positions: number[] = [];
  let idx = slug.indexOf(COMPARE_SLUG_DELIMITER);
  while (idx !== -1) {
    positions.push(idx);
    idx = slug.indexOf(COMPARE_SLUG_DELIMITER, idx + 1);
  }
  if (positions.length === 0) return null;

  // Two vehicles: exactly one occurrence acts as the delimiter.
  for (const p of positions) {
    const resolved = resolveParts([slug.slice(0, p), slug.slice(p + COMPARE_SLUG_DELIMITER.length)]);
    if (resolved) return resolved;
  }

  // Three vehicles: exactly two occurrences (in order) act as delimiters.
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const [p1, p2] = [positions[i], positions[j]];
      const resolved = resolveParts([
        slug.slice(0, p1),
        slug.slice(p1 + COMPARE_SLUG_DELIMITER.length, p2),
        slug.slice(p2 + COMPARE_SLUG_DELIMITER.length),
      ]);
      if (resolved) return resolved;
    }
  }

  return null;
}
