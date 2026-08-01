"use client";

import { HandCoins } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { UnavailableValue } from "../UnavailableValue";
import { useLocation } from "@/context/LocationContext";
import { chargesForState } from "@/lib/data/state-charges";
import { onRoadPriceBreakdown, estimateMonthlyChargingCost } from "@/lib/pricing";
import { NOT_SPECIFIED } from "@/lib/compare/metrics";

function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Ownership cost comparison — every number here is either a real field or a formula-based estimate labeled as such; nothing is invented per-vehicle (maintenance/service/resale genuinely have no source data, so they render honestly rather than guessed). */
export function OwnershipSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const { city } = useLocation();
  const charges = chargesForState(city.state);

  const annualCharging = vehicles.map((v) => estimateMonthlyChargingCost(v.sourceVehicle, 8) * 12);
  const annualInsurance = vehicles.map((v) => onRoadPriceBreakdown(v.startingPrice, charges).insurance);
  const roadTax = vehicles.map((v) => onRoadPriceBreakdown(v.startingPrice, charges).registration);
  const fiveYearCost = vehicles.map(
    (v, i) => onRoadPriceBreakdown(v.startingPrice, charges).onRoad + annualCharging[i] * 5 + annualInsurance[i] * 4,
  );

  const fiveYearWinnerIndex = (() => {
    const min = Math.min(...fiveYearCost);
    const winners = fiveYearCost.filter((c) => c === min);
    return winners.length === 1 ? fiveYearCost.indexOf(min) : -1;
  })();

  const rows: { label: string; render: (i: number) => string }[] = [
    { label: "Annual Charging Cost (est.)", render: (i) => formatINR(annualCharging[i]) },
    { label: "Annual Insurance (est.)", render: (i) => formatINR(annualInsurance[i]) },
    { label: `Road Tax / Registration, ${city.name} (est.)`, render: (i) => formatINR(roadTax[i]) },
    { label: "Annual Maintenance", render: () => NOT_SPECIFIED },
    { label: "Service Cost", render: () => NOT_SPECIFIED },
    { label: "Battery Replacement Estimate", render: () => NOT_SPECIFIED },
    {
      label: "Battery Warranty",
      render: (i) => {
        const w = vehicles[i].sourceVehicle.specs?.warranty;
        return w?.batteryYears ? `${w.batteryYears} yrs${w.batteryKm ? ` / ${w.batteryKm.toLocaleString("en-IN")} km` : ""}` : NOT_SPECIFIED;
      },
    },
    { label: "Resale Value Estimate", render: () => NOT_SPECIFIED },
  ];

  return (
    <CompareSectionCard
      id="ownership"
      title="Ownership Cost"
      description="Estimated cost of owning each vehicle — some categories (maintenance, resale) have no reliable published data yet and are shown honestly rather than guessed."
      icon={HandCoins}
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
                {vehicles.map((v, i) => {
                  const value = row.render(i);
                  return (
                    <td key={v.slug} className="px-3.5 py-3 text-center text-[12px] text-ink">
                      {value === NOT_SPECIFIED ? <UnavailableValue /> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-primary-tint/40">
              <th scope="row" className="px-3.5 py-3.5 text-[12.5px] font-extrabold text-ink">
                5-Year Cost (on-road + charging + insurance est.)
              </th>
              {vehicles.map((v, i) => (
                <td
                  key={v.slug}
                  className={`px-3.5 py-3.5 text-center text-[14px] font-extrabold ${i === fiveYearWinnerIndex ? "text-primary" : "text-ink"}`}
                >
                  {formatINR(fiveYearCost[i])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </CompareSectionCard>
  );
}
