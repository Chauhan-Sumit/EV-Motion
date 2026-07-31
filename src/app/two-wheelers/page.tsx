import type { Metadata } from "next";
import { VehicleListing } from "@/components/vehicles/VehicleListing";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { parseListingParams } from "@/lib/listing-params";

export const metadata: Metadata = {
  title: "Electric Scooters & Bikes in India — Compare Prices, Range & Specs",
  description: `Browse ${twoWheelers.length} electric scooters and motorcycles from every major OEM in India. Filter by price, range, battery and brand to find the right EV.`,
  alternates: { canonical: "/two-wheelers" },
};

const PRICE_BOUNDS: [number, number] = [0, 2];
const RANGE_BOUNDS: [number, number] = [0, 200];
const BATTERY_BOUNDS: [number, number] = [0, 5];

const SUB_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "scooter", label: "Scooter" },
  { value: "motorcycle", label: "Motorcycle" },
];

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
      vehicles={twoWheelers}
      priceBounds={PRICE_BOUNDS}
      rangeBounds={RANGE_BOUNDS}
      batteryBounds={BATTERY_BOUNDS}
      subTypeLabel="Type"
      subTypeOptions={SUB_TYPE_OPTIONS}
      initial={initial}
    />
  );
}
