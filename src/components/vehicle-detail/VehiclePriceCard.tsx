"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";
import { formatPriceRangeLakh } from "@/lib/utils";
import { LocationSelector } from "@/components/layout/LocationSelector";
import { GetBestPriceDialog } from "./GetBestPriceDialog";

/**
 * The VDP's compact, CarWale-inspired pricing block — deliberately minimal:
 * Vehicle Price, "Ex-showroom Price in <City>", a subtle "Change City" text
 * action (reusing the existing `LocationSelector`, mounted locally), and the
 * Get Best Price / Add to Compare actions. No on-road figure, no info box,
 * no bullet list, no extra border/background of its own — it sits directly
 * inside `VehicleHero`'s existing panel.
 *
 * Every figure comes from `useVehiclePricing` — the same hook every other
 * pricing widget site-wide calls — so a city change updates this card in
 * lockstep with Price Summary, the EMI calculator, and everywhere else.
 */
export function VehiclePriceCard({ vehicle }: { vehicle: VehicleDetail }) {
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const pricing = useVehiclePricing(vehicle);
  const priceLabel = formatPriceRangeLakh(pricing.exShowroomRangeLakh[0], pricing.exShowroomRangeLakh[1], " – ");
  const compareHref = `/compare?ids=${vehicle.slug}`;

  return (
    <div className="mt-3.5 border-t border-border pt-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">Vehicle Price</p>
      <p className="mt-0.5 text-2xl font-extrabold text-primary sm:text-[26px]">{priceLabel}</p>

      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[11.5px] text-ink-secondary">Ex-showroom Price in {pricing.cityName}</span>
        <button
          type="button"
          onClick={() => setCityPickerOpen(true)}
          className="focus-ring text-[11.5px] font-semibold text-primary hover:underline"
        >
          Change City
        </button>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <GetBestPriceDialog vehicleName={vehicle.name} />
        <Link
          href={compareHref}
          className="focus-ring flex items-center gap-1.5 rounded-md border border-primary bg-transparent px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary-tint"
        >
          <Scale size={14} />
          Add to Compare
        </Link>
      </div>

      <LocationSelector open={cityPickerOpen} onOpenChange={setCityPickerOpen} />
    </div>
  );
}
