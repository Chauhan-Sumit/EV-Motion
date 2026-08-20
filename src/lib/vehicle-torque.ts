import type { TorqueMeasurementPoint, VehicleCategory, VehicleSpecs } from "@/types/vehicle";

/**
 * The one place that decides whether two torque figures may be compared.
 *
 * Background (CLAUDE.md #28(b2), HANDOFF.md sub-batch 7): hub-motor scooters
 * publish torque at the WHEEL, mid-drive scooters publish it at the motor
 * SHAFT before the belt multiplies it. TVS quotes 140 Nm for the iQube;
 * Ather quotes 26 Nm for the 450X. Dropping both into one Compare row crowns
 * the iQube by roughly five times on a difference that is purely definitional
 * — structurally the same failure as the width-with-mirrors trap in #28(b).
 *
 * This module refuses the comparison instead of converting between the two.
 * A conversion would need the belt/gear reduction ratio, which no OEM here
 * publishes; inventing one would be exactly the kind of derived-but-displayed
 * figure the 2026-08-16 hardening pass removed site-wide (CLAUDE.md #22).
 *
 * Data-free by construction (types only), so it is safe to import from a
 * `"use client"` component — CLAUDE.md #23.
 */

/** The fields needed to resolve a measurement point. A full `Vehicle` satisfies this structurally. */
export interface TorqueSubject {
  category: VehicleCategory;
  specs?: VehicleSpecs;
}

/**
 * Category defaults, applied only where the convention is genuinely
 * unambiguous:
 *
 * - `car` / `commercial` — a car's published torque is always its motor's
 *   output. No hub-motor car exists in this catalogue, and the field would
 *   otherwise have to be hand-written onto all 41 car records to say the only
 *   thing it could say.
 * - `2-wheeler` — deliberately absent. Both conventions are in live use in
 *   this segment, which is the whole reason this module exists, so an
 *   unannotated two-wheeler torque figure is UNKNOWN rather than assumed.
 */
const CATEGORY_DEFAULT: Partial<Record<VehicleCategory, TorqueMeasurementPoint>> = {
  car: "shaft",
  commercial: "shaft",
};

/**
 * Where this vehicle's `peakTorqueNm` was measured, or `undefined` when that
 * has not been established. An explicit `torqueMeasuredAt` always wins over
 * the category default.
 */
export function torqueMeasurementPointFor(subject: TorqueSubject): TorqueMeasurementPoint | undefined {
  return subject.specs?.motor?.torqueMeasuredAt ?? CATEGORY_DEFAULT[subject.category];
}

/** Short label for the measurement point — shown beside a torque value so a reader can see why two numbers aren't being ranked against each other. */
export const TORQUE_POINT_LABEL: Record<TorqueMeasurementPoint, string> = {
  shaft: "at motor",
  wheel: "at wheel",
};

/**
 * True when every compared vehicle that publishes a torque figure measured it
 * the same, KNOWN way — the precondition for ranking those figures against
 * each other.
 *
 * Returns false as soon as one contributing vehicle's measurement point is
 * unknown. That is intentional and conservative: "we don't know" and "we know
 * it differs" both make a winner meaningless, and treating unknown as
 * comparable is precisely how `tvs-iqube`'s 140 Nm shipped into a live
 * Compare row against Ather's 26 Nm.
 *
 * Vehicles with no torque figure at all don't participate — they neither
 * block the comparison nor contribute to it, matching the winner engine's
 * treatment of any other absent value.
 */
export function isTorqueComparable(subjects: TorqueSubject[]): boolean {
  const points = new Set<TorqueMeasurementPoint | undefined>();

  for (const subject of subjects) {
    if (subject.specs?.motor?.peakTorqueNm === undefined) continue;
    points.add(torqueMeasurementPointFor(subject));
  }

  if (points.has(undefined)) return false;
  return points.size <= 1;
}
