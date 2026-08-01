import type { VehicleDetail } from "@/types/vehicle-detail";
import { computeWinners } from "./winnerEngine";
import { WINNER_METRICS, rowLabelForKey } from "./metrics";

export interface ProsConsResult {
  pros: string[];
  cons: string[];
}

/**
 * Pros = real curated `highlights` (already-researched copy, not generated).
 * Cons = computed, factual losses from the winner engine ("Lower range than
 * the Nexon EV") — never an invented subjective claim about interior
 * quality, ride comfort, etc. A vehicle with no data for a metric isn't
 * penalized with a "con" for it (that would misrepresent a data gap as a
 * weakness).
 */
export function computeProsAndCons(vehicles: VehicleDetail[]): ProsConsResult[] {
  const { metricResults } = computeWinners(vehicles, WINNER_METRICS);

  return vehicles.map((_, i) => {
    const cons: string[] = [];
    for (const result of metricResults) {
      if (result.state !== "winner" || result.winnerIndex === i) continue;
      if (result.values[i] === null) continue;
      const metric = WINNER_METRICS.find((m) => m.key === result.key);
      if (!metric) continue;
      const winnerName = vehicles[result.winnerIndex as number].name;
      const noun = rowLabelForKey(result.key);
      if (metric.direction === "boolean-better") {
        cons.push(`No ${noun} (available on the ${winnerName})`);
      } else if (metric.direction === "higher-better") {
        cons.push(`Lower ${noun.toLowerCase()} than the ${winnerName}`);
      } else {
        cons.push(`Higher ${noun.toLowerCase()} than the ${winnerName}`);
      }
    }
    return {
      pros: vehicles[i].sourceVehicle.highlights.slice(0, 4),
      cons: cons.slice(0, 4),
    };
  });
}
