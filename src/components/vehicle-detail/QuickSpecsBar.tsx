import { BatteryCharging, Gauge, Shield, Timer, Zap, Activity } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Container } from "@/components/ui/Container";

export function QuickSpecsBar({ vehicle }: { vehicle: VehicleDetail }) {
  const q = vehicle.quickSpecs;
  // This strip is a highlight reel, not a spec sheet — a stat with no sourced
  // value is dropped rather than shown as an empty "Not specified" tile. The
  // full picture, including what's missing, is in the Overview and Battery &
  // Charging sections below, which do render the gaps explicitly.
  const stats = [
    { icon: Gauge, label: "Range", value: `${q.rangeKm} km` },
    { icon: BatteryCharging, label: "Battery", value: `${q.batteryKwh} kWh` },
    q.powerKw !== undefined && { icon: Zap, label: "Power", value: `${q.powerKw} kW` },
    q.torqueNm !== undefined && { icon: Activity, label: "Torque", value: `${q.torqueNm} Nm` },
    q.fastChargeMinutes !== undefined && {
      icon: Timer,
      label: "Charging",
      value: `${q.fastChargeMinutes} min (${q.fastChargeFromPct}–${q.fastChargeToPct}%)`,
    },
    q.warrantyYears !== undefined && {
      icon: Shield,
      label: "Warranty",
      value: q.warrantyKm !== undefined ? `${q.warrantyYears} yr / ${(q.warrantyKm / 1000).toFixed(0)}k km` : `${q.warrantyYears} yr`,
    },
  ].filter((stat): stat is { icon: typeof Gauge; label: string; value: string } => Boolean(stat));

  return (
    <div className="border-y border-border bg-surface-secondary">
      <Container className="py-3.5">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <Icon size={15} />
              </span>
              <div className="min-w-0">
                <dt className="text-[9px] text-ink-muted">{label}</dt>
                <dd className="truncate text-[12px] font-bold text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
