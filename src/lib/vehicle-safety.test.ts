import { describe, expect, it } from "vitest";
import { getAllVehicles, getVehicleBySlug } from "@/lib/data";
import { currentNcapRating, formatNcapResult, ncapResultFor } from "./vehicle-safety";
import { computeWinners } from "./compare/winnerEngine";
import { SAFETY_SPEC_ROWS, WINNER_METRICS } from "./compare/metrics";
import { toVehicleDetail } from "./data/ev-motion/toVehicleDetail";
import type { Vehicle, VehicleSafety } from "@/types/vehicle";

/**
 * Euro NCAP and ANCAP results lapse six years after publication, so a 2019
 * five-star result stopped being current on 1 January 2026 (HANDOFF.md
 * sub-batches 11-12). Before `ncapYear` existed the schema could not say that,
 * which cost this dataset both ways: three ratings were omitted ENTIRELY for
 * age (G 580, EX40, Q8 e-tron), and two more (`mg-zs-ev`,
 * `hyundai-kona-electric`) were being rendered as current when they had
 * lapsed.
 *
 * A fixed `referenceYear` is passed everywhere below on purpose — the expiry
 * rule is time-dependent by nature, and a suite that drifts with the wall
 * clock would start failing on 1 January of some future year for no reason.
 */

const REFERENCE_YEAR = 2026;

const safety = (ncapRating?: number, ncapAgency?: string, ncapYear?: number): VehicleSafety => ({
  ncapRating,
  ncapAgency,
  ncapYear,
});

function bySlug(slug: string): Vehicle {
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) throw new Error(`fixture vehicle missing: ${slug}`);
  return vehicle;
}

describe("ncapResultFor", () => {
  it("returns null when no rating was recorded", () => {
    expect(ncapResultFor(undefined, REFERENCE_YEAR)).toBeNull();
    expect(ncapResultFor(safety(undefined, "Euro NCAP", 2024), REFERENCE_YEAR)).toBeNull();
  });

  it("marks a Euro NCAP result expired the year after its sixth", () => {
    // 2019 + 6 = current through 2025, expires 1 January 2026.
    expect(ncapResultFor(safety(5, "Euro NCAP", 2019), 2025)?.expired).toBe(false);
    expect(ncapResultFor(safety(5, "Euro NCAP", 2019), 2026)?.expired).toBe(true);
    expect(ncapResultFor(safety(5, "Euro NCAP", 2019), 2025)?.validThroughYear).toBe(2025);
  });

  it("applies the same six-year window to ANCAP", () => {
    expect(ncapResultFor(safety(5, "ANCAP", 2019), REFERENCE_YEAR)?.expired).toBe(true);
    expect(ncapResultFor(safety(5, "ANCAP", 2022), REFERENCE_YEAR)?.expired).toBe(false);
  });

  it("matches the agency name case-insensitively", () => {
    expect(ncapResultFor(safety(5, "euro ncap", 2019), REFERENCE_YEAR)?.expired).toBe(true);
  });

  it("never expires an agency with no published lapse policy", () => {
    // Bharat NCAP and Global NCAP publish no validity window, so guessing one
    // would be exactly the kind of invented figure CLAUDE.md #22 forbids.
    const bharat = ncapResultFor(safety(5, "Bharat NCAP", 2015), REFERENCE_YEAR);
    expect(bharat?.expired).toBe(false);
    expect(bharat?.validThroughYear).toBeUndefined();
  });

  it("cannot expire a rating whose year was never sourced", () => {
    const result = ncapResultFor(safety(5, "Euro NCAP"), REFERENCE_YEAR);
    expect(result?.expired).toBe(false);
    expect(result?.year).toBeUndefined();
  });
});

describe("formatNcapResult", () => {
  it("says 'rating expired' out loud once it has lapsed", () => {
    const expired = ncapResultFor(safety(5, "Euro NCAP", 2019), REFERENCE_YEAR)!;
    expect(formatNcapResult(expired)).toBe("5 Stars (Euro NCAP, 2019 — rating expired)");
  });

  it("prints the year on a current rating", () => {
    const current = ncapResultFor(safety(5, "Euro NCAP", 2024), REFERENCE_YEAR)!;
    expect(formatNcapResult(current)).toBe("5 Stars (Euro NCAP, 2024)");
  });

  it("keeps the pre-ncapYear wording when no year is known", () => {
    expect(formatNcapResult(ncapResultFor(safety(5, "Bharat NCAP"), REFERENCE_YEAR)!)).toBe("5 Stars (Bharat NCAP)");
  });

  it("singularises a one-star result", () => {
    expect(formatNcapResult(ncapResultFor(safety(1, "Euro NCAP", 2024), REFERENCE_YEAR)!)).toBe("1 Star (Euro NCAP, 2024)");
  });
});

describe("currentNcapRating", () => {
  it("withholds a lapsed rating from anything that scores", () => {
    expect(currentNcapRating(safety(5, "Euro NCAP", 2019), REFERENCE_YEAR)).toBeNull();
    expect(currentNcapRating(safety(5, "Euro NCAP", 2022), REFERENCE_YEAR)).toBe(5);
  });
});

describe("the real catalogue", () => {
  it("records a year for the two ratings known to have lapsed", () => {
    expect(bySlug("mg-zs-ev").specs?.safety?.ncapYear).toBe(2019);
    expect(bySlug("hyundai-kona-electric").specs?.safety?.ncapYear).toBe(2019);
  });

  it("preserves the three ratings that were previously dropped for age", () => {
    // Each was omitted entirely because the schema could not express expiry.
    // The published result is history worth keeping; the presentation, not the
    // data, is what has to be honest about it.
    for (const [slug, year] of [
      ["mercedes-benz-g580", 2019],
      ["volvo-ex40", 2018],
      ["audi-q8-e-tron", 2019],
    ] as const) {
      const safetyBlock = bySlug(slug).specs?.safety;
      expect(safetyBlock?.ncapRating, `${slug} lost its rating`).toBe(5);
      expect(safetyBlock?.ncapYear, `${slug} has no year`).toBe(year);
      expect(ncapResultFor(safetyBlock, REFERENCE_YEAR)?.expired, `${slug} should read as expired`).toBe(true);
    }
  });

  it("leaves genuinely un-attributable ratings absent", () => {
    // These failed on ATTRIBUTION, not age — the e-tron GT's five stars belong
    // to the Porsche Taycan and the iX1 LWB's to a shorter-wheelbase shell.
    // `ncapYear` must not be read as a licence to restore those.
    expect(bySlug("audi-e-tron-gt").specs?.safety?.ncapRating).toBeUndefined();
    expect(bySlug("bmw-ix1-lwb").specs?.safety?.ncapRating).toBeUndefined();
  });

  it("never renders an expired rating without saying so", () => {
    const ncapRow = SAFETY_SPEC_ROWS.find((r) => r.key === "ncap")!;

    for (const vehicle of getAllVehicles()) {
      const result = ncapResultFor(vehicle.specs?.safety);
      if (!result?.expired) continue;
      expect(ncapRow.render(toVehicleDetail(vehicle)), `${vehicle.slug} shows a lapsed rating as current`).toContain(
        "expired",
      );
    }
  });

  it("lets the directly-tested EC40 beat the expired EX40 on safety", () => {
    // The clearest pair in the dataset: near-identical cars, same platform
    // family, opposite outcomes. The EX40 only ever carried an extension of
    // the 2018 petrol XC40's result; the EC40 was crash-tested itself in 2022.
    const details = [bySlug("volvo-ex40"), bySlug("volvo-ec40")].map(toVehicleDetail);
    const { metricResults } = computeWinners(details, WINNER_METRICS);
    const safetyResult = metricResults.find((r) => r.key === "safetyRating")!;

    // Only one live rating between them, so there is nothing for it to beat —
    // the >=2-known-values rule (CLAUDE.md #15) applies, and the expired one
    // must not count as the second value.
    expect(safetyResult.values).toEqual([null, 5]);
    expect(safetyResult.state).toBe("insufficient-data");
  });

  it("keeps the EX40's rating visible on the page even though it cannot score", () => {
    const ncapRow = SAFETY_SPEC_ROWS.find((r) => r.key === "ncap")!;
    expect(ncapRow.render(toVehicleDetail(bySlug("volvo-ex40")))).toBe("5 Stars (Euro NCAP, 2018 — rating expired)");
    expect(ncapRow.render(toVehicleDetail(bySlug("volvo-ec40")))).toBe("5 Stars (Euro NCAP, 2022)");
  });
});
