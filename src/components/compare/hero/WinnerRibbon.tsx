import { Trophy } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { WINNER_METRICS } from "@/lib/compare/metrics";

/** "🏆 X wins N categories" banner below the hero — computed live from real fields, never asserted. */
export function WinnerRibbon({ vehicles }: { vehicles: VehicleDetail[] }) {
  if (vehicles.length < 2) return null;

  const { categoriesWon } = computeWinners(vehicles, WINNER_METRICS);
  const maxWon = Math.max(...categoriesWon);
  const leaderIndex = categoriesWon.findIndex((n) => n === maxWon);
  const leaderCount = categoriesWon.filter((n) => n === maxWon).length;

  if (maxWon === 0) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-secondary px-4 py-3 text-center text-[12.5px] font-semibold text-ink-secondary">
        Too close to call — no vehicle leads on the compared categories yet.
      </div>
    );
  }

  if (leaderCount > 1) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary-tint px-4 py-3 text-center text-[12.5px] font-semibold text-primary">
        <Trophy size={15} />
        It&apos;s a tie — {leaderCount} vehicles each win {maxWon} categories
      </div>
    );
  }

  const winner = vehicles[leaderIndex];

  return (
    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary-tint px-4 py-3 text-center text-[13px] font-bold text-primary">
      <Trophy size={16} />
      {winner.name} wins {maxWon} {maxWon === 1 ? "category" : "categories"}
    </div>
  );
}
