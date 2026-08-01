import type { Metadata } from "next";
import { VehicleListing } from "@/components/vehicles/VehicleListing";
import { commercial } from "@/lib/data/commercial";
import { parseListingParams } from "@/lib/listing-params";
import { COMMERCIAL_FILTER_CONFIG } from "@/lib/vehicle-filter-options";

export const metadata: Metadata = {
  title: "Commercial EVs in India — Compare Prices, Range & Specs",
  description: `Browse ${commercial.length} commercial electric vehicles — 3-wheelers, small trucks, vans and buses — from every major OEM in India. Filter by price, range, battery, vehicle type and brand.`,
  alternates: { canonical: "/commercial" },
};

const {
  priceBounds: PRICE_BOUNDS,
  rangeBounds: RANGE_BOUNDS,
  batteryBounds: BATTERY_BOUNDS,
  subTypeLabel: SUB_TYPE_LABEL,
  subTypeOptions: SUB_TYPE_OPTIONS,
} = COMMERCIAL_FILTER_CONFIG;

export default async function CommercialPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initial = parseListingParams(params, PRICE_BOUNDS, RANGE_BOUNDS, BATTERY_BOUNDS);

  return (
    <VehicleListing
      category="commercial"
      vehicles={commercial}
      priceBounds={PRICE_BOUNDS}
      rangeBounds={RANGE_BOUNDS}
      batteryBounds={BATTERY_BOUNDS}
      subTypeLabel={SUB_TYPE_LABEL}
      subTypeOptions={SUB_TYPE_OPTIONS}
      initial={initial}
    />
  );
}
