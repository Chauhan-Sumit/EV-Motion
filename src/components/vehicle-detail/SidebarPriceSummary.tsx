"use client";

import type { VehicleDetail } from "@/types/vehicle-detail";
import { useLocation } from "@/context/LocationContext";
import { chargesForState } from "@/lib/data/state-charges";
import { onRoadPriceBreakdown } from "@/lib/pricing";

function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function SidebarPriceSummary({ vehicle }: { vehicle: VehicleDetail }) {
  const { city } = useLocation();
  const charges = chargesForState(city.state);
  const breakdown = onRoadPriceBreakdown(vehicle.startingPrice, charges);
  const { exShowroom, registration, registrationLabel, insurance, onRoad } = breakdown;

  const rows = [
    { label: "Ex-showroom price", value: exShowroom },
    { label: registrationLabel, value: registration },
    { label: "Insurance (est.)", value: insurance },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">Price Summary</h3>
      </div>
      <div className="p-3.5">
        <dl className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <dt className="text-[11px] text-ink-muted">{row.label}</dt>
              <dd className="text-[11px] font-semibold text-ink">{formatINR(row.value)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-[12px] font-bold text-ink">On-road price</span>
          <span className="text-sm font-extrabold text-primary">{formatINR(onRoad)}</span>
        </div>
        <p className="mt-2 text-[10px] text-ink-muted">Estimated for {city.name}, {city.state} — confirm with your dealer.</p>
      </div>
    </div>
  );
}
