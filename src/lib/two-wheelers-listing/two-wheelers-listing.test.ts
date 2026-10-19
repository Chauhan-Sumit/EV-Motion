import { describe, expect, it } from "vitest";
import { twoWheelers as catalogue } from "@/lib/data/two-wheelers";
import { oems } from "@/lib/data/oems";
import { buildTwoWheelersListingData, listedBikeBrandKeys } from "./page-data";
import {
  activeChips,
  activeFilterCount,
  EMPTY_FILTERS,
  filterAndSort,
  LAST_STEP,
  LOW_SPEED_KMPH,
  matches,
  parseBikeQuery,
  priceHistogram,
  serializeBikeQuery,
  type BikeFilters,
} from "./filters";
import { featuredRank, FEATURED_ORDER } from "./featured";
import { bikeFaqs, bikeSeoText, brandSummaries, superlatives, upcomingBikes } from "./copy";
import type { PricedBike } from "./types";

const data = buildTwoWheelersListingData();
// Base prices stand in for a city here; the logic under test is city-agnostic.
const bikes: PricedBike[] = data.bikes.map((b) => ({ ...b, price: b.basePriceLakh }));
const brands = listedBikeBrandKeys(data);
const f = (over: Partial<BikeFilters>): BikeFilters => ({ ...EMPTY_FILTERS, ...over });

describe("listing data", () => {
  it("lists every two-wheeler the site sells and nothing it doesn't", () => {
    const expected = catalogue.filter((v) => v.launchStatus !== "discontinued").map((v) => v.slug).sort();
    expect(data.bikes.map((b) => b.slug).sort()).toEqual(expected);
  });

  it("copies the type from the record rather than defaulting it", () => {
    for (const v of catalogue) if (v.launchStatus !== "discontinued") expect(v.twoWheelerType).toBeDefined();
  });

  it("has a brand-registry entry for every listed maker", () => {
    const known = new Set(oems.map((o) => o.key));
    expect(brands.filter((b) => !known.has(b))).toEqual([]);
  });

  it("keeps the editorial order pointing at real, listed models and spotlights one on sale", () => {
    const slugs = new Set(bikes.map((b) => b.slug));
    expect(FEATURED_ORDER.filter((s) => !slugs.has(s))).toEqual([]);
    expect(bikes.find((b) => b.slug === data.spotlightSlug)?.status).not.toBe("upcoming");
  });
});

describe("filters", () => {
  it("returns every bike with no filters", () => {
    expect(filterAndSort(bikes, EMPTY_FILTERS, "featured", featuredRank)).toHaveLength(bikes.length);
  });

  it("splits scooters and motorcycles with nothing left over", () => {
    const s = filterAndSort(bikes, f({ type: ["scooter"] }), "featured", featuredRank).length;
    const m = filterAndSort(bikes, f({ type: ["motorcycle"] }), "featured", featuredRank).length;
    expect(s + m).toBe(bikes.length);
    expect(m).toBeGreaterThan(0);
  });

  it("treats the low-speed bucket as a ceiling and the others as floors", () => {
    expect(filterAndSort(bikes, f({ speed: "low" }), "speed", featuredRank).every((b) => b.topSpeedKmph <= LOW_SPEED_KMPH)).toBe(true);
    expect(filterAndSort(bikes, f({ speed: "80" }), "speed", featuredRank).every((b) => b.topSpeedKmph >= 80)).toBe(true);
  });

  it("only counts a published fast-charging time as fast charging", () => {
    expect(filterAndSort(bikes, f({ fast: true }), "featured", featuredRank).every((b) => b.fastChargeMin !== null)).toBe(true);
  });

  it("filters home charging strictly under the chosen hours", () => {
    expect(filterAndSort(bikes, f({ charge: 4 }), "charge", featuredRank).every((b) => b.homeChargeHr < 4)).toBe(true);
  });

  it("counts a facet without its own selection, so options stay selectable", () => {
    const scooters = bikes.filter((b) => matches(b, f({ type: ["scooter"] }), "type") && b.type === "motorcycle");
    expect(scooters.length).toBe(bikes.filter((b) => b.type === "motorcycle").length);
  });

  it("histogram bands add up to the bikes that pass every other filter", () => {
    const filters = f({ type: ["scooter"] });
    expect(priceHistogram(bikes, filters).reduce((a, b) => a + b, 0)).toBe(bikes.filter((b) => matches(b, filters, "price")).length);
  });

  it("gives one removable chip per active filter", () => {
    const filters = f({ type: ["scooter"], brand: ["ather", "tvs"], pmin: 2, range: 100, battery: 3, speed: "60", charge: 5, fast: true, q: "pro" });
    const chips = activeChips(filters, (k) => k);
    expect(chips).toHaveLength(activeFilterCount(filters));
    expect(activeFilterCount(chips.reduce((s, c) => c.clear(s), filters))).toBe(0);
  });
});

describe("URL state", () => {
  it("round-trips through the query string", () => {
    const state = { filters: f({ q: "rizta", type: ["scooter"], brand: ["ather"], status: ["available"], pmin: 2, pmax: 6, range: 125, battery: 2.5, speed: "60", charge: 5, fast: true }), sort: "speed" as const, view: "grid" as const };
    expect(parseBikeQuery(Object.fromEntries(serializeBikeQuery(state)), brands)).toEqual(state);
  });

  it("serializes the default state to an empty query", () => {
    expect(serializeBikeQuery({ filters: EMPTY_FILTERS, sort: "featured", view: "list" }).toString()).toBe("");
  });

  it("understands the previous /two-wheelers parameters and search links", () => {
    expect(parseBikeQuery({ type: "motorcycle" }, brands).filters.type).toEqual(["motorcycle"]);
    const { filters, sort } = parseBikeQuery({ oems: "ather", availability: "upcoming", charging: "under30", sort: "range-desc", budget: "0.8-1.6", range: "130", battery: "2.3" }, brands);
    expect(filters).toMatchObject({ brand: ["ather"], status: ["upcoming"], fast: true, pmin: 1, pmax: 5, range: 125, battery: 2 });
    expect(sort).toBe("range");
  });

  it("drops unknown and malformed values", () => {
    const { filters, sort } = parseBikeQuery({ type: "scooter,hovercraft", brand: "ather,acme", speed: "70", charge: "2", pmax: "0", sort: "random" }, brands);
    expect(filters).toMatchObject({ type: ["scooter"], brand: ["ather"], speed: "", charge: 0, pmax: LAST_STEP });
    expect(sort).toBe("featured");
  });
});

describe("generated copy", () => {
  it("never prints undefined, NaN, Infinity or null", () => {
    const text = [...bikeFaqs(bikes).flatMap((x) => [x.q, x.a]), ...bikeSeoText(bikes), ...brandSummaries(bikes).map((b) => `${b.short} ${b.count}`)].join("\n");
    // "Bounce Infinity" is a brand name; any other Infinity is a computed value leaking through.
    expect(text).not.toMatch(/\bundefined\b|\bNaN\b|\bnull\b|(?<!Bounce )Infinity/);
  });

  it("gives each superlative to exactly one bike on sale", () => {
    const badges = superlatives(bikes);
    const labels = [...badges.values()];
    expect(new Set(labels).size).toBe(labels.length);
    for (const slug of badges.keys()) expect(bikes.find((b) => b.slug === slug)?.status).not.toBe("upcoming");
  });

  it("lists upcoming bikes only", () => {
    expect(upcomingBikes(bikes).every((b) => b.status === "upcoming")).toBe(true);
  });
});

describe("display names", () => {
  it("drops company suffixes and uses the sub-brand of a dual name", async () => {
    const { shortBikeBrand } = await import("./copy");
    expect(["Ather Energy", "Ola Electric", "TVS Motor", "Hero Electric / Vida", "Okinawa Autotech", "Ultraviolette Automotive", "Tunwal E-Motors", "Zelio E-Mobility", "PURE EV", "Bounce Infinity", "Royal Enfield"].map(shortBikeBrand)).toEqual(["Ather", "Ola", "TVS", "Vida", "Okinawa", "Ultraviolette", "Tunwal", "Zelio", "PURE EV", "Bounce Infinity", "Royal Enfield"]);
  });

  it("never leaves a model name that repeats the brand or is empty", () => {
    for (const b of bikes) {
      const words = b.name.trim().split(" ");
      expect(words.length).toBeGreaterThan(1);
      expect(words[1].toLowerCase()).not.toBe(words[0].toLowerCase());
    }
    expect(bikes.find((b) => b.slug === "vida-vx2")?.name).toBe("Vida VX2");
    expect(bikes.find((b) => b.slug === "ather-rizta")?.name).toBe("Ather Rizta");
  });
});
