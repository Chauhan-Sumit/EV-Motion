"use client";

import { Fragment, useState } from "react";
import { ChevronDown, LayoutGrid, LayoutList, ListFilter, X } from "lucide-react";
import { AdSlot } from "@/components/common/AdSlot";
import { btn } from "@/components/vehicles/cars-listing/ui";
import { activeChips, activeFilterCount, EMPTY_FILTERS, isPriceActive, priceSpanLabel, resultsTitle, SORT_OPTIONS, type BikeSortKey, type ViewMode } from "@/lib/two-wheelers-listing/filters";
import { cn } from "@/lib/utils";
import { useBikesListing } from "./ListingContext";
import { BikeCard } from "./BikeCard";

/** Models rendered per "Show more" step. */
const PAGE = 10;

/** Results header (title, sort, view), active-filter chips, the cards with their ad slots, and "Show more". */
export function BikeResults() {
  const { results, filters, setFilters, sort, setSort, view, setView, brandName, cityName, setFiltersOpen } = useBikesListing();
  const [limit, setLimit] = useState({ key: "", show: PAGE });
  // Any change to what is listed starts the list from the top again.
  const listKey = `${JSON.stringify(filters)}|${sort}`;
  const show = limit.key === listKey ? limit.show : PAGE;

  const n = results.length;
  const visible = results.slice(0, show);
  const chips = activeChips(filters, brandName);
  const active = activeFilterCount(filters);
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label.toLowerCase() ?? "";

  return (
    <div id="results" tabIndex={-1} className="min-w-0 outline-none">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div>
          <h2 className="text-[clamp(22px,2.2vw,28px)] font-[750] leading-[1.15] tracking-[-.035em] max-[760px]:text-[21px]">{resultsTitle(n, filters, brandName)}</h2>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">
            {isPriceActive(filters) ? `${priceSpanLabel(filters)} · ` : ""}Sorted by {sortLabel} · ex-showroom prices in {cityName}
          </p>
        </div>
        <div className="flex items-center gap-2 max-[760px]:w-full">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-controls="filters"
            className="inline-flex h-10 items-center gap-[7px] rounded-xl border border-border bg-surface px-3.5 text-sm font-semibold min-[981px]:hidden focus-ring"
          >
            <ListFilter className="size-4" strokeWidth={2.2} aria-hidden="true" />
            Filters
            {active ? <span className="rounded-[9px] bg-primary-hover px-1.5 text-[11px] leading-[17px] text-white">{active}</span> : null}
          </button>
          <label className="relative flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface pl-3 pr-[34px] text-[13.5px] focus-within:border-primary max-[760px]:flex-1">
            <span className="whitespace-nowrap text-ink-muted">Sort by</span>
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value as BikeSortKey)}
              className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-[13.5px] font-semibold outline-none max-[760px]:w-full"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-ink-muted" strokeWidth={2.6} aria-hidden="true" />
          </label>
          <div role="group" aria-label="View" className="inline-flex rounded-xl border border-border bg-surface p-[3px] max-[760px]:hidden">
            {(
              [
                ["list", "List view", LayoutList],
                ["grid", "Grid view", LayoutGrid],
              ] as const
            ).map(([v, label, Icon]) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                aria-label={label}
                onClick={() => setView(v as ViewMode)}
                className="grid h-8 w-[34px] place-items-center rounded-[9px] text-ink-muted aria-pressed:bg-primary-tint aria-pressed:text-[#0B6629] focus-ring"
              >
                <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {chips.length ? (
        <div className="mb-3.5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilters(c.clear)}
              aria-label={`Remove filter ${c.label}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-surface pl-3 pr-2.5 text-[13px] text-ink-secondary hover:border-[#B9BFC7] hover:text-ink focus-ring"
            >
              {c.label}
              <X className="size-3" strokeWidth={2.6} aria-hidden="true" />
            </button>
          ))}
          {chips.length > 1 ? (
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="h-8 px-2.5 text-[13px] font-semibold text-primary-hover focus-ring">
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}

      <div aria-live="polite" className={cn("grid grid-cols-1 gap-3.5", view === "grid" && "grid-cols-3 gap-4 max-[1240px]:grid-cols-2", "max-[760px]:grid-cols-1")}>
        {n === 0 ? (
          <div className="col-span-full rounded-[18px] border border-dashed border-border bg-surface px-5 py-[60px] text-center">
            <h3 className="text-[22px] font-bold leading-[1.15]">No two-wheelers match all of that.</h3>
            <p className="mb-4 mt-2 text-ink-muted">Try widening the price range or removing a filter.</p>
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className={btn.brand}>
              Clear all filters
            </button>
          </div>
        ) : (
          visible.map((bike, i) => (
            <Fragment key={bike.slug}>
              <BikeCard bike={bike} view={view} />
              {i === 2 && n > 4 ? <NativeAdRow grid={view === "grid"} /> : null}
              {i === 7 && n > 9 ? (
                <div className="col-span-full flex flex-col items-center gap-1.5 py-1.5">
                  <AdSlot size="leaderboard" className="hidden min-[761px]:flex" />
                  <AdSlot size="rectangle" className="min-[761px]:hidden" />
                </div>
              ) : null}
            </Fragment>
          ))
        )}
      </div>

      {n > show ? (
        <div className="mt-6 flex flex-col items-center gap-2.5">
          <span className="text-[13px] text-ink-muted">
            Showing {show} of {n}
          </span>
          <div className="h-1 w-[220px] overflow-hidden rounded-sm bg-[#E9ECF0]">
            <i className="block h-full bg-primary" style={{ width: `${(show / n) * 100}%` }} />
          </div>
          <button type="button" onClick={() => setLimit({ key: listKey, show: show + PAGE })} className={btn.ghost}>
            Show {Math.min(PAGE, n - show)} more
          </button>
        </div>
      ) : n > PAGE ? (
        <div className="mt-6 flex justify-center">
          <span className="text-[13px] text-ink-muted">That’s all {n} models</span>
        </div>
      ) : null}
    </div>
  );
}

/** In-feed sponsored slot, the size of a listing and clearly labelled. A placeholder until an ad server is connected. */
function NativeAdRow({ grid }: { grid: boolean }) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "flex min-h-[120px] items-center justify-between gap-4 rounded-[18px] border border-dashed border-[#CDD2D8] bg-[repeating-linear-gradient(135deg,#FBFBFC,#FBFBFC_12px,#F4F6F8_12px,#F4F6F8_24px)] px-6 py-5",
        grid && "flex-col items-start justify-center",
        "max-[760px]:flex-col max-[760px]:items-start",
      )}
    >
      <div>
        <small className="text-[10.5px] font-bold tracking-[.14em] text-ink-muted">SPONSORED · NATIVE AD SLOT</small>
        <h3 className="mt-1 text-[19px] font-bold leading-[1.15]">Featured OEM listing</h3>
        <p className="mt-0.5 text-[13.5px] text-ink-muted">Same footprint as a listing, clearly labelled. Served via Google Ad Manager.</p>
      </div>
      <span aria-hidden="true" className={cn(btn.ghost, btn.sm)}>
        Advertiser CTA
      </span>
    </aside>
  );
}
