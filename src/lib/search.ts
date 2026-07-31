import { getAllVehicles, oems } from "@/lib/data";
import type { Vehicle } from "@/types/vehicle";

export interface VehicleSuggestion {
  vehicle: Vehicle;
  href: string;
  label: string;
}

export interface LinkSuggestion {
  id: string;
  label: string;
  href: string;
}

export interface SearchOutcome {
  query: string;
  vehicles: VehicleSuggestion[];
  totalVehicleMatches: number;
  categoryMatch?: LinkSuggestion;
  brandMatch?: LinkSuggestion;
}

export function vehicleHref(vehicle: Vehicle): string {
  return vehicle.category === "car" ? `/cars/${vehicle.slug}` : `/two-wheelers/${vehicle.slug}`;
}

interface CategoryKeyword {
  id: string;
  keywords: string[];
  label: string;
  href: string;
}

const CATEGORY_KEYWORDS: CategoryKeyword[] = [
  { id: "suv", keywords: ["suv", "suvs"], label: "SUV Electric Cars", href: "/cars?type=suv" },
  { id: "sedan", keywords: ["sedan", "sedans"], label: "Sedan Electric Cars", href: "/cars?type=sedan" },
  {
    id: "hatchback",
    keywords: ["hatchback", "hatchbacks", "hatch"],
    label: "Hatchback Electric Cars",
    href: "/cars?type=hatchback",
  },
  { id: "muv", keywords: ["muv", "muvs"], label: "MUV Electric Cars", href: "/cars?type=muv" },
  {
    id: "scooter",
    keywords: ["scooter", "scooters", "scooty"],
    label: "Electric Scooters",
    href: "/two-wheelers?type=scooter",
  },
  {
    id: "motorcycle",
    keywords: ["bike", "bikes", "motorcycle", "motorcycles", "motorbike"],
    label: "Electric Motorcycles",
    href: "/two-wheelers?type=motorcycle",
  },
];

function matchScore(vehicle: Vehicle, query: string): number {
  const model = vehicle.modelName.toLowerCase();
  const oem = vehicle.oemName.toLowerCase();
  const full = `${oem} ${model}`;

  if (model === query || full === query) return 0;
  if (model.startsWith(query)) return 1;
  if (full.startsWith(query)) return 2;
  const wordStart = model.split(" ").some((w) => w.startsWith(query)) || full.split(" ").some((w) => w.startsWith(query));
  if (wordStart) return 3;
  if (model.includes(query) || full.includes(query)) return 4;
  if (oem.includes(query)) return 5;
  return 6;
}

/**
 * Real vehicle search: substring match on model/brand name, plus keyword
 * routing for body-type / category terms (SUV, Sedan, Scooter, Bike, ...)
 * to the already-working listing filters (no fake `q` param round-trip).
 */
export function searchVehicles(rawQuery: string, limit = 8): SearchOutcome {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return { query: rawQuery, vehicles: [], totalVehicleMatches: 0 };
  }

  const allVehicles = getAllVehicles();

  const matches = allVehicles
    .map((vehicle) => ({ vehicle, score: matchScore(vehicle, query) }))
    .filter(({ score }) => score < 6)
    .sort((a, b) => a.score - b.score || a.vehicle.modelName.localeCompare(b.vehicle.modelName));

  const vehicles: VehicleSuggestion[] = matches.slice(0, limit).map(({ vehicle }) => ({
    vehicle,
    href: vehicleHref(vehicle),
    label: `${vehicle.oemName} ${vehicle.modelName}`,
  }));

  const categoryMatch = CATEGORY_KEYWORDS.find((entry) => entry.keywords.includes(query));

  let brandMatch: LinkSuggestion | undefined;
  const oemHit = oems.find((oem) => oem.name.toLowerCase().includes(query) || oem.key === query);
  if (oemHit && matches.length > 0 && matches.every(({ vehicle }) => vehicle.oem === oemHit.key)) {
    brandMatch = {
      id: `brand-${oemHit.key}`,
      label: `View all ${matches.length} ${oemHit.name} vehicles`,
      href: `/brands/${oemHit.slug}`,
    };
  }

  return {
    query: rawQuery,
    vehicles,
    totalVehicleMatches: matches.length,
    categoryMatch,
    brandMatch,
  };
}
