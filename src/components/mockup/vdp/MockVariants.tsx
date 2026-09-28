"use client";

import { useState } from "react";
import { ArrowUpRight, BatteryCharging, Check, Gauge, Timer, TrendingUp } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, Metric, Pill, SectionHead } from "./Shell";
import { cn } from "@/lib/utils";

/**
 * MOCKUP variants section.
 *
 * Production renders variants as a four-column table, which is accurate and
 * completely flat. This replaces it with a selector: a rail of trims on the
 * left drives a detail panel on the right, and a range-vs-price ladder
 * underneath makes the actual trade-off between trims visible at a glance —
 * which is the decision a buyer is really making here.
 *
 * All figures are real catalog data. Where a variant's fast-charge time is not
 * published, the tile says so instead of borrowing the model-level number.
 */
function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function MockVariants({ vehicle }: { vehicle: VehicleDetail }) {
  const recommendedIndex = Math.max(
    vehicle.variants.findIndex((v) => v.isRecommended),
    0,
  );
  const [selected, setSelected] = useState(recommendedIndex);

  const variant = vehicle.variants[selected];
  const source = vehicle.sourceVehicle.variants.find((v) => v.id === variant.id);
  const base = vehicle.variants[0];

  const maxRange = Math.max(...vehicle.variants.map((v) => v.rangeKm));
  const priceDelta = variant.price - base.price;
  const rangeDelta = variant.rangeKm - base.rangeKm;

  const tiles = [
    { icon: BatteryCharging, label: "Battery", value: `${variant.batteryKwh}`, unit: "kWh" },
    { icon: Gauge, label: "ARAI range", value: `${variant.rangeKm}`, unit: "km" },
    source?.topSpeedKmph !== undefined
      ? { icon: TrendingUp, label: "Top speed", value: `${source.topSpeedKmph}`, unit: "km/h" }
      : null,
    source?.fastChargeTimeMin !== undefined
      ? { icon: Timer, label: "DC 10–80%", value: `${source.fastChargeTimeMin}`, unit: "min" }
      : { icon: Timer, label: "DC 10–80%", value: "—", unit: "not published" },
  ].filter((t): t is { icon: typeof Gauge; label: string; value: string; unit: string } => Boolean(t));

  return (
    <Band id="variants" tone="tinted">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Choose your trim"
          title={`${vehicle.variants.length} variants, one real decision`}
          lead="Pick a trim to see what changes. The ladder below plots every variant against price and range so the value step between them is obvious."
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-5">
          {/* ---- Variant rail ---- */}
          <div
            role="tablist"
            aria-label={`${vehicle.name} variants`}
            aria-orientation="vertical"
            className="flex flex-col gap-2"
          >
            {vehicle.variants.map((v, i) => {
              const active = i === selected;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "focus-ring group relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-primary bg-primary-tint shadow-card"
                      : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      active ? "border-primary bg-primary text-white" : "border-border-strong text-transparent",
                    )}
                    aria-hidden="true"
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "truncate text-[13px] font-extrabold tracking-tight",
                          active ? "text-primary-hover" : "text-ink",
                        )}
                      >
                        {v.name}
                      </span>
                      {v.isRecommended ? <Pill accent>Recommended</Pill> : null}
                    </span>
                    <span className="mt-1 block text-[11px] text-ink-secondary">
                      {v.batteryKwh} kWh · {v.rangeKm} km
                    </span>
                  </span>

                  <span
                    className={cn(
                      "shrink-0 text-[13px] font-extrabold tabular-nums",
                      active ? "text-primary-hover" : "text-ink",
                    )}
                  >
                    ₹{(v.price / 100000).toFixed(2)}L
                  </span>
                </button>
              );
            })}

            <p className="mt-1 rounded-xl bg-surface-secondary px-4 py-3 text-[11px] leading-relaxed text-ink-muted">
              Tata also sells two #DARK trims above this line-up. Their range and charging figures are not
              published separately, so they are not modelled as variants here.
            </p>
          </div>

          {/* ---- Detail panel ---- */}
          <div className="min-w-0 overflow-hidden rounded-2xl border border-border">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border bg-surface-secondary p-5 sm:p-7">
              <div className="min-w-0">
                <Kicker className="mb-1.5">Selected variant</Kicker>
                <p className="text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[26px]">
                  {variant.name}
                </p>
              </div>
              <div className="text-right">
                <Kicker className="mb-1.5">Ex-showroom</Kicker>
                <p className="text-[26px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-primary sm:text-[30px]">
                  {formatINR(variant.price)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {tiles.map(({ icon: Icon, label, value, unit }) => (
                <div key={label} className="bg-surface p-4 sm:p-5">
                  <span className="mb-3 flex items-center gap-1.5 text-primary">
                    <Icon size={14} />
                    <Kicker>{label}</Kicker>
                  </span>
                  <Metric value={value} unit={unit} size="sm" />
                </div>
              ))}
            </div>

            {/* Step-up summary */}
            <div className="border-t border-border p-5 sm:p-7">
              {selected === 0 ? (
                <p className="text-[12px] leading-relaxed text-ink-secondary">
                  This is the entry trim — the reference every step above is measured from.
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div>
                    <Kicker className="mb-1">Step up from {base.name}</Kicker>
                    <p className="text-[13px] font-bold text-ink">
                      +{formatINR(priceDelta)}
                      {rangeDelta > 0 ? (
                        <span className="ml-2 font-semibold text-primary">+{rangeDelta} km range</span>
                      ) : (
                        <span className="ml-2 font-semibold text-ink-muted">same range</span>
                      )}
                    </p>
                  </div>
                  {rangeDelta > 0 ? (
                    <div className="rounded-lg bg-primary-tint px-3 py-2">
                      <p className="text-[11px] font-bold text-primary-hover">
                        ₹{Math.round(priceDelta / rangeDelta).toLocaleString("en-IN")} per extra km of range
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="focus-ring flex h-11 items-center gap-1.5 rounded-xl bg-primary px-5 text-[12px] font-bold text-white transition-colors hover:bg-primary-hover"
                >
                  Get price for this variant
                  <ArrowUpRight size={15} />
                </button>
                <button
                  type="button"
                  className="focus-ring flex h-11 items-center rounded-xl border border-border px-5 text-[12px] font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
                >
                  Full specifications
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Range vs price ladder ---- */}
        <div className="mt-5 rounded-2xl border border-border p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[13px] font-extrabold tracking-tight text-ink">Range against price</p>
            <p className="text-[11px] text-ink-muted">Bar length is ARAI range · figure on the right is ex-showroom</p>
          </div>

          <div className="flex flex-col gap-4">
            {vehicle.variants.map((v, i) => {
              const active = i === selected;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelected(i)}
                  className="focus-ring group grid grid-cols-[minmax(0,1fr)] items-center gap-2 text-left sm:grid-cols-[150px_minmax(0,1fr)_92px] sm:gap-4"
                >
                  <span
                    className={cn(
                      "truncate text-[12px] font-bold transition-colors",
                      active ? "text-primary" : "text-ink-secondary group-hover:text-ink",
                    )}
                  >
                    {v.name}
                  </span>

                  <span className="relative block h-8 overflow-hidden rounded-lg bg-surface-secondary">
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 flex items-center justify-end rounded-lg pr-3 transition-all duration-500",
                        active
                          ? "bg-gradient-to-r from-primary to-primary-bright"
                          : "bg-border-strong/60 group-hover:bg-border-strong",
                      )}
                      style={{ width: `${(v.rangeKm / maxRange) * 100}%` }}
                    >
                      <span
                        className={cn(
                          "text-[11px] font-extrabold tabular-nums",
                          active ? "text-white" : "text-ink-secondary",
                        )}
                      >
                        {v.rangeKm} km
                      </span>
                    </span>
                  </span>

                  <span
                    className={cn(
                      "text-[12px] font-extrabold tabular-nums sm:text-right",
                      active ? "text-primary" : "text-ink",
                    )}
                  >
                    ₹{(v.price / 100000).toFixed(2)}L
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </Band>
  );
}
