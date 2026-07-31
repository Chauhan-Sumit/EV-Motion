import { getAllVehicles, oems } from "@/lib/data";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

export type SearchScope = VehicleCategory | "all";

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
  category: VehicleCategory;
}

const CATEGORY_KEYWORDS: CategoryKeyword[] = [
  { id: "suv", keywords: ["suv", "suvs"], label: "SUV Electric Cars", href: "/cars?type=suv", category: "car" },
  { id: "sedan", keywords: ["sedan", "sedans"], label: "Sedan Electric Cars", href: "/cars?type=sedan", category: "car" },
  {
    id: "hatchback",
    keywords: ["hatchback", "hatchbacks", "hatch"],
    label: "Hatchback Electric Cars",
    href: "/cars?type=hatchback",
    category: "car",
  },
  { id: "muv", keywords: ["muv", "muvs"], label: "MUV Electric Cars", href: "/cars?type=muv", category: "car" },
  {
    id: "scooter",
    keywords: ["scooter", "scooters", "scooty"],
    label: "Electric Scooters",
    href: "/two-wheelers?type=scooter",
    category: "2-wheeler",
  },
  {
    id: "motorcycle",
    keywords: ["bike", "bikes", "motorcycle", "motorcycles", "motorbike"],
    label: "Electric Motorcycles",
    href: "/two-wheelers?type=motorcycle",
    category: "2-wheeler",
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

/** Classic edit-distance — used only as a fallback when substring matching finds nothing, to tolerate small typos. */
function levenshtein(a: string, b: string): number {
  const dp: number[] = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) dp[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[b.length];
}

/**
 * Real vehicle search: substring match on model/brand name, plus keyword
 * routing for body-type / category terms (SUV, Sedan, Scooter, Bike, ...)
 * to the already-working listing filters (no fake `q` param round-trip).
 * `scope` restricts matching to one vehicle category (used when the
 * homepage's Car/Bike toggle is active) — "all" searches everything, which
 * is the right default for the Navbar's toggle-less global search box.
 */
export function searchVehicles(rawQuery: string, limit = 8, scope: SearchScope = "all"): SearchOutcome {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return { query: rawQuery, vehicles: [], totalVehicleMatches: 0 };
  }

  const scopedVehicles = getAllVehicles().filter((v) => scope === "all" || v.category === scope);

  let matches = scopedVehicles
    .map((vehicle) => ({ vehicle, score: matchScore(vehicle, query) }))
    .filter(({ score }) => score < 6)
    .sort((a, b) => a.score - b.score || a.vehicle.modelName.localeCompare(b.vehicle.modelName));

  // No substring hits — fall back to a small typo-tolerant pass instead of showing nothing.
  if (matches.length === 0 && query.length >= 3) {
    matches = scopedVehicles
      .map((vehicle) => {
        const model = vehicle.modelName.toLowerCase();
        const full = `${vehicle.oemName.toLowerCase()} ${model}`;
        const distance = Math.min(levenshtein(query, model), levenshtein(query, full));
        return { vehicle, score: distance };
      })
      .filter(({ score }) => score <= 2)
      .sort((a, b) => a.score - b.score || a.vehicle.modelName.localeCompare(b.vehicle.modelName));
  }

  const vehicles: VehicleSuggestion[] = matches.slice(0, limit).map(({ vehicle }) => ({
    vehicle,
    href: vehicleHref(vehicle),
    label: `${vehicle.oemName} ${vehicle.modelName}`,
  }));

  const categoryMatch = CATEGORY_KEYWORDS.find(
    (entry) => entry.keywords.includes(query) && (scope === "all" || entry.category === scope),
  );

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
