"use client";

import { Fragment } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { getOemBySlug } from "@/lib/data";
import { LAUNCH_STATUS_LABEL } from "@/lib/vehicle-labels";
import { Vehicle } from "@/types/vehicle";

interface CompareTableProps {
  vehicles: Vehicle[];
  onRemove: (slug: string) => void;
}

interface SpecRow {
  label: string;
  render: (v: Vehicle) => string;
}

const rows: SpecRow[] = [
  { label: "Price", render: (v) => `₹${v.priceRangeLakh[0].toFixed(2)} - ${v.priceRangeLakh[1].toFixed(2)} L` },
  { label: "Range", render: (v) => `${v.rangeKm} km` },
  { label: "Battery", render: (v) => `${v.batteryCapacityKwh} kWh` },
  { label: "Fast Charging", render: (v) => (v.chargingTimeFastMin ? `${v.chargingTimeFastMin} min` : "—") },
  { label: "Home Charging", render: (v) => `${v.chargingTimeSlowHr} hr` },
  { label: "Top Speed", render: (v) => `${v.topSpeedKmph} km/h` },
  { label: "0-100 km/h", render: (v) => (v.accelerationSec0To100 ? `${v.accelerationSec0To100}s` : "—") },
  { label: "Seating", render: (v) => (v.seatingCapacity ? `${v.seatingCapacity}` : "—") },
  { label: "Launch Status", render: (v) => LAUNCH_STATUS_LABEL[v.launchStatus] },
];

export function CompareTable({ vehicles, onRemove }: CompareTableProps) {
  const basePath = (v: Vehicle) => (v.category === "car" ? "/cars" : "/two-wheelers");

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-max gap-4"
        style={{ gridTemplateColumns: `160px repeat(${vehicles.length}, 220px)` }}
      >
        <div />
        <AnimatePresence>
          {vehicles.map((vehicle) => {
            const oem = getOemBySlug(vehicle.oem);
            return (
              <motion.div
                key={vehicle.slug}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-[10px] border border-border bg-surface p-3"
              >
                <button
                  onClick={() => onRemove(vehicle.slug)}
                  aria-label={`Remove ${vehicle.modelName}`}
                  className="focus-ring absolute top-2 right-2 z-10 rounded-full bg-surface/90 p-1 text-ink-muted shadow-card hover:text-ink"
                >
                  <X size={14} />
                </button>
                <div className="aspect-[4/3] overflow-hidden rounded-md">
                  <VehicleImage
                    vehicle={vehicle}
                    color={oem?.color ?? "#0891B2"}
                    className="h-full w-full"
                    sizes="220px"
                  />
                </div>
                <Link
                  href={`${basePath(vehicle)}/${vehicle.slug}`}
                  className="focus-ring mt-2 block text-[13px] font-bold text-ink hover:text-primary"
                >
                  {vehicle.oemName} {vehicle.modelName}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {rows.map((row) => (
          <Fragment key={row.label}>
            <div className="flex items-center border-t border-border py-3 text-[11.5px] font-semibold text-ink-muted">
              {row.label}
            </div>
            {vehicles.map((vehicle) => (
              <div
                key={`${row.label}-${vehicle.slug}`}
                className="flex items-center border-t border-border py-3 text-[12.5px] font-semibold text-ink"
              >
                {row.render(vehicle)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
