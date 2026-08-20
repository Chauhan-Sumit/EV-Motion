import { describe, expect, it } from "vitest";
import { boolToMetricValue, computeWinners, type WinnerMetric } from "./winnerEngine";

/**
 * The winner engine decides every crown, the Winner Ribbon and the overall
 * verdict on the Compare page. Its central rule is a *data-honesty* rule, not
 * an optimisation: with only 15 of 122 vehicles carrying researched `specs`,
 * most metrics are known for a minority of the vehicles being compared, and
 * declaring a winner on that basis is a fabricated claim.
 */

interface Item {
  name: string;
  power: number | null;
  charge: number | null;
  v2l?: boolean;
}

const higher: WinnerMetric<Item> = {
  key: "power",
  label: "Power",
  section: "performance",
  direction: "higher-better",
  value: (i) => i.power,
};

const lower: WinnerMetric<Item> = {
  key: "charge",
  label: "Charging",
  section: "charging",
  direction: "lower-better",
  value: (i) => i.charge,
};

const item = (name: string, power: number | null, charge: number | null = null, v2l?: boolean): Item => ({
  name,
  power,
  charge,
  v2l,
});

describe("computeWinners", () => {
  it("picks the highest value for a higher-better metric", () => {
    const { metricResults, categoriesWon } = computeWinners([item("a", 100), item("b", 150), item("c", 120)], [higher]);

    expect(metricResults[0].state).toBe("winner");
    expect(metricResults[0].winnerIndex).toBe(1);
    expect(categoriesWon).toEqual([0, 1, 0]);
  });

  it("picks the lowest value for a lower-better metric", () => {
    const { metricResults } = computeWinners([item("a", null, 56), item("b", null, 30)], [lower]);

    expect(metricResults[0].state).toBe("winner");
    expect(metricResults[0].winnerIndex).toBe(1);
  });

  it("refuses to crown a winner when only one vehicle has the spec", () => {
    // CLAUDE.md point 15 — this was a real bug found live: with 3 vehicles
    // compared and the metric known for exactly one, that one was rendering a
    // "winner" crown despite having beaten nothing. Do not relax to >= 1.
    const { metricResults, categoriesWon } = computeWinners(
      [item("a", 150), item("b", null), item("c", null)],
      [higher],
    );

    expect(metricResults[0].state).toBe("insufficient-data");
    expect(metricResults[0].winnerIndex).toBeNull();
    expect(categoriesWon).toEqual([0, 0, 0]);
  });

  it("reports insufficient-data when nobody has the spec", () => {
    const { metricResults } = computeWinners([item("a", null), item("b", null)], [higher]);

    expect(metricResults[0].state).toBe("insufficient-data");
  });

  it("scores among the known values only, ignoring unknowns rather than treating them as zero", () => {
    // A null must not be read as 0 — under higher-better that would be a
    // silent loss, and under lower-better a silent win.
    const { metricResults } = computeWinners([item("a", 100), item("b", null), item("c", 90)], [higher]);

    expect(metricResults[0].state).toBe("winner");
    expect(metricResults[0].winnerIndex).toBe(0);

    const lowerResult = computeWinners([item("a", null, 45), item("b", null, null), item("c", null, 60)], [lower]);
    expect(lowerResult.metricResults[0].winnerIndex).toBe(0);
  });

  it("declares a tie rather than picking the first of equal bests", () => {
    const { metricResults, categoriesWon } = computeWinners([item("a", 150), item("b", 150)], [higher]);

    expect(metricResults[0].state).toBe("tie");
    expect(metricResults[0].winnerIndex).toBeNull();
    expect(categoriesWon).toEqual([0, 0]);
  });

  it("still resolves a winner when a tie is beaten by a third vehicle", () => {
    const { metricResults } = computeWinners([item("a", 150), item("b", 150), item("c", 200)], [higher]);

    expect(metricResults[0].state).toBe("winner");
    expect(metricResults[0].winnerIndex).toBe(2);
  });

  it("tallies wins across several metrics per vehicle", () => {
    const { categoriesWon } = computeWinners([item("a", 200, 60), item("b", 100, 30)], [higher, lower]);

    expect(categoriesWon).toEqual([1, 1]);
  });

  it("exposes the raw values alongside each result", () => {
    const { metricResults } = computeWinners([item("a", 100), item("b", null)], [higher]);

    expect(metricResults[0].values).toEqual([100, null]);
  });

  it("handles a single-vehicle comparison without crowning it", () => {
    const { metricResults, categoriesWon } = computeWinners([item("a", 150)], [higher]);

    expect(metricResults[0].state).toBe("insufficient-data");
    expect(categoriesWon).toEqual([0]);
  });
});

describe("boolToMetricValue", () => {
  it("maps booleans to 1/0 and undefined to null", () => {
    // `false` must stay 0 rather than collapsing to null — "this vehicle does
    // not have V2L" is real information, unlike "nobody published whether it does".
    expect(boolToMetricValue(true)).toBe(1);
    expect(boolToMetricValue(false)).toBe(0);
    expect(boolToMetricValue(undefined)).toBeNull();
  });

  it("lets a documented 'no' lose to a 'yes' under boolean-better", () => {
    const v2l: WinnerMetric<Item> = {
      key: "v2l",
      label: "V2L",
      section: "charging",
      direction: "boolean-better",
      value: (i) => boolToMetricValue(i.v2l),
    };

    const { metricResults } = computeWinners([item("a", null, null, false), item("b", null, null, true)], [v2l]);
    expect(metricResults[0].winnerIndex).toBe(1);

    // But two undefineds are not a comparison at all.
    const unknown = computeWinners([item("a", null), item("b", null)], [v2l]);
    expect(unknown.metricResults[0].state).toBe("insufficient-data");
  });
});

describe("comparable — the set-level gate", () => {
  /**
   * `value()` sees one item at a time and so cannot tell that two real,
   * correctly-sourced numbers describe different quantities. The live case is
   * two-wheeler torque: a hub motor's 140 Nm is measured at the wheel and a
   * mid-drive's 26 Nm at the motor shaft, so ranking them crowns the hub
   * scooter by five times on a definition. See src/lib/vehicle-torque.ts.
   */
  const gated = (comparable: (items: Item[]) => boolean): WinnerMetric<Item> => ({
    ...higher,
    comparable,
  });

  it("withholds the winner when the values are not measured the same way", () => {
    const { metricResults, categoriesWon } = computeWinners(
      [item("hub", 140), item("mid-drive", 26)],
      [gated(() => false)],
    );

    expect(metricResults[0].state).toBe("insufficient-data");
    expect(metricResults[0].winnerIndex).toBeNull();
    // Nothing may leak into the Winner Ribbon's tally either.
    expect(categoriesWon).toEqual([0, 0]);
  });

  it("still reports the real values, because they are still displayed", () => {
    const { metricResults } = computeWinners([item("hub", 140), item("mid-drive", 26)], [gated(() => false)]);
    // Withholding the ranking is not the same as hiding the data.
    expect(metricResults[0].values).toEqual([140, 26]);
  });

  it("behaves exactly as before when the gate passes", () => {
    const { metricResults, categoriesWon } = computeWinners(
      [item("a", 26), item("b", 58)],
      [gated(() => true)],
    );

    expect(metricResults[0].state).toBe("winner");
    expect(metricResults[0].winnerIndex).toBe(1);
    expect(categoriesWon).toEqual([0, 1]);
  });

  it("is not consulted when there was nothing to compare anyway", () => {
    // Fewer than 2 known values short-circuits first, so a gate that would
    // throw is never reached — order matters for cheapness, not correctness.
    const explodes = gated(() => {
      throw new Error("comparable() should not run without 2 known values");
    });

    expect(computeWinners([item("a", 26), item("b", null)], [explodes]).metricResults[0].state).toBe(
      "insufficient-data",
    );
  });

  it("leaves metrics without a gate untouched", () => {
    const { metricResults } = computeWinners([item("a", 26), item("b", 58)], [higher]);
    expect(metricResults[0].state).toBe("winner");
  });
});
