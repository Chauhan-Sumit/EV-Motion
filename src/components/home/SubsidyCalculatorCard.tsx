"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CITIES } from "@/lib/data/cities";
import { subsidyMessageForState } from "@/lib/data/state-charges";
import { useLocation } from "@/context/LocationContext";
import type { VehicleCategory } from "@/types/vehicle";

// Every state/UT that appears in the real location system — kept in sync
// with cities.ts rather than a second, disconnected list.
const STATES = Array.from(new Set(CITIES.map((c) => c.state))).sort();

const VEHICLE_TYPES = ["Electric Car", "Electric Scooter"] as const;
const VEHICLE_TYPE_TO_CATEGORY: Record<(typeof VEHICLE_TYPES)[number], VehicleCategory> = {
  "Electric Car": "car",
  "Electric Scooter": "2-wheeler",
};

export function SubsidyCalculatorCard() {
  // `useId` rather than hardcoded ids — this card renders in the homepage
  // sidebar, and a duplicate id would silently break the association it exists
  // to create.
  const stateId = useId();
  const vehicleTypeId = useId();
  const { city } = useLocation();
  const [state, setState] = useState<string>(city.state);
  const [vehicleType, setVehicleType] = useState<(typeof VEHICLE_TYPES)[number]>(VEHICLE_TYPES[0]);
  const [result, setResult] = useState<string | null>(null);
  const stateTouched = useRef(false);

  // Keep this in sync with the globally-selected city until the user
  // explicitly picks a different state themselves — otherwise the dropdown
  // is stuck on the server's pre-hydration "Delhi" default forever, even
  // after the real city (from localStorage) loads in.
  useEffect(() => {
    if (!stateTouched.current) setState(city.state);
  }, [city.state]);

  function checkSubsidy() {
    setResult(subsidyMessageForState(state, VEHICLE_TYPE_TO_CATEGORY[vehicleType]));
  }

  return (
    <div id="subsidy-calculator" className="scroll-mt-20 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">EV Subsidy Calculator</h3>
      </div>
      <div className="p-3.5">
        <p className="mb-2.5 text-[11px] text-ink-secondary">Check FAME-II &amp; state subsidy eligibility</p>

        {/* htmlFor/id pairing, not just visual proximity: without it a screen
            reader announces these as an unlabelled combo box. Found by the
            2026-08-21 audit (Lighthouse `select-name`). */}
        <label htmlFor={stateId} className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          State
        </label>
        <select
          id={stateId}
          value={state}
          onChange={(e) => {
            stateTouched.current = true;
            setState(e.target.value);
            setResult(null);
          }}
          className="focus-ring mb-2 w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-[7px] text-xs text-ink outline-none"
        >
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label htmlFor={vehicleTypeId} className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Vehicle Type
        </label>
        <select
          id={vehicleTypeId}
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
