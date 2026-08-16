import type { VehicleDetail } from "@/types/vehicle-detail";
import { computeWinners } from "./winnerEngine";
import { WINNER_METRICS } from "./metrics";

export interface QuickVerdictItem {
  key: string;
  label: string;
  vehicleIndex: number;
  vehicleName: string;
}

/**
 * Picks a single best index from an arbitrary value array using the same
 * "needs >=2 known values, no ties" rule as winnerEngine.computeWinners —
 * duplicated here (rather than forcing every candidate through a
 * WinnerMetric<VehicleDetail>) because a few Quick Verdict badges score on
 * values that don't exist as a single vehicle-level number (e.g. running
 * cost is computed per-city by the caller, family score blends two fields).
 */
function pickWinnerIndex(values: (number | null)[], direction: "higher-better" | "lower-better"): number | null {
  const known = values.map((v, i) => (v !== null ? i : -1)).filter((i) => i !== -1);
  if (known.length < 2) return null;

  let bestIndex = known[0];
  let bestValue = values[bestIndex] as number;
  let tieCount = 1;
  for (const i of known.slice(1)) {
    const v = values[i] as number;
    const better = direction === "lower-better" ? v < bestValue : v > bestValue;
    if (better) {
      bestIndex = i;
      bestValue = v;
      tieCount = 1;
    } else if (v === bestValue) {
      tieCount += 1;
    }
  }
  return tieCount > 1 ? null : bestIndex;
}

function seatCount(v: VehicleDetail): number | null {
  const match = v.bodySpecs.seatingCapacity?.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Seats and boot space combined into one sortable score. Returns null unless
 * *both* are real: boot space used to come from a per-body-type lookup, so
 * every SUV scored identically and the badge was really only ranking seats.
 */
function familyScore(v: VehicleDetail): number | null {
  const seats = seatCount(v);
  const boot = v.bodySpecs.bootSpaceLiters;
  if (seats === null || boot === undefined) return null;
  return seats * 1000 + boot;
}

/**
 * "Instant takeaway" badges shown before the detailed comparison — every
 * entry is computed from real, already-displayed fields (never invented),
 * and a badge is simply omitted when there aren't >=2 known values to
 * compare (same honesty threshold the rest of the winner engine uses).
 * `annualRunningCost` is supplied by the caller because it's city-aware
 * (depends on LocationContext), unlike everything else here.
 */
export function computeQuickVerdict(vehicles: VehicleDetail[], annualRunningCost: number[]): QuickVerdictItem[] {
  if (vehicles.length < 2) return [];

  function push(key: string, label: string, values: (number | null)[], direction: "higher-better" | "lower-better"): QuickVerdictItem | null {
    const winnerIndex = pickWinnerIndex(values, direction);
    if (winnerIndex === null) return null;
    return { key, label, vehicleIndex: winnerIndex, vehicleName: vehicles[winnerIndex].name };
  }

  const items: (QuickVerdictItem | null)[] = [];

  items.push(
    push(
      "value",
      "Best Value",
      vehicles.map((v) => (v.startingPrice > 0 ? v.quickSpecs.rangeKm / (v.startingPrice / 100000) : null)),
      "higher-better",
    ),
  );

  items.push(push("range", "Longest Range", vehicles.map((v) => v.quickSpecs.rangeKm), "higher-better"));

  items.push(push("charging", "Fastest Charging", vehicles.map((v) => v.quickSpecs.fastChargeMinutes ?? null), "lower-better"));

  items.push(push("runningCost", "Lowest Running Cost", annualRunningCost, "lower-better"));

  items.push(push("family", "Best Family EV", vehicles.map(familyScore), "higher-better"));

  const powerMetric = WINNER_METRICS.find((m) => m.key === "power")!;
  const powerResult = computeWinners(vehicles, [powerMetric]).metricResults[0];
  items.push(
    powerResult.state === "winner" && powerResult.winnerIndex !== null
      ? { key: "performance", label: "Best Performance", vehicleIndex: powerResult.winnerIndex, vehicleName: vehicles[powerResult.winnerIndex].name }
      : null,
  );

  const { categoriesWon } = computeWinners(vehicles, WINNER_METRICS);
  const maxWon = Math.max(...categoriesWon);
  const leaders = categoriesWon.map((n, i) => (n === maxWon ? i : -1)).filter((i) => i !== -1);
  items.push(
    maxWon > 0 && leaders.length === 1
      ? { key: "editorsPick", label: "Editor's Pick", vehicleIndex: leaders[0], vehicleName: vehicles[leaders[0]].name }
      : null,
  );

  return items.filter((i): i is QuickVerdictItem => i !== null);
}
