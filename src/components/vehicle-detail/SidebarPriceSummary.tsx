"use client";

import type { VehicleDetail } from "@/types/vehicle-detail";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";

function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Every row here comes from the centralized `useVehiclePricing` snapshot —
 * the same one `VehiclePriceCard`, `SidebarEmiCalculator`, and
 * `SectionCompareSimilar` read — so this card can never drift from the rest
 * of the page's pricing. Uses the low end of the vehicle's price range,
 * matching `startingPrice`'s existing "from" framing elsewhere on the VDP.
 */
export function SidebarPriceSummary({ vehicle }: { vehicle: VehicleDetail }) {
  const pricing = useVehiclePricing(vehicle);
  const { exShowroom, registration, roadTax, insurance, otherCharges, onRoad } = pricing.breakdown.low;

  const rows = [
    { label: "Ex-showroom price", value: exShowroom },
    { label: "Registration / RTO", value: registration },
    { label: "Road Tax", value: roadTax },
    { label: "Insurance (est.)", value: insurance },
    { label: "Other Charges (est.)", value: otherCharges },
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
          <span className="text-[12px] font-bold text-ink">Estimated On-road price</span>
          <span className="text-sm font-extrabold text-primary">{formatINR(onRoad)}</span>
        </div>
        <p className="mt-2 text-[10px] text-ink-muted">
          Estimated for {pricing.cityName}, {pricing.stateName} — confirm with your dealer.
        </p>
      </div>
    </div>
  );
}
