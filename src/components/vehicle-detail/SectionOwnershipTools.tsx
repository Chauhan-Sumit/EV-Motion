import { TrendingUp, BatteryCharging, LineChart, PiggyBank } from "lucide-react";
import type { ComponentType } from "react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";
import { Disclosure } from "./Disclosure";

const TOOL_ICONS: Record<VehicleDetail["ownershipTools"][number]["id"], ComponentType<{ size?: number; className?: string }>> = {
  "running-cost": TrendingUp,
  "charging-cost": BatteryCharging,
  "price-history": LineChart,
  subsidy: PiggyBank,
};

export function SectionOwnershipTools({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <VehicleSection id="ownership-tools" title="Ownership Tools" description="Calculate and plan your EV ownership.">
      <div className="grid gap-3.5 sm:grid-cols-2">
        {vehicle.ownershipTools.map((tool) => {
          const Icon = TOOL_ICONS[tool.id];
          return (
            <div key={tool.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <Disclosure
                title={tool.title}
                subtitle={tool.summary}
                icon={<Icon size={16} className="text-primary" />}
              >
                <dl className="space-y-2">
                  {tool.rows.map((row) => (
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
