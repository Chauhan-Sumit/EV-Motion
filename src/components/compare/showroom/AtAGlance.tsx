"use client";

import type { ReactNode } from "react";
import { BatteryMedium, Gauge, IndianRupee, Luggage, ShieldCheck, Sun, Timer, Zap } from "lucide-react";
import { METRICS, rank, currentRatingLabel, type MetricKey } from "@/lib/compare/showroom/metrics";
import { batteryBasisFor, BATTERY_BASIS_LABEL } from "@/lib/vehicle-battery";
import { cn, formatPriceLakh } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { BestCheck, DISPLAY, Dot, Legend, NotPublished, Reveal, SECTION, SectionHeader } from "./ui";

const unit = (n: string, u: string) => (
  <>
    {n}
    <small className={cn("ml-1 text-[12.5px] font-medium tracking-normal text-ink-muted [font-family:var(--font-showroom-text)]")}>{u}</small>
  </>
);

const BIG: Partial<Record<MetricKey, (x: number) => ReactNode>> = {
  range: (x) => unit(Math.round(x).toLocaleString("en-IN"), "km"),
  onroad: (x) => {
    // Split the shared formatter's output so the unit can be set small.
    const [, amount, suffix] = formatPriceLakh(x / 100000).match(/^(.*?)(L|Cr)$/) ?? [];
    return unit(amount, suffix);
  },
  bat: (x) => unit(String(x), "kWh"),
  dc: (x) => unit(String(x), "min"),
  acc: (x) => unit(x.toFixed(1), "s"),
  kw: (x) => unit(String(x), "kW"),
  boot: (x) => unit(String(x), "L"),
};

const ICON: Partial<Record<MetricKey, ReactNode>> = {
  range: <Gauge className="size-5" strokeWidth={1.8} aria-hidden="true" />,
  onroad: <IndianRupee className="size-5" strokeWidth={1.8} aria-hidden="true" />,
  bat: <BatteryMedium className="size-5" strokeWidth={1.8} aria-hidden="true" />,
  dc: <Zap className="size-5" strokeWidth={1.8} aria-hidden="true" />,
  acc: <Timer className="size-5" strokeWidth={1.8} aria-hidden="true" />,
  kw: <Sun className="size-5" strokeWidth={1.8} aria-hidden="true" />,
  boot: <Luggage className="size-5" strokeWidth={1.8} aria-hidden="true" />,
  safety: <ShieldCheck className="size-5" strokeWidth={1.8} aria-hidden="true" />,
};

/** The big numbers, side by side. */
export function AtAGlance() {
  const { vehicles, settings, city } = useShowroom();
  const bases = new Set(vehicles.map((v) => batteryBasisFor(v.detail.sourceVehicle)));
  const basis = bases.size === 1 ? [...bases][0] : undefined;

  const tiles: [MetricKey, string, string?][] = [
    ["range", "Claimed range"],
    ["onroad", "On-road price", city.name],
    ["bat", "Battery", basis ? BATTERY_BASIS_LABEL[basis] : undefined],
    ["dc", "DC fast charge", "10–80%"],
    ["acc", "0–100 km/h", "lower is better"],
    ["kw", "Power"],
    ["boot", "Boot space"],
    ["safety", "Crash-test rating", "current only"],
  ];

  return (
    <section id="glance" aria-labelledby="glH" className={SECTION}>
      <SectionHeader id="glH" eyebrow="At a glance" title="The numbers, side by side." aside={<Legend vehicles={vehicles.map((v) => ({ name: v.detail.name, color: v.color }))} />} />
      <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 min-[68.75rem]:grid-cols-4">
        {tiles.map(([key, label, em]) => {
          const r = rank(key, vehicles, settings);
          return (
            <div key={key} className="flex flex-col gap-4 bg-surface px-6 py-[26px]">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-ink-secondary">
                <span className="text-ink">{ICON[key]}</span>
                {label}
                {em ? <em className="ml-auto text-[12.5px] font-normal not-italic text-ink-muted">{em}</em> : null}
              </div>
              <div className="flex flex-col gap-2.5">
                {vehicles.map((v, i) => {
                  const x = r.values[i];
                  const isBest = r.best.includes(i);
                  const lose = key === "safety" ? x === null : r.best.length > 0 && !isBest;
                  return (
                    <div key={v.detail.slug} className="flex items-baseline justify-between gap-2.5">
                      <span className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[12.5px] text-ink-muted">
                        <Dot color={v.color} />
                        <span className="truncate">{v.detail.name}</span>
                        {isBest ? <BestCheck /> : null}
                      </span>
                      {key === "safety" ? (
                        <b className={cn(DISPLAY, "text-[20px] font-bold font-stretch-[86%]", lose && "text-ink-muted/70")}>{currentRatingLabel(v.detail) ?? "Not rated"}</b>
                      ) : x === null ? (
                        <NotPublished />
                      ) : (
                        <b className={cn(DISPLAY, "text-[22px] font-bold leading-none tracking-[-.02em] tabular-nums font-stretch-[86%] md:text-[26px]", lose && "text-ink-muted/70")}>
                          {BIG[key]?.(x) ?? METRICS[key].format(x, v)}
                        </b>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
