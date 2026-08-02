"use client";

import { useVehiclePricing, type VehiclePricingSubject } from "@/hooks/useVehiclePricing";
import { formatPriceLakh, formatPriceRangeLakh } from "@/lib/utils";

interface VehiclePriceTextProps {
  vehicle: VehiclePricingSubject;
  /** "range": "₹X.XX - Y.YYL" across variants. "from": low end only, "₹X.XXL". */
  variant?: "range" | "from";
  suffix?: string;
}

/**
 * The one place a vehicle's live, city-adjusted ex-showroom price is
 * rendered as text — a small client leaf (plain serializable props only, so
 * it's safe to drop into a Server Component parent) used by every card
 * across the homepage, listing pages, brand pages, and VDP "similar
 * vehicles" rails instead of each one reading a static pre-computed string.
 */
export function VehiclePriceText({ vehicle, variant = "range", suffix }: VehiclePriceTextProps) {
  const pricing = useVehiclePricing(vehicle);
  const [low, high] = pricing.exShowroomRangeLakh;
  const text = variant === "from" ? formatPriceLakh(low) : formatPriceRangeLakh(low, high);
  return (
    <>
      {text}
      {suffix ?? ""}
    </>
  );
}
