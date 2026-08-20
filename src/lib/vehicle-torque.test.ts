import { describe, expect, it } from "vitest";
import { getAllVehicles, getVehicleBySlug } from "@/lib/data";
import { isTorqueComparable, torqueMeasurementPointFor, type TorqueSubject } from "./vehicle-torque";
import { computeWinners } from "./compare/winnerEngine";
import { WINNER_METRICS } from "./compare/metrics";
import { toVehicleDetail } from "./data/ev-motion/toVehicleDetail";
import type { Vehicle } from "@/types/vehicle";

/**
 * Two-wheeler torque comes in two incompatible conventions (CLAUDE.md
 * #28(b2)). TVS quotes 140 Nm for the iQube, measured at the WHEEL with no
 * reduction; Ather quotes 26 Nm for the 450X, measured at the motor SHAFT
 * before the belt multiplies it. Ranking those against each other hands the
 * hub scooter a fivefold win on a definition.
 *
 * These tests pin both halves of the fix: the resolution rule, and the fact
 * that the real catalogue no longer produces a cross-convention Torque winner.
 */

const subject = (category: TorqueSubject["category"], peakTorqueNm?: number, torqueMeasuredAt?: "shaft" | "wheel"): TorqueSubject => ({
  category,
  specs: peakTorqueNm === undefined && torqueMeasuredAt === undefined ? undefined : { motor: { peakTorqueNm, torqueMeasuredAt } },
});

function bySlug(slug: string): Vehicle {
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) throw new Error(`fixture vehicle missing: ${slug}`);
  return vehicle;
}

/** The Torque metric result for a real comparison, exactly as /compare computes it. */
function torqueResult(...slugs: string[]) {
  const details = slugs.map((slug) => toVehicleDetail(bySlug(slug)));
  const { metricResults } = computeWinners(details, WINNER_METRICS);
  const result = metricResults.find((r) => r.key === "torque");
  if (!result) throw new Error("no torque metric in WINNER_METRICS");
  return result;
}

describe("torqueMeasurementPointFor", () => {
  it("prefers an explicitly recorded measurement point", () => {
    expect(torqueMeasurementPointFor(subject("2-wheeler", 140, "wheel"))).toBe("wheel");
    expect(torqueMeasurementPointFor(subject("2-wheeler", 26, "shaft"))).toBe("shaft");
  });

  it("defaults cars to shaft, because a car's published torque is always its motor's", () => {
    expect(torqueMeasurementPointFor(subject("car", 280))).toBe("shaft");
    expect(torqueMeasurementPointFor(subject("commercial", 90))).toBe("shaft");
  });

  it("leaves an unannotated two-wheeler UNKNOWN rather than assuming shaft", () => {
    // This is the load-bearing asymmetry. Defaulting two-wheelers to "shaft"
    // would silently re-admit the hub-vs-shaft comparison this module exists
    // to refuse — a hub figure would be treated as a shaft figure and win.
    expect(torqueMeasurementPointFor(subject("2-wheeler", 35))).toBeUndefined();
  });

  it("lets an explicit annotation override the car default", () => {
    expect(torqueMeasurementPointFor(subject("car", 280, "wheel"))).toBe("wheel");
  });
});

describe("isTorqueComparable", () => {
  it("allows one shared, known convention", () => {
    expect(isTorqueComparable([subject("2-wheeler", 26, "shaft"), subject("2-wheeler", 58, "shaft")])).toBe(true);
    expect(isTorqueComparable([subject("car", 280), subject("car", 664)])).toBe(true);
  });

  it("refuses a wheel figure against a shaft figure", () => {
    expect(isTorqueComparable([subject("2-wheeler", 140, "wheel"), subject("2-wheeler", 26, "shaft")])).toBe(false);
  });

  it("refuses when any contributing figure's convention is unknown", () => {
    // "We don't know" and "we know it differs" both make a winner meaningless.
    expect(isTorqueComparable([subject("2-wheeler", 35), subject("2-wheeler", 26, "shaft")])).toBe(false);
  });

  it("ignores vehicles that publish no torque at all", () => {
    // An absent value never blocks a comparison — it just doesn't join it,
    // matching how the winner engine treats every other missing figure.
    expect(isTorqueComparable([subject("2-wheeler", 26, "shaft"), subject("2-wheeler"), subject("2-wheeler", 22, "shaft")])).toBe(true);
  });

  it("treats a cross-category comparison of shaft figures as comparable", () => {
    expect(isTorqueComparable([subject("car", 280), subject("2-wheeler", 26, "shaft")])).toBe(true);
  });
});

describe("the real catalogue", () => {
  it("annotates every two-wheeler that publishes a torque figure, or leaves it out of the ranking", () => {
    // Not an assertion that all of them ARE annotated — `ampere-nexus`
    // deliberately is not, because no source states where its 35 Nm was
    // measured. The invariant is that an unannotated one can never be ranked.
    const unannotated = getAllVehicles().filter(
      (v) =>
        v.category === "2-wheeler" &&
        v.specs?.motor?.peakTorqueNm !== undefined &&
        v.specs.motor.torqueMeasuredAt === undefined,
    );

    for (const vehicle of unannotated) {
      expect(
        isTorqueComparable([vehicle, { category: "2-wheeler", specs: { motor: { peakTorqueNm: 26, torqueMeasuredAt: "shaft" } } }]),
        `${vehicle.slug} has an unannotated torque figure that is still being compared`,
      ).toBe(false);
    }
  });

  it("records the iQube's 140 Nm as a WHEEL figure", () => {
    // The specific number that shipped into a live Compare row against
    // Ather's 26 Nm. If this ever reverts to unannotated or to "shaft", the
    // false fivefold win comes straight back.
    expect(bySlug("tvs-iqube").specs?.motor?.torqueMeasuredAt).toBe("wheel");
  });

  it("crowns no Torque winner for TVS iQube vs Ather 450X", () => {
    const result = torqueResult("tvs-iqube", "ather-450x");

    expect(result.values).toEqual([140, 26]); // both real, both still shown
    expect(result.state).toBe("insufficient-data");
    expect(result.winnerIndex).toBeNull();
  });

  it("still crowns a Torque winner among mid-drive scooters", () => {
    // The fix must not be a blanket "never compare two-wheeler torque":
    // Ather's 26 and Ola's 58 are both shaft figures and compare cleanly.
    const result = torqueResult("ather-450x", "ola-s1-pro");

    expect(result.state).toBe("winner");
    expect(result.winnerIndex).toBe(1);
  });

  it("still crowns a Torque winner among cars", () => {
    const result = torqueResult("tata-nexon-ev", "mg-zs-ev");
    expect(result.state).toBe("winner");
  });
});
