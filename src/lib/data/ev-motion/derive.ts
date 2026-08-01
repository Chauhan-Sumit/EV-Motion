import { getVehiclesByCategory, oems, getOemBySlug } from "@/lib/data";
import { vehicleHref } from "@/lib/search";
import { formatPriceLakh, formatPriceRangeLakh } from "@/lib/utils";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";
import type {
  BrandCardData,
  CompareCardPairData,
  ListingCardData,
  RankedVehicleData,
  TrendingCompactItemData,
  UpcomingItemData,
} from "@/types/ev-motion";

export function oemColorOf(vehicle: Vehicle): string {
  return getOemBySlug(vehicle.oem)?.color ?? "#1FA83C";
}

export function priceLabel(vehicle: Vehicle): string {
  return formatPriceLakh(vehicle.priceRangeLakh[0]);
}

/** Same EMI formula as the ported VehicleHero — 80% financed, 9.5% p.a., 60 months. */
export function estimateEmi(vehicle: Vehicle): number {
  const principal = vehicle.priceRangeLakh[0] * 100000 * 0.8;
  const monthlyRate = 0.095 / 12;
  const months = 60;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function emiLabel(vehicle: Vehicle): string {
  return `EMI ₹${Math.round(estimateEmi(vehicle)).toLocaleString("en-IN")}/mo`;
}

function bodyOrTypeLabel(vehicle: Vehicle): string {
  if (vehicle.category === "car") return vehicle.bodyType ?? "";
  if (vehicle.category === "2-wheeler") return vehicle.twoWheelerType ?? "";
  return vehicle.commercialType ?? "";
}

const CTA_LABEL: Record<VehicleCategory, string> = {
  car: "Get Quote",
  "2-wheeler": "Book Now",
  commercial: "Enquire Now",
};

export function toListingCard(vehicle: Vehicle, sponsored = false): ListingCardData {
  return {
    id: vehicle.id,
    category: vehicle.category,
    brand: vehicle.oemName,
    name: vehicle.modelName,
    slug: vehicle.slug,
    vehicle,
    oemColor: oemColorOf(vehicle),
    specs: [
      `${vehicle.rangeKm} km`,
      `${vehicle.batteryCapacityKwh}kWh`,
      bodyOrTypeLabel(vehicle),
    ].filter(Boolean),
    priceLabel: priceLabel(vehicle),
    emiLabel: emiLabel(vehicle),
    locationLabel: "Pan India",
    ctaLabel: CTA_LABEL[vehicle.category],
    badge: vehicle.launchStatus === "just-launched" ? "New Launch" : undefined,
    sponsored,
  };
}

export function toTrendingCompactItem(vehicle: Vehicle, sponsored = false): TrendingCompactItemData {
  return {
    id: `tc-${vehicle.id}`,
    category: vehicle.category,
    name: `${vehicle.oemName} ${vehicle.modelName}`,
    vehicle,
    oemColor: oemColorOf(vehicle),
    sponsored,
  };
}

export function toRankedVehicle(vehicle: Vehicle, rank: number): RankedVehicleData {
  return {
    rank,
    name: `${vehicle.oemName} ${vehicle.modelName}`,
    metaLabel: `${vehicle.rangeKm} km · ${bodyOrTypeLabel(vehicle)}`,
    priceLabel: priceLabel(vehicle),
    href: vehicleHref(vehicle),
  };
}

export function toUpcomingItem(vehicle: Vehicle): UpcomingItemData {
  return {
    id: `up-${vehicle.id}`,
    category: vehicle.category,
    brand: vehicle.oemName,
    name: vehicle.modelName,
    vehicle,
    oemColor: oemColorOf(vehicle),
    launchLabel: vehicle.launchDate ? `Expected ${vehicle.launchDate}` : "Launch date TBA",
    expectedPriceLabel: `${formatPriceRangeLakh(vehicle.priceRangeLakh[0], vehicle.priceRangeLakh[1], "–")} (est.)`,
  };
}

/**
 * The card/listing builders below are all parameterized by `VehicleCategory`
 * rather than hand-written per category (the previous `popularCars`/
 * `popularBikes`-style twin exports) — so a new category from
 * `src/lib/data/categories.ts` gets homepage-ready data for free instead of
 * needing a new pair of consts written by hand.
 */

export function getPopularByCategory(category: VehicleCategory, limit = 6): ListingCardData[] {
  return getVehiclesByCategory(category)
    .filter((v) => v.launchStatus !== "upcoming")
    .sort((a, b) => a.priceRangeLakh[0] - b.priceRangeLakh[0])
    .slice(0, limit)
    .map((v, i) => toListingCard(v, i === 0));
}

export function getTrendingByCategory(category: VehicleCategory): TrendingCompactItemData[] {
  return getVehiclesByCategory(category).map((v, i) => toTrendingCompactItem(v, i === 0));
}

export function getRankedByCategory(category: VehicleCategory, limit = 8): RankedVehicleData[] {
  return [...getVehiclesByCategory(category)]
    .sort((a, b) => b.rangeKm - a.rangeKm)
    .slice(0, limit)
    .map((v, i) => toRankedVehicle(v, i + 1));
}

export function getUpcomingByCategory(category: VehicleCategory): UpcomingItemData[] {
  return getVehiclesByCategory(category).filter((v) => v.launchStatus === "upcoming").map(toUpcomingItem);
}

export function getBrandsByCategory(category: VehicleCategory): BrandCardData[] {
  return oems
    .filter((o) => o.categories.includes(category))
    .map((o) => ({ id: o.key, name: o.name, logo: o.logoUrl ?? null, color: o.color, slug: o.slug, category }));
}

function comparePair(id: string, category: VehicleCategory, slugA: string, slugB: string): CompareCardPairData | null {
  const pool = getVehiclesByCategory(category);
  const a = pool.find((v) => v.slug === slugA);
  const b = pool.find((v) => v.slug === slugB);
  if (!a || !b) return null;
  return {
    id,
    category,
    vehicleA: { name: `${a.oemName} ${a.modelName}`, vehicle: a, oemColor: oemColorOf(a), priceLabel: priceLabel(a) },
    vehicleB: { name: `${b.oemName} ${b.modelName}`, vehicle: b, oemColor: oemColorOf(b), priceLabel: priceLabel(b) },
  };
}

// Curated homepage compare-pairs — hand-picked slugs are fine here (it's
// editorial homepage content, not a data-coverage guarantee), but the
// machinery that resolves them (`comparePair`) is category-generic.
export const carComparisons: CompareCardPairData[] = [
  comparePair("cmp-car-1", "car", "tata-nexon-ev", "mg-zs-ev"),
  comparePair("cmp-car-2", "car", "hyundai-kona-electric", "byd-atto-3"),
  comparePair("cmp-car-3", "car", "kia-ev6", "hyundai-ioniq-5"),
].filter((p): p is CompareCardPairData => p !== null);

export const bikeComparisons: CompareCardPairData[] = [
  comparePair("cmp-bike-1", "2-wheeler", "ola-s1-pro", "ather-450x"),
  comparePair("cmp-bike-2", "2-wheeler", "tvs-iqube", "bajaj-chetak-premium"),
  comparePair("cmp-bike-3", "2-wheeler", "ola-s1-x", "ampere-nexus"),
].filter((p): p is CompareCardPairData => p !== null);
