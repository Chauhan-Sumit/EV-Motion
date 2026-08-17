import { describe, expect, it } from "vitest";
import {
  ILLUSTRATION_STYLE,
  ILLUSTRATION_TRANSFORMATION,
  VEHICLE_ILLUSTRATIONS,
  illustrationFor,
  subTypeLabelFor,
} from "./vehicle-illustrations";
import { getAllVehicles } from "@/lib/data";
import { oems } from "@/lib/data/oems";

/**
 * Guards the honesty rules documented at the top of `vehicle-illustrations.ts`.
 *
 * These illustrations are AI-generated, which makes them the one place in this
 * codebase where a careless edit can manufacture a claim about a real product
 * rather than merely get a number wrong. Three of the assertions below exist to
 * fail loudly if someone "improves" a prompt in a way that crosses that line:
 * dropping the not-photorealistic clause, dropping the no-badges clauses, or
 * naming a real brand or model in a prompt.
 *
 * A failure here is not a styling opinion. Read the header comment in
 * `vehicle-illustrations.ts` before changing an expectation.
 */

const declared = Object.entries(VEHICLE_ILLUSTRATIONS).filter(([, value]) => Boolean(value));
const vehicles = getAllVehicles();

describe("illustration registry", () => {
  it("declares at least one illustration", () => {
    expect(declared.length).toBeGreaterThan(0);
  });

  it("keys every entry to a category:sub-type pair that real vehicles have", () => {
    // A key that matches nothing in the catalog is a dead entry: it would never
    // render, and nobody would notice.
    const present = new Set(
      vehicles
        .map((v) => {
          const subType = v.bodyType ?? v.twoWheelerType ?? v.commercialType;
          return subType ? `${v.category}:${subType}` : null;
        })
        .filter((key): key is string => key !== null),
    );

    for (const [key] of declared) {
      expect(present.has(key), `"${key}" matches no vehicle in the catalog`).toBe(true);
    }
  });

  it("points every entry at an ImageKit path, never an external URL", () => {
    // The production polish pass deleted every externally-hosted vehicle image
    // to remove provenance risk; these must not reintroduce one.
    for (const [key, illustration] of declared) {
      expect(illustration.path.startsWith("/"), `${key} path is not root-relative`).toBe(true);
      expect(illustration.path, `${key} points off-site`).not.toMatch(/^https?:/);
      expect(illustration.path, `${key} should be a transparent PNG`).toMatch(/\.png$/);
    }
  });

  it("records when each asset was generated", () => {
    for (const [key, illustration] of declared) {
      expect(illustration.generatedOn, `${key} has no generation date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("gives every entry a distinct path", () => {
    const paths = declared.map(([, illustration]) => illustration.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("prompt honesty guards", () => {
  it("keeps the not-photorealistic instruction in the shared style", () => {
    // A photoreal prompt was tried and returned a near-copy of a specific real
    // production SUV. Removing this clause reopens that.
    expect(ILLUSTRATION_STYLE).toMatch(/not photorealistic/i);
  });

  it("keeps every brand-mark exclusion in the shared style", () => {
    for (const clause of ["no text", "no logos", "no badges", "no brand marks", "no number plate"]) {
      expect(ILLUSTRATION_STYLE, `style dropped "${clause}"`).toContain(clause);
    }
  });

  /**
   * These two scan the per-entry *subject* prompt, not `fullPromptFor()`.
   *
   * The shared style is fixed, reviewed boilerplate already guarded by the two
   * tests above, and it legitimately contains ordinary English that collides
   * with brand names — "bold simple geometric shapes" trips "Simple Energy".
   * Including it here produced a failure that said nothing about honesty. The
   * subject line is the half that varies per entry, so it is the half worth
   * policing.
   */
  const ordinaryEnglish = new Set([
    // Real model names made of ordinary words, which would otherwise match any
    // normal English sentence: Mercedes' "G 580 with EQ Technology".
    "with",
  ]);

  function subjectWords(illustration: { prompt: string }): string {
    return illustration.prompt.toLowerCase();
  }

  it("never names a real OEM in a subject prompt", () => {
    // The unit is the body type. A prompt naming a brand would be asking the
    // model to draw that brand's product, which is the whole thing this avoids.
    const brandWords = new Set(
      oems
        .flatMap((oem) => oem.name.split(/\s+/))
        .map((word) => word.toLowerCase())
        // Generic corporate suffixes that are not brand identifiers alone.
        .filter(
          (word) =>
            word.length > 3 &&
            !ordinaryEnglish.has(word) &&
            !["motor", "motors", "electric", "energy", "india", "auto", "green", "mobility", "automotive"].includes(word),
        ),
    );

    for (const [key, illustration] of declared) {
      const prompt = subjectWords(illustration);
      for (const brand of brandWords) {
        expect(prompt.includes(brand), `${key} subject prompt names the brand "${brand}"`).toBe(false);
      }
    }
  });

  it("never names a real model in a subject prompt", () => {
    const modelWords = new Set(
      vehicles
        .flatMap((v) => v.modelName.split(/\s+/))
        .map((word) => word.toLowerCase())
        .filter((word) => word.length > 3 && word !== "electric" && !ordinaryEnglish.has(word)),
    );

    for (const [key, illustration] of declared) {
      const prompt = subjectWords(illustration);
      for (const model of modelWords) {
        expect(prompt.includes(model), `${key} subject prompt names the model "${model}"`).toBe(false);
      }
    }
  });

  it("describes each subject as generic and unbranded", () => {
    for (const [key, illustration] of declared) {
      expect(illustration.prompt, `${key} subject is not marked generic`).toMatch(/generic/i);
      expect(illustration.prompt, `${key} subject is not marked unbranded`).toMatch(/unbranded/i);
    }
  });

  it("requests PNG output so the background removal keeps its alpha channel", () => {
    // A .jpg output silently flattens transparency back to white, which would
    // put a white box over each card's brand gradient.
    expect(ILLUSTRATION_TRANSFORMATION).toContain("f-png");
    expect(ILLUSTRATION_TRANSFORMATION).toContain("e-bgremove");
  });
});

describe("illustrationFor", () => {
  it("resolves a vehicle carrying a sub-type to its declared illustration", () => {
    const declaredKeys = new Set(declared.map(([key]) => key));
    const covered = vehicles.filter((v) => {
      const subType = v.bodyType ?? v.twoWheelerType ?? v.commercialType;
      return subType && declaredKeys.has(`${v.category}:${subType}`);
    });

    expect(covered.length, "no vehicle resolves to an illustration").toBeGreaterThan(0);
    for (const vehicle of covered) {
      expect(illustrationFor(vehicle), `${vehicle.slug} failed to resolve`).toBeDefined();
    }
  });

  it("falls back to undefined for a subject with no sub-type", () => {
    // This is the search-index thumbnail path — it must degrade to the SVG icon
    // rather than throw or render a broken image.
    expect(illustrationFor({ category: "car" })).toBeUndefined();
    expect(illustrationFor({ category: "2-wheeler" })).toBeUndefined();
  });

  it("never resolves an impossible category/sub-type combination", () => {
    expect(illustrationFor({ category: "car", twoWheelerType: "scooter" })).toBeUndefined();
    expect(illustrationFor({ category: "2-wheeler", bodyType: "suv" })).toBeUndefined();
  });
});

describe("subTypeLabelFor", () => {
  it("labels every vehicle's sub-type using the filter registry's own wording", () => {
    for (const vehicle of vehicles) {
      expect(subTypeLabelFor(vehicle), `${vehicle.slug} has no sub-type label`).toBeTruthy();
    }
  });

  it("returns undefined when there is no sub-type to label", () => {
    expect(subTypeLabelFor({ category: "car" })).toBeUndefined();
  });
});
