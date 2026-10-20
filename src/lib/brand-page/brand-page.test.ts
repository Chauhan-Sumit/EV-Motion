import { describe, expect, it } from "vitest";
import { cars as catalogue } from "@/lib/data/cars";
import { isCurrentlySold } from "@/lib/vehicle-availability";
import type { PricedCar } from "@/lib/cars-listing/types";
import { buildBrandPageData } from "./page-data";
import { BRAND_SORT_OPTIONS, DEFAULT_BRAND_SORT, lineup, parseBrandSort, sortBrandCars } from "./copy";

const priced = (slug: string): PricedCar[] => {
  const data = buildBrandPageData(slug)!;
  return data.market.filter((c) => c.oem === data.brand.key).map((c) => ({ ...c, price: c.basePriceLakh }));
};

describe("buildBrandPageData", () => {
  it("returns null for an unknown brand", () => {
    expect(buildBrandPageData("no-such-brand")).toBeNull();
  });

  it("lists exactly the brand's currently sold cars", () => {
    const expected = catalogue.filter((v) => v.oem === "mg" && isCurrentlySold(v)).map((v) => v.slug).sort();
    expect(priced("mg").map((c) => c.slug).sort()).toEqual(expected);
  });

  it("carries the whole listing as the market, so badges are judged site-wide", () => {
    const data = buildBrandPageData("mg")!;
    expect(new Set(data.market.map((c) => c.oem)).size).toBeGreaterThan(1);
  });
});

describe("sorting", () => {
  it("falls back to the default for missing or unknown values", () => {
    expect(parseBrandSort(undefined)).toBe(DEFAULT_BRAND_SORT);
    expect(parseBrandSort("featured")).toBe(DEFAULT_BRAND_SORT);
    expect(parseBrandSort(["range", "dc"])).toBe("range");
  });

  it("offers only sorts with a label", () => {
    expect(BRAND_SORT_OPTIONS.every((o) => o.label.length > 0)).toBe(true);
  });

  it("orders by the chosen figure", () => {
    const mg = priced("mg");
    const asc = sortBrandCars(mg, "price-asc").map((c) => c.price[0]);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const range = sortBrandCars(mg, "range").map((c) => c.rangeKm);
    expect(range).toEqual([...range].sort((a, b) => b - a));
  });
});

describe("hero", () => {
  it("draws up to three different cars, back to front, in different colours where the catalogue allows", () => {
    const stage = lineup(priced("mg"));
    expect(stage.map((s) => s.position)).toEqual(["back", "mid", "front"]);
    expect(new Set(stage.map((s) => s.car.slug)).size).toBe(3);
    expect(new Set(stage.map((s) => s.swatch)).size).toBe(3);
  });

  it("puts the priciest remaining car at the back", () => {
    const mg = priced("mg");
    const stage = lineup(mg);
    const nearer = new Set(stage.filter((s) => s.position !== "back").map((s) => s.car.slug));
    const flagship = [...mg].filter((c) => !nearer.has(c.slug)).sort((a, b) => b.price[0] - a.price[0])[0];
    expect(stage.find((s) => s.position === "back")!.car.slug).toBe(flagship.slug);
  });

  it("draws nothing for a brand with no cars", () => {
    expect(lineup([])).toEqual([]);
  });
});
