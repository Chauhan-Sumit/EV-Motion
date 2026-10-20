import { describe, expect, it } from "vitest";
import { oems } from "@/lib/data/oems";
import { cars as carCatalogue } from "@/lib/data/cars";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { isCurrentlySold } from "@/lib/vehicle-availability";
import { featuredRank as carRank } from "@/lib/cars-listing/featured";
import { featuredRank as bikeRank } from "@/lib/two-wheelers-listing/featured";
import type { PricedCar } from "@/lib/cars-listing/types";
import type { PricedBike } from "@/lib/two-wheelers-listing/types";
import { buildBrandPageData } from "./page-data";
import { BIKE_BRAND_SORT, brandHeadings, CAR_BRAND_SORT, lineup, lineupNoun, sortBrandBikes, sortBrandCars } from "./copy";

const pricedCars = (slug: string): PricedCar[] => {
  const data = buildBrandPageData(slug)!;
  if (data.kind !== "car") throw new Error(`${slug} is not a car brand`);
  return data.market.filter((c) => c.oem === data.brand.key).map((c) => ({ ...c, price: c.basePriceLakh }));
};
const pricedBikes = (slug: string): PricedBike[] => {
  const data = buildBrandPageData(slug)!;
  if (data.kind !== "2-wheeler") throw new Error(`${slug} is not a two-wheeler brand`);
  return data.market.filter((b) => b.oem === data.brand.key).map((b) => ({ ...b, price: b.basePriceLakh }));
};

describe("buildBrandPageData", () => {
  it("returns null for an unknown brand", () => {
    expect(buildBrandPageData("no-such-brand")).toBeNull();
  });

  it("gives every brand in the catalogue a page, listing exactly what it currently sells", () => {
    for (const oem of oems) {
      const data = buildBrandPageData(oem.slug);
      expect(data, oem.slug).not.toBeNull();
      const catalogue = data!.kind === "car" ? carCatalogue : twoWheelers;
      const expected = catalogue.filter((v) => v.oem === oem.key && isCurrentlySold(v)).map((v) => v.slug).sort();
      const listed = (data!.market as { oem: string; slug: string }[]).filter((v) => v.oem === oem.key).map((v) => v.slug).sort();
      expect(listed, oem.slug).toEqual(expected);
      expect(listed.length, `${oem.slug} has no models`).toBeGreaterThan(0);
    }
  });

  it("carries the whole listing as the market, so badges are judged site-wide", () => {
    const data = buildBrandPageData("mg")!;
    expect(new Set(data.market.map((c) => c.oem)).size).toBeGreaterThan(1);
  });
});

describe("headings", () => {
  it("names what the brand sells", () => {
    expect(lineupNoun("car")).toBe("cars");
    expect(lineupNoun("2-wheeler", ["scooter", "scooter"])).toBe("scooters");
    expect(lineupNoun("2-wheeler", ["motorcycle"])).toBe("motorcycles");
    expect(lineupNoun("2-wheeler", ["scooter", "motorcycle"])).toBe("scooters & motorcycles");
  });

  it("does not call a brand electric twice", () => {
    expect(brandHeadings("MG Motor", "cars")).toEqual({ heroLine: "electric cars", modelsHeading: "MG Motor Electric Cars" });
    expect(brandHeadings("Ola Electric", "scooters")).toEqual({ heroLine: "scooters", modelsHeading: "Ola Electric Scooters" });
    expect(brandHeadings("PURE EV", "scooters & motorcycles").modelsHeading).toBe("PURE EV Scooters & Motorcycles");
  });
});

describe("sorting", () => {
  it("falls back to the default for missing or unknown values", () => {
    expect(CAR_BRAND_SORT.parse(undefined)).toBe("price-asc");
    expect(CAR_BRAND_SORT.parse("speed")).toBe("price-asc");
    expect(BIKE_BRAND_SORT.parse("speed")).toBe("speed");
    expect(BIKE_BRAND_SORT.parse("dc")).toBe("price-asc");
    expect(CAR_BRAND_SORT.parse(["range", "dc"])).toBe("range");
  });

  it("orders by the chosen figure", () => {
    const asc = sortBrandCars(pricedCars("mg"), "price-asc").map((c) => c.price[0]);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const speed = sortBrandBikes(pricedBikes("ola-electric"), "speed").map((b) => b.topSpeedKmph);
    expect(speed).toEqual([...speed].sort((a, b) => b - a));
  });
});

describe("hero line-up", () => {
  it("draws up to three different models, back to front, in different colours where the catalogue allows", () => {
    const stage = lineup(pricedCars("mg"), carRank);
    expect(stage.map((s) => s.position)).toEqual(["back", "mid", "front"]);
    expect(new Set(stage.map((s) => s.item.slug)).size).toBe(3);
    expect(new Set(stage.map((s) => s.swatch)).size).toBe(3);
  });

  it("puts the priciest remaining model at the back", () => {
    const mg = pricedCars("mg");
    const stage = lineup(mg, carRank);
    const nearer = new Set(stage.filter((s) => s.position !== "back").map((s) => s.item.slug));
    const flagship = [...mg].filter((c) => !nearer.has(c.slug)).sort((a, b) => b.price[0] - a.price[0])[0];
    expect(stage.find((s) => s.position === "back")!.item.slug).toBe(flagship.slug);
  });

  it("draws every model of a small brand once", () => {
    for (const oem of oems) {
      const data = buildBrandPageData(oem.slug)!;
      const mine = data.kind === "car" ? pricedCars(oem.slug) : pricedBikes(oem.slug);
      const stage = data.kind === "car" ? lineup(mine as PricedCar[], carRank) : lineup(mine as PricedBike[], bikeRank);
      expect(stage.length, oem.slug).toBe(Math.min(3, mine.length));
      expect(new Set(stage.map((s) => s.item.slug)).size, oem.slug).toBe(stage.length);
    }
  });

  it("draws nothing for a brand with no models", () => {
    expect(lineup([] as PricedCar[], carRank)).toEqual([]);
  });
});
