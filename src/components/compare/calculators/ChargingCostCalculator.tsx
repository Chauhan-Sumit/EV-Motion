"use client";

import { useMemo, useState } from "react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import type { VehicleCategory } from "@/types/vehicle";

const PUBLIC_CHARGING_RATE = 15; // ₹/unit — typical DC fast-charging public tariff, estimated
const PETROL_PRICE_PER_L = 105;
const DIESEL_PRICE_PER_L = 92;

const FUEL_KM_PER_L: Record<VehicleCategory, number> = { car: 15, "2-wheeler": 45, commercial: 10 };
const DIESEL_KM_PER_L: Record<VehicleCategory, number> = { car: 18, "2-wheeler": 45, commercial: 12 };

function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

/** Working charging-cost calculator — instant recompute, category-aware petrol/diesel comparison, all assumptions labeled. */
export function ChargingCostCalculator({ vehicles }: { vehicles: VehicleDetail[] }) {
  const category = vehicles[0].category;

  const defaultEfficiency = useMemo(() => {
    const avg =
      vehicles.reduce((sum, v) => sum + v.quickSpecs.batteryKwh / (v.quickSpecs.rangeKm / 100), 0) / vehicles.length;
    return Math.round(avg * 10) / 10;
  }, [vehicles]);

  const [electricityRate, setElectricityRate] = useState(8);
  const [monthlyDistance, setMonthlyDistance] = useState(category === "2-wheeler" ? 750 : 1200);
  const [efficiency, setEfficiency] = useState(defaultEfficiency);
  const [homeChargingPct, setHomeChargingPct] = useState(80);

  const monthlyKwh = (monthlyDistance / 100) * efficiency;
  const blendedRate = (homeChargingPct / 100) * electricityRate + (1 - homeChargingPct / 100) * PUBLIC_CHARGING_RATE;
  const monthlyCost = monthlyKwh * blendedRate;
  const yearlyCost = monthlyCost * 12;

  const petrolMonthlyCost = (monthlyDistance / FUEL_KM_PER_L[category]) * PETROL_PRICE_PER_L;
  const dieselMonthlyCost = (monthlyDistance / DIESEL_KM_PER_L[category]) * DIESEL_PRICE_PER_L;
  const savingsVsPetrol = (petrolMonthlyCost - monthlyCost) * 12;
  const savingsVsDiesel = (dieselMonthlyCost - monthlyCost) * 12;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-[13px] font-bold text-ink">Charging Cost Calculator</h3>
      <p className="mt-1 text-[10.5px] text-ink-muted">
        Estimated — assumes ₹{PUBLIC_CHARGING_RATE}/unit for public charging and ₹{PETROL_PRICE_PER_L}/₹{DIESEL_PRICE_PER_L} per litre for petrol/diesel.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-3.5">
          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
              Electricity Rate
              <span className="font-bold text-ink">₹{electricityRate.toFixed(1)}/unit</span>
            </span>
            <input
              type="range"
              min={4}
              max={14}
              step={0.5}
              value={electricityRate}
              onChange={(e) => setElectricityRate(Number(e.target.value))}
              style={{ accentColor: "var(--primary)" }}
              className="mt-1.5 w-full"
              aria-label="Electricity rate per unit"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
              Monthly Distance
              <span className="font-bold text-ink">{monthlyDistance.toLocaleString("en-IN")} km</span>
            </span>
            <input
              type="range"
              min={100}
              max={4000}
              step={100}
              value={monthlyDistance}
              onChange={(e) => setMonthlyDistance(Number(e.target.value))}
              style={{ accentColor: "var(--primary)" }}
              className="mt-1.5 w-full"
              aria-label="Monthly distance driven"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
              Efficiency
              <span className="font-bold text-ink">{efficiency.toFixed(1)} kWh/100km</span>
            </span>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value))}
              style={{ accentColor: "var(--primary)" }}
              className="mt-1.5 w-full"
              aria-label="Efficiency in kWh per 100km"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
              Home Charging
              <span className="font-bold text-ink">{homeChargingPct}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={homeChargingPct}
              onChange={(e) => setHomeChargingPct(Number(e.target.value))}
              style={{ accentColor: "var(--primary)" }}
              className="mt-1.5 w-full"
              aria-label="Percentage of charging done at home"
            />
          </label>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-lg bg-surface-secondary p-3.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Monthly Cost</p>
              <p className="text-[15px] font-extrabold text-primary">{formatINR(monthlyCost)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Yearly Cost</p>
              <p className="text-[15px] font-extrabold text-primary">{formatINR(yearlyCost)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-border pt-2.5">
            <div>
              <p className="text-[10px] text-ink-muted">Savings vs Petrol / yr</p>
              <p className="text-[12.5px] font-bold text-ink">{formatINR(savingsVsPetrol)}</p>
            </div>
            <div>
              <p className="text-[10px] text-ink-muted">Savings vs Diesel / yr</p>
              <p className="text-[12.5px] font-bold text-ink">{formatINR(savingsVsDiesel)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
