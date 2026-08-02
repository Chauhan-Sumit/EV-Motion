"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { vehicleDetailHref } from "@/lib/data/ev-motion/toVehicleDetail";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { VehiclePriceText } from "@/components/pricing/VehiclePriceText";
import { VehicleEmiText } from "@/components/pricing/VehicleEmiText";

export function SimilarCarCard({ vehicle }: { vehicle: VehicleDetail }) {
  const [compareChecked, setCompareChecked] = useState(false);
  const checkboxId = useId();
  const href = vehicleDetailHref(vehicle);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover">
      <Link href={href} className="relative block h-32 bg-white">
        <VehicleImage vehicle={vehicle.sourceVehicle} color={vehicle.oemColor} sizes="220px" className="h-full w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.7px] text-ink-muted">{vehicle.brand}</p>
        <Link href={href} className="focus-ring text-[13px] font-bold text-ink hover:text-primary">
          {vehicle.name}
        </Link>
        <p className="text-sm font-extrabold text-primary">
          <VehiclePriceText vehicle={vehicle} variant="from" />
        </p>
        <p className="text-[10px] text-ink-muted">
          <VehicleEmiText vehicle={vehicle} />
        </p>

        <label htmlFor={checkboxId} className="mt-auto flex items-center gap-1.5 pt-2 text-[11px] text-ink-secondary">
          <input
            id={checkboxId}
            type="checkbox"
            checked={compareChecked}
            onChange={(e) => setCompareChecked(e.target.checked)}
            className="h-3.5 w-3.5 accent-primary"
          />
          Compare
        </label>
      </div>
    </div>
  );
}
