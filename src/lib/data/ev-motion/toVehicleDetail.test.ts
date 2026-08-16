import { describe, expect, it } from "vitest";
import { toVehicleDetail } from "./toVehicleDetail";
import { getAllVehicles } from "@/lib/data";
import type { Vehicle } from "@/types/vehicle";

/**
 * Guards the site-wide data-honesty invariant (CLAUDE.md point 22): a
 * specification is either real sourced data or it is absent — never derived
 * from a formula and presented as fact.
 *
 * This is the hardest kind of regression to catch by eye. Re-adding a
 * plausible-looking fallback (`?? batteryKwh * 2.3`) type-checks, lints,
 * builds, and renders a confident-looking number on 122 vehicle pages —
 * *and*, because `src/lib/compare/` reads `VehicleDetail`, silently changes
 * comparison verdicts and schema.org markup at the same time.
 */

const vehicles = getAllVehicles();
const withSpecs = vehicles.filter((v) => v.specs);
const withoutSpecs = vehicles.filter((v) => !v.specs);

const detailOf = (v: Vehicle) => toVehicleDetail(v);

describe("sourced-only specifications", () => {
  it("has vehicles on both sides of the fixture divide", () => {
    // If either side empties out, the assertions below stop proving anything.
    expect(withSpecs.length).toBeGreaterThan(0);
    expect(withoutSpecs.length).toBeGreaterThan(0);
  });

  it("never invents power or torque for a vehicle without motor specs", () => {
    for (const vehicle of withoutSpecs) {
      const d = detailOf(vehicle);
      expect(d.quickSpecs.powerKw, `${vehicle.slug} power`).toBeUndefined();
      expect(d.quickSpecs.torqueNm, `${vehicle.slug} torque`).toBeUndefined();
    }
  });

  it("reports power and torque exactly as published where they exist", () => {
    for (const vehicle of withSpecs) {
      const d = detailOf(vehicle);
      expect(d.quickSpecs.powerKw).toBe(vehicle.specs?.motor?.peakPowerKw);
      expect(d.quickSpecs.torqueNm).toBe(vehicle.specs?.motor?.peakTorqueNm);
    }
  });

  it("never derives a DC fast-charge time from AC charging hours", () => {
    for (const vehicle of vehicles) {
      const d = detailOf(vehicle);
      expect(d.quickSpecs.fastChargeMinutes).toBe(vehicle.chargingTimeFastMin);
      expect(d.charging.dcFastChargeMinutes).toBe(vehicle.chargingTimeFastMin);
    }
  });

  it("never asserts a battery chemistry that wasn't researched", () => {
    for (const vehicle of vehicles) {
      expect(detailOf(vehicle).battery.chemistry).toBe(vehicle.specs?.batteryChemistry);
    }
  });

  it("never fills warranty, boot space, drive layout or connector from a category default", () => {
    for (const vehicle of withoutSpecs) {
      const d = detailOf(vehicle);
      expect(d.quickSpecs.warrantyYears, `${vehicle.slug} warranty years`).toBeUndefined();
      expect(d.quickSpecs.warrantyKm, `${vehicle.slug} warranty km`).toBeUndefined();
      expect(d.bodySpecs.bootSpaceLiters, `${vehicle.slug} boot`).toBeUndefined();
      expect(d.bodySpecs.driveType, `${vehicle.slug} drive`).toBeUndefined();
      expect(d.charging.connectorType, `${vehicle.slug} connector`).toBeUndefined();
      expect(d.bodySpecs.connectedCar, `${vehicle.slug} connected car`).toBeUndefined();
    }
  });

  it("passes through only real seating capacity", () => {
    for (const vehicle of vehicles) {
      const d = detailOf(vehicle);
      if (vehicle.seatingCapacity) {
        expect(d.bodySpecs.seatingCapacity).toBe(`${vehicle.seatingCapacity} Seater`);
      } else {
        expect(d.bodySpecs.seatingCapacity).toBeUndefined();
      }
    }
  });
});

describe("ownership tools", () => {
  it("does not ship a price-history tool", () => {
    // It reported `currentPrice × 1.012` as the price three months ago. There
    // is no price-history source in this project; don't reintroduce it
    // without one.
    for (const vehicle of vehicles.slice(0, 20)) {
      const ids = detailOf(vehicle).ownershipTools.map((t) => t.id);
      expect(ids).not.toContain("price-history");
    }
  });

  it("discloses the assumptions behind every calculator it does ship", () => {
    // These two survive because they're calculators, not specs — which is
    // only defensible while the summary states the inputs used.
    const d = detailOf(vehicles[0]);
    const running = d.ownershipTools.find((t) => t.id === "running-cost");
    const charging = d.ownershipTools.find((t) => t.id === "charging-cost");

    expect(running?.summary).toMatch(/km\/day/);
    expect(running?.summary).toMatch(/₹\d+\/unit/);
    expect(charging?.summary).toMatch(/₹\d+\/unit/);
  });
});

describe("real-world range", () => {
  it("publishes the derating factors it used", () => {
    // The UI renders these as "Est. 80% of claim". Without them the modeled
    // figures read as measurements.
    const d = detailOf(vehicles[0]);
    expect(d.realWorldRange.factors.city).toBeGreaterThan(0);
    expect(d.realWorldRange.factors.highway).toBeGreaterThan(0);
    expect(d.realWorldRange.factors.mixed).toBeGreaterThan(0);
  });

  it("derates below the claimed figure, with highway worst", () => {
    const d = detailOf(vehicles[0]);
    expect(d.realWorldRange.araiKm).toBe(vehicles[0].rangeKm);
    expect(d.realWorldRange.cityKm).toBeLessThan(d.realWorldRange.araiKm);
    expect(d.realWorldRange.highwayKm).toBeLessThan(d.realWorldRange.cityKm);
  });

  it("keeps the factors round, not falsely precise", () => {
    // 0.686 implied a researched measurement that never existed.
    const { factors } = detailOf(vehicles[0]).realWorldRange;
    for (const factor of Object.values(factors)) {
      expect(Math.round(factor * 100) / 100).toBe(factor);
    }
  });
});

describe("FAQs (emitted as schema.org FAQPage)", () => {
  it("never quotes a fast-charging time the manufacturer hasn't published", () => {
    // A fabricated figure here is fed to search engines as a structured claim.
    for (const vehicle of vehicles.filter((v) => !v.chargingTimeFastMin)) {
      const chargingFaq = detailOf(vehicle).faqs.find((f) => f.question.includes("charge"));
      expect(chargingFaq?.answer, vehicle.slug).toMatch(/has not published a DC fast-charging time/);
    }
  });

  it("quotes the real figure when one exists", () => {
    const vehicle = vehicles.find((v) => v.chargingTimeFastMin);
    expect(vehicle).toBeDefined();
    const chargingFaq = detailOf(vehicle!).faqs.find((f) => f.question.includes("charge"));
    expect(chargingFaq?.answer).toContain(`${vehicle!.chargingTimeFastMin} minutes`);
  });

  it("only ever states the manufacturer's own claimed range", () => {
    for (const vehicle of vehicles.slice(0, 30)) {
      const rangeFaq = detailOf(vehicle).faqs.find((f) => f.question.includes("range"));
      expect(rangeFaq?.answer).toContain(`${vehicle.rangeKm} km`);
    }
  });
});
