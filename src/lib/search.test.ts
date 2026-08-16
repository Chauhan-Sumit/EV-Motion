import { describe, expect, it } from "vitest";
import { searchVehicles, vehicleHref } from "./search";
import { buildSearchIndex } from "./search-index";
import { POPULAR_SEARCHES_BY_SCOPE } from "@/lib/popular-searches";
import type { SearchIndex } from "@/types/search-index";

/**
 * Search runs client-side against the lazily-fetched index (CLAUDE.md point
 * 23), so these tests build the real index from the catalog and exercise the
 * matcher exactly as the browser does.
 */
const index: SearchIndex = buildSearchIndex();

const labels = (query: string, scope?: Parameters<typeof searchVehicles>[3]) =>
  searchVehicles(index, query, 8, scope).vehicles.map((v) => v.label);

describe("searchVehicles", () => {
  it("returns nothing for an empty query", () => {
    expect(searchVehicles(index, "").vehicles).toHaveLength(0);
    expect(searchVehicles(index, "   ").vehicles).toHaveLength(0);
  });

  it("returns nothing while the index is still loading", () => {
    // The box distinguishes this from "no matches" — a null index must not
    // render as a definitive empty result.
    expect(searchVehicles(null, "nexon").vehicles).toHaveLength(0);
  });

  it("finds a vehicle by bare model name", () => {
    expect(labels("nexon")[0]).toBe("Tata Motors Nexon EV");
  });

  it("is case-insensitive", () => {
    expect(labels("NEXON")[0]).toBe("Tata Motors Nexon EV");
  });

  it("matches a multi-word query whose brand word isn't the full legal name", () => {
    // The regression this was written for: the record is "Tata Motors" +
    // "Nexon EV", so `"tata motors nexon ev".includes("tata nexon")` is false
    // and the old whole-string matcher returned nothing for a query a real
    // person would obviously type.
    expect(labels("tata nexon")[0]).toBe("Tata Motors Nexon EV");
  });

  it("treats extra words as narrowing, not widening", () => {
    const broad = labels("tata");
    const narrow = labels("tata nexon");

    expect(broad.length).toBeGreaterThan(narrow.length);
    expect(narrow.every((l) => l.toLowerCase().includes("nexon"))).toBe(true);
  });

  it("returns nothing when one token matches but the other cannot", () => {
    expect(labels("tata ferrari")).toHaveLength(0);
  });

  it("ranks an exact model match first", () => {
    const results = labels("nexon ev");
    expect(results[0]).toBe("Tata Motors Nexon EV");
  });

  it("tolerates a one-character typo despite the ' EV' suffix", () => {
    // Nearly every model name ends in " EV", which used to push any typo past
    // the edit-distance threshold and made the fallback effectively dead.
    expect(labels("nexonn")[0]).toBe("Tata Motors Nexon EV");
  });

  it("does not fall back to typo matching for very short queries", () => {
    // Under 3 characters, edit distance <= 2 would match almost anything.
    const results = searchVehicles(index, "zz", 8);
    expect(results.vehicles).toHaveLength(0);
  });

  it("restricts results to the requested category scope", () => {
    const carsOnly = searchVehicles(index, "s", 50, "car").vehicles;
    expect(carsOnly.length).toBeGreaterThan(0);
    expect(carsOnly.every((v) => v.entry.category === "car")).toBe(true);
  });

  it("honours the result limit", () => {
    expect(searchVehicles(index, "e", 3).vehicles.length).toBeLessThanOrEqual(3);
  });

  it("builds a working href for every result", () => {
    for (const suggestion of searchVehicles(index, "e", 20).vehicles) {
      expect(suggestion.href).toBe(vehicleHref(suggestion.entry));
      expect(suggestion.href).toMatch(/^\/(cars|two-wheelers|commercial)\/[a-z0-9-]+$/);
    }
  });
});

describe("category keyword routing", () => {
  it("routes a body-type keyword to the pre-filtered listing", () => {
    expect(searchVehicles(index, "suv").categoryMatch?.href).toBe("/cars?type=suv");
    expect(searchVehicles(index, "scooter").categoryMatch?.href).toBe("/two-wheelers?type=scooter");
  });

  it("does not offer a keyword shortcut into a category with no vehicles", () => {
    // Commercial has full architecture but no data yet, so "truck"/"bus" must
    // not advertise a route into an empty listing.
    const commercialCount = index.vehicles.filter((v) => v.category === "commercial").length;
    const expectation = commercialCount > 0 ? "defined" : "undefined";

    for (const term of ["truck", "van", "bus"]) {
      const match = searchVehicles(index, term).categoryMatch;
      expect(match === undefined ? "undefined" : "defined", `"${term}" with ${commercialCount} commercial vehicles`).toBe(
        expectation,
      );
    }
  });

  it("suppresses a keyword outside the active scope", () => {
    expect(searchVehicles(index, "suv", 8, "2-wheeler").categoryMatch).toBeUndefined();
  });
});

describe("brand matching", () => {
  it("offers a brand link when every match belongs to one OEM", () => {
    const brand = searchVehicles(index, "ather").brandMatch;
    expect(brand?.href).toBe("/brands/ather");
    expect(brand?.label).toMatch(/^View all \d+ Ather Energy vehicles$/);
  });

  it("omits the brand link when matches span multiple OEMs", () => {
    expect(searchVehicles(index, "e").brandMatch).toBeUndefined();
  });
});

describe("curated popular searches", () => {
  it("every popular term resolves to something", () => {
    // CLAUDE.md point 10: these are user-facing suggestions, so a term that
    // silently resolves to nothing is a dead end in the UI.
    for (const [scope, terms] of Object.entries(POPULAR_SEARCHES_BY_SCOPE)) {
      const typedScope = scope as Parameters<typeof searchVehicles>[3];
      // Commercial suggestions can't resolve until that category has data.
      if (scope === "commercial" && !index.vehicles.some((v) => v.category === "commercial")) continue;

      for (const term of terms) {
        const outcome = searchVehicles(index, term, 1, typedScope);
        const resolved = outcome.categoryMatch ?? outcome.vehicles[0] ?? outcome.brandMatch;
        expect(resolved, `"${term}" (${scope}) resolves to nothing`).toBeDefined();
      }
    }
  });
});
