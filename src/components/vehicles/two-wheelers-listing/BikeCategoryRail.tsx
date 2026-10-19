"use client";

import { BUDGET_MAX_STEP, EMPTY_FILTERS, isBudget, LONG_RANGE_KM, LOW_SPEED_KMPH, PRICE_STEPS, type BikeFilters } from "@/lib/two-wheelers-listing/filters";
import type { PricedBike } from "@/lib/two-wheelers-listing/types";
import type { TwoWheelerType } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { SHADOW_2 } from "@/components/vehicles/cars-listing/ui";
import { useBikesListing } from "./ListingContext";
import { BikeArt } from "./BikeArt";

type CategoryKey = "all" | TwoWheelerType | "budget" | "long" | "low";

/**
 * Six quick entry points, like the Electric Cars rail. Each tile maps to one
 * filter, shows how many models it holds, and toggles off when tapped again.
 */
const CATEGORIES: { key: CategoryKey; label: string; art: TwoWheelerType; paint: string }[] = [
  { key: "all", label: "All EVs", art: "scooter", paint: "#1C7C82" },
  { key: "scooter", label: "Scooters", art: "scooter", paint: "#2F5FB3" },
  { key: "motorcycle", label: "Motorcycles", art: "motorcycle", paint: "#1F2227" },
  { key: "budget", label: "Under ₹1 L", art: "scooter", paint: "#C8642A" },
  { key: "long", label: "Long range", art: "motorcycle", paint: "#2F6B4F" },
  { key: "low", label: "Low-speed", art: "scooter", paint: "#B3262E" },
];

const RULES: Record<Exclude<CategoryKey, "all">, { on: (f: BikeFilters) => boolean; set: (f: BikeFilters) => BikeFilters; off: (f: BikeFilters) => BikeFilters; test: (b: PricedBike) => boolean }> = {
  scooter: {
    on: (f) => f.type.length === 1 && f.type[0] === "scooter",
    set: (f) => ({ ...f, type: ["scooter"] }),
    off: (f) => ({ ...f, type: [] }),
    test: (b) => b.type === "scooter",
  },
  motorcycle: {
    on: (f) => f.type.length === 1 && f.type[0] === "motorcycle",
    set: (f) => ({ ...f, type: ["motorcycle"] }),
    off: (f) => ({ ...f, type: [] }),
    test: (b) => b.type === "motorcycle",
  },
  budget: {
    on: isBudget,
    set: (f) => ({ ...f, pmin: 0, pmax: BUDGET_MAX_STEP }),
    off: (f) => ({ ...f, pmin: EMPTY_FILTERS.pmin, pmax: EMPTY_FILTERS.pmax }),
    test: (b) => b.price[0] <= PRICE_STEPS[BUDGET_MAX_STEP],
  },
  long: {
    on: (f) => f.range === LONG_RANGE_KM,
    set: (f) => ({ ...f, range: LONG_RANGE_KM }),
    off: (f) => ({ ...f, range: 0 }),
    test: (b) => b.rangeKm >= LONG_RANGE_KM,
  },
  low: {
    on: (f) => f.speed === "low",
    set: (f) => ({ ...f, speed: "low" }),
    off: (f) => ({ ...f, speed: "" }),
    test: (b) => b.topSpeedKmph <= LOW_SPEED_KMPH,
  },
};

export function BikeCategoryRail() {
  const { bikes, filters, setFilters, scrollToResults } = useBikesListing();
  const anyOn = (Object.keys(RULES) as (keyof typeof RULES)[]).some((k) => RULES[k].on(filters));

  function choose(key: CategoryKey) {
    setFilters((f) => {
      if (key === "all") return (Object.values(RULES) as (typeof RULES)[keyof typeof RULES][]).reduce((s, r) => (r.on(s) ? r.off(s) : s), f);
      const rule = RULES[key];
      return rule.on(f) ? rule.off(f) : rule.set(f);
    });
    scrollToResults();
  }

  return (
    <div
      role="group"
      aria-label="Browse by category"
      className="relative z-[5] -mt-[46px] grid grid-cols-6 gap-3 max-[1240px]:-mt-10 max-[1240px]:grid-cols-3 max-[760px]:-mx-4 max-[760px]:-mt-[34px] max-[760px]:flex max-[760px]:snap-x max-[760px]:snap-mandatory max-[760px]:gap-2.5 max-[760px]:overflow-x-auto max-[760px]:px-4 max-[760px]:pb-2.5 max-[760px]:pt-1 max-[760px]:[scrollbar-width:none] max-[760px]:[&::-webkit-scrollbar]:hidden"
    >
      {CATEGORIES.map((cat) => {
        const on = cat.key === "all" ? !anyOn : RULES[cat.key].on(filters);
        const count = cat.key === "all" ? bikes.length : bikes.filter(RULES[cat.key].test).length;
        return (
          <button
            key={cat.key}
            type="button"
            aria-pressed={on}
            onClick={() => choose(cat.key)}
            className={cn(
              "flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-surface px-3.5 py-3 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#C9CED5] focus-ring max-[760px]:flex-none max-[760px]:snap-start max-[760px]:gap-2.5 max-[760px]:px-3 max-[760px]:py-2.5",
              on ? "border-primary bg-[linear-gradient(180deg,#F6FCF8,#fff)] shadow-[0_0_0_1px_var(--primary),0_12px_32px_-8px_rgba(16,24,40,.12),0_4px_10px_-4px_rgba(16,24,40,.06)]" : SHADOW_2,
            )}
          >
            <span aria-hidden="true" className="grid h-11 w-[60px] flex-none place-items-center rounded-[10px] bg-[radial-gradient(80%_70%_at_50%_100%,#EEF1F4,transparent_72%)] px-1 max-[760px]:h-9 max-[760px]:w-[52px]">
              <BikeArt type={cat.art} color={cat.paint} detail={false} alt="" />
            </span>
            <span className="min-w-0">
              <b className={cn("block truncate text-[14.5px] font-semibold", on && "text-[#0B6629]")}>{cat.label}</b>
              <span className="block whitespace-nowrap text-[12.5px] text-ink-muted">{cat.key === "long" ? `${LONG_RANGE_KM}+ km · ` : cat.key === "low" ? `≤${LOW_SPEED_KMPH} km/h · ` : ""}{count} models</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
