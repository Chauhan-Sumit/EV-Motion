"use client";

import { TrendingUp, BatteryCharging, LineChart, PiggyBank } from "lucide-react";
import type { ComponentType } from "react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";
import { Disclosure } from "./Disclosure";
import { useLocation } from "@/context/LocationContext";
import { subsidyRowsForState } from "@/lib/data/state-charges";

const TOOL_ICONS: Record<VehicleDetail["ownershipTools"][number]["id"], ComponentType<{ size?: number; className?: string }>> = {
  "running-cost": TrendingUp,
  "charging-cost": BatteryCharging,
  "price-history": LineChart,
  subsidy: PiggyBank,
};

export function SectionOwnershipTools({ vehicle }: { vehicle: VehicleDetail }) {
  const { city } = useLocation();

  return (
    <VehicleSection id="ownership-tools" title="Ownership Tools" description="Calculate and plan your EV ownership.">
      <div className="grid gap-3.5 sm:grid-cols-2">
        {vehicle.ownershipTools.map((tool) => {
          const Icon = TOOL_ICONS[tool.id];
          // The subsidy tool alone is recomputed for the globally-selected
          // city's state — the other three (running cost, charging cost,
          // price history) don't vary by location.
          const rows = tool.id === "subsidy" ? subsidyRowsForState(city.state, vehicle.category) : tool.rows;
          const subtitle = tool.id === "subsidy" ? `Estimated for ${city.state} — confirm eligibility with your state EV policy.` : tool.summary;
          return (
            <div key={tool.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <Disclosure title={tool.title} subtitle={subtitle} icon={<Icon size={16} className="text-primary" />}>
                <dl className="space-y-2">
                  {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3.5">
                      <dt className="text-[11px] text-ink-muted">{row.label}</dt>
                      <dd className="text-[12px] font-bold text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </Disclosure>
            </div>
          );
        })}
      </div>
    </VehicleSection>
  );
}
