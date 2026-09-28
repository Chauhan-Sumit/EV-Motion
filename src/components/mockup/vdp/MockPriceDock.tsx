"use client";

import { useEffect, useState } from "react";
import { ChevronRight, GitCompareArrows } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";
import { formatPriceRangeLakh } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * MOCKUP mobile price dock.
 *
 * Below `lg` the sticky sub-nav has no room for the primary CTA, so it moves
 * to a bottom dock that appears once the hero's price panel has scrolled out
 * of view — the action is always reachable without stealing space from the
 * page while the price is still on screen.
 */
export function MockPriceDock({ vehicle }: { vehicle: VehicleDetail }) {
  const pricing = useVehiclePricing(vehicle);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("mock-subnav-sentinel");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[1.1px] text-ink-muted">
            Ex-showroom {pricing.cityName}
          </p>
          <p className="truncate text-[14px] font-extrabold tabular-nums text-ink">
            {formatPriceRangeLakh(pricing.exShowroomRangeLakh[0], pricing.exShowroomRangeLakh[1], " – ")}
          </p>
        </div>

        <button
          type="button"
          aria-label="Add to compare"
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <GitCompareArrows size={17} />
        </button>

        <button
          type="button"
          className="focus-ring flex h-11 shrink-0 items-center gap-1 rounded-xl bg-primary px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-primary-hover"
        >
          Get On-Road Price
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
