import { Battery, Waypoints, Zap, Gauge, ChevronsUp, TimerReset, PlugZap, Activity, Crown, type LucideIcon } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { OVERVIEW_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const ICONS: Record<string, LucideIcon> = {
  battery: Battery,
  range: Waypoints,
  power: Zap,
  torque: Gauge,
  topSpeed: ChevronsUp,
  acceleration: TimerReset,
  fastCharge: PlugZap,
  efficiency: Activity,
};

/** Premium stat-card grid — large icon + label per metric, every compared vehicle's value listed underneath with the winner crowned. */
export function OverviewSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const { metricResults } = computeWinners(vehicles, WINNER_METRICS);
  const winnerByKey = new Map(metricResults.map((r) => [r.key, r]));

  return (
    <VehicleSection id="overview" title="Overview" description="Key numbers at a glance.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {OVERVIEW_SPEC_ROWS.map((row) => {
          const Icon = ICONS[row.key] ?? Zap;
          const result = winnerByKey.get(row.key);
          return (
            <div key={row.key} className="rounded-xl border border-border bg-surface p-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-tint text-primary">
                <Icon size={17} />
              </div>
              <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{row.label}</p>
              <ul className="mt-2 space-y-1.5">
                {vehicles.map((v, i) => {
                  const isWinner = result?.state === "winner" && result.winnerIndex === i;
                  return (
                    <li key={v.slug} className="flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] text-ink-muted">{v.brand}</span>
                      <span className={`flex shrink-0 items-center gap-1 text-[12px] font-bold ${isWinner ? "text-primary" : "text-ink"}`}>
                        {isWinner ? <Crown size={10} aria-hidden="true" /> : null}
                        {row.render(v)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </VehicleSection>
  );
}
