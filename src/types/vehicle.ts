export type VehicleCategory = "car" | "2-wheeler" | "commercial";
export type LaunchStatus = "available" | "just-launched" | "upcoming";
export type CarBodyType = "hatchback" | "suv" | "sedan" | "muv";
export type TwoWheelerType = "scooter" | "motorcycle";
export type CommercialType =
  | "three-wheeler-cargo"
  | "three-wheeler-passenger"
  | "small-truck"
  | "van"
  | "bus";

export interface VehicleVariant {
  id: string;
  name: string;
  priceLakh: number;
  rangeKm: number;
  batteryKwh: number;
  topSpeedKmph: number;
  fastChargeTimeMin?: number;
}

export interface VehicleImages {
  hero: string;
  gallery: string[];
  photoUrl?: string;
  photoAttribution?: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  category: VehicleCategory;
  oem: string;
  oemName: string;
  modelName: string;
  tagline: string;
  bodyType?: CarBodyType;
  twoWheelerType?: TwoWheelerType;
  commercialType?: CommercialType;
  priceRangeLakh: [number, number];
  rangeKm: number;
  batteryCapacityKwh: number;
  chargingTimeFastMin?: number;
  chargingTimeSlowHr: number;
  topSpeedKmph: number;
  accelerationSec0To100?: number;
  seatingCapacity?: number;
  launchStatus: LaunchStatus;
  launchDate?: string;
  colors: string[];
  images: VehicleImages;
  variants: VehicleVariant[];
  highlights: string[];
  description: string;
}

export interface Oem {
  key: string;
  slug: string;
  name: string;
  color: string;
  country: string;
  categories: VehicleCategory[];
  description: string;
  /** Public path to the brand's real logo asset. Absent where no asset exists (e.g. Ampere) — render an initial-letter fallback in that case. */
  logoUrl?: string;
}
