import { cars } from "@/lib/data/cars";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { oems, getOemBySlug } from "@/lib/data";
import type { Vehicle } from "@/types/vehicle";
import type {
  BrandCardData,
  CompareCardPairData,
  ListingCardData,
  RankedVehicleData,
  TrendingCompactItemData,
  UpcomingItemData,
} from "@/types/ev-motion";

/** Local brand-logo assets copied from the EV Motion template — maps OEM key -> public path. Ampere has no logo asset available. */
const BRAND_LOGOS: Record<string, string> = {
  tata: "/images/brands/tata-motors.png",
  mg: "/images/brands/mg-motors.png",
  hyundai: "/images/brands/hyundai.png",
  mahindra: "/images/brands/mahindra.png",
  byd: "/images/brands/byd.png",
  kia: "/images/brands/kia.png",
  "ola-electric": "/images/brands/ola-electric.png",
  ather: "/images/brands/ather-energy.png",
  bajaj: "/images/brands/bajaj-chetak.png",
  tvs: "/images/brands/tvs.png",
  hero: "/images/brands/hero-electric.png",
};

export function oemColorOf(vehicle: Vehicle): string {
  return getOemBySlug(vehicle.oem)?.color ?? "#1FA83C";
}

export function priceLabel(vehicle: Vehicle): string {
  return `₹${vehicle.priceRangeLakh[0].toFixed(2)}L`;
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
  return vehicle.twoWheelerType ?? "";
}

export function toListingCard(vehicle: Vehicle, sponsored = false): ListingCardData {
  return {
    id: vehicle.id,
    kind: vehicle.category === "car" ? "car" : "bike",
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
    ctaLabel: vehicle.category === "car" ? "Get Quote" : "Book Now",
    badge: vehicle.launchStatus === "just-launched" ? "New Launch" : undefined,
    sponsored,
  };
}

export function toTrendingCompactItem(vehicle: Vehicle, sponsored = false): TrendingCompactItemData {
  return {
    id: `tc-${vehicle.id}`,
    kind: vehicle.category === "car" ? "car" : "bike",
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
  };
}

export function toUpcomingItem(vehicle: Vehicle): UpcomingItemData {
  return {
    id: `up-${vehicle.id}`,
    kind: vehicle.category === "car" ? "car" : "bike",
    brand: vehicle.oemName,
    name: vehicle.modelName,
    vehicle,
    oemColor: oemColorOf(vehicle),
    launchLabel: vehicle.launchDate ? `Expected ${vehicle.launchDate}` : "Launch date TBA",
    expectedPriceLabel: `₹${vehicle.priceRangeLakh[0].toFixed(2)}–${vehicle.priceRangeLakh[1].toFixed(2)}L (est.)`,
  };
}

function comparePair(id: string, kind: "car" | "bike", slugA: string, slugB: string): CompareCardPairData | null {
  const pool = kind === "car" ? cars : twoWheelers;
  const a = pool.find((v) => v.slug === slugA);
  const b = pool.find((v) => v.slug === slugB);
  if (!a || !b) return null;
  return {
    id,
    kind,
    vehicleA: { name: `${a.oemName} ${a.modelName}`, vehicle: a, oemColor: oemColorOf(a), priceLabel: priceLabel(a) },
    vehicleB: { name: `${b.oemName} ${b.modelName}`, vehicle: b, oemColor: oemColorOf(b), priceLabel: priceLabel(b) },
  };
}

export const popularCars: ListingCardData[] = cars
  .filter((v) => v.launchStatus !== "upcoming")
  .sort((a, b) => a.priceRangeLakh[0] - b.priceRangeLakh[0])
  .slice(0, 6)
  .map((v, i) => toListingCard(v, i === 0));

export const popularBikes: ListingCardData[] = twoWheelers
  .filter((v) => v.launchStatus !== "upcoming")
  .sort((a, b) => a.priceRangeLakh[0] - b.priceRangeLakh[0])
  .slice(0, 6)
  .map((v, i) => toListingCard(v, i === 0));

export const trendingCarsCompact: TrendingCompactItemData[] = cars.map((v, i) =>
  toTrendingCompactItem(v, i === 0),
);
export const trendingBikesCompact: TrendingCompactItemData[] = twoWheelers.map((v, i) =>
  toTrendingCompactItem(v, i === 0),
);

export const rankedCars: RankedVehicleData[] = [...cars]
  .sort((a, b) => b.rangeKm - a.rangeKm)
  .slice(0, 8)
  .map((v, i) => toRankedVehicle(v, i + 1));

export const rankedScooters: RankedVehicleData[] = [...twoWheelers]
  .sort((a, b) => b.rangeKm - a.rangeKm)
  .slice(0, 8)
  .map((v, i) => toRankedVehicle(v, i + 1));

export const carBrands: BrandCardData[] = oems
  .filter((o) => o.categories.includes("car"))
  .map((o) => ({ id: o.key, name: o.name, logo: BRAND_LOGOS[o.key] ?? null, color: o.color, slug: o.slug, kind: "car" }));

export const bikeBrands: BrandCardData[] = oems
  .filter((o) => o.categories.includes("2-wheeler"))
  .map((o) => ({ id: o.key, name: o.name, logo: BRAND_LOGOS[o.key] ?? null, color: o.color, slug: o.slug, kind: "bike" }));

export const upcomingCars: UpcomingItemData[] = cars
  .filter((v) => v.launchStatus === "upcoming")
  .map(toUpcomingItem);

export const upcomingBikes: UpcomingItemData[] = twoWheelers
  .filter((v) => v.launchStatus === "upcoming")
  .map(toUpcomingItem);

export const carComparisons: CompareCardPairData[] = [
  comparePair("cmp-car-1", "car", "tata-nexon-ev", "mg-zs-ev"),
  comparePair("cmp-car-2", "car", "hyundai-kona-electric", "byd-atto-3"),
  comparePair("cmp-car-3", "car", "kia-ev6", "hyundai-ioniq-5"),
].filter((p): p is CompareCardPairData => p !== null);

export const bikeComparisons: CompareCardPairData[] = [
  comparePair("cmp-bike-1", "bike", "ola-s1-pro", "ather-450x"),
  comparePair("cmp-bike-2", "bike", "tvs-iqube", "bajaj-chetak-premium"),
  comparePair("cmp-bike-3", "bike", "ola-s1-x", "ampere-nexus"),
].filter((p): p is CompareCardPairData => p !== null);
