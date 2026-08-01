import type { VehicleDetail } from "@/types/vehicle-detail";
import { computeWinners } from "./winnerEngine";
import { WINNER_METRICS, rowLabelForKey } from "./metrics";

/**
 * Templated, neutral "who should buy this" copy — generated entirely from
 * the winner engine's real computed results and a starting-price comparison,
 * never a subjective editorial opinion about ride quality, brand reputation,
 * etc. that this dataset has no basis for.
 */
export function computeExpertVerdicts(vehicles: VehicleDetail[]): string[] {
  const { metricResults } = computeWinners(vehicles, WINNER_METRICS);
  const winsByVehicle: string[][] = vehicles.map(() => []);
  for (const r of metricResults) {
    if (r.state === "winner" && r.winnerIndex !== null) {
      winsByVehicle[r.winnerIndex].push(rowLabelForKey(r.key).toLowerCase());
    }
  }

  const cheapestIndex = vehicles.reduce(
    (best, v, i, arr) => (v.startingPrice < arr[best].startingPrice ? i : best),
    0,
  );

  return vehicles.map((v, i) => {
    const wins = winsByVehicle[i];
    const sentences: string[] = [];

    if (wins.length > 0) {
      sentences.push(`The ${v.name} leads on ${wins.slice(0, 3).join(", ")}.`);
    } else {
      sentences.push(
        `The ${v.name} doesn't lead on any directly measured category here, but may still suit buyers who value its brand, styling, or a feature not covered in this comparison.`,
      );
    }

    if (i === cheapestIndex && vehicles.length > 1) {
      sentences.push("It also has the lowest starting price among the vehicles compared.");
    }

    sentences.push(
      `Best suited for buyers who prioritize ${wins.length > 0 ? wins[0] : "value for money"} over the alternatives here.`,
    );

    return sentences.join(" ");
  });
}
