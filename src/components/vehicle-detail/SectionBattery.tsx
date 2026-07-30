import type { ComponentType } from "react";
import { BatteryCharging, Cable, Clock, Gauge, Plug, Zap } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";

function SpecRow({ icon: Icon, label, value }: { icon: ComponentType<{ size?: number }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-[13px] py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 text-[11px] text-ink-muted">
        <Icon size={13} />
        {label}
      </span>
      <span className="text-[12px] font-bold text-ink">{value}</span>
    </div>
  );
}

export function SectionBattery({ vehicle }: { vehicle: VehicleDetail }) {
  const { battery, charging } = vehicle;
  return (
    <VehicleSection id="battery" title="Battery & Charging">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-[13px] py-2.5">
            <BatteryCharging size={15} className="text-primary" />
            <h3 className="text-xs font-bold text-ink">Battery</h3>
          </div>
          <SpecRow icon={Gauge} label="Capacity" value={`${battery.capacityKwh} kWh`} />
          <SpecRow icon={Zap} label="Claimed Range" value={`${battery.araiRangeKm} km`} />
          <SpecRow icon={BatteryCharging} label="Chemistry" value={battery.chemistry} />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-[13px] py-2.5">
            <Plug size={15} className="text-primary" />
            <h3 className="text-xs font-bold text-ink">Charging</h3>
          </div>
          <SpecRow icon={Clock} label="DC Fast Charge" value={`${charging.dcFastChargeFromPct}–${charging.dcFastChargeToPct}% in ${charging.dcFastChargeMinutes} min`} />
          <SpecRow icon={Clock} label="AC Home Charging" value={`${charging.acHomeChargeHours} hrs (full)`} />
          <SpecRow icon={Cable} label="Charging Port" value={charging.connectorType} />
        </div>
      </div>
    </VehicleSection>
  );
}
