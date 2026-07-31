"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ListFilter, Zap, Car, IndianRupee, LayoutGrid, Gauge, SlidersHorizontal } from "lucide-react";
import { VehicleSearchBox } from "@/components/search/VehicleSearchBox";

const FILTER_CHIPS = [
  { label: "Budget", icon: IndianRupee },
  { label: "Body Type", icon: LayoutGrid },
  { label: "Range", icon: Gauge },
  { label: "Charging Speed", icon: Zap },
  { label: "All Filters", icon: SlidersHorizontal },
];

export function SearchCard() {
  const router = useRouter();
  const [mode, setMode] = useState<"car" | "bike">("car");

  function browseAll() {
    router.push(mode === "car" ? "/cars" : "/two-wheelers");
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-popover sm:p-6">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-ink">Find Your Right EV</h2>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
            <MapPin size={13} />
            Delhi
          </span>
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
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={browseAll}
              className="focus-ring flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-border-strong px-3.5 py-[7px] text-[11px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <chip.icon size={12} />
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
