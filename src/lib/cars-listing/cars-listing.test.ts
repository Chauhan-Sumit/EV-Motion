import { describe, expect, it } from "vitest";
import { cars as catalogue } from "@/lib/data/cars";
import { oems } from "@/lib/data/oems";
import { buildCarsListingData, listedBrandKeys } from "./page-data";
import {
  activeChips,
  activeFilterCount,
  EMPTY_FILTERS,
  filterAndSort,
  hasFiveStarBharatNcap,
  LAST_STEP,
  matches,
  parseListingQuery,
  priceHistogram,
  serializeListingQuery,
  type ListingFilters,
} from "./filters";
import { featuredRank, FEATURED_ORDER } from "./featured";
import { brandSummaries, listingFaqs, listingSeoText, superlatives, upcomingCars } from "./copy";
import type { PricedCar } from "./types";

const data = buildCarsListingData();
// Base prices stand in for a city here; the logic under test is city-agnostic.
const cars: PricedCar[] = data.cars.map((c) => ({ ...c, price: c.basePriceLakh }));
const brands = listedBrandKeys(data);
const f = (over: Partial<ListingFilters>): ListingFilters => ({ ...EMPTY_FILTERS, ...over });

describe("listing data", () => {
  it("lists every car the site sells and nothing it doesn't", () => {
    const expected = catalogue.filter((v) => v.launchStatus !== "discontinued").map((v) => v.slug).sort();
    expect(data.cars.map((c) => c.slug).sort()).toEqual(expected);
  });

  it("never presents an expired NCAP result as a current 5-star Bharat NCAP rating", () => {
    for (const c of cars) if (c.ncap?.expired) expect(hasFiveStarBharatNcap(c)).toBe(false);
  });

  it("has a brand-registry entry for every listed maker, so every brand tile can draw its logo or badge", () => {
    const known = new Set(oems.map((o) => o.key));
    expect(brands.filter((b) => !known.has(b))).toEqual([]);
  });

  it("keeps the editorial featured order pointing at real cars", () => {
    const slugs = new Set(cars.map((c) => c.slug));
    expect(FEATURED_ORDER.filter((s) => !slugs.has(s))).toEqual([]);
  });
});

describe("filters", () => {
  it("returns every car with no filters", () => {
    expect(filterAndSort(cars, EMPTY_FILTERS, "featured", featuredRank)).toHaveLength(cars.length);
  });

  it("filters price on the starting price against the stops", () => {
    const under10 = filterAndSort(cars, f({ pmin: 0, pmax: 1 }), "price-asc", featuredRank);
    expect(under10.length).toBeGreaterThan(0);
    expect(under10.every((c) => c.price[0] <= 10)).toBe(true);
  });

  it("drops cars with no published DC time from a charging-time filter instead of guessing", () => {
    const fast = filterAndSort(cars, f({ dc: 30 }), "dc", featuredRank);
    expect(fast.every((c) => c.dcMin !== null && c.dcMin <= 30)).toBe(true);
  });

  it("counts a facet without its own selection, so options stay selectable", () => {
    const withSuv = f({ body: ["suv"] });
    const sedans = cars.filter((c) => matches(c, withSuv, "body") && c.body === "sedan");
    expect(sedans.length).toBe(cars.filter((c) => c.body === "sedan").length);
  });

  it("sorts unknown acceleration and charging times last", () => {
    const byAcc = filterAndSort(cars, EMPTY_FILTERS, "acc", featuredRank);
    const firstNull = byAcc.findIndex((c) => c.accSec === null);
    if (firstNull >= 0) expect(byAcc.slice(firstNull).every((c) => c.accSec === null)).toBe(true);
  });

  it("histogram bands add up to the cars that pass every other filter", () => {
    const filters = f({ body: ["suv"] });
    const total = priceHistogram(cars, filters).reduce((a, b) => a + b, 0);
    expect(total).toBe(cars.filter((c) => matches(c, filters, "price")).length);
  });

  it("gives one removable chip per active filter", () => {
    const filters = f({ body: ["suv", "sedan"], brand: ["tata"], pmin: 1, safe: true });
    const chips = activeChips(filters, (k) => k);
    expect(chips).toHaveLength(activeFilterCount(filters));
    const cleared = chips.reduce((s, c) => c.clear(s), filters);
    expect(activeFilterCount(cleared)).toBe(0);
  });
});

describe("URL state", () => {
  it("round-trips through the query string", () => {
    const state = { filters: f({ q: "nexon", body: ["suv"], brand: ["tata", "mg"], seats: [5, 7], status: ["available"], pmin: 2, pmax: 8, range: 400, dc: 45, safe: true, awd: true }), sort: "range" as const, view: "grid" as const };
    const params = Object.fromEntries(serializeListingQuery(state));
    expect(parseListingQuery(params, brands)).toEqual(state);
  });

  it("serializes the default state to an empty query", () => {
    expect(serializeListingQuery({ filters: EMPTY_FILTERS, sort: "featured", view: "list" }).toString()).toBe("");
  });

  it("drops unknown and malformed values", () => {
    const { filters, sort } = parseListingQuery({ body: "suv,spaceship", brand: "tata,acme", dc: "17", pmin: "7", pmax: "0", sort: "random" }, brands);
    expect(filters.body).toEqual(["suv"]);
    expect(filters.brand).toEqual(["tata"]);
    expect(filters.dc).toBe(0);
    expect(filters.pmin).toBe(0);
    expect(filters.pmax).toBe(LAST_STEP);
    expect(sort).toBe("featured");
  });

  it("understands the current /cars parameters, so existing links keep working", () => {
    const { filters, sort } = parseListingQuery({ oems: "tata", type: "suv", availability: "upcoming", charging: "under30", sort: "range-desc", budget: "10-20" }, brands);
    expect(filters).toMatchObject({ brand: ["tata"], body: ["suv"], status: ["upcoming"], dc: 30, pmin: 1, pmax: 3 });
    expect(sort).toBe("range");
  });
});

describe("generated copy", () => {
  it("never prints undefined, NaN or Infinity", () => {
    const text = [...listingFaqs(cars).flatMap((x) => [x.q, x.a]), ...listingSeoText(cars), ...brandSummaries(cars).map((b) => `${b.short} ${b.count}`)].join("\n");
    expect(text).not.toMatch(/undefined|NaN|Infinity|null/);
  });

  it("gives each superlative to exactly one car on sale", () => {
    const badges = superlatives(cars);
    const labels = [...badges.values()];
    expect(new Set(labels).size).toBe(labels.length);
    for (const slug of badges.keys()) expect(cars.find((c) => c.slug === slug)?.status).not.toBe("upcoming");
  });

  it("lists upcoming cars only", () => {
    expect(upcomingCars(cars).every((c) => c.status === "upcoming")).toBe(true);
  });
});
