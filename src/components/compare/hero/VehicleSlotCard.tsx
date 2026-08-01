"use client";

import Link from "next/link";
import { Plus, Repeat, Star, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { getOemBySlug } from "@/lib/data";
import { routeSegmentFor } from "@/lib/data/categories";
import { formatPriceRangeLakh } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";

interface VehicleSlotCardProps {
  vehicle: Vehicle | null;
  onChange: () => void;
  onRemove?: () => void;
}

export function VehicleSlotCard({ vehicle, onChange, onRemove }: VehicleSlotCardProps) {
  const reduceMotion = useReducedMotion();

  if (!vehicle) {
    return (
      <button
        type="button"
        onClick={onChange}
        className="focus-ring flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-strong bg-surface-secondary text-ink-muted transition-colors hover:border-primary hover:text-primary"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current">
          <Plus size={18} />
        </span>
        <span className="text-[12.5px] font-semibold">Add Vehicle</span>
      </button>
    );
  }

  const oem = getOemBySlug(vehicle.oem);

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
    >
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${vehicle.modelName} from comparison`}
          className="focus-ring absolute top-2.5 right-2.5 z-10 rounded-full bg-surface/90 p-1.5 text-ink-muted shadow-card hover:text-error"
        >
          <X size={14} />
        </button>
      ) : null}

      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
        <VehicleImage vehicle={vehicle} color={oem?.color ?? "#0891B2"} className="h-full w-full" sizes="(min-width: 1024px) 33vw, 90vw" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-muted">{vehicle.oemName}</p>
        <Link
          href={`/${routeSegmentFor(vehicle.category)}/${vehicle.slug}`}
          className="focus-ring text-[14px] font-extrabold leading-tight text-ink hover:text-primary"
        >
          {vehicle.modelName}
        </Link>

        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
          <Star size={12} className="text-ink-muted" />
          <span>Not yet rated</span>
        </div>

        <p className="mt-1 text-[13px] font-extrabold text-primary">
          {formatPriceRangeLakh(vehicle.priceRangeLakh[0], vehicle.priceRangeLakh[1])}
        </p>

        <dl className="mt-1.5 grid grid-cols-3 gap-1.5 border-t border-border pt-2 text-center">
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-ink-muted">Range</dt>
            <dd className="text-[11px] font-bold text-ink">{vehicle.rangeKm} km</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-ink-muted">Battery</dt>
            <dd className="text-[11px] font-bold text-ink">{vehicle.batteryCapacityKwh} kWh</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-ink-muted">Fast Charge</dt>
            <dd className="text-[11px] font-bold text-ink">
              {vehicle.chargingTimeFastMin ? `${vehicle.chargingTimeFastMin} min` : "—"}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onChange}
          className="focus-ring mt-2.5 flex items-center justify-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-[11.5px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <Repeat size={12} />
          Change Vehicle
        </button>
      </div>
    </motion.div>
  );
}
