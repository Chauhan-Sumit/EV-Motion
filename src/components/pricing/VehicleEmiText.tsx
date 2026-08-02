"use client";

import { useVehiclePricing, type VehiclePricingSubject } from "@/hooks/useVehiclePricing";

interface VehicleEmiTextProps {
  vehicle: VehiclePricingSubject;
  prefix?: string;
  suffix?: string;
}

/** The one place a vehicle's live EMI figure is rendered as text — see `VehiclePriceText` for why this is a small client leaf. */
export function VehicleEmiText({ vehicle, prefix = "EMI ", suffix = "/mo" }: VehicleEmiTextProps) {
  const pricing = useVehiclePricing(vehicle);
  return (
    <>
      {prefix}₹{Math.round(pricing.emiFromPerMonth).toLocaleString("en-IN")}
      {suffix}
    </>
  );
}
