import type { VehicleDetail } from "@/types/vehicle-detail";
import { computeRatings } from "./ratings";

export interface SmartTag {
  label: string;
  vehicleIndex: number;
}

function indexOfMax(values: (number | null)[]): number {
  let bestIndex = -1;
  let bestValue = -Infinity;
  values.forEach((v, i) => {
    if (v !== null && v > bestValue) {
      bestValue = v;
      bestIndex = i;
    }
  });
  return bestIndex;
}

/** Highlight tags — each only assigned when the underlying data actually exists (no forced pick when a metric is genuinely unavailable). */
export function computeSmartTags(vehicles: VehicleDetail[]): SmartTag[] {
  const tags: SmartTag[] = [];
  const ratings = computeRatings(vehicles);

  const bestValue = indexOfMax(ratings.map((r) => r.value));
  if (bestValue !== -1) tags.push({ label: "Best Value", vehicleIndex: bestValue });

  const bestRange = indexOfMax(vehicles.map((v) => v.quickSpecs.rangeKm));
  if (bestRange !== -1) tags.push({ label: "Best Range", vehicleIndex: bestRange });

  const bestPerformance = indexOfMax(ratings.map((r) => r.performance));
  if (bestPerformance !== -1) tags.push({ label: "Best Performance", vehicleIndex: bestPerformance });

  if (vehicles[0].category === "car") {
    const bestFamily = indexOfMax(vehicles.map((v) => v.sourceVehicle.seatingCapacity ?? null));
    if (bestFamily !== -1) tags.push({ label: "Best Family EV", vehicleIndex: bestFamily });
  }

  const bestCity = indexOfMax(vehicles.map((v) => v.sourceVehicle.specs?.dimensions?.turningRadiusM ?? null).map((v) => (v === null ? null : -v)));
  if (bestCity !== -1) tags.push({ label: "Best City EV", vehicleIndex: bestCity });

  const bestHighway = indexOfMax(vehicles.map((v) => v.sourceVehicle.topSpeedKmph));
  if (bestHighway !== -1) tags.push({ label: "Best Highway EV", vehicleIndex: bestHighway });

  const bestPremium = indexOfMax(vehicles.map((v) => v.startingPrice));
  if (bestPremium !== -1 && vehicles.length > 1) tags.push({ label: "Best Premium EV", vehicleIndex: bestPremium });

  return tags;
}
