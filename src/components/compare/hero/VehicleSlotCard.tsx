"use client";

import Link from "next/link";
import { Plus, Repeat, Star, Trophy, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { getOemBySlug } from "@/lib/data/oems";
import { routeSegmentFor } from "@/lib/data/categories";
import { formatPriceLakh, formatPriceRangeLakh } from "@/lib/utils";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";
import type { Vehicle } from "@/types/vehicle";

interface VehicleSlotCardProps {
  vehicle: Vehicle | null;
  onChange: () => void;
  onRemove?: () => void;
  /** Categories won out of every scoreable winner metric — null/omitted until 2+ vehicles are selected. */
  compareScore?: { won: number; total: number } | null;
}

export function VehicleSlotCard({ vehicle, onChange, onRemove, compareScore }: VehicleSlotCardProps) {
  const reduceMotion = useReducedMotion();
  // Hooks must run unconditionally, and `vehicle` can be null (empty slot) —
  // fall back to a harmless zero-price subject; its output is simply unused
  // in the empty-slot branch below.
  const pricing = useVehiclePricing(
    vehicle
      ? { id: vehicle.id, name: vehicle.modelName, priceRangeLakh: vehicle.priceRangeLakh }
      : { id: "", name: "", priceRangeLakh: [0, 0] },
  );

  if (!vehicle) {
    return (
      <button
        type="button"
        onClick={onChange}
        className="focus-ring flex h-full min-h-[300px] w-full flex-col items-center justify-center gap-2.5 rounded-3xl border-2 border-dashed border-border-strong bg-surface-secondary text-ink-muted transition-colors hover:border-primary hover:text-primary"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-current">
          <Plus size={20} />
        </span>
        <span className="text-[13px] font-semibold">Add Vehicle</span>
      </button>
    );
  }

  const oem = getOemBySlug(vehicle.oem);
  const onRoad = pricing.breakdown.low.onRoad;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-shadow duration-200 hover:border-primary/30 hover:shadow-card-hover"
    >
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${vehicle.modelName} from comparison`}
          className="focus-ring absolute top-3 right-3 z-10 rounded-full bg-surface/90 p-1.5 text-ink-muted shadow-card hover:text-error"
        >
          <X size={15} />
        </button>
      ) : null}

      {compareScore && compareScore.total > 0 ? (
        <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          <Trophy size={11} className="text-primary-bright" />
          Wins {compareScore.won}/{compareScore.total}
        </span>
      ) : null}

      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
        <VehicleImage
          vehicle={vehicle}
          color={oem?.color ?? "#0891B2"}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, 90vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{vehicle.oemName}</p>
        <Link
          href={`/${routeSegmentFor(vehicle.category)}/${vehicle.slug}`}
          className="focus-ring text-[17px] font-extrabold leading-tight text-ink hover:text-primary sm:text-[19px]"
        >
          {vehicle.modelName}
        </Link>

        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
          <Star size={12} className="text-ink-muted" />
          <span>Not yet rated</span>
        </div>

        <p className="mt-1.5 text-[19px] font-extrabold text-primary sm:text-[21px]">
          {formatPriceRangeLakh(pricing.exShowroomRangeLakh[0], pricing.exShowroomRangeLakh[1])}
        </p>
        <p className="text-[10.5px] text-ink-muted">Ex-showroom &middot; {pricing.cityName}</p>
        <p className="text-[11.5px] font-semibold text-ink-secondary">Est. on-road: {formatPriceLakh(onRoad / 100000)}</p>

        <dl className="mt-2.5 grid grid-cols-3 gap-1.5 border-t border-border pt-3 text-center">
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-ink-muted">Range</dt>
            <dd className="text-[12.5px] font-bold text-ink">{vehicle.rangeKm} km</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-ink-muted">Battery</dt>
            <dd className="text-[12.5px] font-bold text-ink">{vehicle.batteryCapacityKwh} kWh</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-ink-muted">Fast Charge</dt>
            <dd className="text-[12.5px] font-bold text-ink">
              {vehicle.chargingTimeFastMin ? `${vehicle.chargingTimeFastMin} min` : "—"}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onChange}
          className="focus-ring mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-border-strong px-3 py-2.5 text-[12px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <Repeat size={13} />
          Change Vehicle
        </button>
      </div>
    </motion.div>
  );
}
