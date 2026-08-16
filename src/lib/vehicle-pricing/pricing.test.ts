import { describe, expect, it } from "vitest";
import { calculateEmi, estimateEmiFrom, DEFAULT_EMI_ASSUMPTION } from "./emi";
import { calculatePriceBreakdown, calculatePriceRangeBreakdown } from "./breakdown";
import { cityAdjustedExShowroomRange, cityPriceZone } from "./cityPriceZones";
import { CITIES, DEFAULT_CITY_ID, type City } from "@/lib/data/cities";
import { chargesForState, type StateCharges } from "@/lib/data/state-charges";

/**
 * `src/lib/vehicle-pricing/` is the single pricing system for the whole site
 * (CLAUDE.md point 16) — every price, on-road breakdown and EMI figure on
 * every page flows through it. A silent arithmetic regression here would be
 * invisible to `tsc`/`eslint`/`next build` and wrong on 400+ pages at once.
 */

const city = (id: string): City => {
  const found = CITIES.find((c) => c.id === id);
  if (!found) throw new Error(`Test fixture expects a city with id "${id}"`);
  return found;
};

describe("calculateEmi", () => {
  it("amortizes on a reducing balance", () => {
    // 10,00,000 at 9.5% for 60 months. The expected figure was verified
    // independently of the implementation, by simulating the loan month by
    // month (balance = balance × (1 + r) − emi) and binary-searching for the
    // payment that amortizes it to exactly zero — both agree on 21001.8613.
    const { emi, totalInterest, totalCost } = calculateEmi({
      principal: 1_000_000,
      annualRatePct: 9.5,
      tenureMonths: 60,
    });

    expect(emi).toBeCloseTo(21001.8613, 3);
    expect(totalCost).toBeCloseTo(emi * 60, 6);
    expect(totalInterest).toBeCloseTo(totalCost - 1_000_000, 6);
    expect(totalInterest).toBeGreaterThan(0);
  });

  it("splits principal evenly at a zero rate instead of dividing by zero", () => {
    // The (factor - 1) denominator is 0 when the rate is 0, so this path is
    // special-cased — guard against someone removing it.
    const { emi, totalInterest, totalCost } = calculateEmi({
      principal: 120_000,
      annualRatePct: 0,
      tenureMonths: 12,
    });

    expect(emi).toBe(10_000);
    expect(totalInterest).toBe(0);
    expect(totalCost).toBe(120_000);
  });

  it("returns zeroes rather than NaN for non-positive principal or tenure", () => {
    expect(calculateEmi({ principal: 0, annualRatePct: 9.5, tenureMonths: 60 })).toEqual({
      emi: 0,
      totalInterest: 0,
      totalCost: 0,
    });
    expect(calculateEmi({ principal: 500_000, annualRatePct: 9.5, tenureMonths: 0 })).toEqual({
      emi: 0,
      totalInterest: 0,
      totalCost: 0,
    });
  });

  it("costs more in total over a longer tenure at the same rate", () => {
    const short = calculateEmi({ principal: 800_000, annualRatePct: 9.5, tenureMonths: 36 });
    const long = calculateEmi({ principal: 800_000, annualRatePct: 9.5, tenureMonths: 84 });

    expect(long.emi).toBeLessThan(short.emi);
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest);
  });
});

describe("estimateEmiFrom", () => {
  it("finances only the post-down-payment principal", () => {
    const exShowroom = 1_500_000;
    const expected = calculateEmi({
      principal: exShowroom * (1 - DEFAULT_EMI_ASSUMPTION.downPct / 100),
      annualRatePct: DEFAULT_EMI_ASSUMPTION.annualRatePct,
      tenureMonths: DEFAULT_EMI_ASSUMPTION.tenureMonths,
    }).emi;

    expect(estimateEmiFrom(exShowroom)).toBeCloseTo(expected, 6);
  });

  it("is cheaper than financing the full ex-showroom price", () => {
    const exShowroom = 1_500_000;
    const full = calculateEmi({
      principal: exShowroom,
      annualRatePct: DEFAULT_EMI_ASSUMPTION.annualRatePct,
      tenureMonths: DEFAULT_EMI_ASSUMPTION.tenureMonths,
    }).emi;

    expect(estimateEmiFrom(exShowroom)).toBeLessThan(full);
  });
});

describe("calculatePriceBreakdown", () => {
  const charges: StateCharges = {
    registrationPct: 6,
    roadTaxPct: 8,
    insurancePct: 3,
    otherChargesFlat: 5_000,
    hasPurchaseSubsidy: false,
  };

  it("derives each component from the ex-showroom price and sums to on-road", () => {
    const b = calculatePriceBreakdown(1_000_000, charges);

    expect(b.registration).toBe(60_000);
    expect(b.roadTax).toBe(80_000);
    expect(b.insurance).toBe(30_000);
    expect(b.otherCharges).toBe(5_000);
    expect(b.onRoad).toBe(1_175_000);
  });

  it("keeps on-road exactly equal to the sum of its parts", () => {
    // Components are individually rounded, so this is a real invariant to
    // pin: a displayed breakdown that doesn't add up to its own total is a
    // credibility problem, not a rounding curiosity.
    for (const exShowroom of [99_999, 745_321, 1_234_567, 24_999_999]) {
      const b = calculatePriceBreakdown(exShowroom, charges);
      expect(b.onRoad).toBe(b.exShowroom + b.registration + b.roadTax + b.insurance + b.otherCharges);
    }
  });

  it("still returns a coherent breakdown when a state waives all percentage charges", () => {
    // Several states waive road tax and registration for EVs entirely.
    const waived: StateCharges = {
      registrationPct: 0,
      roadTaxPct: 0,
      insurancePct: 0,
      otherChargesFlat: 0,
      hasPurchaseSubsidy: false,
    };
    const b = calculatePriceBreakdown(800_000, waived);

    expect(b.onRoad).toBe(800_000);
  });

  it("maps a price range onto low and high breakdowns", () => {
    const r = calculatePriceRangeBreakdown([800_000, 1_200_000], charges);

    expect(r.low.exShowroom).toBe(800_000);
    expect(r.high.exShowroom).toBe(1_200_000);
    expect(r.high.onRoad).toBeGreaterThan(r.low.onRoad);
  });
});

describe("chargesForState", () => {
  it("returns usable rates for every city in the dataset", () => {
    // 157 cities map onto a smaller state table with a fallback; a city whose
    // state is missing must still price, never blank (see state-charges.ts).
    for (const c of CITIES) {
      const charges = chargesForState(c.state);
      expect(charges.registrationPct).toBeGreaterThanOrEqual(0);
      expect(charges.roadTaxPct).toBeGreaterThanOrEqual(0);
      expect(charges.insurancePct).toBeGreaterThan(0);
      expect(Number.isFinite(charges.otherChargesFlat)).toBe(true);
    }
  });
});

describe("cityPriceZone", () => {
  it("puts the default city on the baseline", () => {
    expect(cityPriceZone(city(DEFAULT_CITY_ID)).exShowroomAdjustmentPct).toBe(0);
  });

  it("pins Delhi-NCR satellites to Delhi's baseline despite their own state zone", () => {
    // Noida sits in Uttar Pradesh (0.5%) but shares Delhi's logistics
    // catchment — the override exists precisely to stop it inheriting that.
    for (const id of ["noida", "gurugram", "ghaziabad", "faridabad"]) {
      expect(cityPriceZone(city(id)).exShowroomAdjustmentPct).toBe(0);
    }
  });

  it("charges more for farther-freight states than for the manufacturing belt", () => {
    const mumbai = cityPriceZone(city("mumbai")).exShowroomAdjustmentPct;
    const guwahati = CITIES.find((c) => c.state === "Assam");
    expect(guwahati).toBeDefined();
    expect(cityPriceZone(guwahati!).exShowroomAdjustmentPct).toBeGreaterThan(mumbai);
  });

  it("never produces a negative or absurd adjustment for any city", () => {
    // A formula, not a table — so the guard is a sane range across all 157.
    for (const c of CITIES) {
      const pct = cityPriceZone(c).exShowroomAdjustmentPct;
      expect(pct).toBeGreaterThanOrEqual(0);
      expect(pct).toBeLessThanOrEqual(6);
    }
  });
});

describe("cityAdjustedExShowroomRange", () => {
  it("leaves the baseline city's catalog price untouched", () => {
    expect(cityAdjustedExShowroomRange([12.49, 17.19], city(DEFAULT_CITY_ID))).toEqual([12.49, 17.19]);
  });

  it("raises the price in a higher-freight city and preserves low <= high", () => {
    const base: [number, number] = [12.49, 17.19];
    const remote = CITIES.find((c) => c.state === "Ladakh");
    expect(remote).toBeDefined();

    const [low, high] = cityAdjustedExShowroomRange(base, remote!);
    expect(low).toBeGreaterThan(base[0]);
    expect(high).toBeGreaterThan(base[1]);
    expect(low).toBeLessThanOrEqual(high);
  });

  it("rounds to 2dp so the number matches what formatPriceLakh renders", () => {
    for (const c of CITIES.slice(0, 30)) {
      for (const value of cityAdjustedExShowroomRange([12.49, 17.19], c)) {
        expect(value).toBe(Math.round(value * 100) / 100);
      }
    }
  });
});
