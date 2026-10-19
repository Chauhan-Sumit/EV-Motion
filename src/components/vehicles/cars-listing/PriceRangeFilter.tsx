"use client";

import { LAST_STEP, PRICE_PRESETS, priceHistogram, STEP_LABELS } from "@/lib/cars-listing/filters";
import { cn } from "@/lib/utils";
import { useCarsListing } from "./ListingContext";
import { PILL, THUMB, TRACK } from "./ui";

const RANGE_INPUT = cn(
  "absolute inset-x-0 top-0 m-0 h-7 w-full appearance-none bg-transparent pointer-events-none",
  "[&::-webkit-slider-runnable-track]:h-7 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-7 [&::-moz-range-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[3px] [&::-moz-range-thumb]:pointer-events-auto",
  "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:outline-[2.5px] focus-visible:[&::-webkit-slider-thumb]:outline focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-primary",
  THUMB,
);

/**
 * The price filter: a histogram of how many cars start in each band (counted
 * with every other filter applied), a two-thumb slider over the price stops,
 * min/max selects for precise entry, and one-tap presets.
 */
export function PriceRangeFilter() {
  const { cars, filters, setFilters } = useCarsListing();
  const { pmin: a, pmax: b } = filters;
  const bins = priceHistogram(cars, filters);
  const peak = Math.max(1, ...bins);

  const setMin = (v: number) => setFilters((f) => ({ ...f, pmin: Math.min(v, f.pmax - 1) }));
  const setMax = (v: number) => setFilters((f) => ({ ...f, pmax: Math.max(v, f.pmin + 1) }));

  return (
    <>
      <div className="mb-2.5 text-center text-[13.5px] font-semibold tabular-nums" aria-live="polite">
        {STEP_LABELS[a]} – {STEP_LABELS[b]}
        {b === LAST_STEP ? "+" : ""}
      </div>
      <div className="flex h-11 items-end gap-0.5 px-2.5" aria-hidden="true">
        {bins.map((n, i) => (
          <i
            key={i}
            title={`${n} car${n === 1 ? "" : "s"}`}
            className={cn("min-h-[3px] flex-1 rounded-t-[3px] transition-colors duration-200", i >= a && i < b ? "bg-[linear-gradient(180deg,#4ADE80,var(--primary))]" : "")}
            style={{ height: `${n ? Math.max(12, (n / peak) * 100) : 6}%`, background: i >= a && i < b ? undefined : TRACK }}
          />
        ))}
      </div>
      <div className="relative -mt-1 h-7">
        <div className="absolute inset-x-2.5 top-3 h-1 rounded-sm" style={{ background: TRACK }} />
        <div
          className="absolute top-3 h-1 rounded-sm bg-primary"
          style={{ left: `calc(11px + (100% - 22px) * ${a / LAST_STEP})`, right: `calc(11px + (100% - 22px) * ${1 - b / LAST_STEP})` }}
        />
        <input
          type="range"
          min={0}
          max={LAST_STEP}
          step={1}
          value={a}
          onChange={(e) => setMin(Number(e.target.value))}
          aria-label="Minimum price"
          aria-valuetext={a ? STEP_LABELS[a] : "No minimum"}
          className={RANGE_INPUT}
          style={{ zIndex: a > LAST_STEP / 2 ? 3 : 1 }}
        />
        <input
          type="range"
          min={0}
          max={LAST_STEP}
          step={1}
          value={b}
          onChange={(e) => setMax(Number(e.target.value))}
          aria-label="Maximum price"
          aria-valuetext={b === LAST_STEP ? "No maximum" : STEP_LABELS[b]}
          className={cn(RANGE_INPUT, "z-[2]")}
        />
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <PriceSelect label="Min" value={a} onChange={setMin} options={STEP_LABELS.slice(0, LAST_STEP).map((l, i) => ({ value: i, label: i ? l.replace(" L", " Lakh") : "No min" }))} />
        <PriceSelect label="Max" value={b} onChange={setMax} options={STEP_LABELS.map((l, i) => ({ value: i, label: i === LAST_STEP ? "No max" : l.replace(" L", " Lakh") })).slice(1)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRICE_PRESETS.map((p) => {
          const on = p.min === a && p.max === b;
          return (
            <button
              key={p.label}
              type="button"
              aria-pressed={on}
              className={PILL}
              onClick={() => setFilters((f) => (on ? { ...f, pmin: 0, pmax: LAST_STEP } : { ...f, pmin: p.min, pmax: p.max }))}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function PriceSelect({ label, value, onChange, options }: { label: string; value: number; onChange: (v: number) => void; options: { value: number; label: string }[] }) {
  return (
    <label className="relative flex flex-col gap-0.5 rounded-[10px] border border-border px-2.5 py-1.5 focus-within:border-primary">
      <span className="text-[11px] font-medium text-ink-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label}imum price`}
        className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-[13.5px] font-semibold outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
