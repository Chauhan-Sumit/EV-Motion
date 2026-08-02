"use client";

import { useState } from "react";
import { MapPin, Wallet } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { LocationSelector } from "@/components/layout/LocationSelector";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { WINNER_METRICS } from "@/lib/compare/metrics";
import { EmiCalculator } from "../calculators/EmiCalculator";

function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

/**
 * Price comparison — the page's flagship section. Every figure comes from
 * `getVehiclePricingSnapshot`, the same centralized function the VDP and
 * every other pricing widget site-wide uses — so the ex-showroom price
 * itself (not just the on-road extras) is city-adjusted, and there's no
 * separate FASTag/logistics constant duplicated here.
 */
export function PriceSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const { city } = useLocation();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const snapshots = vehicles.map((v) =>
    getVehiclePricingSnapshot({ vehicleId: v.id, vehicleName: v.name, exShowroomRangeLakh: v.priceRangeLakh, city }),
  );
  const breakdowns = snapshots.map((s) => s.breakdown.low);
  const totals = breakdowns.map((b) => b.onRoad);

  const priceWinner = computeWinners(vehicles, WINNER_METRICS.filter((m) => m.key === "price")).metricResults[0];

  const rows: { label: string; values: number[] }[] = [
    { label: "Ex-showroom Price", values: breakdowns.map((b) => b.exShowroom) },
    { label: "Registration / RTO", values: breakdowns.map((b) => b.registration) },
    { label: "Road Tax", values: breakdowns.map((b) => b.roadTax) },
    { label: "Insurance (est.)", values: breakdowns.map((b) => b.insurance) },
    { label: "Other Charges (est.)", values: breakdowns.map((b) => b.otherCharges) },
  ];

  return (
    <CompareSectionCard
      id="price"
      title="Price Comparison"
      description={`On-road price estimate for ${city.name}, ${city.state}. Change city to see how it affects the breakdown.`}
      icon={Wallet}
      headingAction={
        <button
          type="button"
          onClick={() => setCityPickerOpen(true)}
          className="focus-ring flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-[11.5px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <MapPin size={13} />
          {city.name}
        </button>
      }
    >
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary">
              <th scope="col" className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                Component
              </th>
              {vehicles.map((v) => (
                <th key={v.slug} scope="col" className="px-3.5 py-2.5 text-center text-[11.5px] font-bold text-ink">
                  {v.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.label}
                className={`border-b border-border transition-colors last:border-b-0 hover:bg-primary-tint/15 ${
                  rowIndex % 2 === 1 ? "bg-surface-secondary/40" : ""
                }`}
              >
                <th scope="row" className="px-3.5 py-3 text-[11.5px] font-semibold text-ink-secondary">
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td key={vehicles[i].slug} className="px-3.5 py-3 text-center text-[12px] text-ink">
                    {formatINR(value)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-primary-tint/40">
              <th scope="row" className="px-3.5 py-3.5 text-[12.5px] font-extrabold text-ink">
                Total On-Road Price
              </th>
              {totals.map((total, i) => {
                const isWinner = priceWinner?.state === "winner" && priceWinner.winnerIndex === i;
                return (
                  <td
                    key={vehicles[i].slug}
                    className={`px-3.5 py-3.5 text-center text-[14px] font-extrabold ${isWinner ? "text-primary" : "text-ink"}`}
                  >
                    {formatINR(total)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[10.5px] text-ink-muted">
        Estimated for {city.name}, {city.state} — confirm with your dealer. Ex-showroom price, registration, road tax,
        and insurance all vary by city.
      </p>

      <div className="mt-5">
        <EmiCalculator vehicles={vehicles} />
      </div>

      <LocationSelector open={cityPickerOpen} onOpenChange={setCityPickerOpen} />
    </CompareSectionCard>
  );
}
