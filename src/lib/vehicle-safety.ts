import type { VehicleSafety } from "@/types/vehicle";

/**
 * The one place that decides whether a crash-test rating is still current.
 *
 * Background (CLAUDE.md #28(a), HANDOFF.md sub-batches 11-12): Euro NCAP and
 * ANCAP results lapse six years after publication, so a 2019 five-star result
 * stopped being a rating on 1 January 2026. Three records were left with NO
 * rating at all because the schema could not say "expired" (Mercedes G 580,
 * Volvo EX40, Audi Q8 e-tron), and two more (`mg-zs-ev`, `hyundai-kona-electric`)
 * still carried ratings that have since lapsed and were being rendered as
 * current.
 *
 * With `VehicleSafety.ncapYear` recorded, the published result is preserved as
 * the historical fact it is, and presentation decides how to show it. A lapsed
 * result renders with its year and an explicit "expired" marker, and is
 * excluded from every place a rating is treated as a live claim: the Compare
 * winner engine, the computed safety score, and the homepage featured banner's
 * star row.
 *
 * Data-free by construction (types only), so it is safe to import from a
 * `"use client"` component — CLAUDE.md #23.
 */

/**
 * How long each agency's results stay current, in years.
 *
 * Euro NCAP and ANCAP both publish a six-year validity window. Bharat NCAP
 * and Global NCAP publish no lapse policy, so their results are treated as
 * not expiring rather than having a window guessed for them — the same
 * sourced-or-absent rule the rest of this dataset follows (CLAUDE.md #22).
 * Agency names are matched case-insensitively against `ncapAgency`.
 */
const VALIDITY_YEARS: Record<string, number> = {
  "euro ncap": 6,
  ancap: 6,
};

export interface NcapResult {
  rating: number;
  agency: string;
  /** Absent when the year was never sourced — see `VehicleSafety.ncapYear`. */
  year?: number;
  /** True only when the year IS known, the agency HAS a validity window, and that window has passed. */
  expired: boolean;
  /** Last calendar year the result is current. Only set when it can expire at all. */
  validThroughYear?: number;
}

function validityYearsFor(agency: string): number | undefined {
  return VALIDITY_YEARS[agency.trim().toLowerCase()];
}

/**
 * Resolves a vehicle's safety block into a presentable result, or `null` when
 * no rating was recorded.
 *
 * `referenceYear` defaults to the current calendar year. It is a parameter so
 * the expiry rule is testable without mocking the clock — and note that on a
 * statically rendered page "now" is build time, so a result that lapses
 * between deploys is only re-evaluated on the next build.
 */
export function ncapResultFor(
  safety: VehicleSafety | undefined,
  referenceYear: number = new Date().getFullYear(),
): NcapResult | null {
  if (!safety?.ncapRating) return null;

  const agency = safety.ncapAgency ?? "NCAP";
  const year = safety.ncapYear;
  const validity = validityYearsFor(agency);

  if (year === undefined || validity === undefined) {
    return { rating: safety.ncapRating, agency, year, expired: false };
  }

  // Euro NCAP/ANCAP results run to the end of the sixth calendar year after
  // publication: a 2019 result is current through 2025 and expires on
  // 1 January 2026. `validThroughYear` is that last-good year.
  const validThroughYear = year + validity;

  return {
    rating: safety.ncapRating,
    agency,
    year,
    expired: referenceYear > validThroughYear,
    validThroughYear,
  };
}

/**
 * The rating as a live claim — `null` once it has lapsed.
 *
 * This is what scoring should read. An expired result is real history but it
 * is not evidence about the car on sale today, so letting it win "Better
 * Safety Rating" against a currently-rated rival would be the marketplace
 * asserting something it cannot stand behind.
 */
export function currentNcapRating(
  safety: VehicleSafety | undefined,
  referenceYear?: number,
): number | null {
  const result = ncapResultFor(safety, referenceYear);
  if (!result || result.expired) return null;
  return result.rating;
}

/**
 * Display string for a rating — "5 Stars (Euro NCAP, 2024)", or
 * "5 Stars (Euro NCAP, 2019 — rating expired)" once it has lapsed. A result
 * with no sourced year keeps the pre-`ncapYear` wording, "5 Stars (Euro NCAP)".
 */
export function formatNcapResult(result: NcapResult): string {
  const stars = `${result.rating} Star${result.rating > 1 ? "s" : ""}`;
  if (result.year === undefined) return `${stars} (${result.agency})`;
  if (result.expired) return `${stars} (${result.agency}, ${result.year} — rating expired)`;
  return `${stars} (${result.agency}, ${result.year})`;
}
