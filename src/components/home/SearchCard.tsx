"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Zap, Car, IndianRupee, LayoutGrid, Gauge, SlidersHorizontal } from "lucide-react";

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
  const [query, setQuery] = useState("");

  function handleSearch() {
    const base = mode === "car" ? "/cars" : "/two-wheelers";
    router.push(query.trim() ? `${base}?q=${encodeURIComponent(query.trim())}` : base);
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

          <div className="flex flex-1 items-center gap-2 rounded-lg border-[1.5px] border-border-strong bg-white px-3.5 py-2.5 focus-within:border-primary">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Type to select EV name or brand..."
              className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted"
            />
          </div>

          <button
            type="button"
            aria-label="Search"
            onClick={handleSearch}
            className="focus-ring flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 text-white transition-colors hover:bg-primary-hover"
          >
            <Search size={16} />
          </button>
        </div>

        <div className="scroll-row -mx-1 mt-3.5 flex gap-2 overflow-x-auto px-1 pb-0.5">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={handleSearch}
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
