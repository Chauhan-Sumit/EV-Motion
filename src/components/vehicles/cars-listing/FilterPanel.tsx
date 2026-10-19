"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { AdSlot } from "@/components/common/AdSlot";
import {
  activeFilterCount,
  BODY_LABEL,
  BODY_ORDER,
  CHARGE_OPTIONS,
  countMatching,
  EMPTY_FILTERS,
  isPriceActive,
  LAST_STEP,
  RANGE_MAX,
  RANGE_STEP,
  STATUS_OPTIONS,
  STEP_LABELS,
} from "@/lib/cars-listing/filters";
import { cn } from "@/lib/utils";
import { useCarsListing } from "./ListingContext";
import { FilterGroup, OptionRow, ToggleRow } from "./FilterControls";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { btn, PILL, SHADOW_1, THUMB, TRACK } from "./ui";

/** Brands shown before "Show all". */
const BRANDS_VISIBLE = 6;

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/**
 * The filter panel. A sticky sidebar from 981px up; below that, a bottom
 * sheet opened from the results toolbar, with a live "Show N cars" button.
 * Every option shows how many cars selecting it would return.
 */
export function FilterPanel() {
  const { cars, results, filters: f, setFilters, filtersOpen, setFiltersOpen, scrollToResults } = useCarsListing();
  const active = activeFilterCount(f);
  const count = (skip: Parameters<typeof countMatching>[2], test: Parameters<typeof countMatching>[3]) => countMatching(cars, f, skip, test);
  const seatOptions = useMemo(() => [...new Set(cars.map((c) => c.seats).filter((s): s is number => s !== null))].sort((a, b) => a - b), [cars]);

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
        <h2 className="leading-[1.15] flex items-center gap-2 text-lg font-bold tracking-[-.025em]">
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
        <PriceRangeFilter />
      </FilterGroup>

      <FilterGroup title="Brand" defaultOpen value={f.brand.length ? String(f.brand.length) : undefined}>
        <BrandOptions />
      </FilterGroup>

      <FilterGroup title="Body type" value={f.body.length ? f.body.map((b) => BODY_LABEL[b]).join(", ") : undefined}>
        {BODY_ORDER.map((b) => (
          <OptionRow
            key={b}
            type="checkbox"
            name="body"
            label={BODY_LABEL[b]}
            checked={f.body.includes(b)}
            count={count("body", (c) => c.body === b)}
            onChange={() => setFilters((s) => ({ ...s, body: toggle(s.body, b) }))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Range (claimed)" value={f.range ? `${f.range}+ km` : undefined}>
        <div className="mb-2.5 text-center text-[13.5px] font-semibold tabular-nums">{f.range ? `${f.range} km or more` : "Any range"}</div>
        <input
          type="range"
          min={0}
          max={RANGE_MAX}
          step={RANGE_STEP}
          value={f.range}
          onChange={(e) => setFilters((s) => ({ ...s, range: Number(e.target.value) }))}
          aria-label="Minimum claimed range"
          aria-valuetext={f.range ? `${f.range} km or more` : "Any range"}
          className={cn(
            "m-0 h-[26px] w-full appearance-none bg-transparent focus-ring",
            "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-sm [&::-webkit-slider-runnable-track]:bg-[linear-gradient(90deg,var(--primary)_var(--f),var(--track)_var(--f))]",
            "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-sm [&::-moz-range-track]:bg-[var(--track)] [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-sm [&::-moz-range-progress]:bg-primary",
            "[&::-webkit-slider-thumb]:-mt-[9px]",
            THUMB,
          )}
          style={{ "--f": `${(f.range / RANGE_MAX) * 100}%`, "--track": TRACK } as CSSProperties}
        />
        <div className="mt-0.5 flex justify-between text-xs text-ink-muted">
          <span>Any</span>
          <span>{RANGE_MAX} km+</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Charging time (DC fast)" value={f.dc ? `<${f.dc} min` : undefined}>
        {CHARGE_OPTIONS.map((o) => (
          <OptionRow
            key={o.value}
            type="radio"
            name="dc"
            label={o.label}
            checked={f.dc === o.value}
            count={count("dc", (c) => !o.value || (c.dcMin !== null && c.dcMin <= o.value))}
            onChange={() => setFilters((s) => ({ ...s, dc: o.value }))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Seats" value={f.seats.length ? f.seats.join(", ") : undefined}>
        <div className="flex flex-wrap gap-1.5">
          {seatOptions.map((n) => (
            <button key={n} type="button" aria-pressed={f.seats.includes(n)} className={PILL} onClick={() => setFilters((s) => ({ ...s, seats: toggle(s.seats, n) }))}>
              {n} seats
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability" value={f.status.length ? String(f.status.length) : undefined}>
        {STATUS_OPTIONS.map((o) => (
          <OptionRow
            key={o.value}
            type="checkbox"
            name="status"
            label={o.label}
            checked={f.status.includes(o.value)}
            count={count("status", (c) => c.status === o.value)}
            onChange={() => setFilters((s) => ({ ...s, status: toggle(s.status, o.value) }))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Features" value={(f.safe ? 1 : 0) + (f.awd ? 1 : 0) ? String((f.safe ? 1 : 0) + (f.awd ? 1 : 0)) : undefined}>
        <ToggleRow label="5★ Bharat NCAP" checked={f.safe} onChange={(on) => setFilters((s) => ({ ...s, safe: on }))} />
        <ToggleRow label="All-wheel drive" checked={f.awd} onChange={(on) => setFilters((s) => ({ ...s, awd: on }))} />
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
          Show {results.length} cars
        </button>
      </div>
    </aside>
  );
}

function BrandOptions() {
  const { cars, filters: f, setFilters } = useCarsListing();
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const brands = useMemo(() => {
    const by = new Map<string, { oem: string; name: string; n: number }>();
    for (const c of cars) {
      const b = by.get(c.oem) ?? { oem: c.oem, name: c.oemName, n: 0 };
      b.n++;
      by.set(c.oem, b);
    }
    return [...by.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  }, [cars]);

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
          <OptionRow
            key={b.oem}
            type="checkbox"
            name="brand"
            label={b.name}
            checked={f.brand.includes(b.oem)}
            count={countMatching(cars, f, "brand", (c) => c.oem === b.oem)}
            onChange={() => setFilters((s) => ({ ...s, brand: toggle(s.brand, b.oem) }))}
          />
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
