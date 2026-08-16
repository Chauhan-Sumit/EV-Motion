import { describe, expect, it } from "vitest";
import { filterConfigFor, SORT_OPTIONS, CHARGING_OPTIONS } from "./vehicle-filter-options";
import { CATEGORIES } from "@/lib/data/categories";
import { getVehiclesByCategory } from "@/lib/data";
import type { VehicleCategory } from "@/types/vehicle";

/**
 * The regression guard CLAUDE.md point 5a asks for.
 *
 * Filter bounds are hand-maintained constants, but they're checked against
 * live data. This exact failure has happened: a data batch added a car whose
 * price and battery capacity exceeded the existing bounds, and it silently
 * vanished from `/cars` and the homepage filter chips. `tsc`, `eslint` and
 * `next build` all stayed green — nothing catches numeric bound drift except
 * a check like this one.
 *
 * A failure here means: widen the bound in `vehicle-filter-options.ts` to
 * cover the new vehicle. It does not mean the data is wrong.
 */

const categories = CATEGORIES.map((c) => c.key);

describe.each(categories)("%s filter bounds cover the dataset", (category: VehicleCategory) => {
  const config = filterConfigFor(category);
  const vehicles = getVehiclesByCategory(category);

  it("declares the category it belongs to", () => {
    expect(config.category).toBe(category);
  });

  it("has ordered, non-negative bounds", () => {
    for (const [name, [min, max]] of Object.entries({
      price: config.priceBounds,
      range: config.rangeBounds,
      battery: config.batteryBounds,
    })) {
      expect(min, `${name} min`).toBeGreaterThanOrEqual(0);
      expect(max, `${name} max`).toBeGreaterThan(min);
    }
  });

  it("includes every vehicle's price range", () => {
    for (const v of vehicles) {
      expect(v.priceRangeLakh[0], `${v.slug} low price below bound`).toBeGreaterThanOrEqual(config.priceBounds[0]);
      expect(v.priceRangeLakh[1], `${v.slug} high price above bound`).toBeLessThanOrEqual(config.priceBounds[1]);
    }
  });

  it("includes every vehicle's range", () => {
    for (const v of vehicles) {
      expect(v.rangeKm, `${v.slug} range outside bounds`).toBeGreaterThanOrEqual(config.rangeBounds[0]);
      expect(v.rangeKm, `${v.slug} range outside bounds`).toBeLessThanOrEqual(config.rangeBounds[1]);
    }
  });

  it("includes every vehicle's battery capacity", () => {
    for (const v of vehicles) {
      expect(v.batteryCapacityKwh, `${v.slug} battery outside bounds`).toBeGreaterThanOrEqual(config.batteryBounds[0]);
      expect(v.batteryCapacityKwh, `${v.slug} battery outside bounds`).toBeLessThanOrEqual(config.batteryBounds[1]);
    }
  });

  it("offers a sub-type option for every sub-type present in the data", () => {
    // A vehicle whose body type has no filter chip is unreachable by filter.
    const declared = new Set(config.subTypeOptions.map((o) => o.value));
    for (const v of vehicles) {
      const subType = v.bodyType ?? v.twoWheelerType ?? v.commercialType;
      if (!subType) continue;
      expect(declared.has(subType), `${v.slug} has sub-type "${subType}" with no filter option`).toBe(true);
    }
  });

  it("leads its sub-type options with an 'all' escape hatch", () => {
    expect(config.subTypeOptions[0].value).toBe("all");
  });
});

describe("shared filter options", () => {
  it("exposes unique sort values", () => {
    expect(new Set(SORT_OPTIONS.map((o) => o.value)).size).toBe(SORT_OPTIONS.length);
  });

  it("defaults charging to 'any' first", () => {
    expect(CHARGING_OPTIONS[0].value).toBe("any");
  });
});
