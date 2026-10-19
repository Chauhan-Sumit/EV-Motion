/**
 * ⚠️ SAMPLE / EDITORIAL DATA — the "Featured" sort order and hero spotlight.
 *
 * A hand-picked order, not a ranking: the site has no popularity signal (views,
 * leads, sales) yet. It only orders the default view, picks the hero spotlight
 * (the first entry) and names a few models in the SEO paragraph. Nothing on
 * the page labels a model as popular, best-selling or trending because of it.
 * Replace it with real popularity data when that exists.
 *
 * Slugs not in the list sort after it, cheapest first. A slug that leaves the
 * catalogue is skipped (`two-wheelers-listing.test.ts` reports stale ones).
 */
export const FEATURED_ORDER: readonly string[] = [
  "tvs-iqube",
  "ola-s1-pro",
  "ather-rizta",
  "bajaj-chetak-c3501",
  "ather-450x",
  "vida-vx2",
  "ola-s1-x",
  "tvs-iqube-st",
  "ola-roadster-x",
  "ultraviolette-f77",
  "revolt-rv400",
  "river-indie",
  "simple-one-gen2",
  "ather-450-apex",
  "tvs-x",
  "oben-rorr-evo",
  "ampere-nexus",
  "kinetic-green-e-luna",
  "matter-aera",
  "royal-enfield-flying-flea-c6",
];

const RANK = new Map(FEATURED_ORDER.map((slug, i) => [slug, i]));

/** Position in the editorial order; unlisted slugs share one rank after it. */
export function featuredRank(slug: string): number {
  return RANK.get(slug) ?? FEATURED_ORDER.length;
}
