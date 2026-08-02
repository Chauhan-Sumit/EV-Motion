"use client";

import { useMemo, useState } from "react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";
import { calculateEmi } from "@/lib/vehicle-pricing";

function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

const TENURES = [12, 24, 36, 48, 60] as const;
const INTEREST_RATE = 9.5;

/**
 * Principal is based on the centralized on-road price (low end) from
 * `useVehiclePricing` — the same snapshot `VehiclePriceCard`/`SidebarPriceSummary`
 * use — so changing the selected city recomputes the EMI too, not just the
 * price display above it. Previously this calculator was based on a flat
 * `vehicle.startingPrice` that never varied by city, which was a real gap
 * against "every pricing widget updates when the city changes."
 */
export function SidebarEmiCalculator({ vehicle }: { vehicle: VehicleDetail }) {
  const pricing = useVehiclePricing(vehicle);
  const price = pricing.breakdown.low.onRoad;
  const [downPct, setDownPct] = useState(20);
  const [tenure, setTenure] = useState<(typeof TENURES)[number]>(36);

  const downPayment = Math.round((price * downPct) / 100);
  const principal = price - downPayment;
  const { emi } = useMemo(
    () => calculateEmi({ principal, annualRatePct: INTEREST_RATE, tenureMonths: tenure }),
    [principal, tenure],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">EMI Calculator</h3>
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between">
          <label htmlFor="down-payment" className="text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
            Down payment
          </label>
          <span className="text-[10px] font-semibold text-ink">{downPct}% · {formatINR(downPayment)}</span>
        </div>
        <input
          id="down-payment"
          type="range"
          min={10}
          max={80}
          step={5}
          value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
          className="mt-1.5 w-full accent-primary"
        />

        <label htmlFor="tenure" className="mb-1 mt-3 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Loan tenure
        </label>
        <select
          id="tenure"
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value) as (typeof TENURES)[number])}
          className="focus-ring w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-[7px] text-xs text-ink outline-none"
        >
          {TENURES.map((m) => (
            <option key={m} value={m}>{m} months</option>
          ))}
        </select>

        <div className="mt-3 rounded-lg bg-primary-tint p-3">
          <p className="text-[10px] text-ink-secondary">Estimated monthly EMI</p>
          <p className="text-lg font-extrabold text-primary">{formatINR(Math.round(emi))}</p>
        </div>
        <p className="mt-2 text-[10px] text-ink-muted">
          Based on the estimated on-road price for {pricing.cityName}, at {INTEREST_RATE}% p.a. Actual rate depends on your lender.
        </p>
      </div>
    </div>
  );
}
