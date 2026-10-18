"use client";

import { METRICS, rank, type MetricKey } from "@/lib/compare/showroom/metrics";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { BestCheck, Dot, NotPublished } from "./ui";

/** One metric across every compared vehicle: name, proportional bar, value. */
export function MetricRow({ metricKey }: { metricKey: MetricKey }) {
  const { vehicles, settings } = useShowroom();
  const m = METRICS[metricKey];
  const r = rank(metricKey, vehicles, settings);
  const ranked = r.state === "winner" || r.state === "tie";
  const scaleMax = m.scaleMax ?? Math.max(r.max ?? 1, 1);
  const hint = m.note ?? (m.better === "lower" && !m.scaleMax ? "Lower is better" : "");
  const status = r.state === "level" ? "Level" : r.state === "insufficient-data" ? "Not ranked" : "";

  return (
    <div className="border-b border-border pb-3.5 pt-4">
      <div className="mb-2 flex items-baseline justify-between gap-2.5">
        <b className="text-[15px] font-semibold">{m.label}</b>
        <span className="text-right text-xs text-ink-muted">{[status, hint].filter(Boolean).join(" · ")}</span>
      </div>
      {vehicles.map((v, i) => {
        const x = r.values[i];
        const isBest = r.best.includes(i);
        // An unranked row keeps its bars only when the values are comparable
        // and merely equal — a bar is a ranking too (CLAUDE.md #29).
        const showBar = x !== null && r.state !== "insufficient-data";
        return (
          <div key={v.detail.slug} className="grid grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-2 py-[3px] text-[12.5px] md:grid-cols-[118px_minmax(0,1fr)_128px] md:gap-3 md:text-[13.5px]">
            <span className={cn("flex items-center gap-[7px] overflow-hidden text-ellipsis whitespace-nowrap text-ink-muted", isBest && "font-semibold text-ink")}>
              <Dot color={v.color} />
              <span className="truncate">{v.detail.name}</span>
            </span>
            <span className="relative h-2 overflow-hidden rounded bg-border">
              {showBar ? (
                <i
                  className="absolute inset-y-0 left-0 rounded transition-[width] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
                  style={{ width: `${((x as number) / scaleMax) * 100}%`, background: v.color.base, opacity: isBest || !ranked ? 1 : 0.35 }}
                />
              ) : null}
            </span>
            <span className={cn("flex items-center justify-end gap-1.5 whitespace-nowrap tabular-nums text-ink-muted", isBest && "font-bold text-ink")}>
              {x === null ? m.missing ? <span className="italic">{m.missing}</span> : <NotPublished /> : m.format(x, v)}
              {isBest ? <BestCheck /> : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function MetricRows({ keys }: { keys: MetricKey[] }) {
  return (
    <div className="flex flex-col border-t border-border">
      {keys.map((k) => (
        <MetricRow key={k} metricKey={k} />
      ))}
    </div>
  );
}
