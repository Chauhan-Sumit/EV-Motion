import { getVehicleBySlug } from "@/lib/data";
import type { Vehicle } from "@/types/vehicle";

/** Single source of truth for the comparison cap — referenced by the picker, CompareHero, and the parser below. */
export const MAX_COMPARE = 3;
export const MIN_COMPARE = 2;

const DELIMITER = "-vs-";

function dedupe(vehicles: Vehicle[]): Vehicle[] {
  const seen = new Set<string>();
  return vehicles.filter((v) => {
    if (seen.has(v.slug)) return false;
    seen.add(v.slug);
    return true;
  });
}

export function buildCompareSlug(vehicles: Vehicle[]): string {
  return dedupe(vehicles)
    .slice(0, MAX_COMPARE)
    .map((v) => v.slug)
    .join(DELIMITER);
}

function resolveParts(parts: string[]): Vehicle[] | null {
  const resolved = parts.map((slug) => getVehicleBySlug(slug));
  if (resolved.some((v) => !v)) return null;
  const vehicles = resolved as Vehicle[];
  const category = vehicles[0].category;
  if (!vehicles.every((v) => v.category === category)) return null;
  const deduped = dedupe(vehicles);
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
  let idx = slug.indexOf(DELIMITER);
  while (idx !== -1) {
    positions.push(idx);
    idx = slug.indexOf(DELIMITER, idx + 1);
  }
  if (positions.length === 0) return null;

  // Two vehicles: exactly one occurrence acts as the delimiter.
  for (const p of positions) {
    const resolved = resolveParts([slug.slice(0, p), slug.slice(p + DELIMITER.length)]);
    if (resolved) return resolved;
  }

  // Three vehicles: exactly two occurrences (in order) act as delimiters.
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const [p1, p2] = [positions[i], positions[j]];
      const resolved = resolveParts([
        slug.slice(0, p1),
        slug.slice(p1 + DELIMITER.length, p2),
        slug.slice(p2 + DELIMITER.length),
      ]);
      if (resolved) return resolved;
    }
  }

  return null;
}
