import { BatteryCharging, Gauge, Shield, Timer, Zap, Activity } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Container } from "@/components/ui/Container";
import { torqueMeasurementPointFor, TORQUE_POINT_LABEL } from "@/lib/vehicle-torque";
import { batteryBasisFor, BATTERY_BASIS_LABEL } from "@/lib/vehicle-battery";

export function QuickSpecsBar({ vehicle }: { vehicle: VehicleDetail }) {
  const q = vehicle.quickSpecs;
  // Same disclosure as the Compare page's Torque row: a scooter's 140 Nm is
  // measured at the wheel and another's 26 Nm at the motor shaft, and the
  // suffix is what stops a reader comparing them (CLAUDE.md #28(b2)).
  const torquePoint = torqueMeasurementPointFor(vehicle.sourceVehicle);
  // Same disclosure again for capacity: 105.2 kWh usable and 83.9 kWh gross
  // are different quantities, and this is where a reader first meets the
  // number (src/lib/vehicle-battery.ts). Unstamped vehicles — every
  // two-wheeler today — print the bare figure rather than claim a basis.
  const batteryBasis = batteryBasisFor(vehicle.sourceVehicle);
  // This strip is a highlight reel, not a spec sheet — a stat with no sourced
  // value is dropped rather than shown as an empty "Not specified" tile. The
  // full picture, including what's missing, is in the Overview and Battery &
  // Charging sections below, which do render the gaps explicitly.
  const stats = [
    { icon: Gauge, label: "Range", value: `${q.rangeKm} km` },
    {
      icon: BatteryCharging,
      label: "Battery",
      value: batteryBasis ? `${q.batteryKwh} kWh (${BATTERY_BASIS_LABEL[batteryBasis]})` : `${q.batteryKwh} kWh`,
    },
    q.powerKw !== undefined && { icon: Zap, label: "Power", value: `${q.powerKw} kW` },
    q.torqueNm !== undefined && {
      icon: Activity,
      label: "Torque",
      value: torquePoint ? `${q.torqueNm} Nm (${TORQUE_POINT_LABEL[torquePoint]})` : `${q.torqueNm} Nm`,
    },
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
        {/* The grid is a plain div and each stat carries its own <dl>. It was
            previously ONE <dl> wrapping everything, which left <dt>/<dd> two
            levels deep — invalid markup, because a <dl>'s children must be
            <dt>/<dd> or a <div> directly holding them. The consequence was
            that the description-list semantics were dropped altogether rather
            than merely being untidy (axe definition-list + dlitem, found in
            the 2026-08-21 audit). Tailwind's preflight zeroes <dl> margins, so
            this renders identically — only the element names changed. */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <Icon size={15} />
              </span>
              <dl className="min-w-0">
                <dt className="text-[9px] text-ink-muted">{label}</dt>
                <dd className="truncate text-[12px] font-bold text-ink">{value}</dd>
              </dl>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
