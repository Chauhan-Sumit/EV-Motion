import { Crown } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import type { SpecRow } from "@/lib/compare/metrics";
import type { WinnerMetric } from "@/lib/compare/winnerEngine";
import { computeWinners } from "@/lib/compare/winnerEngine";

interface SpecTableProps {
  vehicles: VehicleDetail[];
  rows: SpecRow[];
  /** Scoreable subset matching some of `rows`' keys — omit for a table with no meaningful winner (e.g. Colours). */
  winnerMetrics?: WinnerMetric<VehicleDetail>[];
}

/** Shared, winner-aware spec table — used by every data-backed Compare section. */
export function SpecTable({ vehicles, rows, winnerMetrics = [] }: SpecTableProps) {
  const winnerByKey = new Map(computeWinners(vehicles, winnerMetrics).metricResults.map((r) => [r.key, r]));

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[480px] border-collapse text-left">
        <caption className="sr-only">Specification comparison of {vehicles.map((v) => v.name).join(", ")}</caption>
        <thead>
          <tr className="border-b border-border bg-surface-secondary">
            <th scope="col" className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
              Specification
            </th>
            {vehicles.map((v) => (
              <th key={v.slug} scope="col" className="px-3.5 py-2.5 text-center text-[11.5px] font-bold text-ink">
                {v.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const result = winnerByKey.get(row.key);
            return (
              <tr key={row.key} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-3.5 py-3 text-[11.5px] font-semibold text-ink-secondary">
                  {row.label}
                </th>
                {vehicles.map((v, i) => {
                  const isWinner = result?.state === "winner" && result.winnerIndex === i;
                  return (
                    <td
                      key={v.slug}
                      className={`px-3.5 py-3 text-center text-[12px] ${isWinner ? "bg-primary-tint font-bold text-primary" : "text-ink"}`}
                    >
                      <span className="inline-flex items-center justify-center gap-1">
                        {isWinner ? <Crown size={12} className="text-primary" aria-hidden="true" /> : null}
                        {row.render(v)}
                        {isWinner ? <span className="sr-only">(winner)</span> : null}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
