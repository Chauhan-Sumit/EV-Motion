import { VehicleListing } from "@/components/vehicles/VehicleListing";
import { cars } from "@/lib/data/cars";

const PRICE_BOUNDS: [number, number] = [0, 90];

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

  const oemsParam = typeof params.oems === "string" ? params.oems : "";
  const initialOems = oemsParam ? oemsParam.split(",") : [];

  const budgetParam = typeof params.budget === "string" ? params.budget : "";
  const [minStr, maxStr] = budgetParam.split("-");
  const min = Number(minStr);
  const max = Number(maxStr);
  const initialPrice: [number, number] =
    budgetParam && !Number.isNaN(min) && !Number.isNaN(max)
      ? [min, Math.min(max, PRICE_BOUNDS[1])]
      : PRICE_BOUNDS;

  const initialSubType = typeof params.type === "string" ? params.type : "all";
  const initialSort = typeof params.sort === "string" ? params.sort : "price-asc";

  return (
    <VehicleListing
      category="car"
      vehicles={cars}
      priceBounds={PRICE_BOUNDS}
      subTypeLabel="Body Type"
      subTypeOptions={SUB_TYPE_OPTIONS}
      initial={{
        oems: initialOems,
        price: initialPrice,
        subType: initialSubType,
        sort: initialSort,
      }}
    />
  );
}
