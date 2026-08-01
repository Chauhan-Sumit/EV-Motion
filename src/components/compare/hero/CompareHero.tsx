"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/data/categories";
import { buildCompareSlug, MAX_COMPARE, MIN_COMPARE } from "@/lib/compare/slug";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { WINNER_METRICS } from "@/lib/compare/metrics";
import { saveRecentComparison } from "@/lib/compare/recentComparisons";
import { VehicleSlotCard } from "./VehicleSlotCard";
import { ChangeVehicleModal } from "./ChangeVehicleModal";
import { WinnerRibbon } from "./WinnerRibbon";
import { QuickVerdictCard } from "../summary/QuickVerdictCard";
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

  useEffect(() => {
    if (vehicles.length >= MIN_COMPARE) saveRecentComparison(buildCompareSlug(vehicles));
  }, [vehicles]);

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
  const categoriesWon = details.length >= MIN_COMPARE ? computeWinners(details, WINNER_METRICS).categoriesWon : [];

  return (
    <div id="compare-hero" className="scroll-mt-24 border-b border-border bg-surface-secondary py-7 sm:py-10">
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

        <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch sm:justify-center">
          {slots.map((vehicle, i) => (
            <Fragment key={i}>
              <div className="w-full sm:w-72 md:w-80 lg:w-[21rem]">
                <VehicleSlotCard
                  vehicle={vehicle}
                  onChange={() => setActiveSlot(i)}
                  onRemove={vehicle ? () => handleRemove(i) : undefined}
                  compareScore={i < categoriesWon.length ? { won: categoriesWon[i], total: WINNER_METRICS.length } : null}
                />
              </div>
              {i < slots.length - 1 ? (
                <div className="flex shrink-0 items-center justify-center py-1 sm:py-0">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-extrabold text-white shadow-card-hover ring-4 ring-surface-secondary sm:h-14 sm:w-14 sm:text-[14px]">
                    VS
                  </span>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>

        {details.length >= MIN_COMPARE ? <WinnerRibbon vehicles={details} /> : null}
        {details.length >= MIN_COMPARE ? (
          <div className="mt-5">
            <QuickVerdictCard vehicles={details} />
          </div>
        ) : null}
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
