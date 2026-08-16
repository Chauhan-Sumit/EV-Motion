import { describe, expect, it } from "vitest";
import { buildCompareSlug, dedupeVehicles, MAX_COMPARE, MIN_COMPARE } from "./slug";
import { parseCompareSlug } from "./parse-slug";
import { cars } from "@/lib/data/cars";
import { twoWheelers } from "@/lib/data/two-wheelers";

/**
 * Compare slugs are user-visible URLs, canonical tags and sitemap entries —
 * and since Batch 3 they also drive `generateStaticParams`, so a build/parse
 * mismatch would silently produce pre-rendered pages that 404 on request.
 *
 * `slug.ts` (build) is deliberately data-free so client bundles can import
 * it; `parse-slug.ts` (parse) needs the catalog and is server-only — see
 * CLAUDE.md point 23.
 */

const [nexon, tiago, curvv] = cars;
const scooter = twoWheelers[0];

describe("buildCompareSlug", () => {
  it("joins slugs with the -vs- delimiter in the order given", () => {
    expect(buildCompareSlug([nexon, tiago])).toBe(`${nexon.slug}-vs-${tiago.slug}`);
  });

  it("drops duplicates", () => {
    expect(buildCompareSlug([nexon, nexon, tiago])).toBe(`${nexon.slug}-vs-${tiago.slug}`);
  });

  it("caps at MAX_COMPARE vehicles", () => {
    const slug = buildCompareSlug(cars.slice(0, MAX_COMPARE + 2));
    expect(slug.split("-vs-")).toHaveLength(MAX_COMPARE);
  });

  it("accepts anything carrying a slug, not just full Vehicle records", () => {
    // Widened in Batch 2 so client components can build compare URLs from
    // lightweight objects without importing the catalog.
    expect(buildCompareSlug([{ slug: "a" }, { slug: "b" }])).toBe("a-vs-b");
  });
});

describe("dedupeVehicles", () => {
  it("keeps first occurrence and preserves order", () => {
    const result = dedupeVehicles([{ slug: "a" }, { slug: "b" }, { slug: "a" }, { slug: "c" }]);
    expect(result.map((v) => v.slug)).toEqual(["a", "b", "c"]);
  });
});

describe("parseCompareSlug", () => {
  it("round-trips a slug built by buildCompareSlug", () => {
    const slug = buildCompareSlug([nexon, tiago]);
    const parsed = parseCompareSlug(slug);

    expect(parsed?.map((v) => v.slug)).toEqual([nexon.slug, tiago.slug]);
  });

  it("round-trips a three-vehicle comparison", () => {
    const slug = buildCompareSlug([nexon, tiago, curvv]);
    expect(parseCompareSlug(slug)?.map((v) => v.slug)).toEqual([nexon.slug, tiago.slug, curvv.slug]);
  });

  it("rejects a slug with an unknown vehicle", () => {
    expect(parseCompareSlug(`${nexon.slug}-vs-not-a-real-vehicle`)).toBeNull();
  });

  it("rejects a cross-category comparison", () => {
    // Comparing a car against a scooter is meaningless and would break the
    // spec tables, so the parser refuses rather than rendering a mismatch.
    expect(parseCompareSlug(`${nexon.slug}-vs-${scooter.slug}`)).toBeNull();
  });

  it("rejects a slug with no delimiter", () => {
    expect(parseCompareSlug(nexon.slug)).toBeNull();
  });

  it("rejects a single-vehicle 'comparison' formed by duplication", () => {
    // Deduping leaves one vehicle, which is below MIN_COMPARE.
    expect(MIN_COMPARE).toBe(2);
    expect(parseCompareSlug(`${nexon.slug}-vs-${nexon.slug}`)).toBeNull();
  });

  it("every pre-rendered slug parses back to real vehicles", () => {
    // The invariant that makes generateStaticParams safe: if any produced
    // slug failed to parse, that pre-rendered page would 404.
    for (const vehicle of [nexon, tiago, curvv]) {
      for (const other of cars.slice(0, 6)) {
        if (other.slug === vehicle.slug) continue;
        const slug = buildCompareSlug([vehicle, other]);
        expect(parseCompareSlug(slug), `expected ${slug} to resolve`).not.toBeNull();
      }
    }
  });
});
