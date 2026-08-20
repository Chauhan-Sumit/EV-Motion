import { describe, expect, it } from "vitest";
import {
  getAllVehicles,
  getCurrentVehicles,
  getCurrentVehiclesByCategory,
  getRelatedVehicles,
  getVehicleBySlug,
  getVehiclesByOem,
} from "@/lib/data";
import { isCurrentlySold, isDiscontinued, schemaAvailabilityFor } from "./vehicle-availability";
import { buildSearchIndex } from "./search-index";
import { searchVehicles } from "./search";
import { popularComparisonPairs } from "./compare/popular-pairs";
import { POPULAR_SEARCHES_BY_SCOPE } from "./popular-searches";
import { LAUNCH_STATUS_LABEL } from "./vehicle-labels";
import { bikeComparisons, carComparisons, getPopularByCategory, getRankedByCategory, getTrendingByCategory } from "./data/ev-motion/derive";

/**
 * `LaunchStatus` gained `"discontinued"` so `bajaj-chetak-2901` and
 * `bajaj-chetak-premium` — scooters Bajaj replaced with the C-series — could
 * stop claiming to be `"available"` without being deleted (HANDOFF.md
 * sub-batch 9). Deleting them would throw away a working public URL and the
 * data behind it for people who own these scooters.
 *
 * That makes the split the thing worth testing: gone from everything that
 * presents a vehicle as buyable, still served everywhere the vehicle itself is
 * what was asked for.
 */

const DISCONTINUED_SLUGS = ["bajaj-chetak-2901", "bajaj-chetak-premium"];

describe("the predicate", () => {
  it("reads launchStatus and nothing else", () => {
    expect(isDiscontinued({ launchStatus: "discontinued" })).toBe(true);
    expect(isDiscontinued({ launchStatus: "available" })).toBe(false);
    expect(isCurrentlySold({ launchStatus: "upcoming" })).toBe(true);
    expect(isCurrentlySold({ launchStatus: "discontinued" })).toBe(false);
  });

  it("has a human label, for the surfaces that still show one", () => {
    expect(LAUNCH_STATUS_LABEL.discontinued).toBe("Discontinued");
  });
});

describe("the two records are marked, not deleted", () => {
  it("still exists in the catalogue", () => {
    for (const slug of DISCONTINUED_SLUGS) {
      const vehicle = getVehicleBySlug(slug);
      expect(vehicle, `${slug} was deleted`).toBeDefined();
      expect(vehicle!.launchStatus).toBe("discontinued");
    }
  });

  it("keeps its detail page reachable via generateStaticParams' source list", () => {
    // /two-wheelers/[slug] maps over the raw `twoWheelers` array, so anything
    // filtered out of THAT would 404. getAllVehicles must stay unfiltered.
    const allSlugs = getAllVehicles().map((v) => v.slug);
    for (const slug of DISCONTINUED_SLUGS) expect(allSlugs).toContain(slug);
  });

  it("keeps its researched specs", () => {
    // The Chetak Premium's Batch 6 pilot specs remain true of the scooter the
    // record describes; "no longer sold" is not "no longer accurate".
    expect(getVehicleBySlug("bajaj-chetak-premium")?.specs?.motor?.peakPowerKw).toBe(4.2);
  });

  it("reports schema.org/Discontinued rather than claiming a live offer", () => {
    // This is what `structured-data.ts` publishes for both the detail page's
    // Product/Offer and each entry of a comparison's ItemList.
    expect(schemaAvailabilityFor(getVehicleBySlug("bajaj-chetak-premium")!)).toBe("https://schema.org/Discontinued");
    expect(schemaAvailabilityFor({ launchStatus: "upcoming" })).toBe("https://schema.org/PreOrder");
    expect(schemaAvailabilityFor({ launchStatus: "available" })).toBe("https://schema.org/InStock");
  });
});

describe("excluded from every surface that presents a vehicle as buyable", () => {
  it("the current-vehicle accessors", () => {
    expect(getCurrentVehicles().every(isCurrentlySold)).toBe(true);
    expect(getCurrentVehicles()).toHaveLength(getAllVehicles().length - DISCONTINUED_SLUGS.length);
    expect(getCurrentVehiclesByCategory("2-wheeler").map((v) => v.slug)).not.toContain("bajaj-chetak-premium");
  });

  it("every curated popular-search term", () => {
    // A "Popular Searches" chip is a recommendation, unlike a typed search —
    // which is why the term list points at bajaj-chetak-c3501 instead. See
    // popular-searches.ts.
    const discontinuedNames = DISCONTINUED_SLUGS.map((slug) => getVehicleBySlug(slug)!.modelName);
    for (const terms of Object.values(POPULAR_SEARCHES_BY_SCOPE)) {
      for (const name of discontinuedNames) expect(terms).not.toContain(name);
    }
  });

  it("brand pages", () => {
    // /brands/[oem] filters with the same predicate; this asserts the data it
    // filters would otherwise have included them.
    const bajaj = getVehiclesByOem("bajaj");
    expect(bajaj.some(isDiscontinued)).toBe(true);
    expect(bajaj.filter(isCurrentlySold).map((v) => v.slug)).not.toContain("bajaj-chetak-premium");
  });

  it("homepage rails", () => {
    const railSlugs = [
      ...getPopularByCategory("2-wheeler", 100).map((c) => c.slug),
      ...getTrendingByCategory("2-wheeler").map((t) => t.vehicle.slug),
      ...getRankedByCategory("2-wheeler", 100).map((r) => r.vehicle.slug),
    ];
    for (const slug of DISCONTINUED_SLUGS) expect(railSlugs, `${slug} is on a homepage rail`).not.toContain(slug);
  });

  it("curated homepage compare pairs", () => {
    const paired = [...carComparisons, ...bikeComparisons].flatMap((p) => [p.vehicleA.vehicle.slug, p.vehicleB.vehicle.slug]);
    for (const slug of DISCONTINUED_SLUGS) expect(paired, `${slug} is a curated compare pair`).not.toContain(slug);
    // cmp-bike-2 must still resolve after being re-pointed — a dropped pair
    // would silently shrink the homepage rather than fail.
    expect(bikeComparisons.map((p) => p.id)).toContain("cmp-bike-2");
  });

  it("related/similar recommendations", () => {
    for (const vehicle of getAllVehicles()) {
      const related = getRelatedVehicles(vehicle).map((v) => v.slug);
      for (const slug of DISCONTINUED_SLUGS) {
        expect(related, `${slug} is recommended beside ${vehicle.slug}`).not.toContain(slug);
      }
    }
  });

  it("the pre-rendered comparison set and therefore the sitemap", () => {
    const paired = popularComparisonPairs().flatMap((p) => [p.a.slug, p.b.slug]);
    for (const slug of DISCONTINUED_SLUGS) expect(paired, `${slug} is in the pre-rendered pairs`).not.toContain(slug);
  });
});

describe("search keeps them, and labels them", () => {
  it("indexes every discontinued vehicle, so it stays findable by name", () => {
    // Deliberately the opposite of the browsing surfaces above. Searching is
    // asking for a specific thing; someone who owns one must be able to reach
    // its page.
    const indexed = buildSearchIndex().vehicles.map((v) => v.slug);
    for (const slug of DISCONTINUED_SLUGS) expect(indexed, `${slug} is not searchable`).toContain(slug);
    expect(buildSearchIndex().vehicles).toHaveLength(getAllVehicles().length);
  });

  it("flags them so the dropdown can label them", () => {
    // Without this the result would pass as current stock — findable and
    // labelled is the honest pairing, findable and unmarked is not.
    const bySlug = new Map(buildSearchIndex().vehicles.map((v) => [v.slug, v]));
    for (const slug of DISCONTINUED_SLUGS) {
      expect(bySlug.get(slug)?.discontinued, `${slug} is indexed but unlabelled`).toBe(true);
    }
  });

  it("leaves the flag off everything still sold, to keep the payload small", () => {
    const flagged = buildSearchIndex().vehicles.filter((v) => v.discontinued !== undefined);
    expect(flagged).toHaveLength(DISCONTINUED_SLUGS.length);
  });

  it("resolves a discontinued vehicle by its own name", () => {
    const index = buildSearchIndex();
    const outcome = searchVehicles(index, "Chetak Premium", 5, "2-wheeler");
    expect(outcome.vehicles[0]?.entry.slug).toBe("bajaj-chetak-premium");
    expect(outcome.vehicles[0]?.entry.discontinued).toBe(true);
  });
});

describe("a discontinued vehicle's own page still works", () => {
  it("gets a full row of current recommendations", () => {
    // Excluding them as CANDIDATES must not break calling it ON one — its
    // detail page needs a populated "similar vehicles" rail like any other.
    const related = getRelatedVehicles(getVehicleBySlug("bajaj-chetak-premium")!);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every(isCurrentlySold)).toBe(true);
  });
});
