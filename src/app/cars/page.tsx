import type { Metadata } from "next";
import { VehicleListing } from "@/components/vehicles/VehicleListing";
import { cars } from "@/lib/data/cars";
import { parseListingParams } from "@/lib/listing-params";

export const metadata: Metadata = {
  title: "Electric Cars in India — Compare Prices, Range & Specs",
  description: `Browse ${cars.length} electric cars from every major OEM in India. Filter by price, range, battery, body type and brand to find the right EV.`,
  alternates: { canonical: "/cars" },
};

const PRICE_BOUNDS: [number, number] = [0, 90];
const RANGE_BOUNDS: [number, number] = [0, 700];
const BATTERY_BOUNDS: [number, number] = [0, 100];

const SUB_TYPE_OPTIONS = [
  { value: "all", label: "All Body Types" },
  { value: "hatchback", label: "Hatchback" },
  { value: "suv", label: "SUV" },
  { value: "sedan", label: "Sedan" },
  { value: "muv", label: "MUV" },
];

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
      vehicles={cars}
      priceBounds={PRICE_BOUNDS}
      rangeBounds={RANGE_BOUNDS}
      batteryBounds={BATTERY_BOUNDS}
      subTypeLabel="Body Type"
      subTypeOptions={SUB_TYPE_OPTIONS}
      initial={initial}
    />
  );
}
