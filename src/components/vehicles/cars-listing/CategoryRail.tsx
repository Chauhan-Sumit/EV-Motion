"use client";

import { TYPICAL_DIMS } from "@/lib/compare/showroom/outline";
import { EMPTY_FILTERS, isLuxury, LAST_STEP, LUXURY_MIN_STEP, PRICE_STEPS } from "@/lib/cars-listing/filters";
import { paintFrom } from "@/lib/cars-listing/paint";
import type { CarBodyType } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { useCarsListing } from "./ListingContext";
import { ListingCarArt } from "./ListingCarArt";
import { SHADOW_2 } from "./ui";

type CategoryKey = "all" | CarBodyType | "lux";

/** The rail's tiles: label, the car drawn on the tile, and the tile's paint — all from the approved design. */
const CATEGORIES: { key: CategoryKey; label: string; artSlug: string; body: CarBodyType; paint: string }[] = [
  { key: "all", label: "All EVs", artSlug: "tata-nexon-ev", body: "suv", paint: "#1C7C82" },
  { key: "hatchback", label: "Hatchback", artSlug: "tata-tiago-ev", body: "hatchback", paint: "#E6E8EB" },
  { key: "suv", label: "SUV", artSlug: "tata-curvv-ev", body: "suv", paint: "#C8642A" },
  { key: "sedan", label: "Sedan", artSlug: "byd-seal", body: "sedan", paint: "#2F5FB3" },
  { key: "muv", label: "MPV", artSlug: "byd-emax-7", body: "muv", paint: "#AEB4BC" },
  { key: "lux", label: "Luxury", artSlug: "bmw-i7", body: "sedan", paint: "#25282E" },
];

export function CategoryRail() {
  const { cars, filters, setFilters, scrollToResults } = useCarsListing();
  const lux = isLuxury(filters);

  const count = (key: CategoryKey) =>
    key === "all" ? cars.length : key === "lux" ? cars.filter((c) => c.price[0] >= PRICE_STEPS[LUXURY_MIN_STEP]).length : cars.filter((c) => c.body === key).length;

  const pressed = (key: CategoryKey) =>
    key === "all" ? !filters.body.length && !lux : key === "lux" ? lux : filters.body.length === 1 && filters.body[0] === key;

  function choose(key: CategoryKey) {
    setFilters((f) => {
      if (key === "all") return { ...f, body: [], ...(isLuxury(f) ? { pmin: EMPTY_FILTERS.pmin, pmax: EMPTY_FILTERS.pmax } : {}) };
      if (key === "lux") return isLuxury(f) ? { ...f, pmin: 0, pmax: LAST_STEP } : { ...f, pmin: LUXURY_MIN_STEP, pmax: LAST_STEP };
      return { ...f, body: f.body.length === 1 && f.body[0] === key ? [] : [key] };
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
        const art = cars.find((c) => c.slug === cat.artSlug)?.art ?? TYPICAL_DIMS[cat.body];
        const on = pressed(cat.key);
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
            <span aria-hidden="true" className="grid h-11 w-[76px] flex-none place-items-center rounded-[10px] bg-[radial-gradient(80%_70%_at_50%_100%,#EEF1F4,transparent_72%)] max-[760px]:h-9 max-[760px]:w-[60px]">
              <ListingCarArt dims={art} body={cat.body} paint={paintFrom(cat.paint)} frame={{ lengthMm: 5000, heightMm: 1800 }} detail={false} alt="" />
            </span>
            <span className="min-w-0">
              <b className={cn("block truncate text-[14.5px] font-semibold", on && "text-[#0B6629]")}>{cat.label}</b>
              <span className="block whitespace-nowrap text-[12.5px] text-ink-muted">{count(cat.key)} models</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
