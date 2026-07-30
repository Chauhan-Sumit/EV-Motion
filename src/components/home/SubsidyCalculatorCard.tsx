"use client";

import { useState } from "react";

const STATES = ["Delhi", "Maharashtra", "Karnataka", "Gujarat"];
const VEHICLE_TYPES = ["Electric Car", "Electric Scooter"];

export function SubsidyCalculatorCard() {
  const [state, setState] = useState(STATES[0]);
  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES[0]);

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
          onChange={(e) => setState(e.target.value)}
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
          onChange={(e) => setVehicleType(e.target.value)}
          className="focus-ring mb-2.5 w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-[7px] text-xs text-ink outline-none"
        >
          {VEHICLE_TYPES.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>

        <button
          type="button"
          className="focus-ring w-full rounded-[5px] bg-primary py-[9px] text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Check Subsidy ›
        </button>
      </div>
    </div>
  );
}
