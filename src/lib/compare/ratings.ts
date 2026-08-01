import type { VehicleDetail } from "@/types/vehicle-detail";
import { onRoadPriceBreakdown, estimateMonthlyChargingCost } from "@/lib/pricing";
import { chargesForState } from "@/lib/data/state-charges";
import { DEFAULT_CITY } from "@/lib/data/cities";

export interface VehicleRatings {
  overall: number | null;
  performance: number | null;
  charging: number | null;
  comfort: number | null;
  technology: number | null;
  safety: number | null;
  value: number | null;
  ownership: number | null;
}

/**
 * 0-10 scores computed RELATIVE to the vehicles actually being compared —
 * not an absolute universal rating (this dataset has no basis for one).
 * Comfort and Technology are always null: no feature-checklist or comfort
 * data exists anywhere in the schema to derive them from honestly, so they
 * render "Not enough data" for every vehicle rather than a guessed number —
 * same honest-empty-state precedent as Reviews/News.
 */
function normalize(values: (number | null)[], direction: "higher-better" | "lower-better"): (number | null)[] {
  const known = values.filter((v): v is number => v !== null);
  if (known.length === 0) return values.map(() => null);
  const min = Math.min(...known);
  const max = Math.max(...known);
  return values.map((v) => {
    if (v === null) return null;
    if (max === min) return 8;
    const ratio = direction === "higher-better" ? (v - min) / (max - min) : (max - v) / (max - min);
    return Math.round(ratio * 100) / 10;
  });
}

function average(scores: (number | null)[]): number | null {
  const known = scores.filter((s): s is number => s !== null);
  if (known.length === 0) return null;
  return Math.round((known.reduce((sum, s) => sum + s, 0) / known.length) * 10) / 10;
}

export function computeRatings(vehicles: VehicleDetail[]): VehicleRatings[] {
  const topSpeed = normalize(vehicles.map((v) => v.sourceVehicle.topSpeedKmph), "higher-better");
  const acceleration = normalize(vehicles.map((v) => v.sourceVehicle.accelerationSec0To100 ?? null), "lower-better");
  const power = normalize(vehicles.map((v) => v.sourceVehicle.specs?.motor?.peakPowerKw ?? null), "higher-better");
  const torque = normalize(vehicles.map((v) => v.sourceVehicle.specs?.motor?.peakTorqueNm ?? null), "higher-better");
  const performance = vehicles.map((_, i) => average([topSpeed[i], acceleration[i], power[i], torque[i]]));

  const fastCharge = normalize(vehicles.map((v) => v.quickSpecs.fastChargeMinutes), "lower-better");
  const acCharge = normalize(vehicles.map((v) => v.charging.acHomeChargeHours), "lower-better");
  const charging = vehicles.map((_, i) => average([fastCharge[i], acCharge[i]]));

  const pricePerKm = normalize(vehicles.map((v) => v.startingPrice / v.quickSpecs.rangeKm), "lower-better");
  const value = pricePerKm;

  const charges = chargesForState(DEFAULT_CITY.state);
  const fiveYearCost = vehicles.map((v) => {
    const onRoad = onRoadPriceBreakdown(v.startingPrice, charges).onRoad;
    const annualCharging = estimateMonthlyChargingCost(v.sourceVehicle) * 12;
    return onRoad + annualCharging * 5;
  });
  const ownership = normalize(fiveYearCost, "lower-better");

  const safety = normalize(vehicles.map((v) => v.sourceVehicle.specs?.safety?.ncapRating ?? null), "higher-better");

  return vehicles.map((_, i) => ({
    performance: performance[i],
    charging: charging[i],
    comfort: null,
    technology: null,
    safety: safety[i],
    value: value[i],
    ownership: ownership[i],
    overall: average([performance[i], charging[i], safety[i], value[i], ownership[i]]),
  }));
}
