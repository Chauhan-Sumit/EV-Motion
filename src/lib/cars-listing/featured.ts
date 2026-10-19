/**
 * ⚠️ SAMPLE / EDITORIAL DATA — the "Featured" sort order.
 *
 * Taken verbatim from the approved Electric Cars design, which marks it as
 * "editorial — swap for real popularity (views / leads) when available". The
 * site has no popularity signal yet, so this is a hand-picked order, not a
 * ranking: it is only ever used to *order* the default view and to name a
 * few models in the SEO paragraph. Nothing on the page labels a car as
 * popular, best-selling or trending because of this list.
 *
 * Slugs not in the list sort after it, cheapest first. A slug that no longer
 * exists in the catalogue is simply skipped (`cars-listing.test.ts` reports
 * any that go stale).
 */
export const FEATURED_ORDER: readonly string[] = [
  "mg-windsor-ev",
  "tata-nexon-ev",
  "tata-punch-ev",
  "mahindra-be-6",
  "hyundai-creta-electric",
  "mahindra-xev-9e",
  "tata-curvv-ev",
  "mg-zs-ev",
  "tata-tiago-ev",
  "mg-comet-ev",
  "tata-harrier-ev",
  "kia-carens-clavis-ev",
  "mahindra-xuv400",
  "tata-sierra-ev",
  "mahindra-xev-9s",
  "byd-atto-3",
  "kia-syros-ev",
  "byd-emax-7",
  "mahindra-xuv-3xo-ev",
  "vinfast-vf7",
  "vinfast-vf6",
  "byd-sealion-7",
  "byd-seal",
  "bmw-ix1-lwb",
  "volvo-ex30",
];

const RANK = new Map(FEATURED_ORDER.map((slug, i) => [slug, i]));

/** Position in the editorial order; unlisted slugs share one rank after it. */
export function featuredRank(slug: string): number {
  return RANK.get(slug) ?? FEATURED_ORDER.length;
}
