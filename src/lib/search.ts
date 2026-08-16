import { routeSegmentFor } from "@/lib/data/categories";
import type { VehicleCategory } from "@/types/vehicle";
import type { SearchIndex, VehicleIndexEntry } from "@/types/search-index";

/**
 * The vehicle matcher. **Deliberately free of any `@/lib/data` import** —
 * it operates on a `SearchIndex` handed in by the caller, which the browser
 * fetches from `/search-index.json` on demand.
 *
 * This module used to call `getAllVehicles()` directly. Because `Navbar`
 * lives in the root layout and is a client component, that put all 122 full
 * vehicle records into the JavaScript of every single page. Keep the import
 * list here free of catalog data.
 */

export type SearchScope = VehicleCategory | "all";

export interface VehicleSuggestion {
  entry: VehicleIndexEntry;
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

/** Accepts anything carrying a category and slug — a `Vehicle` or an index entry. */
export function vehicleHref(vehicle: { category: VehicleCategory; slug: string }): string {
  return `/${routeSegmentFor(vehicle.category)}/${vehicle.slug}`;
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
  {
    id: "three-wheeler",
    keywords: ["3-wheeler", "three-wheeler", "3wheeler", "auto", "autos", "rickshaw", "e-rickshaw"],
    label: "Electric 3-Wheelers",
    href: "/commercial?type=three-wheeler-cargo",
    category: "commercial",
  },
  {
    id: "small-truck",
    keywords: ["truck", "trucks", "lcv", "pickup"],
    label: "Electric Small Trucks / LCVs",
    href: "/commercial?type=small-truck",
    category: "commercial",
  },
  {
    id: "van",
    keywords: ["van", "vans"],
    label: "Electric Vans",
    href: "/commercial?type=van",
    category: "commercial",
  },
  {
    id: "bus",
    keywords: ["bus", "buses"],
    label: "Electric Buses",
    href: "/commercial?type=bus",
    category: "commercial",
  },
];

/** Score meaning "no match" — anything scoring this is filtered out. */
const NO_MATCH = 6;

function tokenize(value: string): string[] {
  return value.split(/[\s-]+/).filter(Boolean);
}

/**
 * Single-token scoring, lower is better. Unchanged from the original
 * matcher; `matchScore` layers multi-word handling on top of it.
 */
function singleTokenScore(model: string, oem: string, full: string, query: string): number {
  if (model === query || full === query) return 0;
  if (model.startsWith(query)) return 1;
  if (full.startsWith(query)) return 2;
  const wordStart = tokenize(model).some((w) => w.startsWith(query)) || tokenize(full).some((w) => w.startsWith(query));
  if (wordStart) return 3;
  if (model.includes(query) || full.includes(query)) return 4;
  if (oem.includes(query)) return 5;
  return NO_MATCH;
}

/**
 * Scores a query against one vehicle, lower is better.
 *
 * Multi-word queries are matched token-by-token rather than as one substring.
 * The old whole-string matcher silently failed whenever the brand's full
 * legal name sat between the words a person actually typed — "Tata Nexon"
 * found nothing, because the record reads "Tata Motors" + "Nexon EV" and
 * `"tata motors nexon ev".includes("tata nexon")` is false. That covered a
 * lot of real queries, and it's why `POPULAR_SEARCHES_BY_SCOPE` had to be
 * restricted to bare model names (see the note on it in VehicleSearchBox).
 *
 * A vehicle matches only if *every* token matches somewhere, so extra words
 * still narrow results rather than widening them. The returned score is the
 * worst (highest) token score, then nudged by token count so that a tighter
 * whole-string match still outranks a scattered multi-token one.
 */
function matchScore(entry: VehicleIndexEntry, query: string): number {
  const model = entry.modelName.toLowerCase();
  const oem = entry.oemName.toLowerCase();
  const full = `${oem} ${model}`;

  const whole = singleTokenScore(model, oem, full, query);
  const tokens = tokenize(query);
  if (tokens.length < 2) return whole;

  let worst = 0;
  for (const token of tokens) {
    const score = singleTokenScore(model, oem, full, token);
    if (score === NO_MATCH) return whole; // fall back to the whole-string result
    worst = Math.max(worst, score);
  }

  // +0.5 keeps an exact whole-string hit ahead of an equally-scored token match.
  return Math.min(whole, worst + 0.5);
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

const EMPTY_OUTCOME = (query: string): SearchOutcome => ({ query, vehicles: [], totalVehicleMatches: 0 });

/**
 * Real vehicle search: substring match on model/brand name, plus keyword
 * routing for body-type / category terms (SUV, Sedan, Scooter, Bike, ...)
 * to the already-working listing filters (no fake `q` param round-trip).
 * `scope` restricts matching to one vehicle category (used when the
 * homepage's Car/Bike toggle is active) — "all" searches everything, which
 * is the right default for the Navbar's toggle-less global search box.
 *
 * `index` is null until the lazily-fetched index arrives; callers render
 * their loading state in that window rather than a "no results" message.
 */
export function searchVehicles(
  index: SearchIndex | null,
  rawQuery: string,
  limit = 8,
  scope: SearchScope = "all",
): SearchOutcome {
  const query = rawQuery.trim().toLowerCase();

  if (!query || !index) return EMPTY_OUTCOME(rawQuery);

  const scopedVehicles = index.vehicles.filter((v) => scope === "all" || v.category === scope);

  let matches = scopedVehicles
    .map((entry) => ({ entry, score: matchScore(entry, query) }))
    .filter(({ score }) => score < NO_MATCH)
    .sort((a, b) => a.score - b.score || a.entry.modelName.localeCompare(b.entry.modelName));

  // No substring hits — fall back to a small typo-tolerant pass instead of showing nothing.
  if (matches.length === 0 && query.length >= 3) {
    matches = scopedVehicles
      .map((entry) => {
        const model = entry.modelName.toLowerCase();
        const full = `${entry.oemName.toLowerCase()} ${model}`;
        // Individual words are compared too, not just the whole names. Nearly
        // every model in this dataset ends in " EV", so a one-character typo
        // in "Nexon" scored 3+ against "nexon ev" and blew the <=2 threshold —
        // the fallback effectively only ever fired for single-word models.
        const candidates = [model, full, ...tokenize(model), ...tokenize(full)];
        const distance = Math.min(...candidates.map((candidate) => levenshtein(query, candidate)));
        return { entry, score: distance };
      })
      .filter(({ score }) => score <= 2)
      .sort((a, b) => a.score - b.score || a.entry.modelName.localeCompare(b.entry.modelName));
  }

  const vehicles: VehicleSuggestion[] = matches.slice(0, limit).map(({ entry }) => ({
    entry,
    href: vehicleHref(entry),
    label: `${entry.oemName} ${entry.modelName}`,
  }));

  // A keyword only routes somewhere if that category actually has vehicles.
  // Without this, typing "truck" or "bus" offered an "Electric Small Trucks"
  // shortcut into an empty `/commercial` listing — the commercial category
  // has full architecture but no data yet.
  const populatedCategories = new Set(index.vehicles.map((v) => v.category));
  const categoryMatch = CATEGORY_KEYWORDS.find(
    (entry) =>
      entry.keywords.includes(query) &&
      (scope === "all" || entry.category === scope) &&
      populatedCategories.has(entry.category),
  );

  let brandMatch: LinkSuggestion | undefined;
  const oemHit = index.oems.find((oem) => oem.name.toLowerCase().includes(query) || oem.key === query);
  if (oemHit && matches.length > 0 && matches.every(({ entry }) => entry.oem === oemHit.key)) {
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
