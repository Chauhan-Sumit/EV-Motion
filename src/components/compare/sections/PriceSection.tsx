"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { LocationSelector } from "@/components/layout/LocationSelector";
import { useLocation } from "@/context/LocationContext";
import { chargesForState } from "@/lib/data/state-charges";
import { onRoadPriceBreakdown } from "@/lib/pricing";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { WINNER_METRICS } from "@/lib/compare/metrics";
import { EmiCalculator } from "../calculators/EmiCalculator";

const FASTAG_FEE = 600;
const OTHER_CHARGES = 1500;

function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

/** Price comparison — the page's flagship section: city-aware on-road breakdown per vehicle, plus a working EMI calculator. */
export function PriceSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const { city } = useLocation();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const charges = chargesForState(city.state);
  const breakdowns = vehicles.map((v) => onRoadPriceBreakdown(v.startingPrice, charges));
  const totals = breakdowns.map((b) => b.onRoad + FASTAG_FEE + OTHER_CHARGES);

  const priceWinner = computeWinners(vehicles, WINNER_METRICS.filter((m) => m.key === "price")).metricResults[0];

  const rows: { label: string; values: number[] }[] = [
    { label: "Ex-showroom Price", values: breakdowns.map((b) => b.exShowroom) },
    { label: breakdowns[0]?.registrationLabel ?? "RTO & Registration", values: breakdowns.map((b) => b.registration) },
    { label: "Insurance (est.)", values: breakdowns.map((b) => b.insurance) },
    { label: "FASTag (est.)", values: vehicles.map(() => FASTAG_FEE) },
    { label: "Logistics & Handling (est.)", values: vehicles.map(() => OTHER_CHARGES) },
  ];

  return (
    <VehicleSection
      id="price"
      title="Price Comparison"
      description={`On-road price estimate for ${city.name}, ${city.state}. Change city to see how it affects the breakdown.`}
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
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0">
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
        Estimated for {city.name}, {city.state} — confirm with your dealer. Ex-showroom price is the same nationwide;
        RTO/registration and insurance vary by state.
      </p>

      <div className="mt-5">
        <EmiCalculator vehicles={vehicles} />
      </div>

      <LocationSelector open={cityPickerOpen} onOpenChange={setCityPickerOpen} />
    </VehicleSection>
  );
}
