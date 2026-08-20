import type { Metadata } from "next";
import { VehicleListing } from "@/components/vehicles/VehicleListing";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { isCurrentlySold } from "@/lib/vehicle-availability";
import { parseListingParams } from "@/lib/listing-params";
import { TWO_WHEELER_FILTER_CONFIG } from "@/lib/vehicle-filter-options";

// Discontinued records are dropped here rather than offered as a fourth
// availability filter — a listing is what the site currently sells. Their
// detail pages stay reachable; see src/lib/vehicle-availability.ts.
const listed = twoWheelers.filter(isCurrentlySold);

export const metadata: Metadata = {
  title: "Electric Scooters & Bikes in India — Compare Prices, Range & Specs",
  description: `Browse ${listed.length} electric scooters and motorcycles from every major OEM in India. Filter by price, range, battery and brand to find the right EV.`,
  alternates: { canonical: "/two-wheelers" },
};

const {
  priceBounds: PRICE_BOUNDS,
  rangeBounds: RANGE_BOUNDS,
  batteryBounds: BATTERY_BOUNDS,
  subTypeLabel: SUB_TYPE_LABEL,
  subTypeOptions: SUB_TYPE_OPTIONS,
} = TWO_WHEELER_FILTER_CONFIG;

export default async function TwoWheelersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initial = parseListingParams(params, PRICE_BOUNDS, RANGE_BOUNDS, BATTERY_BOUNDS);

  return (
    <VehicleListing
      category="2-wheeler"
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
