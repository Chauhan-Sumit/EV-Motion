"use client";

import { useState } from "react";
import {
  Gauge,
  BatteryCharging,
  Zap,
  Timer,
  Shield,
  Car,
  Users,
  Cog,
  Briefcase,
  Cable,
  Smartphone,
} from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";

export function SectionOverview({ vehicle }: { vehicle: VehicleDetail }) {
  const [expanded, setExpanded] = useState(false);
  const q = vehicle.quickSpecs;
  const b = vehicle.bodySpecs;

  const specs = [
    { icon: Gauge, label: "Range", value: `${q.rangeKm} km` },
    { icon: BatteryCharging, label: "Battery", value: `${q.batteryKwh} kWh` },
    { icon: Zap, label: "Power", value: `${q.powerKw} kW` },
    { icon: Timer, label: "Fast Charging", value: `${q.fastChargeMinutes} min` },
    { icon: Car, label: "Body Type", value: b.bodyType },
    { icon: Users, label: "Seating Capacity", value: b.seatingCapacity },
    { icon: Cog, label: "Drive Type", value: b.driveType },
    { icon: Briefcase, label: "Boot Space", value: `${b.bootSpaceLiters} Liters` },
    { icon: Cable, label: "Charging Port", value: vehicle.charging.connectorType },
    { icon: Smartphone, label: "Connected Car", value: b.connectedCar ? "Yes" : "No" },
    { icon: Shield, label: "Warranty", value: `${q.warrantyYears} Years / ${(q.warrantyKm / 1000).toFixed(0)}k km` },
  ];

  return (
    <VehicleSection id="overview" title="Overview">
      <p className={`max-w-3xl text-[13px] leading-relaxed text-ink-secondary ${expanded ? "" : "line-clamp-2"}`}>
        {vehicle.overview}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="focus-ring mt-1 text-[12px] font-semibold text-primary"
      >
        {expanded ? "Show Less ‹" : "Read Full Overview ›"}
      </button>

      <ul className="mt-4 grid grid-cols-2 gap-x-3.5 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
        {specs.map(({ icon: Icon, label, value }) => (
          <li key={label} className="flex flex-col items-start gap-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-primary">
              <Icon size={15} />
            </span>
            <span className="text-[10px] text-ink-muted">{label}</span>
            <span className="text-[12px] font-bold text-ink">{value}</span>
          </li>
        ))}
      </ul>
    </VehicleSection>
  );
}
