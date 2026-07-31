"use client";

import { useState } from "react";

const STATES = ["Delhi", "Maharashtra", "Karnataka", "Gujarat"] as const;
const VEHICLE_TYPES = ["Electric Car", "Electric Scooter"] as const;

// Same ballpark ceilings already quoted (not fabricated per-state figures) in
// the VDP's own Ownership Tools > Subsidy Calculator card — kept in sync so
// the two calculators never contradict each other.
const SUBSIDY_CEILING: Record<(typeof VEHICLE_TYPES)[number], string> = {
  "Electric Car": "up to ₹1,50,000",
  "Electric Scooter": "up to ₹30,000",
};

export function SubsidyCalculatorCard() {
  const [state, setState] = useState<(typeof STATES)[number]>(STATES[0]);
  const [vehicleType, setVehicleType] = useState<(typeof VEHICLE_TYPES)[number]>(VEHICLE_TYPES[0]);
  const [result, setResult] = useState<string | null>(null);

  function checkSubsidy() {
    setResult(
      `${state} buyers of an ${vehicleType.toLowerCase()} may be eligible for a state subsidy ${SUBSIDY_CEILING[vehicleType]}, plus a road tax/registration waiver in many EV-friendly states. Confirm the exact eligibility and amount with ${state}'s official EV policy.`,
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">EV Subsidy Calculator</h3>
      </div>
      <div className="p-3.5">
        <p className="mb-2.5 text-[11px] text-ink-secondary">Check FAME-II &amp; state subsidy eligibility</p>

        <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          State
        </label>
        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value as (typeof STATES)[number]);
            setResult(null);
          }}
          className="focus-ring mb-2 w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-[7px] text-xs text-ink outline-none"
        >
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Vehicle Type
        </label>
        <select
          value={vehicleType}
          onChange={(e) => {
            setVehicleType(e.target.value as (typeof VEHICLE_TYPES)[number]);
            setResult(null);
          }}
          className="focus-ring mb-2.5 w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-[7px] text-xs text-ink outline-none"
        >
          {VEHICLE_TYPES.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={checkSubsidy}
          className="focus-ring w-full rounded-[5px] bg-primary py-[9px] text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Check Subsidy ›
        </button>

        {result ? (
          <p className="mt-2.5 rounded-md bg-primary-tint p-2.5 text-[10.5px] leading-relaxed text-ink-secondary">
            {result}
          </p>
        ) : null}
      </div>
    </div>
  );
}
