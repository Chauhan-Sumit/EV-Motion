"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ListFilter, Zap, Car, IndianRupee, LayoutGrid, Gauge, SlidersHorizontal } from "lucide-react";
import { VehicleSearchBox } from "@/components/search/VehicleSearchBox";
import { ResponsivePopover } from "@/components/common/ResponsivePopover";
import { LocationSelector } from "@/components/layout/LocationSelector";
import { useLocation } from "@/context/LocationContext";
import { Slider } from "@/components/ui/slider";
import { FilterBar } from "@/components/vehicles/FilterBar";
import { getVehiclesByCategory, oems } from "@/lib/data";
import { buildListingSearchParams, type ListingFilterState } from "@/lib/listing-params";
import {
  CAR_FILTER_CONFIG,
  CHARGING_OPTIONS,
  TWO_WHEELER_FILTER_CONFIG,
  type CategoryFilterConfig,
  type ChargingBucket,
} from "@/lib/vehicle-filter-options";
import { cn } from "@/lib/utils";
import type { LaunchStatus, VehicleCategory } from "@/types/vehicle";

type FilterKey = "budget" | "bodyType" | "range" | "charging" | "all";

const ALL_AVAILABILITY: LaunchStatus[] = ["available", "just-launched", "upcoming"];

const CHIP_CLASS =
  "focus-ring flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-border-strong px-3.5 py-[7px] text-[11px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary";

function defaultFilterState(config: CategoryFilterConfig): ListingFilterState {
  return {
    oems: [],
    price: config.priceBounds,
    subType: "all",
    sort: "price-asc",
    minRange: config.rangeBounds[0],
    minBattery: config.batteryBounds[0],
    charging: "any",
    seats: [],
    availability: [],
  };
}

export function SearchCard() {
  const router = useRouter();
  const { city } = useLocation();
  const [mode, setMode] = useState<"car" | "bike">("car");
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);

  const category: VehicleCategory = mode === "car" ? "car" : "2-wheeler";
  const config = mode === "car" ? CAR_FILTER_CONFIG : TWO_WHEELER_FILTER_CONFIG;
  const basePath = mode === "car" ? "/cars" : "/two-wheelers";

  function browseAll() {
    router.push(basePath);
  }

  function applyAndNavigate(partial: Partial<ListingFilterState>) {
    const state: ListingFilterState = { ...defaultFilterState(config), ...partial };
    const params = buildListingSearchParams(state, config.priceBounds, config.rangeBounds, config.batteryBounds);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
    setActiveFilter(null);
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-popover sm:p-6">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-ink">Find Your Right EV</h2>
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            aria-label={`Select city (current: ${city.name})`}
            className="focus-ring flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary-tint"
          >
            <MapPin size={13} />
            {city.name}
          </button>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => setMode("car")}
              aria-pressed={mode === "car"}
              className={`focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                mode === "car" ? "bg-primary text-white" : "bg-surface-secondary text-ink-secondary"
              }`}
            >
              <Car size={14} />
              Car
            </button>
            <button
              type="button"
              onClick={() => setMode("bike")}
              aria-pressed={mode === "bike"}
              className={`focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                mode === "bike" ? "bg-primary text-white" : "bg-surface-secondary text-ink-secondary"
              }`}
            >
              <Zap size={14} />
              Bike
            </button>
          </div>

          <VehicleSearchBox
            ariaLabel="Search EVs by name or brand"
            placeholder="Type to select EV name or brand..."
            size="lg"
            className="flex-1"
            categoryScope={category}
          />

          <button
            type="button"
            onClick={browseAll}
            className="focus-ring flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border-strong px-4 text-[12.5px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <ListFilter size={15} />
            Browse all {mode === "car" ? "cars" : "bikes"}
          </button>
        </div>

        <div className="scroll-row -mx-1 mt-3.5 flex gap-2 overflow-x-auto px-1 pb-0.5">
          <ResponsivePopover
            title="Budget"
            open={activeFilter === "budget"}
            onOpenChange={(o) => setActiveFilter(o ? "budget" : null)}
            triggerClassName={CHIP_CLASS}
            trigger={
              <>
                <IndianRupee size={12} />
                Budget
              </>
            }
          >
            <BudgetPanel key={mode} config={config} onApply={(price) => applyAndNavigate({ price })} />
          </ResponsivePopover>

          <ResponsivePopover
            title={config.subTypeLabel}
            open={activeFilter === "bodyType"}
            onOpenChange={(o) => setActiveFilter(o ? "bodyType" : null)}
            triggerClassName={CHIP_CLASS}
            trigger={
              <>
                <LayoutGrid size={12} />
                Body Type
              </>
            }
          >
            <BodyTypePanel key={mode} config={config} onApply={(subType) => applyAndNavigate({ subType })} />
          </ResponsivePopover>

          <ResponsivePopover
            title="Range"
            open={activeFilter === "range"}
            onOpenChange={(o) => setActiveFilter(o ? "range" : null)}
            triggerClassName={CHIP_CLASS}
            trigger={
              <>
                <Gauge size={12} />
                Range
              </>
            }
          >
            <RangePanel key={mode} config={config} onApply={(minRange) => applyAndNavigate({ minRange })} />
          </ResponsivePopover>

          <ResponsivePopover
            title="Charging Speed"
            open={activeFilter === "charging"}
            onOpenChange={(o) => setActiveFilter(o ? "charging" : null)}
            triggerClassName={CHIP_CLASS}
            trigger={
              <>
                <Zap size={12} />
                Charging Speed
              </>
            }
          >
            <ChargingPanel onApply={(charging) => applyAndNavigate({ charging })} />
          </ResponsivePopover>

          <ResponsivePopover
            title="All Filters"
            open={activeFilter === "all"}
            onOpenChange={(o) => setActiveFilter(o ? "all" : null)}
            triggerClassName={CHIP_CLASS}
            contentClassName="w-96"
            trigger={
              <>
                <SlidersHorizontal size={12} />
                All Filters
              </>
            }
          >
            <AllFiltersPanel key={mode} category={category} config={config} onApply={applyAndNavigate} />
          </ResponsivePopover>
        </div>
      </div>

      <LocationSelector open={locationOpen} onOpenChange={setLocationOpen} />
    </div>
  );
}

function ApplyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring mt-3 w-full rounded-md bg-primary py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-primary-hover"
    >
      Apply
    </button>
  );
}

function BudgetPanel({ config, onApply }: { config: CategoryFilterConfig; onApply: (price: [number, number]) => void }) {
  const [value, setValue] = useState<[number, number]>(config.priceBounds);
  return (
    <div>
      <p className="mb-3 text-[12px] font-semibold text-ink">
        ₹{value[0]} - ₹{value[1]} Lakh
      </p>
      <Slider
        min={config.priceBounds[0]}
        max={config.priceBounds[1]}
        step={config.priceBounds[1] > 10 ? 1 : 0.1}
        value={value}
        onValueChange={(v) => setValue(v as [number, number])}
      />
      <ApplyButton onClick={() => onApply(value)} />
    </div>
  );
}

function BodyTypePanel({ config, onApply }: { config: CategoryFilterConfig; onApply: (subType: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      {config.subTypeOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onApply(opt.value)}
          className="focus-ring rounded-md px-2.5 py-2 text-left text-[12.5px] text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function RangePanel({ config, onApply }: { config: CategoryFilterConfig; onApply: (minRange: number) => void }) {
  const [value, setValue] = useState(config.rangeBounds[0]);
  return (
    <div>
      <p className="mb-3 text-[12px] font-semibold text-ink">
        Minimum {value} km{value === config.rangeBounds[1] ? "+" : ""}
      </p>
      <Slider
        min={config.rangeBounds[0]}
        max={config.rangeBounds[1]}
        step={10}
        value={[value]}
        onValueChange={(v) => setValue((v as number[])[0])}
      />
      <ApplyButton onClick={() => onApply(value)} />
    </div>
  );
}

function ChargingPanel({ onApply }: { onApply: (charging: ChargingBucket) => void }) {
  return (
    <div className="flex flex-col gap-1">
      {CHARGING_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onApply(opt.value)}
          className="focus-ring rounded-md px-2.5 py-2 text-left text-[12.5px] text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function AllFiltersPanel({
  category,
  config,
  onApply,
}: {
  category: VehicleCategory;
  config: CategoryFilterConfig;
  onApply: (state: Partial<ListingFilterState>) => void;
}) {
  const vehicles = getVehiclesByCategory(category);
  const oemOptions = oems.filter((oem) => oem.categories.includes(category));
  const seatOptions = Array.from(
    new Set(vehicles.map((v) => v.seatingCapacity).filter((s): s is number => s != null)),
  ).sort((a, b) => a - b);

  const [state, setState] = useState<ListingFilterState>(() => defaultFilterState(config));

  const activeFilterCount =
    state.oems.length +
    (state.price[0] !== config.priceBounds[0] || state.price[1] !== config.priceBounds[1] ? 1 : 0) +
    (state.subType !== "all" ? 1 : 0) +
    (state.minRange !== config.rangeBounds[0] ? 1 : 0) +
    (state.minBattery !== config.batteryBounds[0] ? 1 : 0) +
    (state.charging !== "any" ? 1 : 0) +
    state.seats.length +
    state.availability.length;

  return (
    <div className={cn("flex max-h-[70vh] flex-col overflow-y-auto")}>
      <FilterBar
        oemOptions={oemOptions}
        selectedOems={state.oems}
        onOemsChange={(next) => setState((s) => ({ ...s, oems: next }))}
        priceRange={state.price}
        priceBounds={config.priceBounds}
        onPriceChange={(next) => setState((s) => ({ ...s, price: next }))}
        onPriceCommit={(next) => setState((s) => ({ ...s, price: next }))}
        subType={state.subType}
        subTypeLabel={config.subTypeLabel}
        subTypeOptions={config.subTypeOptions}
        onSubTypeChange={(next) => setState((s) => ({ ...s, subType: next }))}
        sort={state.sort}
        onSortChange={(next) => setState((s) => ({ ...s, sort: next }))}
        minRange={state.minRange}
        rangeBounds={config.rangeBounds}
        onMinRangeChange={(next) => setState((s) => ({ ...s, minRange: next }))}
        onMinRangeCommit={(next) => setState((s) => ({ ...s, minRange: next }))}
        minBattery={state.minBattery}
        batteryBounds={config.batteryBounds}
        onMinBatteryChange={(next) => setState((s) => ({ ...s, minBattery: next }))}
        onMinBatteryCommit={(next) => setState((s) => ({ ...s, minBattery: next }))}
        charging={state.charging}
        onChargingChange={(next) => setState((s) => ({ ...s, charging: next }))}
        seatOptions={seatOptions}
        selectedSeats={state.seats}
        onSeatsChange={(next) => setState((s) => ({ ...s, seats: next }))}
        availabilityOptions={ALL_AVAILABILITY}
        selectedAvailability={state.availability}
        onAvailabilityChange={(next) => setState((s) => ({ ...s, availability: next }))}
        activeFilterCount={activeFilterCount}
        onClearAll={() => setState(defaultFilterState(config))}
      />
      <button
        type="button"
        onClick={() => onApply(state)}
        className="focus-ring sticky bottom-0 mt-4 w-full shrink-0 rounded-md bg-primary py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Apply Filters
      </button>
    </div>
  );
}
