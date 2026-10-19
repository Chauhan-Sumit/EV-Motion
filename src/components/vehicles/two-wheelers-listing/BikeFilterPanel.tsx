"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { AdSlot } from "@/components/common/AdSlot";
import { FilterGroup, OptionRow, ToggleRow } from "@/components/vehicles/cars-listing/FilterControls";
import { btn, PILL, SHADOW_1, THUMB, TRACK } from "@/components/vehicles/cars-listing/ui";
import {
  activeFilterCount,
  BATTERY_MAX,
  BATTERY_STEP,
  CHARGE_OPTIONS,
  countMatching,
  EMPTY_FILTERS,
  isPriceActive,
  LAST_STEP,
  matchesSpeed,
  PRICE_PRESETS,
  priceHistogram,
  RANGE_MAX,
  RANGE_STEP,
  SPEED_OPTIONS,
  STATUS_OPTIONS,
  STEP_LABELS,
  TYPE_LABEL,
  TYPE_ORDER,
  type BikeFilters,
} from "@/lib/two-wheelers-listing/filters";
import { cn } from "@/lib/utils";
import { useBikesListing } from "./ListingContext";

const BRANDS_VISIBLE = 6;
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const DUAL_INPUT = cn(
  "absolute inset-x-0 top-0 m-0 h-7 w-full appearance-none bg-transparent pointer-events-none",
  "[&::-webkit-slider-runnable-track]:h-7 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-7 [&::-moz-range-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[3px] [&::-moz-range-thumb]:pointer-events-auto",
  "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:outline-[2.5px] focus-visible:[&::-webkit-slider-thumb]:outline focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-primary",
  THUMB,
);

const SINGLE_INPUT = cn(
  "m-0 h-[26px] w-full appearance-none bg-transparent focus-ring",
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-sm [&::-webkit-slider-runnable-track]:bg-[linear-gradient(90deg,var(--primary)_var(--f),var(--track)_var(--f))]",
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-sm [&::-moz-range-track]:bg-[var(--track)] [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-sm [&::-moz-range-progress]:bg-primary",
  "[&::-webkit-slider-thumb]:-mt-[9px]",
  THUMB,
);

/**
 * The filter panel — the Electric Cars listing's panel, with two-wheeler
 * facets. A sticky sidebar from 981px up; below that a bottom sheet with a
 * live "Show N" button. Every option shows how many models it would return.
 */
export function BikeFilterPanel() {
  const { bikes, results, filters: f, setFilters, filtersOpen, setFiltersOpen, scrollToResults } = useBikesListing();
  const active = activeFilterCount(f);
  const count = (skip: Parameters<typeof countMatching>[2], test: Parameters<typeof countMatching>[3]) => countMatching(bikes, f, skip, test);

  return (
    <aside
      id="filters"
      aria-label="Filters"
      className={cn(
        "overflow-auto rounded-[18px] border border-border bg-surface [scrollbar-width:thin]",
        "min-[981px]:sticky min-[981px]:top-[84px] min-[981px]:max-h-[calc(100vh-100px)]",
        SHADOW_1,
        "max-[980px]:fixed max-[980px]:inset-x-0 max-[980px]:bottom-0 max-[980px]:z-[90] max-[980px]:max-h-[86vh] max-[980px]:rounded-b-none max-[980px]:rounded-t-[22px] max-[980px]:border-0 max-[980px]:shadow-[0_-20px_50px_rgba(0,0,0,.2)] max-[980px]:transition-[transform,visibility] max-[980px]:duration-[400ms] max-[980px]:ease-[cubic-bezier(.2,.7,.2,1)]",
        filtersOpen ? "max-[980px]:translate-y-0" : "max-[980px]:invisible max-[980px]:translate-y-[105%]",
      )}
    >
      <div className="sticky top-0 z-[2] flex items-center justify-between border-b border-[#EEF0F3] bg-surface px-5 pb-3 pt-[18px]">
        <h2 className="flex items-center gap-2 text-lg font-bold leading-[1.15] tracking-[-.025em]">
          Filters
          {active ? <span className="rounded-[9px] bg-primary-hover px-[7px] py-px text-[11.5px] tracking-normal text-white">{active}</span> : null}
        </h2>
        <div className="flex items-center">
          <button type="button" disabled={!active} onClick={() => setFilters(EMPTY_FILTERS)} className="text-[13.5px] font-semibold text-primary-hover disabled:cursor-default disabled:text-ink-muted">
            Clear all
          </button>
          <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="ml-2.5 grid size-[34px] place-items-center rounded-full bg-surface-secondary min-[981px]:hidden">
            <X className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          </button>
        </div>
      </div>

      <FilterGroup title="Price range" defaultOpen value={isPriceActive(f) ? `${f.pmin ? STEP_LABELS[f.pmin] : "Up"}–${f.pmax === LAST_STEP ? "" : STEP_LABELS[f.pmax].replace("₹", "")}` : undefined}>
        <BikePriceFilter />
      </FilterGroup>

      <FilterGroup title="Brand" defaultOpen value={f.brand.length ? String(f.brand.length) : undefined}>
        <BikeBrandOptions />
      </FilterGroup>

      <FilterGroup title="Type" value={f.type.length ? f.type.map((t) => TYPE_LABEL[t]).join(", ") : undefined}>
        {TYPE_ORDER.map((t) => (
          <OptionRow key={t} type="checkbox" name="type" label={TYPE_LABEL[t]} checked={f.type.includes(t)} count={count("type", (b) => b.type === t)} onChange={() => setFilters((s) => ({ ...s, type: toggle(s.type, t) }))} />
        ))}
      </FilterGroup>

      <FilterGroup title="Range (claimed)" value={f.range ? `${f.range}+ km` : undefined}>
        <RangeSlider
          value={f.range}
          max={RANGE_MAX}
          step={RANGE_STEP}
          label="Minimum claimed range"
          text={f.range ? `${f.range} km or more` : "Any range"}
          ends={["Any", `${RANGE_MAX} km+`]}
          onChange={(range) => setFilters((s) => ({ ...s, range }))}
        />
      </FilterGroup>

      <FilterGroup title="Top speed" value={f.speed ? (f.speed === "low" ? "Low-speed" : `${f.speed}+ km/h`) : undefined}>
        {SPEED_OPTIONS.map((o) => (
          <OptionRow key={o.value || "any"} type="radio" name="speed" label={o.label} checked={f.speed === o.value} count={count("speed", (b) => matchesSpeed(b.topSpeedKmph, o.value))} onChange={() => setFilters((s) => ({ ...s, speed: o.value }))} />
        ))}
      </FilterGroup>

      <FilterGroup title="Home charging time" value={f.charge ? `<${f.charge} h` : undefined}>
        {CHARGE_OPTIONS.map((o) => (
          <OptionRow key={o.value} type="radio" name="charge" label={o.label} checked={f.charge === o.value} count={count("charge", (b) => !o.value || b.homeChargeHr < o.value)} onChange={() => setFilters((s) => ({ ...s, charge: o.value }))} />
        ))}
      </FilterGroup>

      <FilterGroup title="Battery" value={f.battery ? `${f.battery}+ kWh` : undefined}>
        <RangeSlider
          value={f.battery}
          max={BATTERY_MAX}
          step={BATTERY_STEP}
          label="Minimum battery capacity"
          text={f.battery ? `${f.battery} kWh or more` : "Any battery"}
          ends={["Any", `${BATTERY_MAX} kWh+`]}
          onChange={(battery) => setFilters((s) => ({ ...s, battery }))}
        />
      </FilterGroup>

      <FilterGroup title="Availability" value={f.status.length ? String(f.status.length) : undefined}>
        {STATUS_OPTIONS.map((o) => (
          <OptionRow key={o.value} type="checkbox" name="status" label={o.label} checked={f.status.includes(o.value)} count={count("status", (b) => b.status === o.value)} onChange={() => setFilters((s) => ({ ...s, status: toggle(s.status, o.value) }))} />
        ))}
      </FilterGroup>

      <FilterGroup title="Features" value={f.fast ? "1" : undefined}>
        <ToggleRow label="Fast charging" checked={f.fast} onChange={(on) => setFilters((s) => ({ ...s, fast: on }))} />
        <p className="mt-1 text-xs text-ink-muted">Models whose maker publishes a fast-charging time.</p>
      </FilterGroup>

      <div className="mx-5 mb-5 mt-1 flex justify-center max-[980px]:hidden">
        <AdSlot size="rectangle" className="max-w-full" />
      </div>

      <div className="sticky bottom-0 flex gap-2.5 border-t border-[#EEF0F3] bg-surface px-5 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 min-[981px]:hidden">
        <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className={cn(btn.ghost, "flex-1")}>
          Clear
        </button>
        <button
          type="button"
          onClick={() => {
            setFiltersOpen(false);
            scrollToResults();
          }}
          className={cn(btn.brand, "flex-1")}
        >
          Show {results.length} models
        </button>
      </div>
    </aside>
  );
}

function RangeSlider({ value, max, step, label, text, ends, onChange }: { value: number; max: number; step: number; label: string; text: string; ends: [string, string]; onChange: (v: number) => void }) {
  return (
    <>
      <div className="mb-2.5 text-center text-[13.5px] font-semibold tabular-nums">{text}</div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={text}
        className={SINGLE_INPUT}
        style={{ "--f": `${(value / max) * 100}%`, "--track": TRACK } as CSSProperties}
      />
      <div className="mt-0.5 flex justify-between text-xs text-ink-muted">
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
      </div>
    </>
  );
}

function BikePriceFilter() {
  const { bikes, filters, setFilters } = useBikesListing();
  const { pmin: a, pmax: b } = filters;
  const bins = priceHistogram(bikes, filters);
  const peak = Math.max(1, ...bins);
  const setMin = (v: number) => setFilters((f: BikeFilters) => ({ ...f, pmin: Math.min(v, f.pmax - 1) }));
  const setMax = (v: number) => setFilters((f: BikeFilters) => ({ ...f, pmax: Math.max(v, f.pmin + 1) }));

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
            title={`${n} model${n === 1 ? "" : "s"}`}
            className={cn("min-h-[3px] flex-1 rounded-t-[3px] transition-colors duration-200", i >= a && i < b && "bg-[linear-gradient(180deg,#4ADE80,var(--primary))]")}
            style={{ height: `${n ? Math.max(12, (n / peak) * 100) : 6}%`, background: i >= a && i < b ? undefined : TRACK }}
          />
        ))}
      </div>
      <div className="relative -mt-1 h-7">
        <div className="absolute inset-x-2.5 top-3 h-1 rounded-sm" style={{ background: TRACK }} />
        <div className="absolute top-3 h-1 rounded-sm bg-primary" style={{ left: `calc(11px + (100% - 22px) * ${a / LAST_STEP})`, right: `calc(11px + (100% - 22px) * ${1 - b / LAST_STEP})` }} />
        <input type="range" min={0} max={LAST_STEP} step={1} value={a} onChange={(e) => setMin(Number(e.target.value))} aria-label="Minimum price" aria-valuetext={a ? STEP_LABELS[a] : "No minimum"} className={DUAL_INPUT} style={{ zIndex: a > LAST_STEP / 2 ? 3 : 1 }} />
        <input type="range" min={0} max={LAST_STEP} step={1} value={b} onChange={(e) => setMax(Number(e.target.value))} aria-label="Maximum price" aria-valuetext={b === LAST_STEP ? "No maximum" : STEP_LABELS[b]} className={cn(DUAL_INPUT, "z-[2]")} />
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <PriceSelect label="Min" value={a} onChange={setMin} options={STEP_LABELS.slice(0, LAST_STEP).map((l, i) => ({ value: i, label: i ? l : "No min" }))} />
        <PriceSelect label="Max" value={b} onChange={setMax} options={STEP_LABELS.map((l, i) => ({ value: i, label: i === LAST_STEP ? "No max" : l })).slice(1)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRICE_PRESETS.map((p) => {
          const on = p.min === a && p.max === b;
          return (
            <button key={p.label} type="button" aria-pressed={on} className={PILL} onClick={() => setFilters((f) => (on ? { ...f, pmin: 0, pmax: LAST_STEP } : { ...f, pmin: p.min, pmax: p.max }))}>
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
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={`${label}imum price`} className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-[13.5px] font-semibold outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function BikeBrandOptions() {
  const { bikes, filters: f, setFilters } = useBikesListing();
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const brands = useMemo(() => {
    const by = new Map<string, { oem: string; name: string; n: number }>();
    for (const b of bikes) {
      const s = by.get(b.oem) ?? { oem: b.oem, name: b.oemName, n: 0 };
      s.n++;
      by.set(b.oem, s);
    }
    return [...by.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  }, [bikes]);

  const q = query.trim().toLowerCase();
  const visible = q
    ? brands.filter((b) => b.name.toLowerCase().includes(q))
    : showAll
      ? brands
      : [...brands.slice(0, BRANDS_VISIBLE), ...brands.slice(BRANDS_VISIBLE).filter((b) => f.brand.includes(b.oem))];

  return (
    <>
      <label className="mb-2 flex h-[38px] items-center gap-2 rounded-[10px] border border-[#EEF0F3] bg-surface-secondary px-3 text-ink-muted focus-within:border-primary focus-within:bg-surface">
        <Search className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
        <span className="sr-only">Search brand</span>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand…" autoComplete="off" className="min-w-0 flex-1 border-0 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-muted" />
      </label>
      {visible.length ? (
        visible.map((b) => (
          <OptionRow key={b.oem} type="checkbox" name="brand" label={b.name} checked={f.brand.includes(b.oem)} count={countMatching(bikes, f, "brand", (x) => x.oem === b.oem)} onChange={() => setFilters((s) => ({ ...s, brand: toggle(s.brand, b.oem) }))} />
        ))
      ) : (
        <p className="py-1.5 text-[13px] text-ink-muted">No brand matches “{query}”.</p>
      )}
      {!q && brands.length > BRANDS_VISIBLE ? (
        <button type="button" onClick={() => setShowAll(!showAll)} className="mt-1.5 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ink-secondary hover:text-primary-hover">
          {showAll ? "Show fewer" : `Show all ${brands.length} brands`}
          <ChevronDown className={cn("size-3 transition-transform", showAll && "rotate-180")} strokeWidth={2.6} aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
