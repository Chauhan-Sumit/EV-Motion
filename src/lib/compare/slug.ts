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

/**
 * Cap on vehicles in one showroom comparison (`components/compare/showroom/`).
 * Four is the owner-confirmed limit (2026-10-18). It stays separate from
 * `MAX_COMPARE` only while the current Compare page is live: the homepage
 * promises "Up to 3 Vehicles" off that constant, and the old page's layout is
 * built for three. When the showroom page replaces `/compare`, set
 * `MAX_COMPARE` to 4 and fold this constant into it.
 */
export const SHOWROOM_MAX_COMPARE = 4;

/** `max` defaults to the site-wide cap; only the showroom page passes its own. */
export function buildCompareSlug(vehicles: { slug: string }[], max: number = MAX_COMPARE): string {
  return dedupeVehicles(vehicles)
    .slice(0, max)
    .map((v) => v.slug)
    .join(COMPARE_SLUG_DELIMITER);
}
