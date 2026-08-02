import type { VehicleDetail } from "@/types/vehicle-detail";
import type { City } from "@/lib/data/cities";
import { getVehiclePricingSnapshot, estimateMonthlyChargingCost } from "@/lib/vehicle-pricing";
import { formatPriceLakh } from "@/lib/utils";
import { computeWinners } from "@/lib/compare/winnerEngine";
import {
  BATTERY_SPEC_ROWS,
  CHARGING_SPEC_ROWS,
  DIMENSIONS_SPEC_ROWS,
  FEATURES_SPEC_ROWS,
  PERFORMANCE_SPEC_ROWS,
  WARRANTY_SPEC_ROWS,
  WINNER_METRICS,
  type SpecRow,
} from "@/lib/compare/metrics";
import type { ComparePdfInput, ComparePdfRowGroup } from "./generateComparePdf";

function rowsFor(vehicles: VehicleDetail[], specRows: SpecRow[]): ComparePdfRowGroup[] {
  return specRows.map((row) => ({ label: row.label, values: vehicles.map((v) => row.render(v)) }));
}

function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Glue between live Compare page data (VehicleDetail[], selected city) and the plain-data ComparePdfInput the PDF kit consumes — reuses the same SPEC_ROWS render() functions the web UI uses, and the same centralized `getVehiclePricingSnapshot` every other pricing widget calls, so the PDF can never drift from what's on screen. */
export function buildComparePdfInput(vehicles: VehicleDetail[], city: City, cityLabel: string): ComparePdfInput {
  const snapshots = vehicles.map((v) =>
    getVehiclePricingSnapshot({ vehicleId: v.id, vehicleName: v.name, exShowroomRangeLakh: v.priceRangeLakh, city }),
  );

  const priceRows: ComparePdfRowGroup[] = [
    { label: "Ex-showroom Price", values: snapshots.map((s) => formatPriceLakh(s.exShowroomRangeLakh[0])) },
    { label: "On-Road Price (est.)", values: snapshots.map((s) => formatINR(s.breakdown.low.onRoad)) },
  ];

  const ownershipRows: ComparePdfRowGroup[] = [
    { label: "Annual Charging Cost (est.)", values: vehicles.map((v) => formatINR(estimateMonthlyChargingCost(v.sourceVehicle) * 12)) },
    { label: "Annual Insurance (est.)", values: snapshots.map((s) => formatINR(s.breakdown.low.insurance)) },
  ];

  const { categoriesWon } = computeWinners(vehicles, WINNER_METRICS);
  const maxWon = Math.max(...categoriesWon);
  const tie = categoriesWon.filter((n) => n === maxWon).length > 1;
  const leaderIndex = categoriesWon.findIndex((n) => n === maxWon);
  const winnerSummary =
    maxWon === 0
      ? "No clear winner across the compared categories — too close to call."
      : tie
        ? `Tied — multiple vehicles each win ${maxWon} of ${WINNER_METRICS.length} categories.`
        : `${vehicles[leaderIndex].name} wins ${maxWon} of ${WINNER_METRICS.length} categories.`;

  return {
    vehicleNames: vehicles.map((v) => v.name),
    cityLabel,
    dateLabel: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    winnerSummary,
    sections: [
      { title: "Price Comparison", rows: priceRows },
      { title: "Battery & Charging", rows: [...rowsFor(vehicles, BATTERY_SPEC_ROWS), ...rowsFor(vehicles, CHARGING_SPEC_ROWS)] },
      { title: "Performance", rows: rowsFor(vehicles, PERFORMANCE_SPEC_ROWS) },
      { title: "Ownership Cost", rows: ownershipRows },
      { title: "Features", rows: rowsFor(vehicles, FEATURES_SPEC_ROWS) },
      { title: "Warranty", rows: rowsFor(vehicles, WARRANTY_SPEC_ROWS) },
      { title: "Dimensions", rows: rowsFor(vehicles, DIMENSIONS_SPEC_ROWS) },
    ],
  };
}
