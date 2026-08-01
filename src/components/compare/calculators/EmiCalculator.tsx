"use client";

import { useMemo, useState } from "react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { calculateEmi } from "@/lib/pricing";

function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

/** Working EMI calculator — instant recompute on every input change, standard reducing-balance amortization. */
export function EmiCalculator({ vehicles }: { vehicles: VehicleDetail[] }) {
  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRatePct, setInterestRatePct] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(60);

  const vehicle = vehicles[vehicleIndex] ?? vehicles[0];
  const price = vehicle.startingPrice;
  const downPayment = Math.round(price * (downPaymentPct / 100));
  const principal = price - downPayment;

  const result = useMemo(
    () => calculateEmi({ principal, annualRatePct: interestRatePct, tenureMonths }),
    [principal, interestRatePct, tenureMonths],
  );

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-[13px] font-bold text-ink">EMI Calculator</h3>

      {vehicles.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vehicles.map((v, i) => (
            <button
              key={v.slug}
              type="button"
              onClick={() => setVehicleIndex(i)}
              aria-pressed={i === vehicleIndex}
              className={`focus-ring rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                i === vehicleIndex ? "bg-primary text-white" : "border border-border-strong text-ink-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-3.5">
          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
              Down Payment
              <span className="font-bold text-ink">
                {downPaymentPct}% ({formatINR(downPayment)})
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              style={{ accentColor: "var(--primary)" }}
              className="mt-1.5 w-full"
              aria-label="Down payment percentage"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
              Interest Rate
              <span className="font-bold text-ink">{interestRatePct}% p.a.</span>
            </span>
            <input
              type="range"
              min={6}
              max={16}
              step={0.1}
              value={interestRatePct}
              onChange={(e) => setInterestRatePct(Number(e.target.value))}
              style={{ accentColor: "var(--primary)" }}
              className="mt-1.5 w-full"
              aria-label="Interest rate"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
              Loan Tenure
              <span className="font-bold text-ink">{tenureMonths} months</span>
            </span>
            <input
              type="range"
              min={12}
              max={84}
              step={12}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              style={{ accentColor: "var(--primary)" }}
              className="mt-1.5 w-full"
              aria-label="Loan tenure in months"
            />
          </label>

          <p className="text-[10.5px] text-ink-muted">Loan amount: {formatINR(principal)}</p>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-lg bg-surface-secondary p-3.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Monthly EMI</p>
            <p className="text-xl font-extrabold text-primary">{formatINR(result.emi)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-border pt-2.5">
            <div>
              <p className="text-[10px] text-ink-muted">Total Interest</p>
              <p className="text-[12.5px] font-bold text-ink">{formatINR(result.totalInterest)}</p>
            </div>
            <div>
              <p className="text-[10px] text-ink-muted">Total Cost</p>
              <p className="text-[12.5px] font-bold text-ink">{formatINR(result.totalCost + downPayment)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
