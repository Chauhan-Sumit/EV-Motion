import { formatRupees } from "@/lib/vehicle-detail/calculations";
import type { SectionCopy, SimilarVehicle } from "@/lib/vehicle-detail/types";
import { CarIllustration } from "./CarIllustration";
import { PrototypeSection } from "./Section";

/**
 * Similar electric cars.
 *
 * Each card states the *basis* of its price under the figure — "onwards,
 * ex-showroom" against "on-road, Moradabad" are not the same number, and a rail
 * that prints them at the same size without saying which is which invites a
 * comparison that is simply wrong.
 */
export function VdpSimilar({
  copy,
  vehicles,
}: {
  copy: SectionCopy;
  vehicles: SimilarVehicle[];
}) {
  return (
    <PrototypeSection copy={copy}>
      {/*
        Same mobile treatment as the Videos row above: one snapping horizontal
        row at ~1.35 cards wide, the approved grid from `sm:` up. Four stacked
        full-width cards buried the FAQs and News sections underneath them.
      */}
      <ul className="scroll-row -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            className="w-[74%] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover sm:w-auto sm:shrink"
          >
            <div className="flex items-center justify-center border-b border-border bg-surface-secondary px-4 py-4">
              <CarIllustration
                shape={vehicle.shape}
                bodyColor={vehicle.hex}
                alt={`${vehicle.name} illustration`}
                className="max-w-[190px]"
              />
            </div>
            <div className="flex flex-col gap-0.5 px-3.5 py-3">
              <span className="text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                {vehicle.brand}
              </span>
              <span className="text-[14px] font-bold text-ink">{vehicle.name}</span>
              <span className="mt-0.5 text-[15px] font-bold tabular-nums text-primary">
                {formatRupees(vehicle.price)}
              </span>
              <span className="text-[11px] text-ink-muted">{vehicle.priceBasis}</span>
              <span className="mt-1 text-[11px] text-ink-secondary">{vehicle.summary}</span>
            </div>
          </li>
        ))}
      </ul>
    </PrototypeSection>
  );
}
