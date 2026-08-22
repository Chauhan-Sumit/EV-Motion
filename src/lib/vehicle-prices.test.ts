import { describe, expect, it } from "vitest";
import { getAllVehicles, getVehicleBySlug } from "@/lib/data";
import type { Vehicle } from "@/types/vehicle";

/**
 * `priceRangeLakh` means **the span of every trim the OEM sells**, not the span
 * of the trims this repo happens to model (owner decision, 2026-08-22). Two
 * consequences follow, and this suite pins both:
 *
 * 1. A range MAY be wider than the modelled variants — that just means trims
 *    exist which are not modelled yet, which is incompleteness, not error.
 * 2. A variant may NEVER fall outside its own record's range. That is a real
 *    contradiction: the page headlines the range and then lists a price it
 *    excludes.
 *
 * (2) is what caught `porsche-macan-electric`, which carried a flat
 * [121, 121] range directly above a variant table listing a 170 lakh Turbo.
 */

function bySlug(slug: string): Vehicle {
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) throw new Error(`fixture vehicle missing: ${slug}`);
  return vehicle;
}

describe("price range integrity", () => {
  it("never lists a variant priced outside its own record's range", () => {
    const violations: string[] = [];

    for (const vehicle of getAllVehicles()) {
      const [lo, hi] = vehicle.priceRangeLakh;
      for (const variant of vehicle.variants) {
        // Tolerance guards float representation only, not real drift.
        if (variant.priceLakh < lo - 0.0001 || variant.priceLakh > hi + 0.0001) {
          violations.push(`${vehicle.slug}: variant "${variant.id}" at ${variant.priceLakh} is outside [${lo}, ${hi}]`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("orders every range low-to-high", () => {
    const backwards = getAllVehicles()
      .filter((v) => v.priceRangeLakh[0] > v.priceRangeLakh[1])
      .map((v) => v.slug);

    expect(backwards).toEqual([]);
  });
});

describe("the corrections this audit made", () => {
  it("gives the Macan Electric a range that actually reaches its Turbo", () => {
    // Was [121, 121] with variants to 170 — the page stated one price above a
    // table listing a trim 49 lakh dearer, and the budget filter capped the
    // car at 1.21 Cr.
    const macan = bySlug("porsche-macan-electric");
    expect(macan.priceRangeLakh).toEqual([121.62, 168.62]);
    expect(macan.variants.map((v) => v.priceLakh)).toEqual([121.62, 138.0, 168.62]);
  });

  it("prices the whole Chetak C-series off one current list", () => {
    // The series was recorded 10-18k high per trim. Two records were caught by
    // an internal check; C3502 and C3503 were internally CONSISTENT and still
    // wrong, which is why self-consistency is not evidence of correctness.
    const expected: Record<string, number> = {
      "bajaj-chetak-c3001": 1.12,
      "bajaj-chetak-c3503": 1.14,
      "bajaj-chetak-c3502": 1.27,
      "bajaj-chetak-c3501": 1.345,
    };

    for (const [slug, price] of Object.entries(expected)) {
      const vehicle = bySlug(slug);
      expect(vehicle.priceRangeLakh, slug).toEqual([price, price]);
      expect(vehicle.variants[0].priceLakh, slug).toBe(price);
    }
  });

  it("carries no expired introductory price as a range floor", () => {
    // Both of these advertised a launch offer that had ended as if it were a
    // trim on sale. A launch offer is not a trim.
    expect(bySlug("oben-rorr-evo").priceRangeLakh).toEqual([1.25, 1.25]);
    expect(bySlug("ultraviolette-tesseract").priceRangeLakh).toEqual([1.45, 2.0]);
    // The Tesseract's modelled trim is the 6 kWh, which is the 2.0 lakh one —
    // it previously carried the 3.5 kWh trim's 1.45.
    expect(bySlug("ultraviolette-tesseract").variants[0].priceLakh).toBe(2.0);
  });

  it("prices the Nexon and Punch off Tata's own current table", () => {
    // Phase 2, Tata cluster. Nexon's ceiling excluded the #DARK trims Tata
    // sells (17.19 vs 17.69) and two variants were 20-50k over; Punch's
    // top variant was 20k over. Both from ev.tatamotors.com.
    const nexon = bySlug("tata-nexon-ev");
    expect(nexon.priceRangeLakh).toEqual([12.49, 17.69]);
    expect(nexon.variants.map((v) => v.priceLakh)).toEqual([12.49, 14.99, 16.99]);
    // The "LR" suffix is a retired Tata variant name — if it comes back, the
    // record has been reverted to a discontinued line-up.
    expect(nexon.variants.some((v) => v.name.includes("LR"))).toBe(false);

    const punch = bySlug("tata-punch-ev");
    expect(punch.priceRangeLakh).toEqual([9.69, 12.59]);
    expect(punch.variants.map((v) => v.priceLakh)).toEqual([9.69, 12.59]);
  });

  it("prices the MG range off MG's own current table", () => {
    // Phase 2, MG cluster. Every one of the five was wrong. The worst was the
    // ZS EV, whose ceiling sat 4.23 lakh above anything MG sells.
    const zs = bySlug("mg-zs-ev");
    expect(zs.priceRangeLakh).toEqual([17.99, 20.746]);
    expect(bySlug("mg-comet-ev").priceRangeLakh).toEqual([7.798, 10.068]);
    expect(bySlug("mg-windsor-ev").priceRangeLakh).toEqual([14.698, 18.998]);

    // Retired trim names. "Pace"/"Play" on the Comet and "Exclusive AC" on the
    // Windsor are not MG variants any more; their return means a revert.
    const retired = ["Pace", "Play", "Exclusive AC"];
    for (const slug of ["mg-comet-ev", "mg-windsor-ev"]) {
      const names = bySlug(slug).variants.map((v) => v.name);
      expect(names.filter((n) => retired.includes(n)), slug).toEqual([]);
    }
  });

  it("gives the two MG Select cars a ceiling that reaches their top edition", () => {
    // Both were flat ranges hiding a dearer trim — the Porsche shape again.
    // Secondary-sourced (MG Select cars are not on mgmotor.co.in's vehicle
    // pages), which is why the floors matching MG's launch prices matters.
    expect(bySlug("mg-cyberster").priceRangeLakh).toEqual([82.5, 87.49]);
    expect(bySlug("mg-m9").priceRangeLakh).toEqual([79.95, 84.94]);
  });

  it("carries BYD's July 2026 revision, closing the Seal price question", () => {
    // The BYD battery sub-batch flagged 41.0-vs-41.5 and 53.0-vs-53.65 as
    // unresolved and deferred them to this audit. BYD India's 1 July 2026
    // revision settles both.
    expect(bySlug("byd-seal").priceRangeLakh).toEqual([41.5, 53.65]);
    expect(bySlug("byd-emax-7").priceRangeLakh).toEqual([27.9, 29.9]);
    expect(bySlug("byd-sealion-7").priceRangeLakh).toEqual([49.4, 54.9]);
  });

  it("no longer lists the BE 6 as upcoming while its twin is on sale", () => {
    // The BE 6 and XEV 9e launched together, so one being `upcoming` and the
    // other `available` was internally inconsistent — a stale status the price
    // audit surfaced. Both are on sale.
    expect(bySlug("mahindra-be-6").launchStatus).toBe("available");
    expect(bySlug("mahindra-xev-9e").launchStatus).toBe("available");
    expect(bySlug("mahindra-be-6").priceRangeLakh).toEqual([19.45, 26.95]);
  });

  it("stops claiming 145 km from the OoWah's small battery", () => {
    // The record paired the EX's 2.3 kWh pack with the MAX Plus's 145 km. Each
    // trim now carries its own pack and its own range.
    const oowah = bySlug("bgauss-oowah");
    const ex = oowah.variants.find((v) => v.id === "oowah-ex");
    const maxPlus = oowah.variants.find((v) => v.id === "oowah-max-plus");
    expect(ex?.batteryKwh).toBe(2.3);
    expect(ex?.rangeKm).toBe(105);
    expect(maxPlus?.batteryKwh).toBe(3.0);
    expect(maxPlus?.rangeKm).toBe(145);
  });
});
