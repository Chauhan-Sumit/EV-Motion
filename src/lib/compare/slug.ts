/**
 * Compare-slug *building* — deliberately free of any `@/lib/data` import so
 * that client components which only need to construct a `/compare/...` URL
 * (the VDP's compare table, vehicle cards) don't drag the whole catalog into
 * their bundle. The reverse direction needs to look vehicles up by slug and
 * therefore lives in `parse-slug.ts`, which is server-side only.
 */

/** Single source of truth for the comparison cap — referenced by the picker, CompareHero, and the parser. */
export const MAX_COMPARE = 3;
export const MIN_COMPARE = 2;

export const COMPARE_SLUG_DELIMITER = "-vs-";

export function dedupeVehicles<T extends { slug: string }>(vehicles: T[]): T[] {
  const seen = new Set<string>();
  return vehicles.filter((v) => {
    if (seen.has(v.slug)) return false;
    seen.add(v.slug);
    return true;
  });
}

export function buildCompareSlug(vehicles: { slug: string }[]): string {
  return dedupeVehicles(vehicles)
    .slice(0, MAX_COMPARE)
    .map((v) => v.slug)
    .join(COMPARE_SLUG_DELIMITER);
}
