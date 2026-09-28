import { afterEach, describe, expect, it } from "vitest";
import {
  getPricingConfig,
  PRICING_DEFAULTS,
  PRICING_ENV_KEYS,
  resetPricingConfigResolver,
  resolvePricingConfig,
  setPricingConfigResolver,
} from "./config";
import type { PricingConfig, PricingScope } from "./config";
import { estimateEmiFrom } from "./emi";

/**
 * Guards the pricing service's configuration surface.
 *
 * Two properties matter here and neither is obvious from reading the code:
 * a deployment setting must actually reach the figure the site quotes, and a
 * bad setting must never reach it. The second is the one with teeth — a typo'd
 * tariff that propagated would put `₹NaN` in front of a buyer on every page.
 */
describe("resolvePricingConfig", () => {
  it("uses the documented defaults when nothing is set", () => {
    const config = resolvePricingConfig({});
    expect(config.finance).toEqual(PRICING_DEFAULTS.finance);
    expect(config.runningCost).toEqual(PRICING_DEFAULTS.runningCost);
    expect(config.overrides).toEqual([]);
  });

  it("takes the rate and tenure from the environment", () => {
    const config = resolvePricingConfig({
      [PRICING_ENV_KEYS.annualRatePct]: "7.25",
      [PRICING_ENV_KEYS.defaultTenureMonths]: "84",
      [PRICING_ENV_KEYS.defaultDownPaymentPct]: "10",
    });
    expect(config.finance.annualRatePct).toBe(7.25);
    expect(config.finance.defaultTenureMonths).toBe(84);
    expect(config.finance.defaultDownPaymentPct).toBe(10);
  });

  it("takes the running-cost tariffs from the environment", () => {
    const config = resolvePricingConfig({
      [PRICING_ENV_KEYS.electricityCostPerUnit]: "11",
      [PRICING_ENV_KEYS.petrolPricePerLitre]: "119.5",
    });
    expect(config.runningCost.electricityCostPerUnit).toBe(11);
    expect(config.runningCost.petrolPricePerLitre).toBe(119.5);
  });

  it("reports which settings came from the environment", () => {
    const config = resolvePricingConfig({
      [PRICING_ENV_KEYS.annualRatePct]: "7.25",
    });
    expect(config.overrides).toEqual([PRICING_ENV_KEYS.annualRatePct]);
  });

  // The important half. Each of these previously had the potential to reach a
  // price label as NaN or as a nonsense figure.
  describe("refuses bad values rather than propagating them", () => {
    it.each([
      ["not a number", "abc"],
      ["empty", ""],
      ["whitespace", "   "],
      ["negative", "-5"],
      ["above 100 percent", "150"],
    ])("falls back to the default rate when the value is %s", (_label, raw) => {
      const config = resolvePricingConfig({ [PRICING_ENV_KEYS.annualRatePct]: raw });
      expect(config.finance.annualRatePct).toBe(PRICING_DEFAULTS.finance.annualRatePct);
      expect(config.overrides).toEqual([]);
    });

    it("never yields NaN for any numeric setting", () => {
      const poisoned = Object.fromEntries(
        Object.values(PRICING_ENV_KEYS).map((key) => [key, "banana"]),
      );
      const config = resolvePricingConfig(poisoned);

      const numbers = [
        config.finance.annualRatePct,
        config.finance.defaultTenureMonths,
        config.finance.defaultDownPaymentPct,
        config.finance.tenureMonths.min,
        config.finance.tenureMonths.max,
        config.finance.tenureMonths.step,
        config.finance.downPaymentPct.min,
        config.finance.downPaymentPct.max,
        config.finance.downPaymentPct.step,
        config.runningCost.electricityCostPerUnit,
        config.runningCost.petrolPricePerLitre,
        config.runningCost.daysPerMonth,
      ];
      for (const value of numbers) expect(Number.isFinite(value)).toBe(true);
    });

    it("discards slider bounds that cross over, which would render an unusable control", () => {
      const config = resolvePricingConfig({
        [PRICING_ENV_KEYS.tenureMin]: "84",
        [PRICING_ENV_KEYS.tenureMax]: "36",
      });
      expect(config.finance.tenureMonths).toEqual(PRICING_DEFAULTS.finance.tenureMonths);
    });
  });

  /**
   * The bug this caught: the Vehicle Detail Page carried a single flat
   * `petrolKmPerLitre: 15` of its own, so a scooter's running cost was quoted
   * against a car's fuel economy and its saving was overstated roughly
   * threefold.
   */
  it("compares each category against its own petrol equivalent", () => {
    const { petrolComparatorByCategory } = resolvePricingConfig({}).runningCost;
    expect(petrolComparatorByCategory["2-wheeler"].kmPerLitre).toBeGreaterThan(
      petrolComparatorByCategory.car.kmPerLitre,
    );
    expect(petrolComparatorByCategory.commercial.kmPerLitre).toBeLessThan(
      petrolComparatorByCategory.car.kmPerLitre,
    );
  });
});

/**
 * The seams that make a future API- or database-backed pricing service, and
 * future state-wise rates, a change to this module rather than to its fifteen
 * consumers.
 */
describe("configuration source", () => {
  afterEach(() => resetPricingConfigResolver());

  it("serves the environment-backed configuration by default", () => {
    expect(getPricingConfig().finance.annualRatePct).toBe(
      PRICING_DEFAULTS.finance.annualRatePct,
    );
  });

  it("can be backed by another source without consumers changing", () => {
    // Stands in for a snapshot fetched from an API or database at startup.
    const fromService: PricingConfig = {
      ...PRICING_DEFAULTS,
      finance: { ...PRICING_DEFAULTS.finance, annualRatePct: 8.15 },
      overrides: ["pricing-service"],
    };
    setPricingConfigResolver(() => fromService);

    // The call every consumer already makes, unchanged.
    expect(getPricingConfig().finance.annualRatePct).toBe(8.15);
    expect(estimateEmiFrom(1_000_000)).toBeGreaterThan(0);
  });

  it("hands the resolver the scope consumers already pass", () => {
    const seen: (PricingScope | undefined)[] = [];
    setPricingConfigResolver((scope) => {
      seen.push(scope);
      return { ...PRICING_DEFAULTS, overrides: [] };
    });

    getPricingConfig({ state: "Maharashtra", category: "car" });
    expect(seen).toEqual([{ state: "Maharashtra", category: "car" }]);
  });

  it("supports state-wise rates without any consumer change", () => {
    // A future state-wise table lives entirely inside the resolver.
    const byState: Record<string, number> = { Maharashtra: 9, Delhi: 6.5 };
    setPricingConfigResolver((scope) => ({
      ...PRICING_DEFAULTS,
      runningCost: {
        ...PRICING_DEFAULTS.runningCost,
        electricityCostPerUnit:
          byState[scope?.state ?? ""] ?? PRICING_DEFAULTS.runningCost.electricityCostPerUnit,
      },
      overrides: [],
    }));

    expect(getPricingConfig({ state: "Maharashtra" }).runningCost.electricityCostPerUnit).toBe(9);
    expect(getPricingConfig({ state: "Delhi" }).runningCost.electricityCostPerUnit).toBe(6.5);
    expect(getPricingConfig({ state: "Goa" }).runningCost.electricityCostPerUnit).toBe(8);
  });

  it("restores the built-in resolver on reset", () => {
    setPricingConfigResolver(() => ({
      ...PRICING_DEFAULTS,
      finance: { ...PRICING_DEFAULTS.finance, annualRatePct: 1 },
      overrides: [],
    }));
    resetPricingConfigResolver();
    expect(getPricingConfig().finance.annualRatePct).toBe(
      PRICING_DEFAULTS.finance.annualRatePct,
    );
  });
});
