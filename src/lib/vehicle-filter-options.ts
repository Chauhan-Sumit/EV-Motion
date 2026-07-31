import type { VehicleCategory } from "@/types/vehicle";

export interface SubTypeOption {
  value: string;
  label: string;
}

export type ChargingBucket = "any" | "under30" | "under60";

/** Shared across the listing pages' `FilterBar` and the homepage's filter pickers, so both can't drift. */
export const SORT_OPTIONS: SubTypeOption[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "range-desc", label: "Range: High to Low" },
];

export const CHARGING_OPTIONS: { value: ChargingBucket; label: string }[] = [
  { value: "any", label: "Any charging speed" },
  { value: "under30", label: "Fast charge under 30 min" },
  { value: "under60", label: "Fast charge under 60 min" },
];

export interface CategoryFilterConfig {
  category: VehicleCategory;
  priceBounds: [number, number];
  rangeBounds: [number, number];
  batteryBounds: [number, number];
  subTypeLabel: string;
  subTypeOptions: SubTypeOption[];
}

export const CAR_FILTER_CONFIG: CategoryFilterConfig = {
  category: "car",
  priceBounds: [0, 90],
  rangeBounds: [0, 700],
  batteryBounds: [0, 100],
  subTypeLabel: "Body Type",
  subTypeOptions: [
    { value: "all", label: "All Body Types" },
    { value: "hatchback", label: "Hatchback" },
    { value: "suv", label: "SUV" },
    { value: "sedan", label: "Sedan" },
    { value: "muv", label: "MUV" },
  ],
};

export const TWO_WHEELER_FILTER_CONFIG: CategoryFilterConfig = {
  category: "2-wheeler",
  priceBounds: [0, 2],
  rangeBounds: [0, 200],
  batteryBounds: [0, 5],
  subTypeLabel: "Type",
  subTypeOptions: [
    { value: "all", label: "All Types" },
    { value: "scooter", label: "Scooter" },
    { value: "motorcycle", label: "Motorcycle" },
  ],
};

export function filterConfigFor(category: VehicleCategory): CategoryFilterConfig {
  return category === "car" ? CAR_FILTER_CONFIG : TWO_WHEELER_FILTER_CONFIG;
}
