import type { Metadata } from "next";
import { VehicleListing } from "@/components/vehicles/VehicleListing";
import { cars } from "@/lib/data/cars";
import { isCurrentlySold } from "@/lib/vehicle-availability";
import { parseListingParams } from "@/lib/listing-params";
import { CAR_FILTER_CONFIG } from "@/lib/vehicle-filter-options";

// Discontinued records are dropped here rather than offered as a fourth
// availability filter — a listing is what the site currently sells. Their
// detail pages stay reachable; see src/lib/vehicle-availability.ts.
const listed = cars.filter(isCurrentlySold);

export const metadata: Metadata = {
  title: "Electric Cars in India — Compare Prices, Range & Specs",
  description: `Browse ${listed.length} electric cars from every major OEM in India. Filter by price, range, battery, body type and brand to find the right EV.`,
  alternates: { canonical: "/cars" },
};

const {
  priceBounds: PRICE_BOUNDS,
  rangeBounds: RANGE_BOUNDS,
  batteryBounds: BATTERY_BOUNDS,
  subTypeLabel: SUB_TYPE_LABEL,
  subTypeOptions: SUB_TYPE_OPTIONS,
} = CAR_FILTER_CONFIG;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initial = parseListingParams(params, PRICE_BOUNDS, RANGE_BOUNDS, BATTERY_BOUNDS);

  return (
    <VehicleListing
      category="car"
      vehicles={listed}
      priceBounds={PRICE_BOUNDS}
      rangeBounds={RANGE_BOUNDS}
      batteryBounds={BATTERY_BOUNDS}
      subTypeLabel={SUB_TYPE_LABEL}
      subTypeOptions={SUB_TYPE_OPTIONS}
      initial={initial}
    />
  );
}
