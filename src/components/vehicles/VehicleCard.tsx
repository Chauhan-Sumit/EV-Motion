"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, Zap } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { getOemBySlug } from "@/lib/data/oems";
import { routeSegmentFor } from "@/lib/data/categories";
import { LAUNCH_STATUS_LABEL } from "@/lib/vehicle-labels";
import { VehiclePriceText } from "@/components/pricing/VehiclePriceText";
import { vehiclePricingSubject } from "@/lib/vehicle-pricing";
import { Vehicle } from "@/types/vehicle";

const BADGE_CLASSES: Record<Vehicle["launchStatus"], string> = {
  available: "bg-primary text-white",
  "just-launched": "bg-hot text-white",
  upcoming: "border border-border-strong bg-surface text-ink-secondary",
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const oem = getOemBySlug(vehicle.oem);
  const color = oem?.color ?? "#0891B2";
  const basePath = `/${routeSegmentFor(vehicle.category)}`;
  const detailHref = `${basePath}/${vehicle.slug}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-surface transition-shadow duration-200 hover:shadow-card-hover">
        <Link href={detailHref} className="focus-ring flex flex-1 flex-col">
          <div className="relative h-40 overflow-hidden border-b border-border bg-white">
            <span
              className={`absolute left-2 top-2 z-10 rounded-[3px] px-[7px] py-0.5 text-[9px] font-bold uppercase ${BADGE_CLASSES[vehicle.launchStatus]}`}
            >
              {LAUNCH_STATUS_LABEL[vehicle.launchStatus]}
            </span>
            <VehicleImage vehicle={vehicle} color={color} className="h-full w-full" />
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-[11px]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.7px] text-ink-muted">
              {vehicle.oemName}
            </p>
            <h3 className="text-[13px] font-bold leading-snug text-ink">{vehicle.modelName}</h3>
            <p className="line-clamp-1 text-[11px] text-ink-secondary">{vehicle.tagline}</p>

            <div className="mt-1 flex items-center justify-between text-[12px]">
              <span className="text-sm font-extrabold text-primary">
                <VehiclePriceText vehicle={vehiclePricingSubject(vehicle)} />
              </span>
              <span className="flex items-center gap-1 text-[10px] text-ink-muted">
                <Zap size={12} className="text-primary" />
                {vehicle.rangeKm} km
              </span>
            </div>
          </div>
        </Link>

        <div className="border-t border-border px-[11px] py-[7px]">
          <Link
            href={`/compare?ids=${vehicle.slug}`}
            className="focus-ring inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
          >
            <Scale size={13} />
            Add to Compare
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
