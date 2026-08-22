import type { BatteryMeasurementBasis } from "@/types/vehicle";

/**
 * The one place that decides whether two battery figures may be compared.
 *
 * Background (BATTERY_CONVENTION_SURVEY.md): a published kWh figure is either
 * the total installed pack ("gross") or what is left after the manufacturer's
 * protective buffer ("usable"), and this catalogue contains both. `bmw-ix`
 * records 105.2 — BMW India's *usable* figure for a 111.5 kWh pack — while
 * `bmw-i4` beside it records 83.9, BMW's *gross* figure for a pack whose
 * usable capacity is 81.3. Ranking those two directly costs the iX 6.3 kWh on
 * a difference that is purely definitional, exactly like the hub-vs-shaft
 * torque trap in `vehicle-torque.ts`.
 *
 * This module refuses the comparison rather than converting between the two.
 * A conversion needs the buffer size, which most OEMs here never publish;
 * inventing one would be precisely the derived-but-displayed figure the
 * 2026-08-16 hardening pass removed site-wide (CLAUDE.md #22).
 *
 * **There is deliberately no category default**, and that is the difference
 * from `vehicle-torque.ts`. Torque can default a car to "shaft" because no
 * hub-motor car exists, so the convention is genuinely unambiguous. No
 * equivalent exists here: BMW and BYD are each split *inside their own
 * line-ups*, Mercedes-Benz publishes usable capacity only, and no Indian
 * two-wheeler OEM publishes a usable figure at all. An unstamped vehicle is
 * UNKNOWN, never assumed.
 *
 * Data-free by construction (types only), so it is safe to import from a
 * `"use client"` component — CLAUDE.md #23.
 */

/** The field needed to resolve a measurement basis. A full `Vehicle` satisfies this structurally. */
export interface BatterySubject {
  batteryMeasuredAt?: BatteryMeasurementBasis;
}

/** Short label shown beside a capacity figure so a reader can see why two numbers aren't being ranked against each other. */
export const BATTERY_BASIS_LABEL: Record<BatteryMeasurementBasis, string> = {
  gross: "gross",
  usable: "usable",
};

/**
 * The basis for this vehicle's `batteryCapacityKwh`, or `undefined` when no
 * source established it. There is no fallback by design — see the module
 * comment.
 */
export function batteryBasisFor(subject: BatterySubject): BatteryMeasurementBasis | undefined {
  return subject.batteryMeasuredAt;
}

/**
 * True when every compared vehicle states the same, KNOWN basis — the
 * precondition for ranking their capacities against each other.
 *
 * Returns false as soon as one vehicle's basis is unknown. That is
 * intentional and conservative: "we don't know" and "we know it differs" both
 * make a winner meaningless.
 *
 * Note the difference from `isTorqueComparable`: torque skips vehicles with
 * no torque figure, so they neither block nor contribute. `batteryCapacityKwh`
 * is a required field, so **every** vehicle in the set participates and a
 * single unstamped one gates the whole comparison. That is why all 69
 * two-wheelers currently suppress this ranking — no Indian two-wheeler OEM
 * publishes a usable figure, so none of them can honestly be stamped.
 */
export function isBatteryComparable(subjects: BatterySubject[]): boolean {
  const bases = new Set<BatteryMeasurementBasis | undefined>();

  for (const subject of subjects) {
    bases.add(batteryBasisFor(subject));
  }

  if (bases.has(undefined)) return false;
  return bases.size <= 1;
}
