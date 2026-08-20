import { Crown } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import type { SpecRow } from "@/lib/compare/metrics";
import { NOT_SPECIFIED } from "@/lib/compare/metrics";
import type { WinnerMetric } from "@/lib/compare/winnerEngine";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { UnavailableValue } from "@/components/common/UnavailableValue";
import { UnavailableRowsToggle } from "./UnavailableRowsToggle";

interface SpecTableProps {
  vehicles: VehicleDetail[];
  rows: SpecRow[];
  /** Scoreable subset matching some of `rows`' keys — omit for a table with no meaningful winner (e.g. Colours). */
  winnerMetrics?: WinnerMetric<VehicleDetail>[];
}

function SpecBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.max(6, Math.round((value / max) * 100))) : 0;
  return (
    <span className="mx-auto mt-1 block h-1.5 w-full max-w-[92px] overflow-hidden rounded-full bg-surface-secondary" aria-hidden="true">
      <span className="block h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
    </span>
  );
}

function Row({
  row,
  vehicles,
  winnerByKey,
  index,
}: {
  row: SpecRow;
  vehicles: VehicleDetail[];
  winnerByKey: Map<string, { state: string; winnerIndex: number | null }>;
  index: number;
}) {
  const result = winnerByKey.get(row.key);
  // A proportional bar IS a ranking — 140 Nm drawn seven times longer than
  // 20 Nm says "this one wins" just as loudly as the crown does. So a row
  // whose values aren't measured the same way (see `SpecRow.comparable`)
  // shows the numbers and drops the bars, matching the winner engine's
  // refusal to name a winner for it.
  const comparable = row.comparable ? row.comparable(vehicles) : true;
  const barValues = row.barValue && comparable ? vehicles.map((v) => row.barValue!(v)) : null;
  const maxBar = barValues ? Math.max(...barValues.filter((v): v is number => v !== null)) : 0;

  return (
    <tr className={`border-b border-border last:border-b-0 transition-colors hover:bg-primary-tint/15 ${index % 2 === 1 ? "bg-surface-secondary/40" : ""}`}>
      <th scope="row" className="px-3.5 py-3 text-[11.5px] font-semibold text-ink-secondary">
        {row.label}
      </th>
      {vehicles.map((v, i) => {
        const value = row.render(v);
        const isWinner = result?.state === "winner" && result.winnerIndex === i;
        const isUnavailable = value === NOT_SPECIFIED;
        const barValue = barValues?.[i] ?? null;

        return (
          <td
            key={v.slug}
            className={`px-3.5 py-3 text-center text-[12px] ${
              isWinner ? "rounded-md bg-primary-tint font-bold text-primary ring-1 ring-inset ring-primary/20" : "text-ink"
            }`}
          >
            {isUnavailable ? (
              <UnavailableValue />
            ) : (
              <>
                <span className="inline-flex items-center justify-center gap-1">
                  {isWinner ? <Crown size={12} className="text-primary" aria-hidden="true" /> : null}
                  {value}
                  {isWinner ? <span className="sr-only">(winner)</span> : null}
                </span>
                {barValue !== null ? <SpecBar value={barValue} max={maxBar} /> : null}
              </>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function SpecTableInner({
  vehicles,
  rows,
  winnerByKey,
}: {
  vehicles: VehicleDetail[];
  rows: SpecRow[];
  winnerByKey: Map<string, { state: string; winnerIndex: number | null }>;
}) {
  return (
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
        {rows.map((row, i) => (
          <Row key={row.key} row={row} vehicles={vehicles} winnerByKey={winnerByKey} index={i} />
        ))}
      </tbody>
    </table>
  );
}

/**
 * Shared, winner-aware spec table — used by every data-backed Compare
 * section. Deliberately stays a Server Component: SpecRow's `render`/
 * `barValue` are functions, and Next.js's RSC boundary rejects passing
 * functions as props into a Client Component, so the one interactive bit
 * (the "show unavailable specifications" toggle) is isolated in its own
 * client child (UnavailableRowsToggle) that receives pre-rendered JSX, not
 * the row objects themselves.
 */
export function SpecTable({ vehicles, rows, winnerMetrics = [] }: SpecTableProps) {
  const winnerByKey = new Map(computeWinners(vehicles, winnerMetrics).metricResults.map((r) => [r.key, r]));

  const visibleRows: SpecRow[] = [];
  const unavailableRows: SpecRow[] = [];
  for (const row of rows) {
    const allUnknown = vehicles.every((v) => row.render(v) === NOT_SPECIFIED);
    (allUnknown ? unavailableRows : visibleRows).push(row);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {visibleRows.length > 0 ? (
        <div className="overflow-x-auto">
          <SpecTableInner vehicles={vehicles} rows={visibleRows} winnerByKey={winnerByKey} />
        </div>
      ) : null}

      {unavailableRows.length > 0 ? (
        <UnavailableRowsToggle count={unavailableRows.length} bare={visibleRows.length === 0}>
          <SpecTableInner vehicles={vehicles} rows={unavailableRows} winnerByKey={winnerByKey} />
        </UnavailableRowsToggle>
      ) : null}
    </div>
  );
}
