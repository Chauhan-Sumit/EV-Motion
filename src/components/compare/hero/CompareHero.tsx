"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/data/categories";
import { buildCompareSlug, MAX_COMPARE, MIN_COMPARE } from "@/lib/compare/slug";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { VehicleSlotCard } from "./VehicleSlotCard";
import { ChangeVehicleModal } from "./ChangeVehicleModal";
import { WinnerRibbon } from "./WinnerRibbon";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

interface CompareHeroProps {
  initialVehicles: Vehicle[];
  initialCategory: VehicleCategory | null;
}

/** Premium comparison hero: heading, category tabs (only while empty), 2-3 vehicle slots with VS badges, winner ribbon. */
export function CompareHero({ initialVehicles, initialCategory }: CompareHeroProps) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [category, setCategory] = useState<VehicleCategory>(initialCategory ?? initialVehicles[0]?.category ?? "car");
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const locked = vehicles.length > 0;

  function navigate(next: Vehicle[]) {
    if (next.length >= MIN_COMPARE) {
      router.push(`/compare/${buildCompareSlug(next)}`);
    } else if (next.length === 1) {
      router.push(`/compare?ids=${next[0].slug}`);
    } else {
      router.push("/compare");
    }
  }

  function handleSlotChange(index: number, vehicle: Vehicle) {
    const next = [...vehicles];
    next[index] = vehicle;
    setVehicles(next);
    navigate(next);
  }

  function handleRemove(index: number) {
    const next = vehicles.filter((_, i) => i !== index);
    setVehicles(next);
    navigate(next);
  }

  function handleCategoryChange(next: VehicleCategory) {
    setCategory(next);
    setVehicles([]);
  }

  const slotCount = Math.min(Math.max(vehicles.length + 1, MIN_COMPARE), MAX_COMPARE);
  const slots: (Vehicle | null)[] = Array.from({ length: slotCount }, (_, i) => vehicles[i] ?? null);
  const details = vehicles.map(toVehicleDetail);

  return (
    <div className="border-b border-border bg-surface-secondary py-8 sm:py-12">
      <Container>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Compare Electric Vehicles</h1>
          <p className="mx-auto mt-2 max-w-xl text-[13px] text-ink-secondary">
            Compare price, battery, charging, ownership cost, running cost, features and performance.
          </p>
        </div>

        {!locked ? (
          <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Vehicle category">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={category === c.key}
                onClick={() => handleCategoryChange(c.key)}
                className={`focus-ring rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                  category === c.key
                    ? "bg-primary text-white"
                    : "border border-border-strong bg-surface text-ink-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {c.shortLabel}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-stretch sm:justify-center">
          {slots.map((vehicle, i) => (
            <Fragment key={i}>
              <div className="w-full sm:w-60 md:w-64">
                <VehicleSlotCard
                  vehicle={vehicle}
                  onChange={() => setActiveSlot(i)}
                  onRemove={vehicle ? () => handleRemove(i) : undefined}
                />
              </div>
              {i < slots.length - 1 ? (
                <div className="flex shrink-0 items-center justify-center py-1 sm:py-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-extrabold text-white shadow-card sm:h-12 sm:w-12 sm:text-[13px]">
                    VS
                  </span>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>

        {details.length >= MIN_COMPARE ? <WinnerRibbon vehicles={details} /> : null}
      </Container>

      {activeSlot !== null ? (
        <ChangeVehicleModal
          open={activeSlot !== null}
          onOpenChange={(open) => {
            if (!open) setActiveSlot(null);
          }}
          category={category}
          excludeSlugs={vehicles.map((v) => v.slug)}
          onSelect={(vehicle) => handleSlotChange(activeSlot, vehicle)}
        />
      ) : null}
    </div>
  );
}
