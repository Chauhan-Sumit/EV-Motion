// EV Motion home/VDP card shapes. `vehicle` + `oemColor` are carried on every
// image-bearing item so card components can render via our existing
// VehicleImage (real photo when we have one, branded placeholder otherwise)
// instead of assuming every one of our 36 vehicles has a literal photo file.

import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export type CardBadge = "New" | "Hot" | "New Launch" | "Bestseller" | "Trending";

export interface ListingCardData {
  id: string;
  category: VehicleCategory;
  brand: string;
  name: string;
  slug: string;
  vehicle: Vehicle;
  oemColor: string;
  specs: string[];
  priceLabel: string;
  emiLabel: string;
  locationLabel: string;
  ctaLabel: string;
  badge?: CardBadge;
  sponsored?: boolean;
}

export interface RankedVehicleData {
  rank: number;
  name: string;
  metaLabel: string;
  priceLabel: string;
  href: string;
}

export interface CategoryItemData {
  id: string;
  name: string;
  count: string;
  emoji: string;
  /** Omitted when the category has no real listing to link to yet (e.g. Buses, Chargers) — renders as a disabled tile instead of a dead link. */
  href?: string;
}

export interface BrandCardData {
  id: string;
  name: string;
  logo: string | null;
  color: string;
  slug: string;
  category: VehicleCategory;
}

export interface TrendingCompactItemData {
  id: string;
  category: VehicleCategory;
  name: string;
  vehicle: Vehicle;
  oemColor: string;
  sponsored?: boolean;
}

export interface CompareCardSide {
  name: string;
  vehicle: Vehicle;
  oemColor: string;
  priceLabel: string;
}

export interface CompareCardPairData {
  id: string;
  category: VehicleCategory;
  vehicleA: CompareCardSide;
  vehicleB: CompareCardSide;
}

export interface UpcomingItemData {
  id: string;
  category: VehicleCategory;
  brand: string;
  name: string;
  vehicle: Vehicle;
  oemColor: string;
  launchLabel: string;
  expectedPriceLabel: string;
}

export interface AdvertPlanData {
  id: string;
  name: string;
  priceLabel: string;
  unitLabel: string;
  features: string[];
  featured?: boolean;
}

export interface WhyFeatureData {
  id: string;
  emoji: string;
  title: string;
  description: string;
}
