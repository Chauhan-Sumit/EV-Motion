import { describe, expect, it } from "vitest";
import { getAllVehicles, getVehicleBySlug } from "@/lib/data";
import { batteryBasisFor, isBatteryComparable, type BatterySubject } from "./vehicle-battery";
import { computeWinners } from "./compare/winnerEngine";
import { WINNER_METRICS } from "./compare/metrics";
import { toVehicleDetail } from "./data/ev-motion/toVehicleDetail";
import type { BatteryMeasurementBasis, Vehicle } from "@/types/vehicle";

/**
 * A published kWh figure is either the whole installed pack ("gross") or what
 * survives the manufacturer's buffer ("usable"), and this catalogue holds
 * both — see BATTERY_CONVENTION_SURVEY.md. BMW is the proof case: `bmw-ix`
 * records 105.2 (usable, from a 111.5 kWh pack) while `bmw-i4` records 83.9
 * (gross, of a pack whose usable figure is 81.3). Ranking them directly
 * docks the iX 6.3 kWh on a definition.
 *
 * These tests pin both halves: the resolution rule, and the fact that the
 * real catalogue produces no cross-convention Battery winner.
 */

const subject = (batteryMeasuredAt?: BatteryMeasurementBasis): BatterySubject => ({ batteryMeasuredAt });

function bySlug(slug: string): Vehicle {
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) throw new Error(`fixture vehicle missing: ${slug}`);
  return vehicle;
}

/** The Battery metric result for a real comparison, exactly as /compare computes it. */
function batteryResult(...slugs: string[]) {
  const details = slugs.map((slug) => toVehicleDetail(bySlug(slug)));
  const { metricResults } = computeWinners(details, WINNER_METRICS);
  const result = metricResults.find((r) => r.key === "battery");
  if (!result) throw new Error("no battery metric in WINNER_METRICS");
  return result;
}

describe("batteryBasisFor", () => {
  it("returns the recorded basis", () => {
    expect(batteryBasisFor(subject("gross"))).toBe("gross");
    expect(batteryBasisFor(subject("usable"))).toBe("usable");
  });

  it("never falls back to a default", () => {
    // The deliberate difference from `torqueMeasurementPointFor`, which
    // defaults a car to "shaft". There is no category here whose convention is
    // unambiguous — BMW and BYD are each split inside their own line-ups — so
    // an unstamped vehicle must stay unknown rather than be assumed gross.
    expect(batteryBasisFor(subject())).toBeUndefined();
  });
});

describe("isBatteryComparable", () => {
  it("allows a set that states one basis", () => {
    expect(isBatteryComparable([subject("gross"), subject("gross")])).toBe(true);
    expect(isBatteryComparable([subject("usable"), subject("usable")])).toBe(true);
  });

  it("refuses a set that mixes gross and usable", () => {
    expect(isBatteryComparable([subject("gross"), subject("usable")])).toBe(false);
  });

  it("refuses a set containing an unstamped vehicle", () => {
    // Unlike torque, every vehicle carries a battery figure, so nothing sits
    // the comparison out — one unknown gates the whole set.
    expect(isBatteryComparable([subject(), subject("gross")])).toBe(false);
    expect(isBatteryComparable([subject(), subject()])).toBe(false);
  });

  it("allows a single-vehicle set", () => {
    expect(isBatteryComparable([subject("gross")])).toBe(true);
  });
});

describe("the real catalogue", () => {
  it("refuses the BMW iX vs i4 battery winner — same brand, opposite conventions", () => {
    // The case the whole survey came out of. 105.2 usable vs 83.9 gross: the
    // i4 must not be crowned, and neither must the iX.
    const result = batteryResult("bmw-ix", "bmw-i4");
    expect(result.state).toBe("insufficient-data");
    expect(result.winnerIndex).toBeNull();
    // The values are still real and still displayed — only the ranking is withheld.
    expect(result.values).toEqual([105.2, 83.9]);
  });

  it("still ranks battery when both cars state the same basis", () => {
    // The gate must not be a blanket switch-off: two gross figures compare
    // fine, and the larger pack wins.
    const result = batteryResult("bmw-i4", "audi-q8-e-tron");
    expect(result.state).toBe("winner");
    expect(result.winnerIndex).toBe(1);
  });

  it("never ranks battery for two-wheelers, because none can be stamped", () => {
    // No Indian two-wheeler OEM publishes a usable figure, and Ather's own
    // buffer is 12.4% — far larger than any car's — so an assumed basis here
    // would be the most damaging place to guess.
    const result = batteryResult("ather-450x", "ola-s1-pro");
    expect(result.state).toBe("insufficient-data");
    expect(result.winnerIndex).toBeNull();
  });

  it("leaves every two-wheeler unstamped", () => {
    const stamped = getAllVehicles().filter((v) => v.category === "2-wheeler" && v.batteryMeasuredAt !== undefined);
    expect(stamped.map((v) => v.slug)).toEqual([]);
  });

  it("keeps an unstamped vehicle out of any battery ranking", () => {
    const unstamped = getAllVehicles().filter((v) => v.batteryMeasuredAt === undefined);

    for (const vehicle of unstamped) {
      expect(
        isBatteryComparable([vehicle, { batteryMeasuredAt: "gross" }]),
        `${vehicle.slug} is unstamped but is still being compared on battery`,
      ).toBe(false);
    }
  });

  it("records every BYD as usable — the brand publishes no gross figure", () => {
    // Resolved 2026-08-22. BYD's own spec sheet labels the row only "Battery
    // capacity (kWh)", so the pair had to come from elsewhere: the Atto 3's
    // documented 60.48-usable-of-64.8-total, EV Database labelling the Seal's
    // 82.5 "useable" while only ESTIMATING the total at 84, and the Seal sheet
    // reconciling at ~87% of (WLTP range x published consumption) across all
    // three variants. One BYD flipping to "gross" would silently reopen the
    // cross-convention comparison this field exists to refuse.
    for (const slug of ["byd-atto-3", "byd-seal", "byd-sealion-7", "byd-emax-7", "byd-e6"]) {
      expect(bySlug(slug).batteryMeasuredAt, slug).toBe("usable");
    }
  });

  it("records the BMW split that this field exists to express", () => {
    // If either side of this ever flips, the 6.3 kWh phantom deficit returns.
    expect(bySlug("bmw-ix").batteryMeasuredAt).toBe("usable");
    expect(bySlug("bmw-i7").batteryMeasuredAt).toBe("usable");
    expect(bySlug("bmw-i4").batteryMeasuredAt).toBe("gross");
    expect(bySlug("bmw-i5").batteryMeasuredAt).toBe("gross");
    expect(bySlug("bmw-ix1-lwb").batteryMeasuredAt).toBe("gross");
  });

  it("records Mercedes as usable, because Mercedes publishes no gross figure", () => {
    // Standardising the catalogue on gross would require inventing these.
    for (const slug of ["mercedes-benz-eqs", "mercedes-benz-eqe", "mercedes-benz-g580"]) {
      expect(bySlug(slug).batteryMeasuredAt, slug).toBe("usable");
    }
    // The exception within the brand: the India car's 122 is the gross figure,
    // paired with a 118 kWh usable pack. Verified 2026-08-21, not stale.
    expect(bySlug("mercedes-benz-maybach-eqs-suv").batteryMeasuredAt).toBe("gross");
    expect(bySlug("mercedes-benz-maybach-eqs-suv").batteryCapacityKwh).toBe(122);
  });

  it("stamps every car — 43 gross, 11 usable, none unresolved", () => {
    // A drift guard, not a target. Every car now states a basis; if a new car
    // arrives without one this fails loudly, which is the point.
    const cars = getAllVehicles().filter((v) => v.category === "car");
    expect(cars.filter((v) => v.batteryMeasuredAt === "gross")).toHaveLength(43);
    expect(cars.filter((v) => v.batteryMeasuredAt === "usable")).toHaveLength(11);
    expect(cars.filter((v) => v.batteryMeasuredAt === undefined)).toHaveLength(0);
  });

  it("writes the same Blade pack the same way on the Seal and the Sealion 7", () => {
    // These were 82.5 and 82.56 — one pack, two roundings, in one catalogue.
    // 82.56 is BYD's own published figure.
    expect(bySlug("byd-seal").batteryCapacityKwh).toBe(82.56);
    expect(bySlug("byd-sealion-7").batteryCapacityKwh).toBe(82.56);
  });

  it("gives the Seal's entry variant its own, smaller pack", () => {
    // All three variants used to carry 82.5 kWh, and the Dynamic also carried
    // the Premium's 650 km — a 21 kWh and 140 km overstatement on the cheapest
    // variant, which is the one a budget filter surfaces first.
    const seal = bySlug("byd-seal");
    const dynamic = seal.variants.find((v) => v.id === "dynamic-rwd");
    expect(dynamic?.batteryKwh).toBe(61.44);
    expect(dynamic?.rangeKm).toBe(510);
    // And the Premium is the RWD long-range car, not a second AWD sitting at
    // the Performance's price.
    const premium = seal.variants.find((v) => v.id === "premium-rwd");
    expect(premium?.batteryKwh).toBe(82.56);
    expect(premium?.rangeKm).toBe(650);
  });

  it("leaves every other battery figure alone", () => {
    // The standing rule: this field records what a number IS. The Seal above
    // is the one deliberate exception, and it is a correction, not a restatement.
    expect(bySlug("bmw-ix").batteryCapacityKwh).toBe(105.2);
    expect(bySlug("byd-atto-3").batteryCapacityKwh).toBe(60.5);
    expect(bySlug("ather-450x").batteryCapacityKwh).toBe(3.7);
  });
});
